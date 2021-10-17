<script>
  import PodcastPlayer from "./PodcastPlayer.svelte";
  export let playlist = [];
  
  let { audioSource, title, trackCover, albumCover } = playlist[0];
  let autoplay;
  function change(i) {
    audioSource = playlist[i].audioSource;
    title = playlist[i].title;
    trackCover = playlist[i].trackCover;
    albumCover = playlist[i].albumCover;
    autoplay = true;
  }
</script>

<div class="music-app chunk">
  <div class="playlist">

 
  <ul >
    {#each playlist as item, index}
      <li on:click={() => change(index)}>🎹 {item.title}</li>
      <!-- ► -->
    {/each}
  </ul>
</div>
    <PodcastPlayer
      {audioSource}
      title={title}
      trackCover={trackCover}
      albumCover={albumCover}
      themeBgColor="#ffbf00"
      themeColor="#000"
      autoplay=false
    />
</div>
<style>
  .music-app{
    display: grid;
    grid-template-columns: 1fr 3fr; 
    align-items: flex-start;
    grid-gap: 1rem;
  }
  .playlist li,
  .playlist ul{
    list-style: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
  }
  .playlist{
    background-color: #ffbf00;
    padding: 1rem;
    border-radius: 5px;
    font-size: 90%;
    font-family: Poppins, Arial, Helvetica, sans-serif;
  }

  .playlist ul{
    list-style-type: square;
  }

</style>