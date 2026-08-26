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

import { useState } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import type { Phase } from "@/lib/geoLogic";
import { MAX_PASOS, SEGUNDOS_MAX, SEGUNDOS_MIN } from "@/lib/almacenLocal";
import { phaseLabel } from "../lib/breathing";
import { duracionCiclo, PATRONES_GUIA } from "../lib/patrones";
import type { BreathingSession } from "../hooks/useBreathingSession";

const FASES: Phase[] = ["I", "H", "E"];

// Acento de mundo por fase, en línea con el escenario: mental / social / emocional
const ACENTO: Record<Phase, string> = {
    I: "border-mental/50 bg-mental/10 text-mental-deep",
    H: "border-social/50 bg-social/10 text-social-deep",
    E: "border-emocional/50 bg-emocional/10 text-emocional-deep",
};

/** Ajuste de una duración: − valor + */
function PasoSegundos({
    valor,
    etiqueta,
    onCambio,
}: {
    valor: number;
    etiqueta: string;
    onCambio: (segundos: number) => void;
}) {
    return (
        <div className="flex items-center gap-1 rounded-lg border border-rule bg-paper p-1">
            <button
                type="button"
                onClick={() => onCambio(valor - 0.5)}
                disabled={valor <= SEGUNDOS_MIN}
                aria-label={`${etiqueta} −0,5 s`}
                className="flex h-9 w-9 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04] disabled:opacity-30"
            >
                −
            </button>
            <span className="min-w-[3.5rem] text-center font-mono text-sm font-semibold text-ink" aria-live="off">
                {valor.toFixed(1)} s
            </span>
            <button
                type="button"
                onClick={() => onCambio(valor + 0.5)}
                disabled={valor >= SEGUNDOS_MAX}
                aria-label={`${etiqueta} +0,5 s`}
                className="flex h-9 w-9 items-center justify-center rounded-md text-mental-deep transition-colors hover:bg-black/[0.04] disabled:opacity-30"
            >
                +
            </button>
        </div>
    );
}

/**
 * Editor de tiempos respiratorios.
 *
 * Modo simple: una duración por cada lado de la figura, con la fase que dicta
 * la geometría. Modo avanzado: ciclo libre, para patrones asimétricos como el
 * 4-7-8 o el suspiro fisiológico, que no caben en un polígono de fases fijas.
 */
