from fastapi import APIRouter, Depends
import httpx
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from backend.app.db.database import get_db, dev_seetable, add_user
router = APIRouter()

class User(BaseModel):
    id: int
    username: str

@router.post("/users/register")
async def register_user(user: User):
    ##check if user exists
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.github.com/users/{user.username}/events/public")
    if response.status_code != 200:
        return {"error": "User not found"}
    await add_user(user.username)
    dev_users = await dev_seetable()
    return {"message": "User registered successfully", "users": dev_users}