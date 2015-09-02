$(document).ready(function () {
    var cys_json;

    var cy = cytoscape({
        container: document.getElementById('cy'),

        ready: function () {
            console.log('ready')
        },

        style: cytoscape.stylesheet()
            .selector('node')
            .css({
                'content': 'data(name)',
                'shape': 'circle',
                'background-color': 'data(color)',
                'font-size': 10,
                'text-valign': 'bottom',
                'color': '#6e6e6e'
            }
        )
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

        layout: {
            name: 'dagre',
            directed: true,
            roots: '#a',
            padding: 10
        }
    });

    var params = {
        name: 'dagre',
        directed: true,
        roots: '#a',
        padding: 10,
        rankDir: 'TB'
    };
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

    // Dagre layout top to bottom
    $('#layout_tb').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

        layout.stop();

        var opts = {
            layoutOpts: {
                name: 'dagre',
                directed: true,
                roots: '#a',
                padding: 10,
                rankDir: 'TB'
            }
        };

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    // Dagre layout left to right
    $('#layout_lr').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

        layout.stop();

        var opts = {
            layoutOpts: {
                name: 'dagre',
                directed: true,
                roots: '#a',
                padding: 10,
                rankDir: 'LR'
            }
        };

        console.log(opts.layoutOpts);

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_left').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_middle').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_right').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

        layout.stop();

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_top').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_centre').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    $('#align_bottom').click(function (e) {
        e.preventDefault();// prevent the default anchor functionality

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

        layout = makeLayout(opts.layoutOpts);
        layout.run();
    });

    var ga_file;
    $(document).on('change', '#browsebutton :file', function () {
        var input = $(this),
            numFiles = input.get(0).files ? input.get(0).files.length : 1,
        //label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
            label = input.val();
        input.trigger('fileselect', [numFiles, label]);
    });

    $('#browsebutton').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles > 1 ? numFiles + ' files selected' : label;

        console.log("Number of files: " + input.length);
        console.log("Label: " + label);
        ga_file = label;

        if (input.length) {
            console.log(input.val());
            //ga_file = input.val();
        } else {
            console.log(log);
        }
    });

    function readSingleFile(evt) {
        //Retrieve the first (and only!) File from the FileList object
        var f = evt.target.files[0];

        if (!f) {
            console.log("Failed to load file");
        }

        // Check if valid galaxy file
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            console.log("File size: " + f.size + " bytes");
            //console.log(contents);
            var wf = new GalaxyWorkflow("Some workflow");
            cys_json = wf.parse(contents);

            console.log(cys_json);


        };
        var text = r.readAsText(f);
        console.log(text);
    }

    document.getElementById('my-file-selector').addEventListener('change', readSingleFile, false);


    //$('#submit').click(function (e) {
    //    e.preventDefault();// prevent the default anchor functionality
    //    console.log("Submit button clicked! " + ga_file);
    //    document.getElementById('my-file-selector').addEventListener('change', readSingleFile, false);
    //});

}); // on dom ready

//$(function() {
//  FastClick.attach( document.body );
//});