/**
 * Created by Pjer1 on 9/30/2016.
 */
$(function () {
    console.log("begin");
    d3.json("data/biobrick.json", function (error, data_all) {
        var func = d3.selectAll("#bricks")
            .attr("class","row")
            .append("div")
            .attr("id","brick_content")
            .selectAll("div")
            .data(data_all.brick_data)
            .enter()
            .append("div")
            .attr("class","col s12 m6 l4");

        var card = func.append("div").attr("class","hoverable card blue-grey waves-effect lighten-4 medium")
        var card_ct = card.append("div").attr("class","card-content");
        var card_ac = card.append("div").attr("class","card-action");

        card_ct.append("span").attr("class","card-title")
            .append("h4")
            .html(function(d,i){return d.u_name});



        card_ct.append("span").attr("class","card-title")
            .append("h5")
            .html(function(d,i){
                var data = d.data1;
                return Object.keys(data)[0];
            });

        card_ct.append("p")
            .html(function(d,i){
                var data = d.data1;
                return data[Object.keys(data)[0]];
            });
        card_ct.append("span").attr("class","card-title")
            .append("h5")
            .html(function(d,i){
                var data = d.data2;
                return Object.keys(data)[0];
            });

        card_ct.append("p")
            .html(function(d,i){
                var data = d.data2;
                return data[Object.keys(data)[0]];
            });
        card_ct.append("span").attr("class","card-title")
            .append("h5")
            .html(function(d,i){
                var data = d.data3;
                return Object.keys(data)[0];
            });

        card_ct.append("p")
            .html(function(d,i){
                var data = d.data3;
                return data[Object.keys(data)[0]];
            });

        card_ac.append("button").attr("class","hoverable btn waves-effect waves-light blue-grey")
            .attr("style","margin:2px")
            .append("i")
            .attr("class","material-icons")
            .html("edit");

        card_ac.append("button").attr("class","hoverable btn waves-effect waves-light blue-grey")
            .attr("style","margin:2px")
            .append("i")
            .attr("class","material-icons")
            .html("delete");

        card_ac.append("button").attr("class","hoverable btn waves-effect waves-light blue-grey")
            .attr("style","margin:2px")
            .append("i")
            .attr("class","material-icons")
            .html("share")

    })
});