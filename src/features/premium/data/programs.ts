/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
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

export type ProgramAccess = "member" | "premium";

export interface SessionParams {
    n: number;
    secPerPhase: number;
    targetCycles: number;
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

export const premiumPrograms: PremiumProgram[] = [
    {
        slug: "deep-study",
        title: "Deep Study Reset",
        summary: "Secuencia para bajar ruido cognitivo y entrar en bloques de estudio sostenido.",
        duration: "8 min",
        cadence: "4-4-6-2",
        focus: "Concentracion y oposiciones",
        access: "member",
        accent: "from-teal-300/30 to-sky-400/20",
        sessionParams: { n: 4, secPerPhase: 4, targetCycles: 30 },
    },
    {
        slug: "sleep-descent",
        title: "Sleep Descent",
        summary: "Ritual nocturno con descenso progresivo de ritmo y apoyos vocales suaves.",
        duration: "12 min",
        cadence: "4-6-8",
        focus: "Sueno y recuperacion",
        access: "premium",
        accent: "from-indigo-300/25 to-cyan-300/15",
        sessionParams: { n: 3, secPerPhase: 6, targetCycles: 40 },
    },
    {
        slug: "classroom-reset",
        title: "Classroom Reset",
        summary: "Micro rutina para antes de clase o entre tareas, pensada para contexto educativo.",
        duration: "3 min",
        cadence: "3-3-3",
        focus: "Aula y regulacion",
        access: "member",
        accent: "from-emerald-300/25 to-teal-300/15",
        sessionParams: { n: 3, secPerPhase: 3, targetCycles: 20 },
    },
    {
        slug: "adhd-flow",
        title: "ADHD Flow Window",
        summary: "Secuencia visual intensa con cambios mas marcados para reenganchar atencion.",
        duration: "6 min",
        cadence: "2-2-4-2",
        focus: "Foco ejecutivo",
        access: "premium",
        accent: "from-amber-300/25 to-orange-300/15",
        sessionParams: { n: 4, secPerPhase: 2.5, targetCycles: 36 },
    },
    {
        slug: "public-speaking",
        title: "Pre-Speaking Calm",
        summary: "Prepara respiracion, hombros y tono parasimpatico antes de exponer.",
        duration: "5 min",
        cadence: "4-2-6",
        focus: "Presentaciones y speaking",
        access: "premium",
        accent: "from-rose-300/25 to-fuchsia-300/15",
        sessionParams: { n: 3, secPerPhase: 4, targetCycles: 25 },
    },
];

export const premiumPillars = [
    "Programas guiados por objetivo personal",
    "Historial y seguimiento de sesiones",
    "Perfil de practica personalizable",
    "Acceso exclusivo a contenido premium",
];
