from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import os

from dotenv import load_dotenv
import openai

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_message = data.get("message")

    if not user_message:
        return {"error": "No message provided"}

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        reply = response.choices[0].message.content.strip()
        return {"response": reply}
    except Exception as e:
        return {"error": str(e)}
