var hn=Object.defineProperty;var pn=(s,e,n)=>e in s?hn(s,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):s[e]=n;var an=(s,e,n)=>(pn(s,typeof e!="symbol"?e+"":e,n),n);import{s as re,n as U,o as ye,b as Ce,c as $e,u as ge,g as he,d as pe,f as be,r as _n,h as wn,i as vn}from"../chunks/scheduler.185ca572.js";import{S as se,i as le,g as L,h as P,j,f as a,k as V,a as f,m as h,s as y,n as p,c as K,y as O,o as Fe,d as b,t as k,e as on,p as bn,b as kn,r as E,u as D,v as I,w as R,z as Ge,A as ue,l as je,x as Me,B as Nn,C as Sn,D as zn,H as En,E as Dn}from"../chunks/index.f5a09378.js";const Le=`
vec2 random2(vec2 st){
  st = vec2( dot(st,vec2(127.1,311.7)),
            dot(st,vec2(269.5,183.3)) );
  return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  vec2 u = f*f*(3.0-2.0*f);

  return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                   dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
              mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                   dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}
`,In=`
// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float noise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
`,Rn=`
// 2D Random
float random (in vec2 st) {
   return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
`;let $n=[];function gn(s,e){let n=s.getContext("webgl"),t=n.createShader(n.VERTEX_SHADER),i=`
      attribute vec4 pos;
      varying vec2 coordinates;
      void main() {
          coordinates = pos.xy * 0.5 + 0.5; // Transformation von [-1, 1] zu [0, 1]
          gl_Position = pos;
      }`;n.shaderSource(t,i),n.compileShader(t);let r=n.createShader(n.FRAGMENT_SHADER);n.shaderSource(r,e),n.compileShader(r);let l=n.createProgram();n.attachShader(l,t),n.attachShader(l,r),n.linkProgram(l),n.useProgram(l);let o=n.getUniformLocation(l,"time"),d=n.getUniformLocation(l,"scrolly"),$=n.getUniformLocation(l,"aspectratio"),u=n.getUniformLocation(l,"scale");var A=[-1,-1,1,-1,-1,1,1,1],w=n.createBuffer();n.bindBuffer(n.ARRAY_BUFFER,w),n.bufferData(n.ARRAY_BUFFER,new Float32Array(A),n.STATIC_DRAW);var B=n.getAttribLocation(l,"pos");n.vertexAttribPointer(B,2,n.FLOAT,!1,0,0),n.enableVertexAttribArray(B);let M=Date.now(),N=0;function c(){var g=s.getBoundingClientRect(),F=document.documentElement;return g.top>=0&&g.left>=0&&g.bottom<=(window.innerHeight||F.clientHeight)&&g.right<=(window.innerWidth||F.clientWidth)}function C(){if(c()&&N%2==0){let F=(Date.now()-M)/1e3;n.uniform1f(o,F),n.uniform1f(d,window.scrollY),n.uniform1f($,s.width/s.height),n.uniform1f(u,1),n.clearColor(0,0,0,1),n.clear(n.COLOR_BUFFER_BIT),n.drawArrays(n.TRIANGLE_STRIP,0,4)}N+=1}$n.push(C),C()}if(globalThis.window!==void 0){let s=function(){for(let e of $n)e();requestAnimationFrame(s)};s()}function An(s){let e;return{c(){e=L("canvas"),this.h()},l(n){e=P(n,"CANVAS",{class:!0}),j(e).forEach(a),this.h()},h(){V(e,"class","w-screen h-screen fixed -z-10")},m(n,t){f(n,e,t),s[1](e)},p:U,i:U,o:U,d(n){n&&a(e),s[1](null)}}}function Mn(s,e,n){let t;ye(()=>{});function i(r){Ce[r?"unshift":"push"](()=>{t=r,n(0,t)})}return[t,i]}class Bn extends se{constructor(e){super(),le(this,e,Mn,An,re,{})}}function Fn(s){let e,n,t,i,r;const l=s[2].default,o=$e(l,s,s[1],null);return{c(){e=L("section"),n=L("h1"),t=h(s[0]),i=y(),o&&o.c(),this.h()},l(d){e=P(d,"SECTION",{class:!0});var $=j(e);n=P($,"H1",{class:!0,id:!0});var u=j(n);t=p(u,s[0]),u.forEach(a),i=K($),o&&o.l($),$.forEach(a),this.h()},h(){V(n,"class","text-2xl my-3"),V(n,"id",s[0]),V(e,"class","scroll-smooth mb-8")},m(d,$){f(d,e,$),O(e,n),O(n,t),O(e,i),o&&o.m(e,null),r=!0},p(d,[$]){(!r||$&1)&&Fe(t,d[0]),(!r||$&1)&&V(n,"id",d[0]),o&&o.p&&(!r||$&2)&&ge(o,l,d,d[1],r?pe(l,d[1],$,null):he(d[1]),null)},i(d){r||(b(o,d),r=!0)},o(d){k(o,d),r=!1},d(d){d&&a(e),o&&o.d(d)}}}function Ln(s,e,n){let{$$slots:t={},$$scope:i}=e,{title:r}=e;return s.$$set=l=>{"title"in l&&n(0,r=l.title),"$$scope"in l&&n(1,i=l.$$scope)},[r,i,t]}class Ae extends se{constructor(e){super(),le(this,e,Ln,Fn,re,{title:0})}}const Pn=s=>({}),fn=s=>({}),Gn=s=>({}),un=s=>({});function Cn(s){let e,n,t,i,r;const l=s[1].left,o=$e(l,s,s[0],un),d=s[1].right,$=$e(d,s,s[0],fn);return{c(){e=L("div"),n=L("div"),o&&o.c(),t=y(),i=L("div"),$&&$.c(),this.h()},l(u){e=P(u,"DIV",{class:!0});var A=j(e);n=P(A,"DIV",{class:!0});var w=j(n);o&&o.l(w),w.forEach(a),t=K(A),i=P(A,"DIV",{class:!0});var B=j(i);$&&$.l(B),B.forEach(a),A.forEach(a),this.h()},h(){V(n,"class","w-1/2 pr-4"),V(i,"class","w-1/2 pl-4"),V(e,"class","flex justify-between")},m(u,A){f(u,e,A),O(e,n),o&&o.m(n,null),O(e,t),O(e,i),$&&$.m(i,null),r=!0},p(u,[A]){o&&o.p&&(!r||A&1)&&ge(o,l,u,u[0],r?pe(l,u[0],A,Gn):he(u[0]),un),$&&$.p&&(!r||A&1)&&ge($,d,u,u[0],r?pe(d,u[0],A,Pn):he(u[0]),fn)},i(u){r||(b(o,u),b($,u),r=!0)},o(u){k(o,u),k($,u),r=!1},d(u){u&&a(e),o&&o.d(u),$&&$.d(u)}}}function Wn(s,e,n){let{$$slots:t={},$$scope:i}=e;return s.$$set=r=>{"$$scope"in r&&n(0,i=r.$$scope)},[i,t]}class Ke extends se{constructor(e){super(),le(this,e,Wn,Cn,re,{})}}const Tn=s=>({}),dn=s=>({});function On(s){let e,n,t,i,r,l=s[0].getFullName()+"",o,d,$,u;const A=s[2].default,w=$e(A,s,s[1],null),B=s[2].desc,M=$e(B,s,s[1],dn);return{c(){e=L("div"),n=L("div"),t=L("div"),w&&w.c(),i=y(),r=L("span"),o=h(l),d=y(),M&&M.c(),this.h()},l(N){e=P(N,"DIV",{class:!0,id:!0});var c=j(e);n=P(c,"DIV",{class:!0});var C=j(n);t=P(C,"DIV",{class:!0});var g=j(t);w&&w.l(g),g.forEach(a),i=K(C),r=P(C,"SPAN",{class:!0});var F=j(r);o=p(F,l),F.forEach(a),d=K(C),M&&M.l(C),C.forEach(a),c.forEach(a),this.h()},h(){V(t,"class","flex"),V(r,"class","break-words max-w-xs"),V(n,"class","flex flex-col items-center"),V(e,"class","flex flex-col mb-7 mx-5"),V(e,"id",$=s[0].getFullName())},m(N,c){f(N,e,c),O(e,n),O(n,t),w&&w.m(t,null),O(n,i),O(n,r),O(r,o),O(n,d),M&&M.m(n,null),u=!0},p(N,[c]){w&&w.p&&(!u||c&2)&&ge(w,A,N,N[1],u?pe(A,N[1],c,null):he(N[1]),null),(!u||c&1)&&l!==(l=N[0].getFullName()+"")&&Fe(o,l),M&&M.p&&(!u||c&2)&&ge(M,B,N,N[1],u?pe(B,N[1],c,Tn):he(N[1]),dn),(!u||c&1&&$!==($=N[0].getFullName()))&&V(e,"id",$)},i(N){u||(b(w,N),b(M,N),u=!0)},o(N){k(w,N),k(M,N),u=!1},d(N){N&&a(e),w&&w.d(N),M&&M.d(N)}}}function Vn(s,e,n){let{$$slots:t={},$$scope:i}=e,{imageRef:r}=e;return s.$$set=l=>{"imageRef"in l&&n(0,r=l.imageRef),"$$scope"in l&&n(1,i=l.$$scope)},[r,i,t]}class ie extends se{constructor(e){super(),le(this,e,Vn,On,re,{imageRef:0})}}function Hn(s){let e,n;const t=s[2].default,i=$e(t,s,s[1],null);return{c(){e=L("a"),i&&i.c(),this.h()},l(r){e=P(r,"A",{href:!0,class:!0});var l=j(e);i&&i.l(l),l.forEach(a),this.h()},h(){V(e,"href",s[0]),V(e,"class","text-blue-500")},m(r,l){f(r,e,l),i&&i.m(e,null),n=!0},p(r,[l]){i&&i.p&&(!n||l&2)&&ge(i,t,r,r[1],n?pe(t,r[1],l,null):he(r[1]),null),(!n||l&1)&&V(e,"href",r[0])},i(r){n||(b(i,r),n=!0)},o(r){k(i,r),n=!1},d(r){r&&a(e),i&&i.d(r)}}}function xn(s,e,n){let{$$slots:t={},$$scope:i}=e,{href:r}=e;return s.$$set=l=>{"href"in l&&n(0,r=l.href),"$$scope"in l&&n(1,i=l.$$scope)},[r,i,t]}class de extends se{constructor(e){super(),le(this,e,xn,Hn,re,{href:0})}}function jn(s){let e,n;return e=new de({props:{href:"#"+s[0].getFullName(),$$slots:{default:[Un]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&1&&(r.href="#"+t[0].getFullName()),i&5&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function yn(s){let e,n;return e=new de({props:{href:"#"+s[0].getFullName(),$$slots:{default:[Zn]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&1&&(r.href="#"+t[0].getFullName()),i&5&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Kn(s){let e,n;return e=new de({props:{href:"#"+s[0].getFullName(),$$slots:{default:[Yn]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&1&&(r.href="#"+t[0].getFullName()),i&5&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Un(s){let e=s[0].getPrefixWithIndex()+"",n;return{c(){n=h(e)},l(t){n=p(t,e)},m(t,i){f(t,n,i)},p(t,i){i&1&&e!==(e=t[0].getPrefixWithIndex()+"")&&Fe(n,e)},d(t){t&&a(n)}}}function Zn(s){let e=s[0].getFullName()+"",n;return{c(){n=h(e)},l(t){n=p(t,e)},m(t,i){f(t,n,i)},p(t,i){i&1&&e!==(e=t[0].getFullName()+"")&&Fe(n,e)},d(t){t&&a(n)}}}function Yn(s){let e,n=s[0].getIndex()+"",t,i;return{c(){e=h("["),t=h(n),i=h("]")},l(r){e=p(r,"["),t=p(r,n),i=p(r,"]")},m(r,l){f(r,e,l),f(r,t,l),f(r,i,l)},p(r,l){l&1&&n!==(n=r[0].getIndex()+"")&&Fe(t,n)},d(r){r&&(a(e),a(t),a(i))}}}function Qn(s){let e,n,t,i;const r=[Kn,yn,jn],l=[];function o(d,$){return d[1]===void 0?0:d[1]==!0?1:d[1]==!1?2:-1}return~(e=o(s))&&(n=l[e]=r[e](s)),{c(){n&&n.c(),t=on()},l(d){n&&n.l(d),t=on()},m(d,$){~e&&l[e].m(d,$),f(d,t,$),i=!0},p(d,[$]){let u=e;e=o(d),e===u?~e&&l[e].p(d,$):(n&&(bn(),k(l[u],1,1,()=>{l[u]=null}),kn()),~e?(n=l[e],n?n.p(d,$):(n=l[e]=r[e](d),n.c()),b(n,1),n.m(t.parentNode,t)):n=null)},i(d){i||(b(n),i=!0)},o(d){k(n),i=!1},d(d){d&&a(t),~e&&l[e].d(d)}}}function Jn(s,e,n){let{reference:t}=e,{showFullName:i=void 0}=e;return s.$$set=r=>{"reference"in r&&n(0,t=r.reference),"showFullName"in r&&n(1,i=r.showFullName)},[t,i]}class ee extends se{constructor(e){super(),le(this,e,Jn,Qn,re,{reference:0,showFullName:1})}}const Ie=class Ie{constructor(e,n){this.name=e,this.index=n}getIndex(){return this.index}getFullName(){return`${this.getPrefixWithIndex()}: ${this.name}`}getPrefixWithIndex(){return`Abbildung ${this.getIndex()}`}static getResourceRef(e){let n=Ie.names.findIndex(i=>i==e),t;return n==-1?(Ie.names.push(e),t=Ie.names.length-1):t=n,new Ie(e,t+1)}};an(Ie,"names",[]);let te=Ie;function Xn(s){let e,n,t,i;return{c(){e=L("button"),n=L("canvas"),this.h()},l(r){e=P(r,"BUTTON",{class:!0});var l=j(e);n=P(l,"CANVAS",{class:!0,width:!0,height:!0}),j(n).forEach(a),l.forEach(a),this.h()},h(){V(n,"class","bg-black"),V(n,"width",s[2]),V(n,"height",s[3]),V(e,"class","hover:scale-105 transition-transform")},m(r,l){f(r,e,l),O(e,n),s[5](n),t||(i=Ge(e,"click",s[6]),t=!0)},p(r,[l]){l&4&&V(n,"width",r[2]),l&8&&V(n,"height",r[3])},i:U,o:U,d(r){r&&a(e),s[5](null),t=!1,i()}}}function qn(s,e,n){let{fragmentShader:t}=e,{openModal:i=void 0}=e,r,{width:l=200}=e,{height:o=200}=e;ye(()=>{gn(r,t)});function d(u){Ce[u?"unshift":"push"](()=>{r=u,n(4,r)})}const $=()=>{i&&i(t)};return s.$$set=u=>{"fragmentShader"in u&&n(0,t=u.fragmentShader),"openModal"in u&&n(1,i=u.openModal),"width"in u&&n(2,l=u.width),"height"in u&&n(3,o=u.height)},[t,i,l,o,r,d,$]}class Re extends se{constructor(e){super(),le(this,e,qn,Xn,re,{fragmentShader:0,openModal:1,width:2,height:3})}}function et(s){let e;return{c(){e=h(" ")},l(n){e=p(n," ")},m(n,t){f(n,e,t)},p:U,i:U,o:U,d(n){n&&a(e)}}}class Be extends se{constructor(e){super(),le(this,e,null,et,re,{})}}const Ue=`precision mediump float;
uniform float time;
uniform float aspectratio;
uniform float scale;
varying vec2 coordinates;
`,Ye=`float pnoise(float speed, float localScale, float offset){
    vec2 coordWAspect = coordinates;
    coordWAspect.x *= aspectratio;
    return noise((coordWAspect + offset + vec2(time * speed)) * localScale * scale);
}
`;function Qe(s){return`precision mediump float;
uniform float time;
varying vec2 coordinates;

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${s}
/*===================
FOLLOWING CODE IS MINE
===================*/

    
void main(void) {
    float time2 = time / 7.0;
    vec2 animated = (coordinates + vec2(time2, time / 10.0 + sin(time * 2.0) / 5.0)) * 10.0;
    float noised = noise(animated);
    vec4 color = vec4(vec3(noised*.5+.5),1.0);
    gl_FragColor = color;
}`}const nt=Qe(Rn),tt=Qe(Le),it=Qe(In),rt=`${Ue}

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${Le}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    

${Ye}

void main(void) {
    float noise1 = pnoise(0.1, 2.5,0.0);
    float noise2 = pnoise(0.1, 20.0, 1521.0) / 7.0;
    float noise3 = pnoise(0.1, 10.0, -2320.0) / 7.0;

    float noise = noise1 + noise2 + noise3;
    vec4 color = vec4(vec3(noise*.5+.5),1.0);
    gl_FragColor = color;
}
`,st=`${Ue}

/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${Le}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    
${Ye}

void main(void) {
    float noise1 = pnoise(0.1, 2.5,0.0);
    float noise2 = pnoise(0.1, 20.0, 1521.0) / 7.0;
    float noise3 = pnoise(0.1, 10.0, -2320.0) / 7.0;

    float noise = max(max(noise1, noise2), noise3);
    vec4 color = vec4(vec3(noise*.5+.5),1.0);
    gl_FragColor = color;
}
`,lt=`
${Ue}
/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${Le}
/*===================
FOLLOWING CODE IS MINE!!!
===================*/    
${Ye}

void drawWater(float superfast){
    float noise1 = pnoise(0.15, 2.5,0.0);
    
    float noise3 = pnoise(0.3, 10.0, -2320.0) / 7.0;

    float noise = noise1 + superfast + noise3;
    float color = noise+.7;
    gl_FragColor = vec4(color / 7.0,color / 3.0,color,1.0);
}


void main(void) {
    float superfast = pnoise(0.1, 25.0, 1521.0) / 4.0;

    float flat_y = pnoise(0.1, 1.0,0.0) + 0.2;
    float hilly_y = pnoise(0.1,4.0,1521.0);
    float water_noise = pnoise(0.1, 2.0, -2320.0);

  
    if(flat_y < hilly_y){
        //Do Hill
        gl_FragColor = vec4(vec3(hilly_y / 2.0 + 0.1),1.0);
    }else if(water_noise > -0.2){
        //Do grass
        gl_FragColor = vec4(0.0,flat_y + superfast / 5.0 + 0.5,0.0,1.0);
    }else if(water_noise > -0.4){
        //Do sand
        gl_FragColor = vec4(1.0,1.0,0.5,1.0);
    }else{
        //Do water
        drawWater(superfast);
    }
}



`,at=`${Ue}
/*===================
FOLLOWING CODE IS NOT MINE!!!
===================*/
${Le}
/*===================
FOLLOWING CODE IS MINE
===================*/

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);  
    return 1.-smoothstep(_radius-(_radius*0.01),
                   _radius+(_radius*0.01),
                   dot(dist,dist)*4.0);
}

void main(void) {
    float time2 = time / 7.0;
    vec2 animated = (coordinates + vec2(time2, time2));
    float noised = noise(animated) * 30.0;
    
    float angle = atan(coordinates.y/coordinates.x);
    float radius1 = noise((vec2(angle) + vec2(time2))) + 0.5;

    float radius2 = (noise(((vec2(angle) + vec2(-time) + 10000.0) * 4.0)) + 0.5) / 5.0;
    float radius = (1.0 + sin(time) / 2.0) * radius1 - radius2;
    if(radius <= 0.0){radius = 0.01;}

    vec4 color = vec4(circle(coordinates,radius));

    gl_FragColor = color;
}`;function ot(s){let e,n;return{c(){e=L("model-viewer"),this.h()},l(t){e=P(t,"MODEL-VIEWER",{id:!0,alt:!0,style:!0,class:!0,src:!0,"auto-rotate":!0,"camera-controls":!0,"shadow-intensity":!0,exposure:!0,"shadow-softness":!0,"tone-mapping":!0,"environment-image":!0}),j(e).forEach(a),this.h()},h(){ue(e,"id","world_solid"),ue(e,"alt","3D Object of Perlin noise combined world"),je(e,"height",s[1]+"px"),je(e,"width",s[1]+"px"),ue(e,"class","rounded-md svelte-ejeoti"),be(e.src,n="/"+s[0]+"/out.gltf")||ue(e,"src",n),ue(e,"auto-rotate",""),ue(e,"camera-controls",""),ue(e,"shadow-intensity","2"),ue(e,"exposure","0"),ue(e,"shadow-softness","0.65"),ue(e,"tone-mapping","commerce"),ue(e,"environment-image","legacy")},m(t,i){f(t,e,i)},p(t,[i]){i&2&&je(e,"height",t[1]+"px"),i&2&&je(e,"width",t[1]+"px"),i&1&&!be(e.src,n="/"+t[0]+"/out.gltf")&&ue(e,"src",n)},i:U,o:U,d(t){t&&a(e)}}}function ft(s,e,n){let{directory:t}=e,{width:i=300}=e;return s.$$set=r=>{"directory"in r&&n(0,t=r.directory),"width"in r&&n(1,i=r.width)},[t,i]}class We extends se{constructor(e){super(),le(this,e,ft,ot,re,{directory:0,width:1})}}function ut(s){let e,n,t,i,r,l,o="close modal",d,$,u;const A=s[3].default,w=$e(A,s,s[2],null);return{c(){e=L("dialog"),n=L("div"),w&&w.c(),t=y(),i=L("hr"),r=y(),l=L("button"),l.textContent=o,this.h()},l(B){e=P(B,"DIALOG",{class:!0});var M=j(e);n=P(M,"DIV",{class:!0});var N=j(n);w&&w.l(N),t=K(N),i=P(N,"HR",{}),r=K(N),l=P(N,"BUTTON",{class:!0,"data-svelte-h":!0}),Me(l)!=="svelte-15i90tf"&&(l.textContent=o),N.forEach(a),M.forEach(a),this.h()},h(){l.autofocus=!0,V(l,"class","svelte-1j3jgbv"),V(n,"class","svelte-1j3jgbv"),V(e,"class","w-10/12 rounded-lg svelte-1j3jgbv")},m(B,M){f(B,e,M),O(e,n),w&&w.m(n,null),O(n,t),O(n,i),O(n,r),O(n,l),s[6](e),d=!0,l.focus(),$||(u=[Ge(l,"click",s[5]),Ge(n,"click",Nn(s[4])),Ge(e,"close",s[7]),Ge(e,"click",Sn(s[8]))],$=!0)},p(B,[M]){w&&w.p&&(!d||M&4)&&ge(w,A,B,B[2],d?pe(A,B[2],M,null):he(B[2]),null)},i(B){d||(b(w,B),d=!0)},o(B){k(w,B),d=!1},d(B){B&&a(e),w&&w.d(B),s[6](null),$=!1,_n(u)}}}function dt(s,e,n){let{$$slots:t={},$$scope:i}=e,{showModal:r}=e,l;function o(w){wn.call(this,s,w)}const d=()=>l.close();function $(w){Ce[w?"unshift":"push"](()=>{l=w,n(1,l)})}const u=()=>n(0,r=!1),A=()=>l.close();return s.$$set=w=>{"showModal"in w&&n(0,r=w.showModal),"$$scope"in w&&n(2,i=w.$$scope)},s.$$.update=()=>{s.$$.dirty&3&&l&&(r?(document.body.classList.add("modal-open"),l.showModal()):document.body.classList.remove("modal-open"))},[r,l,i,t,o,d,$,u,A]}class ct extends se{constructor(e){super(),le(this,e,dt,ut,re,{showModal:0})}}function mt(s){let e,n;const t=s[1].default,i=$e(t,s,s[0],null);return{c(){e=L("span"),i&&i.c(),this.h()},l(r){e=P(r,"SPAN",{class:!0});var l=j(e);i&&i.l(l),l.forEach(a),this.h()},h(){V(e,"class","bg-slate-300 px-1 py-0.5 rounded-sm")},m(r,l){f(r,e,l),i&&i.m(e,null),n=!0},p(r,[l]){i&&i.p&&(!n||l&1)&&ge(i,t,r,r[0],n?pe(t,r[0],l,null):he(r[0]),null)},i(r){n||(b(i,r),n=!0)},o(r){k(i,r),n=!1},d(r){r&&a(e),i&&i.d(r)}}}function $t(s,e,n){let{$$slots:t={},$$scope:i}=e;return s.$$set=r=>{"$$scope"in r&&n(0,i=r.$$scope)},[i,t]}class ne extends se{constructor(e){super(),le(this,e,$t,mt,re,{})}}const gt=`PerlinNouse noise1 = new PerlinNouse("TheFirstNoise".hashCode());
PerlinNouse noise2 = new PerlinNouse("TheSecondPerlinNoise".hashCode());
PerlinNouse noise3 = new PerlinNouse("TheWaterPerlinNoise".hashCode());`,ht=`int terrain_base = 50;
int world_bottom = 25;
int radius = 50;
for(int x = -radius;x < radius;x++){
    for(int z = -radius;z < radius;z++){
        calculate(x,z,...);
    }
}`,pt=`float xf = (float)x;
float zf = (float)z;
double flat_y = noise1.noise(xf / 4,zf / 4) * 6;//Calculate a relatively flat wold
double hilly_y = noise2.noise(xf ,zf ) * 20;
double water_noise = noise3.noise(xf,zf);
int y = fmax(flat_y, hilly_y);
y += terrain_base;
int topLevelY = y;`,_t=`Block topLevelBlock = new Location(world, x, topLevelY, z).getBlock();
if(water_noise < 0.4 || flat_y < hilly_y){
    topLevelBlock.setType(Material.GRASS_BLOCK);
}else if(water_noise < 0.6){
    topLevelBlock.setType(Material.SAND);
}else{
    topLevelBlock.setType(Material.WATER);
}`,wt=`y-=1;
//Fill to bottom with dirt and stone
for(;y > world_bottom;y--){
    new Location(world, x, y, z).getBlock().setType(y > topLevelY-5?Material.DIRT:Material.STONE);
}

//Build caves
for(;topLevelY > world_bottom;topLevelY--){
    float yf = (float)topLevelY - world_bottom; //around 50 to 0
    double noise = noise1.noise(xf,yf,zf);
    if(noise * (1.0 - yf / 50) > 0.3){
        new Location(world, x, topLevelY, z).getBlock().setType(Material.AIR);
    }
}`,vt=s=>({}),cn=s=>({}),bt=s=>({}),mn=s=>({});function kt(s){let e,n,t,i,r,l,o,d,$,u;const A=s[2].title,w=$e(A,s,s[1],mn),B=s[2].body,M=$e(B,s,s[1],cn);return{c(){e=L("li"),n=L("b"),w&&w.c(),t=h(":"),i=L("br"),r=y(),M&&M.c(),l=y(),o=L("pre"),d=L("code"),$=h(s[0]),this.h()},l(N){e=P(N,"LI",{class:!0});var c=j(e);n=P(c,"B",{});var C=j(n);w&&w.l(C),t=p(C,":"),C.forEach(a),i=P(c,"BR",{}),r=K(c),M&&M.l(c),l=K(c),o=P(c,"PRE",{});var g=j(o);d=P(g,"CODE",{class:!0});var F=j(d);$=p(F,s[0]),F.forEach(a),g.forEach(a),c.forEach(a),this.h()},h(){V(d,"class","line-numbers lang-java"),V(e,"class","mt-5")},m(N,c){f(N,e,c),O(e,n),w&&w.m(n,null),O(n,t),O(e,i),O(e,r),M&&M.m(e,null),O(e,l),O(e,o),O(o,d),O(d,$),u=!0},p(N,[c]){w&&w.p&&(!u||c&2)&&ge(w,A,N,N[1],u?pe(A,N[1],c,bt):he(N[1]),mn),M&&M.p&&(!u||c&2)&&ge(M,B,N,N[1],u?pe(B,N[1],c,vt):he(N[1]),cn),(!u||c&1)&&Fe($,N[0])},i(N){u||(b(w,N),b(M,N),u=!0)},o(N){k(w,N),k(M,N),u=!1},d(N){N&&a(e),w&&w.d(N),M&&M.d(N)}}}function Nt(s,e,n){let{$$slots:t={},$$scope:i}=e,{code:r}=e;return s.$$set=l=>{"code"in l&&n(0,r=l.code),"$$scope"in l&&n(1,i=l.$$scope)},[r,i,t]}class Pe extends se{constructor(e){super(),le(this,e,Nt,kt,re,{code:0})}}function St(s){let e,n,t,i=s[0].htmlcode+"";return{c(){e=L("pre"),n=L("code"),t=new En(!1),this.h()},l(r){e=P(r,"PRE",{});var l=j(e);n=P(l,"CODE",{class:!0});var o=j(n);t=Dn(o,!1),o.forEach(a),l.forEach(a),this.h()},h(){t.a=null,V(n,"class","line-numbers")},m(r,l){f(r,e,l),O(e,n),t.m(i,n)},p(r,l){l&1&&i!==(i=r[0].htmlcode+"")&&t.p(i)},d(r){r&&a(e)}}}function zt(s){let e,n,t,i;return{c(){e=h(`So wie die meisten habe ich früher viel Minecraft gespielt und war von der endlosen
    Größe der spielbaren Welt fasziniert. Damals als einfacher Benutzer habe ich das ganze
    System nicht weiter hinterfragt, mit meiner stetig zunehmenden Interesse zur
    funktionsweise von Software / IT wollte ich jedoch verstehen, wie und warum die Welt
    so Endlos und Vielfältig ist. Ich bin auf verschiedene Begriffe wie Prozedural,
    Generisch und Noise gestoßen, bin in das Thema jedoch nie weiter eingestiegen.
    `),n=L("br"),t=L("br"),i=h(`
    In der Vorlesung "Computergrafik" meines Informatikstudiums wurde als benotete Aufgabe
    neben dem schreiben eines Raytracers und WebGl Shaders auch angeboten, generische Formen
    zu erzeugen / konstruieren. Ich habe dabei direkt wieder an die generische Welt von Minecraft
    gedacht und mir zur Aufgabe gemacht, im Rahmen dieser Abgabe eine kleine 100x100 Block
    große, generisch erzeugte Welt zu konstruieren.`)},l(r){e=p(r,`So wie die meisten habe ich früher viel Minecraft gespielt und war von der endlosen
    Größe der spielbaren Welt fasziniert. Damals als einfacher Benutzer habe ich das ganze
    System nicht weiter hinterfragt, mit meiner stetig zunehmenden Interesse zur
    funktionsweise von Software / IT wollte ich jedoch verstehen, wie und warum die Welt
    so Endlos und Vielfältig ist. Ich bin auf verschiedene Begriffe wie Prozedural,
    Generisch und Noise gestoßen, bin in das Thema jedoch nie weiter eingestiegen.
    `),n=P(r,"BR",{}),t=P(r,"BR",{}),i=p(r,`
    In der Vorlesung "Computergrafik" meines Informatikstudiums wurde als benotete Aufgabe
    neben dem schreiben eines Raytracers und WebGl Shaders auch angeboten, generische Formen
    zu erzeugen / konstruieren. Ich habe dabei direkt wieder an die generische Welt von Minecraft
    gedacht und mir zur Aufgabe gemacht, im Rahmen dieser Abgabe eine kleine 100x100 Block
    große, generisch erzeugte Welt zu konstruieren.`)},m(r,l){f(r,e,l),f(r,n,l),f(r,t,l),f(r,i,l)},p:U,d(r){r&&(a(e),a(n),a(t),a(i))}}}function Et(s){let e;return{c(){e=h("prozeduralen Landschaftsgenerierung")},l(n){e=p(n,"prozeduralen Landschaftsgenerierung")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Dt(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M;return o=new ee({props:{reference:s[1],showFullName:!0}}),w=new de({props:{href:"https://www.cs.cmu.edu/~112/notes/student-tp-guides/Terrain.pdf",$$slots:{default:[Et]},$$scope:{ctx:s}}}),{c(){e=L("div"),n=h(`Ziel ist es durch Überlagerung von Noisefunktionen einen Algorithmus zu
            entwickeln, der eine organisch wirkende Welt in Minecraft generiert. Diese
            Welt soll relativ gerade Grasslandschaften haben und immer wieder von Hügeln,
            Seen und Stränden geprägt werden. Abschließend soll Minecrafttypisch das
            Konstrukt von dreidimensionalen Höhlen und Schluchten durchbohrt sein. `),t=L("br"),i=y(),r=L("br"),l=h(`
            Um den CAD Aspekt der gegeben Aufgabe zu erfüllen, wird die generierte Sektion
            der Welt mit einem Tool in eine .obj Datei exportiert, wie auf `),E(o.$$.fragment),d=h(`
            zu sehen in Blender gerendert und Abschließend mit einem 3D Drucker ausgedruckt.
            Das Spiel Minecraft ist also in diesem Kontext lediglich das Tool, welches die
            programmierten Noiseüberlagerungen darstellt (und Inspiration für dieses Projekt
            ist).`),$=L("br"),u=L("br"),A=h(`

            Minecraft ist ein Paradebeispiel für das Konzept der `),E(w.$$.fragment),B=h(", weshalb die Verwendung / Anlehnung an das Spiel naheliegend ist"),this.h()},l(N){e=P(N,"DIV",{slot:!0});var c=j(e);n=p(c,`Ziel ist es durch Überlagerung von Noisefunktionen einen Algorithmus zu
            entwickeln, der eine organisch wirkende Welt in Minecraft generiert. Diese
            Welt soll relativ gerade Grasslandschaften haben und immer wieder von Hügeln,
            Seen und Stränden geprägt werden. Abschließend soll Minecrafttypisch das
            Konstrukt von dreidimensionalen Höhlen und Schluchten durchbohrt sein. `),t=P(c,"BR",{}),i=K(c),r=P(c,"BR",{}),l=p(c,`
            Um den CAD Aspekt der gegeben Aufgabe zu erfüllen, wird die generierte Sektion
            der Welt mit einem Tool in eine .obj Datei exportiert, wie auf `),D(o.$$.fragment,c),d=p(c,`
            zu sehen in Blender gerendert und Abschließend mit einem 3D Drucker ausgedruckt.
            Das Spiel Minecraft ist also in diesem Kontext lediglich das Tool, welches die
            programmierten Noiseüberlagerungen darstellt (und Inspiration für dieses Projekt
            ist).`),$=P(c,"BR",{}),u=P(c,"BR",{}),A=p(c,`

            Minecraft ist ein Paradebeispiel für das Konzept der `),D(w.$$.fragment,c),B=p(c,", weshalb die Verwendung / Anlehnung an das Spiel naheliegend ist"),c.forEach(a),this.h()},h(){V(e,"slot","left")},m(N,c){f(N,e,c),O(e,n),O(e,t),O(e,i),O(e,r),O(e,l),I(o,e,null),O(e,d),O(e,$),O(e,u),O(e,A),I(w,e,null),O(e,B),M=!0},p(N,c){const C={};c&524288&&(C.$$scope={dirty:c,ctx:N}),w.$set(C)},i(N){M||(b(o.$$.fragment,N),b(w.$$.fragment,N),M=!0)},o(N){k(o.$$.fragment,N),k(w.$$.fragment,N),M=!1},d(N){N&&a(e),R(o),R(w)}}}function It(s){let e,n;return{c(){e=L("img"),this.h()},l(t){e=P(t,"IMG",{src:!0,alt:!0}),this.h()},h(){be(e.src,n="alltogether/rendered.png")||V(e,"src",n),V(e,"alt","Endresult")},m(t,i){f(t,e,i)},p:U,d(t){t&&a(e)}}}function Rt(s){let e,n;return e=new ie({props:{slot:"right",imageRef:s[1],$$slots:{default:[It]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&524288&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function At(s){let e,n;return e=new Ke({props:{$$slots:{right:[Rt],left:[Dt]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&524288&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Mt(s){let e;return{c(){e=h(`Die Funktionsweise (bzw. das Potential) von Noisefunktionen wird Mithilfe von Shadern
    erklärt. Der Verwendete Code für den Fragment Shader ist beim Klicken auf das
    Canvas-Element einsehbar. Hinweis: Der Code für die Noisefunktionen wird als gegeben
    betrachtet und ist im Quelltext als nicht selbst verfasst gekennzeichnet. Der
    restliche Code ist eigenarbeit. Um den Rahmen dieser Arbeit nicht zu sprengen, wird
    der Code nicht direkt im Text, sondern in Form von Quelltextkommentaren erleutert.`)},l(n){e=p(n,`Die Funktionsweise (bzw. das Potential) von Noisefunktionen wird Mithilfe von Shadern
    erklärt. Der Verwendete Code für den Fragment Shader ist beim Klicken auf das
    Canvas-Element einsehbar. Hinweis: Der Code für die Noisefunktionen wird als gegeben
    betrachtet und ist im Quelltext als nicht selbst verfasst gekennzeichnet. Der
    restliche Code ist eigenarbeit. Um den Rahmen dieser Arbeit nicht zu sprengen, wird
    der Code nicht direkt im Text, sondern in Form von Quelltextkommentaren erleutert.`)},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Bt(s){let e;return{c(){e=h("Perlin-Noise")},l(n){e=p(n,"Perlin-Noise")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ft(s){let e;return{c(){e=h("Ken Perlin")},l(n){e=p(n,"Ken Perlin")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Lt(s){let e,n;return{c(){e=L("img"),this.h()},l(t){e=P(t,"IMG",{src:!0,alt:!0}),this.h()},h(){be(e.src,n="imgs/noiseexplain.png")||V(e,"src",n),V(e,"alt","gradient noise explained")},m(t,i){f(t,e,i)},p:U,d(t){t&&a(e)}}}function Pt(s){let e;return{c(){e=h("[Quelle]")},l(n){e=p(n,"[Quelle]")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Gt(s){let e,n,t,i;return t=new de({props:{href:"https://adrianb.io/2014/08/09/perlinnoise.html",$$slots:{default:[Pt]},$$scope:{ctx:s}}}),{c(){e=L("span"),n=h("- "),E(t.$$.fragment),this.h()},l(r){e=P(r,"SPAN",{slot:!0});var l=j(e);n=p(l,"- "),D(t.$$.fragment,l),l.forEach(a),this.h()},h(){V(e,"slot","desc")},m(r,l){f(r,e,l),O(e,n),I(t,e,null),i=!0},p(r,l){const o={};l&524288&&(o.$$scope={dirty:l,ctx:r}),t.$set(o)},i(r){i||(b(t.$$.fragment,r),i=!0)},o(r){k(t.$$.fragment,r),i=!1},d(r){r&&a(e),R(t)}}}function Ct(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:nt}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Wt(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:tt}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Tt(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:it}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Ot(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:at}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Vt(s){let e,n,t,i,r,l,o,d;return n=new ee({props:{reference:s[7]}}),{c(){e=h(`Für die Landschaftsgenerierung wird mittels Noise häufig die Terrainhöhe
            bestimmt, die Farbwerte (Hier graustufen) geben also an, wie hoch die die
            Landschaft an den gegebenen Koordinaten von der Grundhöhe (Baseline) entfernt
            sind `),E(n.$$.fragment),t=h(". "),i=L("br"),r=h(`
            Trotz der weichen Übergänge und alles in allem organisch und zufällig wirkendem
            Ergebnis, sieht das Graustufenmuster sehr gleichmäßig und "Eindimensional" aus.
            Dieser Effekt ist bei der generierung von Landschaften unerwünscht. `),l=L("br"),o=h(`
            Eine mögliche Lösung ist die überlagerungen mehrerer (gleichartiger) Noise Funktionen,
            wobei diese sich in einem Offset unterscheiden. Dieser Offset lässt durch die Pseudorandomisierung
            die Noisefunktion zueinander unterschiedlich Aussehen.`)},l($){e=p($,`Für die Landschaftsgenerierung wird mittels Noise häufig die Terrainhöhe
            bestimmt, die Farbwerte (Hier graustufen) geben also an, wie hoch die die
            Landschaft an den gegebenen Koordinaten von der Grundhöhe (Baseline) entfernt
            sind `),D(n.$$.fragment,$),t=p($,". "),i=P($,"BR",{}),r=p($,`
            Trotz der weichen Übergänge und alles in allem organisch und zufällig wirkendem
            Ergebnis, sieht das Graustufenmuster sehr gleichmäßig und "Eindimensional" aus.
            Dieser Effekt ist bei der generierung von Landschaften unerwünscht. `),l=P($,"BR",{}),o=p($,`
            Eine mögliche Lösung ist die überlagerungen mehrerer (gleichartiger) Noise Funktionen,
            wobei diese sich in einem Offset unterscheiden. Dieser Offset lässt durch die Pseudorandomisierung
            die Noisefunktion zueinander unterschiedlich Aussehen.`)},m($,u){f($,e,u),I(n,$,u),f($,t,u),f($,i,u),f($,r,u),f($,l,u),f($,o,u),d=!0},p:U,i($){d||(b(n.$$.fragment,$),d=!0)},o($){k(n.$$.fragment,$),d=!1},d($){$&&(a(e),a(t),a(i),a(r),a(l),a(o)),R(n,$)}}}function Ht(s){let e,n;return{c(){e=L("img"),this.h()},l(t){e=P(t,"IMG",{src:!0,alt:!0}),this.h()},h(){be(e.src,n="imgs/perlinnoise3d.png")||V(e,"src",n),V(e,"alt","perlin noise 2d on 3d explained")},m(t,i){f(t,e,i)},p:U,d(t){t&&a(e)}}}function xt(s){let e;return{c(){e=h("[Quelle]")},l(n){e=p(n,"[Quelle]")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function jt(s){let e,n,t,i;return t=new de({props:{href:"https://www.researchgate.net/figure/Perlin-noise-pattern-represented-as-greyscale-image-left-and-the-resulting-terrain_fig1_274384740",$$slots:{default:[xt]},$$scope:{ctx:s}}}),{c(){e=L("span"),n=h("- "),E(t.$$.fragment),this.h()},l(r){e=P(r,"SPAN",{slot:!0});var l=j(e);n=p(l,"- "),D(t.$$.fragment,l),l.forEach(a),this.h()},h(){V(e,"slot","desc")},m(r,l){f(r,e,l),O(e,n),I(t,e,null),i=!0},p(r,l){const o={};l&524288&&(o.$$scope={dirty:l,ctx:r}),t.$set(o)},i(r){i||(b(t.$$.fragment,r),i=!0)},o(r){k(t.$$.fragment,r),i=!1},d(r){r&&a(e),R(t)}}}function yt(s){let e,n;return e=new ie({props:{slot:"right",imageRef:s[7],$$slots:{desc:[jt],default:[Ht]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&524288&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Kt(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:rt}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Ut(s){let e,n;return e=new Re({props:{openModal:s[17],fragmentShader:st}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Zt(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,F,x,_,G,S,W,Z,Y,Q,q,J,z,v,H,ae,oe,X,ce,fe,ke,Ne,Se,me,Te,_e,we,Ze,ve,Oe,ze,Ve,Ee,He,xe;return n=new de({props:{href:"https://www.cs.umd.edu/class/fall2019/cmsc425/handouts/lect14-perlin.pdf",$$slots:{default:[Bt]},$$scope:{ctx:s}}}),o=new ee({props:{reference:s[3],showFullName:!1}}),M=new ee({props:{reference:s[4],showFullName:!1}}),c=new de({props:{href:"https://cs.nyu.edu/~perlin/",$$slots:{default:[Ft]},$$scope:{ctx:s}}}),g=new ee({props:{reference:s[2],showFullName:!1}}),x=new ie({props:{imageRef:s[2],$$slots:{desc:[Gt],default:[Lt]},$$scope:{ctx:s}}}),G=new ee({props:{reference:s[5],showFullName:!1}}),Z=new ie({props:{imageRef:s[3],$$slots:{default:[Ct]},$$scope:{ctx:s}}}),Q=new ie({props:{imageRef:s[4],$$slots:{default:[Wt]},$$scope:{ctx:s}}}),J=new ie({props:{imageRef:s[5],$$slots:{default:[Tt]},$$scope:{ctx:s}}}),v=new ie({props:{imageRef:s[6],$$slots:{default:[Ot]},$$scope:{ctx:s}}}),X=new Ke({props:{$$slots:{right:[yt],left:[Vt]},$$scope:{ctx:s}}}),fe=new ee({props:{reference:s[8]}}),me=new ee({props:{reference:s[9],showFullName:!1}}),we=new ie({props:{imageRef:s[8],$$slots:{default:[Kt]},$$scope:{ctx:s}}}),ve=new ie({props:{imageRef:s[9],$$slots:{default:[Ut]},$$scope:{ctx:s}}}),ze=new ee({props:{reference:s[8]}}),Ee=new ee({props:{reference:s[9]}}),{c(){e=h(`Prozedurale Landschaftsgenerierung ist ein Verfahren in der Computergrafik und
    Spieleentwicklung zur automatischen Erstellung von Terrains und Landschaften in
    digitalen Umgebungen mittels Algorithmen. Sie nutzt mathematische Funktionen wie `),E(n.$$.fragment),t=h(`, um vielfältige und realistisch wirkende Szenerien zu schaffen, ohne dass jede
    Detail von Hand modelliert werden muss. Im vergleich zu reinen
    Pseudo-Zufallsalgrotihmen bietet Noise eine interpolation zwischen Zufallswerten,
    wodurch daraus generierte Inhalte "weiche" Zustandsänderungen aufweisen.
    `),i=L("br"),r=L("br"),l=h(`
    Beim einfachen Interpolieren zwischen Zufallswerten enteht ein sogennantes "Value Noise"
    (`),E(o.$$.fragment),d=h(`). Bei
    genauerem Betrachten lassen sich noch die harten Kanten zwischen den Zufallszahlen
    erkennen, wodurch der Value noise eine "Blockartige struktur" aufweist.`),$=L("br"),u=h(`
    In manchen Anwendungsfällen (Wie in der Landschaftsgenerierung) sind solche offensichtlichen
    Artefakte unerwünscht.`),A=L("br"),w=L("br"),B=h(` In diesen Fällen bietet der sogennante "Perlin
    Noise" (`),E(M.$$.fragment),N=h(") von "),E(c.$$.fragment),C=h(` abhilfe. Dieser ist durch eine deutlich organischere Struktur gekennzeichnet. Im gegensatz
    zum Value Noise ist der Perlin Noise ein "Gradient Noise", also die Interpolation von Gradienten.
    Im Gradient Noise werden an jedem Punkt des Gitters (Also die Eckpunkte zwischen denen
    die Interpolation stattfindet, siehe `),E(g.$$.fragment),F=h(`) Gradientenvektoren generiert, die eine Richtung und eine Größe haben.

    `),E(x.$$.fragment),_=h(`
    Diese Gradienten werden dann genutzt, um die Ausgabe basierend auf der Distanz zu den nächsten
    Gitterpunkten zu interpolieren. Im Value Noise hingegen werden zufällige (Skalare) Werte
    an den Gitterpunkten generiert und zwischen diesen interpoliert, ohne Berücksichtigung
    der Richtung. Da der Perlin Noise relativ rechenintensiv ist, wurde der "Simplex Noise"
    (Auch auf Basis von Gradienten) entwickelt
    `),E(G.$$.fragment),S=h(`)

    `),W=L("div"),E(Z.$$.fragment),Y=y(),E(Q.$$.fragment),q=y(),E(J.$$.fragment),z=y(),E(v.$$.fragment),H=y(),ae=L("br"),oe=y(),E(X.$$.fragment),ce=h(`

    Zur Überlagerung können entweder die Noisewerte addiert werden `),E(fe.$$.fragment),ke=h(`, wodurch das Ergebnis deutlich ungleichmäßiger wirkt. Dieser Effekt ist
    beispielsweise bei der Generierung von Wolken ideal. Bei der Generierung von
    Landschaften jedoch ist eine gewisse Form von gleichmäßigkeit erwünscht. Die Erde ist
    grundsätzlich in ökologische Einheiten aufgeteilt, die durch ihre Pflanzen, Klima
    sowie allgemeines Aussehen definiert werden.
    `),Ne=L("br"),Se=h(`
    Um diese ökologischen Einheiten, auch als "Biome" bezeichnet, mittels Noise zu modellieren,
    muss eine Skalierte Variante gewählt werden, bei der die Zustandsänderung sehr langsam
    erfolgt. Dieser langsame Noise definiert den Biomtyp, aus dem dann weitere Eigenschaften
    abgeleitet werden können. In `),E(me.$$.fragment),Te=h(` wird der größte Wert der verwendeteten Noise funktionen an einem Koordinatenpunkt gewählt.
    Die daraus entstehende Landschaft sieht dadurch deutlich natürlicher aus. Aus den Graustufen
    lassen sich die Biome "Gebirge" und "Weiden" modellieren, wobei die Gebirge hoch und "rau"
    sind und die Weiden geglättet und weich

    `),_e=L("div"),E(we.$$.fragment),Ze=y(),E(ve.$$.fragment),Oe=h(`

    In den Beispielen (`),E(ze.$$.fragment),Ve=h(`,
    `),E(Ee.$$.fragment),He=h(`) werden drei
    unterschiedlich skalierte Noisefunktionen verwendet. In Minecraft werden verschiedene
    Noisefunktionen verwendet, um Physikalische Eigenschaften, wie z.B. Luftfeuchtigkeit
    und Temperatur zu simulieren. Aus Kombination dieser Physikalischen Eigenschaften
    lassen sich dann realistisch Biome ermitteln. Eine hohe Temperatur und niedrige
    Feuchtigkeit führt beispielsweise zu einer Wüste, bei einer hohen Feuchtigkeit zu
    einem Regenwald (tropisch). Durch den Physikalischen Aspekt wirkt die Platzierung
    benachbarter Biome logisch.`),this.h()},l(m){e=p(m,`Prozedurale Landschaftsgenerierung ist ein Verfahren in der Computergrafik und
    Spieleentwicklung zur automatischen Erstellung von Terrains und Landschaften in
    digitalen Umgebungen mittels Algorithmen. Sie nutzt mathematische Funktionen wie `),D(n.$$.fragment,m),t=p(m,`, um vielfältige und realistisch wirkende Szenerien zu schaffen, ohne dass jede
    Detail von Hand modelliert werden muss. Im vergleich zu reinen
    Pseudo-Zufallsalgrotihmen bietet Noise eine interpolation zwischen Zufallswerten,
    wodurch daraus generierte Inhalte "weiche" Zustandsänderungen aufweisen.
    `),i=P(m,"BR",{}),r=P(m,"BR",{}),l=p(m,`
    Beim einfachen Interpolieren zwischen Zufallswerten enteht ein sogennantes "Value Noise"
    (`),D(o.$$.fragment,m),d=p(m,`). Bei
    genauerem Betrachten lassen sich noch die harten Kanten zwischen den Zufallszahlen
    erkennen, wodurch der Value noise eine "Blockartige struktur" aufweist.`),$=P(m,"BR",{}),u=p(m,`
    In manchen Anwendungsfällen (Wie in der Landschaftsgenerierung) sind solche offensichtlichen
    Artefakte unerwünscht.`),A=P(m,"BR",{}),w=P(m,"BR",{}),B=p(m,` In diesen Fällen bietet der sogennante "Perlin
    Noise" (`),D(M.$$.fragment,m),N=p(m,") von "),D(c.$$.fragment,m),C=p(m,` abhilfe. Dieser ist durch eine deutlich organischere Struktur gekennzeichnet. Im gegensatz
    zum Value Noise ist der Perlin Noise ein "Gradient Noise", also die Interpolation von Gradienten.
    Im Gradient Noise werden an jedem Punkt des Gitters (Also die Eckpunkte zwischen denen
    die Interpolation stattfindet, siehe `),D(g.$$.fragment,m),F=p(m,`) Gradientenvektoren generiert, die eine Richtung und eine Größe haben.

    `),D(x.$$.fragment,m),_=p(m,`
    Diese Gradienten werden dann genutzt, um die Ausgabe basierend auf der Distanz zu den nächsten
    Gitterpunkten zu interpolieren. Im Value Noise hingegen werden zufällige (Skalare) Werte
    an den Gitterpunkten generiert und zwischen diesen interpoliert, ohne Berücksichtigung
    der Richtung. Da der Perlin Noise relativ rechenintensiv ist, wurde der "Simplex Noise"
    (Auch auf Basis von Gradienten) entwickelt
    `),D(G.$$.fragment,m),S=p(m,`)

    `),W=P(m,"DIV",{class:!0});var T=j(W);D(Z.$$.fragment,T),Y=K(T),D(Q.$$.fragment,T),q=K(T),D(J.$$.fragment,T),z=K(T),D(v.$$.fragment,T),T.forEach(a),H=K(m),ae=P(m,"BR",{}),oe=K(m),D(X.$$.fragment,m),ce=p(m,`

    Zur Überlagerung können entweder die Noisewerte addiert werden `),D(fe.$$.fragment,m),ke=p(m,`, wodurch das Ergebnis deutlich ungleichmäßiger wirkt. Dieser Effekt ist
    beispielsweise bei der Generierung von Wolken ideal. Bei der Generierung von
    Landschaften jedoch ist eine gewisse Form von gleichmäßigkeit erwünscht. Die Erde ist
    grundsätzlich in ökologische Einheiten aufgeteilt, die durch ihre Pflanzen, Klima
    sowie allgemeines Aussehen definiert werden.
    `),Ne=P(m,"BR",{}),Se=p(m,`
    Um diese ökologischen Einheiten, auch als "Biome" bezeichnet, mittels Noise zu modellieren,
    muss eine Skalierte Variante gewählt werden, bei der die Zustandsänderung sehr langsam
    erfolgt. Dieser langsame Noise definiert den Biomtyp, aus dem dann weitere Eigenschaften
    abgeleitet werden können. In `),D(me.$$.fragment,m),Te=p(m,` wird der größte Wert der verwendeteten Noise funktionen an einem Koordinatenpunkt gewählt.
    Die daraus entstehende Landschaft sieht dadurch deutlich natürlicher aus. Aus den Graustufen
    lassen sich die Biome "Gebirge" und "Weiden" modellieren, wobei die Gebirge hoch und "rau"
    sind und die Weiden geglättet und weich

    `),_e=P(m,"DIV",{class:!0});var De=j(_e);D(we.$$.fragment,De),Ze=K(De),D(ve.$$.fragment,De),De.forEach(a),Oe=p(m,`

    In den Beispielen (`),D(ze.$$.fragment,m),Ve=p(m,`,
    `),D(Ee.$$.fragment,m),He=p(m,`) werden drei
    unterschiedlich skalierte Noisefunktionen verwendet. In Minecraft werden verschiedene
    Noisefunktionen verwendet, um Physikalische Eigenschaften, wie z.B. Luftfeuchtigkeit
    und Temperatur zu simulieren. Aus Kombination dieser Physikalischen Eigenschaften
    lassen sich dann realistisch Biome ermitteln. Eine hohe Temperatur und niedrige
    Feuchtigkeit führt beispielsweise zu einer Wüste, bei einer hohen Feuchtigkeit zu
    einem Regenwald (tropisch). Durch den Physikalischen Aspekt wirkt die Platzierung
    benachbarter Biome logisch.`),this.h()},h(){V(W,"class","flex flex-wrap justify-evenly mt-7"),V(_e,"class","flex flex-wrap justify-evenly mt-7")},m(m,T){f(m,e,T),I(n,m,T),f(m,t,T),f(m,i,T),f(m,r,T),f(m,l,T),I(o,m,T),f(m,d,T),f(m,$,T),f(m,u,T),f(m,A,T),f(m,w,T),f(m,B,T),I(M,m,T),f(m,N,T),I(c,m,T),f(m,C,T),I(g,m,T),f(m,F,T),I(x,m,T),f(m,_,T),I(G,m,T),f(m,S,T),f(m,W,T),I(Z,W,null),O(W,Y),I(Q,W,null),O(W,q),I(J,W,null),O(W,z),I(v,W,null),f(m,H,T),f(m,ae,T),f(m,oe,T),I(X,m,T),f(m,ce,T),I(fe,m,T),f(m,ke,T),f(m,Ne,T),f(m,Se,T),I(me,m,T),f(m,Te,T),f(m,_e,T),I(we,_e,null),O(_e,Ze),I(ve,_e,null),f(m,Oe,T),I(ze,m,T),f(m,Ve,T),I(Ee,m,T),f(m,He,T),xe=!0},p(m,T){const De={};T&524288&&(De.$$scope={dirty:T,ctx:m}),n.$set(De);const Je={};T&524288&&(Je.$$scope={dirty:T,ctx:m}),c.$set(Je);const Xe={};T&524288&&(Xe.$$scope={dirty:T,ctx:m}),x.$set(Xe);const qe={};T&524288&&(qe.$$scope={dirty:T,ctx:m}),Z.$set(qe);const en={};T&524288&&(en.$$scope={dirty:T,ctx:m}),Q.$set(en);const nn={};T&524288&&(nn.$$scope={dirty:T,ctx:m}),J.$set(nn);const tn={};T&524288&&(tn.$$scope={dirty:T,ctx:m}),v.$set(tn);const rn={};T&524288&&(rn.$$scope={dirty:T,ctx:m}),X.$set(rn);const sn={};T&524288&&(sn.$$scope={dirty:T,ctx:m}),we.$set(sn);const ln={};T&524288&&(ln.$$scope={dirty:T,ctx:m}),ve.$set(ln)},i(m){xe||(b(n.$$.fragment,m),b(o.$$.fragment,m),b(M.$$.fragment,m),b(c.$$.fragment,m),b(g.$$.fragment,m),b(x.$$.fragment,m),b(G.$$.fragment,m),b(Z.$$.fragment,m),b(Q.$$.fragment,m),b(J.$$.fragment,m),b(v.$$.fragment,m),b(X.$$.fragment,m),b(fe.$$.fragment,m),b(me.$$.fragment,m),b(we.$$.fragment,m),b(ve.$$.fragment,m),b(ze.$$.fragment,m),b(Ee.$$.fragment,m),xe=!0)},o(m){k(n.$$.fragment,m),k(o.$$.fragment,m),k(M.$$.fragment,m),k(c.$$.fragment,m),k(g.$$.fragment,m),k(x.$$.fragment,m),k(G.$$.fragment,m),k(Z.$$.fragment,m),k(Q.$$.fragment,m),k(J.$$.fragment,m),k(v.$$.fragment,m),k(X.$$.fragment,m),k(fe.$$.fragment,m),k(me.$$.fragment,m),k(we.$$.fragment,m),k(ve.$$.fragment,m),k(ze.$$.fragment,m),k(Ee.$$.fragment,m),xe=!1},d(m){m&&(a(e),a(t),a(i),a(r),a(l),a(d),a($),a(u),a(A),a(w),a(B),a(N),a(C),a(F),a(_),a(S),a(W),a(H),a(ae),a(oe),a(ce),a(ke),a(Ne),a(Se),a(Te),a(_e),a(Oe),a(Ve),a(He)),R(n,m),R(o,m),R(M,m),R(c,m),R(g,m),R(x,m),R(G,m),R(Z),R(Q),R(J),R(v),R(X,m),R(fe,m),R(me,m),R(we),R(ve),R(ze,m),R(Ee,m)}}}function Yt(s){let e;return{c(){e=h("Client Modifikationen (Mods)")},l(n){e=p(n,"Client Modifikationen (Mods)")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Qt(s){let e;return{c(){e=h("Server Modifikationen (Serverplugins)")},l(n){e=p(n,"Server Modifikationen (Serverplugins)")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Jt(s){let e;return{c(){e=h("buildWorld")},l(n){e=p(n,"buildWorld")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Xt(s){let e;return{c(){e=h("Initialisierung der Perlin Noise Objekte")},l(n){e=p(n,"Initialisierung der Perlin Noise Objekte")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function qt(s){let e;return{c(){e=h(`Als Parameter für den Perlin Noise Konstruktor wird ein seed erwartet,
                also eine Zahl, die den Startwert des Pseudo-Zufallsalgrotihmus bildet. In
                dem gegebene Codeschnipsel wird eine Zeichenkette gehashed und die daraus
                resultierende Zahl als Argument verwendet. Es stehen somit drei Perlin
                Noise Objekte zur Verfügung, bei den gleichen Eingabewerte jeweils
                unterschiedliche Noisewerte liefern`)},l(n){e=p(n,`Als Parameter für den Perlin Noise Konstruktor wird ein seed erwartet,
                also eine Zahl, die den Startwert des Pseudo-Zufallsalgrotihmus bildet. In
                dem gegebene Codeschnipsel wird eine Zeichenkette gehashed und die daraus
                resultierende Zahl als Argument verwendet. Es stehen somit drei Perlin
                Noise Objekte zur Verfügung, bei den gleichen Eingabewerte jeweils
                unterschiedliche Noisewerte liefern`)},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ei(s){let e;return{c(){e=h("Iterierung durch die mögliche 2D Koordinaten")},l(n){e=p(n,"Iterierung durch die mögliche 2D Koordinaten")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ni(s){let e;return{c(){e=h("radius")},l(n){e=p(n,"radius")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ti(s){let e;return{c(){e=h("terrain_base")},l(n){e=p(n,"terrain_base")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ii(s){let e;return{c(){e=h("x")},l(n){e=p(n,"x")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ri(s){let e;return{c(){e=h("z")},l(n){e=p(n,"z")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function si(s){let e;return{c(){e=h("calculate")},l(n){e=p(n,"calculate")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function li(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N;return n=new ne({props:{$$slots:{default:[ni]},$$scope:{ctx:s}}}),i=new ne({props:{$$slots:{default:[ti]},$$scope:{ctx:s}}}),$=new ne({props:{$$slots:{default:[ii]},$$scope:{ctx:s}}}),A=new ne({props:{$$slots:{default:[ri]},$$scope:{ctx:s}}}),B=new ne({props:{$$slots:{default:[si]},$$scope:{ctx:s}}}),{c(){e=h("Es werden verschiedene felder gesetzt, wie die Größe der Welt ("),E(n.$$.fragment),t=h("), die Basishöhe der Landschaft ("),E(i.$$.fragment),r=h(`) sowie die
                Y-Koordinate der Tiefsten Schicht im 3D Modell`),l=L("br"),o=L("br"),d=h(`
                Zum Schluss wird in einer verschachtelten Schleife für jede mögliche `),E($.$$.fragment),u=h(" und "),E(A.$$.fragment),w=h(" Koordinaten-Kombination die "),E(B.$$.fragment),M=h(` Funktion
                aufgerufen. Die calculate-Funktion könnte theoretisch parallel aufgerufen werden
                und ist von der Denkweise ähnlich zu einem Shader.`)},l(c){e=p(c,"Es werden verschiedene felder gesetzt, wie die Größe der Welt ("),D(n.$$.fragment,c),t=p(c,"), die Basishöhe der Landschaft ("),D(i.$$.fragment,c),r=p(c,`) sowie die
                Y-Koordinate der Tiefsten Schicht im 3D Modell`),l=P(c,"BR",{}),o=P(c,"BR",{}),d=p(c,`
                Zum Schluss wird in einer verschachtelten Schleife für jede mögliche `),D($.$$.fragment,c),u=p(c," und "),D(A.$$.fragment,c),w=p(c," Koordinaten-Kombination die "),D(B.$$.fragment,c),M=p(c,` Funktion
                aufgerufen. Die calculate-Funktion könnte theoretisch parallel aufgerufen werden
                und ist von der Denkweise ähnlich zu einem Shader.`)},m(c,C){f(c,e,C),I(n,c,C),f(c,t,C),I(i,c,C),f(c,r,C),f(c,l,C),f(c,o,C),f(c,d,C),I($,c,C),f(c,u,C),I(A,c,C),f(c,w,C),I(B,c,C),f(c,M,C),N=!0},p(c,C){const g={};C&524288&&(g.$$scope={dirty:C,ctx:c}),n.$set(g);const F={};C&524288&&(F.$$scope={dirty:C,ctx:c}),i.$set(F);const x={};C&524288&&(x.$$scope={dirty:C,ctx:c}),$.$set(x);const _={};C&524288&&(_.$$scope={dirty:C,ctx:c}),A.$set(_);const G={};C&524288&&(G.$$scope={dirty:C,ctx:c}),B.$set(G)},i(c){N||(b(n.$$.fragment,c),b(i.$$.fragment,c),b($.$$.fragment,c),b(A.$$.fragment,c),b(B.$$.fragment,c),N=!0)},o(c){k(n.$$.fragment,c),k(i.$$.fragment,c),k($.$$.fragment,c),k(A.$$.fragment,c),k(B.$$.fragment,c),N=!1},d(c){c&&(a(e),a(t),a(r),a(l),a(o),a(d),a(u),a(w),a(M)),R(n,c),R(i,c),R($,c),R(A,c),R(B,c)}}}function ai(s){let e;return{c(){e=h("Berechnung der Landschaftshöhe (oberste Schicht)")},l(n){e=p(n,"Berechnung der Landschaftshöhe (oberste Schicht)")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function oi(s){let e,n,t,i,r;return i=new We({props:{directory:"slow",width:200}}),{c(){e=L("img"),t=y(),E(i.$$.fragment),this.h()},l(l){e=P(l,"IMG",{width:!0,height:!0,src:!0,alt:!0}),t=K(l),D(i.$$.fragment,l),this.h()},h(){V(e,"width","200px"),V(e,"height","200px"),be(e.src,n="slow/mcnoise.png")||V(e,"src",n),V(e,"alt","Flat Noise Minecraft")},m(l,o){f(l,e,o),f(l,t,o),I(i,l,o),r=!0},p:U,i(l){r||(b(i.$$.fragment,l),r=!0)},o(l){k(i.$$.fragment,l),r=!1},d(l){l&&(a(e),a(t)),R(i,l)}}}function fi(s){let e,n,t,i,r;return i=new We({props:{directory:"hilly",width:200}}),{c(){e=L("img"),t=y(),E(i.$$.fragment),this.h()},l(l){e=P(l,"IMG",{width:!0,height:!0,src:!0,alt:!0}),t=K(l),D(i.$$.fragment,l),this.h()},h(){V(e,"width","200px"),V(e,"height","200px"),be(e.src,n="hilly/mcnoise.png")||V(e,"src",n),V(e,"alt","Hilly Noise Minecraft")},m(l,o){f(l,e,o),f(l,t,o),I(i,l,o),r=!0},p:U,i(l){r||(b(i.$$.fragment,l),r=!0)},o(l){k(i.$$.fragment,l),r=!1},d(l){l&&(a(e),a(t)),R(i,l)}}}function ui(s){let e;return{c(){e=h("noise1")},l(n){e=p(n,"noise1")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function di(s){let e;return{c(){e=h("noise2")},l(n){e=p(n,"noise2")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ci(s){let e;return{c(){e=h("noise1")},l(n){e=p(n,"noise1")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function mi(s){let e,n;return e=new We({props:{directory:"slowAndHilly",width:200}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function $i(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,F,x,_,G,S,W,Z,Y,Q,q,J;return n=new ee({props:{reference:s[9],showFullName:!0}}),r=new ie({props:{imageRef:s[10],$$slots:{default:[oi]},$$scope:{ctx:s}}}),o=new ie({props:{imageRef:s[11],$$slots:{default:[fi]},$$scope:{ctx:s}}}),$=new ee({props:{reference:s[10]}}),A=new ee({props:{reference:s[11]}}),B=new ee({props:{reference:s[12],showFullName:!1}}),g=new ne({props:{$$slots:{default:[ui]},$$scope:{ctx:s}}}),x=new ee({props:{reference:s[10]}}),G=new ne({props:{$$slots:{default:[di]},$$scope:{ctx:s}}}),W=new ee({props:{reference:s[11]}}),Y=new ne({props:{$$slots:{default:[ci]},$$scope:{ctx:s}}}),q=new ie({props:{imageRef:s[12],$$slots:{default:[mi]},$$scope:{ctx:s}}}),{c(){e=h("Die Berechnung der Landschaftshöhe erfolgt, wie in "),E(n.$$.fragment),t=h(` dargestellt.

                `),i=L("div"),E(r.$$.fragment),l=y(),E(o.$$.fragment),d=h(`

                Durch Überlappung der beiden Noise Funktionen (`),E($.$$.fragment),u=h(","),E(A.$$.fragment),w=h(`) entsteht
                ein komplexes Modell (`),E(B.$$.fragment),M=h(`), bei dem, wie bereits erwähnt, letztendlich der Maximalwert an einer
                Koordinate genommen wird. Das Ergebnis aus diesen beiden Kombinationen ist
                vergleichbar mit dem Blick auf das Modell von oben.
                `),N=L("br"),c=L("br"),C=h(`
                Erwähnenswert ist die unterschiedliche Skalierung der Noise-Funktionen. Bei
                `),E(g.$$.fragment),F=h(', dem "Flat Noise" ('),E(x.$$.fragment),_=h(`) werden die Koordinaten durch den Faktor 4 geteilt, wodurch die
                Noisefunktion langsamer fortschreitet. Die generierte Landschaft bleibt
                verändert sich dadurch schwächer. Das Ergebnis aus `),E(G.$$.fragment),S=h(`,
                dem "Hilly Noise" (`),E(W.$$.fragment),Z=h(`), wird im Gegensatz zu
                `),E(Y.$$.fragment),Q=h(` mit einem größeren Faktor multipliziert, wodurch die generierte
                Landschaft stärker ausschlägt.

                `),E(q.$$.fragment),this.h()},l(z){e=p(z,"Die Berechnung der Landschaftshöhe erfolgt, wie in "),D(n.$$.fragment,z),t=p(z,` dargestellt.

                `),i=P(z,"DIV",{class:!0});var v=j(i);D(r.$$.fragment,v),l=K(v),D(o.$$.fragment,v),v.forEach(a),d=p(z,`

                Durch Überlappung der beiden Noise Funktionen (`),D($.$$.fragment,z),u=p(z,","),D(A.$$.fragment,z),w=p(z,`) entsteht
                ein komplexes Modell (`),D(B.$$.fragment,z),M=p(z,`), bei dem, wie bereits erwähnt, letztendlich der Maximalwert an einer
                Koordinate genommen wird. Das Ergebnis aus diesen beiden Kombinationen ist
                vergleichbar mit dem Blick auf das Modell von oben.
                `),N=P(z,"BR",{}),c=P(z,"BR",{}),C=p(z,`
                Erwähnenswert ist die unterschiedliche Skalierung der Noise-Funktionen. Bei
                `),D(g.$$.fragment,z),F=p(z,', dem "Flat Noise" ('),D(x.$$.fragment,z),_=p(z,`) werden die Koordinaten durch den Faktor 4 geteilt, wodurch die
                Noisefunktion langsamer fortschreitet. Die generierte Landschaft bleibt
                verändert sich dadurch schwächer. Das Ergebnis aus `),D(G.$$.fragment,z),S=p(z,`,
                dem "Hilly Noise" (`),D(W.$$.fragment,z),Z=p(z,`), wird im Gegensatz zu
                `),D(Y.$$.fragment,z),Q=p(z,` mit einem größeren Faktor multipliziert, wodurch die generierte
                Landschaft stärker ausschlägt.

                `),D(q.$$.fragment,z),this.h()},h(){V(i,"class","flex justify-around items-center flex-wrap mt-8")},m(z,v){f(z,e,v),I(n,z,v),f(z,t,v),f(z,i,v),I(r,i,null),O(i,l),I(o,i,null),f(z,d,v),I($,z,v),f(z,u,v),I(A,z,v),f(z,w,v),I(B,z,v),f(z,M,v),f(z,N,v),f(z,c,v),f(z,C,v),I(g,z,v),f(z,F,v),I(x,z,v),f(z,_,v),I(G,z,v),f(z,S,v),I(W,z,v),f(z,Z,v),I(Y,z,v),f(z,Q,v),I(q,z,v),J=!0},p(z,v){const H={};v&524288&&(H.$$scope={dirty:v,ctx:z}),r.$set(H);const ae={};v&524288&&(ae.$$scope={dirty:v,ctx:z}),o.$set(ae);const oe={};v&524288&&(oe.$$scope={dirty:v,ctx:z}),g.$set(oe);const X={};v&524288&&(X.$$scope={dirty:v,ctx:z}),G.$set(X);const ce={};v&524288&&(ce.$$scope={dirty:v,ctx:z}),Y.$set(ce);const fe={};v&524288&&(fe.$$scope={dirty:v,ctx:z}),q.$set(fe)},i(z){J||(b(n.$$.fragment,z),b(r.$$.fragment,z),b(o.$$.fragment,z),b($.$$.fragment,z),b(A.$$.fragment,z),b(B.$$.fragment,z),b(g.$$.fragment,z),b(x.$$.fragment,z),b(G.$$.fragment,z),b(W.$$.fragment,z),b(Y.$$.fragment,z),b(q.$$.fragment,z),J=!0)},o(z){k(n.$$.fragment,z),k(r.$$.fragment,z),k(o.$$.fragment,z),k($.$$.fragment,z),k(A.$$.fragment,z),k(B.$$.fragment,z),k(g.$$.fragment,z),k(x.$$.fragment,z),k(G.$$.fragment,z),k(W.$$.fragment,z),k(Y.$$.fragment,z),k(q.$$.fragment,z),J=!1},d(z){z&&(a(e),a(t),a(i),a(d),a(u),a(w),a(M),a(N),a(c),a(C),a(F),a(_),a(S),a(Z),a(Q)),R(n,z),R(r),R(o),R($,z),R(A,z),R(B,z),R(g,z),R(x,z),R(G,z),R(W,z),R(Y,z),R(q,z)}}}function gi(s){let e;return{c(){e=h("Setzen der obersten Blöcke & Wasser")},l(n){e=p(n,"Setzen der obersten Blöcke & Wasser")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function hi(s){let e,n,t,i,r,l;return n=new Be({}),i=new Be({}),{c(){e=h("flat_y"),E(n.$$.fragment),t=h("<"),E(i.$$.fragment),r=h("hilly_y")},l(o){e=p(o,"flat_y"),D(n.$$.fragment,o),t=p(o,"<"),D(i.$$.fragment,o),r=p(o,"hilly_y")},m(o,d){f(o,e,d),I(n,o,d),f(o,t,d),I(i,o,d),f(o,r,d),l=!0},i(o){l||(b(n.$$.fragment,o),b(i.$$.fragment,o),l=!0)},o(o){k(n.$$.fragment,o),k(i.$$.fragment,o),l=!1},d(o){o&&(a(e),a(t),a(r)),R(n,o),R(i,o)}}}function pi(s){let e;return{c(){e=h("water_noise")},l(n){e=p(n,"water_noise")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function _i(s){let e,n,t,i,r,l;return n=new Be({}),i=new Be({}),{c(){e=h("waternoise"),E(n.$$.fragment),t=h("<"),E(i.$$.fragment),r=h("0.4")},l(o){e=p(o,"waternoise"),D(n.$$.fragment,o),t=p(o,"<"),D(i.$$.fragment,o),r=p(o,"0.4")},m(o,d){f(o,e,d),I(n,o,d),f(o,t,d),I(i,o,d),f(o,r,d),l=!0},i(o){l||(b(n.$$.fragment,o),b(i.$$.fragment,o),l=!0)},o(o){k(n.$$.fragment,o),k(i.$$.fragment,o),l=!1},d(o){o&&(a(e),a(t),a(r)),R(n,o),R(i,o)}}}function wi(s){let e,n,t,i,r,l;return n=new Be({}),i=new Be({}),{c(){e=h("-1"),E(n.$$.fragment),t=h("bis"),E(i.$$.fragment),r=h("0.4")},l(o){e=p(o,"-1"),D(n.$$.fragment,o),t=p(o,"bis"),D(i.$$.fragment,o),r=p(o,"0.4")},m(o,d){f(o,e,d),I(n,o,d),f(o,t,d),I(i,o,d),f(o,r,d),l=!0},i(o){l||(b(n.$$.fragment,o),b(i.$$.fragment,o),l=!0)},o(o){k(n.$$.fragment,o),k(i.$$.fragment,o),l=!1},d(o){o&&(a(e),a(t),a(r)),R(n,o),R(i,o)}}}function vi(s){let e;return{c(){e=h("0.4")},l(n){e=p(n,"0.4")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function bi(s){let e;return{c(){e=h("0.6")},l(n){e=p(n,"0.6")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function ki(s){let e;return{c(){e=h("0.6")},l(n){e=p(n,"0.6")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ni(s){let e,n;return e=new Re({props:{width:500,openModal:s[17],fragmentShader:lt}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Si(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,F,x,_,G;return n=new ne({props:{$$slots:{default:[hi]},$$scope:{ctx:s}}}),i=new ne({props:{$$slots:{default:[pi]},$$scope:{ctx:s}}}),l=new ne({props:{$$slots:{default:[_i]},$$scope:{ctx:s}}}),d=new ne({props:{$$slots:{default:[wi]},$$scope:{ctx:s}}}),u=new ne({props:{$$slots:{default:[vi]},$$scope:{ctx:s}}}),w=new ne({props:{$$slots:{default:[bi]},$$scope:{ctx:s}}}),M=new ne({props:{$$slots:{default:[ki]},$$scope:{ctx:s}}}),c=new ee({props:{reference:s[13],showFullName:!0}}),_=new ie({props:{imageRef:s[13],$$slots:{default:[Ni]},$$scope:{ctx:s}}}),{c(){e=h(`Nachdem die Y-Koordinate der obersten Schicht bestimmt wurde, können die
                Blöcke gesetzt werden. In diesem Schritt wird entschieden, ob der gesetzte
                Block vom Typ Grass, Sand oder Wasser sein soll. Falls `),E(n.$$.fragment),t=h(` wurde die Y-Koordinate vom "Hilly Noise" beeinflusst. Auf hügeligen Landschaften
                sollen keine Seen und Strände entstehen, weshalb direkt ein Grassblock gewählt
                wird. Ansonsten wird mittels einer dritten Noise-Funktion (`),E(i.$$.fragment),r=h(`) der Blocktyp ermittelt. Da die Perlin Noise Implementation zwischen -1
                und 1 oszilliert, wird mit der Bedingung `),E(l.$$.fragment),o=h(" für einen Grassblock der Zahlenbereich von "),E(d.$$.fragment),$=h(` eingeschlossen, also ein Großteil des Zahlenraums der Noise Funktion. Somit
                werden die meißten Blöcke zu Grassblöcken. Liegt der Wert zwischen `),E(u.$$.fragment),A=h(" und "),E(w.$$.fragment),B=h(` wird ein Sandblock gewählt, bei einem Wert größer als
                `),E(M.$$.fragment),N=h(` ein Wasserblock. Durch diese Bedingungen wird um enstandenen
                Wasserblöcken immer Sandblöcke gesetzt, die Form des Sees und Strandes hängt
                von der Noise funktion ab. In `),E(c.$$.fragment),C=h(` wird mitthilfe eines Shaders die behandelte Vorgehensweise zur prozeduralen
                Landschaftsgenerierung visualisiert. Die grauen Bereiche sollen Gebirge darstellen,
                grüne Flächen sind Grasslandschaften, blau Seen und gelb Strände.
                `),g=L("br"),F=L("br"),x=y(),E(_.$$.fragment)},l(S){e=p(S,`Nachdem die Y-Koordinate der obersten Schicht bestimmt wurde, können die
                Blöcke gesetzt werden. In diesem Schritt wird entschieden, ob der gesetzte
                Block vom Typ Grass, Sand oder Wasser sein soll. Falls `),D(n.$$.fragment,S),t=p(S,` wurde die Y-Koordinate vom "Hilly Noise" beeinflusst. Auf hügeligen Landschaften
                sollen keine Seen und Strände entstehen, weshalb direkt ein Grassblock gewählt
                wird. Ansonsten wird mittels einer dritten Noise-Funktion (`),D(i.$$.fragment,S),r=p(S,`) der Blocktyp ermittelt. Da die Perlin Noise Implementation zwischen -1
                und 1 oszilliert, wird mit der Bedingung `),D(l.$$.fragment,S),o=p(S," für einen Grassblock der Zahlenbereich von "),D(d.$$.fragment,S),$=p(S,` eingeschlossen, also ein Großteil des Zahlenraums der Noise Funktion. Somit
                werden die meißten Blöcke zu Grassblöcken. Liegt der Wert zwischen `),D(u.$$.fragment,S),A=p(S," und "),D(w.$$.fragment,S),B=p(S,` wird ein Sandblock gewählt, bei einem Wert größer als
                `),D(M.$$.fragment,S),N=p(S,` ein Wasserblock. Durch diese Bedingungen wird um enstandenen
                Wasserblöcken immer Sandblöcke gesetzt, die Form des Sees und Strandes hängt
                von der Noise funktion ab. In `),D(c.$$.fragment,S),C=p(S,` wird mitthilfe eines Shaders die behandelte Vorgehensweise zur prozeduralen
                Landschaftsgenerierung visualisiert. Die grauen Bereiche sollen Gebirge darstellen,
                grüne Flächen sind Grasslandschaften, blau Seen und gelb Strände.
                `),g=P(S,"BR",{}),F=P(S,"BR",{}),x=K(S),D(_.$$.fragment,S)},m(S,W){f(S,e,W),I(n,S,W),f(S,t,W),I(i,S,W),f(S,r,W),I(l,S,W),f(S,o,W),I(d,S,W),f(S,$,W),I(u,S,W),f(S,A,W),I(w,S,W),f(S,B,W),I(M,S,W),f(S,N,W),I(c,S,W),f(S,C,W),f(S,g,W),f(S,F,W),f(S,x,W),I(_,S,W),G=!0},p(S,W){const Z={};W&524288&&(Z.$$scope={dirty:W,ctx:S}),n.$set(Z);const Y={};W&524288&&(Y.$$scope={dirty:W,ctx:S}),i.$set(Y);const Q={};W&524288&&(Q.$$scope={dirty:W,ctx:S}),l.$set(Q);const q={};W&524288&&(q.$$scope={dirty:W,ctx:S}),d.$set(q);const J={};W&524288&&(J.$$scope={dirty:W,ctx:S}),u.$set(J);const z={};W&524288&&(z.$$scope={dirty:W,ctx:S}),w.$set(z);const v={};W&524288&&(v.$$scope={dirty:W,ctx:S}),M.$set(v);const H={};W&524288&&(H.$$scope={dirty:W,ctx:S}),_.$set(H)},i(S){G||(b(n.$$.fragment,S),b(i.$$.fragment,S),b(l.$$.fragment,S),b(d.$$.fragment,S),b(u.$$.fragment,S),b(w.$$.fragment,S),b(M.$$.fragment,S),b(c.$$.fragment,S),b(_.$$.fragment,S),G=!0)},o(S){k(n.$$.fragment,S),k(i.$$.fragment,S),k(l.$$.fragment,S),k(d.$$.fragment,S),k(u.$$.fragment,S),k(w.$$.fragment,S),k(M.$$.fragment,S),k(c.$$.fragment,S),k(_.$$.fragment,S),G=!1},d(S){S&&(a(e),a(t),a(r),a(o),a($),a(A),a(B),a(N),a(C),a(g),a(F),a(x)),R(n,S),R(i,S),R(l,S),R(d,S),R(u,S),R(w,S),R(M,S),R(c,S),R(_,S)}}}function zi(s){let e;return{c(){e=h("Generierung der Höhlen")},l(n){e=p(n,"Generierung der Höhlen")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ei(s){let e;return{c(){e=h("3-5")},l(n){e=p(n,"3-5")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Di(s){let e;return{c(){e=h("11")},l(n){e=p(n,"11")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ii(s){let e,n,t,i,r,l,o,d,$;return t=new ne({props:{$$slots:{default:[Ei]},$$scope:{ctx:s}}}),r=new ne({props:{$$slots:{default:[Di]},$$scope:{ctx:s}}}),o=new ee({props:{reference:s[13],showFullName:!1}}),{c(){e=L("span"),n=h("Diese initiale Phase findet in den Zeilen "),E(t.$$.fragment),i=h(` statt, wodurch
                        die Welt zunächst als ein massiver Kubus mit einer dynamischen, hohen
                        Oberfläche erscheint. Die eigentliche Höhlengenerierung erfolgt durch
                        das 'Aushöhlen' dieses Kubus mittels 3D Perlin-Noise. Um realistischere
                        Höhlenformationen zu schaffen, variiert die Skalierung des Noises mit
                        zunehmender Tiefe. In den oberen Schichten werden kleinere Aushöhlungen
                        erzeugt, wobei die Höhlenöffnungen und -räume mit fortschreitender
                        Tiefe größer werden (Zeile `),E(r.$$.fragment),l=h(`). In
                        `),E(o.$$.fragment),d=h(" wird das Negativ dieses 3D Noises visualisiert"),this.h()},l(u){e=P(u,"SPAN",{slot:!0});var A=j(e);n=p(A,"Diese initiale Phase findet in den Zeilen "),D(t.$$.fragment,A),i=p(A,` statt, wodurch
                        die Welt zunächst als ein massiver Kubus mit einer dynamischen, hohen
                        Oberfläche erscheint. Die eigentliche Höhlengenerierung erfolgt durch
                        das 'Aushöhlen' dieses Kubus mittels 3D Perlin-Noise. Um realistischere
                        Höhlenformationen zu schaffen, variiert die Skalierung des Noises mit
                        zunehmender Tiefe. In den oberen Schichten werden kleinere Aushöhlungen
                        erzeugt, wobei die Höhlenöffnungen und -räume mit fortschreitender
                        Tiefe größer werden (Zeile `),D(r.$$.fragment,A),l=p(A,`). In
                        `),D(o.$$.fragment,A),d=p(A," wird das Negativ dieses 3D Noises visualisiert"),A.forEach(a),this.h()},h(){V(e,"slot","left")},m(u,A){f(u,e,A),O(e,n),I(t,e,null),O(e,i),I(r,e,null),O(e,l),I(o,e,null),O(e,d),$=!0},p(u,A){const w={};A&524288&&(w.$$scope={dirty:A,ctx:u}),t.$set(w);const B={};A&524288&&(B.$$scope={dirty:A,ctx:u}),r.$set(B)},i(u){$||(b(t.$$.fragment,u),b(r.$$.fragment,u),b(o.$$.fragment,u),$=!0)},o(u){k(t.$$.fragment,u),k(r.$$.fragment,u),k(o.$$.fragment,u),$=!1},d(u){u&&a(e),R(t),R(r),R(o)}}}function Ri(s){let e,n;return e=new We({props:{directory:"caves",width:200}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Ai(s){let e,n;return e=new ie({props:{imageRef:s[14],slot:"right",$$slots:{default:[Ri]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&524288&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Mi(s){let e,n,t,i;return n=new Ke({props:{$$slots:{right:[Ai],left:[Ii]},$$scope:{ctx:s}}}),{c(){e=h(`Um dreidimensionale Höhlen in der virtuellen Welt zu erzeugen, wird
                zunächst mit der Erstellung eines soliden Würfels, der die Y-Achse der
                Welt vollständig mit Blöcken ausfüllt gestartet.

                `),E(n.$$.fragment),t=h(`

                Der Prozess der Weltbefüllung mit Blöcken (z.B. Erde und Stein) und der
                Höhlengenerierung wird durch den folgenden Code dargestellt:`)},l(r){e=p(r,`Um dreidimensionale Höhlen in der virtuellen Welt zu erzeugen, wird
                zunächst mit der Erstellung eines soliden Würfels, der die Y-Achse der
                Welt vollständig mit Blöcken ausfüllt gestartet.

                `),D(n.$$.fragment,r),t=p(r,`

                Der Prozess der Weltbefüllung mit Blöcken (z.B. Erde und Stein) und der
                Höhlengenerierung wird durch den folgenden Code dargestellt:`)},m(r,l){f(r,e,l),I(n,r,l),f(r,t,l),i=!0},p(r,l){const o={};l&524288&&(o.$$scope={dirty:l,ctx:r}),n.$set(o)},i(r){i||(b(n.$$.fragment,r),i=!0)},o(r){k(n.$$.fragment,r),i=!1},d(r){r&&(a(e),a(t)),R(n,r)}}}function Bi(s){let e,n,t,i;return n=new ee({props:{reference:s[15],showFullName:!1}}),{c(){e=h(`Die fertige virtuelle Welt sieht nach Durchführung der oberen 5 Schritte sieht
            wie in `),E(n.$$.fragment),t=h(`
            aus. Dank der unendlichkeit von Perlin Noise kann der Radius, in dem die Welt generiert
            wird, problemlos vergrößert werden. Die 100x100 große Welt ist somit lediglich
            ein Ausschnitt aus theoretisch unendlichen virtuellen Welt.`)},l(r){e=p(r,`Die fertige virtuelle Welt sieht nach Durchführung der oberen 5 Schritte sieht
            wie in `),D(n.$$.fragment,r),t=p(r,`
            aus. Dank der unendlichkeit von Perlin Noise kann der Radius, in dem die Welt generiert
            wird, problemlos vergrößert werden. Die 100x100 große Welt ist somit lediglich
            ein Ausschnitt aus theoretisch unendlichen virtuellen Welt.`)},m(r,l){f(r,e,l),I(n,r,l),f(r,t,l),i=!0},p:U,i(r){i||(b(n.$$.fragment,r),i=!0)},o(r){k(n.$$.fragment,r),i=!1},d(r){r&&(a(e),a(t)),R(n,r)}}}function Fi(s){let e,n;return e=new We({props:{directory:"alltogether",width:400}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p:U,i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Li(s){let e,n;return e=new ie({props:{imageRef:s[15],slot:"right",$$slots:{default:[Fi]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment)},l(t){D(e.$$.fragment,t)},m(t,i){I(e,t,i),n=!0},p(t,i){const r={};i&524288&&(r.$$scope={dirty:i,ctx:t}),e.$set(r)},i(t){n||(b(e.$$.fragment,t),n=!0)},o(t){k(e.$$.fragment,t),n=!1},d(t){R(e,t)}}}function Pi(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,F,x,_,G,S,W,Z,Y,Q,q,J,z;return r=new de({props:{href:"https://minecraft.fandom.com/de/wiki/Modifikation/Mods_erstellen",$$slots:{default:[Yt]},$$scope:{ctx:s}}}),$=new de({props:{href:"https://www.spigotmc.org/wiki/spigot-plugin-development/",$$slots:{default:[Qt]},$$scope:{ctx:s}}}),c=new ne({props:{$$slots:{default:[Jt]},$$scope:{ctx:s}}}),F=new Pe({props:{code:gt,$$slots:{body:[qt],title:[Xt]},$$scope:{ctx:s}}}),_=new Pe({props:{code:ht,$$slots:{body:[li],title:[ei]},$$scope:{ctx:s}}}),S=new Pe({props:{code:pt,$$slots:{body:[$i],title:[ai]},$$scope:{ctx:s}}}),Z=new Pe({props:{code:_t,$$slots:{body:[Si],title:[gi]},$$scope:{ctx:s}}}),Q=new Pe({props:{code:wt,$$slots:{body:[Mi],title:[zi]},$$scope:{ctx:s}}}),J=new Ke({props:{$$slots:{right:[Li],left:[Bi]},$$scope:{ctx:s}}}),{c(){e=h(`In der vorherigen Sektion wurde die prozedurale Landschaftsgenerierung erklärt und
    anhand von Webbeispielen (mittels Shadern) gezeigt. Jetzt sollen die theoretischen
    Grundlagen in Minecraft implementiert werden. Die Generierung soll innerhalb einer
    leeren Minecraft Welt geschehen. Dabei gibt es grundsätzlich zwei Hauptansätze, um in
    Minecraft (Java Edition) eigenen Code einschleusen zu können
    `),n=L("ul"),t=L("li"),i=h("Erstellung von "),E(r.$$.fragment),l=y(),o=L("li"),d=h("Erstellung von "),E($.$$.fragment),u=h(`
    Da die Entwicklung von Serverplugins deutlich einfacher für den gegebene Anwendungsfall
    ist, wird dieser Ansatz gewählt. Das Plugin wird in der Programmiersprache "Java" geschrieben
    und von dem Minecraft-Server "Spigot" verwendet.`),A=L("br"),w=h(`
    In diesem Artikel wird die Programmierung eines Minecraft Plugins nicht weiter behandelt,
    der Source Code ist [hier] zu finden.
    `),B=L("br"),M=L("br"),N=h(`
    Das Minecraft Plugin ruft die Funktion `),E(c.$$.fragment),C=h(` auf, woraufhin die 100x100
    Block große Welt generiert wird. Der Algorithmus geht dabei wie folgt vor:

    `),g=L("ol"),E(F.$$.fragment),x=y(),E(_.$$.fragment),G=y(),E(S.$$.fragment),W=y(),E(Z.$$.fragment),Y=y(),E(Q.$$.fragment),q=y(),E(J.$$.fragment),this.h()},l(v){e=p(v,`In der vorherigen Sektion wurde die prozedurale Landschaftsgenerierung erklärt und
    anhand von Webbeispielen (mittels Shadern) gezeigt. Jetzt sollen die theoretischen
    Grundlagen in Minecraft implementiert werden. Die Generierung soll innerhalb einer
    leeren Minecraft Welt geschehen. Dabei gibt es grundsätzlich zwei Hauptansätze, um in
    Minecraft (Java Edition) eigenen Code einschleusen zu können
    `),n=P(v,"UL",{});var H=j(n);t=P(H,"LI",{});var ae=j(t);i=p(ae,"Erstellung von "),D(r.$$.fragment,ae),ae.forEach(a),l=K(H),o=P(H,"LI",{});var oe=j(o);d=p(oe,"Erstellung von "),D($.$$.fragment,oe),oe.forEach(a),H.forEach(a),u=p(v,`
    Da die Entwicklung von Serverplugins deutlich einfacher für den gegebene Anwendungsfall
    ist, wird dieser Ansatz gewählt. Das Plugin wird in der Programmiersprache "Java" geschrieben
    und von dem Minecraft-Server "Spigot" verwendet.`),A=P(v,"BR",{}),w=p(v,`
    In diesem Artikel wird die Programmierung eines Minecraft Plugins nicht weiter behandelt,
    der Source Code ist [hier] zu finden.
    `),B=P(v,"BR",{}),M=P(v,"BR",{}),N=p(v,`
    Das Minecraft Plugin ruft die Funktion `),D(c.$$.fragment,v),C=p(v,` auf, woraufhin die 100x100
    Block große Welt generiert wird. Der Algorithmus geht dabei wie folgt vor:

    `),g=P(v,"OL",{class:!0});var X=j(g);D(F.$$.fragment,X),x=K(X),D(_.$$.fragment,X),G=K(X),D(S.$$.fragment,X),W=K(X),D(Z.$$.fragment,X),Y=K(X),D(Q.$$.fragment,X),X.forEach(a),q=K(v),D(J.$$.fragment,v),this.h()},h(){V(g,"class","my-10")},m(v,H){f(v,e,H),f(v,n,H),O(n,t),O(t,i),I(r,t,null),O(n,l),O(n,o),O(o,d),I($,o,null),f(v,u,H),f(v,A,H),f(v,w,H),f(v,B,H),f(v,M,H),f(v,N,H),I(c,v,H),f(v,C,H),f(v,g,H),I(F,g,null),O(g,x),I(_,g,null),O(g,G),I(S,g,null),O(g,W),I(Z,g,null),O(g,Y),I(Q,g,null),f(v,q,H),I(J,v,H),z=!0},p(v,H){const ae={};H&524288&&(ae.$$scope={dirty:H,ctx:v}),r.$set(ae);const oe={};H&524288&&(oe.$$scope={dirty:H,ctx:v}),$.$set(oe);const X={};H&524288&&(X.$$scope={dirty:H,ctx:v}),c.$set(X);const ce={};H&524288&&(ce.$$scope={dirty:H,ctx:v}),F.$set(ce);const fe={};H&524288&&(fe.$$scope={dirty:H,ctx:v}),_.$set(fe);const ke={};H&524288&&(ke.$$scope={dirty:H,ctx:v}),S.$set(ke);const Ne={};H&524288&&(Ne.$$scope={dirty:H,ctx:v}),Z.$set(Ne);const Se={};H&524288&&(Se.$$scope={dirty:H,ctx:v}),Q.$set(Se);const me={};H&524288&&(me.$$scope={dirty:H,ctx:v}),J.$set(me)},i(v){z||(b(r.$$.fragment,v),b($.$$.fragment,v),b(c.$$.fragment,v),b(F.$$.fragment,v),b(_.$$.fragment,v),b(S.$$.fragment,v),b(Z.$$.fragment,v),b(Q.$$.fragment,v),b(J.$$.fragment,v),z=!0)},o(v){k(r.$$.fragment,v),k($.$$.fragment,v),k(c.$$.fragment,v),k(F.$$.fragment,v),k(_.$$.fragment,v),k(S.$$.fragment,v),k(Z.$$.fragment,v),k(Q.$$.fragment,v),k(J.$$.fragment,v),z=!1},d(v){v&&(a(e),a(n),a(u),a(A),a(w),a(B),a(M),a(N),a(C),a(g),a(q)),R(r),R($),R(c,v),R(F),R(_),R(S),R(Z),R(Q),R(J,v)}}}function Gi(s){let e;return{c(){e=h("J-mc-2-obj")},l(n){e=p(n,"J-mc-2-obj")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ci(s){let e;return{c(){e=h(".obj")},l(n){e=p(n,".obj")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Wi(s){let e;return{c(){e=h("Utimaker Cura")},l(n){e=p(n,"Utimaker Cura")},m(n,t){f(n,e,t)},d(n){n&&a(e)}}}function Ti(s){let e,n;return{c(){e=L("img"),this.h()},l(t){e=P(t,"IMG",{src:!0}),this.h()},h(){be(e.src,n="FotoVonSlicerVorbereiten.png")||V(e,"src",n)},m(t,i){f(t,e,i)},p:U,d(t){t&&a(e)}}}function Oi(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,F='<img src="realimg/isometric.jpg"/> <div class="flex imgshorizontal svelte-k3oykx"><img src="realimg/close.jpg"/> <img src="realimg/top.jpg"/> <img src="realimg/cave.jpg"/></div>',x;return n=new de({props:{href:"https://github.com/jmc2obj/j-mc-2-obj",$$slots:{default:[Gi]},$$scope:{ctx:s}}}),i=new ne({props:{$$slots:{default:[Ci]},$$scope:{ctx:s}}}),d=new de({props:{href:"https://ultimaker.com/software/ultimaker-cura/",$$slots:{default:[Wi]},$$scope:{ctx:s}}}),B=new ie({props:{imageRef:s[16],$$slots:{default:[Ti]},$$scope:{ctx:s}}}),{c(){e=h(`Um einen Bereich aus einer Minecraft-Welt 3D-Drucken zu können, muss dieser zuerts in
    einen von einem Slicer verständlichen Format konvertiert werden. Mit dem Open-Source
    Tool `),E(n.$$.fragment),t=h(`
    kann dies sehr leicht realisiert werden. Das Programm nimmt als Eingabe eine Minecraft
    Welt sowie den zu exportierenden Bereich, und gibt darauf eine Datei vom Typen `),E(i.$$.fragment),r=h(` aus.
    `),l=L("br"),o=h(`
    Diese Datei kann dann von einen beliebigen Slicer importiert werden. In meinem Fall verwende
    ich den kostenlosen `),E(d.$$.fragment),$=h(" Slicer. "),u=L("br"),A=L("br"),w=y(),E(B.$$.fragment),M=y(),N=L("br"),c=L("br"),C=h(`
    Nach 7 Stündigem Drucken kann man die kleine selbstprogrammierte Minecraft
    Welt in den Händen halten.

    `),g=L("div"),g.innerHTML=F},l(_){e=p(_,`Um einen Bereich aus einer Minecraft-Welt 3D-Drucken zu können, muss dieser zuerts in
    einen von einem Slicer verständlichen Format konvertiert werden. Mit dem Open-Source
    Tool `),D(n.$$.fragment,_),t=p(_,`
    kann dies sehr leicht realisiert werden. Das Programm nimmt als Eingabe eine Minecraft
    Welt sowie den zu exportierenden Bereich, und gibt darauf eine Datei vom Typen `),D(i.$$.fragment,_),r=p(_,` aus.
    `),l=P(_,"BR",{}),o=p(_,`
    Diese Datei kann dann von einen beliebigen Slicer importiert werden. In meinem Fall verwende
    ich den kostenlosen `),D(d.$$.fragment,_),$=p(_," Slicer. "),u=P(_,"BR",{}),A=P(_,"BR",{}),w=K(_),D(B.$$.fragment,_),M=K(_),N=P(_,"BR",{}),c=P(_,"BR",{}),C=p(_,`
    Nach 7 Stündigem Drucken kann man die kleine selbstprogrammierte Minecraft
    Welt in den Händen halten.

    `),g=P(_,"DIV",{"data-svelte-h":!0}),Me(g)!=="svelte-wobarw"&&(g.innerHTML=F)},m(_,G){f(_,e,G),I(n,_,G),f(_,t,G),I(i,_,G),f(_,r,G),f(_,l,G),f(_,o,G),I(d,_,G),f(_,$,G),f(_,u,G),f(_,A,G),f(_,w,G),I(B,_,G),f(_,M,G),f(_,N,G),f(_,c,G),f(_,C,G),f(_,g,G),x=!0},p(_,G){const S={};G&524288&&(S.$$scope={dirty:G,ctx:_}),n.$set(S);const W={};G&524288&&(W.$$scope={dirty:G,ctx:_}),i.$set(W);const Z={};G&524288&&(Z.$$scope={dirty:G,ctx:_}),d.$set(Z);const Y={};G&524288&&(Y.$$scope={dirty:G,ctx:_}),B.$set(Y)},i(_){x||(b(n.$$.fragment,_),b(i.$$.fragment,_),b(d.$$.fragment,_),b(B.$$.fragment,_),x=!0)},o(_){k(n.$$.fragment,_),k(i.$$.fragment,_),k(d.$$.fragment,_),k(B.$$.fragment,_),x=!1},d(_){_&&(a(e),a(t),a(r),a(l),a(o),a($),a(u),a(A),a(w),a(M),a(N),a(c),a(C),a(g)),R(n,_),R(i,_),R(d,_),R(B,_)}}}function Vi(s){let e,n,t,i,r,l,o,d,$,u,A,w,B,M,N;function c(g){s[18](g)}let C={$$slots:{default:[St]},$$scope:{ctx:s}};return s[0].show!==void 0&&(C.showModal=s[0].show),e=new ct({props:C}),Ce.push(()=>zn(e,"showModal",c)),i=new Ae({props:{title:"Motivation",$$slots:{default:[zt]},$$scope:{ctx:s}}}),l=new Ae({props:{title:"Der Plan",$$slots:{default:[At]},$$scope:{ctx:s}}}),d=new Ae({props:{title:"Hinweis",$$slots:{default:[Mt]},$$scope:{ctx:s}}}),u=new Ae({props:{title:"Prozedurale Landschaftsgenerierung",$$slots:{default:[Zt]},$$scope:{ctx:s}}}),w=new Ae({props:{title:"Programmierung",$$slots:{default:[Pi]},$$scope:{ctx:s}}}),M=new Ae({props:{title:"3D Druck",$$slots:{default:[Oi]},$$scope:{ctx:s}}}),{c(){E(e.$$.fragment),t=y(),E(i.$$.fragment),r=y(),E(l.$$.fragment),o=y(),E(d.$$.fragment),$=y(),E(u.$$.fragment),A=y(),E(w.$$.fragment),B=y(),E(M.$$.fragment)},l(g){D(e.$$.fragment,g),t=K(g),D(i.$$.fragment,g),r=K(g),D(l.$$.fragment,g),o=K(g),D(d.$$.fragment,g),$=K(g),D(u.$$.fragment,g),A=K(g),D(w.$$.fragment,g),B=K(g),D(M.$$.fragment,g)},m(g,F){I(e,g,F),f(g,t,F),I(i,g,F),f(g,r,F),I(l,g,F),f(g,o,F),I(d,g,F),f(g,$,F),I(u,g,F),f(g,A,F),I(w,g,F),f(g,B,F),I(M,g,F),N=!0},p(g,[F]){const x={};F&524289&&(x.$$scope={dirty:F,ctx:g}),!n&&F&1&&(n=!0,x.showModal=g[0].show,vn(()=>n=!1)),e.$set(x);const _={};F&524288&&(_.$$scope={dirty:F,ctx:g}),i.$set(_);const G={};F&524288&&(G.$$scope={dirty:F,ctx:g}),l.$set(G);const S={};F&524288&&(S.$$scope={dirty:F,ctx:g}),d.$set(S);const W={};F&524288&&(W.$$scope={dirty:F,ctx:g}),u.$set(W);const Z={};F&524288&&(Z.$$scope={dirty:F,ctx:g}),w.$set(Z);const Y={};F&524288&&(Y.$$scope={dirty:F,ctx:g}),M.$set(Y)},i(g){N||(b(e.$$.fragment,g),b(i.$$.fragment,g),b(l.$$.fragment,g),b(d.$$.fragment,g),b(u.$$.fragment,g),b(w.$$.fragment,g),b(M.$$.fragment,g),N=!0)},o(g){k(e.$$.fragment,g),k(i.$$.fragment,g),k(l.$$.fragment,g),k(d.$$.fragment,g),k(u.$$.fragment,g),k(w.$$.fragment,g),k(M.$$.fragment,g),N=!1},d(g){g&&(a(t),a(r),a(o),a($),a(A),a(B)),R(e,g),R(i,g),R(l,g),R(d,g),R(u,g),R(w,g),R(M,g)}}}function Hi(s,e,n){let t=te.getResourceRef("Endergebnis"),i=te.getResourceRef("Erklärung Perlin Noise"),r=te.getResourceRef("Value Noise"),l=te.getResourceRef("Perlin Noise"),o=te.getResourceRef("Simplex Noise"),d=te.getResourceRef("Kreis mit Oszillierend radius, ungeglättet mit Perlin noise mehreren"),$=te.getResourceRef("2D Perin Noise auf 3D Ebene"),u=te.getResourceRef("Summe mehrerer Perlin Noise (Fractal Noise)"),A=te.getResourceRef("Maximalwerte mehrerer Perlin Noise"),w=te.getResourceRef("Minecraft Flat Noise"),B=te.getResourceRef("Minecraft Hilly Noise"),M=te.getResourceRef("Minecraft Hilly and Flat Noise"),N=te.getResourceRef("Simulation Landschaftsgenerierung"),c=te.getResourceRef("Minecraft Höhlen"),C=te.getResourceRef("Das Endergebnis"),g=te.getResourceRef("Cura Slicer Vorschau"),F={show:!1,htmlcode:""};function x(G){const S=Prism.highlight(G,Prism.languages.glsl,"glsl");n(0,F.show=!0,F),n(0,F.htmlcode=S,F),n(0,F)}ye(()=>{Prism.highlightAll()});function _(G){s.$$.not_equal(F.show,G)&&(F.show=G,n(0,F))}return[F,t,i,r,l,o,d,$,u,A,w,B,M,N,c,C,g,x,_]}class xi extends se{constructor(e){super(),le(this,e,Hi,Vi,re,{})}}function ji(s){let e,n,t,i,r,l,o="Los";return{c(){e=L("a"),n=L("div"),t=L("div"),i=L("canvas"),r=y(),l=L("span"),l.textContent=o,this.h()},l(d){e=P(d,"A",{class:!0,href:!0});var $=j(e);n=P($,"DIV",{class:!0});var u=j(n);t=P(u,"DIV",{class:!0});var A=j(t);i=P(A,"CANVAS",{width:!0,height:!0}),j(i).forEach(a),A.forEach(a),r=K(u),l=P(u,"SPAN",{class:!0,"data-svelte-h":!0}),Me(l)!=="svelte-545z90"&&(l.textContent=o),u.forEach(a),$.forEach(a),this.h()},h(){V(i,"width","220px"),V(i,"height","120px"),V(t,"class","blur-sm opacity-90"),V(l,"class","absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"),V(n,"class","relative "),V(e,"class","hover:scale-110 transition-all "),V(e,"href","#Motivation")},m(d,$){f(d,e,$),O(e,n),O(n,t),O(t,i),s[1](i),O(n,r),O(n,l)},p:U,i:U,o:U,d(d){d&&a(e),s[1](null)}}}function yi(s,e,n){let t;ye(()=>{const r=`
      precision mediump float;
      uniform float time;
      varying vec2 coordinates;

      ${Le}

      float circle(in vec2 _st, in float _radius){
          vec2 dist = _st-vec2(0.5);
	        return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
      }

      void main(void) {
          float time2 = time / 7.0;
          // Use the noise function
          vec2 animated = (coordinates + vec2(time2, time2));
          float noised = noise(animated) * 30.0;
          //+ time * noise(coordinates) * 5.0
          
          float radius = (1.0 + sin(noised)) / 10.0 + 0.5; 
          vec4 color = vec4(circle(coordinates,radius));

          gl_FragColor = color;
      }`;gn(t,r)});function i(r){Ce[r?"unshift":"push"](()=>{t=r,n(0,t)})}return[t,i]}class Ki extends se{constructor(e){super(),le(this,e,yi,ji,re,{})}}function Ui(s){let e,n,t,i,r='<span class="max-w-md bg-slate-100 bg-opacity-50 backdrop-blur-sm p-3 shadow-md rounded-lg" id="title"><b class="text-3xl">Noise: </b><br/> <span class="text-2xl">Anwendung zur prozeduralen Landschaftsgenerierung - Theorie und Praxis</span><br/> <i class="text-xs">(anhand von Minecraft)</i></span>',l,o,d='<img src="imgs/floatingisland.png" class="max-w-full" alt="Descriptive Alt Text"/>',$,u,A,w,B,M='<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" class="svelte-1aj3rnw"><path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" class="shape-fill svelte-1aj3rnw"></path><path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" class="shape-fill svelte-1aj3rnw"></path><path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" class="shape-fill svelte-1aj3rnw"></path></svg>',N,c,C,g,F,x;return e=new Bn({}),A=new Ki({}),F=new xi({}),{c(){E(e.$$.fragment),n=y(),t=L("div"),i=L("div"),i.innerHTML=r,l=y(),o=L("div"),o.innerHTML=d,$=y(),u=L("div"),E(A.$$.fragment),w=y(),B=L("div"),B.innerHTML=M,N=y(),c=L("div"),C=y(),g=L("div"),E(F.$$.fragment),this.h()},l(_){D(e.$$.fragment,_),n=K(_),t=P(_,"DIV",{class:!0});var G=j(t);i=P(G,"DIV",{class:!0,"data-svelte-h":!0}),Me(i)!=="svelte-1lv9kjn"&&(i.innerHTML=r),l=K(G),o=P(G,"DIV",{class:!0,"data-svelte-h":!0}),Me(o)!=="svelte-1pmzx7g"&&(o.innerHTML=d),$=K(G),u=P(G,"DIV",{class:!0});var S=j(u);D(A.$$.fragment,S),S.forEach(a),w=K(G),B=P(G,"DIV",{class:!0,"data-svelte-h":!0}),Me(B)!=="svelte-e8n4uk"&&(B.innerHTML=M),G.forEach(a),N=K(_),c=P(_,"DIV",{class:!0}),j(c).forEach(a),C=K(_),g=P(_,"DIV",{class:!0});var W=j(g);D(F.$$.fragment,W),W.forEach(a),this.h()},h(){V(i,"class","absolute m-10 flex flex-col"),V(o,"class","top-0 items-center justify-center"),V(u,"class","absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"),V(B,"class","custom-shape-divider-bottom-1700658666 svelte-1aj3rnw"),V(t,"class","absolute top-0"),V(c,"class","h-screen"),V(g,"class","p-10")},m(_,G){I(e,_,G),f(_,n,G),f(_,t,G),O(t,i),O(t,l),O(t,o),O(t,$),O(t,u),I(A,u,null),O(t,w),O(t,B),f(_,N,G),f(_,c,G),f(_,C,G),f(_,g,G),I(F,g,null),x=!0},p:U,i(_){x||(b(e.$$.fragment,_),b(A.$$.fragment,_),b(F.$$.fragment,_),x=!0)},o(_){k(e.$$.fragment,_),k(A.$$.fragment,_),k(F.$$.fragment,_),x=!1},d(_){_&&(a(n),a(t),a(N),a(c),a(C),a(g)),R(e,_),R(A),R(F)}}}function Zi(s,e,n){return[!0,!0]}class Xi extends se{constructor(e){super(),le(this,e,Zi,Ui,re,{prerender:0,ssr:1})}get prerender(){return this.$$.ctx[0]}get ssr(){return this.$$.ctx[1]}}export{Xi as component};
