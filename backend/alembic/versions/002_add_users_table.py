"""Add users table for authentication (SQLite compatible)

Revision ID: 002
Revises: 001
Create Date: 2026-01-12

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create users table (SQLite compatible)
    op.create_table(
        'users',
        sa.Column('id', sa.String(36), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('CURRENT_TIMESTAMP')),
    )

    # Create index on email for faster lookups
    op.create_index('idx_users_email', 'users', ['email'], unique=True)


def downgrade() -> None:
    # Drop index
    op.drop_index('idx_users_email', 'users')

    # Drop table
    op.drop_table('users')
