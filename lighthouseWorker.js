import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';
import path from 'path';

export async function runLighthouse(url, jobId) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };

  try {
    const results = await lighthouse(url, options);
    await chrome.kill();
    fs.writeFileSync(path.join(__dirname, `public/reports/report_${jobId}.html`), results.report);
  } catch (error) {
    console.error('Error running Lighthouse:', error);
    await chrome.kill();
  }
}
