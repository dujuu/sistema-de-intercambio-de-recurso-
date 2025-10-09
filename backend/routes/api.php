<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController, AsignaturaController, TemaController,
    RecursoController, ComentarioController, CalificacionController, ReporteController
};

// Auth
Route::post('/auth/register',[AuthController::class,'register']);
Route::post('/auth/login',[AuthController::class,'login']);

// Catálogo público
Route::get('/asignaturas',[AsignaturaController::class,'index']);
Route::get('/temas',[TemaController::class,'index']);
Route::get('/asignaturas/{id}/temas',[TemaController::class,'byAsignatura']);

// Recursos públicos (listado/ver)
Route::get('/recursos',[RecursoController::class,'index']);
Route::get('/recursos/{recurso}',[RecursoController::class,'show']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me',[AuthController::class,'me']);
    Route::post('/auth/logout',[AuthController::class,'logout']);

    // Crear/borrar recursos
    Route::post('/recursos',[RecursoController::class,'store']);
    Route::delete('/recursos/{recurso}',[RecursoController::class,'destroy']);

    // Comentarios / Calificaciones / Reportes
    Route::post('/recursos/{recursoId}/comentarios',[ComentarioController::class,'store']);
    Route::post('/recursos/{recursoId}/calificaciones',[CalificacionController::class,'store']);
    Route::post('/recursos/{recursoId}/reportes',[ReporteController::class,'store']);

    // Admin: crear catálogo
    Route::post('/asignaturas',[AsignaturaController::class,'store']);
    Route::post('/temas',[TemaController::class,'store']);

    // Admin: moderación
    Route::get('/reportes',[ReporteController::class,'index']);
    Route::patch('/reportes/{reporte}',[ReporteController::class,'update']);
});
