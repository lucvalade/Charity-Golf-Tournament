import { TOURNAMENT_SCHEDULE, EVENT_DETAILS } from '../data/initialData';

/**
 * Capitalizes the first letter of each word
 */
export const formatTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (!word) return '';
      return word.replace(/(^|[-/,])([a-z])/g, (_, boundary, char) => boundary + char.toUpperCase());
    })
    .join(' ');
};

/**
 * Format Canadian postal code as A1A 1A1
 * Alphanumeric alternating pattern ANA NAN with single space and no hyphens
 */
export const formatCanadianPostalCode = (val: string): string => {
  if (!val) return '';
  // Strip everything except letters and digits, convert to uppercase
  const raw = val.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);
  if (raw.length > 3) {
    return `${raw.slice(0, 3)} ${raw.slice(3)}`;
  }
  return raw;
};

/**
 * Validate Canadian Postal Code
 * Must match ANA NAN exactly with a single space and alternating letter-number pattern
 * Certain letters (D, F, I, O, Q, U) are generally excluded in Canadian postal codes,
 * but the standard pattern is [A-Z]\d[A-Z] \d[A-Z]\d
 */
export const isValidCanadianPostalCode = (val: string): boolean => {
  if (!val) return false;
  // Strictly alphanumeric alternating pattern ANA NAN with single space and no hyphens
  const regex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
  return regex.test(val.trim());
};

/**
 * Opens a print-optimized window for downloading/printing the Official Tournament Schedule as PDF (8.5" x 11")
 */
