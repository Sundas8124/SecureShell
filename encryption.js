// script.js - SecureShell (refreshed)
// Client-side encryption: Base64, DES, AES (mirrors your Tkinter behavior).
// Assistant (local-only) searches the knowledge array and replies in chat-style.
// Note: This is fully client-side; no external APIs are used.

(function(){
  // DOM refs
  const textInput = document.getElementById('text-input');
  const keyInput = document.getElementById('key-input');
  const cipherSelect = document.getElementById('cipher-select');
  const encryptBtn = document.getElementById('encrypt-btn');
  const decryptBtn = document.getElementById('decrypt-btn');
  const swapBtn = document.getElementById('swap-btn');
  const output = document.getElementById('output');
  const copyBtn = document.getElementById('copy-btn');
  const clearBtn = document.getElementById('clear-btn');

  const portfolioList = document.getElementById('portfolio-list');
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Assistant elements
  const assistant = document.getElementById('assistant');
  const toggleAssistant = document.getElementById('toggle-assistant');
  const closeAssistant = document.getElementById('close-assistant');
  const assistantInput = document.getElementById('assistant-input');
  const assistantAsk = document.getElementById('assistant-ask');
  const chatHistory = document.getElementById('chat-history');

  // ---------- Knowledge base (edit to add more content) ----------
  const knowledge = [
    {
      id: 'about',
      title: 'About SecureShell',
      body: 'SecureShell is a client-side encryption/decryption playground built and maintained by Sundas Fatima Shafiq. It demonstrates Base64, DES, and AES encryption, plus an assistant that searches site content.'
    },
    {
      id: 'project-intrusion',
      title: 'Intrusion Detection Dashboard',
      body: 'Project: Intrusion Detection Dashboard — Python-based dashboard that visualizes network events, flags anomalies, and supports alerts. Technologies: Python, visualization libraries, rule-based and ML approaches.'
    },
    {
      id: 'project-encrypt-app',
      title: 'Encryption/Decryption App',
      body: 'Project: Encryption & Decryption App — Cross-platform demo built originally with Tkinter (Python). Features: Base64, DES, AES, masked password input, copy-to-clipboard, and clear functionality.'
    },
    {
      id: 'skills',
      title: 'Skills',
      body: 'Python, Cryptography basics (AES/DES/Base64), Hashing, Intrusion Detection concepts, Tkinter (desktop GUI), Web front-end integration (HTML/CSS/JS).'
    },
    {
      id: 'certifications',
      title: 'Certifications',
      body: 'Certified Ethical Hacker (CEH) — IEEE; EC-Council testing in progress; Python Certification; multiple security workshops and trainings.'
    },
    {
      id: 'contact',
      title: 'Contact',
      body: 'Email: sundas8124@gmail.com. GitHub: github.com/sundas8124'
    }
  ];

  // render portfolio cards from knowledge
  function renderPortfolio(){
    if(!portfolioList) return;
    portfolioList.innerHTML = '';
    const items = knowledge.filter(k => k.id.startsWith('project') || k.id === 'skills');
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'portfolio-item';
      el.innerHTML = <strong>${item.title}</strong><div class="small muted" style="margin-top:6px">${item.body}</div>;
      portfolioList.appendChild(el);
    });
  }
  renderPortfolio();

  // ---------- Crypto helpers ----------
  function encodeBase64(s){
    try { return btoa(unescape(encodeURIComponent(s))); } catch(e) { return ''; }
  }
  function decodeBase64(s){
    try { return decodeURIComponent(escape(atob(s))); } catch(e) { throw new Error('Invalid Base64'); }
  }

  // DES (ECB) - key slice/pad to 8
  function desEncrypt(plain, pass){
    const keyStr = (pass || '').slice(0,8).padEnd(8, ' ');
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const encrypted = CryptoJS.DES.encrypt(plain, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }
  function desDecrypt(ciphertext, pass){
    const keyStr = (pass || '').slice(0,8).padEnd(8, ' ');
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    try {
      const bytes = CryptoJS.DES.decrypt(ciphertext, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
      const txt = bytes.toString(CryptoJS.enc.Utf8);
      if(!txt) throw new Error('Decryption failed or wrong key');
      return txt;
    } catch(e) { throw new Error('DES decrypt error: ' + (e.message || e)); }
  }

  // AES (ECB) - key slice/pad to 16
  function aesEncrypt(plain, pass){
    const keyStr = (pass || '').slice(0,16).padEnd(16, ' ');
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const encrypted = CryptoJS.AES.encrypt(plain, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
  }
  function aesDecrypt(ciphertext, pass){
    const keyStr = (pass || '').slice(0,16).padEnd(16, ' ');
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
      const txt = bytes.toString(CryptoJS.enc.Utf8);
      if(!txt) throw new Error('Decryption failed or wrong key');
      return txt;
    } catch(e) { throw new Error('AES decrypt error: ' + (e.message || e)); }
  }

  // safe setter for output
  function setOutputText(s){
    if(output) output.value = s === undefined || s === null ? '' : String(s);
  }

  // ---------- UI handlers ----------
  encryptBtn && encryptBtn.addEventListener('click', () => {
    const text = (textInput.value || '').trim();
    const key = keyInput.value || '';
    const method = cipherSelect.value;
    if(!key){ alert('Encryption Key is required!'); return; }
    if(!text){ alert('No text provided!'); return; }
    try {
      let out = '';
      if(method === 'Base64') out = encodeBase64(text);
      else if(method === 'DES') out = desEncrypt(text, key);
      else if(method === 'AES') out = aesEncrypt(text, key);
      else { alert('Invalid Cipher!'); return; }
      setOutputText(out);
    } catch(err){ alert('Encryption failed: ' + (err.message || err)); }
  });

  decryptBtn && decryptBtn.addEventListener('click', () => {
    const inputVal = (textInput.value || '').trim();
    const outputVal = (output.value || '').trim();
    const source = inputVal || outputVal; // prefer input, fallback to output
    const key = keyInput.value || '';
    const method = cipherSelect.value;
    if(!key){ alert('Encryption Key is required!'); return; }
    if(!source){ alert('No text provided!'); return; }
    try {
      let out = '';
      if(method === 'Base64'){
        const pad = (4 - (source.length % 4)) % 4;
        out = decodeBase64(source + '='.repeat(pad));
      } else if(method === 'DES') out = desDecrypt(source, key);
      else if(method === 'AES') out = aesDecrypt(source, key);
      else { alert('Invalid Cipher!'); return; }
      setOutputText(out);
    } catch(err){ alert('Decryption failed: ' + (err.message || err)); }
  });

  swapBtn && swapBtn.addEventListener('click', () => {
    textInput.value = output.value;
  });

  copyBtn && copyBtn.addEventListener('click', () => {
    const val = (output.value || '').trim();
    if(!val) { alert('No output to copy!'); return; }
    navigator.clipboard.writeText(val).then(()=> alert('Output copied to clipboard!')).catch(()=> alert('Copy failed!'));
  });

  clearBtn && clearBtn.addEventListener('click', () => {
    textInput.value = '';
    output.value = '';
    keyInput.value = '';
  });

  // ---------- Assistant: local only (searches knowledge array) ----------
  function localSearch(query){
    const q = (query || '').trim().toLowerCase();
    if(!q) return [];
    const results = [];
    for(const item of knowledge){
      const hay = (item.title + ' ' + item.body).toLowerCase();
      let score = 0;
      if(hay.includes(q)) score += 10;
      q.split(/\s+/).forEach(t => { if(t && hay.includes(t)) score += 1; });
      if(score > 0) results.push({...item, score});
    }
    return results.sort((a,b) => b.score - a.score);
  }

  function synthesizeAnswer(query){
    // If there are matches, synthesize a friendly answer referencing matched items.
    const matches = localSearch(query);
    if(matches.length === 0) return I couldn't find that on this site. Try different keywords like "intrusion", "encryption", "CEH", or "projects".;
    // build multi-item answer up to top 3
    const top = matches.slice(0,3);
    let answer = I found ${matches.length} result(s) about "${query}". Top matches:\n\n;
    top.forEach(m => {
      answer += • ${m.title}: ${m.body}\n\n;
    });
    answer += 'If you want details about any item, ask "Tell me more about [project name]" or click the project in the portfolio.';
    return answer;
  }

  function appendChat(role, text){
    if(!chatHistory) return;
    const el = document.createElement('div');
    el.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
    el.textContent = text;
    chatHistory.appendChild(el);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  assistantAsk && assistantAsk.addEventListener('click', () => {
    const q = (assistantInput.value || '').trim();
    if(!q) return;
    appendChat('user', q);
    const ans = synthesizeAnswer(q);
    // small delay to feel like processing
    setTimeout(()=> appendChat('bot', ans), 250);
    assistantInput.value = '';
  });

  // assistant open/close
  toggleAssistant && toggleAssistant.addEventListener('click', () => {
    assistant.classList.toggle('drawer-visible');
    assistant.classList.toggle('drawer-hidden');
  });
  closeAssistant && closeAssistant.addEventListener('click', () => {
    assistant.classList.add('drawer-hidden');
    assistant.classList.remove('drawer-visible');
  });

  // Preload a simple placeholder profile image (data URL)
  const profileImg = document.getElementById('profile-image');
  if(profileImg){
    // small SVG data URL placeholder; replace with your real image if you have one
    const svg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
        <rect fill='#06b6d4' width='100%' height='100%' rx='16'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='44' fill='white'>SF</text>
      </svg>`);
    profileImg.src = 'data:image/svg+xml;charset=UTF-8,' + svg;
  }

  // Debug console log
  console.log('SecureShell loaded. Knowledge items:', knowledge.map(k=>k.title));
})();