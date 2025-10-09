<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('recursos', function (Blueprint $table) {
        $table->id();

        // Autor del recurso (usuario/estudiante que sube)
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

        // Clasificación
        $table->foreignId('asignatura_id')->constrained('asignaturas')->cascadeOnDelete();
        $table->foreignId('tema_id')->constrained('temas')->cascadeOnDelete();

        // Metadatos del recurso
        $table->string('titulo');
        $table->text('descripcion')->nullable();
        $table->string('tipo_archivo');     // pdf, video, link, etc.
        $table->string('ruta')->nullable(); // path local o URL pública
        $table->timestamp('fecha_subida')->useCurrent();

        // Índices útiles para búsquedas
        $table->index(['asignatura_id', 'tema_id']);
        $table->index('titulo');

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
