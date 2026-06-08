export class DateHelper {
  // ISO 문자열 변환 함수
  static toLocalISOString(date: Date): string {
    return new Date(date.getTime()).toISOString().slice(0, -1);
  }

  private static cache = new Map<
    string,
    [number, number, number, number, number]
  >();

  static toKSTDate(date: Date): Date {
    const KST_OFFSET = 1000 * 60 * 60 * 9;
    return new Date(date.getTime() + KST_OFFSET);
  }

  static toKSTISODate(date: Date): string {
    const kstDate = this.toKSTDate(date);
    return kstDate.toISOString().slice(0, -1);
  }

  static arrayToDate(
    dateArray: [number, number, number, number, number],
  ): Date {
    const [year, month, day, hour, minute] = dateArray;

    // Date 객체의 월은 0부터 시작하므로 month에서 1을 빼줌
    return new Date(year, month - 1, day, hour, minute);
  }

  static parseDateToArray(
    datetime: string,
  ): [number, number, number, number, number] {
    // 캐싱 메커니즘
    if (!this.cache) {
      this.cache = new Map<string, [number, number, number, number, number]>();
    }

    // 캐시 확인
    if (this.cache.has(datetime)) {
      return this.cache.get(datetime)!;
    }

    // 날짜 변환
    const date = new Date(datetime);
    const kstDate = this.toKSTDate(date);

    const parsedDate: [number, number, number, number, number] = [
      kstDate.getFullYear(),
      kstDate.getMonth() - 1,
      kstDate.getDate(),
      kstDate.getHours(),
      kstDate.getMinutes(),
    ];

    // 캐시에 저장
    this.cache.set(datetime, parsedDate);

    return parsedDate;
  }
}
