# Anvi Capabilities for AgilePlace & OKRs
**Version:** 1.0  
**Last Updated:** February 18, 2026  
**Total Operations:** 104  
**Domains:** 14

---

## DOMAIN: Boards 🏗️

### READ Operations

**List All Boards** (`a_AgilePlace_listBoards`)
- I need: nothing
- Optional: none
- Returns: Comprehensive list of all boards user has access to with IDs and names
- Batch: N/A
- Notes: Starting point for board discovery

**Get Board Configuration** (`a_AgilePlace_getBoardConfiguration`)
- I need: board_id
- Optional: none
- Returns: Complete board metadata including custom fields, lanes, card types, settings
- Batch: No
- Notes: Essential for understanding board structure before creating cards

**List Boards by Team** (`a_AgilePlace_listBoardsByTeamId`)
- I need: team_id
- Optional: none
- Returns: Board IDs accessible to specific team
- Batch: No
- Notes: Team-scoped board discovery

**Search Boards** (`a_AgilePlace_searchBoards`)
- I need: search_string
- Optional: none
- Returns: Top 3 most relevant boards with name and ID
- Batch: No
- Notes: Fuzzy search for board discovery

**Get Board History** (`a_AgilePlace_getBoardHistoryByBoardId`)
- I need: board_id
- Optional: start_date, end_date, card_id, lane_id
- Returns: Card movements and changes over time
- Batch: No
- Notes: Useful for analytics and audit trails

---

## DOMAIN: Lanes 🔀

### READ Operations

**List Lanes by Board** (`a_AgilePlace_listLanesByBoardId`)
- I need: board_id
- Optional: none
- Returns: Hierarchical list of lanes with IDs
- Batch: No
- Notes: Required to get lane IDs for card placement

### UPDATE Operations

**Move Cards to Lane** (`a_AgilePlaceActions_updateCardLane`)
- I need: card_ids (array), lane_id
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards to one lane)
- Notes: Changes card position on board

**Reorder Cards Within Lane** (`a_AgilePlaceActions_updateCardOrderByLane`)
- I need: card_ids (array), lane_id
- Optional: none
- Returns: Success confirmation
- Batch: Yes (repositions multiple cards)
- Notes: Only include cards being moved; others shift automatically

---

## DOMAIN: Cards 📊

### CREATE Operations

**Create Single Card** (`a_AgilePlaceActions_createCard`)
- I need: title, board_id
- Optional: description, card_type_id, lane_id, assigned_user_ids, effort_size, priority, planned_start, planned_finish, custom_id, tags, block_reason, parent_card_ids, child_card_ids, incoming_card_ids, outgoing_card_ids
- Returns: Created card object with ID
- Batch: No
- Notes: Use HTML in description for formatting; can establish relationships during creation

### READ Operations

**Get Cards by Board** (`a_AgilePlace_getCardsByBoardId`)
- I need: board_id
- Optional: includeDetails (Y/N), lane_id, lane_types (all/active/backlog), tags (array), type_ids (array)
- Returns: Detailed card information for all matching cards
- Batch: No (but returns multiple cards)
- Notes: Use includeDetails="N" for performance; returns critical info only

**Get Archived Cards** (`a_AgilePlace_getArchivedCardsByBoardId`)
- I need: board_id
- Optional: includeDetails (Y/N), lane_id, tags (array), type_ids (array)
- Returns: Cards in archive lanes
- Batch: No
- Notes: Separate from active cards

**Get Cards by Card IDs** (`a_AgilePlace_getCardsByCardIds`)
- I need: card_ids (comma-separated string, max 10)
- Optional: none
- Returns: Detailed information for specified cards
- Batch: Yes (up to 10 cards)
- Notes: Includes description, status, assignments, dates

**Get Cards by User** (`a_AgilePlace_getCardsByUserIds`)
- I need: user_ids (comma-separated string)
- Optional: board_id, include_details (Y/N), lane_id, lane_types (all/active/backlog)
- Returns: Cards assigned to specified users
- Batch: Yes (multiple users)
- Notes: Can filter by board and lane

**Get Card Status** (`a_AgilePlace_getCardStatusByCardId`)
- I need: card_id
- Optional: none
- Returns: Comprehensive card info including history, connections, dependencies, comments
- Batch: No
- Notes: Most complete single-card view

