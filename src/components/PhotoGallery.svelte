<script>
  export let photos = [];
  export let showFeatured = false;
  let activeIndex = -1;

  function setActive(index) {
    if (showFeatured) {
      activeIndex = index;
    }
  }
</script>
<svg width="0" height="0">
  <filter id="vhs-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.8 0.8" numOctaves="1" result="noise"/>
    <feColorMatrix in="noise" type="matrix"
      values="1 0 0 0 0
              0 0.9 0.5 0 0
              0 0.5 1 0 0
              0 0 0 1 0"/>
    <feComposite operator="out" in2="SourceGraphic" result="mask"/>
    <feFlood flood-color="#FFF" flood-opacity="0.8" result="stripe"/>
    <feComposite operator="in" in2="stripe" in="mask"/>
    <feComposite operator="over" in2="mask" in="SourceGraphic"/>
  </filter>
</svg>


<ul class="photo-gallery">
  {#each photos as item, index}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <li
      class={activeIndex === index ? "featured" : ""}
      on:click={() => setActive(index)}
    >
      {#if item.uri.endsWith(".jpg") || item.uri.endsWith(".webp") || item.type === "image"}
        <img
          src={`${item.uri}`}
          width="400"
          height="400"
          alt={item.title}
          title={item.title}
        />
      {:else}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video
          src={`${item.uri}`}
          width="400"
          height="400"
          alt={item.title}
          loop
          autoplay
        />
      {/if}
    </li>
  {/each}
</ul>

<style>
  .photo-gallery, 
  .photo-gallery li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .photo-gallery img,
  .photo-gallery video {
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }

  .photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    grid-gap: 8px;
    padding-block: 16px;
  }
  .featured {
    grid-row: span 5;
    grid-column: span 5;
  }
  @keyframes shake {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(-4px, -4px) rotate(-2deg);
  }
  50% {
    transform: translate(4px, 4px) rotate(2deg);
  }
  75% {
    transform: translate(-4px, 4px) rotate(-2deg);
  }
  100% {
    transform: translate(4px, -4px) rotate(2deg);
  }
}

img:hover {
  animation-name: shake;
  animation-duration: .3s;
  animation-iteration-count: 1;
}
</style>
