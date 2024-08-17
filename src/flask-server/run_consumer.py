from tasks import handle_receipts_stream

if __name__ == '__main__':
    # Start multiple consumers with different names
    handle_receipts_stream.delay('consumer1')
    handle_receipts_stream.delay('consumer2')
    handle_receipts_stream.delay('consumer3')
