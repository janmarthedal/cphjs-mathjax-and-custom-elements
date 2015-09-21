(function() {

    var TAG_NAME = 'math-tex',
        HANDLER_TAG_NAME = 'mathjax-loader',
        mutation_config = {childList: true, characterData: true, attributes: true},
        handler,
        element_prototype = Object.create(HTMLElement.prototype);

    function check_handler() {
        if (handler) return true;
        handler = document.querySelector(HANDLER_TAG_NAME);
        if (handler) return true;
        handler = document.createElement(HANDLER_TAG_NAME);
        if (handler && typeof handler.typeset === 'function') {
            document.head.appendChild(handler);
            return true;
        }
        console.warn(['no', HANDLER_TAG_NAME, 'element defined;', TAG_NAME, 'element will not work'].join(' '));
        handler = undefined;
        return false;
    }

    element_prototype.createdCallback = function () {
        var script = document.createElement('script');
        this.createShadowRoot().appendChild(script);
        this._private = {jax: script};
    };

    element_prototype.attachedCallback = function () {
        var elem = this;
        if (!check_handler()) return;
        if (this.textContent.trim())
            this.update();
        this._private.observer = new MutationObserver(function () {
            elem.update();
        });
        this._private.observer.observe(this, mutation_config);
    };

    element_prototype.detachedCallback = function () {
        if (this._private) {
            this._private.observer.disconnect();
            delete this._private;
        }
    }

    element_prototype.update = function () {
        var jax = this._private.jax;
        jax.type = this.getAttribute('display') === 'block' ? 'math/tex; mode=display' : 'math/tex';
        jax.textContent = this.textContent;
        handler.typeset(jax);
    }

    document.registerElement(TAG_NAME, {prototype: element_prototype});

})();