export default function EditorTiempos({ session }: { session: BreathingSession }) {
    const {
        t,
        modoEditor,
        pasosEditables,
        duracionCicloActual,
        respiracionesPorMinuto,
        avisoRetencion,
        personalizado,
        patronesGuardados,
        cambiarModoEditor,
        cambiarTiempoLado,
        reiniciarTiempos,
        editarPasoLibre,
        anadirPasoLibre,
        quitarPasoLibre,
        moverPasoLibre,
        guardarPatron,
        aplicarPatron,
        borrarPatron,
        aplicarPatronGuia,
        olvidarDatosLocales,
    } = session;

    const [nombre, setNombre] = useState("");
    const avanzado = modoEditor === "avanzado";

    const alGuardar = () => {
        guardarPatron(nombre);
        setNombre("");
    };

    return (
        <section className="mt-6 border-t border-rule pt-6">
            {/* Cabecera y selector de modo */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.rhythmEditor}</p>
                    {personalizado ? (
                        <span className="mt-1 inline-block rounded-md border border-interior-deep bg-interior/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-interior-deep">
                            {t.customized}
                        </span>
                    ) : null}
                </div>

                <div className="flex rounded-lg border border-rule bg-paper p-1" role="group" aria-label={t.rhythmEditor}>
                    {(["simple", "avanzado"] as const).map((modo) => (
                        <button
                            key={modo}
                            type="button"
                            onClick={() => cambiarModoEditor(modo)}
                            aria-pressed={modoEditor === modo}
                            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                                modoEditor === modo ? "bg-mental/15 text-mental-deep" : "text-ink-2 hover:text-ink"
                            }`}
                        >
                            {modo === "simple" ? t.modeSimple : t.modeAdvanced}
                        </button>
                    ))}
                </div>
            </div>

            <p className="mb-4 text-sm leading-6 text-ink-2">{avanzado ? t.freeStepsHint : t.perSideHint}</p>

            {/* Lectura del ciclo */}
            <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded-md border border-rule bg-paper px-3 py-1 text-ink">
                    {t.cycleDuration}: {duracionCicloActual.toFixed(1)} s
                </span>
                <span className="rounded-md border border-rule bg-paper px-3 py-1 text-ink">
                    {respiracionesPorMinuto.toFixed(1)} {t.breathsPerMin}
                </span>
            </div>

            {/* Fases */}
            <ul className="grid gap-2">
                {pasosEditables.map((paso, indice) => (
                    <li
                        key={`${indice}-${paso.phase}`}
                        className="flex flex-wrap items-center gap-2 rounded-lg border border-rule bg-paper p-2"
                    >
                        <span className="w-6 shrink-0 text-center font-mono text-xs text-ink-3">{indice + 1}</span>

                        {avanzado ? (
                            <select
                                value={paso.phase}
                                onChange={(evento) => editarPasoLibre(indice, { phase: evento.target.value as Phase })}
                                aria-label={`${t.rhythmEditor} ${indice + 1}`}
                                className={`h-9 min-w-[7rem] rounded-md border px-2 text-sm font-semibold ${ACENTO[paso.phase]}`}
                            >
                                {FASES.map((fase) => (
                                    <option key={fase} value={fase}>
                                        {phaseLabel(fase, t)}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <span
                                className={`inline-flex h-9 min-w-[7rem] items-center rounded-md border px-2 text-sm font-semibold ${ACENTO[paso.phase]}`}
                            >
                                {phaseLabel(paso.phase, t)}
                            </span>
                        )}

                        <PasoSegundos
                            valor={paso.seconds}
                            etiqueta={`${phaseLabel(paso.phase, t)} ${indice + 1}`}
                            onCambio={(segundos) =>
                                avanzado ? editarPasoLibre(indice, { seconds: segundos }) : cambiarTiempoLado(indice, segundos)
                            }
                        />

                        {avanzado ? (
                            <div className="ml-auto flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => moverPasoLibre(indice, -1)}
                                    disabled={indice === 0}
                                    aria-label={`${t.moveUp} ${indice + 1}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                                >
                                    <ArrowUp size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moverPasoLibre(indice, 1)}
                                    disabled={indice === pasosEditables.length - 1}
                                    aria-label={`${t.moveDown} ${indice + 1}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:text-ink disabled:opacity-30"
                                >
                                    <ArrowDown size={15} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => quitarPasoLibre(indice)}
                                    disabled={pasosEditables.length <= 2}
                                    aria-label={`${t.removeStep} ${indice + 1}`}
                                    className="flex h-9 w-9 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:text-fisico-deep disabled:opacity-30"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        ) : null}
                    </li>
                ))}
            </ul>

            {/* Aviso de retención larga — advertencia, nunca bloqueo */}
            {avisoRetencion ? (
                <p
                    role="status"
                    className="mt-3 flex items-start gap-2 rounded-lg border border-social-deep bg-social/10 p-3 text-xs leading-5 text-social-deep"
                >
                    <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                    {t.holdWarning}
                </p>
            ) : null}

            {/* Acciones del ciclo */}
            <div className="mt-3 flex flex-wrap gap-2">
                {avanzado ? (
                    <button
                        type="button"
                        onClick={anadirPasoLibre}
                        disabled={pasosEditables.length >= MAX_PASOS}
                        className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-paper px-3 py-2 text-xs font-semibold text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
                    >
                        <Plus size={14} />
                        {t.addStep}
                    </button>
                ) : null}
                <button
                    type="button"
                    onClick={reiniciarTiempos}
                    disabled={!personalizado}
                    className="inline-flex items-center gap-1.5 rounded-md border border-rule bg-paper px-3 py-2 text-xs font-semibold text-ink-2 transition-colors hover:text-ink disabled:opacity-40"
                >
                    <RotateCcw size={14} />
                    {t.resetTimes}
                </button>
            </div>

            {/* Patrones con respaldo: punto de partida, no adorno */}
            <div className="mt-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.guidedPatterns}</p>
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                    {PATRONES_GUIA.map((guia) => (
                        <li key={guia.id}>
                            <button
                                type="button"
                                onClick={() => aplicarPatronGuia(guia.id)}
                                className="h-full w-full rounded-lg border border-rule bg-paper p-3 text-left transition-colors hover:border-ink-3"
                            >
                                <span className="flex items-baseline justify-between gap-2">
                                    <span className="font-display text-sm font-semibold text-ink">{t[guia.nombreKey]}</span>
                                    <span className="shrink-0 font-mono text-[10px] text-ink-3">
                                        {(60 / duracionCiclo(guia.pasos)).toFixed(1)} {t.breathsPerMin}
                                    </span>
                                </span>
                                <span className="mt-1 block font-mono text-[11px] text-ink-2">
                                    {guia.pasos.map((paso) => `${phaseLabel(paso.phase, t)[0]}${paso.seconds}`).join(" · ")}
                                </span>
                                <span className="mt-1 block text-xs leading-5 text-ink-2">{t[guia.descKey]}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Patrones propios */}
            <div className="mt-5">
                <div className="flex flex-wrap items-center gap-2">
                    <input
                        type="text"
                        value={nombre}
                        maxLength={60}
                        onChange={(evento) => setNombre(evento.target.value)}
                        onKeyDown={(evento) => {
                            if (evento.key === "Enter") alGuardar();
                        }}
                        placeholder={t.patternName}
                        aria-label={t.patternName}
                        className="h-10 min-w-0 flex-1 rounded-md border border-rule bg-paper px-3 text-sm text-ink placeholder:text-ink-3"
                    />
                    <button
                        type="button"
                        onClick={alGuardar}
                        disabled={nombre.trim().length === 0}
                        className="inline-flex h-10 items-center gap-1.5 rounded-md border border-mental-deep bg-mental/10 px-3 text-xs font-semibold text-mental-deep transition-colors hover:bg-mental/20 disabled:opacity-40"
                    >
                        <Save size={14} />
                        {t.savePattern}
                    </button>
                </div>

                {patronesGuardados.length > 0 ? (
                    <>
                        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.myPatterns}</p>
                        <ul className="mt-2 grid gap-2">
                            {patronesGuardados.map((patron) => (
                                <li key={patron.id} className="flex items-center gap-2 rounded-lg border border-rule bg-paper p-2">
                                    <button
                                        type="button"
                                        onClick={() => aplicarPatron(patron.id)}
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <span className="block truncate text-sm font-semibold text-ink">{patron.nombre}</span>
                                        <span className="block font-mono text-[11px] text-ink-2">
                                            {patron.pasos.map((paso) => paso.seconds).join(" · ")} s
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => borrarPatron(patron.id)}
                                        aria-label={`${t.deletePattern}: ${patron.nombre}`}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-rule text-ink-2 transition-colors hover:text-fisico-deep"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </>
                ) : null}

                {/* Soberanía del dato: dónde vive esto y cómo borrarlo */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-rule pt-3">
                    <p className="font-mono text-[11px] text-ink-3">{t.storedLocally}</p>
                    <button
                        type="button"
                        onClick={olvidarDatosLocales}
                        className="font-mono text-[11px] text-ink-2 underline underline-offset-2 transition-colors hover:text-fisico-deep"
                    >
                        {t.forgetData}
                    </button>
                </div>
            </div>
        </section>
    );
}
