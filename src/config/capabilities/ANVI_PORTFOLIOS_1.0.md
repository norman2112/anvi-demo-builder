# Anvi AI Assistant - Planview Portfolios Capability Reference Guide

Version: February 2026  
Prepared for: Solution Consultants & Implementation Teams  
Product: Planview Portfolios

---

## 1. Actions I Can Perform in Portfolios

### READ Operations (Query & Analysis)

#### Projects
- ✅ Retrieve project details by Project ID(s) with custom attribute selection
- ✅ List all projects within a Work Portfolio
- ✅ Search projects by name (substring matching)
- ✅ Search projects by any attribute field (custom fields, status, owner, etc.)
- ✅ Filter projects by specific attribute values (e.g., Status = "Active")
- ✅ Get project counts with crosstab analysis by attributes (e.g., count by Status, by Owner)
- ✅ Retrieve project hierarchy (parent-child relationships up to root)
- ✅ List projects associated with a specific Strategy

#### Tasks (Work Items)
- ✅ Retrieve task details by Task ID(s) with custom attribute selection (max 10 tasks per request)
- ✅ List all tasks within specified Project(s)
- ✅ Get task dependencies (predecessors/successors) by Task ID
- ✅ Get all dependencies within a Project

#### Strategies
- ✅ Retrieve strategy details by Strategy ID(s) with custom attribute selection
- ✅ List all strategies within a Strategy Portfolio
- ✅ Search strategies by name (substring matching)
- ✅ Get strategy counts with crosstab analysis by attributes
- ✅ Retrieve strategy hierarchy (parent-child relationships up to root)

#### Resources
- ✅ Retrieve resource details by Resource ID(s) with custom attribute selection
- ✅ List all resources within a Resource Portfolio
- ✅ Search resources by name
- ✅ Get resource counts with crosstab analysis
- ✅ Retrieve resource hierarchy (organizational structure up to root)

#### Portfolios
- ✅ List all Work Portfolios in the system
- ✅ List all Strategy Portfolios in the system
- ✅ List all Resource Portfolios in the system
- ✅ Search portfolios by name (work, strategy, or resource types)

#### Attributes & Metadata
- ✅ Intelligent attribute search - I can analyze your natural language question and identify relevant attributes for projects, strategies, resources, or work items
- ✅ This is REQUIRED before using any tool that needs an `attribute_list` parameter

### WRITE Operations (Modifications)

#### OKRs (Objectives & Key Results)
When OKRs are stored in Portfolios containers (Projects, Tasks, or Strategies):
- ✅ Create Objectives linked to Portfolios Projects, Tasks, or Strategies
- ✅ Update Objective name or description
- ✅ Create Key Results under Objectives
- ✅ Update Key Result name, description, or dates
- ✅ Add progress updates to Key Results with numerical values and comments

### ANALYSIS Operations

- ✅ Mathematical calculations - Complex expressions with functions (sqrt, log, mean, median, std, var, min, max, sum, etc.)
- ✅ Count operations - Count items in lists
- ✅ Cross-tabulation - Aggregate counts by multiple dimensions
- ✅ Dependency analysis - Map predecessor/successor relationships

### KNOWLEDGE Operations

- ✅ Query Planview Knowledge Bases - Access Customer Success Centers for AgilePlace, Portfolios, Viz, AdaptiveWork, etc.
- ✅ Query organization documents - Search uploaded company policies, procedures, and documentation
- ✅ Send emails via Planview Notification Service on your behalf

---

## 2. Limitations & Constraints

### ❌ CANNOT Perform (Write Operations)

#### Projects
- ❌ Cannot CREATE new projects
- ❌ Cannot UPDATE project attributes (status, dates, budget, custom fields)
- ❌ Cannot DELETE projects
- ❌ Cannot MOVE projects between portfolios
- ❌ Cannot ARCHIVE or RESTORE projects

