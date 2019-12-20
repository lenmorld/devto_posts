---
title: Ruby gotchas Part 1
published: false
description: 
tags: beginners, ruby
tags: #beginners, #ruby
cover_image: https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Ruby_logo.svg/1024px-Ruby_logo.svg.png
series: Ruby Gotchas
---

Feel free to skip this if you eat _gems_ for breakfast or you take the _rails_ everyday.
(Silly puns)

Here's some tidbits of information and "gotchas" that I had learning Ruby, as someone coming from JS-land.

_NOTE: I'm using irb with Ruby 2.6.5_

## 1. Ruby is dynamically-typed like JS

*Dynamic* means the type of the variable is resolved on-the-fly and can be changed at run tim (hence, dynamic). 

> compared to static typed like Java or TypeScript

No need for types when declaring variable, and the value assigned to variable can be of any type.


```ruby
me = 3  # int
me = "I'm dynamic"  # string
me = {:a=>"fancy", :b=>"object"}  # object
```

## 2. Integer() vs `to_i`

`Integer()` errors out with non-Integer strings

while `to_i` tries really hard, and spits out 0 if it can't

```ruby
"a1".to_i
=> 0

Integer("a1")
=> ArgumentError (invalid value for Integer(): "a1")
```

Same with `Float(str)` and `str.to_f` as well

```ruby
floaty = "3.14"
puts floaty.to_f + 0.01
=> 3.15
```

**Converting from other bases**

The nice thing with `Integer(str, radix)` is that you can also use it to convert other bases to integer, just like `parseInt()` in JS.

E.g. if you want to convert binary to integer

```ruby
Integer("101", 2)
=> 5
```

## 3. Everything is an **object**

Just like in Python, but not exactly like Javascript (un-boxed primitives like strings, numbers are not objects).

You can use `"me".methods` to see all supported methods of String `"me"` and Integer `123`

```ruby
"me".methods
=> ["upcase!", "empty?, "to_f", "to_i", "length",...]

123.methods
=> ["to_s", "odd?", ".even?", ...]
```

## 4. 🦆 Duck-typing  and `respond_to?`

*Duck*-typed means an object is considered a "Duck" if it has methods of a duck: it walks like a duck, it quacks like a duck. 

For example, if 123 has `odd?` and `even?` methods, then it must be an Integer?! Use `respond_to?` to check whether an object is able to do / has something, instead of using `.methods` everytime

```ruby
123.respond_to?("odd?")
=> true
```

## 5. Ranges `(1..5)` and using them in loops

A `Range` is a sequence of values that can be used as a collection or converted easily to an array using `to_a` 

Use `..` for including high value and `...` for excluding it

**Use as a collection for iterating**

```ruby
1..2
=> #<Enumerator: 1..2:each>

(1..3).each {|n| puts n}

1
2
3
=> 1..3
```

**Use as an array**

```ruby
(1..5).to_a
=> [1, 2, 3, 4, 5]

(1...5).to_a
=> [1, 2, 3, 4]
```

Works in characters too!

```ruby
('1x'..'2b').to_a
=> ["1x", "1y", "1z", "2a", "2b"]
```

You can then use these ranges inside loops...

```ruby
for i in (1..5)
	print i
end
=> 12345
```
> 🔖 `print` doesn't include a newline like `puts` does

And you can check if an item is inside a range

```ruby
('a'...'e').include? 'b'
=> true
('a'...'e').include? 'z'
=> false
```

That's all for now.

I'm not a Ruby ninja \O/ (yet), so let me know of any corrections and improvements in the comments. 👇

Happy Ruby-ing!


