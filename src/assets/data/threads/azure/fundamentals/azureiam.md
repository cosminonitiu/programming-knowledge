## Identity & Access Management — Microsoft Entra ID (Azure AD)

**Microsoft Entra ID** (formerly Azure Active Directory) is Azure's cloud-native identity and access management platform. It handles authentication, authorisation, and governance for Azure resources, Microsoft 365, and custom applications.

---

## Core Concepts

### Tenant
A **tenant** is a dedicated instance of Entra ID that an organisation receives when it signs up for Azure. It represents the organisation's identity boundary.

&nbsp;&nbsp;- One organisation → one tenant (typically).  
&nbsp;&nbsp;- Identified by a globally unique **Tenant ID** (GUID) and a domain (e.g., `contoso.onmicrosoft.com`).
<br>

### Users & Groups
&nbsp;&nbsp;- **Users** — individual identities (employees, contractors, guests).  
&nbsp;&nbsp;- **Groups** — Security groups (for RBAC) and Microsoft 365 groups (for collaboration).  
&nbsp;&nbsp;- **Guest users (B2B)** — external identities invited to collaborate.
<br>

### Service Principals & App Registrations

A **service principal** is the identity of an *application* or *automation script* within Entra ID — the non-human equivalent of a user account.

```
App Registration (global definition)
└── Service Principal (per-tenant instance)
```

&nbsp;&nbsp;- Used by Azure DevOps pipelines, GitHub Actions, and application code to authenticate to Azure.  
&nbsp;&nbsp;- Credentials: client secret (password) or **certificate** (preferred — no secret rotation required with managed identities).
<br>

### Managed Identities

**Managed identities** are service principals whose credentials are managed entirely by Azure — no secrets to store or rotate.

| Type | Scope | Lifecycle |
|---|---|---|
| **System-assigned** | Single resource (e.g., one VM, one Databricks workspace) | Deleted with the resource |
| **User-assigned** | Standalone resource; assigned to multiple resources | Independent lifecycle |

```
Azure Databricks Workspace
  └── System-assigned Managed Identity
        └── RBAC role: Storage Blob Data Contributor
              └── on: ADLS Gen2 storage account
```

This means Databricks can read/write ADLS Gen2 without any stored connection string or secret.
<br>

---

## Azure RBAC (Role-Based Access Control)

Azure RBAC controls **who** can perform **what actions** on **which resources**.

### RBAC Model

```
Security Principal (User / Group / Service Principal / Managed Identity)
    ↓
Role Assignment
    ↓ assigns ↓
Role Definition (set of allowed actions)
    ↓ scoped to ↓
Scope (Management Group / Subscription / Resource Group / Resource)
```

### Built-in Roles

| Role | Description |
|---|---|
| **Owner** | Full access including ability to assign RBAC roles |
| **Contributor** | Full access to manage resources; cannot assign roles |
| **Reader** | View-only access |
| **User Access Administrator** | Manage RBAC assignments only |
| **Storage Blob Data Contributor** | Read, write, delete blobs in storage accounts |
| **Storage Blob Data Reader** | Read-only access to blobs |

**Principle of least privilege** — assign the narrowest role needed at the narrowest scope.
<br>

### Custom Roles

When built-in roles are too permissive, create a custom role:

```json
{
  "Name": "Databricks Cluster Operator",
  "Actions": [
    "Microsoft.Databricks/workspaces/read",
    "Microsoft.Databricks/workspaces/clusters/*"
  ],
  "NotActions": [],
  "AssignableScopes": ["/subscriptions/{subscriptionId}"]
}
```

---

## Authentication Flows

### OAuth 2.0 / OIDC
Entra ID is an OAuth 2.0 authorization server and OpenID Connect (OIDC) provider.

&nbsp;&nbsp;- **Authorization Code Flow** — web apps (user signs in via browser redirect).  
&nbsp;&nbsp;- **Client Credentials Flow** — service-to-service (daemon apps, pipelines) — no user involved.  
&nbsp;&nbsp;- **On-Behalf-Of Flow** — API calls another API on behalf of the signed-in user.
<br>

### Authenticating from Code (Azure SDK)

The **`DefaultAzureCredential`** chain tries multiple auth methods in order:

```python
from azure.identity import DefaultAzureCredential
from azure.storage.filedatalake import DataLakeServiceClient

credential = DefaultAzureCredential()
# In Azure: uses Managed Identity automatically
# Locally: uses Azure CLI login / environment variables / VS Code login
client = DataLakeServiceClient(
    account_url="https://myaccount.dfs.core.windows.net",
    credential=credential
)
```

Order tried: EnvironmentCredential → WorkloadIdentityCredential → ManagedIdentityCredential → AzureCliCredential → ...
<br>

---

## Conditional Access

**Conditional Access policies** are if-then rules: *if* a user matches a condition, *then* enforce controls.

&nbsp;&nbsp;- Conditions: user/group, location, device compliance, app, sign-in risk.  
&nbsp;&nbsp;- Controls: require MFA, block access, require compliant device, require password change.  
&nbsp;&nbsp;- Example: "Require MFA for all users accessing Azure portal from outside the corporate network."
<br>

---

## Azure Key Vault

Key Vault is the recommended place to store secrets, certificates, and encryption keys — not source control or application config files.

&nbsp;&nbsp;- **Secrets** — connection strings, API keys, passwords.  
&nbsp;&nbsp;- **Keys** — RSA/EC keys for encryption (HSM-backed available).  
&nbsp;&nbsp;- **Certificates** — TLS/SSL certificate lifecycle management.
<br>

```python
from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient

client = SecretClient(
    vault_url="https://my-vault.vault.azure.net/",
    credential=DefaultAzureCredential()
)
secret = client.get_secret("db-connection-string")
print(secret.value)
```

---

## Interview Talking Points

&nbsp;&nbsp;- **Managed identity > service principal with secret** — no credential rotation risk; preferred for any Azure-to-Azure auth.  
&nbsp;&nbsp;- **RBAC vs Azure Policy** — RBAC controls who acts on resources; Policy controls what resources can be deployed/configured.  
&nbsp;&nbsp;- **Least privilege** — assign roles at the narrowest scope (resource group or resource, not subscription).  
&nbsp;&nbsp;- **`DefaultAzureCredential`** — write credential-agnostic code that works locally (CLI) and in Azure (managed identity) without code changes.  
&nbsp;&nbsp;- **Key Vault references** — App Service and Azure Functions can pull secrets from Key Vault at runtime via Key Vault references in app settings — secrets never touch source code.
