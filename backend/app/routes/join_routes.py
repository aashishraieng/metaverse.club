# app/routes/join_routes.py
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from app.utils.email_config import send_contact_email

router = APIRouter()

class JoinForm(BaseModel):
    fullname: str
    email: EmailStr
    reg_number: str
    phone_number: str
    department: str
    reason: str  # This corresponds to the "Why do you want to join?" field

@router.post("/join-club")
async def join_club(data: JoinForm):
    print("New join request received:")
    print(f"Name: {data.fullname}")
    print(f"Email: {data.email}")
    print(f"Registration Number: {data.reg_number}")
    print(f"Phone: {data.phone_number}")
    print(f"Department: {data.department}")
    print(f"Reason: {data.reason}")

    email_body = f"""
    <h2>New Join Request from Metaverse Website</h2>
    <p><strong>Name:</strong> {data.fullname}</p>
    <p><strong>Email:</strong> {data.email}</p>
    <p><strong>Registration Number:</strong> {data.reg_number}</p>
    <p><strong>Phone:</strong> {data.phone_number}</p>
    <p><strong>Department:</strong> {data.department}</p>
    <p><strong>Reason:</strong><br>{data.reason}</p>
    """

    await send_contact_email(
        subject="New Join Form Submission - Metaverse Club",
        email_to="Metaverse.lpu@gmail.com",
        body=email_body
    )

    return {"status": "success", "message": "Join request received and email sent."}
