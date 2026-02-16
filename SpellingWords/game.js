/**
 * Spelling Words - Juego educativo para niños
 * Palabras basadas en 1-10.jpeg y 11-15.jpeg
 */

// Palabras en minúsculas, excepto las que requieren mayúscula por regla ortográfica (ej: Monday - día de la semana)
const WORDS = [
    { word: 'Monday', emoji: '📅', image: '1-10.jpeg' },
    { word: 'yellow', emoji: '🟡', image: '1-10.jpeg' },
    { word: 'three', emoji: '3️⃣', image: '1-10.jpeg' },
    { word: 'balloons', emoji: '🎈', image: '1-10.jpeg' },
    { word: 'play soccer', emoji: '⚽', image: '1-10.jpeg' },
    { word: 'play guitar', emoji: '🎸', image: '1-10.jpeg' },
    { word: 'tiger', emoji: '🐯', image: '1-10.jpeg' },
    { word: 'notebook', emoji: '📓', image: '1-10.jpeg' },
    { word: 'backpack', emoji: '🎒', image: '1-10.jpeg' },
    { word: 'jump rope', emoji: '🪢', image: '1-10.jpeg' },
    { word: 'ears', emoji: '👂', image: '11-15.jpeg' },
    { word: 'paint', emoji: '🎨', image: '11-15.jpeg' },
    { word: 'catch a ball', emoji: '⚾', image: '11-15.jpeg' },
    { word: 'head', emoji: '👤', image: '11-15.jpeg' },
    { word: 'circle', emoji: '⭕', image: '11-15.jpeg' }
];

// Síntesis de voz
let speechSynthesis = window.speechSynthesis;
let utterance = null;

function initGame() {
    const grid = document.getElementById('cardsGrid');
    
    WORDS.forEach((item, index) => {
        const card = createCard(item, index);
        grid.appendChild(card);
    });
}

function createCard(item, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-face card-front-face">
                <span class="card-image">${item.emoji}</span>
                <span class="card-hint">Toca para voltear</span>
            </div>
            <div class="card-face card-back-face">
                <span class="card-word" data-word="${escapeHtml(item.word)}">${escapeHtml(item.word)}</span>
                <span class="card-hint">Toca para deletrear</span>
            </div>
        </div>
    `;
    
    // Click en el frente: voltear tarjeta
    const frontFace = card.querySelector('.card-front-face');
    frontFace.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.add('flipped');
    });
    
    // Click en el reverso (palabra): abrir modal y mostrar letras
    const backFace = card.querySelector('.card-back-face');
    backFace.addEventListener('click', (e) => {
        e.stopPropagation();
        openSpellingModal(item.word);
    });
    
    return card;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Aplica mayúsculas según reglas ortográficas (Monday, etc.)
function formatWordForDisplay(word) {
    if (word === 'monday') return 'Monday';
    return word;
}

function openSpellingModal(word) {
    const modal = document.getElementById('wordModal');
    const spellingWord = document.getElementById('spellingWord');
    
    spellingWord.innerHTML = '';
    
    // Mostrar palabra formateada (mayúsculas donde corresponda)
    const displayWord = formatWordForDisplay(word);
    
    // Crear un span por cada carácter (letra o espacio)
    const chars = displayWord.split('');
    chars.forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'spelling-letter';
        span.textContent = char;
        span.dataset.char = char;
        span.dataset.index = index;
        
        span.addEventListener('click', () => {
            pronounceLetter(char, span);
        });
        
        spellingWord.appendChild(span);
    });
    
    modal.classList.add('active');
    
    // Guardar palabra para el botón de pronunciar
    modal.dataset.currentWord = displayWord;
}

// Obtener voz femenina en inglés
function getFemaleVoice() {
    const voices = speechSynthesis.getVoices();
    const femaleEn = voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female'));
    const femaleEnAlt = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Victoria')));
    return femaleEn || femaleEnAlt || voices.find(v => v.lang.startsWith('en')) || voices[0];
}

function pronounceLetter(char, spanElement) {
    // No pronunciar espacios
    if (char === ' ' || char.trim() === '') return;
    
    // Quitar highlight anterior
    document.querySelectorAll('.spelling-letter.highlight').forEach(el => {
        el.classList.remove('highlight');
    });
    
    // Añadir efecto visual
    spanElement.classList.add('highlight');
    
    // Texto a pronunciar: si es mayúscula, decir "Capital letter M" (incluye la letra)
    const isCapital = char === char.toUpperCase() && char !== char.toLowerCase();
    const letterToSpeak = char.toUpperCase();
    const textToSpeak = isCapital 
        ? `Capital letter ${letterToSpeak}` 
        : letterToSpeak;
    
    if (speechSynthesis) {
        if (utterance) {
            speechSynthesis.cancel();
        }
        
        utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'en-US';
        utterance.rate = 0.45;  // Más lento y extendido
        utterance.pitch = 1.0;
        utterance.volume = 1;
        utterance.voice = getFemaleVoice();
        
        utterance.onend = () => {
            setTimeout(() => {
                spanElement.classList.remove('highlight');
            }, 300);
        };
        
        speechSynthesis.speak(utterance);
    }
}

function pronounceWord() {
    const modal = document.getElementById('wordModal');
    const word = modal.dataset.currentWord;
    if (!word || !speechSynthesis) return;
    
    if (utterance) {
        speechSynthesis.cancel();
    }
    
    utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.45;  // Lento y extendido, igual que las letras
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.voice = getFemaleVoice();
    
    speechSynthesis.speak(utterance);
}

// Cargar voces al iniciar (necesario en Chrome y otros navegadores)
if (speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

function closeSpellingModal() {
    const modal = document.getElementById('wordModal');
    modal.classList.remove('active');
    
    if (speechSynthesis && utterance) {
        speechSynthesis.cancel();
    }
}

// Event listeners
document.getElementById('closeModal').addEventListener('click', closeSpellingModal);
document.getElementById('pronounceWordBtn').addEventListener('click', pronounceWord);

document.getElementById('wordModal').addEventListener('click', (e) => {
    if (e.target.id === 'wordModal') {
        closeSpellingModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeSpellingModal();
    }
});

// Iniciar juego al cargar
document.addEventListener('DOMContentLoaded', initGame);
