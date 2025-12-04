
2025-10-04 17:43

Tags: [[freeCodeCamp]], [[HTML]], [[Attributes]], [[Basics]]

# FCC - HTML Basics
HTML stands for HyperText Markup Language
- defines structure and content of a page

HTML has 6 heading elements h1 to h6 alongside p for paragraphs. All used to show importance of a section.
used like this:

```html
<h1>Welcome to freeCodeCamp</h1>
<h2>Full Stack Curriculum</h2>
<p>Learn the skills to become a full stack developer</p>
<h3>Introduction to HTML</h3>
<p>HTML represents the content and structure of a webpage</p>
<h3>Introduction to CSS</h3>
<p>CSS is used to style a webpage</p>
```

## What Role Does HTML Play on the Web?
It is a markup language for creating web pages - it represents the content and structure of a webpage through the use of elements.
- elements are enclosed in <> (start and end tags)
	- in between the tags is the content
	- HTML tag names are case-insensitive but there is an accepted convention of using lowercase
	- elements without closing tags are called void elements (example could be `img`)

If you want to display an image you need to include ==attributes== inside your image element:
- An attribute is a special value to adjust the behavior for an HTML element
```html
<img src="example-cat-img-url" alt="Cat sleeping in the grass">
```
- the ```src``` attribute is used to specify the location of the image.
- an ```alt``` attribute is used to provide a caption for the images

HTML is the content and structure
CSS is for styling
JS is for adding interactivity

## What are Attributes, and How Do They Work?
A value placed inside opening tag of an element. They provide added info about the element or specify how the element should behave.

### Common HTML Attributes
```href``` - used to specify the URL of a link. w/o it the link won't go anywhere and just be text
```src``` - required for image files to be displayed
```check``` and ```type``` - check is used to specify the checkbox should be checked by default like a boolean. type specifies the type of input (in the example, for what the user inputs)
```html
<input type="checkbox" checked />
```
- other common boolean attributes: `disabled`, `readonly`, `required`

# References
https://www.freecodecamp.org/learn/full-stack-developer/lab-debug-camperbots-profile-page/lab-debug-camperbots-profile-page - Camper bot practice problem to study basic HTML

https://www.freecodecamp.org/learn/full-stack-developer/lecture-understanding-html-attributes/what-is-html - what role does HTML play on the web?

[[IG Bookmarked - Resources for CS]]