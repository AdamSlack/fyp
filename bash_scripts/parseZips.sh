#!/bin/bash
FILES=/home/n0499528/gutenberg/www.gutenberg.org/robot/*

echo "Parsing Files..."
for f in $FILES
do
  sed -n 's/.*href="http:\/\/\([^"]*\).*/\1/p' $f >> /home/n0499528/zipURLs.txt
done
echo "Files parsed"
