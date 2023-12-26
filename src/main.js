import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.bubble.css'
import 'quill/dist/quill.snow.css'
import axios from 'axios'
import qs from 'qs'
import * as echarts from 'echarts'
Vue.prototype.$qs = qs
Vue.prototype.$echarts = echarts
// 配置请求的根路径
axios.defaults.baseURL = 'http://8.141.9.251:3000/api/'
Vue.prototype.$http = axios

Vue.config.productionTip = false
// 使用富文本编辑器
Vue.use(QuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
