<?php

namespace App\Http\Controllers;

use App\Models\Calificacion;
use Illuminate\Http\Request;

class CalificacionController extends Controller
{
    public function store(Request $r, $recursoId)
    {
        $data = $r->validate([
            'puntaje'=>'required|integer|min:1|max:5'
        ]);
        // upsert por la unique(user_id,recurso_id)
        $cal = Calificacion::updateOrCreate(
            ['user_id'=>$r->user()->id, 'recurso_id'=>$recursoId],
            ['puntaje'=>$data['puntaje']]
        );
        return $cal->load('recurso');
    }
}
