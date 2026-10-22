/*
  ─────────────────────────────────────────────────────────────
   YOUR PLAYLIST — "his favourite songs, now mine"
  ─────────────────────────────────────────────────────────────
   1. Put your audio files in  public/songs/
   2. Point each track's `src` at the file name, e.g. songs('made-in-japan.mp3')
   3. Change the titles / artists below to his songs.

   • `duration` is optional (seconds). The real length is read
     from the file automatically once it loads.
   • A track with no file (src: null) still "plays" in demo mode
     so the disc spins and the timer runs.
   • You can also press  ADD  on the device (or drag & drop
     audio files onto the page) to add songs without editing code.
*/

const songs = (file) => `${import.meta.env.BASE_URL}songs/${file}`;

export const PLAYLIST_NAME = 'MADE IN JAPAN';
export const PLAYLIST_SUB = 'his favs → now mine';

export const tracks = [
  { title: 'Made in Japan', artist: 'his #1 favourite', src: songs('made-in-japan.mp3'), duration: 214 },
  { title: 'His Fav No.02', artist: 'edit in playlist.js', src: null, duration: 187 },
  { title: 'His Fav No.03', artist: 'edit in playlist.js', src: null, duration: 236 },
  { title: 'His Fav No.04', artist: 'edit in playlist.js', src: null, duration: 201 },
  { title: 'His Fav No.05', artist: 'edit in playlist.js', src: null, duration: 175 },
  { title: 'His Fav No.06', artist: 'edit in playlist.js', src: null, duration: 248 },
  { title: 'His Fav No.07', artist: 'edit in playlist.js', src: null, duration: 193 },
  { title: 'His Fav No.08', artist: 'edit in playlist.js', src: null, duration: 222 },
  { title: 'His Fav No.09', artist: 'edit in playlist.js', src: null, duration: 205 },
  { title: 'Now It’s Mine', artist: 'the last one is for me', src: null, duration: 230 },
];
