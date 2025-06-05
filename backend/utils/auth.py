from fastapi import HTTPException, status
from jose import jwt
from jose.exceptions import JWTError
import requests
from dotenv import load_dotenv
import os

load_dotenv()

COGNITO_REGION = os.getenv("COGNITO_REGION")      
USER_POOL_ID = os.getenv("USER_POOL_ID")          
APP_CLIENT_ID = os.getenv("APP_CLIENT_ID")            

# JWKS URL for the Cognito User Pool and retrieving info
JWKS_URL = f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}/.well-known/jwks.json"

# Cache JWKS
jwks = requests.get(JWKS_URL).json()

def get_public_key(token: str):
    try:
        headers = jwt.get_unverified_headers(token)
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid JWT token: unable to decode headers."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Unexpected error reading token headers: {str(e)}"
        )
    kid = headers["kid"]
    for key in jwks["keys"]:
        if key["kid"] == kid:
            return key
    raise HTTPException(status_code=401, detail="Public key not found.")


def verify_cognito_token(token: str):
    public_key = get_public_key(token)
    try:
        claims = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=APP_CLIENT_ID,  
            issuer=f"https://cognito-idp.{COGNITO_REGION}.amazonaws.com/{USER_POOL_ID}"
        )
        return claims
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {e}")