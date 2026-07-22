import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Leer dataset
df = pd.read_csv("student-mat.csv", sep=";")

# Variable objetivo
df["Resultado"] = (df["G3"] >= 10).astype(int)

# Eliminar G3
df = df.drop(columns=["G3"])
# Eliminar variables de baja importancia
df = df.drop(columns=[
    "Fjob",
    "guardian",
    "reason",
    "activities",
    "Mjob",
    "school",
    "nursery",
    "famsup"
])

# Guardar nombres de columnas de entrada
columnas = df.drop(columns=["Resultado"]).columns.tolist()

# Codificar variables categóricas
encoders = {}

categoricas = df.select_dtypes(include=["object"]).columns

for col in categoricas:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    encoders[col] = le

# Variables independientes y objetivo
X = df.drop(columns=["Resultado"])
y = df["Resultado"]

# División entrenamiento/prueba
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

# Modelo
modelo = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

modelo.fit(X_train, y_train)

pred = modelo.predict(X_test)

print(f"Accuracy: {accuracy_score(y_test, pred):.4f}")

# Crear carpeta models
os.makedirs("models", exist_ok=True)

# Guardar archivos
joblib.dump(modelo, "models/random_forest.pkl")
joblib.dump(encoders, "models/encoder.pkl")
joblib.dump(columnas, "models/columns.pkl")

print("Modelo entrenado y guardado correctamente.")