!function(){const e=[{route:new RegExp("/api/images/crop/")},{route:new RegExp("/api/images/thumbnail/")},{route:new RegExp("/api/links/by_url?")}];self.addEventListener("fetch",(e=>{e.respondWith(t(e.request))}));const t=async t=>"GET"==t.method&&e.some((e=>t.url.match(e.route)))?n({request:t}):fetch(t),n=async({request:e})=>{const t=await caches.match(e);if(t)return t;try{const t=await fetch(e);return a(e,t.clone()),t}catch(e){return new Response("Network error happened",{status:408,headers:{"Content-Type":"text/plain"}})}},a=async(e,t)=>{const n=await caches.open("zusam-0.5.3");await n.put(e,t)}}();
//# sourceMappingURL=service-workers.js.map
