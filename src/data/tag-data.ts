export const tagInfo = {
  "metricas": {
    "displayName": "Métricas",
    "description": "Métricas e seu papel na análise e no custo da telemetria."
  },
  "observabilidade": {
    "displayName": "Observabilidade",
    "description": "Conceitos e práticas para compreender sistemas a partir da telemetria."
  },
  "logs": {
    "displayName": "Logs",
    "description": "Registros de eventos, custos e conversão de logs em métricas."
  },
  "opentelemetry": {
    "displayName": "OpenTelemetry",
    "description": "Instrumentação e coleta de telemetria com OpenTelemetry."
  },
  "opentelemetry-collector": {
    "displayName": "OpenTelemetry Collector",
    "description": "Processamento de logs, métricas e rastros no Collector."
  },
  "engenharia-de-observabilidade": {
    "displayName": "Engenharia de observabilidade",
    "description": "Conhecimentos, ferramentas e práticas da engenharia de observabilidade."
  },
  "carreira": {
    "displayName": "Carreira",
    "description": "Aprendizado e desenvolvimento profissional em observabilidade."
  },
  "apm": {
    "displayName": "APM",
    "description": "O papel do gerenciamento de desempenho de aplicações na observabilidade."
  },
  "monitoramento": {
    "displayName": "Monitoramento",
    "description": "Monitoramento de sistemas e sua relação com a observabilidade."
  },
  "telemetria": {
    "displayName": "Telemetria",
    "description": "Geração e uso de logs, métricas, rastros e outros sinais."
  },
  "faq": {
    "displayName": "Perguntas frequentes",
    "description": "Respostas a dúvidas sobre telemetria e seu impacto nos sistemas."
  },
  "diversao": {
    "displayName": "Diversão",
    "description": "Observabilidade com criatividade, música e humor."
  }
} as const;

export type ValidTag = keyof typeof tagInfo;
export const VALID_TAGS = Object.keys(tagInfo) as [ValidTag, ...ValidTag[]];
