## Sidecar pattern  
Deploy components of an application into a separate process or container to provide isolation and encapsulation. This pattern can also enable applications to be composed of heterogeneous components and technologies.  
<br>

This pattern is named Sidecar because it resembles a sidecar attached to a motorcycle. In the pattern, the sidecar is attached to a parent application and provides supporting features for the application. The sidecar also shares the same lifecycle as the parent application, being created and retired alongside the parent. The sidecar pattern is sometimes referred to as the sidekick pattern and is a decomposition pattern.  
<br>

## Context and problem  
Applications and services often require related functionality, such as monitoring, logging, configuration, and networking services. These peripheral tasks can be implemented as separate components or services.  
<br>

If they're tightly integrated into the application, they can run in the same process as the application, making efficient use of shared resources. However, this also means they're not well isolated, and an outage in one of these components can affect other components or the entire application. Also, they usually need to be implemented using the same language as the parent application. As a result, the component and the application have close interdependence on each other.  
<br>

If the application is decomposed into services, then each service can be built using different languages and technologies. While this gives more flexibility, it means that each component has its own dependencies and requires language-specific libraries to access the underlying platform and any resources shared with the parent application. In addition, deploying these features as separate services can add latency to the application. Managing the code and dependencies for these language-specific interfaces can also add considerable complexity, especially for hosting, deployment, and management.  
<br>

## Solution  
Co-locate a cohesive set of tasks with the primary application, but place them inside their own process or container, providing a homogeneous interface for platform services across languages.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_sidecarambassador_1.png" alt="Sidecar Ambassador Pattern 1"></div>  
<br>

A sidecar service isn't necessarily part of the application, but is connected to it. It goes wherever the parent application goes. Sidecars are supporting processes or services that are deployed with the primary application. On a motorcycle, the sidecar is attached to one motorcycle, and each motorcycle can have its own sidecar. In the same way, a sidecar service shares the fate of its parent application. For each instance of the application, an instance of the sidecar is deployed and hosted alongside it.  
<br>

### Advantages of using a sidecar pattern include:  

&nbsp;&nbsp;1. A sidecar is independent from its primary application in terms of runtime environment and programming language, so you don't need to develop one sidecar per language.  
&nbsp;&nbsp;2. The sidecar can access the same resources as the primary application. For example, a sidecar can monitor system resources used by both the sidecar and the primary application.  
&nbsp;&nbsp;3. Because of its proximity to the primary application, there's no significant latency when communicating between them.  
&nbsp;&nbsp;4. Even for applications that don't provide an extensibility mechanism, you can use a sidecar to extend functionality by attaching it as its own process in the same host or sub-container as the primary application.  
<br>

## Issues and considerations  
&nbsp;&nbsp;1. Consider the deployment and packaging format you will use to deploy services, processes, or containers. Containers are particularly well suited to the sidecar pattern.  
&nbsp;&nbsp;2. When designing a sidecar service, carefully decide on the interprocess communication mechanism. Try to use language- or framework-agnostic technologies unless performance requirements make that impractical.  
&nbsp;&nbsp;3. Before putting functionality into a sidecar, consider whether it would work better as a separate service or a more traditional daemon.  
&nbsp;&nbsp;4. Also consider whether the functionality could be implemented as a library or using a traditional extension mechanism. Language-specific libraries may have a deeper level of integration and less network overhead.  
<br>

## When to use this pattern  
### Use this pattern when:  
&nbsp;&nbsp;1. Your primary application uses a heterogeneous set of languages and frameworks. A component located in a sidecar service can be consumed by applications written in different languages using different frameworks.  
&nbsp;&nbsp;2. A component is owned by a remote team or a different organization.  
&nbsp;&nbsp;3. A component or feature must be co-located on the same host as the application.  
&nbsp;&nbsp;4. You need a service that shares the overall lifecycle of your main application, but can be independently updated.  
&nbsp;&nbsp;5. You need fine-grained control over resource limits for a particular resource or component. For example, you may want to restrict the amount of memory a specific component uses. You can deploy the component as a sidecar and manage memory usage independently of the main application.  
<br>

### This pattern may not be suitable:  
&nbsp;&nbsp;1. When interprocess communication needs to be optimized. Communication between a parent application and sidecar services includes some overhead, notably latency in the calls. This may not be an acceptable trade-off for chatty interfaces.  
&nbsp;&nbsp;2. For small applications where the resource cost of deploying a sidecar service for each instance is not worth the advantage of isolation.  
&nbsp;&nbsp;3. When the service needs to scale differently than or independently from the main applications. If so, it may be better to deploy the feature as a separate service.  
<br>

## Example  
The sidecar pattern is applicable to many scenarios. Some common examples:  
<br>

