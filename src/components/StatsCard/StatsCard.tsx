import { LucideIcon } from 'lucide-react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
  label: string;
  value: string;
  tendency?: string;
  icon: LucideIcon;
  variant?: 'default' | 'accent' | 'status-drive' | 'status-duty' | 'status-sleep';
  iconColor?: string;
  statusText?: string;
}

export default function StatsCard({ 
  label, 
  value, 
  tendency, 
  icon: Icon, 
  variant = 'default',
  iconColor,
  statusText
}: StatsCardProps) {
  return (
    <div className={`${styles.card} ${styles[variant]} glass`}>
      <div className={styles.header}>
        <div className={styles.iconContainer} style={{ color: iconColor }}>
          <Icon size={18} />
        </div>
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.value}>{value}</h3>
        {tendency && <span className={styles.tendency}>{tendency}</span>}
      </div>
      {statusText && <div className={styles.status}>{statusText}</div>}
    </div>
  );
}
