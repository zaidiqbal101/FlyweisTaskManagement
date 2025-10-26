<?php

// database/migrations/2025_10_26_175010_create_todo_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('todo', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->boolean('completed')->default(false);
            $table->date('due_date')->nullable();
            $table->time('due_time')->nullable();
            $table->enum('priority', ['High', 'Medium', 'Low'])->default('Medium');
            $table->timestamps(); // This creates created_at and updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('todo');
    }
};