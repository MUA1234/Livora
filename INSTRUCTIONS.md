# Livora - Complete User Guide

## Table of Contents

- [Getting Started](#getting-started)
- [Login Credentials & URLs](#login-credentials--urls)
- [Admin Panel](#admin-panel)
- [User Panel](#user-panel)
- [2D Layout Editor Controls](#2d-layout-editor-controls)
- [3D Viewer Controls](#3d-viewer-controls)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Mouse Controls](#mouse-controls)
- [API Endpoints Reference](#api-endpoints-reference)
- [Environment Setup](#environment-setup)

---

## Getting Started

Livora is a furniture design studio web application. It has two portals:

| Portal | Purpose | Base URL |
|--------|---------|----------|
| **Admin Panel** | Design rooms, manage catalogue, handle consultations | `/admin/...` and `/dashboard` |
| **User Panel** | Browse furniture, wishlist, request consultations | `/user-panel/...` |

**Local Development URLs:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## Login Credentials & URLs

### Admin Login

| Field | Value |
|-------|-------|
| **URL** | `http://localhost:3000/admin/login` |
| **Email** | `admin@livora.com` |
| **Password** | `Admin@123` |
| **Google Sign-In** | Available (admin-only Google accounts must already exist in the database) |
| **Redirects to** | `/dashboard` |

### User Login

| Field | Value |
|-------|-------|
| **URL** | `http://localhost:3000/user-panel/login` |
| **Register** | `http://localhost:3000/user-panel/register` |
| **Google Sign-In** | Available (auto-creates account if new) |

**Seed User Accounts** (pre-populated in database):

| Email | Password |
|-------|----------|
| `roshan@example.com` | `User@123` |
| `priya@example.com` | `User@123` |
| `kamal@example.com` | `User@123` |
| `tharinda@example.com` | `User@123` |
| `amara@example.com` | `User@123` |
| `nisha@example.com` | `User@123` |

### Google Sign-In

Google OAuth is available on all login/register pages:
- **User Login** - Sign in or auto-create account with Google
- **User Register** - Sign up with Google (skips form)
- **Admin Login** - Sign in with Google (account must already exist as admin in database)

### Password Reset

- Forgot Password: `/forgot-password`
- Reset Password: `/reset-password?token=...` (link sent via email)

---

## Admin Panel

### Dashboard (`/dashboard`)

Overview page showing:
- Total Designs, Total Products, Pending Consultations, Total Clients
- Recent designs list with thumbnails
- Quick navigation to all admin features

### Room Setup (`/admin/room-setup`)

Create and configure rooms for design:
- **Room Name** - Give your room a name
- **Dimensions** - Set Length, Width, Height (in meters or feet)
- **Shape** - Rectangle, L-shaped, or custom
- **Wall Texture** - Plaster, Drywall, Painted, Brick, etc.
- **Floor Texture** - Hardwood, Tiles, Marble, Concrete, Carpet
- **Wall Color** - Pick from presets or use custom color picker
- **Load Drafts** - Resume previously saved room configurations

### 2D Layout Editor (`/admin/2d-layout`)

SVG-based top-down furniture arrangement tool. See [2D Layout Editor Controls](#2d-layout-editor-controls) for full details.

### 3D Viewer (`/admin/3d-view`)

Interactive 3D room visualization with photorealistic furniture. See [3D Viewer Controls](#3d-viewer-controls) for full details.

### Catalogue (`/admin/catalogue`)

Browse the full product catalogue (read-only view for admins).

### Catalogue Management (`/admin/catalogue-management`)

Full CRUD operations on products:
- **Add** new products with name, SKU, category, price, description
- **Edit** existing products (dimensions, colors, materials, images)
- **Delete** products from the catalogue
- **Upload** product images with drag-and-drop, set sort order
- **Search & Filter** by category, keyword, price range

### Compare Designs (`/admin/compare-designs`)

- Select two designs from dropdown lists
- Side-by-side comparison: layout, furniture items, cost breakdown
- Swap button to switch left/right designs
- Total cost per design displayed

### Cost Summary (`/admin/cost-summary`)

- Select a design from the dropdown
- Itemized cost breakdown: Product SKU, Name, Quantity, Unit Price, Subtotal
- Grand total calculation
- Room details display
- Export to PDF option

### Consultations (`/admin/consultations`)

Manage client consultation requests:
- **Filter** by status: All, Pending, Confirmed, Completed, Rejected
- **Search** by customer name or email
- **Request Details Drawer** - Customer info, room type, preferred date, messages
- **Actions**: Confirm, Reject, Mark Complete, Send message reply
- **Share** design link with client (copy to clipboard)

### Design History (`/admin/design-history`)

- Select a design from the dropdown
- View all saved versions/snapshots
- Version details: timestamp, label, description, who saved it
- Restore previous design versions
- Compare different snapshots

### Settings (`/admin/settings`)

- **Profile**: Edit name, email, phone, upload avatar
- **Password**: Change password with strength indicator
- **Accessibility**: Font size, high contrast, dark mode, theme color
- **Notifications**: Toggle email, consultation alerts, design updates, system alerts

---

## User Panel

### Furniture Catalogue (`/user-panel/furniture-catalogue`)

Browse and discover furniture:
- **Search** by keyword in the search bar (press Enter to search)
- **Filter by Category**: All, Sofa, Chair, Table, Bed, Storage, Lighting, Decor
- **Filter by Price Range**: Set min/max price, click "Apply"
- **Sort**: Newest, Price Low to High, Price High to Low
- **Wishlist**: Click the heart icon on any product to save it
- **Pagination**: 9 items per page, Previous/Next buttons
- **Clear Filters**: Reset all active filters

### Furniture Details (`/user-panel/furniture-details/[id]`)

Individual product page showing:
- Image gallery
- Product name, price, description
- Available colors and materials
- Dimensions (width, height, depth)
- Add to wishlist button

### Wishlist (`/user-panel/wishlist`)

- View all saved favorite items
- Product image, name, price displayed
- "Add to Cart" and "Remove" buttons per item
- Item count shown in the navbar badge

### Review & Ratings (`/user-panel/review-and-ratings`)

- Browse all product reviews with pagination
- Average rating, total count, star distribution chart
- Verified purchase badges, "Helpful" vote count
- **Submit a review**: Star rating (1-5, interactive), title, review body

### Consultation Request (`/user-panel/consultation-request`)

Submit a consultation form:
- Full Name, Email, Phone (all required)
- Room Type (dropdown: Living Room, Bedroom, Kitchen, etc.)
- Room Size, Preferred Visit Date (date picker)
- Notes/Message (textarea)

### My Account (`/user-panel/my-account`)

- View/edit profile: Name, Email, Phone
- View consultation history with status
- Wishlist item count
- Logout button

---

## 2D Layout Editor Controls

### Toolbar Buttons

| Button | Action |
|--------|--------|
| **Save** | Save design to database |
| **Undo** | Undo last action |
| **Redo** | Redo undone action |
| **Rotate** | Rotate selected furniture 90 degrees clockwise |
| **Delete** | Remove selected furniture from canvas |
| **Grid Snap** | Toggle 10cm grid snapping on/off |
| **Zoom In** | Increase canvas zoom |
| **Zoom Out** | Decrease canvas zoom |

### Sidebar Panels

- **Furniture Tab** - Browse available products. Click a product to add it to the canvas.
- **Properties Tab** - When furniture is selected, adjust position (X, Y), rotation (0-360), dimensions (width, depth).

### Canvas Interactions

| Action | How |
|--------|-----|
| **Select furniture** | Left-click on a furniture piece |
| **Deselect** | Left-click on empty canvas area |
| **Move furniture** | Left-click and drag a selected piece |
| **Pan canvas** | Middle-click + drag, OR Ctrl + Left-click + drag |
| **Zoom** | Scroll wheel (range: 0.2x to 10x) |
| **Rotate selected** | Press `R` key or click Rotate button |
| **Delete selected** | Press `Delete` or `Backspace` key |

---

## 3D Viewer Controls

### Camera Presets

| Preset | View |
|--------|------|
| **Top** | Bird's eye / overhead view |
| **Front** | Straight-on front view |
| **Side** | Side profile view |
| **Corner** | 45-degree isometric view (default) |

### Lighting Modes

| Mode | Icon | Description |
|------|------|-------------|
| **Daylight** | Sun | Bright natural outdoor lighting (default) |
| **Sunset** | Sunset | Warm orange/golden hour tones |
| **Night** | Moon | Dark ambient with subtle accent lights |
| **Studio** | Lightbulb | Bright, even studio spotlighting |

- **Intensity Slider**: Adjust light intensity from 0 to 1 (default: 0.85)

### Room Customization

**Wall Colors** (per wall: Back, Front, Left, Right):
- Presets: White, Cream, Warm Gray, Sage Green, Sky Blue, Blush Pink, Lavender, Sand, Charcoal, Navy, Olive, Terracotta
- "Paint All Walls" option applies one color to every wall

**Floor Types & Colors:**

| Floor Type | Color Options |
|------------|---------------|
| **Tiles** | Beige, White, Gray, Terracotta, Slate, Marble White |
| **Hardwood** | Oak, Walnut, Cherry, Maple, Ebony, Ash |
| **Marble** | Carrara, Calacatta, Emperador, Black, Green, Cream |
| **Concrete** | Natural, Light, Dark, Polished |
| **Carpet** | Beige, Gray, Navy, Burgundy, Forest, Cream |

### Furniture Interaction

| Action | How |
|--------|-----|
| **Select furniture** | Click on a furniture piece in the 3D scene |
| **Deselect** | Press `Escape` or click on the floor |
| **Hover highlight** | Move mouse over furniture to see highlight effect |
| **View details** | Click furniture to see name, dimensions, price in sidebar |

### 3D Camera Mouse Controls (OrbitControls)

| Action | How |
|--------|-----|
| **Rotate camera** | Left-click + drag |
| **Pan camera** | Right-click + drag |
| **Zoom** | Scroll wheel |

- Camera cannot flip upside down (polar angle limited)
- Smooth damping/inertia enabled for natural feel
- Zoom range: 0.5 to 4x room size

---

## Keyboard Shortcuts

### 2D Layout Editor

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` / `Cmd + Z` | Undo |
| `Ctrl + Y` / `Cmd + Y` | Redo |
| `Ctrl + Shift + Z` | Redo (alternative) |
| `Ctrl + S` / `Cmd + S` | Save design |
| `R` | Rotate selected furniture 90 degrees |
| `Delete` / `Backspace` | Delete selected furniture |
| `Arrow Up` | Move selected item up (10cm step) |
| `Arrow Down` | Move selected item down (10cm step) |
| `Arrow Left` | Move selected item left (10cm step) |
| `Arrow Right` | Move selected item right (10cm step) |
| `Shift + Arrow keys` | Fine movement (1cm precision) |

### 3D Viewer

| Shortcut | Action |
|----------|--------|
| `Escape` | Deselect selected furniture |
| `F` | Toggle fullscreen mode |

---

## Mouse Controls

### 2D Layout Editor

| Mouse Action | Result |
|-------------|--------|
| **Left-click** on furniture | Select it |
| **Left-click** on empty space | Deselect all |
| **Left-click + drag** on selected item | Move furniture |
| **Middle-click + drag** | Pan the canvas |
| **Ctrl + Left-click + drag** | Pan the canvas (alternative) |
| **Scroll wheel** | Zoom in/out (0.2x - 10x range) |

Cursor changes to `grabbing` when panning and `move` when dragging furniture.

### 3D Viewer

| Mouse Action | Result |
|-------------|--------|
| **Left-click + drag** | Rotate camera orbit |
| **Right-click + drag** | Pan camera position |
| **Scroll wheel** | Zoom in/out |
| **Left-click** on furniture | Select and focus item |
| **Left-click** on floor | Deselect all |
| **Hover** over furniture | Highlight with lighter color, cursor becomes pointer |

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login (returns JWT token) |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/google` | Google OAuth sign-in/sign-up |
| GET | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/users/forgot-password` | Request password reset email |
| POST | `/api/users/reset-password` | Reset password with token |

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products?page=1&limit=9&search=&category=` | List products with filters |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Designs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/designs` | List all designs |
| GET | `/api/designs/:id` | Get design details |
| POST | `/api/designs` | Create new design |
| PUT | `/api/designs/:id` | Update design |
| POST | `/api/designs/:id/layout` | Save 2D layout data |
| GET | `/api/designs/:id/cost-summary` | Get cost breakdown |
| GET | `/api/designs/:id/versions` | Get version history |
| POST | `/api/designs/:id/versions/:vId/restore` | Restore version |

### Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | List rooms |
| POST | `/api/rooms` | Create room |
| PUT | `/api/rooms/:id` | Update room |

### Consultations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/consultations` | List requests (admin) |
| GET | `/api/consultation-requests/my` | Get user's requests |
| POST | `/api/consultation-requests` | Submit request |
| PUT | `/api/consultations/:id` | Update status (admin) |

### Reviews

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reviews?product=:id&page=1` | List product reviews |
| POST | `/api/reviews` | Submit review |
| PUT | `/api/reviews/:id/helpful` | Mark review helpful |

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/public/preview/:token` | View shared design (no auth) |

---

## Environment Setup

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb+srv://livoraAdmin:Livora123DB@cluster0.pwmr7wq.mongodb.net/Livora?appName=Cluster0
JWT_SECRET=livora_super_secret_key_2026
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services > Credentials**
4. Click **Create Credentials > OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://your-frontend.vercel.app` (production)
7. Copy the **Client ID**
8. Set it in both frontend (`NEXT_PUBLIC_GOOGLE_CLIENT_ID`) and backend (`GOOGLE_CLIENT_ID`)

### Vercel Environment Variables

**Frontend deployment:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Your backend Vercel URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Your Google OAuth Client ID |

**Backend deployment:**

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |
| `GOOGLE_CLIENT_ID` | Your Google OAuth Client ID (same as frontend) |
| `ALLOWED_ORIGINS` | Your frontend Vercel URL |

### Running Locally

```bash
# Frontend (from project root)
npm install
npm run dev
# Runs on http://localhost:3000

# Backend (from livora-backend/)
cd livora-backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Seeding the Database

```bash
cd livora-backend
npx ts-node src/seed.ts
```

This populates sample users, products, rooms, and designs.

---

## All Page Routes Summary

| Route | Auth | Description |
|-------|------|-------------|
| `/` | None | Redirects to furniture catalogue |
| `/admin/login` | None | Admin login page (email/password + Google) |
| `/user-panel/login` | None | User login page (email/password + Google) |
| `/user-panel/register` | None | User registration (form + Google) |
| `/forgot-password` | None | Password reset request |
| `/reset-password` | None | Password reset form |
| `/preview/:token` | None | Public design preview |
| `/dashboard` | Admin | Admin dashboard |
| `/admin/room-setup` | Admin | Create/configure rooms |
| `/admin/2d-layout` | Admin | 2D furniture layout editor |
| `/admin/3d-view` | Admin | 3D room viewer |
| `/admin/3d-visualization` | Admin | Alternative 3D view |
| `/admin/catalogue` | Admin | Browse product catalogue |
| `/admin/catalogue-management` | Admin | Manage products (CRUD) |
| `/admin/compare-designs` | Admin | Compare two designs |
| `/admin/cost-summary` | Admin | Design cost breakdown |
| `/admin/consultations` | Admin | Manage consultation requests |
| `/admin/design-history` | Admin | Design version history |
| `/admin/settings` | Admin | Profile & preferences |
| `/user-panel/furniture-catalogue` | User | Browse & filter furniture |
| `/user-panel/furniture-details/:id` | User | Product detail page |
| `/user-panel/wishlist` | User | Saved favorites |
| `/user-panel/review-and-ratings` | User | Reviews & ratings |
| `/user-panel/consultation-request` | User | Submit consultation |
| `/user-panel/my-account` | User | Profile & history |
