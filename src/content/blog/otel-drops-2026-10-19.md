---
title: "OTel Drops: Hostmetrics e rastros de modelos"
slug: "otel-drops-2026-10-19"
description: "19 de outubro de 2026: hostmetrics versionado, rastros do Claude, atualizações de SDKs e notícias do OpenTelemetry."
publishedAt: "2026-10-19"
author: "carla"
tags: ["opentelemetry-collector", "metricas", "telemetria", "opentelemetry"]
heroImage: "../../assets/blog/otel-drops-2026-10-19.webp"
heroImageAlt: "Dois mostradores de carvão e cobre ao lado de blocos ligados por um cordão de cobre."
sourceUrl: "https://telemetrydrops.com/blog/otel-drops-2026-10-19/"
tldr: "Nesta edição: métricas de processo em RC no hostmetrics, exportação de rastros do Claude em beta, eleições e atualizações do ecossistema."
keyTakeaways: ["Definições versionadas permitem migrar métricas de processo e tratar conflitos com a saída legada.", "O beta do Claude conecta spans da plataforma e do SDK; a entrega é feita por melhor esforço.", "A votação do Comitê de Governança acontece de 26 a 28 de outubro; indicações aos prêmios encerram em 30 de outubro."]
---

Mudar convenções de métricas pode quebrar um painel. Exportar rastros de modelos pode revelar apenas parte de uma requisição. O **OTel Drops de 19 de outubro de 2026** analisa dois esforços para tornar a telemetria mais útil nessas fronteiras: métricas de processo versionadas no Collector e rastros conectados da Claude Platform.

[Ouça o episódio em inglês no Spotify](https://open.spotify.com/show/3xJnu5gEUbBoqRbd5lzwLO) ou leia os destaques abaixo.

## Hostmetrics aproxima métricas de processo das convenções estáveis

O Collector Contrib v0.160.0 introduziu métricas de processo candidatas a lançamento (RC) no scraper de processos do hostmetrics. O desafio era preservar medições existentes ao mudar nomes, unidades, tipos e atributos. O gerador `mdatagen` agora aceita definições versionadas, como `process.cpu.utilization@v1`. O sufixo distingue as definições internamente e desaparece antes da exportação. O [artigo sobre a migração](https://opentelemetry.io/blog/2026/hostmetrics-process-scraper-rc/) explica como duas feature gates habilitam a nova saída e desabilitam a legada separadamente, sem reescrever a configuração existente.

Comparar as saídas tem limites: quando só os atributos mudam sob o mesmo nome de métrica, os pontos emitidos carregam os nomes antigos e novos; se o tipo muda, vale o novo tipo. O [Collector v0.163.0](https://github.com/open-telemetry/opentelemetry-collector/releases/tag/v0.163.0) também corrige o estado final da migração: habilitar as duas gates emite apenas a métrica nova e seus novos atributos. Essas métricas estão em RC, não estáveis. Teste a migração contra seus painéis; o artigo original descreve as gates, avisos de conflito e medições renomeadas.

## Claude conecta chamadas de modelos aos rastros da aplicação

O beta público da Anthropic traz exportação de rastros OpenTelemetry à Claude Platform. A [documentação de rastreamento da API e do SDK](https://platform.claude.com/docs/en/manage-claude/opentelemetry) descreve dois caminhos complementares: um administrador configura o destino de exportação da plataforma e a instrumentação do SDK cria spans na aplicação. O contexto conecta o trabalho do cliente e da plataforma no mesmo rastro. Os spans usam as convenções de IA generativa para dar aos backends um vocabulário comum sobre chamadas de modelos e uso de tokens.

Isso ilustra o argumento sobre produtores em [OTel-Native by Design](https://opentelemetry.io/blog/2026/otel-native-by-design/): instrumentar o produto, preservar a semântica padrão e deixar o usuário escolher o destino. Também se conecta ao nosso artigo [Suportar OTLP não é suportar OpenTelemetry](/blog/otlp-is-not-otel-native/). Falar OTLP é apenas parte do contrato. Os limites do beta importam: a entrega é por melhor esforço, portanto os rastros não são um registro completo de uso. Por padrão, só metadados são capturados; habilitar conteúdo completo envia prompts e respostas ao destino, sujeitos aos controles de acesso e retenção dele.

## Notas rápidas

- **Eleição do Comitê de Governança:** dez candidatos disputam quatro vagas. Consulte as [candidaturas](https://github.com/open-telemetry/community/blob/main/elections/2026/governance-committee-candidates.md) e o [calendário](https://github.com/open-telemetry/community/blob/main/elections/2026/governance-committee-election.md). Pedidos de exceção para votar encerram em 23 de outubro às 23h59 Anywhere on Earth (AoE). A votação vai de 26 de outubro às 12h UTC a 28 de outubro às 23h59 AoE. Os resultados saem em 30 de outubro.
- **Um SDK compartilhado sob APIs de linguagens:** a [proposta de wrapper de SDK](https://github.com/open-telemetry/community/pull/3744) começa com Python sobre um SDK C++. Explora menos alocações e contenção no bloqueio global do interpretador Python. Continua sendo uma proposta, não uma substituição dos SDKs nativos.
- **Collector v0.163.0:** [metadados de versão de profiles](https://github.com/open-telemetry/opentelemetry-collector/releases/tag/v0.163.0) permitem rejeitar formatos incompatíveis antes de decodificá-los. Distribuições próprias também podem selecionar um conjunto menor de detectores de recursos no builder.
- **SDK .NET 1.20.0:** a [release](https://github.com/open-telemetry/opentelemetry-dotnet/releases/tag/core-1.20.0) adiciona `ConfigureSampler`, para que bibliotecas trabalhem com o sampler resolvido pela aplicação, além de melhorar o autodiagnóstico e corrigir variáveis de ambiente do recurso padrão.
- **OpenTelemetry eBPF Instrumentation se aproxima da 1.0:** o projeto usa extended Berkeley Packet Filter (eBPF) para instrumentação. A [v1.0.0-rc.2](https://github.com/open-telemetry/opentelemetry-ebpf-instrumentation/releases/tag/v1.0.0-rc.2) continua o ciclo de candidatas a lançamento. A configuração de segunda geração é o contrato estável proposto; teste as mudanças em nomes e dimensões dos spans nos painéis antes da versão final.

## Notícias da comunidade

As [indicações aos OpenTelemetry Community Awards](https://opentelemetry.io/blog/2026/community-awards/) encerram em **30 de outubro**. Indique até cinco pessoas cujo trabalho ajudou você neste ano. O novo [Humans of OpenTelemetry: edição KubeCon Japan](https://opentelemetry.io/blog/2026/humans-of-otel-japan/) compartilha experiências de Yokohama, com traduções para inglês das entrevistas em japonês. Para quem quer participar, [OTel in Practice: How can I contribute to OTel?](https://www.youtube.com/watch?v=3zwtNs9TbE0) explora essa pergunta.

O [Observability Day](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/co-located-events/observability-day/) acontece em **9 de novembro**, em Salt Lake City, junto da [KubeCon + CloudNativeCon North America](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/), de **9 a 12 de novembro de 2026**.

*OTel Drops é produzido pela Telemetry Drops, tem curadoria de Juraci Paixão Kröhling e patrocínio da [OllyGarden](https://olly.garden). O podcast é majoritariamente gerado por IA, com curadoria humana. Juraci integra o Comitê de Governança do OpenTelemetry.*
