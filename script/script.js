// ---------------------------
// COUNTDOWN TIMER
// ---------------------------
const countdownElement = document.createElement('div');
countdownElement.id = 'countdown';
document.querySelector('#hero .hero-content').appendChild(countdownElement);

function updateCountdown() {
  const weddingDate = new Date("June 20, 2027 14:00:00").getTime();
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance < 0) {
    countdownElement.innerText = "We're Married!";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s until the wedding!`;
}

// Update every second
setInterval(updateCountdown, 1000);
updateCountdown();
