/*
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuna
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

import "./EDUmindFooter.css";

interface NavigationLink {
    href: string;
    label?: string;
}

interface EDUmindFooterProps {
    appName: string;
    version: string;
    versionStage?: "Alpha" | "Beta" | "Stable" | "RC";
    author?: string;
    year?: number;
    previousPage?: NavigationLink;
    nextPage?: NavigationLink;
    homeHref?: string;
    feedbackUrl?: string;
    feedbackLabel?: string;
    className?: string;
    locale?: "es" | "en" | "zh";
    hideNavigation?: boolean;
    showVersion?: boolean;
}

interface FooterTranslations {
    previous: string;
    next: string;
    copyright: string;
    feedback: string;
    home: string;
    legal: string;
    social: string;
}

const translations: Record<string, FooterTranslations> = {
    es: {
        previous: "Anterior",
        next: "Siguiente",
        copyright: "© {year} EDUmind por",
        feedback: "Reportar incidencia",
        home: "Inicio",
        legal: "Legal",
        social: "Comunidad",
    },
    en: {
        previous: "Previous",
        next: "Next",
        copyright: "© {year} EDUmind by",
        feedback: "Report issue",
        home: "Home",
        legal: "Legal",
        social: "Community",
    },
    zh: {
        previous: "上一页",
        next: "下一页",
        copyright: "© {year} EDUmind 由",
        feedback: "反馈问题",
        home: "首页",
        legal: "法律",
        social: "社区",
    },
};

const legalLinks = [
    { href: "https://edumind.es/es/legal/privacidad", label: "Privacidad" },
    { href: "https://edumind.es/es/legal/cookies", label: "Cookies" },
    { href: "https://edumind.es/es/legal/terminos", label: "Términos" },
    { href: "https://edumind.es/es/legal/ia", label: "Política de IA" },
    { href: "https://edumind.es/es/legal/arco", label: "ARCO" },
];

const socialLinks = [
    { href: "https://t.me/EDUmind_es", label: "Telegram" },
    { href: "https://instagram.com/edumind_es", label: "Instagram" },
    { href: "https://x.com/edumind_es", label: "X" },
    { href: "https://mastodon.social/@EDUmind", label: "Mastodon" },
    { href: "https://blog.edumind.es", label: "Blog" },
];

export default function EDUmindFooter({
    appName,
    version,
    versionStage,
    author = "EDUmind Team",
    year = new Date().getFullYear(),
    previousPage,
    nextPage,
    homeHref,
    feedbackUrl,
    feedbackLabel,
    className = "",
    locale = "es",
    hideNavigation = false,
    showVersion = true,
}: EDUmindFooterProps) {
    const t = translations[locale] ?? translations.es;
    const versionBadge = versionStage ? `v${version} · ${versionStage}` : `v${version}`;

    return (
        <footer className={`edumind-footer ${className}`}>
            <div className="footer-brand">
                <div className="footer-app-row">
                    <span className="footer-app-name">{appName}</span>
                    {showVersion ? <span className="footer-badge">{versionBadge}</span> : null}
                </div>
                <p className="footer-copy">
                    {t.copyright.replace("{year}", year.toString())} <strong>{author}</strong>
                </p>
            </div>

            {!hideNavigation && (previousPage || nextPage || homeHref) ? (
                <nav className="footer-nav" aria-label="Footer navigation">
                    {previousPage ? (
                        <a href={previousPage.href} className="footer-link">
                            {previousPage.label ?? t.previous}
                        </a>
                    ) : null}
                    {homeHref ? (
                        <a href={homeHref} className="footer-link">
                            {t.home}
                        </a>
                    ) : null}
                    {nextPage ? (
                        <a href={nextPage.href} className="footer-link">
                            {nextPage.label ?? t.next}
                        </a>
                    ) : null}
                </nav>
            ) : null}

            <div className="footer-link-groups">
                <div className="footer-group">
                    <span className="footer-group-title">{t.legal}</span>
                    <div className="footer-group-links">
                        {legalLinks.map((link) => (
                            <a key={link.href} href={link.href} className="footer-link" target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="footer-group">
                    <span className="footer-group-title">{t.social}</span>
                    <div className="footer-group-links">
                        {socialLinks.map((link) => (
                            <a key={link.href} href={link.href} className="footer-link" target="_blank" rel="noopener noreferrer">
                                {link.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div className="footer-actions">
                {feedbackUrl ? (
                    <a href={feedbackUrl} className="footer-action" target="_blank" rel="noopener noreferrer">
                        {feedbackLabel ?? t.feedback}
                    </a>
                ) : null}
            </div>
        </footer>
    );
}
