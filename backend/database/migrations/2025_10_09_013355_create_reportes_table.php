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
    Schema::create('reportes', function (Illuminate\Database\Schema\Blueprint $table) {
        $table->id();

        // Quién reporta
        $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();

        // Qué recurso es reportado
        $table->foreignId('recurso_id')->constrained('recursos')->cascadeOnDelete();

        // Detalle del reporte
        $table->text('descripcion_reporte');

        // Estado de moderación
        $table->string('estado')->default('pendiente'); // pendiente|aprobado|rechazado

        $table->timestamp('fecha_reporte')->useCurrent();

        // Índices útiles
        $table->index(['recurso_id', 'estado']);
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reportes');
    }
};
