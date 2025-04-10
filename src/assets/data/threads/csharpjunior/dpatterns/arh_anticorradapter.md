## Anti-corruption Layer pattern  
Implement a façade or adapter layer between different subsystems that don't share the same semantics. This layer translates requests that one subsystem makes to the other subsystem. Use this pattern to ensure that an application's design is not limited by dependencies on outside subsystems. This pattern was first described by Eric Evans in Domain-Driven Design.  
<br>

## Context and problem  
Most applications rely on other systems for some data or functionality. For example, when a legacy application is migrated to a modern system, it may still need existing legacy resources. New features must be able to call the legacy system. This is especially true of gradual migrations, where different features of a larger application are moved to a modern system over time.  
<br>

Often these legacy systems suffer from quality issues such as convoluted data schemas or obsolete APIs. The features and technologies used in legacy systems can vary widely from more modern systems. To interoperate with the legacy system, the new application may need to support outdated infrastructure, protocols, data models, APIs, or other features that you wouldn't otherwise put into a modern application.  
<br>

Maintaining access between new and legacy systems can force the new system to adhere to at least some of the legacy system's APIs or other semantics. When these legacy features have quality issues, supporting them "corrupts" what might otherwise be a cleanly designed modern application.  
<br>

Similar issues can arise with any external system that your development team doesn't control, not just legacy systems.  
<br>

## Solution 
Isolate the different subsystems by placing an anti-corruption layer between them. This layer translates communications between the two systems, allowing one system to remain unchanged while the other can avoid compromising its design and technological approach.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_anticorradapter_1.png" alt="AntiCorrupter Pattern 1"></div>  
<br>

The diagram above shows an application with two subsystems. Subsystem A calls to subsystem B through an anti-corruption layer. Communication between subsystem A and the anti-corruption layer always uses the data model and architecture of subsystem A. Calls from the anti-corruption layer to subsystem B conform to that subsystem's data model or methods. The anti-corruption layer contains all of the logic necessary to translate between the two systems. The layer can be implemented as a component within the application or as an independent service.  
<br>

## Issues and considerations  
&nbsp;&nbsp;1. The anti-corruption layer may add latency to calls made between the two systems.  
&nbsp;&nbsp;2. The anti-corruption layer adds an additional service that must be managed and maintained.  
&nbsp;&nbsp;3. Consider how your anti-corruption layer will scale.  
&nbsp;&nbsp;4. Consider whether you need more than one anti-corruption layer. You may want to decompose functionality into multiple services using different technologies or languages, or there may be other reasons to partition the anti-corruption layer.  
&nbsp;&nbsp;5. Consider how the anti-corruption layer will be managed in relation with your other applications or services. How will it be integrated into your monitoring, release, and configuration processes?  
&nbsp;&nbsp;6. Make sure transaction and data consistency are maintained and can be monitored.  
&nbsp;&nbsp;7. Consider whether the anti-corruption layer needs to handle all communication between different subsystems, or just a subset of features.  
&nbsp;&nbsp;8. If the anti-corruption layer is part of an application migration strategy, consider whether it will be permanent, or will be retired after all legacy functionality has been migrated.  
&nbsp;&nbsp;9. This pattern is illustrated with distinct subsystems above, but can apply to other service architectures as well, such as when integrating legacy code together in a monolithic architecture.  
<br>

## When to use this pattern  
Use this pattern when:  
<br>

&nbsp;&nbsp;1. A migration is planned to happen over multiple stages, but integration between new and legacy systems needs to be maintained.  
&nbsp;&nbsp;2. Two or more subsystems have different semantics, but still need to communicate.  
<br>

This pattern may not be suitable if there are no significant semantic differences between new and legacy systems.