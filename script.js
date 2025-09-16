// Variables globales del juego
let currentNumber = 0;
let decenas = 0;
let unidades = 0;
let score = 0;
let level = 1;
let currentQuestion = 0;
let questionsPerLevel = 5;
let isAnswered = false;

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const playAgainBtn = document.getElementById('play-again-btn');

const questionNumber = document.getElementById('question-number');
const decenasCount = document.getElementById('decenas-count');
const unidadesCount = document.getElementById('unidades-count');
const decenasBox = document.getElementById('decenas-box');
const unidadesBox = document.getElementById('unidades-box');
const decenasBlocks = document.getElementById('decenas-blocks');
const unidadesBlocks = document.getElementById('unidades-blocks');

const decenasMinus = document.getElementById('decenas-minus');
const decenasPlus = document.getElementById('decenas-plus');
const unidadesMinus = document.getElementById('unidades-minus');
const unidadesPlus = document.getElementById('unidades-plus');

const checkBtn = document.getElementById('check-btn');
const nextBtn = document.getElementById('next-btn');
const feedback = document.getElementById('feedback');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const finalScore = document.getElementById('final-score');
const finalLevel = document.getElementById('final-level');

// Sonidos del juego (usando Web Audio API)
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.initAudio();
    }

    initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API no soportado');
        }
    }

    playTone(frequency, duration, type = 'sine') {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    playCorrect() {
        this.playTone(523, 0.2); // Do
        setTimeout(() => this.playTone(659, 0.2), 100); // Mi
        setTimeout(() => this.playTone(784, 0.3), 200); // Sol
    }

    playIncorrect() {
        this.playTone(200, 0.5, 'sawtooth');
    }

    playClick() {
        this.playTone(800, 0.1);
    }

    playLevelUp() {
        this.playTone(523, 0.2); // Do
        setTimeout(() => this.playTone(659, 0.2), 100); // Mi
        setTimeout(() => this.playTone(784, 0.2), 200); // Sol
        setTimeout(() => this.playTone(1047, 0.4), 300); // Do alto
    }
}

const soundManager = new SoundManager();

// Inicialización del juego
function initGame() {
    showScreen('start');
    setupEventListeners();
}

function setupEventListeners() {
    startBtn.addEventListener('click', startGame);
    playAgainBtn.addEventListener('click', startGame);
    
    decenasMinus.addEventListener('click', () => changeDecenas(-1));
    decenasPlus.addEventListener('click', () => changeDecenas(1));
    unidadesMinus.addEventListener('click', () => changeUnidades(-1));
    unidadesPlus.addEventListener('click', () => changeUnidades(1));
    
    checkBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
}

function showScreen(screenName) {
    startScreen.classList.remove('active');
    gameScreen.classList.remove('active');
    resultsScreen.classList.remove('active');
    
    switch(screenName) {
        case 'start':
            startScreen.classList.add('active');
            break;
        case 'game':
            gameScreen.classList.add('active');
            break;
        case 'results':
            resultsScreen.classList.add('active');
            break;
    }
}

function startGame() {
    score = 0;
    level = 1;
    currentQuestion = 0;
    isAnswered = false;
    
    updateScore();
    updateLevel();
    generateNewQuestion();
    showScreen('game');
    
    // Efecto de partículas de inicio
    createParticles(50);
}

function generateNewQuestion() {
    // Generar número basado en el nivel
    let maxNumber;
    switch(level) {
        case 1:
            maxNumber = 20;
            break;
        case 2:
            maxNumber = 50;
            break;
        case 3:
            maxNumber = 99;
            break;
        default:
            maxNumber = 99;
    }
    
    currentNumber = Math.floor(Math.random() * maxNumber) + 1;
    questionNumber.textContent = currentNumber;
    
    // Resetear respuestas
    decenas = 0;
    unidades = 0;
    updateCounts();
    updateVisualBlocks();
    
    // Resetear botones
    checkBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    feedback.classList.remove('show', 'correct', 'incorrect');
    
    isAnswered = false;
}

function changeDecenas(delta) {
    if (isAnswered) return;
    
    const newDecenas = Math.max(0, Math.min(9, decenas + delta));
    if (newDecenas !== decenas) {
        decenas = newDecenas;
        updateCounts();
        updateVisualBlocks();
        soundManager.playClick();
        addButtonEffect(event.target);
    }
}

function changeUnidades(delta) {
    if (isAnswered) return;
    
    const newUnidades = Math.max(0, Math.min(9, unidades + delta));
    if (newUnidades !== unidades) {
        unidades = newUnidades;
        updateCounts();
        updateVisualBlocks();
        soundManager.playClick();
        addButtonEffect(event.target);
    }
}

function updateCounts() {
    decenasCount.textContent = decenas;
    unidadesCount.textContent = unidades;
}

