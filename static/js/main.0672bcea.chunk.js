(this["webpackJsonpremote-work-equipment-stand"]=this["webpackJsonpremote-work-equipment-stand"]||[]).push([[0],{26:function(e,n,t){"use strict";t.d(n,"c",(function(){return l})),t.d(n,"a",(function(){return i}));var a=t(18),r={},c=Object(a.b)({name:"auth",initialState:r,reducers:{getProfile:function(e,n){return n.payload},clearProfile:function(){return r}}}),o=c.actions,l=o.getProfile,i=o.clearProfile;n.b=c.reducer},31:function(e,n,t){"use strict";t.d(n,"b",(function(){return c}));var a=t(18),r=Object(a.b)({name:"led",initialState:{pin1:!1,pin2:!1,pin3:!1},reducers:{setLed:function(e,n){return n.payload}}}),c=r.actions.setLed;n.a=r.reducer},39:function(e){e.exports=JSON.parse('{"GOOGLE_AUTH":"930914015370-b31p63biqg1j0pbfr96qei9ujp1ttded.apps.googleusercontent.com"}')},64:function(e,n,t){e.exports=t(80)},74:function(e,n,t){},76:function(e,n,t){},78:function(e,n,t){},79:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(38),o=t(26),l=t(13),i=t(100),s=t(101),u=t(109),d=t(102),f=t(110),m=t(111),p=t(103),b=t(39),g=t(98),v=Object(g.a)((function(){return{root:{flexGrow:1}}})),E=function(){var e=Object(l.c)(),n=Object(l.d)((function(e){return e.auth}),l.b),t=n.imageUrl,a=n.email,g=n.name,E=v(),O=!!g;return r.a.createElement(i.a,null,r.a.createElement("div",{className:E.root},r.a.createElement(s.a,null,r.a.createElement(u.a,null,g&&r.a.createElement(d.a,null,r.a.createElement(f.a,null,r.a.createElement(f.a,{alt:g,src:t}))),r.a.createElement(m.a,{primary:g,secondary:a}),r.a.createElement(p.a,null,O?r.a.createElement(c.GoogleLogout,{clientId:b.GOOGLE_AUTH,buttonText:"\u0412\u044b\u0439\u0442\u0438",onLogoutSuccess:function(){e(Object(o.a)())}}):r.a.createElement(c.GoogleLogin,{clientId:b.GOOGLE_AUTH,buttonText:"\u0412\u043e\u0439\u0442\u0438",onSuccess:function(n){e(Object(o.c)(n.profileObj))},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin",isSignedIn:!0}))))))},O=t(30),j=t.n(O),h=t(40),y=t(17),k=t(53),S=t(54),L=function(){function e(n){Object(k.a)(this,e),this.signaling=n}return Object(S.a)(e,[{key:"send",value:function(e){this.signaling.send(JSON.stringify({data:e}))}},{key:"onmessage",set:function(e){this.signaling.onmessage=function(n){var t=n.data;e(JSON.parse(t))}}}]),e}(),w=t(55),x=(t(76),t(104)),P=t(105),_=t(107),C=t(56),F=t.n(C),D=t(57),N=t.n(D),R=t(108),G={iceServers:[{url:"stun:stun.l.google.com:19302"},{url:"stun:stun1.l.google.com:19302"},{url:"stun:stun2.l.google.com:19302"},{url:"stun:stun3.l.google.com:19302"},{urls:"turn:numb.viagenie.ca",credential:"9u7prU:2}R{Sut~.)d[bP7,;Pgc'Pa",username:"fkrveacbukypqsqyaq@miucce.com"}]},T=Object(g.a)((function(e){return{root:{flexGrow:1,maxWidth:"20rem","& > *":{margin:e.spacing(1)}}}})),q=function(){var e=T(),n=Object(a.useRef)(null),t=Object(a.useRef)(null),c=Object(a.useRef)(null),o=Object(a.useState)(0),l=Object(y.a)(o,2),i=l[0],b=l[1],g=Object(a.useState)(0),v=Object(y.a)(g,2),E=v[0],O=v[1],k=Object(a.useState)(null),S=Object(y.a)(k,2),C=S[0],D=S[1],q=Object(a.useState)(!1),I=Object(y.a)(q,2),W=I[0],J=I[1],U=function(){return D(null)},z=function(){return J(!1)};Object(a.useEffect)((function(){var e,t,a=(e="room",t=1,new URLSearchParams(Object(w.a)({},e,t)).toString()),r=new WebSocket("wss://wss-signaling.herokuapp.com/".concat(a&&"?".concat(a))),o=new L(r),l=new RTCPeerConnection(G);c.current=l,l.ontrack=function(e){var t=e.track,a=Object(y.a)(e.streams,1)[0];t.onunmute=function(){n.current.srcObject||(n.current.srcObject=a)}};var i=!1,s=!1,u=!1;l.onicecandidate=function(e){var n=e.candidate;o.send({candidate:n})},l.onnegotiationneeded=Object(h.a)(j.a.mark((function e(){return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,i=!0,e.next=4,l.setLocalDescription();case 4:o.send({description:l.localDescription}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:return e.prev=10,i=!1,e.finish(10);case 13:case"end":return e.stop()}}),e,null,[[0,7,10,13]])}))),l.oniceconnectionstatechange=function(){"failed"===l.iceConnectionState&&l.restartIce()},o.onmessage=function(){var e=Object(h.a)(j.a.mark((function e(n){var t,a,r,c,d;return j.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t=n.data,a=n.data,r=a.description,c=a.candidate,console.log(t),e.prev=2,!r){e.next=19;break}if(d=!i&&("stable"===l.signalingState||u),"offer"===r.type&&!d,!(s=!1)){e.next=9;break}return e.abrupt("return");case 9:return u="answer"===r.type,e.next=12,l.setRemoteDescription(r);case 12:if(u=!1,"offer"!==r.type){e.next=17;break}return e.next=16,l.setLocalDescription();case 16:o.send({description:l.localDescription});case 17:e.next=29;break;case 19:if(!c){e.next=29;break}return e.prev=20,e.next=23,l.addIceCandidate(c);case 23:e.next=29;break;case 25:if(e.prev=25,e.t0=e.catch(20),s){e.next=29;break}throw e.t0;case 29:e.next=34;break;case 31:e.prev=31,e.t1=e.catch(2),console.error(e.t1);case 34:case"end":return e.stop()}}),e,null,[[2,31],[20,25]])})));return function(n){return e.apply(this,arguments)}}();var d=function(e){var n=e.target.readyState;console.log("Send channel state is: %s",n)};l.addEventListener("datachannel",(function(e){var n=e.channel;n.addEventListener("message",(function(e){console.log("Received Message: %s",e.data)})),n.addEventListener("open",d),n.addEventListener("close",d)}))}),[]),Object(a.useEffect)((function(){var e=window;function n(e){e.stopPropagation(),e.preventDefault()}function t(e){e.stopPropagation(),e.preventDefault()}function a(e){e.stopPropagation(),e.preventDefault();var n=Object(y.a)(e.dataTransfer.files,1)[0];D(n)}return e.addEventListener("dragenter",n,!1),e.addEventListener("dragover",t,!1),e.addEventListener("drop",a,!1),function(){e.removeEventListener("dragenter",n,!1),e.removeEventListener("dragover",t,!1),e.removeEventListener("drop",a,!1)}}),[]);return r.a.createElement("div",{className:e.root},r.a.createElement("section",null,r.a.createElement("h4",null,"\u041e\u0442\u043f\u0440\u0430\u0432\u043a\u0430 \u0444\u0430\u0439\u043b\u0430 \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0438"),r.a.createElement("input",{type:"file",id:"files",ref:t,style:{display:"none"},onChange:function(e){var n=Object(y.a)(e.target.files,1)[0];D(n)}}),C&&r.a.createElement(s.a,null,r.a.createElement(u.a,null,r.a.createElement(d.a,null,r.a.createElement(f.a,null,r.a.createElement(F.a,null))),r.a.createElement(m.a,{primary:C.name,secondary:C.lastModifiedDate.toLocaleString(),title:"".concat(C.size," \u0431\u0430\u0439\u0442")}),r.a.createElement(p.a,null,r.a.createElement(x.a,{edge:"end","aria-label":"delete",onClick:U},r.a.createElement(N.a,null))))),r.a.createElement("br",null),r.a.createElement(P.a,{component:"label",htmlFor:"files",variant:"contained",size:"small",id:"files"},"\u0412\u044b\u0431\u0440\u0430\u0442\u044c"),C&&r.a.createElement(r.a.Fragment,null,r.a.createElement(P.a,{component:"button",color:"primary",onClick:function(){var e=c.current.createDataChannel(C.name,null);e.binaryType="arraybuffer",b(C.size);var n=Math.pow(2,14),t=new FileReader,a=0;t.addEventListener("error",(function(e){console.error("Error reading selectedFile: ",e)})),t.addEventListener("abort",(function(e){console.log("File reading aborted: ",e)}));var r=function(e){console.log("readSlice",e);var r=C.slice(a,e+n);t.readAsArrayBuffer(r)};t.addEventListener("load",(function(n){console.log("FileReader.onload",n),e.send(n.target.result),a<C.size?r(a):(e.send("EOF"),e.close(),D(null),b(0),O(0),U(),J(!0))})),t.addEventListener("progress",(function(e){a+=e.loaded,O(a)})),e.onopen=function(){r(0)}},variant:"contained",type:"submit",size:"small"},"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c")),r.a.createElement(_.a,{open:W,autoHideDuration:6e3,onClose:z,onClick:z},r.a.createElement(R.a,{severity:"success"},"\u0424\u0430\u0439\u043b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d")),E>0&&C&&r.a.createElement("progress",{max:i,value:E})),r.a.createElement("h4",null,"\u0412\u0438\u0434\u0435\u043e \u0441\u0442\u0435\u043d\u0434\u0430"),r.a.createElement("video",{ref:n,autoPlay:!0,playsInline:!0}))},I=t(58),W=t.n(I),J=(t(78),t(31)),U=function(){var e=Object(l.d)((function(e){return e.led}),l.b),n=Object(l.c)(),t=Object(a.useRef)(null);Object(a.useEffect)((function(){return t.current=new WebSocket("ws://localhost:8080/ws"),t.current.onopen=function(){console.log("WS connected"),t.current.send("Ping from client")},t.current.onclose=function(e){console.log("WS closed connection",e)},t.current.onerror=function(e){console.log("WS error",e)},t.current.onmessage=function(e){console.log("WS message",e.data),n(Object(J.b)(JSON.parse(e.data)))},function(){t.current.close()}}),[]);var c=function(){t.current.send("ON")},o=function(){t.current.send("OFF")};return r.a.createElement("div",{className:"board"},r.a.createElement("div",{className:"led__container"},Object.entries(e).map((function(e,n){var t=Object(y.a)(e,2),a=t[0],c=t[1];return r.a.createElement("div",{key:a,className:"led__item"},r.a.createElement("span",null,n+1),r.a.createElement("span",{className:W()("led",{led__off:!c,led__on:c})}))}))),r.a.createElement(P.a,{variant:"contained",onClick:c,color:"primary"},"\u0412\u043a\u043b\u044e\u0447\u0438\u0442\u044c"),r.a.createElement(P.a,{variant:"contained",onClick:o,color:"secondary"},"\u0412\u044b\u043a\u043b\u044e\u0447\u0438\u0442\u044c"))};n.default=function(){var e=!!Object(l.d)((function(e){return e.auth.name}));return r.a.createElement(r.a.Fragment,null,r.a.createElement(E,null),e&&r.a.createElement(r.a.Fragment,null,r.a.createElement(q,null),r.a.createElement(U,null)))}},80:function(e,n,t){"use strict";t.r(n);var a=t(0),r=t.n(a),c=t(8),o=t.n(c),l=t(13),i=t(18),s=t(14),u=t(26),d=t(31),f=Object(s.c)({auth:u.b,led:d.a});var m=Object(i.a)({reducer:f});t(74);!function(){var e=t(79).default;o.a.render(r.a.createElement(l.a,{store:m},r.a.createElement(e,null)),document.getElementById("root"))}()}},[[64,1,2]]]);
//# sourceMappingURL=main.0672bcea.chunk.js.map