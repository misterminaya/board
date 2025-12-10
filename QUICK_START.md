# 🚀 GUÍA RÁPIDA DE INICIO

## ⚡ Opción 1: Inicio Rápido (RECOMENDADO)

```bash
./start.sh
```

Esto automáticamente:
1. ✅ Verifica Docker
2. ✅ Para contenedores existentes
3. ✅ Build del proyecto
4. ✅ Levanta el dashboard

**Luego abre:** http://localhost:3000

---

## 🐳 Opción 2: Comandos Docker Manuales

### Levantar por primera vez
```bash
docker-compose up -d --build
```

### Ver logs en tiempo real
```bash
docker-compose logs -f
```

### Detener
```bash
docker-compose down
```

### Reiniciar después de cambios en código
```bash
docker-compose restart
```

---

## 💻 Opción 3: Desarrollo Local (Sin Docker)

```bash
# Instalar dependencias
npm install

# Levantar en modo desarrollo
npm run dev
```

**Luego abre:** http://localhost:3000

---

## 🔧 Variables de Entorno Necesarias

Asegúrate de tener `.env.local` con:

```env
NOTION_API_KEY=tu_api_key
NOTION_DATABASE_PROJECTS=id_de_projects_db
NOTION_DATABASE_TASKS=id_de_tasks_db
NOTION_DATABASE_SPRINTS=id_de_sprints_db
```

**TUS CREDENCIALES YA ESTÁN CONFIGURADAS** ✅

---

## 📊 ¿Qué verás en el Dashboard?

1. **Command Center** 🚨 - Alertas críticas
2. **Weekly Scoreboard** 🎯 - Tu WIG semanal (4DX)
3. **Projects Health** 📊 - Estado de todos los proyectos
4. **Sprint Health** 🏃 - Sprint actual
5. **Capacity Board** 👥 - Carga por persona
6. **Burn-up Chart** 📈 - Tasks completados en el tiempo

---

## 🆘 Troubleshooting

### Puerto 3000 ocupado
```bash
# Edita docker-compose.yml y cambia:
ports:
  - "3001:3000"
```

### Error de permisos en Linux
```bash
sudo chmod +x start.sh
sudo ./start.sh
```

### Dashboard no carga datos
1. Verifica tu API Key de Notion
2. Confirma que los database IDs sean correctos
3. Asegúrate que la integración tenga permisos en Notion

---

## 📝 Próximos Pasos

1. ✅ Levanta el dashboard
2. ✅ Verifica que los datos se cargan
3. ✅ Agrega tasks/proyectos en Notion
4. ✅ Espera 5 min o click en "Actualizar"
5. ✅ Los cambios se reflejan automáticamente

---

**¿Necesitas ayuda?** Revisa el README.md completo
