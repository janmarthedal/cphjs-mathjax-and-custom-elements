(function () {

    var counter = 0,
        element_prototype = Object.create(HTMLElement.prototype);

    element_prototype.createdCallback = function () {
        this.number = ++counter;
        console.log('my-element[%d] created', this.number);
    }

    element_prototype.attachedCallback = function () {
        this.textContent = 'my-element[' + this.number + ']';
        console.log('my-element[%d] attached', this.number);
    }

    element_prototype.detachedCallback = function () {
        console.log('my-element[%d] detached', this.number);
    }

    element_prototype.attributeChangedCallback =
        function (attr, oldVal, newVal) {
            console.log('my-element[%d] attribute %s change: %s -> %s',
                this.number, attr, oldVal, newVal);
        }

    document.registerElement('my-element', {
        prototype: element_prototype
    });

})();
