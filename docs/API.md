# 📡 API Documentation

This document provides an overview of the **send-email API**, including request methods, parameters, and responses.

---

## **📌 Overview**
The `send-email.js` API handles early access email submissions and sends confirmation emails using **Resend API**.

### **🌍 API Endpoint**
```
POST https://tmmsoftware-resend.vercel.app/api/send-email
```

### **📍 Deployment**
- Hosted on **Vercel** (`https://tmmsoftware-resend.vercel.app/`)
- Secured with **CORS restrictions** (Only accepts requests from `https://tmmsoftware.github.io`)

---

## **🛠️ Request Details**
### **📥 Request Method:**
```http
POST /api/send-email
```

### **🔹 Headers:**
```json
{
  "Content-Type": "application/json"
}
```

### **📤 Request Body (JSON):**
```json
{
  "email": "user@example.com",
  "tosAccepted": true
}
```

### **🔍 Parameter Explanation:**
| Parameter   | Type    | Required | Description |
|------------|--------|----------|-------------|
| `email`    | string | ✅ Yes   | The email address of the user signing up. |
| `tosAccepted` | boolean | ✅ Yes   | Must be `true` to indicate agreement to Terms of Service. |

---

## **📝 Response Details**
### **✅ Success Response (200 OK):**
```json
{
  "message": "Email sent successfully!",
  "data": { ... }
}
```

### **⚠️ Error Responses:**
| Status Code | Message | Cause |
|------------|--------------------------------|----------------|
| `400` Bad Request | `{ "error": "Email is required" }` | Missing email field |
| `400` Bad Request | `{ "error": "You must accept the Terms of Service." }` | `tosAccepted` is `false` |
| `405` Method Not Allowed | `{ "error": "Method Not Allowed" }` | Request method is not `POST` |
| `500` Internal Server Error | `{ "error": "Failed to send email" }` | API failure (invalid key, service down, etc.) |

---

## **🔒 Security Measures**
- **CORS Restrictions:** Only allows requests from `https://tmmsoftware.github.io`.
- **API Key Protection:** Uses environment variables (`process.env.RESEND_API_KEY`).

---

## **🚀 Next Steps**
📌 Implement API rate limiting for added security.
📌 Improve logging for better debugging.


