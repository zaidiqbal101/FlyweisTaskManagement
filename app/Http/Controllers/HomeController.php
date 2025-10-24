<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;

class HomeController extends Controller
{
   public function index(){
    return Inertia::render('Page1');
   }
   public function UserList(){
      $users=User::all();
      return Inertia::render('UserList',[
       'users'=>$users
      ]);
   }
  public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|min:6',
    ]);

    User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return redirect()->back()->with('success', 'User created successfully!');
}

   public function destroy($id){
      $user=User::findOrFail($id);
      $user->delete();
      return redirect()->back()->with('success','User deleted successfully');
   }
}