**List Cards by Board** (`a_AgilePlace_listCardsByBoardId`)
- I need: board_id
- Optional: none
- Returns: Simple list of card IDs and titles
- Batch: No
- Notes: Lightweight alternative to full card retrieval

**Search Cards on Board** (`a_AgilePlace_searchCardsByBoardId`)
- I need: search_terms (array, max 20), board_id
- Optional: none
- Returns: Top 3 most relevant cards per search term with name and ID
- Batch: Yes (multiple search terms)
- Notes: Fuzzy search within specific board

**Search Cards Globally** (`a_AgilePlace_searchCardsGlobally`)
- I need: search_terms (array, max 20)
- Optional: none
- Returns: Top 3 most relevant cards per search term across all boards
- Batch: Yes (multiple search terms)
- Notes: Cross-board search

**Get Card Counts** (`a_AgilePlace_getCountsByBoardId`)
- I need: board_id
- Optional: entity (all/user/lane/card), lane_id, lane_types (all/active/backlog)
- Returns: Aggregated counts by lane, card type, user, lane class, header, priority, blocked status
- Batch: No
- Notes: Analytics and reporting data

### UPDATE Operations

**Update Card Fields** (`a_AgilePlaceActions_updateCardFields`)
- I need: card_ids (array)
- Optional: title, description, card_type_id, effort_size, header, planned_start, planned_finish, priority
- Returns: Updated card confirmation
- Batch: Yes (multiple cards)
- Notes: Only updates provided fields; uses replace operation

**Clear Card Field** (`a_AgilePlaceActions_clearCardField`)
- I need: card_ids (array), field (enum: description/header/planned_start/planned_finish/effort_size/tags/assignments)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, one field)
- Notes: Removes field value completely

**Block Card** (`a_AgilePlaceActions_blockCard`)
- I need: card_id, block_reason
- Optional: none
- Returns: Success confirmation
- Batch: No
- Notes: Sets card as blocked with reason

**Unblock Card** (`a_AgilePlaceActions_unblockCard`)
- I need: card_id, unblock_reason
- Optional: none
- Returns: Success confirmation
- Batch: No
- Notes: Removes blocked status with reason

---

## DOMAIN: Card Assignments 👥

### UPDATE Operations

**Add Card Assignments** (`a_AgilePlaceActions_addCardAssignments`)
- I need: card_ids (array), user_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, multiple users)
- Notes: Appends to existing assignments without removing current ones

**Remove Card Assignments** (`a_AgilePlaceActions_removeCardAssignments`)
- I need: card_ids (array), user_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, multiple users)
- Notes: Removes specified users from assignments

**Clear All Assignments** (`a_AgilePlaceActions_clearCardField`)
- I need: card_ids (array), field="assignments"
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards)
- Notes: Removes all user assignments

---

## DOMAIN: Tags 🏷️

### UPDATE Operations

**Add Tags to Cards** (`a_AgilePlaceActions_addCardTags`)
- I need: card_ids (array), tags (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, multiple tags)
- Notes: Appends tags without removing existing ones

**Remove Tags from Cards** (`a_AgilePlaceActions_removeCardTags`)
- I need: card_ids (array), tags (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, multiple tags)
- Notes: Removes specified tags only

**Clear All Tags** (`a_AgilePlaceActions_clearCardField`)
- I need: card_ids (array), field="tags"
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards)
- Notes: Removes all tags from cards

---

## DOMAIN: Card Hierarchies 🌳

### READ Operations

**Get Card Connections** (`a_AgilePlace_getConnectionsByCardIds`)
- I need: card_ids (array, max 10)
- Optional: none
- Returns: Parent and child card connections
- Batch: Yes (up to 10 cards)
- Notes: Shows hierarchical relationships

### UPDATE Operations

**Add Parent to Cards** (`a_AgilePlaceActions_addCardParent`)
- I need: card_ids (array - children), parent_card_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple children, multiple parents)
- Notes: Establishes parent-child relationships

**Remove Parent from Cards** (`a_AgilePlaceActions_removeCardParent`)
- I need: card_ids (array - children), parent_card_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple children, multiple parents)
- Notes: Deletes parent-child relationships

**Add Children to Cards** (`a_AgilePlaceActions_addCardChild`)
- I need: card_ids (array - parents), child_card_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple parents, multiple children)
- Notes: Establishes parent-child relationships from parent perspective

