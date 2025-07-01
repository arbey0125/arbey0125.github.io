// Obtener elementos del DOM al inicio
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');w
const rewindBtn = document.getElementById('rewind-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const likeBtn = document.getElementById('like-btn');
const lyricsBtn = document.getElementById('lyrics-btn');
const deviceBtn = document.getElementById('device-btn');
const shareBtn = document.getElementById('share-btn');
const menuBtn = document.getElementById('menu-btn');

// Datos de ejemplo con tus archivos reales
const albums = [
  {
    id: 1,
    name: "Momentos Juntos",
    year: 2025,
    description: "Nuestros momentos más especiales juntos",
    cover: "FOTO 1.jpg",
    songs: [
      {
        title: "Mi Bendición",
        artist: "Juan Luis Guerra",
        audio: "Juan Luis Guerra - Mi Bendicion [LakJahiBl2Y].mp3",
        video: "VIDEO 1.mp4"
      },
      {
        title: "La Travesía",
        artist: "Juan Luis Guerra",
        audio: "Juan Luis Guerra - La Travesia [AWozq4Phckc].mp3",
        video: "VIDEO 2.mp4"
      },
      {
        title: "Contigo",
        artist: "Desconocido",
        audio: "Contigo [4AeuO5L1bXk].mp3",
        video: "VIDEO 3.mp4"
      },
      {
        title: "Tengo Ganas",
        artist: "Andrés Cepeda (Cover)",
        audio: "Tengo Ganas - Andrés Cepeda (Cover Audio) - Andrés Cepeda.mp3",
        video: "VIDEO 1.mp4"
      }
    ]
  }
]

const playlists = [
  {
    id: 1,
    name: "Nuestra Playlist Romántica",
    description: "Las canciones que nos recuerdan nuestro amor",
    cover: "FOTO 1.jpg",
    year: 2025,
    songs: [
      albums[0].songs[0],
      albums[0].songs[1],
      albums[0].songs[2],
      albums[0].songs[3]
    ]
  }
]

// Cambiar de vista
function showView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(view + '-view').classList.add('active');
}

// Mostrar álbumes destacados en Home
function renderFeaturedAlbums() {
  const container = document.getElementById('featured-albums');
  container.innerHTML = '<h2>Álbumes destacados</h2>';
  const list = document.createElement('div');
  list.className = 'albums-list';
  albums.forEach(album => {
    const div = document.createElement('div');
    div.className = 'album';
    div.innerHTML = `<img src="${album.cover}" alt="${album.name}"><div><b>${album.name}</b></div><div>${album.year}</div>`;
    div.onclick = () => showAlbumSongs(album);
    list.appendChild(div);
  });
  container.appendChild(list);
}

// Mostrar playlists destacadas en Home
function renderFeaturedPlaylists() {
  const container = document.getElementById('featured-playlists');
  container.innerHTML = '<h2>Playlists</h2>';
  const list = document.createElement('div');
  list.className = 'playlists-list';
  playlists.forEach(playlist => {
    const div = document.createElement('div');
    div.className = 'playlist';
    div.innerHTML = `<img src="${playlist.cover}" alt="${playlist.name}"><div><b>${playlist.name}</b></div><div>${playlist.description}</div>`;
    div.onclick = () => showPlaylistSongs(playlist);
    list.appendChild(div);
  });
  container.appendChild(list);
}

// Mostrar todos los álbumes
function renderAlbums() {
  const container = document.getElementById('albums-list');
  container.innerHTML = '';
  albums.forEach(album => {
    const div = document.createElement('div');
    div.className = 'album';
    div.innerHTML = `<img src="${album.cover}" alt="${album.name}"><div><b>${album.name}</b></div><div>${album.year}</div><div>${album.description}</div>`;
    div.onclick = () => showAlbumSongs(album);
    container.appendChild(div);
  });
}

// Mostrar todas las playlists
function renderPlaylists() {
  const container = document.getElementById('playlists-list');
  container.innerHTML = '';
  playlists.forEach(playlist => {
    const div = document.createElement('div');
    div.className = 'playlist';
    div.innerHTML = `<img src="${playlist.cover}" alt="${playlist.name}"><div><b>${playlist.name}</b></div><div>${playlist.description}</div>`;
    div.onclick = () => showPlaylistSongs(playlist);
    container.appendChild(div);
  });
}

// Mostrar canciones de un álbum
function showAlbumSongs(album) {
  let html = `<h2>${album.name} <span style='font-size:1rem;color:#1db954;'>(${album.year})</span></h2><div>${album.description}</div><ul>`;
  album.songs.forEach(song => {
    html += `<li style='margin:1rem 0;cursor:pointer;' onclick='playSongFromData(${JSON.stringify(JSON.stringify(song))}, albums[${albums.findIndex(a => a.id === album.id)}].songs)'>🎵 ${song.title} - <span style='color:#1db954;'>${song.artist}</span></li>`;
  });
  html += '</ul><button onclick="showView(\'albums\')">Volver</button>';
  document.getElementById('albums-list').innerHTML = html;
  showView('albums');
}

