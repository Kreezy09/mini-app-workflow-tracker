from uuid import uuid4


def generate_tracking_number():
    return f"APP-{uuid4().hex[:12].upper()}"
