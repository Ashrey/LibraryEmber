window.Libros = Ember.Application.create();
Libros.ApplicationAdapter = DS.RESTAdapter.extend({
    namespace: 'api'
});

/*This remove root node*/
Libros.ApplicationSerializer = DS.RESTSerializer.extend({
    normalizePayload: function(type, payload) {
        return { libros: payload };
    },
    serializeIntoHash: function(hash, type, record, options) {
        Ember.merge(hash, this.serialize(record, options));
    }
});

/*router*/
Libros.Router.map(function() {
  this.resource('libros', { path: '/' }, function () {
    // additional child routes will go here later
  })
});

// ... additional lines truncated for brevity ...
Libros.LibrosRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('libro');
  }
});

Libros.LibrosIndexRoute = Ember.Route.extend({
  model: function() {
    return this.modelFor('libros');
  }
});

/*model*/
Libros.Libro = DS.Model.extend({
  title: DS.attr('string'),
  author: DS.attr('string')
});

// ... additional lines truncated for brevity ...
Libros.Libro.FIXTURES = [
 {
   id: 1,
   title: 'Learn Ember.js',
   author: 'Prueba 1'
 },
 {
   id: 2,
   title: 'Otro titulos',
   author: 'Prueba 2'
 },
 {
   id: 3,
   title: 'Profit!',
   author: 'Prueba 3'
 }
];
/*controller*/
Libros.LibrosController = Ember.ArrayController.extend({
  actions: {
        createLibro: function() {
            var title = this.get('newTitle'),
                author = this.get('newAuthor');
            if (!title || !author) {
                alert("All field are required");
                return; 
            }

            var libro = this.store.createRecord('libro', {
               title: title,
                author: author
            });
            this.set('newTitle', '');
            this.set('newAuthor', '');
            // Save the new model
            libro.save();
        },
    },
    
    ltotal: function() {
        return this.get('length');
    }.property('@each')
});

Libros.LibroController = Ember.ObjectController.extend({
  actions: {
    editLibro: function() {
        if(this.get('editing')){
            this.send('acceptChanges');
        }else{
            this.set('editing', true);
            this.set('labelButton', 'Save');
            this.set('btnType', 'btn-primary');
        }
    },

    acceptChanges: function () {
      this.set('editing', false);
      this.set('labelButton', 'Edit');
      this.set('btnType', 'btn-warning');
      this.get('model').save();
    },

    removeLibro: function () {
        if(!confirm("Are you sure?"))
            return;
      var todo = this.get('model');
      todo.deleteRecord();
      todo.save();
    }

  },

  editing: false,
  btnType: 'btn-warning',
  labelButton: 'Edit'
});

/*view*/
Libros.EditLibroView = Ember.TextField.extend({
  didInsertElement: function() {
    this.$().focus();
  }
});

Ember.Handlebars.helper('edit-libro', Libros.EditLibroView);