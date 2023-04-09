<script>
  export let photos = [];
  let active_item = 0; //readonly
  let SwipeComp;

  function setActive(index) {
    if (index < 0 || index >= photos.length) return;
    SwipeComp.goTo(index);
  }

  let key = 0;
  function handleKeydown(event) {
    key = event.key;
    if (key === "ArrowLeft") {
      setActive(active_item - 1);
    } else if (key === "ArrowRight") {
      setActive(active_item + 1);
    }
  }

  const swipeConfig = {
    autoplay: false,
    delay: 2000,
    showIndicators: true,
    transitionDuration: 1000,
    defaultIndex: 0,
  };

  function slideChange({ detail }) {
    const index = detail.active_item;
    const images = document.querySelectorAll(".featured img");
    if (images[index].src !== photos[index].normal) {
      images[index].src = photos[index].normal;
      images[index].className = "";
    }

    if (photos.length - 1 > index) {
      images[index + 1].src = photos[index + 1].normal;
      images[index + 1].className = "";
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="featured">
  <!-- <span class="prev" on:click={() => setActive(active_item - 1)}
    ><span>⇦</span></span
  >
  <span class="next" on:click={() => setActive(active_item + 1)}
    ><span>⇨</span></span
  > -->
  <Swipe bind:active_item bind:this={SwipeComp} on:change={slideChange}>
    {#each photos as item, i}
      <SwipeItem>
        <img
          src={i < 2 ? item.normal : item.thumbnail}
          class={i < 1 ? "" : "hide"}
          alt={item.alt}
        />
      </SwipeItem>
    {/each}
  </Swipe>
</div>

<div class="photo-gallery-container">
  <ul class="photo-gallery">
    {#each photos as item, i}
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <li
        on:click={() => setActive(i)}
        class={active_item == i ? "active" : ""}
      >
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
  .photo-gallery li.active {
    border: 5px solid rgb(18, 1, 1);
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
  .featured img.hide {
    visibility: hidden;
  }

  /* .next,
  .prev {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 999;
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
    color: #fff;
    text-shadow: 2px 3px 4px var(--copy-bg-color);
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
  } */
</style>
