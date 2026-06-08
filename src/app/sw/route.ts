/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

const serviceWorkerSource = `
const CACHE_VERSION = "geobreath-v2.0.2";
const APP_SHELL_CACHE = \`\${CACHE_VERSION}-shell\`;
const RUNTIME_CACHE = \`\${CACHE_VERSION}-runtime\`;

const APP_SHELL = [
    "/",
    "/manifest.json",
    "/logo_geobreath.png",
    "/icons/icon-192.png",
    "/icons/icon-512.png",
    "/icons/icon-maskable-512.png",
    "/img/inspiro.png",
    "/img/exhalo.png",
    "/img/aguanta.png",
];

const isCacheableRequest = (request) => {
    const url = new URL(request.url);

    if (request.method !== "GET") return false;
    if (url.origin !== self.location.origin) return false;
    if (url.pathname.startsWith("/api/")) return false;
    if (url.pathname.startsWith("/app/")) return false;
    if (url.pathname.startsWith("/sign-in")) return false;
    if (url.pathname === "/sw" || url.pathname === "/sw.js") return false;

    return true;
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(APP_SHELL_CACHE)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting()),
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(
                    keys
                        .filter((key) => key.startsWith("geobreath-") && !key.startsWith(CACHE_VERSION))
                        .map((key) => caches.delete(key)),
                ),
            )
            .then(() => self.clients.claim()),
    );
});

self.addEventListener("fetch", (event) => {
    const { request } = event;

    if (!isCacheableRequest(request)) return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(APP_SHELL_CACHE).then((cache) => cache.put("/", responseClone));
                    return response;
                })
                .catch(() => caches.match(request).then((cached) => cached || caches.match("/"))),
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            const fetchPromise = fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => cached);

            return cached || fetchPromise;
        }),
    );
});
`;

export function GET() {
    return new Response(serviceWorkerSource.trimStart(), {
        headers: {
            "Content-Type": "application/javascript; charset=utf-8",
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Service-Worker-Allowed": "/",
        },
    });
}
