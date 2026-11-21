@echo off
title Subir Proyecto Defensor Espacial a GitHub - UTP
echo ========================================================
echo   SUBIENDO PROYECTO DEFENSOR ESPACIAL 2D A GITHUB
echo   Repositorio: https://github.com/Evilwizz/Practica-3-Pregunta-2.git
echo   Estudiante: Aldair Jose Lozano Santiago
echo ========================================================
echo.

set "GIT_EXE=C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\Common7\IDE\CommonExtensions\Microsoft\TeamFoundation\Team Explorer\Git\cmd\git.exe"

if not exist ".git" (
    echo Inicializando repositorio Git...
    "%GIT_EXE%" init
    "%GIT_EXE%" branch -M main
    "%GIT_EXE%" remote add origin https://github.com/Evilwizz/Practica-3-Pregunta-2.git
)

echo Agregando archivos al commit...
"%GIT_EXE%" add .

echo Creando commit...
"%GIT_EXE%" commit -m "Entrega Videojuego Defensor Espacial 2D - Multi-nivel, Sonidos, Sprites y Portada - Aldair Lozano"

echo.
echo Subiendo a la rama main...
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================================
    echo   [EXITO] Proyecto subido correctamente a tu GitHub!
    echo   Ver en: https://github.com/Evilwizz/Practica-3-Pregunta-2
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Nota: Si te solicita credenciales, inicia sesion en la
    echo   ventana emergente del navegador con tu cuenta Evilwizz
    echo ========================================================
)
echo.
pause
