import * as echarts from "echarts";

const Gauge = (
  value: number,
  target: number,
  detail: echarts.GaugeSeriesOption["detail"] = undefined,
): echarts.EChartsOption => ({
  series: [
    {
      type: "gauge",
      startAngle: 180,
      endAngle: 0,
      center: ["50%", "70%"],
      radius: "100%",
      min: 0,
      max: target,
      axisLine: {
        roundCap: false,
        lineStyle: {
          width: 10,
          color: [[1, "#E0F2FE"]],
        },
      },
      pointer: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: detail === undefined ? {} : detail, // detail을 비워둘 경우 빈 객체 처리
      progress: {
        show: true,
        roundCap: true,
        width: 10,
        itemStyle: {
          color: "#22D3EE",
        },
      },
      data: [{ value: value }],
      animationDuration: 1500,
    },
  ],
});

export default Gauge;
