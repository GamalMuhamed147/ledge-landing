(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress + header state ---------- */
  var progress = document.getElementById('progress');
  var header = document.getElementById('siteHeader');
  var heroArt = document.querySelector('.hero-bg-img');
  function onScroll(){
    var h = document.documentElement;
    var scrollTop = h.scrollTop || document.body.scrollTop;
    var scrollH = h.scrollHeight - h.clientHeight;
    progress.style.width = (scrollH > 0 ? (scrollTop/scrollH*100) : 0) + '%';
    header.classList.toggle('scrolled', scrollTop > 40);
    if(heroArt && !reduceMotion && scrollTop < window.innerHeight){
      heroArt.style.transform = 'scale(1.07) translateY(' + (scrollTop * 0.06) + 'px)';
    }
  }
  document.addEventListener('scroll', function(){ requestAnimationFrame(onScroll); }, { passive:true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .bracket');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('in-view'); }
    });
  }, { threshold:0.16 });
  revealEls.forEach(function(el){ io.observe(el); });

  /* ---------- count-up stats ---------- */
  var counters = document.querySelectorAll('.count');
  var countIo = new IntersectionObserver(function(entries, obs){
    entries.forEach(function(entry){
      if(!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.getAttribute('data-target'));
      var divide = parseFloat(el.getAttribute('data-divide')) || 1;
      var decimals = parseInt(el.getAttribute('data-decimals')) || 0;
      var duration = reduceMotion ? 1 : 1600;
      var start = null;
      function step(ts){
        if(start === null) start = ts;
        var p = Math.min((ts - start)/duration, 1);
        var eased = 1 - Math.pow(1-p, 3);
        var val = (target/divide) * eased;
        el.textContent = val.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        if(p < 1){ requestAnimationFrame(step); }
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold:0.5 });
  counters.forEach(function(el){ countIo.observe(el); });

  /* ---------- generic carousel (peek slider: screens + dots, autoplay, swipe) ---------- */
  document.querySelectorAll('.carousel').forEach(function(car){
    var frameBody = car.querySelector('.frame-body');
    var track = car.querySelector('.carousel-track');
    var screens = car.querySelectorAll('.screen');
    if(!screens.length || !track) return;
    var dotsWrap = car.querySelector('.carousel-dots');
    var idx = 0;
    var interval = parseInt(car.getAttribute('data-interval')) || 3000;
    var timer = null;
    /* screen width/gap come from CSS (.screen{ flex:0 0 92%; margin-right:3%; }) —
       JS only reads the resulting box size to compute the slide offset, it never
       sets explicit pixel widths (that previously caused the frame to blow out). */

    screens.forEach(function(s, i){
      var d = document.createElement('button');
      d.className = 'cdot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Show screen ' + (i+1));
      d.addEventListener('click', function(){ go(i); reset(); });
      dotsWrap.appendChild(d);
    });
    var dots = dotsWrap.querySelectorAll('.cdot');

    function layout(){ position(false); }

    function position(animate){
      var first = screens[0];
      var step = first.offsetWidth + (parseFloat(getComputedStyle(first).marginRight) || 0);
      track.style.transition = animate ? '' : 'none';
      track.style.transform = 'translateX(-' + (idx * step) + 'px)';
      if(!animate){ void track.offsetHeight; track.style.transition = ''; }
    }

    function go(i){
      screens[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = (i + screens.length) % screens.length;
      screens[idx].classList.add('active');
      dots[idx].classList.add('active');
      position(true);
    }
    function next(){ go(idx + 1); }
    function start(){ if(reduceMotion) return; timer = setInterval(next, interval); }
    function stop(){ if(timer){ clearInterval(timer); timer = null; } }
    function reset(){ stop(); start(); }

    car.addEventListener('mouseenter', stop);
    car.addEventListener('mouseleave', start);

    window.addEventListener('resize', layout);
    layout();

    /* touch swipe */
    var touchX = null;
    car.addEventListener('touchstart', function(e){ touchX = e.touches[0].clientX; stop(); }, { passive:true });
    car.addEventListener('touchend', function(e){
      if(touchX === null) return;
      var dx = e.changedTouches[0].clientX - touchX;
      if(Math.abs(dx) > 40){ dx < 0 ? go(idx+1) : go(idx-1); }
      touchX = null;
      start();
    }, { passive:true });

    start();
  });

  /* ---------- testimonial slider ---------- */
  var testiSlides = document.querySelectorAll('.testi-slide');
  var testiDotsWrap = document.getElementById('testiDots');
  var tIdx = 0;
  testiSlides.forEach(function(s, i){
    var d = document.createElement('button');
    d.className = 'cdot' + (i === 0 ? ' active' : '');
    d.style.background = i === 0 ? 'var(--crimson)' : 'rgba(42,29,21,0.18)';
    d.addEventListener('click', function(){ tGo(i); tReset(); });
    testiDotsWrap.appendChild(d);
  });
  var tDots = testiDotsWrap.querySelectorAll('.cdot');
  function tGo(i){
    testiSlides[tIdx].classList.remove('active');
    tDots[tIdx].classList.remove('active');
    tDots[tIdx].style.background = 'rgba(42,29,21,0.18)';
    tIdx = (i + testiSlides.length) % testiSlides.length;
    testiSlides[tIdx].classList.add('active');
    tDots[tIdx].classList.add('active');
    tDots[tIdx].style.background = 'var(--crimson)';
  }
  var tTimer = null;
  function tStart(){ if(reduceMotion) return; tTimer = setInterval(function(){ tGo(tIdx+1); }, 5000); }
  function tStop(){ if(tTimer){ clearInterval(tTimer); tTimer = null; } }
  function tReset(){ tStop(); tStart(); }
  document.getElementById('testiWrap').addEventListener('mouseenter', tStop);
  document.getElementById('testiWrap').addEventListener('mouseleave', tStart);
  tStart();

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    var wrap = item.querySelector('.faq-a-wrap');
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(openItem){
        if(openItem !== item){
          openItem.classList.remove('open');
          openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
          openItem.querySelector('.faq-a-wrap').style.maxHeight = null;
        }
      });
      if(isOpen){
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        wrap.style.maxHeight = null;
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        wrap.style.maxHeight = wrap.scrollHeight + 'px';
      }
    });
  });
})();
