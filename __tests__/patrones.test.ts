/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

/** Pruebas del editor de tiempos respiratorios (modos simple y avanzado). */

import { describe, it, expect } from "vitest";
import type { PhaseStep } from "@/lib/geoLogic";
import {
    acotarSegundos,
    anadirPaso,
    duracionCiclo,
    editarPaso,
    ladosDelPatron,
    moverPaso,
    pasosDesdeFigura,
    patronActivo,
    quitarPaso,
    reajustarTiemposPorLado,
    tieneRetencionLarga,
    tiemposDeFigura,
    PATRONES_GUIA,
} from "@/features/breathing/lib/patrones";
import { MAX_PASOS } from "@/lib/almacenLocal";

describe("acotarSegundos", () => {
    it("respeta los límites del editor", () => {
        expect(acotarSegundos(0.2)).toBe(1);
        expect(acotarSegundos(25)).toBe(20);
    });

    it("encaja en la rejilla de medio segundo", () => {
        expect(acotarSegundos(4.3)).toBe(4.5);
        expect(acotarSegundos(4.1)).toBe(4);
    });

    it("no se rompe con valores imposibles", () => {
        expect(acotarSegundos(Number.NaN)).toBe(1);
    });
});

describe("modo simple — tiempos por lado", () => {
    it("sin tiempos propios, todos los lados duran igual", () => {
        expect(tiemposDeFigura(4, null, 4)).toEqual([4, 4, 4, 4]);
    });

    it("da un paso por lado, con la fase que dicta la figura", () => {
        const pasos = pasosDesdeFigura(4, [4, 2, 6, 2], 4);
        expect(pasos).toEqual([
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 2 },
            { phase: "E", seconds: 6 },
            { phase: "H", seconds: 2 },
        ]);
    });

    it("permite alargar la exhalación, que es el objetivo pedagógico", () => {
        const pasos = pasosDesdeFigura(2, [4, 8], 4);
        expect(pasos).toEqual([
            { phase: "I", seconds: 4 },
            { phase: "E", seconds: 8 },
        ]);
        expect(duracionCiclo(pasos)).toBe(12);
    });

    it("al cambiar de figura conserva lo afinado y rellena lo nuevo", () => {
        const reajustado = reajustarTiemposPorLado([5, 5, 5, 5], 6, 3);
        expect(reajustado).toEqual([5, 5, 5, 5, 3, 3]);
    });

    it("al reducir la figura recorta sobrante", () => {
        expect(reajustarTiemposPorLado([5, 5, 5, 5, 5, 5], 3, 4)).toEqual([5, 5, 5]);
    });

    it("sin personalización no reajusta nada", () => {
        expect(reajustarTiemposPorLado(null, 6, 3)).toBeNull();
    });
});

describe("patronActivo — qué ciclo se anima", () => {
    it("sin personalizar, deja que la portada siga por el camino de siempre", () => {
        expect(
            patronActivo({ modoEditor: "simple", sides: 4, seconds: 4, tiemposPorLado: null, pasosLibres: null }),
        ).toBeUndefined();
    });

    it("en modo simple con tiempos propios, deriva el ciclo de la figura", () => {
        const pasos = patronActivo({
            modoEditor: "simple",
            sides: 4,
            seconds: 4,
            tiemposPorLado: [4, 2, 6, 2],
            pasosLibres: null,
        });
        expect(pasos).toHaveLength(4);
        expect(duracionCiclo(pasos!)).toBe(14);
    });

    it("en modo avanzado manda la lista libre, aunque haya tiempos por lado", () => {
        const libres: PhaseStep[] = [
            { phase: "I", seconds: 4 },
            { phase: "H", seconds: 7 },
            { phase: "E", seconds: 8 },
        ];
        const pasos = patronActivo({
            modoEditor: "avanzado",
            sides: 4,
            seconds: 4,
            tiemposPorLado: [1, 1, 1, 1],
            pasosLibres: libres,
        });
        expect(pasos).toEqual(libres);
        expect(duracionCiclo(pasos!)).toBe(19);
    });

    it("el modo avanzado ignora una lista demasiado corta", () => {
        expect(
            patronActivo({
                modoEditor: "avanzado",
                sides: 4,
                seconds: 4,
                tiemposPorLado: null,
                pasosLibres: [{ phase: "I", seconds: 4 }],
            }),
        ).toBeUndefined();
    });

    it("la figura se deriva del número de pasos en modo avanzado", () => {
        const estado = {
            modoEditor: "avanzado" as const,
            sides: 4,
            seconds: 4,
            tiemposPorLado: null,
            pasosLibres: [
                { phase: "I" as const, seconds: 4 },
                { phase: "H" as const, seconds: 7 },
                { phase: "E" as const, seconds: 8 },
            ],
        };
        expect(ladosDelPatron(estado)).toBe(3);
        expect(ladosDelPatron({ ...estado, modoEditor: "simple" })).toBe(4);
    });
});

