# 🏆 TMM Software

Welcome to **TMM Software** – a platform for innovative software solutions. This repository contains the source code, API, and documentation for our web application and services.

---

## 🚀 Project Overview
TMM Software provides early access to cutting-edge products, including:
- 📚 **WebQuiz DevNet** – Interactive quizzes for learning.
- 🖐️ **Gesture Recognition System** – Gesture-based control for macOS.
- 📂 **Smart File Organizer** – Automates and simplifies file management.

This repository includes:
- **Frontend** (HTML, CSS, JavaScript) hosted on **GitHub Pages**.
- **Backend API** (Node.js, Resend API) hosted on **Vercel**.

---

## 📂 Project Structure
```
├── api/                        # Backend API files
│   ├── templates/              # Email templates
│   │   ├── confirmation-email.html
│   ├── send-email.js           # Email submission API
│
├── docs/                       # Documentation files
│   ├── API.md                  # API documentation
│   ├── CI_CD.md                # CI/CD process
│   ├── DEPLOYMENT_GUIDE.md     # Deployment steps
│   ├── FILE_STRUCTURE.md       # Project structure
│   ├── PRIVACY_POLICY.md       # Privacy policy
│   ├── TERMS_OF_SERVICE.md     # Terms of service
│   ├── CHANGELOG.md            # Version updates
│   ├── README.md               # Overview (this file)
│
├── index.html                  # Main web page
├── main.js                      # JavaScript functions
├── style.css                    # Stylesheet
├── package.json                 # Node.js dependencies
├── privacy.html                 # Privacy Policy page
├── terms.html                   # Terms of Service page
```

For a detailed breakdown, check **[FILE_STRUCTURE.md](docs/FILE_STRUCTURE.md)**.

---

## 🔧 Setup & Deployment
### 1️⃣ **Clone the Repository**
```sh
git clone https://github.com/TheMikestMike/TMMSoftware.git
cd TMMSoftware
```

### 2️⃣ **Install Dependencies**
```sh
npm install
```

### 3️⃣ **Run Locally**
```sh
npm start
```

### 4️⃣ **Deploy to Production**
- **Frontend:** Hosted on GitHub Pages → [Live Site](https://tmmsoftware.github.io/)
- **Backend:** Hosted on Vercel → [API](https://tmmsoftware-resend.vercel.app/)

For detailed instructions, see **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)**.

---

## 🔄 CI/CD Workflow
🚀 Automated deployment using **GitHub Actions**:
1. **Push to `main` branch** → Triggers GitHub Actions.
2. **Frontend Deployment** → Deployed to **GitHub Pages**.
3. **API Deployment** → Deployed to **Vercel**.
4. **Security Checks** → Runs code scanning & dependency updates.

See **[CI_CD.md](docs/CI_CD.md)** for details.

---

## 📡 API Usage
- **Endpoint:** `POST https://tmmsoftware-resend.vercel.app/api/send-email`
- **Request:**
```json
{
  "email": "user@example.com",
  "tosAccepted": true
}
```
- **Response:**
```json
{
  "message": "Email sent successfully!"
}
```
For full API details, check **[API.md](docs/API.md)**.

---

## 📜 Legal & Privacy
- **[Privacy Policy](docs/PRIVACY_POLICY.md)** – How we handle user data.
- **[Terms of Service](docs/TERMS_OF_SERVICE.md)** – User agreements.

---

## 📌 Contributing
We welcome contributions! 🚀
- Fork the repo
- Create a feature branch
- Open a pull request

See **[CONTRIBUTING.md]** (coming soon).

---

## 📢 Contact & Support
📧 Email: **eng.miguelaz@gmail.com**  
🐦 Twitter: [@tmm_software](https://x.com/tmm_software)  
💻 GitHub: [TheMikestMike](https://github.com/TheMikestMike)

---

## ⭐ License
This project is licensed under the **MIT License**.

