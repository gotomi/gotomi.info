<script>
  import { onMount } from "svelte";
  export let photos = [];
  let container;
  let activeIndex = 0;
  let images = [];

  function setActive(index, move = true) {
    if (index < 0 || index >= photos.length) return;
    if (images.length && move) {
      images[index].scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
    activeIndex = index;
  }

  onMount(() => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(
          (entry) => {
            if (entry.isIntersecting) {
              let elem = entry.target;
              const current = parseInt(elem.getAttribute("data-id"));
              setActive(current, false);
            }
          },
          {
            root: container,
          }
        );
      },
      {
        threshold: 0.25,
      }
    );

    images.forEach((image) => intersectionObserver.observe(image));
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

<div class="wrapper">
  <div class="counter">{activeIndex + 1} / {photos.length}</div>

  <div class="container" bind:this={container}>
    {#each photos as item, index}
      <img
        src={item.url}
        alt={item.title}
        bind:this={images[index]}
        data-id={index}
      />
    {/each}
  </div>

  <div class="navi">
    <span
      on:click={() => setActive(activeIndex - 1)}
      class={activeIndex === 0 ? "left disabled" : "left"}
    >
      <img src="/assets/arrows/arrow_circle_left_FILL.svg" alt="" />
    </span>
    <span
      on:click={() => setActive(activeIndex + 1)}
      class={activeIndex === photos.length - 1 ? "right disabled" : "right"}
    >
      <img src="/assets/arrows/arrow_circle_right_FILL.svg" alt="" />
    </span>
    <ul class="indicator">
      {#each photos as item, index}
        <li class={activeIndex === index ? "active" : ""}>{index + 1}</li>
      {/each}
    </ul>
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
  .container::-webkit-scrollbar {
    display: none;
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

  .indicator,
  .indicator li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .indicator {
    display: flex;
    gap: 8px;
    margin: 10px auto;
    align-items: center;
    justify-content: center;
  }
  .indicator li {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    text-indent: -9999px;
    background-color: #fff9;
  }
  .indicator li.active {
    background-color: #ed380090;
  }

  .navi {
    display: flex;
    justify-content: space-between;
  }

  span {
    cursor: pointer;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    opacity: 0.6;
    color: #fff;
  }

  span.left {
    left: 8px;
  }
  span.right {
    right: 8px;
  }

  span img {
    width: 100%;
  }

  span.disabled {
    opacity: 0;
    cursor: default;
  }
</style>
