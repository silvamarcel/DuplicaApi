FROM node:14.7.0
COPY . /app
WORKDIR /app
RUN npm install
RUN npm install -g nodemon
ENV PORT 80
EXPOSE 80
CMD ["npm","start"]
