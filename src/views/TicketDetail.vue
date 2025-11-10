<template>
  <div class="container">
    <el-card v-if="ticket">
      <div style="display: flex; justify-content: space-between; align-items: flex-start">
        <div>
          <h3>{{ ticket.title }}</h3>
          <div style="color: #666">
            {{ ticket.software_name }} · {{ ticket.software_version }} · Module:
            {{ ticket.module || "-" }}
          </div>
          <div style="margin-top: 8px">
            Submitted: {{ new Date(ticket.created_at || "").toLocaleString() }}
          </div>
        </div>

        <div style="text-align: right">
          <el-tag :type="severityType">{{ ticket.severity }}</el-tag>
          <div style="margin-top: 8px; font-weight: 600">{{ ticket.current_status }}</div>
        </div>
      </div>

      <el-divider />

      <el-tabs v-model="tab">
        <el-tab-pane label="Description" name="desc">
          <div style="white-space: pre-wrap">{{ ticket.description }}</div>
        </el-tab-pane>

        <el-tab-pane label="Developer Report" name="dev">
          <div v-if="isDev">
            <DevReportForm @submit="submitDevReport" />
          </div>
          <div v-else>
            <p style="color: #666">
              Developer report view (demo) — when developer submits, content will appear
              here.
            </p>
          </div>
        </el-tab-pane>

        <el-tab-pane label="QA Review" name="qa">
            <QAReviewCard :ticket="ticket" />
          <div v-if="isQA">
            <QAReviewForm @submit="submitQA" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Regression" name="reg">
          <div v-if="isTester">
            <RegressionForm @submit="submitRegression" />
          </div>
          <div v-else>
            <p style="color: #666">
              Regression area — tester will run regression and submit results.
            </p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import api from "../services/api";
import type { Ticket } from "../types";
import DevReportForm from "../components/DevReportForm.vue";
import QAReviewForm from "../components/QAReviewForm.vue";
import QAReviewCard from "../components/QAReviewCard.vue";
import RegressionForm from "../components/RegressionForm.vue";
import { useAuthStore } from "../store";

const route = useRoute();
const id = route.params.id as string;
const ticket = ref<Ticket | null>(null);
const tab = ref("desc");
const auth = useAuthStore();

onMounted(async () => {
  ticket.value = await api.getTicket(id);
});

async function submitDevReport(rep: any) {
  await api.submitDevReport(id, rep);
  ticket.value = await api.getTicket(id);
  alert("Developer report submitted to QA (demo).");
}

async function submitQA(review: any) {
  await api.submitQAReview(id, review);
  ticket.value = await api.getTicket(id);
  alert("QA review submitted (demo).");
}

async function submitRegression(r: any) {
  await api.submitRegression(id, r);
  ticket.value = await api.getTicket(id);
  alert("Regression submitted (demo).");
}

const isDev = computed(() => auth.user?.role === "DEVELOPER");
const isQA = computed(() => auth.user?.role === "QA");
const isTester = computed(
  () => auth.user?.role === "TESTER" || auth.user?.role === "ADMIN"
);

const severityType = computed(() => {
  if (!ticket.value) return "";
  switch (ticket.value.severity) {
    case "CRITICAL":
      return "danger";
    case "SEVERE":
      return "warning";
    default:
      return "";
  }
});
</script>

<style scoped>
.container {
  max-width: 1100px;
}
</style>
