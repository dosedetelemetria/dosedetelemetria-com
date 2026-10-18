---
title: "Roteie logs por severidade com o OpenTelemetry Collector"
slug: "severity-based-log-routing"
description: "Roteie logs por severidade no Collector: envie os críticos ao fornecedor e arquive os demais em armazenamento econômico."
publishedAt: "2026-04-01"
author: "juraci"
tags: ["opentelemetry-collector", "logs", "observabilidade"]
heroImage: "../../assets/blog/severity-based-log-routing.webp"
heroImageAlt: "Um Collector separa a telemetria em um canal de análise e outro de arquivamento."
sourceUrl: "https://telemetrydrops.com/blog/severity-based-log-routing/"
tldr: "Use o conector routing para enviar WARN e ERROR ao fornecedor e arquivar DEBUG e INFO. A separação acontece no pipeline."
keyTakeaways: ["O conector routing avalia cada registro pela severidade.", "Use action: move para evitar duplicação entre pipelines.", "Ajuste os lotes ao destino: baixa latência para alertas e vazão para arquivos.", "Escolha o limiar de acordo com a distribuição dos seus logs e as necessidades operacionais."]
faqEntries: [{"question": "Como rotear logs por severidade no Collector?", "answer": "Use o conector routing com uma condição como severity_number >= SEVERITY_NUMBER_WARN. Os registros correspondentes seguem para o pipeline definido; os demais, para o padrão."}, {"question": "Qual é a diferença entre move e copy?", "answer": "Com action: move, os registros correspondentes seguem para um destino. No comportamento padrão copy, também seguem para o pipeline padrão, duplicando-os."}]
---

Nem todo log precisa da mesma camada de armazenamento. Mensagens ERROR e WARN pedem consultas rápidas porque acionam alertas e orientam investigações. Mensagens DEBUG e INFO fornecem contexto para entender o que aconteceu antes de um erro. Esse uso investigativo pode tolerar consultas mais lentas em troca de custos menores.

O conector routing do OpenTelemetry Collector permite essa divisão. Você define uma condição de severidade e o conector encaminha cada registro ao pipeline correspondente.

## A configuração

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

connectors:
  routing:
    default_pipelines: [logs/standard]
    error_mode: ignore
    table:
      - context: log
        condition: severity_number >= SEVERITY_NUMBER_WARN
        action: move
        pipelines: [logs/critical]

exporters:
  debug/critical:
    verbosity: detailed
  debug/standard:
    verbosity: detailed

service:
  telemetry:
    logs:
      level: info
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [routing]
    logs/critical:
      receivers: [routing]
      exporters: [debug/critical]
    logs/standard:
      receivers: [routing]
      exporters: [debug/standard]
```


Três pipelines formam a topologia. O primeiro recebe todos os logs via OTLP e os exporta para o conector routing. Registros com `severity_number >= SEVERITY_NUMBER_WARN` (13 ou mais, incluindo WARN, ERROR e FATAL) são movidos para o pipeline crítico. Os demais seguem para o pipeline padrão, definido em `default_pipelines`.

O `context: log` avalia cada registro individualmente, em vez de um lote por recurso. O `action: move` garante que os registros correspondentes sigam para apenas um destino; sem ele, o comportamento padrão `copy` os envia tanto ao pipeline correspondente quanto ao padrão. O `error_mode: ignore` evita que erros de avaliação de OTTL descartem dados em produção.

## Experimente localmente

Inicie o Collector com a configuração salva em `config.yaml`:

```bash
otelcol-contrib --config config.yaml
```


Envie logs de severidades diferentes usando `telemetrygen`. Os exemplos abaixo enviam WARN e ERROR ao pipeline crítico, e INFO e DEBUG ao padrão:

```bash
# WARN logs -> routed to critical pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 13 --severity-text WARN \
  --body "disk usage above threshold"

# ERROR logs -> routed to critical pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 17 --severity-text ERROR \
  --body "connection refused to database"

# INFO logs -> routed to standard pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 9 --severity-text INFO \
  --body "request processed successfully"

# DEBUG logs -> routed to standard pipeline
telemetrygen logs --otlp-insecure --logs 2 \
  --severity-number 5 --severity-text DEBUG \
  --body "cache lookup key=user-123"
```


A saída do Collector permite conferir a separação: WARN e ERROR devem aparecer em `debug/critical`; INFO e DEBUG, em `debug/standard`.

## Da demonstração à produção

Em um deployment real, substitua os exporters de depuração pelos destinos de fato. O pipeline crítico envia os logs ao fornecedor de observabilidade, como Grafana Cloud ou Datadog, com lotes ajustados para entrega próxima do tempo real. O pipeline padrão usa armazenamento mais econômico, como arquivos locais ou armazenamento de objetos, com lotes maiores para melhorar a eficiência de escrita.

```yaml
exporters:
  otlp/vendor:
    endpoint: your-vendor-endpoint:4317

  file/archive:
    path: ./archive.jsonl
    rotation:
      max_megabytes: 100
      max_days: 7

processors:
  batch/vendor:
    timeout: 1s
    send_batch_size: 1024

  batch/archive:
    timeout: 10s
    send_batch_size: 5000
```


Cada pipeline recebe seu próprio processador batch, ajustado ao destino. O fornecedor precisa de baixa latência para alertas. O arquivo precisa de vazão para escritas eficientes. O trecho acima define os componentes; conecte cada processador e exporter ao pipeline correspondente.

## Onde colocar o limiar

O exemplo encaminha WARN e níveis superiores ao fornecedor. Essa é uma decisão de política. Se os painéis operacionais dependem de INFO, use `SEVERITY_NUMBER_INFO` e arquive apenas DEBUG e TRACE. O impacto financeiro depende da distribuição: se 90% do volume é DEBUG, arquivar esse nível traz economia significativa. Se INFO domina, talvez também precise ser arquivado para reduzir o custo de forma relevante.
