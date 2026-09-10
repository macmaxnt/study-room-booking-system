'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { z } from 'zod';

// ==========================================
// 1. Auth Schemas & Actions
// ==========================================

const AuthSchema = z.object({
  email: z.string().email('กรุณากรอกอีเมลให้ถูกต้อง'),
  password: z.string().min(6, 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร'),
});

export type ActionResult = {
  success?: boolean;
  message?: string;
  error?: string;
};

export async function signInAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = AuthSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }
    if (error.message.includes('Email not confirmed')) {
      return { error: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ หรือตรวจสอบการตั้งค่า Confirm Email' };
    }
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/bookings');
}

export async function signUpAction(formData: FormData): Promise<ActionResult> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validated = AuthSchema.safeParse({ email, password });
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' };
  }

  const headerList = await headers();
  const host = headerList.get('host') || '';
  const proto = headerList.get('x-forwarded-proto') || 'https';
  const origin = host.includes('localhost') ? `http://${host}` : `${proto}://${host}`;
  const emailRedirectTo = `${origin}/auth/callback?next=/bookings`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      emailRedirectTo,
    },
  });

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'อีเมลนี้ถูกลงทะเบียนใช้งานแล้ว' };
    }
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath('/', 'layout');
    redirect('/bookings');
  }

  return { success: true, message: 'สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี จากนั้นระบบจะพากลับเข้าสู่ระบบอัตโนมัติ' };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

// ==========================================
// 2. Booking Schemas & Actions
// ==========================================

const BookingSchema = z.object({
  room_id: z.string().uuid('กรุณาเลือกห้องอ่านหนังสือ'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ไม่ถูกต้อง (YYYY-MM-DD)'),
  time_slot: z.enum(['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00'], {
    message: 'กรุณาเลือกรอบเวลาที่ถูกต้อง',
  }),
  purpose: z.string().min(3, 'กรุณากรอกวัตถุประสงค์การใช้งานอย่างน้อย 3 ตัวอักษร'),
});

export async function createBookingAction(prevState: any, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนทำการจองห้อง' };
  }

  const rawData = {
    room_id: formData.get('room_id'),
    booking_date: formData.get('booking_date'),
    time_slot: formData.get('time_slot'),
    purpose: (formData.get('purpose') as string)?.trim(),
  };

  const validated = BookingSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง' };
  }

  const todayStr = new Date().toISOString().split('T')[0];
  if (validated.data.booking_date < todayStr) {
    return { error: 'ไม่สามารถจองห้องในวันหรือเวลาที่ผ่านมาแล้วได้' };
  }

  const { error } = await supabase.from('bookings').insert({
    room_id: validated.data.room_id,
    user_id: user.id,
    booking_date: validated.data.booking_date,
    time_slot: validated.data.time_slot,
    purpose: validated.data.purpose,
  });

  if (error) {
    if (error.code === '23505' || error.message.includes('unique_room_date_slot')) {
      return { error: 'ห้องนี้ในวันและรอบเวลาดังกล่าวถูกจองไปแล้ว กรุณาเลือกรอบเวลาอื่น' };
    }
    return { error: `ไม่สามารถสร้างการจองได้: ${error.message}` };
  }

  revalidatePath('/bookings');
  revalidatePath('/my-bookings');
  return { success: true, message: 'จองห้องอ่านหนังสือเรียบร้อยแล้ว!' };
}

const UpdateBookingSchema = z.object({
  id: z.string().uuid('รหัสการจองไม่ถูกต้อง'),
  room_id: z.string().uuid('กรุณาเลือกห้องอ่านหนังสือ'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'รูปแบบวันที่ไม่ถูกต้อง'),
  time_slot: z.enum(['09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00']),
  purpose: z.string().min(3, 'กรุณากรอกวัตถุประสงค์อย่างน้อย 3 ตัวอักษร'),
});

export async function updateBookingAction(prevState: any, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
  }

  const rawData = {
    id: formData.get('id'),
    room_id: formData.get('room_id'),
    booking_date: formData.get('booking_date'),
    time_slot: formData.get('time_slot'),
    purpose: (formData.get('purpose') as string)?.trim(),
  };

  const validated = UpdateBookingSchema.safeParse(rawData);
  if (!validated.success) {
    return { error: validated.error.issues[0]?.message || 'ข้อมูลไม่ถูกต้อง' };
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({
      room_id: validated.data.room_id,
      booking_date: validated.data.booking_date,
      time_slot: validated.data.time_slot,
      purpose: validated.data.purpose,
      updated_at: new Date().toISOString(),
    })
    .eq('id', validated.data.id)
    .eq('user_id', user.id)
    .select();

  if (error) {
    if (error.code === '23505' || error.message.includes('unique_room_date_slot')) {
      return { error: 'ห้องนี้ในวันและรอบเวลาดังกล่าวถูกจองไปแล้ว กรุณาเลือกรอบเวลาอื่น' };
    }
    return { error: `ไม่สามารถแก้ไขข้อมูลได้: ${error.message}` };
  }

  if (!data || data.length === 0) {
    return { error: 'คุณไม่มีสิทธิ์แก้ไขรายการนี้ หรือไม่พบข้อมูล' };
  }

  revalidatePath('/bookings');
  revalidatePath('/my-bookings');
  return { success: true, message: 'แก้ไขข้อมูลการจองสำเร็จ!' };
}

export async function deleteBookingAction(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'กรุณาเข้าสู่ระบบก่อนทำรายการ' };
  }

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId)
    .eq('user_id', user.id);

  if (error) {
    return { error: `ไม่สามารถยกเลิกการจองได้: ${error.message}` };
  }

  revalidatePath('/bookings');
  revalidatePath('/my-bookings');
  return { success: true, message: 'ยกเลิกการจองเรียบร้อยแล้ว' };
}
