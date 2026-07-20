/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import type { AppTranslations, Language } from "@/lib/i18n";
import type { Phase } from "@/lib/geoLogic";

// Formas disponibles (nº de lados; 2 = círculo)
export const SHAPE_VALUES = [2, 3, 4, 5, 6] as const;
export type ShapeValue = (typeof SHAPE_VALUES)[number];

// Idiomas soportados por la interfaz
export const LANGUAGE_OPTIONS: Language[] = ["es", "gl", "cat", "eu", "en", "zh"];

export function formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
}

export function phaseLabel(phase: Phase, t: AppTranslations): string {
    if (phase === "I") return t.inspire;
    if (phase === "E") return t.exhale;
    return t.hold;
}

export function shapeLabel(sides: number, t: AppTranslations): string {
    if (sides === 2) return t.shape2;
    if (sides === 3) return t.shape3;
    if (sides === 4) return t.shape4;
    if (sides === 5) return t.shape5;
    return t.shape6;
}

// Mundo EDUmind asociado a cada preset (para el acento de color)
export type WorldAccent = "fisico" | "social" | "emocional" | "mental" | "interior";
