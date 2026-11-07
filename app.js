/**
 * CHRISTIAN ENGAGEMENT INVITATION — JAVASCRIPT
 * Dhanya & Arun · Holy Betrothal · 28 December 2026 · Manjeri, Kerala
 * Features 2 Endpoints:
 * - Endpoint 1 (Root / #invite): Fullscreen Invitation Card Open Animation
 * - Endpoint 2 (#main): Direct Plain-Page Engagement Experience with Scroll to Discover
 */

(function () {
  "use strict";

  // ==========================================
  // CONFIGURATION
  // ==========================================
  const CONFIG = {
    couple: "Dhanya & Arun",
    engagementDateISO: "2026-12-28T10:30:00+05:30",
    locations: {
      ceremony: "St Mary's Church, Payyanad, Manjeri, Kerala",
      reception: "Jayasri Auditorium, Manjeri, Kerala"
    },
    shareTitle: "Dhanya & Arun — Holy Betrothal & Engagement Invitation",
    shareText: "We cordially invite you to celebrate our Holy Betrothal & Engagement! 28 December 2026 at 10:30 AM · Manjeri, Kerala."
  };

  // ==========================================
  // 1. 2-ENDPOINT ROUTING LOGIC
  // ==========================================
  const entranceScreen = document.getElementById("entranceScreen");
  const invitationCard = document.getElementById("invitationCard");
  const openCardBtn = document.getElementById("openCardBtn");
  const replayCardBtn = document.getElementById("replayCardBtn");
  const heroSection = document.getElementById("home");
  const cardCoverFlap = document.getElementById("cardCoverFlap");
  const enterWebsiteBtn = document.getElementById("enterWebsiteBtn");

  function checkRoute() {
    const hash = window.location.hash.toLowerCase();
    const urlParams = new URLSearchParams(window.location.search);
    
    // Endpoint 2: Direct Main Website Access (#main or ?view=main)
    if (hash === "#main" || urlParams.get("view") === "main") {
      entranceScreen.classList.add("opened");
      entranceScreen.classList.remove("curtain-lifting");
      document.body.style.overflow = "auto";
      if (heroSection) {
        heroSection.classList.add("hero-revealing");
      }
    } else {
      // Endpoint 1: Card Open Animation Screen (#invite or default root)
      entranceScreen.classList.remove("opened", "curtain-lifting");
      invitationCard.classList.remove("is-open", "is-entering");
      document.body.style.overflow = "hidden";
      if (heroSection) {
        heroSection.classList.remove("hero-revealing");
      }
    }
  }

  // Check on load
  checkRoute();
  window.addEventListener("hashchange", checkRoute);

  // ==========================================
  // METALLIC FOIL & PASTEL PALETTE SWITCHER
  // ==========================================
  const themeButtons = document.querySelectorAll(".theme-pill-btn");
  // Default to Mulberry Plum with rich velvet gradient
  const rawTheme = localStorage.getItem("preferred_pastel_theme");
  const savedTheme = (rawTheme === "gold" || !rawTheme) ? "mulberry" : rawTheme;

  function applyPastelTheme(themeName) {
    entranceScreen.classList.remove(
      "theme-gold", "theme-rosegold", "theme-bronze", "theme-mulberry", "theme-sapphire",
      "theme-blush", "theme-sage", "theme-champagne", "theme-powder-blue"
    );
    entranceScreen.classList.add(`theme-${themeName}`);

    themeButtons.forEach(btn => {
      if (btn.dataset.theme === themeName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    localStorage.setItem("preferred_pastel_theme", themeName);
  }

  applyPastelTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      applyPastelTheme(btn.dataset.theme);
    });
  });

  // ==========================================
  // 3D REALISTIC FOLDED INVITATION CARD OPENING
  // ==========================================
  let isOpeningInProgress = false;
  let autoEnterTimer = null;

  function openCard() {
    if (isOpeningInProgress) return;
    isOpeningInProgress = true;

    // 1. Play song with smooth luxury volume fade-in
    playMusic();

    // 2. Physically OPEN the 3D card flap in full perspective!
    invitationCard.classList.add("is-open");

    // Dual particle celebrations
    const sealElem = document.querySelector(".card-seal-badge");
    const sealRect = sealElem ? sealElem.getBoundingClientRect() : openCardBtn.getBoundingClientRect();
    spawnSparkleBurst(sealRect.left + sealRect.width / 2, sealRect.top + sealRect.height / 2, 45);

    setTimeout(() => {
      const cardRect = invitationCard.getBoundingClientRect();
      spawnSparkleBurst(cardRect.left + cardRect.width * 0.45, cardRect.top + cardRect.height * 0.5, 30);
    }, 450);

    // 3. Auto-transition to main website after giving guest 5 seconds to appreciate the opened card
    autoEnterTimer = setTimeout(() => {
      enterWebsite();
    }, 5000);
  }

  function enterWebsite() {
    if (autoEnterTimer) clearTimeout(autoEnterTimer);
    invitationCard.classList.add("is-entering");
    entranceScreen.classList.add("curtain-lifting");
    if (heroSection) {
      heroSection.classList.add("hero-revealing");
    }

    setTimeout(() => {
      entranceScreen.classList.add("opened");
      document.body.style.overflow = "auto";
      history.replaceState(null, "", "#main");
      isOpeningInProgress = false;
    }, 950);
  }

  openCardBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    openCard();
  });

  if (cardCoverFlap) {
    cardCoverFlap.addEventListener("click", () => {
      if (!invitationCard.classList.contains("is-open")) {
        openCard();
      }
    });
  }

  if (enterWebsiteBtn) {
    enterWebsiteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enterWebsite();
    });
  }

  if (replayCardBtn) {
    replayCardBtn.addEventListener("click", () => {
      if (autoEnterTimer) clearTimeout(autoEnterTimer);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        entranceScreen.classList.remove("opened", "curtain-lifting");
        invitationCard.classList.remove("is-open", "is-entering");
        if (heroSection) {
          heroSection.classList.remove("hero-revealing");
        }
        document.body.style.overflow = "hidden";
        history.replaceState(null, "", "#invite");
        isOpeningInProgress = false;
      }, 350);
    });
  }

  // ==========================================
  // 2. AUDIO SYSTEM WITH SMOOTH FADE-IN
  // ==========================================
  const song = document.getElementById("bgSong");
  const musicToggle = document.getElementById("musicToggle");
  let musicStarted = false;
  let fadeInterval = null;

  async function playMusic() {
    try {
      if (fadeInterval) clearInterval(fadeInterval);
      song.volume = 0;
      await song.play();
      musicToggle.classList.add("playing");
      musicToggle.setAttribute("aria-label", "Pause background song");
      musicStarted = true;

      // Gentle volume ramp up to 0.75 over 1.4s
      let currentVol = 0;
      const targetVol = 0.75;
      const step = 0.05;
      fadeInterval = setInterval(() => {
        currentVol = Math.min(targetVol, currentVol + step);
        song.volume = currentVol;
        if (currentVol >= targetVol) {
          clearInterval(fadeInterval);
          fadeInterval = null;
        }
      }, 70);
    } catch (err) {
      console.log("Audio waiting for user gesture.");
    }
  }

  function pauseMusic() {
    song.pause();
    musicToggle.classList.remove("playing");
    musicToggle.setAttribute("aria-label", "Play background song");
  }

  musicToggle.addEventListener("click", () => {
    if (song.paused) {
      playMusic();
    } else {
      pauseMusic();
    }
  });

  // Activate audio on first user touch/click anywhere on document
  function firstGesture() {
    if (!musicStarted) {
      playMusic();
    }
    document.removeEventListener("pointerdown", firstGesture);
  }
  document.addEventListener("pointerdown", firstGesture, { once: true, passive: true });

  // ==========================================
  // 3. FALLING FLORAL PETALS & GOLD DUST CANVAS
  // ==========================================
  const petalsCanvas = document.getElementById("petalsCanvas");
  const pCtx = petalsCanvas.getContext("2d");
  let pW, pH;
  const particles = [];
  const TOTAL_PARTICLES = 26;

  function resizePetals() {
    pW = petalsCanvas.width = window.innerWidth;
    pH = petalsCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizePetals);
  resizePetals();

  class PetalParticle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * pW;
      this.y = initial ? Math.random() * pH : -30;
      this.size = 11 + Math.random() * 14;
      this.speedY = 0.6 + Math.random() * 1.1;
      this.speedX = Math.sin(Math.random() * Math.PI) * 0.7;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.type = Math.random() > 0.45 ? "rosePetal" : "goldDust";
      this.opacity = 0.25 + Math.random() * 0.45;
    }

    update() {
      if (this.isBurst) {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vy += 0.08; // subtle romantic gravity
        this.rotation += this.rotSpeed;
        this.opacity -= 0.012;
        return (this.opacity > 0);
      }

      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.6;
      this.rotation += this.rotSpeed;

      if (this.y > pH + 30) {
        this.reset();
      }
      return true;
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = Math.max(0, this.opacity);

      if (this.type === "rosePetal") {
        ctx.fillStyle = "#e08d9b";
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.5, this.size, Math.PI / 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#dfc48c";
        ctx.beginPath();
        ctx.arc(0, 0, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < TOTAL_PARTICLES; i++) {
    particles.push(new PetalParticle());
  }

  function animatePetals() {
    pCtx.clearRect(0, 0, pW, pH);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const alive = p.update();
      if (!alive && p.isBurst) {
        particles.splice(i, 1);
        continue;
      }
      p.draw(pCtx);
    }
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  function spawnSparkleBurst(cx, cy, count = 45) {
    for (let i = 0; i < count; i++) {
      const p = new PetalParticle();
      p.x = cx;
      p.y = cy;
      p.isBurst = true;
      const angle = Math.random() * Math.PI * 2;
      const speed = 2.5 + Math.random() * 8.5;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.2;
      p.rotSpeed = (Math.random() - 0.5) * 0.12;
      p.opacity = 0.85 + Math.random() * 0.15;
      p.size = 8 + Math.random() * 12;
      p.type = Math.random() > 0.4 ? "rosePetal" : "goldDust";
      particles.push(p);
    }
  }

  // ==========================================
  // 4. INTERACTIVE HOLY BETROTHAL CANDLE LIGHTING (DATE REVEAL)
  // ==========================================
  const candleAltarCard = document.getElementById("candleAltarCard");
  const candlesPedestal = document.getElementById("candlesPedestal");

  let isCandleLit = false;

  function lightSacredCandles() {
    if (isCandleLit) return;
    isCandleLit = true;

    // Gentle tactile haptics
    if (navigator.vibrate) {
      try { navigator.vibrate([40, 60, 140]); } catch (e) {}
    }

    if (candleAltarCard) {
      candleAltarCard.classList.add("is-lit");
    }

    // Sparkle burst emanating from the center of the candles
    const rect = candleAltarCard ? candleAltarCard.getBoundingClientRect() : null;
    const burstX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const burstY = rect ? rect.top + rect.height * 0.45 : window.innerHeight * 0.55;
    spawnSparkleBurst(burstX, burstY);
  }

  // Trigger when candle pedestal or altar is tapped / clicked
  if (candlesPedestal) {
    candlesPedestal.addEventListener("click", lightSacredCandles);
  }
  if (candleAltarCard) {
    candleAltarCard.addEventListener("click", lightSacredCandles);
  }

  // ==========================================
  // 5. PHOTO LIGHTBOX POPUP MODAL
  // ==========================================
  const photoLightbox = document.getElementById("photoLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxTag = document.getElementById("lightboxTag");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeLightboxBtn = document.getElementById("closeLightboxBtn");
  const polaroidCards = document.querySelectorAll(".polaroid-card");

  function openPhotoLightbox(card) {
    const img = card.querySelector(".polaroid-img-box img");
    const tag = card.querySelector(".polaroid-tag");
    const caption = card.querySelector(".polaroid-caption");

    if (img && photoLightbox) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "Couple Photo";
      if (lightboxTag) lightboxTag.textContent = tag ? tag.textContent : "";
      if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : "";
      
      photoLightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closePhotoLightbox() {
    if (photoLightbox) {
      photoLightbox.classList.remove("is-open");
      document.body.style.overflow = "auto";
    }
  }

  polaroidCards.forEach(card => {
    card.addEventListener("click", () => openPhotoLightbox(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPhotoLightbox(card);
      }
    });
  });

  if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener("click", closePhotoLightbox);
  }

  if (photoLightbox) {
    photoLightbox.addEventListener("click", (e) => {
      if (e.target === photoLightbox) {
        closePhotoLightbox();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && photoLightbox && photoLightbox.classList.contains("is-open")) {
      closePhotoLightbox();
    }
  });

  // ==========================================
  // 6. LIVE COUNTDOWN TIMER & CALENDAR SYNC
  // ==========================================
  const targetTime = new Date(CONFIG.engagementDateISO).getTime();
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMinutes = document.getElementById("cdMinutes");
  const cdSeconds = document.getElementById("cdSeconds");

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetTime - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    cdDays.textContent = String(days).padStart(2, "0");
    cdHours.textContent = String(hours).padStart(2, "0");
    cdMinutes.textContent = String(minutes).padStart(2, "0");
    cdSeconds.textContent = String(seconds).padStart(2, "0");
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Google Calendar Link
  const googleCalBtn = document.getElementById("googleCalBtn");
  const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Dhanya & Arun's Holy Betrothal & Engagement")}&dates=20261228T050000Z/20261228T103000Z&details=${encodeURIComponent("With joy and prayer, join us for the Holy Betrothal & Ring Exchange of Dhanya & Arun.")}&location=${encodeURIComponent("St Mary's Church, Payyanad & Jayasri Auditorium, Manjeri, Kerala")}`;
  googleCalBtn.href = gCalUrl;

  // Apple / Outlook .ics Generator
  const downloadIcsBtn = document.getElementById("downloadIcsBtn");
  downloadIcsBtn.addEventListener("click", () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Dhanya & Arun Engagement//EN",
      "BEGIN:VEVENT",
      "UID:dhanya-arun-engagement-20261228@weddinglink.local",
      "DTSTAMP:20261107T000000Z",
      "DTSTART:20261228T050000Z",
      "DTEND:20261228T103000Z",
      "SUMMARY:Dhanya & Arun's Holy Betrothal & Engagement",
      "DESCRIPTION:Please join Dhanya & Arun as they celebrate their Holy Betrothal and Ring Exchange.",
      "LOCATION:St Mary's Church, Payyanad & Jayasri Auditorium, Manjeri, Kerala",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Dhanya-Arun-Engagement.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  // ==========================================
  // 7. BLESSINGS & WISHES SUBMISSION SYSTEM
  // ==========================================
  const wishModalBackdrop = document.getElementById("wishModalBackdrop");
  const openWishModalBtn = document.getElementById("openWishModalBtn");
  const closeWishModalBtn = document.getElementById("closeWishModalBtn");
  const wishForm = document.getElementById("wishForm");
  const sendWishViaWABtn = document.getElementById("sendWishViaWABtn");
  const wishesCarousel = document.getElementById("wishesCarousel");

  function openWishModal() {
    if (wishModalBackdrop) wishModalBackdrop.classList.add("active");
  }
  function closeWishModal() {
    if (wishModalBackdrop) wishModalBackdrop.classList.remove("active");
  }

  if (openWishModalBtn) openWishModalBtn.addEventListener("click", openWishModal);
  if (closeWishModalBtn) closeWishModalBtn.addEventListener("click", closeWishModal);
  if (wishModalBackdrop) {
    wishModalBackdrop.addEventListener("click", (e) => {
      if (e.target === wishModalBackdrop) closeWishModal();
    });
  }

  function handleWishPost(sendToWhatsApp = false) {
    const nameInput = document.getElementById("wisherName");
    const relInput = document.getElementById("wisherRelationship");
    const msgInput = document.getElementById("wisherMessage");

    const name = nameInput ? nameInput.value.trim() : "";
    const rel = relInput ? relInput.value.trim() : "";
    const msg = msgInput ? msgInput.value.trim() : "";

    if (!name || !msg) {
      alert("Please fill in your name and blessing message!");
      return;
    }

    // Add blessing dynamically to the Live Wishes Wall with golden animation
    const authorLabel = rel ? `${name} (${rel})` : name;
    const newCard = document.createElement("div");
    newCard.className = "wish-card";
    newCard.style.animation = "heroFadeUp 0.8s ease both";
    newCard.innerHTML = `<p class="wish-text">“${msg}”</p><span class="wish-author">— ${authorLabel}</span>`;
    
    if (wishesCarousel) {
      wishesCarousel.prepend(newCard);
      wishesCarousel.scrollTo({ left: 0, behavior: "smooth" });
    }

    // Spawn celebratory sparkles
    spawnSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.45);

    closeWishModal();
    showToast("✨ Your blessing was posted to the Wishes Wall!");

    // Optional WhatsApp dispatch with congratulations
    if (sendToWhatsApp) {
      const waText = `*Warmest Blessings for Dhanya & Arun* 💍✨\n\n` +
        `“${msg}”\n\n` +
        `— *From:* ${authorLabel}\n\n` +
        `Holy Betrothal · 28 December 2026`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
      setTimeout(() => {
        window.open(waUrl, "_blank");
      }, 500);
    }

    if (wishForm) wishForm.reset();
  }

  if (wishForm) {
    wishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleWishPost(false);
    });
  }

  if (sendWishViaWABtn) {
    sendWishViaWABtn.addEventListener("click", () => {
      handleWishPost(true);
    });
  }

  // ==========================================
  // 7. SHARE & TOAST NOTIFICATION
  // ==========================================
  const shareBtn = document.getElementById("shareBtn");
  const toast = document.getElementById("toastNotification");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  }

  function fallbackCopyText(textToCopy) {
    const textarea = document.createElement("textarea");
    textarea.value = textToCopy;
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.opacity = "0";
    textarea.setAttribute("readonly", "");
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (e) {
      copied = false;
    }
    document.body.removeChild(textarea);

    if (copied) {
      showToast("Invitation link copied to clipboard! ✨");
    } else {
      // Direct WhatsApp fallback if clipboard permissions are blocked in HTTP mobile
      const waText = `${CONFIG.shareTitle}\n\n${CONFIG.shareText}\n\n${textToCopy}`;
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
      window.open(waUrl, "_blank");
    }
  }

  function copyToClipboard(url) {
    const shareUrl = url || window.location.href;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showToast("Invitation link copied to clipboard! ✨");
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareUrl = "https://hellowebsites000.github.io/Dhanya-Arun-Engagement-Invitation/";
      const shareData = {
        title: CONFIG.shareTitle,
        text: CONFIG.shareText,
        url: shareUrl
      };

      // Native share sheet (supported on HTTPS / localhost / compatible mobile WebViews)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if (err.name === "AbortError") {
            return; // User canceled the share sheet intentionally
          }
        }
      }

      // Robust fallback for HTTP local network and mobile browsers
      copyToClipboard(shareUrl);
    });
  }

  // Navbar background switch on scroll
  const topbar = document.getElementById("topbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      topbar.classList.add("scrolled");
    } else {
      topbar.classList.remove("scrolled");
    }
  }, { passive: true });

})();
