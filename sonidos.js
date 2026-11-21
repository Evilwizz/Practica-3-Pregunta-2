// ==========================================================================
// Sistema de Audio Dual: Efectos WAV + Sintetizador Web Audio API Nativo
// Funciona 100% en local (file://) y servidores web sin errores de CORS
// Estudiante: Aldair Jose Lozano Santiago
// ==========================================================================

var Sonidos = (function() {
    var audioCtx = null;
    var muted = false;
    var isBgmPlaying = false;
    var bgmInterval = null;

    // Archivos de sonido pre-cargados
    var audioFiles = {
        disparo: new Audio('audio/disparo.wav'),
        colision: new Audio('audio/colision.wav'),
        victoria: new Audio('audio/victoria.wav'),
        bgm: new Audio('audio/bgm.wav')
    };
    audioFiles.bgm.loop = true;

    function getAudioContext() {
        if (!audioCtx) {
            var AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    return {
        init: function() {
            var unlock = function() {
                getAudioContext();
                window.removeEventListener('click', unlock);
                window.removeEventListener('keydown', unlock);
                window.removeEventListener('touchstart', unlock);
            };
            window.addEventListener('click', unlock);
            window.addEventListener('keydown', unlock);
            window.addEventListener('touchstart', unlock);
        },

        isMuted: function() {
            return muted;
        },

        toggleMute: function() {
            muted = !muted;
            if (muted) {
                this.stopBGM();
            } else {
                this.playBGM();
            }
            return muted;
        },

        // Sonido de Disparo Láser (WAV con fallback a oscilador)
        playDisparo: function() {
            if (muted) return;
            try {
                audioFiles.disparo.currentTime = 0;
                audioFiles.disparo.volume = 0.6;
                var p = audioFiles.disparo.play();
                if (p !== undefined) {
                    p.catch(function() {
                        Sonidos.synthDisparo();
                    });
                }
            } catch(e) {
                Sonidos.synthDisparo();
            }
        },

        synthDisparo: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var osc = ctx.createOscillator();
            var gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(950, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.16);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.16);
        },

        // Sonido de Colisión / Explosión
        playColision: function() {
            if (muted) return;
            try {
                audioFiles.colision.currentTime = 0;
                audioFiles.colision.volume = 0.8;
                var p = audioFiles.colision.play();
                if (p !== undefined) {
                    p.catch(function() {
                        Sonidos.synthColision();
                    });
                }
            } catch(e) {
                Sonidos.synthColision();
            }
        },

        synthColision: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var bufferSize = ctx.sampleRate * 0.35;
            var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            var data = buffer.getChannelData(0);
            for (var i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * Math.exp(-5 * (i / bufferSize));
            }
            var noise = ctx.createBufferSource();
            noise.buffer = buffer;

            var filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.35);

            var gain = ctx.createGain();
            gain.gain.setValueAtTime(0.7, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            noise.start(ctx.currentTime);
        },

        // Sonido de Victoria
        playVictoria: function() {
            if (muted) return;
            try {
                audioFiles.victoria.currentTime = 0;
                audioFiles.victoria.volume = 0.85;
                var p = audioFiles.victoria.play();
                if (p !== undefined) {
                    p.catch(function() {
                        Sonidos.synthVictoria();
                    });
                }
            } catch(e) {
                Sonidos.synthVictoria();
            }
        },

        synthVictoria: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var notas = [523.25, 659.25, 783.99, 1046.50];
            notas.forEach(function(freq, i) {
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.14);
                gain.gain.setValueAtTime(0.25, ctx.currentTime + i * 0.14);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.14 + 0.3);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.14);
                osc.stop(ctx.currentTime + i * 0.14 + 0.3);
            });
        },

        // Música de fondo
        playBGM: function() {
            if (muted || isBgmPlaying) return;
            isBgmPlaying = true;
            try {
                audioFiles.bgm.volume = 0.35;
                var p = audioFiles.bgm.play();
                if (p !== undefined) {
                    p.catch(function() {
                        Sonidos.startSynthBGM();
                    });
                }
            } catch(e) {
                Sonidos.startSynthBGM();
            }
        },

        stopBGM: function() {
            isBgmPlaying = false;
            try {
                audioFiles.bgm.pause();
                audioFiles.bgm.currentTime = 0;
            } catch(e) {}
            if (bgmInterval) {
                clearInterval(bgmInterval);
                bgmInterval = null;
            }
        },

        startSynthBGM: function() {
            var ctx = getAudioContext();
            if (!ctx) return;
            var bassNotes = [110, 110, 130.81, 146.83, 110, 110, 164.81, 146.83];
            var step = 0;
            if (bgmInterval) clearInterval(bgmInterval);
            bgmInterval = setInterval(function() {
                if (muted || !isBgmPlaying) return;
                var freq = bassNotes[step % bassNotes.length];
                step++;
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(0.08, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.22);
            }, 250);
        }
    };
})();

// Auto-inicializar detector de interacción
Sonidos.init();
