<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <i class="el-icon-s-home"></i>首页
        </el-breadcrumb-item>
        <el-breadcrumb-item>销售信息管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <!-- 卡片视图区域:搜索部分 -->
      <el-form v-model="getSaleQueryInfo">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-form-item label="商品名称：">
              <el-input placeholder="请输入商品名称" style="width: 400px" v-model="getSaleQueryInfo.query"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item style="margin-left: 100px">
              <el-button type="primary" icon="el-icon-search" @click="getSaleByLike">查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 设置分割线 -->
      <el-divider></el-divider>
      <!-- 卡片视图区域:列表部分 -->
      <el-button type="primary" icon="el-icon-minus" style="margin-bottom: 15px" @click="addSaleDialogVisible = true">出售</el-button>
      <el-table
        :data="saleList"
        border
        style="width: 100%">
        <el-table-column
          prop="saleid"
          label="销售编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="goodid"
          label="商品编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="商品名称"
          align="center"
          width="300px">
        </el-table-column>
        <el-table-column
          prop="price"
          label="出售价格"
          align="center">
        </el-table-column>
        <el-table-column
          prop="personid"
          label="操作者编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="date"
          label="出货日期"
          align="center">
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          width="265px"
          align="center">
          <template slot-scope="saleList">
            <el-button type="primary" icon="el-icon-view" size="mini" @click="getSaleById(saleList.row.saleid)">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSaleById(saleList.row.saleid)">删除</el-button>
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
      <!-- 销售对话框 -->
      <el-dialog
        title="销售"
        :visible.sync="addSaleDialogVisible"
        width="65%">
        <!-- 内容的主体区域 -->
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/home' }">
            <i class="el-icon-s-home"></i>首页
          </el-breadcrumb-item>
          <el-breadcrumb-item>销售信息管理</el-breadcrumb-item>
          <el-breadcrumb-item><b>出售登记</b></el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 设置分割线 -->
        <el-divider></el-divider>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <i class="el-icon-document"></i>
            <span> 销售信息</span>
          </div>
          <!-- 表单信息 -->
          <div style="margin-left: 5%">
            <el-form :model="addSaleForm" :rules="addSaleFormRules">
              <!-- <el-form-item label="商品类型编号：" required="true" prop="classid">
                <el-input style="width: 600px" v-model="addSaleForm.classid"></el-input>
              </el-form-item> -->
              <el-form-item label="商品编号：" required="true" prop="goodid">
                <el-input style="width: 600px" v-model="addSaleForm.goodid"></el-input>
              </el-form-item>
              <!-- <el-form-item label="销售编号：" required="true" prop="saleid">
                <el-input style="width: 600px" v-model="addSaleForm.saleid"></el-input>
              </el-form-item> -->
            </el-form>
          </div>
        </el-card>
        <!-- 内容的底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addSaleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSale()">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sale',
    data () {
      return {
        addSaleForm: {
          // classid:'',
          goodid: '',
          // saleid: '',
          personname:sessionStorage.getItem('AdminName')
        },
        getSaleQueryInfo: {
          query: '',
          pageSize: 10,
          pageNum: 1
        },
        // getSaleByIdInfo: {
        //   saleid: ''
        // },
        // updateSaleInfo: {
        //   saleid: '',
        //   // name: '',
        //   number: ''
        // },
        // deleteSaleByIdInfo: {
        //   saleid: ''
        // },
        addSaleFormRules: {
        // 验证商品编号是否合法
          // classid: [
          //   { required: true, message: '请输入8位的商品类型编号', trigger: 'blur' },
          //   { pattern:/^[0-9]{8}$/, message: '请输入8位数字', trigger: 'blur' },
          // ],
        // 验证名称是否合法
          goodid: [
            { required: true, message: '请输入14位的商品编号', trigger: 'blur' },
            { pattern:/^[0-9]{14}$/, message: '请输入14位数字', trigger: 'blur' },
          ],
          // 验证id是否合法
          // saleid: [
          //   { required: true, message: '请输入销售编号', trigger: 'blur' },
          //   { pattern:/^[0-9]{14}$/, message: '请输入14位数字', trigger: 'blur' },

          // ]
        },
        SaleById: {},
        total: 0,
        saleList: [],
        // 控制添加对话框显示与隐藏
        addSaleDialogVisible: false,
        // 控制编辑对话框显示与隐藏
        updateSaleDialogVisible: false
      }
    },
    created () {
      this.getsaleList()
    },
    methods: {
      addSale () {
        if (this.addSaleForm.goodid !== '') {
          // 发送请求重新修改密码
          this.$http.post('delgoods', this.$qs.stringify(this.addSaleForm))
            .then(response => {
              // 获取响应数据
              let result = response.data
              if (result.code !== '1') {
                return this.$message.error(result.msg)
              } else {
                this.$router.push({
                  path: '/sale'
                })
                this.addSaleDialogVisible = false
                this.getsaleList()
                if (result.msg == '当前商品库存较少，请及时补货。') {
                  return this.$message.warning(result.msg)
                }
                else {
                  return this.$message.success(result.msg)
                }
                
              }
            }).catch((err) => {
            // console.log(err)
            alert('出货失败！出错原因：商品编号不存在')
         })
        } else {
          alert('输入有误，请重新输入！')
        }
      },
      getsaleList () {
        // 发送请求
        this.$http.post('showsale', this.$qs.stringify(this.getSaleQueryInfo))
          .then(response => {
            // 获取响应数据
            let result = response.data
            if (result === null) {
              return this.$message.error('获取库存列表失败!')
            } else {
              // 获取新闻列表成功
              this.pageNum = result.pageNum
              this.pageSize = result.pageSize
              this.saleList = result.list
              this.total = result.totalCount
              if (result.totalCount === 0) {
                return this.$message.warning('数据不存在，请更换查询条件！')
              }
              if (this.getSaleQueryInfo.query != '') {
                return this.$message.success('查询成功！')
              }
            }
          })
      },
      // getSaleById (saleid) {
      //   this.getSaleByIdInfo.saleid = saleid
      //   // 发送请求
      //   this.$http.post('getSaleById', this.$qs.stringify(this.getSaleByIdInfo))
      //     .then(response => {
      //       // 获取响应数据
      //       let result = response.data
      //       console.log(result)
      //       if (result === null) {
      //         return this.$message.error('根据ID获取库存信息失败!')
      //       } else {
      //         this.updateSaleDialogVisible = true
      //         this.SaleById = result
      //       }
      //     })
      // },
      // deleteSaleById (saleid) {
      //   this.deleteSaleByIdInfo.saleid = saleid
      //   if (confirm('确定要删除吗?')) {
      //     // 发送请求
      //     this.$http.post('deleteSaleById', this.$qs.stringify(this.deleteSaleByIdInfo))
      //       .then(response => {
      //         // 获取响应数据
      //         let result = response.data
      //         console.log(result)
      //         if (result === null) {
      //           return this.$message.error('删除记录失败!')
      //         } else {
      //           this.getSaleQueryInfo.pageNum = 1
      //           this.getsaleList()
      //           this.$message.success('删除记录成功!')
      //         }
      //       })
      //     return true
      //   } else {
      //     return false
      //   }
      // },
      // updateSale () {
      //   this.updateSaleInfo.saleid = this.getSaleByIdInfo.saleid
      //   // this.updateSaleInfo.name = this.SaleById.name
      //   // this.updateSaleInfo.ca = this.SaleById.category
      //   this.updateSaleInfo.number = this.SaleById.number
      //   // 发送请求
      //   this.$http.post('updateSale', this.$qs.stringify(this.updateSaleInfo))
      //     .then(response => {
      //       // 获取响应数据
      //       let result = response.data
      //       if (result.code !== '1') {
      //         return this.$message.error(result.msg)
      //       } else {
      //         this.updateSaleDialogVisible = false
      //         this.getsaleList()
      //         return this.$message.success(result.msg)
      //       }
      //     })
      // },
      handleSizeChange (Newsize) {
        this.getSaleQueryInfo.pageSize = Newsize
        this.getsaleList()
      },
      handleCurrentChange (Newsize) {
        this.getSaleQueryInfo.pageNum = Newsize
        this.getsaleList()
      },
      getSaleByLike (newQuery) {
        this.query = newQuery
        this.getsaleList()
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
  