import os
import sys

import numpy as np
import pandas as pd

# 프로젝트 루트 경로를 추가
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

def delete_outlier(df):
    # 조건에 맞는 행만 필터링
    df = df[(df['DataValue'] < 200) & (df['DataValue'] >= 0)]
    return df


def fill_missing_rows(df):

    # DateTime 열을 datetime 형식으로 변환
    df.loc[:, 'DateTime'] = pd.to_datetime(df['DateTime'])

    # 데이터프레임을 datetime 기준으로 정렬
    df = df.sort_values(by='DateTime').reset_index(drop=True)

    # 시작 시간과 끝 시간을 설정
    start_time = df['DateTime'].min()
    end_time = df['DateTime'].max()

    # 10분 간격으로 모든 시간을 생성
    full_time_range = pd.date_range(start=start_time, end=end_time, freq='10min')

    # 새로운 행을 담을 리스트 생성
    new_rows = []

    for time in full_time_range:
        if not ((df['DateTime'] == time).any()):
            # 10분 단위로 존재하지 않는 시간에는 새로운 행 추가
            new_row = {
                'DataValue': 0,
                'DateTime': time
            }
            new_rows.append(new_row)

    # 새로운 행들을 데이터프레임으로 변환
    new_rows_df = pd.DataFrame(new_rows)

    # 원래의 데이터프레임과 새로 생성한 행들을 합침
    df_full = pd.concat([df, new_rows_df]).sort_values(by='DateTime').reset_index(drop=True)

    return df_full


def preprocess_dataframe(df):
    # 0 값을 NaN으로 변환 후 선형 보간법 적용
    df['DataValue'] = df['DataValue'].replace(0, np.nan)
    df['DataValue'] = df['DataValue'].interpolate(method='linear')
    df['DataValue'] = df['DataValue'].astype(int)

    # zscore column이 있다면 삭제
    df = df.drop(columns=['zscore'], errors='ignore')

    # DateTime을 index로 설정
    df.set_index('DateTime', inplace=True)

    return df


def preprocess(df):
    # DateTime 열을 datetime 형식으로 변환
    df = delete_outlier(df)
    #df['DateTime'] = pd.to_datetime(df['DateTime'])
    df.loc[:, 'DateTime'] = pd.to_datetime(df['DateTime'])

    # 누락된 행 채우기
    df_filled = fill_missing_rows(df)

    # 전처리 수행
    df_preprocessed = preprocess_dataframe(df_filled)

    print(df_preprocessed)
    print("len : ", len(df_preprocessed))
    print("df_preprocessed['DataValue'].max()--------------" , df_preprocessed['DataValue'].max())
    print("df_preprocessed['DataValue'].max()--------------", df_preprocessed['DataValue'].min())

    return df_preprocessed
