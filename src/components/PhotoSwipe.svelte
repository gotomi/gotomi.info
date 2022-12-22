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

<div class="wrapper">
  <div class="counter">1 / {photos.length}</div>

  <div class="container" id="photos">
    {#each photos as item, index}
      <img src={item.url} alt={item.title} id={"item" + index} />
    {/each}
  </div>
</div>

<style>
  .wrapper {
    position: relative;
    width: min(900px, 100vw);
    margin: auto;
  }
  .container {
    display: flex;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }
  .container img {
    flex: 1;
    scroll-snap-align: start;
    max-width: min(900px, 100vw);
  }
  .counter {
    background: #0009;
    color: #fff9;
    font-size: 13px;
    padding: 0px 6px;
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 2;
    border-radius: 3px;
  }
</style>
