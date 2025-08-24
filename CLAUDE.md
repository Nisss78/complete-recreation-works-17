# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Protoduct（プロトダクト）is a React-based platform where developers can share prototype applications. It features product uploads, articles, user interactions (likes, comments, bookmarks), and follows. The platform supports Japanese and English localization.

## Common Development Commands

```bash
# Development
npm run dev          # Start development server on port 8080

# Build  
npm run build        # Production build
npm run build:dev    # Development build  
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint checks

# Package Management
npm install          # Install dependencies
```

## Environment Setup

Required environment variables (create `.env.local` for local development):
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For Vercel deployment, use `setup-vercel-env.sh` script or manually set environment variables in Vercel dashboard.

## Architecture & Key Patterns

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components  
- **Backend**: Supabase (auth, database, storage, edge functions)
- **State Management**: React Query (TanStack Query) + React Context
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **Markdown**: @uiw/react-md-editor for article editing
- **Icons**: lucide-react + tabler-icons-react
- **Deployment**: Vercel

### Project Structure
- `src/components/` - Reusable UI components, organized by feature
  - `ui/` - shadcn/ui base components
  - Feature-specific folders (articles/, comments/, product-dialog/, etc.)
- `src/pages/` - Page components mapped to routes
- `src/hooks/` - Custom React hooks for data fetching and UI state
- `src/integrations/supabase/` - Supabase client configuration and types
- `src/translations/` - i18n files (ja.ts, en.ts) with section-based organization
- `src/types/` - TypeScript type definitions
- `supabase/functions/` - Edge functions for:
  - `generate-ogp/` - OGP image generation
  - `ogp-article/` - Article OGP handling
  - `ogp-product/` - Product OGP handling
  - `upload-image/` - Image upload processing

### Key Architectural Patterns

1. **Component Organization**: 
   - Components grouped by feature with sub-components in nested folders
   - Shared UI components in `src/components/ui/`
   - Page-specific components co-located with page files

2. **Data Fetching Pattern**: Custom hooks with React Query
   - `useProductLikes`, `useArticleLikes` - Like functionality
   - `useBookmarks`, `useArticleBookmarks` - Bookmark management  
   - `useFollow` - Follow/unfollow users
   - `useCommentLikes` - Comment like functionality
   - All hooks handle optimistic updates and error states

3. **Authentication & Authorization**:
   - Supabase Auth with extended profile system
   - Admin users identified by `is_admin` flag in profiles table
   - User language preference stored in profile
   - Protected routes handled via React Router

4. **Type Safety**:
   - Database types in `src/types/database.ts`
   - Zod schemas for form validation
   - TypeScript strict mode enabled

5. **Internationalization**:
   - Context-based language switching (LanguageContext)
   - Translation keys organized by section in `src/translations/sections/`
   - Supports Japanese (ja) and English (en)

6. **Styling Approach**:
   - Tailwind CSS for utility-first styling
   - CSS variables for theming (defined in index.css)
   - shadcn/ui components with customizable variants
   - Dark mode support via CSS variables

### Database Schema Key Points
- `profiles` - Extends Supabase auth.users with username, avatar, bio, social links, is_admin flag
- `products` - Core product data with relationships to images, tags, comments
- `product_images` - Multiple images per product with ordering
- `product_comments` - Nested comment system with parent_id for replies
- `articles` - Markdown content with thumbnail support
- `article_likes`, `product_likes`, `comment_likes` - Like tracking tables
- `product_bookmarks`, `article_bookmarks` - Bookmark functionality
- `follows` - User follow relationships

### Development Notes
- Path alias `@/` maps to `src/` directory
- Vite dev server runs on port 8080 with IPv6 support (`host: "::"`)
- ESLint configured with React hooks and refresh plugins
- No test framework currently configured
- `lovable-tagger` plugin active in development mode for component tagging
- Main working directory: `complete-recreation-works-17/`

### Supabase Edge Functions
Edge functions require Supabase CLI for local development:
- Install: `npm install -g supabase`
- Start local Supabase: `supabase start`
- Deploy functions: `supabase functions deploy function-name`

### Common Troubleshooting
- If TypeScript errors occur, check `src/types/database.ts` matches your Supabase schema
- For auth issues, verify Supabase URL and anon key in environment variables
- Component imports should use `@/` alias instead of relative paths
- Ensure all async operations use proper error handling with try-catch or React Query error boundaries