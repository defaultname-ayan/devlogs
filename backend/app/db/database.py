import os
from pathlib import Path
from dotenv import load_dotenv
from .models import user, event, metadata
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from datetime import datetime

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=ENV_FILE)

DB_URI = os.getenv("DB_URI")

if not DB_URI:
    raise ValueError("DB_URI not found in environment variables.")

engine = create_async_engine(
    DB_URI,
    echo=False,
    pool_pre_ping=True,
)

async_session = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.create_all)

async def get_db():
    async with async_session() as session:
        yield session

async def add_user(github_username: str):
    async with async_session() as session:
        query = user.insert().values(github_username=github_username)
        await session.execute(query)
        await session.commit()

async def sync_user_events(user_id: int, events: list):
    async with async_session() as session:
        for event_row in events:
            # Check if this GitHub event already exists
            existing_query = event.select().where(
                event.c.event_id == event_row["id"]
            )
            existing_result = await session.execute(existing_query)
            existing_event = existing_result.fetchone()

            # Skip if already in database
            if existing_event:
                continue

            # Insert new event
            insert_query = event.insert().values(
                user_id=user_id,
                event_id=event_row["id"],
                event_type=event_row["type"],
                repo_name=event_row["repo"]["name"],
                payload=event_row["payload"],
                event_ts=datetime.fromisoformat(
                    event_row["created_at"].replace("Z", "+00:00")
                ).replace(tzinfo=None),
            )

            await session.execute(insert_query)

        await session.commit()
async def get_user_by_username(username: str):
    async with async_session() as session:
        query = user.select().where(
            user.c.github_username == username
        )
        result = await session.execute(query)
        return result.fetchone()
    
async def fetch_user_stats(username: str):
    async with async_session() as session:
        query = user.select().where(user.c.github_username == username)
        result = await session.execute(query)
        user_record = result.fetchone()
        if not user_record:
            return None
        
        user_id = user_record.id
        stats_query = event.select().where(event.c.user_id == user_id)
        stats_result = await session.execute(stats_query)
        events = stats_result.fetchall()

        stats = {
            "total_events": len(events),
            "events_by_type": {},
            "events_by_repo": {}
        }
        
        for event_row in events:
            event_type = event_row.event_type
            repo_name = event_row.repo_name
            
            stats["events_by_type"][event_type] = stats["events_by_type"].get(event_type, 0) + 1
            stats["events_by_repo"][repo_name] = stats["events_by_repo"].get(repo_name, 0) + 1
        
        return stats
async def see_users():
    async with async_session() as session:
        result = await session.execute(user.select())
        users = result.fetchall()
        return users

#dev functions---------------------------------        
async def dev_seetable():
    async with async_session() as session:
        result = await session.execute(user.select())
        users = result.fetchall()
        return users

