import { SponsorPackage, SponsorRecord, RegistrationRecord, DonationRecord, LeaderboardTeam, EventScheduleItem } from '../types';

export const EVENT_DETAILS = {
  name: "Saied October Charity Golf Tournament",
  year: "October 2026",
  dateString: "Monday, October 5, 2026",
  isoDate: "2026-10-05T09:30:00",
  venue: {
    name: "Burford Golf Links Course",
    websiteUrl: "https://golfnorth.ca/burford/",
    address: "120 Golf Links Rd, Burford, ON N0E 1A0",
    courseRating: "71.8 / Slope 126 • 18-Hole Championship Layout",
    mapQuery: "Burford+Golf+Links",
    mapsUrl: "https://www.google.com/maps/place/Burford+Golf+Links/@43.1372601,-80.4660569,17z/data=!3m1!4b1!4m6!3m5!1s0x882c14c8d1531a5f:0x69ddaaae88c6605d!8m2!3d43.1372562!4d-80.4634766!16s%2Fg%2F1tfv15qz?entry=ttu&g_ep=EgoyMDI2MDgzMC4wIKXMDSoASAFQAw%3D%3D",
  },
  goalAmount: 20000,
  founder: "Saied Mohammed",
  email: "ms_smnm@outlook.com",
  phone: "(905) 818-2005",
  memorialHonoree: "Naseem Mohammed",
  beneficiaryOrg: "Naseem Hope for Juravinski Breast Cancer Research & Canadian Red Cross – Fire & Flood",
  taxId: "84-9182740",
  squabbitCode: "SAIED-OCT-2026",
  squabbitUrl: "https://squabbitgolf.com/",
};

export const SPONSORSHIP_PACKAGES: SponsorPackage[] = [
  {
    id: 'presenting',
    name: 'Presenting Title Sponsor',
    amount: 10000,
    description: 'Premier top-tier tournament billing with maximum brand exclusivity and speaking opportunity.',
    spotsTotal: 2,
    spotsRemaining: 1,
    foursomesIncluded: 2,
    badgeColor: 'border-[#D4AF37] bg-gradient-to-br from-amber-50 to-yellow-100/60 text-amber-950',
    benefits: [
      'Two (2) Complimentary Tournament Foursomes (8 Golfers total)',
      '"Presented by [Your Company]" on all marketing, website & signage',
      'Exclusive Logo on official Squabbit Tournament Leaderboard header',
      'Speaking & Award presentation slot during the Awards Banquet',
      'Custom Clubhouse Banner + 2 Exclusive Hole Pin Flags',
      'Featured Company Spotlight in Memorial Program book',
      'VIP Reserved Table at the Clubhouse Reception'
    ]
  },
  {
    id: 'eagle',
    name: 'Memorial Eagle Sponsor',
    amount: 5000,
    description: 'High-visibility tournament sponsorship honoring our philanthropic mission.',
    spotsTotal: 4,
    spotsRemaining: 2,
    foursomesIncluded: 1,
    badgeColor: 'border-emerald-600 bg-emerald-50/70 text-emerald-950',
    benefits: [
      'One (1) Complimentary Tournament Foursome (4 Golfers)',
      'Official Banquet Luncheon & Welcome Refreshments Co-Sponsor',
      'Prominent On-Course Banner & Custom Tee-Box Sign',
      'Logo displayed on digital leaderboards & player carts',
      'Full-page feature in the commemorative tournament program',
      'Promotional item inclusion in all player gift bags'
    ]
  },
  {
    id: 'birdie',
    name: 'Birdie & Beverage Cart Sponsor',
    amount: 2500,
    description: 'Branded presence across the roving beverage fleet & specialty hospitality holes.',
    spotsTotal: 6,
    spotsRemaining: 3,
    foursomesIncluded: 0,
    badgeColor: 'border-sky-600 bg-sky-50/70 text-sky-950',
    benefits: [
      'Two (2) Individual Golfer Entries or 4 Banquet Passes',
      'Exclusive Branded Signage on on-course roaming Beverage Carts',
      'Hole #9 & #18 Hospitality Station Brand Showcase',
      'Logo on tournament website & sponsor appreciation banner',
      'Half-page dedication in tournament program'
    ]
  },
  {
    id: 'hole',
    name: 'Hole & Tee Box Sponsor',
    amount: 1000,
    description: 'Dedicated hole sponsorship on one of 18 championship tee boxes.',
    spotsTotal: 18,
    spotsRemaining: 7,
    foursomesIncluded: 0,
    badgeColor: 'border-slate-400 bg-slate-50 text-slate-900',
    benefits: [
      'Custom 24"x18" full-color Tee Box Sign at designated hole',
      'Opportunity to host a table or activity on your sponsored hole',
      'Recognition in tournament program and website sponsor roll',
      'Two (2) complimentary Luncheon & Banquet tickets'
    ]
  },
  {
    id: 'contest',
    name: 'Skill Contest Sponsor',
    amount: 500,
    description: 'Sponsor the Longest Drive, Closest to Pin, or Putting Shootout.',
    spotsTotal: 6,
    spotsRemaining: 2,
    foursomesIncluded: 0,
    badgeColor: 'border-amber-400 bg-amber-50/50 text-amber-900',
    benefits: [
      'Exclusive signage at the Contest Green or Putting Range',
      'Present the trophy / prize pack to contest winner at Awards',
      'Listing on website sponsor directory and program guide'
    ]
  }
];

