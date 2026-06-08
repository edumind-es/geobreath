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
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                            active
                                ? "border-teal-300/40 bg-teal-300/12 text-slate-50"
                                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/[0.08]"
                        }`}
                    >
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white/10 text-teal-100" : "bg-black/20 text-slate-400"}`}>
                            <Icon size={18} />
                        </span>
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}
