const net = require('net');
const Parser = require('redis-parser')


const store={}
const server = net.createServer(connection => {
    connection.on('data', data => {
        const parser = new Parser({
            returnReply: (reply) => {
                const command=reply[0];
                switch(command){
                    case 'set':{
                        const key=reply[1];
                        const value=reply[2];
                        store[key]=value;
                        connection.write('+OK\r\n')
                    }
                    case 'get':{
                        const key=value[1];
                        const value =store[key];
                       if(!value) connection.write('$-1\r\n');
                       else connection.write(`$${value.length}\r\n${value}\r\n`)
                    }
                    break;
                }
            },
            returnError: (err) => {
                console.log(err);
            }
        })
        parser.execute(data);
    })
})

server.listen(8000, () => {
    console.log("custom server is running on port 8000")
})