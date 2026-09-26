import { SponsorPackage, SponsorRecord, RegistrationRecord, DonationRecord, LeaderboardTeam, EventScheduleItem } from '../types';

export const EVENT_DETAILS = {
  name: "Fragrant Breeze Golf Tournament",
  year: "October 2026",
  dateString: "Monday, October 5, 2026",
  isoDate: "2026-10-05T09:30:00",
  venue: {
    name: "Burford Golf Links Course",
    websiteUrl: "https://golfnorth.ca/burford/",
    address: "120 Golf Links Rd., Burford ON",
    courseRating: "71.8 / Slope 126 • 18-Hole Championship Layout",
    mapQuery: "Burford+Golf+Links",
    mapsUrl: "https://www.google.com/maps/place/Burford+Golf+Links/@43.1372601,-80.4660569,17z/data=!3m1!4b1!4m6!3m5!1s0x882c14c8d1531a5f:0x69ddaaae88c6605d!8m2!3d43.1372562!4d-80.4634766!16s%2Fg%2F1tfv15qz?entry=ttu&g_ep=EgoyMDI2MDgzMC4wIKXMDSoASAFQAw%3D%3D",
  },
  goalAmount: 25000,
  founder: "Saied Mohammed",
  email: "ms_smnm@outlook.com",
  phone: "(905) 818-2005",
  memorialHonoree: "Naseem Mohammed",
  beneficiaryOrg: "Naseem Hope for Juravinski Breast Cancer Research & Canadian Red Cross – Fire & Flood",
  taxId: "84-9182740",
  squabbitCode: "CJECQD",
  squabbitUrl: "https://app.squabbitgolf.com/w/tournament/TCaBLm4Hc?tab=leaderboard",
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
      'Exclusive Logo on official Tournament Leaderboard header',
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
      'Official Awards Dinner & Welcome Refreshments Co-Sponsor',
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
      'Two (2) Individual Golfer Entries or 4 Dinner Passes',
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
      'Two (2) complimentary Dinner & Banquet tickets'
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
    companyName: 'Sierra Valley Wealth Advisory',
    contactName: 'Karen Miller',
    email: 'karen@sierravalley.example.com',
    phone: '(555) 431-8899',
    tier: 'contest',
    websiteUrl: 'https://sierravalley.example.com',
    pledgedAt: '2026-07-22T11:00:00Z',
    status: 'confirmed',
    customNote: 'Proud to sponsor the skill contest green in memory of Naseem.'
  },
  {
    id: 'sp-gn-1',
    companyName: 'Golf North Golf Courses',
    contactName: 'Executive Director',
    email: 'info@golfnorth.ca',
    phone: '(888) 833-8787',
    tier: 'presenting',
    websiteUrl: 'https://golfnorth.ca',
    pledgedAt: '2026-08-01T09:00:00Z',
    status: 'confirmed',
    customNote: 'Host Course Partner & Title Sponsor for the 6th Annual Fragrant Breeze Classic.'
  },
  {
    id: 'sp-kg-2',
    companyName: 'Kaneff Golf Courses',
    contactName: 'Corporate Relations',
    email: 'info@kaneffgolf.com',
    phone: '(905) 455-8700',
    tier: 'eagle',
    websiteUrl: 'https://kaneffgolf.com',
    pledgedAt: '2026-08-05T10:00:00Z',
    status: 'confirmed',
    customNote: 'Memorial Eagle Sponsor supporting Canadian Red Cross & Breast Cancer Research.'
  },
  {
    id: 'sp-lg-3',
    companyName: 'Links Golf Courses',
    contactName: 'Tournament Representative',
    email: 'info@linksgolf.ca',
    phone: '(905) 555-0199',
    tier: 'birdie',
    websiteUrl: 'https://linksgolf.ca',
    pledgedAt: '2026-08-10T11:00:00Z',
    status: 'confirmed',
    customNote: 'Birdie Partner sponsoring hole pin flags and contest greens.'
  },
  {
    id: 'sp-tg-4',
    companyName: 'Tricity Golf Courses',
    contactName: 'Alliance Coordinator',
    email: 'info@tricitygolf.ca',
    phone: '(519) 555-0188',
    tier: 'hole',
    websiteUrl: 'https://tricitygolf.ca',
    pledgedAt: '2026-08-12T14:00:00Z',
    status: 'confirmed',
    customNote: 'Par Partner supporting the Kitchener, Waterloo & Cambridge golf network.'
  }
];

export const FBGT_TEE_TIMES = [
  '11:00', '11:08', '11:16', '11:24', '11:32', '11:40', '11:48', '11:56',
  '12:04', '12:12', '12:20', '12:28', '12:36', '12:44', '12:52', '13:00', '13:08', '13:16'
];

