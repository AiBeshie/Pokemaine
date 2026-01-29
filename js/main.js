/* ==================================================
   MAIN JS — WEDDING INVITATION (FINAL CLEAN)
   Features:
   - Background music + selector
   - Hero & RSVP confetti
   - Countdown timer
   - Scroll effects
   - RSVP submit (Google Sheets)
   - Google Drive galleries w/ pagination + download + share
   - Lightbox (keyboard + arrows + touch swipe)
   - Settings panel (background + music)
================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ==================================================
     HELPERS
  ================================================== */
  const $ = (q) => document.querySelector(q);
  const $$ = (q) => document.querySelectorAll(q);
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  /* ==================================================
     BACKGROUND MUSIC
  ================================================== */
  const bgMusic = $("#bgMusic");
  const musicToggle = $("#musicToggle");
  let isPlaying = false;

  if (bgMusic && musicToggle) {
    bgMusic.volume = 0.3;
    bgMusic.play().then(() => { isPlaying = true; musicToggle.textContent = "⏸"; }).catch(() => { musicToggle.textContent = "▶"; });
    musicToggle.addEventListener("click", () => {
      if (bgMusic.paused) { bgMusic.play(); musicToggle.textContent = "⏸"; isPlaying = true; }
      else { bgMusic.pause(); musicToggle.textContent = "▶"; isPlaying = false; }
    });
  }

  /* ==================================================
     CONFETTI COLORS
  ================================================== */
  const cssVars = getComputedStyle(document.documentElement);
  const CONFETTI_COLORS = [
    cssVars.getPropertyValue("--clr-secondary").trim() || "#9b779d",
    cssVars.getPropertyValue("--clr-accent").trim() || "#c9907c",
    cssVars.getPropertyValue("--clr-soft").trim() || "#f3e4e1"
  ];

  /* ==================================================
     HERO CONFETTI
  ================================================== */
  const confettiContainer = $("#confetti");
  function spawnConfetti(container) {
    if (!container) return;
    const piece = document.createElement("span");
    const size = rand(4, 10);
    piece.style.cssText = `
      position: absolute;
      left: ${rand(0, 100)}%;
      top: -10px;
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${pick(CONFETTI_COLORS)};
      opacity: ${rand(0.4, 0.9)};
      pointer-events: none;
    `;
    piece.animate([{ transform: "translateY(0) rotate(0deg)" }, { transform: `translateY(110vh) rotate(${rand(180, 540)}deg)` }], { duration: rand(4000, 6500), easing: "linear", fill: "forwards" });
    container.appendChild(piece);
    setTimeout(() => piece.remove(), 7000);
  }
  if (confettiContainer) setInterval(() => spawnConfetti(confettiContainer), 250);

  /* ==================================================
     COUNTDOWN TIMER
  ================================================== */
  const targetDate = new Date("June 20, 2027 00:00:00").getTime();
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;
    const days = Math.floor(distance / (1000*60*60*24));
    const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
    const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
    const seconds = Math.floor((distance % (1000*60)) / 1000);
    $("#daysNumber").innerText = days > 0 ? days : 0;
    $("#hoursNumber").innerText = hours < 10 ? "0"+hours : hours;
    $("#minutesNumber").innerText = minutes < 10 ? "0"+minutes : minutes;
    $("#secondsNumber").innerText = seconds < 10 ? "0"+seconds : seconds;
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();


 /* ==================================================
   SAVE THE DATE BUTTON — GOOGLE CALENDAR + ICS
================================================== */
const saveDateBtn = document.getElementById("saveDateBtn");

