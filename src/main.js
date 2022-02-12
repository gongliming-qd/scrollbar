import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "./assets/font/font.css"
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import vcolorpicker from './components/vcolorpicker'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vcolorpicker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
