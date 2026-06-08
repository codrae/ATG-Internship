// src/lib/api/getUsage.ts
import axios from "axios";

export const fetchMonthlyUseAge = async (
  building: string,
  start: string,
  end: string,
  energyType: string,
) => {
  console.log(
    `--------------Fetching useage for building: ${building}, start: ${start}, end: ${end}`,
  );

  try {
    const response = await axios.get(`/api/usage/${building}/${energyType}`, {
      params: { start, end },
    });
    return response.data;
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }
};

export const fetchMonthlyAlluseAge = async (
  start: string,
  end: string,
  energyType: string,
) => {
  console.log(
    `--------------Fetching useage for ALL: energyType : ${energyType} , start: ${start}, end: ${end}`,
  );

  try {
    const response = await axios.get(`/api/useage/total/${energyType}`, {
      params: { start, end },
    });
    return response.data;
  } catch (error) {
    console.error("데이터 불러오기 실패:", error);
    return null;
  }
};
