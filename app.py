from flask import Flask, jsonify, render_template
import json

app = Flask(__name__)

with open("questions.json", encoding="utf-8") as f:
    questions = json.load(f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/finish")
def result():
    return render_template("finish.html")

@app.route("/api/questions/<category>")
def get_questions(category):
    # Приводим категорию к нижнему регистру для сопоставления с ключами JSON
    category_key = category.lower()
    return jsonify(questions.get(category_key, []))

if __name__ == "__main__":
    app.run(debug=True)