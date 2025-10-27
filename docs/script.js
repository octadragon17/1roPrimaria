// Datos del Padre Nuestro en inglés y español con audio
const prayerPhrases = [
    { english: "Our Father", spanish: "Padre Nuestro", audioId: 1 },
    { english: "Who art in heaven", spanish: "Que estás en el cielo", audioId: 2 },
    { english: "Hallowed be thy name", spanish: "Bendito sea tu nombre", audioId: 3 },
    { english: "Thy kingdom come", spanish: "Venga a nosotros tu reino", audioId: 4 },
    { english: "Thy will be done", spanish: "Hágase tu voluntad", audioId: 5 },
    { english: "On Earth as it is in heaven", spanish: "Así sea en la tierra como en el cielo", audioId: 6 },
    { english: "Give us this day", spanish: "Danos hoy", audioId: 7 },
    { english: "Our daily bread", spanish: "Nuestro pan de cada día", audioId: 8 },
    { english: "And forgive us our trespasses", spanish: "Y perdona nuestras ofensas", audioId: 9 },
    { english: "As we forgive those", spanish: "Como nosotros perdonamos a los", audioId: 10 },
    { english: "Who trespass against us", spanish: "Que nos ofenden", audioId: 11 },
    { english: "Lead us not into temptation", spanish: "No nos dejes caer en la tentación", audioId: 12 },
    { english: "But deliver us from evil", spanish: "Y líbranos de todo mal", audioId: 13 },
    { english: "Amen", spanish: "Amén", audioId: 14 }
];

// Variables del juego
let gameState = {
    score: 0,
    level: 1,
    lives: 3,
    selectedEnglish: null,
    selectedSpanish: null,
    matchedPairs: 0,
    totalPairs: 0,
    isGameActive: false,
    currentPhrases: [],
    audioEnabled: true,
    audioRate: 0.5, // Velocidad del audio (0.3 a 1.0)
    childName: '',
    gameMode: 'matching', // 'matching' o 'pronunciation'
    pronunciationState: {
        currentPhraseIndex: 0,
        isRecording: false,
        recognition: null,
        completedPhrases: []
    }
};

// Elementos del DOM
const elements = {
    score: document.getElementById('score'),
    level: document.getElementById('level'),
    lives: document.getElementById('lives'),
    englishPhrases: document.getElementById('englishPhrases'),
    spanishPhrases: document.getElementById('spanishPhrases'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    hintBtn: document.getElementById('hintBtn'),
    audioToggleBtn: document.getElementById('audioToggleBtn'),
    progressFill: document.getElementById('progressFill'),
    celebration: document.getElementById('celebration'),
    gameOver: document.getElementById('gameOver'),
    finalScore: document.getElementById('finalScore'),
    nextLevelBtn: document.getElementById('nextLevelBtn'),
    playAgainBtn: document.getElementById('playAgainBtn'),
    // Nuevos elementos para pronunciación
    gameContainer: document.getElementById('gameContainer'),
    nameModal: document.getElementById('nameModal'),
    childNameInput: document.getElementById('childName'),
    startMatchingBtn: document.getElementById('startMatchingBtn'),
    startPronunciationBtn: document.getElementById('startPronunciationBtn'),
    pronunciationModal: document.getElementById('pronunciationModal'),
    childNameDisplay: document.getElementById('childNameDisplay'),
    currentPhraseText: document.getElementById('currentPhraseText'),
    listenBtn: document.getElementById('listenBtn'),
    recordBtn: document.getElementById('recordBtn'),
    nextPhraseBtn: document.getElementById('nextPhraseBtn'),
    currentPhraseNumber: document.getElementById('currentPhraseNumber'),
    totalPhrases: document.getElementById('totalPhrases'),
    phraseProgressFill: document.getElementById('phraseProgressFill'),
    pronunciationFeedback: document.getElementById('pronunciationFeedback'),
    congratulationsModal: document.getElementById('congratulationsModal'),
    congratulationsName: document.getElementById('congratulationsName'),
    playAgainPronunciationBtn: document.getElementById('playAgainPronunciationBtn'),
    backToMenuBtn: document.getElementById('backToMenuBtn'),
    // Control de velocidad
    speedControl: document.getElementById('speedControl'),
    audioSpeed: document.getElementById('audioSpeed'),
    speedDisplay: document.getElementById('speedDisplay')
};

// Inicialización del juego
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateDisplay();
    loadVoices(); // Cargar voces para el audio
    showNameModal(); // Mostrar modal de nombre al inicio
    // No inicializar reconocimiento de voz hasta que se seleccione el modo de pronunciación
});

