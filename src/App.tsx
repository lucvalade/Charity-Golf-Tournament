/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TournamentProvider, useTournament } from './context/TournamentContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FundraisingTracker } from './components/FundraisingTracker';
import { MemorialStory } from './components/MemorialStory';
import { EventDetails } from './components/EventDetails';
import { RegistrationSection } from './components/RegistrationSection';
import { SponsorshipsSection } from './components/SponsorshipsSection';
import { SquabbitScoringSection } from './components/SquabbitScoringSection';
import { ImpactSection } from './components/ImpactSection';
import { DonationSection } from './components/DonationSection';
import { TributesWall } from './components/TributesWall';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Regular Admin Page
import { AdminPortalPage } from './components/AdminPortalPage';

// Public Modals
import { RegistrationModal } from './components/RegistrationModal';
import { SponsorModal } from './components/SponsorModal';
import { DonationModal } from './components/DonationModal';
import { AddMemorialNoteModal } from './components/AddMemorialNoteModal';
import { GameDayAgendaModal } from './components/GameDayAgendaModal';
import { WelcomePopup } from './components/WelcomePopup';
import { ApiKeySettingsModal } from './components/ApiKeySettingsModal';

function TournamentAppContent() {
  const { isAdminOpen, setIsAdminOpen, isApiKeyModalOpen, setIsApiKeyModalOpen } = useTournament();

  // If in Admin Mode (/admin), render as a regular standalone page, NOT a popup
  if (isAdminOpen) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
        <AdminPortalPage onBackToSite={() => setIsAdminOpen(false)} />
        <ApiKeySettingsModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
        <ToastContainer />
      </div>
    );
  }

  // Otherwise, render the public tournament application
  return (
    <div className="min-h-screen bg-[#FBFBFA] text-slate-900 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#1E4D2B]">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Countdown Timer & Quick CTAs */}
        <Hero />

        {/* 2. Live Fundraising Tracker & Impact Progress Bar */}
        <FundraisingTracker />

        {/* 3. About Us: Memorial Story, Late Wife Tribute & Founder's Letter */}
        <MemorialStory />

        {/* 4. Tournament Details: 18-Hole Scramble, Official Schedule & Course Map */}
        <EventDetails />

        {/* 5. Register: Digital Registration Card (Foursomes, Individual, Dinner Only, Add-ons) */}
        <RegistrationSection />

        {/* 6. Sponsorships: Tiered Corporate Packages & Showcase */}
        <SponsorshipsSection />

        {/* 7. Live Scoring (Squabbit): Hub, Pairing Matrix, Direct App Links & Rules */}
        <SquabbitScoringSection />

        {/* 8. Our Cause / Impact: Metric counters & Fund Allocation Breakdown */}
        <ImpactSection />

        {/* 9. Open Memorial Donation Engine & Tax-Deductible Gifting */}
        <DonationSection />

        {/* 10. Community Messages & Memorial Tribute Book */}
        <TributesWall />

        {/* 11. FAQ: Weather, Dress Code, Rentals & Scoring Format */}
        <FaqSection />

        {/* 12. Contact: Organizer details & On-Course Volunteer Sign-Up */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Public Modals & Site Load Announcement */}
      <WelcomePopup />
      <RegistrationModal />
      <SponsorModal />
      <DonationModal />
      <AddMemorialNoteModal />
      <GameDayAgendaModal />
      <ApiKeySettingsModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />

      {/* Global Notification Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <TournamentProvider>
      <TournamentAppContent />
    </TournamentProvider>
  );
}
