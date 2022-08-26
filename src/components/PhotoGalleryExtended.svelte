<script>
  import { onMount } from "svelte";
  export let photos = [];

  let activeIndex = 0;
  let activeItem = "";
  let nextItem = "";
  let bigImages = [];

  function setActive(index) {
    if (index < 0 || index >= photos.length) return;
    if (bigImages.length) {
      bigImages[index].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    activeIndex = index;
    activeItem = photos[index];
    nextItem = photos[index + 1];
  }

  let counter = 1;
  let featuredPhotos = photos;

  let trigger;
  // element.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"})
  onMount(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          let elem = entry.target;
          elem.src = elem.src.replace("thumbnails", "normal");
        }
      });
      if (entries.some((entry) => entry.intersectionRatio > 0)) {
        // setActive(counter);
        // featuredPhotos = [...featuredPhotos, photos[counter]];
        // counter++;
      }
    });

    bigImages.forEach((image) => intersectionObserver.observe(image));
  });

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
  <div class="featured" id="scroller">
    <!-- <span class="prev" on:click={() => setActive(activeIndex - 1)}
      ><span>⇦</span></span
    >
    <span class="next" on:click={() => setActive(activeIndex + 1)}
      ><span>⇨</span></span
    > -->

    {#each featuredPhotos as item, index}
      <img src={item.thumbnail} alt={item.alt} bind:this={bigImages[index]} />
    {/each}
    <span bind:this={trigger}>x</span>
    <!-- <p>{JSON.stringify(activeItem.exif)}</p> -->
  </div>
{/if}
<div class="photo-gallery-container">
  <ul class="photo-gallery">
    {#each photos as item, index}
      <li
        on:click={() => setActive(index)}
        class={index === activeIndex ? "active" : ""}
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
    justify-content: center;
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    width: 100%;
    white-space: nowrap;
  }
  .featured img {
    width: 100%;
    height: 100%;
    /* border: 0.25rem solid #99999980; */
    border-radius: 0.5rem;
    vertical-align: middle;
    scroll-snap-align: start;
    object-fit: contain;
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
  }
  .active img {
    border: 5px solid #333;
    border-radius: 5px;
  }
</style>
