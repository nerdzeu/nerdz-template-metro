(function ($) {
  //pass in just the context as a $(obj) or a settings JS object
  $.fn.autogrow = function (opts) {
    var that = $(this).css({
        overflow: 'hidden',
        resize: 'none'
      }), selector = that.selector, defaults = {
        context: $(document),
        animate: true,
        speed: 200,
        fixMinHeight: true,
        cloneClass: 'autogrowclone',
        onInitialize: false
      };
    opts = $.isPlainObject(opts) ? opts : { context: opts ? opts : $(document) };
    opts = $.extend({}, defaults, opts);
    that.each(function (i, elem) {
      var min, clone;
      elem = $(elem);
      //if the element is "invisible", we get an incorrect height value
      //to get correct value, clone and append to the body. 
      if (elem.is(':visible') || parseInt(elem.css('height'), 10) > 0) {
        min = parseInt(elem.css('height'), 10) || elem.innerHeight();
      } else {
        clone = elem.clone().addClass(opts.cloneClass).val(elem.val()).css({
          position: 'absolute',
          visibility: 'hidden',
          display: 'block'
        });
        $('body').append(clone);
        min = clone.innerHeight();
        clone.remove();
      }
      if (opts.fixMinHeight) {
        elem.data('autogrow-start-height', min);  //set min height                                
      }
      elem.css('height', min);
      if (opts.onInitialize) {
        resize.call(elem);
      }
    });
    opts.context.on('keyup paste', selector, resize);
    function resize(e) {
      var box = $(this), oldHeight = box.innerHeight(), newHeight = this.scrollHeight, minHeight = box.data('autogrow-start-height') || 0, clone;
      if (oldHeight < newHeight) {
        //user is typing
        this.scrollTop = 0;
        //try to reduce the top of the content hiding for a second
        if(opts.animate)
          box.stop().animate({ height: newHeight }, opts.speed);
        else 
          box.innerHeight(newHeight);
      } else if (!e || e.which == 8 || e.which == 46 || e.ctrlKey && e.which == 88) {
        //user is deleting, backspacing, or cutting
        if (oldHeight > minHeight) {
          //shrink!
          //this cloning part is not particularly necessary. however, it helps with animation
          //since the only way to cleanly calculate where to shrink the box to is to incrementally
          //reduce the height of the box until the $.innerHeight() and the scrollHeight differ.
          //doing this on an exact clone to figure out the height first and then applying it to the
          //actual box makes it look cleaner to the user
          clone = box.clone().addClass(opts.cloneClass).css({
            position: 'absolute',
            zIndex: -10
          }).val(box.val());
          box.after(clone);
          //append as close to the box as possible for best CSS matching for clone
          do {
            //reduce height until they don't match
            newHeight = clone[0].scrollHeight - 1;
            clone.innerHeight(newHeight);
          } while (newHeight === clone[0].scrollHeight);
          newHeight++;
          //adding one back eliminates a wiggle on deletion 
          clone.remove();
          box.focus();
          // Fix issue with Chrome losing focus from the textarea.
          //if user selects all and deletes or holds down delete til beginning
          //user could get here and shrink whole box
          if(newHeight < minHeight) newHeight = minHeight;
          if(oldHeight > newHeight && opts.animate)
            box.stop().animate({ height: newHeight }, opts.speed);
          else
            box.innerHeight(newHeight);
        } else {
          //just set to the minHeight
          box.innerHeight(minHeight);
        }
      }
    }
  };
}(jQuery));
