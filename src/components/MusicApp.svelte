<script>
  import MusicPlayer from "./MusicPlayer.svelte";
  export let playlist = [];
  let curentSongIndex = 0;
  let autoplay;
  let songButtons = [];

  function changeSong(index) {
    curentSongIndex = index;
    autoplay = true;
  }

  function handlePlaylistKeydown(e, index) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      changeSong(index);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.min(index + 1, songButtons.length - 1);
      songButtons[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      songButtons[prev]?.focus();
    }
  }
</script>

<div class="music-app">
  <div class="playlist">
    <ul>
      {#each playlist as item, index}
        <li
          class={index === curentSongIndex ? "active-song" : ""}
        >
          <button
            class="song-btn"
            bind:this={songButtons[index]}
            on:click={() => changeSong(index)}
            on:keydown={(e) => handlePlaylistKeydown(e, index)}
          >
            🎹 {item.title}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  <MusicPlayer {playlist} {autoplay} bind:curentSongIndex />
</div>

<style>
  .music-app {
    display: grid;
    grid-template-columns: 1fr 3fr;
    align-items: flex-start;
    grid-gap: 1rem;
  }

  .playlist li {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .playlist li,
  .playlist ul {
    list-style: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  .song-btn {
    all: unset;
    cursor: pointer;
    display: block;
    width: 100%;
    text-align: inherit;
  }
  .song-btn:focus-visible {
    outline: 2px solid var(--player-theme-progress-color, #fff);
    outline-offset: 2px;
    border-radius: 2px;
  }
  .playlist li.active-song {
    font-weight: bold;
  }

  @media (max-width: 480px) {
    .music-app {
      grid-template-columns: 1fr;
    }
    .playlist li {
      display: inline;
    }
  }

  .playlist {
    padding: 1rem;
    background-color: var(--player-theme-bg-color);
    color: var(--player-theme-color);
    height: 100%;
  }

  .playlist ul {
    list-style-type: square;
  }
</style>
