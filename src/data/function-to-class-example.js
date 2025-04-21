function Person(name, age) {
  this.name = name;
  this.age = age;
}

Person.prototype.sayHello = function () {
  console.log("Hello, my name is " + this.name);
};

const person = new Person("Alice", 30);
person.sayHello();
