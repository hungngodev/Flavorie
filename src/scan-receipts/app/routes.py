import os
import uuid
from flask import Blueprint, request, jsonify, current_app
from app.tasks import process_receipt_task
from PIL import Image
from app.notification import create_notification


main = Blueprint('main', __name__)

@main.route('/scan-receipts', methods=['POST'])

def scan_receipt():
    if 'receipt' not in request.files:
        return jsonify({"error": "No receipt variables"}), 400
    
    img_file = request.files['receipt']
    # userId = request.form.get('userId')
    # taskId = request.form.get('taskId')
    # if not userId:
    #     return jsonify({"error": "No user found"}), 400
    # if not taskId:
    #     return jsonify({"error": "No task provided"})
    if img_file.name == "":
        return jsonify({"error": "No selected file"}), 400
    try:
        img = Image.open(img_file.stream).convert('RGB')

        final_res = process_receipt_task(img)
        return jsonify(final_res)
        # output_model = use_model(img)
        # structured_data = post_process(output_model)
        # return jsonify(structured_data)

        # file_path = os.path.join('images', img_file.filename)
        # img_file.save(file_path)

        # app, executor = current_app._get_current_object(), current_app.executor

        # future_task = executor.submit_stored(process_receipt_task, img)
        # task_id = str(id(future_task))
        # task_id = str(uuid.uuid4())
        # current_app.task_id = task_id
        # with app.app_context():
        #     create_notification(taskId, userId, 'PENDING', {
        #     'title': 'Start to process'
        # })
        # future_task = executor.submit_stored(taskId, process_receipt_task, img, taskId)


        # socketio = app.socketio
        # socketio.emit('notification', {
        #     'taskId': taskId,
        #     'status': 'PENDING',
        #     'message': {
        #         'title': 'Start to process', 
        #     }
        # })
        # return jsonify({
        #     "message": "Start processing receipts",
        #     "taskId": taskId,
        #     "status": 'PENDING'
        #     }), 202

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# check task status 
@main.route('/task-status/<task_id>', methods=['GET'])
def check_task_status(task_id):
    executor = current_app.executor
    app = current_app._get_current_object()
    socketio = app.socketio
    # task_id = float(task_id)

    # future = None
    # # task = executor.futures._state(task_id)
    # for task in executor.futures._futures:
    #     if str(id(task)) == task_id:
    #         future = task
    #         break
    future = executor.futures._futures.get(task_id)
    if future is None:
            return jsonify({
                "state": "ERROR",
                "error": "Task not found"
            }), 404
    if future.done():
        try:
            result = future.result()
        except Exception as e:
            socketio.emit('notification', {
                        'message': 'Failed to process receipts',
                        'taskId': task_id,
                        'status': 'FAILURE', 
                        'error': str(e)
                    })
            return jsonify({
                        "state": "ERROR",
                        "error": str(e)
                    })
                
        socketio.emit('notification', {
                    'message': 'Process receipts successfully',
                    'taskId': task_id,
                    'status': 'SUCCESS',
                    'result': result
                })

        return jsonify({
                    'state': "SUCCESS", 
                    "result": result
                })
    else:
        return jsonify({
                    'state': 'PENDING'
                })
            # if task.done():
            #     result = task.result()

            #     socketio = current_app.socketio
            #     socketio.emit('notification', {
            #         'message': 'Processed receipts successfully',
            #         'taskId': task_id, 
            #         'status': 'SUCCESS',
            #         'result': result
            #     })
            #     return jsonify({
            #         "state": "SUCCESS",
            #         "result": result
            #     })
            # else:
            #     return jsonify({
            #         "state": "PENDING"
            #     })
        
    # return jsonify({"state": "ERROR", "error": "Task not found"}), 404



