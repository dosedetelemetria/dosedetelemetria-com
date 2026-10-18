---
title: "Três palestras de OpenTelemetry da KubeCon India 2026"
slug: "best-otel-talks-kubecon-india-2026"
description: "Três palestras sobre falhas do Prometheus, custos de conversão de telemetria e OpenTelemetry para agentes de IA."
publishedAt: "2026-07-04"
author: "juraci"
tags: ["metricas", "engenharia-de-observabilidade", "opentelemetry"]
heroImage: "../../assets/blog/best-otel-talks-kubecon-india-2026.webp"
heroImageAlt: "Três telas de conferência iluminadas cercadas por fluxos de telemetria conectados."
sourceUrl: "https://telemetrydrops.com/blog/best-otel-talks-kubecon-india-2026/"
tldr: "Uma falha de cardinalidade no Prometheus, ganhos de desempenho com Arrow e instrumentação de agentes com as convenções de IA generativa."
keyTakeaways: ["Pipelines de telemetria precisam de contrapressão e planejamento de capacidade como outros sistemas de produção.", "Conversões de formato podem dominar o custo de CPU; os benchmarks apresentados com Arrow mostraram ganhos de cerca de 20 vezes.", "A observabilidade de agentes precisa capturar ferramentas e fluxos completos, além das chamadas de modelos."]
---

A KubeCon + CloudNativeCon India 2026, em 18 e 19 de junho, teve uma trilha compacta e densa de observabilidade. Foram nove palestras sobre OpenTelemetry, confiabilidade do Prometheus, telemetria de service mesh, inferência em GPU, ambientes isolados e AIOps. Escolhemos três pela aplicação prática em produção, além de duas menções honrosas.

## Quem observa os observadores? Da observabilidade fechada ao controle aberto em escala

