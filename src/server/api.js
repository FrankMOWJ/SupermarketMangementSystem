var db = require('./db');
var express = require('express');
var router = express.Router();
const pgsql = require('pg');
// var $sql = require('../../sqlset.sql');

//创建数据池实例
let conn = new pgsql.Pool(db.pgsql);

//数据池连接
conn.connect();

var listJsonWrite = function (res, ret, params) {
  res.json({
    list:ret.rows.slice(params.pageSize*(params.pageNum-1), params.pageSize*params.pageNum),
    totalCount:ret.rows.length,
    pageSize: params.pageSize,
    pageNum: params.pageNum,
  });
}


var jsonWrite = function (res, ret) {
  if (typeof ret == 'undefined') {
      res.json({
      code: '2',
      msg: '操作失败'
      });
  } else {
      res.json({
      code: '1',
      msg: '操作成功'
      });
  }
};

// ------------------- 辅助函数 --------------------------------------
//获取当前日期函数
function getNowFormatDate() {
  let date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)
  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
 
  return `${year}${month}${strDate}`
}

function getDate() {
  let date = new Date(),
    year = date.getFullYear(), //获取完整的年份(4位)
    month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
    strDate = date.getDate() // 获取当前日(1-31)
  if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
  if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0
 
  return `${year}-${month}-${strDate}`
}

function getTimestamp() {
  const currentDate = new Date();
  // 设置北京时间的时区偏移量为+8小时
  const offset = 8 * 60; // 北京时间偏移量，单位是分钟
  const beijingTime = new Date(currentDate + offset * 60000); // 计算北京时间
  // 转换成 PostgreSQL timestamp 格式（YYYY-MM-DD HH:MI:SS）
  const formattedDate = beijingTime.toISOString().replace('T', ' ').replace(/\.\d+/, '');
  return formattedDate
}

function padWithZero(number, length) {
  let str = String(number); // 将数字转换为字符串
  while (str.length < length) {
    str = '0' + str; // 在字符串前面添加零
  }
  return str;
}
// -------------------------------------------------------------

// 增加用户接口
// console.log(router);

router.post('/', function(req, res, next){
  res.send('响应成功')
})


// ----------------------- login api ---------------------------
router.post('/login', (req, res) => {
  var params = req.body;
  console.log(params.username);
  var sql = `select personid, name, password from users where name = '${params.username}'`;
  console.log(params.password);
  var personid = null
  //conn.query(sql, [params.username, params.age], function (err, result)
  conn.query(sql, function (err, result) {
    if (err) {
      console.log('somthing wrong with login')
      console.log(err);
    }
    if (result) {
      if (typeof result.rows[0] === 'undefined' || result.rows[0].password != params.password) {
        res.json({
          code: '2',
          msg: '用户名或密码错误，请重新输入！'
        });
      } else {
        personid = result.rows[0].personid
        if (personid == null) {
          console.log('personid is null')
        }
        // 记录登录信息
        const formattedDate = getTimestamp()
        console.log(formattedDate); // 输出格式如：'2023-12-23 15:30:00'
        sql = `insert into login values('${formattedDate}'::timestamp, '${personid}');`
        conn.query(sql, function (err, result) {
          if (err) {
            console.log(err);
          }
          if (result) {
            console.log('successfullt insert into login')
          }
        })
        res.json({
          code: '1',
          msg: '欢迎登陆！'
        });
      }
    }
  })
  
});

// -------------------- 管理员 api -----------------------------
// 添加管理员
router.post('/adduser', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = 'select max(personid) from users'
  conn.query(sql, function (err, result) {
    if (err) {
    console.log(err);
    }
    if (result) {
      var personid = JSON.stringify(result.rows[0]).substring(8,16);
      console.log(personid)
      personid = (Number(personid)+1).toString().padStart(8,'0');
      console.log(personid)
      var sql = `insert into users values('${personid}','${params.name}', '${params.password}')`
      conn.query(sql, function (err, result) {
          if (err) {
            if (err.constraint == 'users_name_key') {
              res.json({code: '3', msg: '该用户名已存在！'})
            }
            else{
              console.log(err)
            }
          }
          if (result) {
          // console.log(req)
          jsonWrite(res, result);
          }
      })
    }
  })
});

// 展示管理员信息
router.post('/showuser', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `select * from users`
  if(params.query != ''){
      sql = `select * from users where name='${params.query}'`
  }
  console.log(sql)
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result)
      listJsonWrite(res, result, params);
    }
  })
});

router.post('/getAdminById', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `select * from users where personid='${params.personid}'`
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result.rows[0])
      res.json(result.rows[0])
    }
  })
});

// 删除管理员信息
router.post('/deluser', (req, res) => {
  console.log(req.body)
  var params = req.body;
  if (params.personid != '00000001'){
    var sql = `delete from users where personid='${params.personid}'`
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        console.log(result.rows[0])
        res.json(result.rows[0])
      }
    })
  } else{
    res.json(null);
  }
});

