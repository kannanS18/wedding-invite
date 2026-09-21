import { CLOCK_CONFIG } from '../config';

export interface DynamicDateSteps {
  day: string[];
  date: string[];
  month: string[];
  year: string[];
}

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/**
 * Computes a dynamic split-flap cascade sequence that starts completely EMPTY (''),
 * takes the REAL CURRENT DATE dynamically from new Date(),
 * and rolls through the dates until it settles on the target wedding date (Sunday, 25 October 2026).
 */
export function getDynamicDateSteps(targetDate: Date = CLOCK_CONFIG.targetDate): DynamicDateSteps {
  const now = new Date();

  const curDayIdx = now.getDay();
  const targetDayIdx = targetDate.getDay();
  const curDayName = DAYS_OF_WEEK[curDayIdx];
  const targetDayName = DAYS_OF_WEEK[targetDayIdx];

  const curDateNum = now.getDate();
  const targetDateNum = targetDate.getDate();

  const curMonthIdx = now.getMonth();
  const targetMonthIdx = targetDate.getMonth();
  const curMonthName = MONTHS[curMonthIdx];
  const targetMonthName = MONTHS[targetMonthIdx];

  const curYear = now.getFullYear();
  const targetYear = targetDate.getFullYear();

  // 1. DAY sequence: curDayName -> ... -> targetDayName ('SUN')
  const daySteps: string[] = [];
  if (curDayName === targetDayName) {
    daySteps.push(DAYS_OF_WEEK[(targetDayIdx + 5) % 7]);
    daySteps.push(DAYS_OF_WEEK[(targetDayIdx + 6) % 7]);
    daySteps.push(targetDayName);
  } else {
    daySteps.push(curDayName);
    let d = (curDayIdx + 1) % 7;
    const intermediate: string[] = [];
    while (d !== targetDayIdx) {
      intermediate.push(DAYS_OF_WEEK[d]);
      d = (d + 1) % 7;
    }
    if (intermediate.length > 3) {
      const step1 = intermediate[Math.floor(intermediate.length / 3)];
      const step2 = intermediate[Math.floor((2 * intermediate.length) / 3)];
      daySteps.push(step1, step2, targetDayName);
    } else {
      daySteps.push(...intermediate, targetDayName);
    }
  }

  // 2. DATE sequence: curDateNum -> ... -> targetDateNum ('25')
  const dateSteps: string[] = [];
  if (curDateNum === targetDateNum) {
    const p1 = targetDateNum - 2 > 0 ? targetDateNum - 2 : 23;
    const p2 = targetDateNum - 1 > 0 ? targetDateNum - 1 : 24;
    dateSteps.push(String(p1), String(p2), String(targetDateNum));
  } else if (curDateNum < targetDateNum) {
    const diff = targetDateNum - curDateNum;
    if (diff <= 5) {
      for (let n = curDateNum; n <= targetDateNum; n++) {
        dateSteps.push(String(n));
      }
    } else {
      const step1 = curDateNum;
      const step2 = Math.round(curDateNum + diff * 0.35);
      const step3 = Math.round(curDateNum + diff * 0.7);
      const step4 = targetDateNum - 1;
      dateSteps.push(String(step1), String(step2), String(step3), String(step4), String(targetDateNum));
    }
  } else {
    // If today's date > 25
    dateSteps.push(String(curDateNum), '23', '24', String(targetDateNum));
  }

  // 3. MONTH sequence: curMonthName -> ... -> targetMonthName ('OCT')
  const monthSteps: string[] = [];
  if (curMonthIdx === targetMonthIdx) {
    const prevMonth = MONTHS[(targetMonthIdx + 11) % 12];
    monthSteps.push(prevMonth, targetMonthName);
  } else {
    monthSteps.push(curMonthName);
    let m = (curMonthIdx + 1) % 12;
    while (m !== targetMonthIdx && monthSteps.length < 4) {
      monthSteps.push(MONTHS[m]);
      m = (m + 1) % 12;
    }
    monthSteps.push(targetMonthName);
  }

  // 4. YEAR sequence: curYear -> ... -> targetYear ('2026')
  const yearSteps: string[] = [];
  if (curYear === targetYear) {
    yearSteps.push(String(targetYear - 1), String(targetYear));
  } else if (curYear < targetYear) {
    for (let y = curYear; y <= targetYear; y++) {
      yearSteps.push(String(y));
    }
  } else {
    yearSteps.push(String(curYear), String(targetYear));
  }

  return {
    day: daySteps,
    date: dateSteps,
    month: monthSteps,
    year: yearSteps,
  };
}
