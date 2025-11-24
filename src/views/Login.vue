
<template>
  <div class="container" style="max-width:420px;">
    <el-card>
      <h2 style="margin-bottom:6px;">Sign in</h2>
      <p style="color:#666; margin-bottom:18px;">Enter your account</p>

      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="Username" prop="username">
          <el-input v-model="form.username" autocomplete="username" />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" show-password autocomplete="current-password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="loading">Sign in</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '../services/auth'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const rules = {
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }],
  password: [{ required: true, message: 'Please input password', trigger: 'blur' }]
}
const formRef = ref()

const loading = ref(false)

async function onSubmit() {
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    loading.value = true
    try {
      await login(form.username, form.password)
      ElMessage.success('Logged in')
      router.push('/')
    } catch (err: any) {
      ElMessage.error(err.message || 'Login failed')
    } finally {
      loading.value = false
    }
  })
}

</script>

<style scoped>
.container {
  margin: 80px auto;
}
</style>