#### Tasks
- ❌ Cannot CREATE new tasks
- ❌ Cannot UPDATE task attributes
- ❌ Cannot DELETE tasks
- ❌ Cannot CREATE or MODIFY task dependencies
- ❌ Cannot UPDATE task assignments

#### Strategies
- ❌ Cannot CREATE new strategies
- ❌ Cannot UPDATE strategy attributes
- ❌ Cannot DELETE strategies
- ❌ Cannot MOVE strategies between portfolios

#### Resources
- ❌ Cannot CREATE new resources (people, roles, organizational units)
- ❌ Cannot UPDATE resource attributes (capacity, cost rates, skills)
- ❌ Cannot DELETE resources
- ❌ Cannot MODIFY resource assignments to projects/tasks

#### Portfolios
- ❌ Cannot CREATE new portfolios (work, strategy, or resource)
- ❌ Cannot UPDATE portfolio settings or attributes
- ❌ Cannot DELETE portfolios

#### Financial Management
- ❌ Cannot CREATE or UPDATE budgets
- ❌ Cannot MODIFY cost plans or financial forecasts
- ❌ Cannot ENTER or UPDATE actuals (costs, effort)
- ❌ Cannot CREATE or MODIFY financial scenarios
- ❌ Cannot APPROVE or REJECT financial transactions

#### Capacity & Resource Management
- ❌ Cannot CREATE or UPDATE capacity plans
- ❌ Cannot MODIFY resource allocations
- ❌ Cannot ENTER timesheet data
- ❌ Cannot APPROVE timesheets
- ❌ Cannot CREATE staffing requests

#### Scenarios & What-If Analysis
- ❌ Cannot CREATE scenarios
- ❌ Cannot MODIFY scenario parameters
- ❌ Cannot COMPARE scenarios
- ❌ Cannot PROMOTE scenarios to baseline

#### Reports & Dashboards
- ❌ Cannot CREATE new reports
- ❌ Cannot MODIFY report definitions
- ❌ Cannot CREATE dashboards
- ❌ Cannot SCHEDULE report distribution
- ❌ However: I CAN retrieve data and perform analysis that you would typically use reports for

#### Workflows & Approvals
- ❌ Cannot INITIATE workflow processes
- ❌ Cannot APPROVE or REJECT workflow items
- ❌ Cannot MODIFY workflow definitions

#### Security & Permissions
- ❌ Cannot MODIFY user permissions
- ❌ Cannot CREATE or UPDATE security roles
- ❌ Cannot GRANT or REVOKE access

### ⚠️ Known Constraints

1. Batch Limits: Maximum 10 tool calls per response - complex workflows require multiple interactions
2. Task Retrieval Limit: Maximum 10 tasks per `getTasksByTaskIds` request
3. Search Limitations: Substring matching only (not fuzzy search or advanced pattern matching)
4. Attribute Requirements: MUST call `searchAttributes` before using any tool requiring `attribute_list`
5. No Undo: Write operations (OKR creation/updates) cannot be automatically undone
6. ID Dependency: I can ONLY use IDs from screen context or prior tool responses - never from examples
7. No Direct Data Export: Cannot export to Excel, CSV, or other file formats (but can format data for you to copy)
8. Truncation: Large datasets may be truncated - I'll notify you and offer to retrieve complete data

### 🔒 Read-Only Access Areas

- All core Portfolios entities (Projects, Tasks, Strategies, Resources, Portfolios)
- All financial data (budgets, actuals, forecasts)
- All capacity and allocation data
- All timesheet and activity data
- All workflow and approval states
- All reports and dashboards
- All system configuration and metadata

---

## 3. Data Access Capabilities

### ✅ Can Query in Detail

#### Work Portfolios & Projects
- Portfolio metadata (name, ID, entity code)
- Project attributes (all standard and custom fields)
- Project hierarchy (parent-child relationships)
- Project-strategy associations
- Task details and attributes
- Task dependencies (predecessors/successors)
- Work hierarchy from root to any project

