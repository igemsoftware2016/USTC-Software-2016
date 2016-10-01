var nodes;
var kick_ass;

document.onload = (function(d3, saveAs, Blob, undefined) {
    "use strict";

    // define graphcreator object
    var GraphCreator = function(svg, nodes, edges) {
        var self = this;
        self.idct = 0;

        self.nodes = nodes || [];
        self.edges = edges || [];

        self.state = {
            selectedNode: null,
            selectedEdge: null,
            mouseDownNode: null,
            mouseDownLink: null,
            justDragged: false,
            justScaleTransGraph: false,
            lastKeyDown: -1,
            shiftNodeDrag: false,
            selectedText: null
        };

        // define arrow markers for graph links
        var defs = svg.append('svg:defs');
        defs.append('svg:marker')
                .attr('id', 'end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', "32")
                .attr('markerWidth', 3.5)
                .attr('markerHeight', 3.5)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5');

        // define arrow markers for leading arrow
        defs.append('svg:marker')
                .attr('id', 'mark-end-arrow')
                .attr('viewBox', '0 -5 10 10')
                .attr('refX', 7)
                .attr('markerWidth', 3.5)
                .attr('markerHeight', 3.5)
                .attr('orient', 'auto')
                .append('svg:path')
                .attr('d', 'M0,-5L10,0L0,5');

        self.svg = svg;
        self.svgG = svg.append("g")
                .classed(self.consts.graphClass, true);
        var svgG = self.svgG;

        // displayed when dragging between nodes
        self.dragLine = svgG.append('svg:path')
                .attr('class', 'link dragline hidden')
                .attr('d', 'M0,0L0,0')
                .style('marker-end', 'url(#mark-end-arrow)');

        // svg nodes and edges
        self.paths = svgG.append("g").selectAll("g");
        self.circles = svgG.append("g").selectAll("g");

        self.drag = d3.behavior.drag()
                .origin(function(d) {
                    return {x: d.x, y: d.y};
                })
                .on("drag", function(args) {
                    self.state.justDragged = true;
                    self.dragmove.call(self, args);
                })
                .on("dragend", function() {
                    // todo check if edge-mode is selected
                });

        // listen for key events
        d3.select(window)
                .on("keydown", function() {
                    self.svgKeyDown.call(self);
                })
                .on("keyup", function() {
                    self.svgKeyUp.call(self);
                });
        svg.on("mousedown", function(d) {self.svgMouseDown.call(self, d);});
        svg.on("mouseup", function(d) {self.svgMouseUp.call(self, d);});

        // listen for dragging
        this.zoomHandler = d3.behavior.zoom()
                .on("zoom", function() {
                    if (d3.event.sourceEvent.shiftKey) {
                        // TODO  the internal d3 state is still changing
                        return false;
                    } else {
                        self.state.justScaleTransGraph = true;
                        d3.select("." + self.consts.graphClass)
                            .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
                        return true;
                    }
                })
                .on("zoomstart", function() {
                    var ael = d3.select("#" + self.consts.activeEditId).node();
                    if (ael) {
                        ael.blur();
                    }
                    if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
                })
                .on("zoomend", function() {
                    d3.select('body').style("cursor", "auto");
                });

        svg.call(self.zoomHandler).on("dblclick.zoom", null);

        // listen for resize
        window.onresize = function() {self.updateWindow(svg);};

        // handle download data
        d3.select("#download-input").on("click", function() {
            var saveEdges = self.edges.map(function(val) {
                return {source: val.source, target: val.target};
            });
            var blob = new Blob([window.JSON.stringify({"nodes": self.nodes, "edges": saveEdges})], {type: "text/plain;charset=utf-8"});
            saveAs(blob, "mydag.json");
        });


        // handle uploaded data
        d3.select("#upload-input").on("click", function() {
            document.getElementById("hidden-file-upload").click();
        });
        d3.select("#hidden-file-upload").on("change", function() {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                var uploadFile = this.files[0];
                var filereader = new window.FileReader();

                filereader.onload = function() {
                    var txtRes = filereader.result;
                    // TODO better error handling
                    try{
                        var jsonObj = JSON.parse(txtRes);
                        self.deleteGraph(true);
                        self.nodes = jsonObj.nodes;
                        self.setIdCt(jsonObj.nodes.length + 1);
                        var newEdges = jsonObj.edges.map(function (e) {
                            return {
                                source: self.nodes.filter(function (n) {
                                    return n.id == e.source;
                                })[0].id,
                                target: self.nodes.filter(function (n) {
                                    return n.id == e.target;
                                })[0].id
                            };
                        });
                        self.edges = newEdges;
                        self.updateGraph();
                    }catch(err) {
                        window.alert("Error parsing uploaded file\nerror message: " + err.message);
                        return;
                    }
                };
                filereader.readAsText(uploadFile);

            } else {
                alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
            }

        });

        // handle delete graph
        d3.select("#delete-graph").on("click", function() {
            self.deleteGraph(false);
        });
    };

    GraphCreator.prototype.setIdCt = function(idct) {
        this.idct = idct;
    };

    GraphCreator.prototype.consts =  {
        selectedClass: "selected",
        connectClass: "connect-node",
        circleGClass: "conceptG",
        graphClass: "graph",
        activeEditId: "active-editing",
        BACKSPACE_KEY: 8,
        DELETE_KEY: 46,
        ENTER_KEY: 13,
        nodeRadius: 50
    };

    /* PROTOTYPE FUNCTIONS */
    GraphCreator.prototype.dragmove = function(d) {
        var thisGraph = this;
        if (thisGraph.state.shiftNodeDrag) {
            thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
        } else{
            d.x += d3.event.dx;
            d.y +=  d3.event.dy;
            thisGraph.updateGraph();
            sidebar.update(d.id,thisGraph);
        }
    };

    GraphCreator.prototype.deleteGraph = function(skipPrompt) {
        var thisGraph = this,
                doDelete = true;
        if (!skipPrompt) {
            doDelete = window.confirm("Press OK to delete this graph");
        }
        if(doDelete) {
            thisGraph.nodes = [];
            thisGraph.edges = [];
            thisGraph.updateGraph();
        }
    };

    /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
    GraphCreator.prototype.selectElementContents = function(el) {
        var range = document.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    };


    /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
    GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
        var words = title.split(/\s+/g),
                nwords = words.length;
        var el = gEl.append("text")
                .attr("text-anchor","middle");
        el.attr("dx", 0).attr("dy", "5");

        for (var i = 0; i < words.length; i++) {
            var tspan = el.append('tspan').text(words[i]);
            if (i > 0)
                tspan.attr('x', 0).attr('dy', '15');
        }
    };


    // remove edges associated with a node
    GraphCreator.prototype.spliceLinksForNode = function (node) {
        var thisGraph = this;
        var toSplice = thisGraph.edges.filter(function (l) {
            return (l.source === node.id || l.target === node.id);
        });
        toSplice.map(function (l) {
            thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
        });
    };

    GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData) {
        var thisGraph = this;
        d3Path.classed(thisGraph.consts.selectedClass, true);
        if (thisGraph.state.selectedEdge) {
            thisGraph.removeSelectFromEdge();
        }
        thisGraph.state.selectedEdge = edgeData;
    };

    GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData) {
        var thisGraph = this;
        d3Node.classed(this.consts.selectedClass, true);
        if (thisGraph.state.selectedNode) {
            thisGraph.removeSelectFromNode();
        }
        thisGraph.state.selectedNode = nodeData;
    };

    GraphCreator.prototype.removeSelectFromNode = function() {
        var thisGraph = this;
        thisGraph.circles.filter(function(cd) {
            return cd.id === thisGraph.state.selectedNode.id;
        }).classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedNode = null;
    };

    GraphCreator.prototype.removeSelectFromEdge = function() {
        var thisGraph = this;
        thisGraph.paths.filter(function(cd) {
            return cd === thisGraph.state.selectedEdge;
        }).classed(thisGraph.consts.selectedClass, false);
        thisGraph.state.selectedEdge = null;
    };

    GraphCreator.prototype.pathMouseDown = function(d3path, d) {
        var thisGraph = this,
                state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownLink = d;

        if (state.selectedNode) {
            thisGraph.removeSelectFromNode();
        }

        var prevEdge = state.selectedEdge;
        if (!prevEdge || prevEdge !== d) {
            thisGraph.replaceSelectEdge(d3path, d);
        } else{
            thisGraph.removeSelectFromEdge();
        }
    };

    // mousedown on node
    GraphCreator.prototype.circleMouseDown = function(d3node, d) {
        var thisGraph = this,
                state = thisGraph.state;
        d3.event.stopPropagation();



        state.mouseDownNode = d;
        if (d3.event.shiftKey) {
            state.shiftNodeDrag = d3.event.shiftKey;
            // reposition dragged directed edge
            thisGraph.dragLine.classed('hidden', false)
                    .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
            return;
        }
        else {
            sidebar.update(d.id, thisGraph);
        }
    };

    /* place editable text on node in place of svg text */
    GraphCreator.prototype.changeTextOfNode = function(d3node, d) {
        var thisGraph= this,
                consts = thisGraph.consts,
                htmlEl = d3node.node();
        d3node.selectAll("text").remove();
        var nodeBCR = htmlEl.getBoundingClientRect(),
                curScale = nodeBCR.width/consts.nodeRadius,
                placePad  =  5*curScale,
                useHW = curScale > 1 ? nodeBCR.width*0.71 : consts.nodeRadius*1.42;
        // replace with editableconent text
        var d3txt = thisGraph.svg.selectAll("foreignObject")
                .data([d])
                .enter()
                .append("foreignObject")
                .attr("x", nodeBCR.left + placePad )
                .attr("y", nodeBCR.top + placePad)
                .attr("height", 2*useHW)
                .attr("width", useHW)
                .append("xhtml:p")
                .attr("id", consts.activeEditId)
                .attr("contentEditable", "true")
                .text(d.title)
                .on("mousedown", function(d) {
                    d3.event.stopPropagation();
                })
                .on("keydown", function(d) {
                    d3.event.stopPropagation();
                    if (d3.event.keyCode == consts.ENTER_KEY && !d3.event.shiftKey) {
                        this.blur();
                    }
                })
                .on("blur", function(d) {
                    d.title = this.textContent;
                    thisGraph.insertTitleLinebreaks(d3node, d.title);
                    d3.select(this.parentElement).remove();
                });
        return d3txt;
    };

    // mouseup on nodes
    GraphCreator.prototype.circleMouseUp = function(d3node, d) {
        var thisGraph = this,
                state = thisGraph.state,
                consts = thisGraph.consts;
        // reset the states
        state.shiftNodeDrag = false;
        d3node.classed(consts.connectClass, false);

        var mouseDownNode = state.mouseDownNode;

        if (!mouseDownNode) return;

        thisGraph.dragLine.classed("hidden", true);

        if (mouseDownNode !== d) {
            // we're in a different node: create new edge for mousedown edge and add to graph
            var newEdge = {source: mouseDownNode, target: d};
            var filtRes = thisGraph.paths.filter(function(d) {
                if (d.source === newEdge.target && d.target === newEdge.source) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
                }
                return d.source === newEdge.source && d.target === newEdge.target;
            });
            if (!filtRes[0].length) {
                thisGraph.edges.push(newEdge);
                thisGraph.updateGraph();
            }
        } else{
            // we're in the same node
            if (state.justDragged) {
                // dragged, not clicked
                state.justDragged = false;
            } else{
                // clicked, not dragged
                if (d3.event.shiftKey) {
                    // shift-clicked node: edit text content
                    var d3txt = thisGraph.changeTextOfNode(d3node, d);
                    var txtNode = d3txt.node();
                    thisGraph.selectElementContents(txtNode);
                    txtNode.focus();
                } else{
                    sidebar.update(d.id, thisGraph);
                    if (state.selectedEdge) {
                        thisGraph.removeSelectFromEdge();
                    }
                    var prevNode = state.selectedNode;

                    if (!prevNode || prevNode.id !== d.id) {
                        thisGraph.replaceSelectNode(d3node, d);
                    } else{
                        thisGraph.removeSelectFromNode();
                    }
                }
            }
        }
        state.mouseDownNode = null;
        return;

    }; // end of circles mouseup

    // mousedown on main svg
    GraphCreator.prototype.svgMouseDown = function() {
        this.state.graphMouseDown = true;
    };

    // mouseup on main svg
    GraphCreator.prototype.svgMouseUp = function() {
        var thisGraph = this,
                state = thisGraph.state;
        if (state.justScaleTransGraph) {
            // dragged not clicked
            state.justScaleTransGraph = false;
        } else if (state.graphMouseDown && d3.event.shiftKey) {
            // clicked not dragged from svg
            var xycoords = d3.mouse(thisGraph.svgG.node()),
                    d = {id: thisGraph.idct++, title: "new concept", x: xycoords[0], y: xycoords[1]};
            thisGraph.nodes.push(d);
            thisGraph.updateGraph();
            // make title of text immediently editable
            var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval) {
                        return dval.id === d.id;
                    }), d),
                    txtNode = d3txt.node();
            thisGraph.selectElementContents(txtNode);
            txtNode.focus();
        } else if (state.shiftNodeDrag) {
            // dragged from node
            state.shiftNodeDrag = false;
            thisGraph.dragLine.classed("hidden", true);
        }
        state.graphMouseDown = false;
    };

    // keydown on main svg
    GraphCreator.prototype.svgKeyDown = function() {
        var thisGraph = this,
                state = thisGraph.state,
                consts = thisGraph.consts;
        // make sure repeated key presses don't register for each keydown
        if(state.lastKeyDown !== -1) return;

        state.lastKeyDown = d3.event.keyCode;
        var selectedNode = state.selectedNode,
                selectedEdge = state.selectedEdge;

        switch(d3.event.keyCode) {
            case consts.BACKSPACE_KEY:
            case consts.DELETE_KEY:
                d3.event.preventDefault();
                if (selectedNode) {
                    thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
                    thisGraph.spliceLinksForNode(selectedNode);
                    state.selectedNode = null;
                    thisGraph.updateGraph();
                } else if (selectedEdge) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
                    state.selectedEdge = null;
                    thisGraph.updateGraph();
                }
                break;
        }
    };

    GraphCreator.prototype.svgKeyUp = function() {
        this.state.lastKeyDown = -1;
    };

    // call to propagate changes to graph
    GraphCreator.prototype.updateGraph = function() {

        var thisGraph = this,
                consts = thisGraph.consts,
                state = thisGraph.state;

        thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d) {
            return String(d.source) + "+" + String(d.target);
        });
        var paths = thisGraph.paths;
        // update existing paths
        paths.style('marker-end', 'url(#end-arrow)')
                .classed(consts.selectedClass, function(d) {
                    return d === state.selectedEdge;
                })
                .attr("d", function(d) {
                    return "M" + thisGraph.nodes[d.source].x + "," + thisGraph.nodes[d.source].y +
                        "L" + thisGraph.nodes[d.target].x + "," + thisGraph.nodes[d.target].y;
                });

        // add new paths
        paths.enter()
                .append("path")
                .style('marker-end','url(#end-arrow)')
                .classed("link", true)
                .attr("d", function (d) {
                    return "M" + thisGraph.nodes[d.source].x + "," + thisGraph.nodes[d.source].y +
                        "L" + thisGraph.nodes[d.target].x + "," + thisGraph.nodes[d.target].y;
                })
                .on("mousedown", function(d) {
                            thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
                        }
                )
                .on("mouseup", function(d) {
                    state.mouseDownLink = null;
                });

        // remove old links
        paths.exit().remove();

        // update existing nodes
        thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d) { return d.id;});
        thisGraph.circles.attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";});

        // add new nodes
        var newGs= thisGraph.circles.enter()
                .append("g");

        newGs.classed(consts.circleGClass, true)
                .attr("transform", function(d) {return "translate(" + d.x + "," + d.y + ")";})
                .on("mouseover", function(d) {
                    if (state.shiftNodeDrag) {
                        d3.select(this).classed(consts.connectClass, true);
                    }
                })
                .on("mouseout", function(d) {
                    d3.select(this).classed(consts.connectClass, false);
                })
                .on("mousedown", function(d) {
                    thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
                })
                .on("mouseup", function(d) {
                    thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
                })
                .call(thisGraph.drag);

        newGs.append("circle")
                .attr("r", String(consts.nodeRadius));

        newGs.each(function(d) {
            thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
        });

        // remove old nodes
        thisGraph.circles.exit().remove();
    };

    GraphCreator.prototype.updateWindow = function(svg) {
        var docEl = document.documentElement,
                bodyEl = document.getElementsByTagName('body')[0];
        var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
        var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
        svg.attr("width", x).attr("height", y);
    };

    var SideBar = function () {
        var self = this;

        this.currentDotIndex = 0;

        this.update = function (index, graph) {
            var d = graph.nodes[index - 1];
            if (d != undefined) {
                $('#status-posx').html(Math.round(d.x));
                $('#status-posy').html(Math.round(d.y));
                $('#status-uid').html(Math.round(d.id));
                $('#status-main-uid').html('Node ' + Math.round(d.id));
                $('#status-type').html(Math.round(d.type));
                $('#side-info-node').show();
                $('#side-info-link').show();
                $('#side-info-remove').show();
            } else {
                $('#status-posx').html('-');
                $('#status-posy').html('-');
                $('#status-uid').html('-');
                $('#status-main-uid').html('-');
                $('#status-type').html('-');
                $('#side-info-node').hide();
                $('#side-info-link').hide();
                $('#side-info-remove').hide();
            }
            self.currentDotIndex = index;
        };

        this.center = function (index, graph) {
            var x = $("#body").width() / 2 - graph.nodes[index].x;
            var y = $("#body").height() / 2 - graph.nodes[index].y;
            d3.select("." + graph.consts.graphClass)
                .transition()
                .duration(400)
                .attr("transform", function (d) {
                    return "translate(" + x + ", " + y + ") scale(" + 1 + ")";
                });
            graph.zoomHandler.translate([x, y]).scale(1);
        };

        $('#side-head-top-button-h').click(function () {
            $('#side-wrapper > div').animate({ left: 0 }, 100, "easeOutQuad");
        });

        $('#side-head-close-button').click(function () {
            var width = $('#side-head').width();
            $('#side-wrapper > div').animate({ left: -1.05 * width }, 100, "easeInQuad");
        });

        $('#side-head-top-button-n').click(function () {
            if (graph.nodes.length >= 0) {
                var index = self.currentDotIndex;
                do {
                    index = (index + 1) % graph.nodes.length;
                    if (index == self.currentDotIndex) {
                        return;
                    }
                } while (graph.nodes[index] == undefined);
                self.update(index, graph);
                self.center(index, graph);
            }
        });

        $('#side-head-top-button-p').click(function () {
            if (graph.nodes.length >= 0) {
                var index = self.currentDotIndex;
                do {
                    index = (index + graph.nodes.length - 1) % graph.nodes.length;
                    if (index == self.currentDotIndex) {
                        return;
                    }
                } while (graph.nodes[index] == undefined);
                self.update(index, graph);
                self.center(index, graph);
            }
        });
    };


    /**** MAIN ****/

    // warn the user when leaving
    window.onbeforeunload = function() {
        return "Make sure to save your graph locally before leaving :-)";
    };

    var docEl = document.documentElement,
            bodyEl = document.getElementsByTagName('body')[0];

    var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
            height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;

    var xLoc = width/2 - 25,
            yLoc = 100;

    // initial node data
    var nodes = [
        {"id":1  ,"type":3, "u_name":"gene1","title":"gene1", "x":1400,  "y":500},
        {"id":2  ,"type":2, "u_name":"gRNA2","title":"gRNA2", "x":200,  "y":100},
        {"id":3  ,"type":2, "u_name":"gRNA1","title":"gRNA1", "x":800,  "y":300},
        {"id":5  ,"type":3, "u_name":"gene3","title":"gene3", "x":800,  "y":100},
        {"id":6  ,"type":3, "u_name":"gene2","title":"gene2", "x":1400,  "y":800},
        {"id":7  ,"type":3, "u_name":"gRNA3","title":"gRNA3", "x":1800,  "y":800},
        {"id":8  ,"type":2, "u_name":"DNA2", "title":"DNA2",  "x":900,  "y":400},
        {"id":9  ,"type":3, "u_name":"DNA1", "title":"DNA1",  "x":500,  "y":400},
        {"id":10 ,"type":1, "u_name":"DNA3", "title":"DNA3",  "x":1000,  "y":900},
        {"id":11 ,"type":1, "u_name":"DNA4", "title":"DNA4",  "x":1600,  "y":1000},
        {"id":12 ,"type":4, "u_name":"DNA4", "title":"DNA4",  "x":1600,  "y":100},
        {"id":15 ,"type":4, "u_name":"DNA4", "title":"DNA4",  "x":2000,  "y":1000}
    ];

    var edges = [
        {"source": 1, "target": 8, "weight": 1},
        {"source": 3, "target": 8, "weight": 1},
        {"source": 9, "target": 8, "weight": 1}
    ];

    /** MAIN SVG **/
    var svg = d3.selectAll("#body").append("svg")
            .attr("width", width)
            .attr("id","main_window")
            .attr("height", height);
    var graph = new GraphCreator(svg, nodes, edges);
    graph.setIdCt(14);
    graph.updateGraph();

    var sidebar = new SideBar();

