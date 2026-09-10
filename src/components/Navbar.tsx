'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Calendar, ListChecks, LogOut, User as UserIcon } from 'lucide-react';
import { signOutAction } from '@/app/actions';

interface NavbarProps {
  userEmail?: string | null;
}

export function Navbar({ userEmail }: NavbarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/bookings" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                UniStudy Room
              </span>
              <span className="text-xs text-slate-500 font-medium">ระบบจองห้องอ่านหนังสือ</span>
            </div>
          </Link>

          {userEmail && (
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/bookings"
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  pathname === '/bookings'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <Calendar className="h-4 w-4" />
                ตารางห้องและจอง
              </Link>
              <Link
                href="/my-bookings"
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                  pathname === '/my-bookings'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <ListChecks className="h-4 w-4" />
                การจองของฉัน
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {userEmail ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  {userEmail}
                </span>
              </div>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-750 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5 text-red-500" />
                  <span>ออกจากระบบ</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      {userEmail && (
        <div className="flex md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 justify-around">
          <Link
            href="/bookings"
            className={`flex items-center gap-1.5 py-1 text-xs font-semibold ${
              pathname === '/bookings' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Calendar className="h-4 w-4" />
            ตารางห้อง
          </Link>
          <Link
            href="/my-bookings"
            className={`flex items-center gap-1.5 py-1 text-xs font-semibold ${
              pathname === '/my-bookings' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400'
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
