<template>
  <el-collapse accordion v-if="ticket.dev_reports && ticket.dev_reports.length > 0">
    <el-collapse-item
      v-for="report in ticket.dev_reports"
      :key="report.id"
      :name="report.id"
    >
      <!-- Header -->
      <template #title>
        <el-space alignment="center">
          <div style="font-weight: 600">{{ report.assignedDeveloper.fullName }}</div>
          <div style="color: #666; font-size: 13px; margin-top: 2px">
            · Submitted: {{ new Date(report.created_at).toLocaleString() }} · Regression
            Version:
          </div>
          <el-tag type="info" size="small"> {{ report.regression_version }} </el-tag>
        </el-space>
      </template>

      <!-- Content -->
      <el-card shadow="never" class="mb-3">
        <div class="flex justify-between items-center mb-3">
          <el-descriptions :column="2" size="small" border label-width="110px">
            <el-descriptions-item label="Module">
              {{ report.module || "N/A" }}
            </el-descriptions-item>

            <el-descriptions-item label="Issue Type">
              {{ report.issue_type }}
            </el-descriptions-item>

            <el-descriptions-item label="Root Cause">
              {{ report.root_cause || "N/A" }}
            </el-descriptions-item>

            <el-descriptions-item label="GitHub PR">
              <el-link
                v-if="report.github_pr_url"
                :href="report.github_pr_url"
                target="_blank"
                type="primary"
                style="font-weight: 500; font-size: 14px"
              >
                GitHub PR
              </el-link>
              <span v-else>N/A</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-row gutter="16" class="w-full" align="stretch">
          <!-- Report -->
          <el-col :span="14">
        <h4>Developer Report</h4>
            <el-card shadow="never" style="height: 200px; background: var(--el-fill-color-light); border-radius: 6px; " >
              <el-scrollbar style="height: 100%">
                <pre
                  style="
                    margin: 0;
                    white-space: pre-wrap;
                    font-family: var(--el-font-family);
                    font-size: 13px;
                    line-height: 1.6;
                    color: var(--el-text-color-primary);
                  "
                  >{{ report.self_test_report }}</pre
                >
              </el-scrollbar>
            </el-card>
          </el-col>

          <!-- Screenshot -->
          <el-col :span="10" v-if="report.self_test_screenshots">
        <h4>Screenshot</h4>
            <el-image
              :src="getShotURL(report.self_test_screenshots)"
              fit="cover"
              style="width: 100%; height: 200px; border-radius: 6px; cursor: pointer"
              @click="previewUrl = getShotURL(report.self_test_screenshots)"
            />
          </el-col>
        </el-row>
      </el-card>

      <!-- Image preview -->
      <el-image-viewer
        v-if="previewUrl"
        :url-list="[previewUrl]"
        @close="previewUrl = null"
      />
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import type { Ticket } from "../types";
import { ref } from "vue";
const props = defineProps<{ ticket: Ticket }>();

const previewUrl = ref<string | null>(null);

function getShotURL(shoturl: string) {
  return `/api/${shoturl}`;
}
</script>
<style scoped></style>
