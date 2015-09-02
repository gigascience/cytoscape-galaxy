var app = app || {};

// The Application
// ---------------

// Our overall **AppView** is the top-level piece of UI.
app.AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: '#app-body',

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template( $('#stats-template').html() ),
    statsTemplate: _.template($('#cys-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        // For the load-example button
        'click #loadExample':  'loadExample'
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function () {
        //this.$('#cy').html('This is Hello World by JQuery');

        //_.bindAll(this, 'render', 'loadExample');
        //this.render();

        //app.CytoscapeWorkflows.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function () {
        //$(this.el).html("<p>Stuff!!!!</p>");
        //$(this.el).html("<button id='loadExample'>Load Example</button>");
        //return this;
    },

    loadExample: function (evt) {
        evt.preventDefault();
        //this.$('#cy').html('loadExample function called!!');
        alert('loadExample function called!!');
        console.log('loadExample function called!!');
    }
});