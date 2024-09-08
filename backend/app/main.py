from fastapi import FastAPI
from app import newapp  # Make sure this import path is correct

app = FastAPI(
    title="DCF AI",
    description="DCF AI",
    version="0.0.1",
    license_info={
        "name": "MIT",
        "url": "https://opensource.org/licenses/MIT",
    },
)

@app.get("/")
async def health():
    return {"message": "server is up and running!"}


# add routers
app.include_router(newapp.router, prefix="/api")
