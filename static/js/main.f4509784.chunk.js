(this["webpackJsonpremote-work-equipment-stand-client"]=this["webpackJsonpremote-work-equipment-stand-client"]||[]).push([[0],{15:function(t,e,n){t.exports=n(29)},2:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"c",(function(){return a}));var r,i=n(5);!function(t){t.ShowAll="SHOW_ALL",t.ShowCompleted="SHOW_COMPLETED",t.ShowActive="SHOW_ACTIVE"}(r||(r={}));var c=r.ShowAll,o=Object(i.b)({name:"visibilityFilter",initialState:c,reducers:{setVisibilityFilter:function(t,e){return e.payload}}}),a=o.actions.setVisibilityFilter;e.b=o.reducer},27:function(t,e,n){},28:function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return m}));var r=n(0),i=n.n(r),c=n(1),o=n(2),a=n(4);function u(t){var e=t.completed,n=t.text,r=t.onClick;return i.a.createElement("li",{onClick:r,style:{textDecoration:e?"line-through":"none"}},n)}function l(){var t=Object(c.b)(),e=Object(c.c)((function(t){return function(t,e){switch(e){case o.a.ShowAll:return t;case o.a.ShowCompleted:return t.filter((function(t){return t.completed}));case o.a.ShowActive:return t.filter((function(t){return!t.completed}));default:throw new Error("Unknown filter: ".concat(e))}}(t.todos,t.visibilityFilter)}));return i.a.createElement("ul",null,e.map((function(e){return i.a.createElement(u,Object.assign({key:e.id},e,{onClick:function(){return t(Object(a.d)(e))}}))})))}var s=n(14);function d(){var t=Object(c.b)(),e=i.a.useState(""),n=Object(s.a)(e,2),r=n[0],o=n[1];return i.a.createElement("form",{onSubmit:function(e){e.preventDefault(),r.trim()&&(t(Object(a.a)(r)),o(""))}},i.a.createElement("input",{value:r,onChange:function(t){o(t.target.value)}}),i.a.createElement("button",{type:"submit"},"Add Todo"))}function f(t){var e=t.visibilityFilter,n=t.text,r=Object(c.b)(),a=Object(c.c)((function(t){return t.visibilityFilter}));return i.a.createElement("button",{disabled:a===e,onClick:function(){return r(Object(o.c)(e))}},n)}function b(){return i.a.createElement("div",null,i.a.createElement("span",null,"Show: "),i.a.createElement(f,{visibilityFilter:o.a.ShowAll,text:"All"}),i.a.createElement(f,{visibilityFilter:o.a.ShowActive,text:"Active"}),i.a.createElement(f,{visibilityFilter:o.a.ShowCompleted,text:"Completed"}))}function m(){var t=Object(c.b)();return i.a.useEffect((function(){t(Object(a.b)())}),[]),i.a.createElement("div",null,i.a.createElement(d,null),i.a.createElement(l,null),i.a.createElement(b,null))}},29:function(t,e,n){"use strict";n.r(e);var r=n(0),i=n.n(r),c=n(7),o=n.n(c),a=n(1),u=n(5),l=n(3),s=n(4),d=n(2),f=Object(l.c)({todos:s.c,visibilityFilter:d.b});var b=Object(u.a)({reducer:f});n(27);!function(){var t=n(28).default;o.a.render(i.a.createElement(a.a,{store:b},i.a.createElement(t,null)),document.getElementById("root"))}()},4:function(t,e,n){"use strict";n.d(e,"d",(function(){return u})),n.d(e,"b",(function(){return l})),n.d(e,"a",(function(){return s}));var r=n(6),i=n.n(r),c=n(11),o=n(5),a=Object(o.b)({name:"todos",initialState:[],reducers:{receiveTodos:function(t,e){return e.payload},receiveTodo:function(t,e){t.push(e.payload)},toggleTodo:function(t,e){var n=t.find((function(t){return t.id===e.payload.id}));n&&(n.completed=!n.completed)}}}),u=a.actions.toggleTodo,l=function(){return Object(c.a)(i.a.mark((function t(){var e;return i.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=Math.random().toString(36).substr(2,9),window.history.pushState(null,document.title,"".concat(e));case 2:case"end":return t.stop()}}),t)})))},s=function(t){return function(){var e=Object(c.a)(i.a.mark((function e(n){var r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r={id:Math.random().toString(36).substr(2,9),completed:!1,text:t},n(a.actions.receiveTodo(r));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()};e.c=a.reducer}},[[15,1,2]]]);
//# sourceMappingURL=main.f4509784.chunk.js.map