"use client";
/*
 * CANONICAL VERSION — @edumind/footer v1.0.0 (vendorizado)
 * Copyright (C) 2024-2025 EDUmind - Los Mundos Edufis
 * Author: Luis Vilela Acuña <contacto@edumind.es>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * EDUmind® es una marca registrada en España (OEPM), titularidad de
 * Luis Vilela Acuña. El software puede distribuirse bajo licencias
 * open-source, pero el uso de la marca EDUmind® requiere autorización.
 *
 * Copia fiel de /var/www/edumind-footer (fuente canónica). Se vendoriza
 * porque el paquete publicado @edumind/footer no incluye su CSS. Los colores
 * se armonizan con la lámina EDUmind vía variables --footer-* en globals.css.
 */

import { useEffect, useMemo, useState, type MouseEvent } from "react";
import "./EDUmindFooter.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface NavigationLink {
    href: string;
    label?: string;
}

export type FooterLocale = "es" | "en" | "gl";
export type FooterDensity = "full" | "compact";
export type VersionStage = "Alpha" | "Beta" | "RC" | "Stable";

export interface EDUmindFooterProps {
    /** Nombre de la app que muestra el footer */
    appName: string;
    /** Versión semver, ej: "2.1.0" */
    version: string;
    /** Fase de desarrollo */
    versionStage?: VersionStage;
    /** Autor mostrado en copyright. Default: 'Luis Vilela Acuña' */
    author?: string;
    /** Año copyright. Default: año actual */
    year?: number;
    /** Enlace página anterior (navegación secuencial) */
    previousPage?: NavigationLink;
    /** Enlace página siguiente */
    nextPage?: NavigationLink;
    /** Enlace inicio de la app */
    homeHref?: string;
    /** URL para reportar errores. Default: mailto:contacto@edumind.es */
    feedbackUrl?: string;
    /** Etiqueta personalizada para el enlace de feedback */
    feedbackLabel?: string;
    /** Clase CSS adicional para el footer */
    className?: string;
    /** Idioma del footer: 'es' | 'en' | 'gl' */
    locale?: FooterLocale;
    /** Ocultar navegación anterior/siguiente */
    hideNavigation?: boolean;
    /** Mostrar badge de versión */
    showVersion?: boolean;
    /** 'full' muestra todo | 'compact' solo info esencial */
    density?: FooterDensity;
    /** Mostrar enlaces a redes sociales EDUmind */
    showSocial?: boolean;
    /** Mostrar bloque legal completo (marca registrada) */
    showLegal?: boolean;
}

// ─── Traducciones ─────────────────────────────────────────────────────────────

interface FooterTranslations {
    previous: string;
    next: string;
    copyright: string;
    feedback: string;
    updateApp: string;
    updatingApp: string;
    home: string;
    legal: string;
    version: string;
    appId: string;
    technicalVersion: string;
    trademark: string;
    privacy: string;
    legalNotice: string;
    cookies: string;
    aiPolicy: string;
    support: string;
    proposeActivity: string;
    openSource: string;
    sourceCode: string;
}

