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

<ul class="photo-gallery">
  {#each photos as item, index}
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
  .photo-gallery img,
  .photo-gallery video {
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;
    aspect-ratio: 1;
    object-fit: contain;
  }

  .photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    grid-gap: 5px;
  }
  .featured {
    grid-row: span 5;
    grid-column: span 5;
  }
</style>
