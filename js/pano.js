jQuery(function ($) {
    $('.tooltipped').tooltip({delay: 50});
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();

    var statusElement = d3.select("#status");
    var container;

    // nodeData: an array whose indexes of the elements means the uids of them, if not exist,
    //           it will be undefined. For example, if there are elements whose uids are '1, 2, 4',
    //           the array will be: [ undefined, { id: 1, ... }, { id: 2, ... }, undefined, { id: 4, ... } ]
    // linkData: the same form as 'data.json' shows
    //
    // Do not care about my poor English -- ustc_zzzz
    var nodeData = [], linkData = [];

    var textLabel;

    var currentDotIndex = 0;

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
            width = 1920 - margin.left - margin.right,
            height = 1080 - margin.top - margin.bottom;

    var zoom = d3.behavior.zoom()
            .scaleExtent([1 / 8, 8])
            .on("zoom", function () {
                container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            });

    var drag = d3.behavior.drag()
            .origin(function (d) {
                return d;
            })
            .on("dragstart", function (d) {
                d3.event.sourceEvent.stopPropagation();
                //d3.select(this).classed("dragging", true);
            })
            .on("drag", function (d) {
                d.x = d3.event.x;
                d.y = d3.event.y;
                redrawDot(d.id);
                updateCurrentPosition(d.id);

            })
            .on("dragend", function (d) {
                d3.select(this).classed("dragging", false);

                selectOneDot(d.id);

                // version of non-continue axis
                //.attr("cx", d.x = Math.round(d.x * 0.1) * 10)
                //.attr("cy", d.y = Math.round(d.y * 0.1) * 10);
                //.attr("cx", d.x = d.x+0.0)
                //.attr("cy", d.y = d.y+0.0);
            });

            /*
    var moveTransition = d3.transition()
            .duration(500)
            .ease(d3.easeLinear);

    function moveToCurrentDot() {
        container.transition(moveTransition)
            .attrTween("transform", function (t) {
                "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"
            });
    }
            */

    function updateCurrentPosition(index) {
        var d = nodeData[index];
        if (d != undefined) {
            $('#status-posx').html(Math.round(d.x));
            $('#status-posy').html(Math.round(d.y));
            $('#status-uid').html(Math.round(d.id));
            $('#status-main-uid').html(Math.round(d.id));
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
        currentDotIndex = index;
    }

    function clearAllOfDots() {
        $('.dot *').attr('class', '');
    }

    clearAllOfDots();

    function selectOneDot(index) {
        $('.dot *').attr('class', '');
        $('#p' + index).attr('class', 'selected');
    }

    function redrawDot(uidNum) {
        var d = nodeData[uidNum];
        var circle = svg.selectAll('#p' + uidNum);
        var cx = circle[0][0].attributes.cx.value;
        var cy = circle[0][0].attributes.cy.value;
        var lines = d3.selectAll(".node-link")[0];
        var textLabel = d3.selectAll("#label" + uidNum);
        for (a = 0; a < lines.length; a++) {
            if (lines[a].attributes.source.value == uidNum) {
                lines[a].attributes.x1.value = cx;
                lines[a].attributes.y1.value = cy;
            }
            if (lines[a].attributes.target.value == uidNum) {
                lines[a].attributes.x2.value = cx;
                lines[a].attributes.y2.value = cy;
            }
        }
        circle.attr("cx", d.x).attr("cy", d.y);
        textLabel.attr("x", d.x).attr("y", d.y);
    }

    $('#side-head-top-button-n').click(function () {
        if (nodeData.length >= 0) {
            var index = currentDotIndex;
            do {
                index = (index + 1) % nodeData.length;
                if (index == currentDotIndex) {
                    return;
                }
            } while (nodeData[index] == undefined);
            updateCurrentPosition(index);
            selectOneDot(index);
        }
    });

    $('#side-head-top-button-p').click(function () {
        if (nodeData.length >= 0) {
            var index = currentDotIndex;
            do {
                index = (index + nodeData.length - 1) % nodeData.length;
                if (index == currentDotIndex) {
                    return;
                }
            } while (nodeData[index] == undefined);
            updateCurrentPosition(index);
            selectOneDot(index);
        }
    });

    $('#side-head-top-button-h').click(function () {
        $('#side-wrapper > div').animate({ left: 0 }, 200, "easeOutQuad");
    });

    $('#side-head-close-button').click(function () {
        var width = $('#side-head').width();
        $('#side-wrapper > div').animate({ left: -1.05 * width }, 200, "easeInQuad");
    })

    var wrapper = d3.select("#image");
    var contextGeneTri = 0;
    var wrapperBoundingBox = wrapper.node().getBoundingClientRect();
    var svg = wrapper.append("svg")
            .on("contextmenu", function (d) {
                // Avoid the real one
                d3.event.preventDefault();
                // Show contextmenu

                if(contextGeneTri == 0){
                    $(".custom-menu-pano")
                        .finish()
                        .toggle(100)
                        .css({
                            top: d3.event.pageY + "px",
                            left: d3.event.pageX + "px"
                        });
                }
            })
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .call(zoom);
    // define arrow markers for graph links
    svg.append("defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("marker")
            .attr("id", function(d) { return d; })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 26)
            .attr("refY", 0)
            .attr("markerWidth", 2)
            .attr("markerHeight", 2)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5 L10,0 L0,5 L10,0 L0,-5")
            .style("stroke", "#1b5e20")
            .style("stroke-width", 3)
            .style("opacity", "1");

    svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all");

    container = svg.append("g");

    container.append("g")
            .attr("class", "x-axis")
            .selectAll("line")
            .data(d3.range(0, width + 1, 10))
            .enter().append("line")
            .attr("x1", function(d) { return d; })
            .attr("y1", 0)
            .attr("x2", function(d) { return d; })
            .attr("y2", height);

    container.append("g")
            .attr("class", "y-axis")
            .selectAll("line")
            .data(d3.range(0, height + 1, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", function(d) { return d; })
            .attr("x2", width)
            .attr("y2", function(d) { return d; });

    var links = container.append("g")
            .attr("class", "link")
            .selectAll("line");

    var dots = container.append("g")
            .attr("class", "dot")
            .selectAll("circle");

    var texts = container.append("g")
            .attr("class",'txt')
            .selectAll("text");

    d3.json("data/data.json", function (error, dataGraph) {
        for (var node in dataGraph.nodes) {
            nodeData[dataGraph.nodes[node].id] = dataGraph.nodes[node];
        }
        for (var link in dataGraph.links) {
            linkData.push(dataGraph.links[link]);
        }
        printGra();
        var newIndex = Math.min(nodeData.length - 1, currentDotIndex);
        currentDotIndex = nodeData.length;
        updateCurrentPosition(newIndex);
    });

    var rClickGene; // ???

    function generateLinks() {
        var dataLink = links.data(linkData);
        dataLink.exit().remove();
        dataLink.enter()
                .append("line")
                .attr('stroke', '#1b5e20')
                .attr("stroke-width", function (d, i) { return 1.5; })
                .attr("class", "node-link")
                .attr("source", function (d) { return d.source })
                .attr("target", function (d) { return d.target })
                .attr("x1", function (d) { return nodeData[d.source].x })
                .attr("y1", function (d) { return nodeData[d.source].y })
                .attr("x2", function (d) { return nodeData[d.target].x })
                .attr("y2", function (d) { return nodeData[d.target].y })
                .style("marker-end",  "url(#suit)");
    }

    var colorScale =  ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"];
    function generateDots() {
        var dataDots = dots.data(nodeData.filter(function (n) { return n != undefined; }))
        dataDots.exit().remove()
        dataDots.enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("id", function (d) { return "p" + d.id })
                .attr("fill", function(d) { return colorScale[d.type]; })
                .attr("uType", function (d) { return d.type })
                .on("click", function (d) {
                    selectOneDot(d.id);
                    updateCurrentPosition(d.id);
                })
                // will not use context menus
                /*
                .on("contextmenu", function (d) {
                    contextGeneTri = 1;
                    // Avoid the real one
                    rClickGene = d;
                    d3.event.preventDefault();

                    // Show contextmenu
                    $(".custom-menu-gene").finish().toggle(100).

                    // In the right position (the mouse)
                    css({
                        top: d3.event.pageY + "px",
                        left: d3.event.pageX + "px"
                    });
                    contextGeneTri=0;
                })
                */
                .call(drag);
    }

    function generateTextLabels() {
        var dataText = texts.data(nodeData.filter(function (n) { return n != undefined; }))
        dataText.exit().remove();
        dataText.enter()
                .append("text")
                .attr("id", function(d) { return "label" + d.id})
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("dx", 0)
                .attr("dy", 2.5)
                .attr("font-size",7)
                .attr("text-anchor","middle")
                .style("fill","#22375B")
                .text(function(d){return d.id})
                .on("click", function (d) {
                    selectOneDot(d.id);
                    updateCurrentPosition(d.id);
                })
                // will not use context menus
                /*
                .on("contextmenu", function (d) {
                    contextGeneTri = 1;
                    // Avoid the real one
                    rClickGene = d;
                    d3.event.preventDefault();

                    // Show contextmenu
                    $(".custom-menu-gene").finish().toggle(100).

                    // In the right position (the mouse)
                    css({
                        top: d3.event.pageY + "px",
                        left: d3.event.pageX + "px"
                    });
                    contextGeneTri=0;
                })
                */
                .call(drag);
    }

    function printGra() {
        generateLinks();
        generateDots();
        generateTextLabels();

        /*
        $(".custom-menu-gene li").click(function(){
            console.log($(this).attr("data-action"));

            // This is the triggered action name
            switch($(this).attr("data-action")) {
                // A case for each action. Your actions here
                case "about":  aboutModal()   ; break;
                case "linkTo":   alert("second"); break;
                case "editForm": alert("third"); break;
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu-gene").hide(100);
        });

        function aboutModal(){
            d3.selectAll("#detailInfoNode")
                    .attr("class","white-text")
                    .html(function(){
                        var linknodes=getLinkByUid(rClickGene.id);
                        var stringComp ="<h5 style='margin-top: 30px'> Basic information</h5>";
                        stringComp +=" Position x : "+ rClickGene.x +"<br>";
                        stringComp +=" Position y : "+ rClickGene.y +"<br>";
                        stringComp +=" Links  :<br> &emsp; nodes[in] : " + linknodes.nodeIn +"<br>";
                        stringComp +=" &emsp; nodes[out] : " + linknodes.nodeOut +"<br>";

                        stringComp +=" <h5 style='margin-top: 30px'>Biological information</h5>";
                        stringComp +=" ID  : " + rClickGene.id +"<br>";
                        stringComp +=" Type id  : " + rClickGene.type +"<br>";
                        stringComp +=" Biological Name  : " + rClickGene.uName +"sth" +"<br>";
                        stringComp +=" Nick Name  : " + rClickGene.uName +"<br>";
                        stringComp +=" Detailed info  : " + "afjlsdfksdfldah sjkbbvajsdcjhaskdfak" +"<br>";
                        return stringComp
                    });
            location.href = "#modal-node-info"
        }

        function getLinkByUid(uidNum) {
            //console.log(uidNum);
            var linkRelations = {"nodeIn":[],"nodeOut":[]};
            var lines = d3.selectAll(".node-link");

            console.log("find link");
            //console.log(lines[0][0].attributes);
            for (a = 0; a < lines[0].length; a++) {
                if(lines[0][a].attributes.source.value == uidNum){
                    linkRelations.nodeOut.push(lines[0][a].attributes.target.value);
                }

                if(lines[0][a].attributes.target.value == uidNum){
                    linkRelations.nodeIn.push(lines[0][a].attributes.source.value);
                }
            }
            return linkRelations
        }

        // If the menu element is clicked
        $(".custom-menu-pano li").click(function(){

            // This is the triggered action name
            switch($(this).attr("data-action")) {
                // A case for each action. Your actions here
                case "first": console.log("add poin"); break;
                case "second": alert("second"); break;
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu-pano").hide(100);
        });
        */

        var xyRange = getXYRange(nodeData.filter(function (n) { return n != undefined; }));

        var midX = (xyRange.xmax + xyRange.xmin) / 2;
        var midY = (xyRange.ymax + xyRange.ymin) / 2;

        // weird but works
        // because the scale is 4 -- ustc_zzzz
        svg.attr("transform", "translate(" + (0.5 * wrapperBoundingBox.width + 150 - 4 * midX)
                + "," + (0.5 * wrapperBoundingBox.height - 4 * midY) + ")scale(4)")
    }

    //print function can be called in global

    function getXYRange(data){
        if (data.length <= 0) {
            return { "xmax": 640, "ymax": 360, "xmin": 640, "ymin": 360 }
        }
        var xmax = data[0].x, xmin = xmax;
        var ymax = data[0].y, ymin = ymax;
        for (var i = 1; i < data.length; ++i){
            if (xmax < data[i].x) {
                xmax = data[i].x;
            }
            if (ymax < data[i].y) {
                ymax = data[i].y;
            }
            if (xmin > data[i].x) {
                xmin = data[i].x;
            }
            if (ymin > data[i].y) {
                ymin = data[i].y;
            }
        }
        return { "xmax": xmax, "ymax": ymax, "xmin": xmin, "ymin": ymin };
    }

    function getJsonData(){
        var dataJson;
        console.log("get json")
    }
    function updateJsonData(){
        var dataJson;
        console.log()
    }




    //////////  customize right click

    // Trigger action when the contextMenu is about to be shown
    //$(document).bind();


    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {

        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu-gene").length > 0) {

            // Hide it
            $(".custom-menu-gene").hide(100);
        }

        if (!$(e.target).parents(".custom-menu-pano").length > 0) {

            // Hide it
            $(".custom-menu-pano").hide(100);
        }
    });
});
