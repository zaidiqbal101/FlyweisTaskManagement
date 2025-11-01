<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Employee;
use App\Models\Client;
use App\Models\TaskDetail;

class DeveloperController extends Controller
{
    public function index()
    {
        // Get all employees with their tasks, clients, and task details
        // Remove the category filter to get all employees
        $developers = Employee::with(['tasks' => function ($query) {
            $query->with(['client', 'detail'])
                  ->orderBy('status')
                  ->orderBy('due');
        }])
        ->get() // Get all employees regardless of category
        ->map(function ($developer) {
            return [
                'id' => $developer->id,
                'name' => $developer->name,
                'category' => $developer->category,
                'sub_category' => $developer->sub_category,
                'manager' => $developer->manager,
                'total_tasks' => $developer->tasks->count(),
                'active_tasks' => $developer->tasks->where('status', 'active')->count(),
                'completed_tasks' => $developer->tasks->where('status', 'completed')->count(),
                'pending_tasks' => $developer->tasks->where('status', 'pending')->count(),
                'tasks' => $developer->tasks->map(function ($task) {
                    return [
                        'id' => $task->id,
                        'task' => $task->task,
                        'status' => $task->status,
                        'due' => $task->due ? $task->due->format('Y-m-d') : null,
                        'expected_timeline' => $task->expected_timeline ? $task->expected_timeline->format('Y-m-d') : null,
                        'client' => $task->client ? [
                            'id' => $task->client->id,
                            'name' => $task->client->name,
                        ] : null,
                        'detail' => $task->detail,
                    ];
                }),
            ];
        });

        // Summary statistics
        $summary = [
            'total_developers' => $developers->count(),
            'total_tasks' => $developers->sum('total_tasks'),
            'total_active_tasks' => $developers->sum('active_tasks'),
            'total_completed_tasks' => $developers->sum('completed_tasks'),
            'developers_with_tasks' => $developers->where('total_tasks', '>', 0)->count(),
        ];

        return Inertia::render('Developer', [
            'developers' => $developers,
            'summary' => $summary,
        ]);
    }
}