**Remove Children from Cards** (`a_AgilePlaceActions_removeCardChild`)
- I need: card_ids (array - parents), child_card_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple parents, multiple children)
- Notes: Deletes parent-child relationships from parent perspective

---

## DOMAIN: Dependencies 🔗

### READ Operations

**Get Dependencies by Board** (`a_AgilePlace_getDependenciesByBoardId`)
- I need: board_id
- Optional: lane_id, lane_types (all/active/backlog)
- Returns: All card dependencies on board
- Batch: No (but returns multiple dependencies)
- Notes: Board-wide dependency view

**Get Dependencies by Card** (`a_AgilePlace_getDependenciesByCardId`)
- I need: card_id
- Optional: none
- Returns: Dependencies, direction, timing, creation dates for single card
- Batch: No
- Notes: Detailed single-card dependency information

### CREATE Operations

**Add Card Dependencies** (`a_AgilePlaceActions_addCardDependency`)
- I need: card_ids (array), depends_on_card_ids (array), timing (enum: startToStart/startToFinish/finishToStart/finishToFinish)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple dependent cards, multiple dependency targets)
- Notes: Creates dependency relationships with timing constraints

### DELETE Operations

**Remove Card Dependencies** (`a_AgilePlaceActions_removeCardDependency`)
- I need: card_ids (array), depends_on_card_ids (array)
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards, multiple dependencies)
- Notes: Unlinks specified dependency relationships

---

## DOMAIN: Tasks ✅

### READ Operations

**Get Tasks by Board** (`a_AgilePlace_getTasksByBoardId`)
- I need: board_id
- Optional: includeDetails (Y/N), lane_id, lane_types (all/active/backlog)
- Returns: Detailed task information for all tasks on board
- Batch: No (but returns multiple tasks)
- Notes: Tasks are sub-items within cards

**Get Tasks by Task IDs** (`a_AgilePlace_getTasksByTaskIds`)
- I need: tasks_ids (comma-separated string, max 10)
- Optional: none
- Returns: Detailed information for specified tasks
- Batch: Yes (up to 10 tasks)
- Notes: Includes description, status, assignments, dates

**Get Tasks by User** (`a_AgilePlace_getTasksByUserIds`)
- I need: user_ids (comma-separated string)
- Optional: board_id, include_details (Y/N), lane_id, lane_types (all/active/backlog)
- Returns: Tasks assigned to specified users
- Batch: Yes (multiple users)
- Notes: Can filter by board and lane

**List Tasks by Board** (`a_AgilePlace_listTasksByBoardId`)
- I need: board_id
- Optional: none
- Returns: Simple list of task IDs and titles
- Batch: No
- Notes: Lightweight task discovery

**Search Tasks on Board** (`a_AgilePlace_searchTasksByBoardId`)
- I need: search_string, board_id
- Optional: none
- Returns: Top 3 most relevant tasks with name and ID
- Batch: No
- Notes: Board-scoped task search

**Search Tasks Globally** (`a_AgilePlace_searchTasksGlobally`)
- I need: search_string
- Optional: none
- Returns: Top 3 most relevant tasks across all boards
- Batch: No
- Notes: Cross-board task search

---

## DOMAIN: Comments 💬

### READ Operations

**Get Comments by Card** (`a_AgilePlace_getCommentsByCardId`)
- I need: card_id
- Optional: none
- Returns: Detailed comments for specific card
- Batch: No
- Notes: Discussion and collaboration history

---

## DOMAIN: Users 👤

### READ Operations

**List Users by Board** (`a_AgilePlace_listUsersByBoardId`)
- I need: board_id
- Optional: none
- Returns: Comprehensive list of users with IDs for specific board
- Batch: No
- Notes: Board-scoped user discovery

**List Users by Team** (`a_AgilePlace_listUsersByTeamId`)
- I need: team_id
- Optional: none
- Returns: Comprehensive list of team members with IDs
- Batch: No
- Notes: Team-scoped user discovery

**Search Users Globally** (`a_AgilePlace_searchUsersGlobally`)
- I need: search_string
- Optional: none
- Returns: Top 3 most relevant users with name and ID
- Batch: No
- Notes: Fuzzy search for user discovery

---

## DOMAIN: Teams 👥

### READ Operations

