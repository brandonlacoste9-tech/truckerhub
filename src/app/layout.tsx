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

        <style jsx global>{`
          .layout {
            display: flex;
            min-height: 100vh;
          }
          .main-content {
            flex: 1;
            margin-left: 280px; /* Width of sidebar */
            display: flex;
            flex-direction: column;
            transition: margin-left 0.3s ease;
          }
          .page-header {
            height: 64px;
            padding: 0 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--background);
            position: sticky;
            top: 0;
            z-index: 50;
            border-bottom: 1px solid var(--border-muted);
          }
          .content-inner {
            flex: 1;
            padding: 2rem;
          }

          @media (max-width: 768px) {
            .main-content {
              margin-left: 0;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
