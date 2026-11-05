import { useEffect, useMemo, useState } from 'react';
import {
  INITIAL_DB_ALERTS,
  INITIAL_DB_DETECTIONS,
  INITIAL_DB_PREDICTIONS,
  INITIAL_DB_SENSORS,
  SQL_DDL_SCHEMA
} from '../data/initialData.js';
import { INITIAL_SPARKLINE, generateInitialTelemetry } from '../utils/telemetry.js';
import { formatShortTime, formatSqlTimestamp, formatTimestamp } from '../utils/date.js';

export function usePyroWatch() {
  // Simulation state: 'nominal' | 'warning' | 'critical'
  const [simState, setSimState] = useState('nominal');
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Stream & Chart Controls
  const [streamPaused, setStreamPaused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [timeRange, setTimeRange] = useState('15m');
  const [chartMode, setChartMode] = useState('MOISTURE'); // 'MOISTURE' | 'RISK'
  const [moistureMode, setMoistureTypeNote] = useState('soil'); // 'soil' | 'fmc'
  const [activeSnapshotModal, setActiveSnapshotModal] = useState(null);
  const [snapshotBanner, setSnapshotBanner] = useState(null);

  // Database Explorer State
  const [activeDbTab, setActiveDbTab] = useState('sensor_readings');
  const [dbSensors, setDbSensors] = useState(INITIAL_DB_SENSORS);
  const [dbDetections, setDbDetections] = useState(INITIAL_DB_DETECTIONS);
  const [dbPredictions, setDbPredictions] = useState(INITIAL_DB_PREDICTIONS);
  const [dbAlerts, setDbAlerts] = useState(INITIAL_DB_ALERTS);
  const [uploadClassPreset, setUploadClassPreset] = useState('smoke');
  const [alertFilterStatus, setAlertFilterStatus] = useState('all');
  const [highlightedChain, setHighlightedChain] = useState({
    sensorId: 4,
    predictionId: 4,
    alertId: 1
  });
  const [copiedSql, setCopiedSql] = useState(false);

  // Live Telemetry State
  const [telemetryHistory, setTelemetryHistory] = useState(() => generateInitialTelemetry(36));
  const [sparklineData, setSparklineData] = useState(INITIAL_SPARKLINE);

  // Live Hardware, Weather & Vision Metrics
  const [metrics, setMetrics] = useState({
    temp: 35.5,
    airHumidity: 42,
    soilMoisture: 28,
    fireSensor: 0,
    smoke: 195,
    windSpeed: 18.4,
    windDirection: 'ESE',
    solarIrradiance: 840,
    uvIndex: 8,
    pressure: 1008.4,
    rainfall24h: 0.0,
    daysSinceRain: 14,
    peakTemp: 42.1,
    phoneBattery: 82,
    phoneTemp: 33.0,
    fps: 29.8,
    mqttLatency: 38,
    detectedClass: 'none',
    visionConfidence: 0.98,
    modelVersion: 'v1.0'
  });


  const [frameTick, setFrameTick] = useState(0);

  // Compute live risk_score & risk_level from current sensor + camera state (Deterministic + AI Fusion)
  const liveRiskPrediction = useMemo(() => {
    const tempWeight = Math.max(0, Math.min(0.32, ((metrics.temp - 25) / 45) * 0.32));
    const airHumWeight = Math.max(0, Math.min(0.18, ((60 - metrics.airHumidity) / 45) * 0.18));
    const soilWeight = Math.max(0, Math.min(0.18, ((40 - metrics.soilMoisture) / 30) * 0.18));
    const fireSensorWeight = metrics.fireSensor === 1 ? 0.22 : 0;
    const visionWeight =
      simState === 'critical' ? 0.24 : simState === 'warning' ? 0.22 : 0;

    let rawScore = tempWeight + airHumWeight + soilWeight + fireSensorWeight + visionWeight;
    if (simState === 'critical') rawScore = Math.max(0.87, rawScore);
    if (simState === 'warning') rawScore = Math.max(0.64, Math.min(0.74, rawScore));

    const score = Number(Math.min(0.99, Math.max(0.12, rawScore)).toFixed(2));
    const level = score >= 0.75 ? 'high' : score >= 0.45 ? 'medium' : 'low';
    const statusLabel =
      level === 'high' ? 'High' : level === 'medium' ? 'Medium' : 'Low';

    return {
      risk_score: score,
      risk_level: level,
      statusLabel,
      model_version: metrics.modelVersion,
      breakdown: {
        tempContrib: Number(tempWeight.toFixed(2)),
        moistureContrib: Number((airHumWeight + soilWeight).toFixed(2)),
        fireSensorContrib: Number(fireSensorWeight.toFixed(2)),
        visionContrib: Number(visionWeight.toFixed(2))
      }
    };
  }, [
    metrics.temp,
    metrics.airHumidity,
    metrics.soilMoisture,
    metrics.fireSensor,
    metrics.modelVersion,
    simState
  ]);

  // Function to inject a synchronized record across the 4 database tables
  const injectDatabaseRecord = (targetState = simState) => {
    const now = new Date();
    const sqlTime = formatSqlTimestamp(now);
    const nextSensorId = (dbSensors[0]?.id || 0) + 1;
    const nextDetectionId = (dbDetections[0]?.id || 0) + 1;
    const nextPredictionId = (dbPredictions[0]?.id || 0) + 1;
    const nextAlertId = (dbAlerts[0]?.id || 0) + 1;

    const frameFile = `uploads/frame${String(nextDetectionId).padStart(3, '0')}.jpg`;

    let tempVal = metrics.temp;
    let airHumVal = metrics.airHumidity;
    let soilVal = metrics.soilMoisture;
    let fireBit = metrics.fireSensor;
    let detClass = 'normal';
    let detConf = 0.98;
    let bboxStr = 'null';
    let rLevel = liveRiskPrediction.risk_level;
    let rScore = liveRiskPrediction.risk_score;
    let boxes = [];

    if (targetState === 'warning') {
      tempVal = 48.6;
      airHumVal = 29;
      soilVal = 21;
      fireBit = 0;
      detClass = 'smoke';
      detConf = 0.94;
      bboxStr = '[142, 88, 210, 165]';
      rLevel = 'medium';
      rScore = 0.68;
      boxes = [{ type: 'smoke', confidence: 0.94, x: 41, y: 18, w: 32, h: 38, color: '#F59E0B' }];
    } else if (targetState === 'critical') {
      tempVal = 63.8;
      airHumVal = 18;
      soilVal = 15;
      fireBit = 1;
      detClass = 'fire';
      detConf = 0.96;
      bboxStr = '[168, 194, 144, 108]';
      rLevel = 'high';
      rScore = 0.87;
      boxes = [
        { type: 'smoke', confidence: 0.94, x: 41, y: 18, w: 32, h: 38, color: '#F59E0B' },
        { type: 'fire', confidence: 0.96, x: 46, y: 44, w: 18, h: 22, color: '#EF4444' }
      ];
    }

    const newSensorRow = {
      id: nextSensorId,
      temperature: tempVal,
      air_humidity: airHumVal,
      soil_moisture: soilVal,
      fire_sensor: fireBit,
      recorded_at: sqlTime
    };

    const newDetectionRow = {
      id: nextDetectionId,
      camera: 'CAM-01',
      image_path: frameFile,
      detected_class: detClass,
      confidence: detConf,
      bbox: bboxStr,
      detected_at: sqlTime,
      snapshotMeta: {
        scenario: targetState,
        temp: `${tempVal}°C`,
        smoke: targetState === 'critical' ? '490 PPM' : targetState === 'warning' ? '365 PPM' : '195 PPM',
        boxes
      }
    };

    const newPredictionRow = {
      id: nextPredictionId,
      sensor_reading: nextSensorId,
      risk_level: rLevel,
      risk_score: rScore,
      model_version: 'v1.0',
      predicted_at: sqlTime
    };

    setDbSensors((prev) => [newSensorRow, ...prev]);
    setDbDetections((prev) => [newDetectionRow, ...prev]);
    setDbPredictions((prev) => [newPredictionRow, ...prev]);

    let createdAlertId = null;
    if (rLevel === 'high' || rLevel === 'medium') {
      createdAlertId = nextAlertId;
      const newAlertRow = {
        id: nextAlertId,
        prediction: nextPredictionId,
        alert_type: rLevel === 'high' ? 'high fire risk' : 'smoke detected',
        message:
          rLevel === 'high'
            ? 'Risiko kebakaran tinggi'
            : 'Waspada indikasi asap & penurunan kelembapan tanah',
        created_at: sqlTime,
        status: 'active'
      };
      setDbAlerts((prev) => [newAlertRow, ...prev]);
    }

    setHighlightedChain({
      sensorId: nextSensorId,
      predictionId: nextPredictionId,
      alertId: createdAlertId
    });

    setSnapshotBanner('Record saved');
    setTimeout(() => setSnapshotBanner(null), 4000);
  };

  // Interactive "Analyze frame" handler specifically for Tab 2 (`camera_detections`)
  const handleAnalyzeFrame = (forcedClass = uploadClassPreset) => {
    const now = new Date();
    const sqlTime = formatSqlTimestamp(now);
    const nextDetectionId = (dbDetections[0]?.id || 0) + 1;
    const frameFile = `uploads/frame${String(nextDetectionId).padStart(3, '0')}.jpg`;

    const isFire = forcedClass === 'fire';
    const isSmoke = forcedClass === 'smoke';
    const conf = isFire ? 0.96 : isSmoke ? 0.94 : 0.99;
    const bbox = isFire
      ? '[168, 194, 144, 108]'
      : isSmoke
      ? '[142, 88, 210, 165]'
      : 'null';

    const boxes = isFire
      ? [
          { type: 'smoke', confidence: 0.94, x: 41, y: 18, w: 32, h: 38, color: '#F59E0B' },
          { type: 'fire', confidence: 0.96, x: 46, y: 44, w: 18, h: 22, color: '#EF4444' }
        ]
      : isSmoke
      ? [{ type: 'smoke', confidence: 0.94, x: 41, y: 18, w: 32, h: 38, color: '#F59E0B' }]
      : [];

    const newDetectionRow = {
      id: nextDetectionId,
      camera: 'CAM-01',
      image_path: frameFile,
      detected_class: forcedClass,
      confidence: conf,
      bbox,
      detected_at: sqlTime,
      snapshotMeta: {
        scenario: isFire ? 'critical' : isSmoke ? 'warning' : 'nominal',
        temp: `${metrics.temp.toFixed(1)}°C`,
        smoke: `${metrics.smoke} PPM`,
        boxes
      }
    };

    setDbDetections((prev) => [newDetectionRow, ...prev]);
    setSnapshotBanner(
      `Frame analyzed · ${forcedClass} · ${Math.round(conf * 100)}%`
    );
    setTimeout(() => setSnapshotBanner(null), 4000);
  };

  // Trigger state transition effects & DB row insertion
  const handleScenarioChange = (newState) => {
    setSimState(newState);

    if (newState === 'nominal') {
      setMetrics((prev) => ({
        ...prev,
        temp: 35.5,
        airHumidity: 42,
        soilMoisture: 28,
        fireSensor: 0,
        smoke: 195,
        windSpeed: 18.4,
        solarIrradiance: 840,
        pressure: 1008.4,
        phoneTemp: 33.0,
        mqttLatency: 38,
        detectedClass: 'none',
        visionConfidence: 0.98
      }));
      injectDatabaseRecord('nominal');
    } else if (newState === 'warning') {
      const newTemp = 48.6;
      setMetrics((prev) => ({
        ...prev,
        temp: newTemp,
        airHumidity: 29,
        soilMoisture: 21,
        fireSensor: 0,
        smoke: 365,
        windSpeed: 24.2,
        solarIrradiance: 910,
        pressure: 1006.8,
        peakTemp: Math.max(prev.peakTemp, newTemp),
        phoneTemp: 35.2,
        mqttLatency: 42,
        detectedClass: 'smoke',
        visionConfidence: 0.94
      }));
      injectDatabaseRecord('warning');
    } else if (newState === 'critical') {
      const newTemp = 63.8;
      setMetrics((prev) => ({
        ...prev,
        temp: newTemp,
        airHumidity: 18,
        soilMoisture: 15,
        fireSensor: 1,
        smoke: 490,
        windSpeed: 31.5,
        solarIrradiance: 965,
        pressure: 1004.2,
        peakTemp: Math.max(prev.peakTemp, newTemp),
        phoneTemp: 36.8,
        mqttLatency: 34,
        detectedClass: 'fire',
        visionConfidence: 0.96
      }));
      injectDatabaseRecord('critical');
    }
  };

  // Real-time 1-second clock & sensor simulation loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (!streamPaused) {
        setFrameTick((t) => (t + 1) % 1000);
      }

      setMetrics((prev) => {
        let targetTemp = 35.5;
        let targetAirHum = 42;
        let targetSoil = 28;
        let targetSmoke = 195;
        let targetWind = 18.4;

        if (simState === 'warning') {
          targetTemp = 48.6;
          targetAirHum = 29;
          targetSoil = 21;
          targetSmoke = 365;
          targetWind = 24.5;
        } else if (simState === 'critical') {
          targetTemp = 63.8;
          targetAirHum = 18;
          targetSoil = 15;
          targetSmoke = 495;
          targetWind = 31.8;
        }

        const nextTemp = Number(
          (prev.temp + (targetTemp - prev.temp) * 0.25 + (Math.random() - 0.48) * 0.25).toFixed(1)
        );
        const nextAirHum = Math.round(
          prev.airHumidity + (targetAirHum - prev.airHumidity) * 0.25 + (Math.random() - 0.5) * 0.8
        );
        const nextSoil = Math.round(
          prev.soilMoisture + (targetSoil - prev.soilMoisture) * 0.2 + (Math.random() - 0.5) * 0.4
        );
        const nextSmoke = Math.round(
          prev.smoke + (targetSmoke - prev.smoke) * 0.25 + (Math.random() - 0.48) * 5
        );
        const nextWind = Number(
          (prev.windSpeed + (targetWind - prev.windSpeed) * 0.2 + (Math.random() - 0.5) * 0.6).toFixed(1)
        );
        const nextFps = streamPaused
          ? 0.0
          : Number((29.8 + (Math.random() - 0.5) * 0.4).toFixed(1));
        const nextLatency = Math.round(36 + (Math.random() - 0.5) * 6);

        const computedRisk = Number(
          Math.min(
            0.99,
            Math.max(
              0.12,
              (nextTemp - 25) / 55 +
                (55 - nextAirHum) / 140 +
                (35 - nextSoil) / 120 +
                (simState === 'critical' ? 0.35 : simState === 'warning' ? 0.18 : 0)
            )
          ).toFixed(2)
        );

        if (now.getSeconds() % 2 === 0) {
          setTelemetryHistory((hist) => [
            ...hist.slice(1),
            {
              time: formatShortTime(now),
              fullTimestamp: formatTimestamp(now),
              temp: nextTemp,
              air_humidity: nextAirHum,
              soil_moisture: nextSoil,
              smoke: nextSmoke,
              risk_score: computedRisk
            }
          ]);

          setSparklineData((spark) => [
            ...spark.slice(1),
            { hour: formatShortTime(now), val: nextTemp }
          ]);
        }

        return {
          ...prev,
          temp: nextTemp,
          airHumidity: nextAirHum,
          soilMoisture: nextSoil,
          smoke: nextSmoke,
          windSpeed: nextWind,
          peakTemp: Math.max(prev.peakTemp, nextTemp),
          fps: nextFps,
          mqttLatency: nextLatency
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simState, streamPaused]);

  // Current risk status
  const threatAssessment = useMemo(() => {
    const level = liveRiskPrediction.risk_level;

    if (simState === 'critical' || level === 'high') {
      return {
        statusPill: 'Fire detected',
        color: '#EF4444',
        bgSubtle: 'rgba(239, 68, 68, 0.12)',
        borderSubtle: 'rgba(239, 68, 68, 0.35)',
        digest: 'Camera and flame sensor alert.'
      };
    }
    if (simState === 'warning' || level === 'medium') {
      return {
        statusPill: 'Smoke detected',
        color: '#F59E0B',
        bgSubtle: 'rgba(245, 158, 11, 0.12)',
        borderSubtle: 'rgba(245, 158, 11, 0.35)',
        digest: 'Smoke detected by camera.'
      };
    }
    return {
      statusPill: 'Normal',
      color: '#22C55E',
      bgSubtle: 'rgba(34, 197, 94, 0.10)',
      borderSubtle: 'rgba(34, 197, 94, 0.28)',
      digest: 'No signs detected.'
    };
  }, [liveRiskPrediction, simState]);

  // Filter chart points based on timeRange selector
  const displayedChartData = useMemo(() => {
    const counts = { '15m': 18, '1h': 24, '6h': 30, '24h': 36 };
    const sliceCount = counts[timeRange] || 24;
    return telemetryHistory.slice(-sliceCount);
  }, [telemetryHistory, timeRange]);

  const filteredAlerts = useMemo(() => {
    if (alertFilterStatus === 'all') return dbAlerts;
    return dbAlerts.filter((a) => a.status === alertFilterStatus);
  }, [dbAlerts, alertFilterStatus]);

  const handleUpdateAlertStatus = (alertId, newStatus) => {
    setDbAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
    );
  };

  const handleInspectAlertRelation = (alertRow) => {
    const linkedPred = dbPredictions.find((p) => p.id === alertRow.prediction);
    setHighlightedChain({
      alertId: alertRow.id,
      predictionId: alertRow.prediction,
      sensorId: linkedPred ? linkedPred.sensor_reading : null
    });
  };

  const handleCopySql = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(SQL_DDL_SCHEMA);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2500);
    }
  };

  return {
    simState,
    setSimState,
    currentTime,
    setCurrentTime,
    streamPaused,
    setStreamPaused,
    showOverlay,
    setShowOverlay,
    timeRange,
    setTimeRange,
    chartMode,
    setChartMode,
    moistureMode,
    setMoistureTypeNote,
    activeSnapshotModal,
    setActiveSnapshotModal,
    snapshotBanner,
    setSnapshotBanner,
    activeDbTab,
    setActiveDbTab,
    dbSensors,
    setDbSensors,
    dbDetections,
    setDbDetections,
    dbPredictions,
    setDbPredictions,
    dbAlerts,
    setDbAlerts,
    uploadClassPreset,
    setUploadClassPreset,
    alertFilterStatus,
    setAlertFilterStatus,
    highlightedChain,
    setHighlightedChain,
    copiedSql,
    setCopiedSql,
    telemetryHistory,
    setTelemetryHistory,
    sparklineData,
    setSparklineData,
    metrics,
    setMetrics,
    frameTick,
    setFrameTick,
    liveRiskPrediction,
    injectDatabaseRecord,
    handleAnalyzeFrame,
    handleScenarioChange,
    threatAssessment,
    displayedChartData,
    filteredAlerts,
    handleUpdateAlertStatus,
    handleInspectAlertRelation,
    handleCopySql
  };
}
