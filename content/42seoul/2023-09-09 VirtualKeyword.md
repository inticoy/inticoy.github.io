---
title: Why do we need virtual keyword?
date: 2023-09-13 03:13:00 +0900
categories: [42seoul]
tags: [42seoul]
image:
  path: /assets/img/blog/Vtable.png
  lqip: data:image/webp;base64,UklGRpoAAABXRUJQVlA4WAoAAAAQAAAADwAABwAAQUxQSDIAAAARL0AmbZurmr57yyIiqE8oiG0bejIYEQTgqiDA9vqnsUSI6H+oAERp2HZ65qP/VIAWAFZQOCBCAAAA8AEAnQEqEAAIAAVAfCWkAALp8sF8rgRgAP7o9FDvMCkMde9PK7euH5M1m6VWoDXf2FkP3BqV0ZYbO6NA/VFIAAAA
  alt: Responsive rendering of Chirpy theme on multiple devices.
---


# CPP Runtime type determination

Contents  
1. [What is the 'virtual' keyword?](#1-what-is-the-virtual-keyword)
2. [What happens if we use 'virtual' keyword?](#2-what-happens-if-we-use-virtual-keyword)
3. [When Should we use it](#3-when-should-we-use-it)


## 1. What is the 'virtual' keyword?
In cpp, when we use 'virtual' with function, the function becomes a virtual function that enforces the derived class to overload the function. (We won't cover virtual destructor in this article.) For example, Dog class should implement the sound() because sound() is a virtual function in the base class

```cpp
class Animal()
{
    virtual void sound() {std::cout << "****" << std::endl;};
}

class Dog() : public Animal
{
    void sound() {std::cout << "Bark!!" << std::endl;};
}
```

## 2. What happens if we use 'virtual' keyword?
If we use 'virtual' in our class(virtula function or virtual destructor), or inherit the class with 'virtual', then compiler would generate the data structure called <b>VMT</b>(Virtual Method Table, VTable) for <b>each class</b>. 

Simply, it is collection of fuction pointer that points to the virtual function. Also, there is information regarding their type(pointer to a type_info). Ok, we won't go deeper. You just have to know that 'virtual' makes VTable.

<img src="/assets/img/blog/Vtable.png" alt='virtual table'>

## 3. When Should we use it

First, we have to keep in mind that when we say 'virtual' keyword is needed, it is same with saying VTable is needed. Because virtual keyword generates the VTable!   

And there are some situations that you need VTable. They are <b>Polymorphism, Dynamic Casting, typeid</b>.

### 3.1 Polymorphism
Polymorphism is "object-oriented programming concept that refers to the ability of a variable, function, or object to take on multiple forms".

Let's take a look at the main function below. What would be the result? Yes "Bark!!". How does this happen? When program catches the 'animal->sound()', it looks for the VTable of the Dog class and call the matching function using the address saved in the VTable.

So If we didn't use the virtual keyword, there would be no VTable, leading to no Polymorphism.

```cpp
int main()
{
    Animal *animal = new Dog();

    animal->sound();
}
```

### 3.2 Dynamic Casting
Dynamic Casting is a safe downcasting at run time. It proivdes a type checks so we can prevent runtime errors. Now let's study how it provides it.

Dynamic Casting is done by using RTTI(Run Time Type Information). RTTI is a mechanism that allows the type of an object to be determined during program execution. And it uses type_info to know the type of the object during runtime. So Dynamic Casting also need a 'virtual' keyword.

```cpp
int main()
{
    Animal *animal = new Dog();
    Dog *dog = dynamic_cast<Dog*>(animal);

    dog->sound();
}
```

## 4. Next topics
* More about virtual keyword(virtual destructor)
* Memory layout when we use virtual keyword
* Several Castings
* How does casting work internally?
