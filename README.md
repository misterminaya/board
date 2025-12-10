# 🎯 Yimmilab 4DX Dashboard

Executive dashboard for project and task management using the 4DX (Four Disciplines of Execution) methodology, connected dynamically to Notion.

## ✨ Features

- 🎯 **4DX Methodology**: WIG tracking, Lead Measures, Weekly Scoreboard
- 📊 **8 Consolidated Components**: Command Center, Projects Health, Sprint Health
- 🔄 **Auto-refresh**: Updates every 5 minutes from Notion
- 📈 **Charts & Analytics**: Burn-up chart, Velocity tracking, Capacity planning
- 🎨 **Professional UI**: Built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Notion account with API integration
- Notion databases (Projects, Tasks, Sprints)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/yimmilab-4dx-dashboard.git
cd yimmilab-4dx-dashboard

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your Notion credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Environment Variables

Create a `.env` file with:

```env
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_PROJECTS=projects_db_id_without_hyphens
NOTION_DATABASE_TASKS=tasks_db_id_without_hyphens
NOTION_DATABASE_SPRINTS=sprints_db_id_without_hyphens
```

**⚠️ Important:** Database IDs must be without hyphens
- ❌ `2c344699-edc6-81c6-b815-c5c0497e2eea`
- ✅ `2c344699edc681c6b815c5c0497e2eea`

## ☁️ Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/yimmilab-4dx-dashboard)

### Manual Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables in Vercel dashboard
5. Deploy

**Add these environment variables in Vercel:**
- `NOTION_API_KEY`
- `NOTION_DATABASE_PROJECTS`
- `NOTION_DATABASE_TASKS`
- `NOTION_DATABASE_SPRINTS`

## 🐳 Docker

```bash
# Build and run
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 📊 Notion Setup

### Required Databases

1. **Projects**
   - Project name (title)
   - People (people)
   - Status (status): Backlog, Planning, In Progress, Paused, Done, Canceled
   - Completion (rollup)
   - Dates (date)
   - Tasks (relation)

2. **Tasks**
   - Task name (title)
   - Assign (people)
   - Status (status): Not Started, In Progress, Done, Archived
   - Due (date)
   - Sprint (relation)
   - Project (relation)

3. **Sprints**
   - Sprint name (title)
   - Dates (date)
   - Tasks (relation)
   - Is Current Sprint (formula)

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts
- Notion API

## 📝 License

Private © 2025 Yimmilab

## 👨‍💻 Author

Built with ❤️ by Yimmilab Team
