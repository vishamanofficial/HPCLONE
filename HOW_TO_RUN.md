# How to Run HangingPanda

Follow these instructions to start the unified HangingPanda application.

---

### Step 1: Install Dependencies (If Not Already Done)

Run in both folders:
```bash
# Frontend
npm --prefix web install

# Backend
npm --prefix server install
```

---

### Step 2: Start Both Services with a Single Command

From the root project directory:
```bash
npm run dev
```

This launches:
- **Express Backend API**: `http://localhost:5000`
- **Next.js Frontend & Admin CMS**: `http://localhost:3000`

---

### Step 3: Access the Application

- **Public Marketing Website**: [http://localhost:3000](http://localhost:3000)
- **Admin CMS Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)

#### Default Admin Credentials:
- **Email**: `admin@hangingpanda.com`
- **Password**: `Admin@HangingPanda2026!`

---

### Step 4: Verify Full Production Build

```bash
npm run build
```
Generates 48 static & dynamic routes with 0 errors.
