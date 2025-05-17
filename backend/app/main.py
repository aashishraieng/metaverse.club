import uvicorn
from dotenv import load_dotenv
from os import getenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import contact_routes
from routes import join_routes
from routes import payment_routes  # NEW

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[getenv("FRONTEND_ORIGIN")],# Change to your frontend origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact_routes.router, prefix="/api/v1")
app.include_router(join_routes.router, prefix="/api/v1")
app.include_router(payment_routes.router, prefix="/api/v1")  # NEW

@app.get("/")
async def root():
    return {"message": "Welcome to Metaverse API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=6500)

