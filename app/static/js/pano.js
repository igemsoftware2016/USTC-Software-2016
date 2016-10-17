document.onload = (function ($, d3, saveAs, Blob, undefined) {
    "use strict";

    // define graphcreator object
    var GraphCreator = function (svg, nodes, edges) {
        var self = this;
        self.nextId = 0;

        self.nodes = [];
        nodes.forEach(function (n) {
            self.nodes[n.id] = n;
        });

        self.edges = edges || [];

        self.state = {
            selectedNode: null,
            selectedEdge: null,
            mouseDownNode: null,
            justDragged: false,
            lastKeyDown: -1,
            shiftNodeDrag: false,
            selectedText: null,
            tryReconnect: false,
            lockKeyEvent: false,
            currentLinkSource: null
        };

        self.svg = svg;

        self.defs = svg.append('svg:defs');
        self.defs.append('svg:marker')
            .attr('id', 'end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', "32")
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        // define arrow markers for leading arrow
        self.defs.append('svg:marker')
            .attr('id', 'mark-end-arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 7)
            .attr('markerWidth', 3.5)
            .attr('markerHeight', 3.5)
            .attr('orient', 'auto')
            .append('svg:path')
            .attr('d', 'M0,-5L10,0L0,5');

        self.svgGraph = svg.append("g")
            .classed(self.consts.graphClass, true);

        // displayed when dragging between nodes
        self.dragLine = self.svgGraph.append('svg:path')
            .attr('class', 'link dragline hidden')
            .attr('d', 'M0,0L0,0')
            .style('marker-end', 'url(#mark-end-arrow)');

        // svg nodes and edges
        self.paths = self.svgGraph.append("g").selectAll("g");
        self.circles = self.svgGraph.append("g").selectAll("g");

        self.forceDragged = null;

        self.dragHandler = d3.behavior.drag().origin(function (d) {
            return {x: d.x, y: d.y};
        }).on("drag", function (d) {
            self.state.justDragged = true;
            if (self.state.shiftNodeDrag) {
                var position = d3.mouse(self.svgGraph.node());
                self.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + position[0] + ',' + position[1]);
            } else {
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                if (!self.forceDragged) {
                    self.forceNodes.forEach(function (i) {
                        if (i.id == d.id) {
                            self.forceDragged = i;
                        }
                    });
                }
                self.forceDragged.px += d.x - self.forceDragged.x;
                self.forceDragged.py += d.y - self.forceDragged.y;
                self.forceDragged.x = d.x;
                self.forceDragged.y = d.y;
                self.updateGraph();
            }
        }).on("dragend", function () {
            if (self.state.selectedNode) {
                sidebar.update(self.state.selectedNode.id);
            }
            self.forceDragged = null;
            self.trySave();
        });

        self.zoomHandler = d3.behavior.zoom().on("zoom", function () {
            if (d3.event.sourceEvent.shiftKey) {
                return false;
            } else {
                d3.select("." + self.consts.graphClass)
                    .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")");
                return true;
            }
        }).on("zoomstart", function () {
            var ael = d3.select("#" + self.consts.activeEditId).node();
            if (ael) {
                ael.blur();
            }
            if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
        }).on("zoomend", function () {
            d3.select('body').style("cursor", "auto");
        });

        self.forceNodes = [];
        self.forceEdges = [];

        self.forceHandler = d3.layout.force()
            .size([self.svg.attr('width') * 2, self.svg.attr('height') * 2])
            .charge(function (node) {
                return -300;
            })
            .linkDistance(200)
            .gravity(0.08)
            .friction(0.8)
            .on("tick", function () {
                self.forceNodes.forEach(function (i) {
                    self.nodes[i.id].x = i.x;
                    self.nodes[i.id].y = i.y;
                });
                self.updateGraph();
            })
            .on("end", function () {
                self.trySave();
            });

        // listen for key events
        d3.select(document).on("keydown", function () {
            if (self.state.lockKeyEvent || self.state.lastKeyDown !== -1) return;

            self.state.lastKeyDown = d3.event.keyCode;

            switch (d3.event.keyCode) {
            case self.consts.BACKSPACE_KEY:
            case self.consts.DELETE_KEY:
                d3.event.preventDefault();
                var oldNode = self.state.selectedNode;
                self.delSelectedEdge();
                self.delSelectedNode();
                if (oldNode) {
                    if (graph.nodes.length > 0) {
                        var index = oldNode.id;
                        do {
                            index = (index + 1) % graph.nodes.length;
                        } while (index != oldNode.id && graph.nodes[index] == undefined);
                        graph.setSelectedNode(graph.nodes[index]);
                        graph.centerSelectedNode();
                        sidebar.update(index);
                    } else {
                        graph.setSelectedNode(graph.nodes[graph.nodes.length]);
                        sidebar.update(graph.nodes.length);
                    }
                }
            }
        }).on("keyup", function () {
            self.state.lastKeyDown = -1;
        });

        // listen for mouse events
        svg.on("mousedown", function (d) {
            self.state.graphMouseDown = true;
        }).on("mouseup", function (d) {
            if (self.state.graphMouseDown && d3.event.shiftKey) {
                // clicked not dragged from svg
                var xycoords = d3.mouse(self.svgGraph.node());
                var pre = self.state.selectedNode;
                self.createNodeAndSelect({tax_id: "", gene_id: "", name: "", info: "", title: "", x: xycoords[0], y: xycoords[1]});
                var d = self.state.selectedNode;
                // make title of text immediently editable
                var circles = self.circles.filter(function (dval) {
                    return dval.id === d.id;
                });
                sidebar.editNodeInfo(self.nodes[d.id], function (node) {
                    if (!node) {
                        graph.delSelectedNode();
                        graph.setSelectedNode(pre);
                        sidebar.update(!pre ? graph.nodes.length : pre.id);
                    } else {
                        circles.select('text').remove();
                        graph.setCircleTitle(circles, node.title);
                        sidebar.update(d.id);
                        graph.trySave();
                    }
                });
            } else if (self.state.shiftNodeDrag) {
                // dragged from node
                self.state.shiftNodeDrag = false;
                self.dragLine.classed("hidden", true);
            }
            self.state.graphMouseDown = false;
        });

        // listen for dragging
        svg.call(self.zoomHandler).on("dblclick.zoom", null);

        // listen for resize
        var resizeOld = window.onresize || function () {};
        window.onresize = function () {
            var docEl = document.documentElement, bodyEl = document.body;
            var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
            var y = window.innerHeight || docEl.clientHeight || bodyEl.clientHeight;
            svg.attr("width", x).attr("height", y);
            resizeOld.apply(this, arguments);
        };

        // update
        self.updateGraph();

        for (var i in nodes) {
            if (nodes[i] != undefined) {
                self.setSelectedNode(nodes[i]);
                break;
            }
        }
    };

    GraphCreator.prototype.consts = {
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

    GraphCreator.prototype.deleteGraph = function () {
        this.nodes = [];
        this.edges = [];
        sidebar.update(0);
        this.updateGraph();
        this.trySave();
    };

    /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
    GraphCreator.prototype.setCircleTitle = function (gEl, title) {
        var words = title.split(/\s+/g);
        var el = gEl.append("text").attr("text-anchor", "middle");
        el.attr("dx", 0).attr("dy", "5");
        for (var i in words) {
            el.append('tspan').text(words[i]).attr('x', 0).attr('dy', function () {
                return $(el.node()).height() / 2;
            });
        }
    };

    GraphCreator.prototype.createNodeAndSelect = function (nodeData) {
        while (this.nodes[this.nextId] != undefined) {
            this.nextId += 1;
        }
        this.nodes[this.nextId] = {
            "id": this.nextId,
            "type": nodeData.type,
            "tax_id": nodeData.tax_id,
            "gene_id": nodeData.gene_id,
            "name": nodeData.name,
            "info": nodeData.info,
            "title": nodeData.title,
            "x": nodeData.x,
            "y": nodeData.y
        };
        this.updateGraph();
        this.trySave();
        this.setSelectedNode(this.nodes[this.nextId]);
    };

    GraphCreator.prototype.centerSelectedNode = function (duration, callback) {
        duration = duration || 500;
        callback = callback || function () {};
        var thisGraph = this;
        if (thisGraph.state.selectedNode) {
            var svgWrapper = $("#body");
            var x = svgWrapper.width() / 2 - thisGraph.state.selectedNode.x;
            var y = svgWrapper.height() / 2 - thisGraph.state.selectedNode.y;
            d3.select("." + thisGraph.consts.graphClass)
                .transition()
                .duration(duration)
                .attr("transform", function () {
                    return "translate(" + x + ", " + y + ") scale(" + 1 + ")";
                })
                .each("end", function () {
                    callback(thisGraph.state.selectedNode);
                });
            this.zoomHandler.translate([x, y]).scale(1);
        }
    };

    GraphCreator.prototype.setSelectedEdge = function (edgeData) {
        var thisGraph = this, oldEdge = thisGraph.state.selectedEdge, className = thisGraph.consts.selectedClass;
        if (oldEdge !== edgeData) {
            if (oldEdge) {
                thisGraph.paths.filter(function (ed) {
                    return ed === oldEdge;
                }).classed(className, false);
            }
            thisGraph.state.selectedEdge = edgeData;
            if (edgeData) {
                thisGraph.paths.filter(function (ed) {
                    return ed === edgeData;
                }).classed(className, true);
            }
        }
    };

    GraphCreator.prototype.setSelectedNode = function (nodeData) {
        var thisGraph = this, oldNode = thisGraph.state.selectedNode, className = thisGraph.consts.selectedClass;
        if (oldNode !== nodeData) {
            if (oldNode) {
                thisGraph.circles.filter(function (ed) {
                    return ed === oldNode;
                }).classed(className, false);
            }
            thisGraph.state.selectedNode = nodeData;
            if (nodeData) {
                thisGraph.circles.filter(function (ed) {
                    return ed === nodeData;
                }).classed(className, true);
            }
        }
    };

    GraphCreator.prototype.delSelectedEdge = function () {
        var selectedEdge = this.state.selectedEdge;
        if (selectedEdge) {
            this.edges.splice(this.edges.indexOf(selectedEdge), 1);
            this.state.selectedEdge = null;
            this.updateGraph();
            this.trySave();
        }
    };

    GraphCreator.prototype.delSelectedNode = function () {
        var selectedNode = this.state.selectedNode;
        if (selectedNode) {
            this.nodes[selectedNode.id] = undefined;
            this.edges = this.edges.filter(function (l) {
                return l.source != selectedNode.id && l.target != selectedNode.id;
            });
            this.state.selectedNode = null;
            if (selectedNode.id < this.nextId) {
                this.nextId = selectedNode.id;
            }
            this.updateGraph();
            this.trySave();
        }
    };

    GraphCreator.prototype.pathMouseDown = function (d3path, d) {
        var thisGraph = this, state = thisGraph.state;
        d3.event.stopPropagation();

        thisGraph.setSelectedNode(null);
        thisGraph.setSelectedEdge(d);
    };

    // mousedown on node
    GraphCreator.prototype.circleMouseDown = function (d3node, d) {
        var thisGraph = this, state = thisGraph.state;
        d3.event.stopPropagation();
        state.mouseDownNode = d;
        if (d3.event.shiftKey) {
            state.shiftNodeDrag = d3.event.shiftKey;
            // reposition dragged directed edge
            thisGraph.dragLine.classed('hidden', false).attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
        }
    };

    // mouseup on nodes
    GraphCreator.prototype.circleMouseUp = function (d3node, d) {
        var thisGraph = this,
            state = thisGraph.state,
            consts = thisGraph.consts;
        // reset the states
        state.shiftNodeDrag = false;
        d3node.classed(consts.connectClass, false);

        var mouseDownNode = state.currentLinkSource || state.mouseDownNode;

        if (state.currentLinkSource) {
            state.currentLinkSource = null;
        }

        if (!mouseDownNode) return;

        thisGraph.dragLine.classed("hidden", true);

        $('#side-link-to').removeClass('active');

        if ($('#side-path-finder').hasClass('active')) {
            $('#side-path-finder').removeClass('active');
            graph.state.lockKeyEvent = true;
            var nodeDict, paths;
            $('#modal-path-finder').openModal({
                dismissible: true,
                in_duration: 0,
                out_duration: 0,
                ready: function () {
                    nodeDict = [], paths = [];
                    $('#path-finder-main').hide();
                    $('#path-finder-result').empty().hide();
                    $('#path-finder-progress').show();
                    $('#path-finder-k').val('5');
                    $('#path-finder-maxlen').val('10');
                    $('#path-finder-start').click(function () {
                        var k = Number($('#path-finder-k').val());
                        var maxlen = Number($('#path-finder-maxlen').val());
                        $('#path-finder-main').show();
                        sidebar.pathFinder({
                            s: mouseDownNode['gene_id'],
                            t: d['gene_id'],
                            k: isNaN(k) ? 5 : k,
                            maxlen: isNaN(maxlen)? 10 : maxlen
                        }, function (nodes, p) {
                            paths = p;
                            nodes.forEach(function (i) {
                                nodeDict[i['gene_id']] = i;
                            });
                            var root = $('#path-finder-result').empty().hide();
                            for (var i in paths) {
                                var path = paths[i];
                                var nodeList = $('<div class="collection"></div>');
                                path.forEach(function (id) {
                                    var i = nodeDict[id];
                                    nodeList.append($('<div class="collection-item grey lighten-5 truncate"></div>')
                                        .append($('<span></span>').text('Tax ID: ' + i['tax_id'] + '\t' + 'Gene ID: ' + i['gene_id']))
                                        .append($('<br>'))
                                        .append($('<span></span>').text(i['name'] + ' '))
                                        .append($('<span class="grey-text"></span>').text(i['info'])));
                                });
                                root.append($('<li></li>').append($('<div class="collapsible-header truncate"></div>')
                                    .append($('<span></span>').text('Path ' + i + ' ' + path.map(function (i) {
                                            return nodeDict[i].name;
                                        }).reduce(function (i, j) {
                                            return i + ' -> ' + j;
                                        })))
                                    .append($('<i class="material-icons tiny right">clear</i>').click(function () {
                                        $(this).parent().parent().remove();
                                        paths.splice(i, 1);
                                    })))
                                    .append($('<div class="collapsible-body"></div>').append(nodeList)))
                                    .show();
                            }
                            $('#path-finder-progress').hide();
                        });
                    });
                },
                complete: function () {
                    graph.state.lockKeyEvent = false;
                    paths.forEach(function (path) {
                        var previous = mouseDownNode;
                        for (var i = 1; i < path.length; ++i) {
                            var node = nodeDict[path[i]];
                            if (i + 1 < path.length) {
                                graph.createNodeAndSelect({
                                    tax_id: node.tax_id,
                                    gene_id: node.gene_id,
                                    name: node.name,
                                    info: node.info,
                                    title: node.name,
                                    x: previous.x + 100 * Math.random() + 100,
                                    y: previous.y + 100 * Math.random() + 100
                                });
                            } else {
                                graph.setSelectedNode(graph.nodes[d.id]);
                            }
                            var newEdge = {source: previous.id, target: graph.state.selectedNode.id};
                            thisGraph.edges.push(newEdge);
                            thisGraph.updateGraph();
                            previous = graph.state.selectedNode;
                        }
                    });
                    sidebar.update(mouseDownNode.id);
                    thisGraph.setSelectedNode(graph.nodes[mouseDownNode.id]);
                    thisGraph.trySave();
                }
            });
            return;
        }


        if (mouseDownNode !== d) {
            // we're in a different node: create new edge for mousedown edge and add to graph
            var newEdge = {source: mouseDownNode.id, target: d.id};
            var filtRes = thisGraph.paths.filter(function (d) {
                if (d.source === newEdge.target && d.target === newEdge.source) {
                    thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
                }
                return d.source === newEdge.source && d.target === newEdge.target;
            });
            if (!filtRes[0].length) {
                thisGraph.edges.push(newEdge);
                thisGraph.setSelectedNode(graph.nodes[mouseDownNode.id]);
                thisGraph.updateGraph();
                thisGraph.trySave();
                sidebar.update(mouseDownNode.id);
            }
        } else {
            // we're in the same node
            if (state.justDragged) {
                // dragged, not clicked
                state.justDragged = false;
            } else {
                // clicked, not dragged
                if (d3.event.shiftKey) {
                    var circles = thisGraph.circles.filter(function (dval) {
                        return dval.id === d.id;
                    });
                    sidebar.editNodeInfo(graph.nodes[d.id], function (node) {
                        if (!node) {
                            graph.setSelectedNode(d);
                            sidebar.update(d.id);
                        } else {
                            circles.select('text').remove();
                            graph.setCircleTitle(circles, node.title);
                            sidebar.update(d.id);
                            graph.trySave();
                        }
                    });
                } else {
                    sidebar.update(d.id);
                    if (state.selectedEdge) {
                        thisGraph.setSelectedEdge(null);
                    }
                    thisGraph.setSelectedNode(d);
                    thisGraph.centerSelectedNode(250);
                }
            }
        }
        state.mouseDownNode = null;
    }

    // call to propagate changes to graph
    GraphCreator.prototype.updateGraph = function () {
        var thisGraph = this, consts = thisGraph.consts, state = thisGraph.state;

        var paths = thisGraph.paths.data(thisGraph.edges, function (d) {
            return String(d.source) + "&" + String(d.target);
        });

        var forceNodeDict = {};

        thisGraph.forceNodes.splice(0, thisGraph.forceNodes.length).forEach(function (i) {
            forceNodeDict[i.id] = i;
        });

        function generateForceData(id) {
            var i = thisGraph.nodes[id], node = thisGraph.state.selectedNode;
            var result = forceNodeDict[id] || {id: i.id, x: i.x, y: i.y};
            result.fixed = node && node.id == i.id;
            forceNodeDict[id] = result;
            return result;
        }

        thisGraph.nodes.forEach(function (i) {
            if (i != undefined) {
                thisGraph.forceNodes.push(generateForceData(i.id));
            }
        });

        thisGraph.forceEdges = thisGraph.edges.map(function (i) {
            return {source: forceNodeDict[i.source], target: forceNodeDict[i.target]};
        });

        thisGraph.forceHandler.links(thisGraph.forceEdges);
        thisGraph.forceHandler.start();

        paths.style('marker-end', 'url(#end-arrow)')
            .classed(consts.selectedClass, function (d) {
                return d === state.selectedEdge;
            })
            .attr("d", function (d) {
                return "M" + thisGraph.nodes[d.source].x + "," + thisGraph.nodes[d.source].y +
                    "L" + thisGraph.nodes[d.target].x + "," + thisGraph.nodes[d.target].y;
            });

        paths.enter().append("path")
            .style('marker-end', 'url(#end-arrow)')
            .classed("link", true)
            .attr("d", function (d) {
                return "M" + thisGraph.nodes[d.source].x + "," + thisGraph.nodes[d.source].y +
                    "L" + thisGraph.nodes[d.target].x + "," + thisGraph.nodes[d.target].y;
            })
            .on("mousedown", function (d) {
                thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
            });

        paths.exit().remove();

        // update existing nodes
        var circles = thisGraph.circles.data(thisGraph.nodes.filter(function (n) {
            return n != undefined;
        }), function (d) {
            return d.id;
        });

        circles.attr("transform", function (d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        circles.enter()
            .append("g")
            .classed(consts.circleGClass, true)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
            .on("mouseover", function (d) {
                if (state.shiftNodeDrag) {
                    d3.select(this).classed(consts.connectClass, true);
                }
                if (state.currentLinkSource) {
                    thisGraph.dragLine.classed('hidden', false).attr('d', 'M' +
                        state.currentLinkSource.x + ',' +
                        state.currentLinkSource.y + 'L' +
                        d.x + ',' + d.y);
                }
            })
            .on("mouseout", function (d) {
                d3.select(this).classed(consts.connectClass, false);
                if (state.currentLinkSource) {
                    thisGraph.dragLine.classed('hidden', true);
                }
            })
            .on("mousedown", function (d) {
                thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
            })
            .on("mouseup", function (d) {
                thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
            })
            .call(thisGraph.dragHandler)
            .each(function (d) {
                d3.select(this).append("circle").attr("r", String(consts.nodeRadius));
                thisGraph.setCircleTitle(d3.select(this), d.title);
            });

        circles.exit().remove();

        thisGraph.paths = paths;
        thisGraph.circles = circles;

    };

    GraphCreator.prototype.trySave = function () {
        var thisGraph = this;
        save(thisGraph, function (success) {
            if (!success && !thisGraph.state.tryReconnect) {
                thisGraph.state.tryReconnect = true;
                Materialize.toast('Cannot connect to server, try reconnecting...  ', 3000, 'rounded', function () {
                    setTimeout(function () {
                        thisGraph.state.tryReconnect = false;
                        thisGraph.trySave();
                    }, 12000);
                });
            }
        });
    };

    var SideBar = function () {
        var self = this;

        this.currentDotIndex = 0;

        this.update = function (index) {
            var d = graph.nodes[index];
            if (d != undefined) {
                $('#side-link-list').empty().hide();
                graph.edges.forEach(function (edge) {
                    if (edge.source == d.id) {
                        var a = $('<a href="#!" class="collection-item valign-wrapper"></a>')
                            .css('padding', '10px 20px')
                            .css('font-weight', 'normal')
                            .append($('<img src="img/link_from.svg" class="tiny left valign">')
                                .css('padding-top', '6px')
                                .css('margin-right', '15px'))
                            .append($('<i class="material-icons tiny right valign">clear</i>')
                                .css('padding-top', '6px')
                                .click(function (event) {
                                    graph.delSelectedEdge();
                                    event.stopPropagation();
                                    $(this).parent().remove();
                                    if ($('#side-link-list').children().length <= 0) {
                                        $('#side-link-list').hide();
                                    }
                                }))
                            .append($('<span class="valign"></span>')
                                .text(graph.nodes[edge.target].title)
                                .css('padding-top', '3px'))
                            .click(function () {
                                var toNode = graph.nodes[edge.target];
                                graph.setSelectedNode(toNode);
                                graph.centerSelectedNode();
                                sidebar.update(edge.target);
                            })
                            .hover(function () {
                                graph.setSelectedEdge(edge);
                            }, function () {
                                graph.setSelectedEdge(null);
                            });
                        $('#side-link-list').append(a);
                        $('#side-link-list').show();
                    }
                    if (edge.target == d.id) {
                        var a = $('<a href="#!" class="collection-item valign-wrapper"></a>')
                            .css('padding', '10px 20px')
                            .css('font-weight', 'normal')
                            .append($('<img src="img/link_to.svg" class="tiny left valign">')
                                .css('padding-top', '6px')
                                .css('margin-right', '15px'))
                            .append($('<i class="material-icons tiny right valign">clear</i>')
                                .css('padding-top', '6px')
                                .click(function (event) {
                                    graph.delSelectedEdge();
                                    event.stopPropagation();
                                    $(this).parent().remove();
                                    if ($('#side-link-list').children().length <= 0) {
                                        $('#side-link-list').hide();
                                    }
                                }))
                            .append($('<span class="valign"></span>')
                                .text(graph.nodes[edge.source].title)
                                .css('padding-top', '3px'))
                            .click(function () {
                                var toNode = graph.nodes[edge.source];
                                graph.setSelectedNode(toNode);
                                graph.centerSelectedNode();
                                sidebar.update(edge.source);
                            })
                            .hover(function () {
                                graph.setSelectedEdge(edge);
                            }, function () {
                                graph.setSelectedEdge(null);
                            });
                        $('#side-link-list').append(a);
                        $('#side-link-list').show();
                    }
                });
                $('#side-link-wrap').show();
                $('#status-posx').text(Math.round(d.x));
                $('#status-posy').text(Math.round(d.y));
                $('#status-uid').text(Math.round(d.id));
                $('#status-main-uid').text(d.title);
                $('#side-info-node-info').text(d.info);
                $('#side-info-tax-id').text(d.tax_id);
                $('#side-info-gene-id').text(d.gene_id);
                $('#side-info-gene-name').text(d.name);
                $('#side-info-node').show();
                $('#side-info-link').show();
                $('#side-info-add-none').hide();
                $('#side-info-add').show();
                $('#side-info-edit').show();
                $('#side-info-remove').show();
            } else {
                $('#side-link-wrap').hide();
                $('#status-posx').text('-');
                $('#status-posy').text('-');
                $('#status-uid').text('-');
                $('#status-main-uid').text('-');
                $('#side-info-tax-id').text('-');
                $('#side-info-gene-id').text('-');
                $('#side-info-gene-name').text('-');
                $('#side-info-node').hide();
                $('#side-info-link').hide();
                $('#side-info-add-none').show();
                $('#side-info-add').hide();
                $('#side-info-edit').hide();
                $('#side-info-remove').hide();
            }
            self.currentDotIndex = index;
        };

        this.pathFinder = function (req, callback) {
            callback = callback || function () {};
            var source = req['s'], target = req['t'];
            callback([
                {
                    tax_id: '10001', // 节点的Tax id
                    gene_id: source, // 节点的Gene id
                    name: 'ZGDX', // 节点的名称
                    info: 'Infomation of ZGDX: blablablablablablablablablablablablablablablabla'
                },
                {
                    tax_id: '10010', // 节点的Tax id
                    gene_id: '10010', // 节点的Gene id
                    name: 'ZGLT', // 节点的名称
                    info: 'Infomation of ZGLT: blablablablablablablablablablablablablablablabla'
                },
                {
                    tax_id: '10010',
                    gene_id: '1001010',
                    name: 'ZGLTZGLT',
                    info: 'Infomation of ZGLTZGLT: blablablablablablablablablablablablablablablabla'
                },
                {
                    tax_id: '10010',
                    gene_id: '100101010',
                    name: 'ZGLTZGLTZGLT',
                    info: 'Infomation of ZGLTZGLTZGLT: blablablablablablablablablablablablablablablabla'
                },
                {
                    tax_id: '10086',
                    gene_id: target,
                    name: 'ZGYD',
                    info: 'Infomation of ZGYD: blablablablablablablablablablablablablablablabla'
                }
            ], [
                [source, '10010', '1001010', target],
                [source, '10010', '100101010', target]
            ]); // TODO
        }

        this.lookup = function (str, callback) {
            callback = callback || function () {};
            if (str == '') {
                callback([]);
            } else {
                $.post("/plugin/", {
                    plugin: "pano",
                    action: "match_node",
                    s: str
                }).done(function (matches) {
                    var json = JSON.parse(matches);
                    if (json.success) {
                        callback(json.nodes);
                    } else {
                        callback([]);
                    }
                }).fail(function () {
                    callback([]);
                });
            }
        }

        self.currentTaxId = "";
        self.currentGeneId = "";
        self.currentInfo = "";

        this.editNodeInfo = function (node, callback) {
            callback = callback || function () {};
            $('#modal-add-node input#add-node-title').val(node['title']);
            $('#modal-add-node input#add-node-name').val(node['name']).trigger('input');
            graph.forceHandler.stop();
            self.currentTaxId = node['tax_id'];
            self.currentGeneId = node['gene_id'];
            self.currentInfo = node['info'];
            graph.state.lockKeyEvent = true;
            $('#modal-add-node').openModal({
                dismissible: true,
                in_duration: 0,
                out_duration: 0,
                ready: function () {
                    $('#modal-add-node input#add-node-name').trigger('input');
                    if (node['name'] != '') {
                        $('#add-node-ok').removeAttr('disabled').removeClass('disabled');
                    }
                },
                complete: function () {
                    graph.state.lockKeyEvent = false;
                    graph.forceHandler.start();
                    if ($('#add-node-ok').attr('disabled') == 'disabled') {
                        callback(null);
                    } else {
                        node['tax_id'] = self.currentTaxId;
                        node['gene_id'] = self.currentGeneId;
                        node['info'] = self.currentInfo;
                        node['name'] = $('#add-node-name').val();
                        var newTitle = $('#add-node-title').val();
                        if (newTitle != '') {
                            node['title'] = newTitle;
                        } else {
                            node['title'] = node['name'];
                        }
                        callback(node);
                    }
                }
            });
        };

        $('#add-node-name').on('input', function () {
            var nameInput = $(this), lookup = nameInput.val();
            var collections = $('#add-node-matches').empty().hide();
            $('#add-node-ok').addClass('disabled').attr('disabled', 'disabled');
            $('#add-node-progress').show();
            self.lookup(nameInput.val(), function callback(names) {
                if (lookup == nameInput.val()) {
                    names.forEach(function (i) {
                        var nodeName = i['name'];
                        collections.append($('<a class="collection-item truncate"></a>')
                            .append($('<span></span>').text('Tax ID: ' + i['tax_id'] + '\t' + 'Gene ID: ' + i['gene_id']))
                            .append($('<br>'))
                            .append($('<span></span>').text(nodeName + ' '))
                            .append($('<span class="grey-text"></span>').text(i['info']))
                            .click(function () {
                                var html = $(this).html();
                                nameInput.val(nodeName);
                                self.currentTaxId = i['tax_id'];
                                self.currentGeneId = i['gene_id'];
                                self.currentInfo = i['info'];
                                $('#add-node-ok').removeAttr('disabled').removeClass('disabled');
                                collections.children('a').each(function () {
                                    var node = $(this);
                                    if (node.html() == html) {
                                        node.addClass('active');
                                        node.children('.grey-text').addClass('white-text');
                                    } else {
                                        node.removeClass('active');
                                        node.children('.grey-text').removeClass('white-text');
                                    }
                                })
                            })
                        ).show();
                    });
                    $('#add-node-progress').hide();
                }
            });
        });

        $('#add-node-ok').click(function (e) {
            if ($(this).attr('disabled') == 'disabled') {
                e.stopImmediatePropagation();
            }
        });

        $('#side-head-top-button-h').click(function () {
            $('#side-wrapper > div').animate({left: 0}, 100, "easeOutQuad");
        });

        $('#side-head-close-button').click(function () {
            var width = $('#side-head').width();
            $('#side-wrapper > div').animate({left: -1.05 * width}, 100, "easeInQuad");
        });

        $('#side-head-top-button-n').click(function () {
            if (graph.nodes.length > 0) {
                var index = self.currentDotIndex;
                do {
                    index = (index + 1) % graph.nodes.length;
                    if (index == self.currentDotIndex) {
                        return;
                    }
                } while (graph.nodes[index] == undefined);
                graph.setSelectedNode(graph.nodes[index]);
                graph.centerSelectedNode();
                self.update(index, graph);
            } else {
                graph.setSelectedNode(graph.nodes[graph.nodes.length]);
            }
        });

        $('#side-head-top-button-p').click(function () {
            if (graph.nodes.length > 0) {
                var index = self.currentDotIndex;
                do {
                    index = (index + graph.nodes.length - 1) % graph.nodes.length;
                    if (index == self.currentDotIndex) {
                        return;
                    }
                } while (graph.nodes[index] == undefined);
                graph.setSelectedNode(graph.nodes[index]);
                graph.centerSelectedNode();
                self.update(index, graph);
            } else {
                graph.setSelectedNode(graph.nodes[graph.nodes.length]);
            }
        });

        $('#side-head-top-button-i').click(function () {
            graph.state.lockKeyEvent = true;
            var countNodes = graph.nodes.filter(function (i) {
                return i != undefined;
            }).length, countEdges = graph.edges.length;
            $('#modal-pano-info').openModal({
                dismissible: true,
                in_duration: 0,
                out_duration: 0,
                ready: function () {
                    $('#pano-info-ctime').text(new Date(ctime * 1000).toLocaleString());
                    $('#pano-info-mtime').text(new Date(mtime * 1000).toLocaleString());
                    $('#pano-info-nodes').text(countNodes);
                    $('#pano-info-edges').text(countEdges);
                    $('#pano-info-title').val(panoTitle).on('input', function () {
                        if ($(this).val() == '') {
                            $('#pano-info-ok').attr('disabled', 'disabled').addClass('disabled');
                        } else {
                            $('#pano-info-ok').removeAttr('disabled').removeClass('disabled');
                        }
                    });
                    graph.trySave();
                },
                complete: function () {
                    graph.state.lockKeyEvent = false;
                    panoTitle = $('#pano-info-title').val();
                    graph.trySave();
                }
            });
        });

        $('#pano-info-back').click(function () {
            location.href = 'projects.html';
        });

        $('#pano-info-simulate').click(function () {
            location.href = 'simulation_form.html?id=' + projectId;
        });

        $('#pano-info-clear').click(function () {
            if (confirm('I am sure that ALL the nodes and links will be REMOVED. ')) {
                graph.deleteGraph();
                $('#modal-pano-info').closeModal();
            }
        });

        $('#pano-info-ok').click(function (e) {
            if ($(this).attr('disabled') == 'disabled') {
                e.stopImmediatePropagation();
            }
        });

        $('#side-info-add').click(function () {
            var d = graph.state.selectedNode, pre = d;
            if (!d) {
                graph.createNodeAndSelect({tax_id: "", gene_id: "", name: "", info: "", title: "", x: 0, y: 0});
            } else {
                graph.createNodeAndSelect({tax_id: "", gene_id: "", name: "", info: "", title: "", x: d.x + 125, y: d.y});
            }
            d = graph.state.selectedNode;
            // make title of text immediently editable
            var circles = graph.circles.filter(function (dval) {
                return dval.id === d.id;
            });
            graph.centerSelectedNode(250, function () {
                self.editNodeInfo(graph.nodes[d.id], function (node) {
                    if (!node) {
                        graph.delSelectedNode();
                        graph.setSelectedNode(pre);
                        sidebar.update(!pre ? graph.nodes.length : pre.id);
                    } else {
                        circles.select('text').remove();
                        graph.setCircleTitle(circles, node.title);
                        sidebar.update(d.id);
                        graph.trySave();
                    }
                });
            });
        });

        $('#side-info-edit').click(function () {
            var d = graph.state.selectedNode;
            var circles = graph.circles.filter(function (dval) {
                return dval.id === d.id;
            });
            self.editNodeInfo(graph.nodes[d.id], function (node) {
                if (!node) {
                    graph.setSelectedNode(d);
                    sidebar.update(d.id);
                } else {
                    circles.select('text').remove();
                    graph.setCircleTitle(circles, node.title);
                    sidebar.update(d.id);
                    graph.trySave();
                }
            });
        });

        $('#side-info-remove').click(function () {
            var id = graph.state.selectedNode.id;
            graph.delSelectedNode();
            if (graph.nodes.length > 0) {
                var index = id;
                do {
                    index = (index + 1) % graph.nodes.length;
                } while (index != id && graph.nodes[index] == undefined);
                graph.setSelectedNode(graph.nodes[index]);
                graph.centerSelectedNode();
                self.update(index, graph);
            } else {
                graph.setSelectedNode(graph.nodes[graph.nodes.length]);
                self.update(graph.nodes.length, graph);
            }
        });

        $('#side-info-add-none').click(function () {
            $('#side-info-add').click();
        });

        $('#side-link-to').click(function () {
            $('#side-path-finder').removeClass('active');
            if (!$(this).hasClass('active')) {
                graph.state.currentLinkSource = graph.state.selectedNode;
                $(this).addClass('active');
            } else {
                graph.state.currentLinkSource = null;
                $(this).removeClass('active');
            }
        });

        $('#side-path-finder').click(function () {
            $('#side-link-to').removeClass('active');
            if (!$(this).hasClass('active')) {
                graph.state.currentLinkSource = graph.state.selectedNode;
                $(this).addClass('active');
            } else {
                graph.state.currentLinkSource = null;
                $(this).removeClass('active');
            }
        });

        $(document).keyup(function (event) {
            if (!graph.state.lockKeyEvent) {
                if (event.which == 37) {
                    $('#side-head-top-button-p').click();
                }
                if (event.which == 39) {
                    $('#side-head-top-button-n').click();
                }
            }
        });
    };

    var projectId = Number((location.href.match(/id=(\d*)/) || [])[1]);

    $('#body').append($('<svg id="main_window"></svg>')
        .attr("width", $(document.body).width())
        .attr("height", $(document.body).height()));

    var nodes = [], edges = [];
    var svg, graph, sidebar;
    var panoTitle, dataImg, ctime, mtime;

    function start() {
        svg = d3.selectAll("#main_window");
        graph = new GraphCreator(svg, nodes, edges);
        sidebar = new SideBar();
        $('title').text('pano - ' + panoTitle);

        if (graph.state.selectedNode) {
            sidebar.update(graph.state.selectedNode.id);
            graph.centerSelectedNode(1); // 1 millisecond
        } else {
            sidebar.update(graph.nodes.length);
        }
    }

    function save(graph, callback) {
        callback = callback || function () {};
        kickAss(function (png) {
            dataImg = png;
            $.post("/plugin/", {
                plugin: "pano",
                action: "save",
                id: projectId,
                title: panoTitle,
                img: '', // dataImg, // TODO
                data: JSON.stringify({nodes: graph.nodes.filter(function (d) {
                    return d != undefined;
                }), edges: graph.edges})
            }).done(function () {
                $('title').text('pano - ' + panoTitle);
                mtime = Math.ceil(Date.now() / 1000);
                callback(true);
            }).fail(function () {
                callback(false);
            });
        });
    }

    window.save = save;

    function invalidProjectId() {
        alert('Invalid Project ID! ');
        location.href = 'projects.html';
    }

    if (isNaN(projectId)) {
        invalidProjectId();
        start();
    } else {
        $.post("/plugin/", {plugin: "pano", action: "load", id: projectId}).done(function (res) {
            if (JSON.parse(res).success) {
                var jsonWrapper = JSON.parse(res);
                var json = JSON.parse(jsonWrapper.data);
                nodes = json['nodes'];
                edges = json['edges'];
                panoTitle = jsonWrapper['title'] || '';
                dataImg = jsonWrapper['img'] || '';
                ctime = jsonWrapper['ctime'];
                mtime = jsonWrapper['mtime'];
                start();
            } else {
                invalidProjectId();
            }
        }).fail(invalidProjectId);
    }

    function kickAss(callback) {
        callback = callback || function () {};
        var canvas = document.getElementById("canvas");
        var png = '';
        var svgString = new XMLSerializer().serializeToString(document.querySelector('svg'));
        var ctx = canvas.getContext("2d");
        var DOMURL = self.URL || self.webkitURL || self;
        var img = new Image();
        var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
        var url = DOMURL.createObjectURL(svg);
        var bbox = document.body.getBoundingClientRect();
        var factor = Math.max(bbox.width / 300, bbox.height / 225);
        var offset = {x: (300 - bbox.width / factor) / 2, y: (225 - bbox.height / factor) / 2};
        img.onload = function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offset.x, offset.y, bbox.width / factor, bbox.height / factor);
            callback(canvas.toDataURL("image/png"));
        };
        img.src = url;
    };

    window.kickAss = kickAss;
})(jQuery, window.d3, window.saveAs, window.Blob);
