import React, { useState, useCallback } from 'react';
import { Point, Mode } from '@/types';
import { useVibrationData } from '@/hooks/useVibrationData';
import { useCalculations } from '@/hooks/useCalculations';
import Chart from './Chart';
import Controls from './Controls';
import ModeSelector from './ModeSelector';
import SelectedPointsDisplay from './SelectedPointsDisplay';
import MarkerDataTable from './MarkerDataTable';
import DataPointModal from './DataPointModal';
import { saveAs } from 'file-saver';
import * as echarts from 'echarts';

const VibrationChart: React.FC = () => {
    const {
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
    } = useVibrationData();

    const {
        distance,
        setDistance,
        markedPoints,
        setMarkedPoints,
        tableData,
        setTableData,
        markerPairCount,
        setMarkerPairCount,
        calculateDistance,
        calculateMarkers,
        calculateHarmonics,
    } = useCalculations(vibrationValues, xMin, xMax);

    const [mode, setMode] = useState<Mode>(null);
    const [selectedPoints, setSelectedPoints] = useState<Point[]>([]);
    const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null);

    // 차트 클릭 이벤트 처리
    const onChartClick = useCallback(
        (params: echarts.ECElementEvent) => {
            if (mode && params.componentType === 'series') {
                const xValue = parseInt(params.name);
                const dataIndex = xValue - 1;
                const yValue = vibrationValues[dataIndex];
                setCurrentPoint({ x: xValue, y: yValue });
                setIsModalOpen(true);
            }
        },
        [mode, vibrationValues]
    );

    // 모달 확인 처리
    const handleModalConfirm = useCallback(() => {
        if (currentPoint) {
            setSelectedPoints((prevPoints) => {
                const updatedPoints = [...prevPoints];

                if (mode === 'distance' || mode === 'marker') {
                    if (prevPoints.length >= 2) {
                        updatedPoints[1] = currentPoint;
                    } else {
                        updatedPoints.push(currentPoint);
                    }
                } else if (mode === 'harmonic') {
                    updatedPoints[0] = currentPoint;
                }

                // 필요한 계산 수행
                if (mode === 'distance') {
                    if (updatedPoints.length >= 2) {
                        calculateDistance(updatedPoints[0], updatedPoints[1]);
                        setMarkedPoints(updatedPoints.map((pt) => pt.x - 1));
                    } else {
                        setMarkedPoints([currentPoint.x - 1]);
                    }
                } else if (mode === 'marker') {
                    if (updatedPoints.length >= 2) {
                        calculateMarkers(updatedPoints[0], updatedPoints[1]);
                    } else {
                        setMarkedPoints([currentPoint.x - 1]);
                        setTableData([
                            {
                                x: currentPoint.x,
                                y: currentPoint.y,
                            },
                        ]);
                    }
                } else if (mode === 'harmonic') {
                    calculateHarmonics(updatedPoints[0]);
                }

                return updatedPoints;
            });
        }
        setIsModalOpen(false);
    }, [
        currentPoint,
        mode,
        calculateDistance,
        calculateMarkers,
        calculateHarmonics,
        setMarkedPoints,
        setTableData,
    ]);

    // 모달 취소 처리
    const handleModalCancel = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // 포인트 x값 변경 처리
    const handlePointXChange = useCallback(
        (index: number, newXValue: number) => {
            if (
                isNaN(newXValue) ||
                newXValue < 1 ||
                newXValue > vibrationValues.length
            ) {
                alert('x값이 데이터 범위를 벗어났습니다.');
                return;
            }
            const newYValue = vibrationValues[newXValue - 1];
            setSelectedPoints((prevPoints) => {
                const newPoints = [...prevPoints];
                newPoints[index] = { x: newXValue, y: newYValue };
                return newPoints;
            });
        },
        [vibrationValues]
    );

    // Confirm 버튼 클릭 시 처리
    const handleConfirmAction = useCallback(() => {
        if (mode === 'distance' && selectedPoints.length >= 2) {
            calculateDistance(selectedPoints[0], selectedPoints[1]);
            setMarkedPoints(selectedPoints.map((pt) => pt.x - 1));
        } else if (mode === 'marker' && selectedPoints.length >= 2) {
            calculateMarkers(selectedPoints[0], selectedPoints[1]);
        } else if (mode === 'harmonic' && selectedPoints.length >= 1) {
            calculateHarmonics(selectedPoints[0]);
        } else {
            alert('필요한 포인트 수를 선택하거나 입력해주세요.');
        }
    }, [mode, selectedPoints, calculateDistance, calculateMarkers, calculateHarmonics, setMarkedPoints]);

    // 선택 초기화
    const resetSelections = useCallback(() => {
        setSelectedPoints([]);
        setDistance(null);
        setMarkedPoints([]);
        setTableData([]);
    }, [setDistance, setMarkedPoints, setTableData]);

    // CSV 다운로드
    const downloadCSV = useCallback(() => {
        const csvContent = [
            ['X', 'Y'],
            ...tableData.map((row) => [row.x, row.y]),
        ]
            .map((e) => e.join(','))
            .join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'marker_data.csv');
    }, [tableData]);

    return (
        <div className="container mx-auto p-4 mt-36">
            <h1 className="text-2xl font-bold mb-4">Vibration Chart Example</h1>

            <Controls
                xMin={xMin}
                setXMin={setXMin}
                xMax={xMax}
                setXMax={setXMax}
                yMin={yMin}
                setYMin={setYMin}
                yMax={yMax}
                setYMax={setYMax}
                showMovingAverage={showMovingAverage}
                setShowMovingAverage={setShowMovingAverage}
                movingAverageWindowSize={movingAverageWindowSize}
                setMovingAverageWindowSize={setMovingAverageWindowSize}
            />

            <Chart
                vibrationValues={vibrationValues}
                vibrationLabels={vibrationLabels}
                filteredData={filteredData}
                filteredLabels={filteredLabels}
                filteredIndices={filteredIndices}
                movingAverageData={movingAverageData}
                markedPoints={markedPoints}
                selectedPoints={selectedPoints}
                yMin={yMin}
                yMax={yMax}
                chartInstance={chartInstance}
                setChartInstance={setChartInstance}
                onChartClick={onChartClick}
            />

            <ModeSelector mode={mode} setMode={setMode} resetSelections={resetSelections} />

            <SelectedPointsDisplay
                mode={mode}
                selectedPoints={selectedPoints}
                handlePointXChange={handlePointXChange}
                distance={distance}
                markerPairCount={markerPairCount}
                setMarkerPairCount={setMarkerPairCount}
                handleConfirmAction={handleConfirmAction}
            />

            <MarkerDataTable
                tableData={tableData}
                mode={mode}
                downloadCSV={downloadCSV}
            />

            <DataPointModal
                isModalOpen={isModalOpen}
                currentPoint={currentPoint}
                handleModalConfirm={handleModalConfirm}
                handleModalCancel={handleModalCancel}
            />
        </div>
    );
};

export default React.memo(VibrationChart);
