// --- SAMPLE DATABASE RECORDS ---
export const INITIAL_DB_SENSORS = [
  {
    id: 4,
    temperature: 35.5,
    air_humidity: 42,
    soil_moisture: 28,
    fire_sensor: 0,
    recorded_at: '05/11/2026 15:05:12'
  },
  {
    id: 3,
    temperature: 42.1,
    air_humidity: 34,
    soil_moisture: 24,
    fire_sensor: 0,
    recorded_at: '05/11/2026 13:45:19'
  },
  {
    id: 2,
    temperature: 58.4,
    air_humidity: 22,
    soil_moisture: 17,
    fire_sensor: 1,
    recorded_at: '05/11/2026 11:12:50'
  },
  {
    id: 1,
    temperature: 33.2,
    air_humidity: 46,
    soil_moisture: 31,
    fire_sensor: 0,
    recorded_at: '05/11/2026 09:00:00'
  }
];

export const INITIAL_DB_DETECTIONS = [
  {
    id: 4,
    camera: 'CAM-01',
    image_path: 'uploads/frame004.jpg',
    detected_class: 'normal',
    confidence: 0.98,
    bbox: 'null',
    detected_at: '05/11/2026 15:05:12',
    snapshotMeta: {
      scenario: 'nominal',
      temp: '35.5°C',
      smoke: '195 PPM',
      boxes: []
    }
  },
  {
    id: 3,
    camera: 'CAM-01',
    image_path: 'uploads/frame003.jpg',
    detected_class: 'smoke',
    confidence: 0.88,
    bbox: '[142, 88, 210, 165]',
    detected_at: '05/11/2026 13:45:19',
    snapshotMeta: {
      scenario: 'warning',
      temp: '42.1°C',
      smoke: '340 PPM',
      boxes: [{ type: 'smoke', confidence: 0.88, x: 44, y: 22, w: 28, h: 34, color: '#F59E0B' }]
    }
  },
  {
    id: 2,
    camera: 'CAM-01',
    image_path: 'uploads/frame002.jpg',
    detected_class: 'smoke',
    confidence: 0.94,
    bbox: '[142, 88, 210, 165]',
    detected_at: '05/11/2026 11:12:50',
    snapshotMeta: {
      scenario: 'warning',
      temp: '58.4°C',
      smoke: '410 PPM',
      boxes: [{ type: 'smoke', confidence: 0.94, x: 41, y: 18, w: 32, h: 38, color: '#F59E0B' }]
    }
  },
  {
    id: 1,
    camera: 'CAM-01',
    image_path: 'uploads/frame001.jpg',
    detected_class: 'normal',
    confidence: 0.99,
    bbox: 'null',
    detected_at: '05/11/2026 09:00:00',
    snapshotMeta: {
      scenario: 'nominal',
      temp: '33.2°C',
      smoke: '175 PPM',
      boxes: []
    }
  }
];

export const INITIAL_DB_PREDICTIONS = [
  {
    id: 4,
    sensor_reading: 4,
    risk_level: 'low',
    risk_score: 0.18,
    model_version: 'v1.0',
    predicted_at: '05/11/2026 15:05:13'
  },
  {
    id: 3,
    sensor_reading: 3,
    risk_level: 'medium',
    risk_score: 0.64,
    model_version: 'v1.0',
    predicted_at: '05/11/2026 13:45:20'
  },
  {
    id: 2,
    sensor_reading: 2,
    risk_level: 'high',
    risk_score: 0.87,
    model_version: 'v1.0',
    predicted_at: '05/11/2026 11:12:51'
  },
  {
    id: 1,
    sensor_reading: 1,
    risk_level: 'low',
    risk_score: 0.14,
    model_version: 'v1.0',
    predicted_at: '05/11/2026 09:00:01'
  }
];

export const INITIAL_DB_ALERTS = [
  {
    id: 3,
    prediction: 3,
    alert_type: 'elevated temperature',
    message: 'Suhu meningkat (42.1°C) disertai penurunan kelembapan tanah (24%)',
    created_at: '05/11/2026 13:45:21',
    status: 'resolved'
  },
  {
    id: 2,
    prediction: 3,
    alert_type: 'smoke detected',
    message: 'Deteksi visual asap pada CAM-01 (confidence 0.88)',
    created_at: '05/11/2026 13:45:21',
    status: 'resolved'
  },
  {
    id: 1,
    prediction: 2,
    alert_type: 'high fire risk',
    message: 'Risiko kebakaran tinggi',
    created_at: '05/11/2026 11:12:52',
    status: 'active'
  }
];

export const SQL_DDL_SCHEMA = `-- PYROWATCH 4-Table Relational Schema (PostgreSQL / MySQL Compatible)

CREATE TABLE sensor_readings (
  id SERIAL PRIMARY KEY,
  temperature DECIMAL(4,1) NOT NULL,      -- Contoh: 35.5 (°C)
  air_humidity INT NOT NULL,              -- Contoh: 42 (%)
  soil_moisture INT NOT NULL,             -- Contoh: 28 (% Kelembapan tanah)
  fire_sensor SMALLINT NOT NULL DEFAULT 0,-- 0 = Normal, 1 · Active
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE camera_detections (
  id SERIAL PRIMARY KEY,
  camera VARCHAR(32) NOT NULL,            -- Contoh: 'CAM-01'
  image_path VARCHAR(255) NOT NULL,       -- Contoh: 'uploads/frame001.jpg'
  detected_class VARCHAR(24) NOT NULL,    -- 'fire' | 'smoke' | 'normal'
  confidence DECIMAL(4,2) NOT NULL,       -- Contoh: 0.94
  bbox VARCHAR(64) DEFAULT NULL,          -- Koordinat [x, y, w, h]
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_predictions (
  id SERIAL PRIMARY KEY,
  sensor_reading INT NOT NULL REFERENCES sensor_readings(id),
  risk_level VARCHAR(16) NOT NULL,        -- 'low' | 'medium' | 'high'
  risk_score DECIMAL(4,2) NOT NULL,       -- Contoh: 0.87 (0.00 - 1.00)
  model_version VARCHAR(16) DEFAULT 'v1.0',
  predicted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  prediction INT NOT NULL REFERENCES risk_predictions(id),
  alert_type VARCHAR(64) NOT NULL,        -- Contoh: 'high fire risk'
  message TEXT NOT NULL,                  -- Contoh: 'Risiko kebakaran tinggi'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active'     -- 'active' | 'resolved' | 'dismissed'
);`;
