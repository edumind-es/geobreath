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
 * Patrones respiratorios personalizados.
 *
 * Dos modos, según lo acordado:
 *  - simple: manda la figura. Se eligen los lados y se ajusta la duración de
 *    CADA lado por separado; la fase de cada uno la sigue decidiendo
 *    `geoBreathSequence`, así que la metáfora geométrica se mantiene intacta.
 *  - avanzado: lista libre de pasos (fase + segundos). La figura se deriva:
 *    tantos lados como pasos. Permite 4-7-8, suspiro cíclico y demás ciclos
 *    asimétricos que no caben en un polígono regular de fases fijas.
 */

import { buildSchedule, geoBreathSequence, type Phase, type PhaseStep } from "@/lib/geoLogic";
import {
    MAX_PASOS,
    RETENCION_AVISO,
    SEGUNDOS_MAX,
    SEGUNDOS_MIN,
    type ModoEditor,
} from "@/lib/almacenLocal";

/** Acota a los límites del editor y a la rejilla de medio segundo. */
export function acotarSegundos(valor: number): number {
    if (!Number.isFinite(valor)) return SEGUNDOS_MIN;
    const acotado = Math.min(SEGUNDOS_MAX, Math.max(SEGUNDOS_MIN, valor));
    return Math.round(acotado * 2) / 2;
}

/**
 * Duración de cada lado de la figura. Si no hay tiempos propios, todos los
 * lados duran lo mismo (comportamiento de siempre).
 */
export function tiemposDeFigura(
    sides: number,
    tiemposPorLado: number[] | null,
    segundosUniformes: number,
): number[] {
    const pasos = geoBreathSequence(sides).length;
    return Array.from({ length: pasos }, (_, i) =>
        acotarSegundos(tiemposPorLado?.[i] ?? segundosUniformes),
    );
}

/** Pasos del ciclo en modo simple: fases de la figura + duración por lado. */
export function pasosDesdeFigura(
    sides: number,
    tiemposPorLado: number[] | null,
    segundosUniformes: number,
): PhaseStep[] {
    const fases = geoBreathSequence(sides);
    const tiempos = tiemposDeFigura(sides, tiemposPorLado, segundosUniformes);
    return fases.map((phase, i) => ({ phase, seconds: tiempos[i] }));
}

/**
 * Reajusta los tiempos por lado al cambiar de figura: conserva los que ya había
 * y rellena los lados nuevos con el ritmo uniforme. Cambiar de cuadrado a
 * hexágono no debe tirar por la borda lo que la persona había afinado.
 */
export function reajustarTiemposPorLado(
    tiemposPorLado: number[] | null,
    sides: number,
    segundosUniformes: number,
): number[] | null {
    if (tiemposPorLado === null) return null;
    return tiemposDeFigura(sides, tiemposPorLado, segundosUniformes);
}

/** Pasos por defecto al abrir el modo avanzado: los de la figura actual. */
export function pasosLibresIniciales(
    sides: number,
    tiemposPorLado: number[] | null,
    segundosUniformes: number,
): PhaseStep[] {
    return pasosDesdeFigura(sides, tiemposPorLado, segundosUniformes).slice(0, MAX_PASOS);
}

export interface EstadoPatron {
    modoEditor: ModoEditor;
    sides: number;
    seconds: number;
    tiemposPorLado: number[] | null;
    pasosLibres: PhaseStep[] | null;
}

/**
 * Ciclo que debe animar BreathingStage.
 *
 * Devuelve `undefined` cuando no hay personalización alguna: así la portada
 * sigue por el camino de siempre (figura + segundos uniformes) y no cambiamos
 * el comportamiento de quien no toca el editor.
 */
export function patronActivo(estado: EstadoPatron): PhaseStep[] | undefined {
    if (estado.modoEditor === "avanzado" && estado.pasosLibres && estado.pasosLibres.length >= 2) {
        return estado.pasosLibres;
    }
    if (estado.tiemposPorLado !== null) {
        return pasosDesdeFigura(estado.sides, estado.tiemposPorLado, estado.seconds);
    }
    return undefined;
}

/** Lados que debe dibujar la figura para un ciclo dado. */
export function ladosDelPatron(estado: EstadoPatron): number {
    if (estado.modoEditor === "avanzado" && estado.pasosLibres && estado.pasosLibres.length >= 2) {
        return estado.pasosLibres.length;
    }
    return estado.sides;
}

/** Duración total del ciclo, en segundos. */
export function duracionCiclo(pasos: PhaseStep[]): number {
    return buildSchedule(pasos).total;
}

