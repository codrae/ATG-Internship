// id 번 프로세스에 대한 보고서 페이지
// src/app/reports/[process_id]/page.tsx
import VibrationReport from "@/components/process/VibrationReport";
import Downloader from "@/components/reports/download/DownloadButtons";
import { useAtom } from "jotai/react/useAtom";
import { machinesAtom } from "@/atoms/machinesAtom";
import { useRouter } from "next/router";

interface Params {
  process_id: string;
}

export async function generateStaticParams(): Promise<Params[]> {
  return Array.from({ length: 10 }, (_, i) => ({ process_id: `${i + 1}` }));
}

const ReportProcess = () => {
  const router = useRouter();
  const { processId } = router.query as { processId: string };
  const [machines] = useAtom(machinesAtom);

  // processId 공정 데이터 호출
  const machine = machines.find((m) => m.resourceId === processId);

  if (!machine) return <p> MachineId: {processId} not found </p>;

  return (
    <>
      <VibrationReport
        processId={processId}
        processName={machine.name}
        processType={machine.attributes.value}
        sensorIds={machine.sensors}
      />
      <Downloader />
      <div>
        machine name: {machine.name}
        machine resourceId: {machine.resourceId}
        machine sensors: {[machine.sensors]}
      </div>
    </>
  );
};

export default ReportProcess;
