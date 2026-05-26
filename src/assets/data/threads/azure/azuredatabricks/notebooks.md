## Azure Databricks — Notebooks & Collaboration

Databricks notebooks are the primary interactive development environment — a web-based, executable document combining code, visualisations, and narrative text.

---

## Notebook Basics

A notebook is a sequence of **cells** that can be executed individually or all at once.

### Supported Languages
&nbsp;&nbsp;- **Python** (`%python`) — default for most data engineering and ML work.  
&nbsp;&nbsp;- **SQL** (`%sql`) — query Delta tables, Hive metastore, and Unity Catalog.  
&nbsp;&nbsp;- **Scala** (`%scala`) — performance-critical transformations, custom Spark extensions.  
&nbsp;&nbsp;- **R** (`%r`) — statistical analysis and visualisation.  
&nbsp;&nbsp;- **Markdown** (`%md`) — documentation cells rendered as formatted text.
<br>

You can mix languages in the same notebook using **magic commands** (`%python`, `%sql`, etc.) at the top of any cell:

```python
# Cell 1 — Python
df = spark.read.format("delta").load("abfss://curated@myaccount.dfs.core.windows.net/sales/")
df.createOrReplaceTempView("sales")
```

```sql
-- Cell 2 — SQL (in the same notebook)
%sql
SELECT region, SUM(revenue) as total_revenue
FROM sales
GROUP BY region
ORDER BY total_revenue DESC
```

---

## Widgets — Parameterising Notebooks

**Widgets** make notebooks reusable by accepting runtime parameters — from the UI, from a job, or from another notebook via `dbutils.notebook.run()`.

```python
# Create a text widget with a default value
dbutils.widgets.text("start_date", "2024-01-01", "Start Date")
dbutils.widgets.dropdown("environment", "dev", ["dev", "test", "prod"], "Environment")

# Read widget values
start_date = dbutils.widgets.get("start_date")
env = dbutils.widgets.get("environment")

print(f"Processing from {start_date} in {env}")
```

---

## `dbutils` — Databricks Utilities

`dbutils` is a built-in Python/Scala library for common Databricks operations:

| Module | Purpose |
|---|---|
| `dbutils.fs` | File system operations on DBFS and ADLS (`ls`, `cp`, `rm`, `mkdirs`) |
| `dbutils.secrets` | Read secrets from Databricks/Key Vault secret scopes |
| `dbutils.widgets` | Create and read notebook parameters |
| `dbutils.notebook` | Run or exit notebooks programmatically |
| `dbutils.data` | Display data with rich rendering |

```python
# List files in ADLS
dbutils.fs.ls("abfss://raw@myaccount.dfs.core.windows.net/2024/")

# Read a secret (never printed to output)
connection_string = dbutils.secrets.get(scope="kv-scope", key="db-connection-string")

# Call another notebook and pass parameters
result = dbutils.notebook.run(
    "/Repos/main/pipelines/process_sales",
    timeout_seconds=3600,
    arguments={"start_date": "2024-01-01", "environment": "prod"}
)
```

---

## Notebook Chaining

Large pipelines are often split into multiple specialised notebooks called via `dbutils.notebook.run()`:

```python
# Orchestrator notebook
dbutils.notebook.run("./ingest_raw", 1800, {"date": "2024-06-01"})
dbutils.notebook.run("./transform_silver", 3600, {"date": "2024-06-01"})
dbutils.notebook.run("./aggregate_gold", 1800, {"date": "2024-06-01"})
```

Each child notebook runs in the same cluster context and returns a string exit value.
<br>

---

## Git Integration — Databricks Repos

**Repos** connects a workspace folder to a Git repository (Azure DevOps, GitHub, GitLab, Bitbucket).

&nbsp;&nbsp;- Browse, edit, commit, push, pull, and branch directly from the Databricks UI.  
&nbsp;&nbsp;- Multiple users can work in separate branches and merge via pull requests.  
&nbsp;&nbsp;- Repos replace unversioned workspace notebooks for any production-grade development.
<br>

```
Azure DevOps Repository
  └── main branch
      ├── notebooks/
      │   ├── ingest/
      │   └── transform/
      ├── src/
      │   └── utils.py          (importable Python modules)
      └── jobs/
          └── pipeline_job.json
          
Databricks Repos
  └── /Repos/<username>/my-repo  → checked-out branch
```

---

## Real-Time Co-Authoring

Multiple users can open the same notebook simultaneously:
&nbsp;&nbsp;- Each user's cursor and edits are shown in real time (like Google Docs).  
&nbsp;&nbsp;- All users share the same **cluster attachment** and cell execution state.  
&nbsp;&nbsp;- Use **comments** on cells to communicate without changing code.
<br>

---

## Notebook Outputs & Visualisations

&nbsp;&nbsp;- `display(df)` — renders a DataFrame as an interactive paginated table with built-in charting.  
&nbsp;&nbsp;- `display(df.groupBy("region").count())` — plot bar charts, line charts, scatter plots directly in the notebook.  
&nbsp;&nbsp;- **Databricks Dashboards** — publish notebook cells as a live dashboard for stakeholders (no re-running required).
<br>

---

## Best Practices

&nbsp;&nbsp;- **Notebooks for exploration; modular `.py` files for production logic** — put reusable functions in `src/` Python modules and import them; keep notebooks as thin orchestration layers.  
&nbsp;&nbsp;- **Use Repos + Git** — never develop directly in the workspace root outside of a Repo.  
&nbsp;&nbsp;- **Avoid `%run` for complex imports** — `%run` executes another notebook in the same scope (no isolation); prefer `import` from a Python module in the Repo.  
&nbsp;&nbsp;- **Parameterise everything** — use widgets or job parameters; hard-coded paths and dates are a maintenance problem.  
&nbsp;&nbsp;- **Clear outputs before committing** — notebook outputs can contain sensitive data and inflate repo size.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **`display()` vs `show()`** — `display()` is Databricks-specific, renders interactively with charts; `show()` is standard PySpark, prints to stdout — use `display()` in notebooks.  
&nbsp;&nbsp;- **`dbutils.secrets` never prints** — secrets retrieved via `dbutils.secrets.get()` are redacted in notebook output, preventing accidental exposure.  
&nbsp;&nbsp;- **Repos over unversioned notebooks** — all production code should be in a Repo for auditability and CI/CD integration.  
&nbsp;&nbsp;- **Notebook as a job task** — a notebook run as a job task runs in isolation on a job cluster; the widget values become job parameters.
