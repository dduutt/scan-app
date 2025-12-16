import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { showSuccessToast } from 'vant'
export const useSettingStore = defineStore('setting', () => {

  const defaultUsername = localStorage.getItem('username') || '杜桐'
  const defaultBroadcastName = localStorage.getItem('broadcastName') || ''
  const defaultBroadcastKey = localStorage.getItem('broadcastKey') || ''
  // 状态
  const username = ref(defaultUsername)
  const broadcastName = ref(defaultBroadcastName)
  const broadcastKey = ref(defaultBroadcastKey)

  // 计算属性（示例）
  const isConfigured = computed(() => {
    return !!username.value && !!broadcastName.value && !!broadcastKey.value
  })

  function setSetting(data) {
    username.value = data.username
    broadcastName.value = data.broadcastName
    broadcastKey.value = data.broadcastKey

    localStorage.setItem('username', username.value)
    localStorage.setItem('broadcastName', broadcastName.value)
    localStorage.setItem('broadcastKey', broadcastKey.value)
    showSuccessToast('保存成功')
  }



  return {
    // 状态
    username,
    broadcastName,
    broadcastKey,

    // 计算属性
    isConfigured,

    // 方法
    setSetting
  }
})