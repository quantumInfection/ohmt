import os
from functools import wraps
from flask import request, jsonify, make_response
from supabase import create_client, Client
from inspect import signature
from flask_cors import cross_origin


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
            response = make_response(
                jsonify({"error": "Missing authorization token"}), 401
            )
            return response

        # Remove "Bearer " prefix if present
        if token.startswith("Bearer "):
            token = token[7:]

        # Create a Supabase client
        supabase: Client = create_client(
            os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY")
        )

        # Check if the function expects a 'user' argument
        func_signature = signature(func)
        if "user" in func_signature.parameters:
            # Authenticate with Supabase using the token
            try:
                user = supabase.auth.get_user(token)
                # If authentication is successful, add the user to the kwargs
                kwargs["user"] = user
            except Exception as e:
                response = make_response(
                    jsonify({"error": "Invalid authorization token"}), 401
                )
                return response

        # Call the decorated function
        return func(*args, **kwargs)

    return wrapper
