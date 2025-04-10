## Backends for Frontends pattern  
Decouple backend services from the frontend implementations to tailor experiences for different client interfaces. This pattern is useful when you want to avoid customizing a backend that serves multiple interfaces. This pattern is based on Pattern: Backends For Frontends described by Sam Newman.  
<br>

## Context and problem  
Consider an application that was initially designed with a desktop web UI and a corresponding backend service. As business requirements changed over time, a mobile interface was added. Both interfaces interact with the same backend service but the capabilities of a mobile device differ significantly from a desktop browser, in terms of screen size, performance, and display limitations.  
<br>

The backend service often faces competing demands from different frontends, leading to frequent changes and potential bottlenecks in the development process. Conflicting updates and the need to maintain compatibility result in excessive work on a single deployable resource.  
<br>

Having a separate team manage the backend service can create a disconnect between frontend and backend teams, causing delays in gaining consensus and balancing requirements. For example, changes requested by one frontend team must be validated with other frontend teams before integration.  
<br>

## Solution  
Introduce a new layer that handles only the interface-specific requirements. This layer called the backend-for-frontend (BFF) service, sits between the frontend client and the backend service. If the application supports multiple interfaces, create a BFF service for each interface. For example, if you have a web interface and a mobile app, you would create separate BFF services for each.  
<br>

This pattern tailors client experience for a specific interface, without affecting other interfaces. It also fine-tunes the performance to best match the needs of the frontend environment. Because each BFF service smaller and less complex, the application might experience optimization benefits to a certain degree.  
<br>

Frontend teams have autonomy over their own BFF service, allowing flexibility in language selection, release cadence, workload prioritization, and feature integration without relying on a centralized backend development team.  
<br>

While many BFFs relied on REST APIs, GraphQL implementations are becoming an alternative, which removes the need for the BFF layer because the querying mechanism doesn't require a separate endpoint.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_backforfront_1.png" alt="Backends for frontends Pattern 1"></div>  
<br>

## Issues and considerations  
&nbsp;&nbsp;1. Evaluate what the optimal number of services is for you, as this will have associated costs. Maintaining and deploying more services means increased operational overhead. Each individual service has its own life cycle, deployment and maintenance requirements, and security needs.  
&nbsp;&nbsp;2. Review the Service Level Objectives (SLOs) when adding a new service. Increased latency may occur because clients aren't contacting your services directly, and the new service introduces an extra network hop.  
&nbsp;&nbsp;3. When different interfaces make the same requests, evaluate whether the requests can be consolidated into a single BFF service. Sharing a single BFF service between multiple interfaces can lead to different requirements for each client, which can complicate the BFF service's growth and support.  
&nbsp;&nbsp;4. Code duplication is a probable outcome of this pattern. Evaluate the tradeoff between code duplication and a better-tailored experience for each client.  
&nbsp;&nbsp;5. The BFF service should only handle client-specific logic related to a specific user experience. Cross-cutting features, such as monitoring and authorization, should be abstracted to keep BFF service light. Typical features that might surface in the BFF service are handled separately with Gatekeeping, Rate Limiting, Routing, and others.  
&nbsp;&nbsp;6. Consider the impact on the development team when learning and implementing this pattern. Building new backends requires time and effort, potentially incurring technical debt while maintaining the existing backend service.  
&nbsp;&nbsp;7. Evaluate if you need this pattern at all. For example if your organization uses GraphQL with frontend-specific resolvers, BFF might not add value to your applications.  
&nbsp;&nbsp;8. Another example is application that combines API Gateway with microservices. This approach may be sufficient for some cases where BFFs were previously recommended.  
<br>

## When to use this pattern  
### Use this pattern when:  
&nbsp;&nbsp;1. A shared or general purpose backend service must be maintained with significant development overhead.  
&nbsp;&nbsp;2. You want to optimize the backend for the requirements of specific client interfaces.  
&nbsp;&nbsp;3. Customizations are made to a general-purpose backend to accommodate multiple interfaces.  
&nbsp;&nbsp;4. A programming language is better suited for the backend of a specific user interface, but not all user interfaces.  
<br>

