// Hand-drawn SVG illustrations for the Dinner Decider tournament.
// Each entry renders inside a 200x200 viewBox and is used as the fallback
// when a real photo (local /foods/<id>.jpg or the Wikimedia hotlink) fails to load.

import React from 'react';

function Plate(props) {
  return (
    <g>
      <ellipse cx="100" cy="112" rx="80" ry="72" fill="rgba(0,0,0,0.18)" />
      <circle cx="100" cy="106" r="76" fill={props.rim || '#f4eee2'} />
      <circle cx="100" cy="106" r="62" fill={props.well || '#ffffff'} />
    </g>
  );
}

var ART = {};

ART.italian = function () {
  return (
    <g>
      <Plate rim="#f4eee2" well="#faf6ec" />
      <circle cx="100" cy="106" r="58" fill="#e8b04b" />
      <circle cx="100" cy="106" r="49" fill="#d94f2b" />
      <circle cx="100" cy="106" r="45" fill="#f2cf66" />
      <g stroke="#c8912f" strokeWidth="2.5">
        <line x1="100" y1="48" x2="100" y2="164" />
        <line x1="42" y1="106" x2="158" y2="106" />
        <line x1="59" y1="65" x2="141" y2="147" />
        <line x1="141" y1="65" x2="59" y2="147" />
      </g>
      <g fill="#b93a26">
        <circle cx="82" cy="84" r="7" />
        <circle cx="122" cy="88" r="7" />
        <circle cx="76" cy="122" r="7" />
        <circle cx="118" cy="128" r="7" />
        <circle cx="100" cy="106" r="7" />
      </g>
      <g fill="#3e8e41">
        <ellipse cx="96" cy="72" rx="6" ry="3.5" transform="rotate(-20 96 72)" />
        <ellipse cx="132" cy="112" rx="6" ry="3.5" transform="rotate(30 132 112)" />
        <ellipse cx="72" cy="102" rx="6" ry="3.5" transform="rotate(10 72 102)" />
        <ellipse cx="108" cy="140" rx="6" ry="3.5" transform="rotate(-30 108 140)" />
      </g>
    </g>
  );
};

ART.greek = function () {
  return (
    <g>
      <ellipse cx="100" cy="168" rx="70" ry="12" fill="rgba(0,0,0,0.18)" />
      <path d="M60 168 L78 76 Q100 62 122 76 L140 168 Z" fill="#e9d8ae" />
      <path d="M60 168 L67 132 L133 132 L140 168 Z" fill="#c9cdd4" />
      <path d="M67 132 L133 132 L131 142 L69 142 Z" fill="#aab0ba" />
      <g>
        <path d="M80 78 Q88 68 96 78 Q104 66 112 76 Q118 70 122 78 L118 96 L84 96 Z" fill="#a9603a" />
        <circle cx="88" cy="88" r="5" fill="#e74c3c" />
        <circle cx="112" cy="86" r="5" fill="#e74c3c" />
        <path d="M96 82 q6 -4 12 0 q-6 5 -12 0" fill="#f6f2ea" />
        <path d="M84 96 Q100 104 118 96" stroke="#7dc242" strokeWidth="5" fill="none" />
      </g>
      <path d="M86 104 q10 8 28 0" stroke="#f6f2ea" strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="45" cy="150" rx="20" ry="9" fill="#ffffff" />
      <ellipse cx="45" cy="147" rx="20" ry="8" fill="#eef4f6" />
      <ellipse cx="45" cy="146" rx="13" ry="4.5" fill="#f8fbf2" />
      <circle cx="42" cy="146" r="1.6" fill="#7dc242" />
      <circle cx="49" cy="145" r="1.6" fill="#7dc242" />
    </g>
  );
};

