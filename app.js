const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const timer = document.getElementById('timer');
const log = document.getElementById('log');

let startTime;
let elapsedTime = 0;
let interval;
let logData = getLogDataFromCookie();

startBtn.addEventListener('click', () => {
  startTime = Date.now() - elapsedTime;
  interval = setInterval(updateTimer, 1000);
  startBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  clearInterval(interval);
  updateLog();
  elapsedTime = 0;
  timer.textContent = '00:00:00';
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  timer.textContent = formatTime(elapsedTime);
}

function formatTime(timeInMilliseconds) {
  const totalSeconds = Math.floor(timeInMilliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(number) {
  return number.toString().padStart(2, '0');
}

function updateLog() {
    const today = new Date().toLocaleDateString();
    const timeSpent = timer.textContent;
  
    if (logData[today]) {
      const previousTimeInMilliseconds = timeToMilliseconds(logData[today]);
      logData[today] = formatTime(previousTimeInMilliseconds + elapsedTime);
    } else {
      logData[today] = timeSpent;
    }
  
    setLogDataToCookie(logData);
    displayLog();
  }
  

function displayLog() {
  log.innerHTML = '';
  for (const date in logData) {
    const logEntry = document.createElement('p');
    logEntry.classList.add('log-entry');
    logEntry.textContent = `Date: ${date} - Time spent working: ${logData[date]}`;
    log.prepend(logEntry);
  }
}

function setLogDataToCookie(logData) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `logData=${encodeURIComponent(JSON.stringify(logData))}; expires=${expires.toUTCString()}; path=/`;
  }
  

function getLogDataFromCookie() {
    const cookieData = document.cookie.split('; ').find(cookie => cookie.startsWith('logData='));
    return cookieData ? JSON.parse(decodeURIComponent(cookieData.substring(8))) : {};
  }
  

function timeToMilliseconds(time) {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);
  
    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }
  

displayLog();
