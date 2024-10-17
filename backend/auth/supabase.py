

from functools import wraps
from supabase import create_client, Client
import os

def supabase_auth(func):
  """
  Decorator to authenticate with Supabase using a GitHub OAuth token.

  This decorator assumes the following environment variables are set:
    - SUPABASE_URL: The URL of your Supabase project.
    - SUPABASE_ANON_KEY: The anon key of your Supabase project.

  Args:
    func: The function to decorate.

  Returns:
    The decorated function.
  """
  @wraps(func)
  def wrapper(*args, **kwargs):
    # Get the access token from the request headers or arguments
    token = kwargs.get('token') or (args[0].headers.get('Authorization') if args else None)
    if not token:
      return {"error": "Missing authorization token"}, 401

    # Remove "Bearer " prefix if present
    if token.startswith("Bearer "):
      token = token[7:]

    # Create a Supabase client
    supabase: Client = create_client(
        os.environ.get("SUPABASE_URL"),
        os.environ.get("SUPABASE_ANON_KEY")
    )

    # Authenticate with Supabase using the token
    try:
      user = supabase.auth.get_user(token)
      # If authentication is successful, add the user to the kwargs
      kwargs['user'] = user
    except Exception as e:
      return {"error": "Invalid authorization token"}, 401

    # Call the decorated function
    return func(*args, **kwargs)
  return wrapper
