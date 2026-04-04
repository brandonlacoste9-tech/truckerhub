'use client';

import { motion } from 'framer-motion';
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
           <button className={`${styles.statusBtn} ${styles.onDuty}`}>
              <div className={styles.pulse} /> 
              On Duty (Driving)
           </button>
        </div>
      </header>

      {/* Real-time Compliance Stats */}
      <section className={styles.statsGrid}>
        <StatsCard 
          title="Drive Remaining" 
          value="07:14" 
          icon={<Timer size={22} />} 
          variant="drive"
          trend="-00:45 this shift"
        />
        <StatsCard 
          title="Duty Remaining" 
          value="02:26" 
          icon={<Activity size={22} />} 
          variant="duty"
          trend="Cycle ends in 2d"
        />
        <StatsCard 
          title="Fuel Efficiency" 
          value="7.2 MPG" 
          icon={<Fuel size={22} />} 
          variant="off"
          trend="+0.4 vs last trip"
        />
        <StatsCard 
          title="Compliance Score" 
          value="100%" 
          icon={<ShieldCheck size={22} />} 
          variant="drive"
          trend="Certified"
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
            <span className={styles.badge}>Priority Cargo</span>
          </div>

          <div className={styles.loadRoute}>
            <div className={styles.routeStop}>
              <div className={styles.stopIndicator}>
                <div className={styles.stopCircle} />
                <div className={styles.stopLine} />
              </div>
              <div className={styles.stopContent}>
                <span className={styles.stopLabel}>Pickup</span>
                <span className={styles.stopName}>St. Louis Distribution (C.H. Robinson)</span>
                <span className={styles.stopTime}>Apr 04 • 08:30 AM</span>
              </div>
            </div>

            <div className={styles.routeStop}>
              <div className={styles.stopIndicator}>
                <div className={styles.stopCircleActive} />
              </div>
              <div className={styles.stopContent}>
                <span className={styles.stopLabel}>Destination</span>
                <span className={styles.stopName}>Oklahoma Port Authority Terminal</span>
                <span className={styles.stopTime}>Est. Apr 04 • 11:45 PM</span>
              </div>
            </div>
          </div>

          <div className={styles.loadFooter}>
            <div className={styles.loadInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Load ID</span>
                <span className={styles.infoValue}>LH-9021-AF</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Est. Revenue</span>
                <span className={styles.infoValue}>$4,200.00</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Distance</span>
                <span className={styles.infoValue}>241 mi left</span>
              </div>
            </div>
            <button className={styles.actionBtn}>
              View BOL <ChevronRight size={16} />
            </button>
          </div>
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
                <div className={styles.eventItem}>
                   <div className={styles.eventIcon} style={{ background: 'var(--status-drive)' }}><Truck size={14} /></div>
                   <div className={styles.eventContent}>
                      <span className={styles.eventText}>Status Change: Driving</span>
                      <span className={styles.eventTime}>Today, 8:42 AM</span>
                   </div>
                </div>
                <div className={styles.eventItem}>
                   <div className={styles.eventIcon} style={{ background: 'var(--surface-hover)' }}><Timer size={14} /></div>
                   <div className={styles.eventContent}>
                      <span className={styles.eventText}>Log Verified</span>
                      <span className={styles.eventTime}>Yesterday, 11:59 PM</span>
                   </div>
                </div>
             </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}
