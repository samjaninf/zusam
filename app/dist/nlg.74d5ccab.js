parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"vjjh":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;let e={list:[],bodyStyle:"",nlgStyles:`\n        .nlg-left {\n            left: -${document.body.clientWidth}px !important;\n        }\n        .nlg-right {\n            left: ${2*document.body.clientWidth}px !important;\n        }\n    `,clickFn:t=>{t.preventDefault(),t.ctrlKey?window.open(t.currentTarget.getAttribute("href"),"_blank"):e.show(t.currentTarget)},stop:()=>{e.hide(),document.querySelectorAll("[data-nlg]").forEach(t=>t.removeEventListener("click",e.clickFn)),window.removeEventListener("routerStateChange",e.stop),window.removeEventListener("popstate",e.stop)},start:()=>{if(e.stop(),e.list=[],!document.getElementById("nlg-styles")){let t=document.createElement("style");t.id="nlg-styles",t.innerHTML=e.nlgStyles,document.body.append(t)}setTimeout(()=>{document.querySelectorAll("[data-nlg]").forEach(t=>{e.list.find(e=>e.getAttribute("href")==t.getAttribute("href"))||(e.list.push(t),t.addEventListener("click",e.clickFn))})},100),window.addEventListener("routerStateChange",e.stop),window.addEventListener("popstate",e.stop)},show:(t,n=!1,d=null)=>{let l,o=t.dataset.src||t.src||t.href;switch(!0){case/\.(webm|mp4)$/.test(o):(l=document.createElement("video")).setAttribute("controls",!0);break;case/\.(pdf)$/.test(o):l=document.createElement("iframe");break;case/\.(jpg|jpeg|png|bmp|webp|gif|svg)$/.test(o):default:l=document.createElement("img")}if(l.classList.add("nlg-media"),d&&l.classList.add(`nlg-${d}`),e.bodyStyle=document.body.style.cssText,document.body.style.cssText="overflow: hidden",!n){let t=document.createElement("div");t.id="nlg-modal-bg",t.addEventListener("click",t=>{t.currentTarget==t.target&&e.hide()});let n=document.createElement("a");n.id="nlg-close",n.innerHTML="&times;",n.addEventListener("click",e.hide),e.keyPressClose=(t=>("Escape"==t.key||"Escape"==t.code)&&e.hide()),window.addEventListener("keydown",e.keyPressClose),document.body.appendChild(n),document.body.appendChild(t)}let i=document.createElement("div");i.classList.add("spinner");for(let e=0;e<5;e++)i.appendChild(document.createElement("div"));setTimeout(()=>{let e=document.querySelector("#nlg-modal-bg .spinner");e&&(e.style.opacity=1)},500),document.getElementById("nlg-modal-bg")&&document.getElementById("nlg-modal-bg").appendChild(i);let r=document.createElement("div");r.id="nlg-modal";let s=()=>{if(!document.getElementById("nlg-modal-bg"))return void e.hide();let n=document.querySelector("#nlg-modal-bg .spinner");if(n&&(n.outerHTML=""),t.dataset.origin){let e=document.createElement("a");e.id="nlg-download",e.href=t.dataset.origin,e.target="_blank",e.innerHTML="&#8615;",e.download=new URL(t.dataset.origin).pathname.split("/").slice(-1),document.body.appendChild(e)}let d="VIDEO"==l.tagName?l.videoWidth:l.width,i="VIDEO"==l.tagName?l.videoHeight:l.height,s="IFRAME"==l.tagName?9/16:d/i;l.width=Math.min(document.body.clientWidth,d),l.height=Math.min(document.body.clientHeight,l.width/s),l.width=l.height*s,"IFRAME"==l.tagName&&(l.height=document.body.clientHeight-10,l.width=Math.max(document.body.clientWidth-200,.8*document.body.clientWidth));let a=e.list.findIndex(e=>o===(e.dataset.src||e.src||e.href)),c=e.list[a+1],m=e.list[a-1];if(c){let t=document.createElement("a");t.classList.add("nlg-next"),t.innerHTML="&#10095;";let n=()=>{e.moveLeft(),setTimeout(()=>{e.hide(!0),e.show(c,!0,"right")},300)};t.addEventListener("click",n),e.keyPressRight=(e=>("ArrowRight"==e.key||"ArrowRight"==e.code)&&n(e)),window.addEventListener("keydown",e.keyPressRight),r.appendChild(t)}if(m){let t=document.createElement("a");t.innerHTML="&#10094;",t.classList.add("nlg-prev");let n=()=>{e.moveRight(),setTimeout(()=>{e.hide(!0),e.show(m,!0,"left")},300)};t.addEventListener("click",n),e.keyPressLeft=(e=>("ArrowLeft"==e.key||"ArrowLeft"==e.code)&&n(e)),window.addEventListener("keydown",e.keyPressLeft),r.appendChild(t)}r.style.cssText="opacity: 1;",setTimeout(e.center,1)};l.addEventListener("load",s),l.addEventListener("loadeddata",s),r.addEventListener("click",t=>{t.currentTarget==t.target&&e.hide()}),r.appendChild(l),document.body.appendChild(r),l.src=o,"VIDEO"==l.tagName&&l.play()},hide:(t=!1)=>{document.getElementById("nlg-modal")&&(window.removeEventListener("keydown",e.keyPressRight),window.removeEventListener("keydown",e.keyPressLeft),document.body.style.cssText=e.bodyStyle,document.getElementById("nlg-modal").outerHTML="",document.getElementById("nlg-download")&&(document.getElementById("nlg-download").outerHTML=""),1!=t&&((document.querySelector("#nlg-close")||{}).outerHTML="",(document.getElementById("nlg-modal-bg")||{}).outerHTML="",window.removeEventListener("keydown",e.keyPressClose)))},moveLeft:()=>document.querySelector("#nlg-modal > .nlg-media").classList.add("nlg-left"),moveRight:()=>document.querySelector("#nlg-modal > .nlg-media").classList.add("nlg-right"),center:()=>{let e=document.querySelector("#nlg-modal > .nlg-media");e.classList.remove("nlg-right"),e.classList.remove("nlg-left")}};var t=e;exports.default=t;
},{}]},{},["vjjh"], null)
//# sourceMappingURL=nlg.74d5ccab.js.map