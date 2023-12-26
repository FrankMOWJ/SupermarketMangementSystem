<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">
        <i class="el-icon-s-home"></i>首页
      </el-breadcrumb-item>
      <el-breadcrumb-item>进货信息管理</el-breadcrumb-item>
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
    <el-button type="primary" icon="el-icon-plus" style="margin-bottom: 15px" @click="addStockDialogVisible = true">进货</el-button>
    <el-table
      :data="stockList"
      border
      style="width: 100%">
      <el-table-column
        prop="purchaseid"
        label="编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        align="center"
        width="300px">
      </el-table-column>
      <el-table-column
        prop="number"
        label="进货数量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="price"
        label="进货价格"
        align="center">
      </el-table-column>
      <el-table-column
        prop="personid"
        label="操作者编号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="date"
        label="进货日期"
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
    <!-- 进货对话框 -->
    <el-dialog
      title="进货"
      :visible.sync="addStockDialogVisible"
      width="65%">
      <!-- 内容的主体区域 -->
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <i class="el-icon-s-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>库存信息管理</el-breadcrumb-item>
        <el-breadcrumb-item><b>进货登记</b></el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <i class="el-icon-document"></i>
          <span> 货物信息</span>
        </div>
        <!-- 表单信息 -->
        <div style="margin-left: 5%">
          <el-form :model="addStockForm" :rules="addStockFormRules">
            <!-- <el-form-item label="商品名称：" required="true" prop="name">
              <el-input style="width: 600px" v-model="addStockForm.name"></el-input>
            </el-form-item> -->
            <el-form-item label="商品类型编号：" required="true" prop="classid">
              <el-input style="width: 600px" v-model="addStockForm.classid"></el-input>
            </el-form-item>
            <el-form-item label="保质期：" required="true">
              <el-input style="width: 600px" v-model="addStockForm.durability"></el-input>
            </el-form-item>
            <el-form-item label="进货价格：" required="true" prop="purchaseprice">
              <el-input style="width: 600px" v-model="addStockForm.purchaseprice"></el-input>
            </el-form-item>
            <el-form-item label="进货数量：" required="true" prop="number">
              <el-input style="width: 600px" v-model="addStockForm.number"></el-input>
            </el-form-item>
            <!-- <el-form-item label="批次编号：" required="true" prop="purchaseid">
              <el-input style="width: 600px" v-model="addStockForm.purchaseid"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </el-card>
      <!-- 内容的底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStockDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addStock()">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'purchase',
  data () {
    return {
      addStockForm: {
        classid: '',
        number: '',
        durability: '',
        purchaseprice: '',
        personname:sessionStorage.getItem('AdminName'),
      },
      getStockQueryInfo: {
        query: '',
        pageSize: 10,
        pageNum: 1
      },
      addStockFormRules: {
        // 验证名称是否合法
          // name: [
          //   { required: true, message: '请输入商品名称', trigger: 'blur' },
          // ],
          // 验证id是否合法
          // id: [
          //   { required: true, message: '请输入批次编号', trigger: 'blur' },
          //   { pattern:/^[0-9]{14}$/, message: '请输入14位数字', trigger: 'blur' },

          // ],
          // 验证价格是否合法
          purchaseprice: [
            { required: true, message: '请输入进货价格', trigger: 'blur' },
            { pattern:/^[0-9]+([.][0-9]{1,2})?$/, message: '请输入不超过两位小数的数字', trigger: 'blur' },
          ],
          // 验证产品类型编号是否合法
          classid:[
            { required: true, message: '请输入产品类型编号', trigger: 'blur' },
            { pattern:/^[0-9]{8}$/, message: '请输入8位数字', trigger: 'blur' },
          ],
          // 验证进货数量是否合法
          number:[
            { required: true, message: '请输入进货数量', trigger: 'blur' },
            { pattern:/^\+?[1-9]\d*$/, message: '请输入大于0的整数', trigger: 'blur' },
          ]
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
    addStock () {
      if (this.addStockForm.classid !== '' &&  this.addStockForm.number !== ''
      && this.addStockForm.purchaseprice !== '' && this.addStockForm.durability != '') {
        // 发送请求重新修改密码
        this.$http.post('addgoods', this.$qs.stringify(this.addStockForm))
          .then(response => {
            // 获取响应数据
            let result = response.data
            if (result.code !== '1') {
              return this.$message.error(result.msg)
            } else {
              this.$router.push({
                path: '/purchase'
              })
              this.addStockDialogVisible = false
              this.getstockList()
              return this.$message.success(result.msg)
            }
          }).catch((err) => {
            // console.log(err)
            alert('进货失败！出错原因：',err)
         }) 
      } else {
        alert('输入有误，请重新输入！')
      }
    },
    getstockList () {
      // 发送请求
      this.$http.post('showpurchase', this.$qs.stringify(this.getStockQueryInfo))
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
            this.total = result.totalCount
            // console.log(result.list)
            if (result.totalCount === 0) {
              return this.$message.warning('数据不存在，请更换查询条件！')
            }
            if (this.getStockQueryInfo.query != '') {
              return this.$message.success('查询成功！')
            }
           
          }
        })
    },
    // getStockById (purchaseid) {
    //   this.getStockByIdInfo.purchaseid = purchaseid
    //   // 发送请求
    //   this.$http.post('getStockById', this.$qs.stringify(this.getStockByIdInfo))
    //     .then(response => {
    //       // 获取响应数据
    //       let result = response.data
    //       console.log(result)
    //       if (result === null) {
    //         return this.$message.error('根据ID获取库存信息失败!')
    //       } else {
    //         this.updateStockDialogVisible = true
    //         this.StockById = result
    //       }
    //     })
    // },
    // deleteStockById (purchaseid) {
    //   this.deleteStockByIdInfo.purchaseid = purchaseid
    //   if (confirm('确定要删除吗?')) {
    //     // 发送请求
    //     this.$http.post('deleteStockById', this.$qs.stringify(this.deleteStockByIdInfo))
    //       .then(response => {
    //         // 获取响应数据
    //         let result = response.data
    //         console.log(result)
    //         if (result === null) {
    //           return this.$message.error('删除记录失败!')
    //         } else {
    //           this.getStockQueryInfo.pageNum = 1
    //           this.getstockList()
    //           this.$message.success('删除记录成功!')
    //         }
    //       })
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    // updateStock () {
    //   this.updateStockInfo.purchaseid = this.getStockByIdInfo.purchaseid
    //   // this.updateStockInfo.name = this.StockById.name
    //   // this.updateStockInfo.ca = this.StockById.category
    //   this.updateStockInfo.number = this.StockById.number
    //   // 发送请求
    //   this.$http.post('updateStock', this.$qs.stringify(this.updateStockInfo))
    //     .then(response => {
    //       // 获取响应数据
    //       let result = response.data
    //       if (result.code !== '1') {
    //         return this.$message.error(result.msg)
    //       } else {
    //         this.updateStockDialogVisible = false
    //         this.getstockList()
    //         return this.$message.success(result.msg)
    //       }
    //     })
    // },
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
