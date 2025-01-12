#! /bin/bash
npm run build && \
scp -r out/* aqrun@192.168.1.240:/home/aqrun/workspace/www/home-server