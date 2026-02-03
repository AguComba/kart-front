const pad = (value: number, length = 2) => value.toString().padStart(length, '0');

export const formatMs = (ms?: number) => {
  if (ms === undefined || ms === null) return '';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;
  return `${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`;
};

export const parseTimeToMs = (value: string) => {
  if (!value) return undefined;
  const match = /^(\d{1,2}):(\d{2})\.(\d{1,3})$/.exec(value.trim());
  if (!match) return undefined;
  const minutes = Number(match[1]);
  const seconds = Number(match[2]);
  const millis = Number(match[3].padEnd(3, '0'));
  return minutes * 60 * 1000 + seconds * 1000 + millis;
};
