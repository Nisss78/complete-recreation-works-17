#!/bin/bash

# Vercel環境変数設定スクリプト
echo "Setting up Vercel environment variables..."

# Supabase URL
echo "https://viaxlwsbhrzwheekrycv.supabase.co" | npx vercel env add VITE_SUPABASE_URL production

# Supabase Anon Key
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpYXhsd3NiaHJ6d2hlZWtyeWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4ODI4OTcsImV4cCI6MjA1MDQ1ODg5N30.xBk_tmzB8qUjrr60GJTuIq1G0Wks2t1Pkzo0gEmzjIw" | npx vercel env add VITE_SUPABASE_ANON_KEY production

echo "Environment variables set successfully!"