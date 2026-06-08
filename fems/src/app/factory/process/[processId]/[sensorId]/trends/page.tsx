// id 번 센서에 대한 트렌드 확인 페이지
// src/app/reports/[process_id]/[sensor_id]/page.tsx
import { Metadata } from "next";
import SensorTrends from "@/components/sensor/SensorTrends";

interface Params {
  sensor_id: string;
  process_id: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  return Array.from({ length: 12 }, (_, i) => ({
    sensor_id: `${i + 1}`,
    process_id: "1",
  })); // process_id는 임의로 설정
}

export const metadata: Metadata = {
  title: "Sensor Detail Report",
  description: "Detailed report for specific sensor",
};

export default function SensorDetailPage({ params }: { params: Params }) {
  return (
    <SensorTrends processId={params.process_id} sensorId={params.sensor_id} />
  );
}
