const fetch = require('node-fetch');
const instagramFeedUrl = 'https://www.instagram.com/gotomik/?__a=1';

const getUserFeed = async function() {
    const instagramPageUrl = 'https://www.instagram.com/p/';
    const result = await fetch(instagramFeedUrl);
    const json = await result.json();
    const timeline = json.graphql.user.edge_owner_to_timeline_media.edges;
    const images = timeline.map(item => {
    return {
        text: item.node.edge_media_to_caption.edges[0].node.text,
        url: item.node.thumbnail_src,
        id: item.node.id,
        href: instagramPageUrl + item.node.shortcode
    }
})

    return images
}

module.exports = getUserFeed