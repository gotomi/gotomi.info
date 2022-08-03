<script>
  export let photos = [];

  let activeIndex = 0;
  let activeItem = "";
  function setActive(index) {
    if (index < 0 || index >= photos.length) return;
    activeIndex = index;
    activeItem = photos[index];
  }

  setActive(0);

  let key = 0;
  function handleKeydown(event) {
    key = event.key;
    if (key === "ArrowLeft") {
      setActive(activeIndex - 1);
    } else if (key === "ArrowRight") {
      setActive(activeIndex + 1);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />
{#if activeItem}
  <div class="featured">
    <span class="prev" on:click={() => setActive(activeIndex - 1)}
      ><span>⇦</span></span
    >
    <span class="next" on:click={() => setActive(activeIndex + 1)}
      ><span>⇨</span></span
    >
    <img
      src={activeItem.normal}
      style={`aspect-ratio:${activeItem.width}/${activeItem.height}`}
      alt={activeItem.alt}
      title={JSON.stringify(activeItem.exif)}
    />
  </div>
{/if}
<div class="photo-gallery-container">
  <ul class="photo-gallery">
    {#each photos as item, index}
      <li on:click={() => setActive(index)}>
        <img
          src={item.thumbnail}
          alt={item.alt}
          title={JSON.stringify(item.exif)}
        />
      </li>
    {/each}
  </ul>
</div>

<style>
  .photo-gallery img {
    width: 150px;
    height: auto;
    display: block;
    cursor: pointer;
    object-fit: cover;
    aspect-ratio: 1;
  }

  .photo-gallery {
    display: flex;
    overflow: scroll;
    grid-gap: 5px;
  }
  .photo-gallery li {
    flex: 1 0 50px;
  }
  .photo-gallery-container {
    /* position: fixed; */
    bottom: 0;
    left: 0;
    background-color: #ffffff80;
    padding: 5px;
  }

  :global(section) {
    /* padding: 1rem max(1rem, calc(30% - 780px / 2)); */
    padding: 1rem;
  }
  .featured {
    height: 70vh;
    text-align: center;
    margin: 1rem 0;
    /* display: flex; */
    justify-content: center;
    position: relative;
  }
  .featured img {
    max-width: 100%;
    max-height: 100%;
    border: 0.25rem solid #99999980;
    border-radius: 0.5rem;
    vertical-align: middle;
  }

  .next,
  .prev {
    position: absolute;
    top: 0;
    bottom: 0;
  }
  .next {
    right: 0;
    left: 50%;
  }
  .prev {
    left: 0;
    right: 50%;
  }

  .next span,
  .prev span {
    font-size: 2rem;
    color: #555;
    background-color: #ffffff50;
    padding: 0.75rem;
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    display: none;
  }
  .prev span {
    left: 0;
  }
  .next span {
    right: 0;
  }
  .featured:hover span {
    display: initial;
  }
</style>
