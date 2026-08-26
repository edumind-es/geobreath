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
 * Pruebas del núcleo de GeoBreath. Ejecutar con: npm test
 *
 * Se prueba la lógica real importada de la app —no reimplementaciones—, con
 * foco en lo que el editor de tiempos va a estresar: el reparto de segundos
 * entre fases y la secuencia de fases de cada figura.
 */

import { describe, it, expect } from "vitest";
import {
    breathsPerMinute,
    buildSchedule,
    easeBreath,
    geoBreathSequence,
    getPointAtLapFraction,
    getPolygonPoints,
    stepAtTime,
    type PhaseStep,
} from "@/lib/geoLogic";
import { formatTime } from "@/features/breathing/lib/breathing";

describe("geoBreathSequence — fases de cada figura", () => {
    it("da tantos pasos como lados tiene la figura", () => {
        for (const n of [2, 3, 4, 5, 6, 7, 8]) {
            expect(geoBreathSequence(n)).toHaveLength(n);
        }
    });

    it("el círculo es solo inspirar y exhalar", () => {
        expect(geoBreathSequence(2)).toEqual(["I", "E"]);
    });

    it("el cuadrado es la respiración en caja", () => {
        expect(geoBreathSequence(4)).toEqual(["I", "H", "E", "H"]);
    });

    it("la variante B mueve la retención al centro del triángulo", () => {
        expect(geoBreathSequence(3)).toEqual(["I", "E", "H"]);
        expect(geoBreathSequence(3, "H")).toEqual(["I", "H", "E"]);
    });

    it("reparte inspiración y exhalación en figuras de muchos lados", () => {
        expect(geoBreathSequence(6)).toEqual(["I", "I", "H", "E", "E", "H"]);
        expect(geoBreathSequence(7)).toEqual(["I", "I", "I", "H", "E", "E", "H"]);
        expect(geoBreathSequence(7, "E")).toEqual(["I", "I", "H", "E", "E", "E", "H"]);
    });

    it("siempre empieza inspirando", () => {
        for (const n of [2, 3, 4, 5, 6, 7, 8]) {
            expect(geoBreathSequence(n)[0]).toBe("I");
        }
    });

    it("cae al triángulo ante un número de lados inválido", () => {
        expect(geoBreathSequence(0)).toHaveLength(3);
        expect(geoBreathSequence(Number.NaN)).toHaveLength(3);
    });
});

describe("buildSchedule — reparto de segundos", () => {
    it("acumula los instantes de inicio de cada fase", () => {
        const pasos: PhaseStep[] = [
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 7 },
            { phase: "E", seconds: 8 },
        ];
        const horario = buildSchedule(pasos);
        expect(horario.starts).toEqual([0, 4, 11]);
        expect(horario.total).toBe(19);
    });

    it("trata como cero las duraciones negativas o inválidas", () => {
        const horario = buildSchedule([
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: -3 },
            { phase: "E", seconds: 4 },
        ]);
        expect(horario.total).toBe(8);
        expect(horario.starts).toEqual([0, 4, 4]);
    });

    it("aguanta un ciclo vacío", () => {
        expect(buildSchedule([]).total).toBe(0);
    });
});

describe("stepAtTime — fase activa en un instante", () => {
    const pasos: PhaseStep[] = [
        { phase: "I", seconds: 4 },
        { phase: "H", seconds: 7 },
        { phase: "E", seconds: 8 },
    ];
    const horario = buildSchedule(pasos);

    it("empieza en la primera fase", () => {
        expect(stepAtTime(horario, 0)).toEqual({ index: 0, phase: "I", local: 0 });
    });

    it("cambia de fase justo en el límite", () => {
        expect(stepAtTime(horario, 3.999).phase).toBe("I");
        expect(stepAtTime(horario, 4)).toEqual({ index: 1, phase: "H", local: 0 });
        expect(stepAtTime(horario, 11)).toEqual({ index: 2, phase: "E", local: 0 });
    });

    it("avanza el progreso local dentro de la fase", () => {
        expect(stepAtTime(horario, 2).local).toBeCloseTo(0.5);
        expect(stepAtTime(horario, 7.5).local).toBeCloseTo(0.5);
    });

    it("envuelve al completar la vuelta", () => {
        expect(stepAtTime(horario, 19)).toEqual({ index: 0, phase: "I", local: 0 });
        expect(stepAtTime(horario, 20).local).toBeCloseTo(0.25);
        // Varias vueltas acumuladas
        expect(stepAtTime(horario, 19 * 3 + 2).phase).toBe("I");
    });

    it("salta las fases de duración cero en vez de quedarse atascado", () => {
        const conCero = buildSchedule([
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 0 },
            { phase: "E", seconds: 4 },
        ]);
        expect(stepAtTime(conCero, 4).phase).toBe("E");
    });

    it("no se rompe con un ciclo sin duración", () => {
        expect(stepAtTime(buildSchedule([]), 5).local).toBe(0);
    });
});

