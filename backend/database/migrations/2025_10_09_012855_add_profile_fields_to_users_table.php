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
    Schema::table('users', function (Blueprint $table) {
      $table->string('rol')->default('estudiante'); // 'admin' | 'estudiante'
      $table->string('carrera')->nullable();
      $table->string('semestre')->nullable();
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn(['rol','carrera','semestre']);
    });
}

};