// Mostrar canciones de una playlist
function showPlaylistSongs(playlist) {
  let html = `<h2>${playlist.name}</h2><div>${playlist.description}</div><ul>`;
  playlist.songs.forEach(song => {
    html += `<li style='margin:1rem 0;cursor:pointer;' onclick='playSongFromData(${JSON.stringify(JSON.stringify(song))}, playlists[${playlists.findIndex(p => p.id === playlist.id)}].songs)'>🎵 ${song.title} - <span style='color:#1db954;'>${song.artist}</span></li>`;
  });
  html += '</ul><button onclick="showView(\'playlists\')">Volver</button>';
  document.getElementById('playlists-list').innerHTML = html;
  showView('playlists');
}

// --- Funcionalidad de los botones del reproductor ---
let currentSongIndex = 0;
let currentSongList = albums[0].songs; // Ahora la lista de canciones actual puede cambiar
let showVideo = false;
let currentSong = null;

function playSongByIndex(index) {
  if (index < 0) index = currentSongList.length - 1;
  if (index >= currentSongList.length) index = 0;
  currentSongIndex = index;
  playSongFromData(JSON.stringify(currentSongList[index]));
}

playBtn.addEventListener('click', () => {
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  if (audio.paused) {
    audio.play();
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
    isPlaying = true;
  } else {
    audio.pause();
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    isPlaying = false;
  }
});

audio.addEventListener('play', () => {
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  playIcon.style.display = 'none';
  pauseIcon.style.display = 'inline';
  isPlaying = true;
});
audio.addEventListener('pause', () => {
  const playIcon = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  playIcon.style.display = 'inline';
  pauseIcon.style.display = 'none';
  isPlaying = false;
});

prevBtn.addEventListener('click', () => {
  playSongByIndex(currentSongIndex - 1);
});

nextBtn.addEventListener('click', () => {
  playSongByIndex(currentSongIndex + 1);
});

rewindBtn.addEventListener('click', () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle('active', isRepeat);
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else if (isShuffle) {
    const allSongs = albums[0].songs;
    let next;
    do {
      next = Math.floor(Math.random() * allSongs.length);
    } while (next === currentSongIndex && allSongs.length > 1);
    playSongByIndex(next);
  } else {
    playSongByIndex(currentSongIndex + 1);
  }
});

likeBtn.addEventListener('click', () => {
  isLiked = !isLiked;
  likeBtn.classList.toggle('liked', isLiked);
  likeBtn.textContent = isLiked ? '❤️' : '🤍';
});

lyricsBtn.addEventListener('click', () => {
  alert('Letra no disponible aún.');
});

deviceBtn.addEventListener('click', () => {
  alert('Solo disponible en este dispositivo.');
});

shareBtn.addEventListener('click', () => {
  const song = albums[0].songs[currentSongIndex];
  navigator.clipboard.writeText(`${song.title} - ${song.artist}`);
  shareBtn.textContent = '✅';
  setTimeout(() => { shareBtn.textContent = '🔗'; }, 1200);
});

menuBtn.addEventListener('click', () => {
  alert('Menú: Aquí puedes agregar más opciones.');
});

const toggleMediaBtn = document.getElementById('toggle-media-btn');
const mediaContent = document.getElementById('media-content');

toggleMediaBtn.addEventListener('click', () => {
  showVideo = !showVideo;
  renderMediaContent();
});

function renderMediaContent() {
  if (!currentSong) {
    mediaContent.innerHTML = '';
    return;
  }
  if (showVideo) {
    mediaContent.innerHTML = `<video src="${currentSong.video}" controls autoplay muted poster="FOTO 1.jpg" loop></video>`;
    toggleMediaBtn.textContent = 'Solo Audio';
  } else {
    mediaContent.innerHTML = `<img src="FOTO 1.jpg" alt="Portada" />`;
    toggleMediaBtn.textContent = 'Ver Video';
  }
}

function playSongFromData(songStr, songList = null) {
  const song = JSON.parse(songStr);
  if (songList) {
    currentSongList = songList;
  }
  const idx = currentSongList.findIndex(s => s.title === song.title);
  if (idx !== -1) currentSongIndex = idx;
  currentSong = song;
  document.getElementById('player-cover').src = 'FOTO 1.jpg';
  document.getElementById('player-title').textContent = song.title;
  document.getElementById('player-artist').textContent = song.artist;
  audio.src = song.audio;
  audio.play();
  showVideo = true;
  renderMediaContent();
}

// --- Barra de progreso personalizada ---
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

audio.addEventListener('loadedmetadata', () => {
  progressBar.max = Math.floor(audio.duration);
  totalTimeEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('timeupdate', () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

progressBar.addEventListener('input', () => {
  audio.currentTime = progressBar.value;
});

// Inicializar
renderFeaturedAlbums();
renderFeaturedPlaylists();
renderAlbums();
renderPlaylists();

// Mostrar Home por defecto
showView('home'); 