if (saveDateBtn) {
  saveDateBtn.addEventListener("click", () => {
    // Event details
    const title = "Wedding of A & S";
    const location = "Our Church Venue";
    const description = "We invite you to celebrate our wedding";
    
    // Start / End date in ISO format (UTC)
    const start = new Date("June 20, 2027 08:00:00 UTC");
    const end = new Date("June 20, 2027 12:00:00 UTC");

    // =====================
    // 1. Google Calendar URL
    // =====================
    const formatDate = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const gCalURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDate(start)}/${formatDate(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

    // Open Google Calendar in new tab (mobile friendly)
    window.open(gCalURL, "_blank");

    // =====================
    // 2. ICS file for native calendar apps
    // =====================
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${formatDate(start)}
DTEND:${formatDate(end)}
LOCATION:${location}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

    // Create a blob & trigger download
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "SaveTheDate.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}


  /* ==================================================
     AOS INIT
  ================================================== */
  if (window.AOS) AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });

  /* ==================================================
     NAV SHADOW + SCROLL TOP BUTTON
  ================================================== */
  const nav = $(".nav");
  const scrollTopBtn = $("#scrollTopBtn");
  window.addEventListener("scroll", () => {
    if (nav) nav.style.boxShadow = window.scrollY > 30 ? "0 6px 20px rgba(0,0,0,0.25)" : "none";
    if (scrollTopBtn) scrollTopBtn.classList.toggle("show", window.scrollY > 200);
  });
  scrollTopBtn?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ==================================================
     RSVP CONFETTI + FORM
  ================================================== */
  function launchRSVPConfetti() { for (let i=0;i<35;i++){ const piece=document.createElement("span"); const size=rand(6,10); piece.style.cssText=`position: fixed; left: ${rand(0,100)}vw; top: -10px; width: ${size}px; height: ${size}px; border-radius: 50%; background: ${pick(CONFETTI_COLORS)}; z-index: 9999; pointer-events: none;`; piece.animate([{ transform: "translateY(0) rotate(0)", opacity: 1 },{ transform: `translateY(300px) rotate(${rand(180,720)}deg)`, opacity: 0 }],{ duration: 2200, easing: "ease-out", fill: "forwards" }); document.body.appendChild(piece); setTimeout(()=>piece.remove(),2300); } }

  const rsvpForm = $(".rsvp-form");
  if (rsvpForm) rsvpForm.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = new URLSearchParams({ name: rsvpForm.name.value, attendance: rsvpForm.attendance.value, message: rsvpForm.message.value });
    try { 
      const res = await fetch("https://script.google.com/macros/s/AKfycbyMtejkOuP4GFjI2ubPV3DEmubOiLoxrASm7nWUBS6fZv5FRqd2RbMm217IZwoGPV-7/exec",{ method:"POST", body: payload });
      const result = await res.json();
      if(result.status==="success"){ rsvpForm.reset(); launchRSVPConfetti(); alert("RSVP submitted! 💜"); } 
      else alert("Submission failed. Please try again.");
    } catch(err){ alert("Network error. Please try again later."); }
  });

  /* ==================================================
     SETTINGS PANEL + BACKGROUNDS
  ================================================== */
  const settingsToggle = $("#settingsToggle");
  const settingsPanel = $("#settingsPanel");
  const bgButtons = $$(".bg-options button");

  settingsToggle?.addEventListener("click", () => { settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block"; });

  function applyBackground(file, opacity = 0.3) {
    const url = `url("./assets/background/${file}")`;
    document.body.style.backgroundImage = `linear-gradient(rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity})),${url}`;
    const sections = document.querySelectorAll(".section[data-bg]");
    sections.forEach(sec => { if(sec.dataset.bg===file){ sec.style.backgroundImage = `linear-gradient(rgba(255,255,255,${opacity}), rgba(255,255,255,${opacity})), url("./assets/background/${file}")`; sec.style.backgroundSize="cover"; sec.style.backgroundPosition="center"; }});
    localStorage.setItem("bg", file);
  }

  bgButtons.forEach(btn=>btn.addEventListener("click",()=>applyBackground(btn.dataset.bg,0.2)));
  const savedBg=localStorage.getItem("bg"); if(savedBg) applyBackground(savedBg,0.2);

  /* ==================================================
     GOOGLE DRIVE GALLERY
  ================================================== */
  const folders = { church: "16BPBMPTwZwZgTI2tnNV1Tk1EKKB4wMyv", prenup: "1ZoSsPSECRq062Bx4KAhKQUtnj24ePRAn", reception: "1FqqNku0QNhGgWMJAiec6944SVjXeAZ4i" };
  const apiKey = "AIzaSyBgEstYNO3_dKI4mC1KdsPRpx_p2gpDsXQ";
  const sectionMap = { church: "church-gallery", prenup: "prenup-gallery", reception: "reception-gallery" };
  const PHOTOS_PER_PAGE = 16;
  const PLACEHOLDER = "https://via.placeholder.com/400x400/c0c0c0/ffffff?text=Upload+Here";

  async function fetchImages(folderId){
    try{ const res=await fetch(`https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType contains 'image/'&fields=files(id,name,thumbnailLink)&key=${apiKey}`);
      const data=await res.json(); return data.files||[]; } 
    catch(err){ console.error(err); return []; }
  }

  function paginate(files){
    const pages=[]; for(let i=0;i<files.length;i+=PHOTOS_PER_PAGE){ const slice=files.slice(i,i+PHOTOS_PER_PAGE); while(slice.length<PHOTOS_PER_PAGE) slice.push({name:"Placeholder", thumbnailLink:PLACEHOLDER}); pages.push(slice); } return pages;
  }

  async function loadGallery(key){
    const wrapper=$(`#${sectionMap[key]}`); if(!wrapper) return;
    const pagination=$(`#${key}-pagination`);
    const prevBtn=pagination?.querySelector(".prev"); const nextBtn=pagination?.querySelector(".next");
    const files=await fetchImages(folders[key]); const pages=paginate(files); let currentPage=0;
    function renderPage(){ wrapper.innerHTML=""; pages[currentPage].forEach(file=>{ const fig=document.createElement("figure"); fig.dataset.id=file.id||""; fig.dataset.name=file.name||"Photo"; fig.innerHTML=`<img src="${file.thumbnailLink||PLACEHOLDER}" loading="lazy" alt="Wedding Photo">`; wrapper.appendChild(fig); }); }
    renderPage();
    prevBtn?.addEventListener("click",()=>{ currentPage=(currentPage-1+pages.length)%pages.length; renderPage(); });
    nextBtn?.addEventListener("click",()=>{ currentPage=(currentPage+1)%pages.length; renderPage(); });
  }

  /* ==================================================
     DRIVE LIGHTBOX + SLIDES + SWIPE
  ================================================== */
  let currentGallery=[], currentIndex=0;
  const popup=$("#drivePopup"), frame=$("#driveFrame"), caption=$("#driveCaption");

  const shareBtn=document.createElement("button"); shareBtn.className="drive-share"; shareBtn.textContent="⇪"; popup.appendChild(shareBtn);
  const sharePopup=document.createElement("div"); sharePopup.className="share-popup";
  sharePopup.innerHTML=`<a href="#" target="_blank" class="share-facebook">Facebook</a><a href="#" target="_blank" class="share-twitter">Twitter</a><a href="#" target="_blank" class="share-instagram">Instagram</a><a href="#" target="_blank" class="share-tiktok">TikTok</a>`;
  popup.appendChild(sharePopup);

  shareBtn.addEventListener("click", e=>{ e.stopPropagation(); sharePopup.style.display=sharePopup.style.display==="flex"?"none":"flex"; });
  popup.addEventListener("click", e=>{ if(!e.target.closest(".drive-share")&&!e.target.closest(".share-popup")) sharePopup.style.display="none"; });

  function updateShareLinks(fileId,fileName){
    const url=`https://drive.google.com/uc?id=${fileId}&export=view`;
    sharePopup.querySelector(".share-facebook").href=`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    sharePopup.querySelector(".share-twitter").href=`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(fileName)}`;
    sharePopup.querySelector(".share-instagram").href=`https://www.instagram.com/?url=${encodeURIComponent(url)}`;
    sharePopup.querySelector(".share-tiktok").href=`https://www.tiktok.com/upload?url=${encodeURIComponent(url)}`;
  }

  function openDrivePreview(fileId,title,galleryArray){
    currentGallery=galleryArray; currentIndex=galleryArray.findIndex(f=>f.id===fileId);
    frame.src=`https://drive.google.com/file/d/${fileId}/preview`; caption.textContent=title;
    updateShareLinks(fileId,title);
    popup.style.display="flex"; popup.style.opacity=0; popup.style.transform="translateY(20%)";
    requestAnimationFrame(()=>{ popup.style.opacity=1; popup.style.transform="translateY(0)"; });
  }

  function closeDrivePreview(){ popup.style.transition="opacity 0.3s ease, transform 0.3s ease"; popup.style.opacity=0; popup.style.transform="translateY(20%)"; setTimeout(()=>{ frame.src=""; popup.style.display="none"; },300); }

  function slideToImage(newIndex,direction){
    if(!currentGallery.length) return; const next=currentGallery[newIndex]; if(!next?.id) return;
    const width=popup.offsetWidth, startX=direction*width, endX=0;
    frame.style.transition="none"; frame.style.transform=`translateX(${startX}px) scale(0.95)`;
    frame.src=`https://drive.google.com/file/d/${next.id}/preview`; caption.textContent=next.name;
    updateShareLinks(next.id,next.name);
    requestAnimationFrame(()=>{ frame.style.transition="transform 0.35s ease"; frame.style.transform=`translateX(${endX}px) scale(1)`; });
    currentIndex=newIndex;
  }

  function showNext(){ slideToImage((currentIndex+1)%currentGallery.length,1); }
  function showPrev(){ slideToImage((currentIndex-1+currentGallery.length)%currentGallery.length,-1); }
// Attach buttons
$(".drive-prev")?.addEventListener("click", showPrev);
$(".drive-next")?.addEventListener("click", showNext);


  $(".drive-download")?.addEventListener("click", async ()=>{
    if(!currentGallery.length) return; const current=currentGallery[currentIndex]; if(!current?.id) return;
    const url=`https://www.googleapis.com/drive/v3/files/${current.id}?alt=media&key=${apiKey}`;
    try{ const res=await fetch(url); if(!res.ok) throw new Error("Network error"); const blob=await res.blob(); const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download=current.name||"photo.jpg"; document.body.appendChild(link); link.click(); document.body.removeChild(link); } 
    catch(err){ alert("Failed to download. Please try again."); console.error(err);}
  });

  $(".drive-close")?.addEventListener("click", closeDrivePreview);
  popup?.addEventListener("click", e=>{ if(e.target.id==="drivePopup") closeDrivePreview(); });

  document.addEventListener("keydown", e=>{
    if(popup.style.display!=="flex") return;
    if(e.key==="Escape") closeDrivePreview();
    if(e.key==="ArrowRight") showNext();
    if(e.key==="ArrowLeft") showPrev();
  });

  document.addEventListener("click", e=>{
    const fig=e.target.closest(".gallery-wrapper figure"); if(!fig) return;
    const galleryWrapper=fig.closest(".gallery-wrapper");
    const figures=Array.from(galleryWrapper.querySelectorAll("figure"));
    const galleryArray=figures.map(f=>({id:f.dataset.id,name:f.dataset.name}));
    openDrivePreview(fig.dataset.id,fig.dataset.name,galleryArray);
  });

/* ==================================================
   TOUCH SWIPE — Mobile Gallery Experience
================================================== */
let touchStartX = 0, touchStartY = 0;
let isDragging = false;
const swipeThreshold = 50; // minimum px to trigger action
const verticalThreshold = 30; // allow slight vertical drift

popup?.addEventListener("touchstart", e => {
  if(e.target.closest(".drive-close, .drive-prev, .drive-next, .drive-download, .drive-share")) return;
  const t = e.changedTouches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
  isDragging = true;
  frame.style.transition = "none"; // remove transition while dragging
});

popup?.addEventListener("touchmove", e => {
  if(!isDragging) return;
  const t = e.changedTouches[0];
  const diffX = t.clientX - touchStartX;
  const diffY = t.clientY - touchStartY;

  // Move frame while dragging (horizontal only)
  if(Math.abs(diffX) > Math.abs(diffY)) {
    frame.style.transform = `translateX(${diffX}px) scale(0.95)`;
  }
});

popup?.addEventListener("touchend", e => {
  if(!isDragging) return;
  isDragging = false;
  const t = e.changedTouches[0];
  const diffX = t.clientX - touchStartX;
  const diffY = t.clientY - touchStartY;

  // Horizontal swipe → next/prev
  if(Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold){
    diffX < 0 ? showNext() : showPrev();
  } 
  // Vertical swipe down → close
  else if(Math.abs(diffY) > swipeThreshold && Math.abs(diffX) < verticalThreshold){
    popup.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    popup.style.transform = `translateY(${diffY}px)`; // follow finger
    popup.style.opacity = 0;
    setTimeout(() => closeDrivePreview(), 300);
  } 
  // Small movement → snap back
  else {
    frame.style.transition = "transform 0.3s ease";
    frame.style.transform = "translateX(0) scale(1)";
  }
});




  /* ==================================================
     INIT GALLERIES
  ================================================== */
  Object.keys(folders).forEach(loadGallery);

});
