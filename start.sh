#!/bin/bash

echo "🚀 Yimmilab 4DX Dashboard - Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado. Por favor instala Docker Compose primero."
    exit 1
fi

echo "✅ Docker y Docker Compose detectados"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Archivo .env.local no encontrado"
    echo "📝 Copiando .env.example a .env.local..."
    
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo ""
        echo "✅ Archivo .env.local creado"
        echo "⚠️  IMPORTANTE: Edita .env.local con tus credenciales de Notion antes de continuar"
        echo ""
        echo "Presiona ENTER cuando hayas configurado .env.local..."
        read
    else
        echo "❌ No se encontró .env.example"
        exit 1
    fi
fi

echo "✅ Archivo .env.local encontrado"
echo ""

# Stop any existing containers
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down 2>/dev/null

# Build and start containers
echo "🔨 Building y levantando contenedores..."
echo "⏳ Esto puede tomar varios minutos la primera vez..."
docker-compose up -d --build

# Wait for container to be ready
echo ""
echo "⏳ Esperando a que el dashboard esté listo..."
sleep 10

# Check if container is running
if [ "$(docker ps -q -f name=yimmilab-4dx-dashboard)" ]; then
    echo ""
    echo "✅ ¡Dashboard levantado exitosamente!"
    echo ""
    echo "🌐 Abre tu navegador en: http://localhost:3000"
    echo ""
    echo "📝 Comandos útiles:"
    echo "   - Ver logs:       docker-compose logs -f"
    echo "   - Detener:        docker-compose down"
    echo "   - Reiniciar:      docker-compose restart"
    echo ""
else
    echo ""
    echo "❌ Error al levantar el contenedor"
    echo "Ver logs con: docker-compose logs"
fi
