#!/usr/bin/env bash

#revisar archivo .env antes de inicializar el docker.
llave=1
verificar_llaves(){
if [ -e llave.env ]
then
    echo "llave docker encontrada"
else
    llave=0
    echo "no se encontró la llave del docker, ubicar en Buitrago/."
fi
if [ -e Proyecto/Backend/.env ]
then
    echo "llave TypeORM encontrada"
else
    llave=0
    echo "no se encontró la llave de TypeORM, ubicar en Buitrago/Proyecto/Backend"
fi
if [ -e Proyecto/Frontend/.env ]
then
    echo "llave API encontrada"
else 
    llave=0
    echo "no se encontró la llave del API, ubicar en Buitrago/Proyecto/Frontend"
fi
}

isntalar_dependencias(){
    if [ "$llave" -ne 1 ]
    then
        return
    else
        echo "Instalado dependencias"
        cd Proyecto/Backend
        npm install
        cd ../Frontend
        npm install
    fi    
}

inciar_docker(){
    if [ "$llave" -ne 1 ]
    then
        return
    else
        echo "Iniciando docker"
        cd ..
        cd ..
        docker-compose up
    fi
}

verificar_llaves
isntalar_dependencias
inciar_docker

#   cd Proyecto
#   npm install
#   npm run dev