export const INITIAL_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'reg-100',
    type: 'foursome',
    teamName: 'Team Dummies',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: {
      id: 'p-luc-1',
      name: 'Luc Valade',
      email: 'luc.valade@gmail.com',
      phone: '(555) 987-6543',
      handicap: '12.0',
      shirtSize: 'L',
      dietaryRestrictions: 'None'
    },
    additionalPlayers: [
      { id: 'p-luc-2', name: 'Marc Valade', email: 'marc.valade@example.com', phone: '(555) 987-6544', handicap: '14.5', shirtSize: 'L' },
      { id: 'p-luc-3', name: 'Alain Dugas', email: 'alain.dugas@example.com', phone: '(555) 987-6545', handicap: '16.2', shirtSize: 'XL' },
      { id: 'p-luc-4', name: 'Eric Tremblay', email: 'eric.tremblay@example.com', phone: '(555) 987-6546', handicap: '18.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['Marc Valade', 'Alain Dugas', 'Eric Tremblay'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'LUC-1001',
    registeredAt: '2026-06-01T10:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1C & #1D',
    assignedStartingHole: 1,
    notes: 'Tournament Administrator & Co-Host Team (Team Dummies)'
  },
  {
    id: 'reg-team-1',
    type: 'foursome',
    teamName: 'Team 1 (Saad)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t1-1', name: 'Tony Saad', email: 'tony.saad@example.com', phone: '(555) 234-5601', handicap: '11.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t1-2', name: 'Aundria Saad', email: 'aundria.saad@example.com', phone: '(555) 234-5602', handicap: '16.0', shirtSize: 'M' },
      { id: 'p-t1-3', name: 'Frank Bauder', email: 'frank.bauder@example.com', phone: '(555) 234-5603', handicap: '14.0', shirtSize: 'XL' },
      { id: 'p-t1-4', name: 'Jane Bauder', email: 'jane.bauder@example.com', phone: '(555) 234-5604', handicap: '18.5', shirtSize: 'S' }
    ],
    requestedTeammates: ['Aundria Saad', 'Frank Bauder', 'Jane Bauder'],
    addons: { mulligansCount: 3, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 4, tigerDriveCount: 2 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'TSAAD-8801',
    registeredAt: '2026-07-10T11:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1E & #1F',
    assignedStartingHole: 1,
    notes: 'Payment via Cheque #1042. Sourced from Google Sheet Team #1'
  },
  {
    id: 'reg-team-2',
    type: 'foursome',
    teamName: 'Team 2 (Faucher)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t2-1', name: 'Claude Faucher', email: 'claude.faucher@example.com', phone: '(555) 345-6701', handicap: '9.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t2-2', name: 'Peter Bakker', email: 'peter.bakker@example.com', phone: '(555) 345-6702', handicap: '12.0', shirtSize: 'L' },
      { id: 'p-t2-3', name: 'Garry Furgerson', email: 'garry.furgerson@example.com', phone: '(555) 345-6703', handicap: '15.5', shirtSize: 'XL' },
      { id: 'p-t2-4', name: 'Allan Ellis', email: 'allan.ellis@example.com', phone: '(555) 345-6704', handicap: '17.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['Peter Bakker', 'Garry Furgerson', 'Allan Ellis'],
    addons: { mulligansCount: 0, rafflePacks10: 2, rafflePacks25: 1, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'CFAUCH-2026',
    registeredAt: '2026-07-14T14:30:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1G & #1H',
    assignedStartingHole: 1,
    notes: 'Payment via Interac e-Transfer. Sourced from Google Sheet Team #2'
  },
  {
    id: 'reg-team-3',
    type: 'foursome',
    teamName: 'Team 3 (Kennedy)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t3-1', name: 'Ron Kennedy', email: 'ron.kennedy@example.com', phone: '(555) 456-7801', handicap: '13.0', shirtSize: 'XL' },
    additionalPlayers: [
      { id: 'p-t3-2', name: 'Sandy', email: 'sandy@example.com', phone: '(555) 456-7802', handicap: '20.0', shirtSize: 'M' },
      { id: 'p-t3-3', name: 'Warren Hyde', email: 'warren.hyde@example.com', phone: '(555) 456-7803', handicap: '10.5', shirtSize: 'L' },
      { id: 'p-t3-4', name: 'Sue-Anne', email: 'sueanne@example.com', phone: '(555) 456-7804', handicap: '22.0', shirtSize: 'S' }
    ],
    requestedTeammates: ['Sandy', 'Warren Hyde', 'Sue-Anne'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'RKENN-3003',
    registeredAt: '2026-07-20T09:15:00Z',
    checkedIn: false,
    assignedCart: 'Cart #2A & #2B',
    assignedStartingHole: 2,
    notes: 'Payment received via Cash at registration desk. Sourced from Google Sheet Team #3'
  },
  {
    id: 'reg-team-4',
    type: 'foursome',
    teamName: 'Team 4 (Solomon)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t4-1', name: 'Betty Solomon', email: 'betty.solomon@example.com', phone: '(555) 567-8901', handicap: '18.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-t4-2', name: 'John', email: 'john.solomon@example.com', phone: '(555) 567-8902', handicap: '15.0', shirtSize: 'L' },
      { id: 'p-t4-3', name: 'Cheryl Kelly', email: 'cheryl.kelly@example.com', phone: '(555) 567-8903', handicap: '21.0', shirtSize: 'M' },
      { id: 'p-t4-4', name: 'Bill Trainer', email: 'bill.trainer@example.com', phone: '(555) 567-8904', handicap: '14.2', shirtSize: 'XL' }
    ],
    requestedTeammates: ['John', 'Cheryl Kelly', 'Bill Trainer'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 1, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'pending',
    paymentMethod: 'cheque',
    confirmationCode: 'BSOL-4004',
    registeredAt: '2026-07-25T16:00:00Z',
    checkedIn: false,
    assignedCart: 'Cart #3A & #3B',
    assignedStartingHole: 3,
    notes: 'Payment via Cheque pending mail arrival. Sourced from Google Sheet Team #4'
  },
  {
    id: 'reg-team-5',
    type: 'foursome',
    teamName: 'Team 5 (Saunders)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t5-1', name: 'Jeff Saunders', email: 'jeff.saunders@example.com', phone: '(555) 678-9001', handicap: '8.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t5-2', name: 'Carl McKenney', email: 'carl.mckenney@example.com', phone: '(555) 678-9002', handicap: '11.5', shirtSize: 'XL' },
      { id: 'p-t5-3', name: 'Bob Hehenkamp', email: 'bob.hehenkamp@example.com', phone: '(555) 678-9003', handicap: '16.0', shirtSize: '2XL' },
      { id: 'p-t5-4', name: 'Rene Deschamps', email: 'rene.deschamps@example.com', phone: '(555) 678-9004', handicap: '13.8', shirtSize: 'L' }
    ],
    requestedTeammates: ['Carl McKenney', 'Bob Hehenkamp', 'Rene Deschamps'],
    addons: { mulligansCount: 3, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 4, tigerDriveCount: 4 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'JSAUN-5005',
    registeredAt: '2026-08-02T10:45:00Z',
    checkedIn: true,
    assignedCart: 'Cart #4A & #4B',
    assignedStartingHole: 4,
    notes: 'Payment verified via Interac e-Transfer. Sourced from Google Sheet Team #5'
  },
  {
    id: 'reg-team-6',
    type: 'foursome',
    teamName: 'Team 6 (Horne)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t6-1', name: 'Evan Horne', email: 'evan.horne@example.com', phone: '(555) 789-0101', handicap: '14.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-t6-2', name: 'Joey Palino', email: 'joey.palino@example.com', phone: '(555) 789-0102', handicap: '19.0', shirtSize: 'L' },
      { id: 'p-t6-3', name: 'Mike Horne', email: 'mike.horne@example.com', phone: '(555) 789-0103', handicap: '12.5', shirtSize: 'L' },
      { id: 'p-t6-4', name: 'Evan Horne Jr', email: 'evan.jr@example.com', phone: '(555) 789-0104', handicap: '18.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['Joey Palino', 'Mike Horne', 'Evan Horne'],
    addons: { mulligansCount: 0, rafflePacks10: 2, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'EHORN-6006',
    registeredAt: '2026-08-10T13:20:00Z',
    checkedIn: false,
    assignedCart: 'Cart #5A & #5B',
    assignedStartingHole: 5,
    notes: 'Payment via Cash. Sourced from Google Sheet Team #6'
  },
  {
    id: 'reg-team-7',
    type: 'foursome',
    teamName: 'Team 7 (Mohammed / The Fairway Eagles)',
    targetTier: 'Presenting Title Sponsor ($5,000)',
    primaryContact: { id: 'p-t7-1', name: 'Saied Mohammed', email: 'saied.m@charitygolf.org', phone: '(555) 123-4567', handicap: '10.2', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t7-2', name: 'Ross Clarke', email: 'ross.clarke@example.com', phone: '(555) 123-4588', handicap: '12.0', shirtSize: 'L' },
      { id: 'p-t7-3', name: 'Peggy', email: 'peggy@example.com', phone: '(555) 123-4589', handicap: '16.5', shirtSize: 'M' },
      { id: 'p-t7-4', name: 'Barry Kelly', email: 'barry.kelly@example.com', phone: '(555) 123-4590', handicap: '14.0', shirtSize: 'XL' }
    ],
    requestedTeammates: ['Ross Clarke', 'Peggy', 'Barry Kelly'],
    addons: { mulligansCount: 3, rafflePacks10: 2, rafflePacks25: 2, puttingContestCount: 4, tigerDriveCount: 4 },
    totalAmount: 5000,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'SAIED-9042',
    registeredAt: '2026-06-10T14:20:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1A & #1B',
    assignedStartingHole: 1,
    notes: 'Tournament Founder & Memorial Host Team. Sourced from Google Sheet Team #7'
  },
  {
    id: 'reg-team-8',
    type: 'foursome',
    teamName: 'Team 8 (Harrison)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t8-1', name: 'John Harrison', email: 'john.harrison@example.com', phone: '(555) 890-1201', handicap: '11.2', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t8-2', name: 'Lyle Beaudoin', email: 'lyle.beaudoin@example.com', phone: '(555) 890-1202', handicap: '15.0', shirtSize: 'XL' },
      { id: 'p-t8-3', name: 'Mobeen Husain', email: 'mobeen.husain@example.com', phone: '(555) 890-1203', handicap: '13.5', shirtSize: 'L' },
      { id: 'p-t8-4', name: 'Neil McKinnel', email: 'neil.mckinnel@example.com', phone: '(555) 890-1204', handicap: '17.8', shirtSize: '2XL' }
    ],
    requestedTeammates: ['Lyle Beaudoin', 'Mobeen Husain', 'Neil McKinnel'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'JHARR-8008',
    registeredAt: '2026-08-18T15:10:00Z',
    checkedIn: true,
    assignedCart: 'Cart #6A & #6B',
    assignedStartingHole: 8,
    notes: 'Payment verified via Interac e-Transfer. Sourced from Google Sheet Team #8'
  },
  {
    id: 'reg-team-9',
    type: 'foursome',
    teamName: 'Team 9 (Khan)',
    targetTier: 'Hole & Tee Box Sponsor ($1,000)',
    primaryContact: { id: 'p-t9-1', name: 'Amir Khan', email: 'amir.khan@example.com', phone: '(555) 901-2301', handicap: '9.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-t9-2', name: 'Wayne Childerley', email: 'wayne.childerley@example.com', phone: '(555) 901-2302', handicap: '14.0', shirtSize: 'L' },
      { id: 'p-t9-3', name: 'Hugh James', email: 'hugh.james@example.com', phone: '(555) 901-2303', handicap: '16.5', shirtSize: 'XL' }
    ],
    requestedTeammates: ['Wayne Childerley', 'Hugh James'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 3, tigerDriveCount: 0 },
    totalAmount: 1000,
    paymentStatus: 'pending',
    paymentMethod: 'cash',
    confirmationCode: 'AKHAN-9009',
    registeredAt: '2026-08-25T11:00:00Z',
    checkedIn: false,
    assignedCart: 'Cart #7A & #7B',
    assignedStartingHole: 9,
    notes: 'Hole sponsor & 3-player team. Cash payment at morning check-in. Sourced from Google Sheet Team #9'
  },
  {
    id: 'reg-team-10',
    type: 'foursome',
    teamName: 'Team 10 (Martin / Saunders)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t10-1', name: 'Deb Martin', email: 'deb.martin@example.com', phone: '(555) 211-1001', handicap: '18.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-t10-2', name: 'Robert Martin', email: 'robert.martin@example.com', phone: '(555) 211-1002', handicap: '14.5', shirtSize: 'L' },
      { id: 'p-t10-3', name: 'Maureen Saunders', email: 'maureen.saunders@example.com', phone: '(555) 211-1003', handicap: '20.0', shirtSize: 'M' },
      { id: 'p-t10-4', name: 'Dave McDowell', email: 'dave.mcdowell@example.com', phone: '(555) 211-1004', handicap: '12.0', shirtSize: 'XL' }
    ],
    requestedTeammates: ['Robert Martin', 'Maureen Saunders', 'Dave McDowell'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'DMART-1010',
    registeredAt: '2026-08-28T10:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #8A & #8B',
    assignedStartingHole: 10,
    notes: 'Registered via Admin Roster Request. Payment via Cheque.'
  },
  {
    id: 'reg-team-11',
    type: 'foursome',
    teamName: 'Team 11 (Furgerson / Stubbings)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t11-1', name: 'Paul Furgerson', email: 'paul.furgerson@example.com', phone: '(555) 322-1101', handicap: '11.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t11-2', name: 'Bill Stubbings', email: 'bill.stubbings@example.com', phone: '(555) 322-1102', handicap: '15.2', shirtSize: 'XL' },
      { id: 'p-t11-3', name: 'Amir Han', email: 'amir.han@example.com', phone: '(555) 322-1103', handicap: '10.0', shirtSize: 'M' },
      { id: 'p-t11-4', name: 'Bill Traynor', email: 'bill.traynor@example.com', phone: '(555) 322-1104', handicap: '16.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['Bill Stubbings', 'Amir Han', 'Bill Traynor'],
    addons: { mulligansCount: 3, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 4, tigerDriveCount: 2 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'PFURG-1111',
    registeredAt: '2026-08-29T11:30:00Z',
    checkedIn: true,
    assignedCart: 'Cart #9A & #9B',
    assignedStartingHole: 11,
    notes: 'Registered via Admin Roster Request. Payment via e-Transfer.'
  },
  {
    id: 'reg-team-12',
    type: 'foursome',
    teamName: 'Team 12 (Hyde / McKenney)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t12-1', name: 'Barry Hyde', email: 'barry.hyde@example.com', phone: '(555) 433-1201', handicap: '13.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t12-2', name: 'Mary Hyde', email: 'mary.hyde@example.com', phone: '(555) 433-1202', handicap: '19.0', shirtSize: 'S' },
      { id: 'p-t12-3', name: 'Janice McKenney', email: 'janice.mckenney@example.com', phone: '(555) 433-1203', handicap: '22.0', shirtSize: 'M' },
      { id: 'p-t12-4', name: 'Michelle Bertothy', email: 'michelle.b@example.com', phone: '(555) 433-1204', handicap: '17.5', shirtSize: 'M' }
    ],
    requestedTeammates: ['Mary Hyde', 'Janice McKenney', 'Michelle Bertothy'],
    addons: { mulligansCount: 0, rafflePacks10: 2, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'BHYDE-1212',
    registeredAt: '2026-08-30T14:15:00Z',
    checkedIn: true,
    assignedCart: 'Cart #10A & #10B',
    assignedStartingHole: 12,
    notes: 'Registered via Admin Roster Request. Payment via Cash.'
  },
  {
    id: 'reg-team-13',
    type: 'foursome',
    teamName: 'Team 13 (Sheriff / Mohammed)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t13-1', name: 'Khalil Sheriff', email: 'khalil.sheriff@example.com', phone: '(555) 544-1301', handicap: '9.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t13-2', name: 'Ian Mohammed', email: 'ian.mohammed@example.com', phone: '(555) 544-1302', handicap: '12.0', shirtSize: 'XL' },
      { id: 'p-t13-3', name: 'Jeff Sheriff', email: 'jeff.sheriff@example.com', phone: '(555) 544-1303', handicap: '14.0', shirtSize: 'L' },
      { id: 'p-t13-4', name: 'Naeem Mohammed', email: 'naeem.mohammed@example.com', phone: '(555) 544-1304', handicap: '10.8', shirtSize: 'L' }
    ],
    requestedTeammates: ['Ian Mohammed', 'Jeff Sheriff', 'Naeem Mohammed'],
    addons: { mulligansCount: 3, rafflePacks10: 1, rafflePacks25: 1, puttingContestCount: 4, tigerDriveCount: 4 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'credit_card',
    confirmationCode: 'KSHER-1313',
    registeredAt: '2026-09-01T09:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #11A & #11B',
    assignedStartingHole: 13,
    notes: 'Registered via Admin Roster Request. Payment via Credit Card.'
  },
  {
    id: 'reg-team-14',
    type: 'foursome',
    teamName: 'Team 14 (Britton / White / Coyn)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t14-1', name: 'Mitch Britton', email: 'mitch.britton@example.com', phone: '(555) 655-1401', handicap: '12.5', shirtSize: 'XL' },
    additionalPlayers: [
      { id: 'p-t14-2', name: 'Nitch #2', email: 'nitch2@example.com', phone: '(555) 655-1402', handicap: '16.0', shirtSize: 'L' },
      { id: 'p-t14-3', name: 'Bill White', email: 'bill.white@example.com', phone: '(555) 655-1403', handicap: '14.0', shirtSize: '2XL' },
      { id: 'p-t14-4', name: 'Bob Coyn', email: 'bob.coyn@example.com', phone: '(555) 655-1404', handicap: '18.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['Nitch #2', 'Bill White', 'Bob Coyn'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'MBRIT-1414',
    registeredAt: '2026-09-03T15:20:00Z',
    checkedIn: true,
    assignedCart: 'Cart #12A & #12B',
    assignedStartingHole: 14,
    notes: 'Registered via Admin Roster Request. Payment via e-Transfer.'
  },
  {
    id: 'reg-team-15',
    type: 'foursome',
    teamName: 'Team 15 (Powell / Groot / Zancola)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t15-1', name: 'Bill Powell', email: 'bill.powell@example.com', phone: '(555) 766-1501', handicap: '15.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t15-2', name: 'Ruth-Ann Powell', email: 'ruthann.powell@example.com', phone: '(555) 766-1502', handicap: '21.0', shirtSize: 'S' },
      { id: 'p-t15-3', name: 'George Groot', email: 'george.groot@example.com', phone: '(555) 766-1503', handicap: '13.0', shirtSize: 'XL' },
      { id: 'p-t15-4', name: 'Joe Zancola', email: 'joe.zancola@example.com', phone: '(555) 766-1504', handicap: '16.5', shirtSize: 'L' }
    ],
    requestedTeammates: ['Ruth-Ann Powell', 'George Groot', 'Joe Zancola'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 1, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'BPOW-1515',
    registeredAt: '2026-09-05T10:40:00Z',
    checkedIn: true,
    assignedCart: 'Cart #13A & #13B',
    assignedStartingHole: 15,
    notes: 'Registered via Admin Roster Request. Payment via Cheque.'
  },
  {
    id: 'reg-team-16',
    type: 'foursome',
    teamName: 'Team 16 (Mannering / Knox)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-t16-1', name: 'Matt Manering', email: 'matt.manering@example.com', phone: '(555) 877-1601', handicap: '10.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-t16-2', name: 'Janice Mannering', email: 'janice.mannering@example.com', phone: '(555) 877-1602', handicap: '18.5', shirtSize: 'M' },
      { id: 'p-t16-3', name: 'Nancy Knox', email: 'nancy.knox@example.com', phone: '(555) 877-1603', handicap: '20.0', shirtSize: 'M' },
      { id: 'p-t16-4', name: 'Gary Knox', email: 'gary.knox@example.com', phone: '(555) 877-1604', handicap: '12.0', shirtSize: 'XL' }
    ],
    requestedTeammates: ['Janice Mannering', 'Nancy Knox', 'Gary Knox'],
    addons: { mulligansCount: 2, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 2 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'MMAN-1616',
    registeredAt: '2026-09-08T16:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #14A & #14B',
    assignedStartingHole: 16,
  },
  {
    id: 'reg-fbgt-1',
    type: 'foursome',
    teamNumber: '1',
    teeTime: '11:00',
    teamName: 'Team 1 (Deb Martin / Robert Martin / Jeff Saunders / Maureen Saunders)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f1-1', name: 'Deb Martin', email: 'deb.martin@fbgt.ca', phone: '(905) 555-0101', handicap: '18.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-f1-2', name: 'Robert Martin', email: 'robert.martin@fbgt.ca', phone: '(905) 555-0102', handicap: '14.0', shirtSize: 'L' },
      { id: 'p-f1-3', name: 'Jeff Saunders', email: 'jeff.saunders@fbgt.ca', phone: '(905) 555-0103', handicap: '16.0', shirtSize: 'XL' },
      { id: 'p-f1-4', name: 'Maureen Saunders', email: 'maureen.saunders@fbgt.ca', phone: '(905) 555-0104', handicap: '20.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['Robert Martin', 'Jeff Saunders', 'Maureen Saunders'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'DMART-1010',
    registeredAt: '2026-08-01T10:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #1A & #1B',
    assignedStartingHole: 1,
    notes: '2026 FBGT Line Up. Tee Time: 11:00 AM.'
  },
  {
    id: 'reg-fbgt-2',
    type: 'foursome',
    teamNumber: '2',
    teeTime: '11:08',
    teamName: 'Team 2 (Bob Hehenkamp / Dave McDowel / Ron Kennedy / Amir Han)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f2-1', name: 'Bob Hehenkamp', email: 'bob.hehenkamp@fbgt.ca', phone: '(905) 555-0201', handicap: '12.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f2-2', name: 'Dave McDowel', email: 'dave.mcdowel@fbgt.ca', phone: '(905) 555-0202', handicap: '15.0', shirtSize: 'XL' },
      { id: 'p-f2-3', name: 'Ron Kennedy', email: 'ron.kennedy@fbgt.ca', phone: '(905) 555-0203', handicap: '11.0', shirtSize: 'L' },
      { id: 'p-f2-4', name: 'Amir Han', email: 'amir.han@fbgt.ca', phone: '(905) 555-0204', handicap: '10.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['Dave McDowel', 'Ron Kennedy', 'Amir Han'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 1, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'DMART-1010',
    registeredAt: '2026-08-02T11:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #2A & #2B',
    assignedStartingHole: 2,
    notes: '2026 FBGT Line Up. Tee Time: 11:08 AM.'
  },
  {
    id: 'reg-fbgt-3',
    type: 'foursome',
    teamNumber: '3',
    teeTime: '11:16',
    teamName: 'Team 3 (Garry Furgerson / Paul Furgerson / Bill Stubbings / Betty Solomon)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f3-1', name: 'Garry Furgerson', email: 'garry.furgerson@fbgt.ca', phone: '(905) 555-0301', handicap: '13.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f3-2', name: 'Paul Furgerson', email: 'paul.furgerson@fbgt.ca', phone: '(905) 555-0302', handicap: '11.0', shirtSize: 'L' },
      { id: 'p-f3-3', name: 'Bill Stubbings', email: 'bill.stubbings@fbgt.ca', phone: '(905) 555-0303', handicap: '15.2', shirtSize: 'XL' },
      { id: 'p-f3-4', name: 'Betty Solomon', email: 'betty.solomon@fbgt.ca', phone: '(905) 555-0304', handicap: '22.0', shirtSize: 'S' }
    ],
    requestedTeammates: ['Paul Furgerson', 'Bill Stubbings', 'Betty Solomon'],
    addons: { mulligansCount: 2, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'DMART-1010',
    registeredAt: '2026-08-03T12:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #3A & #3B',
    assignedStartingHole: 3,
    notes: '2026 FBGT Line Up. Tee Time: 11:16 AM.'
  },
  {
    id: 'reg-fbgt-4',
    type: 'foursome',
    teamNumber: '4',
    teeTime: '11:24',
    teamName: 'Team 4 (Wayne Childerley / Hugh James / Peter Bakker / [Open Spot])',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f4-1', name: 'Wayne Childerley', email: 'wayne.childerley@fbgt.ca', phone: '(905) 555-0401', handicap: '14.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f4-2', name: 'Hugh James', email: 'hugh.james@fbgt.ca', phone: '(905) 555-0402', handicap: '16.5', shirtSize: 'XL' },
      { id: 'p-f4-3', name: 'Peter Bakker', email: 'peter.bakker@fbgt.ca', phone: '(905) 555-0403', handicap: '18.0', shirtSize: 'L' },
      { id: 'p-f4-4', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' }
    ],
    requestedTeammates: ['Hugh James', 'Peter Bakker', '??????'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cheque',
    confirmationCode: 'DMART-1010',
    registeredAt: '2026-08-04T13:00:00Z',
    checkedIn: false,
    assignedCart: 'Cart #4A & #4B',
    assignedStartingHole: 4,
    notes: '2026 FBGT Line Up. Tee Time: 11:24 AM. Spot #4 open for new player!'
  },
  {
    id: 'reg-fbgt-5',
    type: 'foursome',
    teamNumber: '5',
    teeTime: '11:32',
    teamName: 'Team 5 (BARRY HYDE / MARY HYDE / CARL McKENNEY / JANICE McKENNEY)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f5-1', name: 'BARRY HYDE', email: 'barry.hyde@fbgt.ca', phone: '(905) 555-0501', handicap: '13.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f5-2', name: 'MARY HYDE', email: 'mary.hyde@fbgt.ca', phone: '(905) 555-0502', handicap: '19.0', shirtSize: 'S' },
      { id: 'p-f5-3', name: 'CARL McKENNEY', email: 'carl.mckenney@fbgt.ca', phone: '(905) 555-0503', handicap: '16.0', shirtSize: 'XL' },
      { id: 'p-f5-4', name: 'JANICE McKENNEY', email: 'janice.mckenney@fbgt.ca', phone: '(905) 555-0504', handicap: '22.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['MARY HYDE', 'CARL McKENNEY', 'JANICE McKENNEY'],
    addons: { mulligansCount: 0, rafflePacks10: 2, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'PFURG-1111',
    registeredAt: '2026-08-05T14:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #5A & #5B',
    assignedStartingHole: 5,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 11:32 AM. Payment via e-Transfer.'
  },
  {
    id: 'reg-fbgt-6',
    type: 'foursome',
    teamNumber: '6',
    teeTime: '11:40',
    teamName: 'Team 6 (KHALIL SHERIFF / IAN MOHAMMED / JEFF SHERIFF / SAIED MOHAMMED)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f6-1', name: 'KHALIL SHERIFF', email: 'khalil.sheriff@fbgt.ca', phone: '(905) 555-0601', handicap: '9.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f6-2', name: 'IAN MOHAMMED', email: 'ian.mohammed@fbgt.ca', phone: '(905) 555-0602', handicap: '12.0', shirtSize: 'XL' },
      { id: 'p-f6-3', name: 'JEFF SHERIFF', email: 'jeff.sheriff@fbgt.ca', phone: '(905) 555-0603', handicap: '14.0', shirtSize: 'L' },
      { id: 'p-f6-4', name: 'SAIED MOHAMMED', email: 'saied.mohammed@fbgt.ca', phone: '(905) 818-2005', handicap: '10.2', shirtSize: 'L' }
    ],
    requestedTeammates: ['IAN MOHAMMED', 'JEFF SHERIFF', 'SAIED MOHAMMED'],
    addons: { mulligansCount: 3, rafflePacks10: 1, rafflePacks25: 1, puttingContestCount: 4, tigerDriveCount: 4 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'PFURG-1111',
    registeredAt: '2026-08-06T15:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #6A & #6B',
    assignedStartingHole: 6,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 11:40 AM. Payment via e-Transfer.'
  },
  {
    id: 'reg-fbgt-7',
    type: 'foursome',
    teamNumber: '7',
    teeTime: '11:48',
    teamName: 'Team 7 (EVAN HORNE / MIKE HORNE / MITCH BRITTON / NITCH #2)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f7-1', name: 'EVAN HORNE', email: 'evan.horne@fbgt.ca', phone: '(905) 555-0701', handicap: '11.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-f7-2', name: 'MIKE HORNE', email: 'mike.horne@fbgt.ca', phone: '(905) 555-0702', handicap: '13.0', shirtSize: 'L' },
      { id: 'p-f7-3', name: 'MITCH BRITTON', email: 'mitch.britton@fbgt.ca', phone: '(905) 555-0703', handicap: '15.0', shirtSize: 'L' },
      { id: 'p-f7-4', name: 'NITCH #2', email: 'nitch2@fbgt.ca', phone: '(905) 555-0704', handicap: '14.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['MIKE HORNE', 'MITCH BRITTON', 'NITCH #2'],
    addons: { mulligansCount: 0, rafflePacks10: 2, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'PFURG-1111',
    registeredAt: '2026-08-07T16:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #7A & #7B',
    assignedStartingHole: 7,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 11:48 AM. Payment via e-Transfer.'
  },
  {
    id: 'reg-fbgt-8',
    type: 'foursome',
    teamNumber: '8',
    teeTime: '11:56',
    teamName: 'Team 8 ([Open Spot] / BILL TRAYNOR / BILL WHITE / BOB COYN)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f8-1', name: 'BILL TRAYNOR', email: 'bill.traynor@fbgt.ca', phone: '(905) 555-0801', handicap: '16.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f8-2', name: 'BILL WHITE', email: 'bill.white@fbgt.ca', phone: '(905) 555-0802', handicap: '18.0', shirtSize: 'XL' },
      { id: 'p-f8-3', name: 'BOB COYN', email: 'bob.coyn@fbgt.ca', phone: '(905) 555-0803', handicap: '14.5', shirtSize: 'L' },
      { id: 'p-f8-4', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' }
    ],
    requestedTeammates: ['BILL WHITE', 'BOB COYN', '??????'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 0, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'PFURG-1111',
    registeredAt: '2026-08-08T09:00:00Z',
    checkedIn: false,
    assignedCart: 'Cart #8A & #8B',
    assignedStartingHole: 8,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 11:56 AM. Spot #1 open for player assignment!'
  },
  {
    id: 'reg-fbgt-9',
    type: 'foursome',
    teamNumber: '9',
    teeTime: '12:04',
    teamName: 'Team 9 (BILL POWELL / RUTH-ANN POWELL / MICHELLE BERTOTHY / [Open Spot])',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f9-1', name: 'BILL POWELL', email: 'bill.powell@fbgt.ca', phone: '(905) 555-0901', handicap: '12.5', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f9-2', name: 'RUTH-ANN POWELL', email: 'ruthann.powell@fbgt.ca', phone: '(905) 555-0902', handicap: '20.0', shirtSize: 'S' },
      { id: 'p-f9-3', name: 'MICHELLE BERTOTHY', email: 'michelle.bertothy@fbgt.ca', phone: '(905) 555-0903', handicap: '17.5', shirtSize: 'M' },
      { id: 'p-f9-4', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' }
    ],
    requestedTeammates: ['RUTH-ANN POWELL', 'MICHELLE BERTOTHY', '??????'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'BHYDE-1212',
    registeredAt: '2026-08-09T10:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #9A & #9B',
    assignedStartingHole: 9,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 12:04 PM. Spot #4 open for assignment!'
  },
  {
    id: 'reg-fbgt-10',
    type: 'foursome',
    teamNumber: '10',
    teeTime: '12:12',
    teamName: 'Team 10 (GEORGE GROOT / JOE ZANCOLA / JOOB / MIKE)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f10-1', name: 'GEORGE GROOT', email: 'george.groot@fbgt.ca', phone: '(905) 555-1001', handicap: '11.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f10-2', name: 'JOE ZANCOLA', email: 'joe.zancola@fbgt.ca', phone: '(905) 555-1002', handicap: '14.0', shirtSize: 'XL' },
      { id: 'p-f10-3', name: 'JOOB', email: 'joob@fbgt.ca', phone: '(905) 555-1003', handicap: '15.0', shirtSize: 'L' },
      { id: 'p-f10-4', name: 'MIKE', email: 'mike@fbgt.ca', phone: '(905) 555-1004', handicap: '13.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['JOE ZANCOLA', 'JOOB', 'MIKE'],
    addons: { mulligansCount: 1, rafflePacks10: 0, rafflePacks25: 1, puttingContestCount: 1, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'BHYDE-1212',
    registeredAt: '2026-08-10T11:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #10A & #10B',
    assignedStartingHole: 10,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 12:12 PM. Payment via Cash.'
  },
  {
    id: 'reg-fbgt-11',
    type: 'foursome',
    teamNumber: '11',
    teeTime: '12:20',
    teamName: 'Team 11 (NAEEM MOHAMMED / NINAA MOHAMMED / MATT MANERING / JANICE MANNERING)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f11-1', name: 'NAEEM MOHAMMED', email: 'naeem.mohammed@fbgt.ca', phone: '(905) 555-1101', handicap: '10.8', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f11-2', name: 'NINAA MOHAMMED', email: 'ninaa.mohammed@fbgt.ca', phone: '(905) 555-1102', handicap: '18.0', shirtSize: 'M' },
      { id: 'p-f11-3', name: 'MATT MANERING', email: 'matt.manering@fbgt.ca', phone: '(905) 555-1103', handicap: '13.0', shirtSize: 'XL' },
      { id: 'p-f11-4', name: 'JANICE MANNERING', email: 'janice.mannering@fbgt.ca', phone: '(905) 555-1104', handicap: '21.0', shirtSize: 'M' }
    ],
    requestedTeammates: ['NINAA MOHAMMED', 'MATT MANERING', 'JANICE MANNERING'],
    addons: { mulligansCount: 2, rafflePacks10: 2, rafflePacks25: 0, puttingContestCount: 2, tigerDriveCount: 1 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'BHYDE-1212',
    registeredAt: '2026-08-11T12:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #11A & #11B',
    assignedStartingHole: 11,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 12:20 PM. Payment via Cash.'
  },
  {
    id: 'reg-fbgt-12',
    type: 'foursome',
    teamNumber: '12',
    teeTime: '12:28',
    teamName: 'Team 12 (NANCY KNOX / GARY KNOX / RAY KITOWSKI / TERRY KITOWSKI)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f12-1', name: 'NANCY KNOX', email: 'nancy.knox@fbgt.ca', phone: '(905) 555-1201', handicap: '19.0', shirtSize: 'M' },
    additionalPlayers: [
      { id: 'p-f12-2', name: 'GARY KNOX', email: 'gary.knox@fbgt.ca', phone: '(905) 555-1202', handicap: '15.0', shirtSize: 'L' },
      { id: 'p-f12-3', name: 'RAY KITOWSKI', email: 'ray.kitowski@fbgt.ca', phone: '(905) 555-1203', handicap: '14.0', shirtSize: 'XL' },
      { id: 'p-f12-4', name: 'TERRY KITOWSKI', email: 'terry.kitowski@fbgt.ca', phone: '(905) 555-1204', handicap: '18.0', shirtSize: 'L' }
    ],
    requestedTeammates: ['GARY KNOX', 'RAY KITOWSKI', 'TERRY KITOWSKI'],
    addons: { mulligansCount: 0, rafflePacks10: 1, rafflePacks25: 1, puttingContestCount: 2, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    confirmationCode: 'BHYDE-1212',
    registeredAt: '2026-08-12T13:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #12A & #12B',
    assignedStartingHole: 12,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 12:28 PM. Payment via Cash.'
  },
  {
    id: 'reg-fbgt-13',
    type: 'foursome',
    teamNumber: '???',
    teeTime: '12:44',
    teamName: 'Team ??? (ROSS CLARKE & Open Teammates)',
    targetTier: 'Corporate Foursome ($1,600)',
    primaryContact: { id: 'p-f13-1', name: 'ROSS CLARKE', email: 'ross.clarke@fbgt.ca', phone: '(905) 555-1301', handicap: '12.0', shirtSize: 'L' },
    additionalPlayers: [
      { id: 'p-f13-2', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' },
      { id: 'p-f13-3', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' },
      { id: 'p-f13-4', name: '?????? (Open Spot)', email: 'open.spot@fbgt.ca', phone: 'Needed', handicap: '-', shirtSize: 'L' }
    ],
    requestedTeammates: ['??????', '??????', '??????'],
    addons: { mulligansCount: 0, rafflePacks10: 0, rafflePacks25: 0, puttingContestCount: 1, tigerDriveCount: 0 },
    totalAmount: 1600,
    paymentStatus: 'paid',
    paymentMethod: 'etransfer',
    confirmationCode: 'RKIT-1717',
    registeredAt: '2026-08-13T14:00:00Z',
    checkedIn: true,
    assignedCart: 'Cart #13A & #13B',
    assignedStartingHole: 13,
    notes: 'Imported from 2026 - FBGT Line Up Google Sheet (Teams Tab). Tee Time: 12:44 PM. 3 spots open!'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1',
    donorName: 'Saied & Family',
    donorEmail: 'saied@family.org',
    amount: 200,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'To my beloved Naseem, your grace, warmth, and enduring love inspire everything we do today and forever.',
    donatedAt: '2026-06-01T08:00:00Z'
  },
  {
    id: 'don-2',
    donorName: 'Oakridge Community Circle',
    amount: 100,
    isAnonymous: false,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem Mohammed',
    message: 'Honoring Naseem’s compassionate heart and tireless dedication to oncology patient support.',
    donatedAt: '2026-07-12T15:20:00Z'
  },
  {
    id: 'don-3',
    donorName: 'Anonymous Supporter',
    amount: 50,
    isAnonymous: true,
    tributeType: 'in_memory_of',
    tributeName: 'Naseem',
    message: 'With deepest love and heartfelt remembrance. Keep hitting fairways for hope!',
    donatedAt: '2026-07-28T19:40:00Z'
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
    location: 'New Restaurant in the Upper Level • Championship Practice Green & Chipping Area',
    description: 'Check-in, snacks will be provided, and official registration in Pro shop, chipping and putting competition (warm-up before the game).',
    iconName: 'Coffee'
  },
  {
    time: '11:00 AM',
    title: 'Tee off (Shotgun Start)',
    location: 'All 18 Holes',
    description: 'Simultaneous shotgun launch across 18 holes. Played in the dynamic 6-6-6 format (Swapping Partners version, details to follow).',
    iconName: 'Flag'
  },
  {
    time: '4:00 PM',
    title: 'FABULOUS Turkey Dinner',
    location: 'Restaurant in the Upper Level',
    description: 'Dinner & Donation option ($60) [LIMITED #,book early]. Post-round celebration featuring a fabulous turkey dinner, prizes and trophy presentations, and memorial fundraising recap.',
    iconName: 'Trophy'
  }
];

export const PRICING_RULES = {
  memberGolfer: 100, // Member Green Fee & Cart $100
  otherGolfer: 120, // Other / Guest Green Fee & Cart $120
  individualGolfer: 120, // Green Fee & Cart standard rate
  foursomeTeam: 480, // 4 Players with Green Fee & Cart
  dinnerOnly: 60, // Dinner Guest Pass $60
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
    id: 'faq-dress',
    category: 'dress',
    question: 'What is the course dress code for golfers and dinner guests?',
    answer: 'Normal golf attire is required for all golfers and dinner guests.'
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
    question: 'How does the 6-6-6 format (Swapping Partners) work?',
    answer: 'Played in the dynamic 6-6-6 format where partners rotate every 6 holes to maximize camaraderie, strategic play, and friendly competition. Detailed scoring rules and pairings cards will be distributed at the morning check-in.'
  },
  {
    id: 'faq-dinner',
    category: 'format',
    question: 'Can non-golfing spouses, family members, or colleagues attend just the Awards Dinner?',
    answer: 'Yes! We offer a dedicated "Dinner Only" pass ($60) which grants full access to the 5:00 PM Cocktail Hour, Silent Auction, gourmet banquet dinner, and the memorial tribute presentation.'
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
    { value: '7,000+', label: 'Patients Assisted per year', sub: 'Providing direct patient care, clinical trial access, and emergency relief' },
    { value: '$6.6 Million+', label: 'Lifetime Funds Raised', sub: 'A cumulative total of $6.6 Million+ In Lifetime Funds Raised' },
    { value: '501(c)(3)', label: 'Tax-Deductible Status', sub: 'Official EIN tax receipts provided instantly' }
  ]
};

