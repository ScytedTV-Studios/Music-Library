document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch the song list data from the JSON file
    function fetchSongs() {
      return fetch('https://cdn.scyted.tv/toolkit/music-library/songs.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch songs. HTTP status code: ' + response.status);
          }
          return response.json();
        })
        .catch(error => {
          console.error('Failed to fetch songs:', error);
          throw error;
        });
    }
  
    // Function to create a custom audio player
    function createAudioPlayer(songUrl) {
      const audio = new Audio();
      audio.src = songUrl;
  
      const audioPlayer = document.createElement('div');
      audioPlayer.classList.add('audio-player');
  
      const controls = document.createElement('div');
      controls.classList.add('controls');
  
      const playButton = document.createElement('button');
      playButton.classList.add('play');
      playButton.innerHTML = '<i class="fas fa-play"></i>';
  
      controls.appendChild(playButton);
      audioPlayer.appendChild(controls);
  
      // Play button click event handler
      playButton.addEventListener('click', function () {
        if (audio.paused) {
          audio.play();
          playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
          audio.pause();
          playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
      });
  
      // Reset play button and pause audio when audio ends
      audio.addEventListener('ended', function () {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        audio.pause();
      });
  
      return audioPlayer;
    }
  
    // Function to populate the song list table
    function populateSongList() {
      fetchSongs()
        .then(songs => {
          const songList = document.getElementById('songList');
          const tbody = songList.querySelector('tbody');
          tbody.innerHTML = '';
  
          songs.forEach(function (song) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${song.title}</td>
              <td><a href="${song.artistLink}" target="_blank">${song.artist}</a></td>
              <td>${song.genre}</td>
              <td>${song.mood}</td>
              <td></td>
              <td><a href="${song.url}" download>Download</a></td>
            `;
  
            const audioPlayerCell = row.querySelector('td:nth-child(5)');
            const audioPlayer = createAudioPlayer(song.url);
            audioPlayerCell.appendChild(audioPlayer);
  
            tbody.appendChild(row);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  
    // Function to filter songs based on selected filters
    function filterSongs() {
      const genre = document.getElementById('genre').value;
      const mood = document.getElementById('mood').value;
      const search = document.getElementById('search').value.toLowerCase();
  
      fetchSongs()
        .then(songs => {
          let filteredSongs = songs;
  
          if (genre) {
            filteredSongs = filteredSongs.filter(song => song.genre.toLowerCase() === genre.toLowerCase());
          }
  
          if (mood) {
            filteredSongs = filteredSongs.filter(song => song.mood.toLowerCase() === mood.toLowerCase());
          }
  
          if (search) {
            filteredSongs = filteredSongs.filter(song => song.title.toLowerCase().includes(search) || song.artist.toLowerCase().includes(search));
          }
  
          const songList = document.getElementById('songList');
          const tbody = songList.querySelector('tbody');
          tbody.innerHTML = '';
  
          filteredSongs.forEach(function (song) {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${song.title}</td>
              <td><a href="${song.artistLink}" target="_blank">${song.artist}</a></td>
              <td>${song.genre}</td>
              <td>${song.mood}</td>
              <td></td>
              <td><a href="${song.url}" download>Download</a></td>
            `;
  
            const audioPlayerCell = row.querySelector('td:nth-child(5)');
            const audioPlayer = createAudioPlayer(song.url);
            audioPlayerCell.appendChild(audioPlayer);
  
            tbody.appendChild(row);
          });
        })
        .catch(error => {
          console.error(error);
        });
    }
  
    // Event listeners for filter changes
    document.getElementById('genre').addEventListener('change', filterSongs);
    document.getElementById('mood').addEventListener('change', filterSongs);
    document.getElementById('search').addEventListener('keyup', filterSongs);
  
    // Initial population of the song list table
    populateSongList();
  });  