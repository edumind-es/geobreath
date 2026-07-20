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

"use client";

import { useEffect, useRef } from "react";
import { Phase } from "./geoLogic";
import { Language } from "./i18n";

interface FeedbackLabels {
    inspire: string;
    exhale: string;
    hold: string;
}

interface FeedbackOptions {
    sound: boolean;
    vibe: boolean;
    tts: boolean;
    lang: Language;
    labels: FeedbackLabels;
}

const speechLocaleMap: Record<Language, string> = {
    es: "es-ES",
    gl: "gl-ES",
    cat: "ca-ES",
    eu: "eu-ES",
    en: "en-US",
    zh: "zh-CN",
};

// Idiomas con clips de voz neural pregrabados (alta calidad) en /public/audio.
// El resto (p. ej. euskera, sin voz neural gratuita) cae al sintetizador del navegador.
const CLIP_LANGS = new Set<Language>(["es", "gl", "cat", "en", "zh"]);

export function useBreathingFeedback(phase: Phase, isPlaying: boolean, options: FeedbackOptions) {
    const audioContextRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);
    const lastPhaseRef = useRef<Phase | null>(null);
    const lastFeedbackSignatureRef = useRef("");
    const wasPlayingRef = useRef(false);
    const voiceClipsRef = useRef<Partial<Record<Phase, HTMLAudioElement>>>({});

    // Precarga de los clips de voz del idioma activo (si los tiene)
    useEffect(() => {
        if (!CLIP_LANGS.has(options.lang)) {
            voiceClipsRef.current = {};
            return;
        }
        const phases: Phase[] = ["I", "E", "H"];
        const clips: Partial<Record<Phase, HTMLAudioElement>> = {};
        phases.forEach((ph) => {
            const audio = new Audio(`/audio/${options.lang}/${ph}.mp3`);
            audio.preload = "auto";
            audio.volume = 0.9;
            clips[ph] = audio;
        });
        voiceClipsRef.current = clips;
        return () => {
            voiceClipsRef.current = {};
        };
    }, [options.lang]);

    useEffect(() => {
        const initializeAudio = () => {
            if (audioContextRef.current) return;

            const AudioContextCtor =
                window.AudioContext ||
                (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextCtor) return;

            const context = new AudioContextCtor();
            const masterGain = context.createGain();
            masterGain.gain.value = 0.12;
            masterGain.connect(context.destination);

            audioContextRef.current = context;
            masterGainRef.current = masterGain;
        };

        const unlockAudio = () => {
            initializeAudio();
            if (audioContextRef.current?.state === "suspended") {
                void audioContextRef.current.resume();
            }
        };

        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });

        return () => {
            window.removeEventListener("pointerdown", unlockAudio);
            window.removeEventListener("keydown", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
            window.speechSynthesis?.cancel();

            if (audioContextRef.current) {
                void audioContextRef.current.close();
                audioContextRef.current = null;
                masterGainRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const initializeAudio = () => {
            if (audioContextRef.current) return;

            const AudioContextCtor =
                window.AudioContext ||
                (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
            if (!AudioContextCtor) return;

            const context = new AudioContextCtor();
            const masterGain = context.createGain();
            masterGain.gain.value = 0.12;
            masterGain.connect(context.destination);

            audioContextRef.current = context;
            masterGainRef.current = masterGain;
        };

        const playPhaseFeedback = (activePhase: Phase) => {
            if (options.vibe && navigator.vibrate) {
                const pattern = activePhase === "I" ? [70] : activePhase === "E" ? [35, 35, 35] : [110];
                navigator.vibrate(pattern);
            }

            if (options.sound) {
                initializeAudio();

                if (audioContextRef.current && masterGainRef.current) {
                    const context = audioContextRef.current;

                    if (context.state === "suspended") {
                        void context.resume();
                    }

                    const now = context.currentTime;
                    const oscillator = context.createOscillator();
                    const gain = context.createGain();
                    const frequency = activePhase === "I" ? 440 : activePhase === "E" ? 330 : 262;

                    oscillator.type = activePhase === "H" ? "triangle" : "sine";
                    oscillator.frequency.setValueAtTime(frequency, now);

                    gain.gain.setValueAtTime(0, now);
                    gain.gain.linearRampToValueAtTime(0.34, now + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.46);

                    oscillator.connect(gain);
                    gain.connect(masterGainRef.current);
                    oscillator.start(now);
                    oscillator.stop(now + 0.5);
                }
            }

            if (options.tts) {
                // Sintetizador del navegador (respaldo para idiomas sin clip o si el clip falla)
                const speakFallback = () => {
                    if (!("speechSynthesis" in window)) return;
                    const label = activePhase === "I" ? options.labels.inspire : activePhase === "E" ? options.labels.exhale : options.labels.hold;
                    const utterance = new SpeechSynthesisUtterance(label);
                    const voices = window.speechSynthesis.getVoices();
                    const targetLocale = speechLocaleMap[options.lang];
                    const matchingVoice = voices.find((voice) => voice.lang === targetLocale) ?? voices.find((voice) => voice.lang.startsWith(targetLocale.split("-")[0]));

                    utterance.lang = targetLocale;
                    utterance.rate = 0.88;
                    utterance.pitch = activePhase === "I" ? 1.05 : activePhase === "E" ? 0.95 : 1;
                    utterance.volume = 0.9;
                    if (matchingVoice) utterance.voice = matchingVoice;

                    window.speechSynthesis.cancel();
                    window.speechSynthesis.speak(utterance);
                };

                // Preferencia: clip de voz neural pregrabado; si no hay o falla, respaldo
                const clip = voiceClipsRef.current[activePhase];
                if (clip) {
                    window.speechSynthesis?.cancel();
                    // Cortar cualquier clip previo para evitar solapes a ritmos rápidos
                    Object.values(voiceClipsRef.current).forEach((other) => {
                        if (other && other !== clip) other.pause();
                    });
                    clip.currentTime = 0;
                    const playPromise = clip.play();
                    if (playPromise) playPromise.catch(() => speakFallback());
                } else {
                    speakFallback();
                }
            }
        };

        if (!isPlaying) {
            lastPhaseRef.current = phase;
            lastFeedbackSignatureRef.current = "";
            wasPlayingRef.current = false;
            window.speechSynthesis?.cancel();
            return;
        }

        const activeSupports = [
            options.sound ? "sound" : "",
            options.vibe ? "vibe" : "",
            options.tts ? "tts" : "",
        ].filter(Boolean).join(":");
        const feedbackSignature = `${phase}:${activeSupports}:${options.lang}`;

        if (!wasPlayingRef.current || lastPhaseRef.current !== phase || lastFeedbackSignatureRef.current !== feedbackSignature) {
            wasPlayingRef.current = true;
            lastPhaseRef.current = phase;
            lastFeedbackSignatureRef.current = feedbackSignature;
            playPhaseFeedback(phase);
        }
    }, [isPlaying, options.labels.exhale, options.labels.hold, options.labels.inspire, options.lang, options.sound, options.tts, options.vibe, phase]);
}
