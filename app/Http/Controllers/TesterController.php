<?php

// app/Http/Controllers/TesterController.php (updated to use new table)

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Employee;
use App\Models\Client;
use App\Models\TestingPoint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TesterController extends Controller
{
    public function index()
    {
        $tasks = Task::with(['employee', 'client', 'testingPoints'])
            ->get()
            ->map(function ($task) {
                return [
                    'id' => $task->id,
                    'task' => $task->task,
                    'developer' => $task->employee?->name ?? 'Unknown',
                    'client' => $task->client?->name ?? 'Unknown',
                    'status' => $task->status,
                    'due' => $task->due?->format('Y-m-d') ?? null,
                    'devRemark' => $task->detail?->dev_remark ?? '',
                    'clientRemark' => $task->detail?->client_remark ?? '',
                    'managerRemark' => $task->detail?->manager_remarks ?? '',
                    'testingPoints' => $task->testingPoints->map(function ($point) {
                        return [
                            'id' => $point->id,
                            'number' => $point->id, // Use id as number for simplicity
                            'description' => $point->description,
                            'passed' => $point->passed,
                            'remark' => $point->remark,
                            'testerName' => $point->tester_name,
                            'addedDate' => $point->added_date->format('Y-m-d'),
                            'managerRemark' => $point->manager_remark,
                        ];
                    }),
                    'projectedTimeline' => [
                        'devRemark' => $task->detail?->dev_remark_date ?? null,
                        'clientRemark' => $task->detail?->client_remark_date ?? null,
                    ],
                    'workNumbers' => [
                        'manager' => $task->testingPoints->count(),
                        'client' => 0, // Adjust as needed
                    ],
                    'documents' => $task->detail?->documents ?? [],
                ];
            });

        $developers = Employee::pluck('name')->unique()->values()->toArray();
        $clients = Client::pluck('name')->unique()->values()->toArray();

        return Inertia::render('Tester', [
            'tasks' => $tasks,
            'developers' => $developers,
            'clients' => $clients,
        ]);
    }

    public function storeTestingPoint(Request $request)
    {
        $validated = $request->validate([
            'taskId' => 'required|exists:tasks,id',
            'description' => 'required|string|max:1000',
            'passed' => 'boolean',
            'remark' => 'required|string|max:1000',
            'testerName' => 'required|string|max:255',
        ]);

        $testingPoint = TestingPoint::create([
            'task_id' => $validated['taskId'],
            'description' => $validated['description'],
            'passed' => $validated['passed'],
            'remark' => $validated['remark'],
            'tester_name' => $validated['testerName'],
            'added_date' => now(),
            'manager_remark' => null,
        ]);

        return redirect()->back()->with('success', 'Testing point added successfully!');
    }
}