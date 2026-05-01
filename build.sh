#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo ">> Instalando dependencias..."
  npm install
fi

echo ">> Compilando closerclick..."
npm run build

echo ">> Build OK -> ../api/src/public/"
