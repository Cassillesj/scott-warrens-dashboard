import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

var PLAYER_COLORS = {
  triggz: '#b91c1c',
  tyrillis: '#3b82f6',
  ivory: '#f0f0f0',
  scumby: '#22c55e',
  adz: '#fbbf24'
};

var SCORING_ICONS = {
  highest: '🎯',
  lowest: '⛳',
  fastest: '⚡'
};

var SCORING_LABELS = {
  highest: 'Highest Score Wins',
  lowest: 'Lowest Score Wins',
  fastest: 'Fastest Time Wins'
};

function Avatar(props) {
  var player = props.player;
  var size = props.size || 'md';
  var showBorder = props.showBorder !== false;
  
  var sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  var playerId = player ? player.toLowerCase() : '';
  var color = PLAYER_COLORS[playerId] || '#666';
  var avatarUrl = '/avatars/' + playerId + '.png';
  
  return (
    <div 
      className={sizeClasses[size] + ' rounded-full overflow-hidden flex-shrink-0'}
      style={{ 
        border: showBorder ? '2px solid ' + color : 'none',
        boxShadow: showBorder ? '0 0 0 1px #1a1a24' : 'none'
      }}
    >
      <img 
        src={avatarUrl} 
        alt={player || ''}
        className="w-full h-full object-cover"
      />
    </div>
  );
}

function SilhouettePlaceholder(props) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center flex-shrink-0">
        <span className="text-gray-500 text-lg">?</span>
      </div>
      <span className="text-gray-500 text-xs mt-1 opacity-50">{props.name}</span>
    </div>
  );
}

function TimerDisplay(props) {
  var deadline = props.deadline;
  var compact = props.compact;
  
  if (!deadline) return null;
  
  var now = new Date();
  var end = new Date(deadline);
  var diff = end - now;
  
  if (diff < 0) return React.createElement('span', { className: 'text-red-500 font-bold' }, 'Expired!');
  
  var days = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  var maxDays = 30;
  var urgency = Math.min(Math.max(days / maxDays, 0), 1);
  
  var r, g, b;
  if (urgency < 0.5) {
    r = 239;
    g = Math.round(68 + (urgency * 2) * (163 - 68));
    b = 68;
  } else {
    r = Math.round(234 - ((urgency - 0.5) * 2) * (234 - 34));
    g = Math.round(163 + ((urgency - 0.5) * 2) * (197 - 163));
    b = Math.round(68 - ((urgency - 0.5) * 2) * (68 - 94));
  }
  var gradientColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
  
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
}

function getRankDisplay(rank, totalPlayers) {
  var isLast = rank === totalPlayers || rank === 5;
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  if (isLast) return '💩';
  return rank.toString();
}

function formatRulesAsBullets(rules) {
  if (!rules) return [];
  var lines = rules.split('\n').filter(function(line) { return line.trim() !== ''; });
  return lines;
}

