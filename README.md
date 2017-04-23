# lead-service

This is the backend lead service for the Aerodoc Node.js Microservices project. 

Other services: 

Push Configuration Service: https://github.com/cfoskin/push-configuration-service

Sales Agent Service: https://github.com/cfoskin/sales-agent-service

Aerodoc Client: https://github.com/cfoskin/aerodoc-client



API Gateway on Dockerhub: https://hub.docker.com/r/cfoskin/nginx-proxy-local/



## API Docs 

The API documentation is implemented using Swagger UI and can be found at:

        "serverurl/aerodoc/lead-service/docs"

## Running 


Docker Compose:

To run service with all other backend services use Docker Compose with the docker-compose.yaml file. Note: To seed the system with the sales agents data, run the application from the sales agent service, otherwise see swagger documentation for how to post sales agents to RESTful endpoints.

        docker-compose up
        
npm:

To run service on its own Mongo needs to be installed and running.

Install dependencies

    npm install

Start the server

    npm start
   
## Logging

Logging is provided by Winston and uses a Loggly transport to aggregate the logs - A free Loggly account must be created prior to running any of the Aerodoc services. The LOGGLY_TOKEN environment varible must be set for each Aerodoc service to work.

## Running Tests

    npm test
    
## Running Coverage

    npm run coverage