**Aditi Gupta (JioHotstar), Madhu Patel (Adobe) e Sandeep Kanabar (Gen)** | [Assista no YouTube](https://www.youtube.com/watch?v=nYxLSHljwxQ)

A palestra começa com um chamado às três da manhã: um pipeline de conformidade com GDPR em que cada requisição gerava 20 respostas downstream, repetidas numa margem de segurança de cinco dias. Quando a entrada subiu de 10 mil para 2 milhões de mensagens diárias, o pipeline chegou a 1,4 bilhão numa semana e caiu. Ninguém percebeu porque os painéis do Grafana também estavam vazios. O monitoramento havia falhado com a mesma carga.

Os palestrantes identificam três causas: explosão de cardinalidade por uma dimensão de valores muito variados, levando o Prometheus de milhares a milhões de séries e além do limite de memória; desalinhamento entre duração, tamanho dos blocos e frequência de compactação, invisível em pequena escala; e retenção local de 15 dias duplicando dados já guardados por 90 dias no Cortex.

A correção combinou quatro mudanças: controle de tráfego no Collector com lotes, tail sampling e memory limiter; contenção de cardinalidade com recording rules e limites de amostras por scrape; ajuste de blocos da TSDB de duas horas para quinze minutos; e filas limitadas com backoff exponencial entre Collector e remote write. Segundo a apresentação, a memória caiu de cerca de 16 GB para 2 GB e os encerramentos por falta de memória chegaram a zero.

**Por que se destacou:** a contribuição principal é o enquadramento. Pipelines de telemetria são sistemas distribuídos, e cada dimensão, span ou dia retido tem um custo real que exige planejamento de capacidade e contrapressão.

## O imposto invisível: como conversões de formato encarecem pipelines

**Cijo Thomas (Microsoft)** | [Assista no YouTube](https://www.youtube.com/watch?v=A-94_ip0IFo)

Renomear um atributo de log isoladamente é barato: milhões de operações por segundo num núcleo. Pipelines reais ficam longe disso. Antes da transformação, OTLP precisa ser decodificado para a representação em memória do Collector; depois, precisa ser codificado novamente. Mesmo sem processar nada, mais da metade da CPU pode ser gasta na decodificação. Regras adicionais custam também porque a organização por linhas espalha atributos na memória. Nos SDKs, um log pode passar por três ou quatro representações — biblioteca de logging, SDK, Protobuf gerado e bytes — antes de sair pela rede. Alguns dados passam por dez a vinte formatos até poderem ser consultados.

A proposta é alinhar representação em memória e transmissão. Apache Arrow oferece armazenamento colunar e Arrow IPC, além de operações em lote eficientes para renomear e filtrar. O projeto Arrow do OpenTelemetry criou OTAP (OpenTelemetry Arrow Protocol), com conversão sem perda para OTLP, e um motor experimental em Rust que opera diretamente sobre lotes Arrow.

Os benchmarks apresentados com um núcleo mostram cerca de 100 mil logs por segundo no caminho OTLP e 2,5 milhões no caminho nativo Arrow, uma diferença de aproximadamente 20 vezes. A CPU do motor Arrow permaneceu estável com mais regras de transformação, enquanto a sobrecarga do Collector tradicional passou de 10% após quatro regras.

**Por que se destacou:** quantifica um custo que todo operador paga e poucos medem. A terceira fase do projeto busca levar a abordagem até os SDKs, algo a acompanhar em gateways e frotas de agentes.

## O que meu agente fez? Observabilidade e responsabilidade para agentes de IA

**Ishan Jain (Grafana Labs)** | [Assista no YouTube](https://www.youtube.com/watch?v=Bx_BU7dGyiI)

Modelos de linguagem são caixas-pretas até para seus criadores: não determinísticos, caros em escala e sujeitos a alucinações. Diante de uma resposta incorreta, a investigação precisa reconstruir o contexto, o trecho recuperado e possíveis problemas no prompt de sistema. No software tradicional, o código orienta a depuração; na IA, os rastros assumem esse papel porque o interior do modelo não é inspecionável.

A palestra distingue observabilidade de LLM — prompts, respostas e tokens de uma chamada — de observabilidade de agentes, que inclui ferramentas, servidores MCP, workflows e bancos usados durante a execução inteira. As convenções GenAI do OpenTelemetry definem spans e atributos para isso. Jain recomenda OpenLIT, um SDK nativo de OpenTelemetry, para capturar esses detalhes com menos trabalho manual.

Para serviços que não podem ser republicados, ele combina instrumentação eBPF do OpenTelemetry com OpenLIT. A primeira fornece cobertura básica das chamadas a provedores como OpenAI e Anthropic; o segundo enriquece o mesmo rastro com agentes e ferramentas. A demonstração mostrou que eBPF sozinho capturava entrada, saída e tokens, mas não as ferramentas chamadas. A combinação trazia esse detalhe. Em escala, Jain propõe conectar o backend a um assistente por MCP para analisar rastros longos demais para inspeção manual.

**Por que se destacou:** apresenta uma resposta prática para instrumentar o agente inteiro, além da chamada de modelo, usando convenções compartilhadas.

## Menções honrosas

**[Offline but Not Blind: Observability in Air-Gapped Kubernetes Environment](https://www.youtube.com/watch?v=Ith_TOa85Lw)**, de Manoj Sardana, da HCL Software, aborda clusters de bancos e governos sem internet. Usa OpenTelemetry e uma stack LGTM própria — Loki, Grafana, Tempo e Mimir — com monitoramento independente para observar o próprio sistema de monitoramento.

**[Patients as Time-Series: High-Stakes Clinical Alerting With OpenSearch & K8s](https://www.youtube.com/watch?v=Vn5OkBWVV5o)**, de Seema Saharan e Aakanksha Saharan, vai além da saúde. Propõe substituir limites fixos por alertas probabilísticos bayesianos que consideram a trajetória: um sistema estável por dias é diferente de outro que chegou ao mesmo valor após uma queda brusca. A ideia se aplica também a AIOps e detecção de fraude.

## O que essas palestras têm em comum

As três escolhas discutem a mesma pergunta em camadas diferentes: quanto custa observar um sistema e de onde vem esse custo? A falha do Prometheus mostra o preço de tratar telemetria como infraestrutura gratuita. A conversão de formatos revela um custo pago por byte mesmo sem processamento. Os agentes trazem uma nova categoria de custo e valor que ferramentas de avaliação de uma única interação não capturam bem.

A conversa já é sobre operar OpenTelemetry de forma adequada ao custo e à escala reais de cada equipe.
