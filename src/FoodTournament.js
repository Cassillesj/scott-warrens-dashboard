import React, { useState, useEffect } from 'react';
import ART from './foodArt';

// Sixteen dinner options. Image loading order for each food:
//   1. /foods/<id>.jpg in the public folder (drop your own photos in to override)
//   2. A freely licensed photo hotlinked from Wikimedia Commons
//   3. The hand-drawn illustration in foodArt.js
var FOODS = [
  { id: 'italian', name: 'Italian', blurb: 'Wood-fired pizza and a big bowl of pasta', bg: '#1f3a2d', img: 'Eq_it-na_pizza-margherita_sep2005_sml.jpg' },
  { id: 'greek', name: 'Greek', blurb: 'Souvlaki, gyros and garlicky tzatziki', bg: '#1e3a52', img: 'Gyros_and_fries.jpg' },
  { id: 'moroccan', name: 'Moroccan', blurb: 'Slow-cooked tagine with fluffy couscous', bg: '#4a2c17', img: 'Tajine.jpg' },
  { id: 'kebabs', name: 'Kebabs', blurb: 'A proper doner with the lot and garlic sauce', bg: '#3d2318', img: 'Doner_kebab.jpg' },
  { id: 'sushi', name: 'Sushi', blurb: 'Fresh rolls, sashimi and plenty of soy', bg: '#20303c', img: 'Western_Sushi.jpg' },
  { id: 'japanese', name: 'Japanese', blurb: 'Steaming ramen or crispy chicken katsu', bg: '#31232e', img: 'Shoyu_ramen.jpg' },
  { id: 'burgers', name: 'Burgers', blurb: 'A stacked cheeseburger with crispy chips', bg: '#3a2a1a', img: 'NCI_Visuals_Food_Hamburger.jpg' },
  { id: 'ribs', name: 'Ribs', blurb: 'Sticky American-style ribs, extra napkins', bg: '#38201c', img: 'Pork_ribs.jpg' },
  { id: 'thai', name: 'Thai', blurb: 'Pad thai and a fragrant green curry', bg: '#243a2a', img: 'Phat_Thai_kung_Chang_Khien_street_stall.jpg' },
  { id: 'indian', name: 'Indian', blurb: 'Butter chicken with garlic naan', bg: '#3d2a14', img: 'Chicken_makhani.jpg' },
  { id: 'chinese', name: 'Chinese', blurb: 'Dumplings, fried rice and honey chicken', bg: '#3a1f1f', img: 'Jiaozi.jpg' },
  { id: 'mexican', name: 'Mexican', blurb: 'Tacos, burritos and plenty of guac', bg: '#2d3520', img: '001_Tacos_de_carnitas,_carne_asada_y_al_pastor.jpg' },
  { id: 'vietnamese', name: 'Vietnamese', blurb: 'A big bowl of pho or a crunchy banh mi', bg: '#1f3436', img: 'Pho-Beef-Noodles-2008.jpg' },
  { id: 'fishchips', name: 'Fish & Chips', blurb: 'Battered snapper and chips by the water', bg: '#1d3242', img: 'Fish_and_chips_blackpool.jpg' },
  { id: 'parmy', name: 'Chicken Parmy', blurb: 'The pub classic with chips and salad', bg: '#402418', img: 'Chicken_parmigiana.jpg' },
  { id: 'steak', name: 'Steak Night', blurb: 'Pub steak, cooked medium rare', bg: '#2e2020', img: 'Steak_frites.jpg' }
];

var FOOD_BY_ID = {};
FOODS.forEach(function (f) { FOOD_BY_ID[f.id] = f; });

var STORAGE_KEY = 'scott-warrens-dinner-bracket-v1';
var ROUND_NAMES = ['Round of 16', 'Quarter Finals', 'Semi Finals', 'The Grand Final'];
var CONFETTI_COLORS = ['#f2c14e', '#e74c3c', '#7dc242', '#3b82f6', '#f0a13a', '#fa8072'];

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}

function freshState() {
  return { order: shuffle(FOODS.map(function (f) { return f.id; })), picks: [] };
}

function loadState() {
  try {
    var raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    var parsed = JSON.parse(raw);
    var validOrder = Array.isArray(parsed.order) &&
      parsed.order.length === FOODS.length &&
      parsed.order.every(function (id) { return FOOD_BY_ID[id]; });
    var validPicks = Array.isArray(parsed.picks) &&
      parsed.picks.every(function (id) { return FOOD_BY_ID[id]; });
    if (validOrder && validPicks) return { order: parsed.order, picks: parsed.picks.slice(0, FOODS.length - 1) };
  } catch (e) { /* corrupted storage falls through to a fresh bracket */ }
  return freshState();
}

// rounds[0] is the seeded field; each later round holds winner ids (or null while undecided)
function buildRounds(order, picks) {
  var rounds = [order];
  var idx = 0;
  var size = order.length / 2;
  while (size >= 1) {
    var next = [];
    for (var i = 0; i < size; i++) {
      next.push(idx < picks.length ? picks[idx] : null);
      idx++;
    }
    rounds.push(next);
    size = size / 2;
  }
  return rounds;
}

