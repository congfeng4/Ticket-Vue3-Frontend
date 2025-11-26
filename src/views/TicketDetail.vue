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
          <DevReportCard :ticket="ticket" />
          <div v-if="isDev">
            <DevReportForm @submit="submitDevReport" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="QA Review" name="qa">
            <QAReviewCard :ticket="ticket" />
          <div v-if="isQA">
            <QAReviewForm @submit="submitQA" />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Regression" name="reg">
            <RegressionCard :ticket="ticket" />
          <div v-if="isTester">
            <RegressionForm @submit="submitRegression" />
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
import DevReportCard from "../components/DevReportCard.vue";
import QAReviewForm from "../components/QAReviewForm.vue";
import QAReviewCard from "../components/QAReviewCard.vue";
import RegressionCard from "../components/RegressionCard.vue";
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

async function submitDevReport(rep: any, files: File[]) {
  await api.submitDevReport(id, rep, files);
  ticket.value = await api.getTicket(id);
  alert("Developer report submitted to QA.");
}

async function submitQA(review: any) {
  await api.submitQAReview(id, review);
  ticket.value = await api.getTicket(id);
  alert("QA review submitted.");
}

async function submitRegression(r: any) {
  await api.submitRegression(id, r);
  ticket.value = await api.getTicket(id);
  alert("Regression submitted.");
}

const isDev = computed(() => {
  const user = auth.user;
  return (
    user?.role === "DEVELOPER" &&
    (ticket.value?.current_status === "OPEN" || ticket.value?.current_status === "IN_MODIFICATION") &&
    ticket.value?.assignee?.id === user.id
  );
});

const isQA = computed(() => {
  const user = auth.user;
  return (
    user?.role === "QA" &&
    ticket.value?.current_status === "UNDER_REVIEW"
  );
});

const isTester = computed(() => {
  const user = auth.user;
  const status = ticket.value?.current_status;

  const lastQAReview = ticket.value?.qa_reviews?.[ticket.value?.qa_reviews.length - 1];
  return (
    user?.role === "TESTER" &&
    status === "IN_REGRESSION" &&
    lastQAReview?.designatedTester?.id === user.id
  );
});



const severityType = computed(() => {
  if (!ticket.value) return "";
  switch (ticket.value.severity) {
    case "HINT":
      return "info";
    case "NORMAL":
      return "primary";
    case "CRITICAL":
      return "danger";
    case "SEVERE":
      return "warning";
    default:
      return undefined;
  }
});
</script>

<style scoped>
.container {
  max-width: 1100px;
}
</style>
