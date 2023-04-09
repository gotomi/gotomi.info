<script>
  // import "./galleryTeaser.css?eedwe";
  export let title = "";
  export let image = "";
  export let delay = 0;
  export let href;
</script>

<div class="container">
  <a {href}>
    <div
      class="lead"
      style={`background-image: url(${image});animation-delay:${delay}s`}
    >
      {#each title.split("") as character}
        {#if character === " " || character === "-"}
          <span>&nbsp;</span>
        {:else}
          <span>{character}</span>
        {/if}
      {/each}
    </div>
    <div class="bg" style={`background-image: url(${image})`} />
  </a>
</div>

<style>
  @keyframes backgroundOpacity {
    0% {
      background-color: #2f2f2fee;
    }
    30% {
      background-color: #2f2f2fee;
    }
    100% {
      background-color: #ff830060;
    }
  }
  @keyframes backgroundMove {
    0% {
      background-position: 0 0;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
    }

    50% {
      background-position: 50% 100%;
    }

    100% {
      background-position: 50%;
      -webkit-text-fill-color: #f5f5f5;
      -webkit-background-clip: text;
      background-size: 200%;
      white-space: inherit;
    }
  }
  a {
    display: block;
    text-decoration: none;
    display: contents;
  }
  .container {
    /* background-image: linear-gradient(to bottom, #5f5f5f, #000); */
    background-color: #2f2f2f;
    overflow: hidden;
    aspect-ratio: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background-size: cover;
    position: relative;
    /* container: my-container / inline-size; */
    animation-duration: 5s;
    animation-name: backgroundOpacity;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: cover;
    z-index: -1;
  }
  .lead {
    background-repeat: no-repeat;
    font-size: 40px;
    padding: 16px;
    font-family: Poppins, sans-serif;
    font-weight: 900;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200%;
    background-position: 0;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    height: 100%;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    justify-content: center;
    animation-duration: 5s;
    animation-name: backgroundMove;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
    color: #fff;
    filter: drop-shadow(2px 2px 0 #555);
    /* position: relative;
    z-index: 2; */
  }
</style>
