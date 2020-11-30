(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-190f6fa7"],{"263e":function(e,t,r){"use strict";r.r(t);var o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("el-card",{staticClass:"publish-container"},[r("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[r("my-breadcrumb",[e._v("编辑文章--我是编辑--id是:"+e._s(e.$route.params.id))])],1),r("el-form",{ref:"form",attrs:{"label-width":"80px",rules:e.rules,model:e.form}},[r("el-form-item",{attrs:{label:"标题:",prop:"title"}},[r("el-input",{model:{value:e.form.title,callback:function(t){e.$set(e.form,"title",t)},expression:"form.title"}})],1),r("el-form-item",{attrs:{label:"内容:",prop:"content"}},[r("quill-editor",{attrs:{options:e.editorOption},model:{value:e.form.content,callback:function(t){e.$set(e.form,"content",t)},expression:"form.content"}})],1),r("el-form-item",{attrs:{label:"封面"}},[r("el-radio-group",{on:{change:e.hImageTypeChange},model:{value:e.form.coverType,callback:function(t){e.$set(e.form,"coverType",t)},expression:"form.coverType"}},[r("el-radio",{attrs:{label:1}},[e._v("单图")]),r("el-radio",{attrs:{label:3}},[e._v("三图")]),r("el-radio",{attrs:{label:0}},[e._v("无图")]),r("el-radio",{attrs:{label:-1}},[e._v("自动")])],1)],1),e.form.coverType>0?r("el-form-item",{attrs:{label:""}},[r("el-row",e._l(e.form.coverType,(function(t,o){return r("el-col",{key:o,attrs:{span:6}},[e._v(" "+e._s(o)+" "),r("my-cover",{model:{value:e.form.coverImages[o],callback:function(t){e.$set(e.form.coverImages,o,t)},expression:"form.coverImages[idx]"}})],1)})),1)],1):e._e(),r("my-channel",{model:{value:e.form.channelId,callback:function(t){e.$set(e.form,"channelId",t)},expression:"form.channelId"}}),r("el-form-item",[r("el-button",{attrs:{type:"primary"},on:{click:e.hSave}},[e._v("保存")])],1)],1)],1)},a=[],n=(r("96cf"),r("1da1")),l=(r("a753"),r("8096"),r("14e1"),r("953d")),c={name:"EditArticle",components:{quillEditor:l["quillEditor"]},created:function(){this.loadArticle()},data:function(){return{editorOption:{placeholder:"",modules:{toolbar:[["bold","italic","underline","strike"],["blockquote","code-block"],[{header:1},{header:2}],[{list:"ordered"},{list:"bullet"}],[{indent:"-1"},{indent:"+1"}],["image"]]}},form:{title:"",content:"",coverType:0,coverImages:[],channelId:""},rules:{title:[{required:!0,message:"请输入文章标题",trigger:"blur"},{min:5,max:30,message:"长度在5到30之间",trigger:"blur"}],content:[{required:!0,message:"请输入文章内容",trigger:"blur"},{min:20,max:3e4,message:"最少20个字",trigger:"blur"}],channelId:[{required:!0,message:"请选择频道",trigger:"blur"}]}}},methods:{loadArticle:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$http({url:"/mp/v1_0/articles/"+e.$route.params.id,method:"GET"});case 2:r=t.sent,console.log(r),console.log(666),e.form.title=r.data.data.title,e.form.content=r.data.data.content,e.form.coverType=r.data.data.cover.type,e.form.coverImages=r.data.data.cover.images,e.form.channelId=r.data.data.channel_id;case 10:case"end":return t.stop()}}),t)})))()},hImageTypeChange:function(){1===this.form.coverType?this.form.coverImages.length=1:3===this.form.coverType?this.form.coverImages.length=3:this.form.coverImages=[]},hSave:function(){var e=this;this.$refs.myForm.validate((function(t){t&&e.doSave()}))},doSave:function(){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){var r,o,a,n,l,c,i;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,r=e.form,o=r.title,a=r.content,n=r.channelId,l=r.coverType,c=r.coverImages,t.next=4,e.$http({method:"PUT",url:"/mp/v1_0/articles/"+e.$route.params.id,data:{title:o,content:a,channel_id:n,cover:{type:l,images:c}}});case 4:i=t.sent,console.log(i),e.$message.success("保存成功了"),t.next=13;break;case 9:t.prev=9,t.t0=t["catch"](0),console.log(t.t0),e.$message.error("保存失败");case 13:case"end":return t.stop()}}),t,null,[[0,9]])})))()}}},i=c,s=(r("307f"),r("2877")),m=Object(s["a"])(i,o,a,!1,null,"0f65c960",null);t["default"]=m.exports},"307f":function(e,t,r){"use strict";r("cb89")},cb89:function(e,t,r){}}]);
//# sourceMappingURL=chunk-190f6fa7.3563ec00.js.map