# 🎮 Juegos educativos para 1ro de primaria

Juegos web para apoyar al grupo 1ro A del Colegio Pedro Moreno. Funcionan en el navegador de cualquier computadora, tablet o celular. No hace falta instalar nada ni crear cuentas.

**▶️ Jugar en línea:** https://octadragon17.github.io/1roPrimaria/

## 📚 Juegos

| Juego | Qué practica | Enlace |
|---|---|---|
| 🔢 **Unidades y Decenas** | Descomponer números en decenas y unidades, con niveles, puntos y un avatar a elegir | [Jugar](https://octadragon17.github.io/1roPrimaria/) |
| 🙏 **Padre Nuestro en inglés** | Emparejar frases inglés–español y practicar la pronunciación con reconocimiento de voz | [Jugar](https://octadragon17.github.io/1roPrimaria/padre-nuestro/) |
| 🔤 **Spelling Words** | Vocabulario en inglés: tocar la imagen para ver la palabra y escuchar cada letra | [Jugar](https://octadragon17.github.io/1roPrimaria/SpellingWords/) |

## ✨ Características

- **Audio y voz** con la Web Speech API: pronunciación de palabras y letras, y evaluación de lo que dice el niño
- **Personalización**: el niño escribe su nombre y el juego lo felicita por su nombre
- **Privacidad**: el nombre y el progreso se quedan en el navegador del dispositivo. El código nunca los envía a un servidor
- **Responsive**: diseñado para dedos pequeños y pantallas táctiles

## 🗂️ Estructura

```
1roPrimaria/
├── index.html, script.js, styles.css   # Unidades y Decenas (página de inicio)
├── padre-nuestro/                      # Padre Nuestro en inglés
└── SpellingWords/                      # Spelling Words
```

El sitio se publica con **GitHub Pages** desde la rama `main`.

## 💻 Ejecutar localmente

```bash
git clone https://github.com/octadragon17/1roPrimaria.git
cd 1roPrimaria
npx serve .        # o abre index.html directamente en el navegador
```

> El reconocimiento de voz necesita Chrome o Edge y permiso de micrófono.

## 🛠️ Tecnologías

HTML5 · CSS3 · JavaScript (sin frameworks) · Web Speech API · GitHub Pages

## 📄 Licencia

[MIT](LICENSE) © José Octavio Moreno Aldana
