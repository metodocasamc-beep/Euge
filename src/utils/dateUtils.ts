/**
 * Date and Time utilities for Método CASA.
 * Strictly implements Argentine Business Days (Días Hábiles) vs Calendar Days (Días Corridos)
 * and time calculations with America/Argentina/Buenos_Aires context.
 */

export function getNowInArgentina(): Date {
  // Return current Date object
  return new Date();
}

/**
 * Adds business days (lunes a viernes, excluding sábado y domingo)
 */
export function addBusinessDays(startDate: Date, businessDaysToAdd: number): Date {
  const result = new Date(startDate);
  let daysAdded = 0;
  
  while (daysAdded < businessDaysToAdd) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    // 0 is Sunday, 6 is Saturday
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      daysAdded++;
    }
  }
  return result;
}

/**
 * Adds calendar days (días corridos)
 */
export function addCalendarDays(startDate: Date, calendarDaysToAdd: number): Date {
  const result = new Date(startDate);
  result.setDate(result.getDate() + calendarDaysToAdd);
  return result;
}

/**
 * Adds hours to date
 */
export function addHours(startDate: Date, hours: number): Date {
  const result = new Date(startDate);
  result.setTime(result.getTime() + hours * 60 * 60 * 1000);
  return result;
}

/**
 * Checks if target appointment date/time is at least `minHoursNotice` ahead of now.
 * Default for Método CASA is 72 hours.
 */
export function isAtLeastNoticeHoursAhead(targetDateStr: string, targetTimeStr: string, minHoursNotice = 72): boolean {
  const target = new Date(`${targetDateStr}T${targetTimeStr}:00`);
  const now = getNowInArgentina();
  const diffHours = (target.getTime() - now.getTime()) / (1000 * 60 * 60);
  return diffHours >= minHoursNotice;
}

/**
 * Checks if client can reschedule (must be at least 24h before meeting)
 */
export function canRescheduleAppointment(appointmentDateStr: string, appointmentTimeStr: string, minNoticeHours = 24): {
  allowed: boolean;
  remainingHours: number;
  reason?: string;
} {
  const appointmentTime = new Date(`${appointmentDateStr}T${appointmentTimeStr}:00`);
  const now = getNowInArgentina();
  const diffHours = (appointmentTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (diffHours < minNoticeHours) {
    return {
      allowed: false,
      remainingHours: Math.max(0, Math.round(diffHours)),
      reason: `Las reprogramaciones requieren un mínimo de ${minNoticeHours} horas de anticipación. Faltan ${Math.max(0, Math.round(diffHours))} hs para la reunión.`
    };
  }
  return {
    allowed: true,
    remainingHours: Math.round(diffHours)
  };
}

/**
 * Calculate remaining time in friendly Spanish
 */
export function getRemainingTimeString(targetDateIso: string): {
  isExpired: boolean;
  text: string;
  daysRemaining: number;
  hoursRemaining: number;
} {
  const target = new Date(targetDateIso);
  const now = getNowInArgentina();
  const diffMs = target.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return {
      isExpired: true,
      text: 'Plazo cumplido',
      daysRemaining: 0,
      hoursRemaining: 0
    };
  }
  
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  
  if (days > 1) {
    return {
      isExpired: false,
      text: `${days} días y ${hours} hs restantes`,
      daysRemaining: days,
      hoursRemaining: hours
    };
  } else if (days === 1) {
    return {
      isExpired: false,
      text: `1 día y ${hours} hs restantes`,
      daysRemaining: 1,
      hoursRemaining: hours
    };
  } else {
    return {
      isExpired: false,
      text: `${totalHours} horas restantes`,
      daysRemaining: 0,
      hoursRemaining: totalHours
    };
  }
}

/**
 * Format date in Argentina style: "29 de Septiembre, 2026" or "Jueves 2 de Octubre, 16:00 hs"
 */
export function formatFriendlyDate(dateIsoOrObj: string | Date, includeTime = false): string {
  const d = typeof dateIsoOrObj === 'string' ? new Date(dateIsoOrObj) : dateIsoOrObj;
  
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  };
  
  const formattedDate = d.toLocaleDateString('es-AR', options);
  
  if (includeTime) {
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    };
    const formattedTime = d.toLocaleTimeString('es-AR', timeOptions);
    return `${formattedDate} · ${formattedTime} hs`;
  }
  
  return formattedDate;
}

export function formatShortDate(dateIsoOrObj: string | Date): string {
  const d = typeof dateIsoOrObj === 'string' ? new Date(dateIsoOrObj) : dateIsoOrObj;
  return d.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires'
  });
}

/**
 * Format currency in Argentine Pesos (ARS)
 */
export function formatARS(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}
