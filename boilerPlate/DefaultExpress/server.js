const app = require('./app');
const http = require('http');
const configLoader = require("./lib/configLoader");

configLoader('NodeServerBoilerPlate.conf', 'c').then(config => {
    const port = normalizePort(process.env.HTTP_PORT || process.env.npm_package_config_port || '3005');
    const ip = process.env.HTTP_IP || process.env.npm_package_config_ip || '127.0.0.1';

    app.set('port', port);
    app.set('ip', ip);

    console.log('=====================================================================');
    console.log('server start: http://' + ip + ':' + port);
    console.log('server get config: ', config);

    /**
     * Create HTTP server.
     */
    let server = http.createServer(app);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, ip);
    server.on('error', onError);
    server.on('listening', onListening);
    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        let port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
        console.log('server start error');
        console.log('=====================================================================');
        if (error.syscall !== 'listen') {
            throw error;
        }
        let bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
        let addr = server.address();
        let bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        console.log('server start success');
        console.log('=====================================================================');
    }
}, (err) => {
    console.log('server start error: ', err);
});