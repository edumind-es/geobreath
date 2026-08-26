/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/**
 * Preferencias guardadas en el propio navegador.
 *
 * GeoBreath es local first: idioma, ritmo, apoyos y patrones propios viven en
 * el dispositivo de quien respira, no en el servidor. Nada de esto sale de aquí
 * ni requiere cuenta. El almacén de sesiones premium (`server/repos`) es otra
 * cosa distinta y solo entra en juego con SSO.
 *
 * Todo lo que se lee se valida: la persona puede editar localStorage a mano, y
 * una versión anterior de la app pudo dejar datos con otra forma.
 */

import type { Phase, PhaseStep } from "./geoLogic";
import type { Language } from "./i18n";

export const CLAVE_PREFERENCIAS = "geobreath:preferencias:v1";

export type ModoEditor = "simple" | "avanzado";

export interface PatronGuardado {
    id: string;
    nombre: string;
    pasos: PhaseStep[];
}

export interface PreferenciasGeoBreath {
    lang: Language;
    sides: number;
    seconds: number;
    sound: boolean;
    vibe: boolean;
    tts: boolean;
    showPictos: boolean;
    modoEditor: ModoEditor;
    /** Duración de cada lado en modo simple. null = ritmo uniforme. */
    tiemposPorLado: number[] | null;
    /** Ciclo libre en modo avanzado. null = usar la figura. */
    pasosLibres: PhaseStep[] | null;
    patronesGuardados: PatronGuardado[];
    /** Modo aula: rondas objetivo. null = sesión abierta, sin tope. */
    objetivoRondas: number | null;
}

const IDIOMAS: readonly string[] = ["es", "gl", "cat", "eu", "en", "zh"];
const FASES: readonly string[] = ["I", "E", "H"];

/** Límites del editor. Compartidos por la interfaz y por la validación. */
export const SEGUNDOS_MIN = 1;
export const SEGUNDOS_MAX = 20;
/** A partir de aquí, la retención merece un aviso (no un bloqueo). */
export const RETENCION_AVISO = 10;
export const MAX_PASOS = 12;
export const MAX_PATRONES = 24;
/** Rondas objetivo del modo aula. */
export const RONDAS_MIN = 1;
export const RONDAS_MAX = 99;

function esObjeto(valor: unknown): valor is Record<string, unknown> {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

function booleano(valor: unknown): boolean | undefined {
    return typeof valor === "boolean" ? valor : undefined;
}

function segundosValidos(valor: unknown): number | undefined {
    if (typeof valor !== "number" || !Number.isFinite(valor)) return undefined;
    if (valor < SEGUNDOS_MIN || valor > SEGUNDOS_MAX) return undefined;
    // Rejilla de medio segundo, como el editor.
    return Math.round(valor * 2) / 2;
}

function pasosValidos(valor: unknown): PhaseStep[] | undefined {
    if (!Array.isArray(valor) || valor.length < 2 || valor.length > MAX_PASOS) return undefined;
    const pasos: PhaseStep[] = [];
    for (const crudo of valor) {
        if (!esObjeto(crudo)) return undefined;
        const fase = crudo.phase;
        const segundos = segundosValidos(crudo.seconds);
        if (typeof fase !== "string" || !FASES.includes(fase) || segundos === undefined) return undefined;
        pasos.push({ phase: fase as Phase, seconds: segundos });
    }
    return pasos;
}

/**
 * Lee las preferencias guardadas. Devuelve solo los campos que ha podido
 * validar, para que quien llama complete el resto con sus valores por defecto.
 */
export function leerPreferencias(): Partial<PreferenciasGeoBreath> {
    if (typeof window === "undefined") return {};

    let crudo: unknown;
    try {
        const texto = window.localStorage.getItem(CLAVE_PREFERENCIAS);
        if (!texto) return {};
        crudo = JSON.parse(texto);
    } catch {
        // Modo privado, almacenamiento bloqueado o JSON corrupto: se ignora.
        return {};
    }
    if (!esObjeto(crudo)) return {};

    const prefs: Partial<PreferenciasGeoBreath> = {};

    if (typeof crudo.lang === "string" && IDIOMAS.includes(crudo.lang)) prefs.lang = crudo.lang as Language;

    if (typeof crudo.sides === "number" && Number.isFinite(crudo.sides) && crudo.sides >= 2 && crudo.sides <= 8) {
        prefs.sides = Math.round(crudo.sides);
    }

    const seconds = segundosValidos(crudo.seconds);
    if (seconds !== undefined) prefs.seconds = seconds;

    const sound = booleano(crudo.sound);
    if (sound !== undefined) prefs.sound = sound;
    const vibe = booleano(crudo.vibe);
    if (vibe !== undefined) prefs.vibe = vibe;
    const tts = booleano(crudo.tts);
    if (tts !== undefined) prefs.tts = tts;
    const showPictos = booleano(crudo.showPictos);
    if (showPictos !== undefined) prefs.showPictos = showPictos;

    if (crudo.modoEditor === "simple" || crudo.modoEditor === "avanzado") prefs.modoEditor = crudo.modoEditor;

    if (Array.isArray(crudo.tiemposPorLado)) {
        const tiempos = crudo.tiemposPorLado.map(segundosValidos);
        if (tiempos.length >= 2 && tiempos.every((valor): valor is number => valor !== undefined)) {
            prefs.tiemposPorLado = tiempos;
        }
    } else if (crudo.tiemposPorLado === null) {
        prefs.tiemposPorLado = null;
    }

    if (crudo.pasosLibres === null) {
        prefs.pasosLibres = null;
    } else {
        const pasos = pasosValidos(crudo.pasosLibres);
        if (pasos) prefs.pasosLibres = pasos;
    }

    if (Array.isArray(crudo.patronesGuardados)) {
        const patrones: PatronGuardado[] = [];
        for (const entrada of crudo.patronesGuardados.slice(0, MAX_PATRONES)) {
            if (!esObjeto(entrada)) continue;
            const pasos = pasosValidos(entrada.pasos);
            if (!pasos) continue;
            if (typeof entrada.id !== "string" || typeof entrada.nombre !== "string") continue;
            patrones.push({ id: entrada.id, nombre: entrada.nombre.slice(0, 60), pasos });
        }
        prefs.patronesGuardados = patrones;
    }

    if (crudo.objetivoRondas === null) {
        prefs.objetivoRondas = null;
    } else if (
        typeof crudo.objetivoRondas === "number" &&
        Number.isFinite(crudo.objetivoRondas) &&
        crudo.objetivoRondas >= RONDAS_MIN &&
        crudo.objetivoRondas <= RONDAS_MAX
    ) {
        prefs.objetivoRondas = Math.round(crudo.objetivoRondas);
    }

    return prefs;
}

/** Guarda las preferencias. Si el navegador no deja, la app sigue funcionando. */
export function guardarPreferencias(prefs: PreferenciasGeoBreath): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify(prefs));
    } catch {
        // Cuota agotada o almacenamiento bloqueado: no es motivo para romper nada.
    }
}

/** Borra todo rastro local. Es el botón de «olvídame» del panel de privacidad. */
export function borrarPreferencias(): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.removeItem(CLAVE_PREFERENCIAS);
    } catch {
        // Nada que hacer.
    }
}
