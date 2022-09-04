RAW_DB_URL="postgresql://prismauser2@localhost:5432/prisma-pool-test?schema=public"
PGBOUNCER_DB_URL="postgresql://pgbouncer:asdf@localhost:6432/prisma-pool-test?schema=public"

USE_PG_BOUNCER=true
USE_NODE_POSTGRES=false

if [ "$USE_PG_BOUNCER" = true ]; then
    DB_URL=$PGBOUNCER_DB_URL
else
    DB_URL=$RAW_DB_URL
fi

pkill node

# setup

npm run build
DATABASE_URL="$RAW_DB_URL" npx prisma generate

# if [ $USE_PG_BOUNCER == 'true' ]; then
#     exec 3< <(npm run pgbouncer)
#     sed '/** Starting PgBouncer **:3000$/q' <&3
#     cat <&3 &
# fi

exec 4< <(DATABASE_URL="$DB_URL" CONNECTION_LIMIT=200 npm run start)
sed '/localhost:3000$/q' <&4
cat <&4 &

if [ "$USE_NODE_POSTGRES" = true ]; then
  USE_PG=true npm run test:k6
else
  npm run test:k6
fi

# pkill node
# docker kill pgbouncer

# Without pool with node-postgres instead of prisma

# DATABASE_URL="$RAW_DB_URL" CONNECTION_LIMIT=5 npm run start

# prisma + pgBouncer

# DATABASE_URL="$RAW_DB_URL" npx prisma generate
# DATABASE_URL="$PGBOUNCER_DB_URL&pgbouncer=true" CONNECTION_LIMIT=120 npm run start
