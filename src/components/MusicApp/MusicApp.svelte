<script>
  import MusicPlayer from "./MusicPlayer.svelte";

  let { playlist = {}, autoplay = false, showPlaylist = true } = $props();

  let currentSongIndex = $state(0);

  function changeSong(index) {
    currentSongIndex = index;
    autoplay = true;
  }
</script>

<div class="music-app" class:showPlaylist={showPlaylist}>
 {#if showPlaylist} <div class="playlist">
    {#each playlist as item, index}
      <button
        class={index === currentSongIndex ? "active-song" : ""}
        onclick={() => changeSong(index)}
      >
        🎹 {item.title}
      </button>
    {/each}
  </div>
  {/if}
  <MusicPlayer
    {playlist}
    {autoplay}
    {currentSongIndex}
    onCurrentSongEnded={() => changeSong(currentSongIndex + 1)}
  />
</div>

<style>
  .music-app {
    display: grid;
    grid-template-columns: 3fr;
    align-items: flex-start;
    grid-gap: 1rem;
  }

  .showPlaylist {
    grid-template-columns: 1fr 3fr;
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    display: block;
    flex: 1 1 240px;
    text-align: left;
  }

  .active-song {
    font-weight: bold;
  }

  @media (max-width: 480px) {
    .music-app {
      grid-template-columns: 1fr;
    }
  }

  .playlist {
    padding: 1rem;
    background-color: var(--player-theme-bg-color);
    color: var(--player-theme-color);
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
</style>
