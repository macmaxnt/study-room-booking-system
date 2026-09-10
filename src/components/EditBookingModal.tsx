'use client';

import { useState } from 'react';
import { Booking, Room, TimeSlot, TIME_SLOTS } from '@/types/database';
import { updateBookingAction } from '@/app/actions';
import { Calendar, Clock, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface EditBookingModalProps {
  booking: Booking;
  rooms: Room[];
  existingBookings: Booking[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function EditBookingModal({
  booking,
  rooms,
  existingBookings,
  onClose,
  onSuccess,
}: EditBookingModalProps) {
  const [roomId, setRoomId] = useState(booking.room_id);
  const [date, setDate] = useState(booking.booking_date);
  const [slot, setSlot] = useState<TimeSlot>(booking.time_slot);
  const [purpose, setPurpose] = useState(booking.purpose);

  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // หา slots ที่ถูกจองไปแล้วในห้องและวันที่เลือก (ยกเว้นการจองของตนเองอันนี้)
  const bookedSlots = existingBookings
    .filter(
      (b) =>
        b.room_id === roomId &&
        b.booking_date === date &&
        b.id !== booking.id
    )
    .map((b) => b.time_slot);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('id', booking.id);
    formData.append('room_id', roomId);
    formData.append('booking_date', date);
    formData.append('time_slot', slot);
    formData.append('purpose', purpose);

    const res = await updateBookingAction(null, formData);

    setIsPending(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.success) {
      setSuccessMsg(res.message || 'แก้ไขข้อมูลสำเร็จ!');
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <span className="inline-block rounded-full bg-amber-100 dark:bg-amber-950 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
            แก้ไขการจอง
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            แก้ไขข้อมูลการจองห้อง
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/50 p-3 text-sm text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-xl bg-green-50 dark:bg-green-950/50 p-3 text-sm text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900">
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              เลือกห้องอ่านหนังสือ
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location} - จุ {r.capacity} คน)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              วันที่จอง
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              เลือกรอบเวลา
            </label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TIME_SLOTS.map((ts) => {
                const isBooked = bookedSlots.includes(ts);
                const isSelected = slot === ts;

                return (
                  <button
                    type="button"
                    key={ts}
                    disabled={isBooked}
                    onClick={() => setSlot(ts)}
                    className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs font-medium transition-all border ${
                      isBooked
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800/40 dark:text-slate-600 dark:border-slate-800'
                        : isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                        : 'bg-white text-slate-700 hover:border-blue-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 mb-1 opacity-80" />
                    <span>{ts}</span>
                    <span className="text-[10px] mt-0.5">
                      {isBooked ? '(ไม่ว่าง)' : isSelected ? 'เลือกแล้ว' : 'ว่าง'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              วัตถุประสงค์การใช้งาน <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isPending || bookedSlots.includes(slot)}
              className="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 disabled:opacity-50 transition-all"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
