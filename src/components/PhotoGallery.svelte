<script>
  let { photos = [], showFeatured = false } = $props();


  let activeIndex = $state(0);

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
      onclick={() => setActive(index)}
    >
      <span>
        {#if item.uri.endsWith(".jpg") || item.uri.endsWith(".webp") || item.type === "image"}
          <img src={`${item.uri}`} width="400" height="400" alt={item.text} />
        {:else}
          <video
            src={`${item.uri}`}
            width="400"
            height="400"
            alt={item.title}
            loop
            autoplay
></video>
        {/if}</span
      >
    </li>
  {/each}
</ul>

<style>
  .photo-gallery,
  .photo-gallery li {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
  }

  .photo-gallery span::after {
    content: "";
    position: absolute;
    z-index: 1;
    background-color: #fff5;
    top: 0;
    bottom: 0;
    left: 0;
    right: 100%;
    transition: 0.3s;
  }

  .photo-gallery li:hover span::after {
    right: 0;
  }

  .photo-gallery img,
  .photo-gallery video {
    width: 100%;
    height: auto;
    display: block;
    aspect-ratio: 1;
    object-fit: cover;
    display: block;
  }

  .photo-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(75px, 1fr));
    grid-gap: 8px;
    padding-block: 16px;
  }

  .photo-gallery li:last-child {
    display: none;
  }

  @media (min-width: 800px) {
    .photo-gallery li {
      cursor: pointer;
    }
    .featured {
      grid-row: span 2;
      grid-column: span 2;
      order: -1;
    }
    .photo-gallery {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }
    .photo-gallery li:last-child {
      display: initial;
    }
  }
</style>