#### Strategy Portfolios & Strategies
- Portfolio metadata
- Strategy attributes (all standard and custom fields including hypothesis, objectives)
- Strategy hierarchy (parent-child relationships)
- Strategy-project linkages
- Strategy hierarchy from root to any strategy

#### Resource Portfolios & Resources
- Portfolio metadata
- Resource attributes (all standard and custom fields)
- Resource hierarchy (organizational structure)
- Resource types (people, roles, organizational units)
- Resource hierarchy from root to any resource

#### OKRs (When Stored in Portfolios Containers)
- Objectives linked to Portfolios Projects, Tasks, or Strategies
- Key Results with progress tracking
- Work items connected to Key Results
- Objective hierarchies and relationships

### 📊 Level of Detail Available

- Attribute Flexibility: Can retrieve ANY attribute (standard or custom) if you know to ask for it
- Intelligent Discovery: Can suggest relevant attributes based on your natural language question
- Hierarchical Context: Can traverse up/down organizational, work, and strategy hierarchies
- Relational Data: Can map relationships between strategies, projects, tasks, and resources
- Aggregations: Can count, group, and cross-tabulate data by any attribute
- Dependencies: Can map full dependency networks within projects

### ❌ Cannot Access

- Timesheet entry details (hours logged per day/task)
- Detailed financial transactions (invoice details, purchase orders)
- Capacity plan details (resource availability by time period)
- Scenario comparison data
- Report execution history
- User activity logs or audit trails
- System configuration details
- Attachment contents or document repositories

---

## 4. Execution Model

### Sequential Processing

One State-Changing Action at a Time:
- I execute CREATE, UPDATE, DELETE operations sequentially
- I wait for and verify each response before proceeding
- This prevents cascading failures and ensures data integrity

Batch Read Operations:
- I can call up to 10 read-only tools simultaneously when there are no dependencies
- Example: Retrieving multiple projects, searching attributes, and counting resources in parallel

### Error Handling

Immediate Detection:
- I check every tool response for errors, warnings, and truncation notices
- I inform you immediately if something fails

Verification Protocol:
- If a tool returns "not found" or empty results, I re-verify the ID before proceeding
- I never assume an operation succeeded without confirmation

No Automatic Retry:
- I do not automatically retry failed operations
- I explain what went wrong and ask how you'd like to proceed

Mid-Workflow Failures:
- If a multi-step workflow fails partway through, I report exactly what completed and what failed
- I provide options to continue, rollback (if possible), or abort

### Undo Capabilities

❌ No Automatic Undo:
- I cannot automatically undo CREATE or UPDATE operations
- OKRs created or modified require manual deletion/correction in the UI

✅ Can Assist with Manual Undo:
- I can provide the exact IDs and values to help you manually reverse changes
- I can guide you through the UI steps to undo actions

### Rate Limits & Timeouts

Tool Call Limits:
- Maximum 10 tool calls per response
- Complex workflows require multiple back-and-forth interactions

No Known Rate Limits:
- I'm not aware of specific API rate limits enforced by Planview
- However, extremely large data requests may timeout or truncate

Timeout Behavior:
- If a request times out, I'll inform you and suggest breaking it into smaller chunks
- I can retrieve data in batches (e.g., 50 projects at a time)

### Data Consistency

Point-in-Time Queries:
- Each tool call retrieves current data at that moment
- Data may change between calls in a multi-step workflow

No Transaction Support:
- I cannot lock data or ensure consistency across multiple operations
- If data changes mid-workflow, I'll detect and report discrepancies

---

## 5. Integrations & Cross-Product Actions

### ✅ AgilePlace Integration

From Portfolios Context:
- ✅ List Objectives on an AgilePlace Board
- ✅ Retrieve Objectives with details from a Board
- ✅ Get counts of Objectives and Key Results on a Board
- ✅ Create Objectives on an AgilePlace Board
- ✅ Create Key Results linked to Board Objectives
- ✅ Update Objectives and Key Results on Boards
- ✅ Find Objectives connected to AgilePlace Cards (by Work ID)
- ✅ Find Key Results supported by AgilePlace Cards

