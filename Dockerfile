FROM node:latest

RUN mkdir -p /opt/openkarotz-emulator
COPY . /opt/openkarotz-emulator

WORKDIR /opt/openkarotz-emulator
EXPOSE 80

CMD node index.js

