var mapreduce = require('./mapreduce-js/mapreduce');
var data = require('./allmessages.json');

function mapfunction(item,emit)
{
	emit(item.from,1);
}

function reducefunction(key,values,emit)
{
	//console.log("calling reduce", key, values);
	emit({ from:key, count: values.length });
}

var result = mapreduce(data,mapfunction,reducefunction);

console.log(result.sort(function(a,b) { return b.count - a.count }));
