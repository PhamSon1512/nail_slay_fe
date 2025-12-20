# Full Project Scan Instructions

<workflow>

<critical>Read and STRICTLY follow: {bmad_folder}/bmm/data/communication-rules.md</critical>
<critical>This workflow performs complete project documentation (Steps 1-12)</critical>
<critical>Called by: document-project/instructions.md router</critical>
<critical>Handles: initial_scan and full_rescan modes</critical>

<step n="0.5" goal="Load documentation requirements data for fresh starts (not needed for resume)" if="resume_mode == false">
<critical>DATA LOADING STRATEGY - Understanding the Documentation Requirements System:</critical>

<action>Display explanation to user:

**How Project Type Detection Works:**

This workflow uses a single comprehensive CSV file to intelligently document your project:

**documentation-requirements.csv** ({documentation_requirements_csv})

- Contains 12 project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded)
- 24-column schema combining project type detection AND documentation requirements
- **Detection columns**: project_type_id, key_file_patterns (used to identify project type from codebase)
- **Requirement columns**: requires_api_scan, requires_data_models, requires_ui_components, etc.
- **Pattern columns**: critical_directories, test_file_patterns, config_patterns, etc.
- Acts as a "scan guide" - tells the workflow WHERE to look and WHAT to document
- Example: For project_type_id="web", key_file_patterns includes "package.json;tsconfig.json;\*.config.js" and requires_api_scan=true

**When Documentation Requirements are Loaded:**

- **Fresh Start (initial_scan)**: Load all 12 rows → detect type using key_file_patterns → use that row's requirements
- **Resume**: Load ONLY the doc requirements row(s) for cached project_type_id(s)
- **Full Rescan**: Same as fresh start (may re-detect project type)
- **Deep Dive**: Load ONLY doc requirements for the part being deep-dived
  </action>

<action>Now loading documentation requirements data for fresh start...</action>

<action>Load documentation-requirements.csv from: {documentation_requirements_csv}</action>
<action>Store all 12 rows indexed by project_type_id for project detection and requirements lookup</action>
<action>Display: "Loaded documentation requirements for 12 project types (web, mobile, backend, cli, library, desktop, game, data, extension, infra, embedded)"</action>

<action>Display: "✓ Documentation requirements loaded successfully. Ready to begin project analysis."</action>
</step>

<step n="0.6" goal="Check for existing documentation and determine workflow mode">
<action>Check if {output_folder}/index.md exists</action>

<check if="index.md exists">
  <action>Read existing index.md to extract metadata (date, project structure, parts count)</action>
  <action>Store as {{existing_doc_date}}, {{existing_structure}}</action>

<ask>I found existing documentation generated on {{existing_doc_date}}.

What would you like to do?

1. **Re-scan entire project** - Update all documentation with latest changes
2. **Deep-dive into specific area** - Generate detailed documentation for a particular feature/module/folder
3. **Cancel** - Keep existing documentation as-is

Your choice [1/2/3]:
</ask>

  <check if="user selects 1">
    <action>Set workflow_mode = "full_rescan"</action>
    <action>Continue to scan level selection below</action>
  </check>

  <check if="user selects 2">
    <action>Set workflow_mode = "deep_dive"</action>
    <action>Set scan_level = "exhaustive"</action>
    <action>Initialize state file with mode=deep_dive, scan_level=exhaustive</action>
    <action>Jump to Step 13</action>
  </check>

  <check if="user selects 3">
    <action>Display message: "Keeping existing documentation. Exiting workflow."</action>
    <action>Exit workflow</action>
  </check>
</check>

<check if="index.md does not exist">
  <action>Set workflow_mode = "initial_scan"</action>
  <action>Continue to scan level selection below</action>
</check>

<action if="workflow_mode != deep_dive">Select Scan Level</action>

<check if="workflow_mode == initial_scan OR workflow_mode == full_rescan">
  <ask>Choose your scan depth level:

**1. Quick Scan** (2-5 minutes) [DEFAULT]

- Pattern-based analysis without reading source files
- Scans: Config files, package manifests, directory structure
- Best for: Quick project overview, initial understanding
- File reading: Minimal (configs, README, package.json, etc.)

**2. Deep Scan** (10-30 minutes)

- Reads files in critical directories based on project type
- Scans: All critical paths from documentation requirements
- Best for: Comprehensive documentation for brownfield PRD
- File reading: Selective (key files in critical directories)

**3. Exhaustive Scan** (30-120 minutes)

- Reads ALL source files in project
- Scans: Every source file (excludes node_modules, dist, build)
- Best for: Complete analysis, migration planning, detailed audit
- File reading: Complete (all source files)

Your choice [1/2/3] (default: 1):
</ask>

  <action if="user selects 1 OR user presses enter">
    <action>Set scan_level = "quick"</action>
    <action>Display: "Using Quick Scan (pattern-based, no source file reading)"</action>
  </action>

  <action if="user selects 2">
    <action>Set scan_level = "deep"</action>
    <action>Display: "Using Deep Scan (reading critical files per project type)"</action>
  </action>

  <action if="user selects 3">
    <action>Set scan_level = "exhaustive"</action>
    <action>Display: "Using Exhaustive Scan (reading all source files)"</action>
  </action>

<action>Initialize state file: {output_folder}/project-scan-report.json</action>
<critical>Every time you touch the state file, record: step id, human-readable summary (what you actually did), precise timestamp, and any outputs written. Vague phrases are unacceptable.</critical>
<action>Write initial state:
{
"workflow_version": "1.2.0",
"timestamps": {"started": "{{current_timestamp}}", "last_updated": "{{current_timestamp}}"},
"mode": "{{workflow_mode}}",
"scan_level": "{{scan_level}}",
"project_root": "{{project_root_path}}",
"output_folder": "{{output_folder}}",
"completed_steps": [],
"current_step": "step_0.7",
"findings": {},
"outputs_generated": ["project-scan-report.json"],
"resume_instructions": "Starting from step 0.7 (repomix generation)"
}
</action>
<action>Continue to Step 0.7 (Repomix Generation)</action>
</check>
</step>

<step n="0.7" goal="Generate Repomix codebase analysis for enhanced scanning" if="workflow_mode != deep_dive">
<critical>REPOMIX INTEGRATION - This step generates a comprehensive codebase snapshot that dramatically improves documentation quality</critical>

<action>Display to user:

**🔍 Generating Codebase Analysis with Repomix**

Repomix creates a compact, AI-friendly representation of your codebase that enables:

- Faster and more accurate project type detection
- Complete file tree with annotations
- Structured code content for deep analysis
- Statistics about codebase size and composition

</action>

<action>Check if repomix is installed by running: `which repomix` or `command -v repomix`</action>

<check if="repomix is NOT installed">
  <output>⚠️ **Repomix not found**</output>
  <output>Repomix significantly improves documentation quality. Install it with:</output>
  <output>```bash
npm install -g repomix
```</output>
  
  <ask>Would you like to:
