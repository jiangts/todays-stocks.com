# Product Requirements Document (PRD)
https://chatgpt.com/c/67c6a5bc-2638-8002-9852-e3c4688b57f5
https://docs.svix.com/receiving/verifying-payloads/how

## Webhook Verification System with Nonce and TTL

### 1. Overview
The **Webhook Verification System** ensures secure communication between a webhook issuer and a client verifier by using a **nonce-based** mechanism with a **time-to-live (TTL)**. This prevents replay attacks and ensures the authenticity of incoming webhook requests.

### 2. Goals
- Securely verify that webhooks originate from a trusted source.
- Prevent replay attacks by enforcing TTL and nonce uniqueness.
- Ensure a simple yet effective verification mechanism for clients.

### 3. Components
1. **Token Issuer (Webhook Sender)** - Generates a signed token containing a nonce and TTL.
2. **Client Verifier (Webhook Receiver)** - Validates the token upon receiving a webhook request.

---

## 4. System Design
### 4.1 Token Issuer (Webhook Sender)
The webhook sender is responsible for generating a verification token that is attached to each webhook request.

#### **Token Structure:**
```json
{
  "nonce": "random-string",
  "ttl": 1715025600,
  "signature": "HMAC-SHA256(nonce + ttl + secret)"
}
```

#### **Steps to Generate Token:**
1. **Generate a nonce**: A cryptographically secure random string.
2. **Set TTL**: The expiration timestamp (current time + validity period, e.g., 5 minutes).
3. **Sign the payload**: Use HMAC-SHA256 with a shared secret key to generate a signature.
4. **Attach the token** to the webhook request as a header (e.g., `X-Webhook-Signature`).

#### **Example Header:**
```
X-Webhook-Signature: {"nonce": "abc123", "ttl": 1715025600, "signature": "abcdef123456"}
```

---

### 4.2 Client Verifier (Webhook Receiver)
The webhook receiver must validate the token before processing the request.

#### **Validation Steps:**
1. **Extract token** from the request header (`X-Webhook-Signature`).
2. **Check TTL**: Ensure the TTL has not expired (`ttl > current_time`).
3. **Verify nonce uniqueness**: Ensure the nonce has not been seen before (use an in-memory cache or database).
4. **Recompute the signature**: Validate it against the provided `signature` using the shared secret key.
5. **Reject request** if any validation step fails.

#### **Example Verification Logic (Node.js)**
```typescript
import crypto from 'crypto';
import { Request, Response } from 'express';

const SECRET_KEY = process.env.WEBHOOK_SECRET;
const nonceStore = new Set<string>();

function verifyWebhook(req: Request, res: Response) {
  const signatureHeader = req.headers['x-webhook-signature'];
  if (!signatureHeader) return res.status(400).send('Missing signature');

  const { nonce, ttl, signature } = JSON.parse(signatureHeader);
  const currentTime = Math.floor(Date.now() / 1000);

  if (currentTime > ttl) return res.status(403).send('Expired token');
  if (nonceStore.has(nonce)) return res.status(403).send('Replay attack detected');

  const computedSignature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(nonce + ttl)
    .digest('hex');

  if (computedSignature !== signature) return res.status(403).send('Invalid signature');

  nonceStore.add(nonce);
  setTimeout(() => nonceStore.delete(nonce), (ttl - currentTime) * 1000);

  res.status(200).send('Webhook verified');
}
```

---

## 5. Security Considerations
- **Nonce Storage**: Use a time-limited cache (e.g., Redis) instead of in-memory storage for high-availability systems.
- **TTL Enforcement**: Set a reasonable expiration time (e.g., 5 minutes) to balance security and request delays.
- **Secret Key Rotation**: Implement periodic secret key rotation to enhance security.
- **Rate Limiting**: Prevent brute-force signature attacks by rate limiting webhook requests.

---

## 6. Performance Considerations
- Using an **in-memory cache** (e.g., Redis) reduces latency for nonce lookups.
- Avoid **excessive TTL values** to minimize storage requirements for nonce tracking.
- Implement **asynchronous signature verification** if processing high volumes of webhooks.

---

## 7. Future Enhancements
- **Support for asymmetric cryptography** (e.g., RSA signatures) for better security.
- **Integration with OAuth 2.0** to enhance authentication mechanisms.
- **Webhook replay protection using a distributed ledger** to track nonces more efficiently.

---

## 8. Conclusion
This **Webhook Verification System** ensures that only authorized webhook requests are processed, mitigating replay attacks and unauthorized access. By implementing nonce validation, TTL enforcement, and cryptographic signing, this system adds a robust security layer to webhook-based integrations.

