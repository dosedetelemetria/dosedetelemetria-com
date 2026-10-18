---
title: "O Dilema da Telemetria"
slug: "o-dilema-da-telemetria"
description: "Quanto de telemetria devemos ter, sem sobrecarregar ainda mais nossos sistemas?"
publishedAt: "2024-01-04T21:13:18.214Z"
author: "juraci"
tags: ["observabilidade", "faq", "telemetria"]
heroImage: "../../assets/blog/o-dilema-da-telemetria.png"
heroImageAlt: "Rede densa de sinais luminosos diante de painéis de métricas e código."
updatedAt: "2024-01-05T09:24:19.305Z"
---

Dependemos de dados de telemetria para compreender o estado de nossas aplicações, nos ajudando no diagnóstico de eventuais problemas. Porém, como nada é de graça, acabamos pagando por cada novo dado de telemetria gerado: cada métrica, cada trecho de um rastro, cada registro de log nos traz um custo, tanto de processamento quanto de memória e armazenamento. Se não tomarmos cuidado, podemos acabar sobrecarregando ainda mais um sistema que talvez já esteja sobrecarregado.

Em alguns casos, isso pode até precipitar falhas que de outra forma poderiam ter sido evitadas: já tive uma experiência no passado em que a escrita síncrona de logs estava causando uma degradação significativa de performance em um sistema de alta concorrência.

## **Métricas**

Em contraste com logs ou rastros, as métricas são geralmente menos invasivas. Elas são predefinidas e agregadas, o que minimiza o impacto no desempenho do sistema. No entanto, problemas podem surgir durante a atualização concorrente dos contadores ou na transmissão desses dados: diferentes bibliotecas utilizam diferentes técnicas que podem não ser as mais corretas para seu caso de uso.

Um dos maiores desafios ao utilizar sistemas do tipo pull, como o Prometheus, é encontrar um equilíbrio adequado entre a frequência das requisições feitas pelo servidor ao cliente que está expondo as métricas e a quantidade adequada de métricas que o cliente deve expor. É importante garantir que o servidor não faça requisições tão frequentes que sobrecarreguem o cliente, nem que o cliente exponha um número excessivo de métricas que possa impactar negativamente o desempenho do sistema.

Já em sistemas push, como o OTLP (OpenTelemetry Protocol), é importante considerar que vários clientes podem enviar dados para o mesmo servidor simultaneamente. Portanto, o servidor precisa ter capacidade para receber todos esses dados.

## **Rastros**

Os trechos (spans) em rastros (traces) representam um desafio maior. Por serem sinais de alta resolução, sem agregação, eles utilizam armazenamento de dados em memória e podem aumentar a carga no sistema. A gestão eficaz desses rastros é crucial para minimizar seu impacto. Estratégias como amostragem (sampling) ou envio de dados em lotes (batching) podem ajudar nessa tarefa. Mas ainda assim, quanto mais trechos são utilizados em um determinado serviço, maior o número de dados que são mantidos em memória: trechos apenas são enviados para o destino quando são finalizados, o que geralmente acontece somente no final da requisição.

## Logs

Já quando falamos de logs, nossa maior preocupação é com I/O: conseguimos escrever todos os registros na nossa saída de log? Hoje em dia, a prática comum é de escrever em stdout e stderr, mas essas saídas têm performance boa o suficiente para o volume de registros que você está esperando? Aqui, a saída mais sensata é converter eventos que iriam para o registro de logs em métricas, quando podem ser agregados, ou em trechos de um rastro, quando o evento pertence a uma transação específica.

## Cuidado com o Desperdício

Um aspecto crítico é o consumo de rede e o armazenamento de dados de telemetria. Na minha experiência, muitos dados coletados acabam não sendo utilizados, o que resulta em desperdício de recursos. Portanto, é importante não apenas considerar como a telemetria é gerada e coletada, mas também como ela é usada. Se os dados de rastreamento distribuído são apenas armazenados e raramente lidos, pode ser interessante aplicar uma estratégia mais forte de amostragem, para que menos dados sejam enviados e armazenados. Além disso, reduzir o número de dimensões de uma métrica pode diminuir significativamente o número de séries temporais no banco de dados. E converter logs em métricas certamente vai reduzir muito seus custos de rede e armazenamento!

## **Conclusão**

A telemetria é essencial para diagnóstico e otimização de sistemas, mas seu uso deve ser cuidadosamente gerenciado para evitar impactos negativos adicionais, especialmente em sistemas críticos e de alta concorrência.

## Vídeo original

Falei sobre este tópico em um vídeo disponível no canal do [Dose de Telemetria](https://www.youtube.com/@DoseDeTelemetria) no YouTube. Você pode assistir ao vídeo [aqui](https://www.youtube.com/watch?v=fllOmv0fIK8).

[Assistir ao vídeo no YouTube](https://www.youtube.com/watch?v=fllOmv0fIK8)
