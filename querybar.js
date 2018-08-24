// todo confirm jquery exists before attempting to use it - maybe check how select2 does it?
(function ($) {
  function generateTokenKey(val) {
    return "<span class=\"_qb-token _qb-key\">" + val + "</span>";
  }

  function generateTokenValue(val) {
    return "<span class=\"_qb-token _qb-value\">" + val + "</span>";
  }

  /*
   * Set up JQuery plugin by adding to $.fn
   */
  $.fn.QueryBar = function (options) {
    console.log('init query bar', this);

    let ret = []; // return object

    /*
     * We can always loop through a jquery object, even when only one exists
     * Append new QueryBar objects to a list and return the list as the result
     */
    for (let ele of this) {
      // Do something to each element here.
      // todo check if element has already been estantiated, and just return existing object
      // This can be done by storing the QueryBar object (self below)
      // on the element itself with $ele.data('QueryBar');
      // todo options to update query bar with params (searchParam = "keyName" || false)
      // let ele = this;
      let $ele = $(ele);

      // Retrieve QueryBar class from the element, if it exists. This way we don't instantiate multiple times
      // Self represents QueryBar object here
      let self = $ele.data('querybar');

      if (!(self instanceof QueryBar)) {
        self = new QueryBar(ele);
        // Store QueryBar data on element, so we know if we already instantiated this object
        $ele.data('querybar', self);
      } else {
        console.debug('already instantiated')
      }

      // Todo handle destroying querybar

      ret.push(self.public);
    }
    // });

    // Return list of all instantiated objects if we received a list of JQuery objects,
    // Otherwise return the single object.
    return ret.length > 1 ? ret : ret[0];
  };

  // Class definition - Of course, can't use classes before ES6 🙃🙄
  function QueryBar(ele) {
    let self = this;
    let $ele = $(ele);

    self.constructor = function() {
      // Self.public is the Public API to expose (on returned object from
      self.public = {
        params: {},  // Search parameters by Key:Value
        _self: self  // Expose self for advance users and debugging
      };

      // Wrap element in surrounding elements
      self._wrapElement();

      // Add key handler to element
      $ele.on('keydown', inputHandler)
    };

    self._wrapElement = function () {
      /*
       * Wrap Text Box in proper wrappers - this is the goal:
      <div class="_qb-container">
        <div id="token-container" class="_qb-token-container"></div>
        <span class="_qb-input-container">
            <input id="example" type="text" class="_qb-input">
        </span>
      </div>
       */

      // Add CSS class to element
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
    };

    function inputHandler() {
      // Remove last token with backspace
      // todo handle when a value is removed but a key isn't, then a value is readded
      if (event.key === "Backspace" && ele.value.length === 0) {
        // Backspace was pressed with no value, remove the last two items
        let $lastToken = self.$tokenContainer.find('._qb-token').last();
        $ele.val($lastToken.text());
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
      self.public.params[parts[0]] = parts[1];

      // Reset value
      ele.value = "";

      // Scroll all the way to the end of the query bar after appending badges
      // self.$container.scrollLeft(self.$container.width()) todo fix this once we can track the container again
    }

    self.constructor();
  }

}(jQuery));