//generate png
    //TODO:  需要把图片平移缩放之后再生成png
     kick_ass = function(){
         var canvas = document.getElementById("canvas");
         var png='';
         var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
         var ctx = canvas.getContext("2d");
         var DOMURL = self.URL || self.webkitURL || self;
         var img = new Image();
         var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
         var url = DOMURL.createObjectURL(svg);
         img.onload = function() {
             ctx.drawImage(img, 0, 0);
             png = canvas.toDataURL("image/png");
             document.querySelector('#png-container').innerHTML = '<img src="'+png+'"/>';
             DOMURL.revokeObjectURL(png);
             // console.log(png);

         };
         img.src = url;
    };


    function postdata(){
        var nodeData = JSON.stringify(nodes);
        var edgeData = JSON.stringify(edges);
        var dictPost  =  [{"plugin":"pano"},{"action":"update_data"},{"node-data":nodeData},{"edge-data":edges}];
        console.log(dictPost);
        $.ajax({
            type: "POST",
            url: "/plugin",
            data: JSON.stringify(dictPost),
            success: function(response){
                console.log(response);
                if(response['error'] == 'a1'){
                    Materialize.toast('sth wrong Error', 3000, 'rounded');
                }
            },
            dataType: "json",
            contentType : "application/json"
        });
    }

})(window.d3, window.saveAs, window.Blob);
