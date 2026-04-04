'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Plus, 
  MapPin, 
  Clock, 
  FileText, 
  Calendar,
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import HOSGraph from '@/components/HOSGraph/HOSGraph';
import styles from './Logs.module.css';

type Status = 'OFF' | 'SB' | 'D' | 'ON';

interface LogEntry {
  status: Status;
  start: number;
  end: number;
}

const mockEntries: LogEntry[] = [
  { status: 'OFF', start: 0, end: 8 },
  { status: 'D', start: 8, end: 12 },
  { status: 'ON', start: 12, end: 13 },
  { status: 'D', start: 13, end: 17 },
  { status: 'OFF', start: 17, end: 18 },
  { status: 'SB', start: 18, end: 24 }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function LogsPage() {
  const [activeStatus, setActiveStatus] = useState<Status>('OFF');
  const [region, setRegion] = useState<'USA' | 'CAN'>('USA');

  return (
    <motion.div 
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <h1 className={styles.title}>HOS Logs - Apr 04, 2026</h1>
          <div className={styles.badges}>
             <div className={`${styles.statusBadge} ${styles.currentStatus}`}>
                <div className={styles.pulse} />
                Currently: <strong>{activeStatus}</strong>
             </div>
             <button className={styles.regionBtn} onClick={() => setRegion(r => r === 'USA' ? 'CAN' : 'USA')}>
               {region === 'USA' ? 'US FMCSA' : 'CANADA FEDERAL'}
             </button>
          </div>
        </div>
        
        <div className={styles.actions}>
           <button className={styles.exportBtn}>
             <Download size={16} /> Export Logs
           </button>
           <button className={styles.addBtn}>
             <Plus size={16} /> Log Entry
           </button>
        </div>
      </header>

      {/* Main Graph Card */}
      <div className={`${styles.graphCard} glass`}>
        <div className={styles.graphHeader}>
           <div className={styles.graphMeta}>
             <div className={styles.metaItem}>
               <Calendar size={14} className={styles.metaIcon} />
               <span>Saturday, Apr 4</span>
             </div>
             <div className={styles.metaItem}>
               <MapPin size={14} className={styles.metaIcon} />
               <span>St. Louis, MO to Oklahoma City, OK</span>
             </div>
           </div>
           <div className={styles.viewToggle}>
              <button className={styles.activeView}>Graph</button>
              <button>Events</button>
           </div>
        </div>
        
        <HOSGraph entries={mockEntries} />

        <div className={styles.statusToggles}>
           {[
             { id: 'OFF', label: 'OFF duty', color: '#6C757D' },
             { id: 'SB', label: 'Sleeper', color: '#E71D36' },
             { id: 'D', label: 'Driving', color: '#2EC4B6' },
             { id: 'ON', label: 'On duty', color: '#4361EE' },
           ].map((status) => (
             <button 
               key={status.id} 
               className={`${styles.toggleBtn} ${activeStatus === status.id ? styles.activeToggle : ''}`}
               onClick={() => setActiveStatus(status.id as Status)}
               style={{ borderLeftColor: status.color } as any}
             >
               <span className={styles.toggleLabel}>{status.label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className={styles.lowerLayout}>
        {/* Compliance Recap */}
        <div className={`${styles.recapCard} glass`}>
          <div className={styles.sectionHeader}>
             <h3 className={styles.sectionTitle}>Compliance Recap</h3>
             <AlertCircle size={16} className={styles.infoIcon} />
          </div>
          <div className={styles.recapList}>
             <div className={styles.recapItem}>
                <div className={styles.recapLabel}>11-Hour Driving</div>
                <div className={styles.recapValues}>
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: '70%', background: 'var(--status-drive)' }} /></div>
                   <span className={styles.recapValue}>7.6 / 11h</span>
                </div>
             </div>
             <div className={styles.recapItem}>
                <div className={styles.recapLabel}>14-Hour On-Duty</div>
                <div className={styles.recapValues}>
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: '85%', background: 'var(--status-duty)' }} /></div>
                   <span className={styles.recapValue}>11.9 / 14h</span>
                </div>
             </div>
             <div className={styles.recapItem}>
                <div className={styles.recapLabel}>Weekly Cycle (70h)</div>
                <div className={styles.recapValues}>
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: '25%', background: 'var(--accent)' }} /></div>
                   <span className={styles.recapValue}>18.4 / 70h</span>
                </div>
             </div>
          </div>
        </div>

        {/* Daily Log Table */}
        <div className={`${styles.logDetails} glass`}>
          <div className={styles.sectionHeader}>
             <h3 className={styles.sectionTitle}>Log Detail History (14 Days)</h3>
             <button className={styles.viewHistory}>View All <ChevronRight size={14} /></button>
          </div>
          <div className={styles.eventTable}>
             {[
               { time: '11:59 PM', location: 'Clinton, OK', status: 'Sleeper', odometer: '234,451', remark: 'Arrived at truck stop' },
               { time: '05:30 PM', location: 'Oklahoma City, OK', status: 'Off Duty', odometer: '234,312', remark: 'Dinner' },
               { time: '01:00 PM', location: 'Tulsa, OK', status: 'Driving', odometer: '234,180', remark: '-' },
               { time: '12:00 PM', location: 'Joplin, MO', status: 'On Duty', odometer: '234,180', remark: 'Inspection' },
             ].map((row, idx) => (
                <div key={idx} className={styles.tableRow}>
                   <div className={styles.rowTime}>{row.time}</div>
                   <div className={styles.rowStatus}>
                     <div className={styles.statusDot} style={{ background: row.status === 'Driving' ? 'var(--status-drive)' : 'var(--status-off)' }} />
                     {row.status}
                   </div>
                   <div className={styles.rowLocation}>{row.location}</div>
                   <div className={styles.rowOdo}>{row.odometer}</div>
                   <div className={styles.rowRemark}>{row.remark}</div>
                   <button className={styles.rowEdit}><MoreVertical size={14} /></button>
                </div>
             ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChevronRight({ size }: { size: number }) {
  return <ArrowRight size={size} />;
}

function ArrowRight({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