function FoodImage(props) {
  var food = props.food;
  var [stage, setStage] = useState(0);

  useEffect(function () { setStage(0); }, [food.id]);

  var sources = [
    process.env.PUBLIC_URL + '/foods/' + food.id + '.jpg',
    'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(food.img) + '?width=640'
  ];

  if (stage < sources.length) {
    return (
      <img
        src={sources[stage]}
        alt={food.name + ' - ' + food.blurb}
        className="w-full h-full object-cover"
        draggable="false"
        onError={function () { setStage(stage + 1); }}
      />
    );
  }

  var draw = ART[food.id];
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" role="img" aria-label={food.name}>
      <rect width="200" height="200" fill={food.bg} />
      {draw ? draw() : null}
    </svg>
  );
}

function MatchupCard(props) {
  var food = props.food;
  return (
    <button
      onClick={props.onPick}
      className="group relative flex-1 min-w-0 text-left rounded-2xl overflow-hidden bg-gray-800 border-2 border-gray-700 hover:border-amber-400 hover:scale-[1.02] active:scale-95 transition-all shadow-lg focus:outline-none focus:border-amber-400"
    >
      <div className="aspect-square w-full overflow-hidden">
        <FoodImage food={food} />
      </div>
      <div className="p-3 sm:p-4">
        <div className="font-bold text-lg sm:text-xl">{food.name}</div>
        <div className="text-gray-400 text-xs sm:text-sm mt-1">{food.blurb}</div>
        <div className="mt-3 text-amber-400 text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
          Pick this one
        </div>
      </div>
    </button>
  );
}

function BracketSlot(props) {
  var food = props.food;
  var status = props.status; // 'alive' | 'out' | 'active' | 'empty' | 'champion'

  if (!food) {
    return (
      <div className="flex items-center gap-2 h-9">
        <div className="w-8 h-8 rounded-full border-2 border-dashed border-gray-600 flex-shrink-0" />
        <span className="text-gray-600 text-xs">TBD</span>
      </div>
    );
  }

  var wrapClass = 'flex items-center gap-2 h-9 rounded-full pr-2 transition-all';
  var imgClass = 'w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2 ';
  var nameClass = 'text-xs whitespace-nowrap ';

  if (status === 'out') {
    wrapClass += ' opacity-35 grayscale';
    imgClass += 'border-gray-600';
    nameClass += 'text-gray-400 line-through';
  } else if (status === 'active') {
    wrapClass += ' bg-amber-400/10';
    imgClass += 'border-amber-400';
    nameClass += 'text-amber-300 font-bold';
  } else if (status === 'champion') {
    imgClass = 'w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-amber-400';
    nameClass += 'text-amber-300 font-bold';
  } else {
    imgClass += 'border-gray-600';
    nameClass += 'text-gray-200';
  }

  return (
    <div className={wrapClass}>
      <div className={imgClass}><FoodImage food={food} /></div>
      <span className={nameClass}>{food.name}</span>
    </div>
  );
}

function Bracket(props) {
  var rounds = props.rounds;
  var currentMatch = props.currentMatch; // { round, index } or null when finished
  var columns = [];

  for (var r = 0; r < rounds.length; r++) {
    var isChampCol = r === rounds.length - 1;
    var slots = [];
    for (var j = 0; j < rounds[r].length; j++) {
      var id = rounds[r][j];
      var food = id ? FOOD_BY_ID[id] : null;
      var status = 'alive';
      if (!food) {
        status = 'empty';
      } else if (isChampCol) {
        status = 'champion';
      } else {
        var winner = rounds[r + 1][Math.floor(j / 2)];
        if (winner && winner !== id) status = 'out';
        else if (currentMatch && currentMatch.round === r && Math.floor(j / 2) === currentMatch.index) status = 'active';
      }
      slots.push(<BracketSlot key={r + '-' + j} food={food} status={status} />);
    }
    columns.push(
      <div key={r} className="flex flex-col flex-shrink-0">
        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 text-center">
          {isChampCol ? 'Winner' : ROUND_NAMES[r]}
        </div>
        <div className="flex-1 flex flex-col justify-around gap-1">{slots}</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-6 sm:gap-10 min-w-max px-2" style={{ minHeight: '620px' }}>{columns}</div>
    </div>
  );
}

function Confetti() {
  var pieces = [];
  for (var i = 0; i < 36; i++) {
    pieces.push(
      <div
        key={i}
        className="confetti-piece"
        style={{
          left: (i * 2.77 + (i % 3) * 1.2) + '%',
          backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animationDelay: (i % 12) * 0.35 + 's',
          animationDuration: 2.6 + (i % 5) * 0.5 + 's',
          width: i % 2 === 0 ? '8px' : '12px',
          height: i % 2 === 0 ? '14px' : '8px'
        }}
      />
    );
  }
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-40">
      <style>{'.confetti-piece{position:absolute;top:-20px;border-radius:2px;animation-name:confetti-fall;animation-timing-function:linear;animation-iteration-count:infinite}@keyframes confetti-fall{0%{transform:translateY(-5vh) rotate(0deg)}100%{transform:translateY(105vh) rotate(720deg)}}'}</style>
      {pieces}
    </div>
  );
}

