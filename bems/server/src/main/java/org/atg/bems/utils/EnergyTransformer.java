package org.atg.bems.utils;

public class EnergyTransformer {
    private static final double KWH_TO_TJ = 3.6e-6;  // 1 KWH = 0.0000036 TJ
    private static final double KWH_TO_J = 3.6e6;    // 1 KWH = 3,600,000 J
    private static final double KWH_TO_KJ = 3.6e3;   // 1 KWH = 3,600 kJ
    private static final double KWH_TO_MJ = 3.6;     // 1 KWH = 3.6 MJ

    /**
     * KWH(킬로와트시)를 TJ(테라줄)로 변환하는 메소드
     */
    public static double kwhToTj(double kwh) {
        return kwh * KWH_TO_TJ;
    }

    /**
     * KWH(킬로와트시)를 TJ(테라줄)로 변환하고 지정된 소수점 자리수로 반올림하는 메소드
     */
    public static double kwhToTj(double kwh, int decimalPlaces) {
        double factor = Math.pow(10, decimalPlaces);
        return Math.round(kwhToTj(kwh) * factor) / factor;
    }

    /**
     * KWH(킬로와트시)를 J(줄)로 변환하는 메소드
     */
    public static double kwhToJ(double kwh) {
        return kwh * KWH_TO_J;
    }

    /**
     * KWH(킬로와트시)를 J(줄)로 변환하고 지정된 소수점 자리수로 반올림하는 메소드
     */
    public static double kwhToJ(double kwh, int decimalPlaces) {
        double factor = Math.pow(10, decimalPlaces);
        return Math.round(kwhToJ(kwh) * factor) / factor;
    }

    /**
     * KWH(킬로와트시)를 kJ(킬로줄)로 변환하는 메소드
     */
    public static double kwhToKj(double kwh) {
        return kwh * KWH_TO_KJ;
    }

    /**
     * KWH(킬로와트시)를 kJ(킬로줄)로 변환하고 지정된 소수점 자리수로 반올림하는 메소드
     */
    public static double kwhToKj(double kwh, int decimalPlaces) {
        double factor = Math.pow(10, decimalPlaces);
        return Math.round(kwhToKj(kwh) * factor) / factor;
    }

    /**
     * KWH(킬로와트시)를 MJ(메가줄)로 변환하는 메소드
     */
    public static double kwhToMj(double kwh) {
        return kwh * KWH_TO_MJ;
    }

    /**
     * KWH(킬로와트시)를 MJ(메가줄)로 변환하고 지정된 소수점 자리수로 반올림하는 메소드
     */
    public static double kwhToMj(double kwh, int decimalPlaces) {
        double factor = Math.pow(10, decimalPlaces);
        return Math.round(kwhToMj(kwh) * factor) / factor;
    }
}
