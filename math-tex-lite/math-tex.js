(function() {
    'use strict';

    var mathjax,
        element_prototype = Object.create(HTMLElement.prototype);

    function check_mathjax() {
        if (mathjax) return;
        mathjax = document.querySelector('mathjax-loader') ||
                      document.createElement('mathjax-loader');
        if (!mathjax || typeof mathjax.typeset !== 'function') {
            console.warn('no mathjax-loader');
            mathjax = undefined;
        } else if (!document.contains(mathjax))
            document.head.appendChild(mathjax);
    }

    element_prototype.createdCallback = function () {
        check_mathjax();
        this._jax = document.createElement('script');
    };

    element_prototype.attachedCallback = function () {
        var math = this.textContent;
        this.innerHTML = '';
        this.appendChild(this._jax);
        this.math = math;
    };

    Object.defineProperty(element_prototype, 'math', {
         get: function () {
             return this._jax.textContent;
         },
         set: function (value) {
             this._jax.type = this.getAttribute('display') === 'block' ?
                                'math/tex; mode=display' : 'math/tex';
             this._jax.text = value;
             this.update();
         }
    });

    element_prototype.update = function () {
        if (mathjax)
            mathjax.typeset(this._jax);
    }

    document.registerElement('math-tex', {prototype: element_prototype});

})();
