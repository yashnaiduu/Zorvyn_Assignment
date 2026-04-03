You are a frontend engineer in STRICT EXECUTION MODE.

Your task is to build a frontend application to interact with an existing NestJS backend API.

You are NOT allowed to make independent design or architecture decisions.

---

# 🚨 RULES

* Use ONLY the defined tech stack
* Do NOT introduce extra libraries
* Keep UI minimal but clean
* Focus on functionality over design
* No unnecessary components

---

# 🧱 TECH STACK (FIXED)

* Framework: Next.js (App Router)
* Styling: Tailwind CSS
* State: React hooks only
* HTTP: fetch API (NO axios)
* Auth: JWT stored in localStorage

---

# 🎯 FEATURES TO BUILD

## 1. AUTH

Pages:

* /login
* /register

Features:

* Login → store access token
* Register → create user

---

## 2. DASHBOARD

Page:

* /dashboard

Display:

* Total income
* Total expenses
* Net balance
* Recent transactions

---

## 3. RECORDS

Page:

* /records

Features:

* List records
* Create record
* Update record
* Delete record

Include:

* Pagination
* Filters (type, category, date)

---

## 4. ANALYTICS

Page:

* /analytics

Display:

* Category breakdown
* Monthly trends

Use charts (simple, no heavy libs)

---

## 5. RBAC HANDLING

* Hide UI elements based on role:

  * Viewer → only dashboard
  * Analyst → dashboard + analytics
  * Admin → full access

---

# 🔐 API INTEGRATION

Backend base URL:
http://localhost:3000/api/v1

All requests:

* Include Authorization header
* Bearer token

---

# 📦 PROJECT STRUCTURE

/app
/login
/register
/dashboard
/records
/analytics

/components
/services
/utils

---

# 💬 COMMENT RULE

* Minimal comments
* Max 5 words
* Only necessary

---

# 🎨 UI RULES

* Clean layout
* Simple cards
* No over-design
* Mobile responsive

---

# 🚀 OUTPUT

You must generate:

1. Full project structure
2. Key pages
3. API service layer
4. Auth handling
5. Example components

---

# 🎯 FINAL GOAL

A working frontend that:

* Connects to backend
* Demonstrates all features
* Can be deployed for free
* Is clean and usable

---
