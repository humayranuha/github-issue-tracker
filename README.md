## What is the difference between var, let, and const ?

- 'var' is the old way — it doesn’t care about blocks {} and can be used before it’s declared (hoisting).
- 'let' is block-scoped, so it only exists inside the {} where you define it, and you can change its value later.
- 'const' is also block-scoped, but one can't reassign it once it’s set (though one can still modify objects/arrays inside it).



## What is the spread operator (...)?

It basically unpacks elements from an array, object, or string.  
For example: '[...oldArray, newItem]' makes a new array without messing with the old one.



## What is the difference between map(), filter(), and forEach()?

- map(): loops through an array and returns a new array of the same length with changed values.
- filter(): loops and returns a new array but only with items that pass a condition (like true/false check).
- forEach(): just loops through and does something — it does not return anything  at all.



## What is an arrow function?

A shorter way to write functions using '=>'.  
It also doesn't have its own `'this', so it behaves more predictably inside classes or callbacks.



## What are template literals?

They let you write strings with variables directly inside using backticks (` `) and `${variable}` instead of messing around with `"hello " + name + "!"`.  
You can also write multi-line strings cleanly without '\n'.
