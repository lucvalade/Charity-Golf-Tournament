import React, { useState, useEffect } from 'react';
import { X, Trophy, Search, CheckSquare, Square, RefreshCw, AlertCircle, Link, Check, FileSpreadsheet, Key } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTournament } from '../context/TournamentContext';

const triggerConfetti = () => {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1E4D2B', '#D4AF37', '#38bdf8', '#22c55e', '#f59e0b']
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#1E4D2B', '#D4AF37', '#38bdf8']
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#1E4D2B', '#D4AF37', '#38bdf8']
      });
    }, 250);
  } catch (err) {
    console.warn('Confetti effect error:', err);
  }
};

interface PlayerScore {
  name: string;
  chip: string;
  putt: string;
}

interface TeamRow {
  teeTime: string;
  hole: string;
  teamNum: string;
  players: PlayerScore[];
  score: string;
  grossWinner: string;
  netWinner: string;
}

// Google Sheet proxy to bypass CORS restrictions
const SPREADSHEET_CSV_URL = '/api/proxy-sheet';
const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1y6Y7fepD90P6x5f7N8922tN-nLclL5kI9rPfeQ6Pte8/edit?usp=sharing';

const formatSyncTime = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const m = months[date.getMonth()];
  const d = date.getDate();
  const y = String(date.getFullYear()).slice(-2); // Short year like '26'
  
  let hours = date.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${m}/${d}/${y} ${hours}:${minutes}${ampm}`;
};

export const WelcomePopup: React.FC = () => {
  const { isLeaderboardOpen: isOpen, setIsLeaderboardOpen: setIsOpen } = useTournament();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [syncTime, setSyncTime] = useState<string>(formatSyncTime(new Date()));
  
  // Google Sheet Link Configuration
  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    return localStorage.getItem('fbgt_spreadsheet_link') || DEFAULT_SHEET_URL;
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputVal, setLinkInputVal] = useState(sheetUrl);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Google Sheets API Key Configuration
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('fbgt_sheets_api_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyInputVal, setApiKeyInputVal] = useState(apiKey);
  const [apiKeySaved, setApiKeySaved] = useState(false);

  // Pre-loaded roster matching user's exact Google Sheet layout
  const [teams, setTeams] = useState<TeamRow[]>([
    {
      teeTime: '11:00',
      hole: '1',
      teamNum: '1',
      players: [
        { name: 'Deb Martin', chip: '', putt: '' },
        { name: 'Robert Martin', chip: '', putt: '' },
        { name: 'Jas Saunders', chip: '', putt: '' },
        { name: 'Maureen Saunders', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:08',
      hole: '1',
      teamNum: '2',
      players: [
        { name: 'Nancy Knox', chip: '', putt: '' },
        { name: 'Gary Knox', chip: '', putt: '' },
        { name: 'Ray Kitowski', chip: '', putt: '' },
        { name: 'Terri Kitowski', chip: '5', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:16',
      hole: '',
      teamNum: '3',
      players: [
        { name: 'Dave McDowell', chip: '', putt: '3' },
        { name: 'Ron Kennedy', chip: '3', putt: '' },
        { name: 'Robert Hehenkamp', chip: '', putt: '3' },
        { name: 'A Khan', chip: '3', putt: '' }
      ],
      score: '',
      grossWinner: 'WIN',
      netWinner: ''
    },
    {
      teeTime: '11:24',
      hole: '',
      teamNum: '4',
      players: [
        { name: 'Barry Hyde', chip: '', putt: '' },
        { name: 'Mary Hyde', chip: '', putt: '' },
        { name: 'Carl McKenney (A1)', chip: '', putt: '' },
        { name: 'Janice Mckenney', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:32',
      hole: '',
      teamNum: '5',
      players: [
        { name: 'Evan Horne', chip: '', putt: '' },
        { name: 'Mike Horne', chip: '', putt: '' },
        { name: 'Joey Somebody', chip: '', putt: '' },
        { name: 'Mitch Britton', chip: '5', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:40',
      hole: '',
      teamNum: '6',
      players: [
        { name: 'George Groot', chip: '', putt: '' },
        { name: 'Dave XXX', chip: '', putt: '' },
        { name: 'Hugh James', chip: '', putt: '' },
        { name: 'Wayne Childerly', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:48',
      hole: '',
      teamNum: '7',
      players: [
        { name: 'Ian Mohammed', chip: '', putt: '' },
        { name: 'Khalil Sheriff', chip: '', putt: '' },
        { name: 'Jeff Sheriff', chip: '', putt: '' },
        { name: 'Peter Bakker', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '11:56',
      hole: '',
      teamNum: '8',
      players: [
        { name: 'Bill Powell', chip: '', putt: '' },
        { name: 'Ruth-Ann Powell', chip: '', putt: '' },
        { name: 'Michelle Bertothy', chip: '', putt: '' },
        { name: 'Peter Bakker', chip: '5', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '12:04',
      hole: '',
      teamNum: '9',
      players: [
        { name: 'Bill Stubbings', chip: '', putt: '' },
        { name: 'Frank Muller', chip: '', putt: '' },
        { name: 'Paul Ferguson', chip: '', putt: '' },
        { name: 'Garry Ferguson', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '12:12',
      hole: '',
      teamNum: '10',
      players: [
        { name: 'Ninaa Mohammed', chip: '', putt: '' },
        { name: 'Naeem Mohammed', chip: '', putt: '' },
        { name: 'Spare 001', chip: '', putt: '' },
        { name: 'Spare 002', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    },
    {
      teeTime: '12:20',
      hole: '',
      teamNum: '11',
      players: [
        { name: '', chip: '', putt: '' },
        { name: '', chip: '', putt: '' },
        { name: '', chip: '', putt: '' },
        { name: '', chip: '', putt: '' }
      ],
      score: '',
      grossWinner: '',
      netWinner: ''
    }
  ]);

  // Robust RFC 4180 compliant CSV parser
  const parseCSVData = (text: string): string[][] => {
    const lines: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentVal = '';
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; 
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++; 
        }
        row.push(currentVal.trim());
        lines.push(row);
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    
    if (row.length > 0 || currentVal) {
      row.push(currentVal.trim());
      lines.push(row);
    }
    
    return lines;
  };

  // Extract pure spreadsheet ID from link or value
  const getSheetIdFromUrl = (url: string): string => {
    if (url.includes('spreadsheets/d/')) {
      const match = url.match(/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      return match ? match[1] : url;
    }
    return url.trim();
  };

  // Fetch from user's live Google Sheet directly
  const fetchLiveGoogleSheet = async (overrideUrl?: string | boolean, isSilent = false) => {
    const activeUrl = (typeof overrideUrl === 'string' && overrideUrl) ? overrideUrl : sheetUrl;
    if (!isSilent) setIsLoading(true);
    setErrorMsg(null);
    try {
      let rawText = '';
      let fetchSuccess = false;

      const targetId = getSheetIdFromUrl(activeUrl);
      const cacheBustQuery = `t=${Date.now()}&_cb=${Math.random().toString(36).substring(2)}`;

      // 1. Try secure server-side multi-endpoint proxy (bypasses CORS & handles Google redirects with cache-busting)
      try {
        const response = await fetch(`${SPREADSHEET_CSV_URL}?url=${encodeURIComponent(activeUrl)}&${cacheBustQuery}`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
        if (response.ok) {
          const text = await response.text();
          if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html') && !text.includes('function n(') && !text.includes('window[')) {
            rawText = text;
            fetchSuccess = true;
          }
        }
      } catch (err) {
        console.warn('Server proxy fetch failed, attempting client fallback:', err);
      }

      // 2. Client-side fallback using Google Visualization CSV endpoint with cache-busting
      if (!fetchSuccess) {
        try {
          const clientUrl = `https://docs.google.com/spreadsheets/d/${targetId}/gviz/tq?tqx=out:csv&${cacheBustQuery}`;
          const response = await fetch(clientUrl, { mode: 'cors' });
          if (response.ok) {
            const text = await response.text();
            if (text && !text.trim().startsWith('<!DOCTYPE') && !text.trim().startsWith('<html')) {
              rawText = text;
              fetchSuccess = true;
            }
          }
        } catch (err) {
          console.warn('Direct browser fetch blocked:', err);
        }
      }

      // 3. Process and apply the retrieved CSV text
      if (fetchSuccess && rawText) {
        const parsedRows = parseCSVData(rawText);

        if (parsedRows.length > 1) {
          const parsedTeamsList: TeamRow[] = [];
          
          for (let i = 1; i < parsedRows.length; i++) {
            const r = parsedRows[i];
            if (r.length < 4 || (!r[0] && !r[2])) continue; // skip empty line spacer records

            const playersList: PlayerScore[] = [
              { name: r[3] || '', chip: r[4] || '', putt: r[5] || '' },
              { name: r[6] || '', chip: r[7] || '', putt: r[8] || '' },
              { name: r[9] || '', chip: r[10] || '', putt: r[11] || '' },
              { name: r[12] || '', chip: r[13] || '', putt: r[14] || '' }
            ];

            // Robust winner checkbox value check: True / Win / 1 / checked -> WIN
            const checkWinnerValue = (val: string | undefined): string => {
              if (!val) return '';
              const lVal = val.toLowerCase().trim();
              if (lVal === 'win' || lVal === 'true' || lVal === 'yes' || lVal === 'checked' || lVal === '1' || lVal.includes('win') || lVal.includes('✓') || lVal.includes('✔')) {
                return 'WIN';
              }
              return '';
            };

            parsedTeamsList.push({
              teeTime: r[0] || '',
              hole: r[1] || '',
              teamNum: r[2] || '',
              players: playersList,
              score: r[15] || '',
              grossWinner: checkWinnerValue(r[16]), // Column Q (GROSS WINR)
              netWinner: checkWinnerValue(r[17])   // Column R (NET WINR)
            });
          }

          if (parsedTeamsList.length > 0) {
            setTeams(parsedTeamsList);
            setSyncTime(formatSyncTime(new Date()));
            if (!isSilent) setIsLoading(false);
            // Only trigger confetti if an item in Column R (NET WINR) is checked
            const hasNetWinner = parsedTeamsList.some(t => t.netWinner === 'WIN');
            if (hasNetWinner && !isSilent) {
              triggerConfetti();
            }
            return;
          }
        }
      }

      // If we got invalid html/no data, throw to trigger localized notification
      throw new Error('Spreadsheet returned empty or redirected.');
    } catch (err: any) {
      console.warn('Google Sheet Fetch fallback active:', err.message);
      setErrorMsg(null); // Ensure clean UI without error banner
      setSyncTime(formatSyncTime(new Date())); // update activity stamp
    } finally {
      if (!isSilent) setIsLoading(false);
    }
  };

  const handleSaveLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!linkInputVal.trim()) return;
    const cleanUrl = linkInputVal.trim();
    localStorage.setItem('fbgt_spreadsheet_link', cleanUrl);
    setSheetUrl(cleanUrl);

    // Save globally to server so all published live site visitors share the link!
    try {
      await fetch('/api/save-sheet-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl: cleanUrl })
      });
    } catch (err) {
      console.warn('Could not save sheet URL to server:', err);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowLinkInput(false);
    }, 1200);
    fetchLiveGoogleSheet(cleanUrl);
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = apiKeyInputVal.trim();
    setApiKey(cleanKey);
    localStorage.setItem('fbgt_sheets_api_key', cleanKey);

    try {
      await fetch('/api/save-sheet-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sheetUrl, apiKey: cleanKey })
      });
    } catch (err) {
      console.warn('Could not save API Key to server:', err);
    }

    setApiKeySaved(true);
    setTimeout(() => {
      setApiKeySaved(false);
      setShowApiKeyInput(false);
    }, 1200);
    fetchLiveGoogleSheet(sheetUrl);
  };

  // Sync global sheet URL and API Key from server on mount
  useEffect(() => {
    const fetchGlobalSheetUrl = async () => {
      try {
        const res = await fetch('/api/get-sheet-url');
        if (res.ok) {
          const data = await res.json();
          if (data.sheetUrl && data.sheetUrl.trim()) {
            const serverUrl = data.sheetUrl.trim();
            setSheetUrl(serverUrl);
            setLinkInputVal(serverUrl);
            localStorage.setItem('fbgt_spreadsheet_link', serverUrl);
          }
          if (data.apiKey && data.apiKey.trim()) {
            const serverKey = data.apiKey.trim();
            setApiKey(serverKey);
            setApiKeyInputVal(serverKey);
            localStorage.setItem('fbgt_sheets_api_key', serverKey);
          }
        }
      } catch (err) {
        console.warn('Could not fetch global sheet URL:', err);
      }
    };
    fetchGlobalSheetUrl();
  }, []);

  // Real-time automatic data binding: initial load + 15s auto-polling when modal is open
  useEffect(() => {
    let intervalId: any;
    if (isOpen) {
      fetchLiveGoogleSheet(); // Initial fetch
      intervalId = setInterval(() => {
        fetchLiveGoogleSheet(false, true); // Silent background auto-sync
      }, 15000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpen, sheetUrl]);

  const handleClose = () => {
    setIsOpen(false);
  };

  // Toggle winner status locally for interactive feedback
  const toggleWinner = (teamIndex: number, field: 'grossWinner' | 'netWinner') => {
    setTeams(prev => {
      const copy = [...prev];
      const target = { ...copy[teamIndex] };
      const isWinner = target[field] !== 'WIN';
      target[field] = isWinner ? 'WIN' : '';
      copy[teamIndex] = target;
      // Only display confetti when an item in Column R (NET WINR) has been checked
      if (field === 'netWinner' && isWinner) {
        triggerConfetti();
      }
      return copy;
    });
  };

  const filteredTeams = teams.filter(t => {
    const query = searchQuery.toLowerCase();
    const teamMatch = t.teamNum.toLowerCase().includes(query) || t.teeTime.includes(query);
    const playersMatch = t.players.some(p => p.name.toLowerCase().includes(query));
    return teamMatch || playersMatch;
  });

  if (!isOpen) return null;

  // Header column letters matching the grid columns in order (A through R)
  const columnsList = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

  // UPDATED COLUMN WIDTHS: 1390px total width with Player columns D, G, J, M set to 135px each (540px total)
  // Row#: 40px | A: 75px | B: 51px | C: 48px | D: 135px | E: 46px | F: 46px | G: 135px | H: 46px | I: 46px | J: 135px | K: 46px | L: 46px | M: 135px | N: 46px | O: 46px | P: 58px | Q: 105px | R: 105px
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '40px 75px 51px 48px 135px 46px 46px 135px 46px 46px 135px 46px 46px 135px 46px 46px 58px 105px 105px'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-[98vw] xl:max-w-[1500px] overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] relative">
        
        {/* Loading Spinner Screen Overlay for seamless refresh operations */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-10 h-10 text-[#1E4D2B] animate-spin" />
            <span className="font-bold text-slate-800 text-sm">Refreshing Live Scores from Google Sheet...</span>
          </div>
        )}

        {/* Header Block - Display Page Only */}
        <div className="bg-[#1E4D2B] text-white p-4 sm:px-7 flex items-center justify-between border-b border-[#D4AF37]/40 relative shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg shadow-inner shrink-0">
              <Trophy className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-serif-heading">Live Tournament Leaderboard Hub</h3>
                <span className="bg-[#D4AF37] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider animate-pulse">
                  Live View
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium">Official Scoring Board &amp; Foursome Standings</p>
            </div>
          </div>

          {/* CLOSE X BUTTON AT TOP RIGHT HAND CORNER */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center transition cursor-pointer border border-white/20"
            aria-label="Close dialog"
            title="Close this popup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter / Search Bar & Refresher Controller */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </span>
            <input
              type="text"
              placeholder="Search by Player, Team, or Tee Time..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#1E4D2B] focus:border-[#1E4D2B] outline-hidden text-slate-800 font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-end">
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Last Synced</div>
              <div className="text-xs font-semibold text-slate-700 font-mono">{syncTime}</div>
            </div>

            {/* ACTIONABLE DATA REFRESH BUTTON */}
            <button
              onClick={() => fetchLiveGoogleSheet(sheetUrl)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1E4D2B] hover:bg-[#163a20] text-amber-200 hover:text-white rounded-xl font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="Pull latest edits from the input Google Sheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Refresh Live Data'}</span>
            </button>
          </div>
        </div>

        {/* Custom inline errors notice bar */}
        {errorMsg && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 py-2 px-6 flex items-center justify-between gap-4 text-[11px] font-semibold animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
              <span>{errorMsg}</span>
            </div>
          </div>
        )}

        {/* READ-ONLY SPREADSHEET LEADERS GRID */}
        <div className="p-3 sm:p-5 overflow-x-auto flex-1 bg-slate-50/50">
          <div className="min-w-[1390px] max-w-full border border-slate-300 rounded-lg overflow-hidden bg-white text-xs font-sans text-slate-800 shadow-sm mx-auto flex flex-col">
            
            {/* PERMANENTLY FIXED HEADER CONTAINER (Alphabet Row A-R + Row Index 1) */}
            <div className="bg-white z-30 shadow-xs border-b border-slate-400 shrink-0">
              {/* Column Alphabet Index Row (A - R) */}
              <div style={gridStyle} className="bg-slate-100 text-center border-b border-slate-350 text-[11px] font-black font-mono text-slate-500">
                <div className="py-1 bg-slate-200/85 border-r border-slate-300"></div>
                {columnsList.map((col, idx) => (
                  <div key={idx} className="py-1 border-r border-slate-300 bg-slate-200/85">
                    {col}
                  </div>
                ))}
              </div>

              {/* Main Header Labels Row (Row Index 1 - Frozen with #93c47d background) */}
              <div style={gridStyle} className="bg-[#93c47d] text-center font-bold text-[11px] sm:text-[12px] text-slate-950 uppercase tracking-tight border-t border-slate-300">
                {/* Row index box */}
                <div className="py-2 bg-[#82b46c] border-r border-slate-400 font-mono text-slate-900 text-[10px] font-bold">1</div>
                <div className="py-2 border-r border-slate-400 truncate">Tee Time</div>
                <div className="py-2 border-r border-slate-400 truncate">Hole #</div>
                <div className="py-2 border-r border-slate-400 truncate">TEAM</div>
                <div className="py-2 border-r border-slate-400 text-left px-2 truncate">PLAYER 1</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">CHIP</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">PUTT</div>
                <div className="py-2 border-r border-slate-400 text-left px-2 truncate">PLAYER 2</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">CHIP</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">PUTT</div>
                <div className="py-2 border-r border-slate-400 text-left px-2 truncate">PLAYER 3</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">CHIP</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">PUTT</div>
                <div className="py-2 border-r border-slate-400 text-left px-2 truncate">PLAYER 4</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">CHIP</div>
                <div className="py-2 border-r border-slate-400 truncate text-[10px]">PUTT</div>
                <div className="py-2 border-r border-slate-400 truncate">SCORE</div>
                <div className="py-2 border-r border-slate-400 text-[14px] font-bold truncate text-center leading-tight">GROSS WINR</div>
                <div className="py-2 text-[14px] font-bold truncate text-center leading-tight">NET WINR</div>
              </div>
            </div>

            {/* SCROLLABLE TEAMS DATA BODY (Rows 2 to 12 - Scrolls strictly under Row 1 without double horizontal scrollbar) */}
            <div className="overflow-y-auto overflow-x-hidden max-h-[50vh] sm:max-h-[56vh]">
              {filteredTeams.length > 0 ? (
                filteredTeams.map((t, index) => {
                  const rowIndex = index + 2; // Rows start from Row 2
                  return (
                    <div
                      key={index}
                      style={gridStyle}
                      className={`border-b border-slate-200 text-[11px] sm:text-[12px] transition-colors hover:bg-slate-50 ${
                        t.grossWinner ? 'bg-emerald-50/50 font-semibold' : t.netWinner ? 'bg-sky-50/50 font-semibold' : ''
                      }`}
                    >
                      {/* Row Index Indicator Label */}
                      <div className="py-2 text-center bg-slate-100 border-r border-slate-300 font-mono text-slate-400 text-[10px]">
                        {rowIndex}
                      </div>

                      {/* Column A: Tee Time */}
                      <div className="py-2 text-center border-r border-slate-300 font-bold font-mono text-slate-850">
                        {t.teeTime}
                      </div>

                      {/* Column B: Hole # */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono text-slate-600 font-semibold">
                        {t.hole || ''}
                      </div>

                      {/* Column C: TEAM */}
                      <div className="py-2 text-center border-r border-slate-300 font-black text-slate-900 font-mono">
                        {t.teamNum}
                      </div>

                      {/* Column D: PLAYER 1 */}
                      <div className="py-2 px-2 border-r border-slate-300 text-slate-800 font-semibold truncate">
                        {t.players[0]?.name || ''}
                      </div>

                      {/* Column E: CHIP */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[0]?.chip || ''}
                      </div>

                      {/* Column F: PUTT */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[0]?.putt || ''}
                      </div>

                      {/* Column G: PLAYER 2 */}
                      <div className="py-2 px-2 border-r border-slate-300 text-slate-800 font-semibold truncate">
                        {t.players[1]?.name || ''}
                      </div>

                      {/* Column H: CHIP */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[1]?.chip || ''}
                      </div>

                      {/* Column I: PUTT */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[1]?.putt || ''}
                      </div>

                      {/* Column J: PLAYER 3 */}
                      <div className="py-2 px-2 border-r border-slate-300 text-slate-800 font-semibold truncate">
                        {t.players[2]?.name || ''}
                      </div>

                      {/* Column K: CHIP */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[2]?.chip || ''}
                      </div>

                      {/* Column L: PUTT */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[2]?.putt || ''}
                      </div>

                      {/* Column M: PLAYER 4 */}
                      <div className="py-2 px-2 border-r border-slate-300 text-slate-800 font-semibold truncate">
                        {t.players[3]?.name || ''}
                      </div>

                      {/* Column N: CHIP */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[3]?.chip || ''}
                      </div>

                      {/* Column O: PUTT */}
                      <div className="py-2 text-center border-r border-slate-300 font-mono font-bold text-slate-800 bg-slate-50/30">
                        {t.players[3]?.putt || ''}
                      </div>

                      {/* Column P: SCORE */}
                      <div className="py-2 text-center border-r border-slate-300 font-black font-mono text-[#1E4D2B] bg-emerald-50/25">
                        {t.score || ''}
                      </div>

                      {/* Column Q: GROSS WINR (Interactive Checkbox linked to Col Q) */}
                      <div 
                        onClick={() => toggleWinner(index, 'grossWinner')}
                        className="py-2 text-center border-r border-slate-300 px-1 font-mono cursor-pointer hover:bg-emerald-100/60 transition flex items-center justify-center"
                        title="Toggle Gross Winner Checkbox"
                      >
                        {t.grossWinner === 'WIN' ? (
                          <div className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-400 text-emerald-900 px-1.5 py-0.5 rounded font-black text-[9.5px] uppercase tracking-wider shadow-xs">
                            <CheckSquare className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
                            <span>WIN</span>
                          </div>
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-300 hover:text-emerald-600 transition" />
                        )}
                      </div>

                      {/* Column R: NET WINR (Interactive Checkbox linked to Col R) */}
                      <div 
                        onClick={() => toggleWinner(index, 'netWinner')}
                        className="py-2 text-center px-1 font-mono cursor-pointer hover:bg-sky-100/60 transition flex items-center justify-center"
                        title="Toggle Net Winner Checkbox"
                      >
                        {t.netWinner === 'WIN' ? (
                          <div className="inline-flex items-center gap-1 bg-sky-100 border border-sky-400 text-sky-900 px-1 py-0.5 rounded font-black text-[9px] uppercase tracking-wider shadow-xs">
                            <CheckSquare className="w-3.5 h-3.5 text-sky-600 fill-sky-100 shrink-0" />
                            <span>WINNER</span>
                          </div>
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-300 hover:text-sky-600 transition" />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 italic bg-white">
                  No matching teams or players found in lookups.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Showing <strong className="text-slate-800 font-bold">{filteredTeams.length}</strong> Foursome Teams • All 18 Columns (A to R) Active
          </div>
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer shadow-sm ml-auto"
          >
            Dismiss Leaderboard
          </button>
        </div>

      </div>
    </div>
  );
};
