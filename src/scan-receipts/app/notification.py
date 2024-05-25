import datetime
from flask import current_app

def create_notification(taskId, userId, status, message):
    with current_app.app_context():
        notification = {
        'taskId': taskId, 
        'userId': userId,
        'status': status,
        'message': message,
        'timestamp': datetime.datetime.now()
    }
        print("DB Notifications: ", current_app.db.notifications)

        current_app.db.notifications.insert_one(notification)


def update_notification(taskId, status, message):
    with current_app.app_context():
        current_app.db.notifications.update_one(
        {'taskId': taskId},
        {"$set": {
            "status": status, 
            "message": message,
            "timestamp": datetime.datetime.now()
        }}
        )