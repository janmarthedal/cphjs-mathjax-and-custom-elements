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

    function update(elem) {
        var jax = elem._private.jax,
            firstTypeset = !jax.hasAttribute('type');
        jax.type = elem.getAttribute('display') === 'block' ? 'math/tex; mode=display' : 'math/tex';
        jax.textContent = elem.textContent;
        firstTypeset ? handler.typeset(jax) : handler.reprocess(jax);
    }

    element_prototype.createdCallback = function () {
        var sdom = this.createShadowRoot();
        var script = document.createElement('script');
        sdom.appendChild(script);
        this._private = {jax: script};
    };

    element_prototype.attachedCallback = function () {
        if (check_handler()) {
            var elem = this;
            if (this.textContent.trim())
                update(this);
            this._private.observer = new MutationObserver(function () {
                update(elem);
            });
            this._private.observer.observe(this, mutation_config);
        }
    };

    element_prototype.detachedCallback = function () {
        if (this._private) {
            this._private.observer.disconnect();
            delete this._private;
        }
    }

    /*element_prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        if (attr === 'display')
            update(this._private.jax, newVal);
    };*/

    document.registerElement(TAG_NAME, {
        prototype: element_prototype
    });

})();
