#!/bin/bash
cd ../..
docker run -it -v ${PWD}/IntranetFilter:/usr/src/app -v /usr/src/app/node_modules -p 4200:4200 --rm sortfilter
