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
css/style.css       Toda a identidade visual — cores no bloco :root
js/script.js        Menu, WhatsApp, formulário, cookies, captura de UTMs
img/                Logo, favicon, isolinhas e a pasta media/
img/media/          Imagens fotográficas (geradas no higgsfield — ver abaixo)
scripts/            baixar-imagens.sh (baixa as imagens do higgsfield)
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
| **Imagens do higgsfield** | Rode `bash scripts/baixar-imagens.sh` na sua máquina (o ambiente onde o site foi gerado tem a saída para o CDN bloqueada). As imagens vão para `img/media/`. |
| **Logotipo vetorizado** | Salve como `img/logo.svg` e troque o bloco marcado com `TODO` no `<header>` de cada página (`<img src="img/logo.svg" alt="Outorga Fácil">`). Gere também `img/apple-touch-icon.png` (180×180) e um `favicon.ico` a partir dele. Se a paleta do logo divergir, ajuste as cores no `:root` do `css/style.css`. |
| **CNPJ** | Não foi incluído (não inventamos). Se quiser exibir, adicione no rodapé e no JSON-LD (`ProfessionalService`) das páginas. |
| **apple-touch-icon.png** | Ainda não gerado (o ambiente não tinha conversor de imagem). Gere 180×180 a partir do logo/favicon. |

## Imagens (higgsfield)

As 5 imagens fotográficas foram geradas com o higgsfield (modelo
`nano_banana_pro`, 2k, 16:9). Elas existem no CDN do higgsfield, mas o
download automático foi bloqueado pela política de rede do ambiente de
geração. Para trazê-las:

```bash
bash scripts/baixar-imagens.sh
```

O script baixa e (se houver ImageMagick) converte para JPG otimizado em
`img/media/`, além de criar o `og-image.jpg` a partir do hero. **Sem essas
imagens o site continua funcionando** — os blocos exibem um gradiente da
paleta como fallback.

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
