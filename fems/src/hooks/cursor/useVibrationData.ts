import {useEffect, useMemo, useState} from 'react';
import {faker} from '@faker-js/faker';

export function useVibrationData() {
    const [vibrationValues, setVibrationValues] = useState<number[]>([]);
    const [xMin, setXMin] = useState<number | undefined>(undefined);
    const [xMax, setXMax] = useState<number | undefined>(undefined);
    const [yMin, setYMin] = useState<string>('');
    const [yMax, setYMax] = useState<string>('');
    const [movingAverageWindowSize, setMovingAverageWindowSize] = useState<number>(1);
    const [showMovingAverage, setShowMovingAverage] = useState<boolean>(false);

    // 진동 데이터 생성
    useEffect(() => {
        const generateVibrationData = () => {
            const data = Array.from({ length: 100 }, () =>
                faker.number.int({ min: -10, max: 10 })
            );
            setVibrationValues(data);
        };
        generateVibrationData();
    }, []);

    // 축 범위 초기 설정
    useEffect(() => {
        if (vibrationValues.length > 0 && xMin === undefined) {
            setXMin(1);
            setXMax(vibrationValues.length);
            const yValues = vibrationValues;
            const yMinValue = Math.min(...yValues);
            const yMaxValue = Math.max(...yValues);
            setYMin(yMinValue.toString());
            setYMax(yMaxValue.toString());
        }
    }, [vibrationValues, xMin]);

    // X축 레이블 생성
    const vibrationLabels = useMemo(
        () => Array.from({ length: vibrationValues.length }, (_, i) => `${i + 1}`),
        [vibrationValues]
    );

    // 필터링된 인덱스
    const filteredIndices = useMemo(() => {
        if (xMin === undefined || xMax === undefined) return [];
        const indices = [];
        for (let i = xMin - 1; i <= xMax - 1 && i < vibrationValues.length; i++) {
            if (i >= 0) {
                indices.push(i);
            }
        }
        return indices;
    }, [xMin, xMax, vibrationValues.length]);

    // 필터링된 데이터
    const filteredData = useMemo(
        () => filteredIndices.map((i) => vibrationValues[i]),
        [filteredIndices, vibrationValues]
    );

    const filteredLabels = useMemo(
        () => filteredIndices.map((i) => vibrationLabels[i]),
        [filteredIndices, vibrationLabels]
    );

    // 이동평균 데이터 계산
    const movingAverageData = useMemo(() => {
        if (!showMovingAverage || movingAverageWindowSize <= 1) return [];
        const maData = [];
        const data = filteredData;
        const windowSize = movingAverageWindowSize;
        for (let i = 0; i < data.length; i++) {
            if (i < windowSize - 1) {
                maData.push(null);
            } else {
                const windowData = data.slice(i - windowSize + 1, i + 1);
                const average = windowData.reduce((sum, val) => sum + val, 0) / windowSize;
                maData.push(average);
            }
        }
        return maData;
    }, [movingAverageWindowSize, filteredData, showMovingAverage]);

    return {
        vibrationValues,
        xMin,
        setXMin,
        xMax,
        setXMax,
        yMin,
        setYMin,
        yMax,
        setYMax,
        vibrationLabels,
        filteredData,
        filteredLabels,
        filteredIndices,
        movingAverageWindowSize,
        setMovingAverageWindowSize,
        showMovingAverage,
        setShowMovingAverage,
        movingAverageData,
    };
}
