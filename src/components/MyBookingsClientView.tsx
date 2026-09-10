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
    if (!window.confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองห้องนี้?')) {
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            รายการจองห้องของฉัน
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            คุณสามารถแก้ไขข้อมูลรอบเวลา วัตถุประสงค์ หรือยกเลิกการจองได้จากหน้านี้
          </p>
        </div>

        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors w-fit"
        >
          <BookOpen className="h-4 w-4" />
          จองห้องเพิ่ม
        </Link>
      </div>

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/50 p-3.5 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Empty State (Requirement 09) */}
      {myBookings.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white dark:bg-slate-900 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
            <Calendar className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800 dark:text-slate-200">
            คุณยังไม่มีรายการจองห้อง
          </h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            เลือกห้องและช่วงเวลาที่ต้องการใช้งาน เพื่อเริ่มต้นจองห้องอ่านหนังสือ
          </p>
          <div className="mt-5">
            <Link
              href="/bookings"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              ไปที่หน้าตารางห้อง
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myBookings.map((b) => {
            const room = b.rooms || allRooms.find((r) => r.id === b.room_id);
            const isDeleting = deletingId === b.id;

            return (
              <div
                key={b.id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block rounded-md bg-blue-50 dark:bg-blue-950 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:text-blue-400 mb-1">
                        รหัสการจอง: {b.id.slice(0, 8)}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {room?.name || 'ห้องอ่านหนังสือ'}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-800">
                      <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                      <span>{b.booking_date}</span>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-2 border border-slate-100 dark:border-slate-800">
                      <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="font-semibold text-blue-700 dark:text-blue-400">
                        {b.time_slot}
                      </span>
                    </div>
                  </div>

                  {room && (
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {room.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        จุ {room.capacity} คน
                      </span>
                    </div>
                  )}

                  <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 p-3 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      วัตถุประสงค์:
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 pl-5">
                      {b.purpose}
                    </p>
                  </div>
                </div>

                {/* Actions: Edit & Delete (Requirement 05 & 06) */}
                <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setEditingBooking(b)}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm"
                  >
                    <Edit2 className="h-3.5 w-3.5 text-amber-500" />
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 transition-colors"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    )}
                    ยกเลิกการจอง
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
