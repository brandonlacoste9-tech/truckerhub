'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLoads } from '@/actions/data';
import { 
  Package, 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  ArrowRight,
  DollarSign,
  Clock
} from 'lucide-react';
import styles from './Loads.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

type Load = {
  id: string;
  status: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  pickup_time: Date | string;
  delivery_time: Date | string;
  weight: string;
  rate: string;
};

export default function LoadsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'market' | 'history'>('current');
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const { data, error } = await getLoads();
        if (error) throw new Error(error);
        setLoads((data as unknown as Load[]) || []);
      } catch (err) {
        console.error('Error fetching loads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLoads();
  }, []);

  const activeLoads = loads.filter(l => l.status === 'available' || l.status === 'booked' || l.status === 'in-transit');
  const historyLoads = loads.filter(l => l.status === 'delivered' || l.status === 'paid');

  return (
    <motion.div 
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Dispatch & Loads</h1>
          <p className={styles.subtitle}>Manage your revenue and delivery schedule</p>
        </div>
        
        <div className={styles.controls}>
           <div className={styles.searchBox}>
              <Search size={16} className={styles.searchIcon} />
              <input type="text" placeholder="Search load ID, destination..." />
           </div>
           <button className={styles.filterBtn}>
              <Filter size={16} /> Filters
           </button>
        </div>
      </header>

      {/* Tabs Layout */}
      <div className={styles.tabs}>
         <button onClick={() => setActiveTab('current')} className={activeTab === 'current' ? styles.activeTab : ''}>
            Active Loads <span>{activeLoads.length}</span>
         </button>
         <button onClick={() => setActiveTab('market')} className={activeTab === 'market' ? styles.activeTab : ''}>
            Load Board <span>48</span>
         </button>
         <button onClick={() => setActiveTab('history')} className={activeTab === 'history' ? styles.activeTab : ''}>
            Completed <span>{historyLoads.length}</span>
         </button>
      </div>

      <div className={styles.mainGrid}>
         {/* Sidebar Stats */}
         <aside className={styles.sidebar}>
            <div className={`${styles.statsBox} glass`}>
               <h4 className={styles.smallTitle}>Week Overview</h4>
               <div className={styles.smallStat}>
                  <span className={styles.statLabel}>Revenue</span>
                  <span className={styles.statValue}>$4,850.00</span>
               </div>
               <div className={styles.smallStat}>
                  <span className={styles.statLabel}>Total Miles</span>
                  <span className={styles.statValue}>1,420 mi</span>
               </div>
               <div className={styles.smallStat}>
                  <span className={styles.statLabel}>Avg Rate</span>
                  <span className={styles.statValue}>$3.41/mi</span>
               </div>
            </div>

            <div className={`${styles.checklist} glass`}>
               <h4 className={styles.smallTitle}>Missing Paperwork</h4>
               <div className={styles.checkItem}>
                  <AlertCircle size={14} className={styles.warnIcon} />
                  <span>POD for Load #LH-8512</span>
               </div>
            </div>
         </aside>

         {/* Content Area */}
         <div className={styles.content}>
            {activeTab === 'current' && (
               <div className={styles.loadList}>
                  {loading ? (
                    <div className={styles.emptyState} style={{ padding: '2rem' }}>
                      <p>Loading active loads...</p>
                    </div>
                  ) : activeLoads.length === 0 ? (
                    <div className={styles.emptyState}>
                      <div className={styles.emptyIcon}><Package size={48} /></div>
                      <h3>No Active Loads</h3>
                      <p>You don&apos;t have any loads right now. Check the Load Board.</p>
                    </div>
                  ) : activeLoads.map((load) => (
                     <motion.div key={load.id} variants={item} className={`${styles.loadCard} glass`}>
                        <div className={styles.cardHeader}>
                           <div className={styles.idGroup}>
                              <span className={styles.loadId}>{load.id.substring(0, 8).toUpperCase()}</span>
                              <span className={`${styles.statusPill} ${load.status === 'in-transit' ? styles.statusTransit : styles.statusAssigned}`}>
                                 {load.status.replace('-', ' ').toUpperCase()}
                              </span>
                           </div>
                           <button className={styles.moreBtn}><MoreVertical size={16} /></button>
                        </div>
                        
                        <div className={styles.routePreview}>
                           <div className={styles.stop}>
                              <MapPin size={14} className={styles.stopIcon} />
                              <div className={styles.stopInfo}>
                                 <span className={styles.stopLabel}>Pickup</span>
                                 <span className={styles.stopCity}>{load.origin_city}, {load.origin_state}</span>
                              </div>
                           </div>
                           <ArrowRight className={styles.routeArrow} size={18} />
                           <div className={styles.stop}>
                              <MapPin size={14} className={styles.stopIcon} />
                              <div className={styles.stopInfo}>
                                 <span className={styles.stopLabel}>Delivery</span>
                                 <span className={styles.stopCity}>{load.destination_city}, {load.destination_state}</span>
                              </div>
                           </div>
                        </div>

                        <div className={styles.cardFooter}>
                           <div className={styles.metaRow}>
                              <div className={styles.meta}>
                                 <DollarSign size={14} /> <span>${load.rate}</span>
                              </div>
                              <div className={styles.meta}>
                                 <Truck size={14} /> <span>{load.weight} lbs</span>
                              </div>
                              <div className={styles.meta}>
                                 <Clock size={14} /> <span>{new Date(load.pickup_time).toLocaleDateString()}</span>
                              </div>
                           </div>
                           <button className={styles.detailsBtn}>View Manifest</button>
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}

            {activeTab === 'market' && (
               <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}><Package size={48} /></div>
                  <h3>Load Board Integration</h3>
                  <p>Open load board with DAT and Truckstop.com APIs requires premium subscription.</p>
                  <button className={styles.primaryBtn}>Initialize Load Board</button>
               </div>
            )}
         </div>
      </div>
    </motion.div>
  );
}

function MoreVertical({ size }: { size: number }) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  );
}

function AlertCircle({ size, className }: { size: number, className?: string }) {
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
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
