function Hh(a,o){for(var u=0;u<o.length;u++){const r=o[u];if(typeof r!="string"&&!Array.isArray(r)){for(const c in r)if(c!=="default"&&!(c in a)){const d=Object.getOwnPropertyDescriptor(r,c);d&&Object.defineProperty(a,c,d.get?d:{enumerable:!0,get:()=>r[c]})}}}return Object.freeze(Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}))}(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))r(c);new MutationObserver(c=>{for(const d of c)if(d.type==="childList")for(const g of d.addedNodes)g.tagName==="LINK"&&g.rel==="modulepreload"&&r(g)}).observe(document,{childList:!0,subtree:!0});function u(c){const d={};return c.integrity&&(d.integrity=c.integrity),c.referrerPolicy&&(d.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?d.credentials="include":c.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(c){if(c.ep)return;c.ep=!0;const d=u(c);fetch(c.href,d)}})();function qh(a){return a&&a.__esModule&&Object.prototype.hasOwnProperty.call(a,"default")?a.default:a}var Lr={exports:{}},xi={};var bm;function Xh(){if(bm)return xi;bm=1;var a=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function u(r,c,d){var g=null;if(d!==void 0&&(g=""+d),c.key!==void 0&&(g=""+c.key),"key"in c){d={};for(var h in c)h!=="key"&&(d[h]=c[h])}else d=c;return c=d.ref,{$$typeof:a,type:r,key:g,ref:c!==void 0?c:null,props:d}}return xi.Fragment=o,xi.jsx=u,xi.jsxs=u,xi}var vm;function Gh(){return vm||(vm=1,Lr.exports=Xh()),Lr.exports}var y=Gh(),Br={exports:{}},ye={};var xm;function Qh(){if(xm)return ye;xm=1;var a=Symbol.for("react.transitional.element"),o=Symbol.for("react.portal"),u=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),c=Symbol.for("react.profiler"),d=Symbol.for("react.consumer"),g=Symbol.for("react.context"),h=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),E=Symbol.for("react.lazy"),S=Symbol.for("react.activity"),N=Symbol.iterator;function C(v){return v===null||typeof v!="object"?null:(v=N&&v[N]||v["@@iterator"],typeof v=="function"?v:null)}var A={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},U=Object.assign,j={};function H(v,k,K){this.props=v,this.context=k,this.refs=j,this.updater=K||A}H.prototype.isReactComponent={},H.prototype.setState=function(v,k){if(typeof v!="object"&&typeof v!="function"&&v!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,v,k,"setState")},H.prototype.forceUpdate=function(v){this.updater.enqueueForceUpdate(this,v,"forceUpdate")};function J(){}J.prototype=H.prototype;function Z(v,k,K){this.props=v,this.context=k,this.refs=j,this.updater=K||A}var ae=Z.prototype=new J;ae.constructor=Z,U(ae,H.prototype),ae.isPureReactComponent=!0;var te=Array.isArray;function P(){}var ee={H:null,A:null,T:null,S:null},V=Object.prototype.hasOwnProperty;function I(v,k,K){var W=K.ref;return{$$typeof:a,type:v,key:k,ref:W!==void 0?W:null,props:K}}function ie(v,k){return I(v.type,k,v.props)}function q(v){return typeof v=="object"&&v!==null&&v.$$typeof===a}function G(v){var k={"=":"=0",":":"=2"};return"$"+v.replace(/[=:]/g,function(K){return k[K]})}var oe=/\/+/g;function ue(v,k){return typeof v=="object"&&v!==null&&v.key!=null?G(""+v.key):k.toString(36)}function le(v){switch(v.status){case"fulfilled":return v.value;case"rejected":throw v.reason;default:switch(typeof v.status=="string"?v.then(P,P):(v.status="pending",v.then(function(k){v.status==="pending"&&(v.status="fulfilled",v.value=k)},function(k){v.status==="pending"&&(v.status="rejected",v.reason=k)})),v.status){case"fulfilled":return v.value;case"rejected":throw v.reason}}throw v}function z(v,k,K,W,de){var be=typeof v;(be==="undefined"||be==="boolean")&&(v=null);var Ee=!1;if(v===null)Ee=!0;else switch(be){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(v.$$typeof){case a:case o:Ee=!0;break;case E:return Ee=v._init,z(Ee(v._payload),k,K,W,de)}}if(Ee)return de=de(v),Ee=W===""?"."+ue(v,0):W,te(de)?(K="",Ee!=null&&(K=Ee.replace(oe,"$&/")+"/"),z(de,k,K,"",function(bt){return bt})):de!=null&&(q(de)&&(de=ie(de,K+(de.key==null||v&&v.key===de.key?"":(""+de.key).replace(oe,"$&/")+"/")+Ee)),k.push(de)),1;Ee=0;var We=W===""?".":W+":";if(te(v))for(var je=0;je<v.length;je++)W=v[je],be=We+ue(W,je),Ee+=z(W,k,K,be,de);else if(je=C(v),typeof je=="function")for(v=je.call(v),je=0;!(W=v.next()).done;)W=W.value,be=We+ue(W,je++),Ee+=z(W,k,K,be,de);else if(be==="object"){if(typeof v.then=="function")return z(le(v),k,K,W,de);throw k=String(v),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(v).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function Q(v,k,K){if(v==null)return v;var W=[],de=0;return z(v,W,"","",function(be){return k.call(K,be,de++)}),W}function F(v){if(v._status===-1){var k=v._result;k=k(),k.then(function(K){(v._status===0||v._status===-1)&&(v._status=1,v._result=K)},function(K){(v._status===0||v._status===-1)&&(v._status=2,v._result=K)}),v._status===-1&&(v._status=0,v._result=k)}if(v._status===1)return v._result.default;throw v._result}var ne=typeof reportError=="function"?reportError:function(v){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof v=="object"&&v!==null&&typeof v.message=="string"?String(v.message):String(v),error:v});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",v);return}console.error(v)},me={map:Q,forEach:function(v,k,K){Q(v,function(){k.apply(this,arguments)},K)},count:function(v){var k=0;return Q(v,function(){k++}),k},toArray:function(v){return Q(v,function(k){return k})||[]},only:function(v){if(!q(v))throw Error("React.Children.only expected to receive a single React element child.");return v}};return ye.Activity=S,ye.Children=me,ye.Component=H,ye.Fragment=u,ye.Profiler=c,ye.PureComponent=Z,ye.StrictMode=r,ye.Suspense=p,ye.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=ee,ye.__COMPILER_RUNTIME={__proto__:null,c:function(v){return ee.H.useMemoCache(v)}},ye.cache=function(v){return function(){return v.apply(null,arguments)}},ye.cacheSignal=function(){return null},ye.cloneElement=function(v,k,K){if(v==null)throw Error("The argument must be a React element, but you passed "+v+".");var W=U({},v.props),de=v.key;if(k!=null)for(be in k.key!==void 0&&(de=""+k.key),k)!V.call(k,be)||be==="key"||be==="__self"||be==="__source"||be==="ref"&&k.ref===void 0||(W[be]=k[be]);var be=arguments.length-2;if(be===1)W.children=K;else if(1<be){for(var Ee=Array(be),We=0;We<be;We++)Ee[We]=arguments[We+2];W.children=Ee}return I(v.type,de,W)},ye.createContext=function(v){return v={$$typeof:g,_currentValue:v,_currentValue2:v,_threadCount:0,Provider:null,Consumer:null},v.Provider=v,v.Consumer={$$typeof:d,_context:v},v},ye.createElement=function(v,k,K){var W,de={},be=null;if(k!=null)for(W in k.key!==void 0&&(be=""+k.key),k)V.call(k,W)&&W!=="key"&&W!=="__self"&&W!=="__source"&&(de[W]=k[W]);var Ee=arguments.length-2;if(Ee===1)de.children=K;else if(1<Ee){for(var We=Array(Ee),je=0;je<Ee;je++)We[je]=arguments[je+2];de.children=We}if(v&&v.defaultProps)for(W in Ee=v.defaultProps,Ee)de[W]===void 0&&(de[W]=Ee[W]);return I(v,be,de)},ye.createRef=function(){return{current:null}},ye.forwardRef=function(v){return{$$typeof:h,render:v}},ye.isValidElement=q,ye.lazy=function(v){return{$$typeof:E,_payload:{_status:-1,_result:v},_init:F}},ye.memo=function(v,k){return{$$typeof:m,type:v,compare:k===void 0?null:k}},ye.startTransition=function(v){var k=ee.T,K={};ee.T=K;try{var W=v(),de=ee.S;de!==null&&de(K,W),typeof W=="object"&&W!==null&&typeof W.then=="function"&&W.then(P,ne)}catch(be){ne(be)}finally{k!==null&&K.types!==null&&(k.types=K.types),ee.T=k}},ye.unstable_useCacheRefresh=function(){return ee.H.useCacheRefresh()},ye.use=function(v){return ee.H.use(v)},ye.useActionState=function(v,k,K){return ee.H.useActionState(v,k,K)},ye.useCallback=function(v,k){return ee.H.useCallback(v,k)},ye.useContext=function(v){return ee.H.useContext(v)},ye.useDebugValue=function(){},ye.useDeferredValue=function(v,k){return ee.H.useDeferredValue(v,k)},ye.useEffect=function(v,k){return ee.H.useEffect(v,k)},ye.useEffectEvent=function(v){return ee.H.useEffectEvent(v)},ye.useId=function(){return ee.H.useId()},ye.useImperativeHandle=function(v,k,K){return ee.H.useImperativeHandle(v,k,K)},ye.useInsertionEffect=function(v,k){return ee.H.useInsertionEffect(v,k)},ye.useLayoutEffect=function(v,k){return ee.H.useLayoutEffect(v,k)},ye.useMemo=function(v,k){return ee.H.useMemo(v,k)},ye.useOptimistic=function(v,k){return ee.H.useOptimistic(v,k)},ye.useReducer=function(v,k,K){return ee.H.useReducer(v,k,K)},ye.useRef=function(v){return ee.H.useRef(v)},ye.useState=function(v){return ee.H.useState(v)},ye.useSyncExternalStore=function(v,k,K){return ee.H.useSyncExternalStore(v,k,K)},ye.useTransition=function(){return ee.H.useTransition()},ye.version="19.2.4",ye}var Sm;function Ri(){return Sm||(Sm=1,Br.exports=Qh()),Br.exports}var w=Ri();const Vh=qh(w),u0=Hh({__proto__:null,default:Vh},[w]);var Hr={exports:{}},Si={},qr={exports:{}},Xr={};var wm;function Zh(){return wm||(wm=1,(function(a){function o(z,Q){var F=z.length;z.push(Q);e:for(;0<F;){var ne=F-1>>>1,me=z[ne];if(0<c(me,Q))z[ne]=Q,z[F]=me,F=ne;else break e}}function u(z){return z.length===0?null:z[0]}function r(z){if(z.length===0)return null;var Q=z[0],F=z.pop();if(F!==Q){z[0]=F;e:for(var ne=0,me=z.length,v=me>>>1;ne<v;){var k=2*(ne+1)-1,K=z[k],W=k+1,de=z[W];if(0>c(K,F))W<me&&0>c(de,K)?(z[ne]=de,z[W]=F,ne=W):(z[ne]=K,z[k]=F,ne=k);else if(W<me&&0>c(de,F))z[ne]=de,z[W]=F,ne=W;else break e}}return Q}function c(z,Q){var F=z.sortIndex-Q.sortIndex;return F!==0?F:z.id-Q.id}if(a.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var d=performance;a.unstable_now=function(){return d.now()}}else{var g=Date,h=g.now();a.unstable_now=function(){return g.now()-h}}var p=[],m=[],E=1,S=null,N=3,C=!1,A=!1,U=!1,j=!1,H=typeof setTimeout=="function"?setTimeout:null,J=typeof clearTimeout=="function"?clearTimeout:null,Z=typeof setImmediate<"u"?setImmediate:null;function ae(z){for(var Q=u(m);Q!==null;){if(Q.callback===null)r(m);else if(Q.startTime<=z)r(m),Q.sortIndex=Q.expirationTime,o(p,Q);else break;Q=u(m)}}function te(z){if(U=!1,ae(z),!A)if(u(p)!==null)A=!0,P||(P=!0,G());else{var Q=u(m);Q!==null&&le(te,Q.startTime-z)}}var P=!1,ee=-1,V=5,I=-1;function ie(){return j?!0:!(a.unstable_now()-I<V)}function q(){if(j=!1,P){var z=a.unstable_now();I=z;var Q=!0;try{e:{A=!1,U&&(U=!1,J(ee),ee=-1),C=!0;var F=N;try{t:{for(ae(z),S=u(p);S!==null&&!(S.expirationTime>z&&ie());){var ne=S.callback;if(typeof ne=="function"){S.callback=null,N=S.priorityLevel;var me=ne(S.expirationTime<=z);if(z=a.unstable_now(),typeof me=="function"){S.callback=me,ae(z),Q=!0;break t}S===u(p)&&r(p),ae(z)}else r(p);S=u(p)}if(S!==null)Q=!0;else{var v=u(m);v!==null&&le(te,v.startTime-z),Q=!1}}break e}finally{S=null,N=F,C=!1}Q=void 0}}finally{Q?G():P=!1}}}var G;if(typeof Z=="function")G=function(){Z(q)};else if(typeof MessageChannel<"u"){var oe=new MessageChannel,ue=oe.port2;oe.port1.onmessage=q,G=function(){ue.postMessage(null)}}else G=function(){H(q,0)};function le(z,Q){ee=H(function(){z(a.unstable_now())},Q)}a.unstable_IdlePriority=5,a.unstable_ImmediatePriority=1,a.unstable_LowPriority=4,a.unstable_NormalPriority=3,a.unstable_Profiling=null,a.unstable_UserBlockingPriority=2,a.unstable_cancelCallback=function(z){z.callback=null},a.unstable_forceFrameRate=function(z){0>z||125<z?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):V=0<z?Math.floor(1e3/z):5},a.unstable_getCurrentPriorityLevel=function(){return N},a.unstable_next=function(z){switch(N){case 1:case 2:case 3:var Q=3;break;default:Q=N}var F=N;N=Q;try{return z()}finally{N=F}},a.unstable_requestPaint=function(){j=!0},a.unstable_runWithPriority=function(z,Q){switch(z){case 1:case 2:case 3:case 4:case 5:break;default:z=3}var F=N;N=z;try{return Q()}finally{N=F}},a.unstable_scheduleCallback=function(z,Q,F){var ne=a.unstable_now();switch(typeof F=="object"&&F!==null?(F=F.delay,F=typeof F=="number"&&0<F?ne+F:ne):F=ne,z){case 1:var me=-1;break;case 2:me=250;break;case 5:me=1073741823;break;case 4:me=1e4;break;default:me=5e3}return me=F+me,z={id:E++,callback:Q,priorityLevel:z,startTime:F,expirationTime:me,sortIndex:-1},F>ne?(z.sortIndex=F,o(m,z),u(p)===null&&z===u(m)&&(U?(J(ee),ee=-1):U=!0,le(te,F-ne))):(z.sortIndex=me,o(p,z),A||C||(A=!0,P||(P=!0,G()))),z},a.unstable_shouldYield=ie,a.unstable_wrapCallback=function(z){var Q=N;return function(){var F=N;N=Q;try{return z.apply(this,arguments)}finally{N=F}}}})(Xr)),Xr}var Em;function Kh(){return Em||(Em=1,qr.exports=Zh()),qr.exports}var Gr={exports:{}},gt={};var Tm;function Jh(){if(Tm)return gt;Tm=1;var a=Ri();function o(p){var m="https://react.dev/errors/"+p;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var E=2;E<arguments.length;E++)m+="&args[]="+encodeURIComponent(arguments[E])}return"Minified React error #"+p+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function u(){}var r={d:{f:u,r:function(){throw Error(o(522))},D:u,C:u,L:u,m:u,X:u,S:u,M:u},p:0,findDOMNode:null},c=Symbol.for("react.portal");function d(p,m,E){var S=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:c,key:S==null?null:""+S,children:p,containerInfo:m,implementation:E}}var g=a.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function h(p,m){if(p==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return gt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,gt.createPortal=function(p,m){var E=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(o(299));return d(p,m,null,E)},gt.flushSync=function(p){var m=g.T,E=r.p;try{if(g.T=null,r.p=2,p)return p()}finally{g.T=m,r.p=E,r.d.f()}},gt.preconnect=function(p,m){typeof p=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(p,m))},gt.prefetchDNS=function(p){typeof p=="string"&&r.d.D(p)},gt.preinit=function(p,m){if(typeof p=="string"&&m&&typeof m.as=="string"){var E=m.as,S=h(E,m.crossOrigin),N=typeof m.integrity=="string"?m.integrity:void 0,C=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;E==="style"?r.d.S(p,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:S,integrity:N,fetchPriority:C}):E==="script"&&r.d.X(p,{crossOrigin:S,integrity:N,fetchPriority:C,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},gt.preinitModule=function(p,m){if(typeof p=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var E=h(m.as,m.crossOrigin);r.d.M(p,{crossOrigin:E,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0})}}else m==null&&r.d.M(p)},gt.preload=function(p,m){if(typeof p=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var E=m.as,S=h(E,m.crossOrigin);r.d.L(p,E,{crossOrigin:S,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},gt.preloadModule=function(p,m){if(typeof p=="string")if(m){var E=h(m.as,m.crossOrigin);r.d.m(p,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:E,integrity:typeof m.integrity=="string"?m.integrity:void 0})}else r.d.m(p)},gt.requestFormReset=function(p){r.d.r(p)},gt.unstable_batchedUpdates=function(p,m){return p(m)},gt.useFormState=function(p,m,E){return g.H.useFormState(p,m,E)},gt.useFormStatus=function(){return g.H.useHostTransitionStatus()},gt.version="19.2.4",gt}var Cm;function r0(){if(Cm)return Gr.exports;Cm=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(o){console.error(o)}}return a(),Gr.exports=Jh(),Gr.exports}var Am;function Wh(){if(Am)return Si;Am=1;var a=Kh(),o=Ri(),u=r0();function r(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function c(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function d(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function g(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function h(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function p(e){if(d(e)!==e)throw Error(r(188))}function m(e){var t=e.alternate;if(!t){if(t=d(e),t===null)throw Error(r(188));return t!==e?null:e}for(var n=e,l=t;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(l=i.return,l!==null){n=l;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return p(i),e;if(s===l)return p(i),t;s=s.sibling}throw Error(r(188))}if(n.return!==l.return)n=i,l=s;else{for(var f=!1,_=i.child;_;){if(_===n){f=!0,n=i,l=s;break}if(_===l){f=!0,l=i,n=s;break}_=_.sibling}if(!f){for(_=s.child;_;){if(_===n){f=!0,n=s,l=i;break}if(_===l){f=!0,l=s,n=i;break}_=_.sibling}if(!f)throw Error(r(189))}}if(n.alternate!==l)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function E(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=E(e),t!==null)return t;e=e.sibling}return null}var S=Object.assign,N=Symbol.for("react.element"),C=Symbol.for("react.transitional.element"),A=Symbol.for("react.portal"),U=Symbol.for("react.fragment"),j=Symbol.for("react.strict_mode"),H=Symbol.for("react.profiler"),J=Symbol.for("react.consumer"),Z=Symbol.for("react.context"),ae=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),P=Symbol.for("react.suspense_list"),ee=Symbol.for("react.memo"),V=Symbol.for("react.lazy"),I=Symbol.for("react.activity"),ie=Symbol.for("react.memo_cache_sentinel"),q=Symbol.iterator;function G(e){return e===null||typeof e!="object"?null:(e=q&&e[q]||e["@@iterator"],typeof e=="function"?e:null)}var oe=Symbol.for("react.client.reference");function ue(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===oe?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case U:return"Fragment";case H:return"Profiler";case j:return"StrictMode";case te:return"Suspense";case P:return"SuspenseList";case I:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case A:return"Portal";case Z:return e.displayName||"Context";case J:return(e._context.displayName||"Context")+".Consumer";case ae:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case ee:return t=e.displayName||null,t!==null?t:ue(e.type)||"Memo";case V:t=e._payload,e=e._init;try{return ue(e(t))}catch{}}return null}var le=Array.isArray,z=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,Q=u.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,F={pending:!1,data:null,method:null,action:null},ne=[],me=-1;function v(e){return{current:e}}function k(e){0>me||(e.current=ne[me],ne[me]=null,me--)}function K(e,t){me++,ne[me]=e.current,e.current=t}var W=v(null),de=v(null),be=v(null),Ee=v(null);function We(e,t){switch(K(be,t),K(de,e),K(W,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?X_(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=X_(t),e=G_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}k(W),K(W,e)}function je(){k(W),k(de),k(be)}function bt(e){e.memoizedState!==null&&K(Ee,e);var t=W.current,n=G_(t,e.type);t!==n&&(K(de,e),K(W,n))}function Rt(e){de.current===e&&(k(W),k(de)),Ee.current===e&&(k(Ee),hi._currentValue=F)}var L,ve;function ce(e){if(L===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);L=t&&t[1]||"",ve=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+L+e+ve}var it=!1;function $(e,t){if(!e||it)return"";it=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var X=function(){throw Error()};if(Object.defineProperty(X.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(X,[])}catch(D){var M=D}Reflect.construct(e,[],X)}else{try{X.call()}catch(D){M=D}e.call(X.prototype)}}else{try{throw Error()}catch(D){M=D}(X=e())&&typeof X.catch=="function"&&X.catch(function(){})}}catch(D){if(D&&M&&typeof D.stack=="string")return[D.stack,M.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var i=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");i&&i.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var s=l.DetermineComponentFrameRoot(),f=s[0],_=s[1];if(f&&_){var b=f.split(`
`),R=_.split(`
`);for(i=l=0;l<b.length&&!b[l].includes("DetermineComponentFrameRoot");)l++;for(;i<R.length&&!R[i].includes("DetermineComponentFrameRoot");)i++;if(l===b.length||i===R.length)for(l=b.length-1,i=R.length-1;1<=l&&0<=i&&b[l]!==R[i];)i--;for(;1<=l&&0<=i;l--,i--)if(b[l]!==R[i]){if(l!==1||i!==1)do if(l--,i--,0>i||b[l]!==R[i]){var Y=`
`+b[l].replace(" at new "," at ");return e.displayName&&Y.includes("<anonymous>")&&(Y=Y.replace("<anonymous>",e.displayName)),Y}while(1<=l&&0<=i);break}}}finally{it=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?ce(n):""}function ge(e,t){switch(e.tag){case 26:case 27:case 5:return ce(e.type);case 16:return ce("Lazy");case 13:return e.child!==t&&t!==null?ce("Suspense Fallback"):ce("Suspense");case 19:return ce("SuspenseList");case 0:case 15:return $(e.type,!1);case 11:return $(e.type.render,!1);case 1:return $(e.type,!0);case 31:return ce("Activity");default:return""}}function we(e){try{var t="",n=null;do t+=ge(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var ze=Object.prototype.hasOwnProperty,Ve=a.unstable_scheduleCallback,he=a.unstable_cancelCallback,pe=a.unstable_shouldYield,ht=a.unstable_requestPaint,Be=a.unstable_now,On=a.unstable_getCurrentPriorityLevel,sl=a.unstable_ImmediatePriority,Rl=a.unstable_UserBlockingPriority,Rn=a.unstable_NormalPriority,vt=a.unstable_LowPriority,zn=a.unstable_IdlePriority,zl=a.log,wp=a.unstable_setDisableYieldValue,Ra=null,zt=null;function Mn(e){if(typeof zl=="function"&&wp(e),zt&&typeof zt.setStrictMode=="function")try{zt.setStrictMode(Ra,e)}catch{}}var Mt=Math.clz32?Math.clz32:Cp,Ep=Math.log,Tp=Math.LN2;function Cp(e){return e>>>=0,e===0?32:31-(Ep(e)/Tp|0)|0}var ji=256,Di=262144,ki=4194304;function ul(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Yi(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var i=0,s=e.suspendedLanes,f=e.pingedLanes;e=e.warmLanes;var _=l&134217727;return _!==0?(l=_&~s,l!==0?i=ul(l):(f&=_,f!==0?i=ul(f):n||(n=_&~e,n!==0&&(i=ul(n))))):(_=l&~s,_!==0?i=ul(_):f!==0?i=ul(f):n||(n=l&~e,n!==0&&(i=ul(n)))),i===0?0:t!==0&&t!==i&&(t&s)===0&&(s=i&-i,n=t&-t,s>=n||s===32&&(n&4194048)!==0)?t:i}function za(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function Ap(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Sc(){var e=ki;return ki<<=1,(ki&62914560)===0&&(ki=4194304),e}function Cs(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ma(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function Op(e,t,n,l,i,s){var f=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var _=e.entanglements,b=e.expirationTimes,R=e.hiddenUpdates;for(n=f&~n;0<n;){var Y=31-Mt(n),X=1<<Y;_[Y]=0,b[Y]=-1;var M=R[Y];if(M!==null)for(R[Y]=null,Y=0;Y<M.length;Y++){var D=M[Y];D!==null&&(D.lane&=-536870913)}n&=~X}l!==0&&wc(e,l,0),s!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=s&~(f&~t))}function wc(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-Mt(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function Ec(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-Mt(n),i=1<<l;i&t|e[l]&t&&(e[l]|=t),n&=~i}}function Tc(e,t){var n=t&-t;return n=(n&42)!==0?1:As(n),(n&(e.suspendedLanes|t))!==0?0:n}function As(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function Os(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function Cc(){var e=Q.p;return e!==0?e:(e=window.event,e===void 0?32:dm(e.type))}function Ac(e,t){var n=Q.p;try{return Q.p=e,t()}finally{Q.p=n}}var Nn=Math.random().toString(36).slice(2),rt="__reactFiber$"+Nn,xt="__reactProps$"+Nn,Ml="__reactContainer$"+Nn,Rs="__reactEvents$"+Nn,Rp="__reactListeners$"+Nn,zp="__reactHandles$"+Nn,Oc="__reactResources$"+Nn,Na="__reactMarker$"+Nn;function zs(e){delete e[rt],delete e[xt],delete e[Rs],delete e[Rp],delete e[zp]}function Nl(e){var t=e[rt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Ml]||n[rt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=F_(e);e!==null;){if(n=e[rt])return n;e=F_(e)}return t}e=n,n=e.parentNode}return null}function jl(e){if(e=e[rt]||e[Ml]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function ja(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(r(33))}function Dl(e){var t=e[Oc];return t||(t=e[Oc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function st(e){e[Na]=!0}var Rc=new Set,zc={};function rl(e,t){kl(e,t),kl(e+"Capture",t)}function kl(e,t){for(zc[e]=t,e=0;e<t.length;e++)Rc.add(t[e])}var Mp=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),Mc={},Nc={};function Np(e){return ze.call(Nc,e)?!0:ze.call(Mc,e)?!1:Mp.test(e)?Nc[e]=!0:(Mc[e]=!0,!1)}function Ui(e,t,n){if(Np(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Li(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function rn(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Bt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function jc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function jp(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var i=l.get,s=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(f){n=""+f,s.call(this,f)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(f){n=""+f},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Ms(e){if(!e._valueTracker){var t=jc(e)?"checked":"value";e._valueTracker=jp(e,t,""+e[t])}}function Dc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=jc(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Bi(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var Dp=/[\n"\\]/g;function Ht(e){return e.replace(Dp,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function Ns(e,t,n,l,i,s,f,_){e.name="",f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"?e.type=f:e.removeAttribute("type"),t!=null?f==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Bt(t)):e.value!==""+Bt(t)&&(e.value=""+Bt(t)):f!=="submit"&&f!=="reset"||e.removeAttribute("value"),t!=null?js(e,f,Bt(t)):n!=null?js(e,f,Bt(n)):l!=null&&e.removeAttribute("value"),i==null&&s!=null&&(e.defaultChecked=!!s),i!=null&&(e.checked=i&&typeof i!="function"&&typeof i!="symbol"),_!=null&&typeof _!="function"&&typeof _!="symbol"&&typeof _!="boolean"?e.name=""+Bt(_):e.removeAttribute("name")}function kc(e,t,n,l,i,s,f,_){if(s!=null&&typeof s!="function"&&typeof s!="symbol"&&typeof s!="boolean"&&(e.type=s),t!=null||n!=null){if(!(s!=="submit"&&s!=="reset"||t!=null)){Ms(e);return}n=n!=null?""+Bt(n):"",t=t!=null?""+Bt(t):n,_||t===e.value||(e.value=t),e.defaultValue=t}l=l??i,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=_?e.checked:!!l,e.defaultChecked=!!l,f!=null&&typeof f!="function"&&typeof f!="symbol"&&typeof f!="boolean"&&(e.name=f),Ms(e)}function js(e,t,n){t==="number"&&Bi(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Yl(e,t,n,l){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t["$"+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty("$"+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Bt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,l&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function Yc(e,t,n){if(t!=null&&(t=""+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Bt(n):""}function Uc(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(r(92));if(le(l)){if(1<l.length)throw Error(r(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Bt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),Ms(e)}function Ul(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var kp=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Lc(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||kp.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Bc(e,t,n){if(t!=null&&typeof t!="object")throw Error(r(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var i in t)l=t[i],t.hasOwnProperty(i)&&n[i]!==l&&Lc(e,i,l)}else for(var s in t)t.hasOwnProperty(s)&&Lc(e,s,t[s])}function Ds(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Yp=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),Up=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Hi(e){return Up.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function cn(){}var ks=null;function Ys(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ll=null,Bl=null;function Hc(e){var t=jl(e);if(t&&(e=t.stateNode)){var n=e[xt]||null;e:switch(e=t.stateNode,t.type){case"input":if(Ns(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Ht(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var i=l[xt]||null;if(!i)throw Error(r(90));Ns(l,i.value,i.defaultValue,i.defaultValue,i.checked,i.defaultChecked,i.type,i.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&Dc(l)}break e;case"textarea":Yc(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Yl(e,!!n.multiple,t,!1)}}}var Us=!1;function qc(e,t,n){if(Us)return e(t,n);Us=!0;try{var l=e(t);return l}finally{if(Us=!1,(Ll!==null||Bl!==null)&&(Oo(),Ll&&(t=Ll,e=Bl,Bl=Ll=null,Hc(t),e)))for(t=0;t<e.length;t++)Hc(e[t])}}function Da(e,t){var n=e.stateNode;if(n===null)return null;var l=n[xt]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(r(231,t,typeof n));return n}var fn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ls=!1;if(fn)try{var ka={};Object.defineProperty(ka,"passive",{get:function(){Ls=!0}}),window.addEventListener("test",ka,ka),window.removeEventListener("test",ka,ka)}catch{Ls=!1}var jn=null,Bs=null,qi=null;function Xc(){if(qi)return qi;var e,t=Bs,n=t.length,l,i="value"in jn?jn.value:jn.textContent,s=i.length;for(e=0;e<n&&t[e]===i[e];e++);var f=n-e;for(l=1;l<=f&&t[n-l]===i[s-l];l++);return qi=i.slice(e,1<l?1-l:void 0)}function Xi(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Gi(){return!0}function Gc(){return!1}function St(e){function t(n,l,i,s,f){this._reactName=n,this._targetInst=i,this.type=l,this.nativeEvent=s,this.target=f,this.currentTarget=null;for(var _ in e)e.hasOwnProperty(_)&&(n=e[_],this[_]=n?n(s):s[_]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Gi:Gc,this.isPropagationStopped=Gc,this}return S(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Gi)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Gi)},persist:function(){},isPersistent:Gi}),t}var cl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Qi=St(cl),Ya=S({},cl,{view:0,detail:0}),Lp=St(Ya),Hs,qs,Ua,Vi=S({},Ya,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ua&&(Ua&&e.type==="mousemove"?(Hs=e.screenX-Ua.screenX,qs=e.screenY-Ua.screenY):qs=Hs=0,Ua=e),Hs)},movementY:function(e){return"movementY"in e?e.movementY:qs}}),Qc=St(Vi),Bp=S({},Vi,{dataTransfer:0}),Hp=St(Bp),qp=S({},Ya,{relatedTarget:0}),Xs=St(qp),Xp=S({},cl,{animationName:0,elapsedTime:0,pseudoElement:0}),Gp=St(Xp),Qp=S({},cl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Vp=St(Qp),Zp=S({},cl,{data:0}),Vc=St(Zp),Kp={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Jp={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Wp={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Fp(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Wp[e])?!!t[e]:!1}function Gs(){return Fp}var Ip=S({},Ya,{key:function(e){if(e.key){var t=Kp[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Xi(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Jp[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gs,charCode:function(e){return e.type==="keypress"?Xi(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Xi(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Pp=St(Ip),$p=S({},Vi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Zc=St($p),eg=S({},Ya,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gs}),tg=St(eg),ng=S({},cl,{propertyName:0,elapsedTime:0,pseudoElement:0}),lg=St(ng),ag=S({},Vi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),ig=St(ag),og=S({},cl,{newState:0,oldState:0}),sg=St(og),ug=[9,13,27,32],Qs=fn&&"CompositionEvent"in window,La=null;fn&&"documentMode"in document&&(La=document.documentMode);var rg=fn&&"TextEvent"in window&&!La,Kc=fn&&(!Qs||La&&8<La&&11>=La),Jc=" ",Wc=!1;function Fc(e,t){switch(e){case"keyup":return ug.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Ic(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Hl=!1;function cg(e,t){switch(e){case"compositionend":return Ic(t);case"keypress":return t.which!==32?null:(Wc=!0,Jc);case"textInput":return e=t.data,e===Jc&&Wc?null:e;default:return null}}function fg(e,t){if(Hl)return e==="compositionend"||!Qs&&Fc(e,t)?(e=Xc(),qi=Bs=jn=null,Hl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Kc&&t.locale!=="ko"?null:t.data;default:return null}}var dg={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Pc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!dg[e.type]:t==="textarea"}function $c(e,t,n,l){Ll?Bl?Bl.push(l):Bl=[l]:Ll=l,t=ko(t,"onChange"),0<t.length&&(n=new Qi("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Ba=null,Ha=null;function _g(e){Y_(e,0)}function Zi(e){var t=ja(e);if(Dc(t))return e}function ef(e,t){if(e==="change")return t}var tf=!1;if(fn){var Vs;if(fn){var Zs="oninput"in document;if(!Zs){var nf=document.createElement("div");nf.setAttribute("oninput","return;"),Zs=typeof nf.oninput=="function"}Vs=Zs}else Vs=!1;tf=Vs&&(!document.documentMode||9<document.documentMode)}function lf(){Ba&&(Ba.detachEvent("onpropertychange",af),Ha=Ba=null)}function af(e){if(e.propertyName==="value"&&Zi(Ha)){var t=[];$c(t,Ha,e,Ys(e)),qc(_g,t)}}function mg(e,t,n){e==="focusin"?(lf(),Ba=t,Ha=n,Ba.attachEvent("onpropertychange",af)):e==="focusout"&&lf()}function pg(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Zi(Ha)}function gg(e,t){if(e==="click")return Zi(t)}function hg(e,t){if(e==="input"||e==="change")return Zi(t)}function yg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Nt=typeof Object.is=="function"?Object.is:yg;function qa(e,t){if(Nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var i=n[l];if(!ze.call(t,i)||!Nt(e[i],t[i]))return!1}return!0}function of(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function sf(e,t){var n=of(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=of(n)}}function uf(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?uf(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function rf(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Bi(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Bi(e.document)}return t}function Ks(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var bg=fn&&"documentMode"in document&&11>=document.documentMode,ql=null,Js=null,Xa=null,Ws=!1;function cf(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ws||ql==null||ql!==Bi(l)||(l=ql,"selectionStart"in l&&Ks(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Xa&&qa(Xa,l)||(Xa=l,l=ko(Js,"onSelect"),0<l.length&&(t=new Qi("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=ql)))}function fl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Xl={animationend:fl("Animation","AnimationEnd"),animationiteration:fl("Animation","AnimationIteration"),animationstart:fl("Animation","AnimationStart"),transitionrun:fl("Transition","TransitionRun"),transitionstart:fl("Transition","TransitionStart"),transitioncancel:fl("Transition","TransitionCancel"),transitionend:fl("Transition","TransitionEnd")},Fs={},ff={};fn&&(ff=document.createElement("div").style,"AnimationEvent"in window||(delete Xl.animationend.animation,delete Xl.animationiteration.animation,delete Xl.animationstart.animation),"TransitionEvent"in window||delete Xl.transitionend.transition);function dl(e){if(Fs[e])return Fs[e];if(!Xl[e])return e;var t=Xl[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in ff)return Fs[e]=t[n];return e}var df=dl("animationend"),_f=dl("animationiteration"),mf=dl("animationstart"),vg=dl("transitionrun"),xg=dl("transitionstart"),Sg=dl("transitioncancel"),pf=dl("transitionend"),gf=new Map,Is="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Is.push("scrollEnd");function Ft(e,t){gf.set(e,t),rl(t,[e])}var Ki=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},qt=[],Gl=0,Ps=0;function Ji(){for(var e=Gl,t=Ps=Gl=0;t<e;){var n=qt[t];qt[t++]=null;var l=qt[t];qt[t++]=null;var i=qt[t];qt[t++]=null;var s=qt[t];if(qt[t++]=null,l!==null&&i!==null){var f=l.pending;f===null?i.next=i:(i.next=f.next,f.next=i),l.pending=i}s!==0&&hf(n,i,s)}}function Wi(e,t,n,l){qt[Gl++]=e,qt[Gl++]=t,qt[Gl++]=n,qt[Gl++]=l,Ps|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function $s(e,t,n,l){return Wi(e,t,n,l),Fi(e)}function _l(e,t){return Wi(e,null,null,t),Fi(e)}function hf(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var i=!1,s=e.return;s!==null;)s.childLanes|=n,l=s.alternate,l!==null&&(l.childLanes|=n),s.tag===22&&(e=s.stateNode,e===null||e._visibility&1||(i=!0)),e=s,s=s.return;return e.tag===3?(s=e.stateNode,i&&t!==null&&(i=31-Mt(n),e=s.hiddenUpdates,l=e[i],l===null?e[i]=[t]:l.push(t),t.lane=n|536870912),s):null}function Fi(e){if(50<ci)throw ci=0,ur=null,Error(r(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Ql={};function wg(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function jt(e,t,n,l){return new wg(e,t,n,l)}function eu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function dn(e,t){var n=e.alternate;return n===null?(n=jt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function yf(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Ii(e,t,n,l,i,s){var f=0;if(l=e,typeof e=="function")eu(e)&&(f=1);else if(typeof e=="string")f=Oh(e,n,W.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case I:return e=jt(31,n,t,i),e.elementType=I,e.lanes=s,e;case U:return ml(n.children,i,s,t);case j:f=8,i|=24;break;case H:return e=jt(12,n,t,i|2),e.elementType=H,e.lanes=s,e;case te:return e=jt(13,n,t,i),e.elementType=te,e.lanes=s,e;case P:return e=jt(19,n,t,i),e.elementType=P,e.lanes=s,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case Z:f=10;break e;case J:f=9;break e;case ae:f=11;break e;case ee:f=14;break e;case V:f=16,l=null;break e}f=29,n=Error(r(130,e===null?"null":typeof e,"")),l=null}return t=jt(f,n,t,i),t.elementType=e,t.type=l,t.lanes=s,t}function ml(e,t,n,l){return e=jt(7,e,l,t),e.lanes=n,e}function tu(e,t,n){return e=jt(6,e,null,t),e.lanes=n,e}function bf(e){var t=jt(18,null,null,0);return t.stateNode=e,t}function nu(e,t,n){return t=jt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var vf=new WeakMap;function Xt(e,t){if(typeof e=="object"&&e!==null){var n=vf.get(e);return n!==void 0?n:(t={value:e,source:t,stack:we(t)},vf.set(e,t),t)}return{value:e,source:t,stack:we(t)}}var Vl=[],Zl=0,Pi=null,Ga=0,Gt=[],Qt=0,Dn=null,tn=1,nn="";function _n(e,t){Vl[Zl++]=Ga,Vl[Zl++]=Pi,Pi=e,Ga=t}function xf(e,t,n){Gt[Qt++]=tn,Gt[Qt++]=nn,Gt[Qt++]=Dn,Dn=e;var l=tn;e=nn;var i=32-Mt(l)-1;l&=~(1<<i),n+=1;var s=32-Mt(t)+i;if(30<s){var f=i-i%5;s=(l&(1<<f)-1).toString(32),l>>=f,i-=f,tn=1<<32-Mt(t)+i|n<<i|l,nn=s+e}else tn=1<<s|n<<i|l,nn=e}function lu(e){e.return!==null&&(_n(e,1),xf(e,1,0))}function au(e){for(;e===Pi;)Pi=Vl[--Zl],Vl[Zl]=null,Ga=Vl[--Zl],Vl[Zl]=null;for(;e===Dn;)Dn=Gt[--Qt],Gt[Qt]=null,nn=Gt[--Qt],Gt[Qt]=null,tn=Gt[--Qt],Gt[Qt]=null}function Sf(e,t){Gt[Qt++]=tn,Gt[Qt++]=nn,Gt[Qt++]=Dn,tn=t.id,nn=t.overflow,Dn=e}var ct=null,Ze=null,Re=!1,kn=null,Vt=!1,iu=Error(r(519));function Yn(e){var t=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Qa(Xt(t,e)),iu}function wf(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[rt]=e,t[xt]=l,n){case"dialog":Ce("cancel",t),Ce("close",t);break;case"iframe":case"object":case"embed":Ce("load",t);break;case"video":case"audio":for(n=0;n<di.length;n++)Ce(di[n],t);break;case"source":Ce("error",t);break;case"img":case"image":case"link":Ce("error",t),Ce("load",t);break;case"details":Ce("toggle",t);break;case"input":Ce("invalid",t),kc(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":Ce("invalid",t);break;case"textarea":Ce("invalid",t),Uc(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||H_(t.textContent,n)?(l.popover!=null&&(Ce("beforetoggle",t),Ce("toggle",t)),l.onScroll!=null&&Ce("scroll",t),l.onScrollEnd!=null&&Ce("scrollend",t),l.onClick!=null&&(t.onclick=cn),t=!0):t=!1,t||Yn(e,!0)}function Ef(e){for(ct=e.return;ct;)switch(ct.tag){case 5:case 31:case 13:Vt=!1;return;case 27:case 3:Vt=!0;return;default:ct=ct.return}}function Kl(e){if(e!==ct)return!1;if(!Re)return Ef(e),Re=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||wr(e.type,e.memoizedProps)),n=!n),n&&Ze&&Yn(e),Ef(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ze=W_(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ze=W_(e)}else t===27?(t=Ze,Fn(e.type)?(e=Or,Or=null,Ze=e):Ze=t):Ze=ct?Kt(e.stateNode.nextSibling):null;return!0}function pl(){Ze=ct=null,Re=!1}function ou(){var e=kn;return e!==null&&(Ct===null?Ct=e:Ct.push.apply(Ct,e),kn=null),e}function Qa(e){kn===null?kn=[e]:kn.push(e)}var su=v(null),gl=null,mn=null;function Un(e,t,n){K(su,t._currentValue),t._currentValue=n}function pn(e){e._currentValue=su.current,k(su)}function uu(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function ru(e,t,n,l){var i=e.child;for(i!==null&&(i.return=e);i!==null;){var s=i.dependencies;if(s!==null){var f=i.child;s=s.firstContext;e:for(;s!==null;){var _=s;s=i;for(var b=0;b<t.length;b++)if(_.context===t[b]){s.lanes|=n,_=s.alternate,_!==null&&(_.lanes|=n),uu(s.return,n,e),l||(f=null);break e}s=_.next}}else if(i.tag===18){if(f=i.return,f===null)throw Error(r(341));f.lanes|=n,s=f.alternate,s!==null&&(s.lanes|=n),uu(f,n,e),f=null}else f=i.child;if(f!==null)f.return=i;else for(f=i;f!==null;){if(f===e){f=null;break}if(i=f.sibling,i!==null){i.return=f.return,f=i;break}f=f.return}i=f}}function Jl(e,t,n,l){e=null;for(var i=t,s=!1;i!==null;){if(!s){if((i.flags&524288)!==0)s=!0;else if((i.flags&262144)!==0)break}if(i.tag===10){var f=i.alternate;if(f===null)throw Error(r(387));if(f=f.memoizedProps,f!==null){var _=i.type;Nt(i.pendingProps.value,f.value)||(e!==null?e.push(_):e=[_])}}else if(i===Ee.current){if(f=i.alternate,f===null)throw Error(r(387));f.memoizedState.memoizedState!==i.memoizedState.memoizedState&&(e!==null?e.push(hi):e=[hi])}i=i.return}e!==null&&ru(t,e,n,l),t.flags|=262144}function $i(e){for(e=e.firstContext;e!==null;){if(!Nt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function hl(e){gl=e,mn=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function ft(e){return Tf(gl,e)}function eo(e,t){return gl===null&&hl(e),Tf(e,t)}function Tf(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},mn===null){if(e===null)throw Error(r(308));mn=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else mn=mn.next=t;return n}var Eg=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},Tg=a.unstable_scheduleCallback,Cg=a.unstable_NormalPriority,et={$$typeof:Z,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function cu(){return{controller:new Eg,data:new Map,refCount:0}}function Va(e){e.refCount--,e.refCount===0&&Tg(Cg,function(){e.controller.abort()})}var Za=null,fu=0,Wl=0,Fl=null;function Ag(e,t){if(Za===null){var n=Za=[];fu=0,Wl=mr(),Fl={status:"pending",value:void 0,then:function(l){n.push(l)}}}return fu++,t.then(Cf,Cf),t}function Cf(){if(--fu===0&&Za!==null){Fl!==null&&(Fl.status="fulfilled");var e=Za;Za=null,Wl=0,Fl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Og(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(i){n.push(i)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var i=0;i<n.length;i++)(0,n[i])(t)},function(i){for(l.status="rejected",l.reason=i,i=0;i<n.length;i++)(0,n[i])(void 0)}),l}var Af=z.S;z.S=function(e,t){c_=Be(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Ag(e,t),Af!==null&&Af(e,t)};var yl=v(null);function du(){var e=yl.current;return e!==null?e:Ge.pooledCache}function to(e,t){t===null?K(yl,yl.current):K(yl,t.pool)}function Of(){var e=du();return e===null?null:{parent:et._currentValue,pool:e}}var Il=Error(r(460)),_u=Error(r(474)),no=Error(r(542)),lo={then:function(){}};function Rf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function zf(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(cn,cn),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Nf(e),e;default:if(typeof t.status=="string")t.then(cn,cn);else{if(e=Ge,e!==null&&100<e.shellSuspendCounter)throw Error(r(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var i=t;i.status="fulfilled",i.value=l}},function(l){if(t.status==="pending"){var i=t;i.status="rejected",i.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,Nf(e),e}throw vl=t,Il}}function bl(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(vl=n,Il):n}}var vl=null;function Mf(){if(vl===null)throw Error(r(459));var e=vl;return vl=null,e}function Nf(e){if(e===Il||e===no)throw Error(r(483))}var Pl=null,Ka=0;function ao(e){var t=Ka;return Ka+=1,Pl===null&&(Pl=[]),zf(Pl,e,t)}function Ja(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function io(e,t){throw t.$$typeof===N?Error(r(525)):(e=Object.prototype.toString.call(t),Error(r(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function jf(e){function t(T,x){if(e){var O=T.deletions;O===null?(T.deletions=[x],T.flags|=16):O.push(x)}}function n(T,x){if(!e)return null;for(;x!==null;)t(T,x),x=x.sibling;return null}function l(T){for(var x=new Map;T!==null;)T.key!==null?x.set(T.key,T):x.set(T.index,T),T=T.sibling;return x}function i(T,x){return T=dn(T,x),T.index=0,T.sibling=null,T}function s(T,x,O){return T.index=O,e?(O=T.alternate,O!==null?(O=O.index,O<x?(T.flags|=67108866,x):O):(T.flags|=67108866,x)):(T.flags|=1048576,x)}function f(T){return e&&T.alternate===null&&(T.flags|=67108866),T}function _(T,x,O,B){return x===null||x.tag!==6?(x=tu(O,T.mode,B),x.return=T,x):(x=i(x,O),x.return=T,x)}function b(T,x,O,B){var fe=O.type;return fe===U?Y(T,x,O.props.children,B,O.key):x!==null&&(x.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===V&&bl(fe)===x.type)?(x=i(x,O.props),Ja(x,O),x.return=T,x):(x=Ii(O.type,O.key,O.props,null,T.mode,B),Ja(x,O),x.return=T,x)}function R(T,x,O,B){return x===null||x.tag!==4||x.stateNode.containerInfo!==O.containerInfo||x.stateNode.implementation!==O.implementation?(x=nu(O,T.mode,B),x.return=T,x):(x=i(x,O.children||[]),x.return=T,x)}function Y(T,x,O,B,fe){return x===null||x.tag!==7?(x=ml(O,T.mode,B,fe),x.return=T,x):(x=i(x,O),x.return=T,x)}function X(T,x,O){if(typeof x=="string"&&x!==""||typeof x=="number"||typeof x=="bigint")return x=tu(""+x,T.mode,O),x.return=T,x;if(typeof x=="object"&&x!==null){switch(x.$$typeof){case C:return O=Ii(x.type,x.key,x.props,null,T.mode,O),Ja(O,x),O.return=T,O;case A:return x=nu(x,T.mode,O),x.return=T,x;case V:return x=bl(x),X(T,x,O)}if(le(x)||G(x))return x=ml(x,T.mode,O,null),x.return=T,x;if(typeof x.then=="function")return X(T,ao(x),O);if(x.$$typeof===Z)return X(T,eo(T,x),O);io(T,x)}return null}function M(T,x,O,B){var fe=x!==null?x.key:null;if(typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint")return fe!==null?null:_(T,x,""+O,B);if(typeof O=="object"&&O!==null){switch(O.$$typeof){case C:return O.key===fe?b(T,x,O,B):null;case A:return O.key===fe?R(T,x,O,B):null;case V:return O=bl(O),M(T,x,O,B)}if(le(O)||G(O))return fe!==null?null:Y(T,x,O,B,null);if(typeof O.then=="function")return M(T,x,ao(O),B);if(O.$$typeof===Z)return M(T,x,eo(T,O),B);io(T,O)}return null}function D(T,x,O,B,fe){if(typeof B=="string"&&B!==""||typeof B=="number"||typeof B=="bigint")return T=T.get(O)||null,_(x,T,""+B,fe);if(typeof B=="object"&&B!==null){switch(B.$$typeof){case C:return T=T.get(B.key===null?O:B.key)||null,b(x,T,B,fe);case A:return T=T.get(B.key===null?O:B.key)||null,R(x,T,B,fe);case V:return B=bl(B),D(T,x,O,B,fe)}if(le(B)||G(B))return T=T.get(O)||null,Y(x,T,B,fe,null);if(typeof B.then=="function")return D(T,x,O,ao(B),fe);if(B.$$typeof===Z)return D(T,x,O,eo(x,B),fe);io(x,B)}return null}function se(T,x,O,B){for(var fe=null,Me=null,re=x,Se=x=0,Oe=null;re!==null&&Se<O.length;Se++){re.index>Se?(Oe=re,re=null):Oe=re.sibling;var Ne=M(T,re,O[Se],B);if(Ne===null){re===null&&(re=Oe);break}e&&re&&Ne.alternate===null&&t(T,re),x=s(Ne,x,Se),Me===null?fe=Ne:Me.sibling=Ne,Me=Ne,re=Oe}if(Se===O.length)return n(T,re),Re&&_n(T,Se),fe;if(re===null){for(;Se<O.length;Se++)re=X(T,O[Se],B),re!==null&&(x=s(re,x,Se),Me===null?fe=re:Me.sibling=re,Me=re);return Re&&_n(T,Se),fe}for(re=l(re);Se<O.length;Se++)Oe=D(re,T,Se,O[Se],B),Oe!==null&&(e&&Oe.alternate!==null&&re.delete(Oe.key===null?Se:Oe.key),x=s(Oe,x,Se),Me===null?fe=Oe:Me.sibling=Oe,Me=Oe);return e&&re.forEach(function(tl){return t(T,tl)}),Re&&_n(T,Se),fe}function _e(T,x,O,B){if(O==null)throw Error(r(151));for(var fe=null,Me=null,re=x,Se=x=0,Oe=null,Ne=O.next();re!==null&&!Ne.done;Se++,Ne=O.next()){re.index>Se?(Oe=re,re=null):Oe=re.sibling;var tl=M(T,re,Ne.value,B);if(tl===null){re===null&&(re=Oe);break}e&&re&&tl.alternate===null&&t(T,re),x=s(tl,x,Se),Me===null?fe=tl:Me.sibling=tl,Me=tl,re=Oe}if(Ne.done)return n(T,re),Re&&_n(T,Se),fe;if(re===null){for(;!Ne.done;Se++,Ne=O.next())Ne=X(T,Ne.value,B),Ne!==null&&(x=s(Ne,x,Se),Me===null?fe=Ne:Me.sibling=Ne,Me=Ne);return Re&&_n(T,Se),fe}for(re=l(re);!Ne.done;Se++,Ne=O.next())Ne=D(re,T,Se,Ne.value,B),Ne!==null&&(e&&Ne.alternate!==null&&re.delete(Ne.key===null?Se:Ne.key),x=s(Ne,x,Se),Me===null?fe=Ne:Me.sibling=Ne,Me=Ne);return e&&re.forEach(function(Bh){return t(T,Bh)}),Re&&_n(T,Se),fe}function Xe(T,x,O,B){if(typeof O=="object"&&O!==null&&O.type===U&&O.key===null&&(O=O.props.children),typeof O=="object"&&O!==null){switch(O.$$typeof){case C:e:{for(var fe=O.key;x!==null;){if(x.key===fe){if(fe=O.type,fe===U){if(x.tag===7){n(T,x.sibling),B=i(x,O.props.children),B.return=T,T=B;break e}}else if(x.elementType===fe||typeof fe=="object"&&fe!==null&&fe.$$typeof===V&&bl(fe)===x.type){n(T,x.sibling),B=i(x,O.props),Ja(B,O),B.return=T,T=B;break e}n(T,x);break}else t(T,x);x=x.sibling}O.type===U?(B=ml(O.props.children,T.mode,B,O.key),B.return=T,T=B):(B=Ii(O.type,O.key,O.props,null,T.mode,B),Ja(B,O),B.return=T,T=B)}return f(T);case A:e:{for(fe=O.key;x!==null;){if(x.key===fe)if(x.tag===4&&x.stateNode.containerInfo===O.containerInfo&&x.stateNode.implementation===O.implementation){n(T,x.sibling),B=i(x,O.children||[]),B.return=T,T=B;break e}else{n(T,x);break}else t(T,x);x=x.sibling}B=nu(O,T.mode,B),B.return=T,T=B}return f(T);case V:return O=bl(O),Xe(T,x,O,B)}if(le(O))return se(T,x,O,B);if(G(O)){if(fe=G(O),typeof fe!="function")throw Error(r(150));return O=fe.call(O),_e(T,x,O,B)}if(typeof O.then=="function")return Xe(T,x,ao(O),B);if(O.$$typeof===Z)return Xe(T,x,eo(T,O),B);io(T,O)}return typeof O=="string"&&O!==""||typeof O=="number"||typeof O=="bigint"?(O=""+O,x!==null&&x.tag===6?(n(T,x.sibling),B=i(x,O),B.return=T,T=B):(n(T,x),B=tu(O,T.mode,B),B.return=T,T=B),f(T)):n(T,x)}return function(T,x,O,B){try{Ka=0;var fe=Xe(T,x,O,B);return Pl=null,fe}catch(re){if(re===Il||re===no)throw re;var Me=jt(29,re,null,T.mode);return Me.lanes=B,Me.return=T,Me}}}var xl=jf(!0),Df=jf(!1),Ln=!1;function mu(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function pu(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Bn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Hn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(De&2)!==0){var i=l.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),l.pending=t,t=Fi(e),hf(e,null,n),t}return Wi(e,l,t,n),Fi(e)}function Wa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Ec(e,n)}}function gu(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var f={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};s===null?i=s=f:s=s.next=f,n=n.next}while(n!==null);s===null?i=s=t:s=s.next=t}else i=s=t;n={baseState:l.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var hu=!1;function Fa(){if(hu){var e=Fl;if(e!==null)throw e}}function Ia(e,t,n,l){hu=!1;var i=e.updateQueue;Ln=!1;var s=i.firstBaseUpdate,f=i.lastBaseUpdate,_=i.shared.pending;if(_!==null){i.shared.pending=null;var b=_,R=b.next;b.next=null,f===null?s=R:f.next=R,f=b;var Y=e.alternate;Y!==null&&(Y=Y.updateQueue,_=Y.lastBaseUpdate,_!==f&&(_===null?Y.firstBaseUpdate=R:_.next=R,Y.lastBaseUpdate=b))}if(s!==null){var X=i.baseState;f=0,Y=R=b=null,_=s;do{var M=_.lane&-536870913,D=M!==_.lane;if(D?(Ae&M)===M:(l&M)===M){M!==0&&M===Wl&&(hu=!0),Y!==null&&(Y=Y.next={lane:0,tag:_.tag,payload:_.payload,callback:null,next:null});e:{var se=e,_e=_;M=t;var Xe=n;switch(_e.tag){case 1:if(se=_e.payload,typeof se=="function"){X=se.call(Xe,X,M);break e}X=se;break e;case 3:se.flags=se.flags&-65537|128;case 0:if(se=_e.payload,M=typeof se=="function"?se.call(Xe,X,M):se,M==null)break e;X=S({},X,M);break e;case 2:Ln=!0}}M=_.callback,M!==null&&(e.flags|=64,D&&(e.flags|=8192),D=i.callbacks,D===null?i.callbacks=[M]:D.push(M))}else D={lane:M,tag:_.tag,payload:_.payload,callback:_.callback,next:null},Y===null?(R=Y=D,b=X):Y=Y.next=D,f|=M;if(_=_.next,_===null){if(_=i.shared.pending,_===null)break;D=_,_=D.next,D.next=null,i.lastBaseUpdate=D,i.shared.pending=null}}while(!0);Y===null&&(b=X),i.baseState=b,i.firstBaseUpdate=R,i.lastBaseUpdate=Y,s===null&&(i.shared.lanes=0),Vn|=f,e.lanes=f,e.memoizedState=X}}function kf(e,t){if(typeof e!="function")throw Error(r(191,e));e.call(t)}function Yf(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)kf(n[e],t)}var $l=v(null),oo=v(0);function Uf(e,t){e=En,K(oo,e),K($l,t),En=e|t.baseLanes}function yu(){K(oo,En),K($l,$l.current)}function bu(){En=oo.current,k($l),k(oo)}var Dt=v(null),Zt=null;function qn(e){var t=e.alternate;K(Pe,Pe.current&1),K(Dt,e),Zt===null&&(t===null||$l.current!==null||t.memoizedState!==null)&&(Zt=e)}function vu(e){K(Pe,Pe.current),K(Dt,e),Zt===null&&(Zt=e)}function Lf(e){e.tag===22?(K(Pe,Pe.current),K(Dt,e),Zt===null&&(Zt=e)):Xn()}function Xn(){K(Pe,Pe.current),K(Dt,Dt.current)}function kt(e){k(Dt),Zt===e&&(Zt=null),k(Pe)}var Pe=v(0);function so(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||Cr(n)||Ar(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var gn=0,xe=null,He=null,tt=null,uo=!1,ea=!1,Sl=!1,ro=0,Pa=0,ta=null,Rg=0;function Fe(){throw Error(r(321))}function xu(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Nt(e[n],t[n]))return!1;return!0}function Su(e,t,n,l,i,s){return gn=s,xe=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,z.H=e===null||e.memoizedState===null?xd:Uu,Sl=!1,s=n(l,i),Sl=!1,ea&&(s=Hf(t,n,l,i)),Bf(e),s}function Bf(e){z.H=ti;var t=He!==null&&He.next!==null;if(gn=0,tt=He=xe=null,uo=!1,Pa=0,ta=null,t)throw Error(r(300));e===null||nt||(e=e.dependencies,e!==null&&$i(e)&&(nt=!0))}function Hf(e,t,n,l){xe=e;var i=0;do{if(ea&&(ta=null),Pa=0,ea=!1,25<=i)throw Error(r(301));if(i+=1,tt=He=null,e.updateQueue!=null){var s=e.updateQueue;s.lastEffect=null,s.events=null,s.stores=null,s.memoCache!=null&&(s.memoCache.index=0)}z.H=Sd,s=t(n,l)}while(ea);return s}function zg(){var e=z.H,t=e.useState()[0];return t=typeof t.then=="function"?$a(t):t,e=e.useState()[0],(He!==null?He.memoizedState:null)!==e&&(xe.flags|=1024),t}function wu(){var e=ro!==0;return ro=0,e}function Eu(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Tu(e){if(uo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}uo=!1}gn=0,tt=He=xe=null,ea=!1,Pa=ro=0,ta=null}function yt(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?xe.memoizedState=tt=e:tt=tt.next=e,tt}function $e(){if(He===null){var e=xe.alternate;e=e!==null?e.memoizedState:null}else e=He.next;var t=tt===null?xe.memoizedState:tt.next;if(t!==null)tt=t,He=e;else{if(e===null)throw xe.alternate===null?Error(r(467)):Error(r(310));He=e,e={memoizedState:He.memoizedState,baseState:He.baseState,baseQueue:He.baseQueue,queue:He.queue,next:null},tt===null?xe.memoizedState=tt=e:tt=tt.next=e}return tt}function co(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function $a(e){var t=Pa;return Pa+=1,ta===null&&(ta=[]),e=zf(ta,e,t),t=xe,(tt===null?t.memoizedState:tt.next)===null&&(t=t.alternate,z.H=t===null||t.memoizedState===null?xd:Uu),e}function fo(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return $a(e);if(e.$$typeof===Z)return ft(e)}throw Error(r(438,String(e)))}function Cu(e){var t=null,n=xe.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=xe.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(i){return i.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=co(),xe.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=ie;return t.index++,n}function hn(e,t){return typeof t=="function"?t(e):t}function _o(e){var t=$e();return Au(t,He,e)}function Au(e,t,n){var l=e.queue;if(l===null)throw Error(r(311));l.lastRenderedReducer=n;var i=e.baseQueue,s=l.pending;if(s!==null){if(i!==null){var f=i.next;i.next=s.next,s.next=f}t.baseQueue=i=s,l.pending=null}if(s=e.baseState,i===null)e.memoizedState=s;else{t=i.next;var _=f=null,b=null,R=t,Y=!1;do{var X=R.lane&-536870913;if(X!==R.lane?(Ae&X)===X:(gn&X)===X){var M=R.revertLane;if(M===0)b!==null&&(b=b.next={lane:0,revertLane:0,gesture:null,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null}),X===Wl&&(Y=!0);else if((gn&M)===M){R=R.next,M===Wl&&(Y=!0);continue}else X={lane:0,revertLane:R.revertLane,gesture:null,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null},b===null?(_=b=X,f=s):b=b.next=X,xe.lanes|=M,Vn|=M;X=R.action,Sl&&n(s,X),s=R.hasEagerState?R.eagerState:n(s,X)}else M={lane:X,revertLane:R.revertLane,gesture:R.gesture,action:R.action,hasEagerState:R.hasEagerState,eagerState:R.eagerState,next:null},b===null?(_=b=M,f=s):b=b.next=M,xe.lanes|=X,Vn|=X;R=R.next}while(R!==null&&R!==t);if(b===null?f=s:b.next=_,!Nt(s,e.memoizedState)&&(nt=!0,Y&&(n=Fl,n!==null)))throw n;e.memoizedState=s,e.baseState=f,e.baseQueue=b,l.lastRenderedState=s}return i===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function Ou(e){var t=$e(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var l=n.dispatch,i=n.pending,s=t.memoizedState;if(i!==null){n.pending=null;var f=i=i.next;do s=e(s,f.action),f=f.next;while(f!==i);Nt(s,t.memoizedState)||(nt=!0),t.memoizedState=s,t.baseQueue===null&&(t.baseState=s),n.lastRenderedState=s}return[s,l]}function qf(e,t,n){var l=xe,i=$e(),s=Re;if(s){if(n===void 0)throw Error(r(407));n=n()}else n=t();var f=!Nt((He||i).memoizedState,n);if(f&&(i.memoizedState=n,nt=!0),i=i.queue,Mu(Qf.bind(null,l,i,e),[e]),i.getSnapshot!==t||f||tt!==null&&tt.memoizedState.tag&1){if(l.flags|=2048,na(9,{destroy:void 0},Gf.bind(null,l,i,n,t),null),Ge===null)throw Error(r(349));s||(gn&127)!==0||Xf(l,t,n)}return n}function Xf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=xe.updateQueue,t===null?(t=co(),xe.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Gf(e,t,n,l){t.value=n,t.getSnapshot=l,Vf(t)&&Zf(e)}function Qf(e,t,n){return n(function(){Vf(t)&&Zf(e)})}function Vf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Nt(e,n)}catch{return!0}}function Zf(e){var t=_l(e,2);t!==null&&At(t,e,2)}function Ru(e){var t=yt();if(typeof e=="function"){var n=e;if(e=n(),Sl){Mn(!0);try{n()}finally{Mn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:hn,lastRenderedState:e},t}function Kf(e,t,n,l){return e.baseState=n,Au(e,He,typeof l=="function"?l:hn)}function Mg(e,t,n,l,i){if(go(e))throw Error(r(485));if(e=t.action,e!==null){var s={payload:i,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(f){s.listeners.push(f)}};z.T!==null?n(!0):s.isTransition=!1,l(s),n=t.pending,n===null?(s.next=t.pending=s,Jf(t,s)):(s.next=n.next,t.pending=n.next=s)}}function Jf(e,t){var n=t.action,l=t.payload,i=e.state;if(t.isTransition){var s=z.T,f={};z.T=f;try{var _=n(i,l),b=z.S;b!==null&&b(f,_),Wf(e,t,_)}catch(R){zu(e,t,R)}finally{s!==null&&f.types!==null&&(s.types=f.types),z.T=s}}else try{s=n(i,l),Wf(e,t,s)}catch(R){zu(e,t,R)}}function Wf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Ff(e,t,l)},function(l){return zu(e,t,l)}):Ff(e,t,n)}function Ff(e,t,n){t.status="fulfilled",t.value=n,If(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Jf(e,n)))}function zu(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,If(t),t=t.next;while(t!==l)}e.action=null}function If(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Pf(e,t){return t}function $f(e,t){if(Re){var n=Ge.formState;if(n!==null){e:{var l=xe;if(Re){if(Ze){t:{for(var i=Ze,s=Vt;i.nodeType!==8;){if(!s){i=null;break t}if(i=Kt(i.nextSibling),i===null){i=null;break t}}s=i.data,i=s==="F!"||s==="F"?i:null}if(i){Ze=Kt(i.nextSibling),l=i.data==="F!";break e}}Yn(l)}l=!1}l&&(t=n[0])}}return n=yt(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Pf,lastRenderedState:t},n.queue=l,n=yd.bind(null,xe,l),l.dispatch=n,l=Ru(!1),s=Yu.bind(null,xe,!1,l.queue),l=yt(),i={state:t,dispatch:null,action:e,pending:null},l.queue=i,n=Mg.bind(null,xe,i,s,n),i.dispatch=n,l.memoizedState=e,[t,n,!1]}function ed(e){var t=$e();return td(t,He,e)}function td(e,t,n){if(t=Au(e,t,Pf)[0],e=_o(hn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=$a(t)}catch(f){throw f===Il?no:f}else l=t;t=$e();var i=t.queue,s=i.dispatch;return n!==t.memoizedState&&(xe.flags|=2048,na(9,{destroy:void 0},Ng.bind(null,i,n),null)),[l,s,e]}function Ng(e,t){e.action=t}function nd(e){var t=$e(),n=He;if(n!==null)return td(t,n,e);$e(),t=t.memoizedState,n=$e();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function na(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=xe.updateQueue,t===null&&(t=co(),xe.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function ld(){return $e().memoizedState}function mo(e,t,n,l){var i=yt();xe.flags|=e,i.memoizedState=na(1|t,{destroy:void 0},n,l===void 0?null:l)}function po(e,t,n,l){var i=$e();l=l===void 0?null:l;var s=i.memoizedState.inst;He!==null&&l!==null&&xu(l,He.memoizedState.deps)?i.memoizedState=na(t,s,n,l):(xe.flags|=e,i.memoizedState=na(1|t,s,n,l))}function ad(e,t){mo(8390656,8,e,t)}function Mu(e,t){po(2048,8,e,t)}function jg(e){xe.flags|=4;var t=xe.updateQueue;if(t===null)t=co(),xe.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function id(e){var t=$e().memoizedState;return jg({ref:t,nextImpl:e}),function(){if((De&2)!==0)throw Error(r(440));return t.impl.apply(void 0,arguments)}}function od(e,t){return po(4,2,e,t)}function sd(e,t){return po(4,4,e,t)}function ud(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function rd(e,t,n){n=n!=null?n.concat([e]):null,po(4,4,ud.bind(null,t,e),n)}function Nu(){}function cd(e,t){var n=$e();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&xu(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function fd(e,t){var n=$e();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&xu(t,l[1]))return l[0];if(l=e(),Sl){Mn(!0);try{e()}finally{Mn(!1)}}return n.memoizedState=[l,t],l}function ju(e,t,n){return n===void 0||(gn&1073741824)!==0&&(Ae&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=d_(),xe.lanes|=e,Vn|=e,n)}function dd(e,t,n,l){return Nt(n,t)?n:$l.current!==null?(e=ju(e,n,l),Nt(e,t)||(nt=!0),e):(gn&42)===0||(gn&1073741824)!==0&&(Ae&261930)===0?(nt=!0,e.memoizedState=n):(e=d_(),xe.lanes|=e,Vn|=e,t)}function _d(e,t,n,l,i){var s=Q.p;Q.p=s!==0&&8>s?s:8;var f=z.T,_={};z.T=_,Yu(e,!1,t,n);try{var b=i(),R=z.S;if(R!==null&&R(_,b),b!==null&&typeof b=="object"&&typeof b.then=="function"){var Y=Og(b,l);ei(e,t,Y,Lt(e))}else ei(e,t,l,Lt(e))}catch(X){ei(e,t,{then:function(){},status:"rejected",reason:X},Lt())}finally{Q.p=s,f!==null&&_.types!==null&&(f.types=_.types),z.T=f}}function Dg(){}function Du(e,t,n,l){if(e.tag!==5)throw Error(r(476));var i=md(e).queue;_d(e,i,t,F,n===null?Dg:function(){return pd(e),n(l)})}function md(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:F,baseState:F,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:hn,lastRenderedState:F},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:hn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function pd(e){var t=md(e);t.next===null&&(t=e.alternate.memoizedState),ei(e,t.next.queue,{},Lt())}function ku(){return ft(hi)}function gd(){return $e().memoizedState}function hd(){return $e().memoizedState}function kg(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Lt();e=Bn(n);var l=Hn(t,e,n);l!==null&&(At(l,t,n),Wa(l,t,n)),t={cache:cu()},e.payload=t;return}t=t.return}}function Yg(e,t,n){var l=Lt();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},go(e)?bd(t,n):(n=$s(e,t,n,l),n!==null&&(At(n,e,l),vd(n,t,l)))}function yd(e,t,n){var l=Lt();ei(e,t,n,l)}function ei(e,t,n,l){var i={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(go(e))bd(t,i);else{var s=e.alternate;if(e.lanes===0&&(s===null||s.lanes===0)&&(s=t.lastRenderedReducer,s!==null))try{var f=t.lastRenderedState,_=s(f,n);if(i.hasEagerState=!0,i.eagerState=_,Nt(_,f))return Wi(e,t,i,0),Ge===null&&Ji(),!1}catch{}if(n=$s(e,t,i,l),n!==null)return At(n,e,l),vd(n,t,l),!0}return!1}function Yu(e,t,n,l){if(l={lane:2,revertLane:mr(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},go(e)){if(t)throw Error(r(479))}else t=$s(e,n,l,2),t!==null&&At(t,e,2)}function go(e){var t=e.alternate;return e===xe||t!==null&&t===xe}function bd(e,t){ea=uo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function vd(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,Ec(e,n)}}var ti={readContext:ft,use:fo,useCallback:Fe,useContext:Fe,useEffect:Fe,useImperativeHandle:Fe,useLayoutEffect:Fe,useInsertionEffect:Fe,useMemo:Fe,useReducer:Fe,useRef:Fe,useState:Fe,useDebugValue:Fe,useDeferredValue:Fe,useTransition:Fe,useSyncExternalStore:Fe,useId:Fe,useHostTransitionStatus:Fe,useFormState:Fe,useActionState:Fe,useOptimistic:Fe,useMemoCache:Fe,useCacheRefresh:Fe};ti.useEffectEvent=Fe;var xd={readContext:ft,use:fo,useCallback:function(e,t){return yt().memoizedState=[e,t===void 0?null:t],e},useContext:ft,useEffect:ad,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,mo(4194308,4,ud.bind(null,t,e),n)},useLayoutEffect:function(e,t){return mo(4194308,4,e,t)},useInsertionEffect:function(e,t){mo(4,2,e,t)},useMemo:function(e,t){var n=yt();t=t===void 0?null:t;var l=e();if(Sl){Mn(!0);try{e()}finally{Mn(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=yt();if(n!==void 0){var i=n(t);if(Sl){Mn(!0);try{n(t)}finally{Mn(!1)}}}else i=t;return l.memoizedState=l.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},l.queue=e,e=e.dispatch=Yg.bind(null,xe,e),[l.memoizedState,e]},useRef:function(e){var t=yt();return e={current:e},t.memoizedState=e},useState:function(e){e=Ru(e);var t=e.queue,n=yd.bind(null,xe,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Nu,useDeferredValue:function(e,t){var n=yt();return ju(n,e,t)},useTransition:function(){var e=Ru(!1);return e=_d.bind(null,xe,e.queue,!0,!1),yt().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=xe,i=yt();if(Re){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),Ge===null)throw Error(r(349));(Ae&127)!==0||Xf(l,t,n)}i.memoizedState=n;var s={value:n,getSnapshot:t};return i.queue=s,ad(Qf.bind(null,l,s,e),[e]),l.flags|=2048,na(9,{destroy:void 0},Gf.bind(null,l,s,n,t),null),n},useId:function(){var e=yt(),t=Ge.identifierPrefix;if(Re){var n=nn,l=tn;n=(l&~(1<<32-Mt(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=ro++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Rg++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:ku,useFormState:$f,useActionState:$f,useOptimistic:function(e){var t=yt();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Yu.bind(null,xe,!0,n),n.dispatch=t,[e,t]},useMemoCache:Cu,useCacheRefresh:function(){return yt().memoizedState=kg.bind(null,xe)},useEffectEvent:function(e){var t=yt(),n={impl:e};return t.memoizedState=n,function(){if((De&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}},Uu={readContext:ft,use:fo,useCallback:cd,useContext:ft,useEffect:Mu,useImperativeHandle:rd,useInsertionEffect:od,useLayoutEffect:sd,useMemo:fd,useReducer:_o,useRef:ld,useState:function(){return _o(hn)},useDebugValue:Nu,useDeferredValue:function(e,t){var n=$e();return dd(n,He.memoizedState,e,t)},useTransition:function(){var e=_o(hn)[0],t=$e().memoizedState;return[typeof e=="boolean"?e:$a(e),t]},useSyncExternalStore:qf,useId:gd,useHostTransitionStatus:ku,useFormState:ed,useActionState:ed,useOptimistic:function(e,t){var n=$e();return Kf(n,He,e,t)},useMemoCache:Cu,useCacheRefresh:hd};Uu.useEffectEvent=id;var Sd={readContext:ft,use:fo,useCallback:cd,useContext:ft,useEffect:Mu,useImperativeHandle:rd,useInsertionEffect:od,useLayoutEffect:sd,useMemo:fd,useReducer:Ou,useRef:ld,useState:function(){return Ou(hn)},useDebugValue:Nu,useDeferredValue:function(e,t){var n=$e();return He===null?ju(n,e,t):dd(n,He.memoizedState,e,t)},useTransition:function(){var e=Ou(hn)[0],t=$e().memoizedState;return[typeof e=="boolean"?e:$a(e),t]},useSyncExternalStore:qf,useId:gd,useHostTransitionStatus:ku,useFormState:nd,useActionState:nd,useOptimistic:function(e,t){var n=$e();return He!==null?Kf(n,He,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:Cu,useCacheRefresh:hd};Sd.useEffectEvent=id;function Lu(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:S({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Bu={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=Lt(),i=Bn(l);i.payload=t,n!=null&&(i.callback=n),t=Hn(e,i,l),t!==null&&(At(t,e,l),Wa(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=Lt(),i=Bn(l);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Hn(e,i,l),t!==null&&(At(t,e,l),Wa(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Lt(),l=Bn(n);l.tag=2,t!=null&&(l.callback=t),t=Hn(e,l,n),t!==null&&(At(t,e,n),Wa(t,e,n))}};function wd(e,t,n,l,i,s,f){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,s,f):t.prototype&&t.prototype.isPureReactComponent?!qa(n,l)||!qa(i,s):!0}function Ed(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&Bu.enqueueReplaceState(t,t.state,null)}function wl(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=S({},n));for(var i in e)n[i]===void 0&&(n[i]=e[i])}return n}function Td(e){Ki(e)}function Cd(e){console.error(e)}function Ad(e){Ki(e)}function ho(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function Od(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(i){setTimeout(function(){throw i})}}function Hu(e,t,n){return n=Bn(n),n.tag=3,n.payload={element:null},n.callback=function(){ho(e,t)},n}function Rd(e){return e=Bn(e),e.tag=3,e}function zd(e,t,n,l){var i=n.type.getDerivedStateFromError;if(typeof i=="function"){var s=l.value;e.payload=function(){return i(s)},e.callback=function(){Od(t,n,l)}}var f=n.stateNode;f!==null&&typeof f.componentDidCatch=="function"&&(e.callback=function(){Od(t,n,l),typeof i!="function"&&(Zn===null?Zn=new Set([this]):Zn.add(this));var _=l.stack;this.componentDidCatch(l.value,{componentStack:_!==null?_:""})})}function Ug(e,t,n,l,i){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&Jl(t,n,i,!0),n=Dt.current,n!==null){switch(n.tag){case 31:case 13:return Zt===null?Ro():n.alternate===null&&Ie===0&&(Ie=3),n.flags&=-257,n.flags|=65536,n.lanes=i,l===lo?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),fr(e,l,i)),!1;case 22:return n.flags|=65536,l===lo?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),fr(e,l,i)),!1}throw Error(r(435,n.tag))}return fr(e,l,i),Ro(),!1}if(Re)return t=Dt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=i,l!==iu&&(e=Error(r(422),{cause:l}),Qa(Xt(e,n)))):(l!==iu&&(t=Error(r(423),{cause:l}),Qa(Xt(t,n))),e=e.current.alternate,e.flags|=65536,i&=-i,e.lanes|=i,l=Xt(l,n),i=Hu(e.stateNode,l,i),gu(e,i),Ie!==4&&(Ie=2)),!1;var s=Error(r(520),{cause:l});if(s=Xt(s,n),ri===null?ri=[s]:ri.push(s),Ie!==4&&(Ie=2),t===null)return!0;l=Xt(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=i&-i,n.lanes|=e,e=Hu(n.stateNode,l,e),gu(n,e),!1;case 1:if(t=n.type,s=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||s!==null&&typeof s.componentDidCatch=="function"&&(Zn===null||!Zn.has(s))))return n.flags|=65536,i&=-i,n.lanes|=i,i=Rd(i),zd(i,e,n,l),gu(n,i),!1}n=n.return}while(n!==null);return!1}var qu=Error(r(461)),nt=!1;function dt(e,t,n,l){t.child=e===null?Df(t,null,n,l):xl(t,e.child,n,l)}function Md(e,t,n,l,i){n=n.render;var s=t.ref;if("ref"in l){var f={};for(var _ in l)_!=="ref"&&(f[_]=l[_])}else f=l;return hl(t),l=Su(e,t,n,f,s,i),_=wu(),e!==null&&!nt?(Eu(e,t,i),yn(e,t,i)):(Re&&_&&lu(t),t.flags|=1,dt(e,t,l,i),t.child)}function Nd(e,t,n,l,i){if(e===null){var s=n.type;return typeof s=="function"&&!eu(s)&&s.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=s,jd(e,t,s,l,i)):(e=Ii(n.type,null,l,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(s=e.child,!Wu(e,i)){var f=s.memoizedProps;if(n=n.compare,n=n!==null?n:qa,n(f,l)&&e.ref===t.ref)return yn(e,t,i)}return t.flags|=1,e=dn(s,l),e.ref=t.ref,e.return=t,t.child=e}function jd(e,t,n,l,i){if(e!==null){var s=e.memoizedProps;if(qa(s,l)&&e.ref===t.ref)if(nt=!1,t.pendingProps=l=s,Wu(e,i))(e.flags&131072)!==0&&(nt=!0);else return t.lanes=e.lanes,yn(e,t,i)}return Xu(e,t,n,l,i)}function Dd(e,t,n,l){var i=l.children,s=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(s=s!==null?s.baseLanes|n:n,e!==null){for(l=t.child=e.child,i=0;l!==null;)i=i|l.lanes|l.childLanes,l=l.sibling;l=i&~s}else l=0,t.child=null;return kd(e,t,s,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&to(t,s!==null?s.cachePool:null),s!==null?Uf(t,s):yu(),Lf(t);else return l=t.lanes=536870912,kd(e,t,s!==null?s.baseLanes|n:n,n,l)}else s!==null?(to(t,s.cachePool),Uf(t,s),Xn(),t.memoizedState=null):(e!==null&&to(t,null),yu(),Xn());return dt(e,t,i,n),t.child}function ni(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function kd(e,t,n,l,i){var s=du();return s=s===null?null:{parent:et._currentValue,pool:s},t.memoizedState={baseLanes:n,cachePool:s},e!==null&&to(t,null),yu(),Lf(t),e!==null&&Jl(e,t,l,!0),t.childLanes=i,null}function yo(e,t){return t=vo({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Yd(e,t,n){return xl(t,e.child,null,n),e=yo(t,t.pendingProps),e.flags|=2,kt(t),t.memoizedState=null,e}function Lg(e,t,n){var l=t.pendingProps,i=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Re){if(l.mode==="hidden")return e=yo(t,l),t.lanes=536870912,ni(null,e);if(vu(t),(e=Ze)?(e=J_(e,Vt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Dn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=bf(e),n.return=t,t.child=n,ct=t,Ze=null)):e=null,e===null)throw Yn(t);return t.lanes=536870912,null}return yo(t,l)}var s=e.memoizedState;if(s!==null){var f=s.dehydrated;if(vu(t),i)if(t.flags&256)t.flags&=-257,t=Yd(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(r(558));else if(nt||Jl(e,t,n,!1),i=(n&e.childLanes)!==0,nt||i){if(l=Ge,l!==null&&(f=Tc(l,n),f!==0&&f!==s.retryLane))throw s.retryLane=f,_l(e,f),At(l,e,f),qu;Ro(),t=Yd(e,t,n)}else e=s.treeContext,Ze=Kt(f.nextSibling),ct=t,Re=!0,kn=null,Vt=!1,e!==null&&Sf(t,e),t=yo(t,l),t.flags|=4096;return t}return e=dn(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function bo(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(r(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Xu(e,t,n,l,i){return hl(t),n=Su(e,t,n,l,void 0,i),l=wu(),e!==null&&!nt?(Eu(e,t,i),yn(e,t,i)):(Re&&l&&lu(t),t.flags|=1,dt(e,t,n,i),t.child)}function Ud(e,t,n,l,i,s){return hl(t),t.updateQueue=null,n=Hf(t,l,n,i),Bf(e),l=wu(),e!==null&&!nt?(Eu(e,t,s),yn(e,t,s)):(Re&&l&&lu(t),t.flags|=1,dt(e,t,n,s),t.child)}function Ld(e,t,n,l,i){if(hl(t),t.stateNode===null){var s=Ql,f=n.contextType;typeof f=="object"&&f!==null&&(s=ft(f)),s=new n(l,s),t.memoizedState=s.state!==null&&s.state!==void 0?s.state:null,s.updater=Bu,t.stateNode=s,s._reactInternals=t,s=t.stateNode,s.props=l,s.state=t.memoizedState,s.refs={},mu(t),f=n.contextType,s.context=typeof f=="object"&&f!==null?ft(f):Ql,s.state=t.memoizedState,f=n.getDerivedStateFromProps,typeof f=="function"&&(Lu(t,n,f,l),s.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof s.getSnapshotBeforeUpdate=="function"||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(f=s.state,typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount(),f!==s.state&&Bu.enqueueReplaceState(s,s.state,null),Ia(t,l,s,i),Fa(),s.state=t.memoizedState),typeof s.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){s=t.stateNode;var _=t.memoizedProps,b=wl(n,_);s.props=b;var R=s.context,Y=n.contextType;f=Ql,typeof Y=="object"&&Y!==null&&(f=ft(Y));var X=n.getDerivedStateFromProps;Y=typeof X=="function"||typeof s.getSnapshotBeforeUpdate=="function",_=t.pendingProps!==_,Y||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(_||R!==f)&&Ed(t,s,l,f),Ln=!1;var M=t.memoizedState;s.state=M,Ia(t,l,s,i),Fa(),R=t.memoizedState,_||M!==R||Ln?(typeof X=="function"&&(Lu(t,n,X,l),R=t.memoizedState),(b=Ln||wd(t,n,b,l,M,R,f))?(Y||typeof s.UNSAFE_componentWillMount!="function"&&typeof s.componentWillMount!="function"||(typeof s.componentWillMount=="function"&&s.componentWillMount(),typeof s.UNSAFE_componentWillMount=="function"&&s.UNSAFE_componentWillMount()),typeof s.componentDidMount=="function"&&(t.flags|=4194308)):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=R),s.props=l,s.state=R,s.context=f,l=b):(typeof s.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{s=t.stateNode,pu(e,t),f=t.memoizedProps,Y=wl(n,f),s.props=Y,X=t.pendingProps,M=s.context,R=n.contextType,b=Ql,typeof R=="object"&&R!==null&&(b=ft(R)),_=n.getDerivedStateFromProps,(R=typeof _=="function"||typeof s.getSnapshotBeforeUpdate=="function")||typeof s.UNSAFE_componentWillReceiveProps!="function"&&typeof s.componentWillReceiveProps!="function"||(f!==X||M!==b)&&Ed(t,s,l,b),Ln=!1,M=t.memoizedState,s.state=M,Ia(t,l,s,i),Fa();var D=t.memoizedState;f!==X||M!==D||Ln||e!==null&&e.dependencies!==null&&$i(e.dependencies)?(typeof _=="function"&&(Lu(t,n,_,l),D=t.memoizedState),(Y=Ln||wd(t,n,Y,l,M,D,b)||e!==null&&e.dependencies!==null&&$i(e.dependencies))?(R||typeof s.UNSAFE_componentWillUpdate!="function"&&typeof s.componentWillUpdate!="function"||(typeof s.componentWillUpdate=="function"&&s.componentWillUpdate(l,D,b),typeof s.UNSAFE_componentWillUpdate=="function"&&s.UNSAFE_componentWillUpdate(l,D,b)),typeof s.componentDidUpdate=="function"&&(t.flags|=4),typeof s.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof s.componentDidUpdate!="function"||f===e.memoizedProps&&M===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&M===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=D),s.props=l,s.state=D,s.context=b,l=Y):(typeof s.componentDidUpdate!="function"||f===e.memoizedProps&&M===e.memoizedState||(t.flags|=4),typeof s.getSnapshotBeforeUpdate!="function"||f===e.memoizedProps&&M===e.memoizedState||(t.flags|=1024),l=!1)}return s=l,bo(e,t),l=(t.flags&128)!==0,s||l?(s=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:s.render(),t.flags|=1,e!==null&&l?(t.child=xl(t,e.child,null,i),t.child=xl(t,null,n,i)):dt(e,t,n,i),t.memoizedState=s.state,e=t.child):e=yn(e,t,i),e}function Bd(e,t,n,l){return pl(),t.flags|=256,dt(e,t,n,l),t.child}var Gu={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Qu(e){return{baseLanes:e,cachePool:Of()}}function Vu(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Ut),e}function Hd(e,t,n){var l=t.pendingProps,i=!1,s=(t.flags&128)!==0,f;if((f=s)||(f=e!==null&&e.memoizedState===null?!1:(Pe.current&2)!==0),f&&(i=!0,t.flags&=-129),f=(t.flags&32)!==0,t.flags&=-33,e===null){if(Re){if(i?qn(t):Xn(),(e=Ze)?(e=J_(e,Vt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Dn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=bf(e),n.return=t,t.child=n,ct=t,Ze=null)):e=null,e===null)throw Yn(t);return Ar(e)?t.lanes=32:t.lanes=536870912,null}var _=l.children;return l=l.fallback,i?(Xn(),i=t.mode,_=vo({mode:"hidden",children:_},i),l=ml(l,i,n,null),_.return=t,l.return=t,_.sibling=l,t.child=_,l=t.child,l.memoizedState=Qu(n),l.childLanes=Vu(e,f,n),t.memoizedState=Gu,ni(null,l)):(qn(t),Zu(t,_))}var b=e.memoizedState;if(b!==null&&(_=b.dehydrated,_!==null)){if(s)t.flags&256?(qn(t),t.flags&=-257,t=Ku(e,t,n)):t.memoizedState!==null?(Xn(),t.child=e.child,t.flags|=128,t=null):(Xn(),_=l.fallback,i=t.mode,l=vo({mode:"visible",children:l.children},i),_=ml(_,i,n,null),_.flags|=2,l.return=t,_.return=t,l.sibling=_,t.child=l,xl(t,e.child,null,n),l=t.child,l.memoizedState=Qu(n),l.childLanes=Vu(e,f,n),t.memoizedState=Gu,t=ni(null,l));else if(qn(t),Ar(_)){if(f=_.nextSibling&&_.nextSibling.dataset,f)var R=f.dgst;f=R,l=Error(r(419)),l.stack="",l.digest=f,Qa({value:l,source:null,stack:null}),t=Ku(e,t,n)}else if(nt||Jl(e,t,n,!1),f=(n&e.childLanes)!==0,nt||f){if(f=Ge,f!==null&&(l=Tc(f,n),l!==0&&l!==b.retryLane))throw b.retryLane=l,_l(e,l),At(f,e,l),qu;Cr(_)||Ro(),t=Ku(e,t,n)}else Cr(_)?(t.flags|=192,t.child=e.child,t=null):(e=b.treeContext,Ze=Kt(_.nextSibling),ct=t,Re=!0,kn=null,Vt=!1,e!==null&&Sf(t,e),t=Zu(t,l.children),t.flags|=4096);return t}return i?(Xn(),_=l.fallback,i=t.mode,b=e.child,R=b.sibling,l=dn(b,{mode:"hidden",children:l.children}),l.subtreeFlags=b.subtreeFlags&65011712,R!==null?_=dn(R,_):(_=ml(_,i,n,null),_.flags|=2),_.return=t,l.return=t,l.sibling=_,t.child=l,ni(null,l),l=t.child,_=e.child.memoizedState,_===null?_=Qu(n):(i=_.cachePool,i!==null?(b=et._currentValue,i=i.parent!==b?{parent:b,pool:b}:i):i=Of(),_={baseLanes:_.baseLanes|n,cachePool:i}),l.memoizedState=_,l.childLanes=Vu(e,f,n),t.memoizedState=Gu,ni(e.child,l)):(qn(t),n=e.child,e=n.sibling,n=dn(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(f=t.deletions,f===null?(t.deletions=[e],t.flags|=16):f.push(e)),t.child=n,t.memoizedState=null,n)}function Zu(e,t){return t=vo({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function vo(e,t){return e=jt(22,e,null,t),e.lanes=0,e}function Ku(e,t,n){return xl(t,e.child,null,n),e=Zu(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function qd(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),uu(e.return,t,n)}function Ju(e,t,n,l,i,s){var f=e.memoizedState;f===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:i,treeForkCount:s}:(f.isBackwards=t,f.rendering=null,f.renderingStartTime=0,f.last=l,f.tail=n,f.tailMode=i,f.treeForkCount=s)}function Xd(e,t,n){var l=t.pendingProps,i=l.revealOrder,s=l.tail;l=l.children;var f=Pe.current,_=(f&2)!==0;if(_?(f=f&1|2,t.flags|=128):f&=1,K(Pe,f),dt(e,t,l,n),l=Re?Ga:0,!_&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&qd(e,n,t);else if(e.tag===19)qd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case"forwards":for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&so(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Ju(t,!1,i,n,s,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&so(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Ju(t,!0,n,null,s,l);break;case"together":Ju(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function yn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Vn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Jl(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=dn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=dn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Wu(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&$i(e)))}function Bg(e,t,n){switch(t.tag){case 3:We(t,t.stateNode.containerInfo),Un(t,et,e.memoizedState.cache),pl();break;case 27:case 5:bt(t);break;case 4:We(t,t.stateNode.containerInfo);break;case 10:Un(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,vu(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(qn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?Hd(e,t,n):(qn(t),e=yn(e,t,n),e!==null?e.sibling:null);qn(t);break;case 19:var i=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(Jl(e,t,n,!1),l=(n&t.childLanes)!==0),i){if(l)return Xd(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),K(Pe,Pe.current),l)break;return null;case 22:return t.lanes=0,Dd(e,t,n,t.pendingProps);case 24:Un(t,et,e.memoizedState.cache)}return yn(e,t,n)}function Gd(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)nt=!0;else{if(!Wu(e,n)&&(t.flags&128)===0)return nt=!1,Bg(e,t,n);nt=(e.flags&131072)!==0}else nt=!1,Re&&(t.flags&1048576)!==0&&xf(t,Ga,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=bl(t.elementType),t.type=e,typeof e=="function")eu(e)?(l=wl(e,l),t.tag=1,t=Ld(null,t,e,l,n)):(t.tag=0,t=Xu(null,t,e,l,n));else{if(e!=null){var i=e.$$typeof;if(i===ae){t.tag=11,t=Md(null,t,e,l,n);break e}else if(i===ee){t.tag=14,t=Nd(null,t,e,l,n);break e}}throw t=ue(e)||e,Error(r(306,t,""))}}return t;case 0:return Xu(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,i=wl(l,t.pendingProps),Ld(e,t,l,i,n);case 3:e:{if(We(t,t.stateNode.containerInfo),e===null)throw Error(r(387));l=t.pendingProps;var s=t.memoizedState;i=s.element,pu(e,t),Ia(t,l,null,n);var f=t.memoizedState;if(l=f.cache,Un(t,et,l),l!==s.cache&&ru(t,[et],n,!0),Fa(),l=f.element,s.isDehydrated)if(s={element:l,isDehydrated:!1,cache:f.cache},t.updateQueue.baseState=s,t.memoizedState=s,t.flags&256){t=Bd(e,t,l,n);break e}else if(l!==i){i=Xt(Error(r(424)),t),Qa(i),t=Bd(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ze=Kt(e.firstChild),ct=t,Re=!0,kn=null,Vt=!0,n=Df(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(pl(),l===i){t=yn(e,t,n);break e}dt(e,t,l,n)}t=t.child}return t;case 26:return bo(e,t),e===null?(n=em(t.type,null,t.pendingProps,null))?t.memoizedState=n:Re||(n=t.type,e=t.pendingProps,l=Yo(be.current).createElement(n),l[rt]=t,l[xt]=e,_t(l,n,e),st(l),t.stateNode=l):t.memoizedState=em(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return bt(t),e===null&&Re&&(l=t.stateNode=I_(t.type,t.pendingProps,be.current),ct=t,Vt=!0,i=Ze,Fn(t.type)?(Or=i,Ze=Kt(l.firstChild)):Ze=i),dt(e,t,t.pendingProps.children,n),bo(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Re&&((i=l=Ze)&&(l=ph(l,t.type,t.pendingProps,Vt),l!==null?(t.stateNode=l,ct=t,Ze=Kt(l.firstChild),Vt=!1,i=!0):i=!1),i||Yn(t)),bt(t),i=t.type,s=t.pendingProps,f=e!==null?e.memoizedProps:null,l=s.children,wr(i,s)?l=null:f!==null&&wr(i,f)&&(t.flags|=32),t.memoizedState!==null&&(i=Su(e,t,zg,null,null,n),hi._currentValue=i),bo(e,t),dt(e,t,l,n),t.child;case 6:return e===null&&Re&&((e=n=Ze)&&(n=gh(n,t.pendingProps,Vt),n!==null?(t.stateNode=n,ct=t,Ze=null,e=!0):e=!1),e||Yn(t)),null;case 13:return Hd(e,t,n);case 4:return We(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=xl(t,null,l,n):dt(e,t,l,n),t.child;case 11:return Md(e,t,t.type,t.pendingProps,n);case 7:return dt(e,t,t.pendingProps,n),t.child;case 8:return dt(e,t,t.pendingProps.children,n),t.child;case 12:return dt(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,Un(t,t.type,l.value),dt(e,t,l.children,n),t.child;case 9:return i=t.type._context,l=t.pendingProps.children,hl(t),i=ft(i),l=l(i),t.flags|=1,dt(e,t,l,n),t.child;case 14:return Nd(e,t,t.type,t.pendingProps,n);case 15:return jd(e,t,t.type,t.pendingProps,n);case 19:return Xd(e,t,n);case 31:return Lg(e,t,n);case 22:return Dd(e,t,n,t.pendingProps);case 24:return hl(t),l=ft(et),e===null?(i=du(),i===null&&(i=Ge,s=cu(),i.pooledCache=s,s.refCount++,s!==null&&(i.pooledCacheLanes|=n),i=s),t.memoizedState={parent:l,cache:i},mu(t),Un(t,et,i)):((e.lanes&n)!==0&&(pu(e,t),Ia(t,null,null,n),Fa()),i=e.memoizedState,s=t.memoizedState,i.parent!==l?(i={parent:l,cache:l},t.memoizedState=i,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=i),Un(t,et,l)):(l=s.cache,Un(t,et,l),l!==i.cache&&ru(t,[et],n,!0))),dt(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(r(156,t.tag))}function bn(e){e.flags|=4}function Fu(e,t,n,l,i){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(g_())e.flags|=8192;else throw vl=lo,_u}else e.flags&=-16777217}function Qd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!im(t))if(g_())e.flags|=8192;else throw vl=lo,_u}function xo(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?Sc():536870912,e.lanes|=t,oa|=t)}function li(e,t){if(!Re)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ke(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,l|=i.subtreeFlags&65011712,l|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,l|=i.subtreeFlags,l|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function Hg(e,t,n){var l=t.pendingProps;switch(au(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ke(t),null;case 1:return Ke(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),pn(et),je(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Kl(t)?bn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,ou())),Ke(t),null;case 26:var i=t.type,s=t.memoizedState;return e===null?(bn(t),s!==null?(Ke(t),Qd(t,s)):(Ke(t),Fu(t,i,null,l,n))):s?s!==e.memoizedState?(bn(t),Ke(t),Qd(t,s)):(Ke(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&bn(t),Ke(t),Fu(t,i,e,l,n)),null;case 27:if(Rt(t),n=be.current,i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&bn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ke(t),null}e=W.current,Kl(t)?wf(t):(e=I_(i,l,n),t.stateNode=e,bn(t))}return Ke(t),null;case 5:if(Rt(t),i=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&bn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ke(t),null}if(s=W.current,Kl(t))wf(t);else{var f=Yo(be.current);switch(s){case 1:s=f.createElementNS("http://www.w3.org/2000/svg",i);break;case 2:s=f.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;default:switch(i){case"svg":s=f.createElementNS("http://www.w3.org/2000/svg",i);break;case"math":s=f.createElementNS("http://www.w3.org/1998/Math/MathML",i);break;case"script":s=f.createElement("div"),s.innerHTML="<script><\/script>",s=s.removeChild(s.firstChild);break;case"select":s=typeof l.is=="string"?f.createElement("select",{is:l.is}):f.createElement("select"),l.multiple?s.multiple=!0:l.size&&(s.size=l.size);break;default:s=typeof l.is=="string"?f.createElement(i,{is:l.is}):f.createElement(i)}}s[rt]=t,s[xt]=l;e:for(f=t.child;f!==null;){if(f.tag===5||f.tag===6)s.appendChild(f.stateNode);else if(f.tag!==4&&f.tag!==27&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;f=f.return}f.sibling.return=f.return,f=f.sibling}t.stateNode=s;e:switch(_t(s,i,l),i){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&bn(t)}}return Ke(t),Fu(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&bn(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(r(166));if(e=be.current,Kl(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,i=ct,i!==null)switch(i.tag){case 27:case 5:l=i.memoizedProps}e[rt]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||H_(e.nodeValue,n)),e||Yn(t,!0)}else e=Yo(e).createTextNode(l),e[rt]=t,t.stateNode=e}return Ke(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=Kl(t),n!==null){if(e===null){if(!l)throw Error(r(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(557));e[rt]=t}else pl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ke(t),e=!1}else n=ou(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(kt(t),t):(kt(t),null);if((t.flags&128)!==0)throw Error(r(558))}return Ke(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(i=Kl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!i)throw Error(r(318));if(i=t.memoizedState,i=i!==null?i.dehydrated:null,!i)throw Error(r(317));i[rt]=t}else pl(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ke(t),i=!1}else i=ou(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=i),i=!0;if(!i)return t.flags&256?(kt(t),t):(kt(t),null)}return kt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,i=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(i=l.alternate.memoizedState.cachePool.pool),s=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(s=l.memoizedState.cachePool.pool),s!==i&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),xo(t,t.updateQueue),Ke(t),null);case 4:return je(),e===null&&yr(t.stateNode.containerInfo),Ke(t),null;case 10:return pn(t.type),Ke(t),null;case 19:if(k(Pe),l=t.memoizedState,l===null)return Ke(t),null;if(i=(t.flags&128)!==0,s=l.rendering,s===null)if(i)li(l,!1);else{if(Ie!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(s=so(e),s!==null){for(t.flags|=128,li(l,!1),e=s.updateQueue,t.updateQueue=e,xo(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)yf(n,e),n=n.sibling;return K(Pe,Pe.current&1|2),Re&&_n(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Be()>Co&&(t.flags|=128,i=!0,li(l,!1),t.lanes=4194304)}else{if(!i)if(e=so(s),e!==null){if(t.flags|=128,i=!0,e=e.updateQueue,t.updateQueue=e,xo(t,e),li(l,!0),l.tail===null&&l.tailMode==="hidden"&&!s.alternate&&!Re)return Ke(t),null}else 2*Be()-l.renderingStartTime>Co&&n!==536870912&&(t.flags|=128,i=!0,li(l,!1),t.lanes=4194304);l.isBackwards?(s.sibling=t.child,t.child=s):(e=l.last,e!==null?e.sibling=s:t.child=s,l.last=s)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Be(),e.sibling=null,n=Pe.current,K(Pe,i?n&1|2:n&1),Re&&_n(t,l.treeForkCount),e):(Ke(t),null);case 22:case 23:return kt(t),bu(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(Ke(t),t.subtreeFlags&6&&(t.flags|=8192)):Ke(t),n=t.updateQueue,n!==null&&xo(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&k(yl),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),pn(et),Ke(t),null;case 25:return null;case 30:return null}throw Error(r(156,t.tag))}function qg(e,t){switch(au(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return pn(et),je(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Rt(t),null;case 31:if(t.memoizedState!==null){if(kt(t),t.alternate===null)throw Error(r(340));pl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(kt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));pl()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return k(Pe),null;case 4:return je(),null;case 10:return pn(t.type),null;case 22:case 23:return kt(t),bu(),e!==null&&k(yl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return pn(et),null;case 25:return null;default:return null}}function Vd(e,t){switch(au(t),t.tag){case 3:pn(et),je();break;case 26:case 27:case 5:Rt(t);break;case 4:je();break;case 31:t.memoizedState!==null&&kt(t);break;case 13:kt(t);break;case 19:k(Pe);break;case 10:pn(t.type);break;case 22:case 23:kt(t),bu(),e!==null&&k(yl);break;case 24:pn(et)}}function ai(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var i=l.next;n=i;do{if((n.tag&e)===e){l=void 0;var s=n.create,f=n.inst;l=s(),f.destroy=l}n=n.next}while(n!==i)}}catch(_){Ye(t,t.return,_)}}function Gn(e,t,n){try{var l=t.updateQueue,i=l!==null?l.lastEffect:null;if(i!==null){var s=i.next;l=s;do{if((l.tag&e)===e){var f=l.inst,_=f.destroy;if(_!==void 0){f.destroy=void 0,i=t;var b=n,R=_;try{R()}catch(Y){Ye(i,b,Y)}}}l=l.next}while(l!==s)}}catch(Y){Ye(t,t.return,Y)}}function Zd(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Yf(t,n)}catch(l){Ye(e,e.return,l)}}}function Kd(e,t,n){n.props=wl(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){Ye(e,t,l)}}function ii(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(i){Ye(e,t,i)}}function ln(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(i){Ye(e,t,i)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(i){Ye(e,t,i)}else n.current=null}function Jd(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(i){Ye(e,e.return,i)}}function Iu(e,t,n){try{var l=e.stateNode;rh(l,e.type,n,t),l[xt]=t}catch(i){Ye(e,e.return,i)}}function Wd(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Fn(e.type)||e.tag===4}function Pu(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Wd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Fn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function $u(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=cn));else if(l!==4&&(l===27&&Fn(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for($u(e,t,n),e=e.sibling;e!==null;)$u(e,t,n),e=e.sibling}function So(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Fn(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(So(e,t,n),e=e.sibling;e!==null;)So(e,t,n),e=e.sibling}function Fd(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);_t(t,l,n),t[rt]=e,t[xt]=n}catch(s){Ye(e,e.return,s)}}var vn=!1,lt=!1,er=!1,Id=typeof WeakSet=="function"?WeakSet:Set,ut=null;function Xg(e,t){if(e=e.containerInfo,xr=Go,e=rf(e),Ks(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var i=l.anchorOffset,s=l.focusNode;l=l.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var f=0,_=-1,b=-1,R=0,Y=0,X=e,M=null;t:for(;;){for(var D;X!==n||i!==0&&X.nodeType!==3||(_=f+i),X!==s||l!==0&&X.nodeType!==3||(b=f+l),X.nodeType===3&&(f+=X.nodeValue.length),(D=X.firstChild)!==null;)M=X,X=D;for(;;){if(X===e)break t;if(M===n&&++R===i&&(_=f),M===s&&++Y===l&&(b=f),(D=X.nextSibling)!==null)break;X=M,M=X.parentNode}X=D}n=_===-1||b===-1?null:{start:_,end:b}}else n=null}n=n||{start:0,end:0}}else n=null;for(Sr={focusedElem:e,selectionRange:n},Go=!1,ut=t;ut!==null;)if(t=ut,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ut=e;else for(;ut!==null;){switch(t=ut,s=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)i=e[n],i.ref.impl=i.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&s!==null){e=void 0,n=t,i=s.memoizedProps,s=s.memoizedState,l=n.stateNode;try{var se=wl(n.type,i);e=l.getSnapshotBeforeUpdate(se,s),l.__reactInternalSnapshotBeforeUpdate=e}catch(_e){Ye(n,n.return,_e)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)Tr(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":Tr(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(r(163))}if(e=t.sibling,e!==null){e.return=t.return,ut=e;break}ut=t.return}}function Pd(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:Sn(e,n),l&4&&ai(5,n);break;case 1:if(Sn(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(f){Ye(n,n.return,f)}else{var i=wl(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(f){Ye(n,n.return,f)}}l&64&&Zd(n),l&512&&ii(n,n.return);break;case 3:if(Sn(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Yf(e,t)}catch(f){Ye(n,n.return,f)}}break;case 27:t===null&&l&4&&Fd(n);case 26:case 5:Sn(e,n),t===null&&l&4&&Jd(n),l&512&&ii(n,n.return);break;case 12:Sn(e,n);break;case 31:Sn(e,n),l&4&&t_(e,n);break;case 13:Sn(e,n),l&4&&n_(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Ig.bind(null,n),hh(e,n))));break;case 22:if(l=n.memoizedState!==null||vn,!l){t=t!==null&&t.memoizedState!==null||lt,i=vn;var s=lt;vn=l,(lt=t)&&!s?wn(e,n,(n.subtreeFlags&8772)!==0):Sn(e,n),vn=i,lt=s}break;case 30:break;default:Sn(e,n)}}function $d(e){var t=e.alternate;t!==null&&(e.alternate=null,$d(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&zs(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Je=null,wt=!1;function xn(e,t,n){for(n=n.child;n!==null;)e_(e,t,n),n=n.sibling}function e_(e,t,n){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(Ra,n)}catch{}switch(n.tag){case 26:lt||ln(n,t),xn(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:lt||ln(n,t);var l=Je,i=wt;Fn(n.type)&&(Je=n.stateNode,wt=!1),xn(e,t,n),mi(n.stateNode),Je=l,wt=i;break;case 5:lt||ln(n,t);case 6:if(l=Je,i=wt,Je=null,xn(e,t,n),Je=l,wt=i,Je!==null)if(wt)try{(Je.nodeType===9?Je.body:Je.nodeName==="HTML"?Je.ownerDocument.body:Je).removeChild(n.stateNode)}catch(s){Ye(n,t,s)}else try{Je.removeChild(n.stateNode)}catch(s){Ye(n,t,s)}break;case 18:Je!==null&&(wt?(e=Je,Z_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),ma(e)):Z_(Je,n.stateNode));break;case 4:l=Je,i=wt,Je=n.stateNode.containerInfo,wt=!0,xn(e,t,n),Je=l,wt=i;break;case 0:case 11:case 14:case 15:Gn(2,n,t),lt||Gn(4,n,t),xn(e,t,n);break;case 1:lt||(ln(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&Kd(n,t,l)),xn(e,t,n);break;case 21:xn(e,t,n);break;case 22:lt=(l=lt)||n.memoizedState!==null,xn(e,t,n),lt=l;break;default:xn(e,t,n)}}function t_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{ma(e)}catch(n){Ye(t,t.return,n)}}}function n_(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{ma(e)}catch(n){Ye(t,t.return,n)}}function Gg(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Id),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Id),t;default:throw Error(r(435,e.tag))}}function wo(e,t){var n=Gg(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var i=Pg.bind(null,e,l);l.then(i,i)}})}function Et(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var i=n[l],s=e,f=t,_=f;e:for(;_!==null;){switch(_.tag){case 27:if(Fn(_.type)){Je=_.stateNode,wt=!1;break e}break;case 5:Je=_.stateNode,wt=!1;break e;case 3:case 4:Je=_.stateNode.containerInfo,wt=!0;break e}_=_.return}if(Je===null)throw Error(r(160));e_(s,f,i),Je=null,wt=!1,s=i.alternate,s!==null&&(s.return=null),i.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)l_(t,e),t=t.sibling}var It=null;function l_(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Et(t,e),Tt(e),l&4&&(Gn(3,e,e.return),ai(3,e),Gn(5,e,e.return));break;case 1:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&64&&vn&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var i=It;if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&4){var s=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,i=i.ownerDocument||i;t:switch(l){case"title":s=i.getElementsByTagName("title")[0],(!s||s[Na]||s[rt]||s.namespaceURI==="http://www.w3.org/2000/svg"||s.hasAttribute("itemprop"))&&(s=i.createElement(l),i.head.insertBefore(s,i.querySelector("head > title"))),_t(s,l,n),s[rt]=e,st(s),l=s;break e;case"link":var f=lm("link","href",i).get(l+(n.href||""));if(f){for(var _=0;_<f.length;_++)if(s=f[_],s.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&s.getAttribute("rel")===(n.rel==null?null:n.rel)&&s.getAttribute("title")===(n.title==null?null:n.title)&&s.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){f.splice(_,1);break t}}s=i.createElement(l),_t(s,l,n),i.head.appendChild(s);break;case"meta":if(f=lm("meta","content",i).get(l+(n.content||""))){for(_=0;_<f.length;_++)if(s=f[_],s.getAttribute("content")===(n.content==null?null:""+n.content)&&s.getAttribute("name")===(n.name==null?null:n.name)&&s.getAttribute("property")===(n.property==null?null:n.property)&&s.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&s.getAttribute("charset")===(n.charSet==null?null:n.charSet)){f.splice(_,1);break t}}s=i.createElement(l),_t(s,l,n),i.head.appendChild(s);break;default:throw Error(r(468,l))}s[rt]=e,st(s),l=s}e.stateNode=l}else am(i,e.type,e.stateNode);else e.stateNode=nm(i,l,e.memoizedProps);else s!==l?(s===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):s.count--,l===null?am(i,e.type,e.stateNode):nm(i,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Iu(e,e.memoizedProps,n.memoizedProps)}break;case 27:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),n!==null&&l&4&&Iu(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),e.flags&32){i=e.stateNode;try{Ul(i,"")}catch(se){Ye(e,e.return,se)}}l&4&&e.stateNode!=null&&(i=e.memoizedProps,Iu(e,i,n!==null?n.memoizedProps:i)),l&1024&&(er=!0);break;case 6:if(Et(t,e),Tt(e),l&4){if(e.stateNode===null)throw Error(r(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(se){Ye(e,e.return,se)}}break;case 3:if(Bo=null,i=It,It=Uo(t.containerInfo),Et(t,e),It=i,Tt(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{ma(t.containerInfo)}catch(se){Ye(e,e.return,se)}er&&(er=!1,a_(e));break;case 4:l=It,It=Uo(e.stateNode.containerInfo),Et(t,e),Tt(e),It=l;break;case 12:Et(t,e),Tt(e);break;case 31:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,wo(e,l)));break;case 13:Et(t,e),Tt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(To=Be()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,wo(e,l)));break;case 22:i=e.memoizedState!==null;var b=n!==null&&n.memoizedState!==null,R=vn,Y=lt;if(vn=R||i,lt=Y||b,Et(t,e),lt=Y,vn=R,Tt(e),l&8192)e:for(t=e.stateNode,t._visibility=i?t._visibility&-2:t._visibility|1,i&&(n===null||b||vn||lt||El(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){b=n=t;try{if(s=b.stateNode,i)f=s.style,typeof f.setProperty=="function"?f.setProperty("display","none","important"):f.display="none";else{_=b.stateNode;var X=b.memoizedProps.style,M=X!=null&&X.hasOwnProperty("display")?X.display:null;_.style.display=M==null||typeof M=="boolean"?"":(""+M).trim()}}catch(se){Ye(b,b.return,se)}}}else if(t.tag===6){if(n===null){b=t;try{b.stateNode.nodeValue=i?"":b.memoizedProps}catch(se){Ye(b,b.return,se)}}}else if(t.tag===18){if(n===null){b=t;try{var D=b.stateNode;i?K_(D,!0):K_(b.stateNode,!1)}catch(se){Ye(b,b.return,se)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,wo(e,n))));break;case 19:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,wo(e,l)));break;case 30:break;case 21:break;default:Et(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(Wd(l)){n=l;break}l=l.return}if(n==null)throw Error(r(160));switch(n.tag){case 27:var i=n.stateNode,s=Pu(e);So(e,s,i);break;case 5:var f=n.stateNode;n.flags&32&&(Ul(f,""),n.flags&=-33);var _=Pu(e);So(e,_,f);break;case 3:case 4:var b=n.stateNode.containerInfo,R=Pu(e);$u(e,R,b);break;default:throw Error(r(161))}}catch(Y){Ye(e,e.return,Y)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function a_(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;a_(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Sn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Pd(e,t.alternate,t),t=t.sibling}function El(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gn(4,t,t.return),El(t);break;case 1:ln(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Kd(t,t.return,n),El(t);break;case 27:mi(t.stateNode);case 26:case 5:ln(t,t.return),El(t);break;case 22:t.memoizedState===null&&El(t);break;case 30:El(t);break;default:El(t)}e=e.sibling}}function wn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,i=e,s=t,f=s.flags;switch(s.tag){case 0:case 11:case 15:wn(i,s,n),ai(4,s);break;case 1:if(wn(i,s,n),l=s,i=l.stateNode,typeof i.componentDidMount=="function")try{i.componentDidMount()}catch(R){Ye(l,l.return,R)}if(l=s,i=l.updateQueue,i!==null){var _=l.stateNode;try{var b=i.shared.hiddenCallbacks;if(b!==null)for(i.shared.hiddenCallbacks=null,i=0;i<b.length;i++)kf(b[i],_)}catch(R){Ye(l,l.return,R)}}n&&f&64&&Zd(s),ii(s,s.return);break;case 27:Fd(s);case 26:case 5:wn(i,s,n),n&&l===null&&f&4&&Jd(s),ii(s,s.return);break;case 12:wn(i,s,n);break;case 31:wn(i,s,n),n&&f&4&&t_(i,s);break;case 13:wn(i,s,n),n&&f&4&&n_(i,s);break;case 22:s.memoizedState===null&&wn(i,s,n),ii(s,s.return);break;case 30:break;default:wn(i,s,n)}t=t.sibling}}function tr(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Va(n))}function nr(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Va(e))}function Pt(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)i_(e,t,n,l),t=t.sibling}function i_(e,t,n,l){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Pt(e,t,n,l),i&2048&&ai(9,t);break;case 1:Pt(e,t,n,l);break;case 3:Pt(e,t,n,l),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Va(e)));break;case 12:if(i&2048){Pt(e,t,n,l),e=t.stateNode;try{var s=t.memoizedProps,f=s.id,_=s.onPostCommit;typeof _=="function"&&_(f,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(b){Ye(t,t.return,b)}}else Pt(e,t,n,l);break;case 31:Pt(e,t,n,l);break;case 13:Pt(e,t,n,l);break;case 23:break;case 22:s=t.stateNode,f=t.alternate,t.memoizedState!==null?s._visibility&2?Pt(e,t,n,l):oi(e,t):s._visibility&2?Pt(e,t,n,l):(s._visibility|=2,la(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),i&2048&&tr(f,t);break;case 24:Pt(e,t,n,l),i&2048&&nr(t.alternate,t);break;default:Pt(e,t,n,l)}}function la(e,t,n,l,i){for(i=i&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var s=e,f=t,_=n,b=l,R=f.flags;switch(f.tag){case 0:case 11:case 15:la(s,f,_,b,i),ai(8,f);break;case 23:break;case 22:var Y=f.stateNode;f.memoizedState!==null?Y._visibility&2?la(s,f,_,b,i):oi(s,f):(Y._visibility|=2,la(s,f,_,b,i)),i&&R&2048&&tr(f.alternate,f);break;case 24:la(s,f,_,b,i),i&&R&2048&&nr(f.alternate,f);break;default:la(s,f,_,b,i)}t=t.sibling}}function oi(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,i=l.flags;switch(l.tag){case 22:oi(n,l),i&2048&&tr(l.alternate,l);break;case 24:oi(n,l),i&2048&&nr(l.alternate,l);break;default:oi(n,l)}t=t.sibling}}var si=8192;function aa(e,t,n){if(e.subtreeFlags&si)for(e=e.child;e!==null;)o_(e,t,n),e=e.sibling}function o_(e,t,n){switch(e.tag){case 26:aa(e,t,n),e.flags&si&&e.memoizedState!==null&&Rh(n,It,e.memoizedState,e.memoizedProps);break;case 5:aa(e,t,n);break;case 3:case 4:var l=It;It=Uo(e.stateNode.containerInfo),aa(e,t,n),It=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=si,si=16777216,aa(e,t,n),si=l):aa(e,t,n));break;default:aa(e,t,n)}}function s_(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ui(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ut=l,r_(l,e)}s_(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)u_(e),e=e.sibling}function u_(e){switch(e.tag){case 0:case 11:case 15:ui(e),e.flags&2048&&Gn(9,e,e.return);break;case 3:ui(e);break;case 12:ui(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Eo(e)):ui(e);break;default:ui(e)}}function Eo(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ut=l,r_(l,e)}s_(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gn(8,t,t.return),Eo(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Eo(t));break;default:Eo(t)}e=e.sibling}}function r_(e,t){for(;ut!==null;){var n=ut;switch(n.tag){case 0:case 11:case 15:Gn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Va(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,ut=l;else e:for(n=e;ut!==null;){l=ut;var i=l.sibling,s=l.return;if($d(l),l===n){ut=null;break e}if(i!==null){i.return=s,ut=i;break e}ut=s}}}var Qg={getCacheForType:function(e){var t=ft(et),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return ft(et).controller.signal}},Vg=typeof WeakMap=="function"?WeakMap:Map,De=0,Ge=null,Te=null,Ae=0,ke=0,Yt=null,Qn=!1,ia=!1,lr=!1,En=0,Ie=0,Vn=0,Tl=0,ar=0,Ut=0,oa=0,ri=null,Ct=null,ir=!1,To=0,c_=0,Co=1/0,Ao=null,Zn=null,ot=0,Kn=null,sa=null,Tn=0,or=0,sr=null,f_=null,ci=0,ur=null;function Lt(){return(De&2)!==0&&Ae!==0?Ae&-Ae:z.T!==null?mr():Cc()}function d_(){if(Ut===0)if((Ae&536870912)===0||Re){var e=Di;Di<<=1,(Di&3932160)===0&&(Di=262144),Ut=e}else Ut=536870912;return e=Dt.current,e!==null&&(e.flags|=32),Ut}function At(e,t,n){(e===Ge&&(ke===2||ke===9)||e.cancelPendingCommit!==null)&&(ua(e,0),Jn(e,Ae,Ut,!1)),Ma(e,n),((De&2)===0||e!==Ge)&&(e===Ge&&((De&2)===0&&(Tl|=n),Ie===4&&Jn(e,Ae,Ut,!1)),an(e))}function __(e,t,n){if((De&6)!==0)throw Error(r(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||za(e,t),i=l?Jg(e,t):cr(e,t,!0),s=l;do{if(i===0){ia&&!l&&Jn(e,t,0,!1);break}else{if(n=e.current.alternate,s&&!Zg(n)){i=cr(e,t,!1),s=!1;continue}if(i===2){if(s=t,e.errorRecoveryDisabledLanes&s)var f=0;else f=e.pendingLanes&-536870913,f=f!==0?f:f&536870912?536870912:0;if(f!==0){t=f;e:{var _=e;i=ri;var b=_.current.memoizedState.isDehydrated;if(b&&(ua(_,f).flags|=256),f=cr(_,f,!1),f!==2){if(lr&&!b){_.errorRecoveryDisabledLanes|=s,Tl|=s,i=4;break e}s=Ct,Ct=i,s!==null&&(Ct===null?Ct=s:Ct.push.apply(Ct,s))}i=f}if(s=!1,i!==2)continue}}if(i===1){ua(e,0),Jn(e,t,0,!0);break}e:{switch(l=e,s=i,s){case 0:case 1:throw Error(r(345));case 4:if((t&4194048)!==t)break;case 6:Jn(l,t,Ut,!Qn);break e;case 2:Ct=null;break;case 3:case 5:break;default:throw Error(r(329))}if((t&62914560)===t&&(i=To+300-Be(),10<i)){if(Jn(l,t,Ut,!Qn),Yi(l,0,!0)!==0)break e;Tn=t,l.timeoutHandle=Q_(m_.bind(null,l,n,Ct,Ao,ir,t,Ut,Tl,oa,Qn,s,"Throttled",-0,0),i);break e}m_(l,n,Ct,Ao,ir,t,Ut,Tl,oa,Qn,s,null,-0,0)}}break}while(!0);an(e)}function m_(e,t,n,l,i,s,f,_,b,R,Y,X,M,D){if(e.timeoutHandle=-1,X=t.subtreeFlags,X&8192||(X&16785408)===16785408){X={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:cn},o_(t,s,X);var se=(s&62914560)===s?To-Be():(s&4194048)===s?c_-Be():0;if(se=zh(X,se),se!==null){Tn=s,e.cancelPendingCommit=se(S_.bind(null,e,t,s,n,l,i,f,_,b,Y,X,null,M,D)),Jn(e,s,f,!R);return}}S_(e,t,s,n,l,i,f,_,b)}function Zg(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var i=n[l],s=i.getSnapshot;i=i.value;try{if(!Nt(s(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function Jn(e,t,n,l){t&=~ar,t&=~Tl,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var i=t;0<i;){var s=31-Mt(i),f=1<<s;l[s]=-1,i&=~f}n!==0&&wc(e,n,t)}function Oo(){return(De&6)===0?(fi(0),!1):!0}function rr(){if(Te!==null){if(ke===0)var e=Te.return;else e=Te,mn=gl=null,Tu(e),Pl=null,Ka=0,e=Te;for(;e!==null;)Vd(e.alternate,e),e=e.return;Te=null}}function ua(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,dh(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Tn=0,rr(),Ge=e,Te=n=dn(e.current,null),Ae=t,ke=0,Yt=null,Qn=!1,ia=za(e,t),lr=!1,oa=Ut=ar=Tl=Vn=Ie=0,Ct=ri=null,ir=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var i=31-Mt(l),s=1<<i;t|=e[i],l&=~s}return En=t,Ji(),n}function p_(e,t){xe=null,z.H=ti,t===Il||t===no?(t=Mf(),ke=3):t===_u?(t=Mf(),ke=4):ke=t===qu?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Yt=t,Te===null&&(Ie=1,ho(e,Xt(t,e.current)))}function g_(){var e=Dt.current;return e===null?!0:(Ae&4194048)===Ae?Zt===null:(Ae&62914560)===Ae||(Ae&536870912)!==0?e===Zt:!1}function h_(){var e=z.H;return z.H=ti,e===null?ti:e}function y_(){var e=z.A;return z.A=Qg,e}function Ro(){Ie=4,Qn||(Ae&4194048)!==Ae&&Dt.current!==null||(ia=!0),(Vn&134217727)===0&&(Tl&134217727)===0||Ge===null||Jn(Ge,Ae,Ut,!1)}function cr(e,t,n){var l=De;De|=2;var i=h_(),s=y_();(Ge!==e||Ae!==t)&&(Ao=null,ua(e,t)),t=!1;var f=Ie;e:do try{if(ke!==0&&Te!==null){var _=Te,b=Yt;switch(ke){case 8:rr(),f=6;break e;case 3:case 2:case 9:case 6:Dt.current===null&&(t=!0);var R=ke;if(ke=0,Yt=null,ra(e,_,b,R),n&&ia){f=0;break e}break;default:R=ke,ke=0,Yt=null,ra(e,_,b,R)}}Kg(),f=Ie;break}catch(Y){p_(e,Y)}while(!0);return t&&e.shellSuspendCounter++,mn=gl=null,De=l,z.H=i,z.A=s,Te===null&&(Ge=null,Ae=0,Ji()),f}function Kg(){for(;Te!==null;)b_(Te)}function Jg(e,t){var n=De;De|=2;var l=h_(),i=y_();Ge!==e||Ae!==t?(Ao=null,Co=Be()+500,ua(e,t)):ia=za(e,t);e:do try{if(ke!==0&&Te!==null){t=Te;var s=Yt;t:switch(ke){case 1:ke=0,Yt=null,ra(e,t,s,1);break;case 2:case 9:if(Rf(s)){ke=0,Yt=null,v_(t);break}t=function(){ke!==2&&ke!==9||Ge!==e||(ke=7),an(e)},s.then(t,t);break e;case 3:ke=7;break e;case 4:ke=5;break e;case 7:Rf(s)?(ke=0,Yt=null,v_(t)):(ke=0,Yt=null,ra(e,t,s,7));break;case 5:var f=null;switch(Te.tag){case 26:f=Te.memoizedState;case 5:case 27:var _=Te;if(f?im(f):_.stateNode.complete){ke=0,Yt=null;var b=_.sibling;if(b!==null)Te=b;else{var R=_.return;R!==null?(Te=R,zo(R)):Te=null}break t}}ke=0,Yt=null,ra(e,t,s,5);break;case 6:ke=0,Yt=null,ra(e,t,s,6);break;case 8:rr(),Ie=6;break e;default:throw Error(r(462))}}Wg();break}catch(Y){p_(e,Y)}while(!0);return mn=gl=null,z.H=l,z.A=i,De=n,Te!==null?0:(Ge=null,Ae=0,Ji(),Ie)}function Wg(){for(;Te!==null&&!pe();)b_(Te)}function b_(e){var t=Gd(e.alternate,e,En);e.memoizedProps=e.pendingProps,t===null?zo(e):Te=t}function v_(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Ud(n,t,t.pendingProps,t.type,void 0,Ae);break;case 11:t=Ud(n,t,t.pendingProps,t.type.render,t.ref,Ae);break;case 5:Tu(t);default:Vd(n,t),t=Te=yf(t,En),t=Gd(n,t,En)}e.memoizedProps=e.pendingProps,t===null?zo(e):Te=t}function ra(e,t,n,l){mn=gl=null,Tu(t),Pl=null,Ka=0;var i=t.return;try{if(Ug(e,i,t,n,Ae)){Ie=1,ho(e,Xt(n,e.current)),Te=null;return}}catch(s){if(i!==null)throw Te=i,s;Ie=1,ho(e,Xt(n,e.current)),Te=null;return}t.flags&32768?(Re||l===1?e=!0:ia||(Ae&536870912)!==0?e=!1:(Qn=e=!0,(l===2||l===9||l===3||l===6)&&(l=Dt.current,l!==null&&l.tag===13&&(l.flags|=16384))),x_(t,e)):zo(t)}function zo(e){var t=e;do{if((t.flags&32768)!==0){x_(t,Qn);return}e=t.return;var n=Hg(t.alternate,t,En);if(n!==null){Te=n;return}if(t=t.sibling,t!==null){Te=t;return}Te=t=e}while(t!==null);Ie===0&&(Ie=5)}function x_(e,t){do{var n=qg(e.alternate,e);if(n!==null){n.flags&=32767,Te=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){Te=e;return}Te=e=n}while(e!==null);Ie=6,Te=null}function S_(e,t,n,l,i,s,f,_,b){e.cancelPendingCommit=null;do Mo();while(ot!==0);if((De&6)!==0)throw Error(r(327));if(t!==null){if(t===e.current)throw Error(r(177));if(s=t.lanes|t.childLanes,s|=Ps,Op(e,n,s,f,_,b),e===Ge&&(Te=Ge=null,Ae=0),sa=t,Kn=e,Tn=n,or=s,sr=i,f_=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,$g(Rn,function(){return A_(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=z.T,z.T=null,i=Q.p,Q.p=2,f=De,De|=4;try{Xg(e,t,n)}finally{De=f,Q.p=i,z.T=l}}ot=1,w_(),E_(),T_()}}function w_(){if(ot===1){ot=0;var e=Kn,t=sa,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=z.T,z.T=null;var l=Q.p;Q.p=2;var i=De;De|=4;try{l_(t,e);var s=Sr,f=rf(e.containerInfo),_=s.focusedElem,b=s.selectionRange;if(f!==_&&_&&_.ownerDocument&&uf(_.ownerDocument.documentElement,_)){if(b!==null&&Ks(_)){var R=b.start,Y=b.end;if(Y===void 0&&(Y=R),"selectionStart"in _)_.selectionStart=R,_.selectionEnd=Math.min(Y,_.value.length);else{var X=_.ownerDocument||document,M=X&&X.defaultView||window;if(M.getSelection){var D=M.getSelection(),se=_.textContent.length,_e=Math.min(b.start,se),Xe=b.end===void 0?_e:Math.min(b.end,se);!D.extend&&_e>Xe&&(f=Xe,Xe=_e,_e=f);var T=sf(_,_e),x=sf(_,Xe);if(T&&x&&(D.rangeCount!==1||D.anchorNode!==T.node||D.anchorOffset!==T.offset||D.focusNode!==x.node||D.focusOffset!==x.offset)){var O=X.createRange();O.setStart(T.node,T.offset),D.removeAllRanges(),_e>Xe?(D.addRange(O),D.extend(x.node,x.offset)):(O.setEnd(x.node,x.offset),D.addRange(O))}}}}for(X=[],D=_;D=D.parentNode;)D.nodeType===1&&X.push({element:D,left:D.scrollLeft,top:D.scrollTop});for(typeof _.focus=="function"&&_.focus(),_=0;_<X.length;_++){var B=X[_];B.element.scrollLeft=B.left,B.element.scrollTop=B.top}}Go=!!xr,Sr=xr=null}finally{De=i,Q.p=l,z.T=n}}e.current=t,ot=2}}function E_(){if(ot===2){ot=0;var e=Kn,t=sa,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=z.T,z.T=null;var l=Q.p;Q.p=2;var i=De;De|=4;try{Pd(e,t.alternate,t)}finally{De=i,Q.p=l,z.T=n}}ot=3}}function T_(){if(ot===4||ot===3){ot=0,ht();var e=Kn,t=sa,n=Tn,l=f_;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ot=5:(ot=0,sa=Kn=null,C_(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(Zn=null),Os(n),t=t.stateNode,zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(Ra,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=z.T,i=Q.p,Q.p=2,z.T=null;try{for(var s=e.onRecoverableError,f=0;f<l.length;f++){var _=l[f];s(_.value,{componentStack:_.stack})}}finally{z.T=t,Q.p=i}}(Tn&3)!==0&&Mo(),an(e),i=e.pendingLanes,(n&261930)!==0&&(i&42)!==0?e===ur?ci++:(ci=0,ur=e):ci=0,fi(0)}}function C_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Va(t)))}function Mo(){return w_(),E_(),T_(),A_()}function A_(){if(ot!==5)return!1;var e=Kn,t=or;or=0;var n=Os(Tn),l=z.T,i=Q.p;try{Q.p=32>n?32:n,z.T=null,n=sr,sr=null;var s=Kn,f=Tn;if(ot=0,sa=Kn=null,Tn=0,(De&6)!==0)throw Error(r(331));var _=De;if(De|=4,u_(s.current),i_(s,s.current,f,n),De=_,fi(0,!1),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(Ra,s)}catch{}return!0}finally{Q.p=i,z.T=l,C_(e,t)}}function O_(e,t,n){t=Xt(n,t),t=Hu(e.stateNode,t,2),e=Hn(e,t,2),e!==null&&(Ma(e,2),an(e))}function Ye(e,t,n){if(e.tag===3)O_(e,e,n);else for(;t!==null;){if(t.tag===3){O_(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Zn===null||!Zn.has(l))){e=Xt(n,e),n=Rd(2),l=Hn(t,n,2),l!==null&&(zd(n,l,t,e),Ma(l,2),an(l));break}}t=t.return}}function fr(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new Vg;var i=new Set;l.set(t,i)}else i=l.get(t),i===void 0&&(i=new Set,l.set(t,i));i.has(n)||(lr=!0,i.add(n),e=Fg.bind(null,e,t,n),t.then(e,e))}function Fg(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Ge===e&&(Ae&n)===n&&(Ie===4||Ie===3&&(Ae&62914560)===Ae&&300>Be()-To?(De&2)===0&&ua(e,0):ar|=n,oa===Ae&&(oa=0)),an(e)}function R_(e,t){t===0&&(t=Sc()),e=_l(e,t),e!==null&&(Ma(e,t),an(e))}function Ig(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),R_(e,n)}function Pg(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,i=e.memoizedState;i!==null&&(n=i.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(r(314))}l!==null&&l.delete(t),R_(e,n)}function $g(e,t){return Ve(e,t)}var No=null,ca=null,dr=!1,jo=!1,_r=!1,Wn=0;function an(e){e!==ca&&e.next===null&&(ca===null?No=ca=e:ca=ca.next=e),jo=!0,dr||(dr=!0,th())}function fi(e,t){if(!_r&&jo){_r=!0;do for(var n=!1,l=No;l!==null;){if(e!==0){var i=l.pendingLanes;if(i===0)var s=0;else{var f=l.suspendedLanes,_=l.pingedLanes;s=(1<<31-Mt(42|e)+1)-1,s&=i&~(f&~_),s=s&201326741?s&201326741|1:s?s|2:0}s!==0&&(n=!0,j_(l,s))}else s=Ae,s=Yi(l,l===Ge?s:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(s&3)===0||za(l,s)||(n=!0,j_(l,s));l=l.next}while(n);_r=!1}}function eh(){z_()}function z_(){jo=dr=!1;var e=0;Wn!==0&&fh()&&(e=Wn);for(var t=Be(),n=null,l=No;l!==null;){var i=l.next,s=M_(l,t);s===0?(l.next=null,n===null?No=i:n.next=i,i===null&&(ca=n)):(n=l,(e!==0||(s&3)!==0)&&(jo=!0)),l=i}ot!==0&&ot!==5||fi(e),Wn!==0&&(Wn=0)}function M_(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,i=e.expirationTimes,s=e.pendingLanes&-62914561;0<s;){var f=31-Mt(s),_=1<<f,b=i[f];b===-1?((_&n)===0||(_&l)!==0)&&(i[f]=Ap(_,t)):b<=t&&(e.expiredLanes|=_),s&=~_}if(t=Ge,n=Ae,n=Yi(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(ke===2||ke===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&he(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||za(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&he(l),Os(n)){case 2:case 8:n=Rl;break;case 32:n=Rn;break;case 268435456:n=zn;break;default:n=Rn}return l=N_.bind(null,e),n=Ve(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&he(l),e.callbackPriority=2,e.callbackNode=null,2}function N_(e,t){if(ot!==0&&ot!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Mo()&&e.callbackNode!==n)return null;var l=Ae;return l=Yi(e,e===Ge?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(__(e,l,t),M_(e,Be()),e.callbackNode!=null&&e.callbackNode===n?N_.bind(null,e):null)}function j_(e,t){if(Mo())return null;__(e,t,!0)}function th(){_h(function(){(De&6)!==0?Ve(sl,eh):z_()})}function mr(){if(Wn===0){var e=Wl;e===0&&(e=ji,ji<<=1,(ji&261888)===0&&(ji=256)),Wn=e}return Wn}function D_(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Hi(""+e)}function k_(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function nh(e,t,n,l,i){if(t==="submit"&&n&&n.stateNode===i){var s=D_((i[xt]||null).action),f=l.submitter;f&&(t=(t=f[xt]||null)?D_(t.formAction):f.getAttribute("formAction"),t!==null&&(s=t,f=null));var _=new Qi("action","action",null,l,i);e.push({event:_,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Wn!==0){var b=f?k_(i,f):new FormData(i);Du(n,{pending:!0,data:b,method:i.method,action:s},null,b)}}else typeof s=="function"&&(_.preventDefault(),b=f?k_(i,f):new FormData(i),Du(n,{pending:!0,data:b,method:i.method,action:s},s,b))},currentTarget:i}]})}}for(var pr=0;pr<Is.length;pr++){var gr=Is[pr],lh=gr.toLowerCase(),ah=gr[0].toUpperCase()+gr.slice(1);Ft(lh,"on"+ah)}Ft(df,"onAnimationEnd"),Ft(_f,"onAnimationIteration"),Ft(mf,"onAnimationStart"),Ft("dblclick","onDoubleClick"),Ft("focusin","onFocus"),Ft("focusout","onBlur"),Ft(vg,"onTransitionRun"),Ft(xg,"onTransitionStart"),Ft(Sg,"onTransitionCancel"),Ft(pf,"onTransitionEnd"),kl("onMouseEnter",["mouseout","mouseover"]),kl("onMouseLeave",["mouseout","mouseover"]),kl("onPointerEnter",["pointerout","pointerover"]),kl("onPointerLeave",["pointerout","pointerover"]),rl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),rl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),rl("onBeforeInput",["compositionend","keypress","textInput","paste"]),rl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),rl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),rl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var di="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),ih=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(di));function Y_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],i=l.event;l=l.listeners;e:{var s=void 0;if(t)for(var f=l.length-1;0<=f;f--){var _=l[f],b=_.instance,R=_.currentTarget;if(_=_.listener,b!==s&&i.isPropagationStopped())break e;s=_,i.currentTarget=R;try{s(i)}catch(Y){Ki(Y)}i.currentTarget=null,s=b}else for(f=0;f<l.length;f++){if(_=l[f],b=_.instance,R=_.currentTarget,_=_.listener,b!==s&&i.isPropagationStopped())break e;s=_,i.currentTarget=R;try{s(i)}catch(Y){Ki(Y)}i.currentTarget=null,s=b}}}}function Ce(e,t){var n=t[Rs];n===void 0&&(n=t[Rs]=new Set);var l=e+"__bubble";n.has(l)||(U_(t,e,2,!1),n.add(l))}function hr(e,t,n){var l=0;t&&(l|=4),U_(n,e,l,t)}var Do="_reactListening"+Math.random().toString(36).slice(2);function yr(e){if(!e[Do]){e[Do]=!0,Rc.forEach(function(n){n!=="selectionchange"&&(ih.has(n)||hr(n,!1,e),hr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Do]||(t[Do]=!0,hr("selectionchange",!1,t))}}function U_(e,t,n,l){switch(dm(t)){case 2:var i=jh;break;case 8:i=Dh;break;default:i=jr}n=i.bind(null,t,n,e),i=void 0,!Ls||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(i=!0),l?i!==void 0?e.addEventListener(t,n,{capture:!0,passive:i}):e.addEventListener(t,n,!0):i!==void 0?e.addEventListener(t,n,{passive:i}):e.addEventListener(t,n,!1)}function br(e,t,n,l,i){var s=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var f=l.tag;if(f===3||f===4){var _=l.stateNode.containerInfo;if(_===i)break;if(f===4)for(f=l.return;f!==null;){var b=f.tag;if((b===3||b===4)&&f.stateNode.containerInfo===i)return;f=f.return}for(;_!==null;){if(f=Nl(_),f===null)return;if(b=f.tag,b===5||b===6||b===26||b===27){l=s=f;continue e}_=_.parentNode}}l=l.return}qc(function(){var R=s,Y=Ys(n),X=[];e:{var M=gf.get(e);if(M!==void 0){var D=Qi,se=e;switch(e){case"keypress":if(Xi(n)===0)break e;case"keydown":case"keyup":D=Pp;break;case"focusin":se="focus",D=Xs;break;case"focusout":se="blur",D=Xs;break;case"beforeblur":case"afterblur":D=Xs;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":D=Qc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":D=Hp;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":D=tg;break;case df:case _f:case mf:D=Gp;break;case pf:D=lg;break;case"scroll":case"scrollend":D=Lp;break;case"wheel":D=ig;break;case"copy":case"cut":case"paste":D=Vp;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":D=Zc;break;case"toggle":case"beforetoggle":D=sg}var _e=(t&4)!==0,Xe=!_e&&(e==="scroll"||e==="scrollend"),T=_e?M!==null?M+"Capture":null:M;_e=[];for(var x=R,O;x!==null;){var B=x;if(O=B.stateNode,B=B.tag,B!==5&&B!==26&&B!==27||O===null||T===null||(B=Da(x,T),B!=null&&_e.push(_i(x,B,O))),Xe)break;x=x.return}0<_e.length&&(M=new D(M,se,null,n,Y),X.push({event:M,listeners:_e}))}}if((t&7)===0){e:{if(M=e==="mouseover"||e==="pointerover",D=e==="mouseout"||e==="pointerout",M&&n!==ks&&(se=n.relatedTarget||n.fromElement)&&(Nl(se)||se[Ml]))break e;if((D||M)&&(M=Y.window===Y?Y:(M=Y.ownerDocument)?M.defaultView||M.parentWindow:window,D?(se=n.relatedTarget||n.toElement,D=R,se=se?Nl(se):null,se!==null&&(Xe=d(se),_e=se.tag,se!==Xe||_e!==5&&_e!==27&&_e!==6)&&(se=null)):(D=null,se=R),D!==se)){if(_e=Qc,B="onMouseLeave",T="onMouseEnter",x="mouse",(e==="pointerout"||e==="pointerover")&&(_e=Zc,B="onPointerLeave",T="onPointerEnter",x="pointer"),Xe=D==null?M:ja(D),O=se==null?M:ja(se),M=new _e(B,x+"leave",D,n,Y),M.target=Xe,M.relatedTarget=O,B=null,Nl(Y)===R&&(_e=new _e(T,x+"enter",se,n,Y),_e.target=O,_e.relatedTarget=Xe,B=_e),Xe=B,D&&se)t:{for(_e=oh,T=D,x=se,O=0,B=T;B;B=_e(B))O++;B=0;for(var fe=x;fe;fe=_e(fe))B++;for(;0<O-B;)T=_e(T),O--;for(;0<B-O;)x=_e(x),B--;for(;O--;){if(T===x||x!==null&&T===x.alternate){_e=T;break t}T=_e(T),x=_e(x)}_e=null}else _e=null;D!==null&&L_(X,M,D,_e,!1),se!==null&&Xe!==null&&L_(X,Xe,se,_e,!0)}}e:{if(M=R?ja(R):window,D=M.nodeName&&M.nodeName.toLowerCase(),D==="select"||D==="input"&&M.type==="file")var Me=ef;else if(Pc(M))if(tf)Me=hg;else{Me=pg;var re=mg}else D=M.nodeName,!D||D.toLowerCase()!=="input"||M.type!=="checkbox"&&M.type!=="radio"?R&&Ds(R.elementType)&&(Me=ef):Me=gg;if(Me&&(Me=Me(e,R))){$c(X,Me,n,Y);break e}re&&re(e,M,R),e==="focusout"&&R&&M.type==="number"&&R.memoizedProps.value!=null&&js(M,"number",M.value)}switch(re=R?ja(R):window,e){case"focusin":(Pc(re)||re.contentEditable==="true")&&(ql=re,Js=R,Xa=null);break;case"focusout":Xa=Js=ql=null;break;case"mousedown":Ws=!0;break;case"contextmenu":case"mouseup":case"dragend":Ws=!1,cf(X,n,Y);break;case"selectionchange":if(bg)break;case"keydown":case"keyup":cf(X,n,Y)}var Se;if(Qs)e:{switch(e){case"compositionstart":var Oe="onCompositionStart";break e;case"compositionend":Oe="onCompositionEnd";break e;case"compositionupdate":Oe="onCompositionUpdate";break e}Oe=void 0}else Hl?Fc(e,n)&&(Oe="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Oe="onCompositionStart");Oe&&(Kc&&n.locale!=="ko"&&(Hl||Oe!=="onCompositionStart"?Oe==="onCompositionEnd"&&Hl&&(Se=Xc()):(jn=Y,Bs="value"in jn?jn.value:jn.textContent,Hl=!0)),re=ko(R,Oe),0<re.length&&(Oe=new Vc(Oe,e,null,n,Y),X.push({event:Oe,listeners:re}),Se?Oe.data=Se:(Se=Ic(n),Se!==null&&(Oe.data=Se)))),(Se=rg?cg(e,n):fg(e,n))&&(Oe=ko(R,"onBeforeInput"),0<Oe.length&&(re=new Vc("onBeforeInput","beforeinput",null,n,Y),X.push({event:re,listeners:Oe}),re.data=Se)),nh(X,e,R,n,Y)}Y_(X,t)})}function _i(e,t,n){return{instance:e,listener:t,currentTarget:n}}function ko(e,t){for(var n=t+"Capture",l=[];e!==null;){var i=e,s=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||s===null||(i=Da(e,n),i!=null&&l.unshift(_i(e,i,s)),i=Da(e,t),i!=null&&l.push(_i(e,i,s))),e.tag===3)return l;e=e.return}return[]}function oh(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function L_(e,t,n,l,i){for(var s=t._reactName,f=[];n!==null&&n!==l;){var _=n,b=_.alternate,R=_.stateNode;if(_=_.tag,b!==null&&b===l)break;_!==5&&_!==26&&_!==27||R===null||(b=R,i?(R=Da(n,s),R!=null&&f.unshift(_i(n,R,b))):i||(R=Da(n,s),R!=null&&f.push(_i(n,R,b)))),n=n.return}f.length!==0&&e.push({event:t,listeners:f})}var sh=/\r\n?/g,uh=/\u0000|\uFFFD/g;function B_(e){return(typeof e=="string"?e:""+e).replace(sh,`
`).replace(uh,"")}function H_(e,t){return t=B_(t),B_(e)===t}function qe(e,t,n,l,i,s){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||Ul(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&Ul(e,""+l);break;case"className":Li(e,"class",l);break;case"tabIndex":Li(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Li(e,n,l);break;case"style":Bc(e,l,s);break;case"data":if(t!=="object"){Li(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Hi(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof s=="function"&&(n==="formAction"?(t!=="input"&&qe(e,t,"name",i.name,i,null),qe(e,t,"formEncType",i.formEncType,i,null),qe(e,t,"formMethod",i.formMethod,i,null),qe(e,t,"formTarget",i.formTarget,i,null)):(qe(e,t,"encType",i.encType,i,null),qe(e,t,"method",i.method,i,null),qe(e,t,"target",i.target,i,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Hi(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=cn);break;case"onScroll":l!=null&&Ce("scroll",e);break;case"onScrollEnd":l!=null&&Ce("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(i.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=Hi(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":Ce("beforetoggle",e),Ce("toggle",e),Ui(e,"popover",l);break;case"xlinkActuate":rn(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":rn(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":rn(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":rn(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":rn(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":rn(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":rn(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":rn(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":rn(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Ui(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=Yp.get(n)||n,Ui(e,n,l))}}function vr(e,t,n,l,i,s){switch(n){case"style":Bc(e,l,s);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(i.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"children":typeof l=="string"?Ul(e,l):(typeof l=="number"||typeof l=="bigint")&&Ul(e,""+l);break;case"onScroll":l!=null&&Ce("scroll",e);break;case"onScrollEnd":l!=null&&Ce("scrollend",e);break;case"onClick":l!=null&&(e.onclick=cn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!zc.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(i=n.endsWith("Capture"),t=n.slice(2,i?n.length-7:void 0),s=e[xt]||null,s=s!=null?s[n]:null,typeof s=="function"&&e.removeEventListener(t,s,i),typeof l=="function")){typeof s!="function"&&s!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,i);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Ui(e,n,l)}}}function _t(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Ce("error",e),Ce("load",e);var l=!1,i=!1,s;for(s in n)if(n.hasOwnProperty(s)){var f=n[s];if(f!=null)switch(s){case"src":l=!0;break;case"srcSet":i=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:qe(e,t,s,f,n,null)}}i&&qe(e,t,"srcSet",n.srcSet,n,null),l&&qe(e,t,"src",n.src,n,null);return;case"input":Ce("invalid",e);var _=s=f=i=null,b=null,R=null;for(l in n)if(n.hasOwnProperty(l)){var Y=n[l];if(Y!=null)switch(l){case"name":i=Y;break;case"type":f=Y;break;case"checked":b=Y;break;case"defaultChecked":R=Y;break;case"value":s=Y;break;case"defaultValue":_=Y;break;case"children":case"dangerouslySetInnerHTML":if(Y!=null)throw Error(r(137,t));break;default:qe(e,t,l,Y,n,null)}}kc(e,s,_,b,R,f,i,!1);return;case"select":Ce("invalid",e),l=f=s=null;for(i in n)if(n.hasOwnProperty(i)&&(_=n[i],_!=null))switch(i){case"value":s=_;break;case"defaultValue":f=_;break;case"multiple":l=_;default:qe(e,t,i,_,n,null)}t=s,n=f,e.multiple=!!l,t!=null?Yl(e,!!l,t,!1):n!=null&&Yl(e,!!l,n,!0);return;case"textarea":Ce("invalid",e),s=i=l=null;for(f in n)if(n.hasOwnProperty(f)&&(_=n[f],_!=null))switch(f){case"value":l=_;break;case"defaultValue":i=_;break;case"children":s=_;break;case"dangerouslySetInnerHTML":if(_!=null)throw Error(r(91));break;default:qe(e,t,f,_,n,null)}Uc(e,l,i,s);return;case"option":for(b in n)n.hasOwnProperty(b)&&(l=n[b],l!=null)&&(b==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":qe(e,t,b,l,n,null));return;case"dialog":Ce("beforetoggle",e),Ce("toggle",e),Ce("cancel",e),Ce("close",e);break;case"iframe":case"object":Ce("load",e);break;case"video":case"audio":for(l=0;l<di.length;l++)Ce(di[l],e);break;case"image":Ce("error",e),Ce("load",e);break;case"details":Ce("toggle",e);break;case"embed":case"source":case"link":Ce("error",e),Ce("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(R in n)if(n.hasOwnProperty(R)&&(l=n[R],l!=null))switch(R){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:qe(e,t,R,l,n,null)}return;default:if(Ds(t)){for(Y in n)n.hasOwnProperty(Y)&&(l=n[Y],l!==void 0&&vr(e,t,Y,l,n,void 0));return}}for(_ in n)n.hasOwnProperty(_)&&(l=n[_],l!=null&&qe(e,t,_,l,n,null))}function rh(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var i=null,s=null,f=null,_=null,b=null,R=null,Y=null;for(D in n){var X=n[D];if(n.hasOwnProperty(D)&&X!=null)switch(D){case"checked":break;case"value":break;case"defaultValue":b=X;default:l.hasOwnProperty(D)||qe(e,t,D,null,l,X)}}for(var M in l){var D=l[M];if(X=n[M],l.hasOwnProperty(M)&&(D!=null||X!=null))switch(M){case"type":s=D;break;case"name":i=D;break;case"checked":R=D;break;case"defaultChecked":Y=D;break;case"value":f=D;break;case"defaultValue":_=D;break;case"children":case"dangerouslySetInnerHTML":if(D!=null)throw Error(r(137,t));break;default:D!==X&&qe(e,t,M,D,l,X)}}Ns(e,f,_,b,R,Y,s,i);return;case"select":D=f=_=M=null;for(s in n)if(b=n[s],n.hasOwnProperty(s)&&b!=null)switch(s){case"value":break;case"multiple":D=b;default:l.hasOwnProperty(s)||qe(e,t,s,null,l,b)}for(i in l)if(s=l[i],b=n[i],l.hasOwnProperty(i)&&(s!=null||b!=null))switch(i){case"value":M=s;break;case"defaultValue":_=s;break;case"multiple":f=s;default:s!==b&&qe(e,t,i,s,l,b)}t=_,n=f,l=D,M!=null?Yl(e,!!n,M,!1):!!l!=!!n&&(t!=null?Yl(e,!!n,t,!0):Yl(e,!!n,n?[]:"",!1));return;case"textarea":D=M=null;for(_ in n)if(i=n[_],n.hasOwnProperty(_)&&i!=null&&!l.hasOwnProperty(_))switch(_){case"value":break;case"children":break;default:qe(e,t,_,null,l,i)}for(f in l)if(i=l[f],s=n[f],l.hasOwnProperty(f)&&(i!=null||s!=null))switch(f){case"value":M=i;break;case"defaultValue":D=i;break;case"children":break;case"dangerouslySetInnerHTML":if(i!=null)throw Error(r(91));break;default:i!==s&&qe(e,t,f,i,l,s)}Yc(e,M,D);return;case"option":for(var se in n)M=n[se],n.hasOwnProperty(se)&&M!=null&&!l.hasOwnProperty(se)&&(se==="selected"?e.selected=!1:qe(e,t,se,null,l,M));for(b in l)M=l[b],D=n[b],l.hasOwnProperty(b)&&M!==D&&(M!=null||D!=null)&&(b==="selected"?e.selected=M&&typeof M!="function"&&typeof M!="symbol":qe(e,t,b,M,l,D));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var _e in n)M=n[_e],n.hasOwnProperty(_e)&&M!=null&&!l.hasOwnProperty(_e)&&qe(e,t,_e,null,l,M);for(R in l)if(M=l[R],D=n[R],l.hasOwnProperty(R)&&M!==D&&(M!=null||D!=null))switch(R){case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(r(137,t));break;default:qe(e,t,R,M,l,D)}return;default:if(Ds(t)){for(var Xe in n)M=n[Xe],n.hasOwnProperty(Xe)&&M!==void 0&&!l.hasOwnProperty(Xe)&&vr(e,t,Xe,void 0,l,M);for(Y in l)M=l[Y],D=n[Y],!l.hasOwnProperty(Y)||M===D||M===void 0&&D===void 0||vr(e,t,Y,M,l,D);return}}for(var T in n)M=n[T],n.hasOwnProperty(T)&&M!=null&&!l.hasOwnProperty(T)&&qe(e,t,T,null,l,M);for(X in l)M=l[X],D=n[X],!l.hasOwnProperty(X)||M===D||M==null&&D==null||qe(e,t,X,M,l,D)}function q_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function ch(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var i=n[l],s=i.transferSize,f=i.initiatorType,_=i.duration;if(s&&_&&q_(f)){for(f=0,_=i.responseEnd,l+=1;l<n.length;l++){var b=n[l],R=b.startTime;if(R>_)break;var Y=b.transferSize,X=b.initiatorType;Y&&q_(X)&&(b=b.responseEnd,f+=Y*(b<_?1:(_-R)/(b-R)))}if(--l,t+=8*(s+f)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var xr=null,Sr=null;function Yo(e){return e.nodeType===9?e:e.ownerDocument}function X_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function G_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function wr(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Er=null;function fh(){var e=window.event;return e&&e.type==="popstate"?e===Er?!1:(Er=e,!0):(Er=null,!1)}var Q_=typeof setTimeout=="function"?setTimeout:void 0,dh=typeof clearTimeout=="function"?clearTimeout:void 0,V_=typeof Promise=="function"?Promise:void 0,_h=typeof queueMicrotask=="function"?queueMicrotask:typeof V_<"u"?function(e){return V_.resolve(null).then(e).catch(mh)}:Q_;function mh(e){setTimeout(function(){throw e})}function Fn(e){return e==="head"}function Z_(e,t){var n=t,l=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(i),ma(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")mi(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,mi(n);for(var s=n.firstChild;s;){var f=s.nextSibling,_=s.nodeName;s[Na]||_==="SCRIPT"||_==="STYLE"||_==="LINK"&&s.rel.toLowerCase()==="stylesheet"||n.removeChild(s),s=f}}else n==="body"&&mi(e.ownerDocument.body);n=i}while(n);ma(t)}function K_(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function Tr(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":Tr(n),zs(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function ph(e,t,n,l){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Na])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(s=e.getAttribute("rel"),s==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(s!==i.rel||e.getAttribute("href")!==(i.href==null||i.href===""?null:i.href)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute("title")!==(i.title==null?null:i.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(s=e.getAttribute("src"),(s!==(i.src==null?null:i.src)||e.getAttribute("type")!==(i.type==null?null:i.type)||e.getAttribute("crossorigin")!==(i.crossOrigin==null?null:i.crossOrigin))&&s&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var s=i.name==null?null:""+i.name;if(i.type==="hidden"&&e.getAttribute("name")===s)return e}else return e;if(e=Kt(e.nextSibling),e===null)break}return null}function gh(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Kt(e.nextSibling),e===null))return null;return e}function J_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Kt(e.nextSibling),e===null))return null;return e}function Cr(e){return e.data==="$?"||e.data==="$~"}function Ar(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function hh(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Kt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var Or=null;function W_(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Kt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function F_(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function I_(e,t,n){switch(t=Yo(n),e){case"html":if(e=t.documentElement,!e)throw Error(r(452));return e;case"head":if(e=t.head,!e)throw Error(r(453));return e;case"body":if(e=t.body,!e)throw Error(r(454));return e;default:throw Error(r(451))}}function mi(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);zs(e)}var Jt=new Map,P_=new Set;function Uo(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Cn=Q.d;Q.d={f:yh,r:bh,D:vh,C:xh,L:Sh,m:wh,X:Th,S:Eh,M:Ch};function yh(){var e=Cn.f(),t=Oo();return e||t}function bh(e){var t=jl(e);t!==null&&t.tag===5&&t.type==="form"?pd(t):Cn.r(e)}var fa=typeof document>"u"?null:document;function $_(e,t,n){var l=fa;if(l&&typeof t=="string"&&t){var i=Ht(t);i='link[rel="'+e+'"][href="'+i+'"]',typeof n=="string"&&(i+='[crossorigin="'+n+'"]'),P_.has(i)||(P_.add(i),e={rel:e,crossOrigin:n,href:t},l.querySelector(i)===null&&(t=l.createElement("link"),_t(t,"link",e),st(t),l.head.appendChild(t)))}}function vh(e){Cn.D(e),$_("dns-prefetch",e,null)}function xh(e,t){Cn.C(e,t),$_("preconnect",e,t)}function Sh(e,t,n){Cn.L(e,t,n);var l=fa;if(l&&e&&t){var i='link[rel="preload"][as="'+Ht(t)+'"]';t==="image"&&n&&n.imageSrcSet?(i+='[imagesrcset="'+Ht(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(i+='[imagesizes="'+Ht(n.imageSizes)+'"]')):i+='[href="'+Ht(e)+'"]';var s=i;switch(t){case"style":s=da(e);break;case"script":s=_a(e)}Jt.has(s)||(e=S({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Jt.set(s,e),l.querySelector(i)!==null||t==="style"&&l.querySelector(pi(s))||t==="script"&&l.querySelector(gi(s))||(t=l.createElement("link"),_t(t,"link",e),st(t),l.head.appendChild(t)))}}function wh(e,t){Cn.m(e,t);var n=fa;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",i='link[rel="modulepreload"][as="'+Ht(l)+'"][href="'+Ht(e)+'"]',s=i;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":s=_a(e)}if(!Jt.has(s)&&(e=S({rel:"modulepreload",href:e},t),Jt.set(s,e),n.querySelector(i)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(gi(s)))return}l=n.createElement("link"),_t(l,"link",e),st(l),n.head.appendChild(l)}}}function Eh(e,t,n){Cn.S(e,t,n);var l=fa;if(l&&e){var i=Dl(l).hoistableStyles,s=da(e);t=t||"default";var f=i.get(s);if(!f){var _={loading:0,preload:null};if(f=l.querySelector(pi(s)))_.loading=5;else{e=S({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Jt.get(s))&&Rr(e,n);var b=f=l.createElement("link");st(b),_t(b,"link",e),b._p=new Promise(function(R,Y){b.onload=R,b.onerror=Y}),b.addEventListener("load",function(){_.loading|=1}),b.addEventListener("error",function(){_.loading|=2}),_.loading|=4,Lo(f,t,l)}f={type:"stylesheet",instance:f,count:1,state:_},i.set(s,f)}}}function Th(e,t){Cn.X(e,t);var n=fa;if(n&&e){var l=Dl(n).hoistableScripts,i=_a(e),s=l.get(i);s||(s=n.querySelector(gi(i)),s||(e=S({src:e,async:!0},t),(t=Jt.get(i))&&zr(e,t),s=n.createElement("script"),st(s),_t(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},l.set(i,s))}}function Ch(e,t){Cn.M(e,t);var n=fa;if(n&&e){var l=Dl(n).hoistableScripts,i=_a(e),s=l.get(i);s||(s=n.querySelector(gi(i)),s||(e=S({src:e,async:!0,type:"module"},t),(t=Jt.get(i))&&zr(e,t),s=n.createElement("script"),st(s),_t(s,"link",e),n.head.appendChild(s)),s={type:"script",instance:s,count:1,state:null},l.set(i,s))}}function em(e,t,n,l){var i=(i=be.current)?Uo(i):null;if(!i)throw Error(r(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=da(n.href),n=Dl(i).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=da(n.href);var s=Dl(i).hoistableStyles,f=s.get(e);if(f||(i=i.ownerDocument||i,f={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},s.set(e,f),(s=i.querySelector(pi(e)))&&!s._p&&(f.instance=s,f.state.loading=5),Jt.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Jt.set(e,n),s||Ah(i,e,n,f.state))),t&&l===null)throw Error(r(528,""));return f}if(t&&l!==null)throw Error(r(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=_a(n),n=Dl(i).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,e))}}function da(e){return'href="'+Ht(e)+'"'}function pi(e){return'link[rel="stylesheet"]['+e+"]"}function tm(e){return S({},e,{"data-precedence":e.precedence,precedence:null})}function Ah(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),_t(t,"link",n),st(t),e.head.appendChild(t))}function _a(e){return'[src="'+Ht(e)+'"]'}function gi(e){return"script[async]"+e}function nm(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Ht(n.href)+'"]');if(l)return t.instance=l,st(l),l;var i=S({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),st(l),_t(l,"style",i),Lo(l,n.precedence,e),t.instance=l;case"stylesheet":i=da(n.href);var s=e.querySelector(pi(i));if(s)return t.state.loading|=4,t.instance=s,st(s),s;l=tm(n),(i=Jt.get(i))&&Rr(l,i),s=(e.ownerDocument||e).createElement("link"),st(s);var f=s;return f._p=new Promise(function(_,b){f.onload=_,f.onerror=b}),_t(s,"link",l),t.state.loading|=4,Lo(s,n.precedence,e),t.instance=s;case"script":return s=_a(n.src),(i=e.querySelector(gi(s)))?(t.instance=i,st(i),i):(l=n,(i=Jt.get(s))&&(l=S({},n),zr(l,i)),e=e.ownerDocument||e,i=e.createElement("script"),st(i),_t(i,"link",l),e.head.appendChild(i),t.instance=i);case"void":return null;default:throw Error(r(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Lo(l,n.precedence,e));return t.instance}function Lo(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),i=l.length?l[l.length-1]:null,s=i,f=0;f<l.length;f++){var _=l[f];if(_.dataset.precedence===t)s=_;else if(s!==i)break}s?s.parentNode.insertBefore(e,s.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function zr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Bo=null;function lm(e,t,n){if(Bo===null){var l=new Map,i=Bo=new Map;i.set(n,l)}else i=Bo,l=i.get(n),l||(l=new Map,i.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var s=n[i];if(!(s[Na]||s[rt]||e==="link"&&s.getAttribute("rel")==="stylesheet")&&s.namespaceURI!=="http://www.w3.org/2000/svg"){var f=s.getAttribute(t)||"";f=e+f;var _=l.get(f);_?_.push(s):l.set(f,[s])}}return l}function am(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function Oh(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function im(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Rh(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var i=da(l.href),s=t.querySelector(pi(i));if(s){t=s._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ho.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=s,st(s);return}s=t.ownerDocument||t,l=tm(l),(i=Jt.get(i))&&Rr(l,i),s=s.createElement("link"),st(s);var f=s;f._p=new Promise(function(_,b){f.onload=_,f.onerror=b}),_t(s,"link",l),n.instance=s}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ho.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var Mr=0;function zh(e,t){return e.stylesheets&&e.count===0&&Xo(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Xo(e,e.stylesheets),e.unsuspend){var s=e.unsuspend;e.unsuspend=null,s()}},6e4+t);0<e.imgBytes&&Mr===0&&(Mr=62500*ch());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xo(e,e.stylesheets),e.unsuspend)){var s=e.unsuspend;e.unsuspend=null,s()}},(e.imgBytes>Mr?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(i)}}:null}function Ho(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xo(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var qo=null;function Xo(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,qo=new Map,t.forEach(Mh,e),qo=null,Ho.call(e))}function Mh(e,t){if(!(t.state.loading&4)){var n=qo.get(e);if(n)var l=n.get(null);else{n=new Map,qo.set(e,n);for(var i=e.querySelectorAll("link[data-precedence],style[data-precedence]"),s=0;s<i.length;s++){var f=i[s];(f.nodeName==="LINK"||f.getAttribute("media")!=="not all")&&(n.set(f.dataset.precedence,f),l=f)}l&&n.set(null,l)}i=t.instance,f=i.getAttribute("data-precedence"),s=n.get(f)||l,s===l&&n.set(null,i),n.set(f,i),this.count++,l=Ho.bind(this),i.addEventListener("load",l),i.addEventListener("error",l),s?s.parentNode.insertBefore(i,s.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var hi={$$typeof:Z,Provider:null,Consumer:null,_currentValue:F,_currentValue2:F,_threadCount:0};function Nh(e,t,n,l,i,s,f,_,b){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=Cs(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cs(0),this.hiddenUpdates=Cs(null),this.identifierPrefix=l,this.onUncaughtError=i,this.onCaughtError=s,this.onRecoverableError=f,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=b,this.incompleteTransitions=new Map}function om(e,t,n,l,i,s,f,_,b,R,Y,X){return e=new Nh(e,t,n,f,b,R,Y,X,_),t=1,s===!0&&(t|=24),s=jt(3,null,null,t),e.current=s,s.stateNode=e,t=cu(),t.refCount++,e.pooledCache=t,t.refCount++,s.memoizedState={element:l,isDehydrated:n,cache:t},mu(s),e}function sm(e){return e?(e=Ql,e):Ql}function um(e,t,n,l,i,s){i=sm(i),l.context===null?l.context=i:l.pendingContext=i,l=Bn(t),l.payload={element:n},s=s===void 0?null:s,s!==null&&(l.callback=s),n=Hn(e,l,t),n!==null&&(At(n,e,t),Wa(n,e,t))}function rm(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function Nr(e,t){rm(e,t),(e=e.alternate)&&rm(e,t)}function cm(e){if(e.tag===13||e.tag===31){var t=_l(e,67108864);t!==null&&At(t,e,67108864),Nr(e,67108864)}}function fm(e){if(e.tag===13||e.tag===31){var t=Lt();t=As(t);var n=_l(e,t);n!==null&&At(n,e,t),Nr(e,t)}}var Go=!0;function jh(e,t,n,l){var i=z.T;z.T=null;var s=Q.p;try{Q.p=2,jr(e,t,n,l)}finally{Q.p=s,z.T=i}}function Dh(e,t,n,l){var i=z.T;z.T=null;var s=Q.p;try{Q.p=8,jr(e,t,n,l)}finally{Q.p=s,z.T=i}}function jr(e,t,n,l){if(Go){var i=Dr(l);if(i===null)br(e,t,l,Qo,n),_m(e,l);else if(Yh(i,e,t,n,l))l.stopPropagation();else if(_m(e,l),t&4&&-1<kh.indexOf(e)){for(;i!==null;){var s=jl(i);if(s!==null)switch(s.tag){case 3:if(s=s.stateNode,s.current.memoizedState.isDehydrated){var f=ul(s.pendingLanes);if(f!==0){var _=s;for(_.pendingLanes|=2,_.entangledLanes|=2;f;){var b=1<<31-Mt(f);_.entanglements[1]|=b,f&=~b}an(s),(De&6)===0&&(Co=Be()+500,fi(0))}}break;case 31:case 13:_=_l(s,2),_!==null&&At(_,s,2),Oo(),Nr(s,2)}if(s=Dr(l),s===null&&br(e,t,l,Qo,n),s===i)break;i=s}i!==null&&l.stopPropagation()}else br(e,t,l,null,n)}}function Dr(e){return e=Ys(e),kr(e)}var Qo=null;function kr(e){if(Qo=null,e=Nl(e),e!==null){var t=d(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=g(t),e!==null)return e;e=null}else if(n===31){if(e=h(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Qo=e,null}function dm(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(On()){case sl:return 2;case Rl:return 8;case Rn:case vt:return 32;case zn:return 268435456;default:return 32}default:return 32}}var Yr=!1,In=null,Pn=null,$n=null,yi=new Map,bi=new Map,el=[],kh="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function _m(e,t){switch(e){case"focusin":case"focusout":In=null;break;case"dragenter":case"dragleave":Pn=null;break;case"mouseover":case"mouseout":$n=null;break;case"pointerover":case"pointerout":yi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":bi.delete(t.pointerId)}}function vi(e,t,n,l,i,s){return e===null||e.nativeEvent!==s?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:s,targetContainers:[i]},t!==null&&(t=jl(t),t!==null&&cm(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Yh(e,t,n,l,i){switch(t){case"focusin":return In=vi(In,e,t,n,l,i),!0;case"dragenter":return Pn=vi(Pn,e,t,n,l,i),!0;case"mouseover":return $n=vi($n,e,t,n,l,i),!0;case"pointerover":var s=i.pointerId;return yi.set(s,vi(yi.get(s)||null,e,t,n,l,i)),!0;case"gotpointercapture":return s=i.pointerId,bi.set(s,vi(bi.get(s)||null,e,t,n,l,i)),!0}return!1}function mm(e){var t=Nl(e.target);if(t!==null){var n=d(t);if(n!==null){if(t=n.tag,t===13){if(t=g(n),t!==null){e.blockedOn=t,Ac(e.priority,function(){fm(n)});return}}else if(t===31){if(t=h(n),t!==null){e.blockedOn=t,Ac(e.priority,function(){fm(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Vo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Dr(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);ks=l,n.target.dispatchEvent(l),ks=null}else return t=jl(n),t!==null&&cm(t),e.blockedOn=n,!1;t.shift()}return!0}function pm(e,t,n){Vo(e)&&n.delete(t)}function Uh(){Yr=!1,In!==null&&Vo(In)&&(In=null),Pn!==null&&Vo(Pn)&&(Pn=null),$n!==null&&Vo($n)&&($n=null),yi.forEach(pm),bi.forEach(pm)}function Zo(e,t){e.blockedOn===t&&(e.blockedOn=null,Yr||(Yr=!0,a.unstable_scheduleCallback(a.unstable_NormalPriority,Uh)))}var Ko=null;function gm(e){Ko!==e&&(Ko=e,a.unstable_scheduleCallback(a.unstable_NormalPriority,function(){Ko===e&&(Ko=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],i=e[t+2];if(typeof l!="function"){if(kr(l||n)===null)continue;break}var s=jl(n);s!==null&&(e.splice(t,3),t-=3,Du(s,{pending:!0,data:i,method:n.method,action:l},l,i))}}))}function ma(e){function t(b){return Zo(b,e)}In!==null&&Zo(In,e),Pn!==null&&Zo(Pn,e),$n!==null&&Zo($n,e),yi.forEach(t),bi.forEach(t);for(var n=0;n<el.length;n++){var l=el[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<el.length&&(n=el[0],n.blockedOn===null);)mm(n),n.blockedOn===null&&el.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var i=n[l],s=n[l+1],f=i[xt]||null;if(typeof s=="function")f||gm(n);else if(f){var _=null;if(s&&s.hasAttribute("formAction")){if(i=s,f=s[xt]||null)_=f.formAction;else if(kr(i)!==null)continue}else _=f.action;typeof _=="function"?n[l+1]=_:(n.splice(l,3),l-=3),gm(n)}}}function hm(){function e(s){s.canIntercept&&s.info==="react-transition"&&s.intercept({handler:function(){return new Promise(function(f){return i=f})},focusReset:"manual",scroll:"manual"})}function t(){i!==null&&(i(),i=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var s=navigation.currentEntry;s&&s.url!=null&&navigation.navigate(s.url,{state:s.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,i=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),i!==null&&(i(),i=null)}}}function Ur(e){this._internalRoot=e}Jo.prototype.render=Ur.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));var n=t.current,l=Lt();um(n,l,e,t,null,null)},Jo.prototype.unmount=Ur.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;um(e.current,2,null,e,null,null),Oo(),t[Ml]=null}};function Jo(e){this._internalRoot=e}Jo.prototype.unstable_scheduleHydration=function(e){if(e){var t=Cc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<el.length&&t!==0&&t<el[n].priority;n++);el.splice(n,0,e),n===0&&mm(e)}};var ym=o.version;if(ym!=="19.2.4")throw Error(r(527,ym,"19.2.4"));Q.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(r(188)):(e=Object.keys(e).join(","),Error(r(268,e)));return e=m(t),e=e!==null?E(e):null,e=e===null?null:e.stateNode,e};var Lh={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:z,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Wo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Wo.isDisabled&&Wo.supportsFiber)try{Ra=Wo.inject(Lh),zt=Wo}catch{}}return Si.createRoot=function(e,t){if(!c(e))throw Error(r(299));var n=!1,l="",i=Td,s=Cd,f=Ad;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(i=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(f=t.onRecoverableError)),t=om(e,1,!1,null,null,n,l,null,i,s,f,hm),e[Ml]=t.current,yr(e),new Ur(t)},Si.hydrateRoot=function(e,t,n){if(!c(e))throw Error(r(299));var l=!1,i="",s=Td,f=Cd,_=Ad,b=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(i=n.identifierPrefix),n.onUncaughtError!==void 0&&(s=n.onUncaughtError),n.onCaughtError!==void 0&&(f=n.onCaughtError),n.onRecoverableError!==void 0&&(_=n.onRecoverableError),n.formState!==void 0&&(b=n.formState)),t=om(e,1,!0,t,n??null,l,i,b,s,f,_,hm),t.context=sm(null),n=t.current,l=Lt(),l=As(l),i=Bn(l),i.callback=null,Hn(n,i,l),n=l,t.current.lanes=n,Ma(t,n),an(t),e[Ml]=t.current,yr(e),new Jo(t)},Si.version="19.2.4",Si}var Om;function Fh(){if(Om)return Hr.exports;Om=1;function a(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(a)}catch(o){console.error(o)}}return a(),Hr.exports=Wh(),Hr.exports}var Ih=Fh(),rs={},Ph=()=>{window.va||(window.va=function(...o){window.vaq||(window.vaq=[]),window.vaq.push(o)})},$h="@vercel/analytics",ey="2.0.1";function c0(){return typeof window<"u"}function f0(){try{const a="production"}catch{}return"production"}function ty(a="auto"){if(a==="auto"){window.vam=f0();return}window.vam=a}function ny(){return(c0()?window.vam:f0())||"production"}function _c(){return ny()==="development"}function ly(a){return a.scriptSrc?xa(a.scriptSrc):_c()?"https://va.vercel-scripts.com/v1/script.debug.js":a.basePath?xa(`${a.basePath}/insights/script.js`):"/_vercel/insights/script.js"}function ay(a,o){var u;let r=a;if(o)try{r={...(u=JSON.parse(o))==null?void 0:u.analytics,...a}}catch{}ty(r.mode);const c={sdkn:$h+(r.framework?`/${r.framework}`:""),sdkv:ey};return r.disableAutoTrack&&(c.disableAutoTrack="1"),r.viewEndpoint&&(c.viewEndpoint=xa(r.viewEndpoint)),r.eventEndpoint&&(c.eventEndpoint=xa(r.eventEndpoint)),r.sessionEndpoint&&(c.sessionEndpoint=xa(r.sessionEndpoint)),_c()&&r.debug===!1&&(c.debug="false"),r.dsn&&(c.dsn=r.dsn),r.endpoint?c.endpoint=r.endpoint:r.basePath&&(c.endpoint=xa(`${r.basePath}/insights`)),{beforeSend:r.beforeSend,src:ly(r),dataset:c}}function xa(a){return a.startsWith("http://")||a.startsWith("https://")||a.startsWith("/")?a:`/${a}`}function iy(a={debug:!0},o){var u;if(!c0())return;const{beforeSend:r,src:c,dataset:d}=ay(a,o);if(Ph(),r&&((u=window.va)==null||u.call(window,"beforeSend",r)),document.head.querySelector(`script[src*="${c}"]`))return;const g=document.createElement("script");g.src=c;for(const[h,p]of Object.entries(d))g.dataset[h]=p;g.defer=!0,g.onerror=()=>{const h=_c()?"Please check if any ad blockers are enabled and try again.":"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";console.log(`[Vercel Web Analytics] Failed to load script from ${c}. ${h}`)},document.head.appendChild(g)}function oy({route:a,path:o}){var u;(u=window.va)==null||u.call(window,"pageview",{route:a,path:o})}function sy(){if(!(typeof process>"u"||typeof rs>"u"))return rs.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH}function uy(){if(!(typeof process>"u"||typeof rs>"u"))return rs.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG}function ry(a){return w.useEffect(()=>{var o;a.beforeSend&&((o=window.va)==null||o.call(window,"beforeSend",a.beforeSend))},[a.beforeSend]),w.useEffect(()=>{iy({framework:a.framework||"react",basePath:a.basePath??sy(),...a.route!==void 0&&{disableAutoTrack:!0},...a},a.configString??uy())},[]),w.useEffect(()=>{a.route&&a.path&&oy({route:a.route,path:a.path})},[a.route,a.path]),null}let pa=null,os=null,Rm={};function d0(a){return(!pa||pa.state==="closed")&&(pa=new AudioContext({latencyHint:Rm.latencyHint,sampleRate:Rm.sampleRate}),os=null),pa.state==="suspended"&&pa.resume(),pa}function cy(){const a=d0();return os&&os.context===a?os:a.destination}function il(a,o,u){const r=a.createGain(),c=a.createGain(),d=a.createGain();d.gain.value=1-o,r.connect(d),d.connect(c);const g=a.createGain();g.gain.value=o,r.connect(g);const h=a.createGain();h.connect(c);const p=u(g,h);return{input:r,output:c,dispose:p?.dispose}}function fy(a,o){const u=o.decay??.5,r=o.mix??.3,c=o.preDelay??0,d=o.damping??0,g=o.roomSize??1;return il(a,r,(h,p)=>{const m=a.sampleRate,E=u*g,S=Math.ceil(m*E),N=a.createBuffer(2,S,m);for(let A=0;A<2;A++){const U=N.getChannelData(A);for(let j=0;j<S;j++)U[j]=(Math.random()*2-1)*Math.exp(-j/(S*.28))}if(d>0)for(let A=0;A<2;A++){const U=N.getChannelData(A),j=Math.min(d,.99);let H=0;for(let J=0;J<S;J++)H=U[J]*(1-j)+H*j,U[J]=H}const C=a.createConvolver();if(C.buffer=N,c>0){const A=a.createDelay(Math.max(c+.01,1));A.delayTime.value=c,h.connect(A),A.connect(C)}else h.connect(C);C.connect(p)})}const zm=new Map;function dy(a,o){const u=o.mix??.5;return il(a,u,(r,c)=>{const d=a.createConvolver();if(o.buffer)d.buffer=o.buffer;else if(o.url){const g=zm.get(o.url);if(g)d.buffer=g;else{const h=o.url;fetch(h).then(p=>p.arrayBuffer()).then(p=>a.decodeAudioData(p)).then(p=>{zm.set(h,p),d.buffer=p})}}r.connect(d),d.connect(c)})}function _y(a,o){const u=o.time??.25,r=o.feedback??.3,c=o.mix??.3;return il(a,c,(d,g)=>{const h=a.createDelay(Math.max(u+.01,1));h.delayTime.value=u;const p=a.createGain();if(p.gain.value=r,d.connect(h),h.connect(p),o.feedbackFilter){const m=a.createBiquadFilter();m.type=o.feedbackFilter.type,m.frequency.value=o.feedbackFilter.frequency,m.Q.value=o.feedbackFilter.Q??1,p.connect(m),m.connect(h)}else p.connect(h);h.connect(g)})}function my(a,o){const u=o.amount??50,r=o.mix??.5;return il(a,r,(c,d)=>{const g=a.createWaveShaper(),h=44100,p=new Float32Array(h),m=u;for(let E=0;E<h;E++){const S=E*2/h-1;p[E]=Math.tanh(m*S)}g.curve=p,g.oversample="4x",c.connect(g),g.connect(d)})}function py(a,o){const u=o.rate??1.5,r=o.depth??.003,c=o.mix??.3;return il(a,c,(d,g)=>{const h=a.createDelay();h.delayTime.value=.012;const p=a.createDelay();p.delayTime.value=.016;const m=a.createOscillator();m.type="sine",m.frequency.value=u;const E=a.createOscillator();E.type="sine",E.frequency.value=u*1.1;const S=a.createGain();S.gain.value=r;const N=a.createGain();return N.gain.value=r,m.connect(S),S.connect(h.delayTime),m.start(),E.connect(N),N.connect(p.delayTime),E.start(),d.connect(h),d.connect(p),h.connect(g),p.connect(g),{dispose(){try{m.stop()}catch{}try{E.stop()}catch{}}}})}function gy(a,o){const u=o.rate??.5,r=o.depth??.002,c=o.feedback??.5,d=o.mix??.5;return il(a,d,(g,h)=>{const p=a.createDelay();p.delayTime.value=.005;const m=a.createOscillator();m.type="sine",m.frequency.value=u;const E=a.createGain();E.gain.value=r,m.connect(E),E.connect(p.delayTime),m.start();const S=a.createGain();return S.gain.value=c,p.connect(S),S.connect(p),g.connect(p),p.connect(h),{dispose(){try{m.stop()}catch{}}}})}function hy(a,o){const u=o.rate??.5,r=o.depth??1e3,c=o.stages??4,d=o.feedback??.5,g=o.mix??.5;return il(a,g,(h,p)=>{const m=[],E=[200,600,1200,2400,4800,8e3];for(let A=0;A<c;A++){const U=a.createBiquadFilter();U.type="allpass",U.frequency.value=E[A%E.length],U.Q.value=.5,m.push(U)}for(let A=0;A<m.length-1;A++)m[A].connect(m[A+1]);const S=a.createOscillator();S.type="sine",S.frequency.value=u;const N=a.createGain();N.gain.value=r,S.connect(N);for(const A of m)N.connect(A.frequency);S.start();const C=a.createGain();return C.gain.value=d,m[m.length-1].connect(C),C.connect(m[0]),h.connect(m[0]),m[m.length-1].connect(p),{dispose(){try{S.stop()}catch{}}}})}function yy(a,o){const u=o.rate??4,r=o.depth??.5,c=a.createGain(),d=a.createGain(),g=a.createGain();g.gain.value=1-r/2,c.connect(g),g.connect(d);const h=a.createOscillator();h.type="sine",h.frequency.value=u;const p=a.createGain();return p.gain.value=r/2,h.connect(p),p.connect(g.gain),h.start(),{input:c,output:d,dispose(){try{h.stop()}catch{}}}}function by(a,o){const u=o.rate??5,r=o.depth??.002,c=a.createGain(),d=a.createGain(),g=a.createDelay();g.delayTime.value=r;const h=a.createOscillator();h.type="sine",h.frequency.value=u;const p=a.createGain();return p.gain.value=r,h.connect(p),p.connect(g.delayTime),h.start(),c.connect(g),g.connect(d),{input:c,output:d,dispose(){try{h.stop()}catch{}}}}function vy(a,o){const u=o.bits??8,r=o.mix??1,c=o.sampleRateReduction??1;return il(a,r,(d,g)=>{const h=a.createWaveShaper(),p=2**u,m=65536,E=new Float32Array(m);for(let S=0;S<m;S++){const N=S*2/m-1;if(c>1){const A=Math.floor(S/c)*c*2/m-1;E[S]=Math.round(A*p)/p}else E[S]=Math.round(N*p)/p}h.curve=E,d.connect(h),h.connect(g)})}function xy(a,o){const u=a.createDynamicsCompressor();return u.threshold.value=o.threshold??-24,u.knee.value=o.knee??30,u.ratio.value=o.ratio??4,u.attack.value=o.attack??.003,u.release.value=o.release??.25,{input:u,output:u}}function Sy(a,o){const u=a.createGain(),r=a.createGain();if(o.bands.length===0)return u.connect(r),{input:u,output:r};const c=o.bands.map(d=>{const g=a.createBiquadFilter();return g.type=d.type,g.frequency.value=d.frequency,g.gain.value=d.gain,g.Q.value=d.Q??1,g});u.connect(c[0]);for(let d=0;d<c.length-1;d++)c[d].connect(c[d+1]);return c[c.length-1].connect(r),{input:u,output:r}}function wy(a,o){const u=a.createGain();return u.gain.value=o.value,{input:u,output:u}}function Ey(a,o){const u=a.createStereoPanner();return u.pan.value=o.value,{input:u,output:u}}function _0(a,o){switch(o.type){case"reverb":return fy(a,o);case"convolver":return dy(a,o);case"delay":return _y(a,o);case"distortion":return my(a,o);case"chorus":return py(a,o);case"flanger":return gy(a,o);case"phaser":return hy(a,o);case"tremolo":return yy(a,o);case"vibrato":return by(a,o);case"bitcrusher":return vy(a,o);case"compressor":return xy(a,o);case"eq":return Sy(a,o);case"gain":return wy(a,o);case"pan":return Ey(a,o)}}const ha=1e-4;function Ty(a){return"layers"in a}function Cy(a){return Ty(a)?a:{layers:[a],effects:[]}}function Ay(a){for(let o=0;o<a.length;o++)a[o]=Math.random()*2-1}function Oy(a){let o=0,u=0,r=0,c=0,d=0,g=0,h=0;for(let p=0;p<a.length;p++){const m=Math.random()*2-1;o=.99886*o+m*.0555179,u=.99332*u+m*.0750759,r=.969*r+m*.153852,c=.8665*c+m*.3104856,d=.55*d+m*.5329522,g=-.7616*g-m*.016898,a[p]=(o+u+r+c+d+g+h+m*.5362)*.11,h=m*.115926}}function Ry(a){let o=0;for(let u=0;u<a.length;u++){const r=Math.random()*2-1;o=(o+.02*r)/1.02,a[u]=o*3.5}}function zy(a,o,u){const r=a.sampleRate*u,c=a.createBuffer(1,r,a.sampleRate),d=c.getChannelData(0);switch(o){case"pink":Oy(d);break;case"brown":Ry(d);break;default:Ay(d);break}return c}const Mm=new Map;async function My(a,o){const u=Mm.get(o);if(u)return u;const c=await(await fetch(o)).arrayBuffer(),d=await a.decodeAudioData(c);return Mm.set(o,d),d}function Ny(a,o,u,r){const c=a.createOscillator();c.type=o.type,typeof o.frequency=="number"?c.frequency.setValueAtTime(o.frequency,u):(c.frequency.setValueAtTime(o.frequency.start,u),c.frequency.exponentialRampToValueAtTime(Math.max(o.frequency.end,1),u+r)),o.detune&&(c.detune.value=o.detune),c.start(u),c.stop(u+r+.1);let d;if(o.fm){const g=typeof o.frequency=="number"?o.frequency:o.frequency.start;d=a.createOscillator(),d.type="sine",d.frequency.value=g*o.fm.ratio;const h=a.createGain();h.gain.value=o.fm.depth,d.connect(h),h.connect(c.frequency),d.start(u),d.stop(u+r+.1)}return{node:c,scheduled:c,frequencyParam:c.frequency,detuneParam:c.detune}}function jy(a,o,u,r){const c=o.color??"white",d=zy(a,c,r+.1),g=a.createBufferSource();return g.buffer=d,g.start(u),g.stop(u+r+.1),{node:g,scheduled:g}}function Dy(a,o,u,r){const c=new Float32Array(o.harmonics.length+1),d=new Float32Array(o.harmonics.length+1);c[0]=0,d[0]=0;for(let p=0;p<o.harmonics.length;p++)c[p+1]=0,d[p+1]=o.harmonics[p];const g=a.createPeriodicWave(c,d,{disableNormalization:!1}),h=a.createOscillator();return h.setPeriodicWave(g),typeof o.frequency=="number"?h.frequency.setValueAtTime(o.frequency,u):(h.frequency.setValueAtTime(o.frequency.start,u),h.frequency.exponentialRampToValueAtTime(Math.max(o.frequency.end,1),u+r)),h.start(u),h.stop(u+r+.1),{node:h,scheduled:h,frequencyParam:h.frequency,detuneParam:h.detune}}function ky(a,o,u){const r=a.createBufferSource();return o.playbackRate!==void 0&&(r.playbackRate.value=o.playbackRate),o.detune!==void 0&&(r.detune.value=o.detune),o.loop&&(r.loop=!0,o.loopStart!==void 0&&(r.loopStart=o.loopStart),o.loopEnd!==void 0&&(r.loopEnd=o.loopEnd)),o.buffer?(r.buffer=o.buffer,r.start(u)):o.url&&My(a,o.url).then(c=>{r.buffer=c,r.start(Math.max(u,a.currentTime))}),{node:r,scheduled:r,detuneParam:r.detune,playbackRateParam:r.playbackRate}}function Yy(a,o){return{node:a.createMediaStreamSource(o.stream)}}function Uy(a,o,u,r){const c=a.createConstantSource();return c.offset.value=o.offset??1,c.start(u),c.stop(u+r+.1),{node:c,scheduled:c}}function Ly(a,o,u,r){switch(o.type){case"sine":case"triangle":case"square":case"sawtooth":return Ny(a,o,u,r);case"noise":return jy(a,o,u,r);case"wavetable":return Dy(a,o,u,r);case"sample":return ky(a,o,u);case"stream":return Yy(a,o);case"constant":return Uy(a,o,u,r)}}function By(a,o,u){const r=a.createBiquadFilter();if(r.type=o.type,r.frequency.setValueAtTime(o.frequency,u),r.Q.value=o.resonance??1,o.gain!==void 0&&(r.gain.value=o.gain),o.envelope){const c=o.envelope,d=u+(c.attack??0);r.frequency.setValueAtTime(o.frequency,u),r.frequency.linearRampToValueAtTime(c.peak,d),r.frequency.exponentialRampToValueAtTime(Math.max(o.frequency,1),d+c.decay)}return{node:r,frequencyParam:r.frequency}}function Hy(a,o){return{node:a.createIIRFilter(o.feedforward,o.feedback)}}function qy(a,o,u){if(o.type==="iir"){const{node:d}=Hy(a,o);return{node:d}}const{node:r,frequencyParam:c}=By(a,o,u);return{node:r,frequencyParam:c,detuneParam:r.detune,QParam:r.Q,gainParam:r.gain}}function Xy(a,o,u){return(Array.isArray(o)?o:[o]).map(c=>qy(a,c,u))}function Gy(a,o,u,r){const c=a.createGain();if(!o)return c.gain.setValueAtTime(u,r),c.gain.setTargetAtTime(ha,r,.15),{node:c,duration:.5};const d=o.attack??0,g=o.decay,h=o.sustain??0,p=o.release??0,m=Math.max(h*u,ha),E=g/3;if(c.gain.setValueAtTime(ha,r),d>0?c.gain.linearRampToValueAtTime(u,r+d):c.gain.setValueAtTime(u,r),h>0){if(c.gain.setTargetAtTime(m,r+d,E),p>0){const S=p/3;c.gain.setTargetAtTime(ha,r+d+g,S)}}else c.gain.setTargetAtTime(ha,r+d,E);return{node:c,duration:d+g+p}}function Qy(a,o,u,r,c){const d=a.createOscillator();d.type=o.type,d.frequency.value=o.frequency;const g=a.createGain();g.gain.value=o.depth,d.connect(g);let h=null;switch(o.target){case"frequency":h=c.source.frequencyParam??null;break;case"detune":h=c.source.detuneParam??null;break;case"gain":h=c.envNode.gain;break;case"pan":h=c.panner?.pan??null;break;case"playbackRate":h=c.source.playbackRateParam??null;break;case"filter.frequency":h=c.filters[0]?.frequencyParam??null;break;case"filter.detune":h=c.filters[0]?.detuneParam??null;break;case"filter.Q":h=c.filters[0]?.QParam??null;break;case"filter.gain":h=c.filters[0]?.gainParam??null;break}return h?(g.connect(h),d.start(u),d.stop(u+r+.1),d):null}function Vy(a,o){const u=a.createPanner();return u.panningModel=o.panningModel??"HRTF",u.distanceModel=o.distanceModel??"inverse",u.positionX.value=o.positionX,u.positionY.value=o.positionY,u.positionZ.value=o.positionZ,o.orientationX!==void 0&&(u.orientationX.value=o.orientationX),o.orientationY!==void 0&&(u.orientationY.value=o.orientationY),o.orientationZ!==void 0&&(u.orientationZ.value=o.orientationZ),o.maxDistance!==void 0&&(u.maxDistance=o.maxDistance),o.refDistance!==void 0&&(u.refDistance=o.refDistance),o.rolloffFactor!==void 0&&(u.rolloffFactor=o.rolloffFactor),o.coneInnerAngle!==void 0&&(u.coneInnerAngle=o.coneInnerAngle),o.coneOuterAngle!==void 0&&(u.coneOuterAngle=o.coneOuterAngle),o.coneOuterGain!==void 0&&(u.coneOuterGain=o.coneOuterGain),u}function Zy(a,o,u){if(o.length===0)return{input:u,output:u,dispose(){}};const r=o.map(c=>_0(a,c));for(let c=0;c<r.length-1;c++)r[c].output.connect(r[c+1].input);return r[r.length-1].output.connect(u),{input:r[0].input,output:r[r.length-1].output,dispose(){for(const c of r)c.dispose?.()}}}function Ky(a,o,u,r,c){const{layers:d,effects:g}=Cy(o),h=c??a.destination,p=Zy(a,g??[],h),m=a.currentTime,E=u?.velocity??1,S=[p.dispose],N=[],C=[];for(const A of d){const U=m+(A.delay??0),j=(A.gain??.5)*(u?.volume??1)*E,{node:H,duration:J}=Gy(a,A.envelope,j,U);C.push(H);const Z=Ly(a,A.source,U,J);u?.detune&&Z.detuneParam&&(Z.detuneParam.value+=u.detune),u?.playbackRate&&Z.playbackRateParam&&(Z.playbackRateParam.value*=u.playbackRate);let ae=Z.node;const te=[];if(A.filter){const ie=Xy(a,A.filter,U);for(const q of ie)if(ae.connect(q.node),ae=q.node,te.push(q),E<1&&q.frequencyParam){const G=q.frequencyParam.value;q.frequencyParam.setValueAtTime(G*(.5+.5*E),U)}}ae.connect(H);let P=H;const ee=[];if(A.effects&&A.effects.length>0){const ie=A.effects.map(q=>_0(a,q));for(let q=0;q<ie.length-1;q++)ie[q].output.connect(ie[q+1].input);P.connect(ie[0].input),P=ie[ie.length-1].output;for(const q of ie)q.dispose&&ee.push(q.dispose)}let V;const I=u?.pan??A.pan;if(A.panner){const ie=Vy(a,A.panner);P.connect(ie),P=ie}else I!==void 0&&I!==0&&(V=a.createStereoPanner(),V.pan.value=I,P.connect(V),P=V);if(P.connect(p.input),A.lfo){const ie=Array.isArray(A.lfo)?A.lfo:[A.lfo];for(const q of ie)Qy(a,q,U,J,{source:Z,filters:te,envNode:H,panner:V})}if(Z.scheduled){N.push(Z.scheduled);const ie=[Z.node,H,...te.map(q=>q.node),...V?[V]:[]];Z.scheduled.onended=()=>{for(const q of ie)try{q.disconnect()}catch{}for(const q of ee)q()}}S.push(...ee)}return{stop(A){const U=a.currentTime,j=A??.015;for(const H of C)H.gain.cancelScheduledValues(U),H.gain.setValueAtTime(H.gain.value,U),H.gain.setTargetAtTime(ha,U,j/3);for(const H of N)try{H.stop(U+j+.05)}catch{}}}}function Jy(a){const o=window.matchMedia("(prefers-reduced-motion: reduce)");return o.addEventListener("change",a),()=>o.removeEventListener("change",a)}function Wy(){return window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Fy(){return!1}function Iy(){return w.useSyncExternalStore(Jy,Wy,Fy)}const Py={enabled:!0,volume:1},$y={setEnabled(){},setVolume(){}},m0=w.createContext({state:Py,actions:$y});function eb({children:a,enabled:o=!0,volume:u=1,onEnabledChange:r,onVolumeChange:c}){const d=w.useMemo(()=>({enabled:o,volume:u}),[o,u]),g=w.useRef(r);g.current=r;const h=w.useRef(c);h.current=c;const p=w.useMemo(()=>({setEnabled:E=>g.current?.(E),setVolume:E=>h.current?.(E)}),[]),m=w.useMemo(()=>({state:d,actions:p}),[d,p]);return y.jsx(m0,{value:m,children:a})}function Qr(a,o){const{state:u}=w.use(m0),r=Iy(),c=w.useRef(u);c.current=u;const d=w.useRef(r);d.current=r;const g=w.useRef(a);g.current=a;const h=w.useRef(o);return h.current=o,w.useCallback(()=>{const{enabled:p,volume:m}=c.current;if(!p||d.current)return;const E=d0(),S=(h.current?.volume??1)*m;return Ky(E,g.current,{...h.current,volume:S},void 0,cy())},[])}var mc=r0(),tb=`svg[fill=none] {
  fill: none !important;
}

@keyframes styles-module__popupEnter___AuQDN {
  from {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
}
@keyframes styles-module__popupExit___JJKQX {
  from {
    opacity: 1;
    transform: translateX(-50%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) scale(0.95) translateY(4px);
  }
}
@keyframes styles-module__shake___jdbWe {
  0%, 100% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(0);
  }
  20% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-3px);
  }
  40% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(3px);
  }
  60% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(-2px);
  }
  80% {
    transform: translateX(-50%) scale(1) translateY(0) translateX(2px);
  }
}
.styles-module__popup___IhzrD {
  position: fixed;
  transform: translateX(-50%);
  width: 280px;
  padding: 0.75rem 1rem 14px;
  background: #1a1a1a;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  cursor: default;
  z-index: 100001;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  will-change: transform, opacity;
  opacity: 0;
}
.styles-module__popup___IhzrD.styles-module__enter___L7U7N {
  animation: styles-module__popupEnter___AuQDN 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w {
  opacity: 1;
  transform: translateX(-50%) scale(1) translateY(0);
}
.styles-module__popup___IhzrD.styles-module__exit___5eGjE {
  animation: styles-module__popupExit___JJKQX 0.15s ease-in forwards;
}
.styles-module__popup___IhzrD.styles-module__entered___COX-w.styles-module__shake___jdbWe {
  animation: styles-module__shake___jdbWe 0.25s ease-out;
}

.styles-module__header___wWsSi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5625rem;
}

.styles-module__element___fTV2z {
  font-size: 0.75rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.styles-module__headerToggle___WpW0b {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  flex: 1;
  min-width: 0;
  text-align: left;
}
.styles-module__headerToggle___WpW0b .styles-module__element___fTV2z {
  flex: 1;
}

.styles-module__chevron___ZZJlR {
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}
.styles-module__chevron___ZZJlR.styles-module__expanded___2Hxgv {
  transform: rotate(90deg);
}

.styles-module__stylesWrapper___pnHgy {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.styles-module__stylesWrapper___pnHgy.styles-module__expanded___2Hxgv {
  grid-template-rows: 1fr;
}

.styles-module__stylesInner___YYZe2 {
  overflow: hidden;
}

.styles-module__stylesBlock___VfQKn {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.375rem;
  padding: 0.5rem 0.625rem;
  margin-bottom: 0.5rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-size: 0.6875rem;
  line-height: 1.5;
}

.styles-module__styleLine___1YQiD {
  color: rgba(255, 255, 255, 0.85);
  word-break: break-word;
}

.styles-module__styleProperty___84L1i {
  color: #c792ea;
}

.styles-module__styleValue___q51-h {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__timestamp___Dtpsv {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.35);
  font-variant-numeric: tabular-nums;
  margin-left: 0.5rem;
  flex-shrink: 0;
}

.styles-module__quote___mcMmQ {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
  padding: 0.4rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  line-height: 1.45;
}

.styles-module__textarea___jrSae {
  width: 100%;
  padding: 0.5rem 0.625rem;
  font-size: 0.8125rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  resize: none;
  outline: none;
  transition: border-color 0.15s ease;
}
.styles-module__textarea___jrSae:focus {
  border-color: #3c82f7;
}
.styles-module__textarea___jrSae.styles-module__green___99l3h:focus {
  border-color: #34c759;
}
.styles-module__textarea___jrSae::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
.styles-module__textarea___jrSae::-webkit-scrollbar {
  width: 6px;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-track {
  background: transparent;
}
.styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.styles-module__actions___D6x3f {
  display: flex;
  justify-content: flex-end;
  gap: 0.375rem;
  margin-top: 0.5rem;
}

.styles-module__cancel___hRjnL,
.styles-module__submit___K-mIR {
  padding: 0.4rem 0.875rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease, opacity 0.15s ease;
}

.styles-module__cancel___hRjnL {
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__cancel___hRjnL:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.styles-module__submit___K-mIR {
  color: white;
}
.styles-module__submit___K-mIR:hover:not(:disabled) {
  filter: brightness(0.9);
}
.styles-module__submit___K-mIR:disabled {
  cursor: not-allowed;
}

.styles-module__deleteWrapper___oSjdo {
  margin-right: auto;
}

.styles-module__deleteButton___4VuAE {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__deleteButton___4VuAE:active {
  transform: scale(0.92);
}

.styles-module__light___6AaSQ.styles-module__popup___IhzrD {
  background: #fff;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___6AaSQ .styles-module__element___fTV2z {
  color: rgba(0, 0, 0, 0.6);
}
.styles-module__light___6AaSQ .styles-module__timestamp___Dtpsv {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__chevron___ZZJlR {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__stylesBlock___VfQKn {
  background: rgba(0, 0, 0, 0.03);
}
.styles-module__light___6AaSQ .styles-module__styleLine___1YQiD {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__styleProperty___84L1i {
  color: #7c3aed;
}
.styles-module__light___6AaSQ .styles-module__styleValue___q51-h {
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__quote___mcMmQ {
  color: rgba(0, 0, 0, 0.55);
  background: rgba(0, 0, 0, 0.04);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae {
  background: rgba(0, 0, 0, 0.03);
  color: #1a1a1a;
  border-color: rgba(0, 0, 0, 0.12);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::placeholder {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__textarea___jrSae::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___6AaSQ .styles-module__cancel___hRjnL:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___6AaSQ .styles-module__deleteButton___4VuAE:hover {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}`,nb={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let a=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");a||(a=document.createElement("style"),a.id="feedback-tool-styles-annotation-popup-css-styles",a.textContent=tb,document.head.appendChild(a))}var Qe=nb,lb=({size:a=24})=>y.jsx("svg",{width:a,height:a,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Vr="__agentation_freeze";function ab(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:o=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const a=window;return a[Vr]||(a[Vr]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),a[Vr]}var mt=ab();typeof window<"u"&&!mt.installed&&(mt.origSetTimeout=window.setTimeout.bind(window),mt.origSetInterval=window.setInterval.bind(window),mt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(a,o,...u)=>typeof a=="string"?mt.origSetTimeout(a,o):mt.origSetTimeout((...r)=>{mt.frozen?mt.frozenTimeoutQueue.push(()=>a(...r)):a(...r)},o,...u),window.setInterval=(a,o,...u)=>typeof a=="string"?mt.origSetInterval(a,o):mt.origSetInterval((...r)=>{mt.frozen||a(...r)},o,...u),window.requestAnimationFrame=a=>mt.origRAF(o=>{mt.frozen?mt.frozenRAFQueue.push(a):a(o)}),mt.installed=!0);var ga=mt.origSetTimeout;mt.origSetInterval;w.forwardRef(function({element:o,timestamp:u,selectedText:r,placeholder:c="What should change?",initialValue:d="",submitLabel:g="Add",onSubmit:h,onCancel:p,onDelete:m,style:E,accentColor:S="#3c82f7",isExiting:N=!1,lightMode:C=!1,computedStyles:A},U){const[j,H]=w.useState(d),[J,Z]=w.useState(!1),[ae,te]=w.useState("initial"),[P,ee]=w.useState(!1),[V,I]=w.useState(!1),ie=w.useRef(null),q=w.useRef(null),G=w.useRef(null),oe=w.useRef(null);w.useEffect(()=>{N&&ae!=="exit"&&te("exit")},[N,ae]),w.useEffect(()=>{ga(()=>{te("enter")},0);const ne=ga(()=>{te("entered")},200),me=ga(()=>{const v=ie.current;v&&(v.focus(),v.selectionStart=v.selectionEnd=v.value.length,v.scrollTop=v.scrollHeight)},50);return()=>{clearTimeout(ne),clearTimeout(me),G.current&&clearTimeout(G.current),oe.current&&clearTimeout(oe.current)}},[]);const ue=w.useCallback(()=>{oe.current&&clearTimeout(oe.current),Z(!0),oe.current=ga(()=>{Z(!1),ie.current?.focus()},250)},[]);w.useImperativeHandle(U,()=>({shake:ue}),[ue]);const le=w.useCallback(()=>{te("exit"),G.current=ga(()=>{p()},150)},[p]),z=w.useCallback(()=>{j.trim()&&h(j.trim())},[j,h]),Q=w.useCallback(ne=>{ne.nativeEvent.isComposing||(ne.key==="Enter"&&!ne.shiftKey&&(ne.preventDefault(),z()),ne.key==="Escape"&&le())},[z,le]),F=[Qe.popup,C?Qe.light:"",ae==="enter"?Qe.enter:"",ae==="entered"?Qe.entered:"",ae==="exit"?Qe.exit:"",J?Qe.shake:""].filter(Boolean).join(" ");return y.jsxs("div",{ref:q,className:F,"data-annotation-popup":!0,style:E,onClick:ne=>ne.stopPropagation(),children:[y.jsxs("div",{className:Qe.header,children:[A&&Object.keys(A).length>0?y.jsxs("button",{className:Qe.headerToggle,onClick:()=>{const ne=V;I(!V),ne&&ga(()=>ie.current?.focus(),0)},type:"button",children:[y.jsx("svg",{className:`${Qe.chevron} ${V?Qe.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:y.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),y.jsx("span",{className:Qe.element,children:o})]}):y.jsx("span",{className:Qe.element,children:o}),u&&y.jsx("span",{className:Qe.timestamp,children:u})]}),A&&Object.keys(A).length>0&&y.jsx("div",{className:`${Qe.stylesWrapper} ${V?Qe.expanded:""}`,children:y.jsx("div",{className:Qe.stylesInner,children:y.jsx("div",{className:Qe.stylesBlock,children:Object.entries(A).map(([ne,me])=>y.jsxs("div",{className:Qe.styleLine,children:[y.jsx("span",{className:Qe.styleProperty,children:ne.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",y.jsx("span",{className:Qe.styleValue,children:me}),";"]},ne))})})}),r&&y.jsxs("div",{className:Qe.quote,children:["“",r.slice(0,80),r.length>80?"...":"","”"]}),y.jsx("textarea",{ref:ie,className:Qe.textarea,style:{borderColor:P?S:void 0},placeholder:c,value:j,onChange:ne=>H(ne.target.value),onFocus:()=>ee(!0),onBlur:()=>ee(!1),rows:2,onKeyDown:Q}),y.jsxs("div",{className:Qe.actions,children:[m&&y.jsx("div",{className:Qe.deleteWrapper,children:y.jsx("button",{className:Qe.deleteButton,onClick:m,type:"button",children:y.jsx(lb,{size:22})})}),y.jsx("button",{className:Qe.cancel,onClick:le,children:"Cancel"}),y.jsx("button",{className:Qe.submit,style:{backgroundColor:S,opacity:j.trim()?1:.4},onClick:z,disabled:!j.trim(),children:g})]})]})});var ib=`svg[fill=none] {
  fill: none !important;
}

@keyframes styles-module__toolbarEnter___u8RRu {
  from {
    opacity: 0;
    transform: scale(0.5) rotate(90deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes styles-module__badgeEnter___mVQLj {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleIn___c-r1K {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__scaleOut___Wctwz {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@keyframes styles-module__slideUp___kgD36 {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__slideDown___zcdje {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.85) translateY(8px);
  }
}
@keyframes styles-module__markerIn___5FaAP {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes styles-module__markerOut___GU5jX {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.3);
  }
}
@keyframes styles-module__fadeIn___b9qmf {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes styles-module__fadeOut___6Ut6- {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
@keyframes styles-module__tooltipIn___0N31w {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(2px) scale(0.891);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.909);
  }
}
@keyframes styles-module__hoverHighlightIn___6WYHY {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes styles-module__hoverTooltipIn___FYGQx {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
@keyframes styles-module__settingsPanelIn___MGfO8 {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    filter: blur(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
}
@keyframes styles-module__settingsPanelOut___Zfymi {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0px);
  }
  to {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
    filter: blur(5px);
  }
}
.styles-module__toolbar___wNsdK {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  width: 297px;
  z-index: 100000;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  pointer-events: none;
  transition: left 0s, top 0s, right 0s, bottom 0s;
}

.styles-module__toolbarContainer___dIhma {
  user-select: none;
  margin-left: auto;
  align-self: flex-end;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
  color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  cursor: grab;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toolbarContainer___dIhma.styles-module__dragging___xrolZ {
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: grabbing;
}
.styles-module__toolbarContainer___dIhma.styles-module__entrance___sgHd8 {
  animation: styles-module__toolbarEnter___u8RRu 0.5s cubic-bezier(0.34, 1.2, 0.64, 1) forwards;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  padding: 0;
  cursor: pointer;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn svg {
  margin-top: -1px;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #2a2a2a;
}
.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:active {
  transform: scale(0.95);
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx {
  height: 44px;
  border-radius: 1.5rem;
  padding: 0.375rem;
  width: 257px;
}
.styles-module__toolbarContainer___dIhma.styles-module__expanded___ofKPx.styles-module__serverConnected___Gfbou {
  width: 297px;
}

.styles-module__toggleContent___0yfyP {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__toggleContent___0yfyP.styles-module__visible___KHwEW {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
}
.styles-module__toggleContent___0yfyP.styles-module__hidden___Ae8H4 {
  opacity: 0;
  pointer-events: none;
}

.styles-module__controlsContent___9GJWU {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  transition: filter 0.8s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.8s cubic-bezier(0.19, 1, 0.22, 1), transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__controlsContent___9GJWU.styles-module__visible___KHwEW {
  opacity: 1;
  filter: blur(0px);
  transform: scale(1);
  visibility: visible;
  pointer-events: auto;
}
.styles-module__controlsContent___9GJWU.styles-module__hidden___Ae8H4 {
  pointer-events: none;
  opacity: 0;
  filter: blur(10px);
  transform: scale(0.4);
}

.styles-module__badge___2XsgF {
  position: absolute;
  top: -13px;
  right: -13px;
  user-select: none;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 9px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15), inset 0 0 0 1px rgba(255, 255, 255, 0.04);
  opacity: 1;
  transition: transform 0.3s ease, opacity 0.2s ease;
  transform: scale(1);
}
.styles-module__badge___2XsgF.styles-module__fadeOut___6Ut6- {
  opacity: 0;
  transform: scale(0);
  pointer-events: none;
}
.styles-module__badge___2XsgF.styles-module__entrance___sgHd8 {
  animation: styles-module__badgeEnter___mVQLj 0.3s cubic-bezier(0.34, 1.2, 0.64, 1) 0.4s both;
}

.styles-module__controlButton___8Q0jc {
  position: relative;
  cursor: pointer !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  transition: background-color 0.15s ease, color 0.15s ease, transform 0.1s ease, opacity 0.2s ease;
}
.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}
.styles-module__controlButton___8Q0jc:active:not(:disabled) {
  transform: scale(0.92);
}
.styles-module__controlButton___8Q0jc:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.25);
}
.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}
.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.25);
  color: #ff3b30;
}
.styles-module__controlButton___8Q0jc[data-no-hover=true], .styles-module__controlButton___8Q0jc.styles-module__statusShowing___te6iu {
  cursor: default !important;
  pointer-events: none;
  background: transparent !important;
}
.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
  cursor: default;
}
.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.25);
}

.styles-module__buttonBadge___NeFWb {
  position: absolute;
  top: 0px;
  right: 0px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 8px;
  background: #3c82f7;
  color: white;
  font-size: 0.625rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px #1a1a1a, 0 1px 3px rgba(0, 0, 0, 0.2);
  pointer-events: none;
}
.styles-module__buttonBadge___NeFWb.styles-module__light___r6n4Y {
  box-shadow: 0 0 0 2px #fff, 0 1px 3px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpIndicatorPulseConnected___EDodZ {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpIndicatorPulseConnecting___cCYte {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(245, 166, 35, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(245, 166, 35, 0);
  }
}
.styles-module__mcpIndicator___zGJeL {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  pointer-events: none;
  transition: background 0.3s ease, opacity 0.15s ease, transform 0.15s ease;
  opacity: 1;
  transform: scale(1);
}
.styles-module__mcpIndicator___zGJeL.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpIndicatorPulseConnected___EDodZ 2.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpIndicatorPulseConnecting___cCYte 1.5s ease-in-out infinite;
}
.styles-module__mcpIndicator___zGJeL.styles-module__hidden___Ae8H4 {
  opacity: 0;
  transform: scale(0);
  animation: none;
}

@keyframes styles-module__connectionPulse___-Zycw {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}
.styles-module__connectionIndicatorWrapper___L-e-3 {
  width: 8px;
  height: 34px;
  margin-left: 6px;
  margin-right: 6px;
}

.styles-module__connectionIndicator___afk9p {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease, background 0.3s ease;
  cursor: default;
}

.styles-module__connectionIndicatorVisible___C-i5B {
  opacity: 1;
}

.styles-module__connectionIndicatorConnected___IY8pR {
  background: #34c759;
  animation: styles-module__connectionPulse___-Zycw 2.5s ease-in-out infinite;
}

.styles-module__connectionIndicatorDisconnected___kmpaZ {
  background: #ff3b30;
  animation: none;
}

.styles-module__connectionIndicatorConnecting___QmSLH {
  background: #f59e0b;
  animation: styles-module__connectionPulse___-Zycw 1s ease-in-out infinite;
}

.styles-module__buttonWrapper___rBcdv {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) scale(1);
  transition-delay: 0.85s;
}
.styles-module__buttonWrapper___rBcdv:has(.styles-module__controlButton___8Q0jc:disabled):hover .styles-module__buttonTooltip___Burd9 {
  opacity: 0;
  visibility: hidden;
}

.styles-module__sendButtonWrapper___UUxG6 {
  width: 0;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  margin-left: -0.375rem;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), margin 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6 .styles-module__controlButton___8Q0jc {
  transform: scale(0.8);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU {
  width: 34px;
  opacity: 1;
  overflow: visible;
  pointer-events: auto;
  margin-left: 0;
}
.styles-module__sendButtonWrapper___UUxG6.styles-module__sendButtonVisible___WPSQU .styles-module__controlButton___8Q0jc {
  transform: scale(1);
}

.styles-module__buttonTooltip___Burd9 {
  position: absolute;
  bottom: calc(100% + 14px);
  left: 50%;
  transform: translateX(-50%) scale(0.95);
  padding: 6px 10px;
  background: #1a1a1a;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  z-index: 100001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.135s ease, transform 0.135s ease, visibility 0.135s ease;
}
.styles-module__buttonTooltip___Burd9::after {
  content: "";
  position: absolute;
  top: calc(100% - 4px);
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 8px;
  height: 8px;
  background: #1a1a1a;
  border-radius: 0 0 2px 0;
}

.styles-module__shortcut___lEAQk {
  margin-left: 4px;
  opacity: 0.5;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9 {
  bottom: auto;
  top: calc(100% + 14px);
  transform: translateX(-50%) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonTooltip___Burd9::after {
  top: -4px;
  bottom: auto;
  border-radius: 2px 0 0 0;
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapper___rBcdv:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-50%) scale(1);
}

.styles-module__tooltipsHidden___VtLJG .styles-module__buttonTooltip___Burd9 {
  opacity: 0 !important;
  visibility: hidden !important;
  transition: none !important;
}

.styles-module__tooltipVisible___0jcCv,
.styles-module__tooltipsHidden___VtLJG .styles-module__tooltipVisible___0jcCv {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
  transition-delay: 0s !important;
}

.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(-12px) scale(0.95);
}
.styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9::after {
  left: 16px;
}
.styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignLeft___myzIp:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(-12px) scale(1);
}

.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  left: 50%;
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9::after {
  left: auto;
  right: 8px;
}
.styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(0.95);
}
.styles-module__tooltipBelow___m6ats .styles-module__buttonWrapperAlignRight___HCQFR:hover .styles-module__buttonTooltip___Burd9 {
  transform: translateX(calc(-100% + 12px)) scale(1);
}

.styles-module__divider___c--s1 {
  width: 1px;
  height: 12px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 0.125rem;
}

.styles-module__overlay___Q1O9y {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
}
.styles-module__overlay___Q1O9y > * {
  pointer-events: auto;
}

.styles-module__hoverHighlight___ogakW {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.5);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.04);
  box-sizing: border-box;
  will-change: opacity;
  contain: layout style;
}
.styles-module__hoverHighlight___ogakW.styles-module__enter___WFIki {
  animation: styles-module__hoverHighlightIn___6WYHY 0.12s ease-out forwards;
}

.styles-module__multiSelectOutline___cSJ-m {
  position: fixed;
  border: 2px dashed rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(52, 199, 89, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__multiSelectOutline___cSJ-m.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__singleSelectOutline___QhX-O {
  position: fixed;
  border: 2px solid rgba(60, 130, 247, 0.6);
  border-radius: 4px;
  pointer-events: none !important;
  background: rgba(60, 130, 247, 0.05);
  box-sizing: border-box;
  will-change: opacity;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__enter___WFIki {
  animation: styles-module__fadeIn___b9qmf 0.15s ease-out forwards;
}
.styles-module__singleSelectOutline___QhX-O.styles-module__exit___fyOJ0 {
  animation: styles-module__fadeOut___6Ut6- 0.15s ease-out forwards;
}

.styles-module__hoverTooltip___bvLk7 {
  position: fixed;
  font-size: 0.6875rem;
  font-weight: 500;
  color: #fff;
  background: rgba(0, 0, 0, 0.85);
  padding: 0.35rem 0.6rem;
  border-radius: 0.375rem;
  pointer-events: none !important;
  white-space: nowrap;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.styles-module__hoverTooltip___bvLk7.styles-module__enter___WFIki {
  animation: styles-module__hoverTooltipIn___FYGQx 0.1s ease-out forwards;
}

.styles-module__hoverReactPath___gx1IJ {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.15rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__hoverElementName___QMLMl {
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markersLayer___-25j1 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__markersLayer___-25j1 > * {
  pointer-events: auto;
}

.styles-module__fixedMarkersLayer___ffyX6 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99998;
  pointer-events: none;
}
.styles-module__fixedMarkersLayer___ffyX6 > * {
  pointer-events: auto;
}

.styles-module__marker___6sQrs {
  position: absolute;
  width: 22px;
  height: 22px;
  background: #3c82f7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6875rem;
  font-weight: 600;
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(0, 0, 0, 0.04);
  user-select: none;
  will-change: transform, opacity;
  contain: layout style;
  z-index: 1;
}
.styles-module__marker___6sQrs:hover {
  z-index: 2;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7) {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.styles-module__marker___6sQrs.styles-module__enter___WFIki {
  animation: styles-module__markerIn___5FaAP 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.styles-module__marker___6sQrs.styles-module__exit___fyOJ0 {
  animation: styles-module__markerOut___GU5jX 0.2s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs.styles-module__clearing___FQ--7 {
  animation: styles-module__markerOut___GU5jX 0.15s ease-out both;
  pointer-events: none;
}
.styles-module__marker___6sQrs:not(.styles-module__enter___WFIki):not(.styles-module__exit___fyOJ0):not(.styles-module__clearing___FQ--7):hover {
  transform: translate(-50%, -50%) scale(1.1);
}
.styles-module__marker___6sQrs.styles-module__pending___2IHLC {
  position: fixed;
  background: #3c82f7;
}
.styles-module__marker___6sQrs.styles-module__fixed___dBMHC {
  position: fixed;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz {
  background: #34c759;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  font-size: 0.75rem;
}
.styles-module__marker___6sQrs.styles-module__multiSelect___YWiuz.styles-module__pending___2IHLC {
  background: #34c759;
}
.styles-module__marker___6sQrs.styles-module__hovered___ZgXIy {
  background: #ff3b30;
}

.styles-module__renumber___nCTxD {
  display: block;
  animation: styles-module__renumberRoll___Wgbq3 0.2s ease-out;
}

@keyframes styles-module__renumberRoll___Wgbq3 {
  0% {
    transform: translateX(-40%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
.styles-module__markerTooltip___aLJID {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) scale(0.909);
  z-index: 100002;
  background: #1a1a1a;
  padding: 8px 0.75rem;
  border-radius: 0.75rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-weight: 400;
  color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
  min-width: 120px;
  max-width: 200px;
  pointer-events: none;
  cursor: default;
}
.styles-module__markerTooltip___aLJID.styles-module__enter___WFIki {
  animation: styles-module__tooltipIn___0N31w 0.1s ease-out forwards;
}

.styles-module__markerQuote___FHmrz {
  display: block;
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.3125rem;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.styles-module__markerNote___QkrrS {
  display: block;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-bottom: 2px;
}

.styles-module__markerHint___2iF-6 {
  display: block;
  font-size: 0.625rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.375rem;
  white-space: nowrap;
}

.styles-module__settingsPanel___OxX3Y {
  position: absolute;
  right: 5px;
  bottom: calc(100% + 0.5rem);
  z-index: 1;
  overflow: hidden;
  background: #1c1c1c;
  border-radius: 1rem;
  padding: 13px 0 16px;
  min-width: 205px;
  cursor: default;
  opacity: 1;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.04);
  transition: background 0.25s ease, box-shadow 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y::before, .styles-module__settingsPanel___OxX3Y::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  width: 16px;
  z-index: 2;
  pointer-events: none;
}
.styles-module__settingsPanel___OxX3Y::before {
  left: 0;
  background: linear-gradient(to right, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y::after {
  right: 0;
  background: linear-gradient(to left, #1c1c1c 0%, transparent 100%);
}
.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2,
.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw,
.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY,
.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz,
.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa,
.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax,
.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr,
.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp,
.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56,
.styles-module__settingsPanel___OxX3Y .styles-module__themeToggle___2rUjA {
  transition: background 0.25s ease, color 0.25s ease, border-color 0.25s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__enter___WFIki {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0px);
  transition: opacity 0.2s ease, transform 0.2s ease, filter 0.2s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__exit___fyOJ0 {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
  filter: blur(5px);
  pointer-events: none;
  transition: opacity 0.1s ease, transform 0.1s ease, filter 0.1s ease;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf {
  background: #1a1a1a;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.6);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12 {
  color: rgba(255, 255, 255, 0.85);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12:hover {
  background: rgba(255, 255, 255, 0.1);
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.styles-module__settingsPanel___OxX3Y.styles-module__dark___ILIQf .styles-module__toggleLabel___Xm8Aa {
  color: rgba(255, 255, 255, 0.85);
}

.styles-module__settingsPanelContainer___Xksv8 {
  overflow: visible;
  position: relative;
  display: flex;
  padding: 0 1rem;
}
.styles-module__settingsPanelContainer___Xksv8.styles-module__transitioning___qxzCk {
  overflow-x: clip;
  overflow-y: visible;
}

.styles-module__settingsPage___6YfHH {
  min-width: 100%;
  flex-shrink: 0;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.2s ease-out;
  opacity: 1;
}

.styles-module__settingsPage___6YfHH.styles-module__slideLeft___Ps01J {
  transform: translateX(-100%);
  opacity: 0;
}

.styles-module__automationsPage___uvCq6 {
  position: absolute;
  top: 0;
  left: 100%;
  width: 100%;
  height: 100%;
  padding: 3px 1rem 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.25s ease-out 0.1s;
  opacity: 0;
}

.styles-module__automationsPage___uvCq6.styles-module__slideIn___4-qXe {
  transform: translateX(-100%);
  opacity: 1;
}

.styles-module__settingsNavLink___wCzJt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover {
  color: rgba(255, 255, 255, 0.9);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.8);
}
.styles-module__settingsNavLink___wCzJt svg {
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__settingsNavLink___wCzJt:hover svg {
  color: #fff;
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y svg {
  color: rgba(0, 0, 0, 0.25);
}
.styles-module__settingsNavLink___wCzJt.styles-module__light___r6n4Y:hover svg {
  color: rgba(0, 0, 0, 0.8);
}

.styles-module__settingsNavLinkRight___ZWwhj {
  display: flex;
  align-items: center;
  gap: 6px;
}

.styles-module__mcpNavIndicator___cl9pO {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpNavIndicator___cl9pO.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s ease-in-out infinite;
}

.styles-module__settingsBackButton___bIe2j {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 0 12px 0;
  margin: -6px 0 0.5rem 0;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 0;
  background: transparent;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.15px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.12s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j svg {
  opacity: 0.4;
  flex-shrink: 0;
  transition: opacity 0.15s ease, transform 0.18s cubic-bezier(0.32, 0.72, 0, 1);
}
.styles-module__settingsBackButton___bIe2j:hover svg {
  opacity: 1;
}
.styles-module__settingsBackButton___bIe2j.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

.styles-module__automationHeader___InP0r {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  font-size: 0.8125rem;
  font-weight: 400;
  color: #fff;
}
.styles-module__automationHeader___InP0r .styles-module__helpIcon___xQg56 svg {
  transform: none;
}
.styles-module__automationHeader___InP0r.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__automationDescription___NKlmo {
  font-size: 0.6875rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 2px;
  line-height: 14px;
}
.styles-module__automationDescription___NKlmo.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__learnMoreLink___8xv-x {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: underline dotted;
  text-decoration-color: rgba(255, 255, 255, 0.2);
  text-underline-offset: 2px;
  transition: color 0.15s ease;
}
.styles-module__learnMoreLink___8xv-x:hover {
  color: #fff;
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.6);
  text-decoration-color: rgba(0, 0, 0, 0.2);
}
.styles-module__learnMoreLink___8xv-x.styles-module__light___r6n4Y:hover {
  color: rgba(0, 0, 0, 0.85);
}

.styles-module__autoSendRow___UblX5 {
  display: flex;
  align-items: center;
  gap: 8px;
}

.styles-module__autoSendLabel___icDc2 {
  font-size: 0.6875rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.15s ease;
}
.styles-module__autoSendLabel___icDc2.styles-module__active___-zoN6 {
  color: #66b8ff;
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__autoSendLabel___icDc2.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  color: #3c82f7;
}

.styles-module__webhookUrlInput___2375C {
  display: block;
  width: 100%;
  flex: 1;
  min-height: 60px;
  box-sizing: border-box;
  margin-top: 11px;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.03);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 400;
  color: #fff;
  outline: none;
  resize: none;
  cursor: text !important;
  user-select: text;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}
.styles-module__webhookUrlInput___2375C::placeholder {
  color: rgba(255, 255, 255, 0.3);
}
.styles-module__webhookUrlInput___2375C:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y {
  border-color: rgba(0, 0, 0, 0.1);
  background: rgba(0, 0, 0, 0.03);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y::placeholder {
  color: rgba(0, 0, 0, 0.3);
}
.styles-module__webhookUrlInput___2375C.styles-module__light___r6n4Y:focus {
  border-color: rgba(0, 0, 0, 0.25);
  background: rgba(0, 0, 0, 0.05);
}

.styles-module__settingsHeader___pwDY9 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  margin-bottom: 0.5rem;
  padding-bottom: 9px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.styles-module__settingsBrand___0gJeM {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: -0.0094em;
  color: #fff;
}

.styles-module__settingsBrandSlash___uTG18 {
  color: rgba(255, 255, 255, 0.5);
}

.styles-module__settingsVersion___TUcFq {
  font-size: 11px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.4);
  margin-left: auto;
  letter-spacing: -0.0094em;
}

.styles-module__settingsSection___m-YM2 + .styles-module__settingsSection___m-YM2 {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}
.styles-module__settingsSection___m-YM2.styles-module__settingsSectionExtraPadding___jdhFV {
  padding-top: calc(0.5rem + 4px);
}

.styles-module__settingsSectionGrow___h-5HZ {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.styles-module__settingsRow___3sdhc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
}
.styles-module__settingsRow___3sdhc.styles-module__settingsRowMarginTop___zA0Sp {
  margin-top: 8px;
}

.styles-module__dropdownContainer___BVnxe {
  position: relative;
}

.styles-module__dropdownButton___16NPz {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownButton___16NPz:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownButton___16NPz svg {
  opacity: 0.6;
}

.styles-module__cycleButton___FMKfw {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  letter-spacing: -0.0094em;
}
.styles-module__cycleButton___FMKfw.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__cycleButton___FMKfw:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX {
  color: rgba(255, 255, 255, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__settingsRowDisabled___EgS0V .styles-module__toggleSwitch___l4Ygm {
  opacity: 0.4;
  cursor: not-allowed;
}

@keyframes styles-module__cycleTextIn___Q6zJf {
  0% {
    opacity: 0;
    transform: translateY(-6px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.styles-module__cycleButtonText___fD1LR {
  display: inline-block;
  animation: styles-module__cycleTextIn___Q6zJf 0.2s ease-out;
}

.styles-module__cycleDots___LWuoQ {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.styles-module__cycleDot___nPgLY {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: scale(0.667);
  transition: background-color 0.25s ease-out, transform 0.25s ease-out;
}
.styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: #fff;
  transform: scale(1);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__cycleDot___nPgLY.styles-module__light___r6n4Y.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}

.styles-module__dropdownMenu___k73ER {
  position: absolute;
  right: 0;
  top: calc(100% + 0.25rem);
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 0.25rem;
  min-width: 120px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  z-index: 10;
  animation: styles-module__scaleIn___c-r1K 0.15s ease-out;
}

.styles-module__dropdownItem___ylsLj {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0.5rem 0.625rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  text-align: left;
  transition: background-color 0.15s ease, color 0.15s ease;
  letter-spacing: -0.0094em;
}
.styles-module__dropdownItem___ylsLj:hover {
  background: rgba(255, 255, 255, 0.08);
}
.styles-module__dropdownItem___ylsLj.styles-module__selected___OwRqP {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-weight: 600;
}

.styles-module__settingsLabel___8UjfX {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: -0.0094em;
  color: rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  gap: 0.125rem;
}
.styles-module__settingsLabel___8UjfX.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__settingsLabelMarker___ewdtV {
  padding-top: 3px;
  margin-bottom: 10px;
}

.styles-module__settingsOptions___LyrBA {
  display: flex;
  gap: 0.25rem;
}

.styles-module__settingsOption___UNa12 {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.375rem 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  font-size: 0.6875rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__settingsOption___UNa12:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__settingsOption___UNa12.styles-module__selected___OwRqP {
  background: rgba(60, 130, 247, 0.15);
  color: #3c82f7;
}

.styles-module__sliderContainer___ducXj {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.styles-module__slider___GLdxp {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}
.styles-module__slider___GLdxp::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.styles-module__slider___GLdxp:hover::-webkit-slider-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}
.styles-module__slider___GLdxp:hover::-moz-range-thumb {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
}

.styles-module__sliderLabels___FhLDB {
  display: flex;
  justify-content: space-between;
}

.styles-module__sliderLabel___U8sPr {
  font-size: 0.625rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease;
}
.styles-module__sliderLabel___U8sPr:hover {
  color: rgba(255, 255, 255, 0.7);
}
.styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(255, 255, 255, 0.9);
}

.styles-module__colorOptions___iHCNX {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.375rem;
  margin-bottom: 1px;
}

.styles-module__colorOption___IodiY {
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
}
.styles-module__colorOption___IodiY:hover {
  transform: scale(1.15);
}
.styles-module__colorOption___IodiY.styles-module__selected___OwRqP {
  transform: scale(0.83);
}

.styles-module__colorOptionRing___U2xpo {
  display: flex;
  width: 24px;
  height: 24px;
  border: 2px solid transparent;
  border-radius: 50%;
  transition: border-color 0.3s ease;
}
.styles-module__settingsToggle___fBrFn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.styles-module__settingsToggle___fBrFn + .styles-module__settingsToggle___fBrFn {
  margin-top: calc(0.5rem + 6px);
}
.styles-module__settingsToggle___fBrFn input[type=checkbox] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__settingsToggle___fBrFn.styles-module__settingsToggleMarginBottom___MZUyF {
  margin-bottom: calc(0.5rem + 6px);
}

.styles-module__customCheckbox___U39ax {
  position: relative;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.25s ease, border-color 0.25s ease;
}
.styles-module__customCheckbox___U39ax svg {
  color: #1a1a1a;
  opacity: 1;
  transition: opacity 0.15s ease;
}
input[type=checkbox]:checked + .styles-module__customCheckbox___U39ax {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgb(255, 255, 255);
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__customCheckbox___U39ax.styles-module__light___r6n4Y.styles-module__checked___mnZLo svg {
  color: #fff;
}

.styles-module__toggleLabel___Xm8Aa {
  font-size: 0.8125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: -0.0094em;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}
.styles-module__toggleLabel___Xm8Aa.styles-module__light___r6n4Y {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__toggleSwitch___l4Ygm {
  position: relative;
  display: inline-block;
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
}
.styles-module__toggleSwitch___l4Ygm input {
  opacity: 0;
  width: 0;
  height: 0;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn {
  background: #3c82f7;
}
.styles-module__toggleSwitch___l4Ygm input:checked + .styles-module__toggleSlider___wprIn::before {
  transform: translateX(8px);
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw {
  opacity: 0.4;
  pointer-events: none;
}
.styles-module__toggleSwitch___l4Ygm.styles-module__disabled___332Jw .styles-module__toggleSlider___wprIn {
  cursor: not-allowed;
}

.styles-module__toggleSlider___wprIn {
  position: absolute;
  cursor: pointer;
  inset: 0;
  border-radius: 16px;
  background: #484848;
}
.styles-module__light___r6n4Y .styles-module__toggleSlider___wprIn {
  background: #dddddd;
}
.styles-module__toggleSlider___wprIn::before {
  content: "";
  position: absolute;
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

@keyframes styles-module__mcpPulse___uNggr {
  0% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(52, 199, 89, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(52, 199, 89, 0);
  }
}
@keyframes styles-module__mcpPulseError___fov9B {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.5);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(255, 59, 48, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
  }
}
.styles-module__mcpStatusDot___ibgkc {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connecting___uo-CW {
  background: #f5a623;
  animation: styles-module__mcpPulse___uNggr 1.5s infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__connected___7c28g {
  background: #34c759;
  animation: styles-module__mcpPulse___uNggr 2.5s ease-in-out infinite;
}
.styles-module__mcpStatusDot___ibgkc.styles-module__disconnected___cHPxR {
  background: #ff3b30;
  animation: styles-module__mcpPulseError___fov9B 2s infinite;
}

.styles-module__helpIcon___xQg56 {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  margin-left: 0;
}
.styles-module__helpIcon___xQg56 svg {
  display: block;
  transform: translateY(1px);
  color: rgba(255, 255, 255, 0.2);
  transition: color 0.15s ease;
}
.styles-module__helpIcon___xQg56:hover svg {
  color: rgba(255, 255, 255, 0.5);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudgeDown___0cqpM svg {
  transform: translateY(1px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNoNudge___abogC svg {
  transform: translateY(0.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge1-5___DM2TQ svg {
  transform: translateY(1.5px);
}
.styles-module__helpIcon___xQg56.styles-module__helpIconNudge2___TfWgC svg {
  transform: translateY(2px);
}

.styles-module__dragSelection___kZLq2 {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.6);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.08);
  pointer-events: none;
  z-index: 99997;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__dragCount___KM90j {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #34c759;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.styles-module__highlightsContainer___-0xzG {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 99996;
}

.styles-module__selectedElementHighlight___fyVlI {
  position: fixed;
  top: 0;
  left: 0;
  border: 2px solid rgba(52, 199, 89, 0.5);
  border-radius: 4px;
  background: rgba(52, 199, 89, 0.06);
  pointer-events: none;
  will-change: transform, width, height;
  contain: layout style;
}

.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__toolbarContainer___dIhma.styles-module__collapsed___Rydsn:hover {
  background: #f5f5f5;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc:hover:not(:disabled):not([data-active=true]):not([data-failed=true]):not([data-auto-sync=true]):not([data-error=true]):not([data-no-hover=true]) {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-active=true] {
  color: #3c82f7;
  background: rgba(60, 130, 247, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-error=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-danger]:hover:not(:disabled):not([data-active=true]):not([data-failed=true]) {
  background: rgba(255, 59, 48, 0.15);
  color: #ff3b30;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-auto-sync=true] {
  color: #34c759;
  background: transparent;
}
.styles-module__light___r6n4Y.styles-module__controlButton___8Q0jc[data-failed=true] {
  color: #ff3b30;
  background: rgba(255, 59, 48, 0.15);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9 {
  background: #fff;
  color: rgba(0, 0, 0, 0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__buttonTooltip___Burd9::after {
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__divider___c--s1 {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID {
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerQuote___FHmrz {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerNote___QkrrS {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__markerTooltip___aLJID .styles-module__markerHint___2iF-6 {
  color: rgba(0, 0, 0, 0.35);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::before {
  background: linear-gradient(to right, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y::after {
  background: linear-gradient(to left, #fff 0%, transparent 100%);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsHeader___pwDY9 {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrand___0gJeM {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsBrandSlash___uTG18 {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsVersion___TUcFq {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsSection___m-YM2 {
  border-top-color: rgba(0, 0, 0, 0.08);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__settingsLabel___8UjfX {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleButton___FMKfw {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY {
  background: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__cycleDot___nPgLY.styles-module__active___-zoN6 {
  background: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz {
  color: rgba(0, 0, 0, 0.85);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__dropdownButton___16NPz:hover {
  background: rgba(0, 0, 0, 0.05);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__toggleLabel___Xm8Aa {
  color: rgba(0, 0, 0, 0.5);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax {
  border: 1px solid rgba(0, 0, 0, 0.15);
  background: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo {
  border-color: #1a1a1a;
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__customCheckbox___U39ax.styles-module__checked___mnZLo svg {
  color: #fff;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr:hover {
  color: rgba(0, 0, 0, 0.7);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__sliderLabel___U8sPr.styles-module__active___-zoN6 {
  color: rgba(0, 0, 0, 0.9);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp {
  background: rgba(0, 0, 0, 0.1);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-webkit-slider-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__slider___GLdxp::-moz-range-thumb {
  background: #1a1a1a;
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56 svg {
  color: rgba(0, 0, 0, 0.2);
}
.styles-module__light___r6n4Y.styles-module__settingsPanel___OxX3Y .styles-module__helpIcon___xQg56:hover svg {
  color: rgba(0, 0, 0, 0.5);
}

.styles-module__themeToggle___2rUjA {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin-left: 0.5rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.styles-module__themeToggle___2rUjA:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA {
  color: rgba(0, 0, 0, 0.4);
}
.styles-module__light___r6n4Y .styles-module__themeToggle___2rUjA:hover {
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.7);
}

.styles-module__themeIconWrapper___LsJIM {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 20px;
  height: 20px;
}

.styles-module__themeIcon___lCCmo {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: styles-module__themeIconIn___TU6ML 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes styles-module__themeIconIn___TU6ML {
  0% {
    opacity: 0;
    transform: scale(0.8) rotate(-30deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}`;if(typeof document<"u"){let a=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");a||(a=document.createElement("style"),a.id="feedback-tool-styles-page-toolbar-css-styles",a.textContent=ib,document.head.appendChild(a))}const ob="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='56'%20y='70'%20width='220'%20height='220'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='72'%20width='192'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='320'%20y='104'%20width='144'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='156'%20width='192'%20height='116'%20rx='22'%20fill='%23E7E5E4'/%3e%3cpath%20d='M142%20120H214'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20150H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20180H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",sb="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='72'%20y='84'%20width='196'%20height='196'%20rx='26'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='92'%20width='188'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='300'%20y='124'%20width='140'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='176'%20width='188'%20height='96'%20rx='18'%20fill='%23E7E5E4'/%3e%3ccircle%20cx='170'%20cy='182'%20r='46'%20fill='%23D6D3D1'/%3e%3cpath%20d='M148%20182H192'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3c/svg%3e",ub="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='60'%20y='64'%20width='440'%20height='96'%20rx='24'%20fill='%23E7E5E4'/%3e%3crect%20x='60'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='290'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='92'%20y='96'%20width='160'%20height='12'%20rx='6'%20fill='%23D6D3D1'/%3e%3crect%20x='92'%20y='118'%20width='120'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3cpath%20d='M328%20248H460'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",rb="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='80'%20y='68'%20width='400'%20height='224'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='120'%20y='110'%20width='160'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='134'%20width='220'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3crect%20x='120'%20y='200'%20width='140'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='224'%20width='200'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3ccircle%20cx='392'%20cy='196'%20r='32'%20fill='%23D6D3D1'/%3e%3cpath%20d='M372%20196H412'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",cb="/assets/profile-photo-bUVT8ljA.png",Fo="max(300px, 32vw)",fb=[{id:"row-featured",height:Fo,items:[{cardId:"preview-shot-9",span:2},{cardId:"preview-shot-16",span:2},{cardId:"preview-popparazi-v1",span:1,fit:"contain",mediaMaxHeight:"84%"}]},{id:"row-2",height:Fo,items:[{cardId:"preview-shot-14",span:1},{cardId:"preview-protector",span:2},{cardId:"preview-shot-20",span:1}]},{id:"row-3",height:Fo,items:[{cardId:"preview-shot-21",span:1},{cardId:"preview-shot-1",span:1},{cardId:"preview-shot-15",span:1}]},{id:"row-4",height:Fo,items:[{cardId:"preview-shot-19",span:1},{cardId:"preview-shot-22",span:1},{cardId:"preview-shot-23",span:1}]}],Nm={name:"Rafael Medina",title:"Product Designer, Freelance",intro:"Hey I'm Rafael, a product designer and maker based in Miami. For over 10 years, I've helped teams design products that balance clarity, visual craft, and practical outcomes.",previouslyLabel:"Previously",previouslyText:"Product designer for SaaS teams and startup builders.",nowLabel:"Now",nowText:"Freelancing, experimenting with AI workflows, and building design systems.",availability:"Available for work",contactLabel:"Get in touch",contactHref:"mailto:hey@rafaelmedina.me",photo:cb},Sa={dribbble:"https://dribbble.com/rafaelmedina",x:"https://x.com/rafaelmedian",telegram:"https://t.me/rafaelmedian",github:"https://github.com/rafaelmedina",linkedin:"https://www.linkedin.com/in/rafaelmedina",email:"hey@rafaelmedina.me"},db=[{id:"preview-shot-9",kind:"preview",category:"Preview",title:"Matcha - Multiwallet flow",summary:"",detail:"",image:"/Projects/shot-small-9.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.74,homePlacement:"featured-phone"},{id:"preview-shot-14",kind:"preview",category:"Preview",title:"Matcha - Mobile Screens",summary:"",detail:"",image:"/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:1},{id:"preview-shot-20",kind:"preview",category:"Preview",title:"Matcha - Security Audit",summary:"",detail:"",image:"/Projects/shot-small-20.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:10},{id:"preview-shot-16",kind:"preview",category:"Preview",title:"Matcha - Homepage",summary:"",detail:"",image:"/Projects/shot-small-16.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.8,masonrySpan:"sm",homePlacement:"featured-wide"},{id:"preview-protector",kind:"preview",category:"Preview",title:"Protector",summary:"",detail:"",image:"/Projects/protector.png",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:1354/1025,homeOrder:3},{id:"preview-popparazi-v1",kind:"preview",category:"Preview",title:"Popparazi V1",summary:"",detail:"",image:"/Projects/popparazi_v1.png",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.46,previewMediaPaddingBlock:"clamp(0.7rem, 1.6vw, 1.4rem)",masonrySpan:"sm",homePlacement:"featured-poster"},{id:"preview-shot-21",kind:"preview",category:"Preview",title:"Matcha - Token Page",summary:"",detail:"",image:"/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:4/3,homeOrder:8},{id:"preview-shot-1",kind:"preview",category:"Preview",title:"Matcha Trade Page",summary:"",detail:"",image:"/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:5},{id:"preview-shot-15",kind:"preview",category:"Preview",title:"Matcha - Mobile navigation",summary:"",detail:"",image:"/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:6},{id:"preview-shot-19",kind:"preview",category:"Preview",title:"Matcha Trade module",summary:"",detail:"",image:"/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:4},{id:"preview-shot-22",kind:"preview",category:"Preview",title:"Matcha Dark mode",summary:"",detail:"",image:"/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:7},{id:"preview-shot-23",kind:"preview",category:"Preview",title:"Matcha Pro",summary:"",detail:"",image:"/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,homeOrder:9},{id:"widget-music",kind:"info",category:"Widget",title:"Music Player",summary:"A focused listening mix for design sessions.",detail:"Ambient and electronic tracks for deep work and prototyping.",image:"",ctaLabel:"Spotify Embed",ctaHref:"https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator",ctaExternal:!0},{id:"widget-map",kind:"info",category:"Widget",title:"Map",summary:"Current location and nearby context.",detail:"Map snapshot centered on Miami, FL.",image:"",ctaLabel:"Open in Maps",ctaHref:"https://maps.google.com/?q=Miami,FL",ctaExternal:!0},{id:"info-cv",kind:"info",category:"CV",title:"Curriculum Vitae",summary:"Experience, projects, and selected work history.",detail:"A concise overview of product design roles, outcomes, and capabilities.",image:ob,ctaLabel:"Open LinkedIn",ctaHref:Sa.linkedin,ctaExternal:!0},{id:"info-about",kind:"info",category:"About",title:"About",summary:"Product designer focused on clarity, systems, and practical craft.",detail:"I design dependable experiences with clean hierarchy and thoughtful interaction.",image:ub,ctaLabel:"About Profile",ctaHref:Sa.linkedin,ctaExternal:!0},{id:"info-notes",kind:"info",category:"Notes",title:"Design Notes",summary:"Short notes on process, interaction ideas, and UI experiments.",detail:"A running collection of observations, rationale, and implementation details.",image:sb,ctaLabel:"View GitHub",ctaHref:Sa.github,ctaExternal:!0},{id:"info-social",kind:"info",category:"Social",title:"Basic Social Links",summary:"Email, GitHub, and LinkedIn for quick contact.",detail:"Reach out by email or connect via GitHub and LinkedIn.",image:rb,ctaLabel:"Open LinkedIn",ctaHref:Sa.linkedin,ctaExternal:!0}];function p0(){return typeof window<"u"}function _b(){try{const a="production"}catch{}return"production"}function g0(){return(p0()?window.vam:_b())||"production"}function jm(){return g0()==="production"}function mb(){return g0()==="development"}function pb(a,{[a]:o,...u}){return u}function gb(a,o){if(!a)return;let u=a;const r=[];for(const[c,d]of Object.entries(a))typeof d=="object"&&d!==null&&(o.strip?u=pb(c,u):r.push(c));if(r.length>0&&!o.strip)throw Error(`The following properties are not valid: ${r.join(", ")}. Only strings, numbers, booleans, and null are allowed.`);return u}function hb(a,o,u){var r,c;if(!p0()){const d="[Vercel Web Analytics] Please import `track` from `@vercel/analytics/server` when using this function in a server environment";if(jm())console.warn(d);else throw new Error(d);return}if(!o){(r=window.va)==null||r.call(window,"event",{name:a,options:u});return}try{const d=gb(o,{strip:jm()});(c=window.va)==null||c.call(window,"event",{name:a,data:d,options:u})}catch(d){d instanceof Error&&mb()&&console.error(d)}}const yb=void 0,bb=void 0;function h0(){return typeof window<"u"&&typeof document<"u"}function pc(){return h0()&&!!yb}function gc(){return!!bb}function vb(){return h0()&&(pc()||gc())}function xb(){return{page_title:document.title,page_location:window.location.href,page_path:`${window.location.pathname}${window.location.search}${window.location.hash}`}}function y0(a,o={}){!pc()||!window.gtag||window.gtag("event",a,o)}function bs(a,o={}){y0(a,o),gc()&&hb(a,o)}function ac(){y0("page_view",xb())}function Sb(a){const o=a.target;if(!(o instanceof Element))return;const u=o.closest("a");if(!(u instanceof HTMLAnchorElement))return;const r=u.getAttribute("href");if(!r)return;const c=u.href||r,d=r.startsWith("mailto:"),g=u.hasAttribute("download"),h=r.startsWith("#"),m=!c.startsWith(window.location.origin)&&!d&&!h;if(!d&&!g&&!m)return;const E=u.textContent?.trim().replace(/\s+/g," ").slice(0,120)||void 0;bs("click",{link_type:d?"mailto":g?"download":"outbound",link_url:c,link_text:E})}function wb(){window.addEventListener("popstate",ac),window.addEventListener("hashchange",ac),document.addEventListener("click",Sb)}function Eb(){!vb()||window.__analyticsStarted||(wb(),pc()&&ac(),window.__analyticsStarted=!0)}function vs(a,...o){const u=new URL("https://base-ui.com/production-error");return u.searchParams.set("code",a.toString()),o.forEach(r=>u.searchParams.append("args[]",r)),`Base UI error #${a}; visit ${u} for the full message.`}const b0=w.createContext(void 0);function Aa(a){const o=w.useContext(b0);if(a===!1&&o===void 0)throw new Error(vs(27));return o}const Dm={};function ol(a,o){const u=w.useRef(Dm);return u.current===Dm&&(u.current=a(o)),u}function cs(a,o,u,r){const c=ol(v0).current;return Cb(c,a,o,u,r)&&x0(c,[a,o,u,r]),c.callback}function Tb(a){const o=ol(v0).current;return Ab(o,a)&&x0(o,a),o.callback}function v0(){return{callback:null,cleanup:null,refs:[]}}function Cb(a,o,u,r,c){return a.refs[0]!==o||a.refs[1]!==u||a.refs[2]!==r||a.refs[3]!==c}function Ab(a,o){return a.refs.length!==o.length||a.refs.some((u,r)=>u!==o[r])}function x0(a,o){if(a.refs=o,o.every(u=>u==null)){a.callback=null;return}a.callback=u=>{if(a.cleanup&&(a.cleanup(),a.cleanup=null),u!=null){const r=Array(o.length).fill(null);for(let c=0;c<o.length;c+=1){const d=o[c];if(d!=null)switch(typeof d){case"function":{const g=d(u);typeof g=="function"&&(r[c]=g);break}case"object":{d.current=u;break}}}a.cleanup=()=>{for(let c=0;c<o.length;c+=1){const d=o[c];if(d!=null)switch(typeof d){case"function":{const g=r[c];typeof g=="function"?g():d(null);break}case"object":{d.current=null;break}}}}}}}const Ob=parseInt(w.version,10);function hc(a){return Ob>=a}function km(a){if(!w.isValidElement(a))return null;const o=a,u=o.props;return(hc(19)?u?.ref:o.ref)??null}function ic(a,o){if(a&&!o)return a;if(!a&&o)return o;if(a||o)return{...a,...o}}function Rb(a,o){const u={};for(const r in a){const c=a[r];if(o?.hasOwnProperty(r)){const d=o[r](c);d!=null&&Object.assign(u,d);continue}c===!0?u[`data-${r.toLowerCase()}`]="":c&&(u[`data-${r.toLowerCase()}`]=c.toString())}return u}function zb(a,o){return typeof a=="function"?a(o):a}function Mb(a,o){return typeof a=="function"?a(o):a}const Ei={};function Nb(a,o,u,r,c){let d={...oc(a,Ei)};return o&&(d=S0(d,o)),d}function jb(a){if(a.length===0)return Ei;if(a.length===1)return oc(a[0],Ei);let o={...oc(a[0],Ei)};for(let u=1;u<a.length;u+=1)o=S0(o,a[u]);return o}function S0(a,o){return w0(o)?o(a):Db(a,o)}function Db(a,o){if(!o)return a;for(const u in o){const r=o[u];switch(u){case"style":{a[u]=ic(a.style,r);break}case"className":{a[u]=E0(a.className,r);break}default:kb(u,r)?a[u]=Yb(a[u],r):a[u]=r}}return a}function kb(a,o){const u=a.charCodeAt(0),r=a.charCodeAt(1),c=a.charCodeAt(2);return u===111&&r===110&&c>=65&&c<=90&&(typeof o=="function"||typeof o>"u")}function w0(a){return typeof a=="function"}function oc(a,o){return w0(a)?a(o):a??Ei}function Yb(a,o){return o?a?u=>{if(Lb(u)){const c=u;Ub(c);const d=o(c);return c.baseUIHandlerPrevented||a?.(c),d}const r=o(u);return a?.(u),r}:o:a}function Ub(a){return a.preventBaseUIHandler=()=>{a.baseUIHandlerPrevented=!0},a}function E0(a,o){return o?a?o+" "+a:o:a}function Lb(a){return a!=null&&typeof a=="object"&&"nativeEvent"in a}function T0(){}const Wt=Object.freeze({}),Bb="data-base-ui-click-trigger",Hb={clipPath:"inset(50%)",position:"fixed",top:0,left:0};function zi(a,o,u={}){const r=o.render,c=qb(o,u);if(u.enabled===!1)return null;const d=u.state??Wt;return Xb(a,r,c,d)}function qb(a,o={}){const{className:u,style:r,render:c}=a,{state:d=Wt,ref:g,props:h,stateAttributesMapping:p,enabled:m=!0}=o,E=m?zb(u,d):void 0,S=m?Mb(r,d):void 0,N=m?Rb(d,p):Wt,C=m?ic(N,Array.isArray(h)?jb(h):h)??Wt:Wt;return typeof document<"u"&&(m?Array.isArray(g)?C.ref=Tb([C.ref,km(c),...g]):C.ref=cs(C.ref,km(c),g):cs(null,null)),m?(E!==void 0&&(C.className=E0(C.className,E)),S!==void 0&&(C.style=ic(C.style,S)),C):Wt}function Xb(a,o,u,r){if(o){if(typeof o=="function")return o(u,r);const c=Nb(u,o.props);return c.ref=u.ref,w.cloneElement(o,c)}if(a&&typeof a=="string")return Gb(a,u);throw new Error(vs(8))}function Gb(a,o){return a==="button"?w.createElement("button",{type:"button",...o,key:o.key}):a==="img"?w.createElement("img",{alt:"",...o,key:o.key}):w.createElement(a,o)}let Oi=(function(a){return a.startingStyle="data-starting-style",a.endingStyle="data-ending-style",a})({});const Qb={[Oi.startingStyle]:""},Vb={[Oi.endingStyle]:""},C0={transitionStatus(a){return a==="starting"?Qb:a==="ending"?Vb:null}};let Ol=(function(a){return a.open="data-open",a.closed="data-closed",a[a.startingStyle=Oi.startingStyle]="startingStyle",a[a.endingStyle=Oi.endingStyle]="endingStyle",a.anchorHidden="data-anchor-hidden",a})({});const Zb={[Ol.open]:""},Kb={[Ol.closed]:""},Jb={[Ol.anchorHidden]:""},A0={open(a){return a?Zb:Kb},anchorHidden(a){return a?Jb:null}},Wb={...A0,...C0},Fb=w.forwardRef(function(o,u){const{render:r,className:c,forceRender:d=!1,...g}=o,{store:h}=Aa(),p=h.useState("open"),m=h.useState("nested"),E=h.useState("mounted"),S=h.useState("transitionStatus"),N=w.useMemo(()=>({open:p,transitionStatus:S}),[p,S]);return zi("div",o,{state:N,ref:[h.context.backdropRef,u],stateAttributesMapping:Wb,props:[{role:"presentation",hidden:!E,style:{userSelect:"none",WebkitUserSelect:"none"}},g],enabled:d||!m})});function xs(){return typeof window<"u"}function Ss(a){return yc(a)?(a.nodeName||"").toLowerCase():"#document"}function un(a){var o;return(a==null||(o=a.ownerDocument)==null?void 0:o.defaultView)||window}function Ib(a){var o;return(o=(yc(a)?a.ownerDocument:a.document)||window.document)==null?void 0:o.documentElement}function yc(a){return xs()?a instanceof Node||a instanceof un(a).Node:!1}function Cl(a){return xs()?a instanceof Element||a instanceof un(a).Element:!1}function nl(a){return xs()?a instanceof HTMLElement||a instanceof un(a).HTMLElement:!1}function sc(a){return!xs()||typeof ShadowRoot>"u"?!1:a instanceof ShadowRoot||a instanceof un(a).ShadowRoot}const Pb=new Set(["inline","contents"]);function ws(a){const{overflow:o,overflowX:u,overflowY:r,display:c}=bc(a);return/auto|scroll|overlay|hidden|clip/.test(o+r+u)&&!Pb.has(c)}function $b(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const ev=new Set(["html","body","#document"]);function ss(a){return ev.has(Ss(a))}function bc(a){return un(a).getComputedStyle(a)}function O0(a){if(Ss(a)==="html")return a;const o=a.assignedSlot||a.parentNode||sc(a)&&a.host||Ib(a);return sc(o)?o.host:o}function R0(a){const o=O0(a);return ss(o)?a.ownerDocument?a.ownerDocument.body:a.body:nl(o)&&ws(o)?o:R0(o)}function Ti(a,o,u){var r;o===void 0&&(o=[]),u===void 0&&(u=!0);const c=R0(a),d=c===((r=a.ownerDocument)==null?void 0:r.body),g=un(c);if(d){const h=tv(g);return o.concat(g,g.visualViewport||[],ws(c)?c:[],h&&u?Ti(h):[])}return o.concat(c,Ti(c,[],u))}function tv(a){return a.parent&&Object.getPrototypeOf(a.parent)?a.frameElement:null}const Zr=u0[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0,-3)],nv=Zr&&Zr!==w.useLayoutEffect?Zr:a=>a();function Ue(a){const o=ol(lv).current;return o.next=a,nv(o.effect),o.trampoline}function lv(){const a={next:void 0,callback:av,trampoline:(...o)=>a.callback?.(...o),effect:()=>{a.callback=a.next}};return a}function av(){}const iv=()=>{},pt=typeof document<"u"?w.useLayoutEffect:iv,ov="none",Ym="trigger-press",sv="trigger-hover",z0="outside-press",M0="focus-out",uv="escape-key",rv="imperative-action";function ll(a,o,u,r){let c=!1,d=!1;const g=Wt;return{reason:a,event:o??new Event("base-ui"),cancel(){c=!0},allowPropagation(){d=!0},get isCanceled(){return c},get isPropagationAllowed(){return d},trigger:u,...g}}const cv={...u0};let Um=0;function fv(a,o="mui"){const[u,r]=w.useState(a),c=a||u;return w.useEffect(()=>{u==null&&(Um+=1,r(`${o}-${Um}`))},[u,o]),c}const Lm=cv.useId;function Es(a,o){if(Lm!==void 0){const u=Lm();return a??(o?`${o}-${u}`:u)}return fv(a,o)}function N0(a){return Es(a,"base-ui")}const dv=w.forwardRef(function(o,u){const{render:r,className:c,id:d,...g}=o,{store:h}=Aa(),p=N0(d);return h.useSyncedValueWithCleanup("descriptionElementId",p),zi("p",o,{ref:u,props:[{id:p},g]})}),_v=[];function j0(a){w.useEffect(a,_v)}const wi=0;class Ta{static create(){return new Ta}currentId=wi;start(o,u){this.clear(),this.currentId=setTimeout(()=>{this.currentId=wi,u()},o)}isStarted(){return this.currentId!==wi}clear=()=>{this.currentId!==wi&&(clearTimeout(this.currentId),this.currentId=wi)};disposeEffect=()=>this.clear}function fs(){const a=ol(Ta.create).current;return j0(a.disposeEffect),a}function Io(a){const o=ol(mv,a).current;return o.next=a,pt(o.effect),o}function mv(a){const o={current:a,next:a,effect:()=>{o.current=o.next}};return o}const Oa=typeof navigator<"u",Kr=yv(),D0=vv(),k0=bv(),pv=typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter:none"),Y0=Kr.platform==="MacIntel"&&Kr.maxTouchPoints>1?!0:/iP(hone|ad|od)|iOS/.test(Kr.platform),gv=Oa&&/apple/i.test(navigator.vendor),uc=Oa&&/android/i.test(D0)||/android/i.test(k0);Oa&&D0.toLowerCase().startsWith("mac")&&navigator.maxTouchPoints;const hv=k0.includes("jsdom/");function yv(){if(!Oa)return{platform:"",maxTouchPoints:-1};const a=navigator.userAgentData;return a?.platform?{platform:a.platform,maxTouchPoints:navigator.maxTouchPoints}:{platform:navigator.platform??"",maxTouchPoints:navigator.maxTouchPoints??-1}}function bv(){if(!Oa)return"";const a=navigator.userAgentData;return a&&Array.isArray(a.brands)?a.brands.map(({brand:o,version:u})=>`${o}/${u}`).join(" "):navigator.userAgent}function vv(){if(!Oa)return"";const a=navigator.userAgentData;return a?.platform?a.platform:navigator.platform??""}const rc="data-base-ui-focusable",U0="active",L0="selected",xv="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function ya(a){let o=a.activeElement;for(;o?.shadowRoot?.activeElement!=null;)o=o.shadowRoot.activeElement;return o}function at(a,o){if(!a||!o)return!1;const u=o.getRootNode?.();if(a.contains(o))return!0;if(u&&sc(u)){let r=o;for(;r;){if(a===r)return!0;r=r.parentNode||r.host}}return!1}function en(a){return"composedPath"in a?a.composedPath()[0]:a.target}function $t(a,o){if(o==null)return!1;if("composedPath"in a)return a.composedPath().includes(o);const u=a;return u.target!=null&&o.contains(u.target)}function Sv(a){return a.matches("html,body")}function Ot(a){return a?.ownerDocument||document}function wv(a){return nl(a)&&a.matches(xv)}function Bm(a){return a?a.getAttribute("role")==="combobox"&&wv(a):!1}function cc(a){return a?a.hasAttribute(rc)?a:a.querySelector(`[${rc}]`)||a:null}function wa(a,o,u=!0){return a.filter(c=>c.parentId===o&&(!u||c.context?.open)).flatMap(c=>[c,...wa(a,c.id,u)])}function Hm(a,o){let u=[],r=a.find(c=>c.id===o)?.parentId;for(;r;){const c=a.find(d=>d.id===r);r=c?.parentId,c&&(u=u.concat(c))}return u}function Ev(a){a.preventDefault(),a.stopPropagation()}function Tv(a){return"nativeEvent"in a}function Cv(a){return a.mozInputSource===0&&a.isTrusted?!0:uc&&a.pointerType?a.type==="click"&&a.buttons===1:a.detail===0&&!a.pointerType}function Av(a){return hv?!1:!uc&&a.width===0&&a.height===0||uc&&a.width===1&&a.height===1&&a.pressure===0&&a.detail===0&&a.pointerType==="mouse"||a.width<1&&a.height<1&&a.pressure===0&&a.detail===0&&a.pointerType==="touch"}function Ov(a){const o=a.type;return o==="click"||o==="mousedown"||o==="keydown"||o==="keyup"}var Rv=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],ds=Rv.join(","),B0=typeof Element>"u",Ca=B0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,_s=!B0&&Element.prototype.getRootNode?function(a){var o;return a==null||(o=a.getRootNode)===null||o===void 0?void 0:o.call(a)}:function(a){return a?.ownerDocument},ms=function(o,u){var r;u===void 0&&(u=!0);var c=o==null||(r=o.getAttribute)===null||r===void 0?void 0:r.call(o,"inert"),d=c===""||c==="true",g=d||u&&o&&(typeof o.closest=="function"?o.closest("[inert]"):ms(o.parentNode));return g},zv=function(o){var u,r=o==null||(u=o.getAttribute)===null||u===void 0?void 0:u.call(o,"contenteditable");return r===""||r==="true"},H0=function(o,u,r){if(ms(o))return[];var c=Array.prototype.slice.apply(o.querySelectorAll(ds));return u&&Ca.call(o,ds)&&c.unshift(o),c=c.filter(r),c},ps=function(o,u,r){for(var c=[],d=Array.from(o);d.length;){var g=d.shift();if(!ms(g,!1))if(g.tagName==="SLOT"){var h=g.assignedElements(),p=h.length?h:g.children,m=ps(p,!0,r);r.flatten?c.push.apply(c,m):c.push({scopeParent:g,candidates:m})}else{var E=Ca.call(g,ds);E&&r.filter(g)&&(u||!o.includes(g))&&c.push(g);var S=g.shadowRoot||typeof r.getShadowRoot=="function"&&r.getShadowRoot(g),N=!ms(S,!1)&&(!r.shadowRootFilter||r.shadowRootFilter(g));if(S&&N){var C=ps(S===!0?g.children:S.children,!0,r);r.flatten?c.push.apply(c,C):c.push({scopeParent:g,candidates:C})}else d.unshift.apply(d,g.children)}}return c},q0=function(o){return!isNaN(parseInt(o.getAttribute("tabindex"),10))},X0=function(o){if(!o)throw new Error("No node provided");return o.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(o.tagName)||zv(o))&&!q0(o)?0:o.tabIndex},Mv=function(o,u){var r=X0(o);return r<0&&u&&!q0(o)?0:r},Nv=function(o,u){return o.tabIndex===u.tabIndex?o.documentOrder-u.documentOrder:o.tabIndex-u.tabIndex},G0=function(o){return o.tagName==="INPUT"},jv=function(o){return G0(o)&&o.type==="hidden"},Dv=function(o){var u=o.tagName==="DETAILS"&&Array.prototype.slice.apply(o.children).some(function(r){return r.tagName==="SUMMARY"});return u},kv=function(o,u){for(var r=0;r<o.length;r++)if(o[r].checked&&o[r].form===u)return o[r]},Yv=function(o){if(!o.name)return!0;var u=o.form||_s(o),r=function(h){return u.querySelectorAll('input[type="radio"][name="'+h+'"]')},c;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")c=r(window.CSS.escape(o.name));else try{c=r(o.name)}catch(g){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",g.message),!1}var d=kv(c,o.form);return!d||d===o},Uv=function(o){return G0(o)&&o.type==="radio"},Lv=function(o){return Uv(o)&&!Yv(o)},Bv=function(o){var u,r=o&&_s(o),c=(u=r)===null||u===void 0?void 0:u.host,d=!1;if(r&&r!==o){var g,h,p;for(d=!!((g=c)!==null&&g!==void 0&&(h=g.ownerDocument)!==null&&h!==void 0&&h.contains(c)||o!=null&&(p=o.ownerDocument)!==null&&p!==void 0&&p.contains(o));!d&&c;){var m,E,S;r=_s(c),c=(m=r)===null||m===void 0?void 0:m.host,d=!!((E=c)!==null&&E!==void 0&&(S=E.ownerDocument)!==null&&S!==void 0&&S.contains(c))}}return d},qm=function(o){var u=o.getBoundingClientRect(),r=u.width,c=u.height;return r===0&&c===0},Hv=function(o,u){var r=u.displayCheck,c=u.getShadowRoot;if(r==="full-native"&&"checkVisibility"in o){var d=o.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!d}if(getComputedStyle(o).visibility==="hidden")return!0;var g=Ca.call(o,"details>summary:first-of-type"),h=g?o.parentElement:o;if(Ca.call(h,"details:not([open]) *"))return!0;if(!r||r==="full"||r==="full-native"||r==="legacy-full"){if(typeof c=="function"){for(var p=o;o;){var m=o.parentElement,E=_s(o);if(m&&!m.shadowRoot&&c(m)===!0)return qm(o);o.assignedSlot?o=o.assignedSlot:!m&&E!==o.ownerDocument?o=E.host:o=m}o=p}if(Bv(o))return!o.getClientRects().length;if(r!=="legacy-full")return!0}else if(r==="non-zero-area")return qm(o);return!1},qv=function(o){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(o.tagName))for(var u=o.parentElement;u;){if(u.tagName==="FIELDSET"&&u.disabled){for(var r=0;r<u.children.length;r++){var c=u.children.item(r);if(c.tagName==="LEGEND")return Ca.call(u,"fieldset[disabled] *")?!0:!c.contains(o)}return!0}u=u.parentElement}return!1},fc=function(o,u){return!(u.disabled||jv(u)||Hv(u,o)||Dv(u)||qv(u))},dc=function(o,u){return!(Lv(u)||X0(u)<0||!fc(o,u))},Xv=function(o){var u=parseInt(o.getAttribute("tabindex"),10);return!!(isNaN(u)||u>=0)},Q0=function(o){var u=[],r=[];return o.forEach(function(c,d){var g=!!c.scopeParent,h=g?c.scopeParent:c,p=Mv(h,g),m=g?Q0(c.candidates):h;p===0?g?u.push.apply(u,m):u.push(h):r.push({documentOrder:d,tabIndex:p,item:c,isScope:g,content:m})}),r.sort(Nv).reduce(function(c,d){return d.isScope?c.push.apply(c,d.content):c.push(d.content),c},[]).concat(u)},Ts=function(o,u){u=u||{};var r;return u.getShadowRoot?r=ps([o],u.includeContainer,{filter:dc.bind(null,u),flatten:!1,getShadowRoot:u.getShadowRoot,shadowRootFilter:Xv}):r=H0(o,u.includeContainer,dc.bind(null,u)),Q0(r)},Gv=function(o,u){u=u||{};var r;return u.getShadowRoot?r=ps([o],u.includeContainer,{filter:fc.bind(null,u),flatten:!0,getShadowRoot:u.getShadowRoot}):r=H0(o,u.includeContainer,fc.bind(null,u)),r},V0=function(o,u){if(u=u||{},!o)throw new Error("No node provided");return Ca.call(o,ds)===!1?!1:dc(u,o)};const Mi=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function Z0(a,o){const u=Ts(a,Mi()),r=u.length;if(r===0)return;const c=ya(Ot(a)),d=u.indexOf(c),g=d===-1?o===1?0:r-1:d+o;return u[g]}function K0(a){return Z0(Ot(a).body,1)||a}function J0(a){return Z0(Ot(a).body,-1)||a}function Ci(a,o){const u=o||a.currentTarget,r=a.relatedTarget;return!r||!at(u,r)}function Qv(a){Ts(a,Mi()).forEach(u=>{u.dataset.tabindex=u.getAttribute("tabindex")||"",u.setAttribute("tabindex","-1")})}function Xm(a){a.querySelectorAll("[data-tabindex]").forEach(u=>{const r=u.dataset.tabindex;delete u.dataset.tabindex,r?u.setAttribute("tabindex",r):u.removeAttribute("tabindex")})}function Vv(){const a=new Map;return{emit(o,u){a.get(o)?.forEach(r=>r(u))},on(o,u){a.has(o)||a.set(o,new Set),a.get(o).add(u)},off(o,u){a.get(o)?.delete(u)}}}const Zv=w.createContext(null),Kv=w.createContext(null),W0=()=>w.useContext(Zv)?.id||null,F0=a=>{const o=w.useContext(Kv);return a??o};function gs(a){return`data-base-ui-${a}`}const Jv={clipPath:"inset(50%)",overflow:"hidden",whiteSpace:"nowrap",border:0,padding:0,width:1,height:1,margin:-1},I0={...Jv,position:"fixed",top:0,left:0},Po=null;class Wv{callbacks=[];callbacksCount=0;nextId=1;startId=1;isScheduled=!1;tick=o=>{this.isScheduled=!1;const u=this.callbacks,r=this.callbacksCount;if(this.callbacks=[],this.callbacksCount=0,this.startId=this.nextId,r>0)for(let c=0;c<u.length;c+=1)u[c]?.(o)};request(o){const u=this.nextId;return this.nextId+=1,this.callbacks.push(o),this.callbacksCount+=1,!this.isScheduled&&(requestAnimationFrame(this.tick),this.isScheduled=!0),u}cancel(o){const u=o-this.startId;u<0||u>=this.callbacks.length||(this.callbacks[u]=null,this.callbacksCount-=1)}}const $o=new Wv;class sn{static create(){return new sn}static request(o){return $o.request(o)}static cancel(o){return $o.cancel(o)}currentId=Po;request(o){this.cancel(),this.currentId=$o.request(()=>{this.currentId=Po,o()})}cancel=()=>{this.currentId!==Po&&($o.cancel(this.currentId),this.currentId=Po)};disposeEffect=()=>this.cancel}function P0(){const a=ol(sn.create).current;return j0(a.disposeEffect),a}function Ni(a){return a?.ownerDocument||document}const hs=w.forwardRef(function(o,u){const[r,c]=w.useState();pt(()=>{gv&&c("button")},[]);const d={tabIndex:0,role:r};return y.jsx("span",{...o,ref:u,style:I0,"aria-hidden":r?void 0:!0,...d,"data-base-ui-focus-guard":""})});let Gm=0;function Jr(a,o={}){const{preventScroll:u=!1,cancelPrevious:r=!0,sync:c=!1}=o;r&&cancelAnimationFrame(Gm);const d=()=>a?.focus({preventScroll:u});c?d():Gm=requestAnimationFrame(d)}const Ea={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function Qm(a){return a==="inert"?Ea.inert:a==="aria-hidden"?Ea["aria-hidden"]:Ea.none}let es=new WeakSet,ts={},Wr=0;const $0=a=>a&&(a.host||$0(a.parentNode)),Fv=(a,o)=>o.map(u=>{if(a.contains(u))return u;const r=$0(u);return a.contains(r)?r:null}).filter(u=>u!=null);function Iv(a,o,u,r){const c="data-base-ui-inert",d=r?"inert":u?"aria-hidden":null,g=Fv(o,a),h=new Set,p=new Set(g),m=[];ts[c]||(ts[c]=new WeakMap);const E=ts[c];g.forEach(S),N(o),h.clear();function S(C){!C||h.has(C)||(h.add(C),C.parentNode&&S(C.parentNode))}function N(C){!C||p.has(C)||[].forEach.call(C.children,A=>{if(Ss(A)!=="script")if(h.has(A))N(A);else{const U=d?A.getAttribute(d):null,j=U!==null&&U!=="false",H=Qm(d),J=(H.get(A)||0)+1,Z=(E.get(A)||0)+1;H.set(A,J),E.set(A,Z),m.push(A),J===1&&j&&es.add(A),Z===1&&A.setAttribute(c,""),!j&&d&&A.setAttribute(d,d==="inert"?"":"true")}})}return Wr+=1,()=>{m.forEach(C=>{const A=Qm(d),j=(A.get(C)||0)-1,H=(E.get(C)||0)-1;A.set(C,j),E.set(C,H),j||(!es.has(C)&&d&&C.removeAttribute(d),es.delete(C)),H||C.removeAttribute(c)}),Wr-=1,Wr||(Ea.inert=new WeakMap,Ea["aria-hidden"]=new WeakMap,Ea.none=new WeakMap,es=new WeakSet,ts={})}}function Pv(a,o=!1,u=!1){const r=Ot(a[0]).body;return Iv(a.concat(Array.from(r.querySelectorAll("[aria-live]"))),r,o,u)}const ep=w.createContext(null),tp=()=>w.useContext(ep),$v=gs("portal");function e1(a={}){const{ref:o,container:u,componentProps:r=Wt,elementProps:c,elementState:d}=a,g=Es(),p=tp()?.portalNode,[m,E]=w.useState(null),[S,N]=w.useState(null),C=Ue(H=>{H!==null&&N(H)}),A=w.useRef(null);pt(()=>{if(u===null){A.current&&(A.current=null,N(null),E(null));return}if(g==null)return;const H=(u&&(yc(u)?u:u.current))??p??document.body;if(H==null){A.current&&(A.current=null,N(null),E(null));return}A.current!==H&&(A.current=H,N(null),E(H))},[u,p,g]);const U=zi("div",r,{ref:[o,C],state:d,props:[{id:g,[$v]:""},c]});return{portalNode:S,portalSubtree:m&&U?mc.createPortal(U,m):null}}const t1=w.forwardRef(function(o,u){const{children:r,container:c,className:d,render:g,renderGuards:h,...p}=o,{portalNode:m,portalSubtree:E}=e1({container:c,ref:u,componentProps:o,elementProps:p}),S=w.useRef(null),N=w.useRef(null),C=w.useRef(null),A=w.useRef(null),[U,j]=w.useState(null),H=U?.modal,J=U?.open,Z=typeof h=="boolean"?h:!!U&&!U.modal&&U.open&&!!m;w.useEffect(()=>{if(!m||H)return;function te(P){m&&P.relatedTarget&&Ci(P)&&(P.type==="focusin"?Xm:Qv)(m)}return m.addEventListener("focusin",te,!0),m.addEventListener("focusout",te,!0),()=>{m.removeEventListener("focusin",te,!0),m.removeEventListener("focusout",te,!0)}},[m,H]),w.useEffect(()=>{!m||J||Xm(m)},[J,m]);const ae=w.useMemo(()=>({beforeOutsideRef:S,afterOutsideRef:N,beforeInsideRef:C,afterInsideRef:A,portalNode:m,setFocusManagerState:j}),[m]);return y.jsxs(w.Fragment,{children:[E,y.jsxs(ep.Provider,{value:ae,children:[Z&&m&&y.jsx(hs,{"data-type":"outside",ref:S,onFocus:te=>{if(Ci(te,m))C.current?.focus();else{const P=U?U.domReference:null;J0(P)?.focus()}}}),Z&&m&&y.jsx("span",{"aria-owns":m.id,style:Hb}),m&&mc.createPortal(r,m),Z&&m&&y.jsx(hs,{"data-type":"outside",ref:N,onFocus:te=>{if(Ci(te,m))A.current?.focus();else{const P=U?U.domReference:null;K0(P)?.focus(),U?.closeOnFocusOut&&U?.onOpenChange(!1,ll(M0,te.nativeEvent))}}})]})]})});function An(a){return a==null?a:"current"in a?a.current:a}function n1(a,o){const u=un(a.target);return a instanceof u.KeyboardEvent?"keyboard":a instanceof u.FocusEvent?o||"keyboard":"pointerType"in a?a.pointerType||"keyboard":"touches"in a?"touch":a instanceof u.MouseEvent?o||(a.detail===0?"keyboard":"mouse"):""}const Vm=20;let al=[];function vc(){al=al.filter(a=>a.isConnected)}function l1(a){vc(),a&&Ss(a)!=="body"&&(al.push(a),al.length>Vm&&(al=al.slice(-Vm)))}function Fr(){return vc(),al[al.length-1]}function a1(a){if(!a)return null;const o=Mi();return V0(a,o)?a:Ts(a,o)[0]||a}function i1(a){return!a||!a.isConnected?!1:typeof a.checkVisibility=="function"?a.checkVisibility():bc(a).display!=="none"}function Zm(a,o){if(!o.current.includes("floating")&&!a.getAttribute("role")?.includes("dialog"))return;const u=Mi(),c=Gv(a,u).filter(g=>{const h=g.getAttribute("data-tabindex")||"";return V0(g,u)||g.hasAttribute("data-tabindex")&&!h.startsWith("-")}),d=a.getAttribute("tabindex");o.current.includes("floating")||c.length===0?d!=="0"&&a.setAttribute("tabindex","0"):(d!=="-1"||a.hasAttribute("data-tabindex")&&a.getAttribute("data-tabindex")!=="-1")&&(a.setAttribute("tabindex","-1"),a.setAttribute("data-tabindex","-1"))}function o1(a){const{context:o,children:u,disabled:r=!1,order:c=["content"],initialFocus:d=!0,returnFocus:g=!0,restoreFocus:h=!1,modal:p=!0,closeOnFocusOut:m=!0,openInteractionType:E="",getInsideElements:S=()=>[],nextFocusableElement:N,previousFocusableElement:C,beforeContentFocusGuardRef:A,externalTree:U}=a,j="rootStore"in o?o.rootStore:o,H=j.useState("open"),J=j.useState("domReferenceElement"),Z=j.useState("floatingElement"),{events:ae,dataRef:te}=j.context,P=Ue(()=>te.current.floatingContext?.nodeId),ee=Ue(S),V=d===!1,I=Bm(J)&&V,ie=Io(c),q=Io(d),G=Io(g),oe=Io(E),ue=F0(U),le=tp(),z=w.useRef(null),Q=w.useRef(null),F=w.useRef(!1),ne=w.useRef(!1),me=w.useRef(!1),v=w.useRef(-1),k=w.useRef(""),K=w.useRef(""),W=w.useRef(null),de=w.useRef(null),be=cs(W,A,le?.beforeInsideRef),Ee=cs(de,le?.afterInsideRef),We=fs(),je=fs(),bt=P0(),Rt=le!=null,L=cc(Z),ve=Ue(($=L)=>$?Ts($,Mi()):[]),ce=Ue($=>{const ge=ve($);return ie.current.map(()=>ge).filter(Boolean).flat()});w.useEffect(()=>{if(r||!p)return;function $(we){we.key==="Tab"&&at(L,ya(Ot(L)))&&ve().length===0&&!I&&Ev(we)}const ge=Ot(L);return ge.addEventListener("keydown",$),()=>{ge.removeEventListener("keydown",$)}},[r,J,L,p,ie,I,ve,ce]),w.useEffect(()=>{if(r||!Z)return;function $(ge){const we=en(ge),Ve=ve().indexOf(we);Ve!==-1&&(v.current=Ve)}return Z.addEventListener("focusin",$),()=>{Z.removeEventListener("focusin",$)}},[r,Z,ve]),w.useEffect(()=>{if(r||!H)return;const $=Ot(L);function ge(){me.current=!1}function we(Ve){const he=en(Ve),pe=at(Z,he)||at(J,he)||at(le?.portalNode,he);me.current=!pe,K.current=Ve.pointerType||"keyboard"}function ze(){K.current="keyboard"}return $.addEventListener("pointerdown",we,!0),$.addEventListener("pointerup",ge,!0),$.addEventListener("pointercancel",ge,!0),$.addEventListener("keydown",ze,!0),()=>{$.removeEventListener("pointerdown",we,!0),$.removeEventListener("pointerup",ge,!0),$.removeEventListener("pointercancel",ge,!0),$.removeEventListener("keydown",ze,!0)}},[r,Z,J,L,H,le]),w.useEffect(()=>{if(r||!m)return;function $(){ne.current=!0,je.start(0,()=>{ne.current=!1})}function ge(he){const pe=he.relatedTarget,ht=he.currentTarget,Be=en(he);queueMicrotask(()=>{const On=P(),sl=j.context.triggerElements,Rl=pe?.hasAttribute(gs("focus-guard"))&&[W.current,de.current,le?.beforeInsideRef.current,le?.afterInsideRef.current,le?.beforeOutsideRef.current,le?.afterOutsideRef.current,An(C),An(N)].includes(pe),Rn=!(at(J,pe)||at(Z,pe)||at(pe,Z)||at(le?.portalNode,pe)||pe!=null&&sl.hasElement(pe)||sl.hasMatchingElement(vt=>at(vt,pe))||Rl||ue&&(wa(ue.nodesRef.current,On).find(vt=>at(vt.context?.elements.floating,pe)||at(vt.context?.elements.domReference,pe))||Hm(ue.nodesRef.current,On).find(vt=>[vt.context?.elements.floating,cc(vt.context?.elements.floating)].includes(pe)||vt.context?.elements.domReference===pe)));if(ht===J&&L&&Zm(L,ie),h&&ht!==J&&!i1(Be)&&ya(Ot(L))===Ot(L).body){if(nl(L)&&(L.focus(),h==="popup")){bt.request(()=>{L.focus()});return}const vt=v.current,zn=ve(),zl=zn[vt]||zn[zn.length-1]||L;nl(zl)&&zl.focus()}if(te.current.insideReactTree){te.current.insideReactTree=!1;return}(I||!p)&&pe&&Rn&&!ne.current&&(I||pe!==Fr())&&(F.current=!0,j.setOpen(!1,ll(M0,he)))})}function we(){me.current||(te.current.insideReactTree=!0,We.start(0,()=>{te.current.insideReactTree=!1}))}const ze=nl(J)?J:null,Ve=[];if(!(!Z&&!ze))return ze&&(ze.addEventListener("focusout",ge),ze.addEventListener("pointerdown",$),Ve.push(()=>{ze.removeEventListener("focusout",ge),ze.removeEventListener("pointerdown",$)})),Z&&(Z.addEventListener("focusout",ge),le&&(Z.addEventListener("focusout",we,!0),Ve.push(()=>{Z.removeEventListener("focusout",we,!0)})),Ve.push(()=>{Z.removeEventListener("focusout",ge)})),()=>{Ve.forEach(he=>{he()})}},[r,J,Z,L,p,ue,le,j,m,h,ve,I,P,ie,te,We,je,bt,N,C]),w.useEffect(()=>{if(r||!Z||!H)return;const $=Array.from(le?.portalNode?.querySelectorAll(`[${gs("portal")}]`)||[]),we=(ue?Hm(ue.nodesRef.current,P()):[]).find(he=>Bm(he.context?.elements.domReference||null))?.context?.elements.domReference,ze=[Z,we,...$,...ee(),z.current,Q.current,W.current,de.current,le?.beforeOutsideRef.current,le?.afterOutsideRef.current,An(C),An(N),I?J:null].filter(he=>he!=null),Ve=Pv(ze,p||I);return()=>{Ve()}},[H,r,J,Z,p,ie,le,I,ue,P,ee,N,C]),pt(()=>{if(!H||r||!nl(L))return;const $=Ot(L),ge=ya($);queueMicrotask(()=>{const we=ce(L),ze=q.current,Ve=typeof ze=="function"?ze(oe.current||""):ze;if(Ve===void 0||Ve===!1)return;let he;Ve===!0||Ve===null?he=we[0]||L:he=An(Ve),he=he||we[0]||L,!at(L,ge)&&Jr(he,{preventScroll:he===L})})},[r,H,L,V,ce,q,oe]),pt(()=>{if(r||!L)return;const $=Ot(L),ge=ya($);l1(ge);function we(he){if(he.open||(k.current=n1(he.nativeEvent,K.current)),he.reason===sv&&he.nativeEvent.type==="mouseleave"&&(F.current=!0),he.reason===z0)if(he.nested)F.current=!1;else if(Cv(he.nativeEvent)||Av(he.nativeEvent))F.current=!1;else{let pe=!1;document.createElement("div").focus({get preventScroll(){return pe=!0,!1}}),pe?F.current=!1:F.current=!0}}ae.on("openchange",we);const ze=$.createElement("span");ze.setAttribute("tabindex","-1"),ze.setAttribute("aria-hidden","true"),Object.assign(ze.style,I0),Rt&&J&&J.insertAdjacentElement("afterend",ze);function Ve(){const he=G.current;let pe=typeof he=="function"?he(k.current):he;if(pe===void 0||pe===!1)return null;if(pe===null&&(pe=!0),typeof pe=="boolean"){const Be=J||Fr();return Be&&Be.isConnected?Be:ze}const ht=J||Fr()||ze;return An(pe)||ht}return()=>{ae.off("openchange",we);const he=ya($),pe=at(Z,he)||ue&&wa(ue.nodesRef.current,P(),!1).some(Be=>at(Be.context?.elements.floating,he)),ht=Ve();queueMicrotask(()=>{const Be=a1(ht),On=typeof G.current!="boolean";G.current&&!F.current&&nl(Be)&&(!(!On&&Be!==he&&he!==$.body)||pe)&&Be.focus({preventScroll:!0}),ze.remove()})}},[r,Z,L,G,te,ae,ue,Rt,J,P]),w.useEffect(()=>{queueMicrotask(()=>{F.current=!1})},[r]),w.useEffect(()=>{if(r||!H)return;function $(we){en(we)?.closest(`[${Bb}]`)&&(ne.current=!0)}const ge=Ot(L);return ge.addEventListener("pointerdown",$,!0),()=>{ge.removeEventListener("pointerdown",$,!0)}},[r,H,L]),pt(()=>{if(!r&&le)return le.setFocusManagerState({modal:p,closeOnFocusOut:m,open:H,onOpenChange:j.setOpen,domReference:J}),()=>{le.setFocusManagerState(null)}},[r,le,p,H,j,m,J]),pt(()=>{if(!(r||!L))return Zm(L,ie),()=>{queueMicrotask(vc)}},[r,L,ie]);const it=!r&&(p?!I:!0)&&(Rt||p);return y.jsxs(w.Fragment,{children:[it&&y.jsx(hs,{"data-type":"inside",ref:be,onFocus:$=>{if(p){const ge=ce();Jr(ge[ge.length-1])}else le?.portalNode&&(F.current=!1,Ci($,le.portalNode)?K0(J)?.focus():An(C??le.beforeOutsideRef)?.focus())}}),u,it&&y.jsx(hs,{"data-type":"inside",ref:Ee,onFocus:$=>{p?Jr(ce()[0]):le?.portalNode&&(m&&(F.current=!0),Ci($,le.portalNode)?J0(J)?.focus():An(N??le.afterOutsideRef)?.focus())}})]})}const s1={intentional:"onClick",sloppy:"onPointerDown"};function u1(a){return{escapeKey:typeof a=="boolean"?a:a?.escapeKey??!1,outsidePress:typeof a=="boolean"?a:a?.outsidePress??!0}}function r1(a,o={}){const u="rootStore"in a?a.rootStore:a,r=u.useState("open"),c=u.useState("floatingElement"),d=u.useState("referenceElement"),g=u.useState("domReferenceElement"),{onOpenChange:h,dataRef:p}=u.context,{enabled:m=!0,escapeKey:E=!0,outsidePress:S=!0,outsidePressEvent:N="sloppy",referencePress:C=!1,referencePressEvent:A="sloppy",ancestorScroll:U=!1,bubbles:j,externalTree:H}=o,J=F0(H),Z=Ue(typeof S=="function"?S:()=>!1),ae=typeof S=="function"?Z:S,te=w.useRef(!1),{escapeKey:P,outsidePress:ee}=u1(j),V=w.useRef(null),I=fs(),ie=fs(),q=Ue(()=>{ie.clear(),p.current.insideReactTree=!1}),G=w.useRef(!1),oe=w.useRef(""),ue=Ue(L=>{oe.current=L.pointerType}),le=Ue(()=>{const L=oe.current,ve=L==="pen"||!L?"mouse":L,ce=typeof N=="function"?N():N;return typeof ce=="string"?ce:ce[ve]}),z=Ue(L=>{if(!r||!m||!E||L.key!=="Escape"||G.current)return;const ve=p.current.floatingContext?.nodeId,ce=J?wa(J.nodesRef.current,ve):[];if(!P&&ce.length>0){let ge=!0;if(ce.forEach(we=>{we.context?.open&&!we.context.dataRef.current.__escapeKeyBubbles&&(ge=!1)}),!ge)return}const it=Tv(L)?L.nativeEvent:L,$=ll(uv,it);u.setOpen(!1,$),!P&&!$.isPropagationAllowed&&L.stopPropagation()}),Q=Ue(L=>{const ve=le();return ve==="intentional"&&L.type!=="click"||ve==="sloppy"&&L.type==="click"}),F=Ue(()=>{p.current.insideReactTree=!0,ie.start(0,q)}),ne=Ue((L,ve=!1)=>{if(Q(L)){q();return}if(p.current.insideReactTree){q();return}if(le()==="intentional"&&ve||typeof ae=="function"&&!ae(L))return;const ce=en(L),it=`[${gs("inert")}]`,$=Ot(u.select("floatingElement")).querySelectorAll(it),ge=u.context.triggerElements;if(ce&&(ge.hasElement(ce)||ge.hasMatchingElement(pe=>at(pe,ce))))return;let we=Cl(ce)?ce:null;for(;we&&!ss(we);){const pe=O0(we);if(ss(pe)||!Cl(pe))break;we=pe}if($.length&&Cl(ce)&&!Sv(ce)&&!at(ce,u.select("floatingElement"))&&Array.from($).every(pe=>!at(we,pe)))return;if(nl(ce)&&!("touches"in L)){const pe=ss(ce),ht=bc(ce),Be=/auto|scroll/,On=pe||Be.test(ht.overflowX),sl=pe||Be.test(ht.overflowY),Rl=On&&ce.clientWidth>0&&ce.scrollWidth>ce.clientWidth,Rn=sl&&ce.clientHeight>0&&ce.scrollHeight>ce.clientHeight,vt=ht.direction==="rtl",zn=Rn&&(vt?L.offsetX<=ce.offsetWidth-ce.clientWidth:L.offsetX>ce.clientWidth),zl=Rl&&L.offsetY>ce.clientHeight;if(zn||zl)return}const ze=p.current.floatingContext?.nodeId,Ve=J&&wa(J.nodesRef.current,ze).some(pe=>$t(L,pe.context?.elements.floating));if($t(L,u.select("floatingElement"))||$t(L,u.select("domReferenceElement"))||Ve)return;const he=J?wa(J.nodesRef.current,ze):[];if(he.length>0){let pe=!0;if(he.forEach(ht=>{ht.context?.open&&!ht.context.dataRef.current.__outsidePressBubbles&&(pe=!1)}),!pe)return}u.setOpen(!1,ll(z0,L)),q()}),me=Ue(L=>{le()!=="sloppy"||L.pointerType==="touch"||!u.select("open")||!m||$t(L,u.select("floatingElement"))||$t(L,u.select("domReferenceElement"))||ne(L)}),v=Ue(L=>{if(le()!=="sloppy"||!u.select("open")||!m||$t(L,u.select("floatingElement"))||$t(L,u.select("domReferenceElement")))return;const ve=L.touches[0];ve&&(V.current={startTime:Date.now(),startX:ve.clientX,startY:ve.clientY,dismissOnTouchEnd:!1,dismissOnMouseDown:!0},I.start(1e3,()=>{V.current&&(V.current.dismissOnTouchEnd=!1,V.current.dismissOnMouseDown=!1)}))}),k=Ue(L=>{const ve=en(L);function ce(){v(L),ve?.removeEventListener(L.type,ce)}ve?.addEventListener(L.type,ce)}),K=Ue(L=>{const ve=te.current;if(te.current=!1,I.clear(),L.type==="mousedown"&&V.current&&!V.current.dismissOnMouseDown)return;const ce=en(L);function it(){L.type==="pointerdown"?me(L):ne(L,ve),ce?.removeEventListener(L.type,it)}ce?.addEventListener(L.type,it)}),W=Ue(L=>{if(le()!=="sloppy"||!V.current||$t(L,u.select("floatingElement"))||$t(L,u.select("domReferenceElement")))return;const ve=L.touches[0];if(!ve)return;const ce=Math.abs(ve.clientX-V.current.startX),it=Math.abs(ve.clientY-V.current.startY),$=Math.sqrt(ce*ce+it*it);$>5&&(V.current.dismissOnTouchEnd=!0),$>10&&(ne(L),I.clear(),V.current=null)}),de=Ue(L=>{const ve=en(L);function ce(){W(L),ve?.removeEventListener(L.type,ce)}ve?.addEventListener(L.type,ce)}),be=Ue(L=>{le()!=="sloppy"||!V.current||$t(L,u.select("floatingElement"))||$t(L,u.select("domReferenceElement"))||(V.current.dismissOnTouchEnd&&ne(L),I.clear(),V.current=null)}),Ee=Ue(L=>{const ve=en(L);function ce(){be(L),ve?.removeEventListener(L.type,ce)}ve?.addEventListener(L.type,ce)});w.useEffect(()=>{if(!r||!m)return;p.current.__escapeKeyBubbles=P,p.current.__outsidePressBubbles=ee;const L=new Ta;function ve(we){u.setOpen(!1,ll(ov,we))}function ce(){L.clear(),G.current=!0}function it(){L.start($b()?5:0,()=>{G.current=!1})}const $=Ot(c);$.addEventListener("pointerdown",ue,!0),E&&($.addEventListener("keydown",z),$.addEventListener("compositionstart",ce),$.addEventListener("compositionend",it)),ae&&($.addEventListener("click",K,!0),$.addEventListener("pointerdown",K,!0),$.addEventListener("touchstart",k,!0),$.addEventListener("touchmove",de,!0),$.addEventListener("touchend",Ee,!0),$.addEventListener("mousedown",K,!0));let ge=[];return U&&(Cl(g)&&(ge=Ti(g)),Cl(c)&&(ge=ge.concat(Ti(c))),!Cl(d)&&d&&d.contextElement&&(ge=ge.concat(Ti(d.contextElement)))),ge=ge.filter(we=>we!==$.defaultView?.visualViewport),ge.forEach(we=>{we.addEventListener("scroll",ve,{passive:!0})}),()=>{$.removeEventListener("pointerdown",ue,!0),E&&($.removeEventListener("keydown",z),$.removeEventListener("compositionstart",ce),$.removeEventListener("compositionend",it)),ae&&($.removeEventListener("click",K,!0),$.removeEventListener("pointerdown",K,!0),$.removeEventListener("touchstart",k,!0),$.removeEventListener("touchmove",de,!0),$.removeEventListener("touchend",Ee,!0),$.removeEventListener("mousedown",K,!0)),ge.forEach(we=>{we.removeEventListener("scroll",ve)}),L.clear(),te.current=!1}},[p,c,d,g,E,ae,r,h,U,m,P,ee,z,ne,K,me,k,de,Ee,ue,u]),w.useEffect(q,[ae,q]);const We=w.useMemo(()=>({onKeyDown:z,...C&&{[s1[A]]:L=>{u.setOpen(!1,ll(Ym,L.nativeEvent))},...A!=="intentional"&&{onClick(L){u.setOpen(!1,ll(Ym,L.nativeEvent))}}}}),[z,u,C,A]),je=Ue(L=>{const ve=en(L.nativeEvent);!at(u.select("floatingElement"),ve)||L.button!==0||(te.current=!0)}),bt=Ue(L=>{!r||!m||L.button!==0||(te.current=!0)}),Rt=w.useMemo(()=>({onKeyDown:z,onPointerDown:je,onMouseDown:je,onMouseUp:je,onClickCapture:F,onMouseDownCapture(L){F(),bt(L)},onPointerDownCapture(L){F(),bt(L)},onMouseUpCapture:F,onTouchEndCapture:F,onTouchMoveCapture:F}),[z,je,F,bt]);return w.useMemo(()=>m?{reference:We,floating:Rt,trigger:We}:{},[m,We,Rt])}var ys=Symbol("NOT_FOUND");function c1(a,o=`expected a function, instead received ${typeof a}`){if(typeof a!="function")throw new TypeError(o)}function f1(a,o=`expected an object, instead received ${typeof a}`){if(typeof a!="object")throw new TypeError(o)}function d1(a,o="expected all items to be functions, instead received the following types: "){if(!a.every(u=>typeof u=="function")){const u=a.map(r=>typeof r=="function"?`function ${r.name||"unnamed"}()`:typeof r).join(", ");throw new TypeError(`${o}[${u}]`)}}var Km=a=>Array.isArray(a)?a:[a];function _1(a){const o=Array.isArray(a[0])?a[0]:a;return d1(o,"createSelector expects all input-selectors to be functions, but received the following types: "),o}function m1(a,o){const u=[],{length:r}=a;for(let c=0;c<r;c++)u.push(a[c].apply(null,o));return u}function p1(a){let o;return{get(u){return o&&a(o.key,u)?o.value:ys},put(u,r){o={key:u,value:r}},getEntries(){return o?[o]:[]},clear(){o=void 0}}}function g1(a,o){let u=[];function r(h){const p=u.findIndex(m=>o(h,m.key));if(p>-1){const m=u[p];return p>0&&(u.splice(p,1),u.unshift(m)),m.value}return ys}function c(h,p){r(h)===ys&&(u.unshift({key:h,value:p}),u.length>a&&u.pop())}function d(){return u}function g(){u=[]}return{get:r,put:c,getEntries:d,clear:g}}var h1=(a,o)=>a===o;function y1(a){return function(u,r){if(u===null||r===null||u.length!==r.length)return!1;const{length:c}=u;for(let d=0;d<c;d++)if(!a(u[d],r[d]))return!1;return!0}}function b1(a,o){const u=typeof o=="object"?o:{equalityCheck:o},{equalityCheck:r=h1,maxSize:c=1,resultEqualityCheck:d}=u,g=y1(r);let h=0;const p=c<=1?p1(g):g1(c,g);function m(){let E=p.get(arguments);if(E===ys){if(E=a.apply(null,arguments),h++,d){const N=p.getEntries().find(C=>d(C.value,E));N&&(E=N.value,h!==0&&h--)}p.put(arguments,E)}return E}return m.clearCache=()=>{p.clear(),m.resetResultsCount()},m.resultsCount=()=>h,m.resetResultsCount=()=>{h=0},m}var v1=class{constructor(a){this.value=a}deref(){return this.value}},x1=typeof WeakRef<"u"?WeakRef:v1,S1=0,Jm=1;function ns(){return{s:S1,v:void 0,o:null,p:null}}function np(a,o={}){let u=ns();const{resultEqualityCheck:r}=o;let c,d=0;function g(){let h=u;const{length:p}=arguments;for(let S=0,N=p;S<N;S++){const C=arguments[S];if(typeof C=="function"||typeof C=="object"&&C!==null){let A=h.o;A===null&&(h.o=A=new WeakMap);const U=A.get(C);U===void 0?(h=ns(),A.set(C,h)):h=U}else{let A=h.p;A===null&&(h.p=A=new Map);const U=A.get(C);U===void 0?(h=ns(),A.set(C,h)):h=U}}const m=h;let E;if(h.s===Jm)E=h.v;else if(E=a.apply(null,arguments),d++,r){const S=c?.deref?.()??c;S!=null&&r(S,E)&&(E=S,d!==0&&d--),c=typeof E=="object"&&E!==null||typeof E=="function"?new x1(E):E}return m.s=Jm,m.v=E,E}return g.clearCache=()=>{u=ns(),g.resetResultsCount()},g.resultsCount=()=>d,g.resetResultsCount=()=>{d=0},g}function lp(a,...o){const u=typeof a=="function"?{memoize:a,memoizeOptions:o}:a,r=(...c)=>{let d=0,g=0,h,p={},m=c.pop();typeof m=="object"&&(p=m,m=c.pop()),c1(m,`createSelector expects an output function after the inputs, but received: [${typeof m}]`);const E={...u,...p},{memoize:S,memoizeOptions:N=[],argsMemoize:C=np,argsMemoizeOptions:A=[]}=E,U=Km(N),j=Km(A),H=_1(c),J=S(function(){return d++,m.apply(null,arguments)},...U),Z=C(function(){g++;const te=m1(H,arguments);return h=J.apply(null,te),h},...j);return Object.assign(Z,{resultFunc:m,memoizedResultFunc:J,dependencies:H,dependencyRecomputations:()=>g,resetDependencyRecomputations:()=>{g=0},lastResult:()=>h,recomputations:()=>d,resetRecomputations:()=>{d=0},memoize:S,argsMemoize:C})};return Object.assign(r,{withTypes:()=>r}),r}var w1=lp(np),E1=Object.assign((a,o=w1)=>{f1(a,`createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof a}`);const u=Object.keys(a),r=u.map(d=>a[d]);return o(r,(...d)=>d.reduce((g,h,p)=>(g[u[p]]=h,g),{}))},{withTypes:()=>E1});lp({memoize:b1,memoizeOptions:{maxSize:1,equalityCheck:Object.is}});const Le=(a,o,u,r,c,d,...g)=>{if(g.length>0)throw new Error(vs(1));let h;if(a)h=a;else throw new Error("Missing arguments");return h};var Ir={exports:{}},Pr={};var Wm;function T1(){if(Wm)return Pr;Wm=1;var a=Ri();function o(S,N){return S===N&&(S!==0||1/S===1/N)||S!==S&&N!==N}var u=typeof Object.is=="function"?Object.is:o,r=a.useState,c=a.useEffect,d=a.useLayoutEffect,g=a.useDebugValue;function h(S,N){var C=N(),A=r({inst:{value:C,getSnapshot:N}}),U=A[0].inst,j=A[1];return d(function(){U.value=C,U.getSnapshot=N,p(U)&&j({inst:U})},[S,C,N]),c(function(){return p(U)&&j({inst:U}),S(function(){p(U)&&j({inst:U})})},[S]),g(C),C}function p(S){var N=S.getSnapshot;S=S.value;try{var C=N();return!u(S,C)}catch{return!0}}function m(S,N){return N()}var E=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?m:h;return Pr.useSyncExternalStore=a.useSyncExternalStore!==void 0?a.useSyncExternalStore:E,Pr}var Fm;function ap(){return Fm||(Fm=1,Ir.exports=T1()),Ir.exports}var C1=ap(),$r={exports:{}},ec={};var Im;function A1(){if(Im)return ec;Im=1;var a=Ri(),o=ap();function u(m,E){return m===E&&(m!==0||1/m===1/E)||m!==m&&E!==E}var r=typeof Object.is=="function"?Object.is:u,c=o.useSyncExternalStore,d=a.useRef,g=a.useEffect,h=a.useMemo,p=a.useDebugValue;return ec.useSyncExternalStoreWithSelector=function(m,E,S,N,C){var A=d(null);if(A.current===null){var U={hasValue:!1,value:null};A.current=U}else U=A.current;A=h(function(){function H(P){if(!J){if(J=!0,Z=P,P=N(P),C!==void 0&&U.hasValue){var ee=U.value;if(C(ee,P))return ae=ee}return ae=P}if(ee=ae,r(Z,P))return ee;var V=N(P);return C!==void 0&&C(ee,V)?(Z=P,ee):(Z=P,ae=V)}var J=!1,Z,ae,te=S===void 0?null:S;return[function(){return H(E())},te===null?void 0:function(){return H(te())}]},[E,S,N,C]);var j=c(m,A[0],A[1]);return g(function(){U.hasValue=!0,U.value=j},[j]),p(j),j},ec}var Pm;function O1(){return Pm||(Pm=1,$r.exports=A1()),$r.exports}var R1=O1();const z1=hc(19),M1=z1?j1:D1;function N1(a,o,u,r,c){return M1(a,o,u,r,c)}function j1(a,o,u,r,c){const d=w.useCallback(()=>o(a.getSnapshot(),u,r,c),[a,o,u,r,c]);return C1.useSyncExternalStore(a.subscribe,d,d)}function D1(a,o,u,r,c){return R1.useSyncExternalStoreWithSelector(a.subscribe,a.getSnapshot,a.getSnapshot,d=>o(d,u,r,c))}class Ai{constructor(o){this.state=o,this.listeners=new Set,this.updateTick=0}subscribe=o=>(this.listeners.add(o),()=>{this.listeners.delete(o)});getSnapshot=()=>this.state;setState(o){if(this.state===o)return;this.state=o,this.updateTick+=1;const u=this.updateTick;for(const r of this.listeners){if(u!==this.updateTick)return;r(o)}}update(o){for(const u in o)if(!Object.is(this.state[u],o[u])){Ai.prototype.setState.call(this,{...this.state,...o});return}}set(o,u){Object.is(this.state[o],u)||Ai.prototype.setState.call(this,{...this.state,[o]:u})}notifyAll(){const o={...this.state};Ai.prototype.setState.call(this,o)}}class ip extends Ai{constructor(o,u={},r){super(o),this.context=u,this.selectors=r}controlledValues=new Map;useSyncedValue(o,u){w.useDebugValue(o),pt(()=>{this.state[o]!==u&&this.set(o,u)},[o,u])}useSyncedValueWithCleanup(o,u){const r=this;pt(()=>(r.state[o]!==u&&r.set(o,u),()=>{r.set(o,void 0)}),[r,o,u])}useSyncedValues(o){const u=this,r=Object.values(o);pt(()=>{u.update(o)},[u,...r])}useControlledProp(o,u,r){w.useDebugValue(o);const c=this,d=u!==void 0;this.controlledValues.has(o)||(this.controlledValues.set(o,d),!d&&!Object.is(this.state[o],r)&&super.setState({...this.state,[o]:r})),pt(()=>{d&&!Object.is(c.state[o],u)&&super.setState({...c.state,[o]:u})},[c,o,u,r,d])}set(o,u){this.controlledValues.get(o)!==!0&&super.set(o,u)}update(o){const u={...o};for(const r in u)if(Object.hasOwn(u,r)&&this.controlledValues.get(r)===!0){delete u[r];continue}super.update(u)}setState(o){const u={...o};for(const r in u)if(Object.hasOwn(u,r)&&this.controlledValues.get(r)===!0){delete u[r];continue}super.setState({...this.state,...u})}select=(o,u,r,c)=>{const d=this.selectors[o];return d(this.state,u,r,c)};useState=(o,u,r,c)=>{w.useDebugValue(o);const d=this.selectors[o];return N1(this,d,u,r,c)};useContextCallback(o,u){w.useDebugValue(o);const r=Ue(u??T0);this.context[o]=r}useStateSetter(o){const u=w.useRef(void 0);return u.current===void 0&&(u.current=r=>{this.set(o,r)}),u.current}observe(o,u){let r;typeof o=="function"?r=o:r=this.selectors[o];let c=r(this.state);return u(c,c,this),this.subscribe(d=>{const g=r(d);if(!Object.is(c,g)){const h=c;c=g,u(g,h,this)}})}}const k1={open:Le(a=>a.open),domReferenceElement:Le(a=>a.domReferenceElement),referenceElement:Le(a=>a.positionReference??a.referenceElement),floatingElement:Le(a=>a.floatingElement),floatingId:Le(a=>a.floatingId)};class op extends ip{constructor(o){const{nested:u,noEmit:r,onOpenChange:c,triggerElements:d,...g}=o;super({...g,positionReference:g.referenceElement,domReferenceElement:g.referenceElement},{onOpenChange:c,dataRef:{current:{}},events:Vv(),nested:u,noEmit:r,triggerElements:d},k1)}setOpen=(o,u)=>{if((!o||!this.state.open||Ov(u.event))&&(this.context.dataRef.current.openEvent=o?u.event:void 0),!this.context.noEmit){const r={open:o,reason:u.reason,nativeEvent:u.event,nested:this.context.nested,triggerElement:u.trigger};this.context.events.emit("openchange",r)}this.context.onOpenChange?.(o,u)}}function Y1(a,o=!1,u=!1){const[r,c]=w.useState(a&&o?"idle":void 0),[d,g]=w.useState(a);return a&&!d&&(g(!0),c("starting")),!a&&d&&r!=="ending"&&!u&&c("ending"),!a&&!d&&r==="ending"&&c(void 0),pt(()=>{if(!a&&d&&r!=="ending"&&u){const h=sn.request(()=>{c("ending")});return()=>{sn.cancel(h)}}},[a,d,r,u]),pt(()=>{if(!a||o)return;const h=sn.request(()=>{c(void 0)});return()=>{sn.cancel(h)}},[o,a]),pt(()=>{if(!a||!o)return;a&&d&&r!=="idle"&&c("starting");const h=sn.request(()=>{c("idle")});return()=>{sn.cancel(h)}},[o,a,d,c,r]),w.useMemo(()=>({mounted:d,setMounted:g,transitionStatus:r}),[d,r])}function U1(a,o=!1,u=!0){const r=P0();return Ue((c,d=null)=>{r.cancel();function g(){mc.flushSync(c)}const h=An(a);if(h==null)return;const p=h;if(typeof p.getAnimations!="function"||globalThis.BASE_UI_ANIMATIONS_DISABLED)c();else{let S=function(){const C=Oi.startingStyle;if(!p.hasAttribute(C)){r.request(N);return}const A=new MutationObserver(()=>{p.hasAttribute(C)||(A.disconnect(),N())});A.observe(p,{attributes:!0,attributeFilter:[C]}),d?.addEventListener("abort",()=>A.disconnect(),{once:!0})},N=function(){Promise.all(p.getAnimations().map(C=>C.finished)).then(()=>{d?.aborted||g()}).catch(()=>{const C=p.getAnimations();if(u){if(d?.aborted)return;g()}else C.length>0&&C.some(A=>A.pending||A.playState!=="finished")&&N()})};var m=S,E=N;if(o){S();return}r.request(N)}})}function sp(a){const{enabled:o=!0,open:u,ref:r,onComplete:c}=a,d=Ue(c),g=U1(r,u,!1);w.useEffect(()=>{if(!o)return;const h=new AbortController;return g(d,h.signal),()=>{h.abort()}},[o,u,d,g])}function L1(a){const o=a.useState("open");pt(()=>{if(o&&!a.select("activeTriggerId")&&a.context.triggerElements.size===1){const u=a.context.triggerElements.entries().next();if(!u.done){const[r,c]=u.value;a.update({activeTriggerId:r,activeTriggerElement:c})}}},[o,a])}function B1(a,o,u){const{mounted:r,setMounted:c,transitionStatus:d}=Y1(a);o.useSyncedValues({mounted:r,transitionStatus:d});const g=Ue(()=>{c(!1),o.update({activeTriggerId:null,activeTriggerElement:null,mounted:!1}),u?.(),o.context.onOpenChangeComplete?.(!1)}),h=o.useState("preventUnmountingOnClose");return sp({enabled:!h,open:a,ref:o.context.popupRef,onComplete(){a||g()}}),{forceUnmount:g,transitionStatus:d}}class up{constructor(){this.elements=new Set,this.idMap=new Map}add(o,u){const r=this.idMap.get(o);r!==u&&(r!==void 0&&this.elements.delete(r),this.elements.add(u),this.idMap.set(o,u))}delete(o){const u=this.idMap.get(o);u&&(this.elements.delete(u),this.idMap.delete(o))}hasElement(o){return this.elements.has(o)}hasMatchingElement(o){for(const u of this.elements)if(o(u))return!0;return!1}getById(o){return this.idMap.get(o)}entries(){return this.idMap.entries()}get size(){return this.idMap.size}}function H1(){return new op({open:!1,floatingElement:null,referenceElement:null,triggerElements:new up,floatingId:"",nested:!1,noEmit:!1,onOpenChange:void 0})}function q1(){return{open:!1,mounted:!1,transitionStatus:"idle",floatingRootContext:H1(),preventUnmountingOnClose:!1,payload:void 0,activeTriggerId:null,activeTriggerElement:null,popupElement:null,positionerElement:null,activeTriggerProps:Wt,inactiveTriggerProps:Wt,popupProps:Wt}}const X1={open:Le(a=>a.open),mounted:Le(a=>a.mounted),transitionStatus:Le(a=>a.transitionStatus),floatingRootContext:Le(a=>a.floatingRootContext),preventUnmountingOnClose:Le(a=>a.preventUnmountingOnClose),payload:Le(a=>a.payload),activeTriggerId:Le(a=>a.activeTriggerId),activeTriggerElement:Le(a=>a.mounted?a.activeTriggerElement:null),isTriggerActive:Le((a,o)=>o!==void 0&&a.activeTriggerId===o),isOpenedByTrigger:Le((a,o)=>o!==void 0&&a.activeTriggerId===o&&a.open),isMountedByTrigger:Le((a,o)=>o!==void 0&&a.activeTriggerId===o&&a.mounted),triggerProps:Le((a,o)=>o?a.activeTriggerProps:a.inactiveTriggerProps),popupProps:Le(a=>a.popupProps),popupElement:Le(a=>a.popupElement),positionerElement:Le(a=>a.positionerElement)};function G1(a){const{popupStore:o,noEmit:u=!1,treatPopupAsFloatingElement:r=!1,onOpenChange:c}=a,d=Es(),g=W0()!=null,h=o.useState("open"),p=o.useState("activeTriggerElement"),m=o.useState(r?"popupElement":"positionerElement"),E=o.context.triggerElements,S=ol(()=>new op({open:h,referenceElement:p,floatingElement:m,triggerElements:E,onOpenChange:c,floatingId:d,nested:g,noEmit:u})).current;return pt(()=>{const N={open:h,floatingId:d,referenceElement:p,floatingElement:m};Cl(p)&&(N.domReferenceElement=p),S.state.positionReference===S.state.referenceElement&&(N.positionReference=p),S.update(N)},[h,d,p,m,S]),S.context.onOpenChange=c,S.context.nested=g,S.context.noEmit=u,S}function Q1(a=[]){const o=a.map(m=>m?.reference),u=a.map(m=>m?.floating),r=a.map(m=>m?.item),c=a.map(m=>m?.trigger),d=w.useCallback(m=>ls(m,a,"reference"),o),g=w.useCallback(m=>ls(m,a,"floating"),u),h=w.useCallback(m=>ls(m,a,"item"),r),p=w.useCallback(m=>ls(m,a,"trigger"),c);return w.useMemo(()=>({getReferenceProps:d,getFloatingProps:g,getItemProps:h,getTriggerProps:p}),[d,g,h,p])}function ls(a,o,u){const r=new Map,c=u==="item",d={};u==="floating"&&(d.tabIndex=-1,d[rc]="");for(const g in a)c&&a&&(g===U0||g===L0)||(d[g]=a[g]);for(let g=0;g<o.length;g+=1){let h;const p=o[g]?.[u];typeof p=="function"?h=a?p(a):null:h=p,h&&$m(d,h,c,r)}return $m(d,a,c,r),d}function $m(a,o,u,r){for(const c in o){const d=o[c];u&&(c===U0||c===L0)||(c.startsWith("on")?(r.has(c)||r.set(c,[]),typeof d=="function"&&(r.get(c)?.push(d),a[c]=(...g)=>r.get(c)?.map(h=>h(...g)).find(h=>h!==void 0))):a[c]=d)}}const V1=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function Z1(a,o={}){const u="rootStore"in a?a.rootStore:a,r=u.useState("open"),c=u.useState("floatingId"),d=u.useState("domReferenceElement"),g=u.useState("floatingElement"),{enabled:h=!0,role:p="dialog"}=o,m=Es(),E=d?.id||m,S=w.useMemo(()=>cc(g)?.id||c,[g,c]),N=V1.get(p)??p,A=W0()!=null,U=w.useMemo(()=>N==="tooltip"||p==="label"?Wt:{"aria-haspopup":N==="alertdialog"?"dialog":N,"aria-expanded":"false",...N==="listbox"&&{role:"combobox"},...N==="menu"&&A&&{role:"menuitem"},...p==="select"&&{"aria-autocomplete":"none"},...p==="combobox"&&{"aria-autocomplete":"list"}},[N,A,p]),j=w.useMemo(()=>N==="tooltip"||p==="label"?{[`aria-${p==="label"?"labelledby":"describedby"}`]:r?S:void 0}:{...U,"aria-expanded":r?"true":"false","aria-controls":r?S:void 0,...N==="menu"&&{id:E}},[N,S,r,E,p,U]),H=w.useMemo(()=>{const Z={id:S,...N&&{role:N}};return N==="tooltip"||p==="label"?Z:{...Z,...N==="menu"&&{"aria-labelledby":E}}},[N,S,E,p]),J=w.useCallback(({active:Z,selected:ae})=>{const te={role:"option",...Z&&{id:`${S}-fui-option`}};switch(p){case"select":case"combobox":return{...te,"aria-selected":ae}}return{}},[S,p]);return w.useMemo(()=>h?{reference:j,floating:H,item:J,trigger:U}:{},[h,j,H,U,J])}let K1=(function(a){return a.nestedDialogs="--nested-dialogs",a})({}),J1=(function(a){return a[a.open=Ol.open]="open",a[a.closed=Ol.closed]="closed",a[a.startingStyle=Ol.startingStyle]="startingStyle",a[a.endingStyle=Ol.endingStyle]="endingStyle",a.nested="data-nested",a.nestedDialogOpen="data-nested-dialog-open",a})({});const rp=w.createContext(void 0);function W1(){const a=w.useContext(rp);if(a===void 0)throw new Error(vs(26));return a}const cp="ArrowUp",fp="ArrowDown",dp="ArrowLeft",_p="ArrowRight",mp="Home",pp="End",F1=new Set([dp,_p]),I1=new Set([cp,fp]),P1=new Set([...F1,...I1]);[...P1];const $1=new Set([cp,fp,dp,_p,mp,pp]),e2={...A0,...C0,nestedDialogOpen(a){return a?{[J1.nestedDialogOpen]:""}:null}},t2=w.forwardRef(function(o,u){const{className:r,finalFocus:c,initialFocus:d,render:g,...h}=o,{store:p}=Aa(),m=p.useState("descriptionElementId"),E=p.useState("disablePointerDismissal"),S=p.useState("floatingRootContext"),N=p.useState("popupProps"),C=p.useState("modal"),A=p.useState("mounted"),U=p.useState("nested"),j=p.useState("nestedOpenDialogCount"),H=p.useState("open"),J=p.useState("openMethod"),Z=p.useState("titleElementId"),ae=p.useState("transitionStatus"),te=p.useState("role");W1(),sp({open:H,ref:p.context.popupRef,onComplete(){H&&p.context.onOpenChangeComplete?.(!0)}});function P(q){return q==="touch"?p.context.popupRef.current:!0}const ee=d===void 0?P:d,V=j>0,I=w.useMemo(()=>({open:H,nested:U,transitionStatus:ae,nestedDialogOpen:V}),[H,U,ae,V]),ie=zi("div",o,{state:I,props:[N,{"aria-labelledby":Z??void 0,"aria-describedby":m??void 0,role:te,tabIndex:-1,hidden:!A,onKeyDown(q){$1.has(q.key)&&q.stopPropagation()},style:{[K1.nestedDialogs]:j}},h],ref:[u,p.context.popupRef,p.useStateSetter("popupElement")],stateAttributesMapping:e2});return y.jsx(o1,{context:S,openInteractionType:J,disabled:!A,closeOnFocusOut:!E,initialFocus:ee,returnFocus:c,modal:C!==!1,restoreFocus:"popup",children:ie})});function n2(a){return hc(19)?a:a?"true":void 0}const l2=w.forwardRef(function(o,u){const{cutout:r,...c}=o;let d;if(r){const g=r?.getBoundingClientRect();d=`polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${g.left}px ${g.top}px,
      ${g.left}px ${g.bottom}px,
      ${g.right}px ${g.bottom}px,
      ${g.right}px ${g.top}px,
      ${g.left}px ${g.top}px
    )`}return y.jsx("div",{ref:u,role:"presentation","data-base-ui-inert":"",...c,style:{position:"fixed",inset:0,userSelect:"none",WebkitUserSelect:"none",clipPath:d}})}),a2=w.forwardRef(function(o,u){const{keepMounted:r=!1,...c}=o,{store:d}=Aa(),g=d.useState("mounted"),h=d.useState("modal"),p=d.useState("open");return g||r?y.jsx(rp.Provider,{value:r,children:y.jsxs(t1,{ref:u,...c,children:[g&&h===!0&&y.jsx(l2,{ref:d.context.internalBackdropRef,inert:n2(!p)}),o.children]})}):null});let e0={},t0={},n0="";function i2(a){if(typeof document>"u")return!1;const o=Ni(a);return un(o).innerWidth-o.documentElement.clientWidth>0}function o2(a){if(!(typeof CSS<"u"&&CSS.supports&&CSS.supports("scrollbar-gutter","stable"))||typeof document>"u")return!1;const r=Ni(a).documentElement,c={scrollbarGutter:r.style.scrollbarGutter,overflowY:r.style.overflowY};r.style.scrollbarGutter="stable",r.style.overflowY="scroll";const d=r.offsetWidth;r.style.overflowY="hidden";const g=r.offsetWidth;return Object.assign(r.style,c),d===g}function s2(a){const o=Ni(a),u=o.documentElement,r=o.body,c=ws(u)?u:r,d=c.style.overflow;return c.style.overflow="hidden",()=>{c.style.overflow=d}}function u2(a){const o=Ni(a),u=o.documentElement,r=o.body,c=un(u);let d=0,g=0,h=!1;const p=sn.create();if(pv&&(c.visualViewport?.scale??1)!==1)return()=>{};function m(){const N=c.getComputedStyle(u),C=c.getComputedStyle(r),j=(N.scrollbarGutter||"").includes("both-edges")?"stable both-edges":"stable";d=u.scrollTop,g=u.scrollLeft,e0={scrollbarGutter:u.style.scrollbarGutter,overflowY:u.style.overflowY,overflowX:u.style.overflowX},n0=u.style.scrollBehavior,t0={position:r.style.position,height:r.style.height,width:r.style.width,boxSizing:r.style.boxSizing,overflowY:r.style.overflowY,overflowX:r.style.overflowX,scrollBehavior:r.style.scrollBehavior};const H=u.scrollHeight>u.clientHeight,J=u.scrollWidth>u.clientWidth,Z=N.overflowY==="scroll"||C.overflowY==="scroll",ae=N.overflowX==="scroll"||C.overflowX==="scroll",te=Math.max(0,c.innerWidth-r.clientWidth),P=Math.max(0,c.innerHeight-r.clientHeight),ee=parseFloat(C.marginTop)+parseFloat(C.marginBottom),V=parseFloat(C.marginLeft)+parseFloat(C.marginRight),I=ws(u)?u:r;if(h=o2(a),h){u.style.scrollbarGutter=j,I.style.overflowY="hidden",I.style.overflowX="hidden";return}Object.assign(u.style,{scrollbarGutter:j,overflowY:"hidden",overflowX:"hidden"}),(H||Z)&&(u.style.overflowY="scroll"),(J||ae)&&(u.style.overflowX="scroll"),Object.assign(r.style,{position:"relative",height:ee||P?`calc(100dvh - ${ee+P}px)`:"100dvh",width:V||te?`calc(100vw - ${V+te}px)`:"100vw",boxSizing:"border-box",overflow:"hidden",scrollBehavior:"unset"}),r.scrollTop=d,r.scrollLeft=g,u.setAttribute("data-base-ui-scroll-locked",""),u.style.scrollBehavior="unset"}function E(){Object.assign(u.style,e0),Object.assign(r.style,t0),h||(u.scrollTop=d,u.scrollLeft=g,u.removeAttribute("data-base-ui-scroll-locked"),u.style.scrollBehavior=n0)}function S(){E(),p.request(m)}return m(),c.addEventListener("resize",S),()=>{p.cancel(),E(),typeof c.removeEventListener=="function"&&c.removeEventListener("resize",S)}}class r2{lockCount=0;restore=null;timeoutLock=Ta.create();timeoutUnlock=Ta.create();acquire(o){return this.lockCount+=1,this.lockCount===1&&this.restore===null&&this.timeoutLock.start(0,()=>this.lock(o)),this.release}release=()=>{this.lockCount-=1,this.lockCount===0&&this.restore&&this.timeoutUnlock.start(0,this.unlock)};unlock=()=>{this.lockCount===0&&this.restore&&(this.restore?.(),this.restore=null)};lock(o){if(this.lockCount===0||this.restore!==null)return;const r=Ni(o).documentElement,c=un(r).getComputedStyle(r).overflowY;if(c==="hidden"||c==="clip"){this.restore=T0;return}const d=Y0||!i2(o);this.restore=d?s2(o):u2(o)}}const c2=new r2;function f2(a=!0,o=null){pt(()=>{if(a)return c2.acquire(o)},[a,o])}function d2(a){const o=w.useRef(""),u=w.useCallback(c=>{c.defaultPrevented||(o.current=c.pointerType,a(c,c.pointerType))},[a]);return{onClick:w.useCallback(c=>{if(c.detail===0){a(c,"keyboard");return}"pointerType"in c&&a(c,c.pointerType),a(c,o.current),o.current=""},[a]),onPointerDown:u}}function _2(a){const[o,u]=w.useState(null),r=Ue((h,p)=>{a||u(p||(Y0?"touch":""))}),c=w.useCallback(()=>{u(null)},[]),{onClick:d,onPointerDown:g}=d2(r);return w.useMemo(()=>({openMethod:o,reset:c,triggerProps:{onClick:d,onPointerDown:g}}),[o,c,d,g])}function m2(a){const{store:o,parentContext:u,actionsRef:r}=a,c=o.useState("open"),d=o.useState("disablePointerDismissal"),g=o.useState("modal"),h=o.useState("popupElement"),{openMethod:p,triggerProps:m,reset:E}=_2(c);L1(o);const{forceUnmount:S}=B1(c,o,()=>{E()}),N=Ue(ie=>{const q=ll(ie);return q.preventUnmountOnClose=()=>{o.set("preventUnmountingOnClose",!0)},q}),C=w.useCallback(()=>{o.setOpen(!1,N(rv))},[o,N]);w.useImperativeHandle(r,()=>({unmount:S,close:C}),[S,C]);const A=G1({popupStore:o,onOpenChange:o.setOpen,treatPopupAsFloatingElement:!0,noEmit:!0}),[U,j]=w.useState(0),H=U===0,J=Z1(A),Z=r1(A,{outsidePressEvent(){return o.context.internalBackdropRef.current||o.context.backdropRef.current?"intentional":{mouse:g==="trap-focus"?"sloppy":"intentional",touch:"sloppy"}},outsidePress(ie){if("button"in ie&&ie.button!==0||"touches"in ie&&ie.touches.length!==1)return!1;const q=en(ie);if(H&&!d){const G=q;return g&&(o.context.internalBackdropRef.current||o.context.backdropRef.current)?o.context.internalBackdropRef.current===G||o.context.backdropRef.current===G||at(G,h)&&!G?.hasAttribute("data-base-ui-portal"):!0}return!1},escapeKey:H});f2(c&&g===!0,h);const{getReferenceProps:ae,getFloatingProps:te,getTriggerProps:P}=Q1([J,Z]);o.useContextCallback("onNestedDialogOpen",ie=>{j(ie+1)}),o.useContextCallback("onNestedDialogClose",()=>{j(0)}),w.useEffect(()=>(u?.onNestedDialogOpen&&c&&u.onNestedDialogOpen(U),u?.onNestedDialogClose&&!c&&u.onNestedDialogClose(),()=>{u?.onNestedDialogClose&&c&&u.onNestedDialogClose()}),[c,u,U]);const ee=w.useMemo(()=>ae(m),[ae,m]),V=w.useMemo(()=>P(m),[P,m]),I=w.useMemo(()=>te(),[te]);o.useSyncedValues({openMethod:p,activeTriggerProps:ee,inactiveTriggerProps:V,popupProps:I,floatingRootContext:A,nestedOpenDialogCount:U})}const p2={...X1,modal:Le(a=>a.modal),nested:Le(a=>a.nested),nestedOpenDialogCount:Le(a=>a.nestedOpenDialogCount),disablePointerDismissal:Le(a=>a.disablePointerDismissal),openMethod:Le(a=>a.openMethod),descriptionElementId:Le(a=>a.descriptionElementId),titleElementId:Le(a=>a.titleElementId),viewportElement:Le(a=>a.viewportElement),role:Le(a=>a.role)};class g2 extends ip{constructor(o){super(h2(o),{popupRef:w.createRef(),backdropRef:w.createRef(),internalBackdropRef:w.createRef(),triggerElements:new up,onOpenChange:void 0,onOpenChangeComplete:void 0},p2)}setOpen=(o,u)=>{if(u.preventUnmountOnClose=()=>{this.set("preventUnmountingOnClose",!0)},!o&&u.trigger==null&&this.state.activeTriggerId!=null&&(u.trigger=this.state.activeTriggerElement??void 0),this.context.onOpenChange?.(o,u),u.isCanceled)return;const r={open:o,nativeEvent:u.event,reason:u.reason,nested:this.state.nested};this.state.floatingRootContext.context.events?.emit("openchange",r);const c={open:o},d=u.trigger?.id??null;(d||o)&&(c.activeTriggerId=d,c.activeTriggerElement=u.trigger??null),this.update(c)}}function h2(a={}){return{...q1(),modal:!0,disablePointerDismissal:!1,popupElement:null,viewportElement:null,descriptionElementId:void 0,titleElementId:void 0,openMethod:null,nested:!1,nestedOpenDialogCount:0,role:"dialog",...a}}function y2(a){const{children:o,open:u,defaultOpen:r=!1,onOpenChange:c,onOpenChangeComplete:d,disablePointerDismissal:g=!1,modal:h=!0,actionsRef:p,handle:m,triggerId:E,defaultTriggerId:S=null}=a,N=Aa(!0),C=!!N,A=ol(()=>m?.store??new g2({open:u??r,activeTriggerId:E!==void 0?E:S,modal:h,disablePointerDismissal:g,nested:C})).current;A.useControlledProp("open",u,r),A.useControlledProp("activeTriggerId",E,S),A.useSyncedValues({disablePointerDismissal:g,nested:C,modal:h}),A.useContextCallback("onOpenChange",c),A.useContextCallback("onOpenChangeComplete",d);const U=A.useState("payload");m2({store:A,actionsRef:p,parentContext:N?.store.context});const j=w.useMemo(()=>({store:A}),[A]);return y.jsx(b0.Provider,{value:j,children:typeof o=="function"?o({payload:U}):o})}const b2=w.forwardRef(function(o,u){const{render:r,className:c,id:d,...g}=o,{store:h}=Aa(),p=N0(d);return h.useSyncedValueWithCleanup("titleElementId",p),zi("h2",o,{ref:u,props:[{id:p},g]})});const gp=(...a)=>a.filter((o,u,r)=>!!o&&o.trim()!==""&&r.indexOf(o)===u).join(" ").trim();const v2=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();const x2=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(o,u,r)=>r?r.toUpperCase():u.toLowerCase());const l0=a=>{const o=x2(a);return o.charAt(0).toUpperCase()+o.slice(1)};var tc={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const S2=a=>{for(const o in a)if(o.startsWith("aria-")||o==="role"||o==="title")return!0;return!1},w2=w.createContext({}),E2=()=>w.useContext(w2),T2=w.forwardRef(({color:a,size:o,strokeWidth:u,absoluteStrokeWidth:r,className:c="",children:d,iconNode:g,...h},p)=>{const{size:m=24,strokeWidth:E=2,absoluteStrokeWidth:S=!1,color:N="currentColor",className:C=""}=E2()??{},A=r??S?Number(u??E)*24/Number(o??m):u??E;return w.createElement("svg",{ref:p,...tc,width:o??m??tc.width,height:o??m??tc.height,stroke:a??N,strokeWidth:A,className:gp("lucide",C,c),...!d&&!S2(h)&&{"aria-hidden":"true"},...h},[...g.map(([U,j])=>w.createElement(U,j)),...Array.isArray(d)?d:[d]])});const hp=(a,o)=>{const u=w.forwardRef(({className:r,...c},d)=>w.createElement(T2,{ref:d,iconNode:o,className:gp(`lucide-${v2(l0(a))}`,`lucide-${a}`,r),...c}));return u.displayName=l0(a),u};const C2=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],A2=hp("chevron-down",C2);const O2=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],R2=hp("chevron-up",O2),z2={layers:[{source:{type:"sine",frequency:{start:320,end:560}},envelope:{attack:.004,decay:.14,release:.06},filter:{type:"lowpass",frequency:2400,resonance:.6},gain:.22},{source:{type:"triangle",frequency:{start:640,end:1120}},envelope:{attack:.002,decay:.08},gain:.08}]},M2={source:{type:"sine",frequency:{start:520,end:640}},envelope:{attack:.002,decay:.07},filter:{type:"lowpass",frequency:2800},gain:.2},N2={source:{type:"sine",frequency:{start:520,end:400}},envelope:{attack:.002,decay:.07},filter:{type:"lowpass",frequency:2800},gain:.2},j2=190,D2=240;function k2(a){return a.toLowerCase().endsWith(".webm")}function a0(a,o){return o===0?0:(a%o+o)%o}function Y2(a){return a.detail?a.detail:a.summary?a.summary:a.title.includes("Matcha")?"A product interface exploration for Matcha, balancing dense trading information with calm hierarchy and fast decision-making.":a.title.includes("Protector")?"A protection-focused mobile product concept shaped around trust, quick comprehension, and confident action.":a.title.includes("Popparazi")?"A mobile social product exploration with an emphasis on visual rhythm, content density, and playful interaction.":"A selected product design preview focused on clear hierarchy, responsive interaction, and polished interface craft."}function U2(a){return a.title.includes("Matcha")?"Matcha - DEX Aggregator by 0x":a.title.includes("Protector")?"Protector":a.title.includes("Popparazi")?"Popparazi":a.category}function L2(a){return a.title.includes("Matcha")?"DeFi / Web3 / Fintech":a.title.includes("Protector")?"Consumer Safety":a.title.includes("Popparazi")?"Consumer Social":"Product Design"}function B2(a){return a.ctaHref&&a.ctaHref!=="#"?a.ctaHref:a.title.includes("Matcha")?"https://matcha.xyz":a.title.includes("Protector")?"https://protector.so":""}function H2({cards:a,open:o,selectedIndex:u,prefersReducedMotion:r,onOpenChange:c,onSelectedIndexChange:d}){const g=w.useRef(null),h=w.useRef(o),p=w.useRef(null),m=w.useRef(null),E=w.useRef(null),[S,N]=w.useState("idle"),[C,A]=w.useState("down"),U=w.useMemo(()=>a0(u,a.length),[a.length,u]),j=a[U],H=j?Y2(j):"",J=j?B2(j):"",Z=j?[["Product",U2(j)],["Project",j.title],["Industry",L2(j)]]:[],ae=Qr(z2),te=Qr(M2),P=Qr(N2);w.useEffect(()=>{o&&E.current!==null&&(window.clearTimeout(E.current),E.current=null),o&&!h.current&&ae(),h.current=o},[o,ae]),w.useEffect(()=>()=>{p.current!==null&&window.clearTimeout(p.current),m.current!==null&&window.cancelAnimationFrame(m.current),E.current!==null&&window.clearTimeout(E.current)},[]);const ee=w.useCallback(()=>{p.current!==null&&(window.clearTimeout(p.current),p.current=null),m.current!==null&&(window.cancelAnimationFrame(m.current),m.current=null)},[]),V=w.useCallback(oe=>{oe||(ee(),E.current!==null&&window.clearTimeout(E.current),E.current=window.setTimeout(()=>{N("idle"),E.current=null},D2)),c(oe)},[ee,c]),I=w.useCallback(oe=>{if(a.length<=1||S!=="idle")return;oe>0?te():P();const ue=a0(U+oe,a.length),le=oe<0?"up":"down";if(r){d(ue);return}p.current!==null&&window.clearTimeout(p.current),m.current!==null&&window.cancelAnimationFrame(m.current),A(le),N("out"),p.current=window.setTimeout(()=>{d(ue),N("in"),m.current=window.requestAnimationFrame(()=>{m.current=window.requestAnimationFrame(()=>{N("idle"),m.current=null})}),p.current=null},j2)},[a.length,d,P,te,r,U,S]);if(w.useEffect(()=>{if(!o)return;const oe=ue=>{ue.key==="ArrowUp"||ue.key==="ArrowLeft"?(ue.preventDefault(),I(-1)):ue.key==="ArrowDown"||ue.key==="ArrowRight"?(ue.preventDefault(),I(1)):ue.key==="Escape"&&(ue.preventDefault(),V(!1))};return window.addEventListener("keydown",oe,{capture:!0}),()=>window.removeEventListener("keydown",oe,{capture:!0})},[V,I,o]),!j)return null;const ie=k2(j.image),q=j.previewMediaPaddingBlock?{"--preview-gallery-media-padding-block":j.previewMediaPaddingBlock}:void 0,G=S==="idle"?"":` preview-gallery-card-switch-${S}-${C}`;return y.jsx(y2,{open:o,onOpenChange:V,children:y.jsxs(a2,{children:[y.jsx(Fb,{className:"preview-gallery-backdrop"}),y.jsx("div",{className:"preview-gallery-shell",onMouseDown:oe=>{oe.target===oe.currentTarget&&V(!1)},children:y.jsxs(t2,{className:"preview-gallery-popup","data-preview-media":ie?"video":"image","aria-label":`${j.title} gallery preview`,children:[y.jsxs("article",{className:`preview-gallery-card${G}`,children:[y.jsx("div",{className:"preview-gallery-media-frame",style:q,onTouchStart:oe=>{g.current=oe.changedTouches[0]?.clientX??null},onTouchEnd:oe=>{const ue=g.current;if(ue==null)return;const z=(oe.changedTouches[0]?.clientX??ue)-ue;Math.abs(z)>=56&&I(z>0?-1:1),g.current=null},children:ie?y.jsx("video",{src:j.image,muted:!0,loop:!r,autoPlay:!r,playsInline:!0,preload:r?"none":"metadata",controls:!0,"aria-label":j.title,className:"preview-gallery-media"}):y.jsx("img",{src:j.image,alt:j.title,className:"preview-gallery-media",loading:"eager",decoding:"async"})}),y.jsxs("div",{className:"preview-gallery-content",children:[y.jsxs("div",{className:"preview-gallery-heading",children:[y.jsxs("div",{children:[y.jsx(b2,{className:"preview-gallery-title",children:j.title}),y.jsx(dv,{className:"preview-gallery-description",children:H})]}),y.jsxs("span",{className:"preview-gallery-count",children:[U+1," / ",a.length]})]}),y.jsxs("dl",{className:"preview-gallery-details",children:[Z.map(([oe,ue])=>y.jsxs("div",{className:"preview-gallery-detail-row",children:[y.jsx("dt",{children:oe}),y.jsx("dd",{children:ue})]},oe)),J?y.jsxs("div",{className:"preview-gallery-detail-row",children:[y.jsx("dt",{children:"Link"}),y.jsx("dd",{children:y.jsx("a",{href:J,target:"_blank",rel:"noreferrer",children:J.replace(/^https?:\/\//,"")})})]}):null]})]})]}),y.jsxs("div",{className:"preview-gallery-nav-stack",children:[y.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-prev","aria-label":"Previous preview","aria-keyshortcuts":"ArrowUp ArrowLeft",onClick:()=>I(-1),disabled:a.length<=1,children:y.jsx(R2,{"aria-hidden":"true",strokeWidth:2,className:"preview-gallery-nav-icon"})}),y.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-next","aria-label":"Next preview","aria-keyshortcuts":"ArrowDown ArrowRight",onClick:()=>I(1),disabled:a.length<=1,children:y.jsx(A2,{"aria-hidden":"true",strokeWidth:2,className:"preview-gallery-nav-icon"})})]})]})})]})})}function q2(a){const o=a.currentTarget.getBoundingClientRect(),u=o.width===0?0:(a.clientX-o.left)/o.width-.5,r=o.height===0?0:(a.clientY-o.top)/o.height-.5;a.currentTarget.style.setProperty("--mosaic-hover-anchor-x",`${(u*12).toFixed(2)}px`),a.currentTarget.style.setProperty("--mosaic-hover-anchor-y",`${(r*4).toFixed(2)}px`),a.currentTarget.style.setProperty("--mosaic-hover-tilt-x",`${(-r*4).toFixed(2)}deg`),a.currentTarget.style.setProperty("--mosaic-hover-tilt-y",`${(u*8).toFixed(2)}deg`),a.currentTarget.style.setProperty("--mosaic-hover-lift",`${(1+Math.abs(u)*.01).toFixed(3)}`),a.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x",`${(-r*2).toFixed(2)}deg`),a.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y",`${(u*4).toFixed(2)}deg`),a.currentTarget.style.setProperty("--mosaic-hover-chip-lift",`${(1+Math.abs(u)*.006).toFixed(3)}`)}function i0(a){a.currentTarget.style.setProperty("--mosaic-hover-anchor-x","0px"),a.currentTarget.style.setProperty("--mosaic-hover-anchor-y","0px"),a.currentTarget.style.setProperty("--mosaic-hover-tilt-x","0deg"),a.currentTarget.style.setProperty("--mosaic-hover-tilt-y","0deg"),a.currentTarget.style.setProperty("--mosaic-hover-lift","1"),a.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x","0deg"),a.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y","0deg"),a.currentTarget.style.setProperty("--mosaic-hover-chip-lift","1")}function X2({href:a,logoUrls:o,className:u,ariaLabel:r,title:c,children:d}){return y.jsxs("a",{href:a,target:"_blank",rel:"noreferrer",className:u,"aria-label":r,title:c,onPointerMove:q2,onPointerLeave:i0,onPointerCancel:i0,children:[y.jsx("span",{className:"mosaic-company-inline-name",children:d}),y.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:o.map(g=>y.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:y.jsx("img",{src:g,alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})},`${a}-${g}`))})]})}const ba=[{id:"0x",name:"0x.org",compactName:"0x.org",logoUrls:["/logos/0x.png"],href:"https://0x.org",relationship:"recent",role:"Product designer",description:"Designing product surfaces across the 0x ecosystem.",expandedText:"0x.org and Matcha.xyz, shaping trading experiences for one of the clearest DEX products in crypto."},{id:"matcha",name:"Matcha.xyz",compactName:"Matcha.xyz",logoUrls:["/logos/matcha.svg"],href:"https://matcha.xyz",relationship:"recent",role:"Product designer",description:"Shaping trading experiences for one of the clearest DEX products in crypto.",expandedText:"0x.org and Matcha.xyz, shaping trading experiences for one of the clearest DEX products in crypto."},{id:"moodys",name:"Moody's",compactName:"Moody's",logoUrls:["/logos/moodys.png"],href:"https://www.moodys.com",relationship:"previous",role:"Product designer",description:"Designed financial product workflows for data-dense, decision-heavy tools.",expandedText:"Moody's, designed financial product workflows for data-dense, decision-heavy tools."},{id:"twilio",name:"Twilio",compactName:"Twilio",logoUrls:["/logos/twilio.svg"],href:"https://www.twilio.com",relationship:"previous",role:"Product designer",description:"Worked on developer tools and communication platform experiences.",expandedText:"Twilio, rethought developer tools and communication platform experiences."},{id:"onit",name:"Onit",compactName:"Onit",logoUrls:["/logos/onit.png"],href:"https://www.onit.com",relationship:"previous",role:"Product designer",description:"Helped make legal operations software easier to navigate and understand.",expandedText:"Onit, helped make legal operations software easier to navigate and understand."},{id:"chainlink",name:"Chainlink",compactName:"Chainlink",logoUrls:["/logos/chainlink.svg"],href:"https://chain.link",relationship:"previous",role:"Product designer",description:"Contributed to Web3 infrastructure interfaces with a focus on clarity and trust.",expandedText:"Chainlink, contributed to Web3 infrastructure interfaces with a focus on clarity and trust."},{id:"google",name:"Google",compactName:"Google",logoUrls:["/logos/Google_logo.svg"],href:"https://www.google.com",relationship:"additional",role:"Product design collaborator",description:"Worked alongside product teams on focused interface explorations.",expandedText:"Google, worked alongside product teams on focused interface explorations."},{id:"patrol",name:"Protector and Patrol",compactName:"Protector and Patrol",logoUrls:["/logos/protector.svg","/logos/patrol.svg"],href:"https://protector.so/",relationship:"additional",role:"Product design collaborator",description:"Shaped protection-focused mobile product experiences and interface explorations.",expandedText:"Protector and Patrol, shaped protection-focused mobile product experiences and interface explorations."}],Al="recent-0x-matcha",on="more-info",yp=48,bp=190,xc=yp,G2=0,us=["0x.org and Matcha.xyz, shaping trading experiences","for one of the clearest DEX products in crypto."],va=["I've worked in product design since 2015 and now freelance on focused, high-impact projects.","You can reach me at @rafaelmedian or hey@rafaelmedina.me"],Q2={"@rafaelmedian":"https://x.com/rafaelmedian","hey@rafaelmedina.me":"mailto:hey@rafaelmedina.me"},o0={[Al]:{"0x.org":"https://0x.org","Matcha.xyz,":"https://matcha.xyz"},moodys:{"Moody's,":"https://www.moodys.com"},chainlink:{"Chainlink,":"https://chain.link"},twilio:{"Twilio,":"https://www.twilio.com"},onit:{"Onit,":"https://www.onit.com"},google:{"Google,":"https://www.google.com"},patrol:{Protector:"https://protector.so/","Patrol,":"https://patrol.so/"}},V2={[Al]:us,[on]:va,"0x":us,matcha:us,moodys:["Moody's, designed financial product workflows","for data-dense, decision-heavy tools."],twilio:["Twilio, rethought developer tools","and communication platform experiences."],onit:["Onit, helped make legal operations software","easier to navigate and understand."],chainlink:["Chainlink, contributed to Web3 infrastructure interfaces","with a focus on clarity and trust."],google:["Google, worked alongside product teams","on focused interface explorations."],patrol:["Protector and Patrol, shaped protection-focused","mobile product experiences and interface explorations."]};function vp(a){return a?V2[a]??[]:[]}function nc(a){if(!a)return"";const o=vp(a);return o.length>0?o.join(" "):ba.find(u=>u.id===a)?.expandedText??""}function as(){return typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function is(a,o,u){const r=a.slice(0,o).reduce((g,h)=>g+h.split(" ").length,0),c=a[o].split(" "),d=Math.max(0,Math.min(c.length,u-r));return c.slice(0,d)}function xp(a){return bp+Math.max(0,a-1)*xc+G2}function lc(a,o){if(o)return{"--mosaic-collapse-duration":`${xp(a)}ms`,"--mosaic-collapse-logo-delay":`${Math.max(0,a-1)*xc}ms`}}function Z2(a){if(a!==void 0)return{"--mosaic-collapse-word-index":a}}function Sp({variant:a="sentence"}){const o=w.useId(),[u,r]=w.useState([]),[c,d]=w.useState([]),[g,h]=w.useState({}),[p,m]=w.useState({}),E=w.useRef({});w.useEffect(()=>{const C=E.current;return()=>{Object.values(C).forEach(A=>window.clearTimeout(A))}},[]),w.useEffect(()=>{const C=u.filter(j=>!c.includes(j));if(C.length===0||as()||!C.some(j=>{const H=nc(j),J=H.split(" ").length,Z=p[j]??0;return H&&Z>0&&Z<J}))return;const U=window.setTimeout(()=>{m(j=>{let H=!1;const J={...j};return C.forEach(Z=>{const ae=nc(Z),te=ae.split(" ").length,P=J[Z]??0;!ae||P<=0||P>=te||(J[Z]=Math.min(P+1,te),H=!0)}),H?J:j})},yp);return()=>window.clearTimeout(U)},[u,c,p]),w.useEffect(()=>{const C=c.filter(j=>(p[j]??0)>0);if(C.length===0||as())return;const A=C.some(j=>p[j]===g[j]),U=window.setTimeout(()=>{m(j=>{let H=!1;const J={...j};return C.forEach(Z=>{const ae=J[Z]??0;ae<=0||(J[Z]=Math.max(0,ae-1),H=!0)}),H?J:j})},A?bp:xc);return()=>window.clearTimeout(U)},[g,c,p]);const S=C=>{const A=()=>{r(j=>j.filter(H=>H!==C)),d(j=>j.filter(H=>H!==C)),h(j=>{const H={...j};return delete H[C],H}),m(j=>{const H={...j};return delete H[C],H}),delete E.current[C]};if(window.clearTimeout(E.current[C]),as()){A();return}const U=p[C]??1;h(j=>({...j,[C]:U})),d(j=>j.includes(C)?j:[...j,C]),E.current[C]=window.setTimeout(A,xp(p[C]??1))},N=C=>{window.clearTimeout(E.current[C]),delete E.current[C],d(j=>j.filter(H=>H!==C)),h(j=>{const H={...j};return delete H[C],H});const U=nc(C).split(" ").length;m(j=>({...j,[C]:as()?U:1})),r(j=>j.includes(C)?j:[...j,C])};if(a==="profile"){const C=ba.filter(q=>q.relationship==="recent"),U=["moodys","chainlink","twilio","onit","google","patrol"].flatMap(q=>{const G=ba.find(oe=>oe.id===q);return G?[G]:[]}),j=u.includes(Al),H=u.includes(on),J=C[1]??C[0],Z="0x.org and Matcha.xyz",ae=q=>{if(u.includes(q)){S(q);return}N(q)},te=(q,G,{links:oe={},onLinkedWordClick:ue,isCollapsing:le=!1,collapseDelayOffset:z=0}={})=>{const Q=Object.keys(oe).length>0;return y.jsx("span",{className:"mosaic-work-history-chip-copy","aria-hidden":Q?void 0:!0,children:q.map((F,ne)=>{const me=oe[F],v=`mosaic-work-history-inline-word${me?" mosaic-work-history-inline-link":""}`,k=Z2(le?z+q.length-ne-1:void 0),K=y.jsxs(y.Fragment,{children:[F,ne<q.length-1?" ":""]});return me?y.jsx("a",{href:me,target:me.startsWith("mailto:")?void 0:"_blank",rel:"noreferrer",className:v,style:k,onClick:W=>{W.stopPropagation(),ue?.()},children:K},`${G}-${F}-${ne}`):y.jsx("span",{className:v,style:k,children:K},`${G}-${F}-${ne}`)})})},P=(q,G=q.logoUrls)=>G.length===0?null:y.jsx("span",{className:"mosaic-work-history-expanded-logos","aria-hidden":"true",children:G.map(oe=>y.jsx("span",{className:"mosaic-work-history-expanded-logo-wrap",children:y.jsx("img",{src:oe,alt:"",loading:"eager",decoding:"async",className:"mosaic-work-history-expanded-logo"})},`${q.id}-${oe}`))}),ee=(q,G)=>{const oe=q.expandedText.split(" ").slice(0,G);return y.jsxs(y.Fragment,{children:[P(q),te(oe,q.id)]})},V=({company:q,segments:G,buttonId:oe,logoUrls:ue,keyPrefix:le,expansionId:z,links:Q})=>{const F=p[z]??0,ne=c.includes(z),me=g[z]??F,v=G.map((K,W)=>is(G,W,F)),k=G.map((K,W)=>is(G,W,me));return G.map((K,W)=>{const de=v[W],be=k[W],Ee=de.length>0,je=k.slice(W+1).reduce((bt,Rt)=>bt+Rt.length,0)+be.length-de.length;return W>0&&!Ee?null:y.jsxs(w.Fragment,{children:[W>0?y.jsx("span",{className:"mosaic-work-history-expanded-break","aria-hidden":"true"}):null,y.jsxs("span",{id:W===0?oe:void 0,className:`mosaic-work-history-chip mosaic-work-history-chip-expanded mosaic-work-history-chip-expanded-segment mosaic-work-history-chip-expanded-collapsible${W===0?" mosaic-work-history-chip-expanded-segment-primary":""}${ne?" mosaic-work-history-chip-collapsing":""}`,style:lc(me,ne),onClick:()=>S(z),children:[W===0?P(q,ue):null,te(de,`${le}-${W}`,{links:Q,onLinkedWordClick:()=>S(z),isCollapsing:ne,collapseDelayOffset:je})]})]},`${le}-${K}`)})},I=()=>{const q=p[on]??0,G=c.includes(on),oe=g[on]??q,ue=va.map((z,Q)=>is(va,Q,q)),le=va.map((z,Q)=>is(va,Q,oe));return va.map((z,Q)=>{const F=ue[Q],ne=le[Q],me=F.length>0,k=le.slice(Q+1).reduce((K,W)=>K+W.length,0)+ne.length-F.length;return Q>0&&!me?null:y.jsxs(w.Fragment,{children:[Q>0?y.jsx("span",{className:"mosaic-work-history-expanded-break","aria-hidden":"true"}):null,y.jsx("span",{id:Q===0?`${o}-more-info-expanded`:void 0,className:`mosaic-work-history-chip mosaic-work-history-chip-expanded mosaic-work-history-chip-expanded-segment mosaic-work-history-chip-expanded-collapsible mosaic-work-history-chip-expanded-info${G?" mosaic-work-history-chip-collapsing":""}`,style:lc(oe,G),onClick:()=>S(on),children:te(F,`${on}-${Q}`,{links:Q2,onLinkedWordClick:()=>S(on),isCollapsing:G,collapseDelayOffset:k})})]},`${on}-${z}`)})},ie=q=>{const G=u.includes(q.id),oe=`${o}-${q.id}`,ue=vp(q.id);return G&&ue.length>0?V({company:q,segments:ue,buttonId:oe,keyPrefix:q.id,expansionId:q.id,links:o0[q.id]}):y.jsx("button",{id:G?oe:void 0,type:"button",className:`mosaic-work-history-chip${G?" mosaic-work-history-chip-expanded":""}${c.includes(q.id)?" mosaic-work-history-chip-collapsing":""}`,style:lc(g[q.id]??p[q.id]??0,c.includes(q.id)),"aria-label":G?q.expandedText:void 0,"aria-expanded":G,onClick:()=>ae(q.id),children:G?ee(q,p[q.id]??0):q.compactName},q.id)};return y.jsxs("div",{className:"mosaic-work-history","aria-label":"Work history",children:[y.jsxs("div",{className:"mosaic-work-history-line",children:[y.jsx("span",{className:"mosaic-work-history-copy",children:"Recently at"}),j&&J?y.jsx(y.Fragment,{children:V({company:J,segments:us,buttonId:`${o}-recent-expanded`,logoUrls:C.flatMap(q=>q.logoUrls),keyPrefix:Al,expansionId:Al,links:o0[Al]})}):y.jsx("button",{type:"button",className:"mosaic-work-history-chip","aria-label":Z,"aria-expanded":"false",onClick:()=>N(Al),children:Z}),y.jsx("span",{className:"mosaic-work-history-copy",children:"previously worked with and at"})]}),y.jsxs("div",{className:"mosaic-work-history-line","aria-label":"Previous companies",children:[U.map(ie),H?y.jsxs(y.Fragment,{children:[y.jsx("span",{className:"mosaic-work-history-expanded-break","aria-hidden":"true"}),I()]}):null,y.jsx("button",{type:"button",className:"mosaic-work-history-chip mosaic-work-history-chip-more","aria-expanded":H,"aria-controls":H?`${o}-more-info-expanded`:void 0,onClick:()=>ae(on),children:"..."})]})]})}return y.jsx("span",{className:"mosaic-company-inline-list","aria-label":"Companies I have worked with",children:ba.map((C,A)=>y.jsxs("span",{className:"mosaic-company-inline-item",children:[y.jsx(X2,{href:C.href,logoUrls:C.logoUrls,className:"mosaic-company-inline-link",ariaLabel:`${C.name} website`,title:C.name,children:C.name}),A<ba.length-2?", ":A===ba.length-2?", and ":""]},C.name))})}const K2=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",hour12:!0,timeZone:"America/Santo_Domingo",timeZoneName:"short"});function J2(a){return a.toLowerCase().endsWith(".webm")}function W2(a){if(a.id==="preview-shot-20")return"contain";const o=a.previewAspectRatio;return o==null?"cover":o>1.45||o<.82?"contain":"cover"}function s0(a=new Date){return K2.format(a).replace(/\s?([AP])M(?=\s|$)/,(o,u)=>`${u.toLowerCase()}m`)}function F2(a,o,u){bs("work_preview_open",{preview_id:a.id,preview_title:a.title,preview_index:o+1,preview_placement:"grid"}),u(o)}function I2(a){return a.pagination&&a.pagination.total>1?a.pagination.total:0}function P2(a,o){const u=a.pagination?.images??[];return u.length===0?a.image:u[o]??u[o%u.length]??a.image}function $2(a,o,u,r){const c=(o+1)%u;bs("work_preview_paginate",{preview_id:a.id,preview_title:a.title,preview_screen_index:c+1,preview_screen_total:u,preview_placement:"grid"}),r(d=>({...d,[a.id]:((d[a.id]??o)+1)%u}))}function e5({label:a,reducedMotion:o}){const[u,r]=w.useState(a),[c,d]=w.useState(null),[g,h]=w.useState(!1),p=w.useRef(null);w.useEffect(()=>{if(o||a===u)return;p.current!==null&&window.clearTimeout(p.current);const N=window.requestAnimationFrame(()=>{d(a),h(!0),p.current=window.setTimeout(()=>{r(a),d(null),h(!1),p.current=null},240)});return()=>{window.cancelAnimationFrame(N),p.current!==null&&(window.clearTimeout(p.current),p.current=null)}},[u,a,o]);const m=o?a:u,E=o?null:c,S=o?!1:g;return y.jsx("span",{className:`mosaic-live-time ${S?"is-animating":""}`,"aria-live":"polite","aria-atomic":"true",children:y.jsxs("span",{className:"mosaic-live-time-track",children:[y.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-current",children:m}),E?y.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-next",children:E}):null]})})}function t5({links:a}){const o=[{label:"X.com",href:a.x,external:!0},{label:"Telegram",href:a.telegram,external:!0},{label:"Email",href:`mailto:${a.email}`,external:!1}];return y.jsx("nav",{className:"mosaic-social-corner","aria-label":"Social links",children:o.map(u=>y.jsx("a",{href:u.href,target:u.external?"_blank":void 0,rel:u.external?"noreferrer":void 0,className:"mosaic-social-link",onClick:()=>{bs("social_link_click",{social_label:u.label,social_href:u.href,social_placement:"top_corner"})},children:u.label},u.label))})}function n5({cards:a,profile:o,links:u,showProjects:r=!0}){const[c,d]=w.useState(!1),[g,h]=w.useState(null),[p,m]=w.useState(0),[E,S]=w.useState({}),[N,C]=w.useState(()=>s0()),[A,U]=w.useState(()=>new Set),j=V=>U(I=>I.has(V)?I:new Set(I).add(V)),H=w.useMemo(()=>{let V=0;return fb.map(I=>{const ie=I.items.flatMap(q=>{const G=a.find(ue=>ue.id===q.cardId);if(!G)return[];const oe=V++;return[{card:G,span:q.span??1,width:q.width,fit:q.fit??W2(G),mediaMaxHeight:q.mediaMaxHeight,previewIndex:oe}]});return{id:I.id,height:I.height,gap:I.gap,items:ie}})},[a]),J=w.useMemo(()=>H.flatMap(V=>V.items.map(I=>I.card)),[H]),Z=g??Math.min(p,Math.max(J.length-1,0)),ae=V=>{m(V),h(V)},te=`mosaic-shell${r?"":" mosaic-shell-hero-only"}`,P=`mosaic-hero${r?"":" mosaic-hero-hero-only"}`,ee=(V,I=V.image,ie=V.title,q=!1)=>{const G=A.has(I)?"true":"false";return J2(I)?y.jsx("video",{src:I,muted:!0,loop:!c,autoPlay:!c,playsInline:!0,preload:c?"none":"metadata","aria-label":ie,className:"mosaic-row-media","data-loaded":G,onLoadedData:()=>j(I)}):y.jsx("img",{src:I,alt:ie,loading:q?"eager":"lazy",decoding:"async",fetchPriority:q?"high":"auto",className:"mosaic-row-media","data-loaded":G,onLoad:oe=>{oe.currentTarget.naturalWidth>0&&j(I)},ref:oe=>{oe&&oe.complete&&oe.naturalWidth>0&&j(I)}},I)};return w.useEffect(()=>{if(typeof window>"u"||typeof window.matchMedia!="function")return;const V=window.matchMedia("(prefers-reduced-motion: reduce)"),I=()=>d(V.matches);return I(),typeof V.addEventListener=="function"?(V.addEventListener("change",I),()=>V.removeEventListener("change",I)):(V.addListener(I),()=>V.removeListener(I))},[]),w.useEffect(()=>{let V,I;const ie=()=>{C(s0())};return ie(),(()=>{const G=6e4-Date.now()%6e4;I=window.setTimeout(()=>{ie(),V=window.setInterval(ie,6e4)},G)})(),()=>{I&&window.clearTimeout(I),V&&window.clearInterval(V)}},[]),y.jsxs("section",{className:te,children:[y.jsxs("h1",{className:"sr-only",children:[o.name," portfolio"]}),y.jsx(t5,{links:u}),y.jsx("header",{id:"about",className:P,children:y.jsxs("div",{className:"mosaic-hero-profile mosaic-hero-profile-animated",children:[y.jsxs("div",{className:"mosaic-profile-info",children:[y.jsx("div",{className:"mosaic-avatar mosaic-avatar-coin",role:"img","aria-label":`${o.name} portrait`,children:y.jsxs("div",{className:"mosaic-avatar-coin-inner",children:[y.jsx("img",{src:o.photo,alt:"","aria-hidden":"true",className:"mosaic-avatar-face mosaic-avatar-face-front",loading:"eager",decoding:"async"}),y.jsx("img",{src:o.photo,alt:"","aria-hidden":"true",className:"mosaic-avatar-face mosaic-avatar-face-back",loading:"eager",decoding:"async"})]})}),y.jsxs("div",{className:"mosaic-profile-meta",children:[y.jsx("h2",{children:o.name}),y.jsx("p",{className:"mosaic-profile-subtitle",children:o.title})]})]}),y.jsx(Sp,{variant:"profile"}),y.jsxs("p",{className:"mosaic-profile-location",children:["Punta Cana, soon NYC ",y.jsx("span",{"aria-hidden":"true",children:"·"})," Local time:"," ",y.jsx(e5,{label:N,reducedMotion:c})]})]})}),r?y.jsxs(y.Fragment,{children:[y.jsxs("article",{id:"work",className:"mosaic-work",children:[y.jsx("h2",{className:"sr-only",children:"Selected work"}),y.jsx("div",{className:"mosaic-rows","aria-label":"Selected work previews",children:H.map((V,I)=>{const ie={...V.height?{"--row-height":V.height}:{},...V.gap?{"--row-gap":V.gap}:{}},q=I===0;return y.jsx("div",{className:"mosaic-row",style:ie,children:V.items.map(G=>{const oe=`${G.card.id}-${G.previewIndex}`,ue=I2(G.card),le=ue>1,z=le?(E[G.card.id]??0)%ue:0,Q=le?P2(G.card,z):G.card.image,F=le?`${G.card.title} screen ${z+1} of ${ue}`:G.card.title,ne={"--row-span":G.span,...G.width?{flex:`0 0 ${G.width}`}:{},...G.mediaMaxHeight?{"--row-media-max-height":G.mediaMaxHeight}:{}};return y.jsx("div",{className:`mosaic-row-item mosaic-row-item-fit-${G.fit}`,style:ne,children:y.jsxs("button",{type:"button",className:`mosaic-row-card mosaic-row-card-${G.card.id}${le?" mosaic-row-card-paginated":""}`,onClick:()=>{if(le){$2(G.card,z,ue,S);return}F2(G.card,G.previewIndex,ae)},"aria-label":le?`Show next ${G.card.title} screen, currently screen ${z+1} of ${ue}`:`Open ${G.card.title} preview ${G.previewIndex+1} of ${J.length}`,children:[ee(G.card,Q,F,q),y.jsx("span",{className:"mosaic-row-card-title","aria-hidden":"true",children:G.card.title}),le?y.jsx("span",{className:"mosaic-row-card-pagination","aria-hidden":"true",children:Array.from({length:ue}).map((me,v)=>y.jsx("span",{className:`mosaic-row-card-pagination-dot${v===z?" is-active":""}`},`${G.card.id}-pagination-${v}`))}):null]})},oe)})},V.id)})})]}),y.jsx(H2,{cards:J,open:g!=null&&g<J.length,selectedIndex:Z,prefersReducedMotion:c,onOpenChange:V=>{V||h(null)},onSelectedIndexChange:ae})]}):null]})}function l5({email:a,contactHref:o,telegramHref:u,xHref:r}){const[c,d]=w.useState(!1),g=async()=>{try{await navigator.clipboard.writeText(a),d(!0),window.setTimeout(()=>d(!1),1800)}catch{window.location.href=o}};return y.jsxs(y.Fragment,{children:[y.jsxs("div",{className:"mosaic-profile-actions","aria-label":"Profile contact actions",children:[y.jsx("button",{type:"button",className:"mosaic-contact-pill mosaic-contact-pill-default",onClick:g,children:y.jsx("span",{className:"mosaic-contact-pill-default-label",children:c?"Copied!":"Copy email"})}),y.jsx("a",{href:u,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-telegram",children:y.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-telegram",children:[y.jsx("img",{src:"/icons/telegram.png",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-telegram"}),y.jsx("span",{className:"mosaic-contact-pill-telegram-label",children:"Message"})]})}),r?y.jsx("a",{href:r,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-dark",children:y.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[y.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),y.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})}):y.jsx("span",{className:"mosaic-contact-pill mosaic-contact-pill-dark",role:"text",children:y.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[y.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),y.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})})]}),y.jsx("span",{className:"sr-only",role:"status","aria-live":"polite","aria-atomic":"true",children:c?"Email copied to clipboard":""})]})}const a5=[{label:"Body",variable:"--body-color"},{label:"Body BG",variable:"--body-bg"},{label:"Primary",variable:"--primary"},{label:"Secondary",variable:"--secondary"},{label:"Accent",variable:"--accent"},{label:"Surface",variable:"--surface-2"}],i5=[{label:"Snappy",value:"220ms / cubic-bezier(0.175, 0.885, 0.32, 1.1)"},{label:"Swift",value:"800ms / cubic-bezier(0.175, 0.885, 0.32, 1.275)"},{label:"Smooth",value:"300ms / cubic-bezier(0.19, 1, 0.22, 1)"}];function o5({links:a,name:o}){return y.jsxs("main",{id:"main-content",tabIndex:-1,className:"styleguide-page",children:[y.jsxs("header",{className:"styleguide-hero",children:[y.jsxs("div",{className:"styleguide-hero-topline",children:[y.jsx("a",{href:"/",className:"styleguide-home-link",children:"Back to portfolio"}),y.jsx("span",{className:"styleguide-badge",children:"System inventory"})]}),y.jsxs("div",{className:"styleguide-hero-copy",children:[y.jsx("p",{className:"styleguide-eyebrow",children:"Rafael Medina UI system"}),y.jsx("h1",{children:"Styleguide"}),y.jsxs("p",{className:"styleguide-lede",children:["A living page for the real components, link treatments, text styles, surfaces, and motion tokens currently shaping"," ",o,"'s portfolio."]})]})]}),y.jsxs("div",{className:"styleguide-main",children:[y.jsxs("section",{className:"styleguide-section",children:[y.jsxs("div",{className:"styleguide-section-heading",children:[y.jsx("p",{children:"Buttons"}),y.jsx("h2",{children:"Contact action row"})]}),y.jsx("div",{className:"styleguide-specimen styleguide-specimen-wide",children:y.jsx(l5,{email:a.email,contactHref:`mailto:${a.email}`,telegramHref:a.telegram,xHref:a.x})}),y.jsxs("div",{className:"styleguide-notes-grid",children:[y.jsxs("article",{className:"styleguide-note-card",children:[y.jsx("span",{children:"Primary"}),y.jsx("strong",{children:"Copy email"}),y.jsx("p",{children:"Utility-first action with the strongest contrast in the row."})]}),y.jsxs("article",{className:"styleguide-note-card",children:[y.jsx("span",{children:"Secondary"}),y.jsx("strong",{children:"Message"}),y.jsx("p",{children:"Friendlier blue accent that stays related to the main button family."})]}),y.jsxs("article",{className:"styleguide-note-card",children:[y.jsx("span",{children:"Tertiary"}),y.jsx("strong",{children:"Follow"}),y.jsx("p",{children:"Darker social action that stays present without overpowering the row."})]})]})]}),y.jsxs("section",{className:"styleguide-section",children:[y.jsxs("div",{className:"styleguide-section-heading",children:[y.jsx("p",{children:"Links"}),y.jsx("h2",{children:"Editorial inline treatments"})]}),y.jsxs("div",{className:"styleguide-copy-sample",children:[y.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["Born in the US I helped build"," ",y.jsx("a",{href:"https://matcha.xyz",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Matcha.xyz"})," ","end-to-end, from product design to interaction design."]}),y.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["I've been fortunate to work with teams at ",y.jsx(Sp,{}),"."]}),y.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",y.jsx("a",{href:a.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",y.jsx("a",{href:`mailto:${a.email}`,className:"mosaic-profile-link",children:a.email}),"."]})]})]}),y.jsxs("section",{className:"styleguide-section styleguide-grid-two",children:[y.jsxs("div",{className:"styleguide-column",children:[y.jsxs("div",{className:"styleguide-section-heading",children:[y.jsx("p",{children:"Typography"}),y.jsx("h2",{children:"Core text rhythm"})]}),y.jsxs("div",{className:"styleguide-type-stack",children:[y.jsxs("article",{className:"styleguide-type-card",children:[y.jsx("span",{children:"Hero title"}),y.jsx("h3",{children:"Rafael Medina"}),y.jsx("p",{children:"16px / 170% / -0.005em"})]}),y.jsxs("article",{className:"styleguide-type-card",children:[y.jsx("span",{children:"Body base"}),y.jsx("h4",{children:"I'm a designer who ships products, now AI-enabled."}),y.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]}),y.jsxs("article",{className:"styleguide-type-card",children:[y.jsx("span",{children:"Meta"}),y.jsx("div",{className:"styleguide-meta-line",children:"Punta Cana · Local time: 5:03pm AST"}),y.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]})]})]}),y.jsxs("div",{className:"styleguide-column",children:[y.jsxs("div",{className:"styleguide-section-heading",children:[y.jsx("p",{children:"Tokens"}),y.jsx("h2",{children:"Color and motion references"})]}),y.jsx("div",{className:"styleguide-swatch-grid",children:a5.map(u=>y.jsxs("article",{className:"styleguide-swatch-card",children:[y.jsx("div",{className:"styleguide-swatch",style:{background:`var(${u.variable})`}}),y.jsx("strong",{children:u.label}),y.jsx("span",{children:u.variable})]},u.variable))}),y.jsx("div",{className:"styleguide-motion-list",children:i5.map(u=>y.jsxs("article",{className:"styleguide-motion-card",children:[y.jsx("strong",{children:u.label}),y.jsx("span",{children:u.value})]},u.label))})]})]}),y.jsxs("section",{className:"styleguide-section",children:[y.jsxs("div",{className:"styleguide-section-heading",children:[y.jsx("p",{children:"Surfaces"}),y.jsx("h2",{children:"Panels and atmosphere"})]}),y.jsxs("div",{className:"styleguide-surface-grid",children:[y.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-overlay",children:[y.jsx("span",{children:"Overlay"}),y.jsx("strong",{children:"Blurred system surface"}),y.jsx("p",{children:"Uses the shared overlay blur, background, and layered shadow tokens."})]}),y.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-tile",children:[y.jsx("span",{children:"Tile"}),y.jsx("strong",{children:"Project canvas"}),y.jsx("p",{children:"The softer neutral panel used by the portfolio grid."})]}),y.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-accent",children:[y.jsx("span",{children:"Accent"}),y.jsx("strong",{children:"Highlight wash"}),y.jsx("p",{children:"A low-contrast accent surface for emphasis, notes, or future badges."})]})]})]})]})]})}function s5(a){return!a||a==="/"?"/":a.replace(/\/+$/,"")}function u5(){const o=(typeof window>"u"?"/":s5(window.location.pathname))==="/styleguide";return y.jsx(eb,{volume:.6,children:y.jsxs("div",{"data-theme":"light",className:"relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]",children:[y.jsx("a",{href:"#main-content",className:"skip-link",children:"Skip to content"}),o?y.jsx(o5,{links:Sa,name:Nm.name}):y.jsx("main",{id:"main-content",tabIndex:-1,className:"relative z-dock",children:y.jsx(n5,{cards:db,profile:Nm,links:Sa,showProjects:!0})}),gc()?y.jsx(ry,{}):null,null]})})}Eb();Ih.createRoot(document.getElementById("root")).render(y.jsx(w.StrictMode,{children:y.jsx(u5,{})}));
