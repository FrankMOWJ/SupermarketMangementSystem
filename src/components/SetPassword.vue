<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">
        <i class="el-icon-s-home"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>修改登录密码</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 设置分割线 -->
    <el-divider></el-divider>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>
            <el-steps :active="3" align-center>
              <el-step title="填写原密码"></el-step>
              <el-step title="填写新密码"></el-step>
              <el-step title="确认新密码"></el-step>
            </el-steps>
        </span>
      </div>

      <div class="update_password">
        <el-form ref="setPassFormRef" :rules="setPasswordFormRules" :model="setInfo">
          <el-row :gutter="200">
          <el-col :span="24">
            <el-form-item label="原密码：" required="true">
              <el-input v-model="setInfo.apass" type="password" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <el-row :gutter="200">
            <el-col :span="24">
              <el-form-item prop="newPassword" label="新密码：" required="true">
                <el-input v-model="setInfo.newPassword" type="password" placeholder="请输入新密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="200">
            <el-col :span="24">
              <el-form-item prop="rNewPassword" label="请确认：" required="true">
                <el-input v-model="setInfo.rNewPassword" type="password" placeholder="请确认新密码"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="btns">
            <el-button type="primary" @click="setNewPassword">提交</el-button>
            <el-button type="info" style="margin-left: 30px" @click="resetSetPassForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SetPassword',
  data () {
    return {
      setInfo: {
        aname: sessionStorage.getItem('AdminName'),
        apass: sessionStorage.getItem('AdminPassword'),
        newPassword: '',
        rNewPassword: ''
      },
      setPasswordFormRules: {
        // 验证新密码是否合法
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        // 验证确认密码是否合法
        rNewPassword: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置按钮重置表单
    resetSetPassForm () {
      // 重置验证信息
      this.$refs.setPassFormRef.resetFields()
      // 重置修改密码填写信息
      this.setInfo.rNewPassword = ''
      this.setInfo.newPassword = ''
    },
    setNewPassword () {
      this.$refs.setPassFormRef.validate(valid => {
        if (!valid) return
        if (this.setInfo.newPassword !== '' && this.setInfo.rNewPasswordnewPassword !== '' && this.setInfo.newPassword === this.setInfo.rNewPassword) {
          // 发送请求重新修改密码
          this.$http.post('pass', this.$qs.stringify(this.setInfo))
            .then(response => {
              // 获取响应数据
              let result = response.data
              if (result.code !== '1') {
                return this.$message.error(result.msg)
              } else {
                this.$router.push({
                  path: '/login'
                })
                return this.$message.success(result.msg)
              }
            })
        } else {
          this.resetSetPassForm()
          alert('输入有误，请重新输入！')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-form-item__content {
    float: left;
    width: 50%;
  }
  .update_password{
    margin-left: 25%;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
</style>
