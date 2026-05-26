## ADLS Gen2 — Storage Tiers & Lifecycle Management

ADLS Gen2 inherits Azure Blob Storage's tiered storage model, enabling cost optimisation by matching the access frequency of data to the appropriate storage tier.

---

## Storage Access Tiers

| Tier | Storage Cost | Access Cost | Retrieval Latency | Typical Use |
|---|---|---|---|---|
| **Hot** | Highest | Lowest | Milliseconds | Frequently accessed data — active pipelines, current-month data |
| **Cool** | Lower (~50% vs Hot) | Higher | Milliseconds | Infrequently accessed — last 30–90 days, compliance copies |
| **Cold** | Even lower | Higher than Cool | Milliseconds | Rarely accessed — quarterly archives, raw data older than 90 days |
| **Archive** | Lowest | Highest (requires rehydration) | Hours | Long-term retention — regulatory archives, data older than 180 days |

**Archive rehydration** — before you can read an archived blob, you must rehydrate it to Hot or Cool tier. This takes 1–15 hours (standard priority) or up to 1 hour (high priority, higher cost).
<br>

> **Note:** The tier is set at the **blob (file) level**, not the container level. Containers themselves have no tier — only blobs do. However, you can set a default tier at the storage account level (Hot or Cool).

---

## Lifecycle Management Policies

Lifecycle management automates tier transitions and deletions based on rules, eliminating the need to manually manage old data.

### Policy Structure

```json
{
  "rules": [
    {
      "name": "raw-data-lifecycle",
      "enabled": true,
      "type": "Lifecycle",
      "definition": {
        "filters": {
          "blobTypes": ["blockBlob"],
          "prefixMatch": ["raw/"]
        },
        "actions": {
          "baseBlob": {
            "tierToCool": { "daysAfterModificationGreaterThan": 30 },
            "tierToCold": { "daysAfterModificationGreaterThan": 90 },
            "tierToArchive": { "daysAfterModificationGreaterThan": 180 },
            "delete": { "daysAfterModificationGreaterThan": 365 }
          }
        }
      }
    }
  ]
}
```

### Common Rule Conditions

| Condition | Description |
|---|---|
| `daysAfterModificationGreaterThan` | Days since the blob was last modified |
| `daysAfterCreationGreaterThan` | Days since the blob was created |
| `daysAfterLastAccessTimeGreaterThan` | Days since last read (requires access tracking enabled) |
| `daysAfterLastTierChangeGreaterThan` | Days since the last tier change |

### Filter Options
&nbsp;&nbsp;- **`prefixMatch`** — apply the rule only to blobs whose names start with a given prefix (e.g., `raw/`, `archive/`).  
&nbsp;&nbsp;- **`blobTypes`** — `blockBlob` (standard files), `appendBlob`, or `baseBlob` with `snapshot` / `version` sub-actions.
<br>

---

## Medallion Architecture & Tier Strategy

A typical Lakehouse on ADLS Gen2 uses different tiers per zone:

```
Bronze (raw/)      → Hot tier (active ingestion)
                   → Cool after 30 days (reference but rarely queried)
                   → Archive after 180 days (regulatory retention)

Silver (curated/)  → Hot tier (active Databricks queries)
                   → Cool after 90 days (historical partitions)

Gold (serving/)    → Hot tier always (BI tools query this layer)
```

---

## Immutability Policies (WORM)

For regulatory compliance (SEC 17a-4, FINRA, HIPAA) you can configure **Write-Once, Read-Many (WORM)** policies:

&nbsp;&nbsp;- **Time-based retention** — blobs cannot be modified or deleted until the retention period expires.  
&nbsp;&nbsp;- **Legal hold** — blobs are locked indefinitely until the hold is removed.  
&nbsp;&nbsp;- Applies at the container level (container-level immutability) or blob version level.
<br>

---

## Soft Delete & Versioning

&nbsp;&nbsp;- **Blob soft delete** — deleted blobs are retained for a configurable period (1–365 days) and can be recovered.  
&nbsp;&nbsp;- **Container soft delete** — recover accidentally deleted containers.  
&nbsp;&nbsp;- **Blob versioning** — every overwrite creates a new version; previous versions are retained and accessible.  
<br>

These features protect against accidental deletion but incur additional storage costs — evaluate carefully for high-churn landing zones.
<br>

---

## Cost Optimisation Checklist

&nbsp;&nbsp;- Enable lifecycle management on raw/archive containers.  
&nbsp;&nbsp;- Compact Delta tables (`OPTIMIZE`) to reduce file count and storage overhead.  
&nbsp;&nbsp;- Run `VACUUM` on Delta tables to remove files no longer needed for time travel.  
&nbsp;&nbsp;- Use Cool or Cold tier for historical partitions not queried by active pipelines.  
&nbsp;&nbsp;- Use `daysAfterLastAccessTimeGreaterThan` (with access tracking enabled) for user-driven data in sandbox containers.  
&nbsp;&nbsp;- Monitor with **Azure Cost Management** + storage account metrics to identify unexpectedly large containers.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Archive ≠ immediately readable** — must rehydrate first; not suitable for data that needs to be queryable on demand.  
&nbsp;&nbsp;- **Tier transitions have minimum durations** — blobs in Cool tier must stay for at least 30 days before moving to Archive or a fee is charged for early deletion.  
&nbsp;&nbsp;- **Lifecycle policies + Delta VACUUM** — two complementary cleanup mechanisms; lifecycle manages files at the storage layer, VACUUM manages the Delta transaction log.  
&nbsp;&nbsp;- **WORM for compliance** — immutability policies are required for certain financial and healthcare regulatory frameworks.
