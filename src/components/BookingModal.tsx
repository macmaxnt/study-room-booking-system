'use client';

import { useState } from 'react';
import { Room, TimeSlot, TIME_SLOTS } from '@/types/database';
import { createBookingAction } from '@/app/actions';
import { Calendar, Clock, MapPin, Users, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface BookingModalProps {
  room: Room;
  selectedDate: string;
  defaultSlot?: TimeSlot | null;
  bookedSlots: string[];
  onClose: () => void;
  onSuccess?: () => void;
}

export function BookingModal({
  room,
  selectedDate,
  defaultSlot,
  bookedSlots,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [slot, setSlot] = useState<TimeSlot>(defaultSlot || '09:00-11:00');
  const [purpose, setPurpose] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('room_id', room.id);
    formData.append('booking_date', selectedDate);
    formData.append('time_slot', slot);
    formData.append('purpose', purpose);

    const res = await createBookingAction(null, formData);

    setIsPending(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.success) {
      setSuccessMsg(res.message || 'จองห้องสำเร็จ!');
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
          <span className="inline-block rounded-full bg-blue-100 dark:bg-blue-950 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">
            แบบฟอร์มการจอง
          </span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {room.name}
          </h2>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-blue-500" />
              {room.location}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-blue-500" />
              ความจุ {room.capacity} คน
            </span>
          </div>
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
              วันที่ต้องการจอง
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>{selectedDate}</span>
            </div>
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
              placeholder="เช่น อ่านหนังสือเตรียมสอบปลายภาค, ทำรายงานกลุ่มรายวิชา AI"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <p className="mt-1 text-[11px] text-slate-500">
              อย่างน้อย 3 ตัวอักษร
            </p>
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
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 transition-all"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? 'กำลังบันทึก...' : 'ยืนยันการจองห้อง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