Limitation:
- ❌ Cannot directly query or modify AgilePlace Cards, Lanes, or Board structure
- ❌ Cannot create or update AgilePlace work items
- ✅ Can only interact with OKRs that are stored on AgilePlace Boards

### ✅ OKRs Integration

Bidirectional Access:
- ✅ OKRs stored in Portfolios containers (Projects, Tasks, Strategies) are fully accessible
- ✅ OKRs stored on AgilePlace Boards are accessible
- ✅ Can create and update OKRs in either system

Work Item Connections:
- ✅ Can see which Portfolios Tasks or Strategies support Key Results
- ✅ Can see which AgilePlace Cards support Key Results
- ❌ Cannot CREATE new connections between work items and Key Results

### ❌ Limited/No Integration

Projectplace:
- ❌ No direct integration capabilities
- ❌ Cannot query or modify Projectplace projects, tasks, or boards

AdaptiveWork (Clarizen):
- ❌ No direct integration capabilities
- ❌ Cannot query or modify AdaptiveWork projects or work items

Viz:
- ❌ No direct integration capabilities
- ❌ Cannot query or create Viz visualizations

LeanKit:
- ❌ No direct integration capabilities

### ✅ Knowledge Base Access

Cross-Product Documentation:
- ✅ Can query Customer Success Centers for all Planview products:
  - AgilePlace, Portfolios, Viz, AdaptiveWork, Projectplace, PPMPro, Planview.Me, Admin, Advisor
- ✅ Can answer "how-to" questions by searching product documentation

### ✅ Email Integration

- ✅ Can send emails on your behalf via Planview Notification Service
- ✅ Recipients must be within your email domain
- ✅ Can draft email content based on Portfolios data

---

## 6. Best Use Cases & Reliability Guidance

### 🌟 Where I Excel (Highest Reliability)

#### 1. Data Discovery & Exploration
Use Case: "Show me all active projects in the Digital Transformation portfolio owned by the Engineering team"
- Why I'm Great: I can search attributes, filter, and present data in human-readable format
- Reliability: ⭐⭐⭐⭐⭐ (Excellent)

#### 2. Cross-Portfolio Analysis
Use Case: "Compare resource allocation across all three regional portfolios and identify overallocated resources"
- Why I'm Great: I can query multiple portfolios, aggregate data, and perform calculations
- Reliability: ⭐⭐⭐⭐⭐ (Excellent)

#### 3. Dependency Mapping
Use Case: "Show me all tasks dependent on Task X and identify the critical path"
- Why I'm Great: I can traverse dependency networks and explain relationships
- Reliability: ⭐⭐⭐⭐⭐ (Excellent)

#### 4. Hierarchy Navigation
Use Case: "Show me the full organizational hierarchy for this resource and all projects they're assigned to"
- Why I'm Great: I can traverse hierarchies in both directions and connect related entities
- Reliability: ⭐⭐⭐⭐⭐ (Excellent)

#### 5. Ad-Hoc Reporting
Use Case: "Give me a breakdown of project counts by status and priority for Q1 2026"
- Why I'm Great: I can retrieve, filter, aggregate, and format data without pre-built reports
- Reliability: ⭐⭐⭐⭐⭐ (Excellent)

#### 6. OKR Management
Use Case: "Create Q1 objectives for the Product team and set up key results with targets"
- Why I'm Great: Full CRUD capabilities for OKRs in Portfolios containers
- Reliability: ⭐⭐⭐⭐ (Very Good - requires correct container IDs)

#### 7. Intelligent Search
Use Case: "Find all projects related to 'customer experience' that are behind schedule"
- Why I'm Great: I can search by name and filter by attributes in one workflow
- Reliability: ⭐⭐⭐⭐ (Very Good)

