/* jshint esnext: true */
(function(){
  "use strict";
var http = require('http');
var flickrApiUrl = 'http://api.flickr.com/services/feeds/photos_public.gne?id=23364033@N07&format=json&jsoncallback=%27%27';

function parseFeed(flickrFeed, limit) {
    var feed = flickrFeed.items;
    return feed.map(a => {
        var photo = a.media.m.replace('http', 'https');
            photo = photo.substring(0, photo.length - 6);
        return {
            title: a.title,
            media: {
                small: photo + '_q.jpg',
                big: photo + '_b.jpg',
            },
            href: a.link.replace('http', 'https')
        };
    }).slice(0, limit);
}

function render(feed) {
    var entries = feed.map(item => {
        return `<li><a href="${item.href}" data-img="${item.media.big}"><img src="${item.media.small}"  alt="${item.title}"/></a></li>`;
    }).join('\n');
    return `<ul class="flickr-photos">${entries}</ul>`;
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
        process.stdout.write(entries);
    });
});
})();
