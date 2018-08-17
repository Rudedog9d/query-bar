// todo confirm jquery exists before attempting to use it - maybe check how select2 does it?
(function ($) {
  function generateTokenKey(val) {
    return "<span class=\"_qb-token _qb-key\">" + val + "</span>";
  }

  function generateTokenValue(val) {
    return "<span class=\"_qb-token _qb-value\">" + val + "</span>";
  }

  $.fn.QueryBar = function (options) {
    console.log('init query bar', this);

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
        // Remove last token with backspace
        // todo handle when a value is removed but a key isn't, then a value is readded
        if (event.key === "Backspace" && ele.value.length === 0) {
          // Backspace was pressed with no value, remove the last two items
          let $lastToken = self.$tokenContainer.find('._qb-token').last();
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
        self.$tokenContainer.append(generateTokenKey(parts[0]));
        self.$tokenContainer.append(generateTokenValue(parts[1]));

        // Reset value
        ele.value = "";

        // Scroll all the way to the end of the query bar after appending badges
        // self.$container.scrollLeft(self.$container.width()) todo fix this once we can track the container again
      };
      self.init = function() {
        /*
         * Wrap Text Box in proper wrappers - this is the goal:
        <div class="_qb-container">
          <div id="token-container" class="_qb-token-container"></div>
          <span class="_qb-input-container">
              <input id="example" type="text" class="_qb-input">
          </span>
        </div>
         */
        $ele.addClass('_qb-input');
        // todo get inputContainer and tokenContainer
        // self.$inputContainer = $ele.wrap('<div class="_qb-input-container"></div>');
        // self.$container = self.$inputContainer.wrap('<div class="_qb-container"></div>');
        // self.$tokenContainer = self.$inputContainer.before('<div class="_qb-token-container"></div>');

        // Hacky, but wrap the primary container first...
        $ele.wrap('<div class="_qb-container"></div>');
        // Then insert the token container...
        self.$tokenContainer = $('<div class="_qb-token-container"></div>').insertBefore($ele);
        // Then wrap the input element in the input wrapper
        $ele.wrap('<div class="_qb-input-container"></div>');

        // Add key handler to element
        $ele.on('keydown', self.inputHandler)
      };

      self.init();

      return self;
    });
  };

}(jQuery));