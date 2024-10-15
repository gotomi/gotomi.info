<script>
    import { onMount } from "svelte";
    let { photos = []} = $props();
    let displayExif = $state(false);
    let activeIndex = $state(0);
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

    function showExif() {
        displayExif = !displayExif;
    }
    let featuredPhotos = photos;

    onMount(() => {
        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => {
                        if (entry.isIntersecting) {
                            let elem = entry.target;
                            elem.src = elem.src.replace("thumbnails", "normal");
                            const current = parseInt(
                                elem.getAttribute("data-id"),
                            );
                            setActive(current, false);
                        }
                    },
                    {
                        root: photoContainer,
                    },
                );
            },
            {
                threshold: 0.25,
            },
        );

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

<svelte:window onkeydown={handleKeydown} />
<p class="tip">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    Przeglądaj galerię za pomocą strzałek ⇦ ⇨ lub klikając w miniaturki.
    <span onclick={() => showExif()}
        >Pokaż EXIF <span class="icon info" title="Exif Info">info</span></span
    >
</p>

<div class="featured" bind:this={photoContainer}>
    {#each featuredPhotos as item, index}
        <div class="featured-item">
            <img
                src={item.thumbnail}
                alt={item.alt}
                bind:this={bigImages[index]}
                data-id={index}
            />
            {#if item.exif}
                <div class="exif-info">
                    {#if displayExif}
                        <ul>
                            <li>
                                <span class="icon lens">lens</span>
                                {item.exif.Make}
                                {item.exif.Model}
                                <!-- {item?.exif?.LensMake} -->
                                {item?.exif?.LensModel}
                            </li>
                            <li>
                                <span class="icon exposure">exposure</span>
                                {item?.exif?.ExposureTime}
                            </li>

                            <li>
                                <span class="icon aperture">aperture</span>F {item
                                    ?.exif?.FNumber}
                            </li>
                            <li>
                                <span class="icon iso">ISO</span>
                                {item?.exif?.ISOSpeedRatings}
                            </li>
                            <li>
                                {item?.exif?.FocalLength} mm ( {item?.exif
                                    ?.FocalLengthIn35mmFilm} mm)
                            </li>
                        </ul>
                    {/if}
                </div>
            {/if}
        </div>
    {/each}
</div>

<div class="photo-gallery-container">
    <ul class="photo-gallery">
        {#each photos as item, index}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
                onclick={() => setActive(index)}
                class={index === activeIndex ? "active" : "normal"}
            >
                <img src={item.thumbnail} alt={item.alt} />
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
        overflow: auto;
        overflow-y: hidden;
        justify-content: center;
        list-style: none;
    }
    .photo-gallery li {
        flex: 0 1 100px;
        padding: 5px 0 5px 5px;
        background-color: #ffffff20;
    }
    .photo-gallery li:last-child {
        padding: 5px;
    }
    .photo-gallery-container {
        /* position: fixed; */
        bottom: 0;
        left: 0;
    }
    .exif-info {
        position: absolute;
        bottom: 25px;
        left: 0;
        width: 100%;
        color: #222;
        z-index: 33;
        text-align: center;
    }
    .exif-info ul {
        background-color: #c0c0c080;
        backdrop-filter: blur(3px);
        border-radius: 5px;
        padding: 0.25rem;
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
    .info {
        background-image: url("/assets/icons8-info-50.png");
        cursor: pointer;
        transform: scale(0.75);
        filter: contrast(1);
        background-color: #eeeeee80;
        border-radius: 50%;
        margin: 0;
    }

    :global(section) {
        /* padding: 1rem max(1rem, calc(30% - 780px / 2)); */
        padding: 1rem;
    }
    .featured {
        text-align: center;
        margin: 1rem 0;
        justify-content: center;
        position: relative;
        overflow-x: auto;
        overflow-y: hidden;
        scroll-snap-type: x mandatory;
        scrollbar-width: none;
        width: 100%;
    }

    .featured::-webkit-scrollbar {
        display: none;
    }
    .featured-item {
        display: inline-block;
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 0.5rem;
        vertical-align: middle;
        scroll-snap-align: start;
    }
    .featured-item img {
        object-fit: contain;
        width: 100%;
        height: 100%;
    }
    .active img {
        border: 5px solid #333;
        border-radius: 5px;
    }
    @media (min-width: 1024px) {
        .featured {
            white-space: nowrap;
            height: 70vh;
        }
    }
</style>
