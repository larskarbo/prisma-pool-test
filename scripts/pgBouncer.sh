docker kill pgbouncer
docker rm pgbouncer

docker run -ti --name pgbouncer \
 -e POSTGRESQL_USERNAME="pgbouncer" \
 -e POSTGRESQL_PASSWORD="asdf" \
 -e POSTGRESQL_DATABASE="prisma-pool-test" \
 -e POSTGRESQL_HOST="host.docker.internal" \
 -e PGBOUNCER_DATABASE="prisma-pool-test" \
 -e PGBOUNCER_MAX_CLIENT_CONN="300" \
 -e PGBOUNCER_POOL_MODE="session" \
 -e PGBOUNCER_DEFAULT_POOL_SIZE="20" \
 -p 6432:6432 \
bitnami/pgbouncer:latest