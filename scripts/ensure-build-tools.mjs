import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const requiredTools = [
  'node_modules/typescript/bin/tsc',
  'node_modules/vite/bin/vite.js'
];

if (!requiredTools.every(path => existsSync(path))) {
  process.stdout.write('Build tools are missing; installing the locked development dependencies.\n');
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npm, ['ci', '--no-audit', '--no-fund'], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
