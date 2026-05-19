"""Pont ASGI -> WSGI pour faire tourner FastAPI sur Passenger (N0C).

Ce fichier est ce que Passenger execute en premier sur N0C.
Il convertit l'application ASGI de FastAPI en WSGI grace a a2wsgi.
"""
import sys
import os

# Sur N0C, l'environnement virtuel est gere par le panneau.
# Assure-toi que le chemin du projet est dans sys.path.
INTERP = os.path.expanduser("~/virtualenv/api.godwin-messanhdovon.espl-angers.yt/3.11/bin/python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from a2wsgi import ASGIMiddleware
from app.main import app as asgi_app

# Passenger attend une variable nommee "application"
application = ASGIMiddleware(asgi_app)