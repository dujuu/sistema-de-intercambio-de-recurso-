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
    Schema::create('calificaciones', function (Illuminate\Database\Schema\Blueprint $table) {
        $table->id();

        // Quién califica
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

        // Qué recurso califica
        $table->foreignId('recurso_id')->constrained('recursos')->cascadeOnDelete();

        // 1..5 (puedes ajustar a tu escala)
        $table->unsignedTinyInteger('puntaje');

        $table->timestamp('fecha_calificacion')->useCurrent();

        // Asegura una sola calificación por usuario/recurso
        $table->unique(['user_id', 'recurso_id']);

        // Índices útiles
        $table->index(['recurso_id', 'puntaje']);

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calificacions');
    }
};
