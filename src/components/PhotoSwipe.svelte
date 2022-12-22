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

<div class="container" id="photos">
  {#each photos as item, index}
    <img src={item.url} alt={item.title} id="{'item' + index}" />
  {/each}
</div>

<style>
  .container {
    margin: auto;
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    width: min(900px, 100vw)
  }
  .container img {
    flex: 1;
    scroll-snap-align: start;
    max-width: min(900px, 100vw)
  }
</style>
