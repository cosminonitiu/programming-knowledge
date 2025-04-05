**1. Container Runtime Interface (CRI)
2. Container Network Interface (CNI)
3. Container Storage Interface (CSI)**

These are used to handle the container runtime, the container networking and the container storage.
These have been moved out of the core Kube so we can have a pluggable implementation.

CRI is the standard interface Kube uses to run Container processes (Popular today is Container D, Docker was used as a container runtime but it had issues due to difference between it and CRI, so that dockershim interface was used. Kube in 1.0 no longer uses Docker as a runtime)
 
CNI defines how the networking should be set up for the containers that are running within kube. There are many different implementations of the CNI like:
- Calico
- Flannel
- Cilium
- Cloud specific CNI Plugins (Amazon VPC CNI, Azure CNI, Google Cloud CNI)
Not all these CNIs use KubeProxies (Cilium uses Psylium)

CSI is the interface through which we provide storage to the containers.
- Cloud Specific CSI Driver (Amazon EBS, Compute Engine persistent disk, Azure Disk Container)
- Cert Manager CSI (can load a certificate at runtime into the file system storage of container)
- Secrets Store CSI

https://landscape.cncf.io
A landscape of different projects at different levels in combination with Kube