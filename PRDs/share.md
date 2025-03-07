# 📌 Product Requirements Document (PRD): Stock Analysis Page Sharing System
https://chatgpt.com/c/67c951e6-ffb8-8002-afca-f086cb34b228

## 📖 Overview

The **Stock Analysis Page Sharing System** enables authenticated users to share stock analysis pages with others via a secure, time-limited link. This feature is designed for marketing purposes, allowing potential users to preview high-quality stock insights while maintaining security and preventing abuse.

## 🎯 Objectives

1. Allow authenticated users to generate a shareable link for a stock analysis page.
2. Ensure links expire after a configurable period.
3. Prevent unauthorized access while maintaining ease of use.
4. Implement mechanisms to prevent abuse, such as excessive link generation.
5. Track engagement metrics for marketing insights.

---

## 🏗 System Design

### 🗄 Data Model: MongoDB Collection (`sharedLinks`)

Each shared page is stored in a `sharedLinks` collection with the following fields:

```json
{
  "_id": ObjectId(),
  "userId": ObjectId(),          // Reference to the authenticated user
  "route": String,               // Path of the shared resource
  "token": String,               // Unique access token
  "expiresAt": ISODate(),        // Expiration timestamp
  "accessCount": Number,         // Number of times accessed
  "maxAccess": Number,           // Max allowed accesses before expiration
  "createdAt": ISODate(),        // Creation timestamp
  "status": "active" | "expired" | "revoked"  // Current status
}
```

### 🔗 API Endpoints

#### **1️⃣ Generate Shareable Link**

**`POST /api/shared-links`**

- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "pageId": "<PAGE_ID>",
    "route": "<ROUTE>",    // The path being shared
    "expiresIn": 86400,      // Expiry in seconds (optional, default: 24h)
    "maxAccess": 100         // Maximum access limit (optional, default: 50)
  }
  ```
- **Response:**
  ```json
  {
    "shareUrl": "https://app.example.com/share/<TOKEN>"
  }
  ```

#### **2️⃣ Access Shared Page**

**`GET /api/shared-links/:token`**

- **Middleware Authentication:**
  - Extract token from request.
  - Validate token against `sharedLinks` collection.
  - Verify if the token is associated with the requested route.
  - Check if the token is still active (not expired or revoked).
  - Validate the access count limit.
  - If valid, allow request to proceed to the shared resource.

- **Response:**
  ```json
  {
    "pageId": "<PAGE_ID>",
    "content": "<STOCK_ANALYSIS_CONTENT>"
  }
  ```

#### **3️⃣ Revoke Shared Link**

**`DELETE /api/shared-links/:token`**

- **Authentication:** Required (must be the owner of the link)
- **Response:**
  ```json
  { "message": "Share link revoked successfully." }
  ```

---

## 🔐 Security & Abuse Prevention

### **1. Middleware-based Token Authentication**
- Implement a middleware that:
  - Checks if the token is associated with the requested path.
  - Ensures token validity before granting access.
  - Logs requests to detect unusual activity.

### **2. Rate Limits**
- Limit users to **5 active share links** at a time.
- Restrict **maximum 10 new share links per day per user**.

### **3. IP & Device Tracking**
- Monitor suspicious access patterns (e.g., multiple IPs in a short time).
- Optionally restrict access to one IP per token.

### **4. Audit Logs**
- Log share creation, accesses, and revocations for security monitoring.

---

## 📊 Engagement & Marketing Metrics

### **1. Tracking Page Engagement**
- Store `accessCount` for each shared page.
- Capture visitor metadata (e.g., country, referrer, device).
- Send events to an analytics tool (e.g., Google Analytics, Mixpanel).

### **2. Conversion Opportunities**
- Show a call-to-action (CTA) on the shared page:
  - **Sign up for full access** CTA after a few views.
  - **Limited preview** (blur content after a threshold number of visits).

---

## 🚀 Future Enhancements

- **Custom Expiration Settings:** Allow premium users to set longer expiration times.
- **Password-Protected Links:** Let users add a password before access.
- **Domain Whitelisting:** Restrict access to shared pages from specific domains.
- **Personalized Tracking:** Track who accessed a link (if shared with multiple people).

---

## 🏁 Conclusion

This system ensures a controlled, secure, and marketing-friendly way for users to share stock analysis pages while preventing abuse and gathering valuable engagement data. By enforcing security measures and tracking interactions, it helps convert engaged viewers into paying users.

