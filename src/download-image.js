const axios = require("axios");
const fs = require("fs-extra");
const Path = require('path');
const sharp = require('sharp');



const downloadImage = async (url, filename, dest) => {
    const path = Path.join(dest, filename);
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    const writer = fs.createWriteStream(path + '.jpg');
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve)
        writer.on('error', reject)
    })
}

const convertImages = function (filename, dest) {
    const path = Path.join(dest, filename);

    sharp(path + '.jpg')
        .resize(200)
        .jpeg()
        .toFile(`${path}-200.jpg`, (err, info) => {
            //   console.log(info, err);
        });

    sharp(path + '.jpg')
        .resize(20)
        .blur(1)
        .jpeg({
            quality: 10
        })
        .toFile(`${path}-small.jpg`, (err, info) => {
            //   console.log(info, err);
        });

    sharp(path + '.jpg')
        .webp()
        .toFile(`${path}.webp`, (err, info) => {
            //  console.log(info, err);
        })
}
module.exports = { downloadImage, convertImages };