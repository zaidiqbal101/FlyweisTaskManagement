<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\DeveloperController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\TesterController;
use App\Http\Controllers\TodoController;
use App\Http\Controllers\CalendarController;
use App\Http\Controllers\InOutController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [InOutController::class, 'showLogin'])->name('login');
    Route::post('/login', [InOutController::class, 'login'])->name('login.post');
    Route::get('/register', [InOutController::class, 'showRegister'])->name('register');
    Route::post('/register', [InOutController::class, 'register'])->name('register.post');
});

Route::middleware('auth')->group(function () {
Route::post('/logout', [InOutController::class, 'logout'])->name('logout');
Route::get('/', [CalendarController::class, 'index'])->name('calendar.dashboard');

Route::get('/manager', [ManagerController::class, 'index'])->name('manager');
Route::get('/task/{id}', [ManagerController::class, 'show'])->name('task.details');

Route::get('/manager', [ManagerController::class, 'index'])->name('manager.index');
Route::post('/manager/add-employee', [ManagerController::class, 'storeEmployee'])->name('manager.storeEmployee');
Route::post('/manager/add-client', [ManagerController::class, 'storeClient'])->name('manager.storeClient');
Route::post('/manager/add-task', [ManagerController::class, 'storeTask'])->name('manager.storeTask');
Route::get('/task/{id}', [ManagerController::class, 'show'])->name('manager.show');
Route::put('/task/{id}', [ManagerController::class, 'update'])->name('manager.update');
Route::delete('/manager/task/{id}', [ManagerController::class, 'destroy'])->name('manager.destroy');
//
Route::get('/client', [ClientController::class, 'index'])->name('client');
Route::get('/client/{client}', [ClientController::class, 'show'])->name('client.show');

Route::prefix('developer')->name('developer.')->group(function () {
    Route::get('/', [DeveloperController::class, 'index'])->name('index');
    Route::put('/task/{id}', [DeveloperController::class, 'updateTask'])->name('task.update');
});
Route::get('/employees/all', [EmployeeController::class, 'frontendDevelopers'])->name('employees.frontend');

Route::get('/tester', [TesterController::class, 'index'])->name('tester');
Route::post('/tester/add-issue', [TesterController::class, 'storeTestingPoint'])->name('tester.storeTestingPoint');

Route::get('/todo', [TodoController::class, 'index'])->name('todo');
Route::post('/todo', [TodoController::class, 'store'])->name('todo.store');
Route::put('/todo/{id}', [TodoController::class, 'update'])->name('todo.update');
Route::delete('/todo/{id}', [TodoController::class, 'destroy'])->name('todo.destroy');


Route::get('/chat', function () {
    return Inertia::render('Chat');
})->name('chat');

});