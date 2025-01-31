import logging
from app.settings import settings
import os

log_dir = os.path.dirname(settings.LOG_FILE)
os.makedirs(log_dir, exist_ok=True)

logging.basicConfig(
    level=settings.LOG_LEVEL.upper(),
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(settings.LOG_FILE, encoding="utf-8"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)
