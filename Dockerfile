FROM node:lts
WORKDIR /usr/src/app

COPY . ./

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && npm install \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 8080 3000
CMD [ "npm", "start" ]
