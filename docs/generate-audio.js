// Script para generar archivos de audio usando Web Speech API
// Este script se ejecutará en el navegador para generar los archivos de audio

const prayerPhrases = [
    { english: "Our Father", spanish: "Padre Nuestro" },
    { english: "Who art in heaven", spanish: "Que estás en el cielo" },
    { english: "Hallowed be thy name", spanish: "Bendito sea tu nombre" },
    { english: "Thy kingdom come", spanish: "Venga a nosotros tu reino" },
    { english: "Thy will be done", spanish: "Hágase tu voluntad" },
    { english: "On Earth as it is in heaven", spanish: "Así sea en la tierra como en el cielo" },
    { english: "Give us this day", spanish: "Danos hoy" },
    { english: "Our daily bread", spanish: "Nuestro pan de cada día" },
    { english: "And forgive us our trespasses", spanish: "Y perdona nuestras ofensas" },
    { english: "As we forgive those", spanish: "Como nosotros perdonamos a los" },
    { english: "Who trespass against us", spanish: "Que nos ofenden" },
    { english: "Lead us not into temptation", spanish: "No nos dejes caer en la tentación" },
    { english: "But deliver us from evil", spanish: "Y líbranos de todo mal" },
    { english: "Amen", spanish: "Amén" }
];

// Función para generar audio usando Web Speech API
function generateAudio(text, filename, language = 'en-US') {
    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8; // Velocidad más lenta para niños
        utterance.pitch = 1.1; // Tono ligeramente más alto
        utterance.volume = 1.0;
        
        // Seleccionar voz apropiada
        const voices = speechSynthesis.getVoices();
        if (language === 'en-US') {
            utterance.voice = voices.find(voice => 
                voice.lang === 'en-US' && voice.name.includes('Female')
            ) || voices.find(voice => voice.lang === 'en-US');
        } else {
            utterance.voice = voices.find(voice => 
                voice.lang === 'es-ES' || voice.lang === 'es-MX'
            );
        }
        
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event.error);
        
        speechSynthesis.speak(utterance);
    });
}

// Función para generar todos los archivos de audio
async function generateAllAudio() {
    console.log('Generando archivos de audio...');
    
    for (let i = 0; i < prayerPhrases.length; i++) {
        const phrase = prayerPhrases[i];
        
        try {
            console.log(`Generando audio ${i + 1}/${prayerPhrases.length}: ${phrase.english}`);
            await generateAudio(phrase.english, `audio/english_${i + 1}.mp3`, 'en-US');
            
            // Pequeña pausa entre frases
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            console.log(`Generando audio ${i + 1}/${prayerPhrases.length}: ${phrase.spanish}`);
            await generateAudio(phrase.spanish, `audio/spanish_${i + 1}.mp3`, 'es-ES');
            
            // Pausa más larga entre pares
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`Error generando audio para ${phrase.english}:`, error);
        }
    }
    
    console.log('¡Todos los archivos de audio han sido generados!');
}

// Ejecutar cuando se carga la página
window.addEventListener('load', () => {
    // Esperar a que las voces estén disponibles
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
            setTimeout(generateAllAudio, 1000);
        };
    } else {
        setTimeout(generateAllAudio, 2000);
    }
});
