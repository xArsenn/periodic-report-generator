import fs from 'node:fs';
import path from 'node:path';

const args=process.argv.slice(2);const input=args[0];const outIndex=args.indexOf('--out');const output=outIndex>=0?args[outIndex+1]:input;
if(!input||!output){console.error('Usage: node embed-local-images.mjs <html> --out <html>');process.exit(2)}
const base=path.dirname(path.resolve(input));let html=fs.readFileSync(input,'utf8');
html=html.replace(/(<img\b[^>]*\bsrc=["'])([^"']+)(["'][^>]*>)/gi,(all,a,src,z)=>{if(/^(?:data:|https?:|#)/i.test(src))return all;const file=path.resolve(base,decodeURIComponent(src));if(!fs.existsSync(file)){console.warn(`Missing image: ${src}`);return all}const ext=path.extname(file).slice(1).toLowerCase();const mime={jpg:'image/jpeg',jpeg:'image/jpeg',png:'image/png',webp:'image/webp',gif:'image/gif',svg:'image/svg+xml'}[ext];if(!mime){console.warn(`Unsupported image type: ${src}`);return all}return `${a}data:${mime};base64,${fs.readFileSync(file).toString('base64')}${z}`});
fs.writeFileSync(output,html,'utf8');console.log(`Embedded local images: ${output}`);
