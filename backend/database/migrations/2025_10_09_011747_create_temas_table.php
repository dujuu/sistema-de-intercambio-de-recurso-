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
    Schema::create('temas', function (Blueprint $table) {
        $table->id();
        $table->foreignId('asignatura_id')->constrained('asignaturas')->cascadeOnDelete();
        $table->string('nombre_tema');                 // p.ej. Derivadas
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('temas');
    }
};
