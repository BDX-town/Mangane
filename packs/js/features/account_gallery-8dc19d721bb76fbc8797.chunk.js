"use strict";(self.webpackChunkmangane_fe=self.webpackChunkmangane_fe||[]).push([[6],{889:function(e,t,a){var i=a(1866),n=a(1852),o=(a(1),a(7),a(5)),l=a.n(o),s=a(0),c=a(235),u=a(16),d=a(96),r=a(3),m=a(60);t.Z=function(e){var t,o,v=e.attachment,f=e.displayWidth,p=e.onOpenMedia,_=(0,r.rV)(),g=_.get("autoPlayGif"),Z=_.get("displayMedia"),y=(0,s.useState)("hide_all"!==Z&&!(null!==(t=v.status)&&void 0!==t&&t.sensitive)||"show_all"===Z),h=y[0],b=y[1],N=function(){return!g&&["gifv","video"].includes(v.type)},I="".concat(Math.floor((f-4)/3)-4,"px"),M=I,C=v.get("status"),w=C.get("spoiler_text")||v.get("description"),x="";if("unknown"===v.type);else if("image"===v.type){var k=100*((Number(v.getIn(["meta","focus","x"]))||0)/2+.5),E=100*((Number(v.getIn(["meta","focus","y"]))||0)/-2+.5);x=(0,n.Z)(d.Z,{src:v.preview_url,alt:v.description,style:{objectPosition:"".concat(k,"% ").concat(E,"%")}})}else if(-1!==["gifv","video"].indexOf(v.type)){var L={};(0,m.gn)()&&(L.playsInline=!0),g&&(L.autoPlay=!0),x=(0,n.Z)("div",{className:l()("media-gallery__gifv",{autoplay:g})},void 0,s.createElement("video",(0,i.Z)({className:"media-gallery__item-gifv-thumbnail","aria-label":v.description,title:v.description,role:"application",src:v.url,onMouseEnter:function(e){var t=e.target;N()&&t.play()},onMouseLeave:function(e){var t=e.target;N()&&(t.pause(),t.currentTime=0)},loop:!0,muted:!0},L)),(0,n.Z)("span",{className:"media-gallery__gifv__label"},void 0,"GIF"))}else if("audio"===v.type){var G=v.remote_url||"",O=G.lastIndexOf("."),U=G.substr(O+1).toUpperCase();x=(0,n.Z)("div",{className:"media-gallery__item-thumbnail"},void 0,(0,n.Z)("span",{className:"media-gallery__item__icons"},void 0,(0,n.Z)(u.Z,{src:a(389)})),(0,n.Z)("span",{className:"media-gallery__file-extension__label"},void 0,U))}return h||(o=(0,n.Z)("span",{className:"account-gallery__item__icons"},void 0,(0,n.Z)(u.Z,{src:a(97)}))),(0,n.Z)("div",{className:"account-gallery__item",style:{width:I,height:M}},void 0,(0,n.Z)("a",{className:"media-gallery__item-thumbnail rounded overflow-hidden",href:C.get("url"),target:"_blank",onClick:function(e){0!==e.button||e.ctrlKey||e.metaKey||(e.preventDefault(),h?p(v):b(!0))},title:w},void 0,(0,n.Z)(c.Z,{hash:v.get("blurhash"),className:l()("media-gallery__preview",{"media-gallery__preview--hidden":h})}),h&&x,!h&&o))}},1204:function(e,t,a){a.r(t);var i=a(1852),n=(a(1),a(0)),o=a(1868),l=a(1862),s=a(13),c=a(1854),u=a(25),d=a(489),r=a(71),m=a(2),v=a(3),f=a(9),p=a(15),_=a(889),g=function(e){var t=e.maxId,a=e.onLoadMore;return(0,i.Z)(d.Z,{onClick:function(){a(t)}})};t.default=function(){var e=(0,v.TL)(),t=(0,l.UO)().username,a=(0,v.CG)((function(e){var a,i,n=e.me,o=((null===(a=e.accounts.get(-1))||void 0===a?void 0:a.username)||"").toLowerCase()===t.toLowerCase(),l=(0,p.N$)(e.instance),s=-1,c=t;if(o)s=null;else{var u=(0,f.XO)(e,t);s=u?u.id||null:-1,c=(null==u?void 0:u.acct)||""}var d=(null===(i=e.relationships.get(String(s)))||void 0===i?void 0:i.blocked_by)||!1;return{accountId:s,unavailable:n!==s&&d&&!l.blockersVisible,accountUsername:c}})),Z=a.accountId,y=a.unavailable,h=a.accountUsername,b=(0,v.CG)((function(e){return!!e.accounts.get(Z)})),N=(0,v.CG)((function(e){return(0,f.Uq)(e,Z)})),I=(0,v.CG)((function(e){var t;return null===(t=e.timelines.get("account:".concat(Z,":media")))||void 0===t?void 0:t.isLoading})),M=(0,v.CG)((function(e){var t;return null===(t=e.timelines.get("account:".concat(Z,":media")))||void 0===t?void 0:t.hasMore})),C=(0,n.useState)(323),w=C[0],x=C[1],k=function(t){Z&&-1!==Z&&e((0,u.fe)(Z,{maxId:t}))},E=function(t){if("video"===t.type)e((0,c.h7)("VIDEO",{media:t,status:t.status,account:t.account}));else{var a=t.status.media_attachments,i=a.findIndex((function(e){return e.id===t.id}));e((0,c.h7)("MEDIA",{media:a,index:i,status:t.status,account:t.account}))}};if((0,n.useEffect)((function(){Z&&-1!==Z?(e((0,s.$Gz)(Z)),e((0,u.fe)(Z))):e((0,s.ULQ)(t))}),[Z]),!b&&-1!==Z)return(0,i.Z)(r.Z,{});if(-1===Z||!N&&I)return(0,i.Z)(m.sg,{},void 0,(0,i.Z)(m.$j,{}));var L=null;return!M||I&&0===N.size||(L=(0,i.Z)(d.Z,{visible:!I,onClick:function(e){e.preventDefault(),M&&k(N.size>0?N.last().status.id:void 0)}})),y?(0,i.Z)(m.sg,{},void 0,(0,i.Z)("div",{className:"empty-column-indicator"},void 0,(0,i.Z)(o.Z,{id:"empty_column.account_unavailable",defaultMessage:"Profile unavailable"}))):(0,i.Z)(m.sg,{label:"@".concat(h),transparent:!0,withHeader:!1},void 0,n.createElement("div",{role:"feed",className:"account-gallery__container",ref:function(e){e&&x(e.offsetWidth)}},N.map((function(e,t){var a,n;return null===e?(0,i.Z)(g,{maxId:t>0&&(null===(n=N.get(t-1))||void 0===n?void 0:n.id)||null,onLoadMore:k},"more:"+(null===(a=N.get(t+1))||void 0===a?void 0:a.id)):(0,i.Z)(_.Z,{attachment:e,displayWidth:w,onOpenMedia:E},"".concat(e.status.id,"+").concat(e.id))})),!I&&0===N.size&&(0,i.Z)("div",{className:"empty-column-indicator"},void 0,(0,i.Z)(o.Z,{id:"account_gallery.none",defaultMessage:"No media to show."})),L),I&&0===N.size&&(0,i.Z)("div",{className:"slist__append"},void 0,(0,i.Z)(m.$j,{})))}},1248:function(e,t,a){a.r(t);var i=a(1852),n=(a(1),a(344)),o=a(0),l=a(1868),s=a(6),c=a(1854),u=a(25),d=a(2),r=a(3),m=a(9),v=a(889);t.default=function(e){var t,a=e.account,f=(0,s.I0)(),p=(0,o.useState)(!0),_=p[0],g=p[1],Z=(0,r.CG)((function(e){return a?(0,m.Uq)(e,null==a?void 0:a.id):(0,n.List)()})),y=function(e){if("video"===e.type)f((0,c.h7)("VIDEO",{media:e,status:e.status}));else{var t=e.getIn(["status","media_attachments"]),a=t.findIndex((function(t){return t.id===e.id}));f((0,c.h7)("MEDIA",{media:t,index:a,status:e.status,account:e.account}))}};return(0,o.useEffect)((function(){g(!0),a&&f((0,u.fe)(a.id)).then((function(){return g(!1)})).catch((function(){}))}),[null==a?void 0:a.id]),(0,i.Z)(d.$L,{title:(0,i.Z)(l.Z,{id:"media_panel.title",defaultMessage:"Media"})},void 0,a&&(0,i.Z)("div",{className:"media-panel__content"},void 0,_?(0,i.Z)(d.$j,{}):(t=Z.filter((function(e){return"public"===e.getIn(["status","visibility"])})).slice(0,9)).isEmpty()?(0,i.Z)("div",{className:"media-panel__empty"},void 0,(0,i.Z)(l.Z,{id:"media_panel.empty_message",defaultMessage:"No media found."})):(0,i.Z)("div",{className:"media-panel__list"},void 0,t.map((function(e,t){return(0,i.Z)(v.Z,{attachment:e,displayWidth:255,onOpenMedia:y},"".concat(e.getIn(["status","id"]),"+").concat(e.id))})))))}}}]);
//# sourceMappingURL=account_gallery-8dc19d721bb76fbc8797.chunk.js.map