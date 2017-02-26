/* jshint esnext: true */
(function() {
    "use strict";
    var https = require('https');
    var fs = require('fs');
    var request = require('request');
    var path = require('path');
    var mkdirp = require('mkdirp');
    var exec = require('child_process').exec;



    var flickrApiUrl = 'https://www.instagram.com/gotomik/media/';

    function parseFeed(flickrFeed, limit) {
        var feed = flickrFeed.items;
    
        return feed.map(a => {
  
            return {
                title: a.caption.text,
                media: {
                    small: a.images.standard_resolution.url,
                    big: a.images.low_resolution.url
                },
                href: a.link
            };
        }).slice(0, limit);
    }

    function render(feed) {
        console.log(feed);
        var flickrImgPath = '/assets/flickr-img/';
        var entries = feed.map(item => {
            var imgSmall = flickrImgPath + item.media.small.split('/').pop();
            var imgBig = flickrImgPath + item.media.big.split('/').pop();
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
                // console.log(item.media.small);
            });
            downloadFile(item.media.big, function() {
                // console.log(item.media.big);
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
          
            var flickrFeed = JSON.parse(body);
        

            var entries = render(parseFeed(flickrFeed, 6));
            console.log(entries);
            download(parseFeed(flickrFeed, 6));
            fs.writeFile(path.join(__dirname, 'parts/flickr.html'), entries, 'utf8', function() {
                console.log('OK')
            });
        });
    });
})();