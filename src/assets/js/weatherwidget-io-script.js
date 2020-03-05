function weatherwidget_io_invoke() {
    !function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        oldjs = d.getElementById(id);
        js = d.createElement(s);
        js.id = id;
        js.src = 'https://weatherwidget.io/js/widget.min.js';
        fjs.parentNode.insertBefore(js, fjs);
        if (oldjs != null) oldjs.remove();
    }(document, 'script', 'weatherwidget-io-js');
}