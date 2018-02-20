var offlineFundamentals = [
    '/',
    '/assets/'
];
self.addEventListener('install', function installer(event) {
    event.waitUntil(
        caches
        .open('v1::fundamentals')
        .then(function prefill(cache) {
            return cache.addAll(offlineFundamentals);
        })
    );
});