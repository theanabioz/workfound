import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'WorkFound - Работа в Европе',
  description: 'Сервис по поиску работы для синих воротничков в Европе',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>{children}</body>
    </html>
  );
}
