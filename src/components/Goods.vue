<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>在售商品管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 设置分割线 -->
    <el-divider></el-divider>
    <!-- 卡片视图区域:搜索部分 -->
    <el-form v-model="getGoodsQueryInfo">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-form-item label="商品名称：">
            <el-input placeholder="请输入商品名称" style="width: 400px" v-model="getGoodsQueryInfo.query"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="margin-left: 100px">
            <el-button type="primary" icon="el-icon-search" @click="getGoodsByLike">查询</el-button>
            <!-- <el-button type="primary" icon="el-icon-refresh" @click="getGoodsNoLike">重置</el-button> -->
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 设置分割线 -->
    <el-divider></el-divider>
    <!-- 卡片视图区域:列表部分 -->
    <el-button type="primary" icon="el-icon-refresh" style="margin-bottom: 15px" @click="getGoodsList">更新</el-button>
    <el-button type="primary" icon="el-icon-edit" style="margin-bottom: 15px" @click="updatePriceDiaogVisible=true">价格调整</el-button>
    <el-table
      :data="goodsList"
      border
      style="width: 100%">
      <el-table-column
        prop="goodid"
        label="商品编号"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="classid"
        label="商品类型编号"
        align="center"
        width="150px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="durability"
        label="保质期"
        align="center">
      </el-table-column>
      <el-table-column
        prop="place"
        label="产地"
        align="center">
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[1, 2, 4, 5, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <!-- 编辑新闻对话框 -->
    <el-dialog
      title="编辑商品价格信息"
      :visible.sync="updatePriceDiaogVisible"
      width="65%">
      <!-- 内容的主体区域 -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <i class="el-icon-s-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>商品价格信息管理</el-breadcrumb-item>
        <el-breadcrumb-item><b>编辑商品价格信息</b></el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-document"></i>
          <span> 商品价格信息</span>
        </div>
        <!-- 表单信息 -->
        <div style="margin-left: 3%">
          <el-form>
            <el-form-item label="商品类型编号：">
              <el-input style="width: 800px" v-model="updatePriceInfo.classid"></el-input>
            </el-form-item>
            <el-form-item label="价格：">
              <el-input style="width: 800px" v-model="updatePriceInfo.price"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
      <!-- 内容的底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="updatePriceDiaogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePrice()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Goods',
  data () {
    return {
      addGoodsForm: {
        name: '',
        price: '',
        date: ''
      },
      getGoodsQueryInfo: {
        query: '',
        pageSize: 10,
        pageNum: 1
      },
      updateGoodsInfo: {
        goodid: '',
        price: '',
        date: ''
      },
      updatePriceInfo: {
          classid: '',
          price: ''
      },
      GoodsById: {},
      total: 0,
      goodsList: [],
      // 控制编辑对话框显示与隐藏
      updateGoodsDialogVisible: false,
      updatePriceDiaogVisible: false
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    addGoods () {
      if (this.addGoodsForm.name !== '' && this.addGoodsForm.price !== '' && this.addGoodsForm.date !== '') {
        console.log(this.$qs.stringify(this.addGoodsForm).name)
        // 发送请求重新修改密码
        this.$http.post('addgoods', this.$qs.stringify(this.addGoodsForm))
          .then(response => {
         
            // 获取响应数据
            let result = response.data
            // console.log(response)
            if (result.code !== '1') {
              return this.$message.error(result.msg)
            }
            else {
              this.$router.push({
                path: '/goods'
              })
              this.addGoodsDialogVisible = false
              this.getGoodsList()
              console.log(result.msg)
              return this.$message.success(result.msg)
            }
          }
          )
      } else {
        alert('输入有误，请重新输入！')
      }
    },
    getGoodsList () {
      // 发送请求
      this.$http.post('showgoods', this.$qs.stringify(this.getGoodsQueryInfo))
        .then(response => {
          // 获取响应数据
          let result = response.data
          if (result === null) {
            return this.$message.error('获取学生列表失败!')
          } else {

            // 获取新闻列表成功
            this.pageNum = result.pageNum
            this.pageSize = result.pageSize
            this.goodsList = result.list
            console.log(this.goodsList)
            this.total = result.totalCount
            if (result.totalCount === 0) {
              return this.$message.warning('数据不存在，请更换查询条件！')
            }
          }
        })
    },
    updatePrice () {
      // 发送请求
      this.$http.post('updategoods', this.$qs.stringify(this.updatePriceInfo))
        .then(response => {
          // 获取响应数据
          let result = response.data
          if (result.code !== '1') {
            return this.$message.error(result.msg)
          } else {
            this.$router.push({
                path: '/goods'
              })
            this.updatePriceDiaogVisible = false
            this.getGoodsList()
            return this.$message.success(result.msg)
          }
        })
    },
    handleSizeChange (newSize) {
      this.getGoodsQueryInfo.pageSize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newSize) {
      this.getGoodsQueryInfo.pageNum = newSize
      this.getGoodsList()
    },
    getGoodsByLike (newQuery) {
      this.query = newQuery
      this.getGoodsList()
    },
    getGoodsNoLike () {
      this.getGoodsQueryInfo.query = ''
      this.getGoodsList()
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.el-form-item__content {
    float: left;
  }
  .el-pagination{
    margin-top: 15px;
  }
  ul li{
    list-style: none;
    width: 400px;
    height: 40px;
    line-height: 40px;
  }
</style>
