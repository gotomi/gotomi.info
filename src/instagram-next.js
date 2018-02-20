const axios = require("axios");
const fs = require("fs");

const path = require('path');
const mkdirp = require('mkdirp');

const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');

const downloadImage = async(url, dest) => {
    const filename = url.split('/').pop();
    const placeToWrite = path.join(dest, filename);
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    await response.data.pipe(fs.createWriteStream(placeToWrite));
}






const url = "https://www.instagram.com/gotomik/?__a=1";


const parseFeed = function(feed, limit = 6) {
    return feed.user.media.nodes.map(item => {
        return {
            title: item.caption,
            media: {
                small: item.thumbnail_src
            },
            href: `https://www.instagram.com/p/${item.code}/`
        };
    }).slice(0, limit);
}






const getPhotoFeed = async url => {
    try {
        const response = await axios.get(url);
        const data = response.data;
        const feed = await parseFeed(data, 12);

        const dest = path.join(__dirname, '..', 'instagram-images');
        mkdirp(dest);


        fs.writeFile(path.join(dest, 'feed.json'), JSON.stringify(feed), (e) => {
            console.log(e);
        });

        await feed.forEach(item => {
            downloadImage(item.media.small, dest);
        });


        imagemin([`${dest}/*.{jpg,png}`], dest, {
            use: [
                imageminWebp({ quality: 70 })
            ]
        }).then(() => {
            console.log('Images optimized');
        });


        console.log(feed.length);
    } catch (error) {
        console.log(error);
    }
};

getPhotoFeed(url);