const translations: Record<FooterLocale, FooterTranslations> = {
    es: {
        previous: "Anterior",
        next: "Siguiente",
        copyright: "© {year} EDUmind® por",
        feedback: "Reportar incidencia",
        updateApp: "Actualizar app",
        updatingApp: "Actualizando...",
        home: "Inicio",
        legal: "Legal y privacidad",
        version: "Versión",
        appId: "App",
        technicalVersion: "Versión técnica",
        trademark: "EDUmind® es una marca registrada en España (OEPM), titularidad de Luis Vilela Acuña. El uso de la marca requiere autorización.",
        privacy: "Privacidad",
        legalNotice: "Aviso legal",
        cookies: "Cookies",
        aiPolicy: "IA y desarrollo",
        support: "💚 Apoyar",
        proposeActivity: "Proponer actividad",
        openSource: "Software libre con licencia",
        sourceCode: "Código fuente en GitHub",
    },
    en: {
        previous: "Previous",
        next: "Next",
        copyright: "© {year} EDUmind® by",
        feedback: "Report issue",
        updateApp: "Update app",
        updatingApp: "Updating...",
        home: "Home",
        legal: "Legal & privacy",
        version: "Version",
        appId: "App",
        technicalVersion: "Technical version",
        trademark: "EDUmind® is a registered trademark in Spain (OEPM), owned by Luis Vilela Acuña. Use of the trademark requires authorization.",
        privacy: "Privacy",
        legalNotice: "Legal notice",
        cookies: "Cookies",
        aiPolicy: "AI & development",
        support: "💚 Support",
        proposeActivity: "Propose activity",
        openSource: "Free software licensed under",
        sourceCode: "Source code on GitHub",
    },
    gl: {
        previous: "Anterior",
        next: "Seguinte",
        copyright: "© {year} EDUmind® por",
        feedback: "Reportar incidencia",
        updateApp: "Actualizar app",
        updatingApp: "Actualizando...",
        home: "Inicio",
        legal: "Legal e privacidade",
        version: "Versión",
        appId: "App",
        technicalVersion: "Versión técnica",
        trademark: "EDUmind® é unha marca rexistrada en España (OEPM), titularidade de Luis Vilela Acuña. O uso da marca require autorización.",
        privacy: "Privacidade",
        legalNotice: "Aviso legal",
        cookies: "Cookies",
        aiPolicy: "IA e desenvolvemento",
        support: "💚 Apoiar",
        proposeActivity: "Propoñer actividade",
        openSource: "Software libre con licenza",
        sourceCode: "Código fonte en GitHub",
    },
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EDUmindFooter({
    appName,
    version,
    versionStage,
    author = "Luis Vilela Acuña",
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
    density = "full",
    showSocial = true,
    showLegal = true,
}: EDUmindFooterProps) {
    const t = translations[locale];
    const [isUpdatingApp, setIsUpdatingApp] = useState(false);
    const [canManuallyUpdate, setCanManuallyUpdate] = useState(false);

    // Versión visible (sin metadata de build) y versión técnica completa
    const visibleVersion = version.split("+")[0] ?? version;
    const technicalVersion = versionStage ? `v${version} (${versionStage})` : `v${version}`;
    const versionBadge = versionStage ? `v${visibleVersion} · ${versionStage}` : `v${visibleVersion}`;

    // URL de feedback con fallback a email
    const resolvedFeedbackUrl = useMemo(() => {
        const candidate = feedbackUrl?.trim();
        return candidate && candidate.length > 0 ? candidate : "mailto:contacto@edumind.es";
    }, [feedbackUrl]);

    const feedbackLinkProps = resolvedFeedbackUrl.startsWith("mailto:")
        ? {}
        : { target: "_blank" as const, rel: "noopener noreferrer" };

    // Detectar soporte PWA para el botón de actualización
    useEffect(() => {
        setCanManuallyUpdate(
            typeof window !== "undefined" && typeof navigator !== "undefined" && "serviceWorker" in navigator,
        );
    }, []);

    const handleManualAppUpdate = async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        if (isUpdatingApp) return;
        setIsUpdatingApp(true);
        const now = Date.now();
        try {
            if ("serviceWorker" in navigator) {
                const registrations = await navigator.serviceWorker.getRegistrations();
                await Promise.all(
                    registrations.map(async (reg) => {
                        try {
                            await reg.update();
                        } catch {
                            // Ignorar errores de update individual
                        }
                        reg.waiting?.postMessage({ type: "SKIP_WAITING" });
                    }),
                );
            }
        } finally {
            const url = new URL(window.location.href);
            url.searchParams.set("app_update", String(now));
            window.location.replace(url.toString());
        }
    };

    const compact = density === "compact";
    const hasNav = !hideNavigation && (!!previousPage || !!nextPage || !!homeHref);

    return (
        <footer
            className={["edumind-footer", compact ? "edumind-footer--compact" : "", className].filter(Boolean).join(" ")}
            aria-label={`Footer ${appName}`}
        >
            {/* ── Navegación secuencial ── */}
            {hasNav && (
                <nav className="edumind-footer__nav" aria-label="Navegación de contenido">
                    {previousPage && (
                        <a href={previousPage.href} className="edumind-footer__nav-btn edumind-footer__nav-btn--prev">
                            ← {previousPage.label ?? t.previous}
                        </a>
                    )}
                    {homeHref && (
                        <a href={homeHref} className="edumind-footer__nav-btn edumind-footer__nav-btn--home">
                            {t.home}
                        </a>
                    )}
                    {nextPage && (
                        <a href={nextPage.href} className="edumind-footer__nav-btn edumind-footer__nav-btn--next">
                            {nextPage.label ?? t.next} →
                        </a>
                    )}
                </nav>
            )}

            {/* ── Bloque principal ── */}
            <div className="edumind-footer__main">
                <div className="edumind-footer__info">
                    <p className="edumind-footer__app-name">
                        <strong>{appName}</strong>
                    </p>
                    <p className="edumind-footer__copyright">
                        {t.copyright.replace("{year}", String(year))} <strong>{author}</strong>
                    </p>
                    <p className="edumind-footer__license" style={{ margin: "0.15rem 0 0", fontSize: "0.8rem" }}>
                        {t.openSource}{" "}
                        <a href="https://www.gnu.org/licenses/agpl-3.0.html" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                            AGPL-3.0-or-later
                        </a>
                        {" / "}
                        <a href="https://eupl.eu/1.2/es/" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                            EUPL-1.2
                        </a>
                        <span aria-hidden="true"> · </span>
                        <a href="https://github.com/edumind-es/geobreath" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
                            {t.sourceCode}
                        </a>
                    </p>
                    {showVersion && (
                        <p
                            className="edumind-footer__version-inline"
                            title={`${t.technicalVersion}: ${technicalVersion}`}
                            aria-label={`${t.appId} ${appName}. ${t.technicalVersion} ${technicalVersion}`}
                        >
                            <span className="edumind-footer__version-label">{t.appId}</span>
                            <span className="edumind-footer__version-value">{appName}</span>
                        </p>
                    )}
                </div>

                {/* ── Enlaces legales y sociales ── */}
                <div className="edumind-footer__links">
                    <div className="edumind-footer__legal-links" aria-label={t.legal}>
                        <a href="https://edumind.es/es/legal/privacidad" target="_blank" rel="noopener noreferrer">
                            {t.privacy}
                        </a>
                        <span aria-hidden="true">·</span>
                        <a href="https://edumind.es/es/legal" target="_blank" rel="noopener noreferrer">
                            {t.legalNotice}
                        </a>
                        <span aria-hidden="true">·</span>
                        <a href="https://edumind.es/es/legal/cookies" target="_blank" rel="noopener noreferrer">
                            {t.cookies}
                        </a>
                        <span aria-hidden="true">·</span>
                        <a href="https://edumind.es/es/legal/ia" target="_blank" rel="noopener noreferrer">
                            {t.aiPolicy}
                        </a>
                        <span aria-hidden="true">·</span>
                        <a
                            href="https://donar.edumind.es"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="edumind-footer__support-link"
                        >
                            {t.support}
                        </a>
                    </div>

                    {showSocial && !compact && (
                        <div className="edumind-footer__social" aria-label="Comunidad EDUmind">
                            <a href="https://t.me/EDUmind_es" target="_blank" rel="noopener noreferrer">
                                Telegram
                            </a>
                            <a href="https://instagram.com/edumind_es" target="_blank" rel="noopener noreferrer">
                                Instagram
                            </a>
                            <a href="https://x.com/edumind_es" target="_blank" rel="noopener noreferrer">
                                X
                            </a>
                            <a href="https://mastodon.social/@EDUmind" target="_blank" rel="noopener noreferrer">
                                Mastodon
                            </a>
                            <a href="https://blog.edumind.es" target="_blank" rel="noopener noreferrer">
                                Blog
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Bloque marca registrada (showLegal) ── */}
            {showLegal && !compact && (
                <div className="edumind-footer__trademark">
                    <p>
                        {t.trademark}{" "}
                        <a href="mailto:contacto@edumind.es" className="edumind-footer__trademark-link">
                            contacto@edumind.es
                        </a>
                        {" · "}
                        <a
                            href="https://edumind.es/es/legal"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="edumind-footer__trademark-link"
                        >
                            Legal
                        </a>
                        {" · "}
                        <a
                            href="https://edumind.es/es/legal/ia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="edumind-footer__trademark-link"
                        >
                            Política de IA
                        </a>
                    </p>
                </div>
            )}

            {/* ── Meta: versión + PWA update + feedback ── */}
            <div className="edumind-footer__meta">
                {showVersion && (
                    <span className="edumind-footer__version-badge" title={`${t.technicalVersion}: ${technicalVersion}`}>
                        {versionBadge}
                    </span>
                )}
                {canManuallyUpdate && (
                    <a
                        href="#actualizar-app"
                        className="edumind-footer__action-link"
                        aria-label={isUpdatingApp ? t.updatingApp : t.updateApp}
                        onClick={handleManualAppUpdate}
                    >
                        {isUpdatingApp ? t.updatingApp : t.updateApp}
                    </a>
                )}
                {resolvedFeedbackUrl && (
                    <a
                        href={resolvedFeedbackUrl}
                        className="edumind-footer__action-link"
                        aria-label={feedbackLabel ?? t.feedback}
                        {...feedbackLinkProps}
                    >
                        {feedbackLabel ?? t.feedback}
                    </a>
                )}
            </div>
        </footer>
    );
}
