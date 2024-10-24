import React from 'react';
import { Point, Mode } from '@/types';

interface SelectedPointsDisplayProps {
    mode: Mode;
    selectedPoints: Point[];
    handlePointXChange: (index: number, newXValue: number) => void;
    distance: number | null;
    markerPairCount: number;
    setMarkerPairCount: (value: number) => void;
    handleConfirmAction: () => void;
}

const SelectedPointsDisplay: React.FC<SelectedPointsDisplayProps> = ({
                                                                         mode,
                                                                         selectedPoints,
                                                                         handlePointXChange,
                                                                         distance,
                                                                         markerPairCount,
                                                                         setMarkerPairCount,
                                                                         handleConfirmAction,
                                                                     }) => {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
            <h3 className="text-xl font-bold mb-4">현재 선택된 포인트</h3>

            {selectedPoints
                .slice(0, mode === 'harmonic' ? 1 : 2)
                .map((point, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <label className="text-lg font-semibold mr-2">
                            Point {index + 1}:
                        </label>
                        <label className="text-lg mr-2">x:</label>
                        <input
                            type="number"
                            value={point.x}
                            onChange={(e) =>
                                handlePointXChange(index, parseInt(e.target.value))
                            }
                            className="border border-gray-300 rounded px-2 py-1 mr-4 w-20"
                        />
                        <label className="text-lg mr-2">y:</label>
                        <span className="text-lg">{point.y}</span>
                    </div>
                ))}

            {/* 등간격 마커 설정 입력 필드 */}
            {mode === 'marker' && (
                <div className="mt-4">
                    <div className="flex items-center mb-2">
                        <label className="text-lg font-semibold mr-2">
                            양옆에 표시할 수직선 쌍의 수:
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

            {/* 결과 표시 */}
            {distance !== null && (
                <div className="mt-4 text-lg font-semibold">
                    두 점 사이의 거리: {distance.toFixed(2)}
                </div>
            )}

            {/* 변경 버튼 */}
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
