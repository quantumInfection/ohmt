""" Helper functions for DigitalOcean Spaces """

import os

import boto3

session = boto3.session.Session()
client = session.client(
    "s3",
    region_name="syd1",
    endpoint_url="https://ohmt.syd1.digitaloceanspaces.com",
    aws_access_key_id=os.environ.get("SPACES_KEY"),
    aws_secret_access_key=os.environ.get("SPACES_SECRET"),
)


def get_signed_urls_for_images(prefix: str, filenames: list) -> dict:
    """
    Get signed URLs for files in Spaces

    :param prefix: path prefix, like equipments/123
    :param filenames: list of filenames
    :return: dict[filename, signed url] of signed URLs
    """

    signed_urls = {}
    for filename in filenames:
        url = client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": "images",  # Replace with your Space name
                "Key": f"{prefix}/{filename}",  # Customize the path as needed
            },
            ExpiresIn=3600,  # URL expiration time in seconds
        )
        signed_urls[filename] = url

    return signed_urls


def get_signed_url_for_pdfs(prefix: str, filename: str) -> str:
    """
    Get signed URL for a file in Spaces

    :param prefix: path prefix, like calibrations/123
    :param filename: filename
    :return: signed URL
    """

    url = client.generate_presigned_url(
        ClientMethod="put_object",
        Params={
            "Bucket": "pdfs",  # Replace with your Space name
            "Key": f"{prefix}/{filename}",  # Customize the path as needed
        },
        ExpiresIn=3600,  # URL expiration time in seconds
    )

    return url
