// Date formatting helpers.
const pad2 = (value) => String(value).padStart(2, '0');

export const formatTimestamp = (date) =>
  `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()} ${pad2(
    date.getHours()
  )}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;

export const formatSqlTimestamp = formatTimestamp;

export const formatShortTime = (date) =>
  `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;

