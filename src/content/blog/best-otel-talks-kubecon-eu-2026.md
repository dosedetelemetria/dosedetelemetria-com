---
title: "Seis palestras de OpenTelemetry da KubeCon EU 2026"
slug: "best-otel-talks-kubecon-eu-2026"
description: "Seis palestras da KubeCon EU 2026: implantações reais, profiling, ferramentas OTTL e novidades do Collector."
publishedAt: "2026-04-15"
author: "juraci"
tags: ["opentelemetry-collector", "opentelemetry", "engenharia-de-observabilidade"]
heroImage: "../../assets/blog/best-otel-talks-kubecon-eu-2026.webp"
heroImageAlt: "Seis telas de conferência iluminadas ao redor de um conjunto de nós de telemetria."
sourceUrl: "https://telemetrydrops.com/blog/best-otel-talks-kubecon-eu-2026/"
tldr: "Seis palestras sobre operação em escala, jogos instrumentados, agentes em Doom, profiling, depuração de OTTL e atualizações do Collector."
keyTakeaways: ["Os desafios do OpenTelemetry passaram da adoção para a operação em escala.", "A palestra do Collector apresenta a transição do processador batch para batching no exporter.", "Profiling chegou a alfa com correlação entre rastros e profiles no formato.", "O playground ottl.run executa o Collector via WebAssembly para depurar transformações no navegador."]
---

A KubeCon EU 2026, em Amsterdã, teve muito conteúdo de observabilidade. Entre a conferência principal e os eventos paralelos, era impossível acompanhar tudo. Selecionamos seis palestras: três sobre aplicações práticas e três sobre avanços do projeto.

## Observabilidade aplicada

### Apagamos nossa stack de observabilidade e a reconstruímos com OTel