export const INITIAL_SPONSORS: SponsorRecord[] = [
  {
    id: 'sp-1',
    companyName: 'Pacific Rim Capital Management',
    contactName: 'David Sterling',
    email: 'dsterling@pacificrimcap.com',
    phone: '(555) 382-9011',
    tier: 'eagle',
    websiteUrl: 'https://pacificrimcap.example.com',
    pledgedAt: '2026-06-15T10:00:00Z',
    status: 'confirmed',
    customNote: 'Proud to stand alongside Saied in memory of Naseem.'
  },
  {
    id: 'sp-2',
    companyName: 'Apex Health Systems & BioTech',
    contactName: 'Elena Rostova',
    email: 'elena.rostova@apexhealth.example.com',
    phone: '(555) 774-2900',
    tier: 'birdie',
    websiteUrl: 'https://apexhealth.example.com',
    pledgedAt: '2026-07-02T14:30:00Z',
    status: 'confirmed',
    customNote: 'Dedicated to supporting oncological care.'
  },
  {
    id: 'sp-3',
    companyName: 'Falcon Crest Golf Apparel',
    contactName: 'Marcus Vance',
    email: 'mvance@falconcrest.example.com',
    phone: '(555) 891-4432',
    tier: 'hole',
    pledgedAt: '2026-07-10T09:15:00Z',
    status: 'confirmed',
  },
  {
    id: 'sp-4',
    companyName: 'Sierra Valley Wealth Advisory',
    contactName: 'Karen Miller',
    email: 'karen@sierravalley.example.com',
    phone: '(555) 431-8899',
    tier: 'contest',
    pledgedAt: '2026-07-22T11:00:00Z',
    status: 'confirmed',
  }
];

