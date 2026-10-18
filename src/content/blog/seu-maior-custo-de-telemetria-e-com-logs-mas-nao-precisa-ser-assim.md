---
title: "Seu maior custo de telemetria é com logs. Mas não precisa ser assim."
slug: "seu-maior-custo-de-telemetria-e-com-logs-mas-nao-precisa-ser-assim"
description: "Como reduzir custos de telemetria convertendo eventos repetitivos de logs em métricas com OpenTelemetry."
publishedAt: "2024-01-21T23:00:50.634Z"
author: "juraci"
tags: ["metricas", "observabilidade", "logs", "opentelemetry", "opentelemetry-collector"]
heroImage: "../../assets/blog/seu-maior-custo-de-telemetria-e-com-logs-mas-nao-precisa-ser-assim.png"
heroImageAlt: "Painéis de logs e gráficos com papéis acumulados, ilustrando custos de telemetria."
seoTitle: "Como reduzir custos de logs com OpenTelemetry"
historicalNote: "Este artigo foi publicado em janeiro de 2024. Os exemplos originais foram preservados e usam APIs e componentes daquela época, como o exporter logging. Não foram atualizados nem revalidados nesta migração."
---

Um dos maiores desafios e custos associados à observabilidade de um sistema é a necessidade de transmitir e armazenar registros detalhados de eventos (logs). Apesar dos custos, esses registros são essenciais para o monitoramento e solução de problemas. Geralmente, cada registro é armazenado localmente em um arquivo de texto simples e enviado para um local central para armazenamento e pesquisa.

Neste sistema de armazenamento de logs, eles geralmente passam por compressão para reduzir os custos de armazenament, e indexação para facilitar a busca e recuperação posterior. Mesmo depois de tudo isso, muitos desses registros podem nunca mais serem vistos ou consultados novamente. Com tudo isso em mente, não preciso ser um mágico ou vidente para adivinhar que o maior custo que você tem em sua solução de observabilidade está relacionado aos logs.

***💡 E se eu te dissesse que você pode reduzir boa parte de seus custos de observabilidade utilizando uma estratégia muito simples?***

Ao analisarmos nossos registros de logs, fica claro que o papel mais importante da maioria deles é informar quando um determinado evento ocorreu. Uma vez armazenados, agregamos essas informações em tempo de consulta para saber quantas vezes o evento aconteceu em um determinado período de tempo. E é exatamente para isso que temos outro sinal: métricas. Elas são armazenadas geralmente em um banco de dados temporal, onde o nome do evento é armazenado apenas uma vez, e os diferentes valores em cada intervalo de tempo são armazenados com um alto grau de compressão. O resultado é que cada ocorrência de um evento ocupa, estatisticamente, menos de 1.5 bytes, enquanto o registro do evento de log armazenará tanto a representação em texto puro quanto os índices utilizados para busca, resultando em um custo de armazenamento muito superior.

***💡Cada ocorrência de um evento ocupa, estatisticamente, menos de 1.5 bytes como métrica. Ao calcular o custo de uma solução de logs, usa-se 200 bytes para cada ocorrência como ponto de partida.***

Não estou dizendo que TODOS os eventos devem ser migrados de logs para métricas, mas muitos dos eventos que armazenamos hoje podem sim ser convertidos.

## Como fazer a conversão

A melhor forma de se fazer a conversão é ao alterar a instrumentação no seu próprio código. Por exemplo, onde antes víamos algo assim…

```go
log.Info("chamada http recebida para / , status é 200")
```

… agora temos algo assim ao usar a API de métricas do OpenTelemetry:

```go
// em um código de inicialização:
contadorHTTP, err := meter.Int64Counter(
		"http.calls",
		metric.WithDescription("Quantidade de vezes que recebemos uma chamada HTTP."),
	)

// no nosso handler HTTP, adicionamos 1 ao contador
contadorHTTP.Add(r.Context(), 1, metric.WithAttributes(semconv.HTTPStatusCode(200))))
```

A segunda forma de se fazer isso é utilizar o OpenTelemetry Collector para converter de um sinal para o outro. Por exemplo, pode-se utilizar o `count connector` juntamente com um filtro, para que apenas eventos pré-selecionados sejam convertidos em métricas. Todos os outros eventos continuam como logs:

```yaml
receivers:
  otlp:
    protocols:
      grpc:

processors:
  filter/remove-common-events:
    logs:
      log_record:
        - 'IsMatch(body, ".*http call made to route.*")'

  filter/retain-common-events:
    logs:
      log_record:
        - 'not IsMatch(body, ".*http call made to route.*")'

exporters:
  logging/metrics:
    verbosity: detailed
  logging/logs:

connectors:
  count:
  forward:

service:
  pipelines:
    # a pipeline principal, direcionando os dados para as outras pipelines de logs
    logs:
      receivers:
        - otlp
      exporters:
        - forward
    
    # filtra os eventos comuns, mantendo o restante
    logs/everything-else:
      receivers:
        - forward
      processors:
        - filter/remove-common-events
      exporters:
        - logging/logs
    
    # mantem apenas os eventos comuns
    logs/common-events:
      receivers:
        - forward
      processors:
        - filter/retain-common-events
      exporters:
        - count
    
    # converte logs em metricas
    metrics/count-common-events:
      receivers:
        - count
      exporters:
        - logging/metrics
```

Com isso, se detectarmos que o evento com o texto “http call made to route” é muito comum em nosso ambiente, podemos convertê-lo em métricas diretamente no Collector. Para testar, podemos utilizar o `telemetrygen` para gerar dois tipos de registros de logs, um que vai ser convertido pra métricas, e outro que não:

```bash
telemetrygen logs --otlp-insecure --logs 10 --body "http call made to route '/', status=200"
telemetrygen logs --otlp-insecure --logs 10 --body "some other message"
```

Entre um comando e outro, veja as métricas internas do nosso Collector, pra ter certeza de que logs foram convertidos para métricas e de logs que continuaram sendo logs. Dê uma olhada nas métricas `otelcol_exporter_sent_metric_points` , `otelcol_exporter_sent_log_records` e `otelcol_receiver_accepted_log_records`:

* ao rodar o primeiro comando, o Collector deve ter aceito 10 registros de log, exportado 10 pontos de dados de métricas, e nenhum log
    
* ao rodar o segundo comando, o Collector deve ter aceito 20 registros de log, exportado 10 pontos de dados de métricas, e 10 registros de log
    

## Conclusão

Muito provavelmente você tem um sistema que emite logs, mas não emite métricas. Por este motivo, você acaba usando ferramentas de log quando seu interesse está na verdade em métricas. Porém, os custos acabam sendo muito mais altos do que se o sinal adequado fosse utilizado. A conversão de logs em métricas não só otimiza os custos de armazenamento e transmissão, mas também pode melhorar a eficiência na análise de dados e na detecção de problemas.
