import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { BookingClientView } from '@/components/BookingClientView';
import { Room, Booking } from '@/types/database';

export const revalidate = 0; // Always dynamic

export default async function BookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch all active rooms
  const { data: roomsData, error: roomsError } = await supabase
    .from('rooms')
    .select('*')
    .order('name');

  // Fetch all bookings to determine booked slots
  const { data: bookingsData, error: bookingsError } = await supabase
    .from('bookings')
    .select('*');

  const rooms: Room[] = roomsData || [];
  const bookings: Booking[] = bookingsData || [];

  return (
    <div className=\"min-h-screen\">
      <Navbar userEmail={user.email} />

      <main className=\"mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8\">
        {roomsError && (
          <div className=\"mb-6 rounded-2xl bg-red-100 p-4 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]\">
            เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง: {roomsError.message}
          </div>
        )}

        {bookingsError && (
          <div className=\"mb-6 rounded-2xl bg-red-100 p-4 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]\">
            เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง: {bookingsError.message}
          </div>
        )}

        <BookingClientView
          rooms={rooms}
          initialBookings={bookings}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
