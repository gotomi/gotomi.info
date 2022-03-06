<script>
    export let photos = [];
    let activeIndex = 0;

    function setActive(index) {
        activeIndex = index;
    }
</script>

<ul class="photo-gallery">
    {#each photos as item, index}
        <li
            class={activeIndex === index ? "featured" : ""}
            on:click={() => setActive(index)}
        >
            <img
                src={item.src}
                width="100"
                height="100"
                loading="lazy"
                alt=""
            />
        </li>
    {/each}
</ul>

<style>
    .photo-gallery img {
        width: 100%;
        height: auto;
        display: block;
        cursor: pointer;
    }

    .photo-gallery {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 1rem;
    }

    @media (max-width: 480px) {
        .photo-gallery {
            grid-template-columns: repeat(3, 1fr);
        }
        .photo-gallery li:last-child {
            display: none;
        }
    }
    .featured {
        grid-column: 1/3;
        grid-row: 1/3;
    }
</style>
