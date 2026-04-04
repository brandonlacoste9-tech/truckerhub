'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { 
  Truck, 
  MapPin, 
  Timer, 
  Fuel, 
  ChevronRight, 
  Navigation, 
  ShieldCheck, 
  Activity,
  ArrowRight
} from 'lucide-react';
import StatsCard from '@/components/StatsCard/StatsCard';
import styles from './Dashboard.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const [activeLoad, setActiveLoad] = useState<any>(null);
  const [latestLogs, setLatestLogs] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('OFF');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch active load
        const { data: loadData } = await supabase
          .from('loads')
          .select('*')
          .in('status', ['available', 'booked', 'in-transit'])
          .order('pickup_time', { ascending: true })
          .limit(1)
          .single();
        
        if (loadData) setActiveLoad(loadData);

        // Fetch recent logs
        const { data: logsData } = await supabase
          .from('hos_logs')
          .select('*')
          .order('start_time', { ascending: false })
          .limit(3);

        if (logsData && logsData.length > 0) {
          setLatestLogs(logsData);
          setCurrentStatus(logsData[0].status.replace('_', ' '));
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <motion.div 
      className={styles.dashboard}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Dynamic Header */}
      <header className={styles.header}>
        <div className={styles.titleInfo}>
          <h1 className={styles.title}>TruckerHub <span style={{ color: 'var(--accent)' }}>Pro</span></h1>
          <p className={styles.subtitle}>Log ID: #LT-884210 • Unit 2401 • Assigned: Brandon L.</p>
        </div>
        
        <div className={styles.controls}>
           <button className={`${styles.statusBtn} ${currentStatus === 'DRIVE' ? styles.onDuty : ''}`}>
              <div className={styles.pulse} /> 
              {currentStatus}
           </button>
        </div>
      </header>

      {/* Real-time Compliance Stats */}
      <section className={styles.statsGrid}>
        <StatsCard 
          label="Drive Remaining" 
          value="07:14" 
          icon={Timer} 
          variant="status-drive"
          tendency="-00:45 this shift"
        />
        <StatsCard 
          label="Duty Remaining" 
          value="02:26" 
          icon={Activity} 
          variant="status-duty"
          tendency="Cycle ends in 2d"
        />
        <StatsCard 
          label="Fuel Efficiency" 
          value="7.2 MPG" 
          icon={Fuel} 
          variant="default"
          tendency="+0.4 vs last trip"
        />
        <StatsCard 
          label="Compliance Score" 
          value="100%" 
          icon={ShieldCheck} 
          variant="status-drive"
          tendency="Certified"
        />
      </section>

      {/* Live Operations Grid */}
      <div className={styles.mainGrid}>
        
        {/* Active Load Manifest */}
        <motion.section variants={item} className={`${styles.activeLoad} glass`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Truck size={20} className={styles.sectionIcon} />
              <h3>Current Manifest</h3>
            </div>
            {activeLoad && <span className={styles.badge}>{activeLoad.status.toUpperCase()}</span>}
          </div>

          {loading ? (
             <div style={{ padding: '2rem' }}>Loading manifest...</div>
          ) : activeLoad ? (
            <>
              <div className={styles.loadRoute}>
                <div className={styles.routeStop}>
                  <div className={styles.stopIndicator}>
                    <div className={styles.stopCircle} />
                    <div className={styles.stopLine} />
                  </div>
                  <div className={styles.stopContent}>
                    <span className={styles.stopLabel}>Pickup</span>
                    <span className={styles.stopName}>{activeLoad.origin_city}, {activeLoad.origin_state}</span>
                    <span className={styles.stopTime}>{new Date(activeLoad.pickup_time).toLocaleString()}</span>
                  </div>
                </div>

                <div className={styles.routeStop}>
                  <div className={styles.stopIndicator}>
                    <div className={styles.stopCircleActive} />
                  </div>
                  <div className={styles.stopContent}>
                    <span className={styles.stopLabel}>Destination</span>
                    <span className={styles.stopName}>{activeLoad.destination_city}, {activeLoad.destination_state}</span>
                    <span className={styles.stopTime}>Est. {new Date(activeLoad.delivery_time).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.loadFooter}>
                <div className={styles.loadInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Load ID</span>
                    <span className={styles.infoValue}>{activeLoad.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Est. Revenue</span>
                    <span className={styles.infoValue}>${activeLoad.rate}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Weight</span>
                    <span className={styles.infoValue}>{activeLoad.weight} lbs</span>
                  </div>
                </div>
                <button className={styles.actionBtn}>
                  View BOL <ChevronRight size={16} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ padding: '2rem' }}>No active load assigned.</div>
          )}
        </motion.section>

        {/* Tactical Map View */}
        <motion.section variants={item} className={`${styles.mapPreview} glass`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitle}>
              <Navigation size={20} className={styles.sectionIcon} />
              <h3>GPS Navigation</h3>
            </div>
          </div>
          
          <div className={styles.mapStub}>
             <Truck className={styles.mapIcon} style={{ width: '48px', height: '48px', position: 'absolute', top: '40%', left: '46%', color: 'var(--status-drive)' }} />
             <div className={styles.locationSummary}>
                <span className={styles.locationTitle}>I-44 Westbound</span>
                <span className={styles.locationSubtitle}>Near Springfield, MO</span>
             </div>
          </div>

          <div className={styles.recentEvents}>
             <h4>Log Activity</h4>
             <div className={styles.eventList}>
                {latestLogs.map((log, idx) => (
                   <div key={idx} className={styles.eventItem}>
                      <div className={styles.eventIcon} style={{ background: log.status === 'DRIVE' ? 'var(--status-drive)' : 'var(--surface-hover)' }}>
                        {log.status === 'DRIVE' ? <Truck size={14} /> : <Timer size={14} />}
                      </div>
                      <div className={styles.eventContent}>
                         <span className={styles.eventText}>Status Change: {log.status.replace('_', ' ')}</span>
                         <span className={styles.eventTime}>{new Date(log.start_time).toLocaleString()}</span>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
