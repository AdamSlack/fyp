dbname="tonicwater"
username="postgres"

vartest='psql -X -A -d $dbname -U $username -h localhost -p 5432  -c "SELECT count(*) FROM reviews;"'
echo "$vartest"
