# Outorga Fácil — Site institucional

Site estático (HTML + CSS + JS, sem build) da **Outorga Fácil — Soluções em
Regularização Hídrica e Ambiental**. Consultoria documental e técnica em
regularização de poços e captação de água (outorga, dispensa, CETESB e
vigilância sanitária) em todo o Estado de São Paulo.

## Estrutura

```
index.html          Home (hero, casos, serviços, como funciona, notificação, FAQ)
servicos.html       4 blocos de serviço expandidos + faixa "Recebeu notificação?"
sobre.html          Quem somos, como atuamos, área de atuação
contato.html        Formulário (envia para o WhatsApp) + canais + LGPD
privacidade.html    Política de Privacidade (LGPD)
css/style.css       Identidade visual + fundo animado do hero — cores no :root
js/script.js        Menu, WhatsApp, formulário, cookies, captura de UTMs
img/                Logo, favicon e isolinhas (as fotos vêm do CDN — ver abaixo)
robots.txt · sitemap.xml
```

## Como visualizar localmente

Não precisa de build. Basta servir a pasta:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## Publicar (deploy)

O site é estático — sobe em qualquer hospedagem. Opções fáceis:

- **Netlify:** arraste a pasta em app.netlify.com/drop, ou conecte o
  repositório. Sem comando de build; publish directory = raiz (`/`).
- **Vercel:** `Import Project` → framework **Other** → sem build → output raiz.
- **GitHub Pages:** Settings → Pages → Branch `main` / `/root`.

### Apontar o domínio (outorgafacil.com.br)

1. No painel da hospedagem, adicione o domínio `outorgafacil.com.br` (e
   `www.outorgafacil.com.br`).
2. No seu registrador de domínio, aponte o DNS conforme a hospedagem indicar
   (normalmente um registro **A** para o IP informado e um **CNAME** de `www`).
3. Ative o HTTPS (Netlify e Vercel emitem certificado gratuito automaticamente).

## ⚠️ Pendências (o que falta da sua parte)

| Item | Onde preencher |
|---|---|
| **WhatsApp** (formato internacional, ex.: `5511915230152`) | `js/script.js`, variável `var WHATSAPP` no topo. Enquanto vazio, os botões avisam e o formulário cai para e-mail. |
| **CNPJ** | Não foi incluído (não inventamos). Se quiser exibir, adicione no rodapé e no JSON-LD (`ProfessionalService`) das páginas. |

### ✅ Já resolvido

- **Logotipo aplicado** — `img/logo.svg` (colorido, no header) e `img/logo-branco.svg`
  (versão monocromática branca vazada, no rodapé e na 404), sem alteração do vetor.
- **Paleta ajustada ao logo** — navy `#04263F` + verde `#3E4C3A` (com sage `#9CBF95`
  para destaques sobre navy). Editável no `:root` do `css/style.css`.
- **Ícones gerados a partir do logo** — `img/favicon.svg`, `img/apple-touch-icon.png`
  (180×180) e `img/icon-512.png` (512×512). Para um `favicon.ico` clássico, converta
  o `favicon.svg` (opcional; navegadores modernos já usam o SVG).

## Imagens e fundo animado (higgsfield)

As 5 imagens fotográficas foram geradas com o higgsfield (modelo
`nano_banana_pro`, 16:9) e são servidas **direto do CDN do higgsfield** na
versão otimizada `_min.webp` (~120–430 KB cada). Não é preciso baixar nada:
o navegador carrega as imagens automaticamente.

- **Fundo animado do hero:** um *slideshow* que faz crossfade entre as 5
  imagens com um leve zoom (Ken Burns), definido em `css/style.css` nos blocos
  `.hero-slide` e `@keyframes heroKB`. Respeita `prefers-reduced-motion`.
- **Cards e seções:** cada serviço usa a foto correspondente (também via CDN).
- **Fallback:** se uma imagem não carregar, o bloco exibe o navy/gradiente da
  paleta — o layout nunca fica "quebrado".

### Quer as imagens hospedadas no seu próprio domínio?

As URLs do CDN são públicas e estáveis, mas se preferir um site 100%
self-contained, baixe as 5 imagens e troque as URLs
`https://d8j0ntlcm91z4.cloudfront.net/...` por caminhos locais em
`css/style.css` (hero) e nos `<img>` de `index/servicos/sobre.html`.

## Rastreamento (GA4 / Meta) — preparado e desligado

O `js/script.js` já captura UTMs (first-touch e last-touch) em cookie e envia
junto com o formulário, **sem disparar nada** enquanto não houver
configuração. Para ativar GA4 e/ou Meta Pixel, inclua as respectivas tags no
`<head>` das páginas quando tiver os IDs — nada é carregado por padrão.

## Regras de conteúdo respeitadas

- Nenhuma promessa de aprovação, deferimento ou prazo do órgão público.
- Nenhum número de clientes, anos de mercado, certificação ou selo inventado.
- Comunicação sempre institucional (sem citar profissional, CREA ou nome).
- Legislação citada de forma genérica e correta (Lei 9.433/1997, Lei Estadual
  7.663/1991, Portaria GM/MS 888/2021).
- Órgão gestor correto para SP: **SP Águas** (ex-DAEE).
