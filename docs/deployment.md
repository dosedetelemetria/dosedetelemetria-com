# Publicação do website

O site é estático. `bun run build` produz `dist/` e gera o sitemap, versões
Markdown das páginas e `/llms-full.txt` a partir do HTML. O Worker
`dosedetelemetria-com` usa `worker/index.js` e o binding `ASSETS`, definidos em
`wrangler.jsonc`. Não há renderização no servidor, adapter Astro, KV ou serviço
Cloudflare Images.

## Workers Builds

O Worker está conectado ao repositório GitHub privado
`dosedetelemetria/dosedetelemetria-com`, com `main` como branch de produção.

| Configuração | Comando |
| --- | --- |
| Build | `bun run build` |
| Deploy de produção | `bunx wrangler deploy` |
| Deploy de prévia | `bunx wrangler preview` |

Prévia e produção usam a versão de Wrangler fixada pelo lockfile. O comando local
`bun run deploy` inclui o build; Workers Builds executa build e deploy separadamente.
O cliente Supabase mantém a configuração pública existente de Dose de Telemetria.
Nenhuma chave privilegiada deve entrar no código do navegador ou nos arquivos de
configuração. Variáveis de build e secrets de servidor têm finalidades distintas.

## Respostas e validação

O Worker executa antes dos arquivos estáticos e usa `ASSETS` para buscar a versão
HTML e sua alternativa Markdown na mesma implantação. GET e HEAD preservam
`Vary: Accept`; Markdown negociado usa `Cache-Control: no-store` e `X-Robots-Tag:
noindex`. Falha ao obter Markdown preserva o HTML. Caminhos ausentes mantêm 404.
`public/_headers` marca Markdown direto como `noindex`; `public/_redirects` mantém
os caminhos legados de cursos e preços. www redireciona para o domínio principal,
preservando caminho e parâmetros.

```sh
bunx wrangler dev --port 8791
curl -i http://localhost:8791/products/
curl -i -H 'Accept: text/markdown' http://localhost:8791/products/
curl -I -H 'Accept: text/markdown' http://localhost:8791/products/
curl -i http://localhost:8791/nao-existe
```

Repita as verificações na prévia Cloudflare e no domínio público. Confira imagens
PNG, tipo de conteúdo, redirecionamentos permanentes e ausência de loops. Um teste
real de envio da lista de interesse exige dados e consentimento do responsável;
renderização e hidratação do formulário não provam a entrega de notificações.

## Domínios e rollback

A zona Cloudflare `dosedetelemetria.com` tem o ID
`eff6f24a1b3884a9205cd57974f3346a`, na conta
`4fabfd40ab08da2af6847bb16ad1f7d3`. Os hostnames principais de conteúdo são
`dosedetelemetria.com` e `www.dosedetelemetria.com`. Os registros de email e os
subdomínios de comunidade e landing pages são independentes.

O hostname `blog.dosedetelemetria.com` usa o mesmo Worker exclusivamente para
redirecionamentos permanentes. Artigos e temas usam o inventário em
`src/data/blog-migration.json`; o feed antigo aponta para `/blog/rss.xml`.
URLs desconhecidas do host antigo retornam 404. Os redirecionamentos preservam
parâmetros e os artigos mantêm aliases dos fragmentos originais.

O rollback do hostname do blog é um CNAME para `hashnode.network`, sem proxy
Cloudflare e com TTL automático, após remover sua associação de domínio
personalizado do Worker. A publicação em Hashnode não é apagada pela migração.

A configuração de rollback para Netlify é um CNAME no domínio principal para
`apex-loadbalancer.netlify.com` e um CNAME de www para `dosedetelemetria.com`, ambos
com proxy Cloudflare e TTL automático. Para restaurar o Netlify, remova primeiro
as associações de domínio personalizado do Worker e recrie esses dois registros.
Mantenha o último deploy Netlify disponível até a validação da migração. Não
altere registros MX/TXT nem os demais subdomínios.
