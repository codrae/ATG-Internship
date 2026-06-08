-- 먼저 외래 키를 가진 테이블들을 drop
DROP TABLE IF EXISTS electricity_energy_intensity;
DROP TABLE IF EXISTS energy_consumption;
DROP TABLE IF EXISTS anomaly_log;
-- 그 다음 참조되는 building 테이블 drop
DROP TABLE IF EXISTS building;
DROP TABLE IF EXISTS usage_rate;
DROP TABLE IF EXISTS article;

DROP TABLE IF EXISTS contract_type;
DROP TABLE IF EXISTS client;

-- 마지막으로 enum type drop
DROP TYPE IF EXISTS building_type;
DROP TYPE IF EXISTS season_type;
DROP TYPE IF EXISTS voltage_type;


DROP SEQUENCE IF EXISTS energy_consumption_seq;
DROP SEQUENCE IF EXISTS electricity_energy_intensity_seq;
DROP SEQUENCE IF EXISTS building_seq;
DROP SEQUENCE IF EXISTS contract_type_seq;
DROP SEQUENCE IF EXISTS usage_rate_seq;
DROP SEQUENCE IF EXISTS anomaly_log_seq;
DROP SEQUENCE IF EXISTS article_seq;
DROP SEQUENCE IF EXISTS client_seq;


-- 건물 용도 ENUM 타입 생성
CREATE TYPE building_type AS ENUM (
    'EDU', 'MEDICAL', 'CULTURE', 'ETC'
);

-- 계절 타입 생성
CREATE TYPE season_type AS ENUM ('SUMMER', 'SPRING_AUTUMN', 'WINTER');
-- 전압 타입 생성
CREATE TYPE voltage_type AS ENUM ('LOW', 'HIGH');

CREATE SEQUENCE energy_consumption_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE SEQUENCE building_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE electricity_energy_intensity_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 건물 기본 정보 테이블
CREATE TABLE building
(
    id              SERIAL PRIMARY KEY,
    building_name   VARCHAR(100)   NOT NULL,
    building_type   building_type  NOT NULL,
    address         TEXT           NOT NULL,
    completion_date DATE,
    total_area      NUMERIC(10, 2) NOT NULL, -- 연면적 (m²)
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by      TEXT        DEFAULT 'test',
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by      TEXT        DEFAULT 'test'
);

-- 에너지 사용량 테이블
CREATE TABLE energy_consumption
(
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES building (id),
    year        INTEGER NOT NULL,
    month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    electricity_usage NUMERIC(10, 2) NOT NULL, -- kWh
    peak_demand NUMERIC(10, 2) NOT NULL, -- kW
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT DEFAULT 'test',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT DEFAULT 'test'

);

-- 건물 원단위 계산 결과 테이블
CREATE TABLE electricity_energy_intensity
(
    id          SERIAL PRIMARY KEY,
    building_id INTEGER NOT NULL REFERENCES building (id),
    year        INTEGER NOT NULL,
    month       INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    energy_intensity_monthly NUMERIC(10, 2) NOT NULL, -- kWh/m²·월
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT DEFAULT 'test',
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT DEFAULT 'test'

);



CREATE SEQUENCE contract_type_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE SEQUENCE usage_rate_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


CREATE SEQUENCE anomaly_log_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE SEQUENCE article_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

CREATE SEQUENCE client_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 계약종별 테이블 생성
CREATE TABLE contract_type (
                                id SERIAL PRIMARY KEY,
                                code VARCHAR(20) NOT NULL UNIQUE,
                                name VARCHAR(50) NOT NULL,
                                voltage_type voltage_type NOT NULL,
                                selection TEXT,
                                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                                created_by TEXT DEFAULT 'test',
                                updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                                updated_by TEXT DEFAULT 'test'
);

-- 계약종별 테이블 인덱스 생성
CREATE INDEX idx_contract_types_code ON contract_type(code);
CREATE INDEX idx_contract_types_voltage ON contract_type(voltage_type);

-- 사용량별 요금 테이블 생성
CREATE TABLE usage_rate (
                             id SERIAL PRIMARY KEY,
                             contract_type_id INTEGER NOT NULL,
                             base_rate NUMERIC(10, 2) NOT NULL,
                             usage_level INTEGER NOT NULL,
                             season TEXT,
                             rate_per_kwh NUMERIC(10, 2) NOT NULL,
                             created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                             created_by TEXT DEFAULT 'test',
                             updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                             updated_by TEXT DEFAULT 'test',
                             FOREIGN KEY (contract_type_id) REFERENCES contract_type(id)
);


CREATE TABLE anomaly_log (
                              id SERIAL PRIMARY KEY,
                              building_id INTEGER NOT NULL REFERENCES building (id),
                              value DECIMAL(15,2) NOT NULL,
                              predict DECIMAL(15,2) NOT NULL,
                              energy_type VARCHAR(50) NOT NULL,
                              created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE article (
                             id SERIAL PRIMARY KEY,
                             title VARCHAR(50) NOT NULL,
                             content TEXT NOT NULL,
                             created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                             created_by      TEXT        DEFAULT 'test',
                             updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                             updated_by      TEXT        DEFAULT 'test'
);

CREATE TABLE client (
                         id SERIAL PRIMARY KEY,
                         client_name VARCHAR(50),
                         password VARCHAR(100),
                         target_usage DECIMAL(15,2),
                         anomaly_criteria DECIMAL(15,2),
                         daily_usage_bound DECIMAL(15,2),
                         monthly_usage_bound DECIMAL(15,2),
                         created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                         created_by TEXT DEFAULT 'test',
                         updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                         updated_by TEXT DEFAULT 'test'
);
