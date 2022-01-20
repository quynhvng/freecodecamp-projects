import * as marked from "https://cdn.skypack.dev/marked@4.0.0";

marked.setOptions({
  gfm: true,
  breaks: true });


// default markdown in editor
const placeholder = `# Markdown Example

## 1. Headings

Using three or more equal signs (=) under a line makes it a h1 heading. Using three or more hyphens (-) under a line makes it a h2 heading. You can also use 1-6 pound symbols (#) to style h1-h6 headings.

This is h1
==========

This is h2
----------

# This is h1
## This is h2
### This is h3
#### So on h4
##### Any # after is ignored
###### The max depth is h6

## 2. Links

This is a bare link <https://www.google.com>. This is an [inline link](https://www.google.com "Google") with title. This is a reference style link to [freeCodeCamp][1] and a link to [Codepen]. The references to these two links are defined below. However, this can be defined anywhere in the document and not be compiled into HTML. The defined names are case-insensitive, so you can also use [codepen].

[1]: https://www.freecodecamp.org
[Codepen]: https://codepen.io

## 3. Text formatting

Use one *star* or _underscore_ for italics. Use **two** for __bold__. Use ***three*** for ___bold italics___.

> This is a blockquote
> in two lines.

To add inline code, use backticks like \`<html>\` or \`function()\`. To add a code block, indent the lines with tab or four spaces.

    // This is a code block
    function sum(x, y) {
      return x + y;
    }

## 4. Lists

* This is a bulleted list.
* You can also use other symbols like -/+.

1. This is a numbered list.
2. The actual number in markdown does not matter.
10. This is still the 3rd items.

## 5. Images

Images are style in the same way as links, except for an exclamation point (!) in front. For example:
![Google Logo](https://www.google.com/images/errors/logo_sm.gif)
`;

var input = placeholder;
var html = marked.parse(placeholder);

$("#editor").val(input);
$("#preview").html(html);

// clear button
$("#clearBtn").on("click", function () {
  input = "";
  html = "";
  $("#editor").val(null);
  $("#preview").text(null);
});

// preview option button
$("#previewOptBtn").on("change", function () {
  previewOpt(html);
});

function previewOpt(html) {
  const option = $("#previewOptBtn").val();
  switch (option) {
    case "compiled":
      $("#preview").html(html);
      break;
    case "html":
      $("#preview").text(html);}

};

// get current input
$("#editor").on("input change", function (event) {
  const currentInput = $(this).val();
  if (currentInput == input) {
    return;
  } else
  {
    input = currentInput;
    html = marked.parse(input);
    previewOpt(html);
  }
});