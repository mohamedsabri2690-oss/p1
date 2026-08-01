# نظام إدارة صيانة المكيفات / Aircon Maintenance Management

هذا المستودع يحتوي على بنية مشروع mono-repo لتطبيق ويب وتطبيق موبايل وAPI للخدمة الخلفية.
اللغات: العربية والإنجليزية (واجهة ثنائية).

مكونات المشروع:
- apps/web — واجهة الويب (React + Vite)
- apps/mobile — تطبيق موبايل (Expo + React Native)
- apps/api — باك-إند (Node.js + Express)
- packages/common — حزمة مشتركة (types/util)
- db/schema.sql — مخطط قاعدة بيانات مبدئي

تشغيل محلي (مبدئي):
1. ثبت dependencies: في جذر المستودع
   - استخدم pnpm أو npm/yarn: e.g., pnpm install
2. شغل الخادم API:
   - cd apps/api
   - npm install
   - cp .env.example .env وتعديل القيم
   - npm run dev
3. شغل الويب:
   - cd apps/web
   - npm install
   - npm run dev
4. شغل الموبايل (Expo):
   - cd apps/mobile
   - npm install
   - npm start

ماذا بعد؟
- سأبني نقاط النهاية الأساسية (Auth, CRUD للتذاكر/العملاء/الأجهزة) ونماذج واجهة بسيطة.
- أضف CI/CD (GitHub Actions) ونشر إذا رغبت بذلك.

---

# Aircon Maintenance Management

This repository contains a mono-repo scaffold for web (React), mobile (Expo) and API (Node/Express).

Components:
- apps/web — React + Vite
- apps/mobile — Expo + React Native
- apps/api — Node.js + Express
- packages/common — shared types/util
- db/schema.sql — initial DB schema

Quick start (local):
1. Install dependencies with pnpm or npm/yarn
2. Start API
   - cd apps/api
   - npm install
   - cp .env.example .env and update
   - npm run dev
3. Start web
   - cd apps/web
   - npm install
   - npm run dev
4. Start mobile (Expo)
   - cd apps/mobile
   - npm install
   - npm start

Next steps:
- Implement API endpoints (Auth, Tickets, Customers, Devices)
- Add i18n, CI/CD and deployment
