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

        var card = func.append("div").attr("class","card blue-grey lighten-4 small")
        var card_ct = card.append("div").attr("class","card-content");
        var card_at = card.append("div").attr("class","card-action");


    })
});