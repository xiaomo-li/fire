<template>
  <div>
    <div id="container" class="box"></div>
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

export default {
  data() {
    return {
      title: "Hello",
    };
  },
  onLoad() {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      let camera, scene, renderer;
      let controls;

      const particlesTotal = 512;
      const positions = [];
      const objects = [];
      let current = 0;

      init();
      animate();

      function init() {
        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          1,
          5000
        );
        camera.position.set(0, 600, 1000);
        camera.lookAt(0, 0, 0);

        scene = new THREE.Scene();

        const image = document.createElement("img");
        image.addEventListener("load", function () {
          for (let i = 0; i < particlesTotal; i++) {
            const object = new CSS3DSprite(image.cloneNode());
            (object.position.x = Math.random() * 4000 - 2000),
              (object.position.y = 0 * 4000 - 2000),
              (object.position.z = 0);
            scene.add(object);

            objects.push(object);
          }

          transition();
        });
        image.src = "../static/fire.gif";

        // Cube

        // const amount = 8;
        // const separationCube = 150;
        // const offset = ((amount - 1) * separationCube) / 2;

        // for (let i = 0; i < particlesTotal; i++) {
        //   const x = (i % amount) * separationCube;
        //   const y = Math.floor((i / amount) % amount) * separationCube;
        //   const z = Math.floor(i / (amount * amount)) * separationCube;

        //   positions.push(x - offset, y - offset, 0);
        // }

        renderer = new CSS3DRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("container").appendChild(renderer.domElement);

        //

        controls = new TrackballControls(camera, renderer.domElement);

        //

        window.addEventListener("resize", onWindowResize);
      }

      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      function transition() {
        const offset = current * particlesTotal * 3;
        const duration = 2000;
        for (let i = 0, j = offset; i < particlesTotal; i++, j += 3) {
          const object = objects[i];
          new TWEEN.Tween(object.position)
            .to(
              {
                x: positions[j],
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

      function animate() {
        requestAnimationFrame(animate);

        TWEEN.update();
        controls.update();

        const time = performance.now();

        for (let i = 0, l = objects.length; i < l; i++) {
          const object = objects[i];
          const scale =
            Math.sin((Math.floor(object.position.x) + time) * 0.002) * 0.3 + 1;
          object.scale.set(scale, scale, scale);
        }

        renderer.render(scene, camera);
      }
    },
  },
};
</script>

<style></style>
