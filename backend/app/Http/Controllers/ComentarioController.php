<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    public function store(Request $r, $recursoId)
    {
        $data = $r->validate([
            'descripcion'=>'required|string'
        ]);
        return Comentario::create([
            'user_id'=>$r->user()->id,
            'recurso_id'=>$recursoId,
            'descripcion'=>$data['descripcion']
        ]);
    }
}
