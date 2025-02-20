"""сделал у содержания набора тип стороны enum

Revision ID: a5c09be17888
Revises: 0249759985c3
Create Date: 2025-02-20 19:39:57.756998

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = 'a5c09be17888'
down_revision: Union[str, None] = '0249759985c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE set_contents ALTER COLUMN side TYPE sideenum USING CASE "
               "WHEN side = 0 THEN 'LEFT'::sideenum "
               "WHEN side = 1 THEN 'RIGHT'::sideenum END")


def downgrade() -> None:
    op.execute("ALTER TABLE set_contents ALTER COLUMN side TYPE INTEGER USING CASE "
               "WHEN side = 'LEFT' THEN 0 "
               "WHEN side = 'RIGHT' THEN 1 END")
