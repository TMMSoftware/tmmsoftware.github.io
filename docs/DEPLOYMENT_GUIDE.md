
# 🚀 Deployment Guide

This document outlines the steps to **deploy** the TMM Software project, including hosting on **GitHub Pages** (for the frontend) and **Vercel** (for the API).

---

## **📌 Overview**
| Component        | Hosting Service  | URL |
|-----------------|-----------------|------------------------------|
| Frontend (HTML) | GitHub Pages    | `https://tmmsoftware.github.io/` |
| Backend (API)   | Vercel          | `https://tmmsoftware-resend.vercel.app/` |

---

## **🖥️ Frontend Deployment (GitHub Pages)**

### **1️⃣ Prerequisites**
- A GitHub repository (`TMMSoftware`)
- Git installed on your machine

### **2️⃣ Setup GitHub Pages**
1. Navigate to your repository on GitHub.
2. Go to **Settings** → **Pages**.
3. Under **Branch**, select `gh-pages` (or set it up if it doesn’t exist).
4. Click **Save** → Your site will be live at `https://tmmsoftware.github.io/`

### **3️⃣ Deploy Changes Automatically**
To automate deployment on every push:
1. Add the following GitHub Action (`.github/workflows/deploy.yml`):
```yaml
name: Deploy Frontend
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: .  # Change if build files are in a subfolder
```

---

## **🛠 Backend Deployment (Vercel)**

### **1️⃣ Prerequisites**
- Vercel account (`https://vercel.com/`)
- Vercel CLI installed (`npm install -g vercel`)

### **2️⃣ Deploy API to Vercel**
1. Login to Vercel:
   ```sh
   vercel login
   ```
2. Navigate to the project folder:
   ```sh
   cd your-project-folder
   ```
3. Deploy to production:
   ```sh
   vercel --prod
   ```

### **3️⃣ Environment Variables**
To store API keys securely:
1. Open **Vercel Dashboard** → Select your project.
2. Go to **Settings** → **Environment Variables**.
3. Add:
   ```env
   RESEND_API_KEY=your-secret-key
   ```
4. Redeploy the API.

---

## **🔄 Automate API Deployment**
To automatically deploy the API on every push, add the following GitHub Action:
```yaml
name: Deploy API to Vercel
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install Vercel CLI
        run: npm install -g vercel

      - name: Deploy to Vercel
        run: vercel --prod
```

---

## **🔒 Security Best Practices**
✅ Store API keys in **environment variables**, never in the code.
✅ Enable **GitHub branch protection** to prevent accidental changes to `main`.
✅ Monitor deployment logs via **GitHub Actions & Vercel Dashboard**.

---

## **📌 Next Steps**
📌 Add logging & monitoring to track API health.
📌 Implement a rollback strategy in case of deployment failure.
📌 Set up **uptime monitoring** for the API.

