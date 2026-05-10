# Zu Super Boss Brain

A launch-ready, AI-powered business operating system for girl bosses. Run your businesses with Zu, your AI co-owner, planner, and automation brain.

## Tech Stack
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase
- Buffer API
- OpenAI API (or other AI provider)
- Vercel deployment

## Setup Steps
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up Supabase project
	- Import `supabase/schema.sql` to your Supabase instance
	- Get your Supabase URL and keys
4. Set up Buffer API (https://buffer.com/developers/api)
5. Set up OpenAI or your AI provider
6. Copy `.env.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
BUFFER_ACCESS_TOKEN=
NEXT_PUBLIC_APP_URL=
```

7. Run the dev server: `npm run dev`
8. Deploy to Vercel for production

## Demo Mode
- Demo mode is available for testing. All demo data is clearly labeled and does not affect real user/business data.

## Features
- Business Manager (add/edit/archive/switch businesses)
- Zu AI Assistant (content, plans, captions, ideas, approval-first)
- AI Brain Dashboard (goals, tasks, posts, ideas, recommendations)
- Approval Queue (review, approve, schedule, reject, archive)
- Content Generator (all post types, platform linkage)
- Content Calendar (daily/weekly/monthly, drag/edit, filters)
- Buffer Integration (connect, fetch, schedule, demo mode)
- Automation Rules (draft/queue only, never auto-publish)
- Knowledge Base (brand notes, product info, etc.)
- Paid Feature Gates (Free/Pro/Boss, upgrade modal)
- Admin Override (user search, plan/override management)
- Analytics (all required metrics)

## Data Rules
- New users start empty
- No fake businesses as real data
- Demo data is always labeled
- Generated content is saved only after approval
- Deleted businesses are soft-deleted/archived first
- Business data is always separated

---

For more, see `/supabase/schema.sql` and `/src` for implementation.