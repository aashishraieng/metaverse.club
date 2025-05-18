from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from utils.email_config import send_contact_email

router = APIRouter()

class ContactForm(BaseModel):
    fname: str
    lname: str
    email: EmailStr
    phone_number: str
    message: str
    servicechoice: str

@router.post("/contact-club")
async def contact_club(data: ContactForm):
    print("New contact message received:")
    print(f"Name: {data.fname} {data.lname}")
    print(f"Email: {data.email}")
    print(f"Phone: {data.phone_number}")
    print(f"Service choice: {data.servicechoice}")
    print(f"Message: {data.message}")

    # Prepare email content (can use HTML or plain text)
    email_content = f"""
    <h2>New Contact Message from Metaverse Club</h2>
    <p><strong>Name:</strong> {data.fname} {data.lname}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Phone Number:</strong> {data.phone_number}</p>
    <p><strong>Service Choice:</strong> {data.servicechoice}</p>
    <p><strong>Message:</strong><br>{data.message}</p>
    """

    # Send email to your official club email
    await send_contact_email(
        subject="New Contact Message from Metaverse Website",
        email_to="Metaverse.lpu@gmail.com",
        body=email_content
    )

    return {"status": "success", "message": "Contact form received and email sent."}
