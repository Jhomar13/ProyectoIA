# -*- coding: utf-8 -*-

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import confusion_matrix, roc_curve, roc_auc_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import plot_tree

# =====================================
# Cargar dataset
# =====================================

dataset = pd.read_csv("student-mat.csv", sep=";")

# =====================================
# Variable objetivo
# =====================================

dataset["Resultado"] = (dataset["G3"] >= 10).astype(int)

# =====================================
# Variables predictoras
# =====================================

X = dataset.drop(columns=["G3", "Resultado"])
y = dataset["Resultado"]

# Convertir variables categóricas

X = pd.get_dummies(X, drop_first=True)

feature_names = X.columns

# =====================================
# División entrenamiento/prueba
# =====================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# =====================================
# Normalización
# =====================================

scaler = MinMaxScaler()

X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# =====================================
# Modelo Random Forest
# =====================================

model = RandomForestClassifier(
    n_estimators=15,
    max_depth=4,
    criterion="entropy",
    random_state=42
)

model.fit(X_train, y_train)

# =====================================
# Predicciones
# =====================================

y_pred = model.predict(X_test)

# ==========================================================
# 1. MATRIZ DE CONFUSIÓN
# ==========================================================

cm = confusion_matrix(y_test, y_pred)

plt.figure(figsize=(7,5))

sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="rocket",
    xticklabels=["No Aprueba","Aprueba"],
    yticklabels=["No Aprueba","Aprueba"]
)

plt.title("Matriz de Confusión")
plt.xlabel("Predicción")
plt.ylabel("Real")

plt.tight_layout()
plt.show()

# ==========================================================
# 2. CURVA ROC
# ==========================================================

y_prob = model.predict_proba(X_test)[:,1]

auc = roc_auc_score(y_test, y_prob)

fpr, tpr, _ = roc_curve(y_test, y_prob)

plt.figure(figsize=(7,5))

plt.plot(
    fpr,
    tpr,
    color="darkorange",
    linewidth=2,
    label=f"AUC = {auc:.2f}"
)

plt.plot([0,1],[0,1],"--")

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.title("Curva ROC")
plt.legend(loc="lower right")

plt.tight_layout()
plt.show()

# ==========================================================
# 3. VISUALIZAR UN ÁRBOL DEL BOSQUE
# ==========================================================

plt.figure(figsize=(24,16))

plot_tree(
    model.estimators_[0],
    feature_names=feature_names,
    class_names=["No Aprueba","Aprueba"],
    filled=True,
    rounded=True,
    fontsize=8
)

plt.title("Árbol de Decisión del Random Forest")

plt.show()

# ==========================================================
# 4. IMPORTANCIA DE VARIABLES
# ==========================================================

importancias = pd.DataFrame({
    "Variable": feature_names,
    "Importancia": model.feature_importances_
})

importancias = importancias.sort_values(
    by="Importancia",
    ascending=False
)

print(importancias)

plt.figure(figsize=(12,8))

plt.barh(
    importancias["Variable"],
    importancias["Importancia"]
)

plt.gca().invert_yaxis()

plt.title("Importancia de las Variables")
plt.xlabel("Importancia")
plt.ylabel("Variables")

plt.tight_layout()
plt.show()