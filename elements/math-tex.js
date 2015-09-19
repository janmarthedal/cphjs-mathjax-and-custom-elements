(function() {

  var math_tex_prototype = Object.create(HTMLElement.prototype);

  math_tex_prototype.createdCallback = function() {
    this.textContent = "I'm a math-tex";
  };

  document.registerElement('math-tex', {
    prototype: math_tex_prototype
  });

})();
