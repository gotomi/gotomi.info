const path = require('path');
const home = require('os').homedir();

var ig = require('instagram-scraping');


const getUserFeed = async function() {
    const result = await ig.scrapeUserPage('gotomik');
    const images = result.medias.map(item => {
        return {
            text: item.text,
            id: item.media_id,
            href: item.display_url,
            url: item.thumbnail
        }
    });
    return images
}

module.exports = getUserFeed