function setupEventListeners() {
    // Event listeners del juego de emparejamiento
    elements.startBtn.addEventListener('click', startGame);
    elements.resetBtn.addEventListener('click', resetGame);
    elements.hintBtn.addEventListener('click', showHint);
    elements.audioToggleBtn.addEventListener('click', toggleAudio);
    elements.nextLevelBtn.addEventListener('click', nextLevel);
    elements.playAgainBtn.addEventListener('click', playAgain);
    
    // Event listeners del modal de nombre
    elements.startMatchingBtn.addEventListener('click', startMatchingGame);
    elements.startPronunciationBtn.addEventListener('click', startPronunciationGame);
    
    // Event listeners del modo de pronunciación
    elements.listenBtn.addEventListener('click', playCurrentPhrase);
    elements.recordBtn.addEventListener('click', toggleRecording);
    elements.nextPhraseBtn.addEventListener('click', nextPhrase);
    elements.playAgainPronunciationBtn.addEventListener('click', restartPronunciation);
    elements.backToMenuBtn.addEventListener('click', backToMenu);
    
    // Permitir Enter en el input de nombre
    elements.childNameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            startMatchingGame();
        }
    });
    
    // Control de velocidad
    elements.audioSpeed.addEventListener('input', function() {
        gameState.audioRate = parseFloat(elements.audioSpeed.value);
        elements.speedDisplay.textContent = gameState.audioRate + 'x';
    });
}

function startGame() {
    gameState.isGameActive = true;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.matchedPairs = 0;
    
    elements.startBtn.style.display = 'none';
    elements.resetBtn.style.display = 'inline-block';
    elements.hintBtn.style.display = 'inline-block';
    
    loadLevel();
}

function loadLevel() {
    // Seleccionar frases para el nivel actual
    const phrasesPerLevel = Math.min(4 + gameState.level, prayerPhrases.length);
    gameState.currentPhrases = getRandomPhrases(phrasesPerLevel);
    gameState.totalPairs = gameState.currentPhrases.length;
    gameState.matchedPairs = 0;
    
    createPhraseCards();
    updateDisplay();
    updateProgress();
}

function getRandomPhrases(count) {
    const shuffled = [...prayerPhrases].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function createPhraseCards() {
    // Limpiar contenedores
    elements.englishPhrases.innerHTML = '';
    elements.spanishPhrases.innerHTML = '';
    
    // Crear tarjetas en inglés
    const shuffledEnglish = [...gameState.currentPhrases].sort(() => 0.5 - Math.random());
    shuffledEnglish.forEach((phrase, index) => {
        const card = createPhraseCard(phrase.english, 'english', index);
        elements.englishPhrases.appendChild(card);
    });
    
    // Crear tarjetas en español
    const shuffledSpanish = [...gameState.currentPhrases].sort(() => 0.5 - Math.random());
    shuffledSpanish.forEach((phrase, index) => {
        const card = createPhraseCard(phrase.spanish, 'spanish', index);
        elements.spanishPhrases.appendChild(card);
    });
}

function createPhraseCard(text, type, index) {
    const card = document.createElement('div');
    card.className = 'phrase-card';
    
    // Crear contenedor para el texto y el botón de audio
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';
    contentDiv.textContent = text;
    
    // Crear botón de audio
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-btn';
    audioBtn.innerHTML = '🔊';
    audioBtn.title = 'Escuchar pronunciación';
    
    // Agregar evento para reproducir audio
    audioBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se active la selección de la tarjeta
        
        const language = type === 'english' ? 'en-US' : 'es-ES';
        playPhraseAudio(text, language);
        
        // Efecto visual en el botón
        audioBtn.style.transform = 'scale(1.2)';
        audioBtn.style.color = '#ff6b6b';
        setTimeout(() => {
            audioBtn.style.transform = 'scale(1)';
            audioBtn.style.color = '';
        }, 200);
    });
    
    // Agregar elementos al card
    card.appendChild(contentDiv);
    card.appendChild(audioBtn);
    
    card.dataset.type = type;
    card.dataset.index = index;
    card.dataset.text = text;
    
    card.addEventListener('click', () => selectCard(card));
    
    return card;
}

