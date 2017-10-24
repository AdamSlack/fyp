from __future__ import print_function
from time import time
import glob
from os import path

from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import NMF, LatentDirichletAllocation
from sklearn.datasets import fetch_20newsgroups

n_samples = 2000
n_features = 1000
n_topics = 10
n_top_words = 25

def print_top_words(model, feature_names, n_top_words):
  with open('results.txt', 'w') as f:
    for topic_idx, topic in enumerate(model.components_):
      f.write("Topic #%d:" % topic_idx)
      f.write(" ".join([feature_names[i]
                      for i in topic.argsort()[:-n_top_words - 1:-1]]))
      f.write('\n')

def readFile(fp):
  with open(fp, encoding='utf-8') as f:
    return f.read()

def readDataSamples(fp):
  """ Reads all txt files at a specified location and returns array of data. """
  if(path.isdir(fp)):
    fps = glob.glob(fp + '\\*.txt')
    return list(map(lambda x: readFile(x), fps))

print("Loading Books...")
t0 = time()

data_samples = readDataSamples('C:\\Users\\Adam\\Documents\\GitHub\\txtBooks\\book_txt')
print(str(len(data_samples)) + ' data samples read from file')
print("done in %0.3fs." % (time() - t0))

print("Extracting tf features for LDA...")
tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=n_features,
                                stop_words='english')
t0 = time()
tf = tf_vectorizer.fit_transform(data_samples)
print("done in %0.3fs." % (time() - t0))

print("Fitting LDA models with tf features, n_samples=%d and n_features=%d..."
      % (n_samples, n_features))
lda = LatentDirichletAllocation(n_topics=n_topics, max_iter=5,
                                learning_method='online', learning_offset=50.,
                                random_state=0)
t0 = time()
lda.fit(tf)
print("done in %0.3fs." % (time() - t0))

print("\nWriting topics in LDA model:")
tf_feature_names = tf_vectorizer.get_feature_names()
print_top_words(lda, tf_feature_names, n_top_words)
