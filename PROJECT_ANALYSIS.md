# Livora - Project Analysis

## Architecture Overview

**Livora** is a full-stack furniture design studio platform built with:

- **Frontend**: Next.js 16 (React 19, TypeScript, Tailwind CSS v4)
- **Backend**: Express.js 5 (TypeScript, Mongoose ODM)
- **Database**: MongoDB Atlas (Cluster0)
- **Authentication**: JWT with bcrypt password hashing
- **Styling**: Tailwind CSS v4 with custom brown/gold/cream theme
- **Icons**: Lucide React
- **PDF Generation**: PDFKit (cost reports)

### Project Structure

```
Livora/
├── src/                          # Next.js frontend
│   ├── app/                      # App Router pages (27 routes)
│   │   ├── admin/                # Admin panel (12 pages)
│   │   ├── user-panel/           # User panel (8 pages)
│   │   ├── consultation-request/ # Public consultation form
│   │   ├── dashboard/            # Admin dashboard
│   │   ├── forgot-password/      # Password recovery
│   │   └── reset-password/       # Password reset
│   ├── components/ui/            # Reusable components (Toast, ConfirmModal, PhoneInput)
│   ├── context/                  # React Context (WishlistContext)
│   └── lib/                      # API client, auth utilities
├── livora-backend/               # Express.js backend
│   └── src/
│       ├── controllers/          # Route handlers
│       ├── models/               # Mongoose schemas (9 models)
│       ├── routes/               # Express routers
│       └── middleware/           # Auth, validation middleware
└── public/                       # Static assets
```

### Key Features
- User registration/login with role-based access (admin/user)
- Furniture catalogue with search, filters, pagination
- Wishlist with localStorage persistence
- Consultation booking with API integration
- Admin dashboard with live stats
- Room setup and 2D/3D design visualization
- Design versioning, comparison, and cost summaries
- PDF export for cost reports
- International phone input with country code selector

## Detected Problems & Fixes Implemented

### Critical Fixes

1. **Hardcoded API URL** (`api.ts`)
   - Problem: `baseURL` was hardcoded to `http://localhost:5000`
   - Fix: Uses `NEXT_PUBLIC_API_URL` environment variable with localhost fallback
   - Files: `src/lib/api.ts`, `.env.local`, `.env.example`

2. **MongoDB URI missing database name**
   - Problem: URI ended with `/?appName=Cluster0` instead of `/Livora?appName=Cluster0`
   - Fix: Added `Livora` database name to connection string
   - File: `livora-backend/.env`

3. **Backend CORS hardcoded**
   - Problem: CORS origin was hardcoded to `http://localhost:3000`
   - Fix: Uses `ALLOWED_ORIGINS` env variable (comma-separated)
   - File: `livora-backend/src/index.ts`

4. **useSearchParams without Suspense boundary** (build failure)
   - Problem: 3 pages used `useSearchParams()` without Suspense, causing Next.js build to fail
   - Fix: Wrapped components in `<Suspense>` boundaries
   - Files: `admin/cost-summary/page.tsx`, `admin/design-history/page.tsx`, `reset-password/page.tsx`

### Missing Backend Endpoints (Implemented)

5. **Consultation Request API** (public form)
   - Problem: Form was client-side only (`setSubmitted(true)`) - data never saved
   - Fix: Created `POST /api/consultation-requests` and `GET /api/consultation-requests/my`
   - Files: `consultationRequest.controller.ts`, `consultationRequest.routes.ts`

6. **Forgot Password / Reset Password API**
   - Problem: Frontend had UI but used `setTimeout` simulation - no backend support
   - Fix: Created `POST /api/users/forgot-password` and `POST /api/users/reset-password`
   - Files: `user.controller.ts`, `user.routes.ts`

7. **User Profile API**
   - Problem: My Account page had hardcoded data, no API integration
   - Fix: Created `GET/PUT /api/users/profile` and `PUT /api/users/change-password`
   - Files: `user.controller.ts`, `user.routes.ts`

### Frontend Integration Fixes

8. **Consultation form connected to API**
   - Added loading state, error handling, Toast notifications
   - File: `src/app/consultation-request/page.tsx`

9. **Forgot Password connected to API**
   - Replaced `setTimeout` with real API call
   - File: `src/app/forgot-password/page.tsx`

10. **Reset Password connected to API**
    - Reads `?token=` from URL, sends to backend, shows errors
    - File: `src/app/reset-password/page.tsx`

11. **My Account page connected to API**
    - Loads profile from API, saves changes, loads real consultation history
    - Dynamic sidebar user info based on logged-in user
    - Auth redirect if not logged in
    - File: `src/app/user-panel/my-account/page.tsx`

### Security & Quality Fixes

12. **401 redirect logic improved**
    - Problem: All 401s redirected to `/admin/login` even for user-panel pages
    - Fix: Detects user role and redirects to appropriate login page
    - Files: `src/lib/api.ts`, `src/lib/auth.ts`

13. **Playwright moved to devDependencies**
    - Was in production dependencies, inflating bundle
    - File: `package.json`

14. **Updated .gitignore**
    - Added `/debug-screenshots` to ignore list

15. **Backend .env.example updated**
    - Added `ALLOWED_ORIGINS` variable documentation
    - Removed actual credentials from example

## Vercel Deployment

### Frontend (Next.js)
The frontend is fully Vercel-deployable:
- Build command: `next build` (succeeds with 27 pages)
- No hardcoded localhost dependencies (uses env variable)
- All `useSearchParams` wrapped in Suspense boundaries
- Static + dynamic pages properly configured

**Required Vercel Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Backend (Express.js)
The backend should be deployed separately (e.g., Render, Railway, Fly.io):

**Required Environment Variables:**
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
```

## Remaining TODO Items

1. **Email service integration** - Forgot password currently generates tokens but doesn't send emails. Integrate SendGrid/Resend/Nodemailer for production email delivery.

2. **Review & Ratings API** - The review page uses hardcoded mock data. Create `POST /api/reviews` and `GET /api/reviews` endpoints and connect the frontend.

3. **User panel consultation-request page** (`/user-panel/consultation-request`) - This appears to be a duplicate of the public consultation page. Consider consolidating or differentiating for logged-in users.

4. **Image uploads** - Product images reference Unsplash URLs. For production, integrate cloud storage (S3/Cloudinary) for user-uploaded images.

5. **Rate limiting** - Add rate limiting middleware to prevent API abuse (especially on auth and public form endpoints).

6. **Input sanitization** - While basic validation exists, add a sanitization library (e.g., `express-validator` or `joi`) for comprehensive input cleaning.

7. **Session management** - Consider adding refresh token rotation for better security than long-lived JWTs.

8. **My Account wishlist section** - Currently shows hardcoded wishlist preview items. Should pull from WishlistContext or a backend wishlist API.