#### 8. Data Validation
Use Case: "Check if any projects in this portfolio are missing required custom field values"
- Why I'm Great: I can retrieve all projects, check attributes, and report gaps
- Reliability: ⭐⭐⭐⭐ (Very Good)

### ⚠️ Use with Caution (Moderate Reliability)

#### 1. Large Dataset Operations
Use Case: "Analyze all 500 projects across 10 portfolios"
- Challenge: May hit truncation limits or require multiple batches
- Reliability: ⭐⭐⭐ (Good - but requires patience and iteration)
- Recommendation: Break into smaller chunks (e.g., one portfolio at a time)

#### 2. Complex Multi-Step Workflows
Use Case: "Create 20 objectives with 3 key results each across 5 projects"
- Challenge: 10-tool limit per response means multiple interactions required
- Reliability: ⭐⭐⭐ (Good - but time-consuming)
- Recommendation: Batch in groups of 3-5 objectives per interaction

#### 3. Ambiguous Attribute Names
Use Case: "Show me project status" (when there are multiple status-related fields)
- Challenge: Custom fields may have similar names
- Reliability: ⭐⭐⭐ (Good - but requires clarification)
- Recommendation: Use `searchAttributes` first to identify the exact field

### ❌ Avoid Automating Through Me (Low Reliability / Not Supported)

#### 1. Bulk Data Modifications
Use Case: "Update the status of 100 projects to 'On Hold'"
- Why Avoid: I cannot update project attributes at all
- Alternative: Use Portfolios bulk edit features in the UI

#### 2. Financial Planning & Budgeting
Use Case: "Create a budget for this project with monthly cost breakdown"
- Why Avoid: No write access to financial data
- Alternative: Use Portfolios financial planning modules directly

#### 3. Resource Capacity Planning
Use Case: "Allocate 50% of John's capacity to Project X for Q2"
- Why Avoid: No write access to resource allocations
- Alternative: Use Portfolios resource management UI

#### 4. Scenario Modeling
Use Case: "Create a what-if scenario where we delay Project A by 3 months"
- Why Avoid: No access to scenario functionality
- Alternative: Use Portfolios scenario planning features

#### 5. Workflow Approvals
Use Case: "Approve all pending project change requests"
- Why Avoid: No access to workflow or approval actions
- Alternative: Use Portfolios workflow UI

#### 6. Time-Sensitive Operations
Use Case: "Monitor this dashboard and alert me if any project goes red"
- Why Avoid: I'm not a monitoring service; I respond to queries only
- Alternative: Use Portfolios alerting and notification features

---

## 7. Most Complex End-to-End Workflow Example

### Scenario: Quarterly OKR Setup with Cross-Portfolio Analysis

Business Need: As a Portfolio Manager, I need to:
1. Analyze all active projects across multiple portfolios
2. Identify strategic priorities
3. Create quarterly objectives aligned to strategies
4. Set up key results with baseline and target values
5. Document the OKR structure in an email to stakeholders

---

### Step-by-Step Execution

#### PHASE 1: Discovery & Analysis (Read-Only)

Step 1: Identify Available Portfolios
- Action: List all work portfolios in the system
- Tool: `p_Portfolios_listPortfolios` (entity: "work_portfolio")
- User Input Needed: None (automated)
- Output: List of portfolio names and IDs

Step 2: Select Target Portfolios
- Action: User selects which portfolios to analyze (e.g., "Digital Products" and "Customer Experience")
- User Input Needed: ✋ Portfolio selection
- My Action: Note the Portfolio IDs from Step 1

Step 3: Discover Relevant Attributes
- Action: Identify which project attributes are relevant for analysis
- Tool: `p_Portfolios_searchAttributes` (entity: "project", question: "What attributes show project status, strategic alignment, priority, and owner?")
- User Input Needed: None (automated)
- Output: List of attribute IDs (e.g., "Status", "StrategicPriority", "Owner", "StrategyAlignment")

