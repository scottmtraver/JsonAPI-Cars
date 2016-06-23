const jsonApiSerializer = require('fortune-json-api')

const fortune = require('fortune')

const store = fortune({
  car: {
    year: { type: Number },
    model: { type: String },
    make: { type: String },
    miles: { type: Number },
    description: { type: String },

    // Following and followers are inversely related (many-to-many).
    seller: { link: 'seller', isArray: false }
  },
  seller: {
    name: { type: String },
    rating: { type: Number },

    // One-to-many relationship of post author to user posts.
    car: { link: 'car', isArray: true }
  }
});


const http = require('http')

// `instance` is an instance of Fortune.js.
const listener = fortune.net.http(store, {
  serializers: [
    // The `options` object here is optional.
    [ jsonApiSerializer, { prefix: 'http://localhost:3000/' } ]
  ]
})
// The listener function may be used as a standalone server, or
// may be composed as part of a framework.
const server = http.createServer(listener)

server.listen(3000);

//seed sellers and cars
store.request({
  type: 'seller',
  method: 'create',
  payload: [ { name: 'Bob', rating: 4 }, { name: 'Mary', rating: 5 } ]
})

store.request({
  type: 'car',
  method: 'create',
  payload: [ {
    year: 2015,
    model: 'Model S',
    make: 'Tesla',
    miles: 1200,
    description: 'Awesome car!'
  }]
})
