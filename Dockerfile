FROM node:20-alpine3.16
WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install 
COPY src ./src
COPY client.ts .
COPY singleton.ts .
COPY prisma ./prisma
RUN npx prisma generate
RUN npx tsc
EXPOSE 4002
CMD ["npm", "start"]
