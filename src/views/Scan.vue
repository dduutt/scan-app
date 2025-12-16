<template>
    <div class="container">
        <van-cell-group inset>
            <van-cell title="用户名" :value="settingStore.username" />
        </van-cell-group>
        <van-cell-group inset>
            <van-field v-model="location" name="location" label="库位" clearable clickable input-align="right" />
        </van-cell-group>
        <van-cell-group inset>
            <van-cell title="数量合计" :value="totalQuantity" />
            <van-cell title="毛重合计" :value="totalGrossWeight" />
            <van-cell title="净重合计" :value="totalNetWeight" />
        </van-cell-group>

        <van-swipe ref="vSwipe" v-if="totalMaterial > 0">
            <van-swipe-item v-for="material in materials">
                <van-cell-group inset @click="onClickSwipe(material)">
                    <van-cell title="物料名称" center :value="material.materialName" :label="material.batchNumber" />
                    <van-cell title="图号" center :value="material.drawingNumber" />
                    <van-cell title="颜色" center :value="material.color" />
                    <van-cell title="数量" center :value="material.quantity" />
                    <van-cell title="毛重" center :value="material.grossWeight" />
                    <van-cell title="净重" center :value="material.netWeight" />
                </van-cell-group>
            </van-swipe-item>
            <template #indicator="{ active, total }">
                <div class="custom-indicator">{{ active + 1 }}/{{ total }}</div>
            </template>
        </van-swipe>
        <div class="submit-container">
            <van-button v-if="totalMaterial > 0" block round type="primary" @click="submit">
                提交
            </van-button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useSettingStore } from '../stores/setting';
import { useBeepStore } from '../stores/beep';
import { api } from '../api';
import { register, unregister } from 'tauri-plugin-broadcast-api';
import { addPluginListener } from '@tauri-apps/api/core';


const settingStore = useSettingStore();
const beepStore = useBeepStore();

const location = ref('仓库A-货架3-层2');
const vSwipe = ref(null);
let unlisten = null;

const totalMaterial = computed(() => {
    return materials.value.length || 0;
});
const totalQuantity = computed(() => {
    return materials.value.reduce((sum, item) => sum + (item.quantity || 0), 0).toFixed(2);
});
const totalGrossWeight = computed(() => {
    return materials.value.reduce((sum, item) => sum + (item.grossWeight || 0), 0).toFixed(2);
});
const totalNetWeight = computed(() => {
    return materials.value.reduce((sum, item) => sum + (item.netWeight || 0), 0).toFixed(2);
});


const materials = ref([]);

async function onScanData(data) {
    let value = data[settingStore.broadcastKey]
    if (!value) {
        return;
    }
    value = value.trim();
    // 通过长度判断是批号还是库位
    if (value.length < 12) {
        location.value = value;
        await beepStore.playBeep(1);
        return;
    }
    if (materials.value.find(item => item.batchNumber === value)) {
        showToast(`批号[${value}]已扫描`);
        await beepStore.playBeep(2);
        return;
    }
    const resp = await api.getMaterial(value);
    if (!resp) {
        showToast(`未找到批号[${value}]`);
        await beepStore.playBeep(3);
        return;
    }
    materials.value.push(resp);
    vSwipe.value?.swipeTo(materials.value.length - 1);
    await beepStore.playBeep(1);
}

function onClickSwipe(material) {
    showConfirmDialog({
        title: `是否移除 [${material.batchNumber}] ?`,
    })
        .then(() => {
            materials.value = materials.value.filter(item => item.batchNumber !== material.batchNumber);
        })
        .catch(() => {
            // on cancel
        });
}

async function submit() {
    if (materials.value.length === 0) {
        showToast('请先扫描物料');
        return;
    }
    const batchNumbers = materials.value.map(item => item.batchNumber);
    const resp = await api.createScanRecord({
        scanner: settingStore.username,
        location: location.value,
        batchNumbers: batchNumbers
    });
    if (resp) {
        showSuccessToast('提交成功');
        materials.value = [];
    } else {
        showFailToast('提交失败');
    }
}

async function initBroadcast() {
    try {
        await unlisten?.unregister();
        unlisten = await addPluginListener("broadcast", 'onScanData', onScanData);
    } catch (err) {
        console.log(err);
    }

    try {
        await register(settingStore.broadcastName, "onScanData");
    } catch (err) {
        console.log(err);
    }

}

async function removeBroadcast() {
    try {
        await unregister(settingStore.broadcastName)
    } catch (err) {
        console.log(err);
    }
    try {
        await unlisten?.unregister()
        unlisten = null;
    } catch (err) {
        console.log(err);
    }
}





onMounted(async () => {
    await initBroadcast();
})


onUnmounted(async () => {
    await removeBroadcast();
})
</script>

<style scoped>
.van-cell-group {
    margin: 10px;
}

.custom-indicator {
    /* 底部居中 */

    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;

}

.submit-container {
    margin-top: 20px;
    padding-bottom: 80px;
}
</style>