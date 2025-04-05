Dependency Injection (DI) is a design pattern in Angular that allows objects (services, components, directives, etc.) to receive dependencies from an external source rather than creating them manually. This enhances modularity, maintainability, and testability.

**1. What is Dependency Injection (DI)?**
DI is a way to manage dependencies in an application by injecting required services instead of creating them inside a class. Angular has a built-in DI framework that provides services where needed.

Without DI:
```typescript
class Component {
  service = new SomeService(); // Hardcoded dependency
}
```
With DI:
```typescript
class Component {
  constructor(private service: SomeService) {} // Injected dependency
}
```

Reduces coupling between components and services.
Allows easy swapping of implementations (e.g., mocking for testing).

**2. How DI Works in Angular**
Angular’s DI system consists of three main parts:
Injector → A container that provides dependencies.
Provider → Configures how an injectable is created.
Dependency Resolution → The process by which Angular resolves requested dependencies.

**Dependency Resolution Process**
The injector searches for a requested dependency.
If found, it provides an instance.
If not found in the current injector, it checks parent injectors.
If still not found, an error occurs (No provider for X).