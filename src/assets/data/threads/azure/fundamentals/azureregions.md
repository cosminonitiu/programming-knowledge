## Regions, Availability Zones & Resource Groups

Azure organises its global infrastructure into a hierarchy of **regions**, **availability zones**, and logical containers called **resource groups**.

---

## Azure Regions

A **region** is a set of datacenters deployed within a latency-defined perimeter, connected via a dedicated low-latency network.

&nbsp;&nbsp;- Azure has **60+ regions** across the globe (e.g., *West Europe*, *East US 2*, *Southeast Asia*).  
&nbsp;&nbsp;- When you create a resource you always specify a region — the region determines where data physically resides (important for data residency compliance).  
&nbsp;&nbsp;- Not every service or VM SKU is available in every region; check the [Azure Products by Region](https://azure.microsoft.com/en-us/explore/global-infrastructure/products-by-region/) page.
<br>

---

## Region Pairs

Most Azure regions are **paired** with another region in the same geography.

| Region | Pair |
|---|---|
| West Europe | North Europe |
| East US | West US |
| UK South | UK West |

**Why it matters:**
&nbsp;&nbsp;- Azure-initiated maintenance updates are rolled out to one paired region at a time — guaranteeing that at least one region stays available.  
&nbsp;&nbsp;- Geo-redundant storage (GRS / GZRS) replicates data asynchronously to the paired region.  
&nbsp;&nbsp;- For disaster recovery, deploy active/passive workloads across paired regions.
<br>

---

## Availability Zones (AZs)

An **availability zone** is a physically separate datacenter within a region — distinct power, cooling, and networking.

```
Region: West Europe
├── Zone 1 — Datacenter A
├── Zone 2 — Datacenter B
└── Zone 3 — Datacenter C
```

&nbsp;&nbsp;- Zones protect against **datacenter-level failures** (not region-level).  
&nbsp;&nbsp;- Services that support AZs offer **Zone-redundant** (automatic distribution) or **Zonal** (pin to a specific zone) deployment.  
&nbsp;&nbsp;- Not all regions have AZs — they are available in most major regions.
<br>

### Zone-Redundant vs Zonal Deployment

| Mode | Description | Use case |
|---|---|---|
| **Zone-redundant** | Azure distributes replicas across all zones automatically | Databases, storage accounts, AKS node pools |
| **Zonal** (zone-pinned) | Resource pinned to a specific zone | Low-latency colocated resources (VM + managed disk in same zone) |

---

## Subscriptions

A **subscription** is the billing and policy boundary in Azure.

&nbsp;&nbsp;- Every resource belongs to exactly one subscription.  
&nbsp;&nbsp;- Subscriptions have **spending limits** and can be grouped under **Management Groups** for governance.  
&nbsp;&nbsp;- Common pattern: separate subscriptions per environment (Dev, Test, Prod) to isolate blast radius and costs.
<br>

---

## Resource Groups

A **resource group** is a logical container for Azure resources that share a common lifecycle.

```
Resource Group: rg-analytics-prod
├── Storage Account: adlsanalyticsdev
├── Databricks Workspace: dbw-analytics-prod
├── Azure Data Factory: adf-analytics-prod
└── Key Vault: kv-analytics-prod
```

**Key rules:**
&nbsp;&nbsp;- Every resource must belong to one (and only one) resource group.  
&nbsp;&nbsp;- Resources in a group can span multiple regions — the resource group itself has a metadata region but its resources do not need to match.  
&nbsp;&nbsp;- Deleting a resource group deletes all resources inside it — use this to tear down entire environments cleanly.  
&nbsp;&nbsp;- RBAC and Azure Policy can be applied at the resource group scope.
<br>

### Naming Conventions (Best Practice)

A consistent naming scheme helps with automation and cost reporting:

```
{resource-type}-{workload}-{environment}-{region}

Examples:
  rg-analytics-prod-weu        (resource group)
  dbw-analytics-prod-weu       (Databricks workspace)
  adls-analytics-prod-weu      (storage account)
  kv-analytics-prod-weu        (key vault)
```

---

## Management Groups

**Management Groups** provide a governance hierarchy above subscriptions.

```
Root Management Group
├── MG: Platform
│   ├── Subscription: Connectivity
│   └── Subscription: Identity
└── MG: Landing Zones
    ├── Subscription: Dev
    ├── Subscription: Test
    └── Subscription: Prod
```

&nbsp;&nbsp;- Azure Policy and RBAC assigned at a management group scope **inherit down** to all child subscriptions and resource groups.  
&nbsp;&nbsp;- The **CAF (Cloud Adoption Framework)** recommends management group hierarchies based on environment and business unit.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Region vs AZ** — region = geography; AZ = physical datacenter within a region.  
&nbsp;&nbsp;- **Paired regions for DR** — for business continuity, replicate across region pairs.  
&nbsp;&nbsp;- **Resource group = lifecycle unit** — group resources that are created and deleted together.  
&nbsp;&nbsp;- **Blast radius isolation** — separate subscriptions for prod/non-prod; a misconfigured deletion only hits one subscription.  
&nbsp;&nbsp;- **Policy inheritance** — assign at management group, inherits to subscriptions → resource groups → resources.
