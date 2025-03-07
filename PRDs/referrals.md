# Product Requirements Document (PRD): Referrals Function for Stock Newsletters Website
https://chatgpt.com/c/67c406c7-970c-8002-b6dc-ea0877766c93

## 1. Overview
The referral function will allow users to invite friends to subscribe to stock newsletters. Users can enter their friends’ email addresses, and if a friend signs up, the referring user earns points. The referred user may also earn points as an incentive. The system will ensure that points are awarded only for unique referrals and will maintain a database of referrals for tracking.

## 2. Objectives
- Increase user growth by leveraging word-of-mouth marketing.
- Provide an incentive for users to invite friends.
- Prevent fraudulent referrals by ensuring points are awarded only for first-time sign-ups.

## 3. User Stories
### **Referrer (Existing User)**
- As a user, I want to refer friends by entering their email addresses on the site.
- As a user, I want to track the status of my referrals (pending, signed up, etc.).
- As a user, I want to earn points when my referrals successfully sign up.

### **Referee (New User)**
- As a new user, I want to sign up via a referral link or email invitation.
- As a new user, I want to earn points (if applicable) for signing up via a referral.

### **Admin**
- As an admin, I want to monitor referral activity to prevent abuse.
- As an admin, I want to view reports on referral conversions and user engagement.

## 4. Functional Requirements
### **Referral Submission**
- A logged-in user can input multiple email addresses to invite friends.
- The system sends an invitation email with a unique referral link for each invitee.
- The referral link is tied to the referrer’s user ID.

### **Referral Tracking & Validation**
- A new user who signs up via a referral link is recorded in the referral collection.
- If the email address is already in the database, no points are awarded to prevent duplicate referrals.
- Points are awarded to the referrer upon successful signup.
- If applicable, the referee also earns points.
- If a user signs up without using a referral link, no referral is recorded.

### **Database Schema (MongoDB)**
#### **Referrals Collection**
```json
{
  "_id": ObjectId,
  "referrerId": ObjectId,  // User who sent the invite
  "refereeEmail": String,  // Email address of invitee
  "refereeId": ObjectId,  // ID of new user (null if not signed up yet)
  "status": String,  // 'pending', 'signed_up', 'invalid'
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```
#### **Users Collection (Updated)**
```json
{
  "_id": ObjectId,
  "email": String,
  "referralPoints": Number,
  "referredBy": ObjectId // ID of the user who referred them (if any)
}
```

### **Points System**
- X points for each successful referral (configurable in admin settings).
- Y points (optional) for the referee upon signup.
- Users can track their referral points on their dashboard.

## 5. Non-Functional Requirements
- The system must prevent duplicate referrals using email validation.
- The referral link must expire after a configurable period.
- The invitation email should comply with email marketing best practices.

## 6. Technical Considerations
- Store referrals in MongoDB to track unique sign-ups.
- Implement email validation to prevent duplicate invites to the same user.
- Use a background job (e.g., BullMQ) to send referral emails asynchronously.
- Ensure referral links are signed and secure to prevent tampering.

## 7. Edge Cases
- A user enters the same email multiple times: The system should prevent duplicate invites.
- A referred user signs up with a different email: No referral should be recorded.
- A referred user already has an account: No points awarded.
- A user abuses the system with fake email addresses: Implement fraud detection and manual review.

## 8. Open Questions
- Should referrals expire if the invitee doesn’t sign up within a certain time?
- Should there be a leaderboard or gamification for top referrers?
- Should users be able to track individual referral statuses (e.g., invite sent, signed up, etc.)?

## 9. Next Steps
1. Finalize points structure and incentives.
2. Design referral UI/UX.
3. Implement referral tracking and email system.
4. Deploy and monitor referral activity.

