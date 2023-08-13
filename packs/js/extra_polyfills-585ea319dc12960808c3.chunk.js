/*! For license information please see extra_polyfills-585ea319dc12960808c3.chunk.js.LICENSE.txt */
(self.webpackChunkmangane_fe=self.webpackChunkmangane_fe||[]).push([[5],{1349:function(){!function(){"use strict";if("object"==typeof window)if("IntersectionObserver"in window&&"IntersectionObserverEntry"in window&&"intersectionRatio"in window.IntersectionObserverEntry.prototype)"isIntersecting"in window.IntersectionObserverEntry.prototype||Object.defineProperty(window.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}});else{var t=function(t){for(var e=window.document,n=o(e);n;)n=o(e=n.ownerDocument);return e}(),e=[],n=null,i=null;s.prototype.THROTTLE_TIMEOUT=100,s.prototype.POLL_INTERVAL=null,s.prototype.USE_MUTATION_OBSERVER=!0,s._setupCrossOriginUpdater=function(){return n||(n=function(t,n){i=t&&n?h(t,n):{top:0,bottom:0,left:0,right:0,width:0,height:0},e.forEach((function(t){t._checkForIntersections()}))}),n},s._resetCrossOriginUpdater=function(){n=null,i=null},s.prototype.observe=function(t){if(!this._observationTargets.some((function(e){return e.element==t}))){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(t.ownerDocument),this._checkForIntersections()}},s.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter((function(e){return e.element!=t})),this._unmonitorIntersections(t.ownerDocument),0==this._observationTargets.length&&this._unregisterInstance()},s.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorAllIntersections(),this._unregisterInstance()},s.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},s.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter((function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]}))},s.prototype._parseRootMargin=function(t){var e=(t||"0px").split(/\s+/).map((function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}}));return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},s.prototype._monitorIntersections=function(e){var n=e.defaultView;if(n&&-1==this._monitoringDocuments.indexOf(e)){var i=this._checkForIntersections,r=null,s=null;this.POLL_INTERVAL?r=n.setInterval(i,this.POLL_INTERVAL):(c(n,"resize",i,!0),c(e,"scroll",i,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in n&&(s=new n.MutationObserver(i)).observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0})),this._monitoringDocuments.push(e),this._monitoringUnsubscribes.push((function(){var t=e.defaultView;t&&(r&&t.clearInterval(r),u(t,"resize",i,!0)),u(e,"scroll",i,!0),s&&s.disconnect()}));var a=this.root&&(this.root.ownerDocument||this.root)||t;if(e!=a){var l=o(e);l&&this._monitorIntersections(l.ownerDocument)}}},s.prototype._unmonitorIntersections=function(e){var n=this._monitoringDocuments.indexOf(e);if(-1!=n){var i=this.root&&(this.root.ownerDocument||this.root)||t,r=this._observationTargets.some((function(t){var n=t.element.ownerDocument;if(n==e)return!0;for(;n&&n!=i;){var r=o(n);if((n=r&&r.ownerDocument)==e)return!0}return!1}));if(!r){var s=this._monitoringUnsubscribes[n];if(this._monitoringDocuments.splice(n,1),this._monitoringUnsubscribes.splice(n,1),s(),e!=i){var c=o(e);c&&this._unmonitorIntersections(c.ownerDocument)}}}},s.prototype._unmonitorAllIntersections=function(){var t=this._monitoringUnsubscribes.slice(0);this._monitoringDocuments.length=0,this._monitoringUnsubscribes.length=0;for(var e=0;e<t.length;e++)t[e]()},s.prototype._checkForIntersections=function(){if(this.root||!n||i){var t=this._rootIsInDom(),e=t?this._getRootRect():{top:0,bottom:0,left:0,right:0,width:0,height:0};this._observationTargets.forEach((function(i){var o=i.element,s=a(o),c=this._rootContainsTarget(o),u=i.entry,l=t&&c&&this._computeTargetAndRootIntersection(o,s,e),h=null;this._rootContainsTarget(o)?n&&!this.root||(h=e):h={top:0,bottom:0,left:0,right:0,width:0,height:0};var f=i.entry=new r({time:window.performance&&performance.now&&performance.now(),target:o,boundingClientRect:s,rootBounds:h,intersectionRect:l});u?t&&c?this._hasCrossedThreshold(u,f)&&this._queuedEntries.push(f):u&&u.isIntersecting&&this._queuedEntries.push(f):this._queuedEntries.push(f)}),this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)}},s.prototype._computeTargetAndRootIntersection=function(e,o,r){if("none"!=window.getComputedStyle(e).display){for(var s,c,u,l,f,g,m,p,b=o,v=d(e),w=!1;!w&&v;){var y=null,_=1==v.nodeType?window.getComputedStyle(v):{};if("none"==_.display)return null;if(v==this.root||9==v.nodeType)if(w=!0,v==this.root||v==t)n&&!this.root?!i||0==i.width&&0==i.height?(v=null,y=null,b=null):y=i:y=r;else{var I=d(v),T=I&&a(I),E=I&&this._computeTargetAndRootIntersection(I,T,r);T&&E?(v=I,y=h(T,E)):(v=null,b=null)}else{var R=v.ownerDocument;v!=R.body&&v!=R.documentElement&&"visible"!=_.overflow&&(y=a(v))}if(y&&(s=y,c=b,void 0,void 0,void 0,void 0,void 0,void 0,u=Math.max(s.top,c.top),l=Math.min(s.bottom,c.bottom),f=Math.max(s.left,c.left),p=l-u,b=(m=(g=Math.min(s.right,c.right))-f)>=0&&p>=0&&{top:u,bottom:l,left:f,right:g,width:m,height:p}||null),!b)break;v=v&&d(v)}return b}},s.prototype._getRootRect=function(){var e;if(this.root&&!g(this.root))e=a(this.root);else{var n=g(this.root)?this.root:t,i=n.documentElement,o=n.body;e={top:0,left:0,right:i.clientWidth||o.clientWidth,width:i.clientWidth||o.clientWidth,bottom:i.clientHeight||o.clientHeight,height:i.clientHeight||o.clientHeight}}return this._expandRectByRootMargin(e)},s.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map((function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100})),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},s.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,i=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==i)for(var o=0;o<this.thresholds.length;o++){var r=this.thresholds[o];if(r==n||r==i||r<n!=r<i)return!0}},s.prototype._rootIsInDom=function(){return!this.root||f(t,this.root)},s.prototype._rootContainsTarget=function(e){var n=this.root&&(this.root.ownerDocument||this.root)||t;return f(n,e)&&(!this.root||n==e.ownerDocument)},s.prototype._registerInstance=function(){e.indexOf(this)<0&&e.push(this)},s.prototype._unregisterInstance=function(){var t=e.indexOf(this);-1!=t&&e.splice(t,1)},window.IntersectionObserver=s,window.IntersectionObserverEntry=r}function o(t){try{return t.defaultView&&t.defaultView.frameElement||null}catch(t){return null}}function r(t){this.time=t.time,this.target=t.target,this.rootBounds=l(t.rootBounds),this.boundingClientRect=l(t.boundingClientRect),this.intersectionRect=l(t.intersectionRect||{top:0,bottom:0,left:0,right:0,width:0,height:0}),this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,n=e.width*e.height,i=this.intersectionRect,o=i.width*i.height;this.intersectionRatio=n?Number((o/n).toFixed(4)):this.isIntersecting?1:0}function s(t,e){var n,i,o,r=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(r.root&&1!=r.root.nodeType&&9!=r.root.nodeType)throw new Error("root must be a Document or Element");this._checkForIntersections=(n=this._checkForIntersections.bind(this),i=this.THROTTLE_TIMEOUT,o=null,function(){o||(o=setTimeout((function(){n(),o=null}),i))}),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(r.rootMargin),this.thresholds=this._initThresholds(r.threshold),this.root=r.root||null,this.rootMargin=this._rootMarginValues.map((function(t){return t.value+t.unit})).join(" "),this._monitoringDocuments=[],this._monitoringUnsubscribes=[]}function c(t,e,n,i){"function"==typeof t.addEventListener?t.addEventListener(e,n,i||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function u(t,e,n,i){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,i||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,n)}function a(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):{top:0,bottom:0,left:0,right:0,width:0,height:0}}function l(t){return!t||"x"in t?t:{top:t.top,y:t.top,bottom:t.bottom,left:t.left,x:t.left,right:t.right,width:t.width,height:t.height}}function h(t,e){var n=e.top-t.top,i=e.left-t.left;return{top:n,left:i,height:e.height,width:e.width,bottom:n+e.height,right:i+e.width}}function f(t,e){for(var n=e;n;){if(n==t)return!0;n=d(n)}return!1}function d(e){var n=e.parentNode;return 9==e.nodeType&&e!=t?o(e):(n&&n.assignedSlot&&(n=n.assignedSlot.parentNode),n&&11==n.nodeType&&n.host?n.host:n)}function g(t){return t&&9===t.nodeType}}()},1308:function(t,e,n){"use strict";n(4);var i="bfred-it:object-fit-images",o=/(object-fit|object-position)\s*:\s*([-.\w\s%]+)/g,r="undefined"==typeof Image?{style:{"object-position":1}}:new Image,s="object-fit"in r.style,c="object-position"in r.style,u="background-size"in r.style,a="string"==typeof r.currentSrc,l=r.getAttribute,h=r.setAttribute,f=!1;function d(t,e,n){var i="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='"+(e||1)+"' height='"+(n||0)+"'%3E%3C/svg%3E";l.call(t,"src")!==i&&h.call(t,"src",i)}function g(t,e){t.naturalWidth?e(t):setTimeout(g,100,t,e)}function m(t){var e=function(t){for(var e,n=getComputedStyle(t).fontFamily,i={};null!==(e=o.exec(n));)i[e[1]]=e[2];return i}(t),n=t[i];if(e["object-fit"]=e["object-fit"]||"fill",!n.img){if("fill"===e["object-fit"])return;if(!n.skipTest&&s&&!e["object-position"])return}if(!n.img){n.img=new Image(t.width,t.height),n.img.srcset=l.call(t,"data-ofi-srcset")||t.srcset,n.img.src=l.call(t,"data-ofi-src")||t.src,h.call(t,"data-ofi-src",t.src),t.srcset&&h.call(t,"data-ofi-srcset",t.srcset),d(t,t.naturalWidth||t.width,t.naturalHeight||t.height),t.srcset&&(t.srcset="");try{!function(t){var e={get:function(e){return t[i].img[e||"src"]},set:function(e,n){return t[i].img[n||"src"]=e,h.call(t,"data-ofi-"+n,e),m(t),e}};Object.defineProperty(t,"src",e),Object.defineProperty(t,"currentSrc",{get:function(){return e.get("currentSrc")}}),Object.defineProperty(t,"srcset",{get:function(){return e.get("srcset")},set:function(t){return e.set(t,"srcset")}})}(t)}catch(t){window.console&&console.warn("https://bit.ly/ofi-old-browser")}}!function(t){if(t.srcset&&!a&&window.picturefill){var e=window.picturefill._;t[e.ns]&&t[e.ns].evaled||e.fillImg(t,{reselect:!0}),t[e.ns].curSrc||(t[e.ns].supported=!1,e.fillImg(t,{reselect:!0})),t.currentSrc=t[e.ns].curSrc||t.src}}(n.img),t.style.backgroundImage='url("'+(n.img.currentSrc||n.img.src).replace(/"/g,'\\"')+'")',t.style.backgroundPosition=e["object-position"]||"center",t.style.backgroundRepeat="no-repeat",t.style.backgroundOrigin="content-box",/scale-down/.test(e["object-fit"])?g(n.img,(function(){n.img.naturalWidth>t.width||n.img.naturalHeight>t.height?t.style.backgroundSize="contain":t.style.backgroundSize="auto"})):t.style.backgroundSize=e["object-fit"].replace("none","auto").replace("fill","100% 100%"),g(n.img,(function(e){d(t,e.naturalWidth,e.naturalHeight)}))}function p(t,e){var n=!f&&!t;if(e=e||{},t=t||"img",c&&!e.skipTest||!u)return!1;"img"===t?t=document.getElementsByTagName("img"):"string"==typeof t?t=document.querySelectorAll(t):"length"in t||(t=[t]);for(var o=0;o<t.length;o++)t[o][i]=t[o][i]||{skipTest:e.skipTest},m(t[o]);n&&(document.body.addEventListener("load",(function(t){"IMG"===t.target.tagName&&p(t.target,{skipTest:e.skipTest})}),!0),f=!0,t="img"),e.watchMQ&&window.addEventListener("resize",p.bind(null,t,{skipTest:e.skipTest}))}p.supportsObjectFit=s,p.supportsObjectPosition=c,function(){function t(t,e){return t[i]&&t[i].img&&("src"===e||"srcset"===e)?t[i].img:t}c||(HTMLImageElement.prototype.getAttribute=function(e){return l.call(t(this,e),e)},HTMLImageElement.prototype.setAttribute=function(e,n){return h.call(t(this,e),e,String(n))})}(),t.exports=p},1350:function(t,e,n){var i,o;void 0===(o="function"==typeof(i=function(){"use strict";var t,e,i,o,r,s,c,u,a="undefined"!=typeof window?window:null!=typeof n.g?n.g:this||{},l=a.cancelRequestAnimationFrame&&a.requestAnimationFrame||setTimeout,h=a.cancelRequestAnimationFrame||clearTimeout,f=[],d=0,g=!1,m=7,p=35,b=125,v=0,w=0,y=0,_={get didTimeout(){return!1},timeRemaining:function(){var t=m-(Date.now()-w);return t<0?0:t}},I=(r=function(){m=22,b=66,p=0},u=function(){var t=Date.now()-c;t<99?s=setTimeout(u,99-t):(s=null,r())},function(){c=Date.now(),s||(s=setTimeout(u,99))});function T(){125!=b&&(m=7,b=125,p=35,g&&(g&&(o&&h(o),i&&clearTimeout(i),g=!1),k())),I()}function E(){o=null,i=setTimeout(O,0)}function R(){i=null,l(E)}function k(){g||(e=b-(Date.now()-w),t=Date.now(),g=!0,p&&e<p&&(e=p),e>9?i=setTimeout(R,e):(e=0,R()))}function O(){var n,o,r,s=m>9?9:1;if(w=Date.now(),g=!1,i=null,d>2||w-e-50<t)for(o=0,r=f.length;o<r&&_.timeRemaining()>s;o++)n=f.shift(),y++,n&&n(_);f.length?k():d=0}function D(t){return v++,f.push(t),k(),v}function C(t){var e=t-1-y;f[e]&&(f[e]=null)}if(a.requestIdleCallback&&a.cancelIdleCallback)try{a.requestIdleCallback((function(){}),{timeout:0})}catch(t){!function(t){var e,n;if(a.requestIdleCallback=function(e,n){return n&&"number"==typeof n.timeout?t(e,n.timeout):t(e)},a.IdleCallbackDeadline&&(e=IdleCallbackDeadline.prototype)){if(!(n=Object.getOwnPropertyDescriptor(e,"timeRemaining"))||!n.configurable||!n.get)return;Object.defineProperty(e,"timeRemaining",{value:function(){return n.get.call(this)},enumerable:!0,configurable:!0})}}(a.requestIdleCallback)}else a.requestIdleCallback=D,a.cancelIdleCallback=C,a.document&&document.addEventListener&&(a.addEventListener("scroll",T,!0),a.addEventListener("resize",T),document.addEventListener("focus",T,!0),document.addEventListener("mouseover",T,!0),["click","keypress","touchstart","mousedown"].forEach((function(t){document.addEventListener(t,T,{capture:!0,passive:!0})})),a.MutationObserver&&new MutationObserver(T).observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0}));return{request:D,cancel:C}})?i.apply(e,[]):i)||(t.exports=o)},1348:function(t,e,n){"use strict";n.r(e),n(1349),n(1350);var i=n(1308);n.n(i)()()}}]);
//# sourceMappingURL=extra_polyfills-585ea319dc12960808c3.chunk.js.map