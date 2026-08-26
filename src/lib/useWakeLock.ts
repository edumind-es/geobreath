/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

"use client";

import { useEffect, useRef } from "react";

/**
 * Mantiene la pantalla encendida mientras dura la respiración.
 *
 * Sin esto, el móvil se apaga a los 30 s y la sesión se corta sola; en el aula,
 * la proyección se queda a oscuras a mitad de ejercicio.
 *
 * La API no está en todos los navegadores (Firefox no la trae) y el sistema
 * puede denegarla —batería baja, sin gesto previo del usuario—. En ese caso no
 * se hace nada: es una mejora, no un requisito.
 */
export function useWakeLock(activo: boolean) {
    const testigoRef = useRef<WakeLockSentinel | null>(null);

    useEffect(() => {
        if (!activo) return;
        if (typeof navigator === "undefined" || !("wakeLock" in navigator)) return;

        let cancelado = false;

        const pedir = async () => {
            try {
                const testigo = await navigator.wakeLock.request("screen");
                if (cancelado) {
                    void testigo.release().catch(() => {});
                    return;
                }
                // El sistema puede soltarlo por su cuenta (cambio de app, batería).
                testigo.addEventListener("release", () => {
                    if (testigoRef.current === testigo) testigoRef.current = null;
                });
                testigoRef.current = testigo;
            } catch {
                // Denegado o no disponible: seguimos sin bloqueo de pantalla.
            }
        };

        // Al volver de segundo plano el testigo ya no vale: hay que pedirlo otra vez.
        const alCambiarVisibilidad = () => {
            if (document.visibilityState === "visible" && !testigoRef.current) void pedir();
        };

        void pedir();
        document.addEventListener("visibilitychange", alCambiarVisibilidad);

        return () => {
            cancelado = true;
            document.removeEventListener("visibilitychange", alCambiarVisibilidad);
            const testigo = testigoRef.current;
            testigoRef.current = null;
            if (testigo) void testigo.release().catch(() => {});
        };
    }, [activo]);
}
