# Bun React Full-Stack Template

A modern full-stack TypeScript template using Bun, React, and Express with integrated OpenAPI code generation.

## 🚀 Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** (rolldown-vite) for fast development
- **Tailwind CSS v4** for styling
- **shadcn/ui** components with Radix UI
- **TanStack Router** for routing
- **TanStack Query** for data fetching
- **Zod** for schema validation
- **React Hook Form** for forms
- **Capacitor** for mobile development support

### Backend
- **Bun** runtime for optimal performance
- **Express.js** with TypeScript
- **MongoDB** with Mongoose ODM
- **Swagger/OpenAPI** documentation
- **CORS** and compression middleware

### DevTools & Code Generation
- **Hey API OpenAPI TS** for type-safe API client generation
- **ESLint** and **Prettier** for code quality
- **Hot reload** in development

## 📁 Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── api/            # API clients and generated types
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   └── services/       # Business logic services
│   └── package.json
├── backend/                 # Express backend
│   ├── src/
│   │   ├── docs/          # OpenAPI documentation
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   └── services/      # Backend services
│   └── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bun-react-shadcn-hayapi-template
   ```

2. **Install dependencies**
   ```bash
   # Frontend dependencies
   cd frontend
   bun install
   
   # Backend dependencies
   cd ../backend
   bun install
   ```

3. **Environment setup**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🚀 Development

### Start both servers

```bash
# Terminal 1 - Backend
cd backend
bun run dev

# Terminal 2 - Frontend  
cd frontend
bun run dev
```

### Available Scripts

#### Frontend
- `bun run dev` - Start development server
- `bun run dev:mobile` - Start dev server for mobile testing
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run gen:api` - Generate API client from OpenAPI spec
- `bun run gen:api:watch` - Watch for API changes and regenerate
- `bun run preview` - Preview production build

#### Backend
- `bun run dev` - Start development server with hot reload
- `bun run start` - Start production server
- `bun run typecheck` - Run TypeScript type checking

#### Mobile (Capacitor)
- `bun run cap:sync` - Sync Capacitor assets
- `bun run android:run` - Run on Android device
- `bun run android:run:lr` - Run on Android with live reload

## 📚 API Documentation

The backend automatically generates OpenAPI documentation. Once the backend is running:

- **Swagger UI**: Available at `http://localhost:3000/api-docs`
- **API Schema**: Used to generate type-safe frontend clients

## 🔧 Code Generation with Hey API

This template uses **Hey API OpenAPI TS** to generate type-safe API clients that integrate seamlessly with TanStack Query:

### How Hey API Works

1. **Backend API Definition**: The backend defines OpenAPI specifications in `backend/src/docs/`
2. **Automatic Generation**: Run `bun run gen:api` to generate:
   - TypeScript types for all API endpoints
   - Axios-based HTTP client functions
   - TanStack Query hooks with proper typing

### Generated Structure

```
frontend/src/api/generated/
├── client.gen.ts          # Main API client with Axios integration
├── types.gen.ts           # TypeScript types for requests/responses
├── sdk.gen.ts            # Complete SDK with all endpoints
└── core/                 # Core utilities and serializers
    ├── auth.gen.ts       # Authentication helpers
    ├── bodySerializer.gen.ts
    └── ...
```

### Example Usage

#### 1. Basic API Client (Axios-based)
```typescript
import { createClient } from '@/api/generated/client'

const client = createClient({
  baseURL: 'http://localhost:3000'
})

// Generated function with full typing
const response = await client.GET('/api/users/{id}', {
  params: { path: { id: '123' } }
})
```

#### 2. TanStack Query Integration
```typescript
import { useQuery } from '@tanstack/react-query'
import { client } from '@/api/generated/client'

// Generated hook with automatic query key management
const { data: users, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => client.GET('/api/users')
})
```

#### 3. Custom Service Layer
```typescript
// frontend/src/services/apiService.ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { client } from '@/api/generated/client'

export const userService = {
  // Auto-generated query hook
  useGetUsers: () => useQuery({
    queryKey: ['users'],
    queryFn: () => client.GET('/api/users')
  }),

  // Auto-generated mutation hook
  useCreateUser: () => useMutation({
    mutationFn: (userData) => client.POST('/api/users', { body: userData }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
```

### Key Features

- **Type Safety**: Full TypeScript support from API to frontend
- **Auto-completion**: IDE support for all API endpoints
- **Validation**: Zod schemas for request/response validation
- **Query Keys**: Automatic query key generation for TanStack Query
- **Error Handling**: Consistent error typing across the stack
- **Authentication**: Built-in auth token management

### Workflow

1. **Define API** in backend OpenAPI specs
2. **Generate client** with `bun run gen:api`
3. **Import and use** generated functions in components
4. **React Query handles** caching, loading states, and invalidation

### Watch Mode

For development, use the watch mode:
```bash
bun run gen:api:watch
```

This automatically regenerates the API client when the OpenAPI spec changes, ensuring your frontend is always in sync with the backend.

## 🎨 UI Components

The frontend includes a complete shadcn/ui setup with:
- Pre-built components in `src/components/ui/`
- Consistent design system
- Dark/light theme support
- Mobile-responsive layouts

## 📱 Mobile Development

Capacitor is configured for cross-platform mobile development:
- iOS and Android support
- Native device APIs
- WebView-based deployment

## 🏗️ Architecture

- **Monorepo structure** with separate frontend/backend
- **Type safety** across the full stack
- **OpenAPI-first** development approach
- **Hot reload** for rapid development
- **Mobile-ready** architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.