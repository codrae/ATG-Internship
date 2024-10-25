import { useState, useCallback } from 'react';
import { Point } from '@/types';

export function useCalculations(
    vibrationValues: number[],
    xMin: number | undefined,
    xMax: number | undefined
) {
    const [distance, setDistance] = useState<number | null>(null);
    const [markedPoints, setMarkedPoints] = useState<number[]>([]);
    const [tableData, setTableData] = useState<Point[]>([]);
    const [markerPairCount, setMarkerPairCount] = useState<number>(5);
    const [harmonicLineCount, setHarmonicLineCount] = useState<number>(5);

    // 두 점 사이의 거리 계산
    const calculateDistance = useCallback((point1: Point, point2: Point) => {
        const distance = point2.x - point1.x;
        setDistance(distance);
    }, []);

    // 등간격 마커 계산
    const calculateMarkers = useCallback(
        (point1: Point, point2: Point) => {
            const interval = Math.abs(point2.x - point1.x);
            if (interval === 0) {
                alert('두 점의 x값이 동일합니다. 다른 값을 입력해주세요.');
                return;
            }

            const baseIndex = point1.x - 1;
            const newMarkedPoints: number[] = [baseIndex];

            for (let i = 1; i <= markerPairCount; i++) {
                const nextIndex = baseIndex + i * interval;
                const prevIndex = baseIndex - i * interval;

                if (
                    nextIndex < vibrationValues.length &&
                    (xMax === undefined || nextIndex + 1 <= xMax)
                ) {
                    newMarkedPoints.push(nextIndex);
                }

                if (
                    prevIndex >= 0 &&
                    (xMin === undefined || prevIndex + 1 >= xMin)
                ) {
                    newMarkedPoints.push(prevIndex);
                }

                if (
                    (nextIndex >= vibrationValues.length ||
                        (xMax !== undefined && nextIndex + 1 > xMax)) &&
                    (prevIndex < 0 || (xMin !== undefined && prevIndex + 1 < xMin))
                ) {
                    break;
                }
            }

            const uniqueMarkedPoints = newMarkedPoints.filter(
                (value, index, self) => self.indexOf(value) === index
            );

            setMarkedPoints(uniqueMarkedPoints);

            setTableData(
                uniqueMarkedPoints
                    .map((index) => ({
                        x: index + 1,
                        y: vibrationValues[index],
                    }))
                    .sort((a, b) => a.x - b.x)
            );
        },
        [vibrationValues, xMin, xMax, markerPairCount]
    );

    const calculateHarmonics = useCallback(
        (point: Point) => {
            const baseX = point.x;
            if (baseX < 0) {
                alert('x값은 0 이상이어야 합니다.');
                return;
            }
            const harmonicPoints: number[] = [];

            for (let i = 1; i <= harmonicLineCount + 1; i++) {
                const harmonicX = baseX * i;
                if (harmonicX - 1 < vibrationValues.length) {
                    harmonicPoints.push(harmonicX - 1);
                }
            }

            setMarkedPoints(harmonicPoints);
            setTableData(
                harmonicPoints
                    .map((index) => ({
                        x: index + 1,
                        y: vibrationValues[index],
                    }))
                    .sort((a, b) => a.x - b.x)
            );
        },
        [vibrationValues, harmonicLineCount]
    );


    return {
        distance,
        setDistance,
        markedPoints,
        setMarkedPoints,
        tableData,
        setTableData,
        markerPairCount,
        setMarkerPairCount,
        setHarmonicLineCount,
        harmonicLineCount,
        calculateDistance,
        calculateMarkers,
        calculateHarmonics,
    };
}
