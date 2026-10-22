# Made in Japan · His Favs → Now Mine

A dark, industrial CD-reader music player built with **React + Vite**.
The disc spins up when you press play and slows down when you pause. The small screen
shows the cover, the playlist and what's playing now, with one red accent like the
Japanese sun.

---

## 1. Open & run (VS Code)

1. Install **Node.js 18 or newer** → https://nodejs.org (the LTS version is fine)
2. Unzip this folder, then in VS Code: **File → Open Folder…** → pick `made-in-japan-player`
3. Open the terminal: **Terminal → New Terminal**, and run:

```bash
npm install
npm run dev
```

4. The browser opens at **http://localhost:5173**. If it doesn't, open that link yourself.

## 2. Add the real songs 🎵

1. Put your audio files into **`public/songs/`**
   (for example `public/songs/made-in-japan.mp3`)
2. Open **`src/data/playlist.js`** and set the title, artist and `src` for each song:

```js
{ title: 'Made in Japan', artist: 'Artist Name', src: songs('made-in-japan.mp3') },
{ title: 'Another Fav',   artist: 'Someone',     src: songs('another-fav.mp3') },
```

You can also add songs **without any code**: click **ADD +** on the device, or just
**drag and drop** audio files onto the page. (Songs added this way are gone when you refresh
the page. Put them in `playlist.js` to keep them.)

If a track has no file (`src: null`), it plays in **demo mode**: the disc spins and the timer
runs, but there's no sound.

## 3. Controls

| Action | How |
| --- | --- |
| Play / pause | Click the **big knob** in the middle, the ▶ on the screen, or press **Space** |
| Previous / next | Click the **top / bottom ribbed arcs**, the screen buttons, or press **← / →** |
| Volume | **Scroll** over the knob, or press **↑ / ↓** |
| Seek | Click on the thin progress line |
| Switch screen view | **VIEW** button (top grille) or the icon in the screen corner |
| Pick a song | Click it in the list |

## 4. Customise

- **Playlist name & subtitle:** `PLAYLIST_NAME` and `PLAYLIST_SUB` in `src/data/playlist.js`
- **Colours:** variables at the top of `src/styles.css` (`--red` is the accent)
- **Japanese caption / top bar text:** `src/App.jsx`
- **Disc artwork & ring text:** `src/components/DiscArt.jsx`
- **Spin speed:** `MAX` in `src/components/Disc.jsx`

## 5. Build to share

```bash
npm run build
```

This makes a `dist/` folder you can upload to Netlify, Vercel or GitHub Pages.

## Project structure

```
src/
  App.jsx               page layout, keyboard, drag & drop, scaling
  styles.css            all styling
  data/playlist.js      ← your songs go here
  hooks/usePlayer.js    audio playback logic
  components/
    Device.jsx          housing, ring, arcs, hub, knob
    Disc.jsx            spinning disc (spin-up / coast-down)
    DiscArt.jsx         generated chrome disc art
    CoverArt.jsx        cover art on the screen
    Screen.jsx          the small display UI
public/songs/           ← put your mp3 files here
```
