'use client';

import React from 'react';
import styles from './HOSGraph.module.css';

interface LogEntry {
  status: 'OFF' | 'SB' | 'D' | 'ON';
  start: number; // 0 to 24 (hours)
  end: number;   // 0 to 24 (hours)
}

interface HOSGraphProps {
  entries: LogEntry[];
}

const statusLevels = {
  OFF: 0,
  SB: 1,
  D: 2,
  ON: 3
};

const statusLabels = ['OFF', 'SB', 'D', 'ON'];

export default function HOSGraph({ entries }: HOSGraphProps) {
  const width = 800;
  const height = 160;
  const rowHeight = height / 4;
  const hourWidth = width / 24;

  const renderGrid = () => {
    const gridLines = [];
    for (let i = 0; i <= 24; i++) {
       const x = i * hourWidth;
       gridLines.push(
         <React.Fragment key={i}>
            <line x1={x} y1="0" x2={x} y2={height} className={styles.gridLine} strokeWidth={i % 6 === 0 ? 1 : 0.5} />
            <text x={x} y={height + 15} className={styles.gridLabel} textAnchor="middle">
              {i === 12 ? 'Noon' : i === 0 || i === 24 ? 'Mid' : i}
            </text>
         </React.Fragment>
       );
    }
    for (let j = 0; j < 4; j++) {
       const y = j * rowHeight;
       gridLines.push(
         <React.Fragment key={`row-${j}`}>
            <line x1="0" y1={y} x2={width} y2={y} className={styles.gridLine} />
            <text x="-10" y={y + rowHeight/2} className={styles.statusLabel} textAnchor="end" dominantBaseline="middle">
              {statusLabels[j]}
            </text>
         </React.Fragment>
       );
    }
    return gridLines;
  };

  const renderLogLines = () => {
    const paths: React.ReactNode[] = [];
    // Sort entries by start time just in case
    const sortedEntries = [...entries].sort((a, b) => a.start - b.start);

    sortedEntries.forEach((entry, idx) => {
      const x1 = entry.start * hourWidth;
      const x2 = entry.end * hourWidth;
      const level = statusLevels[entry.status];
      const y = level * rowHeight + rowHeight / 2;

      // Horizontal path
      paths.push(
        <line 
          key={`h-${idx}`} 
          x1={x1} y1={y} x2={x2} y2={y} 
          className={styles.logPath} 
          style={{ stroke: 'var(--accent)' }} 
        />
      );

      // Vertical connector to next entry
      const nextEntry = sortedEntries[idx + 1];
      if (nextEntry) {
         const nextLevel = statusLevels[nextEntry.status];
         const nextY = nextLevel * rowHeight + rowHeight / 2;
         paths.push(
            <line 
              key={`v-${idx}`} 
              x1={x2} y1={y} x2={x2} y2={nextY} 
              className={styles.logConnector} 
            />
         );
      }
    });

    return paths;
  };

  return (
    <div className={styles.container}>
      <div className={styles.graphWrapper}>
        <svg 
           viewBox={`-50 0 ${width + 60} ${height + 30}`} 
           className={styles.svg}
           preserveAspectRatio="xMidYMid meet"
        >
          <g className={styles.grid}>{renderGrid()}</g>
          <g className={styles.logs}>{renderLogLines()}</g>
        </svg>
      </div>
      
      {/* Summary Row */}
      <div className={styles.summary}>
         {statusLabels.map((status) => {
            const totalHours = entries
              .filter(e => e.status === status)
              .reduce((acc, curr) => acc + (curr.end - curr.start), 0);
            return (
              <div key={status} className={styles.summaryItem}>
                <span className={styles.summaryValue}>{totalHours.toFixed(1)}h</span>
                <span className={styles.summaryLabel}>{status}</span>
              </div>
            );
         })}
      </div>
    </div>
  );
}
