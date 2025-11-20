
<template>
<el-card v-for="report in ticket.dev_reports" :key="report.id" style="margin-bottom:6px;">
  <div style="display:flex; justify-content:space-between; gap:12px;">

    <div>
      <div style="font-weight:600;">
        {{ report.assignedDeveloper.fullName }}
      </div>

      <div style="color:#666; font-size:13px; margin-top:2px;">
        Issue Type: {{ report.issue_type }} <br>
        Submitted: {{ new Date(report.created_at).toLocaleString() }}
      </div>

      <div style="margin-top:8px; color:#444;">
        Root Cause: {{ report.root_cause || "No Root Cause Provided" }}
      </div>

      <div style="margin-top:8px; color:#444;">
        Self Test Report: {{ report.self_test_report || "No Self Test Report" }}
      </div>

      <div v-if="report.self_test_screenshots" style="margin-top:8px;">
          <el-image
            style="width: 120px; border-radius:4px;"
            :src="getShotURL(report.self_test_screenshots)"
            fit="cover"
          />
      </div>

      <div v-if="report.github_pr_url" style="margin-top:8px;">
        <a :href="report.github_pr_url" target="_blank" style="font-size:13px;color:#409EFF;">
          GitHub PR
        </a>
      </div>
    </div>

    <div style="text-align:right;">
      <el-tag type="info" size="small">
        v{{ report.regression_version }}
      </el-tag>

      <div v-if="report.module" style="margin-top:6px; color:#888;font-size:12px;">
        {{ report.module }}
      </div>
    </div>
  </div>
</el-card>

</template>
<script setup lang="ts">
import type { Ticket } from '../types'
const props = defineProps<{ ticket: Ticket }>()

function getShotURL(shoturl: string) {
  return `/api/${shoturl}`
}

</script>
