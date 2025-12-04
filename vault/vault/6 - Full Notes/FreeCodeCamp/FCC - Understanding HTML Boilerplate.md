
2025-10-05 00:05

Tags: [[freeCodeCamp]], [[HTML]], [[Attributes]], [[Basics]], [[Link element]], [[Metal element]]

# FCC - Understanding HTML Boilerplate

## Role of the Link Element in HTML
`link` is used to link external resources like stylesheets and site icons.
```html
<link rel="stylesheet" href="./styles.css" /> <!-- basic syntax for link element -->
```
`rel` is used to specify the relationship between linked resource and the HTML doc. for the example, we specified it to be called stylesheet
- good practice to separate HTML and CSS in different files. so developers use `link` for external CSS files
`./` tells computer to look in current folder/directory for styles.css

`link` should be placed inside the `head` element as seen here:
```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Examples of the link element</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
```
often time, multiple `link` elements are used in a professional codebase for different stylesheets, fonts and icons:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Playwrite+CU:wght@100..400&display=swap"
  rel="stylesheet"
/>
```
`preconnect` value for the `rel` attribute tells the browser to create an early connection to a value in `href`. This speeds up loading times for these external resources.

a ==favicon== (or favorite icon) is a small icon used to display in the browser tab next to the site title. usually it's the brand logo

## What is an HTML Boilerplate
A ready-made template for your webpages (like a house foundation).
- includes basic structure and essential elements all HTML docs need
```html
<!-- EXAMPLE -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
       name="viewport"
       content="width=device-width, initial-scale=1.0" />
    <title>freeCodeCamp</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
  </body>
</html>
```
`DOCTYPE` declaration tells browsers which version of HTML you're using
`html` tag wraps around all your content and specifies language used.
`head` and `body` are the two main tags inside `html`:
- `head` contains the important BTS info: contains your site's metadata, details about things like character encoding, site title, etc. (all using elements like `meta` and `title`)
- `body` is where all your content goes, like paragraphs and h1s-h6s.

### Importance of Boilerplate
ensures your pages are structured and work across different browsers.
- you avoid common mistakes and follow good practices
- good starting point
If need be, you can always customize the boilerplate to fit your needs.
- saves time whenever starting new projects

## What is UTF-8 character encoding
UCS Transformation Format 8 is a standardized character encoding
- character encoding is how computers store characters as data
	- all text on a site is stored as characters in the form of bytes
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Examples of the UTF-8 encoding</title>
  </head>
  <body>
    <p>Café</p>
  </body>
</html>
```




# References
https://www.freecodecamp.org/learn/full-stack-developer/lecture-understanding-the-html-boilerplate/what-is-the-role-of-the-link-element-in-html

https://www.freecodecamp.org/learn/full-stack-developer/lecture-understanding-the-html-boilerplate/what-is-an-html-boilerplate

[[FCC - HTML Basics]]

[[IG Bookmarked - Resources for CS]]