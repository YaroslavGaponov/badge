FROM node:14
WORKDIR /usr/src/app
COPY . .
RUN npm install
RUN npm run build
ENV NODE_ENV=development
ENV PORT=8888
ENV GIT_LAB_BASE_URL=
ENV GIT_LAB_TOKEN=
EXPOSE 8888
CMD [ "npm", "run", "server" ]
