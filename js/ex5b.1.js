var points = [
	[28, 145],
	[25, 125],
	[50, 130],
	[65, 140],
	[38, 115],
	[44, 105],
	[55, 118],
	[29, 97],
	[43, 83],
	[50, 90],
	[63, 88],
	[35, 63],
	[42, 57],
	[50, 60],
	[55, 63],
	[23, 40],
	[50, 30],
	[64, 37],
	[33, 22],
	[55, 20]
]

var clusters = [
	[25, 125],
	[44, 105],
	[29, 97],
	[35, 63],
	[42, 57],
	[55, 63],
	[23, 40],
	[64, 37],
	[33, 22],
	[55, 20]
]

function distance(a,b)
{
	var dx = a[0]-b[0];
	var dy = a[1]-b[1];
	return Math.sqrt( dx*dx + dy*dy );
}

var n = points.length;
var k = clusters.length;
var i, c;

var point_cluster = [];

console.log("round 1");

for(i=0; i<n; i++)
{
	var nearestCluster = null;
	var shortestDistance = 10000;

	for(c=0; c<k; c++)
	{
		var d = distance(points[i], clusters[c]);

		if( d < shortestDistance )
		{
			nearestCluster = c;
			shortestDistance = d;
		}
	}

	console.log("point", points[i], "cluster", nearestCluster, clusters[nearestCluster], "distance", shortestDistance);
	point_cluster[i] = nearestCluster;
}

console.log("recomputing centroids");

for(c=0; c<k; c++)
{
	var sumx = 0;
	var sumy = 0;
	var count = 0;

	for(i=0; i<n; i++)
	{
		if( point_cluster[i] == c)
		{
			sumx += points[i][0];
			sumy += points[i][1];
			count += 1;
		}
	}

	clusters[c][0] = sumx / count;
	clusters[c][1] = sumy / count;

	console.log("cluster", c, clusters[c]);
}

console.log("reasigning points");

for(i=0; i<n; i++)
{
	var nearestCluster = null;
	var shortestDistance = 10000;

	for(c=0; c<k; c++)
	{
		var d = distance(points[i], clusters[c]);

		if( d < shortestDistance )
		{
			nearestCluster = c;
			shortestDistance = d;
		}
	}

	console.log("point", points[i], "cluster", nearestCluster, clusters[nearestCluster], "distance", shortestDistance);
	if( point_cluster[i] != nearestCluster )
	{
		console.log("point",points[i],"changed cluster",point_cluster[i],"to",nearestCluster);
		point_cluster[i] = nearestCluster;		
	}
}
