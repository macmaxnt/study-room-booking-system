import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { MyBookingsClientView } from '@/components/MyBookingsClientView';
import { Room, Booking } from '@/types/database';

export const revalidate = 0; // Dynamic data

export default async function MyBookingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 1. Fetch user's bookings with room details
  const { data: myBookingsData, error: myBookingsError } = await supabase
    .from('bookings')
    .select('*, rooms(*)')
    .eq('user_id', user.id)
    .order('booking_date', { ascending: true });

  // 2. Fetch all rooms
  const { data: roomsData } = await supabase
    .from('rooms')
    .select('*')
    .order('name');

  // 3. Fetch all bookings for conflict check during edit
  const { data: allBookingsData } = await supabase
    .from('bookings')
    .select('*');

  const myBookings: Booking[] = myBookingsData || [];
  const allRooms: Room[] = roomsData || [];
  const allBookings: Booking[] = allBookingsData || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar userEmail={user.email} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {myBookingsError && (
          <div className="mb-6 rounded-2xl bg-red-50 dark:bg-red-950/50 p-4 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            เกิดข้อผิดพลาดในการโหลดรายการจอง: {myBookingsError.message}
          </div>
        )}

        <MyBookingsClientView
          myBookings={myBookings}
          allRooms={allRooms}
          allBookings={allBookings}
        />
      </main>
    </div>
  );
}
