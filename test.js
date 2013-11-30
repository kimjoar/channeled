describe('channeled', function() {

    it('calls onopen when socket is opened', function() {
        var socket = {};
        var channels = channeled(socket);

        channels.onopen = sinon.spy();

        socket.onopen();

        expect(channels.onopen.callCount).toBe(1);
    });

    it('calls onerror when socket fails', function() {
        var socket = {};
        var channels = channeled(socket);

        channels.onerror = sinon.spy();

        socket.onerror();

        expect(channels.onerror.callCount).toBe(1);
    });

    it('sends data on an event', function() {
        var socket = {
            send: sinon.spy()
        };

        var channels = channeled(socket);
        var data = { test: 'something' };

        channels.send('test', data);

        var expected = JSON.stringify({ event: 'test', data: { test: 'something' } });

        expect(socket.send.callCount).toBe(1);
        expect(socket.send.firstCall.args[0]).toEqual(expected);
    });

    describe('when subscribed', function() {

        it('sends a subscribe event', function() {
            var socket = {
                send: sinon.spy()
            };

            var channels = channeled(socket);

            channels.subscribe('channel');

            var expected = JSON.stringify({ event: 'subscribe', data: { channel: 'channel' } });

            expect(socket.send.lastCall.args[0]).toEqual(expected);
        });

        it('sends an unsubscribe event when closing', function() {
            var socket = {
                send: sinon.spy()
            };

            var channels = channeled(socket);

            var channel = channels.subscribe('channel');

            channel.close();

            var expected = JSON.stringify({ event: 'unsubscribe', data: { channel: 'channel' } });

            expect(socket.send.lastCall.args[0]).toEqual(expected);
        });

        it('can send messages on the channel', function() {
            var socket = {
                send: sinon.spy()
            };

            var channels = channeled(socket);

            var channel = channels.subscribe('channel');

            channel.send("test", { some: 'data' });

            var expected = JSON.stringify({ channel: 'channel', event: 'test', data: { some: 'data' }});

            expect(socket.send.lastCall.args[0]).toEqual(expected);
        });

    });

});
