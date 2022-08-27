<script>
  import { onMount } from "svelte";
  export let photos = [];

  let activeIndex = 0;
  let photoContainer;
  let bigImages = [];

  function setActive(index, move = true) {
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
    <div class="featured-item">
      <img
        src={item.thumbnail}
        alt={item.alt}
        bind:this={bigImages[index]}
        data-id={index}
      />
      {#if item.exif}
        <div class="exif-info ">
          <!-- {JSON.stringify(item?.exif)}
        {"FFNumber":2.8,"ISO":160,"exposureTime":"1/4000","LensMake":"FUJIFILM","FocalLength":27,"FocalLengthIn35mmFormat":41,"LensModel":"XF27mmF2.8 R WR"} -->

          <ul>
            <li>
              <span class="icon lens">lens</span>
              <!-- {item?.exif?.LensMake} -->
              {item?.exif?.LensModel}
            </li>
            <li>
              <span class="icon exposure">exposure</span>
              {item?.exif?.exposureTime}
            </li>

            <li>
              <span class="icon aperture">aperture</span>F {item?.exif
                ?.FFNumber}
            </li>
            <li><span class="icon iso">ISO</span> {item?.exif?.ISO}</li>
          </ul>
        </div>
      {/if}
    </div>
  {/each}
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
  .exif-info {
    position: absolute;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.5rem;
    color: #222;
    background-color: #c0c0c080;
    backdrop-filter: blur(3px);
    z-index: 33;
    text-align: center;
    border-radius: 5px;
  }
  .exif-info li,
  .exif-info ul {
    display: inline-block;
  }
  .icon {
    display: inline-block;
    width: 25px;
    height: 25px;
    text-indent: -99999px;
    background-size: cover;
    margin: 0 5px;
    filter: contrast(0.5);
  }

  .aperture {
    background-image: url("/assets/icons8-aperture-50.png");
  }
  .iso {
    background-image: url("/assets/icons8-iso-50.png");
  }
  .exposure {
    background-image: url("/assets/icons8-exposure-50.png");
  }
  .lens {
    background-image: url("/assets/icons8-lens-50.png");
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
  .featured-item {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 100%;
    /* border: 0.25rem solid #99999980; */
    border-radius: 0.5rem;
    vertical-align: middle;
    scroll-snap-align: start;

    margin-right: 100px;
  }
  .featured-item img {
    object-fit: contain;
    width: 100%;
    height: 100%;
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
  .active img {
    border: 5px solid #333;
    border-radius: 5px;
  }
</style>
