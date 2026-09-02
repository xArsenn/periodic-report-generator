import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';

const args=process.argv.slice(2);const input=args[0];const oi=args.indexOf('--out');const output=oi>=0?args[oi+1]:null;
if(!input||!output){console.error('Usage: node export-html-pdf.mjs <html> --out <pdf>');process.exit(2)}
const require=createRequire(import.meta.url);let playwright;
try{playwright=require('playwright')}catch{
  const bundled=path.resolve(path.dirname(process.execPath),'..','node_modules','playwright');
  if(!fs.existsSync(bundled)){throw new Error('Playwright was not found. Use the Codex workspace Node runtime or install playwright.')}
  playwright=require(bundled);
}
const executablePath=playwright.chromium.executablePath();
if(!fs.existsSync(executablePath)){throw new Error(`Playwright Chromium was not found: ${executablePath}`)}
const browser=await playwright.chromium.launch({headless:true,executablePath,args:['--disable-gpu','--disable-software-rasterizer']});
try{
  const page=await browser.newPage({viewport:{width:1920,height:1080}});
  await page.goto(pathToFileURL(path.resolve(input)).href,{waitUntil:'load'});
  await page.emulateMedia({media:'print'});
  await page.pdf({path:path.resolve(output),width:'13.333in',height:'7.5in',printBackground:true,margin:{top:'0',right:'0',bottom:'0',left:'0'},preferCSSPageSize:false});
}finally{await browser.close()}
console.log(`PDF exported: ${path.resolve(output)}`);
