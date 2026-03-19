# 🛋️ LIVORA - Furniture Design Studio Platform

> A full-stack, web-based furniture design platform built for in-store designers to create, visualize, and present room layouts in 2D and 3D — helping customers make confident, informed furniture choices.

---

## 🌐 Live Demo

- **Admin Login**: `http://localhost:3000/admin/login`
- **User Login**: `http://localhost:3000/user-panel/login`
- - **User Registration**: `http://localhost:3000/user-panel/register`


**Default Admin Credentials**
- **Email**: `admin@livora.com`
- **Password**: `Admin@123`

**Sample User Credentials** (Password: `User@123`)
- `roshan@example.com` · `priya@example.com` · `kamal@example.com`
- `tharinda@example.com` · `amara@example.com` · `nisha@example.com`

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/livora.git
cd livora
```

### 2. Start the Backend (Express.js)
```bash
cd livora-backend
npm install
npm run dev
```
> Backend runs on: `http://localhost:5000`

### 3. Start the Frontend (Next.js)
```bash
cd livora-frontend
npm install
npm run dev
```
> Frontend runs on: `http://localhost:3000`

### 4. Seed the Database (Optional)
```bash
cd livora-backend
npx ts-node src/seed.ts
```

---

## 🌟 Feature Set

### 🎨 Admin Panel — Designer Side

<br>

<img width="1917" height="688" alt="Screenshot 2026-03-19 125604" src="https://github.com/user-attachments/assets/451df656-6d0a-4348-bd65-4101af01d5b7" />
<br>

<img width="1919" height="864" alt="Screenshot 2026-03-18 183149" src="https://github.com/user-attachments/assets/502c9615-99ad-4102-992e-2fbe2d824082" />

<br><br>

<table width="100%">
  <thead>
    <tr>
      <th align="left">Module</th>
      <th align="left">Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🔐 <b>Authentication</b></td>
      <td>
        <ul>
          <li>Secure JWT + Bcrypt login</li>
          <li>Session handling & logout</li>
          <li>Role-based access control</li>
          <li>Error handling & validation</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>📊 <b>Admin Dashboard</b></td>
      <td>
        <ul>
          <li>Overview stats: Total Designs, Products, Consultations, Clients</li>
          <li>Quick actions: Create New Design, Furniture Catalogue</li>
          <li>Recent designs preview</li>
          <li>Quick access to Comparison, Cost Reports</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>🏠 <b>Room Setup</b></td>
      <td>
        <ul>
          <li>Configure room name, dimensions (L × W × H)</li>
          <li>Room shape selection</li>
          <li>Wall & floor texture selection</li>
          <li>Colour scheme configuration</li>
          <li>Continue to 2D Layout Editor</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>✏️ <b>2D Layout Editor</b></td>
      <td>
        <ul>
          <li>Drag-and-drop furniture placement on grid canvas</li>
          <li>Rotate, align to walls, snap-to-wall</li>
          <li>Undo / Redo (Ctrl+Z / Ctrl+Y)</li>
          <li>Zoom controls & grid toggle</li>
          <li>Apply textures: wood, fabric, metal</li>
          <li>Adjust lighting intensity & day/night mode</li>
          <li>Save design (Ctrl+S)</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>🧊 <b>3D Visualization</b></td>
      <td>
        <ul>
          <li>Real-time Three.js 3D rendering</li>
          <li>Orbit, pan & zoom camera controls</li>
          <li>Lighting modes: Daylight, Sunset, Night, Studio</li>
          <li>Camera presets: Top, Front, Side, Corner</li>
          <li>Toggle shading & lighting effects</li>
          <li>Save design & back to 2D</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>🪑 <b>Furniture Catalogue Management</b></td>
      <td>
        <ul>
          <li>Add, edit, delete products</li>
          <li>Upload product images</li>
          <li>Assign category, description, dimensions</li>
          <li>Set price, colours & manage textures</li>
          <li>Bulk product import via CSV</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>⚖️ <b>Design Comparison</b></td>
      <td>
        <ul>
          <li>Side-by-side layout comparison</li>
          <li>Compare colour schemes & furniture selection</li>
          <li>Cost comparison between designs</li>
          <li>Visual difference highlighting</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>💰 <b>Cost Summary & Reports</b></td>
      <td>
        <ul>
          <li>Itemised furniture cost breakdown</li>
          <li>Total estimated cost calculation</li>
          <li>Export cost report as PDF</li>
          <li>Download design summary</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>🕓 <b>Design History</b></td>
      <td>
        <ul>
          <li>View all previously created designs</li>
          <li>Restore previous design versions</li>
          <li>Auto-save history log</li>
          <li>Compare version changes</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>📅 <b>Consultation Management</b></td>
      <td>
        <ul>
          <li>View all customer consultation requests</li>
          <li>Accept / Reject requests</li>
          <li>Update status: Pending → Confirmed → Completed</li>
          <li>Send response to client</li>
          <li>Generate & share design preview links</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>⚙️ <b>Profile / Settings</b></td>
      <td>
        <ul>
          <li>Update profile & change password</li>
          <li>Accessibility: high contrast, dark mode, font size</li>
          <li>Notification preferences</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

