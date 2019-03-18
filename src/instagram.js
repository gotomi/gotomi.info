const path = require('path');
const home = require('os').homedir();
const Instagram = require('node-instagram').default;

// Create a new instance.

const getConfig = function () {
    try {
        return require(path.join(home, '/inst.json'));
    } catch (e) {
        return {
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            accessToken: process.env.ACCESS_TOKEN
        }
    }
}

const config = getConfig();
const instagram = new Instagram(config);

var getUserFeed = async function () {
    const feed = await instagram.get('users/self/media/recent');
    let images = [];
    feed.data.forEach(item => {

        if (item.type === 'carousel') {
            item.carousel_media.forEach((image, index) => {
                images.push({
                    text: item.caption.text,
                    id: item.id + '-' + index,
                    href: item.link,
                    url: image.images.standard_resolution.url
                })
            })
        } else if (item.type === 'image') {

            images.push({
                text: item.caption.text,
                id: item.id,
                href: item.link,
                url: item.images.standard_resolution.url
            })
        }


    });

    return images;
}

module.exports = getUserFeed