<?php

// database/migrations/xxxx_xx_xx_create_testing_points_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('testing_points', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained('tasks')->onDelete('cascade');
            $table->string('description');
            $table->boolean('passed');
            $table->text('remark');
            $table->string('tester_name');
            $table->date('added_date');
            $table->text('manager_remark')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('testing_points');
    }
};