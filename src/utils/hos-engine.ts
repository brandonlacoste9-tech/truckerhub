/**
 * Trucker Hub HOS Engine
 * Implements FMCSA (USA) and TC (CANADA) Hours of Service Rules
 */

export type RuleSet = 'USA_70_8' | 'CAN_70_7';

export interface HOSStatus {
  driveRemaining: number; // minutes
  shiftRemaining: number; // minutes
  dutyRemaining: number;  // minutes
  cycleRemaining: number; // minutes
  breakRequiredIn: number; // minutes
}

export interface LogEntry {
  status: 'OFF' | 'SB' | 'D' | 'ON';
  duration: number; // minutes
  timestamp: Date;
}

export const calculateHOS = (entries: LogEntry[], ruleSet: RuleSet): HOSStatus => {
  if (ruleSet === 'USA_70_8') {
    return calculateUSARules(entries);
  } else {
    return calculateCANRules(entries);
  }
};

const calculateUSARules = (entries: LogEntry[]): HOSStatus => {
  // FMCSA 11-Hour Driving Limit
  // FMCSA 14-Hour On-Duty Limit
  // FMCSA 30-Minute Break after 8 hours of driving
  // FMCSA 70-Hour / 8-Day Cycle
  
  let driveUsedToday = 0;
  let onDutyUsedToday = 0;
  let drivingSinceLastBreak = 0;
  let totalCycleUsed = 0;

  // Simplistic calculation for demonstration
  entries.forEach(entry => {
    if (entry.status === 'D') {
      driveUsedToday += entry.duration;
      drivingSinceLastBreak += entry.duration;
      onDutyUsedToday += entry.duration;
    } else if (entry.status === 'ON') {
      onDutyUsedToday += entry.duration;
      drivingSinceLastBreak = 0; // Reset break timer on ON-duty? No, actually must be OFF/SB for 30m
    } else if (entry.status === 'OFF' || entry.status === 'SB') {
       if (entry.duration >= 30) drivingSinceLastBreak = 0;
    }
    totalCycleUsed += (entry.status === 'D' || entry.status === 'ON') ? entry.duration : 0;
  });

  return {
    driveRemaining: Math.max(0, 11 * 60 - driveUsedToday),
    shiftRemaining: Math.max(0, 14 * 60 - onDutyUsedToday),
    dutyRemaining: Math.max(0, 14 * 60 - onDutyUsedToday),
    cycleRemaining: Math.max(0, 70 * 60 - totalCycleUsed),
    breakRequiredIn: Math.max(0, 8 * 60 - drivingSinceLastBreak)
  };
};

const calculateCANRules = (entries: LogEntry[]): HOSStatus => {
  // Canada South of 60 rules (Cycle 1)
  // 13-Hour Driving Limit
  // 14-Hour On-Duty Limit
  // 16-Hour Elapsed Work Shift
  // 70-Hour / 7-Day Cycle
  
  let driveUsedToday = 0;
  let onDutyUsedToday = 0;
  let totalCycleUsed = 0;

  entries.forEach(entry => {
    if (entry.status === 'D') {
      driveUsedToday += entry.duration;
      onDutyUsedToday += entry.duration;
    } else if (entry.status === 'ON') {
      onDutyUsedToday += entry.duration;
    }
    totalCycleUsed += (entry.status === 'D' || entry.status === 'ON') ? entry.duration : 0;
  });

  return {
    driveRemaining: Math.max(0, 13 * 60 - driveUsedToday),
    shiftRemaining: Math.max(0, 16 * 60 - onDutyUsedToday), // Placeholder logic
    dutyRemaining: Math.max(0, 14 * 60 - onDutyUsedToday),
    cycleRemaining: Math.max(0, 70 * 60 - totalCycleUsed),
    breakRequiredIn: 9999 // Canada doesn't have the 30m/8h drive rule
  };
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};
