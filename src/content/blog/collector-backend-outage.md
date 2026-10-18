---
title: "O que acontece quando seu backend de telemetria cai?"
slug: "collector-backend-outage"
description: "Entenda retries, filas e armazenamento persistente no Collector: o que resiste à queda do backend e ao reinício do processo."
publishedAt: "2026-10-21"
author: "juraci"
tags: ["opentelemetry-collector", "engenharia-de-observabilidade"]
heroImage: "../../assets/blog/collector-backend-outage.webp"
heroImageAlt: "Um reservatório finito de blocos de telemetria ao lado de uma conexão interrompida com um backend."
sourceUrl: "https://telemetrydrops.com/blog/collector-backend-outage/"
tldr: "A fila de envio dá tempo durante uma queda do backend. A persistência protege a fila num reinício, mas não elimina limites nem garante entrega."
keyTakeaways: ["Retries tratam falhas temporárias; a capacidade da fila limita quantos dados adicionais podem esperar.", "Uma fila persistente protege os dados que chegam a ela, desde que o armazenamento sobreviva ao reinício.", "A recuperação exige vazão de exportação maior que a taxa de ingestão.", "Teste separadamente a queda do backend e o reinício do Collector, verificando os registros no destino."]
faqEntries: [{"question": "O Collector perde dados quando o backend fica indisponível?", "answer": "Ele pode armazenar dados temporariamente e tentar de novo, mas overflow, esgotamento de retries, erros permanentes ou falhas em outras partes do pipeline ainda podem causar perda. O resultado depende da configuração e dos componentes anteriores."}, {"question": "file_storage torna o pipeline inteiro persistente?", "answer": "Não. Referenciado em sending_queue.storage, ele persiste a fila daquele exporter. Dados ainda no SDK ou em processadores anteriores ficam fora dessa proteção, e o volume precisa sobreviver ao reinício."}, {"question": "max_elapsed_time define a idade máxima dos dados na fila?", "answer": "Não. Ele limita a sequência de tentativas de exportação de uma requisição, não a retenção da fila inteira. Zero remove o prazo, mas não os limites de capacidade nem os erros permanentes."}]
---

Sua aplicação está saudável. As requisições terminam, os logs são emitidos e o Collector está rodando. Então o backend de observabilidade fica indisponível.

Por algum tempo, nada parece mudar. O Collector continua recebendo telemetria. Os painéis param de atualizar. Quando o backend volta, você descobre uma lacuna exatamente no período que queria investigar.

Para onde foram os dados?

As aulas de resiliência da Trilha OpenTelemetry trabalham com três camadas: filas em memória, filas persistentes e mensageria externa. A escolha começa pela falha à qual você precisa resistir. Uma queda do backend e um reinício do Collector exigem coisas diferentes do pipeline.

## Siga o caminho da exportação que falhou

Considere este caminho:

1. **Aplicação:** emite telemetria.
2. **Receiver:** recebe os dados no Collector.
3. **Processors:** processam a telemetria.
4. **Fila do exporter:** armazena exportações pendentes.
5. **Backend:** recebe as exportações.

A fila guarda telemetria pendente. Exportações em novas tentativas também consomem capacidade enquanto o backend está indisponível.

