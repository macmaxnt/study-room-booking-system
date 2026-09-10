# UniStudy Room - ระบบจองห้องอ่านหนังสือ (Study Room Booking System)

เว็บแอปพลิเคชันสำหรับจองห้องอ่านหนังสือและห้องค้นคว้าของมหาวิทยาลัย พัฒนาด้วย Next.js App Router, Supabase (PostgreSQL + Auth + RLS), Tailwind CSS และ Deploy บน Vercel

---

## 🌐 Production & Repository Links
- **Vercel Production URL**: [https://temporary-flying-tempest-nk5qawe.vercel.app](https://temporary-flying-tempest-nk5qawe.vercel.app)
- **GitHub Repository**: [https://github.com/macmaxnt/study-room-booking-system](https://github.com/macmaxnt/study-room-booking-system)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 15+ (App Router), TypeScript, Tailwind CSS, Lucide React
- **Backend & Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (Email / Password)
- **Security**: Row Level Security (RLS) & PostgreSQL Constraints
- **Deployment**: Vercel

---

## 📋 Features (ฟังก์ชันการทำงาน)

1. **Authentication & Route Guard**:
   - สมัครสมาชิก (Sign Up) และเข้าสู่ระบบ (Sign In) ด้วย Email/Password
   - มี Middleware ป้องกันผู้ที่ยังไม่ล็อกอินไม่ให้เข้าหน้า `/bookings` และ `/my-bookings` (Redirect ไป `/login`)
2. **Room & Slot Availability**:
   - อ่านข้อมูลห้องอ่านหนังสือจากตาราง `rooms` ใน Supabase (ไม่ใช่ hard-coded array)
   - เลือกดูรอบเวลาว่าง/ไม่ว่างตามวันที่เลือกแบบ Interactive
3. **Booking Management**:
   - สร้างการจองห้อง ระบุวันที่ รอบเวลา และวัตถุประสงค์
   - มี **Database Unique Constraint** ป้องกันการจองห้องเดียวกัน วันเดียวกัน รอบเวลาเดียวกันซ้ำ
4. **User Authorization & My Bookings**:
   - ตรวจสอบและจัดการรายการจองของตนเองที่หน้า `/my-bookings`
   - แก้ไขรอบเวลา/วัตถุประสงค์ หรือยกเลิกการจองได้เฉพาะรายการของตนเอง (ควบคุมด้วย Supabase RLS)
5. **Robust UX & Error Handling**:
   - รองรับสถานะ Loading, Empty State, Form Validation
   - แปลง Database Error เป็นข้อความภาษาไทยที่เข้าใจง่าย

---

## 🗄️ Database Schema & RLS Policies

ดูรายละเอียดคำสั่ง SQL และความสัมพันธ์ของตารางทั้งหมดได้ที่ [`supabase_schema.sql`](./supabase_schema.sql)

- **`rooms`**: ข้อมูลห้อง (`id`, `name`, `capacity`, `location`, `description`)
- **`bookings`**: รายการจองห้อง (`id`, `room_id`, `user_id`, `booking_date`, `time_slot`, `purpose`)
- **Unique Constraint**: `UNIQUE (room_id, booking_date, time_slot)` ป้องกันการจองชนกันที่ระดับ Database
- **RLS Policies**: บังคับให้อ่านตารางห้อง/จองได้ แต่แก้ไข/ลบได้เฉพาะ `auth.uid() = user_id`

---

## 🧪 Acceptance Tests Matrix (12 เกณฑ์ตรวจ)

| ข้อ | เกณฑ์ Acceptance Test | สถานะ |
|---|---|---|
| 01 | สมัครและเข้าสู่ระบบด้วย email/password ได้ | ✅ ผ่าน |
| 02 | ผู้ที่ยังไม่เข้าสู่ระบบถูกนำไปหน้า login | ✅ ผ่าน (Middleware Guard ส่ง Status 307 Redirect) |
| 03 | ห้องถูกอ่านจาก Supabase ไม่ใช่ hard-coded array | ✅ ผ่าน (Query จากตาราง `rooms` ใน Supabase) |
| 04 | สร้าง booking แล้วข้อมูลยังอยู่หลัง refresh | ✅ ผ่าน (Persist ใน PostgreSQL) |
| 05 | แก้ไขและลบ booking ของตนเองได้ | ✅ ผ่าน (Server Actions + RLS) |
| 06 | ผู้ใช้คนที่สองแก้ไข booking ของผู้ใช้คนแรกไม่ได้ | ✅ ผ่าน (RLS Policy UPDATE/DELETE) |
| 07 | room/date/slot ซ้ำถูก database ปฏิเสธ | ✅ ผ่าน (Unique Constraint `unique_room_date_slot`) |
| 08 | ฟอร์มที่ข้อมูลไม่ครบถูกปฏิเสธ | ✅ ผ่าน (Zod Schema Validation) |
| 09 | Database error ถูกแปลงเป็นข้อความที่ผู้ใช้เข้าใจได้ | ✅ ผ่าน (ดัก error code 23505) |
| 10 | Repository ไม่มี secret หรือ service-role key | ✅ ผ่าน (ใช้เฉพาะ anon key) |
| 11 | Production URL ทำงานโดยไม่พึ่ง localhost | ✅ ผ่าน (Deploy บน Vercel ใช้งานได้จริง) |
| 12 | Login callback และ environment variables ทำงานบน Vercel | ✅ ผ่าน |
