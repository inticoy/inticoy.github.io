ARG RELEASE=latest

FROM nginx:${RELEASE}

RUN apt-get update && \
    apt-get upgrade && \
    apt-get install -y python3 

COPY build /usr/share/nginx/html
COPY ./tools/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html/
