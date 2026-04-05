'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHosLogs, addHosLog } from '@/actions/data';
import { InferSelectModel } from 'drizzle-orm';
import { hosLogs } from '@/db/schema';
import { 
  Download, 
  Plus, 
  MapPin, 
  Calendar,
  AlertCircle,
  MoreVertical,
  X
} from 'lucide-react';
import HOSGraph from '@/components/HOSGraph/HOSGraph';
import styles from './Logs.module.css';

type Status = 'OFF' | 'SB' | 'D' | 'ON';

interface LogEntry {
  status: Status;
  start: number;
  end: number;
}

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
  const [logs, setLogs] = useState<InferSelectModel<typeof hosLogs>[]>([]);
  const [graphEntries, setGraphEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Recap State
  const [driveHours, setDriveHours] = useState(0);
  const [dutyHours, setDutyHours] = useState(0);
  const [weeklyDutyHours, setWeeklyDutyHours] = useState(0);
  const [currentLocation, setCurrentLocation] = useState('Unknown Location');
  const [currentDateStr, setCurrentDateStr] = useState('');

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLogStatus, setNewLogStatus] = useState<string>('ON_DUTY');
  const [newLogTime, setNewLogTime] = useState<string>('');
  const [newLogLocation, setNewLogLocation] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLogs = async () => {
    try {
      const { data, error } = await getHosLogs();
      if (error) throw new Error(error);
      
      // Filter logs for today
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const filteredData = (data || []).filter(
        log => new Date(log.start_time).getTime() >= startOfDay.getTime()
      );
      
      setLogs(filteredData);

      let dHours = 0;
      let onHours = 0;

      // Transform for graph
      const entries: LogEntry[] = filteredData.map(log => {
        const startDate = new Date(log.start_time);
        const startHour = startDate.getHours() + startDate.getMinutes() / 60;
        let endHour = 24; // Default to end of day if still active
        
        if (log.end_time) {
          const endDate = new Date(log.end_time);
          endHour = endDate.getHours() + endDate.getMinutes() / 60;
        } else {
          const now = new Date();
          if (now.getTime() >= startOfDay.getTime() && now.getDate() === startOfDay.getDate()) {
             endHour = now.getHours() + now.getMinutes() / 60;
          }
        }
        
        let translatedStatus: Status = 'OFF';
        if (log.status === 'SLEEP') translatedStatus = 'SB';
        if (log.status === 'DRIVE') translatedStatus = 'D';
        if (log.status === 'ON_DUTY') translatedStatus = 'ON';

        const duration = endHour - startHour;
        if (translatedStatus === 'D') dHours += duration;
        if (translatedStatus === 'D' || translatedStatus === 'ON') onHours += duration;

        return {
          status: translatedStatus,
          start: startHour,
          end: endHour
        };
      });

      setDriveHours(Number(dHours.toFixed(1)));
      setDutyHours(Number(onHours.toFixed(1)));

      // Rough weekly estimate (since we might only fetch today's in the component if we had an API limit, but data has all logs)
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      const weeklyLogs = (data || []).filter(
        log => new Date(log.start_time).getTime() >= last7Days.getTime()
      );
      let wDuty = 0;
      weeklyLogs.forEach(log => {
        if (log.status === 'DRIVE' || log.status === 'ON_DUTY') {
           const st = new Date(log.start_time).getTime();
           const et = log.end_time ? new Date(log.end_time).getTime() : Date.now();
           wDuty += (et - st) / (1000 * 60 * 60);
        }
      });
      setWeeklyDutyHours(Number(wDuty.toFixed(1)));

      // Set the active status to the most recent one
      if (data && data.length > 0) {
         const latest = data[0]; 
         let translatedStatus: Status = 'OFF';
         if (latest.status === 'SLEEP') translatedStatus = 'SB';
         if (latest.status === 'DRIVE') translatedStatus = 'D';
         if (latest.status === 'ON_DUTY') translatedStatus = 'ON';
         setActiveStatus(translatedStatus);
         if (latest.location_name) setCurrentLocation(latest.location_name);
      }

      setGraphEntries(entries);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Current date/time simple format "YYYY-MM-DDThh:mm"
    const now = new Date();
    const tzOffset = now.getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, -1);
    setNewLogTime(localISOTime.substring(0, 16));

    const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
    setCurrentDateStr(now.toLocaleDateString('en-US', options));

    fetchLogs();
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await addHosLog({
        // Generic driver ID until auth is complete
        driver_id: '123e4567-e89b-12d3-a456-426614174000',
        status: newLogStatus,
        start_time: new Date(newLogTime).toISOString(),
        location_name: newLogLocation
      });
      if (error) {
        alert('Failed to log entry: ' + error);
      } else {
        setShowAddModal(false);
        setNewLogLocation('');
        await fetchLogs(); // refresh
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div 
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <h1 className={styles.title}>HOS Logs - {currentDateStr.split(',').length > 1 ? currentDateStr.split(',').slice(1).join(',').trim() : currentDateStr || 'Today'}</h1>
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
           <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
             <Plus size={16} /> Log Entry
           </button>
        </div>
      </header>

      {/* Add Log Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Record of Duty Status</h2>
              <button 
                className={styles.closeBtn} 
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddLog} className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Duty Status</label>
                <select 
                  className={styles.input}
                  value={newLogStatus}
                  onChange={(e) => setNewLogStatus(e.target.value)}
                >
                  <option value="OFF">OFF DUTY</option>
                  <option value="SLEEP">SLEEPER BERTH</option>
                  <option value="DRIVE">DRIVING</option>
                  <option value="ON_DUTY">ON DUTY (Not Driving)</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Time</label>
                <input 
                  type="datetime-local" 
                  className={styles.input}
                  value={newLogTime}
                  onChange={(e) => setNewLogTime(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Location</label>
                <input 
                  type="text" 
                  className={styles.input}
                  placeholder="e.g. St. Louis, MO"
                  value={newLogLocation}
                  onChange={(e) => setNewLogLocation(e.target.value)}
                />
              </div>

              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.saveBtn}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Graph Card */}
      <div className={`${styles.graphCard} glass`}>
        <div className={styles.graphHeader}>
           <div className={styles.graphMeta}>
             <div className={styles.metaItem}>
               <Calendar size={14} className={styles.metaIcon} />
               <span>{currentDateStr || 'Loading Date...'}</span>
             </div>
             <div className={styles.metaItem}>
               <MapPin size={14} className={styles.metaIcon} />
               <span>{currentLocation}</span>
             </div>
           </div>
           <div className={styles.viewToggle}>
              <button className={styles.activeView}>Graph</button>
              <button>Events</button>
           </div>
        </div>
        
        <HOSGraph entries={graphEntries} />

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
               style={{ borderLeftColor: status.color }}
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
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: `${Math.min(100, (driveHours / 11) * 100)}%`, background: 'var(--status-drive)' }} /></div>
                   <span className={styles.recapValue}>{driveHours} / 11h</span>
                </div>
             </div>
             <div className={styles.recapItem}>
                <div className={styles.recapLabel}>14-Hour On-Duty</div>
                <div className={styles.recapValues}>
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: `${Math.min(100, (dutyHours / 14) * 100)}%`, background: 'var(--status-duty)' }} /></div>
                   <span className={styles.recapValue}>{dutyHours} / 14h</span>
                </div>
             </div>
             <div className={styles.recapItem}>
                <div className={styles.recapLabel}>Weekly Cycle (70h)</div>
                <div className={styles.recapValues}>
                   <div className={styles.recapBar}><div className={styles.recapFill} style={{ width: `${Math.min(100, (weeklyDutyHours / 70) * 100)}%`, background: 'var(--accent)' }} /></div>
                   <span className={styles.recapValue}>{weeklyDutyHours} / 70h</span>
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
             {loading ? (
                <div className={styles.tableRow} style={{ padding: '1rem', justifyContent: 'center' }}>Loading events...</div>
             ) : logs.length === 0 ? (
                <div className={styles.tableRow} style={{ padding: '1rem', justifyContent: 'center' }}>No events logged today.</div>
             ) : logs.map((row, idx) => (
                <div key={idx} className={styles.tableRow}>
                   <div className={styles.rowTime}>{new Date(row.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                   <div className={styles.rowStatus}>
                     <div className={styles.statusDot} style={{ background: row.status === 'DRIVE' ? 'var(--status-drive)' : row.status === 'ON_DUTY' ? 'var(--status-duty)' : row.status === 'SLEEP' ? 'var(--status-sleep)' : 'var(--status-off)' }} />
                     {row.status.replace('_', ' ')}
                   </div>
                   <div className={styles.rowLocation}>{row.location_name || 'Unknown'}</div>
                   <div className={styles.rowOdo}>-</div>
                   <div className={styles.rowRemark}>-</div>
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
