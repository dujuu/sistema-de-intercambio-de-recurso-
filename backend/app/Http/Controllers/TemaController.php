<?php

namespace App\Http\Controllers;

use App\Models\Tema;
use App\Models\Asignatura;
use Illuminate\Http\Request;

class TemaController extends Controller
{
    public function index(Request $r)
    {
        // opcional: listar por asignatura si envían ?asignatura_id=
        return Tema::when($r->asignatura_id, fn($q)=>$q->where('asignatura_id',$r->asignatura_id))
                   ->orderBy('nombre_tema')->get();
    }

    public function byAsignatura($asignaturaId)
    {
        return Tema::where('asignatura_id',$asignaturaId)->orderBy('nombre_tema')->get();
    }

    // Opcional: crear (solo admin)
    public function store(Request $r)
    {
        $this->authorizeAdmin($r->user());
        $data = $r->validate([
            'asignatura_id'=>'required|exists:asignaturas,id',
            'nombre_tema'=>'required|string|max:255'
        ]);
        return Tema::create($data);
    }

    private function authorizeAdmin($user)
    {
        if(!$user || ($user->rol ?? 'estudiante') !== 'admin') abort(403,'Solo admin');
    }
}
