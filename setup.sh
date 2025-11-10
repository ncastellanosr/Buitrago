#!/usr/bin/env bash

#revisar archivo .env antes de inicializar el docker.
if [ -e Proyecto/llave.env ]
then
    echo "ok, incializando proyecto."
    cd Proyecto
    docker compose up
else
    echo "Archivo .env no encontrado, poner en en la carpeta Proyecto antes de ejecutar el docker."
fi

#   cd Proyecto
#   npm install
#   npm run dev
