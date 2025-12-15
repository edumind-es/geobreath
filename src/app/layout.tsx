import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import EDUmindFooter from '../components/EDUmindFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'GeoBreath 2.0',
    description: 'Respiración geométrica guiada - EDUmind',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
                <EDUmindFooter
                    appName="GeoBreath"
                    version="2.0.0"
                    versionStage="Stable"
                    feedbackUrl="https://github.com/edumind-es/geobreath/issues"
                    homeHref="/"
                    locale="es"
                    hideNavigation={true}
                />
            </body>
        </html>
    )
}
