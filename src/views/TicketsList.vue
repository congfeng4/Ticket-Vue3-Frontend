<template>
  <div class="container">
    <el-row style="margin-bottom: 12px">
      <el-col :span="18"><TicketFilters @apply="applyFilters" /></el-col>
      <el-col :span="6" style="text-align: right">
        <el-button type="primary" @click="$router.push({ name: 'TicketCreate' })"
          >New Ticket</el-button
        >
      </el-col>
    </el-row>

    <div class="card-wrapper">
      <el-skeleton v-if="loading" :rows="3" animated>
        <el-skeleton-item variant="text" style="width: 60%; margin-bottom: 8px" />
        <el-skeleton-item variant="text" style="width: 40%; margin-bottom: 8px" />
        <el-skeleton-item variant="p" style="height: 60px" />
      </el-skeleton>
        <TicketCard v-for="t in tickets" :key="t.id" :ticket="t" />
        <div v-if="tickets.length === 0 && !loading" class="no-ticket">No tickets</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import api from "../services/api";
import TicketCard from "../components/TicketCard.vue";
import TicketFilters from "../components/TicketFilters.vue";
import type { Ticket } from "../types";

const allTickets = ref<Ticket[]>([]);
const tickets = reactive<Ticket[]>([]);
const currentFilters = reactive({ status: "", severity: "", query: "" });
const loading = ref(true);

async function load() {
  loading.value = true;
  const res = await api.listTickets();
  allTickets.value = res || [];
  applyCurrentFilters();
  loading.value = false;
}

function applyFilters(filters: any) {
  currentFilters.status = filters.status || "";
  currentFilters.severity = filters.severity || "";
  currentFilters.query = filters.query || "";
  applyCurrentFilters();
}

onMounted(load);

function applyCurrentFilters() {
  const status = (currentFilters.status || "").toUpperCase();
  const severity = currentFilters.severity || "";
  const query = (currentFilters.query || "").toLowerCase().trim();

  const filtered = allTickets.value.filter((t) => {
    const statusOk = !status || String(t.current_status || "").toUpperCase() === status;
    const severityOk = !severity || t.severity === severity;
    const queryOk =
      !query ||
      String(t.title || "")
        .toLowerCase()
        .includes(query) ||
      String(t.description || "")
        .toLowerCase()
        .includes(query);
    return statusOk && severityOk && queryOk;
  });

  tickets.splice(0, tickets.length, ...filtered);
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
.container {
  max-width: 1100px;
}
.ticket-item {
  width: 60%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
.ticket-item > * {
  width: 100%;
  box-sizing: border-box;
}
.card-wrapper {
  width: 80%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
