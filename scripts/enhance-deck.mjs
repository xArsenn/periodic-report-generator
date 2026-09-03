// Enhancements for the template-professional.html DOM contract. No dependencies.
export function enhanceDeck(html) {
  if (html.includes('id="deck-enhancements"')) return html;
  const css = `<style id="deck-enhancements">
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.controls{transition:opacity .2s}.presenting.controls-idle .controls{opacity:0;pointer-events:none}.presenting.controls-idle .controls:focus-within{opacity:1;pointer-events:auto}
.shot img{cursor:zoom-in}.shot img:focus-visible{outline:3px solid #007a78;outline-offset:3px}
#image-viewer{position:fixed;inset:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;border:0;padding:48px;background:#102636;color:white;z-index:100}
#image-viewer::backdrop{background:#102636}#image-viewer img{width:100%;height:calc(100% - 55px);object-fit:contain}
#image-viewer button{position:absolute;right:22px;top:12px;background:white;color:#153650;border:0;padding:10px 20px;font-size:18px}#image-viewer p{text-align:center;font-size:18px}
@media(prefers-reduced-motion:reduce){.controls{transition:none}}
@media print{#image-viewer{display:none!important}.slide:last-of-type{break-after:auto;page-break-after:auto}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
</style>`;
  const script = `<script>
(()=>{
 const nav=document.querySelector('.controls');if(!nav)return;
 const viewer=document.createElement('dialog');viewer.id='image-viewer';viewer.setAttribute('aria-label','图片放大');
 viewer.innerHTML='<button type="button">关闭</button><img alt=""><p></p>';document.body.append(viewer);
 let trigger=null,timer;const close=()=>{viewer.close();trigger?.focus()};viewer.querySelector('button').onclick=close;
 viewer.addEventListener('cancel',e=>{e.preventDefault();close()});
 document.querySelectorAll('.shot img').forEach(img=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','放大：'+img.alt);const open=()=>{trigger=img;viewer.querySelector('img').src=img.src;viewer.querySelector('img').alt=img.alt;viewer.querySelector('p').textContent=img.alt;viewer.showModal()};img.onclick=open;img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();open()}})});
 // Stop deck navigation while the native modal is open; Escape belongs to it.
 window.addEventListener('keydown',e=>{if(viewer.open){e.stopImmediatePropagation();if(e.key==='Escape'){e.preventDefault();close()}}},true);
 ['wheel','touchstart','touchend'].forEach(type=>window.addEventListener(type,e=>{if(viewer.open)e.stopImmediatePropagation()},true));
 const mode=document.createElement('button');mode.textContent='演示';mode.setAttribute('aria-pressed','false');nav.prepend(mode);
 const wake=()=>{document.body.classList.remove('controls-idle');clearTimeout(timer);if(document.body.classList.contains('presenting'))timer=setTimeout(()=>document.body.classList.add('controls-idle'),2400)};
 mode.onclick=()=>{const active=document.body.classList.toggle('presenting');mode.textContent=active?'退出演示':'演示';mode.setAttribute('aria-pressed',String(active));wake()};
 addEventListener('pointermove',wake);addEventListener('keydown',wake);nav.addEventListener('focusin',wake);
 const full=document.createElement('button');full.textContent='全屏';nav.prepend(full);
 full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch(error){console.warn('当前环境不支持全屏，请使用浏览器全屏功能。',error)}};
 document.addEventListener('fullscreenchange',()=>full.textContent=document.fullscreenElement?'退出全屏':'全屏');
})();
</script>`;
  return html.replace("if(e.ctrlKey||e.metaKey||e.altKey)return;", "if(e.ctrlKey||e.metaKey||e.altKey)return;if(e.target.closest?.('button,input,textarea,select,a,[contenteditable]'))return;")
    .replace('</head>',css+'</head>').replace('</body>',script+'</body>');
}