### This pattern may not be suitable:  
&nbsp;&nbsp;1. When interfaces make the same or similar requests to the backend.  
&nbsp;&nbsp;2. When only one interface is used to interact with the backend.  
<br>

## Example  
This example shows a use case for the pattern where you have two distinct client applications: a mobile app and a desktop application. Both clients interact with an Azure API Management (data plane gateway), which acts as an abstraction layer, handling common cross-cutting concerns such as:  
<br>

&nbsp;&nbsp;1. Authorization – Ensuring only verified identities with the proper access tokens can call protected resources using the Azure API Management (APIM) with Microsoft Entra ID.  
&nbsp;&nbsp;2. Monitoring – Capturing and sending request and response details for observability purposes to Azure Monitor.  
&nbsp;&nbsp;3. Request Caching – Optimizing repeated requests by serving responses from cache using APIM built-in features.  
&nbsp;&nbsp;4. Routing & Aggregation – Directing incoming requests to the appropriate Backend for Frontend (BFF) services.  
<br>

Each client has a dedicated BFF service running as an Azure Function that serve as an intermediary between the gateway and the underlying microservices. These client-specific BFF ensures a tailored experience for pagination among other functionalities. While the mobile is more bandwidth-conscious app and caching improves performance, the desktop aggregates multiple pages in a single request, optimizing for a richer user experience.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_backforfront_2.png" alt="Backends for frontends Pattern 2"></div>  
<br>

## Flow A: Mobile client – first page request  
The mobile client sends a GET request for the page 1 including the OAuth 2.0 token in the authorization header.  
The request reaches the Azure APIM Gateway, which intercepts it and:  
<br>

&nbsp;&nbsp;1. Checks authorization status – APIM implements defense in depth, so it checks the validity of the access token.  
&nbsp;&nbsp;2. Stream the request activity as logs to Azure Monitor – Details of the request are recorded for auditing and monitoring.  
&nbsp;&nbsp;3. The policies are enforced, then Azure APIM routes the request to the Azure Function Mobile BFF.  
&nbsp;&nbsp;4. The Azure Function Mobile BFF then interacts with the necessary microservices to fetch a single page and process the requested data to provide with a lightweight experience.  
&nbsp;&nbsp;5. The response is returned to the client.  
<br>

## Flow B: Mobile client – first page cached request  
The mobile client sends the same GET request for the page 1 again including the OAuth 2.0 token in the authorization header.  
The Azure APIM Gateway recognizes that this request was made before and:  
<br>

&nbsp;&nbsp;1. The policies are enforced, and after that it identifies a cached response matching the request parameters.  
&nbsp;&nbsp;2. Returns the cached response immediately, eliminating the need to forward the request to the Azure Function Mobile BFF.  
<br>

## Flow C: Desktop client – first request  
The desktop client sends a GET request for the first time including the OAuth 2.0 token in the authorization header.  
The request reaches the Azure APIM Gateway, where similar cross-cutting concerns are handled:  
<br>

&nbsp;&nbsp;1. Authorization – token validation is always required.  
&nbsp;&nbsp;2. Stream the request activity – Request details are recorded for observability.  
&nbsp;&nbsp;3. Once all policies were enforced, Azure APIM routes the request to the Azure Function Desktop BFF, which is responsible for handling data-heavy application processing. The Desktop BFF aggregates multiple requests using underlying microservices calls before responding to the client with a multiple page response.  
<br>

## Design  
&nbsp;&nbsp;1. Microsoft Entra ID serves as the cloud-based Identity Provider, issuing tailored audience claims for both mobile and desktop clients, which are subsequently leveraged for authorization.  
&nbsp;&nbsp;2. Azure API Management acts as proxy between the clients and their BBFs adding a perimeter. It's configured with policies to validate the JSON Web Tokens (JWTs), rejecting requests that arrive without a token or the claims aren't valid for the targeted BFF. Additionally it streams all the activity logs to Azure Monitor.  
&nbsp;&nbsp;3. Azure Monitor functions as the centralized monitoring solution, aggregating all activity logs to ensure comprehensive, end-to-end observability.  
&nbsp;&nbsp;4. Azure Functions is a serverless solution that seamlessly exposes BFF logic across multiple endpoints, enabling streamlined development, reducing infrastructure overhead, and lowering operational costs.  
<br>
