'use client';

import { motion } from 'framer-motion';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSearch,
  Download
} from 'lucide-react';
import styles from './Contracts.module.css';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export default function ContractsPage() {
  return (
    <motion.div 
      className={styles.container}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Contract Submissions</h1>
          <p className={styles.subtitle}>Secure documentation for brokers and carriers</p>
        </div>
        
        <div className={styles.actions}>
           <button className={styles.addBtn}>
              <Plus size={16} /> New Submission
           </button>
        </div>
      </header>

      <div className={styles.searchBar}>
        <div className={styles.inputWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input type="text" placeholder="Search load ID, broker name, or document type..." />
        </div>
        <button className={styles.filterBtn}>
           <Filter size={16} /> All Status
        </button>
      </div>

      <div className={styles.documentGrid}>
        {[
          { id: 'RC-99812', type: 'Rate Confirmation', broker: 'C.H. Robinson', date: 'Apr 04', status: 'Approved' },
          { id: 'RC-99741', type: 'Broker-Carrier Agreement', broker: 'TQL Logistics', date: 'Apr 03', status: 'Pending Review' },
          { id: 'BOL-85122', type: 'Bill of Lading', broker: 'Echo Logistics', date: 'Apr 02', status: 'Under Inspection' },
          { id: 'POD-84411', type: 'Proof of Delivery', broker: 'J.B. Hunt', date: 'Apr 01', status: 'Approved' }
        ].map((doc) => (
           <motion.div key={doc.id} variants={item} className={`${styles.docCard} glass`}>
              <div className={styles.docIcon}>
                 <FileText size={24} />
              </div>
              <div className={styles.docContent}>
                 <div className={styles.docTop}>
                    <h4 className={styles.docId}>{doc.id}</h4>
                    <span className={`${styles.statusPill} ${doc.status === 'Approved' ? styles.statusSuccess : styles.statusProgress}`}>
                       {doc.status}
                    </span>
                 </div>
                 <p className={styles.docType}>{doc.type} • {doc.broker}</p>
                 <div className={styles.docFooter}>
                    <span className={styles.docDate}>{doc.date}</span>
                    <div className={styles.docActions}>
                       <button title="View Detail"><FileSearch size={14} /></button>
                       <button title="Download"><Download size={14} /></button>
                    </div>
                 </div>
              </div>
           </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
