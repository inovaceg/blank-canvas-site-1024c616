# AI Rules for Doces São Fidélis Application

This document outlines the core technologies used in this project and provides guidelines for using specific libraries to maintain consistency and best practices.

## Tech Stack Overview

*   **Frontend Framework**: React (with TypeScript)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **UI Components**: shadcn/ui (built on Radix UI)
*   **Routing**: React Router DOM
*   **Data Fetching & State Management**: React Query
*   **Backend (Auth, DB, Storage)**: Supabase
*   **Form Handling**: React Hook Form
*   **Form Validation**: Zod
*   **Icons**: Lucide React
*   **Toasts/Notifications**: Sonner (for general toasts) and Radix UI Toast (via `useToast` hook for more interactive toasts)
*   **Theming**: Next.js Themes (`next-themes`)
*   **SEO Management**: React Helmet Async

## Library Usage Rules

To ensure consistency and maintainability, please adhere to the following guidelines when developing:

*   **UI Components**: Always prioritize `shadcn/ui` components. If a required component is not available in `shadcn/ui`, create a new custom component using Tailwind CSS. **Do not modify existing `shadcn/ui` component files directly.**
*   **Styling**: All styling must be done using **Tailwind CSS** classes. Avoid writing custom CSS files or inline styles unless absolutely necessary for global styles (e.g., `src/index.css`).
*   **Routing**: Use `react-router-dom` for all client-side navigation and route management. Keep routes defined in `src/App.tsx`.
*   **Data Fetching**: For all server-side data fetching and caching, use **React Query (`@tanstack/react-query`)**. For simple local component state, `useState` is appropriate.
*   **Backend Interactions**: All authentication, database operations, and file storage must be handled through the **Supabase client (`@supabase/supabase-js`)**.
*   **Form Management**: Use **React Hook Form** for managing form state, submissions, and error handling.
*   **Form Validation**: Integrate **Zod** schemas with React Hook Form for robust and type-safe form validation.
*   **Toasts**: For simple, non-blocking notifications, use **Sonner**. For more complex or interactive toast messages, use the `useToast` hook which leverages Radix UI's toast system.
*   **Icons**: Use icons exclusively from the **Lucide React** library.
*   **Date Handling**: For any date formatting, parsing, or manipulation, use the `date-fns` library.
*   **Theming**: Use `next-themes` for implementing and managing dark/light mode functionality.
*   **SEO**: Utilize the provided `SEO` component (which wraps `react-helmet-async`) for managing meta tags, titles, and other SEO-related elements on each page.