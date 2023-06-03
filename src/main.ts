import '@/assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'; // 引入App组件
import router from './router'; // 引入路由

import "element-plus/dist/index.css"; // 引入element-plus样式

import "default-passive-events";

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
