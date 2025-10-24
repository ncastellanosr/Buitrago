@echo off
setlocal enabledelayedexpansion

REM levantar el servicio de docker y mysql 
REM los datos que se muestran a continuación son los defacto en el docker-compose.yml, no cambiar en el archivo .yml o Fzta
set "MYSQL_CONTAINER=mysql-5.7"
set "MYSQL_ROOT_PASSWORD=UNAL0987"
set "MYSQL_USER=admin"
set "MYSQL_PASSWORD=UNAL1234"
set "MYSQL_DATABASE=UBudget_db"

REM Verficar archivo SQL (to do, conectar base de datos aquí)
if "%~1"=="" (
  set "SQL_FILE=init.sql"
) else (
  set "SQL_FILE=%~1"
)
REM Llamamos a docker compose para incializar la imagen de MYSQL
docker-compose up -d

echo Esperando a que MySQL esté listo...
:wait_mysql
REM Ejecutar base de datos
docker exec -i "%MYSQL_CONTAINER%" mysqladmin ping -h 127.0.0.1 -uroot -p"%MYSQL_ROOT_PASSWORD%" --silent >nul 2>&1
if errorlevel 1 (
  timeout /t 1 >nul
  goto wait_mysql
)
echo MySQL listo.
REM Importar SQL si existe
if exist "%SQL_FILE%" (
  echo Importando %SQL_FILE% en %MYSQL_DATABASE%...
  type "%SQL_FILE%" | docker exec -i "%MYSQL_CONTAINER%" mysql -u"%MYSQL_USER%" -p"%MYSQL_PASSWORD%" "%MYSQL_DATABASE%"
  echo Importación completa.
) else (
  echo No se encontro %SQL_FILE%. Omitiendo import.
)
REM Instalación de dependencias (En trabajo futuro)

REM Realización de testing (En trabajo futuro)

endlocal