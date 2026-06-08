import React from "react";
import CsvDownload from "@/components/reports/download/CsvDownload";
import PageCaptureButton from "@/components/reports/download/PageCaptureButton";

const Downloader: React.FC = () => {
  return (
    <div className="flex justify-end items-start p-1 space-x-2">
      <CsvDownload />
      <PageCaptureButton />
    </div>
  );
};

export default Downloader;
