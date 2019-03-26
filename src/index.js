const axios = require("axios");
const fs = require("fs-extra");
const pug = require('pug');
const path = require('path');





const getUserFeed = require('./instagram');
const image = require('./download-image')


const DEST = path.join(__dirname, '../dist');
const SRC = path.join(__dirname, '../src');


fs.ensureDir(DEST);

(async function () {
    const dest = path.join(DEST, '/images');
    fs.ensureDir(dest);

    let feed = await getUserFeed();
    let media = feed.slice(0, 5);
    media.forEach(item => {
        image.downloadImage(item.url, item.id, dest).then(
            function(){
                image.convertImages(item.id, dest);
            }
        )
    })
    createMarkup(media);
})()

const createMarkup = function (photoFeed) {
    const pageData = pug.renderFile(path.join(SRC, './template.pug'), {
        feed: photoFeed
    });
    const dest = path.join(DEST, 'index.html');
    fs.writeFile(dest, pageData, function (err) {
        console.log(err);
    })

    fs.copy(path.join(SRC, './assets'), path.join(DEST, '/assets'));
    fs.copyFile(path.join(SRC, './_headers'), path.join(DEST, '/_headers'));
}
