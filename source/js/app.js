// a very simple example of angular/cytoscape.js integration

// context (rightclick/2finger) drag to resize in graph
// use text boxes to resize in angular

var app = angular.module('app', ['ui.bootstrap', 'flow']);

// use a factory instead of a directive, because cy.js is not just for visualisation; you need access to the graph model and events etc
app.factory('workflowGraph', ['$q', function ($q) {
    var cy;
    var workflowGraph = function (nodes, edges) {
        var deferred = $q.defer();

        // put nodes and edges model in cy.js
        var eles = [];
        for (var i = 0; i < nodes.length; i++) {
            eles.push({
                group: 'nodes',
                data: {
                    id: nodes[i].id,
                    name: nodes[i].name,
                    color: nodes[i].color
                }
            });
        }
        for (i = 0; i < edges.length; i++) {
            eles.push({
                group: 'edges',
                data: {
                    id: edges[i].id,
                    name: edges[i].weight,
                    source: edges[i].source,
                    target: edges[i].target
                }
            });
        }

        $(function () { // on dom ready

            cy = cytoscape({
                container: $('#cy')[0],

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
                    padding: 10,
                    rankDir: 'TB'
                },

                elements: eles,

                ready: function () {
                    deferred.resolve(this);

                    //cy.on('cxtdrag', 'node', function (e) {
                    //    var node = this;
                    //    var dy = Math.abs(e.cyPosition.x - node.position().x);
                    //    var weight = Math.round(dy * 2);
                    //
                    //    node.data('weight', weight);
                    //
                    //    fire('onWeightChange', [node.id(), node.data('weight')]);
                    //});
                }
            });

        }); // on dom ready

        return deferred.promise;
    };

    workflowGraph.listeners = {};

    function fire(e, args) {
        var listeners = workflowGraph.listeners[e];

        for (var i = 0; listeners && i < listeners.length; i++) {
            var fn = listeners[i];

            fn.apply(fn, args);
        }
    }

    function listen(e, fn) {
        var listeners = workflowGraph.listeners[e] = workflowGraph.listeners[e] || [];

        listeners.push(fn);
    }

    workflowGraph.setPersonWeight = function (id, weight) {
        cy.$('#' + id).data('weight', weight);
    };

    workflowGraph.onWeightChange = function (fn) {
        listen('onWeightChange', fn);
    };

    return workflowGraph;
}]);


app.controller('NavBarCtrl', ['$scope', 'workflowGraph', function ($scope, workflowGraph) {

    $scope.status = {
        isopen: false
    };

    $scope.toggled = function(open) {
        $log.log('Dropdown is now: ', open);
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.SaveAsPNG = function () {
        console.log("Save as PNG clicked!!");
    };

    $scope.LayoutTB = function () {
        console.log("LayoutTB clicked!!");
    };

    $scope.LayoutLR = function () {
        console.log("LayoutLR clicked!!");
    };

    $scope.AlignLeft = function () {
        console.log("AlignLeft clicked!!");
    };

    $scope.AlignCentre = function () {
        console.log("AlignLeft clicked!!");
    };

    $scope.AlignRight = function () {
        console.log("LayoutLR clicked!!");
    };

    $scope.AlignTop = function () {
        console.log("AlignRight clicked!!");
    };

    $scope.AlignMiddle = function () {
        console.log("AlignMiddle clicked!!");
    };

    $scope.AlignBottom = function () {
        console.log("AlignBottom clicked!!");
    };

    $scope.imageStrings = [];
    $scope.processFiles = function(files){
        angular.forEach(files, function(flowFile, i){
            console.log(flowFile.name);

            var fileReader = new FileReader();
            fileReader.onload = function (event) {
                var uri = event.target.result;

                $scope.imageStrings[i] = uri;
            };
            fileReader.readAsDataURL(flowFile.file);
        });
    };

    $scope.LoadExample = function () {
        console.log("LoadExample clicked!!");

        var cy; // maybe you want a ref to cy
        // (usually better to have the srv as intermediary)

        $scope.nodes = [
            {id: 'a', name: 'Select populations', color: '#D9EDF7'},
            {id: 'b', name: 'Count', color: '#D9EDF7'},
            {id: 'c', name: 'Filter', color: '#D9EDF7'},
            {id: 'd', name: 'Select first', color: '#D9EDF7'},
            {id: 'e', name: 'Remove beginning', color: '#D9EDF7'},
            {id: 'f', name: 'Sort', color: '#D9EDF7'},
            {id: 'g', name: 'Concatenate datasets', color: '#D9EDF7'},
            {id: 'h', name: 'SmileFinder', color: '#D9EDF7'},
            {id: 'i', name: 'Grapher', color: '#D9EDF7'},
            {id: 'j', name: 'graph', color: '#FCF8E3'}
        ];

        $scope.edges = [
            {id: 'ab', weight: 1, source: 'a', target: 'b'}, //Select populations > Count
            {id: 'bc', weight: 2, source: 'b', target: 'c'}, //Count > Filter
            {id: 'cd', weight: 3, source: 'c', target: 'd'}, //Filter > Select first
            {id: 'ce', weight: 4, source: 'c', target: 'e'}, //Filter > Remove beginning
            {id: 'ef', weight: 5, source: 'e', target: 'f'}, //Remove beginning > Sort
            {id: 'dg', weight: 6, source: 'd', target: 'g'}, //Select First > Concatenate datasets
            {id: 'fg', weight: 6, source: 'f', target: 'g'}, //Sort > Concatenate datasets
            {id: 'gh', weight: 7, source: 'g', target: 'h'}, //Concatenate datasets > SmileFinder
            {id: 'hi', weight: 8, source: 'h', target: 'i'}, //SmileFinder > Grapher
            {id: 'ij', weight: 8, source: 'i', target: 'j'}  //Grapher > Graph

        ];

        // you would probably want some ui to prevent use of PeopleCtrl until cy is loaded
        workflowGraph($scope.nodes, $scope.edges).then(function (workflowCy) {
            cy = workflowCy;

            // use this variable to hide ui until cy loaded if you want
            $scope.cyLoaded = true;
        });
    };

}]);