function selectCard(card) {
    if (!gameState.isGameActive || card.classList.contains('matched')) {
        return;
    }
    
    const type = card.dataset.type;
    const text = card.dataset.text;
    
    // Deseleccionar tarjetas del mismo tipo
    document.querySelectorAll(`.phrase-card[data-type="${type}"]`).forEach(c => {
        c.classList.remove('selected');
    });
    
    // Seleccionar tarjeta actual
    card.classList.add('selected');
    
    if (type === 'english') {
        gameState.selectedEnglish = { card, text };
        gameState.selectedSpanish = null;
    } else {
        gameState.selectedSpanish = { card, text };
    }
    
    // Verificar si hay una coincidencia
    if (gameState.selectedEnglish && gameState.selectedSpanish) {
        checkMatch();
    }
}

function checkMatch() {
    const englishText = gameState.selectedEnglish.text;
    const spanishText = gameState.selectedSpanish.text;
    
    // Buscar la frase correspondiente
    const matchingPhrase = prayerPhrases.find(phrase => 
        phrase.english === englishText && phrase.spanish === spanishText
    );
    
    if (matchingPhrase) {
        // ¡Coincidencia correcta!
        handleCorrectMatch();
    } else {
        // Coincidencia incorrecta
        handleWrongMatch();
    }
}

function handleCorrectMatch() {
    // Marcar tarjetas como emparejadas
    gameState.selectedEnglish.card.classList.add('matched');
    gameState.selectedSpanish.card.classList.add('matched');
    
    // Actualizar puntuación
    gameState.score += 10 * gameState.level;
    gameState.matchedPairs++;
    
    // Efectos visuales
    createCelebrationEffect(gameState.selectedEnglish.card);
    createCelebrationEffect(gameState.selectedSpanish.card);
    
    // Limpiar selección
    gameState.selectedEnglish = null;
    gameState.selectedSpanish = null;
    
    updateDisplay();
    updateProgress();
    
    // Verificar si se completó el nivel
    if (gameState.matchedPairs === gameState.totalPairs) {
        setTimeout(() => {
            if (gameState.level < 3) {
                showCelebration();
            } else {
                showGameOver();
            }
        }, 1000);
    }
}

function handleWrongMatch() {
    // Reducir vidas
    gameState.lives--;
    
    // Efectos visuales de error
    gameState.selectedEnglish.card.classList.add('wrong');
    gameState.selectedSpanish.card.classList.add('wrong');
    
    setTimeout(() => {
        gameState.selectedEnglish.card.classList.remove('wrong', 'selected');
        gameState.selectedSpanish.card.classList.remove('wrong', 'selected');
    }, 1000);
    
    // Limpiar selección
    gameState.selectedEnglish = null;
    gameState.selectedSpanish = null;
    
    updateDisplay();
    
    // Verificar si se acabaron las vidas
    if (gameState.lives <= 0) {
        setTimeout(() => {
            showGameOver();
        }, 1000);
    }
}

function showHint() {
    if (!gameState.isGameActive || gameState.lives <= 0) return;
    
    // Encontrar una tarjeta no emparejada
    const unmatchedCards = document.querySelectorAll('.phrase-card:not(.matched)');
    if (unmatchedCards.length === 0) return;
    
    const randomCard = unmatchedCards[Math.floor(Math.random() * unmatchedCards.length)];
    const type = randomCard.dataset.type;
    const text = randomCard.dataset.text;
    
    // Encontrar la tarjeta correspondiente
    const correspondingCards = document.querySelectorAll(`.phrase-card[data-type="${type === 'english' ? 'spanish' : 'english'}"]:not(.matched)`);
    let matchingCard = null;
    
    for (let card of correspondingCards) {
        const phrase = prayerPhrases.find(p => 
            (type === 'english' && p.english === text && p.spanish === card.dataset.text) ||
            (type === 'spanish' && p.spanish === text && p.english === card.dataset.text)
        );
        if (phrase) {
            matchingCard = card;
            break;
        }
    }
    
    if (matchingCard) {
        // Resaltar ambas tarjetas
        randomCard.style.animation = 'pulse 1s ease-in-out 3';
        matchingCard.style.animation = 'pulse 1s ease-in-out 3';
        
        // Reducir puntuación por usar pista
        gameState.score = Math.max(0, gameState.score - 5);
        updateDisplay();
    }
}

