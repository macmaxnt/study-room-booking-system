-- ===================================================
-- 1. Create Tables
-- ===================================================

-- ตารางรายชื่อห้องอ่านหนังสือ
CREATE TABLE IF NOT EXISTS public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    capacity INT4 NOT NULL CHECK (capacity > 0),
    location TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ตารางการจองห้อง
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    booking_date DATE NOT NULL,
    time_slot TEXT NOT NULL CHECK (time_slot IN ('09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00')),
    purpose TEXT NOT NULL CHECK (char_length(trim(purpose)) >= 3),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- Constraint ป้องกันการจองห้องเดียวกัน วันเดียวกัน รอบเดียวกันซ้ำ (Requirement 07)
    CONSTRAINT unique_room_date_slot UNIQUE (room_id, booking_date, time_slot)
);

-- Indexes เพื่อเพิ่มประสิทธิภาพในการ Query
CREATE INDEX IF NOT EXISTS idx_bookings_date_room ON public.bookings(booking_date, room_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON public.bookings(user_id);

-- ===================================================
-- 2. Row Level Security (RLS)
-- ===================================================

-- เปิด RLS
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- นโยบายสำหรับตาราง rooms
-- ทุกคนที่ authenticate หรือ anon สามารถอ่านรายชื่อห้องได้ (Requirement 03)
DROP POLICY IF EXISTS "Allow read access to rooms" ON public.rooms;
CREATE POLICY "Allow read access to rooms"
ON public.rooms FOR SELECT
TO authenticated, anon
USING (true);

-- นโยบายสำหรับตาราง bookings
-- 1. ผู้ใช้ที่ล็อกอินแล้ว อ่านการจองทั้งหมดได้ เพื่อดูช่วงเวลาที่ไม่ว่าง (Requirement 04)
DROP POLICY IF EXISTS "Allow authenticated users to view all bookings" ON public.bookings;
CREATE POLICY "Allow authenticated users to view all bookings"
ON public.bookings FOR SELECT
TO authenticated
USING (true);

-- 2. ผู้ใช้สร้างการจองได้เฉพาะของตนเอง (Requirement 05)
DROP POLICY IF EXISTS "Allow users to insert own bookings" ON public.bookings;
CREATE POLICY "Allow users to insert own bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. ผู้ใช้แก้ไขได้เฉพาะการจองของตนเอง (Requirement 05 & 06)
DROP POLICY IF EXISTS "Allow users to update own bookings" ON public.bookings;
CREATE POLICY "Allow users to update own bookings"
ON public.bookings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 4. ผู้ใช้ลบ/ยกเลิกได้เฉพาะการจองของตนเอง (Requirement 05 & 06)
DROP POLICY IF EXISTS "Allow users to delete own bookings" ON public.bookings;
CREATE POLICY "Allow users to delete own bookings"
ON public.bookings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ===================================================
-- 3. Seed Sample Rooms (ข้อมูลเริ่มต้น)
-- ===================================================

INSERT INTO public.rooms (name, capacity, location, description)
VALUES
    ('ห้องค้นคว้ากลุ่ม 101 (Quiet Study)', 4, 'อาคารวิทยบริการ ชั้น 1', 'มีปลั๊กไฟทุกที่นั่ง, กระดานไวท์บอร์ด, เครื่องปรับอากาศ'),
    ('ห้องสัมมนาวิชาการ 201 (Smart Room)', 8, 'อาคารวิทยบริการ ชั้น 2', 'Smart TV 55 นิ้ว สำหรับ Presentation, สาย HDMI, ไวท์บอร์ด'),
    ('ห้องโฟกัสรูม A (Focus Pod A)', 2, 'อาคารวิทยบริการ ชั้น 2', 'ห้องเก็บเสียงส่วนตัว เหมาะสำหรับติวเข้ม 2 คน'),
    ('ห้องโฟกัสรูม B (Focus Pod B)', 2, 'อาคารวิทยบริการ ชั้น 2', 'ห้องเก็บเสียงส่วนตัว เหมาะสำหรับติวเข้ม 2 คน'),
    ('ห้องนวัตกรรมและเทคโนโลยี 301', 12, 'อาคารวิทยบริการ ชั้น 3', 'จอ Interactive Touchscreen, ไมโครโฟนประชุม, ไวท์บอร์ดกระจก')
ON CONFLICT (name) DO NOTHING;
