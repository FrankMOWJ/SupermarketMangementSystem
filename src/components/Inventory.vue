<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <i class="el-icon-s-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <!-- 卡片视图区域:搜索部分 -->
      <el-form v-model="getStockQueryInfo">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="商品名称：">
              <el-input placeholder="请输入商品名称" style="width: 400px" v-model="getStockQueryInfo.query"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="margin-left: 100px">
              <el-button type="primary" icon="el-icon-search" @click="getStockByLike">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <!-- 卡片视图区域:列表部分 -->
      <!-- <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 15px" @click="addStockDialogVisible = true">进货</el-button> -->
      <el-table
        :data="stockList"
        border
        style="width: 100%">
        <el-table-column
          prop="classid"
          label="商品类型编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
          width="300px">
        </el-table-column>
        <el-table-column
          prop="place"
          label="商品产地"
          align="center"
          width="300px">
        </el-table-column>
        <el-table-column
          prop="number"
          label="库存数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="warning"
          label="备注"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="265px"
          align="center">
          <template slot-scope="stockList">
            <el-button type="primary" icon="el-icon-view" size="mini" @click="getStockById(stockList.row.purchaseid)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteStockById(stockList.row.purchaseid)">删除</el-button>
          </template>
        </el-table-column> -->
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
    </div>
      
  </template>
  
  <script>
  export default {
    name: 'Stock',
    data () {
      return {
        getStockQueryInfo: {
          query: '',
          pageSize: 10,
          pageNum: 1
        },
        // getStockByIdInfo: {
        //   purchaseid: ''
        // },
        // updateStockInfo: {
        //   purchaseid: '',
        //   // name: '',
        //   number: ''
        // },
        // deleteStockByIdInfo: {
        //   purchaseid: ''
        // },
        StockById: {},
        total: 0,
        stockList: [],
        // 控制添加对话框显示与隐藏
        addStockDialogVisible: false,
        // 控制编辑对话框显示与隐藏
        updateStockDialogVisible: false
      }
    },
    created () {
      this.getstockList()
    },
    methods: {
      getstockList () {
        // 发送请求
        this.$http.post('showstock', this.$qs.stringify(this.getStockQueryInfo))
          .then(response => {
            // 获取响应数据
            let result = response.data
            if (result === null) {
              return this.$message.error('获取库存列表失败!')
            } else {
              // 获取新闻列表成功
              this.pageNum = result.pageNum
              this.pageSize = result.pageSize
              this.stockList = result.list
              for (let i = 0; i < this.stockList.length; i++) {
                if (this.stockList[i].number < 5) {
                  // 向对象中添加属性 warning
                  this.stockList[i].warning = '库存不足，请及时补货';
                }
              }
              console.log(this.stockList)
              this.total = result.totalCount
              if (result.totalCount === 0) {
                return this.$message.warning('数据不存在，请更换查询条件！')
              }
              if (this.getStockQueryInfo.query != '') {
                return this.$message.success('查询成功！')
              }
            }
          })
      },
      handleSizeChange (Newsize) {
        this.getStockQueryInfo.pageSize = Newsize
        this.getstockList()
      },
      handleCurrentChange (Newsize) {
        this.getStockQueryInfo.pageNum = Newsize
        this.getstockList()
      },
      getStockByLike (newQuery) {
        this.query = newQuery
        this.getstockList()
      },
      getStockNoLike () {
        this.getStockQueryInfo.query = ''
        this.getstockList()
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
  