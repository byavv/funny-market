var amqp = require('amqplib');
var Client = require('../lib/rabbit');


module.exports = function (app, done) {

    var microserviceName = app.get('ms_name') || 'profile'
    var rabbit_host = app.get("rabbit_host");

    var client = new Client({
        host: `amqp://${rabbit_host}`,
        // host: `amqp://ovozveho:zakIoLeAnbjkOh7ljbjYQHGj7ubSynpC@jellyfish.rmq.cloudamqp.com/ovozveho`,
        name: microserviceName
    })



    client.open().then((rabbit) => {
        app.rabbit = rabbit;
        rabbit.subscribe((message, callback) => {
            switch (message.action) {
                case 'update_car':
                    console.log("update", message.value);
                    callback({ err: null, result: message });
                    break;
                default:
                    callback({ err: "wrong operation" });
                    break;
            }
        })

        /*  setInterval(() => {       
              client.publish('cars', { some: `with_callback` }, true).then((result) => {
                  console.log("got result", result);
              }, (err) => {
                  console.log("got error", err);
              })
          }, 1000)*/

    }, (err) => {
        console.log("ERROR")
    }).catch(console.log)

    app.close = () => {
        client.close();
    };

    done();
};
