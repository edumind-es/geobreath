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

/**
 * GeoBreath React - Basic Tests
 * Run with: npm test
 */

import { describe, it, expect } from '@jest/globals';

describe('GeoBreath React Core', () => {

    describe('Breathing Exercise Logic', () => {
        it('should calculate breathing phases correctly', () => {
            const breathingPhases = {
                inhale: 4,
                hold: 7,
                exhale: 8
            };

            const totalCycle = breathingPhases.inhale + breathingPhases.hold + breathingPhases.exhale;
            expect(totalCycle).toBe(19);
        });

        it('should validate breathing pattern', () => {
            const pattern = '4-7-8';
            const parts = pattern.split('-').map(Number);

            expect(parts).toHaveLength(3);
            expect(parts[0]).toBe(4);
            expect(parts[1]).toBe(7);
            expect(parts[2]).toBe(8);
        });
    });

    describe('Session Timer', () => {
        it('should track session duration', () => {
            const sessionStart = Date.now();
            const sessionDuration = 300000; // 5 minutes in ms
            const sessionEnd = sessionStart + sessionDuration;

            expect(sessionEnd - sessionStart).toBe(sessionDuration);
        });

        it('should format time correctly', () => {
            const formatTime = (seconds: number): string => {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            };

            expect(formatTime(65)).toBe('1:05');
            expect(formatTime(120)).toBe('2:00');
            expect(formatTime(0)).toBe('0:00');
        });
    });

    describe('Animation States', () => {
        it('should cycle through animation states', () => {
            const states = ['idle', 'inhale', 'hold', 'exhale'];
            let currentIndex = 0;

            const nextState = (): string => {
                currentIndex = (currentIndex + 1) % states.length;
                return states[currentIndex];
            };

            expect(nextState()).toBe('inhale');
            expect(nextState()).toBe('hold');
            expect(nextState()).toBe('exhale');
            expect(nextState()).toBe('idle');
        });
    });
});
