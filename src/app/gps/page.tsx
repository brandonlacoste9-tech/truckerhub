'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Truck, 
  Search, 
  Wifi, 
  Battery, 
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import styles from './GPS.module.css';

export default function GPSPage() {
  return (
    <div className={styles.container}>
      <div className={`${styles.mapContainer} glass`}>
         {/* Map Simulation - Fully custom industrial lookup */}
         <div className={styles.mapStub}>
            <div className={styles.mapControls}>
               <button><ZoomIn size={18} /></button>
               <button><ZoomOut size={18} /></button>
               <button><Layers size={18} /></button>
               <button><Maximize2 size={18} /></button>
            </div>

            {/* Truck Pin Simulation */}
            <div className={styles.truckPin}>
               <Truck size={32} />
               <div className={styles.truckAura} />
            </div>

            <div className={styles.overlay}>
               <div className={styles.searchBar}>
                  <Search size={18} />
                  <input type="text" placeholder="Search address, ELD station, or truck stop..." />
               </div>
            </div>

            <div className={styles.statusPanel}>
               <div className={styles.panelRow}>
                  <div className={styles.panelItem}>
                     <div className={styles.pLabel}>Speed</div>
                     <div className={styles.pValue}>68 <span>MPH</span></div>
                  </div>
                  <div className={styles.panelItem}>
                     <div className={styles.pLabel}>Heading</div>
                     <div className={styles.pValue}>NW <span>290°</span></div>
                  </div>
                  <div className={styles.panelItem}>
                     <div className={styles.pLabel}>Altitude</div>
                     <div className={styles.pValue}>1,241 <span>FT</span></div>
                  </div>
               </div>
               
               <div className={styles.locationSummary}>
                  <div className={styles.lTitle}>I-44 Westbound</div>
                  <div className={styles.lSubtitle}>Near Springfield, MO • Mile Marker 78</div>
               </div>
            </div>

            <div className={styles.telemetry}>
               <div className={styles.telItem}>
                  <Wifi size={14} className={styles.telGood} /> <span>LTE</span>
               </div>
               <div className={styles.telItem}>
                  <Battery size={14} className={styles.telGood} /> <span>94%</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