function FoodTournament() {
  var [state, setState] = useState(loadState);

  useEffect(function () {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* private browsing - state just won't survive a refresh */ }
  }, [state]);

  var rounds = buildRounds(state.order, state.picks);
  var totalMatches = FOODS.length - 1;
  var finished = state.picks.length >= totalMatches;

  // Locate the current match from the number of picks made so far
  var currentMatch = null;
  var foodA = null;
  var foodB = null;
  if (!finished) {
    var m = state.picks.length;
    var round = 0;
    var matchesBefore = 0;
    var roundSize = FOODS.length / 2;
    while (m >= matchesBefore + roundSize) {
      matchesBefore += roundSize;
      roundSize = roundSize / 2;
      round++;
    }
    var index = m - matchesBefore;
    currentMatch = { round: round, index: index, ofRound: roundSize };
    foodA = FOOD_BY_ID[rounds[round][index * 2]];
    foodB = FOOD_BY_ID[rounds[round][index * 2 + 1]];
  }

  var champion = finished ? FOOD_BY_ID[state.picks[totalMatches - 1]] : null;

  function pick(id) {
    setState({ order: state.order, picks: state.picks.concat([id]) });
  }

  function undo() {
    if (state.picks.length === 0) return;
    setState({ order: state.order, picks: state.picks.slice(0, -1) });
  }

  function restart() {
    if (state.picks.length > 0 && !window.confirm('Start a brand new bracket? All picks will be cleared.')) return;
    setState(freshState());
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {finished && <Confetti />}

      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-wider text-amber-400">DINNER DECIDER</h1>
            <p className="text-gray-400 text-sm">Sixteen dinners enter. One gets eaten.</p>
          </div>
          <button
            onClick={function () { window.location.hash = ''; }}
            className="text-gray-400 hover:text-white text-sm whitespace-nowrap"
          >
            Back to dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-8">
        {!finished && (
          <section>
            <div className="text-center mb-4">
              <div className="inline-block bg-gray-800 border border-gray-700 rounded-full px-4 py-1 text-amber-400 text-xs font-bold tracking-widest uppercase">
                {ROUND_NAMES[currentMatch.round]}
              </div>
              <div className="text-gray-400 text-sm mt-2">
                Match {currentMatch.index + 1} of {currentMatch.ofRound} — tap the one you fancy
              </div>
            </div>

            <div className="relative flex gap-3 sm:gap-6 items-stretch">
              <MatchupCard food={foodA} onPick={function () { pick(foodA.id); }} />
              <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 z-10 bg-gray-900 border-2 border-amber-400 text-amber-400 font-black rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center text-lg sm:text-xl shadow-xl">
                VS
              </div>
              <MatchupCard food={foodB} onPick={function () { pick(foodB.id); }} />
            </div>

            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={undo}
                disabled={state.picks.length === 0}
                className="px-4 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Undo last pick
              </button>
              <button
                onClick={restart}
                className="px-4 py-2 rounded-lg text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500"
              >
                Start over
              </button>
            </div>

            <div className="mt-4 h-2 bg-gray-800 rounded-full overflow-hidden max-w-md mx-auto">
              <div
                className="h-full bg-amber-400 rounded-full transition-all"
                style={{ width: (state.picks.length / totalMatches) * 100 + '%' }}
              />
            </div>
            <div className="text-center text-gray-500 text-xs mt-2">
              {state.picks.length} of {totalMatches} matches decided
            </div>
          </section>
        )}

        {finished && (
          <section className="text-center">
            <div className="text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">And the winner is</div>
            <div className="max-w-xs mx-auto rounded-2xl overflow-hidden border-4 border-amber-400 shadow-2xl bg-gray-800">
              <div className="aspect-square w-full overflow-hidden">
                <FoodImage food={champion} />
              </div>
              <div className="p-4">
                <div className="font-black text-2xl">{champion.name}</div>
                <div className="text-gray-400 text-sm mt-1">{champion.blurb}</div>
              </div>
            </div>
            <p className="text-xl font-bold mt-6">That's dinner sorted. Tonight we're having {champion.name}.</p>
            <button
              onClick={restart}
              className="mt-5 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold"
            >
              Run it back
            </button>
          </section>
        )}

        <section className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <h2 className="text-lg font-bold mb-3">The Bracket</h2>
          <Bracket rounds={rounds} currentMatch={currentMatch} />
        </section>
      </main>

      <footer className="p-4 text-center text-gray-500 text-sm">
        The Scott Warrens · Dinner Decider
      </footer>
    </div>
  );
}

export default FoodTournament;
