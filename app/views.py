from flask import render_template, flash, redirect, jsonify, url_for
from app import app

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('base.html')