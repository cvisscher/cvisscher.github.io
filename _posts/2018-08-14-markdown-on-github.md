---
layout: post
title: MathJax on GitHub Pages
subtitle: Converting from markdown to html
tags: [math,github]
math: true
---

Converting mathematical expressions between markdown, latex, and html is relatively straightforward using tools such as pandoc.  [This page](http://deeplearningthesis.com/jekyll/mathematics/programming/2018/01/14/setting-up-jekyll.html) has useful instructions for implementing mathjax within the jekyll template on github pages, allowing easy conversion from markdown to html.

For a given page (such as this post) mathjax is implemented by setting **math: true** at the beginning of the page, for example:

```
---
layout: post
title: MathJax on GitHub Pages
subtitle: Converting from markdown to html
tags: [math,github]
math: true
---
```

This allows us to use latex-style syntax to create equations, such as:

$$ a^2 + b^2 = c^2 $$

$$ E = mc^2 $$

