"use client"; // client component로 지정

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";

interface ProcessContextType {
  processId: string;
  setProcessId: (id: string) => void;
}

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

export const ProcessProvider = ({ children }: { children: ReactNode }) => {
  const [processId, setProcessId] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    // URL에서 processId 추출
    const processIdFromPath = pathname
      .split("/")
      .filter(Boolean)
      .slice(-2, -1)[0];
    if (processIdFromPath) {
      setProcessId(processIdFromPath);
    }
  }, [pathname]);

  return (
    <ProcessContext.Provider value={{ processId, setProcessId }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcessContext = () => {
  const context = useContext(ProcessContext);
  if (!context) {
    throw new Error("useProcessContext must be used within a ProcessProvider");
  }
  return context;
};
