importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.3.1/css/all.min.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
                            .then(cache => cache.addAll(APP_SHELL));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
                            .then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([
        cacheStatic,
        cacheInmutable
    ]));
});

self.addEventListener('activate', e => {

    const promise = caches.keys().then( keys => {
        keys.forEach( key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(promise);
});

self.addEventListener('fetch', e => {

    const response = caches.match(e.request)
                        .then(resp => {
                            if(resp) {
                                return resp;
                            }

                            return fetch(e.request)
                                    .then(newResp => {
                                        return updateDynamicCache(DYNAMIC_CACHE, e.request, newResp);
                                    })
                        });

    e.respondWith(response);
});