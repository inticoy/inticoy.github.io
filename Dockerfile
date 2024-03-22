ARG RELEASE=latest

FROM nginx:${RELEASE}

COPY . /usr/share/nginx/html
COPY ./tools/default.conf /etc/nginx/conf.d/default.conf

RUN apt-get update && \
    apt-get upgrade && \
    apt-get install -y python3 && \
    python3 ./usr/share/nginx/html/src/utils/contents-gen.py \
            ./usr/share/nginx/html/content/ \
            ./usr/share/nginx/html/content/contents.json