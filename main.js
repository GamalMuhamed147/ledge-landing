/* ─── NAV SCROLL ───────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ─── MOBILE NAV ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navCta    = document.getElementById('nav-cta-btn');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navCta.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navCta.classList.remove('open');
}));

/* ─── SCROLL REVEAL ─────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─────────────────────────────────────── */
function animateCounter(el, target, suffix = '') {
  let begin = null;
  const dur = 1800;

  const step = ts => {
    if (!begin) begin = ts;
    const p = Math.min((ts - begin) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);

    el.textContent = Math.floor(ease * target) + suffix;

    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target + suffix;
    }
  };

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.count === '100' ? '%+' : '+';

      animateCounter(el, target, suffix);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ─── FORM SUBMIT (WEB3FORMS) ───────────────────────────────── */
document.getElementById('submit-btn').addEventListener('click', async function (e) {
  e.preventDefault();

  const btn = this;

  const nameInput = document.querySelector('input[placeholder="Ahmed Al Mansoori"]');
  const companyInput = document.querySelector('input[placeholder="Your Company LLC"]');
  const emailInput = document.querySelector('input[type="email"]');
  const phoneInput = document.querySelector('input[type="tel"]');
  const interestSelect = document.querySelector('select');
  const messageTextarea = document.querySelector('textarea');

  const formData = {
    access_key: "394efb9c-5993-4a88-887f-b67ada3760ef",
    subject: "New Ledge Lead",
    from_name: "Ledge Website",
    name: nameInput.value.trim(),
    company: companyInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    interest: interestSelect.value,
    message: messageTextarea.value.trim(),
  };

  // Basic validation
  if (!formData.name || !formData.email) {
    alert("Please enter your name and email.");
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.textContent = "Sending...";

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.success) {
      btn.textContent = "✓ Request Sent Successfully";
      btn.style.background = "linear-gradient(135deg,#4a7c4e,#2d5430)";
      btn.style.color = "#e8f5e9";

      // Optional: clear fields after success
      nameInput.value = "";
      companyInput.value = "";
      emailInput.value = "";
      phoneInput.value = "";
      interestSelect.value = "";
      messageTextarea.value = "";
    } else {
      throw new Error(data.message || "Submission failed");
    }
  } catch (err) {
    btn.textContent = "Error — Try Again";
    btn.style.background = "#8b2c2c";
    btn.style.color = "#ffffff";
    console.error("Web3Forms error:", err);
  }

  setTimeout(() => {
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2.5"
           stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
      Request Your Free Demo
    `;
    btn.disabled = false;
    btn.style.background = "";
    btn.style.color = "";
  }, 4000);
});

/* ─── HERO ORB PARALLAX ─────────────────────────────────────── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const factor = (i + 1) * 0.4;
    orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
  });
});
