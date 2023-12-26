<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" style="width: 170px;height: 150px;margin-left: 28px;margin-top: 10px" />
        <span style="margin-left: 30px">超市库存管理系统</span>
      </div>
      <div>
        <el-button type="info">
          <i class="el-icon-s-custom"></i>
          {{ adminName }}
        </el-button>
        <el-button type="info" @click="logout">
          <i class="el-icon-s-promotion"></i>
          退出
        </el-button>
      </div>
    </el-header>
    <!-- 主体区域 -->
    <el-container>
      <!-- 左侧边栏-->
      <el-aside width="200px">
        <el-menu background-color="#fff" text-color="#000" active-text-color="#409EFF" router default-active="/home">
          <el-menu-item index="/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/info">
            <i class="el-icon-help"></i>
            <span slot="title">查看个人信息</span>
          </el-menu-item>
          <el-menu-item index="/setPassword">
            <i class="el-icon-edit"></i>
            <span slot="title">修改登录密码</span>
          </el-menu-item>
          <el-menu-item index="/admin">
            <i class="el-icon-user"></i>
            <span slot="title">用户信息管理</span>
          </el-menu-item>
          <el-menu-item index="/goods">
            <i class="el-icon-files"></i>
            <span slot="title">在售商品管理</span>
          </el-menu-item>
          <el-menu-item index="/sale">
            <i class="el-icon-truck"></i>
            <span slot="title">出售信息管理</span>
          </el-menu-item>
          <el-menu-item index="/purchase">
            <i class="el-icon-box"></i>
            <span slot="title">进货信息管理</span>
          </el-menu-item>
          <el-menu-item index="/inventory">
            <i class="el-icon-box"></i>
            <span slot="title">库存信息管理</span>
          </el-menu-item>
          <!-- <el-menu-item index="/stockchart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">库存统计图</span>
          </el-menu-item> -->
          <!-- <el-menu-item index="/adv">
            <i class="el-icon-coordinate"></i>
            <span slot="title">贪吃蛇大作战</span>
          </el-menu-item> -->
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: 'Home',
    data() {
      return {
        adminName: sessionStorage.getItem('AdminName')
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    }
  }
</script>

<!-- 路由占位符 -->
<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #0665d0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding-left: 0;
    font-size: 20px;
    font-family: "微软雅黑";

    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }

    img {
      width: 100px;
      height: 100px;
    }
  }

  .el-aside {
    background-color: #e1effe;
    font-family: "微软雅黑";
      display: inline-block;
      padding: .5rem .625rem;
      margin: 2px 0;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .el-button {
    color: #1c242c;
    background-color: #f2f6fc;
    border: none;
    font-size: 14px;

    &:hover {
      color: #2483ff;
      background-color: rgb(242, 246, 252);
    }

    &:active {
      color: #2483ff;
      background-color: rgb(242, 246, 252);
    }
  }
</style>
