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

import { useEffect, useRef, useState } from "react";
import { useBreathingFeedback } from "@/lib/useBreathingFeedback";
import { useWakeLock } from "@/lib/useWakeLock";
import type { Phase, PhaseStep } from "@/lib/geoLogic";
import {
    borrarPreferencias,
    guardarPreferencias,
    leerPreferencias,
    MAX_PATRONES,
    RONDAS_MAX,
    RONDAS_MIN,
    type ModoEditor,
    type PatronGuardado,
} from "@/lib/almacenLocal";
import {
    duracionCiclo,
    ladosDelPatron,
    pasosDesdeFigura,
    pasosLibresIniciales,
    patronActivo,
    reajustarTiemposPorLado,
    tieneRetencionLarga,
    acotarSegundos,
    anadirPaso,
    editarPaso,
    moverPaso,
    quitarPaso,
    PATRONES_GUIA,
} from "../lib/patrones";
import { translations, type Language } from "@/lib/i18n";
import { phaseLabel, shapeLabel, type ShapeValue } from "../lib/breathing";

export type Preset = "calm" | "focus" | "recover";

/**
 * Configuración de cada preajuste, en un único sitio.
 *
 * Antes vivía dentro de `applyPreset` en forma de ifs, y no había manera de
 * reutilizarla desde la lectura de los parámetros de la URL.
 */
const PRESETS: Record<Preset, { sides: number; seconds: number; sound: boolean; vibe: boolean; tts: boolean; pictos: boolean }> = {
    calm: { sides: 3, seconds: 3.5, sound: true, vibe: false, tts: false, pictos: true },
    focus: { sides: 4, seconds: 4, sound: true, vibe: false, tts: true, pictos: false },
    recover: { sides: 6, seconds: 2.5, sound: false, vibe: true, tts: false, pictos: true },
};

function esPreset(valor: string | null): valor is Preset {
    return valor === "calm" || valor === "focus" || valor === "recover";
}

/** Número dentro de un rango, o null si no viene o no vale. */
function numeroEnRango(valor: string | null, min: number, max: number): number | null {
    if (valor === null) return null;
    const numero = Number(valor.replace(",", "."));
    if (!Number.isFinite(numero) || numero < min || numero > max) return null;
    return numero;
}

/**
 * Estado y acciones de la sesión de respiración. Extraído de la portada para
 * dejar la página como mero ensamblador. Mismo comportamiento que antes:
 * detección de embed, feedback sensorial, temporizador, atajos de teclado y
 * gestión del modal de ayuda.
 */
