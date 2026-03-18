function lp(i,o){for(var s=0;s<o.length;s++){const r=o[s];if(typeof r!="string"&&!Array.isArray(r)){for(const f in r)if(f!=="default"&&!(f in i)){const _=Object.getOwnPropertyDescriptor(r,f);_&&Object.defineProperty(i,f,_.get?_:{enumerable:!0,get:()=>r[f]})}}}return Object.freeze(Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}))}(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))r(f);new MutationObserver(f=>{for(const _ of f)if(_.type==="childList")for(const p of _.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&r(p)}).observe(document,{childList:!0,subtree:!0});function s(f){const _={};return f.integrity&&(_.integrity=f.integrity),f.referrerPolicy&&(_.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?_.credentials="include":f.crossOrigin==="anonymous"?_.credentials="omit":_.credentials="same-origin",_}function r(f){if(f.ep)return;f.ep=!0;const _=s(f);fetch(f.href,_)}})();function ap(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Tr={exports:{}},_i={};var em;function ip(){if(em)return _i;em=1;var i=Symbol.for("react.transitional.element"),o=Symbol.for("react.fragment");function s(r,f,_){var p=null;if(_!==void 0&&(p=""+_),f.key!==void 0&&(p=""+f.key),"key"in f){_={};for(var x in f)x!=="key"&&(_[x]=f[x])}else _=f;return f=_.ref,{$$typeof:i,type:r,key:p,ref:f!==void 0?f:null,props:_}}return _i.Fragment=o,_i.jsx=s,_i.jsxs=s,_i}var tm;function up(){return tm||(tm=1,Tr.exports=ip()),Tr.exports}var g=up(),wr={exports:{}},me={};var nm;function op(){if(nm)return me;nm=1;var i=Symbol.for("react.transitional.element"),o=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),_=Symbol.for("react.consumer"),p=Symbol.for("react.context"),x=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),R=Symbol.for("react.lazy"),E=Symbol.for("react.activity"),z=Symbol.iterator;function j(b){return b===null||typeof b!="object"?null:(b=z&&b[z]||b["@@iterator"],typeof b=="function"?b:null)}var B={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},L=Object.assign,I={};function Z(b,k,X){this.props=b,this.context=k,this.refs=I,this.updater=X||B}Z.prototype.isReactComponent={},Z.prototype.setState=function(b,k){if(typeof b!="object"&&typeof b!="function"&&b!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,b,k,"setState")},Z.prototype.forceUpdate=function(b){this.updater.enqueueForceUpdate(this,b,"forceUpdate")};function $(){}$.prototype=Z.prototype;function G(b,k,X){this.props=b,this.context=k,this.refs=I,this.updater=X||B}var Q=G.prototype=new $;Q.constructor=G,L(Q,Z.prototype),Q.isPureReactComponent=!0;var te=Array.isArray;function ne(){}var F={H:null,A:null,T:null,S:null},ue=Object.prototype.hasOwnProperty;function H(b,k,X){var J=X.ref;return{$$typeof:i,type:b,key:k,ref:J!==void 0?J:null,props:X}}function le(b,k){return H(b.type,k,b.props)}function re(b){return typeof b=="object"&&b!==null&&b.$$typeof===i}function Ce(b){var k={"=":"=0",":":"=2"};return"$"+b.replace(/[=:]/g,function(X){return k[X]})}var We=/\/+/g;function Xe(b,k){return typeof b=="object"&&b!==null&&b.key!=null?Ce(""+b.key):k.toString(36)}function ce(b){switch(b.status){case"fulfilled":return b.value;case"rejected":throw b.reason;default:switch(typeof b.status=="string"?b.then(ne,ne):(b.status="pending",b.then(function(k){b.status==="pending"&&(b.status="fulfilled",b.value=k)},function(k){b.status==="pending"&&(b.status="rejected",b.reason=k)})),b.status){case"fulfilled":return b.value;case"rejected":throw b.reason}}throw b}function N(b,k,X,J,se){var pe=typeof b;(pe==="undefined"||pe==="boolean")&&(b=null);var Ee=!1;if(b===null)Ee=!0;else switch(pe){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(b.$$typeof){case i:case o:Ee=!0;break;case R:return Ee=b._init,N(Ee(b._payload),k,X,J,se)}}if(Ee)return se=se(b),Ee=J===""?"."+Xe(b,0):J,te(se)?(X="",Ee!=null&&(X=Ee.replace(We,"$&/")+"/"),N(se,k,X,"",function(Yt){return Yt})):se!=null&&(re(se)&&(se=le(se,X+(se.key==null||b&&b.key===se.key?"":(""+se.key).replace(We,"$&/")+"/")+Ee)),k.push(se)),1;Ee=0;var Je=J===""?".":J+":";if(te(b))for(var Me=0;Me<b.length;Me++)J=b[Me],pe=Je+Xe(J,Me),Ee+=N(J,k,X,pe,se);else if(Me=j(b),typeof Me=="function")for(b=Me.call(b),Me=0;!(J=b.next()).done;)J=J.value,pe=Je+Xe(J,Me++),Ee+=N(J,k,X,pe,se);else if(pe==="object"){if(typeof b.then=="function")return N(ce(b),k,X,J,se);throw k=String(b),Error("Objects are not valid as a React child (found: "+(k==="[object Object]"?"object with keys {"+Object.keys(b).join(", ")+"}":k)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function q(b,k,X){if(b==null)return b;var J=[],se=0;return N(b,J,"","",function(pe){return k.call(X,pe,se++)}),J}function K(b){if(b._status===-1){var k=b._result;k=k(),k.then(function(X){(b._status===0||b._status===-1)&&(b._status=1,b._result=X)},function(X){(b._status===0||b._status===-1)&&(b._status=2,b._result=X)}),b._status===-1&&(b._status=0,b._result=k)}if(b._status===1)return b._result.default;throw b._result}var ae=typeof reportError=="function"?reportError:function(b){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var k=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof b=="object"&&b!==null&&typeof b.message=="string"?String(b.message):String(b),error:b});if(!window.dispatchEvent(k))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",b);return}console.error(b)},ve={map:q,forEach:function(b,k,X){q(b,function(){k.apply(this,arguments)},X)},count:function(b){var k=0;return q(b,function(){k++}),k},toArray:function(b){return q(b,function(k){return k})||[]},only:function(b){if(!re(b))throw Error("React.Children.only expected to receive a single React element child.");return b}};return me.Activity=E,me.Children=ve,me.Component=Z,me.Fragment=s,me.Profiler=f,me.PureComponent=G,me.StrictMode=r,me.Suspense=h,me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,me.__COMPILER_RUNTIME={__proto__:null,c:function(b){return F.H.useMemoCache(b)}},me.cache=function(b){return function(){return b.apply(null,arguments)}},me.cacheSignal=function(){return null},me.cloneElement=function(b,k,X){if(b==null)throw Error("The argument must be a React element, but you passed "+b+".");var J=L({},b.props),se=b.key;if(k!=null)for(pe in k.key!==void 0&&(se=""+k.key),k)!ue.call(k,pe)||pe==="key"||pe==="__self"||pe==="__source"||pe==="ref"&&k.ref===void 0||(J[pe]=k[pe]);var pe=arguments.length-2;if(pe===1)J.children=X;else if(1<pe){for(var Ee=Array(pe),Je=0;Je<pe;Je++)Ee[Je]=arguments[Je+2];J.children=Ee}return H(b.type,se,J)},me.createContext=function(b){return b={$$typeof:p,_currentValue:b,_currentValue2:b,_threadCount:0,Provider:null,Consumer:null},b.Provider=b,b.Consumer={$$typeof:_,_context:b},b},me.createElement=function(b,k,X){var J,se={},pe=null;if(k!=null)for(J in k.key!==void 0&&(pe=""+k.key),k)ue.call(k,J)&&J!=="key"&&J!=="__self"&&J!=="__source"&&(se[J]=k[J]);var Ee=arguments.length-2;if(Ee===1)se.children=X;else if(1<Ee){for(var Je=Array(Ee),Me=0;Me<Ee;Me++)Je[Me]=arguments[Me+2];se.children=Je}if(b&&b.defaultProps)for(J in Ee=b.defaultProps,Ee)se[J]===void 0&&(se[J]=Ee[J]);return H(b,pe,se)},me.createRef=function(){return{current:null}},me.forwardRef=function(b){return{$$typeof:x,render:b}},me.isValidElement=re,me.lazy=function(b){return{$$typeof:R,_payload:{_status:-1,_result:b},_init:K}},me.memo=function(b,k){return{$$typeof:m,type:b,compare:k===void 0?null:k}},me.startTransition=function(b){var k=F.T,X={};F.T=X;try{var J=b(),se=F.S;se!==null&&se(X,J),typeof J=="object"&&J!==null&&typeof J.then=="function"&&J.then(ne,ae)}catch(pe){ae(pe)}finally{k!==null&&X.types!==null&&(k.types=X.types),F.T=k}},me.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},me.use=function(b){return F.H.use(b)},me.useActionState=function(b,k,X){return F.H.useActionState(b,k,X)},me.useCallback=function(b,k){return F.H.useCallback(b,k)},me.useContext=function(b){return F.H.useContext(b)},me.useDebugValue=function(){},me.useDeferredValue=function(b,k){return F.H.useDeferredValue(b,k)},me.useEffect=function(b,k){return F.H.useEffect(b,k)},me.useEffectEvent=function(b){return F.H.useEffectEvent(b)},me.useId=function(){return F.H.useId()},me.useImperativeHandle=function(b,k,X){return F.H.useImperativeHandle(b,k,X)},me.useInsertionEffect=function(b,k){return F.H.useInsertionEffect(b,k)},me.useLayoutEffect=function(b,k){return F.H.useLayoutEffect(b,k)},me.useMemo=function(b,k){return F.H.useMemo(b,k)},me.useOptimistic=function(b,k){return F.H.useOptimistic(b,k)},me.useReducer=function(b,k,X){return F.H.useReducer(b,k,X)},me.useRef=function(b){return F.H.useRef(b)},me.useState=function(b){return F.H.useState(b)},me.useSyncExternalStore=function(b,k,X){return F.H.useSyncExternalStore(b,k,X)},me.useTransition=function(){return F.H.useTransition()},me.version="19.2.4",me}var lm;function xi(){return lm||(lm=1,wr.exports=op()),wr.exports}var T=xi();const sp=ap(T),Xm=lp({__proto__:null,default:sp},[T]);var Cr={exports:{}},mi={},Or={exports:{}},zr={};var am;function rp(){return am||(am=1,(function(i){function o(N,q){var K=N.length;N.push(q);e:for(;0<K;){var ae=K-1>>>1,ve=N[ae];if(0<f(ve,q))N[ae]=q,N[K]=ve,K=ae;else break e}}function s(N){return N.length===0?null:N[0]}function r(N){if(N.length===0)return null;var q=N[0],K=N.pop();if(K!==q){N[0]=K;e:for(var ae=0,ve=N.length,b=ve>>>1;ae<b;){var k=2*(ae+1)-1,X=N[k],J=k+1,se=N[J];if(0>f(X,K))J<ve&&0>f(se,X)?(N[ae]=se,N[J]=K,ae=J):(N[ae]=X,N[k]=K,ae=k);else if(J<ve&&0>f(se,K))N[ae]=se,N[J]=K,ae=J;else break e}}return q}function f(N,q){var K=N.sortIndex-q.sortIndex;return K!==0?K:N.id-q.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var _=performance;i.unstable_now=function(){return _.now()}}else{var p=Date,x=p.now();i.unstable_now=function(){return p.now()-x}}var h=[],m=[],R=1,E=null,z=3,j=!1,B=!1,L=!1,I=!1,Z=typeof setTimeout=="function"?setTimeout:null,$=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;function Q(N){for(var q=s(m);q!==null;){if(q.callback===null)r(m);else if(q.startTime<=N)r(m),q.sortIndex=q.expirationTime,o(h,q);else break;q=s(m)}}function te(N){if(L=!1,Q(N),!B)if(s(h)!==null)B=!0,ne||(ne=!0,Ce());else{var q=s(m);q!==null&&ce(te,q.startTime-N)}}var ne=!1,F=-1,ue=5,H=-1;function le(){return I?!0:!(i.unstable_now()-H<ue)}function re(){if(I=!1,ne){var N=i.unstable_now();H=N;var q=!0;try{e:{B=!1,L&&(L=!1,$(F),F=-1),j=!0;var K=z;try{t:{for(Q(N),E=s(h);E!==null&&!(E.expirationTime>N&&le());){var ae=E.callback;if(typeof ae=="function"){E.callback=null,z=E.priorityLevel;var ve=ae(E.expirationTime<=N);if(N=i.unstable_now(),typeof ve=="function"){E.callback=ve,Q(N),q=!0;break t}E===s(h)&&r(h),Q(N)}else r(h);E=s(h)}if(E!==null)q=!0;else{var b=s(m);b!==null&&ce(te,b.startTime-N),q=!1}}break e}finally{E=null,z=K,j=!1}q=void 0}}finally{q?Ce():ne=!1}}}var Ce;if(typeof G=="function")Ce=function(){G(re)};else if(typeof MessageChannel<"u"){var We=new MessageChannel,Xe=We.port2;We.port1.onmessage=re,Ce=function(){Xe.postMessage(null)}}else Ce=function(){Z(re,0)};function ce(N,q){F=Z(function(){N(i.unstable_now())},q)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(N){N.callback=null},i.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):ue=0<N?Math.floor(1e3/N):5},i.unstable_getCurrentPriorityLevel=function(){return z},i.unstable_next=function(N){switch(z){case 1:case 2:case 3:var q=3;break;default:q=z}var K=z;z=q;try{return N()}finally{z=K}},i.unstable_requestPaint=function(){I=!0},i.unstable_runWithPriority=function(N,q){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var K=z;z=N;try{return q()}finally{z=K}},i.unstable_scheduleCallback=function(N,q,K){var ae=i.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ae+K:ae):K=ae,N){case 1:var ve=-1;break;case 2:ve=250;break;case 5:ve=1073741823;break;case 4:ve=1e4;break;default:ve=5e3}return ve=K+ve,N={id:R++,callback:q,priorityLevel:N,startTime:K,expirationTime:ve,sortIndex:-1},K>ae?(N.sortIndex=K,o(m,N),s(h)===null&&N===s(m)&&(L?($(F),F=-1):L=!0,ce(te,K-ae))):(N.sortIndex=ve,o(h,N),B||j||(B=!0,ne||(ne=!0,Ce()))),N},i.unstable_shouldYield=le,i.unstable_wrapCallback=function(N){var q=z;return function(){var K=z;z=q;try{return N.apply(this,arguments)}finally{z=K}}}})(zr)),zr}var im;function cp(){return im||(im=1,Or.exports=rp()),Or.exports}var Ar={exports:{}},yt={};var um;function fp(){if(um)return yt;um=1;var i=xi();function o(h){var m="https://react.dev/errors/"+h;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var R=2;R<arguments.length;R++)m+="&args[]="+encodeURIComponent(arguments[R])}return"Minified React error #"+h+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(){}var r={d:{f:s,r:function(){throw Error(o(522))},D:s,C:s,L:s,m:s,X:s,S:s,M:s},p:0,findDOMNode:null},f=Symbol.for("react.portal");function _(h,m,R){var E=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:E==null?null:""+E,children:h,containerInfo:m,implementation:R}}var p=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function x(h,m){if(h==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,yt.createPortal=function(h,m){var R=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(o(299));return _(h,m,null,R)},yt.flushSync=function(h){var m=p.T,R=r.p;try{if(p.T=null,r.p=2,h)return h()}finally{p.T=m,r.p=R,r.d.f()}},yt.preconnect=function(h,m){typeof h=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(h,m))},yt.prefetchDNS=function(h){typeof h=="string"&&r.d.D(h)},yt.preinit=function(h,m){if(typeof h=="string"&&m&&typeof m.as=="string"){var R=m.as,E=x(R,m.crossOrigin),z=typeof m.integrity=="string"?m.integrity:void 0,j=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;R==="style"?r.d.S(h,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:E,integrity:z,fetchPriority:j}):R==="script"&&r.d.X(h,{crossOrigin:E,integrity:z,fetchPriority:j,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},yt.preinitModule=function(h,m){if(typeof h=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var R=x(m.as,m.crossOrigin);r.d.M(h,{crossOrigin:R,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0})}}else m==null&&r.d.M(h)},yt.preload=function(h,m){if(typeof h=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var R=m.as,E=x(R,m.crossOrigin);r.d.L(h,R,{crossOrigin:E,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},yt.preloadModule=function(h,m){if(typeof h=="string")if(m){var R=x(m.as,m.crossOrigin);r.d.m(h,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:R,integrity:typeof m.integrity=="string"?m.integrity:void 0})}else r.d.m(h)},yt.requestFormReset=function(h){r.d.r(h)},yt.unstable_batchedUpdates=function(h,m){return h(m)},yt.useFormState=function(h,m,R){return p.H.useFormState(h,m,R)},yt.useFormStatus=function(){return p.H.useHostTransitionStatus()},yt.version="19.2.4",yt}var om;function qm(){if(om)return Ar.exports;om=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(o){console.error(o)}}return i(),Ar.exports=fp(),Ar.exports}var sm;function dp(){if(sm)return mi;sm=1;var i=cp(),o=xi(),s=qm();function r(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function _(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function p(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function x(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function h(e){if(_(e)!==e)throw Error(r(188))}function m(e){var t=e.alternate;if(!t){if(t=_(e),t===null)throw Error(r(188));return t!==e?null:e}for(var n=e,l=t;;){var a=n.return;if(a===null)break;var u=a.alternate;if(u===null){if(l=a.return,l!==null){n=l;continue}break}if(a.child===u.child){for(u=a.child;u;){if(u===n)return h(a),e;if(u===l)return h(a),t;u=u.sibling}throw Error(r(188))}if(n.return!==l.return)n=a,l=u;else{for(var c=!1,d=a.child;d;){if(d===n){c=!0,n=a,l=u;break}if(d===l){c=!0,l=a,n=u;break}d=d.sibling}if(!c){for(d=u.child;d;){if(d===n){c=!0,n=u,l=a;break}if(d===l){c=!0,l=u,n=a;break}d=d.sibling}if(!c)throw Error(r(189))}}if(n.alternate!==l)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function R(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=R(e),t!==null)return t;e=e.sibling}return null}var E=Object.assign,z=Symbol.for("react.element"),j=Symbol.for("react.transitional.element"),B=Symbol.for("react.portal"),L=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),Z=Symbol.for("react.profiler"),$=Symbol.for("react.consumer"),G=Symbol.for("react.context"),Q=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),ne=Symbol.for("react.suspense_list"),F=Symbol.for("react.memo"),ue=Symbol.for("react.lazy"),H=Symbol.for("react.activity"),le=Symbol.for("react.memo_cache_sentinel"),re=Symbol.iterator;function Ce(e){return e===null||typeof e!="object"?null:(e=re&&e[re]||e["@@iterator"],typeof e=="function"?e:null)}var We=Symbol.for("react.client.reference");function Xe(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===We?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case L:return"Fragment";case Z:return"Profiler";case I:return"StrictMode";case te:return"Suspense";case ne:return"SuspenseList";case H:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case B:return"Portal";case G:return e.displayName||"Context";case $:return(e._context.displayName||"Context")+".Consumer";case Q:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case F:return t=e.displayName||null,t!==null?t:Xe(e.type)||"Memo";case ue:t=e._payload,e=e._init;try{return Xe(e(t))}catch{}}return null}var ce=Array.isArray,N=o.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},ae=[],ve=-1;function b(e){return{current:e}}function k(e){0>ve||(e.current=ae[ve],ae[ve]=null,ve--)}function X(e,t){ve++,ae[ve]=e.current,e.current=t}var J=b(null),se=b(null),pe=b(null),Ee=b(null);function Je(e,t){switch(X(pe,t),X(se,e),X(J,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?E_(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=E_(t),e=T_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}k(J),X(J,e)}function Me(){k(J),k(se),k(pe)}function Yt(e){e.memoizedState!==null&&X(Ee,e);var t=J.current,n=T_(t,e.type);t!==n&&(X(se,e),X(J,n))}function It(e){se.current===e&&(k(J),k(se)),Ee.current===e&&(k(Ee),ri._currentValue=K)}var D,ge;function ee(e){if(D===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);D=t&&t[1]||"",ge=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+D+e+ge}var it=!1;function V(e,t){if(!e||it)return"";it=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var Y=function(){throw Error()};if(Object.defineProperty(Y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Y,[])}catch(A){var O=A}Reflect.construct(e,[],Y)}else{try{Y.call()}catch(A){O=A}e.call(Y.prototype)}}else{try{throw Error()}catch(A){O=A}(Y=e())&&typeof Y.catch=="function"&&Y.catch(function(){})}}catch(A){if(A&&O&&typeof A.stack=="string")return[A.stack,O.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var u=l.DetermineComponentFrameRoot(),c=u[0],d=u[1];if(c&&d){var y=c.split(`
`),C=d.split(`
`);for(a=l=0;l<y.length&&!y[l].includes("DetermineComponentFrameRoot");)l++;for(;a<C.length&&!C[a].includes("DetermineComponentFrameRoot");)a++;if(l===y.length||a===C.length)for(l=y.length-1,a=C.length-1;1<=l&&0<=a&&y[l]!==C[a];)a--;for(;1<=l&&0<=a;l--,a--)if(y[l]!==C[a]){if(l!==1||a!==1)do if(l--,a--,0>a||y[l]!==C[a]){var M=`
`+y[l].replace(" at new "," at ");return e.displayName&&M.includes("<anonymous>")&&(M=M.replace("<anonymous>",e.displayName)),M}while(1<=l&&0<=a);break}}}finally{it=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?ee(n):""}function de(e,t){switch(e.tag){case 26:case 27:case 5:return ee(e.type);case 16:return ee("Lazy");case 13:return e.child!==t&&t!==null?ee("Suspense Fallback"):ee("Suspense");case 19:return ee("SuspenseList");case 0:case 15:return V(e.type,!1);case 11:return V(e.type.render,!1);case 1:return V(e.type,!0);case 31:return ee("Activity");default:return""}}function be(e){try{var t="",n=null;do t+=de(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var ze=Object.prototype.hasOwnProperty,Ge=i.unstable_scheduleCallback,_e=i.unstable_cancelCallback,fe=i.unstable_shouldYield,pt=i.unstable_requestPaint,Ye=i.unstable_now,An=i.unstable_getCurrentPriorityLevel,il=i.unstable_ImmediatePriority,Cl=i.unstable_UserBlockingPriority,Rn=i.unstable_NormalPriority,bt=i.unstable_LowPriority,Nn=i.unstable_IdlePriority,Ol=i.log,H0=i.unstable_setDisableYieldValue,xa=null,zt=null;function jn(e){if(typeof Ol=="function"&&H0(e),zt&&typeof zt.setStrictMode=="function")try{zt.setStrictMode(xa,e)}catch{}}var At=Math.clz32?Math.clz32:Q0,X0=Math.log,q0=Math.LN2;function Q0(e){return e>>>=0,e===0?32:31-(X0(e)/q0|0)|0}var Ci=256,Oi=262144,zi=4194304;function ul(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ai(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var a=0,u=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var d=l&134217727;return d!==0?(l=d&~u,l!==0?a=ul(l):(c&=d,c!==0?a=ul(c):n||(n=d&~e,n!==0&&(a=ul(n))))):(d=l&~u,d!==0?a=ul(d):c!==0?a=ul(c):n||(n=l&~e,n!==0&&(a=ul(n)))),a===0?0:t!==0&&t!==a&&(t&u)===0&&(u=a&-a,n=t&-t,u>=n||u===32&&(n&4194048)!==0)?t:a}function Sa(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function G0(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function lc(){var e=zi;return zi<<=1,(zi&62914560)===0&&(zi=4194304),e}function fo(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function Ea(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function V0(e,t,n,l,a,u){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var d=e.entanglements,y=e.expirationTimes,C=e.hiddenUpdates;for(n=c&~n;0<n;){var M=31-At(n),Y=1<<M;d[M]=0,y[M]=-1;var O=C[M];if(O!==null)for(C[M]=null,M=0;M<O.length;M++){var A=O[M];A!==null&&(A.lane&=-536870913)}n&=~Y}l!==0&&ac(e,l,0),u!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=u&~(c&~t))}function ac(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-At(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function ic(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-At(n),a=1<<l;a&t|e[l]&t&&(e[l]|=t),n&=~a}}function uc(e,t){var n=t&-t;return n=(n&42)!==0?1:_o(n),(n&(e.suspendedLanes|t))!==0?0:n}function _o(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function mo(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function oc(){var e=q.p;return e!==0?e:(e=window.event,e===void 0?32:K_(e.type))}function sc(e,t){var n=q.p;try{return q.p=e,t()}finally{q.p=n}}var Mn=Math.random().toString(36).slice(2),ct="__reactFiber$"+Mn,vt="__reactProps$"+Mn,zl="__reactContainer$"+Mn,go="__reactEvents$"+Mn,Z0="__reactListeners$"+Mn,K0="__reactHandles$"+Mn,rc="__reactResources$"+Mn,Ta="__reactMarker$"+Mn;function yo(e){delete e[ct],delete e[vt],delete e[go],delete e[Z0],delete e[K0]}function Al(e){var t=e[ct];if(t)return t;for(var n=e.parentNode;n;){if(t=n[zl]||n[ct]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=N_(e);e!==null;){if(n=e[ct])return n;e=N_(e)}return t}e=n,n=e.parentNode}return null}function Rl(e){if(e=e[ct]||e[zl]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function wa(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(r(33))}function Nl(e){var t=e[rc];return t||(t=e[rc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function ot(e){e[Ta]=!0}var cc=new Set,fc={};function ol(e,t){jl(e,t),jl(e+"Capture",t)}function jl(e,t){for(fc[e]=t,e=0;e<t.length;e++)cc.add(t[e])}var J0=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),dc={},_c={};function I0(e){return ze.call(_c,e)?!0:ze.call(dc,e)?!1:J0.test(e)?_c[e]=!0:(dc[e]=!0,!1)}function Ri(e,t,n){if(I0(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function Ni(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function sn(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Bt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function mc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function F0(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,u=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,u.call(this,c)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function po(e){if(!e._valueTracker){var t=mc(e)?"checked":"value";e._valueTracker=F0(e,t,""+e[t])}}function gc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=mc(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function ji(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var W0=/[\n"\\]/g;function Lt(e){return e.replace(W0,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function ho(e,t,n,l,a,u,c,d){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Bt(t)):e.value!==""+Bt(t)&&(e.value=""+Bt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?bo(e,c,Bt(t)):n!=null?bo(e,c,Bt(n)):l!=null&&e.removeAttribute("value"),a==null&&u!=null&&(e.defaultChecked=!!u),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.name=""+Bt(d):e.removeAttribute("name")}function yc(e,t,n,l,a,u,c,d){if(u!=null&&typeof u!="function"&&typeof u!="symbol"&&typeof u!="boolean"&&(e.type=u),t!=null||n!=null){if(!(u!=="submit"&&u!=="reset"||t!=null)){po(e);return}n=n!=null?""+Bt(n):"",t=t!=null?""+Bt(t):n,d||t===e.value||(e.value=t),e.defaultValue=t}l=l??a,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=d?e.checked:!!l,e.defaultChecked=!!l,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),po(e)}function bo(e,t,n){t==="number"&&ji(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Ml(e,t,n,l){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Bt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,l&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function pc(e,t,n){if(t!=null&&(t=""+Bt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Bt(n):""}function hc(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(r(92));if(ce(l)){if(1<l.length)throw Error(r(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Bt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),po(e)}function Dl(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var $0=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function bc(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||$0.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function vc(e,t,n){if(t!=null&&typeof t!="object")throw Error(r(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var a in t)l=t[a],t.hasOwnProperty(a)&&n[a]!==l&&bc(e,a,l)}else for(var u in t)t.hasOwnProperty(u)&&bc(e,u,t[u])}function vo(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var P0=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),eg=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Mi(e){return eg.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function rn(){}var xo=null;function So(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var Ul=null,kl=null;function xc(e){var t=Rl(e);if(t&&(e=t.stateNode)){var n=e[vt]||null;e:switch(e=t.stateNode,t.type){case"input":if(ho(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Lt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var a=l[vt]||null;if(!a)throw Error(r(90));ho(l,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&gc(l)}break e;case"textarea":pc(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Ml(e,!!n.multiple,t,!1)}}}var Eo=!1;function Sc(e,t,n){if(Eo)return e(t,n);Eo=!0;try{var l=e(t);return l}finally{if(Eo=!1,(Ul!==null||kl!==null)&&(vu(),Ul&&(t=Ul,e=kl,kl=Ul=null,xc(t),e)))for(t=0;t<e.length;t++)xc(e[t])}}function Ca(e,t){var n=e.stateNode;if(n===null)return null;var l=n[vt]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(r(231,t,typeof n));return n}var cn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),To=!1;if(cn)try{var Oa={};Object.defineProperty(Oa,"passive",{get:function(){To=!0}}),window.addEventListener("test",Oa,Oa),window.removeEventListener("test",Oa,Oa)}catch{To=!1}var Dn=null,wo=null,Di=null;function Ec(){if(Di)return Di;var e,t=wo,n=t.length,l,a="value"in Dn?Dn.value:Dn.textContent,u=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(l=1;l<=c&&t[n-l]===a[u-l];l++);return Di=a.slice(e,1<l?1-l:void 0)}function Ui(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function ki(){return!0}function Tc(){return!1}function xt(e){function t(n,l,a,u,c){this._reactName=n,this._targetInst=a,this.type=l,this.nativeEvent=u,this.target=c,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(n=e[d],this[d]=n?n(u):u[d]);return this.isDefaultPrevented=(u.defaultPrevented!=null?u.defaultPrevented:u.returnValue===!1)?ki:Tc,this.isPropagationStopped=Tc,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ki)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ki)},persist:function(){},isPersistent:ki}),t}var sl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Yi=xt(sl),za=E({},sl,{view:0,detail:0}),tg=xt(za),Co,Oo,Aa,Bi=E({},za,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Ao,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Aa&&(Aa&&e.type==="mousemove"?(Co=e.screenX-Aa.screenX,Oo=e.screenY-Aa.screenY):Oo=Co=0,Aa=e),Co)},movementY:function(e){return"movementY"in e?e.movementY:Oo}}),wc=xt(Bi),ng=E({},Bi,{dataTransfer:0}),lg=xt(ng),ag=E({},za,{relatedTarget:0}),zo=xt(ag),ig=E({},sl,{animationName:0,elapsedTime:0,pseudoElement:0}),ug=xt(ig),og=E({},sl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),sg=xt(og),rg=E({},sl,{data:0}),Cc=xt(rg),cg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},fg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},dg={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function _g(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=dg[e])?!!t[e]:!1}function Ao(){return _g}var mg=E({},za,{key:function(e){if(e.key){var t=cg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ui(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?fg[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Ao,charCode:function(e){return e.type==="keypress"?Ui(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ui(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),gg=xt(mg),yg=E({},Bi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Oc=xt(yg),pg=E({},za,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Ao}),hg=xt(pg),bg=E({},sl,{propertyName:0,elapsedTime:0,pseudoElement:0}),vg=xt(bg),xg=E({},Bi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Sg=xt(xg),Eg=E({},sl,{newState:0,oldState:0}),Tg=xt(Eg),wg=[9,13,27,32],Ro=cn&&"CompositionEvent"in window,Ra=null;cn&&"documentMode"in document&&(Ra=document.documentMode);var Cg=cn&&"TextEvent"in window&&!Ra,zc=cn&&(!Ro||Ra&&8<Ra&&11>=Ra),Ac=" ",Rc=!1;function Nc(e,t){switch(e){case"keyup":return wg.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function jc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yl=!1;function Og(e,t){switch(e){case"compositionend":return jc(t);case"keypress":return t.which!==32?null:(Rc=!0,Ac);case"textInput":return e=t.data,e===Ac&&Rc?null:e;default:return null}}function zg(e,t){if(Yl)return e==="compositionend"||!Ro&&Nc(e,t)?(e=Ec(),Di=wo=Dn=null,Yl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return zc&&t.locale!=="ko"?null:t.data;default:return null}}var Ag={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Mc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Ag[e.type]:t==="textarea"}function Dc(e,t,n,l){Ul?kl?kl.push(l):kl=[l]:Ul=l,t=Ou(t,"onChange"),0<t.length&&(n=new Yi("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var Na=null,ja=null;function Rg(e){p_(e,0)}function Li(e){var t=wa(e);if(gc(t))return e}function Uc(e,t){if(e==="change")return t}var kc=!1;if(cn){var No;if(cn){var jo="oninput"in document;if(!jo){var Yc=document.createElement("div");Yc.setAttribute("oninput","return;"),jo=typeof Yc.oninput=="function"}No=jo}else No=!1;kc=No&&(!document.documentMode||9<document.documentMode)}function Bc(){Na&&(Na.detachEvent("onpropertychange",Lc),ja=Na=null)}function Lc(e){if(e.propertyName==="value"&&Li(ja)){var t=[];Dc(t,ja,e,So(e)),Sc(Rg,t)}}function Ng(e,t,n){e==="focusin"?(Bc(),Na=t,ja=n,Na.attachEvent("onpropertychange",Lc)):e==="focusout"&&Bc()}function jg(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Li(ja)}function Mg(e,t){if(e==="click")return Li(t)}function Dg(e,t){if(e==="input"||e==="change")return Li(t)}function Ug(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:Ug;function Ma(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var a=n[l];if(!ze.call(t,a)||!Rt(e[a],t[a]))return!1}return!0}function Hc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Xc(e,t){var n=Hc(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Hc(n)}}function qc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?qc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Qc(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=ji(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=ji(e.document)}return t}function Mo(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var kg=cn&&"documentMode"in document&&11>=document.documentMode,Bl=null,Do=null,Da=null,Uo=!1;function Gc(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Uo||Bl==null||Bl!==ji(l)||(l=Bl,"selectionStart"in l&&Mo(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),Da&&Ma(Da,l)||(Da=l,l=Ou(Do,"onSelect"),0<l.length&&(t=new Yi("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=Bl)))}function rl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Ll={animationend:rl("Animation","AnimationEnd"),animationiteration:rl("Animation","AnimationIteration"),animationstart:rl("Animation","AnimationStart"),transitionrun:rl("Transition","TransitionRun"),transitionstart:rl("Transition","TransitionStart"),transitioncancel:rl("Transition","TransitionCancel"),transitionend:rl("Transition","TransitionEnd")},ko={},Vc={};cn&&(Vc=document.createElement("div").style,"AnimationEvent"in window||(delete Ll.animationend.animation,delete Ll.animationiteration.animation,delete Ll.animationstart.animation),"TransitionEvent"in window||delete Ll.transitionend.transition);function cl(e){if(ko[e])return ko[e];if(!Ll[e])return e;var t=Ll[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Vc)return ko[e]=t[n];return e}var Zc=cl("animationend"),Kc=cl("animationiteration"),Jc=cl("animationstart"),Yg=cl("transitionrun"),Bg=cl("transitionstart"),Lg=cl("transitioncancel"),Ic=cl("transitionend"),Fc=new Map,Yo="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Yo.push("scrollEnd");function Ft(e,t){Fc.set(e,t),ol(t,[e])}var Hi=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ht=[],Hl=0,Bo=0;function Xi(){for(var e=Hl,t=Bo=Hl=0;t<e;){var n=Ht[t];Ht[t++]=null;var l=Ht[t];Ht[t++]=null;var a=Ht[t];Ht[t++]=null;var u=Ht[t];if(Ht[t++]=null,l!==null&&a!==null){var c=l.pending;c===null?a.next=a:(a.next=c.next,c.next=a),l.pending=a}u!==0&&Wc(n,a,u)}}function qi(e,t,n,l){Ht[Hl++]=e,Ht[Hl++]=t,Ht[Hl++]=n,Ht[Hl++]=l,Bo|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Lo(e,t,n,l){return qi(e,t,n,l),Qi(e)}function fl(e,t){return qi(e,null,null,t),Qi(e)}function Wc(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var a=!1,u=e.return;u!==null;)u.childLanes|=n,l=u.alternate,l!==null&&(l.childLanes|=n),u.tag===22&&(e=u.stateNode,e===null||e._visibility&1||(a=!0)),e=u,u=u.return;return e.tag===3?(u=e.stateNode,a&&t!==null&&(a=31-At(n),e=u.hiddenUpdates,l=e[a],l===null?e[a]=[t]:l.push(t),t.lane=n|536870912),u):null}function Qi(e){if(50<ni)throw ni=0,Js=null,Error(r(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Xl={};function Hg(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Nt(e,t,n,l){return new Hg(e,t,n,l)}function Ho(e){return e=e.prototype,!(!e||!e.isReactComponent)}function fn(e,t){var n=e.alternate;return n===null?(n=Nt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function $c(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Gi(e,t,n,l,a,u){var c=0;if(l=e,typeof e=="function")Ho(e)&&(c=1);else if(typeof e=="string")c=Vy(e,n,J.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case H:return e=Nt(31,n,t,a),e.elementType=H,e.lanes=u,e;case L:return dl(n.children,a,u,t);case I:c=8,a|=24;break;case Z:return e=Nt(12,n,t,a|2),e.elementType=Z,e.lanes=u,e;case te:return e=Nt(13,n,t,a),e.elementType=te,e.lanes=u,e;case ne:return e=Nt(19,n,t,a),e.elementType=ne,e.lanes=u,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case G:c=10;break e;case $:c=9;break e;case Q:c=11;break e;case F:c=14;break e;case ue:c=16,l=null;break e}c=29,n=Error(r(130,e===null?"null":typeof e,"")),l=null}return t=Nt(c,n,t,a),t.elementType=e,t.type=l,t.lanes=u,t}function dl(e,t,n,l){return e=Nt(7,e,l,t),e.lanes=n,e}function Xo(e,t,n){return e=Nt(6,e,null,t),e.lanes=n,e}function Pc(e){var t=Nt(18,null,null,0);return t.stateNode=e,t}function qo(e,t,n){return t=Nt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var ef=new WeakMap;function Xt(e,t){if(typeof e=="object"&&e!==null){var n=ef.get(e);return n!==void 0?n:(t={value:e,source:t,stack:be(t)},ef.set(e,t),t)}return{value:e,source:t,stack:be(t)}}var ql=[],Ql=0,Vi=null,Ua=0,qt=[],Qt=0,Un=null,tn=1,nn="";function dn(e,t){ql[Ql++]=Ua,ql[Ql++]=Vi,Vi=e,Ua=t}function tf(e,t,n){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=Un,Un=e;var l=tn;e=nn;var a=32-At(l)-1;l&=~(1<<a),n+=1;var u=32-At(t)+a;if(30<u){var c=a-a%5;u=(l&(1<<c)-1).toString(32),l>>=c,a-=c,tn=1<<32-At(t)+a|n<<a|l,nn=u+e}else tn=1<<u|n<<a|l,nn=e}function Qo(e){e.return!==null&&(dn(e,1),tf(e,1,0))}function Go(e){for(;e===Vi;)Vi=ql[--Ql],ql[Ql]=null,Ua=ql[--Ql],ql[Ql]=null;for(;e===Un;)Un=qt[--Qt],qt[Qt]=null,nn=qt[--Qt],qt[Qt]=null,tn=qt[--Qt],qt[Qt]=null}function nf(e,t){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=Un,tn=t.id,nn=t.overflow,Un=e}var ft=null,Ve=null,Oe=!1,kn=null,Gt=!1,Vo=Error(r(519));function Yn(e){var t=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw ka(Xt(t,e)),Vo}function lf(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[ct]=e,t[vt]=l,n){case"dialog":Se("cancel",t),Se("close",t);break;case"iframe":case"object":case"embed":Se("load",t);break;case"video":case"audio":for(n=0;n<ai.length;n++)Se(ai[n],t);break;case"source":Se("error",t);break;case"img":case"image":case"link":Se("error",t),Se("load",t);break;case"details":Se("toggle",t);break;case"input":Se("invalid",t),yc(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":Se("invalid",t);break;case"textarea":Se("invalid",t),hc(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||x_(t.textContent,n)?(l.popover!=null&&(Se("beforetoggle",t),Se("toggle",t)),l.onScroll!=null&&Se("scroll",t),l.onScrollEnd!=null&&Se("scrollend",t),l.onClick!=null&&(t.onclick=rn),t=!0):t=!1,t||Yn(e,!0)}function af(e){for(ft=e.return;ft;)switch(ft.tag){case 5:case 31:case 13:Gt=!1;return;case 27:case 3:Gt=!0;return;default:ft=ft.return}}function Gl(e){if(e!==ft)return!1;if(!Oe)return af(e),Oe=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||rr(e.type,e.memoizedProps)),n=!n),n&&Ve&&Yn(e),af(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=R_(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=R_(e)}else t===27?(t=Ve,Wn(e.type)?(e=mr,mr=null,Ve=e):Ve=t):Ve=ft?Zt(e.stateNode.nextSibling):null;return!0}function _l(){Ve=ft=null,Oe=!1}function Zo(){var e=kn;return e!==null&&(wt===null?wt=e:wt.push.apply(wt,e),kn=null),e}function ka(e){kn===null?kn=[e]:kn.push(e)}var Ko=b(null),ml=null,_n=null;function Bn(e,t,n){X(Ko,t._currentValue),t._currentValue=n}function mn(e){e._currentValue=Ko.current,k(Ko)}function Jo(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function Io(e,t,n,l){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var u=a.dependencies;if(u!==null){var c=a.child;u=u.firstContext;e:for(;u!==null;){var d=u;u=a;for(var y=0;y<t.length;y++)if(d.context===t[y]){u.lanes|=n,d=u.alternate,d!==null&&(d.lanes|=n),Jo(u.return,n,e),l||(c=null);break e}u=d.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(r(341));c.lanes|=n,u=c.alternate,u!==null&&(u.lanes|=n),Jo(c,n,e),c=null}else c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Vl(e,t,n,l){e=null;for(var a=t,u=!1;a!==null;){if(!u){if((a.flags&524288)!==0)u=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(r(387));if(c=c.memoizedProps,c!==null){var d=a.type;Rt(a.pendingProps.value,c.value)||(e!==null?e.push(d):e=[d])}}else if(a===Ee.current){if(c=a.alternate,c===null)throw Error(r(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(ri):e=[ri])}a=a.return}e!==null&&Io(t,e,n,l),t.flags|=262144}function Zi(e){for(e=e.firstContext;e!==null;){if(!Rt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function gl(e){ml=e,_n=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function dt(e){return uf(ml,e)}function Ki(e,t){return ml===null&&gl(e),uf(e,t)}function uf(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},_n===null){if(e===null)throw Error(r(308));_n=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else _n=_n.next=t;return n}var Xg=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},qg=i.unstable_scheduleCallback,Qg=i.unstable_NormalPriority,et={$$typeof:G,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function Fo(){return{controller:new Xg,data:new Map,refCount:0}}function Ya(e){e.refCount--,e.refCount===0&&qg(Qg,function(){e.controller.abort()})}var Ba=null,Wo=0,Zl=0,Kl=null;function Gg(e,t){if(Ba===null){var n=Ba=[];Wo=0,Zl=er(),Kl={status:"pending",value:void 0,then:function(l){n.push(l)}}}return Wo++,t.then(of,of),t}function of(){if(--Wo===0&&Ba!==null){Kl!==null&&(Kl.status="fulfilled");var e=Ba;Ba=null,Zl=0,Kl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function Vg(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(l.status="rejected",l.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),l}var sf=N.S;N.S=function(e,t){Vd=Ye(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&Gg(e,t),sf!==null&&sf(e,t)};var yl=b(null);function $o(){var e=yl.current;return e!==null?e:qe.pooledCache}function Ji(e,t){t===null?X(yl,yl.current):X(yl,t.pool)}function rf(){var e=$o();return e===null?null:{parent:et._currentValue,pool:e}}var Jl=Error(r(460)),Po=Error(r(474)),Ii=Error(r(542)),Fi={then:function(){}};function cf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function ff(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(rn,rn),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,_f(e),e;default:if(typeof t.status=="string")t.then(rn,rn);else{if(e=qe,e!==null&&100<e.shellSuspendCounter)throw Error(r(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=l}},function(l){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,_f(e),e}throw hl=t,Jl}}function pl(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(hl=n,Jl):n}}var hl=null;function df(){if(hl===null)throw Error(r(459));var e=hl;return hl=null,e}function _f(e){if(e===Jl||e===Ii)throw Error(r(483))}var Il=null,La=0;function Wi(e){var t=La;return La+=1,Il===null&&(Il=[]),ff(Il,e,t)}function Ha(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function $i(e,t){throw t.$$typeof===z?Error(r(525)):(e=Object.prototype.toString.call(t),Error(r(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function mf(e){function t(S,v){if(e){var w=S.deletions;w===null?(S.deletions=[v],S.flags|=16):w.push(v)}}function n(S,v){if(!e)return null;for(;v!==null;)t(S,v),v=v.sibling;return null}function l(S){for(var v=new Map;S!==null;)S.key!==null?v.set(S.key,S):v.set(S.index,S),S=S.sibling;return v}function a(S,v){return S=fn(S,v),S.index=0,S.sibling=null,S}function u(S,v,w){return S.index=w,e?(w=S.alternate,w!==null?(w=w.index,w<v?(S.flags|=67108866,v):w):(S.flags|=67108866,v)):(S.flags|=1048576,v)}function c(S){return e&&S.alternate===null&&(S.flags|=67108866),S}function d(S,v,w,U){return v===null||v.tag!==6?(v=Xo(w,S.mode,U),v.return=S,v):(v=a(v,w),v.return=S,v)}function y(S,v,w,U){var ie=w.type;return ie===L?M(S,v,w.props.children,U,w.key):v!==null&&(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===ue&&pl(ie)===v.type)?(v=a(v,w.props),Ha(v,w),v.return=S,v):(v=Gi(w.type,w.key,w.props,null,S.mode,U),Ha(v,w),v.return=S,v)}function C(S,v,w,U){return v===null||v.tag!==4||v.stateNode.containerInfo!==w.containerInfo||v.stateNode.implementation!==w.implementation?(v=qo(w,S.mode,U),v.return=S,v):(v=a(v,w.children||[]),v.return=S,v)}function M(S,v,w,U,ie){return v===null||v.tag!==7?(v=dl(w,S.mode,U,ie),v.return=S,v):(v=a(v,w),v.return=S,v)}function Y(S,v,w){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return v=Xo(""+v,S.mode,w),v.return=S,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case j:return w=Gi(v.type,v.key,v.props,null,S.mode,w),Ha(w,v),w.return=S,w;case B:return v=qo(v,S.mode,w),v.return=S,v;case ue:return v=pl(v),Y(S,v,w)}if(ce(v)||Ce(v))return v=dl(v,S.mode,w,null),v.return=S,v;if(typeof v.then=="function")return Y(S,Wi(v),w);if(v.$$typeof===G)return Y(S,Ki(S,v),w);$i(S,v)}return null}function O(S,v,w,U){var ie=v!==null?v.key:null;if(typeof w=="string"&&w!==""||typeof w=="number"||typeof w=="bigint")return ie!==null?null:d(S,v,""+w,U);if(typeof w=="object"&&w!==null){switch(w.$$typeof){case j:return w.key===ie?y(S,v,w,U):null;case B:return w.key===ie?C(S,v,w,U):null;case ue:return w=pl(w),O(S,v,w,U)}if(ce(w)||Ce(w))return ie!==null?null:M(S,v,w,U,null);if(typeof w.then=="function")return O(S,v,Wi(w),U);if(w.$$typeof===G)return O(S,v,Ki(S,w),U);$i(S,w)}return null}function A(S,v,w,U,ie){if(typeof U=="string"&&U!==""||typeof U=="number"||typeof U=="bigint")return S=S.get(w)||null,d(v,S,""+U,ie);if(typeof U=="object"&&U!==null){switch(U.$$typeof){case j:return S=S.get(U.key===null?w:U.key)||null,y(v,S,U,ie);case B:return S=S.get(U.key===null?w:U.key)||null,C(v,S,U,ie);case ue:return U=pl(U),A(S,v,w,U,ie)}if(ce(U)||Ce(U))return S=S.get(w)||null,M(v,S,U,ie,null);if(typeof U.then=="function")return A(S,v,w,Wi(U),ie);if(U.$$typeof===G)return A(S,v,w,Ki(v,U),ie);$i(v,U)}return null}function W(S,v,w,U){for(var ie=null,Ae=null,P=v,he=v=0,we=null;P!==null&&he<w.length;he++){P.index>he?(we=P,P=null):we=P.sibling;var Re=O(S,P,w[he],U);if(Re===null){P===null&&(P=we);break}e&&P&&Re.alternate===null&&t(S,P),v=u(Re,v,he),Ae===null?ie=Re:Ae.sibling=Re,Ae=Re,P=we}if(he===w.length)return n(S,P),Oe&&dn(S,he),ie;if(P===null){for(;he<w.length;he++)P=Y(S,w[he],U),P!==null&&(v=u(P,v,he),Ae===null?ie=P:Ae.sibling=P,Ae=P);return Oe&&dn(S,he),ie}for(P=l(P);he<w.length;he++)we=A(P,S,he,w[he],U),we!==null&&(e&&we.alternate!==null&&P.delete(we.key===null?he:we.key),v=u(we,v,he),Ae===null?ie=we:Ae.sibling=we,Ae=we);return e&&P.forEach(function(nl){return t(S,nl)}),Oe&&dn(S,he),ie}function oe(S,v,w,U){if(w==null)throw Error(r(151));for(var ie=null,Ae=null,P=v,he=v=0,we=null,Re=w.next();P!==null&&!Re.done;he++,Re=w.next()){P.index>he?(we=P,P=null):we=P.sibling;var nl=O(S,P,Re.value,U);if(nl===null){P===null&&(P=we);break}e&&P&&nl.alternate===null&&t(S,P),v=u(nl,v,he),Ae===null?ie=nl:Ae.sibling=nl,Ae=nl,P=we}if(Re.done)return n(S,P),Oe&&dn(S,he),ie;if(P===null){for(;!Re.done;he++,Re=w.next())Re=Y(S,Re.value,U),Re!==null&&(v=u(Re,v,he),Ae===null?ie=Re:Ae.sibling=Re,Ae=Re);return Oe&&dn(S,he),ie}for(P=l(P);!Re.done;he++,Re=w.next())Re=A(P,S,he,Re.value,U),Re!==null&&(e&&Re.alternate!==null&&P.delete(Re.key===null?he:Re.key),v=u(Re,v,he),Ae===null?ie=Re:Ae.sibling=Re,Ae=Re);return e&&P.forEach(function(np){return t(S,np)}),Oe&&dn(S,he),ie}function He(S,v,w,U){if(typeof w=="object"&&w!==null&&w.type===L&&w.key===null&&(w=w.props.children),typeof w=="object"&&w!==null){switch(w.$$typeof){case j:e:{for(var ie=w.key;v!==null;){if(v.key===ie){if(ie=w.type,ie===L){if(v.tag===7){n(S,v.sibling),U=a(v,w.props.children),U.return=S,S=U;break e}}else if(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===ue&&pl(ie)===v.type){n(S,v.sibling),U=a(v,w.props),Ha(U,w),U.return=S,S=U;break e}n(S,v);break}else t(S,v);v=v.sibling}w.type===L?(U=dl(w.props.children,S.mode,U,w.key),U.return=S,S=U):(U=Gi(w.type,w.key,w.props,null,S.mode,U),Ha(U,w),U.return=S,S=U)}return c(S);case B:e:{for(ie=w.key;v!==null;){if(v.key===ie)if(v.tag===4&&v.stateNode.containerInfo===w.containerInfo&&v.stateNode.implementation===w.implementation){n(S,v.sibling),U=a(v,w.children||[]),U.return=S,S=U;break e}else{n(S,v);break}else t(S,v);v=v.sibling}U=qo(w,S.mode,U),U.return=S,S=U}return c(S);case ue:return w=pl(w),He(S,v,w,U)}if(ce(w))return W(S,v,w,U);if(Ce(w)){if(ie=Ce(w),typeof ie!="function")throw Error(r(150));return w=ie.call(w),oe(S,v,w,U)}if(typeof w.then=="function")return He(S,v,Wi(w),U);if(w.$$typeof===G)return He(S,v,Ki(S,w),U);$i(S,w)}return typeof w=="string"&&w!==""||typeof w=="number"||typeof w=="bigint"?(w=""+w,v!==null&&v.tag===6?(n(S,v.sibling),U=a(v,w),U.return=S,S=U):(n(S,v),U=Xo(w,S.mode,U),U.return=S,S=U),c(S)):n(S,v)}return function(S,v,w,U){try{La=0;var ie=He(S,v,w,U);return Il=null,ie}catch(P){if(P===Jl||P===Ii)throw P;var Ae=Nt(29,P,null,S.mode);return Ae.lanes=U,Ae.return=S,Ae}}}var bl=mf(!0),gf=mf(!1),Ln=!1;function es(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ts(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Hn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Ne&2)!==0){var a=l.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),l.pending=t,t=Qi(e),Wc(e,null,n),t}return qi(e,l,t,n),Qi(e)}function Xa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ic(e,n)}}function ns(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var a=null,u=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};u===null?a=u=c:u=u.next=c,n=n.next}while(n!==null);u===null?a=u=t:u=u.next=t}else a=u=t;n={baseState:l.baseState,firstBaseUpdate:a,lastBaseUpdate:u,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var ls=!1;function qa(){if(ls){var e=Kl;if(e!==null)throw e}}function Qa(e,t,n,l){ls=!1;var a=e.updateQueue;Ln=!1;var u=a.firstBaseUpdate,c=a.lastBaseUpdate,d=a.shared.pending;if(d!==null){a.shared.pending=null;var y=d,C=y.next;y.next=null,c===null?u=C:c.next=C,c=y;var M=e.alternate;M!==null&&(M=M.updateQueue,d=M.lastBaseUpdate,d!==c&&(d===null?M.firstBaseUpdate=C:d.next=C,M.lastBaseUpdate=y))}if(u!==null){var Y=a.baseState;c=0,M=C=y=null,d=u;do{var O=d.lane&-536870913,A=O!==d.lane;if(A?(Te&O)===O:(l&O)===O){O!==0&&O===Zl&&(ls=!0),M!==null&&(M=M.next={lane:0,tag:d.tag,payload:d.payload,callback:null,next:null});e:{var W=e,oe=d;O=t;var He=n;switch(oe.tag){case 1:if(W=oe.payload,typeof W=="function"){Y=W.call(He,Y,O);break e}Y=W;break e;case 3:W.flags=W.flags&-65537|128;case 0:if(W=oe.payload,O=typeof W=="function"?W.call(He,Y,O):W,O==null)break e;Y=E({},Y,O);break e;case 2:Ln=!0}}O=d.callback,O!==null&&(e.flags|=64,A&&(e.flags|=8192),A=a.callbacks,A===null?a.callbacks=[O]:A.push(O))}else A={lane:O,tag:d.tag,payload:d.payload,callback:d.callback,next:null},M===null?(C=M=A,y=Y):M=M.next=A,c|=O;if(d=d.next,d===null){if(d=a.shared.pending,d===null)break;A=d,d=A.next,A.next=null,a.lastBaseUpdate=A,a.shared.pending=null}}while(!0);M===null&&(y=Y),a.baseState=y,a.firstBaseUpdate=C,a.lastBaseUpdate=M,u===null&&(a.shared.lanes=0),Zn|=c,e.lanes=c,e.memoizedState=Y}}function yf(e,t){if(typeof e!="function")throw Error(r(191,e));e.call(t)}function pf(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)yf(n[e],t)}var Fl=b(null),Pi=b(0);function hf(e,t){e=En,X(Pi,e),X(Fl,t),En=e|t.baseLanes}function as(){X(Pi,En),X(Fl,Fl.current)}function is(){En=Pi.current,k(Fl),k(Pi)}var jt=b(null),Vt=null;function qn(e){var t=e.alternate;X($e,$e.current&1),X(jt,e),Vt===null&&(t===null||Fl.current!==null||t.memoizedState!==null)&&(Vt=e)}function us(e){X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)}function bf(e){e.tag===22?(X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)):Qn()}function Qn(){X($e,$e.current),X(jt,jt.current)}function Mt(e){k(jt),Vt===e&&(Vt=null),k($e)}var $e=b(0);function eu(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||dr(n)||_r(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var gn=0,ye=null,Be=null,tt=null,tu=!1,Wl=!1,vl=!1,nu=0,Ga=0,$l=null,Zg=0;function Ie(){throw Error(r(321))}function os(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function ss(e,t,n,l,a,u){return gn=u,ye=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?nd:Es,vl=!1,u=n(l,a),vl=!1,Wl&&(u=xf(t,n,l,a)),vf(e),u}function vf(e){N.H=Ka;var t=Be!==null&&Be.next!==null;if(gn=0,tt=Be=ye=null,tu=!1,Ga=0,$l=null,t)throw Error(r(300));e===null||nt||(e=e.dependencies,e!==null&&Zi(e)&&(nt=!0))}function xf(e,t,n,l){ye=e;var a=0;do{if(Wl&&($l=null),Ga=0,Wl=!1,25<=a)throw Error(r(301));if(a+=1,tt=Be=null,e.updateQueue!=null){var u=e.updateQueue;u.lastEffect=null,u.events=null,u.stores=null,u.memoCache!=null&&(u.memoCache.index=0)}N.H=ld,u=t(n,l)}while(Wl);return u}function Kg(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?Va(t):t,e=e.useState()[0],(Be!==null?Be.memoizedState:null)!==e&&(ye.flags|=1024),t}function rs(){var e=nu!==0;return nu=0,e}function cs(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function fs(e){if(tu){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}tu=!1}gn=0,tt=Be=ye=null,Wl=!1,Ga=nu=0,$l=null}function ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?ye.memoizedState=tt=e:tt=tt.next=e,tt}function Pe(){if(Be===null){var e=ye.alternate;e=e!==null?e.memoizedState:null}else e=Be.next;var t=tt===null?ye.memoizedState:tt.next;if(t!==null)tt=t,Be=e;else{if(e===null)throw ye.alternate===null?Error(r(467)):Error(r(310));Be=e,e={memoizedState:Be.memoizedState,baseState:Be.baseState,baseQueue:Be.baseQueue,queue:Be.queue,next:null},tt===null?ye.memoizedState=tt=e:tt=tt.next=e}return tt}function lu(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Va(e){var t=Ga;return Ga+=1,$l===null&&($l=[]),e=ff($l,e,t),t=ye,(tt===null?t.memoizedState:tt.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?nd:Es),e}function au(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Va(e);if(e.$$typeof===G)return dt(e)}throw Error(r(438,String(e)))}function ds(e){var t=null,n=ye.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=ye.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=lu(),ye.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=le;return t.index++,n}function yn(e,t){return typeof t=="function"?t(e):t}function iu(e){var t=Pe();return _s(t,Be,e)}function _s(e,t,n){var l=e.queue;if(l===null)throw Error(r(311));l.lastRenderedReducer=n;var a=e.baseQueue,u=l.pending;if(u!==null){if(a!==null){var c=a.next;a.next=u.next,u.next=c}t.baseQueue=a=u,l.pending=null}if(u=e.baseState,a===null)e.memoizedState=u;else{t=a.next;var d=c=null,y=null,C=t,M=!1;do{var Y=C.lane&-536870913;if(Y!==C.lane?(Te&Y)===Y:(gn&Y)===Y){var O=C.revertLane;if(O===0)y!==null&&(y=y.next={lane:0,revertLane:0,gesture:null,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null}),Y===Zl&&(M=!0);else if((gn&O)===O){C=C.next,O===Zl&&(M=!0);continue}else Y={lane:0,revertLane:C.revertLane,gesture:null,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},y===null?(d=y=Y,c=u):y=y.next=Y,ye.lanes|=O,Zn|=O;Y=C.action,vl&&n(u,Y),u=C.hasEagerState?C.eagerState:n(u,Y)}else O={lane:Y,revertLane:C.revertLane,gesture:C.gesture,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},y===null?(d=y=O,c=u):y=y.next=O,ye.lanes|=Y,Zn|=Y;C=C.next}while(C!==null&&C!==t);if(y===null?c=u:y.next=d,!Rt(u,e.memoizedState)&&(nt=!0,M&&(n=Kl,n!==null)))throw n;e.memoizedState=u,e.baseState=c,e.baseQueue=y,l.lastRenderedState=u}return a===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function ms(e){var t=Pe(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var l=n.dispatch,a=n.pending,u=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do u=e(u,c.action),c=c.next;while(c!==a);Rt(u,t.memoizedState)||(nt=!0),t.memoizedState=u,t.baseQueue===null&&(t.baseState=u),n.lastRenderedState=u}return[u,l]}function Sf(e,t,n){var l=ye,a=Pe(),u=Oe;if(u){if(n===void 0)throw Error(r(407));n=n()}else n=t();var c=!Rt((Be||a).memoizedState,n);if(c&&(a.memoizedState=n,nt=!0),a=a.queue,ps(wf.bind(null,l,a,e),[e]),a.getSnapshot!==t||c||tt!==null&&tt.memoizedState.tag&1){if(l.flags|=2048,Pl(9,{destroy:void 0},Tf.bind(null,l,a,n,t),null),qe===null)throw Error(r(349));u||(gn&127)!==0||Ef(l,t,n)}return n}function Ef(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ye.updateQueue,t===null?(t=lu(),ye.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Tf(e,t,n,l){t.value=n,t.getSnapshot=l,Cf(t)&&Of(e)}function wf(e,t,n){return n(function(){Cf(t)&&Of(e)})}function Cf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function Of(e){var t=fl(e,2);t!==null&&Ct(t,e,2)}function gs(e){var t=ht();if(typeof e=="function"){var n=e;if(e=n(),vl){jn(!0);try{n()}finally{jn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:e},t}function zf(e,t,n,l){return e.baseState=n,_s(e,Be,typeof l=="function"?l:yn)}function Jg(e,t,n,l,a){if(su(e))throw Error(r(485));if(e=t.action,e!==null){var u={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){u.listeners.push(c)}};N.T!==null?n(!0):u.isTransition=!1,l(u),n=t.pending,n===null?(u.next=t.pending=u,Af(t,u)):(u.next=n.next,t.pending=n.next=u)}}function Af(e,t){var n=t.action,l=t.payload,a=e.state;if(t.isTransition){var u=N.T,c={};N.T=c;try{var d=n(a,l),y=N.S;y!==null&&y(c,d),Rf(e,t,d)}catch(C){ys(e,t,C)}finally{u!==null&&c.types!==null&&(u.types=c.types),N.T=u}}else try{u=n(a,l),Rf(e,t,u)}catch(C){ys(e,t,C)}}function Rf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Nf(e,t,l)},function(l){return ys(e,t,l)}):Nf(e,t,n)}function Nf(e,t,n){t.status="fulfilled",t.value=n,jf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,Af(e,n)))}function ys(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,jf(t),t=t.next;while(t!==l)}e.action=null}function jf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Mf(e,t){return t}function Df(e,t){if(Oe){var n=qe.formState;if(n!==null){e:{var l=ye;if(Oe){if(Ve){t:{for(var a=Ve,u=Gt;a.nodeType!==8;){if(!u){a=null;break t}if(a=Zt(a.nextSibling),a===null){a=null;break t}}u=a.data,a=u==="F!"||u==="F"?a:null}if(a){Ve=Zt(a.nextSibling),l=a.data==="F!";break e}}Yn(l)}l=!1}l&&(t=n[0])}}return n=ht(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Mf,lastRenderedState:t},n.queue=l,n=Pf.bind(null,ye,l),l.dispatch=n,l=gs(!1),u=Ss.bind(null,ye,!1,l.queue),l=ht(),a={state:t,dispatch:null,action:e,pending:null},l.queue=a,n=Jg.bind(null,ye,a,u,n),a.dispatch=n,l.memoizedState=e,[t,n,!1]}function Uf(e){var t=Pe();return kf(t,Be,e)}function kf(e,t,n){if(t=_s(e,t,Mf)[0],e=iu(yn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Va(t)}catch(c){throw c===Jl?Ii:c}else l=t;t=Pe();var a=t.queue,u=a.dispatch;return n!==t.memoizedState&&(ye.flags|=2048,Pl(9,{destroy:void 0},Ig.bind(null,a,n),null)),[l,u,e]}function Ig(e,t){e.action=t}function Yf(e){var t=Pe(),n=Be;if(n!==null)return kf(t,n,e);Pe(),t=t.memoizedState,n=Pe();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function Pl(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=ye.updateQueue,t===null&&(t=lu(),ye.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function Bf(){return Pe().memoizedState}function uu(e,t,n,l){var a=ht();ye.flags|=e,a.memoizedState=Pl(1|t,{destroy:void 0},n,l===void 0?null:l)}function ou(e,t,n,l){var a=Pe();l=l===void 0?null:l;var u=a.memoizedState.inst;Be!==null&&l!==null&&os(l,Be.memoizedState.deps)?a.memoizedState=Pl(t,u,n,l):(ye.flags|=e,a.memoizedState=Pl(1|t,u,n,l))}function Lf(e,t){uu(8390656,8,e,t)}function ps(e,t){ou(2048,8,e,t)}function Fg(e){ye.flags|=4;var t=ye.updateQueue;if(t===null)t=lu(),ye.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Hf(e){var t=Pe().memoizedState;return Fg({ref:t,nextImpl:e}),function(){if((Ne&2)!==0)throw Error(r(440));return t.impl.apply(void 0,arguments)}}function Xf(e,t){return ou(4,2,e,t)}function qf(e,t){return ou(4,4,e,t)}function Qf(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Gf(e,t,n){n=n!=null?n.concat([e]):null,ou(4,4,Qf.bind(null,t,e),n)}function hs(){}function Vf(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&os(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function Zf(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&os(t,l[1]))return l[0];if(l=e(),vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l}function bs(e,t,n){return n===void 0||(gn&1073741824)!==0&&(Te&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Kd(),ye.lanes|=e,Zn|=e,n)}function Kf(e,t,n,l){return Rt(n,t)?n:Fl.current!==null?(e=bs(e,n,l),Rt(e,t)||(nt=!0),e):(gn&42)===0||(gn&1073741824)!==0&&(Te&261930)===0?(nt=!0,e.memoizedState=n):(e=Kd(),ye.lanes|=e,Zn|=e,t)}function Jf(e,t,n,l,a){var u=q.p;q.p=u!==0&&8>u?u:8;var c=N.T,d={};N.T=d,Ss(e,!1,t,n);try{var y=a(),C=N.S;if(C!==null&&C(d,y),y!==null&&typeof y=="object"&&typeof y.then=="function"){var M=Vg(y,l);Za(e,t,M,kt(e))}else Za(e,t,l,kt(e))}catch(Y){Za(e,t,{then:function(){},status:"rejected",reason:Y},kt())}finally{q.p=u,c!==null&&d.types!==null&&(c.types=d.types),N.T=c}}function Wg(){}function vs(e,t,n,l){if(e.tag!==5)throw Error(r(476));var a=If(e).queue;Jf(e,a,t,K,n===null?Wg:function(){return Ff(e),n(l)})}function If(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:K},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Ff(e){var t=If(e);t.next===null&&(t=e.alternate.memoizedState),Za(e,t.next.queue,{},kt())}function xs(){return dt(ri)}function Wf(){return Pe().memoizedState}function $f(){return Pe().memoizedState}function $g(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=kt();e=Hn(n);var l=Xn(t,e,n);l!==null&&(Ct(l,t,n),Xa(l,t,n)),t={cache:Fo()},e.payload=t;return}t=t.return}}function Pg(e,t,n){var l=kt();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},su(e)?ed(t,n):(n=Lo(e,t,n,l),n!==null&&(Ct(n,e,l),td(n,t,l)))}function Pf(e,t,n){var l=kt();Za(e,t,n,l)}function Za(e,t,n,l){var a={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(su(e))ed(t,a);else{var u=e.alternate;if(e.lanes===0&&(u===null||u.lanes===0)&&(u=t.lastRenderedReducer,u!==null))try{var c=t.lastRenderedState,d=u(c,n);if(a.hasEagerState=!0,a.eagerState=d,Rt(d,c))return qi(e,t,a,0),qe===null&&Xi(),!1}catch{}if(n=Lo(e,t,a,l),n!==null)return Ct(n,e,l),td(n,t,l),!0}return!1}function Ss(e,t,n,l){if(l={lane:2,revertLane:er(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},su(e)){if(t)throw Error(r(479))}else t=Lo(e,n,l,2),t!==null&&Ct(t,e,2)}function su(e){var t=e.alternate;return e===ye||t!==null&&t===ye}function ed(e,t){Wl=tu=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function td(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,ic(e,n)}}var Ka={readContext:dt,use:au,useCallback:Ie,useContext:Ie,useEffect:Ie,useImperativeHandle:Ie,useLayoutEffect:Ie,useInsertionEffect:Ie,useMemo:Ie,useReducer:Ie,useRef:Ie,useState:Ie,useDebugValue:Ie,useDeferredValue:Ie,useTransition:Ie,useSyncExternalStore:Ie,useId:Ie,useHostTransitionStatus:Ie,useFormState:Ie,useActionState:Ie,useOptimistic:Ie,useMemoCache:Ie,useCacheRefresh:Ie};Ka.useEffectEvent=Ie;var nd={readContext:dt,use:au,useCallback:function(e,t){return ht().memoizedState=[e,t===void 0?null:t],e},useContext:dt,useEffect:Lf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,uu(4194308,4,Qf.bind(null,t,e),n)},useLayoutEffect:function(e,t){return uu(4194308,4,e,t)},useInsertionEffect:function(e,t){uu(4,2,e,t)},useMemo:function(e,t){var n=ht();t=t===void 0?null:t;var l=e();if(vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=ht();if(n!==void 0){var a=n(t);if(vl){jn(!0);try{n(t)}finally{jn(!1)}}}else a=t;return l.memoizedState=l.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},l.queue=e,e=e.dispatch=Pg.bind(null,ye,e),[l.memoizedState,e]},useRef:function(e){var t=ht();return e={current:e},t.memoizedState=e},useState:function(e){e=gs(e);var t=e.queue,n=Pf.bind(null,ye,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:hs,useDeferredValue:function(e,t){var n=ht();return bs(n,e,t)},useTransition:function(){var e=gs(!1);return e=Jf.bind(null,ye,e.queue,!0,!1),ht().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=ye,a=ht();if(Oe){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),qe===null)throw Error(r(349));(Te&127)!==0||Ef(l,t,n)}a.memoizedState=n;var u={value:n,getSnapshot:t};return a.queue=u,Lf(wf.bind(null,l,u,e),[e]),l.flags|=2048,Pl(9,{destroy:void 0},Tf.bind(null,l,u,n,t),null),n},useId:function(){var e=ht(),t=qe.identifierPrefix;if(Oe){var n=nn,l=tn;n=(l&~(1<<32-At(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=nu++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=Zg++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:xs,useFormState:Df,useActionState:Df,useOptimistic:function(e){var t=ht();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Ss.bind(null,ye,!0,n),n.dispatch=t,[e,t]},useMemoCache:ds,useCacheRefresh:function(){return ht().memoizedState=$g.bind(null,ye)},useEffectEvent:function(e){var t=ht(),n={impl:e};return t.memoizedState=n,function(){if((Ne&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}},Es={readContext:dt,use:au,useCallback:Vf,useContext:dt,useEffect:ps,useImperativeHandle:Gf,useInsertionEffect:Xf,useLayoutEffect:qf,useMemo:Zf,useReducer:iu,useRef:Bf,useState:function(){return iu(yn)},useDebugValue:hs,useDeferredValue:function(e,t){var n=Pe();return Kf(n,Be.memoizedState,e,t)},useTransition:function(){var e=iu(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Va(e),t]},useSyncExternalStore:Sf,useId:Wf,useHostTransitionStatus:xs,useFormState:Uf,useActionState:Uf,useOptimistic:function(e,t){var n=Pe();return zf(n,Be,e,t)},useMemoCache:ds,useCacheRefresh:$f};Es.useEffectEvent=Hf;var ld={readContext:dt,use:au,useCallback:Vf,useContext:dt,useEffect:ps,useImperativeHandle:Gf,useInsertionEffect:Xf,useLayoutEffect:qf,useMemo:Zf,useReducer:ms,useRef:Bf,useState:function(){return ms(yn)},useDebugValue:hs,useDeferredValue:function(e,t){var n=Pe();return Be===null?bs(n,e,t):Kf(n,Be.memoizedState,e,t)},useTransition:function(){var e=ms(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Va(e),t]},useSyncExternalStore:Sf,useId:Wf,useHostTransitionStatus:xs,useFormState:Yf,useActionState:Yf,useOptimistic:function(e,t){var n=Pe();return Be!==null?zf(n,Be,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:ds,useCacheRefresh:$f};ld.useEffectEvent=Hf;function Ts(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var ws={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=kt(),a=Hn(l);a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ct(t,e,l),Xa(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=kt(),a=Hn(l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ct(t,e,l),Xa(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=kt(),l=Hn(n);l.tag=2,t!=null&&(l.callback=t),t=Xn(e,l,n),t!==null&&(Ct(t,e,n),Xa(t,e,n))}};function ad(e,t,n,l,a,u,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,u,c):t.prototype&&t.prototype.isPureReactComponent?!Ma(n,l)||!Ma(a,u):!0}function id(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&ws.enqueueReplaceState(t,t.state,null)}function xl(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=E({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function ud(e){Hi(e)}function od(e){console.error(e)}function sd(e){Hi(e)}function ru(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function rd(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function Cs(e,t,n){return n=Hn(n),n.tag=3,n.payload={element:null},n.callback=function(){ru(e,t)},n}function cd(e){return e=Hn(e),e.tag=3,e}function fd(e,t,n,l){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var u=l.value;e.payload=function(){return a(u)},e.callback=function(){rd(t,n,l)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){rd(t,n,l),typeof a!="function"&&(Kn===null?Kn=new Set([this]):Kn.add(this));var d=l.stack;this.componentDidCatch(l.value,{componentStack:d!==null?d:""})})}function ey(e,t,n,l,a){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&Vl(t,n,a,!0),n=jt.current,n!==null){switch(n.tag){case 31:case 13:return Vt===null?xu():n.alternate===null&&Fe===0&&(Fe=3),n.flags&=-257,n.flags|=65536,n.lanes=a,l===Fi?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),Ws(e,l,a)),!1;case 22:return n.flags|=65536,l===Fi?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),Ws(e,l,a)),!1}throw Error(r(435,n.tag))}return Ws(e,l,a),xu(),!1}if(Oe)return t=jt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,l!==Vo&&(e=Error(r(422),{cause:l}),ka(Xt(e,n)))):(l!==Vo&&(t=Error(r(423),{cause:l}),ka(Xt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,l=Xt(l,n),a=Cs(e.stateNode,l,a),ns(e,a),Fe!==4&&(Fe=2)),!1;var u=Error(r(520),{cause:l});if(u=Xt(u,n),ti===null?ti=[u]:ti.push(u),Fe!==4&&(Fe=2),t===null)return!0;l=Xt(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=Cs(n.stateNode,l,e),ns(n,e),!1;case 1:if(t=n.type,u=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||u!==null&&typeof u.componentDidCatch=="function"&&(Kn===null||!Kn.has(u))))return n.flags|=65536,a&=-a,n.lanes|=a,a=cd(a),fd(a,e,n,l),ns(n,a),!1}n=n.return}while(n!==null);return!1}var Os=Error(r(461)),nt=!1;function _t(e,t,n,l){t.child=e===null?gf(t,null,n,l):bl(t,e.child,n,l)}function dd(e,t,n,l,a){n=n.render;var u=t.ref;if("ref"in l){var c={};for(var d in l)d!=="ref"&&(c[d]=l[d])}else c=l;return gl(t),l=ss(e,t,n,c,u,a),d=rs(),e!==null&&!nt?(cs(e,t,a),pn(e,t,a)):(Oe&&d&&Qo(t),t.flags|=1,_t(e,t,l,a),t.child)}function _d(e,t,n,l,a){if(e===null){var u=n.type;return typeof u=="function"&&!Ho(u)&&u.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=u,md(e,t,u,l,a)):(e=Gi(n.type,null,l,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(u=e.child,!Us(e,a)){var c=u.memoizedProps;if(n=n.compare,n=n!==null?n:Ma,n(c,l)&&e.ref===t.ref)return pn(e,t,a)}return t.flags|=1,e=fn(u,l),e.ref=t.ref,e.return=t,t.child=e}function md(e,t,n,l,a){if(e!==null){var u=e.memoizedProps;if(Ma(u,l)&&e.ref===t.ref)if(nt=!1,t.pendingProps=l=u,Us(e,a))(e.flags&131072)!==0&&(nt=!0);else return t.lanes=e.lanes,pn(e,t,a)}return zs(e,t,n,l,a)}function gd(e,t,n,l){var a=l.children,u=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(u=u!==null?u.baseLanes|n:n,e!==null){for(l=t.child=e.child,a=0;l!==null;)a=a|l.lanes|l.childLanes,l=l.sibling;l=a&~u}else l=0,t.child=null;return yd(e,t,u,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ji(t,u!==null?u.cachePool:null),u!==null?hf(t,u):as(),bf(t);else return l=t.lanes=536870912,yd(e,t,u!==null?u.baseLanes|n:n,n,l)}else u!==null?(Ji(t,u.cachePool),hf(t,u),Qn(),t.memoizedState=null):(e!==null&&Ji(t,null),as(),Qn());return _t(e,t,a,n),t.child}function Ja(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function yd(e,t,n,l,a){var u=$o();return u=u===null?null:{parent:et._currentValue,pool:u},t.memoizedState={baseLanes:n,cachePool:u},e!==null&&Ji(t,null),as(),bf(t),e!==null&&Vl(e,t,l,!0),t.childLanes=a,null}function cu(e,t){return t=du({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function pd(e,t,n){return bl(t,e.child,null,n),e=cu(t,t.pendingProps),e.flags|=2,Mt(t),t.memoizedState=null,e}function ty(e,t,n){var l=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Oe){if(l.mode==="hidden")return e=cu(t,l),t.lanes=536870912,Ja(null,e);if(us(t),(e=Ve)?(e=A_(e,Gt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Un!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=Pc(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return t.lanes=536870912,null}return cu(t,l)}var u=e.memoizedState;if(u!==null){var c=u.dehydrated;if(us(t),a)if(t.flags&256)t.flags&=-257,t=pd(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(r(558));else if(nt||Vl(e,t,n,!1),a=(n&e.childLanes)!==0,nt||a){if(l=qe,l!==null&&(c=uc(l,n),c!==0&&c!==u.retryLane))throw u.retryLane=c,fl(e,c),Ct(l,e,c),Os;xu(),t=pd(e,t,n)}else e=u.treeContext,Ve=Zt(c.nextSibling),ft=t,Oe=!0,kn=null,Gt=!1,e!==null&&nf(t,e),t=cu(t,l),t.flags|=4096;return t}return e=fn(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function fu(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(r(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function zs(e,t,n,l,a){return gl(t),n=ss(e,t,n,l,void 0,a),l=rs(),e!==null&&!nt?(cs(e,t,a),pn(e,t,a)):(Oe&&l&&Qo(t),t.flags|=1,_t(e,t,n,a),t.child)}function hd(e,t,n,l,a,u){return gl(t),t.updateQueue=null,n=xf(t,l,n,a),vf(e),l=rs(),e!==null&&!nt?(cs(e,t,u),pn(e,t,u)):(Oe&&l&&Qo(t),t.flags|=1,_t(e,t,n,u),t.child)}function bd(e,t,n,l,a){if(gl(t),t.stateNode===null){var u=Xl,c=n.contextType;typeof c=="object"&&c!==null&&(u=dt(c)),u=new n(l,u),t.memoizedState=u.state!==null&&u.state!==void 0?u.state:null,u.updater=ws,t.stateNode=u,u._reactInternals=t,u=t.stateNode,u.props=l,u.state=t.memoizedState,u.refs={},es(t),c=n.contextType,u.context=typeof c=="object"&&c!==null?dt(c):Xl,u.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(Ts(t,n,c,l),u.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof u.getSnapshotBeforeUpdate=="function"||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(c=u.state,typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount(),c!==u.state&&ws.enqueueReplaceState(u,u.state,null),Qa(t,l,u,a),qa(),u.state=t.memoizedState),typeof u.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){u=t.stateNode;var d=t.memoizedProps,y=xl(n,d);u.props=y;var C=u.context,M=n.contextType;c=Xl,typeof M=="object"&&M!==null&&(c=dt(M));var Y=n.getDerivedStateFromProps;M=typeof Y=="function"||typeof u.getSnapshotBeforeUpdate=="function",d=t.pendingProps!==d,M||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(d||C!==c)&&id(t,u,l,c),Ln=!1;var O=t.memoizedState;u.state=O,Qa(t,l,u,a),qa(),C=t.memoizedState,d||O!==C||Ln?(typeof Y=="function"&&(Ts(t,n,Y,l),C=t.memoizedState),(y=Ln||ad(t,n,y,l,O,C,c))?(M||typeof u.UNSAFE_componentWillMount!="function"&&typeof u.componentWillMount!="function"||(typeof u.componentWillMount=="function"&&u.componentWillMount(),typeof u.UNSAFE_componentWillMount=="function"&&u.UNSAFE_componentWillMount()),typeof u.componentDidMount=="function"&&(t.flags|=4194308)):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=C),u.props=l,u.state=C,u.context=c,l=y):(typeof u.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{u=t.stateNode,ts(e,t),c=t.memoizedProps,M=xl(n,c),u.props=M,Y=t.pendingProps,O=u.context,C=n.contextType,y=Xl,typeof C=="object"&&C!==null&&(y=dt(C)),d=n.getDerivedStateFromProps,(C=typeof d=="function"||typeof u.getSnapshotBeforeUpdate=="function")||typeof u.UNSAFE_componentWillReceiveProps!="function"&&typeof u.componentWillReceiveProps!="function"||(c!==Y||O!==y)&&id(t,u,l,y),Ln=!1,O=t.memoizedState,u.state=O,Qa(t,l,u,a),qa();var A=t.memoizedState;c!==Y||O!==A||Ln||e!==null&&e.dependencies!==null&&Zi(e.dependencies)?(typeof d=="function"&&(Ts(t,n,d,l),A=t.memoizedState),(M=Ln||ad(t,n,M,l,O,A,y)||e!==null&&e.dependencies!==null&&Zi(e.dependencies))?(C||typeof u.UNSAFE_componentWillUpdate!="function"&&typeof u.componentWillUpdate!="function"||(typeof u.componentWillUpdate=="function"&&u.componentWillUpdate(l,A,y),typeof u.UNSAFE_componentWillUpdate=="function"&&u.UNSAFE_componentWillUpdate(l,A,y)),typeof u.componentDidUpdate=="function"&&(t.flags|=4),typeof u.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof u.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=A),u.props=l,u.state=A,u.context=y,l=M):(typeof u.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof u.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),l=!1)}return u=l,fu(e,t),l=(t.flags&128)!==0,u||l?(u=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:u.render(),t.flags|=1,e!==null&&l?(t.child=bl(t,e.child,null,a),t.child=bl(t,null,n,a)):_t(e,t,n,a),t.memoizedState=u.state,e=t.child):e=pn(e,t,a),e}function vd(e,t,n,l){return _l(),t.flags|=256,_t(e,t,n,l),t.child}var As={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Rs(e){return{baseLanes:e,cachePool:rf()}}function Ns(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=Ut),e}function xd(e,t,n){var l=t.pendingProps,a=!1,u=(t.flags&128)!==0,c;if((c=u)||(c=e!==null&&e.memoizedState===null?!1:($e.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(Oe){if(a?qn(t):Qn(),(e=Ve)?(e=A_(e,Gt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:Un!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=Pc(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return _r(e)?t.lanes=32:t.lanes=536870912,null}var d=l.children;return l=l.fallback,a?(Qn(),a=t.mode,d=du({mode:"hidden",children:d},a),l=dl(l,a,n,null),d.return=t,l.return=t,d.sibling=l,t.child=d,l=t.child,l.memoizedState=Rs(n),l.childLanes=Ns(e,c,n),t.memoizedState=As,Ja(null,l)):(qn(t),js(t,d))}var y=e.memoizedState;if(y!==null&&(d=y.dehydrated,d!==null)){if(u)t.flags&256?(qn(t),t.flags&=-257,t=Ms(e,t,n)):t.memoizedState!==null?(Qn(),t.child=e.child,t.flags|=128,t=null):(Qn(),d=l.fallback,a=t.mode,l=du({mode:"visible",children:l.children},a),d=dl(d,a,n,null),d.flags|=2,l.return=t,d.return=t,l.sibling=d,t.child=l,bl(t,e.child,null,n),l=t.child,l.memoizedState=Rs(n),l.childLanes=Ns(e,c,n),t.memoizedState=As,t=Ja(null,l));else if(qn(t),_r(d)){if(c=d.nextSibling&&d.nextSibling.dataset,c)var C=c.dgst;c=C,l=Error(r(419)),l.stack="",l.digest=c,ka({value:l,source:null,stack:null}),t=Ms(e,t,n)}else if(nt||Vl(e,t,n,!1),c=(n&e.childLanes)!==0,nt||c){if(c=qe,c!==null&&(l=uc(c,n),l!==0&&l!==y.retryLane))throw y.retryLane=l,fl(e,l),Ct(c,e,l),Os;dr(d)||xu(),t=Ms(e,t,n)}else dr(d)?(t.flags|=192,t.child=e.child,t=null):(e=y.treeContext,Ve=Zt(d.nextSibling),ft=t,Oe=!0,kn=null,Gt=!1,e!==null&&nf(t,e),t=js(t,l.children),t.flags|=4096);return t}return a?(Qn(),d=l.fallback,a=t.mode,y=e.child,C=y.sibling,l=fn(y,{mode:"hidden",children:l.children}),l.subtreeFlags=y.subtreeFlags&65011712,C!==null?d=fn(C,d):(d=dl(d,a,n,null),d.flags|=2),d.return=t,l.return=t,l.sibling=d,t.child=l,Ja(null,l),l=t.child,d=e.child.memoizedState,d===null?d=Rs(n):(a=d.cachePool,a!==null?(y=et._currentValue,a=a.parent!==y?{parent:y,pool:y}:a):a=rf(),d={baseLanes:d.baseLanes|n,cachePool:a}),l.memoizedState=d,l.childLanes=Ns(e,c,n),t.memoizedState=As,Ja(e.child,l)):(qn(t),n=e.child,e=n.sibling,n=fn(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function js(e,t){return t=du({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function du(e,t){return e=Nt(22,e,null,t),e.lanes=0,e}function Ms(e,t,n){return bl(t,e.child,null,n),e=js(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Sd(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),Jo(e.return,t,n)}function Ds(e,t,n,l,a,u){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:a,treeForkCount:u}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=l,c.tail=n,c.tailMode=a,c.treeForkCount=u)}function Ed(e,t,n){var l=t.pendingProps,a=l.revealOrder,u=l.tail;l=l.children;var c=$e.current,d=(c&2)!==0;if(d?(c=c&1|2,t.flags|=128):c&=1,X($e,c),_t(e,t,l,n),l=Oe?Ua:0,!d&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Sd(e,n,t);else if(e.tag===19)Sd(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&eu(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Ds(t,!1,a,n,u,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&eu(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Ds(t,!0,n,null,u,l);break;case"together":Ds(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function pn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Vl(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=fn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=fn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Us(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Zi(e)))}function ny(e,t,n){switch(t.tag){case 3:Je(t,t.stateNode.containerInfo),Bn(t,et,e.memoizedState.cache),_l();break;case 27:case 5:Yt(t);break;case 4:Je(t,t.stateNode.containerInfo);break;case 10:Bn(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,us(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(qn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?xd(e,t,n):(qn(t),e=pn(e,t,n),e!==null?e.sibling:null);qn(t);break;case 19:var a=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(Vl(e,t,n,!1),l=(n&t.childLanes)!==0),a){if(l)return Ed(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),X($e,$e.current),l)break;return null;case 22:return t.lanes=0,gd(e,t,n,t.pendingProps);case 24:Bn(t,et,e.memoizedState.cache)}return pn(e,t,n)}function Td(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)nt=!0;else{if(!Us(e,n)&&(t.flags&128)===0)return nt=!1,ny(e,t,n);nt=(e.flags&131072)!==0}else nt=!1,Oe&&(t.flags&1048576)!==0&&tf(t,Ua,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=pl(t.elementType),t.type=e,typeof e=="function")Ho(e)?(l=xl(e,l),t.tag=1,t=bd(null,t,e,l,n)):(t.tag=0,t=zs(null,t,e,l,n));else{if(e!=null){var a=e.$$typeof;if(a===Q){t.tag=11,t=dd(null,t,e,l,n);break e}else if(a===F){t.tag=14,t=_d(null,t,e,l,n);break e}}throw t=Xe(e)||e,Error(r(306,t,""))}}return t;case 0:return zs(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,a=xl(l,t.pendingProps),bd(e,t,l,a,n);case 3:e:{if(Je(t,t.stateNode.containerInfo),e===null)throw Error(r(387));l=t.pendingProps;var u=t.memoizedState;a=u.element,ts(e,t),Qa(t,l,null,n);var c=t.memoizedState;if(l=c.cache,Bn(t,et,l),l!==u.cache&&Io(t,[et],n,!0),qa(),l=c.element,u.isDehydrated)if(u={element:l,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=u,t.memoizedState=u,t.flags&256){t=vd(e,t,l,n);break e}else if(l!==a){a=Xt(Error(r(424)),t),ka(a),t=vd(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ve=Zt(e.firstChild),ft=t,Oe=!0,kn=null,Gt=!0,n=gf(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(_l(),l===a){t=pn(e,t,n);break e}_t(e,t,l,n)}t=t.child}return t;case 26:return fu(e,t),e===null?(n=U_(t.type,null,t.pendingProps,null))?t.memoizedState=n:Oe||(n=t.type,e=t.pendingProps,l=zu(pe.current).createElement(n),l[ct]=t,l[vt]=e,mt(l,n,e),ot(l),t.stateNode=l):t.memoizedState=U_(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Yt(t),e===null&&Oe&&(l=t.stateNode=j_(t.type,t.pendingProps,pe.current),ft=t,Gt=!0,a=Ve,Wn(t.type)?(mr=a,Ve=Zt(l.firstChild)):Ve=a),_t(e,t,t.pendingProps.children,n),fu(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Oe&&((a=l=Ve)&&(l=jy(l,t.type,t.pendingProps,Gt),l!==null?(t.stateNode=l,ft=t,Ve=Zt(l.firstChild),Gt=!1,a=!0):a=!1),a||Yn(t)),Yt(t),a=t.type,u=t.pendingProps,c=e!==null?e.memoizedProps:null,l=u.children,rr(a,u)?l=null:c!==null&&rr(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=ss(e,t,Kg,null,null,n),ri._currentValue=a),fu(e,t),_t(e,t,l,n),t.child;case 6:return e===null&&Oe&&((e=n=Ve)&&(n=My(n,t.pendingProps,Gt),n!==null?(t.stateNode=n,ft=t,Ve=null,e=!0):e=!1),e||Yn(t)),null;case 13:return xd(e,t,n);case 4:return Je(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=bl(t,null,l,n):_t(e,t,l,n),t.child;case 11:return dd(e,t,t.type,t.pendingProps,n);case 7:return _t(e,t,t.pendingProps,n),t.child;case 8:return _t(e,t,t.pendingProps.children,n),t.child;case 12:return _t(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,Bn(t,t.type,l.value),_t(e,t,l.children,n),t.child;case 9:return a=t.type._context,l=t.pendingProps.children,gl(t),a=dt(a),l=l(a),t.flags|=1,_t(e,t,l,n),t.child;case 14:return _d(e,t,t.type,t.pendingProps,n);case 15:return md(e,t,t.type,t.pendingProps,n);case 19:return Ed(e,t,n);case 31:return ty(e,t,n);case 22:return gd(e,t,n,t.pendingProps);case 24:return gl(t),l=dt(et),e===null?(a=$o(),a===null&&(a=qe,u=Fo(),a.pooledCache=u,u.refCount++,u!==null&&(a.pooledCacheLanes|=n),a=u),t.memoizedState={parent:l,cache:a},es(t),Bn(t,et,a)):((e.lanes&n)!==0&&(ts(e,t),Qa(t,null,null,n),qa()),a=e.memoizedState,u=t.memoizedState,a.parent!==l?(a={parent:l,cache:l},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Bn(t,et,l)):(l=u.cache,Bn(t,et,l),l!==a.cache&&Io(t,[et],n,!0))),_t(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(r(156,t.tag))}function hn(e){e.flags|=4}function ks(e,t,n,l,a){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(Wd())e.flags|=8192;else throw hl=Fi,Po}else e.flags&=-16777217}function wd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!H_(t))if(Wd())e.flags|=8192;else throw hl=Fi,Po}function _u(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?lc():536870912,e.lanes|=t,la|=t)}function Ia(e,t){if(!Oe)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags&65011712,l|=a.flags&65011712,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags,l|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function ly(e,t,n){var l=t.pendingProps;switch(Go(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return Ze(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),mn(et),Me(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gl(t)?hn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Zo())),Ze(t),null;case 26:var a=t.type,u=t.memoizedState;return e===null?(hn(t),u!==null?(Ze(t),wd(t,u)):(Ze(t),ks(t,a,null,l,n))):u?u!==e.memoizedState?(hn(t),Ze(t),wd(t,u)):(Ze(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&hn(t),Ze(t),ks(t,a,e,l,n)),null;case 27:if(It(t),n=pe.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}e=J.current,Gl(t)?lf(t):(e=j_(a,l,n),t.stateNode=e,hn(t))}return Ze(t),null;case 5:if(It(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}if(u=J.current,Gl(t))lf(t);else{var c=zu(pe.current);switch(u){case 1:u=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:u=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":u=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":u=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":u=c.createElement("div"),u.innerHTML="<script><\/script>",u=u.removeChild(u.firstChild);break;case"select":u=typeof l.is=="string"?c.createElement("select",{is:l.is}):c.createElement("select"),l.multiple?u.multiple=!0:l.size&&(u.size=l.size);break;default:u=typeof l.is=="string"?c.createElement(a,{is:l.is}):c.createElement(a)}}u[ct]=t,u[vt]=l;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)u.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=u;e:switch(mt(u,a,l),a){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&hn(t)}}return Ze(t),ks(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(r(166));if(e=pe.current,Gl(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,a=ft,a!==null)switch(a.tag){case 27:case 5:l=a.memoizedProps}e[ct]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||x_(e.nodeValue,n)),e||Yn(t,!0)}else e=zu(e).createTextNode(l),e[ct]=t,t.stateNode=e}return Ze(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=Gl(t),n!==null){if(e===null){if(!l)throw Error(r(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(557));e[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),e=!1}else n=Zo(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Mt(t),t):(Mt(t),null);if((t.flags&128)!==0)throw Error(r(558))}return Ze(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!a)throw Error(r(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(r(317));a[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),a=!1}else a=Zo(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Mt(t),t):(Mt(t),null)}return Mt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,a=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(a=l.alternate.memoizedState.cachePool.pool),u=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(u=l.memoizedState.cachePool.pool),u!==a&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),_u(t,t.updateQueue),Ze(t),null);case 4:return Me(),e===null&&ar(t.stateNode.containerInfo),Ze(t),null;case 10:return mn(t.type),Ze(t),null;case 19:if(k($e),l=t.memoizedState,l===null)return Ze(t),null;if(a=(t.flags&128)!==0,u=l.rendering,u===null)if(a)Ia(l,!1);else{if(Fe!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(u=eu(e),u!==null){for(t.flags|=128,Ia(l,!1),e=u.updateQueue,t.updateQueue=e,_u(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)$c(n,e),n=n.sibling;return X($e,$e.current&1|2),Oe&&dn(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ye()>hu&&(t.flags|=128,a=!0,Ia(l,!1),t.lanes=4194304)}else{if(!a)if(e=eu(u),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,_u(t,e),Ia(l,!0),l.tail===null&&l.tailMode==="hidden"&&!u.alternate&&!Oe)return Ze(t),null}else 2*Ye()-l.renderingStartTime>hu&&n!==536870912&&(t.flags|=128,a=!0,Ia(l,!1),t.lanes=4194304);l.isBackwards?(u.sibling=t.child,t.child=u):(e=l.last,e!==null?e.sibling=u:t.child=u,l.last=u)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ye(),e.sibling=null,n=$e.current,X($e,a?n&1|2:n&1),Oe&&dn(t,l.treeForkCount),e):(Ze(t),null);case 22:case 23:return Mt(t),is(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),n=t.updateQueue,n!==null&&_u(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&k(yl),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),mn(et),Ze(t),null;case 25:return null;case 30:return null}throw Error(r(156,t.tag))}function ay(e,t){switch(Go(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return mn(et),Me(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return It(t),null;case 31:if(t.memoizedState!==null){if(Mt(t),t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Mt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return k($e),null;case 4:return Me(),null;case 10:return mn(t.type),null;case 22:case 23:return Mt(t),is(),e!==null&&k(yl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return mn(et),null;case 25:return null;default:return null}}function Cd(e,t){switch(Go(t),t.tag){case 3:mn(et),Me();break;case 26:case 27:case 5:It(t);break;case 4:Me();break;case 31:t.memoizedState!==null&&Mt(t);break;case 13:Mt(t);break;case 19:k($e);break;case 10:mn(t.type);break;case 22:case 23:Mt(t),is(),e!==null&&k(yl);break;case 24:mn(et)}}function Fa(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var a=l.next;n=a;do{if((n.tag&e)===e){l=void 0;var u=n.create,c=n.inst;l=u(),c.destroy=l}n=n.next}while(n!==a)}}catch(d){Ue(t,t.return,d)}}function Gn(e,t,n){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var u=a.next;l=u;do{if((l.tag&e)===e){var c=l.inst,d=c.destroy;if(d!==void 0){c.destroy=void 0,a=t;var y=n,C=d;try{C()}catch(M){Ue(a,y,M)}}}l=l.next}while(l!==u)}}catch(M){Ue(t,t.return,M)}}function Od(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{pf(t,n)}catch(l){Ue(e,e.return,l)}}}function zd(e,t,n){n.props=xl(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){Ue(e,t,l)}}function Wa(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(a){Ue(e,t,a)}}function ln(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(a){Ue(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){Ue(e,t,a)}else n.current=null}function Ad(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(a){Ue(e,e.return,a)}}function Ys(e,t,n){try{var l=e.stateNode;Cy(l,e.type,n,t),l[vt]=t}catch(a){Ue(e,e.return,a)}}function Rd(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Wn(e.type)||e.tag===4}function Bs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Rd(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Wn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Ls(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=rn));else if(l!==4&&(l===27&&Wn(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Ls(e,t,n),e=e.sibling;e!==null;)Ls(e,t,n),e=e.sibling}function mu(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Wn(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(mu(e,t,n),e=e.sibling;e!==null;)mu(e,t,n),e=e.sibling}function Nd(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);mt(t,l,n),t[ct]=e,t[vt]=n}catch(u){Ue(e,e.return,u)}}var bn=!1,lt=!1,Hs=!1,jd=typeof WeakSet=="function"?WeakSet:Set,st=null;function iy(e,t){if(e=e.containerInfo,or=Uu,e=Qc(e),Mo(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var a=l.anchorOffset,u=l.focusNode;l=l.focusOffset;try{n.nodeType,u.nodeType}catch{n=null;break e}var c=0,d=-1,y=-1,C=0,M=0,Y=e,O=null;t:for(;;){for(var A;Y!==n||a!==0&&Y.nodeType!==3||(d=c+a),Y!==u||l!==0&&Y.nodeType!==3||(y=c+l),Y.nodeType===3&&(c+=Y.nodeValue.length),(A=Y.firstChild)!==null;)O=Y,Y=A;for(;;){if(Y===e)break t;if(O===n&&++C===a&&(d=c),O===u&&++M===l&&(y=c),(A=Y.nextSibling)!==null)break;Y=O,O=Y.parentNode}Y=A}n=d===-1||y===-1?null:{start:d,end:y}}else n=null}n=n||{start:0,end:0}}else n=null;for(sr={focusedElem:e,selectionRange:n},Uu=!1,st=t;st!==null;)if(t=st,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,st=e;else for(;st!==null;){switch(t=st,u=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&u!==null){e=void 0,n=t,a=u.memoizedProps,u=u.memoizedState,l=n.stateNode;try{var W=xl(n.type,a);e=l.getSnapshotBeforeUpdate(W,u),l.__reactInternalSnapshotBeforeUpdate=e}catch(oe){Ue(n,n.return,oe)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)fr(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":fr(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(r(163))}if(e=t.sibling,e!==null){e.return=t.return,st=e;break}st=t.return}}function Md(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:xn(e,n),l&4&&Fa(5,n);break;case 1:if(xn(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){Ue(n,n.return,c)}else{var a=xl(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){Ue(n,n.return,c)}}l&64&&Od(n),l&512&&Wa(n,n.return);break;case 3:if(xn(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{pf(e,t)}catch(c){Ue(n,n.return,c)}}break;case 27:t===null&&l&4&&Nd(n);case 26:case 5:xn(e,n),t===null&&l&4&&Ad(n),l&512&&Wa(n,n.return);break;case 12:xn(e,n);break;case 31:xn(e,n),l&4&&kd(e,n);break;case 13:xn(e,n),l&4&&Yd(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=my.bind(null,n),Dy(e,n))));break;case 22:if(l=n.memoizedState!==null||bn,!l){t=t!==null&&t.memoizedState!==null||lt,a=bn;var u=lt;bn=l,(lt=t)&&!u?Sn(e,n,(n.subtreeFlags&8772)!==0):xn(e,n),bn=a,lt=u}break;case 30:break;default:xn(e,n)}}function Dd(e){var t=e.alternate;t!==null&&(e.alternate=null,Dd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&yo(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ke=null,St=!1;function vn(e,t,n){for(n=n.child;n!==null;)Ud(e,t,n),n=n.sibling}function Ud(e,t,n){if(zt&&typeof zt.onCommitFiberUnmount=="function")try{zt.onCommitFiberUnmount(xa,n)}catch{}switch(n.tag){case 26:lt||ln(n,t),vn(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:lt||ln(n,t);var l=Ke,a=St;Wn(n.type)&&(Ke=n.stateNode,St=!1),vn(e,t,n),ui(n.stateNode),Ke=l,St=a;break;case 5:lt||ln(n,t);case 6:if(l=Ke,a=St,Ke=null,vn(e,t,n),Ke=l,St=a,Ke!==null)if(St)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(n.stateNode)}catch(u){Ue(n,t,u)}else try{Ke.removeChild(n.stateNode)}catch(u){Ue(n,t,u)}break;case 18:Ke!==null&&(St?(e=Ke,O_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),fa(e)):O_(Ke,n.stateNode));break;case 4:l=Ke,a=St,Ke=n.stateNode.containerInfo,St=!0,vn(e,t,n),Ke=l,St=a;break;case 0:case 11:case 14:case 15:Gn(2,n,t),lt||Gn(4,n,t),vn(e,t,n);break;case 1:lt||(ln(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&zd(n,t,l)),vn(e,t,n);break;case 21:vn(e,t,n);break;case 22:lt=(l=lt)||n.memoizedState!==null,vn(e,t,n),lt=l;break;default:vn(e,t,n)}}function kd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{fa(e)}catch(n){Ue(t,t.return,n)}}}function Yd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{fa(e)}catch(n){Ue(t,t.return,n)}}function uy(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new jd),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new jd),t;default:throw Error(r(435,e.tag))}}function gu(e,t){var n=uy(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var a=gy.bind(null,e,l);l.then(a,a)}})}function Et(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var a=n[l],u=e,c=t,d=c;e:for(;d!==null;){switch(d.tag){case 27:if(Wn(d.type)){Ke=d.stateNode,St=!1;break e}break;case 5:Ke=d.stateNode,St=!1;break e;case 3:case 4:Ke=d.stateNode.containerInfo,St=!0;break e}d=d.return}if(Ke===null)throw Error(r(160));Ud(u,c,a),Ke=null,St=!1,u=a.alternate,u!==null&&(u.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Bd(t,e),t=t.sibling}var Wt=null;function Bd(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Et(t,e),Tt(e),l&4&&(Gn(3,e,e.return),Fa(3,e),Gn(5,e,e.return));break;case 1:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&64&&bn&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var a=Wt;if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),l&4){var u=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,a=a.ownerDocument||a;t:switch(l){case"title":u=a.getElementsByTagName("title")[0],(!u||u[Ta]||u[ct]||u.namespaceURI==="http://www.w3.org/2000/svg"||u.hasAttribute("itemprop"))&&(u=a.createElement(l),a.head.insertBefore(u,a.querySelector("head > title"))),mt(u,l,n),u[ct]=e,ot(u),l=u;break e;case"link":var c=B_("link","href",a).get(l+(n.href||""));if(c){for(var d=0;d<c.length;d++)if(u=c[d],u.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&u.getAttribute("rel")===(n.rel==null?null:n.rel)&&u.getAttribute("title")===(n.title==null?null:n.title)&&u.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){c.splice(d,1);break t}}u=a.createElement(l),mt(u,l,n),a.head.appendChild(u);break;case"meta":if(c=B_("meta","content",a).get(l+(n.content||""))){for(d=0;d<c.length;d++)if(u=c[d],u.getAttribute("content")===(n.content==null?null:""+n.content)&&u.getAttribute("name")===(n.name==null?null:n.name)&&u.getAttribute("property")===(n.property==null?null:n.property)&&u.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&u.getAttribute("charset")===(n.charSet==null?null:n.charSet)){c.splice(d,1);break t}}u=a.createElement(l),mt(u,l,n),a.head.appendChild(u);break;default:throw Error(r(468,l))}u[ct]=e,ot(u),l=u}e.stateNode=l}else L_(a,e.type,e.stateNode);else e.stateNode=Y_(a,l,e.memoizedProps);else u!==l?(u===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):u.count--,l===null?L_(a,e.type,e.stateNode):Y_(a,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Ys(e,e.memoizedProps,n.memoizedProps)}break;case 27:Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),n!==null&&l&4&&Ys(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Et(t,e),Tt(e),l&512&&(lt||n===null||ln(n,n.return)),e.flags&32){a=e.stateNode;try{Dl(a,"")}catch(W){Ue(e,e.return,W)}}l&4&&e.stateNode!=null&&(a=e.memoizedProps,Ys(e,a,n!==null?n.memoizedProps:a)),l&1024&&(Hs=!0);break;case 6:if(Et(t,e),Tt(e),l&4){if(e.stateNode===null)throw Error(r(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(W){Ue(e,e.return,W)}}break;case 3:if(Nu=null,a=Wt,Wt=Au(t.containerInfo),Et(t,e),Wt=a,Tt(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{fa(t.containerInfo)}catch(W){Ue(e,e.return,W)}Hs&&(Hs=!1,Ld(e));break;case 4:l=Wt,Wt=Au(e.stateNode.containerInfo),Et(t,e),Tt(e),Wt=l;break;case 12:Et(t,e),Tt(e);break;case 31:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,gu(e,l)));break;case 13:Et(t,e),Tt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(pu=Ye()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,gu(e,l)));break;case 22:a=e.memoizedState!==null;var y=n!==null&&n.memoizedState!==null,C=bn,M=lt;if(bn=C||a,lt=M||y,Et(t,e),lt=M,bn=C,Tt(e),l&8192)e:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||y||bn||lt||Sl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){y=n=t;try{if(u=y.stateNode,a)c=u.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none";else{d=y.stateNode;var Y=y.memoizedProps.style,O=Y!=null&&Y.hasOwnProperty("display")?Y.display:null;d.style.display=O==null||typeof O=="boolean"?"":(""+O).trim()}}catch(W){Ue(y,y.return,W)}}}else if(t.tag===6){if(n===null){y=t;try{y.stateNode.nodeValue=a?"":y.memoizedProps}catch(W){Ue(y,y.return,W)}}}else if(t.tag===18){if(n===null){y=t;try{var A=y.stateNode;a?z_(A,!0):z_(y.stateNode,!1)}catch(W){Ue(y,y.return,W)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,gu(e,n))));break;case 19:Et(t,e),Tt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,gu(e,l)));break;case 30:break;case 21:break;default:Et(t,e),Tt(e)}}function Tt(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(Rd(l)){n=l;break}l=l.return}if(n==null)throw Error(r(160));switch(n.tag){case 27:var a=n.stateNode,u=Bs(e);mu(e,u,a);break;case 5:var c=n.stateNode;n.flags&32&&(Dl(c,""),n.flags&=-33);var d=Bs(e);mu(e,d,c);break;case 3:case 4:var y=n.stateNode.containerInfo,C=Bs(e);Ls(e,C,y);break;default:throw Error(r(161))}}catch(M){Ue(e,e.return,M)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Ld(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Ld(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function xn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Md(e,t.alternate,t),t=t.sibling}function Sl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gn(4,t,t.return),Sl(t);break;case 1:ln(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&zd(t,t.return,n),Sl(t);break;case 27:ui(t.stateNode);case 26:case 5:ln(t,t.return),Sl(t);break;case 22:t.memoizedState===null&&Sl(t);break;case 30:Sl(t);break;default:Sl(t)}e=e.sibling}}function Sn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,a=e,u=t,c=u.flags;switch(u.tag){case 0:case 11:case 15:Sn(a,u,n),Fa(4,u);break;case 1:if(Sn(a,u,n),l=u,a=l.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(C){Ue(l,l.return,C)}if(l=u,a=l.updateQueue,a!==null){var d=l.stateNode;try{var y=a.shared.hiddenCallbacks;if(y!==null)for(a.shared.hiddenCallbacks=null,a=0;a<y.length;a++)yf(y[a],d)}catch(C){Ue(l,l.return,C)}}n&&c&64&&Od(u),Wa(u,u.return);break;case 27:Nd(u);case 26:case 5:Sn(a,u,n),n&&l===null&&c&4&&Ad(u),Wa(u,u.return);break;case 12:Sn(a,u,n);break;case 31:Sn(a,u,n),n&&c&4&&kd(a,u);break;case 13:Sn(a,u,n),n&&c&4&&Yd(a,u);break;case 22:u.memoizedState===null&&Sn(a,u,n),Wa(u,u.return);break;case 30:break;default:Sn(a,u,n)}t=t.sibling}}function Xs(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&Ya(n))}function qs(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ya(e))}function $t(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Hd(e,t,n,l),t=t.sibling}function Hd(e,t,n,l){var a=t.flags;switch(t.tag){case 0:case 11:case 15:$t(e,t,n,l),a&2048&&Fa(9,t);break;case 1:$t(e,t,n,l);break;case 3:$t(e,t,n,l),a&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&Ya(e)));break;case 12:if(a&2048){$t(e,t,n,l),e=t.stateNode;try{var u=t.memoizedProps,c=u.id,d=u.onPostCommit;typeof d=="function"&&d(c,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(y){Ue(t,t.return,y)}}else $t(e,t,n,l);break;case 31:$t(e,t,n,l);break;case 13:$t(e,t,n,l);break;case 23:break;case 22:u=t.stateNode,c=t.alternate,t.memoizedState!==null?u._visibility&2?$t(e,t,n,l):$a(e,t):u._visibility&2?$t(e,t,n,l):(u._visibility|=2,ea(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),a&2048&&Xs(c,t);break;case 24:$t(e,t,n,l),a&2048&&qs(t.alternate,t);break;default:$t(e,t,n,l)}}function ea(e,t,n,l,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var u=e,c=t,d=n,y=l,C=c.flags;switch(c.tag){case 0:case 11:case 15:ea(u,c,d,y,a),Fa(8,c);break;case 23:break;case 22:var M=c.stateNode;c.memoizedState!==null?M._visibility&2?ea(u,c,d,y,a):$a(u,c):(M._visibility|=2,ea(u,c,d,y,a)),a&&C&2048&&Xs(c.alternate,c);break;case 24:ea(u,c,d,y,a),a&&C&2048&&qs(c.alternate,c);break;default:ea(u,c,d,y,a)}t=t.sibling}}function $a(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,a=l.flags;switch(l.tag){case 22:$a(n,l),a&2048&&Xs(l.alternate,l);break;case 24:$a(n,l),a&2048&&qs(l.alternate,l);break;default:$a(n,l)}t=t.sibling}}var Pa=8192;function ta(e,t,n){if(e.subtreeFlags&Pa)for(e=e.child;e!==null;)Xd(e,t,n),e=e.sibling}function Xd(e,t,n){switch(e.tag){case 26:ta(e,t,n),e.flags&Pa&&e.memoizedState!==null&&Zy(n,Wt,e.memoizedState,e.memoizedProps);break;case 5:ta(e,t,n);break;case 3:case 4:var l=Wt;Wt=Au(e.stateNode.containerInfo),ta(e,t,n),Wt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=Pa,Pa=16777216,ta(e,t,n),Pa=l):ta(e,t,n));break;default:ta(e,t,n)}}function qd(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ei(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];st=l,Gd(l,e)}qd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Qd(e),e=e.sibling}function Qd(e){switch(e.tag){case 0:case 11:case 15:ei(e),e.flags&2048&&Gn(9,e,e.return);break;case 3:ei(e);break;case 12:ei(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,yu(e)):ei(e);break;default:ei(e)}}function yu(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];st=l,Gd(l,e)}qd(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gn(8,t,t.return),yu(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,yu(t));break;default:yu(t)}e=e.sibling}}function Gd(e,t){for(;st!==null;){var n=st;switch(n.tag){case 0:case 11:case 15:Gn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:Ya(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,st=l;else e:for(n=e;st!==null;){l=st;var a=l.sibling,u=l.return;if(Dd(l),l===n){st=null;break e}if(a!==null){a.return=u,st=a;break e}st=u}}}var oy={getCacheForType:function(e){var t=dt(et),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return dt(et).controller.signal}},sy=typeof WeakMap=="function"?WeakMap:Map,Ne=0,qe=null,xe=null,Te=0,De=0,Dt=null,Vn=!1,na=!1,Qs=!1,En=0,Fe=0,Zn=0,El=0,Gs=0,Ut=0,la=0,ti=null,wt=null,Vs=!1,pu=0,Vd=0,hu=1/0,bu=null,Kn=null,ut=0,Jn=null,aa=null,Tn=0,Zs=0,Ks=null,Zd=null,ni=0,Js=null;function kt(){return(Ne&2)!==0&&Te!==0?Te&-Te:N.T!==null?er():oc()}function Kd(){if(Ut===0)if((Te&536870912)===0||Oe){var e=Oi;Oi<<=1,(Oi&3932160)===0&&(Oi=262144),Ut=e}else Ut=536870912;return e=jt.current,e!==null&&(e.flags|=32),Ut}function Ct(e,t,n){(e===qe&&(De===2||De===9)||e.cancelPendingCommit!==null)&&(ia(e,0),In(e,Te,Ut,!1)),Ea(e,n),((Ne&2)===0||e!==qe)&&(e===qe&&((Ne&2)===0&&(El|=n),Fe===4&&In(e,Te,Ut,!1)),an(e))}function Jd(e,t,n){if((Ne&6)!==0)throw Error(r(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Sa(e,t),a=l?fy(e,t):Fs(e,t,!0),u=l;do{if(a===0){na&&!l&&In(e,t,0,!1);break}else{if(n=e.current.alternate,u&&!ry(n)){a=Fs(e,t,!1),u=!1;continue}if(a===2){if(u=t,e.errorRecoveryDisabledLanes&u)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var d=e;a=ti;var y=d.current.memoizedState.isDehydrated;if(y&&(ia(d,c).flags|=256),c=Fs(d,c,!1),c!==2){if(Qs&&!y){d.errorRecoveryDisabledLanes|=u,El|=u,a=4;break e}u=wt,wt=a,u!==null&&(wt===null?wt=u:wt.push.apply(wt,u))}a=c}if(u=!1,a!==2)continue}}if(a===1){ia(e,0),In(e,t,0,!0);break}e:{switch(l=e,u=a,u){case 0:case 1:throw Error(r(345));case 4:if((t&4194048)!==t)break;case 6:In(l,t,Ut,!Vn);break e;case 2:wt=null;break;case 3:case 5:break;default:throw Error(r(329))}if((t&62914560)===t&&(a=pu+300-Ye(),10<a)){if(In(l,t,Ut,!Vn),Ai(l,0,!0)!==0)break e;Tn=t,l.timeoutHandle=w_(Id.bind(null,l,n,wt,bu,Vs,t,Ut,El,la,Vn,u,"Throttled",-0,0),a);break e}Id(l,n,wt,bu,Vs,t,Ut,El,la,Vn,u,null,-0,0)}}break}while(!0);an(e)}function Id(e,t,n,l,a,u,c,d,y,C,M,Y,O,A){if(e.timeoutHandle=-1,Y=t.subtreeFlags,Y&8192||(Y&16785408)===16785408){Y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:rn},Xd(t,u,Y);var W=(u&62914560)===u?pu-Ye():(u&4194048)===u?Vd-Ye():0;if(W=Ky(Y,W),W!==null){Tn=u,e.cancelPendingCommit=W(l_.bind(null,e,t,u,n,l,a,c,d,y,M,Y,null,O,A)),In(e,u,c,!C);return}}l_(e,t,u,n,l,a,c,d,y)}function ry(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var a=n[l],u=a.getSnapshot;a=a.value;try{if(!Rt(u(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function In(e,t,n,l){t&=~Gs,t&=~El,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var a=t;0<a;){var u=31-At(a),c=1<<u;l[u]=-1,a&=~c}n!==0&&ac(e,n,t)}function vu(){return(Ne&6)===0?(li(0),!1):!0}function Is(){if(xe!==null){if(De===0)var e=xe.return;else e=xe,_n=ml=null,fs(e),Il=null,La=0,e=xe;for(;e!==null;)Cd(e.alternate,e),e=e.return;xe=null}}function ia(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Ay(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),Tn=0,Is(),qe=e,xe=n=fn(e.current,null),Te=t,De=0,Dt=null,Vn=!1,na=Sa(e,t),Qs=!1,la=Ut=Gs=El=Zn=Fe=0,wt=ti=null,Vs=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var a=31-At(l),u=1<<a;t|=e[a],l&=~u}return En=t,Xi(),n}function Fd(e,t){ye=null,N.H=Ka,t===Jl||t===Ii?(t=df(),De=3):t===Po?(t=df(),De=4):De=t===Os?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Dt=t,xe===null&&(Fe=1,ru(e,Xt(t,e.current)))}function Wd(){var e=jt.current;return e===null?!0:(Te&4194048)===Te?Vt===null:(Te&62914560)===Te||(Te&536870912)!==0?e===Vt:!1}function $d(){var e=N.H;return N.H=Ka,e===null?Ka:e}function Pd(){var e=N.A;return N.A=oy,e}function xu(){Fe=4,Vn||(Te&4194048)!==Te&&jt.current!==null||(na=!0),(Zn&134217727)===0&&(El&134217727)===0||qe===null||In(qe,Te,Ut,!1)}function Fs(e,t,n){var l=Ne;Ne|=2;var a=$d(),u=Pd();(qe!==e||Te!==t)&&(bu=null,ia(e,t)),t=!1;var c=Fe;e:do try{if(De!==0&&xe!==null){var d=xe,y=Dt;switch(De){case 8:Is(),c=6;break e;case 3:case 2:case 9:case 6:jt.current===null&&(t=!0);var C=De;if(De=0,Dt=null,ua(e,d,y,C),n&&na){c=0;break e}break;default:C=De,De=0,Dt=null,ua(e,d,y,C)}}cy(),c=Fe;break}catch(M){Fd(e,M)}while(!0);return t&&e.shellSuspendCounter++,_n=ml=null,Ne=l,N.H=a,N.A=u,xe===null&&(qe=null,Te=0,Xi()),c}function cy(){for(;xe!==null;)e_(xe)}function fy(e,t){var n=Ne;Ne|=2;var l=$d(),a=Pd();qe!==e||Te!==t?(bu=null,hu=Ye()+500,ia(e,t)):na=Sa(e,t);e:do try{if(De!==0&&xe!==null){t=xe;var u=Dt;t:switch(De){case 1:De=0,Dt=null,ua(e,t,u,1);break;case 2:case 9:if(cf(u)){De=0,Dt=null,t_(t);break}t=function(){De!==2&&De!==9||qe!==e||(De=7),an(e)},u.then(t,t);break e;case 3:De=7;break e;case 4:De=5;break e;case 7:cf(u)?(De=0,Dt=null,t_(t)):(De=0,Dt=null,ua(e,t,u,7));break;case 5:var c=null;switch(xe.tag){case 26:c=xe.memoizedState;case 5:case 27:var d=xe;if(c?H_(c):d.stateNode.complete){De=0,Dt=null;var y=d.sibling;if(y!==null)xe=y;else{var C=d.return;C!==null?(xe=C,Su(C)):xe=null}break t}}De=0,Dt=null,ua(e,t,u,5);break;case 6:De=0,Dt=null,ua(e,t,u,6);break;case 8:Is(),Fe=6;break e;default:throw Error(r(462))}}dy();break}catch(M){Fd(e,M)}while(!0);return _n=ml=null,N.H=l,N.A=a,Ne=n,xe!==null?0:(qe=null,Te=0,Xi(),Fe)}function dy(){for(;xe!==null&&!fe();)e_(xe)}function e_(e){var t=Td(e.alternate,e,En);e.memoizedProps=e.pendingProps,t===null?Su(e):xe=t}function t_(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=hd(n,t,t.pendingProps,t.type,void 0,Te);break;case 11:t=hd(n,t,t.pendingProps,t.type.render,t.ref,Te);break;case 5:fs(t);default:Cd(n,t),t=xe=$c(t,En),t=Td(n,t,En)}e.memoizedProps=e.pendingProps,t===null?Su(e):xe=t}function ua(e,t,n,l){_n=ml=null,fs(t),Il=null,La=0;var a=t.return;try{if(ey(e,a,t,n,Te)){Fe=1,ru(e,Xt(n,e.current)),xe=null;return}}catch(u){if(a!==null)throw xe=a,u;Fe=1,ru(e,Xt(n,e.current)),xe=null;return}t.flags&32768?(Oe||l===1?e=!0:na||(Te&536870912)!==0?e=!1:(Vn=e=!0,(l===2||l===9||l===3||l===6)&&(l=jt.current,l!==null&&l.tag===13&&(l.flags|=16384))),n_(t,e)):Su(t)}function Su(e){var t=e;do{if((t.flags&32768)!==0){n_(t,Vn);return}e=t.return;var n=ly(t.alternate,t,En);if(n!==null){xe=n;return}if(t=t.sibling,t!==null){xe=t;return}xe=t=e}while(t!==null);Fe===0&&(Fe=5)}function n_(e,t){do{var n=ay(e.alternate,e);if(n!==null){n.flags&=32767,xe=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){xe=e;return}xe=e=n}while(e!==null);Fe=6,xe=null}function l_(e,t,n,l,a,u,c,d,y){e.cancelPendingCommit=null;do Eu();while(ut!==0);if((Ne&6)!==0)throw Error(r(327));if(t!==null){if(t===e.current)throw Error(r(177));if(u=t.lanes|t.childLanes,u|=Bo,V0(e,n,u,c,d,y),e===qe&&(xe=qe=null,Te=0),aa=t,Jn=e,Tn=n,Zs=u,Ks=a,Zd=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,yy(Rn,function(){return s_(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=N.T,N.T=null,a=q.p,q.p=2,c=Ne,Ne|=4;try{iy(e,t,n)}finally{Ne=c,q.p=a,N.T=l}}ut=1,a_(),i_(),u_()}}function a_(){if(ut===1){ut=0;var e=Jn,t=aa,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=N.T,N.T=null;var l=q.p;q.p=2;var a=Ne;Ne|=4;try{Bd(t,e);var u=sr,c=Qc(e.containerInfo),d=u.focusedElem,y=u.selectionRange;if(c!==d&&d&&d.ownerDocument&&qc(d.ownerDocument.documentElement,d)){if(y!==null&&Mo(d)){var C=y.start,M=y.end;if(M===void 0&&(M=C),"selectionStart"in d)d.selectionStart=C,d.selectionEnd=Math.min(M,d.value.length);else{var Y=d.ownerDocument||document,O=Y&&Y.defaultView||window;if(O.getSelection){var A=O.getSelection(),W=d.textContent.length,oe=Math.min(y.start,W),He=y.end===void 0?oe:Math.min(y.end,W);!A.extend&&oe>He&&(c=He,He=oe,oe=c);var S=Xc(d,oe),v=Xc(d,He);if(S&&v&&(A.rangeCount!==1||A.anchorNode!==S.node||A.anchorOffset!==S.offset||A.focusNode!==v.node||A.focusOffset!==v.offset)){var w=Y.createRange();w.setStart(S.node,S.offset),A.removeAllRanges(),oe>He?(A.addRange(w),A.extend(v.node,v.offset)):(w.setEnd(v.node,v.offset),A.addRange(w))}}}}for(Y=[],A=d;A=A.parentNode;)A.nodeType===1&&Y.push({element:A,left:A.scrollLeft,top:A.scrollTop});for(typeof d.focus=="function"&&d.focus(),d=0;d<Y.length;d++){var U=Y[d];U.element.scrollLeft=U.left,U.element.scrollTop=U.top}}Uu=!!or,sr=or=null}finally{Ne=a,q.p=l,N.T=n}}e.current=t,ut=2}}function i_(){if(ut===2){ut=0;var e=Jn,t=aa,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=N.T,N.T=null;var l=q.p;q.p=2;var a=Ne;Ne|=4;try{Md(e,t.alternate,t)}finally{Ne=a,q.p=l,N.T=n}}ut=3}}function u_(){if(ut===4||ut===3){ut=0,pt();var e=Jn,t=aa,n=Tn,l=Zd;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ut=5:(ut=0,aa=Jn=null,o_(e,e.pendingLanes));var a=e.pendingLanes;if(a===0&&(Kn=null),mo(n),t=t.stateNode,zt&&typeof zt.onCommitFiberRoot=="function")try{zt.onCommitFiberRoot(xa,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=N.T,a=q.p,q.p=2,N.T=null;try{for(var u=e.onRecoverableError,c=0;c<l.length;c++){var d=l[c];u(d.value,{componentStack:d.stack})}}finally{N.T=t,q.p=a}}(Tn&3)!==0&&Eu(),an(e),a=e.pendingLanes,(n&261930)!==0&&(a&42)!==0?e===Js?ni++:(ni=0,Js=e):ni=0,li(0)}}function o_(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,Ya(t)))}function Eu(){return a_(),i_(),u_(),s_()}function s_(){if(ut!==5)return!1;var e=Jn,t=Zs;Zs=0;var n=mo(Tn),l=N.T,a=q.p;try{q.p=32>n?32:n,N.T=null,n=Ks,Ks=null;var u=Jn,c=Tn;if(ut=0,aa=Jn=null,Tn=0,(Ne&6)!==0)throw Error(r(331));var d=Ne;if(Ne|=4,Qd(u.current),Hd(u,u.current,c,n),Ne=d,li(0,!1),zt&&typeof zt.onPostCommitFiberRoot=="function")try{zt.onPostCommitFiberRoot(xa,u)}catch{}return!0}finally{q.p=a,N.T=l,o_(e,t)}}function r_(e,t,n){t=Xt(n,t),t=Cs(e.stateNode,t,2),e=Xn(e,t,2),e!==null&&(Ea(e,2),an(e))}function Ue(e,t,n){if(e.tag===3)r_(e,e,n);else for(;t!==null;){if(t.tag===3){r_(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Kn===null||!Kn.has(l))){e=Xt(n,e),n=cd(2),l=Xn(t,n,2),l!==null&&(fd(n,l,t,e),Ea(l,2),an(l));break}}t=t.return}}function Ws(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new sy;var a=new Set;l.set(t,a)}else a=l.get(t),a===void 0&&(a=new Set,l.set(t,a));a.has(n)||(Qs=!0,a.add(n),e=_y.bind(null,e,t,n),t.then(e,e))}function _y(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,qe===e&&(Te&n)===n&&(Fe===4||Fe===3&&(Te&62914560)===Te&&300>Ye()-pu?(Ne&2)===0&&ia(e,0):Gs|=n,la===Te&&(la=0)),an(e)}function c_(e,t){t===0&&(t=lc()),e=fl(e,t),e!==null&&(Ea(e,t),an(e))}function my(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),c_(e,n)}function gy(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(r(314))}l!==null&&l.delete(t),c_(e,n)}function yy(e,t){return Ge(e,t)}var Tu=null,oa=null,$s=!1,wu=!1,Ps=!1,Fn=0;function an(e){e!==oa&&e.next===null&&(oa===null?Tu=oa=e:oa=oa.next=e),wu=!0,$s||($s=!0,hy())}function li(e,t){if(!Ps&&wu){Ps=!0;do for(var n=!1,l=Tu;l!==null;){if(e!==0){var a=l.pendingLanes;if(a===0)var u=0;else{var c=l.suspendedLanes,d=l.pingedLanes;u=(1<<31-At(42|e)+1)-1,u&=a&~(c&~d),u=u&201326741?u&201326741|1:u?u|2:0}u!==0&&(n=!0,m_(l,u))}else u=Te,u=Ai(l,l===qe?u:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(u&3)===0||Sa(l,u)||(n=!0,m_(l,u));l=l.next}while(n);Ps=!1}}function py(){f_()}function f_(){wu=$s=!1;var e=0;Fn!==0&&zy()&&(e=Fn);for(var t=Ye(),n=null,l=Tu;l!==null;){var a=l.next,u=d_(l,t);u===0?(l.next=null,n===null?Tu=a:n.next=a,a===null&&(oa=n)):(n=l,(e!==0||(u&3)!==0)&&(wu=!0)),l=a}ut!==0&&ut!==5||li(e),Fn!==0&&(Fn=0)}function d_(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,a=e.expirationTimes,u=e.pendingLanes&-62914561;0<u;){var c=31-At(u),d=1<<c,y=a[c];y===-1?((d&n)===0||(d&l)!==0)&&(a[c]=G0(d,t)):y<=t&&(e.expiredLanes|=d),u&=~d}if(t=qe,n=Te,n=Ai(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(De===2||De===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&_e(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Sa(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&_e(l),mo(n)){case 2:case 8:n=Cl;break;case 32:n=Rn;break;case 268435456:n=Nn;break;default:n=Rn}return l=__.bind(null,e),n=Ge(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&_e(l),e.callbackPriority=2,e.callbackNode=null,2}function __(e,t){if(ut!==0&&ut!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Eu()&&e.callbackNode!==n)return null;var l=Te;return l=Ai(e,e===qe?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(Jd(e,l,t),d_(e,Ye()),e.callbackNode!=null&&e.callbackNode===n?__.bind(null,e):null)}function m_(e,t){if(Eu())return null;Jd(e,t,!0)}function hy(){Ry(function(){(Ne&6)!==0?Ge(il,py):f_()})}function er(){if(Fn===0){var e=Zl;e===0&&(e=Ci,Ci<<=1,(Ci&261888)===0&&(Ci=256)),Fn=e}return Fn}function g_(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Mi(""+e)}function y_(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function by(e,t,n,l,a){if(t==="submit"&&n&&n.stateNode===a){var u=g_((a[vt]||null).action),c=l.submitter;c&&(t=(t=c[vt]||null)?g_(t.formAction):c.getAttribute("formAction"),t!==null&&(u=t,c=null));var d=new Yi("action","action",null,l,a);e.push({event:d,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Fn!==0){var y=c?y_(a,c):new FormData(a);vs(n,{pending:!0,data:y,method:a.method,action:u},null,y)}}else typeof u=="function"&&(d.preventDefault(),y=c?y_(a,c):new FormData(a),vs(n,{pending:!0,data:y,method:a.method,action:u},u,y))},currentTarget:a}]})}}for(var tr=0;tr<Yo.length;tr++){var nr=Yo[tr],vy=nr.toLowerCase(),xy=nr[0].toUpperCase()+nr.slice(1);Ft(vy,"on"+xy)}Ft(Zc,"onAnimationEnd"),Ft(Kc,"onAnimationIteration"),Ft(Jc,"onAnimationStart"),Ft("dblclick","onDoubleClick"),Ft("focusin","onFocus"),Ft("focusout","onBlur"),Ft(Yg,"onTransitionRun"),Ft(Bg,"onTransitionStart"),Ft(Lg,"onTransitionCancel"),Ft(Ic,"onTransitionEnd"),jl("onMouseEnter",["mouseout","mouseover"]),jl("onMouseLeave",["mouseout","mouseover"]),jl("onPointerEnter",["pointerout","pointerover"]),jl("onPointerLeave",["pointerout","pointerover"]),ol("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ol("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ol("onBeforeInput",["compositionend","keypress","textInput","paste"]),ol("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ol("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ol("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ai="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Sy=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ai));function p_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],a=l.event;l=l.listeners;e:{var u=void 0;if(t)for(var c=l.length-1;0<=c;c--){var d=l[c],y=d.instance,C=d.currentTarget;if(d=d.listener,y!==u&&a.isPropagationStopped())break e;u=d,a.currentTarget=C;try{u(a)}catch(M){Hi(M)}a.currentTarget=null,u=y}else for(c=0;c<l.length;c++){if(d=l[c],y=d.instance,C=d.currentTarget,d=d.listener,y!==u&&a.isPropagationStopped())break e;u=d,a.currentTarget=C;try{u(a)}catch(M){Hi(M)}a.currentTarget=null,u=y}}}}function Se(e,t){var n=t[go];n===void 0&&(n=t[go]=new Set);var l=e+"__bubble";n.has(l)||(h_(t,e,2,!1),n.add(l))}function lr(e,t,n){var l=0;t&&(l|=4),h_(n,e,l,t)}var Cu="_reactListening"+Math.random().toString(36).slice(2);function ar(e){if(!e[Cu]){e[Cu]=!0,cc.forEach(function(n){n!=="selectionchange"&&(Sy.has(n)||lr(n,!1,e),lr(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Cu]||(t[Cu]=!0,lr("selectionchange",!1,t))}}function h_(e,t,n,l){switch(K_(t)){case 2:var a=Fy;break;case 8:a=Wy;break;default:a=br}n=a.bind(null,t,n,e),a=void 0,!To||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),l?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function ir(e,t,n,l,a){var u=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var c=l.tag;if(c===3||c===4){var d=l.stateNode.containerInfo;if(d===a)break;if(c===4)for(c=l.return;c!==null;){var y=c.tag;if((y===3||y===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;d!==null;){if(c=Al(d),c===null)return;if(y=c.tag,y===5||y===6||y===26||y===27){l=u=c;continue e}d=d.parentNode}}l=l.return}Sc(function(){var C=u,M=So(n),Y=[];e:{var O=Fc.get(e);if(O!==void 0){var A=Yi,W=e;switch(e){case"keypress":if(Ui(n)===0)break e;case"keydown":case"keyup":A=gg;break;case"focusin":W="focus",A=zo;break;case"focusout":W="blur",A=zo;break;case"beforeblur":case"afterblur":A=zo;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":A=wc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":A=lg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":A=hg;break;case Zc:case Kc:case Jc:A=ug;break;case Ic:A=vg;break;case"scroll":case"scrollend":A=tg;break;case"wheel":A=Sg;break;case"copy":case"cut":case"paste":A=sg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":A=Oc;break;case"toggle":case"beforetoggle":A=Tg}var oe=(t&4)!==0,He=!oe&&(e==="scroll"||e==="scrollend"),S=oe?O!==null?O+"Capture":null:O;oe=[];for(var v=C,w;v!==null;){var U=v;if(w=U.stateNode,U=U.tag,U!==5&&U!==26&&U!==27||w===null||S===null||(U=Ca(v,S),U!=null&&oe.push(ii(v,U,w))),He)break;v=v.return}0<oe.length&&(O=new A(O,W,null,n,M),Y.push({event:O,listeners:oe}))}}if((t&7)===0){e:{if(O=e==="mouseover"||e==="pointerover",A=e==="mouseout"||e==="pointerout",O&&n!==xo&&(W=n.relatedTarget||n.fromElement)&&(Al(W)||W[zl]))break e;if((A||O)&&(O=M.window===M?M:(O=M.ownerDocument)?O.defaultView||O.parentWindow:window,A?(W=n.relatedTarget||n.toElement,A=C,W=W?Al(W):null,W!==null&&(He=_(W),oe=W.tag,W!==He||oe!==5&&oe!==27&&oe!==6)&&(W=null)):(A=null,W=C),A!==W)){if(oe=wc,U="onMouseLeave",S="onMouseEnter",v="mouse",(e==="pointerout"||e==="pointerover")&&(oe=Oc,U="onPointerLeave",S="onPointerEnter",v="pointer"),He=A==null?O:wa(A),w=W==null?O:wa(W),O=new oe(U,v+"leave",A,n,M),O.target=He,O.relatedTarget=w,U=null,Al(M)===C&&(oe=new oe(S,v+"enter",W,n,M),oe.target=w,oe.relatedTarget=He,U=oe),He=U,A&&W)t:{for(oe=Ey,S=A,v=W,w=0,U=S;U;U=oe(U))w++;U=0;for(var ie=v;ie;ie=oe(ie))U++;for(;0<w-U;)S=oe(S),w--;for(;0<U-w;)v=oe(v),U--;for(;w--;){if(S===v||v!==null&&S===v.alternate){oe=S;break t}S=oe(S),v=oe(v)}oe=null}else oe=null;A!==null&&b_(Y,O,A,oe,!1),W!==null&&He!==null&&b_(Y,He,W,oe,!0)}}e:{if(O=C?wa(C):window,A=O.nodeName&&O.nodeName.toLowerCase(),A==="select"||A==="input"&&O.type==="file")var Ae=Uc;else if(Mc(O))if(kc)Ae=Dg;else{Ae=jg;var P=Ng}else A=O.nodeName,!A||A.toLowerCase()!=="input"||O.type!=="checkbox"&&O.type!=="radio"?C&&vo(C.elementType)&&(Ae=Uc):Ae=Mg;if(Ae&&(Ae=Ae(e,C))){Dc(Y,Ae,n,M);break e}P&&P(e,O,C),e==="focusout"&&C&&O.type==="number"&&C.memoizedProps.value!=null&&bo(O,"number",O.value)}switch(P=C?wa(C):window,e){case"focusin":(Mc(P)||P.contentEditable==="true")&&(Bl=P,Do=C,Da=null);break;case"focusout":Da=Do=Bl=null;break;case"mousedown":Uo=!0;break;case"contextmenu":case"mouseup":case"dragend":Uo=!1,Gc(Y,n,M);break;case"selectionchange":if(kg)break;case"keydown":case"keyup":Gc(Y,n,M)}var he;if(Ro)e:{switch(e){case"compositionstart":var we="onCompositionStart";break e;case"compositionend":we="onCompositionEnd";break e;case"compositionupdate":we="onCompositionUpdate";break e}we=void 0}else Yl?Nc(e,n)&&(we="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(we="onCompositionStart");we&&(zc&&n.locale!=="ko"&&(Yl||we!=="onCompositionStart"?we==="onCompositionEnd"&&Yl&&(he=Ec()):(Dn=M,wo="value"in Dn?Dn.value:Dn.textContent,Yl=!0)),P=Ou(C,we),0<P.length&&(we=new Cc(we,e,null,n,M),Y.push({event:we,listeners:P}),he?we.data=he:(he=jc(n),he!==null&&(we.data=he)))),(he=Cg?Og(e,n):zg(e,n))&&(we=Ou(C,"onBeforeInput"),0<we.length&&(P=new Cc("onBeforeInput","beforeinput",null,n,M),Y.push({event:P,listeners:we}),P.data=he)),by(Y,e,C,n,M)}p_(Y,t)})}function ii(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ou(e,t){for(var n=t+"Capture",l=[];e!==null;){var a=e,u=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||u===null||(a=Ca(e,n),a!=null&&l.unshift(ii(e,a,u)),a=Ca(e,t),a!=null&&l.push(ii(e,a,u))),e.tag===3)return l;e=e.return}return[]}function Ey(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function b_(e,t,n,l,a){for(var u=t._reactName,c=[];n!==null&&n!==l;){var d=n,y=d.alternate,C=d.stateNode;if(d=d.tag,y!==null&&y===l)break;d!==5&&d!==26&&d!==27||C===null||(y=C,a?(C=Ca(n,u),C!=null&&c.unshift(ii(n,C,y))):a||(C=Ca(n,u),C!=null&&c.push(ii(n,C,y)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var Ty=/\r\n?/g,wy=/\u0000|\uFFFD/g;function v_(e){return(typeof e=="string"?e:""+e).replace(Ty,`
`).replace(wy,"")}function x_(e,t){return t=v_(t),v_(e)===t}function Le(e,t,n,l,a,u){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&Dl(e,""+l);break;case"className":Ni(e,"class",l);break;case"tabIndex":Ni(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":Ni(e,n,l);break;case"style":vc(e,l,u);break;case"data":if(t!=="object"){Ni(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Mi(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof u=="function"&&(n==="formAction"?(t!=="input"&&Le(e,t,"name",a.name,a,null),Le(e,t,"formEncType",a.formEncType,a,null),Le(e,t,"formMethod",a.formMethod,a,null),Le(e,t,"formTarget",a.formTarget,a,null)):(Le(e,t,"encType",a.encType,a,null),Le(e,t,"method",a.method,a,null),Le(e,t,"target",a.target,a,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Mi(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=rn);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=Mi(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":Se("beforetoggle",e),Se("toggle",e),Ri(e,"popover",l);break;case"xlinkActuate":sn(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":sn(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":sn(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":sn(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":sn(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":sn(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":sn(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":sn(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":sn(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Ri(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=P0.get(n)||n,Ri(e,n,l))}}function ur(e,t,n,l,a,u){switch(n){case"style":vc(e,l,u);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"children":typeof l=="string"?Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&Dl(e,""+l);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"onClick":l!=null&&(e.onclick=rn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!fc.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),t=n.slice(2,a?n.length-7:void 0),u=e[vt]||null,u=u!=null?u[n]:null,typeof u=="function"&&e.removeEventListener(t,u,a),typeof l=="function")){typeof u!="function"&&u!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,a);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Ri(e,n,l)}}}function mt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",e),Se("load",e);var l=!1,a=!1,u;for(u in n)if(n.hasOwnProperty(u)){var c=n[u];if(c!=null)switch(u){case"src":l=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Le(e,t,u,c,n,null)}}a&&Le(e,t,"srcSet",n.srcSet,n,null),l&&Le(e,t,"src",n.src,n,null);return;case"input":Se("invalid",e);var d=u=c=a=null,y=null,C=null;for(l in n)if(n.hasOwnProperty(l)){var M=n[l];if(M!=null)switch(l){case"name":a=M;break;case"type":c=M;break;case"checked":y=M;break;case"defaultChecked":C=M;break;case"value":u=M;break;case"defaultValue":d=M;break;case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(r(137,t));break;default:Le(e,t,l,M,n,null)}}yc(e,u,d,y,C,c,a,!1);return;case"select":Se("invalid",e),l=c=u=null;for(a in n)if(n.hasOwnProperty(a)&&(d=n[a],d!=null))switch(a){case"value":u=d;break;case"defaultValue":c=d;break;case"multiple":l=d;default:Le(e,t,a,d,n,null)}t=u,n=c,e.multiple=!!l,t!=null?Ml(e,!!l,t,!1):n!=null&&Ml(e,!!l,n,!0);return;case"textarea":Se("invalid",e),u=a=l=null;for(c in n)if(n.hasOwnProperty(c)&&(d=n[c],d!=null))switch(c){case"value":l=d;break;case"defaultValue":a=d;break;case"children":u=d;break;case"dangerouslySetInnerHTML":if(d!=null)throw Error(r(91));break;default:Le(e,t,c,d,n,null)}hc(e,l,a,u);return;case"option":for(y in n)n.hasOwnProperty(y)&&(l=n[y],l!=null)&&(y==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Le(e,t,y,l,n,null));return;case"dialog":Se("beforetoggle",e),Se("toggle",e),Se("cancel",e),Se("close",e);break;case"iframe":case"object":Se("load",e);break;case"video":case"audio":for(l=0;l<ai.length;l++)Se(ai[l],e);break;case"image":Se("error",e),Se("load",e);break;case"details":Se("toggle",e);break;case"embed":case"source":case"link":Se("error",e),Se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(C in n)if(n.hasOwnProperty(C)&&(l=n[C],l!=null))switch(C){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Le(e,t,C,l,n,null)}return;default:if(vo(t)){for(M in n)n.hasOwnProperty(M)&&(l=n[M],l!==void 0&&ur(e,t,M,l,n,void 0));return}}for(d in n)n.hasOwnProperty(d)&&(l=n[d],l!=null&&Le(e,t,d,l,n,null))}function Cy(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,u=null,c=null,d=null,y=null,C=null,M=null;for(A in n){var Y=n[A];if(n.hasOwnProperty(A)&&Y!=null)switch(A){case"checked":break;case"value":break;case"defaultValue":y=Y;default:l.hasOwnProperty(A)||Le(e,t,A,null,l,Y)}}for(var O in l){var A=l[O];if(Y=n[O],l.hasOwnProperty(O)&&(A!=null||Y!=null))switch(O){case"type":u=A;break;case"name":a=A;break;case"checked":C=A;break;case"defaultChecked":M=A;break;case"value":c=A;break;case"defaultValue":d=A;break;case"children":case"dangerouslySetInnerHTML":if(A!=null)throw Error(r(137,t));break;default:A!==Y&&Le(e,t,O,A,l,Y)}}ho(e,c,d,y,C,M,u,a);return;case"select":A=c=d=O=null;for(u in n)if(y=n[u],n.hasOwnProperty(u)&&y!=null)switch(u){case"value":break;case"multiple":A=y;default:l.hasOwnProperty(u)||Le(e,t,u,null,l,y)}for(a in l)if(u=l[a],y=n[a],l.hasOwnProperty(a)&&(u!=null||y!=null))switch(a){case"value":O=u;break;case"defaultValue":d=u;break;case"multiple":c=u;default:u!==y&&Le(e,t,a,u,l,y)}t=d,n=c,l=A,O!=null?Ml(e,!!n,O,!1):!!l!=!!n&&(t!=null?Ml(e,!!n,t,!0):Ml(e,!!n,n?[]:"",!1));return;case"textarea":A=O=null;for(d in n)if(a=n[d],n.hasOwnProperty(d)&&a!=null&&!l.hasOwnProperty(d))switch(d){case"value":break;case"children":break;default:Le(e,t,d,null,l,a)}for(c in l)if(a=l[c],u=n[c],l.hasOwnProperty(c)&&(a!=null||u!=null))switch(c){case"value":O=a;break;case"defaultValue":A=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(r(91));break;default:a!==u&&Le(e,t,c,a,l,u)}pc(e,O,A);return;case"option":for(var W in n)O=n[W],n.hasOwnProperty(W)&&O!=null&&!l.hasOwnProperty(W)&&(W==="selected"?e.selected=!1:Le(e,t,W,null,l,O));for(y in l)O=l[y],A=n[y],l.hasOwnProperty(y)&&O!==A&&(O!=null||A!=null)&&(y==="selected"?e.selected=O&&typeof O!="function"&&typeof O!="symbol":Le(e,t,y,O,l,A));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var oe in n)O=n[oe],n.hasOwnProperty(oe)&&O!=null&&!l.hasOwnProperty(oe)&&Le(e,t,oe,null,l,O);for(C in l)if(O=l[C],A=n[C],l.hasOwnProperty(C)&&O!==A&&(O!=null||A!=null))switch(C){case"children":case"dangerouslySetInnerHTML":if(O!=null)throw Error(r(137,t));break;default:Le(e,t,C,O,l,A)}return;default:if(vo(t)){for(var He in n)O=n[He],n.hasOwnProperty(He)&&O!==void 0&&!l.hasOwnProperty(He)&&ur(e,t,He,void 0,l,O);for(M in l)O=l[M],A=n[M],!l.hasOwnProperty(M)||O===A||O===void 0&&A===void 0||ur(e,t,M,O,l,A);return}}for(var S in n)O=n[S],n.hasOwnProperty(S)&&O!=null&&!l.hasOwnProperty(S)&&Le(e,t,S,null,l,O);for(Y in l)O=l[Y],A=n[Y],!l.hasOwnProperty(Y)||O===A||O==null&&A==null||Le(e,t,Y,O,l,A)}function S_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function Oy(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var a=n[l],u=a.transferSize,c=a.initiatorType,d=a.duration;if(u&&d&&S_(c)){for(c=0,d=a.responseEnd,l+=1;l<n.length;l++){var y=n[l],C=y.startTime;if(C>d)break;var M=y.transferSize,Y=y.initiatorType;M&&S_(Y)&&(y=y.responseEnd,c+=M*(y<d?1:(d-C)/(y-C)))}if(--l,t+=8*(u+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var or=null,sr=null;function zu(e){return e.nodeType===9?e:e.ownerDocument}function E_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function T_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function rr(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var cr=null;function zy(){var e=window.event;return e&&e.type==="popstate"?e===cr?!1:(cr=e,!0):(cr=null,!1)}var w_=typeof setTimeout=="function"?setTimeout:void 0,Ay=typeof clearTimeout=="function"?clearTimeout:void 0,C_=typeof Promise=="function"?Promise:void 0,Ry=typeof queueMicrotask=="function"?queueMicrotask:typeof C_<"u"?function(e){return C_.resolve(null).then(e).catch(Ny)}:w_;function Ny(e){setTimeout(function(){throw e})}function Wn(e){return e==="head"}function O_(e,t){var n=t,l=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(a),fa(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")ui(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,ui(n);for(var u=n.firstChild;u;){var c=u.nextSibling,d=u.nodeName;u[Ta]||d==="SCRIPT"||d==="STYLE"||d==="LINK"&&u.rel.toLowerCase()==="stylesheet"||n.removeChild(u),u=c}}else n==="body"&&ui(e.ownerDocument.body);n=a}while(n);fa(t)}function z_(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function fr(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":fr(n),yo(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function jy(e,t,n,l){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Ta])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(u=e.getAttribute("rel"),u==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(u!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(u=e.getAttribute("src"),(u!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&u&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var u=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===u)return e}else return e;if(e=Zt(e.nextSibling),e===null)break}return null}function My(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Zt(e.nextSibling),e===null))return null;return e}function A_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Zt(e.nextSibling),e===null))return null;return e}function dr(e){return e.data==="$?"||e.data==="$~"}function _r(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Dy(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Zt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var mr=null;function R_(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Zt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function N_(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function j_(e,t,n){switch(t=zu(n),e){case"html":if(e=t.documentElement,!e)throw Error(r(452));return e;case"head":if(e=t.head,!e)throw Error(r(453));return e;case"body":if(e=t.body,!e)throw Error(r(454));return e;default:throw Error(r(451))}}function ui(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);yo(e)}var Kt=new Map,M_=new Set;function Au(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var wn=q.d;q.d={f:Uy,r:ky,D:Yy,C:By,L:Ly,m:Hy,X:qy,S:Xy,M:Qy};function Uy(){var e=wn.f(),t=vu();return e||t}function ky(e){var t=Rl(e);t!==null&&t.tag===5&&t.type==="form"?Ff(t):wn.r(e)}var sa=typeof document>"u"?null:document;function D_(e,t,n){var l=sa;if(l&&typeof t=="string"&&t){var a=Lt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),M_.has(a)||(M_.add(a),e={rel:e,crossOrigin:n,href:t},l.querySelector(a)===null&&(t=l.createElement("link"),mt(t,"link",e),ot(t),l.head.appendChild(t)))}}function Yy(e){wn.D(e),D_("dns-prefetch",e,null)}function By(e,t){wn.C(e,t),D_("preconnect",e,t)}function Ly(e,t,n){wn.L(e,t,n);var l=sa;if(l&&e&&t){var a='link[rel="preload"][as="'+Lt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+Lt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+Lt(n.imageSizes)+'"]')):a+='[href="'+Lt(e)+'"]';var u=a;switch(t){case"style":u=ra(e);break;case"script":u=ca(e)}Kt.has(u)||(e=E({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Kt.set(u,e),l.querySelector(a)!==null||t==="style"&&l.querySelector(oi(u))||t==="script"&&l.querySelector(si(u))||(t=l.createElement("link"),mt(t,"link",e),ot(t),l.head.appendChild(t)))}}function Hy(e,t){wn.m(e,t);var n=sa;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+Lt(l)+'"][href="'+Lt(e)+'"]',u=a;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":u=ca(e)}if(!Kt.has(u)&&(e=E({rel:"modulepreload",href:e},t),Kt.set(u,e),n.querySelector(a)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(si(u)))return}l=n.createElement("link"),mt(l,"link",e),ot(l),n.head.appendChild(l)}}}function Xy(e,t,n){wn.S(e,t,n);var l=sa;if(l&&e){var a=Nl(l).hoistableStyles,u=ra(e);t=t||"default";var c=a.get(u);if(!c){var d={loading:0,preload:null};if(c=l.querySelector(oi(u)))d.loading=5;else{e=E({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Kt.get(u))&&gr(e,n);var y=c=l.createElement("link");ot(y),mt(y,"link",e),y._p=new Promise(function(C,M){y.onload=C,y.onerror=M}),y.addEventListener("load",function(){d.loading|=1}),y.addEventListener("error",function(){d.loading|=2}),d.loading|=4,Ru(c,t,l)}c={type:"stylesheet",instance:c,count:1,state:d},a.set(u,c)}}}function qy(e,t){wn.X(e,t);var n=sa;if(n&&e){var l=Nl(n).hoistableScripts,a=ca(e),u=l.get(a);u||(u=n.querySelector(si(a)),u||(e=E({src:e,async:!0},t),(t=Kt.get(a))&&yr(e,t),u=n.createElement("script"),ot(u),mt(u,"link",e),n.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},l.set(a,u))}}function Qy(e,t){wn.M(e,t);var n=sa;if(n&&e){var l=Nl(n).hoistableScripts,a=ca(e),u=l.get(a);u||(u=n.querySelector(si(a)),u||(e=E({src:e,async:!0,type:"module"},t),(t=Kt.get(a))&&yr(e,t),u=n.createElement("script"),ot(u),mt(u,"link",e),n.head.appendChild(u)),u={type:"script",instance:u,count:1,state:null},l.set(a,u))}}function U_(e,t,n,l){var a=(a=pe.current)?Au(a):null;if(!a)throw Error(r(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=ra(n.href),n=Nl(a).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ra(n.href);var u=Nl(a).hoistableStyles,c=u.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},u.set(e,c),(u=a.querySelector(oi(e)))&&!u._p&&(c.instance=u,c.state.loading=5),Kt.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Kt.set(e,n),u||Gy(a,e,n,c.state))),t&&l===null)throw Error(r(528,""));return c}if(t&&l!==null)throw Error(r(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=ca(n),n=Nl(a).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,e))}}function ra(e){return'href="'+Lt(e)+'"'}function oi(e){return'link[rel="stylesheet"]['+e+"]"}function k_(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function Gy(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),mt(t,"link",n),ot(t),e.head.appendChild(t))}function ca(e){return'[src="'+Lt(e)+'"]'}function si(e){return"script[async]"+e}function Y_(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Lt(n.href)+'"]');if(l)return t.instance=l,ot(l),l;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),ot(l),mt(l,"style",a),Ru(l,n.precedence,e),t.instance=l;case"stylesheet":a=ra(n.href);var u=e.querySelector(oi(a));if(u)return t.state.loading|=4,t.instance=u,ot(u),u;l=k_(n),(a=Kt.get(a))&&gr(l,a),u=(e.ownerDocument||e).createElement("link"),ot(u);var c=u;return c._p=new Promise(function(d,y){c.onload=d,c.onerror=y}),mt(u,"link",l),t.state.loading|=4,Ru(u,n.precedence,e),t.instance=u;case"script":return u=ca(n.src),(a=e.querySelector(si(u)))?(t.instance=a,ot(a),a):(l=n,(a=Kt.get(u))&&(l=E({},n),yr(l,a)),e=e.ownerDocument||e,a=e.createElement("script"),ot(a),mt(a,"link",l),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(r(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,Ru(l,n.precedence,e));return t.instance}function Ru(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=l.length?l[l.length-1]:null,u=a,c=0;c<l.length;c++){var d=l[c];if(d.dataset.precedence===t)u=d;else if(u!==a)break}u?u.parentNode.insertBefore(e,u.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function gr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function yr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Nu=null;function B_(e,t,n){if(Nu===null){var l=new Map,a=Nu=new Map;a.set(n,l)}else a=Nu,l=a.get(n),l||(l=new Map,a.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var u=n[a];if(!(u[Ta]||u[ct]||e==="link"&&u.getAttribute("rel")==="stylesheet")&&u.namespaceURI!=="http://www.w3.org/2000/svg"){var c=u.getAttribute(t)||"";c=e+c;var d=l.get(c);d?d.push(u):l.set(c,[u])}}return l}function L_(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function Vy(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function H_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function Zy(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ra(l.href),u=t.querySelector(oi(a));if(u){t=u._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=ju.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=u,ot(u);return}u=t.ownerDocument||t,l=k_(l),(a=Kt.get(a))&&gr(l,a),u=u.createElement("link"),ot(u);var c=u;c._p=new Promise(function(d,y){c.onload=d,c.onerror=y}),mt(u,"link",l),n.instance=u}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=ju.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var pr=0;function Ky(e,t){return e.stylesheets&&e.count===0&&Du(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Du(e,e.stylesheets),e.unsuspend){var u=e.unsuspend;e.unsuspend=null,u()}},6e4+t);0<e.imgBytes&&pr===0&&(pr=62500*Oy());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Du(e,e.stylesheets),e.unsuspend)){var u=e.unsuspend;e.unsuspend=null,u()}},(e.imgBytes>pr?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(a)}}:null}function ju(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Du(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Mu=null;function Du(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Mu=new Map,t.forEach(Jy,e),Mu=null,ju.call(e))}function Jy(e,t){if(!(t.state.loading&4)){var n=Mu.get(e);if(n)var l=n.get(null);else{n=new Map,Mu.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),u=0;u<a.length;u++){var c=a[u];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),l=c)}l&&n.set(null,l)}a=t.instance,c=a.getAttribute("data-precedence"),u=n.get(c)||l,u===l&&n.set(null,a),n.set(c,a),this.count++,l=ju.bind(this),a.addEventListener("load",l),a.addEventListener("error",l),u?u.parentNode.insertBefore(a,u.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var ri={$$typeof:G,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function Iy(e,t,n,l,a,u,c,d,y){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=fo(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=fo(0),this.hiddenUpdates=fo(null),this.identifierPrefix=l,this.onUncaughtError=a,this.onCaughtError=u,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=y,this.incompleteTransitions=new Map}function X_(e,t,n,l,a,u,c,d,y,C,M,Y){return e=new Iy(e,t,n,c,y,C,M,Y,d),t=1,u===!0&&(t|=24),u=Nt(3,null,null,t),e.current=u,u.stateNode=e,t=Fo(),t.refCount++,e.pooledCache=t,t.refCount++,u.memoizedState={element:l,isDehydrated:n,cache:t},es(u),e}function q_(e){return e?(e=Xl,e):Xl}function Q_(e,t,n,l,a,u){a=q_(a),l.context===null?l.context=a:l.pendingContext=a,l=Hn(t),l.payload={element:n},u=u===void 0?null:u,u!==null&&(l.callback=u),n=Xn(e,l,t),n!==null&&(Ct(n,e,t),Xa(n,e,t))}function G_(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function hr(e,t){G_(e,t),(e=e.alternate)&&G_(e,t)}function V_(e){if(e.tag===13||e.tag===31){var t=fl(e,67108864);t!==null&&Ct(t,e,67108864),hr(e,67108864)}}function Z_(e){if(e.tag===13||e.tag===31){var t=kt();t=_o(t);var n=fl(e,t);n!==null&&Ct(n,e,t),hr(e,t)}}var Uu=!0;function Fy(e,t,n,l){var a=N.T;N.T=null;var u=q.p;try{q.p=2,br(e,t,n,l)}finally{q.p=u,N.T=a}}function Wy(e,t,n,l){var a=N.T;N.T=null;var u=q.p;try{q.p=8,br(e,t,n,l)}finally{q.p=u,N.T=a}}function br(e,t,n,l){if(Uu){var a=vr(l);if(a===null)ir(e,t,l,ku,n),J_(e,l);else if(Py(a,e,t,n,l))l.stopPropagation();else if(J_(e,l),t&4&&-1<$y.indexOf(e)){for(;a!==null;){var u=Rl(a);if(u!==null)switch(u.tag){case 3:if(u=u.stateNode,u.current.memoizedState.isDehydrated){var c=ul(u.pendingLanes);if(c!==0){var d=u;for(d.pendingLanes|=2,d.entangledLanes|=2;c;){var y=1<<31-At(c);d.entanglements[1]|=y,c&=~y}an(u),(Ne&6)===0&&(hu=Ye()+500,li(0))}}break;case 31:case 13:d=fl(u,2),d!==null&&Ct(d,u,2),vu(),hr(u,2)}if(u=vr(l),u===null&&ir(e,t,l,ku,n),u===a)break;a=u}a!==null&&l.stopPropagation()}else ir(e,t,l,null,n)}}function vr(e){return e=So(e),xr(e)}var ku=null;function xr(e){if(ku=null,e=Al(e),e!==null){var t=_(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=p(t),e!==null)return e;e=null}else if(n===31){if(e=x(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return ku=e,null}function K_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(An()){case il:return 2;case Cl:return 8;case Rn:case bt:return 32;case Nn:return 268435456;default:return 32}default:return 32}}var Sr=!1,$n=null,Pn=null,el=null,ci=new Map,fi=new Map,tl=[],$y="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function J_(e,t){switch(e){case"focusin":case"focusout":$n=null;break;case"dragenter":case"dragleave":Pn=null;break;case"mouseover":case"mouseout":el=null;break;case"pointerover":case"pointerout":ci.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":fi.delete(t.pointerId)}}function di(e,t,n,l,a,u){return e===null||e.nativeEvent!==u?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:u,targetContainers:[a]},t!==null&&(t=Rl(t),t!==null&&V_(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function Py(e,t,n,l,a){switch(t){case"focusin":return $n=di($n,e,t,n,l,a),!0;case"dragenter":return Pn=di(Pn,e,t,n,l,a),!0;case"mouseover":return el=di(el,e,t,n,l,a),!0;case"pointerover":var u=a.pointerId;return ci.set(u,di(ci.get(u)||null,e,t,n,l,a)),!0;case"gotpointercapture":return u=a.pointerId,fi.set(u,di(fi.get(u)||null,e,t,n,l,a)),!0}return!1}function I_(e){var t=Al(e.target);if(t!==null){var n=_(t);if(n!==null){if(t=n.tag,t===13){if(t=p(n),t!==null){e.blockedOn=t,sc(e.priority,function(){Z_(n)});return}}else if(t===31){if(t=x(n),t!==null){e.blockedOn=t,sc(e.priority,function(){Z_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Yu(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=vr(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);xo=l,n.target.dispatchEvent(l),xo=null}else return t=Rl(n),t!==null&&V_(t),e.blockedOn=n,!1;t.shift()}return!0}function F_(e,t,n){Yu(e)&&n.delete(t)}function ep(){Sr=!1,$n!==null&&Yu($n)&&($n=null),Pn!==null&&Yu(Pn)&&(Pn=null),el!==null&&Yu(el)&&(el=null),ci.forEach(F_),fi.forEach(F_)}function Bu(e,t){e.blockedOn===t&&(e.blockedOn=null,Sr||(Sr=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,ep)))}var Lu=null;function W_(e){Lu!==e&&(Lu=e,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){Lu===e&&(Lu=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],a=e[t+2];if(typeof l!="function"){if(xr(l||n)===null)continue;break}var u=Rl(n);u!==null&&(e.splice(t,3),t-=3,vs(u,{pending:!0,data:a,method:n.method,action:l},l,a))}}))}function fa(e){function t(y){return Bu(y,e)}$n!==null&&Bu($n,e),Pn!==null&&Bu(Pn,e),el!==null&&Bu(el,e),ci.forEach(t),fi.forEach(t);for(var n=0;n<tl.length;n++){var l=tl[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<tl.length&&(n=tl[0],n.blockedOn===null);)I_(n),n.blockedOn===null&&tl.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var a=n[l],u=n[l+1],c=a[vt]||null;if(typeof u=="function")c||W_(n);else if(c){var d=null;if(u&&u.hasAttribute("formAction")){if(a=u,c=u[vt]||null)d=c.formAction;else if(xr(a)!==null)continue}else d=c.action;typeof d=="function"?n[l+1]=d:(n.splice(l,3),l-=3),W_(n)}}}function $_(){function e(u){u.canIntercept&&u.info==="react-transition"&&u.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var u=navigation.currentEntry;u&&u.url!=null&&navigation.navigate(u.url,{state:u.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Er(e){this._internalRoot=e}Hu.prototype.render=Er.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));var n=t.current,l=kt();Q_(n,l,e,t,null,null)},Hu.prototype.unmount=Er.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;Q_(e.current,2,null,e,null,null),vu(),t[zl]=null}};function Hu(e){this._internalRoot=e}Hu.prototype.unstable_scheduleHydration=function(e){if(e){var t=oc();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tl.length&&t!==0&&t<tl[n].priority;n++);tl.splice(n,0,e),n===0&&I_(e)}};var P_=o.version;if(P_!=="19.2.4")throw Error(r(527,P_,"19.2.4"));q.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(r(188)):(e=Object.keys(e).join(","),Error(r(268,e)));return e=m(t),e=e!==null?R(e):null,e=e===null?null:e.stateNode,e};var tp={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Xu=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Xu.isDisabled&&Xu.supportsFiber)try{xa=Xu.inject(tp),zt=Xu}catch{}}return mi.createRoot=function(e,t){if(!f(e))throw Error(r(299));var n=!1,l="",a=ud,u=od,c=sd;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(u=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=X_(e,1,!1,null,null,n,l,null,a,u,c,$_),e[zl]=t.current,ar(e),new Er(t)},mi.hydrateRoot=function(e,t,n){if(!f(e))throw Error(r(299));var l=!1,a="",u=ud,c=od,d=sd,y=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(u=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(d=n.onRecoverableError),n.formState!==void 0&&(y=n.formState)),t=X_(e,1,!0,t,n??null,l,a,y,u,c,d,$_),t.context=q_(null),n=t.current,l=kt(),l=_o(l),a=Hn(l),a.callback=null,Xn(n,a,l),n=l,t.current.lanes=n,Ea(t,n),an(t),e[zl]=t.current,ar(e),new Hu(t)},mi.version="19.2.4",mi}var rm;function _p(){if(rm)return Cr.exports;rm=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(o){console.error(o)}}return i(),Cr.exports=dp(),Cr.exports}var mp=_p(),Wr=qm(),gp=`svg[fill=none] {
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
}`,yp={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let i=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");i||(i=document.createElement("style"),i.id="feedback-tool-styles-annotation-popup-css-styles",i.textContent=gp,document.head.appendChild(i))}var Qe=yp,pp=({size:i=24})=>g.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:g.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),Rr="__agentation_freeze";function hp(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:o=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const i=window;return i[Rr]||(i[Rr]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),i[Rr]}var gt=hp();typeof window<"u"&&!gt.installed&&(gt.origSetTimeout=window.setTimeout.bind(window),gt.origSetInterval=window.setInterval.bind(window),gt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(i,o,...s)=>typeof i=="string"?gt.origSetTimeout(i,o):gt.origSetTimeout((...r)=>{gt.frozen?gt.frozenTimeoutQueue.push(()=>i(...r)):i(...r)},o,...s),window.setInterval=(i,o,...s)=>typeof i=="string"?gt.origSetInterval(i,o):gt.origSetInterval((...r)=>{gt.frozen||i(...r)},o,...s),window.requestAnimationFrame=i=>gt.origRAF(o=>{gt.frozen?gt.frozenRAFQueue.push(i):i(o)}),gt.installed=!0);var da=gt.origSetTimeout;gt.origSetInterval;T.forwardRef(function({element:o,timestamp:s,selectedText:r,placeholder:f="What should change?",initialValue:_="",submitLabel:p="Add",onSubmit:x,onCancel:h,onDelete:m,style:R,accentColor:E="#3c82f7",isExiting:z=!1,lightMode:j=!1,computedStyles:B},L){const[I,Z]=T.useState(_),[$,G]=T.useState(!1),[Q,te]=T.useState("initial"),[ne,F]=T.useState(!1),[ue,H]=T.useState(!1),le=T.useRef(null),re=T.useRef(null),Ce=T.useRef(null),We=T.useRef(null);T.useEffect(()=>{z&&Q!=="exit"&&te("exit")},[z,Q]),T.useEffect(()=>{da(()=>{te("enter")},0);const ae=da(()=>{te("entered")},200),ve=da(()=>{const b=le.current;b&&(b.focus(),b.selectionStart=b.selectionEnd=b.value.length,b.scrollTop=b.scrollHeight)},50);return()=>{clearTimeout(ae),clearTimeout(ve),Ce.current&&clearTimeout(Ce.current),We.current&&clearTimeout(We.current)}},[]);const Xe=T.useCallback(()=>{We.current&&clearTimeout(We.current),G(!0),We.current=da(()=>{G(!1),le.current?.focus()},250)},[]);T.useImperativeHandle(L,()=>({shake:Xe}),[Xe]);const ce=T.useCallback(()=>{te("exit"),Ce.current=da(()=>{h()},150)},[h]),N=T.useCallback(()=>{I.trim()&&x(I.trim())},[I,x]),q=T.useCallback(ae=>{ae.nativeEvent.isComposing||(ae.key==="Enter"&&!ae.shiftKey&&(ae.preventDefault(),N()),ae.key==="Escape"&&ce())},[N,ce]),K=[Qe.popup,j?Qe.light:"",Q==="enter"?Qe.enter:"",Q==="entered"?Qe.entered:"",Q==="exit"?Qe.exit:"",$?Qe.shake:""].filter(Boolean).join(" ");return g.jsxs("div",{ref:re,className:K,"data-annotation-popup":!0,style:R,onClick:ae=>ae.stopPropagation(),children:[g.jsxs("div",{className:Qe.header,children:[B&&Object.keys(B).length>0?g.jsxs("button",{className:Qe.headerToggle,onClick:()=>{const ae=ue;H(!ue),ae&&da(()=>le.current?.focus(),0)},type:"button",children:[g.jsx("svg",{className:`${Qe.chevron} ${ue?Qe.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:g.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),g.jsx("span",{className:Qe.element,children:o})]}):g.jsx("span",{className:Qe.element,children:o}),s&&g.jsx("span",{className:Qe.timestamp,children:s})]}),B&&Object.keys(B).length>0&&g.jsx("div",{className:`${Qe.stylesWrapper} ${ue?Qe.expanded:""}`,children:g.jsx("div",{className:Qe.stylesInner,children:g.jsx("div",{className:Qe.stylesBlock,children:Object.entries(B).map(([ae,ve])=>g.jsxs("div",{className:Qe.styleLine,children:[g.jsx("span",{className:Qe.styleProperty,children:ae.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",g.jsx("span",{className:Qe.styleValue,children:ve}),";"]},ae))})})}),r&&g.jsxs("div",{className:Qe.quote,children:["“",r.slice(0,80),r.length>80?"...":"","”"]}),g.jsx("textarea",{ref:le,className:Qe.textarea,style:{borderColor:ne?E:void 0},placeholder:f,value:I,onChange:ae=>Z(ae.target.value),onFocus:()=>F(!0),onBlur:()=>F(!1),rows:2,onKeyDown:q}),g.jsxs("div",{className:Qe.actions,children:[m&&g.jsx("div",{className:Qe.deleteWrapper,children:g.jsx("button",{className:Qe.deleteButton,onClick:m,type:"button",children:g.jsx(pp,{size:22})})}),g.jsx("button",{className:Qe.cancel,onClick:ce,children:"Cancel"}),g.jsx("button",{className:Qe.submit,style:{backgroundColor:E,opacity:I.trim()?1:.4},onClick:N,disabled:!I.trim(),children:p})]})]})});var bp=`svg[fill=none] {
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
}`;if(typeof document<"u"){let i=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");i||(i=document.createElement("style"),i.id="feedback-tool-styles-page-toolbar-css-styles",i.textContent=bp,document.head.appendChild(i))}function vp(i){const o=i.currentTarget.getBoundingClientRect(),s=o.width===0?0:(i.clientX-o.left)/o.width-.5,r=o.height===0?0:(i.clientY-o.top)/o.height-.5;i.currentTarget.style.setProperty("--mosaic-hover-anchor-x",`${(s*12).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y",`${(r*4).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-tilt-x",`${(-r*4).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-tilt-y",`${(s*8).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-lift",`${(1+Math.abs(s)*.01).toFixed(3)}`),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x",`${(-r*2).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y",`${(s*4).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-chip-lift",`${(1+Math.abs(s)*.006).toFixed(3)}`)}function cm(i){i.currentTarget.style.setProperty("--mosaic-hover-anchor-x","0px"),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y","0px"),i.currentTarget.style.setProperty("--mosaic-hover-tilt-x","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-tilt-y","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-lift","1"),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-chip-lift","1")}function _a({href:i,logoUrls:o,className:s,ariaLabel:r,title:f,children:_}){return g.jsxs("a",{href:i,target:"_blank",rel:"noreferrer",className:s,"aria-label":r,title:f,onPointerMove:vp,onPointerLeave:cm,onPointerCancel:cm,children:[g.jsx("span",{className:"mosaic-company-inline-name",children:_}),g.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:o.map(p=>g.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:g.jsx("img",{src:p,alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})},`${i}-${p}`))})]})}function xp(i){const o=i.currentTarget.getBoundingClientRect(),s=o.width===0?0:(i.clientX-o.left)/o.width-.5,r=o.height===0?0:(i.clientY-o.top)/o.height-.5;i.currentTarget.style.setProperty("--mosaic-hover-anchor-x",`${(s*12).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y",`${(r*6).toFixed(2)}px`)}function fm(i){i.currentTarget.style.setProperty("--mosaic-hover-anchor-x","0px"),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y","0px")}function Sp({href:i,className:o,embedUrl:s,previewTitle:r,children:f}){const[_,p]=T.useState(!1);return g.jsxs("a",{href:i,target:"_blank",rel:"noreferrer",className:`${o} mosaic-profile-link-with-video${_?" is-active":""}`,onPointerEnter:()=>p(!0),onPointerMove:xp,onPointerLeave:x=>{p(!1),fm(x)},onPointerCancel:x=>{p(!1),fm(x)},onFocus:()=>p(!0),onBlur:()=>p(!1),children:[f,g.jsx("span",{className:"mosaic-company-inline-hover-video","aria-hidden":"true",children:_?g.jsx("iframe",{src:s,title:r,loading:"eager",allow:"autoplay; encrypted-media; picture-in-picture",referrerPolicy:"strict-origin-when-cross-origin",className:"mosaic-company-inline-hover-video-frame"}):null})]})}function Si(i,...o){const s=new URL("https://base-ui.com/production-error");return s.searchParams.set("code",i.toString()),o.forEach(r=>s.searchParams.append("args[]",r)),`Base UI error #${i}; visit ${s} for the full message.`}const Qm=T.createContext(void 0);function Ei(i){const o=T.useContext(Qm);if(i===!1&&o===void 0)throw new Error(Si(27));return o}const dm={};function al(i,o){const s=T.useRef(dm);return s.current===dm&&(s.current=i(o)),s}function Wu(i,o,s,r){const f=al(Gm).current;return Tp(f,i,o,s,r)&&Vm(f,[i,o,s,r]),f.callback}function Ep(i){const o=al(Gm).current;return wp(o,i)&&Vm(o,i),o.callback}function Gm(){return{callback:null,cleanup:null,refs:[]}}function Tp(i,o,s,r,f){return i.refs[0]!==o||i.refs[1]!==s||i.refs[2]!==r||i.refs[3]!==f}function wp(i,o){return i.refs.length!==o.length||i.refs.some((s,r)=>s!==o[r])}function Vm(i,o){if(i.refs=o,o.every(s=>s==null)){i.callback=null;return}i.callback=s=>{if(i.cleanup&&(i.cleanup(),i.cleanup=null),s!=null){const r=Array(o.length).fill(null);for(let f=0;f<o.length;f+=1){const _=o[f];if(_!=null)switch(typeof _){case"function":{const p=_(s);typeof p=="function"&&(r[f]=p);break}case"object":{_.current=s;break}}}i.cleanup=()=>{for(let f=0;f<o.length;f+=1){const _=o[f];if(_!=null)switch(typeof _){case"function":{const p=r[f];typeof p=="function"?p():_(null);break}case"object":{_.current=null;break}}}}}}}const Cp=parseInt(T.version,10);function $r(i){return Cp>=i}function _m(i){if(!T.isValidElement(i))return null;const o=i,s=o.props;return($r(19)?s?.ref:o.ref)??null}function qr(i,o){if(i&&!o)return i;if(!i&&o)return o;if(i||o)return{...i,...o}}function Op(i,o){const s={};for(const r in i){const f=i[r];if(o?.hasOwnProperty(r)){const _=o[r](f);_!=null&&Object.assign(s,_);continue}f===!0?s[`data-${r.toLowerCase()}`]="":f&&(s[`data-${r.toLowerCase()}`]=f.toString())}return s}function zp(i,o){return typeof i=="function"?i(o):i}function Ap(i,o){return typeof i=="function"?i(o):i}const yi={};function Zm(i,o,s,r,f){let _={...Qr(i,yi)};return o&&(_=Iu(_,o)),s&&(_=Iu(_,s)),r&&(_=Iu(_,r)),_}function Rp(i){if(i.length===0)return yi;if(i.length===1)return Qr(i[0],yi);let o={...Qr(i[0],yi)};for(let s=1;s<i.length;s+=1)o=Iu(o,i[s]);return o}function Iu(i,o){return Km(o)?o(i):Np(i,o)}function Np(i,o){if(!o)return i;for(const s in o){const r=o[s];switch(s){case"style":{i[s]=qr(i.style,r);break}case"className":{i[s]=Jm(i.className,r);break}default:jp(s,r)?i[s]=Mp(i[s],r):i[s]=r}}return i}function jp(i,o){const s=i.charCodeAt(0),r=i.charCodeAt(1),f=i.charCodeAt(2);return s===111&&r===110&&f>=65&&f<=90&&(typeof o=="function"||typeof o>"u")}function Km(i){return typeof i=="function"}function Qr(i,o){return Km(i)?i(o):i??yi}function Mp(i,o){return o?i?s=>{if(Dp(s)){const f=s;Gr(f);const _=o(f);return f.baseUIHandlerPrevented||i?.(f),_}const r=o(s);return i?.(s),r}:o:i}function Gr(i){return i.preventBaseUIHandler=()=>{i.baseUIHandlerPrevented=!0},i}function Jm(i,o){return o?i?o+" "+i:o:i}function Dp(i){return i!=null&&typeof i=="object"&&"nativeEvent"in i}function Im(){}const Jt=Object.freeze({}),Up="data-base-ui-click-trigger",kp={clipPath:"inset(50%)",position:"fixed",top:0,left:0};function uo(i,o,s={}){const r=o.render,f=Yp(o,s);if(s.enabled===!1)return null;const _=s.state??Jt;return Bp(i,r,f,_)}function Yp(i,o={}){const{className:s,style:r,render:f}=i,{state:_=Jt,ref:p,props:x,stateAttributesMapping:h,enabled:m=!0}=o,R=m?zp(s,_):void 0,E=m?Ap(r,_):void 0,z=m?Op(_,h):Jt,j=m?qr(z,Array.isArray(x)?Rp(x):x)??Jt:Jt;return typeof document<"u"&&(m?Array.isArray(p)?j.ref=Ep([j.ref,_m(f),...p]):j.ref=Wu(j.ref,_m(f),p):Wu(null,null)),m?(R!==void 0&&(j.className=Jm(j.className,R)),E!==void 0&&(j.style=qr(j.style,E)),j):Jt}function Bp(i,o,s,r){if(o){if(typeof o=="function")return o(s,r);const f=Zm(s,o.props);return f.ref=s.ref,T.cloneElement(o,f)}if(i&&typeof i=="string")return Lp(i,s);throw new Error(Si(8))}function Lp(i,o){return i==="button"?T.createElement("button",{type:"button",...o,key:o.key}):i==="img"?T.createElement("img",{alt:"",...o,key:o.key}):T.createElement(i,o)}let vi=(function(i){return i.startingStyle="data-starting-style",i.endingStyle="data-ending-style",i})({});const Hp={[vi.startingStyle]:""},Xp={[vi.endingStyle]:""},Fm={transitionStatus(i){return i==="starting"?Hp:i==="ending"?Xp:null}};let wl=(function(i){return i.open="data-open",i.closed="data-closed",i[i.startingStyle=vi.startingStyle]="startingStyle",i[i.endingStyle=vi.endingStyle]="endingStyle",i.anchorHidden="data-anchor-hidden",i})({});const qp={[wl.open]:""},Qp={[wl.closed]:""},Gp={[wl.anchorHidden]:""},Wm={open(i){return i?qp:Qp},anchorHidden(i){return i?Gp:null}},Vp={...Wm,...Fm},Zp=T.forwardRef(function(o,s){const{render:r,className:f,forceRender:_=!1,...p}=o,{store:x}=Ei(),h=x.useState("open"),m=x.useState("nested"),R=x.useState("mounted"),E=x.useState("transitionStatus"),z=T.useMemo(()=>({open:h,transitionStatus:E}),[h,E]);return uo("div",o,{state:z,ref:[x.context.backdropRef,s],stateAttributesMapping:Vp,props:[{role:"presentation",hidden:!R,style:{userSelect:"none",WebkitUserSelect:"none"}},p],enabled:_||!m})});function oo(){return typeof window<"u"}function so(i){return Pr(i)?(i.nodeName||"").toLowerCase():"#document"}function on(i){var o;return(i==null||(o=i.ownerDocument)==null?void 0:o.defaultView)||window}function Kp(i){var o;return(o=(Pr(i)?i.ownerDocument:i.document)||window.document)==null?void 0:o.documentElement}function Pr(i){return oo()?i instanceof Node||i instanceof on(i).Node:!1}function Tl(i){return oo()?i instanceof Element||i instanceof on(i).Element:!1}function On(i){return oo()?i instanceof HTMLElement||i instanceof on(i).HTMLElement:!1}function Vr(i){return!oo()||typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof on(i).ShadowRoot}const Jp=new Set(["inline","contents"]);function ro(i){const{overflow:o,overflowX:s,overflowY:r,display:f}=ec(i);return/auto|scroll|overlay|hidden|clip/.test(o+r+s)&&!Jp.has(f)}function Ip(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const Fp=new Set(["html","body","#document"]);function Fu(i){return Fp.has(so(i))}function ec(i){return on(i).getComputedStyle(i)}function $m(i){if(so(i)==="html")return i;const o=i.assignedSlot||i.parentNode||Vr(i)&&i.host||Kp(i);return Vr(o)?o.host:o}function Pm(i){const o=$m(i);return Fu(o)?i.ownerDocument?i.ownerDocument.body:i.body:On(o)&&ro(o)?o:Pm(o)}function pi(i,o,s){var r;o===void 0&&(o=[]),s===void 0&&(s=!0);const f=Pm(i),_=f===((r=i.ownerDocument)==null?void 0:r.body),p=on(f);if(_){const x=Wp(p);return o.concat(p,p.visualViewport||[],ro(f)?f:[],x&&s?pi(x):[])}return o.concat(f,pi(f,[],s))}function Wp(i){return i.parent&&Object.getPrototypeOf(i.parent)?i.frameElement:null}const Nr=Xm[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0,-3)],$p=Nr&&Nr!==T.useLayoutEffect?Nr:i=>i();function je(i){const o=al(Pp).current;return o.next=i,$p(o.effect),o.trampoline}function Pp(){const i={next:void 0,callback:eh,trampoline:(...o)=>i.callback?.(...o),effect:()=>{i.callback=i.next}};return i}function eh(){}const th=()=>{},rt=typeof document<"u"?T.useLayoutEffect:th,nh=T.createContext(void 0);function lh(i=!1){const o=T.useContext(nh);if(o===void 0&&!i)throw new Error(Si(16));return o}function ah(i){const{focusableWhenDisabled:o,disabled:s,composite:r=!1,tabIndex:f=0,isNativeButton:_}=i,p=r&&o!==!1,x=r&&o===!1;return{props:T.useMemo(()=>{const m={onKeyDown(R){s&&o&&R.key!=="Tab"&&R.preventDefault()}};return r||(m.tabIndex=f,!_&&s&&(m.tabIndex=o?f:-1)),(_&&(o||p)||!_&&s)&&(m["aria-disabled"]=s),_&&(!o||x)&&(m.disabled=s),m},[r,s,o,p,x,_,f])}}function ih(i={}){const{disabled:o=!1,focusableWhenDisabled:s,tabIndex:r=0,native:f=!0}=i,_=T.useRef(null),p=lh(!0)!==void 0,x=je(()=>{const z=_.current;return!!(z?.tagName==="A"&&z?.href)}),{props:h}=ah({focusableWhenDisabled:s,disabled:o,composite:p,tabIndex:r,isNativeButton:f}),m=T.useCallback(()=>{const z=_.current;uh(z)&&p&&o&&h.disabled===void 0&&z.disabled&&(z.disabled=!1)},[o,h.disabled,p]);rt(m,[m]);const R=T.useCallback((z={})=>{const{onClick:j,onMouseDown:B,onKeyUp:L,onKeyDown:I,onPointerDown:Z,...$}=z;return Zm({type:f?"button":void 0,onClick(Q){if(o){Q.preventDefault();return}j?.(Q)},onMouseDown(Q){o||B?.(Q)},onKeyDown(Q){if(o||(Gr(Q),I?.(Q)),Q.baseUIHandlerPrevented)return;const te=Q.target===Q.currentTarget&&!f&&!x()&&!o,ne=Q.key==="Enter",F=Q.key===" ";te&&((F||ne)&&Q.preventDefault(),ne&&j?.(Q))},onKeyUp(Q){o||(Gr(Q),L?.(Q)),!Q.baseUIHandlerPrevented&&Q.target===Q.currentTarget&&!f&&!o&&Q.key===" "&&j?.(Q)},onPointerDown(Q){if(o){Q.preventDefault();return}Z?.(Q)}},f?void 0:{role:"button"},h,$)},[o,h,f,x]),E=je(z=>{_.current=z,m()});return{getButtonProps:R,buttonRef:E}}function uh(i){return On(i)&&i.tagName==="BUTTON"}const oh="none",mm="trigger-press",sh="trigger-hover",e0="outside-press",rh="close-press",t0="focus-out",ch="escape-key",fh="imperative-action";function zn(i,o,s,r){let f=!1,_=!1;const p=Jt;return{reason:i,event:o??new Event("base-ui"),cancel(){f=!0},allowPropagation(){_=!0},get isCanceled(){return f},get isPropagationAllowed(){return _},trigger:s,...p}}const dh=T.forwardRef(function(o,s){const{render:r,className:f,disabled:_=!1,nativeButton:p=!0,...x}=o,{store:h}=Ei(),m=h.useState("open");function R(B){m&&h.setOpen(!1,zn(rh,B.nativeEvent))}const{getButtonProps:E,buttonRef:z}=ih({disabled:_,native:p}),j=T.useMemo(()=>({disabled:_}),[_]);return uo("button",o,{state:j,ref:[s,z],props:[{onClick:R},x,E]})}),_h={...Xm};let gm=0;function mh(i,o="mui"){const[s,r]=T.useState(i),f=i||s;return T.useEffect(()=>{s==null&&(gm+=1,r(`${o}-${gm}`))},[s,o]),f}const ym=_h.useId;function tc(i,o){return ym!==void 0?ym():mh(i,o)}const gh=[];function n0(i){T.useEffect(i,gh)}const gi=0;class ha{static create(){return new ha}currentId=gi;start(o,s){this.clear(),this.currentId=setTimeout(()=>{this.currentId=gi,s()},o)}isStarted(){return this.currentId!==gi}clear=()=>{this.currentId!==gi&&(clearTimeout(this.currentId),this.currentId=gi)};disposeEffect=()=>this.clear}function $u(){const i=al(ha.create).current;return n0(i.disposeEffect),i}function qu(i){const o=al(yh,i).current;return o.next=i,rt(o.effect),o}function yh(i){const o={current:i,next:i,effect:()=>{o.current=o.next}};return o}const va=typeof navigator<"u",jr=vh(),l0=Sh(),a0=xh(),ph=typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter:none"),i0=jr.platform==="MacIntel"&&jr.maxTouchPoints>1?!0:/iP(hone|ad|od)|iOS/.test(jr.platform),hh=va&&/apple/i.test(navigator.vendor),Zr=va&&/android/i.test(l0)||/android/i.test(a0);va&&l0.toLowerCase().startsWith("mac")&&navigator.maxTouchPoints;const bh=a0.includes("jsdom/");function vh(){if(!va)return{platform:"",maxTouchPoints:-1};const i=navigator.userAgentData;return i?.platform?{platform:i.platform,maxTouchPoints:navigator.maxTouchPoints}:{platform:navigator.platform??"",maxTouchPoints:navigator.maxTouchPoints??-1}}function xh(){if(!va)return"";const i=navigator.userAgentData;return i&&Array.isArray(i.brands)?i.brands.map(({brand:o,version:s})=>`${o}/${s}`).join(" "):navigator.userAgent}function Sh(){if(!va)return"";const i=navigator.userAgentData;return i?.platform?i.platform:navigator.platform??""}const Kr="data-base-ui-focusable",u0="active",o0="selected",Eh="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function ma(i){let o=i.activeElement;for(;o?.shadowRoot?.activeElement!=null;)o=o.shadowRoot.activeElement;return o}function at(i,o){if(!i||!o)return!1;const s=o.getRootNode?.();if(i.contains(o))return!0;if(s&&Vr(s)){let r=o;for(;r;){if(i===r)return!0;r=r.parentNode||r.host}}return!1}function en(i){return"composedPath"in i?i.composedPath()[0]:i.target}function Pt(i,o){if(o==null)return!1;if("composedPath"in i)return i.composedPath().includes(o);const s=i;return s.target!=null&&o.contains(s.target)}function Th(i){return i.matches("html,body")}function Ot(i){return i?.ownerDocument||document}function wh(i){return On(i)&&i.matches(Eh)}function pm(i){return i?i.getAttribute("role")==="combobox"&&wh(i):!1}function Jr(i){return i?i.hasAttribute(Kr)?i:i.querySelector(`[${Kr}]`)||i:null}function ya(i,o,s=!0){return i.filter(f=>f.parentId===o&&(!s||f.context?.open)).flatMap(f=>[f,...ya(i,f.id,s)])}function hm(i,o){let s=[],r=i.find(f=>f.id===o)?.parentId;for(;r;){const f=i.find(_=>_.id===r);r=f?.parentId,f&&(s=s.concat(f))}return s}function Ch(i){i.preventDefault(),i.stopPropagation()}function Oh(i){return"nativeEvent"in i}function zh(i){return i.mozInputSource===0&&i.isTrusted?!0:Zr&&i.pointerType?i.type==="click"&&i.buttons===1:i.detail===0&&!i.pointerType}function Ah(i){return bh?!1:!Zr&&i.width===0&&i.height===0||Zr&&i.width===1&&i.height===1&&i.pressure===0&&i.detail===0&&i.pointerType==="mouse"||i.width<1&&i.height<1&&i.pressure===0&&i.detail===0&&i.pointerType==="touch"}function Rh(i){const o=i.type;return o==="click"||o==="mousedown"||o==="keydown"||o==="keyup"}var Nh=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],Pu=Nh.join(","),s0=typeof Element>"u",ba=s0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,eo=!s0&&Element.prototype.getRootNode?function(i){var o;return i==null||(o=i.getRootNode)===null||o===void 0?void 0:o.call(i)}:function(i){return i?.ownerDocument},to=function(o,s){var r;s===void 0&&(s=!0);var f=o==null||(r=o.getAttribute)===null||r===void 0?void 0:r.call(o,"inert"),_=f===""||f==="true",p=_||s&&o&&(typeof o.closest=="function"?o.closest("[inert]"):to(o.parentNode));return p},jh=function(o){var s,r=o==null||(s=o.getAttribute)===null||s===void 0?void 0:s.call(o,"contenteditable");return r===""||r==="true"},r0=function(o,s,r){if(to(o))return[];var f=Array.prototype.slice.apply(o.querySelectorAll(Pu));return s&&ba.call(o,Pu)&&f.unshift(o),f=f.filter(r),f},no=function(o,s,r){for(var f=[],_=Array.from(o);_.length;){var p=_.shift();if(!to(p,!1))if(p.tagName==="SLOT"){var x=p.assignedElements(),h=x.length?x:p.children,m=no(h,!0,r);r.flatten?f.push.apply(f,m):f.push({scopeParent:p,candidates:m})}else{var R=ba.call(p,Pu);R&&r.filter(p)&&(s||!o.includes(p))&&f.push(p);var E=p.shadowRoot||typeof r.getShadowRoot=="function"&&r.getShadowRoot(p),z=!to(E,!1)&&(!r.shadowRootFilter||r.shadowRootFilter(p));if(E&&z){var j=no(E===!0?p.children:E.children,!0,r);r.flatten?f.push.apply(f,j):f.push({scopeParent:p,candidates:j})}else _.unshift.apply(_,p.children)}}return f},c0=function(o){return!isNaN(parseInt(o.getAttribute("tabindex"),10))},f0=function(o){if(!o)throw new Error("No node provided");return o.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(o.tagName)||jh(o))&&!c0(o)?0:o.tabIndex},Mh=function(o,s){var r=f0(o);return r<0&&s&&!c0(o)?0:r},Dh=function(o,s){return o.tabIndex===s.tabIndex?o.documentOrder-s.documentOrder:o.tabIndex-s.tabIndex},d0=function(o){return o.tagName==="INPUT"},Uh=function(o){return d0(o)&&o.type==="hidden"},kh=function(o){var s=o.tagName==="DETAILS"&&Array.prototype.slice.apply(o.children).some(function(r){return r.tagName==="SUMMARY"});return s},Yh=function(o,s){for(var r=0;r<o.length;r++)if(o[r].checked&&o[r].form===s)return o[r]},Bh=function(o){if(!o.name)return!0;var s=o.form||eo(o),r=function(x){return s.querySelectorAll('input[type="radio"][name="'+x+'"]')},f;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")f=r(window.CSS.escape(o.name));else try{f=r(o.name)}catch(p){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",p.message),!1}var _=Yh(f,o.form);return!_||_===o},Lh=function(o){return d0(o)&&o.type==="radio"},Hh=function(o){return Lh(o)&&!Bh(o)},Xh=function(o){var s,r=o&&eo(o),f=(s=r)===null||s===void 0?void 0:s.host,_=!1;if(r&&r!==o){var p,x,h;for(_=!!((p=f)!==null&&p!==void 0&&(x=p.ownerDocument)!==null&&x!==void 0&&x.contains(f)||o!=null&&(h=o.ownerDocument)!==null&&h!==void 0&&h.contains(o));!_&&f;){var m,R,E;r=eo(f),f=(m=r)===null||m===void 0?void 0:m.host,_=!!((R=f)!==null&&R!==void 0&&(E=R.ownerDocument)!==null&&E!==void 0&&E.contains(f))}}return _},bm=function(o){var s=o.getBoundingClientRect(),r=s.width,f=s.height;return r===0&&f===0},qh=function(o,s){var r=s.displayCheck,f=s.getShadowRoot;if(r==="full-native"&&"checkVisibility"in o){var _=o.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!_}if(getComputedStyle(o).visibility==="hidden")return!0;var p=ba.call(o,"details>summary:first-of-type"),x=p?o.parentElement:o;if(ba.call(x,"details:not([open]) *"))return!0;if(!r||r==="full"||r==="full-native"||r==="legacy-full"){if(typeof f=="function"){for(var h=o;o;){var m=o.parentElement,R=eo(o);if(m&&!m.shadowRoot&&f(m)===!0)return bm(o);o.assignedSlot?o=o.assignedSlot:!m&&R!==o.ownerDocument?o=R.host:o=m}o=h}if(Xh(o))return!o.getClientRects().length;if(r!=="legacy-full")return!0}else if(r==="non-zero-area")return bm(o);return!1},Qh=function(o){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(o.tagName))for(var s=o.parentElement;s;){if(s.tagName==="FIELDSET"&&s.disabled){for(var r=0;r<s.children.length;r++){var f=s.children.item(r);if(f.tagName==="LEGEND")return ba.call(s,"fieldset[disabled] *")?!0:!f.contains(o)}return!0}s=s.parentElement}return!1},Ir=function(o,s){return!(s.disabled||Uh(s)||qh(s,o)||kh(s)||Qh(s))},Fr=function(o,s){return!(Hh(s)||f0(s)<0||!Ir(o,s))},Gh=function(o){var s=parseInt(o.getAttribute("tabindex"),10);return!!(isNaN(s)||s>=0)},_0=function(o){var s=[],r=[];return o.forEach(function(f,_){var p=!!f.scopeParent,x=p?f.scopeParent:f,h=Mh(x,p),m=p?_0(f.candidates):x;h===0?p?s.push.apply(s,m):s.push(x):r.push({documentOrder:_,tabIndex:h,item:f,isScope:p,content:m})}),r.sort(Dh).reduce(function(f,_){return _.isScope?f.push.apply(f,_.content):f.push(_.content),f},[]).concat(s)},co=function(o,s){s=s||{};var r;return s.getShadowRoot?r=no([o],s.includeContainer,{filter:Fr.bind(null,s),flatten:!1,getShadowRoot:s.getShadowRoot,shadowRootFilter:Gh}):r=r0(o,s.includeContainer,Fr.bind(null,s)),_0(r)},Vh=function(o,s){s=s||{};var r;return s.getShadowRoot?r=no([o],s.includeContainer,{filter:Ir.bind(null,s),flatten:!0,getShadowRoot:s.getShadowRoot}):r=r0(o,s.includeContainer,Ir.bind(null,s)),r},m0=function(o,s){if(s=s||{},!o)throw new Error("No node provided");return ba.call(o,Pu)===!1?!1:Fr(s,o)};const Ti=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function g0(i,o){const s=co(i,Ti()),r=s.length;if(r===0)return;const f=ma(Ot(i)),_=s.indexOf(f),p=_===-1?o===1?0:r-1:_+o;return s[p]}function y0(i){return g0(Ot(i).body,1)||i}function p0(i){return g0(Ot(i).body,-1)||i}function hi(i,o){const s=o||i.currentTarget,r=i.relatedTarget;return!r||!at(s,r)}function Zh(i){co(i,Ti()).forEach(s=>{s.dataset.tabindex=s.getAttribute("tabindex")||"",s.setAttribute("tabindex","-1")})}function vm(i){i.querySelectorAll("[data-tabindex]").forEach(s=>{const r=s.dataset.tabindex;delete s.dataset.tabindex,r?s.setAttribute("tabindex",r):s.removeAttribute("tabindex")})}function Kh(){const i=new Map;return{emit(o,s){i.get(o)?.forEach(r=>r(s))},on(o,s){i.has(o)||i.set(o,new Set),i.get(o).add(s)},off(o,s){i.get(o)?.delete(s)}}}const Jh=T.createContext(null),Ih=T.createContext(null),h0=()=>T.useContext(Jh)?.id||null,b0=i=>{const o=T.useContext(Ih);return i??o};function lo(i){return`data-base-ui-${i}`}const Fh={clipPath:"inset(50%)",overflow:"hidden",whiteSpace:"nowrap",border:0,padding:0,width:1,height:1,margin:-1},v0={...Fh,position:"fixed",top:0,left:0},Qu=null;class Wh{callbacks=[];callbacksCount=0;nextId=1;startId=1;isScheduled=!1;tick=o=>{this.isScheduled=!1;const s=this.callbacks,r=this.callbacksCount;if(this.callbacks=[],this.callbacksCount=0,this.startId=this.nextId,r>0)for(let f=0;f<s.length;f+=1)s[f]?.(o)};request(o){const s=this.nextId;return this.nextId+=1,this.callbacks.push(o),this.callbacksCount+=1,!this.isScheduled&&(requestAnimationFrame(this.tick),this.isScheduled=!0),s}cancel(o){const s=o-this.startId;s<0||s>=this.callbacks.length||(this.callbacks[s]=null,this.callbacksCount-=1)}}const Gu=new Wh;class un{static create(){return new un}static request(o){return Gu.request(o)}static cancel(o){return Gu.cancel(o)}currentId=Qu;request(o){this.cancel(),this.currentId=Gu.request(()=>{this.currentId=Qu,o()})}cancel=()=>{this.currentId!==Qu&&(Gu.cancel(this.currentId),this.currentId=Qu)};disposeEffect=()=>this.cancel}function x0(){const i=al(un.create).current;return n0(i.disposeEffect),i}function wi(i){return i?.ownerDocument||document}const ao=T.forwardRef(function(o,s){const[r,f]=T.useState();rt(()=>{hh&&f("button")},[]);const _={tabIndex:0,role:r};return g.jsx("span",{...o,ref:s,style:v0,"aria-hidden":r?void 0:!0,..._,"data-base-ui-focus-guard":""})});let xm=0;function Mr(i,o={}){const{preventScroll:s=!1,cancelPrevious:r=!0,sync:f=!1}=o;r&&cancelAnimationFrame(xm);const _=()=>i?.focus({preventScroll:s});f?_():xm=requestAnimationFrame(_)}const pa={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function Sm(i){return i==="inert"?pa.inert:i==="aria-hidden"?pa["aria-hidden"]:pa.none}let Vu=new WeakSet,Zu={},Dr=0;const S0=i=>i&&(i.host||S0(i.parentNode)),$h=(i,o)=>o.map(s=>{if(i.contains(s))return s;const r=S0(s);return i.contains(r)?r:null}).filter(s=>s!=null);function Ph(i,o,s,r){const f="data-base-ui-inert",_=r?"inert":s?"aria-hidden":null,p=$h(o,i),x=new Set,h=new Set(p),m=[];Zu[f]||(Zu[f]=new WeakMap);const R=Zu[f];p.forEach(E),z(o),x.clear();function E(j){!j||x.has(j)||(x.add(j),j.parentNode&&E(j.parentNode))}function z(j){!j||h.has(j)||[].forEach.call(j.children,B=>{if(so(B)!=="script")if(x.has(B))z(B);else{const L=_?B.getAttribute(_):null,I=L!==null&&L!=="false",Z=Sm(_),$=(Z.get(B)||0)+1,G=(R.get(B)||0)+1;Z.set(B,$),R.set(B,G),m.push(B),$===1&&I&&Vu.add(B),G===1&&B.setAttribute(f,""),!I&&_&&B.setAttribute(_,_==="inert"?"":"true")}})}return Dr+=1,()=>{m.forEach(j=>{const B=Sm(_),I=(B.get(j)||0)-1,Z=(R.get(j)||0)-1;B.set(j,I),R.set(j,Z),I||(!Vu.has(j)&&_&&j.removeAttribute(_),Vu.delete(j)),Z||j.removeAttribute(f)}),Dr-=1,Dr||(pa.inert=new WeakMap,pa["aria-hidden"]=new WeakMap,pa.none=new WeakMap,Vu=new WeakSet,Zu={})}}function eb(i,o=!1,s=!1){const r=Ot(i[0]).body;return Ph(i.concat(Array.from(r.querySelectorAll("[aria-live]"))),r,o,s)}const E0=T.createContext(null),T0=()=>T.useContext(E0),tb=lo("portal");function nb(i={}){const{ref:o,container:s,componentProps:r=Jt,elementProps:f,elementState:_}=i,p=tc(),h=T0()?.portalNode,[m,R]=T.useState(null),[E,z]=T.useState(null),j=je(Z=>{Z!==null&&z(Z)}),B=T.useRef(null);rt(()=>{if(s===null){B.current&&(B.current=null,z(null),R(null));return}if(p==null)return;const Z=(s&&(Pr(s)?s:s.current))??h??document.body;if(Z==null){B.current&&(B.current=null,z(null),R(null));return}B.current!==Z&&(B.current=Z,z(null),R(Z))},[s,h,p]);const L=uo("div",r,{ref:[o,j],state:_,props:[{id:p,[tb]:""},f]});return{portalNode:E,portalSubtree:m&&L?Wr.createPortal(L,m):null}}const lb=T.forwardRef(function(o,s){const{children:r,container:f,className:_,render:p,renderGuards:x,...h}=o,{portalNode:m,portalSubtree:R}=nb({container:f,ref:s,componentProps:o,elementProps:h}),E=T.useRef(null),z=T.useRef(null),j=T.useRef(null),B=T.useRef(null),[L,I]=T.useState(null),Z=L?.modal,$=L?.open,G=typeof x=="boolean"?x:!!L&&!L.modal&&L.open&&!!m;T.useEffect(()=>{if(!m||Z)return;function te(ne){m&&ne.relatedTarget&&hi(ne)&&(ne.type==="focusin"?vm:Zh)(m)}return m.addEventListener("focusin",te,!0),m.addEventListener("focusout",te,!0),()=>{m.removeEventListener("focusin",te,!0),m.removeEventListener("focusout",te,!0)}},[m,Z]),T.useEffect(()=>{!m||$||vm(m)},[$,m]);const Q=T.useMemo(()=>({beforeOutsideRef:E,afterOutsideRef:z,beforeInsideRef:j,afterInsideRef:B,portalNode:m,setFocusManagerState:I}),[m]);return g.jsxs(T.Fragment,{children:[R,g.jsxs(E0.Provider,{value:Q,children:[G&&m&&g.jsx(ao,{"data-type":"outside",ref:E,onFocus:te=>{if(hi(te,m))j.current?.focus();else{const ne=L?L.domReference:null;p0(ne)?.focus()}}}),G&&m&&g.jsx("span",{"aria-owns":m.id,style:kp}),m&&Wr.createPortal(r,m),G&&m&&g.jsx(ao,{"data-type":"outside",ref:z,onFocus:te=>{if(hi(te,m))B.current?.focus();else{const ne=L?L.domReference:null;y0(ne)?.focus(),L?.closeOnFocusOut&&L?.onOpenChange(!1,zn(t0,te.nativeEvent))}}})]})]})});function Cn(i){return i==null?i:"current"in i?i.current:i}function ab(i,o){const s=on(i.target);return i instanceof s.KeyboardEvent?"keyboard":i instanceof s.FocusEvent?o||"keyboard":"pointerType"in i?i.pointerType||"keyboard":"touches"in i?"touch":i instanceof s.MouseEvent?o||(i.detail===0?"keyboard":"mouse"):""}const Em=20;let ll=[];function nc(){ll=ll.filter(i=>i.isConnected)}function ib(i){nc(),i&&so(i)!=="body"&&(ll.push(i),ll.length>Em&&(ll=ll.slice(-Em)))}function Ur(){return nc(),ll[ll.length-1]}function ub(i){if(!i)return null;const o=Ti();return m0(i,o)?i:co(i,o)[0]||i}function ob(i){return!i||!i.isConnected?!1:typeof i.checkVisibility=="function"?i.checkVisibility():ec(i).display!=="none"}function Tm(i,o){if(!o.current.includes("floating")&&!i.getAttribute("role")?.includes("dialog"))return;const s=Ti(),f=Vh(i,s).filter(p=>{const x=p.getAttribute("data-tabindex")||"";return m0(p,s)||p.hasAttribute("data-tabindex")&&!x.startsWith("-")}),_=i.getAttribute("tabindex");o.current.includes("floating")||f.length===0?_!=="0"&&i.setAttribute("tabindex","0"):(_!=="-1"||i.hasAttribute("data-tabindex")&&i.getAttribute("data-tabindex")!=="-1")&&(i.setAttribute("tabindex","-1"),i.setAttribute("data-tabindex","-1"))}function sb(i){const{context:o,children:s,disabled:r=!1,order:f=["content"],initialFocus:_=!0,returnFocus:p=!0,restoreFocus:x=!1,modal:h=!0,closeOnFocusOut:m=!0,openInteractionType:R="",getInsideElements:E=()=>[],nextFocusableElement:z,previousFocusableElement:j,beforeContentFocusGuardRef:B,externalTree:L}=i,I="rootStore"in o?o.rootStore:o,Z=I.useState("open"),$=I.useState("domReferenceElement"),G=I.useState("floatingElement"),{events:Q,dataRef:te}=I.context,ne=je(()=>te.current.floatingContext?.nodeId),F=je(E),ue=_===!1,H=pm($)&&ue,le=qu(f),re=qu(_),Ce=qu(p),We=qu(R),Xe=b0(L),ce=T0(),N=T.useRef(null),q=T.useRef(null),K=T.useRef(!1),ae=T.useRef(!1),ve=T.useRef(!1),b=T.useRef(-1),k=T.useRef(""),X=T.useRef(""),J=T.useRef(null),se=T.useRef(null),pe=Wu(J,B,ce?.beforeInsideRef),Ee=Wu(se,ce?.afterInsideRef),Je=$u(),Me=$u(),Yt=x0(),It=ce!=null,D=Jr(G),ge=je((V=D)=>V?co(V,Ti()):[]),ee=je(V=>{const de=ge(V);return le.current.map(()=>de).filter(Boolean).flat()});T.useEffect(()=>{if(r||!h)return;function V(be){be.key==="Tab"&&at(D,ma(Ot(D)))&&ge().length===0&&!H&&Ch(be)}const de=Ot(D);return de.addEventListener("keydown",V),()=>{de.removeEventListener("keydown",V)}},[r,$,D,h,le,H,ge,ee]),T.useEffect(()=>{if(r||!G)return;function V(de){const be=en(de),Ge=ge().indexOf(be);Ge!==-1&&(b.current=Ge)}return G.addEventListener("focusin",V),()=>{G.removeEventListener("focusin",V)}},[r,G,ge]),T.useEffect(()=>{if(r||!Z)return;const V=Ot(D);function de(){ve.current=!1}function be(Ge){const _e=en(Ge),fe=at(G,_e)||at($,_e)||at(ce?.portalNode,_e);ve.current=!fe,X.current=Ge.pointerType||"keyboard"}function ze(){X.current="keyboard"}return V.addEventListener("pointerdown",be,!0),V.addEventListener("pointerup",de,!0),V.addEventListener("pointercancel",de,!0),V.addEventListener("keydown",ze,!0),()=>{V.removeEventListener("pointerdown",be,!0),V.removeEventListener("pointerup",de,!0),V.removeEventListener("pointercancel",de,!0),V.removeEventListener("keydown",ze,!0)}},[r,G,$,D,Z,ce]),T.useEffect(()=>{if(r||!m)return;function V(){ae.current=!0,Me.start(0,()=>{ae.current=!1})}function de(_e){const fe=_e.relatedTarget,pt=_e.currentTarget,Ye=en(_e);queueMicrotask(()=>{const An=ne(),il=I.context.triggerElements,Cl=fe?.hasAttribute(lo("focus-guard"))&&[J.current,se.current,ce?.beforeInsideRef.current,ce?.afterInsideRef.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,Cn(j),Cn(z)].includes(fe),Rn=!(at($,fe)||at(G,fe)||at(fe,G)||at(ce?.portalNode,fe)||fe!=null&&il.hasElement(fe)||il.hasMatchingElement(bt=>at(bt,fe))||Cl||Xe&&(ya(Xe.nodesRef.current,An).find(bt=>at(bt.context?.elements.floating,fe)||at(bt.context?.elements.domReference,fe))||hm(Xe.nodesRef.current,An).find(bt=>[bt.context?.elements.floating,Jr(bt.context?.elements.floating)].includes(fe)||bt.context?.elements.domReference===fe)));if(pt===$&&D&&Tm(D,le),x&&pt!==$&&!ob(Ye)&&ma(Ot(D))===Ot(D).body){if(On(D)&&(D.focus(),x==="popup")){Yt.request(()=>{D.focus()});return}const bt=b.current,Nn=ge(),Ol=Nn[bt]||Nn[Nn.length-1]||D;On(Ol)&&Ol.focus()}if(te.current.insideReactTree){te.current.insideReactTree=!1;return}(H||!h)&&fe&&Rn&&!ae.current&&(H||fe!==Ur())&&(K.current=!0,I.setOpen(!1,zn(t0,_e)))})}function be(){ve.current||(te.current.insideReactTree=!0,Je.start(0,()=>{te.current.insideReactTree=!1}))}const ze=On($)?$:null,Ge=[];if(!(!G&&!ze))return ze&&(ze.addEventListener("focusout",de),ze.addEventListener("pointerdown",V),Ge.push(()=>{ze.removeEventListener("focusout",de),ze.removeEventListener("pointerdown",V)})),G&&(G.addEventListener("focusout",de),ce&&(G.addEventListener("focusout",be,!0),Ge.push(()=>{G.removeEventListener("focusout",be,!0)})),Ge.push(()=>{G.removeEventListener("focusout",de)})),()=>{Ge.forEach(_e=>{_e()})}},[r,$,G,D,h,Xe,ce,I,m,x,ge,H,ne,le,te,Je,Me,Yt,z,j]),T.useEffect(()=>{if(r||!G||!Z)return;const V=Array.from(ce?.portalNode?.querySelectorAll(`[${lo("portal")}]`)||[]),be=(Xe?hm(Xe.nodesRef.current,ne()):[]).find(_e=>pm(_e.context?.elements.domReference||null))?.context?.elements.domReference,ze=[G,be,...V,...F(),N.current,q.current,J.current,se.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,Cn(j),Cn(z),H?$:null].filter(_e=>_e!=null),Ge=eb(ze,h||H);return()=>{Ge()}},[Z,r,$,G,h,le,ce,H,Xe,ne,F,z,j]),rt(()=>{if(!Z||r||!On(D))return;const V=Ot(D),de=ma(V);queueMicrotask(()=>{const be=ee(D),ze=re.current,Ge=typeof ze=="function"?ze(We.current||""):ze;if(Ge===void 0||Ge===!1)return;let _e;Ge===!0||Ge===null?_e=be[0]||D:_e=Cn(Ge),_e=_e||be[0]||D,!at(D,de)&&Mr(_e,{preventScroll:_e===D})})},[r,Z,D,ue,ee,re,We]),rt(()=>{if(r||!D)return;const V=Ot(D),de=ma(V);ib(de);function be(_e){if(_e.open||(k.current=ab(_e.nativeEvent,X.current)),_e.reason===sh&&_e.nativeEvent.type==="mouseleave"&&(K.current=!0),_e.reason===e0)if(_e.nested)K.current=!1;else if(zh(_e.nativeEvent)||Ah(_e.nativeEvent))K.current=!1;else{let fe=!1;document.createElement("div").focus({get preventScroll(){return fe=!0,!1}}),fe?K.current=!1:K.current=!0}}Q.on("openchange",be);const ze=V.createElement("span");ze.setAttribute("tabindex","-1"),ze.setAttribute("aria-hidden","true"),Object.assign(ze.style,v0),It&&$&&$.insertAdjacentElement("afterend",ze);function Ge(){const _e=Ce.current;let fe=typeof _e=="function"?_e(k.current):_e;if(fe===void 0||fe===!1)return null;if(fe===null&&(fe=!0),typeof fe=="boolean"){const Ye=$||Ur();return Ye&&Ye.isConnected?Ye:ze}const pt=$||Ur()||ze;return Cn(fe)||pt}return()=>{Q.off("openchange",be);const _e=ma(V),fe=at(G,_e)||Xe&&ya(Xe.nodesRef.current,ne(),!1).some(Ye=>at(Ye.context?.elements.floating,_e)),pt=Ge();queueMicrotask(()=>{const Ye=ub(pt),An=typeof Ce.current!="boolean";Ce.current&&!K.current&&On(Ye)&&(!(!An&&Ye!==_e&&_e!==V.body)||fe)&&Ye.focus({preventScroll:!0}),ze.remove()})}},[r,G,D,Ce,te,Q,Xe,It,$,ne]),T.useEffect(()=>{queueMicrotask(()=>{K.current=!1})},[r]),T.useEffect(()=>{if(r||!Z)return;function V(be){en(be)?.closest(`[${Up}]`)&&(ae.current=!0)}const de=Ot(D);return de.addEventListener("pointerdown",V,!0),()=>{de.removeEventListener("pointerdown",V,!0)}},[r,Z,D]),rt(()=>{if(!r&&ce)return ce.setFocusManagerState({modal:h,closeOnFocusOut:m,open:Z,onOpenChange:I.setOpen,domReference:$}),()=>{ce.setFocusManagerState(null)}},[r,ce,h,Z,I,m,$]),rt(()=>{if(!(r||!D))return Tm(D,le),()=>{queueMicrotask(nc)}},[r,D,le]);const it=!r&&(h?!H:!0)&&(It||h);return g.jsxs(T.Fragment,{children:[it&&g.jsx(ao,{"data-type":"inside",ref:pe,onFocus:V=>{if(h){const de=ee();Mr(de[de.length-1])}else ce?.portalNode&&(K.current=!1,hi(V,ce.portalNode)?y0($)?.focus():Cn(j??ce.beforeOutsideRef)?.focus())}}),s,it&&g.jsx(ao,{"data-type":"inside",ref:Ee,onFocus:V=>{h?Mr(ee()[0]):ce?.portalNode&&(m&&(K.current=!0),hi(V,ce.portalNode)?p0($)?.focus():Cn(z??ce.afterOutsideRef)?.focus())}})]})}const rb={intentional:"onClick",sloppy:"onPointerDown"};function cb(i){return{escapeKey:typeof i=="boolean"?i:i?.escapeKey??!1,outsidePress:typeof i=="boolean"?i:i?.outsidePress??!0}}function fb(i,o={}){const s="rootStore"in i?i.rootStore:i,r=s.useState("open"),f=s.useState("floatingElement"),_=s.useState("referenceElement"),p=s.useState("domReferenceElement"),{onOpenChange:x,dataRef:h}=s.context,{enabled:m=!0,escapeKey:R=!0,outsidePress:E=!0,outsidePressEvent:z="sloppy",referencePress:j=!1,referencePressEvent:B="sloppy",ancestorScroll:L=!1,bubbles:I,externalTree:Z}=o,$=b0(Z),G=je(typeof E=="function"?E:()=>!1),Q=typeof E=="function"?G:E,te=T.useRef(!1),{escapeKey:ne,outsidePress:F}=cb(I),ue=T.useRef(null),H=$u(),le=$u(),re=je(()=>{le.clear(),h.current.insideReactTree=!1}),Ce=T.useRef(!1),We=T.useRef(""),Xe=je(D=>{We.current=D.pointerType}),ce=je(()=>{const D=We.current,ge=D==="pen"||!D?"mouse":D,ee=typeof z=="function"?z():z;return typeof ee=="string"?ee:ee[ge]}),N=je(D=>{if(!r||!m||!R||D.key!=="Escape"||Ce.current)return;const ge=h.current.floatingContext?.nodeId,ee=$?ya($.nodesRef.current,ge):[];if(!ne&&ee.length>0){let de=!0;if(ee.forEach(be=>{be.context?.open&&!be.context.dataRef.current.__escapeKeyBubbles&&(de=!1)}),!de)return}const it=Oh(D)?D.nativeEvent:D,V=zn(ch,it);s.setOpen(!1,V),!ne&&!V.isPropagationAllowed&&D.stopPropagation()}),q=je(D=>{const ge=ce();return ge==="intentional"&&D.type!=="click"||ge==="sloppy"&&D.type==="click"}),K=je(()=>{h.current.insideReactTree=!0,le.start(0,re)}),ae=je((D,ge=!1)=>{if(q(D)){re();return}if(h.current.insideReactTree){re();return}if(ce()==="intentional"&&ge||typeof Q=="function"&&!Q(D))return;const ee=en(D),it=`[${lo("inert")}]`,V=Ot(s.select("floatingElement")).querySelectorAll(it),de=s.context.triggerElements;if(ee&&(de.hasElement(ee)||de.hasMatchingElement(fe=>at(fe,ee))))return;let be=Tl(ee)?ee:null;for(;be&&!Fu(be);){const fe=$m(be);if(Fu(fe)||!Tl(fe))break;be=fe}if(V.length&&Tl(ee)&&!Th(ee)&&!at(ee,s.select("floatingElement"))&&Array.from(V).every(fe=>!at(be,fe)))return;if(On(ee)&&!("touches"in D)){const fe=Fu(ee),pt=ec(ee),Ye=/auto|scroll/,An=fe||Ye.test(pt.overflowX),il=fe||Ye.test(pt.overflowY),Cl=An&&ee.clientWidth>0&&ee.scrollWidth>ee.clientWidth,Rn=il&&ee.clientHeight>0&&ee.scrollHeight>ee.clientHeight,bt=pt.direction==="rtl",Nn=Rn&&(bt?D.offsetX<=ee.offsetWidth-ee.clientWidth:D.offsetX>ee.clientWidth),Ol=Cl&&D.offsetY>ee.clientHeight;if(Nn||Ol)return}const ze=h.current.floatingContext?.nodeId,Ge=$&&ya($.nodesRef.current,ze).some(fe=>Pt(D,fe.context?.elements.floating));if(Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||Ge)return;const _e=$?ya($.nodesRef.current,ze):[];if(_e.length>0){let fe=!0;if(_e.forEach(pt=>{pt.context?.open&&!pt.context.dataRef.current.__outsidePressBubbles&&(fe=!1)}),!fe)return}s.setOpen(!1,zn(e0,D)),re()}),ve=je(D=>{ce()!=="sloppy"||D.pointerType==="touch"||!s.select("open")||!m||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||ae(D)}),b=je(D=>{if(ce()!=="sloppy"||!s.select("open")||!m||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement")))return;const ge=D.touches[0];ge&&(ue.current={startTime:Date.now(),startX:ge.clientX,startY:ge.clientY,dismissOnTouchEnd:!1,dismissOnMouseDown:!0},H.start(1e3,()=>{ue.current&&(ue.current.dismissOnTouchEnd=!1,ue.current.dismissOnMouseDown=!1)}))}),k=je(D=>{const ge=en(D);function ee(){b(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),X=je(D=>{const ge=te.current;if(te.current=!1,H.clear(),D.type==="mousedown"&&ue.current&&!ue.current.dismissOnMouseDown)return;const ee=en(D);function it(){D.type==="pointerdown"?ve(D):ae(D,ge),ee?.removeEventListener(D.type,it)}ee?.addEventListener(D.type,it)}),J=je(D=>{if(ce()!=="sloppy"||!ue.current||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement")))return;const ge=D.touches[0];if(!ge)return;const ee=Math.abs(ge.clientX-ue.current.startX),it=Math.abs(ge.clientY-ue.current.startY),V=Math.sqrt(ee*ee+it*it);V>5&&(ue.current.dismissOnTouchEnd=!0),V>10&&(ae(D),H.clear(),ue.current=null)}),se=je(D=>{const ge=en(D);function ee(){J(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),pe=je(D=>{ce()!=="sloppy"||!ue.current||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||(ue.current.dismissOnTouchEnd&&ae(D),H.clear(),ue.current=null)}),Ee=je(D=>{const ge=en(D);function ee(){pe(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)});T.useEffect(()=>{if(!r||!m)return;h.current.__escapeKeyBubbles=ne,h.current.__outsidePressBubbles=F;const D=new ha;function ge(be){s.setOpen(!1,zn(oh,be))}function ee(){D.clear(),Ce.current=!0}function it(){D.start(Ip()?5:0,()=>{Ce.current=!1})}const V=Ot(f);V.addEventListener("pointerdown",Xe,!0),R&&(V.addEventListener("keydown",N),V.addEventListener("compositionstart",ee),V.addEventListener("compositionend",it)),Q&&(V.addEventListener("click",X,!0),V.addEventListener("pointerdown",X,!0),V.addEventListener("touchstart",k,!0),V.addEventListener("touchmove",se,!0),V.addEventListener("touchend",Ee,!0),V.addEventListener("mousedown",X,!0));let de=[];return L&&(Tl(p)&&(de=pi(p)),Tl(f)&&(de=de.concat(pi(f))),!Tl(_)&&_&&_.contextElement&&(de=de.concat(pi(_.contextElement)))),de=de.filter(be=>be!==V.defaultView?.visualViewport),de.forEach(be=>{be.addEventListener("scroll",ge,{passive:!0})}),()=>{V.removeEventListener("pointerdown",Xe,!0),R&&(V.removeEventListener("keydown",N),V.removeEventListener("compositionstart",ee),V.removeEventListener("compositionend",it)),Q&&(V.removeEventListener("click",X,!0),V.removeEventListener("pointerdown",X,!0),V.removeEventListener("touchstart",k,!0),V.removeEventListener("touchmove",se,!0),V.removeEventListener("touchend",Ee,!0),V.removeEventListener("mousedown",X,!0)),de.forEach(be=>{be.removeEventListener("scroll",ge)}),D.clear(),te.current=!1}},[h,f,_,p,R,Q,r,x,L,m,ne,F,N,ae,X,ve,k,se,Ee,Xe,s]),T.useEffect(re,[Q,re]);const Je=T.useMemo(()=>({onKeyDown:N,...j&&{[rb[B]]:D=>{s.setOpen(!1,zn(mm,D.nativeEvent))},...B!=="intentional"&&{onClick(D){s.setOpen(!1,zn(mm,D.nativeEvent))}}}}),[N,s,j,B]),Me=je(D=>{const ge=en(D.nativeEvent);!at(s.select("floatingElement"),ge)||D.button!==0||(te.current=!0)}),Yt=je(D=>{!r||!m||D.button!==0||(te.current=!0)}),It=T.useMemo(()=>({onKeyDown:N,onPointerDown:Me,onMouseDown:Me,onMouseUp:Me,onClickCapture:K,onMouseDownCapture(D){K(),Yt(D)},onPointerDownCapture(D){K(),Yt(D)},onMouseUpCapture:K,onTouchEndCapture:K,onTouchMoveCapture:K}),[N,Me,K,Yt]);return T.useMemo(()=>m?{reference:Je,floating:It,trigger:Je}:{},[m,Je,It])}var io=Symbol("NOT_FOUND");function db(i,o=`expected a function, instead received ${typeof i}`){if(typeof i!="function")throw new TypeError(o)}function _b(i,o=`expected an object, instead received ${typeof i}`){if(typeof i!="object")throw new TypeError(o)}function mb(i,o="expected all items to be functions, instead received the following types: "){if(!i.every(s=>typeof s=="function")){const s=i.map(r=>typeof r=="function"?`function ${r.name||"unnamed"}()`:typeof r).join(", ");throw new TypeError(`${o}[${s}]`)}}var wm=i=>Array.isArray(i)?i:[i];function gb(i){const o=Array.isArray(i[0])?i[0]:i;return mb(o,"createSelector expects all input-selectors to be functions, but received the following types: "),o}function yb(i,o){const s=[],{length:r}=i;for(let f=0;f<r;f++)s.push(i[f].apply(null,o));return s}function pb(i){let o;return{get(s){return o&&i(o.key,s)?o.value:io},put(s,r){o={key:s,value:r}},getEntries(){return o?[o]:[]},clear(){o=void 0}}}function hb(i,o){let s=[];function r(x){const h=s.findIndex(m=>o(x,m.key));if(h>-1){const m=s[h];return h>0&&(s.splice(h,1),s.unshift(m)),m.value}return io}function f(x,h){r(x)===io&&(s.unshift({key:x,value:h}),s.length>i&&s.pop())}function _(){return s}function p(){s=[]}return{get:r,put:f,getEntries:_,clear:p}}var bb=(i,o)=>i===o;function vb(i){return function(s,r){if(s===null||r===null||s.length!==r.length)return!1;const{length:f}=s;for(let _=0;_<f;_++)if(!i(s[_],r[_]))return!1;return!0}}function xb(i,o){const s=typeof o=="object"?o:{equalityCheck:o},{equalityCheck:r=bb,maxSize:f=1,resultEqualityCheck:_}=s,p=vb(r);let x=0;const h=f<=1?pb(p):hb(f,p);function m(){let R=h.get(arguments);if(R===io){if(R=i.apply(null,arguments),x++,_){const z=h.getEntries().find(j=>_(j.value,R));z&&(R=z.value,x!==0&&x--)}h.put(arguments,R)}return R}return m.clearCache=()=>{h.clear(),m.resetResultsCount()},m.resultsCount=()=>x,m.resetResultsCount=()=>{x=0},m}var Sb=class{constructor(i){this.value=i}deref(){return this.value}},Eb=typeof WeakRef<"u"?WeakRef:Sb,Tb=0,Cm=1;function Ku(){return{s:Tb,v:void 0,o:null,p:null}}function w0(i,o={}){let s=Ku();const{resultEqualityCheck:r}=o;let f,_=0;function p(){let x=s;const{length:h}=arguments;for(let E=0,z=h;E<z;E++){const j=arguments[E];if(typeof j=="function"||typeof j=="object"&&j!==null){let B=x.o;B===null&&(x.o=B=new WeakMap);const L=B.get(j);L===void 0?(x=Ku(),B.set(j,x)):x=L}else{let B=x.p;B===null&&(x.p=B=new Map);const L=B.get(j);L===void 0?(x=Ku(),B.set(j,x)):x=L}}const m=x;let R;if(x.s===Cm)R=x.v;else if(R=i.apply(null,arguments),_++,r){const E=f?.deref?.()??f;E!=null&&r(E,R)&&(R=E,_!==0&&_--),f=typeof R=="object"&&R!==null||typeof R=="function"?new Eb(R):R}return m.s=Cm,m.v=R,R}return p.clearCache=()=>{s=Ku(),p.resetResultsCount()},p.resultsCount=()=>_,p.resetResultsCount=()=>{_=0},p}function C0(i,...o){const s=typeof i=="function"?{memoize:i,memoizeOptions:o}:i,r=(...f)=>{let _=0,p=0,x,h={},m=f.pop();typeof m=="object"&&(h=m,m=f.pop()),db(m,`createSelector expects an output function after the inputs, but received: [${typeof m}]`);const R={...s,...h},{memoize:E,memoizeOptions:z=[],argsMemoize:j=w0,argsMemoizeOptions:B=[]}=R,L=wm(z),I=wm(B),Z=gb(f),$=E(function(){return _++,m.apply(null,arguments)},...L),G=j(function(){p++;const te=yb(Z,arguments);return x=$.apply(null,te),x},...I);return Object.assign(G,{resultFunc:m,memoizedResultFunc:$,dependencies:Z,dependencyRecomputations:()=>p,resetDependencyRecomputations:()=>{p=0},lastResult:()=>x,recomputations:()=>_,resetRecomputations:()=>{_=0},memoize:E,argsMemoize:j})};return Object.assign(r,{withTypes:()=>r}),r}var wb=C0(w0),Cb=Object.assign((i,o=wb)=>{_b(i,`createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof i}`);const s=Object.keys(i),r=s.map(_=>i[_]);return o(r,(..._)=>_.reduce((p,x,h)=>(p[s[h]]=x,p),{}))},{withTypes:()=>Cb});C0({memoize:xb,memoizeOptions:{maxSize:1,equalityCheck:Object.is}});const ke=(i,o,s,r,f,_,...p)=>{if(p.length>0)throw new Error(Si(1));let x;if(i)x=i;else throw new Error("Missing arguments");return x};var kr={exports:{}},Yr={};var Om;function Ob(){if(Om)return Yr;Om=1;var i=xi();function o(E,z){return E===z&&(E!==0||1/E===1/z)||E!==E&&z!==z}var s=typeof Object.is=="function"?Object.is:o,r=i.useState,f=i.useEffect,_=i.useLayoutEffect,p=i.useDebugValue;function x(E,z){var j=z(),B=r({inst:{value:j,getSnapshot:z}}),L=B[0].inst,I=B[1];return _(function(){L.value=j,L.getSnapshot=z,h(L)&&I({inst:L})},[E,j,z]),f(function(){return h(L)&&I({inst:L}),E(function(){h(L)&&I({inst:L})})},[E]),p(j),j}function h(E){var z=E.getSnapshot;E=E.value;try{var j=z();return!s(E,j)}catch{return!0}}function m(E,z){return z()}var R=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?m:x;return Yr.useSyncExternalStore=i.useSyncExternalStore!==void 0?i.useSyncExternalStore:R,Yr}var zm;function O0(){return zm||(zm=1,kr.exports=Ob()),kr.exports}var zb=O0(),Br={exports:{}},Lr={};var Am;function Ab(){if(Am)return Lr;Am=1;var i=xi(),o=O0();function s(m,R){return m===R&&(m!==0||1/m===1/R)||m!==m&&R!==R}var r=typeof Object.is=="function"?Object.is:s,f=o.useSyncExternalStore,_=i.useRef,p=i.useEffect,x=i.useMemo,h=i.useDebugValue;return Lr.useSyncExternalStoreWithSelector=function(m,R,E,z,j){var B=_(null);if(B.current===null){var L={hasValue:!1,value:null};B.current=L}else L=B.current;B=x(function(){function Z(ne){if(!$){if($=!0,G=ne,ne=z(ne),j!==void 0&&L.hasValue){var F=L.value;if(j(F,ne))return Q=F}return Q=ne}if(F=Q,r(G,ne))return F;var ue=z(ne);return j!==void 0&&j(F,ue)?(G=ne,F):(G=ne,Q=ue)}var $=!1,G,Q,te=E===void 0?null:E;return[function(){return Z(R())},te===null?void 0:function(){return Z(te())}]},[R,E,z,j]);var I=f(m,B[0],B[1]);return p(function(){L.hasValue=!0,L.value=I},[I]),h(I),I},Lr}var Rm;function Rb(){return Rm||(Rm=1,Br.exports=Ab()),Br.exports}var Nb=Rb();const jb=$r(19),Mb=jb?Ub:kb;function Db(i,o,s,r,f){return Mb(i,o,s,r,f)}function Ub(i,o,s,r,f){const _=T.useCallback(()=>o(i.getSnapshot(),s,r,f),[i,o,s,r,f]);return zb.useSyncExternalStore(i.subscribe,_,_)}function kb(i,o,s,r,f){return Nb.useSyncExternalStoreWithSelector(i.subscribe,i.getSnapshot,i.getSnapshot,_=>o(_,s,r,f))}class bi{constructor(o){this.state=o,this.listeners=new Set,this.updateTick=0}subscribe=o=>(this.listeners.add(o),()=>{this.listeners.delete(o)});getSnapshot=()=>this.state;setState(o){if(this.state===o)return;this.state=o,this.updateTick+=1;const s=this.updateTick;for(const r of this.listeners){if(s!==this.updateTick)return;r(o)}}update(o){for(const s in o)if(!Object.is(this.state[s],o[s])){bi.prototype.setState.call(this,{...this.state,...o});return}}set(o,s){Object.is(this.state[o],s)||bi.prototype.setState.call(this,{...this.state,[o]:s})}notifyAll(){const o={...this.state};bi.prototype.setState.call(this,o)}}class z0 extends bi{constructor(o,s={},r){super(o),this.context=s,this.selectors=r}controlledValues=new Map;useSyncedValue(o,s){T.useDebugValue(o),rt(()=>{this.state[o]!==s&&this.set(o,s)},[o,s])}useSyncedValueWithCleanup(o,s){const r=this;rt(()=>(r.state[o]!==s&&r.set(o,s),()=>{r.set(o,void 0)}),[r,o,s])}useSyncedValues(o){const s=this,r=Object.values(o);rt(()=>{s.update(o)},[s,...r])}useControlledProp(o,s,r){T.useDebugValue(o);const f=this,_=s!==void 0;this.controlledValues.has(o)||(this.controlledValues.set(o,_),!_&&!Object.is(this.state[o],r)&&super.setState({...this.state,[o]:r})),rt(()=>{_&&!Object.is(f.state[o],s)&&super.setState({...f.state,[o]:s})},[f,o,s,r,_])}set(o,s){this.controlledValues.get(o)!==!0&&super.set(o,s)}update(o){const s={...o};for(const r in s)if(Object.hasOwn(s,r)&&this.controlledValues.get(r)===!0){delete s[r];continue}super.update(s)}setState(o){const s={...o};for(const r in s)if(Object.hasOwn(s,r)&&this.controlledValues.get(r)===!0){delete s[r];continue}super.setState({...this.state,...s})}select=(o,s,r,f)=>{const _=this.selectors[o];return _(this.state,s,r,f)};useState=(o,s,r,f)=>{T.useDebugValue(o);const _=this.selectors[o];return Db(this,_,s,r,f)};useContextCallback(o,s){T.useDebugValue(o);const r=je(s??Im);this.context[o]=r}useStateSetter(o){const s=T.useRef(void 0);return s.current===void 0&&(s.current=r=>{this.set(o,r)}),s.current}observe(o,s){let r;typeof o=="function"?r=o:r=this.selectors[o];let f=r(this.state);return s(f,f,this),this.subscribe(_=>{const p=r(_);if(!Object.is(f,p)){const x=f;f=p,s(p,x,this)}})}}const Yb={open:ke(i=>i.open),domReferenceElement:ke(i=>i.domReferenceElement),referenceElement:ke(i=>i.positionReference??i.referenceElement),floatingElement:ke(i=>i.floatingElement),floatingId:ke(i=>i.floatingId)};class A0 extends z0{constructor(o){const{nested:s,noEmit:r,onOpenChange:f,triggerElements:_,...p}=o;super({...p,positionReference:p.referenceElement,domReferenceElement:p.referenceElement},{onOpenChange:f,dataRef:{current:{}},events:Kh(),nested:s,noEmit:r,triggerElements:_},Yb)}setOpen=(o,s)=>{if((!o||!this.state.open||Rh(s.event))&&(this.context.dataRef.current.openEvent=o?s.event:void 0),!this.context.noEmit){const r={open:o,reason:s.reason,nativeEvent:s.event,nested:this.context.nested,triggerElement:s.trigger};this.context.events.emit("openchange",r)}this.context.onOpenChange?.(o,s)}}function Bb(i,o=!1,s=!1){const[r,f]=T.useState(i&&o?"idle":void 0),[_,p]=T.useState(i);return i&&!_&&(p(!0),f("starting")),!i&&_&&r!=="ending"&&!s&&f("ending"),!i&&!_&&r==="ending"&&f(void 0),rt(()=>{if(!i&&_&&r!=="ending"&&s){const x=un.request(()=>{f("ending")});return()=>{un.cancel(x)}}},[i,_,r,s]),rt(()=>{if(!i||o)return;const x=un.request(()=>{f(void 0)});return()=>{un.cancel(x)}},[o,i]),rt(()=>{if(!i||!o)return;i&&_&&r!=="idle"&&f("starting");const x=un.request(()=>{f("idle")});return()=>{un.cancel(x)}},[o,i,_,f,r]),T.useMemo(()=>({mounted:_,setMounted:p,transitionStatus:r}),[_,r])}function Lb(i,o=!1,s=!0){const r=x0();return je((f,_=null)=>{r.cancel();function p(){Wr.flushSync(f)}const x=Cn(i);if(x==null)return;const h=x;if(typeof h.getAnimations!="function"||globalThis.BASE_UI_ANIMATIONS_DISABLED)f();else{let E=function(){const j=vi.startingStyle;if(!h.hasAttribute(j)){r.request(z);return}const B=new MutationObserver(()=>{h.hasAttribute(j)||(B.disconnect(),z())});B.observe(h,{attributes:!0,attributeFilter:[j]}),_?.addEventListener("abort",()=>B.disconnect(),{once:!0})},z=function(){Promise.all(h.getAnimations().map(j=>j.finished)).then(()=>{_?.aborted||p()}).catch(()=>{const j=h.getAnimations();if(s){if(_?.aborted)return;p()}else j.length>0&&j.some(B=>B.pending||B.playState!=="finished")&&z()})};var m=E,R=z;if(o){E();return}r.request(z)}})}function R0(i){const{enabled:o=!0,open:s,ref:r,onComplete:f}=i,_=je(f),p=Lb(r,s,!1);T.useEffect(()=>{if(!o)return;const x=new AbortController;return p(_,x.signal),()=>{x.abort()}},[o,s,_,p])}function Hb(i){const o=i.useState("open");rt(()=>{if(o&&!i.select("activeTriggerId")&&i.context.triggerElements.size===1){const s=i.context.triggerElements.entries().next();if(!s.done){const[r,f]=s.value;i.update({activeTriggerId:r,activeTriggerElement:f})}}},[o,i])}function Xb(i,o,s){const{mounted:r,setMounted:f,transitionStatus:_}=Bb(i);o.useSyncedValues({mounted:r,transitionStatus:_});const p=je(()=>{f(!1),o.update({activeTriggerId:null,activeTriggerElement:null,mounted:!1}),s?.(),o.context.onOpenChangeComplete?.(!1)}),x=o.useState("preventUnmountingOnClose");return R0({enabled:!x,open:i,ref:o.context.popupRef,onComplete(){i||p()}}),{forceUnmount:p,transitionStatus:_}}class N0{constructor(){this.elements=new Set,this.idMap=new Map}add(o,s){const r=this.idMap.get(o);r!==s&&(r!==void 0&&this.elements.delete(r),this.elements.add(s),this.idMap.set(o,s))}delete(o){const s=this.idMap.get(o);s&&(this.elements.delete(s),this.idMap.delete(o))}hasElement(o){return this.elements.has(o)}hasMatchingElement(o){for(const s of this.elements)if(o(s))return!0;return!1}getById(o){return this.idMap.get(o)}entries(){return this.idMap.entries()}get size(){return this.idMap.size}}function qb(){return new A0({open:!1,floatingElement:null,referenceElement:null,triggerElements:new N0,floatingId:"",nested:!1,noEmit:!1,onOpenChange:void 0})}function Qb(){return{open:!1,mounted:!1,transitionStatus:"idle",floatingRootContext:qb(),preventUnmountingOnClose:!1,payload:void 0,activeTriggerId:null,activeTriggerElement:null,popupElement:null,positionerElement:null,activeTriggerProps:Jt,inactiveTriggerProps:Jt,popupProps:Jt}}const Gb={open:ke(i=>i.open),mounted:ke(i=>i.mounted),transitionStatus:ke(i=>i.transitionStatus),floatingRootContext:ke(i=>i.floatingRootContext),preventUnmountingOnClose:ke(i=>i.preventUnmountingOnClose),payload:ke(i=>i.payload),activeTriggerId:ke(i=>i.activeTriggerId),activeTriggerElement:ke(i=>i.mounted?i.activeTriggerElement:null),isTriggerActive:ke((i,o)=>o!==void 0&&i.activeTriggerId===o),isOpenedByTrigger:ke((i,o)=>o!==void 0&&i.activeTriggerId===o&&i.open),isMountedByTrigger:ke((i,o)=>o!==void 0&&i.activeTriggerId===o&&i.mounted),triggerProps:ke((i,o)=>o?i.activeTriggerProps:i.inactiveTriggerProps),popupProps:ke(i=>i.popupProps),popupElement:ke(i=>i.popupElement),positionerElement:ke(i=>i.positionerElement)};function Vb(i){const{popupStore:o,noEmit:s=!1,treatPopupAsFloatingElement:r=!1,onOpenChange:f}=i,_=tc(),p=h0()!=null,x=o.useState("open"),h=o.useState("activeTriggerElement"),m=o.useState(r?"popupElement":"positionerElement"),R=o.context.triggerElements,E=al(()=>new A0({open:x,referenceElement:h,floatingElement:m,triggerElements:R,onOpenChange:f,floatingId:_,nested:p,noEmit:s})).current;return rt(()=>{const z={open:x,floatingId:_,referenceElement:h,floatingElement:m};Tl(h)&&(z.domReferenceElement=h),E.state.positionReference===E.state.referenceElement&&(z.positionReference=h),E.update(z)},[x,_,h,m,E]),E.context.onOpenChange=f,E.context.nested=p,E.context.noEmit=s,E}function Zb(i=[]){const o=i.map(m=>m?.reference),s=i.map(m=>m?.floating),r=i.map(m=>m?.item),f=i.map(m=>m?.trigger),_=T.useCallback(m=>Ju(m,i,"reference"),o),p=T.useCallback(m=>Ju(m,i,"floating"),s),x=T.useCallback(m=>Ju(m,i,"item"),r),h=T.useCallback(m=>Ju(m,i,"trigger"),f);return T.useMemo(()=>({getReferenceProps:_,getFloatingProps:p,getItemProps:x,getTriggerProps:h}),[_,p,x,h])}function Ju(i,o,s){const r=new Map,f=s==="item",_={};s==="floating"&&(_.tabIndex=-1,_[Kr]="");for(const p in i)f&&i&&(p===u0||p===o0)||(_[p]=i[p]);for(let p=0;p<o.length;p+=1){let x;const h=o[p]?.[s];typeof h=="function"?x=i?h(i):null:x=h,x&&Nm(_,x,f,r)}return Nm(_,i,f,r),_}function Nm(i,o,s,r){for(const f in o){const _=o[f];s&&(f===u0||f===o0)||(f.startsWith("on")?(r.has(f)||r.set(f,[]),typeof _=="function"&&(r.get(f)?.push(_),i[f]=(...p)=>r.get(f)?.map(x=>x(...p)).find(x=>x!==void 0))):i[f]=_)}}const Kb=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function Jb(i,o={}){const s="rootStore"in i?i.rootStore:i,r=s.useState("open"),f=s.useState("floatingId"),_=s.useState("domReferenceElement"),p=s.useState("floatingElement"),{enabled:x=!0,role:h="dialog"}=o,m=tc(),R=_?.id||m,E=T.useMemo(()=>Jr(p)?.id||f,[p,f]),z=Kb.get(h)??h,B=h0()!=null,L=T.useMemo(()=>z==="tooltip"||h==="label"?Jt:{"aria-haspopup":z==="alertdialog"?"dialog":z,"aria-expanded":"false",...z==="listbox"&&{role:"combobox"},...z==="menu"&&B&&{role:"menuitem"},...h==="select"&&{"aria-autocomplete":"none"},...h==="combobox"&&{"aria-autocomplete":"list"}},[z,B,h]),I=T.useMemo(()=>z==="tooltip"||h==="label"?{[`aria-${h==="label"?"labelledby":"describedby"}`]:r?E:void 0}:{...L,"aria-expanded":r?"true":"false","aria-controls":r?E:void 0,...z==="menu"&&{id:R}},[z,E,r,R,h,L]),Z=T.useMemo(()=>{const G={id:E,...z&&{role:z}};return z==="tooltip"||h==="label"?G:{...G,...z==="menu"&&{"aria-labelledby":R}}},[z,E,R,h]),$=T.useCallback(({active:G,selected:Q})=>{const te={role:"option",...G&&{id:`${E}-fui-option`}};switch(h){case"select":case"combobox":return{...te,"aria-selected":Q}}return{}},[E,h]);return T.useMemo(()=>x?{reference:I,floating:Z,item:$,trigger:L}:{},[x,I,Z,L,$])}let Ib=(function(i){return i.nestedDialogs="--nested-dialogs",i})({}),Fb=(function(i){return i[i.open=wl.open]="open",i[i.closed=wl.closed]="closed",i[i.startingStyle=wl.startingStyle]="startingStyle",i[i.endingStyle=wl.endingStyle]="endingStyle",i.nested="data-nested",i.nestedDialogOpen="data-nested-dialog-open",i})({});const j0=T.createContext(void 0);function Wb(){const i=T.useContext(j0);if(i===void 0)throw new Error(Si(26));return i}const M0="ArrowUp",D0="ArrowDown",U0="ArrowLeft",k0="ArrowRight",Y0="Home",B0="End",$b=new Set([U0,k0]),Pb=new Set([M0,D0]),ev=new Set([...$b,...Pb]);[...ev];const tv=new Set([M0,D0,U0,k0,Y0,B0]),nv={...Wm,...Fm,nestedDialogOpen(i){return i?{[Fb.nestedDialogOpen]:""}:null}},lv=T.forwardRef(function(o,s){const{className:r,finalFocus:f,initialFocus:_,render:p,...x}=o,{store:h}=Ei(),m=h.useState("descriptionElementId"),R=h.useState("disablePointerDismissal"),E=h.useState("floatingRootContext"),z=h.useState("popupProps"),j=h.useState("modal"),B=h.useState("mounted"),L=h.useState("nested"),I=h.useState("nestedOpenDialogCount"),Z=h.useState("open"),$=h.useState("openMethod"),G=h.useState("titleElementId"),Q=h.useState("transitionStatus"),te=h.useState("role");Wb(),R0({open:Z,ref:h.context.popupRef,onComplete(){Z&&h.context.onOpenChangeComplete?.(!0)}});function ne(re){return re==="touch"?h.context.popupRef.current:!0}const F=_===void 0?ne:_,ue=I>0,H=T.useMemo(()=>({open:Z,nested:L,transitionStatus:Q,nestedDialogOpen:ue}),[Z,L,Q,ue]),le=uo("div",o,{state:H,props:[z,{"aria-labelledby":G??void 0,"aria-describedby":m??void 0,role:te,tabIndex:-1,hidden:!B,onKeyDown(re){tv.has(re.key)&&re.stopPropagation()},style:{[Ib.nestedDialogs]:I}},x],ref:[s,h.context.popupRef,h.useStateSetter("popupElement")],stateAttributesMapping:nv});return g.jsx(sb,{context:E,openInteractionType:$,disabled:!B,closeOnFocusOut:!R,initialFocus:F,returnFocus:f,modal:j!==!1,restoreFocus:"popup",children:le})});function av(i){return $r(19)?i:i?"true":void 0}const iv=T.forwardRef(function(o,s){const{cutout:r,...f}=o;let _;if(r){const p=r?.getBoundingClientRect();_=`polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${p.left}px ${p.top}px,
      ${p.left}px ${p.bottom}px,
      ${p.right}px ${p.bottom}px,
      ${p.right}px ${p.top}px,
      ${p.left}px ${p.top}px
    )`}return g.jsx("div",{ref:s,role:"presentation","data-base-ui-inert":"",...f,style:{position:"fixed",inset:0,userSelect:"none",WebkitUserSelect:"none",clipPath:_}})}),uv=T.forwardRef(function(o,s){const{keepMounted:r=!1,...f}=o,{store:_}=Ei(),p=_.useState("mounted"),x=_.useState("modal"),h=_.useState("open");return p||r?g.jsx(j0.Provider,{value:r,children:g.jsxs(lb,{ref:s,...f,children:[p&&x===!0&&g.jsx(iv,{ref:_.context.internalBackdropRef,inert:av(!h)}),o.children]})}):null});let jm={},Mm={},Dm="";function ov(i){if(typeof document>"u")return!1;const o=wi(i);return on(o).innerWidth-o.documentElement.clientWidth>0}function sv(i){if(!(typeof CSS<"u"&&CSS.supports&&CSS.supports("scrollbar-gutter","stable"))||typeof document>"u")return!1;const r=wi(i).documentElement,f={scrollbarGutter:r.style.scrollbarGutter,overflowY:r.style.overflowY};r.style.scrollbarGutter="stable",r.style.overflowY="scroll";const _=r.offsetWidth;r.style.overflowY="hidden";const p=r.offsetWidth;return Object.assign(r.style,f),_===p}function rv(i){const o=wi(i),s=o.documentElement,r=o.body,f=ro(s)?s:r,_=f.style.overflow;return f.style.overflow="hidden",()=>{f.style.overflow=_}}function cv(i){const o=wi(i),s=o.documentElement,r=o.body,f=on(s);let _=0,p=0,x=!1;const h=un.create();if(ph&&(f.visualViewport?.scale??1)!==1)return()=>{};function m(){const z=f.getComputedStyle(s),j=f.getComputedStyle(r),I=(z.scrollbarGutter||"").includes("both-edges")?"stable both-edges":"stable";_=s.scrollTop,p=s.scrollLeft,jm={scrollbarGutter:s.style.scrollbarGutter,overflowY:s.style.overflowY,overflowX:s.style.overflowX},Dm=s.style.scrollBehavior,Mm={position:r.style.position,height:r.style.height,width:r.style.width,boxSizing:r.style.boxSizing,overflowY:r.style.overflowY,overflowX:r.style.overflowX,scrollBehavior:r.style.scrollBehavior};const Z=s.scrollHeight>s.clientHeight,$=s.scrollWidth>s.clientWidth,G=z.overflowY==="scroll"||j.overflowY==="scroll",Q=z.overflowX==="scroll"||j.overflowX==="scroll",te=Math.max(0,f.innerWidth-r.clientWidth),ne=Math.max(0,f.innerHeight-r.clientHeight),F=parseFloat(j.marginTop)+parseFloat(j.marginBottom),ue=parseFloat(j.marginLeft)+parseFloat(j.marginRight),H=ro(s)?s:r;if(x=sv(i),x){s.style.scrollbarGutter=I,H.style.overflowY="hidden",H.style.overflowX="hidden";return}Object.assign(s.style,{scrollbarGutter:I,overflowY:"hidden",overflowX:"hidden"}),(Z||G)&&(s.style.overflowY="scroll"),($||Q)&&(s.style.overflowX="scroll"),Object.assign(r.style,{position:"relative",height:F||ne?`calc(100dvh - ${F+ne}px)`:"100dvh",width:ue||te?`calc(100vw - ${ue+te}px)`:"100vw",boxSizing:"border-box",overflow:"hidden",scrollBehavior:"unset"}),r.scrollTop=_,r.scrollLeft=p,s.setAttribute("data-base-ui-scroll-locked",""),s.style.scrollBehavior="unset"}function R(){Object.assign(s.style,jm),Object.assign(r.style,Mm),x||(s.scrollTop=_,s.scrollLeft=p,s.removeAttribute("data-base-ui-scroll-locked"),s.style.scrollBehavior=Dm)}function E(){R(),h.request(m)}return m(),f.addEventListener("resize",E),()=>{h.cancel(),R(),typeof f.removeEventListener=="function"&&f.removeEventListener("resize",E)}}class fv{lockCount=0;restore=null;timeoutLock=ha.create();timeoutUnlock=ha.create();acquire(o){return this.lockCount+=1,this.lockCount===1&&this.restore===null&&this.timeoutLock.start(0,()=>this.lock(o)),this.release}release=()=>{this.lockCount-=1,this.lockCount===0&&this.restore&&this.timeoutUnlock.start(0,this.unlock)};unlock=()=>{this.lockCount===0&&this.restore&&(this.restore?.(),this.restore=null)};lock(o){if(this.lockCount===0||this.restore!==null)return;const r=wi(o).documentElement,f=on(r).getComputedStyle(r).overflowY;if(f==="hidden"||f==="clip"){this.restore=Im;return}const _=i0||!ov(o);this.restore=_?rv(o):cv(o)}}const dv=new fv;function _v(i=!0,o=null){rt(()=>{if(i)return dv.acquire(o)},[i,o])}function mv(i){const o=T.useRef(""),s=T.useCallback(f=>{f.defaultPrevented||(o.current=f.pointerType,i(f,f.pointerType))},[i]);return{onClick:T.useCallback(f=>{if(f.detail===0){i(f,"keyboard");return}"pointerType"in f&&i(f,f.pointerType),i(f,o.current),o.current=""},[i]),onPointerDown:s}}function gv(i){const[o,s]=T.useState(null),r=je((x,h)=>{i||s(h||(i0?"touch":""))}),f=T.useCallback(()=>{s(null)},[]),{onClick:_,onPointerDown:p}=mv(r);return T.useMemo(()=>({openMethod:o,reset:f,triggerProps:{onClick:_,onPointerDown:p}}),[o,f,_,p])}function yv(i){const{store:o,parentContext:s,actionsRef:r}=i,f=o.useState("open"),_=o.useState("disablePointerDismissal"),p=o.useState("modal"),x=o.useState("popupElement"),{openMethod:h,triggerProps:m,reset:R}=gv(f);Hb(o);const{forceUnmount:E}=Xb(f,o,()=>{R()}),z=je(le=>{const re=zn(le);return re.preventUnmountOnClose=()=>{o.set("preventUnmountingOnClose",!0)},re}),j=T.useCallback(()=>{o.setOpen(!1,z(fh))},[o,z]);T.useImperativeHandle(r,()=>({unmount:E,close:j}),[E,j]);const B=Vb({popupStore:o,onOpenChange:o.setOpen,treatPopupAsFloatingElement:!0,noEmit:!0}),[L,I]=T.useState(0),Z=L===0,$=Jb(B),G=fb(B,{outsidePressEvent(){return o.context.internalBackdropRef.current||o.context.backdropRef.current?"intentional":{mouse:p==="trap-focus"?"sloppy":"intentional",touch:"sloppy"}},outsidePress(le){if("button"in le&&le.button!==0||"touches"in le&&le.touches.length!==1)return!1;const re=en(le);if(Z&&!_){const Ce=re;return p&&(o.context.internalBackdropRef.current||o.context.backdropRef.current)?o.context.internalBackdropRef.current===Ce||o.context.backdropRef.current===Ce||at(Ce,x)&&!Ce?.hasAttribute("data-base-ui-portal"):!0}return!1},escapeKey:Z});_v(f&&p===!0,x);const{getReferenceProps:Q,getFloatingProps:te,getTriggerProps:ne}=Zb([$,G]);o.useContextCallback("onNestedDialogOpen",le=>{I(le+1)}),o.useContextCallback("onNestedDialogClose",()=>{I(0)}),T.useEffect(()=>(s?.onNestedDialogOpen&&f&&s.onNestedDialogOpen(L),s?.onNestedDialogClose&&!f&&s.onNestedDialogClose(),()=>{s?.onNestedDialogClose&&f&&s.onNestedDialogClose()}),[f,s,L]);const F=T.useMemo(()=>Q(m),[Q,m]),ue=T.useMemo(()=>ne(m),[ne,m]),H=T.useMemo(()=>te(),[te]);o.useSyncedValues({openMethod:h,activeTriggerProps:F,inactiveTriggerProps:ue,popupProps:H,floatingRootContext:B,nestedOpenDialogCount:L})}const pv={...Gb,modal:ke(i=>i.modal),nested:ke(i=>i.nested),nestedOpenDialogCount:ke(i=>i.nestedOpenDialogCount),disablePointerDismissal:ke(i=>i.disablePointerDismissal),openMethod:ke(i=>i.openMethod),descriptionElementId:ke(i=>i.descriptionElementId),titleElementId:ke(i=>i.titleElementId),viewportElement:ke(i=>i.viewportElement),role:ke(i=>i.role)};class hv extends z0{constructor(o){super(bv(o),{popupRef:T.createRef(),backdropRef:T.createRef(),internalBackdropRef:T.createRef(),triggerElements:new N0,onOpenChange:void 0,onOpenChangeComplete:void 0},pv)}setOpen=(o,s)=>{if(s.preventUnmountOnClose=()=>{this.set("preventUnmountingOnClose",!0)},!o&&s.trigger==null&&this.state.activeTriggerId!=null&&(s.trigger=this.state.activeTriggerElement??void 0),this.context.onOpenChange?.(o,s),s.isCanceled)return;const r={open:o,nativeEvent:s.event,reason:s.reason,nested:this.state.nested};this.state.floatingRootContext.context.events?.emit("openchange",r);const f={open:o},_=s.trigger?.id??null;(_||o)&&(f.activeTriggerId=_,f.activeTriggerElement=s.trigger??null),this.update(f)}}function bv(i={}){return{...Qb(),modal:!0,disablePointerDismissal:!1,popupElement:null,viewportElement:null,descriptionElementId:void 0,titleElementId:void 0,openMethod:null,nested:!1,nestedOpenDialogCount:0,role:"dialog",...i}}function vv(i){const{children:o,open:s,defaultOpen:r=!1,onOpenChange:f,onOpenChangeComplete:_,disablePointerDismissal:p=!1,modal:x=!0,actionsRef:h,handle:m,triggerId:R,defaultTriggerId:E=null}=i,z=Ei(!0),j=!!z,B=al(()=>m?.store??new hv({open:s??r,activeTriggerId:R!==void 0?R:E,modal:x,disablePointerDismissal:p,nested:j})).current;B.useControlledProp("open",s,r),B.useControlledProp("activeTriggerId",R,E),B.useSyncedValues({disablePointerDismissal:p,nested:j,modal:x}),B.useContextCallback("onOpenChange",f),B.useContextCallback("onOpenChangeComplete",_);const L=B.useState("payload");yv({store:B,actionsRef:h,parentContext:z?.store.context});const I=T.useMemo(()=>({store:B}),[B]);return g.jsx(Qm.Provider,{value:I,children:typeof o=="function"?o({payload:L}):o})}function xv(i){return i.toLowerCase().endsWith(".webm")}function Um(i,o){return o===0?0:(i%o+o)%o}function Sv({cards:i,open:o,selectedIndex:s,prefersReducedMotion:r,onOpenChange:f,onSelectedIndexChange:_}){const p=T.useRef(null),x=T.useMemo(()=>Um(s,i.length),[i.length,s]),h=i[x],m=T.useCallback(R=>{i.length<=1||_(Um(x+R,i.length))},[i.length,_,x]);return T.useEffect(()=>{if(!o)return;const R=E=>{E.key==="ArrowLeft"?(E.preventDefault(),m(-1)):E.key==="ArrowRight"?(E.preventDefault(),m(1)):E.key==="Escape"&&(E.preventDefault(),f(!1))};return window.addEventListener("keydown",R),()=>window.removeEventListener("keydown",R)},[m,f,o]),h?g.jsx(vv,{open:o,onOpenChange:f,children:g.jsxs(uv,{children:[g.jsx(Zp,{className:"preview-gallery-backdrop"}),g.jsx("div",{className:"preview-gallery-shell",children:g.jsxs(lv,{className:"preview-gallery-popup","aria-label":`${h.title} gallery preview`,children:[g.jsx(dh,{className:"preview-gallery-close","aria-label":"Close gallery",children:g.jsx("span",{"aria-hidden":"true",children:"x"})}),g.jsx("div",{className:"preview-gallery-media-frame",onTouchStart:R=>{p.current=R.changedTouches[0]?.clientX??null},onTouchEnd:R=>{const E=p.current;if(E==null)return;const j=(R.changedTouches[0]?.clientX??E)-E;Math.abs(j)>=56&&m(j>0?-1:1),p.current=null},children:xv(h.image)?g.jsx("video",{src:h.image,muted:!0,loop:!r,autoPlay:!r,playsInline:!0,preload:r?"none":"metadata",controls:!0,"aria-label":h.title,className:"preview-gallery-media"}):g.jsx("img",{src:h.image,alt:h.title,className:"preview-gallery-media",loading:"eager",decoding:"async"})}),g.jsxs("div",{className:"preview-gallery-meta",children:[g.jsx("p",{children:h.title}),g.jsxs("span",{children:[x+1," / ",i.length]})]}),g.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-prev","aria-label":"Previous preview",onClick:()=>m(-1),disabled:i.length<=1,children:g.jsx("span",{"aria-hidden":"true",children:"<"})}),g.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-next","aria-label":"Next preview",onClick:()=>m(1),disabled:i.length<=1,children:g.jsx("span",{"aria-hidden":"true",children:">"})})]})})]})}):null}const Hr=[{name:"0x / Matcha",logoUrls:["/logos/0x.png","/logos/matcha.svg"],href:"https://matcha.xyz"},{name:"Moody's",logoUrls:["/logos/moodys.png"],href:"https://www.moodys.com"},{name:"Twilio",logoUrls:["/logos/twilio.svg"],href:"https://www.twilio.com"},{name:"Google",logoUrls:["/logos/Google_logo.svg"],href:"https://www.google.com"},{name:"Onit",logoUrls:["/logos/onit.png"],href:"https://www.onit.com"},{name:"Chainlink",logoUrls:["/logos/chainlink.svg"],href:"https://chain.link"}];function L0(){return g.jsx("span",{className:"mosaic-company-inline-list","aria-label":"Companies I have worked with",children:Hr.map((i,o)=>g.jsxs("span",{className:"mosaic-company-inline-item",children:[g.jsx(_a,{href:i.href,logoUrls:i.logoUrls,className:"mosaic-company-inline-link",ariaLabel:`${i.name} website`,title:i.name,children:i.name}),o<Hr.length-2?", ":o===Hr.length-2?", and ":""]},i.name))})}const km=["tall","sm","sm","wide","sm","tall","wide","sm","sm","wide","sm","sm"],Ev=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",hour12:!0,timeZone:"America/Santo_Domingo",timeZoneName:"short"});function Xr(i){return i.toLowerCase().endsWith(".webm")}function Ym(i){if(i!=="#")return i}function Bm(i){if(i.id==="preview-shot-20")return!0;const o=i.previewAspectRatio;return o==null?!1:o>1.45||o<.82}function Lm(i=new Date){return Ev.format(i)}function Tv({label:i,reducedMotion:o}){const[s,r]=T.useState(i),[f,_]=T.useState(null),[p,x]=T.useState(!1),h=T.useRef(null);return T.useEffect(()=>{if(i===s)return;if(o){r(i),_(null),x(!1);return}h.current!==null&&window.clearTimeout(h.current),_(i);const m=window.requestAnimationFrame(()=>{x(!0),h.current=window.setTimeout(()=>{r(i),_(null),x(!1),h.current=null},240)});return()=>{window.cancelAnimationFrame(m),h.current!==null&&(window.clearTimeout(h.current),h.current=null)}},[s,i,o]),g.jsx("span",{className:`mosaic-live-time ${p?"is-animating":""}`,"aria-live":"polite","aria-atomic":"true",children:g.jsxs("span",{className:"mosaic-live-time-track",children:[g.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-current",children:s}),f?g.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-next",children:f}):null]})})}function wv({cards:i,profile:o,links:s,showProjects:r=!0}){const[f,_]=T.useState(!1),[p,x]=T.useState(null),[h,m]=T.useState(()=>Lm()),R=T.useMemo(()=>i.filter(H=>H.kind==="preview"),[i]),E=T.useMemo(()=>i.find(H=>H.id==="preview-shot-9")??R.find(H=>(H.previewAspectRatio??1)<1)??R[0],[i,R]),z=T.useMemo(()=>i.find(H=>H.id==="preview-shot-21")??R.find(H=>H.id!==E?.id)??R[1],[i,R,E]),j=T.useMemo(()=>{const H=new Set;E?.id&&H.add(E.id),z?.id&&H.add(z.id);const le=R.filter(re=>!H.has(re.id));return le.length===0?[]:Array.from({length:12},(re,Ce)=>le[Ce%le.length])},[R,E,z]),B=T.useMemo(()=>{const H=[];return j.forEach((le,re)=>{H.push({kind:"preview",card:le,span:le.masonrySpan==="lg"?"wide":km[re%km.length],previewIndex:re}),re===6&&H.push({kind:"bridge",bridge:"signature",span:"sm",id:"bridge-signature"})}),H},[j]),L=T.useMemo(()=>{for(const H of B)if(H.kind==="preview")return H;return null},[B]),I=T.useMemo(()=>L?B.filter(H=>!(H.kind==="preview"&&H.previewIndex===L.previewIndex)):B,[B,L]),Z=T.useMemo(()=>Ym(s.linkedin),[s.linkedin]),$=T.useMemo(()=>Ym(s.x),[s.x]),G=E?.title??"Vertical project preview",Q=z?.title??"Wide project preview",te=L?Bm(L.card):!1,ne=`mosaic-shell${r?"":" mosaic-shell-hero-only"}`,F=`mosaic-hero${r?"":" mosaic-hero-hero-only"}`,ue=(H,le,re)=>Xr(H.image)?g.jsx("video",{src:H.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata","aria-label":re,className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`}):g.jsx("img",{src:H.image,alt:re,loading:"lazy",decoding:"async",className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`});return T.useEffect(()=>{if(typeof window>"u"||typeof window.matchMedia!="function")return;const H=window.matchMedia("(prefers-reduced-motion: reduce)"),le=()=>_(H.matches);return le(),typeof H.addEventListener=="function"?(H.addEventListener("change",le),()=>H.removeEventListener("change",le)):(H.addListener(le),()=>H.removeListener(le))},[]),T.useEffect(()=>{let H,le;const re=()=>{m(Lm())};return re(),(()=>{const We=6e4-Date.now()%6e4;le=window.setTimeout(()=>{re(),H=window.setInterval(re,6e4)},We)})(),()=>{le&&window.clearTimeout(le),H&&window.clearInterval(H)}},[]),g.jsxs("section",{className:ne,children:[g.jsxs("h1",{className:"sr-only",children:[o.name," portfolio"]}),g.jsx("header",{id:"about",className:F,children:g.jsxs("div",{className:"mosaic-hero-profile mosaic-hero-profile-animated",children:[g.jsxs("div",{className:"mosaic-profile-head",children:[g.jsx("img",{src:o.photo,alt:`${o.name} portrait`,className:"mosaic-avatar",loading:"eager",decoding:"async"}),g.jsxs("div",{className:"mosaic-profile-meta",children:[g.jsx("h2",{children:o.name}),g.jsxs("p",{className:"mosaic-profile-subtitle",children:[o.title,g.jsx("span",{className:"mosaic-profile-status-separator","aria-hidden":"true",children:"·"}),g.jsx("span",{className:"mosaic-profile-status-tag","aria-label":"Currently available",children:"Available"})]}),g.jsxs("p",{className:"mosaic-profile-location",children:["Punta Cana · ",g.jsx(Tv,{label:h,reducedMotion:f})]})]})]}),g.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"Born in Santo Domingo, educated in Washington, DC, and now moving to NYC."}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup mosaic-profile-summary-companies",children:["Over the past decade, I've designed products with teams at ",g.jsx(L0,{}),"."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["My work started in college, where I co-founded"," ",g.jsx(Sp,{href:"https://www.youtube.com/watch?v=IAHmu0lhcIs&t=1s",className:"mosaic-profile-link",embedUrl:"https://www.youtube-nocookie.com/embed/IAHmu0lhcIs?autoplay=1&mute=1&controls=0&loop=1&playlist=IAHmu0lhcIs&modestbranding=1&rel=0&playsinline=1",previewTitle:"Turtle project preview",children:"Turtle"}),", a tool for college students to meet each other. Since then, I've designed products like"," ",g.jsxs("span",{className:"mosaic-inline-nowrap",children:[g.jsx(_a,{href:"https://patrol.so",logoUrls:["/logos/patrol.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Patrol"}),"/",g.jsx(_a,{href:"https://protector.so",logoUrls:["/logos/protector.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Protector"})]}),", rethought developer tools at"," ",g.jsx(_a,{href:"https://www.twilio.com",logoUrls:["/logos/twilio.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Twilio"}),", built financial products at"," ",g.jsx(_a,{href:"https://www.moodys.com",logoUrls:["/logos/moodys.png"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Moody's"}),", and helped shape"," ",g.jsx(_a,{href:"https://matcha.xyz",logoUrls:["/logos/matcha.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Matcha.xyz"})," ","for four and a half years."]}),g.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"Today I freelance on focused, high-impact projects."}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",g.jsx("a",{href:$??s.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",g.jsx("a",{href:`mailto:${s.email}`,className:"mosaic-profile-link",children:s.email})]})]})}),r?g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"mosaic-board",children:[g.jsx("article",{id:"featured",className:"mosaic-tile mosaic-feature-card",children:g.jsxs("div",{className:"mosaic-note-card",children:[g.jsx("p",{className:"mosaic-note-date",children:"Nov 23"}),g.jsx("h2",{children:"LLMs for house plants?"}),g.jsx("p",{children:"It's been five incredibly turbulent days at the leading AI tech company, with the exit and then return of CEO..."}),Z?g.jsx("a",{href:Z,target:"_blank",rel:"noreferrer",className:"mosaic-note-link",children:"Read more"}):null]})}),g.jsxs("article",{className:"mosaic-tile mosaic-empty-card","aria-label":"Open space panel",children:[g.jsx("span",{className:"mosaic-doodle mosaic-doodle-top",children:"o_o"}),g.jsx("span",{className:"mosaic-doodle mosaic-doodle-bottom",children:"\\\\^_^/"})]}),g.jsx("article",{className:"mosaic-tile mosaic-phone-card","aria-label":G,children:g.jsx("div",{className:"mosaic-phone-shell",children:E?Xr(E.image)?g.jsx("video",{src:E.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":G,className:"mosaic-phone-media"}):g.jsx("img",{src:E.image,alt:G,loading:"lazy",decoding:"async",className:"mosaic-phone-media"}):g.jsx("div",{className:"mosaic-media-fallback",children:"Preview coming soon"})})}),g.jsx("article",{className:"mosaic-tile mosaic-note-panel",children:g.jsxs("div",{className:"mosaic-micro-card",children:[g.jsx("h2",{children:"Blogging about plants"}),g.jsx("p",{children:"I find joy and inspiration in my ever-growing collection of plants. They make my space feel like home."})]})}),g.jsx("article",{className:"mosaic-tile mosaic-dashboard-card","aria-label":Q,children:g.jsx("div",{className:"mosaic-wide-shell",children:z?Xr(z.image)?g.jsx("video",{src:z.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":Q,className:"mosaic-wide-media"}):g.jsx("img",{src:z.image,alt:Q,loading:"lazy",decoding:"async",className:"mosaic-wide-media"}):g.jsx("div",{className:"mosaic-media-fallback",children:"Project preview"})})}),g.jsxs("article",{id:"work",className:"mosaic-work",children:[g.jsx("h2",{className:"sr-only",children:"Selected work"}),L?g.jsx("section",{className:"mosaic-work-featured","aria-label":"Featured work preview",children:g.jsxs("button",{type:"button",className:"mosaic-work-card mosaic-work-card-featured",onClick:()=>x(L.previewIndex),"aria-label":`Open ${L.card.title} preview ${L.previewIndex+1} of ${j.length}`,children:[g.jsx("span",{className:`mosaic-work-media-shell ${te?"mosaic-work-media-shell-inset":""}`,children:ue(L.card,te,L.card.title)}),g.jsx("span",{className:"mosaic-work-overlay mosaic-work-overlay-featured",children:g.jsx("strong",{children:L.card.title})})]})}):null,g.jsx("ul",{className:"mosaic-work-grid","aria-label":"Selected work previews",children:I.map(H=>{const le=`mosaic-work-item mosaic-work-item-${H.span}`;if(H.kind==="bridge")return g.jsx("li",{className:le,children:g.jsxs("div",{className:"mosaic-work-bridge mosaic-work-bridge-signature","aria-hidden":"false",children:[g.jsxs("div",{className:"mosaic-work-signature-stack","aria-hidden":"true",children:[g.jsx("span",{}),g.jsx("span",{}),g.jsx("span",{})]}),g.jsxs("p",{children:[o.name," - Software Designer and Engineer"]})]})},H.id);const re=Bm(H.card);return g.jsx("li",{className:le,children:g.jsxs("button",{type:"button",className:"mosaic-work-card",onClick:()=>x(H.previewIndex),"aria-label":`Open ${H.card.title} preview ${H.previewIndex+1} of ${j.length}`,children:[g.jsx("span",{className:`mosaic-work-media-shell ${re?"mosaic-work-media-shell-inset":""}`,children:ue(H.card,re,H.card.title)}),g.jsx("span",{className:"mosaic-work-overlay",children:g.jsx("strong",{children:H.card.title})})]})},`${H.card.id}-${H.previewIndex}`)})})]})]}),g.jsx(Sv,{cards:j,open:p!=null&&p<j.length,selectedIndex:p??0,prefersReducedMotion:f,onOpenChange:H=>{H||x(null)},onSelectedIndexChange:x})]}):null]})}function Cv({email:i,contactHref:o,telegramHref:s,xHref:r}){const[f,_]=T.useState(!1),p=async()=>{try{await navigator.clipboard.writeText(i),_(!0),window.setTimeout(()=>_(!1),1800)}catch{window.location.href=o}};return g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"mosaic-profile-actions","aria-label":"Profile contact actions",children:[g.jsx("button",{type:"button",className:"mosaic-contact-pill mosaic-contact-pill-default",onClick:p,children:g.jsx("span",{className:"mosaic-contact-pill-default-label",children:f?"Copied!":"Copy email"})}),g.jsx("a",{href:s,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-telegram",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-telegram",children:[g.jsx("img",{src:"/icons/telegram.png",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-telegram"}),g.jsx("span",{className:"mosaic-contact-pill-telegram-label",children:"Message"})]})}),r?g.jsx("a",{href:r,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-dark",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[g.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),g.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})}):g.jsx("span",{className:"mosaic-contact-pill mosaic-contact-pill-dark",role:"text",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[g.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),g.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})})]}),g.jsx("span",{className:"sr-only",role:"status","aria-live":"polite","aria-atomic":"true",children:f?"Email copied to clipboard":""})]})}const Ov=[{label:"Body",variable:"--body-color"},{label:"Body BG",variable:"--body-bg"},{label:"Primary",variable:"--primary"},{label:"Secondary",variable:"--secondary"},{label:"Accent",variable:"--accent"},{label:"Surface",variable:"--surface-2"}],zv=[{label:"Snappy",value:"220ms / cubic-bezier(0.175, 0.885, 0.32, 1.1)"},{label:"Swift",value:"800ms / cubic-bezier(0.175, 0.885, 0.32, 1.275)"},{label:"Smooth",value:"300ms / cubic-bezier(0.19, 1, 0.22, 1)"}];function Av({links:i,name:o}){return g.jsxs("main",{id:"main-content",tabIndex:-1,className:"styleguide-page",children:[g.jsxs("header",{className:"styleguide-hero",children:[g.jsxs("div",{className:"styleguide-hero-topline",children:[g.jsx("a",{href:"/",className:"styleguide-home-link",children:"Back to portfolio"}),g.jsx("span",{className:"styleguide-badge",children:"System inventory"})]}),g.jsxs("div",{className:"styleguide-hero-copy",children:[g.jsx("p",{className:"styleguide-eyebrow",children:"Rafael Medina UI system"}),g.jsx("h1",{children:"Styleguide"}),g.jsxs("p",{className:"styleguide-lede",children:["A living page for the real components, link treatments, text styles, surfaces, and motion tokens currently shaping"," ",o,"'s portfolio."]})]})]}),g.jsxs("div",{className:"styleguide-main",children:[g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Buttons"}),g.jsx("h2",{children:"Contact action row"})]}),g.jsx("div",{className:"styleguide-specimen styleguide-specimen-wide",children:g.jsx(Cv,{email:i.email,contactHref:`mailto:${i.email}`,telegramHref:"https://t.me/rafaelmedian",xHref:i.x})}),g.jsxs("div",{className:"styleguide-notes-grid",children:[g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Primary"}),g.jsx("strong",{children:"Copy email"}),g.jsx("p",{children:"Utility-first action with the strongest contrast in the row."})]}),g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Secondary"}),g.jsx("strong",{children:"Message"}),g.jsx("p",{children:"Friendlier blue accent that stays related to the main button family."})]}),g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Tertiary"}),g.jsx("strong",{children:"Follow"}),g.jsx("p",{children:"Darker social action that stays present without overpowering the row."})]})]})]}),g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Links"}),g.jsx("h2",{children:"Editorial inline treatments"})]}),g.jsxs("div",{className:"styleguide-copy-sample",children:[g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["Born in the US I helped build"," ",g.jsx("a",{href:"https://matcha.xyz",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Matcha.xyz"})," ","end-to-end, from product design to interaction design."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["I've been fortunate to work with teams at ",g.jsx(L0,{}),"."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",g.jsx("a",{href:i.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",g.jsx("a",{href:`mailto:${i.email}`,className:"mosaic-profile-link",children:i.email}),"."]})]})]}),g.jsxs("section",{className:"styleguide-section styleguide-grid-two",children:[g.jsxs("div",{className:"styleguide-column",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Typography"}),g.jsx("h2",{children:"Core text rhythm"})]}),g.jsxs("div",{className:"styleguide-type-stack",children:[g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Hero title"}),g.jsx("h3",{children:"Rafael Medina"}),g.jsx("p",{children:"16px / 170% / -0.005em"})]}),g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Body base"}),g.jsx("h4",{children:"I'm a designer who ships products, now AI-enabled."}),g.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]}),g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Meta"}),g.jsx("div",{className:"styleguide-meta-line",children:"Punta Cana · Local time: 5:03pm AST"}),g.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]})]})]}),g.jsxs("div",{className:"styleguide-column",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Tokens"}),g.jsx("h2",{children:"Color and motion references"})]}),g.jsx("div",{className:"styleguide-swatch-grid",children:Ov.map(s=>g.jsxs("article",{className:"styleguide-swatch-card",children:[g.jsx("div",{className:"styleguide-swatch",style:{background:`var(${s.variable})`}}),g.jsx("strong",{children:s.label}),g.jsx("span",{children:s.variable})]},s.variable))}),g.jsx("div",{className:"styleguide-motion-list",children:zv.map(s=>g.jsxs("article",{className:"styleguide-motion-card",children:[g.jsx("strong",{children:s.label}),g.jsx("span",{children:s.value})]},s.label))})]})]}),g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Surfaces"}),g.jsx("h2",{children:"Panels and atmosphere"})]}),g.jsxs("div",{className:"styleguide-surface-grid",children:[g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-overlay",children:[g.jsx("span",{children:"Overlay"}),g.jsx("strong",{children:"Blurred system surface"}),g.jsx("p",{children:"Uses the shared overlay blur, background, and layered shadow tokens."})]}),g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-tile",children:[g.jsx("span",{children:"Tile"}),g.jsx("strong",{children:"Project canvas"}),g.jsx("p",{children:"The softer neutral panel used by the portfolio grid."})]}),g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-accent",children:[g.jsx("span",{children:"Accent"}),g.jsx("strong",{children:"Highlight wash"}),g.jsx("p",{children:"A low-contrast accent surface for emphasis, notes, or future badges."})]})]})]})]})]})}const Rv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='56'%20y='70'%20width='220'%20height='220'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='72'%20width='192'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='320'%20y='104'%20width='144'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='156'%20width='192'%20height='116'%20rx='22'%20fill='%23E7E5E4'/%3e%3cpath%20d='M142%20120H214'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20150H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20180H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",Nv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='72'%20y='84'%20width='196'%20height='196'%20rx='26'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='92'%20width='188'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='300'%20y='124'%20width='140'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='176'%20width='188'%20height='96'%20rx='18'%20fill='%23E7E5E4'/%3e%3ccircle%20cx='170'%20cy='182'%20r='46'%20fill='%23D6D3D1'/%3e%3cpath%20d='M148%20182H192'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3c/svg%3e",jv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='60'%20y='64'%20width='440'%20height='96'%20rx='24'%20fill='%23E7E5E4'/%3e%3crect%20x='60'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='290'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='92'%20y='96'%20width='160'%20height='12'%20rx='6'%20fill='%23D6D3D1'/%3e%3crect%20x='92'%20y='118'%20width='120'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3cpath%20d='M328%20248H460'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",Mv="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='80'%20y='68'%20width='400'%20height='224'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='120'%20y='110'%20width='160'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='134'%20width='220'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3crect%20x='120'%20y='200'%20width='140'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='224'%20width='200'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3ccircle%20cx='392'%20cy='196'%20r='32'%20fill='%23D6D3D1'/%3e%3cpath%20d='M372%20196H412'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",Dv="/assets/profile-photo-bUVT8ljA.png",Hm={name:"Rafael Medina",title:"Freelance Product Designer",intro:"Hey I'm Rafael, a product designer and maker based in Miami. For over 10 years, I've helped teams design products that balance clarity, visual craft, and practical outcomes.",previouslyLabel:"Previously",previouslyText:"Product designer for SaaS teams and startup builders.",nowLabel:"Now",nowText:"Freelancing, experimenting with AI workflows, and building design systems.",availability:"Available for work",contactLabel:"Get in touch",contactHref:"mailto:hey@rafaelmedina.me",photo:Dv},ga={dribbble:"https://dribbble.com/rafaelmedina",x:"https://x.com/rafaelmedian",github:"https://github.com/rafaelmedina",linkedin:"https://www.linkedin.com/in/rafaelmedina",email:"hey@rafaelmedina.me"},Uv=[{id:"preview-shot-21",kind:"preview",category:"Preview",title:"Shot Preview 21",summary:"",detail:"",image:"/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:4/3},{id:"preview-shot-9",kind:"preview",category:"Preview",title:"Shot Preview 9",summary:"",detail:"",image:"/Projects/shot-small-9.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.74},{id:"preview-shot-16",kind:"preview",category:"Preview",title:"Shot Preview 16",summary:"",detail:"",image:"/Projects/shot-small-16.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:1.85},{id:"preview-shot-1",kind:"preview",category:"Preview",title:"Shot Preview 1",summary:"",detail:"",image:"/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-14",kind:"preview",category:"Preview",title:"Shot Preview 14",summary:"",detail:"",image:"/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-15",kind:"preview",category:"Preview",title:"Shot Preview 15",summary:"",detail:"",image:"/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-19",kind:"preview",category:"Preview",title:"Shot Preview 19",summary:"",detail:"",image:"/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-20",kind:"preview",category:"Preview",title:"Shot Preview 20",summary:"",detail:"",image:"/Projects/shot-small-20.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-22",kind:"preview",category:"Preview",title:"Shot Preview 22",summary:"",detail:"",image:"/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-23",kind:"preview",category:"Preview",title:"Shot Preview 23",summary:"",detail:"",image:"/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"widget-music",kind:"info",category:"Widget",title:"Music Player",summary:"A focused listening mix for design sessions.",detail:"Ambient and electronic tracks for deep work and prototyping.",image:"",ctaLabel:"Spotify Embed",ctaHref:"https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator",ctaExternal:!0},{id:"widget-map",kind:"info",category:"Widget",title:"Map",summary:"Current location and nearby context.",detail:"Map snapshot centered on Miami, FL.",image:"",ctaLabel:"Open in Maps",ctaHref:"https://maps.google.com/?q=Miami,FL",ctaExternal:!0},{id:"info-cv",kind:"info",category:"CV",title:"Curriculum Vitae",summary:"Experience, projects, and selected work history.",detail:"A concise overview of product design roles, outcomes, and capabilities.",image:Rv,ctaLabel:"Open LinkedIn",ctaHref:ga.linkedin,ctaExternal:!0},{id:"info-about",kind:"info",category:"About",title:"About",summary:"Product designer focused on clarity, systems, and practical craft.",detail:"I design dependable experiences with clean hierarchy and thoughtful interaction.",image:jv,ctaLabel:"About Profile",ctaHref:ga.linkedin,ctaExternal:!0},{id:"info-notes",kind:"info",category:"Notes",title:"Design Notes",summary:"Short notes on process, interaction ideas, and UI experiments.",detail:"A running collection of observations, rationale, and implementation details.",image:Nv,ctaLabel:"View GitHub",ctaHref:ga.github,ctaExternal:!0},{id:"info-social",kind:"info",category:"Social",title:"Basic Social Links",summary:"Email, GitHub, and LinkedIn for quick contact.",detail:"Reach out by email or connect via GitHub and LinkedIn.",image:Mv,ctaLabel:"Open LinkedIn",ctaHref:ga.linkedin,ctaExternal:!0}];function kv(i){return!i||i==="/"?"/":i.replace(/\/+$/,"")}function Yv(){const o=(typeof window>"u"?"/":kv(window.location.pathname))==="/styleguide";return g.jsxs("div",{"data-theme":"light",className:"relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]",children:[g.jsx("a",{href:"#main-content",className:"skip-link",children:"Skip to content"}),o?g.jsx(Av,{links:ga,name:Hm.name}):g.jsx("main",{id:"main-content",tabIndex:-1,className:"relative z-dock",children:g.jsx(wv,{cards:Uv,profile:Hm,links:ga,showProjects:!1})}),null]})}mp.createRoot(document.getElementById("root")).render(g.jsx(T.StrictMode,{children:g.jsx(Yv,{})}));