function createCelebrationEffect(card) {
    // Crear estrellas
    for (let i = 0; i < 5; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        card.style.position = 'relative';
        card.appendChild(star);
        
        setTimeout(() => {
            star.remove();
        }, 1000);
    }
}

function showCelebration() {
    elements.celebration.style.display = 'flex';
    createConfetti();
}

function showGameOver() {
    gameState.isGameActive = false;
    elements.finalScore.textContent = gameState.score;
    elements.gameOver.style.display = 'flex';
    createConfetti();
}

function nextLevel() {
    elements.celebration.style.display = 'none';
    gameState.level++;
    loadLevel();
}

function playAgain() {
    elements.gameOver.style.display = 'none';
    resetGame();
    startGame();
}

function resetGame() {
    gameState.isGameActive = false;
    gameState.score = 0;
    gameState.lives = 3;
    gameState.level = 1;
    gameState.matchedPairs = 0;
    gameState.selectedEnglish = null;
    gameState.selectedSpanish = null;
    
    elements.startBtn.style.display = 'inline-block';
    elements.resetBtn.style.display = 'none';
    elements.hintBtn.style.display = 'none';
    elements.celebration.style.display = 'none';
    elements.gameOver.style.display = 'none';
    
    // Limpiar tarjetas
    elements.englishPhrases.innerHTML = '';
    elements.spanishPhrases.innerHTML = '';
    
    updateDisplay();
    updateProgress();
}

function updateDisplay() {
    elements.score.textContent = gameState.score;
    elements.level.textContent = gameState.level;
    elements.lives.textContent = gameState.lives;
}

function updateProgress() {
    const progress = (gameState.matchedPairs / gameState.totalPairs) * 100;
    elements.progressFill.style.width = progress + '%';
}

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Sistema de audio para las frases
let speechSynthesis = window.speechSynthesis;
let voices = [];

// Cargar voces disponibles
function loadVoices() {
    voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        setTimeout(loadVoices, 100);
    } else {
        // Mostrar información sobre las voces disponibles en la consola para debugging
        console.log('Voces disponibles:', voices.map(v => `${v.name} (${v.lang})`));
        
        // Buscar y mostrar la voz femenina seleccionada
        const femaleVoices = voices.filter(voice => 
            voice.lang === 'en-US' && 
            (voice.name.includes('Female') || 
             voice.name.includes('Susan') || 
             voice.name.includes('Karen') || 
             voice.name.includes('Samantha') ||
             voice.name.includes('Victoria') ||
             voice.name.includes('Alex'))
        );
        
        if (femaleVoices.length > 0) {
            console.log('Voz femenina seleccionada:', femaleVoices[0].name);
        }
    }
}

// Función para alternar el audio
function toggleAudio() {
    gameState.audioEnabled = !gameState.audioEnabled;
    
    if (gameState.audioEnabled) {
        elements.audioToggleBtn.innerHTML = '🔊 Audio ON';
        elements.audioToggleBtn.style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
    } else {
        elements.audioToggleBtn.innerHTML = '🔇 Audio OFF';
        elements.audioToggleBtn.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
        // Detener cualquier audio que esté reproduciéndose
        speechSynthesis.cancel();
    }
}

