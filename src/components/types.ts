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

export interface NavigationLink {
    href: string;
    label?: string;
}

export interface EDUmindFooterProps {
    // App identification
    appName: string;
    version: string;
    versionStage?: 'Alpha' | 'Beta' | 'Stable' | 'RC';
    author?: string;
    year?: number;

    // Navigation
    previousPage?: NavigationLink;
    nextPage?: NavigationLink;
    homeHref?: string;

    // Feedback
    feedbackUrl?: string;
    feedbackLabel?: string;

    // Customization
    className?: string;
    showBreadcrumbs?: boolean;
    locale?: 'es' | 'en' | 'zh';

    // Display options
    hideNavigation?: boolean;
    showVersion?: boolean;
}

export interface FooterTranslations {
    previous: string;
    next: string;
    copyright: string;
    feedback: string;
    home: string;
}
