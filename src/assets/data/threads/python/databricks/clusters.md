## Databricks Clusters
---

Clusters are groups of virtual machines running Apache Spark. Choosing the right cluster type and configuration is critical for both performance and cost.

---

## 1. All-Purpose vs Job Clusters

| Aspect | All-Purpose Cluster | Job Cluster |
|--------|---------------------|-------------|
| **Purpose** | Interactive development, notebooks | Run a specific job, then terminate |
| **Lifecycle** | Created manually, persists until stopped | Created at job start, terminated at job end |
| **Cost** | Running the whole time | Only billed during job execution |
| **Sharing** | Multiple users/notebooks | Isolated per job run |
| **Start time** | Instant (if already running) | 3–8 minutes (cold start) |
| **Use for** | Development, exploration | Production ETL, scheduled pipelines |

---

## 2. Cluster Modes

```
Standard (Assigned):    One user per cluster, full control
High Concurrency:       Multiple users share one cluster, fine-grained access control
Single Node:            Driver only, no workers — good for small data / pandas / sklearn
```

---

## 3. Cluster Configuration

```json
{
  "cluster_name": "prod-etl-cluster",
  "spark_version": "14.3.x-scala2.12",
  "node_type_id": "Standard_DS4_v2",
  "driver_node_type_id": "Standard_DS4_v2",
  "num_workers": 8,
  "autoscale": {
    "min_workers": 2,
    "max_workers": 16
  },
  "spark_conf": {
    "spark.sql.adaptive.enabled": "true",
    "spark.sql.shuffle.partitions": "400"
  },
  "auto_termination_minutes": 30,
  "azure_attributes": {
    "availability": "SPOT_WITH_FALLBACK_AZURE",
    "spot_bid_max_price": -1
  }
}
```

---

## 4. Autoscaling

```python
# Autoscaling dynamically adds/removes workers based on load
# Spark task queue grows → add workers
# Workers idle → remove workers (down to min_workers)

# Optimised autoscaling (Databricks-specific):
# More reactive than standard Spark autoscaling
# Configurable in cluster policy
```

---

## 5. Cluster Policies

Cluster policies enforce constraints and simplify cluster creation:

```json
{
  "name": "Data Engineering Policy",
  "definition": {
    "spark_version": {
      "type": "allowlist",
      "values": ["14.3.x-scala2.12", "13.3.x-lts-scala2.12"]
    },
    "autoscale.min_workers": {
      "type": "range",
      "minValue": 1,
      "maxValue": 4
    },
    "autoscale.max_workers": {
      "type": "range",
      "minValue": 2,
      "maxValue": 20
    },
    "auto_termination_minutes": {
      "type": "fixed",
      "value": 30
    }
  }
}
```

---

## 6. DBR (Databricks Runtime) Versions

```python
# LTS (Long Term Support): 12.2 LTS, 13.3 LTS, 14.3 LTS
# Use LTS for production — security patches guaranteed for 2+ years

# ML Runtime: includes PyTorch, TensorFlow, scikit-learn
# GPU Runtime: CUDA-enabled for deep learning

# Check versions in notebook:
print(spark.version)           # Spark version
import sys; print(sys.version) # Python version

# Photon (runtime acceleration):
# Enabled by selecting "Photon Acceleration" checkbox or DBR 14.x+
# Speeds up SQL queries by 2-10x via C++ vectorised engine
```

---

## 7. Cluster Libraries

```python
# Install libraries on a cluster:
# 1. Cluster UI → Libraries tab → Install New
# 2. Supports: PyPI, Maven, CRAN, DBFS
# 3. Or in notebook (session-only):

%pip install pandas==2.0.3
%pip install pandera great-expectations

# Or dbutils:
dbutils.library.installPyPI("requests", version="2.31.0")
dbutils.library.restartPython()
```

---

## 8. Accessing Cluster Metrics

```python
# Spark UI: available at cluster → Spark UI link
# Ganglia: hardware metrics (CPU, memory, network) → Cluster → Metrics
# Log4j logs: driver and executor logs available in Cluster → Driver Logs

# Programmatic monitoring
spark.sparkContext.statusTracker().getActiveJobIds()
```
