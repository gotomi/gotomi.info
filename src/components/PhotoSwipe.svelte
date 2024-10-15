<script lang="ts">
    import {onMount} from "svelte";
    import type {photo} from "../types/photos";
    import ExifData from "./ExifData.svelte";


    let {photos = [], ratio = "4/5"}: { photos: photo[], ratio: string } = $props();
    let container: HTMLElement;
    let activeIndex: number = 0;
    let images: HTMLElement[] = [];
    let inViewport: boolean = false;

    function setActive(index: number, move: boolean = true) {
        if (index < 0 || index >= photos.length) return;
        if (images.length && move) {
            images[index].scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
            });
        }
        activeIndex = index;
    }

    onMount(() => {
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        let elem = entry.target as HTMLElement;
                        const current = parseInt(elem.getAttribute("data-id") || "0");
                        setActive(current, false);
                    }
                });
            },
            {
                root: container,
            }
        );

        const galleryInView = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    inViewport = entry.isIntersecting;
                });
            },
            {
                threshold: 0.25,
            }
        );

        images.forEach((image) => intersectionObserver.observe(image));
        galleryInView.observe(container);
    });

    let key: string | undefined = undefined;

    function handleKeydown(event: KeyboardEvent): void {
        if (!inViewport) return;
        key = event.key;
        if (key === "ArrowLeft") {
            setActive(activeIndex - 1);
        } else if (key === "ArrowRight") {
            setActive(activeIndex + 1);
        }
    }
</script>

<svelte:window onkeydown={handleKeydown}/>

<div class="container" style="--ratio: {ratio}">
    <div class="wrapper">
        <div class="counter">{activeIndex + 1} / {photos.length}</div>
        <div class="box" bind:this={container}>
            {#each photos as item, index}
                <img
                        src={item.normal}
                        alt={item.alt}
                        bind:this={images[index]}
                        data-id={index}
                        loading={index > 0 ? "lazy" : "eager"}
                />
            {/each}
        </div>

        <div class="navi">
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <span
                    onclick={() => setActive(activeIndex - 1)}
                    class={activeIndex === 0 ? "left disabled" : "left"}
            >
        <img src="/MusicApp/assets/arrows/arrow_circle_left_FILL.svg" alt=""/>
      </span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <span
                    onclick={() => setActive(activeIndex + 1)}
                    class={activeIndex === photos.length - 1 ? "right disabled" : "right"}
            >
        <img src="/MusicApp/assets/arrows/arrow_circle_right_FILL.svg" alt=""/>
      </span>
            <ul class="indicator">
                {#each photos as item, index}
                    <li class={activeIndex === index ? "active" : ""}>{index + 1}</li>
                {/each}
            </ul>
        </div>
    </div>
    <ExifData exif={photos[activeIndex].exif}/>
</div>

<style>
    .box {
        position: relative;
        max-width: 100%;
        max-height: calc(100vh - 200px);
        margin: auto;
        overflow: auto;
        white-space: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        aspect-ratio: var(--ratio);
    }

    .box::-webkit-scrollbar {
        display: none;
    }

    .box img {
        width: 100%;
        max-height: 100%;
        scroll-snap-align: center;
        object-fit: contain;
        display: inline-block;
        aspect-ratio: var(--ratio);
    }

    .wrapper {
        display: inline-block;
        position: relative;
        margin: 0 auto;
    }

    .container {
        text-align: center;
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
        filter: drop-shadow(0px 0px 5px #fff)
    }

    span.disabled {
        opacity: 0;
        cursor: default;
    }
</style>
