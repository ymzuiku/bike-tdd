var $=Object.create;var u=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var w=Object.getPrototypeOf,k=Object.prototype.hasOwnProperty;var S=o=>u(o,"__esModule",{value:!0});var j=(o,r)=>()=>(r||o((r={exports:{}}).exports,r),r.exports);var q=(o,r,t)=>{if(r&&typeof r=="object"||typeof r=="function")for(let s of O(r))!k.call(o,s)&&s!=="default"&&u(o,s,{get:()=>r[s],enumerable:!(t=d(r,s))||t.enumerable});return o},h=o=>q(S(u(o!=null?$(w(o)):{},"default",o&&o.__esModule&&"default"in o?{get:()=>o.default,enumerable:!0}:{value:o,enumerable:!0})),o);var E=j((P,p)=>{"use strict";p.exports=function o(r,t){if(r===t)return!0;if(r&&t&&typeof r=="object"&&typeof t=="object"){if(r.constructor!==t.constructor)return!1;var s,n,i;if(Array.isArray(r)){if(s=r.length,s!=t.length)return!1;for(n=s;n--!=0;)if(!o(r[n],t[n]))return!1;return!0}if(r.constructor===RegExp)return r.source===t.source&&r.flags===t.flags;if(r.valueOf!==Object.prototype.valueOf)return r.valueOf()===t.valueOf();if(r.toString!==Object.prototype.toString)return r.toString()===t.toString();if(i=Object.keys(r),s=i.length,s!==Object.keys(t).length)return!1;for(n=s;n--!=0;)if(!Object.prototype.hasOwnProperty.call(t,i[n]))return!1;for(n=s;n--!=0;){var y=i[n];if(!o(r[y],t[y]))return!1}return!0}return r!==r&&t!==t}});var l=h(E());console.log("tdddddddddd");var f={},e={};function c(o){return`-- FAIL ${o}:
`}function g(o){return{pick:(r,...t)=>{let s=!1;t.forEach(n=>{r===t&&(s=!0)}),s||(e[o]=new Error(`${r} isn't pick: ${t}`),console.error(c(o),e[o]))},notPick:(r,...t)=>{let s=!1;t.forEach(n=>{r===t&&(s=!0)}),s&&(e[o]=new Error(`${r} is pick: ${t}`),console.error(c(o),e[o]))},true:r=>{r||(e[o]=new Error(`${r} isn't true`),console.error(c(o),e[o]))},false:r=>{r&&(e[o]=new Error(`${r} isn't false`),console.error(c(o),e[o]))},equal:(r,t)=>{(0,l.default)(r,t)||(e[o]=new Error(`${r} isn't equal ${t}`),console.error(e[o].stack.split(`
`)[2].match(/\(.*\)/)[0].replace(/(\(|\))/g,"")))},notEqual:(r,t)=>{(0,l.default)(r,t)&&(e[o]=new Error(`${r} is equal ${t}`),console.error(c(o),e[o]))},unique:r=>{new Set(r).size!==r.length&&(e[o]=new Error(`${r} isn't unique`),console.error(c(o),e[o]))},error:(r,t)=>{if(!r){e[o]=new Error("error isn't Error"),console.error(c(o),e[o]);return}r.message.indexOf(t.message)>-1&&(e[o]=new Error(`error ${r} isn't ${t}`),console.error(e[o]))},fail:r=>{e[o]=new Error(r.message),console.error(c(o),e[o])}}}var T=g("");function a(){let o=Object.keys(e);if(o.length>0){o.forEach(t=>{console.log(t),f[t]()});return}Object.keys(f).forEach(t=>{console.log(t),f[t]()})}function v(){a()}var x={core:{cache:f,check:v,lastErrors:e,runTest:a},test:(o,r)=>{let t=g(o);f[o]=()=>{r(t)}}};setTimeout(()=>{x.core.check()},50);export{x as tdd};