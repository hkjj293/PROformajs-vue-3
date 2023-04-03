import { createApp } from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

const app = createApp(App)

import ProformajsVue from '@/entry.esm'
app.use(ProformajsVue)

app.mount('#app')
