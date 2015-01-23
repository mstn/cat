Package.describe({
  name: 'mstn:cat',
  summary: ' EXPERIMENTAL! Another way to build compositional ui. ',
  version: '0.0.1',
  git: 'http://github.com/mstn/cat'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use('ui');
  api.use('templating');
  api.use('reactive-var');
  api.use('reactive-dict');
  api.use('underscore');
  api.use('raix:eventemitter@0.1.1');

  api.addFiles('lib/client/instance.js', 'client');
  api.addFiles('lib/client/api.js', 'client');
  api.export("Cat");
});
