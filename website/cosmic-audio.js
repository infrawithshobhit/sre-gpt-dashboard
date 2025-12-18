// COSMIC AUDIO SYSTEM - SEPARATE FILE
console.log('🚀 COSMIC AUDIO LOADING...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎵 Initializing Cosmic Audio...');
    
    // Audio state
    let isPlaying = false;
    let audioContext = null;
    let currentOscillator = null;
    let currentGain = null;
    let currentTrack = 'deep-space';
    
    // Get elements
    const audioToggle = document.getElementById('audioToggle');
    const playlistToggle = document.getElementById('playlistToggle');
    const musicPlaylist = document.getElementById('musicPlaylist');
    
    console.log('🔍 Elements found:', {
        audioToggle: !!audioToggle,
        playlistToggle: !!playlistToggle,
        musicPlaylist: !!musicPlaylist
    });
    
    // Create audio context
    function createAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎼 Audio context created');
        }
        return audioContext;
    }
    
    // Stop current audio
    function stopAudio() {
        if (currentOscillator) {
            try {
                currentOscillator.stop();
            } catch (e) {
                // Already stopped
            }
            currentOscillator = null;
            currentGain = null;
        }
        isPlaying = false;
        updateUI();
        console.log('⏹️ Audio stopped');
    }
    
    // Start audio with different tracks
    function startAudio(trackType = 'deep-space') {
        try {
            console.log(`🎵 Starting ${trackType}...`);
            
            // Stop any existing audio
            stopAudio();
            
            // Create audio context
            const ctx = createAudioContext();
            console.log('🎼 Audio context created, state:', ctx.state);
            
            // Resume if suspended
            if (ctx.state === 'suspended') {
                console.log('🔄 Audio context suspended, resuming...');
                ctx.resume().then(() => {
                    console.log('✅ Audio context resumed, state:', ctx.state);
                    playTrack(trackType, ctx);
                }).catch(error => {
                    console.error('❌ Failed to resume audio context:', error);
                    alert('Failed to resume audio: ' + error.message);
                });
            } else {
                console.log('✅ Audio context ready, playing track');
                playTrack(trackType, ctx);
            }
            
        } catch (error) {
            console.error('❌ Audio error:', error);
            alert('Audio failed: ' + error.message);
        }
    }
    
    // Play specific track
    function playTrack(trackType, ctx) {
        console.log(`🎶 Playing track: ${trackType}`);
        console.log('🎼 Audio context state in playTrack:', ctx.state);
        console.log('🔊 Audio context sample rate:', ctx.sampleRate);
        
        try {
            if (trackType === 'deep-space') {
            // Deep space humming
            currentOscillator = ctx.createOscillator();
            currentGain = ctx.createGain();
            
            currentOscillator.frequency.setValueAtTime(60, ctx.currentTime);
            currentOscillator.type = 'sine';
            currentGain.gain.setValueAtTime(0.3, ctx.currentTime);
            
            currentOscillator.connect(currentGain);
            currentGain.connect(ctx.destination);
            currentOscillator.start();
            
        } else if (trackType === 'cosmic-winds') {
            // Cosmic winds (filtered noise)
            const bufferSize = ctx.sampleRate * 2;
            const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            
            currentOscillator = ctx.createBufferSource();
            currentOscillator.buffer = noiseBuffer;
            currentOscillator.loop = true;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            
            currentGain = ctx.createGain();
            currentGain.gain.setValueAtTime(0.2, ctx.currentTime);
            
            currentOscillator.connect(filter);
            filter.connect(currentGain);
            currentGain.connect(ctx.destination);
            currentOscillator.start();
            
        } else if (trackType === 'stellar-harmony') {
            // Stellar harmony (chord)
            currentOscillator = ctx.createOscillator();
            currentGain = ctx.createGain();
            
            currentOscillator.frequency.setValueAtTime(220, ctx.currentTime);
            currentOscillator.type = 'sine';
            currentGain.gain.setValueAtTime(0.15, ctx.currentTime);
            
            currentOscillator.connect(currentGain);
            currentGain.connect(ctx.destination);
            currentOscillator.start();
            
        } else if (trackType === 'nebula-dreams') {
            // Nebula dreams (sawtooth pad)
            currentOscillator = ctx.createOscillator();
            currentGain = ctx.createGain();
            
            currentOscillator.frequency.setValueAtTime(110, ctx.currentTime);
            currentOscillator.type = 'sawtooth';
            currentGain.gain.setValueAtTime(0.2, ctx.currentTime);
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, ctx.currentTime);
            
            currentOscillator.connect(filter);
            filter.connect(currentGain);
            currentGain.connect(ctx.destination);
            currentOscillator.start();
            
        } else if (trackType === 'quantum-pulse') {
            // Quantum pulse (square wave)
            currentOscillator = ctx.createOscillator();
            currentGain = ctx.createGain();
            
            currentOscillator.frequency.setValueAtTime(80, ctx.currentTime);
            currentOscillator.type = 'square';
            currentGain.gain.setValueAtTime(0.2, ctx.currentTime);
            
            currentOscillator.connect(currentGain);
            currentGain.connect(ctx.destination);
            currentOscillator.start();
        }
        
            isPlaying = true;
            currentTrack = trackType;
            updateUI();
            console.log(`✅ Playing: ${trackType}`);
            console.log('🎵 Oscillator started, gain connected');
            
        } catch (error) {
            console.error('❌ Error in playTrack:', error);
            alert('Track playback error: ' + error.message);
        }
    }
    
    // Update UI
    function updateUI() {
        if (audioToggle) {
            if (isPlaying) {
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
    
    // Main audio button
    if (audioToggle) {
        console.log('✅ Setting up audio button');
        audioToggle.addEventListener('click', function() {
            console.log('🎵 Button clicked, isPlaying:', isPlaying);
            console.log('🎼 Audio context state:', audioContext ? audioContext.state : 'not created');
            
            if (isPlaying) {
                stopAudio();
            } else {
                startAudio(currentTrack);
            }
        });
        updateUI();
    } else {
        console.error('❌ Audio button not found');
    }
    
    // Playlist toggle
    if (playlistToggle && musicPlaylist) {
        playlistToggle.addEventListener('click', function() {
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
    const trackItems = document.querySelectorAll('.track-item');
    console.log(`🎵 Found ${trackItems.length} track items`);
    
    trackItems.forEach(function(trackElement) {
        trackElement.addEventListener('click', function() {
            const trackId = trackElement.dataset.track;
            console.log(`🎶 Track clicked: ${trackId}`);
            
            if (trackId) {
                currentTrack = trackId;
                startAudio(trackId);
                
                // Update UI
                trackItems.forEach(function(item) {
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
    window.testCosmicAudio = function() {
        console.log('🧪 Testing cosmic audio...');
        if (isPlaying) {
            stopAudio();
        } else {
            startAudio('deep-space');
        }
    };
    
    window.testBeep = function() {
        console.log('🔔 Testing beep...');
        try {
            const ctx = createAudioContext();
            console.log('🎼 Beep test - Audio context state:', ctx.state);
            
            if (ctx.state === 'suspended') {
                console.log('🔄 Resuming for beep test...');
                ctx.resume().then(() => {
                    console.log('✅ Context resumed for beep');
                    playBeep(ctx);
                });
            } else {
                playBeep(ctx);
            }
            
        } catch (error) {
            console.error('❌ Beep failed:', error);
        }
    };
    
    function playBeep(ctx) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        
        console.log('✅ Beep oscillator started');
        console.log('🔊 Frequency: 800Hz, Gain: 0.3, Duration: 0.5s');
    }
    
    // Simple test that should definitely work
    window.testSimpleAudio = function() {
        console.log('🧪 Testing simplest possible audio...');
        try {
            // Create new context each time to avoid issues
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🎼 New context state:', ctx.state);
            
            // Force resume
            ctx.resume().then(() => {
                console.log('🔄 Context resumed, creating simple tone...');
                
                const osc = ctx.createOscillator();
                osc.frequency.value = 440; // A4 note
                osc.type = 'sine';
                osc.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 1);
                
                console.log('✅ Simple 440Hz tone should play for 1 second');
            });
            
        } catch (error) {
            console.error('❌ Simple audio test failed:', error);
            alert('Simple audio test failed: ' + error.message);
        }
    };
    
    console.log('🎵 COSMIC AUDIO SYSTEM READY!');
    console.log('🧪 Test functions: testCosmicAudio(), testBeep()');
    console.log('🎛️ Click the speaker button to start!');
});