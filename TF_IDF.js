var mapreduce = require('./mapreduce-js/mapreduce');
var data = require('./allmessages.json');

function log2(x) {
  return Math.log(x) / Math.LN2;
}

/* preprocess text to remove punctuation, etc */
console.log("preprocess");

data.forEach(function(msg)
{
	msg.text = msg.text.replace(/[^A-Za-z0-0 ñÑáéíóúÁÉÍÓÚ]/g,' ').replace(/\s+/g,' ').toLowerCase().trim();
	msg.id = msg.url.match(/id=(\w+)&/)[1];
	msg.splitted = msg.text.split(/\s/g);
})


/* calculate IDF for every word */
console.log("calculate IDF");

var N = data.length;

var IDFs = mapreduce(data, function(item,emit)
{
	for(word in item.splitted)
	{
		emit( item.splitted[word], item.id );
	}
},
function(key,values,emit)
{
	values = values && values.filter(function(item, pos) {
		return values.indexOf(item) == pos;
	});

	emit({ word: key, IDF: log2( N / values.length )});
});

//console.log(IDFs.sort(function(a,b) { return b.IDF - a.IDF }).slice(0,20));

var IDFtable = [];
IDFs.forEach(function(pair) { IDFtable[pair.word] = pair.IDF; });

/* for each document, extract the most significant words */
data.forEach(function(msg)
{
	var TF_IDF = {};
	var maxFreq = 0;

	for(i in msg.splitted)
	{
		var word = msg.splitted[i];
		if( TF_IDF[word] )
			TF_IDF[word] += 1;
		else
			TF_IDF[word] = 1;

		if( TF_IDF[word] > maxFreq)
			maxFreq = TF_IDF[word];
	}

	var summary = [];
	for(word in TF_IDF)
	{
		TF_IDF[word] *= IDFtable[word] * maxFreq;
		summary.push({ word: word, TF_IDF: TF_IDF[word] });
	}

	summary = summary.sort(function(a,b) { return b.TF_IDF - a.TF_IDF }).slice(0,5);
	console.log(msg.subject,summary);
});