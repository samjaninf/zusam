parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"vRk2":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.get=o,exports.set=n,exports.del=s,exports.clear=i,exports.keys=u,exports.Store=void 0;class e{constructor(e="keyval-store",t="keyval"){this.storeName=t,this._dbp=new Promise((r,o)=>{const n=indexedDB.open(e,1);n.onerror=(()=>o(n.error)),n.onsuccess=(()=>r(n.result)),n.onupgradeneeded=(()=>{n.result.createObjectStore(t)})})}_withIDBStore(e,t){return this._dbp.then(r=>new Promise((o,n)=>{const s=r.transaction(this.storeName,e);s.oncomplete=(()=>o()),s.onabort=s.onerror=(()=>n(s.error)),t(s.objectStore(this.storeName))}))}}let t;function r(){return t||(t=new e),t}function o(e,t=r()){let o;return t._withIDBStore("readonly",t=>{o=t.get(e)}).then(()=>o.result)}function n(e,t,o=r()){return o._withIDBStore("readwrite",r=>{r.put(t,e)})}function s(e,t=r()){return t._withIDBStore("readwrite",t=>{t.delete(e)})}function i(e=r()){return e._withIDBStore("readwrite",e=>{e.clear()})}function u(e=r()){const t=[];return e._withIDBStore("readonly",e=>{(e.openKeyCursor||e.openCursor).call(e).onsuccess=function(){this.result&&(t.push(this.result.key),this.result.continue())}}).then(()=>t)}exports.Store=e;
},{}],"qGzB":[function(require,module,exports) {
"use strict";var e=require("idb-keyval");const t="4.1",n="0.2",s="zusam-4.1-simplecache-0.2",u=new e.Store("zusam-4.1",s),r={"/api/users/":864e5,"/api/images/crop/":null,"/api/images/thumbnail/":null,"/api/links/by_url?":null};function l(e,t){return fetch(e).then(n=>{if(t){let u=n.clone();caches.open(s).then(n=>{t(n,e,u)})}return n})}function a(t){return caches.open(s).then(n=>n.match(t).then(n=>n?(0,e.set)(t.url,{lastUsed:Date.now()},u).then(e=>n):l(t,!0)))}function i(e){return caches.open(s).then(t=>fetch(e).then(n=>c(t,e,n)))}function c(t,n,s){return(0,e.set)(n.url,{lastUsed:Date.now()},u).then(e=>t.put(n,s))}self.addEventListener("fetch",function(t){if("GET"==t.request.method){if(!Object.keys(r).some(e=>t.request.url.includes(e)))return l(t.request,!1);t.respondWith(a(t.request)),t.waitUntil(n=>{(0,e.get)(t.request.url,u).then(e=>{if(e&&e.hasOwnProperty("lastUsed")&&null!=e.lastUsed){e.lastUsed+r[Object.keys(r).find(e=>t.request.url.includes(e))]<Date.now()&&i(t.request)}}).catch(e=>i(t.request))})}});
},{"idb-keyval":"vRk2"}]},{},["qGzB"], null)
//# sourceMappingURL=service-workers.js.map