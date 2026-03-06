
/**
 * Omniverse Background Engine Manager
 * Starts the Scheduler and Worker processes.
 */
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("-----------------------------------------");
console.log("🚀 OMNIVERSE BACKGROUND ENGINE (ESM)");
console.log("-----------------------------------------");

const scheduler = spawn('node', [join(__dirname, 'lib/queue/scheduler.js')], { stdio: 'inherit' });
const worker = spawn('node', [join(__dirname, 'lib/queue/worker-process.js')], { stdio: 'inherit' });
const socialWorker = spawn('node', [join(__dirname, 'social-worker.js')], { stdio: 'inherit' });
const reconWorker = spawn('node', [join(__dirname, 'system-recon-worker.js')], { stdio: 'inherit' });

process.on('SIGINT', () => {
    scheduler.kill();
    worker.kill();
    socialWorker.kill();
    reconWorker.kill();
    process.exit();
});

scheduler.on('exit', (code) => {
    console.error(`Scheduler exited with code ${code}`);
    process.exit(1);
});

worker.on('exit', (code) => {
    console.error(`Worker exited with code ${code}`);
    process.exit(1);
});
