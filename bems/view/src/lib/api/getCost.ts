// src/lib/api/getCost.ts
import axios from "axios";

export const fetchMonthlyCost = async (
  building: string,
  year: number,
  month: number,
) => {
  console.log(
    `--------------Fetching cost for building: ${building}, year: ${year}, month: ${month}`,
  );

  try {
    const response = await axios.get(`/api/cost/${building}`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }
};

export const fetchMonthlyAllCost = async (year: number, month: number) => {
  console.log(
    `--------------Fetching cost for ALL : year: ${year}, month: ${month}`,
  );

  try {
    const response = await axios.get(`/api/charge/total`, {
      params: { year, month },
    });
    return response.data;
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }
};