### 🌐 User Panel — Customer Side

<br>

<img width="1918" height="861" alt="Screenshot 2026-03-19 123703" src="https://github.com/user-attachments/assets/985fda6f-f068-4c77-8628-c160b0c06a35" />

<br>
<img width="1865" height="897" alt="Screenshot (1854)" src="https://github.com/user-attachments/assets/02d590b3-3522-48f8-a338-65de511e2ce9" />

<br><br>
<table width="100%">
  <thead>
    <tr>
      <th align="left">Module</th>
      <th align="left">Capabilities</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>🛋️ <b>Furniture Catalogue</b></td>
      <td>
        <ul>
          <li>Browse all furniture products</li>
          <li>Filter by category, price, colour, material, rating</li>
          <li>Search bar & sort options</li>
          <li>Product cards with image, price & star rating</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>🔍 <b>Furniture Detail Page</b></td>
      <td>
        <ul>
          <li>Multi-image gallery & full description</li>
          <li>Dimensions, material, available colours & price</li>
          <li>Add to Wishlist</li>
          <li>Request Design Consultation button</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>❤️ <b>Wishlist</b></td>
      <td>
        <ul>
          <li>Save favourite furniture items</li>
          <li>Remove items or move to consultation</li>
          <li>View product details from wishlist</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>📋 <b>Consultation Request</b></td>
      <td>
        <ul>
          <li>Book a design consultation with a designer</li>
          <li>Enter room size, preferred date & notes</li>
          <li>Submission confirmation message</li>
          <li>Track consultation status from profile</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>⭐ <b>Reviews & Ratings</b></td>
      <td>
        <ul>
          <li>Submit star ratings and written reviews</li>
          <li>Browse customer reviews per product</li>
          <li>Sort & filter by rating</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>👤 <b>User Account</b></td>
      <td>
        <ul>
          <li>Edit profile: name, email, phone</li>
          <li>View saved consultation requests & statuses</li>
          <li>Wishlist overview & comparison history</li>
          <li>Logout</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

---

## ⌨️ Keyboard Shortcuts

### 2D Layout Editor

| Shortcut | Action |
|---|---|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` | Redo |
| `Ctrl + S` | Save design |
| `R` | Rotate selected furniture |
| `Delete` | Delete selected furniture |
| `Escape` | Deselect |
| `Arrow Keys` | Move furniture |
| `Shift + Arrow` | Fine movement |

### Forms & Navigation

| Shortcut | Action |
|---|---|
| `Enter` | Submit form |
| `Tab` | Next field |
| `Shift + Tab` | Previous field |

---

## 🖱️ Mouse Interactions

| Context | Interaction | Action |
|---|---|---|
| **2D Editor** | Click product | Place furniture |
| **2D Editor** | Click + Drag | Move furniture |
| **2D Editor** | Right Click + Drag | Pan canvas |
| **2D Editor** | Scroll Wheel | Zoom |
| **3D View** | Left Drag | Orbit camera |
| **3D View** | Right Drag | Pan camera |
| **3D View** | Scroll Wheel | Zoom |
| **Catalogue** | Heart icon | Add / remove wishlist |
| **Consultations** | Eye icon | View consultation details |
| **Consultations** | Accept / Reject | Update status |

---


## ⚙️ Environment Variables

### Frontend — `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend — `.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=livora_super_secret_key_2026
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Express.js 5, TypeScript |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT + bcrypt |
| **3D Rendering** | Three.js + React Three Fiber |
| **PDF Export** | PDFKit |
| **Icons** | Lucide React |

---

## 📋 System Module Breakdown

1. **Authentication Module** — JWT-based login, session & role management
2. **Room Design Module** — Room setup, dimensions, textures, colour schemes
3. **2D Rendering Module** — Canvas editor, drag-and-drop, snap, undo/redo
4. **3D Visualization Module** — Three.js scene, lighting, camera presets
5. **Furniture Management Module** — Catalogue CRUD, image upload, bulk import
6. **Cost Calculation Module** — Itemised breakdown, totals, PDF export
7. **Comparison Module** — Side-by-side design comparison
8. **User Interaction Module** — Wishlist, reviews, consultation requests
9. **Reporting Module** — Design history, audit log, cost reports

---

## 🧪 HCI / UX Principles Applied

- **Usability** — Intuitive, consistent interface requiring minimal training
- **Feedback** — Immediate visual/textual confirmation for all actions
- **Error Prevention** — Clear prompts and undo options throughout
- **Accessibility** — Colour contrast, font size options, dark/high-contrast modes
- **Efficiency** — Minimal steps per task for smooth customer consultations
- **Engagement** — Immersive 3D visualization and interactive 2D editor

---

## 📄 License

This project was developed as part of **PUSL3122 – HCI, Computer Graphics & Visualisation** coursework.

---

> Built with ❤️ by the Livora Team
