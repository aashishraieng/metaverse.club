from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM"),
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME"),
    MAIL_SERVER = os.getenv("MAIL_SERVER"),
    MAIL_PORT = int(os.getenv("MAIL_PORT")),
    MAIL_STARTTLS = os.getenv("MAIL_STARTTLS") == "True",
    MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS") == "True",
    USE_CREDENTIALS = True,
    VALIDATE_CERTS = True,
)

async def send_contact_email(contact_data: dict):
    message = MessageSchema(
        subject="New Contact Form Submission",
        recipients=[conf.MAIL_USERNAME],  # Your own email to receive messages
        body=f"""
New contact form received:

Name: {contact_data['fname']} {contact_data['lname']}
Email: {contact_data['email']}
Phone: {contact_data['phone_number']}
Service Choice: {contact_data['servicechoice']}

Message:
{contact_data['message']}
        """,
        subtype="plain"
    )

    fm = FastMail(conf)
    await fm.send_message(message)
