# AI Worklog: Study Room Booking System (ระบบจองห้องอ่านหนังสือ)

บันทึกกระบวนการทำงานและ Prompt ทั้งหมดในการพัฒนาระบบร่วมกับ AI Agent ตามเกณฑ์ Workshop Requirement

---

## 1. Planning Prompt
```text
อ่านภาพ Capstone ระบบจองห้อง และ Workshop Requirement ทั้ง 5 หน้า
วิเคราะห์ Functional Requirements, Data & Security Requirements, Design Space และ Acceptance Tests ทั้ง 12 ข้อ
จัดทำ Implementation Plan ครอบคลุม Routes, Components, Database Schema, Constraints, RLS Policies และ Test Cases
```

### การดำเนินการในขั้นตอน Planning:
- อ่านภาพ Requirements และโจทย์ทั้ง 5 หน้าอย่างครบถ้วน
- สรุปสถาปัตยกรรม (Browser -> Next.js App Router -> Supabase Auth & Data API -> PostgreSQL)
- กำหนด Table Schema: `rooms` และ `bookings` พร้อม Constraint `UNIQUE(room_id, booking_date, time_slot)`
- วาง RLS Policies 4 ข้อหลัก (Select, Insert own, Update own, Delete own)
- สร้างไฟล์ `implementation_plan.md` เพื่อให้ผู้ใช้ตรวจสอบและอนุมัติก่อนลงมือเขียนโค้ด

---

## 2. Implementation Prompt
```text
เริ่มต้นสร้างโปรเจกต์ Next.js App Router (TypeScript + Tailwind CSS)
ติดตั้ง @supabase/supabase-js, @supabase/ssr, lucide-react, zod
สร้าง Supabase client สำหรับ browser, server และ middleware สำหรับ route protection
สร้าง Database Schema SQL พร้อม RLS และ Seed Data
สร้าง UI Components: Navbar, DateSelector, SlotGrid, BookingModal, EditBookingModal, MyBookingsClientView
สร้าง Server Actions พร้อม Zod Validation และการแปลง Database Error เป็นภาษาไทย
```

### การดำเนินการในขั้นตอน Implementation:
- สแคฟโฟลด์โปรเจกต์ Next.js 15+ App Router ด้วย TypeScript และ Tailwind CSS
- สร้างไฟล์ `supabase_schema.sql` พร้อมโครงสร้างตาราง, Unique Constraint และ RLS Policies
- พัฒนา Server Actions (`signInAction`, `signUpAction`, `signOutAction`, `createBookingAction`, `updateBookingAction`, `deleteBookingAction`) โดยอ่าน Session จาก Server-side เสมอ
- สร้าง Route Protection ด้วย `middleware.ts` ป้องกันผู้ที่ยังไม่ล็อกอินเข้าถึง `/bookings` และ `/my-bookings`
- สร้างหน้า `/login`, `/bookings`, `/my-bookings` พร้อม State ครบถ้วน (Loading, Empty, Validation, Error)

---

## 3. Debug Prompt
```text
รัน TypeScript Build เพื่อตรวจสอบ Type Safety และแก้ไข Type Overload หรือ Type Errors ที่เกิดขึ้น
```

### ปัญหาที่พบและการแก้ไข (Debug Log):
1. **TypeScript Type Mismatch ใน Zod Schema**:
   - *ปัญหา*: `z.enum` ใน Zod เวอร์ชันใหม่มีการเปลี่ยน signature ใน overload สำหรับ `errorMap`
   - *แก้ไข*: ปรับการประกาศ Zod Enum ให้เป็น message parameter มาตรฐาน `z.enum([...], { message: '...' })`
2. **Type Inference ของ ActionResult**:
   - *ปัญหา*: Property `success` และ `message` ไม่ถูก recognize ใน discriminated union ของ `page.tsx`
   - *แก้ไข*: ประกาศ Interface `ActionResult = { success?: boolean; message?: string; error?: string }` เพื่อให้ Type ปลอดภัยและชัดเจน 100%
3. **Build Verification**:
   - รัน Next.js Build ผ่านเรียบร้อย ทั้ง Static generation และ Dynamic routes (`/bookings`, `/my-bookings`, `/login`, `/auth/callback`)

---

## 4. Final Review Prompt
```text
ตรวจสอบโค้ดและความปลอดภัยทั้งหมดเทียบกับ 12 Acceptance Tests
ตรวจสอบว่าไม่มี Secret Key หรือ Service Role Key หลุดในโค้ด
จัดทำ README.md, supabase_schema.sql, และ Self-test Checklist สำหรับส่งงาน
```

### สรุปผลการตรวจสอบขั้นสุดท้าย:
- ตรวจสอบไฟล์ `.gitignore` และ source code ทั้งหมด: มีเฉพาะ `NEXT_PUBLIC_SUPABASE_URL` และ `NEXT_PUBLIC_SUPABASE_ANON_KEY` ปลอดภัย 100%
- สร้างไฟล์คู่มือ `README.md` และ `AI_WORKLOG.md` ครบถ้วนพร้อมส่งงาน
