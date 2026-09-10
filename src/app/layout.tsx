import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'UniStudy Room - ระบบจองห้องอ่านหนังสือ',
  description: 'ระบบจองห้องอ่านหนังสือและค้นคว้าสำหรับนักศึกษาและบุคลากร',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full bg-slate-50 dark:bg-slate-950 antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
