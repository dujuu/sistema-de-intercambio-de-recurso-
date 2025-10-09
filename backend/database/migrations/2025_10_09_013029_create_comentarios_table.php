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
    Schema::create('comentarios', function (Illuminate\Database\Schema\Blueprint $table) {
        $table->id();

        // Autor del comentario
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

        // Recurso comentado
        $table->foreignId('recurso_id')->constrained('recursos')->cascadeOnDelete();

        $table->text('descripcion');
        $table->timestamp('fecha_comentario')->useCurrent();

        // Índices útiles
        $table->index(['recurso_id', 'fecha_comentario']);

        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentarios');
    }
};
