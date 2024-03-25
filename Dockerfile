ARG RELEASE=latest

FROM nginx:${RELEASE}

RUN apt-get update && \
    apt-get upgrade && \
    apt-get install -y python3 

COPY . /usr/share/nginx/html
COPY ./tools/default.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html/

RUN ./helper.py push