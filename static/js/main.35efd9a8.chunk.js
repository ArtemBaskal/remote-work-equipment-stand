(this["webpackJsonpremote-work-equipment-stand"]=this["webpackJsonpremote-work-equipment-stand"]||[]).push([[0],{105:function(e,n,t){},110:function(e,n,t){"use strict";t.r(n);var r=t(0),a=t(52),c=t.n(a),i=t(65),o=t(30),s=t(76),u=t(77),l=function(){function e(n){Object(s.a)(this,e),this.signaling=void 0,this.signaling=n}return Object(u.a)(e,[{key:"send",value:function(e){this.signaling.send(JSON.stringify({data:e}))}},{key:"onmessage",set:function(e){var n=this,t=function(n){var t=n.data;e(JSON.parse(t))};this.signaling.addEventListener("message",t),this.unsubscribe=function(){console.log("unsubscribe from message"),n.signaling.removeEventListener("message",t)}}},{key:"unsubscribe",value:function(){console.error("Method unsubscribe is not implemented")}}]),e}(),d=t(34),b=t(151),f=t(163),j=t(158),p=t(165),g=t(150),m=t(143),O=t(14),v=t(24),h=t(144),x=t(145),y=t(146),k=t(162),S=t(147),L=t(148),E=t(149),w=t(81),P=t.n(w),C=t(82),R=t.n(C),D=t(48),I=t(157),N=t(141),T=t(60),q=t(4),F=function(e){var n=e.value;return Object(q.jsxs)(I.a,{display:"flex",alignItems:"center",children:[Object(q.jsx)(I.a,{width:"100%",mr:1,children:Object(q.jsx)(N.a,Object(D.a)({variant:"determinate"},e))}),Object(q.jsx)(I.a,{minWidth:35,children:Object(q.jsx)(T.a,{variant:"body2",color:"textSecondary",children:"".concat(Math.round(n),"%")})})]})},M=t(38),A=Object(m.a)((function(){return{progress:{width:"100%"},file:{display:"flex"}}})),G=function(e){var n=e.pcRef,t=Object(O.c)(),a=A(),c=Object(O.d)((function(e){return e.fileLoader}),O.b),i=c.maxProgress,s=c.progressValue,u=Object(r.useState)(null),l=Object(o.a)(u,2),d=l[0],b=l[1];Object(r.useEffect)((function(){var e=window;function n(e){e.stopPropagation(),e.preventDefault()}function t(e){e.stopPropagation(),e.preventDefault()}function r(e){e.stopPropagation(),e.preventDefault();var n=Object(o.a)(e.dataTransfer.files,1)[0];b(n)}return e.addEventListener("dragenter",n,!1),e.addEventListener("dragover",t,!1),e.addEventListener("drop",r,!1),function(){e.removeEventListener("dragenter",n,!1),e.removeEventListener("dragover",t,!1),e.removeEventListener("drop",r,!1)}}),[]);var f,j,p=function(){b(null)};return Object(q.jsxs)("section",{children:[Object(q.jsx)("input",{type:"file",id:"files",style:{display:"none"},onChange:function(e){var n=e.target.files;b(n[0])}}),d&&Object(q.jsx)(h.a,{className:a.file,children:Object(q.jsxs)(x.a,{children:[Object(q.jsx)(y.a,{children:Object(q.jsx)(k.a,{children:Object(q.jsx)(P.a,{})})}),Object(q.jsx)(S.a,{primary:d.name,secondary:new Date(d.lastModified).toLocaleString(),title:"".concat(d.size," \u0431\u0430\u0439\u0442")}),Object(q.jsx)(L.a,{children:Object(q.jsx)(E.a,{edge:"end","aria-label":"delete",onClick:p,children:Object(q.jsx)(R.a,{})})})]})}),s>0&&d?Object(q.jsx)("div",{className:a.progress,children:Object(q.jsx)(F,{value:(f=s,j=i,100*(f-0)/(j-0))})}):Object(q.jsx)("br",{}),d&&Object(q.jsx)(g.a,{component:"button",color:"primary",onClick:function(){if(d&&n.current){var e=n.current.createDataChannel(d.name);e.binaryType="arraybuffer",t(Object(M.b)(d.size));var r=new FileReader,a=0;r.addEventListener("error",(function(e){console.error("Error reading selectedFile: ",e)})),r.addEventListener("abort",(function(e){console.log("File reading aborted: ",e)}));var c=!1,i=function(e){console.log("readSlice",e);var n=d.slice(a,e+262144);r.readAsArrayBuffer(n)};r.addEventListener("load",(function(n){var r;if(console.log("FileReader.onload",n),(null===(r=n.target)||void 0===r?void 0:r.result)&&"open"===e.readyState)if(c)console.warn("Unable to write, data channel is paused!");else{var o=n.target.result;if(e.send(o),a+=o.byteLength,t(Object(M.c)(a)),a>=d.size)return e.send("EOF"),e.close(),b(null),t(Object(M.b)(0)),t(Object(M.c)(0)),p(),void t(Object(v.d)("\u0424\u0430\u0439\u043b \u0443\u0441\u043f\u0435\u0448\u043d\u043e \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d"));c||e.bufferedAmount<1048576?i(a):(console.log("Data channel ".concat(e.label," paused @ ").concat(e.bufferedAmount)),c=!0)}else console.warn("sendFileChannel.readyState is not open:",e.readyState)})),e.bufferedAmountLowThreshold=262144,e.addEventListener("bufferedamountlow",(function(){c&&(console.debug("Data channel ".concat(e.label," resumed @ ").concat(e.bufferedAmount)),c=!1,i(a))})),e.onopen=function(){i(0)}}},variant:"contained",type:"submit",size:"small",children:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c"}),Object(q.jsx)(g.a,{component:"label",htmlFor:"files",variant:"contained",size:"small",id:"files",children:"\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u043f\u0440\u043e\u0448\u0438\u0432\u043a\u0443"})]})},_={iceServers:[{url:"stun:stun.l.google.com:19302"},{url:"stun:stun1.l.google.com:19302"},{url:"stun:stun2.l.google.com:19302"},{url:"stun:stun3.l.google.com:19302"},{urls:"turn:numb.viagenie.ca",credential:"9u7prU:2}R{Sut~.)d[bP7,;Pgc'Pa",username:"fkrveacbukypqsqyaq@miucce.com"}]},U=Object(m.a)((function(e){return{root:{flexGrow:1,"& > *":{margin:e.spacing(1)},padding:"2rem"},formControl:{margin:e.spacing(1),minWidth:"10rem"},video:{display:"flex",justifyContent:"center",flexDirection:"column",backgroundImage:"url(".concat("/remote-work-equipment-stand","/chip.png)"),backgroundSize:"5.5rem",backgroundRepeat:"space",width:"100%",minHeight:"30rem"}}})),z=function(){var e=Object(O.c)(),n=U(),t=Object(O.d)((function(e){return e.auth.id_token})),a=Object(r.useRef)(null),s=Object(r.useRef)(null),u=Object(r.useRef)(null),m=Object(r.useState)(""),h=Object(o.a)(m,2),x=h[0],y=h[1],k=Object(r.useState)(!1),S=Object(o.a)(k,2),L=S[0],E=S[1],w=Object(r.useState)(""),P=Object(o.a)(w,2),C=P[0],R=P[1];Object(r.useEffect)((function(){if(""!==C){var n,r,u,b=(n="room",r=C,new URLSearchParams(Object(d.a)({},n,r)).toString()),f=new URL("".concat(b&&"?".concat(b)),"wss://wss-signaling.herokuapp.com").toString(),j=new WebSocket(f,["id_token",t]),p=function(e){console.log("OPEN WS",e),(u=new l(j)).send({getRemoteMedia:!0});var n=new RTCPeerConnection(_);s.current=n,n.ontrack=function(e){var n=e.track,t=Object(o.a)(e.streams,1)[0];n.onunmute=function(){a.current.srcObject||(a.current.srcObject=t)}};var t=!1,r=!1,d=!1;n.onicecandidate=function(e){var n=e.candidate;u.send({candidate:n})},n.onnegotiationneeded=Object(i.a)(c.a.mark((function e(){return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t=!0,e.next=4,n.setLocalDescription();case 4:u.send({description:n.localDescription}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.error(e.t0);case 10:return e.prev=10,t=!1,e.finish(10);case 13:case"end":return e.stop()}}),e,null,[[0,7,10,13]])}))),n.oniceconnectionstatechange=function(){"failed"===n.iceConnectionState&&n.restartIce()},u.onmessage=function(){var e=Object(i.a)(c.a.mark((function e(a){var i,o,s,l,b;return c.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(i=a.data,o=a.data,s=o.description,l=o.candidate,console.log(i),e.prev=2,!s){e.next=19;break}if(b=!t&&("stable"===n.signalingState||d),"offer"===s.type&&!b,!(r=!1)){e.next=9;break}return e.abrupt("return");case 9:return d="answer"===s.type,e.next=12,n.setRemoteDescription(s);case 12:if(d=!1,"offer"!==s.type){e.next=17;break}return e.next=16,n.setLocalDescription();case 16:u.send({description:n.localDescription});case 17:e.next=29;break;case 19:if(!l){e.next=29;break}return e.prev=20,e.next=23,n.addIceCandidate(l);case 23:e.next=29;break;case 25:if(e.prev=25,e.t0=e.catch(20),r){e.next=29;break}throw e.t0;case 29:e.next=34;break;case 31:e.prev=31,e.t1=e.catch(2),console.error(e.t1);case 34:case"end":return e.stop()}}),e,null,[[2,31],[20,25]])})));return function(n){return e.apply(this,arguments)}}();var b=function(e){var n=e.target.readyState;console.log("Send channel state is: %s",n)};n.addEventListener("datachannel",(function(e){var n=e.channel;n.addEventListener("message",(function(e){console.log("Received Message: %s",e.data)})),n.addEventListener("open",b),n.addEventListener("close",b)}))};return j.addEventListener("open",p),j.addEventListener("close",(function(e){console.log("CLOSE WS",e)})),j.addEventListener("error",(function(n){console.error("ERROR WS",n),e(Object(v.c)("\u041d\u0435 \u0443\u0434\u0430\u043b\u043e\u0441\u044c \u043f\u0440\u0438\u0441\u043e\u0435\u0434\u0438\u043d\u0438\u0442\u044c\u0441\u044f \u043a \u0441\u0442\u0435\u043d\u0434\u0443 ".concat(C)))})),function(){j.close(1e3,"change room"),s.current&&s.current.close(),j.removeEventListener("open",p),u&&u.unsubscribe(),a.current.srcObject=null}}}),[C]),Object(r.useEffect)((function(){var e=function(){"visible"===document.visibilityState&&document.pictureInPictureElement&&document.exitPictureInPicture()};return document.addEventListener("visibilitychange",e),function(){document.removeEventListener("visibilitychange",e)}}),[]);return Object(q.jsxs)("div",{className:n.root,children:[Object(q.jsxs)(b.a,{variant:"standard",className:n.formControl,children:[Object(q.jsx)(f.a,{htmlFor:"outlined-room-native-simple",children:"\u0421\u0442\u0435\u043d\u0434"}),Object(q.jsx)(j.a,{native:!0,value:C,onChange:function(e){R(String(e.target.value))},label:"\u0421\u0442\u0435\u043d\u0434\u0430",inputProps:{name:"\u0421\u0442\u0435\u043d\u0434",id:"outlined-room-native-simple"},children:Array.from({length:5},(function(e,n){return n})).map((function(e){var n=0===e,t=n?"":e.toString();return Object(q.jsx)("option",{value:t,disabled:n,"aria-label":n?"None":t,children:t},t)}))})]}),Object(q.jsx)("section",{className:n.video,children:Object(q.jsx)("video",{ref:a,autoPlay:!0,playsInline:!0,onClick:function(e){var n;(null===(n=a.current)||void 0===n?void 0:n.srcObject)&&(document.pictureInPictureElement?document.exitPictureInPicture():document.pictureInPictureEnabled&&e.target.requestPictureInPicture())}})}),Object(q.jsx)(G,{pcRef:s}),Object(q.jsxs)("section",{children:[Object(q.jsx)(p.a,{multiline:!0,value:x,onChange:function(e){if(!u.current){u.current=s.current.createDataChannel("sendDataChannel");var n=u.current;n.onopen=function(){E(!0)},n.onclose=function(){E(!1)}}y(e.target.value)}}),Object(q.jsx)("br",{}),Object(q.jsx)("br",{}),Object(q.jsx)(g.a,{component:"button",color:"primary",onClick:function(){u.current&&L&&(u.current.send(x),y(""))},variant:"contained",type:"submit",size:"small",disabled:!L,children:"\u041e\u0442\u043f\u0440\u0430\u0432\u0438\u0442\u044c \u043a\u043e\u043c\u0430\u043d\u0434\u0443"})]})]})},W=t(154),H=t(156),J=t(58),V=t(159),B=t(161),K=function(e){var n=e.snackbarDelay,t=Object(O.c)(),r=Object(O.d)((function(e){return e.snackbar}),O.b),a=r.open,c=r.snackbarMessage,i=r.type,o=function(){t(Object(v.a)())};return Object(q.jsx)(B.a,{open:a,autoHideDuration:n,onClose:o,onClick:o,children:Object(q.jsx)(V.a,{severity:i,children:c})})};K.defaultProps={snackbarDelay:6e3};var Q=t(59),X=t(155),Y=t(42),Z=Object(m.a)((function(e){return{layout:Object(d.a)({width:"auto",marginLeft:e.spacing(2),marginRight:e.spacing(2)},e.breakpoints.up(350+2*e.spacing(2)),{width:350,marginLeft:"auto",marginRight:"auto"}),paper:Object(d.a)({marginTop:e.spacing(3),marginBottom:e.spacing(3),padding:e.spacing(2),height:190},e.breakpoints.up(350+2*e.spacing(3)),{marginTop:e.spacing(6),marginBottom:e.spacing(6),padding:e.spacing(3)}),button:{marginTop:e.spacing(3),display:"flex",justifyContent:"center"}}})),$=function(){var e=Z(),n=Object(O.c)();return Object(q.jsx)("main",{className:e.layout,children:Object(q.jsxs)(W.a,{className:e.paper,variant:"outlined",square:!0,children:[Object(q.jsx)(T.a,{component:"h5",variant:"h5",align:"center",children:"\u0410\u0432\u0442\u043e\u0440\u0438\u0437\u0430\u0446\u0438\u044f"}),Object(q.jsx)("div",{className:e.button,children:Object(q.jsx)(J.GoogleLogin,{clientId:Q.GOOGLE_AUTH,buttonText:"\u0412\u043e\u0439\u0442\u0438",onSuccess:function(e){n(Object(Y.c)(Object(D.a)(Object(D.a)({},e.profileObj),{},{id_token:e.tokenObj.id_token})))},onFailure:function(e){console.error(e)},cookiePolicy:"single_host_origin",isSignedIn:!0})})]})})};n.default=function(){var e=Object(O.c)(),n=Object(O.d)((function(e){return e.auth}),O.b),t=n.imageUrl,r=n.email,a=n.name,c=!!a;return Object(q.jsxs)(q.Fragment,{children:[Object(q.jsx)(X.a,{}),Object(q.jsx)(K,{}),c?Object(q.jsxs)(q.Fragment,{children:[Object(q.jsx)(W.a,{elevation:1,variant:"outlined",square:!0,children:Object(q.jsxs)(H.a,{children:[Object(q.jsx)(I.a,{mr:1,children:Object(q.jsx)(k.a,{alt:a,src:t})}),Object(q.jsx)(S.a,{primary:a,secondary:r}),Object(q.jsx)(J.GoogleLogout,{clientId:Q.GOOGLE_AUTH,buttonText:"\u0412\u044b\u0439\u0442\u0438",onLogoutSuccess:function(){e(Object(Y.a)())}})]})}),Object(q.jsx)(I.a,{m:2,children:Object(q.jsx)(W.a,{elevation:3,variant:"outlined",children:Object(q.jsx)(z,{})})})]}):Object(q.jsx)($,{})]})}},111:function(e,n,t){"use strict";t.r(n);t(0);var r=t(9),a=t.n(r),c=t(14),i=t(17),o=t(42),s=t(38),u=Object(i.b)({name:"led",initialState:{pin1:!1,pin2:!1,pin3:!1},reducers:{setLed:function(e,n){return n.payload}}}),l=(u.actions.setLed,u.reducer),d=t(24),b=t(18),f=Object(b.c)({auth:o.b,fileLoader:s.a,led:l,snackbar:d.b});var j=Object(i.a)({reducer:f}),p=(t(105),t(4));!function(){var e=t(110).default;a.a.render(Object(p.jsx)(c.a,{store:j,children:Object(p.jsx)(e,{})}),document.getElementById("root"))}()},24:function(e,n,t){"use strict";t.d(n,"d",(function(){return o})),t.d(n,"c",(function(){return s})),t.d(n,"a",(function(){return u}));var r=t(17),a={snackbarMessage:"",type:"info",open:!1},c=Object(r.b)({name:"snackbar",initialState:a,reducers:{reset:function(){return a},setSnackbarSuccess:function(e,n){return e.snackbarMessage=n.payload,e.type="success",e.open=!0,e},setSnackbarError:function(e,n){return e.snackbarMessage=n.payload,e.type="error",e.open=!0,e},closeSnackbar:function(e){return e.open=!1,e}}}),i=c.actions,o=(i.reset,i.setSnackbarSuccess),s=i.setSnackbarError,u=i.closeSnackbar;n.b=c.reducer},38:function(e,n,t){"use strict";t.d(n,"b",(function(){return o})),t.d(n,"c",(function(){return s}));var r=t(17),a={maxProgress:0,progressValue:0},c=Object(r.b)({name:"fileLoader",initialState:a,reducers:{reset:function(){return a},setMaxProgress:function(e,n){return e.maxProgress=n.payload,e},setProgressValue:function(e,n){return e.progressValue=n.payload,e}}}),i=c.actions,o=(i.reset,i.setMaxProgress),s=i.setProgressValue;n.a=c.reducer},42:function(e,n,t){"use strict";t.d(n,"c",(function(){return o})),t.d(n,"a",(function(){return s}));var r=t(17),a={},c=Object(r.b)({name:"auth",initialState:a,reducers:{getProfile:function(e,n){return n.payload},clearProfile:function(){return a}}}),i=c.actions,o=i.getProfile,s=i.clearProfile;n.b=c.reducer},59:function(e){e.exports=JSON.parse('{"GOOGLE_AUTH":"930914015370-b31p63biqg1j0pbfr96qei9ujp1ttded.apps.googleusercontent.com"}')}},[[111,1,2]]]);
//# sourceMappingURL=main.35efd9a8.chunk.js.map