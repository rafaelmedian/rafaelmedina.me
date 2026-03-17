function ep(u,s){for(var o=0;o<s.length;o++){const r=s[o];if(typeof r!="string"&&!Array.isArray(r)){for(const f in r)if(f!=="default"&&!(f in u)){const m=Object.getOwnPropertyDescriptor(r,f);m&&Object.defineProperty(u,f,m.get?m:{enumerable:!0,get:()=>r[f]})}}}return Object.freeze(Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}))}(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))r(f);new MutationObserver(f=>{for(const m of f)if(m.type==="childList")for(const h of m.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&r(h)}).observe(document,{childList:!0,subtree:!0});function o(f){const m={};return f.integrity&&(m.integrity=f.integrity),f.referrerPolicy&&(m.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?m.credentials="include":f.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function r(f){if(f.ep)return;f.ep=!0;const m=o(f);fetch(f.href,m)}})();function tp(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var Er={exports:{}},di={};var P_;function np(){if(P_)return di;P_=1;var u=Symbol.for("react.transitional.element"),s=Symbol.for("react.fragment");function o(r,f,m){var h=null;if(m!==void 0&&(h=""+m),f.key!==void 0&&(h=""+f.key),"key"in f){m={};for(var S in f)S!=="key"&&(m[S]=f[S])}else m=f;return f=m.ref,{$$typeof:u,type:r,key:h,ref:f!==void 0?f:null,props:m}}return di.Fragment=s,di.jsx=o,di.jsxs=o,di}var em;function lp(){return em||(em=1,Er.exports=np()),Er.exports}var _=lp(),Tr={exports:{}},me={};var tm;function ap(){if(tm)return me;tm=1;var u=Symbol.for("react.transitional.element"),s=Symbol.for("react.portal"),o=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),m=Symbol.for("react.consumer"),h=Symbol.for("react.context"),S=Symbol.for("react.forward_ref"),p=Symbol.for("react.suspense"),g=Symbol.for("react.memo"),N=Symbol.for("react.lazy"),E=Symbol.for("react.activity"),z=Symbol.iterator;function j(b){return b===null||typeof b!="object"?null:(b=z&&b[z]||b["@@iterator"],typeof b=="function"?b:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},L=Object.assign,I={};function Z(b,U,X){this.props=b,this.context=U,this.refs=I,this.updater=X||B}Z.prototype.isReactComponent={},Z.prototype.setState=function(b,U){if(typeof b!="object"&&typeof b!="function"&&b!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,b,U,"setState")},Z.prototype.forceUpdate=function(b){this.updater.enqueueForceUpdate(this,b,"forceUpdate")};function $(){}$.prototype=Z.prototype;function G(b,U,X){this.props=b,this.context=U,this.refs=I,this.updater=X||B}var Q=G.prototype=new $;Q.constructor=G,L(Q,Z.prototype),Q.isPureReactComponent=!0;var te=Array.isArray;function ne(){}var W={H:null,A:null,T:null,S:null},ue=Object.prototype.hasOwnProperty;function H(b,U,X){var J=X.ref;return{$$typeof:u,type:b,key:U,ref:J!==void 0?J:null,props:X}}function le(b,U){return H(b.type,U,b.props)}function re(b){return typeof b=="object"&&b!==null&&b.$$typeof===u}function Oe(b){var U={"=":"=0",":":"=2"};return"$"+b.replace(/[=:]/g,function(X){return U[X]})}var Fe=/\/+/g;function Xe(b,U){return typeof b=="object"&&b!==null&&b.key!=null?Oe(""+b.key):U.toString(36)}function ce(b){switch(b.status){case"fulfilled":return b.value;case"rejected":throw b.reason;default:switch(typeof b.status=="string"?b.then(ne,ne):(b.status="pending",b.then(function(U){b.status==="pending"&&(b.status="fulfilled",b.value=U)},function(U){b.status==="pending"&&(b.status="rejected",b.reason=U)})),b.status){case"fulfilled":return b.value;case"rejected":throw b.reason}}throw b}function R(b,U,X,J,oe){var pe=typeof b;(pe==="undefined"||pe==="boolean")&&(b=null);var Ee=!1;if(b===null)Ee=!0;else switch(pe){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(b.$$typeof){case u:case s:Ee=!0;break;case N:return Ee=b._init,R(Ee(b._payload),U,X,J,oe)}}if(Ee)return oe=oe(b),Ee=J===""?"."+Xe(b,0):J,te(oe)?(X="",Ee!=null&&(X=Ee.replace(Fe,"$&/")+"/"),R(oe,U,X,"",function(Yt){return Yt})):oe!=null&&(re(oe)&&(oe=le(oe,X+(oe.key==null||b&&b.key===oe.key?"":(""+oe.key).replace(Fe,"$&/")+"/")+Ee)),U.push(oe)),1;Ee=0;var Je=J===""?".":J+":";if(te(b))for(var Me=0;Me<b.length;Me++)J=b[Me],pe=Je+Xe(J,Me),Ee+=R(J,U,X,pe,oe);else if(Me=j(b),typeof Me=="function")for(b=Me.call(b),Me=0;!(J=b.next()).done;)J=J.value,pe=Je+Xe(J,Me++),Ee+=R(J,U,X,pe,oe);else if(pe==="object"){if(typeof b.then=="function")return R(ce(b),U,X,J,oe);throw U=String(b),Error("Objects are not valid as a React child (found: "+(U==="[object Object]"?"object with keys {"+Object.keys(b).join(", ")+"}":U)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function q(b,U,X){if(b==null)return b;var J=[],oe=0;return R(b,J,"","",function(pe){return U.call(X,pe,oe++)}),J}function K(b){if(b._status===-1){var U=b._result;U=U(),U.then(function(X){(b._status===0||b._status===-1)&&(b._status=1,b._result=X)},function(X){(b._status===0||b._status===-1)&&(b._status=2,b._result=X)}),b._status===-1&&(b._status=0,b._result=U)}if(b._status===1)return b._result.default;throw b._result}var ae=typeof reportError=="function"?reportError:function(b){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var U=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof b=="object"&&b!==null&&typeof b.message=="string"?String(b.message):String(b),error:b});if(!window.dispatchEvent(U))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",b);return}console.error(b)},ve={map:q,forEach:function(b,U,X){q(b,function(){U.apply(this,arguments)},X)},count:function(b){var U=0;return q(b,function(){U++}),U},toArray:function(b){return q(b,function(U){return U})||[]},only:function(b){if(!re(b))throw Error("React.Children.only expected to receive a single React element child.");return b}};return me.Activity=E,me.Children=ve,me.Component=Z,me.Fragment=o,me.Profiler=f,me.PureComponent=G,me.StrictMode=r,me.Suspense=p,me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=W,me.__COMPILER_RUNTIME={__proto__:null,c:function(b){return W.H.useMemoCache(b)}},me.cache=function(b){return function(){return b.apply(null,arguments)}},me.cacheSignal=function(){return null},me.cloneElement=function(b,U,X){if(b==null)throw Error("The argument must be a React element, but you passed "+b+".");var J=L({},b.props),oe=b.key;if(U!=null)for(pe in U.key!==void 0&&(oe=""+U.key),U)!ue.call(U,pe)||pe==="key"||pe==="__self"||pe==="__source"||pe==="ref"&&U.ref===void 0||(J[pe]=U[pe]);var pe=arguments.length-2;if(pe===1)J.children=X;else if(1<pe){for(var Ee=Array(pe),Je=0;Je<pe;Je++)Ee[Je]=arguments[Je+2];J.children=Ee}return H(b.type,oe,J)},me.createContext=function(b){return b={$$typeof:h,_currentValue:b,_currentValue2:b,_threadCount:0,Provider:null,Consumer:null},b.Provider=b,b.Consumer={$$typeof:m,_context:b},b},me.createElement=function(b,U,X){var J,oe={},pe=null;if(U!=null)for(J in U.key!==void 0&&(pe=""+U.key),U)ue.call(U,J)&&J!=="key"&&J!=="__self"&&J!=="__source"&&(oe[J]=U[J]);var Ee=arguments.length-2;if(Ee===1)oe.children=X;else if(1<Ee){for(var Je=Array(Ee),Me=0;Me<Ee;Me++)Je[Me]=arguments[Me+2];oe.children=Je}if(b&&b.defaultProps)for(J in Ee=b.defaultProps,Ee)oe[J]===void 0&&(oe[J]=Ee[J]);return H(b,pe,oe)},me.createRef=function(){return{current:null}},me.forwardRef=function(b){return{$$typeof:S,render:b}},me.isValidElement=re,me.lazy=function(b){return{$$typeof:N,_payload:{_status:-1,_result:b},_init:K}},me.memo=function(b,U){return{$$typeof:g,type:b,compare:U===void 0?null:U}},me.startTransition=function(b){var U=W.T,X={};W.T=X;try{var J=b(),oe=W.S;oe!==null&&oe(X,J),typeof J=="object"&&J!==null&&typeof J.then=="function"&&J.then(ne,ae)}catch(pe){ae(pe)}finally{U!==null&&X.types!==null&&(U.types=X.types),W.T=U}},me.unstable_useCacheRefresh=function(){return W.H.useCacheRefresh()},me.use=function(b){return W.H.use(b)},me.useActionState=function(b,U,X){return W.H.useActionState(b,U,X)},me.useCallback=function(b,U){return W.H.useCallback(b,U)},me.useContext=function(b){return W.H.useContext(b)},me.useDebugValue=function(){},me.useDeferredValue=function(b,U){return W.H.useDeferredValue(b,U)},me.useEffect=function(b,U){return W.H.useEffect(b,U)},me.useEffectEvent=function(b){return W.H.useEffectEvent(b)},me.useId=function(){return W.H.useId()},me.useImperativeHandle=function(b,U,X){return W.H.useImperativeHandle(b,U,X)},me.useInsertionEffect=function(b,U){return W.H.useInsertionEffect(b,U)},me.useLayoutEffect=function(b,U){return W.H.useLayoutEffect(b,U)},me.useMemo=function(b,U){return W.H.useMemo(b,U)},me.useOptimistic=function(b,U){return W.H.useOptimistic(b,U)},me.useReducer=function(b,U,X){return W.H.useReducer(b,U,X)},me.useRef=function(b){return W.H.useRef(b)},me.useState=function(b){return W.H.useState(b)},me.useSyncExternalStore=function(b,U,X){return W.H.useSyncExternalStore(b,U,X)},me.useTransition=function(){return W.H.useTransition()},me.version="19.2.4",me}var nm;function vi(){return nm||(nm=1,Tr.exports=ap()),Tr.exports}var T=vi();const ip=tp(T),Bm=ep({__proto__:null,default:ip},[T]);var wr={exports:{}},_i={},Or={exports:{}},Cr={};var lm;function up(){return lm||(lm=1,(function(u){function s(R,q){var K=R.length;R.push(q);e:for(;0<K;){var ae=K-1>>>1,ve=R[ae];if(0<f(ve,q))R[ae]=q,R[K]=ve,K=ae;else break e}}function o(R){return R.length===0?null:R[0]}function r(R){if(R.length===0)return null;var q=R[0],K=R.pop();if(K!==q){R[0]=K;e:for(var ae=0,ve=R.length,b=ve>>>1;ae<b;){var U=2*(ae+1)-1,X=R[U],J=U+1,oe=R[J];if(0>f(X,K))J<ve&&0>f(oe,X)?(R[ae]=oe,R[J]=K,ae=J):(R[ae]=X,R[U]=K,ae=U);else if(J<ve&&0>f(oe,K))R[ae]=oe,R[J]=K,ae=J;else break e}}return q}function f(R,q){var K=R.sortIndex-q.sortIndex;return K!==0?K:R.id-q.id}if(u.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var m=performance;u.unstable_now=function(){return m.now()}}else{var h=Date,S=h.now();u.unstable_now=function(){return h.now()-S}}var p=[],g=[],N=1,E=null,z=3,j=!1,B=!1,L=!1,I=!1,Z=typeof setTimeout=="function"?setTimeout:null,$=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;function Q(R){for(var q=o(g);q!==null;){if(q.callback===null)r(g);else if(q.startTime<=R)r(g),q.sortIndex=q.expirationTime,s(p,q);else break;q=o(g)}}function te(R){if(L=!1,Q(R),!B)if(o(p)!==null)B=!0,ne||(ne=!0,Oe());else{var q=o(g);q!==null&&ce(te,q.startTime-R)}}var ne=!1,W=-1,ue=5,H=-1;function le(){return I?!0:!(u.unstable_now()-H<ue)}function re(){if(I=!1,ne){var R=u.unstable_now();H=R;var q=!0;try{e:{B=!1,L&&(L=!1,$(W),W=-1),j=!0;var K=z;try{t:{for(Q(R),E=o(p);E!==null&&!(E.expirationTime>R&&le());){var ae=E.callback;if(typeof ae=="function"){E.callback=null,z=E.priorityLevel;var ve=ae(E.expirationTime<=R);if(R=u.unstable_now(),typeof ve=="function"){E.callback=ve,Q(R),q=!0;break t}E===o(p)&&r(p),Q(R)}else r(p);E=o(p)}if(E!==null)q=!0;else{var b=o(g);b!==null&&ce(te,b.startTime-R),q=!1}}break e}finally{E=null,z=K,j=!1}q=void 0}}finally{q?Oe():ne=!1}}}var Oe;if(typeof G=="function")Oe=function(){G(re)};else if(typeof MessageChannel<"u"){var Fe=new MessageChannel,Xe=Fe.port2;Fe.port1.onmessage=re,Oe=function(){Xe.postMessage(null)}}else Oe=function(){Z(re,0)};function ce(R,q){W=Z(function(){R(u.unstable_now())},q)}u.unstable_IdlePriority=5,u.unstable_ImmediatePriority=1,u.unstable_LowPriority=4,u.unstable_NormalPriority=3,u.unstable_Profiling=null,u.unstable_UserBlockingPriority=2,u.unstable_cancelCallback=function(R){R.callback=null},u.unstable_forceFrameRate=function(R){0>R||125<R?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ue=0<R?Math.floor(1e3/R):5},u.unstable_getCurrentPriorityLevel=function(){return z},u.unstable_next=function(R){switch(z){case 1:case 2:case 3:var q=3;break;default:q=z}var K=z;z=q;try{return R()}finally{z=K}},u.unstable_requestPaint=function(){I=!0},u.unstable_runWithPriority=function(R,q){switch(R){case 1:case 2:case 3:case 4:case 5:break;default:R=3}var K=z;z=R;try{return q()}finally{z=K}},u.unstable_scheduleCallback=function(R,q,K){var ae=u.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ae+K:ae):K=ae,R){case 1:var ve=-1;break;case 2:ve=250;break;case 5:ve=1073741823;break;case 4:ve=1e4;break;default:ve=5e3}return ve=K+ve,R={id:N++,callback:q,priorityLevel:R,startTime:K,expirationTime:ve,sortIndex:-1},K>ae?(R.sortIndex=K,s(g,R),o(p)===null&&R===o(g)&&(L?($(W),W=-1):L=!0,ce(te,K-ae))):(R.sortIndex=ve,s(p,R),B||j||(B=!0,ne||(ne=!0,Oe()))),R},u.unstable_shouldYield=le,u.unstable_wrapCallback=function(R){var q=z;return function(){var K=z;z=q;try{return R.apply(this,arguments)}finally{z=K}}}})(Cr)),Cr}var am;function sp(){return am||(am=1,Or.exports=up()),Or.exports}var zr={exports:{}},yt={};var im;function op(){if(im)return yt;im=1;var u=vi();function s(p){var g="https://react.dev/errors/"+p;if(1<arguments.length){g+="?args[]="+encodeURIComponent(arguments[1]);for(var N=2;N<arguments.length;N++)g+="&args[]="+encodeURIComponent(arguments[N])}return"Minified React error #"+p+"; visit "+g+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function o(){}var r={d:{f:o,r:function(){throw Error(s(522))},D:o,C:o,L:o,m:o,X:o,S:o,M:o},p:0,findDOMNode:null},f=Symbol.for("react.portal");function m(p,g,N){var E=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:E==null?null:""+E,children:p,containerInfo:g,implementation:N}}var h=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function S(p,g){if(p==="font")return"";if(typeof g=="string")return g==="use-credentials"?g:""}return yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,yt.createPortal=function(p,g){var N=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!g||g.nodeType!==1&&g.nodeType!==9&&g.nodeType!==11)throw Error(s(299));return m(p,g,null,N)},yt.flushSync=function(p){var g=h.T,N=r.p;try{if(h.T=null,r.p=2,p)return p()}finally{h.T=g,r.p=N,r.d.f()}},yt.preconnect=function(p,g){typeof p=="string"&&(g?(g=g.crossOrigin,g=typeof g=="string"?g==="use-credentials"?g:"":void 0):g=null,r.d.C(p,g))},yt.prefetchDNS=function(p){typeof p=="string"&&r.d.D(p)},yt.preinit=function(p,g){if(typeof p=="string"&&g&&typeof g.as=="string"){var N=g.as,E=S(N,g.crossOrigin),z=typeof g.integrity=="string"?g.integrity:void 0,j=typeof g.fetchPriority=="string"?g.fetchPriority:void 0;N==="style"?r.d.S(p,typeof g.precedence=="string"?g.precedence:void 0,{crossOrigin:E,integrity:z,fetchPriority:j}):N==="script"&&r.d.X(p,{crossOrigin:E,integrity:z,fetchPriority:j,nonce:typeof g.nonce=="string"?g.nonce:void 0})}},yt.preinitModule=function(p,g){if(typeof p=="string")if(typeof g=="object"&&g!==null){if(g.as==null||g.as==="script"){var N=S(g.as,g.crossOrigin);r.d.M(p,{crossOrigin:N,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0})}}else g==null&&r.d.M(p)},yt.preload=function(p,g){if(typeof p=="string"&&typeof g=="object"&&g!==null&&typeof g.as=="string"){var N=g.as,E=S(N,g.crossOrigin);r.d.L(p,N,{crossOrigin:E,integrity:typeof g.integrity=="string"?g.integrity:void 0,nonce:typeof g.nonce=="string"?g.nonce:void 0,type:typeof g.type=="string"?g.type:void 0,fetchPriority:typeof g.fetchPriority=="string"?g.fetchPriority:void 0,referrerPolicy:typeof g.referrerPolicy=="string"?g.referrerPolicy:void 0,imageSrcSet:typeof g.imageSrcSet=="string"?g.imageSrcSet:void 0,imageSizes:typeof g.imageSizes=="string"?g.imageSizes:void 0,media:typeof g.media=="string"?g.media:void 0})}},yt.preloadModule=function(p,g){if(typeof p=="string")if(g){var N=S(g.as,g.crossOrigin);r.d.m(p,{as:typeof g.as=="string"&&g.as!=="script"?g.as:void 0,crossOrigin:N,integrity:typeof g.integrity=="string"?g.integrity:void 0})}else r.d.m(p)},yt.requestFormReset=function(p){r.d.r(p)},yt.unstable_batchedUpdates=function(p,g){return p(g)},yt.useFormState=function(p,g,N){return h.H.useFormState(p,g,N)},yt.useFormStatus=function(){return h.H.useHostTransitionStatus()},yt.version="19.2.4",yt}var um;function Lm(){if(um)return zr.exports;um=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(s){console.error(s)}}return u(),zr.exports=op(),zr.exports}var sm;function rp(){if(sm)return _i;sm=1;var u=sp(),s=vi(),o=Lm();function r(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function m(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function h(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function S(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function p(e){if(m(e)!==e)throw Error(r(188))}function g(e){var t=e.alternate;if(!t){if(t=m(e),t===null)throw Error(r(188));return t!==e?null:e}for(var n=e,l=t;;){var a=n.return;if(a===null)break;var i=a.alternate;if(i===null){if(l=a.return,l!==null){n=l;continue}break}if(a.child===i.child){for(i=a.child;i;){if(i===n)return p(a),e;if(i===l)return p(a),t;i=i.sibling}throw Error(r(188))}if(n.return!==l.return)n=a,l=i;else{for(var c=!1,d=a.child;d;){if(d===n){c=!0,n=a,l=i;break}if(d===l){c=!0,l=a,n=i;break}d=d.sibling}if(!c){for(d=i.child;d;){if(d===n){c=!0,n=i,l=a;break}if(d===l){c=!0,l=i,n=a;break}d=d.sibling}if(!c)throw Error(r(189))}}if(n.alternate!==l)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function N(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=N(e),t!==null)return t;e=e.sibling}return null}var E=Object.assign,z=Symbol.for("react.element"),j=Symbol.for("react.transitional.element"),B=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),Z=Symbol.for("react.profiler"),$=Symbol.for("react.consumer"),G=Symbol.for("react.context"),Q=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),ne=Symbol.for("react.suspense_list"),W=Symbol.for("react.memo"),ue=Symbol.for("react.lazy"),H=Symbol.for("react.activity"),le=Symbol.for("react.memo_cache_sentinel"),re=Symbol.iterator;function Oe(e){return e===null||typeof e!="object"?null:(e=re&&e[re]||e["@@iterator"],typeof e=="function"?e:null)}var Fe=Symbol.for("react.client.reference");function Xe(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===Fe?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case L:return"Fragment";case Z:return"Profiler";case I:return"StrictMode";case te:return"Suspense";case ne:return"SuspenseList";case H:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case B:return"Portal";case G:return e.displayName||"Context";case $:return(e._context.displayName||"Context")+".Consumer";case Q:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case W:return t=e.displayName||null,t!==null?t:Xe(e.type)||"Memo";case ue:t=e._payload,e=e._init;try{return Xe(e(t))}catch{}}return null}var ce=Array.isArray,R=s.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=o.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},ae=[],ve=-1;function b(e){return{current:e}}function U(e){0>ve||(e.current=ae[ve],ae[ve]=null,ve--)}function X(e,t){ve++,ae[ve]=e.current,e.current=t}var J=b(null),oe=b(null),pe=b(null),Ee=b(null);function Je(e,t){switch(X(pe,t),X(oe,e),X(J,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?S_(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=S_(t),e=E_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}U(J),X(J,e)}function Me(){U(J),U(oe),U(pe)}function Yt(e){e.memoizedState!==null&&X(Ee,e);var t=J.current,n=E_(t,e.type);t!==n&&(X(oe,e),X(J,n))}function It(e){oe.current===e&&(U(J),U(oe)),Ee.current===e&&(U(Ee),oi._currentValue=K)}var D,ge;function ee(e){if(D===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);D=t&&t[1]||"",ge=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+D+e+ge}var it=!1;function V(e,t){if(!e||it)return"";it=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var Y=function(){throw Error()};if(Object.defineProperty(Y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Y,[])}catch(A){var C=A}Reflect.construct(e,[],Y)}else{try{Y.call()}catch(A){C=A}e.call(Y.prototype)}}else{try{throw Error()}catch(A){C=A}(Y=e())&&typeof Y.catch=="function"&&Y.catch(function(){})}}catch(A){if(A&&C&&typeof A.stack=="string")return[A.stack,C.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var i=l.DetermineComponentFrameRoot(),c=i[0],d=i[1];if(c&&d){var y=c.split(`
`),O=d.split(`
`);for(a=l=0;l<y.length&&!y[l].includes("DetermineComponentFrameRoot");)l++;for(;a<O.length&&!O[a].includes("DetermineComponentFrameRoot");)a++;if(l===y.length||a===O.length)for(l=y.length-1,a=O.length-1;1<=l&&0<=a&&y[l]!==O[a];)a--;for(;1<=l&&0<=a;l--,a--)if(y[l]!==O[a]){if(l!==1||a!==1)do if(l--,a--,0>a||y[l]!==O[a]){var M=`
`+y[l].replace(" at new "," at ");return e.displayName&&M.includes("<anonymous>")&&(M=M.replace("<anonymous>",e.displayName)),M}while(1<=l&&0<=a);break}}}finally{it=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?ee(n):""}function de(e,t){switch(e.tag){case 26:case 27:case 5:return ee(e.type);case 16:return ee("Lazy");case 13:return e.child!==t&&t!==null?ee("Suspense Fallback"):ee("Suspense");case 19:return ee("SuspenseList");case 0:case 15:return V(e.type,!1);case 11:return V(e.type.render,!1);case 1:return V(e.type,!0);case 31:return ee("Activity");default:return""}}function be(e){try{var t="",n=null;do t+=de(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var ze=Object.prototype.hasOwnProperty,Ge=u.unstable_scheduleCallback,_e=u.unstable_cancelCallback,fe=u.unstable_shouldYield,pt=u.unstable_requestPaint,Ye=u.unstable_now,An=u.unstable_getCurrentPriorityLevel,il=u.unstable_ImmediatePriority,Ol=u.unstable_UserBlockingPriority,Nn=u.unstable_NormalPriority,bt=u.unstable_LowPriority,Rn=u.unstable_IdlePriority,Cl=u.log,Y0=u.unstable_setDisableYieldValue,va=null,zt=null;function jn(e){if(typeof Cl=="function"&&Y0(e),zt&&typeof zt.setStrictMode=="function")try{zt.setStrictMode(va,e)}catch{}}var At=Math.clz32?Math.clz32:H0,B0=Math.log,L0=Math.LN2;function H0(e){return e>>>=0,e===0?32:31-(B0(e)/L0|0)|0}var wi=256,Oi=262144,Ci=4194304;function ul(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function zi(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var a=0,i=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var d=l&134217727;return d!==0?(l=d&~i,l!==0?a=ul(l):(c&=d,c!==0?a=ul(c):n||(n=d&~e,n!==0&&(a=ul(n))))):(d=l&~i,d!==0?a=ul(d):c!==0?a=ul(c):n||(n=l&~e,n!==0&&(a=ul(n)))),a===0?0:t!==0&&t!==a&&(t&i)===0&&(i=a&-a,n=t&-t,i>=n||i===32&&(n&4194048)!==0)?t:a}function xa(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function X0(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function nc(){var e=Ci;return Ci<<=1,(Ci&62914560)===0&&(Ci=4194304),e}function cs(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Sa(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function q0(e,t,n,l,a,i){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var d=e.entanglements,y=e.expirationTimes,O=e.hiddenUpdates;for(n=c&~n;0<n;){var M=31-At(n),Y=1<<M;d[M]=0,y[M]=-1;var C=O[M];if(C!==null)for(O[M]=null,M=0;M<C.length;M++){var A=C[M];A!==null&&(A.lane&=-536870913)}n&=~Y}l!==0&&lc(e,l,0),i!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=i&~(c&~t))}function lc(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-At(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function ac(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-At(n),a=1<<l;a&t|e[l]&t&&(e[l]|=t),n&=~a}}function ic(e,t){var n=t&-t;return n=(n&42)!==0?1:fs(n),(n&(e.suspendedLanes|t))!==0?0:n}function fs(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ds(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function uc(){var e=q.p;return e!==0?e:(e=window.event,e===void 0?32:Z_(e.type))}function sc(e,t){var n=q.p;try{return q.p=e,t()}finally{q.p=n}}var Mn=Math.random().toString(36).slice(2),ct="__reactFiber$"+Mn,vt="__reactProps$"+Mn,zl="__reactContainer$"+Mn,_s="__reactEvents$"+Mn,Q0="__reactListeners$"+Mn,G0="__reactHandles$"+Mn,oc="__reactResources$"+Mn,Ea="__reactMarker$"+Mn;function ms(e){delete e[ct],delete e[vt],delete e[_s],delete e[Q0],delete e[G0]}function Al(e){var t=e[ct];if(t)return t;for(var n=e.parentNode;n;){if(t=n[zl]||n[ct]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=N_(e);e!==null;){if(n=e[ct])return n;e=N_(e)}return t}e=n,n=e.parentNode}return null}function Nl(e){if(e=e[ct]||e[zl]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ta(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(r(33))}function Rl(e){var t=e[oc];return t||(t=e[oc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function st(e){e[Ea]=!0}var rc=new Set,cc={};function sl(e,t){jl(e,t),jl(e+"Capture",t)}function jl(e,t){for(cc[e]=t,e=0;e<t.length;e++)rc.add(t[e])}var V0=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),fc={},dc={};function Z0(e){return ze.call(dc,e)?!0:ze.call(fc,e)?!1:V0.test(e)?dc[e]=!0:(fc[e]=!0,!1)}function Ai(e,t,n){if(Z0(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Ni(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function on(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Bt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function _c(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function K0(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,i=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,i.call(this,c)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function gs(e){if(!e._valueTracker){var t=_c(e)?"checked":"value";e._valueTracker=K0(e,t,""+e[t])}}function mc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=_c(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Ri(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var J0=/[\n"\\]/g;function Lt(e){return e.replace(J0,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function ys(e,t,n,l,a,i,c,d){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Bt(t)):e.value!==""+Bt(t)&&(e.value=""+Bt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?ps(e,c,Bt(t)):n!=null?ps(e,c,Bt(n)):l!=null&&e.removeAttribute("value"),a==null&&i!=null&&(e.defaultChecked=!!i),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.name=""+Bt(d):e.removeAttribute("name")}function gc(e,t,n,l,a,i,c,d){if(i!=null&&typeof i!="function"&&typeof i!="symbol"&&typeof i!="boolean"&&(e.type=i),t!=null||n!=null){if(!(i!=="submit"&&i!=="reset"||t!=null)){gs(e);return}n=n!=null?""+Bt(n):"",t=t!=null?""+Bt(t):n,d||t===e.value||(e.value=t),e.defaultValue=t}l=l??a,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=d?e.checked:!!l,e.defaultChecked=!!l,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),gs(e)}function ps(e,t,n){t==="number"&&Ri(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Ml(e,t,n,l){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Bt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,l&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function yc(e,t,n){if(t!=null&&(t=""+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Bt(n):""}function pc(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(r(92));if(ce(l)){if(1<l.length)throw Error(r(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Bt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),gs(e)}function Dl(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var I0=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function hc(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||I0.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function bc(e,t,n){if(t!=null&&typeof t!="object")throw Error(r(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var a in t)l=t[a],t.hasOwnProperty(a)&&n[a]!==l&&hc(e,a,l)}else for(var i in t)t.hasOwnProperty(i)&&hc(e,i,t[i])}function hs(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var W0=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),F0=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ji(e){return F0.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function rn(){}var bs=null;function vs(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var kl=null,Ul=null;function vc(e){var t=Nl(e);if(t&&(e=t.stateNode)){var n=e[vt]||null;e:switch(e=t.stateNode,t.type){case"input":if(ys(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Lt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var a=l[vt]||null;if(!a)throw Error(r(90));ys(l,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&mc(l)}break e;case"textarea":yc(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Ml(e,!!n.multiple,t,!1)}}}var xs=!1;function xc(e,t,n){if(xs)return e(t,n);xs=!0;try{var l=e(t);return l}finally{if(xs=!1,(kl!==null||Ul!==null)&&(bu(),kl&&(t=kl,e=Ul,Ul=kl=null,vc(t),e)))for(t=0;t<e.length;t++)vc(e[t])}}function wa(e,t){var n=e.stateNode;if(n===null)return null;var l=n[vt]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(r(231,t,typeof n));return n}var cn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Ss=!1;if(cn)try{var Oa={};Object.defineProperty(Oa,"passive",{get:function(){Ss=!0}}),window.addEventListener("test",Oa,Oa),window.removeEventListener("test",Oa,Oa)}catch{Ss=!1}var Dn=null,Es=null,Mi=null;function Sc(){if(Mi)return Mi;var e,t=Es,n=t.length,l,a="value"in Dn?Dn.value:Dn.textContent,i=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(l=1;l<=c&&t[n-l]===a[i-l];l++);return Mi=a.slice(e,1<l?1-l:void 0)}function Di(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ki(){return!0}function Ec(){return!1}function xt(e){function t(n,l,a,i,c){this._reactName=n,this._targetInst=a,this.type=l,this.nativeEvent=i,this.target=c,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(n=e[d],this[d]=n?n(i):i[d]);return this.isDefaultPrevented=(i.defaultPrevented!=null?i.defaultPrevented:i.returnValue===!1)?ki:Ec,this.isPropagationStopped=Ec,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ki)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ki)},persist:function(){},isPersistent:ki}),t}var ol={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Ui=xt(ol),Ca=E({},ol,{view:0,detail:0}),$0=xt(Ca),Ts,ws,za,Yi=E({},Ca,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Cs,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==za&&(za&&e.type==="mousemove"?(Ts=e.screenX-za.screenX,ws=e.screenY-za.screenY):ws=Ts=0,za=e),Ts)},movementY:function(e){return"movementY"in e?e.movementY:ws}}),Tc=xt(Yi),P0=E({},Yi,{dataTransfer:0}),eg=xt(P0),tg=E({},Ca,{relatedTarget:0}),Os=xt(tg),ng=E({},ol,{animationName:0,elapsedTime:0,pseudoElement:0}),lg=xt(ng),ag=E({},ol,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),ig=xt(ag),ug=E({},ol,{data:0}),wc=xt(ug),sg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},og={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},rg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function cg(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=rg[e])?!!t[e]:!1}function Cs(){return cg}var fg=E({},Ca,{key:function(e){if(e.key){var t=sg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Di(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?og[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Cs,charCode:function(e){return e.type==="keypress"?Di(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Di(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),dg=xt(fg),_g=E({},Yi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Oc=xt(_g),mg=E({},Ca,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Cs}),gg=xt(mg),yg=E({},ol,{propertyName:0,elapsedTime:0,pseudoElement:0}),pg=xt(yg),hg=E({},Yi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),bg=xt(hg),vg=E({},ol,{newState:0,oldState:0}),xg=xt(vg),Sg=[9,13,27,32],zs=cn&&"CompositionEvent"in window,Aa=null;cn&&"documentMode"in document&&(Aa=document.documentMode);var Eg=cn&&"TextEvent"in window&&!Aa,Cc=cn&&(!zs||Aa&&8<Aa&&11>=Aa),zc=" ",Ac=!1;function Nc(e,t){switch(e){case"keyup":return Sg.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Rc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yl=!1;function Tg(e,t){switch(e){case"compositionend":return Rc(t);case"keypress":return t.which!==32?null:(Ac=!0,zc);case"textInput":return e=t.data,e===zc&&Ac?null:e;default:return null}}function wg(e,t){if(Yl)return e==="compositionend"||!zs&&Nc(e,t)?(e=Sc(),Mi=Es=Dn=null,Yl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Cc&&t.locale!=="ko"?null:t.data;default:return null}}var Og={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function jc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Og[e.type]:t==="textarea"}function Mc(e,t,n,l){kl?Ul?Ul.push(l):Ul=[l]:kl=l,t=Ou(t,"onChange"),0<t.length&&(n=new Ui("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Na=null,Ra=null;function Cg(e){y_(e,0)}function Bi(e){var t=Ta(e);if(mc(t))return e}function Dc(e,t){if(e==="change")return t}var kc=!1;if(cn){var As;if(cn){var Ns="oninput"in document;if(!Ns){var Uc=document.createElement("div");Uc.setAttribute("oninput","return;"),Ns=typeof Uc.oninput=="function"}As=Ns}else As=!1;kc=As&&(!document.documentMode||9<document.documentMode)}function Yc(){Na&&(Na.detachEvent("onpropertychange",Bc),Ra=Na=null)}function Bc(e){if(e.propertyName==="value"&&Bi(Ra)){var t=[];Mc(t,Ra,e,vs(e)),xc(Cg,t)}}function zg(e,t,n){e==="focusin"?(Yc(),Na=t,Ra=n,Na.attachEvent("onpropertychange",Bc)):e==="focusout"&&Yc()}function Ag(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Bi(Ra)}function Ng(e,t){if(e==="click")return Bi(t)}function Rg(e,t){if(e==="input"||e==="change")return Bi(t)}function jg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Nt=typeof Object.is=="function"?Object.is:jg;function ja(e,t){if(Nt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var a=n[l];if(!ze.call(t,a)||!Nt(e[a],t[a]))return!1}return!0}function Lc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Hc(e,t){var n=Lc(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Lc(n)}}function Xc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Xc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function qc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Ri(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Ri(e.document)}return t}function Rs(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Mg=cn&&"documentMode"in document&&11>=document.documentMode,Bl=null,js=null,Ma=null,Ms=!1;function Qc(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Ms||Bl==null||Bl!==Ri(l)||(l=Bl,"selectionStart"in l&&Rs(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Ma&&ja(Ma,l)||(Ma=l,l=Ou(js,"onSelect"),0<l.length&&(t=new Ui("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=Bl)))}function rl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ll={animationend:rl("Animation","AnimationEnd"),animationiteration:rl("Animation","AnimationIteration"),animationstart:rl("Animation","AnimationStart"),transitionrun:rl("Transition","TransitionRun"),transitionstart:rl("Transition","TransitionStart"),transitioncancel:rl("Transition","TransitionCancel"),transitionend:rl("Transition","TransitionEnd")},Ds={},Gc={};cn&&(Gc=document.createElement("div").style,"AnimationEvent"in window||(delete Ll.animationend.animation,delete Ll.animationiteration.animation,delete Ll.animationstart.animation),"TransitionEvent"in window||delete Ll.transitionend.transition);function cl(e){if(Ds[e])return Ds[e];if(!Ll[e])return e;var t=Ll[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Gc)return Ds[e]=t[n];return e}var Vc=cl("animationend"),Zc=cl("animationiteration"),Kc=cl("animationstart"),Dg=cl("transitionrun"),kg=cl("transitionstart"),Ug=cl("transitioncancel"),Jc=cl("transitionend"),Ic=new Map,ks="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");ks.push("scrollEnd");function Wt(e,t){Ic.set(e,t),sl(t,[e])}var Li=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ht=[],Hl=0,Us=0;function Hi(){for(var e=Hl,t=Us=Hl=0;t<e;){var n=Ht[t];Ht[t++]=null;var l=Ht[t];Ht[t++]=null;var a=Ht[t];Ht[t++]=null;var i=Ht[t];if(Ht[t++]=null,l!==null&&a!==null){var c=l.pending;c===null?a.next=a:(a.next=c.next,c.next=a),l.pending=a}i!==0&&Wc(n,a,i)}}function Xi(e,t,n,l){Ht[Hl++]=e,Ht[Hl++]=t,Ht[Hl++]=n,Ht[Hl++]=l,Us|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Ys(e,t,n,l){return Xi(e,t,n,l),qi(e)}function fl(e,t){return Xi(e,null,null,t),qi(e)}function Wc(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var a=!1,i=e.return;i!==null;)i.childLanes|=n,l=i.alternate,l!==null&&(l.childLanes|=n),i.tag===22&&(e=i.stateNode,e===null||e._visibility&1||(a=!0)),e=i,i=i.return;return e.tag===3?(i=e.stateNode,a&&t!==null&&(a=31-At(n),e=i.hiddenUpdates,l=e[a],l===null?e[a]=[t]:l.push(t),t.lane=n|536870912),i):null}function qi(e){if(50<ti)throw ti=0,Ko=null,Error(r(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Xl={};function Yg(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Rt(e,t,n,l){return new Yg(e,t,n,l)}function Bs(e){return e=e.prototype,!(!e||!e.isReactComponent)}function fn(e,t){var n=e.alternate;return n===null?(n=Rt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function Fc(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Qi(e,t,n,l,a,i){var c=0;if(l=e,typeof e=="function")Bs(e)&&(c=1);else if(typeof e=="string")c=qy(e,n,J.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case H:return e=Rt(31,n,t,a),e.elementType=H,e.lanes=i,e;case L:return dl(n.children,a,i,t);case I:c=8,a|=24;break;case Z:return e=Rt(12,n,t,a|2),e.elementType=Z,e.lanes=i,e;case te:return e=Rt(13,n,t,a),e.elementType=te,e.lanes=i,e;case ne:return e=Rt(19,n,t,a),e.elementType=ne,e.lanes=i,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case G:c=10;break e;case $:c=9;break e;case Q:c=11;break e;case W:c=14;break e;case ue:c=16,l=null;break e}c=29,n=Error(r(130,e===null?"null":typeof e,"")),l=null}return t=Rt(c,n,t,a),t.elementType=e,t.type=l,t.lanes=i,t}function dl(e,t,n,l){return e=Rt(7,e,l,t),e.lanes=n,e}function Ls(e,t,n){return e=Rt(6,e,null,t),e.lanes=n,e}function $c(e){var t=Rt(18,null,null,0);return t.stateNode=e,t}function Hs(e,t,n){return t=Rt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var Pc=new WeakMap;function Xt(e,t){if(typeof e=="object"&&e!==null){var n=Pc.get(e);return n!==void 0?n:(t={value:e,source:t,stack:be(t)},Pc.set(e,t),t)}return{value:e,source:t,stack:be(t)}}var ql=[],Ql=0,Gi=null,Da=0,qt=[],Qt=0,kn=null,tn=1,nn="";function dn(e,t){ql[Ql++]=Da,ql[Ql++]=Gi,Gi=e,Da=t}function ef(e,t,n){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=kn,kn=e;var l=tn;e=nn;var a=32-At(l)-1;l&=~(1<<a),n+=1;var i=32-At(t)+a;if(30<i){var c=a-a%5;i=(l&(1<<c)-1).toString(32),l>>=c,a-=c,tn=1<<32-At(t)+a|n<<a|l,nn=i+e}else tn=1<<i|n<<a|l,nn=e}function Xs(e){e.return!==null&&(dn(e,1),ef(e,1,0))}function qs(e){for(;e===Gi;)Gi=ql[--Ql],ql[Ql]=null,Da=ql[--Ql],ql[Ql]=null;for(;e===kn;)kn=qt[--Qt],qt[Qt]=null,nn=qt[--Qt],qt[Qt]=null,tn=qt[--Qt],qt[Qt]=null}function tf(e,t){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=kn,tn=t.id,nn=t.overflow,kn=e}var ft=null,Ve=null,Ce=!1,Un=null,Gt=!1,Qs=Error(r(519));function Yn(e){var t=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ka(Xt(t,e)),Qs}function nf(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[ct]=e,t[vt]=l,n){case"dialog":Se("cancel",t),Se("close",t);break;case"iframe":case"object":case"embed":Se("load",t);break;case"video":case"audio":for(n=0;n<li.length;n++)Se(li[n],t);break;case"source":Se("error",t);break;case"img":case"image":case"link":Se("error",t),Se("load",t);break;case"details":Se("toggle",t);break;case"input":Se("invalid",t),gc(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":Se("invalid",t);break;case"textarea":Se("invalid",t),pc(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||v_(t.textContent,n)?(l.popover!=null&&(Se("beforetoggle",t),Se("toggle",t)),l.onScroll!=null&&Se("scroll",t),l.onScrollEnd!=null&&Se("scrollend",t),l.onClick!=null&&(t.onclick=rn),t=!0):t=!1,t||Yn(e,!0)}function lf(e){for(ft=e.return;ft;)switch(ft.tag){case 5:case 31:case 13:Gt=!1;return;case 27:case 3:Gt=!0;return;default:ft=ft.return}}function Gl(e){if(e!==ft)return!1;if(!Ce)return lf(e),Ce=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||or(e.type,e.memoizedProps)),n=!n),n&&Ve&&Yn(e),lf(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=A_(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=A_(e)}else t===27?(t=Ve,Fn(e.type)?(e=_r,_r=null,Ve=e):Ve=t):Ve=ft?Zt(e.stateNode.nextSibling):null;return!0}function _l(){Ve=ft=null,Ce=!1}function Gs(){var e=Un;return e!==null&&(wt===null?wt=e:wt.push.apply(wt,e),Un=null),e}function ka(e){Un===null?Un=[e]:Un.push(e)}var Vs=b(null),ml=null,_n=null;function Bn(e,t,n){X(Vs,t._currentValue),t._currentValue=n}function mn(e){e._currentValue=Vs.current,U(Vs)}function Zs(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function Ks(e,t,n,l){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var i=a.dependencies;if(i!==null){var c=a.child;i=i.firstContext;e:for(;i!==null;){var d=i;i=a;for(var y=0;y<t.length;y++)if(d.context===t[y]){i.lanes|=n,d=i.alternate,d!==null&&(d.lanes|=n),Zs(i.return,n,e),l||(c=null);break e}i=d.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(r(341));c.lanes|=n,i=c.alternate,i!==null&&(i.lanes|=n),Zs(c,n,e),c=null}else c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Vl(e,t,n,l){e=null;for(var a=t,i=!1;a!==null;){if(!i){if((a.flags&524288)!==0)i=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(r(387));if(c=c.memoizedProps,c!==null){var d=a.type;Nt(a.pendingProps.value,c.value)||(e!==null?e.push(d):e=[d])}}else if(a===Ee.current){if(c=a.alternate,c===null)throw Error(r(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(oi):e=[oi])}a=a.return}e!==null&&Ks(t,e,n,l),t.flags|=262144}function Vi(e){for(e=e.firstContext;e!==null;){if(!Nt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function gl(e){ml=e,_n=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function dt(e){return af(ml,e)}function Zi(e,t){return ml===null&&gl(e),af(e,t)}function af(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},_n===null){if(e===null)throw Error(r(308));_n=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else _n=_n.next=t;return n}var Bg=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},Lg=u.unstable_scheduleCallback,Hg=u.unstable_NormalPriority,et={$$typeof:G,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Js(){return{controller:new Bg,data:new Map,refCount:0}}function Ua(e){e.refCount--,e.refCount===0&&Lg(Hg,function(){e.controller.abort()})}var Ya=null,Is=0,Zl=0,Kl=null;function Xg(e,t){if(Ya===null){var n=Ya=[];Is=0,Zl=Po(),Kl={status:"pending",value:void 0,then:function(l){n.push(l)}}}return Is++,t.then(uf,uf),t}function uf(){if(--Is===0&&Ya!==null){Kl!==null&&(Kl.status="fulfilled");var e=Ya;Ya=null,Zl=0,Kl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function qg(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(l.status="rejected",l.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),l}var sf=R.S;R.S=function(e,t){Gd=Ye(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Xg(e,t),sf!==null&&sf(e,t)};var yl=b(null);function Ws(){var e=yl.current;return e!==null?e:qe.pooledCache}function Ki(e,t){t===null?X(yl,yl.current):X(yl,t.pool)}function of(){var e=Ws();return e===null?null:{parent:et._currentValue,pool:e}}var Jl=Error(r(460)),Fs=Error(r(474)),Ji=Error(r(542)),Ii={then:function(){}};function rf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function cf(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(rn,rn),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,df(e),e;default:if(typeof t.status=="string")t.then(rn,rn);else{if(e=qe,e!==null&&100<e.shellSuspendCounter)throw Error(r(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=l}},function(l){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,df(e),e}throw hl=t,Jl}}function pl(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(hl=n,Jl):n}}var hl=null;function ff(){if(hl===null)throw Error(r(459));var e=hl;return hl=null,e}function df(e){if(e===Jl||e===Ji)throw Error(r(483))}var Il=null,Ba=0;function Wi(e){var t=Ba;return Ba+=1,Il===null&&(Il=[]),cf(Il,e,t)}function La(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Fi(e,t){throw t.$$typeof===z?Error(r(525)):(e=Object.prototype.toString.call(t),Error(r(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function _f(e){function t(x,v){if(e){var w=x.deletions;w===null?(x.deletions=[v],x.flags|=16):w.push(v)}}function n(x,v){if(!e)return null;for(;v!==null;)t(x,v),v=v.sibling;return null}function l(x){for(var v=new Map;x!==null;)x.key!==null?v.set(x.key,x):v.set(x.index,x),x=x.sibling;return v}function a(x,v){return x=fn(x,v),x.index=0,x.sibling=null,x}function i(x,v,w){return x.index=w,e?(w=x.alternate,w!==null?(w=w.index,w<v?(x.flags|=67108866,v):w):(x.flags|=67108866,v)):(x.flags|=1048576,v)}function c(x){return e&&x.alternate===null&&(x.flags|=67108866),x}function d(x,v,w,k){return v===null||v.tag!==6?(v=Ls(w,x.mode,k),v.return=x,v):(v=a(v,w),v.return=x,v)}function y(x,v,w,k){var ie=w.type;return ie===L?M(x,v,w.props.children,k,w.key):v!==null&&(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===ue&&pl(ie)===v.type)?(v=a(v,w.props),La(v,w),v.return=x,v):(v=Qi(w.type,w.key,w.props,null,x.mode,k),La(v,w),v.return=x,v)}function O(x,v,w,k){return v===null||v.tag!==4||v.stateNode.containerInfo!==w.containerInfo||v.stateNode.implementation!==w.implementation?(v=Hs(w,x.mode,k),v.return=x,v):(v=a(v,w.children||[]),v.return=x,v)}function M(x,v,w,k,ie){return v===null||v.tag!==7?(v=dl(w,x.mode,k,ie),v.return=x,v):(v=a(v,w),v.return=x,v)}function Y(x,v,w){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return v=Ls(""+v,x.mode,w),v.return=x,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case j:return w=Qi(v.type,v.key,v.props,null,x.mode,w),La(w,v),w.return=x,w;case B:return v=Hs(v,x.mode,w),v.return=x,v;case ue:return v=pl(v),Y(x,v,w)}if(ce(v)||Oe(v))return v=dl(v,x.mode,w,null),v.return=x,v;if(typeof v.then=="function")return Y(x,Wi(v),w);if(v.$$typeof===G)return Y(x,Zi(x,v),w);Fi(x,v)}return null}function C(x,v,w,k){var ie=v!==null?v.key:null;if(typeof w=="string"&&w!==""||typeof w=="number"||typeof w=="bigint")return ie!==null?null:d(x,v,""+w,k);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case j:return w.key===ie?y(x,v,w,k):null;case B:return w.key===ie?O(x,v,w,k):null;case ue:return w=pl(w),C(x,v,w,k)}if(ce(w)||Oe(w))return ie!==null?null:M(x,v,w,k,null);if(typeof w.then=="function")return C(x,v,Wi(w),k);if(w.$$typeof===G)return C(x,v,Zi(x,w),k);Fi(x,w)}return null}function A(x,v,w,k,ie){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return x=x.get(w)||null,d(v,x,""+k,ie);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case j:return x=x.get(k.key===null?w:k.key)||null,y(v,x,k,ie);case B:return x=x.get(k.key===null?w:k.key)||null,O(v,x,k,ie);case ue:return k=pl(k),A(x,v,w,k,ie)}if(ce(k)||Oe(k))return x=x.get(w)||null,M(v,x,k,ie,null);if(typeof k.then=="function")return A(x,v,w,Wi(k),ie);if(k.$$typeof===G)return A(x,v,w,Zi(v,k),ie);Fi(v,k)}return null}function F(x,v,w,k){for(var ie=null,Ae=null,P=v,he=v=0,we=null;P!==null&&he<w.length;he++){P.index>he?(we=P,P=null):we=P.sibling;var Ne=C(x,P,w[he],k);if(Ne===null){P===null&&(P=we);break}e&&P&&Ne.alternate===null&&t(x,P),v=i(Ne,v,he),Ae===null?ie=Ne:Ae.sibling=Ne,Ae=Ne,P=we}if(he===w.length)return n(x,P),Ce&&dn(x,he),ie;if(P===null){for(;he<w.length;he++)P=Y(x,w[he],k),P!==null&&(v=i(P,v,he),Ae===null?ie=P:Ae.sibling=P,Ae=P);return Ce&&dn(x,he),ie}for(P=l(P);he<w.length;he++)we=A(P,x,he,w[he],k),we!==null&&(e&&we.alternate!==null&&P.delete(we.key===null?he:we.key),v=i(we,v,he),Ae===null?ie=we:Ae.sibling=we,Ae=we);return e&&P.forEach(function(nl){return t(x,nl)}),Ce&&dn(x,he),ie}function se(x,v,w,k){if(w==null)throw Error(r(151));for(var ie=null,Ae=null,P=v,he=v=0,we=null,Ne=w.next();P!==null&&!Ne.done;he++,Ne=w.next()){P.index>he?(we=P,P=null):we=P.sibling;var nl=C(x,P,Ne.value,k);if(nl===null){P===null&&(P=we);break}e&&P&&nl.alternate===null&&t(x,P),v=i(nl,v,he),Ae===null?ie=nl:Ae.sibling=nl,Ae=nl,P=we}if(Ne.done)return n(x,P),Ce&&dn(x,he),ie;if(P===null){for(;!Ne.done;he++,Ne=w.next())Ne=Y(x,Ne.value,k),Ne!==null&&(v=i(Ne,v,he),Ae===null?ie=Ne:Ae.sibling=Ne,Ae=Ne);return Ce&&dn(x,he),ie}for(P=l(P);!Ne.done;he++,Ne=w.next())Ne=A(P,x,he,Ne.value,k),Ne!==null&&(e&&Ne.alternate!==null&&P.delete(Ne.key===null?he:Ne.key),v=i(Ne,v,he),Ae===null?ie=Ne:Ae.sibling=Ne,Ae=Ne);return e&&P.forEach(function(Py){return t(x,Py)}),Ce&&dn(x,he),ie}function He(x,v,w,k){if(typeof w=="object"&&w!==null&&w.type===L&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case j:e:{for(var ie=w.key;v!==null;){if(v.key===ie){if(ie=w.type,ie===L){if(v.tag===7){n(x,v.sibling),k=a(v,w.props.children),k.return=x,x=k;break e}}else if(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===ue&&pl(ie)===v.type){n(x,v.sibling),k=a(v,w.props),La(k,w),k.return=x,x=k;break e}n(x,v);break}else t(x,v);v=v.sibling}w.type===L?(k=dl(w.props.children,x.mode,k,w.key),k.return=x,x=k):(k=Qi(w.type,w.key,w.props,null,x.mode,k),La(k,w),k.return=x,x=k)}return c(x);case B:e:{for(ie=w.key;v!==null;){if(v.key===ie)if(v.tag===4&&v.stateNode.containerInfo===w.containerInfo&&v.stateNode.implementation===w.implementation){n(x,v.sibling),k=a(v,w.children||[]),k.return=x,x=k;break e}else{n(x,v);break}else t(x,v);v=v.sibling}k=Hs(w,x.mode,k),k.return=x,x=k}return c(x);case ue:return w=pl(w),He(x,v,w,k)}if(ce(w))return F(x,v,w,k);if(Oe(w)){if(ie=Oe(w),typeof ie!="function")throw Error(r(150));return w=ie.call(w),se(x,v,w,k)}if(typeof w.then=="function")return He(x,v,Wi(w),k);if(w.$$typeof===G)return He(x,v,Zi(x,w),k);Fi(x,w)}return typeof w=="string"&&w!==""||typeof w=="number"||typeof w=="bigint"?(w=""+w,v!==null&&v.tag===6?(n(x,v.sibling),k=a(v,w),k.return=x,x=k):(n(x,v),k=Ls(w,x.mode,k),k.return=x,x=k),c(x)):n(x,v)}return function(x,v,w,k){try{Ba=0;var ie=He(x,v,w,k);return Il=null,ie}catch(P){if(P===Jl||P===Ji)throw P;var Ae=Rt(29,P,null,x.mode);return Ae.lanes=k,Ae.return=x,Ae}}}var bl=_f(!0),mf=_f(!1),Ln=!1;function $s(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ps(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Hn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Re&2)!==0){var a=l.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),l.pending=t,t=qi(e),Wc(e,null,n),t}return Xi(e,l,t,n),qi(e)}function Ha(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ac(e,n)}}function eo(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var a=null,i=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};i===null?a=i=c:i=i.next=c,n=n.next}while(n!==null);i===null?a=i=t:i=i.next=t}else a=i=t;n={baseState:l.baseState,firstBaseUpdate:a,lastBaseUpdate:i,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var to=!1;function Xa(){if(to){var e=Kl;if(e!==null)throw e}}function qa(e,t,n,l){to=!1;var a=e.updateQueue;Ln=!1;var i=a.firstBaseUpdate,c=a.lastBaseUpdate,d=a.shared.pending;if(d!==null){a.shared.pending=null;var y=d,O=y.next;y.next=null,c===null?i=O:c.next=O,c=y;var M=e.alternate;M!==null&&(M=M.updateQueue,d=M.lastBaseUpdate,d!==c&&(d===null?M.firstBaseUpdate=O:d.next=O,M.lastBaseUpdate=y))}if(i!==null){var Y=a.baseState;c=0,M=O=y=null,d=i;do{var C=d.lane&-536870913,A=C!==d.lane;if(A?(Te&C)===C:(l&C)===C){C!==0&&C===Zl&&(to=!0),M!==null&&(M=M.next={lane:0,tag:d.tag,payload:d.payload,callback:null,next:null});e:{var F=e,se=d;C=t;var He=n;switch(se.tag){case 1:if(F=se.payload,typeof F=="function"){Y=F.call(He,Y,C);break e}Y=F;break e;case 3:F.flags=F.flags&-65537|128;case 0:if(F=se.payload,C=typeof F=="function"?F.call(He,Y,C):F,C==null)break e;Y=E({},Y,C);break e;case 2:Ln=!0}}C=d.callback,C!==null&&(e.flags|=64,A&&(e.flags|=8192),A=a.callbacks,A===null?a.callbacks=[C]:A.push(C))}else A={lane:C,tag:d.tag,payload:d.payload,callback:d.callback,next:null},M===null?(O=M=A,y=Y):M=M.next=A,c|=C;if(d=d.next,d===null){if(d=a.shared.pending,d===null)break;A=d,d=A.next,A.next=null,a.lastBaseUpdate=A,a.shared.pending=null}}while(!0);M===null&&(y=Y),a.baseState=y,a.firstBaseUpdate=O,a.lastBaseUpdate=M,i===null&&(a.shared.lanes=0),Zn|=c,e.lanes=c,e.memoizedState=Y}}function gf(e,t){if(typeof e!="function")throw Error(r(191,e));e.call(t)}function yf(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)gf(n[e],t)}var Wl=b(null),$i=b(0);function pf(e,t){e=En,X($i,e),X(Wl,t),En=e|t.baseLanes}function no(){X($i,En),X(Wl,Wl.current)}function lo(){En=$i.current,U(Wl),U($i)}var jt=b(null),Vt=null;function qn(e){var t=e.alternate;X($e,$e.current&1),X(jt,e),Vt===null&&(t===null||Wl.current!==null||t.memoizedState!==null)&&(Vt=e)}function ao(e){X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)}function hf(e){e.tag===22?(X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)):Qn()}function Qn(){X($e,$e.current),X(jt,jt.current)}function Mt(e){U(jt),Vt===e&&(Vt=null),U($e)}var $e=b(0);function Pi(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||fr(n)||dr(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var gn=0,ye=null,Be=null,tt=null,eu=!1,Fl=!1,vl=!1,tu=0,Qa=0,$l=null,Qg=0;function Ie(){throw Error(r(321))}function io(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Nt(e[n],t[n]))return!1;return!0}function uo(e,t,n,l,a,i){return gn=i,ye=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,R.H=e===null||e.memoizedState===null?td:So,vl=!1,i=n(l,a),vl=!1,Fl&&(i=vf(t,n,l,a)),bf(e),i}function bf(e){R.H=Za;var t=Be!==null&&Be.next!==null;if(gn=0,tt=Be=ye=null,eu=!1,Qa=0,$l=null,t)throw Error(r(300));e===null||nt||(e=e.dependencies,e!==null&&Vi(e)&&(nt=!0))}function vf(e,t,n,l){ye=e;var a=0;do{if(Fl&&($l=null),Qa=0,Fl=!1,25<=a)throw Error(r(301));if(a+=1,tt=Be=null,e.updateQueue!=null){var i=e.updateQueue;i.lastEffect=null,i.events=null,i.stores=null,i.memoCache!=null&&(i.memoCache.index=0)}R.H=nd,i=t(n,l)}while(Fl);return i}function Gg(){var e=R.H,t=e.useState()[0];return t=typeof t.then=="function"?Ga(t):t,e=e.useState()[0],(Be!==null?Be.memoizedState:null)!==e&&(ye.flags|=1024),t}function so(){var e=tu!==0;return tu=0,e}function oo(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function ro(e){if(eu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}eu=!1}gn=0,tt=Be=ye=null,Fl=!1,Qa=tu=0,$l=null}function ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?ye.memoizedState=tt=e:tt=tt.next=e,tt}function Pe(){if(Be===null){var e=ye.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=tt===null?ye.memoizedState:tt.next;if(t!==null)tt=t,Be=e;else{if(e===null)throw ye.alternate===null?Error(r(467)):Error(r(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},tt===null?ye.memoizedState=tt=e:tt=tt.next=e}return tt}function nu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ga(e){var t=Qa;return Qa+=1,$l===null&&($l=[]),e=cf($l,e,t),t=ye,(tt===null?t.memoizedState:tt.next)===null&&(t=t.alternate,R.H=t===null||t.memoizedState===null?td:So),e}function lu(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Ga(e);if(e.$$typeof===G)return dt(e)}throw Error(r(438,String(e)))}function co(e){var t=null,n=ye.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=ye.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=nu(),ye.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=le;return t.index++,n}function yn(e,t){return typeof t=="function"?t(e):t}function au(e){var t=Pe();return fo(t,Be,e)}function fo(e,t,n){var l=e.queue;if(l===null)throw Error(r(311));l.lastRenderedReducer=n;var a=e.baseQueue,i=l.pending;if(i!==null){if(a!==null){var c=a.next;a.next=i.next,i.next=c}t.baseQueue=a=i,l.pending=null}if(i=e.baseState,a===null)e.memoizedState=i;else{t=a.next;var d=c=null,y=null,O=t,M=!1;do{var Y=O.lane&-536870913;if(Y!==O.lane?(Te&Y)===Y:(gn&Y)===Y){var C=O.revertLane;if(C===0)y!==null&&(y=y.next={lane:0,revertLane:0,gesture:null,action:O.action,hasEagerState:O.hasEagerState,eagerState:O.eagerState,next:null}),Y===Zl&&(M=!0);else if((gn&C)===C){O=O.next,C===Zl&&(M=!0);continue}else Y={lane:0,revertLane:O.revertLane,gesture:null,action:O.action,hasEagerState:O.hasEagerState,eagerState:O.eagerState,next:null},y===null?(d=y=Y,c=i):y=y.next=Y,ye.lanes|=C,Zn|=C;Y=O.action,vl&&n(i,Y),i=O.hasEagerState?O.eagerState:n(i,Y)}else C={lane:Y,revertLane:O.revertLane,gesture:O.gesture,action:O.action,hasEagerState:O.hasEagerState,eagerState:O.eagerState,next:null},y===null?(d=y=C,c=i):y=y.next=C,ye.lanes|=Y,Zn|=Y;O=O.next}while(O!==null&&O!==t);if(y===null?c=i:y.next=d,!Nt(i,e.memoizedState)&&(nt=!0,M&&(n=Kl,n!==null)))throw n;e.memoizedState=i,e.baseState=c,e.baseQueue=y,l.lastRenderedState=i}return a===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function _o(e){var t=Pe(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var l=n.dispatch,a=n.pending,i=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do i=e(i,c.action),c=c.next;while(c!==a);Nt(i,t.memoizedState)||(nt=!0),t.memoizedState=i,t.baseQueue===null&&(t.baseState=i),n.lastRenderedState=i}return[i,l]}function xf(e,t,n){var l=ye,a=Pe(),i=Ce;if(i){if(n===void 0)throw Error(r(407));n=n()}else n=t();var c=!Nt((Be||a).memoizedState,n);if(c&&(a.memoizedState=n,nt=!0),a=a.queue,yo(Tf.bind(null,l,a,e),[e]),a.getSnapshot!==t||c||tt!==null&&tt.memoizedState.tag&1){if(l.flags|=2048,Pl(9,{destroy:void 0},Ef.bind(null,l,a,n,t),null),qe===null)throw Error(r(349));i||(gn&127)!==0||Sf(l,t,n)}return n}function Sf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ye.updateQueue,t===null?(t=nu(),ye.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Ef(e,t,n,l){t.value=n,t.getSnapshot=l,wf(t)&&Of(e)}function Tf(e,t,n){return n(function(){wf(t)&&Of(e)})}function wf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Nt(e,n)}catch{return!0}}function Of(e){var t=fl(e,2);t!==null&&Ot(t,e,2)}function mo(e){var t=ht();if(typeof e=="function"){var n=e;if(e=n(),vl){jn(!0);try{n()}finally{jn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:e},t}function Cf(e,t,n,l){return e.baseState=n,fo(e,Be,typeof l=="function"?l:yn)}function Vg(e,t,n,l,a){if(su(e))throw Error(r(485));if(e=t.action,e!==null){var i={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){i.listeners.push(c)}};R.T!==null?n(!0):i.isTransition=!1,l(i),n=t.pending,n===null?(i.next=t.pending=i,zf(t,i)):(i.next=n.next,t.pending=n.next=i)}}function zf(e,t){var n=t.action,l=t.payload,a=e.state;if(t.isTransition){var i=R.T,c={};R.T=c;try{var d=n(a,l),y=R.S;y!==null&&y(c,d),Af(e,t,d)}catch(O){go(e,t,O)}finally{i!==null&&c.types!==null&&(i.types=c.types),R.T=i}}else try{i=n(a,l),Af(e,t,i)}catch(O){go(e,t,O)}}function Af(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Nf(e,t,l)},function(l){return go(e,t,l)}):Nf(e,t,n)}function Nf(e,t,n){t.status="fulfilled",t.value=n,Rf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,zf(e,n)))}function go(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,Rf(t),t=t.next;while(t!==l)}e.action=null}function Rf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function jf(e,t){return t}function Mf(e,t){if(Ce){var n=qe.formState;if(n!==null){e:{var l=ye;if(Ce){if(Ve){t:{for(var a=Ve,i=Gt;a.nodeType!==8;){if(!i){a=null;break t}if(a=Zt(a.nextSibling),a===null){a=null;break t}}i=a.data,a=i==="F!"||i==="F"?a:null}if(a){Ve=Zt(a.nextSibling),l=a.data==="F!";break e}}Yn(l)}l=!1}l&&(t=n[0])}}return n=ht(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:jf,lastRenderedState:t},n.queue=l,n=$f.bind(null,ye,l),l.dispatch=n,l=mo(!1),i=xo.bind(null,ye,!1,l.queue),l=ht(),a={state:t,dispatch:null,action:e,pending:null},l.queue=a,n=Vg.bind(null,ye,a,i,n),a.dispatch=n,l.memoizedState=e,[t,n,!1]}function Df(e){var t=Pe();return kf(t,Be,e)}function kf(e,t,n){if(t=fo(e,t,jf)[0],e=au(yn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Ga(t)}catch(c){throw c===Jl?Ji:c}else l=t;t=Pe();var a=t.queue,i=a.dispatch;return n!==t.memoizedState&&(ye.flags|=2048,Pl(9,{destroy:void 0},Zg.bind(null,a,n),null)),[l,i,e]}function Zg(e,t){e.action=t}function Uf(e){var t=Pe(),n=Be;if(n!==null)return kf(t,n,e);Pe(),t=t.memoizedState,n=Pe();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function Pl(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=ye.updateQueue,t===null&&(t=nu(),ye.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function Yf(){return Pe().memoizedState}function iu(e,t,n,l){var a=ht();ye.flags|=e,a.memoizedState=Pl(1|t,{destroy:void 0},n,l===void 0?null:l)}function uu(e,t,n,l){var a=Pe();l=l===void 0?null:l;var i=a.memoizedState.inst;Be!==null&&l!==null&&io(l,Be.memoizedState.deps)?a.memoizedState=Pl(t,i,n,l):(ye.flags|=e,a.memoizedState=Pl(1|t,i,n,l))}function Bf(e,t){iu(8390656,8,e,t)}function yo(e,t){uu(2048,8,e,t)}function Kg(e){ye.flags|=4;var t=ye.updateQueue;if(t===null)t=nu(),ye.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Lf(e){var t=Pe().memoizedState;return Kg({ref:t,nextImpl:e}),function(){if((Re&2)!==0)throw Error(r(440));return t.impl.apply(void 0,arguments)}}function Hf(e,t){return uu(4,2,e,t)}function Xf(e,t){return uu(4,4,e,t)}function qf(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Qf(e,t,n){n=n!=null?n.concat([e]):null,uu(4,4,qf.bind(null,t,e),n)}function po(){}function Gf(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&io(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function Vf(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&io(t,l[1]))return l[0];if(l=e(),vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l}function ho(e,t,n){return n===void 0||(gn&1073741824)!==0&&(Te&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Zd(),ye.lanes|=e,Zn|=e,n)}function Zf(e,t,n,l){return Nt(n,t)?n:Wl.current!==null?(e=ho(e,n,l),Nt(e,t)||(nt=!0),e):(gn&42)===0||(gn&1073741824)!==0&&(Te&261930)===0?(nt=!0,e.memoizedState=n):(e=Zd(),ye.lanes|=e,Zn|=e,t)}function Kf(e,t,n,l,a){var i=q.p;q.p=i!==0&&8>i?i:8;var c=R.T,d={};R.T=d,xo(e,!1,t,n);try{var y=a(),O=R.S;if(O!==null&&O(d,y),y!==null&&typeof y=="object"&&typeof y.then=="function"){var M=qg(y,l);Va(e,t,M,Ut(e))}else Va(e,t,l,Ut(e))}catch(Y){Va(e,t,{then:function(){},status:"rejected",reason:Y},Ut())}finally{q.p=i,c!==null&&d.types!==null&&(c.types=d.types),R.T=c}}function Jg(){}function bo(e,t,n,l){if(e.tag!==5)throw Error(r(476));var a=Jf(e).queue;Kf(e,a,t,K,n===null?Jg:function(){return If(e),n(l)})}function Jf(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:K},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function If(e){var t=Jf(e);t.next===null&&(t=e.alternate.memoizedState),Va(e,t.next.queue,{},Ut())}function vo(){return dt(oi)}function Wf(){return Pe().memoizedState}function Ff(){return Pe().memoizedState}function Ig(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Ut();e=Hn(n);var l=Xn(t,e,n);l!==null&&(Ot(l,t,n),Ha(l,t,n)),t={cache:Js()},e.payload=t;return}t=t.return}}function Wg(e,t,n){var l=Ut();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},su(e)?Pf(t,n):(n=Ys(e,t,n,l),n!==null&&(Ot(n,e,l),ed(n,t,l)))}function $f(e,t,n){var l=Ut();Va(e,t,n,l)}function Va(e,t,n,l){var a={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(su(e))Pf(t,a);else{var i=e.alternate;if(e.lanes===0&&(i===null||i.lanes===0)&&(i=t.lastRenderedReducer,i!==null))try{var c=t.lastRenderedState,d=i(c,n);if(a.hasEagerState=!0,a.eagerState=d,Nt(d,c))return Xi(e,t,a,0),qe===null&&Hi(),!1}catch{}if(n=Ys(e,t,a,l),n!==null)return Ot(n,e,l),ed(n,t,l),!0}return!1}function xo(e,t,n,l){if(l={lane:2,revertLane:Po(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},su(e)){if(t)throw Error(r(479))}else t=Ys(e,n,l,2),t!==null&&Ot(t,e,2)}function su(e){var t=e.alternate;return e===ye||t!==null&&t===ye}function Pf(e,t){Fl=eu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function ed(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ac(e,n)}}var Za={readContext:dt,use:lu,useCallback:Ie,useContext:Ie,useEffect:Ie,useImperativeHandle:Ie,useLayoutEffect:Ie,useInsertionEffect:Ie,useMemo:Ie,useReducer:Ie,useRef:Ie,useState:Ie,useDebugValue:Ie,useDeferredValue:Ie,useTransition:Ie,useSyncExternalStore:Ie,useId:Ie,useHostTransitionStatus:Ie,useFormState:Ie,useActionState:Ie,useOptimistic:Ie,useMemoCache:Ie,useCacheRefresh:Ie};Za.useEffectEvent=Ie;var td={readContext:dt,use:lu,useCallback:function(e,t){return ht().memoizedState=[e,t===void 0?null:t],e},useContext:dt,useEffect:Bf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,iu(4194308,4,qf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return iu(4194308,4,e,t)},useInsertionEffect:function(e,t){iu(4,2,e,t)},useMemo:function(e,t){var n=ht();t=t===void 0?null:t;var l=e();if(vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=ht();if(n!==void 0){var a=n(t);if(vl){jn(!0);try{n(t)}finally{jn(!1)}}}else a=t;return l.memoizedState=l.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},l.queue=e,e=e.dispatch=Wg.bind(null,ye,e),[l.memoizedState,e]},useRef:function(e){var t=ht();return e={current:e},t.memoizedState=e},useState:function(e){e=mo(e);var t=e.queue,n=$f.bind(null,ye,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:po,useDeferredValue:function(e,t){var n=ht();return ho(n,e,t)},useTransition:function(){var e=mo(!1);return e=Kf.bind(null,ye,e.queue,!0,!1),ht().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=ye,a=ht();if(Ce){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),qe===null)throw Error(r(349));(Te&127)!==0||Sf(l,t,n)}a.memoizedState=n;var i={value:n,getSnapshot:t};return a.queue=i,Bf(Tf.bind(null,l,i,e),[e]),l.flags|=2048,Pl(9,{destroy:void 0},Ef.bind(null,l,i,n,t),null),n},useId:function(){var e=ht(),t=qe.identifierPrefix;if(Ce){var n=nn,l=tn;n=(l&~(1<<32-At(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=tu++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Qg++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:vo,useFormState:Mf,useActionState:Mf,useOptimistic:function(e){var t=ht();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=xo.bind(null,ye,!0,n),n.dispatch=t,[e,t]},useMemoCache:co,useCacheRefresh:function(){return ht().memoizedState=Ig.bind(null,ye)},useEffectEvent:function(e){var t=ht(),n={impl:e};return t.memoizedState=n,function(){if((Re&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}},So={readContext:dt,use:lu,useCallback:Gf,useContext:dt,useEffect:yo,useImperativeHandle:Qf,useInsertionEffect:Hf,useLayoutEffect:Xf,useMemo:Vf,useReducer:au,useRef:Yf,useState:function(){return au(yn)},useDebugValue:po,useDeferredValue:function(e,t){var n=Pe();return Zf(n,Be.memoizedState,e,t)},useTransition:function(){var e=au(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Ga(e),t]},useSyncExternalStore:xf,useId:Wf,useHostTransitionStatus:vo,useFormState:Df,useActionState:Df,useOptimistic:function(e,t){var n=Pe();return Cf(n,Be,e,t)},useMemoCache:co,useCacheRefresh:Ff};So.useEffectEvent=Lf;var nd={readContext:dt,use:lu,useCallback:Gf,useContext:dt,useEffect:yo,useImperativeHandle:Qf,useInsertionEffect:Hf,useLayoutEffect:Xf,useMemo:Vf,useReducer:_o,useRef:Yf,useState:function(){return _o(yn)},useDebugValue:po,useDeferredValue:function(e,t){var n=Pe();return Be===null?ho(n,e,t):Zf(n,Be.memoizedState,e,t)},useTransition:function(){var e=_o(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Ga(e),t]},useSyncExternalStore:xf,useId:Wf,useHostTransitionStatus:vo,useFormState:Uf,useActionState:Uf,useOptimistic:function(e,t){var n=Pe();return Be!==null?Cf(n,Be,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:co,useCacheRefresh:Ff};nd.useEffectEvent=Lf;function Eo(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var To={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=Ut(),a=Hn(l);a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ot(t,e,l),Ha(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=Ut(),a=Hn(l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ot(t,e,l),Ha(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ut(),l=Hn(n);l.tag=2,t!=null&&(l.callback=t),t=Xn(e,l,n),t!==null&&(Ot(t,e,n),Ha(t,e,n))}};function ld(e,t,n,l,a,i,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,i,c):t.prototype&&t.prototype.isPureReactComponent?!ja(n,l)||!ja(a,i):!0}function ad(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&To.enqueueReplaceState(t,t.state,null)}function xl(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=E({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function id(e){Li(e)}function ud(e){console.error(e)}function sd(e){Li(e)}function ou(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function od(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function wo(e,t,n){return n=Hn(n),n.tag=3,n.payload={element:null},n.callback=function(){ou(e,t)},n}function rd(e){return e=Hn(e),e.tag=3,e}function cd(e,t,n,l){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var i=l.value;e.payload=function(){return a(i)},e.callback=function(){od(t,n,l)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){od(t,n,l),typeof a!="function"&&(Kn===null?Kn=new Set([this]):Kn.add(this));var d=l.stack;this.componentDidCatch(l.value,{componentStack:d!==null?d:""})})}function Fg(e,t,n,l,a){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&Vl(t,n,a,!0),n=jt.current,n!==null){switch(n.tag){case 31:case 13:return Vt===null?vu():n.alternate===null&&We===0&&(We=3),n.flags&=-257,n.flags|=65536,n.lanes=a,l===Ii?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),Wo(e,l,a)),!1;case 22:return n.flags|=65536,l===Ii?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),Wo(e,l,a)),!1}throw Error(r(435,n.tag))}return Wo(e,l,a),vu(),!1}if(Ce)return t=jt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,l!==Qs&&(e=Error(r(422),{cause:l}),ka(Xt(e,n)))):(l!==Qs&&(t=Error(r(423),{cause:l}),ka(Xt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,l=Xt(l,n),a=wo(e.stateNode,l,a),eo(e,a),We!==4&&(We=2)),!1;var i=Error(r(520),{cause:l});if(i=Xt(i,n),ei===null?ei=[i]:ei.push(i),We!==4&&(We=2),t===null)return!0;l=Xt(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=wo(n.stateNode,l,e),eo(n,e),!1;case 1:if(t=n.type,i=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||i!==null&&typeof i.componentDidCatch=="function"&&(Kn===null||!Kn.has(i))))return n.flags|=65536,a&=-a,n.lanes|=a,a=rd(a),cd(a,e,n,l),eo(n,a),!1}n=n.return}while(n!==null);return!1}var Oo=Error(r(461)),nt=!1;function _t(e,t,n,l){t.child=e===null?mf(t,null,n,l):bl(t,e.child,n,l)}function fd(e,t,n,l,a){n=n.render;var i=t.ref;if("ref"in l){var c={};for(var d in l)d!=="ref"&&(c[d]=l[d])}else c=l;return gl(t),l=uo(e,t,n,c,i,a),d=so(),e!==null&&!nt?(oo(e,t,a),pn(e,t,a)):(Ce&&d&&Xs(t),t.flags|=1,_t(e,t,l,a),t.child)}function dd(e,t,n,l,a){if(e===null){var i=n.type;return typeof i=="function"&&!Bs(i)&&i.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=i,_d(e,t,i,l,a)):(e=Qi(n.type,null,l,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(i=e.child,!Do(e,a)){var c=i.memoizedProps;if(n=n.compare,n=n!==null?n:ja,n(c,l)&&e.ref===t.ref)return pn(e,t,a)}return t.flags|=1,e=fn(i,l),e.ref=t.ref,e.return=t,t.child=e}function _d(e,t,n,l,a){if(e!==null){var i=e.memoizedProps;if(ja(i,l)&&e.ref===t.ref)if(nt=!1,t.pendingProps=l=i,Do(e,a))(e.flags&131072)!==0&&(nt=!0);else return t.lanes=e.lanes,pn(e,t,a)}return Co(e,t,n,l,a)}function md(e,t,n,l){var a=l.children,i=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(i=i!==null?i.baseLanes|n:n,e!==null){for(l=t.child=e.child,a=0;l!==null;)a=a|l.lanes|l.childLanes,l=l.sibling;l=a&~i}else l=0,t.child=null;return gd(e,t,i,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ki(t,i!==null?i.cachePool:null),i!==null?pf(t,i):no(),hf(t);else return l=t.lanes=536870912,gd(e,t,i!==null?i.baseLanes|n:n,n,l)}else i!==null?(Ki(t,i.cachePool),pf(t,i),Qn(),t.memoizedState=null):(e!==null&&Ki(t,null),no(),Qn());return _t(e,t,a,n),t.child}function Ka(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function gd(e,t,n,l,a){var i=Ws();return i=i===null?null:{parent:et._currentValue,pool:i},t.memoizedState={baseLanes:n,cachePool:i},e!==null&&Ki(t,null),no(),hf(t),e!==null&&Vl(e,t,l,!0),t.childLanes=a,null}function ru(e,t){return t=fu({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function yd(e,t,n){return bl(t,e.child,null,n),e=ru(t,t.pendingProps),e.flags|=2,Mt(t),t.memoizedState=null,e}function $g(e,t,n){var l=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Ce){if(l.mode==="hidden")return e=ru(t,l),t.lanes=536870912,Ka(null,e);if(ao(t),(e=Ve)?(e=z_(e,Gt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=$c(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return t.lanes=536870912,null}return ru(t,l)}var i=e.memoizedState;if(i!==null){var c=i.dehydrated;if(ao(t),a)if(t.flags&256)t.flags&=-257,t=yd(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(r(558));else if(nt||Vl(e,t,n,!1),a=(n&e.childLanes)!==0,nt||a){if(l=qe,l!==null&&(c=ic(l,n),c!==0&&c!==i.retryLane))throw i.retryLane=c,fl(e,c),Ot(l,e,c),Oo;vu(),t=yd(e,t,n)}else e=i.treeContext,Ve=Zt(c.nextSibling),ft=t,Ce=!0,Un=null,Gt=!1,e!==null&&tf(t,e),t=ru(t,l),t.flags|=4096;return t}return e=fn(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function cu(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(r(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Co(e,t,n,l,a){return gl(t),n=uo(e,t,n,l,void 0,a),l=so(),e!==null&&!nt?(oo(e,t,a),pn(e,t,a)):(Ce&&l&&Xs(t),t.flags|=1,_t(e,t,n,a),t.child)}function pd(e,t,n,l,a,i){return gl(t),t.updateQueue=null,n=vf(t,l,n,a),bf(e),l=so(),e!==null&&!nt?(oo(e,t,i),pn(e,t,i)):(Ce&&l&&Xs(t),t.flags|=1,_t(e,t,n,i),t.child)}function hd(e,t,n,l,a){if(gl(t),t.stateNode===null){var i=Xl,c=n.contextType;typeof c=="object"&&c!==null&&(i=dt(c)),i=new n(l,i),t.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,i.updater=To,t.stateNode=i,i._reactInternals=t,i=t.stateNode,i.props=l,i.state=t.memoizedState,i.refs={},$s(t),c=n.contextType,i.context=typeof c=="object"&&c!==null?dt(c):Xl,i.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(Eo(t,n,c,l),i.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(c=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),c!==i.state&&To.enqueueReplaceState(i,i.state,null),qa(t,l,i,a),Xa(),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){i=t.stateNode;var d=t.memoizedProps,y=xl(n,d);i.props=y;var O=i.context,M=n.contextType;c=Xl,typeof M=="object"&&M!==null&&(c=dt(M));var Y=n.getDerivedStateFromProps;M=typeof Y=="function"||typeof i.getSnapshotBeforeUpdate=="function",d=t.pendingProps!==d,M||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(d||O!==c)&&ad(t,i,l,c),Ln=!1;var C=t.memoizedState;i.state=C,qa(t,l,i,a),Xa(),O=t.memoizedState,d||C!==O||Ln?(typeof Y=="function"&&(Eo(t,n,Y,l),O=t.memoizedState),(y=Ln||ld(t,n,y,l,C,O,c))?(M||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount()),typeof i.componentDidMount=="function"&&(t.flags|=4194308)):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=O),i.props=l,i.state=O,i.context=c,l=y):(typeof i.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{i=t.stateNode,Ps(e,t),c=t.memoizedProps,M=xl(n,c),i.props=M,Y=t.pendingProps,C=i.context,O=n.contextType,y=Xl,typeof O=="object"&&O!==null&&(y=dt(O)),d=n.getDerivedStateFromProps,(O=typeof d=="function"||typeof i.getSnapshotBeforeUpdate=="function")||typeof i.UNSAFE_componentWillReceiveProps!="function"&&typeof i.componentWillReceiveProps!="function"||(c!==Y||C!==y)&&ad(t,i,l,y),Ln=!1,C=t.memoizedState,i.state=C,qa(t,l,i,a),Xa();var A=t.memoizedState;c!==Y||C!==A||Ln||e!==null&&e.dependencies!==null&&Vi(e.dependencies)?(typeof d=="function"&&(Eo(t,n,d,l),A=t.memoizedState),(M=Ln||ld(t,n,M,l,C,A,y)||e!==null&&e.dependencies!==null&&Vi(e.dependencies))?(O||typeof i.UNSAFE_componentWillUpdate!="function"&&typeof i.componentWillUpdate!="function"||(typeof i.componentWillUpdate=="function"&&i.componentWillUpdate(l,A,y),typeof i.UNSAFE_componentWillUpdate=="function"&&i.UNSAFE_componentWillUpdate(l,A,y)),typeof i.componentDidUpdate=="function"&&(t.flags|=4),typeof i.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=A),i.props=l,i.state=A,i.context=y,l=M):(typeof i.componentDidUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=4),typeof i.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&C===e.memoizedState||(t.flags|=1024),l=!1)}return i=l,cu(e,t),l=(t.flags&128)!==0,i||l?(i=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:i.render(),t.flags|=1,e!==null&&l?(t.child=bl(t,e.child,null,a),t.child=bl(t,null,n,a)):_t(e,t,n,a),t.memoizedState=i.state,e=t.child):e=pn(e,t,a),e}function bd(e,t,n,l){return _l(),t.flags|=256,_t(e,t,n,l),t.child}var zo={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ao(e){return{baseLanes:e,cachePool:of()}}function No(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=kt),e}function vd(e,t,n){var l=t.pendingProps,a=!1,i=(t.flags&128)!==0,c;if((c=i)||(c=e!==null&&e.memoizedState===null?!1:($e.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(Ce){if(a?qn(t):Qn(),(e=Ve)?(e=z_(e,Gt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=$c(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return dr(e)?t.lanes=32:t.lanes=536870912,null}var d=l.children;return l=l.fallback,a?(Qn(),a=t.mode,d=fu({mode:"hidden",children:d},a),l=dl(l,a,n,null),d.return=t,l.return=t,d.sibling=l,t.child=d,l=t.child,l.memoizedState=Ao(n),l.childLanes=No(e,c,n),t.memoizedState=zo,Ka(null,l)):(qn(t),Ro(t,d))}var y=e.memoizedState;if(y!==null&&(d=y.dehydrated,d!==null)){if(i)t.flags&256?(qn(t),t.flags&=-257,t=jo(e,t,n)):t.memoizedState!==null?(Qn(),t.child=e.child,t.flags|=128,t=null):(Qn(),d=l.fallback,a=t.mode,l=fu({mode:"visible",children:l.children},a),d=dl(d,a,n,null),d.flags|=2,l.return=t,d.return=t,l.sibling=d,t.child=l,bl(t,e.child,null,n),l=t.child,l.memoizedState=Ao(n),l.childLanes=No(e,c,n),t.memoizedState=zo,t=Ka(null,l));else if(qn(t),dr(d)){if(c=d.nextSibling&&d.nextSibling.dataset,c)var O=c.dgst;c=O,l=Error(r(419)),l.stack="",l.digest=c,ka({value:l,source:null,stack:null}),t=jo(e,t,n)}else if(nt||Vl(e,t,n,!1),c=(n&e.childLanes)!==0,nt||c){if(c=qe,c!==null&&(l=ic(c,n),l!==0&&l!==y.retryLane))throw y.retryLane=l,fl(e,l),Ot(c,e,l),Oo;fr(d)||vu(),t=jo(e,t,n)}else fr(d)?(t.flags|=192,t.child=e.child,t=null):(e=y.treeContext,Ve=Zt(d.nextSibling),ft=t,Ce=!0,Un=null,Gt=!1,e!==null&&tf(t,e),t=Ro(t,l.children),t.flags|=4096);return t}return a?(Qn(),d=l.fallback,a=t.mode,y=e.child,O=y.sibling,l=fn(y,{mode:"hidden",children:l.children}),l.subtreeFlags=y.subtreeFlags&65011712,O!==null?d=fn(O,d):(d=dl(d,a,n,null),d.flags|=2),d.return=t,l.return=t,l.sibling=d,t.child=l,Ka(null,l),l=t.child,d=e.child.memoizedState,d===null?d=Ao(n):(a=d.cachePool,a!==null?(y=et._currentValue,a=a.parent!==y?{parent:y,pool:y}:a):a=of(),d={baseLanes:d.baseLanes|n,cachePool:a}),l.memoizedState=d,l.childLanes=No(e,c,n),t.memoizedState=zo,Ka(e.child,l)):(qn(t),n=e.child,e=n.sibling,n=fn(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function Ro(e,t){return t=fu({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function fu(e,t){return e=Rt(22,e,null,t),e.lanes=0,e}function jo(e,t,n){return bl(t,e.child,null,n),e=Ro(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function xd(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),Zs(e.return,t,n)}function Mo(e,t,n,l,a,i){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:a,treeForkCount:i}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=l,c.tail=n,c.tailMode=a,c.treeForkCount=i)}function Sd(e,t,n){var l=t.pendingProps,a=l.revealOrder,i=l.tail;l=l.children;var c=$e.current,d=(c&2)!==0;if(d?(c=c&1|2,t.flags|=128):c&=1,X($e,c),_t(e,t,l,n),l=Ce?Da:0,!d&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&xd(e,n,t);else if(e.tag===19)xd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&Pi(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Mo(t,!1,a,n,i,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&Pi(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Mo(t,!0,n,null,i,l);break;case"together":Mo(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function pn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Vl(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=fn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=fn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Do(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Vi(e)))}function Pg(e,t,n){switch(t.tag){case 3:Je(t,t.stateNode.containerInfo),Bn(t,et,e.memoizedState.cache),_l();break;case 27:case 5:Yt(t);break;case 4:Je(t,t.stateNode.containerInfo);break;case 10:Bn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,ao(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(qn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?vd(e,t,n):(qn(t),e=pn(e,t,n),e!==null?e.sibling:null);qn(t);break;case 19:var a=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(Vl(e,t,n,!1),l=(n&t.childLanes)!==0),a){if(l)return Sd(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),X($e,$e.current),l)break;return null;case 22:return t.lanes=0,md(e,t,n,t.pendingProps);case 24:Bn(t,et,e.memoizedState.cache)}return pn(e,t,n)}function Ed(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)nt=!0;else{if(!Do(e,n)&&(t.flags&128)===0)return nt=!1,Pg(e,t,n);nt=(e.flags&131072)!==0}else nt=!1,Ce&&(t.flags&1048576)!==0&&ef(t,Da,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=pl(t.elementType),t.type=e,typeof e=="function")Bs(e)?(l=xl(e,l),t.tag=1,t=hd(null,t,e,l,n)):(t.tag=0,t=Co(null,t,e,l,n));else{if(e!=null){var a=e.$$typeof;if(a===Q){t.tag=11,t=fd(null,t,e,l,n);break e}else if(a===W){t.tag=14,t=dd(null,t,e,l,n);break e}}throw t=Xe(e)||e,Error(r(306,t,""))}}return t;case 0:return Co(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,a=xl(l,t.pendingProps),hd(e,t,l,a,n);case 3:e:{if(Je(t,t.stateNode.containerInfo),e===null)throw Error(r(387));l=t.pendingProps;var i=t.memoizedState;a=i.element,Ps(e,t),qa(t,l,null,n);var c=t.memoizedState;if(l=c.cache,Bn(t,et,l),l!==i.cache&&Ks(t,[et],n,!0),Xa(),l=c.element,i.isDehydrated)if(i={element:l,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=i,t.memoizedState=i,t.flags&256){t=bd(e,t,l,n);break e}else if(l!==a){a=Xt(Error(r(424)),t),ka(a),t=bd(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ve=Zt(e.firstChild),ft=t,Ce=!0,Un=null,Gt=!0,n=mf(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(_l(),l===a){t=pn(e,t,n);break e}_t(e,t,l,n)}t=t.child}return t;case 26:return cu(e,t),e===null?(n=D_(t.type,null,t.pendingProps,null))?t.memoizedState=n:Ce||(n=t.type,e=t.pendingProps,l=Cu(pe.current).createElement(n),l[ct]=t,l[vt]=e,mt(l,n,e),st(l),t.stateNode=l):t.memoizedState=D_(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Yt(t),e===null&&Ce&&(l=t.stateNode=R_(t.type,t.pendingProps,pe.current),ft=t,Gt=!0,a=Ve,Fn(t.type)?(_r=a,Ve=Zt(l.firstChild)):Ve=a),_t(e,t,t.pendingProps.children,n),cu(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Ce&&((a=l=Ve)&&(l=Ay(l,t.type,t.pendingProps,Gt),l!==null?(t.stateNode=l,ft=t,Ve=Zt(l.firstChild),Gt=!1,a=!0):a=!1),a||Yn(t)),Yt(t),a=t.type,i=t.pendingProps,c=e!==null?e.memoizedProps:null,l=i.children,or(a,i)?l=null:c!==null&&or(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=uo(e,t,Gg,null,null,n),oi._currentValue=a),cu(e,t),_t(e,t,l,n),t.child;case 6:return e===null&&Ce&&((e=n=Ve)&&(n=Ny(n,t.pendingProps,Gt),n!==null?(t.stateNode=n,ft=t,Ve=null,e=!0):e=!1),e||Yn(t)),null;case 13:return vd(e,t,n);case 4:return Je(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=bl(t,null,l,n):_t(e,t,l,n),t.child;case 11:return fd(e,t,t.type,t.pendingProps,n);case 7:return _t(e,t,t.pendingProps,n),t.child;case 8:return _t(e,t,t.pendingProps.children,n),t.child;case 12:return _t(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,Bn(t,t.type,l.value),_t(e,t,l.children,n),t.child;case 9:return a=t.type._context,l=t.pendingProps.children,gl(t),a=dt(a),l=l(a),t.flags|=1,_t(e,t,l,n),t.child;case 14:return dd(e,t,t.type,t.pendingProps,n);case 15:return _d(e,t,t.type,t.pendingProps,n);case 19:return Sd(e,t,n);case 31:return $g(e,t,n);case 22:return md(e,t,n,t.pendingProps);case 24:return gl(t),l=dt(et),e===null?(a=Ws(),a===null&&(a=qe,i=Js(),a.pooledCache=i,i.refCount++,i!==null&&(a.pooledCacheLanes|=n),a=i),t.memoizedState={parent:l,cache:a},$s(t),Bn(t,et,a)):((e.lanes&n)!==0&&(Ps(e,t),qa(t,null,null,n),Xa()),a=e.memoizedState,i=t.memoizedState,a.parent!==l?(a={parent:l,cache:l},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Bn(t,et,l)):(l=i.cache,Bn(t,et,l),l!==a.cache&&Ks(t,[et],n,!0))),_t(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(r(156,t.tag))}function hn(e){e.flags|=4}function ko(e,t,n,l,a){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(Wd())e.flags|=8192;else throw hl=Ii,Fs}else e.flags&=-16777217}function Td(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!L_(t))if(Wd())e.flags|=8192;else throw hl=Ii,Fs}function du(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?nc():536870912,e.lanes|=t,la|=t)}function Ja(e,t){if(!Ce)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags&65011712,l|=a.flags&65011712,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags,l|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function ey(e,t,n){var l=t.pendingProps;switch(qs(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return Ze(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),mn(et),Me(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gl(t)?hn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Gs())),Ze(t),null;case 26:var a=t.type,i=t.memoizedState;return e===null?(hn(t),i!==null?(Ze(t),Td(t,i)):(Ze(t),ko(t,a,null,l,n))):i?i!==e.memoizedState?(hn(t),Ze(t),Td(t,i)):(Ze(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&hn(t),Ze(t),ko(t,a,e,l,n)),null;case 27:if(It(t),n=pe.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}e=J.current,Gl(t)?nf(t):(e=R_(a,l,n),t.stateNode=e,hn(t))}return Ze(t),null;case 5:if(It(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}if(i=J.current,Gl(t))nf(t);else{var c=Cu(pe.current);switch(i){case 1:i=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:i=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":i=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":i=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":i=c.createElement("div"),i.innerHTML="<script><\/script>",i=i.removeChild(i.firstChild);break;case"select":i=typeof l.is=="string"?c.createElement("select",{is:l.is}):c.createElement("select"),l.multiple?i.multiple=!0:l.size&&(i.size=l.size);break;default:i=typeof l.is=="string"?c.createElement(a,{is:l.is}):c.createElement(a)}}i[ct]=t,i[vt]=l;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)i.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=i;e:switch(mt(i,a,l),a){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&hn(t)}}return Ze(t),ko(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(r(166));if(e=pe.current,Gl(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,a=ft,a!==null)switch(a.tag){case 27:case 5:l=a.memoizedProps}e[ct]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||v_(e.nodeValue,n)),e||Yn(t,!0)}else e=Cu(e).createTextNode(l),e[ct]=t,t.stateNode=e}return Ze(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=Gl(t),n!==null){if(e===null){if(!l)throw Error(r(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(557));e[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),e=!1}else n=Gs(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Mt(t),t):(Mt(t),null);if((t.flags&128)!==0)throw Error(r(558))}return Ze(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!a)throw Error(r(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(r(317));a[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),a=!1}else a=Gs(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Mt(t),t):(Mt(t),null)}return Mt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,a=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(a=l.alternate.memoizedState.cachePool.pool),i=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(i=l.memoizedState.cachePool.pool),i!==a&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),du(t,t.updateQueue),Ze(t),null);case 4:return Me(),e===null&&lr(t.stateNode.containerInfo),Ze(t),null;case 10:return mn(t.type),Ze(t),null;case 19:if(U($e),l=t.memoizedState,l===null)return Ze(t),null;if(a=(t.flags&128)!==0,i=l.rendering,i===null)if(a)Ja(l,!1);else{if(We!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(i=Pi(e),i!==null){for(t.flags|=128,Ja(l,!1),e=i.updateQueue,t.updateQueue=e,du(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)Fc(n,e),n=n.sibling;return X($e,$e.current&1|2),Ce&&dn(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ye()>pu&&(t.flags|=128,a=!0,Ja(l,!1),t.lanes=4194304)}else{if(!a)if(e=Pi(i),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,du(t,e),Ja(l,!0),l.tail===null&&l.tailMode==="hidden"&&!i.alternate&&!Ce)return Ze(t),null}else 2*Ye()-l.renderingStartTime>pu&&n!==536870912&&(t.flags|=128,a=!0,Ja(l,!1),t.lanes=4194304);l.isBackwards?(i.sibling=t.child,t.child=i):(e=l.last,e!==null?e.sibling=i:t.child=i,l.last=i)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ye(),e.sibling=null,n=$e.current,X($e,a?n&1|2:n&1),Ce&&dn(t,l.treeForkCount),e):(Ze(t),null);case 22:case 23:return Mt(t),lo(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),n=t.updateQueue,n!==null&&du(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&U(yl),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),mn(et),Ze(t),null;case 25:return null;case 30:return null}throw Error(r(156,t.tag))}function ty(e,t){switch(qs(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return mn(et),Me(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return It(t),null;case 31:if(t.memoizedState!==null){if(Mt(t),t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Mt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return U($e),null;case 4:return Me(),null;case 10:return mn(t.type),null;case 22:case 23:return Mt(t),lo(),e!==null&&U(yl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return mn(et),null;case 25:return null;default:return null}}function wd(e,t){switch(qs(t),t.tag){case 3:mn(et),Me();break;case 26:case 27:case 5:It(t);break;case 4:Me();break;case 31:t.memoizedState!==null&&Mt(t);break;case 13:Mt(t);break;case 19:U($e);break;case 10:mn(t.type);break;case 22:case 23:Mt(t),lo(),e!==null&&U(yl);break;case 24:mn(et)}}function Ia(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var a=l.next;n=a;do{if((n.tag&e)===e){l=void 0;var i=n.create,c=n.inst;l=i(),c.destroy=l}n=n.next}while(n!==a)}}catch(d){ke(t,t.return,d)}}function Gn(e,t,n){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var i=a.next;l=i;do{if((l.tag&e)===e){var c=l.inst,d=c.destroy;if(d!==void 0){c.destroy=void 0,a=t;var y=n,O=d;try{O()}catch(M){ke(a,y,M)}}}l=l.next}while(l!==i)}}catch(M){ke(t,t.return,M)}}function Od(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{yf(t,n)}catch(l){ke(e,e.return,l)}}}function Cd(e,t,n){n.props=xl(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){ke(e,t,l)}}function Wa(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(a){ke(e,t,a)}}function ln(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(a){ke(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){ke(e,t,a)}else n.current=null}function zd(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(a){ke(e,e.return,a)}}function Uo(e,t,n){try{var l=e.stateNode;Ey(l,e.type,n,t),l[vt]=t}catch(a){ke(e,e.return,a)}}function Ad(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Fn(e.type)||e.tag===4}function Yo(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ad(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Fn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Bo(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=rn));else if(l!==4&&(l===27&&Fn(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Bo(e,t,n),e=e.sibling;e!==null;)Bo(e,t,n),e=e.sibling}function _u(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Fn(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(_u(e,t,n),e=e.sibling;e!==null;)_u(e,t,n),e=e.sibling}function Nd(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);mt(t,l,n),t[ct]=e,t[vt]=n}catch(i){ke(e,e.return,i)}}var bn=!1,lt=!1,Lo=!1,Rd=typeof WeakSet=="function"?WeakSet:Set,ot=null;function ny(e,t){if(e=e.containerInfo,ur=Du,e=qc(e),Rs(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var a=l.anchorOffset,i=l.focusNode;l=l.focusOffset;try{n.nodeType,i.nodeType}catch{n=null;break e}var c=0,d=-1,y=-1,O=0,M=0,Y=e,C=null;t:for(;;){for(var A;Y!==n||a!==0&&Y.nodeType!==3||(d=c+a),Y!==i||l!==0&&Y.nodeType!==3||(y=c+l),Y.nodeType===3&&(c+=Y.nodeValue.length),(A=Y.firstChild)!==null;)C=Y,Y=A;for(;;){if(Y===e)break t;if(C===n&&++O===a&&(d=c),C===i&&++M===l&&(y=c),(A=Y.nextSibling)!==null)break;Y=C,C=Y.parentNode}Y=A}n=d===-1||y===-1?null:{start:d,end:y}}else n=null}n=n||{start:0,end:0}}else n=null;for(sr={focusedElem:e,selectionRange:n},Du=!1,ot=t;ot!==null;)if(t=ot,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,ot=e;else for(;ot!==null;){switch(t=ot,i=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&i!==null){e=void 0,n=t,a=i.memoizedProps,i=i.memoizedState,l=n.stateNode;try{var F=xl(n.type,a);e=l.getSnapshotBeforeUpdate(F,i),l.__reactInternalSnapshotBeforeUpdate=e}catch(se){ke(n,n.return,se)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)cr(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":cr(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(r(163))}if(e=t.sibling,e!==null){e.return=t.return,ot=e;break}ot=t.return}}function jd(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:xn(e,n),l&4&&Ia(5,n);break;case 1:if(xn(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){ke(n,n.return,c)}else{var a=xl(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){ke(n,n.return,c)}}l&64&&Od(n),l&512&&Wa(n,n.return);break;case 3:if(xn(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{yf(e,t)}catch(c){ke(n,n.return,c)}}break;case 27:t===null&&l&4&&Nd(n);case 26:case 5:xn(e,n),t===null&&l&4&&zd(n),l&512&&Wa(n,n.return);break;case 12:xn(e,n);break;case 31:xn(e,n),l&4&&kd(e,n);break;case 13:xn(e,n),l&4&&Ud(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=fy.bind(null,n),Ry(e,n))));break;case 22:if(l=n.memoizedState!==null||bn,!l){t=t!==null&&t.memoizedState!==null||lt,a=bn;var i=lt;bn=l,(lt=t)&&!i?Sn(e,n,(n.subtreeFlags&8772)!==0):xn(e,n),bn=a,lt=i}break;case 30:break;default:xn(e,n)}}function Md(e){var t=e.alternate;t!==null&&(e.alternate=null,Md(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&ms(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ke=null,St=!1;function vn(e,t,n){for(n=n.child;n!==null;)Dd(e,t,n),n=n.sibling}function Dd(e,t,n){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(va,n)}catch{}switch(n.tag){case 26:lt||ln(n,t),vn(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:lt||ln(n,t);var l=Ke,a=St;Fn(n.type)&&(Ke=n.stateNode,St=!1),vn(e,t,n),ii(n.stateNode),Ke=l,St=a;break;case 5:lt||ln(n,t);case 6:if(l=Ke,a=St,Ke=null,vn(e,t,n),Ke=l,St=a,Ke!==null)if(St)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(n.stateNode)}catch(i){ke(n,t,i)}else try{Ke.removeChild(n.stateNode)}catch(i){ke(n,t,i)}break;case 18:Ke!==null&&(St?(e=Ke,O_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),fa(e)):O_(Ke,n.stateNode));break;case 4:l=Ke,a=St,Ke=n.stateNode.containerInfo,St=!0,vn(e,t,n),Ke=l,St=a;break;case 0:case 11:case 14:case 15:Gn(2,n,t),lt||Gn(4,n,t),vn(e,t,n);break;case 1:lt||(ln(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&Cd(n,t,l)),vn(e,t,n);break;case 21:vn(e,t,n);break;case 22:lt=(l=lt)||n.memoizedState!==null,vn(e,t,n),lt=l;break;default:vn(e,t,n)}}function kd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{fa(e)}catch(n){ke(t,t.return,n)}}}function Ud(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{fa(e)}catch(n){ke(t,t.return,n)}}function ly(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Rd),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Rd),t;default:throw Error(r(435,e.tag))}}function mu(e,t){var n=ly(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var a=dy.bind(null,e,l);l.then(a,a)}})}function Et(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var a=n[l],i=e,c=t,d=c;e:for(;d!==null;){switch(d.tag){case 27:if(Fn(d.type)){Ke=d.stateNode,St=!1;break e}break;case 5:Ke=d.stateNode,St=!1;break e;case 3:case 4:Ke=d.stateNode.containerInfo,St=!0;break e}d=d.return}if(Ke===null)throw Error(r(160));Dd(i,c,a),Ke=null,St=!1,i=a.alternate,i!==null&&(i.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Yd(t,e),t=t.sibling}var Ft=null;function Yd(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Et(t,e),Tt(e),l&4&&(Gn(3,e,e.return),Ia(3,e),Gn(5,e,e.return));break;case 1:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&64&&bn&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var a=Ft;if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&4){var i=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,a=a.ownerDocument||a;t:switch(l){case"title":i=a.getElementsByTagName("title")[0],(!i||i[Ea]||i[ct]||i.namespaceURI==="http://www.w3.org/2000/svg"||i.hasAttribute("itemprop"))&&(i=a.createElement(l),a.head.insertBefore(i,a.querySelector("head > title"))),mt(i,l,n),i[ct]=e,st(i),l=i;break e;case"link":var c=Y_("link","href",a).get(l+(n.href||""));if(c){for(var d=0;d<c.length;d++)if(i=c[d],i.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&i.getAttribute("rel")===(n.rel==null?null:n.rel)&&i.getAttribute("title")===(n.title==null?null:n.title)&&i.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){c.splice(d,1);break t}}i=a.createElement(l),mt(i,l,n),a.head.appendChild(i);break;case"meta":if(c=Y_("meta","content",a).get(l+(n.content||""))){for(d=0;d<c.length;d++)if(i=c[d],i.getAttribute("content")===(n.content==null?null:""+n.content)&&i.getAttribute("name")===(n.name==null?null:n.name)&&i.getAttribute("property")===(n.property==null?null:n.property)&&i.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&i.getAttribute("charset")===(n.charSet==null?null:n.charSet)){c.splice(d,1);break t}}i=a.createElement(l),mt(i,l,n),a.head.appendChild(i);break;default:throw Error(r(468,l))}i[ct]=e,st(i),l=i}e.stateNode=l}else B_(a,e.type,e.stateNode);else e.stateNode=U_(a,l,e.memoizedProps);else i!==l?(i===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):i.count--,l===null?B_(a,e.type,e.stateNode):U_(a,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Uo(e,e.memoizedProps,n.memoizedProps)}break;case 27:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),n!==null&&l&4&&Uo(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),e.flags&32){a=e.stateNode;try{Dl(a,"")}catch(F){ke(e,e.return,F)}}l&4&&e.stateNode!=null&&(a=e.memoizedProps,Uo(e,a,n!==null?n.memoizedProps:a)),l&1024&&(Lo=!0);break;case 6:if(Et(t,e),Tt(e),l&4){if(e.stateNode===null)throw Error(r(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(F){ke(e,e.return,F)}}break;case 3:if(Nu=null,a=Ft,Ft=zu(t.containerInfo),Et(t,e),Ft=a,Tt(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{fa(t.containerInfo)}catch(F){ke(e,e.return,F)}Lo&&(Lo=!1,Bd(e));break;case 4:l=Ft,Ft=zu(e.stateNode.containerInfo),Et(t,e),Tt(e),Ft=l;break;case 12:Et(t,e),Tt(e);break;case 31:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,mu(e,l)));break;case 13:Et(t,e),Tt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(yu=Ye()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,mu(e,l)));break;case 22:a=e.memoizedState!==null;var y=n!==null&&n.memoizedState!==null,O=bn,M=lt;if(bn=O||a,lt=M||y,Et(t,e),lt=M,bn=O,Tt(e),l&8192)e:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||y||bn||lt||Sl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){y=n=t;try{if(i=y.stateNode,a)c=i.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none";else{d=y.stateNode;var Y=y.memoizedProps.style,C=Y!=null&&Y.hasOwnProperty("display")?Y.display:null;d.style.display=C==null||typeof C=="boolean"?"":(""+C).trim()}}catch(F){ke(y,y.return,F)}}}else if(t.tag===6){if(n===null){y=t;try{y.stateNode.nodeValue=a?"":y.memoizedProps}catch(F){ke(y,y.return,F)}}}else if(t.tag===18){if(n===null){y=t;try{var A=y.stateNode;a?C_(A,!0):C_(y.stateNode,!1)}catch(F){ke(y,y.return,F)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,mu(e,n))));break;case 19:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,mu(e,l)));break;case 30:break;case 21:break;default:Et(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(Ad(l)){n=l;break}l=l.return}if(n==null)throw Error(r(160));switch(n.tag){case 27:var a=n.stateNode,i=Yo(e);_u(e,i,a);break;case 5:var c=n.stateNode;n.flags&32&&(Dl(c,""),n.flags&=-33);var d=Yo(e);_u(e,d,c);break;case 3:case 4:var y=n.stateNode.containerInfo,O=Yo(e);Bo(e,O,y);break;default:throw Error(r(161))}}catch(M){ke(e,e.return,M)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Bd(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Bd(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function xn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)jd(e,t.alternate,t),t=t.sibling}function Sl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gn(4,t,t.return),Sl(t);break;case 1:ln(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Cd(t,t.return,n),Sl(t);break;case 27:ii(t.stateNode);case 26:case 5:ln(t,t.return),Sl(t);break;case 22:t.memoizedState===null&&Sl(t);break;case 30:Sl(t);break;default:Sl(t)}e=e.sibling}}function Sn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,a=e,i=t,c=i.flags;switch(i.tag){case 0:case 11:case 15:Sn(a,i,n),Ia(4,i);break;case 1:if(Sn(a,i,n),l=i,a=l.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(O){ke(l,l.return,O)}if(l=i,a=l.updateQueue,a!==null){var d=l.stateNode;try{var y=a.shared.hiddenCallbacks;if(y!==null)for(a.shared.hiddenCallbacks=null,a=0;a<y.length;a++)gf(y[a],d)}catch(O){ke(l,l.return,O)}}n&&c&64&&Od(i),Wa(i,i.return);break;case 27:Nd(i);case 26:case 5:Sn(a,i,n),n&&l===null&&c&4&&zd(i),Wa(i,i.return);break;case 12:Sn(a,i,n);break;case 31:Sn(a,i,n),n&&c&4&&kd(a,i);break;case 13:Sn(a,i,n),n&&c&4&&Ud(a,i);break;case 22:i.memoizedState===null&&Sn(a,i,n),Wa(i,i.return);break;case 30:break;default:Sn(a,i,n)}t=t.sibling}}function Ho(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ua(n))}function Xo(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ua(e))}function $t(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Ld(e,t,n,l),t=t.sibling}function Ld(e,t,n,l){var a=t.flags;switch(t.tag){case 0:case 11:case 15:$t(e,t,n,l),a&2048&&Ia(9,t);break;case 1:$t(e,t,n,l);break;case 3:$t(e,t,n,l),a&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ua(e)));break;case 12:if(a&2048){$t(e,t,n,l),e=t.stateNode;try{var i=t.memoizedProps,c=i.id,d=i.onPostCommit;typeof d=="function"&&d(c,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(y){ke(t,t.return,y)}}else $t(e,t,n,l);break;case 31:$t(e,t,n,l);break;case 13:$t(e,t,n,l);break;case 23:break;case 22:i=t.stateNode,c=t.alternate,t.memoizedState!==null?i._visibility&2?$t(e,t,n,l):Fa(e,t):i._visibility&2?$t(e,t,n,l):(i._visibility|=2,ea(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),a&2048&&Ho(c,t);break;case 24:$t(e,t,n,l),a&2048&&Xo(t.alternate,t);break;default:$t(e,t,n,l)}}function ea(e,t,n,l,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var i=e,c=t,d=n,y=l,O=c.flags;switch(c.tag){case 0:case 11:case 15:ea(i,c,d,y,a),Ia(8,c);break;case 23:break;case 22:var M=c.stateNode;c.memoizedState!==null?M._visibility&2?ea(i,c,d,y,a):Fa(i,c):(M._visibility|=2,ea(i,c,d,y,a)),a&&O&2048&&Ho(c.alternate,c);break;case 24:ea(i,c,d,y,a),a&&O&2048&&Xo(c.alternate,c);break;default:ea(i,c,d,y,a)}t=t.sibling}}function Fa(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,a=l.flags;switch(l.tag){case 22:Fa(n,l),a&2048&&Ho(l.alternate,l);break;case 24:Fa(n,l),a&2048&&Xo(l.alternate,l);break;default:Fa(n,l)}t=t.sibling}}var $a=8192;function ta(e,t,n){if(e.subtreeFlags&$a)for(e=e.child;e!==null;)Hd(e,t,n),e=e.sibling}function Hd(e,t,n){switch(e.tag){case 26:ta(e,t,n),e.flags&$a&&e.memoizedState!==null&&Qy(n,Ft,e.memoizedState,e.memoizedProps);break;case 5:ta(e,t,n);break;case 3:case 4:var l=Ft;Ft=zu(e.stateNode.containerInfo),ta(e,t,n),Ft=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=$a,$a=16777216,ta(e,t,n),$a=l):ta(e,t,n));break;default:ta(e,t,n)}}function Xd(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function Pa(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ot=l,Qd(l,e)}Xd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)qd(e),e=e.sibling}function qd(e){switch(e.tag){case 0:case 11:case 15:Pa(e),e.flags&2048&&Gn(9,e,e.return);break;case 3:Pa(e);break;case 12:Pa(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,gu(e)):Pa(e);break;default:Pa(e)}}function gu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];ot=l,Qd(l,e)}Xd(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gn(8,t,t.return),gu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,gu(t));break;default:gu(t)}e=e.sibling}}function Qd(e,t){for(;ot!==null;){var n=ot;switch(n.tag){case 0:case 11:case 15:Gn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Ua(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,ot=l;else e:for(n=e;ot!==null;){l=ot;var a=l.sibling,i=l.return;if(Md(l),l===n){ot=null;break e}if(a!==null){a.return=i,ot=a;break e}ot=i}}}var ay={getCacheForType:function(e){var t=dt(et),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return dt(et).controller.signal}},iy=typeof WeakMap=="function"?WeakMap:Map,Re=0,qe=null,xe=null,Te=0,De=0,Dt=null,Vn=!1,na=!1,qo=!1,En=0,We=0,Zn=0,El=0,Qo=0,kt=0,la=0,ei=null,wt=null,Go=!1,yu=0,Gd=0,pu=1/0,hu=null,Kn=null,ut=0,Jn=null,aa=null,Tn=0,Vo=0,Zo=null,Vd=null,ti=0,Ko=null;function Ut(){return(Re&2)!==0&&Te!==0?Te&-Te:R.T!==null?Po():uc()}function Zd(){if(kt===0)if((Te&536870912)===0||Ce){var e=Oi;Oi<<=1,(Oi&3932160)===0&&(Oi=262144),kt=e}else kt=536870912;return e=jt.current,e!==null&&(e.flags|=32),kt}function Ot(e,t,n){(e===qe&&(De===2||De===9)||e.cancelPendingCommit!==null)&&(ia(e,0),In(e,Te,kt,!1)),Sa(e,n),((Re&2)===0||e!==qe)&&(e===qe&&((Re&2)===0&&(El|=n),We===4&&In(e,Te,kt,!1)),an(e))}function Kd(e,t,n){if((Re&6)!==0)throw Error(r(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||xa(e,t),a=l?oy(e,t):Io(e,t,!0),i=l;do{if(a===0){na&&!l&&In(e,t,0,!1);break}else{if(n=e.current.alternate,i&&!uy(n)){a=Io(e,t,!1),i=!1;continue}if(a===2){if(i=t,e.errorRecoveryDisabledLanes&i)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var d=e;a=ei;var y=d.current.memoizedState.isDehydrated;if(y&&(ia(d,c).flags|=256),c=Io(d,c,!1),c!==2){if(qo&&!y){d.errorRecoveryDisabledLanes|=i,El|=i,a=4;break e}i=wt,wt=a,i!==null&&(wt===null?wt=i:wt.push.apply(wt,i))}a=c}if(i=!1,a!==2)continue}}if(a===1){ia(e,0),In(e,t,0,!0);break}e:{switch(l=e,i=a,i){case 0:case 1:throw Error(r(345));case 4:if((t&4194048)!==t)break;case 6:In(l,t,kt,!Vn);break e;case 2:wt=null;break;case 3:case 5:break;default:throw Error(r(329))}if((t&62914560)===t&&(a=yu+300-Ye(),10<a)){if(In(l,t,kt,!Vn),zi(l,0,!0)!==0)break e;Tn=t,l.timeoutHandle=T_(Jd.bind(null,l,n,wt,hu,Go,t,kt,El,la,Vn,i,"Throttled",-0,0),a);break e}Jd(l,n,wt,hu,Go,t,kt,El,la,Vn,i,null,-0,0)}}break}while(!0);an(e)}function Jd(e,t,n,l,a,i,c,d,y,O,M,Y,C,A){if(e.timeoutHandle=-1,Y=t.subtreeFlags,Y&8192||(Y&16785408)===16785408){Y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:rn},Hd(t,i,Y);var F=(i&62914560)===i?yu-Ye():(i&4194048)===i?Gd-Ye():0;if(F=Gy(Y,F),F!==null){Tn=i,e.cancelPendingCommit=F(n_.bind(null,e,t,i,n,l,a,c,d,y,M,Y,null,C,A)),In(e,i,c,!O);return}}n_(e,t,i,n,l,a,c,d,y)}function uy(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var a=n[l],i=a.getSnapshot;a=a.value;try{if(!Nt(i(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function In(e,t,n,l){t&=~Qo,t&=~El,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var a=t;0<a;){var i=31-At(a),c=1<<i;l[i]=-1,a&=~c}n!==0&&lc(e,n,t)}function bu(){return(Re&6)===0?(ni(0),!1):!0}function Jo(){if(xe!==null){if(De===0)var e=xe.return;else e=xe,_n=ml=null,ro(e),Il=null,Ba=0,e=xe;for(;e!==null;)wd(e.alternate,e),e=e.return;xe=null}}function ia(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Oy(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Tn=0,Jo(),qe=e,xe=n=fn(e.current,null),Te=t,De=0,Dt=null,Vn=!1,na=xa(e,t),qo=!1,la=kt=Qo=El=Zn=We=0,wt=ei=null,Go=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var a=31-At(l),i=1<<a;t|=e[a],l&=~i}return En=t,Hi(),n}function Id(e,t){ye=null,R.H=Za,t===Jl||t===Ji?(t=ff(),De=3):t===Fs?(t=ff(),De=4):De=t===Oo?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Dt=t,xe===null&&(We=1,ou(e,Xt(t,e.current)))}function Wd(){var e=jt.current;return e===null?!0:(Te&4194048)===Te?Vt===null:(Te&62914560)===Te||(Te&536870912)!==0?e===Vt:!1}function Fd(){var e=R.H;return R.H=Za,e===null?Za:e}function $d(){var e=R.A;return R.A=ay,e}function vu(){We=4,Vn||(Te&4194048)!==Te&&jt.current!==null||(na=!0),(Zn&134217727)===0&&(El&134217727)===0||qe===null||In(qe,Te,kt,!1)}function Io(e,t,n){var l=Re;Re|=2;var a=Fd(),i=$d();(qe!==e||Te!==t)&&(hu=null,ia(e,t)),t=!1;var c=We;e:do try{if(De!==0&&xe!==null){var d=xe,y=Dt;switch(De){case 8:Jo(),c=6;break e;case 3:case 2:case 9:case 6:jt.current===null&&(t=!0);var O=De;if(De=0,Dt=null,ua(e,d,y,O),n&&na){c=0;break e}break;default:O=De,De=0,Dt=null,ua(e,d,y,O)}}sy(),c=We;break}catch(M){Id(e,M)}while(!0);return t&&e.shellSuspendCounter++,_n=ml=null,Re=l,R.H=a,R.A=i,xe===null&&(qe=null,Te=0,Hi()),c}function sy(){for(;xe!==null;)Pd(xe)}function oy(e,t){var n=Re;Re|=2;var l=Fd(),a=$d();qe!==e||Te!==t?(hu=null,pu=Ye()+500,ia(e,t)):na=xa(e,t);e:do try{if(De!==0&&xe!==null){t=xe;var i=Dt;t:switch(De){case 1:De=0,Dt=null,ua(e,t,i,1);break;case 2:case 9:if(rf(i)){De=0,Dt=null,e_(t);break}t=function(){De!==2&&De!==9||qe!==e||(De=7),an(e)},i.then(t,t);break e;case 3:De=7;break e;case 4:De=5;break e;case 7:rf(i)?(De=0,Dt=null,e_(t)):(De=0,Dt=null,ua(e,t,i,7));break;case 5:var c=null;switch(xe.tag){case 26:c=xe.memoizedState;case 5:case 27:var d=xe;if(c?L_(c):d.stateNode.complete){De=0,Dt=null;var y=d.sibling;if(y!==null)xe=y;else{var O=d.return;O!==null?(xe=O,xu(O)):xe=null}break t}}De=0,Dt=null,ua(e,t,i,5);break;case 6:De=0,Dt=null,ua(e,t,i,6);break;case 8:Jo(),We=6;break e;default:throw Error(r(462))}}ry();break}catch(M){Id(e,M)}while(!0);return _n=ml=null,R.H=l,R.A=a,Re=n,xe!==null?0:(qe=null,Te=0,Hi(),We)}function ry(){for(;xe!==null&&!fe();)Pd(xe)}function Pd(e){var t=Ed(e.alternate,e,En);e.memoizedProps=e.pendingProps,t===null?xu(e):xe=t}function e_(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=pd(n,t,t.pendingProps,t.type,void 0,Te);break;case 11:t=pd(n,t,t.pendingProps,t.type.render,t.ref,Te);break;case 5:ro(t);default:wd(n,t),t=xe=Fc(t,En),t=Ed(n,t,En)}e.memoizedProps=e.pendingProps,t===null?xu(e):xe=t}function ua(e,t,n,l){_n=ml=null,ro(t),Il=null,Ba=0;var a=t.return;try{if(Fg(e,a,t,n,Te)){We=1,ou(e,Xt(n,e.current)),xe=null;return}}catch(i){if(a!==null)throw xe=a,i;We=1,ou(e,Xt(n,e.current)),xe=null;return}t.flags&32768?(Ce||l===1?e=!0:na||(Te&536870912)!==0?e=!1:(Vn=e=!0,(l===2||l===9||l===3||l===6)&&(l=jt.current,l!==null&&l.tag===13&&(l.flags|=16384))),t_(t,e)):xu(t)}function xu(e){var t=e;do{if((t.flags&32768)!==0){t_(t,Vn);return}e=t.return;var n=ey(t.alternate,t,En);if(n!==null){xe=n;return}if(t=t.sibling,t!==null){xe=t;return}xe=t=e}while(t!==null);We===0&&(We=5)}function t_(e,t){do{var n=ty(e.alternate,e);if(n!==null){n.flags&=32767,xe=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){xe=e;return}xe=e=n}while(e!==null);We=6,xe=null}function n_(e,t,n,l,a,i,c,d,y){e.cancelPendingCommit=null;do Su();while(ut!==0);if((Re&6)!==0)throw Error(r(327));if(t!==null){if(t===e.current)throw Error(r(177));if(i=t.lanes|t.childLanes,i|=Us,q0(e,n,i,c,d,y),e===qe&&(xe=qe=null,Te=0),aa=t,Jn=e,Tn=n,Vo=i,Zo=a,Vd=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,_y(Nn,function(){return s_(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=R.T,R.T=null,a=q.p,q.p=2,c=Re,Re|=4;try{ny(e,t,n)}finally{Re=c,q.p=a,R.T=l}}ut=1,l_(),a_(),i_()}}function l_(){if(ut===1){ut=0;var e=Jn,t=aa,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=R.T,R.T=null;var l=q.p;q.p=2;var a=Re;Re|=4;try{Yd(t,e);var i=sr,c=qc(e.containerInfo),d=i.focusedElem,y=i.selectionRange;if(c!==d&&d&&d.ownerDocument&&Xc(d.ownerDocument.documentElement,d)){if(y!==null&&Rs(d)){var O=y.start,M=y.end;if(M===void 0&&(M=O),"selectionStart"in d)d.selectionStart=O,d.selectionEnd=Math.min(M,d.value.length);else{var Y=d.ownerDocument||document,C=Y&&Y.defaultView||window;if(C.getSelection){var A=C.getSelection(),F=d.textContent.length,se=Math.min(y.start,F),He=y.end===void 0?se:Math.min(y.end,F);!A.extend&&se>He&&(c=He,He=se,se=c);var x=Hc(d,se),v=Hc(d,He);if(x&&v&&(A.rangeCount!==1||A.anchorNode!==x.node||A.anchorOffset!==x.offset||A.focusNode!==v.node||A.focusOffset!==v.offset)){var w=Y.createRange();w.setStart(x.node,x.offset),A.removeAllRanges(),se>He?(A.addRange(w),A.extend(v.node,v.offset)):(w.setEnd(v.node,v.offset),A.addRange(w))}}}}for(Y=[],A=d;A=A.parentNode;)A.nodeType===1&&Y.push({element:A,left:A.scrollLeft,top:A.scrollTop});for(typeof d.focus=="function"&&d.focus(),d=0;d<Y.length;d++){var k=Y[d];k.element.scrollLeft=k.left,k.element.scrollTop=k.top}}Du=!!ur,sr=ur=null}finally{Re=a,q.p=l,R.T=n}}e.current=t,ut=2}}function a_(){if(ut===2){ut=0;var e=Jn,t=aa,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=R.T,R.T=null;var l=q.p;q.p=2;var a=Re;Re|=4;try{jd(e,t.alternate,t)}finally{Re=a,q.p=l,R.T=n}}ut=3}}function i_(){if(ut===4||ut===3){ut=0,pt();var e=Jn,t=aa,n=Tn,l=Vd;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ut=5:(ut=0,aa=Jn=null,u_(e,e.pendingLanes));var a=e.pendingLanes;if(a===0&&(Kn=null),ds(n),t=t.stateNode,zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(va,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=R.T,a=q.p,q.p=2,R.T=null;try{for(var i=e.onRecoverableError,c=0;c<l.length;c++){var d=l[c];i(d.value,{componentStack:d.stack})}}finally{R.T=t,q.p=a}}(Tn&3)!==0&&Su(),an(e),a=e.pendingLanes,(n&261930)!==0&&(a&42)!==0?e===Ko?ti++:(ti=0,Ko=e):ti=0,ni(0)}}function u_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ua(t)))}function Su(){return l_(),a_(),i_(),s_()}function s_(){if(ut!==5)return!1;var e=Jn,t=Vo;Vo=0;var n=ds(Tn),l=R.T,a=q.p;try{q.p=32>n?32:n,R.T=null,n=Zo,Zo=null;var i=Jn,c=Tn;if(ut=0,aa=Jn=null,Tn=0,(Re&6)!==0)throw Error(r(331));var d=Re;if(Re|=4,qd(i.current),Ld(i,i.current,c,n),Re=d,ni(0,!1),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(va,i)}catch{}return!0}finally{q.p=a,R.T=l,u_(e,t)}}function o_(e,t,n){t=Xt(n,t),t=wo(e.stateNode,t,2),e=Xn(e,t,2),e!==null&&(Sa(e,2),an(e))}function ke(e,t,n){if(e.tag===3)o_(e,e,n);else for(;t!==null;){if(t.tag===3){o_(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Kn===null||!Kn.has(l))){e=Xt(n,e),n=rd(2),l=Xn(t,n,2),l!==null&&(cd(n,l,t,e),Sa(l,2),an(l));break}}t=t.return}}function Wo(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new iy;var a=new Set;l.set(t,a)}else a=l.get(t),a===void 0&&(a=new Set,l.set(t,a));a.has(n)||(qo=!0,a.add(n),e=cy.bind(null,e,t,n),t.then(e,e))}function cy(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,qe===e&&(Te&n)===n&&(We===4||We===3&&(Te&62914560)===Te&&300>Ye()-yu?(Re&2)===0&&ia(e,0):Qo|=n,la===Te&&(la=0)),an(e)}function r_(e,t){t===0&&(t=nc()),e=fl(e,t),e!==null&&(Sa(e,t),an(e))}function fy(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),r_(e,n)}function dy(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(r(314))}l!==null&&l.delete(t),r_(e,n)}function _y(e,t){return Ge(e,t)}var Eu=null,sa=null,Fo=!1,Tu=!1,$o=!1,Wn=0;function an(e){e!==sa&&e.next===null&&(sa===null?Eu=sa=e:sa=sa.next=e),Tu=!0,Fo||(Fo=!0,gy())}function ni(e,t){if(!$o&&Tu){$o=!0;do for(var n=!1,l=Eu;l!==null;){if(e!==0){var a=l.pendingLanes;if(a===0)var i=0;else{var c=l.suspendedLanes,d=l.pingedLanes;i=(1<<31-At(42|e)+1)-1,i&=a&~(c&~d),i=i&201326741?i&201326741|1:i?i|2:0}i!==0&&(n=!0,__(l,i))}else i=Te,i=zi(l,l===qe?i:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(i&3)===0||xa(l,i)||(n=!0,__(l,i));l=l.next}while(n);$o=!1}}function my(){c_()}function c_(){Tu=Fo=!1;var e=0;Wn!==0&&wy()&&(e=Wn);for(var t=Ye(),n=null,l=Eu;l!==null;){var a=l.next,i=f_(l,t);i===0?(l.next=null,n===null?Eu=a:n.next=a,a===null&&(sa=n)):(n=l,(e!==0||(i&3)!==0)&&(Tu=!0)),l=a}ut!==0&&ut!==5||ni(e),Wn!==0&&(Wn=0)}function f_(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,a=e.expirationTimes,i=e.pendingLanes&-62914561;0<i;){var c=31-At(i),d=1<<c,y=a[c];y===-1?((d&n)===0||(d&l)!==0)&&(a[c]=X0(d,t)):y<=t&&(e.expiredLanes|=d),i&=~d}if(t=qe,n=Te,n=zi(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(De===2||De===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&_e(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||xa(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&_e(l),ds(n)){case 2:case 8:n=Ol;break;case 32:n=Nn;break;case 268435456:n=Rn;break;default:n=Nn}return l=d_.bind(null,e),n=Ge(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&_e(l),e.callbackPriority=2,e.callbackNode=null,2}function d_(e,t){if(ut!==0&&ut!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Su()&&e.callbackNode!==n)return null;var l=Te;return l=zi(e,e===qe?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Kd(e,l,t),f_(e,Ye()),e.callbackNode!=null&&e.callbackNode===n?d_.bind(null,e):null)}function __(e,t){if(Su())return null;Kd(e,t,!0)}function gy(){Cy(function(){(Re&6)!==0?Ge(il,my):c_()})}function Po(){if(Wn===0){var e=Zl;e===0&&(e=wi,wi<<=1,(wi&261888)===0&&(wi=256)),Wn=e}return Wn}function m_(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:ji(""+e)}function g_(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function yy(e,t,n,l,a){if(t==="submit"&&n&&n.stateNode===a){var i=m_((a[vt]||null).action),c=l.submitter;c&&(t=(t=c[vt]||null)?m_(t.formAction):c.getAttribute("formAction"),t!==null&&(i=t,c=null));var d=new Ui("action","action",null,l,a);e.push({event:d,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Wn!==0){var y=c?g_(a,c):new FormData(a);bo(n,{pending:!0,data:y,method:a.method,action:i},null,y)}}else typeof i=="function"&&(d.preventDefault(),y=c?g_(a,c):new FormData(a),bo(n,{pending:!0,data:y,method:a.method,action:i},i,y))},currentTarget:a}]})}}for(var er=0;er<ks.length;er++){var tr=ks[er],py=tr.toLowerCase(),hy=tr[0].toUpperCase()+tr.slice(1);Wt(py,"on"+hy)}Wt(Vc,"onAnimationEnd"),Wt(Zc,"onAnimationIteration"),Wt(Kc,"onAnimationStart"),Wt("dblclick","onDoubleClick"),Wt("focusin","onFocus"),Wt("focusout","onBlur"),Wt(Dg,"onTransitionRun"),Wt(kg,"onTransitionStart"),Wt(Ug,"onTransitionCancel"),Wt(Jc,"onTransitionEnd"),jl("onMouseEnter",["mouseout","mouseover"]),jl("onMouseLeave",["mouseout","mouseover"]),jl("onPointerEnter",["pointerout","pointerover"]),jl("onPointerLeave",["pointerout","pointerover"]),sl("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),sl("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),sl("onBeforeInput",["compositionend","keypress","textInput","paste"]),sl("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),sl("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),sl("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var li="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),by=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(li));function y_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],a=l.event;l=l.listeners;e:{var i=void 0;if(t)for(var c=l.length-1;0<=c;c--){var d=l[c],y=d.instance,O=d.currentTarget;if(d=d.listener,y!==i&&a.isPropagationStopped())break e;i=d,a.currentTarget=O;try{i(a)}catch(M){Li(M)}a.currentTarget=null,i=y}else for(c=0;c<l.length;c++){if(d=l[c],y=d.instance,O=d.currentTarget,d=d.listener,y!==i&&a.isPropagationStopped())break e;i=d,a.currentTarget=O;try{i(a)}catch(M){Li(M)}a.currentTarget=null,i=y}}}}function Se(e,t){var n=t[_s];n===void 0&&(n=t[_s]=new Set);var l=e+"__bubble";n.has(l)||(p_(t,e,2,!1),n.add(l))}function nr(e,t,n){var l=0;t&&(l|=4),p_(n,e,l,t)}var wu="_reactListening"+Math.random().toString(36).slice(2);function lr(e){if(!e[wu]){e[wu]=!0,rc.forEach(function(n){n!=="selectionchange"&&(by.has(n)||nr(n,!1,e),nr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[wu]||(t[wu]=!0,nr("selectionchange",!1,t))}}function p_(e,t,n,l){switch(Z_(t)){case 2:var a=Ky;break;case 8:a=Jy;break;default:a=hr}n=a.bind(null,t,n,e),a=void 0,!Ss||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),l?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function ar(e,t,n,l,a){var i=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var c=l.tag;if(c===3||c===4){var d=l.stateNode.containerInfo;if(d===a)break;if(c===4)for(c=l.return;c!==null;){var y=c.tag;if((y===3||y===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;d!==null;){if(c=Al(d),c===null)return;if(y=c.tag,y===5||y===6||y===26||y===27){l=i=c;continue e}d=d.parentNode}}l=l.return}xc(function(){var O=i,M=vs(n),Y=[];e:{var C=Ic.get(e);if(C!==void 0){var A=Ui,F=e;switch(e){case"keypress":if(Di(n)===0)break e;case"keydown":case"keyup":A=dg;break;case"focusin":F="focus",A=Os;break;case"focusout":F="blur",A=Os;break;case"beforeblur":case"afterblur":A=Os;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":A=Tc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":A=eg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":A=gg;break;case Vc:case Zc:case Kc:A=lg;break;case Jc:A=pg;break;case"scroll":case"scrollend":A=$0;break;case"wheel":A=bg;break;case"copy":case"cut":case"paste":A=ig;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":A=Oc;break;case"toggle":case"beforetoggle":A=xg}var se=(t&4)!==0,He=!se&&(e==="scroll"||e==="scrollend"),x=se?C!==null?C+"Capture":null:C;se=[];for(var v=O,w;v!==null;){var k=v;if(w=k.stateNode,k=k.tag,k!==5&&k!==26&&k!==27||w===null||x===null||(k=wa(v,x),k!=null&&se.push(ai(v,k,w))),He)break;v=v.return}0<se.length&&(C=new A(C,F,null,n,M),Y.push({event:C,listeners:se}))}}if((t&7)===0){e:{if(C=e==="mouseover"||e==="pointerover",A=e==="mouseout"||e==="pointerout",C&&n!==bs&&(F=n.relatedTarget||n.fromElement)&&(Al(F)||F[zl]))break e;if((A||C)&&(C=M.window===M?M:(C=M.ownerDocument)?C.defaultView||C.parentWindow:window,A?(F=n.relatedTarget||n.toElement,A=O,F=F?Al(F):null,F!==null&&(He=m(F),se=F.tag,F!==He||se!==5&&se!==27&&se!==6)&&(F=null)):(A=null,F=O),A!==F)){if(se=Tc,k="onMouseLeave",x="onMouseEnter",v="mouse",(e==="pointerout"||e==="pointerover")&&(se=Oc,k="onPointerLeave",x="onPointerEnter",v="pointer"),He=A==null?C:Ta(A),w=F==null?C:Ta(F),C=new se(k,v+"leave",A,n,M),C.target=He,C.relatedTarget=w,k=null,Al(M)===O&&(se=new se(x,v+"enter",F,n,M),se.target=w,se.relatedTarget=He,k=se),He=k,A&&F)t:{for(se=vy,x=A,v=F,w=0,k=x;k;k=se(k))w++;k=0;for(var ie=v;ie;ie=se(ie))k++;for(;0<w-k;)x=se(x),w--;for(;0<k-w;)v=se(v),k--;for(;w--;){if(x===v||v!==null&&x===v.alternate){se=x;break t}x=se(x),v=se(v)}se=null}else se=null;A!==null&&h_(Y,C,A,se,!1),F!==null&&He!==null&&h_(Y,He,F,se,!0)}}e:{if(C=O?Ta(O):window,A=C.nodeName&&C.nodeName.toLowerCase(),A==="select"||A==="input"&&C.type==="file")var Ae=Dc;else if(jc(C))if(kc)Ae=Rg;else{Ae=Ag;var P=zg}else A=C.nodeName,!A||A.toLowerCase()!=="input"||C.type!=="checkbox"&&C.type!=="radio"?O&&hs(O.elementType)&&(Ae=Dc):Ae=Ng;if(Ae&&(Ae=Ae(e,O))){Mc(Y,Ae,n,M);break e}P&&P(e,C,O),e==="focusout"&&O&&C.type==="number"&&O.memoizedProps.value!=null&&ps(C,"number",C.value)}switch(P=O?Ta(O):window,e){case"focusin":(jc(P)||P.contentEditable==="true")&&(Bl=P,js=O,Ma=null);break;case"focusout":Ma=js=Bl=null;break;case"mousedown":Ms=!0;break;case"contextmenu":case"mouseup":case"dragend":Ms=!1,Qc(Y,n,M);break;case"selectionchange":if(Mg)break;case"keydown":case"keyup":Qc(Y,n,M)}var he;if(zs)e:{switch(e){case"compositionstart":var we="onCompositionStart";break e;case"compositionend":we="onCompositionEnd";break e;case"compositionupdate":we="onCompositionUpdate";break e}we=void 0}else Yl?Nc(e,n)&&(we="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(we="onCompositionStart");we&&(Cc&&n.locale!=="ko"&&(Yl||we!=="onCompositionStart"?we==="onCompositionEnd"&&Yl&&(he=Sc()):(Dn=M,Es="value"in Dn?Dn.value:Dn.textContent,Yl=!0)),P=Ou(O,we),0<P.length&&(we=new wc(we,e,null,n,M),Y.push({event:we,listeners:P}),he?we.data=he:(he=Rc(n),he!==null&&(we.data=he)))),(he=Eg?Tg(e,n):wg(e,n))&&(we=Ou(O,"onBeforeInput"),0<we.length&&(P=new wc("onBeforeInput","beforeinput",null,n,M),Y.push({event:P,listeners:we}),P.data=he)),yy(Y,e,O,n,M)}y_(Y,t)})}function ai(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ou(e,t){for(var n=t+"Capture",l=[];e!==null;){var a=e,i=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||i===null||(a=wa(e,n),a!=null&&l.unshift(ai(e,a,i)),a=wa(e,t),a!=null&&l.push(ai(e,a,i))),e.tag===3)return l;e=e.return}return[]}function vy(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function h_(e,t,n,l,a){for(var i=t._reactName,c=[];n!==null&&n!==l;){var d=n,y=d.alternate,O=d.stateNode;if(d=d.tag,y!==null&&y===l)break;d!==5&&d!==26&&d!==27||O===null||(y=O,a?(O=wa(n,i),O!=null&&c.unshift(ai(n,O,y))):a||(O=wa(n,i),O!=null&&c.push(ai(n,O,y)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var xy=/\r\n?/g,Sy=/\u0000|\uFFFD/g;function b_(e){return(typeof e=="string"?e:""+e).replace(xy,`
`).replace(Sy,"")}function v_(e,t){return t=b_(t),b_(e)===t}function Le(e,t,n,l,a,i){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&Dl(e,""+l);break;case"className":Ni(e,"class",l);break;case"tabIndex":Ni(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Ni(e,n,l);break;case"style":bc(e,l,i);break;case"data":if(t!=="object"){Ni(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=ji(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof i=="function"&&(n==="formAction"?(t!=="input"&&Le(e,t,"name",a.name,a,null),Le(e,t,"formEncType",a.formEncType,a,null),Le(e,t,"formMethod",a.formMethod,a,null),Le(e,t,"formTarget",a.formTarget,a,null)):(Le(e,t,"encType",a.encType,a,null),Le(e,t,"method",a.method,a,null),Le(e,t,"target",a.target,a,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=ji(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=rn);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=ji(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":Se("beforetoggle",e),Se("toggle",e),Ai(e,"popover",l);break;case"xlinkActuate":on(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":on(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":on(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":on(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":on(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":on(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":on(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":on(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":on(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Ai(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=W0.get(n)||n,Ai(e,n,l))}}function ir(e,t,n,l,a,i){switch(n){case"style":bc(e,l,i);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"children":typeof l=="string"?Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&Dl(e,""+l);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"onClick":l!=null&&(e.onclick=rn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!cc.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),t=n.slice(2,a?n.length-7:void 0),i=e[vt]||null,i=i!=null?i[n]:null,typeof i=="function"&&e.removeEventListener(t,i,a),typeof l=="function")){typeof i!="function"&&i!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,a);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Ai(e,n,l)}}}function mt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",e),Se("load",e);var l=!1,a=!1,i;for(i in n)if(n.hasOwnProperty(i)){var c=n[i];if(c!=null)switch(i){case"src":l=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Le(e,t,i,c,n,null)}}a&&Le(e,t,"srcSet",n.srcSet,n,null),l&&Le(e,t,"src",n.src,n,null);return;case"input":Se("invalid",e);var d=i=c=a=null,y=null,O=null;for(l in n)if(n.hasOwnProperty(l)){var M=n[l];if(M!=null)switch(l){case"name":a=M;break;case"type":c=M;break;case"checked":y=M;break;case"defaultChecked":O=M;break;case"value":i=M;break;case"defaultValue":d=M;break;case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(r(137,t));break;default:Le(e,t,l,M,n,null)}}gc(e,i,d,y,O,c,a,!1);return;case"select":Se("invalid",e),l=c=i=null;for(a in n)if(n.hasOwnProperty(a)&&(d=n[a],d!=null))switch(a){case"value":i=d;break;case"defaultValue":c=d;break;case"multiple":l=d;default:Le(e,t,a,d,n,null)}t=i,n=c,e.multiple=!!l,t!=null?Ml(e,!!l,t,!1):n!=null&&Ml(e,!!l,n,!0);return;case"textarea":Se("invalid",e),i=a=l=null;for(c in n)if(n.hasOwnProperty(c)&&(d=n[c],d!=null))switch(c){case"value":l=d;break;case"defaultValue":a=d;break;case"children":i=d;break;case"dangerouslySetInnerHTML":if(d!=null)throw Error(r(91));break;default:Le(e,t,c,d,n,null)}pc(e,l,a,i);return;case"option":for(y in n)n.hasOwnProperty(y)&&(l=n[y],l!=null)&&(y==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Le(e,t,y,l,n,null));return;case"dialog":Se("beforetoggle",e),Se("toggle",e),Se("cancel",e),Se("close",e);break;case"iframe":case"object":Se("load",e);break;case"video":case"audio":for(l=0;l<li.length;l++)Se(li[l],e);break;case"image":Se("error",e),Se("load",e);break;case"details":Se("toggle",e);break;case"embed":case"source":case"link":Se("error",e),Se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(O in n)if(n.hasOwnProperty(O)&&(l=n[O],l!=null))switch(O){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Le(e,t,O,l,n,null)}return;default:if(hs(t)){for(M in n)n.hasOwnProperty(M)&&(l=n[M],l!==void 0&&ir(e,t,M,l,n,void 0));return}}for(d in n)n.hasOwnProperty(d)&&(l=n[d],l!=null&&Le(e,t,d,l,n,null))}function Ey(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,i=null,c=null,d=null,y=null,O=null,M=null;for(A in n){var Y=n[A];if(n.hasOwnProperty(A)&&Y!=null)switch(A){case"checked":break;case"value":break;case"defaultValue":y=Y;default:l.hasOwnProperty(A)||Le(e,t,A,null,l,Y)}}for(var C in l){var A=l[C];if(Y=n[C],l.hasOwnProperty(C)&&(A!=null||Y!=null))switch(C){case"type":i=A;break;case"name":a=A;break;case"checked":O=A;break;case"defaultChecked":M=A;break;case"value":c=A;break;case"defaultValue":d=A;break;case"children":case"dangerouslySetInnerHTML":if(A!=null)throw Error(r(137,t));break;default:A!==Y&&Le(e,t,C,A,l,Y)}}ys(e,c,d,y,O,M,i,a);return;case"select":A=c=d=C=null;for(i in n)if(y=n[i],n.hasOwnProperty(i)&&y!=null)switch(i){case"value":break;case"multiple":A=y;default:l.hasOwnProperty(i)||Le(e,t,i,null,l,y)}for(a in l)if(i=l[a],y=n[a],l.hasOwnProperty(a)&&(i!=null||y!=null))switch(a){case"value":C=i;break;case"defaultValue":d=i;break;case"multiple":c=i;default:i!==y&&Le(e,t,a,i,l,y)}t=d,n=c,l=A,C!=null?Ml(e,!!n,C,!1):!!l!=!!n&&(t!=null?Ml(e,!!n,t,!0):Ml(e,!!n,n?[]:"",!1));return;case"textarea":A=C=null;for(d in n)if(a=n[d],n.hasOwnProperty(d)&&a!=null&&!l.hasOwnProperty(d))switch(d){case"value":break;case"children":break;default:Le(e,t,d,null,l,a)}for(c in l)if(a=l[c],i=n[c],l.hasOwnProperty(c)&&(a!=null||i!=null))switch(c){case"value":C=a;break;case"defaultValue":A=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(r(91));break;default:a!==i&&Le(e,t,c,a,l,i)}yc(e,C,A);return;case"option":for(var F in n)C=n[F],n.hasOwnProperty(F)&&C!=null&&!l.hasOwnProperty(F)&&(F==="selected"?e.selected=!1:Le(e,t,F,null,l,C));for(y in l)C=l[y],A=n[y],l.hasOwnProperty(y)&&C!==A&&(C!=null||A!=null)&&(y==="selected"?e.selected=C&&typeof C!="function"&&typeof C!="symbol":Le(e,t,y,C,l,A));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var se in n)C=n[se],n.hasOwnProperty(se)&&C!=null&&!l.hasOwnProperty(se)&&Le(e,t,se,null,l,C);for(O in l)if(C=l[O],A=n[O],l.hasOwnProperty(O)&&C!==A&&(C!=null||A!=null))switch(O){case"children":case"dangerouslySetInnerHTML":if(C!=null)throw Error(r(137,t));break;default:Le(e,t,O,C,l,A)}return;default:if(hs(t)){for(var He in n)C=n[He],n.hasOwnProperty(He)&&C!==void 0&&!l.hasOwnProperty(He)&&ir(e,t,He,void 0,l,C);for(M in l)C=l[M],A=n[M],!l.hasOwnProperty(M)||C===A||C===void 0&&A===void 0||ir(e,t,M,C,l,A);return}}for(var x in n)C=n[x],n.hasOwnProperty(x)&&C!=null&&!l.hasOwnProperty(x)&&Le(e,t,x,null,l,C);for(Y in l)C=l[Y],A=n[Y],!l.hasOwnProperty(Y)||C===A||C==null&&A==null||Le(e,t,Y,C,l,A)}function x_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Ty(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var a=n[l],i=a.transferSize,c=a.initiatorType,d=a.duration;if(i&&d&&x_(c)){for(c=0,d=a.responseEnd,l+=1;l<n.length;l++){var y=n[l],O=y.startTime;if(O>d)break;var M=y.transferSize,Y=y.initiatorType;M&&x_(Y)&&(y=y.responseEnd,c+=M*(y<d?1:(d-O)/(y-O)))}if(--l,t+=8*(i+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var ur=null,sr=null;function Cu(e){return e.nodeType===9?e:e.ownerDocument}function S_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function E_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function or(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var rr=null;function wy(){var e=window.event;return e&&e.type==="popstate"?e===rr?!1:(rr=e,!0):(rr=null,!1)}var T_=typeof setTimeout=="function"?setTimeout:void 0,Oy=typeof clearTimeout=="function"?clearTimeout:void 0,w_=typeof Promise=="function"?Promise:void 0,Cy=typeof queueMicrotask=="function"?queueMicrotask:typeof w_<"u"?function(e){return w_.resolve(null).then(e).catch(zy)}:T_;function zy(e){setTimeout(function(){throw e})}function Fn(e){return e==="head"}function O_(e,t){var n=t,l=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(a),fa(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")ii(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,ii(n);for(var i=n.firstChild;i;){var c=i.nextSibling,d=i.nodeName;i[Ea]||d==="SCRIPT"||d==="STYLE"||d==="LINK"&&i.rel.toLowerCase()==="stylesheet"||n.removeChild(i),i=c}}else n==="body"&&ii(e.ownerDocument.body);n=a}while(n);fa(t)}function C_(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function cr(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":cr(n),ms(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function Ay(e,t,n,l){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Ea])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(i=e.getAttribute("rel"),i==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(i!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(i=e.getAttribute("src"),(i!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&i&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var i=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===i)return e}else return e;if(e=Zt(e.nextSibling),e===null)break}return null}function Ny(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Zt(e.nextSibling),e===null))return null;return e}function z_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Zt(e.nextSibling),e===null))return null;return e}function fr(e){return e.data==="$?"||e.data==="$~"}function dr(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Ry(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Zt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var _r=null;function A_(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Zt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function N_(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function R_(e,t,n){switch(t=Cu(n),e){case"html":if(e=t.documentElement,!e)throw Error(r(452));return e;case"head":if(e=t.head,!e)throw Error(r(453));return e;case"body":if(e=t.body,!e)throw Error(r(454));return e;default:throw Error(r(451))}}function ii(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);ms(e)}var Kt=new Map,j_=new Set;function zu(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var wn=q.d;q.d={f:jy,r:My,D:Dy,C:ky,L:Uy,m:Yy,X:Ly,S:By,M:Hy};function jy(){var e=wn.f(),t=bu();return e||t}function My(e){var t=Nl(e);t!==null&&t.tag===5&&t.type==="form"?If(t):wn.r(e)}var oa=typeof document>"u"?null:document;function M_(e,t,n){var l=oa;if(l&&typeof t=="string"&&t){var a=Lt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),j_.has(a)||(j_.add(a),e={rel:e,crossOrigin:n,href:t},l.querySelector(a)===null&&(t=l.createElement("link"),mt(t,"link",e),st(t),l.head.appendChild(t)))}}function Dy(e){wn.D(e),M_("dns-prefetch",e,null)}function ky(e,t){wn.C(e,t),M_("preconnect",e,t)}function Uy(e,t,n){wn.L(e,t,n);var l=oa;if(l&&e&&t){var a='link[rel="preload"][as="'+Lt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+Lt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+Lt(n.imageSizes)+'"]')):a+='[href="'+Lt(e)+'"]';var i=a;switch(t){case"style":i=ra(e);break;case"script":i=ca(e)}Kt.has(i)||(e=E({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Kt.set(i,e),l.querySelector(a)!==null||t==="style"&&l.querySelector(ui(i))||t==="script"&&l.querySelector(si(i))||(t=l.createElement("link"),mt(t,"link",e),st(t),l.head.appendChild(t)))}}function Yy(e,t){wn.m(e,t);var n=oa;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+Lt(l)+'"][href="'+Lt(e)+'"]',i=a;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":i=ca(e)}if(!Kt.has(i)&&(e=E({rel:"modulepreload",href:e},t),Kt.set(i,e),n.querySelector(a)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(si(i)))return}l=n.createElement("link"),mt(l,"link",e),st(l),n.head.appendChild(l)}}}function By(e,t,n){wn.S(e,t,n);var l=oa;if(l&&e){var a=Rl(l).hoistableStyles,i=ra(e);t=t||"default";var c=a.get(i);if(!c){var d={loading:0,preload:null};if(c=l.querySelector(ui(i)))d.loading=5;else{e=E({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Kt.get(i))&&mr(e,n);var y=c=l.createElement("link");st(y),mt(y,"link",e),y._p=new Promise(function(O,M){y.onload=O,y.onerror=M}),y.addEventListener("load",function(){d.loading|=1}),y.addEventListener("error",function(){d.loading|=2}),d.loading|=4,Au(c,t,l)}c={type:"stylesheet",instance:c,count:1,state:d},a.set(i,c)}}}function Ly(e,t){wn.X(e,t);var n=oa;if(n&&e){var l=Rl(n).hoistableScripts,a=ca(e),i=l.get(a);i||(i=n.querySelector(si(a)),i||(e=E({src:e,async:!0},t),(t=Kt.get(a))&&gr(e,t),i=n.createElement("script"),st(i),mt(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(a,i))}}function Hy(e,t){wn.M(e,t);var n=oa;if(n&&e){var l=Rl(n).hoistableScripts,a=ca(e),i=l.get(a);i||(i=n.querySelector(si(a)),i||(e=E({src:e,async:!0,type:"module"},t),(t=Kt.get(a))&&gr(e,t),i=n.createElement("script"),st(i),mt(i,"link",e),n.head.appendChild(i)),i={type:"script",instance:i,count:1,state:null},l.set(a,i))}}function D_(e,t,n,l){var a=(a=pe.current)?zu(a):null;if(!a)throw Error(r(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=ra(n.href),n=Rl(a).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ra(n.href);var i=Rl(a).hoistableStyles,c=i.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},i.set(e,c),(i=a.querySelector(ui(e)))&&!i._p&&(c.instance=i,c.state.loading=5),Kt.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Kt.set(e,n),i||Xy(a,e,n,c.state))),t&&l===null)throw Error(r(528,""));return c}if(t&&l!==null)throw Error(r(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=ca(n),n=Rl(a).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,e))}}function ra(e){return'href="'+Lt(e)+'"'}function ui(e){return'link[rel="stylesheet"]['+e+"]"}function k_(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function Xy(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),mt(t,"link",n),st(t),e.head.appendChild(t))}function ca(e){return'[src="'+Lt(e)+'"]'}function si(e){return"script[async]"+e}function U_(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Lt(n.href)+'"]');if(l)return t.instance=l,st(l),l;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),st(l),mt(l,"style",a),Au(l,n.precedence,e),t.instance=l;case"stylesheet":a=ra(n.href);var i=e.querySelector(ui(a));if(i)return t.state.loading|=4,t.instance=i,st(i),i;l=k_(n),(a=Kt.get(a))&&mr(l,a),i=(e.ownerDocument||e).createElement("link"),st(i);var c=i;return c._p=new Promise(function(d,y){c.onload=d,c.onerror=y}),mt(i,"link",l),t.state.loading|=4,Au(i,n.precedence,e),t.instance=i;case"script":return i=ca(n.src),(a=e.querySelector(si(i)))?(t.instance=a,st(a),a):(l=n,(a=Kt.get(i))&&(l=E({},n),gr(l,a)),e=e.ownerDocument||e,a=e.createElement("script"),st(a),mt(a,"link",l),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(r(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Au(l,n.precedence,e));return t.instance}function Au(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=l.length?l[l.length-1]:null,i=a,c=0;c<l.length;c++){var d=l[c];if(d.dataset.precedence===t)i=d;else if(i!==a)break}i?i.parentNode.insertBefore(e,i.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function mr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function gr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Nu=null;function Y_(e,t,n){if(Nu===null){var l=new Map,a=Nu=new Map;a.set(n,l)}else a=Nu,l=a.get(n),l||(l=new Map,a.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var i=n[a];if(!(i[Ea]||i[ct]||e==="link"&&i.getAttribute("rel")==="stylesheet")&&i.namespaceURI!=="http://www.w3.org/2000/svg"){var c=i.getAttribute(t)||"";c=e+c;var d=l.get(c);d?d.push(i):l.set(c,[i])}}return l}function B_(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function qy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function L_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Qy(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ra(l.href),i=t.querySelector(ui(a));if(i){t=i._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Ru.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=i,st(i);return}i=t.ownerDocument||t,l=k_(l),(a=Kt.get(a))&&mr(l,a),i=i.createElement("link"),st(i);var c=i;c._p=new Promise(function(d,y){c.onload=d,c.onerror=y}),mt(i,"link",l),n.instance=i}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Ru.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var yr=0;function Gy(e,t){return e.stylesheets&&e.count===0&&Mu(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Mu(e,e.stylesheets),e.unsuspend){var i=e.unsuspend;e.unsuspend=null,i()}},6e4+t);0<e.imgBytes&&yr===0&&(yr=62500*Ty());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Mu(e,e.stylesheets),e.unsuspend)){var i=e.unsuspend;e.unsuspend=null,i()}},(e.imgBytes>yr?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(a)}}:null}function Ru(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Mu(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var ju=null;function Mu(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ju=new Map,t.forEach(Vy,e),ju=null,Ru.call(e))}function Vy(e,t){if(!(t.state.loading&4)){var n=ju.get(e);if(n)var l=n.get(null);else{n=new Map,ju.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),i=0;i<a.length;i++){var c=a[i];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),l=c)}l&&n.set(null,l)}a=t.instance,c=a.getAttribute("data-precedence"),i=n.get(c)||l,i===l&&n.set(null,a),n.set(c,a),this.count++,l=Ru.bind(this),a.addEventListener("load",l),a.addEventListener("error",l),i?i.parentNode.insertBefore(a,i.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var oi={$$typeof:G,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function Zy(e,t,n,l,a,i,c,d,y){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=cs(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=cs(0),this.hiddenUpdates=cs(null),this.identifierPrefix=l,this.onUncaughtError=a,this.onCaughtError=i,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=y,this.incompleteTransitions=new Map}function H_(e,t,n,l,a,i,c,d,y,O,M,Y){return e=new Zy(e,t,n,c,y,O,M,Y,d),t=1,i===!0&&(t|=24),i=Rt(3,null,null,t),e.current=i,i.stateNode=e,t=Js(),t.refCount++,e.pooledCache=t,t.refCount++,i.memoizedState={element:l,isDehydrated:n,cache:t},$s(i),e}function X_(e){return e?(e=Xl,e):Xl}function q_(e,t,n,l,a,i){a=X_(a),l.context===null?l.context=a:l.pendingContext=a,l=Hn(t),l.payload={element:n},i=i===void 0?null:i,i!==null&&(l.callback=i),n=Xn(e,l,t),n!==null&&(Ot(n,e,t),Ha(n,e,t))}function Q_(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function pr(e,t){Q_(e,t),(e=e.alternate)&&Q_(e,t)}function G_(e){if(e.tag===13||e.tag===31){var t=fl(e,67108864);t!==null&&Ot(t,e,67108864),pr(e,67108864)}}function V_(e){if(e.tag===13||e.tag===31){var t=Ut();t=fs(t);var n=fl(e,t);n!==null&&Ot(n,e,t),pr(e,t)}}var Du=!0;function Ky(e,t,n,l){var a=R.T;R.T=null;var i=q.p;try{q.p=2,hr(e,t,n,l)}finally{q.p=i,R.T=a}}function Jy(e,t,n,l){var a=R.T;R.T=null;var i=q.p;try{q.p=8,hr(e,t,n,l)}finally{q.p=i,R.T=a}}function hr(e,t,n,l){if(Du){var a=br(l);if(a===null)ar(e,t,l,ku,n),K_(e,l);else if(Wy(a,e,t,n,l))l.stopPropagation();else if(K_(e,l),t&4&&-1<Iy.indexOf(e)){for(;a!==null;){var i=Nl(a);if(i!==null)switch(i.tag){case 3:if(i=i.stateNode,i.current.memoizedState.isDehydrated){var c=ul(i.pendingLanes);if(c!==0){var d=i;for(d.pendingLanes|=2,d.entangledLanes|=2;c;){var y=1<<31-At(c);d.entanglements[1]|=y,c&=~y}an(i),(Re&6)===0&&(pu=Ye()+500,ni(0))}}break;case 31:case 13:d=fl(i,2),d!==null&&Ot(d,i,2),bu(),pr(i,2)}if(i=br(l),i===null&&ar(e,t,l,ku,n),i===a)break;a=i}a!==null&&l.stopPropagation()}else ar(e,t,l,null,n)}}function br(e){return e=vs(e),vr(e)}var ku=null;function vr(e){if(ku=null,e=Al(e),e!==null){var t=m(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=h(t),e!==null)return e;e=null}else if(n===31){if(e=S(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return ku=e,null}function Z_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(An()){case il:return 2;case Ol:return 8;case Nn:case bt:return 32;case Rn:return 268435456;default:return 32}default:return 32}}var xr=!1,$n=null,Pn=null,el=null,ri=new Map,ci=new Map,tl=[],Iy="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function K_(e,t){switch(e){case"focusin":case"focusout":$n=null;break;case"dragenter":case"dragleave":Pn=null;break;case"mouseover":case"mouseout":el=null;break;case"pointerover":case"pointerout":ri.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":ci.delete(t.pointerId)}}function fi(e,t,n,l,a,i){return e===null||e.nativeEvent!==i?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:i,targetContainers:[a]},t!==null&&(t=Nl(t),t!==null&&G_(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Wy(e,t,n,l,a){switch(t){case"focusin":return $n=fi($n,e,t,n,l,a),!0;case"dragenter":return Pn=fi(Pn,e,t,n,l,a),!0;case"mouseover":return el=fi(el,e,t,n,l,a),!0;case"pointerover":var i=a.pointerId;return ri.set(i,fi(ri.get(i)||null,e,t,n,l,a)),!0;case"gotpointercapture":return i=a.pointerId,ci.set(i,fi(ci.get(i)||null,e,t,n,l,a)),!0}return!1}function J_(e){var t=Al(e.target);if(t!==null){var n=m(t);if(n!==null){if(t=n.tag,t===13){if(t=h(n),t!==null){e.blockedOn=t,sc(e.priority,function(){V_(n)});return}}else if(t===31){if(t=S(n),t!==null){e.blockedOn=t,sc(e.priority,function(){V_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Uu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=br(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);bs=l,n.target.dispatchEvent(l),bs=null}else return t=Nl(n),t!==null&&G_(t),e.blockedOn=n,!1;t.shift()}return!0}function I_(e,t,n){Uu(e)&&n.delete(t)}function Fy(){xr=!1,$n!==null&&Uu($n)&&($n=null),Pn!==null&&Uu(Pn)&&(Pn=null),el!==null&&Uu(el)&&(el=null),ri.forEach(I_),ci.forEach(I_)}function Yu(e,t){e.blockedOn===t&&(e.blockedOn=null,xr||(xr=!0,u.unstable_scheduleCallback(u.unstable_NormalPriority,Fy)))}var Bu=null;function W_(e){Bu!==e&&(Bu=e,u.unstable_scheduleCallback(u.unstable_NormalPriority,function(){Bu===e&&(Bu=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],a=e[t+2];if(typeof l!="function"){if(vr(l||n)===null)continue;break}var i=Nl(n);i!==null&&(e.splice(t,3),t-=3,bo(i,{pending:!0,data:a,method:n.method,action:l},l,a))}}))}function fa(e){function t(y){return Yu(y,e)}$n!==null&&Yu($n,e),Pn!==null&&Yu(Pn,e),el!==null&&Yu(el,e),ri.forEach(t),ci.forEach(t);for(var n=0;n<tl.length;n++){var l=tl[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<tl.length&&(n=tl[0],n.blockedOn===null);)J_(n),n.blockedOn===null&&tl.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var a=n[l],i=n[l+1],c=a[vt]||null;if(typeof i=="function")c||W_(n);else if(c){var d=null;if(i&&i.hasAttribute("formAction")){if(a=i,c=i[vt]||null)d=c.formAction;else if(vr(a)!==null)continue}else d=c.action;typeof d=="function"?n[l+1]=d:(n.splice(l,3),l-=3),W_(n)}}}function F_(){function e(i){i.canIntercept&&i.info==="react-transition"&&i.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var i=navigation.currentEntry;i&&i.url!=null&&navigation.navigate(i.url,{state:i.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Sr(e){this._internalRoot=e}Lu.prototype.render=Sr.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));var n=t.current,l=Ut();q_(n,l,e,t,null,null)},Lu.prototype.unmount=Sr.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;q_(e.current,2,null,e,null,null),bu(),t[zl]=null}};function Lu(e){this._internalRoot=e}Lu.prototype.unstable_scheduleHydration=function(e){if(e){var t=uc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tl.length&&t!==0&&t<tl[n].priority;n++);tl.splice(n,0,e),n===0&&J_(e)}};var $_=s.version;if($_!=="19.2.4")throw Error(r(527,$_,"19.2.4"));q.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(r(188)):(e=Object.keys(e).join(","),Error(r(268,e)));return e=g(t),e=e!==null?N(e):null,e=e===null?null:e.stateNode,e};var $y={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:R,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Hu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Hu.isDisabled&&Hu.supportsFiber)try{va=Hu.inject($y),zt=Hu}catch{}}return _i.createRoot=function(e,t){if(!f(e))throw Error(r(299));var n=!1,l="",a=id,i=ud,c=sd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(i=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=H_(e,1,!1,null,null,n,l,null,a,i,c,F_),e[zl]=t.current,lr(e),new Sr(t)},_i.hydrateRoot=function(e,t,n){if(!f(e))throw Error(r(299));var l=!1,a="",i=id,c=ud,d=sd,y=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(i=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(d=n.onRecoverableError),n.formState!==void 0&&(y=n.formState)),t=H_(e,1,!0,t,n??null,l,a,y,i,c,d,F_),t.context=X_(null),n=t.current,l=Ut(),l=fs(l),a=Hn(l),a.callback=null,Xn(n,a,l),n=l,t.current.lanes=n,Sa(t,n),an(t),e[zl]=t.current,lr(e),new Lu(t)},_i.version="19.2.4",_i}var om;function cp(){if(om)return wr.exports;om=1;function u(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(u)}catch(s){console.error(s)}}return u(),wr.exports=rp(),wr.exports}var fp=cp(),Wr=Lm(),dp=`svg[fill=none] {
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
}`,_p={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let u=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");u||(u=document.createElement("style"),u.id="feedback-tool-styles-annotation-popup-css-styles",u.textContent=dp,document.head.appendChild(u))}var Qe=_p,mp=({size:u=24})=>_.jsx("svg",{width:u,height:u,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:_.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Ar="__agentation_freeze";function gp(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:s=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const u=window;return u[Ar]||(u[Ar]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),u[Ar]}var gt=gp();typeof window<"u"&&!gt.installed&&(gt.origSetTimeout=window.setTimeout.bind(window),gt.origSetInterval=window.setInterval.bind(window),gt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(u,s,...o)=>typeof u=="string"?gt.origSetTimeout(u,s):gt.origSetTimeout((...r)=>{gt.frozen?gt.frozenTimeoutQueue.push(()=>u(...r)):u(...r)},s,...o),window.setInterval=(u,s,...o)=>typeof u=="string"?gt.origSetInterval(u,s):gt.origSetInterval((...r)=>{gt.frozen||u(...r)},s,...o),window.requestAnimationFrame=u=>gt.origRAF(s=>{gt.frozen?gt.frozenRAFQueue.push(u):u(s)}),gt.installed=!0);var da=gt.origSetTimeout;gt.origSetInterval;T.forwardRef(function({element:s,timestamp:o,selectedText:r,placeholder:f="What should change?",initialValue:m="",submitLabel:h="Add",onSubmit:S,onCancel:p,onDelete:g,style:N,accentColor:E="#3c82f7",isExiting:z=!1,lightMode:j=!1,computedStyles:B},L){const[I,Z]=T.useState(m),[$,G]=T.useState(!1),[Q,te]=T.useState("initial"),[ne,W]=T.useState(!1),[ue,H]=T.useState(!1),le=T.useRef(null),re=T.useRef(null),Oe=T.useRef(null),Fe=T.useRef(null);T.useEffect(()=>{z&&Q!=="exit"&&te("exit")},[z,Q]),T.useEffect(()=>{da(()=>{te("enter")},0);const ae=da(()=>{te("entered")},200),ve=da(()=>{const b=le.current;b&&(b.focus(),b.selectionStart=b.selectionEnd=b.value.length,b.scrollTop=b.scrollHeight)},50);return()=>{clearTimeout(ae),clearTimeout(ve),Oe.current&&clearTimeout(Oe.current),Fe.current&&clearTimeout(Fe.current)}},[]);const Xe=T.useCallback(()=>{Fe.current&&clearTimeout(Fe.current),G(!0),Fe.current=da(()=>{G(!1),le.current?.focus()},250)},[]);T.useImperativeHandle(L,()=>({shake:Xe}),[Xe]);const ce=T.useCallback(()=>{te("exit"),Oe.current=da(()=>{p()},150)},[p]),R=T.useCallback(()=>{I.trim()&&S(I.trim())},[I,S]),q=T.useCallback(ae=>{ae.nativeEvent.isComposing||(ae.key==="Enter"&&!ae.shiftKey&&(ae.preventDefault(),R()),ae.key==="Escape"&&ce())},[R,ce]),K=[Qe.popup,j?Qe.light:"",Q==="enter"?Qe.enter:"",Q==="entered"?Qe.entered:"",Q==="exit"?Qe.exit:"",$?Qe.shake:""].filter(Boolean).join(" ");return _.jsxs("div",{ref:re,className:K,"data-annotation-popup":!0,style:N,onClick:ae=>ae.stopPropagation(),children:[_.jsxs("div",{className:Qe.header,children:[B&&Object.keys(B).length>0?_.jsxs("button",{className:Qe.headerToggle,onClick:()=>{const ae=ue;H(!ue),ae&&da(()=>le.current?.focus(),0)},type:"button",children:[_.jsx("svg",{className:`${Qe.chevron} ${ue?Qe.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:_.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),_.jsx("span",{className:Qe.element,children:s})]}):_.jsx("span",{className:Qe.element,children:s}),o&&_.jsx("span",{className:Qe.timestamp,children:o})]}),B&&Object.keys(B).length>0&&_.jsx("div",{className:`${Qe.stylesWrapper} ${ue?Qe.expanded:""}`,children:_.jsx("div",{className:Qe.stylesInner,children:_.jsx("div",{className:Qe.stylesBlock,children:Object.entries(B).map(([ae,ve])=>_.jsxs("div",{className:Qe.styleLine,children:[_.jsx("span",{className:Qe.styleProperty,children:ae.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",_.jsx("span",{className:Qe.styleValue,children:ve}),";"]},ae))})})}),r&&_.jsxs("div",{className:Qe.quote,children:["“",r.slice(0,80),r.length>80?"...":"","”"]}),_.jsx("textarea",{ref:le,className:Qe.textarea,style:{borderColor:ne?E:void 0},placeholder:f,value:I,onChange:ae=>Z(ae.target.value),onFocus:()=>W(!0),onBlur:()=>W(!1),rows:2,onKeyDown:q}),_.jsxs("div",{className:Qe.actions,children:[g&&_.jsx("div",{className:Qe.deleteWrapper,children:_.jsx("button",{className:Qe.deleteButton,onClick:g,type:"button",children:_.jsx(mp,{size:22})})}),_.jsx("button",{className:Qe.cancel,onClick:ce,children:"Cancel"}),_.jsx("button",{className:Qe.submit,style:{backgroundColor:E,opacity:I.trim()?1:.4},onClick:R,disabled:!I.trim(),children:h})]})]})});var yp=`svg[fill=none] {
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
}`;if(typeof document<"u"){let u=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");u||(u=document.createElement("style"),u.id="feedback-tool-styles-page-toolbar-css-styles",u.textContent=yp,document.head.appendChild(u))}function xi(u,...s){const o=new URL("https://base-ui.com/production-error");return o.searchParams.set("code",u.toString()),s.forEach(r=>o.searchParams.append("args[]",r)),`Base UI error #${u}; visit ${o} for the full message.`}const Hm=T.createContext(void 0);function Si(u){const s=T.useContext(Hm);if(u===!1&&s===void 0)throw new Error(xi(27));return s}const rm={};function al(u,s){const o=T.useRef(rm);return o.current===rm&&(o.current=u(s)),o}function Wu(u,s,o,r){const f=al(Xm).current;return hp(f,u,s,o,r)&&qm(f,[u,s,o,r]),f.callback}function pp(u){const s=al(Xm).current;return bp(s,u)&&qm(s,u),s.callback}function Xm(){return{callback:null,cleanup:null,refs:[]}}function hp(u,s,o,r,f){return u.refs[0]!==s||u.refs[1]!==o||u.refs[2]!==r||u.refs[3]!==f}function bp(u,s){return u.refs.length!==s.length||u.refs.some((o,r)=>o!==s[r])}function qm(u,s){if(u.refs=s,s.every(o=>o==null)){u.callback=null;return}u.callback=o=>{if(u.cleanup&&(u.cleanup(),u.cleanup=null),o!=null){const r=Array(s.length).fill(null);for(let f=0;f<s.length;f+=1){const m=s[f];if(m!=null)switch(typeof m){case"function":{const h=m(o);typeof h=="function"&&(r[f]=h);break}case"object":{m.current=o;break}}}u.cleanup=()=>{for(let f=0;f<s.length;f+=1){const m=s[f];if(m!=null)switch(typeof m){case"function":{const h=r[f];typeof h=="function"?h():m(null);break}case"object":{m.current=null;break}}}}}}}const vp=parseInt(T.version,10);function Fr(u){return vp>=u}function cm(u){if(!T.isValidElement(u))return null;const s=u,o=s.props;return(Fr(19)?o?.ref:s.ref)??null}function Xr(u,s){if(u&&!s)return u;if(!u&&s)return s;if(u||s)return{...u,...s}}function xp(u,s){const o={};for(const r in u){const f=u[r];if(s?.hasOwnProperty(r)){const m=s[r](f);m!=null&&Object.assign(o,m);continue}f===!0?o[`data-${r.toLowerCase()}`]="":f&&(o[`data-${r.toLowerCase()}`]=f.toString())}return o}function Sp(u,s){return typeof u=="function"?u(s):u}function Ep(u,s){return typeof u=="function"?u(s):u}const gi={};function Qm(u,s,o,r,f){let m={...qr(u,gi)};return s&&(m=Ju(m,s)),o&&(m=Ju(m,o)),r&&(m=Ju(m,r)),m}function Tp(u){if(u.length===0)return gi;if(u.length===1)return qr(u[0],gi);let s={...qr(u[0],gi)};for(let o=1;o<u.length;o+=1)s=Ju(s,u[o]);return s}function Ju(u,s){return Gm(s)?s(u):wp(u,s)}function wp(u,s){if(!s)return u;for(const o in s){const r=s[o];switch(o){case"style":{u[o]=Xr(u.style,r);break}case"className":{u[o]=Vm(u.className,r);break}default:Op(o,r)?u[o]=Cp(u[o],r):u[o]=r}}return u}function Op(u,s){const o=u.charCodeAt(0),r=u.charCodeAt(1),f=u.charCodeAt(2);return o===111&&r===110&&f>=65&&f<=90&&(typeof s=="function"||typeof s>"u")}function Gm(u){return typeof u=="function"}function qr(u,s){return Gm(u)?u(s):u??gi}function Cp(u,s){return s?u?o=>{if(zp(o)){const f=o;Qr(f);const m=s(f);return f.baseUIHandlerPrevented||u?.(f),m}const r=s(o);return u?.(o),r}:s:u}function Qr(u){return u.preventBaseUIHandler=()=>{u.baseUIHandlerPrevented=!0},u}function Vm(u,s){return s?u?s+" "+u:s:u}function zp(u){return u!=null&&typeof u=="object"&&"nativeEvent"in u}function Zm(){}const Jt=Object.freeze({}),Ap="data-base-ui-click-trigger",Np={clipPath:"inset(50%)",position:"fixed",top:0,left:0};function is(u,s,o={}){const r=s.render,f=Rp(s,o);if(o.enabled===!1)return null;const m=o.state??Jt;return jp(u,r,f,m)}function Rp(u,s={}){const{className:o,style:r,render:f}=u,{state:m=Jt,ref:h,props:S,stateAttributesMapping:p,enabled:g=!0}=s,N=g?Sp(o,m):void 0,E=g?Ep(r,m):void 0,z=g?xp(m,p):Jt,j=g?Xr(z,Array.isArray(S)?Tp(S):S)??Jt:Jt;return typeof document<"u"&&(g?Array.isArray(h)?j.ref=pp([j.ref,cm(f),...h]):j.ref=Wu(j.ref,cm(f),h):Wu(null,null)),g?(N!==void 0&&(j.className=Vm(j.className,N)),E!==void 0&&(j.style=Xr(j.style,E)),j):Jt}function jp(u,s,o,r){if(s){if(typeof s=="function")return s(o,r);const f=Qm(o,s.props);return f.ref=o.ref,T.cloneElement(s,f)}if(u&&typeof u=="string")return Mp(u,o);throw new Error(xi(8))}function Mp(u,s){return u==="button"?T.createElement("button",{type:"button",...s,key:s.key}):u==="img"?T.createElement("img",{alt:"",...s,key:s.key}):T.createElement(u,s)}let bi=(function(u){return u.startingStyle="data-starting-style",u.endingStyle="data-ending-style",u})({});const Dp={[bi.startingStyle]:""},kp={[bi.endingStyle]:""},Km={transitionStatus(u){return u==="starting"?Dp:u==="ending"?kp:null}};let wl=(function(u){return u.open="data-open",u.closed="data-closed",u[u.startingStyle=bi.startingStyle]="startingStyle",u[u.endingStyle=bi.endingStyle]="endingStyle",u.anchorHidden="data-anchor-hidden",u})({});const Up={[wl.open]:""},Yp={[wl.closed]:""},Bp={[wl.anchorHidden]:""},Jm={open(u){return u?Up:Yp},anchorHidden(u){return u?Bp:null}},Lp={...Jm,...Km},Hp=T.forwardRef(function(s,o){const{render:r,className:f,forceRender:m=!1,...h}=s,{store:S}=Si(),p=S.useState("open"),g=S.useState("nested"),N=S.useState("mounted"),E=S.useState("transitionStatus"),z=T.useMemo(()=>({open:p,transitionStatus:E}),[p,E]);return is("div",s,{state:z,ref:[S.context.backdropRef,o],stateAttributesMapping:Lp,props:[{role:"presentation",hidden:!N,style:{userSelect:"none",WebkitUserSelect:"none"}},h],enabled:m||!g})});function us(){return typeof window<"u"}function ss(u){return $r(u)?(u.nodeName||"").toLowerCase():"#document"}function sn(u){var s;return(u==null||(s=u.ownerDocument)==null?void 0:s.defaultView)||window}function Xp(u){var s;return(s=($r(u)?u.ownerDocument:u.document)||window.document)==null?void 0:s.documentElement}function $r(u){return us()?u instanceof Node||u instanceof sn(u).Node:!1}function Tl(u){return us()?u instanceof Element||u instanceof sn(u).Element:!1}function Cn(u){return us()?u instanceof HTMLElement||u instanceof sn(u).HTMLElement:!1}function Gr(u){return!us()||typeof ShadowRoot>"u"?!1:u instanceof ShadowRoot||u instanceof sn(u).ShadowRoot}const qp=new Set(["inline","contents"]);function os(u){const{overflow:s,overflowX:o,overflowY:r,display:f}=Pr(u);return/auto|scroll|overlay|hidden|clip/.test(s+r+o)&&!qp.has(f)}function Qp(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Gp=new Set(["html","body","#document"]);function Iu(u){return Gp.has(ss(u))}function Pr(u){return sn(u).getComputedStyle(u)}function Im(u){if(ss(u)==="html")return u;const s=u.assignedSlot||u.parentNode||Gr(u)&&u.host||Xp(u);return Gr(s)?s.host:s}function Wm(u){const s=Im(u);return Iu(s)?u.ownerDocument?u.ownerDocument.body:u.body:Cn(s)&&os(s)?s:Wm(s)}function yi(u,s,o){var r;s===void 0&&(s=[]),o===void 0&&(o=!0);const f=Wm(u),m=f===((r=u.ownerDocument)==null?void 0:r.body),h=sn(f);if(m){const S=Vp(h);return s.concat(h,h.visualViewport||[],os(f)?f:[],S&&o?yi(S):[])}return s.concat(f,yi(f,[],o))}function Vp(u){return u.parent&&Object.getPrototypeOf(u.parent)?u.frameElement:null}const Nr=Bm[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0,-3)],Zp=Nr&&Nr!==T.useLayoutEffect?Nr:u=>u();function je(u){const s=al(Kp).current;return s.next=u,Zp(s.effect),s.trampoline}function Kp(){const u={next:void 0,callback:Jp,trampoline:(...s)=>u.callback?.(...s),effect:()=>{u.callback=u.next}};return u}function Jp(){}const Ip=()=>{},rt=typeof document<"u"?T.useLayoutEffect:Ip,Wp=T.createContext(void 0);function Fp(u=!1){const s=T.useContext(Wp);if(s===void 0&&!u)throw new Error(xi(16));return s}function $p(u){const{focusableWhenDisabled:s,disabled:o,composite:r=!1,tabIndex:f=0,isNativeButton:m}=u,h=r&&s!==!1,S=r&&s===!1;return{props:T.useMemo(()=>{const g={onKeyDown(N){o&&s&&N.key!=="Tab"&&N.preventDefault()}};return r||(g.tabIndex=f,!m&&o&&(g.tabIndex=s?f:-1)),(m&&(s||h)||!m&&o)&&(g["aria-disabled"]=o),m&&(!s||S)&&(g.disabled=o),g},[r,o,s,h,S,m,f])}}function Pp(u={}){const{disabled:s=!1,focusableWhenDisabled:o,tabIndex:r=0,native:f=!0}=u,m=T.useRef(null),h=Fp(!0)!==void 0,S=je(()=>{const z=m.current;return!!(z?.tagName==="A"&&z?.href)}),{props:p}=$p({focusableWhenDisabled:o,disabled:s,composite:h,tabIndex:r,isNativeButton:f}),g=T.useCallback(()=>{const z=m.current;eh(z)&&h&&s&&p.disabled===void 0&&z.disabled&&(z.disabled=!1)},[s,p.disabled,h]);rt(g,[g]);const N=T.useCallback((z={})=>{const{onClick:j,onMouseDown:B,onKeyUp:L,onKeyDown:I,onPointerDown:Z,...$}=z;return Qm({type:f?"button":void 0,onClick(Q){if(s){Q.preventDefault();return}j?.(Q)},onMouseDown(Q){s||B?.(Q)},onKeyDown(Q){if(s||(Qr(Q),I?.(Q)),Q.baseUIHandlerPrevented)return;const te=Q.target===Q.currentTarget&&!f&&!S()&&!s,ne=Q.key==="Enter",W=Q.key===" ";te&&((W||ne)&&Q.preventDefault(),ne&&j?.(Q))},onKeyUp(Q){s||(Qr(Q),L?.(Q)),!Q.baseUIHandlerPrevented&&Q.target===Q.currentTarget&&!f&&!s&&Q.key===" "&&j?.(Q)},onPointerDown(Q){if(s){Q.preventDefault();return}Z?.(Q)}},f?void 0:{role:"button"},p,$)},[s,p,f,S]),E=je(z=>{m.current=z,g()});return{getButtonProps:N,buttonRef:E}}function eh(u){return Cn(u)&&u.tagName==="BUTTON"}const th="none",fm="trigger-press",nh="trigger-hover",Fm="outside-press",lh="close-press",$m="focus-out",ah="escape-key",ih="imperative-action";function zn(u,s,o,r){let f=!1,m=!1;const h=Jt;return{reason:u,event:s??new Event("base-ui"),cancel(){f=!0},allowPropagation(){m=!0},get isCanceled(){return f},get isPropagationAllowed(){return m},trigger:o,...h}}const uh=T.forwardRef(function(s,o){const{render:r,className:f,disabled:m=!1,nativeButton:h=!0,...S}=s,{store:p}=Si(),g=p.useState("open");function N(B){g&&p.setOpen(!1,zn(lh,B.nativeEvent))}const{getButtonProps:E,buttonRef:z}=Pp({disabled:m,native:h}),j=T.useMemo(()=>({disabled:m}),[m]);return is("button",s,{state:j,ref:[o,z],props:[{onClick:N},S,E]})}),sh={...Bm};let dm=0;function oh(u,s="mui"){const[o,r]=T.useState(u),f=u||o;return T.useEffect(()=>{o==null&&(dm+=1,r(`${s}-${dm}`))},[o,s]),f}const _m=sh.useId;function ec(u,s){return _m!==void 0?_m():oh(u,s)}const rh=[];function Pm(u){T.useEffect(u,rh)}const mi=0;class pa{static create(){return new pa}currentId=mi;start(s,o){this.clear(),this.currentId=setTimeout(()=>{this.currentId=mi,o()},s)}isStarted(){return this.currentId!==mi}clear=()=>{this.currentId!==mi&&(clearTimeout(this.currentId),this.currentId=mi)};disposeEffect=()=>this.clear}function Fu(){const u=al(pa.create).current;return Pm(u.disposeEffect),u}function Xu(u){const s=al(ch,u).current;return s.next=u,rt(s.effect),s}function ch(u){const s={current:u,next:u,effect:()=>{s.current=s.next}};return s}const ba=typeof navigator<"u",Rr=mh(),e0=yh(),t0=gh(),fh=typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter:none"),n0=Rr.platform==="MacIntel"&&Rr.maxTouchPoints>1?!0:/iP(hone|ad|od)|iOS/.test(Rr.platform),dh=ba&&/apple/i.test(navigator.vendor),Vr=ba&&/android/i.test(e0)||/android/i.test(t0);ba&&e0.toLowerCase().startsWith("mac")&&navigator.maxTouchPoints;const _h=t0.includes("jsdom/");function mh(){if(!ba)return{platform:"",maxTouchPoints:-1};const u=navigator.userAgentData;return u?.platform?{platform:u.platform,maxTouchPoints:navigator.maxTouchPoints}:{platform:navigator.platform??"",maxTouchPoints:navigator.maxTouchPoints??-1}}function gh(){if(!ba)return"";const u=navigator.userAgentData;return u&&Array.isArray(u.brands)?u.brands.map(({brand:s,version:o})=>`${s}/${o}`).join(" "):navigator.userAgent}function yh(){if(!ba)return"";const u=navigator.userAgentData;return u?.platform?u.platform:navigator.platform??""}const Zr="data-base-ui-focusable",l0="active",a0="selected",ph="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function _a(u){let s=u.activeElement;for(;s?.shadowRoot?.activeElement!=null;)s=s.shadowRoot.activeElement;return s}function at(u,s){if(!u||!s)return!1;const o=s.getRootNode?.();if(u.contains(s))return!0;if(o&&Gr(o)){let r=s;for(;r;){if(u===r)return!0;r=r.parentNode||r.host}}return!1}function en(u){return"composedPath"in u?u.composedPath()[0]:u.target}function Pt(u,s){if(s==null)return!1;if("composedPath"in u)return u.composedPath().includes(s);const o=u;return o.target!=null&&s.contains(o.target)}function hh(u){return u.matches("html,body")}function Ct(u){return u?.ownerDocument||document}function bh(u){return Cn(u)&&u.matches(ph)}function mm(u){return u?u.getAttribute("role")==="combobox"&&bh(u):!1}function Kr(u){return u?u.hasAttribute(Zr)?u:u.querySelector(`[${Zr}]`)||u:null}function ga(u,s,o=!0){return u.filter(f=>f.parentId===s&&(!o||f.context?.open)).flatMap(f=>[f,...ga(u,f.id,o)])}function gm(u,s){let o=[],r=u.find(f=>f.id===s)?.parentId;for(;r;){const f=u.find(m=>m.id===r);r=f?.parentId,f&&(o=o.concat(f))}return o}function vh(u){u.preventDefault(),u.stopPropagation()}function xh(u){return"nativeEvent"in u}function Sh(u){return u.mozInputSource===0&&u.isTrusted?!0:Vr&&u.pointerType?u.type==="click"&&u.buttons===1:u.detail===0&&!u.pointerType}function Eh(u){return _h?!1:!Vr&&u.width===0&&u.height===0||Vr&&u.width===1&&u.height===1&&u.pressure===0&&u.detail===0&&u.pointerType==="mouse"||u.width<1&&u.height<1&&u.pressure===0&&u.detail===0&&u.pointerType==="touch"}function Th(u){const s=u.type;return s==="click"||s==="mousedown"||s==="keydown"||s==="keyup"}var wh=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],$u=wh.join(","),i0=typeof Element>"u",ha=i0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,Pu=!i0&&Element.prototype.getRootNode?function(u){var s;return u==null||(s=u.getRootNode)===null||s===void 0?void 0:s.call(u)}:function(u){return u?.ownerDocument},es=function(s,o){var r;o===void 0&&(o=!0);var f=s==null||(r=s.getAttribute)===null||r===void 0?void 0:r.call(s,"inert"),m=f===""||f==="true",h=m||o&&s&&(typeof s.closest=="function"?s.closest("[inert]"):es(s.parentNode));return h},Oh=function(s){var o,r=s==null||(o=s.getAttribute)===null||o===void 0?void 0:o.call(s,"contenteditable");return r===""||r==="true"},u0=function(s,o,r){if(es(s))return[];var f=Array.prototype.slice.apply(s.querySelectorAll($u));return o&&ha.call(s,$u)&&f.unshift(s),f=f.filter(r),f},ts=function(s,o,r){for(var f=[],m=Array.from(s);m.length;){var h=m.shift();if(!es(h,!1))if(h.tagName==="SLOT"){var S=h.assignedElements(),p=S.length?S:h.children,g=ts(p,!0,r);r.flatten?f.push.apply(f,g):f.push({scopeParent:h,candidates:g})}else{var N=ha.call(h,$u);N&&r.filter(h)&&(o||!s.includes(h))&&f.push(h);var E=h.shadowRoot||typeof r.getShadowRoot=="function"&&r.getShadowRoot(h),z=!es(E,!1)&&(!r.shadowRootFilter||r.shadowRootFilter(h));if(E&&z){var j=ts(E===!0?h.children:E.children,!0,r);r.flatten?f.push.apply(f,j):f.push({scopeParent:h,candidates:j})}else m.unshift.apply(m,h.children)}}return f},s0=function(s){return!isNaN(parseInt(s.getAttribute("tabindex"),10))},o0=function(s){if(!s)throw new Error("No node provided");return s.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(s.tagName)||Oh(s))&&!s0(s)?0:s.tabIndex},Ch=function(s,o){var r=o0(s);return r<0&&o&&!s0(s)?0:r},zh=function(s,o){return s.tabIndex===o.tabIndex?s.documentOrder-o.documentOrder:s.tabIndex-o.tabIndex},r0=function(s){return s.tagName==="INPUT"},Ah=function(s){return r0(s)&&s.type==="hidden"},Nh=function(s){var o=s.tagName==="DETAILS"&&Array.prototype.slice.apply(s.children).some(function(r){return r.tagName==="SUMMARY"});return o},Rh=function(s,o){for(var r=0;r<s.length;r++)if(s[r].checked&&s[r].form===o)return s[r]},jh=function(s){if(!s.name)return!0;var o=s.form||Pu(s),r=function(S){return o.querySelectorAll('input[type="radio"][name="'+S+'"]')},f;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")f=r(window.CSS.escape(s.name));else try{f=r(s.name)}catch(h){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",h.message),!1}var m=Rh(f,s.form);return!m||m===s},Mh=function(s){return r0(s)&&s.type==="radio"},Dh=function(s){return Mh(s)&&!jh(s)},kh=function(s){var o,r=s&&Pu(s),f=(o=r)===null||o===void 0?void 0:o.host,m=!1;if(r&&r!==s){var h,S,p;for(m=!!((h=f)!==null&&h!==void 0&&(S=h.ownerDocument)!==null&&S!==void 0&&S.contains(f)||s!=null&&(p=s.ownerDocument)!==null&&p!==void 0&&p.contains(s));!m&&f;){var g,N,E;r=Pu(f),f=(g=r)===null||g===void 0?void 0:g.host,m=!!((N=f)!==null&&N!==void 0&&(E=N.ownerDocument)!==null&&E!==void 0&&E.contains(f))}}return m},ym=function(s){var o=s.getBoundingClientRect(),r=o.width,f=o.height;return r===0&&f===0},Uh=function(s,o){var r=o.displayCheck,f=o.getShadowRoot;if(r==="full-native"&&"checkVisibility"in s){var m=s.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!m}if(getComputedStyle(s).visibility==="hidden")return!0;var h=ha.call(s,"details>summary:first-of-type"),S=h?s.parentElement:s;if(ha.call(S,"details:not([open]) *"))return!0;if(!r||r==="full"||r==="full-native"||r==="legacy-full"){if(typeof f=="function"){for(var p=s;s;){var g=s.parentElement,N=Pu(s);if(g&&!g.shadowRoot&&f(g)===!0)return ym(s);s.assignedSlot?s=s.assignedSlot:!g&&N!==s.ownerDocument?s=N.host:s=g}s=p}if(kh(s))return!s.getClientRects().length;if(r!=="legacy-full")return!0}else if(r==="non-zero-area")return ym(s);return!1},Yh=function(s){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(s.tagName))for(var o=s.parentElement;o;){if(o.tagName==="FIELDSET"&&o.disabled){for(var r=0;r<o.children.length;r++){var f=o.children.item(r);if(f.tagName==="LEGEND")return ha.call(o,"fieldset[disabled] *")?!0:!f.contains(s)}return!0}o=o.parentElement}return!1},Jr=function(s,o){return!(o.disabled||Ah(o)||Uh(o,s)||Nh(o)||Yh(o))},Ir=function(s,o){return!(Dh(o)||o0(o)<0||!Jr(s,o))},Bh=function(s){var o=parseInt(s.getAttribute("tabindex"),10);return!!(isNaN(o)||o>=0)},c0=function(s){var o=[],r=[];return s.forEach(function(f,m){var h=!!f.scopeParent,S=h?f.scopeParent:f,p=Ch(S,h),g=h?c0(f.candidates):S;p===0?h?o.push.apply(o,g):o.push(S):r.push({documentOrder:m,tabIndex:p,item:f,isScope:h,content:g})}),r.sort(zh).reduce(function(f,m){return m.isScope?f.push.apply(f,m.content):f.push(m.content),f},[]).concat(o)},rs=function(s,o){o=o||{};var r;return o.getShadowRoot?r=ts([s],o.includeContainer,{filter:Ir.bind(null,o),flatten:!1,getShadowRoot:o.getShadowRoot,shadowRootFilter:Bh}):r=u0(s,o.includeContainer,Ir.bind(null,o)),c0(r)},Lh=function(s,o){o=o||{};var r;return o.getShadowRoot?r=ts([s],o.includeContainer,{filter:Jr.bind(null,o),flatten:!0,getShadowRoot:o.getShadowRoot}):r=u0(s,o.includeContainer,Jr.bind(null,o)),r},f0=function(s,o){if(o=o||{},!s)throw new Error("No node provided");return ha.call(s,$u)===!1?!1:Ir(o,s)};const Ei=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function d0(u,s){const o=rs(u,Ei()),r=o.length;if(r===0)return;const f=_a(Ct(u)),m=o.indexOf(f),h=m===-1?s===1?0:r-1:m+s;return o[h]}function _0(u){return d0(Ct(u).body,1)||u}function m0(u){return d0(Ct(u).body,-1)||u}function pi(u,s){const o=s||u.currentTarget,r=u.relatedTarget;return!r||!at(o,r)}function Hh(u){rs(u,Ei()).forEach(o=>{o.dataset.tabindex=o.getAttribute("tabindex")||"",o.setAttribute("tabindex","-1")})}function pm(u){u.querySelectorAll("[data-tabindex]").forEach(o=>{const r=o.dataset.tabindex;delete o.dataset.tabindex,r?o.setAttribute("tabindex",r):o.removeAttribute("tabindex")})}function Xh(){const u=new Map;return{emit(s,o){u.get(s)?.forEach(r=>r(o))},on(s,o){u.has(s)||u.set(s,new Set),u.get(s).add(o)},off(s,o){u.get(s)?.delete(o)}}}const qh=T.createContext(null),Qh=T.createContext(null),g0=()=>T.useContext(qh)?.id||null,y0=u=>{const s=T.useContext(Qh);return u??s};function ns(u){return`data-base-ui-${u}`}const Gh={clipPath:"inset(50%)",overflow:"hidden",whiteSpace:"nowrap",border:0,padding:0,width:1,height:1,margin:-1},p0={...Gh,position:"fixed",top:0,left:0},qu=null;class Vh{callbacks=[];callbacksCount=0;nextId=1;startId=1;isScheduled=!1;tick=s=>{this.isScheduled=!1;const o=this.callbacks,r=this.callbacksCount;if(this.callbacks=[],this.callbacksCount=0,this.startId=this.nextId,r>0)for(let f=0;f<o.length;f+=1)o[f]?.(s)};request(s){const o=this.nextId;return this.nextId+=1,this.callbacks.push(s),this.callbacksCount+=1,!this.isScheduled&&(requestAnimationFrame(this.tick),this.isScheduled=!0),o}cancel(s){const o=s-this.startId;o<0||o>=this.callbacks.length||(this.callbacks[o]=null,this.callbacksCount-=1)}}const Qu=new Vh;class un{static create(){return new un}static request(s){return Qu.request(s)}static cancel(s){return Qu.cancel(s)}currentId=qu;request(s){this.cancel(),this.currentId=Qu.request(()=>{this.currentId=qu,s()})}cancel=()=>{this.currentId!==qu&&(Qu.cancel(this.currentId),this.currentId=qu)};disposeEffect=()=>this.cancel}function h0(){const u=al(un.create).current;return Pm(u.disposeEffect),u}function Ti(u){return u?.ownerDocument||document}const ls=T.forwardRef(function(s,o){const[r,f]=T.useState();rt(()=>{dh&&f("button")},[]);const m={tabIndex:0,role:r};return _.jsx("span",{...s,ref:o,style:p0,"aria-hidden":r?void 0:!0,...m,"data-base-ui-focus-guard":""})});let hm=0;function jr(u,s={}){const{preventScroll:o=!1,cancelPrevious:r=!0,sync:f=!1}=s;r&&cancelAnimationFrame(hm);const m=()=>u?.focus({preventScroll:o});f?m():hm=requestAnimationFrame(m)}const ya={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function bm(u){return u==="inert"?ya.inert:u==="aria-hidden"?ya["aria-hidden"]:ya.none}let Gu=new WeakSet,Vu={},Mr=0;const b0=u=>u&&(u.host||b0(u.parentNode)),Zh=(u,s)=>s.map(o=>{if(u.contains(o))return o;const r=b0(o);return u.contains(r)?r:null}).filter(o=>o!=null);function Kh(u,s,o,r){const f="data-base-ui-inert",m=r?"inert":o?"aria-hidden":null,h=Zh(s,u),S=new Set,p=new Set(h),g=[];Vu[f]||(Vu[f]=new WeakMap);const N=Vu[f];h.forEach(E),z(s),S.clear();function E(j){!j||S.has(j)||(S.add(j),j.parentNode&&E(j.parentNode))}function z(j){!j||p.has(j)||[].forEach.call(j.children,B=>{if(ss(B)!=="script")if(S.has(B))z(B);else{const L=m?B.getAttribute(m):null,I=L!==null&&L!=="false",Z=bm(m),$=(Z.get(B)||0)+1,G=(N.get(B)||0)+1;Z.set(B,$),N.set(B,G),g.push(B),$===1&&I&&Gu.add(B),G===1&&B.setAttribute(f,""),!I&&m&&B.setAttribute(m,m==="inert"?"":"true")}})}return Mr+=1,()=>{g.forEach(j=>{const B=bm(m),I=(B.get(j)||0)-1,Z=(N.get(j)||0)-1;B.set(j,I),N.set(j,Z),I||(!Gu.has(j)&&m&&j.removeAttribute(m),Gu.delete(j)),Z||j.removeAttribute(f)}),Mr-=1,Mr||(ya.inert=new WeakMap,ya["aria-hidden"]=new WeakMap,ya.none=new WeakMap,Gu=new WeakSet,Vu={})}}function Jh(u,s=!1,o=!1){const r=Ct(u[0]).body;return Kh(u.concat(Array.from(r.querySelectorAll("[aria-live]"))),r,s,o)}const v0=T.createContext(null),x0=()=>T.useContext(v0),Ih=ns("portal");function Wh(u={}){const{ref:s,container:o,componentProps:r=Jt,elementProps:f,elementState:m}=u,h=ec(),p=x0()?.portalNode,[g,N]=T.useState(null),[E,z]=T.useState(null),j=je(Z=>{Z!==null&&z(Z)}),B=T.useRef(null);rt(()=>{if(o===null){B.current&&(B.current=null,z(null),N(null));return}if(h==null)return;const Z=(o&&($r(o)?o:o.current))??p??document.body;if(Z==null){B.current&&(B.current=null,z(null),N(null));return}B.current!==Z&&(B.current=Z,z(null),N(Z))},[o,p,h]);const L=is("div",r,{ref:[s,j],state:m,props:[{id:h,[Ih]:""},f]});return{portalNode:E,portalSubtree:g&&L?Wr.createPortal(L,g):null}}const Fh=T.forwardRef(function(s,o){const{children:r,container:f,className:m,render:h,renderGuards:S,...p}=s,{portalNode:g,portalSubtree:N}=Wh({container:f,ref:o,componentProps:s,elementProps:p}),E=T.useRef(null),z=T.useRef(null),j=T.useRef(null),B=T.useRef(null),[L,I]=T.useState(null),Z=L?.modal,$=L?.open,G=typeof S=="boolean"?S:!!L&&!L.modal&&L.open&&!!g;T.useEffect(()=>{if(!g||Z)return;function te(ne){g&&ne.relatedTarget&&pi(ne)&&(ne.type==="focusin"?pm:Hh)(g)}return g.addEventListener("focusin",te,!0),g.addEventListener("focusout",te,!0),()=>{g.removeEventListener("focusin",te,!0),g.removeEventListener("focusout",te,!0)}},[g,Z]),T.useEffect(()=>{!g||$||pm(g)},[$,g]);const Q=T.useMemo(()=>({beforeOutsideRef:E,afterOutsideRef:z,beforeInsideRef:j,afterInsideRef:B,portalNode:g,setFocusManagerState:I}),[g]);return _.jsxs(T.Fragment,{children:[N,_.jsxs(v0.Provider,{value:Q,children:[G&&g&&_.jsx(ls,{"data-type":"outside",ref:E,onFocus:te=>{if(pi(te,g))j.current?.focus();else{const ne=L?L.domReference:null;m0(ne)?.focus()}}}),G&&g&&_.jsx("span",{"aria-owns":g.id,style:Np}),g&&Wr.createPortal(r,g),G&&g&&_.jsx(ls,{"data-type":"outside",ref:z,onFocus:te=>{if(pi(te,g))B.current?.focus();else{const ne=L?L.domReference:null;_0(ne)?.focus(),L?.closeOnFocusOut&&L?.onOpenChange(!1,zn($m,te.nativeEvent))}}})]})]})});function On(u){return u==null?u:"current"in u?u.current:u}function $h(u,s){const o=sn(u.target);return u instanceof o.KeyboardEvent?"keyboard":u instanceof o.FocusEvent?s||"keyboard":"pointerType"in u?u.pointerType||"keyboard":"touches"in u?"touch":u instanceof o.MouseEvent?s||(u.detail===0?"keyboard":"mouse"):""}const vm=20;let ll=[];function tc(){ll=ll.filter(u=>u.isConnected)}function Ph(u){tc(),u&&ss(u)!=="body"&&(ll.push(u),ll.length>vm&&(ll=ll.slice(-vm)))}function Dr(){return tc(),ll[ll.length-1]}function eb(u){if(!u)return null;const s=Ei();return f0(u,s)?u:rs(u,s)[0]||u}function tb(u){return!u||!u.isConnected?!1:typeof u.checkVisibility=="function"?u.checkVisibility():Pr(u).display!=="none"}function xm(u,s){if(!s.current.includes("floating")&&!u.getAttribute("role")?.includes("dialog"))return;const o=Ei(),f=Lh(u,o).filter(h=>{const S=h.getAttribute("data-tabindex")||"";return f0(h,o)||h.hasAttribute("data-tabindex")&&!S.startsWith("-")}),m=u.getAttribute("tabindex");s.current.includes("floating")||f.length===0?m!=="0"&&u.setAttribute("tabindex","0"):(m!=="-1"||u.hasAttribute("data-tabindex")&&u.getAttribute("data-tabindex")!=="-1")&&(u.setAttribute("tabindex","-1"),u.setAttribute("data-tabindex","-1"))}function nb(u){const{context:s,children:o,disabled:r=!1,order:f=["content"],initialFocus:m=!0,returnFocus:h=!0,restoreFocus:S=!1,modal:p=!0,closeOnFocusOut:g=!0,openInteractionType:N="",getInsideElements:E=()=>[],nextFocusableElement:z,previousFocusableElement:j,beforeContentFocusGuardRef:B,externalTree:L}=u,I="rootStore"in s?s.rootStore:s,Z=I.useState("open"),$=I.useState("domReferenceElement"),G=I.useState("floatingElement"),{events:Q,dataRef:te}=I.context,ne=je(()=>te.current.floatingContext?.nodeId),W=je(E),ue=m===!1,H=mm($)&&ue,le=Xu(f),re=Xu(m),Oe=Xu(h),Fe=Xu(N),Xe=y0(L),ce=x0(),R=T.useRef(null),q=T.useRef(null),K=T.useRef(!1),ae=T.useRef(!1),ve=T.useRef(!1),b=T.useRef(-1),U=T.useRef(""),X=T.useRef(""),J=T.useRef(null),oe=T.useRef(null),pe=Wu(J,B,ce?.beforeInsideRef),Ee=Wu(oe,ce?.afterInsideRef),Je=Fu(),Me=Fu(),Yt=h0(),It=ce!=null,D=Kr(G),ge=je((V=D)=>V?rs(V,Ei()):[]),ee=je(V=>{const de=ge(V);return le.current.map(()=>de).filter(Boolean).flat()});T.useEffect(()=>{if(r||!p)return;function V(be){be.key==="Tab"&&at(D,_a(Ct(D)))&&ge().length===0&&!H&&vh(be)}const de=Ct(D);return de.addEventListener("keydown",V),()=>{de.removeEventListener("keydown",V)}},[r,$,D,p,le,H,ge,ee]),T.useEffect(()=>{if(r||!G)return;function V(de){const be=en(de),Ge=ge().indexOf(be);Ge!==-1&&(b.current=Ge)}return G.addEventListener("focusin",V),()=>{G.removeEventListener("focusin",V)}},[r,G,ge]),T.useEffect(()=>{if(r||!Z)return;const V=Ct(D);function de(){ve.current=!1}function be(Ge){const _e=en(Ge),fe=at(G,_e)||at($,_e)||at(ce?.portalNode,_e);ve.current=!fe,X.current=Ge.pointerType||"keyboard"}function ze(){X.current="keyboard"}return V.addEventListener("pointerdown",be,!0),V.addEventListener("pointerup",de,!0),V.addEventListener("pointercancel",de,!0),V.addEventListener("keydown",ze,!0),()=>{V.removeEventListener("pointerdown",be,!0),V.removeEventListener("pointerup",de,!0),V.removeEventListener("pointercancel",de,!0),V.removeEventListener("keydown",ze,!0)}},[r,G,$,D,Z,ce]),T.useEffect(()=>{if(r||!g)return;function V(){ae.current=!0,Me.start(0,()=>{ae.current=!1})}function de(_e){const fe=_e.relatedTarget,pt=_e.currentTarget,Ye=en(_e);queueMicrotask(()=>{const An=ne(),il=I.context.triggerElements,Ol=fe?.hasAttribute(ns("focus-guard"))&&[J.current,oe.current,ce?.beforeInsideRef.current,ce?.afterInsideRef.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,On(j),On(z)].includes(fe),Nn=!(at($,fe)||at(G,fe)||at(fe,G)||at(ce?.portalNode,fe)||fe!=null&&il.hasElement(fe)||il.hasMatchingElement(bt=>at(bt,fe))||Ol||Xe&&(ga(Xe.nodesRef.current,An).find(bt=>at(bt.context?.elements.floating,fe)||at(bt.context?.elements.domReference,fe))||gm(Xe.nodesRef.current,An).find(bt=>[bt.context?.elements.floating,Kr(bt.context?.elements.floating)].includes(fe)||bt.context?.elements.domReference===fe)));if(pt===$&&D&&xm(D,le),S&&pt!==$&&!tb(Ye)&&_a(Ct(D))===Ct(D).body){if(Cn(D)&&(D.focus(),S==="popup")){Yt.request(()=>{D.focus()});return}const bt=b.current,Rn=ge(),Cl=Rn[bt]||Rn[Rn.length-1]||D;Cn(Cl)&&Cl.focus()}if(te.current.insideReactTree){te.current.insideReactTree=!1;return}(H||!p)&&fe&&Nn&&!ae.current&&(H||fe!==Dr())&&(K.current=!0,I.setOpen(!1,zn($m,_e)))})}function be(){ve.current||(te.current.insideReactTree=!0,Je.start(0,()=>{te.current.insideReactTree=!1}))}const ze=Cn($)?$:null,Ge=[];if(!(!G&&!ze))return ze&&(ze.addEventListener("focusout",de),ze.addEventListener("pointerdown",V),Ge.push(()=>{ze.removeEventListener("focusout",de),ze.removeEventListener("pointerdown",V)})),G&&(G.addEventListener("focusout",de),ce&&(G.addEventListener("focusout",be,!0),Ge.push(()=>{G.removeEventListener("focusout",be,!0)})),Ge.push(()=>{G.removeEventListener("focusout",de)})),()=>{Ge.forEach(_e=>{_e()})}},[r,$,G,D,p,Xe,ce,I,g,S,ge,H,ne,le,te,Je,Me,Yt,z,j]),T.useEffect(()=>{if(r||!G||!Z)return;const V=Array.from(ce?.portalNode?.querySelectorAll(`[${ns("portal")}]`)||[]),be=(Xe?gm(Xe.nodesRef.current,ne()):[]).find(_e=>mm(_e.context?.elements.domReference||null))?.context?.elements.domReference,ze=[G,be,...V,...W(),R.current,q.current,J.current,oe.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,On(j),On(z),H?$:null].filter(_e=>_e!=null),Ge=Jh(ze,p||H);return()=>{Ge()}},[Z,r,$,G,p,le,ce,H,Xe,ne,W,z,j]),rt(()=>{if(!Z||r||!Cn(D))return;const V=Ct(D),de=_a(V);queueMicrotask(()=>{const be=ee(D),ze=re.current,Ge=typeof ze=="function"?ze(Fe.current||""):ze;if(Ge===void 0||Ge===!1)return;let _e;Ge===!0||Ge===null?_e=be[0]||D:_e=On(Ge),_e=_e||be[0]||D,!at(D,de)&&jr(_e,{preventScroll:_e===D})})},[r,Z,D,ue,ee,re,Fe]),rt(()=>{if(r||!D)return;const V=Ct(D),de=_a(V);Ph(de);function be(_e){if(_e.open||(U.current=$h(_e.nativeEvent,X.current)),_e.reason===nh&&_e.nativeEvent.type==="mouseleave"&&(K.current=!0),_e.reason===Fm)if(_e.nested)K.current=!1;else if(Sh(_e.nativeEvent)||Eh(_e.nativeEvent))K.current=!1;else{let fe=!1;document.createElement("div").focus({get preventScroll(){return fe=!0,!1}}),fe?K.current=!1:K.current=!0}}Q.on("openchange",be);const ze=V.createElement("span");ze.setAttribute("tabindex","-1"),ze.setAttribute("aria-hidden","true"),Object.assign(ze.style,p0),It&&$&&$.insertAdjacentElement("afterend",ze);function Ge(){const _e=Oe.current;let fe=typeof _e=="function"?_e(U.current):_e;if(fe===void 0||fe===!1)return null;if(fe===null&&(fe=!0),typeof fe=="boolean"){const Ye=$||Dr();return Ye&&Ye.isConnected?Ye:ze}const pt=$||Dr()||ze;return On(fe)||pt}return()=>{Q.off("openchange",be);const _e=_a(V),fe=at(G,_e)||Xe&&ga(Xe.nodesRef.current,ne(),!1).some(Ye=>at(Ye.context?.elements.floating,_e)),pt=Ge();queueMicrotask(()=>{const Ye=eb(pt),An=typeof Oe.current!="boolean";Oe.current&&!K.current&&Cn(Ye)&&(!(!An&&Ye!==_e&&_e!==V.body)||fe)&&Ye.focus({preventScroll:!0}),ze.remove()})}},[r,G,D,Oe,te,Q,Xe,It,$,ne]),T.useEffect(()=>{queueMicrotask(()=>{K.current=!1})},[r]),T.useEffect(()=>{if(r||!Z)return;function V(be){en(be)?.closest(`[${Ap}]`)&&(ae.current=!0)}const de=Ct(D);return de.addEventListener("pointerdown",V,!0),()=>{de.removeEventListener("pointerdown",V,!0)}},[r,Z,D]),rt(()=>{if(!r&&ce)return ce.setFocusManagerState({modal:p,closeOnFocusOut:g,open:Z,onOpenChange:I.setOpen,domReference:$}),()=>{ce.setFocusManagerState(null)}},[r,ce,p,Z,I,g,$]),rt(()=>{if(!(r||!D))return xm(D,le),()=>{queueMicrotask(tc)}},[r,D,le]);const it=!r&&(p?!H:!0)&&(It||p);return _.jsxs(T.Fragment,{children:[it&&_.jsx(ls,{"data-type":"inside",ref:pe,onFocus:V=>{if(p){const de=ee();jr(de[de.length-1])}else ce?.portalNode&&(K.current=!1,pi(V,ce.portalNode)?_0($)?.focus():On(j??ce.beforeOutsideRef)?.focus())}}),o,it&&_.jsx(ls,{"data-type":"inside",ref:Ee,onFocus:V=>{p?jr(ee()[0]):ce?.portalNode&&(g&&(K.current=!0),pi(V,ce.portalNode)?m0($)?.focus():On(z??ce.afterOutsideRef)?.focus())}})]})}const lb={intentional:"onClick",sloppy:"onPointerDown"};function ab(u){return{escapeKey:typeof u=="boolean"?u:u?.escapeKey??!1,outsidePress:typeof u=="boolean"?u:u?.outsidePress??!0}}function ib(u,s={}){const o="rootStore"in u?u.rootStore:u,r=o.useState("open"),f=o.useState("floatingElement"),m=o.useState("referenceElement"),h=o.useState("domReferenceElement"),{onOpenChange:S,dataRef:p}=o.context,{enabled:g=!0,escapeKey:N=!0,outsidePress:E=!0,outsidePressEvent:z="sloppy",referencePress:j=!1,referencePressEvent:B="sloppy",ancestorScroll:L=!1,bubbles:I,externalTree:Z}=s,$=y0(Z),G=je(typeof E=="function"?E:()=>!1),Q=typeof E=="function"?G:E,te=T.useRef(!1),{escapeKey:ne,outsidePress:W}=ab(I),ue=T.useRef(null),H=Fu(),le=Fu(),re=je(()=>{le.clear(),p.current.insideReactTree=!1}),Oe=T.useRef(!1),Fe=T.useRef(""),Xe=je(D=>{Fe.current=D.pointerType}),ce=je(()=>{const D=Fe.current,ge=D==="pen"||!D?"mouse":D,ee=typeof z=="function"?z():z;return typeof ee=="string"?ee:ee[ge]}),R=je(D=>{if(!r||!g||!N||D.key!=="Escape"||Oe.current)return;const ge=p.current.floatingContext?.nodeId,ee=$?ga($.nodesRef.current,ge):[];if(!ne&&ee.length>0){let de=!0;if(ee.forEach(be=>{be.context?.open&&!be.context.dataRef.current.__escapeKeyBubbles&&(de=!1)}),!de)return}const it=xh(D)?D.nativeEvent:D,V=zn(ah,it);o.setOpen(!1,V),!ne&&!V.isPropagationAllowed&&D.stopPropagation()}),q=je(D=>{const ge=ce();return ge==="intentional"&&D.type!=="click"||ge==="sloppy"&&D.type==="click"}),K=je(()=>{p.current.insideReactTree=!0,le.start(0,re)}),ae=je((D,ge=!1)=>{if(q(D)){re();return}if(p.current.insideReactTree){re();return}if(ce()==="intentional"&&ge||typeof Q=="function"&&!Q(D))return;const ee=en(D),it=`[${ns("inert")}]`,V=Ct(o.select("floatingElement")).querySelectorAll(it),de=o.context.triggerElements;if(ee&&(de.hasElement(ee)||de.hasMatchingElement(fe=>at(fe,ee))))return;let be=Tl(ee)?ee:null;for(;be&&!Iu(be);){const fe=Im(be);if(Iu(fe)||!Tl(fe))break;be=fe}if(V.length&&Tl(ee)&&!hh(ee)&&!at(ee,o.select("floatingElement"))&&Array.from(V).every(fe=>!at(be,fe)))return;if(Cn(ee)&&!("touches"in D)){const fe=Iu(ee),pt=Pr(ee),Ye=/auto|scroll/,An=fe||Ye.test(pt.overflowX),il=fe||Ye.test(pt.overflowY),Ol=An&&ee.clientWidth>0&&ee.scrollWidth>ee.clientWidth,Nn=il&&ee.clientHeight>0&&ee.scrollHeight>ee.clientHeight,bt=pt.direction==="rtl",Rn=Nn&&(bt?D.offsetX<=ee.offsetWidth-ee.clientWidth:D.offsetX>ee.clientWidth),Cl=Ol&&D.offsetY>ee.clientHeight;if(Rn||Cl)return}const ze=p.current.floatingContext?.nodeId,Ge=$&&ga($.nodesRef.current,ze).some(fe=>Pt(D,fe.context?.elements.floating));if(Pt(D,o.select("floatingElement"))||Pt(D,o.select("domReferenceElement"))||Ge)return;const _e=$?ga($.nodesRef.current,ze):[];if(_e.length>0){let fe=!0;if(_e.forEach(pt=>{pt.context?.open&&!pt.context.dataRef.current.__outsidePressBubbles&&(fe=!1)}),!fe)return}o.setOpen(!1,zn(Fm,D)),re()}),ve=je(D=>{ce()!=="sloppy"||D.pointerType==="touch"||!o.select("open")||!g||Pt(D,o.select("floatingElement"))||Pt(D,o.select("domReferenceElement"))||ae(D)}),b=je(D=>{if(ce()!=="sloppy"||!o.select("open")||!g||Pt(D,o.select("floatingElement"))||Pt(D,o.select("domReferenceElement")))return;const ge=D.touches[0];ge&&(ue.current={startTime:Date.now(),startX:ge.clientX,startY:ge.clientY,dismissOnTouchEnd:!1,dismissOnMouseDown:!0},H.start(1e3,()=>{ue.current&&(ue.current.dismissOnTouchEnd=!1,ue.current.dismissOnMouseDown=!1)}))}),U=je(D=>{const ge=en(D);function ee(){b(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),X=je(D=>{const ge=te.current;if(te.current=!1,H.clear(),D.type==="mousedown"&&ue.current&&!ue.current.dismissOnMouseDown)return;const ee=en(D);function it(){D.type==="pointerdown"?ve(D):ae(D,ge),ee?.removeEventListener(D.type,it)}ee?.addEventListener(D.type,it)}),J=je(D=>{if(ce()!=="sloppy"||!ue.current||Pt(D,o.select("floatingElement"))||Pt(D,o.select("domReferenceElement")))return;const ge=D.touches[0];if(!ge)return;const ee=Math.abs(ge.clientX-ue.current.startX),it=Math.abs(ge.clientY-ue.current.startY),V=Math.sqrt(ee*ee+it*it);V>5&&(ue.current.dismissOnTouchEnd=!0),V>10&&(ae(D),H.clear(),ue.current=null)}),oe=je(D=>{const ge=en(D);function ee(){J(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),pe=je(D=>{ce()!=="sloppy"||!ue.current||Pt(D,o.select("floatingElement"))||Pt(D,o.select("domReferenceElement"))||(ue.current.dismissOnTouchEnd&&ae(D),H.clear(),ue.current=null)}),Ee=je(D=>{const ge=en(D);function ee(){pe(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)});T.useEffect(()=>{if(!r||!g)return;p.current.__escapeKeyBubbles=ne,p.current.__outsidePressBubbles=W;const D=new pa;function ge(be){o.setOpen(!1,zn(th,be))}function ee(){D.clear(),Oe.current=!0}function it(){D.start(Qp()?5:0,()=>{Oe.current=!1})}const V=Ct(f);V.addEventListener("pointerdown",Xe,!0),N&&(V.addEventListener("keydown",R),V.addEventListener("compositionstart",ee),V.addEventListener("compositionend",it)),Q&&(V.addEventListener("click",X,!0),V.addEventListener("pointerdown",X,!0),V.addEventListener("touchstart",U,!0),V.addEventListener("touchmove",oe,!0),V.addEventListener("touchend",Ee,!0),V.addEventListener("mousedown",X,!0));let de=[];return L&&(Tl(h)&&(de=yi(h)),Tl(f)&&(de=de.concat(yi(f))),!Tl(m)&&m&&m.contextElement&&(de=de.concat(yi(m.contextElement)))),de=de.filter(be=>be!==V.defaultView?.visualViewport),de.forEach(be=>{be.addEventListener("scroll",ge,{passive:!0})}),()=>{V.removeEventListener("pointerdown",Xe,!0),N&&(V.removeEventListener("keydown",R),V.removeEventListener("compositionstart",ee),V.removeEventListener("compositionend",it)),Q&&(V.removeEventListener("click",X,!0),V.removeEventListener("pointerdown",X,!0),V.removeEventListener("touchstart",U,!0),V.removeEventListener("touchmove",oe,!0),V.removeEventListener("touchend",Ee,!0),V.removeEventListener("mousedown",X,!0)),de.forEach(be=>{be.removeEventListener("scroll",ge)}),D.clear(),te.current=!1}},[p,f,m,h,N,Q,r,S,L,g,ne,W,R,ae,X,ve,U,oe,Ee,Xe,o]),T.useEffect(re,[Q,re]);const Je=T.useMemo(()=>({onKeyDown:R,...j&&{[lb[B]]:D=>{o.setOpen(!1,zn(fm,D.nativeEvent))},...B!=="intentional"&&{onClick(D){o.setOpen(!1,zn(fm,D.nativeEvent))}}}}),[R,o,j,B]),Me=je(D=>{const ge=en(D.nativeEvent);!at(o.select("floatingElement"),ge)||D.button!==0||(te.current=!0)}),Yt=je(D=>{!r||!g||D.button!==0||(te.current=!0)}),It=T.useMemo(()=>({onKeyDown:R,onPointerDown:Me,onMouseDown:Me,onMouseUp:Me,onClickCapture:K,onMouseDownCapture(D){K(),Yt(D)},onPointerDownCapture(D){K(),Yt(D)},onMouseUpCapture:K,onTouchEndCapture:K,onTouchMoveCapture:K}),[R,Me,K,Yt]);return T.useMemo(()=>g?{reference:Je,floating:It,trigger:Je}:{},[g,Je,It])}var as=Symbol("NOT_FOUND");function ub(u,s=`expected a function, instead received ${typeof u}`){if(typeof u!="function")throw new TypeError(s)}function sb(u,s=`expected an object, instead received ${typeof u}`){if(typeof u!="object")throw new TypeError(s)}function ob(u,s="expected all items to be functions, instead received the following types: "){if(!u.every(o=>typeof o=="function")){const o=u.map(r=>typeof r=="function"?`function ${r.name||"unnamed"}()`:typeof r).join(", ");throw new TypeError(`${s}[${o}]`)}}var Sm=u=>Array.isArray(u)?u:[u];function rb(u){const s=Array.isArray(u[0])?u[0]:u;return ob(s,"createSelector expects all input-selectors to be functions, but received the following types: "),s}function cb(u,s){const o=[],{length:r}=u;for(let f=0;f<r;f++)o.push(u[f].apply(null,s));return o}function fb(u){let s;return{get(o){return s&&u(s.key,o)?s.value:as},put(o,r){s={key:o,value:r}},getEntries(){return s?[s]:[]},clear(){s=void 0}}}function db(u,s){let o=[];function r(S){const p=o.findIndex(g=>s(S,g.key));if(p>-1){const g=o[p];return p>0&&(o.splice(p,1),o.unshift(g)),g.value}return as}function f(S,p){r(S)===as&&(o.unshift({key:S,value:p}),o.length>u&&o.pop())}function m(){return o}function h(){o=[]}return{get:r,put:f,getEntries:m,clear:h}}var _b=(u,s)=>u===s;function mb(u){return function(o,r){if(o===null||r===null||o.length!==r.length)return!1;const{length:f}=o;for(let m=0;m<f;m++)if(!u(o[m],r[m]))return!1;return!0}}function gb(u,s){const o=typeof s=="object"?s:{equalityCheck:s},{equalityCheck:r=_b,maxSize:f=1,resultEqualityCheck:m}=o,h=mb(r);let S=0;const p=f<=1?fb(h):db(f,h);function g(){let N=p.get(arguments);if(N===as){if(N=u.apply(null,arguments),S++,m){const z=p.getEntries().find(j=>m(j.value,N));z&&(N=z.value,S!==0&&S--)}p.put(arguments,N)}return N}return g.clearCache=()=>{p.clear(),g.resetResultsCount()},g.resultsCount=()=>S,g.resetResultsCount=()=>{S=0},g}var yb=class{constructor(u){this.value=u}deref(){return this.value}},pb=typeof WeakRef<"u"?WeakRef:yb,hb=0,Em=1;function Zu(){return{s:hb,v:void 0,o:null,p:null}}function S0(u,s={}){let o=Zu();const{resultEqualityCheck:r}=s;let f,m=0;function h(){let S=o;const{length:p}=arguments;for(let E=0,z=p;E<z;E++){const j=arguments[E];if(typeof j=="function"||typeof j=="object"&&j!==null){let B=S.o;B===null&&(S.o=B=new WeakMap);const L=B.get(j);L===void 0?(S=Zu(),B.set(j,S)):S=L}else{let B=S.p;B===null&&(S.p=B=new Map);const L=B.get(j);L===void 0?(S=Zu(),B.set(j,S)):S=L}}const g=S;let N;if(S.s===Em)N=S.v;else if(N=u.apply(null,arguments),m++,r){const E=f?.deref?.()??f;E!=null&&r(E,N)&&(N=E,m!==0&&m--),f=typeof N=="object"&&N!==null||typeof N=="function"?new pb(N):N}return g.s=Em,g.v=N,N}return h.clearCache=()=>{o=Zu(),h.resetResultsCount()},h.resultsCount=()=>m,h.resetResultsCount=()=>{m=0},h}function E0(u,...s){const o=typeof u=="function"?{memoize:u,memoizeOptions:s}:u,r=(...f)=>{let m=0,h=0,S,p={},g=f.pop();typeof g=="object"&&(p=g,g=f.pop()),ub(g,`createSelector expects an output function after the inputs, but received: [${typeof g}]`);const N={...o,...p},{memoize:E,memoizeOptions:z=[],argsMemoize:j=S0,argsMemoizeOptions:B=[]}=N,L=Sm(z),I=Sm(B),Z=rb(f),$=E(function(){return m++,g.apply(null,arguments)},...L),G=j(function(){h++;const te=cb(Z,arguments);return S=$.apply(null,te),S},...I);return Object.assign(G,{resultFunc:g,memoizedResultFunc:$,dependencies:Z,dependencyRecomputations:()=>h,resetDependencyRecomputations:()=>{h=0},lastResult:()=>S,recomputations:()=>m,resetRecomputations:()=>{m=0},memoize:E,argsMemoize:j})};return Object.assign(r,{withTypes:()=>r}),r}var bb=E0(S0),vb=Object.assign((u,s=bb)=>{sb(u,`createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof u}`);const o=Object.keys(u),r=o.map(m=>u[m]);return s(r,(...m)=>m.reduce((h,S,p)=>(h[o[p]]=S,h),{}))},{withTypes:()=>vb});E0({memoize:gb,memoizeOptions:{maxSize:1,equalityCheck:Object.is}});const Ue=(u,s,o,r,f,m,...h)=>{if(h.length>0)throw new Error(xi(1));let S;if(u)S=u;else throw new Error("Missing arguments");return S};var kr={exports:{}},Ur={};var Tm;function xb(){if(Tm)return Ur;Tm=1;var u=vi();function s(E,z){return E===z&&(E!==0||1/E===1/z)||E!==E&&z!==z}var o=typeof Object.is=="function"?Object.is:s,r=u.useState,f=u.useEffect,m=u.useLayoutEffect,h=u.useDebugValue;function S(E,z){var j=z(),B=r({inst:{value:j,getSnapshot:z}}),L=B[0].inst,I=B[1];return m(function(){L.value=j,L.getSnapshot=z,p(L)&&I({inst:L})},[E,j,z]),f(function(){return p(L)&&I({inst:L}),E(function(){p(L)&&I({inst:L})})},[E]),h(j),j}function p(E){var z=E.getSnapshot;E=E.value;try{var j=z();return!o(E,j)}catch{return!0}}function g(E,z){return z()}var N=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?g:S;return Ur.useSyncExternalStore=u.useSyncExternalStore!==void 0?u.useSyncExternalStore:N,Ur}var wm;function T0(){return wm||(wm=1,kr.exports=xb()),kr.exports}var Sb=T0(),Yr={exports:{}},Br={};var Om;function Eb(){if(Om)return Br;Om=1;var u=vi(),s=T0();function o(g,N){return g===N&&(g!==0||1/g===1/N)||g!==g&&N!==N}var r=typeof Object.is=="function"?Object.is:o,f=s.useSyncExternalStore,m=u.useRef,h=u.useEffect,S=u.useMemo,p=u.useDebugValue;return Br.useSyncExternalStoreWithSelector=function(g,N,E,z,j){var B=m(null);if(B.current===null){var L={hasValue:!1,value:null};B.current=L}else L=B.current;B=S(function(){function Z(ne){if(!$){if($=!0,G=ne,ne=z(ne),j!==void 0&&L.hasValue){var W=L.value;if(j(W,ne))return Q=W}return Q=ne}if(W=Q,r(G,ne))return W;var ue=z(ne);return j!==void 0&&j(W,ue)?(G=ne,W):(G=ne,Q=ue)}var $=!1,G,Q,te=E===void 0?null:E;return[function(){return Z(N())},te===null?void 0:function(){return Z(te())}]},[N,E,z,j]);var I=f(g,B[0],B[1]);return h(function(){L.hasValue=!0,L.value=I},[I]),p(I),I},Br}var Cm;function Tb(){return Cm||(Cm=1,Yr.exports=Eb()),Yr.exports}var wb=Tb();const Ob=Fr(19),Cb=Ob?Ab:Nb;function zb(u,s,o,r,f){return Cb(u,s,o,r,f)}function Ab(u,s,o,r,f){const m=T.useCallback(()=>s(u.getSnapshot(),o,r,f),[u,s,o,r,f]);return Sb.useSyncExternalStore(u.subscribe,m,m)}function Nb(u,s,o,r,f){return wb.useSyncExternalStoreWithSelector(u.subscribe,u.getSnapshot,u.getSnapshot,m=>s(m,o,r,f))}class hi{constructor(s){this.state=s,this.listeners=new Set,this.updateTick=0}subscribe=s=>(this.listeners.add(s),()=>{this.listeners.delete(s)});getSnapshot=()=>this.state;setState(s){if(this.state===s)return;this.state=s,this.updateTick+=1;const o=this.updateTick;for(const r of this.listeners){if(o!==this.updateTick)return;r(s)}}update(s){for(const o in s)if(!Object.is(this.state[o],s[o])){hi.prototype.setState.call(this,{...this.state,...s});return}}set(s,o){Object.is(this.state[s],o)||hi.prototype.setState.call(this,{...this.state,[s]:o})}notifyAll(){const s={...this.state};hi.prototype.setState.call(this,s)}}class w0 extends hi{constructor(s,o={},r){super(s),this.context=o,this.selectors=r}controlledValues=new Map;useSyncedValue(s,o){T.useDebugValue(s),rt(()=>{this.state[s]!==o&&this.set(s,o)},[s,o])}useSyncedValueWithCleanup(s,o){const r=this;rt(()=>(r.state[s]!==o&&r.set(s,o),()=>{r.set(s,void 0)}),[r,s,o])}useSyncedValues(s){const o=this,r=Object.values(s);rt(()=>{o.update(s)},[o,...r])}useControlledProp(s,o,r){T.useDebugValue(s);const f=this,m=o!==void 0;this.controlledValues.has(s)||(this.controlledValues.set(s,m),!m&&!Object.is(this.state[s],r)&&super.setState({...this.state,[s]:r})),rt(()=>{m&&!Object.is(f.state[s],o)&&super.setState({...f.state,[s]:o})},[f,s,o,r,m])}set(s,o){this.controlledValues.get(s)!==!0&&super.set(s,o)}update(s){const o={...s};for(const r in o)if(Object.hasOwn(o,r)&&this.controlledValues.get(r)===!0){delete o[r];continue}super.update(o)}setState(s){const o={...s};for(const r in o)if(Object.hasOwn(o,r)&&this.controlledValues.get(r)===!0){delete o[r];continue}super.setState({...this.state,...o})}select=(s,o,r,f)=>{const m=this.selectors[s];return m(this.state,o,r,f)};useState=(s,o,r,f)=>{T.useDebugValue(s);const m=this.selectors[s];return zb(this,m,o,r,f)};useContextCallback(s,o){T.useDebugValue(s);const r=je(o??Zm);this.context[s]=r}useStateSetter(s){const o=T.useRef(void 0);return o.current===void 0&&(o.current=r=>{this.set(s,r)}),o.current}observe(s,o){let r;typeof s=="function"?r=s:r=this.selectors[s];let f=r(this.state);return o(f,f,this),this.subscribe(m=>{const h=r(m);if(!Object.is(f,h)){const S=f;f=h,o(h,S,this)}})}}const Rb={open:Ue(u=>u.open),domReferenceElement:Ue(u=>u.domReferenceElement),referenceElement:Ue(u=>u.positionReference??u.referenceElement),floatingElement:Ue(u=>u.floatingElement),floatingId:Ue(u=>u.floatingId)};class O0 extends w0{constructor(s){const{nested:o,noEmit:r,onOpenChange:f,triggerElements:m,...h}=s;super({...h,positionReference:h.referenceElement,domReferenceElement:h.referenceElement},{onOpenChange:f,dataRef:{current:{}},events:Xh(),nested:o,noEmit:r,triggerElements:m},Rb)}setOpen=(s,o)=>{if((!s||!this.state.open||Th(o.event))&&(this.context.dataRef.current.openEvent=s?o.event:void 0),!this.context.noEmit){const r={open:s,reason:o.reason,nativeEvent:o.event,nested:this.context.nested,triggerElement:o.trigger};this.context.events.emit("openchange",r)}this.context.onOpenChange?.(s,o)}}function jb(u,s=!1,o=!1){const[r,f]=T.useState(u&&s?"idle":void 0),[m,h]=T.useState(u);return u&&!m&&(h(!0),f("starting")),!u&&m&&r!=="ending"&&!o&&f("ending"),!u&&!m&&r==="ending"&&f(void 0),rt(()=>{if(!u&&m&&r!=="ending"&&o){const S=un.request(()=>{f("ending")});return()=>{un.cancel(S)}}},[u,m,r,o]),rt(()=>{if(!u||s)return;const S=un.request(()=>{f(void 0)});return()=>{un.cancel(S)}},[s,u]),rt(()=>{if(!u||!s)return;u&&m&&r!=="idle"&&f("starting");const S=un.request(()=>{f("idle")});return()=>{un.cancel(S)}},[s,u,m,f,r]),T.useMemo(()=>({mounted:m,setMounted:h,transitionStatus:r}),[m,r])}function Mb(u,s=!1,o=!0){const r=h0();return je((f,m=null)=>{r.cancel();function h(){Wr.flushSync(f)}const S=On(u);if(S==null)return;const p=S;if(typeof p.getAnimations!="function"||globalThis.BASE_UI_ANIMATIONS_DISABLED)f();else{let E=function(){const j=bi.startingStyle;if(!p.hasAttribute(j)){r.request(z);return}const B=new MutationObserver(()=>{p.hasAttribute(j)||(B.disconnect(),z())});B.observe(p,{attributes:!0,attributeFilter:[j]}),m?.addEventListener("abort",()=>B.disconnect(),{once:!0})},z=function(){Promise.all(p.getAnimations().map(j=>j.finished)).then(()=>{m?.aborted||h()}).catch(()=>{const j=p.getAnimations();if(o){if(m?.aborted)return;h()}else j.length>0&&j.some(B=>B.pending||B.playState!=="finished")&&z()})};var g=E,N=z;if(s){E();return}r.request(z)}})}function C0(u){const{enabled:s=!0,open:o,ref:r,onComplete:f}=u,m=je(f),h=Mb(r,o,!1);T.useEffect(()=>{if(!s)return;const S=new AbortController;return h(m,S.signal),()=>{S.abort()}},[s,o,m,h])}function Db(u){const s=u.useState("open");rt(()=>{if(s&&!u.select("activeTriggerId")&&u.context.triggerElements.size===1){const o=u.context.triggerElements.entries().next();if(!o.done){const[r,f]=o.value;u.update({activeTriggerId:r,activeTriggerElement:f})}}},[s,u])}function kb(u,s,o){const{mounted:r,setMounted:f,transitionStatus:m}=jb(u);s.useSyncedValues({mounted:r,transitionStatus:m});const h=je(()=>{f(!1),s.update({activeTriggerId:null,activeTriggerElement:null,mounted:!1}),o?.(),s.context.onOpenChangeComplete?.(!1)}),S=s.useState("preventUnmountingOnClose");return C0({enabled:!S,open:u,ref:s.context.popupRef,onComplete(){u||h()}}),{forceUnmount:h,transitionStatus:m}}class z0{constructor(){this.elements=new Set,this.idMap=new Map}add(s,o){const r=this.idMap.get(s);r!==o&&(r!==void 0&&this.elements.delete(r),this.elements.add(o),this.idMap.set(s,o))}delete(s){const o=this.idMap.get(s);o&&(this.elements.delete(o),this.idMap.delete(s))}hasElement(s){return this.elements.has(s)}hasMatchingElement(s){for(const o of this.elements)if(s(o))return!0;return!1}getById(s){return this.idMap.get(s)}entries(){return this.idMap.entries()}get size(){return this.idMap.size}}function Ub(){return new O0({open:!1,floatingElement:null,referenceElement:null,triggerElements:new z0,floatingId:"",nested:!1,noEmit:!1,onOpenChange:void 0})}function Yb(){return{open:!1,mounted:!1,transitionStatus:"idle",floatingRootContext:Ub(),preventUnmountingOnClose:!1,payload:void 0,activeTriggerId:null,activeTriggerElement:null,popupElement:null,positionerElement:null,activeTriggerProps:Jt,inactiveTriggerProps:Jt,popupProps:Jt}}const Bb={open:Ue(u=>u.open),mounted:Ue(u=>u.mounted),transitionStatus:Ue(u=>u.transitionStatus),floatingRootContext:Ue(u=>u.floatingRootContext),preventUnmountingOnClose:Ue(u=>u.preventUnmountingOnClose),payload:Ue(u=>u.payload),activeTriggerId:Ue(u=>u.activeTriggerId),activeTriggerElement:Ue(u=>u.mounted?u.activeTriggerElement:null),isTriggerActive:Ue((u,s)=>s!==void 0&&u.activeTriggerId===s),isOpenedByTrigger:Ue((u,s)=>s!==void 0&&u.activeTriggerId===s&&u.open),isMountedByTrigger:Ue((u,s)=>s!==void 0&&u.activeTriggerId===s&&u.mounted),triggerProps:Ue((u,s)=>s?u.activeTriggerProps:u.inactiveTriggerProps),popupProps:Ue(u=>u.popupProps),popupElement:Ue(u=>u.popupElement),positionerElement:Ue(u=>u.positionerElement)};function Lb(u){const{popupStore:s,noEmit:o=!1,treatPopupAsFloatingElement:r=!1,onOpenChange:f}=u,m=ec(),h=g0()!=null,S=s.useState("open"),p=s.useState("activeTriggerElement"),g=s.useState(r?"popupElement":"positionerElement"),N=s.context.triggerElements,E=al(()=>new O0({open:S,referenceElement:p,floatingElement:g,triggerElements:N,onOpenChange:f,floatingId:m,nested:h,noEmit:o})).current;return rt(()=>{const z={open:S,floatingId:m,referenceElement:p,floatingElement:g};Tl(p)&&(z.domReferenceElement=p),E.state.positionReference===E.state.referenceElement&&(z.positionReference=p),E.update(z)},[S,m,p,g,E]),E.context.onOpenChange=f,E.context.nested=h,E.context.noEmit=o,E}function Hb(u=[]){const s=u.map(g=>g?.reference),o=u.map(g=>g?.floating),r=u.map(g=>g?.item),f=u.map(g=>g?.trigger),m=T.useCallback(g=>Ku(g,u,"reference"),s),h=T.useCallback(g=>Ku(g,u,"floating"),o),S=T.useCallback(g=>Ku(g,u,"item"),r),p=T.useCallback(g=>Ku(g,u,"trigger"),f);return T.useMemo(()=>({getReferenceProps:m,getFloatingProps:h,getItemProps:S,getTriggerProps:p}),[m,h,S,p])}function Ku(u,s,o){const r=new Map,f=o==="item",m={};o==="floating"&&(m.tabIndex=-1,m[Zr]="");for(const h in u)f&&u&&(h===l0||h===a0)||(m[h]=u[h]);for(let h=0;h<s.length;h+=1){let S;const p=s[h]?.[o];typeof p=="function"?S=u?p(u):null:S=p,S&&zm(m,S,f,r)}return zm(m,u,f,r),m}function zm(u,s,o,r){for(const f in s){const m=s[f];o&&(f===l0||f===a0)||(f.startsWith("on")?(r.has(f)||r.set(f,[]),typeof m=="function"&&(r.get(f)?.push(m),u[f]=(...h)=>r.get(f)?.map(S=>S(...h)).find(S=>S!==void 0))):u[f]=m)}}const Xb=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function qb(u,s={}){const o="rootStore"in u?u.rootStore:u,r=o.useState("open"),f=o.useState("floatingId"),m=o.useState("domReferenceElement"),h=o.useState("floatingElement"),{enabled:S=!0,role:p="dialog"}=s,g=ec(),N=m?.id||g,E=T.useMemo(()=>Kr(h)?.id||f,[h,f]),z=Xb.get(p)??p,B=g0()!=null,L=T.useMemo(()=>z==="tooltip"||p==="label"?Jt:{"aria-haspopup":z==="alertdialog"?"dialog":z,"aria-expanded":"false",...z==="listbox"&&{role:"combobox"},...z==="menu"&&B&&{role:"menuitem"},...p==="select"&&{"aria-autocomplete":"none"},...p==="combobox"&&{"aria-autocomplete":"list"}},[z,B,p]),I=T.useMemo(()=>z==="tooltip"||p==="label"?{[`aria-${p==="label"?"labelledby":"describedby"}`]:r?E:void 0}:{...L,"aria-expanded":r?"true":"false","aria-controls":r?E:void 0,...z==="menu"&&{id:N}},[z,E,r,N,p,L]),Z=T.useMemo(()=>{const G={id:E,...z&&{role:z}};return z==="tooltip"||p==="label"?G:{...G,...z==="menu"&&{"aria-labelledby":N}}},[z,E,N,p]),$=T.useCallback(({active:G,selected:Q})=>{const te={role:"option",...G&&{id:`${E}-fui-option`}};switch(p){case"select":case"combobox":return{...te,"aria-selected":Q}}return{}},[E,p]);return T.useMemo(()=>S?{reference:I,floating:Z,item:$,trigger:L}:{},[S,I,Z,L,$])}let Qb=(function(u){return u.nestedDialogs="--nested-dialogs",u})({}),Gb=(function(u){return u[u.open=wl.open]="open",u[u.closed=wl.closed]="closed",u[u.startingStyle=wl.startingStyle]="startingStyle",u[u.endingStyle=wl.endingStyle]="endingStyle",u.nested="data-nested",u.nestedDialogOpen="data-nested-dialog-open",u})({});const A0=T.createContext(void 0);function Vb(){const u=T.useContext(A0);if(u===void 0)throw new Error(xi(26));return u}const N0="ArrowUp",R0="ArrowDown",j0="ArrowLeft",M0="ArrowRight",D0="Home",k0="End",Zb=new Set([j0,M0]),Kb=new Set([N0,R0]),Jb=new Set([...Zb,...Kb]);[...Jb];const Ib=new Set([N0,R0,j0,M0,D0,k0]),Wb={...Jm,...Km,nestedDialogOpen(u){return u?{[Gb.nestedDialogOpen]:""}:null}},Fb=T.forwardRef(function(s,o){const{className:r,finalFocus:f,initialFocus:m,render:h,...S}=s,{store:p}=Si(),g=p.useState("descriptionElementId"),N=p.useState("disablePointerDismissal"),E=p.useState("floatingRootContext"),z=p.useState("popupProps"),j=p.useState("modal"),B=p.useState("mounted"),L=p.useState("nested"),I=p.useState("nestedOpenDialogCount"),Z=p.useState("open"),$=p.useState("openMethod"),G=p.useState("titleElementId"),Q=p.useState("transitionStatus"),te=p.useState("role");Vb(),C0({open:Z,ref:p.context.popupRef,onComplete(){Z&&p.context.onOpenChangeComplete?.(!0)}});function ne(re){return re==="touch"?p.context.popupRef.current:!0}const W=m===void 0?ne:m,ue=I>0,H=T.useMemo(()=>({open:Z,nested:L,transitionStatus:Q,nestedDialogOpen:ue}),[Z,L,Q,ue]),le=is("div",s,{state:H,props:[z,{"aria-labelledby":G??void 0,"aria-describedby":g??void 0,role:te,tabIndex:-1,hidden:!B,onKeyDown(re){Ib.has(re.key)&&re.stopPropagation()},style:{[Qb.nestedDialogs]:I}},S],ref:[o,p.context.popupRef,p.useStateSetter("popupElement")],stateAttributesMapping:Wb});return _.jsx(nb,{context:E,openInteractionType:$,disabled:!B,closeOnFocusOut:!N,initialFocus:W,returnFocus:f,modal:j!==!1,restoreFocus:"popup",children:le})});function $b(u){return Fr(19)?u:u?"true":void 0}const Pb=T.forwardRef(function(s,o){const{cutout:r,...f}=s;let m;if(r){const h=r?.getBoundingClientRect();m=`polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${h.left}px ${h.top}px,
      ${h.left}px ${h.bottom}px,
      ${h.right}px ${h.bottom}px,
      ${h.right}px ${h.top}px,
      ${h.left}px ${h.top}px
    )`}return _.jsx("div",{ref:o,role:"presentation","data-base-ui-inert":"",...f,style:{position:"fixed",inset:0,userSelect:"none",WebkitUserSelect:"none",clipPath:m}})}),ev=T.forwardRef(function(s,o){const{keepMounted:r=!1,...f}=s,{store:m}=Si(),h=m.useState("mounted"),S=m.useState("modal"),p=m.useState("open");return h||r?_.jsx(A0.Provider,{value:r,children:_.jsxs(Fh,{ref:o,...f,children:[h&&S===!0&&_.jsx(Pb,{ref:m.context.internalBackdropRef,inert:$b(!p)}),s.children]})}):null});let Am={},Nm={},Rm="";function tv(u){if(typeof document>"u")return!1;const s=Ti(u);return sn(s).innerWidth-s.documentElement.clientWidth>0}function nv(u){if(!(typeof CSS<"u"&&CSS.supports&&CSS.supports("scrollbar-gutter","stable"))||typeof document>"u")return!1;const r=Ti(u).documentElement,f={scrollbarGutter:r.style.scrollbarGutter,overflowY:r.style.overflowY};r.style.scrollbarGutter="stable",r.style.overflowY="scroll";const m=r.offsetWidth;r.style.overflowY="hidden";const h=r.offsetWidth;return Object.assign(r.style,f),m===h}function lv(u){const s=Ti(u),o=s.documentElement,r=s.body,f=os(o)?o:r,m=f.style.overflow;return f.style.overflow="hidden",()=>{f.style.overflow=m}}function av(u){const s=Ti(u),o=s.documentElement,r=s.body,f=sn(o);let m=0,h=0,S=!1;const p=un.create();if(fh&&(f.visualViewport?.scale??1)!==1)return()=>{};function g(){const z=f.getComputedStyle(o),j=f.getComputedStyle(r),I=(z.scrollbarGutter||"").includes("both-edges")?"stable both-edges":"stable";m=o.scrollTop,h=o.scrollLeft,Am={scrollbarGutter:o.style.scrollbarGutter,overflowY:o.style.overflowY,overflowX:o.style.overflowX},Rm=o.style.scrollBehavior,Nm={position:r.style.position,height:r.style.height,width:r.style.width,boxSizing:r.style.boxSizing,overflowY:r.style.overflowY,overflowX:r.style.overflowX,scrollBehavior:r.style.scrollBehavior};const Z=o.scrollHeight>o.clientHeight,$=o.scrollWidth>o.clientWidth,G=z.overflowY==="scroll"||j.overflowY==="scroll",Q=z.overflowX==="scroll"||j.overflowX==="scroll",te=Math.max(0,f.innerWidth-r.clientWidth),ne=Math.max(0,f.innerHeight-r.clientHeight),W=parseFloat(j.marginTop)+parseFloat(j.marginBottom),ue=parseFloat(j.marginLeft)+parseFloat(j.marginRight),H=os(o)?o:r;if(S=nv(u),S){o.style.scrollbarGutter=I,H.style.overflowY="hidden",H.style.overflowX="hidden";return}Object.assign(o.style,{scrollbarGutter:I,overflowY:"hidden",overflowX:"hidden"}),(Z||G)&&(o.style.overflowY="scroll"),($||Q)&&(o.style.overflowX="scroll"),Object.assign(r.style,{position:"relative",height:W||ne?`calc(100dvh - ${W+ne}px)`:"100dvh",width:ue||te?`calc(100vw - ${ue+te}px)`:"100vw",boxSizing:"border-box",overflow:"hidden",scrollBehavior:"unset"}),r.scrollTop=m,r.scrollLeft=h,o.setAttribute("data-base-ui-scroll-locked",""),o.style.scrollBehavior="unset"}function N(){Object.assign(o.style,Am),Object.assign(r.style,Nm),S||(o.scrollTop=m,o.scrollLeft=h,o.removeAttribute("data-base-ui-scroll-locked"),o.style.scrollBehavior=Rm)}function E(){N(),p.request(g)}return g(),f.addEventListener("resize",E),()=>{p.cancel(),N(),typeof f.removeEventListener=="function"&&f.removeEventListener("resize",E)}}class iv{lockCount=0;restore=null;timeoutLock=pa.create();timeoutUnlock=pa.create();acquire(s){return this.lockCount+=1,this.lockCount===1&&this.restore===null&&this.timeoutLock.start(0,()=>this.lock(s)),this.release}release=()=>{this.lockCount-=1,this.lockCount===0&&this.restore&&this.timeoutUnlock.start(0,this.unlock)};unlock=()=>{this.lockCount===0&&this.restore&&(this.restore?.(),this.restore=null)};lock(s){if(this.lockCount===0||this.restore!==null)return;const r=Ti(s).documentElement,f=sn(r).getComputedStyle(r).overflowY;if(f==="hidden"||f==="clip"){this.restore=Zm;return}const m=n0||!tv(s);this.restore=m?lv(s):av(s)}}const uv=new iv;function sv(u=!0,s=null){rt(()=>{if(u)return uv.acquire(s)},[u,s])}function ov(u){const s=T.useRef(""),o=T.useCallback(f=>{f.defaultPrevented||(s.current=f.pointerType,u(f,f.pointerType))},[u]);return{onClick:T.useCallback(f=>{if(f.detail===0){u(f,"keyboard");return}"pointerType"in f&&u(f,f.pointerType),u(f,s.current),s.current=""},[u]),onPointerDown:o}}function rv(u){const[s,o]=T.useState(null),r=je((S,p)=>{u||o(p||(n0?"touch":""))}),f=T.useCallback(()=>{o(null)},[]),{onClick:m,onPointerDown:h}=ov(r);return T.useMemo(()=>({openMethod:s,reset:f,triggerProps:{onClick:m,onPointerDown:h}}),[s,f,m,h])}function cv(u){const{store:s,parentContext:o,actionsRef:r}=u,f=s.useState("open"),m=s.useState("disablePointerDismissal"),h=s.useState("modal"),S=s.useState("popupElement"),{openMethod:p,triggerProps:g,reset:N}=rv(f);Db(s);const{forceUnmount:E}=kb(f,s,()=>{N()}),z=je(le=>{const re=zn(le);return re.preventUnmountOnClose=()=>{s.set("preventUnmountingOnClose",!0)},re}),j=T.useCallback(()=>{s.setOpen(!1,z(ih))},[s,z]);T.useImperativeHandle(r,()=>({unmount:E,close:j}),[E,j]);const B=Lb({popupStore:s,onOpenChange:s.setOpen,treatPopupAsFloatingElement:!0,noEmit:!0}),[L,I]=T.useState(0),Z=L===0,$=qb(B),G=ib(B,{outsidePressEvent(){return s.context.internalBackdropRef.current||s.context.backdropRef.current?"intentional":{mouse:h==="trap-focus"?"sloppy":"intentional",touch:"sloppy"}},outsidePress(le){if("button"in le&&le.button!==0||"touches"in le&&le.touches.length!==1)return!1;const re=en(le);if(Z&&!m){const Oe=re;return h&&(s.context.internalBackdropRef.current||s.context.backdropRef.current)?s.context.internalBackdropRef.current===Oe||s.context.backdropRef.current===Oe||at(Oe,S)&&!Oe?.hasAttribute("data-base-ui-portal"):!0}return!1},escapeKey:Z});sv(f&&h===!0,S);const{getReferenceProps:Q,getFloatingProps:te,getTriggerProps:ne}=Hb([$,G]);s.useContextCallback("onNestedDialogOpen",le=>{I(le+1)}),s.useContextCallback("onNestedDialogClose",()=>{I(0)}),T.useEffect(()=>(o?.onNestedDialogOpen&&f&&o.onNestedDialogOpen(L),o?.onNestedDialogClose&&!f&&o.onNestedDialogClose(),()=>{o?.onNestedDialogClose&&f&&o.onNestedDialogClose()}),[f,o,L]);const W=T.useMemo(()=>Q(g),[Q,g]),ue=T.useMemo(()=>ne(g),[ne,g]),H=T.useMemo(()=>te(),[te]);s.useSyncedValues({openMethod:p,activeTriggerProps:W,inactiveTriggerProps:ue,popupProps:H,floatingRootContext:B,nestedOpenDialogCount:L})}const fv={...Bb,modal:Ue(u=>u.modal),nested:Ue(u=>u.nested),nestedOpenDialogCount:Ue(u=>u.nestedOpenDialogCount),disablePointerDismissal:Ue(u=>u.disablePointerDismissal),openMethod:Ue(u=>u.openMethod),descriptionElementId:Ue(u=>u.descriptionElementId),titleElementId:Ue(u=>u.titleElementId),viewportElement:Ue(u=>u.viewportElement),role:Ue(u=>u.role)};class dv extends w0{constructor(s){super(_v(s),{popupRef:T.createRef(),backdropRef:T.createRef(),internalBackdropRef:T.createRef(),triggerElements:new z0,onOpenChange:void 0,onOpenChangeComplete:void 0},fv)}setOpen=(s,o)=>{if(o.preventUnmountOnClose=()=>{this.set("preventUnmountingOnClose",!0)},!s&&o.trigger==null&&this.state.activeTriggerId!=null&&(o.trigger=this.state.activeTriggerElement??void 0),this.context.onOpenChange?.(s,o),o.isCanceled)return;const r={open:s,nativeEvent:o.event,reason:o.reason,nested:this.state.nested};this.state.floatingRootContext.context.events?.emit("openchange",r);const f={open:s},m=o.trigger?.id??null;(m||s)&&(f.activeTriggerId=m,f.activeTriggerElement=o.trigger??null),this.update(f)}}function _v(u={}){return{...Yb(),modal:!0,disablePointerDismissal:!1,popupElement:null,viewportElement:null,descriptionElementId:void 0,titleElementId:void 0,openMethod:null,nested:!1,nestedOpenDialogCount:0,role:"dialog",...u}}function mv(u){const{children:s,open:o,defaultOpen:r=!1,onOpenChange:f,onOpenChangeComplete:m,disablePointerDismissal:h=!1,modal:S=!0,actionsRef:p,handle:g,triggerId:N,defaultTriggerId:E=null}=u,z=Si(!0),j=!!z,B=al(()=>g?.store??new dv({open:o??r,activeTriggerId:N!==void 0?N:E,modal:S,disablePointerDismissal:h,nested:j})).current;B.useControlledProp("open",o,r),B.useControlledProp("activeTriggerId",N,E),B.useSyncedValues({disablePointerDismissal:h,nested:j,modal:S}),B.useContextCallback("onOpenChange",f),B.useContextCallback("onOpenChangeComplete",m);const L=B.useState("payload");cv({store:B,actionsRef:p,parentContext:z?.store.context});const I=T.useMemo(()=>({store:B}),[B]);return _.jsx(Hm.Provider,{value:I,children:typeof s=="function"?s({payload:L}):s})}function gv(u){return u.toLowerCase().endsWith(".webm")}function jm(u,s){return s===0?0:(u%s+s)%s}function yv({cards:u,open:s,selectedIndex:o,prefersReducedMotion:r,onOpenChange:f,onSelectedIndexChange:m}){const h=T.useRef(null),S=T.useMemo(()=>jm(o,u.length),[u.length,o]),p=u[S],g=T.useCallback(N=>{u.length<=1||m(jm(S+N,u.length))},[u.length,m,S]);return T.useEffect(()=>{if(!s)return;const N=E=>{E.key==="ArrowLeft"?(E.preventDefault(),g(-1)):E.key==="ArrowRight"?(E.preventDefault(),g(1)):E.key==="Escape"&&(E.preventDefault(),f(!1))};return window.addEventListener("keydown",N),()=>window.removeEventListener("keydown",N)},[g,f,s]),p?_.jsx(mv,{open:s,onOpenChange:f,children:_.jsxs(ev,{children:[_.jsx(Hp,{className:"preview-gallery-backdrop"}),_.jsx("div",{className:"preview-gallery-shell",children:_.jsxs(Fb,{className:"preview-gallery-popup","aria-label":`${p.title} gallery preview`,children:[_.jsx(uh,{className:"preview-gallery-close","aria-label":"Close gallery",children:_.jsx("span",{"aria-hidden":"true",children:"x"})}),_.jsx("div",{className:"preview-gallery-media-frame",onTouchStart:N=>{h.current=N.changedTouches[0]?.clientX??null},onTouchEnd:N=>{const E=h.current;if(E==null)return;const j=(N.changedTouches[0]?.clientX??E)-E;Math.abs(j)>=56&&g(j>0?-1:1),h.current=null},children:gv(p.image)?_.jsx("video",{src:p.image,muted:!0,loop:!r,autoPlay:!r,playsInline:!0,preload:r?"none":"metadata",controls:!0,"aria-label":p.title,className:"preview-gallery-media"}):_.jsx("img",{src:p.image,alt:p.title,className:"preview-gallery-media",loading:"eager",decoding:"async"})}),_.jsxs("div",{className:"preview-gallery-meta",children:[_.jsx("p",{children:p.title}),_.jsxs("span",{children:[S+1," / ",u.length]})]}),_.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-prev","aria-label":"Previous preview",onClick:()=>g(-1),disabled:u.length<=1,children:_.jsx("span",{"aria-hidden":"true",children:"<"})}),_.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-next","aria-label":"Next preview",onClick:()=>g(1),disabled:u.length<=1,children:_.jsx("span",{"aria-hidden":"true",children:">"})})]})})]})}):null}const Lr=[{name:"0x / Matcha",logoUrls:["/logos/0x.png","/logos/matcha.svg"],href:"https://matcha.xyz"},{name:"Moody's",logoUrls:["/logos/moodys.png"],href:"https://www.moodys.com"},{name:"Twilio",logoUrls:["/logos/twilio.svg"],href:"https://www.twilio.com"},{name:"Onit",logoUrls:["/logos/onit.png"],href:"https://www.onit.com"},{name:"Chainlink",logoUrls:["/logos/chainlink.svg"],href:"https://chain.link"}];function U0(){return _.jsx("span",{className:"mosaic-company-inline-list","aria-label":"Companies I have worked with",children:Lr.map((u,s)=>_.jsxs("span",{className:"mosaic-company-inline-item",children:[_.jsxs("a",{href:u.href,target:"_blank",rel:"noreferrer",className:"mosaic-company-inline-link","aria-label":`${u.name} website`,title:u.name,children:[_.jsx("span",{className:"mosaic-company-inline-name",children:u.name}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:u.logoUrls.map(o=>_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:o,alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})},`${u.name}-${o}`))})]}),s<Lr.length-2?", ":s===Lr.length-2?", and ":""]},u.name))})}const Mm=["tall","sm","sm","wide","sm","tall","wide","sm","sm","wide","sm","sm"],pv=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",hour12:!0,timeZone:"America/Santo_Domingo",timeZoneName:"short"});function Hr(u){return u.toLowerCase().endsWith(".webm")}function Dm(u){if(u!=="#")return u}function km(u){if(u.id==="preview-shot-20")return!0;const s=u.previewAspectRatio;return s==null?!1:s>1.45||s<.82}function Um(u=new Date){return pv.format(u).replace(/\s([AP]M)\s/,(s,o)=>`${o.toLowerCase()} `)}function hv({label:u,reducedMotion:s}){const[o,r]=T.useState(u),[f,m]=T.useState(null),[h,S]=T.useState(!1),p=T.useRef(null);return T.useEffect(()=>{if(u===o)return;if(s){r(u),m(null),S(!1);return}p.current!==null&&window.clearTimeout(p.current),m(u);const g=window.requestAnimationFrame(()=>{S(!0),p.current=window.setTimeout(()=>{r(u),m(null),S(!1),p.current=null},240)});return()=>{window.cancelAnimationFrame(g),p.current!==null&&(window.clearTimeout(p.current),p.current=null)}},[o,u,s]),_.jsx("span",{className:`mosaic-live-time ${h?"is-animating":""}`,"aria-live":"polite","aria-atomic":"true",children:_.jsxs("span",{className:"mosaic-live-time-track",children:[_.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-current",children:o}),f?_.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-next",children:f}):null]})})}function bv({cards:u,profile:s,links:o,showProjects:r=!0}){const[f,m]=T.useState(!1),[h,S]=T.useState(null),[p,g]=T.useState(()=>Um()),N=T.useMemo(()=>u.filter(H=>H.kind==="preview"),[u]),E=T.useMemo(()=>u.find(H=>H.id==="preview-shot-9")??N.find(H=>(H.previewAspectRatio??1)<1)??N[0],[u,N]),z=T.useMemo(()=>u.find(H=>H.id==="preview-shot-21")??N.find(H=>H.id!==E?.id)??N[1],[u,N,E]),j=T.useMemo(()=>{const H=new Set;E?.id&&H.add(E.id),z?.id&&H.add(z.id);const le=N.filter(re=>!H.has(re.id));return le.length===0?[]:Array.from({length:12},(re,Oe)=>le[Oe%le.length])},[N,E,z]),B=T.useMemo(()=>{const H=[];return j.forEach((le,re)=>{H.push({kind:"preview",card:le,span:le.masonrySpan==="lg"?"wide":Mm[re%Mm.length],previewIndex:re}),re===6&&H.push({kind:"bridge",bridge:"signature",span:"sm",id:"bridge-signature"})}),H},[j]),L=T.useMemo(()=>{for(const H of B)if(H.kind==="preview")return H;return null},[B]),I=T.useMemo(()=>L?B.filter(H=>!(H.kind==="preview"&&H.previewIndex===L.previewIndex)):B,[B,L]),Z=T.useMemo(()=>Dm(o.linkedin),[o.linkedin]),$=T.useMemo(()=>Dm(o.x),[o.x]),G=E?.title??"Vertical project preview",Q=z?.title??"Wide project preview",te=L?km(L.card):!1,ne=`mosaic-shell${r?"":" mosaic-shell-hero-only"}`,W=`mosaic-hero${r?"":" mosaic-hero-hero-only"}`,ue=(H,le,re)=>Hr(H.image)?_.jsx("video",{src:H.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata","aria-label":re,className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`}):_.jsx("img",{src:H.image,alt:re,loading:"lazy",decoding:"async",className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`});return T.useEffect(()=>{if(typeof window>"u"||typeof window.matchMedia!="function")return;const H=window.matchMedia("(prefers-reduced-motion: reduce)"),le=()=>m(H.matches);return le(),typeof H.addEventListener=="function"?(H.addEventListener("change",le),()=>H.removeEventListener("change",le)):(H.addListener(le),()=>H.removeListener(le))},[]),T.useEffect(()=>{let H,le;const re=()=>{g(Um())};return re(),(()=>{const Fe=6e4-Date.now()%6e4;le=window.setTimeout(()=>{re(),H=window.setInterval(re,6e4)},Fe)})(),()=>{le&&window.clearTimeout(le),H&&window.clearInterval(H)}},[]),_.jsxs("section",{className:ne,children:[_.jsxs("h1",{className:"sr-only",children:[s.name," portfolio"]}),_.jsx("header",{id:"about",className:W,children:_.jsxs("div",{className:"mosaic-hero-profile mosaic-hero-profile-animated",children:[_.jsxs("div",{className:"mosaic-profile-head",children:[_.jsx("img",{src:s.photo,alt:`${s.name} portrait`,className:"mosaic-avatar",loading:"eager",decoding:"async"}),_.jsxs("div",{className:"mosaic-profile-meta",children:[_.jsx("h2",{children:s.name}),_.jsx("p",{className:"mosaic-profile-subtitle",children:s.title}),_.jsxs("p",{className:"mosaic-profile-location",children:["Punta Cana · Local time: ",_.jsx(hv,{label:p,reducedMotion:f})]})]})]}),_.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"Born in Santo Domingo, I went to college in Washington, DC and am now in the process of moving to NYC."}),_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["In college, I co-founded"," ",_.jsx("a",{href:"https://www.youtube.com/watch?v=IAHmu0lhcIs&t=1s",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Turtle"}),", a tool for college students to meet other students, designed a tool for teachers to find trainers at"," ",_.jsxs("a",{href:"https://www.google.com",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link mosaic-profile-link-with-logo",children:[_.jsx("span",{className:"mosaic-company-inline-name",children:"Google"}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:"/logos/Google_logo.svg",alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})})})]}),", helped design"," ",_.jsxs("a",{href:"https://patrol.so",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link mosaic-profile-link-with-logo",children:[_.jsx("span",{className:"mosaic-company-inline-name",children:"Patrol"}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:"/logos/patrol.svg",alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})})})]}),"/",_.jsxs("a",{href:"https://protector.so",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link mosaic-profile-link-with-logo",children:[_.jsx("span",{className:"mosaic-company-inline-name",children:"Protector"}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:"/logos/protector.svg",alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})})})]}),", redesigned developer tools with"," ",_.jsxs("a",{href:"https://www.twilio.com",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link mosaic-profile-link-with-logo",children:[_.jsx("span",{className:"mosaic-company-inline-name",children:"Twilio"}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:"/logos/twilio.svg",alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})})})]}),", built financial tools with"," ",_.jsx("a",{href:"https://www.moodys.com",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Moody's"}),", and helped push the web3 industry forward at"," ",_.jsxs("a",{href:"https://matcha.xyz",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link mosaic-profile-link-with-logo",children:[_.jsx("span",{className:"mosaic-company-inline-name",children:"Matcha.xyz"}),_.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:_.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:_.jsx("img",{src:"/logos/matcha.svg",alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})})})]}),"."]}),_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["I've also been fortunate to work with teams at ",_.jsx(U0,{}),"."]}),_.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"I've worked in product design since 2015 and now freelance on focused, high-impact projects."}),_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",_.jsx("a",{href:$??o.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",_.jsx("a",{href:`mailto:${o.email}`,className:"mosaic-profile-link",children:o.email})]})]})}),r?_.jsxs(_.Fragment,{children:[_.jsxs("div",{className:"mosaic-board",children:[_.jsx("article",{id:"featured",className:"mosaic-tile mosaic-feature-card",children:_.jsxs("div",{className:"mosaic-note-card",children:[_.jsx("p",{className:"mosaic-note-date",children:"Nov 23"}),_.jsx("h2",{children:"LLMs for house plants?"}),_.jsx("p",{children:"It's been five incredibly turbulent days at the leading AI tech company, with the exit and then return of CEO..."}),Z?_.jsx("a",{href:Z,target:"_blank",rel:"noreferrer",className:"mosaic-note-link",children:"Read more"}):null]})}),_.jsxs("article",{className:"mosaic-tile mosaic-empty-card","aria-label":"Open space panel",children:[_.jsx("span",{className:"mosaic-doodle mosaic-doodle-top",children:"o_o"}),_.jsx("span",{className:"mosaic-doodle mosaic-doodle-bottom",children:"\\\\^_^/"})]}),_.jsx("article",{className:"mosaic-tile mosaic-phone-card","aria-label":G,children:_.jsx("div",{className:"mosaic-phone-shell",children:E?Hr(E.image)?_.jsx("video",{src:E.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":G,className:"mosaic-phone-media"}):_.jsx("img",{src:E.image,alt:G,loading:"lazy",decoding:"async",className:"mosaic-phone-media"}):_.jsx("div",{className:"mosaic-media-fallback",children:"Preview coming soon"})})}),_.jsx("article",{className:"mosaic-tile mosaic-note-panel",children:_.jsxs("div",{className:"mosaic-micro-card",children:[_.jsx("h2",{children:"Blogging about plants"}),_.jsx("p",{children:"I find joy and inspiration in my ever-growing collection of plants. They make my space feel like home."})]})}),_.jsx("article",{className:"mosaic-tile mosaic-dashboard-card","aria-label":Q,children:_.jsx("div",{className:"mosaic-wide-shell",children:z?Hr(z.image)?_.jsx("video",{src:z.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":Q,className:"mosaic-wide-media"}):_.jsx("img",{src:z.image,alt:Q,loading:"lazy",decoding:"async",className:"mosaic-wide-media"}):_.jsx("div",{className:"mosaic-media-fallback",children:"Project preview"})})}),_.jsxs("article",{id:"work",className:"mosaic-work",children:[_.jsx("h2",{className:"sr-only",children:"Selected work"}),L?_.jsx("section",{className:"mosaic-work-featured","aria-label":"Featured work preview",children:_.jsxs("button",{type:"button",className:"mosaic-work-card mosaic-work-card-featured",onClick:()=>S(L.previewIndex),"aria-label":`Open ${L.card.title} preview ${L.previewIndex+1} of ${j.length}`,children:[_.jsx("span",{className:`mosaic-work-media-shell ${te?"mosaic-work-media-shell-inset":""}`,children:ue(L.card,te,L.card.title)}),_.jsx("span",{className:"mosaic-work-overlay mosaic-work-overlay-featured",children:_.jsx("strong",{children:L.card.title})})]})}):null,_.jsx("ul",{className:"mosaic-work-grid","aria-label":"Selected work previews",children:I.map(H=>{const le=`mosaic-work-item mosaic-work-item-${H.span}`;if(H.kind==="bridge")return _.jsx("li",{className:le,children:_.jsxs("div",{className:"mosaic-work-bridge mosaic-work-bridge-signature","aria-hidden":"false",children:[_.jsxs("div",{className:"mosaic-work-signature-stack","aria-hidden":"true",children:[_.jsx("span",{}),_.jsx("span",{}),_.jsx("span",{})]}),_.jsxs("p",{children:[s.name," - Software Designer and Engineer"]})]})},H.id);const re=km(H.card);return _.jsx("li",{className:le,children:_.jsxs("button",{type:"button",className:"mosaic-work-card",onClick:()=>S(H.previewIndex),"aria-label":`Open ${H.card.title} preview ${H.previewIndex+1} of ${j.length}`,children:[_.jsx("span",{className:`mosaic-work-media-shell ${re?"mosaic-work-media-shell-inset":""}`,children:ue(H.card,re,H.card.title)}),_.jsx("span",{className:"mosaic-work-overlay",children:_.jsx("strong",{children:H.card.title})})]})},`${H.card.id}-${H.previewIndex}`)})})]})]}),_.jsx(yv,{cards:j,open:h!=null&&h<j.length,selectedIndex:h??0,prefersReducedMotion:f,onOpenChange:H=>{H||S(null)},onSelectedIndexChange:S})]}):null]})}function vv({email:u,contactHref:s,telegramHref:o,xHref:r}){const[f,m]=T.useState(!1),h=async()=>{try{await navigator.clipboard.writeText(u),m(!0),window.setTimeout(()=>m(!1),1800)}catch{window.location.href=s}};return _.jsxs(_.Fragment,{children:[_.jsxs("div",{className:"mosaic-profile-actions","aria-label":"Profile contact actions",children:[_.jsx("button",{type:"button",className:"mosaic-contact-pill mosaic-contact-pill-default",onClick:h,children:_.jsx("span",{className:"mosaic-contact-pill-default-label",children:f?"Copied!":"Copy email"})}),_.jsx("a",{href:o,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-telegram",children:_.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-telegram",children:[_.jsx("img",{src:"/icons/telegram.png",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-telegram"}),_.jsx("span",{className:"mosaic-contact-pill-telegram-label",children:"Message"})]})}),r?_.jsx("a",{href:r,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-dark",children:_.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[_.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),_.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})}):_.jsx("span",{className:"mosaic-contact-pill mosaic-contact-pill-dark",role:"text",children:_.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[_.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),_.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})})]}),_.jsx("span",{className:"sr-only",role:"status","aria-live":"polite","aria-atomic":"true",children:f?"Email copied to clipboard":""})]})}const xv=[{label:"Body",variable:"--body-color"},{label:"Body BG",variable:"--body-bg"},{label:"Primary",variable:"--primary"},{label:"Secondary",variable:"--secondary"},{label:"Accent",variable:"--accent"},{label:"Surface",variable:"--surface-2"}],Sv=[{label:"Snappy",value:"220ms / cubic-bezier(0.175, 0.885, 0.32, 1.1)"},{label:"Swift",value:"800ms / cubic-bezier(0.175, 0.885, 0.32, 1.275)"},{label:"Smooth",value:"300ms / cubic-bezier(0.19, 1, 0.22, 1)"}];function Ev({links:u,name:s}){return _.jsxs("main",{id:"main-content",tabIndex:-1,className:"styleguide-page",children:[_.jsxs("header",{className:"styleguide-hero",children:[_.jsxs("div",{className:"styleguide-hero-topline",children:[_.jsx("a",{href:"/",className:"styleguide-home-link",children:"Back to portfolio"}),_.jsx("span",{className:"styleguide-badge",children:"System inventory"})]}),_.jsxs("div",{className:"styleguide-hero-copy",children:[_.jsx("p",{className:"styleguide-eyebrow",children:"Rafael Medina UI system"}),_.jsx("h1",{children:"Styleguide"}),_.jsxs("p",{className:"styleguide-lede",children:["A living page for the real components, link treatments, text styles, surfaces, and motion tokens currently shaping"," ",s,"'s portfolio."]})]})]}),_.jsxs("div",{className:"styleguide-main",children:[_.jsxs("section",{className:"styleguide-section",children:[_.jsxs("div",{className:"styleguide-section-heading",children:[_.jsx("p",{children:"Buttons"}),_.jsx("h2",{children:"Contact action row"})]}),_.jsx("div",{className:"styleguide-specimen styleguide-specimen-wide",children:_.jsx(vv,{email:u.email,contactHref:`mailto:${u.email}`,telegramHref:"https://t.me/rafaelmedian",xHref:u.x})}),_.jsxs("div",{className:"styleguide-notes-grid",children:[_.jsxs("article",{className:"styleguide-note-card",children:[_.jsx("span",{children:"Primary"}),_.jsx("strong",{children:"Copy email"}),_.jsx("p",{children:"Utility-first action with the strongest contrast in the row."})]}),_.jsxs("article",{className:"styleguide-note-card",children:[_.jsx("span",{children:"Secondary"}),_.jsx("strong",{children:"Message"}),_.jsx("p",{children:"Friendlier blue accent that stays related to the main button family."})]}),_.jsxs("article",{className:"styleguide-note-card",children:[_.jsx("span",{children:"Tertiary"}),_.jsx("strong",{children:"Follow"}),_.jsx("p",{children:"Darker social action that stays present without overpowering the row."})]})]})]}),_.jsxs("section",{className:"styleguide-section",children:[_.jsxs("div",{className:"styleguide-section-heading",children:[_.jsx("p",{children:"Links"}),_.jsx("h2",{children:"Editorial inline treatments"})]}),_.jsxs("div",{className:"styleguide-copy-sample",children:[_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["Born in the US I helped build"," ",_.jsx("a",{href:"https://matcha.xyz",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Matcha.xyz"})," ","end-to-end, from product design to interaction design."]}),_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["I've been fortunate to work with teams at ",_.jsx(U0,{}),"."]}),_.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",_.jsx("a",{href:u.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",_.jsx("a",{href:`mailto:${u.email}`,className:"mosaic-profile-link",children:u.email}),"."]})]})]}),_.jsxs("section",{className:"styleguide-section styleguide-grid-two",children:[_.jsxs("div",{className:"styleguide-column",children:[_.jsxs("div",{className:"styleguide-section-heading",children:[_.jsx("p",{children:"Typography"}),_.jsx("h2",{children:"Core text rhythm"})]}),_.jsxs("div",{className:"styleguide-type-stack",children:[_.jsxs("article",{className:"styleguide-type-card",children:[_.jsx("span",{children:"Hero title"}),_.jsx("h3",{children:"Rafael Medina"}),_.jsx("p",{children:"16px / 170% / -0.005em"})]}),_.jsxs("article",{className:"styleguide-type-card",children:[_.jsx("span",{children:"Body base"}),_.jsx("h4",{children:"I'm a designer who ships products, now AI-enabled."}),_.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]}),_.jsxs("article",{className:"styleguide-type-card",children:[_.jsx("span",{children:"Meta"}),_.jsx("div",{className:"styleguide-meta-line",children:"Punta Cana · Local time: 5:03pm AST"}),_.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]})]})]}),_.jsxs("div",{className:"styleguide-column",children:[_.jsxs("div",{className:"styleguide-section-heading",children:[_.jsx("p",{children:"Tokens"}),_.jsx("h2",{children:"Color and motion references"})]}),_.jsx("div",{className:"styleguide-swatch-grid",children:xv.map(o=>_.jsxs("article",{className:"styleguide-swatch-card",children:[_.jsx("div",{className:"styleguide-swatch",style:{background:`var(${o.variable})`}}),_.jsx("strong",{children:o.label}),_.jsx("span",{children:o.variable})]},o.variable))}),_.jsx("div",{className:"styleguide-motion-list",children:Sv.map(o=>_.jsxs("article",{className:"styleguide-motion-card",children:[_.jsx("strong",{children:o.label}),_.jsx("span",{children:o.value})]},o.label))})]})]}),_.jsxs("section",{className:"styleguide-section",children:[_.jsxs("div",{className:"styleguide-section-heading",children:[_.jsx("p",{children:"Surfaces"}),_.jsx("h2",{children:"Panels and atmosphere"})]}),_.jsxs("div",{className:"styleguide-surface-grid",children:[_.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-overlay",children:[_.jsx("span",{children:"Overlay"}),_.jsx("strong",{children:"Blurred system surface"}),_.jsx("p",{children:"Uses the shared overlay blur, background, and layered shadow tokens."})]}),_.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-tile",children:[_.jsx("span",{children:"Tile"}),_.jsx("strong",{children:"Project canvas"}),_.jsx("p",{children:"The softer neutral panel used by the portfolio grid."})]}),_.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-accent",children:[_.jsx("span",{children:"Accent"}),_.jsx("strong",{children:"Highlight wash"}),_.jsx("p",{children:"A low-contrast accent surface for emphasis, notes, or future badges."})]})]})]})]})]})}const Tv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='56'%20y='70'%20width='220'%20height='220'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='72'%20width='192'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='320'%20y='104'%20width='144'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='156'%20width='192'%20height='116'%20rx='22'%20fill='%23E7E5E4'/%3e%3cpath%20d='M142%20120H214'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20150H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20180H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",wv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='72'%20y='84'%20width='196'%20height='196'%20rx='26'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='92'%20width='188'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='300'%20y='124'%20width='140'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='176'%20width='188'%20height='96'%20rx='18'%20fill='%23E7E5E4'/%3e%3ccircle%20cx='170'%20cy='182'%20r='46'%20fill='%23D6D3D1'/%3e%3cpath%20d='M148%20182H192'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3c/svg%3e",Ov="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='60'%20y='64'%20width='440'%20height='96'%20rx='24'%20fill='%23E7E5E4'/%3e%3crect%20x='60'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='290'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='92'%20y='96'%20width='160'%20height='12'%20rx='6'%20fill='%23D6D3D1'/%3e%3crect%20x='92'%20y='118'%20width='120'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3cpath%20d='M328%20248H460'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",Cv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='80'%20y='68'%20width='400'%20height='224'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='120'%20y='110'%20width='160'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='134'%20width='220'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3crect%20x='120'%20y='200'%20width='140'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='224'%20width='200'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3ccircle%20cx='392'%20cy='196'%20r='32'%20fill='%23D6D3D1'/%3e%3cpath%20d='M372%20196H412'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",zv="/assets/profile-photo-bUVT8ljA.png",Ym={name:"Rafael Medina",title:"Product Designer, Freelance",intro:"Hey I'm Rafael, a product designer and maker based in Miami. For over 10 years, I've helped teams design products that balance clarity, visual craft, and practical outcomes.",previouslyLabel:"Previously",previouslyText:"Product designer for SaaS teams and startup builders.",nowLabel:"Now",nowText:"Freelancing, experimenting with AI workflows, and building design systems.",availability:"Available for work",contactLabel:"Get in touch",contactHref:"mailto:hey@rafaelmedina.me",photo:zv},ma={dribbble:"https://dribbble.com/rafaelmedina",x:"https://x.com/rafaelmedian",github:"https://github.com/rafaelmedina",linkedin:"https://www.linkedin.com/in/rafaelmedina",email:"hey@rafaelmedina.me"},Av=[{id:"preview-shot-21",kind:"preview",category:"Preview",title:"Shot Preview 21",summary:"",detail:"",image:"/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:4/3},{id:"preview-shot-9",kind:"preview",category:"Preview",title:"Shot Preview 9",summary:"",detail:"",image:"/Projects/shot-small-9.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.74},{id:"preview-shot-16",kind:"preview",category:"Preview",title:"Shot Preview 16",summary:"",detail:"",image:"/Projects/shot-small-16.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:1.85},{id:"preview-shot-1",kind:"preview",category:"Preview",title:"Shot Preview 1",summary:"",detail:"",image:"/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-14",kind:"preview",category:"Preview",title:"Shot Preview 14",summary:"",detail:"",image:"/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-15",kind:"preview",category:"Preview",title:"Shot Preview 15",summary:"",detail:"",image:"/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-19",kind:"preview",category:"Preview",title:"Shot Preview 19",summary:"",detail:"",image:"/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-20",kind:"preview",category:"Preview",title:"Shot Preview 20",summary:"",detail:"",image:"/Projects/shot-small-20.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-22",kind:"preview",category:"Preview",title:"Shot Preview 22",summary:"",detail:"",image:"/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-23",kind:"preview",category:"Preview",title:"Shot Preview 23",summary:"",detail:"",image:"/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"widget-music",kind:"info",category:"Widget",title:"Music Player",summary:"A focused listening mix for design sessions.",detail:"Ambient and electronic tracks for deep work and prototyping.",image:"",ctaLabel:"Spotify Embed",ctaHref:"https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator",ctaExternal:!0},{id:"widget-map",kind:"info",category:"Widget",title:"Map",summary:"Current location and nearby context.",detail:"Map snapshot centered on Miami, FL.",image:"",ctaLabel:"Open in Maps",ctaHref:"https://maps.google.com/?q=Miami,FL",ctaExternal:!0},{id:"info-cv",kind:"info",category:"CV",title:"Curriculum Vitae",summary:"Experience, projects, and selected work history.",detail:"A concise overview of product design roles, outcomes, and capabilities.",image:Tv,ctaLabel:"Open LinkedIn",ctaHref:ma.linkedin,ctaExternal:!0},{id:"info-about",kind:"info",category:"About",title:"About",summary:"Product designer focused on clarity, systems, and practical craft.",detail:"I design dependable experiences with clean hierarchy and thoughtful interaction.",image:Ov,ctaLabel:"About Profile",ctaHref:ma.linkedin,ctaExternal:!0},{id:"info-notes",kind:"info",category:"Notes",title:"Design Notes",summary:"Short notes on process, interaction ideas, and UI experiments.",detail:"A running collection of observations, rationale, and implementation details.",image:wv,ctaLabel:"View GitHub",ctaHref:ma.github,ctaExternal:!0},{id:"info-social",kind:"info",category:"Social",title:"Basic Social Links",summary:"Email, GitHub, and LinkedIn for quick contact.",detail:"Reach out by email or connect via GitHub and LinkedIn.",image:Cv,ctaLabel:"Open LinkedIn",ctaHref:ma.linkedin,ctaExternal:!0}];function Nv(u){return!u||u==="/"?"/":u.replace(/\/+$/,"")}function Rv(){const s=(typeof window>"u"?"/":Nv(window.location.pathname))==="/styleguide";return _.jsxs("div",{"data-theme":"light",className:"relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]",children:[_.jsx("a",{href:"#main-content",className:"skip-link",children:"Skip to content"}),s?_.jsx(Ev,{links:ma,name:Ym.name}):_.jsx("main",{id:"main-content",tabIndex:-1,className:"relative z-dock",children:_.jsx(bv,{cards:Av,profile:Ym,links:ma,showProjects:!1})}),null]})}fp.createRoot(document.getElementById("root")).render(_.jsx(T.StrictMode,{children:_.jsx(Rv,{})}));
