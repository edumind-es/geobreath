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

import { useEffect, useState } from "react";
import { useBreathingFeedback } from "@/lib/useBreathingFeedback";
import type { Phase } from "@/lib/geoLogic";
import { translations, type Language } from "@/lib/i18n";
import { phaseLabel, shapeLabel, type ShapeValue } from "../lib/breathing";

export type Preset = "calm" | "focus" | "recover";

/**
 * Estado y acciones de la sesión de respiración. Extraído de la portada para
 * dejar la página como mero ensamblador. Mismo comportamiento que antes:
 * detección de embed, feedback sensorial, temporizador, atajos de teclado y
 * gestión del modal de ayuda.
 */
export function useBreathingSession() {
    const [embedded, setEmbedded] = useState(false);
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

    const t = translations[lang];
    const challengeGoal = Math.max(1, (sides - 1) * 5);
    const progress = Math.min(100, (cycles / challengeGoal) * 100);
    const activePhaseLabel = phaseLabel(currentPhase, t);
    const activeShapeLabel = shapeLabel(sides, t);
    const activePictogram =
        currentPhase === "I" ? "/img/inspiro.png" : currentPhase === "E" ? "/img/exhalo.png" : "/img/aguanta.png";
    const activeSupportCount = [sound, vibe, showPictos, tts].filter(Boolean).length;
    const compactMode = focusMode || embedded;

    // Detección de modo embed (pizarra / iframe)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const nextEmbedded = params.get("embed") === "1" || params.get("board") === "1";
        setEmbedded(nextEmbedded);
        document.body.dataset.edumindEmbed = nextEmbedded ? "true" : "false";
        return () => {
            delete document.body.dataset.edumindEmbed;
        };
    }, []);

    // Apoyos sensoriales (sonido, vibración, voz)
    useBreathingFeedback(currentPhase, isPlaying, {
        sound,
        vibe,
        tts,
        lang,
        labels: { inspire: t.inspire, exhale: t.exhale, hold: t.hold },
    });

    // Temporizador de sesión
    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isPlaying) {
            interval = setInterval(() => setSessionTime((value) => value + 1), 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
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
        if (preset === "calm") {
            setSides(3);
            setSeconds(3.5);
            setSound(true);
            setVibe(false);
            setTts(false);
            setShowPictos(true);
            return;
        }
        if (preset === "focus") {
            setSides(4);
            setSeconds(4);
            setSound(true);
            setVibe(false);
            setTts(true);
            setShowPictos(false);
            return;
        }
        setSides(6);
        setSeconds(2.5);
        setSound(false);
        setVibe(true);
        setTts(false);
        setShowPictos(true);
    };

    const handleShapeChange = (nextSides: ShapeValue) => {
        setSides(nextSides);
        setCycles(0);
        setCurrentPhase("I");
    };

    const handleCycle = () => setCycles((value) => value + 1);
    const resetChallenge = () => setCycles(0);
    const adjustSeconds = (delta: number) => setSeconds((value) => Math.min(10, Math.max(1, value + delta)));

    return {
        // estado
        embedded,
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
        // derivados
        t,
        challengeGoal,
        progress,
        activePhaseLabel,
        activeShapeLabel,
        activePictogram,
        activeSupportCount,
        compactMode,
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
    };
}

export type BreathingSession = ReturnType<typeof useBreathingSession>;