export const printTournamentSchedulePdf = () => {
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    window.print();
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Fragrant Breeze Golf Tournament - Itinerary</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Dancing+Script:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
        <style>
          @page {
            size: letter portrait; /* 8.5in x 11in */
            margin: 0;
          }
          * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            margin: 0;
            padding: 0;
            background-color: #fafaf9;
            font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #1e293b;
            display: flex;
            justify-content: center;
          }
          .sheet {
            width: 8.5in;
            height: 11in;
            max-width: 8.5in;
            max-height: 11in;
            margin: 0 auto;
            position: relative;
            background: #fafaf9;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 0.5in 0.6in 0.3in 0.6in;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
          .header-title-1 {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: #1e293b;
            margin: 0;
          }
          .header-title-2 {
            font-size: 13px;
            font-weight: 600;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            color: #475569;
            margin-top: 2px;
          }
          .script-itinerary {
            font-family: 'Dancing Script', 'Alex Brush', cursive;
            font-size: 66px;
            font-weight: 700;
            color: #0f172a;
            margin: 2px 0 4px 0;
            line-height: 1.05;
          }
          .header-date {
            font-size: 12.5px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: #1e293b;
            margin-bottom: 2px;
          }
          .header-venue {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #1E4D2B;
          }
          .header-address {
            font-size: 10px;
            color: #64748b;
            letter-spacing: 0.12em;
            margin-top: 1px;
          }
          .schedule-section {
            margin: auto 0;
            padding: 10px 0;
            display: flex;
            flex-direction: column;
            gap: 18px;
            text-align: center;
          }
          .event-item {
            max-width: 520px;
            margin: 0 auto;
          }
          .time-badge {
            display: inline-block;
            font-size: 13px;
            font-weight: 800;
            font-family: monospace;
            padding: 2px 14px;
            border-radius: 9999px;
            margin-bottom: 4px;
          }
          .time-badge-green {
            background: #dcfce7;
            color: #166534;
          }
          .time-badge-amber {
            background: #fef3c7;
            color: #92400e;
          }
          .time-badge-orange {
            background: #ffedd5;
            color: #9a3412;
          }
          .event-location {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            color: #334155;
            margin-bottom: 2px;
          }
          .event-sub-location {
            font-size: 10.5px;
            font-style: italic;
            color: #64748b;
            margin-bottom: 3px;
          }
          .event-title {
            font-size: 14.5px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 3px 0;
            font-family: 'Playfair Display', Georgia, serif;
          }
          .event-desc {
            font-size: 11px;
            color: #475569;
            line-height: 1.5;
            margin: 0;
          }
          .divider {
            width: 70px;
            height: 1px;
            background: #cbd5e1;
            margin: 0 auto;
          }
          .footer-note {
            font-size: 11px;
            font-style: italic;
            font-weight: 600;
            color: #334155;
            margin-bottom: 3px;
          }
          .footer-dedication {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #64748b;
          }
          @media print {
            body {
              background: #ffffff;
            }
            .sheet {
              width: 8.5in !important;
              height: 11in !important;
              padding: 0.4in 0.5in 0.2in 0.5in !important;
              box-shadow: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="sheet">
          <!-- Top Left Illustration: Argyle Golf Sweater / Vest -->
          <div style="position: absolute; top: 32px; left: 32px; width: 85px; height: 110px; pointer-events: none;">
            <svg viewBox="0 0 100 130" style="width: 100%; height: 100%;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 28 L38 35 L42 20 C46 25 54 25 58 20 L62 35 L80 28 L88 60 L80 62 L80 120 L20 120 L20 62 L12 60 Z" fill="#38bdf8" />
              <polygon points="50,45 68,65 50,85 32,65" fill="#0284c7" />
              <polygon points="50,85 68,105 50,120 32,105" fill="#0369a1" />
              <polygon points="26,45 38,58 26,71 14,58" fill="#0284c7" opacity="0.8" />
              <polygon points="74,45 86,58 74,71 62,58" fill="#0284c7" opacity="0.8" />
              <line x1="20" y1="35" x2="80" y2="105" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.9" />
              <line x1="80" y1="35" x2="20" y2="105" stroke="#ffffff" stroke-width="1.2" stroke-dasharray="3 2" opacity="0.9" />
              <path d="M38 35 L50 62 L62 35" stroke="#0369a1" stroke-width="3" fill="none" stroke-linecap="round" />
              <path d="M20 116 L80 116" stroke="#0369a1" stroke-width="4" />
            </svg>
          </div>

          <!-- Top Right Illustration: Golf Sunglasses -->
          <div style="position: absolute; top: 36px; right: 36px; width: 90px; height: 45px; pointer-events: none;">
            <svg viewBox="0 0 120 60" style="width: 100%; height: 100%;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 24 C14 14 38 12 55 20 C60 22 65 22 70 20 C87 12 111 14 115 24 C117 38 100 48 76 44 C68 42 63 35 60 35 C57 35 52 42 44 44 C20 48 3 38 10 24 Z" fill="#1e293b" />
              <path d="M5 24 C20 10 100 10 115 24" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round" />
              <ellipse cx="36" cy="30" rx="20" ry="12" fill="#0f172a" />
              <ellipse cx="84" cy="30" rx="20" ry="12" fill="#0f172a" />
              <path d="M22 25 Q35 20 48 26" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.7" />
              <path d="M72 25 Q85 20 98 26" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" opacity="0.7" />
            </svg>
          </div>

          <!-- Mid Left Illustration: Golf Iron -->
          <div style="position: absolute; top: 38%; left: 16px; width: 60px; height: 180px; pointer-events: none; opacity: 0.9;">
            <svg viewBox="0 0 60 180" style="width: 100%; height: 100%;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="28" y1="10" x2="30" y2="45" stroke="#1e293b" stroke-width="5" stroke-linecap="round" />
              <line x1="30" y1="45" x2="36" y2="140" stroke="#94a3b8" stroke-width="3" />
              <path d="M36 140 L38 152 C39 157 44 162 52 165 C57 167 56 172 48 172 C32 172 24 163 24 153 C24 148 34 140 36 140 Z" fill="#64748b" />
              <line x1="34" y1="158" x2="48" y2="164" stroke="#e2e8f0" stroke-width="1" />
              <line x1="33" y1="162" x2="46" y2="167" stroke="#e2e8f0" stroke-width="1" />
            </svg>
          </div>

          <!-- Mid Right Illustration: Leather Golf Bag -->
          <div style="position: absolute; top: 28%; right: 20px; width: 85px; height: 210px; pointer-events: none; opacity: 0.95;">
            <svg viewBox="0 0 90 200" style="width: 100%; height: 100%;" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="35" y1="35" x2="25" y2="10" stroke="#94a3b8" stroke-width="2.5" />
              <circle cx="23" cy="8" r="5" fill="#334155" />
              <line x1="45" y1="35" x2="48" y2="6" stroke="#94a3b8" stroke-width="2.5" />
              <rect x="42" y="3" width="12" height="7" rx="3" fill="#b91c1c" />
              <line x1="55" y1="35" x2="68" y2="14" stroke="#94a3b8" stroke-width="2.5" />
              <ellipse cx="71" cy="13" rx="7" ry="4" fill="#d97706" />
              <rect x="30" y="35" width="34" height="10" rx="3" fill="#78350f" />
              <path d="M30 45 L26 150 C26 158 35 165 47 165 C59 165 68 158 68 150 L64 45 Z" fill="#b45309" />
              <rect x="30" y="70" width="34" height="30" rx="4" fill="#92400e" stroke="#78350f" stroke-width="1.5" />
              <rect x="34" y="110" width="26" height="35" rx="4" fill="#92400e" stroke="#78350f" stroke-width="1.5" />
              <path d="M28 55 C12 80 14 125 26 145" stroke="#78350f" stroke-width="4" fill="none" stroke-linecap="round" />
              <circle cx="28" cy="55" r="2.5" fill="#fbbf24" />
              <circle cx="26" cy="145" r="2.5" fill="#fbbf24" />
            </svg>
          </div>

          <!-- Header Section -->
          <div style="text-align: center; margin-top: 10px;">
            <p class="header-title-1">Fragrant Breeze</p>
            <p class="header-title-2">Golf Tournament</p>
            <div class="script-itinerary">itinerary</div>
            <div class="header-date">Monday October 5, 2026</div>
            <div class="header-venue">Burford Golf Links Course</div>
            <div class="header-address">120 Golf Links Rd., Burford ON</div>
          </div>

          <!-- Schedule Items: 9:30 AM to 4:00 PM -->
          <div class="schedule-section">
            <!-- 9:30 AM -->
            <div class="event-item">
              <span class="time-badge time-badge-green">9:30 AM</span>
              <div class="event-location">New Restaurant in the Upper Level</div>
              <div class="event-sub-location">Championship Practice Green &amp; Chipping Area</div>
              <h3 class="event-title">Registration, Chipping and Putting Competition</h3>
              <p class="event-desc">
                Check-in, snacks will be provided, and official registration in Pro shop, chipping and putting competition (warm-up before the game).
              </p>
            </div>

            <div class="divider"></div>

            <!-- 11:00 AM -->
            <div class="event-item">
              <span class="time-badge time-badge-amber">11:00 AM</span>
              <div class="event-location">All 18 Holes</div>
              <h3 class="event-title">Tee off (Shotgun Start)</h3>
              <p class="event-desc">
                Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow).
              </p>
            </div>

            <div class="divider"></div>

            <!-- 4:00 PM -->
            <div class="event-item">
              <span class="time-badge time-badge-orange">4:00 PM</span>
              <div class="event-location">Restaurant in the Upper Level</div>
              <h3 class="event-title">FABULOUS Turkey Dinner</h3>
              <p class="event-desc">
                Dinner &amp; Donation option ($60) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner. Prizes and Trophy presentations, and memorial fundraising recap.
              </p>
            </div>
          </div>

          <!-- Bottom Footer Area -->
          <div style="text-align: center;">
            <div class="footer-note">
              golf equipment available to hire &bull; live mobile scoring
            </div>
            <div class="footer-dedication">
              In Loving Memory of Naseem Mohammed &bull; Benefiting Juravinski Cancer Research &amp; Canadian Red Cross
            </div>

            <!-- Putting Green Hill + Flag #1 + Ball + Red Golf Cart -->
            <div style="width: 100%; height: 95px; margin-top: 8px;">
              <svg viewBox="0 0 500 100" style="width: 100%; height: 100%;" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 70 Q120 40 260 58 T500 45 L500 100 L0 100 Z" fill="#4ade80" />
                <path d="M0 80 Q140 55 300 70 T500 60 L500 100 L0 100 Z" fill="#22c55e" />
                <path d="M0 90 Q160 70 340 82 T500 75 L500 100 L0 100 Z" fill="#15803d" />

                <!-- Flag & Hole -->
                <ellipse cx="60" cy="85" rx="8" ry="3.5" fill="#0f172a" opacity="0.8" />
                <line x1="60" y1="85" x2="60" y2="28" stroke="#ffffff" stroke-width="2" stroke-linecap="round" />
                <polygon points="60,28 36,36 60,44" fill="#dc2626" />
                <text x="51" y="38" fill="#ffffff" font-size="7" font-weight="bold" font-family="sans-serif">1</text>
                <circle cx="80" cy="86" r="3.5" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.6" />
                <ellipse cx="80" cy="89" rx="3.5" ry="1.2" fill="#0f172a" opacity="0.25" />

                <!-- Red Golf Cart -->
                <g transform="translate(380, 26)">
                  <path d="M15 35 L45 35 L50 25 L65 25 C68 25 72 29 72 35 L76 35 C78 35 80 37 80 40 L80 46 L8 46 L8 40 C8 37 10 35 15 35 Z" fill="#dc2626" />
                  <path d="M18 6 L65 6 C68 6 70 8 70 10 L68 12 L15 12 Z" fill="#ffffff" stroke="#cbd5e1" stroke-width="0.8" />
                  <line x1="22" y1="12" x2="20" y2="35" stroke="#94a3b8" stroke-width="1.5" />
                  <line x1="62" y1="12" x2="52" y2="25" stroke="#94a3b8" stroke-width="1.5" />
                  <rect x="24" y="24" width="16" height="12" rx="2" fill="#fef3c7" stroke="#d97706" stroke-width="0.6" />
                  <line x1="48" y1="23" x2="42" y2="29" stroke="#1e293b" stroke-width="2" />
                  <circle cx="22" cy="48" r="8" fill="#1e293b" />
                  <circle cx="22" cy="48" r="4" fill="#94a3b8" />
                  <circle cx="68" cy="48" r="8" fill="#1e293b" />
                  <circle cx="68" cy="48" r="4" fill="#94a3b8" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
