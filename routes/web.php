<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ManagerController;
use App\Http\Controllers\DeveloperController;
use App\Http\Controllers\ClientController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('CalendarDashboard');
})->name('calendar.dashboard');

Route::get('/manager', [ManagerController::class, 'index'])->name('manager');
Route::get('/task/{id}', [ManagerController::class, 'show'])->name('task.details');

Route::post('/manager/add-employee', [ManagerController::class, 'storeEmployee'])->name('manager.addEmployee');
Route::post('/manager/add-client', [ManagerController::class, 'storeClient'])->name('manager.addClient');
Route::post('/manager/add-task', [ManagerController::class, 'storeTask'])->name('manager.addTask');
Route::put('/task/{id}', [ManagerController::class, 'update'])->name('task.update');

Route::get('/client', [ClientController::class, 'index'])->name('client');

Route::prefix('developer')->name('developer.')->group(function () {
    Route::get('/', [DeveloperController::class, 'index'])->name('index');
    Route::put('/task/{id}', [DeveloperController::class, 'updateTask'])->name('task.update');
});

Route::get('/tester', function () {
    return Inertia::render('Tester');
})->name('tester');

Route::get('/employees/frontend', function () {
    return Inertia::render('FrontendDevelopers');
})->name('employees.frontend');

Route::get('/employees/backend', function () {
    return Inertia::render('BackendDevelopers');
})->name('employees.backend');

Route::get('/employees/ui-ux', function () {
    return Inertia::render('UiUxDesigners');
})->name('employees.uiux');

Route::get('/employees/graphics', function () {
    return Inertia::render('GraphicsDesigners');
})->name('employees.graphics');

Route::get('/todo', function () {
    return Inertia::render('Todo');
})->name('todo');

Route::get('/chat', function () {
    return Inertia::render('Chat');
})->name('chat');
