import { atom } from "jotai";

const now = new Date();
const lastMonth = new Date();
lastMonth.setMonth(now.getMonth() - 7);

export const periodAtom = atom<{ start: Date; end: Date }>({
  // 기본값 설정

  start: lastMonth,
  end: now,
});
