## Unity Catalog
---

Unity Catalog is Databricks' unified governance layer providing centralised metadata management, fine-grained access control, and data lineage across all workspaces and clouds.

---

## 1. Three-Level Namespace

```
catalog
  └── schema (database)
        └── table / view / function / volume

Example:
  my_catalog.silver.orders        ← table
  my_catalog.bronze.raw_events    ← table
  my_catalog.gold.revenue_report  ← view
```

```sql
-- Set default catalog and schema for a session
USE CATALOG my_catalog;
USE SCHEMA silver;

-- Then reference tables without full path:
SELECT * FROM orders;

-- Or use full 3-level path:
SELECT * FROM my_catalog.silver.orders;
```

---

## 2. Metastore Hierarchy

```
Unity Catalog Metastore (one per region / account)
  │
  ├── Catalog (logical grouping, e.g., "prod", "dev", "hive_metastore")
  │     ├── Schema (database)
  │     │     ├── Tables (managed / external / views)
  │     │     ├── Volumes (file-based storage locations)
  │     │     └── Functions / ML models
  │     └── ...
  └── ...

hive_metastore = legacy metastore (per-workspace, migrated to Unity Catalog)
```

---

## 3. Creating Objects

```sql
-- Catalog
CREATE CATALOG IF NOT EXISTS my_catalog;

-- Schema
CREATE SCHEMA IF NOT EXISTS my_catalog.silver
COMMENT 'Cleaned and conformed data layer'
MANAGED LOCATION 'abfss://container@storage.dfs.core.windows.net/silver/';

-- Managed table (data managed by Unity Catalog)
CREATE TABLE IF NOT EXISTS my_catalog.silver.orders (
    order_id    INT NOT NULL,
    customer_id INT,
    amount      DOUBLE,
    order_date  DATE
)
USING DELTA;

-- External table (data at specified path, you manage the files)
CREATE TABLE IF NOT EXISTS my_catalog.bronze.raw_orders
USING DELTA
LOCATION 'abfss://container@storage.dfs.core.windows.net/bronze/raw_orders/';
```

---

## 4. Access Control (GRANT / REVOKE)

```sql
-- Catalog-level
GRANT USE CATALOG ON CATALOG my_catalog TO `analysts`;
GRANT CREATE SCHEMA ON CATALOG my_catalog TO `data_engineers`;

-- Schema-level
GRANT USE SCHEMA ON SCHEMA my_catalog.silver TO `analysts`;
GRANT CREATE TABLE ON SCHEMA my_catalog.silver TO `data_engineers`;

-- Table-level
GRANT SELECT ON TABLE my_catalog.silver.orders TO `analysts`;
GRANT MODIFY ON TABLE my_catalog.silver.orders TO `data_engineers`;

-- Column-level masking (dynamic data masking)
CREATE FUNCTION my_catalog.security.mask_email(email STRING)
RETURNS STRING
RETURN IF(IS_MEMBER('data_engineers'), email, CONCAT(LEFT(email, 2), '***@***'));

ALTER TABLE my_catalog.silver.customers
ALTER COLUMN email SET MASK my_catalog.security.mask_email;

-- Row-level security (row filter)
CREATE FUNCTION my_catalog.security.region_filter(region STRING)
RETURNS BOOLEAN
RETURN IS_MEMBER('global_admins') OR region = CURRENT_USER_REGION();

ALTER TABLE my_catalog.silver.orders
ADD ROW FILTER my_catalog.security.region_filter ON (region);
```

---

## 5. Volumes

Volumes are non-tabular file storage managed by Unity Catalog:

```sql
-- Create a managed volume
CREATE VOLUME my_catalog.bronze.raw_files;

-- Create an external volume
CREATE EXTERNAL VOLUME my_catalog.bronze.external_files
LOCATION 'abfss://container@storage.dfs.core.windows.net/uploads/';
```

```python
# Access volume files
files = dbutils.fs.ls("/Volumes/my_catalog/bronze/raw_files/")
df = spark.read.csv("/Volumes/my_catalog/bronze/raw_files/data.csv")
```

---

## 6. Data Lineage

Unity Catalog automatically tracks column-level lineage:

```
bronze.raw_orders (order_id, amount) 
  → silver.orders (order_id, amount)
    → gold.daily_revenue (date, total_amount)

Visible in Databricks UI: Catalog → Table → Lineage tab
```

---

## 7. Tags and Comments

```sql
-- Add comments for documentation
COMMENT ON TABLE my_catalog.silver.orders IS 'Cleaned orders from all channels';
COMMENT ON COLUMN my_catalog.silver.orders.amount IS 'Total order amount in USD';

-- Add tags for governance / search
ALTER TABLE my_catalog.silver.orders SET TAGS ('pii' = 'false', 'domain' = 'commerce');
ALTER COLUMN my_catalog.silver.customers.email SET TAGS ('pii' = 'true');
```
