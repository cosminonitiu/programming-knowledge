Terms we’re going to use:
- **Cluster **→ Set of resources that make up the Kube System
- **Node **→ A server (a VM or Bare Metal)
- **Control Plane** → System components run here
- **Data Plane** → Our end user applications run here on the Worker Nodes

You could run a Kube with a single node, on a single plane but most production systems use this notion of 2 planes.

- **Cloud controller manager** → Interface between Kube and the Cloud Provider, logic for resources lives here, like Load Balancers on the Cloud Provider
- **Controller Manager** → Runs the various controllers that regulate the state of the cluster (matches desired state with current state of a an element)
- **API** → This is how we interact with the Kube Cluster, and makes calls to other components
- **Data Store (ETCD) **→ Highly available key-value store that stores information regarding components
- **Scheduler **→ Assigns Pods to new nodes based on current usage
There are 2 Kube System components that live on the worker nodes:
- **Kubelet** → Spawns and Manages the Workloads, performs Health Checks, relays the info to the API panel
- **Kube Proxy** → Sets up and maintains the networking between the different workloads (Not every cluster use Kube Proxies)