FROM node:20

WORKDIR /usr/src/app

# Install netcat (via the correct Debian package name)
RUN apt-get update && apt-get install -y netcat-openbsd && apt-get clean

COPY --chown=node:node . .
COPY wait-for.sh /wait-for.sh
RUN chmod +x /wait-for.sh

RUN npm ci --omit=dev

ENV DEBUG=postgres_sql_orm:*

CMD ["/wait-for.sh", "db", "node", "index.js"]