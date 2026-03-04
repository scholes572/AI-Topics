// script.js

// Neural Background Animation
class NeuralBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('neuralBg');
        this.container.appendChild(this.canvas);
        
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        
        this.init();
        this.animate();
        this.addEventListeners();
    }
    
    init() {
        this.resize();
        
        // Create nodes
        const nodeCount = Math.floor((window.innerWidth * window.innerHeight) / 15000);
        for (let i = 0; i < nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                color: Math.random() > 0.5 ? '#ff006e' : '#8338ec'
            });
        }
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw nodes
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Mouse interaction
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                node.x -= dx * 0.01;
                node.y -= dy * 0.01;
            }
            
            // Draw node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = node.color;
            this.ctx.fill();
        });
        
        // Draw connections
        this.nodes.forEach((node, i) => {
            this.nodes.slice(i + 1).forEach(other => {
                const dx = node.x - other.x;
                const dy = node.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(node.x, node.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(131, 56, 236, ${0.2 * (1 - dist / 150)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Network Canvas Animation
class NetworkVisualization {
    constructor() {
        this.canvas = document.getElementById('networkCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.layers = [
            { nodes: 4, y: 0.8, label: 'Input' },      // Input (Text, Image, Audio, Video)
            { nodes: 6, y: 0.5, label: 'Hidden' },     // Hidden
            { nodes: 4, y: 0.2, label: 'Output' }      // Output
        ];
        this.particles = [];
        
        this.init();
        this.animate();
    }
    
    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize particles
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                layer: 0,
                node: Math.floor(Math.random() * 4),
                progress: Math.random(),
                speed: 0.005 + Math.random() * 0.005
            });
        }
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    getNodePos(layerIdx, nodeIdx, totalNodes) {
        const layer = this.layers[layerIdx];
        const x = (this.canvas.width / (this.layers.length + 1)) * (layerIdx + 1);
        const spacing = this.canvas.height / (totalNodes + 1);
        const y = spacing * (nodeIdx + 1);
        return { x, y };
    }
    
    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.ctx.strokeStyle = 'rgba(131, 56, 236, 0.2)';
        this.ctx.lineWidth = 1;
        
        for (let l = 0; l < this.layers.length - 1; l++) {
            const currentLayer = this.layers[l];
            const nextLayer = this.layers[l + 1];
            
            for (let i = 0; i < currentLayer.nodes; i++) {
                const start = this.getNodePos(l, i, currentLayer.nodes);
                for (let j = 0; j < nextLayer.nodes; j++) {
                    const end = this.getNodePos(l + 1, j, nextLayer.nodes);
                    this.ctx.beginPath();
                    this.ctx.moveTo(start.x, start.y);
                    this.ctx.lineTo(end.x, end.y);
                    this.ctx.stroke();
                }
            }
        }
        
        // Draw nodes
        this.layers.forEach((layer, l) => {
            for (let i = 0; i < layer.nodes; i++) {
                const pos = this.getNodePos(l, i, layer.nodes);
                
                // Glow
                const gradient = this.ctx.createRadialGradient(
                    pos.x, pos.y, 0,
                    pos.x, pos.y, 20
                );
                gradient.addColorStop(0, l === 1 ? 'rgba(255, 0, 110, 0.5)' : 'rgba(131, 56, 236, 0.5)');
                gradient.addColorStop(1, 'transparent');
                this.ctx.fillStyle = gradient;
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Node
                this.ctx.fillStyle = l === 1 ? '#ff006e' : '#8338ec';
                this.ctx.beginPath();
                this.ctx.arc(pos.x, pos.y, 8, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        
        // Animate particles
        this.particles.forEach(p => {
            p.progress += p.speed;
            if (p.progress >= 1) {
                p.progress = 0;
                p.layer = 0;
                p.node = Math.floor(Math.random() * 4);
            }
            
            const startLayer = this.layers[p.layer];
            const endLayer = this.layers[p.layer + 1] || startLayer;
            const start = this.getNodePos(p.layer, p.node, startLayer.nodes);
            const endNode = Math.floor(Math.random() * endLayer.nodes);
            const end = this.getNodePos(p.layer + 1, endNode, endLayer.nodes);
            
            const x = start.x + (end.x - start.x) * p.progress;
            const y = start.y + (end.y - start.y) * p.progress;
            
            this.ctx.fillStyle = '#06ffa5';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target === 50 ? '+' : '');
            }
        };
        
        updateCounter();
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters when hero is visible
                if (entry.target.classList.contains('hero')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.year-section').forEach(section => {
        observer.observe(section);
    });
    
    observer.observe(document.querySelector('.hero'));
}

// 3D Tilt Effect for Cards
function initTiltEffect() {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Smooth Scroll
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation scroll effect
function initNavScroll() {
    const nav = document.querySelector('.nav-glass');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav.style.background = 'rgba(10, 10, 15, 0.95)';
            nav.style.padding = '1rem 5%';
        } else {
            nav.style.background = 'rgba(10, 10, 15, 0.8)';
            nav.style.padding = '1.5rem 5%';
        }
        
        lastScroll = currentScroll;
    });
}

// Active nav link
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    new NeuralBackground();
    new NetworkVisualization();
    initScrollAnimations();
    initTiltEffect();
    initNavScroll();
    initActiveNav();
    initMobileMenu();
    
    // Parallax effect for floating cards
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.float-card');
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        
        cards.forEach((card, index) => {
            const speed = (index + 1) * 0.5;
            card.style.transform = `translateX(${x * speed}px) translateY(${y * speed}px)`;
        });
    });
});