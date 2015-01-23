/**
 * component instance
 */

var __COMPONENT_PREFIX = 'cat-component-state-'
var instanceId = 0;

function getTemplate( templateName ){
  return Template[ templateName ];
}

function buildReactiveFunction(instance, key){
  return function(){
    return instance.get(key);
  };
}

function bindFunction(fun, instance){
  return fun.bind(instance);
}
// _.each(eventMap, function (handler, spec) {
function makeStateReactive(state, instance){
  var key, value;
  var newState = {};
  for ( key in state ){
    value = state[key];
    if ( typeof value == 'function' ){
      newState[key] = bindFunction(value, instance);
    } else {
      // init state value
      instance.set(key, value);
      // create reactive handler
      newState[key] = buildReactiveFunction(instance, key);
    }
  }
  _.extend(newState, instance.attrs);
  return newState;
}

function createView( instance ){
  var template = getTemplate( instance.template );
  var state = instance._definition.created.call(instance);
  var view;

  var eventMap = instance._eventMap = createEventMap(instance);

  state = makeStateReactive(state, instance);

  view = Blaze.With( state, function(){
    return template;
  });

  view._onViewRendered(function(){
    // https://github.com/meteor/meteor/blob/devel/packages/blaze/view.js
    Blaze._addEventMap(view, eventMap);
  });

  // TODO binding??
  // listen to view lifecycle events
  // I should dispose instance listener
  // but do I need listener for an instance?
  return view;
}

function createEventMap( instance ){
  function buildTrigger(key, instance, context, data){
    return function(e, template){
      instance.trigger(key, data.call(instance, this, template) );
      e.preventDefault();
    };
  };
  var key, value;
  var map = {};
  for ( key in instance.actions ){
    value = instance.actions[key];
    map[ value.event ] = buildTrigger(key, instance, this, value.data);
  }
  return map;
}

CatInstance = function(definition, params, attrs){
  var key, value;

  // associate unique id to this instance
  this.id = instanceId++;

  // store definitions as private var for future reference
  this._definition = definition;

  // init params
  this.params = params;

  // non reactive attrs
  this.attrs = attrs;

  // save info about template
  this.template = this._definition.template;

  // save actions and handlers
  this.actions = this._definition.actions;
  this.handlers = this._definition.handlers;

  // create instance state
  this._state = new ReactiveDict( __COMPONENT_PREFIX + this.id);

  // create action bus
  var self = this;
  this._bus = new EventEmitter();
  this._bus.setMaxListeners( _.keys(this.handlers).length );
  _.each( this.handlers, function(handler, key){
    self._bus.on(key, handler.bind(self));
  });

  // callback arrays
  this._destroyedCallbacks = [];
  this._renderedCallback = [];
  this._createdCallback = [];

  // create view
  this._view = createView( this );
};


/*
 * implementation
 *
 */
_.extend( CatInstance.prototype, {
  // same as in FlowComponents
  'autorun': function(callback){
    var self = this;
    var c = Tracker.autorun(function(computation) {
      callback.call(self, computation);
    });
    self.onDestroyed(function() {c.stop()});
  },
  'get': function(key){
    return this._state.get(key);
  },
  'set': function(key, value){
    return this._state.set(key, value);
  },
  // new methods
  'render': function(selector){
    var renderTo = selector || this._params.renderTo;
    var parent;
    if ( !renderTo ){
      throw new Error('No selector for rendering.');
    }
    parent = $(renderTo).get(0);
    if (!parent){
      throw new Error('No element for selector ' + renderTo);
    }
    Blaze.renderWithData( this._view, this.params,  parent);
  },
  'trigger': function(action, data){
    console.log('BUM!! ' + action);
    this._bus.emit(action);
  },
  // life cycle callbacks
  onDestroyed: function(callback){
    this._destroyedCallbacks.push(callback.bind(this));
  },
  onRendered: function(callback){
    this._renderedCallbacks.push(callback.bind(this));
  },
  onCreated: function(callback){
    this._createdCallbacks.push(callback.bind(this));
  }
});
