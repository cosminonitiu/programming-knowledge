## Databricks Notebooks
---

Notebooks are the primary interactive interface in Databricks. They support multiple languages, rich output, and collaboration — and are also used as production job artifacts.

---

## 1. Notebook Basics

```python
# Notebooks support: Python, SQL, Scala, R (per cell)
# Language can be overridden per cell with magic commands

# Python (default)
df = spark.read.table("silver.orders")
df.show(5)

# Switch to SQL in a cell
# %sql
# SELECT region, COUNT(*) FROM silver.orders GROUP BY region

# Switch to markdown
# %md
# ## Data Exploration
# This notebook performs EDA on the orders table.
```

---

## 2. Magic Commands

```python
# %python  — run cell as Python (default for Python notebooks)
# %sql     — run cell as SQL
# %scala   — run cell as Scala
# %r       — run cell as R
# %md      — render cell as Markdown
# %sh      — run shell commands
# %fs      — DBFS file system operations (shorthand for dbutils.fs)
# %run     — execute another notebook
# %pip     — install Python packages
```

```python
# %sh example
# %sh
# ls /dbfs/mnt/datalake/

# %fs example (no % prefix in code blocks)
# %fs ls /mnt/datalake/bronze/

# %run — run another notebook and inherit its variables
# %run ./helper_functions
# %run /path/in/workspace/shared_utils
```

---

## 3. dbutils

`dbutils` is the Databricks utility library:

```python
# File system operations
dbutils.fs.ls("/mnt/datalake/")                             # list directory
dbutils.fs.mkdirs("/mnt/datalake/output/")                  # create directory
dbutils.fs.cp("/source/file.csv", "/dest/file.csv")         # copy file
dbutils.fs.rm("/mnt/old-data/", recurse=True)               # delete
dbutils.fs.put("/mnt/test.txt", "hello world", overwrite=True)  # write file

# Secrets (for credentials — never hardcode passwords)
storage_key = dbutils.secrets.get(scope="my-scope", key="storage-account-key")
api_token   = dbutils.secrets.get(scope="my-scope", key="api-token")

# Notebook utilities
dbutils.notebook.run("child_notebook", timeout_seconds=600, arguments={"date": "2024-01"})
dbutils.notebook.exit("Completed successfully")   # exit with a status message
```

---

## 4. Widgets

Widgets make notebooks parameterisable:

```python
# Create a text widget
dbutils.widgets.text("date", "2024-01-01", "Processing Date")
dbutils.widgets.dropdown("env", "dev", ["dev", "staging", "prod"], "Environment")
dbutils.widgets.combobox("region", "EMEA", ["EMEA", "APAC", "AMER"], "Region")

# Read widget value
processing_date = dbutils.widgets.get("date")
env = dbutils.widgets.get("env")

# Use in query
df = spark.sql(f"SELECT * FROM silver.orders WHERE date = '{processing_date}'")

# Remove all widgets
dbutils.widgets.removeAll()
```

---

## 5. Notebook Workflows (chaining)

```python
# Parent notebook: orchestrate multiple child notebooks
import concurrent.futures

tasks = [
    {"notebook": "./extract_orders", "params": {"date": "2024-01-01"}},
    {"notebook": "./extract_customers", "params": {"date": "2024-01-01"}},
]

def run_notebook(task):
    result = dbutils.notebook.run(
        task["notebook"],
        timeout_seconds=1800,
        arguments=task["params"]
    )
    return result

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    futures = [executor.submit(run_notebook, t) for t in tasks]
    results = [f.result() for f in futures]
```

---

## 6. Displaying Data

```python
# Display (richly rendered table, chart, etc.)
display(df)
display(df.groupBy("region").count())

# Show (plain text output)
df.show(20, truncate=False)

# Plotting inline
import matplotlib.pyplot as plt
fig, ax = plt.subplots()
ax.bar(pdf["region"], pdf["count"])
display(fig)   # renders in notebook output
```

---

## 7. Version Control

```python
# Connect notebook to Git repo: Workspace → Repos → Add Repo
# Supports GitHub, GitLab, Azure DevOps, Bitbucket

# Notebooks stored as .ipynb or source-only Python/SQL files in the repo
# Allows PR-based code review and CI/CD pipelines

# Databricks Asset Bundles (DABs) — package notebooks, jobs, DLT pipelines as code
# bundle.yml defines the entire workspace configuration
```
