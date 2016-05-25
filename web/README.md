# Gateway server

To configure your gateway server modify **gateway.config.yml**

### Configuration sample: 

```yml
 # Access to route '/sampleapi' will be granted only for users in role1 OR role2:
 access:
    - url: /sampleapi
      grant:      
         - role1
         - role2
            
 # Define paths, client requests will be forwarded to.
 proxy:
    - rule: '.*/api'
      mapTo: 'https://my.remote.com:3004/api'
      
 # Define rate limiting for any url.
 # Uses https://github.com/jhurliman/node-rate-limiter limiter, so
 # interval and limit options are equal to the node-rate-limiter's (see link below)

 rate: 
 # max 5 requests per minute    
    - paths: ['/login']
      methods: ['post']
      interval: 60000
      limit: 5
```
