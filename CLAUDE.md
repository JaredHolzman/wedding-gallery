# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a wedding image gallery Next.js application built with TypeScript, React 19, and Tailwind CSS v4. The project uses pnpm as the package manager and includes a collection of wedding photos in the public directory.

## Commands

### Development
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle with Turbopack  
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Package Management
This project uses pnpm (v9.7.0). Always use `pnpm` instead of `npm` or `yarn`:
- `pnpm install` - Install dependencies
- `pnpm add <package>` - Add new dependency
- `pnpm add -D <package>` - Add dev dependency

## Architecture

### File Structure
- `app/` - Next.js App Router directory
  - `page.tsx` - Main page component
  - `layout.tsx` - Root layout with metadata and font configuration
  - `globals.css` - Global styles with Tailwind CSS directives
- `public/wedding_photos/` - Wedding photo assets (L&V-*.jpg files)
- TypeScript configuration with strict mode enabled
- Tailwind CSS v4 with PostCSS integration
- ESLint configured with Next.js rules

### Key Technologies
- **Next.js 15.5.0** with App Router and Turbopack
- **React 19.1.0** with React Server Components
- **TypeScript** with strict type checking
- **Tailwind CSS v4** for styling
- **Geist font family** for typography

### Path Aliases
- `@/*` maps to the project root for clean imports