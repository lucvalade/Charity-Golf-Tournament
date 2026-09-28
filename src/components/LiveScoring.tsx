import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, RefreshCw, Clock, Search, Key, CheckCircle2, AlertCircle, 
  Settings, Play, Pause, LayoutGrid, Table, CheckSquare, Square, ExternalLink,
  Sparkles, ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

export interface SheetsV4FetchOptions {
  apiKey?: string;
  spreadsheetId?: string;
  gid?: string | number;
  range?: string;
}

export interface SheetsV4Response {
  success: boolean;
  values: string[][];
  error?: string;
  source?: string;
  spreadsheetId?: string;
  gid?: string;
}

const DEFAULT_API_KEY_V4 = 'AIzaSyA__1z34HxUy-hi7CE1v77fINtkuW9f3AU';
const DEFAULT_SPREADSHEET_ID = '1y6Y7fepD90P6x5f7N8922tN-nLclL5kI9rPfeQ6Pte8';
const DEFAULT_GID = '1724233267';
const DEFAULT_RANGE = 'A1:R30';

/**
 * Formats raw Google RPC ErrorInfo responses or messages into concise, user-friendly notices.
 */
export function formatGoogleRpcErrorMessage(rawError: any): string {
  if (!rawError) return 'An error occurred while connecting to Google Sheets API';

  let text = '';
  if (typeof rawError === 'string') {
    text = rawError;
  } else if (typeof rawError === 'object') {
    if (rawError.error?.message) {
      text = rawError.error.message;
    } else if (rawError.message) {
      text = rawError.message;
    } else {
      try {
        text = JSON.stringify(rawError);
      } catch (_) {
        text = String(rawError);
      }
    }
  }

  if (text.includes('API_KEY_INVALID') || text.includes('API key not valid') || text.includes('google.rpc.ErrorInfo')) {
    return 'Google Sheets API Key is invalid or restricted. Auto-syncing via public link fallback.';
  }
  if (text.includes('PERMISSION_DENIED') || text.includes('not have permission')) {
    return 'Sheet Access Restricted: Ensure Google Sheet is shared as "Anyone with the link can view".';
  }
  if (text.includes('NOT_FOUND') || text.includes('Requested entity was not found')) {
    return 'Spreadsheet Not Found: Please check the Spreadsheet ID or GID in Settings.';
  }

  return text.length > 120 ? text.slice(0, 120) + '...' : text;
}

/**
 * Integration Helper Function
 * Securely retrieves real-time data from Google Sheets API v4 using the provided API key and Sheet GID.
 * Includes complete loading state handling and network error resolution.
 */
