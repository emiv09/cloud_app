from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from utils.auth import verify_cognito_token

security = HTTPBearer()

PERMITTED_ROLES = ["admin"]

def sanitize_claims(claims: dict) -> dict:
    return {
        "username": claims.get("username"),
        "groups": claims.get("cognito:groups", [])
    }

def has_role(claims: dict, allowed_roles: List[str]) -> bool:
    user_groups = claims.get("cognito:groups", [])
    if not isinstance(user_groups, list):
        user_groups = [user_groups]

    for group in user_groups:
        if group in allowed_roles:
            return True

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access this resource."
    )


def require_roles(allowed_roles: List[str]):
    def dependency(credentials: HTTPAuthorizationCredentials = Depends(security)):
        token = credentials.credentials
        claims = verify_cognito_token(token)
        has_role(claims, allowed_roles)
        return sanitize_claims(claims)  
    return dependency