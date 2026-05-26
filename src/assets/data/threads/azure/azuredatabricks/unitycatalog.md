## Unity Catalog

**Unity Catalog** is the unified governance and metadata layer for Azure Databricks. It provides a single, account-level metastore that governs data access, lineage tracking, and auditing across all Databricks workspaces in an Azure tenant.

---

## Why Unity Catalog?

Before Unity Catalog, each Databricks workspace had its own **legacy Hive metastore** — isolated, with no sharing or centralised governance across workspaces. Unity Catalog solves this:

| Feature | Legacy Hive Metastore | Unity Catalog |
|---|---|---|
| Scope | Per workspace | Account-wide (all workspaces) |
| Access control | Table-level ACLs only | Column-level masking, row-level filtering |
| Data lineage | None | Automatic end-to-end lineage |
| Audit logs | Databricks audit logs | Centralised, queryable system tables |
| External data | DBFS mounts | External Locations + Storage Credentials |

---

## Three-Level Namespace

Unity Catalog uses a three-level naming hierarchy:

```
catalog.schema.table

Examples:
  main.sales.orders           → table "orders" in schema "sales" in catalog "main"
  analytics_prod.silver.sales → table "sales" in schema "silver" in catalog "analytics_prod"
  hive_metastore.default.old_table → legacy Hive metastore (backwards-compatible)
```

| Level | Description |
|---|---|
| **Catalog** | Top-level container; typically one per environment (dev/prod) or per domain |
| **Schema** | Equivalent to a database; groups related tables |
| **Table / View / Volume / Function** | The actual data object |

---

## Access Control

Unity Catalog's access control model uses **GRANT / REVOKE** SQL statements, similar to a traditional database.

### Privilege Hierarchy

```
Metastore → Catalog → Schema → Table → Column
```

Privileges granted at a higher level cascade down (with exceptions).
<br>

### Common Privileges

| Privilege | Level | What it allows |
|---|---|---|
| `USE CATALOG` | Catalog | Browse catalog contents |
| `USE SCHEMA` | Schema | Browse schema contents |
| `SELECT` | Table/View | Read table data |
| `MODIFY` | Table | Insert, update, delete rows |
| `CREATE TABLE` | Schema | Create new tables in the schema |
| `ALL PRIVILEGES` | Any | Full access |

```sql
-- Grant a group read access to a table
GRANT USE CATALOG ON CATALOG analytics_prod TO `data-analysts`;
GRANT USE SCHEMA ON SCHEMA analytics_prod.silver TO `data-analysts`;
GRANT SELECT ON TABLE analytics_prod.silver.sales TO `data-analysts`;

-- Revoke
REVOKE SELECT ON TABLE analytics_prod.silver.sales FROM `data-analysts`;
```

---

## Column Masking & Row Filtering

### Column Masking
Replace sensitive column values for users who should not see the raw data:

```sql
CREATE FUNCTION mask_email(email STRING)
RETURNS STRING
RETURN CASE
  WHEN is_member('pii-approved') THEN email
  ELSE REGEXP_REPLACE(email, '(^[^@]+)', '***')
END;

ALTER TABLE customers ALTER COLUMN email
SET MASK mask_email;
```

### Row Filtering
Restrict which rows a user can see:

```sql
CREATE FUNCTION filter_by_region(region STRING)
RETURNS BOOLEAN
RETURN is_member('global-access') OR current_user() LIKE '%' || region || '%';

ALTER TABLE sales ADD ROW FILTER filter_by_region ON (region);
```

---

## External Locations & Storage Credentials

Unity Catalog abstracts raw ADLS Gen2 paths behind **governed access points**.

### Storage Credential
An Entra ID service principal or managed identity that has RBAC access to the ADLS Gen2 storage account:

```sql
CREATE STORAGE CREDENTIAL adls_prod_credential
WITH AZURE_MANAGED_IDENTITY (
  CREDENTIAL 'mi-databricks-prod'
);
```

### External Location
Maps a Unity Catalog path to an ADLS Gen2 URI, using the credential:

```sql
CREATE EXTERNAL LOCATION raw_data
URL 'abfss://raw@adlsanalyticsprod.dfs.core.windows.net/'
WITH (STORAGE CREDENTIAL adls_prod_credential);

-- Grant access
GRANT READ FILES ON EXTERNAL LOCATION raw_data TO `data-engineers`;
```

Once the external location exists, tables can be created pointing to it without requiring any user to know the actual ADLS path.
<br>

---

## Data Lineage

Unity Catalog automatically captures and displays lineage for:
&nbsp;&nbsp;- Column-level lineage — track which source columns feed into a derived column.  
&nbsp;&nbsp;- Table-level lineage — which upstream tables fed this table, and which downstream tables read from it.  
&nbsp;&nbsp;- Cross-workspace lineage — lineage tracked even when data flows through multiple workspaces.
<br>

```
raw.events.click_events
        ↓ (SELECT click_id, user_id FROM ...)
silver.web.user_clicks
        ↓ (GROUP BY user_id)
gold.kpis.daily_active_users
        ↓ (Power BI report)
```

---

## System Tables (Audit & Observability)

Unity Catalog exposes **system tables** — queryable logs of platform activity:

```sql
-- Query all data access events in the last 7 days
SELECT *
FROM system.access.audit
WHERE event_time > NOW() - INTERVAL 7 DAYS
  AND action_name = 'commandSubmit';

-- Find which tables a user has queried
SELECT DISTINCT request_params.table_full_name
FROM system.access.audit
WHERE user_identity.email = 'analyst@contoso.com'
  AND action_name = 'SELECT';
```

Available system schema tables: `audit`, `billing` (usage/cost), `lineage` (data lineage), `information_schema` (metadata).
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Account-level metastore** — one Unity Catalog per Databricks account (not per workspace); tables registered once are accessible from all workspaces.  
&nbsp;&nbsp;- **Three-level namespace** — `catalog.schema.table` replaces the legacy two-level `database.table` (Hive) model.  
&nbsp;&nbsp;- **Column masking at the governance layer** — mask applied at query time for all engines (SQL Warehouse, job cluster, Synapse) — no application-level masking code needed.  
&nbsp;&nbsp;- **External Location > DBFS mount** — Unity Catalog external locations are governed; DBFS mounts bypass Unity Catalog's access control.  
&nbsp;&nbsp;- **Automatic lineage** — significant advantage over manual documentation; lineage is captured without any developer effort.
