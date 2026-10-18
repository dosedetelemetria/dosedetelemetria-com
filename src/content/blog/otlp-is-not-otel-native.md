---
title: "Suportar OTLP não é suportar OpenTelemetry"
slug: "otlp-is-not-otel-native"
description: "Receber OTLP é só o começo. Suportar OpenTelemetry também exige preservar seu modelo de dados e convenções."
publishedAt: "2026-05-25"
author: "juraci"
tags: ["opentelemetry", "engenharia-de-observabilidade", "opentelemetry-collector"]
heroImage: "../../assets/blog/otlp-is-not-otel-native.webp"
heroImageAlt: "Dois envelopes contrastam telemetria estruturada com blocos de dados desorganizados."
sourceUrl: "https://telemetrydrops.com/blog/otlp-is-not-otel-native/"
tldr: "OTLP é o envelope; ser nativo de OpenTelemetry significa entender a carta. Avalie convenções, recursos, versões e portabilidade."
keyTakeaways: ["Decodificar OTLP é apenas o começo; o valor está no vocabulário compartilhado.", "Um backend nativo entende as convenções sem exigir tradução de atributos.", "Rastros, métricas e logs precisam compartilhar o modelo de recursos.", "Mudanças de versão das convenções precisam ser tratadas explicitamente.", "Uma distribuição do Collector também pode criar dependência do fornecedor se alterar a semântica na saída."]
faqEntries: [{"question": "Qual é a diferença entre suporte a OTLP e a OpenTelemetry?", "answer": "OTLP permite receber e decodificar o formato de transmissão. O suporte nativo a OpenTelemetry preserva e entende o modelo: convenções semânticas, recursos compartilhados e mudanças de versão."}, {"question": "Como reconhecer um backend nativo de OpenTelemetry?", "answer": "Observe a ingestão. Um backend nativo agrupa por service.name e entende os atributos das convenções sem exigir aliases ou mapeamentos para campos proprietários."}, {"question": "Uma distribuição do Collector pode criar dependência de fornecedor mesmo usando OTLP?", "answer": "Sim. Ela pode receber e emitir OTLP enquanto renomeia atributos ou desmonta o modelo de recursos. O formato continua válido, mas a semântica pode virar um dialeto privado."}]
---

Abra a página de preços de um fornecedor e você encontrará “suporte a OpenTelemetry” como uma funcionalidade, geralmente acompanhada de uma marca de seleção que significa “aceitamos OTLP”. Aceitar o OpenTelemetry Protocol (OTLP) significa abrir uma porta e decodificar o formato de transmissão. É a parte mais simples e a mais promovida.

OTLP é o envelope. Ser nativo de OpenTelemetry significa ler a carta. Um produto que recebe OTLP e ignora o significado dos dados não entende OpenTelemetry só por transportá-lo, assim como um servidor de email não domina todos os idiomas das mensagens que entrega. O valor está no vocabulário compartilhado, onde se concentram o trabalho e a dependência do fornecedor.

Este artigo explica o que significa ser nativo de OpenTelemetry nos dois lados do pipeline: no backend que lê a telemetria e no agente que a produz. A questão é preservar e compreender o modelo depois da decodificação de OTLP.

## O vocabulário compartilhado é o ponto central

As convenções semânticas do OpenTelemetry definem nomes canônicos para os conceitos descritos pela telemetria. Um span de servidor HTTP tem `http.request.method` e `http.response.status_code`. Um span de cliente de banco de dados usa `db.system.name`. Esses nomes são um contrato entre o código que produz a telemetria e todas as ferramentas que a consultam depois.

Um backend nativo trabalha com esse contrato sem tradução. Agrupa por `service.name` porque esse atributo de recurso identifica o serviço, sem exigir um alias. Reconhece `http.response.status_code` como a chave do status HTTP, em vez de `status`, `http_status` ou `responseCode`. Exibe o tipo de span do OpenTelemetry sem convertê-lo para uma noção particular de “transação” ou “segmento”.

Observe a ingestão. Se a ferramenta exige mapear atributos para campos internos antes que os painéis funcionem, ela é compatível com OTLP, mas não nativa de OpenTelemetry. Esse mapeamento é a fronteira onde o modelo se perde. Quando `http.response.status_code` vira o campo proprietário `status_code`, painéis, alertas e consultas passam a usar um idioma privado.

O comportamento nativo aparece nos detalhes: um preenchimento automático que sugere `service.namespace`, uma visão de serviço que já sabe qual atributo informa o ambiente e uma visualização de rastro que usa as convenções para identificar spans sem exigir configuração de cada campo.

## Atributos de recurso formam um modelo compartilhado

O recurso é uma das partes mais subestimadas do modelo. Seus atributos descrevem a entidade que produz a telemetria, não um sinal individual. O `service.name` de um rastro é o mesmo de uma métrica e de um log porque a entidade emissora é a mesma. Isso também vale para `k8s.pod.name`, `k8s.namespace.name`, `host.name` e os demais atributos de recurso.

Assim, a correlação passa a ser uma propriedade dos dados. Quando rastros, métricas e logs compartilham esse modelo, você pode partir de um pico de latência em uma métrica, encontrar os rastros associados e chegar aos logs usando atributos comuns. Não precisa manter uma tabela de associação ou sincronizar mapeamentos separados para cada sinal.

