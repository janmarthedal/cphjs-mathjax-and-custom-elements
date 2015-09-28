(function() {
    'use strict';

    var mathjax,    // reference to <mathjax-loader> singleton element
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
        this._jax.type = 'math/tex';
    };

    element_prototype.attachedCallback = function () {
        this._jax.text = this.textContent;
        this.innerHTML = '';
        this.appendChild(this._jax);
        this.update();
    };

    element_prototype.detachedCallback = function () {
        this.textContent = this._jax.text;
    };

    element_prototype.attributeChangedCallback = function (attr) {
        if (attr === 'display')
            this.update();
    };

    Object.defineProperty(element_prototype, 'math', {
        get: function () {
            return this._jax.text;
        },
        set: function (value) {
            this._jax.text = value;
            this.update();
        }
    });

    element_prototype.update = function () {
        this._jax.type = this.getAttribute('display') === 'block' ?
                           'math/tex; mode=display' : 'math/tex';
        if (mathjax && this._jax.parentNode === this)
            mathjax.typeset(this._jax);
    }

    document.registerElement('math-tex', {
        prototype: element_prototype
    });

})();
