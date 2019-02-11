const axios = require("axios");
const fs = require("fs-extra");
const path = require('path');
const sharp = require('sharp');



const downloadImage = async (url, filename, dest) => {
    const placeToWrite = path.join(dest, filename);


    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    await response.data.pipe(fs.createWriteStream(placeToWrite + '.jpg'))




    const convertImages = function () {

        const filename = placeToWrite;

        sharp(placeToWrite + '.jpg')
            .resize(200)
            .jpeg()
            .toFile(`${filename}-200.jpg`, (err, info) => {
                //   console.log(info, err);
            });


        sharp(placeToWrite + '.jpg')
            .resize(20)
            .blur(1)
            .jpeg({
                quality: 10
            })
            .toFile(`${filename}-small.jpg`, (err, info) => {
                //   console.log(info, err);
            });





        sharp(placeToWrite + '.jpg')
            .webp()
            .toFile(`${filename}.webp`, (err, info) => {
                //  console.log(info, err);
            })
    }




    setTimeout(convertImages, 500);

}

module.exports = downloadImage