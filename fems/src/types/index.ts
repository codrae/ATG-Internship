export type Mode = 'distance' | 'marker' | 'harmonic' | null;

export interface Point {
    x: number;
    y: number;
}

export interface TooltipFormatterParam {
    seriesName: string;
    name: string;
    data: {
        value: number | null;
    };
    axisValue: string;
}
