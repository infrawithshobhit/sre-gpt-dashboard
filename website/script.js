// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.timeline-item, .content-card, .travel-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Animate counters when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = document.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number) {
                    stat.textContent = '0';
                    setTimeout(() => {
                        animateCounter(stat, number);
                        // Add back the suffix
                        setTimeout(() => {
                            if (text.includes('+')) {
                                stat.textContent = number + '+';
                            }
                        }, 2000);
                    }, 500);
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// FORCE COSMIC SCENE IMMEDIATELY
document.body.style.background = '#000000';
document.body.style.color = '#ffffff';

// Create cosmic scene if it doesn't exist
if (!document.querySelector('.cosmic-scene')) {
    const cosmicScene = document.createElement('div');
    cosmicScene.className = 'cosmic-scene';
    cosmicScene.innerHTML = `
        <div class="deep-space"></div>
        <div class="star-field">
            ${Array.from({length: 20}, (_, i) => `<div class="star"></div>`).join('')}
        </div>
        <div class="solar-system">
            <div class="sun"><div class="sun-core"></div><div class="sun-corona"></div></div>
            <div class="planet mercury"></div>
            <div class="planet venus"></div>
            <div class="planet earth"><div class="moon"></div></div>
            <div class="planet mars"></div>
            <div class="planet jupiter"><div class="jupiter-spot"></div></div>
            <div class="planet saturn"><div class="saturn-rings"></div></div>
            <div class="planet uranus"></div>
            <div class="planet neptune"></div>
        </div>
        <div class="wormhole">
            <div class="wormhole-entrance"></div>
            <div class="wormhole-tunnel"></div>
            <div class="wormhole-exit"></div>
            <div class="wormhole-energy"></div>
        </div>
        <div class="blackhole-system">
            <div class="gravitational-lensing"></div>
            <div class="accretion-disk"></div>
            <div class="blackhole-center"></div>
            <div class="event-horizon"></div>
            <div class="hawking-radiation"></div>
        </div>
        <div class="nebula"></div>
        <div class="cosmic-dust"></div>
        <div class="space-particles">
            ${Array.from({length: 15}, (_, i) => `<div class="particle"></div>`).join('')}
        </div>
    `;
    document.body.insertBefore(cosmicScene, document.body.firstChild);
}