describe("edición de pasos en modo avanzado", () => {
    const base: PhaseStep[] = [
        { phase: "I", seconds: 4 },
        { phase: "E", seconds: 4 },
    ];

    it("añade pasos hasta el tope", () => {
        let pasos = base;
        for (let i = 0; i < 20; i++) pasos = anadirPaso(pasos);
        expect(pasos).toHaveLength(MAX_PASOS);
    });

    it("nunca deja el ciclo por debajo de inspirar y exhalar", () => {
        expect(quitarPaso(base, 0)).toEqual(base);
        expect(quitarPaso(anadirPaso(base), 2)).toEqual(base);
    });

    it("edita fase y duración, acotando", () => {
        expect(editarPaso(base, 1, { seconds: 99 })[1].seconds).toBe(20);
        expect(editarPaso(base, 0, { phase: "H" })[0].phase).toBe("H");
    });

    it("ignora índices fuera de rango", () => {
        expect(editarPaso(base, 7, { seconds: 2 })).toEqual(base);
        expect(moverPaso(base, 0, -1)).toEqual(base);
    });

    it("reordena pasos", () => {
        expect(moverPaso(base, 0, 1)).toEqual([
            { phase: "E", seconds: 4 },
            { phase: "I", seconds: 4 },
        ]);
    });
});

describe("aviso de retención larga", () => {
    it("avisa de apneas por encima del umbral", () => {
        expect(tieneRetencionLarga([{ phase: "H", seconds: 12 }])).toBe(true);
    });

    it("no avisa de inspiraciones o exhalaciones largas", () => {
        expect(tieneRetencionLarga([{ phase: "E", seconds: 20 }])).toBe(false);
    });

    it("no avisa de retenciones suaves", () => {
        expect(tieneRetencionLarga([{ phase: "H", seconds: 8 }])).toBe(false);
        // 4-7-8: la retención de 7 s se queda justo por debajo del aviso.
        expect(
            tieneRetencionLarga([
                { phase: "I", seconds: 4 },
                { phase: "H", seconds: 7 },
                { phase: "E", seconds: 8 },
            ]),
        ).toBe(false);
    });
});

describe("patrones con respaldo", () => {
    it("todos tienen al menos inspirar y exhalar", () => {
        for (const guia of PATRONES_GUIA) {
            expect(guia.pasos.length).toBeGreaterThanOrEqual(2);
            expect(guia.pasos.some((paso) => paso.phase === "I")).toBe(true);
            expect(guia.pasos.some((paso) => paso.phase === "E")).toBe(true);
        }
    });

    it("ninguno supera el umbral de aviso de retención: son seguros en el aula", () => {
        for (const guia of PATRONES_GUIA) {
            expect(tieneRetencionLarga(guia.pasos)).toBe(false);
        }
    });

    it("sus duraciones caben en los límites del editor", () => {
        for (const guia of PATRONES_GUIA) {
            for (const paso of guia.pasos) {
                expect(acotarSegundos(paso.seconds)).toBe(paso.seconds);
            }
        }
    });

    it("la resonancia se queda cerca de 5,5 resp/min", () => {
        const resonancia = PATRONES_GUIA.find((guia) => guia.id === "resonancia")!;
        expect(60 / duracionCiclo(resonancia.pasos)).toBeCloseTo(5.45, 1);
    });

    it("el suspiro fisiológico es doble inspiración y exhalación larga", () => {
        const suspiro = PATRONES_GUIA.find((guia) => guia.id === "suspiro")!;
        expect(suspiro.pasos.filter((paso) => paso.phase === "I")).toHaveLength(2);
        const exhalacion = suspiro.pasos.find((paso) => paso.phase === "E")!;
        const inspiracion = suspiro.pasos
            .filter((paso) => paso.phase === "I")
            .reduce((total, paso) => total + paso.seconds, 0);
        expect(exhalacion.seconds).toBeGreaterThan(inspiracion);
    });

    it("tienen identificadores únicos", () => {
        const ids = PATRONES_GUIA.map((guia) => guia.id);
        expect(new Set(ids).size).toBe(ids.length);
    });
});
