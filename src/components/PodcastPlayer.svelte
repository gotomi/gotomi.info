<script>
    import { onMount } from 'svelte';

    let player, trackBar;
    let progressPercent = 0;
    let playerClassName = "player";
    let duration;
    let root;
    let progress = ``;
    let playbackRate;
    let playbackRates = [1, 1.25, 1.5, 1.75, 2];
    let chosenPlaybackRate = 0;

    const playButton = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="50">
    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
  </svg>`;

    const pauseButton = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="50">
    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
  </svg>`;

    const rewindButton = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="28">
    <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z" />
  </svg>`;
    const forwardButton = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="28">
    <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z" />
  </svg>`;

    const playspeedButton = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 16 16" fill="currentColor" style="transform: scale(0.8)" width="28"><g transform="translate(-148 -412)"><path d="M10.939,3.672a6.517,6.517,0,0,1,0,12.93v1.626a8.145,8.145,0,0,0,0-16.2v.016M4.988,16.45a8.1,8.1,0,0,0,4.327,1.84V16.664a6.486,6.486,0,0,1-3.161-1.329L4.992,16.453m1.161-11.4A6.481,6.481,0,0,1,9.316,3.683V2.057a7.966,7.966,0,0,0-4.328,1.79l1.165,1.2M5.009,6.156,3.844,4.994A8.061,8.061,0,0,0,2.05,9.334H3.671A6.538,6.538,0,0,1,5,6.158m-1.323,4.8H2.06A8.188,8.188,0,0,0,3.855,15.3l1.153-1.165a6.525,6.525,0,0,1-1.326-3.175" transform="translate(145.95 409.975)"/><g transform="translate(138 445)"><path d="M11,7.868h0a1.994,1.994,0,0,1,1.11.336l3.2,2.132.046.033a2,2,0,0,1-.046,3.3L12.11,15.8A2,2,0,0,1,9,14.133V9.87a2,2,0,0,1,2-2Zm3.163,4.109L11,9.868h0v4.265L14.2,12Z" transform="translate(5.803 -37)"/></g></g></svg>
