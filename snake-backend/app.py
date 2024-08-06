from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

high_scores = []

@app.route('/highscore', methods=['POST'])
def save_highscore():
    score = request.json.get('score')
    if score is not None:
        high_scores.append(score)
        return jsonify({'message': 'Score saved!'}), 201
    else:
        return jsonify({'message': 'Invalid score!'}), 400

@app.route('/highscores', methods=['GET'])
def get_highscores():
    if len(high_scores) > 0:
        return jsonify(max(high_scores)), 200
    return 0

if __name__ == '__main__':
    app.run(debug=True)