Step 4: Retrieve Projects from Each Portfolio
- Action: Get all projects with relevant attributes from selected portfolios
- Tools: `p_Portfolios_getProjectsByPortfolioId` (called once per portfolio)
- User Input Needed: None (using IDs from Steps 2 & 3)
- Output: Complete project list with status, priority, strategy links, owners

Step 5: Analyze Project Distribution
- Action: Count projects by strategic priority and status
- Tool: `p_Portfolios_getCountsByWorkPortfolioId` (with attribute_list: ["Status", "StrategicPriority"])
- User Input Needed: None (automated)
- Output: Cross-tab showing project counts (e.g., "15 High Priority Active projects, 8 Medium Priority On Hold")

Step 6: Identify Top Strategies
- Action: Search for specific strategies mentioned by user or list all strategies
- Tool: `p_Portfolios_searchStrategyByName` OR `p_Portfolios_listStrategiesByPortfolioId`
- User Input Needed: ✋ Strategy names or portfolio selection
- Output: Strategy IDs and names

Step 7: Link Projects to Strategies
- Action: For each priority strategy, find associated projects
- Tool: `p_Portfolios_listProjectsByStrategyId` (called once per strategy)
- User Input Needed: None (using Strategy IDs from Step 6)
- Output: Projects grouped by strategy

Step 8: Present Analysis to User
- Action: Format and present findings in human-readable format
- Output Example:
  ```
  📊 Portfolio Analysis Summary:
  
  Digital Products Portfolio (ID: 5872):
  - 23 Active Projects
  - 15 High Priority, 8 Medium Priority
  - Top Strategy: "Customer Digital Experience" (12 projects)
  
  Customer Experience Portfolio (ID: 5901):
  - 18 Active Projects
  - 10 High Priority, 8 Medium Priority
  - Top Strategy: "Omnichannel Engagement" (9 projects)
  
  Recommended OKR Focus Areas:
  1. Customer Digital Experience
  2. Omnichannel Engagement
  3. Platform Modernization
  ```

---

#### PHASE 2: OKR Structure Planning (Collaborative)

Step 9: Define Objective Hierarchy
- Action: Retrieve available objective levels
- Tool: `o_OKR_listObjectiveLevels`
- User Input Needed: None (automated)
- Output: Level names and depth values (e.g., "Enterprise" = 1, "Portfolio" = 2, "Team" = 3)

Step 10: Confirm OKR Structure
- Action: Present proposed structure to user
- User Input Needed: ✋ Approval and refinement
- Example:
  ```
  Proposed Q1 2026 OKR Structure:
  
  Portfolio Level (Level 2):
  - Objective: "Accelerate Digital Customer Experience"
    - KR1: Increase mobile app engagement from 45% to 65%
    - KR2: Reduce customer onboarding time from 5 days to 2 days
    - KR3: Achieve NPS score of 50+ (from baseline 38)
  
  - Objective: "Modernize Platform Infrastructure"
    - KR1: Migrate 80% of services to cloud (from 30%)
    - KR2: Reduce system downtime from 4 hours/month to 1 hour/month
  
  Container: Link to "Digital Products" Portfolio Project (ID: 12345)
  Timeline: Q1 2026 (Jan 1 - Mar 31)
  
  Proceed with creation? [Yes/No/Modify]
  ```

---

#### PHASE 3: OKR Creation (Write Operations)

Step 11: Identify Container
- Action: Determine where OKRs will be stored (Portfolios Project, Task, or Strategy)
- User Input Needed: ✋ Container selection (e.g., "Link to the Digital Transformation project")
- My Action: Search for the project/task/strategy by name
- Tool: `p_Portfolios_searchProjectByName`
- Output: Container ID and type

Step 12: Create First Objective
- Action: Create "Accelerate Digital Customer Experience" objective
- Tool: `o_OKRActions_createObjective`
- Parameters:
  - obj_name: "Accelerate Digital Customer Experience"
  - obj_level: 2 (Portfolio level)
  - starts_at: "2026-01-01T00:00:00+00:00"
  - ends_at: "2026-03-31T23:59:59+00:00"
  - container_type: "portfolios_work"
  - container_id: "12345" (from Step 11)
  - obj_description: "Drive measurable improvements in digital customer engagement and satisfaction through enhanced mobile experience and streamlined onboarding"
