import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

const app = createApp(App);

import ProformajsVue from '@/entry.esm';
app.use(ProformajsVue);

app.mount('#app')