// Función para reproducir audio de una frase con pausas mejoradas
function playPhraseAudio(text, language = 'en-US') {
    if (!speechSynthesis || !gameState.audioEnabled) return;
    
    // Detener cualquier audio que esté reproduciéndose
    speechSynthesis.cancel();
    
    // Agregar pausas entre palabras para mejor comprensión
    const textWithPauses = text.replace(/\s+/g, ' ... '); // Agregar pausas entre palabras
    
    const utterance = new SpeechSynthesisUtterance(textWithPauses);
    utterance.lang = language;
    utterance.rate = gameState.audioRate; // Usar velocidad configurada por el usuario
    utterance.pitch = 0.9; // Tono más suave
    utterance.volume = 1.0;
    
    // Seleccionar voz femenina específica
    if (voices.length > 0) {
        if (language === 'en-US') {
            // Buscar voces femeninas específicas, priorizando las más suaves
            const femaleVoices = voices.filter(voice => 
                voice.lang === 'en-US' && 
                (voice.name.includes('Female') || 
                 voice.name.includes('Susan') || 
                 voice.name.includes('Karen') || 
                 voice.name.includes('Samantha') ||
                 voice.name.includes('Victoria') ||
                 voice.name.includes('Alex') ||
                 voice.name.includes('Google UK English Female') ||
                 voice.name.includes('Microsoft Zira Desktop'))
            );
            
            if (femaleVoices.length > 0) {
                // Priorizar voces específicas conocidas por ser suaves
                utterance.voice = femaleVoices.find(voice => 
                    voice.name.includes('Susan') || 
                    voice.name.includes('Karen') ||
                    voice.name.includes('Samantha')
                ) || femaleVoices[0];
            } else {
                // Si no hay voces femeninas específicas, usar cualquier voz en inglés
                utterance.voice = voices.find(voice => voice.lang === 'en-US');
            }
        } else {
            // Para español, buscar voces femeninas
            const femaleSpanishVoices = voices.filter(voice => 
                (voice.lang === 'es-ES' || voice.lang === 'es-MX') &&
                (voice.name.includes('Female') || 
                 voice.name.includes('Monica') ||
                 voice.name.includes('Laura') ||
                 voice.name.includes('Google Español Female') ||
                 voice.name.includes('Microsoft Sabina Desktop'))
            );
            
            if (femaleSpanishVoices.length > 0) {
                utterance.voice = femaleSpanishVoices[0];
            } else {
                utterance.voice = voices.find(voice => 
                    voice.lang === 'es-ES' || voice.lang === 'es-MX'
                );
            }
        }
    }
    
    speechSynthesis.speak(utterance);
}

// Efectos de sonido (usando Web Audio API)
function playSound(frequency, duration) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Agregar efectos de sonido a las acciones
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('phrase-card') && e.target.classList.contains('matched')) {
        playSound(800, 0.2); // Sonido de éxito
    } else if (e.target.classList.contains('phrase-card') && e.target.classList.contains('wrong')) {
        playSound(200, 0.3); // Sonido de error
    }
});

// Animación de entrada para las tarjetas
function animateCards() {
    const cards = document.querySelectorAll('.phrase-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Llamar animación cuando se cargan las tarjetas
const originalCreatePhraseCards = createPhraseCards;
createPhraseCards = function() {
    originalCreatePhraseCards();
    setTimeout(animateCards, 100);
};

// ===== FUNCIONES DEL MODO DE PRONUNCIACIÓN =====

// Mostrar modal de nombre
function showNameModal() {
    elements.nameModal.style.display = 'flex';
    elements.childNameInput.focus();
}

// Inicializar reconocimiento de voz
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        gameState.pronunciationState.recognition = new SpeechRecognition();
        
        gameState.pronunciationState.recognition.continuous = false;
        gameState.pronunciationState.recognition.interimResults = false;
        gameState.pronunciationState.recognition.lang = 'en-US';
        
        gameState.pronunciationState.recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            evaluatePronunciation(transcript);
        };
        
        gameState.pronunciationState.recognition.onerror = function(event) {
            console.error('Error en reconocimiento de voz:', event.error);
            stopRecording();
            showFeedback('Error al grabar. Inténtalo de nuevo.', 'try-again');
        };
        
        gameState.pronunciationState.recognition.onend = function() {
            stopRecording();
        };
        
        // Solicitar permisos del micrófono al inicializar
        requestMicrophonePermission();
    } else {
        console.warn('Reconocimiento de voz no soportado en este navegador');
    }
}

