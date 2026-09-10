import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { BookingClientView } from '@/components/BookingClientView';
import { Room, Booking } from '@/types/database';

export const revalidate = 0; // Dynamic data

export default async function BookingsPage() {
  const supabase = await createClient();

  // Auth Guard
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch rooms from Supabase (Requirement 03: ห้ามใช้ hardcoded array)
  const { data: roomsData, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .order('name');

  // 2. Fetch all bookings for availability status (Requirement 04)
  const { data: bookingsData, error: bookingsError } = await supabase
    .from('bookings')
    .select('*')
    .order('booking_date', { ascending: true });

  const rooms: Room[] = roomsData || [];
  const bookings: Booking[] = bookingsData || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar userEmail={user.email} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            จองห้องอ่านหนังสือและค้นคว้า
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            ระบบจองห้องอ่านหนังสือมหาวิทยาลัย — ตรวจสอบรอบเวลาที่ว่างและเลือกจองได้ทันที
          </p>
        </div>

        {roomsError && (
          <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-950/50 p-4 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง: {roomsError.message}
          </div>
        )}

        <BookingClientView
          rooms={rooms}
          bookings={bookings}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
