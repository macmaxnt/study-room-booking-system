'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Calendar, ListChecks, LogOut, User as UserIcon, BookOpen } from 'lucide-react';
import { signOutAction } from '@/app/actions';

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b-[3px] border-slate-900 bg-amber-50/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link href="/bookings" className="flex items-center gap-3 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500 text-white border-[3px] border-slate-900 shadow-[3px_3px_0px_#1E293B] group-hover:-rotate-6 transition-transform">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  UniStudy Room ✨
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-700">ระบบจองห้องอ่านหนังสือสุดคิ้วท์</span>
            </div>
          </Link>

          {userEmail && (
            <nav className="hidden md:flex items-center gap-3">
              <Link
                href="/bookings"
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition-all border-[2.5px] border-slate-900 ${
                  pathname === '/bookings'
                    ? 'bg-yellow-300 text-slate-900 shadow-[3px_3px_0px_#1E293B] -translate-y-0.5'
                    : 'bg-white text-slate-700 hover:bg-yellow-100 hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-y-0.5'
                }`}
              >
                <Calendar className="h-4 w-4 text-indigo-600" />
                ตารางห้อง & จอง
              </Link>
              <Link
                href="/my-bookings"
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition-all border-[2.5px] border-slate-900 ${
                  pathname === '/my-bookings'
                    ? 'bg-yellow-300 text-slate-900 shadow-[3px_3px_0px_#1E293B] -translate-y-0.5'
                    : 'bg-white text-slate-700 hover:bg-yellow-100 hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-y-0.5'
                }`}
              >
                <ListChecks className="h-4 w-4 text-indigo-600" />
                การจองของฉัน 📋
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-2xl bg-white px-4 py-2 border-[2.5px] border-slate-900 shadow-[3px_3px_0px_#1E293B]">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-200 text-pink-700 text-xs font-black">
                  😊
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {userEmail}
                </span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="cute-btn-danger flex items-center gap-1.5 px-3.5 py-2 text-xs cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>ออก</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="cute-btn-primary px-5 py-2.5 text-xs"
            >
              เข้าสู่ระบบ 🚀
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {userEmail && (
        <div className="flex md:hidden border-t-[2.5px] border-slate-900 px-4 py-2.5 bg-yellow-100/90 justify-around">
          <Link
            href="/bookings"
            className={`flex items-center gap-1.5 py-1 text-xs font-extrabold ${
              pathname === '/bookings' ? 'text-indigo-600' : 'text-slate-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            ตารางห้อง
          </Link>
          <Link
            href="/my-bookings"
            className={`flex items-center gap-1.5 py-1 text-xs font-extrabold ${
              pathname === '/my-bookings' ? 'text-indigo-600' : 'text-slate-700'
            }`}
          >
            <ListChecks className="h-4 w-4" />
            การจองของฉัน
          </Link>
        </div>
      )}
    </header>
  );
}
