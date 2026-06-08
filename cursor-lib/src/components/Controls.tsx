import React from 'react';

interface ControlsProps {
    xMin: number | undefined;
    setXMin: (value: number | undefined) => void;
    xMax: number | undefined;
    setXMax: (value: number | undefined) => void;
    yMin: string;
    setYMin: (value: string) => void;
    yMax: string;
    setYMax: (value: string) => void;
    showMovingAverage: boolean;
    setShowMovingAverage: (value: boolean) => void;
    movingAverageWindowSize: number;
    setMovingAverageWindowSize: (value: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
                                               xMin,
                                               setXMin,
                                               xMax,
                                               setXMax,
                                               yMin,
                                               setYMin,
                                               yMax,
                                               setYMax,
                                               showMovingAverage,
                                               setShowMovingAverage,
                                               movingAverageWindowSize,
                                               setMovingAverageWindowSize,
                                           }) => {
    return (
        <>
            {/* 축 범위 입력 필드 */}
            <div className="flex mb-4">
                <div className="mr-4">
                    <label className="block text-lg font-semibold mb-1">X축 최소값:</label>
                    <input
                        type="number"
                        value={xMin ?? ''}
                        onChange={(e) => setXMin(parseInt(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                    />
                </div>
                <div className="mr-4">
                    <label className="block text-lg font-semibold mb-1">X축 최대값:</label>
                    <input
                        type="number"
                        value={xMax ?? ''}
                        onChange={(e) => setXMax(parseInt(e.target.value))}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                    />
                </div>
                <div className="mr-4">
                    <label className="block text-lg font-semibold mb-1">Y축 최소값:</label>
                    <input
                        type="number"
                        value={yMin}
                        onChange={(e) => setYMin(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                    />
                </div>
                <div>
                    <label className="block text-lg font-semibold mb-1">Y축 최대값:</label>
                    <input
                        type="number"
                        value={yMax}
                        onChange={(e) => setYMax(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 w-24"
                    />
                </div>
            </div>

            {/* 이동평균선 컨트롤 */}
            <div className="flex mb-4 mt-4">
                <label className="flex items-center mr-4">
                    <input
                        type="checkbox"
                        checked={showMovingAverage}
                        onChange={(e) => {
                            setShowMovingAverage(e.target.checked);
                            if (!e.target.checked) {
                                setMovingAverageWindowSize(1);
                            }
                        }}
                        className="mr-2"
                    />
                    이동평균선 표시하기
                </label>
                <div className="flex items-center">
                    <label className="mr-2">Window Size:</label>
                    <input
                        type="number"
                        min="2"
                        value={movingAverageWindowSize}
                        onChange={(e) =>
                            setMovingAverageWindowSize(parseInt(e.target.value))
                        }
                        disabled={!showMovingAverage}
                        className="border border-gray-300 rounded px-2 py-1 w-20"
                    />
                </div>
            </div>
        </>
    );
};

export default Controls;