ART.moroccan = function () {
  return (
    <g>
      <ellipse cx="100" cy="164" rx="74" ry="12" fill="rgba(0,0,0,0.18)" />
      <path d="M42 138 Q100 118 158 138 L152 160 Q100 172 48 160 Z" fill="#b85c33" />
      <path d="M42 138 Q100 152 158 138 L158 142 Q100 158 42 142 Z" fill="#9c4a27" />
      <path d="M100 46 L146 132 Q100 146 54 132 Z" fill="#cf7040" />
      <path d="M100 46 L146 132 Q124 138 100 139 Z" fill="#c0653a" opacity="0.6" />
      <circle cx="100" cy="42" r="8" fill="#8a3f21" />
      <g stroke="#f0d9a8" strokeWidth="3" fill="none">
        <path d="M64 122 L74 112 L84 122 L94 112 L104 122 L114 112 L124 122 L134 112" />
      </g>
      <g stroke="#ffffff" strokeWidth="3.5" fill="none" opacity="0.75" strokeLinecap="round">
        <path d="M76 34 q6 -10 0 -18" />
        <path d="M124 36 q-6 -10 0 -18" />
      </g>
    </g>
  );
};

ART.kebabs = function () {
  return (
    <g>
      <circle cx="100" cy="110" r="66" fill="#e9d8ae" />
      <circle cx="100" cy="110" r="58" fill="#f2e6c4" />
      <g transform="rotate(-24 100 104)">
        <line x1="30" y1="88" x2="170" y2="88" stroke="#9aa1a8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="170" cy="88" r="6" fill="#6d7379" />
        <rect x="46" y="76" width="22" height="24" rx="5" fill="#8c4a2f" />
        <rect x="72" y="76" width="22" height="24" rx="5" fill="#4caf50" />
        <rect x="98" y="76" width="22" height="24" rx="5" fill="#a9603a" />
        <rect x="124" y="76" width="22" height="24" rx="5" fill="#e74c3c" />
      </g>
      <g transform="rotate(-24 100 140)">
        <line x1="30" y1="128" x2="170" y2="128" stroke="#9aa1a8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="170" cy="128" r="6" fill="#6d7379" />
        <rect x="46" y="116" width="22" height="24" rx="5" fill="#e74c3c" />
        <rect x="72" y="116" width="22" height="24" rx="5" fill="#8c4a2f" />
        <rect x="98" y="116" width="22" height="24" rx="5" fill="#f0a13a" />
        <rect x="124" y="116" width="22" height="24" rx="5" fill="#8c4a2f" />
      </g>
    </g>
  );
};

ART.sushi = function () {
  return (
    <g>
      <rect x="28" y="96" width="144" height="52" rx="10" fill="#a9713c" />
      <rect x="28" y="96" width="144" height="10" rx="5" fill="#c08a4d" />
      <g>
        <circle cx="64" cy="92" r="26" fill="#2e2e2e" />
        <circle cx="64" cy="92" r="19" fill="#f6f2ea" />
        <circle cx="64" cy="92" r="9" fill="#fa8072" />
      </g>
      <g>
        <circle cx="118" cy="92" r="26" fill="#2e2e2e" />
        <circle cx="118" cy="92" r="19" fill="#f6f2ea" />
        <circle cx="118" cy="92" r="9" fill="#7dc242" />
      </g>
      <g transform="rotate(14 158 84)">
        <rect x="150" y="46" width="5" height="76" rx="2.5" fill="#d9b078" />
        <rect x="160" y="46" width="5" height="76" rx="2.5" fill="#d9b078" />
      </g>
      <ellipse cx="64" cy="132" rx="16" ry="7" fill="#3b4a54" />
      <ellipse cx="64" cy="130" rx="16" ry="6" fill="#465864" />
      <ellipse cx="64" cy="130" rx="11" ry="3.5" fill="#20272c" />
    </g>
  );
};

