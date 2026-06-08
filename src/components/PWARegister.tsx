/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

"use client";

import { useEffect } from "react";

export default function PWARegister() {
    useEffect(() => {
        if (process.env.NODE_ENV !== "production") return;
        if (!("serviceWorker" in navigator)) return;

        const registerServiceWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register("/sw", {
                    scope: "/",
                    updateViaCache: "none",
                });

                registration.update().catch(() => undefined);
            } catch {
                // The app remains fully usable when service worker registration is unavailable.
            }
        };

        if (document.readyState === "complete") {
            registerServiceWorker();
        } else {
            window.addEventListener("load", registerServiceWorker, { once: true });
        }

        return () => {
            window.removeEventListener("load", registerServiceWorker);
        };
    }, []);

    return null;
}
