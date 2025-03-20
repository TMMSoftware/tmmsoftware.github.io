# 🚀 CI/CD Pipeline Documentation

This document describes the **Continuous Integration and Continuous Deployment (CI/CD) process** for TMM Software, ensuring a smooth transition from development to production.

---

## **📌 Overview**
The CI/CD pipeline automates code integration, testing, and deployment using **GitHub**, **Vercel**, and **GitHub Pages**.

### **🔗 Repositories Involved**
- **Development Repository:** `TheMikestMike` (for development and staging)
- **Production Repository:** `TMMSoftware` (for final releases and deployment to GitHub Pages)

### **📍 Hosting Services**
- **GitHub Pages** → Hosts the front-end website (`index.html`).
- **Vercel** → Hosts the API (`send-email.js`).

---

## **🔄 CI/CD Workflow**

### **1️⃣ Development Phase (Local & Dev Repo)**
- Developers work in **feature branches** within `TheMikestMike`.
- Changes are pushed to `dev` branch (pull requests required).
- Each push triggers GitHub Actions:
  - **Code Linting** (Ensures clean, error-free code)
  - **Unit Tests** (Ensures core functions work)
  - **Build Checks** (Ensures production readiness)

### **2️⃣ Staging (Pre-Production Testing)**
- Once features are merged into `main`, the **staging environment** is deployed to Vercel.
- Developers test the live preview before final production deployment.

### **3️⃣ Production Deployment**
- Once approved, the latest version is **pushed to `TMMSoftware` repository**.
- GitHub Actions automatically:
  - 🚀 Deploy front-end to **GitHub Pages** (`https://tmmsoftware.github.io/`)
  - 🚀 Deploy API (`send-email.js`) to **Vercel (`https://tmmsoftware-resend.vercel.app/`)**

---

## **🔧 GitHub Actions Workflow (Automation)**

### **Trigger: Push to `main` branch**
```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Install Dependencies
        run: npm install

      - name: Build Project
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          branch: gh-pages
          folder: dist  # Change to actual build folder

      - name: Deploy API to Vercel
        run: |
          npm install -g vercel
          vercel --prod
```

---

## **🔒 Security Measures**
- **GitHub Secrets** → Store API keys securely.
- **Dependabot** → Monitors and updates dependencies.
- **Code Scanning** → Prevents security vulnerabilities.

---

## **🌟 Future Improvements**
- ✅ **Automated Tests** before deployment.
- ✅ **Feature Flags** for controlled rollouts.
- ✅ **Uptime Monitoring** for production stability.
📌 Implement **unit tests in the CI/CD pipeline**

