
<template>
  <div class="container">
    <el-card>
      <h3>Create Ticket</h3>
      <el-form :model="form" ref="formRef" label-width="140px">
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="Software Name">
          <el-input v-model="form.software_name" />
        </el-form-item>

        <el-form-item label="Software Version">
          <el-input v-model="form.software_version" />
        </el-form-item>

        <el-form-item label="Time of discovery">
          <el-date-picker v-model="form.discovered_at" type="datetime" placeholder="Select date and time" />
        </el-form-item>

        <el-form-item label="Severity">
          <el-select v-model="form.severity" placeholder="Severity">
            <el-option label="HINT" value="HINT" />
            <el-option label="NORMAL" value="NORMAL" />
            <el-option label="SEVERE" value="SEVERE" />
            <el-option label="CRITICAL" value="CRITICAL" />
          </el-select>
        </el-form-item>

        <el-form-item label="Module">
          <el-input v-model="form.module" />
        </el-form-item>

        <el-form-item label="Assign to (Developer)">
          <el-select v-model="form.assignee" placeholder="Select developer">
            <el-option v-for="u in developers" :key="u.id" :label="u.fullName || u.username" :value="u" />
          </el-select>
        </el-form-item>

        <el-form-item label="Description">
          <el-input type="textarea" v-model="form.description" rows="6" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submit">Submit</el-button>
          <el-button @click="reset">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import api from '../services/api'
import { ElMessage } from 'element-plus'
import type { User } from '../types'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import useAuth from '../store'

const formRef = ref()
const form = reactive({
  title: '',
  software_name: '',
  software_version: '',
  discovered_at: dayjs().toISOString(),
  severity: 'NORMAL',
  module: '',
  assignee: null as User | null,
  description: ''
})
const developers = ref<User[]>([])
const router = useRouter()

onMounted(async () => {
  const users = await api.listUsers()
  developers.value = users.filter((u: User) => u.role === 'DEVELOPER')
})


function reset() {
  form.title = ''
  form.software_name = ''
  form.software_version = ''
  form.description = ''
  form.severity = 'NORMAL'
  form.module = ''
  form.assignee = null
}

async function submit() {
  if (!form.title) {
    ElMessage.error('Title is required')
    return
  }
  const payload: any = {
    title: form.title,
    software_name: form.software_name,
    software_version: form.software_version,
    discovered_at: form.discovered_at,
    severity: form.severity,
    module: form.module,
    assignee: form.assignee,
    description: form.description,
    submitter: null
  }
  try {
    const t = await api.createTicket(payload)
    ElMessage.success('Ticket created')
    router.push(`/tickets/${t.id}/`)
  } catch (err: any) {
    ElMessage.error(err.message || 'Failed to create')
  }
}
</script>

<style scoped>
.container { max-width:1100px; }
</style>
