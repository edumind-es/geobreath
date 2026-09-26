/*
 * Copyright (C) 2024-2026 Luis Vilela Acuña <contacto@edumind.es>
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import { useEffect, useRef } from "react";
import type { AppTranslations } from "@/lib/i18n";

interface FaqDialogProps {
    t: AppTranslations;
    onClose: () => void;
}

// Fórmula de atribución exigida por la licencia de los pictogramas ARASAAC.
const ARASAAC_ATTRIBUTION =
    "Autor pictogramas: Sergio Palao. Origen: ARASAAC (http://www.arasaac.org). Licencia: CC BY-NC-SA. Propiedad: Gobierno de Aragón (España)";

// Modal de ayuda — lámina papel/tinta
export default function FaqDialog({ t, onClose }: FaqDialogProps) {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Accesibilidad: al abrir, el foco entra en el diálogo (botón Cerrar);
    // al cerrar, vuelve al elemento que lo abrió (el botón de ayuda).
    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        closeButtonRef.current?.focus();
        return () => {
            previouslyFocused?.focus?.();
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            role="presentation"
            onClick={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="faq-title"
                className="w-full max-w-2xl overflow-hidden rounded-2xl border-2 border-rule-strong bg-paper shadow-[0_32px_90px_rgba(28,26,22,0.28)]"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b-2 border-rule-strong p-6">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">{t.help}</p>
                        <h2 id="faq-title" className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
                            {t.faqTitle}
                        </h2>
                    </div>
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={onClose}
                        className="lm-btn-ghost h-11 w-11 !p-0 text-xl"
                        aria-label={t.close}
                    >
                        <span className="leading-none">×</span>
                    </button>
                </div>

                <div className="max-h-[70vh] space-y-3 overflow-y-auto p-6">
                    {t.faq.map((item) => (
                        <article key={item.q} className="border-t border-rule pt-3">
                            <h3 className="font-display text-lg font-semibold text-ink">{item.q}</h3>
                            <p className="mt-1 text-sm leading-7 text-ink-2">{item.a}</p>
                        </article>
                    ))}

                    {/* Créditos del material ajeno y referencia científica.
                        La fórmula de ARASAAC es la que exige su licencia, por eso no se traduce. */}
                    <section className="border-t border-rule pt-3" aria-labelledby="faq-credits">
                        <h3 id="faq-credits" className="font-display text-lg font-semibold text-ink">{t.credits}</h3>
                        <p className="mt-1 text-sm leading-6 text-ink-2">
                            {ARASAAC_ATTRIBUTION}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-2">{t.creditsVoice}</p>
                        <p className="mt-1 text-sm leading-6 text-ink-2">
                            {t.creditsReference}{" "}
                            <a
                                href="https://doi.org/10.1016/j.xcrm.2022.100895"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-mental-deep"
                            >
                                Balban et al. (2023), <em>Cell Reports Medicine</em>, 4(1), 100895. doi:10.1016/j.xcrm.2022.100895
                            </a>
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-2">
                            <a
                                href="https://github.com/edumind-es/geobreath/blob/main/CREDITS.md"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-mental-deep"
                            >
                                CREDITS.md
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