**Yash Sharma e Kunju Perath (DigitalOcean)** | [Assista no YouTube](https://www.youtube.com/watch?v=Z0oum6Eh1is)

O time do Kubernetes gerenciado da DigitalOcean (DOKS) opera mais de 20 mil clusters de clientes em 13 regiões, com 18 engenheiros. O sistema anterior tinha uma instância de Prometheus por cluster de control plane. Cobria suas métricas, mas deixava lacunas: sem visibilidade de kube-system nos clusters de clientes, sem telemetria dos workers e com logs de auditoria em arquivos que desapareciam nos reinícios.

O time adotou o padrão agente-gateway com o Collector. Agentes leves em cada camada — control plane, kube-system dos clientes e workers como serviços systemd — encaminham dados para gateways sem estado, que exportam via OTLP ao backend da DigitalOcean. O receiver Prometheus permitiu portar quase diretamente as configurações de scrape. O processador transform substituiu um serviço Go criado apenas para adicionar metadados como IDs de clusters.

A palestra também mostra o que deu errado. O Kubernetes Operator do OpenTelemetry trouxe conflitos de CRDs com operadores internos e uma dependência que mudava rapidamente no monorepo Go. Configurações diretas de deployment teriam sido mais simples. A diferença entre atributos de recurso e de telemetria também exigiu aprendizado e atrasou investigações. Depois da migração, o tempo médio de detecção caiu de horas para minutos.

**Por que se destacou:** uma migração concreta em grande escala, com lições sobre o que adotar e o que deixar de fora.

### Dezoito controles Bluetooth entram num bar: observabilidade e confiabilidade

**Simon Schrottner e Manuel Timelthaler** | [Assista no YouTube](https://www.youtube.com/watch?v=Y9agHID8Ml4)

Simon Schrottner, mantenedor de OpenFeature na Dynatrace, criou um jogo de festa de código aberto que usa acelerômetros dos controles PlayStation Move numa competição parecida com corrida do ovo na colher. O jogo roda num Raspberry Pi. Investigar falhas em conferências era frustrante sem visibilidade, então ele e Manuel Timelthaler, da Tractive, adicionaram observabilidade.

O monólito Python foi dividido em microsserviços com gRPC, permitindo capturar spans, rastros e logs com instrumentação automática. O Raspberry Pi passou a executar um Collector e o proxy de feature flags flagd, do OpenFeature, para ajustes durante a partida.

A frequência de coleta trouxe um desafio maior que a cardinalidade. O scrape padrão de 60 segundos perdia partidas inteiras de dez segundos. Mesmo dez segundos produziam gráficos em ondas quadradas que escondiam a dinâmica do jogo. Métricas enviadas por push com agregação de 100 milissegundos permitiram reconstruir as partidas visualmente. Adicionar apenas o ID da partida com 32 controles elevou as séries de 1.200 para 18 mil.

Serviços, Collector, Prometheus e Grafana rodavam localmente. Isso é importante em conferências com Wi-Fi instável.

**Por que se destacou:** demonstra que as ferramentas vão além de serviços web. Os desafios de alta frequência se aplicam a IoT, sistemas em tempo real e monitoramento de agentes de IA.

### Observando o caos: monitoramento em tempo real de destruição no Kubernetes por IA

**Josh Halley e Ricardo Aravena** | [Assista no YouTube](https://www.youtube.com/watch?v=KOM-PQNpcjk)

Até 16 jogadores de IA, cada um numa rede neural dentro de um pod, disputam Doom. O sistema usa PyTorch e combina IMPALA para escala distribuída, ResNet para percepção visual, LSTM para contexto temporal e dueling heads para avaliar ações. Uma rede IPFS distribui os melhores hiperparâmetros, permitindo que estratégias vencedoras melhorem os outros modelos.

A observabilidade vai além do espetáculo. Tudo foi instrumentado com OpenTelemetry e convenções de IA generativa. Cada pod expõe métricas por um servidor MCP; um agente supervisor as agrega via clientes MCP. Os painéis mostram mapas de serviços, eliminações, chamadas MCP, desempenho das redes e reinícios. Os rastros capturam a comunicação do supervisor com os jogadores.

Foram necessárias 14 iterações de treinamento; os primeiros jogadores passavam muito tempo batendo nas paredes. O time também trocou containers Docker convencionais por WebAssembly para acelerar reinícios após eliminações.

**Por que se destacou:** a arquitetura reproduz problemas de agentes em produção: fluxos longos, muitos reinícios, coordenação por MCP e observabilidade que conecta IA e infraestrutura.

## O núcleo do OpenTelemetry

### Chega o quarto pilar: profiling alfa em ação

**Felix Geisendorfer e Florian Lehner** | [Assista no YouTube](https://www.youtube.com/watch?v=TKp2snmgvtQ)

Felix, da Datadog, e Florian, da Elastic, anunciaram o alfa do sinal de profiling, ao lado de rastros, métricas e logs. O merge aconteceu ao vivo, após 30 pull requests de OTLP e contribuições de pessoas e empresas no SIG de profiling.

O sinal coleta amostras de pilhas ao longo do tempo para produzir flame graphs, linhas do tempo de threads e flame scopes. Os usos incluem investigar funções que passaram a consumir recursos após um deployment, localizar custos de CPU e memória e comparar caminhos P99 e P50 por correlação com rastros e spans.

O formato melhora aspectos do pprof. A deduplicação por dicionário guarda strings uma vez e usa referências, reduzindo o tamanho de transmissão em até 40%. Pilhas recebem identificadores próprios. Uma mensagem de link conecta profiles diretamente por trace ID e span ID.

O receiver baseado em eBPF roda como DaemonSet em nós Linux, sem exigir instrumentação ou reinício das aplicações. Usa desenroladores de pilha próprios para linguagens nativas — C, C++, Rust e Go — e interpretadas — Java, JavaScript/V8, PHP, Node.js e Perl — com sobrecarga de CPU relatada em aproximadamente 1%.

**Por que se destacou:** o merge do alfa tornou visível um avanço de anos. A correlação embutida com rastros é uma diferença importante em relação a profilers isolados.

### Quando OTTL sai dos trilhos: depurando transformações

**Edmo Vamerlatti Costa e Tyler Helmuth** | [Assista no YouTube](https://www.youtube.com/watch?v=465RlwgsNHg)

Tyler Helmuth, da Honeycomb, e Edmo Vamerlatti Costa, da Elastic, explicam que OTTL opera sobre P data, a representação interna que espelha o modelo protobuf do OpenTelemetry. OTTL exige entender a estrutura dos dados: atributos de recurso, escopo, span e ponto de métrica têm caminhos diferentes. Adivinhar esses caminhos pode produzir instruções que falham silenciosamente ou impedem a inicialização do Collector.

A palestra apresenta três ferramentas. O exporter debug com verbosidade `detailed` mostra campos, tipos e valores completos. Logs de depuração do Collector mostram o contexto antes das instruções, o resultado das condições e o estado depois de cada execução. O playground ottl.run compila o Collector para WebAssembly e oferece diferenças visuais, breakpoints e tempos de execução no navegador.

As demonstrações incluem uma comparação sensível a maiúsculas que falha porque o texto está em minúsculas, um parse de JSON que introduz uma chave inesperada e prejudica instruções seguintes e um contexto incorreto que força iteração desnecessária por todos os pontos de dados.

**Por que se destacou:** a adoção de OTTL trouxe demanda por ferramentas próprias. O playground é uma opção prática para investigar transformações.

### SIG do OpenTelemetry Collector: novidades do projeto

**Jade G, Dmitrii A, Alex B, Evan B e Antoine T** | [Assista no YouTube](https://www.youtube.com/watch?v=0zwLl8QGOdM)

A primeira atualização do SIG do Collector na KubeCon reuniu mudanças importantes em 35 minutos.

O principal tema é a depreciação do processador batch em favor de lotes no exporter. O processador original mantém um buffer em memória que não propaga erros de contrapressão das filas seguintes. A nova abordagem coloca batching depois da fila de envio, permite medir capacidade em itens e bytes e suporta persistência. A transição apresentada consiste em remover o processador batch e configurar lotes na fila do exporter.

No esforço rumo à 1.0, 25 módulos chegaram à estabilidade após cerca de 18 meses. O processador de atributos Kubernetes se alinha às convenções e teve redução de memória de cerca de 20% desde a 0.147. OTTL e transform chegaram a beta, com inferência de contexto. O receiver Prometheus se aproxima da estabilização; a determinação do início de métricas passa a um processador dedicado.

Profiles chegaram a alfa no proto 1.10. O receiver prof permite ao Collector relatar seus próprios profiles e o profiler eBPF virou distribuição oficialmente suportada. Atributos por componente para telemetria interna aparecem atrás de feature gate, enquanto métricas universais de pipeline no framework substituem instrumentações individuais.

**Por que se destacou:** a transição de batching afeta muitas configurações em produção. A palestra ajuda operadores a se prepararem para atualizações.

## O que essas palestras têm em comum

O OpenTelemetry passou da pergunta “devemos adotar?” para “como operar bem?”. A DigitalOcean aprendeu que adotar todos os componentes de uma vez cria problemas. O jogo Bluetooth mostrou que intervalos padrão escondem workloads inteiros. A depuração de OTTL ganhou ferramentas porque transformações já fazem parte da produção. O SIG revisita um processador presente desde o começo.

São sinais de um ecossistema amadurecendo, no qual os desafios estão na operação real.
