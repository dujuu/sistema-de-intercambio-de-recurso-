<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    // Campos asignables en create()/update()
    protected $fillable = ['asignatura_id','nombre_tema'];

    // Relaciones
    public function asignatura()
    {
        return $this->belongsTo(Asignatura::class);
    }

    public function recursos()
    {
        return $this->hasMany(Recurso::class);
    }
}
