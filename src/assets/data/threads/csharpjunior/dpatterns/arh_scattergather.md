## Scatter Gather Message Pattern  
Asynchronous communication and the use of messaging systems have been experiencing exponential growth in recent years, necessitating efficient message routing and decoupling strategies.  
<br>

### Context and Relevance  
The need to handle messaging, asynchronous communication, and decoupling has become even more critical due to the widespread adoption of distributed systems. Although many message routing patterns were defined over 20 years ago, it is crucial to evolve these strategies to optimize their implementation as we gain experience and solve problems over time.  
<br>

### The Scatter-Gather Pattern  
<div class="white-background"><img src="assets/images/threads/arh_scattegather.png" alt="Scatter Gather Flow"></div>
<br>

The Scatter-Gather pattern is a message routing pattern that receives a request, distributes it to multiple recipients, and aggregates their responses into a single message. This pattern is used when maintaining the overall flow of messages between senders and recipients who may send responses is necessary.  
<br>

There are two main variants of the Scatter-Gather pattern:  
<br>

&nbsp;&nbsp;1. ```Distribution```: In this variant, the distribution of requests is done through a known list of recipients. It is necessary to have prior knowledge of the recipient list.  
&nbsp;&nbsp;2. ```Auction-style```: In this variant, similar to the Publish-Subscribe style, a channel is used to transmit the request to any interested participant.  
<br>

### Use Cases  
The Scatter-Gather pattern can be applied in various scenarios, including:  
<br>

&nbsp;&nbsp;1. Competing Tasks: Recipients compete to provide the best or fastest response to the request. The consumer will choose the best value from the aggregated response. Examples of use cases include applications like Uber, online quotations, and routing.  
&nbsp;&nbsp;2. Task Parallelization: Different operations are computed simultaneously, and their results are combined or used together. The result types may differ. Examples of use cases include file processing, screen components, dashboards, and reports.  
<br>

### Implementation Options  
There are several implementation options available for the Scatter-Gather pattern in the .NET platform, including:  
<br>

&nbsp;&nbsp;1. ```Libraries``` that implement the pattern.  
&nbsp;&nbsp;2. ```API Gateways```, such as Mulesoft and WSO2.  
&nbsp;&nbsp;3. ```Logic Apps```.  
&nbsp;&nbsp;4. ```Azure Durable Functions and AWS Step Functions```.  
<br>

## Azure Durable Functions  
An example of a technology that can be used to implement the Scatter-Gather pattern is Azure Durable Functions. This Azure Functions extension allows the creation of stateful functions in a serverless environment.  
<br>

### Components of Azure Durable Functions  
Azure Durable Functions have three main components:  
<br>

&nbsp;&nbsp;1. ```Starter Function```: Responsible for initiating the Orchestrator and monitoring its status.  
&nbsp;&nbsp;2. ```Orchestrator Function```: Defines the stateful workflow and invokes the activity functions. The code in this function must be deterministic and non-blocking.  
&nbsp;&nbsp;3. ```Activity Functions```: Execute individual steps of the workflow and can receive and return data.  
<br>

Durable functions, which are used to orchestrate serverless Azure Functions, make it easy to implement Scatter-Gather, following the Fan out/fan in construct. which is supported by the WhenAll method, which waits for all functions to execute.  
<br>

The number of recipients can be calculated at run-time, and the completeness condition can support a variety of strategies, including “Wait for all” (Task.WhenAll), “First Best” (Task.WhenAny), or “Fixed Timeout” (Task.WaitAll).  
```typescript
 [FunctionName("BeerFabricationOrchestration")]
        public static async Task<string> BeerFabricationOrchestration(
            [OrchestrationTrigger] IDurableOrchestrationContext context, ILogger log)
        {
            // Get the recipients (brewery stages) from the input
            var recipients = context.GetInput<List<string>>();

            // Scatter
            // Fan-out: Send messages to all recipients asynchronously
            var tasks = new List<Task<string>>();
            foreach (var recipient in recipients)
            {
                tasks.Add(context.CallActivityAsync<string>("ProcessStageActivity", recipient));
            }
            
            // Gather 
            // Fan-in: Wait for all tasks to complete
            await Task.WhenAll(tasks);


            // Final message after aggregation
            var responses = tasks.Select(t => t.Result);
            var aggregatedResponse = string.Join(", ", responses);

            log.LogInformation($"Result '{aggregatedResponse}'");

            return aggregatedResponse;
        }
```  