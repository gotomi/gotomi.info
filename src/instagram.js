const path = require('path');
const home = require('os').homedir();
const Instagram = require('node-instagram').default;

// Create a new instance.

var config = require(path.join( home, '/inst.json'));

const instagram = new Instagram(config);


var normalizeImageObject = function(item){
    const image = item.images.standard_resolution;
    image.url = image.url.split('?')[0];
    const file = image.url.split('/').pop();
    image.filename = file.slice(0, file.lastIndexOf('.'));
    return image;
}


var getUserFeed = async function () {
    const feed = await instagram.get('users/self/media/recent');
    let images;
    const media = feed.data.map(item => {
        let images = [];
        if (item.type === 'carousel') {
            item.carousel_media.forEach(item => {
                images.push(normalizeImageObject(item));
            })
        } else if (item.type === 'image') {
            images.push(normalizeImageObject(item));
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