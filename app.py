from flask import Flask, render_template, request, jsonify

from utils import predecir

app = Flask(__name__)


@app.route("/")
def inicio():
    return render_template("index.html")


@app.route("/predecir", methods=["POST"])
def prediccion():

    datos = request.get_json()

    resultado = predecir(datos)

    return jsonify({
        "resultado": int(resultado)
    })


if __name__ == "__main__":
    app.run(debug=True)