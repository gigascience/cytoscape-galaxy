var app = app || {};

// Todo Item View
// --------------

// The DOM element for a todo item...
app.CysView = Backbone.View.extend({

    //... is a list tag.
    //tagName: 'li',
    tagName: 'cy',

    // Cache the template function for a single item.
    template: _.template( $('#item-template').html() ),

    // The DOM events specific to an item.
    events: {
        'click .toggle': 'togglecompleted', // NEW
        'dblclick label': 'edit',
        'click .destroy': 'clear',           // NEW
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close'
    },

    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.remove);        // NEW
        this.listenTo(this.model, 'visible', this.toggleVisible); // NEW
    },

    // Render graph from cytoscape data using renderCytoscape function
    render: function(cy) {
        var params = {
            name: 'dagre',
            directed: true,
            roots: '#a',
            padding: 10,
            rankDir: 'TB'
        };

        this.renderCytoscape(cy, params)

        //this.$el.html( this.template( this.model.attributes ) );
        //
        //this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
        //this.toggleVisible();                                             // NEW
        //
        //this.$input = this.$('.edit');
        return this;
    },

    // Generate visualisation of graph from cytoscape data.
    renderCytoscape: function(cy, params) {
        var layout = makeLayout();
        var running = false;

        cy.on('layoutstart', function () {
            running = true;
        }).on('layoutstop', function () {
            running = false;
        });

        // Detect select on nodes and edges
        var selected_elements;
        cy.on('select', function (evt) {
            console.log('selected: ' + evt.cyTarget.id());
            selected_elements = cy.elements(':selected');
        });

        cy.panningEnabled(true);
        cy.boxSelectionEnabled(true);

        layout.run();

        function makeLayout(opts) {
            for (var i in opts) {
                params[i] = opts[i];
            }
            return cy.makeLayout(params);
        }

        //==============

        this.$el.html( this.template( this.model.attributes ) );

        this.$el.toggleClass( 'completed', this.model.get('completed') ); // NEW
        this.toggleVisible();                                             // NEW

        this.$input = this.$('.edit');
        return this;
    },


    // NEW - Toggles visibility of item
    toggleVisible : function () {
        this.$el.toggleClass( 'hidden',  this.isHidden());
    },

    // NEW - Determines if item should be hidden
    isHidden : function () {
        var isCompleted = this.model.get('completed');
        return ( // hidden cases only
            (!isCompleted && app.TodoFilter === 'completed')
            || (isCompleted && app.TodoFilter === 'active')
        );
    },

    // NEW - Toggle the `"completed"` state of the model.
    togglecompleted: function() {
        this.model.toggle();
    },

    // Switch this view into `"editing"` mode, displaying the input field.
    edit: function() {
        this.$el.addClass('editing');
        this.$input.focus();
    },

    // Close the `"editing"` mode, saving changes to the todo.
    close: function() {
        var value = this.$input.val().trim();

        if ( value ) {
            this.model.save({ title: value });
        } else {
            this.clear(); // NEW
        }

        this.$el.removeClass('editing');
    },

    // If you hit `enter`, we're through editing the item.
    updateOnEnter: function( e ) {
        if ( e.which === ENTER_KEY ) {
            this.close();
        }
    },

    // NEW - Remove the item, destroy the model from *localStorage* and delete its view.
    clear: function() {
        this.model.destroy();
    }
});