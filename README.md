## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses using Public Key 
Cryptography and Elliptic Curve Digital Signatures.

Since there is just a single server on the back-end handling transfers, this is clearly very centralized. 
This is an experimental project and it SHOULD NOT be used in a production environment.

Through this project, the user can generate a valid Ethereum address (EIP55 format) and sign transactions from the frontend, 
which will be processed taking into account the signature generated from the private key and the security of never sharing 
it with the back-end.

If you want to go deeper into this area, you can follow this [Ethereum Bootcamp](https://www.alchemy.com/university/courses/ethereum).

### Dev Requirements

- Nodejs 20.x or higher
- npm 11.0.0 or higher
- sqlite3: https://www.sqlite.org/

### Cryptography libraries

- Ethereum Cryptography: https://github.com/ethereum/js-ethereum-cryptography
- EIP55: https://github.com/cryptocoinjs/eip55
 
### Client

The client folder contains a [React 19 app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [Express 5](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the dependencies
3. Run `npm run setup:db` to initialize the sqlite database.
4. Run `npm run dev` to start the server 

The application should connect to the default server port (3042) automatically.
