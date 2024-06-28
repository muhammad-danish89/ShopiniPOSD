<?php

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
       // Insert some stuff
        DB::table('settings')->insert(
            array(
                'id' => 1,
                'email' => 'admin@example.com',
                'currency_id' => 1,
                'client_id' => 1,
                'warehouse_id' => Null,
                'CompanyName' => 'shopinipos',
                'CompanyPhone' => '6315996770',
                'CompanyAdress' => '3618 Abia Martin Drive',
                'footer' => 'shopinipos - Ultimate Inventory With POS',
                'developed_by' => 'shopinipos',
                'logo' => 'logo-default.png',
            )
            
        );
    }
}
