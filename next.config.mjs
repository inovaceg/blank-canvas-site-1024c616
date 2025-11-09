/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://szyfwlgczwrdalbpqsfc.supabase.co', // Por favor, verifique e atualize este valor
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6eWZ3bGdjendyZGFsYnBxc2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NjIzODQsImV4cCI6MjA3ODIzODM4NH0.1if2CwMxfpzNu6ROVFYzaHYCmrBlYRR6OF0SITY1aaA', // Por favor, verifique e atualize este valor
  },
}

export default nextConfig