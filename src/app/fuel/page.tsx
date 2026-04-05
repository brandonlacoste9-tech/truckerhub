'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getFuelEntries, addFuelEntry } from '@/actions/data';
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

type FuelEntryType = {
  id: string;
  date: Date | string;
  amount: string;
  cost: string;
  odometer: string | null;
  location_name: string | null;
};

export default function FuelPage() {
  const [unit, setUnit] = useState<'US' | 'CAN'>('US');
  const [fuelEntries, setFuelEntries] = useState<FuelEntryType[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  // Form State
  const [amount, setAmount] = useState('');
  const [odometer, setOdometer] = useState('');
  const [locationName, setLocationName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFuel = async () => {
    try {
      const { data, error } = await getFuelEntries();
      if (error) throw new Error(error);
      
      const entries = (data as unknown as FuelEntryType[]) || [];
      setFuelEntries(entries);
      
      const total = entries.reduce((acc, entry) => acc + Number(entry.cost || 0), 0);
      setTotalCost(total);
    } catch (err) {
      console.error('Error fetching fuel entries:', err);
    }
  };

  useEffect(() => {
    fetchFuel();
  }, []);

  const handleAddFuel = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await addFuelEntry({
        driver_id: '123e4567-e89b-12d3-a456-426614174000',
        amount,
        odometer,
        location_name: locationName
      });
      if (error) {
        alert('Failed to log fuel entry: ' + error);
      } else {
        setAmount('');
        setOdometer('');
        setLocationName('');
        await fetchFuel();
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
               <span className={styles.statLabel}>Total Fuel Cost (All Time)</span>
               <h2 className={styles.statValue}>${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
               <div className={`${styles.statBadge} ${styles.statBad}`}>
                  <TrendingUp size={14} /> +12% price hike
               </div>
            </div>
            <CreditCard size={48} className={styles.statIcon} />
         </motion.div>
      </div>

      <div className={styles.grid}>
         {/* Fuel History */}
         <div className={`${styles.section} glass`}>
            <div className={styles.sectionHeader}>
               <div className={styles.sectionTitle}>
                  <Map size={18} className={styles.accentIcon} />
                  <h3>Recent Fuel Entries</h3>
               </div>
               <button className={styles.viewMore}>History <ChevronRight size={14} /></button>
            </div>
            
            <div className={styles.tripList}>
               {fuelEntries.length === 0 ? (
                  <div style={{ padding: '1rem', color: 'var(--text-dim)' }}>No fuel entries found.</div>
               ) : fuelEntries.map((entry, idx) => (
                  <div key={idx} className={styles.tripItem}>
                     <div className={styles.tripDate}>
                        <Calendar size={14} /> <span>{new Date(entry.date).toLocaleDateString()}</span>
                     </div>
                     <div className={styles.tripRoute}>{entry.location_name}</div>
                     <div className={styles.tripMeta}>
                        <span className={styles.tripDist}>{entry.amount} {unit === 'US' ? 'gal' : 'L'}</span>
                        <span className={styles.tripTime}>${entry.cost}</span>
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

            <form className={styles.quickForm} onSubmit={handleAddFuel}>
               <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                     <label>Amount ({unit === 'US' ? 'Gal' : 'L'})</label>
                     <input 
                       type="number" 
                       placeholder="00.00" 
                       value={amount}
                       onChange={(e) => setAmount(e.target.value)}
                       required
                     />
                  </div>
                  <div className={styles.inputGroup}>
                     <label>Odometer</label>
                     <input 
                       type="number" 
                       placeholder="234,451" 
                       value={odometer}
                       onChange={(e) => setOdometer(e.target.value)}
                       required
                     />
                  </div>
               </div>
               
               <div className={styles.inputGroup}>
                  <label>Service Station</label>
                  <input 
                    type="text" 
                    placeholder="Pilot Flying J #234" 
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
               </div>

               <div className={styles.uploadArea}>
                  <FileUp size={24} />
                  <span>Drop fuel receipt here or click to upload</span>
               </div>

               <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                 {isSubmitting ? 'Saving...' : 'Save Fuel Record'}
               </button>
            </form>
         </div>
      </div>
    </motion.div>
  );
}
