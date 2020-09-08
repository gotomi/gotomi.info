const fetch = require('node-fetch');
const {
    Headers
} = require('node-fetch');
const instagramFeedUrl = 'https://www.instagram.com/gotomik/?__a=1';

const getUserFeed = async function() {
    const instagramPageUrl = 'https://www.instagram.com/p/';

    let headers = new Headers({
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 10_0 like Mac OS X) AppleWebKit/602.1.38 (KHTML, like Gecko) Version/10.0 Mobile/14A5297c Safari/602.1"
    });

    const result = await fetch(instagramFeedUrl, {
        method: 'GET',
        headers: headers
    });
    const json = await result.json();
    const timeline = json.graphql.user.edge_owner_to_timeline_media.edges;

    let images = [];

    timeline.forEach(item => {
        if (item.node.__typename === "GraphImage") {
            const randomName = "a" + Math.floor(Math.random() * 100000000);
            images.push({
                text: item.node.edge_media_to_caption.edges[0].node.text,
                url: item.node.display_url,
                id: randomName,
                href: instagramPageUrl + item.node.shortcode
            })
        } else { //__typename": "GraphSidecar"

            item.node.edge_sidecar_to_children.edges.forEach(it => {
                const randomName = "a" + Math.floor(Math.random() * 100000000);
                images.push({
                    text: item.node.edge_media_to_caption.edges[0].node.text,
                    url: it.node.display_url,
                    id: randomName,
                    href: instagramPageUrl + item.node.shortcode
                })

            })

        }
    })

    return images
}

module.exports = getUserFeed