function updateVisualBlocks() {
    // Limpiar bloques existentes
    decenasBlocks.innerHTML = '';
    unidadesBlocks.innerHTML = '';
    
    // Crear bloques de decenas
    for (let i = 0; i < decenas; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = '10';
        decenasBlocks.appendChild(block);
    }
    
    // Crear bloques de unidades
    for (let i = 0; i < unidades; i++) {
        const block = document.createElement('div');
        block.className = 'block';
        block.textContent = '1';
        unidadesBlocks.appendChild(block);
    }
}

function checkAnswer() {
    if (isAnswered) return;
    
    const correctDecenas = Math.floor(currentNumber / 10);
    const correctUnidades = currentNumber % 10;
    
    const isCorrect = decenas === correctDecenas && unidades === correctUnidades;
    
    isAnswered = true;
    checkBtn.style.display = 'none';
    nextBtn.style.display = 'block';
    
    if (isCorrect) {
        score += 10;
        updateScore();
        showFeedback('¡Correcto! 🎉', 'correct');
        soundManager.playCorrect();
        createParticles(20);
        addCelebrationEffect();
    } else {
        showFeedback(`Incorrecto. La respuesta correcta es ${correctDecenas} decenas y ${correctUnidades} unidades.`, 'incorrect');
        soundManager.playIncorrect();
        addShakeEffect();
    }
    
    currentQuestion++;
    
    if (currentQuestion >= questionsPerLevel) {
        levelUp();
    }
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback show ${type}`;
}

function nextQuestion() {
    if (currentQuestion >= questionsPerLevel) {
        if (level >= 3) {
            showResults();
        } else {
            levelUp();
        }
    } else {
        generateNewQuestion();
    }
}

function levelUp() {
    level++;
    currentQuestion = 0;
    updateLevel();
    soundManager.playLevelUp();
    showFeedback(`¡Nivel ${level}! 🚀`, 'correct');
    
    setTimeout(() => {
        generateNewQuestion();
    }, 2000);
}

function showResults() {
    finalScore.textContent = score;
    finalLevel.textContent = level;
    showScreen('results');
    
    // Efecto de celebración
    createParticles(100);
    addCelebrationEffect();
}

function updateScore() {
    scoreElement.textContent = score;
}

function updateLevel() {
    levelElement.textContent = level;
}

// Efectos visuales
function createParticles(count) {
    const container = document.querySelector('.game-container');
    
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        particle.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        
        container.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

function addButtonEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

function addCelebrationEffect() {
    const characters = document.querySelectorAll('.character');
    characters.forEach(char => {
        char.style.animation = 'celebrate 0.6s ease-in-out';
        setTimeout(() => {
            char.style.animation = '';
        }, 600);
    });
}

function addShakeEffect() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.animation = 'incorrectShake 0.6s ease-out';
    setTimeout(() => {
        gameContainer.style.animation = '';
    }, 600);
}

// Efectos táctiles para móviles
function addTouchEffects() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('touchstart', function(e) {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function(e) {
            this.style.transform = 'scale(1)';
        });
    });
}

// Optimizaciones para móviles
function optimizeForMobile() {
    // Prevenir zoom en inputs
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
    
    // Mejorar la experiencia táctil
    addTouchEffects();
    
    // Prevenir el menú contextual en botones
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('contextmenu', e => e.preventDefault());
    });
}

// Inicializar el juego cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initGame();
    optimizeForMobile();
    
    // Activar audio en la primera interacción del usuario
    document.addEventListener('click', function() {
        if (soundManager.audioContext && soundManager.audioContext.state === 'suspended') {
            soundManager.audioContext.resume();
        }
    }, { once: true });
});

// Manejar cambios de orientación en móviles
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        // Reajustar el layout si es necesario
        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.style.height = '100vh';
        }
    }, 100);
});

// Prevenir el scroll en móviles durante el juego
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.game-container')) {
        e.preventDefault();
    }
}, { passive: false });

// Mejorar la accesibilidad
function addAccessibilityFeatures() {
    // Agregar roles ARIA
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        gameContainer.setAttribute('role', 'application');
        gameContainer.setAttribute('aria-label', 'Juego educativo de unidades y decenas');
    }
    
    // Agregar navegación por teclado
    document.addEventListener('keydown', function(e) {
        if (gameScreen.classList.contains('active')) {
            switch(e.key) {
                case 'ArrowUp':
                    e.preventDefault();
                    changeDecenas(1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    changeDecenas(-1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    changeUnidades(-1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    changeUnidades(1);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (checkBtn.style.display !== 'none') {
                        checkAnswer();
                    } else if (nextBtn.style.display !== 'none') {
                        nextQuestion();
                    }
                    break;
            }
        }
    });
}

// Inicializar características de accesibilidad
addAccessibilityFeatures();
