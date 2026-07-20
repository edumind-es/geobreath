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

import "../styles/lamina-v1.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, Poppins, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import EDUmindFooter from "../components/EDUmindFooter";
import PWARegister from "../components/PWARegister";

// Fuentes del sistema «lámina» EDUmind (cargadas por next/font, sin dependencias)
const display = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--f-display",
    display: "swap",
});

const body = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--f-body",
    display: "swap",
});

const mono = IBM_Plex_Mono({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    variable: "--f-mono",
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#e9e6dd",
};

export const metadata: Metadata = {
    metadataBase: new URL("https://breath.edumind.es"),
    applicationName: "GeoBreath",
    title: {
        default: "GeoBreath | Respiracion geometrica guiada",
        template: "%s | GeoBreath",
    },
    description: "App de respiracion guiada con secuencias geometricas, enfoque visual y apoyos sensoriales opcionales.",
    keywords: ["respiracion guiada", "mindfulness", "focus", "geo breathing", "educacion emocional", "EDUmind"],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "GeoBreath",
    },
    icons: {
        icon: "/logo_geobreath.png",
        apple: "/logo_geobreath.png",
    },
    openGraph: {
        title: "GeoBreath",
        description: "Respiracion geometrica guiada para sesiones cortas de foco y regulacion.",
        url: "https://breath.edumind.es",
        siteName: "GeoBreath",
        locale: "es_ES",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
                {/* Identidad Sistema Lámina (nivel 1): barra de mundos EDUmind */}
                <div className="lm-plate-top lm-plate-top--compact" aria-hidden="true">
                    <i /><i /><i /><i /><i />
                </div>
                {children}
                <PWARegister />
                <EDUmindFooter
                    appName="GeoBreath"
                    version="2.0.0"
                    versionStage="Stable"
                    feedbackUrl="https://github.com/edumind-es/geobreath/issues"
                    homeHref="/"
                    locale="es"
                    hideNavigation
                />

                <Script id="matomo-tracking" strategy="afterInteractive">
                    {`
                        var _paq = window._paq = window._paq || [];
                        _paq.push(['disableCookies']);
                        _paq.push(['setDoNotTrack', true]);
                        _paq.push(['trackPageView']);
                        _paq.push(['enableLinkTracking']);
                        (function() {
                            var u = 'https://analytics.losmundosedufis.com/';
                            _paq.push(['setTrackerUrl', u + 'matomo.php']);
                            _paq.push(['setSiteId', '12']);
                            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
                            g.async = true; g.src = u + 'matomo.js';
                            s.parentNode.insertBefore(g, s);
                        })();
                    `}
                </Script>
            </body>
        </html>
    );
}
