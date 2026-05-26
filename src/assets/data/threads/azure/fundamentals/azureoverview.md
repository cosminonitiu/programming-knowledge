## Azure Overview

Microsoft Azure is Microsoft's public cloud platform — a globally distributed infrastructure offering over **200 products and services** across compute, storage, networking, databases, analytics, AI/ML, security, and DevOps.

---

## Cloud Service Models

| Model | You manage | Azure manages | Examples |
|---|---|---|---|
| **IaaS** (Infrastructure as a Service) | OS, runtime, data, app | Physical hardware, networking | Azure VMs, Azure Virtual Networks |
| **PaaS** (Platform as a Service) | App code, data | OS, runtime, scaling | Azure App Service, Azure Functions, Azure Databricks |
| **SaaS** (Software as a Service) | Configuration only | Everything | Microsoft 365, Dynamics 365 |

---

## Core Azure Service Categories

### Compute
&nbsp;&nbsp;- **Azure Virtual Machines** — IaaS Windows/Linux VMs  
&nbsp;&nbsp;- **Azure App Service** — PaaS web hosting for .NET, Node, Python, Java  
&nbsp;&nbsp;- **Azure Functions** — serverless, event-driven compute  
&nbsp;&nbsp;- **Azure Kubernetes Service (AKS)** — managed Kubernetes  
&nbsp;&nbsp;- **Azure Container Apps** — serverless container hosting (Dapr-native)
<br>

### Storage & Data
&nbsp;&nbsp;- **Azure Blob Storage / ADLS Gen2** — object and data lake storage  
&nbsp;&nbsp;- **Azure SQL Database** — fully managed relational database (PaaS)  
&nbsp;&nbsp;- **Azure Cosmos DB** — globally distributed NoSQL / multi-model database  
&nbsp;&nbsp;- **Azure Synapse Analytics** — unified analytics platform (SQL + Spark)  
&nbsp;&nbsp;- **Azure Databricks** — managed Apache Spark for data engineering and ML
<br>

### Networking
&nbsp;&nbsp;- **Azure Virtual Network (VNet)** — private network isolation  
&nbsp;&nbsp;- **Azure Load Balancer / Application Gateway** — L4 and L7 load balancing  
&nbsp;&nbsp;- **Azure Front Door** — global CDN and WAF  
&nbsp;&nbsp;- **Azure Private Link / Private Endpoint** — private connectivity to PaaS services
<br>

### Security & Identity
&nbsp;&nbsp;- **Microsoft Entra ID** (formerly Azure AD) — identity platform  
&nbsp;&nbsp;- **Azure Key Vault** — secrets, keys, and certificate management  
&nbsp;&nbsp;- **Microsoft Defender for Cloud** — CSPM and workload protection  
&nbsp;&nbsp;- **Azure Policy / Azure Blueprints** — governance and compliance
<br>

### Integration & Messaging
&nbsp;&nbsp;- **Azure Service Bus** — enterprise message broker (queues + topics/subscriptions)  
&nbsp;&nbsp;- **Azure Event Hubs** — high-throughput event streaming (Kafka-compatible)  
&nbsp;&nbsp;- **Azure Event Grid** — reactive event routing  
&nbsp;&nbsp;- **Azure Data Factory** — code-free ETL/ELT pipelines  
&nbsp;&nbsp;- **Azure Logic Apps** — low-code workflow automation
<br>

---

## Azure Subscription Hierarchy

```
Tenant (Entra ID)
└── Management Groups (optional policy hierarchy)
    └── Subscriptions (billing + policy boundary)
        └── Resource Groups (logical container)
            └── Resources (VMs, storage accounts, etc.)
```

&nbsp;&nbsp;- A **Tenant** is a single Entra ID directory — one organisation.  
&nbsp;&nbsp;- A **Subscription** is the billing unit; every resource lives in exactly one subscription.  
&nbsp;&nbsp;- **Resource Groups** group related resources with a shared lifecycle — delete the group to delete everything in it.  
&nbsp;&nbsp;- **Management Groups** let you apply Azure Policy and RBAC across multiple subscriptions.
<br>

---

## Global Infrastructure

&nbsp;&nbsp;- **Regions** — 60+ geographic regions (e.g., West Europe, East US 2).  
&nbsp;&nbsp;- **Region Pairs** — most regions are paired for disaster recovery replication (e.g., West Europe ↔ North Europe).  
&nbsp;&nbsp;- **Availability Zones (AZs)** — physically separate datacenters within a region; protect against datacenter failure.  
&nbsp;&nbsp;- **Edge Zones / CDN PoPs** — bring compute and content closer to end users.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **IaaS vs PaaS vs SaaS** — know the shared responsibility model for each.  
&nbsp;&nbsp;- **Resource Group as lifecycle boundary** — co-deploy resources that are created and deleted together.  
&nbsp;&nbsp;- **Entra ID ≠ on-premises AD** — it is cloud-native; sync with on-prem AD via Azure AD Connect.  
&nbsp;&nbsp;- **Azure Policy vs RBAC** — Policy controls *what* can be deployed; RBAC controls *who* can act on resources.  
&nbsp;&nbsp;- **Cost Management** — subscriptions have spending limits; use Azure Cost Management + Budgets to alert on overruns.
