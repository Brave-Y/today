(window.webpackJsonp = window.webpackJsonp || []).push([['chunk-f376776a'], { '06fa': function (e, r, t) { 'use strict'; t('5b45') }, '5b45': function (e, r, t) {}, dd7b: function (e, r, t) { 'use strict'; t.r(r); var o = function () { var e = this; var r = e.$createElement; var t = e._self._c || r; return t('div', { staticClass: 'login-container' }, [t('div', { staticClass: 'login-form-wrap' }, [e._m(0), t('el-form', { ref: 'refForm', staticClass: 'login-form', attrs: { model: e.form, rules: e.rules } }, [t('el-form-item', { attrs: { prop: 'mobile' } }, [t('el-input', { attrs: { placeholder: '请输入手机号' }, model: { value: e.form.mobile, callback: function (r) { e.$set(e.form, 'mobile', r) }, expression: 'form.mobile' } })], 1), t('el-form-item', { attrs: { prop: 'code' } }, [t('el-input', { attrs: { placeholder: '请输入密码' }, model: { value: e.form.code, callback: function (r) { e.$set(e.form, 'code', r) }, expression: 'form.code' } })], 1), t('el-form-item', { attrs: { prop: 'isAgree' } }, [t('el-checkbox', { attrs: { label: '我已阅读并同意用户协议和隐私条款', name: 'type' }, model: { value: e.form.isAgree, callback: function (r) { e.$set(e.form, 'isAgree', r) }, expression: 'form.isAgree' } })], 1), t('el-form-item', [t('el-button', { staticClass: 'login-btn', attrs: { Loading: e.isLoading, type: 'primary' }, on: { click: e.Ylogin }, model: { value: e.form.isAgree, callback: function (r) { e.$set(e.form, 'isAgree', r) }, expression: 'form.isAgree' } }, [e._v('登陆')])], 1)], 1)], 1)]) }; var i = [function () { var e = this; var r = e.$createElement; var t = e._self._c || r; return t('div', { staticClass: 'login-head' }, [t('div', { staticClass: 'logo' })]) }]; var a = (t('96cf'), t('1da1')); var s = { name: 'login', data: function () { return { rules: { mobile: [{ required: !0, message: '请输入手机号', trigger: 'blur' }, { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }], code: [{ required: !0, message: '请输入验证码', trigger: 'blur' }, { pattern: /^\d{6}$/, message: '请输入正确的验证码', trigger: 'blur' }], isAgree: [{ validator: function (e, r, t) { r ? t() : t(new Error('你必须同意，才能登陆')) }, trigger: 'change' }] }, isLoading: !1, form: { isAgree: !1, mobile: '13911111111', code: '246810' } } }, methods: { doLogin: function () { var e = this; return Object(a.a)(regeneratorRuntime.mark(function r () { var t, o, i, a; return regeneratorRuntime.wrap(function (r) { while (1) switch (r.prev = r.next) { case 0:return t = e.form, o = t.mobile, i = t.code, e.isLoading = !0, r.prev = 2, r.next = 5, e.$http({ method: 'POST', url: 'mp/v1_0/authorizations', data: { mobile: o, code: i } }); case 5:a = r.sent, e.$message.success('登陆成功'), e.isLoading = !1, localStorage.setItem('tokenStr', a.data.data.token), e.$router.push('/'), r.next = 17; break; case 12:r.prev = 12, r.t0 = r.catch(2), console.log(r.t0), e.$message.error('错了哦，这是一条错误消息'), e.isLoading = !1; case 17:case 'end':return r.stop() } }, r, null, [[2, 12]]) }))() }, Ylogin: function () { var e = this; this.$refs.refForm.validate(function (r) { console.log('验证结果是', r), r && e.doLogin() }) } } }; var n = s; var l = (t('06fa'), t('2877')); var c = Object(l.a)(n, o, i, !1, null, '3460b854', null); r.default = c.exports } }])
// # sourceMappingURL=chunk-f376776a.e177da85.js.map