1. **Install repomix now** - I'll run `npm install -g repomix` for you
2. **Continue without repomix** - Use standard file-by-file scanning (lower quality)
3. **Abort** - Exit workflow to install manually

Your choice [1/2/3]:
</ask>

  <check if="user selects 1">
    <action>Run: `npm install -g repomix`</action>
    <action>Wait for installation to complete</action>
    <check if="installation failed">
      <output>❌ Installation failed. Please install manually and re-run the workflow.</output>
      <action>Exit workflow</action>
    </check>
    <action>Display: "✓ Repomix installed successfully!"</action>
    <action>Continue with repomix generation below</action>
  </check>

  <check if="user selects 2">
    <action>Set repomix_enabled = false</action>
    <action>Display: "Continuing without repomix. Documentation quality may be reduced."</action>
    <action>Skip to Step 1</action>
  </check>

  <check if="user selects 3">
    <action>Display: "Exiting workflow. Run again after installing repomix."</action>
    <action>Exit workflow</action>
  </check>
</check>

<check if="repomix IS installed">
  <action>Set repomix_enabled = true</action>
  
  <action>Build repomix command based on scan_level:
  
**Quick Scan Profile:**
```bash
repomix -o {output_folder}/repomix-output.xml \
  --style xml \
  --include "package.json,tsconfig.json,*.config.*,README.md,src/index.*,src/main.*,src/app.*,src/**/index.*" \
  -i "node_modules,dist,build,coverage,.git,.bmad,.claude,.idea,.agents,*.lock,*.log,repomix-output.*"
```

**Deep Scan Profile:**

```bash
repomix -o {output_folder}/repomix-output.xml \
  --style xml \
  --include "src/**,lib/**,app/**,api/**,routes/**,controllers/**,services/**,models/**,components/**,*.config.*,package.json,*.md" \
  -i "node_modules,dist,build,coverage,.git,.bmad,.claude,.idea,.agents,*.lock,*.log,repomix-output.*"
```

**Exhaustive Scan Profile:**

```bash
repomix -o {output_folder}/repomix-output.xml \
  --style xml \
  --output-show-line-numbers \
  --include "**/*.ts,**/*.tsx,**/*.js,**/*.jsx,**/*.py,**/*.go,**/*.rs,**/*.java,**/*.md,**/*.json,**/*.yaml,**/*.yml" \
  -i "node_modules,dist,build,coverage,.git,.bmad,.claude,.idea,.agents,*.lock,*.log,repomix-output.*"
```

  </action>

<action>Display: "Running repomix with {{scan_level}} profile..."</action>
<action>Execute the repomix command for current scan_level</action>
<action>Wait for command to complete (may take 1-5 minutes for large codebases)</action>

  <check if="repomix command failed">
    <output>⚠️ Repomix generation failed: {{error_message}}</output>
    <ask>Would you like to:
1. **Retry** - Run repomix again
2. **Continue without** - Use standard scanning
3. **Abort** - Exit workflow

Your choice [1/2/3]:
</ask>
<check if="user selects 1">
<action>Retry repomix command</action>
</check>
<check if="user selects 2">
<action>Set repomix_enabled = false</action>
<action>Continue to Step 1</action>
</check>
<check if="user selects 3">
<action>Exit workflow</action>
</check>
</check>

  <check if="repomix command succeeded">
    <action>Verify output file exists at: {output_folder}/repomix-output.xml</action>
    <action>Parse repomix output to extract:
    - **file_tree**: Complete directory structure with file sizes
    - **file_contents**: Source code organized by file
    - **statistics**: Total files, lines of code, languages detected
    </action>
    
    <action>Store parsed data:
    - {{repomix_file_tree}} - Directory structure
    - {{repomix_files_count}} - Number of files included
    - {{repomix_total_lines}} - Total lines of code
    - {{repomix_languages}} - Detected programming languages
    - {{repomix_output_path}} - Path to XML file
    </action>

    <action>Display summary:

**✓ Repomix Analysis Complete**

- **Output**: {output_folder}/repomix-output.xml
- **Files Included**: {{repomix_files_count}}
- **Total Lines**: {{repomix_total_lines}}
- **Languages Detected**: {{repomix_languages}}
- **Scan Level**: {{scan_level}}

This data will be used to enhance all subsequent documentation steps.
</action>

    <action>Cache parsed results to: {output_folder}/.cache/repomix-parsed.json</action>

  </check>
</check>

<action>Update state file:

- Add to completed_steps: {"step": "step_0.7", "status": "completed", "timestamp": "{{now}}", "summary": "Repomix generated: {{repomix_files_count}} files, {{repomix_total_lines}} lines"}
- Update current_step = "step_1"
- Add to outputs_generated: "repomix-output.xml"
- Update findings.repomix_summary with statistics
- Update last_updated timestamp
  </action>

</step>

<step n="1" goal="Detect project structure and classify project type" if="workflow_mode != deep_dive">
<action>Ask user: "What is the root directory of the project to document?" (default: current working directory)</action>
<action>Store as {{project_root_path}}</action>

<critical>ENHANCED DETECTION: If repomix_enabled == true, use repomix output for faster and more accurate detection</critical>

<check if="repomix_enabled == true">
  <action>Use {{repomix_file_tree}} to identify directory structure</action>
  <action>Use {{repomix_languages}} to pre-identify technology stack</action>
  <action>Parse repomix-output.xml for key file contents (package.json, go.mod, etc.)</action>
</check>

<check if="repomix_enabled == false">
  <action>Scan {{project_root_path}} for key indicators (traditional method):

- Directory structure (presence of client/, server/, api/, src/, app/, etc.)
- Key files (package.json, go.mod, requirements.txt, etc.)
- Technology markers matching detection_keywords from project-types.csv
  </action>

<action>Detect if project is:

- **Monolith**: Single cohesive codebase
- **Monorepo**: Multiple parts in one repository
- **Multi-part**: Separate client/server or similar architecture
  </action>

<check if="multiple distinct parts detected (e.g., client/ and server/ folders)">
  <action>List detected parts with their paths</action>
  <ask>I detected multiple parts in this project:
  {{detected_parts_list}}

Is this correct? Should I document each part separately? [y/n]
</ask>

<action if="user confirms">Set repository_type = "monorepo" or "multi-part"</action>
<action if="user confirms">For each detected part: - Identify root path - Run project type detection using key_file_patterns from documentation-requirements.csv - Store as part in project_parts array
</action>

<action if="user denies or corrects">Ask user to specify correct parts and their paths</action>
</check>

<check if="single cohesive project detected">
  <action>Set repository_type = "monolith"</action>
  <action>Create single part in project_parts array with root_path = {{project_root_path}}</action>
  <action>Run project type detection using key_file_patterns from documentation-requirements.csv</action>
</check>

