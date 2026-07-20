/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 */

import type { AppTranslations } from "@/lib/i18n";

interface FaqDialogProps {
    t: AppTranslations;
    onClose: () => void;
}

// Modal de ayuda — lámina papel/tinta
export default function FaqDialog({ t, onClose }: FaqDialogProps) {
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
                </div>
            </div>
        </div>
    );
}