// Solicitar permisos del micrófono
async function requestMicrophonePermission() {
    try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            // Mostrar mensaje informativo
            elements.pronunciationFeedback.textContent = 'Solicitando permisos del micrófono... 🎤';
            elements.pronunciationFeedback.className = 'feedback';
            
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Detener el stream inmediatamente después de obtener permisos
            stream.getTracks().forEach(track => track.stop());
            
            // Mostrar mensaje de éxito
            elements.pronunciationFeedback.textContent = '¡Permisos del micrófono obtenidos! ✅';
            elements.pronunciationFeedback.className = 'feedback success';
            
            // Limpiar el mensaje después de 2 segundos
            setTimeout(() => {
                elements.pronunciationFeedback.textContent = '';
                elements.pronunciationFeedback.className = 'feedback';
            }, 2000);
            
            console.log('Permisos del micrófono obtenidos');
        }
    } catch (error) {
        console.warn('No se pudieron obtener permisos del micrófono:', error);
        
        // Mostrar mensaje de error
        elements.pronunciationFeedback.textContent = 'Permisos del micrófono denegados. El modo de pronunciación no funcionará correctamente.';
        elements.pronunciationFeedback.className = 'feedback try-again';
        
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
            elements.pronunciationFeedback.textContent = '';
            elements.pronunciationFeedback.className = 'feedback';
        }, 5000);
    }
}

// Iniciar juego de emparejamiento
function startMatchingGame() {
    const name = elements.childNameInput.value.trim();
    if (!name) {
        alert('Por favor, escribe tu nombre');
        return;
    }
    
    gameState.childName = name;
    gameState.gameMode = 'matching';
    
    elements.nameModal.style.display = 'none';
    elements.gameContainer.style.display = 'block';
    elements.speedControl.style.display = 'flex'; // Mostrar control de velocidad
}

// Iniciar juego de pronunciación
function startPronunciationGame() {
    const name = elements.childNameInput.value.trim();
    if (!name) {
        alert('Por favor, escribe tu nombre');
        return;
    }
    
    gameState.childName = name;
    gameState.gameMode = 'pronunciation';
    
    elements.nameModal.style.display = 'none';
    elements.pronunciationModal.style.display = 'flex';
    
    // Configurar información inicial
    elements.childNameDisplay.textContent = name;
    elements.totalPhrases.textContent = prayerPhrases.length;
    
    // Inicializar reconocimiento de voz solo cuando se selecciona este modo
    if (!gameState.pronunciationState.recognition) {
        initializeSpeechRecognition();
    }
    
    // Iniciar primera frase
    gameState.pronunciationState.currentPhraseIndex = 0;
    gameState.pronunciationState.completedPhrases = [];
    loadCurrentPhrase();
}

// Cargar frase actual
function loadCurrentPhrase() {
    const currentPhrase = prayerPhrases[gameState.pronunciationState.currentPhraseIndex];
    elements.currentPhraseText.textContent = currentPhrase.english;
    elements.currentPhraseNumber.textContent = gameState.pronunciationState.currentPhraseIndex + 1;
    
    // Actualizar progreso
    const progress = (gameState.pronunciationState.currentPhraseIndex / prayerPhrases.length) * 100;
    elements.phraseProgressFill.style.width = progress + '%';
    
    // Resetear botones
    elements.nextPhraseBtn.style.display = 'none';
    elements.recordBtn.style.display = 'inline-block';
    elements.recordBtn.textContent = '🎤 Grabar';
    elements.recordBtn.classList.remove('recording');
    
    // Limpiar feedback
    elements.pronunciationFeedback.textContent = '';
    elements.pronunciationFeedback.className = 'feedback';
}

// Reproducir frase actual
function playCurrentPhrase() {
    const currentPhrase = prayerPhrases[gameState.pronunciationState.currentPhraseIndex];
    playPhraseAudio(currentPhrase.english, 'en-US');
}

