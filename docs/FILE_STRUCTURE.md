# 📂 Project File Structure

This document provides a structured breakdown of all files and directories in the project.

## **1. `index.html`** (Main Webpage)

### **Purpose:**
The primary HTML file serves as the entry point for TMM Software's early access page.

### **Key Sections:**
- **Head:**
  - Meta tags for responsive design and dark/light mode.
  - Google Fonts (Montserrat).
  - External CSS (Bootstrap + `style.css`).
- **Body:**
  - **Navigation Bar:** Brand name, login/signup buttons (disabled), dark mode switch.
  - **Hero Section:** Displays branding and an invitation to sign up.
  - **Product Sections:** Three products with early access sign-up forms.
  - **Footer:** Links to Privacy Policy, Terms of Service, GitHub, and Twitter.

### **Dependencies:**
- `style.css` (Custom styles)
- `main.js` (JavaScript functionality)

---

## **2. `style.css`** (Custom Stylesheet)

### **Purpose:**
Defines UI styles, including light/dark mode, layout, form styles, and interactive elements.

### **Key Features:**
- **Dark Mode Support:** Uses CSS variables (`--background-color`, `--text-color`).
- **Navigation Bar Styling:** Sticky top navigation with responsive design.
- **Hero Section Styling:** Large, centered branding with clear CTA.
- **Product Section Styling:** Cards for each product with hover effects.
- **Form Styling:** Email input validation, suggestions, and animated buttons.
- **Modal Styling:** Privacy policy and terms of service modals.
- **Button Styles:** Different states for submission buttons (default, valid, sending, success, error).

---

## **3. `main.js`** (JavaScript Functionality)

### **Purpose:**
Handles UI interactions, email validation, theme switching, and form submissions.

### **Key Functions:**
1. **Dark Mode Toggle:** Retrieves saved preference from `localStorage` and updates theme dynamically.
2. **Email Validation & Suggestions:**
   - Validates input with regex.
   - Provides domain suggestions (gmail.com, yahoo.com, etc.).
   - Shows TOS section only after valid email entry.
3. **Form Submission:** Ensures email validity, requires TOS check, and sends data to `send-email.js` API.
4. **Modal Logic:** Loads `privacy.html` or `terms.html` inside the modal and handles interactions.

---

## **4. `send-email.js`** (Serverless API for Email Submission)

### **Purpose:**
Handles API requests for sending confirmation emails.

### **Key Features:**
- **CORS Headers:** Allows requests from `https://tmmsoftware.github.io`.
- **Methods Allowed:**
  - `POST` (Submits email + TOS acceptance).
  - `OPTIONS` (Handles preflight requests).
- **Validation:** Checks for required email input and TOS acceptance.
- **Email Sending:** Reads `confirmation-email.html` template and uses `resend` API.

---

## **5. `privacy.html`** (Privacy Policy)

### **Purpose:**
Outlines how TMM Software collects, uses, and protects user data.

### **Key Sections:**
1. **Information We Collect:** Email address (for early access signup), IP, browser type.
2. **How We Use Your Data:** Send product updates, improve services, no third-party sharing.
3. **Security Measures:** Secure storage via Vercel Serverless Functions, encryption practices.
4. **User Rights:** Unsubscribe or request data deletion.
5. **Third-Party Services:** Mentions `Resend API` for email handling.

---

## **6. `terms.html`** (Terms of Service)

### **Purpose:**
Defines the agreement for early access users.

### **Key Sections:**
1. **Acceptance of Terms:** Users join voluntarily, no guarantee of final product availability.
2. **Usage Rules:** No misuse (hacking, disruption, copying).
3. **Limitation of Liability:** No warranties, not liable for data loss.
4. **Termination Rights:** Access can be revoked if rules are violated.

---

## **7. `confirmation-email.html`** (Email Template)

### **Purpose:**
HTML template for early access confirmation emails.

### **Key Features:**
- Uses **Montserrat** font.
- **Welcome message** with product updates.
- **"Unsubscribe" link** dynamically replaced via API.

---

## **8. `package.json`** (Node.js Configuration)

### **Purpose:**
Manages dependencies for the email API.

### **Dependencies:**
```json
{
  "name": "tmmsoftware-resend",
  "version": "1.0.0",
  "main": "api/send-email.js",
  "dependencies": {
    "resend": "^4.1.2"
  }
}
```


