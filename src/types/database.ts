export type TimeSlot =
  | '09:00-11:00'
  | '11:00-13:00'
  | '13:00-15:00'
  | '15:00-17:00'
  | '17:00-19:00';

export const TIME_SLOTS: TimeSlot[] = [
  '09:00-11:00',
  '11:00-13:00',
  '13:00-15:00',
  '15:00-17:00',
  '17:00-19:00',
];

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  description: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  booking_date: string; // YYYY-MM-DD
  time_slot: TimeSlot;
  purpose: string;
  created_at: string;
  updated_at: string;
  rooms?: Room; // joined
}