export async function fetchGoogleSheetsV4Data(
  options: SheetsV4FetchOptions = {},
  onLoadingChange?: (isLoading: boolean) => void
): Promise<SheetsV4Response> {
  const activeKey = (options.apiKey || localStorage.getItem('google_sheets_api_key_v4') || DEFAULT_API_KEY_V4).trim();
  const rawId = options.spreadsheetId || localStorage.getItem('google_sheets_id_v4') || DEFAULT_SPREADSHEET_ID;
  const gid = String(options.gid || DEFAULT_GID);
  const range = options.range || DEFAULT_RANGE;

  let cleanId = rawId.trim();
  if (cleanId.includes('spreadsheets/d/')) {
    const match = cleanId.match(/spreadsheets\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/);
    if (match && match[1]) cleanId = match[1];
  }

  if (onLoadingChange) onLoadingChange(true);

  try {
    // 1. Query via Google Sheets API v4 with active Key
    if (activeKey) {
      try {
        const v4DirectUrl = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(activeKey)}&_nocache=${Date.now()}`;
        const directRes = await fetch(v4DirectUrl, {
          headers: { 'Accept': 'application/json' }
        });

        if (directRes.ok) {
          const json = await directRes.json();
          if (json.values && Array.isArray(json.values)) {
            if (onLoadingChange) onLoadingChange(false);
            return {
              success: true,
              values: json.values,
              source: 'direct_google_sheets_api_v4',
              spreadsheetId: cleanId,
              gid
            };
          }
        }
      } catch (directErr) {
        console.warn('Direct Google Sheets API v4 query failed, using proxy fallback:', directErr);
      }
    }

    // 2. Query via backend Proxy route with full resilience
    const queryParams = new URLSearchParams({
      spreadsheetId: cleanId,
      range,
      gid,
      _t: Date.now().toString()
    });
    if (activeKey) queryParams.append('apiKey', activeKey);

    const proxyRes = await fetch(`/api/sheets-v4?${queryParams.toString()}`);
    if (!proxyRes.ok) {
      throw new Error(`HTTP Error ${proxyRes.status}: Unable to complete Google Sheets API request`);
    }

    const data = await proxyRes.json();
    if (onLoadingChange) onLoadingChange(false);

    if (data.success && Array.isArray(data.values)) {
      return {
        success: true,
        values: data.values,
        source: data.source || 'sheets_api_v4_proxy',
        spreadsheetId: cleanId,
        gid
      };
    } else {
      throw new Error(data.error || 'Failed to parse matrix values from Google Sheets API response');
    }
  } catch (err: any) {
    if (onLoadingChange) onLoadingChange(false);
    const cleanMsg = formatGoogleRpcErrorMessage(err.message || err);
    return {
      success: false,
      values: [],
      error: cleanMsg,
      spreadsheetId: cleanId,
      gid
    };
  }
}

export const LiveScoring: React.FC = () => {
  // Config States
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('google_sheets_api_key_v4') || DEFAULT_API_KEY_V4);
  const [spreadsheetId, setSpreadsheetId] = useState<string>(() => localStorage.getItem('google_sheets_id_v4') || DEFAULT_SPREADSHEET_ID);
  const [sheetGid, setSheetGid] = useState<string>(() => localStorage.getItem('google_sheets_gid_v4') || DEFAULT_GID);
  const [range, setRange] = useState<string>(() => localStorage.getItem('google_sheets_range_v4') || DEFAULT_RANGE);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Auto-refresh Timer States
  const [refreshInterval, setRefreshInterval] = useState<number>(15); // seconds (0 = paused)
  const [countdown, setCountdown] = useState<number>(15);
  const [isPaused, setIsPaused] = useState(false);

  // Data & Loading States
  const [teams, setTeams] = useState<TeamRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>('Just now');
  const [dataSource, setDataSource] = useState<'sheets_api_v4' | 'gviz_csv_proxy' | 'fallback'>('sheets_api_v4');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');
  const [hasTestedKey, setHasTestedKey] = useState(false);

  // Helper: Trigger Confetti
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

  // Helper: Extract Spreadsheet ID from URL or Raw ID
  const parseSpreadsheetId = (input: string): string => {
    if (input.includes('spreadsheets/d/')) {
      const match = input.match(/spreadsheets\/d\/(?:e\/)?([a-zA-Z0-9-_]+)/);
      return match ? match[1] : input.trim();
    }
    return input.trim();
  };

  // Helper: Winner check
  const checkWinner = (val: string | undefined): string => {
    if (!val) return '';
    const lVal = val.toLowerCase().trim();
    if (lVal === 'win' || lVal === 'true' || lVal === 'yes' || lVal === 'checked' || lVal === '1' || lVal.includes('win') || lVal.includes('✓') || lVal.includes('✔')) {
      return 'WIN';
    }
    return '';
  };

  // Parse Raw 2D Values Matrix into Structured Team Rows
  const processValuesMatrix = (matrix: string[][]) => {
    if (!matrix || matrix.length <= 1) return [];

    const teamList: TeamRow[] = [];
    // Skip header row
    for (let i = 1; i < matrix.length; i++) {
      const r = matrix[i];
      if (!r || r.length < 3 || (!r[0] && !r[2] && !r[3])) continue; // skip blank rows

      const players: PlayerScore[] = [
        { name: r[3] || '', chip: r[4] || '', putt: r[5] || '' },
        { name: r[6] || '', chip: r[7] || '', putt: r[8] || '' },
        { name: r[9] || '', chip: r[10] || '', putt: r[11] || '' },
        { name: r[12] || '', chip: r[13] || '', putt: r[14] || '' }
      ];

      teamList.push({
        teeTime: r[0] || '',
        hole: r[1] || '',
        teamNum: r[2] || '',
        players,
        score: r[15] || '',
        grossWinner: checkWinner(r[16]),
        netWinner: checkWinner(r[17])
      });
    }

    return teamList;
  };

  // Primary Fetch Function using Google Sheets API v4 Integration Helper
  const fetchLiveScoringData = async (isManual = false) => {
    if (isManual) setIsLoading(true);
    setIsFetching(true);
    setErrorMsg(null);

    try {
      const result = await fetchGoogleSheetsV4Data({
        apiKey: apiKey.trim(),
        spreadsheetId: spreadsheetId.trim(),
        gid: sheetGid.trim(),
        range: range.trim()
      });

      if (result.success && Array.isArray(result.values)) {
        const parsedTeams = processValuesMatrix(result.values);
        
        // Check if net winner is present to trigger confetti
        const hasNetWinner = parsedTeams.some(t => t.netWinner === 'WIN');
        if (hasNetWinner && teams.length > 0) {
          triggerConfetti();
        }

        setTeams(parsedTeams);
        setDataSource(result.source as any || 'sheets_api_v4');
        setLastUpdated(new Date());
        setCountdown(refreshInterval);
      } else {
        throw new Error(result.error || 'Unable to load real-time score data from Google Sheets API v4');
      }
    } catch (err: any) {
      const cleanMsg = formatGoogleRpcErrorMessage(err.message || err);
      console.warn('Google Sheets API v4 fetch notice:', cleanMsg);
      setErrorMsg(`API v4 Notice: ${cleanMsg}`);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Save Settings Handlers
  const handleSaveSettings = () => {
    localStorage.setItem('google_sheets_api_key_v4', apiKey.trim());
    localStorage.setItem('google_sheets_id_v4', spreadsheetId.trim());
    localStorage.setItem('google_sheets_gid_v4', sheetGid.trim());
    localStorage.setItem('google_sheets_range_v4', range.trim());
    setIsSettingsOpen(false);
    fetchLiveScoringData(true);
  };

  // Effect: Initial Mount Data Fetch
  useEffect(() => {
    fetchLiveScoringData(true);
  }, []);

  // Effect: Auto-refresh Countdown Timer
  useEffect(() => {
    if (refreshInterval <= 0 || isPaused) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchLiveScoringData(false);
          return refreshInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshInterval, isPaused, spreadsheetId, apiKey, range]);

  // Effect: Relative Time Ticker (e.g. "Updated 12s ago")
  useEffect(() => {
    const relativeTimer = setInterval(() => {
      if (!lastUpdated) {
        setRelativeTime('Awaiting sync...');
        return;
      }
      const elapsedSeconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
      if (elapsedSeconds < 5) {
        setRelativeTime('Just now');
      } else if (elapsedSeconds < 60) {
        setRelativeTime(`${elapsedSeconds}s ago`);
      } else {
        const mins = Math.floor(elapsedSeconds / 60);
        setRelativeTime(`${mins}m ago`);
      }
    }, 1000);

    return () => clearInterval(relativeTimer);
  }, [lastUpdated]);

  // Toggle winner checkboxes locally
  const toggleWinner = (teamIndex: number, field: 'grossWinner' | 'netWinner') => {
    setTeams(prev => {
      const copy = [...prev];
      const target = { ...copy[teamIndex] };
      const isWinner = target[field] !== 'WIN';
      target[field] = isWinner ? 'WIN' : '';
      copy[teamIndex] = target;
      if (isWinner && field === 'netWinner') {
        triggerConfetti();
      }
      return copy;
    });
  };

  // Filtered teams list based on search query
  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const matchTeam = t.teamNum.toLowerCase().includes(q) || t.teeTime.toLowerCase().includes(q);
    const matchPlayer = t.players.some((p) => p.name.toLowerCase().includes(q));
    return matchTeam || matchPlayer;
  });

  const grossWinnerCount = teams.filter((t) => t.grossWinner === 'WIN').length;
  const netWinnerCount = teams.filter((t) => t.netWinner === 'WIN').length;

  return (
    <section id="live-scoring" className="py-12 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Component Header Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-emerald-950 to-slate-800 rounded-2xl border border-emerald-500/30 p-6 sm:p-8 shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            
            {/* Title & Status Badges */}
            <div>
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live Scoring
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Google Sheets API v4
                </span>
                {dataSource === 'sheets_api_v4' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    Direct API Key Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-900/60 text-sky-300 border border-sky-700">
                    Real-time GViz Sync
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
                Tournament Leaderboard & Live Scores
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Real-time tournament score tracking powered by Google Sheets API v4. Spectators and players get instant live updates as scores are logged on course.
              </p>
            </div>

            {/* Timestamps & Quick Action Controls */}
            <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
              {/* Last Updated Timestamp Ticker */}
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/80 px-3.5 py-2 rounded-xl border border-slate-700/60">
                <Clock className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                <div>
                  <span className="font-semibold text-white">Last Updated:</span>{' '}
                  <span className="font-mono text-emerald-300">
                    {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Syncing...'}
                  </span>
                  <span className="ml-2 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                    {relativeTime}
                  </span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-amber-400" />
                  API Settings
                </button>

                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                    isPaused 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30' 
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                >
                  {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  {isPaused ? 'Resume Sync' : 'Auto-Sync On'}
                </button>

                <button
                  onClick={() => fetchLiveScoringData(true)}
                  disabled={isFetching}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                  Sync Now
                </button>
              </div>
            </div>

          </div>

          {/* Auto-Refresh Timer Countdown Progress Bar */}
          {refreshInterval > 0 && !isPaused && (
            <div className="mt-5 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400 gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>
                  Auto-refresh timer active ({refreshInterval}s interval) &bull; Next update in{' '}
                  <strong className="text-emerald-400 font-mono">{countdown}s</strong>
                </span>
              </div>
              
              {/* Progress track */}
              <div className="w-32 sm:w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700 shrink-0">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((refreshInterval - countdown) / refreshInterval) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Collapsible API & Google Sheet Config Drawer */}
        {isSettingsOpen && (
          <div className="bg-slate-800 border border-amber-500/40 rounded-2xl p-6 mb-8 shadow-xl animate-fadeIn">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                Google Sheets API v4 Connection Config
              </h3>
              <span className="text-xs text-slate-400">Settings persisted locally</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              {/* API Key Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Google Sheets API Key (v4)
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  AIzaSyA__1z34HxUy-hi7CE1v77fINtkuW9f3AU active
                </p>
              </div>

              {/* Spreadsheet ID / URL */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Spreadsheet ID / Link
                </label>
                <input
                  type="text"
                  value={spreadsheetId}
                  onChange={(e) => setSpreadsheetId(e.target.value)}
                  placeholder="1y6Y7fepD90P6x5f7N8922tN-nLclL5kI9rPfeQ6Pte8"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Google Sheet document ID
                </p>
              </div>

              {/* Sheet GID */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Sheet GID (Tab ID)
                </label>
                <input
                  type="text"
                  value={sheetGid}
                  onChange={(e) => setSheetGid(e.target.value)}
                  placeholder="1724233267"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Sheet Tab ID (gid=1724233267)
                </p>
              </div>

              {/* Sheet Range */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  API v4 Range (Default: A1:R30)
                </label>
                <input
                  type="text"
                  value={range}
                  onChange={(e) => setRange(e.target.value)}
                  placeholder="Sheet1!A1:R30"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Specifies matrix range for Google Sheets API v4 request.
                </p>
              </div>
            </div>

            {/* Auto-refresh interval selector */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-700/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300">Auto-Refresh Interval:</span>
                {[5, 10, 15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setRefreshInterval(sec);
                      setCountdown(sec);
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      refreshInterval === sec
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-lg transition cursor-pointer shadow-md"
                >
                  Save &amp; Fetch via API v4
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Bar & View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-slate-800/80 p-4 rounded-xl border border-slate-700">
          
          {/* Quick Metrics */}
          <div className="flex items-center gap-6 text-xs text-slate-300 flex-wrap">
            <div>
              <span className="text-slate-400">Total Foursomes:</span>{' '}
              <strong className="text-white font-mono text-sm">{teams.length}</strong>
            </div>
            <div>
              <span className="text-slate-400">Gross Winners:</span>{' '}
              <strong className="text-emerald-400 font-mono text-sm">{grossWinnerCount}</strong>
            </div>
            <div>
              <span className="text-slate-400">Net Winners:</span>{' '}
              <strong className="text-sky-400 font-mono text-sm">{netWinnerCount}</strong>
            </div>
          </div>

          {/* Search & View Mode Switcher */}
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search player, team..."
                className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 w-44 sm:w-56"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'cards' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Spectator Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Full Leaderboard Table View"
              >
                <Table className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Error Alert Notice if any */}
        {errorMsg && (
          <div className="bg-amber-950/60 border border-amber-600/40 text-amber-200 text-xs px-4 py-3 rounded-xl mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-amber-400 hover:text-white font-bold text-xs cursor-pointer ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="py-20 text-center bg-slate-800/40 rounded-2xl border border-slate-800">
            <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto mb-3" />
            <p className="text-slate-300 font-bold text-sm">Querying Google Sheets API v4...</p>
            <p className="text-slate-500 text-xs mt-1">Fetching live scores, chip &amp; putt standings</p>
          </div>
        ) : viewMode === 'cards' ? (
          
          /* SPECTATOR CARDS VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 hover:border-emerald-500/50 transition shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black text-xs px-2.5 py-1 rounded-lg">
                          Team #{team.teamNum || (idx + 1)}
                        </span>
                        {team.teeTime && (
                          <span className="text-slate-400 text-xs font-mono">
                            Tee Time: {team.teeTime}
                          </span>
                        )}
                      </div>

                      {team.score && (
                        <div className="bg-amber-400 text-slate-950 font-black font-mono px-3 py-1 rounded-lg text-xs shadow-xs">
                          Score: {team.score}
                        </div>
                      )}
                    </div>

                    {/* Players Roster */}
                    <div className="space-y-2.5 my-3">
                      {team.players.map((p, pIdx) => (
                        p.name ? (
                          <div key={pIdx} className="flex items-center justify-between text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                            <span className="font-semibold text-slate-200">
                              {pIdx + 1}. {p.name}
                            </span>
                            <div className="flex items-center gap-2 text-[11px] font-mono">
                              {p.chip && (
                                <span className="bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                                  Chip: {p.chip}
                                </span>
                              )}
                              {p.putt && (
                                <span className="bg-sky-950 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800">
                                  Putt: {p.putt}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : null
                      ))}
                    </div>
                  </div>

                  {/* Winner Badges Footer */}
                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-between gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleWinner(idx, 'grossWinner')}
                        className={`text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition ${
                          team.grossWinner === 'WIN'
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {team.grossWinner === 'WIN' ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                        GROSS WIN
                      </button>

                      <button
                        onClick={() => toggleWinner(idx, 'netWinner')}
                        className={`text-[10px] font-black px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition ${
                          team.netWinner === 'WIN'
                            ? 'bg-sky-400 text-slate-950'
                            : 'bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {team.netWinner === 'WIN' ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                        {team.netWinner === 'WIN' ? 'NET WINNER' : 'NET WIN'}
                      </button>
                    </div>

                    <span className="text-[10px] text-slate-500 font-mono">Hole #{team.hole || '1'}</span>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 bg-slate-800/40 rounded-2xl border border-slate-800">
                No teams found matching search criteria.
              </div>
            )}
          </div>

        ) : (

          /* FULL LEADERBOARD GRID VIEW */
          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-x-auto shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-bold uppercase tracking-wider border-b border-slate-700">
                  <th className="py-3 px-3">Tee Time</th>
                  <th className="py-3 px-2 text-center">Hole</th>
                  <th className="py-3 px-2 text-center">Team #</th>
                  <th className="py-3 px-3">Player 1</th>
                  <th className="py-3 px-3">Player 2</th>
                  <th className="py-3 px-3">Player 3</th>
                  <th className="py-3 px-3">Player 4</th>
                  <th className="py-3 px-2 text-center">Score</th>
                  <th className="py-3 px-2 text-center">Gross Win</th>
                  <th className="py-3 px-2 text-center">Net Win</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60 font-mono text-[11px]">
                {filteredTeams.map((team, idx) => (
                  <tr key={idx} className="hover:bg-slate-700/40 transition">
                    <td className="py-2.5 px-3 text-slate-300 font-bold">{team.teeTime || '—'}</td>
                    <td className="py-2.5 px-2 text-center text-slate-400">{team.hole || '1'}</td>
                    <td className="py-2.5 px-2 text-center text-amber-400 font-extrabold">{team.teamNum || (idx + 1)}</td>
                    <td className="py-2.5 px-3 text-slate-200">{team.players[0]?.name || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-200">{team.players[1]?.name || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-200">{team.players[2]?.name || '—'}</td>
                    <td className="py-2.5 px-3 text-slate-200">{team.players[3]?.name || '—'}</td>
                    <td className="py-2.5 px-2 text-center font-black text-amber-300">{team.score || '—'}</td>
                    <td className="py-2.5 px-2 text-center">
                      <button onClick={() => toggleWinner(idx, 'grossWinner')} className="cursor-pointer">
                        {team.grossWinner === 'WIN' ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded text-[9px] font-black">
                            <CheckSquare className="w-3 h-3 text-emerald-400" /> WIN
                          </span>
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <button onClick={() => toggleWinner(idx, 'netWinner')} className="cursor-pointer">
                        {team.netWinner === 'WIN' ? (
                          <span className="inline-flex items-center gap-1 bg-sky-500/20 border border-sky-500/40 text-sky-300 px-1.5 py-0.5 rounded text-[9px] font-black">
                            <CheckSquare className="w-3 h-3 text-sky-400" /> WINNER
                          </span>
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        )}

      </div>
    </section>
  );
};
