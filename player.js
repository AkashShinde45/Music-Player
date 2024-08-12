const body = document.querySelector('body');
const topBar = document.querySelector('#top-bar');
const darkMode = document.querySelector('.darkMode');
const themeLabel = document.querySelector('#theme');
const section = document.querySelectorAll('.section');
const dropdown = document.querySelector('#genre-select');
const songList = document.querySelector('#song-list');


// image and audio elements
const songImage = document.getElementById('song-image');
const artist = document.getElementById('artist');
const songName = document.getElementById('song-name');
const audio = document.getElementById('audio');


let curSong;
darkMode.addEventListener('click', toggleTheme);

/*Toggle theme Function */
let change=true;
function toggleTheme() {
    if (change) {
        body.style.backgroundColor = 'black';
        topBar.style.color = 'white';
        section.forEach((ele) =>{
            ele.setAttribute('style','color: white');
        });
    } else {
        body.style.backgroundColor = 'white';
        section.forEach((ele) =>{
            ele.setAttribute('style','color: black');    
        });
        topBar.style.color = 'black'; 
    }
    change=!change;
}

/* renderCurrent song function */
function renderCurrentSong(song) {
  console.log(song);
  curSong = song;      
  songImage.src = song.img; 
  songName.textContent = song.name;
  artist.textContent = `Artists: ${song.artist}`;
  audio.src = song.source; 
}


