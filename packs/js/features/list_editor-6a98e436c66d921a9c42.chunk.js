"use strict";(self.webpackChunkmangane_fe=self.webpackChunkmangane_fe||[]).push([[53],{560:function(e,t,a){a.r(t),a.d(t,{default:function(){return E}});var s=a(1852),i=a(0),o=a(1844),n=a(1845),l=a(1868),r=a(67),c=a(2),d=a(3),u=(a(7),a(100)),v=a(49),f=a(9),m=(0,o.vU)({remove:{id:"lists.account.remove",defaultMessage:"Remove from list"},add:{id:"lists.account.add",defaultMessage:"Add to list"}}),Z=(0,f.Tm)(),g=function(e){var t,i=e.accountId,o=(0,n.Z)(),l=(0,d.TL)(),f=(0,d.CG)((function(e){return Z(e,i)})),g=(0,d.CG)((function(e){return e.listEditor.accounts.items.includes(i)}));return f?(t=g?(0,s.Z)(v.Z,{src:a(26),title:o.formatMessage(m.remove),onClick:function(){return l((0,r.v)(i))}}):(0,s.Z)(v.Z,{src:a(55),title:o.formatMessage(m.add),onClick:function(){return l((0,r.tR)(i))}}),(0,s.Z)("div",{className:"account"},void 0,(0,s.Z)("div",{className:"account__wrapper"},void 0,(0,s.Z)("div",{className:"account__display-name"},void 0,(0,s.Z)("div",{className:"account__avatar-wrapper"},void 0,(0,s.Z)(c.qE,{src:f.avatar,size:36})),(0,s.Z)(u.Z,{account:f})),(0,s.Z)("div",{className:"account__relationship"},void 0,t)))):null},h=(0,o.vU)({title:{id:"lists.edit.submit",defaultMessage:"Change title"},save:{id:"lists.new.save_title",defaultMessage:"Save Title"}}),M=function(){var e=(0,n.Z)(),t=(0,d.TL)(),a=(0,d.CG)((function(e){return e.listEditor.title})),i=(0,d.CG)((function(e){return!e.listEditor.isChanged})),o=e.formatMessage(h.save);return(0,s.Z)(c.l0,{onSubmit:function(e){e.preventDefault(),t((0,r.Mw)(!1))}},void 0,(0,s.Z)(c.Ug,{space:2},void 0,(0,s.Z)(c.II,{outerClassName:"flex-grow",type:"text",value:a,onChange:function(e){t((0,r.OU)(e.target.value))}}),(0,s.Z)(c.zx,{onClick:function(){t((0,r.Mw)(!1))},disabled:i},void 0,o)))},p=a(5),C=a.n(p),b=a(16),_=(0,o.vU)({search:{id:"lists.search",defaultMessage:"Search among people you follow"},searchTitle:{id:"tabs_bar.search",defaultMessage:"Search"}}),T=function(){var e=(0,n.Z)(),t=(0,d.TL)(),i=(0,d.CG)((function(e){return e.listEditor.suggestions.value})),o=function(){t((0,r.pT)(i))},l=i.length>0;return(0,s.Z)(c.l0,{onSubmit:o},void 0,(0,s.Z)(c.Ug,{space:2},void 0,(0,s.Z)("label",{className:"flex-grow relative"},void 0,(0,s.Z)("span",{style:{display:"none"}},void 0,e.formatMessage(_.search)),(0,s.Z)(c.II,{type:"text",value:i,onChange:function(e){t((0,r.pQ)(e.target.value))},placeholder:e.formatMessage(_.search)}),(0,s.Z)("div",{role:"button",tabIndex:0,className:"search__icon",onClick:function(){t((0,r.MC)())}},void 0,(0,s.Z)(b.Z,{src:a(425),"aria-label":e.formatMessage(_.search),className:C()("svg-icon--backspace",{active:l})}))),(0,s.Z)(c.zx,{onClick:o},void 0,e.formatMessage(_.searchTitle))))},w=(0,o.vU)({close:{id:"lightbox.close",defaultMessage:"Close"},changeTitle:{id:"lists.edit.submit",defaultMessage:"Change title"},addToList:{id:"lists.account.add",defaultMessage:"Add to list"},removeFromList:{id:"lists.account.remove",defaultMessage:"Remove from list"},editList:{id:"lists.edit",defaultMessage:"Edit list"}}),E=function(e){var t=e.listId,a=e.onClose,o=(0,n.Z)(),u=(0,d.TL)(),v=(0,d.CG)((function(e){return e.listEditor.accounts.items})),f=(0,d.CG)((function(e){return e.listEditor.suggestions.items}));return(0,i.useEffect)((function(){return u((0,r.Ru)(t)),function(){u((0,r.QS)())}}),[]),(0,s.Z)(c.u_,{title:(0,s.Z)(l.Z,{id:"lists.edit",defaultMessage:"Edit list"}),onClose:function(){a("LIST_ADDER")}},void 0,(0,s.Z)(c.Ol,{},void 0,(0,s.Z)(c.ll,{title:o.formatMessage(w.changeTitle)})),(0,s.Z)(M,{}),(0,s.Z)("br",{}),v.size>0&&(0,s.Z)("div",{},void 0,(0,s.Z)(c.Ol,{},void 0,(0,s.Z)(c.ll,{title:o.formatMessage(w.removeFromList)})),(0,s.Z)("div",{className:"max-h-48 overflow-y-auto"},void 0,v.map((function(e){return(0,s.Z)(g,{accountId:e},e)})))),(0,s.Z)("br",{}),(0,s.Z)(c.Ol,{},void 0,(0,s.Z)(c.ll,{title:o.formatMessage(w.addToList)})),(0,s.Z)(T,{}),(0,s.Z)("div",{className:"max-h-48 overflow-y-auto"},void 0,f.map((function(e){return(0,s.Z)(g,{accountId:e},e)}))))}}}]);
//# sourceMappingURL=list_editor-6a98e436c66d921a9c42.chunk.js.map