from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from mangum import Mangum

app = FastAPI()
API_KEY = "your-secret-api-key"

class TextIn(BaseModel):
    text: str

def text_to_binary(text: str) -> str:
    return ' '.join(format(ord(char), '08b') for char in text)

@app.post("/")
async def convert_to_binary(request: Request, x_api_key: str = Header(None)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    data = await request.json()
    binary = text_to_binary(data["text"])
    return JSONResponse({"binary": binary})

handler = Mangum(app)
