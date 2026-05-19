import asyncio
from .database import create_tables

asyncio.run(create_tables())
print("Tables created successfully!")