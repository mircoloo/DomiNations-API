FROM node
LABEL authors="Filippo Benedetti"
WORKDIR /app
COPY package.json /app
RUN npm i
COPY . /app
ENTRYPOINT ["npm", "start"]