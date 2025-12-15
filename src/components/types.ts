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
