var width=2000;
var height=500;
var svg=d3.select("#map").append("svg").attr("width",width).attr("height",height);
var projection=d3.geo.mercator().center([40,35]).scale(250).rotate([0,0,0]);
var path=d3.geo.path().projection(projection);var g=svg.append("g");
var country_selector=d3.select("#map").append("div").attr("class","country_selector").attr("width",width/20).attr("height",height/20);
queue().defer(d3.json,"world-110m.json").defer(d3.csv,"country_data.csv").await(main);
function main(error,world,countryData){
	var country_IDs=[];var country_names=[];
	var c1=[];
	var count = [];
	var countries=topojson.feature(world,world.objects.countries).features;
	countryData.forEach(function(d){country_names[d.id]=d.name;if(d.c1>0){country_IDs[d.id]=d.id;}if(d.c1>0){count[d.id] =d.count;}if(d.c1>0){c1[d.id]=d.c1;}});
	var colour_scale=d3.scale.linear().domain([0,32]).range(["red","yellow"]);
	var colour_initial=d3.scale.linear().domain([1,33]).range(["black","white"]);
	g.selectAll("path").data(countries)
		.enter().append("svg:path")
		.attr("d",path)
		.attr("id",function(d){return"_"+d.id;})
		.attr("name",function(d){return d.name;})
		.on("mouseover",function(d){country_selector.text(country_names[d.id])
			.style("left",(d3.event.pageX+7)+"px").style("top",(d3.event.pageY-15)+"px")
			.style("display","block").style("opacity",0.8);}).on("mouseout",function(d){country_selector
			.style("opacity",0).style("display","none");}).on("mousemove",function(d){country_selector
			.style("left",(d3.event.pageX+7)+"px").style("top",(d3.event.pageY-15)+"px");})
		.on("click",function(d){
			if(c1[d.id]>-1){
				var current_country=d3.select(this).style("fill","#660033");
				var country_selected=country_names[d.id];
				var cypher={"statements":[{"statement":"MATCH (a)-[n:SIMILIARITY]->(b) "+"WHERE a.name= "+'"'+country_selected+'"'+" AND b.scope = "+'"Country" '+"RETURN b.name AS CUISINE, 1/n.value AS SIMILARITY, b.country_ID AS IDC "+"ORDER BY n.value DESC"}]};$.ajax({type:"POST",accept:"application/json",contentType:"application/json; charset=utf-8",url:"//recipesdatabasesimilairites.sb02.stations.graphenedb.com:24789/db/data/transaction/commit",headers:{"Authorization":"Basic <cmVjaXBlc19kYXRhYmFzZV9zaW1pbGFpcml0ZXM6ZGJSRnRScXJmMWg1VFpjbHdlMGY=>"},data:JSON.stringify(cypher),success:function(data,textStatus,jqXHR){
var element=document.getElementById("paragraph_text");
if(element!=null){element.parentNode.removeChild(element);}var paragraph=document.createElement("p");paragraph.id="paragraph_text";var text_output=document.getElementById("inside_map");text_output.appendChild(paragraph)
for(z=0;z<31;z++){d3.select("path#_"+data.results[0].data[z].row[2]).style("fill",colour_scale(z)).style("stroke-width","1px").attr("class","selected");var name=data.results[0].data[z].row[0];var value=data.results[0].data[z].row[1];value=value.toFixed(3); var rank = z +1;var output= rank + ": " + name+" - "+value;var div=document.getElementById('paragraph_text');div.innerHTML=div.innerHTML+output+'<br>';};},failure:function(msg){console.log("failed")}});}else{window.alert("NOT IN DATASET. Please choose a shaded country.");}})
for(k=0;k<country_IDs.length;k++){d3.select("path#_"+country_IDs[k]).attr("class","in_scope").style("opacity", 1).style("fill",colour_initial(count[k]));}};var zooming=d3.behavior.zoom().on("zoom",function(){g.attr("transform","translate("+d3.event.translate.join(",")+")scale("+d3.event.scale+")");g.selectAll("path").attr("d",path.projection(projection));});svg.call(zooming).on("dblclick.zoom",null);