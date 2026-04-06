function hp(i,u){for(var s=0;s<u.length;s++){const r=u[s];if(typeof r!="string"&&!Array.isArray(r)){for(const f in r)if(f!=="default"&&!(f in i)){const _=Object.getOwnPropertyDescriptor(r,f);_&&Object.defineProperty(i,f,_.get?_:{enumerable:!0,get:()=>r[f]})}}}return Object.freeze(Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}))}(function(){const u=document.createElement("link").relList;if(u&&u.supports&&u.supports("modulepreload"))return;for(const f of document.querySelectorAll('link[rel="modulepreload"]'))r(f);new MutationObserver(f=>{for(const _ of f)if(_.type==="childList")for(const y of _.addedNodes)y.tagName==="LINK"&&y.rel==="modulepreload"&&r(y)}).observe(document,{childList:!0,subtree:!0});function s(f){const _={};return f.integrity&&(_.integrity=f.integrity),f.referrerPolicy&&(_.referrerPolicy=f.referrerPolicy),f.crossOrigin==="use-credentials"?_.credentials="include":f.crossOrigin==="anonymous"?_.credentials="omit":_.credentials="same-origin",_}function r(f){if(f.ep)return;f.ep=!0;const _=s(f);fetch(f.href,_)}})();function bp(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}var Cr={exports:{}},mi={};var om;function vp(){if(om)return mi;om=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.fragment");function s(r,f,_){var y=null;if(_!==void 0&&(y=""+_),f.key!==void 0&&(y=""+f.key),"key"in f){_={};for(var x in f)x!=="key"&&(_[x]=f[x])}else _=f;return f=_.ref,{$$typeof:i,type:r,key:y,ref:f!==void 0?f:null,props:_}}return mi.Fragment=u,mi.jsx=s,mi.jsxs=s,mi}var um;function xp(){return um||(um=1,Cr.exports=vp()),Cr.exports}var g=xp(),Or={exports:{}},me={};var sm;function Sp(){if(sm)return me;sm=1;var i=Symbol.for("react.transitional.element"),u=Symbol.for("react.portal"),s=Symbol.for("react.fragment"),r=Symbol.for("react.strict_mode"),f=Symbol.for("react.profiler"),_=Symbol.for("react.consumer"),y=Symbol.for("react.context"),x=Symbol.for("react.forward_ref"),h=Symbol.for("react.suspense"),m=Symbol.for("react.memo"),A=Symbol.for("react.lazy"),E=Symbol.for("react.activity"),z=Symbol.iterator;function j(b){return b===null||typeof b!="object"?null:(b=z&&b[z]||b["@@iterator"],typeof b=="function"?b:null)}var L={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},B=Object.assign,I={};function Z(b,U,X){this.props=b,this.context=U,this.refs=I,this.updater=X||L}Z.prototype.isReactComponent={},Z.prototype.setState=function(b,U){if(typeof b!="object"&&typeof b!="function"&&b!=null)throw Error("takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,b,U,"setState")},Z.prototype.forceUpdate=function(b){this.updater.enqueueForceUpdate(this,b,"forceUpdate")};function $(){}$.prototype=Z.prototype;function G(b,U,X){this.props=b,this.context=U,this.refs=I,this.updater=X||L}var Q=G.prototype=new $;Q.constructor=G,B(Q,Z.prototype),Q.isPureReactComponent=!0;var te=Array.isArray;function ne(){}var F={H:null,A:null,T:null,S:null},oe=Object.prototype.hasOwnProperty;function H(b,U,X){var J=X.ref;return{$$typeof:i,type:b,key:U,ref:J!==void 0?J:null,props:X}}function le(b,U){return H(b.type,U,b.props)}function re(b){return typeof b=="object"&&b!==null&&b.$$typeof===i}function Ce(b){var U={"=":"=0",":":"=2"};return"$"+b.replace(/[=:]/g,function(X){return U[X]})}var We=/\/+/g;function Xe(b,U){return typeof b=="object"&&b!==null&&b.key!=null?Ce(""+b.key):U.toString(36)}function ce(b){switch(b.status){case"fulfilled":return b.value;case"rejected":throw b.reason;default:switch(typeof b.status=="string"?b.then(ne,ne):(b.status="pending",b.then(function(U){b.status==="pending"&&(b.status="fulfilled",b.value=U)},function(U){b.status==="pending"&&(b.status="rejected",b.reason=U)})),b.status){case"fulfilled":return b.value;case"rejected":throw b.reason}}throw b}function N(b,U,X,J,se){var pe=typeof b;(pe==="undefined"||pe==="boolean")&&(b=null);var Ee=!1;if(b===null)Ee=!0;else switch(pe){case"bigint":case"string":case"number":Ee=!0;break;case"object":switch(b.$$typeof){case i:case u:Ee=!0;break;case A:return Ee=b._init,N(Ee(b._payload),U,X,J,se)}}if(Ee)return se=se(b),Ee=J===""?"."+Xe(b,0):J,te(se)?(X="",Ee!=null&&(X=Ee.replace(We,"$&/")+"/"),N(se,U,X,"",function(Yt){return Yt})):se!=null&&(re(se)&&(se=le(se,X+(se.key==null||b&&b.key===se.key?"":(""+se.key).replace(We,"$&/")+"/")+Ee)),U.push(se)),1;Ee=0;var Je=J===""?".":J+":";if(te(b))for(var Me=0;Me<b.length;Me++)J=b[Me],pe=Je+Xe(J,Me),Ee+=N(J,U,X,pe,se);else if(Me=j(b),typeof Me=="function")for(b=Me.call(b),Me=0;!(J=b.next()).done;)J=J.value,pe=Je+Xe(J,Me++),Ee+=N(J,U,X,pe,se);else if(pe==="object"){if(typeof b.then=="function")return N(ce(b),U,X,J,se);throw U=String(b),Error("Objects are not valid as a React child (found: "+(U==="[object Object]"?"object with keys {"+Object.keys(b).join(", ")+"}":U)+"). If you meant to render a collection of children, use an array instead.")}return Ee}function q(b,U,X){if(b==null)return b;var J=[],se=0;return N(b,J,"","",function(pe){return U.call(X,pe,se++)}),J}function K(b){if(b._status===-1){var U=b._result;U=U(),U.then(function(X){(b._status===0||b._status===-1)&&(b._status=1,b._result=X)},function(X){(b._status===0||b._status===-1)&&(b._status=2,b._result=X)}),b._status===-1&&(b._status=0,b._result=U)}if(b._status===1)return b._result.default;throw b._result}var ae=typeof reportError=="function"?reportError:function(b){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var U=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof b=="object"&&b!==null&&typeof b.message=="string"?String(b.message):String(b),error:b});if(!window.dispatchEvent(U))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",b);return}console.error(b)},ve={map:q,forEach:function(b,U,X){q(b,function(){U.apply(this,arguments)},X)},count:function(b){var U=0;return q(b,function(){U++}),U},toArray:function(b){return q(b,function(U){return U})||[]},only:function(b){if(!re(b))throw Error("React.Children.only expected to receive a single React element child.");return b}};return me.Activity=E,me.Children=ve,me.Component=Z,me.Fragment=s,me.Profiler=f,me.PureComponent=G,me.StrictMode=r,me.Suspense=h,me.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=F,me.__COMPILER_RUNTIME={__proto__:null,c:function(b){return F.H.useMemoCache(b)}},me.cache=function(b){return function(){return b.apply(null,arguments)}},me.cacheSignal=function(){return null},me.cloneElement=function(b,U,X){if(b==null)throw Error("The argument must be a React element, but you passed "+b+".");var J=B({},b.props),se=b.key;if(U!=null)for(pe in U.key!==void 0&&(se=""+U.key),U)!oe.call(U,pe)||pe==="key"||pe==="__self"||pe==="__source"||pe==="ref"&&U.ref===void 0||(J[pe]=U[pe]);var pe=arguments.length-2;if(pe===1)J.children=X;else if(1<pe){for(var Ee=Array(pe),Je=0;Je<pe;Je++)Ee[Je]=arguments[Je+2];J.children=Ee}return H(b.type,se,J)},me.createContext=function(b){return b={$$typeof:y,_currentValue:b,_currentValue2:b,_threadCount:0,Provider:null,Consumer:null},b.Provider=b,b.Consumer={$$typeof:_,_context:b},b},me.createElement=function(b,U,X){var J,se={},pe=null;if(U!=null)for(J in U.key!==void 0&&(pe=""+U.key),U)oe.call(U,J)&&J!=="key"&&J!=="__self"&&J!=="__source"&&(se[J]=U[J]);var Ee=arguments.length-2;if(Ee===1)se.children=X;else if(1<Ee){for(var Je=Array(Ee),Me=0;Me<Ee;Me++)Je[Me]=arguments[Me+2];se.children=Je}if(b&&b.defaultProps)for(J in Ee=b.defaultProps,Ee)se[J]===void 0&&(se[J]=Ee[J]);return H(b,pe,se)},me.createRef=function(){return{current:null}},me.forwardRef=function(b){return{$$typeof:x,render:b}},me.isValidElement=re,me.lazy=function(b){return{$$typeof:A,_payload:{_status:-1,_result:b},_init:K}},me.memo=function(b,U){return{$$typeof:m,type:b,compare:U===void 0?null:U}},me.startTransition=function(b){var U=F.T,X={};F.T=X;try{var J=b(),se=F.S;se!==null&&se(X,J),typeof J=="object"&&J!==null&&typeof J.then=="function"&&J.then(ne,ae)}catch(pe){ae(pe)}finally{U!==null&&X.types!==null&&(U.types=X.types),F.T=U}},me.unstable_useCacheRefresh=function(){return F.H.useCacheRefresh()},me.use=function(b){return F.H.use(b)},me.useActionState=function(b,U,X){return F.H.useActionState(b,U,X)},me.useCallback=function(b,U){return F.H.useCallback(b,U)},me.useContext=function(b){return F.H.useContext(b)},me.useDebugValue=function(){},me.useDeferredValue=function(b,U){return F.H.useDeferredValue(b,U)},me.useEffect=function(b,U){return F.H.useEffect(b,U)},me.useEffectEvent=function(b){return F.H.useEffectEvent(b)},me.useId=function(){return F.H.useId()},me.useImperativeHandle=function(b,U,X){return F.H.useImperativeHandle(b,U,X)},me.useInsertionEffect=function(b,U){return F.H.useInsertionEffect(b,U)},me.useLayoutEffect=function(b,U){return F.H.useLayoutEffect(b,U)},me.useMemo=function(b,U){return F.H.useMemo(b,U)},me.useOptimistic=function(b,U){return F.H.useOptimistic(b,U)},me.useReducer=function(b,U,X){return F.H.useReducer(b,U,X)},me.useRef=function(b){return F.H.useRef(b)},me.useState=function(b){return F.H.useState(b)},me.useSyncExternalStore=function(b,U,X){return F.H.useSyncExternalStore(b,U,X)},me.useTransition=function(){return F.H.useTransition()},me.version="19.2.4",me}var rm;function Si(){return rm||(rm=1,Or.exports=Sp()),Or.exports}var w=Si();const Ep=bp(w),Im=hp({__proto__:null,default:Ep},[w]);var Ar={exports:{}},gi={},zr={exports:{}},Rr={};var cm;function wp(){return cm||(cm=1,(function(i){function u(N,q){var K=N.length;N.push(q);e:for(;0<K;){var ae=K-1>>>1,ve=N[ae];if(0<f(ve,q))N[ae]=q,N[K]=ve,K=ae;else break e}}function s(N){return N.length===0?null:N[0]}function r(N){if(N.length===0)return null;var q=N[0],K=N.pop();if(K!==q){N[0]=K;e:for(var ae=0,ve=N.length,b=ve>>>1;ae<b;){var U=2*(ae+1)-1,X=N[U],J=U+1,se=N[J];if(0>f(X,K))J<ve&&0>f(se,X)?(N[ae]=se,N[J]=K,ae=J):(N[ae]=X,N[U]=K,ae=U);else if(J<ve&&0>f(se,K))N[ae]=se,N[J]=K,ae=J;else break e}}return q}function f(N,q){var K=N.sortIndex-q.sortIndex;return K!==0?K:N.id-q.id}if(i.unstable_now=void 0,typeof performance=="object"&&typeof performance.now=="function"){var _=performance;i.unstable_now=function(){return _.now()}}else{var y=Date,x=y.now();i.unstable_now=function(){return y.now()-x}}var h=[],m=[],A=1,E=null,z=3,j=!1,L=!1,B=!1,I=!1,Z=typeof setTimeout=="function"?setTimeout:null,$=typeof clearTimeout=="function"?clearTimeout:null,G=typeof setImmediate<"u"?setImmediate:null;function Q(N){for(var q=s(m);q!==null;){if(q.callback===null)r(m);else if(q.startTime<=N)r(m),q.sortIndex=q.expirationTime,u(h,q);else break;q=s(m)}}function te(N){if(B=!1,Q(N),!L)if(s(h)!==null)L=!0,ne||(ne=!0,Ce());else{var q=s(m);q!==null&&ce(te,q.startTime-N)}}var ne=!1,F=-1,oe=5,H=-1;function le(){return I?!0:!(i.unstable_now()-H<oe)}function re(){if(I=!1,ne){var N=i.unstable_now();H=N;var q=!0;try{e:{L=!1,B&&(B=!1,$(F),F=-1),j=!0;var K=z;try{t:{for(Q(N),E=s(h);E!==null&&!(E.expirationTime>N&&le());){var ae=E.callback;if(typeof ae=="function"){E.callback=null,z=E.priorityLevel;var ve=ae(E.expirationTime<=N);if(N=i.unstable_now(),typeof ve=="function"){E.callback=ve,Q(N),q=!0;break t}E===s(h)&&r(h),Q(N)}else r(h);E=s(h)}if(E!==null)q=!0;else{var b=s(m);b!==null&&ce(te,b.startTime-N),q=!1}}break e}finally{E=null,z=K,j=!1}q=void 0}}finally{q?Ce():ne=!1}}}var Ce;if(typeof G=="function")Ce=function(){G(re)};else if(typeof MessageChannel<"u"){var We=new MessageChannel,Xe=We.port2;We.port1.onmessage=re,Ce=function(){Xe.postMessage(null)}}else Ce=function(){Z(re,0)};function ce(N,q){F=Z(function(){N(i.unstable_now())},q)}i.unstable_IdlePriority=5,i.unstable_ImmediatePriority=1,i.unstable_LowPriority=4,i.unstable_NormalPriority=3,i.unstable_Profiling=null,i.unstable_UserBlockingPriority=2,i.unstable_cancelCallback=function(N){N.callback=null},i.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):oe=0<N?Math.floor(1e3/N):5},i.unstable_getCurrentPriorityLevel=function(){return z},i.unstable_next=function(N){switch(z){case 1:case 2:case 3:var q=3;break;default:q=z}var K=z;z=q;try{return N()}finally{z=K}},i.unstable_requestPaint=function(){I=!0},i.unstable_runWithPriority=function(N,q){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var K=z;z=N;try{return q()}finally{z=K}},i.unstable_scheduleCallback=function(N,q,K){var ae=i.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ae+K:ae):K=ae,N){case 1:var ve=-1;break;case 2:ve=250;break;case 5:ve=1073741823;break;case 4:ve=1e4;break;default:ve=5e3}return ve=K+ve,N={id:A++,callback:q,priorityLevel:N,startTime:K,expirationTime:ve,sortIndex:-1},K>ae?(N.sortIndex=K,u(m,N),s(h)===null&&N===s(m)&&(B?($(F),F=-1):B=!0,ce(te,K-ae))):(N.sortIndex=ve,u(h,N),L||j||(L=!0,ne||(ne=!0,Ce()))),N},i.unstable_shouldYield=le,i.unstable_wrapCallback=function(N){var q=z;return function(){var K=z;z=q;try{return N.apply(this,arguments)}finally{z=K}}}})(Rr)),Rr}var fm;function Tp(){return fm||(fm=1,zr.exports=wp()),zr.exports}var Nr={exports:{}},yt={};var dm;function Cp(){if(dm)return yt;dm=1;var i=Si();function u(h){var m="https://react.dev/errors/"+h;if(1<arguments.length){m+="?args[]="+encodeURIComponent(arguments[1]);for(var A=2;A<arguments.length;A++)m+="&args[]="+encodeURIComponent(arguments[A])}return"Minified React error #"+h+"; visit "+m+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function s(){}var r={d:{f:s,r:function(){throw Error(u(522))},D:s,C:s,L:s,m:s,X:s,S:s,M:s},p:0,findDOMNode:null},f=Symbol.for("react.portal");function _(h,m,A){var E=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:f,key:E==null?null:""+E,children:h,containerInfo:m,implementation:A}}var y=i.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function x(h,m){if(h==="font")return"";if(typeof m=="string")return m==="use-credentials"?m:""}return yt.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=r,yt.createPortal=function(h,m){var A=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!m||m.nodeType!==1&&m.nodeType!==9&&m.nodeType!==11)throw Error(u(299));return _(h,m,null,A)},yt.flushSync=function(h){var m=y.T,A=r.p;try{if(y.T=null,r.p=2,h)return h()}finally{y.T=m,r.p=A,r.d.f()}},yt.preconnect=function(h,m){typeof h=="string"&&(m?(m=m.crossOrigin,m=typeof m=="string"?m==="use-credentials"?m:"":void 0):m=null,r.d.C(h,m))},yt.prefetchDNS=function(h){typeof h=="string"&&r.d.D(h)},yt.preinit=function(h,m){if(typeof h=="string"&&m&&typeof m.as=="string"){var A=m.as,E=x(A,m.crossOrigin),z=typeof m.integrity=="string"?m.integrity:void 0,j=typeof m.fetchPriority=="string"?m.fetchPriority:void 0;A==="style"?r.d.S(h,typeof m.precedence=="string"?m.precedence:void 0,{crossOrigin:E,integrity:z,fetchPriority:j}):A==="script"&&r.d.X(h,{crossOrigin:E,integrity:z,fetchPriority:j,nonce:typeof m.nonce=="string"?m.nonce:void 0})}},yt.preinitModule=function(h,m){if(typeof h=="string")if(typeof m=="object"&&m!==null){if(m.as==null||m.as==="script"){var A=x(m.as,m.crossOrigin);r.d.M(h,{crossOrigin:A,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0})}}else m==null&&r.d.M(h)},yt.preload=function(h,m){if(typeof h=="string"&&typeof m=="object"&&m!==null&&typeof m.as=="string"){var A=m.as,E=x(A,m.crossOrigin);r.d.L(h,A,{crossOrigin:E,integrity:typeof m.integrity=="string"?m.integrity:void 0,nonce:typeof m.nonce=="string"?m.nonce:void 0,type:typeof m.type=="string"?m.type:void 0,fetchPriority:typeof m.fetchPriority=="string"?m.fetchPriority:void 0,referrerPolicy:typeof m.referrerPolicy=="string"?m.referrerPolicy:void 0,imageSrcSet:typeof m.imageSrcSet=="string"?m.imageSrcSet:void 0,imageSizes:typeof m.imageSizes=="string"?m.imageSizes:void 0,media:typeof m.media=="string"?m.media:void 0})}},yt.preloadModule=function(h,m){if(typeof h=="string")if(m){var A=x(m.as,m.crossOrigin);r.d.m(h,{as:typeof m.as=="string"&&m.as!=="script"?m.as:void 0,crossOrigin:A,integrity:typeof m.integrity=="string"?m.integrity:void 0})}else r.d.m(h)},yt.requestFormReset=function(h){r.d.r(h)},yt.unstable_batchedUpdates=function(h,m){return h(m)},yt.useFormState=function(h,m,A){return y.H.useFormState(h,m,A)},yt.useFormStatus=function(){return y.H.useHostTransitionStatus()},yt.version="19.2.4",yt}var _m;function Fm(){if(_m)return Nr.exports;_m=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),Nr.exports=Cp(),Nr.exports}var mm;function Op(){if(mm)return gi;mm=1;var i=Tp(),u=Si(),s=Fm();function r(e){var t="https://react.dev/errors/"+e;if(1<arguments.length){t+="?args[]="+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+="&args[]="+encodeURIComponent(arguments[n])}return"Minified React error #"+e+"; visit "+t+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}function f(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function _(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,(t.flags&4098)!==0&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function y(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function x(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function h(e){if(_(e)!==e)throw Error(r(188))}function m(e){var t=e.alternate;if(!t){if(t=_(e),t===null)throw Error(r(188));return t!==e?null:e}for(var n=e,l=t;;){var a=n.return;if(a===null)break;var o=a.alternate;if(o===null){if(l=a.return,l!==null){n=l;continue}break}if(a.child===o.child){for(o=a.child;o;){if(o===n)return h(a),e;if(o===l)return h(a),t;o=o.sibling}throw Error(r(188))}if(n.return!==l.return)n=a,l=o;else{for(var c=!1,d=a.child;d;){if(d===n){c=!0,n=a,l=o;break}if(d===l){c=!0,l=a,n=o;break}d=d.sibling}if(!c){for(d=o.child;d;){if(d===n){c=!0,n=o,l=a;break}if(d===l){c=!0,l=o,n=a;break}d=d.sibling}if(!c)throw Error(r(189))}}if(n.alternate!==l)throw Error(r(190))}if(n.tag!==3)throw Error(r(188));return n.stateNode.current===n?e:t}function A(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=A(e),t!==null)return t;e=e.sibling}return null}var E=Object.assign,z=Symbol.for("react.element"),j=Symbol.for("react.transitional.element"),L=Symbol.for("react.portal"),B=Symbol.for("react.fragment"),I=Symbol.for("react.strict_mode"),Z=Symbol.for("react.profiler"),$=Symbol.for("react.consumer"),G=Symbol.for("react.context"),Q=Symbol.for("react.forward_ref"),te=Symbol.for("react.suspense"),ne=Symbol.for("react.suspense_list"),F=Symbol.for("react.memo"),oe=Symbol.for("react.lazy"),H=Symbol.for("react.activity"),le=Symbol.for("react.memo_cache_sentinel"),re=Symbol.iterator;function Ce(e){return e===null||typeof e!="object"?null:(e=re&&e[re]||e["@@iterator"],typeof e=="function"?e:null)}var We=Symbol.for("react.client.reference");function Xe(e){if(e==null)return null;if(typeof e=="function")return e.$$typeof===We?null:e.displayName||e.name||null;if(typeof e=="string")return e;switch(e){case B:return"Fragment";case Z:return"Profiler";case I:return"StrictMode";case te:return"Suspense";case ne:return"SuspenseList";case H:return"Activity"}if(typeof e=="object")switch(e.$$typeof){case L:return"Portal";case G:return e.displayName||"Context";case $:return(e._context.displayName||"Context")+".Consumer";case Q:var t=e.render;return e=e.displayName,e||(e=t.displayName||t.name||"",e=e!==""?"ForwardRef("+e+")":"ForwardRef"),e;case F:return t=e.displayName||null,t!==null?t:Xe(e.type)||"Memo";case oe:t=e._payload,e=e._init;try{return Xe(e(t))}catch{}}return null}var ce=Array.isArray,N=u.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,q=s.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,K={pending:!1,data:null,method:null,action:null},ae=[],ve=-1;function b(e){return{current:e}}function U(e){0>ve||(e.current=ae[ve],ae[ve]=null,ve--)}function X(e,t){ve++,ae[ve]=e.current,e.current=t}var J=b(null),se=b(null),pe=b(null),Ee=b(null);function Je(e,t){switch(X(pe,t),X(se,e),X(J,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?z_(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=z_(t),e=R_(t,e);else switch(e){case"svg":e=1;break;case"math":e=2;break;default:e=0}}U(J),X(J,e)}function Me(){U(J),U(se),U(pe)}function Yt(e){e.memoizedState!==null&&X(Ee,e);var t=J.current,n=R_(t,e.type);t!==n&&(X(se,e),X(J,n))}function It(e){se.current===e&&(U(J),U(se)),Ee.current===e&&(U(Ee),ci._currentValue=K)}var D,ge;function ee(e){if(D===void 0)try{throw Error()}catch(n){var t=n.stack.trim().match(/\n( *(at )?)/);D=t&&t[1]||"",ge=-1<n.stack.indexOf(`
    at`)?" (<anonymous>)":-1<n.stack.indexOf("@")?"@unknown:0:0":""}return`
`+D+e+ge}var it=!1;function V(e,t){if(!e||it)return"";it=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var l={DetermineComponentFrameRoot:function(){try{if(t){var Y=function(){throw Error()};if(Object.defineProperty(Y.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(Y,[])}catch(R){var O=R}Reflect.construct(e,[],Y)}else{try{Y.call()}catch(R){O=R}e.call(Y.prototype)}}else{try{throw Error()}catch(R){O=R}(Y=e())&&typeof Y.catch=="function"&&Y.catch(function(){})}}catch(R){if(R&&O&&typeof R.stack=="string")return[R.stack,O.stack]}return[null,null]}};l.DetermineComponentFrameRoot.displayName="DetermineComponentFrameRoot";var a=Object.getOwnPropertyDescriptor(l.DetermineComponentFrameRoot,"name");a&&a.configurable&&Object.defineProperty(l.DetermineComponentFrameRoot,"name",{value:"DetermineComponentFrameRoot"});var o=l.DetermineComponentFrameRoot(),c=o[0],d=o[1];if(c&&d){var p=c.split(`
`),C=d.split(`
`);for(a=l=0;l<p.length&&!p[l].includes("DetermineComponentFrameRoot");)l++;for(;a<C.length&&!C[a].includes("DetermineComponentFrameRoot");)a++;if(l===p.length||a===C.length)for(l=p.length-1,a=C.length-1;1<=l&&0<=a&&p[l]!==C[a];)a--;for(;1<=l&&0<=a;l--,a--)if(p[l]!==C[a]){if(l!==1||a!==1)do if(l--,a--,0>a||p[l]!==C[a]){var M=`
`+p[l].replace(" at new "," at ");return e.displayName&&M.includes("<anonymous>")&&(M=M.replace("<anonymous>",e.displayName)),M}while(1<=l&&0<=a);break}}}finally{it=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:"")?ee(n):""}function de(e,t){switch(e.tag){case 26:case 27:case 5:return ee(e.type);case 16:return ee("Lazy");case 13:return e.child!==t&&t!==null?ee("Suspense Fallback"):ee("Suspense");case 19:return ee("SuspenseList");case 0:case 15:return V(e.type,!1);case 11:return V(e.type.render,!1);case 1:return V(e.type,!0);case 31:return ee("Activity");default:return""}}function be(e){try{var t="",n=null;do t+=de(e,n),n=e,e=e.return;while(e);return t}catch(l){return`
Error generating stack: `+l.message+`
`+l.stack}}var Ae=Object.prototype.hasOwnProperty,Ge=i.unstable_scheduleCallback,_e=i.unstable_cancelCallback,fe=i.unstable_shouldYield,pt=i.unstable_requestPaint,Ye=i.unstable_now,zn=i.unstable_getCurrentPriorityLevel,il=i.unstable_ImmediatePriority,Cl=i.unstable_UserBlockingPriority,Rn=i.unstable_NormalPriority,bt=i.unstable_LowPriority,Nn=i.unstable_IdlePriority,Ol=i.log,tg=i.unstable_setDisableYieldValue,Sa=null,At=null;function jn(e){if(typeof Ol=="function"&&tg(e),At&&typeof At.setStrictMode=="function")try{At.setStrictMode(Sa,e)}catch{}}var zt=Math.clz32?Math.clz32:ag,ng=Math.log,lg=Math.LN2;function ag(e){return e>>>=0,e===0?32:31-(ng(e)/lg|0)|0}var Oi=256,Ai=262144,zi=4194304;function ol(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function Ri(e,t,n){var l=e.pendingLanes;if(l===0)return 0;var a=0,o=e.suspendedLanes,c=e.pingedLanes;e=e.warmLanes;var d=l&134217727;return d!==0?(l=d&~o,l!==0?a=ol(l):(c&=d,c!==0?a=ol(c):n||(n=d&~e,n!==0&&(a=ol(n))))):(d=l&~o,d!==0?a=ol(d):c!==0?a=ol(c):n||(n=l&~e,n!==0&&(a=ol(n)))),a===0?0:t!==0&&t!==a&&(t&o)===0&&(o=a&-a,n=t&-t,o>=n||o===32&&(n&4194048)!==0)?t:a}function Ea(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function ig(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function rc(){var e=zi;return zi<<=1,(zi&62914560)===0&&(zi=4194304),e}function mu(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function wa(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function og(e,t,n,l,a,o){var c=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var d=e.entanglements,p=e.expirationTimes,C=e.hiddenUpdates;for(n=c&~n;0<n;){var M=31-zt(n),Y=1<<M;d[M]=0,p[M]=-1;var O=C[M];if(O!==null)for(C[M]=null,M=0;M<O.length;M++){var R=O[M];R!==null&&(R.lane&=-536870913)}n&=~Y}l!==0&&cc(e,l,0),o!==0&&a===0&&e.tag!==0&&(e.suspendedLanes|=o&~(c&~t))}function cc(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var l=31-zt(t);e.entangledLanes|=t,e.entanglements[l]=e.entanglements[l]|1073741824|n&261930}function fc(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var l=31-zt(n),a=1<<l;a&t|e[l]&t&&(e[l]|=t),n&=~a}}function dc(e,t){var n=t&-t;return n=(n&42)!==0?1:gu(n),(n&(e.suspendedLanes|t))!==0?0:n}function gu(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function yu(e){return e&=-e,2<e?8<e?(e&134217727)!==0?32:268435456:8:2}function _c(){var e=q.p;return e!==0?e:(e=window.event,e===void 0?32:P_(e.type))}function mc(e,t){var n=q.p;try{return q.p=e,t()}finally{q.p=n}}var Mn=Math.random().toString(36).slice(2),ct="__reactFiber$"+Mn,vt="__reactProps$"+Mn,Al="__reactContainer$"+Mn,pu="__reactEvents$"+Mn,ug="__reactListeners$"+Mn,sg="__reactHandles$"+Mn,gc="__reactResources$"+Mn,Ta="__reactMarker$"+Mn;function hu(e){delete e[ct],delete e[vt],delete e[pu],delete e[ug],delete e[sg]}function zl(e){var t=e[ct];if(t)return t;for(var n=e.parentNode;n;){if(t=n[Al]||n[ct]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=Y_(e);e!==null;){if(n=e[ct])return n;e=Y_(e)}return t}e=n,n=e.parentNode}return null}function Rl(e){if(e=e[ct]||e[Al]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Ca(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(r(33))}function Nl(e){var t=e[gc];return t||(t=e[gc]={hoistableStyles:new Map,hoistableScripts:new Map}),t}function ut(e){e[Ta]=!0}var yc=new Set,pc={};function ul(e,t){jl(e,t),jl(e+"Capture",t)}function jl(e,t){for(pc[e]=t,e=0;e<t.length;e++)yc.add(t[e])}var rg=RegExp("^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$"),hc={},bc={};function cg(e){return Ae.call(bc,e)?!0:Ae.call(hc,e)?!1:rg.test(e)?bc[e]=!0:(hc[e]=!0,!1)}function Ni(e,t,n){if(cg(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":e.removeAttribute(t);return;case"boolean":var l=t.toLowerCase().slice(0,5);if(l!=="data-"&&l!=="aria-"){e.removeAttribute(t);return}}e.setAttribute(t,""+n)}}function ji(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(t);return}e.setAttribute(t,""+n)}}function sn(e,t,n,l){if(l===null)e.removeAttribute(n);else{switch(typeof l){case"undefined":case"function":case"symbol":case"boolean":e.removeAttribute(n);return}e.setAttributeNS(t,n,""+l)}}function Lt(e){switch(typeof e){case"bigint":case"boolean":case"number":case"string":case"undefined":return e;case"object":return e;default:return""}}function vc(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()==="input"&&(t==="checkbox"||t==="radio")}function fg(e,t,n){var l=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&typeof l<"u"&&typeof l.get=="function"&&typeof l.set=="function"){var a=l.get,o=l.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return a.call(this)},set:function(c){n=""+c,o.call(this,c)}}),Object.defineProperty(e,t,{enumerable:l.enumerable}),{getValue:function(){return n},setValue:function(c){n=""+c},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function bu(e){if(!e._valueTracker){var t=vc(e)?"checked":"value";e._valueTracker=fg(e,t,""+e[t])}}function xc(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),l="";return e&&(l=vc(e)?e.checked?"true":"false":e.value),e=l,e!==n?(t.setValue(e),!0):!1}function Mi(e){if(e=e||(typeof document<"u"?document:void 0),typeof e>"u")return null;try{return e.activeElement||e.body}catch{return e.body}}var dg=/[\n"\\]/g;function Bt(e){return e.replace(dg,function(t){return"\\"+t.charCodeAt(0).toString(16)+" "})}function vu(e,t,n,l,a,o,c,d){e.name="",c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"?e.type=c:e.removeAttribute("type"),t!=null?c==="number"?(t===0&&e.value===""||e.value!=t)&&(e.value=""+Lt(t)):e.value!==""+Lt(t)&&(e.value=""+Lt(t)):c!=="submit"&&c!=="reset"||e.removeAttribute("value"),t!=null?xu(e,c,Lt(t)):n!=null?xu(e,c,Lt(n)):l!=null&&e.removeAttribute("value"),a==null&&o!=null&&(e.defaultChecked=!!o),a!=null&&(e.checked=a&&typeof a!="function"&&typeof a!="symbol"),d!=null&&typeof d!="function"&&typeof d!="symbol"&&typeof d!="boolean"?e.name=""+Lt(d):e.removeAttribute("name")}function Sc(e,t,n,l,a,o,c,d){if(o!=null&&typeof o!="function"&&typeof o!="symbol"&&typeof o!="boolean"&&(e.type=o),t!=null||n!=null){if(!(o!=="submit"&&o!=="reset"||t!=null)){bu(e);return}n=n!=null?""+Lt(n):"",t=t!=null?""+Lt(t):n,d||t===e.value||(e.value=t),e.defaultValue=t}l=l??a,l=typeof l!="function"&&typeof l!="symbol"&&!!l,e.checked=d?e.checked:!!l,e.defaultChecked=!!l,c!=null&&typeof c!="function"&&typeof c!="symbol"&&typeof c!="boolean"&&(e.name=c),bu(e)}function xu(e,t,n){t==="number"&&Mi(e.ownerDocument)===e||e.defaultValue===""+n||(e.defaultValue=""+n)}function Ml(e,t,n,l){if(e=e.options,t){t={};for(var a=0;a<n.length;a++)t["$"+n[a]]=!0;for(n=0;n<e.length;n++)a=t.hasOwnProperty("$"+e[n].value),e[n].selected!==a&&(e[n].selected=a),a&&l&&(e[n].defaultSelected=!0)}else{for(n=""+Lt(n),t=null,a=0;a<e.length;a++){if(e[a].value===n){e[a].selected=!0,l&&(e[a].defaultSelected=!0);return}t!==null||e[a].disabled||(t=e[a])}t!==null&&(t.selected=!0)}}function Ec(e,t,n){if(t!=null&&(t=""+Lt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n!=null?""+Lt(n):""}function wc(e,t,n,l){if(t==null){if(l!=null){if(n!=null)throw Error(r(92));if(ce(l)){if(1<l.length)throw Error(r(93));l=l[0]}n=l}n==null&&(n=""),t=n}n=Lt(t),e.defaultValue=n,l=e.textContent,l===n&&l!==""&&l!==null&&(e.value=l),bu(e)}function Dl(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var _g=new Set("animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp".split(" "));function Tc(e,t,n){var l=t.indexOf("--")===0;n==null||typeof n=="boolean"||n===""?l?e.setProperty(t,""):t==="float"?e.cssFloat="":e[t]="":l?e.setProperty(t,n):typeof n!="number"||n===0||_g.has(t)?t==="float"?e.cssFloat=n:e[t]=(""+n).trim():e[t]=n+"px"}function Cc(e,t,n){if(t!=null&&typeof t!="object")throw Error(r(62));if(e=e.style,n!=null){for(var l in n)!n.hasOwnProperty(l)||t!=null&&t.hasOwnProperty(l)||(l.indexOf("--")===0?e.setProperty(l,""):l==="float"?e.cssFloat="":e[l]="");for(var a in t)l=t[a],t.hasOwnProperty(a)&&n[a]!==l&&Tc(e,a,l)}else for(var o in t)t.hasOwnProperty(o)&&Tc(e,o,t[o])}function Su(e){if(e.indexOf("-")===-1)return!1;switch(e){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var mg=new Map([["acceptCharset","accept-charset"],["htmlFor","for"],["httpEquiv","http-equiv"],["crossOrigin","crossorigin"],["accentHeight","accent-height"],["alignmentBaseline","alignment-baseline"],["arabicForm","arabic-form"],["baselineShift","baseline-shift"],["capHeight","cap-height"],["clipPath","clip-path"],["clipRule","clip-rule"],["colorInterpolation","color-interpolation"],["colorInterpolationFilters","color-interpolation-filters"],["colorProfile","color-profile"],["colorRendering","color-rendering"],["dominantBaseline","dominant-baseline"],["enableBackground","enable-background"],["fillOpacity","fill-opacity"],["fillRule","fill-rule"],["floodColor","flood-color"],["floodOpacity","flood-opacity"],["fontFamily","font-family"],["fontSize","font-size"],["fontSizeAdjust","font-size-adjust"],["fontStretch","font-stretch"],["fontStyle","font-style"],["fontVariant","font-variant"],["fontWeight","font-weight"],["glyphName","glyph-name"],["glyphOrientationHorizontal","glyph-orientation-horizontal"],["glyphOrientationVertical","glyph-orientation-vertical"],["horizAdvX","horiz-adv-x"],["horizOriginX","horiz-origin-x"],["imageRendering","image-rendering"],["letterSpacing","letter-spacing"],["lightingColor","lighting-color"],["markerEnd","marker-end"],["markerMid","marker-mid"],["markerStart","marker-start"],["overlinePosition","overline-position"],["overlineThickness","overline-thickness"],["paintOrder","paint-order"],["panose-1","panose-1"],["pointerEvents","pointer-events"],["renderingIntent","rendering-intent"],["shapeRendering","shape-rendering"],["stopColor","stop-color"],["stopOpacity","stop-opacity"],["strikethroughPosition","strikethrough-position"],["strikethroughThickness","strikethrough-thickness"],["strokeDasharray","stroke-dasharray"],["strokeDashoffset","stroke-dashoffset"],["strokeLinecap","stroke-linecap"],["strokeLinejoin","stroke-linejoin"],["strokeMiterlimit","stroke-miterlimit"],["strokeOpacity","stroke-opacity"],["strokeWidth","stroke-width"],["textAnchor","text-anchor"],["textDecoration","text-decoration"],["textRendering","text-rendering"],["transformOrigin","transform-origin"],["underlinePosition","underline-position"],["underlineThickness","underline-thickness"],["unicodeBidi","unicode-bidi"],["unicodeRange","unicode-range"],["unitsPerEm","units-per-em"],["vAlphabetic","v-alphabetic"],["vHanging","v-hanging"],["vIdeographic","v-ideographic"],["vMathematical","v-mathematical"],["vectorEffect","vector-effect"],["vertAdvY","vert-adv-y"],["vertOriginX","vert-origin-x"],["vertOriginY","vert-origin-y"],["wordSpacing","word-spacing"],["writingMode","writing-mode"],["xmlnsXlink","xmlns:xlink"],["xHeight","x-height"]]),gg=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function Di(e){return gg.test(""+e)?"javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')":e}function rn(){}var Eu=null;function wu(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var kl=null,Ul=null;function Oc(e){var t=Rl(e);if(t&&(e=t.stateNode)){var n=e[vt]||null;e:switch(e=t.stateNode,t.type){case"input":if(vu(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type==="radio"&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll('input[name="'+Bt(""+t)+'"][type="radio"]'),t=0;t<n.length;t++){var l=n[t];if(l!==e&&l.form===e.form){var a=l[vt]||null;if(!a)throw Error(r(90));vu(l,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)l=n[t],l.form===e.form&&xc(l)}break e;case"textarea":Ec(e,n.value,n.defaultValue);break e;case"select":t=n.value,t!=null&&Ml(e,!!n.multiple,t,!1)}}}var Tu=!1;function Ac(e,t,n){if(Tu)return e(t,n);Tu=!0;try{var l=e(t);return l}finally{if(Tu=!1,(kl!==null||Ul!==null)&&(So(),kl&&(t=kl,e=Ul,Ul=kl=null,Oc(t),e)))for(t=0;t<e.length;t++)Oc(e[t])}}function Oa(e,t){var n=e.stateNode;if(n===null)return null;var l=n[vt]||null;if(l===null)return null;n=l[t];e:switch(t){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(l=!l.disabled)||(e=e.type,l=!(e==="button"||e==="input"||e==="select"||e==="textarea")),e=!l;break e;default:e=!1}if(e)return null;if(n&&typeof n!="function")throw Error(r(231,t,typeof n));return n}var cn=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Cu=!1;if(cn)try{var Aa={};Object.defineProperty(Aa,"passive",{get:function(){Cu=!0}}),window.addEventListener("test",Aa,Aa),window.removeEventListener("test",Aa,Aa)}catch{Cu=!1}var Dn=null,Ou=null,ki=null;function zc(){if(ki)return ki;var e,t=Ou,n=t.length,l,a="value"in Dn?Dn.value:Dn.textContent,o=a.length;for(e=0;e<n&&t[e]===a[e];e++);var c=n-e;for(l=1;l<=c&&t[n-l]===a[o-l];l++);return ki=a.slice(e,1<l?1-l:void 0)}function Ui(e){var t=e.keyCode;return"charCode"in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function Yi(){return!0}function Rc(){return!1}function xt(e){function t(n,l,a,o,c){this._reactName=n,this._targetInst=a,this.type=l,this.nativeEvent=o,this.target=c,this.currentTarget=null;for(var d in e)e.hasOwnProperty(d)&&(n=e[d],this[d]=n?n(o):o[d]);return this.isDefaultPrevented=(o.defaultPrevented!=null?o.defaultPrevented:o.returnValue===!1)?Yi:Rc,this.isPropagationStopped=Rc,this}return E(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Yi)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Yi)},persist:function(){},isPersistent:Yi}),t}var sl={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Li=xt(sl),za=E({},sl,{view:0,detail:0}),yg=xt(za),Au,zu,Ra,Bi=E({},za,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Nu,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return"movementX"in e?e.movementX:(e!==Ra&&(Ra&&e.type==="mousemove"?(Au=e.screenX-Ra.screenX,zu=e.screenY-Ra.screenY):zu=Au=0,Ra=e),Au)},movementY:function(e){return"movementY"in e?e.movementY:zu}}),Nc=xt(Bi),pg=E({},Bi,{dataTransfer:0}),hg=xt(pg),bg=E({},za,{relatedTarget:0}),Ru=xt(bg),vg=E({},sl,{animationName:0,elapsedTime:0,pseudoElement:0}),xg=xt(vg),Sg=E({},sl,{clipboardData:function(e){return"clipboardData"in e?e.clipboardData:window.clipboardData}}),Eg=xt(Sg),wg=E({},sl,{data:0}),jc=xt(wg),Tg={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Cg={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Og={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Ag(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Og[e])?!!t[e]:!1}function Nu(){return Ag}var zg=E({},za,{key:function(e){if(e.key){var t=Tg[e.key]||e.key;if(t!=="Unidentified")return t}return e.type==="keypress"?(e=Ui(e),e===13?"Enter":String.fromCharCode(e)):e.type==="keydown"||e.type==="keyup"?Cg[e.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Nu,charCode:function(e){return e.type==="keypress"?Ui(e):0},keyCode:function(e){return e.type==="keydown"||e.type==="keyup"?e.keyCode:0},which:function(e){return e.type==="keypress"?Ui(e):e.type==="keydown"||e.type==="keyup"?e.keyCode:0}}),Rg=xt(zg),Ng=E({},Bi,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Mc=xt(Ng),jg=E({},za,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Nu}),Mg=xt(jg),Dg=E({},sl,{propertyName:0,elapsedTime:0,pseudoElement:0}),kg=xt(Dg),Ug=E({},Bi,{deltaX:function(e){return"deltaX"in e?e.deltaX:"wheelDeltaX"in e?-e.wheelDeltaX:0},deltaY:function(e){return"deltaY"in e?e.deltaY:"wheelDeltaY"in e?-e.wheelDeltaY:"wheelDelta"in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0}),Yg=xt(Ug),Lg=E({},sl,{newState:0,oldState:0}),Bg=xt(Lg),Hg=[9,13,27,32],ju=cn&&"CompositionEvent"in window,Na=null;cn&&"documentMode"in document&&(Na=document.documentMode);var Xg=cn&&"TextEvent"in window&&!Na,Dc=cn&&(!ju||Na&&8<Na&&11>=Na),kc=" ",Uc=!1;function Yc(e,t){switch(e){case"keyup":return Hg.indexOf(t.keyCode)!==-1;case"keydown":return t.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Lc(e){return e=e.detail,typeof e=="object"&&"data"in e?e.data:null}var Yl=!1;function qg(e,t){switch(e){case"compositionend":return Lc(t);case"keypress":return t.which!==32?null:(Uc=!0,kc);case"textInput":return e=t.data,e===kc&&Uc?null:e;default:return null}}function Qg(e,t){if(Yl)return e==="compositionend"||!ju&&Yc(e,t)?(e=zc(),ki=Ou=Dn=null,Yl=!1,e):null;switch(e){case"paste":return null;case"keypress":if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case"compositionend":return Dc&&t.locale!=="ko"?null:t.data;default:return null}}var Gg={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Bc(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t==="input"?!!Gg[e.type]:t==="textarea"}function Hc(e,t,n,l){kl?Ul?Ul.push(l):Ul=[l]:kl=l,t=zo(t,"onChange"),0<t.length&&(n=new Li("onChange","change",null,n,l),e.push({event:n,listeners:t}))}var ja=null,Ma=null;function Vg(e){E_(e,0)}function Hi(e){var t=Ca(e);if(xc(t))return e}function Xc(e,t){if(e==="change")return t}var qc=!1;if(cn){var Mu;if(cn){var Du="oninput"in document;if(!Du){var Qc=document.createElement("div");Qc.setAttribute("oninput","return;"),Du=typeof Qc.oninput=="function"}Mu=Du}else Mu=!1;qc=Mu&&(!document.documentMode||9<document.documentMode)}function Gc(){ja&&(ja.detachEvent("onpropertychange",Vc),Ma=ja=null)}function Vc(e){if(e.propertyName==="value"&&Hi(Ma)){var t=[];Hc(t,Ma,e,wu(e)),Ac(Vg,t)}}function Zg(e,t,n){e==="focusin"?(Gc(),ja=t,Ma=n,ja.attachEvent("onpropertychange",Vc)):e==="focusout"&&Gc()}function Kg(e){if(e==="selectionchange"||e==="keyup"||e==="keydown")return Hi(Ma)}function Jg(e,t){if(e==="click")return Hi(t)}function Ig(e,t){if(e==="input"||e==="change")return Hi(t)}function Fg(e,t){return e===t&&(e!==0||1/e===1/t)||e!==e&&t!==t}var Rt=typeof Object.is=="function"?Object.is:Fg;function Da(e,t){if(Rt(e,t))return!0;if(typeof e!="object"||e===null||typeof t!="object"||t===null)return!1;var n=Object.keys(e),l=Object.keys(t);if(n.length!==l.length)return!1;for(l=0;l<n.length;l++){var a=n[l];if(!Ae.call(t,a)||!Rt(e[a],t[a]))return!1}return!0}function Zc(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Kc(e,t){var n=Zc(e);e=0;for(var l;n;){if(n.nodeType===3){if(l=e+n.textContent.length,e<=t&&l>=t)return{node:n,offset:t-e};e=l}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Zc(n)}}function Jc(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Jc(e,t.parentNode):"contains"in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Ic(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Mi(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href=="string"}catch{n=!1}if(n)e=t.contentWindow;else break;t=Mi(e.document)}return t}function ku(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t==="input"&&(e.type==="text"||e.type==="search"||e.type==="tel"||e.type==="url"||e.type==="password")||t==="textarea"||e.contentEditable==="true")}var Wg=cn&&"documentMode"in document&&11>=document.documentMode,Ll=null,Uu=null,ka=null,Yu=!1;function Fc(e,t,n){var l=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Yu||Ll==null||Ll!==Mi(l)||(l=Ll,"selectionStart"in l&&ku(l)?l={start:l.selectionStart,end:l.selectionEnd}:(l=(l.ownerDocument&&l.ownerDocument.defaultView||window).getSelection(),l={anchorNode:l.anchorNode,anchorOffset:l.anchorOffset,focusNode:l.focusNode,focusOffset:l.focusOffset}),ka&&Da(ka,l)||(ka=l,l=zo(Uu,"onSelect"),0<l.length&&(t=new Li("onSelect","select",null,t,n),e.push({event:t,listeners:l}),t.target=Ll)))}function rl(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n["Webkit"+e]="webkit"+t,n["Moz"+e]="moz"+t,n}var Bl={animationend:rl("Animation","AnimationEnd"),animationiteration:rl("Animation","AnimationIteration"),animationstart:rl("Animation","AnimationStart"),transitionrun:rl("Transition","TransitionRun"),transitionstart:rl("Transition","TransitionStart"),transitioncancel:rl("Transition","TransitionCancel"),transitionend:rl("Transition","TransitionEnd")},Lu={},Wc={};cn&&(Wc=document.createElement("div").style,"AnimationEvent"in window||(delete Bl.animationend.animation,delete Bl.animationiteration.animation,delete Bl.animationstart.animation),"TransitionEvent"in window||delete Bl.transitionend.transition);function cl(e){if(Lu[e])return Lu[e];if(!Bl[e])return e;var t=Bl[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Wc)return Lu[e]=t[n];return e}var $c=cl("animationend"),Pc=cl("animationiteration"),ef=cl("animationstart"),$g=cl("transitionrun"),Pg=cl("transitionstart"),ey=cl("transitioncancel"),tf=cl("transitionend"),nf=new Map,Bu="abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");Bu.push("scrollEnd");function Ft(e,t){nf.set(e,t),ul(t,[e])}var Xi=typeof reportError=="function"?reportError:function(e){if(typeof window=="object"&&typeof window.ErrorEvent=="function"){var t=new window.ErrorEvent("error",{bubbles:!0,cancelable:!0,message:typeof e=="object"&&e!==null&&typeof e.message=="string"?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process=="object"&&typeof process.emit=="function"){process.emit("uncaughtException",e);return}console.error(e)},Ht=[],Hl=0,Hu=0;function qi(){for(var e=Hl,t=Hu=Hl=0;t<e;){var n=Ht[t];Ht[t++]=null;var l=Ht[t];Ht[t++]=null;var a=Ht[t];Ht[t++]=null;var o=Ht[t];if(Ht[t++]=null,l!==null&&a!==null){var c=l.pending;c===null?a.next=a:(a.next=c.next,c.next=a),l.pending=a}o!==0&&lf(n,a,o)}}function Qi(e,t,n,l){Ht[Hl++]=e,Ht[Hl++]=t,Ht[Hl++]=n,Ht[Hl++]=l,Hu|=l,e.lanes|=l,e=e.alternate,e!==null&&(e.lanes|=l)}function Xu(e,t,n,l){return Qi(e,t,n,l),Gi(e)}function fl(e,t){return Qi(e,null,null,t),Gi(e)}function lf(e,t,n){e.lanes|=n;var l=e.alternate;l!==null&&(l.lanes|=n);for(var a=!1,o=e.return;o!==null;)o.childLanes|=n,l=o.alternate,l!==null&&(l.childLanes|=n),o.tag===22&&(e=o.stateNode,e===null||e._visibility&1||(a=!0)),e=o,o=o.return;return e.tag===3?(o=e.stateNode,a&&t!==null&&(a=31-zt(n),e=o.hiddenUpdates,l=e[a],l===null?e[a]=[t]:l.push(t),t.lane=n|536870912),o):null}function Gi(e){if(50<li)throw li=0,Fs=null,Error(r(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var Xl={};function ty(e,t,n,l){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=l,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Nt(e,t,n,l){return new ty(e,t,n,l)}function qu(e){return e=e.prototype,!(!e||!e.isReactComponent)}function fn(e,t){var n=e.alternate;return n===null?(n=Nt(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function af(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function Vi(e,t,n,l,a,o){var c=0;if(l=e,typeof e=="function")qu(e)&&(c=1);else if(typeof e=="string")c=op(e,n,J.current)?26:e==="html"||e==="head"||e==="body"?27:5;else e:switch(e){case H:return e=Nt(31,n,t,a),e.elementType=H,e.lanes=o,e;case B:return dl(n.children,a,o,t);case I:c=8,a|=24;break;case Z:return e=Nt(12,n,t,a|2),e.elementType=Z,e.lanes=o,e;case te:return e=Nt(13,n,t,a),e.elementType=te,e.lanes=o,e;case ne:return e=Nt(19,n,t,a),e.elementType=ne,e.lanes=o,e;default:if(typeof e=="object"&&e!==null)switch(e.$$typeof){case G:c=10;break e;case $:c=9;break e;case Q:c=11;break e;case F:c=14;break e;case oe:c=16,l=null;break e}c=29,n=Error(r(130,e===null?"null":typeof e,"")),l=null}return t=Nt(c,n,t,a),t.elementType=e,t.type=l,t.lanes=o,t}function dl(e,t,n,l){return e=Nt(7,e,l,t),e.lanes=n,e}function Qu(e,t,n){return e=Nt(6,e,null,t),e.lanes=n,e}function of(e){var t=Nt(18,null,null,0);return t.stateNode=e,t}function Gu(e,t,n){return t=Nt(4,e.children!==null?e.children:[],e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var uf=new WeakMap;function Xt(e,t){if(typeof e=="object"&&e!==null){var n=uf.get(e);return n!==void 0?n:(t={value:e,source:t,stack:be(t)},uf.set(e,t),t)}return{value:e,source:t,stack:be(t)}}var ql=[],Ql=0,Zi=null,Ua=0,qt=[],Qt=0,kn=null,tn=1,nn="";function dn(e,t){ql[Ql++]=Ua,ql[Ql++]=Zi,Zi=e,Ua=t}function sf(e,t,n){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=kn,kn=e;var l=tn;e=nn;var a=32-zt(l)-1;l&=~(1<<a),n+=1;var o=32-zt(t)+a;if(30<o){var c=a-a%5;o=(l&(1<<c)-1).toString(32),l>>=c,a-=c,tn=1<<32-zt(t)+a|n<<a|l,nn=o+e}else tn=1<<o|n<<a|l,nn=e}function Vu(e){e.return!==null&&(dn(e,1),sf(e,1,0))}function Zu(e){for(;e===Zi;)Zi=ql[--Ql],ql[Ql]=null,Ua=ql[--Ql],ql[Ql]=null;for(;e===kn;)kn=qt[--Qt],qt[Qt]=null,nn=qt[--Qt],qt[Qt]=null,tn=qt[--Qt],qt[Qt]=null}function rf(e,t){qt[Qt++]=tn,qt[Qt++]=nn,qt[Qt++]=kn,tn=t.id,nn=t.overflow,kn=e}var ft=null,Ve=null,Oe=!1,Un=null,Gt=!1,Ku=Error(r(519));function Yn(e){var t=Error(r(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?"text":"HTML",""));throw Ya(Xt(t,e)),Ku}function cf(e){var t=e.stateNode,n=e.type,l=e.memoizedProps;switch(t[ct]=e,t[vt]=l,n){case"dialog":Se("cancel",t),Se("close",t);break;case"iframe":case"object":case"embed":Se("load",t);break;case"video":case"audio":for(n=0;n<ii.length;n++)Se(ii[n],t);break;case"source":Se("error",t);break;case"img":case"image":case"link":Se("error",t),Se("load",t);break;case"details":Se("toggle",t);break;case"input":Se("invalid",t),Sc(t,l.value,l.defaultValue,l.checked,l.defaultChecked,l.type,l.name,!0);break;case"select":Se("invalid",t);break;case"textarea":Se("invalid",t),wc(t,l.value,l.defaultValue,l.children)}n=l.children,typeof n!="string"&&typeof n!="number"&&typeof n!="bigint"||t.textContent===""+n||l.suppressHydrationWarning===!0||O_(t.textContent,n)?(l.popover!=null&&(Se("beforetoggle",t),Se("toggle",t)),l.onScroll!=null&&Se("scroll",t),l.onScrollEnd!=null&&Se("scrollend",t),l.onClick!=null&&(t.onclick=rn),t=!0):t=!1,t||Yn(e,!0)}function ff(e){for(ft=e.return;ft;)switch(ft.tag){case 5:case 31:case 13:Gt=!1;return;case 27:case 3:Gt=!0;return;default:ft=ft.return}}function Gl(e){if(e!==ft)return!1;if(!Oe)return ff(e),Oe=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!=="form"&&n!=="button")||fr(e.type,e.memoizedProps)),n=!n),n&&Ve&&Yn(e),ff(e),t===13){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=U_(e)}else if(t===31){if(e=e.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(317));Ve=U_(e)}else t===27?(t=Ve,Wn(e.type)?(e=yr,yr=null,Ve=e):Ve=t):Ve=ft?Zt(e.stateNode.nextSibling):null;return!0}function _l(){Ve=ft=null,Oe=!1}function Ju(){var e=Un;return e!==null&&(Tt===null?Tt=e:Tt.push.apply(Tt,e),Un=null),e}function Ya(e){Un===null?Un=[e]:Un.push(e)}var Iu=b(null),ml=null,_n=null;function Ln(e,t,n){X(Iu,t._currentValue),t._currentValue=n}function mn(e){e._currentValue=Iu.current,U(Iu)}function Fu(e,t,n){for(;e!==null;){var l=e.alternate;if((e.childLanes&t)!==t?(e.childLanes|=t,l!==null&&(l.childLanes|=t)):l!==null&&(l.childLanes&t)!==t&&(l.childLanes|=t),e===n)break;e=e.return}}function Wu(e,t,n,l){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var c=a.child;o=o.firstContext;e:for(;o!==null;){var d=o;o=a;for(var p=0;p<t.length;p++)if(d.context===t[p]){o.lanes|=n,d=o.alternate,d!==null&&(d.lanes|=n),Fu(o.return,n,e),l||(c=null);break e}o=d.next}}else if(a.tag===18){if(c=a.return,c===null)throw Error(r(341));c.lanes|=n,o=c.alternate,o!==null&&(o.lanes|=n),Fu(c,n,e),c=null}else c=a.child;if(c!==null)c.return=a;else for(c=a;c!==null;){if(c===e){c=null;break}if(a=c.sibling,a!==null){a.return=c.return,c=a;break}c=c.return}a=c}}function Vl(e,t,n,l){e=null;for(var a=t,o=!1;a!==null;){if(!o){if((a.flags&524288)!==0)o=!0;else if((a.flags&262144)!==0)break}if(a.tag===10){var c=a.alternate;if(c===null)throw Error(r(387));if(c=c.memoizedProps,c!==null){var d=a.type;Rt(a.pendingProps.value,c.value)||(e!==null?e.push(d):e=[d])}}else if(a===Ee.current){if(c=a.alternate,c===null)throw Error(r(387));c.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e!==null?e.push(ci):e=[ci])}a=a.return}e!==null&&Wu(t,e,n,l),t.flags|=262144}function Ki(e){for(e=e.firstContext;e!==null;){if(!Rt(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function gl(e){ml=e,_n=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function dt(e){return df(ml,e)}function Ji(e,t){return ml===null&&gl(e),df(e,t)}function df(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},_n===null){if(e===null)throw Error(r(308));_n=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else _n=_n.next=t;return n}var ny=typeof AbortController<"u"?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(n,l){e.push(l)}};this.abort=function(){t.aborted=!0,e.forEach(function(n){return n()})}},ly=i.unstable_scheduleCallback,ay=i.unstable_NormalPriority,et={$$typeof:G,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function $u(){return{controller:new ny,data:new Map,refCount:0}}function La(e){e.refCount--,e.refCount===0&&ly(ay,function(){e.controller.abort()})}var Ba=null,Pu=0,Zl=0,Kl=null;function iy(e,t){if(Ba===null){var n=Ba=[];Pu=0,Zl=nr(),Kl={status:"pending",value:void 0,then:function(l){n.push(l)}}}return Pu++,t.then(_f,_f),t}function _f(){if(--Pu===0&&Ba!==null){Kl!==null&&(Kl.status="fulfilled");var e=Ba;Ba=null,Zl=0,Kl=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function oy(e,t){var n=[],l={status:"pending",value:null,reason:null,then:function(a){n.push(a)}};return e.then(function(){l.status="fulfilled",l.value=t;for(var a=0;a<n.length;a++)(0,n[a])(t)},function(a){for(l.status="rejected",l.reason=a,a=0;a<n.length;a++)(0,n[a])(void 0)}),l}var mf=N.S;N.S=function(e,t){Wd=Ye(),typeof t=="object"&&t!==null&&typeof t.then=="function"&&iy(e,t),mf!==null&&mf(e,t)};var yl=b(null);function es(){var e=yl.current;return e!==null?e:qe.pooledCache}function Ii(e,t){t===null?X(yl,yl.current):X(yl,t.pool)}function gf(){var e=es();return e===null?null:{parent:et._currentValue,pool:e}}var Jl=Error(r(460)),ts=Error(r(474)),Fi=Error(r(542)),Wi={then:function(){}};function yf(e){return e=e.status,e==="fulfilled"||e==="rejected"}function pf(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(rn,rn),t=n),t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,bf(e),e;default:if(typeof t.status=="string")t.then(rn,rn);else{if(e=qe,e!==null&&100<e.shellSuspendCounter)throw Error(r(482));e=t,e.status="pending",e.then(function(l){if(t.status==="pending"){var a=t;a.status="fulfilled",a.value=l}},function(l){if(t.status==="pending"){var a=t;a.status="rejected",a.reason=l}})}switch(t.status){case"fulfilled":return t.value;case"rejected":throw e=t.reason,bf(e),e}throw hl=t,Jl}}function pl(e){try{var t=e._init;return t(e._payload)}catch(n){throw n!==null&&typeof n=="object"&&typeof n.then=="function"?(hl=n,Jl):n}}var hl=null;function hf(){if(hl===null)throw Error(r(459));var e=hl;return hl=null,e}function bf(e){if(e===Jl||e===Fi)throw Error(r(483))}var Il=null,Ha=0;function $i(e){var t=Ha;return Ha+=1,Il===null&&(Il=[]),pf(Il,e,t)}function Xa(e,t){t=t.props.ref,e.ref=t!==void 0?t:null}function Pi(e,t){throw t.$$typeof===z?Error(r(525)):(e=Object.prototype.toString.call(t),Error(r(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)))}function vf(e){function t(S,v){if(e){var T=S.deletions;T===null?(S.deletions=[v],S.flags|=16):T.push(v)}}function n(S,v){if(!e)return null;for(;v!==null;)t(S,v),v=v.sibling;return null}function l(S){for(var v=new Map;S!==null;)S.key!==null?v.set(S.key,S):v.set(S.index,S),S=S.sibling;return v}function a(S,v){return S=fn(S,v),S.index=0,S.sibling=null,S}function o(S,v,T){return S.index=T,e?(T=S.alternate,T!==null?(T=T.index,T<v?(S.flags|=67108866,v):T):(S.flags|=67108866,v)):(S.flags|=1048576,v)}function c(S){return e&&S.alternate===null&&(S.flags|=67108866),S}function d(S,v,T,k){return v===null||v.tag!==6?(v=Qu(T,S.mode,k),v.return=S,v):(v=a(v,T),v.return=S,v)}function p(S,v,T,k){var ie=T.type;return ie===B?M(S,v,T.props.children,k,T.key):v!==null&&(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===oe&&pl(ie)===v.type)?(v=a(v,T.props),Xa(v,T),v.return=S,v):(v=Vi(T.type,T.key,T.props,null,S.mode,k),Xa(v,T),v.return=S,v)}function C(S,v,T,k){return v===null||v.tag!==4||v.stateNode.containerInfo!==T.containerInfo||v.stateNode.implementation!==T.implementation?(v=Gu(T,S.mode,k),v.return=S,v):(v=a(v,T.children||[]),v.return=S,v)}function M(S,v,T,k,ie){return v===null||v.tag!==7?(v=dl(T,S.mode,k,ie),v.return=S,v):(v=a(v,T),v.return=S,v)}function Y(S,v,T){if(typeof v=="string"&&v!==""||typeof v=="number"||typeof v=="bigint")return v=Qu(""+v,S.mode,T),v.return=S,v;if(typeof v=="object"&&v!==null){switch(v.$$typeof){case j:return T=Vi(v.type,v.key,v.props,null,S.mode,T),Xa(T,v),T.return=S,T;case L:return v=Gu(v,S.mode,T),v.return=S,v;case oe:return v=pl(v),Y(S,v,T)}if(ce(v)||Ce(v))return v=dl(v,S.mode,T,null),v.return=S,v;if(typeof v.then=="function")return Y(S,$i(v),T);if(v.$$typeof===G)return Y(S,Ji(S,v),T);Pi(S,v)}return null}function O(S,v,T,k){var ie=v!==null?v.key:null;if(typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint")return ie!==null?null:d(S,v,""+T,k);if(typeof T=="object"&&T!==null){switch(T.$$typeof){case j:return T.key===ie?p(S,v,T,k):null;case L:return T.key===ie?C(S,v,T,k):null;case oe:return T=pl(T),O(S,v,T,k)}if(ce(T)||Ce(T))return ie!==null?null:M(S,v,T,k,null);if(typeof T.then=="function")return O(S,v,$i(T),k);if(T.$$typeof===G)return O(S,v,Ji(S,T),k);Pi(S,T)}return null}function R(S,v,T,k,ie){if(typeof k=="string"&&k!==""||typeof k=="number"||typeof k=="bigint")return S=S.get(T)||null,d(v,S,""+k,ie);if(typeof k=="object"&&k!==null){switch(k.$$typeof){case j:return S=S.get(k.key===null?T:k.key)||null,p(v,S,k,ie);case L:return S=S.get(k.key===null?T:k.key)||null,C(v,S,k,ie);case oe:return k=pl(k),R(S,v,T,k,ie)}if(ce(k)||Ce(k))return S=S.get(T)||null,M(v,S,k,ie,null);if(typeof k.then=="function")return R(S,v,T,$i(k),ie);if(k.$$typeof===G)return R(S,v,T,Ji(v,k),ie);Pi(v,k)}return null}function W(S,v,T,k){for(var ie=null,ze=null,P=v,he=v=0,Te=null;P!==null&&he<T.length;he++){P.index>he?(Te=P,P=null):Te=P.sibling;var Re=O(S,P,T[he],k);if(Re===null){P===null&&(P=Te);break}e&&P&&Re.alternate===null&&t(S,P),v=o(Re,v,he),ze===null?ie=Re:ze.sibling=Re,ze=Re,P=Te}if(he===T.length)return n(S,P),Oe&&dn(S,he),ie;if(P===null){for(;he<T.length;he++)P=Y(S,T[he],k),P!==null&&(v=o(P,v,he),ze===null?ie=P:ze.sibling=P,ze=P);return Oe&&dn(S,he),ie}for(P=l(P);he<T.length;he++)Te=R(P,S,he,T[he],k),Te!==null&&(e&&Te.alternate!==null&&P.delete(Te.key===null?he:Te.key),v=o(Te,v,he),ze===null?ie=Te:ze.sibling=Te,ze=Te);return e&&P.forEach(function(nl){return t(S,nl)}),Oe&&dn(S,he),ie}function ue(S,v,T,k){if(T==null)throw Error(r(151));for(var ie=null,ze=null,P=v,he=v=0,Te=null,Re=T.next();P!==null&&!Re.done;he++,Re=T.next()){P.index>he?(Te=P,P=null):Te=P.sibling;var nl=O(S,P,Re.value,k);if(nl===null){P===null&&(P=Te);break}e&&P&&nl.alternate===null&&t(S,P),v=o(nl,v,he),ze===null?ie=nl:ze.sibling=nl,ze=nl,P=Te}if(Re.done)return n(S,P),Oe&&dn(S,he),ie;if(P===null){for(;!Re.done;he++,Re=T.next())Re=Y(S,Re.value,k),Re!==null&&(v=o(Re,v,he),ze===null?ie=Re:ze.sibling=Re,ze=Re);return Oe&&dn(S,he),ie}for(P=l(P);!Re.done;he++,Re=T.next())Re=R(P,S,he,Re.value,k),Re!==null&&(e&&Re.alternate!==null&&P.delete(Re.key===null?he:Re.key),v=o(Re,v,he),ze===null?ie=Re:ze.sibling=Re,ze=Re);return e&&P.forEach(function(pp){return t(S,pp)}),Oe&&dn(S,he),ie}function He(S,v,T,k){if(typeof T=="object"&&T!==null&&T.type===B&&T.key===null&&(T=T.props.children),typeof T=="object"&&T!==null){switch(T.$$typeof){case j:e:{for(var ie=T.key;v!==null;){if(v.key===ie){if(ie=T.type,ie===B){if(v.tag===7){n(S,v.sibling),k=a(v,T.props.children),k.return=S,S=k;break e}}else if(v.elementType===ie||typeof ie=="object"&&ie!==null&&ie.$$typeof===oe&&pl(ie)===v.type){n(S,v.sibling),k=a(v,T.props),Xa(k,T),k.return=S,S=k;break e}n(S,v);break}else t(S,v);v=v.sibling}T.type===B?(k=dl(T.props.children,S.mode,k,T.key),k.return=S,S=k):(k=Vi(T.type,T.key,T.props,null,S.mode,k),Xa(k,T),k.return=S,S=k)}return c(S);case L:e:{for(ie=T.key;v!==null;){if(v.key===ie)if(v.tag===4&&v.stateNode.containerInfo===T.containerInfo&&v.stateNode.implementation===T.implementation){n(S,v.sibling),k=a(v,T.children||[]),k.return=S,S=k;break e}else{n(S,v);break}else t(S,v);v=v.sibling}k=Gu(T,S.mode,k),k.return=S,S=k}return c(S);case oe:return T=pl(T),He(S,v,T,k)}if(ce(T))return W(S,v,T,k);if(Ce(T)){if(ie=Ce(T),typeof ie!="function")throw Error(r(150));return T=ie.call(T),ue(S,v,T,k)}if(typeof T.then=="function")return He(S,v,$i(T),k);if(T.$$typeof===G)return He(S,v,Ji(S,T),k);Pi(S,T)}return typeof T=="string"&&T!==""||typeof T=="number"||typeof T=="bigint"?(T=""+T,v!==null&&v.tag===6?(n(S,v.sibling),k=a(v,T),k.return=S,S=k):(n(S,v),k=Qu(T,S.mode,k),k.return=S,S=k),c(S)):n(S,v)}return function(S,v,T,k){try{Ha=0;var ie=He(S,v,T,k);return Il=null,ie}catch(P){if(P===Jl||P===Fi)throw P;var ze=Nt(29,P,null,S.mode);return ze.lanes=k,ze.return=S,ze}}}var bl=vf(!0),xf=vf(!1),Bn=!1;function ns(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function ls(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function Hn(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Xn(e,t,n){var l=e.updateQueue;if(l===null)return null;if(l=l.shared,(Ne&2)!==0){var a=l.pending;return a===null?t.next=t:(t.next=a.next,a.next=t),l.pending=t,t=Gi(e),lf(e,null,n),t}return Qi(e,l,t,n),Gi(e)}function qa(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,(n&4194048)!==0)){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,fc(e,n)}}function as(e,t){var n=e.updateQueue,l=e.alternate;if(l!==null&&(l=l.updateQueue,n===l)){var a=null,o=null;if(n=n.firstBaseUpdate,n!==null){do{var c={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};o===null?a=o=c:o=o.next=c,n=n.next}while(n!==null);o===null?a=o=t:o=o.next=t}else a=o=t;n={baseState:l.baseState,firstBaseUpdate:a,lastBaseUpdate:o,shared:l.shared,callbacks:l.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var is=!1;function Qa(){if(is){var e=Kl;if(e!==null)throw e}}function Ga(e,t,n,l){is=!1;var a=e.updateQueue;Bn=!1;var o=a.firstBaseUpdate,c=a.lastBaseUpdate,d=a.shared.pending;if(d!==null){a.shared.pending=null;var p=d,C=p.next;p.next=null,c===null?o=C:c.next=C,c=p;var M=e.alternate;M!==null&&(M=M.updateQueue,d=M.lastBaseUpdate,d!==c&&(d===null?M.firstBaseUpdate=C:d.next=C,M.lastBaseUpdate=p))}if(o!==null){var Y=a.baseState;c=0,M=C=p=null,d=o;do{var O=d.lane&-536870913,R=O!==d.lane;if(R?(we&O)===O:(l&O)===O){O!==0&&O===Zl&&(is=!0),M!==null&&(M=M.next={lane:0,tag:d.tag,payload:d.payload,callback:null,next:null});e:{var W=e,ue=d;O=t;var He=n;switch(ue.tag){case 1:if(W=ue.payload,typeof W=="function"){Y=W.call(He,Y,O);break e}Y=W;break e;case 3:W.flags=W.flags&-65537|128;case 0:if(W=ue.payload,O=typeof W=="function"?W.call(He,Y,O):W,O==null)break e;Y=E({},Y,O);break e;case 2:Bn=!0}}O=d.callback,O!==null&&(e.flags|=64,R&&(e.flags|=8192),R=a.callbacks,R===null?a.callbacks=[O]:R.push(O))}else R={lane:O,tag:d.tag,payload:d.payload,callback:d.callback,next:null},M===null?(C=M=R,p=Y):M=M.next=R,c|=O;if(d=d.next,d===null){if(d=a.shared.pending,d===null)break;R=d,d=R.next,R.next=null,a.lastBaseUpdate=R,a.shared.pending=null}}while(!0);M===null&&(p=Y),a.baseState=p,a.firstBaseUpdate=C,a.lastBaseUpdate=M,o===null&&(a.shared.lanes=0),Zn|=c,e.lanes=c,e.memoizedState=Y}}function Sf(e,t){if(typeof e!="function")throw Error(r(191,e));e.call(t)}function Ef(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)Sf(n[e],t)}var Fl=b(null),eo=b(0);function wf(e,t){e=En,X(eo,e),X(Fl,t),En=e|t.baseLanes}function os(){X(eo,En),X(Fl,Fl.current)}function us(){En=eo.current,U(Fl),U(eo)}var jt=b(null),Vt=null;function qn(e){var t=e.alternate;X($e,$e.current&1),X(jt,e),Vt===null&&(t===null||Fl.current!==null||t.memoizedState!==null)&&(Vt=e)}function ss(e){X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)}function Tf(e){e.tag===22?(X($e,$e.current),X(jt,e),Vt===null&&(Vt=e)):Qn()}function Qn(){X($e,$e.current),X(jt,jt.current)}function Mt(e){U(jt),Vt===e&&(Vt=null),U($e)}var $e=b(0);function to(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||mr(n)||gr(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder==="forwards"||t.memoizedProps.revealOrder==="backwards"||t.memoizedProps.revealOrder==="unstable_legacy-backwards"||t.memoizedProps.revealOrder==="together")){if((t.flags&128)!==0)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var gn=0,ye=null,Le=null,tt=null,no=!1,Wl=!1,vl=!1,lo=0,Va=0,$l=null,uy=0;function Ie(){throw Error(r(321))}function rs(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!Rt(e[n],t[n]))return!1;return!0}function cs(e,t,n,l,a,o){return gn=o,ye=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,N.H=e===null||e.memoizedState===null?sd:Ts,vl=!1,o=n(l,a),vl=!1,Wl&&(o=Of(t,n,l,a)),Cf(e),o}function Cf(e){N.H=Ja;var t=Le!==null&&Le.next!==null;if(gn=0,tt=Le=ye=null,no=!1,Va=0,$l=null,t)throw Error(r(300));e===null||nt||(e=e.dependencies,e!==null&&Ki(e)&&(nt=!0))}function Of(e,t,n,l){ye=e;var a=0;do{if(Wl&&($l=null),Va=0,Wl=!1,25<=a)throw Error(r(301));if(a+=1,tt=Le=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}N.H=rd,o=t(n,l)}while(Wl);return o}function sy(){var e=N.H,t=e.useState()[0];return t=typeof t.then=="function"?Za(t):t,e=e.useState()[0],(Le!==null?Le.memoizedState:null)!==e&&(ye.flags|=1024),t}function fs(){var e=lo!==0;return lo=0,e}function ds(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function _s(e){if(no){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}no=!1}gn=0,tt=Le=ye=null,Wl=!1,Va=lo=0,$l=null}function ht(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return tt===null?ye.memoizedState=tt=e:tt=tt.next=e,tt}function Pe(){if(Le===null){var e=ye.alternate;e=e!==null?e.memoizedState:null}else e=Le.next;var t=tt===null?ye.memoizedState:tt.next;if(t!==null)tt=t,Le=e;else{if(e===null)throw ye.alternate===null?Error(r(467)):Error(r(310));Le=e,e={memoizedState:Le.memoizedState,baseState:Le.baseState,baseQueue:Le.baseQueue,queue:Le.queue,next:null},tt===null?ye.memoizedState=tt=e:tt=tt.next=e}return tt}function ao(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Za(e){var t=Va;return Va+=1,$l===null&&($l=[]),e=pf($l,e,t),t=ye,(tt===null?t.memoizedState:tt.next)===null&&(t=t.alternate,N.H=t===null||t.memoizedState===null?sd:Ts),e}function io(e){if(e!==null&&typeof e=="object"){if(typeof e.then=="function")return Za(e);if(e.$$typeof===G)return dt(e)}throw Error(r(438,String(e)))}function ms(e){var t=null,n=ye.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var l=ye.alternate;l!==null&&(l=l.updateQueue,l!==null&&(l=l.memoCache,l!=null&&(t={data:l.data.map(function(a){return a.slice()}),index:0})))}if(t==null&&(t={data:[],index:0}),n===null&&(n=ao(),ye.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),l=0;l<e;l++)n[l]=le;return t.index++,n}function yn(e,t){return typeof t=="function"?t(e):t}function oo(e){var t=Pe();return gs(t,Le,e)}function gs(e,t,n){var l=e.queue;if(l===null)throw Error(r(311));l.lastRenderedReducer=n;var a=e.baseQueue,o=l.pending;if(o!==null){if(a!==null){var c=a.next;a.next=o.next,o.next=c}t.baseQueue=a=o,l.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var d=c=null,p=null,C=t,M=!1;do{var Y=C.lane&-536870913;if(Y!==C.lane?(we&Y)===Y:(gn&Y)===Y){var O=C.revertLane;if(O===0)p!==null&&(p=p.next={lane:0,revertLane:0,gesture:null,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null}),Y===Zl&&(M=!0);else if((gn&O)===O){C=C.next,O===Zl&&(M=!0);continue}else Y={lane:0,revertLane:C.revertLane,gesture:null,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},p===null?(d=p=Y,c=o):p=p.next=Y,ye.lanes|=O,Zn|=O;Y=C.action,vl&&n(o,Y),o=C.hasEagerState?C.eagerState:n(o,Y)}else O={lane:Y,revertLane:C.revertLane,gesture:C.gesture,action:C.action,hasEagerState:C.hasEagerState,eagerState:C.eagerState,next:null},p===null?(d=p=O,c=o):p=p.next=O,ye.lanes|=Y,Zn|=Y;C=C.next}while(C!==null&&C!==t);if(p===null?c=o:p.next=d,!Rt(o,e.memoizedState)&&(nt=!0,M&&(n=Kl,n!==null)))throw n;e.memoizedState=o,e.baseState=c,e.baseQueue=p,l.lastRenderedState=o}return a===null&&(l.lanes=0),[e.memoizedState,l.dispatch]}function ys(e){var t=Pe(),n=t.queue;if(n===null)throw Error(r(311));n.lastRenderedReducer=e;var l=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var c=a=a.next;do o=e(o,c.action),c=c.next;while(c!==a);Rt(o,t.memoizedState)||(nt=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,l]}function Af(e,t,n){var l=ye,a=Pe(),o=Oe;if(o){if(n===void 0)throw Error(r(407));n=n()}else n=t();var c=!Rt((Le||a).memoizedState,n);if(c&&(a.memoizedState=n,nt=!0),a=a.queue,bs(Nf.bind(null,l,a,e),[e]),a.getSnapshot!==t||c||tt!==null&&tt.memoizedState.tag&1){if(l.flags|=2048,Pl(9,{destroy:void 0},Rf.bind(null,l,a,n,t),null),qe===null)throw Error(r(349));o||(gn&127)!==0||zf(l,t,n)}return n}function zf(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=ye.updateQueue,t===null?(t=ao(),ye.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function Rf(e,t,n,l){t.value=n,t.getSnapshot=l,jf(t)&&Mf(e)}function Nf(e,t,n){return n(function(){jf(t)&&Mf(e)})}function jf(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!Rt(e,n)}catch{return!0}}function Mf(e){var t=fl(e,2);t!==null&&Ct(t,e,2)}function ps(e){var t=ht();if(typeof e=="function"){var n=e;if(e=n(),vl){jn(!0);try{n()}finally{jn(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:e},t}function Df(e,t,n,l){return e.baseState=n,gs(e,Le,typeof l=="function"?l:yn)}function ry(e,t,n,l,a){if(ro(e))throw Error(r(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:"pending",value:null,reason:null,listeners:[],then:function(c){o.listeners.push(c)}};N.T!==null?n(!0):o.isTransition=!1,l(o),n=t.pending,n===null?(o.next=t.pending=o,kf(t,o)):(o.next=n.next,t.pending=n.next=o)}}function kf(e,t){var n=t.action,l=t.payload,a=e.state;if(t.isTransition){var o=N.T,c={};N.T=c;try{var d=n(a,l),p=N.S;p!==null&&p(c,d),Uf(e,t,d)}catch(C){hs(e,t,C)}finally{o!==null&&c.types!==null&&(o.types=c.types),N.T=o}}else try{o=n(a,l),Uf(e,t,o)}catch(C){hs(e,t,C)}}function Uf(e,t,n){n!==null&&typeof n=="object"&&typeof n.then=="function"?n.then(function(l){Yf(e,t,l)},function(l){return hs(e,t,l)}):Yf(e,t,n)}function Yf(e,t,n){t.status="fulfilled",t.value=n,Lf(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,kf(e,n)))}function hs(e,t,n){var l=e.pending;if(e.pending=null,l!==null){l=l.next;do t.status="rejected",t.reason=n,Lf(t),t=t.next;while(t!==l)}e.action=null}function Lf(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function Bf(e,t){return t}function Hf(e,t){if(Oe){var n=qe.formState;if(n!==null){e:{var l=ye;if(Oe){if(Ve){t:{for(var a=Ve,o=Gt;a.nodeType!==8;){if(!o){a=null;break t}if(a=Zt(a.nextSibling),a===null){a=null;break t}}o=a.data,a=o==="F!"||o==="F"?a:null}if(a){Ve=Zt(a.nextSibling),l=a.data==="F!";break e}}Yn(l)}l=!1}l&&(t=n[0])}}return n=ht(),n.memoizedState=n.baseState=t,l={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Bf,lastRenderedState:t},n.queue=l,n=id.bind(null,ye,l),l.dispatch=n,l=ps(!1),o=ws.bind(null,ye,!1,l.queue),l=ht(),a={state:t,dispatch:null,action:e,pending:null},l.queue=a,n=ry.bind(null,ye,a,o,n),a.dispatch=n,l.memoizedState=e,[t,n,!1]}function Xf(e){var t=Pe();return qf(t,Le,e)}function qf(e,t,n){if(t=gs(e,t,Bf)[0],e=oo(yn)[0],typeof t=="object"&&t!==null&&typeof t.then=="function")try{var l=Za(t)}catch(c){throw c===Jl?Fi:c}else l=t;t=Pe();var a=t.queue,o=a.dispatch;return n!==t.memoizedState&&(ye.flags|=2048,Pl(9,{destroy:void 0},cy.bind(null,a,n),null)),[l,o,e]}function cy(e,t){e.action=t}function Qf(e){var t=Pe(),n=Le;if(n!==null)return qf(t,n,e);Pe(),t=t.memoizedState,n=Pe();var l=n.queue.dispatch;return n.memoizedState=e,[t,l,!1]}function Pl(e,t,n,l){return e={tag:e,create:n,deps:l,inst:t,next:null},t=ye.updateQueue,t===null&&(t=ao(),ye.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(l=n.next,n.next=e,e.next=l,t.lastEffect=e),e}function Gf(){return Pe().memoizedState}function uo(e,t,n,l){var a=ht();ye.flags|=e,a.memoizedState=Pl(1|t,{destroy:void 0},n,l===void 0?null:l)}function so(e,t,n,l){var a=Pe();l=l===void 0?null:l;var o=a.memoizedState.inst;Le!==null&&l!==null&&rs(l,Le.memoizedState.deps)?a.memoizedState=Pl(t,o,n,l):(ye.flags|=e,a.memoizedState=Pl(1|t,o,n,l))}function Vf(e,t){uo(8390656,8,e,t)}function bs(e,t){so(2048,8,e,t)}function fy(e){ye.flags|=4;var t=ye.updateQueue;if(t===null)t=ao(),ye.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function Zf(e){var t=Pe().memoizedState;return fy({ref:t,nextImpl:e}),function(){if((Ne&2)!==0)throw Error(r(440));return t.impl.apply(void 0,arguments)}}function Kf(e,t){return so(4,2,e,t)}function Jf(e,t){return so(4,4,e,t)}function If(e,t){if(typeof t=="function"){e=e();var n=t(e);return function(){typeof n=="function"?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ff(e,t,n){n=n!=null?n.concat([e]):null,so(4,4,If.bind(null,t,e),n)}function vs(){}function Wf(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;return t!==null&&rs(t,l[1])?l[0]:(n.memoizedState=[e,t],e)}function $f(e,t){var n=Pe();t=t===void 0?null:t;var l=n.memoizedState;if(t!==null&&rs(t,l[1]))return l[0];if(l=e(),vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l}function xs(e,t,n){return n===void 0||(gn&1073741824)!==0&&(we&261930)===0?e.memoizedState=t:(e.memoizedState=n,e=Pd(),ye.lanes|=e,Zn|=e,n)}function Pf(e,t,n,l){return Rt(n,t)?n:Fl.current!==null?(e=xs(e,n,l),Rt(e,t)||(nt=!0),e):(gn&42)===0||(gn&1073741824)!==0&&(we&261930)===0?(nt=!0,e.memoizedState=n):(e=Pd(),ye.lanes|=e,Zn|=e,t)}function ed(e,t,n,l,a){var o=q.p;q.p=o!==0&&8>o?o:8;var c=N.T,d={};N.T=d,ws(e,!1,t,n);try{var p=a(),C=N.S;if(C!==null&&C(d,p),p!==null&&typeof p=="object"&&typeof p.then=="function"){var M=oy(p,l);Ka(e,t,M,Ut(e))}else Ka(e,t,l,Ut(e))}catch(Y){Ka(e,t,{then:function(){},status:"rejected",reason:Y},Ut())}finally{q.p=o,c!==null&&d.types!==null&&(c.types=d.types),N.T=c}}function dy(){}function Ss(e,t,n,l){if(e.tag!==5)throw Error(r(476));var a=td(e).queue;ed(e,a,t,K,n===null?dy:function(){return nd(e),n(l)})}function td(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:K,baseState:K,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:K},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:yn,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function nd(e){var t=td(e);t.next===null&&(t=e.alternate.memoizedState),Ka(e,t.next.queue,{},Ut())}function Es(){return dt(ci)}function ld(){return Pe().memoizedState}function ad(){return Pe().memoizedState}function _y(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=Ut();e=Hn(n);var l=Xn(t,e,n);l!==null&&(Ct(l,t,n),qa(l,t,n)),t={cache:$u()},e.payload=t;return}t=t.return}}function my(e,t,n){var l=Ut();n={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},ro(e)?od(t,n):(n=Xu(e,t,n,l),n!==null&&(Ct(n,e,l),ud(n,t,l)))}function id(e,t,n){var l=Ut();Ka(e,t,n,l)}function Ka(e,t,n,l){var a={lane:l,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(ro(e))od(t,a);else{var o=e.alternate;if(e.lanes===0&&(o===null||o.lanes===0)&&(o=t.lastRenderedReducer,o!==null))try{var c=t.lastRenderedState,d=o(c,n);if(a.hasEagerState=!0,a.eagerState=d,Rt(d,c))return Qi(e,t,a,0),qe===null&&qi(),!1}catch{}if(n=Xu(e,t,a,l),n!==null)return Ct(n,e,l),ud(n,t,l),!0}return!1}function ws(e,t,n,l){if(l={lane:2,revertLane:nr(),gesture:null,action:l,hasEagerState:!1,eagerState:null,next:null},ro(e)){if(t)throw Error(r(479))}else t=Xu(e,n,l,2),t!==null&&Ct(t,e,2)}function ro(e){var t=e.alternate;return e===ye||t!==null&&t===ye}function od(e,t){Wl=no=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function ud(e,t,n){if((n&4194048)!==0){var l=t.lanes;l&=e.pendingLanes,n|=l,t.lanes=n,fc(e,n)}}var Ja={readContext:dt,use:io,useCallback:Ie,useContext:Ie,useEffect:Ie,useImperativeHandle:Ie,useLayoutEffect:Ie,useInsertionEffect:Ie,useMemo:Ie,useReducer:Ie,useRef:Ie,useState:Ie,useDebugValue:Ie,useDeferredValue:Ie,useTransition:Ie,useSyncExternalStore:Ie,useId:Ie,useHostTransitionStatus:Ie,useFormState:Ie,useActionState:Ie,useOptimistic:Ie,useMemoCache:Ie,useCacheRefresh:Ie};Ja.useEffectEvent=Ie;var sd={readContext:dt,use:io,useCallback:function(e,t){return ht().memoizedState=[e,t===void 0?null:t],e},useContext:dt,useEffect:Vf,useImperativeHandle:function(e,t,n){n=n!=null?n.concat([e]):null,uo(4194308,4,If.bind(null,t,e),n)},useLayoutEffect:function(e,t){return uo(4194308,4,e,t)},useInsertionEffect:function(e,t){uo(4,2,e,t)},useMemo:function(e,t){var n=ht();t=t===void 0?null:t;var l=e();if(vl){jn(!0);try{e()}finally{jn(!1)}}return n.memoizedState=[l,t],l},useReducer:function(e,t,n){var l=ht();if(n!==void 0){var a=n(t);if(vl){jn(!0);try{n(t)}finally{jn(!1)}}}else a=t;return l.memoizedState=l.baseState=a,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:a},l.queue=e,e=e.dispatch=my.bind(null,ye,e),[l.memoizedState,e]},useRef:function(e){var t=ht();return e={current:e},t.memoizedState=e},useState:function(e){e=ps(e);var t=e.queue,n=id.bind(null,ye,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:vs,useDeferredValue:function(e,t){var n=ht();return xs(n,e,t)},useTransition:function(){var e=ps(!1);return e=ed.bind(null,ye,e.queue,!0,!1),ht().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var l=ye,a=ht();if(Oe){if(n===void 0)throw Error(r(407));n=n()}else{if(n=t(),qe===null)throw Error(r(349));(we&127)!==0||zf(l,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,Vf(Nf.bind(null,l,o,e),[e]),l.flags|=2048,Pl(9,{destroy:void 0},Rf.bind(null,l,o,n,t),null),n},useId:function(){var e=ht(),t=qe.identifierPrefix;if(Oe){var n=nn,l=tn;n=(l&~(1<<32-zt(l)-1)).toString(32)+n,t="_"+t+"R_"+n,n=lo++,0<n&&(t+="H"+n.toString(32)),t+="_"}else n=uy++,t="_"+t+"r_"+n.toString(32)+"_";return e.memoizedState=t},useHostTransitionStatus:Es,useFormState:Hf,useActionState:Hf,useOptimistic:function(e){var t=ht();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=ws.bind(null,ye,!0,n),n.dispatch=t,[e,t]},useMemoCache:ms,useCacheRefresh:function(){return ht().memoizedState=_y.bind(null,ye)},useEffectEvent:function(e){var t=ht(),n={impl:e};return t.memoizedState=n,function(){if((Ne&2)!==0)throw Error(r(440));return n.impl.apply(void 0,arguments)}}},Ts={readContext:dt,use:io,useCallback:Wf,useContext:dt,useEffect:bs,useImperativeHandle:Ff,useInsertionEffect:Kf,useLayoutEffect:Jf,useMemo:$f,useReducer:oo,useRef:Gf,useState:function(){return oo(yn)},useDebugValue:vs,useDeferredValue:function(e,t){var n=Pe();return Pf(n,Le.memoizedState,e,t)},useTransition:function(){var e=oo(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Za(e),t]},useSyncExternalStore:Af,useId:ld,useHostTransitionStatus:Es,useFormState:Xf,useActionState:Xf,useOptimistic:function(e,t){var n=Pe();return Df(n,Le,e,t)},useMemoCache:ms,useCacheRefresh:ad};Ts.useEffectEvent=Zf;var rd={readContext:dt,use:io,useCallback:Wf,useContext:dt,useEffect:bs,useImperativeHandle:Ff,useInsertionEffect:Kf,useLayoutEffect:Jf,useMemo:$f,useReducer:ys,useRef:Gf,useState:function(){return ys(yn)},useDebugValue:vs,useDeferredValue:function(e,t){var n=Pe();return Le===null?xs(n,e,t):Pf(n,Le.memoizedState,e,t)},useTransition:function(){var e=ys(yn)[0],t=Pe().memoizedState;return[typeof e=="boolean"?e:Za(e),t]},useSyncExternalStore:Af,useId:ld,useHostTransitionStatus:Es,useFormState:Qf,useActionState:Qf,useOptimistic:function(e,t){var n=Pe();return Le!==null?Df(n,Le,e,t):(n.baseState=e,[e,n.queue.dispatch])},useMemoCache:ms,useCacheRefresh:ad};rd.useEffectEvent=Zf;function Cs(e,t,n,l){t=e.memoizedState,n=n(l,t),n=n==null?t:E({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Os={enqueueSetState:function(e,t,n){e=e._reactInternals;var l=Ut(),a=Hn(l);a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ct(t,e,l),qa(t,e,l))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var l=Ut(),a=Hn(l);a.tag=1,a.payload=t,n!=null&&(a.callback=n),t=Xn(e,a,l),t!==null&&(Ct(t,e,l),qa(t,e,l))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=Ut(),l=Hn(n);l.tag=2,t!=null&&(l.callback=t),t=Xn(e,l,n),t!==null&&(Ct(t,e,n),qa(t,e,n))}};function cd(e,t,n,l,a,o,c){return e=e.stateNode,typeof e.shouldComponentUpdate=="function"?e.shouldComponentUpdate(l,o,c):t.prototype&&t.prototype.isPureReactComponent?!Da(n,l)||!Da(a,o):!0}function fd(e,t,n,l){e=t.state,typeof t.componentWillReceiveProps=="function"&&t.componentWillReceiveProps(n,l),typeof t.UNSAFE_componentWillReceiveProps=="function"&&t.UNSAFE_componentWillReceiveProps(n,l),t.state!==e&&Os.enqueueReplaceState(t,t.state,null)}function xl(e,t){var n=t;if("ref"in t){n={};for(var l in t)l!=="ref"&&(n[l]=t[l])}if(e=e.defaultProps){n===t&&(n=E({},n));for(var a in e)n[a]===void 0&&(n[a]=e[a])}return n}function dd(e){Xi(e)}function _d(e){console.error(e)}function md(e){Xi(e)}function co(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(l){setTimeout(function(){throw l})}}function gd(e,t,n){try{var l=e.onCaughtError;l(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(a){setTimeout(function(){throw a})}}function As(e,t,n){return n=Hn(n),n.tag=3,n.payload={element:null},n.callback=function(){co(e,t)},n}function yd(e){return e=Hn(e),e.tag=3,e}function pd(e,t,n,l){var a=n.type.getDerivedStateFromError;if(typeof a=="function"){var o=l.value;e.payload=function(){return a(o)},e.callback=function(){gd(t,n,l)}}var c=n.stateNode;c!==null&&typeof c.componentDidCatch=="function"&&(e.callback=function(){gd(t,n,l),typeof a!="function"&&(Kn===null?Kn=new Set([this]):Kn.add(this));var d=l.stack;this.componentDidCatch(l.value,{componentStack:d!==null?d:""})})}function gy(e,t,n,l,a){if(n.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){if(t=n.alternate,t!==null&&Vl(t,n,a,!0),n=jt.current,n!==null){switch(n.tag){case 31:case 13:return Vt===null?Eo():n.alternate===null&&Fe===0&&(Fe=3),n.flags&=-257,n.flags|=65536,n.lanes=a,l===Wi?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([l]):t.add(l),Ps(e,l,a)),!1;case 22:return n.flags|=65536,l===Wi?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([l])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([l]):n.add(l)),Ps(e,l,a)),!1}throw Error(r(435,n.tag))}return Ps(e,l,a),Eo(),!1}if(Oe)return t=jt.current,t!==null?((t.flags&65536)===0&&(t.flags|=256),t.flags|=65536,t.lanes=a,l!==Ku&&(e=Error(r(422),{cause:l}),Ya(Xt(e,n)))):(l!==Ku&&(t=Error(r(423),{cause:l}),Ya(Xt(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,l=Xt(l,n),a=As(e.stateNode,l,a),as(e,a),Fe!==4&&(Fe=2)),!1;var o=Error(r(520),{cause:l});if(o=Xt(o,n),ni===null?ni=[o]:ni.push(o),Fe!==4&&(Fe=2),t===null)return!0;l=Xt(l,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=As(n.stateNode,l,e),as(n,e),!1;case 1:if(t=n.type,o=n.stateNode,(n.flags&128)===0&&(typeof t.getDerivedStateFromError=="function"||o!==null&&typeof o.componentDidCatch=="function"&&(Kn===null||!Kn.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=yd(a),pd(a,e,n,l),as(n,a),!1}n=n.return}while(n!==null);return!1}var zs=Error(r(461)),nt=!1;function _t(e,t,n,l){t.child=e===null?xf(t,null,n,l):bl(t,e.child,n,l)}function hd(e,t,n,l,a){n=n.render;var o=t.ref;if("ref"in l){var c={};for(var d in l)d!=="ref"&&(c[d]=l[d])}else c=l;return gl(t),l=cs(e,t,n,c,o,a),d=fs(),e!==null&&!nt?(ds(e,t,a),pn(e,t,a)):(Oe&&d&&Vu(t),t.flags|=1,_t(e,t,l,a),t.child)}function bd(e,t,n,l,a){if(e===null){var o=n.type;return typeof o=="function"&&!qu(o)&&o.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=o,vd(e,t,o,l,a)):(e=Vi(n.type,null,l,t,t.mode,a),e.ref=t.ref,e.return=t,t.child=e)}if(o=e.child,!Ys(e,a)){var c=o.memoizedProps;if(n=n.compare,n=n!==null?n:Da,n(c,l)&&e.ref===t.ref)return pn(e,t,a)}return t.flags|=1,e=fn(o,l),e.ref=t.ref,e.return=t,t.child=e}function vd(e,t,n,l,a){if(e!==null){var o=e.memoizedProps;if(Da(o,l)&&e.ref===t.ref)if(nt=!1,t.pendingProps=l=o,Ys(e,a))(e.flags&131072)!==0&&(nt=!0);else return t.lanes=e.lanes,pn(e,t,a)}return Rs(e,t,n,l,a)}function xd(e,t,n,l){var a=l.children,o=e!==null?e.memoizedState:null;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),l.mode==="hidden"){if((t.flags&128)!==0){if(o=o!==null?o.baseLanes|n:n,e!==null){for(l=t.child=e.child,a=0;l!==null;)a=a|l.lanes|l.childLanes,l=l.sibling;l=a&~o}else l=0,t.child=null;return Sd(e,t,o,n,l)}if((n&536870912)!==0)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&Ii(t,o!==null?o.cachePool:null),o!==null?wf(t,o):os(),Tf(t);else return l=t.lanes=536870912,Sd(e,t,o!==null?o.baseLanes|n:n,n,l)}else o!==null?(Ii(t,o.cachePool),wf(t,o),Qn(),t.memoizedState=null):(e!==null&&Ii(t,null),os(),Qn());return _t(e,t,a,n),t.child}function Ia(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function Sd(e,t,n,l,a){var o=es();return o=o===null?null:{parent:et._currentValue,pool:o},t.memoizedState={baseLanes:n,cachePool:o},e!==null&&Ii(t,null),os(),Tf(t),e!==null&&Vl(e,t,l,!0),t.childLanes=a,null}function fo(e,t){return t=mo({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function Ed(e,t,n){return bl(t,e.child,null,n),e=fo(t,t.pendingProps),e.flags|=2,Mt(t),t.memoizedState=null,e}function yy(e,t,n){var l=t.pendingProps,a=(t.flags&128)!==0;if(t.flags&=-129,e===null){if(Oe){if(l.mode==="hidden")return e=fo(t,l),t.lanes=536870912,Ia(null,e);if(ss(t),(e=Ve)?(e=k_(e,Gt),e=e!==null&&e.data==="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=of(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return t.lanes=536870912,null}return fo(t,l)}var o=e.memoizedState;if(o!==null){var c=o.dehydrated;if(ss(t),a)if(t.flags&256)t.flags&=-257,t=Ed(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(r(558));else if(nt||Vl(e,t,n,!1),a=(n&e.childLanes)!==0,nt||a){if(l=qe,l!==null&&(c=dc(l,n),c!==0&&c!==o.retryLane))throw o.retryLane=c,fl(e,c),Ct(l,e,c),zs;Eo(),t=Ed(e,t,n)}else e=o.treeContext,Ve=Zt(c.nextSibling),ft=t,Oe=!0,Un=null,Gt=!1,e!==null&&rf(t,e),t=fo(t,l),t.flags|=4096;return t}return e=fn(e.child,{mode:l.mode,children:l.children}),e.ref=t.ref,t.child=e,e.return=t,e}function _o(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!="function"&&typeof n!="object")throw Error(r(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function Rs(e,t,n,l,a){return gl(t),n=cs(e,t,n,l,void 0,a),l=fs(),e!==null&&!nt?(ds(e,t,a),pn(e,t,a)):(Oe&&l&&Vu(t),t.flags|=1,_t(e,t,n,a),t.child)}function wd(e,t,n,l,a,o){return gl(t),t.updateQueue=null,n=Of(t,l,n,a),Cf(e),l=fs(),e!==null&&!nt?(ds(e,t,o),pn(e,t,o)):(Oe&&l&&Vu(t),t.flags|=1,_t(e,t,n,o),t.child)}function Td(e,t,n,l,a){if(gl(t),t.stateNode===null){var o=Xl,c=n.contextType;typeof c=="object"&&c!==null&&(o=dt(c)),o=new n(l,o),t.memoizedState=o.state!==null&&o.state!==void 0?o.state:null,o.updater=Os,t.stateNode=o,o._reactInternals=t,o=t.stateNode,o.props=l,o.state=t.memoizedState,o.refs={},ns(t),c=n.contextType,o.context=typeof c=="object"&&c!==null?dt(c):Xl,o.state=t.memoizedState,c=n.getDerivedStateFromProps,typeof c=="function"&&(Cs(t,n,c,l),o.state=t.memoizedState),typeof n.getDerivedStateFromProps=="function"||typeof o.getSnapshotBeforeUpdate=="function"||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(c=o.state,typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount(),c!==o.state&&Os.enqueueReplaceState(o,o.state,null),Ga(t,l,o,a),Qa(),o.state=t.memoizedState),typeof o.componentDidMount=="function"&&(t.flags|=4194308),l=!0}else if(e===null){o=t.stateNode;var d=t.memoizedProps,p=xl(n,d);o.props=p;var C=o.context,M=n.contextType;c=Xl,typeof M=="object"&&M!==null&&(c=dt(M));var Y=n.getDerivedStateFromProps;M=typeof Y=="function"||typeof o.getSnapshotBeforeUpdate=="function",d=t.pendingProps!==d,M||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(d||C!==c)&&fd(t,o,l,c),Bn=!1;var O=t.memoizedState;o.state=O,Ga(t,l,o,a),Qa(),C=t.memoizedState,d||O!==C||Bn?(typeof Y=="function"&&(Cs(t,n,Y,l),C=t.memoizedState),(p=Bn||cd(t,n,p,l,O,C,c))?(M||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(t.flags|=4194308)):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),t.memoizedProps=l,t.memoizedState=C),o.props=l,o.state=C,o.context=c,l=p):(typeof o.componentDidMount=="function"&&(t.flags|=4194308),l=!1)}else{o=t.stateNode,ls(e,t),c=t.memoizedProps,M=xl(n,c),o.props=M,Y=t.pendingProps,O=o.context,C=n.contextType,p=Xl,typeof C=="object"&&C!==null&&(p=dt(C)),d=n.getDerivedStateFromProps,(C=typeof d=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(c!==Y||O!==p)&&fd(t,o,l,p),Bn=!1,O=t.memoizedState,o.state=O,Ga(t,l,o,a),Qa();var R=t.memoizedState;c!==Y||O!==R||Bn||e!==null&&e.dependencies!==null&&Ki(e.dependencies)?(typeof d=="function"&&(Cs(t,n,d,l),R=t.memoizedState),(M=Bn||cd(t,n,M,l,O,R,p)||e!==null&&e.dependencies!==null&&Ki(e.dependencies))?(C||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(l,R,p),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(l,R,p)),typeof o.componentDidUpdate=="function"&&(t.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(t.flags|=1024)):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),t.memoizedProps=l,t.memoizedState=R),o.props=l,o.state=R,o.context=p,l=M):(typeof o.componentDidUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||c===e.memoizedProps&&O===e.memoizedState||(t.flags|=1024),l=!1)}return o=l,_o(e,t),l=(t.flags&128)!==0,o||l?(o=t.stateNode,n=l&&typeof n.getDerivedStateFromError!="function"?null:o.render(),t.flags|=1,e!==null&&l?(t.child=bl(t,e.child,null,a),t.child=bl(t,null,n,a)):_t(e,t,n,a),t.memoizedState=o.state,e=t.child):e=pn(e,t,a),e}function Cd(e,t,n,l){return _l(),t.flags|=256,_t(e,t,n,l),t.child}var Ns={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function js(e){return{baseLanes:e,cachePool:gf()}}function Ms(e,t,n){return e=e!==null?e.childLanes&~n:0,t&&(e|=kt),e}function Od(e,t,n){var l=t.pendingProps,a=!1,o=(t.flags&128)!==0,c;if((c=o)||(c=e!==null&&e.memoizedState===null?!1:($e.current&2)!==0),c&&(a=!0,t.flags&=-129),c=(t.flags&32)!==0,t.flags&=-33,e===null){if(Oe){if(a?qn(t):Qn(),(e=Ve)?(e=k_(e,Gt),e=e!==null&&e.data!=="&"?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:kn!==null?{id:tn,overflow:nn}:null,retryLane:536870912,hydrationErrors:null},n=of(e),n.return=t,t.child=n,ft=t,Ve=null)):e=null,e===null)throw Yn(t);return gr(e)?t.lanes=32:t.lanes=536870912,null}var d=l.children;return l=l.fallback,a?(Qn(),a=t.mode,d=mo({mode:"hidden",children:d},a),l=dl(l,a,n,null),d.return=t,l.return=t,d.sibling=l,t.child=d,l=t.child,l.memoizedState=js(n),l.childLanes=Ms(e,c,n),t.memoizedState=Ns,Ia(null,l)):(qn(t),Ds(t,d))}var p=e.memoizedState;if(p!==null&&(d=p.dehydrated,d!==null)){if(o)t.flags&256?(qn(t),t.flags&=-257,t=ks(e,t,n)):t.memoizedState!==null?(Qn(),t.child=e.child,t.flags|=128,t=null):(Qn(),d=l.fallback,a=t.mode,l=mo({mode:"visible",children:l.children},a),d=dl(d,a,n,null),d.flags|=2,l.return=t,d.return=t,l.sibling=d,t.child=l,bl(t,e.child,null,n),l=t.child,l.memoizedState=js(n),l.childLanes=Ms(e,c,n),t.memoizedState=Ns,t=Ia(null,l));else if(qn(t),gr(d)){if(c=d.nextSibling&&d.nextSibling.dataset,c)var C=c.dgst;c=C,l=Error(r(419)),l.stack="",l.digest=c,Ya({value:l,source:null,stack:null}),t=ks(e,t,n)}else if(nt||Vl(e,t,n,!1),c=(n&e.childLanes)!==0,nt||c){if(c=qe,c!==null&&(l=dc(c,n),l!==0&&l!==p.retryLane))throw p.retryLane=l,fl(e,l),Ct(c,e,l),zs;mr(d)||Eo(),t=ks(e,t,n)}else mr(d)?(t.flags|=192,t.child=e.child,t=null):(e=p.treeContext,Ve=Zt(d.nextSibling),ft=t,Oe=!0,Un=null,Gt=!1,e!==null&&rf(t,e),t=Ds(t,l.children),t.flags|=4096);return t}return a?(Qn(),d=l.fallback,a=t.mode,p=e.child,C=p.sibling,l=fn(p,{mode:"hidden",children:l.children}),l.subtreeFlags=p.subtreeFlags&65011712,C!==null?d=fn(C,d):(d=dl(d,a,n,null),d.flags|=2),d.return=t,l.return=t,l.sibling=d,t.child=l,Ia(null,l),l=t.child,d=e.child.memoizedState,d===null?d=js(n):(a=d.cachePool,a!==null?(p=et._currentValue,a=a.parent!==p?{parent:p,pool:p}:a):a=gf(),d={baseLanes:d.baseLanes|n,cachePool:a}),l.memoizedState=d,l.childLanes=Ms(e,c,n),t.memoizedState=Ns,Ia(e.child,l)):(qn(t),n=e.child,e=n.sibling,n=fn(n,{mode:"visible",children:l.children}),n.return=t,n.sibling=null,e!==null&&(c=t.deletions,c===null?(t.deletions=[e],t.flags|=16):c.push(e)),t.child=n,t.memoizedState=null,n)}function Ds(e,t){return t=mo({mode:"visible",children:t},e.mode),t.return=e,e.child=t}function mo(e,t){return e=Nt(22,e,null,t),e.lanes=0,e}function ks(e,t,n){return bl(t,e.child,null,n),e=Ds(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Ad(e,t,n){e.lanes|=t;var l=e.alternate;l!==null&&(l.lanes|=t),Fu(e.return,t,n)}function Us(e,t,n,l,a,o){var c=e.memoizedState;c===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:l,tail:n,tailMode:a,treeForkCount:o}:(c.isBackwards=t,c.rendering=null,c.renderingStartTime=0,c.last=l,c.tail=n,c.tailMode=a,c.treeForkCount=o)}function zd(e,t,n){var l=t.pendingProps,a=l.revealOrder,o=l.tail;l=l.children;var c=$e.current,d=(c&2)!==0;if(d?(c=c&1|2,t.flags|=128):c&=1,X($e,c),_t(e,t,l,n),l=Oe?Ua:0,!d&&e!==null&&(e.flags&128)!==0)e:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Ad(e,n,t);else if(e.tag===19)Ad(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break e;for(;e.sibling===null;){if(e.return===null||e.return===t)break e;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(a){case"forwards":for(n=t.child,a=null;n!==null;)e=n.alternate,e!==null&&to(e)===null&&(a=n),n=n.sibling;n=a,n===null?(a=t.child,t.child=null):(a=n.sibling,n.sibling=null),Us(t,!1,a,n,o,l);break;case"backwards":case"unstable_legacy-backwards":for(n=null,a=t.child,t.child=null;a!==null;){if(e=a.alternate,e!==null&&to(e)===null){t.child=a;break}e=a.sibling,a.sibling=n,n=a,a=e}Us(t,!0,n,null,o,l);break;case"together":Us(t,!1,null,null,void 0,l);break;default:t.memoizedState=null}return t.child}function pn(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),Zn|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(Vl(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(r(153));if(t.child!==null){for(e=t.child,n=fn(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=fn(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ys(e,t){return(e.lanes&t)!==0?!0:(e=e.dependencies,!!(e!==null&&Ki(e)))}function py(e,t,n){switch(t.tag){case 3:Je(t,t.stateNode.containerInfo),Ln(t,et,e.memoizedState.cache),_l();break;case 27:case 5:Yt(t);break;case 4:Je(t,t.stateNode.containerInfo);break;case 10:Ln(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,ss(t),null;break;case 13:var l=t.memoizedState;if(l!==null)return l.dehydrated!==null?(qn(t),t.flags|=128,null):(n&t.child.childLanes)!==0?Od(e,t,n):(qn(t),e=pn(e,t,n),e!==null?e.sibling:null);qn(t);break;case 19:var a=(e.flags&128)!==0;if(l=(n&t.childLanes)!==0,l||(Vl(e,t,n,!1),l=(n&t.childLanes)!==0),a){if(l)return zd(e,t,n);t.flags|=128}if(a=t.memoizedState,a!==null&&(a.rendering=null,a.tail=null,a.lastEffect=null),X($e,$e.current),l)break;return null;case 22:return t.lanes=0,xd(e,t,n,t.pendingProps);case 24:Ln(t,et,e.memoizedState.cache)}return pn(e,t,n)}function Rd(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)nt=!0;else{if(!Ys(e,n)&&(t.flags&128)===0)return nt=!1,py(e,t,n);nt=(e.flags&131072)!==0}else nt=!1,Oe&&(t.flags&1048576)!==0&&sf(t,Ua,t.index);switch(t.lanes=0,t.tag){case 16:e:{var l=t.pendingProps;if(e=pl(t.elementType),t.type=e,typeof e=="function")qu(e)?(l=xl(e,l),t.tag=1,t=Td(null,t,e,l,n)):(t.tag=0,t=Rs(null,t,e,l,n));else{if(e!=null){var a=e.$$typeof;if(a===Q){t.tag=11,t=hd(null,t,e,l,n);break e}else if(a===F){t.tag=14,t=bd(null,t,e,l,n);break e}}throw t=Xe(e)||e,Error(r(306,t,""))}}return t;case 0:return Rs(e,t,t.type,t.pendingProps,n);case 1:return l=t.type,a=xl(l,t.pendingProps),Td(e,t,l,a,n);case 3:e:{if(Je(t,t.stateNode.containerInfo),e===null)throw Error(r(387));l=t.pendingProps;var o=t.memoizedState;a=o.element,ls(e,t),Ga(t,l,null,n);var c=t.memoizedState;if(l=c.cache,Ln(t,et,l),l!==o.cache&&Wu(t,[et],n,!0),Qa(),l=c.element,o.isDehydrated)if(o={element:l,isDehydrated:!1,cache:c.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=Cd(e,t,l,n);break e}else if(l!==a){a=Xt(Error(r(424)),t),Ya(a),t=Cd(e,t,l,n);break e}else for(e=t.stateNode.containerInfo,e.nodeType===9?e=e.body:e=e.nodeName==="HTML"?e.ownerDocument.body:e,Ve=Zt(e.firstChild),ft=t,Oe=!0,Un=null,Gt=!0,n=xf(t,null,l,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(_l(),l===a){t=pn(e,t,n);break e}_t(e,t,l,n)}t=t.child}return t;case 26:return _o(e,t),e===null?(n=X_(t.type,null,t.pendingProps,null))?t.memoizedState=n:Oe||(n=t.type,e=t.pendingProps,l=Ro(pe.current).createElement(n),l[ct]=t,l[vt]=e,mt(l,n,e),ut(l),t.stateNode=l):t.memoizedState=X_(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return Yt(t),e===null&&Oe&&(l=t.stateNode=L_(t.type,t.pendingProps,pe.current),ft=t,Gt=!0,a=Ve,Wn(t.type)?(yr=a,Ve=Zt(l.firstChild)):Ve=a),_t(e,t,t.pendingProps.children,n),_o(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&Oe&&((a=l=Ve)&&(l=Ky(l,t.type,t.pendingProps,Gt),l!==null?(t.stateNode=l,ft=t,Ve=Zt(l.firstChild),Gt=!1,a=!0):a=!1),a||Yn(t)),Yt(t),a=t.type,o=t.pendingProps,c=e!==null?e.memoizedProps:null,l=o.children,fr(a,o)?l=null:c!==null&&fr(a,c)&&(t.flags|=32),t.memoizedState!==null&&(a=cs(e,t,sy,null,null,n),ci._currentValue=a),_o(e,t),_t(e,t,l,n),t.child;case 6:return e===null&&Oe&&((e=n=Ve)&&(n=Jy(n,t.pendingProps,Gt),n!==null?(t.stateNode=n,ft=t,Ve=null,e=!0):e=!1),e||Yn(t)),null;case 13:return Od(e,t,n);case 4:return Je(t,t.stateNode.containerInfo),l=t.pendingProps,e===null?t.child=bl(t,null,l,n):_t(e,t,l,n),t.child;case 11:return hd(e,t,t.type,t.pendingProps,n);case 7:return _t(e,t,t.pendingProps,n),t.child;case 8:return _t(e,t,t.pendingProps.children,n),t.child;case 12:return _t(e,t,t.pendingProps.children,n),t.child;case 10:return l=t.pendingProps,Ln(t,t.type,l.value),_t(e,t,l.children,n),t.child;case 9:return a=t.type._context,l=t.pendingProps.children,gl(t),a=dt(a),l=l(a),t.flags|=1,_t(e,t,l,n),t.child;case 14:return bd(e,t,t.type,t.pendingProps,n);case 15:return vd(e,t,t.type,t.pendingProps,n);case 19:return zd(e,t,n);case 31:return yy(e,t,n);case 22:return xd(e,t,n,t.pendingProps);case 24:return gl(t),l=dt(et),e===null?(a=es(),a===null&&(a=qe,o=$u(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:l,cache:a},ns(t),Ln(t,et,a)):((e.lanes&n)!==0&&(ls(e,t),Ga(t,null,null,n),Qa()),a=e.memoizedState,o=t.memoizedState,a.parent!==l?(a={parent:l,cache:l},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Ln(t,et,l)):(l=o.cache,Ln(t,et,l),l!==a.cache&&Wu(t,[et],n,!0))),_t(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(r(156,t.tag))}function hn(e){e.flags|=4}function Ls(e,t,n,l,a){if((t=(e.mode&32)!==0)&&(t=!1),t){if(e.flags|=16777216,(a&335544128)===a)if(e.stateNode.complete)e.flags|=8192;else if(l_())e.flags|=8192;else throw hl=Wi,ts}else e.flags&=-16777217}function Nd(e,t){if(t.type!=="stylesheet"||(t.state.loading&4)!==0)e.flags&=-16777217;else if(e.flags|=16777216,!Z_(t))if(l_())e.flags|=8192;else throw hl=Wi,ts}function go(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag!==22?rc():536870912,e.lanes|=t,la|=t)}function Fa(e,t){if(!Oe)switch(e.tailMode){case"hidden":t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case"collapsed":n=e.tail;for(var l=null;n!==null;)n.alternate!==null&&(l=n),n=n.sibling;l===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:l.sibling=null}}function Ze(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,l=0;if(t)for(var a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags&65011712,l|=a.flags&65011712,a.return=e,a=a.sibling;else for(a=e.child;a!==null;)n|=a.lanes|a.childLanes,l|=a.subtreeFlags,l|=a.flags,a.return=e,a=a.sibling;return e.subtreeFlags|=l,e.childLanes=n,t}function hy(e,t,n){var l=t.pendingProps;switch(Zu(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Ze(t),null;case 1:return Ze(t),null;case 3:return n=t.stateNode,l=null,e!==null&&(l=e.memoizedState.cache),t.memoizedState.cache!==l&&(t.flags|=2048),mn(et),Me(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gl(t)?hn(t):e===null||e.memoizedState.isDehydrated&&(t.flags&256)===0||(t.flags|=1024,Ju())),Ze(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(hn(t),o!==null?(Ze(t),Nd(t,o)):(Ze(t),Ls(t,a,null,l,n))):o?o!==e.memoizedState?(hn(t),Ze(t),Nd(t,o)):(Ze(t),t.flags&=-16777217):(e=e.memoizedProps,e!==l&&hn(t),Ze(t),Ls(t,a,e,l,n)),null;case 27:if(It(t),n=pe.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}e=J.current,Gl(t)?cf(t):(e=L_(a,l,n),t.stateNode=e,hn(t))}return Ze(t),null;case 5:if(It(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(!l){if(t.stateNode===null)throw Error(r(166));return Ze(t),null}if(o=J.current,Gl(t))cf(t);else{var c=Ro(pe.current);switch(o){case 1:o=c.createElementNS("http://www.w3.org/2000/svg",a);break;case 2:o=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;default:switch(a){case"svg":o=c.createElementNS("http://www.w3.org/2000/svg",a);break;case"math":o=c.createElementNS("http://www.w3.org/1998/Math/MathML",a);break;case"script":o=c.createElement("div"),o.innerHTML="<script><\/script>",o=o.removeChild(o.firstChild);break;case"select":o=typeof l.is=="string"?c.createElement("select",{is:l.is}):c.createElement("select"),l.multiple?o.multiple=!0:l.size&&(o.size=l.size);break;default:o=typeof l.is=="string"?c.createElement(a,{is:l.is}):c.createElement(a)}}o[ct]=t,o[vt]=l;e:for(c=t.child;c!==null;){if(c.tag===5||c.tag===6)o.appendChild(c.stateNode);else if(c.tag!==4&&c.tag!==27&&c.child!==null){c.child.return=c,c=c.child;continue}if(c===t)break e;for(;c.sibling===null;){if(c.return===null||c.return===t)break e;c=c.return}c.sibling.return=c.return,c=c.sibling}t.stateNode=o;e:switch(mt(o,a,l),a){case"button":case"input":case"select":case"textarea":l=!!l.autoFocus;break e;case"img":l=!0;break e;default:l=!1}l&&hn(t)}}return Ze(t),Ls(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==l&&hn(t);else{if(typeof l!="string"&&t.stateNode===null)throw Error(r(166));if(e=pe.current,Gl(t)){if(e=t.stateNode,n=t.memoizedProps,l=null,a=ft,a!==null)switch(a.tag){case 27:case 5:l=a.memoizedProps}e[ct]=t,e=!!(e.nodeValue===n||l!==null&&l.suppressHydrationWarning===!0||O_(e.nodeValue,n)),e||Yn(t,!0)}else e=Ro(e).createTextNode(l),e[ct]=t,t.stateNode=e}return Ze(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(l=Gl(t),n!==null){if(e===null){if(!l)throw Error(r(318));if(e=t.memoizedState,e=e!==null?e.dehydrated:null,!e)throw Error(r(557));e[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),e=!1}else n=Ju(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(Mt(t),t):(Mt(t),null);if((t.flags&128)!==0)throw Error(r(558))}return Ze(t),null;case 13:if(l=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gl(t),l!==null&&l.dehydrated!==null){if(e===null){if(!a)throw Error(r(318));if(a=t.memoizedState,a=a!==null?a.dehydrated:null,!a)throw Error(r(317));a[ct]=t}else _l(),(t.flags&128)===0&&(t.memoizedState=null),t.flags|=4;Ze(t),a=!1}else a=Ju(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(Mt(t),t):(Mt(t),null)}return Mt(t),(t.flags&128)!==0?(t.lanes=n,t):(n=l!==null,e=e!==null&&e.memoizedState!==null,n&&(l=t.child,a=null,l.alternate!==null&&l.alternate.memoizedState!==null&&l.alternate.memoizedState.cachePool!==null&&(a=l.alternate.memoizedState.cachePool.pool),o=null,l.memoizedState!==null&&l.memoizedState.cachePool!==null&&(o=l.memoizedState.cachePool.pool),o!==a&&(l.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),go(t,t.updateQueue),Ze(t),null);case 4:return Me(),e===null&&or(t.stateNode.containerInfo),Ze(t),null;case 10:return mn(t.type),Ze(t),null;case 19:if(U($e),l=t.memoizedState,l===null)return Ze(t),null;if(a=(t.flags&128)!==0,o=l.rendering,o===null)if(a)Fa(l,!1);else{if(Fe!==0||e!==null&&(e.flags&128)!==0)for(e=t.child;e!==null;){if(o=to(e),o!==null){for(t.flags|=128,Fa(l,!1),e=o.updateQueue,t.updateQueue=e,go(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)af(n,e),n=n.sibling;return X($e,$e.current&1|2),Oe&&dn(t,l.treeForkCount),t.child}e=e.sibling}l.tail!==null&&Ye()>vo&&(t.flags|=128,a=!0,Fa(l,!1),t.lanes=4194304)}else{if(!a)if(e=to(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,go(t,e),Fa(l,!0),l.tail===null&&l.tailMode==="hidden"&&!o.alternate&&!Oe)return Ze(t),null}else 2*Ye()-l.renderingStartTime>vo&&n!==536870912&&(t.flags|=128,a=!0,Fa(l,!1),t.lanes=4194304);l.isBackwards?(o.sibling=t.child,t.child=o):(e=l.last,e!==null?e.sibling=o:t.child=o,l.last=o)}return l.tail!==null?(e=l.tail,l.rendering=e,l.tail=e.sibling,l.renderingStartTime=Ye(),e.sibling=null,n=$e.current,X($e,a?n&1|2:n&1),Oe&&dn(t,l.treeForkCount),e):(Ze(t),null);case 22:case 23:return Mt(t),us(),l=t.memoizedState!==null,e!==null?e.memoizedState!==null!==l&&(t.flags|=8192):l&&(t.flags|=8192),l?(n&536870912)!==0&&(t.flags&128)===0&&(Ze(t),t.subtreeFlags&6&&(t.flags|=8192)):Ze(t),n=t.updateQueue,n!==null&&go(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),l=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(l=t.memoizedState.cachePool.pool),l!==n&&(t.flags|=2048),e!==null&&U(yl),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),mn(et),Ze(t),null;case 25:return null;case 30:return null}throw Error(r(156,t.tag))}function by(e,t){switch(Zu(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return mn(et),Me(),e=t.flags,(e&65536)!==0&&(e&128)===0?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return It(t),null;case 31:if(t.memoizedState!==null){if(Mt(t),t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(Mt(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(r(340));_l()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return U($e),null;case 4:return Me(),null;case 10:return mn(t.type),null;case 22:case 23:return Mt(t),us(),e!==null&&U(yl),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return mn(et),null;case 25:return null;default:return null}}function jd(e,t){switch(Zu(t),t.tag){case 3:mn(et),Me();break;case 26:case 27:case 5:It(t);break;case 4:Me();break;case 31:t.memoizedState!==null&&Mt(t);break;case 13:Mt(t);break;case 19:U($e);break;case 10:mn(t.type);break;case 22:case 23:Mt(t),us(),e!==null&&U(yl);break;case 24:mn(et)}}function Wa(e,t){try{var n=t.updateQueue,l=n!==null?n.lastEffect:null;if(l!==null){var a=l.next;n=a;do{if((n.tag&e)===e){l=void 0;var o=n.create,c=n.inst;l=o(),c.destroy=l}n=n.next}while(n!==a)}}catch(d){ke(t,t.return,d)}}function Gn(e,t,n){try{var l=t.updateQueue,a=l!==null?l.lastEffect:null;if(a!==null){var o=a.next;l=o;do{if((l.tag&e)===e){var c=l.inst,d=c.destroy;if(d!==void 0){c.destroy=void 0,a=t;var p=n,C=d;try{C()}catch(M){ke(a,p,M)}}}l=l.next}while(l!==o)}}catch(M){ke(t,t.return,M)}}function Md(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{Ef(t,n)}catch(l){ke(e,e.return,l)}}}function Dd(e,t,n){n.props=xl(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(l){ke(e,t,l)}}function $a(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var l=e.stateNode;break;case 30:l=e.stateNode;break;default:l=e.stateNode}typeof n=="function"?e.refCleanup=n(l):n.current=l}}catch(a){ke(e,t,a)}}function ln(e,t){var n=e.ref,l=e.refCleanup;if(n!==null)if(typeof l=="function")try{l()}catch(a){ke(e,t,a)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n=="function")try{n(null)}catch(a){ke(e,t,a)}else n.current=null}function kd(e){var t=e.type,n=e.memoizedProps,l=e.stateNode;try{e:switch(t){case"button":case"input":case"select":case"textarea":n.autoFocus&&l.focus();break e;case"img":n.src?l.src=n.src:n.srcSet&&(l.srcset=n.srcSet)}}catch(a){ke(e,e.return,a)}}function Bs(e,t,n){try{var l=e.stateNode;Xy(l,e.type,n,t),l[vt]=t}catch(a){ke(e,e.return,a)}}function Ud(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Wn(e.type)||e.tag===4}function Hs(e){e:for(;;){for(;e.sibling===null;){if(e.return===null||Ud(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Wn(e.type)||e.flags&2||e.child===null||e.tag===4)continue e;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function Xs(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName==="HTML"?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=rn));else if(l!==4&&(l===27&&Wn(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(Xs(e,t,n),e=e.sibling;e!==null;)Xs(e,t,n),e=e.sibling}function yo(e,t,n){var l=e.tag;if(l===5||l===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(l!==4&&(l===27&&Wn(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(yo(e,t,n),e=e.sibling;e!==null;)yo(e,t,n),e=e.sibling}function Yd(e){var t=e.stateNode,n=e.memoizedProps;try{for(var l=e.type,a=t.attributes;a.length;)t.removeAttributeNode(a[0]);mt(t,l,n),t[ct]=e,t[vt]=n}catch(o){ke(e,e.return,o)}}var bn=!1,lt=!1,qs=!1,Ld=typeof WeakSet=="function"?WeakSet:Set,st=null;function vy(e,t){if(e=e.containerInfo,rr=Yo,e=Ic(e),ku(e)){if("selectionStart"in e)var n={start:e.selectionStart,end:e.selectionEnd};else e:{n=(n=e.ownerDocument)&&n.defaultView||window;var l=n.getSelection&&n.getSelection();if(l&&l.rangeCount!==0){n=l.anchorNode;var a=l.anchorOffset,o=l.focusNode;l=l.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break e}var c=0,d=-1,p=-1,C=0,M=0,Y=e,O=null;t:for(;;){for(var R;Y!==n||a!==0&&Y.nodeType!==3||(d=c+a),Y!==o||l!==0&&Y.nodeType!==3||(p=c+l),Y.nodeType===3&&(c+=Y.nodeValue.length),(R=Y.firstChild)!==null;)O=Y,Y=R;for(;;){if(Y===e)break t;if(O===n&&++C===a&&(d=c),O===o&&++M===l&&(p=c),(R=Y.nextSibling)!==null)break;Y=O,O=Y.parentNode}Y=R}n=d===-1||p===-1?null:{start:d,end:p}}else n=null}n=n||{start:0,end:0}}else n=null;for(cr={focusedElem:e,selectionRange:n},Yo=!1,st=t;st!==null;)if(t=st,e=t.child,(t.subtreeFlags&1028)!==0&&e!==null)e.return=t,st=e;else for(;st!==null;){switch(t=st,o=t.alternate,e=t.flags,t.tag){case 0:if((e&4)!==0&&(e=t.updateQueue,e=e!==null?e.events:null,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if((e&1024)!==0&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,l=n.stateNode;try{var W=xl(n.type,a);e=l.getSnapshotBeforeUpdate(W,o),l.__reactInternalSnapshotBeforeUpdate=e}catch(ue){ke(n,n.return,ue)}}break;case 3:if((e&1024)!==0){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)_r(e);else if(n===1)switch(e.nodeName){case"HEAD":case"HTML":case"BODY":_r(e);break;default:e.textContent=""}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if((e&1024)!==0)throw Error(r(163))}if(e=t.sibling,e!==null){e.return=t.return,st=e;break}st=t.return}}function Bd(e,t,n){var l=n.flags;switch(n.tag){case 0:case 11:case 15:xn(e,n),l&4&&Wa(5,n);break;case 1:if(xn(e,n),l&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(c){ke(n,n.return,c)}else{var a=xl(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(a,t,e.__reactInternalSnapshotBeforeUpdate)}catch(c){ke(n,n.return,c)}}l&64&&Md(n),l&512&&$a(n,n.return);break;case 3:if(xn(e,n),l&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{Ef(e,t)}catch(c){ke(n,n.return,c)}}break;case 27:t===null&&l&4&&Yd(n);case 26:case 5:xn(e,n),t===null&&l&4&&kd(n),l&512&&$a(n,n.return);break;case 12:xn(e,n);break;case 31:xn(e,n),l&4&&qd(e,n);break;case 13:xn(e,n),l&4&&Qd(e,n),l&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=zy.bind(null,n),Iy(e,n))));break;case 22:if(l=n.memoizedState!==null||bn,!l){t=t!==null&&t.memoizedState!==null||lt,a=bn;var o=lt;bn=l,(lt=t)&&!o?Sn(e,n,(n.subtreeFlags&8772)!==0):xn(e,n),bn=a,lt=o}break;case 30:break;default:xn(e,n)}}function Hd(e){var t=e.alternate;t!==null&&(e.alternate=null,Hd(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&hu(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var Ke=null,St=!1;function vn(e,t,n){for(n=n.child;n!==null;)Xd(e,t,n),n=n.sibling}function Xd(e,t,n){if(At&&typeof At.onCommitFiberUnmount=="function")try{At.onCommitFiberUnmount(Sa,n)}catch{}switch(n.tag){case 26:lt||ln(n,t),vn(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:lt||ln(n,t);var l=Ke,a=St;Wn(n.type)&&(Ke=n.stateNode,St=!1),vn(e,t,n),ui(n.stateNode),Ke=l,St=a;break;case 5:lt||ln(n,t);case 6:if(l=Ke,a=St,Ke=null,vn(e,t,n),Ke=l,St=a,Ke!==null)if(St)try{(Ke.nodeType===9?Ke.body:Ke.nodeName==="HTML"?Ke.ownerDocument.body:Ke).removeChild(n.stateNode)}catch(o){ke(n,t,o)}else try{Ke.removeChild(n.stateNode)}catch(o){ke(n,t,o)}break;case 18:Ke!==null&&(St?(e=Ke,M_(e.nodeType===9?e.body:e.nodeName==="HTML"?e.ownerDocument.body:e,n.stateNode),fa(e)):M_(Ke,n.stateNode));break;case 4:l=Ke,a=St,Ke=n.stateNode.containerInfo,St=!0,vn(e,t,n),Ke=l,St=a;break;case 0:case 11:case 14:case 15:Gn(2,n,t),lt||Gn(4,n,t),vn(e,t,n);break;case 1:lt||(ln(n,t),l=n.stateNode,typeof l.componentWillUnmount=="function"&&Dd(n,t,l)),vn(e,t,n);break;case 21:vn(e,t,n);break;case 22:lt=(l=lt)||n.memoizedState!==null,vn(e,t,n),lt=l;break;default:vn(e,t,n)}}function qd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{fa(e)}catch(n){ke(t,t.return,n)}}}function Qd(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{fa(e)}catch(n){ke(t,t.return,n)}}function xy(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new Ld),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new Ld),t;default:throw Error(r(435,e.tag))}}function po(e,t){var n=xy(e);t.forEach(function(l){if(!n.has(l)){n.add(l);var a=Ry.bind(null,e,l);l.then(a,a)}})}function Et(e,t){var n=t.deletions;if(n!==null)for(var l=0;l<n.length;l++){var a=n[l],o=e,c=t,d=c;e:for(;d!==null;){switch(d.tag){case 27:if(Wn(d.type)){Ke=d.stateNode,St=!1;break e}break;case 5:Ke=d.stateNode,St=!1;break e;case 3:case 4:Ke=d.stateNode.containerInfo,St=!0;break e}d=d.return}if(Ke===null)throw Error(r(160));Xd(o,c,a),Ke=null,St=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Gd(t,e),t=t.sibling}var Wt=null;function Gd(e,t){var n=e.alternate,l=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Et(t,e),wt(e),l&4&&(Gn(3,e,e.return),Wa(3,e),Gn(5,e,e.return));break;case 1:Et(t,e),wt(e),l&512&&(lt||n===null||ln(n,n.return)),l&64&&bn&&(e=e.updateQueue,e!==null&&(l=e.callbacks,l!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?l:n.concat(l))));break;case 26:var a=Wt;if(Et(t,e),wt(e),l&512&&(lt||n===null||ln(n,n.return)),l&4){var o=n!==null?n.memoizedState:null;if(l=e.memoizedState,n===null)if(l===null)if(e.stateNode===null){e:{l=e.type,n=e.memoizedProps,a=a.ownerDocument||a;t:switch(l){case"title":o=a.getElementsByTagName("title")[0],(!o||o[Ta]||o[ct]||o.namespaceURI==="http://www.w3.org/2000/svg"||o.hasAttribute("itemprop"))&&(o=a.createElement(l),a.head.insertBefore(o,a.querySelector("head > title"))),mt(o,l,n),o[ct]=e,ut(o),l=o;break e;case"link":var c=G_("link","href",a).get(l+(n.href||""));if(c){for(var d=0;d<c.length;d++)if(o=c[d],o.getAttribute("href")===(n.href==null||n.href===""?null:n.href)&&o.getAttribute("rel")===(n.rel==null?null:n.rel)&&o.getAttribute("title")===(n.title==null?null:n.title)&&o.getAttribute("crossorigin")===(n.crossOrigin==null?null:n.crossOrigin)){c.splice(d,1);break t}}o=a.createElement(l),mt(o,l,n),a.head.appendChild(o);break;case"meta":if(c=G_("meta","content",a).get(l+(n.content||""))){for(d=0;d<c.length;d++)if(o=c[d],o.getAttribute("content")===(n.content==null?null:""+n.content)&&o.getAttribute("name")===(n.name==null?null:n.name)&&o.getAttribute("property")===(n.property==null?null:n.property)&&o.getAttribute("http-equiv")===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute("charset")===(n.charSet==null?null:n.charSet)){c.splice(d,1);break t}}o=a.createElement(l),mt(o,l,n),a.head.appendChild(o);break;default:throw Error(r(468,l))}o[ct]=e,ut(o),l=o}e.stateNode=l}else V_(a,e.type,e.stateNode);else e.stateNode=Q_(a,l,e.memoizedProps);else o!==l?(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,l===null?V_(a,e.type,e.stateNode):Q_(a,l,e.memoizedProps)):l===null&&e.stateNode!==null&&Bs(e,e.memoizedProps,n.memoizedProps)}break;case 27:Et(t,e),wt(e),l&512&&(lt||n===null||ln(n,n.return)),n!==null&&l&4&&Bs(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Et(t,e),wt(e),l&512&&(lt||n===null||ln(n,n.return)),e.flags&32){a=e.stateNode;try{Dl(a,"")}catch(W){ke(e,e.return,W)}}l&4&&e.stateNode!=null&&(a=e.memoizedProps,Bs(e,a,n!==null?n.memoizedProps:a)),l&1024&&(qs=!0);break;case 6:if(Et(t,e),wt(e),l&4){if(e.stateNode===null)throw Error(r(162));l=e.memoizedProps,n=e.stateNode;try{n.nodeValue=l}catch(W){ke(e,e.return,W)}}break;case 3:if(Mo=null,a=Wt,Wt=No(t.containerInfo),Et(t,e),Wt=a,wt(e),l&4&&n!==null&&n.memoizedState.isDehydrated)try{fa(t.containerInfo)}catch(W){ke(e,e.return,W)}qs&&(qs=!1,Vd(e));break;case 4:l=Wt,Wt=No(e.stateNode.containerInfo),Et(t,e),wt(e),Wt=l;break;case 12:Et(t,e),wt(e);break;case 31:Et(t,e),wt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,po(e,l)));break;case 13:Et(t,e),wt(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(bo=Ye()),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,po(e,l)));break;case 22:a=e.memoizedState!==null;var p=n!==null&&n.memoizedState!==null,C=bn,M=lt;if(bn=C||a,lt=M||p,Et(t,e),lt=M,bn=C,wt(e),l&8192)e:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||p||bn||lt||Sl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){p=n=t;try{if(o=p.stateNode,a)c=o.style,typeof c.setProperty=="function"?c.setProperty("display","none","important"):c.display="none";else{d=p.stateNode;var Y=p.memoizedProps.style,O=Y!=null&&Y.hasOwnProperty("display")?Y.display:null;d.style.display=O==null||typeof O=="boolean"?"":(""+O).trim()}}catch(W){ke(p,p.return,W)}}}else if(t.tag===6){if(n===null){p=t;try{p.stateNode.nodeValue=a?"":p.memoizedProps}catch(W){ke(p,p.return,W)}}}else if(t.tag===18){if(n===null){p=t;try{var R=p.stateNode;a?D_(R,!0):D_(p.stateNode,!1)}catch(W){ke(p,p.return,W)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}l&4&&(l=e.updateQueue,l!==null&&(n=l.retryQueue,n!==null&&(l.retryQueue=null,po(e,n))));break;case 19:Et(t,e),wt(e),l&4&&(l=e.updateQueue,l!==null&&(e.updateQueue=null,po(e,l)));break;case 30:break;case 21:break;default:Et(t,e),wt(e)}}function wt(e){var t=e.flags;if(t&2){try{for(var n,l=e.return;l!==null;){if(Ud(l)){n=l;break}l=l.return}if(n==null)throw Error(r(160));switch(n.tag){case 27:var a=n.stateNode,o=Hs(e);yo(e,o,a);break;case 5:var c=n.stateNode;n.flags&32&&(Dl(c,""),n.flags&=-33);var d=Hs(e);yo(e,d,c);break;case 3:case 4:var p=n.stateNode.containerInfo,C=Hs(e);Xs(e,C,p);break;default:throw Error(r(161))}}catch(M){ke(e,e.return,M)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Vd(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Vd(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function xn(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)Bd(e,t.alternate,t),t=t.sibling}function Sl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Gn(4,t,t.return),Sl(t);break;case 1:ln(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount=="function"&&Dd(t,t.return,n),Sl(t);break;case 27:ui(t.stateNode);case 26:case 5:ln(t,t.return),Sl(t);break;case 22:t.memoizedState===null&&Sl(t);break;case 30:Sl(t);break;default:Sl(t)}e=e.sibling}}function Sn(e,t,n){for(n=n&&(t.subtreeFlags&8772)!==0,t=t.child;t!==null;){var l=t.alternate,a=e,o=t,c=o.flags;switch(o.tag){case 0:case 11:case 15:Sn(a,o,n),Wa(4,o);break;case 1:if(Sn(a,o,n),l=o,a=l.stateNode,typeof a.componentDidMount=="function")try{a.componentDidMount()}catch(C){ke(l,l.return,C)}if(l=o,a=l.updateQueue,a!==null){var d=l.stateNode;try{var p=a.shared.hiddenCallbacks;if(p!==null)for(a.shared.hiddenCallbacks=null,a=0;a<p.length;a++)Sf(p[a],d)}catch(C){ke(l,l.return,C)}}n&&c&64&&Md(o),$a(o,o.return);break;case 27:Yd(o);case 26:case 5:Sn(a,o,n),n&&l===null&&c&4&&kd(o),$a(o,o.return);break;case 12:Sn(a,o,n);break;case 31:Sn(a,o,n),n&&c&4&&qd(a,o);break;case 13:Sn(a,o,n),n&&c&4&&Qd(a,o);break;case 22:o.memoizedState===null&&Sn(a,o,n),$a(o,o.return);break;case 30:break;default:Sn(a,o,n)}t=t.sibling}}function Qs(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&La(n))}function Gs(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&La(e))}function $t(e,t,n,l){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Zd(e,t,n,l),t=t.sibling}function Zd(e,t,n,l){var a=t.flags;switch(t.tag){case 0:case 11:case 15:$t(e,t,n,l),a&2048&&Wa(9,t);break;case 1:$t(e,t,n,l);break;case 3:$t(e,t,n,l),a&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&La(e)));break;case 12:if(a&2048){$t(e,t,n,l),e=t.stateNode;try{var o=t.memoizedProps,c=o.id,d=o.onPostCommit;typeof d=="function"&&d(c,t.alternate===null?"mount":"update",e.passiveEffectDuration,-0)}catch(p){ke(t,t.return,p)}}else $t(e,t,n,l);break;case 31:$t(e,t,n,l);break;case 13:$t(e,t,n,l);break;case 23:break;case 22:o=t.stateNode,c=t.alternate,t.memoizedState!==null?o._visibility&2?$t(e,t,n,l):Pa(e,t):o._visibility&2?$t(e,t,n,l):(o._visibility|=2,ea(e,t,n,l,(t.subtreeFlags&10256)!==0||!1)),a&2048&&Qs(c,t);break;case 24:$t(e,t,n,l),a&2048&&Gs(t.alternate,t);break;default:$t(e,t,n,l)}}function ea(e,t,n,l,a){for(a=a&&((t.subtreeFlags&10256)!==0||!1),t=t.child;t!==null;){var o=e,c=t,d=n,p=l,C=c.flags;switch(c.tag){case 0:case 11:case 15:ea(o,c,d,p,a),Wa(8,c);break;case 23:break;case 22:var M=c.stateNode;c.memoizedState!==null?M._visibility&2?ea(o,c,d,p,a):Pa(o,c):(M._visibility|=2,ea(o,c,d,p,a)),a&&C&2048&&Qs(c.alternate,c);break;case 24:ea(o,c,d,p,a),a&&C&2048&&Gs(c.alternate,c);break;default:ea(o,c,d,p,a)}t=t.sibling}}function Pa(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,l=t,a=l.flags;switch(l.tag){case 22:Pa(n,l),a&2048&&Qs(l.alternate,l);break;case 24:Pa(n,l),a&2048&&Gs(l.alternate,l);break;default:Pa(n,l)}t=t.sibling}}var ei=8192;function ta(e,t,n){if(e.subtreeFlags&ei)for(e=e.child;e!==null;)Kd(e,t,n),e=e.sibling}function Kd(e,t,n){switch(e.tag){case 26:ta(e,t,n),e.flags&ei&&e.memoizedState!==null&&up(n,Wt,e.memoizedState,e.memoizedProps);break;case 5:ta(e,t,n);break;case 3:case 4:var l=Wt;Wt=No(e.stateNode.containerInfo),ta(e,t,n),Wt=l;break;case 22:e.memoizedState===null&&(l=e.alternate,l!==null&&l.memoizedState!==null?(l=ei,ei=16777216,ta(e,t,n),ei=l):ta(e,t,n));break;default:ta(e,t,n)}}function Jd(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function ti(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];st=l,Fd(l,e)}Jd(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)Id(e),e=e.sibling}function Id(e){switch(e.tag){case 0:case 11:case 15:ti(e),e.flags&2048&&Gn(9,e,e.return);break;case 3:ti(e);break;case 12:ti(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,ho(e)):ti(e);break;default:ti(e)}}function ho(e){var t=e.deletions;if((e.flags&16)!==0){if(t!==null)for(var n=0;n<t.length;n++){var l=t[n];st=l,Fd(l,e)}Jd(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Gn(8,t,t.return),ho(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,ho(t));break;default:ho(t)}e=e.sibling}}function Fd(e,t){for(;st!==null;){var n=st;switch(n.tag){case 0:case 11:case 15:Gn(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var l=n.memoizedState.cachePool.pool;l!=null&&l.refCount++}break;case 24:La(n.memoizedState.cache)}if(l=n.child,l!==null)l.return=n,st=l;else e:for(n=e;st!==null;){l=st;var a=l.sibling,o=l.return;if(Hd(l),l===n){st=null;break e}if(a!==null){a.return=o,st=a;break e}st=o}}}var Sy={getCacheForType:function(e){var t=dt(et),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return dt(et).controller.signal}},Ey=typeof WeakMap=="function"?WeakMap:Map,Ne=0,qe=null,xe=null,we=0,De=0,Dt=null,Vn=!1,na=!1,Vs=!1,En=0,Fe=0,Zn=0,El=0,Zs=0,kt=0,la=0,ni=null,Tt=null,Ks=!1,bo=0,Wd=0,vo=1/0,xo=null,Kn=null,ot=0,Jn=null,aa=null,wn=0,Js=0,Is=null,$d=null,li=0,Fs=null;function Ut(){return(Ne&2)!==0&&we!==0?we&-we:N.T!==null?nr():_c()}function Pd(){if(kt===0)if((we&536870912)===0||Oe){var e=Ai;Ai<<=1,(Ai&3932160)===0&&(Ai=262144),kt=e}else kt=536870912;return e=jt.current,e!==null&&(e.flags|=32),kt}function Ct(e,t,n){(e===qe&&(De===2||De===9)||e.cancelPendingCommit!==null)&&(ia(e,0),In(e,we,kt,!1)),wa(e,n),((Ne&2)===0||e!==qe)&&(e===qe&&((Ne&2)===0&&(El|=n),Fe===4&&In(e,we,kt,!1)),an(e))}function e_(e,t,n){if((Ne&6)!==0)throw Error(r(327));var l=!n&&(t&127)===0&&(t&e.expiredLanes)===0||Ea(e,t),a=l?Cy(e,t):$s(e,t,!0),o=l;do{if(a===0){na&&!l&&In(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!wy(n)){a=$s(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var c=0;else c=e.pendingLanes&-536870913,c=c!==0?c:c&536870912?536870912:0;if(c!==0){t=c;e:{var d=e;a=ni;var p=d.current.memoizedState.isDehydrated;if(p&&(ia(d,c).flags|=256),c=$s(d,c,!1),c!==2){if(Vs&&!p){d.errorRecoveryDisabledLanes|=o,El|=o,a=4;break e}o=Tt,Tt=a,o!==null&&(Tt===null?Tt=o:Tt.push.apply(Tt,o))}a=c}if(o=!1,a!==2)continue}}if(a===1){ia(e,0),In(e,t,0,!0);break}e:{switch(l=e,o=a,o){case 0:case 1:throw Error(r(345));case 4:if((t&4194048)!==t)break;case 6:In(l,t,kt,!Vn);break e;case 2:Tt=null;break;case 3:case 5:break;default:throw Error(r(329))}if((t&62914560)===t&&(a=bo+300-Ye(),10<a)){if(In(l,t,kt,!Vn),Ri(l,0,!0)!==0)break e;wn=t,l.timeoutHandle=N_(t_.bind(null,l,n,Tt,xo,Ks,t,kt,El,la,Vn,o,"Throttled",-0,0),a);break e}t_(l,n,Tt,xo,Ks,t,kt,El,la,Vn,o,null,-0,0)}}break}while(!0);an(e)}function t_(e,t,n,l,a,o,c,d,p,C,M,Y,O,R){if(e.timeoutHandle=-1,Y=t.subtreeFlags,Y&8192||(Y&16785408)===16785408){Y={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:rn},Kd(t,o,Y);var W=(o&62914560)===o?bo-Ye():(o&4194048)===o?Wd-Ye():0;if(W=sp(Y,W),W!==null){wn=o,e.cancelPendingCommit=W(r_.bind(null,e,t,o,n,l,a,c,d,p,M,Y,null,O,R)),In(e,o,c,!C);return}}r_(e,t,o,n,l,a,c,d,p)}function wy(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var l=0;l<n.length;l++){var a=n[l],o=a.getSnapshot;a=a.value;try{if(!Rt(o(),a))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function In(e,t,n,l){t&=~Zs,t&=~El,e.suspendedLanes|=t,e.pingedLanes&=~t,l&&(e.warmLanes|=t),l=e.expirationTimes;for(var a=t;0<a;){var o=31-zt(a),c=1<<o;l[o]=-1,a&=~c}n!==0&&cc(e,n,t)}function So(){return(Ne&6)===0?(ai(0),!1):!0}function Ws(){if(xe!==null){if(De===0)var e=xe.return;else e=xe,_n=ml=null,_s(e),Il=null,Ha=0,e=xe;for(;e!==null;)jd(e.alternate,e),e=e.return;xe=null}}function ia(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,Gy(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),wn=0,Ws(),qe=e,xe=n=fn(e.current,null),we=t,De=0,Dt=null,Vn=!1,na=Ea(e,t),Vs=!1,la=kt=Zs=El=Zn=Fe=0,Tt=ni=null,Ks=!1,(t&8)!==0&&(t|=t&32);var l=e.entangledLanes;if(l!==0)for(e=e.entanglements,l&=t;0<l;){var a=31-zt(l),o=1<<a;t|=e[a],l&=~o}return En=t,qi(),n}function n_(e,t){ye=null,N.H=Ja,t===Jl||t===Fi?(t=hf(),De=3):t===ts?(t=hf(),De=4):De=t===zs?8:t!==null&&typeof t=="object"&&typeof t.then=="function"?6:1,Dt=t,xe===null&&(Fe=1,co(e,Xt(t,e.current)))}function l_(){var e=jt.current;return e===null?!0:(we&4194048)===we?Vt===null:(we&62914560)===we||(we&536870912)!==0?e===Vt:!1}function a_(){var e=N.H;return N.H=Ja,e===null?Ja:e}function i_(){var e=N.A;return N.A=Sy,e}function Eo(){Fe=4,Vn||(we&4194048)!==we&&jt.current!==null||(na=!0),(Zn&134217727)===0&&(El&134217727)===0||qe===null||In(qe,we,kt,!1)}function $s(e,t,n){var l=Ne;Ne|=2;var a=a_(),o=i_();(qe!==e||we!==t)&&(xo=null,ia(e,t)),t=!1;var c=Fe;e:do try{if(De!==0&&xe!==null){var d=xe,p=Dt;switch(De){case 8:Ws(),c=6;break e;case 3:case 2:case 9:case 6:jt.current===null&&(t=!0);var C=De;if(De=0,Dt=null,oa(e,d,p,C),n&&na){c=0;break e}break;default:C=De,De=0,Dt=null,oa(e,d,p,C)}}Ty(),c=Fe;break}catch(M){n_(e,M)}while(!0);return t&&e.shellSuspendCounter++,_n=ml=null,Ne=l,N.H=a,N.A=o,xe===null&&(qe=null,we=0,qi()),c}function Ty(){for(;xe!==null;)o_(xe)}function Cy(e,t){var n=Ne;Ne|=2;var l=a_(),a=i_();qe!==e||we!==t?(xo=null,vo=Ye()+500,ia(e,t)):na=Ea(e,t);e:do try{if(De!==0&&xe!==null){t=xe;var o=Dt;t:switch(De){case 1:De=0,Dt=null,oa(e,t,o,1);break;case 2:case 9:if(yf(o)){De=0,Dt=null,u_(t);break}t=function(){De!==2&&De!==9||qe!==e||(De=7),an(e)},o.then(t,t);break e;case 3:De=7;break e;case 4:De=5;break e;case 7:yf(o)?(De=0,Dt=null,u_(t)):(De=0,Dt=null,oa(e,t,o,7));break;case 5:var c=null;switch(xe.tag){case 26:c=xe.memoizedState;case 5:case 27:var d=xe;if(c?Z_(c):d.stateNode.complete){De=0,Dt=null;var p=d.sibling;if(p!==null)xe=p;else{var C=d.return;C!==null?(xe=C,wo(C)):xe=null}break t}}De=0,Dt=null,oa(e,t,o,5);break;case 6:De=0,Dt=null,oa(e,t,o,6);break;case 8:Ws(),Fe=6;break e;default:throw Error(r(462))}}Oy();break}catch(M){n_(e,M)}while(!0);return _n=ml=null,N.H=l,N.A=a,Ne=n,xe!==null?0:(qe=null,we=0,qi(),Fe)}function Oy(){for(;xe!==null&&!fe();)o_(xe)}function o_(e){var t=Rd(e.alternate,e,En);e.memoizedProps=e.pendingProps,t===null?wo(e):xe=t}function u_(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=wd(n,t,t.pendingProps,t.type,void 0,we);break;case 11:t=wd(n,t,t.pendingProps,t.type.render,t.ref,we);break;case 5:_s(t);default:jd(n,t),t=xe=af(t,En),t=Rd(n,t,En)}e.memoizedProps=e.pendingProps,t===null?wo(e):xe=t}function oa(e,t,n,l){_n=ml=null,_s(t),Il=null,Ha=0;var a=t.return;try{if(gy(e,a,t,n,we)){Fe=1,co(e,Xt(n,e.current)),xe=null;return}}catch(o){if(a!==null)throw xe=a,o;Fe=1,co(e,Xt(n,e.current)),xe=null;return}t.flags&32768?(Oe||l===1?e=!0:na||(we&536870912)!==0?e=!1:(Vn=e=!0,(l===2||l===9||l===3||l===6)&&(l=jt.current,l!==null&&l.tag===13&&(l.flags|=16384))),s_(t,e)):wo(t)}function wo(e){var t=e;do{if((t.flags&32768)!==0){s_(t,Vn);return}e=t.return;var n=hy(t.alternate,t,En);if(n!==null){xe=n;return}if(t=t.sibling,t!==null){xe=t;return}xe=t=e}while(t!==null);Fe===0&&(Fe=5)}function s_(e,t){do{var n=by(e.alternate,e);if(n!==null){n.flags&=32767,xe=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){xe=e;return}xe=e=n}while(e!==null);Fe=6,xe=null}function r_(e,t,n,l,a,o,c,d,p){e.cancelPendingCommit=null;do To();while(ot!==0);if((Ne&6)!==0)throw Error(r(327));if(t!==null){if(t===e.current)throw Error(r(177));if(o=t.lanes|t.childLanes,o|=Hu,og(e,n,o,c,d,p),e===qe&&(xe=qe=null,we=0),aa=t,Jn=e,wn=n,Js=o,Is=a,$d=l,(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?(e.callbackNode=null,e.callbackPriority=0,Ny(Rn,function(){return m_(),null})):(e.callbackNode=null,e.callbackPriority=0),l=(t.flags&13878)!==0,(t.subtreeFlags&13878)!==0||l){l=N.T,N.T=null,a=q.p,q.p=2,c=Ne,Ne|=4;try{vy(e,t,n)}finally{Ne=c,q.p=a,N.T=l}}ot=1,c_(),f_(),d_()}}function c_(){if(ot===1){ot=0;var e=Jn,t=aa,n=(t.flags&13878)!==0;if((t.subtreeFlags&13878)!==0||n){n=N.T,N.T=null;var l=q.p;q.p=2;var a=Ne;Ne|=4;try{Gd(t,e);var o=cr,c=Ic(e.containerInfo),d=o.focusedElem,p=o.selectionRange;if(c!==d&&d&&d.ownerDocument&&Jc(d.ownerDocument.documentElement,d)){if(p!==null&&ku(d)){var C=p.start,M=p.end;if(M===void 0&&(M=C),"selectionStart"in d)d.selectionStart=C,d.selectionEnd=Math.min(M,d.value.length);else{var Y=d.ownerDocument||document,O=Y&&Y.defaultView||window;if(O.getSelection){var R=O.getSelection(),W=d.textContent.length,ue=Math.min(p.start,W),He=p.end===void 0?ue:Math.min(p.end,W);!R.extend&&ue>He&&(c=He,He=ue,ue=c);var S=Kc(d,ue),v=Kc(d,He);if(S&&v&&(R.rangeCount!==1||R.anchorNode!==S.node||R.anchorOffset!==S.offset||R.focusNode!==v.node||R.focusOffset!==v.offset)){var T=Y.createRange();T.setStart(S.node,S.offset),R.removeAllRanges(),ue>He?(R.addRange(T),R.extend(v.node,v.offset)):(T.setEnd(v.node,v.offset),R.addRange(T))}}}}for(Y=[],R=d;R=R.parentNode;)R.nodeType===1&&Y.push({element:R,left:R.scrollLeft,top:R.scrollTop});for(typeof d.focus=="function"&&d.focus(),d=0;d<Y.length;d++){var k=Y[d];k.element.scrollLeft=k.left,k.element.scrollTop=k.top}}Yo=!!rr,cr=rr=null}finally{Ne=a,q.p=l,N.T=n}}e.current=t,ot=2}}function f_(){if(ot===2){ot=0;var e=Jn,t=aa,n=(t.flags&8772)!==0;if((t.subtreeFlags&8772)!==0||n){n=N.T,N.T=null;var l=q.p;q.p=2;var a=Ne;Ne|=4;try{Bd(e,t.alternate,t)}finally{Ne=a,q.p=l,N.T=n}}ot=3}}function d_(){if(ot===4||ot===3){ot=0,pt();var e=Jn,t=aa,n=wn,l=$d;(t.subtreeFlags&10256)!==0||(t.flags&10256)!==0?ot=5:(ot=0,aa=Jn=null,__(e,e.pendingLanes));var a=e.pendingLanes;if(a===0&&(Kn=null),yu(n),t=t.stateNode,At&&typeof At.onCommitFiberRoot=="function")try{At.onCommitFiberRoot(Sa,t,void 0,(t.current.flags&128)===128)}catch{}if(l!==null){t=N.T,a=q.p,q.p=2,N.T=null;try{for(var o=e.onRecoverableError,c=0;c<l.length;c++){var d=l[c];o(d.value,{componentStack:d.stack})}}finally{N.T=t,q.p=a}}(wn&3)!==0&&To(),an(e),a=e.pendingLanes,(n&261930)!==0&&(a&42)!==0?e===Fs?li++:(li=0,Fs=e):li=0,ai(0)}}function __(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,La(t)))}function To(){return c_(),f_(),d_(),m_()}function m_(){if(ot!==5)return!1;var e=Jn,t=Js;Js=0;var n=yu(wn),l=N.T,a=q.p;try{q.p=32>n?32:n,N.T=null,n=Is,Is=null;var o=Jn,c=wn;if(ot=0,aa=Jn=null,wn=0,(Ne&6)!==0)throw Error(r(331));var d=Ne;if(Ne|=4,Id(o.current),Zd(o,o.current,c,n),Ne=d,ai(0,!1),At&&typeof At.onPostCommitFiberRoot=="function")try{At.onPostCommitFiberRoot(Sa,o)}catch{}return!0}finally{q.p=a,N.T=l,__(e,t)}}function g_(e,t,n){t=Xt(n,t),t=As(e.stateNode,t,2),e=Xn(e,t,2),e!==null&&(wa(e,2),an(e))}function ke(e,t,n){if(e.tag===3)g_(e,e,n);else for(;t!==null;){if(t.tag===3){g_(t,e,n);break}else if(t.tag===1){var l=t.stateNode;if(typeof t.type.getDerivedStateFromError=="function"||typeof l.componentDidCatch=="function"&&(Kn===null||!Kn.has(l))){e=Xt(n,e),n=yd(2),l=Xn(t,n,2),l!==null&&(pd(n,l,t,e),wa(l,2),an(l));break}}t=t.return}}function Ps(e,t,n){var l=e.pingCache;if(l===null){l=e.pingCache=new Ey;var a=new Set;l.set(t,a)}else a=l.get(t),a===void 0&&(a=new Set,l.set(t,a));a.has(n)||(Vs=!0,a.add(n),e=Ay.bind(null,e,t,n),t.then(e,e))}function Ay(e,t,n){var l=e.pingCache;l!==null&&l.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,qe===e&&(we&n)===n&&(Fe===4||Fe===3&&(we&62914560)===we&&300>Ye()-bo?(Ne&2)===0&&ia(e,0):Zs|=n,la===we&&(la=0)),an(e)}function y_(e,t){t===0&&(t=rc()),e=fl(e,t),e!==null&&(wa(e,t),an(e))}function zy(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),y_(e,n)}function Ry(e,t){var n=0;switch(e.tag){case 31:case 13:var l=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:l=e.stateNode;break;case 22:l=e.stateNode._retryCache;break;default:throw Error(r(314))}l!==null&&l.delete(t),y_(e,n)}function Ny(e,t){return Ge(e,t)}var Co=null,ua=null,er=!1,Oo=!1,tr=!1,Fn=0;function an(e){e!==ua&&e.next===null&&(ua===null?Co=ua=e:ua=ua.next=e),Oo=!0,er||(er=!0,My())}function ai(e,t){if(!tr&&Oo){tr=!0;do for(var n=!1,l=Co;l!==null;){if(e!==0){var a=l.pendingLanes;if(a===0)var o=0;else{var c=l.suspendedLanes,d=l.pingedLanes;o=(1<<31-zt(42|e)+1)-1,o&=a&~(c&~d),o=o&201326741?o&201326741|1:o?o|2:0}o!==0&&(n=!0,v_(l,o))}else o=we,o=Ri(l,l===qe?o:0,l.cancelPendingCommit!==null||l.timeoutHandle!==-1),(o&3)===0||Ea(l,o)||(n=!0,v_(l,o));l=l.next}while(n);tr=!1}}function jy(){p_()}function p_(){Oo=er=!1;var e=0;Fn!==0&&Qy()&&(e=Fn);for(var t=Ye(),n=null,l=Co;l!==null;){var a=l.next,o=h_(l,t);o===0?(l.next=null,n===null?Co=a:n.next=a,a===null&&(ua=n)):(n=l,(e!==0||(o&3)!==0)&&(Oo=!0)),l=a}ot!==0&&ot!==5||ai(e),Fn!==0&&(Fn=0)}function h_(e,t){for(var n=e.suspendedLanes,l=e.pingedLanes,a=e.expirationTimes,o=e.pendingLanes&-62914561;0<o;){var c=31-zt(o),d=1<<c,p=a[c];p===-1?((d&n)===0||(d&l)!==0)&&(a[c]=ig(d,t)):p<=t&&(e.expiredLanes|=d),o&=~d}if(t=qe,n=we,n=Ri(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l=e.callbackNode,n===0||e===t&&(De===2||De===9)||e.cancelPendingCommit!==null)return l!==null&&l!==null&&_e(l),e.callbackNode=null,e.callbackPriority=0;if((n&3)===0||Ea(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(l!==null&&_e(l),yu(n)){case 2:case 8:n=Cl;break;case 32:n=Rn;break;case 268435456:n=Nn;break;default:n=Rn}return l=b_.bind(null,e),n=Ge(n,l),e.callbackPriority=t,e.callbackNode=n,t}return l!==null&&l!==null&&_e(l),e.callbackPriority=2,e.callbackNode=null,2}function b_(e,t){if(ot!==0&&ot!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(To()&&e.callbackNode!==n)return null;var l=we;return l=Ri(e,e===qe?l:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),l===0?null:(e_(e,l,t),h_(e,Ye()),e.callbackNode!=null&&e.callbackNode===n?b_.bind(null,e):null)}function v_(e,t){if(To())return null;e_(e,t,!0)}function My(){Vy(function(){(Ne&6)!==0?Ge(il,jy):p_()})}function nr(){if(Fn===0){var e=Zl;e===0&&(e=Oi,Oi<<=1,(Oi&261888)===0&&(Oi=256)),Fn=e}return Fn}function x_(e){return e==null||typeof e=="symbol"||typeof e=="boolean"?null:typeof e=="function"?e:Di(""+e)}function S_(e,t){var n=t.ownerDocument.createElement("input");return n.name=t.name,n.value=t.value,e.id&&n.setAttribute("form",e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function Dy(e,t,n,l,a){if(t==="submit"&&n&&n.stateNode===a){var o=x_((a[vt]||null).action),c=l.submitter;c&&(t=(t=c[vt]||null)?x_(t.formAction):c.getAttribute("formAction"),t!==null&&(o=t,c=null));var d=new Li("action","action",null,l,a);e.push({event:d,listeners:[{instance:null,listener:function(){if(l.defaultPrevented){if(Fn!==0){var p=c?S_(a,c):new FormData(a);Ss(n,{pending:!0,data:p,method:a.method,action:o},null,p)}}else typeof o=="function"&&(d.preventDefault(),p=c?S_(a,c):new FormData(a),Ss(n,{pending:!0,data:p,method:a.method,action:o},o,p))},currentTarget:a}]})}}for(var lr=0;lr<Bu.length;lr++){var ar=Bu[lr],ky=ar.toLowerCase(),Uy=ar[0].toUpperCase()+ar.slice(1);Ft(ky,"on"+Uy)}Ft($c,"onAnimationEnd"),Ft(Pc,"onAnimationIteration"),Ft(ef,"onAnimationStart"),Ft("dblclick","onDoubleClick"),Ft("focusin","onFocus"),Ft("focusout","onBlur"),Ft($g,"onTransitionRun"),Ft(Pg,"onTransitionStart"),Ft(ey,"onTransitionCancel"),Ft(tf,"onTransitionEnd"),jl("onMouseEnter",["mouseout","mouseover"]),jl("onMouseLeave",["mouseout","mouseover"]),jl("onPointerEnter",["pointerout","pointerover"]),jl("onPointerLeave",["pointerout","pointerover"]),ul("onChange","change click focusin focusout input keydown keyup selectionchange".split(" ")),ul("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")),ul("onBeforeInput",["compositionend","keypress","textInput","paste"]),ul("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" ")),ul("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" ")),ul("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var ii="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Yy=new Set("beforetoggle cancel close invalid load scroll scrollend toggle".split(" ").concat(ii));function E_(e,t){t=(t&4)!==0;for(var n=0;n<e.length;n++){var l=e[n],a=l.event;l=l.listeners;e:{var o=void 0;if(t)for(var c=l.length-1;0<=c;c--){var d=l[c],p=d.instance,C=d.currentTarget;if(d=d.listener,p!==o&&a.isPropagationStopped())break e;o=d,a.currentTarget=C;try{o(a)}catch(M){Xi(M)}a.currentTarget=null,o=p}else for(c=0;c<l.length;c++){if(d=l[c],p=d.instance,C=d.currentTarget,d=d.listener,p!==o&&a.isPropagationStopped())break e;o=d,a.currentTarget=C;try{o(a)}catch(M){Xi(M)}a.currentTarget=null,o=p}}}}function Se(e,t){var n=t[pu];n===void 0&&(n=t[pu]=new Set);var l=e+"__bubble";n.has(l)||(w_(t,e,2,!1),n.add(l))}function ir(e,t,n){var l=0;t&&(l|=4),w_(n,e,l,t)}var Ao="_reactListening"+Math.random().toString(36).slice(2);function or(e){if(!e[Ao]){e[Ao]=!0,yc.forEach(function(n){n!=="selectionchange"&&(Yy.has(n)||ir(n,!1,e),ir(n,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[Ao]||(t[Ao]=!0,ir("selectionchange",!1,t))}}function w_(e,t,n,l){switch(P_(t)){case 2:var a=fp;break;case 8:a=dp;break;default:a=xr}n=a.bind(null,t,n,e),a=void 0,!Cu||t!=="touchstart"&&t!=="touchmove"&&t!=="wheel"||(a=!0),l?a!==void 0?e.addEventListener(t,n,{capture:!0,passive:a}):e.addEventListener(t,n,!0):a!==void 0?e.addEventListener(t,n,{passive:a}):e.addEventListener(t,n,!1)}function ur(e,t,n,l,a){var o=l;if((t&1)===0&&(t&2)===0&&l!==null)e:for(;;){if(l===null)return;var c=l.tag;if(c===3||c===4){var d=l.stateNode.containerInfo;if(d===a)break;if(c===4)for(c=l.return;c!==null;){var p=c.tag;if((p===3||p===4)&&c.stateNode.containerInfo===a)return;c=c.return}for(;d!==null;){if(c=zl(d),c===null)return;if(p=c.tag,p===5||p===6||p===26||p===27){l=o=c;continue e}d=d.parentNode}}l=l.return}Ac(function(){var C=o,M=wu(n),Y=[];e:{var O=nf.get(e);if(O!==void 0){var R=Li,W=e;switch(e){case"keypress":if(Ui(n)===0)break e;case"keydown":case"keyup":R=Rg;break;case"focusin":W="focus",R=Ru;break;case"focusout":W="blur",R=Ru;break;case"beforeblur":case"afterblur":R=Ru;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":R=Nc;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":R=hg;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":R=Mg;break;case $c:case Pc:case ef:R=xg;break;case tf:R=kg;break;case"scroll":case"scrollend":R=yg;break;case"wheel":R=Yg;break;case"copy":case"cut":case"paste":R=Eg;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":R=Mc;break;case"toggle":case"beforetoggle":R=Bg}var ue=(t&4)!==0,He=!ue&&(e==="scroll"||e==="scrollend"),S=ue?O!==null?O+"Capture":null:O;ue=[];for(var v=C,T;v!==null;){var k=v;if(T=k.stateNode,k=k.tag,k!==5&&k!==26&&k!==27||T===null||S===null||(k=Oa(v,S),k!=null&&ue.push(oi(v,k,T))),He)break;v=v.return}0<ue.length&&(O=new R(O,W,null,n,M),Y.push({event:O,listeners:ue}))}}if((t&7)===0){e:{if(O=e==="mouseover"||e==="pointerover",R=e==="mouseout"||e==="pointerout",O&&n!==Eu&&(W=n.relatedTarget||n.fromElement)&&(zl(W)||W[Al]))break e;if((R||O)&&(O=M.window===M?M:(O=M.ownerDocument)?O.defaultView||O.parentWindow:window,R?(W=n.relatedTarget||n.toElement,R=C,W=W?zl(W):null,W!==null&&(He=_(W),ue=W.tag,W!==He||ue!==5&&ue!==27&&ue!==6)&&(W=null)):(R=null,W=C),R!==W)){if(ue=Nc,k="onMouseLeave",S="onMouseEnter",v="mouse",(e==="pointerout"||e==="pointerover")&&(ue=Mc,k="onPointerLeave",S="onPointerEnter",v="pointer"),He=R==null?O:Ca(R),T=W==null?O:Ca(W),O=new ue(k,v+"leave",R,n,M),O.target=He,O.relatedTarget=T,k=null,zl(M)===C&&(ue=new ue(S,v+"enter",W,n,M),ue.target=T,ue.relatedTarget=He,k=ue),He=k,R&&W)t:{for(ue=Ly,S=R,v=W,T=0,k=S;k;k=ue(k))T++;k=0;for(var ie=v;ie;ie=ue(ie))k++;for(;0<T-k;)S=ue(S),T--;for(;0<k-T;)v=ue(v),k--;for(;T--;){if(S===v||v!==null&&S===v.alternate){ue=S;break t}S=ue(S),v=ue(v)}ue=null}else ue=null;R!==null&&T_(Y,O,R,ue,!1),W!==null&&He!==null&&T_(Y,He,W,ue,!0)}}e:{if(O=C?Ca(C):window,R=O.nodeName&&O.nodeName.toLowerCase(),R==="select"||R==="input"&&O.type==="file")var ze=Xc;else if(Bc(O))if(qc)ze=Ig;else{ze=Kg;var P=Zg}else R=O.nodeName,!R||R.toLowerCase()!=="input"||O.type!=="checkbox"&&O.type!=="radio"?C&&Su(C.elementType)&&(ze=Xc):ze=Jg;if(ze&&(ze=ze(e,C))){Hc(Y,ze,n,M);break e}P&&P(e,O,C),e==="focusout"&&C&&O.type==="number"&&C.memoizedProps.value!=null&&xu(O,"number",O.value)}switch(P=C?Ca(C):window,e){case"focusin":(Bc(P)||P.contentEditable==="true")&&(Ll=P,Uu=C,ka=null);break;case"focusout":ka=Uu=Ll=null;break;case"mousedown":Yu=!0;break;case"contextmenu":case"mouseup":case"dragend":Yu=!1,Fc(Y,n,M);break;case"selectionchange":if(Wg)break;case"keydown":case"keyup":Fc(Y,n,M)}var he;if(ju)e:{switch(e){case"compositionstart":var Te="onCompositionStart";break e;case"compositionend":Te="onCompositionEnd";break e;case"compositionupdate":Te="onCompositionUpdate";break e}Te=void 0}else Yl?Yc(e,n)&&(Te="onCompositionEnd"):e==="keydown"&&n.keyCode===229&&(Te="onCompositionStart");Te&&(Dc&&n.locale!=="ko"&&(Yl||Te!=="onCompositionStart"?Te==="onCompositionEnd"&&Yl&&(he=zc()):(Dn=M,Ou="value"in Dn?Dn.value:Dn.textContent,Yl=!0)),P=zo(C,Te),0<P.length&&(Te=new jc(Te,e,null,n,M),Y.push({event:Te,listeners:P}),he?Te.data=he:(he=Lc(n),he!==null&&(Te.data=he)))),(he=Xg?qg(e,n):Qg(e,n))&&(Te=zo(C,"onBeforeInput"),0<Te.length&&(P=new jc("onBeforeInput","beforeinput",null,n,M),Y.push({event:P,listeners:Te}),P.data=he)),Dy(Y,e,C,n,M)}E_(Y,t)})}function oi(e,t,n){return{instance:e,listener:t,currentTarget:n}}function zo(e,t){for(var n=t+"Capture",l=[];e!==null;){var a=e,o=a.stateNode;if(a=a.tag,a!==5&&a!==26&&a!==27||o===null||(a=Oa(e,n),a!=null&&l.unshift(oi(e,a,o)),a=Oa(e,t),a!=null&&l.push(oi(e,a,o))),e.tag===3)return l;e=e.return}return[]}function Ly(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function T_(e,t,n,l,a){for(var o=t._reactName,c=[];n!==null&&n!==l;){var d=n,p=d.alternate,C=d.stateNode;if(d=d.tag,p!==null&&p===l)break;d!==5&&d!==26&&d!==27||C===null||(p=C,a?(C=Oa(n,o),C!=null&&c.unshift(oi(n,C,p))):a||(C=Oa(n,o),C!=null&&c.push(oi(n,C,p)))),n=n.return}c.length!==0&&e.push({event:t,listeners:c})}var By=/\r\n?/g,Hy=/\u0000|\uFFFD/g;function C_(e){return(typeof e=="string"?e:""+e).replace(By,`
`).replace(Hy,"")}function O_(e,t){return t=C_(t),C_(e)===t}function Be(e,t,n,l,a,o){switch(n){case"children":typeof l=="string"?t==="body"||t==="textarea"&&l===""||Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&t!=="body"&&Dl(e,""+l);break;case"className":ji(e,"class",l);break;case"tabIndex":ji(e,"tabindex",l);break;case"dir":case"role":case"viewBox":case"width":case"height":ji(e,n,l);break;case"style":Cc(e,l,o);break;case"data":if(t!=="object"){ji(e,"data",l);break}case"src":case"href":if(l===""&&(t!=="a"||n!=="href")){e.removeAttribute(n);break}if(l==null||typeof l=="function"||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Di(""+l),e.setAttribute(n,l);break;case"action":case"formAction":if(typeof l=="function"){e.setAttribute(n,"javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')");break}else typeof o=="function"&&(n==="formAction"?(t!=="input"&&Be(e,t,"name",a.name,a,null),Be(e,t,"formEncType",a.formEncType,a,null),Be(e,t,"formMethod",a.formMethod,a,null),Be(e,t,"formTarget",a.formTarget,a,null)):(Be(e,t,"encType",a.encType,a,null),Be(e,t,"method",a.method,a,null),Be(e,t,"target",a.target,a,null)));if(l==null||typeof l=="symbol"||typeof l=="boolean"){e.removeAttribute(n);break}l=Di(""+l),e.setAttribute(n,l);break;case"onClick":l!=null&&(e.onclick=rn);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"multiple":e.multiple=l&&typeof l!="function"&&typeof l!="symbol";break;case"muted":e.muted=l&&typeof l!="function"&&typeof l!="symbol";break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"defaultValue":case"defaultChecked":case"innerHTML":case"ref":break;case"autoFocus":break;case"xlinkHref":if(l==null||typeof l=="function"||typeof l=="boolean"||typeof l=="symbol"){e.removeAttribute("xlink:href");break}n=Di(""+l),e.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",n);break;case"contentEditable":case"spellCheck":case"draggable":case"value":case"autoReverse":case"externalResourcesRequired":case"focusable":case"preserveAlpha":l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""+l):e.removeAttribute(n);break;case"inert":case"allowFullScreen":case"async":case"autoPlay":case"controls":case"default":case"defer":case"disabled":case"disablePictureInPicture":case"disableRemotePlayback":case"formNoValidate":case"hidden":case"loop":case"noModule":case"noValidate":case"open":case"playsInline":case"readOnly":case"required":case"reversed":case"scoped":case"seamless":case"itemScope":l&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,""):e.removeAttribute(n);break;case"capture":case"download":l===!0?e.setAttribute(n,""):l!==!1&&l!=null&&typeof l!="function"&&typeof l!="symbol"?e.setAttribute(n,l):e.removeAttribute(n);break;case"cols":case"rows":case"size":case"span":l!=null&&typeof l!="function"&&typeof l!="symbol"&&!isNaN(l)&&1<=l?e.setAttribute(n,l):e.removeAttribute(n);break;case"rowSpan":case"start":l==null||typeof l=="function"||typeof l=="symbol"||isNaN(l)?e.removeAttribute(n):e.setAttribute(n,l);break;case"popover":Se("beforetoggle",e),Se("toggle",e),Ni(e,"popover",l);break;case"xlinkActuate":sn(e,"http://www.w3.org/1999/xlink","xlink:actuate",l);break;case"xlinkArcrole":sn(e,"http://www.w3.org/1999/xlink","xlink:arcrole",l);break;case"xlinkRole":sn(e,"http://www.w3.org/1999/xlink","xlink:role",l);break;case"xlinkShow":sn(e,"http://www.w3.org/1999/xlink","xlink:show",l);break;case"xlinkTitle":sn(e,"http://www.w3.org/1999/xlink","xlink:title",l);break;case"xlinkType":sn(e,"http://www.w3.org/1999/xlink","xlink:type",l);break;case"xmlBase":sn(e,"http://www.w3.org/XML/1998/namespace","xml:base",l);break;case"xmlLang":sn(e,"http://www.w3.org/XML/1998/namespace","xml:lang",l);break;case"xmlSpace":sn(e,"http://www.w3.org/XML/1998/namespace","xml:space",l);break;case"is":Ni(e,"is",l);break;case"innerText":case"textContent":break;default:(!(2<n.length)||n[0]!=="o"&&n[0]!=="O"||n[1]!=="n"&&n[1]!=="N")&&(n=mg.get(n)||n,Ni(e,n,l))}}function sr(e,t,n,l,a,o){switch(n){case"style":Cc(e,l,o);break;case"dangerouslySetInnerHTML":if(l!=null){if(typeof l!="object"||!("__html"in l))throw Error(r(61));if(n=l.__html,n!=null){if(a.children!=null)throw Error(r(60));e.innerHTML=n}}break;case"children":typeof l=="string"?Dl(e,l):(typeof l=="number"||typeof l=="bigint")&&Dl(e,""+l);break;case"onScroll":l!=null&&Se("scroll",e);break;case"onScrollEnd":l!=null&&Se("scrollend",e);break;case"onClick":l!=null&&(e.onclick=rn);break;case"suppressContentEditableWarning":case"suppressHydrationWarning":case"innerHTML":case"ref":break;case"innerText":case"textContent":break;default:if(!pc.hasOwnProperty(n))e:{if(n[0]==="o"&&n[1]==="n"&&(a=n.endsWith("Capture"),t=n.slice(2,a?n.length-7:void 0),o=e[vt]||null,o=o!=null?o[n]:null,typeof o=="function"&&e.removeEventListener(t,o,a),typeof l=="function")){typeof o!="function"&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,l,a);break e}n in e?e[n]=l:l===!0?e.setAttribute(n,""):Ni(e,n,l)}}}function mt(e,t,n){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"img":Se("error",e),Se("load",e);var l=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var c=n[o];if(c!=null)switch(o){case"src":l=!0;break;case"srcSet":a=!0;break;case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Be(e,t,o,c,n,null)}}a&&Be(e,t,"srcSet",n.srcSet,n,null),l&&Be(e,t,"src",n.src,n,null);return;case"input":Se("invalid",e);var d=o=c=a=null,p=null,C=null;for(l in n)if(n.hasOwnProperty(l)){var M=n[l];if(M!=null)switch(l){case"name":a=M;break;case"type":c=M;break;case"checked":p=M;break;case"defaultChecked":C=M;break;case"value":o=M;break;case"defaultValue":d=M;break;case"children":case"dangerouslySetInnerHTML":if(M!=null)throw Error(r(137,t));break;default:Be(e,t,l,M,n,null)}}Sc(e,o,d,p,C,c,a,!1);return;case"select":Se("invalid",e),l=c=o=null;for(a in n)if(n.hasOwnProperty(a)&&(d=n[a],d!=null))switch(a){case"value":o=d;break;case"defaultValue":c=d;break;case"multiple":l=d;default:Be(e,t,a,d,n,null)}t=o,n=c,e.multiple=!!l,t!=null?Ml(e,!!l,t,!1):n!=null&&Ml(e,!!l,n,!0);return;case"textarea":Se("invalid",e),o=a=l=null;for(c in n)if(n.hasOwnProperty(c)&&(d=n[c],d!=null))switch(c){case"value":l=d;break;case"defaultValue":a=d;break;case"children":o=d;break;case"dangerouslySetInnerHTML":if(d!=null)throw Error(r(91));break;default:Be(e,t,c,d,n,null)}wc(e,l,a,o);return;case"option":for(p in n)n.hasOwnProperty(p)&&(l=n[p],l!=null)&&(p==="selected"?e.selected=l&&typeof l!="function"&&typeof l!="symbol":Be(e,t,p,l,n,null));return;case"dialog":Se("beforetoggle",e),Se("toggle",e),Se("cancel",e),Se("close",e);break;case"iframe":case"object":Se("load",e);break;case"video":case"audio":for(l=0;l<ii.length;l++)Se(ii[l],e);break;case"image":Se("error",e),Se("load",e);break;case"details":Se("toggle",e);break;case"embed":case"source":case"link":Se("error",e),Se("load",e);case"area":case"base":case"br":case"col":case"hr":case"keygen":case"meta":case"param":case"track":case"wbr":case"menuitem":for(C in n)if(n.hasOwnProperty(C)&&(l=n[C],l!=null))switch(C){case"children":case"dangerouslySetInnerHTML":throw Error(r(137,t));default:Be(e,t,C,l,n,null)}return;default:if(Su(t)){for(M in n)n.hasOwnProperty(M)&&(l=n[M],l!==void 0&&sr(e,t,M,l,n,void 0));return}}for(d in n)n.hasOwnProperty(d)&&(l=n[d],l!=null&&Be(e,t,d,l,n,null))}function Xy(e,t,n,l){switch(t){case"div":case"span":case"svg":case"path":case"a":case"g":case"p":case"li":break;case"input":var a=null,o=null,c=null,d=null,p=null,C=null,M=null;for(R in n){var Y=n[R];if(n.hasOwnProperty(R)&&Y!=null)switch(R){case"checked":break;case"value":break;case"defaultValue":p=Y;default:l.hasOwnProperty(R)||Be(e,t,R,null,l,Y)}}for(var O in l){var R=l[O];if(Y=n[O],l.hasOwnProperty(O)&&(R!=null||Y!=null))switch(O){case"type":o=R;break;case"name":a=R;break;case"checked":C=R;break;case"defaultChecked":M=R;break;case"value":c=R;break;case"defaultValue":d=R;break;case"children":case"dangerouslySetInnerHTML":if(R!=null)throw Error(r(137,t));break;default:R!==Y&&Be(e,t,O,R,l,Y)}}vu(e,c,d,p,C,M,o,a);return;case"select":R=c=d=O=null;for(o in n)if(p=n[o],n.hasOwnProperty(o)&&p!=null)switch(o){case"value":break;case"multiple":R=p;default:l.hasOwnProperty(o)||Be(e,t,o,null,l,p)}for(a in l)if(o=l[a],p=n[a],l.hasOwnProperty(a)&&(o!=null||p!=null))switch(a){case"value":O=o;break;case"defaultValue":d=o;break;case"multiple":c=o;default:o!==p&&Be(e,t,a,o,l,p)}t=d,n=c,l=R,O!=null?Ml(e,!!n,O,!1):!!l!=!!n&&(t!=null?Ml(e,!!n,t,!0):Ml(e,!!n,n?[]:"",!1));return;case"textarea":R=O=null;for(d in n)if(a=n[d],n.hasOwnProperty(d)&&a!=null&&!l.hasOwnProperty(d))switch(d){case"value":break;case"children":break;default:Be(e,t,d,null,l,a)}for(c in l)if(a=l[c],o=n[c],l.hasOwnProperty(c)&&(a!=null||o!=null))switch(c){case"value":O=a;break;case"defaultValue":R=a;break;case"children":break;case"dangerouslySetInnerHTML":if(a!=null)throw Error(r(91));break;default:a!==o&&Be(e,t,c,a,l,o)}Ec(e,O,R);return;case"option":for(var W in n)O=n[W],n.hasOwnProperty(W)&&O!=null&&!l.hasOwnProperty(W)&&(W==="selected"?e.selected=!1:Be(e,t,W,null,l,O));for(p in l)O=l[p],R=n[p],l.hasOwnProperty(p)&&O!==R&&(O!=null||R!=null)&&(p==="selected"?e.selected=O&&typeof O!="function"&&typeof O!="symbol":Be(e,t,p,O,l,R));return;case"img":case"link":case"area":case"base":case"br":case"col":case"embed":case"hr":case"keygen":case"meta":case"param":case"source":case"track":case"wbr":case"menuitem":for(var ue in n)O=n[ue],n.hasOwnProperty(ue)&&O!=null&&!l.hasOwnProperty(ue)&&Be(e,t,ue,null,l,O);for(C in l)if(O=l[C],R=n[C],l.hasOwnProperty(C)&&O!==R&&(O!=null||R!=null))switch(C){case"children":case"dangerouslySetInnerHTML":if(O!=null)throw Error(r(137,t));break;default:Be(e,t,C,O,l,R)}return;default:if(Su(t)){for(var He in n)O=n[He],n.hasOwnProperty(He)&&O!==void 0&&!l.hasOwnProperty(He)&&sr(e,t,He,void 0,l,O);for(M in l)O=l[M],R=n[M],!l.hasOwnProperty(M)||O===R||O===void 0&&R===void 0||sr(e,t,M,O,l,R);return}}for(var S in n)O=n[S],n.hasOwnProperty(S)&&O!=null&&!l.hasOwnProperty(S)&&Be(e,t,S,null,l,O);for(Y in l)O=l[Y],R=n[Y],!l.hasOwnProperty(Y)||O===R||O==null&&R==null||Be(e,t,Y,O,l,R)}function A_(e){switch(e){case"css":case"script":case"font":case"img":case"image":case"input":case"link":return!0;default:return!1}}function qy(){if(typeof performance.getEntriesByType=="function"){for(var e=0,t=0,n=performance.getEntriesByType("resource"),l=0;l<n.length;l++){var a=n[l],o=a.transferSize,c=a.initiatorType,d=a.duration;if(o&&d&&A_(c)){for(c=0,d=a.responseEnd,l+=1;l<n.length;l++){var p=n[l],C=p.startTime;if(C>d)break;var M=p.transferSize,Y=p.initiatorType;M&&A_(Y)&&(p=p.responseEnd,c+=M*(p<d?1:(d-C)/(p-C)))}if(--l,t+=8*(o+c)/(a.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e=="number")?e:5}var rr=null,cr=null;function Ro(e){return e.nodeType===9?e:e.ownerDocument}function z_(e){switch(e){case"http://www.w3.org/2000/svg":return 1;case"http://www.w3.org/1998/Math/MathML":return 2;default:return 0}}function R_(e,t){if(e===0)switch(t){case"svg":return 1;case"math":return 2;default:return 0}return e===1&&t==="foreignObject"?0:e}function fr(e,t){return e==="textarea"||e==="noscript"||typeof t.children=="string"||typeof t.children=="number"||typeof t.children=="bigint"||typeof t.dangerouslySetInnerHTML=="object"&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var dr=null;function Qy(){var e=window.event;return e&&e.type==="popstate"?e===dr?!1:(dr=e,!0):(dr=null,!1)}var N_=typeof setTimeout=="function"?setTimeout:void 0,Gy=typeof clearTimeout=="function"?clearTimeout:void 0,j_=typeof Promise=="function"?Promise:void 0,Vy=typeof queueMicrotask=="function"?queueMicrotask:typeof j_<"u"?function(e){return j_.resolve(null).then(e).catch(Zy)}:N_;function Zy(e){setTimeout(function(){throw e})}function Wn(e){return e==="head"}function M_(e,t){var n=t,l=0;do{var a=n.nextSibling;if(e.removeChild(n),a&&a.nodeType===8)if(n=a.data,n==="/$"||n==="/&"){if(l===0){e.removeChild(a),fa(t);return}l--}else if(n==="$"||n==="$?"||n==="$~"||n==="$!"||n==="&")l++;else if(n==="html")ui(e.ownerDocument.documentElement);else if(n==="head"){n=e.ownerDocument.head,ui(n);for(var o=n.firstChild;o;){var c=o.nextSibling,d=o.nodeName;o[Ta]||d==="SCRIPT"||d==="STYLE"||d==="LINK"&&o.rel.toLowerCase()==="stylesheet"||n.removeChild(o),o=c}}else n==="body"&&ui(e.ownerDocument.body);n=a}while(n);fa(t)}function D_(e,t){var n=e;e=0;do{var l=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display="none"):(n.style.display=n._stashedDisplay||"",n.getAttribute("style")===""&&n.removeAttribute("style")):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=""):n.nodeValue=n._stashedText||""),l&&l.nodeType===8)if(n=l.data,n==="/$"){if(e===0)break;e--}else n!=="$"&&n!=="$?"&&n!=="$~"&&n!=="$!"||e++;n=l}while(n)}function _r(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case"HTML":case"HEAD":case"BODY":_r(n),hu(n);continue;case"SCRIPT":case"STYLE":continue;case"LINK":if(n.rel.toLowerCase()==="stylesheet")continue}e.removeChild(n)}}function Ky(e,t,n,l){for(;e.nodeType===1;){var a=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!l&&(e.nodeName!=="INPUT"||e.type!=="hidden"))break}else if(l){if(!e[Ta])switch(t){case"meta":if(!e.hasAttribute("itemprop"))break;return e;case"link":if(o=e.getAttribute("rel"),o==="stylesheet"&&e.hasAttribute("data-precedence"))break;if(o!==a.rel||e.getAttribute("href")!==(a.href==null||a.href===""?null:a.href)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin)||e.getAttribute("title")!==(a.title==null?null:a.title))break;return e;case"style":if(e.hasAttribute("data-precedence"))break;return e;case"script":if(o=e.getAttribute("src"),(o!==(a.src==null?null:a.src)||e.getAttribute("type")!==(a.type==null?null:a.type)||e.getAttribute("crossorigin")!==(a.crossOrigin==null?null:a.crossOrigin))&&o&&e.hasAttribute("async")&&!e.hasAttribute("itemprop"))break;return e;default:return e}}else if(t==="input"&&e.type==="hidden"){var o=a.name==null?null:""+a.name;if(a.type==="hidden"&&e.getAttribute("name")===o)return e}else return e;if(e=Zt(e.nextSibling),e===null)break}return null}function Jy(e,t,n){if(t==="")return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!n||(e=Zt(e.nextSibling),e===null))return null;return e}function k_(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!=="INPUT"||e.type!=="hidden")&&!t||(e=Zt(e.nextSibling),e===null))return null;return e}function mr(e){return e.data==="$?"||e.data==="$~"}function gr(e){return e.data==="$!"||e.data==="$?"&&e.ownerDocument.readyState!=="loading"}function Iy(e,t){var n=e.ownerDocument;if(e.data==="$~")e._reactRetry=t;else if(e.data!=="$?"||n.readyState!=="loading")t();else{var l=function(){t(),n.removeEventListener("DOMContentLoaded",l)};n.addEventListener("DOMContentLoaded",l),e._reactRetry=l}}function Zt(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t==="$"||t==="$!"||t==="$?"||t==="$~"||t==="&"||t==="F!"||t==="F")break;if(t==="/$"||t==="/&")return null}}return e}var yr=null;function U_(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="/$"||n==="/&"){if(t===0)return Zt(e.nextSibling);t--}else n!=="$"&&n!=="$!"&&n!=="$?"&&n!=="$~"&&n!=="&"||t++}e=e.nextSibling}return null}function Y_(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n==="$"||n==="$!"||n==="$?"||n==="$~"||n==="&"){if(t===0)return e;t--}else n!=="/$"&&n!=="/&"||t++}e=e.previousSibling}return null}function L_(e,t,n){switch(t=Ro(n),e){case"html":if(e=t.documentElement,!e)throw Error(r(452));return e;case"head":if(e=t.head,!e)throw Error(r(453));return e;case"body":if(e=t.body,!e)throw Error(r(454));return e;default:throw Error(r(451))}}function ui(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);hu(e)}var Kt=new Map,B_=new Set;function No(e){return typeof e.getRootNode=="function"?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var Tn=q.d;q.d={f:Fy,r:Wy,D:$y,C:Py,L:ep,m:tp,X:lp,S:np,M:ap};function Fy(){var e=Tn.f(),t=So();return e||t}function Wy(e){var t=Rl(e);t!==null&&t.tag===5&&t.type==="form"?nd(t):Tn.r(e)}var sa=typeof document>"u"?null:document;function H_(e,t,n){var l=sa;if(l&&typeof t=="string"&&t){var a=Bt(t);a='link[rel="'+e+'"][href="'+a+'"]',typeof n=="string"&&(a+='[crossorigin="'+n+'"]'),B_.has(a)||(B_.add(a),e={rel:e,crossOrigin:n,href:t},l.querySelector(a)===null&&(t=l.createElement("link"),mt(t,"link",e),ut(t),l.head.appendChild(t)))}}function $y(e){Tn.D(e),H_("dns-prefetch",e,null)}function Py(e,t){Tn.C(e,t),H_("preconnect",e,t)}function ep(e,t,n){Tn.L(e,t,n);var l=sa;if(l&&e&&t){var a='link[rel="preload"][as="'+Bt(t)+'"]';t==="image"&&n&&n.imageSrcSet?(a+='[imagesrcset="'+Bt(n.imageSrcSet)+'"]',typeof n.imageSizes=="string"&&(a+='[imagesizes="'+Bt(n.imageSizes)+'"]')):a+='[href="'+Bt(e)+'"]';var o=a;switch(t){case"style":o=ra(e);break;case"script":o=ca(e)}Kt.has(o)||(e=E({rel:"preload",href:t==="image"&&n&&n.imageSrcSet?void 0:e,as:t},n),Kt.set(o,e),l.querySelector(a)!==null||t==="style"&&l.querySelector(si(o))||t==="script"&&l.querySelector(ri(o))||(t=l.createElement("link"),mt(t,"link",e),ut(t),l.head.appendChild(t)))}}function tp(e,t){Tn.m(e,t);var n=sa;if(n&&e){var l=t&&typeof t.as=="string"?t.as:"script",a='link[rel="modulepreload"][as="'+Bt(l)+'"][href="'+Bt(e)+'"]',o=a;switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":o=ca(e)}if(!Kt.has(o)&&(e=E({rel:"modulepreload",href:e},t),Kt.set(o,e),n.querySelector(a)===null)){switch(l){case"audioworklet":case"paintworklet":case"serviceworker":case"sharedworker":case"worker":case"script":if(n.querySelector(ri(o)))return}l=n.createElement("link"),mt(l,"link",e),ut(l),n.head.appendChild(l)}}}function np(e,t,n){Tn.S(e,t,n);var l=sa;if(l&&e){var a=Nl(l).hoistableStyles,o=ra(e);t=t||"default";var c=a.get(o);if(!c){var d={loading:0,preload:null};if(c=l.querySelector(si(o)))d.loading=5;else{e=E({rel:"stylesheet",href:e,"data-precedence":t},n),(n=Kt.get(o))&&pr(e,n);var p=c=l.createElement("link");ut(p),mt(p,"link",e),p._p=new Promise(function(C,M){p.onload=C,p.onerror=M}),p.addEventListener("load",function(){d.loading|=1}),p.addEventListener("error",function(){d.loading|=2}),d.loading|=4,jo(c,t,l)}c={type:"stylesheet",instance:c,count:1,state:d},a.set(o,c)}}}function lp(e,t){Tn.X(e,t);var n=sa;if(n&&e){var l=Nl(n).hoistableScripts,a=ca(e),o=l.get(a);o||(o=n.querySelector(ri(a)),o||(e=E({src:e,async:!0},t),(t=Kt.get(a))&&hr(e,t),o=n.createElement("script"),ut(o),mt(o,"link",e),n.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(a,o))}}function ap(e,t){Tn.M(e,t);var n=sa;if(n&&e){var l=Nl(n).hoistableScripts,a=ca(e),o=l.get(a);o||(o=n.querySelector(ri(a)),o||(e=E({src:e,async:!0,type:"module"},t),(t=Kt.get(a))&&hr(e,t),o=n.createElement("script"),ut(o),mt(o,"link",e),n.head.appendChild(o)),o={type:"script",instance:o,count:1,state:null},l.set(a,o))}}function X_(e,t,n,l){var a=(a=pe.current)?No(a):null;if(!a)throw Error(r(446));switch(e){case"meta":case"title":return null;case"style":return typeof n.precedence=="string"&&typeof n.href=="string"?(t=ra(n.href),n=Nl(a).hoistableStyles,l=n.get(t),l||(l={type:"style",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};case"link":if(n.rel==="stylesheet"&&typeof n.href=="string"&&typeof n.precedence=="string"){e=ra(n.href);var o=Nl(a).hoistableStyles,c=o.get(e);if(c||(a=a.ownerDocument||a,c={type:"stylesheet",instance:null,count:0,state:{loading:0,preload:null}},o.set(e,c),(o=a.querySelector(si(e)))&&!o._p&&(c.instance=o,c.state.loading=5),Kt.has(e)||(n={rel:"preload",as:"style",href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},Kt.set(e,n),o||ip(a,e,n,c.state))),t&&l===null)throw Error(r(528,""));return c}if(t&&l!==null)throw Error(r(529,""));return null;case"script":return t=n.async,n=n.src,typeof n=="string"&&t&&typeof t!="function"&&typeof t!="symbol"?(t=ca(n),n=Nl(a).hoistableScripts,l=n.get(t),l||(l={type:"script",instance:null,count:0,state:null},n.set(t,l)),l):{type:"void",instance:null,count:0,state:null};default:throw Error(r(444,e))}}function ra(e){return'href="'+Bt(e)+'"'}function si(e){return'link[rel="stylesheet"]['+e+"]"}function q_(e){return E({},e,{"data-precedence":e.precedence,precedence:null})}function ip(e,t,n,l){e.querySelector('link[rel="preload"][as="style"]['+t+"]")?l.loading=1:(t=e.createElement("link"),l.preload=t,t.addEventListener("load",function(){return l.loading|=1}),t.addEventListener("error",function(){return l.loading|=2}),mt(t,"link",n),ut(t),e.head.appendChild(t))}function ca(e){return'[src="'+Bt(e)+'"]'}function ri(e){return"script[async]"+e}function Q_(e,t,n){if(t.count++,t.instance===null)switch(t.type){case"style":var l=e.querySelector('style[data-href~="'+Bt(n.href)+'"]');if(l)return t.instance=l,ut(l),l;var a=E({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return l=(e.ownerDocument||e).createElement("style"),ut(l),mt(l,"style",a),jo(l,n.precedence,e),t.instance=l;case"stylesheet":a=ra(n.href);var o=e.querySelector(si(a));if(o)return t.state.loading|=4,t.instance=o,ut(o),o;l=q_(n),(a=Kt.get(a))&&pr(l,a),o=(e.ownerDocument||e).createElement("link"),ut(o);var c=o;return c._p=new Promise(function(d,p){c.onload=d,c.onerror=p}),mt(o,"link",l),t.state.loading|=4,jo(o,n.precedence,e),t.instance=o;case"script":return o=ca(n.src),(a=e.querySelector(ri(o)))?(t.instance=a,ut(a),a):(l=n,(a=Kt.get(o))&&(l=E({},n),hr(l,a)),e=e.ownerDocument||e,a=e.createElement("script"),ut(a),mt(a,"link",l),e.head.appendChild(a),t.instance=a);case"void":return null;default:throw Error(r(443,t.type))}else t.type==="stylesheet"&&(t.state.loading&4)===0&&(l=t.instance,t.state.loading|=4,jo(l,n.precedence,e));return t.instance}function jo(e,t,n){for(var l=n.querySelectorAll('link[rel="stylesheet"][data-precedence],style[data-precedence]'),a=l.length?l[l.length-1]:null,o=a,c=0;c<l.length;c++){var d=l[c];if(d.dataset.precedence===t)o=d;else if(o!==a)break}o?o.parentNode.insertBefore(e,o.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function pr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.title==null&&(e.title=t.title)}function hr(e,t){e.crossOrigin==null&&(e.crossOrigin=t.crossOrigin),e.referrerPolicy==null&&(e.referrerPolicy=t.referrerPolicy),e.integrity==null&&(e.integrity=t.integrity)}var Mo=null;function G_(e,t,n){if(Mo===null){var l=new Map,a=Mo=new Map;a.set(n,l)}else a=Mo,l=a.get(n),l||(l=new Map,a.set(n,l));if(l.has(e))return l;for(l.set(e,null),n=n.getElementsByTagName(e),a=0;a<n.length;a++){var o=n[a];if(!(o[Ta]||o[ct]||e==="link"&&o.getAttribute("rel")==="stylesheet")&&o.namespaceURI!=="http://www.w3.org/2000/svg"){var c=o.getAttribute(t)||"";c=e+c;var d=l.get(c);d?d.push(o):l.set(c,[o])}}return l}function V_(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t==="title"?e.querySelector("head > title"):null)}function op(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case"meta":case"title":return!0;case"style":if(typeof t.precedence!="string"||typeof t.href!="string"||t.href==="")break;return!0;case"link":if(typeof t.rel!="string"||typeof t.href!="string"||t.href===""||t.onLoad||t.onError)break;return t.rel==="stylesheet"?(e=t.disabled,typeof t.precedence=="string"&&e==null):!0;case"script":if(t.async&&typeof t.async!="function"&&typeof t.async!="symbol"&&!t.onLoad&&!t.onError&&t.src&&typeof t.src=="string")return!0}return!1}function Z_(e){return!(e.type==="stylesheet"&&(e.state.loading&3)===0)}function up(e,t,n,l){if(n.type==="stylesheet"&&(typeof l.media!="string"||matchMedia(l.media).matches!==!1)&&(n.state.loading&4)===0){if(n.instance===null){var a=ra(l.href),o=t.querySelector(si(a));if(o){t=o._p,t!==null&&typeof t=="object"&&typeof t.then=="function"&&(e.count++,e=Do.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=o,ut(o);return}o=t.ownerDocument||t,l=q_(l),(a=Kt.get(a))&&pr(l,a),o=o.createElement("link"),ut(o);var c=o;c._p=new Promise(function(d,p){c.onload=d,c.onerror=p}),mt(o,"link",l),n.instance=o}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&(n.state.loading&3)===0&&(e.count++,n=Do.bind(e),t.addEventListener("load",n),t.addEventListener("error",n))}}var br=0;function sp(e,t){return e.stylesheets&&e.count===0&&Uo(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var l=setTimeout(function(){if(e.stylesheets&&Uo(e,e.stylesheets),e.unsuspend){var o=e.unsuspend;e.unsuspend=null,o()}},6e4+t);0<e.imgBytes&&br===0&&(br=62500*qy());var a=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Uo(e,e.stylesheets),e.unsuspend)){var o=e.unsuspend;e.unsuspend=null,o()}},(e.imgBytes>br?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(l),clearTimeout(a)}}:null}function Do(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Uo(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var ko=null;function Uo(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,ko=new Map,t.forEach(rp,e),ko=null,Do.call(e))}function rp(e,t){if(!(t.state.loading&4)){var n=ko.get(e);if(n)var l=n.get(null);else{n=new Map,ko.set(e,n);for(var a=e.querySelectorAll("link[data-precedence],style[data-precedence]"),o=0;o<a.length;o++){var c=a[o];(c.nodeName==="LINK"||c.getAttribute("media")!=="not all")&&(n.set(c.dataset.precedence,c),l=c)}l&&n.set(null,l)}a=t.instance,c=a.getAttribute("data-precedence"),o=n.get(c)||l,o===l&&n.set(null,a),n.set(c,a),this.count++,l=Do.bind(this),a.addEventListener("load",l),a.addEventListener("error",l),o?o.parentNode.insertBefore(a,o.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(a,e.firstChild)),t.state.loading|=4}}var ci={$$typeof:G,Provider:null,Consumer:null,_currentValue:K,_currentValue2:K,_threadCount:0};function cp(e,t,n,l,a,o,c,d,p){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=mu(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=mu(0),this.hiddenUpdates=mu(null),this.identifierPrefix=l,this.onUncaughtError=a,this.onCaughtError=o,this.onRecoverableError=c,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=p,this.incompleteTransitions=new Map}function K_(e,t,n,l,a,o,c,d,p,C,M,Y){return e=new cp(e,t,n,c,p,C,M,Y,d),t=1,o===!0&&(t|=24),o=Nt(3,null,null,t),e.current=o,o.stateNode=e,t=$u(),t.refCount++,e.pooledCache=t,t.refCount++,o.memoizedState={element:l,isDehydrated:n,cache:t},ns(o),e}function J_(e){return e?(e=Xl,e):Xl}function I_(e,t,n,l,a,o){a=J_(a),l.context===null?l.context=a:l.pendingContext=a,l=Hn(t),l.payload={element:n},o=o===void 0?null:o,o!==null&&(l.callback=o),n=Xn(e,l,t),n!==null&&(Ct(n,e,t),qa(n,e,t))}function F_(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function vr(e,t){F_(e,t),(e=e.alternate)&&F_(e,t)}function W_(e){if(e.tag===13||e.tag===31){var t=fl(e,67108864);t!==null&&Ct(t,e,67108864),vr(e,67108864)}}function $_(e){if(e.tag===13||e.tag===31){var t=Ut();t=gu(t);var n=fl(e,t);n!==null&&Ct(n,e,t),vr(e,t)}}var Yo=!0;function fp(e,t,n,l){var a=N.T;N.T=null;var o=q.p;try{q.p=2,xr(e,t,n,l)}finally{q.p=o,N.T=a}}function dp(e,t,n,l){var a=N.T;N.T=null;var o=q.p;try{q.p=8,xr(e,t,n,l)}finally{q.p=o,N.T=a}}function xr(e,t,n,l){if(Yo){var a=Sr(l);if(a===null)ur(e,t,l,Lo,n),em(e,l);else if(mp(a,e,t,n,l))l.stopPropagation();else if(em(e,l),t&4&&-1<_p.indexOf(e)){for(;a!==null;){var o=Rl(a);if(o!==null)switch(o.tag){case 3:if(o=o.stateNode,o.current.memoizedState.isDehydrated){var c=ol(o.pendingLanes);if(c!==0){var d=o;for(d.pendingLanes|=2,d.entangledLanes|=2;c;){var p=1<<31-zt(c);d.entanglements[1]|=p,c&=~p}an(o),(Ne&6)===0&&(vo=Ye()+500,ai(0))}}break;case 31:case 13:d=fl(o,2),d!==null&&Ct(d,o,2),So(),vr(o,2)}if(o=Sr(l),o===null&&ur(e,t,l,Lo,n),o===a)break;a=o}a!==null&&l.stopPropagation()}else ur(e,t,l,null,n)}}function Sr(e){return e=wu(e),Er(e)}var Lo=null;function Er(e){if(Lo=null,e=zl(e),e!==null){var t=_(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=y(t),e!==null)return e;e=null}else if(n===31){if(e=x(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return Lo=e,null}function P_(e){switch(e){case"beforetoggle":case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"toggle":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 2;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 8;case"message":switch(zn()){case il:return 2;case Cl:return 8;case Rn:case bt:return 32;case Nn:return 268435456;default:return 32}default:return 32}}var wr=!1,$n=null,Pn=null,el=null,fi=new Map,di=new Map,tl=[],_p="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset".split(" ");function em(e,t){switch(e){case"focusin":case"focusout":$n=null;break;case"dragenter":case"dragleave":Pn=null;break;case"mouseover":case"mouseout":el=null;break;case"pointerover":case"pointerout":fi.delete(t.pointerId);break;case"gotpointercapture":case"lostpointercapture":di.delete(t.pointerId)}}function _i(e,t,n,l,a,o){return e===null||e.nativeEvent!==o?(e={blockedOn:t,domEventName:n,eventSystemFlags:l,nativeEvent:o,targetContainers:[a]},t!==null&&(t=Rl(t),t!==null&&W_(t)),e):(e.eventSystemFlags|=l,t=e.targetContainers,a!==null&&t.indexOf(a)===-1&&t.push(a),e)}function mp(e,t,n,l,a){switch(t){case"focusin":return $n=_i($n,e,t,n,l,a),!0;case"dragenter":return Pn=_i(Pn,e,t,n,l,a),!0;case"mouseover":return el=_i(el,e,t,n,l,a),!0;case"pointerover":var o=a.pointerId;return fi.set(o,_i(fi.get(o)||null,e,t,n,l,a)),!0;case"gotpointercapture":return o=a.pointerId,di.set(o,_i(di.get(o)||null,e,t,n,l,a)),!0}return!1}function tm(e){var t=zl(e.target);if(t!==null){var n=_(t);if(n!==null){if(t=n.tag,t===13){if(t=y(n),t!==null){e.blockedOn=t,mc(e.priority,function(){$_(n)});return}}else if(t===31){if(t=x(n),t!==null){e.blockedOn=t,mc(e.priority,function(){$_(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Bo(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=Sr(e.nativeEvent);if(n===null){n=e.nativeEvent;var l=new n.constructor(n.type,n);Eu=l,n.target.dispatchEvent(l),Eu=null}else return t=Rl(n),t!==null&&W_(t),e.blockedOn=n,!1;t.shift()}return!0}function nm(e,t,n){Bo(e)&&n.delete(t)}function gp(){wr=!1,$n!==null&&Bo($n)&&($n=null),Pn!==null&&Bo(Pn)&&(Pn=null),el!==null&&Bo(el)&&(el=null),fi.forEach(nm),di.forEach(nm)}function Ho(e,t){e.blockedOn===t&&(e.blockedOn=null,wr||(wr=!0,i.unstable_scheduleCallback(i.unstable_NormalPriority,gp)))}var Xo=null;function lm(e){Xo!==e&&(Xo=e,i.unstable_scheduleCallback(i.unstable_NormalPriority,function(){Xo===e&&(Xo=null);for(var t=0;t<e.length;t+=3){var n=e[t],l=e[t+1],a=e[t+2];if(typeof l!="function"){if(Er(l||n)===null)continue;break}var o=Rl(n);o!==null&&(e.splice(t,3),t-=3,Ss(o,{pending:!0,data:a,method:n.method,action:l},l,a))}}))}function fa(e){function t(p){return Ho(p,e)}$n!==null&&Ho($n,e),Pn!==null&&Ho(Pn,e),el!==null&&Ho(el,e),fi.forEach(t),di.forEach(t);for(var n=0;n<tl.length;n++){var l=tl[n];l.blockedOn===e&&(l.blockedOn=null)}for(;0<tl.length&&(n=tl[0],n.blockedOn===null);)tm(n),n.blockedOn===null&&tl.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(l=0;l<n.length;l+=3){var a=n[l],o=n[l+1],c=a[vt]||null;if(typeof o=="function")c||lm(n);else if(c){var d=null;if(o&&o.hasAttribute("formAction")){if(a=o,c=o[vt]||null)d=c.formAction;else if(Er(a)!==null)continue}else d=c.action;typeof d=="function"?n[l+1]=d:(n.splice(l,3),l-=3),lm(n)}}}function am(){function e(o){o.canIntercept&&o.info==="react-transition"&&o.intercept({handler:function(){return new Promise(function(c){return a=c})},focusReset:"manual",scroll:"manual"})}function t(){a!==null&&(a(),a=null),l||setTimeout(n,20)}function n(){if(!l&&!navigation.transition){var o=navigation.currentEntry;o&&o.url!=null&&navigation.navigate(o.url,{state:o.getState(),info:"react-transition",history:"replace"})}}if(typeof navigation=="object"){var l=!1,a=null;return navigation.addEventListener("navigate",e),navigation.addEventListener("navigatesuccess",t),navigation.addEventListener("navigateerror",t),setTimeout(n,100),function(){l=!0,navigation.removeEventListener("navigate",e),navigation.removeEventListener("navigatesuccess",t),navigation.removeEventListener("navigateerror",t),a!==null&&(a(),a=null)}}}function Tr(e){this._internalRoot=e}qo.prototype.render=Tr.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(r(409));var n=t.current,l=Ut();I_(n,l,e,t,null,null)},qo.prototype.unmount=Tr.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;I_(e.current,2,null,e,null,null),So(),t[Al]=null}};function qo(e){this._internalRoot=e}qo.prototype.unstable_scheduleHydration=function(e){if(e){var t=_c();e={blockedOn:null,target:e,priority:t};for(var n=0;n<tl.length&&t!==0&&t<tl[n].priority;n++);tl.splice(n,0,e),n===0&&tm(e)}};var im=u.version;if(im!=="19.2.4")throw Error(r(527,im,"19.2.4"));q.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render=="function"?Error(r(188)):(e=Object.keys(e).join(","),Error(r(268,e)));return e=m(t),e=e!==null?A(e):null,e=e===null?null:e.stateNode,e};var yp={bundleType:0,version:"19.2.4",rendererPackageName:"react-dom",currentDispatcherRef:N,reconcilerVersion:"19.2.4"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Qo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Qo.isDisabled&&Qo.supportsFiber)try{Sa=Qo.inject(yp),At=Qo}catch{}}return gi.createRoot=function(e,t){if(!f(e))throw Error(r(299));var n=!1,l="",a=dd,o=_d,c=md;return t!=null&&(t.unstable_strictMode===!0&&(n=!0),t.identifierPrefix!==void 0&&(l=t.identifierPrefix),t.onUncaughtError!==void 0&&(a=t.onUncaughtError),t.onCaughtError!==void 0&&(o=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=K_(e,1,!1,null,null,n,l,null,a,o,c,am),e[Al]=t.current,or(e),new Tr(t)},gi.hydrateRoot=function(e,t,n){if(!f(e))throw Error(r(299));var l=!1,a="",o=dd,c=_d,d=md,p=null;return n!=null&&(n.unstable_strictMode===!0&&(l=!0),n.identifierPrefix!==void 0&&(a=n.identifierPrefix),n.onUncaughtError!==void 0&&(o=n.onUncaughtError),n.onCaughtError!==void 0&&(c=n.onCaughtError),n.onRecoverableError!==void 0&&(d=n.onRecoverableError),n.formState!==void 0&&(p=n.formState)),t=K_(e,1,!0,t,n??null,l,a,p,o,c,d,am),t.context=J_(null),n=t.current,l=Ut(),l=gu(l),a=Hn(l),a.callback=null,Xn(n,a,l),n=l,t.current.lanes=n,wa(t,n),an(t),e[Al]=t.current,or(e),new qo(t)},gi.version="19.2.4",gi}var gm;function Ap(){if(gm)return Ar.exports;gm=1;function i(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(i)}catch(u){console.error(u)}}return i(),Ar.exports=Op(),Ar.exports}var zp=Ap(),Po={},Rp=()=>{window.va||(window.va=function(...u){window.vaq||(window.vaq=[]),window.vaq.push(u)})},Np="@vercel/analytics",jp="2.0.1";function Wm(){return typeof window<"u"}function $m(){try{const i="production"}catch{}return"production"}function Mp(i="auto"){if(i==="auto"){window.vam=$m();return}window.vam=i}function Dp(){return(Wm()?window.vam:$m())||"production"}function ec(){return Dp()==="development"}function kp(i){return i.scriptSrc?ga(i.scriptSrc):ec()?"https://va.vercel-scripts.com/v1/script.debug.js":i.basePath?ga(`${i.basePath}/insights/script.js`):"/_vercel/insights/script.js"}function Up(i,u){var s;let r=i;if(u)try{r={...(s=JSON.parse(u))==null?void 0:s.analytics,...i}}catch{}Mp(r.mode);const f={sdkn:Np+(r.framework?`/${r.framework}`:""),sdkv:jp};return r.disableAutoTrack&&(f.disableAutoTrack="1"),r.viewEndpoint&&(f.viewEndpoint=ga(r.viewEndpoint)),r.eventEndpoint&&(f.eventEndpoint=ga(r.eventEndpoint)),r.sessionEndpoint&&(f.sessionEndpoint=ga(r.sessionEndpoint)),ec()&&r.debug===!1&&(f.debug="false"),r.dsn&&(f.dsn=r.dsn),r.endpoint?f.endpoint=r.endpoint:r.basePath&&(f.endpoint=ga(`${r.basePath}/insights`)),{beforeSend:r.beforeSend,src:kp(r),dataset:f}}function ga(i){return i.startsWith("http://")||i.startsWith("https://")||i.startsWith("/")?i:`/${i}`}function Yp(i={debug:!0},u){var s;if(!Wm())return;const{beforeSend:r,src:f,dataset:_}=Up(i,u);if(Rp(),r&&((s=window.va)==null||s.call(window,"beforeSend",r)),document.head.querySelector(`script[src*="${f}"]`))return;const y=document.createElement("script");y.src=f;for(const[x,h]of Object.entries(_))y.dataset[x]=h;y.defer=!0,y.onerror=()=>{const x=ec()?"Please check if any ad blockers are enabled and try again.":"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";console.log(`[Vercel Web Analytics] Failed to load script from ${f}. ${x}`)},document.head.appendChild(y)}function Lp({route:i,path:u}){var s;(s=window.va)==null||s.call(window,"pageview",{route:i,path:u})}function Bp(){if(!(typeof process>"u"||typeof Po>"u"))return Po.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH}function Hp(){if(!(typeof process>"u"||typeof Po>"u"))return Po.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG}function Xp(i){return w.useEffect(()=>{var u;i.beforeSend&&((u=window.va)==null||u.call(window,"beforeSend",i.beforeSend))},[i.beforeSend]),w.useEffect(()=>{Yp({framework:i.framework||"react",basePath:i.basePath??Bp(),...i.route!==void 0&&{disableAutoTrack:!0},...i},i.configString??Hp())},[]),w.useEffect(()=>{i.route&&i.path&&Lp({route:i.route,path:i.path})},[i.route,i.path]),null}var tc=Fm(),qp=`svg[fill=none] {
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
}`,Qp={popup:"styles-module__popup___IhzrD",enter:"styles-module__enter___L7U7N",entered:"styles-module__entered___COX-w",exit:"styles-module__exit___5eGjE",shake:"styles-module__shake___jdbWe",header:"styles-module__header___wWsSi",element:"styles-module__element___fTV2z",headerToggle:"styles-module__headerToggle___WpW0b",chevron:"styles-module__chevron___ZZJlR",expanded:"styles-module__expanded___2Hxgv",stylesWrapper:"styles-module__stylesWrapper___pnHgy",stylesInner:"styles-module__stylesInner___YYZe2",stylesBlock:"styles-module__stylesBlock___VfQKn",styleLine:"styles-module__styleLine___1YQiD",styleProperty:"styles-module__styleProperty___84L1i",styleValue:"styles-module__styleValue___q51-h",timestamp:"styles-module__timestamp___Dtpsv",quote:"styles-module__quote___mcMmQ",textarea:"styles-module__textarea___jrSae",actions:"styles-module__actions___D6x3f",cancel:"styles-module__cancel___hRjnL",submit:"styles-module__submit___K-mIR",deleteWrapper:"styles-module__deleteWrapper___oSjdo",deleteButton:"styles-module__deleteButton___4VuAE",light:"styles-module__light___6AaSQ"};if(typeof document<"u"){let i=document.getElementById("feedback-tool-styles-annotation-popup-css-styles");i||(i=document.createElement("style"),i.id="feedback-tool-styles-annotation-popup-css-styles",i.textContent=qp,document.head.appendChild(i))}var Qe=Qp,Gp=({size:i=24})=>g.jsx("svg",{width:i,height:i,viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:g.jsx("path",{d:"M13.5 4C14.7426 4 15.75 5.00736 15.75 6.25V7H18.5C18.9142 7 19.25 7.33579 19.25 7.75C19.25 8.16421 18.9142 8.5 18.5 8.5H17.9678L17.6328 16.2217C17.61 16.7475 17.5912 17.1861 17.5469 17.543C17.5015 17.9087 17.4225 18.2506 17.2461 18.5723C16.9747 19.0671 16.5579 19.4671 16.0518 19.7168C15.7227 19.8791 15.3772 19.9422 15.0098 19.9717C14.6514 20.0004 14.2126 20 13.6865 20H10.3135C9.78735 20 9.34856 20.0004 8.99023 19.9717C8.62278 19.9422 8.27729 19.8791 7.94824 19.7168C7.44205 19.4671 7.02532 19.0671 6.75391 18.5723C6.57751 18.2506 6.49853 17.9087 6.45312 17.543C6.40883 17.1861 6.39005 16.7475 6.36719 16.2217L6.03223 8.5H5.5C5.08579 8.5 4.75 8.16421 4.75 7.75C4.75 7.33579 5.08579 7 5.5 7H8.25V6.25C8.25 5.00736 9.25736 4 10.5 4H13.5ZM7.86621 16.1562C7.89013 16.7063 7.90624 17.0751 7.94141 17.3584C7.97545 17.6326 8.02151 17.7644 8.06934 17.8516C8.19271 18.0763 8.38239 18.2577 8.6123 18.3711C8.70153 18.4151 8.83504 18.4545 9.11035 18.4766C9.39482 18.4994 9.76335 18.5 10.3135 18.5H13.6865C14.2367 18.5 14.6052 18.4994 14.8896 18.4766C15.165 18.4545 15.2985 18.4151 15.3877 18.3711C15.6176 18.2577 15.8073 18.0763 15.9307 17.8516C15.9785 17.7644 16.0245 17.6326 16.0586 17.3584C16.0938 17.0751 16.1099 16.7063 16.1338 16.1562L16.4668 8.5H7.5332L7.86621 16.1562ZM9.97656 10.75C10.3906 10.7371 10.7371 11.0626 10.75 11.4766L10.875 15.4766C10.8879 15.8906 10.5624 16.2371 10.1484 16.25C9.73443 16.2629 9.38794 15.9374 9.375 15.5234L9.25 11.5234C9.23706 11.1094 9.56255 10.7629 9.97656 10.75ZM14.0244 10.75C14.4383 10.7635 14.7635 11.1105 14.75 11.5244L14.6201 15.5244C14.6066 15.9384 14.2596 16.2634 13.8457 16.25C13.4317 16.2365 13.1067 15.8896 13.1201 15.4756L13.251 11.4756C13.2645 11.0617 13.6105 10.7366 14.0244 10.75ZM10.5 5.5C10.0858 5.5 9.75 5.83579 9.75 6.25V7H14.25V6.25C14.25 5.83579 13.9142 5.5 13.5 5.5H10.5Z",fill:"currentColor"})}),jr="__agentation_freeze";function Vp(){if(typeof window>"u")return{frozen:!1,installed:!0,origSetTimeout:setTimeout,origSetInterval:setInterval,origRAF:u=>0,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]};const i=window;return i[jr]||(i[jr]={frozen:!1,installed:!1,origSetTimeout:null,origSetInterval:null,origRAF:null,pausedAnimations:[],frozenTimeoutQueue:[],frozenRAFQueue:[]}),i[jr]}var gt=Vp();typeof window<"u"&&!gt.installed&&(gt.origSetTimeout=window.setTimeout.bind(window),gt.origSetInterval=window.setInterval.bind(window),gt.origRAF=window.requestAnimationFrame.bind(window),window.setTimeout=(i,u,...s)=>typeof i=="string"?gt.origSetTimeout(i,u):gt.origSetTimeout((...r)=>{gt.frozen?gt.frozenTimeoutQueue.push(()=>i(...r)):i(...r)},u,...s),window.setInterval=(i,u,...s)=>typeof i=="string"?gt.origSetInterval(i,u):gt.origSetInterval((...r)=>{gt.frozen||i(...r)},u,...s),window.requestAnimationFrame=i=>gt.origRAF(u=>{gt.frozen?gt.frozenRAFQueue.push(i):i(u)}),gt.installed=!0);var da=gt.origSetTimeout;gt.origSetInterval;w.forwardRef(function({element:u,timestamp:s,selectedText:r,placeholder:f="What should change?",initialValue:_="",submitLabel:y="Add",onSubmit:x,onCancel:h,onDelete:m,style:A,accentColor:E="#3c82f7",isExiting:z=!1,lightMode:j=!1,computedStyles:L},B){const[I,Z]=w.useState(_),[$,G]=w.useState(!1),[Q,te]=w.useState("initial"),[ne,F]=w.useState(!1),[oe,H]=w.useState(!1),le=w.useRef(null),re=w.useRef(null),Ce=w.useRef(null),We=w.useRef(null);w.useEffect(()=>{z&&Q!=="exit"&&te("exit")},[z,Q]),w.useEffect(()=>{da(()=>{te("enter")},0);const ae=da(()=>{te("entered")},200),ve=da(()=>{const b=le.current;b&&(b.focus(),b.selectionStart=b.selectionEnd=b.value.length,b.scrollTop=b.scrollHeight)},50);return()=>{clearTimeout(ae),clearTimeout(ve),Ce.current&&clearTimeout(Ce.current),We.current&&clearTimeout(We.current)}},[]);const Xe=w.useCallback(()=>{We.current&&clearTimeout(We.current),G(!0),We.current=da(()=>{G(!1),le.current?.focus()},250)},[]);w.useImperativeHandle(B,()=>({shake:Xe}),[Xe]);const ce=w.useCallback(()=>{te("exit"),Ce.current=da(()=>{h()},150)},[h]),N=w.useCallback(()=>{I.trim()&&x(I.trim())},[I,x]),q=w.useCallback(ae=>{ae.nativeEvent.isComposing||(ae.key==="Enter"&&!ae.shiftKey&&(ae.preventDefault(),N()),ae.key==="Escape"&&ce())},[N,ce]),K=[Qe.popup,j?Qe.light:"",Q==="enter"?Qe.enter:"",Q==="entered"?Qe.entered:"",Q==="exit"?Qe.exit:"",$?Qe.shake:""].filter(Boolean).join(" ");return g.jsxs("div",{ref:re,className:K,"data-annotation-popup":!0,style:A,onClick:ae=>ae.stopPropagation(),children:[g.jsxs("div",{className:Qe.header,children:[L&&Object.keys(L).length>0?g.jsxs("button",{className:Qe.headerToggle,onClick:()=>{const ae=oe;H(!oe),ae&&da(()=>le.current?.focus(),0)},type:"button",children:[g.jsx("svg",{className:`${Qe.chevron} ${oe?Qe.expanded:""}`,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:g.jsx("path",{d:"M5.5 10.25L9 7.25L5.75 4",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})}),g.jsx("span",{className:Qe.element,children:u})]}):g.jsx("span",{className:Qe.element,children:u}),s&&g.jsx("span",{className:Qe.timestamp,children:s})]}),L&&Object.keys(L).length>0&&g.jsx("div",{className:`${Qe.stylesWrapper} ${oe?Qe.expanded:""}`,children:g.jsx("div",{className:Qe.stylesInner,children:g.jsx("div",{className:Qe.stylesBlock,children:Object.entries(L).map(([ae,ve])=>g.jsxs("div",{className:Qe.styleLine,children:[g.jsx("span",{className:Qe.styleProperty,children:ae.replace(/([A-Z])/g,"-$1").toLowerCase()}),": ",g.jsx("span",{className:Qe.styleValue,children:ve}),";"]},ae))})})}),r&&g.jsxs("div",{className:Qe.quote,children:["“",r.slice(0,80),r.length>80?"...":"","”"]}),g.jsx("textarea",{ref:le,className:Qe.textarea,style:{borderColor:ne?E:void 0},placeholder:f,value:I,onChange:ae=>Z(ae.target.value),onFocus:()=>F(!0),onBlur:()=>F(!1),rows:2,onKeyDown:q}),g.jsxs("div",{className:Qe.actions,children:[m&&g.jsx("div",{className:Qe.deleteWrapper,children:g.jsx("button",{className:Qe.deleteButton,onClick:m,type:"button",children:g.jsx(Gp,{size:22})})}),g.jsx("button",{className:Qe.cancel,onClick:ce,children:"Cancel"}),g.jsx("button",{className:Qe.submit,style:{backgroundColor:E,opacity:I.trim()?1:.4},onClick:N,disabled:!I.trim(),children:y})]})]})});var Zp=`svg[fill=none] {
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
}`;if(typeof document<"u"){let i=document.getElementById("feedback-tool-styles-page-toolbar-css-styles");i||(i=document.createElement("style"),i.id="feedback-tool-styles-page-toolbar-css-styles",i.textContent=Zp,document.head.appendChild(i))}function Pm(){return typeof window<"u"}function Kp(){try{const i="production"}catch{}return"production"}function e0(){return(Pm()?window.vam:Kp())||"production"}function ym(){return e0()==="production"}function Jp(){return e0()==="development"}function Ip(i,{[i]:u,...s}){return s}function Fp(i,u){if(!i)return;let s=i;const r=[];for(const[f,_]of Object.entries(i))typeof _=="object"&&_!==null&&(u.strip?s=Ip(f,s):r.push(f));if(r.length>0&&!u.strip)throw Error(`The following properties are not valid: ${r.join(", ")}. Only strings, numbers, booleans, and null are allowed.`);return s}function Wp(i,u,s){var r,f;if(!Pm()){const _="[Vercel Web Analytics] Please import `track` from `@vercel/analytics/server` when using this function in a server environment";if(ym())console.warn(_);else throw new Error(_);return}if(!u){(r=window.va)==null||r.call(window,"event",{name:i,options:s});return}try{const _=Fp(u,{strip:ym()});(f=window.va)==null||f.call(window,"event",{name:i,data:_,options:s})}catch(_){_ instanceof Error&&Jp()&&console.error(_)}}const $p=void 0,Pp=void 0;function t0(){return typeof window<"u"&&typeof document<"u"}function nc(){return t0()&&!!$p}function lc(){return!!Pp}function eh(){return t0()&&(nc()||lc())}function th(){return{page_title:document.title,page_location:window.location.href,page_path:`${window.location.pathname}${window.location.search}${window.location.hash}`}}function n0(i,u={}){!nc()||!window.gtag||window.gtag("event",i,u)}function l0(i,u={}){n0(i,u),lc()&&Wp(i,u)}function Gr(){n0("page_view",th())}function nh(i){const u=i.target;if(!(u instanceof Element))return;const s=u.closest("a");if(!(s instanceof HTMLAnchorElement))return;const r=s.getAttribute("href");if(!r)return;const f=s.href||r,_=r.startsWith("mailto:"),y=s.hasAttribute("download"),x=r.startsWith("#"),m=!f.startsWith(window.location.origin)&&!_&&!x;if(!_&&!y&&!m)return;const A=s.textContent?.trim().replace(/\s+/g," ").slice(0,120)||void 0;l0("click",{link_type:_?"mailto":y?"download":"outbound",link_url:f,link_text:A})}function lh(){window.addEventListener("popstate",Gr),window.addEventListener("hashchange",Gr),document.addEventListener("click",nh)}function ah(){!eh()||window.__analyticsStarted||(lh(),nc()&&Gr(),window.__analyticsStarted=!0)}function ih(i){const u=i.currentTarget.getBoundingClientRect(),s=u.width===0?0:(i.clientX-u.left)/u.width-.5,r=u.height===0?0:(i.clientY-u.top)/u.height-.5;i.currentTarget.style.setProperty("--mosaic-hover-anchor-x",`${(s*12).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y",`${(r*4).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-tilt-x",`${(-r*4).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-tilt-y",`${(s*8).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-lift",`${(1+Math.abs(s)*.01).toFixed(3)}`),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x",`${(-r*2).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y",`${(s*4).toFixed(2)}deg`),i.currentTarget.style.setProperty("--mosaic-hover-chip-lift",`${(1+Math.abs(s)*.006).toFixed(3)}`)}function pm(i){i.currentTarget.style.setProperty("--mosaic-hover-anchor-x","0px"),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y","0px"),i.currentTarget.style.setProperty("--mosaic-hover-tilt-x","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-tilt-y","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-lift","1"),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-x","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-chip-tilt-y","0deg"),i.currentTarget.style.setProperty("--mosaic-hover-chip-lift","1")}function _a({href:i,logoUrls:u,className:s,ariaLabel:r,title:f,children:_}){return g.jsxs("a",{href:i,target:"_blank",rel:"noreferrer",className:s,"aria-label":r,title:f,onPointerMove:ih,onPointerLeave:pm,onPointerCancel:pm,children:[g.jsx("span",{className:"mosaic-company-inline-name",children:_}),g.jsx("span",{className:"mosaic-company-inline-hover-logos","aria-hidden":"true",children:u.map(y=>g.jsx("span",{className:"mosaic-company-inline-hover-logo-wrap",children:g.jsx("img",{src:y,alt:"",loading:"eager",decoding:"async",className:"mosaic-company-inline-hover-logo"})},`${i}-${y}`))})]})}function oh(i){const u=i.currentTarget.getBoundingClientRect(),s=u.width===0?0:(i.clientX-u.left)/u.width-.5,r=u.height===0?0:(i.clientY-u.top)/u.height-.5;i.currentTarget.style.setProperty("--mosaic-hover-anchor-x",`${(s*12).toFixed(2)}px`),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y",`${(r*6).toFixed(2)}px`)}function hm(i){i.currentTarget.style.setProperty("--mosaic-hover-anchor-x","0px"),i.currentTarget.style.setProperty("--mosaic-hover-anchor-y","0px")}function uh({href:i,className:u,embedUrl:s,previewTitle:r,children:f}){const[_,y]=w.useState(!1);return g.jsxs("a",{href:i,target:"_blank",rel:"noreferrer",className:`${u} mosaic-profile-link-with-video${_?" is-active":""}`,onPointerEnter:()=>y(!0),onPointerMove:oh,onPointerLeave:x=>{y(!1),hm(x)},onPointerCancel:x=>{y(!1),hm(x)},onFocus:()=>y(!0),onBlur:()=>y(!1),children:[f,g.jsx("span",{className:"mosaic-company-inline-hover-video","aria-hidden":"true",children:_?g.jsx("iframe",{src:s,title:r,loading:"eager",allow:"autoplay; encrypted-media; picture-in-picture",referrerPolicy:"strict-origin-when-cross-origin",className:"mosaic-company-inline-hover-video-frame"}):null})]})}function Ei(i,...u){const s=new URL("https://base-ui.com/production-error");return s.searchParams.set("code",i.toString()),u.forEach(r=>s.searchParams.append("args[]",r)),`Base UI error #${i}; visit ${s} for the full message.`}const a0=w.createContext(void 0);function wi(i){const u=w.useContext(a0);if(i===!1&&u===void 0)throw new Error(Ei(27));return u}const bm={};function al(i,u){const s=w.useRef(bm);return s.current===bm&&(s.current=i(u)),s}function eu(i,u,s,r){const f=al(i0).current;return rh(f,i,u,s,r)&&o0(f,[i,u,s,r]),f.callback}function sh(i){const u=al(i0).current;return ch(u,i)&&o0(u,i),u.callback}function i0(){return{callback:null,cleanup:null,refs:[]}}function rh(i,u,s,r,f){return i.refs[0]!==u||i.refs[1]!==s||i.refs[2]!==r||i.refs[3]!==f}function ch(i,u){return i.refs.length!==u.length||i.refs.some((s,r)=>s!==u[r])}function o0(i,u){if(i.refs=u,u.every(s=>s==null)){i.callback=null;return}i.callback=s=>{if(i.cleanup&&(i.cleanup(),i.cleanup=null),s!=null){const r=Array(u.length).fill(null);for(let f=0;f<u.length;f+=1){const _=u[f];if(_!=null)switch(typeof _){case"function":{const y=_(s);typeof y=="function"&&(r[f]=y);break}case"object":{_.current=s;break}}}i.cleanup=()=>{for(let f=0;f<u.length;f+=1){const _=u[f];if(_!=null)switch(typeof _){case"function":{const y=r[f];typeof y=="function"?y():_(null);break}case"object":{_.current=null;break}}}}}}}const fh=parseInt(w.version,10);function ac(i){return fh>=i}function vm(i){if(!w.isValidElement(i))return null;const u=i,s=u.props;return(ac(19)?s?.ref:u.ref)??null}function Vr(i,u){if(i&&!u)return i;if(!i&&u)return u;if(i||u)return{...i,...u}}function dh(i,u){const s={};for(const r in i){const f=i[r];if(u?.hasOwnProperty(r)){const _=u[r](f);_!=null&&Object.assign(s,_);continue}f===!0?s[`data-${r.toLowerCase()}`]="":f&&(s[`data-${r.toLowerCase()}`]=f.toString())}return s}function _h(i,u){return typeof i=="function"?i(u):i}function mh(i,u){return typeof i=="function"?i(u):i}const pi={};function u0(i,u,s,r,f){let _={...Zr(i,pi)};return u&&(_=Wo(_,u)),s&&(_=Wo(_,s)),r&&(_=Wo(_,r)),_}function gh(i){if(i.length===0)return pi;if(i.length===1)return Zr(i[0],pi);let u={...Zr(i[0],pi)};for(let s=1;s<i.length;s+=1)u=Wo(u,i[s]);return u}function Wo(i,u){return s0(u)?u(i):yh(i,u)}function yh(i,u){if(!u)return i;for(const s in u){const r=u[s];switch(s){case"style":{i[s]=Vr(i.style,r);break}case"className":{i[s]=r0(i.className,r);break}default:ph(s,r)?i[s]=hh(i[s],r):i[s]=r}}return i}function ph(i,u){const s=i.charCodeAt(0),r=i.charCodeAt(1),f=i.charCodeAt(2);return s===111&&r===110&&f>=65&&f<=90&&(typeof u=="function"||typeof u>"u")}function s0(i){return typeof i=="function"}function Zr(i,u){return s0(i)?i(u):i??pi}function hh(i,u){return u?i?s=>{if(bh(s)){const f=s;Kr(f);const _=u(f);return f.baseUIHandlerPrevented||i?.(f),_}const r=u(s);return i?.(s),r}:u:i}function Kr(i){return i.preventBaseUIHandler=()=>{i.baseUIHandlerPrevented=!0},i}function r0(i,u){return u?i?u+" "+i:u:i}function bh(i){return i!=null&&typeof i=="object"&&"nativeEvent"in i}function c0(){}const Jt=Object.freeze({}),vh="data-base-ui-click-trigger",xh={clipPath:"inset(50%)",position:"fixed",top:0,left:0};function ru(i,u,s={}){const r=u.render,f=Sh(u,s);if(s.enabled===!1)return null;const _=s.state??Jt;return Eh(i,r,f,_)}function Sh(i,u={}){const{className:s,style:r,render:f}=i,{state:_=Jt,ref:y,props:x,stateAttributesMapping:h,enabled:m=!0}=u,A=m?_h(s,_):void 0,E=m?mh(r,_):void 0,z=m?dh(_,h):Jt,j=m?Vr(z,Array.isArray(x)?gh(x):x)??Jt:Jt;return typeof document<"u"&&(m?Array.isArray(y)?j.ref=sh([j.ref,vm(f),...y]):j.ref=eu(j.ref,vm(f),y):eu(null,null)),m?(A!==void 0&&(j.className=r0(j.className,A)),E!==void 0&&(j.style=Vr(j.style,E)),j):Jt}function Eh(i,u,s,r){if(u){if(typeof u=="function")return u(s,r);const f=u0(s,u.props);return f.ref=s.ref,w.cloneElement(u,f)}if(i&&typeof i=="string")return wh(i,s);throw new Error(Ei(8))}function wh(i,u){return i==="button"?w.createElement("button",{type:"button",...u,key:u.key}):i==="img"?w.createElement("img",{alt:"",...u,key:u.key}):w.createElement(i,u)}let xi=(function(i){return i.startingStyle="data-starting-style",i.endingStyle="data-ending-style",i})({});const Th={[xi.startingStyle]:""},Ch={[xi.endingStyle]:""},f0={transitionStatus(i){return i==="starting"?Th:i==="ending"?Ch:null}};let Tl=(function(i){return i.open="data-open",i.closed="data-closed",i[i.startingStyle=xi.startingStyle]="startingStyle",i[i.endingStyle=xi.endingStyle]="endingStyle",i.anchorHidden="data-anchor-hidden",i})({});const Oh={[Tl.open]:""},Ah={[Tl.closed]:""},zh={[Tl.anchorHidden]:""},d0={open(i){return i?Oh:Ah},anchorHidden(i){return i?zh:null}},Rh={...d0,...f0},Nh=w.forwardRef(function(u,s){const{render:r,className:f,forceRender:_=!1,...y}=u,{store:x}=wi(),h=x.useState("open"),m=x.useState("nested"),A=x.useState("mounted"),E=x.useState("transitionStatus"),z=w.useMemo(()=>({open:h,transitionStatus:E}),[h,E]);return ru("div",u,{state:z,ref:[x.context.backdropRef,s],stateAttributesMapping:Rh,props:[{role:"presentation",hidden:!A,style:{userSelect:"none",WebkitUserSelect:"none"}},y],enabled:_||!m})});function cu(){return typeof window<"u"}function fu(i){return ic(i)?(i.nodeName||"").toLowerCase():"#document"}function un(i){var u;return(i==null||(u=i.ownerDocument)==null?void 0:u.defaultView)||window}function jh(i){var u;return(u=(ic(i)?i.ownerDocument:i.document)||window.document)==null?void 0:u.documentElement}function ic(i){return cu()?i instanceof Node||i instanceof un(i).Node:!1}function wl(i){return cu()?i instanceof Element||i instanceof un(i).Element:!1}function On(i){return cu()?i instanceof HTMLElement||i instanceof un(i).HTMLElement:!1}function Jr(i){return!cu()||typeof ShadowRoot>"u"?!1:i instanceof ShadowRoot||i instanceof un(i).ShadowRoot}const Mh=new Set(["inline","contents"]);function du(i){const{overflow:u,overflowX:s,overflowY:r,display:f}=oc(i);return/auto|scroll|overlay|hidden|clip/.test(u+r+s)&&!Mh.has(f)}function Dh(){return typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter","none")}const kh=new Set(["html","body","#document"]);function $o(i){return kh.has(fu(i))}function oc(i){return un(i).getComputedStyle(i)}function _0(i){if(fu(i)==="html")return i;const u=i.assignedSlot||i.parentNode||Jr(i)&&i.host||jh(i);return Jr(u)?u.host:u}function m0(i){const u=_0(i);return $o(u)?i.ownerDocument?i.ownerDocument.body:i.body:On(u)&&du(u)?u:m0(u)}function hi(i,u,s){var r;u===void 0&&(u=[]),s===void 0&&(s=!0);const f=m0(i),_=f===((r=i.ownerDocument)==null?void 0:r.body),y=un(f);if(_){const x=Uh(y);return u.concat(y,y.visualViewport||[],du(f)?f:[],x&&s?hi(x):[])}return u.concat(f,hi(f,[],s))}function Uh(i){return i.parent&&Object.getPrototypeOf(i.parent)?i.frameElement:null}const Mr=Im[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0,-3)],Yh=Mr&&Mr!==w.useLayoutEffect?Mr:i=>i();function je(i){const u=al(Lh).current;return u.next=i,Yh(u.effect),u.trampoline}function Lh(){const i={next:void 0,callback:Bh,trampoline:(...u)=>i.callback?.(...u),effect:()=>{i.callback=i.next}};return i}function Bh(){}const Hh=()=>{},rt=typeof document<"u"?w.useLayoutEffect:Hh,Xh=w.createContext(void 0);function qh(i=!1){const u=w.useContext(Xh);if(u===void 0&&!i)throw new Error(Ei(16));return u}function Qh(i){const{focusableWhenDisabled:u,disabled:s,composite:r=!1,tabIndex:f=0,isNativeButton:_}=i,y=r&&u!==!1,x=r&&u===!1;return{props:w.useMemo(()=>{const m={onKeyDown(A){s&&u&&A.key!=="Tab"&&A.preventDefault()}};return r||(m.tabIndex=f,!_&&s&&(m.tabIndex=u?f:-1)),(_&&(u||y)||!_&&s)&&(m["aria-disabled"]=s),_&&(!u||x)&&(m.disabled=s),m},[r,s,u,y,x,_,f])}}function Gh(i={}){const{disabled:u=!1,focusableWhenDisabled:s,tabIndex:r=0,native:f=!0}=i,_=w.useRef(null),y=qh(!0)!==void 0,x=je(()=>{const z=_.current;return!!(z?.tagName==="A"&&z?.href)}),{props:h}=Qh({focusableWhenDisabled:s,disabled:u,composite:y,tabIndex:r,isNativeButton:f}),m=w.useCallback(()=>{const z=_.current;Vh(z)&&y&&u&&h.disabled===void 0&&z.disabled&&(z.disabled=!1)},[u,h.disabled,y]);rt(m,[m]);const A=w.useCallback((z={})=>{const{onClick:j,onMouseDown:L,onKeyUp:B,onKeyDown:I,onPointerDown:Z,...$}=z;return u0({type:f?"button":void 0,onClick(Q){if(u){Q.preventDefault();return}j?.(Q)},onMouseDown(Q){u||L?.(Q)},onKeyDown(Q){if(u||(Kr(Q),I?.(Q)),Q.baseUIHandlerPrevented)return;const te=Q.target===Q.currentTarget&&!f&&!x()&&!u,ne=Q.key==="Enter",F=Q.key===" ";te&&((F||ne)&&Q.preventDefault(),ne&&j?.(Q))},onKeyUp(Q){u||(Kr(Q),B?.(Q)),!Q.baseUIHandlerPrevented&&Q.target===Q.currentTarget&&!f&&!u&&Q.key===" "&&j?.(Q)},onPointerDown(Q){if(u){Q.preventDefault();return}Z?.(Q)}},f?void 0:{role:"button"},h,$)},[u,h,f,x]),E=je(z=>{_.current=z,m()});return{getButtonProps:A,buttonRef:E}}function Vh(i){return On(i)&&i.tagName==="BUTTON"}const Zh="none",xm="trigger-press",Kh="trigger-hover",g0="outside-press",Jh="close-press",y0="focus-out",Ih="escape-key",Fh="imperative-action";function An(i,u,s,r){let f=!1,_=!1;const y=Jt;return{reason:i,event:u??new Event("base-ui"),cancel(){f=!0},allowPropagation(){_=!0},get isCanceled(){return f},get isPropagationAllowed(){return _},trigger:s,...y}}const Wh=w.forwardRef(function(u,s){const{render:r,className:f,disabled:_=!1,nativeButton:y=!0,...x}=u,{store:h}=wi(),m=h.useState("open");function A(L){m&&h.setOpen(!1,An(Jh,L.nativeEvent))}const{getButtonProps:E,buttonRef:z}=Gh({disabled:_,native:y}),j=w.useMemo(()=>({disabled:_}),[_]);return ru("button",u,{state:j,ref:[s,z],props:[{onClick:A},x,E]})}),$h={...Im};let Sm=0;function Ph(i,u="mui"){const[s,r]=w.useState(i),f=i||s;return w.useEffect(()=>{s==null&&(Sm+=1,r(`${u}-${Sm}`))},[s,u]),f}const Em=$h.useId;function uc(i,u){return Em!==void 0?Em():Ph(i,u)}const eb=[];function p0(i){w.useEffect(i,eb)}const yi=0;class ba{static create(){return new ba}currentId=yi;start(u,s){this.clear(),this.currentId=setTimeout(()=>{this.currentId=yi,s()},u)}isStarted(){return this.currentId!==yi}clear=()=>{this.currentId!==yi&&(clearTimeout(this.currentId),this.currentId=yi)};disposeEffect=()=>this.clear}function tu(){const i=al(ba.create).current;return p0(i.disposeEffect),i}function Go(i){const u=al(tb,i).current;return u.next=i,rt(u.effect),u}function tb(i){const u={current:i,next:i,effect:()=>{u.current=u.next}};return u}const xa=typeof navigator<"u",Dr=ib(),h0=ub(),b0=ob(),nb=typeof CSS>"u"||!CSS.supports?!1:CSS.supports("-webkit-backdrop-filter:none"),v0=Dr.platform==="MacIntel"&&Dr.maxTouchPoints>1?!0:/iP(hone|ad|od)|iOS/.test(Dr.platform),lb=xa&&/apple/i.test(navigator.vendor),Ir=xa&&/android/i.test(h0)||/android/i.test(b0);xa&&h0.toLowerCase().startsWith("mac")&&navigator.maxTouchPoints;const ab=b0.includes("jsdom/");function ib(){if(!xa)return{platform:"",maxTouchPoints:-1};const i=navigator.userAgentData;return i?.platform?{platform:i.platform,maxTouchPoints:navigator.maxTouchPoints}:{platform:navigator.platform??"",maxTouchPoints:navigator.maxTouchPoints??-1}}function ob(){if(!xa)return"";const i=navigator.userAgentData;return i&&Array.isArray(i.brands)?i.brands.map(({brand:u,version:s})=>`${u}/${s}`).join(" "):navigator.userAgent}function ub(){if(!xa)return"";const i=navigator.userAgentData;return i?.platform?i.platform:navigator.platform??""}const Fr="data-base-ui-focusable",x0="active",S0="selected",sb="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function ma(i){let u=i.activeElement;for(;u?.shadowRoot?.activeElement!=null;)u=u.shadowRoot.activeElement;return u}function at(i,u){if(!i||!u)return!1;const s=u.getRootNode?.();if(i.contains(u))return!0;if(s&&Jr(s)){let r=u;for(;r;){if(i===r)return!0;r=r.parentNode||r.host}}return!1}function en(i){return"composedPath"in i?i.composedPath()[0]:i.target}function Pt(i,u){if(u==null)return!1;if("composedPath"in i)return i.composedPath().includes(u);const s=i;return s.target!=null&&u.contains(s.target)}function rb(i){return i.matches("html,body")}function Ot(i){return i?.ownerDocument||document}function cb(i){return On(i)&&i.matches(sb)}function wm(i){return i?i.getAttribute("role")==="combobox"&&cb(i):!1}function Wr(i){return i?i.hasAttribute(Fr)?i:i.querySelector(`[${Fr}]`)||i:null}function pa(i,u,s=!0){return i.filter(f=>f.parentId===u&&(!s||f.context?.open)).flatMap(f=>[f,...pa(i,f.id,s)])}function Tm(i,u){let s=[],r=i.find(f=>f.id===u)?.parentId;for(;r;){const f=i.find(_=>_.id===r);r=f?.parentId,f&&(s=s.concat(f))}return s}function fb(i){i.preventDefault(),i.stopPropagation()}function db(i){return"nativeEvent"in i}function _b(i){return i.mozInputSource===0&&i.isTrusted?!0:Ir&&i.pointerType?i.type==="click"&&i.buttons===1:i.detail===0&&!i.pointerType}function mb(i){return ab?!1:!Ir&&i.width===0&&i.height===0||Ir&&i.width===1&&i.height===1&&i.pressure===0&&i.detail===0&&i.pointerType==="mouse"||i.width<1&&i.height<1&&i.pressure===0&&i.detail===0&&i.pointerType==="touch"}function gb(i){const u=i.type;return u==="click"||u==="mousedown"||u==="keydown"||u==="keyup"}var yb=["input:not([inert]):not([inert] *)","select:not([inert]):not([inert] *)","textarea:not([inert]):not([inert] *)","a[href]:not([inert]):not([inert] *)","button:not([inert]):not([inert] *)","[tabindex]:not(slot):not([inert]):not([inert] *)","audio[controls]:not([inert]):not([inert] *)","video[controls]:not([inert]):not([inert] *)",'[contenteditable]:not([contenteditable="false"]):not([inert]):not([inert] *)',"details>summary:first-of-type:not([inert]):not([inert] *)","details:not([inert]):not([inert] *)"],nu=yb.join(","),E0=typeof Element>"u",va=E0?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,lu=!E0&&Element.prototype.getRootNode?function(i){var u;return i==null||(u=i.getRootNode)===null||u===void 0?void 0:u.call(i)}:function(i){return i?.ownerDocument},au=function(u,s){var r;s===void 0&&(s=!0);var f=u==null||(r=u.getAttribute)===null||r===void 0?void 0:r.call(u,"inert"),_=f===""||f==="true",y=_||s&&u&&(typeof u.closest=="function"?u.closest("[inert]"):au(u.parentNode));return y},pb=function(u){var s,r=u==null||(s=u.getAttribute)===null||s===void 0?void 0:s.call(u,"contenteditable");return r===""||r==="true"},w0=function(u,s,r){if(au(u))return[];var f=Array.prototype.slice.apply(u.querySelectorAll(nu));return s&&va.call(u,nu)&&f.unshift(u),f=f.filter(r),f},iu=function(u,s,r){for(var f=[],_=Array.from(u);_.length;){var y=_.shift();if(!au(y,!1))if(y.tagName==="SLOT"){var x=y.assignedElements(),h=x.length?x:y.children,m=iu(h,!0,r);r.flatten?f.push.apply(f,m):f.push({scopeParent:y,candidates:m})}else{var A=va.call(y,nu);A&&r.filter(y)&&(s||!u.includes(y))&&f.push(y);var E=y.shadowRoot||typeof r.getShadowRoot=="function"&&r.getShadowRoot(y),z=!au(E,!1)&&(!r.shadowRootFilter||r.shadowRootFilter(y));if(E&&z){var j=iu(E===!0?y.children:E.children,!0,r);r.flatten?f.push.apply(f,j):f.push({scopeParent:y,candidates:j})}else _.unshift.apply(_,y.children)}}return f},T0=function(u){return!isNaN(parseInt(u.getAttribute("tabindex"),10))},C0=function(u){if(!u)throw new Error("No node provided");return u.tabIndex<0&&(/^(AUDIO|VIDEO|DETAILS)$/.test(u.tagName)||pb(u))&&!T0(u)?0:u.tabIndex},hb=function(u,s){var r=C0(u);return r<0&&s&&!T0(u)?0:r},bb=function(u,s){return u.tabIndex===s.tabIndex?u.documentOrder-s.documentOrder:u.tabIndex-s.tabIndex},O0=function(u){return u.tagName==="INPUT"},vb=function(u){return O0(u)&&u.type==="hidden"},xb=function(u){var s=u.tagName==="DETAILS"&&Array.prototype.slice.apply(u.children).some(function(r){return r.tagName==="SUMMARY"});return s},Sb=function(u,s){for(var r=0;r<u.length;r++)if(u[r].checked&&u[r].form===s)return u[r]},Eb=function(u){if(!u.name)return!0;var s=u.form||lu(u),r=function(x){return s.querySelectorAll('input[type="radio"][name="'+x+'"]')},f;if(typeof window<"u"&&typeof window.CSS<"u"&&typeof window.CSS.escape=="function")f=r(window.CSS.escape(u.name));else try{f=r(u.name)}catch(y){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",y.message),!1}var _=Sb(f,u.form);return!_||_===u},wb=function(u){return O0(u)&&u.type==="radio"},Tb=function(u){return wb(u)&&!Eb(u)},Cb=function(u){var s,r=u&&lu(u),f=(s=r)===null||s===void 0?void 0:s.host,_=!1;if(r&&r!==u){var y,x,h;for(_=!!((y=f)!==null&&y!==void 0&&(x=y.ownerDocument)!==null&&x!==void 0&&x.contains(f)||u!=null&&(h=u.ownerDocument)!==null&&h!==void 0&&h.contains(u));!_&&f;){var m,A,E;r=lu(f),f=(m=r)===null||m===void 0?void 0:m.host,_=!!((A=f)!==null&&A!==void 0&&(E=A.ownerDocument)!==null&&E!==void 0&&E.contains(f))}}return _},Cm=function(u){var s=u.getBoundingClientRect(),r=s.width,f=s.height;return r===0&&f===0},Ob=function(u,s){var r=s.displayCheck,f=s.getShadowRoot;if(r==="full-native"&&"checkVisibility"in u){var _=u.checkVisibility({checkOpacity:!1,opacityProperty:!1,contentVisibilityAuto:!0,visibilityProperty:!0,checkVisibilityCSS:!0});return!_}if(getComputedStyle(u).visibility==="hidden")return!0;var y=va.call(u,"details>summary:first-of-type"),x=y?u.parentElement:u;if(va.call(x,"details:not([open]) *"))return!0;if(!r||r==="full"||r==="full-native"||r==="legacy-full"){if(typeof f=="function"){for(var h=u;u;){var m=u.parentElement,A=lu(u);if(m&&!m.shadowRoot&&f(m)===!0)return Cm(u);u.assignedSlot?u=u.assignedSlot:!m&&A!==u.ownerDocument?u=A.host:u=m}u=h}if(Cb(u))return!u.getClientRects().length;if(r!=="legacy-full")return!0}else if(r==="non-zero-area")return Cm(u);return!1},Ab=function(u){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(u.tagName))for(var s=u.parentElement;s;){if(s.tagName==="FIELDSET"&&s.disabled){for(var r=0;r<s.children.length;r++){var f=s.children.item(r);if(f.tagName==="LEGEND")return va.call(s,"fieldset[disabled] *")?!0:!f.contains(u)}return!0}s=s.parentElement}return!1},$r=function(u,s){return!(s.disabled||vb(s)||Ob(s,u)||xb(s)||Ab(s))},Pr=function(u,s){return!(Tb(s)||C0(s)<0||!$r(u,s))},zb=function(u){var s=parseInt(u.getAttribute("tabindex"),10);return!!(isNaN(s)||s>=0)},A0=function(u){var s=[],r=[];return u.forEach(function(f,_){var y=!!f.scopeParent,x=y?f.scopeParent:f,h=hb(x,y),m=y?A0(f.candidates):x;h===0?y?s.push.apply(s,m):s.push(x):r.push({documentOrder:_,tabIndex:h,item:f,isScope:y,content:m})}),r.sort(bb).reduce(function(f,_){return _.isScope?f.push.apply(f,_.content):f.push(_.content),f},[]).concat(s)},_u=function(u,s){s=s||{};var r;return s.getShadowRoot?r=iu([u],s.includeContainer,{filter:Pr.bind(null,s),flatten:!1,getShadowRoot:s.getShadowRoot,shadowRootFilter:zb}):r=w0(u,s.includeContainer,Pr.bind(null,s)),A0(r)},Rb=function(u,s){s=s||{};var r;return s.getShadowRoot?r=iu([u],s.includeContainer,{filter:$r.bind(null,s),flatten:!0,getShadowRoot:s.getShadowRoot}):r=w0(u,s.includeContainer,$r.bind(null,s)),r},z0=function(u,s){if(s=s||{},!u)throw new Error("No node provided");return va.call(u,nu)===!1?!1:Pr(s,u)};const Ti=()=>({getShadowRoot:!0,displayCheck:typeof ResizeObserver=="function"&&ResizeObserver.toString().includes("[native code]")?"full":"none"});function R0(i,u){const s=_u(i,Ti()),r=s.length;if(r===0)return;const f=ma(Ot(i)),_=s.indexOf(f),y=_===-1?u===1?0:r-1:_+u;return s[y]}function N0(i){return R0(Ot(i).body,1)||i}function j0(i){return R0(Ot(i).body,-1)||i}function bi(i,u){const s=u||i.currentTarget,r=i.relatedTarget;return!r||!at(s,r)}function Nb(i){_u(i,Ti()).forEach(s=>{s.dataset.tabindex=s.getAttribute("tabindex")||"",s.setAttribute("tabindex","-1")})}function Om(i){i.querySelectorAll("[data-tabindex]").forEach(s=>{const r=s.dataset.tabindex;delete s.dataset.tabindex,r?s.setAttribute("tabindex",r):s.removeAttribute("tabindex")})}function jb(){const i=new Map;return{emit(u,s){i.get(u)?.forEach(r=>r(s))},on(u,s){i.has(u)||i.set(u,new Set),i.get(u).add(s)},off(u,s){i.get(u)?.delete(s)}}}const Mb=w.createContext(null),Db=w.createContext(null),M0=()=>w.useContext(Mb)?.id||null,D0=i=>{const u=w.useContext(Db);return i??u};function ou(i){return`data-base-ui-${i}`}const kb={clipPath:"inset(50%)",overflow:"hidden",whiteSpace:"nowrap",border:0,padding:0,width:1,height:1,margin:-1},k0={...kb,position:"fixed",top:0,left:0},Vo=null;class Ub{callbacks=[];callbacksCount=0;nextId=1;startId=1;isScheduled=!1;tick=u=>{this.isScheduled=!1;const s=this.callbacks,r=this.callbacksCount;if(this.callbacks=[],this.callbacksCount=0,this.startId=this.nextId,r>0)for(let f=0;f<s.length;f+=1)s[f]?.(u)};request(u){const s=this.nextId;return this.nextId+=1,this.callbacks.push(u),this.callbacksCount+=1,!this.isScheduled&&(requestAnimationFrame(this.tick),this.isScheduled=!0),s}cancel(u){const s=u-this.startId;s<0||s>=this.callbacks.length||(this.callbacks[s]=null,this.callbacksCount-=1)}}const Zo=new Ub;class on{static create(){return new on}static request(u){return Zo.request(u)}static cancel(u){return Zo.cancel(u)}currentId=Vo;request(u){this.cancel(),this.currentId=Zo.request(()=>{this.currentId=Vo,u()})}cancel=()=>{this.currentId!==Vo&&(Zo.cancel(this.currentId),this.currentId=Vo)};disposeEffect=()=>this.cancel}function U0(){const i=al(on.create).current;return p0(i.disposeEffect),i}function Ci(i){return i?.ownerDocument||document}const uu=w.forwardRef(function(u,s){const[r,f]=w.useState();rt(()=>{lb&&f("button")},[]);const _={tabIndex:0,role:r};return g.jsx("span",{...u,ref:s,style:k0,"aria-hidden":r?void 0:!0,..._,"data-base-ui-focus-guard":""})});let Am=0;function kr(i,u={}){const{preventScroll:s=!1,cancelPrevious:r=!0,sync:f=!1}=u;r&&cancelAnimationFrame(Am);const _=()=>i?.focus({preventScroll:s});f?_():Am=requestAnimationFrame(_)}const ha={inert:new WeakMap,"aria-hidden":new WeakMap,none:new WeakMap};function zm(i){return i==="inert"?ha.inert:i==="aria-hidden"?ha["aria-hidden"]:ha.none}let Ko=new WeakSet,Jo={},Ur=0;const Y0=i=>i&&(i.host||Y0(i.parentNode)),Yb=(i,u)=>u.map(s=>{if(i.contains(s))return s;const r=Y0(s);return i.contains(r)?r:null}).filter(s=>s!=null);function Lb(i,u,s,r){const f="data-base-ui-inert",_=r?"inert":s?"aria-hidden":null,y=Yb(u,i),x=new Set,h=new Set(y),m=[];Jo[f]||(Jo[f]=new WeakMap);const A=Jo[f];y.forEach(E),z(u),x.clear();function E(j){!j||x.has(j)||(x.add(j),j.parentNode&&E(j.parentNode))}function z(j){!j||h.has(j)||[].forEach.call(j.children,L=>{if(fu(L)!=="script")if(x.has(L))z(L);else{const B=_?L.getAttribute(_):null,I=B!==null&&B!=="false",Z=zm(_),$=(Z.get(L)||0)+1,G=(A.get(L)||0)+1;Z.set(L,$),A.set(L,G),m.push(L),$===1&&I&&Ko.add(L),G===1&&L.setAttribute(f,""),!I&&_&&L.setAttribute(_,_==="inert"?"":"true")}})}return Ur+=1,()=>{m.forEach(j=>{const L=zm(_),I=(L.get(j)||0)-1,Z=(A.get(j)||0)-1;L.set(j,I),A.set(j,Z),I||(!Ko.has(j)&&_&&j.removeAttribute(_),Ko.delete(j)),Z||j.removeAttribute(f)}),Ur-=1,Ur||(ha.inert=new WeakMap,ha["aria-hidden"]=new WeakMap,ha.none=new WeakMap,Ko=new WeakSet,Jo={})}}function Bb(i,u=!1,s=!1){const r=Ot(i[0]).body;return Lb(i.concat(Array.from(r.querySelectorAll("[aria-live]"))),r,u,s)}const L0=w.createContext(null),B0=()=>w.useContext(L0),Hb=ou("portal");function Xb(i={}){const{ref:u,container:s,componentProps:r=Jt,elementProps:f,elementState:_}=i,y=uc(),h=B0()?.portalNode,[m,A]=w.useState(null),[E,z]=w.useState(null),j=je(Z=>{Z!==null&&z(Z)}),L=w.useRef(null);rt(()=>{if(s===null){L.current&&(L.current=null,z(null),A(null));return}if(y==null)return;const Z=(s&&(ic(s)?s:s.current))??h??document.body;if(Z==null){L.current&&(L.current=null,z(null),A(null));return}L.current!==Z&&(L.current=Z,z(null),A(Z))},[s,h,y]);const B=ru("div",r,{ref:[u,j],state:_,props:[{id:y,[Hb]:""},f]});return{portalNode:E,portalSubtree:m&&B?tc.createPortal(B,m):null}}const qb=w.forwardRef(function(u,s){const{children:r,container:f,className:_,render:y,renderGuards:x,...h}=u,{portalNode:m,portalSubtree:A}=Xb({container:f,ref:s,componentProps:u,elementProps:h}),E=w.useRef(null),z=w.useRef(null),j=w.useRef(null),L=w.useRef(null),[B,I]=w.useState(null),Z=B?.modal,$=B?.open,G=typeof x=="boolean"?x:!!B&&!B.modal&&B.open&&!!m;w.useEffect(()=>{if(!m||Z)return;function te(ne){m&&ne.relatedTarget&&bi(ne)&&(ne.type==="focusin"?Om:Nb)(m)}return m.addEventListener("focusin",te,!0),m.addEventListener("focusout",te,!0),()=>{m.removeEventListener("focusin",te,!0),m.removeEventListener("focusout",te,!0)}},[m,Z]),w.useEffect(()=>{!m||$||Om(m)},[$,m]);const Q=w.useMemo(()=>({beforeOutsideRef:E,afterOutsideRef:z,beforeInsideRef:j,afterInsideRef:L,portalNode:m,setFocusManagerState:I}),[m]);return g.jsxs(w.Fragment,{children:[A,g.jsxs(L0.Provider,{value:Q,children:[G&&m&&g.jsx(uu,{"data-type":"outside",ref:E,onFocus:te=>{if(bi(te,m))j.current?.focus();else{const ne=B?B.domReference:null;j0(ne)?.focus()}}}),G&&m&&g.jsx("span",{"aria-owns":m.id,style:xh}),m&&tc.createPortal(r,m),G&&m&&g.jsx(uu,{"data-type":"outside",ref:z,onFocus:te=>{if(bi(te,m))L.current?.focus();else{const ne=B?B.domReference:null;N0(ne)?.focus(),B?.closeOnFocusOut&&B?.onOpenChange(!1,An(y0,te.nativeEvent))}}})]})]})});function Cn(i){return i==null?i:"current"in i?i.current:i}function Qb(i,u){const s=un(i.target);return i instanceof s.KeyboardEvent?"keyboard":i instanceof s.FocusEvent?u||"keyboard":"pointerType"in i?i.pointerType||"keyboard":"touches"in i?"touch":i instanceof s.MouseEvent?u||(i.detail===0?"keyboard":"mouse"):""}const Rm=20;let ll=[];function sc(){ll=ll.filter(i=>i.isConnected)}function Gb(i){sc(),i&&fu(i)!=="body"&&(ll.push(i),ll.length>Rm&&(ll=ll.slice(-Rm)))}function Yr(){return sc(),ll[ll.length-1]}function Vb(i){if(!i)return null;const u=Ti();return z0(i,u)?i:_u(i,u)[0]||i}function Zb(i){return!i||!i.isConnected?!1:typeof i.checkVisibility=="function"?i.checkVisibility():oc(i).display!=="none"}function Nm(i,u){if(!u.current.includes("floating")&&!i.getAttribute("role")?.includes("dialog"))return;const s=Ti(),f=Rb(i,s).filter(y=>{const x=y.getAttribute("data-tabindex")||"";return z0(y,s)||y.hasAttribute("data-tabindex")&&!x.startsWith("-")}),_=i.getAttribute("tabindex");u.current.includes("floating")||f.length===0?_!=="0"&&i.setAttribute("tabindex","0"):(_!=="-1"||i.hasAttribute("data-tabindex")&&i.getAttribute("data-tabindex")!=="-1")&&(i.setAttribute("tabindex","-1"),i.setAttribute("data-tabindex","-1"))}function Kb(i){const{context:u,children:s,disabled:r=!1,order:f=["content"],initialFocus:_=!0,returnFocus:y=!0,restoreFocus:x=!1,modal:h=!0,closeOnFocusOut:m=!0,openInteractionType:A="",getInsideElements:E=()=>[],nextFocusableElement:z,previousFocusableElement:j,beforeContentFocusGuardRef:L,externalTree:B}=i,I="rootStore"in u?u.rootStore:u,Z=I.useState("open"),$=I.useState("domReferenceElement"),G=I.useState("floatingElement"),{events:Q,dataRef:te}=I.context,ne=je(()=>te.current.floatingContext?.nodeId),F=je(E),oe=_===!1,H=wm($)&&oe,le=Go(f),re=Go(_),Ce=Go(y),We=Go(A),Xe=D0(B),ce=B0(),N=w.useRef(null),q=w.useRef(null),K=w.useRef(!1),ae=w.useRef(!1),ve=w.useRef(!1),b=w.useRef(-1),U=w.useRef(""),X=w.useRef(""),J=w.useRef(null),se=w.useRef(null),pe=eu(J,L,ce?.beforeInsideRef),Ee=eu(se,ce?.afterInsideRef),Je=tu(),Me=tu(),Yt=U0(),It=ce!=null,D=Wr(G),ge=je((V=D)=>V?_u(V,Ti()):[]),ee=je(V=>{const de=ge(V);return le.current.map(()=>de).filter(Boolean).flat()});w.useEffect(()=>{if(r||!h)return;function V(be){be.key==="Tab"&&at(D,ma(Ot(D)))&&ge().length===0&&!H&&fb(be)}const de=Ot(D);return de.addEventListener("keydown",V),()=>{de.removeEventListener("keydown",V)}},[r,$,D,h,le,H,ge,ee]),w.useEffect(()=>{if(r||!G)return;function V(de){const be=en(de),Ge=ge().indexOf(be);Ge!==-1&&(b.current=Ge)}return G.addEventListener("focusin",V),()=>{G.removeEventListener("focusin",V)}},[r,G,ge]),w.useEffect(()=>{if(r||!Z)return;const V=Ot(D);function de(){ve.current=!1}function be(Ge){const _e=en(Ge),fe=at(G,_e)||at($,_e)||at(ce?.portalNode,_e);ve.current=!fe,X.current=Ge.pointerType||"keyboard"}function Ae(){X.current="keyboard"}return V.addEventListener("pointerdown",be,!0),V.addEventListener("pointerup",de,!0),V.addEventListener("pointercancel",de,!0),V.addEventListener("keydown",Ae,!0),()=>{V.removeEventListener("pointerdown",be,!0),V.removeEventListener("pointerup",de,!0),V.removeEventListener("pointercancel",de,!0),V.removeEventListener("keydown",Ae,!0)}},[r,G,$,D,Z,ce]),w.useEffect(()=>{if(r||!m)return;function V(){ae.current=!0,Me.start(0,()=>{ae.current=!1})}function de(_e){const fe=_e.relatedTarget,pt=_e.currentTarget,Ye=en(_e);queueMicrotask(()=>{const zn=ne(),il=I.context.triggerElements,Cl=fe?.hasAttribute(ou("focus-guard"))&&[J.current,se.current,ce?.beforeInsideRef.current,ce?.afterInsideRef.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,Cn(j),Cn(z)].includes(fe),Rn=!(at($,fe)||at(G,fe)||at(fe,G)||at(ce?.portalNode,fe)||fe!=null&&il.hasElement(fe)||il.hasMatchingElement(bt=>at(bt,fe))||Cl||Xe&&(pa(Xe.nodesRef.current,zn).find(bt=>at(bt.context?.elements.floating,fe)||at(bt.context?.elements.domReference,fe))||Tm(Xe.nodesRef.current,zn).find(bt=>[bt.context?.elements.floating,Wr(bt.context?.elements.floating)].includes(fe)||bt.context?.elements.domReference===fe)));if(pt===$&&D&&Nm(D,le),x&&pt!==$&&!Zb(Ye)&&ma(Ot(D))===Ot(D).body){if(On(D)&&(D.focus(),x==="popup")){Yt.request(()=>{D.focus()});return}const bt=b.current,Nn=ge(),Ol=Nn[bt]||Nn[Nn.length-1]||D;On(Ol)&&Ol.focus()}if(te.current.insideReactTree){te.current.insideReactTree=!1;return}(H||!h)&&fe&&Rn&&!ae.current&&(H||fe!==Yr())&&(K.current=!0,I.setOpen(!1,An(y0,_e)))})}function be(){ve.current||(te.current.insideReactTree=!0,Je.start(0,()=>{te.current.insideReactTree=!1}))}const Ae=On($)?$:null,Ge=[];if(!(!G&&!Ae))return Ae&&(Ae.addEventListener("focusout",de),Ae.addEventListener("pointerdown",V),Ge.push(()=>{Ae.removeEventListener("focusout",de),Ae.removeEventListener("pointerdown",V)})),G&&(G.addEventListener("focusout",de),ce&&(G.addEventListener("focusout",be,!0),Ge.push(()=>{G.removeEventListener("focusout",be,!0)})),Ge.push(()=>{G.removeEventListener("focusout",de)})),()=>{Ge.forEach(_e=>{_e()})}},[r,$,G,D,h,Xe,ce,I,m,x,ge,H,ne,le,te,Je,Me,Yt,z,j]),w.useEffect(()=>{if(r||!G||!Z)return;const V=Array.from(ce?.portalNode?.querySelectorAll(`[${ou("portal")}]`)||[]),be=(Xe?Tm(Xe.nodesRef.current,ne()):[]).find(_e=>wm(_e.context?.elements.domReference||null))?.context?.elements.domReference,Ae=[G,be,...V,...F(),N.current,q.current,J.current,se.current,ce?.beforeOutsideRef.current,ce?.afterOutsideRef.current,Cn(j),Cn(z),H?$:null].filter(_e=>_e!=null),Ge=Bb(Ae,h||H);return()=>{Ge()}},[Z,r,$,G,h,le,ce,H,Xe,ne,F,z,j]),rt(()=>{if(!Z||r||!On(D))return;const V=Ot(D),de=ma(V);queueMicrotask(()=>{const be=ee(D),Ae=re.current,Ge=typeof Ae=="function"?Ae(We.current||""):Ae;if(Ge===void 0||Ge===!1)return;let _e;Ge===!0||Ge===null?_e=be[0]||D:_e=Cn(Ge),_e=_e||be[0]||D,!at(D,de)&&kr(_e,{preventScroll:_e===D})})},[r,Z,D,oe,ee,re,We]),rt(()=>{if(r||!D)return;const V=Ot(D),de=ma(V);Gb(de);function be(_e){if(_e.open||(U.current=Qb(_e.nativeEvent,X.current)),_e.reason===Kh&&_e.nativeEvent.type==="mouseleave"&&(K.current=!0),_e.reason===g0)if(_e.nested)K.current=!1;else if(_b(_e.nativeEvent)||mb(_e.nativeEvent))K.current=!1;else{let fe=!1;document.createElement("div").focus({get preventScroll(){return fe=!0,!1}}),fe?K.current=!1:K.current=!0}}Q.on("openchange",be);const Ae=V.createElement("span");Ae.setAttribute("tabindex","-1"),Ae.setAttribute("aria-hidden","true"),Object.assign(Ae.style,k0),It&&$&&$.insertAdjacentElement("afterend",Ae);function Ge(){const _e=Ce.current;let fe=typeof _e=="function"?_e(U.current):_e;if(fe===void 0||fe===!1)return null;if(fe===null&&(fe=!0),typeof fe=="boolean"){const Ye=$||Yr();return Ye&&Ye.isConnected?Ye:Ae}const pt=$||Yr()||Ae;return Cn(fe)||pt}return()=>{Q.off("openchange",be);const _e=ma(V),fe=at(G,_e)||Xe&&pa(Xe.nodesRef.current,ne(),!1).some(Ye=>at(Ye.context?.elements.floating,_e)),pt=Ge();queueMicrotask(()=>{const Ye=Vb(pt),zn=typeof Ce.current!="boolean";Ce.current&&!K.current&&On(Ye)&&(!(!zn&&Ye!==_e&&_e!==V.body)||fe)&&Ye.focus({preventScroll:!0}),Ae.remove()})}},[r,G,D,Ce,te,Q,Xe,It,$,ne]),w.useEffect(()=>{queueMicrotask(()=>{K.current=!1})},[r]),w.useEffect(()=>{if(r||!Z)return;function V(be){en(be)?.closest(`[${vh}]`)&&(ae.current=!0)}const de=Ot(D);return de.addEventListener("pointerdown",V,!0),()=>{de.removeEventListener("pointerdown",V,!0)}},[r,Z,D]),rt(()=>{if(!r&&ce)return ce.setFocusManagerState({modal:h,closeOnFocusOut:m,open:Z,onOpenChange:I.setOpen,domReference:$}),()=>{ce.setFocusManagerState(null)}},[r,ce,h,Z,I,m,$]),rt(()=>{if(!(r||!D))return Nm(D,le),()=>{queueMicrotask(sc)}},[r,D,le]);const it=!r&&(h?!H:!0)&&(It||h);return g.jsxs(w.Fragment,{children:[it&&g.jsx(uu,{"data-type":"inside",ref:pe,onFocus:V=>{if(h){const de=ee();kr(de[de.length-1])}else ce?.portalNode&&(K.current=!1,bi(V,ce.portalNode)?N0($)?.focus():Cn(j??ce.beforeOutsideRef)?.focus())}}),s,it&&g.jsx(uu,{"data-type":"inside",ref:Ee,onFocus:V=>{h?kr(ee()[0]):ce?.portalNode&&(m&&(K.current=!0),bi(V,ce.portalNode)?j0($)?.focus():Cn(z??ce.afterOutsideRef)?.focus())}})]})}const Jb={intentional:"onClick",sloppy:"onPointerDown"};function Ib(i){return{escapeKey:typeof i=="boolean"?i:i?.escapeKey??!1,outsidePress:typeof i=="boolean"?i:i?.outsidePress??!0}}function Fb(i,u={}){const s="rootStore"in i?i.rootStore:i,r=s.useState("open"),f=s.useState("floatingElement"),_=s.useState("referenceElement"),y=s.useState("domReferenceElement"),{onOpenChange:x,dataRef:h}=s.context,{enabled:m=!0,escapeKey:A=!0,outsidePress:E=!0,outsidePressEvent:z="sloppy",referencePress:j=!1,referencePressEvent:L="sloppy",ancestorScroll:B=!1,bubbles:I,externalTree:Z}=u,$=D0(Z),G=je(typeof E=="function"?E:()=>!1),Q=typeof E=="function"?G:E,te=w.useRef(!1),{escapeKey:ne,outsidePress:F}=Ib(I),oe=w.useRef(null),H=tu(),le=tu(),re=je(()=>{le.clear(),h.current.insideReactTree=!1}),Ce=w.useRef(!1),We=w.useRef(""),Xe=je(D=>{We.current=D.pointerType}),ce=je(()=>{const D=We.current,ge=D==="pen"||!D?"mouse":D,ee=typeof z=="function"?z():z;return typeof ee=="string"?ee:ee[ge]}),N=je(D=>{if(!r||!m||!A||D.key!=="Escape"||Ce.current)return;const ge=h.current.floatingContext?.nodeId,ee=$?pa($.nodesRef.current,ge):[];if(!ne&&ee.length>0){let de=!0;if(ee.forEach(be=>{be.context?.open&&!be.context.dataRef.current.__escapeKeyBubbles&&(de=!1)}),!de)return}const it=db(D)?D.nativeEvent:D,V=An(Ih,it);s.setOpen(!1,V),!ne&&!V.isPropagationAllowed&&D.stopPropagation()}),q=je(D=>{const ge=ce();return ge==="intentional"&&D.type!=="click"||ge==="sloppy"&&D.type==="click"}),K=je(()=>{h.current.insideReactTree=!0,le.start(0,re)}),ae=je((D,ge=!1)=>{if(q(D)){re();return}if(h.current.insideReactTree){re();return}if(ce()==="intentional"&&ge||typeof Q=="function"&&!Q(D))return;const ee=en(D),it=`[${ou("inert")}]`,V=Ot(s.select("floatingElement")).querySelectorAll(it),de=s.context.triggerElements;if(ee&&(de.hasElement(ee)||de.hasMatchingElement(fe=>at(fe,ee))))return;let be=wl(ee)?ee:null;for(;be&&!$o(be);){const fe=_0(be);if($o(fe)||!wl(fe))break;be=fe}if(V.length&&wl(ee)&&!rb(ee)&&!at(ee,s.select("floatingElement"))&&Array.from(V).every(fe=>!at(be,fe)))return;if(On(ee)&&!("touches"in D)){const fe=$o(ee),pt=oc(ee),Ye=/auto|scroll/,zn=fe||Ye.test(pt.overflowX),il=fe||Ye.test(pt.overflowY),Cl=zn&&ee.clientWidth>0&&ee.scrollWidth>ee.clientWidth,Rn=il&&ee.clientHeight>0&&ee.scrollHeight>ee.clientHeight,bt=pt.direction==="rtl",Nn=Rn&&(bt?D.offsetX<=ee.offsetWidth-ee.clientWidth:D.offsetX>ee.clientWidth),Ol=Cl&&D.offsetY>ee.clientHeight;if(Nn||Ol)return}const Ae=h.current.floatingContext?.nodeId,Ge=$&&pa($.nodesRef.current,Ae).some(fe=>Pt(D,fe.context?.elements.floating));if(Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||Ge)return;const _e=$?pa($.nodesRef.current,Ae):[];if(_e.length>0){let fe=!0;if(_e.forEach(pt=>{pt.context?.open&&!pt.context.dataRef.current.__outsidePressBubbles&&(fe=!1)}),!fe)return}s.setOpen(!1,An(g0,D)),re()}),ve=je(D=>{ce()!=="sloppy"||D.pointerType==="touch"||!s.select("open")||!m||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||ae(D)}),b=je(D=>{if(ce()!=="sloppy"||!s.select("open")||!m||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement")))return;const ge=D.touches[0];ge&&(oe.current={startTime:Date.now(),startX:ge.clientX,startY:ge.clientY,dismissOnTouchEnd:!1,dismissOnMouseDown:!0},H.start(1e3,()=>{oe.current&&(oe.current.dismissOnTouchEnd=!1,oe.current.dismissOnMouseDown=!1)}))}),U=je(D=>{const ge=en(D);function ee(){b(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),X=je(D=>{const ge=te.current;if(te.current=!1,H.clear(),D.type==="mousedown"&&oe.current&&!oe.current.dismissOnMouseDown)return;const ee=en(D);function it(){D.type==="pointerdown"?ve(D):ae(D,ge),ee?.removeEventListener(D.type,it)}ee?.addEventListener(D.type,it)}),J=je(D=>{if(ce()!=="sloppy"||!oe.current||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement")))return;const ge=D.touches[0];if(!ge)return;const ee=Math.abs(ge.clientX-oe.current.startX),it=Math.abs(ge.clientY-oe.current.startY),V=Math.sqrt(ee*ee+it*it);V>5&&(oe.current.dismissOnTouchEnd=!0),V>10&&(ae(D),H.clear(),oe.current=null)}),se=je(D=>{const ge=en(D);function ee(){J(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)}),pe=je(D=>{ce()!=="sloppy"||!oe.current||Pt(D,s.select("floatingElement"))||Pt(D,s.select("domReferenceElement"))||(oe.current.dismissOnTouchEnd&&ae(D),H.clear(),oe.current=null)}),Ee=je(D=>{const ge=en(D);function ee(){pe(D),ge?.removeEventListener(D.type,ee)}ge?.addEventListener(D.type,ee)});w.useEffect(()=>{if(!r||!m)return;h.current.__escapeKeyBubbles=ne,h.current.__outsidePressBubbles=F;const D=new ba;function ge(be){s.setOpen(!1,An(Zh,be))}function ee(){D.clear(),Ce.current=!0}function it(){D.start(Dh()?5:0,()=>{Ce.current=!1})}const V=Ot(f);V.addEventListener("pointerdown",Xe,!0),A&&(V.addEventListener("keydown",N),V.addEventListener("compositionstart",ee),V.addEventListener("compositionend",it)),Q&&(V.addEventListener("click",X,!0),V.addEventListener("pointerdown",X,!0),V.addEventListener("touchstart",U,!0),V.addEventListener("touchmove",se,!0),V.addEventListener("touchend",Ee,!0),V.addEventListener("mousedown",X,!0));let de=[];return B&&(wl(y)&&(de=hi(y)),wl(f)&&(de=de.concat(hi(f))),!wl(_)&&_&&_.contextElement&&(de=de.concat(hi(_.contextElement)))),de=de.filter(be=>be!==V.defaultView?.visualViewport),de.forEach(be=>{be.addEventListener("scroll",ge,{passive:!0})}),()=>{V.removeEventListener("pointerdown",Xe,!0),A&&(V.removeEventListener("keydown",N),V.removeEventListener("compositionstart",ee),V.removeEventListener("compositionend",it)),Q&&(V.removeEventListener("click",X,!0),V.removeEventListener("pointerdown",X,!0),V.removeEventListener("touchstart",U,!0),V.removeEventListener("touchmove",se,!0),V.removeEventListener("touchend",Ee,!0),V.removeEventListener("mousedown",X,!0)),de.forEach(be=>{be.removeEventListener("scroll",ge)}),D.clear(),te.current=!1}},[h,f,_,y,A,Q,r,x,B,m,ne,F,N,ae,X,ve,U,se,Ee,Xe,s]),w.useEffect(re,[Q,re]);const Je=w.useMemo(()=>({onKeyDown:N,...j&&{[Jb[L]]:D=>{s.setOpen(!1,An(xm,D.nativeEvent))},...L!=="intentional"&&{onClick(D){s.setOpen(!1,An(xm,D.nativeEvent))}}}}),[N,s,j,L]),Me=je(D=>{const ge=en(D.nativeEvent);!at(s.select("floatingElement"),ge)||D.button!==0||(te.current=!0)}),Yt=je(D=>{!r||!m||D.button!==0||(te.current=!0)}),It=w.useMemo(()=>({onKeyDown:N,onPointerDown:Me,onMouseDown:Me,onMouseUp:Me,onClickCapture:K,onMouseDownCapture(D){K(),Yt(D)},onPointerDownCapture(D){K(),Yt(D)},onMouseUpCapture:K,onTouchEndCapture:K,onTouchMoveCapture:K}),[N,Me,K,Yt]);return w.useMemo(()=>m?{reference:Je,floating:It,trigger:Je}:{},[m,Je,It])}var su=Symbol("NOT_FOUND");function Wb(i,u=`expected a function, instead received ${typeof i}`){if(typeof i!="function")throw new TypeError(u)}function $b(i,u=`expected an object, instead received ${typeof i}`){if(typeof i!="object")throw new TypeError(u)}function Pb(i,u="expected all items to be functions, instead received the following types: "){if(!i.every(s=>typeof s=="function")){const s=i.map(r=>typeof r=="function"?`function ${r.name||"unnamed"}()`:typeof r).join(", ");throw new TypeError(`${u}[${s}]`)}}var jm=i=>Array.isArray(i)?i:[i];function ev(i){const u=Array.isArray(i[0])?i[0]:i;return Pb(u,"createSelector expects all input-selectors to be functions, but received the following types: "),u}function tv(i,u){const s=[],{length:r}=i;for(let f=0;f<r;f++)s.push(i[f].apply(null,u));return s}function nv(i){let u;return{get(s){return u&&i(u.key,s)?u.value:su},put(s,r){u={key:s,value:r}},getEntries(){return u?[u]:[]},clear(){u=void 0}}}function lv(i,u){let s=[];function r(x){const h=s.findIndex(m=>u(x,m.key));if(h>-1){const m=s[h];return h>0&&(s.splice(h,1),s.unshift(m)),m.value}return su}function f(x,h){r(x)===su&&(s.unshift({key:x,value:h}),s.length>i&&s.pop())}function _(){return s}function y(){s=[]}return{get:r,put:f,getEntries:_,clear:y}}var av=(i,u)=>i===u;function iv(i){return function(s,r){if(s===null||r===null||s.length!==r.length)return!1;const{length:f}=s;for(let _=0;_<f;_++)if(!i(s[_],r[_]))return!1;return!0}}function ov(i,u){const s=typeof u=="object"?u:{equalityCheck:u},{equalityCheck:r=av,maxSize:f=1,resultEqualityCheck:_}=s,y=iv(r);let x=0;const h=f<=1?nv(y):lv(f,y);function m(){let A=h.get(arguments);if(A===su){if(A=i.apply(null,arguments),x++,_){const z=h.getEntries().find(j=>_(j.value,A));z&&(A=z.value,x!==0&&x--)}h.put(arguments,A)}return A}return m.clearCache=()=>{h.clear(),m.resetResultsCount()},m.resultsCount=()=>x,m.resetResultsCount=()=>{x=0},m}var uv=class{constructor(i){this.value=i}deref(){return this.value}},sv=typeof WeakRef<"u"?WeakRef:uv,rv=0,Mm=1;function Io(){return{s:rv,v:void 0,o:null,p:null}}function H0(i,u={}){let s=Io();const{resultEqualityCheck:r}=u;let f,_=0;function y(){let x=s;const{length:h}=arguments;for(let E=0,z=h;E<z;E++){const j=arguments[E];if(typeof j=="function"||typeof j=="object"&&j!==null){let L=x.o;L===null&&(x.o=L=new WeakMap);const B=L.get(j);B===void 0?(x=Io(),L.set(j,x)):x=B}else{let L=x.p;L===null&&(x.p=L=new Map);const B=L.get(j);B===void 0?(x=Io(),L.set(j,x)):x=B}}const m=x;let A;if(x.s===Mm)A=x.v;else if(A=i.apply(null,arguments),_++,r){const E=f?.deref?.()??f;E!=null&&r(E,A)&&(A=E,_!==0&&_--),f=typeof A=="object"&&A!==null||typeof A=="function"?new sv(A):A}return m.s=Mm,m.v=A,A}return y.clearCache=()=>{s=Io(),y.resetResultsCount()},y.resultsCount=()=>_,y.resetResultsCount=()=>{_=0},y}function X0(i,...u){const s=typeof i=="function"?{memoize:i,memoizeOptions:u}:i,r=(...f)=>{let _=0,y=0,x,h={},m=f.pop();typeof m=="object"&&(h=m,m=f.pop()),Wb(m,`createSelector expects an output function after the inputs, but received: [${typeof m}]`);const A={...s,...h},{memoize:E,memoizeOptions:z=[],argsMemoize:j=H0,argsMemoizeOptions:L=[]}=A,B=jm(z),I=jm(L),Z=ev(f),$=E(function(){return _++,m.apply(null,arguments)},...B),G=j(function(){y++;const te=tv(Z,arguments);return x=$.apply(null,te),x},...I);return Object.assign(G,{resultFunc:m,memoizedResultFunc:$,dependencies:Z,dependencyRecomputations:()=>y,resetDependencyRecomputations:()=>{y=0},lastResult:()=>x,recomputations:()=>_,resetRecomputations:()=>{_=0},memoize:E,argsMemoize:j})};return Object.assign(r,{withTypes:()=>r}),r}var cv=X0(H0),fv=Object.assign((i,u=cv)=>{$b(i,`createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof i}`);const s=Object.keys(i),r=s.map(_=>i[_]);return u(r,(..._)=>_.reduce((y,x,h)=>(y[s[h]]=x,y),{}))},{withTypes:()=>fv});X0({memoize:ov,memoizeOptions:{maxSize:1,equalityCheck:Object.is}});const Ue=(i,u,s,r,f,_,...y)=>{if(y.length>0)throw new Error(Ei(1));let x;if(i)x=i;else throw new Error("Missing arguments");return x};var Lr={exports:{}},Br={};var Dm;function dv(){if(Dm)return Br;Dm=1;var i=Si();function u(E,z){return E===z&&(E!==0||1/E===1/z)||E!==E&&z!==z}var s=typeof Object.is=="function"?Object.is:u,r=i.useState,f=i.useEffect,_=i.useLayoutEffect,y=i.useDebugValue;function x(E,z){var j=z(),L=r({inst:{value:j,getSnapshot:z}}),B=L[0].inst,I=L[1];return _(function(){B.value=j,B.getSnapshot=z,h(B)&&I({inst:B})},[E,j,z]),f(function(){return h(B)&&I({inst:B}),E(function(){h(B)&&I({inst:B})})},[E]),y(j),j}function h(E){var z=E.getSnapshot;E=E.value;try{var j=z();return!s(E,j)}catch{return!0}}function m(E,z){return z()}var A=typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"?m:x;return Br.useSyncExternalStore=i.useSyncExternalStore!==void 0?i.useSyncExternalStore:A,Br}var km;function q0(){return km||(km=1,Lr.exports=dv()),Lr.exports}var _v=q0(),Hr={exports:{}},Xr={};var Um;function mv(){if(Um)return Xr;Um=1;var i=Si(),u=q0();function s(m,A){return m===A&&(m!==0||1/m===1/A)||m!==m&&A!==A}var r=typeof Object.is=="function"?Object.is:s,f=u.useSyncExternalStore,_=i.useRef,y=i.useEffect,x=i.useMemo,h=i.useDebugValue;return Xr.useSyncExternalStoreWithSelector=function(m,A,E,z,j){var L=_(null);if(L.current===null){var B={hasValue:!1,value:null};L.current=B}else B=L.current;L=x(function(){function Z(ne){if(!$){if($=!0,G=ne,ne=z(ne),j!==void 0&&B.hasValue){var F=B.value;if(j(F,ne))return Q=F}return Q=ne}if(F=Q,r(G,ne))return F;var oe=z(ne);return j!==void 0&&j(F,oe)?(G=ne,F):(G=ne,Q=oe)}var $=!1,G,Q,te=E===void 0?null:E;return[function(){return Z(A())},te===null?void 0:function(){return Z(te())}]},[A,E,z,j]);var I=f(m,L[0],L[1]);return y(function(){B.hasValue=!0,B.value=I},[I]),h(I),I},Xr}var Ym;function gv(){return Ym||(Ym=1,Hr.exports=mv()),Hr.exports}var yv=gv();const pv=ac(19),hv=pv?vv:xv;function bv(i,u,s,r,f){return hv(i,u,s,r,f)}function vv(i,u,s,r,f){const _=w.useCallback(()=>u(i.getSnapshot(),s,r,f),[i,u,s,r,f]);return _v.useSyncExternalStore(i.subscribe,_,_)}function xv(i,u,s,r,f){return yv.useSyncExternalStoreWithSelector(i.subscribe,i.getSnapshot,i.getSnapshot,_=>u(_,s,r,f))}class vi{constructor(u){this.state=u,this.listeners=new Set,this.updateTick=0}subscribe=u=>(this.listeners.add(u),()=>{this.listeners.delete(u)});getSnapshot=()=>this.state;setState(u){if(this.state===u)return;this.state=u,this.updateTick+=1;const s=this.updateTick;for(const r of this.listeners){if(s!==this.updateTick)return;r(u)}}update(u){for(const s in u)if(!Object.is(this.state[s],u[s])){vi.prototype.setState.call(this,{...this.state,...u});return}}set(u,s){Object.is(this.state[u],s)||vi.prototype.setState.call(this,{...this.state,[u]:s})}notifyAll(){const u={...this.state};vi.prototype.setState.call(this,u)}}class Q0 extends vi{constructor(u,s={},r){super(u),this.context=s,this.selectors=r}controlledValues=new Map;useSyncedValue(u,s){w.useDebugValue(u),rt(()=>{this.state[u]!==s&&this.set(u,s)},[u,s])}useSyncedValueWithCleanup(u,s){const r=this;rt(()=>(r.state[u]!==s&&r.set(u,s),()=>{r.set(u,void 0)}),[r,u,s])}useSyncedValues(u){const s=this,r=Object.values(u);rt(()=>{s.update(u)},[s,...r])}useControlledProp(u,s,r){w.useDebugValue(u);const f=this,_=s!==void 0;this.controlledValues.has(u)||(this.controlledValues.set(u,_),!_&&!Object.is(this.state[u],r)&&super.setState({...this.state,[u]:r})),rt(()=>{_&&!Object.is(f.state[u],s)&&super.setState({...f.state,[u]:s})},[f,u,s,r,_])}set(u,s){this.controlledValues.get(u)!==!0&&super.set(u,s)}update(u){const s={...u};for(const r in s)if(Object.hasOwn(s,r)&&this.controlledValues.get(r)===!0){delete s[r];continue}super.update(s)}setState(u){const s={...u};for(const r in s)if(Object.hasOwn(s,r)&&this.controlledValues.get(r)===!0){delete s[r];continue}super.setState({...this.state,...s})}select=(u,s,r,f)=>{const _=this.selectors[u];return _(this.state,s,r,f)};useState=(u,s,r,f)=>{w.useDebugValue(u);const _=this.selectors[u];return bv(this,_,s,r,f)};useContextCallback(u,s){w.useDebugValue(u);const r=je(s??c0);this.context[u]=r}useStateSetter(u){const s=w.useRef(void 0);return s.current===void 0&&(s.current=r=>{this.set(u,r)}),s.current}observe(u,s){let r;typeof u=="function"?r=u:r=this.selectors[u];let f=r(this.state);return s(f,f,this),this.subscribe(_=>{const y=r(_);if(!Object.is(f,y)){const x=f;f=y,s(y,x,this)}})}}const Sv={open:Ue(i=>i.open),domReferenceElement:Ue(i=>i.domReferenceElement),referenceElement:Ue(i=>i.positionReference??i.referenceElement),floatingElement:Ue(i=>i.floatingElement),floatingId:Ue(i=>i.floatingId)};class G0 extends Q0{constructor(u){const{nested:s,noEmit:r,onOpenChange:f,triggerElements:_,...y}=u;super({...y,positionReference:y.referenceElement,domReferenceElement:y.referenceElement},{onOpenChange:f,dataRef:{current:{}},events:jb(),nested:s,noEmit:r,triggerElements:_},Sv)}setOpen=(u,s)=>{if((!u||!this.state.open||gb(s.event))&&(this.context.dataRef.current.openEvent=u?s.event:void 0),!this.context.noEmit){const r={open:u,reason:s.reason,nativeEvent:s.event,nested:this.context.nested,triggerElement:s.trigger};this.context.events.emit("openchange",r)}this.context.onOpenChange?.(u,s)}}function Ev(i,u=!1,s=!1){const[r,f]=w.useState(i&&u?"idle":void 0),[_,y]=w.useState(i);return i&&!_&&(y(!0),f("starting")),!i&&_&&r!=="ending"&&!s&&f("ending"),!i&&!_&&r==="ending"&&f(void 0),rt(()=>{if(!i&&_&&r!=="ending"&&s){const x=on.request(()=>{f("ending")});return()=>{on.cancel(x)}}},[i,_,r,s]),rt(()=>{if(!i||u)return;const x=on.request(()=>{f(void 0)});return()=>{on.cancel(x)}},[u,i]),rt(()=>{if(!i||!u)return;i&&_&&r!=="idle"&&f("starting");const x=on.request(()=>{f("idle")});return()=>{on.cancel(x)}},[u,i,_,f,r]),w.useMemo(()=>({mounted:_,setMounted:y,transitionStatus:r}),[_,r])}function wv(i,u=!1,s=!0){const r=U0();return je((f,_=null)=>{r.cancel();function y(){tc.flushSync(f)}const x=Cn(i);if(x==null)return;const h=x;if(typeof h.getAnimations!="function"||globalThis.BASE_UI_ANIMATIONS_DISABLED)f();else{let E=function(){const j=xi.startingStyle;if(!h.hasAttribute(j)){r.request(z);return}const L=new MutationObserver(()=>{h.hasAttribute(j)||(L.disconnect(),z())});L.observe(h,{attributes:!0,attributeFilter:[j]}),_?.addEventListener("abort",()=>L.disconnect(),{once:!0})},z=function(){Promise.all(h.getAnimations().map(j=>j.finished)).then(()=>{_?.aborted||y()}).catch(()=>{const j=h.getAnimations();if(s){if(_?.aborted)return;y()}else j.length>0&&j.some(L=>L.pending||L.playState!=="finished")&&z()})};var m=E,A=z;if(u){E();return}r.request(z)}})}function V0(i){const{enabled:u=!0,open:s,ref:r,onComplete:f}=i,_=je(f),y=wv(r,s,!1);w.useEffect(()=>{if(!u)return;const x=new AbortController;return y(_,x.signal),()=>{x.abort()}},[u,s,_,y])}function Tv(i){const u=i.useState("open");rt(()=>{if(u&&!i.select("activeTriggerId")&&i.context.triggerElements.size===1){const s=i.context.triggerElements.entries().next();if(!s.done){const[r,f]=s.value;i.update({activeTriggerId:r,activeTriggerElement:f})}}},[u,i])}function Cv(i,u,s){const{mounted:r,setMounted:f,transitionStatus:_}=Ev(i);u.useSyncedValues({mounted:r,transitionStatus:_});const y=je(()=>{f(!1),u.update({activeTriggerId:null,activeTriggerElement:null,mounted:!1}),s?.(),u.context.onOpenChangeComplete?.(!1)}),x=u.useState("preventUnmountingOnClose");return V0({enabled:!x,open:i,ref:u.context.popupRef,onComplete(){i||y()}}),{forceUnmount:y,transitionStatus:_}}class Z0{constructor(){this.elements=new Set,this.idMap=new Map}add(u,s){const r=this.idMap.get(u);r!==s&&(r!==void 0&&this.elements.delete(r),this.elements.add(s),this.idMap.set(u,s))}delete(u){const s=this.idMap.get(u);s&&(this.elements.delete(s),this.idMap.delete(u))}hasElement(u){return this.elements.has(u)}hasMatchingElement(u){for(const s of this.elements)if(u(s))return!0;return!1}getById(u){return this.idMap.get(u)}entries(){return this.idMap.entries()}get size(){return this.idMap.size}}function Ov(){return new G0({open:!1,floatingElement:null,referenceElement:null,triggerElements:new Z0,floatingId:"",nested:!1,noEmit:!1,onOpenChange:void 0})}function Av(){return{open:!1,mounted:!1,transitionStatus:"idle",floatingRootContext:Ov(),preventUnmountingOnClose:!1,payload:void 0,activeTriggerId:null,activeTriggerElement:null,popupElement:null,positionerElement:null,activeTriggerProps:Jt,inactiveTriggerProps:Jt,popupProps:Jt}}const zv={open:Ue(i=>i.open),mounted:Ue(i=>i.mounted),transitionStatus:Ue(i=>i.transitionStatus),floatingRootContext:Ue(i=>i.floatingRootContext),preventUnmountingOnClose:Ue(i=>i.preventUnmountingOnClose),payload:Ue(i=>i.payload),activeTriggerId:Ue(i=>i.activeTriggerId),activeTriggerElement:Ue(i=>i.mounted?i.activeTriggerElement:null),isTriggerActive:Ue((i,u)=>u!==void 0&&i.activeTriggerId===u),isOpenedByTrigger:Ue((i,u)=>u!==void 0&&i.activeTriggerId===u&&i.open),isMountedByTrigger:Ue((i,u)=>u!==void 0&&i.activeTriggerId===u&&i.mounted),triggerProps:Ue((i,u)=>u?i.activeTriggerProps:i.inactiveTriggerProps),popupProps:Ue(i=>i.popupProps),popupElement:Ue(i=>i.popupElement),positionerElement:Ue(i=>i.positionerElement)};function Rv(i){const{popupStore:u,noEmit:s=!1,treatPopupAsFloatingElement:r=!1,onOpenChange:f}=i,_=uc(),y=M0()!=null,x=u.useState("open"),h=u.useState("activeTriggerElement"),m=u.useState(r?"popupElement":"positionerElement"),A=u.context.triggerElements,E=al(()=>new G0({open:x,referenceElement:h,floatingElement:m,triggerElements:A,onOpenChange:f,floatingId:_,nested:y,noEmit:s})).current;return rt(()=>{const z={open:x,floatingId:_,referenceElement:h,floatingElement:m};wl(h)&&(z.domReferenceElement=h),E.state.positionReference===E.state.referenceElement&&(z.positionReference=h),E.update(z)},[x,_,h,m,E]),E.context.onOpenChange=f,E.context.nested=y,E.context.noEmit=s,E}function Nv(i=[]){const u=i.map(m=>m?.reference),s=i.map(m=>m?.floating),r=i.map(m=>m?.item),f=i.map(m=>m?.trigger),_=w.useCallback(m=>Fo(m,i,"reference"),u),y=w.useCallback(m=>Fo(m,i,"floating"),s),x=w.useCallback(m=>Fo(m,i,"item"),r),h=w.useCallback(m=>Fo(m,i,"trigger"),f);return w.useMemo(()=>({getReferenceProps:_,getFloatingProps:y,getItemProps:x,getTriggerProps:h}),[_,y,x,h])}function Fo(i,u,s){const r=new Map,f=s==="item",_={};s==="floating"&&(_.tabIndex=-1,_[Fr]="");for(const y in i)f&&i&&(y===x0||y===S0)||(_[y]=i[y]);for(let y=0;y<u.length;y+=1){let x;const h=u[y]?.[s];typeof h=="function"?x=i?h(i):null:x=h,x&&Lm(_,x,f,r)}return Lm(_,i,f,r),_}function Lm(i,u,s,r){for(const f in u){const _=u[f];s&&(f===x0||f===S0)||(f.startsWith("on")?(r.has(f)||r.set(f,[]),typeof _=="function"&&(r.get(f)?.push(_),i[f]=(...y)=>r.get(f)?.map(x=>x(...y)).find(x=>x!==void 0))):i[f]=_)}}const jv=new Map([["select","listbox"],["combobox","listbox"],["label",!1]]);function Mv(i,u={}){const s="rootStore"in i?i.rootStore:i,r=s.useState("open"),f=s.useState("floatingId"),_=s.useState("domReferenceElement"),y=s.useState("floatingElement"),{enabled:x=!0,role:h="dialog"}=u,m=uc(),A=_?.id||m,E=w.useMemo(()=>Wr(y)?.id||f,[y,f]),z=jv.get(h)??h,L=M0()!=null,B=w.useMemo(()=>z==="tooltip"||h==="label"?Jt:{"aria-haspopup":z==="alertdialog"?"dialog":z,"aria-expanded":"false",...z==="listbox"&&{role:"combobox"},...z==="menu"&&L&&{role:"menuitem"},...h==="select"&&{"aria-autocomplete":"none"},...h==="combobox"&&{"aria-autocomplete":"list"}},[z,L,h]),I=w.useMemo(()=>z==="tooltip"||h==="label"?{[`aria-${h==="label"?"labelledby":"describedby"}`]:r?E:void 0}:{...B,"aria-expanded":r?"true":"false","aria-controls":r?E:void 0,...z==="menu"&&{id:A}},[z,E,r,A,h,B]),Z=w.useMemo(()=>{const G={id:E,...z&&{role:z}};return z==="tooltip"||h==="label"?G:{...G,...z==="menu"&&{"aria-labelledby":A}}},[z,E,A,h]),$=w.useCallback(({active:G,selected:Q})=>{const te={role:"option",...G&&{id:`${E}-fui-option`}};switch(h){case"select":case"combobox":return{...te,"aria-selected":Q}}return{}},[E,h]);return w.useMemo(()=>x?{reference:I,floating:Z,item:$,trigger:B}:{},[x,I,Z,B,$])}let Dv=(function(i){return i.nestedDialogs="--nested-dialogs",i})({}),kv=(function(i){return i[i.open=Tl.open]="open",i[i.closed=Tl.closed]="closed",i[i.startingStyle=Tl.startingStyle]="startingStyle",i[i.endingStyle=Tl.endingStyle]="endingStyle",i.nested="data-nested",i.nestedDialogOpen="data-nested-dialog-open",i})({});const K0=w.createContext(void 0);function Uv(){const i=w.useContext(K0);if(i===void 0)throw new Error(Ei(26));return i}const J0="ArrowUp",I0="ArrowDown",F0="ArrowLeft",W0="ArrowRight",$0="Home",P0="End",Yv=new Set([F0,W0]),Lv=new Set([J0,I0]),Bv=new Set([...Yv,...Lv]);[...Bv];const Hv=new Set([J0,I0,F0,W0,$0,P0]),Xv={...d0,...f0,nestedDialogOpen(i){return i?{[kv.nestedDialogOpen]:""}:null}},qv=w.forwardRef(function(u,s){const{className:r,finalFocus:f,initialFocus:_,render:y,...x}=u,{store:h}=wi(),m=h.useState("descriptionElementId"),A=h.useState("disablePointerDismissal"),E=h.useState("floatingRootContext"),z=h.useState("popupProps"),j=h.useState("modal"),L=h.useState("mounted"),B=h.useState("nested"),I=h.useState("nestedOpenDialogCount"),Z=h.useState("open"),$=h.useState("openMethod"),G=h.useState("titleElementId"),Q=h.useState("transitionStatus"),te=h.useState("role");Uv(),V0({open:Z,ref:h.context.popupRef,onComplete(){Z&&h.context.onOpenChangeComplete?.(!0)}});function ne(re){return re==="touch"?h.context.popupRef.current:!0}const F=_===void 0?ne:_,oe=I>0,H=w.useMemo(()=>({open:Z,nested:B,transitionStatus:Q,nestedDialogOpen:oe}),[Z,B,Q,oe]),le=ru("div",u,{state:H,props:[z,{"aria-labelledby":G??void 0,"aria-describedby":m??void 0,role:te,tabIndex:-1,hidden:!L,onKeyDown(re){Hv.has(re.key)&&re.stopPropagation()},style:{[Dv.nestedDialogs]:I}},x],ref:[s,h.context.popupRef,h.useStateSetter("popupElement")],stateAttributesMapping:Xv});return g.jsx(Kb,{context:E,openInteractionType:$,disabled:!L,closeOnFocusOut:!A,initialFocus:F,returnFocus:f,modal:j!==!1,restoreFocus:"popup",children:le})});function Qv(i){return ac(19)?i:i?"true":void 0}const Gv=w.forwardRef(function(u,s){const{cutout:r,...f}=u;let _;if(r){const y=r?.getBoundingClientRect();_=`polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      0% 100%,
      0% 0%,
      ${y.left}px ${y.top}px,
      ${y.left}px ${y.bottom}px,
      ${y.right}px ${y.bottom}px,
      ${y.right}px ${y.top}px,
      ${y.left}px ${y.top}px
    )`}return g.jsx("div",{ref:s,role:"presentation","data-base-ui-inert":"",...f,style:{position:"fixed",inset:0,userSelect:"none",WebkitUserSelect:"none",clipPath:_}})}),Vv=w.forwardRef(function(u,s){const{keepMounted:r=!1,...f}=u,{store:_}=wi(),y=_.useState("mounted"),x=_.useState("modal"),h=_.useState("open");return y||r?g.jsx(K0.Provider,{value:r,children:g.jsxs(qb,{ref:s,...f,children:[y&&x===!0&&g.jsx(Gv,{ref:_.context.internalBackdropRef,inert:Qv(!h)}),u.children]})}):null});let Bm={},Hm={},Xm="";function Zv(i){if(typeof document>"u")return!1;const u=Ci(i);return un(u).innerWidth-u.documentElement.clientWidth>0}function Kv(i){if(!(typeof CSS<"u"&&CSS.supports&&CSS.supports("scrollbar-gutter","stable"))||typeof document>"u")return!1;const r=Ci(i).documentElement,f={scrollbarGutter:r.style.scrollbarGutter,overflowY:r.style.overflowY};r.style.scrollbarGutter="stable",r.style.overflowY="scroll";const _=r.offsetWidth;r.style.overflowY="hidden";const y=r.offsetWidth;return Object.assign(r.style,f),_===y}function Jv(i){const u=Ci(i),s=u.documentElement,r=u.body,f=du(s)?s:r,_=f.style.overflow;return f.style.overflow="hidden",()=>{f.style.overflow=_}}function Iv(i){const u=Ci(i),s=u.documentElement,r=u.body,f=un(s);let _=0,y=0,x=!1;const h=on.create();if(nb&&(f.visualViewport?.scale??1)!==1)return()=>{};function m(){const z=f.getComputedStyle(s),j=f.getComputedStyle(r),I=(z.scrollbarGutter||"").includes("both-edges")?"stable both-edges":"stable";_=s.scrollTop,y=s.scrollLeft,Bm={scrollbarGutter:s.style.scrollbarGutter,overflowY:s.style.overflowY,overflowX:s.style.overflowX},Xm=s.style.scrollBehavior,Hm={position:r.style.position,height:r.style.height,width:r.style.width,boxSizing:r.style.boxSizing,overflowY:r.style.overflowY,overflowX:r.style.overflowX,scrollBehavior:r.style.scrollBehavior};const Z=s.scrollHeight>s.clientHeight,$=s.scrollWidth>s.clientWidth,G=z.overflowY==="scroll"||j.overflowY==="scroll",Q=z.overflowX==="scroll"||j.overflowX==="scroll",te=Math.max(0,f.innerWidth-r.clientWidth),ne=Math.max(0,f.innerHeight-r.clientHeight),F=parseFloat(j.marginTop)+parseFloat(j.marginBottom),oe=parseFloat(j.marginLeft)+parseFloat(j.marginRight),H=du(s)?s:r;if(x=Kv(i),x){s.style.scrollbarGutter=I,H.style.overflowY="hidden",H.style.overflowX="hidden";return}Object.assign(s.style,{scrollbarGutter:I,overflowY:"hidden",overflowX:"hidden"}),(Z||G)&&(s.style.overflowY="scroll"),($||Q)&&(s.style.overflowX="scroll"),Object.assign(r.style,{position:"relative",height:F||ne?`calc(100dvh - ${F+ne}px)`:"100dvh",width:oe||te?`calc(100vw - ${oe+te}px)`:"100vw",boxSizing:"border-box",overflow:"hidden",scrollBehavior:"unset"}),r.scrollTop=_,r.scrollLeft=y,s.setAttribute("data-base-ui-scroll-locked",""),s.style.scrollBehavior="unset"}function A(){Object.assign(s.style,Bm),Object.assign(r.style,Hm),x||(s.scrollTop=_,s.scrollLeft=y,s.removeAttribute("data-base-ui-scroll-locked"),s.style.scrollBehavior=Xm)}function E(){A(),h.request(m)}return m(),f.addEventListener("resize",E),()=>{h.cancel(),A(),typeof f.removeEventListener=="function"&&f.removeEventListener("resize",E)}}class Fv{lockCount=0;restore=null;timeoutLock=ba.create();timeoutUnlock=ba.create();acquire(u){return this.lockCount+=1,this.lockCount===1&&this.restore===null&&this.timeoutLock.start(0,()=>this.lock(u)),this.release}release=()=>{this.lockCount-=1,this.lockCount===0&&this.restore&&this.timeoutUnlock.start(0,this.unlock)};unlock=()=>{this.lockCount===0&&this.restore&&(this.restore?.(),this.restore=null)};lock(u){if(this.lockCount===0||this.restore!==null)return;const r=Ci(u).documentElement,f=un(r).getComputedStyle(r).overflowY;if(f==="hidden"||f==="clip"){this.restore=c0;return}const _=v0||!Zv(u);this.restore=_?Jv(u):Iv(u)}}const Wv=new Fv;function $v(i=!0,u=null){rt(()=>{if(i)return Wv.acquire(u)},[i,u])}function Pv(i){const u=w.useRef(""),s=w.useCallback(f=>{f.defaultPrevented||(u.current=f.pointerType,i(f,f.pointerType))},[i]);return{onClick:w.useCallback(f=>{if(f.detail===0){i(f,"keyboard");return}"pointerType"in f&&i(f,f.pointerType),i(f,u.current),u.current=""},[i]),onPointerDown:s}}function e1(i){const[u,s]=w.useState(null),r=je((x,h)=>{i||s(h||(v0?"touch":""))}),f=w.useCallback(()=>{s(null)},[]),{onClick:_,onPointerDown:y}=Pv(r);return w.useMemo(()=>({openMethod:u,reset:f,triggerProps:{onClick:_,onPointerDown:y}}),[u,f,_,y])}function t1(i){const{store:u,parentContext:s,actionsRef:r}=i,f=u.useState("open"),_=u.useState("disablePointerDismissal"),y=u.useState("modal"),x=u.useState("popupElement"),{openMethod:h,triggerProps:m,reset:A}=e1(f);Tv(u);const{forceUnmount:E}=Cv(f,u,()=>{A()}),z=je(le=>{const re=An(le);return re.preventUnmountOnClose=()=>{u.set("preventUnmountingOnClose",!0)},re}),j=w.useCallback(()=>{u.setOpen(!1,z(Fh))},[u,z]);w.useImperativeHandle(r,()=>({unmount:E,close:j}),[E,j]);const L=Rv({popupStore:u,onOpenChange:u.setOpen,treatPopupAsFloatingElement:!0,noEmit:!0}),[B,I]=w.useState(0),Z=B===0,$=Mv(L),G=Fb(L,{outsidePressEvent(){return u.context.internalBackdropRef.current||u.context.backdropRef.current?"intentional":{mouse:y==="trap-focus"?"sloppy":"intentional",touch:"sloppy"}},outsidePress(le){if("button"in le&&le.button!==0||"touches"in le&&le.touches.length!==1)return!1;const re=en(le);if(Z&&!_){const Ce=re;return y&&(u.context.internalBackdropRef.current||u.context.backdropRef.current)?u.context.internalBackdropRef.current===Ce||u.context.backdropRef.current===Ce||at(Ce,x)&&!Ce?.hasAttribute("data-base-ui-portal"):!0}return!1},escapeKey:Z});$v(f&&y===!0,x);const{getReferenceProps:Q,getFloatingProps:te,getTriggerProps:ne}=Nv([$,G]);u.useContextCallback("onNestedDialogOpen",le=>{I(le+1)}),u.useContextCallback("onNestedDialogClose",()=>{I(0)}),w.useEffect(()=>(s?.onNestedDialogOpen&&f&&s.onNestedDialogOpen(B),s?.onNestedDialogClose&&!f&&s.onNestedDialogClose(),()=>{s?.onNestedDialogClose&&f&&s.onNestedDialogClose()}),[f,s,B]);const F=w.useMemo(()=>Q(m),[Q,m]),oe=w.useMemo(()=>ne(m),[ne,m]),H=w.useMemo(()=>te(),[te]);u.useSyncedValues({openMethod:h,activeTriggerProps:F,inactiveTriggerProps:oe,popupProps:H,floatingRootContext:L,nestedOpenDialogCount:B})}const n1={...zv,modal:Ue(i=>i.modal),nested:Ue(i=>i.nested),nestedOpenDialogCount:Ue(i=>i.nestedOpenDialogCount),disablePointerDismissal:Ue(i=>i.disablePointerDismissal),openMethod:Ue(i=>i.openMethod),descriptionElementId:Ue(i=>i.descriptionElementId),titleElementId:Ue(i=>i.titleElementId),viewportElement:Ue(i=>i.viewportElement),role:Ue(i=>i.role)};class l1 extends Q0{constructor(u){super(a1(u),{popupRef:w.createRef(),backdropRef:w.createRef(),internalBackdropRef:w.createRef(),triggerElements:new Z0,onOpenChange:void 0,onOpenChangeComplete:void 0},n1)}setOpen=(u,s)=>{if(s.preventUnmountOnClose=()=>{this.set("preventUnmountingOnClose",!0)},!u&&s.trigger==null&&this.state.activeTriggerId!=null&&(s.trigger=this.state.activeTriggerElement??void 0),this.context.onOpenChange?.(u,s),s.isCanceled)return;const r={open:u,nativeEvent:s.event,reason:s.reason,nested:this.state.nested};this.state.floatingRootContext.context.events?.emit("openchange",r);const f={open:u},_=s.trigger?.id??null;(_||u)&&(f.activeTriggerId=_,f.activeTriggerElement=s.trigger??null),this.update(f)}}function a1(i={}){return{...Av(),modal:!0,disablePointerDismissal:!1,popupElement:null,viewportElement:null,descriptionElementId:void 0,titleElementId:void 0,openMethod:null,nested:!1,nestedOpenDialogCount:0,role:"dialog",...i}}function i1(i){const{children:u,open:s,defaultOpen:r=!1,onOpenChange:f,onOpenChangeComplete:_,disablePointerDismissal:y=!1,modal:x=!0,actionsRef:h,handle:m,triggerId:A,defaultTriggerId:E=null}=i,z=wi(!0),j=!!z,L=al(()=>m?.store??new l1({open:s??r,activeTriggerId:A!==void 0?A:E,modal:x,disablePointerDismissal:y,nested:j})).current;L.useControlledProp("open",s,r),L.useControlledProp("activeTriggerId",A,E),L.useSyncedValues({disablePointerDismissal:y,nested:j,modal:x}),L.useContextCallback("onOpenChange",f),L.useContextCallback("onOpenChangeComplete",_);const B=L.useState("payload");t1({store:L,actionsRef:h,parentContext:z?.store.context});const I=w.useMemo(()=>({store:L}),[L]);return g.jsx(a0.Provider,{value:I,children:typeof u=="function"?u({payload:B}):u})}function o1(i){return i.toLowerCase().endsWith(".webm")}function qm(i,u){return u===0?0:(i%u+u)%u}function u1({cards:i,open:u,selectedIndex:s,prefersReducedMotion:r,onOpenChange:f,onSelectedIndexChange:_}){const y=w.useRef(null),x=w.useMemo(()=>qm(s,i.length),[i.length,s]),h=i[x],m=w.useCallback(A=>{i.length<=1||_(qm(x+A,i.length))},[i.length,_,x]);return w.useEffect(()=>{if(!u)return;const A=E=>{E.key==="ArrowLeft"?(E.preventDefault(),m(-1)):E.key==="ArrowRight"?(E.preventDefault(),m(1)):E.key==="Escape"&&(E.preventDefault(),f(!1))};return window.addEventListener("keydown",A),()=>window.removeEventListener("keydown",A)},[m,f,u]),h?g.jsx(i1,{open:u,onOpenChange:f,children:g.jsxs(Vv,{children:[g.jsx(Nh,{className:"preview-gallery-backdrop"}),g.jsx("div",{className:"preview-gallery-shell",children:g.jsxs(qv,{className:"preview-gallery-popup","aria-label":`${h.title} gallery preview`,children:[g.jsx(Wh,{className:"preview-gallery-close","aria-label":"Close gallery",children:g.jsx("span",{"aria-hidden":"true",children:"x"})}),g.jsx("div",{className:"preview-gallery-media-frame",onTouchStart:A=>{y.current=A.changedTouches[0]?.clientX??null},onTouchEnd:A=>{const E=y.current;if(E==null)return;const j=(A.changedTouches[0]?.clientX??E)-E;Math.abs(j)>=56&&m(j>0?-1:1),y.current=null},children:o1(h.image)?g.jsx("video",{src:h.image,muted:!0,loop:!r,autoPlay:!r,playsInline:!0,preload:r?"none":"metadata",controls:!0,"aria-label":h.title,className:"preview-gallery-media"}):g.jsx("img",{src:h.image,alt:h.title,className:"preview-gallery-media",loading:"eager",decoding:"async"})}),g.jsxs("div",{className:"preview-gallery-meta",children:[g.jsx("p",{children:h.title}),g.jsxs("span",{children:[x+1," / ",i.length]})]}),g.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-prev","aria-label":"Previous preview",onClick:()=>m(-1),disabled:i.length<=1,children:g.jsx("span",{"aria-hidden":"true",children:"<"})}),g.jsx("button",{type:"button",className:"preview-gallery-nav preview-gallery-nav-next","aria-label":"Next preview",onClick:()=>m(1),disabled:i.length<=1,children:g.jsx("span",{"aria-hidden":"true",children:">"})})]})})]})}):null}const qr=[{name:"0x / Matcha",logoUrls:["/logos/0x.png","/logos/matcha.svg"],href:"https://matcha.xyz"},{name:"Moody's",logoUrls:["/logos/moodys.png"],href:"https://www.moodys.com"},{name:"Twilio",logoUrls:["/logos/twilio.svg"],href:"https://www.twilio.com"},{name:"Google",logoUrls:["/logos/Google_logo.svg"],href:"https://www.google.com"},{name:"Onit",logoUrls:["/logos/onit.png"],href:"https://www.onit.com"},{name:"Chainlink",logoUrls:["/logos/chainlink.svg"],href:"https://chain.link"}];function eg(){return g.jsx("span",{className:"mosaic-company-inline-list","aria-label":"Companies I have worked with",children:qr.map((i,u)=>g.jsxs("span",{className:"mosaic-company-inline-item",children:[g.jsx(_a,{href:i.href,logoUrls:i.logoUrls,className:"mosaic-company-inline-link",ariaLabel:`${i.name} website`,title:i.name,children:i.name}),u<qr.length-2?", ":u===qr.length-2?", and ":""]},i.name))})}const Qm=["tall","sm","sm","wide","sm","tall","wide","sm","sm","wide","sm","sm"],s1=new Intl.DateTimeFormat("en-US",{hour:"numeric",minute:"2-digit",hour12:!0,timeZone:"America/Santo_Domingo",timeZoneName:"short"});function Qr(i){return i.toLowerCase().endsWith(".webm")}function Gm(i){if(i!=="#")return i}function Vm(i){if(i.id==="preview-shot-20")return!0;const u=i.previewAspectRatio;return u==null?!1:u>1.45||u<.82}function Zm(i=new Date){return s1.format(i)}function Km(i,u,s,r){l0("work_preview_open",{preview_id:i.id,preview_title:i.title,preview_index:u+1,preview_placement:s}),r(u)}function r1({label:i,reducedMotion:u}){const[s,r]=w.useState(i),[f,_]=w.useState(null),[y,x]=w.useState(!1),h=w.useRef(null);return w.useEffect(()=>{if(i===s)return;if(u){r(i),_(null),x(!1);return}h.current!==null&&window.clearTimeout(h.current),_(i);const m=window.requestAnimationFrame(()=>{x(!0),h.current=window.setTimeout(()=>{r(i),_(null),x(!1),h.current=null},240)});return()=>{window.cancelAnimationFrame(m),h.current!==null&&(window.clearTimeout(h.current),h.current=null)}},[s,i,u]),g.jsx("span",{className:`mosaic-live-time ${y?"is-animating":""}`,"aria-live":"polite","aria-atomic":"true",children:g.jsxs("span",{className:"mosaic-live-time-track",children:[g.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-current",children:s}),f?g.jsx("span",{className:"mosaic-live-time-value mosaic-live-time-value-next",children:f}):null]})})}function c1({cards:i,profile:u,links:s,showProjects:r=!0}){const[f,_]=w.useState(!1),[y,x]=w.useState(null),[h,m]=w.useState(()=>Zm()),A=w.useMemo(()=>i.filter(H=>H.kind==="preview"),[i]),E=w.useMemo(()=>i.find(H=>H.id==="preview-shot-9")??A.find(H=>(H.previewAspectRatio??1)<1)??A[0],[i,A]),z=w.useMemo(()=>i.find(H=>H.id==="preview-shot-21")??A.find(H=>H.id!==E?.id)??A[1],[i,A,E]),j=w.useMemo(()=>{const H=new Set;E?.id&&H.add(E.id),z?.id&&H.add(z.id);const le=A.filter(re=>!H.has(re.id));return le.length===0?[]:Array.from({length:12},(re,Ce)=>le[Ce%le.length])},[A,E,z]),L=w.useMemo(()=>{const H=[];return j.forEach((le,re)=>{H.push({kind:"preview",card:le,span:le.masonrySpan==="lg"?"wide":Qm[re%Qm.length],previewIndex:re}),re===6&&H.push({kind:"bridge",bridge:"signature",span:"sm",id:"bridge-signature"})}),H},[j]),B=w.useMemo(()=>{for(const H of L)if(H.kind==="preview")return H;return null},[L]),I=w.useMemo(()=>B?L.filter(H=>!(H.kind==="preview"&&H.previewIndex===B.previewIndex)):L,[L,B]),Z=w.useMemo(()=>Gm(s.linkedin),[s.linkedin]),$=w.useMemo(()=>Gm(s.x),[s.x]),G=E?.title??"Vertical project preview",Q=z?.title??"Wide project preview",te=B?Vm(B.card):!1,ne=`mosaic-shell${r?"":" mosaic-shell-hero-only"}`,F=`mosaic-hero${r?"":" mosaic-hero-hero-only"}`,oe=(H,le,re)=>Qr(H.image)?g.jsx("video",{src:H.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata","aria-label":re,className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`}):g.jsx("img",{src:H.image,alt:re,loading:"lazy",decoding:"async",className:`mosaic-work-media ${le?"mosaic-work-media-inset":""}`});return w.useEffect(()=>{if(typeof window>"u"||typeof window.matchMedia!="function")return;const H=window.matchMedia("(prefers-reduced-motion: reduce)"),le=()=>_(H.matches);return le(),typeof H.addEventListener=="function"?(H.addEventListener("change",le),()=>H.removeEventListener("change",le)):(H.addListener(le),()=>H.removeListener(le))},[]),w.useEffect(()=>{let H,le;const re=()=>{m(Zm())};return re(),(()=>{const We=6e4-Date.now()%6e4;le=window.setTimeout(()=>{re(),H=window.setInterval(re,6e4)},We)})(),()=>{le&&window.clearTimeout(le),H&&window.clearInterval(H)}},[]),g.jsxs("section",{className:ne,children:[g.jsxs("h1",{className:"sr-only",children:[u.name," portfolio"]}),g.jsx("header",{id:"about",className:F,children:g.jsxs("div",{className:"mosaic-hero-profile mosaic-hero-profile-animated",children:[g.jsxs("div",{className:"mosaic-profile-head",children:[g.jsx("img",{src:u.photo,alt:`${u.name} portrait`,className:"mosaic-avatar",loading:"eager",decoding:"async"}),g.jsxs("div",{className:"mosaic-profile-meta",children:[g.jsx("h2",{children:u.name}),g.jsxs("p",{className:"mosaic-profile-subtitle",children:[u.title,g.jsx("span",{className:"mosaic-profile-status-separator","aria-hidden":"true",children:"·"}),g.jsx("span",{className:"mosaic-profile-status-tag","aria-label":"Currently available",children:"Available"})]}),g.jsxs("p",{className:"mosaic-profile-location",children:["Punta Cana · ",g.jsx(r1,{label:h,reducedMotion:f})]})]})]}),g.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"Born in Santo Domingo, educated in Washington, DC, and now moving to NYC."}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["My work started in college, where I co-founded"," ",g.jsx(uh,{href:"https://www.youtube.com/watch?v=IAHmu0lhcIs&t=1s",className:"mosaic-profile-link",embedUrl:"https://www.youtube-nocookie.com/embed/IAHmu0lhcIs?autoplay=1&mute=1&controls=0&loop=1&playlist=IAHmu0lhcIs&modestbranding=1&rel=0&playsinline=1",previewTitle:"Turtle project preview",children:"Turtle"}),", a tool for college students to meet each other. Since then, I've designed products like"," ",g.jsxs("span",{className:"mosaic-inline-nowrap",children:[g.jsx(_a,{href:"https://patrol.so",logoUrls:["/logos/patrol.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Patrol"}),"/",g.jsx(_a,{href:"https://protector.so",logoUrls:["/logos/protector.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Protector"})]}),", rethought developer tools at"," ",g.jsx(_a,{href:"https://www.twilio.com",logoUrls:["/logos/twilio.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Twilio"}),", built financial products at"," ",g.jsx(_a,{href:"https://www.moodys.com",logoUrls:["/logos/moodys.png"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Moody's"}),", and helped shape"," ",g.jsx(_a,{href:"https://matcha.xyz",logoUrls:["/logos/matcha.svg"],className:"mosaic-profile-link mosaic-profile-link-with-logo",children:"Matcha.xyz"})," ","for four and a half years."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup mosaic-profile-summary-companies",children:["Over the past decade, I've designed products with teams at ",g.jsx(eg,{}),"."]}),g.jsx("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:"Today I freelance on focused, high-impact projects."}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",g.jsx("a",{href:$??s.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",g.jsx("a",{href:`mailto:${s.email}`,className:"mosaic-profile-link",children:s.email})]})]})}),r?g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"mosaic-board",children:[g.jsx("article",{id:"featured",className:"mosaic-tile mosaic-feature-card",children:g.jsxs("div",{className:"mosaic-note-card",children:[g.jsx("p",{className:"mosaic-note-date",children:"Nov 23"}),g.jsx("h2",{children:"LLMs for house plants?"}),g.jsx("p",{children:"It's been five incredibly turbulent days at the leading AI tech company, with the exit and then return of CEO..."}),Z?g.jsx("a",{href:Z,target:"_blank",rel:"noreferrer",className:"mosaic-note-link",children:"Read more"}):null]})}),g.jsxs("article",{className:"mosaic-tile mosaic-empty-card","aria-label":"Open space panel",children:[g.jsx("span",{className:"mosaic-doodle mosaic-doodle-top",children:"o_o"}),g.jsx("span",{className:"mosaic-doodle mosaic-doodle-bottom",children:"\\\\^_^/"})]}),g.jsx("article",{className:"mosaic-tile mosaic-phone-card","aria-label":G,children:g.jsx("div",{className:"mosaic-phone-shell",children:E?Qr(E.image)?g.jsx("video",{src:E.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":G,className:"mosaic-phone-media"}):g.jsx("img",{src:E.image,alt:G,loading:"lazy",decoding:"async",className:"mosaic-phone-media"}):g.jsx("div",{className:"mosaic-media-fallback",children:"Preview coming soon"})})}),g.jsx("article",{className:"mosaic-tile mosaic-note-panel",children:g.jsxs("div",{className:"mosaic-micro-card",children:[g.jsx("h2",{children:"Blogging about plants"}),g.jsx("p",{children:"I find joy and inspiration in my ever-growing collection of plants. They make my space feel like home."})]})}),g.jsx("article",{className:"mosaic-tile mosaic-dashboard-card","aria-label":Q,children:g.jsx("div",{className:"mosaic-wide-shell",children:z?Qr(z.image)?g.jsx("video",{src:z.image,muted:!0,loop:!f,autoPlay:!f,playsInline:!0,preload:f?"none":"metadata",controls:f,"aria-label":Q,className:"mosaic-wide-media"}):g.jsx("img",{src:z.image,alt:Q,loading:"lazy",decoding:"async",className:"mosaic-wide-media"}):g.jsx("div",{className:"mosaic-media-fallback",children:"Project preview"})})}),g.jsxs("article",{id:"work",className:"mosaic-work",children:[g.jsx("h2",{className:"sr-only",children:"Selected work"}),B?g.jsx("section",{className:"mosaic-work-featured","aria-label":"Featured work preview",children:g.jsxs("button",{type:"button",className:"mosaic-work-card mosaic-work-card-featured",onClick:()=>Km(B.card,B.previewIndex,"featured",x),"aria-label":`Open ${B.card.title} preview ${B.previewIndex+1} of ${j.length}`,children:[g.jsx("span",{className:`mosaic-work-media-shell ${te?"mosaic-work-media-shell-inset":""}`,children:oe(B.card,te,B.card.title)}),g.jsx("span",{className:"mosaic-work-overlay mosaic-work-overlay-featured",children:g.jsx("strong",{children:B.card.title})})]})}):null,g.jsx("ul",{className:"mosaic-work-grid","aria-label":"Selected work previews",children:I.map(H=>{const le=`mosaic-work-item mosaic-work-item-${H.span}`;if(H.kind==="bridge")return g.jsx("li",{className:le,children:g.jsxs("div",{className:"mosaic-work-bridge mosaic-work-bridge-signature","aria-hidden":"false",children:[g.jsxs("div",{className:"mosaic-work-signature-stack","aria-hidden":"true",children:[g.jsx("span",{}),g.jsx("span",{}),g.jsx("span",{})]}),g.jsxs("p",{children:[u.name," - Software Designer and Engineer"]})]})},H.id);const re=Vm(H.card);return g.jsx("li",{className:le,children:g.jsxs("button",{type:"button",className:"mosaic-work-card",onClick:()=>Km(H.card,H.previewIndex,"grid",x),"aria-label":`Open ${H.card.title} preview ${H.previewIndex+1} of ${j.length}`,children:[g.jsx("span",{className:`mosaic-work-media-shell ${re?"mosaic-work-media-shell-inset":""}`,children:oe(H.card,re,H.card.title)}),g.jsx("span",{className:"mosaic-work-overlay",children:g.jsx("strong",{children:H.card.title})})]})},`${H.card.id}-${H.previewIndex}`)})})]})]}),g.jsx(u1,{cards:j,open:y!=null&&y<j.length,selectedIndex:y??0,prefersReducedMotion:f,onOpenChange:H=>{H||x(null)},onSelectedIndexChange:x})]}):null]})}function f1({email:i,contactHref:u,telegramHref:s,xHref:r}){const[f,_]=w.useState(!1),y=async()=>{try{await navigator.clipboard.writeText(i),_(!0),window.setTimeout(()=>_(!1),1800)}catch{window.location.href=u}};return g.jsxs(g.Fragment,{children:[g.jsxs("div",{className:"mosaic-profile-actions","aria-label":"Profile contact actions",children:[g.jsx("button",{type:"button",className:"mosaic-contact-pill mosaic-contact-pill-default",onClick:y,children:g.jsx("span",{className:"mosaic-contact-pill-default-label",children:f?"Copied!":"Copy email"})}),g.jsx("a",{href:s,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-telegram",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-telegram",children:[g.jsx("img",{src:"/icons/telegram.png",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-telegram"}),g.jsx("span",{className:"mosaic-contact-pill-telegram-label",children:"Message"})]})}),r?g.jsx("a",{href:r,target:"_blank",rel:"noreferrer",className:"mosaic-contact-pill mosaic-contact-pill-dark",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[g.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),g.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})}):g.jsx("span",{className:"mosaic-contact-pill mosaic-contact-pill-dark",role:"text",children:g.jsxs("span",{className:"mosaic-contact-pill-content mosaic-contact-pill-content-x",children:[g.jsx("img",{src:"/icons/x.svg",alt:"",className:"mosaic-contact-pill-icon mosaic-contact-pill-icon-x"}),g.jsx("span",{className:"mosaic-contact-pill-dark-label",children:"Follow"})]})})]}),g.jsx("span",{className:"sr-only",role:"status","aria-live":"polite","aria-atomic":"true",children:f?"Email copied to clipboard":""})]})}const d1=[{label:"Body",variable:"--body-color"},{label:"Body BG",variable:"--body-bg"},{label:"Primary",variable:"--primary"},{label:"Secondary",variable:"--secondary"},{label:"Accent",variable:"--accent"},{label:"Surface",variable:"--surface-2"}],_1=[{label:"Snappy",value:"220ms / cubic-bezier(0.175, 0.885, 0.32, 1.1)"},{label:"Swift",value:"800ms / cubic-bezier(0.175, 0.885, 0.32, 1.275)"},{label:"Smooth",value:"300ms / cubic-bezier(0.19, 1, 0.22, 1)"}];function m1({links:i,name:u}){return g.jsxs("main",{id:"main-content",tabIndex:-1,className:"styleguide-page",children:[g.jsxs("header",{className:"styleguide-hero",children:[g.jsxs("div",{className:"styleguide-hero-topline",children:[g.jsx("a",{href:"/",className:"styleguide-home-link",children:"Back to portfolio"}),g.jsx("span",{className:"styleguide-badge",children:"System inventory"})]}),g.jsxs("div",{className:"styleguide-hero-copy",children:[g.jsx("p",{className:"styleguide-eyebrow",children:"Rafael Medina UI system"}),g.jsx("h1",{children:"Styleguide"}),g.jsxs("p",{className:"styleguide-lede",children:["A living page for the real components, link treatments, text styles, surfaces, and motion tokens currently shaping"," ",u,"'s portfolio."]})]})]}),g.jsxs("div",{className:"styleguide-main",children:[g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Buttons"}),g.jsx("h2",{children:"Contact action row"})]}),g.jsx("div",{className:"styleguide-specimen styleguide-specimen-wide",children:g.jsx(f1,{email:i.email,contactHref:`mailto:${i.email}`,telegramHref:"https://t.me/rafaelmedian",xHref:i.x})}),g.jsxs("div",{className:"styleguide-notes-grid",children:[g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Primary"}),g.jsx("strong",{children:"Copy email"}),g.jsx("p",{children:"Utility-first action with the strongest contrast in the row."})]}),g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Secondary"}),g.jsx("strong",{children:"Message"}),g.jsx("p",{children:"Friendlier blue accent that stays related to the main button family."})]}),g.jsxs("article",{className:"styleguide-note-card",children:[g.jsx("span",{children:"Tertiary"}),g.jsx("strong",{children:"Follow"}),g.jsx("p",{children:"Darker social action that stays present without overpowering the row."})]})]})]}),g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Links"}),g.jsx("h2",{children:"Editorial inline treatments"})]}),g.jsxs("div",{className:"styleguide-copy-sample",children:[g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["Born in the US I helped build"," ",g.jsx("a",{href:"https://matcha.xyz",target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"Matcha.xyz"})," ","end-to-end, from product design to interaction design."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["I've been fortunate to work with teams at ",g.jsx(eg,{}),"."]}),g.jsxs("p",{className:"mosaic-profile-summary mosaic-profile-summary-followup",children:["You can reach me at"," ",g.jsx("a",{href:i.x,target:"_blank",rel:"noreferrer",className:"mosaic-profile-link",children:"@rafaelmedian"})," ","or"," ",g.jsx("a",{href:`mailto:${i.email}`,className:"mosaic-profile-link",children:i.email}),"."]})]})]}),g.jsxs("section",{className:"styleguide-section styleguide-grid-two",children:[g.jsxs("div",{className:"styleguide-column",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Typography"}),g.jsx("h2",{children:"Core text rhythm"})]}),g.jsxs("div",{className:"styleguide-type-stack",children:[g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Hero title"}),g.jsx("h3",{children:"Rafael Medina"}),g.jsx("p",{children:"16px / 170% / -0.005em"})]}),g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Body base"}),g.jsx("h4",{children:"I'm a designer who ships products, now AI-enabled."}),g.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]}),g.jsxs("article",{className:"styleguide-type-card",children:[g.jsx("span",{children:"Meta"}),g.jsx("div",{className:"styleguide-meta-line",children:"Punta Cana · Local time: 5:03pm AST"}),g.jsx("p",{children:"14px / 1.25rem / -0.00563rem"})]})]})]}),g.jsxs("div",{className:"styleguide-column",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Tokens"}),g.jsx("h2",{children:"Color and motion references"})]}),g.jsx("div",{className:"styleguide-swatch-grid",children:d1.map(s=>g.jsxs("article",{className:"styleguide-swatch-card",children:[g.jsx("div",{className:"styleguide-swatch",style:{background:`var(${s.variable})`}}),g.jsx("strong",{children:s.label}),g.jsx("span",{children:s.variable})]},s.variable))}),g.jsx("div",{className:"styleguide-motion-list",children:_1.map(s=>g.jsxs("article",{className:"styleguide-motion-card",children:[g.jsx("strong",{children:s.label}),g.jsx("span",{children:s.value})]},s.label))})]})]}),g.jsxs("section",{className:"styleguide-section",children:[g.jsxs("div",{className:"styleguide-section-heading",children:[g.jsx("p",{children:"Surfaces"}),g.jsx("h2",{children:"Panels and atmosphere"})]}),g.jsxs("div",{className:"styleguide-surface-grid",children:[g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-overlay",children:[g.jsx("span",{children:"Overlay"}),g.jsx("strong",{children:"Blurred system surface"}),g.jsx("p",{children:"Uses the shared overlay blur, background, and layered shadow tokens."})]}),g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-tile",children:[g.jsx("span",{children:"Tile"}),g.jsx("strong",{children:"Project canvas"}),g.jsx("p",{children:"The softer neutral panel used by the portfolio grid."})]}),g.jsxs("article",{className:"styleguide-surface-card styleguide-surface-card-accent",children:[g.jsx("span",{children:"Accent"}),g.jsx("strong",{children:"Highlight wash"}),g.jsx("p",{children:"A low-contrast accent surface for emphasis, notes, or future badges."})]})]})]})]})]})}const g1="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='56'%20y='70'%20width='220'%20height='220'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='72'%20width='192'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='320'%20y='104'%20width='144'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='320'%20y='156'%20width='192'%20height='116'%20rx='22'%20fill='%23E7E5E4'/%3e%3cpath%20d='M142%20120H214'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20150H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3cpath%20d='M142%20180H214'%20stroke='%23A8A29E'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",y1="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='72'%20y='84'%20width='196'%20height='196'%20rx='26'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='92'%20width='188'%20height='18'%20rx='9'%20fill='%23D6D3D1'/%3e%3crect%20x='300'%20y='124'%20width='140'%20height='12'%20rx='6'%20fill='%23E7E5E4'/%3e%3crect%20x='300'%20y='176'%20width='188'%20height='96'%20rx='18'%20fill='%23E7E5E4'/%3e%3ccircle%20cx='170'%20cy='182'%20r='46'%20fill='%23D6D3D1'/%3e%3cpath%20d='M148%20182H192'%20stroke='%23059669'%20stroke-width='10'%20stroke-linecap='round'/%3e%3c/svg%3e",p1="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='60'%20y='64'%20width='440'%20height='96'%20rx='24'%20fill='%23E7E5E4'/%3e%3crect%20x='60'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='290'%20y='188'%20width='210'%20height='120'%20rx='22'%20fill='%23E7E5E4'/%3e%3crect%20x='92'%20y='96'%20width='160'%20height='12'%20rx='6'%20fill='%23D6D3D1'/%3e%3crect%20x='92'%20y='118'%20width='120'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3cpath%20d='M328%20248H460'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",h1="data:image/svg+xml,%3csvg%20width='560'%20height='360'%20viewBox='0%200%20560%20360'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3crect%20width='560'%20height='360'%20rx='32'%20fill='%23F5F5F4'/%3e%3crect%20x='80'%20y='68'%20width='400'%20height='224'%20rx='28'%20fill='%23E7E5E4'/%3e%3crect%20x='120'%20y='110'%20width='160'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='134'%20width='220'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3crect%20x='120'%20y='200'%20width='140'%20height='14'%20rx='7'%20fill='%23D6D3D1'/%3e%3crect%20x='120'%20y='224'%20width='200'%20height='10'%20rx='5'%20fill='%23F0EEEC'/%3e%3ccircle%20cx='392'%20cy='196'%20r='32'%20fill='%23D6D3D1'/%3e%3cpath%20d='M372%20196H412'%20stroke='%23059669'%20stroke-width='8'%20stroke-linecap='round'/%3e%3c/svg%3e",b1="/assets/profile-photo-bUVT8ljA.png",Jm={name:"Rafael Medina",title:"Freelance Product Designer",intro:"Hey I'm Rafael, a product designer and maker based in Miami. For over 10 years, I've helped teams design products that balance clarity, visual craft, and practical outcomes.",previouslyLabel:"Previously",previouslyText:"Product designer for SaaS teams and startup builders.",nowLabel:"Now",nowText:"Freelancing, experimenting with AI workflows, and building design systems.",availability:"Available for work",contactLabel:"Get in touch",contactHref:"mailto:hey@rafaelmedina.me",photo:b1},ya={dribbble:"https://dribbble.com/rafaelmedina",x:"https://x.com/rafaelmedian",github:"https://github.com/rafaelmedina",linkedin:"https://www.linkedin.com/in/rafaelmedina",email:"hey@rafaelmedina.me"},v1=[{id:"preview-shot-21",kind:"preview",category:"Preview",title:"Shot Preview 21",summary:"",detail:"",image:"/Projects/6842e949e1acb44abd669218_shot-small-21.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:4/3},{id:"preview-shot-9",kind:"preview",category:"Preview",title:"Shot Preview 9",summary:"",detail:"",image:"/Projects/shot-small-9.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:.74},{id:"preview-shot-16",kind:"preview",category:"Preview",title:"Shot Preview 16",summary:"",detail:"",image:"/Projects/shot-small-16.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1,previewAspectRatio:1.85},{id:"preview-shot-1",kind:"preview",category:"Preview",title:"Shot Preview 1",summary:"",detail:"",image:"/Projects/6842e9496471bc426ffe9cab_shot-small-1.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-14",kind:"preview",category:"Preview",title:"Shot Preview 14",summary:"",detail:"",image:"/Projects/6842e9492c24a449a9618900_shot-small-14.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-15",kind:"preview",category:"Preview",title:"Shot Preview 15",summary:"",detail:"",image:"/Projects/6842e94938956d9ae25a45e0_shot-small-15.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-19",kind:"preview",category:"Preview",title:"Shot Preview 19",summary:"",detail:"",image:"/Projects/6842e949f7d5d856726cc384_shot-small-19.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-20",kind:"preview",category:"Preview",title:"Shot Preview 20",summary:"",detail:"",image:"/Projects/shot-small-20.webm",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-22",kind:"preview",category:"Preview",title:"Shot Preview 22",summary:"",detail:"",image:"/Projects/6842e94a9872b4967e6fc2a9_shot-small-22.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"preview-shot-23",kind:"preview",category:"Preview",title:"Shot Preview 23",summary:"",detail:"",image:"/Projects/6842e9499838ce07a751244b_shot-small-23.jpg",ctaLabel:"",ctaHref:"#",ctaExternal:!1},{id:"widget-music",kind:"info",category:"Widget",title:"Music Player",summary:"A focused listening mix for design sessions.",detail:"Ambient and electronic tracks for deep work and prototyping.",image:"",ctaLabel:"Spotify Embed",ctaHref:"https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6?utm_source=generator",ctaExternal:!0},{id:"widget-map",kind:"info",category:"Widget",title:"Map",summary:"Current location and nearby context.",detail:"Map snapshot centered on Miami, FL.",image:"",ctaLabel:"Open in Maps",ctaHref:"https://maps.google.com/?q=Miami,FL",ctaExternal:!0},{id:"info-cv",kind:"info",category:"CV",title:"Curriculum Vitae",summary:"Experience, projects, and selected work history.",detail:"A concise overview of product design roles, outcomes, and capabilities.",image:g1,ctaLabel:"Open LinkedIn",ctaHref:ya.linkedin,ctaExternal:!0},{id:"info-about",kind:"info",category:"About",title:"About",summary:"Product designer focused on clarity, systems, and practical craft.",detail:"I design dependable experiences with clean hierarchy and thoughtful interaction.",image:p1,ctaLabel:"About Profile",ctaHref:ya.linkedin,ctaExternal:!0},{id:"info-notes",kind:"info",category:"Notes",title:"Design Notes",summary:"Short notes on process, interaction ideas, and UI experiments.",detail:"A running collection of observations, rationale, and implementation details.",image:y1,ctaLabel:"View GitHub",ctaHref:ya.github,ctaExternal:!0},{id:"info-social",kind:"info",category:"Social",title:"Basic Social Links",summary:"Email, GitHub, and LinkedIn for quick contact.",detail:"Reach out by email or connect via GitHub and LinkedIn.",image:h1,ctaLabel:"Open LinkedIn",ctaHref:ya.linkedin,ctaExternal:!0}];function x1(i){return!i||i==="/"?"/":i.replace(/\/+$/,"")}function S1(){const u=(typeof window>"u"?"/":x1(window.location.pathname))==="/styleguide";return g.jsxs("div",{"data-theme":"light",className:"relative isolate min-h-dvh overflow-x-clip bg-[var(--canvas)] text-[var(--ink)]",children:[g.jsx("a",{href:"#main-content",className:"skip-link",children:"Skip to content"}),u?g.jsx(m1,{links:ya,name:Jm.name}):g.jsx("main",{id:"main-content",tabIndex:-1,className:"relative z-dock",children:g.jsx(c1,{cards:v1,profile:Jm,links:ya,showProjects:!1})}),lc()?g.jsx(Xp,{}):null,null]})}ah();zp.createRoot(document.getElementById("root")).render(g.jsx(w.StrictMode,{children:g.jsx(S1,{})}));
