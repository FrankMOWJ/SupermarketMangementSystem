<template>
    <div>
      <span class="welcome">欢迎登录商品信息管理系统</span>
      <el-calendar v-model="value">
        <template
          slot="dateCell"
          slot-scope="{date, data}">
          <p :class="data.isSelected ? 'is-selected' : ''">
            {{ data.day.split('-').slice(2).join(' ') }} {{ data.isSelected ? '✔️' : ''}}
          </p>
        </template>
      </el-calendar>
      <!-- <img src="../assets/market.jpg" height="50%" width="100%" /> -->
    </div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      value: new Date()
    }
  }
}
</script>

<style lang="less" scoped>
  .welcome{
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 18px;
  }
  /*修改日历组件的高度*/
  /deep/.el-calendar-table .el-calendar-day {
    height: 75px;
  }
  .is-selected {
    color: #1989FA;
  }
</style>
