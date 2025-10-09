<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recurso extends Model
{
    protected $fillable = [
        'user_id','asignatura_id','tema_id',
        'titulo','descripcion','tipo_archivo','ruta','fecha_subida'
    ];
    public function comentarios()
{
    return $this->hasMany(\App\Models\Comentario::class);
}

    public function calificaciones()
{
    return $this->hasMany(\App\Models\Calificacion::class);
}
    public function reportes()
{
    return $this->hasMany(\App\Models\Reporte::class);
}

    public function autor()      { return $this->belongsTo(User::class, 'user_id'); }
    public function asignatura() { return $this->belongsTo(Asignatura::class); }
    public function tema()       { return $this->belongsTo(Tema::class); }
}
