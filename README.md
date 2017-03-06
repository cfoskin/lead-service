# lead-service

This is the backend lead service for the Aerodoc Node.js Microservices project. 

##Running 


Docker Compose:

To run service with all other backend services use Docker Compose with the docker-compose.yaml file.

        docker-compose up
        
npm:

To run service on its own Mongo needs to be installed and running.

Install dependencies

    npm install

Start the server

    npm start
   
##Logging

Logging is provided by Winston and uses a Loggly transport to aggregate the logs - A free Loggly account must be created prior to running any of the Aerodoc services. The LOGGLY_TOKEN environment varible must be set for each Aerodoc service to work.

##Running Tests

    npm test
    
##Running Coverage

    npm run coverage
