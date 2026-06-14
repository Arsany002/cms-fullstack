const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const DOCS_DIR = path.join(ROOT, "docs", "frontend");
const OUTPUT_FILE = path.join(DOCS_DIR, "FRONTEND_DOCUMENTATION.md");

const EXCLUDED_DIRS = ["node_modules", "dist", "build", ".git", "docs"];

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function walk(dir) {
    let results = [];

    if (!fs.existsSync(dir)) return results;

    const list = fs.readdirSync(dir);

    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(file)) {
                results = results.concat(walk(filePath));
            }
        } else {
            results.push(filePath);
        }
    }

    return results;
}

function readJSON(filePath) {
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function relative(filePath) {
    return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function getFilesByExtension(extensions) {
    return walk(SRC_DIR).filter((file) =>
        extensions.includes(path.extname(file))
    );
}

function extractImports(content) {
    const regex = /import\s+.*?\s+from\s+['"](.*?)['"]/g;
    const imports = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
        imports.push(match[1]);
    }

    return imports;
}

function extractComponents(filePath, content) {
    const components = [];

    const functionRegex =
        /(?:export\s+default\s+)?function\s+([A-Z][A-Za-z0-9_]*)\s*\(/g;

    const constRegex =
        /(?:export\s+)?const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*(?:\([^)]*\)|[A-Za-z0-9_]+)?\s*=>/g;

    let match;

    while ((match = functionRegex.exec(content)) !== null) {
        components.push(match[1]);
    }

    while ((match = constRegex.exec(content)) !== null) {
        components.push(match[1]);
    }

    return components.map((name) => ({
        name,
        file: relative(filePath),
    }));
}

function extractJsDocBlocks(content) {
    const regex = /\/\*\*[\s\S]*?\*\//g;
    const blocks = content.match(regex) || [];

    return blocks.map((block) =>
        block
            .replace("/**", "")
            .replace("*/", "")
            .split("\n")
            .map((line) => line.replace(/^\s*\*\s?/, ""))
            .join("\n")
            .trim()
    );
}

function detectUIFramework(dependencies) {
    const deps = Object.keys(dependencies);

    const frameworks = [];

    if (deps.includes("tailwindcss")) frameworks.push("Tailwind CSS");
    if (deps.includes("bootstrap")) frameworks.push("Bootstrap");
    if (deps.includes("@mui/material")) frameworks.push("Material UI");
    if (deps.includes("antd")) frameworks.push("Ant Design");
    if (deps.includes("chakra-ui") || deps.includes("@chakra-ui/react"))
        frameworks.push("Chakra UI");
    if (deps.includes("react-bootstrap")) frameworks.push("React Bootstrap");
    if (deps.includes("styled-components")) frameworks.push("Styled Components");

    return frameworks.length ? frameworks : ["Custom CSS / Project Styling"];
}

function detectRouting(dependencies, files) {
    const hasReactRouter =
        dependencies["react-router-dom"] ||
        files.some((file) =>
            fs.readFileSync(file, "utf8").includes("react-router-dom")
        );

    return hasReactRouter ? "React Router DOM" : "No routing library detected";
}

function generateTree(files) {
    return files
        .map((file) => relative(file))
        .sort()
        .map((file) => `- \`${file}\``)
        .join("\n");
}

function generateDocs() {
    ensureDir(DOCS_DIR);

    const packageJSON = readJSON(path.join(ROOT, "package.json"));
    const dependencies = packageJSON.dependencies || {};
    const devDependencies = packageJSON.devDependencies || {};

    const sourceFiles = getFilesByExtension([
        ".js",
        ".jsx",
        ".css",
        ".scss",
        ".json",
    ]);

    const jsxFiles = getFilesByExtension([".jsx", ".js"]);
    const styleFiles = getFilesByExtension([".css", ".scss"]);

    let allComponents = [];
    let fileSummaries = [];

    for (const file of jsxFiles) {
        const content = fs.readFileSync(file, "utf8");
        const imports = extractImports(content);
        const components = extractComponents(file, content);
        const jsdocs = extractJsDocBlocks(content);

        allComponents = allComponents.concat(components);

        fileSummaries.push({
            file: relative(file),
            imports,
            components,
            jsdocs,
        });
    }

    const uiFrameworks = detectUIFramework(dependencies);
    const routing = detectRouting(dependencies, jsxFiles);

    const md = `# Frontend Technical Documentation

## 1. Project Overview

This document provides a technical documentation report for the React frontend codebase.

The frontend is developed using React with JSX. It contains UI components, pages, routing logic, API integration, styling files, assets, and reusable utility logic.

---

## 2. Project Metadata

| Item | Value |
|---|---|
| Project Name | ${packageJSON.name || "Not specified"} |
| Version | ${packageJSON.version || "Not specified"} |
| Frontend Framework | React |
| Code Format | JSX |
| Main Source Folder | \`src/\` |
| Documentation File | \`docs/frontend/FRONTEND_DOCUMENTATION.md\` |

---

## 3. Main Technologies Used

| Category | Technology |
|---|---|
| UI Framework | React |
| Code Syntax | JSX |
| Routing | ${routing} |
| Styling | ${uiFrameworks.join(", ")} |
| Package Manager | npm |

---

## 4. UI Elements and Frontend Structure

The frontend is organized around reusable UI elements. These UI elements are usually represented as React components. Components are used to build pages, forms, layouts, buttons, cards, tables, modals, navigation bars, and other interface sections.

### Detected Components

${allComponents.length
            ? allComponents
                .map((c) => `| ${c.name} | \`${c.file}\` |`)
                .join("\n")
            : "No React components were automatically detected."
        }

${allComponents.length
            ? "\n| Component | File |\n|---|---|\n" +
            allComponents.map((c) => `| ${c.name} | \`${c.file}\` |`).join("\n")
            : ""
        }

---

## 5. Source Code Structure

The following files were found inside the frontend source folder:

${generateTree(sourceFiles)}

---

## 6. Styling and UI Design Files

The following styling files were detected:

${styleFiles.length
            ? styleFiles.map((file) => `- \`${relative(file)}\``).join("\n")
            : "No CSS or SCSS files were detected."
        }

---

## 7. File-Level Documentation

${fileSummaries
            .map((summary) => {
                return `### ${summary.file}

**Detected Components**

${summary.components.length
                        ? summary.components.map((c) => `- \`${c.name}\``).join("\n")
                        : "No component detected."
                    }

**Imports**

${summary.imports.length
                        ? summary.imports.map((i) => `- \`${i}\``).join("\n")
                        : "No imports detected."
                    }

**JSDoc Comments**

${summary.jsdocs.length
                        ? summary.jsdocs.map((doc) => `> ${doc.replace(/\n/g, "\n> ")}`).join("\n\n")
                        : "No JSDoc comments found in this file."
                    }
`;
            })
            .join("\n")}

---

## 8. Dependencies

### Production Dependencies

${Object.keys(dependencies).length
            ? Object.entries(dependencies)
                .map(([name, version]) => `| ${name} | ${version} |`)
                .join("\n")
            : "No production dependencies found."
        }

${Object.keys(dependencies).length
            ? "\n| Package | Version |\n|---|---|\n" +
            Object.entries(dependencies)
                .map(([name, version]) => `| ${name} | ${version} |`)
                .join("\n")
            : ""
        }

### Development Dependencies

${Object.keys(devDependencies).length
            ? "\n| Package | Version |\n|---|---|\n" +
            Object.entries(devDependencies)
                .map(([name, version]) => `| ${name} | ${version} |`)
                .join("\n")
            : "No development dependencies found."
        }

---

## 9. Architecture Explanation

The React frontend follows a component-based architecture. Each UI section is divided into reusable components. Pages are built by combining these components. The frontend communicates with the Laravel backend through API calls.

Typical frontend flow:

\`\`\`txt
User Interface
     ↓
React Component
     ↓
Page / Route
     ↓
API Service
     ↓
Laravel Backend API
     ↓
Database
\`\`\`

---

## 10. UI Documentation Notes

This documentation includes automatically detected React components and styling files. For stronger UI documentation, add JSDoc comments above important components.

Example:

\`\`\`jsx
/**
 * LoginForm component.
 *
 * Displays the login form and handles user authentication input.
 *
 * @component
 * @returns {JSX.Element} Login form UI.
 */
function LoginForm() {
  return <form>...</form>;
}
\`\`\`

---

## 11. Conclusion

This frontend documentation summarizes the React JSX codebase, detected UI components, file structure, dependencies, styling files, and architecture. It can be regenerated whenever the codebase changes.
`;

    fs.writeFileSync(OUTPUT_FILE, md);
    console.log(`Frontend documentation generated successfully: ${OUTPUT_FILE}`);
}

generateDocs();