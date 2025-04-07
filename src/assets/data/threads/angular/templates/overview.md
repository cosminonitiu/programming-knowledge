## Template syntax  
Every Angular component has a template that defines the DOM that the component renders onto the page. By using templates, Angular is able to automatically keep your page up-to-date as data changes.  
<br>

Templates are usually found within either the template property of a *.component.ts file or the *.component.html file.  
<br>

### How do templates work?  
Templates are based on HTML syntax, with additional features such as built-in template functions, data binding, event listening, variables, and more.  
<br>

Angular compiles templates into JavaScript in order to build up an internal understanding of your application. One of the benefits of this are built-in rendering optimizations that Angular applies to your application automatically.  
<br>

### Differences from standard HTML  
Some differences between templates and standard HTML syntax include:  
<br>

&nbsp;&nbsp;1. Comments in the template source code are not included in the rendered output  
&nbsp;&nbsp;2. Component and directive elements can be self-closed (e.g., <UserProfile />)  
&nbsp;&nbsp;3. Attributes with certain characters (i.e., [], (), etc.) have special meaning to Angular. See binding docs and adding event listeners docs for more information.  
&nbsp;&nbsp;4. The @ character has a special meaning to Angular for adding dynamic behavior, such as control flow, to templates. You can include a literal @ character by escaping it as an HTML entity code (&commat; or &#64;).  
&nbsp;&nbsp;5. Angular ignores and collapses unnecessary whitespace characters. See whitespace in templates for more details.  
&nbsp;&nbsp;6. Angular may add comment nodes to a page as placeholders for dynamic content, but developers can ignore these.  
<br>

In addition, while most HTML syntax is valid template syntax, Angular does not support ```<script>``` element in templates.