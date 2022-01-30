import React, { useEffect, useRef } from 'react'

const MindARViewer = () => {
  const sceneRef = useRef(null)
  useEffect(() => {
    const sceneEl = sceneRef.current
    const arSystem = sceneEl.systems['mindar-image-system']
    sceneEl.addEventListener('renderstart', () => {
      arSystem.start() // start AR
    })
    return () => {
      arSystem.stop()
    }
  }, [])

  return (
    <a-scene
      ref={sceneRef}
      mindar-image='imageTargetSrc: ./kita.mind; autoStart: false; uiLoading: no; uiError: no; uiScanning: no'
      color-space='sRGB'
      embedded renderer='colorManagement: true, physicallyCorrectLights'
      vr-mode-ui='enabled: false'
      device-orientation-permission-ui='enabled: false'
    >
      {/* 其實這個a-assets可以不需要，在下面的a-entity可以直接渲染組件，但是我看mind-ar裡面使用a-assets的時候，大多數是為了多個模型顯示，比如掃圖1顯示圖1，掃圖二顯示圖2或圖1圖2一起掃，然後兩個模型一起顯示 */}
      {/* <a-assets>
        <img id='card' alt='' src='./card1.jpg' /> */}
      {/* <img id='card' alt='' src='http://localhost:3000/src/card1.jpg' /> */}
      {/* <a-asset-item id='avatarModel' src={require('./coffe_latte.obj').default} /> */}
      {/* <a-asset-item id='avatarModel' src='./test5/scene.gltf' /> */}
      {/* <a-asset-item id='avatarModel' src='./.obj' /> */}

      {/* <a-asset-item id='avatarModel' src='https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js@1.0.0/examples/image-tracking/assets/card-example/softmind/scene.gltf' /> */}
      {/* </a-assets> */}

      <a-camera position='0 0 0' look-controls='enabled: false' />

      {/* <a-entity mindar-image-target='targetIndex: 0' /> */}

      <a-entity mindar-image-target='targetIndex: 0'>
        <a-plane src='./kita.jpg' position='0 0 0' height='0.552' width='1' rotation='0 0 0' />
        {/* rotation:旋轉的坐標 */}
        {/* position:模型的坐標 */}
        {/* scale: 缩放组件定义实体的收缩、拉伸或倾斜变换 */}

        {/* animation: 定義模型的動畫。---->裡面有個property屬性，裡面的值可以選擇模型的其它屬性名（可以是旋轉坐標、模型坐標，縮放比例），然後還有個屬性to可以定義動畫的最終效果 */}
        {/* animation裡面會有多個動畫效果選項，比如延遲、動畫效果(緩入、緩出等)、動畫週期、動畫次數等。所以這個應該會是個字符串類型 */}
        {/* <a-gltf-model rotation='0 0 0 ' position='0 0 0.1' scale='1 1 1' src='#avatarModel' animation='property: position; to: 0 0 0.1; dur: 1000; easing: easeInOutQuad; loop: true; dir: alternate' /> */}
        <a-entity
          rotation='0 0 0'
          position='0 0 0'
          // animation-mixer='clip: SwordAndShieldIdle'
          // gltf-model='src: url(./test5/scene.gltf)'
          gltf-model='src: url(./a.glb)'
        />
      </a-entity>
      {/* <a-entity mindar-image-target='targetIndex: 1'> */}
      {/* <a-plane src='./card3.jpg' position='0 0 0' height='0.552' width='1' rotation='0 0 0' /> */}
      {/* </a-entity> */}
    </a-scene>
  )
}

export default MindARViewer
