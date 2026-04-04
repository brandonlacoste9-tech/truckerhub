'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardCheck, 
  Package, 
  Fuel, 
  MapPin, 
  FileCheck, 
  Settings, 
  LogOut 
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/logs', icon: ClipboardCheck, label: 'HOS Logs' },
  { href: '/loads', icon: Package, label: 'Loads' },
  { href: '/fuel', icon: Fuel, label: 'Fuel Tracking' },
  { href: '/contracts', icon: FileCheck, label: 'Contracts' },
  { href: '/gps', icon: MapPin, label: 'GPS Map' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>TH</div>
        <span className={styles.logoText}>TruckerHub</span>
      </div>

      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} className={styles.icon} />
              <span className={styles.label}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <Link href="/settings" className={styles.navItem}>
          <Settings size={20} className={styles.icon} />
          <span className={styles.label}>Settings</span>
        </Link>
        <button className={styles.logoutBtn}>
          <LogOut size={20} className={styles.icon} />
          <span className={styles.label}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
