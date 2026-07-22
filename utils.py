import joblib
import pandas as pd

modelo = joblib.load("models/random_forest.pkl")
encoders = joblib.load("models/encoder.pkl")
columnas = joblib.load("models/columns.pkl")


def preparar_datos(datos):

    df = pd.DataFrame([datos])

    for col in encoders:
        df[col] = encoders[col].transform(df[col])
    df = df[columnas]

    return df


def predecir(datos):

    df = preparar_datos(datos)

    pred = modelo.predict(df)[0]

    return pred