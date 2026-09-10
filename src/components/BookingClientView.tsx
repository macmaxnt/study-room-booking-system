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
  Sparkles,
  PartyPopper,
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

  const bookingsForDate = bookings.filter((b) => b.booking_date === selectedDate);

  const handleOpenBooking = (room: Room, slot?: TimeSlot) => {
    setSelectedRoom(room);
    setSelectedSlot(slot || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-8">
      {/* Date Filter & Control Header */}
      <div className="cute-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-yellow-50 to-amber-50">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-yellow-300 border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]">
              📅
            </span>
            เลือกดูรอบเวลาห้องว่าง
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-1">
            เลือกวันที่ต้องการใช้งาน แล้วกดเลือกรอบเวลาที่ว่างเพื่อจองได้เลย!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-black text-slate-800">
            วันที่:
          </label>
          <input
            type="date"
            value={selectedDate}
            min={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="cute-input px-4 py-2 text-sm text-slate-900 cursor-pointer"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-extrabold text-slate-700 px-2">
        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]">
          <span className="h-3.5 w-3.5 rounded-full bg-emerald-400 border border-slate-900 inline-block"></span>
          รอบว่าง (กดจองได้เลย)
        </span>
        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]">
          <span className="h-3.5 w-3.5 rounded-full bg-slate-200 border border-slate-900 inline-block"></span>
          ถูกจองแล้ว
        </span>
        <span className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]">
          <span className="h-3.5 w-3.5 rounded-full bg-indigo-500 border border-slate-900 inline-block"></span>
          รายการจองของคุณ ⭐
        </span>
      </div>

      {/* Rooms Grid */}
      {rooms.length === 0 ? (
        <div className="cute-card p-12 text-center bg-white">
          <Info className="mx-auto h-12 w-12 text-indigo-400" />
          <h3 className="mt-4 text-lg font-black text-slate-900">
            ยังไม่มีข้อมูลห้องอ่านหนังสือ
          </h3>
          <p className="mt-1 text-xs font-bold text-slate-500">
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
                className="cute-card p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Room Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {room.name}
                      </h3>
                      <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1 bg-sky-100 px-2.5 py-1 rounded-xl border-[1.5px] border-slate-900">
                          <MapPin className="h-3.5 w-3.5 text-sky-600" />
                          {room.location}
                        </span>
                        <span className="flex items-center gap-1 bg-amber-100 px-2.5 py-1 rounded-xl border-[1.5px] border-slate-900">
                          <Users className="h-3.5 w-3.5 text-amber-600" />
                          จุ {room.capacity} ที่นั่ง
                        </span>
                      </div>
                    </div>
                    <span
                      className={`cute-badge px-3 py-1 text-xs ${
                        availableCount > 0
                          ? 'bg-emerald-300 text-slate-900'
                          : 'bg-rose-300 text-slate-900'
                      }`}
                    >
                      ว่าง {availableCount}/{TIME_SLOTS.length} รอบ
                    </span>
                  </div>

                  {room.description && (
                    <p className="mt-4 text-xs font-bold text-slate-600 bg-slate-50 p-3 rounded-2xl border-[2px] border-slate-900/40">
                      💡 {room.description}
                    </p>
                  )}

                  {/* Time Slots Grid (Requirement 04) */}
                  <div className="mt-5">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 mb-3 block">
                      รอบเวลาประจำวัน ({selectedDate}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {TIME_SLOTS.map((slot) => {
                        const bookingInfo = bookedSlotMap.get(slot);
                        const isBooked = !!bookingInfo;
                        const isMine = bookingInfo?.user_id === currentUserId;

                        return (
                          <button
                            key={slot}
                            disabled={isBooked}
                            onClick={() => handleOpenBooking(room, slot)}
                            className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-xs transition-all border-[2.5px] border-slate-900 ${
                              isBooked
                                ? isMine
                                ? 'bg-indigo-100 text-indigo-900 shadow-[2px_2px_0px_#1E293B] cursor-not-allowed opacity-90'
                                : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-60'
                                : 'bg-emerald-300 text-slate-900 shadow-[3px_3px_0px_#1E293B] hover:-translate-y-0.5 hover:bg-emerald-200 cursor-pointer font-extrabold active:translate-y-0 active:shadow-none'
                            }`}
                          >
                            <div className="flex items-center gap-1 font-black">
                              <Clock className="h-3 w-3" />
                              <span>{slot}</span>
                            </div>
                            <span className="text-[10px] mt-0.5 font-bold">
                              {isBooked
                                ? isMine
                                  ? 'จองแล้ว (ของคุณ)'
                                  : 'เต็มแล้ว'
                                : 'ว่าง • จองเลย'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="mt-6 pt-4 border-t-[2.5px] border-slate-900/20 flex justify-end">
                  <button
                    onClick={() => handleOpenBooking(room)}
                    disabled={availableCount === 0}
                    className="cute-btn-primary px-5 py-2.5 text-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                    จองห้องนี้เลย ✨
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
