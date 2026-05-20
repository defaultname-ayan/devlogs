from fastapi import APIRouter, HTTPException

from .user import User, register_user
from .sync import UserSyncRequest, sync_user, get_user_stats
from .genai import generate_ai_response

router = APIRouter()


@router.post("/users/analyze")
async def analyze_user(user: UserSyncRequest):
    try:
        try:
            await register_user(User(username=user.username))
        except HTTPException as e:
            if e.status_code not in [400, 409]:
                raise

        await sync_user(UserSyncRequest(username=user.username))

        stats_response = await get_user_stats(user.username)

        digest_response = await generate_ai_response(user.username)

        return {
            "username": user.username,
            "stats": stats_response["stats"],
            "digest": digest_response["digest"],
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )