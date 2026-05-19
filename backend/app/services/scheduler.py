from apscheduler.schedulers.asyncio import AsyncIOScheduler
import httpx

from backend.app.db.database import (
    see_users,
    get_user_by_username,
    sync_user_events,
)

scheduler = AsyncIOScheduler()


async def sync_all_users():
    """
    This function runs automatically on a schedule.

    Steps:
    1. Fetch all registered users from the database.
    2. For each user:
       - Call GitHub API.
       - Fetch public events.
       - Save events to the database.
    """
    print("Starting scheduled GitHub sync...")

    users = await see_users()

    async with httpx.AsyncClient(timeout=30.0) as client:
        for user_row in users:
            username = user_row.github_username

            try:
                print(f"Syncing {username}...")

                
                response = await client.get(
                    f"https://api.github.com/users/{username}/events/public",
                    headers={
                        "Accept": "application/vnd.github+json",
                        "User-Agent": "DevPulse",
                    },
                )

               
                if response.status_code != 200:
                    print(
                        f"Failed to fetch events for {username}. "
                        f"Status code: {response.status_code}"
                    )
                    continue

                events = response.json()

             
                user_record = await get_user_by_username(username)

                if not user_record:
                    print(f"User {username} not found in database.")
                    continue

               
                await sync_user_events(user_record.id, events)

                print(
                    f"Successfully synced {len(events)} events "
                    f"for {username}"
                )

            except Exception as e:
                print(f"Error syncing {username}: {e}")

    print("Scheduled GitHub sync completed.")


def start_scheduler():
    """
    Start the scheduler and register jobs.
    """
    if scheduler.running:
        return

    scheduler.add_job(
        sync_all_users,
        trigger="interval",
        hours=6,
        id="sync_all_users",
        replace_existing=True,
    )

    scheduler.start()
    print("APScheduler started.")


def stop_scheduler():
    """
    Stop the scheduler when the FastAPI app shuts down.
    """
    if scheduler.running:
        scheduler.shutdown()
        print("APScheduler stopped.")