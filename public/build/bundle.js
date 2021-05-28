var app=function(){"use strict";function t(){}function e(t,e){for(const n in e)t[n]=e[n];return t}function n(t){return t()}function r(){return Object.create(null)}function o(t){t.forEach(n)}function c(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(t,e,n){if(t){const r=a(t,e,n);return t[0](r)}}function a(t,n,r){return t[1]?e({},e(n.$$scope.ctx,t[1](r?r(n):{}))):n.$$scope.ctx}function i(t,n,r,o){return t[1]?e({},e(n.$$scope.changed||{},t[1](o?o(r):{}))):n.$$scope.changed||{}}function $(t){return null==t?"":t}function u(t,e){t.appendChild(e)}function m(t,e,n){t.insertBefore(e,n||null)}function p(t){t.parentNode.removeChild(t)}function f(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function g(t){return document.createElement(t)}function d(t){return document.createTextNode(t)}function h(){return d(" ")}function w(){return d("")}function x(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function b(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function _(t,e){e=""+e,t.data!==e&&(t.data=e)}function y(t,e){(null!=e||t.value)&&(t.value=e)}function v(t,e,n,r){t.style.setProperty(e,n,r?"important":"")}let U;function j(t){U=t}const N=[],G=[],I=[],E=[],O=Promise.resolve();let k=!1;function z(t){I.push(t)}function C(){const t=new Set;do{for(;N.length;){const t=N.shift();j(t),q(t.$$)}for(;G.length;)G.pop()();for(let e=0;e<I.length;e+=1){const n=I[e];t.has(n)||(n(),t.add(n))}I.length=0}while(N.length);for(;E.length;)E.pop()();k=!1}function q(t){null!==t.fragment&&(t.update(t.dirty),o(t.before_update),t.fragment&&t.fragment.p(t.dirty,t.ctx),t.dirty=null,t.after_update.forEach(z))}const L=new Set;let S;function A(){S={r:0,c:[],p:S}}function M(){S.r||o(S.c),S=S.p}function T(t,e){t&&t.i&&(L.delete(t),t.i(e))}function R(t,e,n,r){if(t&&t.o){if(L.has(t))return;L.add(t),S.c.push(()=>{L.delete(t),r&&(n&&t.d(1),r())}),t.o(e)}}const D="undefined"!=typeof window?window:global;function B(t){t&&t.c()}function H(t,e,r){const{fragment:s,on_mount:l,on_destroy:a,after_update:i}=t.$$;s&&s.m(e,r),z(()=>{const e=l.map(n).filter(c);a?a.push(...e):o(e),t.$$.on_mount=[]}),i.forEach(z)}function P(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx={})}function F(t,e){t.$$.dirty||(N.push(t),k||(k=!0,O.then(C)),t.$$.dirty=r()),t.$$.dirty[e]=!0}function W(e,n,c,s,l,a){const i=U;j(e);const $=n.props||{},u=e.$$={fragment:null,ctx:null,props:a,update:t,not_equal:l,bound:r(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(i?i.$$.context:[]),callbacks:r(),dirty:null};let m=!1;u.ctx=c?c(e,$,(t,n,r=n)=>(u.ctx&&l(u.ctx[t],u.ctx[t]=r)&&(u.bound[t]&&u.bound[t](r),m&&F(e,t)),n)):$,u.update(),m=!0,o(u.before_update),u.fragment=!!s&&s(u.ctx),n.target&&(n.hydrate?u.fragment&&u.fragment.l(function(t){return Array.from(t.childNodes)}(n.target)):u.fragment&&u.fragment.c(),n.intro&&T(e.$$.fragment),H(e,n.target,n.anchor),C()),j(i)}class Y{$destroy(){P(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const J=([t,e])=>[t,e].map(encodeURIComponent).join("="),K=t=>Object.entries(t).map(J).join("&"),Q=()=>{const t=location.hash;return t?(t=>{const e=t.split("&"),n={};return e.forEach(t=>{const[e,r]=t.split("=").map(decodeURIComponent);n[e]=r}),n})(t.slice("#".length)):{}},V=t=>{const e="string"==typeof t?new Date(t):t;return[e.getDate(),(n=e.getMonth()+1,n>9?n:"0"+n),e.getFullYear()].join(".");var n};var X={token:["180edb18","e4b074ef","d24534da","d54f8849","68725b7c"].join("")}.token;const Z=(t,e={})=>{const n={Authorization:"Token ".concat(X)},r=((t,e)=>"https://api.github.com".concat([t,K(e)].filter(t=>t).join("?")))(t,e);return fetch(r,{method:"GET",headers:n}).then(t=>t.json())};function tt(t){let e,n,r;const o=t.$$slots.default,c=l(o,t,null);return{c(){e=g("div"),c&&c.c(),b(e,"class",n="row "+(t.thead?"row-head":"")+" svelte-tl2h9c")},m(t,n){m(t,e,n),c&&c.m(e,null),r=!0},p(t,s){c&&c.p&&t.$$scope&&c.p(i(o,s,t,null),a(o,s,null)),(!r||t.thead&&n!==(n="row "+(s.thead?"row-head":"")+" svelte-tl2h9c"))&&b(e,"class",n)},i(t){r||(T(c,t),r=!0)},o(t){R(c,t),r=!1},d(t){t&&p(e),c&&c.d(t)}}}function et(t,e,n){let{thead:r}=e,{$$slots:o={},$$scope:c}=e;return t.$set=t=>{"thead"in t&&n("thead",r=t.thead),"$$scope"in t&&n("$$scope",c=t.$$scope)},{thead:r,$$slots:o,$$scope:c}}class nt extends Y{constructor(t){super(),W(this,t,et,tt,s,{thead:0})}}function rt(t){let e,n;const r=t.$$slots.default,o=l(r,t,null);return{c(){e=g("div"),o&&o.c(),v(e,"width",t.width+"px"),v(e,"text-align",t.align),b(e,"class","svelte-w8r0bj")},m(t,r){m(t,e,r),o&&o.m(e,null),n=!0},p(t,c){o&&o.p&&t.$$scope&&o.p(i(r,c,t,null),a(r,c,null)),n&&!t.width||v(e,"width",c.width+"px"),n&&!t.align||v(e,"text-align",c.align)},i(t){n||(T(o,t),n=!0)},o(t){R(o,t),n=!1},d(t){t&&p(e),o&&o.d(t)}}}function ot(t,e,n){let{width:r}=e,{align:o="left"}=e,{$$slots:c={},$$scope:s}=e;return t.$set=t=>{"width"in t&&n("width",r=t.width),"align"in t&&n("align",o=t.align),"$$scope"in t&&n("$$scope",s=t.$$scope)},{width:r,align:o,$$slots:c,$$scope:s}}class ct extends Y{constructor(t){super(),W(this,t,ot,rt,s,{width:0,align:0})}}var st=400,lt=100,at=140,it=100;function $t(t){let e;return{c(){e=d("Name")},m(t,n){m(t,e,n)},d(t){t&&p(e)}}}function ut(t){let e;return{c(){e=d("Stars")},m(t,n){m(t,e,n)},d(t){t&&p(e)}}}function mt(t){let e;return{c(){e=d("Updated")},m(t,n){m(t,e,n)},d(t){t&&p(e)}}}function pt(t){let e;return{c(){e=d("Link")},m(t,n){m(t,e,n)},d(t){t&&p(e)}}}function ft(t){let e,n,r,o;const c=new ct({props:{width:st,$$slots:{default:[$t]},$$scope:{ctx:t}}}),s=new ct({props:{width:lt,$$slots:{default:[ut]},$$scope:{ctx:t}}}),l=new ct({props:{width:at,$$slots:{default:[mt]},$$scope:{ctx:t}}}),a=new ct({props:{width:it,$$slots:{default:[pt]},$$scope:{ctx:t}}});return{c(){B(c.$$.fragment),e=h(),B(s.$$.fragment),n=h(),B(l.$$.fragment),r=h(),B(a.$$.fragment)},m(t,i){H(c,t,i),m(t,e,i),H(s,t,i),m(t,n,i),H(l,t,i),m(t,r,i),H(a,t,i),o=!0},p(t,e){const n={};t.$$scope&&(n.$$scope={changed:t,ctx:e}),c.$set(n);const r={};t.$$scope&&(r.$$scope={changed:t,ctx:e}),s.$set(r);const o={};t.$$scope&&(o.$$scope={changed:t,ctx:e}),l.$set(o);const i={};t.$$scope&&(i.$$scope={changed:t,ctx:e}),a.$set(i)},i(t){o||(T(c.$$.fragment,t),T(s.$$.fragment,t),T(l.$$.fragment,t),T(a.$$.fragment,t),o=!0)},o(t){R(c.$$.fragment,t),R(s.$$.fragment,t),R(l.$$.fragment,t),R(a.$$.fragment,t),o=!1},d(t){P(c,t),t&&p(e),P(s,t),t&&p(n),P(l,t),t&&p(r),P(a,t)}}}function gt(t){let e;const n=new nt({props:{thead:!0,$$slots:{default:[ft]},$$scope:{ctx:t}}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};t.$$scope&&(r.$$scope={changed:t,ctx:e}),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}class dt extends Y{constructor(t){super(),W(this,t,null,gt,s,{})}}function ht(t){let e,n,r,o=t.item.name+"";return{c(){e=g("a"),n=d(o),b(e,"href",r=t.repositoryUrl(t.item))},m(t,r){m(t,e,r),u(e,n)},p(t,c){t.item&&o!==(o=c.item.name+"")&&_(n,o),t.item&&r!==(r=c.repositoryUrl(c.item))&&b(e,"href",r)},d(t){t&&p(e)}}}function wt(t){let e,n=t.item.stargazers_count+"";return{c(){e=d(n)},m(t,n){m(t,e,n)},p(t,r){t.item&&n!==(n=r.item.stargazers_count+"")&&_(e,n)},d(t){t&&p(e)}}}function xt(t){let e,n=V(t.item.pushed_at)+"";return{c(){e=d(n)},m(t,n){m(t,e,n)},p(t,r){t.item&&n!==(n=V(r.item.pushed_at)+"")&&_(e,n)},d(t){t&&p(e)}}}function bt(t){let e,n,r;return{c(){e=g("a"),n=d("Github"),b(e,"href",r=t.item.html_url)},m(t,r){m(t,e,r),u(e,n)},p(t,n){t.item&&r!==(r=n.item.html_url)&&b(e,"href",r)},d(t){t&&p(e)}}}function _t(t){let e,n,r,o;const c=new ct({props:{width:st,$$slots:{default:[ht]},$$scope:{ctx:t}}}),s=new ct({props:{width:lt,$$slots:{default:[wt]},$$scope:{ctx:t}}}),l=new ct({props:{width:at,$$slots:{default:[xt]},$$scope:{ctx:t}}}),a=new ct({props:{width:it,$$slots:{default:[bt]},$$scope:{ctx:t}}});return{c(){B(c.$$.fragment),e=h(),B(s.$$.fragment),n=h(),B(l.$$.fragment),r=h(),B(a.$$.fragment)},m(t,i){H(c,t,i),m(t,e,i),H(s,t,i),m(t,n,i),H(l,t,i),m(t,r,i),H(a,t,i),o=!0},p(t,e){const n={};(t.$$scope||t.item)&&(n.$$scope={changed:t,ctx:e}),c.$set(n);const r={};(t.$$scope||t.item)&&(r.$$scope={changed:t,ctx:e}),s.$set(r);const o={};(t.$$scope||t.item)&&(o.$$scope={changed:t,ctx:e}),l.$set(o);const i={};(t.$$scope||t.item)&&(i.$$scope={changed:t,ctx:e}),a.$set(i)},i(t){o||(T(c.$$.fragment,t),T(s.$$.fragment,t),T(l.$$.fragment,t),T(a.$$.fragment,t),o=!0)},o(t){R(c.$$.fragment,t),R(s.$$.fragment,t),R(l.$$.fragment,t),R(a.$$.fragment,t),o=!1},d(t){P(c,t),t&&p(e),P(s,t),t&&p(n),P(l,t),t&&p(r),P(a,t)}}}function yt(t){let e;const n=new nt({props:{$$slots:{default:[_t]},$$scope:{ctx:t}}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};(t.$$scope||t.item)&&(r.$$scope={changed:t,ctx:e}),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function vt(t,e,n){let{item:r}=e,{term:o}=e;return t.$set=t=>{"item"in t&&n("item",r=t.item),"term"in t&&n("term",o=t.term)},{item:r,term:o,repositoryUrl:t=>"#".concat(K({type:"repository",term:o,full_name:t.full_name}))}}class Ut extends Y{constructor(t){super(),W(this,t,vt,yt,s,{item:0,term:0})}}function jt(t,e,n){const r=Object.create(t);return r.item=e[n],r.i=n,r}function Nt(t){let e;const n=new Ut({props:{term:t.term,item:t.item,loading:t.loading,orderId:t.i}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};t.term&&(r.term=e.term),t.items&&(r.item=e.item),t.loading&&(r.loading=e.loading),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function Gt(t){let e,n,r;const o=new dt({});let c=t.items,s=[];for(let e=0;e<c.length;e+=1)s[e]=Nt(jt(t,c,e));const l=t=>R(s[t],1,1,()=>{s[t]=null});return{c(){B(o.$$.fragment),e=h();for(let t=0;t<s.length;t+=1)s[t].c();n=w()},m(t,c){H(o,t,c),m(t,e,c);for(let e=0;e<s.length;e+=1)s[e].m(t,c);m(t,n,c),r=!0},p(t,e){if(t.term||t.items||t.loading){let r;for(c=e.items,r=0;r<c.length;r+=1){const o=jt(e,c,r);s[r]?(s[r].p(t,o),T(s[r],1)):(s[r]=Nt(o),s[r].c(),T(s[r],1),s[r].m(n.parentNode,n))}for(A(),r=c.length;r<s.length;r+=1)l(r);M()}},i(t){if(!r){T(o.$$.fragment,t);for(let t=0;t<c.length;t+=1)T(s[t]);r=!0}},o(t){R(o.$$.fragment,t),s=s.filter(Boolean);for(let t=0;t<s.length;t+=1)R(s[t]);r=!1},d(t){P(o,t),t&&p(e),f(s,t),t&&p(n)}}}function It(t,e,n){let{items:r}=e,{loading:o}=e,{term:c}=e;return t.$set=t=>{"items"in t&&n("items",r=t.items),"loading"in t&&n("loading",o=t.loading),"term"in t&&n("term",c=t.term)},{items:r,loading:o,term:c}}class Et extends Y{constructor(t){super(),W(this,t,It,Gt,s,{items:0,loading:0,term:0})}}function Ot(t,e,n){const r=Object.create(t);return r.pageId=e[n],r}function kt(t){let e,n,r,o,c,s,l=t.pageId+"";return{c(){e=g("li"),n=g("a"),r=d(l),c=h(),b(n,"href",o=t.pageUrlGenerator(t.pageId)),b(n,"class","svelte-1bmjwmw"),b(e,"class",s=$(t.current===t.pageId?"current":"")+" svelte-1bmjwmw")},m(t,o){m(t,e,o),u(e,n),u(n,r),u(e,c)},p(t,c){t.pages&&l!==(l=c.pageId+"")&&_(r,l),(t.pageUrlGenerator||t.pages)&&o!==(o=c.pageUrlGenerator(c.pageId))&&b(n,"href",o),(t.current||t.pages)&&s!==(s=$(c.current===c.pageId?"current":"")+" svelte-1bmjwmw")&&b(e,"class",s)},d(t){t&&p(e)}}}function zt(e){let n,r=e.pages,o=[];for(let t=0;t<r.length;t+=1)o[t]=kt(Ot(e,r,t));return{c(){n=g("ul");for(let t=0;t<o.length;t+=1)o[t].c();b(n,"class","svelte-1bmjwmw")},m(t,e){m(t,n,e);for(let t=0;t<o.length;t+=1)o[t].m(n,null)},p(t,e){if(t.current||t.pages||t.pageUrlGenerator){let c;for(r=e.pages,c=0;c<r.length;c+=1){const s=Ot(e,r,c);o[c]?o[c].p(t,s):(o[c]=kt(s),o[c].c(),o[c].m(n,null))}for(;c<o.length;c+=1)o[c].d(1);o.length=r.length}},i:t,o:t,d(t){t&&p(n),f(o,t)}}}function Ct(t,e,n){let r,{total:o}=e,{current:c}=e,{max:s}=e,{pageUrlGenerator:l}=e;return t.$set=t=>{"total"in t&&n("total",o=t.total),"current"in t&&n("current",c=t.current),"max"in t&&n("max",s=t.max),"pageUrlGenerator"in t&&n("pageUrlGenerator",l=t.pageUrlGenerator)},t.$$.update=(t={max:1,total:1})=>{(t.max||t.total)&&n("pages",r=((t,e)=>{let n=[];for(let r=0;r<Math.min(t,e);r++)n.push(r+1);return n})(s,o))},{total:o,current:c,max:s,pageUrlGenerator:l,pages:r}}class qt extends Y{constructor(t){super(),W(this,t,Ct,zt,s,{total:0,current:0,max:0,pageUrlGenerator:0})}}function Lt(e){let n;return{c(){n=g("div"),n.textContent="Loading...",b(n,"class","loading svelte-yr6y5g")},m(t,e){m(t,n,e)},p:t,i:t,o:t,d(t){t&&p(n)}}}class St extends Y{constructor(t){super(),W(this,t,null,Lt,s,{})}}function At(e){let n;const r=new St({});return{c(){B(r.$$.fragment)},m(t,e){H(r,t,e),n=!0},p:t,i(t){n||(T(r.$$.fragment,t),n=!0)},o(t){R(r.$$.fragment,t),n=!1},d(t){P(r,t)}}}function Mt(t){let e,n,r,o;const c=[Rt,Tt],s=[];function l(t,e){return e.items.length>0?0:1}return e=l(0,t),n=s[e]=c[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),m(t,r,n),o=!0},p(t,o){let a=e;e=l(0,o),e===a?s[e].p(t,o):(A(),R(s[a],1,1,()=>{s[a]=null}),M(),n=s[e],n||(n=s[e]=c[e](o),n.c()),T(n,1),n.m(r.parentNode,r))},i(t){o||(T(n),o=!0)},o(t){R(n),o=!1},d(t){s[e].d(t),t&&p(r)}}}function Tt(e){let n;return{c(){n=g("div"),n.textContent="There's nothing here. Seriously.",b(n,"class","message svelte-iw2xvv")},m(t,e){m(t,n,e)},p:t,i:t,o:t,d(t){t&&p(n)}}}function Rt(t){let e,n,r;const o=new Et({props:{term:t.term,items:t.items,loading:t.loading}});let c=t.items.length>1&&Dt(t);return{c(){e=g("div"),B(o.$$.fragment),n=h(),c&&c.c(),v(e,"width","840px"),v(e,"margin-left","auto"),v(e,"margin-right","auto")},m(t,s){m(t,e,s),H(o,e,null),u(e,n),c&&c.m(e,null),r=!0},p(t,n){const r={};t.term&&(r.term=n.term),t.items&&(r.items=n.items),t.loading&&(r.loading=n.loading),o.$set(r),n.items.length>1?c?(c.p(t,n),T(c,1)):(c=Dt(n),c.c(),T(c,1),c.m(e,null)):c&&(A(),R(c,1,1,()=>{c=null}),M())},i(t){r||(T(o.$$.fragment,t),T(c),r=!0)},o(t){R(o.$$.fragment,t),R(c),r=!1},d(t){t&&p(e),P(o),c&&c.d()}}}function Dt(t){let e;const n=new qt({props:{pageUrlGenerator:t.pageUrlGenerator,total:Math.ceil(t.total_count/10),max:10,current:t.page}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};t.total_count&&(r.total=Math.ceil(e.total_count/10)),t.page&&(r.current=e.page),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function Bt(t){let e,n,r,c,s,l,a,i,$;const u=[Mt,At],f=[];function d(t,e){return e.items?0:e.term?1:-1}return~(s=d(0,t))&&(l=f[s]=u[s](t)),{c(){e=g("h1"),e.textContent="Repository search",n=h(),r=g("input"),c=h(),l&&l.c(),a=w(),b(r,"type","text"),b(r,"class","repository-search svelte-iw2xvv"),$=[x(r,"input",t.input_input_handler),x(r,"input",t.changeHash)]},m(o,l){m(o,e,l),m(o,n,l),m(o,r,l),y(r,t.term),m(o,c,l),~s&&f[s].m(o,l),m(o,a,l),i=!0},p(t,e){t.term&&r.value!==e.term&&y(r,e.term);let n=s;s=d(0,e),s===n?~s&&f[s].p(t,e):(l&&(A(),R(f[n],1,1,()=>{f[n]=null}),M()),~s?(l=f[s],l||(l=f[s]=u[s](e),l.c()),T(l,1),l.m(a.parentNode,a)):l=null)},i(t){i||(T(l),i=!0)},o(t){R(l),i=!1},d(t){t&&p(e),t&&p(n),t&&p(r),t&&p(c),~s&&f[s].d(t),t&&p(a),o($)}}}function Ht(t,e,n){let r,o,c=Q().q,s=null,l=!1;const a=()=>{const t=Q(),{q:e}=t;n("page",o=t.page?parseInt(t.page,10):1),n("loading",l=!0),n("items",s=null),void 0!==e&&((t,e=1)=>Z("/search/repositories",{q:t,per_page:10,page:e,sort:"stars",order:"desc"}))(e,o).then(t=>{n("items",s=t.items),n("total_count",r=t.total_count),n("loading",l=!1)})};a();const i=((t,e=500)=>{let n,r=null;return(...o)=>{n=()=>{t(...o),r=null},null===r&&(r=setTimeout(()=>n(),e))}})(a,1e3);return window.addEventListener("hashchange",i),{term:c,items:s,total_count:r,page:o,loading:l,pageUrlGenerator:t=>"#".concat(K({q:c,page:t})),changeHash:()=>{const t=Q();var e;t.q=c,t.page=1,(e="#".concat(K(t))).startsWith("#")||(e="#".concat(e)),location.hash=e},input_input_handler:function(){c=this.value,n("term",c)}}}class Pt extends Y{constructor(t){super(),W(this,t,Ht,Bt,s,{})}}function Ft(t){let e;return{c(){e=d(t.title)},m(t,n){m(t,e,n)},p(t,n){t.title&&_(e,n.title)},d(t){t&&p(e)}}}function Wt(t){let e;const n=t.$$slots.default,r=l(n,t,null);return{c(){r&&r.c()},m(t,n){r&&r.m(t,n),e=!0},p(t,e){r&&r.p&&t.$$scope&&r.p(i(n,e,t,null),a(n,e,null))},i(t){e||(T(r,t),e=!0)},o(t){R(r,t),e=!1},d(t){r&&r.d(t)}}}function Yt(t){let e,n;const r=new ct({props:{width:Kt,align:"right",$$slots:{default:[Ft]},$$scope:{ctx:t}}}),o=new ct({props:{width:Qt,$$slots:{default:[Wt]},$$scope:{ctx:t}}});return{c(){B(r.$$.fragment),e=h(),B(o.$$.fragment)},m(t,c){H(r,t,c),m(t,e,c),H(o,t,c),n=!0},p(t,e){const n={};(t.$$scope||t.title)&&(n.$$scope={changed:t,ctx:e}),r.$set(n);const c={};t.$$scope&&(c.$$scope={changed:t,ctx:e}),o.$set(c)},i(t){n||(T(r.$$.fragment,t),T(o.$$.fragment,t),n=!0)},o(t){R(r.$$.fragment,t),R(o.$$.fragment,t),n=!1},d(t){P(r,t),t&&p(e),P(o,t)}}}function Jt(t){let e;const n=new nt({props:{$$slots:{default:[Yt]},$$scope:{ctx:t}}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};(t.$$scope||t.title)&&(r.$$scope={changed:t,ctx:e}),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}const Kt=150,Qt=450;function Vt(t,e,n){let{title:r}=e,{$$slots:o={},$$scope:c}=e;return t.$set=t=>{"title"in t&&n("title",r=t.title),"$$scope"in t&&n("$$scope",c=t.$$scope)},{title:r,$$slots:o,$$scope:c}}class Xt extends Y{constructor(t){super(),W(this,t,Vt,Jt,s,{title:0})}}const{Object:Zt}=D;function te(t,e,n){const r=Zt.create(t);return r.contributor=e[n],r.i=n,r}function ee(t,e,n){const r=Zt.create(t);return r.language=e[n],r.i=n,r}function ne(t){let e,n,r,o,c;return{c(){e=g("div"),n=d("← Search: "),r=g("a"),o=d(t.term),b(r,"href",c="#".concat(K({q:t.term}))),b(e,"class","breadcrumb svelte-280l5x")},m(t,c){m(t,e,c),u(e,n),u(e,r),u(r,o)},p(t,e){t.term&&_(o,e.term),t.term&&c!==(c="#".concat(K({q:e.term})))&&b(r,"href",c)},d(t){t&&p(e)}}}function re(e){let n;const r=new St({});return{c(){B(r.$$.fragment)},m(t,e){H(r,t,e),n=!0},p:t,i(t){n||(T(r.$$.fragment,t),n=!0)},o(t){R(r.$$.fragment,t),n=!1},d(t){P(r,t)}}}function oe(t){let e,n,r,o,c,s,l,a;const i=new Xt({props:{title:"Name",$$slots:{default:[se]},$$scope:{ctx:t}}}),$=new Xt({props:{title:"Stars",$$slots:{default:[le]},$$scope:{ctx:t}}}),u=new Xt({props:{title:"Updated",$$slots:{default:[ae]},$$scope:{ctx:t}}});let f=t.owner&&ie(t);const g=new Xt({props:{title:"Languages",$$slots:{default:[fe]},$$scope:{ctx:t}}}),d=new Xt({props:{title:"Description",$$slots:{default:[ge]},$$scope:{ctx:t}}});let x=t.contributors&&t.contributors.length>0&&de(t);return{c(){B(i.$$.fragment),e=h(),B($.$$.fragment),n=h(),B(u.$$.fragment),r=h(),f&&f.c(),o=h(),B(g.$$.fragment),c=h(),B(d.$$.fragment),s=h(),x&&x.c(),l=w()},m(t,p){H(i,t,p),m(t,e,p),H($,t,p),m(t,n,p),H(u,t,p),m(t,r,p),f&&f.m(t,p),m(t,o,p),H(g,t,p),m(t,c,p),H(d,t,p),m(t,s,p),x&&x.m(t,p),m(t,l,p),a=!0},p(t,e){const n={};(t.$$scope||t.item)&&(n.$$scope={changed:t,ctx:e}),i.$set(n);const r={};(t.$$scope||t.item)&&(r.$$scope={changed:t,ctx:e}),$.$set(r);const c={};(t.$$scope||t.item)&&(c.$$scope={changed:t,ctx:e}),u.$set(c),e.owner?f?(f.p(t,e),T(f,1)):(f=ie(e),f.c(),T(f,1),f.m(o.parentNode,o)):f&&(A(),R(f,1,1,()=>{f=null}),M());const s={};(t.$$scope||t.languages)&&(s.$$scope={changed:t,ctx:e}),g.$set(s);const a={};(t.$$scope||t.item)&&(a.$$scope={changed:t,ctx:e}),d.$set(a),e.contributors&&e.contributors.length>0?x?(x.p(t,e),T(x,1)):(x=de(e),x.c(),T(x,1),x.m(l.parentNode,l)):x&&(A(),R(x,1,1,()=>{x=null}),M())},i(t){a||(T(i.$$.fragment,t),T($.$$.fragment,t),T(u.$$.fragment,t),T(f),T(g.$$.fragment,t),T(d.$$.fragment,t),T(x),a=!0)},o(t){R(i.$$.fragment,t),R($.$$.fragment,t),R(u.$$.fragment,t),R(f),R(g.$$.fragment,t),R(d.$$.fragment,t),R(x),a=!1},d(t){P(i,t),t&&p(e),P($,t),t&&p(n),P(u,t),t&&p(r),f&&f.d(t),t&&p(o),P(g,t),t&&p(c),P(d,t),t&&p(s),x&&x.d(t),t&&p(l)}}}function ce(t){let e,n,r,o;return{c(){e=d(", "),n=g("a"),r=d("homepage"),b(n,"href",o=t.item.homepage)},m(t,o){m(t,e,o),m(t,n,o),u(n,r)},p(t,e){t.item&&o!==(o=e.item.homepage)&&b(n,"href",o)},d(t){t&&p(e),t&&p(n)}}}function se(t){let e,n,r,o,c=t.item.name+"",s=t.item.homepage&&ce(t);return{c(){e=g("a"),n=d(c),s&&s.c(),o=w(),b(e,"href",r=t.item.html_url)},m(t,r){m(t,e,r),u(e,n),s&&s.m(t,r),m(t,o,r)},p(t,l){t.item&&c!==(c=l.item.name+"")&&_(n,c),t.item&&r!==(r=l.item.html_url)&&b(e,"href",r),l.item.homepage?s?s.p(t,l):(s=ce(l),s.c(),s.m(o.parentNode,o)):s&&(s.d(1),s=null)},d(t){t&&p(e),s&&s.d(t),t&&p(o)}}}function le(t){let e,n=t.item.stargazers_count+"";return{c(){e=d(n)},m(t,n){m(t,e,n)},p(t,r){t.item&&n!==(n=r.item.stargazers_count+"")&&_(e,n)},d(t){t&&p(e)}}}function ae(t){let e,n=V(t.item.pushed_at)+"";return{c(){e=d(n)},m(t,n){m(t,e,n)},p(t,r){t.item&&n!==(n=V(r.item.pushed_at)+"")&&_(e,n)},d(t){t&&p(e)}}}function ie(t){let e;const n=new Xt({props:{title:"Owner",$$slots:{default:[$e]},$$scope:{ctx:t}}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};(t.$$scope||t.owner)&&(r.$$scope={changed:t,ctx:e}),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function $e(t){let e,n,r,o,c,s,l,a=t.owner.login+"";return{c(){e=g("a"),n=d(a),o=g("br"),c=h(),s=g("img"),b(e,"href",r=t.owner.html_url),b(s,"alt",""),s.src!==(l=t.owner.avatar_url)&&b(s,"src",l),b(s,"widtn","128"),b(s,"height","128")},m(t,r){m(t,e,r),u(e,n),m(t,o,r),m(t,c,r),m(t,s,r)},p(t,o){t.owner&&a!==(a=o.owner.login+"")&&_(n,a),t.owner&&r!==(r=o.owner.html_url)&&b(e,"href",r),t.owner&&s.src!==(l=o.owner.avatar_url)&&b(s,"src",l)},d(t){t&&p(e),t&&p(o),t&&p(c),t&&p(s)}}}function ue(e){let n;const r=new St({});return{c(){B(r.$$.fragment)},m(t,e){H(r,t,e),n=!0},p:t,i(t){n||(T(r.$$.fragment,t),n=!0)},o(t){R(r.$$.fragment,t),n=!1},d(t){P(r,t)}}}function me(e){let n,r=Object.keys(e.languages),o=[];for(let t=0;t<r.length;t+=1)o[t]=pe(ee(e,r,t));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();n=w()},m(t,e){for(let n=0;n<o.length;n+=1)o[n].m(t,e);m(t,n,e)},p(t,e){if(t.Object||t.languages){let c;for(r=Object.keys(e.languages),c=0;c<r.length;c+=1){const s=ee(e,r,c);o[c]?o[c].p(t,s):(o[c]=pe(s),o[c].c(),o[c].m(n.parentNode,n))}for(;c<o.length;c+=1)o[c].d(1);o.length=r.length}},i:t,o:t,d(t){f(o,t),t&&p(n)}}}function pe(t){let e,n,r=0===t.i?"":", ",o=t.language+"";return{c(){e=d(r),n=d(o)},m(t,r){m(t,e,r),m(t,n,r)},p(t,e){t.languages&&o!==(o=e.language+"")&&_(n,o)},d(t){t&&p(e),t&&p(n)}}}function fe(t){let e,n,r,o;const c=[me,ue],s=[];function l(t,e){return e.languages?0:1}return e=l(0,t),n=s[e]=c[e](t),{c(){n.c(),r=w()},m(t,n){s[e].m(t,n),m(t,r,n),o=!0},p(t,o){let a=e;e=l(0,o),e===a?s[e].p(t,o):(A(),R(s[a],1,1,()=>{s[a]=null}),M(),n=s[e],n||(n=s[e]=c[e](o),n.c()),T(n,1),n.m(r.parentNode,r))},i(t){o||(T(n),o=!0)},o(t){R(n),o=!1},d(t){s[e].d(t),t&&p(r)}}}function ge(t){let e,n=t.item.description+"";return{c(){e=d(n)},m(t,n){m(t,e,n)},p(t,r){t.item&&n!==(n=r.item.description+"")&&_(e,n)},d(t){t&&p(e)}}}function de(t){let e;const n=new Xt({props:{title:"Contributors",$$slots:{default:[we]},$$scope:{ctx:t}}});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},p(t,e){const r={};(t.$$scope||t.contributors)&&(r.$$scope={changed:t,ctx:e}),n.$set(r)},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function he(t){let e,n,r,o,c,s,l=0===t.i?"":", ",a=t.contributor.login+"";return{c(){e=d(l),n=h(),r=g("a"),o=d(a),b(r,"href",c=t.contributor.html_url),b(r,"title",s=t.pluralize(t.contributor.contributions,"contribution","contributions"))},m(t,c){m(t,e,c),m(t,n,c),m(t,r,c),u(r,o)},p(t,e){t.contributors&&a!==(a=e.contributor.login+"")&&_(o,a),t.contributors&&c!==(c=e.contributor.html_url)&&b(r,"href",c),t.contributors&&s!==(s=e.pluralize(e.contributor.contributions,"contribution","contributions"))&&b(r,"title",s)},d(t){t&&p(e),t&&p(n),t&&p(r)}}}function we(t){let e,n=t.contributors,r=[];for(let e=0;e<n.length;e+=1)r[e]=he(te(t,n,e));return{c(){for(let t=0;t<r.length;t+=1)r[t].c();e=w()},m(t,n){for(let e=0;e<r.length;e+=1)r[e].m(t,n);m(t,e,n)},p(t,o){if(t.contributors||t.pluralize){let c;for(n=o.contributors,c=0;c<n.length;c+=1){const s=te(o,n,c);r[c]?r[c].p(t,s):(r[c]=he(s),r[c].c(),r[c].m(e.parentNode,e))}for(;c<r.length;c+=1)r[c].d(1);r.length=n.length}},d(t){f(r,t),t&&p(e)}}}function xe(t){let e,n,r,o,c,s,l,a=t.term&&ne(t);const i=[oe,re],$=[];function u(t,e){return e.item?0:1}return o=u(0,t),c=$[o]=i[o](t),{c(){a&&a.c(),e=h(),n=g("h1"),n.textContent="Repository",r=h(),c.c(),s=w()},m(t,c){a&&a.m(t,c),m(t,e,c),m(t,n,c),m(t,r,c),$[o].m(t,c),m(t,s,c),l=!0},p(t,n){n.term?a?a.p(t,n):(a=ne(n),a.c(),a.m(e.parentNode,e)):a&&(a.d(1),a=null);let r=o;o=u(0,n),o===r?$[o].p(t,n):(A(),R($[r],1,1,()=>{$[r]=null}),M(),c=$[o],c||(c=$[o]=i[o](n),c.c()),T(c,1),c.m(s.parentNode,s))},i(t){l||(T(c),l=!0)},o(t){R(c),l=!1},d(t){a&&a.d(t),t&&p(e),t&&p(n),t&&p(r),$[o].d(t),t&&p(s)}}}function be(t,e,n){let r,o=null,c=null,s=null,l=null,a=null;const i=Q();return r=i.full_name,n("term",l=i.term),(t=>Z("/repos/".concat(t),{}))(r).then(t=>{n("item",o=t),n("owner",s=o.owner)}),(t=>Z("/repos/".concat(t,"/languages")))(r).then(t=>n("languages",c=t)),(t=>Z("/repos/".concat(t,"/contributors")))(r).then(t=>{t.length>0&&n("contributors",a=t.sort((t,e)=>t.contributions-e.contribution).slice(0,10)),console.log(a)}),{item:o,languages:c,owner:s,term:l,contributors:a,pluralize:(t,e,n)=>"".concat(t," ",1===t?e:n)}}class _e extends Y{constructor(t){super(),W(this,t,be,xe,s,{})}}function ye(e){let n;return{c(){n=d("Undefined page")},m(t,e){m(t,n,e)},i:t,o:t,d(t){t&&p(n)}}}function ve(t){let e;const n=new _e({});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function Ue(t){let e;const n=new Pt({});return{c(){B(n.$$.fragment)},m(t,r){H(n,t,r),e=!0},i(t){e||(T(n.$$.fragment,t),e=!0)},o(t){R(n.$$.fragment,t),e=!1},d(t){P(n,t)}}}function je(t){let e,n,r,o;const c=[Ue,ve,ye],s=[];function l(t,e){return"search"===e.type?0:"repository"===e.type?1:2}return n=l(0,t),r=s[n]=c[n](t),{c(){e=g("main"),r.c(),b(e,"class","svelte-1e9puaw")},m(t,r){m(t,e,r),s[n].m(e,null),o=!0},p(t,o){let a=n;n=l(0,o),n!==a&&(A(),R(s[a],1,1,()=>{s[a]=null}),M(),r=s[n],r||(r=s[n]=c[n](o),r.c()),T(r,1),r.m(e,null))},i(t){o||(T(r),o=!0)},o(t){R(r),o=!1},d(t){t&&p(e),s[n].d()}}}function Ne(t,e,n){let r;const o=()=>{const t=Q();n("type",r=t.type),r||n("type",r="search")};return o(),window.addEventListener("hashchange",o),{type:r}}return new class extends Y{constructor(t){super(),W(this,t,Ne,je,s,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
