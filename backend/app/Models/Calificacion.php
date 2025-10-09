<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calificacion extends Model
{
    protected $fillable = [
        'user_id','recurso_id','puntaje','fecha_calificacion'
    ];

    protected $casts = [
        'fecha_calificacion' => 'datetime',
    ];

    // Relaciones
    public function autor()   { return $this->belongsTo(User::class, 'user_id'); }
    public function recurso() { return $this->belongsTo(Recurso::class); }
}
