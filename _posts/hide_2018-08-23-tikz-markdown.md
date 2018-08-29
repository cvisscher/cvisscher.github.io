---
layout: post
title: Tikz in Markdown
subtitle: tikz latex to markdown to html
tags: [math,github]
math: true
---

Converting mathematical expressions between markdown, latex, and html is relatively straightforward using tools such as pandoc.  [This page](http://deeplearningthesis.com/jekyll/mathematics/programming/2018/01/14/setting-up-jekyll.html) has useful instructions for implementing mathjax within the jekyll template on github pages, allowing easy conversion from markdown to html.

For a given page (such as this post) mathjax is implemented by setting **math: true** at the beginning of the page, for example:


```latex {cmd=true hide=true}
\documentclass{standalone}
\usepackage{tikz}
\usetikzlibrary{matrix}
\begin{document}
\begin{tikzpicture}
  \matrix (m) [matrix of math nodes,row sep=3em,column sep=4em,minimum width=2em]
  {
     F & B \\
      & A \\};
  \path[-stealth]
    (m-1-1) edge node [above] {$\beta$} (m-1-2)
    (m-1-2) edge node [right] {$\rho$} (m-2-2)
    (m-1-1) edge node [left] {$\alpha$} (m-2-2);
\end{tikzpicture}
\end{document}