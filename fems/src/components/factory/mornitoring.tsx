import React from "react";
import FactoryStateComponent from "@/components/factory/ProcessStatus";

const processes = [
  {
    id: 1,
    name: "Factory 1",
    total: 100,
    good: 80,
    bad: 10,
    warning: 10,
    x: "20%",
    y: "30%",
  },
  {
    id: 2,
    name: "Factory 2",
    total: 120,
    good: 100,
    bad: 5,
    warning: 15,
    x: "40%",
    y: "50%",
  },
  {
    id: 3,
    name: "Factory 3",
    total: 150,
    good: 130,
    bad: 10,
    warning: 10,
    x: "60%",
    y: "20%",
  },
  {
    id: 4,
    name: "Factory 5",
    total: 110,
    good: 90,
    bad: 5,
    warning: 15,
    x: "80%",
    y: "40%",
  },
  {
    id: 5,
    name: "Warehouse",
    total: 50,
    good: 45,
    bad: 2,
    warning: 3,
    x: "50%",
    y: "80%",
  },
];

const Factory2DTwin = () => {
  return (
    <div className="flex items-center justify-center h-[800px] w-full">
      <div
        className="relative w-full h-full bg-no-repeat bg-contain bg-center border rounded-md"
        style={{
          backgroundImage: "url('/simmtech_factory.png')", // 공장 배경 이미지
        }}
      >
        {processes.map((process) => (
          <div
            key={process.id}
            className="absolute"
            style={{
              top: process.y,
              left: process.x,
              transform: "translate(-50%, -50%)", // 컴포넌트를 중앙 기준으로 배치
            }}
          >
            <FactoryStateComponent
              name={process.name}
              processId={process.id}
              total={process.total}
              good={process.good}
              bad={process.bad}
              warning={process.warning}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Factory2DTwin;