ART.japanese = function () {
  return (
    <g>
      <ellipse cx="100" cy="164" rx="70" ry="11" fill="rgba(0,0,0,0.18)" />
      <path d="M34 96 Q100 84 166 96 Q164 150 128 162 L72 162 Q36 150 34 96 Z" fill="#b3352b" />
      <path d="M34 96 Q100 110 166 96 Q166 104 164 110 Q100 124 36 110 Q34 104 34 96 Z" fill="#7e2119" />
      <ellipse cx="100" cy="96" rx="64" ry="14" fill="#e8a13a" />
      <g stroke="#f4d03f" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M56 94 q10 6 22 0 q10 6 22 0 q10 6 22 0 q8 5 16 0" />
        <path d="M62 100 q10 6 22 0 q10 6 22 0 q10 6 20 0" />
      </g>
      <circle cx="70" cy="88" r="11" fill="#f6f2ea" />
      <circle cx="70" cy="88" r="5.5" fill="#f0a13a" />
      <circle cx="132" cy="88" r="13" fill="#c98a5a" />
      <circle cx="132" cy="88" r="6" fill="#e7c496" />
      <rect x="94" y="66" width="14" height="24" fill="#233229" rx="2" />
      <g fill="#5cae4a">
        <circle cx="103" cy="94" r="3" />
        <circle cx="110" cy="91" r="3" />
        <circle cx="97" cy="92" r="3" />
      </g>
      <g transform="rotate(24 152 52)">
        <rect x="148" y="14" width="5" height="80" rx="2.5" fill="#5b4632" />
        <rect x="157" y="14" width="5" height="80" rx="2.5" fill="#5b4632" />
      </g>
    </g>
  );
};

ART.burgers = function () {
  return (
    <g>
      <ellipse cx="100" cy="168" rx="72" ry="11" fill="rgba(0,0,0,0.18)" />
      <path d="M40 96 Q40 52 100 52 Q160 52 160 96 L40 96 Z" fill="#e8a33d" />
      <g fill="#f7e2b0">
        <ellipse cx="76" cy="72" rx="4" ry="2.6" />
        <ellipse cx="100" cy="64" rx="4" ry="2.6" />
        <ellipse cx="124" cy="72" rx="4" ry="2.6" />
        <ellipse cx="88" cy="84" rx="4" ry="2.6" />
        <ellipse cx="112" cy="84" rx="4" ry="2.6" />
      </g>
      <path d="M38 96 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 L162 106 L38 106 Z" fill="#7dc242" />
      <rect x="44" y="104" width="112" height="10" rx="4" fill="#f0533d" />
      <path d="M48 114 L152 114 L160 126 L40 126 Z" fill="#f2b632" />
      <rect x="40" y="124" width="120" height="18" rx="9" fill="#6f4326" />
      <path d="M42 146 L158 146 Q158 166 138 166 L62 166 Q42 166 42 146 Z" fill="#e8a33d" />
    </g>
  );
};

ART.ribs = function () {
  return (
    <g>
      <Plate rim="#e5dccb" well="#f4efe3" />
      <g transform="rotate(-14 100 104)">
        <path d="M40 84 Q100 66 160 84 L156 128 Q100 144 44 128 Z" fill="#8c3a2b" />
        <path d="M40 84 Q100 66 160 84 L159 94 Q100 76 41 94 Z" fill="#a34733" />
        <g stroke="#6d2b1f" strokeWidth="5" strokeLinecap="round">
          <line x1="62" y1="82" x2="60" y2="128" />
          <line x1="86" y1="76" x2="85" y2="132" />
          <line x1="112" y1="76" x2="113" y2="132" />
          <line x1="136" y1="82" x2="139" y2="128" />
        </g>
        <g fill="#c9614a" opacity="0.8">
          <ellipse cx="74" cy="94" rx="5" ry="2.6" />
          <ellipse cx="100" cy="90" rx="5" ry="2.6" />
          <ellipse cx="126" cy="94" rx="5" ry="2.6" />
        </g>
      </g>
      <circle cx="152" cy="146" r="13" fill="#7e2119" />
      <circle cx="152" cy="144" r="13" fill="#9c2c20" />
      <ellipse cx="152" cy="143" rx="8" ry="4" fill="#c0392b" />
    </g>
  );
};

