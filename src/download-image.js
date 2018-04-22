const axios = require("axios");
const fs = require("fs-extra");
const path = require('path');
const sharp = require('sharp');



const downloadImage = async (url, dest) => {
    const filename = url.split('/').pop();
    const placeToWrite = path.join(dest, filename);
    const response = await axios({
        method: 'get',
        url: url,
        responseType: 'stream'
    });
    await response.data.pipe(fs.createWriteStream(placeToWrite))





    const convertImages = function(){
        const filename = placeToWrite.slice(0,placeToWrite.lastIndexOf('.'));

        sharp(placeToWrite)
        .resize(200)
        .jpeg()
        .toFile(`${filename}-200.jpg`, (err, info) => {
         //   console.log(info, err);
        });


        sharp(placeToWrite)
        .resize(20)
        .blur(1)
        .jpeg({
            quality: 10
        })
        .toFile(`${filename}-small.jpg`, (err, info) => {
         //   console.log(info, err);
        } );





        sharp(placeToWrite)
        .webp()
        .toFile(`${filename}.webp`, (err, info) => {
          //  console.log(info, err);
        } )
    }




    setTimeout(convertImages, 500);

}

module.exports = downloadImage