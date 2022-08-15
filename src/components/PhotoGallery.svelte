<script>
    export let photos = [];
</script>

<ul class="photo-gallery">
    {#each photos as item, index}
        <li>
        {#if item.uri.endsWith(".jpg") || item.uri.endsWith(".webp")}
     
            <img
                src={`${item.uri}`}
                width="400"
                height="400"
                alt={item.title}
                title={item.title}
            />
            {:else}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
                src={`${item.uri}`}
                width="400"
                height="400"
                alt={item.title}
                loop
                autoplay
            />
            {/if}
        </li>
    {/each}
</ul>

<style>

    .photo-gallery img,
    .photo-gallery video {
        width: 100%;
        height: auto;
        display: block;
        cursor: pointer;
        aspect-ratio: 1;
        object-fit: contain;
    }

    .photo-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px,1fr));
        grid-gap: 5px;
    }
</style>
