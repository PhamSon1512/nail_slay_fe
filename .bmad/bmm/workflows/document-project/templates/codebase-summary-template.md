# Codebase Summary

> **Project**: {{project_name}}  
> **Version**: {{version}}  
> **Last Updated**: {{date}}  
> **Repository Type**: {{repository_type}}

## Quick Stats

| Metric                  | Value                                                   |
| ----------------------- | ------------------------------------------------------- |
| **Total Files**         | {{total_files}} files                                   |
| **Total Lines of Code** | {{total_loc}} LOC                                       |
| **Primary Language**    | {{primary_language}} ({{primary_language_percentage}}%) |
| **Average File Size**   | {{avg_file_size}} LOC                                   |
| **Test Files**          | {{test_files_count}} files                              |
| **Test Coverage**       | {{test_coverage}}%                                      |
| **Total Dependencies**  | {{production_deps}} production, {{dev_deps}} dev        |

---

## Table of Contents

1. [Codebase Statistics](#codebase-statistics)
2. [Directory Overview](#directory-overview)
3. [Entry Points](#entry-points)
4. [Key Modules](#key-modules)
5. [Language Distribution](#language-distribution)
6. [File Types](#file-types)
7. [Largest Files](#largest-files)
8. [Complexity Analysis](#complexity-analysis)
9. [Dependency Overview](#dependency-overview)
10. [Navigation Guide](#navigation-guide)

---

## 1. Codebase Statistics

### Overview

```
Total Files:           {{total_files}}
Total Lines of Code:   {{total_loc:,}} LOC
Code Lines:            {{code_lines:,}} LOC ({{code_percentage}}%)
Comment Lines:         {{comment_lines:,}} LOC ({{comment_percentage}}%)
Blank Lines:           {{blank_lines:,}} LOC ({{blank_percentage}}%)
```

### Size Distribution

| Category                   | Count            | Percentage            |
| -------------------------- | ---------------- | --------------------- |
| Small Files (<100 LOC)     | {{small_files}}  | {{small_files_pct}}%  |
| Medium Files (100-500 LOC) | {{medium_files}} | {{medium_files_pct}}% |
| Large Files (>500 LOC)     | {{large_files}}  | {{large_files_pct}}%  |

### Growth Metrics

{{#if has_git_history}}

- **Initial Commit**: {{first_commit_date}}
- **Latest Commit**: {{last_commit_date}}
- **Total Commits**: {{total_commits}}
- **Contributors**: {{contributors_count}}
- **Files Changed (Last 7 Days)**: {{recent_changes_count}}
  {{else}}
  _Git history not available for growth metrics_
  {{/if}}

---

## 2. Directory Overview

### Project Structure

```
{{project_root_name}}/
{{directory_tree_summary}}
```

### Core Directories

| Directory | Purpose | Files | LOC | Key Files |
| --------- | ------- | ----- | --- | --------- |

{{#each core_directories}}
| `{{path}}` | {{purpose}} | {{files_count}} | {{loc_count:,}} | {{key_files}} |
{{/each}}

### Directory Breakdown by Size

{{#each directories_by_size}}
**{{index}}. `{{path}}`**

- Files: {{files_count}}
- Lines of Code: {{loc_count:,}}
- Average File Size: {{avg_size}} LOC
- Purpose: {{purpose}}

{{/each}}

---

## 3. Entry Points

### Application Entry Points

{{#each entry_points}}

#### {{entry_type}}

**File**: `{{file_path}}`

**Purpose**: {{purpose}}

**Key Responsibilities**:
{{#each responsibilities}}

- {{this}}
  {{/each}}

**Dependencies**: {{dependencies_count}} direct imports

---

{{/each}}

### Command Line Interface

{{#if has_cli}}
**Entry**: `{{cli_entry_point}}`

**Available Commands**:
{{#each cli_commands}}

- `{{command}}` - {{description}}
  {{/each}}
  {{else}}
  _This project does not have a CLI interface_
  {{/if}}

---

## 4. Key Modules

{{#each key_modules}}

### {{module_name}} (`{{module_path}}`)

**Size**: {{files_count}} files, {{loc_count:,}} LOC

**Purpose**: {{purpose}}

**Key Components**:
{{#each key_components}}

- **{{component_name}}** (`{{file_path}}`) - {{description}}
  {{/each}}

{{#if has_tests}}
**Tests**: {{test_files_count}} test files, {{test_coverage}}% coverage
{{/if}}

**External Dependencies**:
{{#each external_deps}}

- {{dep_name}} ({{version}})
  {{/each}}

---

{{/each}}

---

## 5. Language Distribution

### Primary Languages

| Language | Files | Lines | Percentage |
| -------- | ----- | ----- | ---------- |

{{#each languages}}
| {{name}} | {{files_count}} | {{loc_count:,}} | {{percentage}}% |
{{/each}}

### Language Usage by Directory

{{#each language_by_directory}}
**{{directory}}**
{{#each languages}}

- {{name}}: {{percentage}}% ({{loc_count:,}} LOC)
  {{/each}}

{{/each}}

### File Extensions

| Extension | Count | Total LOC |
| --------- | ----- | --------- |

{{#each file_extensions}}
| `.{{extension}}` | {{count}} | {{loc:,}} |
{{/each}}

---

## 6. File Types

### By Category

```
Source Code:        {{source_files_count}} files ({{source_files_pct}}%)
Tests:              {{test_files_count}} files ({{test_files_pct}}%)
Configuration:      {{config_files_count}} files ({{config_files_pct}}%)
Documentation:      {{doc_files_count}} files ({{doc_files_pct}}%)
Build/Assets:       {{other_files_count}} files ({{other_files_pct}}%)
```

### Source Files Breakdown

{{#each source_file_types}}

- **{{category}}**: {{count}} files
  {{#each file_patterns}}
  - `{{pattern}}`: {{count}} files
    {{/each}}
    {{/each}}

### Test Files Breakdown

{{#if has_tests}}
| Type | Pattern | Count | LOC |
|------|---------|-------|-----|
{{#each test_types}}
| {{type}} | `{{pattern}}` | {{count}} | {{loc:,}} |
{{/each}}

**Test Organization**:

- Test Framework: {{test_framework}}
- Test Location: {{test_location}}
- Test Naming: {{test_naming_convention}}
  {{else}}
  _No test files detected_
  {{/if}}

---

## 7. Largest Files

### Top 20 Files by Size

| Rank | File | LOC | Type | Complexity |
| ---- | ---- | --- | ---- | ---------- |

{{#each largest_files}}
| {{rank}} | `{{file_path}}` | {{loc:,}} | {{file_type}} | {{complexity}} |
{{/each}}

### Recommendations

{{#if has_large_files}}
⚠️ Files over 500 LOC may benefit from refactoring:
{{#each files_over_500}}

- `{{file_path}}` ({{loc}} LOC) - Consider breaking into smaller modules
  {{/each}}
  {{else}}
  ✅ No files exceed recommended size limits
  {{/if}}

---

## 8. Complexity Analysis

### Cyclomatic Complexity

{{#if has_complexity_data}}
**Average Complexity**: {{avg_complexity}}

**Complexity Distribution**:

- Low Complexity (1-10): {{low_complexity_count}} files ({{low_complexity_pct}}%)
- Medium Complexity (11-20): {{medium_complexity_count}} files ({{medium_complexity_pct}}%)
- High Complexity (21+): {{high_complexity_count}} files ({{high_complexity_pct}}%)

### Complexity Hotspots

Top 10 most complex files:

| Rank | File | Complexity | LOC | Recommendation |
| ---- | ---- | ---------- | --- | -------------- |

{{#each complexity_hotspots}}
| {{rank}} | `{{file_path}}` | {{complexity}} | {{loc}} | {{recommendation}} |
{{/each}}

{{else}}
_Complexity analysis not available for this scan level. Run with deep/exhaustive scan for complexity metrics._
{{/if}}

---

## 9. Dependency Overview

### External Dependencies

**Production Dependencies**: {{production_deps_count}}

{{#each production_dependencies}}

- **{{name}}** `{{version}}` - {{description}}
  {{/each}}

**Development Dependencies**: {{dev_deps_count}}

{{#each dev_dependencies_notable}}

- **{{name}}** `{{version}}` - {{category}}
  {{/each}}

### Dependency Insights

{{#if has_dependency_analysis}}

- **Outdated Dependencies**: {{outdated_deps_count}}
- **Security Vulnerabilities**: {{vulnerable_deps_count}}
- **Unused Dependencies**: {{unused_deps_count}}
- **Dependency Tree Depth**: {{max_dependency_depth}} levels
  {{/if}}

### Internal Module Dependencies

{{#if has_module_graph}}
**Most Imported Modules**:
{{#each most_imported_modules}}

- `{{module_path}}` - imported by {{import_count}} files
  {{/each}}

**Dependency Graph**:

```mermaid
{{dependency_graph}}
```

{{#if has_circular_dependencies}}
⚠️ **Circular Dependencies Detected**:
{{#each circular_dependencies}}

- {{dependency_cycle}}
  {{/each}}
  {{else}}
  ✅ No circular dependencies detected
  {{/if}}

{{/if}}

---

## 10. Navigation Guide

### Quick Navigation Map

| I Need To... | Go To |
| ------------ | ----- |

{{#each navigation_map}}
| {{task}} | `{{location}}` |
{{/each}}

### Module Quick Reference

{{#each module_reference}}

#### {{module_category}}

{{#each modules}}

- **{{module_name}}** (`{{path}}`)  
   {{description}}  
   Key files: {{key_files}}
  {{/each}}

{{/each}}

### Common Tasks Guide

{{#each common_tasks}}

#### {{task_name}}

**Files to Modify**:
{{#each files}}

- `{{file_path}}` - {{purpose}}
  {{/each}}

**Related Files**:
{{#each related_files}}

- `{{file_path}}`
  {{/each}}

**Testing**:

- Test file: `{{test_file}}`
- Run: `{{test_command}}`

---

{{/each}}

---

## Code Quality Summary

### Static Analysis

{{#if has_linter}}
**Linter**: {{linter_name}}

- Configuration: `{{linter_config}}`
- Rules: {{linter_rules_count}} active
- Violations: {{linter_errors}} errors, {{linter_warnings}} warnings
  {{/if}}

{{#if has_type_checker}}
**Type Checker**: {{type_checker_name}}

- Type Coverage: {{type_coverage}}%
- Strict Mode: {{strict_mode}}
- Type Errors: {{type_errors}}
  {{/if}}

### Code Metrics

```
Maintainability Index:  {{maintainability_index}}/100
Code Duplication:       {{duplication_percentage}}%
Technical Debt:         {{technical_debt_hours}} hours estimated
```

### Quality Indicators

{{#each quality_indicators}}

- {{name}}: {{value}} {{#if is_good}}✅{{else}}⚠️{{/if}}
  {{/each}}

---

## Recent Activity

{{#if has_git_history}}

### Last 7 Days

- **Commits**: {{recent_commits}}
- **Files Changed**: {{recent_files_changed}}
- **Lines Added**: +{{recent_lines_added}}
- **Lines Deleted**: -{{recent_lines_deleted}}

### Most Active Files

{{#each most_active_files}}

- `{{file_path}}` - {{changes_count}} changes
  {{/each}}

### Most Active Directories

{{#each most_active_directories}}

- `{{directory}}` - {{changes_count}} changes
  {{/each}}

{{/if}}

---

## Project Health Score

{{#if has_health_score}}

### Overall Score: {{health_score}}/100

**Breakdown**:

- Code Quality: {{quality_score}}/25
- Test Coverage: {{coverage_score}}/25
- Documentation: {{documentation_score}}/25
- Maintainability: {{maintainability_score}}/25

**Recommendations**:
{{#each health_recommendations}}

- {{recommendation}}
  {{/each}}

{{/if}}

---

## Related Documentation

- [Project Overview](./project-overview.md) - Business context and purpose
- [Source Tree Analysis](./source-tree-analysis.md) - Detailed directory tree
- [Architecture](./architecture.md) - System design and patterns
- [Code Standards](./code-standards.md) - Coding conventions and patterns
- [Development Guide](./development-guide.md) - Setup and development workflow

---

**Note**: This summary is auto-generated based on codebase analysis. Statistics are accurate as of {{date}}.

{{#if repomix_used}}
_Generated using repomix for enhanced accuracy_
{{/if}}
