from time import time
import glob
from os import path
from nlkt.tag import StanfordNERTagger
from nltk.tokenise import word_tokenize

def read_file(fp):
    if path.isfile(fp):
        with open(fp, encoding='utf-8') as f:
            print('Opening File: ' + fp)
            return f.read()
    else:
        print('Provided file path does not point at a file.')

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

def process_chunk_tree(t):
        """ recursively extract entities in tagged tree """
        # es = []
        # if isinstance(t, tree.Tree):
        #     if t.node == 'NE':
        #         es.append(' '.join([ch[0] for ch in t]))
        #     else:
        #         for ch in t:
        #             es.extend(process_chunk_tree(ch))
        # print(es)
        # return es
    
def extract_entities(document):
    """ """
    document_tree = process_document_pos(document)
    entities = process_chunk_tree(document_tree)
    for e in entities:
        print(e)
        
def process_document_pos(document):
    """ tokenise Document into chunked sentences. """
    # tokenised_sentences = [word_tokenize(sent) for sent in sent_tokenize(document)]
    # return ne_chunk_sents([pos_tag(sent) for sent in tokenised_sentences])
    tagg
    return word_tokenize(document)
    

fp = 'C:\\Users\\Adam Slack\\Documents\\GitHub\\fyp\\data\\books\\alice_in_wonderland.txt'
extract_entities(read_file(fp))
