
2025-11-17 10:59

Tags:

# Revature - Web Dev

### HTML
HTTP: HyperText Transfer Protocol

used to facilitate comms to SERVERS - anything (app/process/program) that is waiting and listening for a request

Client - whatever thing that makes the request and starts the convo

HTTP Requests - header and body

header - meta-data (data about your message)
body - the actual message

```HTML
GET - (S/I) (H) place a req for a resource
POST - (US/NI) (H/B) create a resource from content of the body
PUT - (US/I) (H/B) update (replace content) resource from content of the body
PATCH - (US/I) (H/B) partial update (ammending) resource from content of body
DELETE - (US/I) (H) req that resource is destroyed
OPTIONS - (S/I) (H) req a list of types of reqs that a server can handle/respond
HEAD - (S/I) (H) req only meta-data (header) of the response (as if it were a GET)
```

HTTP Response Codes
1xx - info response
2xx - successful req/op
3xx - redirection (mail forwarding)
4xx - client side errors (sys placing the req)
5xx - server side errors (app answering the req)


# References