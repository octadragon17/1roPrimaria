# 🌟 Aprende el Padre Nuestro en Inglés 🌟

¡Un juego interactivo y divertido para que los niños de 1ro de primaria aprendan el Padre Nuestro en inglés!

## 🎮 ¿Qué es este juego?

Este es un juego educativo diseñado específicamente para niños de 6-7 años que les ayuda a aprender las frases del Padre Nuestro en inglés conectándolas con sus traducciones en español. El juego es colorido, interactivo y lleno de animaciones que mantienen a los niños comprometidos mientras aprenden.

## ✨ Características

### 🎯 **Dos Modos de Juego:**
- **Juego de Emparejamiento**: Conecta frases en inglés con español
- **Práctica de Pronunciación**: Practica la pronunciación frase por frase con reconocimiento de voz

### 🌈 **Características Generales:**
- **Diseño colorido**: Interfaz atractiva con colores vibrantes
- **Audio integrado**: Pronunciación correcta de cada frase usando Web Speech API
- **Reconocimiento de voz**: Evalúa la pronunciación del niño usando Web Speech Recognition
- **Personalización**: Solicita el nombre del niño para una experiencia personalizada
- **Progreso visual**: Barra de progreso que muestra el avance frase por frase
- **Feedback inmediato**: Retroalimentación positiva cuando la pronunciación es correcta
- **Sistema de puntuación**: Gana puntos por cada acierto (modo emparejamiento)
- **Sistema de pistas**: Ayuda cuando los niños se atascan (modo emparejamiento)
- **Sistema de vidas**: 3 vidas para hacer el juego desafiante pero no frustrante
- **Efectos de sonido**: Sonidos divertidos para cada acción
- **Efectos visuales**: Confetti y animaciones de celebración
- **Control de audio**: Botón para activar/desactivar el audio
- **Responsive**: Funciona en computadoras, tablets y móviles

## 🚀 Cómo jugar

### 🎯 **Modo Emparejamiento:**
1. **Escribe tu nombre**: Al iniciar el juego, escribe tu nombre
2. **Selecciona el modo**: Elige "🎯 Juego de Emparejamiento"
3. **Escucha la pronunciación**: Haz clic en el botón 🔊 de cualquier ficha para escuchar cómo se pronuncia
4. **Empareja las frases**: Haz clic en una frase en inglés y luego en su traducción en español
5. **Gana puntos**: Cada acierto te da 10 puntos multiplicados por el nivel
6. **Usa pistas**: Si necesitas ayuda, usa el botón "💡 Pista" (pero perderás 5 puntos)
7. **Controla el audio**: Usa el botón "🔊 Audio ON/OFF" para activar o desactivar el audio
8. **Completa niveles**: ¡Hay 3 niveles de dificultad creciente!

### 🗣️ **Modo Práctica de Pronunciación:**
1. **Escribe tu nombre**: Al iniciar el juego, escribe tu nombre
2. **Selecciona el modo**: Elige "🗣️ Práctica de Pronunciación"
3. **Escucha la frase**: Haz clic en "🔊 Escuchar" para escuchar la pronunciación correcta
4. **Graba tu pronunciación**: Haz clic en "🎤 Grabar" y repite la frase
5. **Recibe feedback**: El juego te dirá si tu pronunciación es correcta
6. **Continúa**: Si es correcta, pasa a la siguiente frase con "➡️ Siguiente Frase"
7. **Completa todas las frases**: ¡Practica todo el Padre Nuestro en inglés!
8. **Celebra**: ¡Recibe una felicitación personalizada al completar todas las frases!

## 🎯 Niveles del juego

- **Nivel 1**: 4 pares de frases
- **Nivel 2**: 6 pares de frases  
- **Nivel 3**: 8 pares de frases

## 🛠️ Instalación y uso

### Opción 1: GitHub Pages (Recomendado)
1. Haz un fork de este repositorio
2. Ve a Settings > Pages en tu repositorio
3. Selecciona "Deploy from a branch" y elige "main"
4. ¡Tu juego estará disponible en `https://tu-usuario.github.io/PadreNuestro`!

### Opción 2: Uso local
1. Descarga o clona este repositorio
2. Abre el archivo `index.html` en tu navegador web
3. ¡Disfruta jugando!

### Opción 3: Servidor local
```bash
# Si tienes Python instalado
python -m http.server 8000

# Si tienes Node.js instalado
npx serve .

# Luego abre http://localhost:8000 en tu navegador
```

## 📁 Estructura del proyecto

```
PadreNuestro/
├── index.html              # Página principal del juego
├── styles.css              # Estilos y animaciones
├── script.js               # Lógica del juego
├── audio-generator.html    # Generador de audio (opcional)
├── generate-audio.js       # Script para generar audio (opcional)
├── audio/                  # Carpeta para archivos de audio (si se usan archivos)
├── .gitignore             # Archivos a ignorar en Git
└── README.md              # Este archivo
```

