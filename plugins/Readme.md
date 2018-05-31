# Jorungundar

Python <-> Node ABI

### Conventions

1. Simple is better than complex
2. Explicit is better than implicit when it makes sense

### Data conversion

* Simple types are copied / passed by value 
* Complex types are passed by reference 


Simple Types

1. Booleans
2. Numbers (Float, Int, Doubles, you name it)
3. Strings, [note:] because JS Strings are immutable

Special case Complex Types

1. Objects (including instantiated ones)
2. Arrays / List 
3. Set