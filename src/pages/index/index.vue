<template>
  <view class="app">
    <div id="container" class="box"></div>
    <div class="process">
      <!-- <div class="process" @mouseover="handleAdd" @mouseleave="handleReduce"> -->
      <!-- <div class="process-inner" :style="{ width: process + '%' }"></div> -->
      <!-- <input type="text" v-model="process" /> -->
    </div>
    <h1 class="scole">{{ this.process }}</h1>
    <h2>按上下键控制火焰高度</h2>
    <view class="img-box">
      <image
        ref="img1"
        src="../../static/fire1.gif"
        @load="onImageLoad"
        alt=""
      />
      <image ref="img2" src="../../static/fire0.gif" alt="" />
      <image ref="smoke" src="../../static/turnoff.gif" alt="" />
      <image ref="circle0" src="../../static/c1.gif" alt="" />
      <image ref="circle2" src="../../static/c2.gif" alt="" />
      <image ref="circle3" src="../../static/c3.gif" alt="" />
      <image ref="circle4" src="../../static/c4.gif" alt="" />
      <image ref="circle5" src="../../static/c5.gif" alt="" />
      <image ref="circle6" src="../../static/c6.gif" alt="" />
      <image ref="circle7" src="../../static/c7.gif" alt="" />
      <image ref="circle1" src="../../static/c8.gif" alt="" />
    </view>
  </view>
</template>

<script>
import * as THREE from "three";

import {
  CSS3DRenderer,
  CSS3DSprite,
} from "three/addons/renderers/CSS3DRenderer.js";
import * as TWEEN from "@tweenjs/tween.js";

export default {
  data() {
    return {
      fireUrl: "../static/fire1.gif",
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
    // this.init2();
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
    // this.animate();
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

    onImageLoad() {
      let that = this;
      const res = uni.getSystemInfoSync();
      const width = res.screenWidth;
      const height = res.screenHeight;

      that.camera = new THREE.OrthographicCamera(0, width, height, 0, 1, 10);
      that.camera.position.z = 10;

      that.scene = new THREE.Scene();

      // 火焰
      const smoke = this.$refs.smoke;
      // function transition() {
      //   let percent = that.process * 0.01;
      //   let h1 = height * percent;
      //   for (let i = 0; i < that.particlesTotal; i++) {
      //     const object = that.objects[i];
      //     let t1 = new TWEEN.Tween(object.position)
      //       .to(
      //         {
      //           x: Math.random() * width,
      //         },
      //         0
      //       )
      //       // .delay(Math.random() * 3000 + 10000)
      //       .repeat(Infinity)
      //       .onUpdate(function () {
      //         if (object.position.y < h1 * 0.5) {
      //           object.scale.x = 1;
      //         } else if (
      //           object.position.y < h1 * 0.8 &&
      //           object.position.y > h1 * 0.5 &&
      //           object.position.x > width * 0.2 &&
      //           object.position.x < width * 0.8
      //         ) {
      //           object.scale.x = 1;
      //         } else if (
      //           object.position.y < h1 &&
      //           object.position.y > h1 * 0.8 &&
      //           object.position.x > width * 0.4 &&
      //           object.position.x < width * 0.6
      //         ) {
      //           object.scale.x = 1;
      //         } else {
      //           object.scale.x = 0;
      //         }
      //       })
      //       .start();
      //   }
      //   new TWEEN.Tween(this).to({}, 2000).onComplete(transition).start();
      // }
      for (let i = 0; i < that.particlesTotal; i++) {
        let image;
        if (i % 2 == 0) {
          image = this.$refs.img1;
        } else {
          image = this.$refs.img2;
        }
        const object = new CSS3DSprite(image.cloneNode());
        object.element.width = 300;
        let randomx = Math.random();
        let randomy = Math.random();

        object.position.x = randomx * width;
        object.position.y = height * randomy;
        object.position.z = 0;
        that.scene.add(object);
        // 初始化
        if (object.position.y > height * 0.05) {
          object.scale.x = 0;
        }
        // let delayTime = Math.random() * 1000;
        let delayTime = 0;

        new TWEEN.Tween(object)
          .to({}, 10)
          .delay(delayTime)
          // .onComplete(function () {

          //   console.log(object);
          // })
          .start();
        that.objects.push(object);

        // 火焰图片
      }
      // transition();

      // 障碍物

      for (let i = 0; i <= that.circles; i++) {
        const circle = this.$refs["circle" + i];

        const object = new CSS3DSprite(circle);
        const object2 = new CSS3DSprite(smoke.cloneNode());
        object2.element.width = 250;
        object.element.width = 200;
        object.element.height = 200;
        let randomx = Math.random();
        let randomy = Math.random();
        object.position.x = object2.position.x = (
          randomx * width * 0.8 +
          width * 0.1
        ).toFixed(0);

        object.position.y = object2.position.y = (
          height * 0.5 * randomy +
          height * 0.4
        ).toFixed(0);
        object.position.z = 0;
        object2.scale.x = 0;
        let y = object.position.y;
        let t1 = new TWEEN.Tween(object.position)
          .to(
            {
              y: y - 20,
            },
            randomy * 1200 + 800
          )
          .easing(TWEEN.Easing.Quadratic.InOut)
          .repeat(Infinity)
          .onUpdate(function () {
            object2.position.y = object.position.y;
          })
          .start();

        t1.yoyo(true);

        that.scene.add(object);
        that.scene.add(object2);
        that.circleObject.push(object);
        that.smokeObject.push(object2);

        // circle.src = "../static/c" + i + ".gif";
      }

      // renderer

      that.renderer = new CSS3DRenderer();
      that.renderer.setSize(width, height);
      document
        .getElementById("container")
        .appendChild(that.renderer.domElement);

      that.renderer.render(this.scene, this.camera);
    },

    change(val) {
      const res = uni.getSystemInfoSync();
      const width = res.screenWidth;
      const height = res.screenHeight;
      let that = this;

      // 变动

      let percent = val * 0.01;
      let h1 = height * percent;
      // 烧掉
      for (let i = 0; i < that.circleObject.length; i++) {
        if (that.circleObject[i].position.y < h1 * 1.1) {
          if (that.circleObject[i].scale.x > 0) {
            that.circleObject[i].scale.x = 0;
            this.smokeObject[i].scale.x = 1;

            let t1 = new TWEEN.Tween(that.smokeObject[i].scale)

              .to({}, 500)

              .start()

              .onComplete(function () {
                that.smokeObject[i].scale.x = 0;
              });
            // let t2 = new TWEEN.Tween(that.smokeObject[i].scale)

            // t1.chain(t2);
          }
        }
      }
      // 火焰变动

      for (let i = 0; i < that.particlesTotal; i++) {
        const object = that.objects[i];
        if (object.position.y < h1 * 0.5) {
          object.scale.x = 1;
        } else if (
          object.position.y < h1 * 0.8 &&
          object.position.y > h1 * 0.5 &&
          object.position.x > width * 0.2 &&
          object.position.x < width * 0.8
        ) {
          object.scale.x = 1;
        } else if (
          object.position.y < h1 &&
          object.position.y > h1 * 0.8 &&
          object.position.x > width * 0.4 &&
          object.position.x < width * 0.6
        ) {
          object.scale.x = 1;
        } else {
          object.scale.x = 0;
        }

        // const x =
        //   Math.random() * width * (1 - percent) + (width * percent) / 2;
      }

      that.renderer.render(this.scene, this.camera);
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
.img-box {
  display: none;
}
.app {
  overflow: hidden;
}
</style>
