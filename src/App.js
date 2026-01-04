import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

// Player colors
const PLAYER_COLORS = {
  triggz: '#b91c1c',
  tyrillis: '#3b82f6',
  ivory: '#f0f0f0',
  scumby: '#22c55e',
  adz: '#fbbf24'
};

// Scoring type icons
const SCORING_ICONS = {
  highest: '🎯',
  lowest: '⛳',
  fastest: '⚡',
  closest: '🎲'
};

// Avatar component with colored ring
const Avatar = ({ player, size = 'md', showBorder = true }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };
  
  const color = PLAYER_COLORS[player?.toLowerCase()] || '#666';
  const initials = player ? player.substring(0, 2).toUpperCase() : '??';
  
  return (
    <div 
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white`}
      style={{ 
        backgroundColor: color,
        border: showBorder ? `3px solid ${color}` : 'none',
        boxShadow: showBorder ? `0 0 0 2px #1a1a24` : 'none'
      }}
    >
      {initials}
    </div>
  );
};

// Silhouette placeholder for unsubmitted
const SilhouettePlaceholder = ({ name }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center">
      <span className="text-gray-500 text-lg">?</span>
    </div>
    <span className="text-gray-500 text-xs mt-1 opacity-50">{name}</span>
  </div>
);

// Timer display with gradient color
const TimerDisplay = ({ deadline, compact = false }) => {
  if (!deadline) return null;
  
  const now = new Date();
  const end = new Date(deadline);
  const diff = end - now;
  
  if (diff < 0) return <span className="text-red-500 font-bold">Expired!</span>;
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  // Calculate urgency (0 = urgent, 1 = plenty of time)
  const maxDays = 30;
  const urgency = Math.min(Math.max(days / maxDays, 0), 1);
  
  // Gradient from red (0) through yellow (0.5) to green (1)
  let r, g, b;
  if (urgency < 0.5) {
    r = 239;
    g = Math.round(68 + (urgency * 2) * (163 - 68));
    b = 68;
  } else {
    r = Math.round(234 - ((urgency - 0.5) * 2) * (234 - 34));
    g = Math.round(163 + ((urgency - 0.5) * 2) * (197 - 163));
    b = Math.round(68 - ((urgency - 0.5) * 2) * (68 - 94));
  }
  const gradientColor = `rgb(${r}, ${g}, ${b})`;
  
  if (compact) {
    return (
      <span style={{ color: gradientColor }} className="font-bold">
        {days}d {hours}h
      </span>
    );
  }
  
  return (
    <div className="flex items-center gap-2 text-sm" style={{ color: gradientColor }}>
      <span>⏱</span>
      <span className="font-bold">{days}d {hours}h remaining</span>
    </div>
  );
};

// Rank display helper
const getRankDisplay = (rank, totalPlayers) => {
  const isLast = rank === totalPlayers || rank === 5;
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (isLast) return '💩';
  return rank.toString();
};

