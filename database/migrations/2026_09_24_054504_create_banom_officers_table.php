<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('banom_officers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('banom_id');
            $table->foreign('banom_id')->references('id')->on('banoms')->cascadeOnDelete();
            $table->string('photo')->nullable();
            $table->string('name');
            $table->string('position');
            $table->string('period')->nullable();
            $table->string('status')->default('aktif');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banom_officers');
    }
};
