(function() {

    var states = {start: 1, configured: 2, loading: 3, ready: 4, error: 5},
        state = states.start,
        queue = []
        typesetting = false,
        element_prototype = Object.create(HTMLElement.prototype),
        options = {
            //src: "http://cdn.mathjax.org/mathjax/latest/MathJax.js",
            src: "../node_modules/mathjax/MathJax.js",
            async: true
        };

    function start() {
        var typeset_queue = [], reprocess_queue = [], state;
        queue.forEach(function (elem) {
            state = MathJax.Hub.isJax(elem);
            if (state === -1)
                typeset_queue.push(elem);
            else if (state === 1)
                reprocess_queue.push(elem);
        });
        queue = [];
        if (typeset_queue.length)
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, typeset_queue]);
        // for some reason, reprocess does not work on an array of elements
        reprocess_queue.forEach(function (elem) {
            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, elem]);
        });
        if (typeset_queue.length || reprocess_queue.length)
            MathJax.Hub.Queue([start]);
        else
            typesetting = false;
    }

    function check_queue() {
        if (state === states.ready && !typesetting) {
            typesetting = true;
            start();
        }
    }

    element_prototype.attachedCallback = function () {
        MathJax = {
            skipStartupTypeset: true,
            jax: ["input/TeX", "output/HTML-CSS"],
            AuthorInit: function () {
                MathJax.Hub.Register.StartupHook('End', function () {
                    state = states.ready;
                    check_queue();
                });
            }
        };
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = options.src;
        script.async = options.async;
        script.onerror = function () { state = states.error; queue = []; };
        document.head.appendChild(script);
    };

    element_prototype.typeset = function (elem) {
        queue.push(elem);
        check_queue();
    };

    document.registerElement('mathjax-loader', {
        prototype: element_prototype
    });

})();