**List All Teams** (`a_AgilePlace_listTeams`)
- I need: nothing
- Optional: none
- Returns: Comprehensive list of teams with IDs
- Batch: No
- Notes: Organization-wide team discovery

**Get Team Details** (`a_AgilePlace_getTeamByTeamId`)
- I need: team_id
- Optional: none
- Returns: Comprehensive team information and metadata
- Batch: No
- Notes: Detailed team configuration

---

## DOMAIN: Planning Series & Increments 📅

### CREATE Operations

**Create Planning Series** (`a_AgilePlaceActions_createPlanningSeries`)
- I need: label
- Optional: board_ids (array), allow_all_boards (boolean)
- Returns: Planning series object with ID
- Batch: No
- Notes: Top-level time frames for planning cycles

**Create Planning Increment** (`a_AgilePlaceActions_createPlanningIncrement`)
- I need: series_id, label, start_date (YYYY-MM-DD), end_date (YYYY-MM-DD)
- Optional: parent_planning_increment_id
- Returns: Planning increment object with ID
- Batch: No
- Notes: Time periods within series; supports nested increments

### READ Operations

**List Planning Series** (`a_AgilePlace_listPlanningSeries`)
- I need: nothing
- Optional: none
- Returns: List of planning series user can access
- Batch: No
- Notes: Organization-wide planning series discovery

**Get Planning Series Details** (`a_AgilePlace_getPlanningSeriesById`)
- I need: series_id
- Optional: none
- Returns: Detailed information about specific planning series
- Batch: No
- Notes: Series configuration and metadata

**Get Increments by Series** (`a_AgilePlace_getIncrementsByPlanningSeriesId`)
- I need: series_id
- Optional: none
- Returns: All planning increments including nested children
- Batch: No
- Notes: Complete increment hierarchy

**Get Increment Progress** (`a_AgilePlace_getIncrementProgressById`)
- I need: series_id, increment_id, status (enum: notStarted/inProgress/completed/committed/unplanned)
- Optional: none
- Returns: Card IDs within increment for specified status
- Batch: No
- Notes: Progress tracking by status category

**Get Increment Status Summary** (`a_AgilePlace_getIncrementStatusById`)
- I need: series_id, increment_id
- Optional: board_ids (array)
- Returns: Counts of cards by status category
- Batch: No
- Notes: Aggregate progress metrics

### UPDATE Operations

**Update Planning Series** (`a_AgilePlaceActions_updatePlanningSeries`)
- I need: series_id
- Optional: label, board_ids (array), allow_all_boards (boolean)
- Returns: Updated series object
- Batch: No
- Notes: Modify series configuration

**Update Planning Increment** (`a_AgilePlaceActions_updatePlanningIncrement`)
- I need: series_id, increment_id
- Optional: label, start_date (YYYY-MM-DD), end_date (YYYY-MM-DD)
- Returns: Updated increment object
- Batch: No
- Notes: Modify increment dates and label

**Add Planning Increment to Cards** (`a_AgilePlaceActions_addCardPlanningIncrement`)
- I need: card_ids (array), series_id, increment_id
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards to one increment)
- Notes: Assigns cards to planning increment

**Remove Planning Increment from Cards** (`a_AgilePlaceActions_removeCardPlanningIncrement`)
- I need: card_ids (array), increment_id
- Optional: none
- Returns: Success confirmation
- Batch: Yes (multiple cards)
- Notes: Unassigns cards from planning increment

---

## DOMAIN: OKRs 🎯

### CREATE Operations

**Create Objective** (`o_OKRActions_createObjective`)
- I need: obj_name, obj_level (integer), starts_at (ISO format), ends_at (ISO format), container_type (enum: agileplace/portfolios_work/portfolios_strategy), container_id
- Optional: obj_description
- Returns: Objective object with ID
- Batch: No
- Notes: Stored in AgilePlace Board or Portfolios container; obj_level is hierarchical depth

**Create Key Result** (`o_OKRActions_createKeyResult`)
- I need: objective_id, key_result_name, starts_at (ISO format), ends_at (ISO format), starting_value (number), target_value (number)
- Optional: key_result_description
- Returns: Key result object with ID
- Batch: No
- Notes: Measurable outcomes connected to objectives

**Add Key Result Progress** (`o_OKRActions_addKeyResultProgress`)
- I need: key_result_id, progress_value (number)
- Optional: progress_comment
- Returns: Success confirmation
- Batch: No
- Notes: Numerical progress updates for key results

