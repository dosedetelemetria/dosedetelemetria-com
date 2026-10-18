# Validação e revisão do blog

Siga [a autoria](blog-authoring.md), [CONTRIBUTING.md](../CONTRIBUTING.md) e
[o sistema visual](../DESIGN.md). Este guia complementa os testes do website:
um build correto não comprova o comportamento de um exemplo técnico.

## Ferramentas conforme o assunto

Consulte o [catálogo de skills](https://github.com/ollygarden/opentelemetry-agent-skills#available-skills)
e verifique quais estão instaladas. Selecione apenas as pertinentes:

| Assunto | Skills |
| --- | --- |
| Releases, compatibilidade e versões | `otel-upgrade`, `otel-sdk-versions` |
| Componentes e expressões do Collector | `otel-collector`, `otel-ottl` |
| Entradas sintéticas e telemetria emitida | `otel-telemetrygen`, `otel-telemetry-emissions` |
| Convenções e registries | `otel-semantic-conventions`, `otel-weaver` |
| Distribuições customizadas | `otel-collector-builder` |
| SDKs | `otel-sdk-versions` e a skill da linguagem |
| Configuração declarativa e profiling | `otel-declarative-config`, `otel-profiles` |

Leia referências específicas e fontes primárias nas tags corretas. A presença
no catálogo não prova instalação nem cobertura da versão usada. Sem uma skill,
use fontes primárias e execução isolada, registrando a lacuna restante.

## Prova comportamental

Defina o resultado esperado antes de executar. Preserve entradas e saídas
observadas, comandos, versões/digests, plataforma e limites. Para processadores
e conectores, extraia o bloco publicado sem alterações para um pipeline com
entrada OTLP e saída inspecionável, incluindo um controle positivo:

- Transformações: campos e valores exatos depois da operação.
- Filtros: registros correspondentes ausentes e controles preservados.
- Roteamento: cada registro somente nos destinos esperados, inclusive o caso
  sem correspondência.
- Métricas derivadas: nome, tipo, dimensões e valor esperados.

Esse harness não prova transporte, filas, retry ou backpressure. Teste esses
com os componentes reais e a falha relevante: indisponibilidade do backend,
crash e recriação do Collector, fila cheia ou expiração de retry são situações
distintas. Confira unidades da fila, capacidade e batching na versão testada.
Persistência em container exige volume sobrevivente e permissões de escrita.
Não prometa migração de fila, tolerância a disco ou entrega exatamente uma vez
sem os experimentos correspondentes.

Use loopback, portas disponíveis, esperas limitadas e detecção de saída precoce.
Limpe apenas os recursos criados pelo experimento. Explique atalhos de laboratório
como root e transporte sem criptografia ao lado do exemplo.

## Evidência e revisão independente

Adapte a cadeia dos cursos de `telemetrydrops/dropzone-docs`: resultado de
aprendizagem → fontes e execução → texto e visuais → revisão independente.

1. Defina público, pré-requisitos, pergunta principal, resultados verificáveis e
   limites. Relacione afirmações sobre cursos aos manifests e lições reais.
2. Mapeie afirmações e rótulos de diagramas para fontes/versões ou experimentos
   reproduzíveis. Conserve os insumos no artigo ou em exemplos versionados.
3. Redija usando essa evidência. Não invente saídas ou experiência pessoal.
4. Obtenha revisões independentes técnica, editorial e de leitor, além de
   alinhamento com cursos quando houver afirmações sobre eles. O leitor recebe
   somente o rascunho, material visível e pré-requisitos; não recebe notas do autor
   nem conclusões dos outros revisores. Simulação não equivale a pesquisa com usuários.
5. Resolva bloqueadores e repita as verificações afetadas antes do PR.

Cada revisão informa aprovado, ressalva ou bloqueador, revisão examinada,
escopo, arquivo/seção, evidência, esperado/observado, impacto e correção concreta.
Separe deriva de versão, fonte incerta, erro conceitual e dependência ausente.
Afirmação técnica incorreta, saída fabricada, execução obrigatória ausente ou
procedimento impossível com os pré-requisitos informados bloqueiam a publicação.

Confira também imagens, descoberta, RSS, código copiado, Markdown negociado e
`/llms-full.txt` conforme [o guia de autoria](blog-authoring.md). O PR registra
resultados reais, revisões, limites não verificados e pendências na prévia.
