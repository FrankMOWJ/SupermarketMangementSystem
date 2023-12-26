<template>
   <div>
     <!-- 面包屑导航区域 -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ path: '/' }">
         <i class="el-icon-s-home"></i>首页
       </el-breadcrumb-item>
       <el-breadcrumb-item>查看个人信息</el-breadcrumb-item>
     </el-breadcrumb>
     <!-- 设置分割线 -->
     <el-divider></el-divider>
     <el-card class="box-card">
       <div slot="header" class="clearfix">
         <i class="el-icon-date"></i>
         <span> 管理员信息</span>
       </div>
       <div style="margin-top: 25px;width: 300px;float: left;margin-left: 10%">
         <img src="../assets/info.png"/>
       </div>
       <div class="info">
         <el-table
           :data="adminList"
           border
           style="width: 800px">
           <el-table-column
             prop="name"
             label="登录名字"
             align="center"
             width="100px">
           </el-table-column>
           <el-table-column
             prop="password"
             label="登录密码"
             align="center"
             v-if="show">
           </el-table-column>
           <el-table-column
             prop="adminStatus1"
             label="操作"
             align="center"
             width="200px">
             <template>
               <el-button type="danger" icon="el-icon-zoom-in" size="mini" @click="show = true">显示</el-button>
               <el-button type="success" icon="el-icon-zoom-out" size="mini" @click="show = false">隐藏</el-button>
             </template>
           </el-table-column>
         </el-table>
       </div>
     </el-card>
   </div>
</template>

<script>
export default {
  name: 'Info',
  data () {
    return {
      queryInfo: {
        aname: sessionStorage.getItem('AdminName'),
        apass: sessionStorage.getItem('AdminPassword')
      },
      adminList: [],
      show: false
    }
  },
  created () {
    this.getAdminInfos()
  },
  methods: {
    getAdminInfos () {
      // this.$qs.stringify(this.queryInfo)：作用是将表单数据转换为字符串进行传递
      this.$http.post('info', this.$qs.stringify(this.queryInfo))
        .then(response => {
          // 获取响应数据
          let result = response.data
          if (result.code !== '1') {
            return this.$message.error(result.msg)
          }
          console.log(result.list)
          this.adminList = result.list
          console.log(this.adminList)
          // return this.$message.success('1')
        })
    }
  }
}
</script>

<style lang="less" scoped>
  .info{
    width: 500px;
    height: 300px;
    float: left;
    margin-left: 8%;
    margin-top: 10%;
  }
  img{
    background-color: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    width: 300px;
    height: 300px;
  }
</style>
