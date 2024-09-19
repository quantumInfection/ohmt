# Use an official Python runtime as a parent image with a specific version tag
FROM python:3.12.0

ADD requirements.txt /app/requirements.txt
RUN pip install -r /app/requirements.txt

# Set the working directory in the container
WORKDIR /app

# Copy
COPY . /app

# Run the web service on container startup
CMD gunicorn --workers=2 main:app --timeout 60
