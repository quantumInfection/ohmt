import os
from functools import wraps
from flask import request, jsonify, make_response
from supabase import create_client, Client
from inspect import signature
from flask_cors import cross_origin
import services.reads as reads
import services.unit_of_work as suow


def supabase(func):
    """
    Decorator to require authentication using Supabase token.

    Args:
        func: The function to decorate.

    Returns:
        The decorated function.
    """

    @wraps(func)
    @cross_origin()  # Apply the cross_origin decorator
    def wrapper(*args, **kwargs):
        # Get the access token from the request headers or arguments
        token = kwargs.get("token") or (
            request.headers.get("Authorization") if request else None
        )
        if not token:
            return make_response(jsonify({"error": "Missing authorization token"}), 401)

        # Remove "Bearer " prefix if present
        if token.startswith("Bearer "):
            token = token[7:]

        # Create a Supabase client
        supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY")
        )

        # Check if the function expects a 'user' argument
        func_signature = signature(func)
        # Authenticate with Supabase using the token
        sb_user = supabase.auth.get_user(token)
        sb_u = sb_user.user if sb_user else None

        if not sb_u:
            return make_response(jsonify({"error": "Invalid authorization token"}), 401)

        user = reads.user_by_email(suow.DbPoolUnitOfWork(), email=sb_u.email)

        if not user:
            return make_response(jsonify({"error": "Unauthorized"}), 401)

        # If the function expects a 'user' argument, add the user to the kwargs
        if "user" in func_signature.parameters:
            kwargs["user"] = user

        # Call the decorated function
        return func(*args, **kwargs)

    return wrapper
