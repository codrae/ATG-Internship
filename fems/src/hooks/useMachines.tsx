import { useSetAtom } from "jotai/react/useSetAtom";
import { useEffect } from "react";
import { machinesAtom } from "@/atoms/machinesAtom";

export const useMachines = () => {
  const setMachines = useSetAtom(machinesAtom);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/machines");
        const data = await response.json();
        setMachines(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMachines();
  }, [setMachines]);
};
