'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import Modal from 'react-modal';
import { saveAs } from 'file-saver';
import { faker } from '@faker-js/faker';
import * as echarts from 'echarts';

Modal.setAppElement('body');

type Mode = 'distance' | 'marker' | 'harmonic' | null;

interface Point {
  x: number;
  y: number;
}

interface TooltipFormatterParam {
  seriesName: string;
  name: string;
  data: {
    value: number | null;
  };
  axisValue: string;
}

const VibrationChart: React.FC = () => {
  // 상태 변수 설정
  const [mode, setMode] = useState<Mode>(null); // 현재 모드 상태
  const [selectedPoints, setSelectedPoints] = useState<Point[]>([]); // 사용자가 선택한 점들
  const [distance, setDistance] = useState<number | null>(null); // 두 점 사이의 거리
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 모달 창 열림 여부
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null); // 현재 선택한 포인트
  const [markedPoints, setMarkedPoints] = useState<number[]>([]); // 마커로 표시된 점들의 인덱스
  const [tableData, setTableData] = useState<Point[]>([]); // 마커 데이터 테이블
  const [vibrationValues, setVibrationValues] = useState<number[]>([]); // 진동 데이터 값
  const [chartInstance, setChartInstance] = useState<echarts.ECharts | null>(null); // 차트 인스턴스

  // 추가된 상태 변수: x축 및 y축 범위
  const [xMin, setXMin] = useState<number | undefined>(undefined);
  const [xMax, setXMax] = useState<number | undefined>(undefined);
  // yMin, yMax 상태를 문자열로 변경
  const [yMin, setYMin] = useState<string>('');
  const [yMax, setYMax] = useState<string>('');

  // 등간격 마커를 위한 추가 상태 변수
  const [markerPairCount, setMarkerPairCount] = useState<number>(5); // 표시할 수직선 쌍의 수

  // 이동평균선을 위한 추가 상태 변수
  const [movingAverageWindowSize, setMovingAverageWindowSize] = useState<number>(1); // 이동평균선의 윈도우 크기
  const [showMovingAverage, setShowMovingAverage] = useState<boolean>(false); // 이동평균선 표시 여부

  // 진동 데이터 생성 (faker 사용)
  useEffect(() => {
    const generateVibrationData = () => {
      const data = Array.from({ length: 100 }, () =>
          faker.number.int({ min: -10, max: 10 })
      );
      setVibrationValues(data);
    };
    generateVibrationData();
  }, []);

  // 데이터 로드 후 xMin, xMax, yMin, yMax 설정
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

  // xMin 및 xMax에 따라 필터링된 데이터 인덱스
  const filteredIndices = useMemo(() => {
    if (xMin === undefined || xMax === undefined) return [];
    const indices = [];
    for ( let i = xMin - 1; i <= xMax - 1 && i < vibrationValues.length; i++) {
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
    if (!showMovingAverage || movingAverageWindowSize <= 1) return []; // 이동평균선이 비활성화된 경우 빈 배열 반환
    const maData = [];
    const data = filteredData;
    const windowSize = movingAverageWindowSize;
    for (let i = 0; i < data.length; i++) {
      if (i < windowSize - 1) {
        maData.push(null); // 데이터 부족 시 null 처리
      } else {
        const windowData = data.slice(i - windowSize + 1, i + 1);
        const average = windowData.reduce((sum, val) => sum + val, 0) / windowSize;
        maData.push(average);
      }
    }
    return maData;
  }, [movingAverageWindowSize, filteredData, showMovingAverage]);

  // 두 점 사이의 거리 계산
  const calculateDistance = useCallback((point1: Point, point2: Point) => {
    const distance = point2.x - point1.x; // 유클리드 거리 계산
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
        const newMarkedPoints: number[] = [baseIndex]; // 기준 포인트 포함

        // 왼쪽과 오른쪽 방향 마커를 하나의 루프에서 계산
        for (let i = 1; i <= markerPairCount; i++) {
          const nextIndex = baseIndex + i * interval;
          const prevIndex = baseIndex - i * interval;

          // 오른쪽 마커 계산
          if (nextIndex < vibrationValues.length && (xMax === undefined || nextIndex + 1 <= xMax)) {
            newMarkedPoints.push(nextIndex);
          }

          // 왼쪽 마커 계산
          if (prevIndex >= 0 && (xMin === undefined || prevIndex + 1 >= xMin)) {
            newMarkedPoints.push(prevIndex);
          }

          // 두 방향 모두 더 이상 추가할 수 없으면 종료
          if ((nextIndex >= vibrationValues.length || (xMax !== undefined && nextIndex + 1 > xMax)) &&
              (prevIndex < 0 || (xMin !== undefined && prevIndex + 1 < xMin))) {
            break;
          }
        }

        // 중복 없이 마커 추가 후 상태 업데이트
        const uniqueMarkedPoints = newMarkedPoints.filter((value, index, self) => self.indexOf(value) === index);

        // 상태가 변경된 경우에만 업데이트
        setMarkedPoints((prevMarkedPoints) => {
          if (prevMarkedPoints.length === uniqueMarkedPoints.length &&
              prevMarkedPoints.every((val, idx) => val === uniqueMarkedPoints[idx])) {
            return prevMarkedPoints; // 상태가 같다면 업데이트 생략
          }
          return uniqueMarkedPoints;
        });

        // 테이블 데이터 업데이트
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


  // 하모닉 마커 계산 (xMin, xMax 고려)
  const calculateHarmonics = useCallback(
      (point: Point) => {
        const baseX = point.x;
        if (baseX <= 0) {
          alert('x값은 1 이상이어야 합니다.');
          return;
        }
        const harmonicPoints: number[] = [];

        for (let i = baseX; i <= vibrationValues.length; i += baseX) {
          if ((xMax !== undefined && i > xMax) || (i-baseX)/baseX > 10 ) break;
          if (i >= xMin!) {
            harmonicPoints.push(i - 1); // 인덱스는 0부터 시작하므로 -1
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
      [vibrationValues, xMin, xMax]
  );

  // ECharts 옵션 설정
  const option = useMemo(() => {
    const series = [
      {
        data: filteredData.map((y, i) => ({
          value: y,
          xAxis: filteredLabels[i],
          dataIndex: filteredIndices[i],
        })),
        type: 'line',
        name: '진동 데이터',
        // 데이터 포인트의 심볼을 표시하고 크기를 조절합니다.
        showSymbol: true,
        symbolSize: 10, // 심볼 크기를 10으로 설정 (필요에 따라 조절 가능)
        // 마우스 오버 시 심볼 크기를 증가시킵니다.
        emphasis: {
          itemStyle: {
            symbolSize: 15, // 강조 시 심볼 크기
          },
        },
        // 히트 영역을 늘리기 위해 샘플링을 비활성화합니다.
        sampling: 'none',
        markLine: {
          symbol: 'none',
          data: markedPoints
              .filter(
                  (pointIndex) =>
                      yMin !== undefined &&
                      yMax !== undefined &&
                      vibrationValues[pointIndex] >= parseFloat(yMin) &&
                      vibrationValues[pointIndex] <= parseFloat(yMax)
              )
              .map((pointIndex) => {
                // 첫 번째 선택된 포인트의 인덱스 가져오기
                let baseIndex: number | null = null;
                if (selectedPoints.length > 0) {
                  baseIndex = selectedPoints[0].x - 1;
                }

                // 라인 스타일 설정을 위한 변수 초기화
                let lineColor = 'red';
                let opacity = 1;

                if (baseIndex !== null) {
                  if (pointIndex === baseIndex) {
                    // 첫 번째 선택된 포인트의 마커라인일 경우 색상을 다르게 설정
                    lineColor = 'white'; // 원하는 색상으로 변경 가능
                    opacity = 1; // 불투명하게 설정
                  } else {
                    // 다른 마커들은 투명도 조절
                    const distance = Math.abs(pointIndex - baseIndex);
                    const maxDistance = Math.max(
                        ...markedPoints.map((idx) => Math.abs(idx - baseIndex!))
                    );
                    opacity = 1 - distance / (maxDistance + 1);
                    opacity = Math.max(opacity, 0.7); // 최소 불투명도 설정
                  }
                }

                return {
                  xAxis: vibrationLabels[pointIndex],
                  lineStyle: {
                    type: 'dashed',
                    color: lineColor,
                    opacity: opacity,
                  },
                };
              }),
        },
      },
      // 이동평균선 시리즈
      {
        data: movingAverageData,
        type: 'line',
        name: '이동평균선',
        smooth: true,
        lineStyle: {
          color: 'orange',
          opacity: movingAverageData.length > 0 ? 1 : 0,
        },
        showSymbol: false,
      },
    ];

    // 기존 dataZoom 상태를 가져와서 유지
    let currentDataZoom: echarts.EChartOption.DataZoom[] = [];
    if (chartInstance) {
      const instanceOption = chartInstance.getOption();
      if (instanceOption && instanceOption.dataZoom) {
        currentDataZoom = instanceOption.dataZoom;
      }
    }

    return {
      title: {
        text: 'Vibration Chart Example',
      },
      xAxis: {
        type: 'category',
        data: filteredLabels,
        name: '(초)',
        nameLocation: 'middle',
        nameGap: 30,
      },
      yAxis: {
        type: 'value',
        min: yMin !== '' ? parseFloat(yMin) : 'dataMin',
        max: yMax !== '' ? parseFloat(yMax) : 'dataMax',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: TooltipFormatterParam | TooltipFormatterParam[]) => {
          let tooltipText = '';
          if (Array.isArray(params)) {
            params.forEach((point) => {
              const yValue =
                  point.data && point.data.value !== null ? point.data.value : 'No data';
              tooltipText += `${point.seriesName} - X: ${point.axisValue}<br/>Y: ${yValue}<br/>`;
            });
          } else {
            const point = params;
            const yValue =
                point.data && point.data.value !== null ? point.data.value : 'No data';
            tooltipText += `${point.seriesName} - X: ${point.axisValue}<br/>Y: ${yValue}<br/>`;
          }
          return tooltipText;
        },
      },

      toolbox: {
        feature: {
          saveAsImage: {},
          restore: {},
          dataZoom: {},
        },
      },
      dataZoom:
          currentDataZoom.length > 0
              ? currentDataZoom
              : [
                {
                  type: 'slider',
                  xAxisIndex: 0,
                  start: 0,
                  end: 100,
                  orient: 'horizontal',
                },
                {
                  type: 'slider',
                  yAxisIndex: 0,
                  orient: 'vertical',
                  right: 10,
                },
              ],
      series,
    };
  }, [filteredData, filteredLabels, markedPoints, vibrationLabels, vibrationValues, yMin, yMax, filteredIndices, movingAverageData, selectedPoints, chartInstance]);

  // 차트 이벤트 핸들러 설정 (스케일 고려)
  const onEvents = useMemo(
      () => ({
        click: (params: echarts.ECElementEvent) => {
          if (mode && params.componentType === 'series') {
            // xAxis의 값(레이블)을 사용하여 정확한 x 값을 얻습니다.
            const xValue = parseInt(params.name);
            const dataIndex = xValue - 1; // xValue가 인덱스 + 1에 해당
            const yValue = vibrationValues[dataIndex]; // y 좌표
            setCurrentPoint({ x: xValue, y: yValue }); // 현재 선택한 포인트 설정
            setIsModalOpen(true); // 모달 창 열기
          }
        },
      }),
      [mode, vibrationValues]
  );

  // 모달 확인 버튼 클릭 시 처리 (포인트 선택 후 즉시 계산)
  const handleModalConfirm = useCallback(() => {
    if (currentPoint) {
      setSelectedPoints((prevPoints) => {
        const updatedPoints = [...prevPoints];

        if (mode === 'distance' || mode === 'marker') {
          if (prevPoints.length >= 2) {
            // 두 번째 포인트를 업데이트
            updatedPoints[1] = currentPoint;
          } else if (prevPoints.length === 1) {
            updatedPoints.push(currentPoint);
          } else {
            updatedPoints.push(currentPoint);
          }
        } else if (mode === 'harmonic') {
          // 첫 번째 포인트를 업데이트
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
    setIsModalOpen(false); // 모달 창 닫기
  }, [
    currentPoint,
    mode,
    calculateDistance,
    calculateMarkers,
    calculateHarmonics,
  ]);

  // 선택된 포인트의 x값을 입력으로 변경
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

  // 변경 버튼 클릭 시 현재 모드의 작업 수행 (입력된 x값에 따라)
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
  }, [mode, selectedPoints, calculateDistance, calculateMarkers, calculateHarmonics]);

  // 모달 취소 버튼 클릭 시 처리
  const handleModalCancel = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // CSV 파일 다운로드
  const downloadCSV = useCallback(() => {
    const csvContent = [
      ['X', 'Y'],
      ...tableData.map((row) => [row.x, row.y]),
    ]
        .map((e) => e.join(','))
        .join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'marker_data.csv'); // CSV 파일 저장
  }, [tableData]);

  // 차트 인스턴스 저장
  const handleChartReady = useCallback((chart: echarts.ECharts) => {
    setChartInstance(chart);
  }, []);

  return (
      <div className="container mx-auto p-4 mt-36">
        <h1 className="text-2xl font-bold mb-4">Vibration Chart Example</h1>

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

        {/* 진동 차트 렌더링 */}
        <ReactECharts
            option={option}
            onChartReady={handleChartReady}
            onEvents={onEvents}
            style={{ height: '500px' }}
            lazyUpdate={true}
            theme={'dark'}
            notMerge={false} // 옵션 병합하여 dataZoom 상태 유지
        />

        {/* 모드 선택 버튼 */}
        <div className="flex mb-4 mt-4">
          <button
              onClick={() => {
                setMode('distance');
                setSelectedPoints([]);
                setDistance(null);
                setMarkedPoints([]);
                setTableData([]);
              }}
              className={`px-4 py-2 rounded mr-4 ${
                  mode === 'distance' ? 'bg-green-700' : 'bg-green-500'
              } text-white`}
          >
            Distance
          </button>
          <button
              onClick={() => {
                setMode('marker');
                setSelectedPoints([]);
                setDistance(null);
                setMarkedPoints([]);
                setTableData([]);
              }}
              className={`px-4 py-2 rounded mr-4 ${
                  mode === 'marker' ? 'bg-blue-700' : 'bg-blue-500'
              } text-white`}
          >
            Side Band
          </button>
          <button
              onClick={() => {
                setMode('harmonic');
                setSelectedPoints([]);
                setDistance(null);
                setMarkedPoints([]);
                setTableData([]);
              }}
              className={`px-4 py-2 rounded ${
                  mode === 'harmonic' ? 'bg-purple-700' : 'bg-purple-500'
              } text-white`}
          >
            Harmonic
          </button>
        </div>

        {/* 현재 선택된 포인트 및 결과 표시 */}
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

        {/* 마커 데이터 테이블 및 CSV 다운로드 */}
        {tableData.length > 0 && mode !== 'distance' && (
            <div className="mb-4 mt-4">
              <h2 className="text-xl font-bold mb-2">Marker Data Table</h2>
              <table className="table-auto w-full text-left">
                <thead>
                <tr>
                  <th className="border px-4 py-2">X</th>
                  <th className="border px-4 py-2">Y</th>
                </tr>
                </thead>
                <tbody>
                {tableData
                    .sort((a, b) => a.x - b.x)
                    .map((row, index) => (
                        <tr key={index}>
                          <td className="border px-4 py-2">{row.x}</td>
                          <td className="border px-4 py-2">{row.y}</td>
                        </tr>
                    ))}
                </tbody>
              </table>
              <button
                  onClick={downloadCSV}
                  className="bg-orange-500 text-white px-4 py-2 rounded mt-4"
              >
                CSV 다운로드
              </button>
            </div>
        )}

        {/* 데이터 포인트 선택 모달 */}
        <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalCancel}
            contentLabel="Confirm Point Selection"
            className="bg-white p-6 rounded shadow-lg max-w-md mx-auto my-auto"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        >
          <h2 className="text-xl font-bold mb-4">데이터 포인트 선택</h2>
          {currentPoint && (
              <p className="mb-4">
                선택한 데이터 포인트의 좌표: (X: {currentPoint.x}, Y: {currentPoint.y})
              </p>
          )}
          <div className="flex justify-end gap-4">
            <button
                onClick={handleModalConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              선택
            </button>
            <button
                onClick={handleModalCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              취소
            </button>
          </div>
        </Modal>
      </div>
  );
};

export default React.memo(VibrationChart);
