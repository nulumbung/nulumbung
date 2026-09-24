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
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->id();
            $table->string('brand_name')->nullable();
            $table->string('tagline')->nullable();
            $table->text('logo')->nullable();
            $table->text('favicon')->nullable();
            $table->string('mail_mailer')->nullable();
            $table->string('mail_host')->nullable();
            $table->unsignedInteger('mail_port')->nullable();
            $table->string('mail_scheme')->nullable();
            $table->string('mail_username')->nullable();
            $table->text('mail_password')->nullable();
            $table->string('mail_from_address')->nullable();
            $table->string('mail_from_name')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('contact_whatsapp')->nullable();
            $table->text('contact_address')->nullable();
            $table->string('social_facebook')->nullable();
            $table->string('social_instagram')->nullable();
            $table->string('social_youtube')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
    }
};