Um produto que recebe OTLP e armazena os três sinais em esquemas desconectados perde esse benefício. Você volta a ter três linguagens de consulta, três grafias possíveis para `service.name` e painéis que discordam sobre o ambiente do serviço. A porta foi aberta, mas o modelo que dá valor ao protocolo foi descartado. Esquemas desconectados para os três sinais são um sinal de alerta.

## As convenções mudam; ferramentas nativas acompanham

As convenções semânticas são versionadas. `http.method` virou `http.request.method`; `http.status_code` virou `http.response.status_code`; `db.system` virou `db.system.name`. As migrações são deliberadas e documentadas, mas SDKs de versões diferentes podem descrever o mesmo conceito com nomes diferentes.

Um backend que fixa apenas uma versão quebra silenciosamente numa atualização de SDK. Um painel baseado em `http.status_code` fica vazio quando os serviços passam a emitir `http.response.status_code`. Ou fica parcialmente vazio enquanto parte dos serviços ainda usa o SDK antigo.

Uma ferramenta nativa trata essa diferença de versões explicitamente. Mostra qual versão chega, entende a relação entre os nomes durante a migração e ajuda a atualizar os painéis. Esse cuidado demonstra que ela foi construída em torno do modelo, além de um decodificador de OTLP.

## Portabilidade inclui configuração e semântica

As discussões sobre dependência de fornecedor costumam focar no backend. A origem merece a mesma atenção: o Collector é um lugar onde a semântica pode ser preservada ou alterada silenciosamente.

O Collector upstream, uma distribuição de fornecedor e uma distribuição feita com o OpenTelemetry Collector Builder compartilham receivers, processors, exporters e a OpenTelemetry Transformation Language (OTTL). Uma configuração pode ser transportada entre distribuições que incluam esses componentes:

```yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317

processors:
  batch: {}
  resourcedetection:
    detectors: [env, system]

exporters:
  otlp_grpc:
    endpoint: backend.example.com:4317

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [resourcedetection, batch]
      exporters: [otlp_grpc]
```


Trocar o endpoint do exporter `otlp_grpc` direciona a saída a outro backend. Se uma ferramenta depende de um agente proprietário e não consegue consumir um pipeline como esse, a dependência continua existindo.

Mas a portabilidade da configuração é só metade da questão. Uma distribuição pode aceitar e emitir OTLP e ainda destruir o modelo no caminho. Imagine renomear `http.response.status_code` para `status_code`, transformar atributos de recurso em atributos de span ou reorganizar métricas para um formato que só o backend daquele fornecedor entende. Os bytes continuam sendo OTLP e podem ser decodificados, mas agora expressam um dialeto privado.

Ao apontar essa saída para outro fornecedor, ele encontra nomes desconhecidos, atributos fora das convenções e um modelo de recurso desmontado. A saída prometida pelo OpenTelemetry foi fechada pelo agente. Essa dependência é difícil de perceber porque o formato de transmissão continua sendo OTLP. Ser nativo no lado produtor significa preservar a semântica para que os dados façam sentido em qualquer backend compatível.

## O formato escrito deve corresponder ao consultado

As duas metades se encontram num teste: a telemetria preserva seu significado de ponta a ponta? Em uma configuração nativa, as chaves escritas são as mesmas consultadas. Você pode formular uma consulta a partir da documentação do SDK porque o nome emitido é o nome armazenado. Uma expressão OTTL que usa `attributes["http.response.status_code"]` referencia o mesmo conceito que o filtro no backend.

Quando isso funciona, a documentação da instrumentação também documenta suas consultas e o conhecimento se transfere entre ferramentas. Quando o backend renomeia na ingestão ou o agente transforma na saída, você volta a manter mentalmente uma camada privada de tradução.

## Cinco perguntas para avaliar sua stack

A distinção pode ser avaliada com cinco perguntas:

1. A ferramenta usa convenções semânticas do OpenTelemetry sem exigir mapeamentos na ingestão?
2. Rastros, métricas e logs compartilham o mesmo modelo de recursos, permitindo correlação sem uma tabela de associação?
3. As mudanças de versão das convenções são tratadas explicitamente para que painéis sobrevivam às atualizações de SDK?
4. Você pode usar outra distribuição do Collector e preservar a semântica na saída, sem criar um dialeto privado?
5. Os nomes de atributos permanecem iguais do SDK que os escreve à consulta que os lê?

Quatro ou cinco respostas positivas descrevem uma ferramenta construída em torno do modelo do OpenTelemetry. Duas ou três indicam que ela decodifica OTLP, mas trata o modelo como opcional. Zero ou uma sugerem uma promessa principalmente de marketing.

## OpenTelemetry exige atenção à semântica

Abrir a porta OTLP é fácil. Entender o modelo, preservá-lo na entrada e mantê-lo na saída é o trabalho que acumula valor. Convenções, recursos compartilhados e conhecimento das versões permitem que a telemetria tenha o mesmo significado em todas as ferramentas. Essa portabilidade é a promessa do OpenTelemetry e exige respeitar o conteúdo de OTLP.

Ao avaliar um fornecedor ou montar uma distribuição do Collector, faça as cinco perguntas. As respostas mostram o quanto a ferramenta realmente adota o modelo.

Para aprofundar o modelo de recursos, as convenções e a arquitetura do Collector, consulte a [Trilha OpenTelemetry](/products/trilha-otel/).
