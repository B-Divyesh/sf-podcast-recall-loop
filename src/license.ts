const SLUG = 'podcast-recall-loop';
const API = 'https://api.sociobot.in/api/v1';
const KEY = `sb_license:${SLUG}`;
const VERDICT_KEY = `${KEY}:verdict`;

interface Verdict { valid: boolean; checkedAt: number }

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
  const token = localStorage.getItem(KEY);
  if (!token) return false;
  try {
    const verdict = JSON.parse(localStorage.getItem(VERDICT_KEY) || '') as Verdict;
    return verdict.valid;
  } catch {
    return true;
  }
}

export async function verifyLicense(force = false): Promise<boolean> {
  const token = localStorage.getItem(KEY);
  if (!token) return false;
  try {
    const cached = JSON.parse(localStorage.getItem(VERDICT_KEY) || '') as Verdict;
    if (!force && Date.now() - cached.checkedAt < 86_400_000) return cached.valid;
  } catch { /* Verify now. */ }
  try {
    const response = await fetch(`${API}/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    const result = await response.json() as { valid: boolean };
    localStorage.setItem(VERDICT_KEY, JSON.stringify({ valid: result.valid, checkedAt: Date.now() }));
    return result.valid;
  } catch {
    return cachedUnlocked();
  }
}

export async function restoreLicense(token: string): Promise<boolean> {
  localStorage.setItem(KEY, token.trim());
  localStorage.removeItem(VERDICT_KEY);
  return verifyLicense(true);
}