fetch('music.json')
    .then(response => response.json())
    .then(data => {
      const jsonData = data;

      const uniqueGenres = ['All', ...new Set(jsonData.map(item => item.genre))];
      uniqueGenres.forEach(function(genre) {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        dropdown.appendChild(option);
      });

      // Event listener for dropdown change
      dropdown.addEventListener('change', function() {
        const selectedGenre = dropdown.value;
        showSongs(selectedGenre);
      });
     /* display song function */
      function displaySongs(songs) {
    
        songList.innerHTML = '';
        songs.forEach(function(song) {
          const songButton = document.createElement('button');
          songButton.type = 'button';
          songButton.className = 'btn btn-secondary'; // Bootstrap button class
          songButton.textContent = song.name; // Use the 'name' field for the song name
          songButton.addEventListener('click', function() {
            renderCurrentSong(song); // Play the song when the button is clicked
          });
          songList.appendChild(songButton);
        });
      

      }

      function showSongs(genre) {
        songList.innerHTML = '';
        const filteredSongs = (genre === 'All') ? jsonData : jsonData.filter(item => item.genre === genre);

        

        // Display song buttons
        filteredSongs.forEach(function(song) {
          const songButton = document.createElement('button');
          songButton.type = 'button';
          songButton.className = 'btn btn-secondary'; // Bootstrap button class
          songButton.textContent = song.name; // Use the 'name' field for the song name
          songButton.addEventListener('click', function() {
            renderCurrentSong(song); // Play the song when the button is clicked
          });
          songList.appendChild(songButton);
        });
      }
      showSongs('All');

      renderCurrentSong(jsonData[0]);
      
    })
    .catch(error => console.error('Error fetching music JSON:', error));

    function removeAllChildNodes(parent) {
      while (parent.firstChild) {
          parent.removeChild(parent.firstChild);
      }
    }

    fetch('playlist.json')
    .then(response => response.json())
    .then(data => {
        
      /* display playlist function */
        const playlistData = data;
        function displayPlaylists() {
            const playlistList = document.querySelector('#playlistList');

            removeAllChildNodes(playlistList);

            playlistData.forEach(playlist => {
                const playlistItem = document.createElement('a');
                playlistItem.classList.add('list-group-item');
                playlistItem.textContent = playlist.title;

                playlistItem.addEventListener('click', () => selectPlaylist(playlist));
                playlistList.appendChild(playlistItem);
            });
        }

        let currentindex = 0;
        let songQueue = [...playlistData[currentindex].songs];
        

        console.log(songQueue);

        function selectPlaylist(playlist) {
            for(let i in playlistData){
              if(i.title===playlist.title){
                currentindex=i;
              }
            }
            
            const songsList = document.querySelector('#songList');
            removeAllChildNodes(songsList);
            let index=0;
            playlist.songs.forEach((song, index) => {
              const songListItem = document.createElement('li');
              songListItem.className = 'list-group-item d-flex justify-content-between align-items-center';
              
              const songTitle = document.createElement('span');
              songTitle.textContent = song.name;
              
              const deleteButton = document.createElement('button');
              deleteButton.className = 'btn btn-danger';
              deleteButton.innerHTML=`<i class="fa-solid fa-trash" style="font-size: 14px;"></i>`;
              deleteButton.addEventListener('click', () => deleteSong(index)); // Add event listener to delete button
              
              songListItem.appendChild(songTitle);
              songListItem.appendChild(deleteButton);
              
              songsList.appendChild(songListItem);
          });

          function deleteSong(index) {
            songQueue.splice(index, 1); 
            playlistData[currentindex].songs=[...songQueue];
            selectPlaylist(playlistData[currentindex]); 
          }
        }
       /* create playlist function */
        function createPlaylist() {
            const playlistNameInput = document.getElementById("playlistName");
            const playlistName = playlistNameInput.value.trim();
            if (playlistName !== "") {
                const newPlaylist = { "title": playlistName, "songs": [] };
                playlistData.push(newPlaylist);
                playlistNameInput.value = ""; 
                console.log("Updating JSON data:", data);
                displayPlaylists();
            } else {
                alert("Please enter a playlist name.");
            }
        }

        const submitPlaylist = document.querySelector('#createPlaylist');
        submitPlaylist.addEventListener('click', createPlaylist);

        displayPlaylists();
        selectPlaylist(playlistData[currentindex]);

        const next= document.querySelector('#nextButton');
        next.addEventListener('click',nextSong);

        const prev= document.querySelector('#previousButton');
        prev.addEventListener('click',prevSong);

        function selectSong(song) {
          for(let i of songQueue){
            if(i.name===song.name){
              
              renderCurrentSong(song);
              break;
            }
            else{
              nextSong();
            }
          }
          
          songImage.src = song.img;
          songName.textContent = song.name;
          artist.textContent = `Artists: ${song.artist}`;
          audio.src = song.source; 
        }

        function nextSong(){
          if (songQueue.length > 0) {
            const nextSong = songQueue.shift();
            songQueue.push(nextSong);
            playlistData[currentindex].songs=[...songQueue];
            selectPlaylist(playlistData[currentindex]);
            selectSong(songQueue[0]);
          } else {
              console.log("End of playlist.");
          }
        }



        function prevSong(){
          if (songQueue.length > 0) {
            const prevSong = songQueue.pop();
            songQueue.unshift(prevSong);
            playlistData[currentindex].songs=[...songQueue];
            selectPlaylist(playlistData[currentindex]);
            selectSong(songQueue[0]);
          } else {
              console.log("End of playlist.");
          }
        }

        const addToPlaylistEl = document.querySelector('#addToPlaylistButton');
        addToPlaylistEl.addEventListener('click',()=> addtoPlaylist(curSong));

         /* Add song to playlist function */
        function addtoPlaylist(song){
          const existingSong = songQueue.find(existingSong => existingSong.name === song.name);

          if (!existingSong) {
              // Song does not exist, add it to the playlist
              songQueue.push(song);
              playlistData[currentindex].songs=[...songQueue];
              selectPlaylist(playlistData[currentindex]);
              console.log(`Song "${song.name}" added to the playlist.`);
          } else {
              console.log(`Song "${song.name}" already exists in the playlist.`);
          }
        }

    })
    .catch(error => console.error('Error fetching playlist JSON:', error));

    function createPlaylist(playlistName) {
      if (!playlists[playlistName]) {
          playlists[playlistName] = [];
          console.log(`Playlist "${playlistName}" created.`);
          renderPlaylists();
      } else {
          console.log("Playlist already exists.");
      }
  }
  
  /* Add song to playlist function */
  function addSongToPlaylist(songId, playlistName) {
      const song = songs.find(s => s.id === songId);
      if (song && playlists[playlistName]) {
          playlists[playlistName].push(song);
          console.log(`Added "${song.title}" to "${playlistName}"`);
          renderPlaylists();
      } else {
          console.log("Song or playlist not found");
      }
  }
  