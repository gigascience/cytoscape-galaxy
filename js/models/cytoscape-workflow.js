var app = app || {};

// CytoscapeWorkflow Model
// ----------
// Our basic **CytoscapeWorkflow** model has `style`, `layout` and `elements`
// attributes.

app.CytoscapeWorkflow = Backbone.Model.extend({

    initialize: function(){
        //var cy = cytoscape({
        //    container: document.getElementById('cy'),
        //    ready: function(){ console.log('ready') }
        //});

        console.log('This CytoscapeWorkflow model has been initialized.');
    },

    // Default attributes ensure that each cytoscape workflow created has
    // `style`, `layout` and `elements` keys.
    defaults: {
        container: document.getElementById('cy'),

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'shape': 'circle',
                'background-color': 'data(color)',
                'font-size': 10,
                'text-valign': 'bottom',
                'color': '#6e6e6e'
            })
            .selector('edge')
            .css({
                'target-arrow-shape': 'triangle',
                'width': 2,
                'line-color': '#bfbfbf',
                'target-arrow-color': '#bfbfbf'
            })

            // When selected using a dragged box
            .selector(":selected")
            .css({
                "line-color": "#636363",
                "target-arrow-color": "#636363",
                "background-blacken": "0.3"
            })

            .selector('.highlighted')
            .css({
                'background-color': '#61bffc',
                'line-color': '#61bffc',
                'target-arrow-color': '#61bffc',
                'transition-property': 'background-color, line-color, target-arrow-color',
                'transition-duration': '0.5s'
            }),
        layout: {
            name: 'dagre',
            directed: true,
            roots: '#a',
            padding: 10
        }
    },
    // Parse galaxy workflow, reading its node and edges into
    // this CytoscapeWorkflow model.
    parseGalaxyWorkflow: function (wfJSONString) {
        var wf_obj = JSON.parse(wfJSONString);
        var steps = wf_obj["steps"];

        var elements_contents = {};
        var elements = {};

        // Create nodes
        var data_nodes = [];
        var data_edges = [];
        for (var count in steps) {
            var node_data_contents = {};
            node_data_contents["id"] = "n" + steps[count].id;
            node_data_contents["name"] = steps[count].name;
            if (steps[count].type == "data_input") {
                node_data_contents["color"] = "#FCF8E3";
            }
            else { // The node is a tool
                node_data_contents["color"] = "#D9EDF7";
                // Create edge
                var input_connections = steps[count].input_connections;
                for (var input_connection_key in input_connections) {
                    var input_connection = input_connections[input_connection_key];
                    var edge_id = "n" + input_connection["id"] + "n" + count;
                    var edge_data_contents = {};
                    edge_data_contents["id"] = edge_id;
                    edge_data_contents["weight"] = "1";
                    edge_data_contents["source"] = "n" + input_connection["id"];
                    edge_data_contents["target"] = "n" + count;
                    data_edges.push({"data": edge_data_contents});
                }
            }
            data_nodes.push({"data": node_data_contents});
        }

        elements_contents["nodes"] = data_nodes;
        elements_contents["edges"] = data_edges;
        elements["elements"] = elements_contents;
        //console.log(JSON.stringify(elements, null, 2));
        return JSON.stringify(elements_contents, null, 2);
    }
});