### READ Operations

**List All Objectives** (`o_OKR_listObjectives`)
- I need: nothing
- Optional: none
- Returns: Basic info on objective name, ID, ownership
- Batch: No
- Notes: Organization-wide objective discovery

**Get Objective Details** (`o_OKR_getObjectiveByObjectiveId`)
- I need: objective_id
- Optional: none
- Returns: Name, description, dates, progress, parent/children objectives, links
- Batch: No
- Notes: Comprehensive single objective view

**Get Objective Full Details** (`o_OKR_getObjectiveDetailsByObjectiveId`)
- I need: objective_id
- Optional: none
- Returns: Objective info, all key results, parent/children objectives, all connected work items
- Batch: No
- Notes: Most complete objective view including all relationships

**Get Key Results by Objective** (`o_OKR_getKeyResultsByObjectiveId`)
- I need: objective_id
- Optional: none
- Returns: Names, descriptions, dates, progress, targets, links for all key results
- Batch: No
- Notes: All key results for specific objective

**Get Key Result Details** (`o_OKR_getKeyResultByKeyResultId`)
- I need: key_result_id
- Optional: none
- Returns: Name, description, dates, progress, target, parent objective, links
- Batch: No
- Notes: Comprehensive single key result view

**Get Work by Key Results** (`o_OKR_getWorkByKeyResultIds`)
- I need: key_result_ids (array)
- Optional: none
- Returns: Names and links to connected work items
- Batch: Yes (multiple key results)
- Notes: Shows AgilePlace cards or Portfolios work connected to key results

**Get Objectives by Owner** (`o_OKR_getObjectivesByOwnerId`)
- I need: user_id
- Optional: level_depth (integer)
- Returns: Name, description, dates, progress, links for user's objectives
- Batch: No
- Notes: Can filter by hierarchy level

**Get Key Results by Owner** (`o_OKR_getKeyResultsByOwnerId`)
- I need: user_id
- Optional: none
- Returns: Names, descriptions, dates, progress, targets, links for user's key results
- Batch: No
- Notes: User-scoped key result view

**List Objectives by Board** (`o_OKR_listObjectivesByBoardId`)
- I need: board_id
- Optional: none
- Returns: Basic info on objective name, ID, ownership
- Batch: No
- Notes: Board-scoped objective discovery

**Get Objectives by Board** (`o_OKR_getObjectivesByBoardId`)
- I need: board_id
- Optional: level_depth (integer)
- Returns: Name, ID, ownership, dates, progress, links
- Batch: No
- Notes: Detailed board-scoped objectives; can filter by level

**Get Objectives by Work IDs** (`o_OKR_getObjectivesByWorkIds`)
- I need: work_ids (array - AgilePlace card IDs)
- Optional: none
- Returns: All objectives connected to cards through key results
- Batch: Yes (multiple cards)
- Notes: Reverse lookup from work to objectives

**Get Key Results by Work IDs** (`o_OKR_getKeyResultsByWorkIds`)
- I need: work_ids (array - AgilePlace card IDs)
- Optional: none
- Returns: All key results supported by connected cards
- Batch: Yes (multiple cards)
- Notes: Reverse lookup from work to key results

**Get OKR Counts by Board** (`o_OKR_getCountsByBoardId`)
- I need: board_id
- Optional: none
- Returns: Counts of objectives and key results with cross-tabs by level and owner
- Batch: No
- Notes: Analytics for board OKR metrics

**List Objective Levels** (`o_OKR_listObjectiveLevels`)
- I need: nothing
- Optional: none
- Returns: Hierarchy level names and depth values for organization
- Batch: No
- Notes: Required to map human-readable levels to integer IDs

**Search for Objective IDs** (`o_OKR_searchForObjectiveIds`)
- I need: name
- Optional: none
- Returns: Top matching objective names and IDs
- Batch: No
- Notes: Fuzzy search for objective discovery

**Search for Key Result IDs** (`o_OKR_searchForKeyResultIds`)
- I need: name
- Optional: none
- Returns: Top matching key result names and IDs
- Batch: No
- Notes: Fuzzy search for key result discovery

### UPDATE Operations

**Update Objective** (`o_OKRActions_updateObjective`)
- I need: objective_id
- Optional: objective_title_new, description_new
- Returns: Updated objective object
- Batch: No
- Notes: Updates name or description only

