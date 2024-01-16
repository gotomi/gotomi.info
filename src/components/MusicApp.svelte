<script>
  import MusicPlayer from "./MusicPlayer.svelte";
  export let playlist = [];
  let curentSongIndex = 0;
  let autoplay;
  function changeSong(index) {
    curentSongIndex = index;
    autoplay = true;
  }
</script>

<div class="music-app">
  <div class="playlist">
    <ul>
      {#each playlist as item, index}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <li
          class={index === curentSongIndex ? "active-song" : ""}
          on:click={() => changeSong(index)}
        >
          🎹 {item.title}
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

  .playlist li,
  .playlist ul {
    list-style: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
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