// EMERGENCY BYPASS - Skip mood popup entirely
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== EMERGENCY BYPASS ACTIVATED ===');
    
    const moodPopup = document.getElementById('moodPopup');
    
    // IMMEDIATE BYPASS - Hide popup and enter website
    setTimeout(() => {
        console.log('=== BYPASSING MOOD POPUP COMPLETELY ===');
        
        if (moodPopup) {
            moodPopup.style.display = 'none';
            moodPopup.classList.add('hidden');
        }
        
        // Set default mood and enter website
        const defaultMood = 'excited';
        sessionStorage.setItem('userMood', defaultMood);
        applyTheme(defaultMood);
        document.body.style.opacity = '1';
        
        // FORCE COSMIC SCENE VISIBILITY
        const cosmicScene = document.querySelector('.cosmic-scene');
        if (cosmicScene) {
            cosmicScene.style.display = 'block';
            cosmicScene.style.visibility = 'visible';
            cosmicScene.style.opacity = '1';
            cosmicScene.style.zIndex = '-1';
            console.log('=== COSMIC SCENE FORCED VISIBLE ===');
        }
        
        // Force all cosmic elements
        const solarSystem = document.querySelector('.solar-system');
        const wormhole = document.querySelector('.wormhole');
        const blackholeSystem = document.querySelector('.blackhole-system');
        
        [solarSystem, wormhole, blackholeSystem].forEach(element => {
            if (element) {
                element.style.display = 'block';
                element.style.visibility = 'visible';
                element.style.opacity = '1';
            }
        });
        
        // FORCE START AUDIO
        setTimeout(() => {
            const audioBtn = document.getElementById('audioToggle');
            if (audioBtn) {
                audioBtn.click(); // Auto-start audio
                console.log('=== AUDIO AUTO-STARTED ===');
            }
        }, 2000);
        
        // Show welcome message
        showWelcomeMessage(defaultMood);
        
        console.log('=== WEBSITE ENTERED SUCCESSFULLY ===');
    }, 1000);
    
    // BACKUP: Also hide popup immediately
    if (moodPopup) {
        moodPopup.style.display = 'none';
    }
    
    // BACKUP: Set body opacity immediately
    document.body.style.opacity = '1';
    
    // BACKUP: Force black hole visible immediately
    const blackhole = document.querySelector('.blackhole-background');
    if (blackhole) {
        blackhole.style.display = 'block';
        blackhole.style.visibility = 'visible';
        blackhole.style.opacity = '1';
    }
    
    // Check if user has already selected a mood in this session
    const savedMood = sessionStorage.getItem('userMood');
    if (savedMood) {
        applyTheme(savedMood);
        if (moodPopup) moodPopup.classList.add('hidden');
        document.body.style.opacity = '1';
    } else {
        document.body.style.opacity = '1';
    }
    
    // Enable enter button when mood is selected
    if (moodSelect && enterButton) {
        // Function to update button state
        function updateButtonState() {
            const selectedValue = moodSelect.value;
            const hasValue = selectedValue && selectedValue.trim() !== '';
            
            console.log('Updating button state. Selected value:', selectedValue, 'Has value:', hasValue);
            
            if (hasValue) {
                // Enable button - aggressive approach
                enterButton.disabled = false;
                enterButton.removeAttribute('disabled');
                enterButton.classList.remove('disabled');
                enterButton.classList.add('enabled');
                
                // Force styles
                enterButton.style.background = 'linear-gradient(45deg, #ff8c00, #ffa500)';
                enterButton.style.opacity = '1';
                enterButton.style.cursor = 'pointer';
                enterButton.style.pointerEvents = 'auto';
                
                console.log('Button enabled - final state:', {
                    disabled: enterButton.disabled,
                    hasDisabledAttr: enterButton.hasAttribute('disabled'),
                    classList: enterButton.classList.toString(),
                    style: enterButton.style.cssText
                });
            } else {
                // Disable button
                enterButton.disabled = true;
                enterButton.setAttribute('disabled', 'disabled');
                enterButton.classList.add('disabled');
                enterButton.classList.remove('enabled');
                
                // Force disabled styles
                enterButton.style.background = '#666666';
                enterButton.style.opacity = '0.5';
                enterButton.style.cursor = 'not-allowed';
                enterButton.style.pointerEvents = 'none';
                
                console.log('Button disabled');
            }
        }
        
        // Listen for change events
        moodSelect.addEventListener('change', (e) => {
            console.log('Change event fired:', e.target.value);
            setTimeout(updateButtonState, 50);
        });
        
        // Listen for input events
        moodSelect.addEventListener('input', (e) => {
            console.log('Input event fired:', e.target.value);
            setTimeout(updateButtonState, 50);
        });
        
        // Listen for click events on select (for mobile)
        moodSelect.addEventListener('click', () => {
            setTimeout(updateButtonState, 200);
        });
        
        // Listen for focus events
        moodSelect.addEventListener('focus', () => {
            setTimeout(updateButtonState, 100);
        });
        
        // Listen for blur events
        moodSelect.addEventListener('blur', () => {
            setTimeout(updateButtonState, 100);
        });
        
        // Initial state check
        setTimeout(updateButtonState, 100);
        
        // Backup check every second for 10 seconds
        let checkCount = 0;
        const backupCheck = setInterval(() => {
            checkCount++;
            if (checkCount > 10) {
                clearInterval(backupCheck);
                return;
            }
            
            if (moodSelect.value && moodSelect.value.trim() !== '' && enterButton.disabled) {
                console.log('Backup check triggered - forcing button enable');
                updateButtonState();
            }
        }, 1000);
    }
    
    // Add emergency bypass after 5 seconds if button still doesn't work
    setTimeout(() => {
        if (moodSelect && moodSelect.value && moodSelect.value.trim() !== '' && enterButton && enterButton.disabled) {
            console.log('Emergency bypass activated - creating alternative entry method');
            
            // Create bypass button
            const bypassButton = document.createElement('button');
            bypassButton.innerHTML = '🚀 Emergency Entry (Click Here)';
            bypassButton.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 10001;
                padding: 1rem 2rem;
                font-size: 1.2rem;
                font-weight: 600;
                border: 3px solid #ff8c00;
                border-radius: 50px;
                background: linear-gradient(45deg, #ff8c00, #ffa500);
                color: white;
                cursor: pointer;
                animation: pulse 1s infinite;
            `;
            
            bypassButton.addEventListener('click', () => {
                const selectedMood = moodSelect.value;
                if (selectedMood && selectedMood.trim() !== '') {
                    sessionStorage.setItem('userMood', selectedMood);
                    applyTheme(selectedMood);
                    if (moodPopup) {
                        moodPopup.style.animation = 'fadeOut 0.8s ease';
                        setTimeout(() => {
                            moodPopup.classList.add('hidden');
                        }, 800);
                    }
                    showWelcomeMessage(selectedMood);
                    bypassButton.remove();
                }
            });
            
            document.body.appendChild(bypassButton);
            
            // Add pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.05); }
                    100% { transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    }, 5000);

    // MULTIPLE BYPASS OPTIONS
    
    // 1. Click anywhere on popup background to enter
    if (moodPopup) {
        moodPopup.addEventListener('click', (e) => {
            if (e.target === moodPopup) {
                console.log('=== POPUP BACKGROUND CLICKED - BYPASSING ===');
                const defaultMood = 'excited';
                sessionStorage.setItem('userMood', defaultMood);
                applyTheme(defaultMood);
                moodPopup.classList.add('hidden');
                showWelcomeMessage(defaultMood);
            }
        });
    }
    
    // 2. Press ENTER key to bypass
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && moodPopup && !moodPopup.classList.contains('hidden')) {
            console.log('=== ENTER KEY PRESSED - BYPASSING ===');
            const selectedMood = moodSelect ? moodSelect.value || 'excited' : 'excited';
            sessionStorage.setItem('userMood', selectedMood);
            applyTheme(selectedMood);
            moodPopup.classList.add('hidden');
            showWelcomeMessage(selectedMood);
        }
    });
    
    // 3. Press SPACE key to bypass
    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' && moodPopup && !moodPopup.classList.contains('hidden')) {
            e.preventDefault();
            console.log('=== SPACE KEY PRESSED - BYPASSING ===');
            const selectedMood = moodSelect ? moodSelect.value || 'excited' : 'excited';
            sessionStorage.setItem('userMood', selectedMood);
            applyTheme(selectedMood);
            moodPopup.classList.add('hidden');
            showWelcomeMessage(selectedMood);
        }
    });

    // Handle universe entry
    if (enterButton) {
        // Add multiple click handlers
        enterButton.addEventListener('click', (e) => {
            console.log('=== BUTTON CLICKED ===');
            e.preventDefault();
            e.stopPropagation();
            
            const selectedMood = moodSelect ? moodSelect.value : 'excited';
            console.log('Enter button clicked, mood:', selectedMood);
            
            // Always proceed regardless of mood selection
            sessionStorage.setItem('userMood', selectedMood);
            applyTheme(selectedMood);
            
            if (moodPopup) {
                    moodPopup.style.animation = 'fadeOut 0.8s ease';
                    setTimeout(() => {
                        moodPopup.classList.add('hidden');
                    }, 800);
                }
                
                // Show personalized welcome message
                showWelcomeMessage(selectedMood);
            } else {
                console.log('No mood selected, button should be disabled');
            }
        });
    }
});

// Apply theme based on mood
function applyTheme(mood) {
    // Remove existing theme classes
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    
    // Add new theme class
    document.body.classList.add(`theme-${mood}`);
    
    // Update CSS custom properties for dynamic theming
    const themeColors = {
        excited: { primary: '#ff4757', secondary: '#ff6b7a', accent: '#ff3742' },
        curious: { primary: '#3742fa', secondary: '#5352ed', accent: '#2f3542' },
        focused: { primary: '#2ed573', secondary: '#7bed9f', accent: '#1e90ff' },
        creative: { primary: '#ff6348', secondary: '#ff7675', accent: '#fd79a8' },
        peaceful: { primary: '#70a1ff', secondary: '#5352ed', accent: '#3742fa' },
        adventurous: { primary: '#ffa502', secondary: '#ff6348', accent: '#ff4757' },
        nostalgic: { primary: '#747d8c', secondary: '#a4b0be', accent: '#57606f' },
        ambitious: { primary: '#ffd700', secondary: '#ffb142', accent: '#ff6348' },
        contemplative: { primary: '#6c5ce7', secondary: '#a29bfe', accent: '#fd79a8' },
        energetic: { primary: '#00d2d3', secondary: '#7bed9f', accent: '#2ed573' }
    };
    
    const colors = themeColors[mood];
    if (colors) {
        document.documentElement.style.setProperty('--primary-color', colors.primary);
        document.documentElement.style.setProperty('--secondary-color', colors.secondary);
        document.documentElement.style.setProperty('--accent-color', colors.accent);
    }
    
    // Update particle colors based on theme
    updateParticleColors(mood);
    
    // Update navigation glow
    updateNavigationGlow(mood);
}

// Update particle colors based on mood
function updateParticleColors(mood) {
    const particles = document.querySelectorAll('.particle');
    const colorMap = {
        excited: 'rgba(255, 71, 87, 0.8)',
        curious: 'rgba(55, 66, 250, 0.8)',
        focused: 'rgba(46, 213, 115, 0.8)',
        creative: 'rgba(255, 99, 72, 0.8)',
        peaceful: 'rgba(112, 161, 255, 0.8)',
        adventurous: 'rgba(255, 165, 2, 0.8)',
        nostalgic: 'rgba(164, 176, 190, 0.8)',
        ambitious: 'rgba(255, 215, 0, 0.8)',
        contemplative: 'rgba(108, 92, 231, 0.8)',
        energetic: 'rgba(0, 210, 211, 0.8)'
    };
    
    particles.forEach(particle => {
        particle.style.background = colorMap[mood] || 'rgba(255, 255, 255, 0.8)';
    });
}

// Update navigation glow based on mood
function updateNavigationGlow(mood) {
    const navLogo = document.querySelector('.nav-logo h2');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    const glowColors = {
        excited: 'rgba(255, 71, 87, 0.5)',
        curious: 'rgba(55, 66, 250, 0.5)',
        focused: 'rgba(46, 213, 115, 0.5)',
        creative: 'rgba(255, 99, 72, 0.5)',
        peaceful: 'rgba(112, 161, 255, 0.5)',
        adventurous: 'rgba(255, 165, 2, 0.5)',
        nostalgic: 'rgba(164, 176, 190, 0.5)',
        ambitious: 'rgba(255, 215, 0, 0.5)',
        contemplative: 'rgba(108, 92, 231, 0.5)',
        energetic: 'rgba(0, 210, 211, 0.5)'
    };
    
    const glowColor = glowColors[mood] || 'rgba(255, 140, 0, 0.5)';
    
    if (navLogo) {
        navLogo.style.textShadow = `0 0 10px ${glowColor}`;
    }
    
    navLinks.forEach(link => {
        link.style.textShadow = `0 0 5px ${glowColor}`;
    });
}

// Show personalized welcome message
function showWelcomeMessage(mood) {
    const messages = {
        excited: "🚀 Amazing! Your excitement is contagious. Let's explore the universe together!",
        curious: "🔍 Perfect! Your curiosity will unlock incredible discoveries here.",
        focused: "🎯 Excellent! Your focus will help you absorb every detail of this journey.",
        creative: "🎨 Wonderful! Your creativity will see possibilities others might miss.",
        peaceful: "🧘 Beautiful! Your peaceful energy creates the perfect space for learning.",
        adventurous: "🌍 Fantastic! Your adventurous spirit is exactly what this exploration needs.",
        nostalgic: "💭 Lovely! Your reflective nature will find deep meaning in this experience.",
        ambitious: "💪 Outstanding! Your ambition will drive you to achieve great things here.",
        contemplative: "🤔 Perfect! Your thoughtful approach will uncover profound insights.",
        energetic: "⚡ Incredible! Your energy will power through every section with enthusiasm!"
    };
    
    // Create and show welcome toast
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <p>${messages[mood]}</p>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// BULLETPROOF COSMIC AUDIO SYSTEM
console.log('🚀 LOADING COSMIC AUDIO SYSTEM...');

// Global variables to prevent conflicts
window.cosmicAudio = {
    isPlaying: false,
    audioContext: null,
    currentSources: [],
    currentTrack: 'deep-space'
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 Initializing Cosmic Audio...');
    
    // Get elements
    const audioToggle = document.getElementById('audioToggle');
    const playlistToggle = document.getElementById('playlistToggle');
    const musicPlaylist = document.getElementById('musicPlaylist');
    
    console.log('🔍 Elements found:', {
        audioToggle: !!audioToggle,
        playlistToggle: !!playlistToggle,
        musicPlaylist: !!musicPlaylist
    });
    
    // Cosmic soundscapes
    const cosmicTracks = {
        'deep-space': {
            name: '🌌 Deep Space Humming',
            create: function(ctx) {
                const sources = [];
                
                // Main hum
                const hum = ctx.createOscillator();
                const humGain = ctx.createGain();
                hum.frequency.setValueAtTime(60, ctx.currentTime);
                hum.type = 'sine';
                humGain.gain.setValueAtTime(0.3, ctx.currentTime);
                hum.connect(humGain);
                humGain.connect(ctx.destination);
                hum.start();
                sources.push(hum);
                
                // Harmonic
                const harmonic = ctx.createOscillator();
                const harmonicGain = ctx.createGain();
                harmonic.frequency.setValueAtTime(120, ctx.currentTime);
                harmonic.type = 'triangle';
                harmonicGain.gain.setValueAtTime(0.1, ctx.currentTime);
                harmonic.connect(harmonicGain);
                harmonicGain.connect(ctx.destination);
                harmonic.start();
                sources.push(harmonic);
                
                return sources;
            }
        },
        
        'cosmic-winds': {
            name: '💨 Cosmic Winds',
            create: function(ctx) {
                const sources = [];
                
                // Create noise buffer
                const bufferSize = ctx.sampleRate * 2;
                const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                
                const whiteNoise = ctx.createBufferSource();
                whiteNoise.buffer = noiseBuffer;
                whiteNoise.loop = true;
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, ctx.currentTime);
                
                const windGain = ctx.createGain();
                windGain.gain.setValueAtTime(0.2, ctx.currentTime);
                
                whiteNoise.connect(filter);
                filter.connect(windGain);
                windGain.connect(ctx.destination);
                whiteNoise.start();
                sources.push(whiteNoise);
                
                return sources;
            }
        },
        
        'stellar-harmony': {
            name: '⭐ Stellar Harmony',
            create: function(ctx) {
                const sources = [];
                const frequencies = [220, 330, 440, 550];
                
                frequencies.forEach(freq => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc.frequency.setValueAtTime(freq, ctx.currentTime);
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.08, ctx.currentTime);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    sources.push(osc);
                });
                
                return sources;
            }
        },
        
        'nebula-dreams': {
            name: '🌠 Nebula Dreams',
            create: function(ctx) {
                const sources = [];
                
                const pad1 = ctx.createOscillator();
                const pad2 = ctx.createOscillator();
                const padGain = ctx.createGain();
                
                pad1.frequency.setValueAtTime(110, ctx.currentTime);
                pad2.frequency.setValueAtTime(165, ctx.currentTime);
                pad1.type = 'sawtooth';
                pad2.type = 'sawtooth';
                
                const filter = ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(400, ctx.currentTime);
                
                padGain.gain.setValueAtTime(0.15, ctx.currentTime);
                
                pad1.connect(filter);
                pad2.connect(filter);
                filter.connect(padGain);
                padGain.connect(ctx.destination);
                
                pad1.start();
                pad2.start();
                sources.push(pad1, pad2);
                
                return sources;
            }
        },
        
        'quantum-pulse': {
            name: '⚛️ Quantum Pulse',
            create: function(ctx) {
                const sources = [];
                
                const pulse = ctx.createOscillator();
                const pulseGain = ctx.createGain();
                
                pulse.frequency.setValueAtTime(80, ctx.currentTime);
                pulse.type = 'square';
                pulseGain.gain.setValueAtTime(0.2, ctx.currentTime);
                
                pulse.connect(pulseGain);
                pulseGain.connect(ctx.destination);
                pulse.start();
                sources.push(pulse);
                
                return sources;
            }
        }
    };
    
    // Audio functions
    function initAudioContext() {
        if (!window.cosmicAudio.audioContext) {
            window.cosmicAudio.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎼 Audio context created');
        }
        return window.cosmicAudio.audioContext;
    }
    
    function stopAllSources() {
        window.cosmicAudio.currentSources.forEach(source => {
            try {
                source.stop();
            } catch (e) {
                // Already stopped
            }
        });
        window.cosmicAudio.currentSources = [];
    }
    
    function playTrack(trackId) {
        console.log(`🎵 Playing: ${trackId}`);
        
        try {
            stopAllSources();
            
            const ctx = initAudioContext();
            
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    startTrack(trackId, ctx);
                });
            } else {
                startTrack(trackId, ctx);
            }
        } catch (error) {
            console.error('❌ Play error:', error);
            alert('Audio error: ' + error.message);
        }
    }
    
    function startTrack(trackId, ctx) {
        if (cosmicTracks[trackId]) {
            window.cosmicAudio.currentSources = cosmicTracks[trackId].create(ctx);
            window.cosmicAudio.currentTrack = trackId;
            window.cosmicAudio.isPlaying = true;
            updateUI();
            console.log(`✅ Playing: ${cosmicTracks[trackId].name}`);
        }
    }
    
    function stopAudio() {
        stopAllSources();
        window.cosmicAudio.isPlaying = false;
        updateUI();
        console.log('⏹️ Audio stopped');
    }
    
    function updateUI() {
        if (audioToggle) {
            if (window.cosmicAudio.isPlaying) {
                audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                audioToggle.classList.remove('muted');
                audioToggle.title = 'Stop Audio';
                audioToggle.style.boxShadow = '0 0 30px rgba(255, 140, 0, 0.8)';
            } else {
                audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                audioToggle.classList.add('muted');
                audioToggle.title = 'Play Audio';
                audioToggle.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.3)';
            }
        }
    }
    
    // Button handlers
    if (audioToggle) {
        console.log('✅ Setting up audio button');
        audioToggle.addEventListener('click', () => {
            console.log('🎵 Button clicked, isPlaying:', window.cosmicAudio.isPlaying);
            if (window.cosmicAudio.isPlaying) {
                stopAudio();
            } else {
                playTrack(window.cosmicAudio.currentTrack);
            }
        });
        updateUI();
    } else {
        console.error('❌ Audio button not found');
    }
    
    // Playlist functionality
    if (playlistToggle && musicPlaylist) {
        playlistToggle.addEventListener('click', () => {
            if (musicPlaylist.style.display === 'none' || !musicPlaylist.style.display) {
                musicPlaylist.style.display = 'block';
                playlistToggle.innerHTML = '<i class="fas fa-times"></i>';
            } else {
                musicPlaylist.style.display = 'none';
                playlistToggle.innerHTML = '<i class="fas fa-list"></i>';
            }
        });
    }
    
    // Track selection
    document.querySelectorAll('.track-item').forEach(trackElement => {
        trackElement.addEventListener('click', () => {
            const trackId = trackElement.dataset.track;
            console.log(`🎶 Track selected: ${trackId}`);
            
            if (trackId && cosmicTracks[trackId]) {
                window.cosmicAudio.currentTrack = trackId;
                playTrack(trackId);
                
                // Update UI
                document.querySelectorAll('.track-item').forEach(item => {
                    item.classList.remove('active');
                });
                trackElement.classList.add('active');
                
                // Hide playlist
                if (musicPlaylist) {
                    musicPlaylist.style.display = 'none';
                    playlistToggle.innerHTML = '<i class="fas fa-list"></i>';
                }
            }
        });
    });
    
    // Test functions
    window.testAudio = () => {
        console.log('🧪 Testing audio...');
        if (window.cosmicAudio.isPlaying) {
            stopAudio();
        } else {
            playTrack('deep-space');
        }
    };
    
    window.testBeep = () => {
        console.log('🔔 Testing beep...');
        try {
            const ctx = initAudioContext();
            if (ctx.state === 'suspended') ctx.resume();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
            
            console.log('✅ Beep played');
        } catch (error) {
            console.error('❌ Beep failed:', error);
        }
    };
    
    console.log('🎵 COSMIC AUDIO SYSTEM READY!');
    console.log('🧪 Test functions: testAudio(), testBeep()');
    console.log('🎛️ Click speaker button to start!');
});

// Enhanced Black Hole Interactions
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const blackholeCenter = document.querySelector('.blackhole-center');
    const gravitationalLensing = document.querySelector('.gravitational-lensing');
    const accretionDisk = document.querySelector('.accretion-disk');
    
    if (blackholeCenter) {
        const intensity = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
        blackholeCenter.style.transform = `translate(${-50 + mouseX * 3}%, ${-50 + mouseY * 3}%) scale(${1 + intensity * 0.2})`;
    }
    
    if (gravitationalLensing) {
        gravitationalLensing.style.transform = `translate(${-50 + mouseX * 2}%, ${-50 + mouseY * 2}%) scale(${1 + Math.abs(mouseX + mouseY) * 0.1})`;
    }
    
    if (accretionDisk) {
        const speed = 8 - Math.abs(mouseX + mouseY) * 3;
        accretionDisk.style.animationDuration = `${Math.max(speed, 2)}s`;
    }
});

// Black hole click interaction
document.querySelector('.event-horizon')?.addEventListener('click', () => {
    const eventHorizon = document.querySelector('.event-horizon');
    const accretionDisk = document.querySelector('.accretion-disk');
    
    // Intense pulse effect
    eventHorizon.style.animation = 'none';
    eventHorizon.style.transform = 'translate(-50%, -50%) scale(1.5)';
    eventHorizon.style.boxShadow = `
        0 0 200px rgba(255, 140, 0, 1),
        0 0 400px rgba(255, 69, 0, 0.8),
        0 0 600px rgba(255, 140, 0, 0.6),
        inset 0 0 100px rgba(0, 0, 0, 1)
    `;
    
    // Speed up accretion disk
    if (accretionDisk) {
        accretionDisk.style.animationDuration = '1s';
    }
    
    // Reset after effect
    setTimeout(() => {
        eventHorizon.style.animation = 'eventHorizonPulse 4s ease-in-out infinite';
        eventHorizon.style.transform = 'translate(-50%, -50%) scale(1)';
        if (accretionDisk) {
            accretionDisk.style.animationDuration = '8s';
        }
    }, 2000);
});

// Add loading animation
window.addEventListener('load', () => {
    // Don't show body immediately if mood popup is visible
    if (!sessionStorage.getItem('userMood')) {
        document.body.style.opacity = '1';
    }
});

// Initial body opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Interstellar Wormhole Scroll Effects
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const wormhole = document.querySelector('.wormhole');
    const wormholeEntrance = document.querySelector('.wormhole-entrance');
    const wormholeTunnel = document.querySelector('.wormhole-tunnel');
    const wormholeEnergy = document.querySelector('.wormhole-energy');
    
    if (wormhole) {
        // Approach the wormhole as you scroll - Interstellar effect
        const approachScale = 1 + scrollPercent * 2; // Gets bigger as you scroll
        const approachBlur = Math.max(2 - scrollPercent * 1.5, 0.2); // Gets clearer as you approach
        
        wormhole.style.transform = `translate(-50%, -50%) scale(${approachScale})`;
        wormhole.style.filter = `blur(${approachBlur}px)`;
        
        // Intensify the entrance glow
        if (wormholeEntrance) {
            const glowIntensity = 100 + scrollPercent * 200;
            wormholeEntrance.style.boxShadow = `
                0 0 ${glowIntensity}px rgba(138, 43, 226, ${0.8 + scrollPercent * 0.2}),
                0 0 ${glowIntensity * 2}px rgba(75, 0, 130, ${0.6 + scrollPercent * 0.4}),
                0 0 ${glowIntensity * 3}px rgba(138, 43, 226, ${0.4 + scrollPercent * 0.6}),
                inset 0 0 ${50 + scrollPercent * 50}px rgba(0, 0, 0, 1)
            `;
        }
        
        // Speed up tunnel rotation as you approach
        if (wormholeTunnel) {
            const baseSpeed = 12;
            const newSpeed = Math.max(baseSpeed - scrollPercent * 8, 2);
            wormholeTunnel.style.animationDuration = `${newSpeed}s`;
        }
        
        // Intensify energy streams
        if (wormholeEnergy) {
            const energySpeed = Math.max(18 - scrollPercent * 12, 3);
            wormholeEnergy.style.animationDuration = `${energySpeed}s`;
            wormholeEnergy.style.opacity = Math.min(0.7 + scrollPercent * 0.3, 1);
        }
    }
    
    // Black hole effects (keep existing)
    const blackhole = document.querySelector('.blackhole-system');
    const accretionDisk = document.querySelector('.accretion-disk');
    const eventHorizon = document.querySelector('.event-horizon');
    
    if (blackhole) {
        const intensity = Math.min(scrollPercent * 2, 1);
        
        if (accretionDisk) {
            const baseSpeed = 12;
            const newSpeed = Math.max(baseSpeed - scrollPercent * 8, 2);
            accretionDisk.style.animationDuration = `${newSpeed}s`;
        }
        
        if (eventHorizon) {
            const glowIntensity = 50 + scrollPercent * 100;
            eventHorizon.style.boxShadow = `
                0 0 ${glowIntensity}px rgba(255, 140, 0, ${0.5 + scrollPercent * 0.5}),
                0 0 ${glowIntensity * 2}px rgba(255, 69, 0, ${0.2 + scrollPercent * 0.3}),
                inset 0 0 50px rgba(0, 0, 0, 1)
            `;
        }
    }
});

// Mouse movement effect on black hole
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    
    const blackholeCenter = document.querySelector('.blackhole-center');
    const gravitationalLensing = document.querySelector('.gravitational-lensing');
    
    if (blackholeCenter) {
        blackholeCenter.style.transform = `translate(${-50 + mouseX * 2}%, ${-50 + mouseY * 2}%) scale(${1 + Math.abs(mouseX + mouseY) * 0.1})`;
    }
    
    if (gravitationalLensing) {
        gravitationalLensing.style.transform = `translate(${-50 + mouseX * 1}%, ${-50 + mouseY * 1}%) scale(${1 + Math.abs(mouseX + mouseY) * 0.05})`;
    }
});

// Add particle interaction on hero section
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationDuration = '5s';
            particle.style.opacity = '1';
        });
    });
    
    heroSection.addEventListener('mouseleave', () => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.animationDuration = '10s';
            particle.style.opacity = '0.8';
        });
    });
}

// Typing effect for hero headline
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Initialize typing effect when hero is visible
const heroTypingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const headline = document.querySelector('.headline-main');
            if (headline) {
                const originalText = headline.textContent;
                setTimeout(() => {
                    typeWriter(headline, originalText, 30);
                }, 1000);
            }
            heroTypingObserver.unobserve(entry.target);
        }
    });
});

const heroElement = document.querySelector('.hero');
if (heroElement) {
    heroTypingObserver.observe(heroElement);
}

// Scroll indicator click handler
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#about').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll('.float-item');
    
    floatingElements.forEach((element, index) => {
        const speed = element.dataset.speed || 1;
        const yPos = -(scrolled * speed * 0.1);
        element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// Add hover effects to stats
document.querySelectorAll('.stat').forEach(stat => {
    stat.addEventListener('mouseenter', () => {
        stat.style.transform = 'translateY(-10px) scale(1.05)';
    });
    
    stat.addEventListener('mouseleave', () => {
        stat.style.transform = 'translateY(0) scale(1)';
    });
});

// Dynamic background color change based on scroll
window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    const hero = document.querySelector('.hero');
    
    if (hero && scrollPercent < 0.2) {
        const opacity = Math.max(0.3, 1 - scrollPercent * 5);
        hero.style.background = `linear-gradient(135deg, rgba(102, 126, 234, ${opacity}) 0%, rgba(118, 75, 162, ${opacity}) 100%)`;
    }
});

// Add skill highlighting animation
function highlightSkills() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach((highlight, index) => {
        setTimeout(() => {
            highlight.style.animation = 'pulse 0.6s ease';
        }, index * 200);
    });
}

// Trigger skill highlighting when about section is visible
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            highlightSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
});

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    skillsObserver.observe(aboutSection);
}

// Animate strength items on scroll
const strengthObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const strengthItems = document.querySelectorAll('.strength-item');
            strengthItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100);
            });
            strengthObserver.unobserve(entry.target);
        }
    });
});

const strengthsGrid = document.querySelector('.strengths-grid');
if (strengthsGrid) {
    // Initially hide strength items
    document.querySelectorAll('.strength-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    strengthObserver.observe(strengthsGrid);
}

// Profile card hover effect
const profileCard = document.querySelector('.profile-card');
if (profileCard) {
    profileCard.addEventListener('mouseenter', () => {
        profileCard.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    profileCard.addEventListener('mouseleave', () => {
        profileCard.style.transform = 'translateY(0) scale(1)';
    });
}

// Skills section animations
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skill level bars
            const levelFills = entry.target.querySelectorAll('.level-fill');
            levelFills.forEach((fill, index) => {
                setTimeout(() => {
                    const width = fill.dataset.width;
                    fill.style.width = width + '%';
                }, index * 200);
            });
            
            // Animate skill items
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 150);
            });
            
            skillsObserver.unobserve(entry.target);
        }
    });
});

// Observe skills section
const skillsSection = document.querySelector('.skills');
if (skillsSection) {
    // Initially hide skill items
    document.querySelectorAll('.skill-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    skillsObserver.observe(skillsSection);
}

// Tech tags hover effects
document.querySelectorAll('.tech-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// Summary items counter animation
const summaryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const summaryNumbers = entry.target.querySelectorAll('.summary-number');
            summaryNumbers.forEach(number => {
                const text = number.textContent;
                const value = parseInt(text.replace(/\D/g, ''));
                if (value) {
                    number.textContent = '0';
                    setTimeout(() => {
                        animateCounter(number, value, 1500);
                        setTimeout(() => {
                            if (text.includes('+')) {
                                number.textContent = value + '+';
                            }
                        }, 1500);
                    }, 300);
                }
            });
            summaryObserver.unobserve(entry.target);
        }
    });
});

const skillsSummary = document.querySelector('.skills-summary');
if (skillsSummary) {
    summaryObserver.observe(skillsSummary);
}

// Experience timeline animations
const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, index * 200);
            });
            timelineObserver.unobserve(entry.target);
        }
    });
});

const timelineSection = document.querySelector('.timeline');
if (timelineSection) {
    // Initially hide timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    timelineObserver.observe(timelineSection);
}

// Skill tags in experience section hover effects
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-3px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// Career summary stats animation
const careerSummaryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const summaryStats = entry.target.querySelectorAll('.summary-stat');
            summaryStats.forEach((stat, index) => {
                setTimeout(() => {
                    stat.style.opacity = '1';
                    stat.style.transform = 'translateY(0)';
                }, index * 150);
            });
            careerSummaryObserver.unobserve(entry.target);
        }
    });
});

const careerSummary = document.querySelector('.career-summary');
if (careerSummary) {
    // Initially hide summary stats
    document.querySelectorAll('.summary-stat').forEach(stat => {
        stat.style.opacity = '0';
        stat.style.transform = 'translateY(20px)';
        stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    careerSummaryObserver.observe(careerSummary);
}
// Multi-page Navigation
document.addEventListener('DOMContentLoaded', () => {
    // Close mobile menu when clicking on navigation links
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            const hamburger = document.querySelector('.hamburger');
            const navMenu = document.querySelector('.nav-menu');
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Set active navigation state based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
// Retro Birthday Ad Button Functionality
document.addEventListener('DOMContentLoaded', () => {
    const retroAdButton = document.getElementById('retroAdButton');
    const birthdayBuddies = document.getElementById('birthdayBuddies');
    const closeBirthday = document.getElementById('closeBirthday');
    
    if (retroAdButton && birthdayBuddies) {
        // Handle ad button click
        retroAdButton.addEventListener('click', () => {
            // Hide the annoying ad button
            retroAdButton.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                retroAdButton.style.display = 'none';
            }, 500);
            
            // Show birthday buddies section
            birthdayBuddies.style.display = 'block';
            
            // Show birthday content
            const birthdayContent = document.getElementById('birthdayContent');
            if (birthdayContent) {
                birthdayContent.style.display = 'block';
            }
            
            // Add confetti celebration
            createConfetti();
            
            // Scroll to the section
            birthdayBuddies.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
        
        // Handle close button
        if (closeBirthday) {
            closeBirthday.addEventListener('click', () => {
                // Hide birthday section
                birthdayBuddies.style.animation = 'slideOutToLeft 0.5s ease';
                setTimeout(() => {
                    birthdayBuddies.style.display = 'none';
                    birthdayBuddies.style.animation = '';
                    
                    // Show the ad button again (like those persistent ads!)
                    retroAdButton.style.display = 'flex';
                    retroAdButton.style.animation = 'slideInFromLeft 0.5s ease';
                }, 500);
            });
        }
        
        // Make the ad button extra annoying by occasionally changing text
        setInterval(() => {
            if (retroAdButton.style.display !== 'none') {
                const adTexts = [
                    'You share your BDay with',
                    '🎂 Who shares your BDay?',
                    '🎉 Your Birthday Buddies',
                    '🎁 Same Birthday as You!',
                    '✨ Birthday Twins!',
                    '🎊 Your BDay Match!',
                    '🔥 Birthday Connection!',
                    '💥 Same Date Born!',
                    '⭐ Birthday Stars!',
                    '💎 Birthday Gems!'
                ];
                const subTexts = [
                    'Click to find out!',
                    'Discover now!',
                    'Find your twins!',
                    'Amazing matches!',
                    'Celebrity twins!',
                    'Famous birthdays!',
                    'Birthday magic!',
                    'Discover stars!'
                ];
                
                const randomText = adTexts[Math.floor(Math.random() * adTexts.length)];
                const randomSubText = subTexts[Math.floor(Math.random() * subTexts.length)];
                
                const adTextElement = retroAdButton.querySelector('.ad-text');
                const adSubTextElement = retroAdButton.querySelector('.ad-subtext');
                
                if (adTextElement) {
                    adTextElement.textContent = randomText;
                }
                if (adSubTextElement) {
                    adSubTextElement.textContent = randomSubText;
                }
            }
        }, 3000);
        
        // Add random position shifts (like those annoying moving ads)
        setInterval(() => {
            if (retroAdButton.style.display !== 'none') {
                const randomShift = Math.random() * 20 - 10; // -10 to +10px
                retroAdButton.style.transform = `translateX(${randomShift}px)`;
                
                setTimeout(() => {
                    retroAdButton.style.transform = 'translateX(0)';
                }, 200);
            }
        }, 5000);
        
        // Add occasional size pulsing (extra annoying!)
        setInterval(() => {
            if (retroAdButton.style.display !== 'none') {
                retroAdButton.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    retroAdButton.style.transform = 'scale(1)';
                }, 300);
            }
        }, 8000);
        
        // Change border colors randomly
        setInterval(() => {
            if (retroAdButton.style.display !== 'none') {
                const colors = ['#ffff00', '#ff0080', '#00ff80', '#ff8000', '#8000ff'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];
                retroAdButton.style.borderColor = randomColor;
            }
        }, 2000);
    }
});

// Fun confetti effect for birthday reveal
function createConfetti() {
    const colors = ['#ffd700', '#ff69b4', '#ff1493', '#ffb347', '#ffa500'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    document.body.appendChild(confettiContainer);
    
    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            top: -10px;
            left: ${Math.random() * 100}%;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            transform: rotate(${Math.random() * 360}deg);
        `;
        confettiContainer.appendChild(confetti);
    }
    
    // Remove confetti after animation
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}

// Add confetti animation keyframes
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateY(0);
        }
        to {
            opacity: 0;
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(confettiStyle);

// ===== STANDALONE COSMIC AUDIO SYSTEM =====
// This system is completely self-contained and bulletproof
(function() {
    'use strict';
    
    console.log('🚀 LOADING STANDALONE COSMIC AUDIO...');
    
    // Completely isolated audio system
    const COSMIC_AUDIO = {
        isPlaying: false,
        audioContext: null,
        currentSources: [],
        currentTrack: 'deep-space',
        
        // Initialize audio context
        initContext: function() {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                console.log('🎼 Audio context created');
            }
            return this.audioContext;
        },
        
        // Stop all current sources
        stopAll: function() {
            this.currentSources.forEach(source => {
                try { source.stop(); } catch (e) { /* already stopped */ }
            });
            this.currentSources = [];
        },
        
        // Create deep space humming
        createDeepSpace: function(ctx) {
            const sources = [];
            
            // Main hum
            const hum = ctx.createOscillator();
            const humGain = ctx.createGain();
            hum.frequency.setValueAtTime(60, ctx.currentTime);
            hum.type = 'sine';
            humGain.gain.setValueAtTime(0.3, ctx.currentTime);
            hum.connect(humGain);
            humGain.connect(ctx.destination);
            hum.start();
            sources.push(hum);
            
            // Harmonic
            const harmonic = ctx.createOscillator();
            const harmonicGain = ctx.createGain();
            harmonic.frequency.setValueAtTime(120, ctx.currentTime);
            harmonic.type = 'triangle';
            harmonicGain.gain.setValueAtTime(0.1, ctx.currentTime);
            harmonic.connect(harmonicGain);
            harmonicGain.connect(ctx.destination);
            harmonic.start();
            sources.push(harmonic);
            
            return sources;
        },
        
        // Create cosmic winds
        createCosmicWinds: function(ctx) {
            const sources = [];
            
            // Create noise buffer
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            const whiteNoise = ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            
            const windGain = ctx.createGain();
            windGain.gain.setValueAtTime(0.2, ctx.currentTime);
            
            whiteNoise.connect(filter);
            filter.connect(windGain);
            windGain.connect(ctx.destination);
            whiteNoise.start();
            sources.push(whiteNoise);
            
            return sources;
        },
        
        // Create stellar harmony
        createStellarHarmony: function(ctx) {
            const sources = [];
            const frequencies = [220, 330, 440, 550];
            
            frequencies.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                sources.push(osc);
            });
            
            return sources;
        },
        
        // Create nebula dreams
        createNebulaDreams: function(ctx) {
            const sources = [];
            
            const pad1 = ctx.createOscillator();
            const pad2 = ctx.createOscillator();
            const padGain = ctx.createGain();
            
            pad1.frequency.setValueAtTime(110, ctx.currentTime);
            pad2.frequency.setValueAtTime(165, ctx.currentTime);
            pad1.type = 'sawtooth';
            pad2.type = 'sawtooth';
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, ctx.currentTime);
            
            padGain.gain.setValueAtTime(0.15, ctx.currentTime);
            
            pad1.connect(filter);
            pad2.connect(filter);
            filter.connect(padGain);
            padGain.connect(ctx.destination);
            
            pad1.start();
            pad2.start();
            sources.push(pad1, pad2);
            
            return sources;
        },
        
        // Create quantum pulse
        createQuantumPulse: function(ctx) {
            const sources = [];
            
            const pulse = ctx.createOscillator();
            const pulseGain = ctx.createGain();
            
            pulse.frequency.setValueAtTime(80, ctx.currentTime);
            pulse.type = 'square';
            pulseGain.gain.setValueAtTime(0.2, ctx.currentTime);
            
            pulse.connect(pulseGain);
            pulseGain.connect(ctx.destination);
            pulse.start();
            sources.push(pulse);
            
            return sources;
        },
        
        // Track definitions
        tracks: {
            'deep-space': { name: '🌌 Deep Space Humming', create: 'createDeepSpace' },
            'cosmic-winds': { name: '💨 Cosmic Winds', create: 'createCosmicWinds' },
            'stellar-harmony': { name: '⭐ Stellar Harmony', create: 'createStellarHarmony' },
            'nebula-dreams': { name: '🌠 Nebula Dreams', create: 'createNebulaDreams' },
            'quantum-pulse': { name: '⚛️ Quantum Pulse', create: 'createQuantumPulse' }
        },
        
        // Play a track
        play: function(trackId) {
            console.log(`🎵 Playing: ${trackId}`);
            
            try {
                this.stopAll();
                
                const ctx = this.initContext();
                
                if (ctx.state === 'suspended') {
                    ctx.resume().then(() => {
                        this.startTrack(trackId, ctx);
                    });
                } else {
                    this.startTrack(trackId, ctx);
                }
            } catch (error) {
                console.error('❌ Play error:', error);
                alert('Audio error: ' + error.message);
            }
        },
        
        // Start specific track
        startTrack: function(trackId, ctx) {
            const track = this.tracks[trackId];
            if (track && this[track.create]) {
                this.currentSources = this[track.create](ctx);
                this.currentTrack = trackId;
                this.isPlaying = true;
                this.updateUI();
                console.log(`✅ Playing: ${track.name}`);
            }
        },
        
        // Stop audio
        stop: function() {
            this.stopAll();
            this.isPlaying = false;
            this.updateUI();
            console.log('⏹️ Audio stopped');
        },
        
        // Update UI
        updateUI: function() {
            const audioToggle = document.getElementById('audioToggle');
            if (audioToggle) {
                if (this.isPlaying) {
                    audioToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
                    audioToggle.classList.remove('muted');
                    audioToggle.title = 'Stop Audio';
                    audioToggle.style.boxShadow = '0 0 30px rgba(255, 140, 0, 0.8)';
                } else {
                    audioToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
                    audioToggle.classList.add('muted');
                    audioToggle.title = 'Play Audio';
                    audioToggle.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.3)';
                }
            }
        }
    };
    
    // Initialize when DOM is ready
    function initCosmicAudio() {
        console.log('🎵 Initializing Cosmic Audio System...');
        
        // Main audio button
        const audioToggle = document.getElementById('audioToggle');
        if (audioToggle) {
            console.log('✅ Audio button found');
            audioToggle.addEventListener('click', () => {
                console.log('🎵 Button clicked, isPlaying:', COSMIC_AUDIO.isPlaying);
                if (COSMIC_AUDIO.isPlaying) {
                    COSMIC_AUDIO.stop();
                } else {
                    COSMIC_AUDIO.play(COSMIC_AUDIO.currentTrack);
                }
            });
            COSMIC_AUDIO.updateUI();
        } else {
            console.error('❌ Audio button not found');
        }
        
        // Playlist functionality
        const playlistToggle = document.getElementById('playlistToggle');
        const musicPlaylist = document.getElementById('musicPlaylist');
        
        if (playlistToggle && musicPlaylist) {
            playlistToggle.addEventListener('click', () => {
                if (musicPlaylist.style.display === 'none' || !musicPlaylist.style.display) {
                    musicPlaylist.style.display = 'block';
                    playlistToggle.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    musicPlaylist.style.display = 'none';
                    playlistToggle.innerHTML = '<i class="fas fa-list"></i>';
                }
            });
        }
        
        // Track selection
        document.querySelectorAll('.track-item').forEach(trackElement => {
            trackElement.addEventListener('click', () => {
                const trackId = trackElement.dataset.track;
                console.log(`🎶 Track selected: ${trackId}`);
                
                if (trackId && COSMIC_AUDIO.tracks[trackId]) {
                    COSMIC_AUDIO.currentTrack = trackId;
                    COSMIC_AUDIO.play(trackId);
                    
                    // Update UI
                    document.querySelectorAll('.track-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    trackElement.classList.add('active');
                    
                    // Hide playlist
                    if (musicPlaylist) {
                        musicPlaylist.style.display = 'none';
                        playlistToggle.innerHTML = '<i class="fas fa-list"></i>';
                    }
                }
            });
        });
        
        console.log('🎵 COSMIC AUDIO SYSTEM READY!');
        console.log('🎛️ Click the speaker button to start!');
    }
    
    // Global test functions
    window.testCosmicAudio = function() {
        console.log('🧪 Testing cosmic audio...');
        if (COSMIC_AUDIO.isPlaying) {
            COSMIC_AUDIO.stop();
        } else {
            COSMIC_AUDIO.play('deep-space');
        }
    };
    
    window.testBeep = function() {
        console.log('🔔 Testing beep...');
        try {
            const ctx = COSMIC_AUDIO.initContext();
            if (ctx.state === 'suspended') ctx.resume();
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
            
            console.log('✅ Beep played');
        } catch (error) {
            console.error('❌ Beep failed:', error);
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCosmicAudio);
    } else {
        initCosmicAudio();
    }
    
})();