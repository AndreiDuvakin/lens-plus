"""добавил тип линзы у содержимого отчета

Revision ID: 15df0d2bfad5
Revises: a5c09be17888
Create Date: 2025-02-20 19:51:20.196094

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '15df0d2bfad5'
down_revision: Union[str, None] = 'a5c09be17888'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('set_contents', sa.Column('type_id', sa.Integer(), nullable=False))
    op.create_foreign_key(None, 'set_contents', 'lens_types', ['type_id'], ['id'])
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'set_contents', type_='foreignkey')
    op.drop_column('set_contents', 'type_id')
    # ### end Alembic commands ###
