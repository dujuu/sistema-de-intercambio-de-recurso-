<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    protected $fillable = [
        'user_id','recurso_id','descripcion_reporte','estado','fecha_reporte'
    ];

    protected $casts = [
        'fecha_reporte' => 'datetime',
    ];

    public function autor()   { return $this->belongsTo(User::class, 'user_id'); }
    public function recurso() { return $this->belongsTo(Recurso::class); }
}
