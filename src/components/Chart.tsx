import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { Point } from '@/types';

interface ChartProps {
    vibrationValues: number[];
    vibrationLabels: string[];
    filteredData: number[];
    filteredLabels: string[];
    filteredIndices: number[];
    movingAverageData: (number | null)[];
    markedPoints: number[];
    selectedPoints: Point[];
    yMin: string;
    yMax: string;
    chartInstance: echarts.ECharts | null;
    setChartInstance: (chart: echarts.ECharts) => void;
    onChartClick: (params: echarts.ECElementEvent) => void;
}

const Chart: React.FC<ChartProps> = ({
                                         vibrationValues,
                                         vibrationLabels,
                                         filteredData,
                                         filteredLabels,
                                         filteredIndices,
                                         movingAverageData,
                                         markedPoints,
                                         selectedPoints,
                                         yMin,
                                         yMax,
                                         chartInstance,
                                         setChartInstance,
                                         onChartClick,
                                     }) => {
    const option = useMemo(() => {
        const yMinValue = yMin !== '' ? parseFloat(yMin) : Number.NEGATIVE_INFINITY;
        const yMaxValue = yMax !== '' ? parseFloat(yMax) : Number.POSITIVE_INFINITY;

        const series = [
            {
                data: filteredData.map((y, i) => ({
                    value: y,
                    xAxis: filteredLabels[i],
                    dataIndex: filteredIndices[i],
                })),
                type: 'line',
                name: '진동 데이터',
                coordinateSystem: 'cartesian2d',
                clip: false,
                showSymbol: true,
                symbolSize: 10,
                emphasis: {
                    itemStyle: {
                        symbolSize: 15,
                    },
                },
                sampling: 'none',
                markLine: {
                    symbol: 'none',
                    data: markedPoints
                        .filter(
                            (pointIndex) =>
                                vibrationValues[pointIndex] >= yMinValue &&
                                vibrationValues[pointIndex] <= yMaxValue
                        )
                        .map((pointIndex) => {
                            let baseIndex: number | null = null;
                            if (selectedPoints.length > 0) {
                                baseIndex = selectedPoints[0].x - 1;
                            }

                            let lineColor = 'red';
                            let opacity = 1;

                            if (baseIndex !== null) {
                                if (pointIndex === baseIndex) {
                                    lineColor = 'white';
                                    opacity = 1;
                                } else {
                                    const distance = Math.abs(pointIndex - baseIndex);
                                    const maxDistance = Math.max(
                                        ...markedPoints.map((idx) => Math.abs(idx - baseIndex!))
                                    );
                                    opacity = 1 - distance / (maxDistance + 1);
                                    opacity = Math.max(opacity, 0.7);
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
                coordinateSystem: 'cartesian2d',
                clip: false,
                lineStyle: {
                    color: 'orange',
                    opacity: movingAverageData.length > 0 ? 1 : 0,
                },
                showSymbol: false,
            },
        ];

        // 기존 dataZoom 상태 유지
        let currentDataZoom: echarts.EChartOption.DataZoom[] = [];
        if (chartInstance?.getOption()) {
            const instanceOption = chartInstance.getOption();
            if (instanceOption && instanceOption.dataZoom) {
                currentDataZoom = instanceOption.dataZoom as echarts.EChartOption.DataZoom[];
            }
        }

        return {
            title: {
                text: 'Vibration Chart Example',
            },
            grid: {
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                data: filteredLabels,
                name: '(초)',
                nameLocation: 'middle',
                nameGap: 30,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                min: yMin !== '' ? parseFloat(yMin) : 'dataMin',
                max: yMax !== '' ? parseFloat(yMax) : 'dataMax',
                boundaryGap: false,
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
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
                            start: 0,
                            end: 100,
                        },
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            start: 20,
                            end: 80,
                        },
                    ],
            series,
        };
    }, [
        filteredData,
        filteredLabels,
        markedPoints,
        vibrationLabels,
        vibrationValues,
        yMin,
        yMax,
        filteredIndices,
        movingAverageData,
        selectedPoints,
        chartInstance,
    ]);

    const onEvents = {
        click: onChartClick,
    };

    return (
        <ReactECharts
            option={option}
            onChartReady={setChartInstance}
            onEvents={onEvents}
            style={{ height: '500px' }}
            lazyUpdate={true}
            theme={'dark'}
            notMerge={false}
        />
    );
};

export default Chart;
