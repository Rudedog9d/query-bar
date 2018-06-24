// todo confirm jquery exists before attempting to use it - maybe check how select2 does it?
(function( $ ) {
    $.fn.QueryBar = function(options) {

        console.log('init query bar', this)


        //todo support multiple elements with .each()
        /*
         * We can always call .each() on a jquery object, even when only one exists
         * Return this so that we can maintain chain-ability
         */
        // return this.each(function() {
            // Do something to each element here.
        // });

    };

}( jQuery ));