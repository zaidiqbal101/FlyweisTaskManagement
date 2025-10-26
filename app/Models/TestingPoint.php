<?php

// app/Models/TestingPoint.php (new model)

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestingPoint extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'description',
        'passed',
        'remark',
        'tester_name',
        'added_date',
        'manager_remark',
    ];

    protected $casts = [
        'passed' => 'boolean',
        'added_date' => 'date',
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}