ART.thai = function () {
  return (
    <g>
      <Plate rim="#3b6b8f" well="#ffffff" />
      <ellipse cx="100" cy="106" rx="52" ry="38" fill="#f0c060" />
      <g stroke="#e2a93e" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M58 100 q20 -14 42 -2 q22 10 42 -2" />
        <path d="M62 112 q20 12 40 0 q20 -12 38 2" />
        <path d="M70 122 q16 8 32 2 q16 -8 30 0" />
      </g>
      <g fill="#f4845f">
        <path d="M78 88 q-12 -2 -12 -14 q0 -10 10 -10 q4 8 2 24 Z" />
        <path d="M124 86 q12 -2 12 -14 q0 -10 -10 -10 q-4 8 -2 24 Z" />
        <path d="M100 132 q-12 2 -14 -8 q8 -8 18 -4 q0 8 -4 12 Z" />
      </g>
      <path d="M142 128 a12 12 0 0 1 -20 8 Z" fill="#7dc242" />
      <path d="M142 128 a10 10 0 0 1 -16 7 Z" fill="#c6e89a" />
      <g fill="#8a5a2b">
        <circle cx="70" cy="130" r="2.4" />
        <circle cx="77" cy="134" r="2.4" />
        <circle cx="64" cy="122" r="2.4" />
      </g>
    </g>
  );
};

ART.indian = function () {
  return (
    <g>
      <ellipse cx="100" cy="160" rx="72" ry="12" fill="rgba(0,0,0,0.18)" />
      <path d="M128 60 Q168 58 176 88 Q180 118 152 122 Q160 92 128 84 Z" fill="#e9cf9a" />
      <path d="M132 66 Q162 66 169 88 Q172 108 154 114 Q158 92 132 84 Z" fill="#f2e0b4" />
      <path d="M40 100 Q100 88 160 100 Q158 148 124 158 L76 158 Q42 148 40 100 Z" fill="#b04a1f" />
      <path d="M40 100 Q100 112 160 100 Q160 106 158 112 Q100 126 42 112 Q40 106 40 100 Z" fill="#8c3712" />
      <ellipse cx="100" cy="100" rx="58" ry="13" fill="#e07020" />
      <g fill="#a9603a">
        <circle cx="78" cy="98" r="9" />
        <circle cx="112" cy="94" r="9" />
        <circle cx="128" cy="102" r="8" />
      </g>
      <path d="M60 98 q18 10 40 4 q22 -6 38 2" stroke="#fbe6c9" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.9" />
      <g fill="#2f6b33">
        <ellipse cx="92" cy="92" rx="4" ry="2" />
        <ellipse cx="120" cy="96" rx="4" ry="2" />
      </g>
    </g>
  );
};

ART.chinese = function () {
  return (
    <g>
      <ellipse cx="100" cy="164" rx="76" ry="12" fill="rgba(0,0,0,0.18)" />
      <path d="M34 118 L166 118 L160 158 L40 158 Z" fill="#c9a15e" />
      <g stroke="#a9803f" strokeWidth="3">
        <line x1="34" y1="130" x2="166" y2="130" />
        <line x1="52" y1="118" x2="54" y2="158" />
        <line x1="100" y1="118" x2="100" y2="158" />
        <line x1="148" y1="118" x2="146" y2="158" />
      </g>
      <ellipse cx="100" cy="118" rx="66" ry="12" fill="#e2c088" />
      <ellipse cx="100" cy="115" rx="60" ry="9" fill="#f2e0b4" />
      <g>
        <path d="M46 112 Q48 88 70 88 Q92 88 94 112 Q70 120 46 112 Z" fill="#faf3e3" />
        <path d="M104 110 Q106 84 130 84 Q154 84 156 110 Q130 120 104 110 Z" fill="#faf3e3" />
        <path d="M76 96 Q78 74 100 74 Q122 74 124 96 Q100 106 76 96 Z" fill="#fdf8ec" />
        <g stroke="#d9c8a5" strokeWidth="2.5" fill="none" strokeLinecap="round">
          <path d="M60 92 q10 -8 20 0" />
          <path d="M118 90 q10 -8 20 0" />
          <path d="M90 80 q10 -8 20 0" />
        </g>
      </g>
    </g>
  );
};

