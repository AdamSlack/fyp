#!/bin/bash
FILE=/home/n0499528/zipURLs.txt
ZIPLOCATION=/home/n0499528/gutenberg/files

echo "Changing directory"
cd $ZIPLOCATION

echo "Fetching zips for all urls"
cat $FILE | while read line
do
    wget $line
done

    
