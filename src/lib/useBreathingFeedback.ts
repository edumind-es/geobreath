"use client";

import { useEffect, useRef } from 'react';
import { Phase } from './geoLogic';

// Types
type SoundType = 'sine' | 'triangle';

export function useBreathingFeedback(
    phase: Phase,
    isPlaying: boolean,
    enabled: { sound: boolean; vibe: boolean; tts: boolean }
) {
    const audioCtxRef = useRef<AudioContext | null>(null);
    const masterGainRef = useRef<GainNode | null>(null);

    // Initialize Audio Logic
    useEffect(() => {
        const initAudio = () => {
            if (!audioCtxRef.current) {
                const AC = (window.AudioContext || (window as any).webkitAudioContext);
                if (AC) {
                    const ctx = new AC();
                    const master = ctx.createGain();
                    master.gain.value = 0.12;
                    master.connect(ctx.destination);

                    audioCtxRef.current = ctx;
                    masterGainRef.current = master;
                }
            }
        };

        // Unlock on interaction
        const unlock = () => {
            if (audioCtxRef.current?.state === 'suspended') {
                audioCtxRef.current.resume();
            } else {
                initAudio();
            }
        };

        window.addEventListener('click', unlock, { once: true });
        window.addEventListener('touchstart', unlock, { once: true });

        return () => {
            // cleanup if needed
        };
    }, []);

    // Trigger Effects on Phase Change
    useEffect(() => {
        if (!isPlaying) return;

        // 1. Vibration
        if (enabled.vibe && navigator.vibrate) {
            navigator.vibrate(50);
        }

        // 2. Sound (Beeps)
        if (enabled.sound && audioCtxRef.current && masterGainRef.current) {
            const ctx = audioCtxRef.current;
            if (ctx.state === 'suspended') ctx.resume();

            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const g = ctx.createGain();

            // Notes: I=Sol4(392), E=Mi4(330), H=Do4(262)
            const freq = phase === 'I' ? 392 : phase === 'E' ? 330 : 262;

            osc.type = 'sine';
            osc.frequency.value = freq;

            // Envelope
            g.gain.setValueAtTime(0, now);
            g.gain.linearRampToValueAtTime(0.3, now + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

            osc.connect(g);
            g.connect(masterGainRef.current);
            osc.start(now);
            osc.stop(now + 0.5);
        }

        // 3. TTS (Text to Speech)
        if (enabled.tts && 'speechSynthesis' in window) {
            const text = phase === 'I' ? 'Inspira' : phase === 'E' ? 'Exhala' : 'Aguanta';
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'es-ES'; // Force Spanish for now for distribution
            u.rate = 0.9;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(u);
        }

    }, [phase, isPlaying, enabled]);
}
