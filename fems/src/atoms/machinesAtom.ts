import { atom } from "jotai/vanilla/atom";

export interface Machine {
  resourceId: string;
  name: string;
  status: {
    status: string;
    allowed: string;
    ts: number;
  };
  attributes: {
    key: string;
    value: string;
  };
  sensors: string[];
}

export const machinesAtom = atom<Machine[]>([]);
