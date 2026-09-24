/**
 * Utilities for auto-capitalizing titles, subject lines, email body paragraphs,
 * and form input normalization (team names, phone numbers, emails, URLs, cart numbers).
 */

/**
 * Capitalizes the first letter of every word (Title Case).
 * e.g. "fairway aces" -> "Fairway Aces"
 * e.g. "acme financial group" -> "Acme Financial Group"
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
}

/**
 * Capitalizes the first letter of each sentence in a text block,
 * handling sentence endings (. ! ?) and newlines.
 * e.g. "signage on tee #1. foursome included." -> "Signage on tee #1. Foursome included."
 */
export function capitalizeSentences(text: string): string {
  if (!text) return '';
  // Capitalize first non-whitespace letter
  let res = text.replace(/^(\s*)([a-z])/i, (_, space, char) => space + char.toUpperCase());
  // Capitalize letter after punctuation [.!?] followed by whitespace
  res = res.replace(/([.!?]\s+)([a-z])/g, (_, p, char) => p + char.toUpperCase());
  // Capitalize after newlines
  res = res.replace(/(\n\s*)([a-z])/g, (_, p, char) => p + char.toUpperCase());
  return res;
}

/**
 * Formats cart assignment:
 * - First letter of first word is capitalized (e.g. "cart" -> "Cart")
 * - If there is a letter after a number or # (e.g. "cart #6a" -> "Cart #6A", "cart 14b" -> "Cart 14B")
 */
export function formatCartAssignment(val: string): string {
  if (!val) return '';
  // Capitalize first letter
  let res = val.charAt(0).toUpperCase() + val.slice(1);
  // Ensure "Cart" word is capitalized
  res = res.replace(/^cart\b/i, 'Cart');
  // Capitalize letter following number or #number (e.g. 6a -> 6A, #6a -> #6A, 14b -> 14B)
  res = res.replace(/(#?\d+)\s*([a-z])/gi, (_, num, letter) => `${num}${letter.toUpperCase()}`);
  return res;
}

/**
 * Auto-formats a phone number as (###) ###-#### from typed input.
 */
export function formatPhoneNumber(val: string): string {
  const digits = val.replace(/\D/g, '').slice(0, 10);
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Checks if phone number matches strictly (###) ###-####
 */
export function isValidPhone(phone: string): boolean {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(phone.trim());
}

/**
 * Validates email with standard regex: ^[^\s@]+@[^\s@]+\.[^\s@]+$
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Normalizes website URL to ensure https:// prefix (e.g. https://sierravalley.example.com)
 */
export function formatWebsiteUrl(url: string): string {
  let trimmed = url.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  } else if (/^http:\/\//i.test(trimmed)) {
    trimmed = trimmed.replace(/^http:\/\//i, 'https://');
  }
  return trimmed;
}

/**
 * Validates website URL format: https://...
 */
export function isValidWebsiteUrl(url: string): boolean {
  if (!url || !url.trim()) return true; // Optional if empty
  return /^https:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+\.[a-zA-Z]{2,}(?:[^\s]*)?$/i.test(url.trim());
}

/**
 * Capitalizes the first letter of each paragraph in a text block,
 * intelligently skipping leading Markdown markers (*, -, •, **, >, #, spaces).
 */
export function capitalizeParagraphs(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');

  const processed = lines.map((line) => {
    if (!line.trim()) return line;

    const match = line.match(/^(\s*(?:[-*+•#>]+|\d+\.)?\s*(?:\*{1,2}|_{1,2})?\s*)([a-z])(.*)$/i);
    if (match) {
      const prefix = match[1];
      const firstChar = match[2];
      const rest = match[3];
      return prefix + firstChar.toUpperCase() + rest;
    }

    return line;
  });

  return processed.join('\n');
}
