"use strict";

var http = require('http');
var parser = require('xml2json');
var flickrApiUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?id=23364033@N07&format=xml&jsoncallback=f';

function parseFeed(body, limit = 100) {
    var feed = JSON.parse(parser.toJson(body)).feed.entry;
    return feed.map(a => {
        var photo = a.link[1].href;
        return {
            title: a.title,
            media: {
                small: photo.substring(0, photo.length - 6) + '_q.jpg',
                big: photo
            },
            href: a.link[0].href
        }
    }).slice(0, limit);
}

function render(feed) {
    var entries = feed.map(item => {
        return `<li><a href="${item.href}" data-img="${item.media.big}"><img src="${item.media.small}"  alt="${item.title}"/></a></li>`
    }).join('\n');
    return `<ul class="flickr-photos">${entries}</ul>`;
};

http.get(flickrApiUrl, function(response) {
    var body = '';
    response.on('data', function(d) {
        body += d;
    });
    response.on('end', function() {
             var entries = render(parseFeed(body, 6));
        process.stdout.write(entries);
    });
});
