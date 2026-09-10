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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 border-[3px] border-slate-900 shadow-[8px_8px_0px_#1E293B]">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-700 bg-slate-100 hover:bg-yellow-300 border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B] cursor-pointer transition-all"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-6">
          <span className="cute-badge bg-yellow-300 text-slate-900 px-3 py-1 text-xs mb-2 inline-block">
            ✏️ แก้ไขข้อมูลการจอง
          </span>
          <h2 className="text-2xl font-black text-slate-900">
            ปรับเปลี่ยนรอบเวลาหรือห้อง
          </h2>
        </div>

        {errorMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl bg-red-100 p-3.5 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 flex items-start gap-2 rounded-2xl bg-emerald-100 p-3.5 text-xs font-bold text-emerald-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              เลือกห้องอ่านหนังสือ 🏫
            </label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full cute-input px-4 py-2.5 text-sm text-slate-900 cursor-pointer"
            >
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.location} - จุ {r.capacity} คน)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              วันที่จอง 📅
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full cute-input px-4 py-2.5 text-sm text-slate-900 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              เลือกรอบเวลา ⏰
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
                    className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-xs transition-all border-[2.5px] border-slate-900 font-bold ${
                      isBooked
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                        : isSelected
                        ? 'bg-indigo-500 text-white shadow-[3px_3px_0px_#1E293B] -translate-y-0.5'
                        : 'bg-white text-slate-800 hover:bg-yellow-100 hover:shadow-[2px_2px_0px_#1E293B] cursor-pointer'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5 mb-1" />
                    <span>{ts}</span>
                    <span className="text-[10px] mt-0.5">
                      {isBooked ? '(ไม่ว่าง)' : isSelected ? 'เลือกอันนี้ ✨' : 'ว่าง'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              วัตถุประสงค์การใช้งาน 🎯 <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full cute-input px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="cute-btn-secondary px-5 py-2.5 text-xs cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isPending || bookedSlots.includes(slot)}
              className="cute-btn-accent px-6 py-2.5 text-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
