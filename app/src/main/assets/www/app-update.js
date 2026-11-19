/* ════════════════════════════════════════════════════════════════
   Android app: "new version available" notice.

   APP_BUILD_DATE is the date of THIS app build. When you publish a new
   APK, change it here AND change "date" in app-version.js at the root of
   the GitHub repository to the same value.

   On start the app reads app-version.js from GitHub. If the date there is
   different from APP_BUILD_DATE, a small notice offers the new download.
   Offline or if GitHub can't be reached, nothing is shown.
   ════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var APP_BUILD_DATE = '2026-11-19';
  var SOURCES = [
    'https://raw.githubusercontent.com/kolluruharshavardhanhindu-cyber/BhagavadGita/main/app-version.js',
    'https://kolluruharshavardhanhindu-cyber.github.io/BhagavadGita/app-version.js'
  ];
  var DEFAULT_APK = 'https://github.com/kolluruharshavardhanhindu-cyber/BhagavadGita/raw/refs/heads/main/BhagavadGita.apk?raw=true';
  var TEXT = {
    te: ['కొత్త యాప్ వెర్షన్ అందుబాటులో ఉంది', 'అప్‌డేట్ చేయండి'],
    en: ['A new app version is available', 'Update'],
    hi: ['ऐप का नया संस्करण उपलब्ध है', 'अपडेट करें'],
    ta: ['புதிய ஆப் பதிப்பு கிடைக்கிறது', 'புதுப்பிக்கவும்'],
    kn: ['ಹೊಸ ಆ್ಯಪ್ ಆವೃತ್ತಿ ಲಭ್ಯವಿದೆ', 'ಅಪ್‌ಡೇಟ್ ಮಾಡಿ'],
    ml: ['പുതിയ ആപ്പ് പതിപ്പ് ലഭ്യമാണ്', 'അപ്ഡേറ്റ് ചെയ്യുക'],
    gu: ['એપનું નવું સંસ્કરણ ઉપલબ્ધ છે', 'અપડેટ કરો'],
    bn: ['অ্যাপের নতুন সংস্করণ পাওয়া যাচ্ছে', 'আপডেট করুন'],
    or: ['ଆପର ନୂଆ ସଂସ୍କରଣ ଉପଲବ୍ଧ', 'ଅପଡେଟ୍ କରନ୍ତୁ']
  };
  var DISMISS_KEY = 'gitaUpdateDismissed';

  function lang(){ try { return localStorage.getItem('gitaLang') || 'te'; } catch(e){ return 'te'; } }
  function dismissedFor(date){ try { return sessionStorage.getItem(DISMISS_KEY) === date; } catch(e){ return false; } }

  /* app-version.js is plain JS (window.GITA_APP_LATEST = {...}); read the {...} part as JSON */
  function parse(text){
    var m = String(text).match(/\{[\s\S]*\}/);
    if(!m) return null;
    try { var o = JSON.parse(m[0]); return o && typeof o.date === 'string' ? o : null; } catch(e){ return null; }
  }
  function get(url){
    var ctl = window.AbortController ? new AbortController() : null;
    var t = setTimeout(function(){ if(ctl) ctl.abort(); }, 8000);
    return fetch(url + '?t=' + Date.now(), { cache: 'no-store', signal: ctl ? ctl.signal : undefined })
      .then(function(r){ clearTimeout(t); if(!r.ok) throw new Error(r.status); return r.text(); })
      .then(function(txt){ var o = parse(txt); if(!o) throw new Error('bad file'); return o; });
  }
  function latest(i){
    i = i || 0;
    if(i >= SOURCES.length) return Promise.reject(new Error('unreachable'));
    return get(SOURCES[i]).catch(function(){ return latest(i + 1); });
  }

  function show(info){
    if(document.getElementById('appUpdate') || dismissedFor(info.date)) return;
    var t = TEXT[lang()] || TEXT.en;
    var css = document.createElement('style');
    css.textContent =
      '#appUpdate{position:fixed;left:50%;top:calc(76px + env(safe-area-inset-top));z-index:65;transform:translate(-50%,-20px);opacity:0;' +
      'display:flex;align-items:center;gap:8px;max-width:calc(100vw - 20px);padding:6px 6px 6px 12px;border-radius:999px;' +
      'background:#1a1030;color:#fff;font:700 12.5px/1.3 Manrope,"Noto Sans Telugu",system-ui,sans-serif;' +
      'box-shadow:0 12px 30px -10px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.08);transition:transform .6s cubic-bezier(.34,1.56,.64,1),opacity .4s}' +
      '#appUpdate.in{transform:translate(-50%,0);opacity:1}' +
      '#appUpdate .dot{width:8px;height:8px;border-radius:50%;flex:none;background:#ffb15c;box-shadow:0 0 0 0 rgba(255,177,92,.7);animation:auPulse 1.8s infinite}' +
      '@keyframes auPulse{to{box-shadow:0 0 0 8px rgba(255,177,92,0)}}' +
      '#appUpdate .msg{min-width:0;line-height:1.35}' +
      '@media (max-width:480px){#appUpdate{border-radius:18px;width:calc(100vw - 20px)}#appUpdate .msg{flex:1}}' +
      '#appUpdate a{flex:none;text-decoration:none;color:#2a1700;background:linear-gradient(120deg,#ff8a2a,#ffd089);padding:6px 12px;border-radius:999px;font-weight:800}' +
      '#appUpdate button{flex:none;width:26px;height:26px;border:0;border-radius:50%;background:rgba(255,255,255,.12);color:#fff;font-size:15px;line-height:1;cursor:pointer}';
    document.head.appendChild(css);
    var el = document.createElement('div');
    el.id = 'appUpdate'; el.setAttribute('role', 'status');
    el.innerHTML = '<span class="dot" aria-hidden="true"></span><span class="msg"></span><a target="_blank" rel="noopener"></a><button type="button" aria-label="Close">×</button>';
    el.querySelector('.msg').textContent = t[0];
    var a = el.querySelector('a');
    a.textContent = t[1];
    a.href = (typeof info.apk === 'string' && /^https:\/\//.test(info.apk)) ? info.apk : DEFAULT_APK;
    el.querySelector('button').addEventListener('click', function(){
      try { sessionStorage.setItem(DISMISS_KEY, info.date); } catch(e){}
      el.classList.remove('in'); setTimeout(function(){ el.remove(); }, 450);
    });
    document.body.appendChild(el);
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
  }

  function check(){
    if(!window.fetch) return;
    latest().then(function(info){
      if(info.date !== APP_BUILD_DATE) show(info);
    }).catch(function(){ /* offline or GitHub unreachable: stay quiet */ });
  }
  window.GitaAppUpdate = { buildDate: APP_BUILD_DATE, check: check };
  if(document.readyState === 'complete') setTimeout(check, 1500);
  else window.addEventListener('load', function(){ setTimeout(check, 1500); });
})();
