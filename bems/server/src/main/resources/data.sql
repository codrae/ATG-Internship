INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('60주년기념관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '2015-01-15',
        25833.57);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('1호관(본관)',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1971-01-15',
        17066.05);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('5호남관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1976-01-15',
        18359.53);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('9호관/평생교육관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1981-01-15',
        11292.04);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('로스쿨관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '2002-01-15',
        7660.85);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('서호관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1999-01-15',
        10312.00);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('인하드림센터 2/3관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1993-01-15',
        1878.90);
-- 이하의 테이블들은 비정상 데이터들이 들어오고 있는 건물들

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('2호남관/4호관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1964-01-15',
        17021.12);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('2호북관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1979-01-15',
        15830.17);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('5호동관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1981-01-15',
        17340.20);


INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('5호북관',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1983-01-15',
        16340.20);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('7호관(학생회관)',
        'EDU',
        '인천 미추홀구 인하로 100',
        '1975-01-15',
        15764.76);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('김현태인하드림센터',
        'EDU',
        '인천 미추홀구 인하로 100',
        '2013-01-15',
        4003.05);

INSERT INTO building (building_name,
                      building_type,
                      address,
                      completion_date,
                      total_area)
VALUES ('하이테크센터',
        'EDU',
        '인천 미추홀구 인하로 100',
        '2003-01-15',
        21750.93);


-- 계약종별 데이터 삽입
INSERT INTO contract_type
(code, name, voltage_type, selection)
VALUES
    ('E1-A', '교육용(을)고압A', 'HIGH', '선택1'),
    ('E2-A', '교육용(을)고압A', 'HIGH', '선택2'),
    ('E2-B', '교육용(을)고압B', 'HIGH', '선택2');


-- 사용량별 요금 데이터 삽입
INSERT INTO usage_rate
(contract_type_id, base_rate, usage_level, season, rate_per_kwh)
VALUES
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 1, 'SUMMER', 76.5),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 1, 'SPRING_AUTUMN', 76.5),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 1, 'WINTER', 80.5),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 2, 'SUMMER', 121.2),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 2, 'SPRING_AUTUMN', 90.9),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 2, 'WINTER', 119.7),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 3, 'SUMMER', 187.1),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 3, 'SPRING_AUTUMN', 111.4),
    ((SELECT id FROM contract_type WHERE code = 'E1-A' AND selection = '선택1'), 6980, 3, 'WINTER', 158.4),

    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 1, 'SUMMER', 72.0),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 1, 'SPRING_AUTUMN', 72.0),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 1, 'WINTER', 76.0),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 2, 'SUMMER', 116.7),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 2, 'SPRING_AUTUMN', 86.4),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 2, 'WINTER', 115.2),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 3, 'SUMMER', 182.6),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 3, 'SPRING_AUTUMN', 106.9),
    ((SELECT id FROM contract_type WHERE code = 'E2-A' AND selection = '선택2'), 6980, 3, 'WINTER', 153.9),

    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 1, 'SUMMER', 70.5),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 1, 'SPRING_AUTUMN', 70.5),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 1, 'WINTER', 74.3),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 2, 'SUMMER', 114.0),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 2, 'SPRING_AUTUMN', 84.7),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 2, 'WINTER', 112.3),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 3, 'SUMMER', 176.9),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 3, 'SPRING_AUTUMN', 104.5),
    ((SELECT id FROM contract_type WHERE code = 'E2-B' AND selection = '선택2'), 6980, 3, 'WINTER', 149.6);





-- 전기 사용량 이상치 데이터 삽입
INSERT INTO anomaly_log (building_id, value, predict, energy_type, created_at)
VALUES
-- 아침 시간대 이상치 (7-9시)
(1, 21.50, 20.3, 'POWER', '2024-11-07 07:46:00'),
(1, 24.39, 20.7, 'POWER', '2024-11-15 07:10:00'),
(1, 22.20, 20.9, 'POWER', '2024-11-20 07:20:00'),

-- 점심 시간대 이상치 (12-14시)
(2, 17.30, 15.2, 'POWER', '2024-11-02 12:47:00'),
(2, 19.60, 15.5, 'POWER', '2024-11-12 13:21:00'),
(2, 18.40, 15.8, 'POWER', '2024-11-19 13:23:00'),

-- 저녁 시간대 이상치 (18-20시)
(3, 23.40, 20.1, 'POWER', '2024-11-01 18:19:00'),
(3, 19.90, 20.4, 'POWER', '2024-11-04 18:02:00'),
(3, 24.70, 20.6, 'POWER', '2024-11-12 18:36:00'),

-- 심야 시간대 이상치 (22-24시)
(4, 18.70, 15.1, 'POWER', '2024-11-03 22:48:00'),
(4, 19.20, 15.4, 'POWER', '2024-11-14 23:45:00'),
(4, 20.90, 15.7, 'POWER', '2024-11-21 22:10:00');




INSERT INTO article (title, content, created_at, created_by, updated_at, updated_by)
VALUES
    ('첫 번째 게시글입니다', '안녕하세요! 이 게시판의 첫 번째 게시글입니다. 잘 부탁드립니다.',
     '2024-01-01 09:00:00+09', 'user1', '2024-01-01 09:00:00+09', 'user1'),

    ('안녕하세요 테스트 글입니다', '테스트 용 게시글 입니다',
     '2024-01-05 14:30:00+09', 'teacher_kim', '2024-01-05 14:30:00+09', 'teacher_kim'),

    ('점검 사항', '인하대 근처에 정전 현상이 있었습니다.',
     '2024-01-10 18:15:00+09', 'foodie', '2024-01-10 19:20:00+09', 'foodie');


INSERT INTO client (client_name, password, target_usage, anomaly_criteria, daily_usage_bound, monthly_usage_bound)
VALUES ('인하대 관리팀', 'test123', 1000000.00, 30.0, 15.0, 500.0);