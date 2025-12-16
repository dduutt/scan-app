<script setup>
import { reactive } from 'vue';
import { useSettingStore } from '../stores/setting';

const settingStore = useSettingStore();



const formData = reactive({
  username: settingStore.username,
  broadcastName: settingStore.broadcastName,
  broadcastKey: settingStore.broadcastKey,
});


function onSubmit(values) {
  settingStore.setSetting(values);

}
</script>



<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field v-model="formData.username" name="username" label="用户名" placeholder="用户名" clickable input-align="right"
        :rules="[{ required: true, message: '请填写用户名' }]" />
      <van-field v-model="formData.broadcastName" name="broadcastName" label="广播名称" placeholder="广播名称" clickable
        input-align="right" :rules="[{ required: true, message: '请填写广播名称' }]" />
      <van-field v-model="formData.broadcastKey" name="broadcastKey" label="广播密钥" placeholder="广播密钥" clickable
        input-align="right" :rules="[{ required: true, message: '请填写广播密钥' }]" />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>


</template>