/* jshint esnext: true */
(function() {
    "use strict";
    var https = require('https');
    var fs = require('fs');
    var request = require('request');
    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;



    var flickrApiUrl = 'https://www.instagram.com/gotomik/?__a=1';

    function parseFeed(flickrFeed, limit) {
        var feed = flickrFeed;

        var feed0 = [];
        for (var node in feed) {

            feed0.push({
                title: '',
                media: {
                    small: feed[node].node.display_url
                },
                href: `https://www.instagram.com/p/${feed[node].node.shortcode}/`
            })
        }
        return feed0.slice(0, limit);


        // return feed.map(a => {

        //     return {
        //         title: a.caption,
        //         media: {
        //             small: a.thumbnail_src
        //         },
        //         href: `https://www.instagram.com/p/${a.code}/`
        //     };
        // }).slice(0, limit);
    }

    function render(feed) {
        console.log(feed);
        var flickrImgPath = '/assets/flickr-img/';
        var entries = feed.map(item => {
            var imgSmall = flickrImgPath + item.media.small.split('/').pop();
            return `<li><a href="${item.href}"><img src="${imgSmall.split('.jpg')[0]}"  alt="${item.title}"/></a></li>`;
        }).join('\n');
        return `<ul class="flickr-photos">${entries}</ul>`;
    }


    function download(feed) {
        var flickrImg = path.join(__dirname, '../dist/assets/', 'flickr-img');
        mkdirp(flickrImg);

        var downloadFile = function(uri, callback) {
            var filename = uri.split('/').pop();
            request.head(uri, function(err, res, body) {
                var f = path.join(flickrImg, filename);
                request(uri).pipe(fs.createWriteStream(f)).on('close', () => {
                    exec(`cwebp -q 70  ${f}  -o ${f.replace('jpg','webp')}`, (error, stdout, stderr) => {
                        if (error) {
                            console.error(`exec error: ${error}`);
                            return;
                        }
                    });
                });
            });
        };

        feed.forEach(item => {
            downloadFile(item.media.small, function() {
                console.log(item.media.small);
            });
        })


    }

    https.get(flickrApiUrl, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            /* jshint -W061 */
            var flickrFeed = JSON.parse(body).graphql.user.edge_owner_to_timeline_media.edges;
            console.log(flickrFeed.length, 'length');

            // var flickrFeed = JSON.parse(body).user.media.nodes;



            var entries = render(parseFeed(flickrFeed, 6));

            download(parseFeed(flickrFeed, 6));
            fs.writeFile(path.join(__dirname, 'parts/flickr.html'), entries, 'utf8', function() {
                console.log('OK')
            });
        });
    });
})();