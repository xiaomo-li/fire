<template>
  <div>
    <div id="container" class="box"></div>
    <div class="process">
      <!-- <div class="process" @mouseover="handleAdd" @mouseleave="handleReduce"> -->
      <!-- <div class="process-inner" :style="{ width: process + '%' }"></div> -->
      <!-- <input type="text" v-model="process" /> -->
    </div>
    <h1 class="scole">{{ this.process }}</h1>
    <h2>按上下键控制火焰高度</h2>
  </div>
</template>

<script>
import * as THREE from "three";

import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";
import { TWEEN } from "three/addons/libs/tween.module.min.js";

export default {
  data() {
    return {
      addTime: null,
      reduceTime: null,
      process: 20,
      camera: null,
      scene: null,
      renderer: null,
      particlesTotal: 200,
      smokeTotal: 200,
      circles: 8,
      objects: [],
      positions: [],
      circleObject: [],
      smokeObject: [],
    };
  },
  watch: {
    process: function (val) {
      this.change(val);
      this.animate();
    },
  },
  onLoad() {},
  mounted() {
    this.init2();
    document.addEventListener(
      "keydown",
      (e) => {
        var ev = e || window.event;
        switch (ev.keyCode) {
          case 40:
            if (this.process > 0) {
              this.process -= 1;
            }
            break;
          case 38:
            if (this.process < 100) {
              this.process += 1;
            }
            break;

          default:
            break;
        }
      },
      false
    );
    this.animate();
  },

  methods: {
    handleAdd() {
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
    handleReduce() {
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
      let that = this;

      const width = window.innerWidth;
      const height = window.innerHeight;

      that.camera = new THREE.OrthographicCamera(0, width, height, 0, 1, 10);
      that.camera.position.z = 10;

      that.scene = new THREE.Scene();

      // 火焰
      const image = document.createElement("img");
      const smoke = document.createElement("img");

      image.addEventListener("load", function () {
        for (let i = 0; i < that.particlesTotal; i++) {
          const object = new CSS3DSprite(image.cloneNode());
          const object2 = new CSS3DSprite(smoke.cloneNode());
          object.element.width = 300;
          object2.element.width = 250;
          let randomx = Math.random();
          let randomy = Math.random();

          object.position.x = object2.position.x = randomx * width;
          object.position.y = object2.position.y = height * randomy;
          object.position.z = object2.position.z = 0;
          that.scene.add(object);
          that.scene.add(object2);
          let t1 = new TWEEN.Tween(object.scale)
            .to({ y: 1 }, 0)
            .delay(1500 + Math.random() * 1000)
            .onComplete(function () {
              let randomx = Math.random();

              object.position.x = randomx * width;

              object.scale.y = 0;
              object2.scale.y = 1;
            })
            .start();
          let t2 = new TWEEN.Tween(object2.scale)
            .to({ y: 1 }, 0)
            .delay(700)
            .onComplete(function () {
              object.scale.y = 1;
              object2.scale.y = 0;
            })
            .start();
          t1.chain(t2);
          t2.chain(t1);

          // 初始化
          if (object.position.y > height * 0.05) {
            object.scale.x = 0;
            object2.scale.x = 0;
          }
          that.objects.push(object);
          that.smokeObject.push(object2);
        }
      });
      image.src = "../static/fire.gif";

      // 熄灭的火焰
      // smoke.addEventListener("load", function () {
      //   for (let i = 0; i < that.smokeTotal; i++) {
      //     const object = new CSS3DSprite(smoke.cloneNode());
      //     object.element.width = 200;

      //     object.position.x = 0;
      //     object.position.y = 0;
      //     object.position.z = 0;

      //     that.scene.add(object);
      //     object.scale.x = 0;

      //     that.smokeObject.push(object);
      //   }
      // });
      smoke.src = "../static/turnoff.gif";
      // 障碍物

      for (let i = 0; i <= that.circles; i++) {
        const circle = document.createElement("img");
        circle.addEventListener("load", function () {
          const object = new CSS3DSprite(circle);
          object.element.width = 100;
          object.element.height = 100;

          object.position.x = (
            Math.random() * width * 0.8 +
            width * 0.1
          ).toFixed(0);

          object.position.y = (
            height * 0.4 * Math.random() +
            height * 0.3
          ).toFixed(0);
          object.position.z = 0;

          that.scene.add(object);
          that.circleObject.push(object);
        });
        circle.src = "../static/c" + i + ".png";
      }

      // renderer
      that.renderer = new CSS3DRenderer();
      that.renderer.setSize(window.innerWidth, window.innerHeight);
      document
        .getElementById("container")
        .appendChild(that.renderer.domElement);
      window.addEventListener("resize", that.onWindowResize);
      that.renderer.render(this.scene, this.camera);
    },

    change(val) {
      const height = window.innerHeight;
      const width = window.innerWidth;
      let that = this;

      // 变动

      let percent = val * 0.01;
      let h1 = height * percent;
      // 金币消失
      for (let i of that.circleObject) {
        if (i.position.y < h1 * 1.1) {
          i.scale.x = 0;
        }
      }
      // 火焰变动
      for (let i = 0; i < that.particlesTotal; i++) {
        const object = that.objects[i];
        const object2 = that.smokeObject[i];
        // object.element.src = "../static/fire.gif";

        if (object.position.y < h1 * 0.5) {
          object.scale.x = 1;
          object2.scale.x = 1;
        } else if (
          object.position.y < h1 * 0.8 &&
          object.position.y > h1 * 0.5 &&
          object.position.x > width * 0.2 &&
          object.position.x < width * 0.8
        ) {
          object.scale.x = 1;
          object2.scale.x = 1;
        } else if (
          object.position.y < h1 &&
          object.position.y > h1 * 0.8 &&
          object.position.x > width * 0.4 &&
          object.position.x < width * 0.6
        ) {
          object.scale.x = 1;
          object2.scale.x = 1;
        } else {
          // object.element.src = "../static/turnoff.gif";
          // new TWEEN.Tween(object.scale)
          //   .to({ x: 0 }, 1500)
          //   .easing(TWEEN.Easing.Exponential.InOut)
          //   .start();

          object.scale.x = 0;
          object2.scale.x = 0;
          // object2.scale.x = 1;
        }

        // const x =
        //   Math.random() * width * (1 - percent) + (width * percent) / 2;
      }

      that.renderer.render(this.scene, this.camera);
    },
    // showSmoke(i) {
    //   let that = this;
    //   const object = that.objects[i];
    //   let x = object.position.x;
    //   let y = object.position.y;
    //   if (object.scale.x == 0) {
    //     new TWEEN.Tween(object.scale)
    //       .to({ x: 0 }, 1500)
    //       .onComplete(function () {
    //         that.smokeObject[i].position.x = x;
    //         that.smokeObject[i].position.y = y;
    //         that.smokeObject[i].scale.x = 1;
    //       })
    //       .start();
    //   } else {
    //     that.smokeObject[i].scale.x = 0;
    //   }
    // },

    onWindowResize() {
      let that = this;
      const width = window.innerWidth;
      const height = window.innerHeight;

      that.camera.aspect = width / height;
      that.camera.updateProjectionMatrix();

      that.camera.left = 0;
      that.camera.right = width;
      that.camera.top = height;
      that.camera.bottom = 0;
      that.camera.updateProjectionMatrix();

      that.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);

      TWEEN.update();
      // this.change();
      this.renderer.render(this.scene, this.camera);
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
/* .process {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 200px;

  border-radius: 20px;
  overflow: hidden;
  border: 1px solid;
}
.process-inner {
  background-color: gray;

  height: 100%;
} */
input {
  border: 1px solid;
}
.scole {
  color: #000;
  margin: 30px;
  position: absolute;
  right: 20px;
  top: 10px;
}
h2 {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
}
</style>
