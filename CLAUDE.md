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
```

## Architecture & Key Patterns

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (auth, database, storage)
- **State Management**: React Query + React Context
- **Forms**: React Hook Form + Zod validation
- **Deployment**: Vercel

### Project Structure
- `src/components/` - Reusable UI components, organized by feature
- `src/pages/` - Page components for routes
- `src/hooks/` - Custom React hooks (auth, data fetching, UI state)
- `src/integrations/supabase/` - Supabase client and types
- `src/translations/` - i18n files for Japanese/English
- `supabase/functions/` - Edge functions for OGP and image uploads

### Key Architectural Patterns

1. **Component Organization**: Components are grouped by feature (articles/, product-dialog/, etc.) with sub-components in nested folders

2. **Data Fetching**: Uses custom hooks with React Query for data operations:
   - `useProductLikes`, `useArticleLikes` - Like functionality
   - `useBookmarks`, `useArticleBookmarks` - Bookmark management
   - `useFollow` - Follow/unfollow users

3. **Authentication**: Supabase Auth with profile system
   - Admin users have `is_admin` flag in profiles table
   - Language preference stored in profile

4. **Type Safety**: Database types are generated in `src/types/database.ts`

5. **Internationalization**: Translation keys organized by section in `src/translations/sections/`

### Database Schema Key Points
- `profiles` extends Supabase auth users with username, avatar, bio, social links
- `products` can have multiple images, tags, comments (with nested replies)
- `articles` support markdown content with thumbnail images
- All user-generated content tracks likes and bookmarks
- Comment system supports parent-child relationships for replies

### Development Notes
- The project uses path alias `@/` for `src/`
- No test framework is currently configured
- ESLint is configured but `@typescript-eslint/no-unused-vars` is disabled
- The main working directory is `/complete-recreation-works-17/`