<?php

// app/Models/Todo.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Todo extends Model
{
    use HasFactory;

    protected $table = 'todo';

    protected $fillable = [
        'text',
        'completed',
        'due_date',
        'due_time',
        'priority',
        'user_id',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'date',
        'due_time' => 'datetime:H:i',
        'created_at' => 'datetime',
    ];
}