import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar/Sidebar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TruckerHub | Organize Your Business on the Road',
  description: 'Manage HOS logs, fuel, trips, and contracts in one premium dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <div className="layout">
          <Sidebar />
          <main className="main-content">
            <header className="page-header">
              <div className="search-bar">
                {/* Search / Status bar can go here */}
              </div>
              <div className="user-profile">
                {/* Driver Profile Summary */}
              </div>
            </header>
            <section className="content-inner">
              {children}
            </section>
          </main>
        </div>
      </body>
    </html>
  );
}
