#!/bin/bash

# Digital Ocean database variables
digital_ocean_host=""
digital_ocean_port=25060
digital_ocean_user="readonly"
digital_ocean_password=""
digital_ocean_dbname="layer3_app"

# Target database variables

# neon
# target_database_host=""
# target_database_port=5432
# target_database_user="lars"
# target_database_password=""
# target_database_dbname="neondb"

# local
target_database_host="localhost"
target_database_port=5432
target_database_user="lars"
target_database_password=""
target_database_dbname="layer3-p-mirror"

# Array of tables to exclude
tables_to_exclude=(
  "BountyStepCompletion"
  "XpActivity"
  "RelayTx"
  "RefreshToken"
  "SybilCheck"
  "UserChest"
  "WalletAuthEvent"
  "QuestCompletion"
  "AccountProviderConnectEvent"
  "BountyClaim"
  "UserNft"
)

# Construct the --exclude-table options for data migration
exclude_tables_options="--exclude-table-data="

first_table=true
for table in "${tables_to_exclude[@]}"; do
	if [[ "$first_table" == true ]]; then
		first_table=false
	else
		exclude_tables_options+="|"
	fi
	exclude_tables_options+="\"${table}\""
done

# Dump the structure and data from the Digital Ocean PostgreSQL database,
# excluding the data of specified tables and ACL information
PGPASSWORD=$digital_ocean_password pg_dump -U $digital_ocean_user \
	-h $digital_ocean_host -p $digital_ocean_port --dbname=$digital_ocean_dbname \
	--verbose --no-acl ${exclude_tables_options} -Fc -f digital_ocean_pg_dump.dump

# PGPASSWORD=$target_database_password createdb -U $target_database_user -h $target_database_host -p $target_database_port $target_database_dbname

# create role doadmin
# PGPASSWORD=$target_database_password psql -U $target_database_user -h $target_database_host -p $target_database_port -c "CREATE ROLE doadmin;"

# Restore the structure and data to the Target PostgreSQL database
PGPASSWORD=$target_database_password pg_restore -h $target_database_host -U $target_database_user -d $target_database_dbname --verbose -1 "digital_ocean_pg_dump.dump"

#todo: GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public."AccountProviderConnectEvent" TO layer3_app_8;

# Check if the restore completed successfully
if [ $? -eq 0 ]; then
    echo "Successfully migrated the PostgreSQL database from Digital Ocean to Target Database!"
else
    echo "Error: The migration of the PostgreSQL database from Digital Ocean to Target Database failed."
fi
