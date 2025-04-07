## Setting up HttpClient  
Before you can use HttpClient in your app, you must configure it using dependency injection.  
<br>

### Providing HttpClient through dependency injection  
HttpClient is provided using the provideHttpClient helper function, which most apps include in the application providers in app.config.ts.  
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
  ]
};
```  
If your app is using NgModule-based bootstrap instead, you can include provideHttpClient in the providers of your app's NgModule:  
```typescript
@NgModule({
  providers: [
    provideHttpClient(),
  ],
  // ... other application configuration
})
export class AppModule {}
```  
You can then inject the HttpClient service as a dependency of your components, services, or other classes:  
```typescript
@Injectable({providedIn: 'root'})
export class ConfigService {
  private http = inject(HttpClient);
  // This service can now make HTTP requests via `this.http`.
}
```  
<br>

## Configuring features of HttpClient  
provideHttpClient accepts a list of optional feature configurations, to enable or configure the behavior of different aspects of the client. This section details the optional features and their usages.  
<br>

### withFetch  
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
    ),
  ]
};
```  
By default, HttpClient uses the XMLHttpRequest API to make requests. The withFetch feature switches the client to use the fetch API instead.  
<br>

fetch is a more modern API and is available in a few environments where XMLHttpRequest is not supported. It does have a few limitations, such as not producing upload progress events.  
<br>

### withInterceptors(...)  
ithInterceptors configures the set of interceptor functions which will process requests made through HttpClient. See the interceptor guide for more information.  
<br>

### withInterceptorsFromDi()  
withInterceptorsFromDi includes the older style of class-based interceptors in the HttpClient configuration. See the interceptor guide for more information.  
<br>

### withRequestsMadeViaParent()  
By default, when you configure HttpClient using provideHttpClient within a given injector, this configuration overrides any configuration for HttpClient which may be present in the parent injector.  
<br>

When you add withRequestsMadeViaParent(), HttpClient is configured to instead pass requests up to the HttpClient instance in the parent injector, once they've passed through any configured interceptors at this level. This is useful if you want to add interceptors in a child injector, while still sending the request through the parent injector's interceptors as well.  
<br>

### withJsonpSupport()  
Including withJsonpSupport enables the .jsonp() method on HttpClient, which makes a GET request via the JSONP convention for cross-domain loading of data.  
<br>

### withXsrfConfiguration(...)  
Including this option allows for customization of HttpClient's built-in XSRF security functionality. See the security guide for more information.  
<br>

### withNoXsrfProtection()  
luding this option disables HttpClient's built-in XSRF security functionality. See the security guide for more information.  