import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

Vue.config.productionTip = false;

App.mpType = "app";
Vue.use(ElementUI);
const app = new Vue({
  ...App,
});
app.$mount();
// new Vue({
//   el: "#app",
//   render: (h) => h(App),
// });
