
/**
 * Simple API service with mocked endpoints.
 * Replace with real endpoints and remove mocks for production.
 */

import axios from 'axios'
import { useAuthStore } from '../store'
import type { Ticket, User } from '../types'
import { v4 as uuidv4 } from 'uuid'


const isDev = import.meta.env.MODE === 'development'
const api = axios.create({
  baseURL: isDev ? '/api' : 'http://101.43.85.43:8000', // 开发用代理，生产直连
  timeout: 5000
})

api.interceptors.request.use(config => {
  const auth = useAuthStore()
  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }
  return config
})


export default {
  // Login 
  async login(username: string, password: string) {
    try {
      const response = await api.post('/api/login/', { username, password })
      const { token, user } = response.data
      return { token, user }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('username or password error')
      }
      throw new Error(error.message || 'Login fail')
    }
  },

  async listUsers() {
      try {
        const response = await api.get('/api/users/') 
        return response.data 
      } catch (error: any) {
        console.error('Get users list error:', error)
        throw new Error(error.message || 'Fail to get users list')
      }
    },


  // Tickets
  async listTickets() {
      try {
        const response = await api.get('/api/tickets/')
        return response.data
      } catch (error: any) {
        console.error('Get tickets list error:', error)
        throw new Error(error.message || 'Fail to get tickets list')
      }
  },

  async getTicket(id: string) {
      try {
        const response = await api.get(`/api/tickets/${id}/`)
        return response.data
      } catch (error: any) {
        console.error('Get ticket', id ,' error:', error)
        throw new Error(error.message)
      }
  },

  async createTicket(payload: Partial<Ticket>) {
    const now = new Date().toISOString()
    const ticket = {
      title: payload.title || 'Untitled',
      description: payload.description || '',
      software_name: payload.software_name || '',
      software_version: payload.software_version || '',
      discovered_at: payload.discovered_at || now,
      severity: (payload.severity as any) || 'NORMAL',
      module: payload.module,
      assignee: payload.assignee
    }
    try{
        const response = await api.post('/api/tickets/', ticket)
        return response.data
      } catch (error: any) {
        console.error('Create ticket error:', error)
        throw new Error(error.message || 'Fail to create ticket')
      }
  },


  async submitDevReport(ticketId: string, report: any, files: File[]) {
    try {
      const formData = new FormData()
      // other fields
      Object.keys(report).forEach(key => {formData.append(key, report[key])})

      // append files
      files.forEach(file => { formData.append('self_test_screenshots', file)})

      const response = await api.post(
        `/api/tickets/${ticketId}/dev-report/`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      return response.data

    } catch (error: any) {
      console.error('Developer update ticket error:', error)
      throw new Error(error.message || 'Fail to update ticket(developer)')
    }
  },


  async submitQAReview(ticketId: string, review: any) {
    try{
    const response = await api.post(`/api/tickets/${ticketId}/qa-review/`, review)
        // return updated ticket
        return response.data
      } catch (error: any) {
        console.error('QA review ticket error:', error)
        throw new Error(error.message || 'Fail to update ticket(QA)')
      }
  },

  async submitRegression(ticketId: string, regression: any) {
    try{
    const response = await api.post(`/api/tickets/${ticketId}/regression/`, regression)
        // return updated ticket
        return response.data
      } catch (error: any) {
        console.error('Regression ticket error:', error)
        throw new Error(error.message || 'Fail to update ticket(Regression)')
      }
  },

  async generateInsights(params: { tickets: any[], start: any, end: any }) {
    const { tickets, start, end } = params

    // Convert start/end to timestamps
    const startTime = start ? new Date(start).getTime() : null
    const endTime = end ? new Date(end).getTime() : null

    // Filter tickets by date range
    const filtered = tickets.filter(ticket => {
      const t = new Date(ticket.created_at).getTime()
      if (startTime && t < startTime) return false
      if (endTime && t > endTime) return false
      return true
    })

    // Prepare DeepSeek payload
    const payload = {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are a software quality analysis assistant. You MUST output a single JSON object with EXACTLY these fields: summary (string), severity (object counting tickets by severity), modules (array of unique modules with highest frequency first), suggestions (array of improvement recommendations). Do not output any code block or markdown."
        },
        {
          role: "user",
          content: `
            Analyze the following tickets and produce ONLY the aggregated JSON structure:

            - summary: Overall description of what the tickets indicate
            - severity: Count tickets by severity (CRITICAL, MAJOR, MINOR, etc.)
            - modules: List of modules sorted by how often they appear
            - suggestions: High-value engineering improvement recommendations

            Here are the tickets:
            ${JSON.stringify(filtered, null, 2)}
                  `
        }
      ]
    }


    // Use fetch to call DeepSeek API
    const resp = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(payload)
    })

    const data = await resp.json()

    // Extract model output
    let text = data.choices?.[0]?.message?.content || ""

    // Remove Markdown wrappers
    text = text.replace(/```json/gi, "").replace(/```/g, "").trim()

    // Parse JSON
    try {
      return JSON.parse(text)
    } catch (err) {
      console.error("JSON parse error:", err, "raw:", text)
      return {
        summary: "The model returned content that could not be parsed as JSON.",
        raw: text
      }
    }
  }

}































// ----------------------------------------------------------------------------------
// const client = axios.create({
//   baseURL: '/api',
//   timeout: 10000
// })