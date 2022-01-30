const express = require('express')
const fileUpload = require('express-fileupload')
const cors = require('cors')
// const fs = require('fs')

const app = express()
// 使用 express-fileupload 中间件
app.use(fileUpload())
app.use(cors())

// 处理由 /upload 页面发送过来的post请求
app.post('/add', (req, res) => {
  // console.log(1231321)
  // console.log(req.blob)
  // req 中的 files 属性由 express-fileupload 中间件添加!? (疑问暂存)
  // 判断 files 属性是否存在 和 是否有文件传来 若无返回400
  if (req.files === null) {
    return res.status(400).json({ msg: 'no file uploaded' })
  }
  // 否则 获取文件
  // file 由后文中 formData.append('file', file) 的第一个参数定义 可自定义为其他名称
  const file = req.files[Object.keys(req.files)[0]]
  const fileImg = req.files[Object.keys(req.files)[1]]
  const filemodle = req.files[Object.keys(req.files)[2]]
  // console.log(req.sfiles[Object.keys(req.files)[1]])
  // 移动文件到第一参数指定位置 若有错误 返回500
  try {
    file.mv(`public/${file.name}`, err => {
      if (err) {
        return new Error(err)
      }
    })
    fileImg.mv(`public/${fileImg.name}`, err => {
      if (err) {
        return new Error(err)
      }
    })
    filemodle.mv(`public/${filemodle.name}`, err => {
      if (err) {
        return new Error(err)
      }
    })
    res.json({ fileName: 'kita.mind', filePath: 'public/kita.mind' })
  } catch {
    return res.status(500).send('出錯了！！！！')
  }
})

app.listen(5000, () => { console.log('Server started...') })
