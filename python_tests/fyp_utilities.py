from time import time
import glob
from os import path
import nltk

def read_file(fp):
    print('Opening File: ' + fp)
    if path.isfile(fp):
        with open(fp, encoding='utf-8') as f:
            return f.read()

def load_data_samples(dirpath, seperator='/', globule='*.txt'):
    """ Reads all txt files at a specified location and returns array of data. """
    if(path.isdir(dirpath)):
        fps = glob.glob(dirpath + seperator + globule)
        return [read_file(fp) for fp in fps]

def time_action(action, *args):
    """ Time an action (or function) """
    start = time()
    res = action(*args)
    print("Action done in: %0.3fs." % (time() - start))
    return res

def extract_entities(document):
    """ """
    print(process_document(document))
    
def process_document(document):
    """ tokenise Document into chunked sentences. """
    tokenised_sentences = [nltk.word_tokenise(sent) for sent in nltk.sent_tokenize(document)]
    return nltk.ne_chunk_sents([nltk.pos_tag(sent) for sent in tokenised_sentences])
    
nltk.download()
extract_entities(read_file(fp))