ART.mexican = function () {
  return (
    <g>
      <ellipse cx="100" cy="160" rx="76" ry="12" fill="rgba(0,0,0,0.18)" />
      <g transform="rotate(-8 66 116)">
        <path d="M18 132 A48 48 0 0 1 114 132 Z" fill="#f2c14e" />
        <path d="M26 132 A40 40 0 0 1 106 132 Z" fill="#e8b13c" />
        <path d="M30 132 q8 -20 18 -8 q6 -14 16 -6 q8 -12 16 -4 q8 -8 14 0 l4 18 Z" fill="#8c4a2f" />
        <path d="M34 120 q10 -10 18 -2 q10 -10 20 -2 q10 -8 20 0" stroke="#7dc242" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="52" cy="118" r="4" fill="#e74c3c" />
        <circle cx="76" cy="112" r="4" fill="#e74c3c" />
      </g>
      <g transform="rotate(8 138 120)">
        <path d="M86 136 A48 48 0 0 1 182 136 Z" fill="#f2c14e" />
        <path d="M94 136 A40 40 0 0 1 174 136 Z" fill="#e8b13c" />
        <path d="M98 136 q8 -20 18 -8 q6 -14 16 -6 q8 -12 16 -4 q8 -8 14 0 l4 18 Z" fill="#8c4a2f" />
        <path d="M102 124 q10 -10 18 -2 q10 -10 20 -2 q10 -8 20 0" stroke="#7dc242" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="120" cy="122" r="4" fill="#f2e0b4" />
        <circle cx="146" cy="116" r="4" fill="#e74c3c" />
      </g>
    </g>
  );
};

ART.vietnamese = function () {
  return (
    <g>
      <ellipse cx="100" cy="164" rx="70" ry="11" fill="rgba(0,0,0,0.18)" />
      <path d="M34 96 Q100 84 166 96 Q164 150 128 162 L72 162 Q36 150 34 96 Z" fill="#f2ede2" />
      <path d="M42 116 Q100 130 158 116 Q154 134 140 144 L60 144 Q46 134 42 116" fill="#3b6b8f" opacity="0.25" />
      <ellipse cx="100" cy="96" rx="64" ry="14" fill="#d9903f" />
      <g stroke="#f6f2ea" strokeWidth="3.5" fill="none" strokeLinecap="round">
        <path d="M56 94 q12 7 24 0 q12 7 24 0 q12 7 24 0 q8 5 16 0" />
      </g>
      <g fill="#c98a5a">
        <ellipse cx="76" cy="90" rx="12" ry="6" />
        <ellipse cx="120" cy="92" rx="12" ry="6" />
      </g>
      <g fill="#5cae4a">
        <circle cx="98" cy="88" r="3.4" />
        <circle cx="106" cy="92" r="3.4" />
        <circle cx="90" cy="94" r="3.4" />
      </g>
      <g fill="#e74c3c">
        <circle cx="140" cy="90" r="3.6" />
        <circle cx="132" cy="96" r="3.6" />
      </g>
      <path d="M58 84 a10 10 0 0 1 16 -6 Z" fill="#c6e89a" />
    </g>
  );
};

ART.fishchips = function () {
  return (
    <g>
      <path d="M56 78 L144 78 L126 168 L74 168 Z" fill="#f2ede2" />
      <path d="M56 78 L144 78 L140 96 L60 96 Z" fill="#dcd4c2" />
      <g>
        <rect x="72" y="34" width="9" height="52" rx="4" fill="#f2c14e" transform="rotate(-14 76 60)" />
        <rect x="88" y="28" width="9" height="56" rx="4" fill="#f0b93a" transform="rotate(-4 92 56)" />
        <rect x="104" y="28" width="9" height="56" rx="4" fill="#f2c14e" transform="rotate(6 108 56)" />
        <rect x="118" y="34" width="9" height="52" rx="4" fill="#f0b93a" transform="rotate(16 122 60)" />
      </g>
      <g transform="rotate(-18 100 122)">
        <path d="M52 122 Q58 104 84 102 L134 108 Q150 112 150 122 Q150 132 134 136 L84 142 Q58 140 52 122 Z" fill="#e0a23e" />
        <path d="M52 122 Q58 104 84 102 L100 104 Q92 122 100 140 L84 142 Q58 140 52 122 Z" fill="#eab654" />
        <g fill="#c9812c">
          <circle cx="112" cy="114" r="2.6" />
          <circle cx="126" cy="122" r="2.6" />
          <circle cx="112" cy="130" r="2.6" />
        </g>
        <path d="M150 122 L168 108 L164 122 L168 136 Z" fill="#e0a23e" />
      </g>
      <circle cx="152" cy="158" r="13" fill="#f4d03f" />
      <circle cx="152" cy="158" r="9" fill="#f8e27a" />
    </g>
  );
};

