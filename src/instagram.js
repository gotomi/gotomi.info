const path = require('path');
const home = require('os').homedir();
const Instagram = require('node-instagram').default;

// Create a new instance.

var config = require(path.join( home, '/inst.json'));

const instagram = new Instagram(config);


var getUserFeed = async function () {
    const feed = await instagram.get('users/self/media/recent');
    const media = feed.data.map(item => {
        var images = [];
        if (item.type === 'carousel') {
            item.carousel_media.forEach(item => {
                const image = item.images.standard_resolution;
                const file = image.url.split('/').pop();
                image.filename = file.slice(0, file.lastIndexOf('.'));
                images.push(item.images.standard_resolution)
            })
        } else if (item.type === 'image') {
            const image = item.images.standard_resolution;
            const file = image.url.split('/').pop();
            image.filename = file.slice(0, file.lastIndexOf('.'));
            images.push(item.images.standard_resolution);
        }

        return {
            text: item.caption.text,
            link: item.link,
            images: images,
            likes: item.likes.count
        }
    });
    return media
}

module.exports = getUserFeed