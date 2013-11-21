(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['eec'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('eec'));
    } else {
        // Browser globals (root is window)
        root.channeled = factory(root.eec);
    }

}(this, function (eec) {
    'use strict';

    return function(socket) {
        var events = eec();

        socket.onopen = function() {
            api.onopen.apply(api, arguments);
        };

        socket.onmessage = function(e) {
            var json = e.data;
            events.emit(json.channel, json.event, json.data);
        };

        socket.onerror = function() {
            api.onerror.apply(api, arguments);
        };

        var send = function(event, data) {
            socket.send({ event: event, data: data });
        };

        var api = {
            onopen: function() {},
            onerror: function() {},
            send: send,

            subscribe: function(channel) {
                send('subscribe', { channel: channel });

                return {
                    send: function(event, data) {
                        socket.send({ channel: channel, event: event, data: data });
                    },

                    on: function(event, callback) {
                        if (!events.has(channel, event, callback)) {
                            events.on(channel, event, callback);
                        }
                    },

                    close: function() {
                        send('unsubscribe', { channel: channel });
                        events.off(channel);
                    }
                };
            }
        };

        return api;
    };

}));
