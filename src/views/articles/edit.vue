<template>
  <el-card class="publish-container">
    <div slot="header" class="clearfix">
      <my-breadcrumb>编辑文章--我是编辑--id是:{{$route.params.id}}</my-breadcrumb>
    </div>
    <el-form label-width="80px"
    ref="form" :rules="rules" :model="form">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
<el-form-item label="内容:" prop="content">
   <quill-editor v-model="form.content" :options="editorOption"></quill-editor>
      </el-form-item>
      <!-- 封面开始 -->
<el-form-item label="封面">
          <el-radio-group v-model="form.coverType" @change="hImageTypeChange">
            <el-radio :label="1" >单图</el-radio>
            <el-radio :label="3" >三图</el-radio>
            <el-radio :label="0" >无图</el-radio>
            <el-radio :label="-1" >自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="form.coverType>0">
          <el-row>
            <el-col :span="6" v-for="(item,idx) in form.coverType" :key="idx">
                {{idx}}
                <my-cover v-model="form.coverImages[idx]"/>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 封面结束 -->
      <my-channel v-model="form.channelId"></my-channel>
      <el-form-item>
        <el-button type="primary" @click="hSave">保存</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
// 导入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 导入组件
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'EditArticle',
  components: {
    quillEditor
  },
  created () {
    this.loadArticle()
  },
  data () {
    return {
      // 富文本配置对象
      editorOption: {
      // 占位配置
        placeholder: '',
        modules: {
        // 配置工具栏
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        }
      },
      form: {
        title: '',
        content: '',
        coverType: 0, // 封面图的类型, 默认是无图
        coverImages: [], // 封面图的地址
        channelId: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在5到30之间', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 20, max: 30000, message: '最少20个字', trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择频道', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async loadArticle () {
    // 1. 获取文章的详情
      const res = await this.$http({
        url: '/mp/v1_0/articles/' + this.$route.params.id,
        method: 'GET'
      })
      console.log(res)
      console.log(666)
      // 2. 保存数据，视图就更新了，页面也能显示出来了
      this.form.title = res.data.data.title
      this.form.content = res.data.data.content
      this.form.coverType = res.data.data.cover.type
      this.form.coverImages = res.data.data.cover.images
      this.form.channelId = res.data.data.channel_id
    },
    // 处理图片类型切换
    hImageTypeChange () {
      if (this.form.coverType === 1) {
        this.form.coverImages.length = 1
      } else if (this.form.coverType === 3) {
        this.form.coverImages.length = 3
      } else {
        this.form.coverImages = []
      }
    },
    // 默认: 不是草稿
    hSave () {
      // 1. 验证数据有效性
      this.$refs.myForm.validate(valid => {
        if (valid) {
          this.doSave()
        }
      })
    },
    async doSave () {
      try {
        const { title, content, channelId, coverType, coverImages } = this.form
        // 2. 调用接口实现保存
        const res = await this.$http({
          method: 'PUT',
          url: '/mp/v1_0/articles/' + this.$route.params.id,
          data: {
            title,
            content,
            channel_id: channelId,
            cover: {
              type: coverType,
              images: coverImages
            }
          }
        })
        console.log(res)
        this.$message.success('保存成功了')
      } catch (err) {
        console.log(err)
        this.$message.error('保存失败')
      }
    }
  }
}
</script>
<style lang='less'  scoped>
// 在父组件中去设置子组件的样式，加上/deep/ 实现穿透功能
.publish-container /deep/ .ql-container{
  height: 300px;
}
.publish-container /deep/ .ql-toolbar.ql-snow{
  padding: 0 8px;
}
</style>
