// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Add hover effect to interactive elements
const interactiveElements = document.querySelectorAll('a, button, .course-card, .year-card');
interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.width = '60px';
        cursorOutline.style.height = '60px';
        cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.width = '40px';
        cursorOutline.style.height = '40px';
        cursorOutline.style.backgroundColor = 'transparent';
    });
});

// Particle Background
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100);
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        
        // Draw connections
        particles.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Navigation
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.8)';
    }

    // Active link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', newTheme);
});

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

// Animated Counter
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
};

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number').forEach(stat => {
    observer.observe(stat);
});

// Course Progress Tracking
const courseCheckboxes = document.querySelectorAll('.course-check input');
const progressData = JSON.parse(localStorage.getItem('courseProgress') || '{}');

// Load saved progress
courseCheckboxes.forEach(checkbox => {
    if (progressData[checkbox.id]) {
        checkbox.checked = true;
        checkbox.closest('.course-card').classList.add('completed');
    }
    checkbox.addEventListener('change', updateProgress);
});

function updateProgress() {
    const yearProgress = {
        1: { total: 5, completed: 0 },
        2: { total: 5, completed: 0 },
        3: { total: 5, completed: 0 },
        4: { total: 5, completed: 0 }
    };

    let totalCompleted = 0;
    const newProgressData = {};

    courseCheckboxes.forEach(checkbox => {
        const year = checkbox.id.charAt(1);
        const courseCard = checkbox.closest('.course-card');
        
        if (checkbox.checked) {
            yearProgress[year].completed++;
            totalCompleted++;
            courseCard.classList.add('completed');
            newProgressData[checkbox.id] = true;
        } else {
            courseCard.classList.remove('completed');
        }
    });

    // Save to localStorage
    localStorage.setItem('courseProgress', JSON.stringify(newProgressData));

    // Update year progress rings
    Object.keys(yearProgress).forEach(year => {
        const { total, completed } = yearProgress[year];
        const percentage = Math.round((completed / total) * 100);
        const yearCard = document.querySelector(`.year-card[data-year="${year}"]`);
        const ring = yearCard.querySelector('.progress-ring-fill');
        const text = yearCard.querySelector('.progress-text');
        
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (percentage / 100) * circumference;
        
        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = offset;
        text.textContent = `${percentage}%`;
    });

    // Update dashboard
    updateDashboard(yearProgress, totalCompleted);
    checkAchievements(totalCompleted);
}

function updateDashboard(yearProgress, totalCompleted) {
    const totalCourses = 23;
    const overallPercent = Math.round((totalCompleted / totalCourses) * 100);
    
    // Update circular progress
    const progressBar = document.getElementById('overallProgress');
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (overallPercent / 100) * circumference;
    progressBar.style.strokeDashoffset = offset;
    document.getElementById('overallPercent').textContent = `${overallPercent}%`;
    
    // Update stats
    document.getElementById('completedCourses').textContent = totalCompleted;
    document.getElementById('remainingCourses').textContent = totalCourses - totalCompleted;
    
    // Update year bars
    Object.keys(yearProgress).forEach(year => {
        const { total, completed } = yearProgress[year];
        const percent = Math.round((completed / total) * 100);
        document.getElementById(`y${year}Progress`).style.width = `${percent}%`;
        document.getElementById(`y${year}Percent`).textContent = `${percent}%`;
    });
}

function checkAchievements(completed) {
    const achievements = [
        { id: 'ach1', requirement: 1 },
        { id: 'ach2', requirement: 5 },
        { id: 'ach3', requirement: 12 },
        { id: 'ach4', requirement: 23 }
    ];

    achievements.forEach(ach => {
        const element = document.getElementById(ach.id);
        if (completed >= ach.requirement) {
            element.classList.remove('locked');
            element.classList.add('unlocked');
        }
    });
}

// Initialize progress on load
updateProgress();

// GPA Calculator
const gpaInputs = document.querySelector('.gpa-inputs');
const addCourseBtn = document.querySelector('.add-course');

