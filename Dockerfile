FROM node:20

WORKDIR /app

COPY package*.json ./ 

RUN npm install

COPY . .

ENV DATABASE_URL="mongodb+srv://readwrite:LLa23QV06wvjt8SK@locallibrary.qbajug5.mongodb.net"
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]