// 更新管理员信息（password）
router.post('/updateuser', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `update users set password='${params.password}' where name='${params.name}'`
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

// 我也不知道要干嘛
router.post('/info', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `select * from users where name='${params.aname}' and password='${params.apass}'`
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log(result)
      res.json({code: '1', list: result.rows})
    }
  })
});

// 设置密码（会不会跟updateuser重合？）
router.post('/pass', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `update users set password='${params.newPassword}' where name='${params.aname}'`
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

// ------------------------ 进货 api-------------------------------
router.post('/addgoods', (req, res) => {
  console.log(req.body)
  var params = req.body;
  // ---------------------- 获取当前最大的进货编号------------------
  var sql = `select max(purchaseid) from purchase`
  var maxpurchaseid = null;
  var curpurchaseid = null;
  var name = null;
  var produceplace = null;
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      // console.log('purchase result:', result)
      maxpurchaseid = result.rows[0].max;
      if (maxpurchaseid == null) {
        maxpurchaseid = '00000000000000';
      }
      let num = parseInt(maxpurchaseid);
      curpurchaseid = padWithZero(num+1, 14);
    }
  });
  console.log('maxpurchaseid:', maxpurchaseid)
  console.log('curpurchaseid:', curpurchaseid)

  // ---- --------------- 获取goodid --------------------------------
  const formattedTime = getNowFormatDate()
  sql = `select name, place from stock where classid ='${params.classid}'`
  conn.query(sql, function(err, result){
    if (err){
      console.log(err)
    }
    // console.log(result.rows[0]==null)
    if(result.rows[0] == null){
      res.json({code: '3', msg: '该商品类别不存在！'})
    }
    else{
      name = result.rows[0].name;
      produceplace = result.rows[0].place;
      // 增加入货管理员信息
      sql = `select personid from users where name = '${params.personname}' `;
      console.log(params.personname)
      var personid = null;
      conn.query(sql, function(err, result) {
        if (err) {
          console.log(err)
        }
        if (result) {
          personid = result.rows[0];
          console.log('personid', personid.personid)
          // 插入purchase表
          const date = getTimestamp()
          console.log('date:', date);
          sql = `insert into purchase values('${curpurchaseid}', '${personid.personid}', '${params.classid}', '${params.purchaseprice}', ${params.number}, '${date}')`;
          conn.query(sql, function(err, result) {
            if (err) {
              console.log(err)
            }
            console.log(result)
            if (typeof result == 'undefined') {
              res.json({
              code: '2',
              msg: '该单号已存在'
              });
            } else {

              res.json({
              code: '1',
              msg: '操作成功'
              });

              // ----------------------获得当前最大的goodid------------------------ 
              var sql = 'select max(goodid) from item'
              var gid = null

              conn.query(sql, function (err, result) {
                if (err) {
                  console.log(err);
                }
                gid = JSON.stringify(result.rows[0]).substring(8,22);
                console.log(gid)
                // console.log(gid)
                var formatid =  `${formattedTime}000001`
                if(gid != null){
                  
                  var lasttime = gid.substring(0,8)
                  var lastnum = gid.substring(8)
                  if(formattedTime == lasttime){
                    lastnum = (Number(lastnum)+1).toString().padStart(6,'0')
                    formatid = `${formattedTime}${lastnum}`
                  }
                }
                var curgoodid = formatid
                // 插入item表
                for (let i = 0; i < params.number; i++) {
                  sql = `insert into item values('${curgoodid}', '${params.classid}', '${params.durability}', '${produceplace}', ${params.purchaseprice})`;
                  conn.query(sql, function (err, result) {
                    if (err) {
                      console.log(err);
                    }
                    if (result) {
                      console.log(result)
                      // jsonWrite(res, result);
                    }
                  })
                  // 更新curgoodid
                  var lasttime = curgoodid.substring(0,8)
                  var lastnum = curgoodid.substring(8)
                  lastnum = (Number(lastnum)+1).toString().padStart(6,'0')
                  curgoodid = `${formattedTime}${lastnum}`
                }
              })
            }
          })
        }
      })

    }
  })
});

router.post('/showpurchase', (req, res) => {
  console.log(req.body)
  var params = req.body;
  // 获取时间
  var sql = `select purchaseid, name, purchase.number, price, personid, date from purchase join stock on purchase.classid = stock.classid`
  if(params.query != ''){
      sql = `select purchaseid, name, purchase.number, price, personid, date from purchase join stock on purchase.classid = stock.classid where name = '${params.query}'`
  }

  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      console.log('date:', result.rows[0].date)
      // for(let i=0; i<result.rows.length; i++) {
      //   result.rows[i].date = result.rows[i].date.toISOString().substring(0, 10)
      // }
      // console.log(result)
      listJsonWrite(res, result, params);
    }
  })
});

