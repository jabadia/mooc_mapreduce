

def mapfn(item):
	return item * 2;


def reducefn(accum,item):
	return accum + item;

if __name__ == '__main__':
	input = [1,2,3,4,5]
	intermediate = map(mapfn, input)
	output = reduce(reducefn, intermediate)
	print(output)