from flask import render_template, flash, redirect, jsonify, url_for
from app import app
from .forms import LoginForm

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('base.html')