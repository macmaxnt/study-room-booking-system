'use client';

import { useState } from 'react';
import { signInAction, signUpAction } from '../actions';
import { BookOpen, Sparkles, Lock, Mail, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      if (isSignUp) {
        const res = await signUpAction(formData);
        if (res?.error) {
          setErrorMsg(res.error);
        } else if (res?.success) {
          setSuccessMsg(res.success);
        }
      } else {
        const res = await signInAction(formData);
        if (res?.error) {
          setErrorMsg(res.error);
        }
      }
    } catch {
      setErrorMsg('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="cute-card w-full max-w-md p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-300 border-[3px] border-slate-900 shadow-[4px_4px_0px_#1E293B]">
            <BookOpen className="h-8 w-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5 pt-2">
            ระบบจองห้องอ่านหนังสือ <Sparkles className="h-5 w-5 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs font-bold text-slate-500">
            University Study Room Booking • ปลอดภัย ใช้งานง่าย
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`rounded-xl py-2 text-xs font-extrabold transition-all ${
              !isSignUp
                ? 'bg-amber-300 text-slate-900 border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            เข้าสู่ระบบ (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`rounded-xl py-2 text-xs font-extrabold transition-all ${
              isSignUp
                ? 'bg-indigo-500 text-white border-[2px] border-slate-900 shadow-[2px_2px_0px_#1E293B]'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            สมัครสมาชิก (Sign Up)
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-red-100 p-4 text-xs font-bold text-red-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-600" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 rounded-2xl bg-emerald-100 p-4 text-xs font-bold text-emerald-900 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-600" />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              อีเมล (Email) 📧
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                name="email"
                type="email"
                required
                placeholder="student@university.ac.th"
                className="w-full cute-input py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
              รหัสผ่าน (Password) 🔒
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full cute-input py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cute-btn-primary py-3.5 text-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending
              ? 'กำลังดำเนินการ...'
              : isSignUp
              ? 'สมัครสมาชิกเลยยย 🎉'
              : 'เข้าสู่ระบบ 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
}
