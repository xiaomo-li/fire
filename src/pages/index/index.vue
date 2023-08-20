<template>
  <div>
    <div id="container" class="box"></div>
    <div class="process" @mouseover="handleAdd" @mouseleave="handleReduce">
      <div class="process-inner" :style="{ width: process + '%' }"></div>
    </div>
  </div>
  <!-- <div><img src="../../static/fire.gif" alt="" /></div> -->
</template>

<script>
import * as THREE from "three";
// import "../../FireShadow.js";
import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";
import { TWEEN } from "three/addons/libs/tween.module.min.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
export default {
  data() {
    return {
      title: "Hello",
      addTime: null,
      reduceTime: null,
      process: 20,
    };
  },
  onLoad() {},
  mounted() {
    // this.init();
    this.init2();
  },
  methods: {
    handleAdd(event) {
      let that = this;
      clearInterval(that.reduceTime);
      that.reduceTime = null;
      if (that.process < 100) {
        that.addTime = setInterval(() => {
          that.process += 5;
        }, 500);
      } else {
        that.process = 200;
        clearInterval(that.reduceTime);
        that.reduceTime = null;
      }
    },
    handleReduce(event) {
      let that = this;
      clearInterval(that.addTime);
      that.addTime = null;
      if (that.process > 0) {
        clearInterval(that.addTime);

        that.reduceTime = setInterval(() => {
          that.process -= 5;
        }, 500);
      } else {
        clearInterval(that.addTime);
        that.addTime = null;
      }
    },
    init2() {
      let camera, scene, renderer;
      const particlesTotal = 30;
      const positions = [];
      const objects = [];
      let that = this;
      init();
      animate();
      const width = window.innerWidth;
      const height = window.innerHeight;
      function init() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        let current = 0;

        camera = new THREE.OrthographicCamera(
          -width / 2,
          width / 2,
          height / 2,
          -height / 2,
          1,
          10
        );
        camera.position.z = 10;

        scene = new THREE.Scene();

        // create sprites

        const image = document.createElement("img");
        image.addEventListener("load", function () {
          for (let i = 0; i < particlesTotal; i++) {
            const object = new CSS3DSprite(image.cloneNode());
            (object.position.x = Math.random() * width - width / 2),
              (object.position.y = -height / 2),
              (object.position.z = 0);
            scene.add(object);

            objects.push(object);
          }

          transition();
        });
        image.src = "../static/fire.gif";

        // 变动
        // for (let i = 0; i < particlesTotal; i++) {
        //   const x = Math.random() * width - width / 2;
        //   const y = -height / 2 + that.process * height * 0.01;
        //   const z = 0;
        //   positions.push(x, y, z);
        // }
        // console.log(positions);

        function transition() {
          const offset = current * particlesTotal * 3;
          const duration = 2000;
          for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
            const object = objects[i];
            new TWEEN.Tween(object.position)
              .to(
                {
                  x: positions[j + 5],
                  y: positions[j + 1],
                  z: positions[j + 2],
                },
                Math.random() * duration + duration
              )
              .easing(TWEEN.Easing.Exponential.InOut)
              .start();
          }
          new TWEEN.Tween(this)
            .to({}, duration * 3)
            .onComplete(transition)
            .start();
          current = (current + 1) % 4;
        }

        // renderer
        renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("container").appendChild(renderer.domElement);
        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();

        updateHUDSprites();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      for (let i = 0; i < objects.length; i++) {
        objects[i].position.x = Math.random() * width - width / 2;
        objects[i].position.y =
          Math.random() * (-height / 2 + that.process * height * 0.01);
        objects[i].position.z = 0;
      }

      function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
        renderer.render(scene, camera);
      }
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.process {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 20px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid;
}
.process-inner {
  background-color: gray;
  /* width: 20%; */
  height: 100%;
}
</style>
