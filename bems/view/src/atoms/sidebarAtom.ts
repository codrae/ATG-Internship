import { atom } from "jotai";

// 열려 있는 메뉴 상태 관리
export const sidebarOpenMenuAtom = atom<string | null>(null);
