from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Anomaly Detection CCTV"
    PROJECT_VERSION: str = "1.0.0"
    CORS_ORIGINS: List[str] = ["*"]
    
    # Model settings
    MODEL_PATH: str = "ml/saved_models/autoencoder.pth"
    
    class Config:
        env_file = ".env"

settings = Settings()
