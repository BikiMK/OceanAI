# OceanAI Platform

## Overview

OceanAI Platform is a comprehensive AI-driven research application for ocean, fisheries, and molecular biology data analysis. Built as a full-stack web application, it provides scientists and researchers with tools to visualize ocean monitoring data, analyze fisheries sustainability, explore molecular genetics, and generate AI-powered predictions for marine ecosystems. The platform features an ocean-themed dark UI with interactive dashboards, data visualization charts, and scientific analysis capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom ocean-themed color palette and CSS variables
- **State Management**: TanStack Query for server state management
- **Data Visualization**: Recharts library for interactive charts and graphs
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production Build**: esbuild for fast server bundling
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Session Management**: Prepared for PostgreSQL session storage with connect-pg-simple

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Validation**: Drizzle-Zod integration for type-safe schema validation
- **Database Provider**: Configured for Neon Database (serverless PostgreSQL)
- **Current Storage**: In-memory storage implementation for development/demo

### Development Environment
- **Hot Reloading**: Vite HMR for frontend, tsx watch mode for backend
- **Error Handling**: Runtime error overlay integration
- **Development Tools**: Replit-specific development enhancements and cartographer integration
- **Type Checking**: Strict TypeScript configuration with path mapping

### Project Structure
- **Monorepo Layout**: Shared schema definitions between client and server
- **Client**: React application in `/client` with component library and pages
- **Server**: Express backend in `/server` with routing and storage abstraction  
- **Shared**: Common TypeScript definitions and Drizzle schema in `/shared`

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL for production data storage
- **Drizzle ORM**: Database toolkit and query builder

### UI and Visualization
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library with Tailwind CSS
- **Recharts**: React charting library for data visualization
- **Lucide React**: Icon library for UI elements

### Development Tools
- **Vite**: Frontend build tool and development server
- **esbuild**: Fast bundler for production server builds
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form state management with validation

### Authentication & Sessions
- **connect-pg-simple**: PostgreSQL session store (configured but not active)
- Ready for implementation of user authentication system

### Styling & Theming
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **Custom CSS Variables**: Ocean-themed color system with dark mode support