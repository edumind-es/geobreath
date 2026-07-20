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

import Image from "next/image";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { LANGUAGE_OPTIONS } from "../lib/breathing";
import type { BreathingSession } from "../hooks/useBreathingSession";

// Tarjeta de marca + selector de idioma + acceso EDUmind
export default function BrandCard({ session }: { session: BreathingSession }) {
    const { t, lang, setLang } = session;

    return (
        <section className="rounded-2xl border border-rule bg-paper-2 p-5">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-rule bg-paper">
                    <Image src="/logo_geobreath.png" alt="GeoBreath" width={56} height={49} priority className="h-auto w-12 object-contain" />
                </div>
                <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">Sistema · EDUmind</p>
                    <h2 className="mt-1 font-display text-2xl font-bold text-ink">GeoBreath</h2>
                    <p className="mt-1 text-sm leading-6 text-ink-2">{t.tagline}</p>
                </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Idioma">
                {LANGUAGE_OPTIONS.map((language) => (
                    <button
                        key={language}
                        type="button"
                        onClick={() => setLang(language)}
                        aria-pressed={lang === language}
                        className={`rounded-md border px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] transition-colors ${
                            lang === language
                                ? "border-mental/60 bg-mental/10 text-mental-deep"
                                : "border-rule bg-paper text-ink-2 hover:border-ink-3 hover:text-ink"
                        }`}
                    >
                        {language}
                    </button>
                ))}
            </div>

            <Link href="/app" className="lm-btn-ghost mt-5 h-12 w-full" aria-label="Acceder con cuenta EDUmind">
                <LogIn size={18} />
                Acceso EDUmind
            </Link>
        </section>
    );
}
