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
    Schema::create('asignaturas', function (Blueprint $table) {
        $table->id();
        $table->string('codigo')->nullable();          // p.ej. CAL1
        $table->string('nombre_asignatura');           // p.ej. Cálculo I
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignaturas');
    }
};
