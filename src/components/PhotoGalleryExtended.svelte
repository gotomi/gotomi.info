<script>
  export let photos = [];

  let activeIndex = 0;
  let activeItem = "";
  function setActive(index) {
    if (index < 0 || index >= photos.length) return;
    activeIndex = index;
    activeItem = photos[index].url;
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
  <div class="featured"><img src={activeItem} alt="" /></div>
{/if}
<div class="photo-gallery-container">
  <ul class="photo-gallery">
    {#each photos as item, index}
      <li on:click={() => setActive(index)}>
        <img src={item.url} width="400" height="400" alt={item.text} />
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
    grid-gap: 1rem;
  }
  .photo-gallery li {
    flex: 1 0 100px;
  }
  .photo-gallery-container {
    position: fixed;
    bottom: 1rem;
    left: 0;
    background-color: #ffffff80;
    padding: 1rem;
  }

  :global(section) {
    padding: 1rem max(1rem, calc(30% - 780px / 2));
  }
  .featured {
    height: 70vh;
    text-align: center;
    margin: 1rem 0;
    /* display: flex; */
    justify-content: center;
  }
  .featured img {
    max-width: 100%;
    background-color: #ffffff80;
    vertical-align: middle;
    object-fit: contain;
    height: 70vh;
    padding: 1rem;
  }
</style>
