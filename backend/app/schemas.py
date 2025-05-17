from pydantic import BaseModel, EmailStr

class ContactForm(BaseModel):
    fname: str
    lname: str
    email: EmailStr
    phone_number: str
    message: str
    servicechoice: str
