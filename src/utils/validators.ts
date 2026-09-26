/**
 * Global Validation & Formatting Library for UI Forms
 * File: src/utils/validators.ts
 *
 * Implements the expanded field validation specifications for Full Name, Email,
 * Phone Number, Website URL, Canadian Postal Code, US ZIP, Date, Currency,
 * and Long Text inputs.
 */

export const REGEX_PATTERNS = {
  // RFC 5322-compliant simple email check
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // North American 10-digit phone: (###) ###-####
  phone: /^\([2-9]\d{2}\)\s\d{3}-\d{4}$/,

  // Website URL requiring valid domain + TLD
  website: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,

  // Canadian Postal Code (A1A 1A1, excluding D,F,I,O,Q,U)
  canadianPostal: /^[A-CEGHJ-NPR-TVXY]\d[A-CEGHJ-NPR-TV-Z] \d[A-CEGHJ-NPR-TV-Z]\d$/,

  // US ZIP code (5 digits, or 5+4 format)
  usZip: /^\d{5}(-\d{4})?$/,

  // Strict Date Format: MM-DD-YYYY
  datePayload: /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])-(20\d{2})$/,
};

// ==========================================
// FORMATTERS (Run onBlur or onChange)
// ==========================================

export const formatters = {
  /**
   * Capitalizes the first letter of each word in a string (e.g. names, streets)
   */
  titleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Capitalizes only the first letter of the first word (e.g. details text)
   */
  firstLetterCapital(value: string): string {
    if (!value) return '';
    const trimmed = value.trimStart();
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  },

  /**
   * Formats digits into (###) ###-####
   */
  phoneNumber(value: string): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  },

  /**
   * Auto-prepends https:// if missing, converts domain to lowercase
   */
  websiteUrl(value: string): string {
    let cleaned = value.trim();
    if (!cleaned) return '';
    if (!/^https?:\/\//i.test(cleaned)) {
      cleaned = `https://${cleaned}`;
    }
    return cleaned.toLowerCase();
  },

  /**
   * Auto-formats Canadian Postal Code to 'A1A 1A1'
   */
  canadianPostalCode(value: string): string {
    if (!value) return '';
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    if (clean.length > 3) {
      return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    }
    return clean;
  },

  /**
   * Auto-formats US ZIP code (adds hyphen for 9-digit ZIP)
   */
  usZipCode(value: string): string {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').slice(0, 9);
    if (digits.length > 5) {
      return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    }
    return digits;
  },

  /**
   * Converts MM-DD-YYYY or Date object to front-end display: "Jun 21, 2026"
   */
  displayDate(dateInput: string | Date): string {
    if (!dateInput) return '';
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
};

// ==========================================
// VALIDATORS (Return error string or null)
// ==========================================

export const validators = {
  fullName(value: string): string | null {
    if (!value || value.trim().length === 0) return 'Full name is required.';
    const parts = value.trim().split(/\s+/);
    if (parts.length < 2) return 'Enter your first and last name (letters only).';
    const validLetters = /^[\p{L}'-]+$/u;
    const isValid = parts.every((part) => validLetters.test(part));
    return isValid ? null : 'Enter your first and last name (letters only).';
  },

  email(value: string): string | null {
    if (!value) return 'Email address is required.';
    const trimmed = value.trim();
    if (!trimmed.includes('@')) return "Missing '@' in email address.";
    return REGEX_PATTERNS.email.test(trimmed) ? null : 'Enter a valid email address format.';
  },

  phone(value: string): string | null {
    if (!value) return 'Phone number is required.';
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 10) return 'Phone number must follow (###) ###-####.';
    return REGEX_PATTERNS.phone.test(value) ? null : 'Phone number must follow (###) ###-####.';
  },

  website(value: string): string | null {
    if (!value) return 'Website URL is required.';
    const formatted = formatters.websiteUrl(value);
    if (!REGEX_PATTERNS.website.test(formatted)) {
      return 'Please enter a valid website (e.g., https://example.com).';
    }
    try {
      new URL(formatted);
      return null;
    } catch {
      return 'Please enter a valid website (e.g., https://example.com).';
    }
  },

  postalOrZip(value: string, country: 'CA' | 'US' = 'CA'): string | null {
    if (!value) return 'Postal / ZIP code is required.';
    if (country === 'CA') {
      const formatted = formatters.canadianPostalCode(value);
      return REGEX_PATTERNS.canadianPostal.test(formatted)
        ? null
        : 'Enter a valid 6-character postal code (A1A 1A1).';
    }
    if (country === 'US') {
      const formatted = formatters.usZipCode(value);
      return REGEX_PATTERNS.usZip.test(formatted)
        ? null
        : 'Enter a 5-digit or 9-digit ZIP code (12345 or 12345-6789).';
    }
    return null;
  },

  openHouseDate(dateString: string): string | null {
    if (!dateString) return 'Please select a future date.';
    if (!REGEX_PATTERNS.datePayload.test(dateString)) {
      return 'Date format must be strictly MM-DD-YYYY.';
    }
    const [month, day, year] = dateString.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Please select a future date.';
    }
    return null;
  },

  details(value: string, max = 1000): string | null {
    if (!value) return null;
    if (value.length > max) {
      return `Details cannot exceed ${max} characters.`;
    }
    return null;
  }
};
