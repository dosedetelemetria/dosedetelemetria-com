---
title: "Telemetria, Monitoramento e Observabilidade"
slug: "telemetria-monitoramento-e-observabilidade"
description: "O que é telemetria, e qual sua relação com o monitoramento e observabilidade?"
publishedAt: "2024-01-04T21:39:41.487Z"
author: "juraci"
tags: ["telemetria", "monitoramento", "observabilidade"]
heroImage: "../../assets/blog/telemetria-monitoramento-e-observabilidade.png"
heroImageAlt: "Fluxos de dados e nós conectados em uma paisagem digital."
---

A telemetria, frequentemente esquecida nas discussões sobre tecnologia, é um elemento crucial no entendimento e aprimoramento do desempenho das aplicações. Ela refere-se aos dados gerados por uma aplicação que não são diretamente ligados ao seu aspecto comercial, mas que são essenciais para entender o comportamento do software.

Uma excelente maneira de compreender o que é telemetria é através da analogia com a condução de um carro. Quando dirigimos, uma série de dados como velocidade, aceleração, e desaceleração são constantemente registrados. Esses dados, semelhantes aos gerados por uma aplicação, fornecem insights sobre o desempenho, como a velocidade de processamento ou o número de requisições recebidas por minuto.

## Os **Tipos Principais de Dados de Telemetria**

**Logs**: Esses são registros de eventos específicos que ocorrem durante a operação da aplicação. Eles são cruciais para o processo de depuração e fornecem um relato detalhado do que aconteceu e quando.

**Métricas**: Representam um resumo agregado de como a aplicação está funcionando. Por exemplo, elas podem quantificar o número atual de visitantes de um site. Métricas podem ser representadas de várias formas, incluindo contadores que só aumentam ou valores que variam.

**Rastros**: Estes são conjuntos de informações que ajudam a entender o percurso de uma requisição específica através de vários processos ou microserviços. Eles são fundamentais para compreender como as diferentes partes de uma aplicação interagem.

### Outros Sinais

Existem também outros tipos de dados de telemetria que são importantes para entender o desempenho e o comportamento de uma aplicação, entre eles:

**Eventos**: São registros de ocorrências significativas que ocorrem durante a execução da aplicação. Eles podem ser utilizados para identificar eventos específicos e analisar seu impacto no sistema.

**Perfis**: Permitem o monitoramento e a análise do desempenho de uma aplicação ao longo do tempo. Eles fornecem informações detalhadas sobre a utilização de memória, tempo de execução de funções e outros aspectos relacionados ao desempenho.

**Erros (Stack Traces)**: São registros que capturam informações sobre exceções e erros que ocorrem durante a execução da aplicação. Esses registros são essenciais para identificar e corrigir problemas no sistema.

Esses tipos adicionais de dados de telemetria complementam os logs, métricas e rastros mencionados anteriormente, fornecendo uma visão mais completa e detalhada do desempenho e do estado da aplicação.

## **Monitoramento vs. Observabilidade**

### Monitoramento

O monitoramento diz respeito a ter respostas para perguntas conhecidas sobre uma aplicação. Por exemplo, receber um alerta quando a CPU de um servidor atinge 90% de sua capacidade. É uma forma proativa de estar ciente do estado atual do sistema.

### Observabilidade

Por outro lado, a observabilidade se refere à capacidade de entender o que está acontecendo em um sistema com base nos dados coletados, incluindo a telemetria. Ela é crucial para diagnosticar problemas não previstos durante o desenvolvimento.

## **Conclusão**

Em resumo, a telemetria é a matéria-prima para o monitoramento e a observabilidade em tecnologia da informação. Ela fornece os dados necessários para compreender profundamente o funcionamento de uma aplicação, permitindo a otimização e a manutenção eficiente do sistema.

## Vídeo original

Falei sobre este tópico em um vídeo disponível no canal do [Dose de Telemetria](https://www.youtube.com/@DoseDeTelemetria) no YouTube. Você pode assistir ao vídeo [aqui](https://youtu.be/x-FKKFCMbjc).

[Assistir ao vídeo no YouTube](https://www.youtube.com/watch?v=x-FKKFCMbjc)
