function formatWithCommas(params: {
  value: number;
  divider?: number; // 값을 나누는 기준
  label?: string; // 단위
}): string {
  const { value, divider = 10000, label = "만원" } = params;
  const valueInTenThousand = value / divider; // 기본 만원 단위로 변환
  return `${valueInTenThousand.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}, ${label}`;
}

export default formatWithCommas;
