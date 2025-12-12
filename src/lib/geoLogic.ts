export type Phase = 'I' | 'E' | 'H';

export function geoBreathSequence(n: number, startFlag: string = 'I'): Phase[] {
    // Validate n parameter
    if (typeof n !== 'number' || isNaN(n) || n < 2) {
        console.warn(`Invalid n value: ${n}, defaulting to 3`);
        n = 3;
    }

    const variantB = (startFlag === 'H' || startFlag === 'E');

    if (n === 2) return ['I', 'E'];
    if (n === 3) return variantB ? ['I', 'H', 'E'] : ['I', 'E', 'H'];
    if (n === 4) return ['I', 'H', 'E', 'H'];
    if (n === 5) return variantB ? ['I', 'H', 'E', 'E', 'H'] : ['I', 'I', 'H', 'E', 'H'];

    if (n >= 6) {
        let Icnt, Ecnt;
        if (n % 2 === 0) {
            Icnt = Ecnt = (n / 2) - 1;
        } else {
            Icnt = (n - 1) / 2;
            Ecnt = (n - 3) / 2;
            if (variantB && Icnt > 1) {
                Icnt -= 1; Ecnt += 1;
            }
        }
        const seq: Phase[] = [];
        for (let i = 0; i < Icnt; i++) seq.push('I');
        seq.push('H');
        for (let i = 0; i < Ecnt; i++) seq.push('E');
        seq.push('H');
        return seq;
    }
    return ['I', 'E', 'H'];
}

export function getPolygonPoints(n: number, cx: number, cy: number, R: number): [number, number][] {
    // Validate n parameter
    if (typeof n !== 'number' || isNaN(n) || n < 2) {
        console.warn(`Invalid n value in getPolygonPoints: ${n}, defaulting to 3`);
        n = 3;
    }

    const pts: [number, number][] = [];
    const start = -Math.PI / 2;
    for (let i = 0; i < n; i++) {
        const a = start + i * 2 * Math.PI / n;
        pts.push([cx + R * Math.cos(a), cy + R * Math.sin(a)]);
    }
    return pts;
}

export function getPointOnTrail(n: number, idx: number, t: number, cx: number, cy: number, R: number): [number, number] {
    // Validate n parameter
    if (typeof n !== 'number' || isNaN(n) || n < 2) {
        console.warn(`Invalid n value in getPointOnTrail: ${n}, defaulting to 3`);
        n = 3;
    }

    // Validate idx parameter
    if (typeof idx !== 'number' || isNaN(idx)) {
        console.warn(`Invalid idx value in getPointOnTrail: ${idx}, defaulting to 0`);
        idx = 0;
    }

    // Validate t parameter
    if (typeof t !== 'number' || isNaN(t)) {
        t = 0;
    }

    if (n === 2) {
        // Circle logic: Move along the circumference
        // Phase 0 (I) is top to bottom? Or full circle?
        // In original app: half=Math.PI, base=-Math.PI/2. idx=0 -> base + t*half. idx=1 -> base + half + t*half.
        // So 0 is (-PI/2 to PI/2) [Right side arc? No, -PI/2 is Top].
        // -PI/2 is Top. +PI/2 is Bottom.
        // So idx 0 (I) goes Top -> Right -> Bottom.
        // idx 1 (E) goes Bottom -> Left -> Top.
        const half = Math.PI;
        const base = -Math.PI / 2;
        const ang = base + (idx === 0 ? t * half : half + t * half);
        return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)];
    } else {
        // Polygon logic
        const pts = getPolygonPoints(n, cx, cy, R);

        // Additional safety check
        if (pts.length === 0) {
            console.error('getPolygonPoints returned empty array');
            return [cx, cy];
        }

        // idx is the side index.
        const p1 = pts[idx % n];
        const p2 = pts[(idx + 1) % n];

        // Safety check for undefined points
        if (!p1 || !p2) {
            console.error(`Invalid points: p1=${p1}, p2=${p2}, idx=${idx}, n=${n}`);
            return [cx, cy];
        }

        const x = p1[0] + (p2[0] - p1[0]) * t;
        const y = p1[1] + (p2[1] - p1[1]) * t;
        return [x, y];
    }
}
