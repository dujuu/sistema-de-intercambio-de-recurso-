<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asignatura extends Model
{
    // Campos que podrás asignar en create()/update()
    protected $fillable = ['codigo','nombre_asignatura'];

    // Relaciones
    public function temas()
    {
        return $this->hasMany(Tema::class);
    }

    public function recursos()
    {
        return $this->hasMany(Recurso::class);
    }
}
