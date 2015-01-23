/**
 *  public API
 */

// global access point
Cat = {};

// keep track of definitions
var CatStore = {};


/**
 * define a component
 *
 *@ name, name of the component
 *@ definition, it contains actions, handlers and hooks
 */
Cat.define = function( name, definition ){
  // add to definition a template name if it does not exist
  definition.template = definition.template || name;
  // add a new component to the store
  // params are instance parameters
  CatStore[ name ] = function(params, attrs){
    return new CatInstance(definition, params, attrs);
  };
  // instead of a function I could need a class
  // I need to know the interface (actions/handlers) of a component class
  // in order to compose components
  // I do not need states and other vars which make sense
  // when an instance is created
};

/**
 * parallel composition
 */
Cat.dot = function(){

}

/**
 * sequential composition
 */
Cat.seq = function(){

}

/**
 * feedback
 */
Cat.feed = function(){

}

/**
 * create an instance of an existing component
 */
Cat.build = function(componentName, params, attrs){
  var Component = CatStore[componentName];
  var instance;

  if (!Component) {
    throw new Error("No such component: " + componentName);
  }

  instance = new Component(params, attrs);


  return instance;

}
