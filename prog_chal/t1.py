from collections import defaultdict
import time

buckets = defaultdict(list)
sentences = []
comparison_count = 0
similar_pairs = 0

def isSimilar(len1,words1,len2,words2):

	if len1 == 0:
		return len2 <= 1

	if len2 == 0:
		return len1 <= 1

	w1 = words1[0]
	w2 = words2[0]

	suffix1 = words1[1:]
	suffix2 = words2[1:]

	if w1 == w2:
		return isSimilar(len1-1,suffix1,len2-1,suffix2)
	else:
		if len1 == len2:
			return suffix1 == suffix2
		elif len1+1 == len2:
			return words1 == suffix2
		elif len1 == len2+1:
			return suffix1 == words2
		else:
			return False			

	return False

def read_file(limit=-1):
	global sentences, buckets

	file = open('sentences.txt','r')

	for line in file:
		words = line.split()
		id = int(words.pop(0))
		length = len(words)
		sentences.insert(id,(length,words))
		buckets[ (words[0],length) ].append(id)
		buckets[ (words[1],length) ].append(id)
		if id == limit:
			break
		if id % 100000 == 0:
			print "reading",id,id/10000000.0*100


def find_pairs():
	global similar_pairs, comparison_count
	bucket_index = 0
	bucket_count = len(buckets)
	for (bucket,ids) in buckets.items():
		bucket2 = (bucket[0], bucket[1]-1)
		if bucket2 in buckets:
			ids.extend(buckets[bucket2])

		for id1 in ids:
			for id2 in ids:
				if id1 < id2:
					(len1,words1) = sentences[id1]
					(len2,words2) = sentences[id2]
					# print "c",words1,words2
					comparison_count += 1
					if isSimilar(len1,words1, len2,words2):
						# print id1,id2
						# print "s",words1
						# print "s",words2
						similar_pairs += 1

		bucket_index += 1
		if bucket_index % 10000 == 0:
			print "examined",bucket_index, bucket_index / float(bucket_count) * 100
	return

def test(s1,s2,expected):
	words1 = s1.split();
	words2 = s2.split()
	result = isSimilar(len(words1),words1,len(words2),words2)
	print  "OK" if result == expected else "MAL!!",'|',s1,'|',s2,'|',result

do_test = False
if do_test:
	test('a b','a b', True)
	test('a b c','a b', True)
	test('a b','a b c', True)
	test('a b c','a b d', True)
	test('f b c','a b c', True)
	test('a b c','a b c d e', False)
	test('a b c d e','a b c', False)
	test('a b c d e','c d e', False)
	test('a','a', True)
	test('a','a b', True)
	test('a','a b c', False)
	test('a b c','a', False)
	test('a b','a', True)
	test('a b c d','a', False)
	test('a b c d','e f g h', False)
	exit()

limit = -100000
print "reading file"
t0 = time.time()
read_file(limit)
t1 = time.time()
N = len(sentences)
print "read file in ", t1-t0, "seconds"
print "read", N, "sentences"
print "finding pairs"
find_pairs()
t2 = time.time()
print "found pairs in ",t2-t1, "seconds"
print "N*(N-1)=", N*(N-1)
print "comparisons made", comparison_count, comparison_count/float(N*(N-1))*100
print "found pairs", similar_pairs
# print "sentences"
# print sentences[1:10]
# print "buckets"
# print buckets
print 'end'