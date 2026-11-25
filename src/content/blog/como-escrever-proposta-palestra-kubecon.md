---
title: "O que observo ao avaliar propostas de palestras para a KubeCon"
seoTitle: "Como escrever uma proposta de palestra para a KubeCon"
slug: "como-escrever-proposta-palestra-kubecon"
description: "Um revisor da KubeCon explica como escrever uma proposta com um problema claro, uma perspectiva nova e um resultado prático."
publishedAt: "2026-11-25"
author: "juraci"
tags: ["carreira"]
heroImage: "../../assets/blog/como-escrever-proposta-palestra-kubecon.webp"
heroImageAlt: "Uma folha creme presa a um púlpito escuro com microfone, ao lado de uma pilha de propostas."
sourceUrl: "https://telemetrydrops.com/blog/writing-a-kubecon-talk-proposal/"
tldr: "Organize o resumo da sua palestra em torno do problema, da solução e do que o público poderá aplicar. Diga logo o que há de novo e mostre o que a sua experiência acrescenta."
keyTakeaways:
  - "Dedique um parágrafo ao problema, um à solução e um ao que o público leva da palestra."
  - "Apresente a perspectiva nova logo no início e mostre de onde vem a sua experiência."
  - "Baseie a palestra em código aberto e use IA para lapidar os detalhes que só você conhece."
---

A KubeCon + CloudNativeCon North America 2026 já passou. Se você está pensando em propor uma palestra para uma próxima KubeCon, aqui vai o que observo quando avalio uma proposta. São padrões que vi em centenas de propostas para a KubeCon e o Observability Day nos últimos ciclos.

As [orientações para revisores](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/submission-reviewer-guidelines/) indicam cinco critérios de avaliação: conteúdo, originalidade, relevância, adequação de quem apresenta e ausência de promoção comercial. As propostas que vão bem deixam claro o que justifica uma boa nota em cada critério.

## Organize o resumo em problema, solução e resultado para o público

Escreva o resumo em três parágrafos. No primeiro, apresente o problema. No segundo, descreva como você resolveu o problema ou o que vai apresentar. No terceiro, diga o que o público poderá levar da palestra para o próprio trabalho.

Essa estrutura ajuda quem avalia a proposta e, meses depois, quem lê a programação para escolher em qual sala entrar. Cada parágrafo responde a uma pergunta. O primeiro ajuda a pessoa a reconhecer se enfrenta aquele problema. O segundo dá elementos para avaliar a sua abordagem e confiar que ela funcionou. O terceiro mostra o que se aplica ao trabalho dela.

Veja como fica numa palestra fictícia.

> Usamos tail sampling em uma camada de OpenTelemetry Collectors que decide quais rastros manter para 300 serviços. Sempre que mudávamos a escala ou atualizávamos essa camada, spans do mesmo rastro iam parar em réplicas diferentes. Os rastros com erro que guardávamos acabavam sem os spans que explicavam a falha. E os primeiros minutos depois de uma implantação são justamente quando alguém pode estar investigando um problema na nova versão.
>
> Nesta palestra, mostro como usamos o resolvedor Kubernetes do exportador com balanceamento de carga e o roteamento pelo ID do rastro. Também conto como mudamos o procedimento de implantação para reduzir a fragmentação dos rastros durante mudanças no conjunto de réplicas. Vamos ver as duas abordagens que tentamos primeiro e por que as abandonamos.
>
> Você sai da palestra com uma configuração de referência para fazer tail sampling em uma arquitetura de Collectors em duas camadas, uma lista de verificação para atualizar camadas do Collector que mantêm estado e os sinais que usamos para detectar rastros fragmentados antes que prejudiquem uma investigação.

São os detalhes que dão credibilidade: 300 serviços, duas abordagens descartadas e uma configuração que o público pode copiar.

O terceiro parágrafo costuma ser o mais vago. “O público vai entender melhor tail sampling” deixa em aberto o que alguém consegue fazer na segunda-feira. Especifique a configuração, a lista de verificação, os critérios de decisão ou a técnica que a pessoa vai levar.

## Tire o fornecedor do centro da palestra

Mesmo que você trabalhe para um fornecedor, baseie a palestra em código aberto. Use projetos da Cloud Native Computing Foundation (CNCF) e ferramentas que qualquer pessoa possa adotar. Assim o público consegue avaliar as ideias pelo que elas oferecem. Pergunte a si mesmo se alguém conseguiria aplicar o que você mostrou sem virar cliente da sua empresa.

Uma captura de tela de um produto comercial pode ilustrar um cenário. Toda demonstração precisa de um backend, e é natural usar aquele que você conhece. O problema aparece quando a funcionalidade que sua empresa acabou de lançar vira o assunto da palestra. Imagine uma apresentação sobre uma técnica de amostragem que só o seu fornecedor implementa. Usar o produto como exemplo nesse caso transforma a palestra em divulgação comercial, mesmo com todos os slides tecnicamente corretos. Isso pesa na avaliação.

## Dê tempo para um projeto novo amadurecer

Quando avalio uma proposta centrada num projeto recém-criado, me pergunto se ele ainda vai existir e ser relevante na próxima KubeCon. Se a resposta é “não sei”, dificilmente dou uma nota alta. Por isso, é difícil um projeto muito novo chegar ao palco.

Abro exceções quando quem lançou o projeto já tem um histórico de manutenção. Se a pessoa mantém um projeto e lança uma ferramenta para ele, ou se já é conhecida na comunidade pelo trabalho de manutenção, esse histórico dá motivos para acreditar que o projeto terá continuidade. A experiência de quem propõe a palestra pesa bastante nesses casos.

