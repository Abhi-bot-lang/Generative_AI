from fastapi import FastAPI

from routes import router
from ai import generate_response
from database import engine, Base
import models


# Create DB tables if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(router)