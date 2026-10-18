---
title: "Weaver do zero: um guia para começar"
slug: "weaver-from-zero-to-hero"
description: "Comece com OpenTelemetry Weaver: versione esquemas de telemetria, gere código Go e valide convenções no CI."
publishedAt: "2026-04-25"
author: "juraci"
tags: ["opentelemetry"]
heroImage: "../../assets/blog/weaver-from-zero-to-hero.webp"
heroImageAlt: "Um tear transforma fios de dados soltos em um tecido organizado de telemetria."
sourceUrl: "https://telemetrydrops.com/blog/weaver-from-zero-to-hero/"
tldr: "Troque constantes manuais por um registro Weaver. Gere código Go, valide o contrato no CI e detecte divergências antes da produção."
keyTakeaways: ["Weaver trata o contrato de telemetria como código-fonte: YAML entra, código e documentação saem.", "O registro define nomes, unidades e estabilidade, antecipando erros de instrumentação.", "Constantes geradas padronizam nomes de atributos e valores enumerados.", "Validação, regeneração com diff e comparação com main tornam o contrato revisável.", "Spans usam um filtro jq e sampling_relevant; operações HTTP, de banco e mensageria continuam seguindo as convenções oficiais."]
faqEntries: [{"question": "O que é OpenTelemetry Weaver?", "answer": "É a ferramenta usada pelo projeto para gerenciar convenções semânticas. Você descreve atributos, métricas, spans e eventos em YAML; Weaver valida o contrato, gera código e documentação por templates e aplica políticas Rego."}, {"question": "Por que gerar constantes em vez de escrevê-las à mão?", "answer": "Constantes manuais acumulam erros de digitação, redefinições e unidades ausentes. A geração centraliza o contrato, documenta estabilidade e permite detectar divergências no CI."}, {"question": "Weaver substitui as convenções oficiais?", "answer": "Não. Weaver produz os pacotes semconv oficiais e permite definir convenções próprias junto das oficiais. Spans HTTP, de banco e mensageria devem continuar seguindo as convenções do OpenTelemetry."}, {"question": "Como manter o código gerado alinhado ao esquema?", "answer": "Execute weaver registry generate no CI, formate a saída e use git diff --exit-code nos arquivos gerados. O job falha se o esquema mudar sem regeneração ou se alguém editar o código gerado manualmente."}]
---

Todo serviço Go em produção que usa OpenTelemetry acaba ganhando um arquivo assim:

```go
// internal/telemetry/const.go
package telemetry

const (
    ATTR_USER_ID          = "user.id"
    ATTR_ORDER_ID         = "order.id"
    ATTR_PRODUCT_ID       = "product.id"
    ATTR_PRODUCT_CATEGORY = "product.category"
    ATTR_CUSTOMER_TIER    = "customer.tier"
    ATTR_PAYMENT_METHOD   = "payment.method"
    ATTR_ORDER_TOTAL      = "order.total"
)

const (
    USER_REGISTRATIONS_TOTAL  = "users.registrations.total"
    ORDER_PROCESSING_DURATION = "orders.processing.duration"
    ORDERS_ACTIVE             = "orders.active"
)
```



É assim que as divergências começam. Um erro de digitação num handler. Outro serviço redefine `order.id` como `orderID`. Uma métrica sai sem unidade. Ninguém sabe qual é a garantia de estabilidade. O código compila e os testes passam até um painel quebrar porque um novo caminho escreveu o atributo de outra forma.

