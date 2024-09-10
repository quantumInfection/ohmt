from flask import Flask
from db.cloud_db import CloudDB

app = Flask(__name__)


@app.route("/")
def public():
    return "Hello, World!"


@app.route("/cloud-db")
def test_cloud_db():
    with CloudDB() as cursor:
        cursor.execute("SELECT 1 + 1 AS result")
        result = cursor.fetchone()[0]

    return str(result)


if __name__ == "__main__":
    app.run()
