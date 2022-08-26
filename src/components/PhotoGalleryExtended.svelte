<script>
  import { onMount } from "svelte";
  export let photos = [];

  let activeIndex = 0;
  let photoContainer;
  let bigImages = [];

  function setActive(index, move = true) {
    console.log("setActive: " + index, move);
    if (index < 0 || index >= photos.length) return;
    if (bigImages.length && move) {
      bigImages[index].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    activeIndex = index;
  }

  let featuredPhotos = photos;

  onMount(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(
        (entry) => {
          if (entry.isIntersecting) {
            let elem = entry.target;
            elem.src = elem.src.replace("thumbnails", "normal");
            const current = parseInt(elem.getAttribute("data-id"));
            setActive(current, false);
          }
        },
        {
          root: photoContainer,
        }
      );
    });

    bigImages.forEach((image) => intersectionObserver.observe(image));
  });

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
<div class="featured" id="scroller" bind:this={photoContainer}>
  <!-- <span class="prev" on:click={() => setActive(activeIndex - 1)}
      ><span>⇦</span></span
    >
    <span class="next" on:click={() => setActive(activeIndex + 1)}
      ><span>⇨</span></span
    > -->

  {#each featuredPhotos as item, index}
    <img
      src={item.thumbnail}
      alt={item.alt}
      bind:this={bigImages[index]}
      data-id={index}
    />
  {/each}
  <!-- <p>{JSON.stringify(activeItem.exif)}</p> -->
</div>

<div class="photo-gallery-container">
  <ul class="photo-gallery">
    {#each photos as item, index}
      <li
        on:click={() => setActive(index)}
        class={index === activeIndex ? "active" : "normal"}
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
    margin-right: 100px;
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
    position: fixed;
    top: 50%;
    display: none;
    z-index: 3;
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
