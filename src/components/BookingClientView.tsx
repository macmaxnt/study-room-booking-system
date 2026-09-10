'use client';

import { useState } from 'react';
import { Room, Booking, TimeSlot, TIME_SLOTS } from '@/types/database';
import { BookingModal } from './BookingModal';
import {
  Calendar as CalendarIcon,
  Users,
  MapPin,
  Clock,
  Plus,
  Info,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

interface BookingClientViewProps {
  rooms: Room[];
  bookings: Booking[];
  currentUserId: string;
}

export function BookingClientView({
  rooms,
  bookings,
  currentUserId,
}: BookingClientViewProps) {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Map เพื่อดึงการจองในวันที่เลือก
  const bookingsForDate = bookings.filter((b) => b.booking_date === selectedDate);

  const handleOpenBooking = (room: Room, slot?: TimeSlot) => {
    setSelectedRoom(room);
    setSelectedSlot(slot || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Date Filter & Control Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white dark:bg-slate-900 p-5 shadow-sm border border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            ตรวจสอบตารางห้องและรอบเวลา
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            เลือกวันที่เพื่อดูสถานะรอบเวลาว่าง และกดจองห้องได้ทันที
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            วันที่:
          </label>
          <input
            type="date"
            value={selectedDate}
            min={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block"></span>
          รอบว่าง (กดเพื่อจอง)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 inline-block"></span>
          ไม่ว่าง (ถูกจองแล้ว)
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="h-3 w-3 rounded-full bg-blue-500 inline-block"></span>
          รายการจองของคุณ
        </span>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <Info className="mx-auto h-10 w-10 text-slate-400" />
          <h3 className="mt-3 text-base font-semibold text-slate-800 dark:text-slate-200">
            ยังไม่มีข้อมูลห้องอ่านหนังสือ
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            กรุณาเพิ่มข้อมูลห้องอ่านหนังสือในตาราง rooms ของ Supabase
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {rooms.map((room) => {
            const roomBookings = bookingsForDate.filter((b) => b.room_id === room.id);
            const bookedSlotMap = new Map(roomBookings.map((b) => [b.time_slot, b]));
            const bookedSlots = Array.from(bookedSlotMap.keys());
            const availableCount = TIME_SLOTS.length - bookedSlots.length;

            return (
              <div
                key={room.id}
                className="flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  {/* Room Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {room.name}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-blue-500" />
                          {room.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-blue-500" />
                          ความจุ {room.capacity} ที่นั่ง
                        </span>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                        availableCount > 0
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400'
                      }`}
                    >
                      ว่าง {availableCount}/{TIME_SLOTS.length} รอบ
                    </span>
                  </div>

                  {room.description && (
                    <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                      {room.description}
                    </p>
                  )}

                  {/* Time Slots Grid (Requirement 04) */}
                  <div className="mt-5">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 block">
                      สถานะรอบเวลา ({selectedDate}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => {
                        const bookingInfo = bookedSlotMap.get(slot);
                        const isBooked = !!bookingInfo;
                        const isMine = bookingInfo?.user_id === currentUserId;

                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => handleOpenBooking(room, slot)}
                            className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-xs transition-all border ${
                              isBooked
                                ? isMine
                                  ? 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900 cursor-not-allowed'
                                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800/40 dark:text-slate-500 dark:border-slate-800'
                                : 'bg-emerald-50/50 text-emerald-800 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900 hover:scale-[1.02]'
                            }`}
                          >
                            <div className="flex items-center gap-1 font-semibold">
                              <Clock className="h-3 w-3 opacity-70" />
                              <span>{slot}</span>
                            </div>
                            <span className="text-[10px] mt-0.5">
                              {isBooked
                                ? isMine
                                  ? 'การจองของคุณ'
                                  : 'จองแล้ว'
                                : 'ว่าง • จองเลย'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleOpenBooking(room)}
                    disabled={availableCount === 0}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    จองห้องนี้
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal จองห้อง */}
      {isModalOpen && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          selectedDate={selectedDate}
          defaultSlot={selectedSlot}
          bookedSlots={bookingsForDate
            .filter((b) => b.room_id === selectedRoom.id)
            .map((b) => b.time_slot)}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedRoom(null);
            setSelectedSlot(null);
          }}
        />
      )}
    </div>
  );
}
