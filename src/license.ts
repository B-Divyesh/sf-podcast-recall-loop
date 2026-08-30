const SLUG = 'podcast-recall-loop';
const API = 'https://api.sociobot.in/api/v1';
const KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${KEY}:verdict`;

interface Verdict { valid: boolean; checkedAt: number }

export interface LicenseCheck {
  unlocked: boolean;
  outcome: 'valid' | 'invalid' | 'unavailable' | 'missing';
}

function cachedVerdict(): Verdict | null {
  try {
    const value = JSON.parse(localStorage.getItem(VERDICT_KEY) || '') as unknown;
    if (
      typeof value !== 'object'
      || value === null
      || typeof (value as Partial<Verdict>).valid !== 'boolean'
      || !Number.isFinite((value as Partial<Verdict>).checkedAt)
    ) return null;
    return value as Verdict;
  } catch {
    return null;
  }
}

export function buyUrl(): string {
  return `${API}/products/${SLUG}/checkout`;
}

export function acceptLicenseFromUrl(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(KEY, token);
  localStorage.removeItem(VERDICT_KEY);
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function cachedUnlocked(): boolean {
  return Boolean(localStorage.getItem(KEY)) && cachedVerdict()?.valid === true;
}

export async function verifyLicense(force = false): Promise<LicenseCheck> {
  const token = localStorage.getItem(KEY);
  if (!token) return { unlocked: false, outcome: 'missing' };
  const cached = cachedVerdict();
  if (!force && cached && Date.now() - cached.checkedAt < 86_400_000) {
    return { unlocked: cached.valid, outcome: cached.valid ? 'valid' : 'invalid' };
  }
  try {
    const response = await fetch(`${API}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('verification unavailable');
    const result = await response.json() as { valid?: unknown };
    if (typeof result.valid !== 'boolean') throw new Error('verification unavailable');
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return { unlocked: result.valid, outcome: result.valid ? 'valid' : 'invalid' };
  } catch {
    return { unlocked: cached?.valid === true, outcome: 'unavailable' };
  }
}

export async function restoreLicense(token: string): Promise<LicenseCheck> {
  const normalized = token.trim();
  if (!normalized) return { unlocked: false, outcome: 'missing' };
  localStorage.setItem(KEY, normalized);
  localStorage.removeItem(VERDICT_KEY);
  return verifyLicense(true);
}
