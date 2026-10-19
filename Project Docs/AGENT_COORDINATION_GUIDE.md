# Multi-Agent Coordination Guide & Handover Protocol

> **PURPOSE:** This document establishes strict rules of engagement for all autonomous and pair-programming agents working on the Sanctuary platform.

---

## 1. The Golden Rule of Task State

Whenever you (any agent) receive a user request or initiate a new feature, refactor, or bugfix:

### STEP 1: Claim & Mark "Started but not finished"
Before touching any code or making edits:
1. Open [`Project Docs/TASK_TRACKER.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/TASK_TRACKER.md).
2. Append or update the task in the **Active & In-Progress Tasks** table.
3. Set the status strictly to **`Started but not finished`**.
4. Log the Start Timestamp and expected files to be modified.

### STEP 2: Execute & Update Specs in Real Time
As changes are implemented:
- If data types or APIs change: Update [`DATA_AND_API_SPEC.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/DATA_AND_API_SPEC.md).
- If architecture or components change: Update [`ARCHITECTURE_SPEC.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/ARCHITECTURE_SPEC.md).
- If product logic or collections change: Update [`PRODUCT_SPEC.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/PRODUCT_SPEC.md).
- If styling, themes, or layouts change: Update [`UI_UX_SPEC.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/UI_UX_SPEC.md).

### STEP 3: Verify Build
Before marking any task complete:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User"); npm.cmd run build
```
Verify that all routes compile and TypeScript checks succeed with 0 errors.

### STEP 4: Mark "Finished"
Once verified:
1. Move or update the task in [`Project Docs/TASK_TRACKER.md`](file:///C:/Users/rajiv/.gemini/antigravity/scratch/sanctuary-stays/Project%20Docs/TASK_TRACKER.md) under **Task History & Completed Log**.
2. Set the status strictly to **`Finished`**.
3. Record the Completion Timestamp and verification notes.

---

## 2. Directory Reference

- **Task Tracker:** `Project Docs/TASK_TRACKER.md`
- **Architecture Spec:** `Project Docs/ARCHITECTURE_SPEC.md`
- **Product Spec:** `Project Docs/PRODUCT_SPEC.md`
- **Data & API Spec:** `Project Docs/DATA_AND_API_SPEC.md`
- **UI/UX Spec:** `Project Docs/UI_UX_SPEC.md`
- **Agent Guide:** `Project Docs/AGENT_COORDINATION_GUIDE.md`

---

## 3. Environment & Runtime Conventions

- **OS:** Windows with PowerShell shell environment.
- **Node & NPM:** Use `npm.cmd` and `npx.cmd` to bypass PowerShell script execution policy constraints.
- **Port:** Next.js runs on port `3000` (`http://localhost:3000`).
- **Currency:** Exclusively Indian Rupee (`INR` / `₹`) with `en-IN` numbering.
- **Tone:** Ultra-luxury, editorial, design-focused (no generic travel portal copy).
