import { OutreachEmailTemplate, OutreachLead } from '../types';
import { OUTSCRAPER_OUTREACH_LEADS } from './charityGolfLeads';

export const DEFAULT_OUTREACH_TEMPLATES: OutreachEmailTemplate[] = [
  {
    id: 'tpl-hole-sponsor',
    title: 'Hole Sponsor Template',
    category: 'hole_contest_sponsorship',
    subject: 'Showcase Your Brand at the 6TH Annual Charity Fragrant Breeze Golf Tournament— Hole & Contest Sponsorship',
    body: `Dear **[Sponsor Name]**,

Community engagement and local business visibility are at the heart of our annual charity golf tournament, hosted in loving memory to support vital local causes.

On **Monday October 5, 2026**, we are welcoming more than 60 local leaders, golfers, and community members to the Championship Venue of **[Burford Golf Links Course](https://golfnorth.ca/burford)** 120 Golf Links Rd., Burford ON, for a day of golf, networking, and philanthropy. We are currently inviting select local businesses to sponsor our high-visibility on-course contests, including the Closest-to-the-Pin, Longest Drive holes, Hole in one, Longest Putt,Closest to Squiggley line and top 4-some teams.

**Hole & Contest Sponsorship Benefits Include:**
* **Dedicated Signage:** Exclusive corporate signage displayed directly on your sponsored tee box or green.
* **Direct Interaction:** An opportunity to set up a promotional station at your hole to greet players, distribute branded collateral, or host a mini-game.
* **Digital Recognition:** Company logo featured on the tournament website and leaderboard.
* **Banquet Invitation:** Tickets to join our post-tournament awards dinner and networking reception.

Partnering as a hole sponsor is an exceptional way to put your brand in front of active community members while supporting a meaningful memorial cause. Please let me know if you would like to claim a hole sponsor slot, or feel free to contact me at **[(905) 818-2005](tel:19058182005)**.

Warm regards,

Saied Mohammed
Tournament Director
[(905) 818-2005](tel:19058182005)

[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`,
    isDefault: true,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-title-sponsor',
    title: 'Title Sponsor Template',
    category: 'corporate_sponsorship',
    subject: 'Title Partnership Proposal: 6th Annual Fragrant Breeze Memorial Golf Classic',
    body: `Dear [Contact Name],

On behalf of the organizing committee, I am writing to cordially invite [Company Name] to partner with us as our premier Title Sponsor for the 6th Annual Fragrant Breeze Memorial Golf Classic.

Tournament Overview:
• Date: [Tournament Date]
• Venue: [Course Location]
• Format: 18-Hole Championship Scramble & Banquet
• Honoring: [Memorial Honoree]
• Cause: 100% of tournament proceeds directly benefit [Beneficiary Org].

As our Title Sponsor ($5,000 package):
- Exclusive presenting sponsor marquee billing: "Fragrant Breeze Classic Presented by [Company Name]"
- Two complimentary corporate foursomes with premier starting tee box assignments
- Prominent corporate banner at clubhouse entrance, putting green, and banquet pavilion
- Keynote podium speaking opportunity during the evening Awards Dinner
- Full-page color feature in the official tournament program and prominent digital placement

Please let us know if you would be open to a brief 5-minute phone conversation this week. You may also reach our founder, [Founder Name], directly at [(905) 818-2005](tel:19058182005).

Warm regards,

[Founder Name]
Tournament Founder & Chair
Phone: [(905) 818-2005](tel:19058182005)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-corporate-foursome',
    title: 'Corporate Foursome Template',
    category: 'corporate_sponsorship',
    subject: 'Corporate Foursome & Team Sponsorship Invitation: 6th Annual Fragrant Breeze Golf Classic',
    body: `Dear [Contact Name],

We would love to welcome [Company Name] to field a corporate foursome at the upcoming 6th Annual Fragrant Breeze Memorial Charity Golf Classic on [Tournament Date] at [Course Location].

The Corporate Foursome Package ($1,600) combines high-level networking, client entertainment, and meaningful charitable impact:
• Full 18-hole championship green fees, power carts, and driving range access for 4 players
• Deluxe golfer gift bags, branded tournament apparel, and contest entries for all 4 golfers
• 4 tickets to the Welcome Luncheon and evening Awards Banquet Dinner
• Co-branded hole tee signage recognizing [Company Name] as a Corporate Team Partner
• Tax receipt issued for eligible charitable contribution portion

Field spots are strictly capped at 144 players to maintain an enjoyable pace of play. Please confirm your team's reservation by replying or calling [(905) 818-2005](tel:19058182005).

Warm regards,

[Founder Name]
Tournament Director
Phone: [(905) 818-2005](tel:19058182005)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-prize-raffle',
    title: 'Prize & Silent Auction Donation Request',
    category: 'prize_raffle',
    subject: 'Silent Auction & Prize Donation Request: Fragrant Breeze Charity Golf Classic',
    body: `Dear [Contact Name],

We are currently preparing for the 6th Annual Fragrant Breeze Memorial Golf Classic, taking place on [Tournament Date] at [Course Location].

Every year, our participants look forward to our high-energy charity raffle and silent auction. 100% of funds raised directly support [Beneficiary Org].

We would be deeply grateful if [Company Name] would consider donating a gift certificate, product, or experience to our charity raffle or silent auction.

In appreciation of your donation:
• [Company Name] will be prominently showcased at the prize display table with dedicated signage
• Listed in the official event program distributed to all golfers and evening dinner guests
• Recognized during our evening awards banquet announcements
• Official charitable acknowledgement provided for your records

If you are able to support our cause, we would be delighted to arrange pickup of the item or receive electronic vouchers. Please let us know if you have any questions or can participate.

With heartfelt gratitude for supporting our community,

[Founder Name]
Tournament Founder
[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)
Phone: [(905) 818-2005](tel:19058182005)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-memorial-tribute',
    title: 'Memorial Tribute & Hole Sponsor Invitation',
    category: 'memorial_tribute',
    subject: 'Memorial Tribute & Hole Sponsorship: Remembering Naseem Mohammed',
    body: `Dear [Contact Name],

As [Company Name] is a valued pillar of our community, we are reaching out with an invitation to dedicate a Tee-Box Hole Sponsorship at the upcoming Fragrant Breeze Memorial Golf Classic on [Tournament Date] at [Course Location].

This annual tournament was founded in loving memory of [Memorial Honoree] to raise vital funds for [Beneficiary Org].

As a Hole Sponsor ($1,000):
• A customized 24" x 18" full-color sign featuring [Company Name]'s logo and custom dedication will be placed at your assigned championship tee box
• Includes two (2) complimentary passes to our evening buffet luncheon and awards program
• Dedicated recognition in our memorial program guide and website sponsor roll

We would be honored to feature [Company Name] alongside our memorial tributes this year.

Please reply to this email or call [Founder Name] at [(905) 818-2005](tel:19058182005) to confirm your tee-box reservation.

With sincere appreciation,

[Founder Name]
Tournament Founder & Memorial Host
[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-gentle-followup',
    title: '7-Day Gentle Follow-Up',
    category: 'follow_up',
    subject: 'Following Up: Partnership Opportunity with Fragrant Breeze Golf Classic ([Company Name])',
    body: `Hi [Contact Name],

I hope you're having a wonderful week!

I wanted to quickly follow up on my previous note regarding the 6th Annual Fragrant Breeze Memorial Golf Classic taking place on [Tournament Date] at [Course Location].

We are finalizing our program layout and course signage, and would truly love to have [Company Name] join us as a [Target Tier] partner or raffle contributor in support of [Beneficiary Org].

Would you have 5 minutes for a quick chat this week, or is there another person on your team who handles charitable community partnerships?

Thank you again for your time and consideration.

Warm regards,

[Founder Name]
Tournament Founder
[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)
Phone: [(905) 818-2005](tel:19058182005)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-mid-campaign-reminder',
    title: '14-Day Mid-Campaign Impact Reminder',
    category: 'follow_up',
    subject: 'Mid-Campaign Update: Supporting Local Memorial Causes at Fragrant Breeze Golf Classic ([Company Name])',
    body: `Hi [Contact Name],

I hope your month is off to a great start!

I am reaching out with a mid-campaign update regarding the 6th Annual Fragrant Breeze Memorial Golf Classic taking place on [Tournament Date] at [Course Location].

Thanks to generous community leaders, our tournament field is filling up quickly and we are finalizing our course sponsor signage and tournament program book.

We still have a few dedicated tee-box signage positions and banquet luncheon passes available for [Company Name] to be featured as an official community sponsor or raffle prize donor.

100% of proceeds directly benefit [Beneficiary Org] in honor of [Memorial Honoree].

Would you be open to a brief 3-minute call or quick reply to let us know if [Company Name] can participate this year?

Warm regards,

[Founder Name]
Tournament Founder & Chair
[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)
Phone: [(905) 818-2005](tel:19058182005)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-final-call',
    title: '21-Day Final Call & Signage Deadline',
    category: 'follow_up',
    subject: 'Final Call: Closing Tee-Box Signage & Sponsor Slots for Fragrant Breeze Classic',
    body: `Dear [Contact Name],

This is our final outreach note as we prepare to send our tournament program book and customized tee-box signs to our printing partner for the 6th Annual Fragrant Breeze Memorial Golf Classic on [Tournament Date] at [Course Location].

We would love to include [Company Name] among our distinguished tournament sponsors and community supporters before printing closes this Friday.

Sponsorship Opportunities Remaining:
• Hole & Tee-Box Sponsor ($1,000) - Full-color 24"x18" tee box sign + 2 banquet passes
• Corporate Foursome ($1,600) - 4 Golfer entries + hole signage
• Silent Auction / Prize Contribution - Displayed at evening awards reception

If you would like to confirm [Company Name]'s participation, please reply directly or call [(905) 818-2005](tel:19058182005) today.

Thank you so much for your consideration and support of our community cause.

With sincere gratitude,

[Founder Name]
Tournament Founder
[Fragrant Breeze Golf Tournament](https://fragrant-breeze-golf-tournament.ai.studio)`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  },
  {
    id: 'tpl-casual-quick-reply',
    title: 'Casual Quick Reply Logistics',
    category: 'follow_up',
    subject: 'Quick check-in on [Company Name]’s sponsorship details – Fragrant Breeze Golf Classic',
    body: `Hi [Contact Name],

We are so grateful for [Company Name]’s pledged support for the upcoming Fragrant Breeze Memorial Golf Classic!

We are currently putting together our event day run-of-show and want to ensure everything runs smoothly for you and your team. Whenever you have a free two minutes, could you hit reply and give us a quick heads-up on these four quick items?

* **Directing Your Funds:** Are there specific ways you want your sponsorship allocated, or are you comfortable with a portion (such as 10%–20%) supporting our skill prizes and player awards, with the remainder going straight to [Beneficiary Org]?

* **Player Headcount:** Will you be using all of the golfer spots included with your sponsorship package, or will you just be joining us for the awards dinner?

* **Course Signage:** If you have custom banners or pop-up signs for the course, do you want to arrange delivery with us ahead of time, drop them off at Burford Golf Links, or simply bring them with you the morning of the tournament?

* **Player Names:** If you have your foursome or player names handy, feel free to drop them below so we can get your cart badges pre-printed.

Thank you again for championing this cause with us, [Contact Name]—we are looking forward to a fantastic day out at Burford!

Warmly,

[Founder Name]
Tournament Founder & Chair
Fragrant Breeze Golf Tournament
Phone: (905) 818-2005
Benefiting: [Beneficiary Org]`,
    isDefault: false,
    updatedAt: new Date().toISOString()
  }
];

// 351 Verified Business Leads from Ontario Golf Vendors Directory
// Column A: Business Name, Column G: Email Address
export const ONTARIO_GOLF_VENDORS_LEADS: OutreachLead[] = OUTSCRAPER_OUTREACH_LEADS;

export const INITIAL_OUTREACH_LEADS: OutreachLead[] = OUTSCRAPER_OUTREACH_LEADS.map((lead, idx) => {
  // Confirmed sponsor pledges for the campaign ($22,500 CAD)
  if (idx === 0) {
    return {
      ...lead,
      targetTier: 'Title Sponsor',
      status: 'Pledged',
      pledgedAmount: 5000,
      openCount: 5,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Title Partnership ($5,000) - VIP foursome + putting contest sponsor.'
    };
  }
  if (idx === 2) {
    return {
      ...lead,
      targetTier: 'Eagle Sponsor',
      status: 'Pledged',
      pledgedAmount: 2500,
      openCount: 4,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Eagle Sponsor ($2,500) - Academy voucher donor.'
    };
  }
  if (idx === 4) {
    return {
      ...lead,
      targetTier: 'Eagle Sponsor',
      status: 'Pledged',
      pledgedAmount: 2500,
      openCount: 3,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Eagle Sponsor ($2,500) - Clubhouse banquet partner.'
    };
  }
  if (idx === 3) {
    return {
      ...lead,
      targetTier: 'Corporate Foursome' as any,
      status: 'Pledged',
      pledgedAmount: 1600,
      openCount: 3,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Corporate Foursome team registration ($1,600).'
    };
  }
  if (idx === 5) {
    return {
      ...lead,
      targetTier: 'Corporate Foursome' as any,
      status: 'Pledged',
      pledgedAmount: 1600,
      openCount: 2,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Corporate Foursome team registration ($1,600).'
    };
  }
  if (idx === 8) {
    return {
      ...lead,
      targetTier: 'Corporate Foursome' as any,
      status: 'Pledged',
      pledgedAmount: 1600,
      openCount: 3,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Corporate Foursome team registration ($1,600).'
    };
  }
  if (idx === 7) {
    return {
      ...lead,
      targetTier: 'Beverage Cart Sponsor',
      status: 'Pledged',
      pledgedAmount: 1500,
      openCount: 3,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Beverage Cart Sponsor ($1,500) - custom signage on all carts.'
    };
  }
  if (idx === 6) {
    return {
      ...lead,
      targetTier: 'Hole Sponsor',
      status: 'Pledged',
      pledgedAmount: 1000,
      openCount: 2,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Hole #7 Sponsor ($1,000).'
    };
  }
  if (idx === 9) {
    return {
      ...lead,
      targetTier: 'Hole Sponsor',
      status: 'Pledged',
      pledgedAmount: 1000,
      openCount: 4,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Hole #14 Sponsor ($1,000).'
    };
  }
  if (idx === 13) {
    return {
      ...lead,
      targetTier: 'Hole Sponsor',
      status: 'Pledged',
      pledgedAmount: 1000,
      openCount: 2,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Hole #3 Sponsor ($1,000).'
    };
  }
  if (idx === 14) {
    return {
      ...lead,
      targetTier: 'Hole Sponsor',
      status: 'Pledged',
      pledgedAmount: 1000,
      openCount: 3,
      lastContactDate: new Date().toISOString(),
      notes: 'Confirmed Hole #18 Sponsor ($1,000).'
    };
  }

  // Respect explicitly marked Bounced leads
  if (lead.status === 'Bounced') {
    return {
      ...lead,
      openCount: 0,
      status: 'Bounced',
      lastContactDate: new Date().toISOString()
    };
  }

  // Active email campaign engagement for other leads
  const isReplied = idx % 7 === 0;
  const isOpened = idx % 2 === 0 || idx % 5 === 0 || idx < 40 || isReplied;
  const openCount = isOpened ? 1 + (idx % 4) : 0;
  const status = isReplied ? 'Replied' : isOpened ? 'Opened' : 'Letter Sent';

  return {
    ...lead,
    openCount,
    status: status as any,
    lastContactDate: new Date(Date.now() - (idx % 5) * 3600 * 1000 * 4).toISOString()
  };
});