## 🔊 Sistema de Audio y Reconocimiento de Voz

### **Web Speech API - Audio:**
El juego utiliza la **Web Speech API** para proporcionar pronunciación automática de las frases:

- **Audio en inglés**: Pronunciación nativa usando voces femeninas suaves
- **Audio en español**: Pronunciación nativa usando voces femeninas suaves
- **Velocidad optimizada**: Velocidad muy lenta (0.5x) para facilitar el aprendizaje
- **Tono suave**: Tono más bajo (0.9) para una voz más amigable
- **Pausas entre palabras**: Pequeñas pausas para mejor comprensión
- **Selección inteligente de voz**: Prioriza voces femeninas conocidas por ser suaves (Susan, Karen, Samantha)
- **Control de audio**: Botón para activar/desactivar el audio globalmente
- **Botones individuales**: Cada ficha tiene su propio botón 🔊 para reproducir audio
- **Sin archivos externos**: No requiere archivos de audio descargables

### **Web Speech Recognition - Reconocimiento de Voz:**
El modo de pronunciación utiliza **Web Speech Recognition** para evaluar la pronunciación:

- **Reconocimiento en inglés**: Configurado específicamente para inglés americano
- **Algoritmo de similitud**: Compara la pronunciación del niño con la frase objetivo
- **Tolerancia ajustable**: Requiere 60% de similitud para considerar correcta la pronunciación
- **Feedback detallado**: Muestra lo que el niño dijo para ayudar con la corrección
- **Progreso secuencial**: Solo permite avanzar cuando la pronunciación es correcta

## 🎨 Personalización

### Cambiar las frases
Edita el array `prayerPhrases` en `script.js` para agregar o modificar las frases:

```javascript
const prayerPhrases = [
    { english: "Our Father", spanish: "Padre Nuestro" },
    { english: "Who art in heaven", spanish: "Que estás en el cielo" },
    // Agrega más frases aquí...
];
```

### Cambiar colores
Modifica las variables CSS en `styles.css` para cambiar la paleta de colores:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #4ecdc4;
    --error-color: #ff6b6b;
}
```

## 🌐 Compatibilidad

- ✅ Chrome 60+ (con soporte completo de Web Speech API)
- ✅ Firefox 55+ (con soporte completo de Web Speech API)
- ✅ Safari 12+ (con soporte completo de Web Speech API)
- ✅ Edge 79+ (con soporte completo de Web Speech API)
- ✅ Dispositivos móviles (iOS/Android con soporte de Web Speech API)

### Notas sobre el audio y reconocimiento de voz:
- **Audio**: Funciona mejor en Chrome y Edge
- **Reconocimiento de voz**: Funciona mejor en Chrome y Edge
- En Firefox y Safari puede requerir interacción del usuario antes de reproducir audio
- En dispositivos móviles, el audio puede estar limitado por políticas del navegador
- **Permisos de micrófono**: El modo de pronunciación requiere permisos de micrófono
- **Conexión a internet**: El reconocimiento de voz requiere conexión a internet

## 📚 Frases incluidas

El juego incluye las siguientes frases del Padre Nuestro:

1. Our Father / Padre Nuestro
2. Who art in heaven / Que estás en el cielo
3. Hallowed be thy name / Bendito sea tu nombre
4. Thy kingdom come / Venga a nosotros tu reino
5. Thy will be done / Hágase tu voluntad
6. On Earth as it is in heaven / Así sea en la tierra como en el cielo
7. Give us this day / Danos hoy
8. Our daily bread / Nuestro pan de cada día
9. And forgive us our trespasses / Y perdona nuestras ofensas
10. As we forgive those / Como nosotros perdonamos a los
11. Who trespass against us / Que nos ofenden
12. Lead us not into temptation / No nos dejes caer en la tentación
13. But deliver us from evil / Y líbranos de todo mal
14. Amen / Amén

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar el juego:

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍🏫 Para educadores

Este juego está diseñado para ser usado en:
- Clases de inglés en primaria
- Catequesis
- Educación en casa
- Actividades extraescolares

### Sugerencias de uso:
- Juega en grupos pequeños (2-4 niños)
- Usa el juego como introducción antes de enseñar la oración completa
- Repite el juego varias veces para reforzar el aprendizaje
- Combina con actividades de pronunciación

## 🐛 Reportar problemas

Si encuentras algún problema o tienes sugerencias, por favor:
1. Abre un issue en GitHub
2. Describe el problema detalladamente
3. Incluye información sobre tu navegador y dispositivo

## 📞 Contacto

¿Tienes preguntas? ¡No dudes en contactarme!

---

¡Que disfrutes aprendiendo el Padre Nuestro en inglés! 🙏✨
