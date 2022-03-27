import fetch from 'node-fetch';
import axios from 'axios';
import fs from 'fs-extra';
import Path from 'path';
import sharp from 'sharp';



const instagramFeedUrl = 'https://www.instagram.com/gotomik/?__a=1';


const getUserFeed = async function () {
    const instagramPageUrl = 'https://www.instagram.com/p/';

    const result = await fetch(instagramFeedUrl, {
        method: 'GET'
    });
    const json = await result.json();
    const timeline = json.graphql.user.edge_owner_to_timeline_media.edges;

    let images = [];

    timeline.forEach(item => {
        if (item.node.__typename === "GraphImage") {
            images.push({
                text: item.node.edge_media_to_caption.edges[0].node.text,
                url: item.node.display_url,
                id: item.node.display_url.split('.jpg')[0].split('/').pop(),
                href: instagramPageUrl + item.node.shortcode
            })
        } else { //__typename": "GraphSidecar"

            item.node.edge_sidecar_to_children.edges.forEach(it => {
                const randomName = "a" + Math.floor(Math.random() * 100000000);
                images.push({
                    text: item.node.edge_media_to_caption.edges[0].node.text,
                    url: it.node.display_url,
                    id: it.node.display_url.split('.jpg')[0].split('/').pop(),
                    href: instagramPageUrl + item.node.shortcode
                })

            })

        }
    })

    return images
}






const downloadImage = async (image, dest) => {

    const path = Path.join(dest, image.id);
    const response = await axios({
        method: 'get',
        url: image.url,
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

    // sharp(path + '.jpg')
    //     .resize(400)
    //     .jpeg()
    //     .toFile(`${path}-400.jpg`, (err, info) => {
    //         //   console.log(info, err);
    //     });

    // sharp(path + '.jpg')
    //     .resize(20)
    //     .blur(1)
    //     .jpeg({
    //         quality: 10
    //     })
    //     .toFile(`${path}-small.jpg`, (err, info) => {
    //         //   console.log(info, err);
    //     });

    sharp(path + '.jpg')
        .resize(400)
        .webp()
        .toFile(`${path}.webp`, (err, info) => {
            console.log(info, err);
        })
}


getUserFeed().then(images => {
    fs.writeFile('./src/_data/photos.json', JSON.stringify(images), 'utf8', (err) => { console.log(err) });
    images.forEach(image => {
        downloadImage(image, './public/photos').then(() => {
            convertImages(image.id, './public/photos')
        })
    })
})