<action>For each part, match detected technologies and file patterns against key_file_patterns column in documentation-requirements.csv</action>
<action>Assign project_type_id to each part</action>
<action>Load corresponding documentation_requirements row for each part</action>

<ask>I've classified this project:
{{project_classification_summary}}

Does this look correct? [y/n/edit]
</ask>

<template-output>project_structure</template-output>
<template-output>project_parts_metadata</template-output>

<action>IMMEDIATELY update state file with step completion:

- Add to completed_steps: {"step": "step_1", "status": "completed", "timestamp": "{{now}}", "summary": "Classified as {{repository_type}} with {{parts_count}} parts"}
- Update current_step = "step_1.5"
- Update findings.project_classification with high-level summary only
- **CACHE project_type_id(s)**: Add project_types array: [{"part_id": "{{part_id}}", "project_type_id": "{{project_type_id}}", "display_name": "{{display_name}}"}]
- This cached data prevents reloading all CSV files on resume - we can load just the needed documentation_requirements row(s)
- Update last_updated timestamp
- Write state file
  </action>

<action>PURGE detailed scan results from memory, keep only summary: "{{repository_type}}, {{parts_count}} parts, {{primary_tech}}"</action>
</step>

<step n="1.5" goal="Generate codebase statistics and summary" if="workflow_mode != deep_dive">
<critical>CODEBASE SUMMARY GENERATION - Creates comprehensive overview with metrics, statistics, and navigation guide</critical>

<action>Display: "📊 Generating Codebase Summary (file stats, languages, modules, dependencies, navigation)"</action>

### 1. Collect File Statistics & Language Distribution

<check if="repomix_enabled == true">
  <action>Extract from repomix: total files, LOC, language breakdown, file size distribution, directory stats</action>
  <action>Parse to get: {{total_files}}, {{total_loc}}, {{languages}} array, {{file_extensions}}</action>
</check>

<check if="repomix_enabled == false">
  <action>Use find/grep: `find {{project_root}} -type f | wc -l`, `find -name "*.ts" | xargs wc -l`</action>
</check>

<action>Calculate statistics:

- Average file size: {{total_loc}} / {{total_files}}
- File size distribution: small (<100), medium (100-500), large (>500 LOC)
- Language percentages: (language_loc / total_loc) \* 100
  </action>

<action>Store: {{total_files}}, {{total_loc}}, {{primary_language}}, {{avg_file_size}}, {{languages}} sorted by LOC</action>

### 2. Analyze Directory Structure & Key Modules

<action>For each part in project_parts:</action>

<action>Scan critical directories from documentation_requirements:

- Count files and LOC per directory
- Identify key files in each directory
- Sort by LOC to find largest modules
  </action>

<action>Identify top 5-10 key modules by:

- Size (LOC)
- Critical functionality (auth, api, database, etc.)
- Number of dependencies (if analyzable)
  </action>

<action>For each key module:

- Count files and sum LOC
- Identify purpose from directory name and patterns
- List 3-5 key components/files
- Count test files if exists
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Extract external dependencies per module: parse imports, identify npm/pip packages, count unique deps</action>
  <action>Analyze language distribution by directory</action>
</check>

<action>Store: {{core_directories}}, {{directories_by_size}}, {{largest_directory}}, {{key_modules}} array</action>

### 3. Identify Entry Points & Largest Files

<action>Detect entry points based on project type:

- **Web/Backend**: index.ts, main.ts, app.ts, server.ts, package.json "main"
- **Mobile**: index.js, App.tsx, main.dart, app.json "main"
- **CLI**: cli.ts, bin/\*, package.json "bin"
- **Library**: index.ts, lib.rs, **init**.py, package.json "main"/"exports"
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Read entry point files for: key responsibilities, direct imports count, initialization sequence</action>
</check>

<action>Identify largest files (top 20):

- Extract from repomix output OR count LOC for scanned files
- Determine file type (component, service, utility, config)
- Flag files exceeding 500 LOC
  </action>

<action>Store: {{entry_points}} array, {{has_cli}}, {{largest_files}} array</action>

### 4. Extract Dependencies & Quality Metrics

<action>Parse package manifest (package.json, requirements.txt, go.mod, Cargo.toml):

- Count production and dev dependencies
- Categorize dev deps: testing (jest/vitest/pytest), linting (eslint/pylint), build (webpack/vite), types (@types/\*)
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Analyze internal module dependencies: parse imports, build most_imported_modules, detect circular deps</action>
</check>

<action>Check quality tool configs:

- Linter: .eslintrc.\*, .pylintrc → extract name, config location, rules count
- Type checker: tsconfig.json, mypy.ini → extract name, strict mode, coverage
- Test coverage: coverage reports if available
  </action>

<action>Store: {{production_deps_count}}, {{dev_deps_count}}, {{production_dependencies}}, {{dev_dependencies_notable}}, {{has_linter}}, {{linter_name}}, {{has_type_checker}}, {{type_checker_name}}, {{test_coverage}}</action>

### 5. Build Navigation Guide

<action>Create navigation_map based on project structure:

- Map common tasks to locations (Add API endpoint → src/routes/, Add business logic → src/services/, Add DB model → src/models/)
- Use documentation_requirements patterns
  </action>

<action>Build module_reference by category: Authentication & Authorization, API & Routes, Business Logic, Data Layer, Utilities & Helpers, Testing</action>

### 6. Generate Codebase Summary Document

<action>Generate codebase-summary.md using template:

- **Template**: {bmad_folder}/bmm/workflows/document-project/templates/codebase-summary-template.md
- **Variables**: project_name, date, repository_type, total_files, total_loc, primary_language, avg_file_size, core_directories, entry_points, key_modules, languages, largest_files, dependencies, navigation_map, quality metrics, repomix_used
- **Output**: codebase-summary.md (or codebase-summary-{part_id}.md for multi-part)
  </action>

<action>IMMEDIATELY write file(s) to disk and validate (sections populated, statistics formatted, markdown tables aligned)</action>

<action>Display summary:

**✓ Codebase Summary Generated**

