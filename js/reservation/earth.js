import * as THREE from '../common/build/three.module.js';

$(function () {
  // パスの取得
  let path = location.pathname;
  const domain = "/backpacktourism/reservation.html";


  let meshEarth = "";

  // シーンに追加すると表示する
  let scene;
  let camera;
  let renderer;

  /**
   * シーン
   */
  scene = new THREE.Scene();

  /**
   * サイズ
   */
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * カメラ
   */
  // PerspectiveCamera(視野角、アスペクト比、開始距離、修了距離)
  camera = new THREE.PerspectiveCamera(
    50,
    sizes.width / sizes.height,
    0.1,
    2000,
  );

  /**
   * レンダラー
   */
  const earthCanvas = document.getElementById('earthCanvas');
  // 宣言
  renderer = new THREE.WebGLRenderer({
    canvas: earthCanvas, // レンダラーに使用するcanvas要素を指定
    alpha: true, // 透明度
  });
  // サイズ変更
  renderer.setSize(sizes.width, sizes.height);
  // 解像度
  renderer.setPixelRatio(window.devicePixelRatio);

  /**
   * オブジェクト作成
   */
  // ジオメトリ
  let sphereGeometry = new THREE.SphereGeometry(30, 64, 32); // 半径、幅セグメント、高さセグメント

  let texture = "../../images/earth.jpg";
  if (path === domain) {
    // 本番環境
    texture = new THREE.TextureLoader().load('/backpacktourism/images/earth.jpg');
  } else {
    //  開発時
    texture = new THREE.TextureLoader().load('../../images/earth.jpg');
  }
  const meshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture, });
  meshEarth = new THREE.Mesh(sphereGeometry, meshBasicMaterial);


  /**
   * 位置
   */
  // カメラ
  const pcStartPositionX = -50;
  const mbStartPositionX = 0;

  let cameraStartPositionX = pcStartPositionX;
  if (sizes.width >= 560) {
    cameraStartPositionX = pcStartPositionX;
  } else {
    cameraStartPositionX = mbStartPositionX;
  }

  window.addEventListener("resize", test);

  function test() {
    let resizeWidth = sizes.width;

    if ((cameraStartPositionX === mbStartPositionX)
      && (resizeWidth >= 560)) {
      cameraStartPositionX = pcStartPositionX;
    } else if ((cameraStartPositionX === pcStartPositionX)
      && (resizeWidth < 560)) {
      cameraStartPositionX = mbStartPositionX;
    }

    // console.log(cameraStartPositionX);

    // 再設定
    camera.position.x = cameraStartPositionX;
  }

  let cameraStartPositionY = 20;
  let cameraStartPositionZ = 130;
  // 地球
  let meshEarthStartPositionX = 0;
  let meshEarthStartPositionY = 0;
  let meshEarthStartPositionZ = 0;
  // 線形
  let scalePercentMiddle = 35;
  let scalePercentFinish = 100;


  // camera.position.set(0, 25, 50);
  camera.position.set(
    cameraStartPositionX,
    cameraStartPositionY,
    cameraStartPositionZ
  );
  // 地球
  meshEarth.position.set(
    meshEarthStartPositionX,
    meshEarthStartPositionY,
    meshEarthStartPositionZ
  );

  /**
   * アニメーション
   */
  const animationScript = [];
  animationScript.push({
    start: scalePercentMiddle,
    end: scalePercentFinish,
    function() {
      // camera.position.set(0, 0, 150);
      // 開始位置、終了位置、一次補間(開始位置、終了位置)
      camera.position.x = lerp(
        cameraStartPositionX,
        -30,
        scalePercent(scalePercentMiddle, scalePercentFinish)
      );
      camera.position.y = lerp(
        cameraStartPositionY,
        20,
        scalePercent(scalePercentMiddle, scalePercentFinish)
      );
      camera.position.z = lerp(
        cameraStartPositionZ,
        40,
        scalePercent(scalePercentMiddle, scalePercentFinish)
      );
    }
  });

  // アニメーション開始
  function playScrollAnimation() {
    animationScript.forEach((animation) => {
      if (scrollParcent >= animation.start && scrollParcent < animation.end) {
        animation.function();
      }
    });
  }

  // スクロール率
  let scrollParcent = 0;
  document.body.onscroll = () => {
    // console.log("scroll");
    // (公式)
    scrollParcent =
      (
        (
          document.documentElement.scrollTop /
          (document.documentElement.scrollHeight - document.documentElement.clientHeight)
        ) * 100
      )

    // console.log(scrollParcent);
  }

  // 線形補間(公式)
  function lerp(x, y, a) {
    return (1 - a) * x + a * y;
  }

  // 一次補間(公式)
  function scalePercent(start, end) {
    return (scrollParcent - start) / (end - start);
  }

  // シーンに追加
  scene.add(meshEarth);

  window.addEventListener("resize", onWindowResize);

  /**
   * マウス操作
   */
  // controls = new OrbitControls(camera, renderer.domElement);

  /**
   * アニメーション
   **/
  function animate() {
    // アニメーション実行
    playScrollAnimation();

    // meshEarth.rotation.x += 0.005;
    meshEarth.rotation.y += 0.005;
    // meshEarth.rotation.z += 0.01;

    // フレーム単位で呼び出し
    requestAnimationFrame(animate);
    // 表示
    renderer.render(scene, camera);
  }
  animate();

  /**
   * リサイズ
  */
  function onWindowResize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // カメラのアスペクト比を正す
    camera.aspect = sizes.width / sizes.height;
    // アスペクト比を正したら必須で呼び出す
    camera.updateProjectionMatrix();
    // レンダラーのサイズを随時更新
    renderer.setSize(sizes.width, sizes.height);
    // 解像度
    renderer.setPixelRatio(window.devicePixelRatio);
  }
});