Se o seu projeto acabou de nascer, dê tempo para ele ganhar usuários, publicar versões regularmente e atrair contribuições de fora da equipe. Em um ou dois ciclos, você pode ter uma proposta bem mais forte. Enquanto isso, apresente o trabalho em meetups e conferências locais.

## Mostre por que você é a pessoa certa para apresentar

Isso vale também para projetos maduros. Quem avalia a proposta precisa entender por que faz sentido ouvir você falar sobre aquele assunto agora.

Palestras introdutórias funcionam bem em meetups e conferências locais. A KubeCon também tem espaço para elas, mas outras pessoas provavelmente vão propor a mesma introdução. Se chegam cinco propostas sobre o mesmo projeto, raramente há espaço para mais de uma. Por que escolher a sua?

Mostre o que você fez com aquele projeto: a migração que liderou, a escala em que o opera, o incidente que ensinou algo que a documentação não cobre ou o próprio projeto que você mantém. Inclua essa experiência no resumo. Uma proposta que qualquer pessoa da área poderia escrever dá poucos motivos para escolher você.

## Diga logo o que há de novo

Originalidade é um dos critérios. Mesmo um trabalho excelente pode perder pontos se um artigo ou uma palestra da KubeCon de 2022 já cobriu a mesma ideia. Quem avalia costuma lembrar de apresentações de edições anteriores e consegue procurá-las quando precisa.

Releia a proposta. O que há de novo? Por que vale falar disso agora? Quem já apresentou sobre o assunto? Pesquise as edições anteriores. As programações continuam disponíveis e as gravações estão no [canal da CNCF no YouTube](https://www.youtube.com/@cncf).

A novidade pode vir de outra escala, de uma versão mais recente, de uma restrição que as palestras anteriores não enfrentaram ou de uma lição que só apareceu depois. Coloque isso no primeiro parágrafo, junto do problema. No exemplo acima, eu começaria assim: “Palestras anteriores mostraram como configurar tail sampling atrás do exportador com balanceamento de carga. Aqui, vou mostrar o que falha quando essa camada muda de escala ou passa por uma atualização.” Assim, quem lê entende como a nova palestra dá continuidade às anteriores.

## Encontre a palestra que só você pode dar

Fica mais fácil aplicar essas sugestões quando você sabe o que só você pode contar. Peça ao Claude, ao Codex ou aos seus agentes que revisem o que você fez no último ano e procurem histórias que só você pode contar. Um ponto de partida:

```text
Revise meus commits, pull requests e issues no GitHub e no GitLab,
além dos meus tickets no Jira e no Linear, dos últimos 12 meses.
Encontre problemas que resolvi e que outras equipes usuárias dos mesmos
projetos de código aberto provavelmente também enfrentam. Para cada um,
diga o que fiz de diferente da documentação ou da abordagem mais comum
e que evidências existem (números, pull requests, análises de incidentes).
```

Antes de dar a um agente acesso a tickets internos, verifique o que sua empresa permite compartilhar. Trate a resposta como uma lista de possíveis pautas.

O exercício é especialmente valioso para quem usa esses projetos no dia a dia. Essas pessoas aplicam as ferramentas de formas que nem sempre ocorrem a quem as mantém. Daí saem algumas das palestras mais valiosas da conferência. Que história você pode contar sobre o resultado de fazer algo um pouco diferente, lidar com outro volume ou trabalhar sob outras condições?

## Use IA para melhorar uma proposta que seja sua

Além de ajudar a encontrar uma história, a inteligência artificial (IA) pode sugerir títulos e recortes, lapidar o resumo e fazer uma leitura crítica como a de um revisor.

Em 2026, quem avalia propostas reconhece de longe texto genérico gerado por IA. Uma proposta que sai de um tema e um prompt tende a soar como centenas de outras. O que dá identidade ao texto são os detalhes que só você conhece: os números do seu sistema, as abordagens que tentou e abandonou e as opiniões que formou ao fazer o trabalho. Use a IA para dar mais clareza a esses detalhes e preserve a sua voz.

Quando tiver uma versão sua, use algo assim para a revisão crítica:

```text
Atue como revisor do comitê de programação da KubeCon. Dê uma nota de
1 a 5 à proposta em conteúdo, originalidade, relevância, adequação de
quem apresenta e ausência de promoção comercial. Justifique cada nota
em duas frases. Liste os trechos mais fracos, as afirmações sem evidência
e as palestras anteriores da KubeCon que cobrem o mesmo assunto.
Por fim, compare a proposta com as recomendações do artigo colado abaixo.
```

Confirme se as palestras citadas existem. Modelos às vezes inventam referências.

## Resumo

Uma boa proposta facilita a avaliação e ajuda o público a decidir se quer assistir à palestra.

- Escreva o resumo em três parágrafos. Apresente o problema, a solução ou o conteúdo e o que o público poderá aplicar.
- Apoie a palestra em código aberto e em projetos da CNCF. Use uma captura de tela de fornecedor apenas quando ela ajudar a explicar o cenário.
- Dê tempo para um projeto novo amadurecer, a menos que seu histórico de manutenção já demonstre que ele pode ter continuidade.
- Mostre por que você é a pessoa certa para falar do assunto, especialmente numa palestra introdutória.
- Pesquise palestras anteriores e explique no primeiro parágrafo o que há de novo e por que isso importa agora.
- Revise o trabalho do último ano para encontrar uma história que só você pode contar.
- Use IA para explorar ideias, lapidar o texto e fazer uma revisão crítica. Preserve sua experiência e sua voz na proposta final.

Quando abrir a próxima chamada de propostas, comece pela história. Outras pessoas vão propor palestras sobre o mesmo tema. A sua história dá a quem avalia um motivo para escolher a sua.
