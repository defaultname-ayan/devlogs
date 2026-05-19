from fastapi import APIRouter, HTTPException
from google import genai
from dotenv import load_dotenv
import os
from pathlib import Path

from backend.app.db.database import fetch_user_stats

router = APIRouter()

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_FILE)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

gemini = genai.Client(api_key=GEMINI_API_KEY)


@router.get("/genai/{username}")
async def generate_ai_response(username: str):
    stats = await fetch_user_stats(username)

    if not stats:
        raise HTTPException(
            status_code=404,
            detail="User not found or no stats available",
        )

    prompt = f"""
You are an expert engineering manager.

Analyze the following GitHub activity for the developer "{username}".

Statistics:
- Total events: {stats["total_events"]}

Events by type:
{stats["events_by_type"]}

Events by repository:
{stats["events_by_repo"]}

Write a concise 4-6 sentence summary covering:
1. Overall activity level
2. Most common type of work
3. Most active repository
4. Productivity insights
5. One constructive recommendation
"""

    response = gemini.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return {
        "username": username,
        "digest": response.text,
    }