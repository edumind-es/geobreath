/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type { PhaseStep } from "@/lib/geoLogic";

export type ProgramAccess = "member" | "premium";

export interface SessionParams {
    n: number;
    secPerPhase: number;
    targetCycles: number;
    // Patrón con tiempos reales por fase (evidencia científica). Si está,
    // manda sobre n/secPerPhase. n debe coincidir con pattern.length.
    pattern?: PhaseStep[];
}

export interface PremiumProgram {
    slug: string;
    title: string;
    summary: string;
    duration: string;
    cadence: string;
    focus: string;
    access: ProgramAccess;
    accent: string;
    sessionParams: SessionParams;
}

// Biblioteca de programas basados en evidencia (tiempos reales por fase).
// Se reutilizan 5 slugs previos para no huérfanar favoritos/historial + 2 nuevos.
export const premiumPrograms: PremiumProgram[] = [
    {
        slug: "coherencia-cardiaca",
        title: "Coherencia cardíaca",
        summary: "Respiración a seis por minuto (5 s dentro, 5 s fuera) para equilibrar el sistema nervioso y elevar la variabilidad cardíaca.",
        duration: "5 min",
        cadence: "5-5 · 6/min",
        focus: "Regulación vagal · HRV",
        access: "member",
        accent: "from-teal-300/30 to-sky-400/20",
        sessionParams: {
            n: 2,
            secPerPhase: 5,
            targetCycles: 30,
            pattern: [
                { phase: "I", seconds: 5 },
                { phase: "E", seconds: 5 },
            ],
        },
    },
    {
        slug: "adhd-flow",
        title: "Vuelta a la calma",
        summary: "Exhalación alargada (4 s dentro, 6 s fuera) para activar el freno vagal tras el esfuerzo o la tensión.",
        duration: "4 min",
        cadence: "4-6 · exhalación larga",
        focus: "Regreso a la calma",
        access: "member",
        accent: "from-emerald-300/25 to-teal-300/15",
        sessionParams: {
            n: 2,
            secPerPhase: 5,
            targetCycles: 24,
            pattern: [
                { phase: "I", seconds: 4 },
                { phase: "E", seconds: 6 },
            ],
        },
    },
    {
        slug: "public-speaking",
        title: "Ancla anti-ansiedad",
        summary: "Suspiro fisiológico: doble inhalación seguida de una exhalación larga para bajar la activación en pocos minutos.",
        duration: "5 min",
        cadence: "suspiro fisiológico",
        focus: "Ansiedad y exposición",
        access: "member",
        accent: "from-rose-300/25 to-fuchsia-300/15",
        sessionParams: {
            n: 3,
            secPerPhase: 3,
            targetCycles: 32,
            pattern: [
                { phase: "I", seconds: 1.6 },
                { phase: "I", seconds: 1 },
                { phase: "E", seconds: 6 },
            ],
        },
    },
    {
        slug: "soltar-enfado",
        title: "Suelta el enfado",
        summary: "Exhalaciones muy largas (4 s dentro, 8 s fuera) para descargar la tensión del enfado y recuperar el control.",
        duration: "3 min",
        cadence: "4-8 · descarga",
        focus: "Regulación de la ira",
        access: "member",
        accent: "from-amber-300/25 to-orange-300/15",
        sessionParams: {
            n: 2,
            secPerPhase: 6,
            targetCycles: 15,
            pattern: [
                { phase: "I", seconds: 4 },
                { phase: "E", seconds: 8 },
            ],
        },
    },
    {
        slug: "deep-study",
        title: "Caja de foco",
        summary: "Respiración en caja 4-4-4-4 (inspira, retén, exhala, retén) para serenar la mente y sostener la concentración.",
        duration: "5 min",
        cadence: "4-4-4-4",
        focus: "Concentración y estudio",
        access: "premium",
        accent: "from-sky-300/25 to-indigo-300/15",
        sessionParams: {
            n: 4,
            secPerPhase: 4,
            targetCycles: 18,
            pattern: [
                { phase: "I", seconds: 4 },
                { phase: "H", seconds: 4 },
                { phase: "E", seconds: 4 },
                { phase: "H", seconds: 4 },
            ],
        },
    },
    {
        slug: "sleep-descent",
        title: "Calma profunda 4-7-8",
        summary: "Inspira 4, retén 7 y exhala 8: relajación profunda para conciliar el sueño o soltar el día.",
        duration: "4 min",
        cadence: "4-7-8",
        focus: "Sueño y relajación",
        access: "premium",
        accent: "from-indigo-300/25 to-cyan-300/15",
        sessionParams: {
            n: 3,
            secPerPhase: 6,
            targetCycles: 12,
            pattern: [
                { phase: "I", seconds: 4 },
                { phase: "H", seconds: 7 },
                { phase: "E", seconds: 8 },
            ],
        },
    },
    {
        slug: "classroom-reset",
        title: "Pausa activa de aula",
        summary: "Reinicio breve de dos a tres minutos con seis parejas de respiraciones lentas, ideal antes de una tarea o entre clases.",
        duration: "3 min",
        cadence: "5-5 · aula",
        focus: "Aula y regulación",
        access: "member",
        accent: "from-emerald-300/25 to-teal-300/15",
        sessionParams: {
            n: 2,
            secPerPhase: 5,
            targetCycles: 15,
            pattern: [
                { phase: "I", seconds: 5 },
                { phase: "E", seconds: 5 },
            ],
        },
    },
];

export const premiumPillars = [
    "Programas guiados por objetivo personal",
    "Historial y seguimiento de sesiones",
    "Perfil de práctica personalizable",
    "Acceso exclusivo a contenido premium",
];