addCourseBtn.addEventListener('click', () => {
    const row = document.createElement('div');
    row.className = 'gpa-row';
    row.innerHTML = `
        <input type="text" placeholder="Course name" class="course-name">
        <select class="grade-select">
            <option value="4.0">A (90-100)</option>
            <option value="3.7">A- (85-89)</option>
            <option value="3.3">B+ (82-84)</option>
            <option value="3.0">B (78-81)</option>
            <option value="2.7">B- (75-77)</option>
            <option value="2.3">C+ (72-74)</option>
            <option value="2.0">C (68-71)</option>
            <option value="1.7">C- (64-67)</option>
            <option value="1.0">D (60-63)</option>
            <option value="0">F (<60)</option>
        </select>
        <input type="number" placeholder="Credits" class="credits" min="1" max="10">
        <button class="remove-row"><i class="fas fa-times"></i></button>
    `;
    gpaInputs.appendChild(row);
    
    row.querySelector('.remove-row').addEventListener('click', () => {
        row.remove();
        calculateGPA();
    });
    
    row.querySelectorAll('input, select').forEach(input => {
        input.addEventListener('change', calculateGPA);
    });
});

function calculateGPA() {
    const rows = document.querySelectorAll('.gpa-row');
    let totalPoints = 0;
    let totalCredits = 0;
    
    rows.forEach(row => {
        const grade = parseFloat(row.querySelector('.grade-select').value) || 0;
        const credits = parseFloat(row.querySelector('.credits').value) || 0;
        
        totalPoints += grade * credits;
        totalCredits += credits;
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    document.querySelector('.gpa-value').textContent = gpa;
}

// Study Timer
let timerInterval;
let timeLeft = 25 * 60;
let isRunning = false;

const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('startTimer');
const pauseBtn = document.getElementById('pauseTimer');
const resetBtn = document.getElementById('resetTimer');
const modeBtns = document.querySelectorAll('.mode-btn');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.innerHTML = `
        <span class="timer-minutes">${minutes.toString().padStart(2, '0')}</span>
        <span class="timer-separator">:</span>
        <span class="timer-seconds">${seconds.toString().padStart(2, '0')}</span>
    `;
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isRunning = false;
                // Play notification sound or show alert
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play().catch(() => {});
            }
        }, 1000);
    }
});

pauseBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    const activeMode = document.querySelector('.mode-btn.active');
    timeLeft = parseInt(activeMode.dataset.time) * 60;
    updateTimerDisplay();
    startBtn.style.display = 'flex';
    pauseBtn.style.display = 'none';
});

modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timeLeft = parseInt(btn.dataset.time) * 60;
        updateTimerDisplay();
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            startBtn.style.display = 'flex';
            pauseBtn.style.display = 'none';
        }
    });
});

// Study Notes
const studyNotes = document.getElementById('studyNotes');
const clearNotesBtn = document.getElementById('clearNotes');

// Load saved notes
studyNotes.value = localStorage.getItem('studyNotes') || '';

studyNotes.addEventListener('input', () => {
    localStorage.setItem('studyNotes', studyNotes.value);
});

clearNotesBtn.addEventListener('click', () => {
    if (confirm('Clear all notes?')) {
        studyNotes.value = '';
        localStorage.removeItem('studyNotes');
    }
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for animations
const fadeElements = document.querySelectorAll('.year-card, .resource-category, .tool-card');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s, transform 0.6s';
    fadeObserver.observe(el);
});

// Add SVG gradient definition for progress circle
const svgNS = "http://www.w3.org/2000/svg";
const defs = document.createElementNS(svgNS, "defs");
const gradient = document.createElementNS(svgNS, "linearGradient");
gradient.setAttribute("id", "gradient");
gradient.setAttribute("x1", "0%");
gradient.setAttribute("y1", "0%");
gradient.setAttribute("x2", "100%");
gradient.setAttribute("y2", "100%");

const stop1 = document.createElementNS(svgNS, "stop");
stop1.setAttribute("offset", "0%");
stop1.setAttribute("stop-color", "#667eea");

const stop2 = document.createElementNS(svgNS, "stop");
stop2.setAttribute("offset", "100%");
stop2.setAttribute("stop-color", "#764ba2");

gradient.appendChild(stop1);
gradient.appendChild(stop2);
defs.appendChild(gradient);

document.querySelector('.circular-progress svg').prepend(defs);

console.log('AI Horizon loaded successfully! 🚀');