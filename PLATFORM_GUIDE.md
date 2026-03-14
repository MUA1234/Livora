# Livora — Platform Usage Guide

> **Livora** is a full-stack furniture design studio platform built with Next.js (frontend) and Express.js (backend). This guide covers every page, login credential, keyboard shortcut, and mouse interaction available on the platform.

---

## Table of Contents

- [Getting Started](#getting-started)
- [Login Credentials](#login-credentials)
- [Login Page URLs](#login-page-urls)
- [Admin Panel](#admin-panel)
- [User Panel](#user-panel)
- [Public Pages](#public-pages)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Mouse Interactions](#mouse-interactions)

---

## Getting Started

### Running the Application Locally

1. **Start the backend** (Express.js):
   ```bash
   cd livora-backend
   npm install
   npm run dev
   ```
   The backend runs on `http://localhost:5000`

2. **Start the frontend** (Next.js):
   ```bash
   # In the root Livora folder
   npm install
   npm run dev
   ```
   The frontend runs on `http://localhost:3000`

3. **Seed the database** (optional — populates sample data):
   ```bash
   cd livora-backend
   npx ts-node src/seed.ts
   ```

---

## Login Credentials

### Admin Account

| Field    | Value              |
|----------|--------------------|
| Email    | `admin@livora.com` |
| Password | `Admin@123`        |
| Role     | `admin`            |

### Sample User Accounts

All sample users share the same password: **`User@123`**

| Name             | Email                    | Phone           |
|------------------|--------------------------|-----------------|
| Roshan De Mel    | `roshan@example.com`     | +94772345678    |
| Priya Mendis     | `priya@example.com`      | +94773456789    |
| Kamal Perera     | `kamal@example.com`      | +94774567890    |
| Tharinda Bandara | `tharinda@example.com`   | +94775678901    |
| Amara Silva      | `amara@example.com`      | +94776789012    |
| Nisha Fernando   | `nisha@example.com`      | +94777890123    |

> **Note:** You can also create new accounts via the User Registration page.

---

## Login Page URLs

| Portal      | URL                                           | Redirects To After Login                     |
|-------------|-----------------------------------------------|----------------------------------------------|
| Admin Login | `http://localhost:3000/admin/login`            | `/dashboard` (Admin Dashboard)               |
| User Login  | `http://localhost:3000/user-panel/login`       | `/user-panel/furniture-catalogue` (Catalogue) |
| Registration| `http://localhost:3000/user-panel/register`    | `/user-panel/furniture-catalogue` (Catalogue) |

**Root URL** (`http://localhost:3000/`) automatically redirects to `/user-panel/furniture-catalogue`.

---

## Admin Panel

### Pages & Navigation

The admin panel uses a **sidebar navigation** on the left side of every page. Below are all the admin pages and what they do.

---

### 1. Dashboard (`/dashboard`)

- **Overview stats**: Total Designs, Total Products, Pending Consultations, Total Clients
- **Quick Action cards**: Create New Design, Furniture Catalogue, Design Comparison, Cost Reports
- **Recent Designs grid**: Shows the 3 most recent designs with name, status badge, creation date, and thumbnail

**Mouse:**
- Click any **Quick Action card** to navigate to the corresponding page
- Click **"View all"** next to Recent Designs to see all designs

---

### 2. Room Setup (`/admin/room-setup`)

Configure a room before creating a furniture layout.

| Section          | Description                                                            |
|------------------|------------------------------------------------------------------------|
| Room Name        | Text input — give your room a descriptive name                         |
| Dimensions       | Length, Width, Height inputs. Toggle between **Meters** and **Feet**   |
| Room Shape       | Choose from Rectangle, Square, L-Shape, or Custom                      |
| Wall Texture     | Pick from Plaster, Wood Panel, Concrete, Brick, Stucco, Exposed Brick |
| Floor Texture    | Pick from Laminate, Ceramic, Hardwood, Carpet, Marble 1, Marble 2     |
| Wall Colour      | Pick from 11 preset colour swatches or use the displayed hex code      |

**Mouse:**
- Click a **shape button** to select room shape
- Click a **texture swatch** to select wall/floor texture
- Click a **colour swatch** to select wall colour
- Click **"Save Draft"** to save the room configuration
- Click **"Load saved draft"** dropdown to load a previously saved room
- Click **"Continue to 2D Layout"** to proceed (room must be saved first)

---

### 3. 2D Layout Editor (`/admin/2d-layout?roomId=...`)

Interactive drag-and-drop furniture placement on a top-down room view.

**Features:**
- Left sidebar with **Furniture tab** (browse/search products) and **Properties tab** (selected item details)
- SVG-based room canvas with grid overlay
- Furniture shown as detailed top-down views (sofas, beds, tables, chairs, lamps, etc.)
- Snap-to-grid toggle
- Undo/Redo history
- Zoom in/out controls
- Design name input field
- Save design and navigate to 3D view

**Mouse:**
- **Click a product** in the sidebar to place it on the canvas (appears at room center)
- **Click and drag** any placed furniture to move it around the room
- **Click on empty space** on the canvas to deselect
- **Right-click + drag** (or middle-click + drag) on the canvas to **pan** the view
- **Scroll wheel** to **zoom** in/out
- Click **"Save"** button to save the design
- Click **"View in 3D"** to switch to the 3D visualizer

---

### 4. 3D Visualization (`/admin/3d-view?designId=...`)

Full 3D rendering of the room with placed furniture using Three.js.

**Features:**
- Orbit camera controls (rotate, zoom, pan)
- **Lighting modes**: Daylight ☀️, Sunset 🌅, Night 🌙, Studio 💡
- **Camera presets**: Top, Front, Side, Corner views
- **Wall colours**: Customize each wall (Back, Front, Left, Right) independently with 12 colour presets
- **Floor types**: Tiles, Hardwood, Marble, Concrete, Carpet — each with multiple colour styles
- Furniture item list panel showing all placed items with dimensions and price
- Fullscreen toggle

**Mouse:**
- **Left-click + drag**: Orbit/rotate the camera
- **Right-click + drag**: Pan the camera
- **Scroll wheel**: Zoom in/out
- Click **lighting mode buttons** to change ambience
- Click **camera preset buttons** for quick views
- Click **wall colour swatches** to customize walls
- Click **floor type and colour swatches** to change flooring
- Click **furniture list items** to highlight them

---

### 5. Furniture Catalogue — Admin (`/admin/catalogue`)

Browse and manage the furniture inventory.

**Mouse:**
- Click category buttons to filter products
- Use the search bar to find products by name
- Click product cards to view details

---

### 6. Catalogue Management (`/admin/catalogue-management`)

Add, edit, or delete products from the catalogue.

**Mouse:**
- Click **"Add Product"** to create a new product
- Click **"Edit"** on a product to modify its details
- Click **"Delete"** to remove a product (with confirmation modal)

---

### 7. Consultations (`/admin/consultations`)

Manage design consultation requests from customers.

**Features:**
- Status filter tabs: All, Pending, Confirmed, Completed, Rejected
- Searchable consultation table with customer name, room details, dates, status
- Detail drawer (side panel) with full conversation thread
- Status management: Accept, Reject, or mark as Completed
- Reply to customer with message
- Generate shareable design preview link

**Mouse:**
- Click **status filter tabs** to filter by consultation status
- Click the **eye icon** on a row to open the detail drawer
- Type a reply and click **"Send Response"** to message the customer
- Click **"Accept"** or **"Reject"** to update consultation status
- Click **"Generate Preview Link"** to create a shareable design link
- Click **"Copy"** to copy the share link to clipboard

---

### 8. Compare Designs (`/admin/compare-designs`)

Side-by-side visual comparison of two design layouts.

**Mouse:**
- Select two designs from dropdowns to compare them
- View differences in furniture placement, cost, and layout

---

### 9. Cost Summary (`/admin/cost-summary?designId=...`)

View the cost breakdown for a design with all furniture items and total price.

**Features:**
- Itemized list of furniture with individual prices
- Total cost calculation
- **PDF export** of the cost report

**Mouse:**
- Click **"Export PDF"** to download the cost report
- Click design selector to switch between designs

---

### 10. Design History (`/admin/design-history`)

View all created designs with their status (Draft, Published) and creation dates.

**Mouse:**
- Click a design to view its details
- Filter designs by status
- Navigate to 2D or 3D view of any design

---

### 11. Admin Settings (`/admin/settings`)

Admin account preferences and configuration.

---

## User Panel

### Pages & Navigation

The user panel uses a **top navigation bar** (Navbar) with links to the main user features.

---

### 1. Furniture Catalogue (`/user-panel/furniture-catalogue`)

The main landing page for users — browse the furniture collection.

**Features:**
- Search bar with submit-on-enter
- Category filter sidebar: All Furniture, Sofa, Chair, Table, Bed, Storage, Lighting, Decor
- Price range filter with Min/Max inputs and Apply button
- Sort by: Newest, Price Low to High, Price High to Low
- Product cards with image, name, materials, price, star rating
- Wishlist heart button on each product
- Pagination (9 items per page)

**Mouse:**
- **Click a category** in the sidebar to filter
- **Type in Min/Max price** fields and click **"Apply"** to filter by price
- **Click the heart icon** ❤️ on a product to add/remove from wishlist
- **Click "View Details"** on a product to see its full details page
- **Click "Previous"/"Next"** for pagination
- **Click "Clear filters"** to reset all filters

---

### 2. Furniture Details (`/user-panel/furniture-details/[productId]`)

Detailed view of a single product.

**Features:**
- Product image gallery
- Product name, SKU, price, description
- Dimensions (Width × Height × Depth)
- Available colours and materials
- Add to wishlist button
- Customer reviews and ratings

**Mouse:**
- Click product images to view gallery
- Click **heart icon** to add/remove from wishlist
- Scroll down to see reviews

---

### 3. Wishlist (`/user-panel/wishlist`)

View and manage your saved furniture items.

**Features:**
- Grid of wishlist items with image, name, and price
- Remove individual items
- Persisted in browser localStorage

**Mouse:**
- Click **heart icon** or **remove button** to remove an item
- Click a product card to go to its details page

---

### 4. My Account (`/user-panel/my-account`)

User profile management page.

**Features:**
- Left sidebar with navigation: My Profile, Book Consultations, Wishlist, Review and Ratings
- Profile Information form (Name, Email, Phone with country code selector)
- Saved Consultation Requests table (Room Type, Date, Status, Action)
- Wishlist Overview showing first 3 wishlist items

**Mouse:**
- Edit **Name**, **Email**, or **Phone** fields and click **"Save Changes"**
- Click **"Logout"** button to sign out
- Click **"Book New"** to navigate to the consultation form
- Click **"View Full Wishlist"** to see all saved items
- Click sidebar links to navigate between sections

---

### 5. Consultation Request — User Panel (`/user-panel/consultation-request`)

Consultation booking form for logged-in users (similar to the public form).

---

### 6. Review and Ratings (`/user-panel/review-and-ratings`)

View and submit product reviews.

---

### 7. User Registration (`/user-panel/register`)

Create a new account.

**Required fields:**
- Full Name
- Phone (with international country code selector — auto-detects country)
- Email Address
- Password (min 6 characters, strength indicator shown)
- Confirm Password

**Mouse:**
- Click the **eye icon** 👁️ to toggle password visibility
- Click **"Create Account"** to register
- Click **"Sign in"** link to go to login page

---

## Public Pages

### 1. Consultation Request (`/consultation-request`)

A public form (no login required) to book a design consultation.

**Form fields:**
- Full Name (required)
- Email Address (required)
- Phone Number (required, with country code selector)
- Room Type: Living Room, Bedroom, Dining Room, Home Office, Kids Room, Other
- Room Size (e.g. "5.5m × 4.2m")
- Preferred Visit Date
- Additional Notes

**Mouse:**
- Fill in all fields and click **"Submit Request"**
- After submission, a success page shows a request summary
- Click **"Submit Another Request"** to send another

---

### 2. Forgot Password (`/forgot-password`)

Enter your email to receive a password reset link.

**Mouse:**
- Enter email and click **"Send Reset Link"**

---

### 3. Reset Password (`/reset-password?token=...`)

Set a new password using the reset token from the email.

**Mouse:**
- Enter new password and confirm, then click **"Reset Password"**

---

### 4. Design Preview (`/preview/[shareToken]`)

Public preview page for a shared design — viewable without login via a shareable link generated by the admin.

---

## Keyboard Shortcuts

### 2D Layout Editor (`/admin/2d-layout`)

| Shortcut                           | Action                                             |
|------------------------------------|----------------------------------------------------|
| `Ctrl + Z`                         | Undo last action                                   |
| `Ctrl + Y` or `Ctrl + Shift + Z`   | Redo last undone action                             |
| `Ctrl + S`                         | Save the current design                             |
| `R`                                | Rotate selected furniture by 15°                    |
| `Delete` or `Backspace`            | Delete selected furniture item                      |
| `Escape`                           | Deselect the currently selected item                |
| `Arrow Keys` (↑ ↓ ← →)            | Move selected furniture by one grid step (10cm)     |
| `Shift + Arrow Keys`               | Move selected furniture by 1cm (fine positioning)   |

### Login & Form Pages

| Shortcut       | Action                        |
|----------------|-------------------------------|
| `Enter`        | Submit form (login, register, consultation, etc.) |
| `Tab`          | Move to next form field       |
| `Shift + Tab`  | Move to previous form field   |

---

## Mouse Interactions

### General (All Pages)

| Action          | Effect                              |
|-----------------|-------------------------------------|
| Click           | Select, navigate, toggle, or submit |
| Hover           | Show tooltips, highlight elements, trigger micro-animations |

### 2D Layout Editor

| Action                        | Effect                                    |
|-------------------------------|-------------------------------------------|
| Click on product (sidebar)    | Place furniture at room center             |
| Click + drag furniture        | Move furniture around the room             |
| Click on empty canvas         | Deselect current furniture                 |
| Right-click + drag on canvas  | Pan the canvas view                        |
| Scroll wheel                  | Zoom in/out                                |

### 3D Visualization

| Action                        | Effect                                    |
|-------------------------------|-------------------------------------------|
| Left-click + drag             | Orbit/rotate the camera around the room    |
| Right-click + drag            | Pan the camera                             |
| Scroll wheel                  | Zoom in/out                                |

### Furniture Catalogue

| Action                          | Effect                                  |
|---------------------------------|-----------------------------------------|
| Click heart icon on product     | Add to / Remove from wishlist           |
| Click "View Details" on product | Navigate to product detail page         |
| Click category in sidebar       | Filter by that category                 |
| Click "Apply" on price filter   | Filter by price range                   |
| Click "Clear filters"           | Reset all active filters                |
| Click "Previous" / "Next"       | Navigate between pagination pages       |

### Admin Consultations

| Action                           | Effect                                 |
|----------------------------------|----------------------------------------|
| Click eye icon on table row      | Open detail drawer                     |
| Click status filter tab          | Filter consultations by status         |
| Click "Accept" / "Reject"       | Update consultation status              |
| Click "Send Response"           | Send message to customer                |
| Click "Generate Preview Link"   | Create shareable 3D design link         |
| Click "Copy" icon               | Copy share link to clipboard            |

---

## Environment Variables

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (`livora-backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb+srv://livoraAdmin:Livora123DB@cluster0.pwmr7wq.mongodb.net/Livora?appName=Cluster0
JWT_SECRET=livora_super_secret_key_2026
```

> ⚠️ These are development credentials only. Replace them before deploying to production.

---

## Tech Stack Summary

| Layer          | Technology                                       |
|----------------|--------------------------------------------------|
| Frontend       | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend        | Express.js 5, TypeScript, Mongoose ODM            |
| Database       | MongoDB Atlas                                     |
| Authentication | JWT + bcrypt password hashing                     |
| 3D Rendering   | Three.js + React Three Fiber + Drei               |
| PDF Export     | PDFKit                                            |
| Icons          | Lucide React                                      |