function CreateChallengeModal(props) {
  var players = props.players;
  var onClose = props.onClose;
  var onCreated = props.onCreated;
  
  var [title, setTitle] = useState('');
  var [description, setDescription] = useState('');
  var [rules, setRules] = useState('');
  var [scoringType, setScoringType] = useState('highest');
  var [hostId, setHostId] = useState('');
  var [isTurns, setIsTurns] = useState(false);
  var [gameName, setGameName] = useState('');
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState('');
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !description || !rules || !hostId) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    var result = await supabase
      .from('challenges')
      .insert({
        name: title,
        description: description,
        rules: rules,
        created_by: hostId,
        scoring_type: scoringType,
        is_turns: isTurns,
        game_name: gameName || null,
        status: 'active'
      })
      .select()
      .single();
    
    if (result.error) {
      setError('Failed to create challenge: ' + result.error.message);
      setLoading(false);
      return;
    }
    
    setLoading(false);
    onCreated();
    onClose();
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Create New Challenge</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Host *</label>
            <select 
              value={hostId} 
              onChange={function(e) { setHostId(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            >
              <option value="">Select host...</option>
              {players.map(function(p) {
                return <option key={p.id} value={p.id}>{p.name}</option>;
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Challenge Title *</label>
            <input 
              type="text"
              value={title}
              onChange={function(e) { setTitle(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              placeholder="e.g. Pokemon Speedrun"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Description *</label>
            <textarea 
              value={description}
              onChange={function(e) { setDescription(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-20"
              placeholder="What is this challenge about?"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Rules * (one per line)</label>
            <textarea 
              value={rules}
              onChange={function(e) { setRules(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white h-24"
              placeholder="No speed modifiers&#10;Choose Charmander as starter&#10;No save states"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Scoring Type *</label>
            <select 
              value={scoringType} 
              onChange={function(e) { setScoringType(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            >
              <option value="highest">🎯 Highest Score Wins</option>
              <option value="lowest">⛳ Lowest Score Wins</option>
              <option value="fastest">⚡ Fastest Time Wins</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Game Name (optional)</label>
            <input 
              type="text"
              value={gameName}
              onChange={function(e) { setGameName(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              placeholder="e.g. Pokemon Red/Blue"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="isTurns"
              checked={isTurns}
              onChange={function(e) { setIsTurns(e.target.checked); }}
              className="w-4 h-4"
            />
            <label htmlFor="isTurns" className="text-sm text-gray-300">⚔️ This is a TURNS/Warhammer challenge</label>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded"
          >
            {loading ? 'Creating...' : 'Create Challenge'}
          </button>
        </form>
      </div>
    </div>
  );
}

function SubmitScoreModal(props) {
  var challenges = props.challenges;
  var players = props.players;
  var onClose = props.onClose;
  var onSubmitted = props.onSubmitted;
  
  var [challengeId, setChallengeId] = useState('');
  var [playerId, setPlayerId] = useState('');
  var [score, setScore] = useState('');
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState('');
  
  var selectedChallenge = challenges.find(function(c) { return c.id === challengeId; });
  var availablePlayers = players.filter(function(p) {
    if (!selectedChallenge) return true;
    var submitted = (selectedChallenge.submissions || []).map(function(s) { return s.player_id; });
    return !submitted.includes(p.id);
  });
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!challengeId || !playerId || !score) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError('');
    
    var result = await supabase
      .from('submissions')
      .insert({
        challenge_id: challengeId,
        player_id: playerId,
        score: parseFloat(score)
      });
    
    if (result.error) {
      setError('Failed to submit: ' + result.error.message);
      setLoading(false);
      return;
    }
    
    // Check submission count and update timer
    var subsResult = await supabase
      .from('submissions')
      .select('*')
      .eq('challenge_id', challengeId);
    
    var count = subsResult.data ? subsResult.data.length : 0;
    
    if (count >= 2) {
      var days = 30;
      if (count >= 4) days = 14;
      else if (count >= 3) days = 21;
      
      var deadline = new Date();
      deadline.setDate(deadline.getDate() + days);
      
      var challenge = challenges.find(function(c) { return c.id === challengeId; });
      if (!challenge.timer_start) {
        await supabase
          .from('challenges')
          .update({
            timer_start: new Date().toISOString(),
            timer_deadline: deadline.toISOString()
          })
          .eq('id', challengeId);
      }
    }
    
    // Check if all 5 submitted
    if (count === 5) {
      // Complete the challenge
      var allSubs = subsResult.data;
      var challengeData = challenges.find(function(c) { return c.id === challengeId; });
      
      // Sort by score
      var sorted = allSubs.slice().sort(function(a, b) {
        if (challengeData.scoring_type === 'highest') return b.score - a.score;
        return a.score - b.score;
      });
      
      // Create results
      for (var i = 0; i < sorted.length; i++) {
        await supabase.from('results').insert({
          challenge_id: challengeId,
          player_id: sorted[i].player_id,
          rank: i + 1,
          score: sorted[i].score,
          points: 5 - i
        });
      }
      
      await supabase
        .from('challenges')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', challengeId);
    }
    
    setLoading(false);
    onSubmitted();
    onClose();
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Submit Score</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        {error && <div className="bg-red-900 text-red-200 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Challenge *</label>
            <select 
              value={challengeId} 
              onChange={function(e) { setChallengeId(e.target.value); setPlayerId(''); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
            >
              <option value="">Select challenge...</option>
              {challenges.map(function(c) {
                return <option key={c.id} value={c.id}>{SCORING_ICONS[c.scoring_type]} {c.name}</option>;
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Player *</label>
            <select 
              value={playerId} 
              onChange={function(e) { setPlayerId(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              disabled={!challengeId}
            >
              <option value="">Select player...</option>
              {availablePlayers.map(function(p) {
                return <option key={p.id} value={p.id}>{p.name}</option>;
              })}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Score *</label>
            <input 
              type="number"
              step="any"
              value={score}
              onChange={function(e) { setScore(e.target.value); }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              placeholder="Enter your score"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 rounded"
          >
            {loading ? 'Submitting...' : 'Submit Score'}
          </button>
        </form>
      </div>
    </div>
  );
}

function ScottWarrensDashboard() {
  var [activeTab, setActiveTab] = useState('dashboard');
  var [soLuckyMode, setSoLuckyMode] = useState(false);
  var [loading, setLoading] = useState(true);
  var [players, setPlayers] = useState([]);
  var [activeChallenges, setActiveChallenges] = useState([]);
  var [completedChallenges, setCompletedChallenges] = useState([]);
  var [showCreateModal, setShowCreateModal] = useState(false);
  var [showSubmitModal, setShowSubmitModal] = useState(false);

  function fetchData() {
    setLoading(true);
    
    Promise.all([
      supabase.from('players').select('*'),
      supabase.from('challenges').select('*, submissions(*)').eq('status', 'active').order('created_at', { ascending: false }),
      supabase.from('challenges').select('*, results(*)').eq('status', 'completed').order('completed_at', { ascending: false })
    ]).then(function(results) {
      var playersData = results[0].data;
      var activeData = results[1].data;
      var completedData = results[2].data;
      
      var standings = {};
      var wins = {};
      (playersData || []).forEach(function(p) {
        standings[p.id] = 0;
        wins[p.id] = [];
      });
      
      (completedData || []).forEach(function(challenge) {
        if (soLuckyMode && challenge.is_turns) return;
        (challenge.results || []).forEach(function(r) {
          if (standings[r.player_id] !== undefined) {
            standings[r.player_id] += r.points;
            if (r.rank === 1) {
              wins[r.player_id].push(challenge.name);
            }
          }
        });
      });
      
      var sortedPlayers = (playersData || [])
        .map(function(p) {
          return {
            id: p.id,
            name: p.name,
            color: p.color,
            points: standings[p.id] || 0,
            wins: wins[p.id] || []
          };
        })
        .sort(function(a, b) { return b.points - a.points; });
      
      setPlayers(sortedPlayers);
      setActiveChallenges(activeData || []);
      setCompletedChallenges(completedData || []);
      setLoading(false);
    });
  }

  useEffect(function() {
    fetchData();
    
    var subscription = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, fetchData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'results' }, fetchData)
      .subscribe();
    
    return function() { subscription.unsubscribe(); };
  }, [soLuckyMode]);

  var filteredActiveChallenges = soLuckyMode 
    ? activeChallenges.filter(function(c) { return !c.is_turns; })
    : activeChallenges;
  
  var filteredCompletedChallenges = soLuckyMode
    ? completedChallenges.filter(function(c) { return !c.is_turns; })
    : completedChallenges;

  var activeHosts = activeChallenges.map(function(c) { return c.created_by; });
  var waitingPlayers = players.filter(function(p) { return !activeHosts.includes(p.id); });

  var deadlineWarnings = filteredActiveChallenges
    .filter(function(c) { return c.timer_start; })
    .sort(function(a, b) { return new Date(a.timer_deadline) - new Date(b.timer_deadline); });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading The Scott Warrens...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showCreateModal && <CreateChallengeModal players={players} onClose={function() { setShowCreateModal(false); }} onCreated={fetchData} />}
      {showSubmitModal && <SubmitScoreModal challenges={activeChallenges} players={players} onClose={function() { setShowSubmitModal(false); }} onSubmitted={fetchData} />}
      
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-wider">THE SCOTT WARRENS</h1>
            <p className="text-gray-400 text-sm">2026 Year of Challenges</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={function() { setShowCreateModal(true); }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
            >
              + New Challenge
            </button>
            <button
              onClick={function() { setShowSubmitModal(true); }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium"
            >
              Submit Score
            </button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Full</span>
              <button
                onClick={function() { setSoLuckyMode(!soLuckyMode); }}
                className={soLuckyMode ? 'relative w-14 h-7 rounded-full transition-all bg-purple-600' : 'relative w-14 h-7 rounded-full transition-all bg-gray-600'}
              >
                <div className={soLuckyMode ? 'absolute top-1 w-5 h-5 rounded-full bg-white transition-all left-8' : 'absolute top-1 w-5 h-5 rounded-full bg-white transition-all left-1'} />
              </button>
              <span className={soLuckyMode ? 'text-sm font-bold text-purple-400' : 'text-sm font-bold text-gray-400'}>
                🍀 So Lucky
              </span>
            </div>
          </div>
        </div>
        
        {soLuckyMode && (
          <div className="max-w-6xl mx-auto mt-3 p-3 bg-purple-900 border border-purple-500 rounded-lg">
            <p className="text-purple-300 text-sm text-center">
              🍀 <strong>So Lucky Mode Active</strong> — Warhammer Total War 3 (Turns) challenges are hidden
            </p>
          </div>
        )}
      </header>

      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex">
          {['dashboard', 'challenges', 'players', 'history', 'about'].map(function(tab) {
            return (
              <button
                key={tab}
                onClick={function() { setActiveTab(tab); }}
                className={activeTab === tab ? 'px-6 py-3 font-medium capitalize bg-gray-700 text-white border-b-2 border-blue-500' : 'px-6 py-3 font-medium capitalize text-gray-400 hover:text-white'}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {deadlineWarnings.length > 0 && (
              <section className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-bold mb-3">⏰ Deadline Warnings</h2>
                <div className="space-y-2">
                  {deadlineWarnings.slice(0, 3).map(function(challenge) {
                    var hostColor = PLAYER_COLORS[challenge.created_by];
                    var allPlayers = ['triggz', 'tyrillis', 'ivory', 'scumby', 'adz'];
                    var submittedPlayers = (challenge.submissions || []).map(function(s) { return s.player_id; });
                    var missing = allPlayers.filter(function(p) { return !submittedPlayers.includes(p); });
                    return (
                      <div 
                        key={challenge.id}
                        className="flex items-center justify-between p-3 rounded-lg"
                        style={{ backgroundColor: hostColor + '20', borderLeft: '4px solid ' + hostColor }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="px-3 py-1 rounded-full text-sm font-bold" style={{ backgroundColor: hostColor + '40', border: '2px solid ' + hostColor }}>
                            <TimerDisplay deadline={challenge.timer_deadline} compact={true} />
                          </div>
                          <span className="font-medium">{challenge.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400 text-sm mr-2">Missing:</span>
                          {missing.map(function(p) { return <Avatar key={p} player={p} size="sm" />; })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            <section className="bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h2 className="text-lg font-bold mb-4">🏆 Leaderboard</h2>
              {players.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No players registered yet</p>
              ) : (
                <div className="space-y-2">
                  {players.map(function(player, index) {
                    var rank = index + 1;
                    var isLast = rank === players.length && players.length === 5;
                    var leader = players[0];
                    var pointsBehind = leader.points - player.points;
                    return (
                      <div key={player.id} className={isLast ? 'flex items-center gap-4 p-3 rounded-lg bg-amber-900 border-2 border-amber-700' : 'flex items-center gap-4 p-3 rounded-lg bg-gray-700'}>
                        <div className="w-10 text-center text-xl">{getRankDisplay(rank, players.length)}</div>
                        <Avatar player={player.id} size="md" />
                        <div className="flex-1">
                          <span className={isLast ? 'font-bold text-amber-400' : 'font-bold'}>{isLast ? '💩 ' + player.name + ' 💩' : player.name}</span>
                          {pointsBehind > 0 && <span className="text-gray-400 text-sm ml-2 italic">{pointsBehind} points off the lead</span>}
                        </div>
                        <div className="w-32 h-3 bg-gray-600 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: (leader.points > 0 ? (player.points / leader.points) * 100 : 0) + '%', backgroundColor: isLast ? '#92400e' : player.color }} />
                        </div>
                        <div className={isLast ? 'font-bold text-amber-400' : 'font-bold'}>{isLast ? '💩 ' + player.points + ' pts 💩' : player.points + ' pts'}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {filteredCompletedChallenges.length > 0 && (
              <section className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <h2 className="text-lg font-bold mb-4">🏁 Recent Results</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {filteredCompletedChallenges.slice(0, 3).map(function(challenge) {
                    var hostColor = PLAYER_COLORS[challenge.created_by];
                    var results = challenge.results || [];
                    var ranks = results.map(function(r) { return r.rank; });
                    var maxRank = ranks.length > 0 ? Math.max.apply(null, ranks) : 1;
                    return (
                      <div key={challenge.id} className="rounded-lg overflow-hidden" style={{ backgroundColor: hostColor + '20', border: '2px solid ' + hostColor }}>
                        <div className="h-1" style={{ backgroundColor: hostColor }} />
                        <div className="p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{SCORING_ICONS[challenge.scoring_type]}</span>
                            <span className="font-bold text-sm">{challenge.name}</span>
                          </div>
                          <div className="text-gray-400 text-xs mb-3">{challenge.completed_at ? new Date(challenge.completed_at).toLocaleDateString() : ''}</div>
                          <div className="space-y-1">
                            {results.sort(function(a, b) { return a.rank - b.rank; }).map(function(r) {
                              var isLast = r.rank === maxRank;
                              return (
                                <div key={r.player_id} className={isLast ? 'flex items-center gap-2 text-sm bg-amber-900 rounded px-1' : 'flex items-center gap-2 text-sm'}>
                                  <span className="w-6">{getRankDisplay(r.rank, maxRank)}</span>
                                  <Avatar player={r.player_id} size="sm" />
                                  <span className={isLast ? 'text-amber-400' : ''}>{r.player_id}</span>
                                  <span className="ml-auto text-gray-400">{isLast ? '💩 ' + r.score + ' 💩' : r.score}</span>
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

            {filteredActiveChallenges.length === 0 && filteredCompletedChallenges.length === 0 && (
              <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No challenges yet!</p>
                <p className="text-gray-500 mt-2">Click "+ New Challenge" to create the first one.</p>
              </section>
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {filteredActiveChallenges.length === 0 ? (
              <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">No active challenges</p>
                <p className="text-gray-500 mt-2">Click "+ New Challenge" to create one.</p>
              </section>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredActiveChallenges.map(function(challenge) {
                  var hostColor = PLAYER_COLORS[challenge.created_by];
                  var allPlayers = ['triggz', 'tyrillis', 'ivory', 'scumby', 'adz'];
                  var submittedPlayers = (challenge.submissions || []).map(function(s) { return s.player_id; });
                  var rulesList = formatRulesAsBullets(challenge.rules);
                  
                  return (
                    <div key={challenge.id} className="rounded-xl overflow-hidden relative" style={{ border: '2px solid ' + hostColor, boxShadow: '0 0 20px ' + hostColor + '40' }}>
                      <div className="h-2" style={{ backgroundColor: hostColor }} />
                      <div className="p-4" style={{ backgroundColor: hostColor + '15' }}>
                        {challenge.is_turns && <div className="inline-block bg-purple-600 text-white text-xs px-2 py-1 rounded-full mb-2">⚔️ TURNS</div>}
                        
                        <div className="flex items-start gap-4 mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl">{SCORING_ICONS[challenge.scoring_type]}</span>
                              <h3 className="font-bold text-lg">{challenge.name}</h3>
                            </div>
                            <p className="text-gray-300 text-sm">{challenge.description}</p>
                          </div>
                          <div className="flex flex-col items-center">
                            <Avatar player={challenge.created_by} size="lg" />
                            <span className="text-xs text-gray-400 mt-1">Host</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900 rounded-lg p-3 mb-4">
                          <div className="text-xs text-gray-400 mb-2">📋 RULES</div>
                          <ul className="space-y-1">
                            {rulesList.map(function(rule, idx) {
                              return (
                                <li key={idx} className="text-sm flex items-start gap-2">
                                  <span className="text-gray-500">•</span>
                                  <span>{rule}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        
                        <div className="flex justify-center gap-3 mb-4">
                          {allPlayers.map(function(player) {
                            var hasSubmitted = submittedPlayers.includes(player);
                            if (hasSubmitted) {
                              return (
                                <div key={player} className="flex flex-col items-center">
                                  <div className="relative">
                                    <Avatar player={player} size="md" />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 flex items-center justify-center text-xs">✓</div>
                                  </div>
                                  <span className="text-xs mt-1">{player}</span>
                                </div>
                              );
                            } else {
                              return <SilhouettePlaceholder key={player} name={player} />;
                            }
                          })}
                        </div>
                        
                        {challenge.timer_start && <div className="text-center"><TimerDisplay deadline={challenge.timer_deadline} /></div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {waitingPlayers.length > 0 && (
              <section className="bg-gray-800 rounded-xl p-6 border border-dashed border-gray-600">
                <h2 className="text-lg font-bold mb-4 text-center text-gray-400">⏳ Waiting for new challenge from:</h2>
                <div className="flex justify-center gap-8">
                  {waitingPlayers.map(function(player) {
                    return (
                      <div key={player.id} className="flex flex-col items-center">
                        <div className="relative mb-2">
                          <Avatar player={player.id} size="xl" />
                          <div className="absolute -bottom-1 -right-1 bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-lg">?</div>
                        </div>
                        <span className="text-gray-400">{player.name}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}

        {activeTab === 'players' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.length === 0 ? (
              <div className="col-span-2 bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No players registered yet</p>
              </div>
            ) : (
              players.map(function(player, index) {
                var rank = index + 1;
                return (
                  <div key={player.id} className="rounded-xl p-4" style={{ backgroundColor: player.color + '20', border: '2px solid ' + player.color }}>
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar player={player.id} size="xl" />
                      <div>
                        <h3 className="font-bold text-xl">{player.name}</h3>
                        <div className="text-2xl">{getRankDisplay(rank, players.length)}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{player.points}</div>
                        <div className="text-gray-400 text-sm">Points</div>
                      </div>
                      <div className="bg-gray-900 rounded-lg p-3 text-center">
                        <div className="text-2xl font-bold">{player.wins ? player.wins.length : 0}</div>
                        <div className="text-gray-400 text-sm">Wins</div>
                      </div>
                    </div>
                    {player.wins && player.wins.length > 0 && (
                      <div>
                        <div className="text-sm text-gray-400 mb-2">🏆 Titles Won</div>
                        <div className="flex flex-wrap gap-2">
                          {player.wins.map(function(title, i) {
                            return <span key={i} className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">🏆 {title}</span>;
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-3">
            {filteredCompletedChallenges.length === 0 ? (
              <section className="bg-gray-800 rounded-xl p-8 border border-gray-700 text-center">
                <p className="text-gray-400">No completed challenges yet</p>
              </section>
            ) : (
              filteredCompletedChallenges.map(function(challenge) {
                var hostColor = PLAYER_COLORS[challenge.created_by];
                var results = challenge.results || [];
                var winner = results.find(function(r) { return r.rank === 1; });
                var others = results.filter(function(r) { return r.rank > 1; }).sort(function(a, b) { return a.rank - b.rank; });
                var ranks = results.map(function(r) { return r.rank; });
                var maxRank = ranks.length > 0 ? Math.max.apply(null, ranks) : 1;
                return (
                  <div key={challenge.id} className="rounded-lg p-4" style={{ backgroundColor: hostColor + '20', border: '2px solid ' + hostColor }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{SCORING_ICONS[challenge.scoring_type]}</span>
                        <span className="font-bold">{challenge.name}</span>
                        <span className="text-gray-400 text-sm">• {challenge.completed_at ? new Date(challenge.completed_at).toLocaleDateString() : ''}</span>
                        {challenge.is_turns && <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">TURNS</span>}
                      </div>
                      {winner && (
                        <div className="flex items-center gap-2 bg-yellow-600 px-3 py-1 rounded-full">
                          <span>🥇</span>
                          <Avatar player={winner.player_id} size="sm" />
                          <span className="font-bold text-yellow-100">{winner.player_id}</span>
                          <span className="text-yellow-100">+{winner.points}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      {others.map(function(r) {
                        var isLast = r.rank === maxRank;
                        return (
                          <div key={r.player_id} className={isLast ? 'flex items-center gap-2 text-sm bg-amber-900 px-2 py-1 rounded' : 'flex items-center gap-2 text-sm'}>
                            <span>{getRankDisplay(r.rank, maxRank)}</span>
                            <span className={isLast ? 'text-amber-400' : ''}>{r.player_id}</span>
                            <span className="text-gray-400">{isLast ? '💩 ' + r.score + ' 💩' : r.score}</span>
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

        {activeTab === 'about' && (
          <div className="space-y-6">
            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-2xl font-bold mb-4">📖 What is The Scott Warrens?</h2>
              <p className="text-gray-300">A year-long gaming competition between 5 friends. Each player hosts challenges, everyone competes, and points are awarded based on performance. At the end of 2026, the winner is crowned and the loser faces... consequences.</p>
            </section>

            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">👥 The Competitors</h2>
              <div className="flex justify-center gap-8 flex-wrap">
                {players.map(function(p) {
                  return (
                    <div key={p.id} className="text-center">
                      <Avatar player={p.id} size="xl" />
                      <div className="mt-2 font-medium">{p.name}</div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">⚙️ How It Works</h2>
              <div className="space-y-3 text-gray-300">
                <p>1. Each player hosts 1 challenge at a time (5 active challenges max)</p>
                <p>2. Everyone submits their scores (including the host)</p>
                <p>3. Points awarded: 1st = 5pts, 2nd = 4pts, 3rd = 3pts, 4th = 2pts, 5th = 1pt</p>
                <p>4. When all 5 submit OR timer expires, challenge completes</p>
                <p>5. Host can then create their next challenge</p>
              </div>
            </section>

            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">🎯 Scoring Types</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-2xl">🎯</span>
                  <h3 className="font-bold mt-2">Highest Score Wins</h3>
                  <p className="text-gray-400 text-sm">Best score takes 1st place</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-2xl">⛳</span>
                  <h3 className="font-bold mt-2">Lowest Score Wins</h3>
                  <p className="text-gray-400 text-sm">Fewest points/strokes wins</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <h3 className="font-bold mt-2">Fastest Time Wins</h3>
                  <p className="text-gray-400 text-sm">Quickest completion wins</p>
                </div>
              </div>
            </section>

            <section className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-4">⏱️ Timer Rules</h2>
              <div className="space-y-2 text-gray-300">
                <p>• 2 submissions → 30 day timer starts</p>
                <p>• 3 submissions → timer drops to 21 days (if longer)</p>
                <p>• 4 submissions → timer drops to 14 days (if longer)</p>
                <p>• Timer expires → challenge completes with available scores</p>
              </div>
            </section>

            <section className="bg-gradient-to-r from-amber-900 to-red-900 rounded-xl p-6 border border-red-700">
              <h2 className="text-xl font-bold mb-4">💩 The Loser's Punishment</h2>
              <p className="text-lg mb-4">The player in LAST PLACE at the end of 2026 must endure:</p>
              <div className="bg-gray-900 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-red-400 mb-2">100ml - 500ml of LIQUID FART SPRAY</p>
                <p className="text-gray-300">Quantity decided by THE WINNER 🏆</p>
              </div>
              <p className="text-center mt-4 italic text-gray-400">"May the odds be ever in your favour. And the smell be ever not on you."</p>
            </section>

            <section className="bg-purple-900 rounded-xl p-6 border border-purple-700">
              <h2 className="text-xl font-bold mb-4">🍀 So Lucky Mode</h2>
              <p className="text-gray-300">One of our friends doesn't play Warhammer Total War 3 ("Turns" challenges). Toggle "So Lucky" mode at the top of the page to view an alternate leaderboard that excludes all Turns challenges - so they can still feel included!</p>
            </section>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 border-t border-gray-700 p-4 mt-8">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">The Scott Warrens · 2026 Year of Challenges</div>
      </footer>
    </div>
  );
}

export default ScottWarrensDashboard;
