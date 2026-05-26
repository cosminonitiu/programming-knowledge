## Azure Databricks — Security & Integration with Azure

Securing a Databricks workspace on Azure involves layered controls: network isolation, identity-based authentication, secret management, and data governance. All of these integrate directly with the Azure security stack.

---

## Authentication — Entra ID (Azure AD)

### Single Sign-On (SSO)
Azure Databricks uses **Microsoft Entra ID** as the identity provider — users log in with their Azure credentials. No separate Databricks passwords are needed.

### SCIM Provisioning
**SCIM (System for Cross-domain Identity Management)** automates user and group provisioning from Entra ID into Databricks:
&nbsp;&nbsp;- Add a user to an Entra ID group → they are automatically added to the Databricks workspace.  
&nbsp;&nbsp;- Remove a user from Entra ID → their Databricks access is revoked.  
&nbsp;&nbsp;- Configure via the Entra ID Enterprise Application gallery (the Databricks SCIM app).
<br>

### Service Principal Authentication

For automated processes (CI/CD pipelines, external applications):

```python
from azure.identity import ClientSecretCredential

credential = ClientSecretCredential(
    tenant_id="<tenant-id>",
    client_id="<sp-client-id>",
    client_secret="<sp-client-secret>"    # store in Key Vault, not in code
)
# Use with Azure SDK or Databricks REST API
```

---

## Secret Management — Azure Key Vault Integration

**Never store credentials in notebooks or source code.** Use Azure Key Vault-backed secret scopes.

### Setup: Key Vault-Backed Secret Scope

```bash
# Create a secret scope backed by Azure Key Vault (done once via Databricks CLI)
databricks secrets create-scope \
  --scope kv-analytics-prod \
  --scope-backend-type AZURE_KEYVAULT \
  --resource-id /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.KeyVault/vaults/kv-analytics-prod \
  --dns-name https://kv-analytics-prod.vault.azure.net/
```

### Usage in Notebooks

```python
# Retrieve a secret — value is NEVER printed in notebook output
connection_str = dbutils.secrets.get(scope="kv-analytics-prod", key="db-connection-string")
sp_secret = dbutils.secrets.get(scope="kv-analytics-prod", key="sp-client-secret")

# Use in Spark config
spark.conf.set(
    "fs.azure.account.oauth2.client.secret.<account>.dfs.core.windows.net",
    sp_secret
)
```

---

## Network Isolation

### VNet Injection
Deploy the Databricks **data plane** (cluster VMs) into a **customer-managed Azure Virtual Network**:

```
Customer VNet: vnet-analytics-prod (10.0.0.0/16)
├── Subnet: snet-databricks-public  (10.0.1.0/24)  — driver nodes
└── Subnet: snet-databricks-private (10.0.2.0/24)  — worker nodes
```

With VNet injection:
&nbsp;&nbsp;- Cluster VMs get private IPs from your VNet.  
&nbsp;&nbsp;- Can access private ADLS Gen2 endpoints, on-premises via ExpressRoute/VPN.  
&nbsp;&nbsp;- Network Security Groups (NSGs) enforce traffic rules.
<br>

### Private Link (Secure Cluster Connectivity)
**Secure Cluster Connectivity (No Public IP)** — cluster VMs have no public IPs; all traffic to the Databricks control plane goes through a private relay. Combined with a **Private Endpoint** for the Databricks UI/API, the entire workspace is accessible only from within the VNet.

```
Internet → ❌ blocked
VPN/ExpressRoute → ✅ → Databricks Private Endpoint → Workspace UI/API
                   → ✅ → ADLS Gen2 Private Endpoint → Storage
```

---

## Managed Identity for ADLS Access

The recommended approach — no credentials stored anywhere:

```
Databricks Workspace
  └── System-Assigned Managed Identity
        └── Role: Storage Blob Data Contributor
              └── on: adlsanalyticsprod (ADLS Gen2 storage account)
```

```python
# No explicit credentials needed — Databricks uses the workspace managed identity
df = spark.read.format("delta").load(
    "abfss://curated@adlsanalyticsprod.dfs.core.windows.net/sales/"
)
```

In Unity Catalog workspaces, access is further governed by External Locations and Storage Credentials — the managed identity is referenced in the Storage Credential, and users never interact with it directly.
<br>

---

## Unity Catalog for Data Governance

Unity Catalog is the access control layer for data:
&nbsp;&nbsp;- **Table-level, column-level, and row-level** access control.  
&nbsp;&nbsp;- Audit log of every data access via system tables.  
&nbsp;&nbsp;- Lineage tracking across the entire pipeline.
<br>

See the **Unity Catalog** topic for full details.
<br>

---

## Cluster Access Control

Fine-grained control over who can do what with clusters:

| Permission | Can do |
|---|---|
| **Can Attach To** | Attach a notebook to the cluster; submit jobs |
| **Can Restart** | Restart the cluster |
| **Can Manage** | Edit cluster config, terminate, change permissions |

Cluster policies enforce what configurations users can create — preventing oversized clusters that drive up costs.
<br>

---

## Workspace Access Control

| Permission Level | Description |
|---|---|
| **Admin** | Full workspace control — manage users, clusters, jobs |
| **User** | Can create notebooks, jobs, clusters (subject to policies) |
| **No access** | Cannot access the workspace |

Object-level permissions (notebooks, folders, repos) use a **Can View / Can Run / Can Edit / Can Manage** model.
<br>

---

## Audit Logging

Databricks emits audit events to:
&nbsp;&nbsp;- **Azure Diagnostic Settings** → Log Analytics Workspace → Sentinel or custom KQL queries.  
&nbsp;&nbsp;- **Unity Catalog system tables** → `system.access.audit` (queryable directly in Databricks notebooks).
<br>

```sql
-- Who accessed the sales table in the last 24 hours?
SELECT user_identity.email, event_time, action_name, request_params.table_full_name
FROM system.access.audit
WHERE event_time > NOW() - INTERVAL 1 DAY
  AND request_params.table_full_name = 'analytics_prod.silver.sales'
ORDER BY event_time DESC;
```

---

## Interview Talking Points

&nbsp;&nbsp;- **Managed identity > service principal > account key** — same preference as for direct ADLS access; managed identity requires no rotation.  
&nbsp;&nbsp;- **VNet injection for regulated industries** — required for HIPAA, PCI-DSS, or any environment where cluster VMs must not have public IPs.  
&nbsp;&nbsp;- **Key Vault-backed secret scope** — secrets rotate in Key Vault automatically; Databricks picks up the new value without redeployment.  
&nbsp;&nbsp;- **SCIM for zero-touch user management** — users and groups stay in sync with Entra ID; off-boarding removes Databricks access automatically.  
&nbsp;&nbsp;- **Unity Catalog audit = compliance evidence** — queryable, tamper-evident access logs that satisfy auditors without requiring manual log extraction.