// Alternar grabación
function toggleRecording() {
    if (gameState.pronunciationState.isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

// Iniciar grabación
function startRecording() {
    if (!gameState.pronunciationState.recognition) {
        showFeedback('Reconocimiento de voz no disponible', 'try-again');
        return;
    }
    
    gameState.pronunciationState.isRecording = true;
    elements.recordBtn.textContent = '⏹️ Detener';
    elements.recordBtn.classList.add('recording');
    elements.pronunciationFeedback.textContent = 'Escuchando... 🎤';
    elements.pronunciationFeedback.className = 'feedback';
    
    try {
        // Los permisos ya fueron solicitados al inicializar
        gameState.pronunciationState.recognition.start();
    } catch (error) {
        console.error('Error al iniciar grabación:', error);
        stopRecording();
        
        // Si el error es por permisos, mostrar mensaje específico
        if (error.name === 'NotAllowedError') {
            showFeedback('Permisos del micrófono denegados. Por favor, permite el acceso al micrófono.', 'try-again');
        } else {
            showFeedback('Error al iniciar grabación. Inténtalo de nuevo.', 'try-again');
        }
    }
}

// Detener grabación
function stopRecording() {
    gameState.pronunciationState.isRecording = false;
    elements.recordBtn.textContent = '🎤 Grabar';
    elements.recordBtn.classList.remove('recording');
    
    if (gameState.pronunciationState.recognition) {
        gameState.pronunciationState.recognition.stop();
    }
}

// Evaluar pronunciación
function evaluatePronunciation(transcript) {
    const currentPhrase = prayerPhrases[gameState.pronunciationState.currentPhraseIndex];
    const targetText = currentPhrase.english.toLowerCase().trim();
    
    // Algoritmo simple de similitud
    const similarity = calculateSimilarity(transcript, targetText);
    
    if (similarity >= 0.6) { // 60% de similitud
        // ¡Pronunciación correcta!
        gameState.pronunciationState.completedPhrases.push(gameState.pronunciationState.currentPhraseIndex);
        showFeedback('¡Excelente pronunciación! 🎉', 'success');
        elements.nextPhraseBtn.style.display = 'inline-block';
        
        // Reproducir sonido de éxito
        playSound(800, 0.3);
        
        // Verificar si completó todas las frases
        if (gameState.pronunciationState.completedPhrases.length === prayerPhrases.length) {
            setTimeout(() => {
                showCongratulations();
            }, 2000);
        }
    } else {
        // Pronunciación necesita mejora
        showFeedback('Inténtalo de nuevo. Dijiste: "' + transcript + '"', 'try-again');
        playSound(400, 0.2);
    }
}

// Calcular similitud entre textos
function calculateSimilarity(text1, text2) {
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    let matches = 0;
    const maxLength = Math.max(words1.length, words2.length);
    
    for (let i = 0; i < Math.min(words1.length, words2.length); i++) {
        if (words1[i] === words2[i]) {
            matches++;
        } else {
            // Verificar similitud parcial
            const similarity = calculateWordSimilarity(words1[i], words2[i]);
            if (similarity > 0.7) {
                matches += similarity;
            }
        }
    }
    
    return matches / maxLength;
}

// Calcular similitud entre palabras
function calculateWordSimilarity(word1, word2) {
    const longer = word1.length > word2.length ? word1 : word2;
    const shorter = word1.length > word2.length ? word2 : word1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
}

// Distancia de Levenshtein
function levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
        matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
        matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
        for (let j = 1; j <= str1.length; j++) {
            if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    
    return matrix[str2.length][str1.length];
}

// Mostrar feedback
function showFeedback(message, type) {
    elements.pronunciationFeedback.textContent = message;
    elements.pronunciationFeedback.className = `feedback ${type}`;
}

// Siguiente frase
function nextPhrase() {
    gameState.pronunciationState.currentPhraseIndex++;
    
    if (gameState.pronunciationState.currentPhraseIndex < prayerPhrases.length) {
        loadCurrentPhrase();
    } else {
        showCongratulations();
    }
}

// Mostrar felicitaciones
function showCongratulations() {
    elements.pronunciationModal.style.display = 'none';
    elements.congratulationsModal.style.display = 'flex';
    elements.congratulationsName.textContent = gameState.childName;
    
    // Crear confetti
    createConfetti();
    
    // Reproducir sonido de celebración
    playSound(1000, 0.5);
}

// Reiniciar pronunciación
function restartPronunciation() {
    elements.congratulationsModal.style.display = 'none';
    startPronunciationGame();
}

// Volver al menú
function backToMenu() {
    elements.congratulationsModal.style.display = 'none';
    elements.gameContainer.style.display = 'none';
    elements.pronunciationModal.style.display = 'none';
    showNameModal();
}
