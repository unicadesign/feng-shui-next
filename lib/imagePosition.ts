const POSITION_PARAM = 'fpos';

export type FocalPoint = { x: number; y: number };

export function parseImageUrl(url: string | null | undefined): { src: string; position?: string } {
  if (!url) return { src: '' };
  const hashIdx = url.indexOf('#');
  if (hashIdx === -1) return { src: url };
  const baseUrl = url.slice(0, hashIdx);
  const hash = url.slice(hashIdx + 1);
  const params = new URLSearchParams(hash);
  const raw = params.get(POSITION_PARAM);
  if (!raw) return { src: baseUrl };
  const [xStr, yStr] = raw.split(',');
  const x = Number(xStr);
  const y = Number(yStr);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { src: baseUrl };
  return { src: baseUrl, position: `${x}% ${y}%` };
}

export function parseFocalPoint(url: string | null | undefined): FocalPoint {
  if (!url) return { x: 50, y: 50 };
  const hashIdx = url.indexOf('#');
  if (hashIdx === -1) return { x: 50, y: 50 };
  const params = new URLSearchParams(url.slice(hashIdx + 1));
  const raw = params.get(POSITION_PARAM);
  if (!raw) return { x: 50, y: 50 };
  const [xStr, yStr] = raw.split(',');
  const x = Number(xStr);
  const y = Number(yStr);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return { x: 50, y: 50 };
  return { x, y };
}

export function withFocalPoint(url: string, point: FocalPoint | null): string {
  if (!url) return url;
  const hashIdx = url.indexOf('#');
  const baseUrl = hashIdx === -1 ? url : url.slice(0, hashIdx);
  if (!point) return baseUrl;
  const x = Math.round(clamp(point.x, 0, 100));
  const y = Math.round(clamp(point.y, 0, 100));
  if (x === 50 && y === 50) return baseUrl;
  return `${baseUrl}#${POSITION_PARAM}=${x},${y}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