- User Input Needed: None (using confirmed structure from Step 10)
- Output: New Objective ID (e.g., "OBJ-789")

Step 13: Verify Objective Creation
- Action: Retrieve the newly created objective to confirm
- Tool: `o_OKR_getObjectiveByObjectiveId` (objective_id: "OBJ-789")
- User Input Needed: None (automated verification)
- Output: Confirmation with link to objective

Step 14: Create First Key Result
- Action: Create "Increase mobile app engagement" KR
- Tool: `o_OKRActions_createKeyResult`
- Parameters:
  - objective_id: "OBJ-789"
  - key_result_name: "Increase mobile app engagement rate"
  - starts_at: "2026-01-01T00:00:00+00:00"
  - ends_at: "2026-03-31T23:59:59+00:00"
  - starting_value: 45
  - target_value: 65
  - key_result_description: "Measured as percentage of active users engaging with mobile app weekly"
- User Input Needed: None (using confirmed structure)
- Output: New Key Result ID (e.g., "KR-1001")

Step 15: Create Remaining Key Results for Objective 1
- Action: Create KR2 and KR3 (one at a time, sequentially)
- Tool: `o_OKRActions_createKeyResult` (called twice more)
- User Input Needed: None (automated)
- Output: KR-1002, KR-1003

Step 16: Create Second Objective
- Action: Create "Modernize Platform Infrastructure" objective
- Tool: `o_OKRActions_createObjective`
- User Input Needed: None (using confirmed structure)
- Output: New Objective ID (e.g., "OBJ-790")

Step 17: Create Key Results for Objective 2
- Action: Create KR1 and KR2 (one at a time, sequentially)
- Tool: `o_OKRActions_createKeyResult` (called twice)
- User Input Needed: None (automated)
- Output: KR-1004, KR-1005

---

#### PHASE 4: Documentation & Communication (Output)

Step 18: Retrieve Complete OKR Structure
- Action: Get full details of both objectives with all key results
- Tool: `o_OKR_getObjectiveDetailsByObjectiveId` (called for each objective)
- User Input Needed: None (automated)
- Output: Complete OKR hierarchy with links

Step 19: Format Summary Report
- Action: Create formatted markdown summary
- Output Example:
  ```markdown
  # Q1 2026 OKR Summary - Digital Products Portfolio
  
  ## Objective 1: [Accelerate Digital Customer Experience](https://portfolios.planview.com/okr/obj-789)
  Timeline: January 1 - March 31, 2026  
  Owner: Digital Products Team  
  Container: Digital Transformation Project
  
  ### Key Results:
  1. [Increase mobile app engagement rate](https://portfolios.planview.com/okr/kr-1001)
     - Baseline: 45% → Target: 65%
     - Current Progress: 45% (0% complete)
  
  2. [Reduce customer onboarding time](https://portfolios.planview.com/okr/kr-1002)
     - Baseline: 5 days → Target: 2 days
     - Current Progress: 5 days (0% complete)
  
  3. [Achieve NPS score of 50+](https://portfolios.planview.com/okr/kr-1003)
     - Baseline: 38 → Target: 50
     - Current Progress: 38 (0% complete)
  
  ---
  
  ## Objective 2: [Modernize Platform Infrastructure](https://portfolios.planview.com/okr/obj-790)
  Timeline: January 1 - March 31, 2026  
  Owner: Platform Engineering Team  
  Container: Digital Transformation Project
  
  ### Key Results:
  1. [Migrate services to cloud](https://portfolios.planview.com/okr/kr-1004)
     - Baseline: 30% → Target: 80%
     - Current Progress: 30% (0% complete)
  
  2. [Reduce system downtime](https://portfolios.planview.com/okr/kr-1005)
     - Baseline: 4 hours/month → Target: 1 hour/month
     - Current Progress: 4 hours (0% complete)
  
  ---
  
  Next Steps:
  - Review OKRs with team leads
  - Connect supporting projects to Key Results
  - Schedule weekly progress check-ins
  - Set up automated progress tracking
  ```

