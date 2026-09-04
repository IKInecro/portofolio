    /* Loader — 5s white full-screen then fade, header entrance smooth */
    (function() {
      const loader = document.getElementById('loaderOverlay');
      if (!loader) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        loader.style.display = 'none';
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        return;
      }
      const start = Date.now();
      const minDuration = 3500;
      function hide() {
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, minDuration - elapsed);
        setTimeout(() => {
          loader.style.opacity = '0';
          loader.style.visibility = 'hidden';
          // jeda in-out 0.5 detik sebelum header entrance
          setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
            document.body.style.overflow = '';
            document.querySelectorAll('#home .head-fade').forEach((el)=>{
              el.style.animation = 'none';
              el.offsetHeight;
              el.style.animation = '';
            });
          }, 500);
          setTimeout(() => { if (loader.parentNode) loader.remove(); }, 1300);
        }, remaining);
      }
      window.addEventListener('load', hide);
      // fallback if load already fired
      if (document.readyState === 'complete') hide();
      else setTimeout(hide, minDuration + 500);
    })();

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

    /* porto modal removed — samain kayak gallery (posterModal) */

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
              const depth = (i + 1) * 6;
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
    // Magnetic pills — bouncy + idle glitch sequential 3s
    const pillEls = document.querySelectorAll('.magnetic-pill');
    pillEls.forEach(el => {
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
    // Idle glitch berurutan 3s: 5+ YEARS → IOT DEV → OSIS → DESIGNER → loop
    if (pillEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches) {
      let pIdx = 0;
      setInterval(() => {
        pillEls.forEach(p => p.classList.remove('idle-glitch'));
        const el = pillEls[pIdx % pillEls.length];
        // jangan tabrak hover
        if (!el.matches(':hover')) {
          el.classList.add('idle-glitch');
          setTimeout(() => el.classList.remove('idle-glitch'), 420);
        }
        pIdx++;
      }, 3000);
    }

    // Brutal hamburger sticky nav — toggle + idle random 5s cyan+pink glitch
    const hamburger = document.getElementById('brutalHamburger');
    const brutalNavMenu = document.getElementById('brutalNavMenu');
    if (hamburger && brutalNavMenu) {
      hamburger.addEventListener('click', () => {
        const expanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', String(!expanded));
        brutalNavMenu.classList.toggle('hidden', expanded);
      });
      brutalNavMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        brutalNavMenu.classList.add('hidden');
      }));
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !brutalNavMenu.contains(e.target)) {
          hamburger.setAttribute('aria-expanded', 'false');
          brutalNavMenu.classList.add('hidden');
        }
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          hamburger.setAttribute('aria-expanded', 'false');
          brutalNavMenu.classList.add('hidden');
        }
      });
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setInterval(() => {
          if (hamburger.matches(':hover') || hamburger.getAttribute('aria-expanded') === 'true') return;
          const rnd = Math.random();
          if (rnd > 0.85) {
            hamburger.classList.add('idle-glitch');
            setTimeout(() => hamburger.classList.add('idle-shake'), 120);
            setTimeout(() => hamburger.classList.remove('idle-glitch', 'idle-shake'), 520);
          } else {
            const cls = rnd < 0.5 ? 'idle-glitch' : 'idle-shake';
            hamburger.classList.add(cls);
            setTimeout(() => hamburger.classList.remove(cls), cls === 'idle-glitch' ? 460 : 380);
          }
        }, 5000);
      }
      // Nav HOME 3 tipe glitch 1.5s random
      const navHome = document.getElementById('navHome');
      if (navHome && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const homeGlitches = ['idle-glitch1','idle-glitch2','idle-glitch3'];
        setInterval(() => {
          if (navHome.matches(':hover') || brutalNavMenu.classList.contains('hidden')) return;
          const cls = homeGlitches[Math.floor(Math.random()*homeGlitches.length)];
          navHome.classList.add(cls);
          setTimeout(() => navHome.classList.remove(cls), 460);
        }, 1500);
      }
      // Nav PORTFOLIO 3 tipe gerakan idle random 2.8s
      const navPortfolio = document.getElementById('navPortfolio');
      if (navPortfolio && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const portClasses = ['idle-jitter','idle-peel','idle-pulse'];
        setInterval(() => {
          if (navPortfolio.matches(':hover') || brutalNavMenu.classList.contains('hidden')) return;
          const cls = portClasses[Math.floor(Math.random()*portClasses.length)];
          navPortfolio.classList.add(cls);
          setTimeout(() => navPortfolio.classList.remove(cls), 460);
        }, 2800);
      }
    }

    /* ==================== GALLERY 158 — 5x desktop / 2x mobile, batch 25, Vercel-optimized ==================== */
    const galleryMoreBtn = document.getElementById('galleryMoreBtn');
    const galleryMoreLabel = document.getElementById('galleryMoreLabel');
    const galleryMoreIcon = document.getElementById('galleryMoreIcon');
    const galleryMoreCount = document.getElementById('galleryMoreCount');
    const galleryGrid = document.getElementById('galleryGrid');
    const gallerySentinel = document.getElementById('gallerySentinel');
    const galleryLoading = document.getElementById('galleryLoading');
    if (galleryMoreBtn && galleryGrid) {
      const TOTAL = 158, BATCH = 25;
      let shown = 0, expanded = false;
      const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
      // Vercel rendering-content-visibility + lazy decode
      const imgObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            const img = e.target;
            if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); }
            imgObserver.unobserve(img);
          }
        });
      }, { rootMargin: '400px 0px', threshold: 0.01 }) : null;

      function createItem(i) {
        const div = document.createElement('div');
        div.className = 'gallery-grid-item group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-[4/3] cursor-pointer reveal-scale';
        div.style.contentVisibility = 'auto';
        div.style.containIntrinsicSize = '300px 225px';
        div.setAttribute('onclick', `openModal('assets/gallery_act/${i}.webp','Gallery ${i}')`);
        div.innerHTML = `<img data-src="assets/gallery_act/${i}.webp" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='100%25' height='100%25' fill='%23f3f4f6'/%3E%3C/svg%3E" alt="Gallery ${i}" width="400" height="300" loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"><div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><span class="absolute bottom-2 left-2 right-2 text-white font-mono text-[11px] leading-tight opacity-0 group-hover:opacity-100 transition-opacity truncate">Gallery ${i}</span>`;
        return div;
      }

      function addBatch() {
        if (shown >= TOTAL) return;
        if (galleryLoading) galleryLoading.classList.remove('hidden');
        const next = Math.min(shown + BATCH, TOTAL);
        const frag = document.createDocumentFragment();
        for (let i = shown + 1; i <= next; i++) {
          const el = createItem(i);
          el.style.transitionDelay = (i % 5) * 0.04 + 's';
          frag.appendChild(el);
        }
        // Vercel js-batch-dom-css + requestIdleCallback: batch DOM write
        idle(() => {
          galleryGrid.appendChild(frag);
          const newItems = Array.from(galleryGrid.children).slice(shown);
          newItems.forEach(el => {
            const img = el.querySelector('img[data-src]');
            if (img && imgObserver) imgObserver.observe(img);
            requestAnimationFrame(() => el.classList.add('is-visible'));
          });
          // also observe for reveal
          newItems.forEach(el => revealObserver.observe(el));
          shown = next;
          if (galleryMoreCount) galleryMoreCount.textContent = `${shown}/158`;
          if (shown >= TOTAL) {
            galleryMoreLabel.textContent = 'TAMPILKAN LEBIH SEDIKIT';
            galleryMoreIcon.style.transform = 'rotate(180deg)';
            galleryMoreBtn.setAttribute('data-expanded', 'true');
            if (galleryLoading) galleryLoading.classList.add('hidden');
            if (gallerySentinel) gallerySentinel.style.display = 'none';
          } else {
            galleryMoreLabel.textContent = `LIHAT SELENGKAPNYA (+${Math.min(BATCH, TOTAL - shown)})`;
            if (galleryLoading) galleryLoading.classList.add('hidden');
          }
        });
      }

      galleryMoreBtn.addEventListener('click', () => {
        if (!expanded) {
          galleryGrid.classList.remove('hidden');
          expanded = true;
          galleryMoreBtn.setAttribute('data-expanded', 'true');
          if (shown === 0) addBatch();
          galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (shown >= TOTAL) {
          // collapse
          galleryGrid.classList.add('hidden');
          galleryGrid.innerHTML = '';
          shown = 0; expanded = false;
          galleryMoreBtn.setAttribute('data-expanded', 'false');
          galleryMoreLabel.textContent = 'LIHAT SELENGKAPNYA';
          if (galleryMoreCount) galleryMoreCount.textContent = '0/158';
          galleryMoreIcon.style.transform = '';
          if (gallerySentinel) gallerySentinel.style.display = '';
          window.scrollTo({ top: galleryGrid.offsetTop - 80, behavior: 'smooth' });
        } else {
          addBatch();
        }
      });

      // Manual only: 25 per klik, tidak auto-load (user harus tekan LIHAT SELENGKAPNYA)
      // sentinel tetap ada untuk spacing, tapi observer dimatikan sesuai request
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
    // Matrix rain — Vercel cheap, disable on mobile/reduced-motion
    const canvas = document.getElementById('matrixCanvas');
    if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover: hover)').matches) {
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

    // Org parallax interactive — Vercel optimized (reduced-motion + cheaper depth)
    const orgSection = document.getElementById('organization');
    const orgShapes = document.querySelectorAll('#orgParallax .parallax-org');
    const orgGrid = document.getElementById('orgGrid');
    if (orgSection && window.matchMedia('(hover: hover)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
              const d = (i+1)*3; // halve depth 6→3
              el.style.transform = `translate(${cx*d}px, ${cy*d}px)`;
            });
            if(orgGrid) orgGrid.style.transform = `translate(${cx*6}px, ${cy*6}px)`; // halve 10→6
            tickingOrg=false;
          });
        }
      }, { passive: true });
      orgSection.addEventListener('mouseleave', ()=>{
        orgShapes.forEach(el=> el.style.transform='');
        if(orgGrid) orgGrid.style.transform='';
      });
    }

