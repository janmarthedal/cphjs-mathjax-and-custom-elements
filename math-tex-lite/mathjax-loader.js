(function () {
    'use strict';

    var states = {start: 1, loading: 2, ready: 3, typesetting: 4},
        state = states.start,
        queue = [],
        src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js',
        element_prototype = Object.create(HTMLElement.prototype);

    function flush_queue() {
        var to_process = queue.map(function (elem) {
            return [MathJax.Hub.isJax(elem), elem];
        }).filter(function (item) {
            return item[0] !== 0;
        });
        queue = [];
        if (to_process.length) {
            state = states.typesetting;
            to_process.forEach(function (item) {
                var action = item[0] < 0 ? 'Typeset' : 'Reprocess';
                MathJax.Hub.Queue([action, MathJax.Hub, item[1]]);
            });
            MathJax.Hub.Queue(flush_queue);
        } else
            state = states.ready;
    }

    function load_mathjax(callback) {
        state = states.loading;
        window.MathJax = {
            skipStartupTypeset: true,
            jax: ['input/TeX', 'output/HTML-CSS'],
            TeX: {
                extensions: ['AMSmath.js', 'AMSsymbols.js']
            },
            AuthorInit: function () {
                MathJax.Hub.Register.StartupHook('End', callback);
            }
        };
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = src;
        script.async = true;
        document.head.appendChild(script);
    }

    element_prototype.attachedCallback = function () {
        if (this.hasAttribute('src'))
            src = this.getAttribute('src');
        load_mathjax(function () {
            state = states.ready;
            flush_queue()
        });
    };

    element_prototype.typeset = function (elem) {
        queue.push(elem);
        if (state === states.ready)
            flush_queue();
    };

    document.registerElement('mathjax-loader', {
        prototype: element_prototype
    });

})(window);
