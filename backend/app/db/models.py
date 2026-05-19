import sqlalchemy as sa

metadata = sa.MetaData()

user = sa.Table(
    'users',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True, index=True),
    sa.Column('github_username', sa.String, unique=True, nullable=False),
    sa.Column('created_at', sa.DateTime, server_default=sa.func.now()),
    sa.Column('last_synced_at', sa.DateTime, server_default=sa.func.now(), onupdate=sa.func.now())
)

event = sa.Table(
    'events',
    metadata,
    sa.Column('id', sa.Integer, primary_key=True, index=True),
    sa.Column('user_id', sa.Integer, sa.ForeignKey('users.id'), nullable=False),
    sa.Column('event_type', sa.String, nullable=False),
    sa.Column('repo_name', sa.String, nullable=False),
    sa.Column('payload', sa.JSON, nullable=False),
    sa.Column('event_ts', sa.DateTime, server_default=sa.func.now(), index=True)
)
