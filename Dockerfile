# User node base image with virstion 20 
FROM node:20

# set the proejct working  directory
WORKDIR /

# copy the package.json and package-lock.json to the working directory
COPY package*.json ./

# run npm install to install the dependencies
RUN npm install

#COPY the rest of the files to the working directory
COPY . . 

# build the  code using webpack
RUN npm run build


# Expose the port that your app runs on
EXPOSE ${PORT}

# Define the command to run your app
CMD ["node", "dist/index.js"]