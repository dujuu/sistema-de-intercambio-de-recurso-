<?php

namespace App\Http\Controllers;

use App\Models\Asignatura;
use Illuminate\Http\Request;

class AsignaturaController extends Controller
{
    public function index()
    {
        return Asignatura::select('id','codigo','nombre_asignatura')->orderBy('nombre_asignatura')->get();
    }


    public function store(Request $r)
    {
        $this->authorizeAdmin($r->user());
        $data = $r->validate([
            'codigo'=>'nullable|string|max:50',
            'nombre_asignatura'=>'required|string|max:255'
        ]);
        return Asignatura::create($data);
    }

    private function authorizeAdmin($user)
    {
        if(!$user || ($user->rol ?? 'estudiante') !== 'admin') abort(403,'Solo admin');
    }
}
