(function () {

    var counter = 0,
        element_prototype = Object.create(HTMLElement.prototype);

    element_prototype.createdCallback = function () {
        this.number = ++counter;
        this.textContent = 'my-element[' + this.number + ']';
        console.log('my-element[' + this.number + '] created');
    }

    element_prototype.attachedCallback = function () {
        console.log('my-element[' + this.number + '] attached');
    }

    element_prototype.detachedCallback = function () {
        console.log('my-element[' + this.number + '] detached');
    }

    element_prototype.attributeChangedCallback = function (attr, oldVal, newVal) {
        console.log('my-element[' + this.number + '] attribute \'' + attr +'\' change: ' + oldVal + ' -> ' + newVal);
    }

    document.registerElement('my-element', {
        prototype: element_prototype
    });

})();