//------------------------ 出货 api ----------------------------------
// 展示出货记录
router.post('/showsale', (req, res) => {
  console.log(req.body)
  var params = req.body;
  // 获取时间
  var sql = `select saleid, goodid, name, price, date, personid from sale join stock on sale.classid = stock.classid`
  if(params.query != ''){
      sql = `select saleid, goodid, name, price, date, personid from sale join stock on sale.classid = stock.classid where name = '${params.query}'`;
  }

  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      // for(let i=0; i<result.rows.length; i++) {
      //   result.rows[i].date = result.rows[i].date.toISOString().substring(0, 10)
      // }
      // console.log('again date:', result.rows[0].date)
      listJsonWrite(res, result, params);
    }
  })
});

// 出货
router.post('/delgoods', (req, res) => {
  // 获取时间
  const formattedTime = getNowFormatDate()
  console.log(req.body)
  var params = req.body;
  // -------------------- 获取当前最大出货编号------------------
  sql = `select max(saleid) from sale`
  var maxsaleid = null;
  var cursaleid = null;
  conn.query(sql, function(err, result) {
    if (err) {
      console.log(err)
    }
    // console.log('result:', result)
    maxsaleid = result.rows[0].max;
    if (maxsaleid == null) {
      maxsaleid = '00000000000000';
    }
    let num = parseInt(maxsaleid);
    cursaleid = padWithZero(num+1, 14);
    console.log('maxsaleid:', maxsaleid);
    console.log('cursaleid:', cursaleid);
  });
  
  // -----------------------------------------------------------
  var price = -1
  if (params.goodid != ''){
    var sql = `select price, classid from item where goodid ='${params.goodid}'`
    // 查询当前商品价格
    conn.query(sql, function (err, result) {
      if (result.rows[0] == null) {
        res.json({code:'2', msg: '没有找到该商品编号'})
        return;
      }
      // console.log('result', result.rows[0])
      // console.log('result:', result)
      price = result.rows[0].price;
      classid = result.rows[0].classid;
      // console.log('price', price)
      if (price >  0) {
        // 增加入货管理员信息
        // console.log('recording sale')
        sql = `select personid from users where name = '${params.personname}' `;
        console.log(params.personname)
        var personid = null
        conn.query(sql, function(err, result) {
          if (err) {
            console.log(err)
          }
          if (result) {
            personid = result.rows[0].personid;
            console.log('personid', personid)
            // 增加sale表
            const date = getTimestamp()
            console.log('Date:', date)
            sql = `insert into sale values('${cursaleid}', '${classid}', '${params.goodid}', '${personid}', ${price}, '${date}')`;
            conn.query(sql, function (err, result) {
              console.log("结果：",result)
              if (err) {
                console.log('error happen')
                console.log(err);
              }
              // 处理插入操作失败
              if(typeof result == 'undefined'){
                res.json({code: '2',msg: '单号重复！'})
              }
              else{
                // 删除item表记录
                sql = `delete from item where goodid = '${params.goodid}'`
                conn.query(sql, function (err, result) {
                  if (err) {
                    console.log(err)
                  }
                  sql = `select number from stock where '${classid}' = stock.classid`
                  conn.query(sql, function(err, result){
                    if (err) {
                      console.log(err)
                    }
                    console.log(typeof result.rows[0].number)
                    if (result.rows[0].number < 5){
                      res.json({code: '1', msg: '当前商品库存较少，请及时补货。'})
                    }
                    else{
                      res.json({code: '1', msg: '操作成功！'})
                }
              })
            })
              }
            })
            
          }
        })
      }
    })
    
  } else{
    res.json(null);
  }

});

//------------------------ 在线商品展示 api----------------------------
router.post('/showgoods', (req, res) => {
  console.log(req.body)
  var params = req.body;
  // 获取时间
  var sql = `select goodid, item.classid, name, price, durability, item.place from item join stock on item.classid = stock.classid order by goodid;`
  if(params.query != ''){
      sql = `select goodid, item.classid, name, price, durability, item.place from item join stock on item.classid = stock.classid where name = '${params.query}' order by goodid`
  }
  
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      // console.log(req)
      for(let i=0; i<result.rows.length; i++) {
        result.rows[i].durability = result.rows[i].durability.toISOString().substring(0, 10)
      }
      listJsonWrite(res, result, params);
    }
  })
});


// ---------------------- 调整商品价格 api -----------------------------
router.post('/updategoods', (req, res) => {
  console.log(req.body)
  var params = req.body;
  var sql = `update item set price=${params.price} where classid='${params.classid}'`
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

// ------------------------ 库存展示api --------------------------------
router.post('/showstock', (req, res) => {
  console.log(req.body)
  var params = req.body;
  // 获取时间
  var sql = `select classid, name, place, number from stock`;
  if (params.query != '') {
    sql = `select classid, name, place, number from stock  where name = '${params.query}'`;
  }
  conn.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      listJsonWrite(res, result, params);
    }
  })
});

module.exports = router;



