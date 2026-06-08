#!/bin/bash

#
# Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
# Author: Luis Vilela Acuña
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.
#

# Script para purgar caché de Cloudflare para breath.edumind.es
# Requiere CLOUDFLARE_ZONE_ID y CLOUDFLARE_API_TOKEN en ~/.cloudflare_edumind

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo "════════════════════════════════════════════════════════"
echo "  🔥 Purging Cloudflare Cache - breath.edumind.es"
echo "════════════════════════════════════════════════════════"

# Cargar credenciales
CONFIG_FILE="$HOME/.cloudflare_edumind"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
else
    echo -e "${RED}Error: No se encontraron credenciales en $CONFIG_FILE${NC}"
    echo "Ejecuta primero /var/www/edumind_website/purge-cloudflare.sh"
    exit 1
fi

# URLs a purgar
urls=(
    "https://breath.edumind.es/"
    "https://breath.edumind.es/_next/static/chunks/*"
)

echo -e "${BLUE}Purgando caché para breath.edumind.es...${NC}"

# Purgar todo el dominio
response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"files":["https://breath.edumind.es/"]}')

success=$(echo "$response" | grep -o '"success":true' || echo "")

if [ -n "$success" ]; then
    echo ""
    echo -e "${GREEN}✓ Caché purgado exitosamente${NC}"
    echo -e "${BLUE}ℹ  Espera 1-2 minutos para que los cambios se propaguen${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}✗ Error al purgar caché${NC}"
    echo "Respuesta: $response"
    exit 1
fi

echo "════════════════════════════════════════════════════════"
echo -e "${GREEN}  ✓ Proceso completado - Verifica: https://breath.edumind.es${NC}"
echo "════════════════════════════════════════════════════════"
