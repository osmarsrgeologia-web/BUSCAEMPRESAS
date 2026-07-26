#!/usr/bin/env bash
# =====================================================================
# Baixa as imagens geradas no higgsfield para img/media/ e as converte
# para JPG otimizado (se o ImageMagick estiver instalado).
#
# Rode este script na SUA máquina (fora do ambiente do Claude, que tem
# a saída para o CDN bloqueada por política de rede):
#
#     bash scripts/baixar-imagens.sh
#
# Requisitos opcionais: ImageMagick (`magick` ou `convert`) para gerar
# JPGs mais leves. Sem ele, as imagens ficam como .png (funciona igual).
# =====================================================================
set -e
cd "$(dirname "$0")/.."
mkdir -p img/media
BASE="https://d8j0ntlcm91z4.cloudfront.net/user_3H3FyQ8E6HKsRoVtXDM5uRXmRjq"

declare -A IMG=(
  ["hero"]="hf_20260726_203055_676ef355-4fa6-4cfd-9c96-99e7bf305735.png"
  ["servico-outorga"]="hf_20260726_203112_85a47d3b-bd4b-4735-8852-383988552781.png"
  ["servico-dispensa"]="hf_20260726_203114_dd7b7227-ae4d-4184-b9aa-282e06d15578.png"
  ["servico-cetesb"]="hf_20260726_203123_e88172e7-0e02-4c60-894d-058aac2ae3b0.png"
  ["servico-qualidade"]="hf_20260726_203125_676d3ec5-fc68-474c-beab-aa9eaf6d6917.png"
)

CONV=""
command -v magick >/dev/null 2>&1 && CONV="magick"
[ -z "$CONV" ] && command -v convert >/dev/null 2>&1 && CONV="convert"

for name in "${!IMG[@]}"; do
  echo "Baixando ${name}..."
  curl -fsSL -o "img/media/${name}.png" "${BASE}/${IMG[$name]}"
  if [ -n "$CONV" ]; then
    $CONV "img/media/${name}.png" -quality 82 -strip "img/media/${name}.jpg"
    rm -f "img/media/${name}.png"
    echo "  -> img/media/${name}.jpg"
  else
    # Sem ImageMagick: mantém .png. Ajuste as extensões no HTML se necessário
    # (os <img> apontam para .jpg) — ou renomeie: mv ${name}.png ${name}.jpg
    mv "img/media/${name}.png" "img/media/${name}.jpg"
    echo "  -> img/media/${name}.jpg (renomeado de .png; instale o ImageMagick p/ comprimir)"
  fi
done

# Reaproveita o hero como og-image (composição institucional)
cp -f img/media/hero.jpg img/media/og-image.jpg 2>/dev/null || true
echo "Concluído. Imagens em img/media/"
