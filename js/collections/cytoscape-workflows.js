var app = app || {};

// CytoscapeWorkflow Collection
// ---------------

// The collection of cytoscape workflows is backed by *localStorage* instead of
// a remote server.
var CytoscapeWorkflowList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: app.CytoscapeWorkflow,

    // Save all of the cytoscapeworkflow items under the `"cytoscapeworkflow-backbone"` namespace.
    localStorage: new Backbone.LocalStorage('cytoscapeworkflow-backbone'),

    // Filter down the list of all cytoscapeworkflow items that are finished.
    completed: function() {
        return this.filter(function( todo ) {
            return todo.get('completed');
        });
    },

    // Filter down the list to only cytoscapeworkflow items that are still not finished.
    remaining: function() {
        return this.without.apply( this, this.completed() );
    },

    // We keep the CytoscapeWorkflows in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
        if ( !this.length ) {
            return 1;
        }
        return this.last().get('order') + 1;
    },

    // CytoscapeWorkflows are sorted by their original insertion order.
    comparator: function( todo ) {
        return todo.get('order');
    }
});

// Create our global collection of **CytoscapeWorkflows**.
app.CytoscapeWorkflows = new CytoscapeWorkflowList();