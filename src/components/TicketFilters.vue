
<template>
  <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
    <el-select v-model="filters.status" placeholder="Status" clearable style="width:160px;">
      <el-option v-for="s in statuses" :key="s" :label="s" :value="s" />
    </el-select>

    <el-select v-model="filters.severity" placeholder="Severity" clearable style="width:160px;">
      <el-option v-for="s in severities" :key="s" :label="s" :value="s" />
    </el-select>

    <el-input v-model="filters.query" placeholder="Search title/description" clearable style="width:260px;" />

    <el-button type="primary" @click="$emit('apply', filters)">Apply</el-button>
    <el-button @click="reset">Reset</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = defineProps({})
const emits = defineEmits(['apply'])

const statuses = ['OPEN','IN_DEVELOPMENT','UNDER_REVIEW','IN_REGRESSION','CLOSED','IN_MODIFICATION']
const severities = ['HINT','NORMAL','SEVERE','CRITICAL']

const filters = reactive({
  status: '',
  severity: '',
  query: ''
})

function reset() {
  filters.status = ''
  filters.severity = ''
  filters.query = ''
  emits('apply', filters)
}
</script>
