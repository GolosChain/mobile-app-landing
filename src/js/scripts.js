!function(e){var t={};function r(n){if(t[n])return t[n].exports;var s=t[n]={i:n,l:!1,exports:{}};return e[n].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)r.d(n,s,function(t){return e[t]}.bind(null,s));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t,r){"use strict";var n=document.querySelector(".page-header__l10n"),s=document.querySelector(".page-header__l10n-list"),a=document.querySelector(".page-header__l10n-active");n.addEventListener("click",function(e){e.preventDefault(),s.classList.toggle("page-header__l10n-list--open"),a.classList.toggle("page-header__l10n-active--open")});var i=document.querySelector(".android-reviews__next-review--desk"),o=document.querySelector(".android-reviews__next-review--mob"),c=document.querySelector(".android-reviews__reviews-carousel"),l=document.querySelectorAll(".android-reviews__review"),d=document.querySelectorAll(".android-reviews__reviewer-ava--desk"),v=document.querySelector(".android-reviews__ava-container"),u=0,_=0,f=0;i.addEventListener("click",function(e){e.preventDefault(),u-=314,u=Math.abs(u)<1570?u:0,c.style.transform="translateX("+u+"px)";for(var t=0;t<d.length;t++)if(d[t].classList.contains("android-reviews__reviewer-ava--active")){if(t+1<d.length){d[t].classList.remove("android-reviews__reviewer-ava--active"),d[t+1].classList.add("android-reviews__reviewer-ava--active");break}d[t].classList.remove("android-reviews__reviewer-ava--active"),d[0].classList.add("android-reviews__reviewer-ava--active")}}),o.addEventListener("click",function(e){e.preventDefault(),_-=100,f+=32;for(var t=0;t<l.length;t++)if(l[t].classList.contains("android-reviews__review--active")){if(t+1<l.length){c.style.transform="translateX(calc("+_+"vw + "+f+"px))",l[t].classList.remove("android-reviews__review--active"),l[t+1].classList.add("android-reviews__review--active");break}_=0,f=0,c.style.transform="translateX("+_+"vw)",l[t].classList.remove("android-reviews__review--active"),l[0].classList.add("android-reviews__review--active")}}),v.addEventListener("click",function(e){e.preventDefault();for(var t=0;t<d.length;t++)d[t].classList.contains("android-reviews__reviewer-ava--active")&&d[t].parentNode!==e.target&&e.target!==e.currentTarget&&d[t].classList.remove("android-reviews__reviewer-ava--active"),d[t].parentNode!==e.target&&d[t]!==e.target||(u=-314*t,d[t].classList.add("android-reviews__reviewer-ava--active"),c.style.transform="translateX("+u+"px)")});var m=document.querySelector(".screenshots__img-container"),w=document.querySelectorAll(".screenshots__screenshot"),h=document.querySelector(".screenshots__button--first"),y=document.querySelector(".screenshots__button--second"),L=document.querySelector(".screenshots"),p=function(e){e.preventDefault();for(var t=0;t<w.length;t++)if(w[t].classList.contains("screenshots__screenshot--active")&&t+1<w.length){m.style.transform="translateX(-328px)",w[t].classList.remove("screenshots__screenshot--active"),w[t+1].classList.add("screenshots__screenshot--active"),h.removeAttribute("disabled"),y.setAttribute("disabled",!0);break}},b=function(e){e.preventDefault();for(var t=0;t<w.length;t++)if(w[t].classList.contains("screenshots__screenshot--active")&&t-1>=0){m.style.transform="translateX(0px)",w[t].classList.remove("screenshots__screenshot--active"),w[t-1].classList.add("screenshots__screenshot--active"),h.setAttribute("disabled",!0),y.removeAttribute("disabled");break}},g=null,S=function e(t){if(null!==g){var r=t.changedTouches[0].clientX,n=g-r;Math.abs(n)>100?(n<0&&(b(t),g=null),n>0&&(p(t),g=null)):g=null,L.removeEventListener("touchend",e)}};h.addEventListener("click",b),y.addEventListener("click",p),L.addEventListener("touchstart",function(e){1===e.changedTouches.length&&null===g&&(g=e.changedTouches[0].clientX,L.addEventListener("touchend",S))});var q=document.querySelector(".be-in-touch__form"),k=document.querySelector(".modal"),E=document.querySelector(".overlay"),x=document.querySelector(".modal__close"),X=function e(t){t.preventDefault(),k.classList.remove("modal--active"),E.classList.remove("overlay--active"),x.removeEventListener("click",e),E.removeEventListener("click",e)};q.addEventListener("submit",function(e){e.preventDefault(),k.classList.add("modal--active"),E.classList.add("overlay--active"),x.addEventListener("click",X),E.addEventListener("click",X)});window.addEventListener("resize",function(){if(_){_=0;for(var e=0;e<l.length;e++)if(l[e].classList.contains("android-reviews__review--active")){l[e].classList.remove("android-reviews__review--active"),l[0].classList.add("android-reviews__review--active");break}c.style.transform="translateX(0)"}u&&(u=0,c.style.transform="translateX(0)"),m.style.transform&&(m.style.transform="translateX(0px)",h.setAttribute("disabled",!0),y.removeAttribute("disabled"))})}]);