`;

    let toggleButton = playButton;

    let time = 0;
    export let audioSource = "";
    export let podcastPlatforms = [];
    export let title = "";
    export let trackCover = "";
    export let albumCover = "/img/podcast-player/podcast.png";
    export let themeBgColor = "orangered";
    export let themeColor = "#333";
    export let autoplay = false;

    let progressBarWidth, progressBarLeft;

    onMount(async () => {
        const { left, width } = trackBar.getBoundingClientRect();
        progressBarWidth = width; 
        progressBarLeft = left;
	});
    

    function setProgress(e) {
        const x = e.clientX - progressBarLeft; //x position within the element.
        progressPercent = x / progressBarWidth;
        time = progressPercent * duration;
    }

    

    function togglePlay() {
        if (player.paused) {
            player.play();
            toggleButton = pauseButton;
            playerClassName = "player playing";
        } else {
            player.pause();
            toggleButton = playButton;
            playerClassName = "player";
        }
    }
    function onPlaying() {
        toggleButton = pauseButton;
        playerClassName = "player playing";
    }

    function formatTime(seconds) {
        const minutes = parseInt(seconds / 60);
        const onlySeconds = (parseInt(seconds % 60) + "").padStart(2, "0");
        return `${minutes}:${onlySeconds}`;
    }

    let globalID;
    function onTimeUpdate() {
        trackBar.style["border-left-width"] = Math.ceil((time / duration) * progressBarWidth) + "px";
        progress = `${formatTime(time)} / ${formatTime(duration)}`;
        globalID = requestAnimationFrame(onTimeUpdate);
    }

    function onLoadedData() {
        progress = `${formatTime(time)} / ${formatTime(duration)}`;
        autoplay && togglePlay();
    }

    function setPlaybackRate() {
        chosenPlaybackRate++;
        if (chosenPlaybackRate > playbackRates.length - 1) {
            chosenPlaybackRate = 0;
        }
        playbackRate = playbackRates[chosenPlaybackRate];
    }

    function handleKeydown(event) {
        if (event.keyCode === 32) {
            root === document.activeElement && togglePlay();
        }
    }

    function setFocus(e) {
        root.focus();
    }
</script>

<svelte:window on:keydown={handleKeydown} />

<div
    class="audioplayer"
    on:click={setFocus}
    style="--theme-bg-color: {themeBgColor};--theme-color: {themeColor}"
>
    <input type="text" class="root-focus" bind:this={root} />
    <div>
        <div class={playerClassName}>
            <img src={trackCover} class="author" alt="" width="200" height="200"/>
            <img src={albumCover} class="cover-bg" alt="" width="200" height="200l"/>
        </div>
    </div>
    <div class="panel">
        <h2 class="podcast-title">
            <span class="icon" on:click={togglePlay}>{@html toggleButton}</span>
            {title} 
        </h2>
   
        <div class="progress-bar" on:click={setProgress} bind:this={trackBar} id="track">

        </div>
        
        <div class="controls">
            
            <span class="icon" on:click={() => (time -= 15)}
                >{@html rewindButton}</span
            >
            <span class="icon" on:click={() => (time += 15)}
                >{@html forwardButton}</span
            >
            <span class="icon" on:click={setPlaybackRate}
                >{@html playspeedButton}</span
            >
            <span class="playbackrate-text"
                >{playbackRates[chosenPlaybackRate]}x</span
            >
            <span class="progress-display" id="progress">{progress}</span>     
            <ul class="platforms">
                {#each Object.entries(podcastPlatforms) as [platform, url]}
                    {#if platform !== "buzzsprout"}
                        <li>
                            <a href={url}
                                ><img
                                    src={"/img/podcast-player/icons/" +
                                        platform +
                                        ".svg"}
                                    alt={platform}
                                    title={platform}
                                /></a
                            >
                        </li>
                    {/if}
                {/each}
            </ul>
        </div>
        <!-- svelte-ignore a11y-media-has-caption -->
        <audio
            src={audioSource}
            bind:this={player}
            bind:currentTime={time}
            bind:duration
            bind:playbackRate
            on:loadeddata={onLoadedData}
            on:timeupdate={onTimeUpdate}
            on:playing={onPlaying}
            preload="metadata"
        />
    </div>
</div>

<style>
    .platforms {
        float: right;
    }
    .platforms,
    .platforms li {
        text-align: right;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .platforms li {
        display: inline-block;
        border-radius: 50%;
        background: var (--theme-color);
        margin: 0 0 10px 10px;
    }

    .platforms li img {
        width: 18px;
        height: 18px;
    }

    .audioplayer img {
        aspect-ratio: 1 / 1;
    }

    .progress-bar {
        background: white;
        border: 0 solid tomato;
        border-width: 0 0 0 1px;
        height: 10px;
        margin: 5px 0;
        border-radius: 5px;
    }

    .podcast-title {
        font-size: 16px;
        font-weight: 900;
        padding: 1rem 0 0 0;
        margin: 0;
    }

    .audioplayer .icon {
        cursor: pointer;
    }

    .audioplayer span {
        display: inline-block;
        vertical-align: middle;
        font-size: 13px;
    }

    .audioplayer .playbackrate-text,
    .audioplayer .progress-display {
        min-width: 48px;
        height: 21px;
        line-height: 21px;
    }

    .audioplayer {
        position: relative;
        border-radius: 5px;
        /* display: flex; */
        display: grid;
        grid-template-columns: 1fr 3fr;
        align-self: baseline;
        background-color: var(--theme-bg-color);
        color: var(--theme-color);
        max-width: 860px;
        font-family: "Open Sans", Arial, sans-serif;
        font-size: 13px;
        line-height: 1.5;
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
        transition: 0.3s cubic-bezier(0.6, 0.04, 0.98, 0.335);
    }


    
    .player.playing img.author {
        width: 90%;
        transform: translate(5%, 5%);
    }

    .player.playing img.cover-bg {
        filter: blur(1px);
    }

 

    input.root-focus {
        position: absolute;
        width: 1px;
        height: 1px;
        border: 0;
        z-index: -1;
        background-color: transparent;
    }
</style>
