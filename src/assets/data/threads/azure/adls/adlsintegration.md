## ADLS Gen2 — Integration with Azure Services

ADLS Gen2 is the central storage layer in the Azure data platform. All major Azure data services integrate with it natively.

---

## Azure Databricks

The most common integration pattern — Databricks reads and writes ADLS Gen2 as the Lakehouse storage layer.

### Access Patterns

| Pattern | Description | Recommended? |
|---|---|---|
| **Unity Catalog External Location** | Govern access via Unity Catalog; no mount points | ✅ Yes (modern approach) |
| **Direct ABFSS + Managed Identity** | Configure OAuth via cluster/workspace config | ✅ Yes |
| **DBFS Mount** | Legacy `dbutils.fs.mount()` — mounts ADLS as `/mnt/<name>` | ❌ Deprecated in Unity Catalog workspaces |
| **Account key in config** | Pass account key directly | ❌ Never in production |

```python
# Read with ABFSS URI (after Unity Catalog or OAuth is configured)
df = spark.read.format("delta").load(
    "abfss://curated@adlsanalyticsprod.dfs.core.windows.net/sales/"
)
df.write.format("delta").mode("append").save(
    "abfss://curated@adlsanalyticsprod.dfs.core.windows.net/sales_processed/"
)
```

---

## Azure Data Factory (ADF)

ADF uses ADLS Gen2 as both a **source** and **sink** in Copy Activity and Mapping Data Flows.

### Linked Service Configuration

```json
{
  "type": "AzureBlobFS",
  "typeProperties": {
    "url": "https://adlsanalyticsprod.dfs.core.windows.net/",
    "accountKey": {
      "type": "AzureKeyVaultSecret",
      "store": { "referenceName": "kv-analytics-prod", "type": "LinkedServiceReference" },
      "secretName": "adls-account-key"
    }
  }
}
```

> Prefer managed identity authentication over account key — set `connectVia` to the ADF integration runtime and assign the `Storage Blob Data Contributor` role to the ADF managed identity.

### Common Patterns
&nbsp;&nbsp;- **Land-and-process** — Copy Activity lands raw files from REST API / SQL / S3 → ADLS raw zone; a Databricks Notebook Activity then processes them.  
&nbsp;&nbsp;- **Parameterised pipelines** — use ADF parameters to pass container name, date partition, or file path dynamically.  
&nbsp;&nbsp;- **Trigger types** — schedule trigger, tumbling window trigger, storage event trigger (fires when a file arrives in a specific ADLS path).
<br>

---

## Azure Synapse Analytics

Synapse provides **serverless SQL pools** and **dedicated SQL pools** that query ADLS Gen2 directly.

### Serverless SQL — Query ADLS Directly
```sql
-- Query Parquet files in ADLS Gen2 without loading into a table
SELECT *
FROM OPENROWSET(
    BULK 'https://adlsanalyticsprod.dfs.core.windows.net/curated/sales/*.parquet',
    FORMAT = 'PARQUET'
) AS [result]
WHERE result.year = 2024;
```

### External Tables over Delta Lake
```sql
CREATE EXTERNAL TABLE SalesDelta
WITH (
    LOCATION = 'curated/sales/',
    DATA_SOURCE = ADLSGen2DataSource,
    FILE_FORMAT = DeltaFormat
)
AS SELECT * FROM ...;
```

---

## Azure Stream Analytics

Stream Analytics jobs read from **Event Hubs** or **IoT Hub** and write results directly to ADLS Gen2 as Parquet or JSON.

```
[Event Hub] → [Stream Analytics Job] → [ADLS Gen2 raw/streaming/]
```

&nbsp;&nbsp;- Use **time-based windowing** (tumbling, hopping, sliding) to batch stream output into time-partitioned files.  
&nbsp;&nbsp;- Output path pattern: `{date}/{time}` for automatic date partitioning.
<br>

---

## Azure Machine Learning

Azure ML uses ADLS Gen2 as a **datastore** for training datasets, model artefacts, and experiment outputs.

```python
from azure.ai.ml import MLClient
from azure.ai.ml.entities import AzureBlobDatastore

ml_client = MLClient(DefaultAzureCredential(), subscription_id, resource_group, workspace)

datastore = AzureBlobDatastore(
    name="adls_training_data",
    account_name="adlsanalyticsprod",
    container_name="curated",
    credentials=NoneCredentialConfiguration()  # uses workspace managed identity
)
ml_client.create_or_update(datastore)
```

---

## Azure Purview / Microsoft Purview (Data Governance)

Microsoft Purview scans ADLS Gen2 accounts to:
&nbsp;&nbsp;- **Discover** data assets (containers, directories, files, Delta tables).  
&nbsp;&nbsp;- **Classify** data automatically (PII, financial data, health records) using built-in and custom classifiers.  
&nbsp;&nbsp;- **Track lineage** — show how data flows from ADLS through ADF → Databricks → Synapse.  
&nbsp;&nbsp;- **Business glossary** — map technical column names to business terms.
<br>

---

## Integration Architecture — End-to-End

```
External Sources (REST APIs, on-prem DBs, SaaS)
        ↓  Azure Data Factory / Event Hubs
ADLS Gen2 raw/        (Bronze — immutable landing zone)
        ↓  Azure Databricks (Spark / Delta Live Tables)
ADLS Gen2 curated/    (Silver — cleaned, conformed Delta tables)
        ↓  Azure Databricks (aggregation jobs)
ADLS Gen2 serving/    (Gold — business-level aggregates)
        ↓  Azure Synapse / Power BI Direct Lake
End Users & Dashboards
```

---

## Interview Talking Points

&nbsp;&nbsp;- **ADLS as the single source of truth** — all compute layers (Databricks, Synapse, AML) read from and write to the same ADLS account; compute is ephemeral, storage is persistent.  
&nbsp;&nbsp;- **Event-triggered ADF pipelines** — use storage event triggers to start processing as soon as a file lands, replacing scheduled polling.  
&nbsp;&nbsp;- **Synapse serverless SQL** — useful for ad-hoc SQL queries over ADLS without provisioning a Databricks cluster; good for analysts who prefer SQL over PySpark.  
&nbsp;&nbsp;- **Purview lineage** — demonstrates data governance maturity in enterprise environments; links business glossary terms to physical columns.