O OpenTelemetry tem uma resposta: um projeto separado chamado Weaver. Vamos adotá-lo no exemplo `stage-1-monolith` de [otel-in-practice](https://github.com/telemetrydrops/otel-in-practice). Partimos desse arquivo e chegamos a código gerado, apoiado num esquema versionado e validado por integração contínua, sem introduzir recursos desnecessários no primeiro dia.

## O que é Weaver

Weaver trata o contrato de telemetria como um artefato de código-fonte. Você descreve atributos, métricas, spans e eventos em YAML, e ele faz três coisas:

1. Valida a descrição, identificando métricas sem unidades, atributos sem estabilidade e referências inexistentes.
2. Gera código, documentação ou qualquer saída produzida por templates [Jinja2](https://jinja.palletsprojects.com/).
3. Aplica políticas: regras de nomes do OpenTelemetry ou regras próprias em [Rego](https://www.openpolicyagent.org/docs/latest/policy-language/).

É a mesma ferramenta usada pelo projeto para gerar os pacotes oficiais de convenções semânticas nas linguagens suportadas. Atributos como `http.request.method`, `db.system.name` e `service.name` vêm de um registro Weaver. Adotá-lo para suas convenções significa usar o mesmo processo do upstream.

O projeto está em [open-telemetry/weaver](https://github.com/open-telemetry/weaver). Este guia preserva a versão **0.22.1**, usada no artigo original.

## Como as peças se encaixam

O **registro** é um diretório de arquivos YAML. O manifest dá nome ao registro e declara dependências. Os demais arquivos descrevem atributos, grupos, métricas, spans, eventos e entidades. É a fonte de verdade do contrato.

Os **templates** são arquivos Jinja2 e um `weaver.yaml`. Eles transformam o registro resolvido em arquivos de saída: constantes, variáveis e funções Go; tipos TypeScript; ou documentação Markdown.

As **políticas** são regras Rego. As políticas embutidas verificam nomes, transições de estabilidade e depreciações. Regras próprias podem exigir o prefixo `ecommerce.` ou proibir novas métricas em `development` depois da versão 1.0.

Os blocos `const` viram um registro. A escrita manual vira geração de código. O conhecimento informal sobre os nomes vira políticas.

## Passo 1: escreva o esquema

Crie um registro no repositório da aplicação. No exemplo `stage-1-monolith`, adicione `telemetry/registry/` ao lado do código Go:

```
stage-1-monolith/
├── internal/
├── telemetry/
│   └── registry/
│       ├── manifest.yaml
│       ├── attributes.yaml
│       └── metrics.yaml
└── main.go
```



O manifest é obrigatório e identifica o registro:

```yaml
# telemetry/registry/manifest.yaml
name: ecommerce
description: "Telemetry conventions for the ecommerce monolith"
semconv_version: 0.1.0
schema_url: https://telemetrydrops.com/schemas/ecommerce
```



`semconv_version` é a versão das suas convenções, sob seu controle. Atualize-a quando o esquema mudar. `schema_url` é um identificador estável que aparece nas saídas geradas e nos dados para que consumidores reconheçam a versão do contrato.

Os atributos do `const.go` original são descritos diretamente:

```yaml
# telemetry/registry/attributes.yaml
file_format: definition/2

attributes:
  - key: ecommerce.user.id
    type: string
    stability: stable
    brief: "Identifier of the customer performing the operation."
    examples: ['user-9f3a', 'user-1c2d']

  - key: ecommerce.order.id
    type: string
    stability: stable
    brief: "Identifier of the order being processed."
    examples: ['ord-2024-0001', 'ord-2024-0042']

  - key: ecommerce.order.total
    type: double
    stability: stable
    brief: "Order total in the customer's billing currency."
    examples: [19.99, 149.00]

  - key: ecommerce.payment.method
    type:
      allow_custom_values: true
      members:
        - id: credit_card
          value: credit_card
          stability: stable
          brief: "Credit or debit card"
        - id: paypal
          value: paypal
          stability: stable
          brief: "PayPal account"
        - id: apple_pay
          value: apple_pay
          stability: stable
          brief: "Apple Pay"
    stability: stable
    brief: "Payment method selected by the customer."

  - key: ecommerce.customer.tier
    type:
      allow_custom_values: false
      members:
        - id: standard
          value: standard
          stability: stable
          brief: "Standard customer"
        - id: premium
          value: premium
          stability: stable
          brief: "Premium customer"
    stability: stable
    brief: "Customer tier for pricing and feature gates."
```



Observe três pontos. Cada atributo tem `stability`: a ausência impede a geração e obriga a decidir a estabilidade antes de um incidente. As chaves usam o namespace `ecommerce.`, com minúsculas separadas por pontos; transformaremos a recomendação numa verificação de CI. Por fim, `ecommerce.payment.method` e `ecommerce.customer.tier` são enumerações, cujos valores podem virar constantes nomeadas.

As métricas seguem o mesmo padrão:

```yaml
# telemetry/registry/metrics.yaml
file_format: definition/2

metrics:
  - name: ecommerce.orders.processing.duration
    instrument: histogram
    unit: s
    stability: stable
    brief: "End-to-end duration of processing a single order."
    attributes:
      - ref: ecommerce.payment.method
        requirement_level: required
      - ref: ecommerce.customer.tier
        requirement_level: recommended

  - name: ecommerce.orders.active
    instrument: updowncounter
    unit: "{order}"
    stability: stable
    brief: "Number of orders currently being processed."

  - name: ecommerce.users.registrations
    instrument: counter
    unit: "{registration}"
    stability: stable
    brief: "Total number of successful user registrations."
```



A unidade do histograma muda de `ms` no exemplo de aplicação original para `s` no esquema, seguindo a recomendação de segundos para durações. Weaver não impõe equivalências semânticas como essa, mas valida a string da unidade: `weaver registry check` rejeita unidades malformadas como `secs` ou `mss` pelas regras do [Unified Code for Units of Measure (UCUM)](https://ucum.org/).

As unidades `{order}` e `{registration}` são anotações UCUM para contagens adimensionais. Permitem que consumidores distingam pedidos de bytes ou segundos e que o backend rotule os eixos. O nome da métrica também perde `.total`, pois o tipo do instrumento já indica que se trata de um contador.

Valide o registro:

```bash
weaver registry check -r ./telemetry/registry/
```



Se estiver bem formado, o comando mostra um resumo e termina com código zero. Se faltar `brief` num atributo ou `unit` numa métrica, indica o arquivo e a linha. A versão 0.22.1 também avisa que `definition/2` ainda não é estável; isso não significa um problema no seu registro.

## Passo 2: gere código Go

O valor aparece quando o esquema gera código. Weaver não inclui um template Go padrão; o pacote oficial de convenções Go usa um template próprio. Vamos escrever um pequeno template para o projeto.

Crie o diretório de templates ao lado do registro:

```
stage-1-monolith/
└── telemetry/
    ├── registry/
    │   ├── manifest.yaml
    │   ├── attributes.yaml
    │   └── metrics.yaml
    └── templates/
        └── registry/
            └── go/
                ├── weaver.yaml
                ├── attributes.go.j2
                └── metrics.go.j2
```



A organização importa. Em `weaver registry generate --templates ./telemetry/templates/ go ./internal/telemetry/`, `--templates` aponta ao diretório pai de `registry/`, e `go` escolhe o destino dentro dele. Weaver carrega `./telemetry/templates/registry/go/weaver.yaml` e executa os templates listados.

Esse `weaver.yaml` define o que produzir:

```yaml
# telemetry/templates/registry/go/weaver.yaml
text_maps:
  go_types:
    int: int64
    double: float64
    string: string
    boolean: bool

acronyms: ["HTTP", "API", "ID", "URL", "DB"]

comment_formats:
  go:
    format: markdown
    prefix: "// "

params:
  package_name: telemetry

templates:
  - template: attributes.go.j2
    filter: semconv_grouped_attributes
    application_mode: single
    file_name: "attributes_gen.go"

  - template: metrics.go.j2
    filter: semconv_grouped_metrics
    application_mode: single
    file_name: "metrics_gen.go"
```



O template de atributos percorre a lista e emite uma constante por entrada:

```jinja2
{# telemetry/templates/registry/go/attributes.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Attribute keys from the ecommerce semantic convention registry.
const (
{% for group in ctx %}
{% for attr in group.attributes %}
    {{ attr.brief | comment(format="go") }}
    Attr{{ attr.name | pascal_case_const }} = "{{ attr.name }}"
{% endfor %}
{% endfor %}
)
```



O filtro `comment` recebe o formato como argumento nomeado (`format="go"`) e produz a linha completa `// ...`; o template não deve adicionar outro prefixo. Atributos resolvidos expõem seu identificador em `attr.name`, embora o YAML de entrada use `key`.

O template de métricas segue o padrão, mas o identificador resolvido fica em `metric.metric_name`, não em `metric.name`:

```jinja2
{# telemetry/templates/registry/go/metrics.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Metric names and units from the ecommerce semantic convention registry.
{% for group in ctx %}
{% for metric in group.metrics %}

{{ metric.brief | comment(format="go") }}
const (
    {{ metric.metric_name | pascal_case_const }}Name = "{{ metric.metric_name }}"
    {{ metric.metric_name | pascal_case_const }}Unit = "{{ metric.unit }}"
)
{% endfor %}
{% endfor %}
```



Execute o gerador. O primeiro argumento posicional é o destino; o segundo, o diretório de saída. `--registry` e `--templates` apontam para as fontes:

```bash
weaver registry generate \
    --registry ./telemetry/registry/ \
    --templates ./telemetry/templates/ \
    go \
    ./internal/telemetry/
```



Weaver cria `attributes_gen.go` e `metrics_gen.go` em `internal/telemetry/`. A iteração Jinja deixa linhas vazias extras nos blocos `const`; execute `gofmt -w internal/telemetry/` após cada geração. O workflow do passo 4 já inclui isso. O arquivo de atributos fica assim:

```go
// Code generated by weaver. DO NOT EDIT.

package telemetry

// Attribute keys from the ecommerce semantic convention registry.
const (
    // Customer tier for pricing and feature gates.
    AttrEcommerceCustomerTier = "ecommerce.customer.tier"
    // Identifier of the order being processed.
    AttrEcommerceOrderId = "ecommerce.order.id"
    // Order total in the customer's billing currency.
    AttrEcommerceOrderTotal = "ecommerce.order.total"
    // Payment method selected by the customer.
    AttrEcommercePaymentMethod = "ecommerce.payment.method"
    // Identifier of the customer performing the operation.
    AttrEcommerceUserId = "ecommerce.user.id"
)
```



O arquivo não é menor que o `const.go`, mas tem vantagens relevantes. Cada constante recebe um comentário vindo do esquema, disponível no editor. A capitalização é consistente. O cabeçalho `DO NOT EDIT` e o sufixo `_gen.go` deixam claro que as alterações devem acontecer no esquema.

Para gerar `ID` em maiúsculas, o filtro `acronym` precisa receber a chave original, antes da conversão para PascalCase, e exige mais trabalho no template. O `pascal_case_const` usado aqui basta para começar.

O esquema também conhece os valores permitidos nas enumerações de pagamento e categoria de cliente. Adicione este bloco a `attributes.go.j2`:

```jinja2
{% for group in ctx %}
{% for attr in group.attributes %}
{% if attr.type is mapping and attr.type.members is defined %}
// Allowed values for {{ attr.name }}.
const (
{% for m in attr.type.members %}
    {{ attr.name | pascal_case_const }}{{ m.id | pascal_case_const }} = "{{ m.value }}"
{% endfor %}
)
{% endif %}
{% endfor %}
{% endfor %}
```



Gere novamente e execute `gofmt -w`. O arquivo ganha constantes para cada valor:

```go
// Allowed values for ecommerce.payment.method.
const (
    EcommercePaymentMethodCreditcard = "credit_card"
    EcommercePaymentMethodPaypal     = "paypal"
    EcommercePaymentMethodApplepay   = "apple_pay"
)

// Allowed values for ecommerce.customer.tier.
const (
    EcommerceCustomerTierStandard = "standard"
    EcommerceCustomerTierPremium  = "premium"
)
```



`EcommercePaymentMethodCreditcard` passa a ser a grafia centralizada de `credit_card`. Um erro ao usar o identificador falha na compilação, em vez de produzir um atributo desconhecido para os painéis.

## Passo 3: use na aplicação

Substituir os símbolos na aplicação é mecânico. O handler original era:

```go
// internal/handlers/orders.go (before)
span.SetAttributes(
    attribute.String(telemetry.ATTR_USER_ID, req.UserID),
    attribute.String(telemetry.ATTR_PAYMENT_METHOD, req.PaymentMethod),
)
```



Com a geração, fica:

```go
// internal/handlers/orders.go (after)
span.SetAttributes(
    attribute.String(telemetry.AttrEcommerceUserId, req.UserID),
    attribute.String(telemetry.AttrEcommercePaymentMethod, req.PaymentMethod),
)
```



A criação de métricas em `internal/services/order_service.go` recebe a mesma substituição:

```go
processingHist, err := meter.Float64Histogram(
    telemetry.EcommerceOrdersProcessingDurationName,
    metric.WithDescription("End-to-end duration of processing a single order."),
    metric.WithUnit(telemetry.EcommerceOrdersProcessingDurationUnit),
    metric.WithExplicitBucketBoundaries(0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5),
)
```



Os limites dos buckets também mudaram de milissegundos para segundos. O contrato e o código precisam concordar. A descrição ainda é manual; o mesmo padrão de extensão do template poderia gerar um construtor que inclui descrição e unidade. As constantes já resolvem a divergência mais comum e mantêm o exemplo pequeno.

Apague `const.go`. Manter as constantes manuais convida a recriar o problema que acabamos de resolver.

## Passo 4: aplique o contrato no CI

Um esquema no repositório depende do processo de revisão. Os comandos `check` e `diff` o transformam em uma verificação obrigatória.

`check` valida o registro contra as políticas embutidas e as regras próprias. Execute em cada pull request:

```yaml
# .github/workflows/telemetry.yml
name: telemetry

on:
  pull_request:
    paths:
      - "telemetry/**"
      - ".github/workflows/telemetry.yml"

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5

      - name: Validate the registry
        run: |
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            otel/weaver:v0.22.1 \
            registry check \
              --registry /work/telemetry/registry/
```



A opção `--future` antecipa regras previstas para próximas versões. Na versão usada no artigo, ela trata `definition/2` como erro e faria esse job falhar por um motivo externo ao esquema. Quando o formato for marcado como estável no upstream, reavalie a inclusão da opção.

Validar o esquema detecta erros e campos ausentes, mas não divergência com o código gerado. Para isso:

```yaml
      - name: Generate and verify checked-in code is current
        run: |
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            otel/weaver:v0.22.1 \
            registry generate \
              --registry /work/telemetry/registry/ \
              --templates /work/telemetry/templates/ \
              go \
              /work/internal/telemetry/
          gofmt -w internal/telemetry/
          git diff --exit-code internal/telemetry/
```



O `gofmt -w` evita que linhas vazias do Jinja tornem o diff ruidoso. O job falha quando o esquema muda sem regeneração ou quando alguém edita manualmente um arquivo gerado.

A terceira verificação compara a branch com main. Renomear um atributo estável quebra consultas; remover um atributo obrigatório pode quebrar painéis. O comando `diff` mostra essas mudanças:

```yaml
      - name: Diff against main
        run: |
          git fetch origin main:main
          git worktree add /tmp/main main
          docker run --rm \
            -v "${{ github.workspace }}:/work" \
            -v /tmp/main:/baseline \
            otel/weaver:v0.22.1 \
            registry diff \
              --baseline-registry /baseline/telemetry/registry/ \
              --registry /work/telemetry/registry/ \
              --diff-format markdown
```



A saída destaca itens adicionados, renomeados, depreciados e removidos. Você pode publicá-la no pull request para revisão ao lado do código. Políticas mais rígidas podem reprovar remoções ou renomeações de itens estáveis. O [guia de validação do Weaver](https://github.com/open-telemetry/weaver/blob/main/docs/usage.md) traz exemplos de políticas próprias em Rego.

## Passo 5: spans

Spans merecem atenção própria. Seus nomes costumam ser inventados no ponto de uso, atributos variam entre handlers e a mesma operação acaba registrada com três nomes em serviços diferentes. O padrão de registro e geração também se aplica aqui, com algumas diferenças.

Uma entrada precisa de `type`, `kind`, `brief`, `stability` e `name` estruturado. `type` identifica o esquema, como `ecommerce.order.process`. `kind` pode ser `client`, `server`, `producer`, `consumer` ou `internal`. `name.note` define o nome em execução. Para operações de negócio internas, o identificador separado por pontos é legível e fácil de consultar. Spans HTTP, de banco e mensageria devem seguir as convenções próprias do OpenTelemetry, como `{http.request.method} {http.route}`.

```yaml
# telemetry/registry/spans.yaml
file_format: definition/2

spans:
  - type: ecommerce.order.process
    kind: internal
    stability: stable
    name:
      note: "ecommerce.order.process"
    brief: "Process a single customer order end-to-end."
    attributes:
      - ref: ecommerce.user.id
        requirement_level: required
        sampling_relevant: true
      - ref: ecommerce.payment.method
        requirement_level: required
        sampling_relevant: true
      - ref: ecommerce.order.id
        requirement_level: recommended
      - ref: ecommerce.order.total
        requirement_level: recommended
      - ref: ecommerce.customer.tier
        requirement_level: recommended
```



`sampling_relevant: true` informa aos consumidores e samplers compatíveis que o atributo deve estar disponível no início do span. Marcar usuário e método de pagamento permite decisões de amostragem baseadas nesses dados, em vez de decisões sem esse contexto.

A geração de spans precisa de um filtro jq, pois Weaver não inclui `semconv_grouped_spans`. Adicione uma terceira entrada ao `weaver.yaml`:

```yaml
templates:
  - template: spans.go.j2
    filter: 'semconv_signal("span"; {}) | group_by(.root_namespace) | map({root_namespace: .[0].root_namespace, spans: . | sort_by(.id)})'
    application_mode: single
    file_name: "spans_gen.go"
```



As aspas simples ao redor do filtro são necessárias. Os dois-pontos na expressão conflitam com a sintaxe de mapeamento YAML; sem aspas, o parser pode falhar com `mapping values are not allowed in this context`.

O template percorre os spans resolvidos e gera constantes. O identificador fica em `span.id`, com prefixo `span.`, e o nome de execução em `span.name`. Um `replace` remove o prefixo para formar um identificador Go:

```jinja2
{# spans.go.j2 #}
// Code generated by weaver. DO NOT EDIT.

package {{ params.package_name }}

// Span names from the ecommerce semantic convention registry.
const (
{% for group in ctx %}
{% for span in group.spans %}
    {{ span.brief | comment(format="go") }}
    Span{{ span.id | replace("span.", "") | pascal_case_const }}Name = "{{ span.name }}"
{% endfor %}
{% endfor %}
)
```



Na aplicação, a string literal vira uma constante gerada:

```go
// internal/services/order_service.go
ctx, span := s.tracer.Start(ctx, telemetry.SpanEcommerceOrderProcessName,
    trace.WithAttributes(
        attribute.String(telemetry.AttrEcommerceUserId, userID),
        attribute.String(telemetry.AttrEcommercePaymentMethod, paymentMethod),
    ),
)
```



Também é preciso decidir o que fica fora do registro próprio. Spans de banco, HTTP e mensageria devem seguir as convenções oficiais, sem redefinições em `ecommerce.`. Enquanto o registro upstream não for importado como dependência, continue usando o pacote oficial semconv nos pontos correspondentes. No repositório de pedidos do monólito:

```go
// internal/repositories/order_repo.go
import semconv "go.opentelemetry.io/otel/semconv/v1.34.0"

ctx, span := r.tracer.Start(ctx, "INSERT orders",
    trace.WithAttributes(
        semconv.DBSystemNamePostgreSQL,
        semconv.DBOperationName("INSERT"),
        semconv.DBCollectionName("orders"),
        attribute.String(telemetry.AttrEcommerceOrderId, order.ID),
    ),
)
```



Os atributos de banco `db.system.name`, `db.operation.name` e `db.collection.name` vêm do pacote oficial. O atributo de negócio `ecommerce.order.id` vem das constantes geradas. Misturar ambos no mesmo span é o padrão adequado; redefinir `db.system.name` no registro próprio, não.

## O resultado: um contrato de telemetria

O esquema declara atributos, métricas e spans, sua estabilidade e suas unidades. O gerador produz o código usado pela aplicação. O CI aplica o contrato em cada mudança. A documentação gerada — por `weaver registry generate markdown` com templates apropriados — oferece uma referência comum para consumidores, equipes de análise e revisores de segurança.

Isso não impede toda instrumentação ruim. Alguém ainda pode emitir um atributo fora do esquema, passar um valor incorreto ou voltar a strings literais. `weaver registry live-check` ajuda a detectar esses casos e merece um artigo separado. Aqui, o objetivo é eliminar divergências despercebidas entre contrato e código, tornando-as visíveis na revisão antes de um incidente.

## Próximos passos

**Publique o registro como artefato.** Compactar os arquivos YAML e anexá-los a uma release permite que consumidores fixem uma versão, como `ecommerce@1.2.0`, e saibam quais atributos esperar.

**Estenda o registro oficial do OpenTelemetry.** O manifest aceita dependências como [open-telemetry/semantic-conventions](https://github.com/open-telemetry/semantic-conventions). O esquema pode então referenciar atributos upstream e gerar um pacote que reúne convenções próprias e importadas.

**Adicione [validação ao vivo](https://github.com/open-telemetry/weaver/blob/main/docs/usage.md) aos testes de integração.** Aponte `weaver registry live-check` para um endpoint local, execute a suíte e reprove violações do esquema. Isso cobre o caso em que alguém ignora as constantes.

**Escreva políticas Rego próprias.** Codifique prefixos obrigatórios, atributos exigidos em spans voltados ao cliente ou limites de valores enumerados, junto das regras embutidas.

**Gere uma API de instrumentação com tipos.** O mesmo registro pode produzir uma camada sobre o SDK que valida valores por assinaturas tipadas e cria instrumentos com nomes e unidades corretos. Exige mais templates, mas remove caminhos que ainda dependem de strings e mantém o preenchimento automático alinhado ao contrato.

**Explore as outras ferramentas.** Além de `check`, `generate` e `diff`, `serve` oferece uma interface local de navegação e busca; `stats` descreve o registro; `infer` infere um registro a partir de OTLP; e `mcp` o expõe a agentes de IA pelo Model Context Protocol.

**Acompanhe [opentelemetry-weaver-packages](https://github.com/open-telemetry/opentelemetry-weaver-packages).** O projeto busca fornecer templates e políticas prontos. O caminho manual ajuda a entender o funcionamento, enquanto pacotes podem reduzir o esforço em projetos novos.

Cada direção merece seu próprio projeto. Esquema, geração, integração à aplicação e CI formam a base de um contrato aplicado de fato.

O monólito está em [telemetrydrops/otel-in-practice](https://github.com/telemetrydrops/otel-in-practice), na branch `adopt-weaver`. A referência da ferramenta está em [open-telemetry/weaver](https://github.com/open-telemetry/weaver). Copie as peças para seu repositório, apague o equivalente a `const.go` e veja quais divergências aparecem na primeira validação.

## Agradecimentos

Agradecemos a Jeremy Blythe, Michael Hausenblas e Laurent Querel pela revisão de uma versão anterior do artigo e pelas contribuições à versão final.
