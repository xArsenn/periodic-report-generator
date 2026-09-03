import fs from 'node:fs';
import vm from 'node:vm';
const file=process.argv[2];
if(!file)throw new Error('Usage: node validate-professional-deck.mjs file.html');
const html=fs.readFileSync(file,'utf8');
const pages=[...html.matchAll(/<section\b[^>]*class="slide\b[^>]*>[\s\S]*?<\/section>/g)].map(m=>m[0]);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const errors=[];
if(!pages.length)errors.push('No slides');
if(ids.length!==new Set(ids).size)errors.push('Duplicate IDs');
if(!pages.at(-1)?.includes('THANKS'))errors.push('Missing THANKS ending');
if(pages.some(p=>/<h[12][^>]*>[\s\S]*?<br\b[\s\S]*?<\/h[12]>/.test(p)))errors.push('Manual heading break');
if(/(?:src|href)="https?:\/\//.test(html))errors.push('External dependency');
for(const [,script]of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){try{new vm.Script(script)}catch(e){errors.push(e.message)}}
if(!html.includes('deck-enhancements'))errors.push('Missing enhanced interaction');
console.log(JSON.stringify({file,pages:pages.length,errors,visualQA:'not performed by this structural validator'},null,2));
if(errors.length)process.exitCode=1;