export function useBreathingSession() {
    const [embedded, setEmbedded] = useState(false);
    // `panel=1`: mostrar los controles aun estando empotrado. Sin esto, quien
    // incrusta Breath (la pizarra EDUmind) solo podía ofrecer la respiración
    // cuadrada de serie, sin forma de ajustar nada.
    const [panelForzado, setPanelForzado] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sides, setSides] = useState(4);
    const [seconds, setSeconds] = useState(4);
    const [currentPhase, setCurrentPhase] = useState<Phase>("I");
    const [lang, setLang] = useState<Language>("es");
    const [focusMode, setFocusMode] = useState(false);
    const [showFaq, setShowFaq] = useState(false);
    const [sound, setSound] = useState(true);
    const [vibe, setVibe] = useState(true);
    const [tts, setTts] = useState(false);
    const [showPictos, setShowPictos] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);
    const [cycles, setCycles] = useState(0);
    // Segundos de sesión ya consolidados en tramos de reproducción anteriores.
    const segundosAcumuladosRef = useRef(0);

    // --- Editor de tiempos respiratorios ---
    const [modoEditor, setModoEditor] = useState<ModoEditor>("simple");
    // Duración de cada lado (modo simple). null = ritmo uniforme de siempre.
    const [tiemposPorLado, setTiemposPorLado] = useState<number[] | null>(null);
    // Ciclo libre (modo avanzado). null = todavía no se ha abierto el modo.
    const [pasosLibres, setPasosLibres] = useState<PhaseStep[] | null>(null);
    const [patronesGuardados, setPatronesGuardados] = useState<PatronGuardado[]>([]);
    // Modo aula: rondas objetivo. null = sesión abierta, como hasta ahora.
    const [objetivoRondas, setObjetivoRondas] = useState<number | null>(null);
    // Hasta leer localStorage no escribimos, o sobrescribiríamos con los valores
    // por defecto lo que la persona tenía guardado.
    const [hidratado, setHidratado] = useState(false);

    const t = translations[lang];

    const estadoPatron = { modoEditor, sides, seconds, tiemposPorLado, pasosLibres };
    /** Ciclo que anima el escenario. `undefined` = ritmo uniforme de siempre. */
    const pattern = patronActivo(estadoPatron);
    /** Lados que dibuja la figura (en modo avanzado, uno por paso). */
    const ladosEfectivos = ladosDelPatron(estadoPatron);
    /** Pasos que muestra el editor, haya o no personalización todavía. */
    const pasosEditables: PhaseStep[] =
        modoEditor === "avanzado"
            ? pasosLibres ?? pasosLibresIniciales(sides, tiemposPorLado, seconds)
            : pasosDesdeFigura(sides, tiemposPorLado, seconds);
    const duracionCicloActual = duracionCiclo(pasosEditables);
    const respiracionesPorMinuto = duracionCicloActual > 0 ? 60 / duracionCicloActual : 0;
    const avisoRetencion = tieneRetencionLarga(pasosEditables);
    const personalizado = tiemposPorLado !== null || (modoEditor === "avanzado" && pasosLibres !== null);

    const challengeGoal = objetivoRondas ?? Math.max(1, (ladosEfectivos - 1) * 5);
    const progress = Math.min(100, (cycles / challengeGoal) * 100);
    const activePhaseLabel = phaseLabel(currentPhase, t);
    const activeShapeLabel = shapeLabel(ladosEfectivos, t);
    const activePictogram =
        currentPhase === "I" ? "/img/inspiro.png" : currentPhase === "E" ? "/img/exhalo.png" : "/img/aguanta.png";
    const activeSupportCount = [sound, vibe, showPictos, tts].filter(Boolean).length;
    const compactMode = focusMode || (embedded && !panelForzado);

    // Modo embed y estrategia de partida, desde la URL.
    //
    // Contrato con quien incrusta Breath en un iframe (hoy, la pizarra EDUmind):
    // embed=1, panel=1, lados=N, segundos=S, preset=P, patron=ID, rondas=N, auto=1.
    // Todo es opcional y lo que no se entienda se ignora: un enlace viejo sigue
    // funcionando exactamente igual que antes.
    /*
     * `set-state-in-effect` avisa aquí de algo que en este caso es inevitable:
     * ni `localStorage` ni `window.location` existen durante el render en el
     * servidor. Leerlos en el cuerpo del componente daría un desajuste de
     * hidratación, así que la única lectura posible es tras el montaje. Es un
     * efecto de arranque que corre una sola vez.
     */
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        // 1) Lo guardado en este dispositivo. 2) Lo que diga la URL, que manda:
        // si la pizarra pide un ritmo concreto, ese es el que suena hoy.
        const guardadas = leerPreferencias();
        if (guardadas.lang !== undefined) setLang(guardadas.lang);
        if (guardadas.sides !== undefined) setSides(guardadas.sides);
        if (guardadas.seconds !== undefined) setSeconds(guardadas.seconds);
        if (guardadas.sound !== undefined) setSound(guardadas.sound);
        if (guardadas.vibe !== undefined) setVibe(guardadas.vibe);
        if (guardadas.tts !== undefined) setTts(guardadas.tts);
        if (guardadas.showPictos !== undefined) setShowPictos(guardadas.showPictos);
        if (guardadas.modoEditor !== undefined) setModoEditor(guardadas.modoEditor);
        if (guardadas.tiemposPorLado !== undefined) setTiemposPorLado(guardadas.tiemposPorLado);
        if (guardadas.pasosLibres !== undefined) setPasosLibres(guardadas.pasosLibres);
        if (guardadas.patronesGuardados !== undefined) setPatronesGuardados(guardadas.patronesGuardados);
        if (guardadas.objetivoRondas !== undefined) setObjetivoRondas(guardadas.objetivoRondas);
        setHidratado(true);

        const params = new URLSearchParams(window.location.search);
        const nextEmbedded = params.get("embed") === "1" || params.get("board") === "1";
        setEmbedded(nextEmbedded);
        setPanelForzado(params.get("panel") === "1");
        document.body.dataset.edumindEmbed = nextEmbedded ? "true" : "false";

        // Un patrón con respaldo (resonancia, caja, 4-7-8, suspiro) manda sobre
        // todo lo demás: son ciclos asimétricos que no caben en `lados` +
        // `segundos`, así que entran por el modo avanzado tal cual.
        const patron = params.get("patron");
        const guia = patron ? PATRONES_GUIA.find((entrada) => entrada.id === patron) : undefined;
        if (guia) {
            setPasosLibres(guia.pasos);
            setModoEditor("avanzado");
        }

        // El preset después: lados y segundos explícitos mandan sobre él.
        const preset = params.get("preset");
        if (esPreset(preset)) {
            const config = PRESETS[preset];
            setSides(config.sides);
            setSeconds(config.seconds);
            setSound(config.sound);
            setVibe(config.vibe);
            setTts(config.tts);
            setShowPictos(config.pictos);
        }

        const lados = numeroEnRango(params.get("lados"), 3, 8);
        if (lados !== null) setSides(Math.round(lados));

        const segundos = numeroEnRango(params.get("segundos"), 1, 10);
        if (segundos !== null) setSeconds(segundos);

        // Un ritmo pedido por la URL manda sobre los tiempos afinados a mano:
        // si no, la pizarra pediría 3 s y sonaría el patrón guardado del día.
        if (!guia && (esPreset(preset) || lados !== null || segundos !== null)) {
            setTiemposPorLado(null);
            setModoEditor("simple");
        }

        const rondas = numeroEnRango(params.get("rondas"), RONDAS_MIN, RONDAS_MAX);
        if (rondas !== null) setObjetivoRondas(Math.round(rondas));

        if (params.get("auto") === "1") setIsPlaying(true);

        return () => {
            delete document.body.dataset.edumindEmbed;
        };
    }, []);
    /* eslint-enable react-hooks/set-state-in-effect */

    // Guardar en el propio navegador cada vez que algo cambia.
    //
    // Empotrado NO se guarda: la pizarra configura Breath por URL para una
    // clase concreta, y eso no debe pisar las preferencias personales de quien
    // luego abra la app por su cuenta.
    useEffect(() => {
        if (!hidratado || embedded) return;
        guardarPreferencias({
            lang,
            sides,
            seconds,
            sound,
            vibe,
            tts,
            showPictos,
            modoEditor,
            tiemposPorLado,
            pasosLibres,
            patronesGuardados,
            objetivoRondas,
        });
    }, [
        hidratado,
        embedded,
        lang,
        sides,
        seconds,
        sound,
        vibe,
        tts,
        showPictos,
        modoEditor,
        tiemposPorLado,
        pasosLibres,
        patronesGuardados,
        objetivoRondas,
    ]);

    // Apoyos sensoriales (sonido, vibración, voz)
    useBreathingFeedback(currentPhase, isPlaying, {
        sound,
        vibe,
        tts,
        lang,
        labels: { inspire: t.inspire, exhale: t.exhale, hold: t.hold },
    });

    // Mantener la pantalla encendida mientras se respira
    useWakeLock(isPlaying);

    // Pausa automática al irse a segundo plano.
    //
    // Con la pestaña oculta el navegador deja de emitir frames: la figura se
    // congela pero el reloj seguiría corriendo, y al volver la sesión mostraría
    // minutos que nadie ha respirado. Pausamos y que sea la persona quien
    // reanude.
    useEffect(() => {
        if (!isPlaying) return;
        const alOcultarse = () => {
            if (document.visibilityState === "hidden") setIsPlaying(false);
        };
        document.addEventListener("visibilitychange", alOcultarse);
        return () => document.removeEventListener("visibilitychange", alOcultarse);
    }, [isPlaying]);

    // Temporizador de sesión.
    //
    // Medido contra el reloj y no sumando +1 por tick: los navegadores limitan
    // los `setInterval` en segundo plano, así que contar ticks perdía tiempo.
    // Acumulamos por tramos de reproducción.
    useEffect(() => {
        if (!isPlaying) return;
        const inicioTramo = Date.now();

        const actualizar = () =>
            setSessionTime(Math.floor(segundosAcumuladosRef.current + (Date.now() - inicioTramo) / 1000));

        const interval = setInterval(actualizar, 1000);
        return () => {
            clearInterval(interval);
            // Consolidamos el tramo y fijamos el total ya cerrado (no reusamos
            // `actualizar`: volvería a sumar el tramo recién acumulado).
            segundosAcumuladosRef.current += (Date.now() - inicioTramo) / 1000;
            setSessionTime(Math.floor(segundosAcumuladosRef.current));
        };
    }, [isPlaying]);

    // Modal de ayuda: bloquear scroll + cerrar con Escape
    useEffect(() => {
        if (!showFaq) return;
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setShowFaq(false);
        };
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showFaq]);

    // Atajos de teclado: espacio (play/pausa), f (foco), ? (ayuda)
    useEffect(() => {
        const handleShortcuts = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isEditableTarget = target ? ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) : false;
            if (isEditableTarget) return;
            if (showFaq && event.key !== "Escape") return;

            if (event.code === "Space") {
                event.preventDefault();
                setIsPlaying((value) => !value);
            }
            if (event.key.toLowerCase() === "f") {
                event.preventDefault();
                setFocusMode((value) => !value);
            }
            if (event.key === "?") {
                event.preventDefault();
                setShowFaq(true);
            }
        };
        window.addEventListener("keydown", handleShortcuts);
        return () => window.removeEventListener("keydown", handleShortcuts);
    }, [showFaq]);

    const togglePlaying = () => setIsPlaying((value) => !value);

    const applyPreset = (preset: Preset) => {
        setCycles(0);
        setCurrentPhase("I");
        const config = PRESETS[preset];
        setSides(config.sides);
        setSeconds(config.seconds);
        setSound(config.sound);
        setVibe(config.vibe);
        setTts(config.tts);
        setShowPictos(config.pictos);
        // Una rutina rápida es un punto de partida limpio, sin tiempos a medida.
        setTiemposPorLado(null);
        setModoEditor("simple");
    };

    const handleShapeChange = (nextSides: ShapeValue) => {
        setSides(nextSides);
        // Cambiar de figura no debe tirar por la borda los tiempos afinados:
        // se conservan los lados que ya había y los nuevos salen al ritmo base.
        setTiemposPorLado((tiempos) => reajustarTiemposPorLado(tiempos, nextSides, seconds));
        setCycles(0);
        setCurrentPhase("I");
    };

    const handleCycle = () => {
        const siguiente = cycles + 1;
        setCycles(siguiente);
        // Modo aula: al completar las rondas, la sesión se detiene sola. En
        // clase nadie está pendiente de pulsar pausa.
        if (objetivoRondas !== null && siguiente >= objetivoRondas) setIsPlaying(false);
    };
    const resetChallenge = () => setCycles(0);
    const adjustSeconds = (delta: number) => setSeconds((value) => Math.min(10, Math.max(1, value + delta)));

    // --- Acciones del editor de tiempos ---

    const cambiarModoEditor = (modo: ModoEditor) => {
        // Al abrir el modo avanzado por primera vez, se parte del ciclo actual:
        // nadie empieza ante una lista en blanco.
        if (modo === "avanzado" && pasosLibres === null) {
            setPasosLibres(pasosLibresIniciales(sides, tiemposPorLado, seconds));
        }
        setModoEditor(modo);
    };

    /** Modo simple: cambia la duración de un lado concreto. */
    const cambiarTiempoLado = (indice: number, segundos: number) => {
        setTiemposPorLado((tiempos) => {
            const base = tiempos ?? pasosDesdeFigura(sides, null, seconds).map((paso) => paso.seconds);
            if (indice < 0 || indice >= base.length) return tiempos;
            const siguiente = [...base];
            siguiente[indice] = acotarSegundos(segundos);
            return siguiente;
        });
    };

    /** Vuelve al ritmo uniforme, descartando la personalización. */
    const reiniciarTiempos = () => {
        setTiemposPorLado(null);
        setPasosLibres(null);
        setModoEditor("simple");
        setCycles(0);
    };

    // Modo avanzado: la lista libre de pasos.
    const editarPasoLibre = (indice: number, cambio: Partial<PhaseStep>) =>
        setPasosLibres((pasos) => editarPaso(pasos ?? pasosLibresIniciales(sides, tiemposPorLado, seconds), indice, cambio));
    const anadirPasoLibre = () =>
        setPasosLibres((pasos) => anadirPaso(pasos ?? pasosLibresIniciales(sides, tiemposPorLado, seconds)));
    const quitarPasoLibre = (indice: number) =>
        setPasosLibres((pasos) => quitarPaso(pasos ?? pasosLibresIniciales(sides, tiemposPorLado, seconds), indice));
    const moverPasoLibre = (indice: number, direccion: -1 | 1) =>
        setPasosLibres((pasos) => moverPaso(pasos ?? pasosLibresIniciales(sides, tiemposPorLado, seconds), indice, direccion));

    // --- Patrones propios, guardados en este dispositivo ---

    const guardarPatron = (nombre: string) => {
        const limpio = nombre.trim().slice(0, 60);
        if (!limpio) return;
        const pasos = pasosEditables;
        if (pasos.length < 2) return;
        setPatronesGuardados((lista) => {
            // Mismo nombre = se reemplaza, en vez de acumular duplicados.
            const sinDuplicado = lista.filter((patron) => patron.nombre !== limpio);
            const nuevo: PatronGuardado = {
                id: `${limpio}-${sinDuplicado.length}-${pasos.map((paso) => paso.seconds).join("-")}`,
                nombre: limpio,
                pasos,
            };
            return [nuevo, ...sinDuplicado].slice(0, MAX_PATRONES);
        });
    };

    const aplicarPatron = (id: string) => {
        const patron = patronesGuardados.find((entrada) => entrada.id === id);
        if (!patron) return;
        setPasosLibres(patron.pasos);
        setModoEditor("avanzado");
        setCycles(0);
        setCurrentPhase("I");
    };

    const borrarPatron = (id: string) =>
        setPatronesGuardados((lista) => lista.filter((patron) => patron.id !== id));

    /** Modo aula: fija las rondas objetivo, o null para sesión abierta. */
    const cambiarObjetivoRondas = (valor: number | null) => {
        if (valor === null) {
            setObjetivoRondas(null);
            return;
        }
        setObjetivoRondas(Math.min(RONDAS_MAX, Math.max(RONDAS_MIN, Math.round(valor))));
    };

    /** Aplica uno de los patrones con respaldo como punto de partida. */
    const aplicarPatronGuia = (id: string) => {
        const guia = PATRONES_GUIA.find((patron) => patron.id === id);
        if (!guia) return;
        setPasosLibres(guia.pasos);
        setModoEditor("avanzado");
        setCycles(0);
        setCurrentPhase("I");
    };

    /** Borra todo lo que GeoBreath guarda en este navegador. */
    const olvidarDatosLocales = () => {
        borrarPreferencias();
        setTiemposPorLado(null);
        setPasosLibres(null);
        setPatronesGuardados([]);
        setModoEditor("simple");
        setObjetivoRondas(null);
    };

    return {
        // estado
        embedded,
        panelForzado,
        isPlaying,
        sides,
        seconds,
        currentPhase,
        lang,
        focusMode,
        showFaq,
        sound,
        vibe,
        tts,
        showPictos,
        sessionTime,
        cycles,
        modoEditor,
        tiemposPorLado,
        pasosLibres,
        patronesGuardados,
        objetivoRondas,
        // derivados
        t,
        challengeGoal,
        progress,
        activePhaseLabel,
        activeShapeLabel,
        activePictogram,
        activeSupportCount,
        compactMode,
        pattern,
        ladosEfectivos,
        pasosEditables,
        duracionCicloActual,
        respiracionesPorMinuto,
        avisoRetencion,
        personalizado,
        // acciones / setters
        setSeconds,
        setLang,
        setFocusMode,
        setShowFaq,
        setSound,
        setVibe,
        setTts,
        setShowPictos,
        setCurrentPhase,
        togglePlaying,
        applyPreset,
        handleShapeChange,
        handleCycle,
        resetChallenge,
        adjustSeconds,
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
        cambiarObjetivoRondas,
        aplicarPatronGuia,
        olvidarDatosLocales,
    };
}

export type BreathingSession = ReturnType<typeof useBreathingSession>;
