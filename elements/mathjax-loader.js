(function() {

  var mathjax_loader_prototype = Object.create(HTMLElement.prototype);

  mathjax_loader_prototype.createdCallback = function() {
    this.textContent = "I'm a mathjax-loader";
  };

  document.registerElement('mathjax-loader', {
    prototype: mathjax_loader_prototype
  });

})();
