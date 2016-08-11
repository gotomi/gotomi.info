/* jshint esnext: true */
(function() {
    "use strict";
    var http = require('http');
    var fs = require('fs');
    var request = require('request');
    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;



    var flickrApiUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?id=23364033@N07&format=json&jsoncallback=%27%27';

    function parseFeed(flickrFeed, limit) {
        var feed = flickrFeed.items;
        return feed.map(a => {
            var photo = a.media.m.replace('http://', 'https://');
            photo = photo.substring(0, photo.length - 6);
            return {
                title: a.title,
                media: {
                    small: photo + '_q.jpg',
                    big: photo + '_b.jpg',
                },
                href: a.link.replace('http://', 'https://')
            };
        }).slice(0, limit);
    }

    function render(feed) {
        var flickrImgPath = '/assets/flickr-img/';
        var entries = feed.map(item => {
            var imgSmall = flickrImgPath + item.media.small.split('/').pop();
            var imgBig = flickrImgPath + item.media.big.split('/').pop();
            return `<li><a href="${item.href}" data-img="${imgBig}"><img src="${imgSmall}"  alt="${item.title}"/></a></li>`;
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
                    exec(`cwebp -q 70  ${f}  -o ${f}.webp`, (error, stdout, stderr) => {
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
                // console.log(item.media.small);
            });
            downloadFile(item.media.big, function() {
                // console.log(item.media.big);
            });
        })


    }

    http.get(flickrApiUrl, function(response) {
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            /* jshint -W061 */
            var flickrFeed = eval(body);
            var entries = render(parseFeed(flickrFeed, 6));
            download(parseFeed(flickrFeed, 6));
            fs.writeFile(path.join(__dirname, 'parts/flickr.html'), entries, 'utf8', function() {
                console.log('OK')
            });
        });
    });
})();