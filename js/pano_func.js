//tooltip function
jQuery(function ($) {
    $('.tooltipped').tooltip({delay: 50});
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    $('.modal-trigger').leanModal();

    var status_element = d3.select("#status");
    var container;

    var glo_json_data;
    var text_label;

    var current_dot_index = 0, dot_size;

    var margin = {top: -1, right: -1, bottom: -1, left: -1},
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
                d3.selectAll("#p"+ d.id)
                    .attr("cx", d.x = d3.event.x)
                    .attr("cy", d.y = d3.event.y);

                redraw_lines(d.id);

                for (var i = 0; i < glo_json_data.nodes.length; ++i) {
                    if (d.id == glo_json_data.nodes[i].id) {
                        update_current_position(d, i);
                        break;
                    }
                }

                d3.selectAll("#label"+ d.id).attr("x", d.x).attr("y", d.y)
            })
            .on("dragend", function (d) {
                d3.select(this).classed("dragging", false);

                for (var i = 0; i < glo_json_data.nodes.length; ++i) {
                    if (d.id == glo_json_data.nodes[i].id) {
                        select_one_dot(i);
                        break;
                    }
                }
                // version of non-continue axis
                //.attr("cx", d.x = Math.round(d.x * 0.1) * 10)
                //.attr("cy", d.y = Math.round(d.y * 0.1) * 10);
                //.attr("cx", d.x = d.x+0.0)
                //.attr("cy", d.y = d.y+0.0);
            });

    function update_current_position(d, index) {
        $('#status-posx').html(Math.round(d.x));
        $('#status-posy').html(Math.round(d.y));
        $('#status-uid').html(Math.round(d.id));
        $('#status-main-uid').html(Math.round(d.id));
        $('#status-type').html(Math.round(d.type));
        current_dot_index = index;
    }

    function clear_all_of_dots() {
        $('.dot *').attr('class', '');
    }

    clear_all_of_dots();

    function select_one_dot(index) {
        var id = glo_json_data.nodes[index].id;
        $('.dot *').attr('class', '');
        $('#p' + id).attr('class', 'selected');
    }

    function redraw_lines(uid_num) {
        //console.log(uid_num);
        var circle = svg.selectAll('#p'+uid_num);
        var lines = d3.selectAll(".node-link");
        //console.log(lines[0][0].attributes);
        for (a = 0; a < lines[0].length; a++) {
            if (lines[0][a].attributes.source.value == uid_num) {
                lines[0][a].attributes.x1.value =circle[0][0].attributes.cx.value;
                lines[0][a].attributes.y1.value =circle[0][0].attributes.cy.value;
            }
            if (lines[0][a].attributes.target.value == uid_num) {
                lines[0][a].attributes.x2.value =circle[0][0].attributes.cx.value;
                lines[0][a].attributes.y2.value =circle[0][0].attributes.cy.value;
            }
        }
    }

    $('#side-head-top-button-n').click(function () {
        var index = (current_dot_index + 1 + dot_size) % dot_size;
        update_current_position(glo_json_data.nodes[index], index);
        select_one_dot(current_dot_index);
    });

    $('#side-head-top-button-p').click(function () {
        var index = (current_dot_index - 1 + dot_size) % dot_size;
        update_current_position(glo_json_data.nodes[index], index);
        select_one_dot(current_dot_index);
    });

    $('#side-head-top-button-h').click(function () {
        $('#side-wrapper > div').animate({ left: 0 });
    });

    $('#side-head-close-button').click(function () {
        var width = $('#side-head').width();
        $('#side-wrapper > div').animate({ left: -2 * width });
    })

    var wrapper = d3.select("#image");
    var context_gene_tri = 0;
    var wrapper_bounding_box = wrapper.node().getBoundingClientRect();
    var svg = wrapper.append("svg")
            .on("contextmenu", function (d) {
                // Avoid the real one
                d3.event.preventDefault();
                // Show contextmenu

                if(context_gene_tri == 0){
                    $(".custom-menu_pano")
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
            .attr("transform", "translate(" + (0.5 * wrapper_bounding_box.width - 2 * width) + "," + (0.5 * wrapper_bounding_box.height - 2 * height) + ")scale(4,4)")
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

    var rect = svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .style("fill", "none")
            .style("pointer-events", "all");

    container = svg.append("g");

    container.append("g")
            .attr("class", "x-axis")
            .selectAll("line")
            .data(d3.range(0, width, 10))
            .enter().append("line")
            .attr("x1", function(d) { return d; })
            .attr("y1", 0)
            .attr("x2", function(d) { return d; })
            .attr("y2", height);

    container.append("g")
            .attr("class", "y-axis")
            .selectAll("line")
            .data(d3.range(0, height, 10))
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", function(d) { return d; })
            .attr("x2", width)
            .attr("y2", function(d) { return d; });

    d3.json("data/data.json", function (error, data_graph) {
        print_gra(data_graph);
        glo_json_data = data_graph;
        dot_size = glo_json_data.nodes.length;
        var index = Math.min(dot_size - 1, current_dot_index);
        update_current_position(data_graph.nodes[current_dot_index], index);
    });

    var r_click_gene; // ???

    function generate_links(container, data_graph) {
        var tmp = {};
        for (var i = 0; i < data_graph.nodes.length; ++i) {
            tmp[data_graph.nodes[i].id] = data_graph.nodes[i];
        }
        return container.append("g")
                .attr("class", "link")
                .selectAll("line")
                .data(data_graph.links)
                .enter()
                .append("line")
                .attr('stroke', '#1b5e20')
                .attr("stroke-width", function (d, i) { return 1.5; })
                .attr("class", "node-link")
                .attr("source", function (d) { return d.source })
                .attr("target", function (d) { return d.target })
                .attr("x1", function (d) { return tmp[d.source].x })
                .attr("y1", function (d) { return tmp[d.source].y })
                .attr("x2", function (d) { return tmp[d.target].x })
                .attr("y2", function (d) { return tmp[d.target].y })
                .style("marker-end",  "url(#suit)");
    }

    var colorScale = ["#123df2","#112354","#897361","#098723"];
    function generate_dots(container, data_graph) {
        return container.append("g")
                .attr("class", "dot")
                .selectAll("circle")
                .data(data_graph.nodes)
                .enter()
                .append("circle")
                .attr("r", 5)
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("id", function (d) { return "p" + d.id })
                .attr("fill",function(d){ return colorScale[d.type]; })
                .attr("u_type", function (d) { return d.type })
                .on("click", function (d) {
                    for (var i = 0; i < data_graph.nodes.length; ++i) {
                        if (d.id == data_graph.nodes[i].id) {
                            select_one_dot(i);
                            update_current_position(d, i);
                            return;
                        }
                    }
                })
                // will not use context menus
                /*
                .on("contextmenu", function (d) {
                    context_gene_tri = 1;
                    // Avoid the real one
                    r_click_gene = d;
                    d3.event.preventDefault();

                    // Show contextmenu
                    $(".custom-menu_gene").finish().toggle(100).

                    // In the right position (the mouse)
                    css({
                        top: d3.event.pageY + "px",
                        left: d3.event.pageX + "px"
                    });
                    context_gene_tri=0;
                })
                */
                .call(drag);
    }

    function generate_text_labels(container, data_graph) {
        return container.append("g")
                .attr("class",'txt')
                .selectAll("text")
                .data(data_graph.nodes)
                .enter()
                .append("text")
                .attr("id",function(d) { return "label"+ d.id})
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; })
                .attr("dx", 0)
                .attr("dy", 2.5)
                .attr("font-size",7)
                .attr("text-anchor","middle")
                .style("fill","#22375B")
                .text(function(d){return d.id})
                .on("click", function (d) { 
                    for (var i = 0; i < data_graph.nodes.length; ++i) {
                        if (d.id == data_graph.nodes[i].id) {
                            select_one_dot(i);
                            update_current_position(d, i);
                            return;
                        }
                    }
                })
                // will not use context menus
                /*
                .on("contextmenu", function (d) {
                    context_gene_tri = 1;
                    // Avoid the real one
                    r_click_gene = d;
                    d3.event.preventDefault();

                    // Show contextmenu
                    $(".custom-menu_gene").finish().toggle(100).

                    // In the right position (the mouse)
                    css({
                        top: d3.event.pageY + "px",
                        left: d3.event.pageX + "px"
                    });
                    context_gene_tri=0;
                })
                */
                .call(drag);
    }

    function print_gra(data_graph) {
        var link = generate_links(container, data_graph); 
        var dot = generate_dots(container, data_graph); 
        var text_labels = generate_text_labels(container, data_graph);
        $(".custom-menu_gene li").click(function(){
            console.log($(this).attr("data-action"));

            // This is the triggered action name
            switch($(this).attr("data-action")) {
                // A case for each action. Your actions here
                case "about":  about_modal()   ; break;
                case "link_to":   alert("second"); break;
                case "edit_form": alert("third"); break;
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu_gene").hide(100);
        });

        function about_modal(){
            d3.selectAll("#detail_info_node")
                    .attr("class","white-text")
                    .html(function(){
                        var linknodes=get_link_by_uid(r_click_gene.id);
                        var string_comp ="<h5 style='margin-top: 30px'> Basic information</h5>";
                        string_comp +=" Position x : "+ r_click_gene.x +"<br>";
                        string_comp +=" Position y : "+ r_click_gene.y +"<br>";
                        string_comp +=" Links  :<br> &emsp; nodes[in] : " + linknodes.node_in +"<br>";
                        string_comp +=" &emsp; nodes[out] : " + linknodes.node_out +"<br>";

                        string_comp +=" <h5 style='margin-top: 30px'>Biological information</h5>";
                        string_comp +=" ID  : " + r_click_gene.id +"<br>";
                        string_comp +=" Type id  : " + r_click_gene.type +"<br>";
                        string_comp +=" Biological Name  : " + r_click_gene.u_name +"sth" +"<br>";
                        string_comp +=" Nick Name  : " + r_click_gene.u_name +"<br>";
                        string_comp +=" Detailed info  : " + "afjlsdfksdfldah sjkbbvajsdcjhaskdfak" +"<br>";
                        return string_comp
                    });
            location.href = "#modal_node_info"
        }

        function get_link_by_uid(uid_num) {
            //console.log(uid_num);
            var link_relations = {"node_in":[],"node_out":[]};
            var lines = d3.selectAll(".node-link");

            console.log("find link");
            //console.log(lines[0][0].attributes);
            for (a = 0; a < lines[0].length; a++) {
                if(lines[0][a].attributes.source.value == uid_num){
                    link_relations.node_out.push(lines[0][a].attributes.target.value);
                }

                if(lines[0][a].attributes.target.value == uid_num){
                    link_relations.node_in.push(lines[0][a].attributes.source.value);
                }
            }
            return link_relations
        }

        // If the menu element is clicked
        $(".custom-menu_pano li").click(function(){

            // This is the triggered action name
            switch($(this).attr("data-action")) {
                // A case for each action. Your actions here
                case "first": console.log("add poin"); break;
                case "second": alert("second"); break;
            }

            // Hide it AFTER the action was triggered
            $(".custom-menu_pano").hide(100);
        });

        back_to_center(data_graph);

        //Create all the line svgs but without locations yet
    }


    function back_to_center(data_graph){
        xy_range = get_xy_range(data_graph);

        var mid_x = (xy_range.xmax+xy_range.xmin)/2;
        var mid_y = (xy_range.ymax+xy_range.ymin)/2;

        console.log(mid_x);

        var posi_x = -4*mid_x+500;
        var posi_y = -4*mid_y+340;//weird but works
        svg.attr("transform", "translate(" + posi_x+ ',' +posi_y + ")scale(4)");
    }

    //print function can be called in global

    function get_xy_range(json_data){
        var xy_range;
        var xmax=0;
        var xmin=999999;
        var ymax=0;
        var ymin=999999;

        for (var i =0;i<json_data.nodes.length;i++){
            if (xmax<json_data.nodes[i].x){
                xmax=json_data.nodes[i].x;
            }
            if (ymax<json_data.nodes[i].y){
                ymax=json_data.nodes[i].y;
            }
            if (xmin>json_data.nodes[i].x){
                xmin=json_data.nodes[i].x;
            }
            if (ymin>json_data.nodes[i].y){
                ymin=json_data.nodes[i].y;
            }
        }

        xy_range = {"xmax":xmax,"ymax":ymax,"xmin":xmin,"ymin":ymin};
        return xy_range

    }


    function get_json_data(){
        var data_json;
        console.log("get json")
    }
    function update_json_data(){
        var data_json;
        console.log()
    }




    //////////  customize right click

    // Trigger action when the context_menu is about to be shown
    //$(document).bind();


    // If the document is clicked somewhere
    $(document).bind("mousedown", function (e) {

        // If the clicked element is not the menu
        if (!$(e.target).parents(".custom-menu_gene").length > 0) {

            // Hide it
            $(".custom-menu_gene").hide(100);
        }

        if (!$(e.target).parents(".custom-menu_pano").length > 0) {

            // Hide it
            $(".custom-menu_pano").hide(100);
        }
    });
});
