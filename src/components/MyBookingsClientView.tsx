'use client';

import { useState } from 'react';
import { Booking, Room } from '@/types/database';
import { deleteBookingAction } from '@/app/actions';
import { EditBookingModal } from './EditBookingModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  AlertCircle,
  FileText,
  Loader2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface MyBookingsClientViewProps {
  myBookings: Booking[];
  allRooms: Room[];
  allBookings: Booking[];
}

export function MyBookingsClientView({
  myBookings,
  allRooms,
  allBookings,
}: MyBookingsClientViewProps) {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองห้องนี้? 🥺')) {
      return;
    }

    setDeletingId(id);
    setErrorMsg(null);

    const res = await deleteBookingAction(id);
    setDeletingId(null);

    if (res?.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
            รายการจองของฉัน 📋✨
          </h1>
          <p className="text-sm font-bold text-slate-600 mt-1">
            คุณสามารถแก้ไขข้อมูลรอบเวลา วัตถุประสงค์ หรือยกเลิกการจองได้จากหน้านี้เลย
          </p>
        </div>

        <Link
          href="/bookings"
          className="cute-btn-primary px-5 py-3 text-xs flex items-center gap-2 w-fit cursor-pointer"
        >
          <BookOpen className="h-4 w-4" />
          จองห้องเพิ่ม 🚀
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2.5 rounded-2xl bg-red-100 p-4 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5 text-red-600" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Empty State */}
      {myBookings.length === 0 ? (
        <div className="cute-card p-14 text-center bg-white">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-yellow-300 text-slate-900 border-[3px] border-slate-900 shadow-[4px_4px_0px_#1E293B] mb-4">
            <Calendar className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            ยังไม่มีรายการจองห้องเลยน้าา 🍃
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-500 max-w-sm mx-auto">
            เลือกห้องและช่วงเวลาที่ต้องการใช้งาน เพื่อเริ่มต้นจองห้องอ่านหนังสือได้เลย!
          </p>
          <div className="mt-6">
            <Link
              href="/bookings"
              className="cute-btn-accent px-6 py-3 text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              ไปที่หน้าตารางห้อง 🚀
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myBookings.map((b) => {
            const room = b.rooms || allRooms.find((r) => r.id === b.room_id);
            const isDeleting = deletingId === b.id;

            return (
              <div
                key={b.id}
                className="cute-card p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="cute-badge bg-indigo-100 text-indigo-900 px-3 py-1 text-[11px] mb-2 inline-block">
                        ID: {b.id.slice(0, 8)}
                      </span>
                      <h3 className="text-xl font-black text-slate-900">
                        {room?.name || 'ห้องอ่านหนังสือ'}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs font-bold pt-1">
                    <div className="flex items-center gap-2 rounded-2xl bg-amber-50 p-3 border-[2px] border-slate-900">
                      <Calendar className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>{b.booking_date}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl bg-indigo-50 p-3 border-[2px] border-slate-900">
                      <Clock className="h-4 w-4 text-indigo-600 shrink-0" />
                      <span className="text-indigo-900 font-black">
                        {b.time_slot}
                      </span>
                    </div>
                  </div>

                  {room && (
                    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-indigo-600" />
                        {room.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                        ความจุ {room.capacity} คน
                      </span>
                    </div>
                  )}

                  <div className="rounded-2xl bg-yellow-50/80 p-3.5 border-[2px] border-slate-900 text-xs">
                    <div className="flex items-center gap-1.5 font-black text-slate-800 mb-1">
                      <FileText className="h-4 w-4 text-indigo-600" />
                      วัตถุประสงค์:
                    </div>
                    <p className="text-slate-700 font-bold pl-5">
                      {b.purpose}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t-[2.5px] border-slate-900/20">
                  <button
                    onClick={() => setEditingBooking(b)}
                    disabled={isDeleting}
                    className="cute-btn-accent px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    แก้ไข ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={isDeleting}
                    className="cute-btn-danger px-4 py-2 text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    ยกเลิก ❌
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Modal */}
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          rooms={allRooms}
          existingBookings={allBookings}
          onClose={() => setEditingBooking(null)}
        />
      )}
    </div>
  );
}