/**
 * ¿Hay alguna retención larga? No bloqueamos —la personalización es absoluta—
 * pero sí lo advertimos: las guías de respiración coinciden en que en menores
 * las apneas deben ser suaves y sin hambre de aire.
 */
export function tieneRetencionLarga(pasos: PhaseStep[]): boolean {
    return pasos.some((paso) => paso.phase === "H" && paso.seconds > RETENCION_AVISO);
}

/** Añade un paso al final del ciclo libre, si cabe. */
export function anadirPaso(pasos: PhaseStep[], phase: Phase = "H", seconds = 4): PhaseStep[] {
    if (pasos.length >= MAX_PASOS) return pasos;
    return [...pasos, { phase, seconds: acotarSegundos(seconds) }];
}

/** Quita un paso. Nunca baja de dos: un ciclo necesita al menos inspirar y exhalar. */
export function quitarPaso(pasos: PhaseStep[], indice: number): PhaseStep[] {
    if (pasos.length <= 2) return pasos;
    if (indice < 0 || indice >= pasos.length) return pasos;
    return pasos.filter((_, i) => i !== indice);
}

/** Cambia la fase o la duración de un paso. */
export function editarPaso(pasos: PhaseStep[], indice: number, cambio: Partial<PhaseStep>): PhaseStep[] {
    if (indice < 0 || indice >= pasos.length) return pasos;
    return pasos.map((paso, i) =>
        i === indice
            ? {
                  phase: cambio.phase ?? paso.phase,
                  seconds: cambio.seconds === undefined ? paso.seconds : acotarSegundos(cambio.seconds),
              }
            : paso,
    );
}

/** Mueve un paso una posición arriba (-1) o abajo (+1). */
export function moverPaso(pasos: PhaseStep[], indice: number, direccion: -1 | 1): PhaseStep[] {
    const destino = indice + direccion;
    if (indice < 0 || indice >= pasos.length || destino < 0 || destino >= pasos.length) return pasos;
    const copia = [...pasos];
    [copia[indice], copia[destino]] = [copia[destino], copia[indice]];
    return copia;
}

/**
 * Patrones con respaldo en la literatura.
 *
 * No son «rutinas rápidas» (esas configuran los apoyos sensoriales): son ciclos
 * concretos, con sus tiempos, que sirven de punto de partida al editor. Cada
 * uno existe porque hay evidencia detrás, no por variedad:
 *
 *  - Resonancia ≈5,5 s por fase → ~5,5 resp/min, cerca de los 0,1 Hz del
 *    barorreflejo; es el hallazgo más sólido en variabilidad cardíaca.
 *  - Caja 4-4-4-4: cuatro tiempos iguales, el clásico de foco y autocontrol.
 *  - 4-7-8: exhalación alargada respecto a la inspiración.
 *  - Suspiro fisiológico: doble inspiración + exhalación larga (Balban et al.,
 *    Cell Reports Medicine, 2023).
 *
 * Ninguno lleva retenciones por encima del umbral de aviso, así que todos son
 * seguros de proponer en el aula tal cual.
 */
export interface PatronGuia {
    id: string;
    /** Clave de i18n del nombre y de la descripción. */
    nombreKey: "patternResonance" | "patternBox" | "pattern478" | "patternSigh";
    descKey: "patternResonanceDesc" | "patternBoxDesc" | "pattern478Desc" | "patternSighDesc";
    pasos: PhaseStep[];
}

export const PATRONES_GUIA: PatronGuia[] = [
    {
        id: "resonancia",
        nombreKey: "patternResonance",
        descKey: "patternResonanceDesc",
        pasos: [
            { phase: "I", seconds: 5.5 },
            { phase: "E", seconds: 5.5 },
        ],
    },
    {
        id: "caja",
        nombreKey: "patternBox",
        descKey: "patternBoxDesc",
        pasos: [
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 4 },
            { phase: "E", seconds: 4 },
            { phase: "H", seconds: 4 },
        ],
    },
    {
        id: "cuatro-siete-ocho",
        nombreKey: "pattern478",
        descKey: "pattern478Desc",
        pasos: [
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 7 },
            { phase: "E", seconds: 8 },
        ],
    },
    {
        id: "suspiro",
        nombreKey: "patternSigh",
        descKey: "patternSighDesc",
        pasos: [
            { phase: "I", seconds: 2 },
            { phase: "I", seconds: 1 },
            { phase: "E", seconds: 6 },
        ],
    },
];
