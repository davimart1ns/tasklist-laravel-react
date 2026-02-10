<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TaskListController;
use App\Models\TaskList;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // rotas para Tasklists (CRUD completo)
    Route::resource('tasklists', TaskListController::class);
    Route::post('/tasklists/{tasklist}/duplicate', [TaskListController::class, 'duplicate'])->name('tasklists.duplicate');

    // rotas para as Tasks
    Route::resource('tasks', TaskController::class);

    // rota para marcar tarefa como concluida
    Route::post('/tasks/{task}/toggle', [TaskController::class, 'toggle'])->name('tasks.toggle');
    });

    Route::get('/debug-tasklist/{tasklist}', function(\App\Models\TaskList $tasklist) {
    dd($tasklist);
});

require __DIR__.'/auth.php';
