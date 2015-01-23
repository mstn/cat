# =^.^=

> Cat is an **experimental** package to build compositional UI in Meteor.
> Don't use it in your project. So far it is only a proof of concept.

This project is very very preliminary. I decided to share it with the world,
almost since the first commit, in order to get early feedback.

This work is based on others' ideas and implementations:

* [Template Level Subscriptions Design Pattern](https://www.discovermeteor.com/blog/template-level-subscriptions/)
* [FlowComponents](https://github.com/meteorhacks/flow-components)
* [MeteorComponents](https://github.com/stubailo/meteor-components)

The reason why I thought the world needed another "component" library is
that I am not satisfied with the current state of inter-component communication
in web applications in general.
Several frameworks/libraries use a sort of global and centralized dispatcher or controller.
While modules or components help to organize the code in a more structured way,
I often find that a global controller/dispatcher could become a source of complexity
and spaghetti coding.


## Design principles

* everything is a component;
* data != view state;
* controllers/dispatchers are implicit;
* dynamically compositional as well as statically compositional;
* no global event space.

## Demos

* Infinite scroll list: [Code](http://github.com/mstn/infinite-scroll-demo) 
* Shopping cart (coming soon)
* Filtered infinite list (coming soon)
* Todo app (coming soon)

## How it works

A component is self-contained unit of functionality with an interface to the external world.

The interface says which actions a component listens to and which actions it can emit.
Handlers deal with incoming actions while an action map binds triggerable actions
to low-level ui events.

We can represent a component as a simple input/output map:

        incoming actions --> =^.^= --> outcoming actions

Following Flux [3] [4] and Flow-Components [2] I distinguish between actions and events.
Actions are more general than events
in the sense that events are essentially DOM events.
In this way there is no confusion with
the terms "event" used in Meteor.

Here, an example with comments of an infinite-scroll component.
The implementation follows [4].

     // we define a component giving a name and a description
     Cat.define('infinite-scroll', {

     // this component can trigger the following actions
     actions: {
      'load-more': {
        // low-level biding with Meteor template event
        'event':'click .load-more',
        // optional data to send over as arguments
        // moreover action payloads are plain objects
        // no more ugly jquery code template.$('input').val()
        'data': function(context, template){
          // NB: We don't have to write e.preventDefault() anymore!
          // 'this' is a component instance: hence we can access state and static attrs
          // 'context' correspond to 'this' inside the template
          // 'template' is template instance
          // the use of template to build payload is not recommended
          // we can use 'this'
          return undefined;
          // OR return some_data;
          // OR return array_of_data;
         }
       }
     },

     // handlers handle input actions
     handlers: {
      'load-more': function(payload){
        // 'this' is a reference to an instance
        // actions can have also data payloads passed as arguments
        // handlers interact with a component using state
        var limit = this.get('limit');
        limit += this.attrs.inc;
        this.set('limit', limit);
      }
     }

     ...

   });

The rest of a component syntax looks like FlowComponents with a main difference:
the created hook returns the initial state. The initial state is made of simple values
(e.g. strings, numbers) or (reactive) functions.

See demo code [here](https://github.com/mstn/infinite-scroll-demo).

Components are instantiated. We can have multiple instances of the same component at
the same time.

    instance = Cat.build('infinite-scroll', {
     // this properties are associated to this particular instance
     // infinite-scroll is generic, but an instance is particular
     template:'posts',
     limit:5,
     data: Posts
    }, {
     // non reactive attributes
     // if you don't need reaction, don't use it. It is more expensive!
     title:'My posts',
     sub:'posts',
     inc:5
    });

I preferred to separate building from rendering.

At the moment for rendering

    instance.render('#posts');

However, I am going to build a composed function build+render to do something similar
as FlowComponents.

Next step: compose components. (coming soon)


## Why Cat?

The idea of using components to build web ui dates back to 2012/2013.
I wanted to apply some techniques from a classical paper
on Category Theory [1] to web development and to Meteor in particular.
Hence, the name Cat.

Although there are significant changes to the original proposal
(which failed because it was a square wheel),
I decided to keep the name because it is fun and short!


## References

[1] S.Abramsky, Retracing some paths in Process Algebras, 1996

[2] [FlowComponents](https://github.com/meteorhacks/flow-components)

[3] [Facebook Flux](https://facebook.github.io/flux/)

[4] [Template Level Subscriptions Design Pattern](https://www.discovermeteor.com/blog/template-level-subscriptions/)

[5] [SpaceUI](https://github.com/CodeAdventure/space-ui/)

## Credits

Cat ASCII art from
http://pc.net/emoticons/smiley/cat

## License

GNU aGPL
