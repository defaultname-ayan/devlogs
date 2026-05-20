from fastapi import APIRouter, HTTPException
import httpx
from pydantic import BaseModel
from app.db.database import fetch_user_stats, sync_user_events, get_user_by_username
from apscheduler.schedulers.background import BackgroundScheduler

scehduler = BackgroundScheduler()

router = APIRouter()
class UserSyncRequest(BaseModel):
    username: str

@router.post("/users/sync")
async def sync_user(user: UserSyncRequest):
    url = f"https://api.github.com/users/{user.username}/events/public"

    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "DevPulse",
            },
        )

    if response.status_code == 404:
        raise HTTPException(status_code=404, detail="GitHub user not found")

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=f"GitHub API error: {response.status_code}",
        )

    events = response.json()

    # 2. Find the user in your database
    user_record = await get_user_by_username(user.username)

    if not user_record:
        raise HTTPException(
            status_code=404,
            detail="User not registered. Please register first.",
        )

    # 3. Save all events to the database
    await sync_user_events(user_record.id, events)

    # 4. Build a simplified response for debugging
    parsed_events = []

    for event in events:
        parsed_events.append(
            {
                "github_event_id": event["id"],
                "event_type": event["type"],
                "repo_name": event["repo"]["name"],
                "repo_url": event["repo"]["url"],
                "payload": event["payload"],
                "created_at": event["created_at"],
            }
        )

    return {
        "message": "User events synced successfully",
        "username": user.username,
        "events_fetched": len(parsed_events),
        "events": parsed_events,
    }


@router.get("/users/{username}/stats")
async def get_user_stats(username: str):
    # Optional: verify the GitHub user exists
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://api.github.com/users/{username}/events/public"
        )

        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail="GitHub user not found",
            )

    # Fetch stats from your database
    user_stats = await fetch_user_stats(username)

    if not user_stats:
        raise HTTPException(
            status_code=404,
            detail="User stats not found",
        )

    return {
        "username": username,
        "stats": user_stats,
    }