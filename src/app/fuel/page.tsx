'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Fuel, 
  Map, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Navigation,
  FileUp,
  CreditCard,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import styles from './Fuel.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1 }
};

export default function FuelPage() {
  const [unit, setUnit] = useState<'US' | 'CAN'>('US');

  return (
    <motion.div 
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Fuel & Trip Performance</h1>
          <p className={styles.subtitle}>Track efficiency and expenses across the continent</p>
        </div>
        
        <div className={styles.actions}>
           <button className={styles.unitBtn} onClick={() => setUnit(u => u === 'US' ? 'CAN' : 'US')}>
              {unit === 'US' ? 'Gallons/Miles (US)' : 'Liters/KM (CAN)'}
           </button>
           <button className={styles.addBtn}>
              <Plus size={16} /> Log Fuel
           </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className={styles.statsRow}>
         <motion.div variants={item} className={`${styles.mainStat} glass`}>
            <div className={styles.statInfo}>
               <span className={styles.statLabel}>Avg. Fuel Economy</span>
               <h2 className={styles.statValue}>{unit === 'US' ? '7.2' : '32.6'} <span>{unit === 'US' ? 'MPG' : 'L/100km'}</span></h2>
               <div className={styles.statBadge}>
                  <TrendingDown size={14} /> -2% vs last month
               </div>
            </div>
            <Fuel size={48} className={styles.statIcon} />
         </motion.div>

         <motion.div variants={item} className={`${styles.mainStat} glass`}>
            <div className={styles.statInfo}>
               <span className={styles.statLabel}>Total Fuel Cost (MTD)</span>
               <h2 className={styles.statValue}>$3,421.15</h2>
               <div className={`${styles.statBadge} ${styles.statBad}`}>
                  <TrendingUp size={14} /> +12% price hike
               </div>
            </div>
            <CreditCard size={48} className={styles.statIcon} />
         </motion.div>
      </div>

      <div className={styles.grid}>
         {/* Trip History */}
         <div className={`${styles.section} glass`}>
            <div className={styles.sectionHeader}>
               <div className={styles.sectionTitle}>
                  <Map size={18} className={styles.accentIcon} />
                  <h3>Recent Trips</h3>
               </div>
               <button className={styles.viewMore}>History <ChevronRight size={14} /></button>
            </div>
            
            <div className={styles.tripList}>
               {[
                 { route: 'St. Louis to Tulsa', date: 'Apr 04', dist: '398 mi', time: '6h 15m' },
                 { route: 'Chicago to St. Louis', date: 'Apr 03', dist: '297 mi', time: '4h 45m' },
                 { route: 'Detroit to Chicago', date: 'Apr 02', dist: '282 mi', time: '4h 30m' },
               ].map((trip, idx) => (
                  <div key={idx} className={styles.tripItem}>
                     <div className={styles.tripDate}>
                        <Calendar size={14} /> <span>{trip.date}</span>
                     </div>
                     <div className={styles.tripRoute}>{trip.route}</div>
                     <div className={styles.tripMeta}>
                        <span className={styles.tripDist}>{trip.dist}</span>
                        <span className={styles.tripTime}>{trip.time}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Log Form Preview */}
         <div className={`${styles.section} glass`}>
            <div className={styles.sectionHeader}>
               <div className={styles.sectionTitle}>
                  <Navigation size={18} className={styles.accentIcon} />
                  <h3>Quick Fuel Log</h3>
               </div>
            </div>

            <form className={styles.quickForm}>
               <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                     <label>Amount ({unit === 'US' ? 'Gal' : 'L'})</label>
                     <input type="number" placeholder="00.00" />
                  </div>
                  <div className={styles.inputGroup}>
                     <label>Odometer</label>
                     <input type="number" placeholder="234,451" />
                  </div>
               </div>
               
               <div className={styles.inputGroup}>
                  <label>Service Station</label>
                  <input type="text" placeholder="Pilot Flying J #234" />
               </div>

               <div className={styles.uploadArea}>
                  <FileUp size={24} />
                  <span>Drop fuel receipt here or click to upload</span>
               </div>

               <button type="submit" className={styles.submitBtn}>Save Fuel Record</button>
            </form>
         </div>
      </div>
    </motion.div>
  );
}
