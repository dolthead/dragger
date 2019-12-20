import Vue from "vue";
import VueMuuri from "vue-muuri";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "vue-muuri/dist/vue-muuri.css";

Vue.config.productionTip = false;

Vue.use(VueMuuri);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