Quando o backend para de aceitar dados, os workers de exportação encontram falhas. Para erros recuperáveis, esperam e tentam novamente. Enquanto isso, novos dados preenchem a fila de envio. Uma interrupção curta pode terminar antes de esgotar a capacidade ou o orçamento de tentativas. Uma mais longa expõe esses limites. O [guia de resiliência do Collector](https://opentelemetry.io/docs/collector/resiliency/) descreve essas fronteiras.

Há duas perguntas: por quanto tempo um worker deve tentar exportar uma requisição e quantos dados adicionais podem esperar atrás dela?

Tempo de retry não responde à questão da capacidade. Uma fila não transforma um erro permanente em recuperável.

## Retries compram oportunidades; filas compram capacidade

Para o exporter OTLP/gRPC no Collector Contrib 0.163.1, explicite a política:

```yaml
exporters:
  otlp_grpc/backend:
    endpoint: backend:4317
    tls:
      insecure: true
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 5s
      max_elapsed_time: 10m
    sending_queue:
      enabled: true
      sizer: requests
      queue_size: 5000
      num_consumers: 4
```



`otlp_grpc` é o nome atual do exporter gRPC; `otlp` continua como alias depreciado de exporter. O receiver OTLP ainda se chama `otlp`, inclusive para HTTP. Os [metadados versionados do exporter](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/exporter/otlpexporter/metadata.yaml) identificam nome e alias.

A conexão sem criptografia serve ao laboratório local. Em produção, configure TLS e autenticação conforme o destino.

Aqui, a capacidade é medida em requisições, não em spans ou bytes. O [limite da fila](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/exporter/exporterhelper/internal/queuebatch/config.go) inclui requisições enfileiradas e em processamento, inclusive em retry. Os workers não adicionam capacidade fora dele. `max_elapsed_time` limita a sequência de tentativas de uma requisição, não a retenção da fila inteira. O valor `0` remove esse prazo, mas erros permanentes continuam encerrando as tentativas. Consulte a [configuração do exporter helper](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/exporter/exporterhelper/README.md) e a [implementação de retry](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/exporter/exporterhelper/internal/retry_sender.go) nas versões citadas.

Suponha que cheguem 20 requisições por segundo a uma fila inicialmente vazia. Durante uma indisponibilidade completa, 5.000 posições permitem cerca de 250 segundos de espera. É uma estimativa de planejamento: tamanho das requisições, posições já ocupadas, trabalho em andamento e picos de tráfego afetam o resultado.

E a recuperação? Se o backend aceita 30 requisições por segundo enquanto 20 novas continuam chegando, sobram apenas 10 por segundo para esvaziar o acúmulo. Uma fila de 5.000 requisições levaria aproximadamente 500 segundos para drenar nessas condições.

O orçamento de indisponibilidade precisa incluir a recuperação. Se a exportação apenas acompanha a ingestão, o acúmulo permanece.

## A contrapressão precisa chegar a quem pode tentar de novo

No comportamento padrão não bloqueante de overflow, uma fila cheia rejeita novas entradas. Esses registros nem chegam ao ciclo de retry do exporter. Sua recuperação depende dos componentes anteriores. Siga o caminho do erro até a origem, sem presumir que todo registro rejeitado será reenviado.

A pressão de memória cria outra fronteira. O processador `memory_limiter` pode recusar dados com um erro não permanente, permitindo que componentes compatíveis tentem de novo. Coloque-o primeiro na lista de processadores e reserve margem de memória para o processo. Ele protege o Collector contra esgotamento de memória; não oferece armazenamento. A [documentação do memory limiter](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/processor/memorylimiterprocessor/README.md) explica essas responsabilidades.

## Reiniciar o Collector é uma falha diferente

Uma fila em memória pode atravessar a queda do backend enquanto o Collector continua vivo. Se o processo morrer, os dados enfileirados não têm armazenamento durável.

Uma fila de exporter apoiada em `file_storage` trata essa fronteira. Habilite a extensão em `service.extensions` e referencie-a em `sending_queue.storage`. O diretório precisa ser gravável e sobreviver à substituição do processo ou container. Consulte a [extensão de armazenamento em arquivo](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/v0.163.0/extension/storage/filestorage/README.md).

A proteção começa quando os dados chegam à fila persistente. Um processador batch separado ainda pode manter dados antes dela. Seu tamanho e timeout controlam o envio dos lotes, não a persistência em disco. Veja a [documentação do processador batch](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/processor/batchprocessor/README.md).

Isso sugere um teste: envie um registro identificável durante a queda do backend, confirme que chegou à fila, mate o Collector e procure o mesmo registro depois da recuperação.

## Experimente a interrupção

O laboratório usa dois Collectors. Um é o gateway sob teste; o outro representa o backend e imprime os logs recebidos. Usa Contrib **0.163.1**, release mais recente conferida no artigo original em 18 de outubro de 2026, fixada pelo digest da imagem multiplataforma. Ambos usam o mesmo artefato. O [manifest da distribuição 0.163.1](https://github.com/open-telemetry/opentelemetry-collector-releases/blob/v0.163.1/distributions/otelcol-contrib/manifest.yaml) inclui módulos 0.163.0, por isso as citações de código usam essas tags. O experimento começa com armazenamento novo; não testa migração de uma fila existente.

Você precisa de Docker com Compose v2 e curl. Salve os três arquivos abaixo em um diretório vazio. Em `gateway.yaml`, omita deliberadamente um processador batch separado para isolar a fila do exporter:

```yaml
receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 1s
    limit_mib: 256
    spike_limit_mib: 64

extensions:
  file_storage:
    directory: /var/lib/otelcol/storage
    create_directory: true
    fsync: true

exporters:
  otlp_grpc/backend:
    endpoint: backend:4317
    tls:
      insecure: true
    retry_on_failure:
      enabled: true
      initial_interval: 1s
      max_interval: 5s
      max_elapsed_time: 0
    sending_queue:
      enabled: true
      sizer: requests
      queue_size: 100
      num_consumers: 1
      storage: file_storage

service:
  extensions: [file_storage]
  pipelines:
    logs:
      receivers: [otlp]
      processors: [memory_limiter]
      exporters: [otlp_grpc/backend]
```



Use `backend.yaml` para tornar a entrega visível:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
exporters:
  debug:
    verbosity: detailed
service:
  pipelines:
    logs:
      receivers: [otlp]
      exporters: [debug]
```



Por fim, salve `compose.yaml`:

```yaml
name: collector-outage-lab
services:
  gateway:
    image: otel/opentelemetry-collector-contrib:0.163.1@sha256:1175b03003053962012f5a231f5567f66a3e8fdb960c7835c0e48f7aa1555806
    user: "0:0"
    mem_limit: 512m
    environment:
      GOMEMLIMIT: 200MiB
    ports:
      - "127.0.0.1:24318:4318"
    volumes:
      - ./gateway.yaml:/etc/otelcol-contrib/config.yaml:ro,z
      - queue-data:/var/lib/otelcol
  backend:
    image: otel/opentelemetry-collector-contrib:0.163.1@sha256:1175b03003053962012f5a231f5567f66a3e8fdb960c7835c0e48f7aa1555806
    mem_limit: 512m
    volumes:
      - ./backend.yaml:/etc/otelcol-contrib/config.yaml:ro,z
volumes:
  queue-data:
```



O agrupamento em lotes na fila do exporter é [opcional nesta release](https://github.com/open-telemetry/opentelemetry-collector/blob/v0.163.0/exporter/exporterhelper/internal/queuebatch/config.go). O laboratório não define `sending_queue.batch` nem habilita uma feature gate de batching, para manter o foco na fila medida em requisições.

O gateway roda como root apenas para simplificar as permissões do volume nomeado neste laboratório local. Em produção, dê ao usuário do Collector a propriedade do diretório de armazenamento. O volume nomeado preserva a fila quando o container é recriado.

Valide e inicie a configuração:

```bash
docker compose run --rm --no-deps gateway validate --config /etc/otelcol-contrib/config.yaml
docker compose run --rm --no-deps backend validate --config /etc/otelcol-contrib/config.yaml
docker compose up -d
docker compose stop backend
```



Envie um registro com um corpo identificável. Se a conexão falhar inicialmente, aguarde a mensagem de inicialização do gateway:

```bash
curl --fail-with-body --retry 15 --retry-connrefused --retry-delay 1 --retry-max-time 30 \
  http://localhost:24318/v1/logs \
  -H 'Content-Type: application/json' \
  --data '{"resourceLogs":[{"resource":{"attributes":[{"key":"service.name","value":{"stringValue":"outage-lab"}}]},"scopeLogs":[{"scope":{"name":"outage-lab"},"logRecords":[{"severityNumber":9,"severityText":"INFO","body":{"stringValue":"survive-restart-001"}}]}]}]}'
```



Inspecione os logs do gateway em busca de novas tentativas de exportação. Uma resposta bem-sucedida do gateway, sozinha, não comprova entrega ao backend.

```bash
docker compose logs gateway
```



Quando o gateway estiver tentando novamente, mate-o e recrie o container enquanto o backend continua parado:

```bash
docker compose kill -s SIGKILL gateway
docker compose up -d --no-deps --force-recreate gateway
docker compose start backend
docker compose logs -f backend
```



Procure `survive-restart-001` na saída do backend. Sua chegada demonstra a recuperação daquele registro tanto da interrupção do backend quanto da falha do gateway. Não estabelece entrega exatamente uma vez nem sobrevivência a falha de disco.

Para comparar, remova `storage: file_storage` de `sending_queue`, limpe o laboratório e repita com outro marcador. Matar o gateway elimina então o buffer em memória antes que o backend receba o registro.

O artigo original relata os seguintes resultados em Linux/arm64 com a imagem 0.163.1 fixada:

| Fila | Registro enviado com backend parado | Resultado após falha do gateway e recuperação |
| --- | --- | --- |
| Persistente | `survive-restart-001` | Apareceu na saída debug do backend |
| Em memória | `memory-only-001` | Não apareceu; um novo registro `recovery-control-001` chegou |

O controle confirma que a ausência do marcador no segundo experimento não foi causada apenas por um backend ainda indisponível. Verificações separadas com o mesmo binário confirmaram que uma fila em memória de uma requisição rejeita a segunda com HTTP 503 enquanto a primeira está em retry, e que um orçamento de retry de dois segundos descarta o registro antes da recuperação. A persistência não elimina esses limites.

Depois de cada experimento, encerre o acompanhamento dos logs com Ctrl+C e limpe:

```bash
docker compose down -v
```



O `-v` apaga o volume da fila deste laboratório. Espere terminar a inspeção dos resultados.

## Observe a recuperação com a mesma atenção

Um processo rodando é apenas uma evidência. Acompanhe ocupação e capacidade da fila, falhas ao enfileirar, recusas do receiver e exportações bem-sucedidas. Para logs, nomes úteis incluem `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, `otelcol_exporter_enqueue_failed_log_records` e `otelcol_exporter_sent_log_records`. Formato de exportação e versão podem alterar os nomes apresentados; consulte a [documentação de telemetria interna](https://opentelemetry.io/docs/collector/internal-telemetry/).

Combine as medições com um registro identificável no destino. Uma fila diminuindo é animadora, mas você ainda precisa distinguir entrega de descarte. Mantenha um caminho de monitoramento disponível durante a interrupção testada.

## Quando a persistência local não basta

Se o cenário inclui perder o armazenamento do gateway ou manter um grande acúmulo independentemente das instâncias do Collector, um broker externo como Kafka pode atender melhor. Isso adiciona decisões sobre retenção, replicação, capacidade e operação.

Verifique também quando o Collector consumidor marca as mensagens como processadas. Aceitar dados em outro buffer assíncrono é diferente de entregá-los ao backend. A [configuração do receiver Kafka](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/v0.163.0/receiver/kafkareceiver/README.md) expõe controles de marcação e commit; teste o caminho inteiro em vez de tratar Kafka como garantia universal de entrega.

Antes de dimensionar um pipeline, descreva a falha tolerável: taxa de chegada, duração máxima da indisponibilidade, possibilidade de perder o Collector ou seu disco, perda aceitável e prazo para recuperação. Depois exercite essa falha contra o desenho.

Essas são as perguntas das aulas sobre filas, WAL, mensageria e monitoramento da [Trilha OpenTelemetry](/products/trilha-otel/). O resultado mais útil é uma resposta medida: **quando este backend falha, qual telemetria sobrevive e como sabemos?**
