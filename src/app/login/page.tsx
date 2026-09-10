'use client';

import { useState } from 'react';
import { signInAction, signUpAction, ActionResult } from '@/app/actions';
import { BookOpen, Lock, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

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
    const action = isSignUp ? signUpAction : signInAction;
    const res: ActionResult = await action(formData);

    setIsPending(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else if (res?.success && res?.message) {
      setSuccessMsg(res.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white dark:bg-slate-900 p-8 shadow-xl border border-slate-200 dark:border-slate-800">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <BookOpen className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {isSignUp ? 'สร้างบัญชีผู้ใช้งานใหม่' : 'เข้าสู่ระบบจองห้องอ่านหนังสือ'}
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
            {isSignUp
              ? 'กรอกอีเมลและรหัสผ่านเพื่อเริ่มต้นใช้งานระบบ'
              : 'กรุณาเข้าสู่ระบบเพื่อดูตารางห้องและทำการจอง'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`rounded-lg py-2 text-xs font-semibold transition-all ${
              !isSignUp
                ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
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
            className={`rounded-lg py-2 text-xs font-semibold transition-all ${
              isSignUp
                ? 'bg-white text-slate-900 dark:bg-slate-700 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            สมัครสมาชิก (Sign Up)
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 p-3.5 text-xs text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3.5 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
            <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            <p>{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              อีเมล (Email)
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="student@university.ac.th"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              รหัสผ่าน (Password)
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending
              ? 'กำลังดำเนินการ...'
              : isSignUp
              ? 'สมัครสมาชิก'
              : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  );
}
