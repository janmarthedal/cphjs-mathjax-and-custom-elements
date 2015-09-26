(function (global) {
    'use strict';

    var states = {start: 1, loading: 2, ready: 3, typesetting: 4},
        state = states.start,
        queue = [],
        src = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js',
        element_prototype = Object.create(HTMLElement.prototype);

    function flush_queue() {
        var to_process = [];
        queue.forEach(function (elem) {
            var elem_state = global.MathJax.Hub.isJax(elem);
            if (elem_state)
                to_process.push([elem_state, elem]);
        });
        queue = [];
        if (!to_process.length) {
            state = states.ready;
            return;
        }
        state = states.typesetting;
        to_process.forEach(function (item) {
            global.MathJax.Hub.Queue([item[0] < 0 ? 'Typeset' : 'Process',
                                      global.MathJax.Hub, item[1]]);
        });
        global.MathJax.Hub.Queue(flush_queue);
    }

    function load_mathjax(callback) {
        state = states.loading;
        global.MathJax = {
            skipStartupTypeset: true,
            jax: ['input/TeX', 'output/HTML-CSS'],
            AuthorInit: function () {
                MathJax.Hub.Register.StartupHook('End', function () {
                    state = states.ready;
                    callback();
                });
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
        load_mathjax(flush_queue);
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
