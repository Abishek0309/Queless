# 🎟️ QueueLess

> **Don't wait in line. Know when it's your turn.**  
> A real-time, zero-friction virtual queue management platform designed to eliminate physical waiting lines for clinics, salons, repair centers, banks, restaurants, and service providers.

---

## 🚀 Key Features

### 👤 Customer Experience (Mobile-First)
* **⚡ Frictionless 1-Click Guest Join**: No password or account registration required to get a ticket—enter your name and join instantly.
* **📱 Live Queue Ticket (`#29`)**: Dynamic real-time ticket tracking showing:
  * Current serving number vs. your spot
  * People ahead counter & estimated wait countdown
  * Visual segmental progress bar
* **🔔 Smart Audio & Vibration Alerts**: Synthesized chime alerts (Web Audio API) and haptic feedback when your turn is called or when you're 1 person away.

### 💼 Business Staff Operations (Desktop & Tablet)
* **🕹️ Staff Workstation**: High-efficiency command center with:
  * **[CALL NEXT]** with one click
  * **[Complete Customer]** and **[Hold / Skip (5 min)]** grace window
  * Active customer elapsed service timer
  * Live drag-and-drop waiting list table
* **📺 TV Kiosk / Waiting Room Mode**: Full-screen 1080p high-contrast display for wall-mounted TVs/tablets showing **"NOW SERVING: #24"** and upcoming queue numbers.

### 🏢 Business Admin & Analytics
* **🖨️ Printable QR Code Poster Designer**: Generate and print custom A4 / table-tent QR code posters for your clinic desk or entrance.
* **📊 Analytics & Insights**: Track peak traffic hours (e.g., `11:00 AM - 1:00 PM`), average service duration, customer volume per hour, and abandonment rates.

---

## 🏗️ Architecture

QueueLess is designed with clean architectural separation across both frontend and backend:

### Frontend (MVVM Pattern)
* **Model**: Typed domain interfaces (`Ticket`, `Business`, `Queue`), API client, and storage wrappers.
* **ViewModel**: React Custom Hooks encapsulating state, timers, Web Audio alerts, and business calculations.
* **View**: Pure presentational TSX components styled with **Tailwind CSS**.

### Backend (Repository-Service Pattern)
* **Routers / Controllers**: FastAPI endpoints with request validation & dependency injection.
* **Services**: Business rules, state transitions, moving-average wait times, and WebSocket broadcasts.
* **Repositories**: Pure database access using **SQLAlchemy 2.0 ORM**.
* **Database**: PostgreSQL (Cloud Free Tier / Local) & SQLite fallback.

### 📦 Global API Response Envelope
Every API response strictly follows the standard response shape:
```json
{
  "status": "success",
  "message": "Queue joined successfully! Ticket generated.",
  "content": {
    "id": "ticket_29",
    "ticket_code": "#29",
    "customer_name": "Alex Johnson",
    "status": "WAITING",
    "people_ahead": 8,
    "estimated_wait_minutes": 32
  }
}
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti |
| **Backend** | Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2 |
| **Database** | PostgreSQL / SQLite ($0 Cost local & cloud deployment) |
| **Real-Time** | WebSockets & Web Audio API synthesizers |
| **Specification** | OpenAPI 3.0.3 ([`openapi.yaml`](./openapi.yaml)) |

---

## 📂 Project Directory Structure

```text
├── openapi.yaml                         # Complete OpenAPI 3.0.3 Specification
├── src/
│   ├── app/                             # App layout & routing
│   │   ├── App.tsx
│   │   └── routes.tsx
│   ├── core/                            # Core infrastructure
│   │   ├── api/
│   │   │   ├── client.ts                # Reactive API client with state broadcaster
│   │   │   └── mockData.ts              # Rich mock datasets
│   │   ├── types/
│   │   │   └── index.ts                 # Shared TypeScript models & ApiResponse envelope
│   │   └── utils/
│   │       ├── audio.ts                 # Web Audio API chime synthesizers
│   │       ├── storage.ts               # LocalStorage guest session manager
│   │       └── time.ts                  # Dynamic countdowns and timer formatters
│   ├── shared/                          # Reusable UI primitives
│   │   └── components/                  # Button, Badge, Modal, Navbar
│   └── features/                        # MVVM Feature Modules
│       ├── business-discovery/          # Landing & business search views
│       ├── customer-queue/              # Live ticket tracking (#29) & guest join modal
│       └── business-dashboard/          # Staff workstation, TV kiosk, QR poster, analytics
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## ⚡ Quick Start (Frontend)

### 1. Clone the repository
```bash
git clone https://github.com/Abishek0309/Queless.git
cd Queless
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open [http://localhost:5174](http://localhost:5174) in your browser.

> 💡 **Tip for Mobile Testing**: Open the local Network IP (e.g. `http://192.168.1.x:5174`) from your smartphone on the same Wi-Fi network to test the mobile ticket experience and QR scan flow in real time!

---

## 🗺️ Key Application Routes

| Route | Description | Target Device |
| :--- | :--- | :--- |
| `/` | Business Discovery & Search | Desktop / Mobile |
| `/ticket` | Live Customer Queue Ticket (`#29`) | Mobile-First |
| `/workstation` | Staff Workstation (Call Next / Controls) | Desktop / Tablet |
| `/tv-display` | Waiting Room TV Kiosk Display Mode | 1080p Screen / TV |
| `/admin/qr` | A4 Printable QR Code Poster Generator | Desktop |
| `/analytics` | Queue Throughput & Peak Hours Telemetry | Desktop |

---

## 📄 License

This project is licensed under the MIT License.
