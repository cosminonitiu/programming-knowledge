Contravariance
Contravariance is the in keyword and it denotes input types, usually in delegates. The principle is the same, it means that the delegate can accept more derived class.

public delegate void Func<in T>(T param);
This means that if we have a Func<Fruit>, it can be converted to Func<Apple>.

Func<Fruit> fruitFunc = (fruit)=>{};
Func<Apple> appleFunc = fruitFunc;
Why are they called co/contravariance if they are basically the same thing?
Because even though the principle is the same, safe casting from derived to base, when used on the input types, we can safely cast a less derived type (Func<Fruit>) to a more derived type (Func<Apple>), which makes sense, since any function that takes Fruit, can also take Apple.

**Example 4: Contravariance in Delegates**
Delegates can be contravariant in their parameter types. This means that a delegate accepting a parameter of a base type can be assigned a method that accepts a parameter of a derived type.

```typescript
// Define a delegate that takes a Dog as parameter.
delegate void ProcessDog(Dog dog);

class AnimalProcessor {
    // This method accepts an Animal.
    public static void ProcessAnimal(Animal animal) {
        Console.WriteLine("Processing " + animal.GetType().Name);
    }
}
  
// Contravariance: ProcessAnimal (parameter Animal) can be assigned to a delegate expecting Dog.
ProcessDog processor = AnimalProcessor.ProcessAnimal;
processor(new Dog());  // Outputs: Processing Dog
```

**Example 5: Contravariant Generic Interfaces**
Interfaces like IComparer<in T> are contravariant. This allows an IComparer<Animal> to be used where an IComparer<Dog> is expected.

```typescript
class AnimalComparer : IComparer<Animal>
{
    public int Compare(Animal x, Animal y)
    {
        // For example purposes, compare based on type name.
        return string.Compare(x.GetType().Name, y.GetType().Name);
    }
}

IComparer<Animal> animalComparer = new AnimalComparer();

// IComparer<T> is contravariant, so this works:
IComparer<Dog> dogComparer = animalComparer;

List<Dog> dogs = new List<Dog> { new Dog(), new Dog() };
dogs.Sort(dogComparer); // Uses AnimalComparer to compare Dog objects
```

**Example 6: Contravariance with Action Delegates**
The built-in Action<in T> delegate is contravariant in its parameter type. This means you can assign an Action<Animal> to an Action<Dog>.

```typescript
Action<Animal> actAnimal = a => Console.WriteLine("Animal: " + a.GetType().Name);

// Due to contravariance, we can assign it to an Action<Dog>
Action<Dog> actDog = actAnimal;

actDog(new Dog());  // Outputs: Animal: Dog
```