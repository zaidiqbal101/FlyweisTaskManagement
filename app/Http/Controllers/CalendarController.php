<?php
// app/Http/Controllers/CalendarController.php
namespace App\Http\Controllers;

use App\Models\Todo;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $tasks = Todo::all()->map(function ($task) {
            return [
                'id' => $task->id,
                'text' => $task->text,
                'completed' => $task->completed,
                'dueDate' => $task->due_date ? $task->due_date->format('Y-m-d') : null,
                'dueTime' => $task->due_time ? $task->due_time->format('H:i') : null,
                'priority' => $task->priority,
                'createdAt' => $task->created_at->toDateTimeString(),
            ];
        });

        return Inertia::render('CalendarDashboard', [
            'tasks' => $tasks,
        ]);
    }
}