describe("breathsPerMinute — ritmo del ciclo", () => {
    it("calcula la frecuencia de resonancia (5,5 s por fase ≈ 5,45 resp/min)", () => {
        expect(breathsPerMinute([
            { phase: "I", seconds: 5.5 },
            { phase: "E", seconds: 5.5 },
        ])).toBeCloseTo(5.4545, 3);
    });

    it("la caja de 4 s da 3,75 resp/min", () => {
        const caja: PhaseStep[] = geoBreathSequence(4).map((phase) => ({ phase, seconds: 4 }));
        expect(breathsPerMinute(caja)).toBeCloseTo(3.75);
    });

    it("es cero si el ciclo no dura nada", () => {
        expect(breathsPerMinute([])).toBe(0);
    });
});

describe("easeBreath — curva de cada fase", () => {
    it("conserva los extremos, para que los vértices sigan encajando", () => {
        for (const phase of ["I", "E", "H"] as const) {
            expect(easeBreath(phase, 0)).toBe(0);
            expect(easeBreath(phase, 1)).toBe(1);
        }
    });

    it("inspirar desacelera al final y exhalar acelera", () => {
        expect(easeBreath("I", 0.5)).toBeCloseTo(0.75);
        expect(easeBreath("E", 0.5)).toBeCloseTo(0.25);
        expect(easeBreath("H", 0.5)).toBeCloseTo(0.5);
    });

    it("acota valores fuera de rango", () => {
        expect(easeBreath("I", -1)).toBe(0);
        expect(easeBreath("E", 2)).toBe(1);
    });
});

describe("recorrido de la figura", () => {
    it("el polígono empieza arriba y gira en sentido horario", () => {
        const [arriba, derecha] = getPolygonPoints(4, 0, 0, 10);
        expect(arriba[0]).toBeCloseTo(0);
        expect(arriba[1]).toBeCloseTo(-10);
        expect(derecha[0]).toBeCloseTo(10);
        expect(derecha[1]).toBeCloseTo(0);
    });

    it("la fracción de vuelta cae sobre los vértices", () => {
        const enCuarto = getPointAtLapFraction(4, 0.25, 0, 0, 10);
        expect(enCuarto[0]).toBeCloseTo(10);
        expect(enCuarto[1]).toBeCloseTo(0);
    });

    it("la vuelta completa vuelve al punto de partida", () => {
        const inicio = getPointAtLapFraction(5, 0, 0, 0, 10);
        const fin = getPointAtLapFraction(5, 1, 0, 0, 10);
        expect(fin[0]).toBeCloseTo(inicio[0]);
        expect(fin[1]).toBeCloseTo(inicio[1]);
    });

    it("el círculo recorre la circunferencia", () => {
        const cuarto = getPointAtLapFraction(2, 0.25, 0, 0, 10);
        expect(cuarto[0]).toBeCloseTo(10);
        expect(cuarto[1]).toBeCloseTo(0);
    });
});

describe("formatTime", () => {
    it("formatea con dos dígitos", () => {
        expect(formatTime(0)).toBe("00:00");
        expect(formatTime(65)).toBe("01:05");
        expect(formatTime(600)).toBe("10:00");
    });
});
