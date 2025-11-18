@echo off
setlocal enabledelayedexpansion

REM Revisar archivos .env antes de inicializar el docker.
set llave=1

:verificar_llaves
if exist "llave.env" (
    echo llave docker encontrada
) else (
    set llave=0
    echo no se encontró la llave del docker, ubicar en Buitrago/.
)

if exist "Proyecto\Backend\.env" (
    echo llave TypeORM encontrada
) else (
    set llave=0
    echo no se encontró la llave de TypeORM, ubicar en Buitrago\Proyecto\Backend
)

if exist "Proyecto\Frontend\.env" (
    echo llave API encontrada
) else (
    set llave=0
    echo no se encontró la llave del API, ubicar en Buitrago\Proyecto\Frontend
)

:instalar_dependencias
if not "!llave!" == "1" (
    goto :fin_dependencias
)
echo Instalando dependencias
cd Proyecto\Backend
npm install
cd ..\Frontend
npm install
:fin_dependencias

:iniciar_docker
if not "!llave!" == "1" (
    goto :fin_docker
)
echo Iniciando docker
cd ..\..
docker-compose up
:fin_docker

REM cd Proyecto
REM npm install
REM npm run dev