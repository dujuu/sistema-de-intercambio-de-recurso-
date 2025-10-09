<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $r)
    {
        $data = $r->validate([
            'name'=>'required',
            'email'=>'required|email|unique:users',
            'password'=>'required|min:6'
        ]);

        $user = User::create([
            'name'=>$data['name'],
            'email'=>$data['email'],
            'password'=>bcrypt($data['password']),
        ]);

        return response()->json([
            'user'=>$user,
            'token'=>$user->createToken('api')->plainTextToken
        ], 201);
    }

    public function login(Request $r)
    {
        $cred = $r->validate(['email'=>'required|email','password'=>'required']);
        if(!Auth::attempt($cred)) {
            return response()->json(['message'=>'Credenciales inválidas'], 401);
        }
        $user = User::where('email',$cred['email'])->first();
        return ['token'=>$user->createToken('api')->plainTextToken];
    }

    public function me(Request $r) { return $r->user(); }

    public function logout(Request $r)
    {
        $r->user()->currentAccessToken()->delete();
        return response()->noContent();
    }
}
