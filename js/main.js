    function openModal(src, title) {
      document.getElementById('modalImage').src = src;
      document.getElementById('modalCaption').textContent = title;
      document.getElementById('posterModal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeModal() {
      document.getElementById('posterModal').classList.remove('active');
      document.body.style.overflow = '';
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    /* ==================== SCROLL REVEAL ==================== */
    const revealTargets = document.querySelectorAll('.reveal-up, .reveal-scale, .minimal-card, .org-card-modern, .gallery-grid-item');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));

    /* ==================== POSTER GRID STAGGER ==================== */
    document.querySelectorAll('#posterGrid .poster-item').forEach((el, i) => {
      el.style.transitionDelay = (i % 8) * 0.06 + 's';
    });

    /* ==================== COUNT-UP ==================== */
    const countEls = document.querySelectorAll('.count-up');
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.closest('.hud-panel')) return; // skip HUD — handled by slotObserver (prevent double)
          const target = parseInt(el.getAttribute('data-target'), 10) || 0;
          let current = 0;
          const duration = 900;
          const start = performance.now();
          function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            current = Math.floor(progress * target);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach(el => countObserver.observe(el));

    /* ==================== LANGUAGE BAR FILL ==================== */
    const langBars = document.querySelectorAll('.lang-bar-fill');
    const langObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width') + '%';
          langObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    langBars.forEach(el => langObserver.observe(el));

    /* ==================== LANGUAGE SHOW MORE ==================== */
    const langMoreBtn = document.getElementById('langMoreBtn');
    const langMoreLabel = document.getElementById('langMoreLabel');
    const langMoreIcon = document.getElementById('langMoreIcon');
    const langExtras = document.querySelectorAll('#langList .lang-extra');
    if (langMoreBtn) {
      langMoreBtn.addEventListener('click', () => {
        const expanded = langMoreBtn.getAttribute('data-expanded') === 'true';
        langExtras.forEach(item => {
          if (!expanded) {
            item.classList.remove('hidden');
            const bar = item.querySelector('.lang-bar-fill');
            requestAnimationFrame(() => { bar.style.width = bar.getAttribute('data-width') + '%'; });
          } else {
            item.classList.add('hidden');
          }
        });
        langMoreBtn.setAttribute('data-expanded', String(!expanded));
        langMoreLabel.textContent = !expanded ? 'Tampilkan lebih sedikit' : 'Lihat semua bahasa';
        langMoreIcon.style.transform = !expanded ? 'rotate(180deg)' : '';
      });
    }

    /* ==================== POSTER SHOW MORE ==================== */
    const posterMoreBtn = document.getElementById('posterMoreBtn');
    const posterMoreLabel = document.getElementById('posterMoreLabel');
    const posterMoreIcon = document.getElementById('posterMoreIcon');
    const posterExtras = document.querySelectorAll('#posterGrid .poster-extra');
    if (posterMoreBtn) {
      posterMoreBtn.addEventListener('click', () => {
        const expanded = posterMoreBtn.getAttribute('data-expanded') === 'true';
        posterExtras.forEach((item, i) => {
          if (!expanded) {
            item.classList.remove('hidden');
            item.style.transitionDelay = (i % 8) * 0.06 + 's';
            requestAnimationFrame(() => item.classList.add('is-visible'));
          } else {
            item.classList.add('hidden');
            item.classList.remove('is-visible');
          }
        });
        posterMoreBtn.setAttribute('data-expanded', String(!expanded));
        posterMoreLabel.textContent = !expanded ? 'TAMPILKAN LEBIH SEDIKIT' : 'LIHAT SELENGKAPNYA';
        posterMoreIcon.style.transform = !expanded ? 'rotate(180deg)' : '';
      });
    }

    /* ==================== POSTER TILT ON HOVER ==================== */
    const posterItems = document.querySelectorAll('#posterGrid .poster-item');
    if (window.matchMedia('(hover: hover)').matches) {
      posterItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          item.style.transform = `translateY(-6px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
        });
        item.addEventListener('mouseleave', () => { item.style.transform = ''; });
      });
    }

    /* ==================== PROFILE CARD TILT + GLARE + MAGNETIC (BRUTALISM LEVEL UP) ==================== */
    const profileCard = document.getElementById('profileCard');
    const tiltGlare = profileCard ? profileCard.querySelector('.tilt-glare') : null;
    // Header parallax shapes
    const parallaxShapes = document.querySelectorAll('#headerParallax .parallax-shape');
    const headerSection = document.getElementById('home');
    if (profileCard && window.matchMedia('(hover: hover)').matches) {
      profileCard.addEventListener('mousemove', (e) => {
        const rect = profileCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        profileCard.style.transform = `perspective(700px) rotateX(${y * -14}deg) rotateY(${x * 14}deg) translateZ(22px)`;
        if (tiltGlare) {
          const px = ((e.clientX - rect.left) / rect.width) * 100;
          const py = ((e.clientY - rect.top) / rect.height) * 100;
          tiltGlare.style.opacity = '0.75';
          tiltGlare.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.9), rgba(255,255,255,0.15) 22%, transparent 58%)`;
        }
      });
      profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = '';
        if (tiltGlare) tiltGlare.style.opacity = '0';
      });
    }
    // Header global parallax — throttled rAF, reduced depth
    if (headerSection && window.matchMedia('(hover: hover)').matches) {
      let ticking = false, lastE = null;
      headerSection.addEventListener('mousemove', (e) => {
        lastE = e;
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(()=>{
            const rect = headerSection.getBoundingClientRect();
            const cx = (lastE.clientX - rect.left) / rect.width - 0.5;
            const cy = (lastE.clientY - rect.top) / rect.height - 0.5;
            parallaxShapes.forEach((el, i) => {
              const depth = (i + 1) * 4;
              el.style.transform = `translate(${cx * depth}px, ${cy * depth}px)`;
            });
            ticking = false;
          });
        }
      });
      headerSection.addEventListener('mouseleave', () => {
        parallaxShapes.forEach(el => el.style.transform = '');
      });
    }
    // Magnetic for badges & social inside profile
    document.querySelectorAll('#profileCard .magnetic, #profileCard .neo-btn').forEach(el => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width/2)) * 0.28;
        const dy = (e.clientY - (r.top + r.height/2)) * 0.28;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
    // Magnetic pills — bouncy
    document.querySelectorAll('.magnetic-pill').forEach(el => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width/2)) * 0.32;
        const dy = (e.clientY - (r.top + r.height/2)) * 0.34;
        el.style.transform = `translate(${dx}px, ${dy}px) translateY(-4px) scale(1.03)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      el.addEventListener('click', () => {
        el.style.transform = 'translate(3px,3px) scale(0.96)';
        setTimeout(() => el.style.transform = '', 140);
      });
    });

    /* ==================== GALLERY SHOW ALL ==================== */
    const galleryMoreBtn = document.getElementById('galleryMoreBtn');
    const galleryMoreLabel = document.getElementById('galleryMoreLabel');
    const galleryMoreIcon = document.getElementById('galleryMoreIcon');
    const galleryGrid = document.getElementById('galleryGrid');
    if (galleryMoreBtn && galleryGrid) {
      galleryMoreBtn.addEventListener('click', () => {
        const expanded = galleryMoreBtn.getAttribute('data-expanded') === 'true';
        if (!expanded) {
          galleryGrid.classList.remove('hidden');
          galleryGrid.querySelectorAll('.gallery-grid-item').forEach((el, i) => {
            el.style.transitionDelay = (i % 4) * 0.05 + 's';
            requestAnimationFrame(() => el.classList.add('is-visible'));
          });
          galleryMoreLabel.textContent = 'HIDE GALLERY';
          galleryMoreIcon.style.transform = 'rotate(180deg)';
          galleryMoreBtn.setAttribute('data-expanded', 'true');
          // smooth scroll to grid
          galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          galleryGrid.classList.add('hidden');
          galleryGrid.querySelectorAll('.gallery-grid-item').forEach(el => el.classList.remove('is-visible'));
          galleryMoreLabel.textContent = 'SHOW ALL GALLERY';
          galleryMoreIcon.style.transform = '';
          galleryMoreBtn.setAttribute('data-expanded', 'false');
        }
      });
    }

    /* ==================== HEADLINE GLITCH: SCRAMBLE ON LOAD + HOVER ==================== */
    const glitchEl = document.getElementById('glitchHeadline');
    if (glitchEl) {
      const finalText = glitchEl.textContent;
      const chars = "▓█▒░/<>#";
      let scrambleDone = false;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !scrambleDone) {
            scrambleDone = true;
            let iter = 0;
            const total = finalText.length;
            const interval = setInterval(() => {
              glitchEl.textContent = finalText.split('').map((c,i) => {
                if (i < iter) return finalText[i];
                if (c === ' ') return ' ';
                return chars[Math.floor(Math.random()*chars.length)];
              }).join('');
              iter += 1.2;
              if (iter >= total+2) {
                clearInterval(interval);
                glitchEl.textContent = finalText;
              }
            }, 38);
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      io.observe(glitchEl);
      glitchEl.addEventListener('mouseenter', () => {
        glitchEl.classList.add('glitch-hover');
        // shake headline
        const h2 = glitchEl.closest('.brutal-headline');
        if (h2) { h2.style.transform = 'translate(-3px,-3px)'; setTimeout(()=> h2.style.transform='', 160); }
        setTimeout(() => glitchEl.classList.remove('glitch-hover'), 520);
      });
      // auto glitch loop — tiap 7s keluar, 1s kemudian masuk (scramble)
      function scrambleTo(text, fromText) {
        const chars = "▓█▒░/<>#";
        let iter = 0;
        const total = text.length;
        return new Promise(resolve=>{
          const iv = setInterval(()=>{
            glitchEl.textContent = text.split('').map((c,i)=>{
              if(c===' ') return ' ';
              if(i < iter) return text[i];
              return chars[Math.floor(Math.random()*chars.length)];
            }).join('');
            glitchEl.setAttribute('data-text', glitchEl.textContent);
            iter += 1.4;
            if(iter >= total+2){ clearInterval(iv); glitchEl.textContent = text; glitchEl.setAttribute('data-text', text); resolve(); }
          }, 32);
        });
      }
      setInterval(async ()=>{
        glitchEl.classList.add('glitch-hover');
        const chars = "▓█▒░/<>#";
        // keluar: scramble ke random
        let iter = 0;
        const cur = glitchEl.textContent;
        await new Promise(res=>{
          const iv = setInterval(()=>{
            glitchEl.textContent = cur.split('').map((c,i)=>{
              if(c===' ') return ' ';
              return chars[Math.floor(Math.random()*chars.length)];
            }).join('');
            iter++;
            if(iter>6){ clearInterval(iv); res(); }
          }, 28);
        });
        glitchEl.classList.remove('glitch-hover');
        setTimeout(async ()=>{
          glitchEl.classList.add('glitch-hover');
          await scrambleTo(finalText, glitchEl.textContent);
          setTimeout(()=> glitchEl.classList.remove('glitch-hover'), 380);
        }, 1000);
      }, 7000);
    }

    // Head underline grow
    const headUnderline = document.querySelector('.head-underline');
    if (headUnderline) {
      const io2 = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){ headUnderline.style.width='100%'; io2.unobserve(entry.target); }
        });
      }, {threshold:0.5});
      io2.observe(headUnderline);
    }

    /* ==================== CYBER GAMING HUD — TYPEWRITER + MATRIX + SLOT + TERMINAL MODAL ==================== */
    // Typewriter
    const tw = document.getElementById('typewriter');
    if (tw) {
      const phrases = ["loading skills --inventory", "player: IKInecro // LVL 17", "17 items • legendary • online"];
      let pi = 0, ci = 0, deleting = false;
      function type() {
        const cur = phrases[pi];
        if (!deleting) {
          tw.textContent = cur.slice(0, ci+1);
          ci++;
          if (ci === cur.length) { deleting = true; setTimeout(type, 1600); return; }
        } else {
          tw.textContent = cur.slice(0, ci-1);
          ci--;
          if (ci === 0) { deleting = false; pi = (pi+1)%phrases.length; }
        }
        setTimeout(type, deleting ? 28 : 48);
      }
      type();
    }
    // Matrix rain — primitive 8fps + ultra light
    const canvas = document.getElementById('matrixCanvas');
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ctx = canvas.getContext('2d', { alpha: true });
      let w, h, cols, ypos, rafId, lastDraw = 0, visible = false;
      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1);
        w = canvas.width = rect.width * dpr;
        h = canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr,0,0,dpr,0,0);
        cols = Math.floor(rect.width / 22);
        ypos = Array(cols).fill(0).map(()=> Math.random()*rect.height*0.6);
      }
      resize();
      window.addEventListener('resize', resize);
      const ioMatrix = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ visible = e.isIntersecting; if(visible && !rafId) { lastDraw=0; rafId = requestAnimationFrame(draw); } else if(!visible && rafId){ cancelAnimationFrame(rafId); rafId=null; } });
      }, {threshold:0.01});
      ioMatrix.observe(canvas.parentElement);
      const chars = "01";
      function draw(now){
        if(!visible) { rafId=null; return; }
        if(now - lastDraw < 125) { rafId = requestAnimationFrame(draw); return; } // 8fps
        lastDraw = now;
        ctx.fillStyle = "rgba(13,17,23,0.22)";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle = "#06B6D4";
        ctx.font = "10px JetBrains Mono";
        ypos.forEach((y, i) => {
          if(Math.random() > 0.72) return;
          const text = chars[Math.floor(Math.random()*chars.length)];
          ctx.fillText(text, i*22, y);
          if (y > h/1.5 && Math.random() > 0.97) ypos[i]=0; else ypos[i]=y+14;
        });
        rafId = requestAnimationFrame(draw);
      }
    }
    // Slot machine count-up (override previous)
    const slotEls = document.querySelectorAll('.hud-panel .count-up');
    const slotObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target'),10)||0;
          let cur = 0;
          const isZero = target===0;
          el.style.opacity='0.7';
          const start = performance.now();
          const dur = 1100;
          function step(now){
            const p = Math.min((now-start)/dur,1);
            const eased = 1 - Math.pow(1-p, 3);
            const val = isZero ? (p<1 ? Math.floor(Math.random()*9) : 0) : Math.floor(eased*target);
            el.textContent = val;
            if(p<1) requestAnimationFrame(step);
            else { el.textContent = target; el.style.opacity='1'; }
          }
          requestAnimationFrame(step);
          slotObserver.unobserve(el);
        }
      });
    }, {threshold:0.4});
    slotEls.forEach(el=>slotObserver.observe(el));

    // Terminal modal for HUD panels
    let termModal = document.getElementById('termModal');
    if (!termModal) {
      termModal = document.createElement('div');
      termModal.id = 'termModal';
      termModal.className = 'term-modal fixed inset-0 bg-black/75 backdrop-blur-sm z-50 items-center justify-center p-4';
      termModal.innerHTML = `
        <div class="term-window relative w-full max-w-lg bg-[#0d1117] border border-cyber-cyan/40 rounded-xl overflow-hidden" onclick="event.stopPropagation()">
          <div class="flex items-center justify-between px-4 py-2 bg-[#0f1623] border-b border-cyber-purple/30">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span><span class="w-3 h-3 rounded-full bg-yellow-500"></span><span class="w-3 h-3 rounded-full bg-green-500"></span>
              <span id="termTitle" class="ml-3 font-mono text-xs text-cyber-cyan">> inspect</span>
            </div>
            <button onclick="document.getElementById('termModal').classList.remove('active')" class="text-gray-400 hover:text-white font-mono text-xs">CLOSE [×]</button>
          </div>
          <div id="termBody" class="p-5 font-mono text-sm leading-relaxed text-gray-300"></div>
        </div>`;
      termModal.addEventListener('click', ()=> termModal.classList.remove('active'));
      document.body.appendChild(termModal);
      document.addEventListener('keydown', e=>{ if(e.key==='Escape') termModal.classList.remove('active'); });
    }
    function openTerm(title, body){
      document.getElementById('termTitle').textContent = title;
      document.getElementById('termBody').innerHTML = body;
      termModal.classList.add('active');
    }
    // Stats click
    document.querySelectorAll('.hud-panel .stat-pop').forEach(el=>{
      el.addEventListener('click', ()=>{
        const label = el.querySelector('.count-up')?.getAttribute('data-target') || '';
        const name = el.textContent.trim().split('\n')[0] || 'STAT';
        openTerm('> inspect --player STATS', `<div class="text-cyber-cyan">> STATS // ${name}</div><div class="mt-2 text-gray-400">Value: <span class="text-white">${label}</span> • Rarity: <span class="text-amber-400">EPIC</span></div><div class="mt-3 h-2 bg-gray-800 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple" style="width:${Math.min(parseInt(label)*7+20,100)}%"></div></div><div class="mt-3 text-xs text-gray-500">Tip: hover for RGB breathing, click for equip.</div>`);
      });
    });
    // Lang click
    document.querySelectorAll('#langList > div').forEach(el=>{
      el.style.cursor='pointer';
      el.addEventListener('click', ()=>{
        const lang = el.querySelector('span')?.textContent || 'LANG';
        const pct = el.querySelector('.lang-bar-fill')?.getAttribute('data-width') || '0';
        openTerm('> cat lang --xp', `<div class="text-cyber-cyan">> ${lang}.json</div><pre class="mt-2 bg-black/40 border border-white/10 rounded p-3 text-xs text-gray-300">{
  "language": "${lang}",
  "xp": "${pct}%",
  "level": "${pct>75?'Expert':pct>50?'Advanced':'Intermediate'}",
  "status": "equipped"
}</pre>`);
      });
    });
    // Repo click override: show term then allow link
    document.querySelectorAll('.hud-panel a.group').forEach(el=>{
      el.addEventListener('click', (e)=>{
        // if ctrl/cmd, let open link
        if(e.ctrlKey || e.metaKey) return;
        const title = el.querySelector('.font-mono.truncate')?.textContent || el.textContent.trim().slice(0,20);
        const href = el.getAttribute('href');
        openTerm('> open quest --log', `<div class="text-cyber-cyan">> QUEST: ${title}</div><div class="mt-2 text-gray-400">Rarity: <span class="text-purple-400">QUEST</span> • <a href="${href}" target="_blank" rel="noopener" class="text-cyber-cyan underline">Open GitHub →</a></div><div class="mt-3 text-xs text-gray-500">Click GitHub to deploy.</div>`);
        // don't prevent default? we do modal first, user can click link inside
      });
    });

    // Org parallax interactive
    const orgSection = document.getElementById('organization');
    const orgShapes = document.querySelectorAll('#orgParallax .parallax-org');
    const orgGrid = document.getElementById('orgGrid');
    if (orgSection && window.matchMedia('(hover: hover)').matches) {
      let tickingOrg = false, lastOrgE = null;
      orgSection.addEventListener('mousemove', (e)=>{
        lastOrgE = e;
        if(!tickingOrg){
          tickingOrg = true;
          requestAnimationFrame(()=>{
            const r = orgSection.getBoundingClientRect();
            const cx = (lastOrgE.clientX - r.left)/r.width -0.5;
            const cy = (lastOrgE.clientY - r.top)/r.height -0.5;
            orgShapes.forEach((el,i)=>{
              const d = (i+1)*6;
              el.style.transform = `translate(${cx*d}px, ${cy*d}px) rotate(${cx*6}deg)`;
            });
            if(orgGrid) orgGrid.style.transform = `translate(${cx*10}px, ${cy*10}px)`;
            tickingOrg=false;
          });
        }
      });
      orgSection.addEventListener('mouseleave', ()=>{
        orgShapes.forEach(el=> el.style.transform='');
        if(orgGrid) orgGrid.style.transform='';
      });
    }

