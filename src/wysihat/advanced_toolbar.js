/** section: wysihat
 *  class WysiHat.AdvancedToolbar
**/
WysiHat.AdvancedToolbar = Class.create((function() {
  /**
   *  new WysiHat.AdvancedToolbar(editor)
   *  - editor (WysiHat.Editor): the editor object that you want to attach to
   *
   *  Creates a toolbar element above the editor. The WysiHat.AdvancedToolbar object
   *  has many helper methods to easily add buttons to the toolbar.
   *
   *  This toolbar class is not required for the Editor object to function.
   *  It is merely a set of helper methods to get you started and to build
   *  on top of. If you are going to use this class in your application,
   *  it is highly recommended that you subclass it and override methods
   *  to add custom functionality.
  **/
  function initialize(editor) {
    this.editor = editor;
    this.element = this.createToolbarElement();
  }

  /**
   *  WysiHat.AdvancedToolbar#createToolbarElement() -> Element
   *
   *  Creates a toolbar container element and inserts it right above the
   *  original textarea element. The element is a div with the class
   *  'editor_toolbar'.
   *
   *  You can override this method to customize the element attributes and
   *  insert position. Be sure to return the element after it has been
   *  inserted.
  **/
  function createToolbarElement() {
    var toolbar = new Element('div', { 'class': 'editor_toolbar' });
    this.editor.insert({before: toolbar});
    return toolbar;
  }
  
  /**
   *  WysiHat.AdvancedToolbar#addButtonSet(set) -> undefined
   *  - set (Array): The set array contains nested arrays that hold the
   *  button options, and handler.
   *
   *  Adds a button set to the toolbar.
  **/
  function addButtonSet(set) {
    var toolbar = this;
    $A(set).each(function(button){
      toolbar.addButton(button);
    });
  }

  /**
   *  WysiHat.AdvancedToolbar#addButton(options[, handler]) -> undefined
   *  - options (Hash): Required options hash
   *  - handler (Function): Function to bind to the button
   *
   *  The options hash accepts two required keys, name and label. The label
   *  value is used as the link's inner text. The name value is set to the
   *  link's class and is used to check the button state. However the name
   *  may be omitted if the name and label are the same. In that case, the
   *  label will be down cased to make the name value. So a "Bold" label
   *  will default to "bold" name.
   *
   *  The second optional handler argument will be used if no handler
   *  function is supplied in the options hash.
   *
   *  toolbar.addButton({
   *    name: 'bold', label: "Bold" }, function(editor) {
   *      editor.boldSelection();
   *  });
   *
   *  Would create a link,
   *  "<a href='#' class='button bold'><span>Bold</span></a>"
  **/
  function addButton(options, handler) {
    options = $H(options);

    if (!options.get('name'))
      options.set('name', options.get('label').toLowerCase());
    var name = options.get('name');

    var button = this.createButtonElement(this.element, options);

    var handler = this.buttonHandler(name, options);
    this.observeButtonClick(button, handler);

    var handler = this.buttonStateHandler(name, options);
    this.observeStateChanges(button, name, handler);
  }
  
  function addSelectbox(options, handler) {
    options = $H(options);
    
    if (!options.get('name'))
      options.set('name', options.get('label').toLowerCase());
    var name = options.get('name');
    
    var selectbox = this.createSelectboxElement(this.element, options) ;
                  
    var handler = this.selectboxHandler(name, options);
    this.observeOptionSelect(selectbox, handler);
    
    var handler = this.selectboxStateHandler(name, options);
    this.observeStateChangesSelectbox(selectbox, name, handler);
  }

  /**
   *  WysiHat.AdvancedToolbar#createButtonElement(toolbar, options) -> Element
   *  - toolbar (Element): Toolbar element created by createToolbarElement
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Creates individual button elements and inserts them into the toolbar
   *  container. The default elements are 'a' tags with a 'button' class.
   *
   *  You can override this method to customize the element attributes and
   *  insert positions. Be sure to return the element after it has been
   *  inserted.
  **/
  function createButtonElement(toolbar, options) {
    var button = new Element('a', {
      'class': 'button', 'href': '#'
    });
    button.update('<span>' + options.get('label') + '</span>');
    button.addClassName(options.get('name'));

    toolbar.appendChild(button);

    return button;
  }
  
  function createSelectboxElement(toolbar, options) {
    var selectbox = Element('select');    
    options.get('options').each(function(option){
      element = Element('option', {'id' : option});
      element.update(option);
      selectbox.appendChild(element);
    });
    
    toolbar.appendChild(selectbox);
    
    return selectbox;
  }

  /**
   *  WysiHat.AdvancedToolbar#buttonHandler(name, options) -> Function
   *  - name (String): Name of button command: 'bold', 'italic'
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Returns the button handler function to bind to the buttons onclick
   *  event. It checks the options for a 'handler' attribute otherwise it
   *  defaults to a function that calls execCommand with the button name.
  **/
  function buttonHandler(name, options) {
    if (options.handler)
      return options.handler;
    else if (options.get('handler'))
      return options.get('handler');
    else
      return function(editor) { editor.execCommand(name); };
  }
  
  function selectboxHandler(name, options) {
    if (options.handler)
      return options.handler;
    else if (options.get('handler'))
      return options.get('handler');
    else
      var handlers = {};
      options.get('options').each(function(option){
        var handler = function(editor) { editor.execCommand(name, false, option); };
        handlers[option] = handler;
      });
      return handlers;
  }

  /**
   *  WysiHat.AdvancedToolbar#observeButtonClick(element, handler) -> undefined
   *  - element (Element): Button element
   *  - handler (Function): Handler function to bind to element
   *
   *  Bind handler to elements onclick event.
  **/
  function observeButtonClick(element, handler) {
    var toolbar = this;
    element.observe('click', function(event) {
      handler(toolbar.editor);
      toolbar.editor.fire("wysihat:change");
      toolbar.editor.fire("wysihat:cursormove");
      Event.stop(event);
    });
  }

  function observeOptionSelect(element, handler) {
    var toolbar = this;
    element.observe('change', function(event) {
      handler[element.value](toolbar.editor);
      toolbar.editor.fire("wysihat:change");
      toolbar.editor.fire("wysihat:cursormove");
      Event.stop(event);
    });
  }

  /**
   *  WysiHat.AdvancedToolbar#buttonStateHandler(name, options) -> Function
   *  - name (String): Name of button command: 'bold', 'italic'
   *  - options (Hash): Options hash that pass from addButton
   *
   *  Returns the button handler function that checks whether the button
   *  state is on (true) or off (false). It checks the options for a
   *  'query' attribute otherwise it defaults to a function that calls
   *  queryCommandState with the button name.
  **/
  function buttonStateHandler(name, options) {
    if (options.query)
      return options.query;
    else if (options.get('query'))
      return options.get('query');
    else
      return function(editor) { return editor.queryCommandState(name); };
  }
  
  function selectboxStateHandler(name, options) {
    if (options.query)
      return options.query;
    else if (options.get('query'))
      return options.get('query');
    else
      return function(editor) { return editor.getSelectedStyles().get(name); }
  }

  /**
   *  WysiHat.AdvancedToolbar#observeStateChanges(element, name, handler) -> undefined
   *  - element (Element): Button element
   *  - name (String): Button name
   *  - handler (Function): State query function
   *
   *  Determines buttons state by calling the query handler function then
   *  calls updateButtonState.
  **/
  function observeStateChanges(element, name, handler) {
    var toolbar = this;
    var previousState = false;
    toolbar.editor.observe("wysihat:cursormove", function(event) {
      var state = handler(toolbar.editor);
      if (state != previousState) {
        previousState = state;
        toolbar.updateButtonState(element, name, state);
      }
    });
  }
  
  function observeStateChangesSelectbox(element, name, handler) { 
    var toolbar = this;
    var previousState = false;
    toolbar.editor.observe("wysihat:cursormove", function(event) {
      var state = handler(toolbar.editor);
      if (state != previousState) {
        previousState = state;                                 
        toolbar.updateSelectboxState(element, name, state);
      }
    });
  }

  /**
   *  WysiHat.AdvancedToolbar#updateButtonState(element, name, state) -> undefined
   *  - element (Element): Button element
   *  - name (String): Button name
   *  - state (Boolean): Whether button state is on/off
   *
   *  If the state is on, it adds a 'selected' class to the button element.
   *  Otherwise it removes the 'selected' class.
   *
   *  You can override this method to change the class name or styles
   *  applied to buttons when their state changes.
  **/
  function updateButtonState(element, name, state) {
    if (state)
      element.addClassName('selected');
    else
      element.removeClassName('selected');
  }
  
  function updateSelectboxState(element, name, state) {
    $(state).selected = true;
  }

  return {
    initialize:           initialize,
    createToolbarElement: createToolbarElement,
    addButtonSet:         addButtonSet,
    addButton:            addButton,
    addSelectbox:         addSelectbox,
    createButtonElement:  createButtonElement,
    createSelectboxElement:createSelectboxElement,
    buttonHandler:        buttonHandler,
    selectboxHandler:     selectboxHandler,
    observeButtonClick:   observeButtonClick,
    observeOptionSelect:  observeOptionSelect,
    buttonStateHandler:   buttonStateHandler,
    observeStateChanges:  observeStateChanges,
    updateButtonState:    updateButtonState,
    updateSelectboxState: updateSelectboxState,
    selectboxStateHandler: selectboxStateHandler,
    observeStateChangesSelectbox: observeStateChangesSelectbox
  };
})());

//= require "advanced_toolbar/button_sets"
