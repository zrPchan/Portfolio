from flask import Flask, render_template, request, jsonify
from pathlib import Path
import json
from datetime import datetime

app = Flask(__name__)

@app.get("/")
def home():
    return render_template("home.html")

@app.get("/login")
def login():
    return render_template("login.html")

@app.get("/signup")
def signup():
    return render_template("signup.html")

if __name__ == "__main__":
    app.run(debug=True, port=5000)