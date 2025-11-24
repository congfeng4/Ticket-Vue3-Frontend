
<template>
  <div class="container">
    <el-card>
      <h3>AI Insights (Demo)</h3>
      <p>This page is a placeholder for optional AI analysis. In production it would call backend analytics that aggregates tickets over a time range and returns summaries, distributions, and suggestions.</p>

      <el-form label-position="top" style="max-width:420px;">
        <el-form-item label="Start">
          <el-date-picker v-model="start" type="date" />
        </el-form-item>

        <el-form-item label="End">
          <el-date-picker v-model="end" type="date" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="generate">Generate Insights</el-button>
        </el-form-item>
      </el-form>

      <div v-if="loading" style="text-align:center; padding:24px;">
        <el-spinner />
      </div>

      <div v-if="result">
        <el-divider />
        <h4>Summary</h4>
        <ul><li>{{ result.summary }}</li></ul>

        <h4>Severity distribution</h4>
        <ul>
          <li v-for="(v,k) in result.severity || {}" :key="k">{{ k }}: {{ v }}</li>
        </ul>

        <h4>Top modules</h4>
        <ul>
          <li v-for="m in result.modules || []" :key="m">{{ m }}</li>
        </ul>

        <h4>Suggestions</h4>
        <ul>
          <li v-for="s in result.suggestions || []" :key="s">{{ s }}</li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../services/api'

const start = ref(null)
const end = ref(null)
const loading = ref(false)
const result = ref<any>(null)

async function generate() {
  loading.value = true

  try {
    const tickets = await api.listTickets();

    result.value = await api.generateInsights({
      tickets: tickets,
      start: start.value,
      end: end.value
    })

  } catch (err) {
    console.error(err)
    result.value = { summary: "Failed to call DeepSeek API." }
  } finally {
    loading.value = false
  }
}


</script>

<style scoped>
.container { max-width:1100px; }
</style>
