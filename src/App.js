import React, { useState, useMemo, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import axios from 'axios'
// import arimage from './mindar-image.prod.js'
import 'mind-ar/dist/mindar-image.prod.js'
import 'aframe'
import 'aframe-extras'
import 'mind-ar/dist/mindar-image-aframe.prod.js'
import './App.css'
import MindARViewer from './mindar-viewer'
require('mind-ar')
const compiler = new window.MINDAR.IMAGE.Compiler()

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out'
}

const focusedStyle = {
  borderColor: '#2196f3'
}

const acceptStyle = {
  borderColor: '#00e676'
}

const rejectStyle = {
  borderColor: '#ff1744'
}

function App () {
  const [started, setStarted] = useState(false)
  // 訓練的mind文件
  const [files, setFiles] = useState([])
  // 顯示的圖片
  const [imgFile, setImgFile] = useState()
  // 顯示的圖片
  const [modleFile, setModleFile] = useState()
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject
  } = useDropzone({
    // accept: 'image/*',
    onDrop: acceptedFiles => {
      console.log(123)
      // 這裡只用第一張圖片
      setImgFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }))
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))])
    }
  })

  const {
    getRootProps: modleGetRootProps,
    getInputProps: modleGetInputProps
  } = useDropzone({
    // accept: 'image/*',
    onDrop: acceptedFiles => {
      console.log(456)
      setModleFile(Object.assign(acceptedFiles[0], { preview: URL.createObjectURL(acceptedFiles[0]) }))
    }
  })
  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ])

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview))
  }, [files])

  const loadImage = async (file) => {
    // const img = new window.Image()

    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = URL.createObjectURL(file)
      // img.src = src
    })
  }

  let exportedBuffer

  const start = async (files) => {
    const images = []
    for (let i = 0; i < files.length; i++) {
      images.push(await loadImage(files[i]))
    }
    console.log(images)
    const _start = new Date().getTime()
    // 訓練出來的圖像識別列表
    const dataList = await compiler.compileImageTargets(images, (progress) => {
      // 進度百分比
      document.getElementById('progress').innerHTML = 'progress: ' + progress.toFixed(2) + '%'
    })
    console.log(dataList)
    console.log('exec time compile: ', new Date().getTime() - _start)
    // for (let i = 0; i < dataList.length; i++) {
    //   showData(dataList[i])
    // }
    exportedBuffer = await compiler.exportData()
    // document.getElementById('downloadButton').addEventListener('click', function () {
    //   download(exportedBuffer)
    // })
  }

  const post = (buffer) => {
    var blob = new window.Blob([buffer])
    // mind文件
    var file = new window.File([blob], 'kita.mind')
    const param = new window.FormData()
    param.append('kita.mind', file)
    // 識別的圖片文件
    var img = new window.File([imgFile], 'kita.jpg')
    param.append('kita.jpg', img)
    // 識別的圖片文件
    var modle = new window.File([modleFile], 'kita.glb')
    param.append('kita.glb', modle)
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
    axios.post('http://localhost:5000/add', param, config).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  // 這是用來訓練出mind模型的方法
  // console.log(window.MINDAR)

  // const { getInputProps } = useDropzone({ onDrop })

  // const start = () => {
  // const files = myDropzone.files
  // if (files.length === 0) return
  // const ext = files[0].name.split('.').pop()
  // if (ext === 'mind') {
  //   loadMindFile(files[0])
  // } else {
  //   compileFiles(files)
  // }
  // }
  return (
    <div className='App'>
      {/* <h1>Example React component with <a href='https://github.com/hiukim/mind-ar-js' target='_blank'>MindAR</a></h1> */}

      <div>
        {!started && <button onClick={() => { setStarted(true) }}>Start</button>}
        {started && <button onClick={() => { setStarted(false) }}>Stop</button>}
      </div>
      {/* <img id='card' alt='' src={require('./card.png').default} style={{ width: '500px', height: '500px' }} /> */}

      {started && (
        <div className='container'>
          <MindARViewer />
          <video />
        </div>
      )}
      <button onClick={() => start(files)}>解析</button>
      <button onClick={() => post(exportedBuffer)}>上傳</button>
      <span id='progress' />
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>這裡放識別的圖片</p>
      </div>

      <div {...modleGetRootProps({ style })}>
        <input {...modleGetInputProps()} />
        <p>這裡glb格式的模型</p>
      </div>
      {
        files.map(img => {
          return (
            <div key={img.name}>
              <img alt='' src={img.preview} style={{ height: '300px', width: '300px' }} />
            </div>
          )
        })
      }
    </div>
  )
}

export default App