export const INITIAL_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'reg-101',
    type: 'foursome',
    teamName: 'The Fairway Eagles',
    primaryContact: {
      id: 'p-1',
      name: 'Saied Mohammed',
      email: 'saied.m@charitygolf.org',
      phone: '(555) 123-4567',
      handicap: '10.2',
      shirtSize: 'L',
      dietaryRestrictions: 'None'
    },
    additionalPlayers: [
      { id: 'p-2', name: 'Tariq Mohammed', email: 'tariq@example.com', phone: '(555) 123-4568', handicap: '8.5', shirtSize: 'L' },
      { id: 'p-3', name: 'Zayn Al-Mansoor', email: 'zayn@example.com', phone: '(555) 123-4569', handicap: '14.0', shirtSize: 'XL' },
      { id: 'p-4', name: 'Kareem Vance', email: 'kareem@example.com', phone: '(555) 123-4570', handicap: '11.8', shirtSize: 'M' }
    ],
    addons: {
      mulligansCount: 6,
      rafflePacks10: 2,
      rafflePacks25: 1,
      puttingContestCount: 4,
      tigerDriveCount: 2
    },
    totalAmount: 1210,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'SAIED-9042',
    registeredAt: '2026-06-10T14:20:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1A & #1B',
    assignedStartingHole: 1,
    notes: 'Tournament Founder & Memorial Host Team'
  },
  {
    id: 'reg-102',
    type: 'foursome',
    teamName: 'Pacific Rim Ballers',
    primaryContact: {
      id: 'p-5',
      name: 'David Sterling',
      email: 'dsterling@pacificrimcap.com',
      phone: '(555) 382-9011',
      handicap: '6.4',
      shirtSize: 'XL'
    },
    additionalPlayers: [
      { id: 'p-6', name: 'Robert Callahan', email: 'rcallahan@example.com', phone: '(555) 382-9012', handicap: '12.0', shirtSize: 'L' },
      { id: 'p-7', name: 'James Morrison', email: 'jmorrison@example.com', phone: '(555) 382-9013', handicap: '9.2', shirtSize: 'L' },
      { id: 'p-8', name: 'Brian O\'Connor', email: 'boconnor@example.com', phone: '(555) 382-9014', handicap: '15.5', shirtSize: '2XL' }
    ],
    addons: {
      mulligansCount: 8,
      rafflePacks10: 0,
      rafflePacks25: 2,
      puttingContestCount: 4,
      tigerDriveCount: 4
    },
    totalAmount: 1290,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'SAIED-8813',
    registeredAt: '2026-06-16T11:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #2A & #2B',
    assignedStartingHole: 2
  },
  {
    id: 'reg-103',
    type: 'foursome',
    teamName: 'Birdie Brigade',
    primaryContact: {
      id: 'p-9',
      name: 'Dr. Michael Hayes',
      email: 'dr.hayes@valleyhealth.org',
      phone: '(555) 902-1144',
      handicap: '14.2',
      shirtSize: 'M'
    },
    additionalPlayers: [
      { id: 'p-10', name: 'Dr. Kenneth Cole', email: 'kcole@example.com', phone: '(555) 902-1145', handicap: '16.0', shirtSize: 'L' },
      { id: 'p-11', name: 'Dr. Patricia Wu', email: 'pwu@example.com', phone: '(555) 902-1146', handicap: '18.4', shirtSize: 'S' },
      { id: 'p-12', name: 'Dr. Amanda Scott', email: 'ascott@example.com', phone: '(555) 902-1147', handicap: '13.0', shirtSize: 'M' }
    ],
    addons: {
      mulligansCount: 6,
      rafflePacks10: 2,
      rafflePacks25: 1,
      puttingContestCount: 4,
      tigerDriveCount: 0
    },
    totalAmount: 1150,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'SAIED-7301',
    registeredAt: '2026-07-05T09:30:00Z',
    checkedIn: false,
    assignedCart: 'Cart #3A & #3B',
    assignedStartingHole: 3
  },
  {
    id: 'reg-104',
    type: 'individual',
    primaryContact: {
      id: 'p-13',
      name: 'Samantha Reed',
      email: 'samantha.reed@example.com',
      phone: '(555) 441-2099',
      handicap: '11.0',
      shirtSize: 'M',
      dietaryRestrictions: 'Vegetarian'
    },
    additionalPlayers: [],
    addons: {
      mulligansCount: 3,
      rafflePacks10: 1,
      rafflePacks25: 0,
      puttingContestCount: 1,
      tigerDriveCount: 1
    },
    totalAmount: 370,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'SAIED-5520',
    registeredAt: '2026-07-18T16:40:00Z',
    checkedIn: false,
    assignedCart: 'Cart #4A',
    assignedStartingHole: 4
  },
  {
    id: 'reg-105',
    type: 'foursome',
    teamName: 'Hamilton Links Crew',
    primaryContact: {
      id: 'p-14',
      name: 'Robert Jenkins',
      email: 'rjenkins@hamiltonlinks.ca',
      phone: '(905) 555-0144',
      handicap: '15.4',
      shirtSize: 'XL',
      dietaryRestrictions: 'Gluten-Free'
    },
    additionalPlayers: [
      { id: 'p-15', name: 'Mark Evans', email: 'mevans@hamiltonlinks.ca', phone: '(905) 555-0145', handicap: '18.0', shirtSize: 'L' },
      { id: 'p-16', name: 'Gary Peterson', email: 'gpeterson@hamiltonlinks.ca', phone: '(905) 555-0146', handicap: '12.6', shirtSize: '2XL' },
      { id: 'p-17', name: 'Paul MacIntyre', email: 'pmacintyre@hamiltonlinks.ca', phone: '(905) 555-0147', handicap: '20.1', shirtSize: 'L' }
    ],
    addons: {
      mulligansCount: 6,
      rafflePacks10: 2,
      rafflePacks25: 0,
      puttingContestCount: 4,
      tigerDriveCount: 0
    },
    totalAmount: 1130,
    paymentStatus: 'pending',
    paymentMethod: 'cheque',
    routedToEmail: 'ms_smnm@outlook.com',
    confirmationCode: 'SAIED-4482',
    registeredAt: '2026-08-01T10:15:00Z',
    checkedIn: false,
    assignedCart: 'Cart #5A & #5B',
    assignedStartingHole: 5,
    notes: 'Cheque payable to Saied Mohammed ($1,130) pending receipt at check-in'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1',
    donorName: 'Saied & Family',
    donorEmail: 'saied@family.org',
    amount: 2500,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'To my beloved Naseem, your grace, warmth, and enduring love inspire everything we do today and forever.',
    donatedAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'don-2',
    donorName: 'The Sterling Charitable Trust',
    donorEmail: 'sterlingtrust@example.com',
    amount: 1000,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'In loving memory of a phenomenal woman who touched so many lives with unconditional kindness.',
    donatedAt: '2026-06-15T12:00:00Z'
  },
  {
    id: 'don-3',
    donorName: 'Oakridge Community Circle',
    amount: 500,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'Naseem was the heart of our community volunteer drives. Honored to keep her legacy shining bright.',
    donatedAt: '2026-07-12T15:20:00Z'
  },
  {
    id: 'don-4',
    donorName: 'Anonymous Supporter',
    amount: 250,
    isAnonymous: true,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem',
    message: 'With deepest respect for Saied and family. Keep hitting fairways for hope!',
    donatedAt: '2026-07-28T19:40:00Z'
  },
  {
    id: 'don-5',
    donorName: 'Rahim & Yasmin Kassam',
    amount: 150,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'Always remembered for her bright smile and generous spirit.',
    donatedAt: '2026-08-05T10:15:00Z'
  },
  {
    id: 'don-6',
    donorName: 'Marcus & Jessica Rivera',
    amount: 100,
    isAnonymous: false,
    tributeType: 'general',
    message: 'Thrilled to support such an incredible cause! Have a great round everyone.',
    donatedAt: '2026-08-18T14:10:00Z'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardTeam[] = [
  {
    rank: 1,
    teamName: 'The Fairway Eagles (Mohammed / Al-Mansoor)',
    players: ['S. Mohammed', 'T. Mohammed', 'Z. Al-Mansoor', 'K. Vance'],
    scoreToPar: -13,
    thruHoles: 18,
    todayScore: 59,
    startingHole: 1,
    status: 'F',
    squabbitId: 'sq-team-01'
  },
  {
    rank: 2,
    teamName: 'Pacific Rim Capital (Sterling / Morrison)',
    players: ['D. Sterling', 'R. Callahan', 'J. Morrison', 'B. O\'Connor'],
    scoreToPar: -11,
    thruHoles: 18,
    todayScore: 61,
    startingHole: 2,
    status: 'F',
    squabbitId: 'sq-team-02'
  },
  {
    rank: 3,
    teamName: 'Valley Healthcare Birdie Brigade',
    players: ['M. Hayes', 'K. Cole', 'P. Wu', 'A. Scott'],
    scoreToPar: -9,
    thruHoles: 18,
    todayScore: 63,
    startingHole: 3,
    status: 'F',
    squabbitId: 'sq-team-03'
  },
  {
    rank: 4,
    teamName: 'Summit Peak Construction Strikers',
    players: ['J. Thompson', 'C. Miller', 'D. Ward', 'T. Brooks'],
    scoreToPar: -7,
    thruHoles: 16,
    todayScore: 58,
    startingHole: 4,
    status: 'Live',
    squabbitId: 'sq-team-04'
  },
  {
    rank: 5,
    teamName: 'Falcon Crest Long Drivers',
    players: ['M. Vance', 'H. Nelson', 'G. Peterson', 'L. Davis'],
    scoreToPar: -6,
    thruHoles: 15,
    todayScore: 54,
    startingHole: 5,
    status: 'Live',
    squabbitId: 'sq-team-05'
  },
  {
    rank: 6,
    teamName: 'Oakridge Community Swingers',
    players: ['S. Chen', 'W. Zhang', 'B. Adams', 'R. Patel'],
    scoreToPar: -4,
    thruHoles: 14,
    todayScore: 52,
    startingHole: 6,
    status: 'Live',
    squabbitId: 'sq-team-06'
  }
];

export const TOURNAMENT_SCHEDULE: EventScheduleItem[] = [
  {
    time: '9:30 AM',
    title: 'Registration, Chipping and Putting Competition',
    location: 'Championship Practice Green & Chipping Area',
    description: 'Check-in, gift bag pickup, unlimited driving range access, and official registration, chipping and putting competition warm-up shootout.',
    iconName: 'Coffee'
  },
  {
    time: '11:00 AM',
    title: 'Tee off (Shotgun Start)',
    location: 'All 18 Championship Holes',
    description: 'Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow) with live Squabbit scoring app.',
    iconName: 'Flag'
  },
  {
    time: '4:00 PM',
    title: 'FABULOUS Turkey Dinner',
    location: 'Grand Ballroom & Clubhouse Terrace',
    description: 'Dinner & Donation option ($50-$60 to be finalized) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner, Squabbit live leaderboard reveal, trophy presentations, raffle draws, and memorial fundraising recap.',
    iconName: 'Trophy'
  },
  {
    time: '6:00 PM',
    title: 'Adjournment & Celebration',
    location: 'Main Clubhouse',
    description: 'Official conclusion, final tribute dedication to Naseem Mohammed, and heartfelt thank you to all donors and sponsors.',
    iconName: 'Heart'
  }
];

export const PRICING_RULES = {
  individualGolfer: 125, // Green Fee & Cart $120-$130
  foursomeTeam: 500, // 4 Players with Green Fee & Cart
  dinnerOnly: 55, // $50-$60 Dinner to be finalized
  mulliganSingle: 20,
  mulliganPack3: 50, // saves $10
  rafflePack10: 25,
  rafflePack25: 50,
  puttingContest: 20,
  tigerDrive: 25,
};

export interface FaqItem {
  id: string;
  category: 'weather' | 'dress' | 'rentals' | 'format';
  question: string;
  answer: string;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-weather',
    category: 'weather',
    question: 'What is the tournament weather policy in case of rain?',
    answer: 'The tournament is scheduled as a rain-or-shine charity event. Burford Golf Links features excellent drainage and weather-covered golf carts with protective enclosures. In the rare event of severe lightning or course unplayability, play will be paused, and if suspended, the Welcome Luncheon, Silent Auction, and Awards Banquet will proceed as scheduled indoors with prizes awarded via Squabbit scorecard handicap projections.'
  },
  {
    id: 'faq-dress',
    category: 'dress',
    question: 'What is the course dress code for golfers and dinner guests?',
    answer: 'Traditional golf club attire is required: collared shirts (tucked in), mock-neck golf shirts, slacks, or tailored Bermuda-length shorts for gentlemen; golf polos, sleeveless collars, slacks, skirts, or golf dresses for ladies. Soft spike or spikeless golf shoes or clean athletic sneakers only. Denim/jeans, cargo shorts, tank tops, and metal spikes are strictly prohibited.'
  },
  {
    id: 'faq-rentals',
    category: 'rentals',
    question: 'Are golf club rentals and equipment available on-site?',
    answer: 'Yes! Burford Golf Links offers quality men\'s and women\'s rental club sets (in both right-handed and left-handed options). Please reserve your rental set during online registration or email us at least 72 hours prior to tee-off so the pro shop can stage your clubs directly on your assigned cart.'
  },
  {
    id: 'faq-format',
    category: 'format',
    question: 'How does the 4-Person Scramble format and Squabbit scoring work?',
    answer: 'In our 4-person scramble, each golfer hits a tee shot. The team selects the best ball, marks the position, and all four players hit their next shots from within one club length (no closer to the hole, in the same cut of turf). This process repeats until the ball is holed out. One person in each group records gross scores live into the free Squabbit app (tournament code: SAIED-2026), generating instant leaderboard updates.'
  },
  {
    id: 'faq-dinner',
    category: 'format',
    question: 'Can non-golfing spouses, family members, or colleagues attend just the Awards Dinner?',
    answer: 'Yes! We offer a dedicated "Dinner Only" pass ($100) which grants full access to the 5:00 PM Cocktail Hour, Silent Auction, gourmet banquet dinner, and the memorial tribute presentation.'
  }
];

export const IMPACT_DATA = {
  allocation: [
    {
      title: 'Juravinski Breast Cancer Research',
      percent: 75,
      color: 'bg-emerald-600',
      description: 'Groundbreaking oncology research, vital clinical trials, and advanced patient treatment programs at Juravinski Cancer Centre.'
    },
    {
      title: 'Canadian Red Cross - Fire & Flood',
      percent: 25,
      color: 'bg-rose-600',
      description: 'Emergency disaster response, essential food and shelter provisions, and rapid crisis relief for families affected by fires and floods.'
    }
  ],
  metrics: [
    { value: '100%', label: 'Net Proceeds to Charity', sub: 'Zero executive overhead or administrative fees' },
    { value: '180+', label: 'Patients Assisted to Date', sub: 'Across 14 regional cancer care centers' },
    { value: '$120,000+', label: 'Lifetime Funds Raised', sub: 'In ongoing memory of Naseem Mohammed' },
    { value: '501(c)(3)', label: 'Tax-Deductible Status', sub: 'Official EIN tax receipts provided instantly' }
  ]
};

