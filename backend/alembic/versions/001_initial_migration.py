"""Initial migration - create todos table

Revision ID: 001
Revises:
Create Date: 2026-01-11

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create enum types
    op.execute("CREATE TYPE todo_status AS ENUM ('pending', 'completed')")
    op.execute("CREATE TYPE todo_priority AS ENUM ('high', 'medium', 'low')")

    # Create todos table
    op.create_table(
        'todos',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('title', sa.String(500), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('status', postgresql.ENUM('pending', 'completed', name='todo_status'), nullable=False, server_default='pending'),
        sa.Column('priority', postgresql.ENUM('high', 'medium', 'low', name='todo_priority'), nullable=False, server_default='medium'),
        sa.Column('tags', postgresql.ARRAY(sa.String(50)), nullable=False, server_default='{}'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('NOW()')),
        sa.CheckConstraint("length(trim(title)) > 0", name='title_not_empty'),
        sa.CheckConstraint("description IS NULL OR length(description) <= 2000", name='description_length'),
        sa.CheckConstraint("array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 20", name='tags_count'),
    )

    # Create indexes
    op.create_index('idx_todos_status', 'todos', ['status'])
    op.create_index('idx_todos_priority', 'todos', ['priority'])
    op.create_index('idx_todos_created_at', 'todos', ['created_at'], postgresql_ops={'created_at': 'DESC'})
    op.create_index('idx_todos_tags', 'todos', ['tags'], postgresql_using='gin')

    # Create full-text search indexes
    op.execute("""
        CREATE INDEX idx_todos_title_search ON todos
        USING gin(to_tsvector('english', title))
    """)
    op.execute("""
        CREATE INDEX idx_todos_description_search ON todos
        USING gin(to_tsvector('english', COALESCE(description, '')))
    """)

    # Create trigger for auto-updating updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
    """)

    op.execute("""
        CREATE TRIGGER update_todos_updated_at
        BEFORE UPDATE ON todos
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    """)


def downgrade() -> None:
    # Drop trigger and function
    op.execute("DROP TRIGGER IF EXISTS update_todos_updated_at ON todos")
    op.execute("DROP FUNCTION IF EXISTS update_updated_at_column()")

    # Drop indexes
    op.drop_index('idx_todos_description_search', 'todos')
    op.drop_index('idx_todos_title_search', 'todos')
    op.drop_index('idx_todos_tags', 'todos')
    op.drop_index('idx_todos_created_at', 'todos')
    op.drop_index('idx_todos_priority', 'todos')
    op.drop_index('idx_todos_status', 'todos')

    # Drop table
    op.drop_table('todos')

    # Drop enum types
    op.execute("DROP TYPE IF EXISTS todo_priority")
    op.execute("DROP TYPE IF EXISTS todo_status")
