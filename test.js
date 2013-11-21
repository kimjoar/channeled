describe('channeled', function() {

    it('calls onopen when socket is opened', function() {
        var socket = {};
        var cSocket = channeled(socket);

        cSocket.onopen = sinon.spy();

        socket.onopen();

        expect(cSocket.onopen.callCount).toBe(1);
    });

    it('calls onerror when socket fails', function() {
        var socket = {};
        var cSocket = channeled(socket);

        cSocket.onerror = sinon.spy();

        socket.onerror();

        expect(cSocket.onerror.callCount).toBe(1);
    });

    it('sends data on an event', function() {
        var socket = {
            send: sinon.spy()
        };

        var cSocket = channeled(socket);
        var data = { test: 'something' };

        cSocket.send('test', data);

        var expected = { event: 'test', data: { test: 'something' } };

        expect(socket.send.callCount).toBe(1);
        expect(socket.send.firstCall.args[0]).toEqual(expected);
    });

    describe('when subscribed', function() {

        it('sends a subscribe event', function() {
            var socket = {
                send: sinon.spy()
            };

            var cSocket = channeled(socket);

            cSocket.subscribe('channel');

            var expected = { event: 'subscribe', data: { channel: 'channel' } };

            expect(socket.send.lastCall.args[0]).toEqual(expected);
        });

        it('sends an unsubscribe event when closing', function() {
            var socket = {
                send: sinon.spy()
            };

            var cSocket = channeled(socket);

            var ch = cSocket.subscribe('channel');

            ch.close();

            var expected = { event: 'unsubscribe', data: { channel: 'channel' } };

            expect(socket.send.lastCall.args[0]).toEqual(expected);
        });

    });

});
