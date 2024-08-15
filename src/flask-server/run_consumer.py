from tasks import consume_stream

if __name__ == '__main__':
    # Start multiple consumers with different names
    consume_stream.delay('consumer1')
    consume_stream.delay('consumer2')
    consume_stream.delay('consumer3')