Step 20: Send Email to Stakeholders
- Action: Draft and send email with OKR summary
- Tool: `e_EmailAssistant_send_email`
- User Input Needed: ✋ Recipient email address(es)
- Parameters:
  - recipient: "stakeholders@company.com"
  - subject: "Q1 2026 OKRs Created - Digital Products Portfolio"
  - body: [Formatted summary from Step 19]
  - agentName: "Anvi Chat"
- Output: Email sent confirmation

---

### Workflow Summary

Total Steps: 20  
User Input Required: 5 decision points  
Tool Calls: ~15-18 (depending on number of portfolios/strategies)  
Estimated Time: 10-15 minutes (with user collaboration)  
Success Rate: ⭐⭐⭐⭐ (Very High - assuming correct IDs and permissions)

What Makes This Complex:
1. Multi-phase workflow (Discovery → Planning → Execution → Documentation)
2. Cross-entity operations (Portfolios + OKRs + Email)
3. Sequential write operations (must create objectives before key results)
4. Data aggregation and analysis (counting, filtering, grouping)
5. User collaboration points (requires decisions and approvals)
6. Error handling (verification after each creation step)
7. Output formatting (human-readable reports with hyperlinks)

Where I Need User Input:
- Portfolio selection (Step 2)
- Strategy identification (Step 6)
- OKR structure approval (Step 10)
- Container selection (Step 11)
- Email recipients (Step 20)

What I Handle Automatically:
- All data retrieval and analysis
- Attribute discovery
- Sequential OKR creation with verification
- Report formatting
- Email drafting and sending

---

## 8. Tips for Solution Consultants

### ✅ DO:
- Always provide me with specific Portfolio IDs, Project IDs, or Strategy IDs from the screen context
- Use `searchAttributes` before asking me to retrieve custom field data
- Break large requests into smaller batches (e.g., one portfolio at a time)
- Ask me to verify IDs before performing write operations
- Request formatted output (tables, markdown, lists) for easier reading

### ❌ DON'T:
- Expect me to modify core Portfolios entities (projects, tasks, resources)
- Ask me to perform bulk updates (I can only create/update OKRs one at a time)
- Assume I can access financial or capacity planning data for modifications
- Request real-time monitoring or alerting (I'm query-based, not event-driven)

### 🎯 Best Practices:
1. Start with discovery: "Show me what's in this portfolio" before diving into complex analysis
2. Verify IDs: Always confirm I'm using the correct IDs before write operations
3. Iterate in phases: Break complex workflows into discovery → planning → execution
4. Use me for ad-hoc analysis: I'm faster than building custom reports for one-time questions
5. Leverage cross-tabulation: Ask for counts grouped by multiple attributes for quick insights

---

## 9. Future Capability Roadmap (Not Currently Available)

These are capabilities that would enhance my usefulness but are not currently supported:

- ❌ Create/update/delete Projects, Tasks, Strategies, Resources
- ❌ Modify financial data (budgets, actuals, forecasts)
- ❌ Update resource allocations and capacity plans
- ❌ Create or modify scenarios
- ❌ Execute workflow approvals
- ❌ Generate and export reports to files
- ❌ Real-time monitoring and alerting
- ❌ Bulk operations (mass updates)
- ❌ Direct integration with Projectplace, AdaptiveWork, Viz

---

## Document Version Control

Version: 1.0  
Last Updated: February 21, 2026  
Prepared By: Anvi AI Assistant  
Contact: Your Planview Administrator

---

Questions or feedback on this guide? Please share with your Planview Customer Success Manager or Implementation Consultant.