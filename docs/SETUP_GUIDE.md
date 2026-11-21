# Setup & Deployment Guide — YuridikSim AI

## 1. Prerequisites
- Node.js LTS (v18 or higher; tested on v20 & v25)
- npm or pnpm

## 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-org/yuridiksim-ai.git
cd yuridiksim-ai

# Install dependencies
npm install
```

## 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your environment:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase (Optional for local Demo Mode)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-3.8-flash

# Set to true for offline demo simulation
DEMO_MODE=false
```

## 4. Database Setup (Supabase)
1. Create a new Supabase project at https://supabase.com
2. Navigate to **SQL Editor** in your Supabase dashboard.
3. Run the migration file: `supabase/migrations/20240101000000_initial_schema.sql`
4. Run the seed file: `supabase/seed/seed.sql`

## 5. Running the Application
```bash
# Development mode
npm run dev

# Run Vitest test suite
npm test

# Production build
npm run build
npm start
```
