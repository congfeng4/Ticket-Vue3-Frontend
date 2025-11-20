
export type Role = 'TESTER' | 'DEVELOPER' | 'QA' | 'ADMIN'

export interface User {
  id: string
  username: string
  fullName?: string
  email?: string
  role: Role
}

export interface QAreview {
  id: string
  agree_to_release: true
  comment?: string
  created_at: string
  designatedTester: User
  reviewer: User
}

export interface Regression {
  id: string
  regression_version: string
  passed: boolean
  report?: string
  tester: User
  created_at: string
}

export interface DevReport {
  id: string
  issue_type: string
  root_cause: string
  self_test_report: string
  self_test_screenshots: string
  regression_version: string
  module?: string
  github_pr_url?: string
  assignedDeveloper: User
  created_at: string
}

export type Severity = 'HINT' | 'NORMAL' | 'SEVERE' | 'CRITICAL'

export type TicketStatus =
  | 'OPEN'
  | 'IN_DEVELOPMENT'
  | 'UNDER_REVIEW'
  | 'IN_REGRESSION'
  | 'CLOSED'
  | 'IN_MODIFICATION'
  | 'REOPENED'

export interface Ticket {
  id: string
  title: string
  description: string
  software_name: string
  software_version: string
  discovered_at: string
  severity: Severity
  module?: string
  current_status: TicketStatus
  submitter?: User
  assignee?: User
  qa_reviewer?: User
  qa_reviews?: Array<QAreview>
  regression_tests?: Array<Regression>
  regressor?: User
  dev_reports?: Array<DevReport>
  created_at?: string
  updated_at?: string
}
