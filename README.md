# Focus Seven Habit Tracker 🚀

Hey there! Welcome to the very first prototype of **Focus Seven** a super-fast, offline-first habit tracker built entirely with Vanilla HTML, CSS, and JavaScript. Zero dependencies, pure performance! ⚡️

## What is this?
This is a lightweight app designed to help you build solid habits without the clutter of heavy frameworks. It enforces a "Focus Seven" rule, meaning you can only track up to 7 habits at a time. The goal is to keep you laser-focused on what actually matters instead of overwhelming you!

## How it works under the hood 🧠
Since I wanted to keep this blisteringly fast and totally private, I built it with a zero-dependency architecture:
- **Frontend UI:** Standard semantic HTML5 and a very responsive, dark-themed CSS styling (pure vanilla CSS).
- **Core Logic:** A single `app.js` file handles all the interactions, streak calculations, and UI updates.
- **Storage Strategy:** It uses your browser's native `localStorage`. There is no remote database to slow things down. Everything you track lives directly on your device, making it instantly available even when you're completely offline! 
- **Streak Logic:** It calculates your streaks based on a 24-hour reset rule and provides a nice 7-day history viewing dashboard.

## Setup & Build Up 🛠️
Because I avoided big frameworks, the setup is ridiculously simple. There is no `npm install`, no build steps, and no Webpack configuration required.

### To run this right now:
1. **Clone or Download** this folder to your machine.
2. **Open `index.html`** directly in your favorite web browser (Chrome, Firefox, Safari, Edge). 
3. *That's literally it.* Start adding your habits!

If you want to edit the code and test it like a pro, you can use an extension like VS Code's **Live Server** to spin it up on a local port (e.g., `http://127.0.0.1:5500`), but it's totally optional for just using the app.

## Project Structure 📂
- `index.html` — The main layout and structure.
- `style.css` — The styling (colors, grid, flexing, and some cool modern UI tricks).
- `app.js` — The brain! It holds the logic for creating habits, managing the local storage, and rendering the UI.

## What's Next?
This is just Prototype v1.0, but it lays a rock-solid foundation for future features (like export/import data, charts with external libraries, or cloud sync if we ever decide to go that route). 

Enjoy building your habits! Let's get that streak going! 🔥