&nbsp;&nbsp;1. Infrastructure API. The infrastructure development team creates a service that's deployed alongside each application, instead of a language-specific client library to access the infrastructure. The service is loaded as a sidecar and provides a common layer for infrastructure services, including logging, environment data, configuration store, discovery, health checks, and watchdog services. The sidecar also monitors the parent application's host environment and process (or container) and logs the information to a centralized service.  
&nbsp;&nbsp;2. Manage NGINX/HAProxy. Deploy NGINX with a sidecar service that monitors environment state, then updates the NGINX configuration file and recycles the process when a change in state is needed.  
&nbsp;&nbsp;3. Ambassador sidecar. Deploy an ambassador service as a sidecar. The application calls through the ambassador, which handles request logging, routing, circuit breaking, and other connectivity related features.  
&nbsp;&nbsp;4. Offload proxy. Place an NGINX proxy in front of a node.js service instance, to handle serving static file content for the service.  
<br>

## Ambassador pattern  
Create helper services that send network requests on behalf of a consumer service or application. An ambassador service can be thought of as an out-of-process proxy that is co-located with the client.  
<br>

This pattern can be useful for offloading common client connectivity tasks such as monitoring, logging, routing, security (such as TLS), and resiliency patterns in a language agnostic way. It's often used with legacy applications, or other applications that are difficult to modify, in order to extend their networking capabilities. It can also enable a specialized team to implement those features.  
<br>

## Context and problem  
Resilient cloud-based applications require features such as circuit breaking, routing, metering and monitoring, and the ability to make network-related configuration updates. It may be difficult or impossible to update legacy applications or existing code libraries to add these features, because the code is no longer maintained or can't be easily modified by the development team.  
<br>

Network calls may also require substantial configuration for connection, authentication, and authorization. If these calls are used across multiple applications, built using multiple languages and frameworks, the calls must be configured for each of these instances. In addition, network and security functionality may need to be managed by a central team within your organization. With a large code base, it can be risky for that team to update application code they aren't familiar with.  
<br>

## Solution  
Put client frameworks and libraries into an external process that acts as a proxy between your application and external services. Deploy the proxy on the same host environment as your application to allow control over routing, resiliency, security features, and to avoid any host-related access restrictions. You can also use the ambassador pattern to standardize and extend instrumentation. The proxy can monitor performance metrics such as latency or resource usage, and this monitoring happens in the same host environment as the application.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_sidecarambassador_2.png" alt="Sidecar Ambassador Pattern 2"></div>  
<br>

Features that are offloaded to the ambassador can be managed independently of the application. You can update and modify the ambassador without disturbing the application's legacy functionality. It also allows for separate, specialized teams to implement and maintain security, networking, or authentication features that have been moved to the ambassador.  
<br>

Ambassador services can be deployed as a sidecar to accompany the lifecycle of a consuming application or service. Alternatively, if an ambassador is shared by multiple separate processes on a common host, it can be deployed as a daemon or Windows service. If the consuming service is containerized, the ambassador should be created as a separate container on the same host, with the appropriate links configured for communication.  
<br>

## Issues and considerations  
&nbsp;&nbsp;1. The proxy adds some latency overhead. Consider whether a client library, invoked directly by the application, is a better approach.  
&nbsp;&nbsp;2. Consider the possible impact of including generalized features in the proxy. For example, the ambassador could handle retries, but that might not be safe unless all operations are idempotent.  
&nbsp;&nbsp;3. Consider a mechanism to allow the client to pass some context to the proxy, and back to the client. For example, include HTTP request headers to opt out of retry or specify the maximum number of times to retry.  
&nbsp;&nbsp;4. Consider how you'll package and deploy the proxy.  
&nbsp;&nbsp;5. Consider whether to use a single shared instance for all clients or an instance for each client.  
<br>

## When to use this pattern  
### Use this pattern when you:  
&nbsp;&nbsp;1. Need to build a common set of client connectivity features for multiple languages or frameworks.  
&nbsp;&nbsp;2. Need to offload cross-cutting client connectivity concerns to infrastructure developers or other more specialized teams.  
&nbsp;&nbsp;3. Need to support cloud or cluster connectivity requirements in a legacy application or an application that is difficult to modify.  
<br>

### This pattern may not be suitable:  
&nbsp;&nbsp;1. When network request latency is critical. A proxy introduces some overhead, although minimal, and in some cases this may affect the application.  
&nbsp;&nbsp;2. When client connectivity features are consumed by a single language. In that case, a better option might be a client library that is distributed to the development teams as a package.  
&nbsp;&nbsp;3. When connectivity features can't be generalized and require deeper integration with the client application.  
<br>

## Example  
The following diagram shows an application making a request to a remote service via an ambassador proxy. The ambassador provides routing, circuit breaking, and logging. It calls the remote service and then returns the response to the client application:  
<br>

<div class="white-background"><img src="assets/images/threads/arh_sidecarambassador_3.png" alt="Sidecar Ambassador Pattern 3"></div>  