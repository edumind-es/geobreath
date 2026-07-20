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

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ActivitySquare, BookOpenText, CircleUserRound, History } from "lucide-react";

const navItems = [
    {
        href: "/app",
        label: "Resumen",
        icon: ActivitySquare,
    },
    {
        href: "/app/library",
        label: "Biblioteca",
        icon: BookOpenText,
    },
    {
        href: "/app/history",
        label: "Historial",
        icon: History,
    },
    {
        href: "/app/account",
        label: "Cuenta",
        icon: CircleUserRound,
    },
];

export default function PremiumNavigation() {
    const pathname = usePathname();

    return (
        <nav className="grid gap-2" aria-label="Premium navigation">
            {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-semibold transition-colors ${
                            active
                                ? "border-mental/60 bg-mental/10 text-ink"
                                : "border-rule bg-paper text-ink-2 hover:border-ink-3 hover:text-ink"
                        }`}
                    >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-md ${active ? "bg-mental/15 text-mental-deep" : "bg-black/[0.04] text-ink-3"}`}>
                            <Icon size={18} />
                        </span>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