export default function ScottWarrensDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [soLuckyMode, setSoLuckyMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Real data from Supabase
  const [players, setPlayers] = useState([]);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [scoreHistory, setScoreHistory] = useState([]);

  // Fetch all data from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Fetch players
      const { data: playersData } = await supabase
        .from('players')
        .select('*');
      
      // Fetch active challenges with submissions
      const { data: activeData } = await supabase
        .from('challenges')
        .select('*, submissions(*)')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      // Fetch completed challenges with results
      const { data: completedData } = await supabase
        .from('challenges')
        .select('*, results(*)')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });
      
      // Fetch score history
      const { data: historyData } = await supabase
        .from('score_history')
        .select('*')
        .order('challenge_number', { ascending: true });
      
      // Calculate standings from completed challenges
      const standings = {};
      const wins = {};
      (playersData || []).forEach(p => {
        standings[p.id] = 0;
        wins[p.id] = [];
      });
      
      (completedData || []).forEach(challenge => {
        // Skip turns challenges if in So Lucky mode
        if (soLuckyMode && challenge.is_turns) return;
        
        (challenge.results || []).forEach(r => {
          if (standings[r.player_id] !== undefined) {
            standings[r.player_id] += r.points;
            if (r.rank === 1) {
              wins[r.player_id].push(challenge.name);
            }
          }
        });
      });
      
      // Sort players by points
      const sortedPlayers = (playersData || [])
        .map(p => ({
          ...p,
          points: standings[p.id] || 0,
          wins: wins[p.id] || []
        }))
        .sort((a, b) => b.points - a.points);
      
      setPlayers(sortedPlayers);
      setActiveChallenges(activeData || []);
      setCompletedChallenges(completedData || []);
      
      // Format score history
      const formattedHistory = [
        { challenge: 0, triggz: 0, tyrillis: 0, ivory: 0, scumby: 0, adz: 0 }
      ];
      (historyData || []).forEach(h => {
        formattedHistory.push({
          challenge: h.challenge_number,
          hostId: h.host_id,
          hostNum: h.host_challenge_number,
          triggz: h.triggz_total,
          tyrillis: h.tyrillis_total,
          ivory: h.ivory_total,
          scumby: h.scumby_total,
          adz: h.adz_total
        });
      });
      setScoreHistory(formattedHistory);
      
      setLoading(false);
    }
    
    fetchData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, fetchData)
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, [soLuckyMode]);

  // Filter challenges based on So Lucky mode
  const filteredActiveChallenges = soLuckyMode 
    ? activeChallenges.filter(c => !c.is_turns)
    : activeChallenges;
  
  const filteredCompletedChallenges = soLuckyMode
    ? completedChallenges.filter(c => !c.is_turns)
    : completedChallenges;

  // Find who doesn't have an active challenge
  const activeHosts = activeChallenges.map(c => c.created_by);
  const waitingPlayers = players.filter(p => !activeHosts.includes(p.id));

  // Challenges with active timers (sorted by deadline)
  const deadlineWarnings = filteredActiveChallenges
    .filter(c => c.timer_start)
    .sort((a, b) => new Date(a.timer_deadline) - new Date(b.timer_deadline));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d14] text-white flex items-center justify-center">
        <div className="text-xl">Loading The Scott Warrens...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d14] text-white" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a1a24] to-[#252530] border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">THE SCOTT WARRENS</h1>
            <p className="text-gray-400 text-sm">2026 Year of Challenges</p>
          </div>
          
          {/* So Lucky Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Full</span>
            <button
              onClick={() => setSoLuckyMode(!soLuckyMode)}
              className={`relative w-14 h-7 rounded-full transition-all ${
                soLuckyMode ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                  soLuckyMode ? 'left-8' : 'left-1'
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${soLuckyMode ? 'text-purple-400' : 'text-gray-400'}`}>
              🍀 So Lucky
            </span>
          </div>
        </div>
        
        {/* So Lucky Info Banner */}
        {soLuckyMode && (
          <div className="max-w-6xl mx-auto mt-3 p-3 bg-purple-900/30 border border-purple-500/50 rounded-lg">
            <p className="text-purple-300 text-sm text-center">
              🍀 <strong>So Lucky Mode Active</strong> — Warhammer Total War 3 (Turns) challenges are hidden from scores and history
            </p>
          </div>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-[#1a1a24] border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex">
          {['dashboard', 'challenges', 'players', 'history', 'about'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-medium capitalize transition-all ${
                activeTab === tab 
                  ? 'bg-[#252530] text-white border-b-2 border-blue-500' 
                  : 'text-gray-400 hover:text-white hover:bg-[#252530]/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Deadline Warnings */}
            {deadlineWarnings.length > 0 && (
              <section className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-bold mb-3">⏰ Deadline Warnings</h2>
                <div className="space-y-2">
                  {deadlineWarnings.slice(0, 3).map(challenge => {
                    const hostColor = PLAYER_COLORS[challenge.created_by];
                    const allPlayers = ['triggz', 'tyrillis', 'ivory', 'scumby', 'adz'];
                    const submittedPlayers = (challenge.submissions || []).map(s => s.player_id);
                    const missing = allPlayers.filter(p => 
                      !submittedPlayers.includes(p) && p !== challenge.created_by
                    );
                    
                    return (
                      <div 
                        key={challenge.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ 
                          backgroundColor: `${hostColor}15`,
                          borderLeft: `4px solid ${hostColor}`
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="px-3 py-1 rounded-full text-sm font-bold"
                            style={{ 
                              backgroundColor: `${hostColor}30`,
                              border: `2px solid ${hostColor}`
                            }}
                          >
                            <TimerDisplay deadline={challenge.timer_deadline} compact />
                          </div>
                          <span className="font-medium">{challenge.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-sm mr-2">Missing:</span>
                          {missing.map(p => (
                            <Avatar key={p} player={p} size="sm" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Leaderboard */}
            <section className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-bold mb-4">🏆 Leaderboard</h2>
              {players.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No players registered yet</p>
              ) : (
                <div className="space-y-2">
                  {players.map((player, index) => {
                    const rank = index + 1;
                    const isLast = rank === players.length && players.length === 5;
                    const leader = players[0];
                    const pointsBehind = leader.points - player.points;
                    
                    return (
                      <div 
                        key={player.id}
                        className={`flex items-center gap-4 p-3 rounded-lg ${
                          isLast ? 'bg-amber-900/30 border-2 border-amber-700' : 'bg-[#252530]'
                        }`}
                      >
                        {/* Rank */}
                        <div className="w-10 text-center text-xl">
                          {getRankDisplay(rank, players.length)}
                        </div>
                        
                        {/* Avatar */}
                        <Avatar player={player.id} size="md" />
                        
                        {/* Name */}
                        <div className="flex-1">
                          <span className={`font-bold ${isLast ? 'text-amber-400' : ''}`}>
                            {isLast ? `💩 ${player.name} 💩` : player.name}
                          </span>
                          {pointsBehind > 0 && (
                            <span className="text-gray-400 text-sm ml-2 italic">
                              {pointsBehind} points off the lead
                            </span>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full"
                            style={{ 
                              width: `${leader.points > 0 ? (player.points / leader.points) * 100 : 0}%`,
                              backgroundColor: isLast ? '#92400e' : player.color
                            }}
                          />
                        </div>
                        
                        {/* Points */}
                        <div className={`font-bold ${isLast ? 'text-amber-400' : ''}`}>
                          {isLast ? `💩 ${player.points} pts 💩` : `${player.points} pts`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent Results */}
            {filteredCompletedChallenges.length > 0 && (
              <section className="bg-[#1a1a24] rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-bold mb-4">🏁 Recent Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredCompletedChallenges.slice(0, 3).map(challenge => {
                    const hostColor = PLAYER_COLORS[challenge.created_by];
                    const results = challenge.results || [];
                    const maxRank = Math.max(...results.map(r => r.rank), 1);
                    
                    return (
                      <div 
                        key={challenge.id}
                        className="rounded-lg overflow-hidden"
                        style={{ 
                          backgroundColor: `${hostColor}15`,
                          border: `2px solid ${hostColor}`
                        }}
                      >
                        <div 
                          className="h-1"
                          style={{ backgroundColor: hostColor }}
                        />
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{SCORING_ICONS[challenge.scoring_type]}</span>
                            <span className="font-bold text-sm">{challenge.name}</span>
                          </div>
                          <div className="text-gray-400 text-xs mb-3">
                            {challenge.completed_at ? new Date(challenge.completed_at).toLocaleDateString() : ''}
                          </div>
                          <div className="space-y-1">
                            {results.sort((a, b) => a.rank - b.rank).map(r => {
                              const isLast = r.rank === maxRank;
                              return (
                                <div 
                                  key={r.player_id}
                                  className={`flex items-center gap-2 text-sm ${
                                    isLast ? 'bg-amber-900/30 rounded px-1' : ''
                                  }`}
                                >
                                  <span className="w-6">{getRankDisplay(r.rank, maxRank)}</span>
                                  <Avatar player={r.player_id} size="sm" />
                                  <span className={isLast ? 'text-amber-400' : ''}>{r.player_id}</span>
                                  <span className="ml-auto text-gray-400">
                                    {isLast ? `💩 ${r.score} 💩` : r.score}
                                  </span>
                                  <span className="text-yellow-400">+{r.points}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* No Activity Message */}
            {filteredActiveChallenges.length === 0 && filteredCompletedChallenges.length === 0 && (
              <section className="bg-[#1a1a24] rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No challenges yet!</p>
                <p className="text-gray-500 mt-2">Use /challenge in Discord to create the first one.</p>
              </section>
            )}
          </div>
        )}

        {/* Challenges Tab */}
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {filteredActiveChallenges.length === 0 ? (
              <section className="bg-[#1a1a24] rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No active challenges</p>
                <p className="text-gray-500 mt-2">Use /challenge in Discord to create one.</p>
              </section>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActiveChallenges.map(challenge => {
                  const hostColor = PLAYER_COLORS[challenge.created_by];
                  const allPlayers = ['triggz', 'tyrillis', 'ivory', 'scumby', 'adz'];
                  const submittedPlayers = (challenge.submissions || []).map(s => s.player_id);
                  
                  return (
                    <div 
                      key={challenge.id}
                      className="rounded-xl overflow-hidden relative"
                      style={{ 
                        border: `2px solid ${hostColor}`,
                        boxShadow: `0 0 20px ${hostColor}30`
                      }}
                    >
                      {/* Host Bar */}
                      <div 
                        className="h-2"
                        style={{ backgroundColor: hostColor }}
                      />
                      
                      <div className="relative p-4" style={{ backgroundColor: `${hostColor}10` }}>
                        {/* Host Avatar - Top Right */}
                        <div className="absolute top-4 right-4">
                          <Avatar player={challenge.created_by} size="lg" />
                        </div>
                        
                        {/* Turns Badge */}
                        {challenge.is_turns && (
                          <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                            ⚔️ TURNS
                          </div>
                        )}
                        
                        {/* Title */}
                        <div className="flex items-center gap-2 mb-2 pr-20">
                          <span className="text-2xl">{SCORING_ICONS[challenge.scoring_type]}</span>
                          <h3 className="font-bold text-lg">{challenge.name}</h3>
                        </div>
                        
                        {/* Description */}
                        <p className="text-gray-300 text-sm mb-3">{challenge.description}</p>
                        
                        {/* Rules */}
                        <div className="bg-[#1a1a24]/50 rounded-lg p-3 mb-4">
                          <div className="text-xs text-gray-400 mb-1">📋 RULES</div>
                          <div className="text-sm whitespace-pre-line">{challenge.rules}</div>
                        </div>
                        
                        {/* Submission Icons */}
                        <div className="flex justify-center gap-4 mb-4">
                          {allPlayers.filter(p => p !== challenge.created_by).map(player => {
                            const hasSubmitted = submittedPlayers.includes(player);
                            return hasSubmitted ? (
                              <div key={player} className="flex flex-col items-center">
                                <div className="relative">
                                  <Avatar player={player} size="md" />
                                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">
                                    ✓
                                  </div>
                                </div>
                                <span className="text-xs mt-1">{player}</span>
                              </div>
                            ) : (
                              <SilhouettePlaceholder key={player} name={player} />
                            );
                          })}
                        </div>
                        
                        {/* Timer */}
                        {challenge.timer_start && (
                          <div className="text-center">
                            <TimerDisplay deadline={challenge.timer_deadline} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Waiting for New Challenge Section */}
            {waitingPlayers.length > 0 && (
              <section className="bg-[#1a1a24] rounded-xl p-6 border border-dashed border-gray-600">
                <h2 className="text-lg font-bold mb-4 text-center text-gray-400">
                  ⏳ Waiting for new challenge from:
                </h2>
                <div className="flex justify-center gap-8">
                  {waitingPlayers.map(player => (
                    <div key={player.id} className="flex flex-col items-center">
                      <div className="relative mb-2">
                        <Avatar player={player.id} size="xl" />
                        <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-lg">
                          ?
                        </div>
                      </div>
                      <span className="text-gray-400">{player.name}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Players Tab */}
        {activeTab === 'players' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.length === 0 ? (
              <div className="col-span-2 bg-[#1a1a24] rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No players registered yet</p>
              </div>
            ) : (
              players.map((player, index) => {
                const rank = index + 1;
                return (
                  <div 
                    key={player.id}
                    className="rounded-xl p-4"
                    style={{ 
                      backgroundColor: `${player.color}15`,
                      border: `2px solid ${player.color}`
                    }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar player={player.id} size="xl" />
                      <div>
                        <h3 className="font-bold text-xl">{player.name}</h3>
                        <div className="text-2xl">{getRankDisplay(rank, players.length)}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-[#1a1a24] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{player.points}</div>
                        <div className="text-gray-400 text-sm">Points</div>
                      </div>
                      <div className="bg-[#1a1a24] rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{player.wins?.length || 0}</div>
                        <div className="text-gray-400 text-sm">Wins</div>
                      </div>
                    </div>
                    
                    {/* Titles Won */}
                    {player.wins?.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-400 mb-2">🏆 Titles Won</div>
                        <div className="flex flex-wrap gap-2">
                          {player.wins.map((title, i) => (
                            <span 
                              key={i}
                              className="bg-yellow-600/30 text-yellow-400 px-2 py-1 rounded text-xs"
                            >
                              🏆 {title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredCompletedChallenges.length === 0 ? (
              <section className="bg-[#1a1a24] rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No completed challenges yet</p>
              </section>
            ) : (
              filteredCompletedChallenges.map(challenge => {
                const hostColor = PLAYER_COLORS[challenge.created_by];
                const results = challenge.results || [];
                const winner = results.find(r => r.rank === 1);
                const others = results.filter(r => r.rank > 1).sort((a, b) => a.rank - b.rank);
                const maxRank = Math.max(...results.map(r => r.rank), 1);
                
                return (
                  <div 
                    key={challenge.id}
                    className="rounded-lg p-4"
                    style={{ 
                      backgroundColor: `${hostColor}15`,
                      border: `2px solid ${hostColor}`
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{SCORING_ICONS[challenge.scoring_type]}</span>
                        <span className="font-bold">{challenge.name}</span>
                        <span className="text-gray-400 text-sm">
                          • {challenge.completed_at ? new Date(challenge.completed_at).toLocaleDateString() : ''}
                        </span>
                        {challenge.is_turns && (
                          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                            TURNS
                          </span>
                        )}
                      </div>
                      {winner && (
                        <div className="flex items-center gap-2 bg-yellow-600/30 px-3 py-1 rounded-full">
                          <span>🥇</span>
                          <Avatar player={winner.player_id} size="sm" />
                          <span className="font-bold text-yellow-400">{winner.player_id}</span>
                          <span className="text-yellow-400">+{winner.points}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Bottom row - other placements */}
                    <div className="flex gap-4 flex-wrap">
                      {others.map(r => {
                        const isLast = r.rank === maxRank;
                        return (
                          <div 
                            key={r.player_id}
                            className={`flex items-center gap-2 text-sm ${
                              isLast ? 'bg-amber-900/30 px-2 py-1 rounded' : ''
                            }`}
                          >
                            <span>{getRankDisplay(r.rank, maxRank)}</span>
                            <span className={isLast ? 'text-amber-400' : ''}>{r.player_id}</span>
                            <span className="text-gray-400">
                              {isLast ? `💩 ${r.score} 💩` : r.score}
                            </span>
                            <span className="text-yellow-400">+{r.points}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <section className="bg-[#1a1a24] rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">📖 What is The Scott Warrens?</h2>
              <p className="text-gray-300">
                A year-long gaming competition between 5 friends. Each player hosts challenges, 
                everyone competes, and points are awarded based on performance. At the end of 2026, 
                the winner is crowned and the loser faces... consequences.
              </p>
            </section>

            <section className="bg-[#1a1a24] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">👥 The Competitors</h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {players.map(p => (
                  <div key={p.id} className="text-center">
                    <Avatar player={p.id} size="xl" />
                    <div className="mt-2 font-medium">{p.name}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[#1a1a24] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">⚙️ How It Works</h2>
              <div className="space-y-3 text-gray-300">
                <p>1. Each player hosts 1 challenge at a time (5 active challenges max)</p>
                <p>2. Everyone submits their scores blind (hidden until complete)</p>
                <p>3. Points awarded: 1st = 5pts, 2nd = 4pts, 3rd = 3pts, 4th = 2pts, 5th = 1pt</p>
                <p>4. When all 5 submit OR timer expires, challenge completes</p>
                <p>5. Host can then create their next challenge</p>
              </div>
            </section>

            <section className="bg-[#1a1a24] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">🎯 Scoring Types</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#252530] p-4 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-bold mt-2">Highest Score Wins</h3>
                  <p className="text-gray-400 text-sm">Best score takes 1st place</p>
                </div>
                <div className="bg-[#252530] p-4 rounded-lg">
                  <span className="text-2xl">⛳</span>
                  <h3 className="font-bold mt-2">Lowest Score Wins</h3>
                  <p className="text-gray-400 text-sm">Fewest points/strokes wins</p>
                </div>
                <div className="bg-[#252530] p-4 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold mt-2">Fastest Time Wins</h3>
                  <p className="text-gray-400 text-sm">Quickest completion wins</p>
                </div>
                <div className="bg-[#252530] p-4 rounded-lg">
                  <span className="text-2xl">🎲</span>
                  <h3 className="font-bold mt-2">Closest to Target</h3>
                  <p className="text-gray-400 text-sm">Nearest guess wins</p>
                </div>
              </div>
            </section>

            <section className="bg-[#1a1a24] rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">⏱️ Timer Rules</h2>
              <div className="space-y-2 text-gray-300">
                <p>• 2 submissions → 30 day timer starts</p>
                <p>• 3 submissions → timer drops to 21 days (if longer)</p>
                <p>• 4 submissions → timer drops to 14 days (if longer)</p>
                <p>• Timer expires → challenge completes with available scores</p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-amber-900/50 to-red-900/50 rounded-xl p-6 border border-red-700">
              <h2 className="text-xl font-bold mb-4">💩 The Loser's Punishment</h2>
              <p className="text-lg mb-4">
                The player in LAST PLACE at the end of 2026 must endure:
              </p>
              <div className="bg-[#1a1a24] rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-400 mb-2">
                  100ml - 500ml of LIQUID FART SPRAY
                </p>
                <p className="text-gray-300">
                  Quantity decided by THE WINNER 🏆
                </p>
              </div>
              <p className="text-center mt-4 italic text-gray-400">
                "May the odds be ever in your favour. And the smell be ever not on you."
              </p>
            </section>

            <section className="bg-purple-900/30 rounded-xl p-6 border border-purple-700">
              <h2 className="text-xl font-bold mb-4">🍀 So Lucky Mode</h2>
              <p className="text-gray-300">
                One of our friends doesn't play Warhammer Total War 3 ("Turns" challenges). 
                Toggle "So Lucky" mode at the top of the page to view an alternate leaderboard 
                that excludes all Turns challenges - so they can still feel included!
              </p>
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#1a1a24] border-t border-gray-700 p-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          The Scott Warrens · 2026 Year of Challenges
        </div>
      </footer>
    </div>
  );
}
