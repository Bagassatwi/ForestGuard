import { formatTimestamp, formatShortTime } from './date';

// Generate initial historical time-series data including air_humidity, soil_moisture, and risk_score
export const generateInitialTelemetry = (points = 36) => {
  const now = new Date();
  const data = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5000);
    const baseTemp = 35.5 + Math.sin(i * 0.25) * 0.8 + (Math.random() - 0.5) * 0.3;
    const baseAirHum = 42 + Math.cos(i * 0.2) * 2 + (Math.random() - 0.5) * 1.2;
    const baseSoilMoist = 28 + Math.sin(i * 0.12) * 1.1;
    const baseSmoke = 195 + Math.cos(i * 0.2) * 14 + (Math.random() - 0.5) * 6;
    const riskScore = Number(
      Math.min(
        0.98,
        Math.max(0.12, (baseTemp - 25) / 55 + (50 - baseAirHum) / 140 + (35 - baseSoilMoist) / 150)
      ).toFixed(2)
    );
    data.push({
      time: formatShortTime(t),
      fullTimestamp: formatTimestamp(t),
      temp: Number(baseTemp.toFixed(1)),
      air_humidity: Math.round(baseAirHum),
      soil_moisture: Math.round(baseSoilMoist),
      smoke: Math.round(baseSmoke),
      risk_score: riskScore
    });
  }
  return data;
};

// Generate sparkline data for the temperature card
export const INITIAL_SPARKLINE = Array.from({ length: 24 }, (_, idx) => ({
  hour: `${idx}:00`,
  val: Number((28.5 + Math.sin((idx / 24) * Math.PI) * 11.5 + (Math.random() - 0.5) * 1.0).toFixed(1))
}));

