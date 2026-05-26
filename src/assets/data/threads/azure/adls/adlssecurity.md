## ADLS Gen2 — Security & Access Control

ADLS Gen2 uses a **layered security model**: network-level controls, identity-based authentication, and data-level authorisation via RBAC and POSIX ACLs.

---

## Authentication — Who Are You?

### Managed Identity (Recommended)
Assign a managed identity to your Azure resource (Databricks workspace, ADF, Function App) and grant it an Azure RBAC role on the storage account — no secrets required.

```
Azure Databricks Workspace
  └── System-Assigned Managed Identity
        └── Role Assignment: Storage Blob Data Contributor
              └── Scope: adlsanalyticsprod / container: raw
```

### Service Principal
Used for external tools (GitHub Actions, local scripts) that cannot use managed identity. Register an app in Entra ID, create a client secret or certificate, and grant RBAC.

```bash
az role assignment create \
  --assignee <service-principal-app-id> \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.Storage/storageAccounts/{account}"
```

### Shared Access Signature (SAS)
Time-limited, URL-embedded tokens. Use only for external partners or temporary delegation — not for persistent workloads.
<br>

---

## Authorisation — What Can You Do?

ADLS Gen2 supports **two complementary authorisation systems** that work together:

| System | Granularity | Best for |
|---|---|---|
| **Azure RBAC** | Storage account or container level | Coarse-grained access — grant Databricks access to a whole container |
| **POSIX ACLs** | Individual file / directory level | Fine-grained access — restrict a team to a specific directory path |

When both are present, Azure evaluates RBAC first — if RBAC grants access, ACL check is skipped. If RBAC does not grant access, the ACL is evaluated.
<br>

### Azure RBAC Roles for Storage

| Role | Permissions |
|---|---|
| **Storage Blob Data Owner** | Full access + ability to set ACLs |
| **Storage Blob Data Contributor** | Read, write, delete blobs and directories |
| **Storage Blob Data Reader** | Read-only |
| **Storage Blob Delegator** | Get a user delegation key (for generating user delegation SAS) |

### POSIX ACLs

ACLs in ADLS Gen2 follow the POSIX model with three permission bits per principal:

| Permission | Files | Directories |
|---|---|---|
| **Read (r)** | Read file contents | List directory |
| **Write (w)** | Overwrite file | Create/delete children |
| **Execute (x)** | N/A | Traverse directory (required to access files deeper in the path) |

```
Directory: /curated/sales/
  Owner: pipeline-sp@contoso.com    rwx
  Group: data-engineers              r-x
  Other:                             ---
  Named user: analyst@contoso.com   r-x
```

**Default ACLs** — ACL entries that propagate to newly created child files and directories.
<br>

---

## Network Security

### Storage Firewall & Virtual Network Rules
Restrict which networks can access the storage account:
&nbsp;&nbsp;- **Allow selected virtual networks and IP addresses** — only traffic from approved VNets or public IPs is accepted.  
&nbsp;&nbsp;- **Service endpoints** — route storage traffic through the VNet backbone (no public IP traversal) while still using the public endpoint.
<br>

### Private Endpoints
A **Private Endpoint** places a private IP address for the storage account inside your VNet. All traffic stays on the Microsoft backbone — the public endpoint can be disabled entirely.

```
VNet: vnet-analytics-prod
  └── Subnet: snet-private-endpoints
        └── Private Endpoint: pe-adls-prod
              └── → adlsanalyticsprod.dfs.core.windows.net (resolves to 10.0.1.5)
```

Private endpoints are the recommended approach for production Databricks + ADLS deployments (combined with VNet injection for Databricks).
<br>

### Microsoft Trusted Services
Some Azure services (ADF, Synapse, Azure Monitor) can be granted bypass access even when the firewall is enabled, via the **"Allow trusted Microsoft services"** exception.
<br>

---

## Encryption

&nbsp;&nbsp;- Data is encrypted **at rest** by default using 256-bit AES (Microsoft-managed keys).  
&nbsp;&nbsp;- **Customer-managed keys (CMK)** — bring your own key from Azure Key Vault for regulatory compliance.  
&nbsp;&nbsp;- Data is encrypted **in transit** via TLS 1.2+ (enforced by default; HTTP access can be disabled).
<br>

---

## Auditing & Monitoring

&nbsp;&nbsp;- **Azure Monitor Diagnostic Settings** — route storage logs to Log Analytics, Event Hub, or a storage account for audit trails.  
&nbsp;&nbsp;- Log categories: `StorageRead`, `StorageWrite`, `StorageDelete`.  
&nbsp;&nbsp;- **Microsoft Defender for Storage** — detects anomalous access patterns (unusual geographic access, mass deletion, suspicious uploads).
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Managed identity > SAS > account key** — preference order for production workloads.  
&nbsp;&nbsp;- **Execute bit on directories** — a common gotcha: you need `rwx` on every directory in the path, not just the target file.  
&nbsp;&nbsp;- **RBAC + ACL interaction** — RBAC grants broad container access; ACLs refine within the container.  
&nbsp;&nbsp;- **Private endpoint + disabled public access** — production security baseline for ADLS in regulated industries.  
&nbsp;&nbsp;- **CMK for compliance** — required for GDPR/HIPAA scenarios where key custody must stay with the customer.
