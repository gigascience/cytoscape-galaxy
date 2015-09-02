var app = app || {};

app.NavBarView = Backbone.View.extend({

    // Instance variables
    cyInstance: null,
    cy_model: null,
    selected_elements: null,
    layout: null,
    running: null,

    initialize: function () {
        cy_model = new app.CytoscapeWorkflow();
        this.render();
    },
    render: function () {
        // Compile the template using underscore
        var template = _.template($("#navbar_template").html(), {});
        // Load the compiled HTML into the Backbone "el"
        this.$el.html(template);
    },
    renderCytoscape: function (cy, params) {

        // Check cyInstance is not null
        if (cyInstance === null)
        {
            console.log("cyInstance is undefined");
        }

        layout = makeLayout();
        running = false;

        cy.on('layoutstart', function () {
            running = true;
        }).on('layoutstop', function () {
            running = false;
        });

        // Detect select on nodes and edges
        //var selected_elements;
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
    },
    events: {
        'click #loadExampleHtmlButton': 'loadExample',
        'click #layout_lr': 'layoutLeftRight',
        'click #layout_tb': 'layoutTopBottom',
        'click #align_left': 'alignLeft',
        'click #align_right': 'alignRight',
        'click #align_centre': 'alignCentre',
        'click #align_top': 'alignTop',
        'click #align_middle': 'alignMiddle',
        'click #align_bottom': 'alignBottom',
        'change #my-file-selector': 'readFile'
    },
    readFile: function (evt) {
        console.log("Read file!!");

        var files = evt.target.files;
        var file = files[0];
        var jsonString = null;
        var elementsJsonObj = null;

        // This is a hack to alias that with the original value of this!!!
        var that = this;

        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            jsonString = cy_model.parseGalaxyWorkflow(contents);
            //console.log(jsonString);
            // Show file name in text input box
            document.getElementById("file-name").value = file.name;
            // Get node and edges from elements and pass them to cytoscape
            // instance
            elementsJsonObj = JSON.parse(jsonString);
            // Create cytoscape instance using default model settings, and
            // nodes and edges parsed from the galaxy workflow file
            cyInstance = cytoscape({
                container: cy_model.defaults.container,
                style: cy_model.defaults.style,
                elements: elementsJsonObj,
                layout: cy_model.defaults.layout,
                ready: function(){ console.log('ready') }
            });

            var params = {
                name: 'dagre',
                directed: true,
                roots: '#a',
                padding: 10,
                rankDir: 'TB'
            };
            console.log(cyInstance);
            that.renderCytoscape(cyInstance, params);
        };
        reader.readAsText(file);

    },
    alignBottom: function (evt) {
        evt.preventDefault();// prevent default anchor functionality

        layout.stop();

        var min_y = 0;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position y: ", selected_elements[i].position('y'));
                if (selected_elements[i].position('y') > min_y) {
                    min_y = selected_elements[i].position('y');
                }
            }
        }

        console.log("min_y: ", min_y);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                selected_elements[i].position('y', min_y);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };
        this.renderCytoscape(cyInstance, opts.layoutOpts);
    },
    alignMiddle: function (evt) {
        evt.preventDefault();// prevent the default anchor functionality

        layout.stop();

        var max_y = 0;
        var min_y = 1000;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position y: ", selected_elements[i].position('y'));
                if (selected_elements[i].position('y') > max_y) {
                    max_y = selected_elements[i].position('y');
                }
                if (selected_elements[i].position('y') < min_y) {
                    min_y = selected_elements[i].position('y');
                }
            }
        }

        console.log("max_y: ", max_y);
        console.log("min_y: ", min_y);
        var diff = (max_y - min_y) / 2;
        var new_y = min_y + diff
        console.log("diff: ", diff);
        console.log("new_y: ", new_y);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {

                selected_elements[i].position('y', new_y);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };

        this.renderCytoscape(cyInstance, opts.layoutOpts);
    },
    alignTop: function (evt) {
        evt.preventDefault();// prevent the default anchor functionality

        layout.stop();

        var max_y = 1000;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position y: ", selected_elements[i].position('y'));
                if (selected_elements[i].position('y') < max_y) {
                    max_y = selected_elements[i].position('y');
                }
            }
        }

        console.log("max_y: ", max_y);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                selected_elements[i].position('y', max_y);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };

        this.renderCytoscape(cyInstance, opts.layoutOpts);
    },
    alignCentre: function (evt) {
        evt.preventDefault();// prevent the default anchor functionality

        layout.stop();

        var max_x = 0;
        var min_x = 1000;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position x: ", selected_elements[i].position('x'));
                if (selected_elements[i].position('x') > max_x) {
                    max_x = selected_elements[i].position('x');
                }
                if (selected_elements[i].position('x') < min_x) {
                    min_x = selected_elements[i].position('x');
                }
            }
        }

        console.log("max_x: ", max_x);
        console.log("min_x: ", min_x);
        var diff = (max_x - min_x) / 2;
        var new_x = min_x + diff
        console.log("diff: ", diff);
        console.log("new_x: ", new_x);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {

                selected_elements[i].position('x', new_x);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };

        this.renderCytoscape(cyInstance, opts.layoutOpts);
    },
    alignRight: function (evt) {
        evt.preventDefault();
        console.log("Right align selected!");
        console.log(this.selected_elements);

        //layout.stop();

        var max_x = 0;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position x: ", selected_elements[i].position('x'));
                if (selected_elements[i].position('x') > max_x) {
                    max_x = selected_elements[i].position('x');
                }
            }
        }

        console.log("max_x: ", max_x);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                selected_elements[i].position('x', max_x);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };

        this.renderCytoscape(cyInstance, opts.layoutOpts);
    },
    alignLeft: function (evt) {
        evt.preventDefault();
        console.log("Left align selected!");

        layout.stop();

        var min_x = 1000;
        for (var i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                console.log("position x: ", selected_elements[i].position('x'));
                if (selected_elements[i].position('x') < min_x) {
                    min_x = selected_elements[i].position('x');
                }
            }
        }

        console.log("min_x: ", min_x);
        for (i = 0; i < selected_elements.length; i++) {
            if (selected_elements[i].isNode()) {
                selected_elements[i].position('x', min_x);
                console.log("Node: ", selected_elements[i].position());
            }
        }

        var opts = {
            layoutOpts: {
                name: 'preset'
            }
        };

        this.renderCytoscape(cyInstance, opts.layoutOpts);

    },
    layoutTopBottom: function (evt) {
        evt.preventDefault();
        console.log("Top bottom layout selected!");
        var params = {
            name: 'dagre',
            directed: true,
            roots: '#a',
            padding: 10,
            rankDir: 'TB'
        };
        this.renderCytoscape(cyInstance, params);

    },
    layoutLeftRight: function (evt) {
        evt.preventDefault();
        console.log("Left right layout selected!");
        var params = {
                    name: 'dagre',
                    directed: true,
                    roots: '#a',
                    padding: 10,
                    rankDir: 'LR'
                };
        this.renderCytoscape(cyInstance, params);

    },
    loadExample: function (evt) {
        // Button clicked, you can access the element that was clicked with
        // event.currentTarget
        evt.preventDefault();
        console.log("Load example button clicked!");
        // Show file name in text input box
        document.getElementById("file-name").value = "Galaxy workflow file";

        // Create cytoscape instance using default model settings and
        // example nodes and edges
        cyInstance = cytoscape({
            container: cy_model.defaults.container,
            style: cy_model.defaults.style,
            elements: {
                nodes: [
                    {
                        data: {
                            id: 'a',
                            name: 'Select populations',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'b',
                            name: 'Count',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'c',
                            name: 'Filter',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'd',
                            name: 'Select first',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'e',
                            name: 'Remove beginning',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'f',
                            name: 'Sort',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'g',
                            name: 'Concatenate datasets',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'h',
                            name: 'SmileFinder',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'i',
                            name: 'Grapher',
                            color: '#D9EDF7'
                        }
                    },
                    {
                        data: {
                            id: 'j',
                            name: 'graph',
                            color: '#FCF8E3'
                        }
                    }

                ],

                edges: [
                    {data: {id: 'ab', weight: 1, source: 'a', target: 'b'}}, //Select populations > Count
                    {data: {id: 'bc', weight: 2, source: 'b', target: 'c'}}, //Count > Filter
                    {data: {id: 'cd', weight: 3, source: 'c', target: 'd'}}, //Filter > Select first
                    {data: {id: 'ce', weight: 4, source: 'c', target: 'e'}}, //Filter > Remove beginning
                    {data: {id: 'ef', weight: 5, source: 'e', target: 'f'}}, //Remove beginning > Sort
                    {data: {id: 'dg', weight: 6, source: 'd', target: 'g'}}, //Select First > Concatenate datasets
                    {data: {id: 'fg', weight: 6, source: 'f', target: 'g'}}, //Sort > Concatenate datasets
                    {data: {id: 'gh', weight: 7, source: 'g', target: 'h'}}, //Concatenate datasets > SmileFinder
                    {data: {id: 'hi', weight: 8, source: 'h', target: 'i'}}, //SmileFinder > Grapher
                    {data: {id: 'ij', weight: 8, source: 'i', target: 'j'}}  //Grapher > graph
                ]
            },
            layout: cy_model.defaults.layout,
            ready: function(){ console.log('ready') }
        });

        var params = {
            name: 'dagre',
            directed: true,
            roots: '#a',
            padding: 10,
            rankDir: 'TB'
        };
        console.log(cyInstance);
        this.renderCytoscape(cyInstance, params);
    }
});
