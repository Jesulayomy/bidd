# Bidd
This project is a web application designed to have real time updates with bidding systems it uses sockets to update all pages when an event is found.

**Link to project:** [Project Link](https://bidds-f07323a23e59.herokuapp.com/)

![Project HomePage](/public/img/home.png)

## How It's Made:

**Tech used:** HTML, CSS, JavaScript, ejs, Node.js, MongoDB, Heroku

The application was built using ejs and bootstrap for the front end, providing a responsive user interface. The back end is powered by Node.js and Express, with MongoDB as the database to store user data and item information.

## Optimizations
I used the socket.io library to enable real time updates of bid changes through an emitter and listener model.

## Lessons Learned:

I learned more about socket IO, emitting and listening for events and heroku.

```javascript
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('bid', (data) => {
    // ...
    io.emit('bid', { data: returnedData })
  });
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
```


## Other projects

- [Homez](https://github.com/Jesulayomy/homez)
- [Shelf Sync](https://github.com/Jesulayomy/shelf-sync)
