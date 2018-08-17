// todo confirm jquery exists before attempting to use it - maybe check how select2 does it?
(function ($) {
  function generateTokenKey(val) {
    return "<span class=\"_qb-token _qb-key\">" + val + "</span>";
  }

  function generateTokenValue(val) {
    return "<span class=\"_qb-token _qb-value\">" + val + "</span>";
  }

  $.fn.QueryBar = function (options) {
    console.log('init query bar', this)


    //todo support multiple elements with .each()
    /*
     * We can always call .each() on a jquery object, even when only one exists
     * Return this so that we can maintain chain-ability
     */
    return this.each(function () {
      // Do something to each element here.
      let ele = this;
      let $ele = $(ele);

      // Self represents QueryBar object here
      let self = {};
      self.inputHandler = function () {
        let $qContainer = $('._qb-container');
        let $tokenContainer = $('#token-container');
        // console.log([ele])

        if (event.key === "Backspace" && ele.value.length === 0) {
          // Backspace was pressed with no value, remove the last two items
          let $lastToken = $tokenContainer.find('._qb-token').last();
          $(ele).val($lastToken.text());
          $lastToken.remove();
        }

        // If key wasn't ENTER, return
        if (event.keyCode !== 13)
          return;

        // If key was enter, get value
        let val = ele.value;

        // If no value present, assume user intended to perform query
        if (!val) {
          // todo handle search here
          // return self.search();
          return
        }

        let parts = val.split(':');

        if (parts.length < 2) {
          alert('must provide value in form "key:value"');
          return;
        }

        // Add Key:Value pair to query bar
        $('#token-container').append(generateTokenKey(parts[0]));
        $('#token-container').append(generateTokenValue(parts[1]));

        // Reset value
        ele.value = "";

        // Scroll all the way to the end of the query bar after appending badges
        $qContainer.scrollLeft($qContainer.width())
      };

      // Add key handler to element
      $ele.on('keydown', self.inputHandler)
    });
  };

}(jQuery));