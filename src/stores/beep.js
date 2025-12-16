import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBeepStore = defineStore('beep', () => {
    // 音频上下文（组合式API用ref管理）
    const audioContext = ref(null)
    // 兼容webkit内核（Safari/iOS/部分安卓浏览器）
    const AudioContextConstructor = window.AudioContext

    /**
     * 初始化音频上下文（懒加载 + 恢复挂起状态）
     * @returns {Promise<AudioContext>} 音频上下文实例
     */
    async function initBeep() {
        // 1. 未创建则新建
        if (!audioContext.value) {
            audioContext.value = new AudioContextConstructor()
        }
        // 2. 若上下文被挂起（浏览器防自动播放限制），恢复运行
        if (audioContext.value.state === 'suspended') {
            await audioContext.value.resume()
        }
        // 3. 返回可用的音频上下文
        return audioContext.value
    }

    /**
     * 关闭音频上下文（释放资源）
     */
    async function closeBeep() {
        if (audioContext.value) {
            await audioContext.value.close() // close是异步的，需await
            audioContext.value = null // 清空引用，方便GC
        }
    }

    /**
     * 播放提示音
     * @param {number} times 播放次数（默认1次）
     */
    async function playBeep(times = 1) {
        try {
            // 前置：确保音频上下文已初始化且可用
            const ctx = await initBeep()

            // 单次播放逻辑
            const playSingle = () => new Promise((resolve) => {
                const oscillator = ctx.createOscillator() // 振荡器（生成声音）
                const gainNode = ctx.createGain() // 音量控制

                // 连接音频节点
                oscillator.connect(gainNode)
                gainNode.connect(ctx.destination)

                // 配置音效
                oscillator.frequency.value = 440 // 音调（440Hz=标准A音）
                gainNode.gain.value = 1 // 音量（建议0.5，避免过响）
                oscillator.start() // 开始播放
                // 0.2秒后停止当前音
                oscillator.stop(ctx.currentTime + 0.2)

                // 500ms后完成单次播放（间隔时间）
                setTimeout(resolve, 500)
            })

            // 循环播放指定次数
            for (let i = 0; i < times; i++) {
                await playSingle()
            }
        } catch (error) {
            console.error('播放提示音失败:', error)
        }
    }

    return {
        initBeep,
        closeBeep,
        playBeep
    }
})