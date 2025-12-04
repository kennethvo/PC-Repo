HTTP: HyperText Transfer Protocol

Used to facilitate communication to SERVERS - anything (application/process/program) that is waiting and listening for a request

Client - whatever thing (person, application, process) that makes the request, and starts the conversation

HTTP Requests - HEADER and BODY

HEADER - Meta-data (the data about your message)
BODY - The actual message

HTTP Methods/HTTP Verbs -
GET     - (S/I)   - (H) - Place a request for a resource
POST    - (US/NI) - (H/B) - Create (new content) a resource from the content of the body
PUT     - (US/I)  - (H/B) - Update (replace content) a rescource from the content of the body
PATCH   - (US/I)  - (H/B) - Partial Update (ammending content) a resouce from the content of the body
DELETE  - (US/I)  - (H) - Request that a resource be destroyed
OPTIONS - (S/I)   - (H) - Request a list of the types of requests that a server can handle/respond
HEAD    - (S/I)   - (H) - Requesting only the meta-data (header) of the response (as if it were a GET request)

HTTP Response Codes:
1xx - Informational response 
2xx - Successfull request/operation
3xx - Redirection (mail-forwarding)
4xx - Client side errors (the system placing the request)
5xx - Server side errors (the application answering the request)

