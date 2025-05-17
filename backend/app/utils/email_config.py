from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr

conf = ConnectionConfig(
    MAIL_USERNAME="Metaverse.lpu@gmail.com",
    MAIL_PASSWORD="nwpl gkbg tgmv flhk",
    MAIL_FROM="Metaverse.lpu@gmail.com",
    MAIL_FROM_NAME="Metaverse Club",
    MAIL_SERVER="smtp.gmail.com",
    MAIL_PORT=587,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

async def send_contact_email(subject: str, email_to: EmailStr, body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[email_to],
        body=body,
        subtype="html"  # or plain text
    )
    fm = FastMail(conf)
    await fm.send_message(message)
