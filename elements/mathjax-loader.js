(function() {

    var states = {start: 1, configured: 2, loading: 3, ready: 4, error: 5},
        state = states.start,
        typeset_queue = [],
        reprocess_queue = [],
        typesetting = false,
        element_prototype = Object.create(HTMLElement.prototype),
        options = {
            src: "http://cdn.mathjax.org/mathjax/latest/MathJax.js",
            async: true
        };

    function start() {
        if (typeset_queue.length) {
            var q = typeset_queue;
            typeset_queue = [];
            console.log('Typesetting ' + q.length);
            MathJax.Hub.Queue(['Typeset', MathJax.Hub, q, start]);
        } else if (reprocess_queue.length) {
            var q = reprocess_queue;
            reprocess_queue = [];
            console.log('Reprocessing ' + q.length);
            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, q, start]);
        } else
            typesetting = false;
    }

    function check_queue() {
        if (state === states.ready && !typesetting) {
            typesetting = true;
            start();
        }
    }

    function readyCallback() {
        state = states.ready;
        check_queue();
    }

    element_prototype.attachedCallback = function () {
        MathJax = {
            skipStartupTypeset: true,
            jax: ["input/TeX", "output/HTML-CSS"],
            AuthorInit: function () {
                MathJax.Hub.Register.StartupHook("End Config", function () {
                    var waitFor = MathJax.Hub.config.skipStartupTypeset ? "End" : "Begin Typeset";
                    MathJax.Hub.Register.StartupHook(waitFor, readyCallback);
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
        typeset_queue.push(elem);
        check_queue();
    };

    element_prototype.reprocess = function (elem) {
        reprocess_queue.push(elem);
        check_queue();
    };

    document.registerElement('mathjax-loader', {
        prototype: element_prototype
    });

})();
