<script>
    export let projects = [];
</script>

<ul class="projects-gallery">
    {#each projects as item, index}
        <li class="chunk">
            <a href={item.svn_url}><h3 class="box-title">{item.name}</h3></a>
            <p>{item.description} - <a href={item.svn_url}>github</a></p>
            <a href="{item.thumbnail}"><img src="{item.thumbnail}" alt="{item.name}"></a>
         
        </li>
    {/each}
</ul>

<style>
    .projects-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
        grid-gap: 1rem;
    }

    .projects-gallery p {
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        min-height: 2em;
        overflow: hidden;
    }
</style>
