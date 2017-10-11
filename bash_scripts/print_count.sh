while :
do
    clear 
    echo Zip Location Files Scraped:
    echo -n $(ls ~/gutenberg/www.gutenberg.org/robot | wc -l)
    sleep 0.5
    echo -n "."
    sleep 0.5
    echo -n "."
    sleep 0.5
    echo -n "."
    sleep 0.5
done
