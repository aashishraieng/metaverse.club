from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.utils.google_sheets import append_row

router = APIRouter()

class RegistrationData(BaseModel):
    name: str
    reg_number: str
    email: EmailStr
    department: str
    contact_number: str


@router.post("/register")
async def register_user(data: RegistrationData):
    try:
        # Map frontend fields directly into row to append
        row = [
            data.name,
            data.reg_number,
            data.email,
            data.department,
            data.contact_number
        ]

        append_row(row, sheet_name="Sheet1")
        return {"message": "Registration successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error saving data: {str(e)}")