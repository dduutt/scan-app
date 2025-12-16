import { createRouter, createWebHashHistory } from 'vue-router'
import Scan from '../views/Scan.vue'
import Record from '../views/Record.vue'
import Setting from '../views/Setting.vue'
import { useSettingStore } from '../stores/setting'
import { showFailToast } from 'vant';
const routes = [
    {
        path: '/',
        redirect: '/scan'
    },
    {
        path: '/scan',
        name: 'scan',
        component: Scan
    },
    {
        path: '/record',
        name: 'record',
        component: Record
    },
    {
        path: '/setting',
        name: 'setting',
        component: Setting
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const settingStore = useSettingStore()


    // 如果未配置且不是前往设置页面，则重定向到设置页面
    if (!settingStore.isConfigured && to.path !== '/setting') {
        showFailToast('请先完成配置')
        next('/setting')
    } else {
        next()
    }
})

export default router