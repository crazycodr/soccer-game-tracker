import { createApp } from 'vue'
import {createPinia} from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import { createI18n } from 'vue-i18n'
const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en'
})

import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)

app.mount('#app')
