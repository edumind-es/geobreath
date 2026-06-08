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

import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import EDUmindFooter from "../components/EDUmindFooter";
import PWARegister from "../components/PWARegister";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-body",
});

const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-display",
});

export const viewport: Viewport = {
    themeColor: "#020617",
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
            <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
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
