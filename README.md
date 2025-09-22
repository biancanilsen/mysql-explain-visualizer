# MySQL Explain Visualizer

Single Page Application to visualize and analyze MySQL EXPLAIN FORMAT=JSON output. It parses the JSON, renders an interactive execution plan diagram, and generates performance alerts with actionable optimization suggestions.

- Interactive tree diagram (Mermaid)
- Details panel for raw node data
- Heuristic-based analysis and optimization tips
- Client-side only, deployable to static hosts (Vercel/Netlify/GitHub Pages)

## Quick Start

Prerequisites
- Node.js 20.19+ (recommended). Vite 7 requires 20.19+ or 22.12+. On Node 20.18 you'll see an engine warning but dev may still run.

Install & Run
```
cd mysql-explain-visualizer
npm install
npm run dev
```
Local dev server URL will be printed (typically http://localhost:5173).

Build & Preview (for deployment)
```
npm run build
npm run preview
```

## How to Use

1) Paste the raw JSON from your EXPLAIN FORMAT=JSON into the textarea.
2) Click “Analisar”.
3) Inspect:
   - Execution Plan: nodes colored by cost
   - Analysis & Suggestions: heuristics flagged alerts
   - Details: click a node in the diagram to see its raw JSON details

A sample JSON is preloaded to validate functionality.

## Visual Encoding

- Top-down flowchart where the root is the final operation; children are inputs
- Node label:
  - Operation (access_type)
  - Table name
  - Cost (prefix_cost or query_cost)
  - Rows examined/produced
- Color coding:
  - Red (hot): node(s) with the maximum cost
  - Yellow/Orange (warm): nodes with cost ≥ 25% of max
  - Green (cool): lower-cost nodes

## Heuristics Implemented

- ALERTA: Full Table Scan
  - Trigger: access_type === "ALL"
  - Extra: rows_examined_per_scan > 5000
  - Suggestion: Create/use index for WHERE/JOIN columns

- ALERTA: Using filesort
  - Trigger: using_filesort === true anywhere
  - Suggestion: Ensure ORDER BY columns can be covered by index

- ALERTA: Using temporary
  - Trigger: using_temporary_table === true anywhere
  - Suggestion: Queries with GROUP BY/UNION may be optimizable via indexing

- ALERTA: Possible indexes not used
  - Trigger: possible_keys present but key missing/null
  - Suggestion: Avoid functions on indexed columns (e.g., LOWER(col)) that prevent index usage

- INFORMATIVO: Bottleneck
  - Always computed: node(s) with maximum cost. Shows percent of total query cost.

Implementation references:
- Types and helpers: [src/lib/explain/types.ts](src/lib/explain/types.ts)
- Parser/normalizer: [src/lib/explain/normalize.ts](src/lib/explain/normalize.ts)
- Heuristics: [src/lib/explain/heuristics.ts](src/lib/explain/heuristics.ts)
- Mermaid graph builder: [src/lib/mermaid/buildGraph.ts](src/lib/mermaid/buildGraph.ts)
- Main component: [src/components/ExplainVisualizer.tsx](src/components/ExplainVisualizer.tsx)

## Tech Stack

- React + TypeScript (Vite)
- Mermaid.js for diagrams
- Tailwind CSS (v4 import-only setup)
- No backend required

Tailwind setup:
- PostCSS plugins: [postcss.config.js](postcss.config.js)
- Tailwind import: [src/index.css](src/index.css)

## Project Structure

```
mysql-explain-visualizer/
├─ index.html
├─ package.json
├─ postcss.config.js
├─ src/
│  ├─ main.tsx
│  ├─ index.css
│  ├─ App.tsx
│  ├─ components/
│  │  ├─ ExplainVisualizer.tsx
│  │  ├─ AnalysisPanel.tsx
│  │  └─ DetailsPanel.tsx
│  └─ lib/
│     ├─ explain/
│     │  ├─ types.ts
│     │  ├─ normalize.ts
│     │  └─ heuristics.ts
│     └─ mermaid/
│        └─ buildGraph.ts
└─ vite.config.ts
```

## Deployment

This is a pure client-side app; deploy the built `dist/` directory to any static host:

- Vercel / Netlify / GitHub Pages
- Nginx/Apache static hosting

Steps (generic):
```
npm run build
# Upload the dist/ folder to your hosting provider
```

For GitHub Pages:
- Set base path in vite config if deploying under a subpath (e.g., repository name)
- Serve `dist/` as Pages artifact

## Notes on Node/Vite Versions

- Vite 7 and @vitejs/plugin-react 5 declare engines Node 20.19+ or 22.12+.
- On Node 20.18 you will see warnings; dev may still run. If you encounter issues, upgrade Node or pin to older Vite/plugin-react versions in package.json.

## Extending

- Add more heuristics in [src/lib/explain/heuristics.ts](src/lib/explain/heuristics.ts)
- Handle additional MySQL EXPLAIN shapes in [src/lib/explain/normalize.ts](src/lib/explain/normalize.ts)
- Customize colors / thresholds in [src/lib/mermaid/buildGraph.ts](src/lib/mermaid/buildGraph.ts)

## License

MIT
