'use strict';

(function($, window, document, undefined) {
    var pluginName = 'fifi',
        dataPlugin = 'plugin_' + pluginName;
  
    var defaults = {
        type: 'text',
        class: 'form-control',
        value: '',
        options: {},
        wrapperTemplates: {
            input: '<div class="input-group"></div>',
            select: '<div class="form-group"></div>',
            textarea: '<div class="form-group"></div>',
        },
        buttonsTemplates: {
            input: '<div class="input-group-append"><button type="button" class="btn btn-light btn-submit"><span class="octicon octicon-check"></span></button><button type="button" class="btn btn-light btn-cancel"><span class="octicon octicon-x"></span></button></div>',
            select: '<div class="input-group-append"><button type="button" class="btn btn-light btn-submit"><span class="octicon octicon-check"></span> Aceptar</button><button type="button" class="btn btn-light btn-cancel"> Cancelar<span class="octicon octicon-x"></span></button></div>',
            textarea: '<div class="row"><button type="button" class="col-xs-4 btn btn-light btn-submit"><span class="octicon octicon-check"></span> Aceptar</button><button type="button" class="col-xs-4 btn btn-light btn-cancel"><span class="octicon octicon-x"></span> Cancelar</button></div>',
        },
        onInit: function () {
              
        },
        onSubmit: function () {
          
        },
        onCancel: function () {
              
        },
        onChange: function () {
              
        },
    };
  
    var Fifi = function (el) { 
        this.el = el;
        this.$el = $(el);
        this.name = this.$el.data(pluginName + '-name');
      
        this.config = $.extend({}, defaults);    
    };

    Fifi.prototype = {
        init: function (options) {
            var config = this.config;   
            config = $.extend(config, options);
          
            if (config.value) {
                this.$el.html(config.value);
            }
          
            this.$el.unbind('click');
            this.$el.on('click', ()=> {
                this.doit();
            });
          
            this.config.onInit();
          
        },
        doit: function () {                                  
            var config = this.config;
            var input, wrapper, buttons;          
          
            switch (config.type) {
              case 'select':
                  input = $('<select></select>').attr({
                      val: config.value,
                      name: this.name,
                      class: config.class,
                  });
                
                  var options = config.options;
                  if (options && typeof options === 'object') {
                      for(var option in options) {
                          input.append('<option value="' + option + '">' + options[option] + '</option');
                      }

                      input.children().filter(function (index, el) { 
                          return $(el).val() === config.value;
                      }).attr('selected', true);
                  }
            
                  wrapper = input.wrap(config.wrapperTemplates.select).parent();
                  buttons = config.buttonsTemplates.select;
                  break;
              case 'textarea':
                  input = $('<textarea></textarea>', {
                      val: config.value,
                      name: this.name,
                      class: config.class,
                  });
            
                  wrapper = input.wrap(config.wrapperTemplates.textarea).parent();
                  buttons = config.buttonsTemplates.textarea;
                  break;
              default:
                  input = $('<input>').attr({
                      value: config.value,
                      name: this.name,
                      type: config.type,
                      class: config.class,
                  });
                            
                  wrapper = input.wrap(config.wrapperTemplates.input).parent();
                  buttons = config.buttonsTemplates.input;                
            }

            this.$el.after(wrapper);
            this.$original = this.$el.detach();
            input.after(buttons);
          
            this.config.onChange(input);
      
            var submitButton = wrapper.find('.btn-submit, button[type="submit"], button[type="button"]:nth-of-type(1)');
            var cancelButton = wrapper.find('.btn-cancel, button[type="button"]:nth-of-type(2)');
      
            this.wrapper = wrapper;
          
            $(submitButton).on('click', ()=> {
                var data = {},
                    value = input.val();
          
                data[this.name] = value;
                config.value = value;
                this.submit(data);

                this.undoit();
            });
          
            $(cancelButton).on('click', ()=> {
                this.cancel();

                this.undoit();
            });
        },
        undoit: function () {
            var wrapper = this.wrapper;
          
            if (wrapper) {
                var input = wrapper.find('input, textarea, select');
              
                wrapper.replaceWith(this.$original);
                this.$original.html(input.val());
            }
        },
        submit: function (data) {
            this.config.onSubmit(data);
          
            return this;
        },
        cancel: function () {
            this.config.onCancel();
          
            return this;
        },
        destroy: function () {
            this.undoit();
          
            this.$el.off();
          
            delete this.wrapper;

        }
    };

    Fifi.defaults = Fifi.prototype.defaults;

    $.fn[pluginName] = function (options) {      
        var args, instance;

        // only allow the plugin to be instantiated once
        if (!(this.data(dataPlugin) instanceof Fifi)) {
            // if no instance, create one
            this.data(dataPlugin, new Fifi(this));
        }

        instance = this.data(dataPlugin);

        // Is the first parameter an object (options), or was omitted,
        // call Fifi.init(options)
        if (typeof options === 'undefined' || typeof options === 'object') {
            if (typeof instance.init === 'function') {
                instance.init(options);
            }
        
        // checks that the requested public method exists
        } else if (typeof options === 'string' && typeof instance[options] === 'function') {
            // copy arguments & remove function name
            args = Array.prototype.slice.call(arguments, 1);

            // call the method
            return instance[options].apply(instance, args);
        } else {
            $.error('Method ' + options + ' does not exist on jQuery.' + pluginName);
        }
      
        return instance;
    };
  
    window.Fifi = Fifi;
})(jQuery, window, document);
