# ERDCloud Ads Blocker

A Chrome extension that removes on ERDCloud.

<img src="./public/example.png" alt="Example Screenshot" width="400"/>

## Installation

### Method 1: Chrome Extension

1. Open `chrome://extensions` in Chrome
2. Enable Developer mode
3. Click "Load unpacked"
4. Select this folder

### Method 2: Console Script (Quick & Easy)

If you are sick of installing more extensions, simply copy the code bellow and paste it into the browser's Developer Tools console (F12) on ERDCloud.

```javascript
    (()=>{"use strict";let e=".erd-ads-area{display:none!important}.ads-block-warning-overlay{display:none!important}.wrapContentERD .erdWrap{width:100%!important}",t="__erdcloud_layout_canvas_fix_style__";function n(){if(document.getElementById(t))return;let n=document.createElement("style");n.id=t,n.type="text/css",n.textContent=e,document.head.appendChild(n)}function i(){let e=window.devicePixelRatio||1;document.querySelectorAll("canvas").forEach(t=>{let n=t.getBoundingClientRect();if(!n.width||!n.height)return;let i=Math.round(n.width*e),r=Math.round(n.height*e);if(t.width!==i||t.height!==r){t.width=i,t.height=r;let a=t.getContext("2d");a&&a.setTransform(e,0,0,e,0,0)}})}function r(){window.dispatchEvent(new Event("resize"))}function a(){n(),requestAnimationFrame(()=>{i(),r()})}function d(e,t){let n=null;return()=>{n&&clearTimeout(n),n=setTimeout(()=>e(),t)}}a(),window.addEventListener("resize",d(()=>{i()},100),{passive:!0});let l=d(a,150),o=new MutationObserver(()=>{l()});o.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0})})();
```