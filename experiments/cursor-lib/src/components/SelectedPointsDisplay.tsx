import React from 'react';
import { Point, Mode } from '@/types';

interface SelectedPointsDisplayProps {
    mode: Mode;
    selectedPoints: Point[];
    handlePointXChange: (index: number, newXValue: number) => void;
    distance: number | null;
    markerPairCount: number;
    setMarkerPairCount: (value: number) => void;
    harmonicLineCount: number;
    setHarmonicLineCount: (value: number) => void;
    handleConfirmAction: () => void;
}

const SelectedPointsDisplay: React.FC<SelectedPointsDisplayProps> = ({
                                                                         mode,
                                                                         selectedPoints,
                                                                         handlePointXChange,
                                                                         distance,
                                                                         markerPairCount,
                                                                         setMarkerPairCount,
                                                                         harmonicLineCount,
                                                                         setHarmonicLineCount,
                                                                         handleConfirmAction,
                                                                     }) => {
    // 필요한 포인트 수 결정 (하모닉 모드에서는 1개, 그 외에는 2개)
    const requiredPoints = mode === 'harmonic' ? 1 : 2;

    // 선택된 포인트 배열이 필요한 수만큼 없을 경우, 빈 포인트 객체로 채우기
    const displayedPoints = [...selectedPoints];
    while (displayedPoints.length < requiredPoints) {
        displayedPoints.push({ x: NaN, y: NaN });
    }

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-xl font-bold mb-4">현재 선택된 포인트</h3>

            {displayedPoints.slice(0, requiredPoints).map((point, index) => (
                <div key={index} className="flex items-center mb-2">
                    <label className="text-lg font-semibold mr-2">
                        Point {index + 1}:
                    </label>
                    <label className="text-lg mr-2">x:</label>
                    <input
                        type="number"
                        value={isNaN(point.x) ? '' : point.x}
                        onChange={(e) =>
                            handlePointXChange(index, parseInt(e.target.value))
                        }
                        className="border border-gray-300 rounded px-2 py-1 mr-4 w-20"
                    />
                    <label className="text-lg mr-2">y:</label>
                    <span className="text-lg">
            {isNaN(point.y) ? 'N/A' : point.y}
          </span>
                </div>
            ))}

            {/* 등간격 마커 설정 입력 필드 */}
            {mode === 'marker' && (
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <label className="text-lg font-semibold mr-2">
                            표시할 수직선 쌍의 수:
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={markerPairCount}
                            onChange={(e) => setMarkerPairCount(parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 mr-4 w-20"
                        />
                    </div>
                </div>
            )}

            {/* 하모닉 마커 설정 입력 필드 */}
            {mode === 'harmonic' && (
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <label className="text-lg font-semibold mr-2">
                            표시할 하모닉 수:
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={harmonicLineCount}
                            onChange={(e) => setHarmonicLineCount(parseInt(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 mr-4 w-20"
                        />
                    </div>
                </div>
            )}

            {/* 결과 표시 */}
            {mode === 'distance' && distance !== null && (
                <div className="mt-4 text-lg font-semibold">
                    두 점 사이의 거리: {distance.toFixed(2)}
                </div>
            )}

            {/* Confirm 버튼 */}
            {mode && (
                <button
                    onClick={handleConfirmAction}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                    Confirm
                </button>
            )}
        </div>
    );
};

export default SelectedPointsDisplay;
