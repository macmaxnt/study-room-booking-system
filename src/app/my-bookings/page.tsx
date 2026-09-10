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

  const { data: myBookingsData, error: myBookingsError } = await supabase
    .from('bookings')
    .select('*, rooms(*)')
    .eq('user_id', user.id)
    .order('booking_date', { ascending: true });

  const { data: roomsData } = await supabase
    .from('rooms')
    .select('*')
    .order('name');

  const { data: allBookingsData } = await supabase
    .from('bookings')
    .select('*');

  const myBookings: Booking[] = myBookingsData || [];
  const allRooms: Room[] = roomsData || [];
  const allBookings: Booking[] = allBookingsData || [];

  return (
    <div className=\"min-h-screen\">
      <Navbar userEmail={user.email} />

      <main className=\"mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8\">
        {myBookingsError && (
          <div className=\"mb-6 rounded-2xl bg-red-100 p-4 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]\">
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
