export function renderServiceWorker(template: string, html: string): string;
export function renderRouteShell(html: string, path: '/demo' | '/app' | '/privacy' | '/terms' | '/404'): string;
export function finalizeBuild(root?: string): Promise<void>;