**Statistics:** {{total_files}} files, {{total_loc:,}} LOC, {{primary_language}} ({{primary_language_percentage}}%), {{avg_file_size}} LOC avg
**Key Modules:** {{#each key_modules}}{{module_name}} ({{files_count}} files, {{loc_count:,}} LOC), {{/each}}
**Quality:** {{test_coverage}}% coverage, {{linter_name}}, {{type_checker_name}}
**Output:** codebase-summary.md generated
</action>

<template-output>codebase_summary</template-output>

<action>Update state file:

- completed_steps: {"step": "step_1.5", "status": "completed", "timestamp": "{{now}}", "summary": "Codebase summary: {{total_files}} files, {{total_loc}} LOC, {{primary_language}}"}
- current_step = "step_2"
- outputs_generated: "codebase-summary.md"
- findings.codebase_stats: key metrics only
  </action>

<action>PURGE detailed file lists, keep: "{{total_files}} files, {{total_loc}} LOC, {{primary_language}} ({{percentage}}%), {{modules_count}} modules"</action>

</step>

<step n="2" goal="Discover existing documentation and gather user context" if="workflow_mode != deep_dive">
<action>For each part, scan for existing documentation using patterns:
- README.md, README.rst, README.txt
- CONTRIBUTING.md, CONTRIBUTING.rst
- ARCHITECTURE.md, ARCHITECTURE.txt, docs/architecture/
- DEPLOYMENT.md, DEPLOY.md, docs/deployment/
- API.md, docs/api/
- Any files in docs/, documentation/, .github/ folders
</action>

<action>Create inventory of existing_docs with:

- File path
- File type (readme, architecture, api, etc.)
- Which part it belongs to (if multi-part)
  </action>

<ask>I found these existing documentation files:
{{existing_docs_list}}

Are there any other important documents or key areas I should focus on while analyzing this project? [Provide paths or guidance, or type 'none']
</ask>

<action>Store user guidance as {{user_context}}</action>

<template-output>existing_documentation_inventory</template-output>
<template-output>user_provided_context</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_2", "status": "completed", "timestamp": "{{now}}", "summary": "Found {{existing_docs_count}} existing docs"}
- Update current_step = "step_3"
- Update last_updated timestamp
  </action>

<action>PURGE detailed doc contents from memory, keep only: "{{existing_docs_count}} docs found"</action>
</step>

<step n="3" goal="Analyze technology stack for each part" if="workflow_mode != deep_dive">
<action>For each part in project_parts:
  - Load key_file_patterns from documentation_requirements
  - Scan part root for these patterns
  - Parse technology manifest files (package.json, go.mod, requirements.txt, etc.)
  - Extract: framework, language, version, database, dependencies
  - Build technology_table with columns: Category, Technology, Version, Justification
</action>

<action>Determine architecture pattern based on detected tech stack:

- Use project_type_id as primary indicator (e.g., "web" → layered/component-based, "backend" → service/API-centric)
- Consider framework patterns (e.g., React → component hierarchy, Express → middleware pipeline)
- Note architectural style in technology table
- Store as {{architecture_pattern}} for each part
  </action>

<template-output>technology_stack</template-output>
<template-output>architecture_patterns</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_3", "status": "completed", "timestamp": "{{now}}", "summary": "Tech stack: {{primary_framework}}"}
- Update current_step = "step_3.5"
- Update findings.technology_stack with summary per part
- Update last_updated timestamp
  </action>

<action>PURGE detailed tech analysis from memory, keep only: "{{framework}} on {{language}}"</action>
</step>

<step n="3.5" goal="Analyze coding standards and patterns" if="workflow_mode != deep_dive">
<critical>CODE STANDARDS EXTRACTION - Identifies patterns, conventions, and best practices from the codebase</critical>

<action>Display: "📋 Analyzing Coding Standards and Patterns"</action>

<check if="repomix_enabled == true">
  <action>Use repomix output for efficient pattern analysis (file_tree, imports, exports)</action>
</check>

<action>For each part in project_parts:</action>

### 1. Analyze Naming & Organization

<action>Scan sample files (10-20 from src/) to identify:

- **File naming**: camelCase/kebab-case/PascalCase, test patterns (_.test._, _.spec._)
- **Code naming**: variables (camelCase/snake_case), constants (SCREAMING_SNAKE_CASE), functions (verbPrefix), classes (PascalCase), booleans (is*/has*/can\*)
- **Organization**: feature-based vs layer-based, import patterns (absolute/relative), barrel exports (index.ts)
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Read sample files for import order, file structure, module boundaries</action>
</check>

<action>Store: {{file_naming_pattern}}, {{variable_naming_examples}}, {{has_feature_based}}, {{organization_rules}}</action>

### 2. Identify Design Patterns & Error Handling

<action>Scan for common patterns:

- **Repository**: _Repository._, repositories/
- **Service**: _Service._, services/
- **Factory**: _Factory._, create*.*
- **Singleton**: getInstance patterns
- **DI**: constructor injection, providers/
- **Error handling**: custom error classes (class \*Error extends), try-catch, error middleware/boundaries
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Read pattern files for implementation details and usage examples</action>
</check>

<action>Store: {{design_patterns}} array, {{error_handling_approach}}, {{custom_error_examples}}</action>

### 3. Analyze Testing & Documentation

<action>Examine test files:

- **Location**: **tests**/, _.test._, _.spec._
- **Framework**: jest/vitest/mocha/pytest (from package.json)
- **Coverage**: configs and thresholds
  </action>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>Sample test files for structure (describe/it), naming, mocking, assertions</action>
</check>

<action>Check documentation:

- JSDoc/TSDoc comments, README per module, inline comments, API docs (Swagger/OpenAPI)
  </action>

<action>Store: {{test_framework}}, {{test_location}}, {{min_coverage}}, {{documentation_style}}</action>

### 4. Identify Quality Tools & Security

<action>Scan for:

- **Linter**: .eslintrc.\*, .pylintrc, .golangci.yml
- **Formatter**: .prettierrc.\*, .editorconfig
- **Type Checker**: tsconfig.json strict mode, mypy configs
- **Pre-commit**: .husky/, lint-staged
- **Performance** (deep/exhaustive only): memoization, lazy loading, caching
- **Security**: auth/ (JWT/sessions/OAuth), validation/ (zod/joi/yup), helmet/CORS, .env.example
  </action>

<action>Store: {{has_linter}}, {{linter_name}}, {{has_formatter}}, {{has_type_checker}}, {{auth_pattern}}, {{validation_pattern}}</action>

### 5. Generate Code Standards Document

<action>Generate code-standards.md using template:

- **Template**: {bmad_folder}/bmm/workflows/document-project/templates/code-standards-template.md
- **Variables**: project_name, date, file_naming_pattern, variable_naming_examples, design_patterns, error_handling_approach, test_framework, linter_name, formatter_name, security_patterns
- **Output**: code-standards.md (or code-standards-{part_id}.md for multi-part)
  </action>

<action>IMMEDIATELY write file(s) to disk and validate</action>

<action>Display summary:

**✓ Code Standards Analysis Complete**

**Naming:** {{file_naming_pattern}}, camelCase variables, PascalCase classes
**Patterns:** {{#each design_patterns}}{{pattern_name}} ({{location}}), {{/each}}
**Quality:** {{linter_name}}, {{formatter_name}}, {{test_framework}}, {{min_coverage}}% coverage
**Output:** code-standards.md generated
</action>

<template-output>code_standards</template-output>

<action>Update state file:

- completed_steps: {"step": "step_3.5", "status": "completed", "timestamp": "{{now}}", "summary": "Code standards: {{patterns_count}} patterns, {{tools_count}} tools"}
- current_step = "step_4"
- outputs_generated: "code-standards.md"
- findings.code_standards: summary only
  </action>

<action>PURGE detailed analysis, keep: "Code standards: {{patterns_count}} patterns, {{file_naming_pattern}}, {{test_framework}}"</action>

</step>

<step n="4" goal="Perform conditional analysis based on project type requirements" if="workflow_mode != deep_dive">

<critical>BATCHING STRATEGY FOR DEEP/EXHAUSTIVE SCANS</critical>

<check if="scan_level == deep OR scan_level == exhaustive">
  <action>This step requires file reading. Apply batching strategy:</action>

<action>Identify subfolders to process based on: - scan_level == "deep": Use critical_directories from documentation_requirements - scan_level == "exhaustive": Get ALL subfolders recursively (excluding node_modules, .git, dist, build, coverage)
</action>

<action>For each subfolder to scan: 1. Read all files in subfolder (consider file size - use judgment for files >5000 LOC) 2. Extract required information based on conditional flags below 3. IMMEDIATELY write findings to appropriate output file 4. Validate written document (section-level validation) 5. Update state file with batch completion 6. PURGE detailed findings from context, keep only 1-2 sentence summary 7. Move to next subfolder
</action>

<action>Track batches in state file:
findings.batches_completed: [
{"path": "{{subfolder_path}}", "files_scanned": {{count}}, "summary": "{{brief_summary}}"}
]
</action>
</check>

<check if="scan_level == quick">
  <action>Use pattern matching only - do NOT read source files</action>
  <action>Use glob/grep to identify file locations and patterns</action>
  <action>Extract information from filenames, directory structure, and config files only</action>
</check>

<action>For each part, check documentation_requirements boolean flags and execute corresponding scans:</action>

<check if="requires_api_scan == true">
  <action>Scan for API routes and endpoints using integration_scan_patterns</action>
  <action>Look for: controllers/, routes/, api/, handlers/, endpoints/</action>

  <check if="scan_level == quick">
    <action>Use glob to find route files, extract patterns from filenames and folder structure</action>
  </check>

  <check if="scan_level == deep OR scan_level == exhaustive">
    <action>Read files in batches (one subfolder at a time)</action>
    <action>Extract: HTTP methods, paths, request/response types from actual code</action>
  </check>

<action>Build API contracts catalog</action>
<action>IMMEDIATELY write to: {output_folder}/api-contracts-{part_id}.md</action>
<action>Validate document has all required sections</action>
<action>Update state file with output generated</action>
<action>PURGE detailed API data, keep only: "{{api_count}} endpoints documented"</action>
<template-output>api_contracts\*{part_id}</template-output>
</check>

<check if="requires_data_models == true">
  <action>Scan for data models using schema_migration_patterns</action>
  <action>Look for: models/, schemas/, entities/, migrations/, prisma/, ORM configs</action>

  <check if="scan_level == quick">
    <action>Identify schema files via glob, parse migration file names for table discovery</action>
  </check>

  <check if="scan_level == deep OR scan_level == exhaustive">
    <action>Read model files in batches (one subfolder at a time)</action>
    <action>Extract: table names, fields, relationships, constraints from actual code</action>
  </check>

<action>Build database schema documentation</action>
<action>IMMEDIATELY write to: {output_folder}/data-models-{part_id}.md</action>
<action>Validate document completeness</action>
<action>Update state file with output generated</action>
<action>PURGE detailed schema data, keep only: "{{table_count}} tables documented"</action>
<template-output>data_models\*{part_id}</template-output>
</check>

<check if="requires_state_management == true">
  <action>Analyze state management patterns</action>
  <action>Look for: Redux, Context API, MobX, Vuex, Pinia, Provider patterns</action>
  <action>Identify: stores, reducers, actions, state structure</action>
  <template-output>state_management_patterns_{part_id}</template-output>
</check>

<check if="requires_ui_components == true">
  <action>Inventory UI component library</action>
  <action>Scan: components/, ui/, widgets/, views/ folders</action>
  <action>Categorize: Layout, Form, Display, Navigation, etc.</action>
  <action>Identify: Design system, component patterns, reusable elements</action>
  <template-output>ui_component_inventory_{part_id}</template-output>
</check>

<check if="requires_hardware_docs == true">
  <action>Look for hardware schematics using hardware_interface_patterns</action>
  <ask>This appears to be an embedded/hardware project. Do you have:
  - Pinout diagrams
  - Hardware schematics
  - PCB layouts
  - Hardware documentation

If yes, please provide paths or links. [Provide paths or type 'none']
</ask>
<action>Store hardware docs references</action>
<template-output>hardware*documentation*{part_id}</template-output>
</check>

<check if="requires_asset_inventory == true">
  <action>Scan and catalog assets using asset_patterns</action>
  <action>Categorize by: Images, Audio, 3D Models, Sprites, Textures, etc.</action>
  <action>Calculate: Total size, file counts, formats used</action>
  <template-output>asset_inventory_{part_id}</template-output>
</check>

<action>Scan for additional patterns based on doc requirements:

- config_patterns → Configuration management
- auth_security_patterns → Authentication/authorization approach
- entry_point_patterns → Application entry points and bootstrap
- shared_code_patterns → Shared libraries and utilities
- async_event_patterns → Event-driven architecture
- ci_cd_patterns → CI/CD pipeline details
- localization_patterns → i18n/l10n support
  </action>

<action>Apply scan_level strategy to each pattern scan (quick=glob only, deep/exhaustive=read files)</action>

<template-output>comprehensive*analysis*{part_id}</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_4", "status": "completed", "timestamp": "{{now}}", "summary": "Conditional analysis complete, {{files_generated}} files written"}
- Update current_step = "step_5"
- Update last_updated timestamp
- List all outputs_generated
  </action>

<action>PURGE all detailed scan results from context. Keep only summaries:

- "APIs: {{api_count}} endpoints"
- "Data: {{table_count}} tables"
- "Components: {{component_count}} components"
  </action>
  </step>

<step n="5" goal="Generate source tree analysis with annotations" if="workflow_mode != deep_dive">
<action>For each part, generate complete directory tree using critical_directories from doc requirements</action>

<action>Annotate the tree with:

- Purpose of each critical directory
- Entry points marked
- Key file locations highlighted
- Integration points noted (for multi-part projects)
  </action>

<action if="multi-part project">Show how parts are organized and where they interface</action>

<action>Create formatted source tree with descriptions:

```
project-root/
├── client/          # React frontend (Part: client)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-based pages
│   │   └── api/         # API client layer → Calls server/
├── server/          # Express API backend (Part: api)
│   ├── src/
│   │   ├── routes/      # REST API endpoints
│   │   ├── models/      # Database models
│   │   └── services/    # Business logic
```

</action>

<template-output>source_tree_analysis</template-output>
<template-output>critical_folders_summary</template-output>

<action>IMMEDIATELY write source-tree-analysis.md to disk</action>
<action>Validate document structure</action>
<action>Update state file:

- Add to completed_steps: {"step": "step_5", "status": "completed", "timestamp": "{{now}}", "summary": "Source tree documented"}
- Update current_step = "step_6"
- Add output: "source-tree-analysis.md"
  </action>
  <action>PURGE detailed tree from context, keep only: "Source tree with {{folder_count}} critical folders"</action>
  </step>

<step n="6" goal="Extract development and operational information" if="workflow_mode != deep_dive">
<action>Scan for development setup using key_file_patterns and existing docs:
- Prerequisites (Node version, Python version, etc.)
- Installation steps (npm install, etc.)
- Environment setup (.env files, config)
- Build commands (npm run build, make, etc.)
- Run commands (npm start, go run, etc.)
- Test commands using test_file_patterns
</action>

<action>Look for deployment configuration using ci_cd_patterns:

- Dockerfile, docker-compose.yml
- Kubernetes configs (k8s/, helm/)
- CI/CD pipelines (.github/workflows/, .gitlab-ci.yml)
- Deployment scripts
- Infrastructure as Code (terraform/, pulumi/)
  </action>

<action if="CONTRIBUTING.md or similar found">
  <action>Extract contribution guidelines:
    - Code style rules
    - PR process
    - Commit conventions
    - Testing requirements
  </action>
</action>

<template-output>development_instructions</template-output>
<template-output>deployment_configuration</template-output>
<template-output>contribution_guidelines</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_6", "status": "completed", "timestamp": "{{now}}", "summary": "Dev/deployment guides written"}
- Update current_step = "step_7"
- Add generated outputs to list
  </action>
  <action>PURGE detailed instructions, keep only: "Dev setup and deployment documented"</action>
  </step>

<step n="7" goal="Detect multi-part integration architecture" if="workflow_mode != deep_dive and project has multiple parts">
<action>Analyze how parts communicate:
- Scan integration_scan_patterns across parts
- Identify: REST calls, GraphQL queries, gRPC, message queues, shared databases
- Document: API contracts between parts, data flow, authentication flow
</action>

<action>Create integration_points array with:

- from: source part
- to: target part
- type: REST API, GraphQL, gRPC, Event Bus, etc.
- details: Endpoints, protocols, data formats
  </action>

<action>IMMEDIATELY write integration-architecture.md to disk</action>
<action>Validate document completeness</action>

<template-output>integration_architecture</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_7", "status": "completed", "timestamp": "{{now}}", "summary": "Integration architecture documented"}
- Update current_step = "step_8"
  </action>
  <action>PURGE integration details, keep only: "{{integration_count}} integration points"</action>
  </step>

<step n="8" goal="Generate architecture documentation for each part" if="workflow_mode != deep_dive">
<action>For each part in project_parts:
  - Use matched architecture template from Step 3 as base structure
  - Fill in all sections with discovered information:
    * Executive Summary
    * Technology Stack (from Step 3)
    * Architecture Pattern (from registry match)
    * Data Architecture (from Step 4 data models scan)
    * API Design (from Step 4 API scan if applicable)
    * Component Overview (from Step 4 component scan if applicable)
    * Source Tree (from Step 5)
    * Development Workflow (from Step 6)
    * Deployment Architecture (from Step 6)
    * Testing Strategy (from test patterns)
</action>

<action if="single part project">
  - Generate: architecture.md (no part suffix)
</action>

<action if="multi-part project">
  - Generate: architecture-{part_id}.md for each part
</action>

<action>For each architecture file generated:

- IMMEDIATELY write architecture file to disk
- Validate against architecture template schema
- Update state file with output
- PURGE detailed architecture from context, keep only: "Architecture for {{part_id}} written"
  </action>

<template-output>architecture_document</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_8", "status": "completed", "timestamp": "{{now}}", "summary": "Architecture docs written for {{parts_count}} parts"}
- Update current_step = "step_9"
  </action>
  </step>

<step n="9" goal="Generate supporting documentation files" if="workflow_mode != deep_dive">
<action>Generate project-overview.md with:
- Project name and purpose (from README or user input)
- Executive summary
- Tech stack summary table
- Architecture type classification
- Repository structure (monolith/monorepo/multi-part)
- Links to detailed docs
</action>

<action>Generate source-tree-analysis.md with:

- Full annotated directory tree from Step 5
- Critical folders explained
- Entry points documented
- Multi-part structure (if applicable)
  </action>

<action>IMMEDIATELY write project-overview.md to disk</action>
<action>Validate document sections</action>

<action>Generate source-tree-analysis.md (if not already written in Step 5)</action>
<action>IMMEDIATELY write to disk and validate</action>

<action>Generate component-inventory.md (or per-part versions) with:

- All discovered components from Step 4
- Categorized by type
- Reusable vs specific components
- Design system elements (if found)
  </action>
  <action>IMMEDIATELY write each component inventory to disk and validate</action>

<action>Generate development-guide.md (or per-part versions) with:

- Prerequisites and dependencies
- Environment setup instructions
- Local development commands
- Build process
- Testing approach and commands
- Common development tasks
  </action>
  <action>IMMEDIATELY write each development guide to disk and validate</action>

<action if="deployment configuration found">
  <action>Generate deployment-guide.md with:
    - Infrastructure requirements
    - Deployment process
    - Environment configuration
    - CI/CD pipeline details
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="contribution guidelines found">
  <action>Generate contribution-guide.md with:
    - Code style and conventions
    - PR process
    - Testing requirements
    - Documentation standards
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="API contracts documented">
  <action>Generate api-contracts.md (or per-part) with:
    - All API endpoints
    - Request/response schemas
    - Authentication requirements
    - Example requests
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="Data models documented">
  <action>Generate data-models.md (or per-part) with:
    - Database schema
    - Table relationships
    - Data models and entities
    - Migration strategy
  </action>
  <action>IMMEDIATELY write to disk and validate</action>
</action>

<action if="multi-part project">
  <action>Generate integration-architecture.md with:
    - How parts communicate
    - Integration points diagram/description
    - Data flow between parts
    - Shared dependencies
  </action>
  <action>IMMEDIATELY write to disk and validate</action>

<action>Generate project-parts.json metadata file:
`json
    {
      "repository_type": "monorepo",
      "parts": [ ... ],
      "integration_points": [ ... ]
    }
    `
</action>
<action>IMMEDIATELY write to disk</action>
</action>

<template-output>supporting_documentation</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_9", "status": "completed", "timestamp": "{{now}}", "summary": "All supporting docs written"}
- Update current_step = "step_10"
- List all newly generated outputs
  </action>

<action>PURGE all document contents from context, keep only list of files generated</action>
</step>

<step n="10" goal="Generate master index as primary AI retrieval source" if="workflow_mode != deep_dive">

<critical>INCOMPLETE DOCUMENTATION MARKER CONVENTION:
When a document SHOULD be generated but wasn't (due to quick scan, missing data, conditional requirements not met):

- Use EXACTLY this marker: _(To be generated)_
- Place it at the end of the markdown link line
- Example: - [API Contracts - Server](./api-contracts-server.md) _(To be generated)_
- This allows Step 11 to detect and offer to complete these items
- ALWAYS use this exact format for consistency and automated detection
  </critical>

<action>Create index.md with intelligent navigation based on project structure</action>

<action if="single part project">
  <action>Generate simple index with:
    - Project name and type
    - Quick reference (tech stack, architecture type)
    - Links to all generated docs
    - Links to discovered existing docs
    - Getting started section
  </action>
</action>

<action if="multi-part project">
  <action>Generate comprehensive index with:
    - Project overview and structure summary
    - Part-based navigation section
    - Quick reference by part
    - Cross-part integration links
    - Links to all generated and existing docs
    - Getting started per part
  </action>
</action>

<action>Include in index.md:

## Project Documentation Index

### Project Overview

- **Type:** {{repository_type}} {{#if multi-part}}with {{parts.length}} parts{{/if}}
- **Primary Language:** {{primary_language}}
- **Architecture:** {{architecture_type}}

### Quick Reference

{{#if single_part}}

- **Tech Stack:** {{tech_stack_summary}}
- **Entry Point:** {{entry_point}}
- **Architecture Pattern:** {{architecture_pattern}}
  {{else}}
  {{#each parts}}

#### {{part_name}} ({{part_id}})

- **Type:** {{project_type}}
- **Tech Stack:** {{tech_stack}}
- **Root:** {{root_path}}
  {{/each}}
  {{/if}}

### Generated Documentation

- [Project Overview](./project-overview.md)
- [Architecture](./architecture{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless architecture_file_exists}} (To be generated) {{/unless}}
- [Source Tree Analysis](./source-tree-analysis.md)
- [Component Inventory](./component-inventory{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless component_inventory_exists}} (To be generated) {{/unless}}
- [Development Guide](./development-guide{{#if multi-part}}-{part\*id}{{/if}}.md){{#unless dev_guide_exists}} (To be generated) {{/unless}}
  {{#if deployment_found}}- [Deployment Guide](./deployment-guide.md){{#unless deployment_guide_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if contribution_found}}- [Contribution Guide](./contribution-guide.md){{/if}}
  {{#if api_documented}}- [API Contracts](./api-contracts{{#if multi-part}}-{part_id}{{/if}}.md){{#unless api_contracts_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if data_models_documented}}- [Data Models](./data-models{{#if multi-part}}-{part_id}{{/if}}.md){{#unless data_models_exists}} (To be generated) {{/unless}}{{/if}}
  {{#if multi-part}}- [Integration Architecture](./integration-architecture.md){{#unless integration_arch_exists}} (To be generated) {{/unless}}{{/if}}

### Existing Documentation

{{#each existing_docs}}

- [{{title}}]({{relative_path}}) - {{description}}
  {{/each}}

### Getting Started

{{getting_started_instructions}}
</action>

<action>Before writing index.md, check which expected files actually exist:

- For each document that should have been generated, check if file exists on disk
- Set existence flags: architecture_file_exists, component_inventory_exists, dev_guide_exists, etc.
- These flags determine whether to add the _(To be generated)_ marker
- Track which files are missing in {{missing_docs_list}} for reporting
  </action>

<action>IMMEDIATELY write index.md to disk with appropriate _(To be generated)_ markers for missing files</action>
<action>Validate index has all required sections and links are valid</action>

<template-output>index</template-output>

<action>Update state file:

- Add to completed_steps: {"step": "step_10", "status": "completed", "timestamp": "{{now}}", "summary": "Master index generated"}
- Update current_step = "step_11"
- Add output: "index.md"
  </action>

<action>PURGE index content from context</action>
</step>

<step n="11" goal="Validate and review generated documentation" if="workflow_mode != deep_dive">
<action>Show summary of all generated files:
Generated in {{output_folder}}/:
{{file_list_with_sizes}}
</action>

<action>Run validation checklist from {validation}</action>

<critical>INCOMPLETE DOCUMENTATION DETECTION:

1. PRIMARY SCAN: Look for exact marker: _(To be generated)_
2. FALLBACK SCAN: Look for fuzzy patterns (in case agent was lazy):
   - _(TBD)_
   - _(TODO)_
   - _(Coming soon)_
   - _(Not yet generated)_
   - _(Pending)_
3. Extract document metadata from each match for user selection
   </critical>

<action>Read {output_folder}/index.md</action>

<action>Scan for incomplete documentation markers:
Step 1: Search for exact pattern "_(To be generated)_" (case-sensitive)
Step 2: For each match found, extract the entire line
Step 3: Parse line to extract:

- Document title (text within [brackets] or **bold**)
- File path (from markdown link or inferable from title)
- Document type (infer from filename: architecture, api-contracts, data-models, component-inventory, development-guide, deployment-guide, integration-architecture)
- Part ID if applicable (extract from filename like "architecture-server.md" → part_id: "server")
  Step 4: Add to {{incomplete_docs_strict}} array
  </action>

<action>Fallback fuzzy scan for alternate markers:
Search for patterns: _(TBD)_, _(TODO)_, _(Coming soon)_, _(Not yet generated)_, _(Pending)_
For each fuzzy match:

- Extract same metadata as strict scan
- Add to {{incomplete_docs_fuzzy}} array with fuzzy_match flag
  </action>

<action>Combine results:
Set {{incomplete_docs_list}} = {{incomplete_docs_strict}} + {{incomplete_docs_fuzzy}}
For each item store structure:
{
"title": "Architecture – Server",
"file\*path": "./architecture-server.md",
"doc_type": "architecture",
"part_id": "server",
"line_text": "- [Architecture – Server](./architecture-server.md) (To be generated)",
"fuzzy_match": false
}
</action>

<ask>Documentation generation complete!

Summary:

- Project Type: {{project_type_summary}}
- Parts Documented: {{parts_count}}
- Files Generated: {{files_count}}
- Total Lines: {{total_lines}}

{{#if incomplete_docs_list.length > 0}}
⚠️ **Incomplete Documentation Detected:**

I found {{incomplete_docs_list.length}} item(s) marked as incomplete:

{{#each incomplete_docs_list}}
{{@index + 1}}. **{{title}}** ({{doc_type}}{{#if part_id}} for {{part_id}}{{/if}}){{#if fuzzy_match}} ⚠️ [non-standard marker]{{/if}}
{{/each}}

{{/if}}

Would you like to:

{{#if incomplete_docs_list.length > 0}}

1. **Generate incomplete documentation** - Complete any of the {{incomplete_docs_list.length}} items above
2. Review any specific section [type section name]
3. Add more detail to any area [type area name]
4. Generate additional custom documentation [describe what]
5. Finalize and complete [type 'done']
   {{else}}
6. Review any specific section [type section name]
7. Add more detail to any area [type area name]
8. Generate additional documentation [describe what]
9. Finalize and complete [type 'done']
   {{/if}}

Your choice:
</ask>

<check if="user selects option 1 (generate incomplete)">
  <ask>Which incomplete items would you like to generate?

{{#each incomplete_docs_list}}
{{@index + 1}}. {{title}} ({{doc_type}}{{#if part_id}} - {{part_id}}{{/if}})
{{/each}}
{{incomplete_docs_list.length + 1}}. All of them

Enter number(s) separated by commas (e.g., "1,3,5"), or type 'all':
</ask>

<action>Parse user selection:

- If "all", set {{selected_items}} = all items in {{incomplete_docs_list}}
- If comma-separated numbers, extract selected items by index
- Store result in {{selected_items}} array
  </action>

  <action>Display: "Generating {{selected_items.length}} document(s)..."</action>

  <action>For each item in {{selected_items}}:

1. **Identify the part and requirements:**
   - Extract part_id from item (if exists)
   - Look up part data in project_parts array from state file
   - Load documentation_requirements for that part's project_type_id

2. **Route to appropriate generation substep based on doc_type:**

   **If doc_type == "architecture":**
   - Display: "Generating architecture documentation for {{part_id}}..."
   - Load architecture_match for this part from state file (Step 3 cache)
   - Re-run Step 8 architecture generation logic ONLY for this specific part
   - Use matched template and fill with cached data from state file
   - Write architecture-{{part_id}}.md to disk
   - Validate completeness

   **If doc_type == "api-contracts":**
   - Display: "Generating API contracts for {{part_id}}..."
   - Load part data and documentation_requirements
   - Re-run Step 4 API scan substep targeting ONLY this part
   - Use scan_level from state file (quick/deep/exhaustive)
   - Generate api-contracts-{{part_id}}.md
   - Validate document structure

   **If doc_type == "data-models":**
   - Display: "Generating data models documentation for {{part_id}}..."
   - Re-run Step 4 data models scan substep targeting ONLY this part
   - Use schema_migration_patterns from documentation_requirements
   - Generate data-models-{{part_id}}.md
   - Validate completeness

   **If doc_type == "component-inventory":**
   - Display: "Generating component inventory for {{part_id}}..."
   - Re-run Step 9 component inventory generation for this specific part
   - Scan components/, ui/, widgets/ folders
   - Generate component-inventory-{{part_id}}.md
   - Validate structure

   **If doc_type == "development-guide":**
   - Display: "Generating development guide for {{part_id}}..."
   - Re-run Step 9 development guide generation for this specific part
   - Use key_file_patterns and test_file_patterns from documentation_requirements
   - Generate development-guide-{{part_id}}.md
   - Validate completeness

   **If doc_type == "deployment-guide":**
   - Display: "Generating deployment guide..."
   - Re-run Step 6 deployment configuration scan
   - Re-run Step 9 deployment guide generation
   - Generate deployment-guide.md
   - Validate structure

   **If doc_type == "integration-architecture":**
   - Display: "Generating integration architecture..."
   - Re-run Step 7 integration analysis for all parts
   - Generate integration-architecture.md
   - Validate completeness

3. **Post-generation actions:**
   - Confirm file was written successfully
   - Update state file with newly generated output
   - Add to {{newly_generated_docs}} tracking list
   - Display: "✓ Generated: {{file_path}}"

4. **Handle errors:**
   - If generation fails, log error and continue with next item
   - Track failed items in {{failed_generations}} list
     </action>

<action>After all selected items are processed:

**Update index.md to remove markers:**

1. Read current index.md content
2. For each item in {{newly_generated_docs}}:
   - Find the line containing the file link and marker
   - Remove the _(To be generated)_ or fuzzy marker text
   - Leave the markdown link intact
3. Write updated index.md back to disk
4. Update state file to record index.md modification
   </action>

<action>Display generation summary:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ **Documentation Generation Complete!**

**Successfully Generated:**
{{#each newly_generated_docs}}

- {{title}} → {{file_path}}
  {{/each}}

{{#if failed_generations.length > 0}}
**Failed to Generate:**
{{#each failed_generations}}

- {{title}} ({{error_message}})
  {{/each}}
  {{/if}}

**Updated:** index.md (removed incomplete markers)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>Update state file with all generation activities</action>

<action>Return to Step 11 menu (loop back to check for any remaining incomplete items)</action>
</check>

<action if="user requests other changes (options 2-3)">Make requested modifications and regenerate affected files</action>
<action if="user selects finalize (option 4 or 5)">Proceed to Step 12 completion</action>

<check if="not finalizing">
  <action>Update state file:
- Add to completed_steps: {"step": "step_11_iteration", "status": "completed", "timestamp": "{{now}}", "summary": "Review iteration complete"}
- Keep current_step = "step_11" (for loop back)
- Update last_updated timestamp
  </action>
  <action>Loop back to beginning of Step 11 (re-scan for remaining incomplete docs)</action>
</check>

<check if="finalizing">
  <action>Update state file:
- Add to completed_steps: {"step": "step_11", "status": "completed", "timestamp": "{{now}}", "summary": "Validation and review complete"}
- Update current_step = "step_12"
  </action>
  <action>Proceed to Step 12</action>
</check>
</step>

<step n="12" goal="Finalize and provide next steps" if="workflow_mode != deep_dive">
<action>Create final summary report</action>
<action>Compile verification recap variables:
  - Set {{verification_summary}} to the concrete tests, validations, or scripts you executed (or "none run").
  - Set {{open_risks}} to any remaining risks or TODO follow-ups (or "none").
  - Set {{next_checks}} to recommended actions before merging/deploying (or "none").
</action>

<action>Display completion message:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Project Documentation Complete! ✓

**Location:** {{output_folder}}/

**Master Index:** {{output_folder}}/index.md
👆 This is your primary entry point for AI-assisted development

**Generated Documentation:**
{{generated_files_list}}

**Next Steps:**

1. Review the index.md to familiarize yourself with the documentation structure
2. When creating a brownfield PRD, point the PRD workflow to: {{output_folder}}/index.md
3. For UI-only features: Reference {{output_folder}}/architecture-{{ui_part_id}}.md
4. For API-only features: Reference {{output_folder}}/architecture-{{api_part_id}}.md
5. For full-stack features: Reference both part architectures + integration-architecture.md

**Verification Recap:**

- Tests/extractions executed: {{verification_summary}}
- Outstanding risks or follow-ups: {{open_risks}}
- Recommended next checks before PR: {{next_checks}}

**Brownfield PRD Command:**
When ready to plan new features, run the PRD workflow and provide this index as input.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
</action>

<action>FINALIZE state file:

- Add to completed_steps: {"step": "step_12", "status": "completed", "timestamp": "{{now}}", "summary": "Workflow complete"}
- Update timestamps.completed = "{{now}}"
- Update current_step = "completed"
- Write final state file
  </action>

<action>Display: "State file saved: {{output_folder}}/project-scan-report.json"</action>

</workflow>