**Update Key Result** (`o_OKRActions_updateKeyResult`)
- I need: key_result_id
- Optional: title_new, description_new, start_date_new (ISO format), end_date_new (ISO format)
- Returns: Updated key result object
- Batch: No
- Notes: Updates name, description, or dates

---

## DOMAIN: Utilities 🔧

### UTILITY Operations

**Calculate** (`a_AgilePlace_calculate` / `o_OKR_calculate`)
- I need: expression (string)
- Optional: none
- Returns: Numerical result
- Batch: No
- Notes: Evaluates mathematical expressions; supports operators (+, -, *, /, ^, %) and functions (exp, log, sqrt, abs, ceil, floor, round, mean, median, std, var, min, max, sum, unique, sort)

**Count** (`a_AgilePlace_count` / `o_OKR_count`)
- I need: data (array)
- Optional: none
- Returns: Count of items in list
- Batch: No
- Notes: Counts any items - numbers, strings, etc.

**Get Current Date** (`d_DocumentAssistant_get_current_date`)
- I need: nothing
- Optional: none
- Returns: Current date in "%A, %B %d, %Y" format
- Batch: No
- Notes: Useful for date-based operations

---

## DOMAIN: Knowledge Bases 📚

### READ Operations

**Ask Document Assistant** (`d_DocumentAssistant_ask_document_assistant`)
- I need: question
- Optional: none
- Returns: Answer from organization's uploaded documents
- Batch: No
- Notes: RAG-based search of company policies and documentation; no memory between questions

**Get Knowledge Base Answer** (`p_PlanviewKnowledgeBases_getKnowledgeBaseAnswer`)
- I need: knowledge_base_name (enum: AgilePlace/ProjectPlace/AdaptiveWork/Viz/Portfolios/PPMPro/Planview.Me/Planview Admin/Advisor Customer Success Centers), question
- Optional: none
- Returns: Answer from specific Planview product knowledge base
- Batch: No
- Notes: RAG-based search of official Planview documentation

---

## DOMAIN: Email 📧

### CREATE Operations

**Send Email** (`e_EmailAssistant_send_email`)
- I need: body (markdown format)
- Optional: subject, recipient, agentName
- Returns: Success confirmation
- Batch: No
- Notes: Sends email via Planview Notification Service; recipient must be in user's domain; all emails from centralized Anvi address

---

# Summary Statistics

## Total Operations by Type
- **CREATE:** 8 operations
- **READ:** 67 operations
- **UPDATE:** 24 operations
- **DELETE:** 1 operation
- **UTILITY:** 4 operations

## Batch-Capable Operations
**31 operations** support batch processing

## Key Domains for Demo Configuration
1. **Cards** (13 operations) - Core work item management
2. **OKRs** (24 operations) - Strategic goal management
3. **Dependencies** (3 operations) - Card relationships
4. **Hierarchies** (5 operations) - Parent-child structures
5. **Planning** (11 operations) - Time-based planning
6. **Tags** (3 operations) - Categorization
7. **Assignments** (3 operations) - User allocation

---

# Critical Gaps

These capabilities are NOT currently available:

❌ **No batch card creation** - Must create cards individually  
❌ **No connected card creation** - Must create hierarchy after card creation  
❌ **No card type CRUD** - Card types must exist before card creation  
❌ **No lane CRUD** - Lane structure must exist before card placement  
❌ **No board creation** - Boards must be pre-configured  
❌ **No financial planning API** - SOAP API not exposed in current tools  
❌ **No card deletion** - Can only archive via lane movement  
❌ **No comment creation** - Read-only comment access

---

# Recommended Demo Configuration Workflow

## Phase 1: Discovery
1. List boards, teams, users
2. Get board configuration (lanes, card types)
3. List objective levels

## Phase 2: Structure
1. Create planning series and increments
2. Create objectives hierarchy
3. Create key results

## Phase 3: Work Items
1. Create cards individually (no batch available)
2. Add parent-child relationships
3. Add dependencies
4. Assign users
5. Add tags
6. Move to appropriate lanes

## Phase 4: Integration
1. Link cards to key results (via OKR work connections)
2. Assign to planning increments
3. Add progress updates

---

**This inventory represents the complete CRUD surface area available through the current AgilePlace API tools for demo environment configuration.**
