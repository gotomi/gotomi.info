<script>
  import { preventDefault } from 'svelte/legacy';

  let {
    autoplay = false,
    playlist = {},
    currentSongIndex = 0,
    onCurrentSongEnded = () => {},
  } = $props();

  import coverBg from "./assets/gotomi.png";
  import playButton from "./assets/playButton.svg";
  import pauseButton from "./assets/pauseButton.svg";
  import rewindButton from "./assets/rewindButton.svg";
  import forwardButton from "./assets/forwardButton.svg";

  let player = $state();

  let playerClassName = $state("player");
  let duration = $state();

  let progressPercent = $state(0);
  let sliderBackground = $derived(
    `linear-gradient(to right, var(--player-theme-progress-color) ${progressPercent}%, var(--player-theme-progress-bgColor) ${progressPercent}%)`
  );

  let toggleButton = $state(playButton.src);
  let time = $state(0);

  let { audio, title, cover } = $state(
    Array.isArray(playlist) ? playlist[currentSongIndex] : playlist
  );
  let progressDisplay = $derived.by(() => {
    return `${formatTime(time)} / ${formatTime(duration)}`;
  });

  $effect(() => {
    ({ audio, title, cover } = Array.isArray(playlist)
      ? playlist[currentSongIndex]
      : playlist);
  });

  function setProgress(e) {
    time = (Number(progressPercent) * Number(duration)) / 100;
  }

  function setPlayerState(state) {
    if (state === "paused") {
      toggleButton = pauseButton.src;
      playerClassName = "player playing";
    } else {
      toggleButton = playButton.src;
      playerClassName = "player";
    }
  }

  function togglePlay() {
    if (player.paused) {
      player.play();
    } else {
      player.pause();
      setPlayerState("playing");
    }
  }

  function onPlaying() {
    setPlayerState("paused");
  }

  function onEnded() {
    setPlayerState("playing");
    if (currentSongIndex < playlist.length - 1) {
      currentSongIndex += 1;
      onCurrentSongEnded(currentSongIndex);
    }
  }

  function formatTime(seconds) {
    const minutes = parseInt(seconds / 60);
    const onlySeconds = (parseInt(seconds % 60) + "").padStart(2, "0");
    return `${minutes}:${onlySeconds}`;
  }

  let globalID;

  function onTimeUpdate() {
    progressPercent = Math.ceil((time / duration) * 100);
    globalID = requestAnimationFrame(onTimeUpdate);
  }

  function onLoadedMetaData() {
    autoplay && togglePlay();
  }
  function onKeyDown(e) {
    if (e.keyCode === 32) {
      togglePlay();
    }
  }
</script>

<svelte:window onkeydown={preventDefault(onKeyDown)} />
<!-- svelte-ignore state_referenced_locally -->
<div class="audioplayer">
  <div>
    <div class={playerClassName}>
      <img src={cover} class="author" alt="" width="200" height="200" />
      <img src={coverBg.src} class="cover-bg" alt="" width="200" height="200" />
    </div>
  </div>
  <div class="panel">
    <h2 class="track-title">
      <button class="icon" onclick={togglePlay}
        ><img src={toggleButton} alt="play" width="50" height="50" /></button
      >
      {title}
    </h2>

    <div class="progress-bar">
      <input
        type="range"
        id="volume"
        bind:value={progressPercent}
        name="volume"
        min="0"
        max="100"
        step="1"
        onclick={setProgress}
        style="background: {sliderBackground}"
      />
    </div>

    <div class="controls">
      <button class="icon" onclick={() => (time -= 15)}
        ><img
          src={rewindButton.src}
          alt="rewind"
          width="28"
          height="28"
        /></button
      >
      <button class="icon" onclick={() => (time += 15)}
        ><img
          src={forwardButton.src}
          alt="forward"
          width="28"
          height="28"
        /></button
      >
      <span class="progress-display" id="progress">{progressDisplay}</span>
    </div>
    <!-- svelte-ignore a11y_media_has_caption -->
    <audio
      src={audio}
      bind:this={player}
      bind:currentTime={time}
      bind:duration
      ontimeupdate={onTimeUpdate}
      onloadedmetadata={onLoadedMetaData}
      onplaying={onPlaying}
      onended={onEnded}
      preload="metadata"
    ></audio>
  </div>
</div>

<style>
  .progress-bar {
    width: 100%;
  }

  .controls,
  .track-title {
    display: flex;
    align-items: center;
  }

  .track-title {
    font-size: 1.4rem;
    font-weight: 900;
    padding: 1rem 0 0 0;
    margin: 0;
  }

  .audioplayer .icon {
    cursor: pointer;
    background: none;
    border: 0;
  }

  .audioplayer span {
    display: inline-block;
    vertical-align: middle;
  }

  .audioplayer .progress-display {
    min-width: 48px;
    height: 21px;
    line-height: 21px;
  }

  .audioplayer {
    --player-theme-bgColor: var(--player-bgColor, #ffbf00);
    --player-theme-color: var(--player-color, #1f1f1f);
    --player-theme-progress-bgColor: var(--player-progress-bgColor, #1f1f1f);
    --player-theme-progress-color: var(--player-progress-color, #fc4400);

    position: relative;
    height: 100%;
    display: grid;
    grid-template-columns: auto 3fr;
    align-self: baseline;
    background-color: var(--player-theme-bgColor);
    color: var(--player-theme-color);
    max-width: 860px;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    .audioplayer {
      grid-template-columns: 2fr 5fr;
    }
  }

  .panel {
    padding: 0 10px 0 30px;
    position: relative;
    align-self: flex-start;
  }

  @media all and (min-width: 600px) {
    .player {
      max-width: 120px;
    }
  }

  .player img {
    width: 100%;
    height: auto;
    display: block;
  }

  .player {
    flex: 1 1 120px;
    margin: 10px;
    position: relative;
    z-index: 1;
  }

  .player .author {
    position: absolute;
    z-index: 2;
    transform-origin: 100% 100%;
    transform: translate(220%, 220%);
    width: 36%;
    transition: transform 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
  }

  .player.playing img.author {
    width: 90%;
    transform: translate(5%, 5%);
  }

  .player.playing img.cover-bg {
    filter: blur(1px);
  }

  input[type="range"] {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none;
    /* creating a custom design */
    width: 100%;
    cursor: pointer;
    outline: none;
    border-radius: 15px;
    /*  overflow: hidden;  remove this line*/

    /* New additions */
    height: 6px;
    background: var(--player-theme-progress-bgColor);
  }

  /* Thumb: webkit */
  input[type="range"]::-webkit-slider-thumb {
    /* removing default appearance */
    -webkit-appearance: none;
    appearance: none;
    /* creating a custom design */
    height: 15px;
    width: 15px;
    background-color: var(--player-theme-progress-color);
    border-radius: 50%;
    border: none;

    /* box-shadow: -407px 0 0 400px #f50; emove this line */
    transition: 0.2s ease-in-out;
  }

  /* Thumb: Firefox */
  input[type="range"]::-moz-range-thumb {
    height: 15px;
    width: 15px;
    background-color: var(--player-theme-progress-color);
    border-radius: 50%;
    border: none;
    transition: 0.2s ease-in-out;
  }
</style>
