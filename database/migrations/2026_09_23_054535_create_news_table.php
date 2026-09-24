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
        Schema::create('news', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->string('image_caption')->nullable();
            $table->longText('description')->nullable();
            $table->uuid('category_id')->nullable()->index();
            $table->foreign('category_id')->references('id')->on('categories')->nullOnDelete();
            $table->timestamp('publish_at')->nullable();
            $table->string('status')->default('draft');
            $table->string('publisher')->nullable();
            $table->boolean('is_headline')->default(false);
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_latest')->default(false);
            $table->boolean('is_newsletter')->default(false);
            $table->timestamp('newsletter_sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('news');
    }
};
