FROM node:10

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY IntranetFilter/package.json /usr/src/app
RUN npm install -g @angular/cli
RUN npm install

COPY IntranetFilter/ /usr/src/app/

CMD ng serve --host 0.0.0.0