ART.parmy = function () {
  return (
    <g>
      <Plate rim="#e5dccb" well="#f4efe3" />
      <path d="M50 96 Q54 70 88 66 Q130 62 146 84 Q158 102 146 122 Q128 142 92 138 Q54 132 50 96 Z" fill="#d99b3c" />
      <g fill="#c9812c">
        <circle cx="66" cy="92" r="2.4" />
        <circle cx="140" cy="104" r="2.4" />
        <circle cx="76" cy="126" r="2.4" />
      </g>
      <path d="M62 94 Q66 76 92 74 Q124 70 136 88 Q144 102 134 116 Q118 130 90 126 Q64 122 62 94 Z" fill="#c0392b" />
      <path d="M70 94 Q74 82 94 80 Q120 78 130 92 Q134 102 126 112 Q112 122 90 118 Q72 114 70 94 Z" fill="#f5d76e" />
      <path d="M78 108 q6 9 0 17" stroke="#f5d76e" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g fill="#2f6b33">
        <ellipse cx="86" cy="88" rx="4.5" ry="2.2" transform="rotate(-24 86 88)" />
        <ellipse cx="104" cy="96" rx="4.5" ry="2.2" transform="rotate(18 104 96)" />
        <ellipse cx="118" cy="86" rx="4.5" ry="2.2" transform="rotate(-10 118 86)" />
        <ellipse cx="112" cy="106" rx="4.5" ry="2.2" transform="rotate(30 112 106)" />
      </g>
      <g>
        <rect x="132" y="128" width="26" height="8" rx="4" fill="#f2c14e" transform="rotate(-18 145 132)" />
        <rect x="136" y="138" width="26" height="8" rx="4" fill="#f0b93a" transform="rotate(-6 149 142)" />
      </g>
    </g>
  );
};

ART.steak = function () {
  return (
    <g>
      <Plate rim="#e0d5c2" well="#f4efe3" />
      <g transform="rotate(-10 100 104)">
        <path d="M48 104 Q46 78 76 70 Q112 60 140 76 Q160 88 154 112 Q146 138 108 140 Q60 140 48 104 Z" fill="#8c3a2b" />
        <path d="M54 102 Q54 82 78 76 Q110 66 136 80 Q152 90 148 110 Q140 132 106 134 Q62 132 54 102 Z" fill="#a34733" />
        <g stroke="#6d2b1f" strokeWidth="5" strokeLinecap="round">
          <line x1="70" y1="84" x2="120" y2="124" />
          <line x1="92" y1="76" x2="138" y2="112" />
          <line x1="60" y1="98" x2="98" y2="130" />
        </g>
        <rect x="92" y="84" width="20" height="20" rx="4" fill="#f7e8b8" transform="rotate(8 102 94)" />
        <path d="M96 104 q6 8 14 4" stroke="#f7e8b8" strokeWidth="5" fill="none" strokeLinecap="round" />
      </g>
      <g stroke="#4a7c46" strokeWidth="3" strokeLinecap="round">
        <line x1="140" y1="140" x2="162" y2="128" />
      </g>
      <g fill="#4a7c46">
        <ellipse cx="146" cy="136" rx="4" ry="1.8" transform="rotate(-28 146 136)" />
        <ellipse cx="152" cy="133" rx="4" ry="1.8" transform="rotate(-28 152 133)" />
        <ellipse cx="158" cy="130" rx="4" ry="1.8" transform="rotate(-28 158 130)" />
      </g>
    </g>
  );
};

export default ART;
